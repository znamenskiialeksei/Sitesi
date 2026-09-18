// ==============================================================================
// СЕРВЕРНЫЙ ЭНДПОИНТ ДИНАМИЧЕСКОГО КОНТЕНТА GOOGLE SHEETS
// Файл: pages/api/content.js
// Назначение: Чтение в реальном времени всех текстов, авто-переводов, фото, видео,
// услуг, видеогидов и галереи напрямую из Google Таблицы с кэшированием и fallback.
// ==============================================================================

import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

// Кэш в памяти сервера для снижения нагрузки на Google Sheets API
let memoryCache = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 30 * 1000; // 30 секунд кэширования

/**
 * Обработчик запроса получения контента
 * Поддерживает GET и POST (с опцией force=true для сброса кэша)
 */
export default async function handler(req, res) {
  const isForce = req.query.force === 'true' || req.body?.force === true;
  const now = Date.now();

  // Возврат из кэша, если он актуален и не запрошен принудительный сброс
  if (!isForce && memoryCache && now - lastCacheTime < CACHE_TTL_MS) {
    return res.status(200).json({
      success: true,
      cached: true,
      cacheAgeSeconds: Math.round((now - lastCacheTime) / 1000),
      ...memoryCache
    });
  }

  const contentFilePath = path.join(process.cwd(), 'utils', 'content.json');

  // Функция чтения локального резервного JSON файла
  const readFallbackFile = () => {
    try {
      if (fs.existsSync(contentFilePath)) {
        const raw = fs.readFileSync(contentFilePath, 'utf8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('⚠️ Ошибка чтения резервного content.json:', e.message);
    }
    return { home: {}, about: {}, legal: {}, templates: {}, products: [], courses: [], gallery: [] };
  };

  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;

  // Если учетные данные Google Cloud не настроены — отдаем резервный локальный кэш
  if (
    !clientEmail ||
    !privateKey ||
    !spreadsheetId ||
    spreadsheetId === 'your_google_sheet_id' ||
    clientEmail.includes('your-service-account-email') ||
    privateKey.includes('YOUR_PRIVATE_KEY')
  ) {
    const fallbackData = readFallbackFile();
    return res.status(200).json({
      success: true,
      source: 'local_fallback',
      ...fallbackData
    });
  }

  try {
    // Универсальный парсер PEM-ключа (обрабатывает все форматы .env)
    const parsePrivateKey = (raw) => {
      if (!raw) return '';
      let key = raw.replace(/^["']|["']$/g, '');       // снять кавычки
      key = key.replace(/\\\\n/g, '\n').replace(/\\n/g, '\n'); // escaped -> реальный перенос
      key = key.replace(/\r\n/g, '\n').replace(/\r/g, '\n');   // CRLF -> LF
      return key.trim();
    };
    // Аутентификация в Google Cloud с правами чтения таблиц
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail.trim(),
        private_key: parsePrivateKey(privateKey)
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Безопасный запрос диапазона с перехватом ошибок
    const safeGet = async (range) => {
      try {
        const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });
        return response.data.values || [];
      } catch (err) {
        console.warn(`[Content API] Не удалось прочитать диапазон ${range}:`, err.message);
        return [];
      }
    };

    // Параллельное скачивание всех листов базы данных
    const [
      homeRows,
      aboutRows,
      legalRows,
      templatesRows,
      productsRows,
      coursesRows,
      galleryRows
    ] = await Promise.all([
      safeGet('HomePage!A:E'),
      safeGet('About!A:G'),
      safeGet('Legal!A:G'),
      safeGet('Templates!A:G'),
      safeGet('ExtraServices!A:Q'),
      safeGet('VideoGuides!A:Q'),
      safeGet('Gallery!A:L')
    ]);

    const content = {
      home: {},
      about: {},
      legal: {},
      templates: {},
      products: [],
      courses: [],
      gallery: []
    };

    // 1. Главная страница (HomePage)
    homeRows.slice(1).forEach((r) => {
      if (r[0]) {
        content.home[r[0]] = {
          ru: r[1] || '',
          en: r[2] || '',
          tr: r[3] || '',
          media: r[4] || ''
        };
      }
    });

    // 2. Описание виллы (About)
    aboutRows.slice(1).forEach((r) => {
      if (r[0]) {
        content.about[r[0]] = {
          title: { ru: r[1] || '', en: r[2] || '', tr: r[3] || '' },
          text: { ru: r[4] || '', en: r[5] || '', tr: r[6] || '' }
        };
      }
    });

    // 3. Юридические данные и реквизиты (Legal)
    legalRows.slice(1).forEach((r) => {
      if (r[0]) {
        content.legal[r[0]] = {
          title: { ru: r[1] || '', en: r[2] || '', tr: r[3] || '' },
          text: { ru: r[4] || '', en: r[5] || '', tr: r[6] || '' }
        };
      }
    });

    // 4. Шаблоны ответов (Templates)
    templatesRows.slice(1).forEach((r) => {
      if (r[0]) {
        if (!content.templates[r[0]]) content.templates[r[0]] = [];
        content.templates[r[0]].push({
          name: { ru: r[1] || '', en: r[2] || '', tr: r[3] || '' },
          text: { ru: r[4] || '', en: r[5] || '', tr: r[6] || '' }
        });
      }
    });

    // 5. Каталог услуг (ExtraServices)
    content.products = productsRows
      .slice(1)
      .map((r) => ({
        id: r[0],
        name: { ru: r[1] || '', en: r[3] || '', tr: r[5] || '' },
        desc: { ru: r[2] || '', en: r[4] || '', tr: r[6] || '' },
        price: { eur: r[7] || '0', rub: r[8] || '0', try: r[9] || '0' },
        images: (r[10] || '').split(',').map((s) => s.trim()).filter(Boolean),
        videos: (r[13] || '').split(',').map((s) => s.trim()).filter(Boolean),
        detailedDesc: { ru: r[14] || '', en: r[15] || '', tr: r[16] || '' },
        type: {
          ru: r[12] === 'Пакет' ? 'Пакет услуг' : 'Услуга',
          en: r[12] === 'Пакет' ? 'Service Package' : 'Service',
          tr: r[12] === 'Пакет' ? 'Hizmet Paketi' : 'Hizmet'
        }
      }))
      .filter((p) => p.id && (p.name.ru || p.name.en));

    // 6. Видео-путеводители (VideoGuides)
    content.courses = coursesRows
      .slice(1)
      .map((r) => ({
        id: r[0],
        name: { ru: r[1] || '', en: r[3] || '', tr: r[5] || '' },
        desc: { ru: r[2] || '', en: r[4] || '', tr: r[6] || '' },
        images: (r[7] || '').split(',').map((s) => s.trim()).filter(Boolean),
        module: r[8] || 'Основной',
        privateLink: r[9] || '',
        price: { eur: r[10] || '0', rub: r[11] || '0', try: r[12] || '0' },
        videos: (r[13] || '').split(',').map((s) => s.trim()).filter(Boolean),
        detailedDesc: { ru: r[14] || '', en: r[15] || '', tr: r[16] || '' },
        level: 'Для гостей'
      }))
      .filter((c) => c.id && (c.name.ru || c.name.en));

    // 7. Фото и видео галерея (Gallery)
    content.gallery = galleryRows
      .slice(1)
      .map((r) => ({
        id: r[0],
        group: { ru: r[1] || '', en: r[3] || '', tr: r[5] || '' },
        groupDesc: { ru: r[2] || '', en: r[4] || '', tr: r[6] || '' },
        type: r[7] === 'Видео' ? 'video' : 'image',
        media: (r[8] || '').split(',').map((s) => s.trim()).filter(Boolean),
        caption: { ru: r[9] || '', en: r[10] || '', tr: r[11] || '' }
      }))
      .filter((g) => g.id && g.media.length > 0);

    // Обновление кэша в памяти
    memoryCache = content;
    lastCacheTime = Date.now();

    // Асинхронная запись свежих данных в локальный файл для ISR и надежности
    try {
      fs.writeFileSync(contentFilePath, JSON.stringify(content, null, 2), 'utf8');
    } catch (writeErr) {
      console.warn('⚠️ Ошибка фонового обновления content.json:', writeErr.message);
    }

    return res.status(200).json({
      success: true,
      source: 'google_sheets_live',
      cached: false,
      ...content
    });
  } catch (err) {
    console.error('❌ Ошибка синхронизации контента с Google Sheets:', err.message);
    // При сбое отдаем надежный локальный кэш
    const fallbackData = readFallbackFile();
    return res.status(200).json({
      success: true,
      source: 'error_fallback',
      error: err.message,
      ...fallbackData
    });
  }
}


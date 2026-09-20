// ==============================================================================
// СЕРВЕРНЫЙ ЭНДПОИНТ ДИНАМИЧЕСКОГО КОНТЕНТА GOOGLE SHEETS
// Файл: pages/api/content.js
// Назначение: Чтение в реальном времени всех текстов, авто-переводов, фото, видео,
// услуг, видеогидов и галереи напрямую из Google Таблицы с кэшированием и fallback.
// ДИНАМИЧЕСКАЯ ПРИВЯЗКА: Работает через реестр sheetsRegistry по постоянным sheetId и алиасам.
// ==============================================================================

import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { getLiveSheetMap, resolveRange } from '../../utils/sheetsRegistry';
import { MASTER_ABOUT_SECTIONS, MASTER_HOME_MAP } from '../../utils/masterSeedContent';

// Очистка от битых формул Google Таблиц [#REF!, #VALUE!, #ERROR!, #N/A]
const sanitizeText = (val, fallback = '') => {
  if (!val) return fallback;
  const s = String(val).trim();
  if (s.startsWith('#REF!') || s.startsWith('#VALUE!') || s.startsWith('#ERROR!') || s.startsWith('#N/A')) {
    return fallback;
  }
  return s;
};

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

    // Динамический резолвер листов: находит актуальные имена по ID/алиасам
    const sheetMap = await getLiveSheetMap(sheets, spreadsheetId);

    // Безопасный запрос диапазона с перехватом ошибок
    const safeGet = async (key, rangeSuffix) => {
      const range = resolveRange(sheetMap, key, rangeSuffix);
      try {
        const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });
        return response.data.values || [];
      } catch (err) {
        console.warn(`[Content API] Не удалось прочитать диапазон ${range}:`, err.message);
        return [];
      }
    };

    // Параллельное скачивание всех листов базы данных через динамический маппинг
    const [
      homeRows,
      aboutRows,
      legalRows,
      templatesRows,
      productsRows,
      coursesRows,
      galleryRows
    ] = await Promise.all([
      safeGet('HOME', 'A:E'),
      safeGet('ABOUT', 'A:G'),
      safeGet('LEGAL', 'A:G'),
      safeGet('TEMPLATES', 'A:G'),
      safeGet('SERVICES', 'A:Q'),
      safeGet('GUIDES', 'A:Q'),
      safeGet('GALLERY', 'A:L')
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

    const fallbackData = readFallbackFile();

    // 1. Главная страница [HOME] с защитой от пустоты
    if (homeRows.length > 1) {
      homeRows.slice(1).forEach((r) => {
        if (r[0]) {
          content.home[r[0]] = {
            ru: sanitizeText(r[1], fallbackData.home?.[r[0]]?.ru || MASTER_HOME_MAP[r[0]]?.ru || ''),
            en: sanitizeText(r[2], fallbackData.home?.[r[0]]?.en || MASTER_HOME_MAP[r[0]]?.en || ''),
            tr: sanitizeText(r[3], fallbackData.home?.[r[0]]?.tr || MASTER_HOME_MAP[r[0]]?.tr || ''),
            media: sanitizeText(r[4], fallbackData.home?.[r[0]]?.media || MASTER_HOME_MAP[r[0]]?.media || '')
          };
        }
      });
    }
    if (Object.keys(content.home).length === 0) {
      content.home = fallbackData.home && Object.keys(fallbackData.home).length > 0
        ? fallbackData.home
        : { ...MASTER_HOME_MAP };
    }

    // 2. Описание виллы [ABOUT] с защитой от пустоты
    if (aboutRows.length > 1) {
      aboutRows.slice(1).forEach((r) => {
        if (r[0]) {
          content.about[r[0]] = {
            title: {
              ru: sanitizeText(r[1], fallbackData.about?.[r[0]]?.title?.ru || ''),
              en: sanitizeText(r[2], fallbackData.about?.[r[0]]?.title?.en || ''),
              tr: sanitizeText(r[3], fallbackData.about?.[r[0]]?.title?.tr || '')
            },
            text: {
              ru: sanitizeText(r[4], fallbackData.about?.[r[0]]?.text?.ru || ''),
              en: sanitizeText(r[5], fallbackData.about?.[r[0]]?.text?.en || ''),
              tr: sanitizeText(r[6], fallbackData.about?.[r[0]]?.text?.tr || '')
            }
          };
        }
      });
    }
    if (Object.keys(content.about).length === 0) {
      if (fallbackData.about && Object.keys(fallbackData.about).length > 0) {
        content.about = fallbackData.about;
      } else {
        MASTER_ABOUT_SECTIONS.forEach((sec) => {
          content.about[sec.id] = { title: sec.title, text: sec.text };
        });
      }
    }

    // 3. Юридические данные и реквизиты [LEGAL] с фильтрацией #REF!
    if (legalRows.length > 1) {
      legalRows.slice(1).forEach((r) => {
        if (r[0]) {
          content.legal[r[0]] = {
            title: {
              ru: sanitizeText(r[1], fallbackData.legal?.[r[0]]?.title?.ru || ''),
              en: sanitizeText(r[2], fallbackData.legal?.[r[0]]?.title?.en || ''),
              tr: sanitizeText(r[3], fallbackData.legal?.[r[0]]?.title?.tr || '')
            },
            text: {
              ru: sanitizeText(r[4], fallbackData.legal?.[r[0]]?.text?.ru || ''),
              en: sanitizeText(r[5], fallbackData.legal?.[r[0]]?.text?.en || ''),
              tr: sanitizeText(r[6], fallbackData.legal?.[r[0]]?.text?.tr || '')
            }
          };
        }
      });
    }
    if (Object.keys(content.legal).length === 0 && fallbackData.legal) {
      content.legal = fallbackData.legal;
    }

    // 4. Шаблоны ответов [TEMPLATES]
    if (templatesRows.length > 1) {
      templatesRows.slice(1).forEach((r) => {
        if (r[0]) {
          if (!content.templates[r[0]]) content.templates[r[0]] = [];
          content.templates[r[0]].push({
            name: {
              ru: sanitizeText(r[1], ''),
              en: sanitizeText(r[2], ''),
              tr: sanitizeText(r[3], '')
            },
            text: {
              ru: sanitizeText(r[4], ''),
              en: sanitizeText(r[5], ''),
              tr: sanitizeText(r[6], '')
            }
          });
        }
      });
    }
    if (Object.keys(content.templates).length === 0 && fallbackData.templates) {
      content.templates = fallbackData.templates;
    }

    // 5. Каталог услуг [SERVICES]
    if (productsRows.length > 1) {
      content.products = productsRows
        .slice(1)
        .map((r) => ({
          id: r[0],
          name: {
            ru: sanitizeText(r[1], ''),
            en: sanitizeText(r[3], ''),
            tr: sanitizeText(r[5], '')
          },
          desc: {
            ru: sanitizeText(r[2], ''),
            en: sanitizeText(r[4], ''),
            tr: sanitizeText(r[6], '')
          },
          price: { eur: r[7] || '0', rub: r[8] || '0', try: r[9] || '0' },
          images: (r[10] || '').split(',').map((s) => s.trim()).filter(Boolean),
          videos: (r[13] || '').split(',').map((s) => s.trim()).filter(Boolean),
          detailedDesc: {
            ru: sanitizeText(r[14], ''),
            en: sanitizeText(r[15], ''),
            tr: sanitizeText(r[16], '')
          },
          type: {
            ru: r[12] === 'Пакет' ? 'Пакет услуг' : 'Услуга',
            en: r[12] === 'Пакет' ? 'Service Package' : 'Service',
            tr: r[12] === 'Пакет' ? 'Hizmet Paketi' : 'Hizmet'
          }
        }))
        .filter((p) => p.id && (p.name.ru || p.name.en));
    }
    if (content.products.length === 0 && fallbackData.products?.length > 0) {
      content.products = fallbackData.products;
    }

    // 6. Видео-путеводители [GUIDES]
    if (coursesRows.length > 1) {
      content.courses = coursesRows
        .slice(1)
        .map((r) => ({
          id: r[0],
          name: {
            ru: sanitizeText(r[1], ''),
            en: sanitizeText(r[3], ''),
            tr: sanitizeText(r[5], '')
          },
          desc: {
            ru: sanitizeText(r[2], ''),
            en: sanitizeText(r[4], ''),
            tr: sanitizeText(r[6], '')
          },
          images: (r[7] || '').split(',').map((s) => s.trim()).filter(Boolean),
          module: r[8] || 'Основной',
          privateLink: r[9] || '',
          price: { eur: r[10] || '0', rub: r[11] || '0', try: r[12] || '0' },
          videos: (r[13] || '').split(',').map((s) => s.trim()).filter(Boolean),
          detailedDesc: {
            ru: sanitizeText(r[14], ''),
            en: sanitizeText(r[15], ''),
            tr: sanitizeText(r[16], '')
          },
          level: 'Для гостей'
        }))
        .filter((c) => c.id && (c.name.ru || c.name.en));
    }
    if (content.courses.length === 0 && fallbackData.courses?.length > 0) {
      content.courses = fallbackData.courses;
    }

    // 7. Фото и видео галерея [GALLERY]
    if (galleryRows.length > 1) {
      content.gallery = galleryRows
        .slice(1)
        .map((r) => ({
          id: r[0],
          group: {
            ru: sanitizeText(r[1], ''),
            en: sanitizeText(r[3], ''),
            tr: sanitizeText(r[5], '')
          },
          groupDesc: {
            ru: sanitizeText(r[2], ''),
            en: sanitizeText(r[4], ''),
            tr: sanitizeText(r[6], '')
          },
          type: r[7] === 'Видео' ? 'video' : 'image',
          media: (r[8] || '').split(',').map((s) => s.trim()).filter(Boolean),
          caption: {
            ru: sanitizeText(r[9], ''),
            en: sanitizeText(r[10], ''),
            tr: sanitizeText(r[11], '')
          }
        }))
        .filter((g) => g.id && g.media.length > 0);
    }
    if (content.gallery.length === 0 && fallbackData.gallery?.length > 0) {
      content.gallery = fallbackData.gallery;
    }

    // Обновление кэша в памяти
    memoryCache = content;
    lastCacheTime = Date.now();

    // Защищенная запись: пишем на диск только если контент не пуст
    if (Object.keys(content.home).length > 0 && Object.keys(content.about).length > 0) {
      try {
        fs.writeFileSync(contentFilePath, JSON.stringify(content, null, 2), 'utf8');
      } catch (writeErr) {
        console.warn('⚠️ Ошибка фонового обновления content.json:', writeErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      source: 'google_sheets_live',
      cached: false,
      sheetMap,
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

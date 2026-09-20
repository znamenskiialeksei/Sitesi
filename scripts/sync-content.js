// ==============================================================================
// ВЫГРУЗКА И СИНХРОНИЗАЦИЯ КОНТЕНТА ИЗ GOOGLE SHEETS
// Файл: scripts/sync-content.js
// Назначение: Парсинг таблиц описаний, услуг, путеводителей и галереи в локальный
// кэш utils/content.json для мгновенной серверной генерации страниц (SSG/ISR).
// ==============================================================================

require('dotenv').config({ path: '.env.local' });
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const { getLiveSheetMap, resolveRange } = require('../utils/sheetsRegistry');
const { MASTER_ABOUT_SECTIONS, MASTER_HOME_MAP } = require('../utils/masterSeedContent');

// Очистка от битых формул Google Таблиц [#REF!, #VALUE!, #ERROR!, #N/A]
const sanitizeText = (val, fallback = '') => {
  if (!val) return fallback;
  const s = String(val).trim();
  if (s.startsWith('#REF!') || s.startsWith('#VALUE!') || s.startsWith('#ERROR!') || s.startsWith('#N/A')) {
    return fallback;
  }
  return s;
};

const GOOGLE_SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
const contentFilePath = path.join(__dirname, '../utils/content.json');

const emptyContent = JSON.stringify(
  { home: {}, about: {}, legal: {}, templates: {}, products: [], courses: [], gallery: [] },
  null,
  2
);

async function syncContent() {
  const clientEmail = (process.env.GOOGLE_CLIENT_EMAIL || '').trim();
  const rawKey = (process.env.GOOGLE_PRIVATE_KEY || '').trim();
  const spreadsheetId = (GOOGLE_SPREADSHEET_ID || '').trim();

  // Проверка на отсутствующие или демонстрационные (placeholder) учетные данные
  const isPlaceholder =
    !clientEmail ||
    !rawKey ||
    !spreadsheetId ||
    spreadsheetId === 'your_google_sheet_id' ||
    clientEmail.includes('your-service-account-email') ||
    rawKey.includes('YOUR_PRIVATE_KEY');

  if (isPlaceholder) {
    console.log('ℹ️ В .env.local используются демонстрационные ключи Google Service Account.');
    console.log('   Витрина работает на полном предустановленном контенте utils/content.json.');
    console.log('   Для синхронизации с Google Sheets укажите реальный Service Account (client_email и private_key) в .env.local.');
    return;
  }

  // Универсальный парсер PEM-ключа: обрабатывает все форматы .env файла
  // (escaped \\n, literal \n, двойное экранирование, кавычки, CRLF)
  const parsePrivateKey = (raw) => {
    if (!raw) return '';
    let key = raw;
    key = key.replace(/^["']|["']$/g, '');
    key = key.replace(/\\\\n/g, '\n').replace(/\\n/g, '\n');
    key = key.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    return key.trim();
  };

  const parsedKey = parsePrivateKey(rawKey);

  // Дополнительная валидация PEM структуры перед передачей в OpenSSL
  if (!parsedKey.includes('-----BEGIN PRIVATE KEY-----') || parsedKey.length < 200) {
    console.warn('⚠️ GOOGLE_PRIVATE_KEY в .env.local не является валидным PEM-ключом RSA.');
    console.warn('   Существующий контент в utils/content.json сохранен без изменений.');
    return;
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: parsedKey
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Динамический резолвер структуры листов по sheetId и алиасам
    const sheetMap = await getLiveSheetMap(sheets, spreadsheetId);

    let existingContent = {};
    try {
      if (fs.existsSync(contentFilePath)) {
        existingContent = JSON.parse(fs.readFileSync(contentFilePath, 'utf8'));
      }
    } catch (_) { }

    const content = {
      home: existingContent.home || {},
      about: existingContent.about || {},
      legal: existingContent.legal || {},
      templates: existingContent.templates || {},
      products: existingContent.products || [],
      courses: existingContent.courses || [],
      gallery: existingContent.gallery || []
    };

    let fetchSuccessCount = 0;

    const safeGet = async (range) => {
      try {
        const res = await sheets.spreadsheets.values.get({ spreadsheetId, range });
        if (res.data && res.data.values && res.data.values.length > 0) fetchSuccessCount++;
        return res;
      } catch (e) {
        console.warn(`- Не удалось получить данные для диапазона ${range}:`, e.message);
        return { data: { values: [] } };
      }
    };

    console.log('Синхронизация контента (Главная, О вилле, Юридический блок, Шаблоны)...');

    // 1. Главная страница [Hero и базовые заголовки]
    const homeData = await safeGet(resolveRange(sheetMap, 'HOME', 'A:E'));
    if (homeData.data.values && homeData.data.values.length > 1) {
      homeData.data.values.slice(1).forEach((r) => {
        if (r[0]) {
          content.home[r[0]] = {
            ru: sanitizeText(r[1], existingContent.home?.[r[0]]?.ru || MASTER_HOME_MAP[r[0]]?.ru || ''),
            en: sanitizeText(r[2], existingContent.home?.[r[0]]?.en || MASTER_HOME_MAP[r[0]]?.en || ''),
            tr: sanitizeText(r[3], existingContent.home?.[r[0]]?.tr || MASTER_HOME_MAP[r[0]]?.tr || ''),
            media: sanitizeText(r[4], existingContent.home?.[r[0]]?.media || MASTER_HOME_MAP[r[0]]?.media || '')
          };
        }
      });
    }
    if (Object.keys(content.home).length === 0) {
      content.home = existingContent.home && Object.keys(existingContent.home).length > 0
        ? existingContent.home
        : { ...MASTER_HOME_MAP };
    }

    // 2. Описание виллы, юридические документы, шаблоны CRM
    const aboutData = await safeGet(resolveRange(sheetMap, 'ABOUT', 'A:G'));
    const legalData = await safeGet(resolveRange(sheetMap, 'LEGAL', 'A:G'));
    const templatesData = await safeGet(resolveRange(sheetMap, 'TEMPLATES', 'A:G'));

    if (aboutData.data.values && aboutData.data.values.length > 1) {
      aboutData.data.values.slice(1).forEach((r) => {
        if (r[0]) {
          content.about[r[0]] = {
            title: {
              ru: sanitizeText(r[1], existingContent.about?.[r[0]]?.title?.ru || ''),
              en: sanitizeText(r[2], existingContent.about?.[r[0]]?.title?.en || ''),
              tr: sanitizeText(r[3], existingContent.about?.[r[0]]?.title?.tr || '')
            },
            text: {
              ru: sanitizeText(r[4], existingContent.about?.[r[0]]?.text?.ru || ''),
              en: sanitizeText(r[5], existingContent.about?.[r[0]]?.text?.en || ''),
              tr: sanitizeText(r[6], existingContent.about?.[r[0]]?.text?.tr || '')
            }
          };
        }
      });
    }
    if (Object.keys(content.about).length === 0) {
      if (existingContent.about && Object.keys(existingContent.about).length > 0) {
        content.about = existingContent.about;
      } else {
        MASTER_ABOUT_SECTIONS.forEach((sec) => {
          content.about[sec.id] = { title: sec.title, text: sec.text };
        });
      }
    }

    if (legalData.data.values && legalData.data.values.length > 1) {
      legalData.data.values.slice(1).forEach((r) => {
        if (r[0]) {
          content.legal[r[0]] = {
            title: {
              ru: sanitizeText(r[1], existingContent.legal?.[r[0]]?.title?.ru || ''),
              en: sanitizeText(r[2], existingContent.legal?.[r[0]]?.title?.en || ''),
              tr: sanitizeText(r[3], existingContent.legal?.[r[0]]?.title?.tr || '')
            },
            text: {
              ru: sanitizeText(r[4], existingContent.legal?.[r[0]]?.text?.ru || ''),
              en: sanitizeText(r[5], existingContent.legal?.[r[0]]?.text?.en || ''),
              tr: sanitizeText(r[6], existingContent.legal?.[r[0]]?.text?.tr || '')
            }
          };
        }
      });
    }

    if (templatesData.data.values && templatesData.data.values.length > 1) {
      templatesData.data.values.slice(1).forEach((r) => {
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

    // 3. Каталог дополнительных услуг (трансферы, аренда яхт, шеф-повар)
    console.log('Синхронизация услуг и видео-гидов...');
    const productsSheet = await safeGet(resolveRange(sheetMap, 'SERVICES', 'A:Q'));
    content.products = (productsSheet.data.values || [])
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
      .filter((p) => p.id && p.name.ru);

    // 4. Авторские видео-путеводители по Дальяну
    const coursesSheet = await safeGet(resolveRange(sheetMap, 'GUIDES', 'A:Q'));
    content.courses = (coursesSheet.data.values || [])
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
      .filter((c) => c.id && c.name.ru);

    // 5. Фотогалерея виллы
    const gallerySheet = await safeGet(resolveRange(sheetMap, 'GALLERY', 'A:L'));
    content.gallery = (gallerySheet.data.values || [])
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

// Сохранение обновленного JSON файла только при успешном получении данных и валидном контенте
if (fetchSuccessCount > 0 && Object.keys(content.home).length > 0 && Object.keys(content.about).length > 0) {
  fs.writeFileSync(contentFilePath, JSON.stringify(content, null, 2), 'utf8');
  console.log(`✅ Контент успешно синхронизирован [${fetchSuccessCount} листов] и сохранен в utils/content.json`);
} else {
  console.warn('⚠️ Не удалось прочитать данные с Google Sheets либо контент пуст. Локальный кэш сохранен.');
}
  } catch (err) {
  console.error('Ошибка синхронизации контента:', err.message);
  console.warn('Локальный кэш utils/content.json сохранен без изменений.');
}
}

syncContent();


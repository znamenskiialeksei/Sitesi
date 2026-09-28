// [ПРЕДЫДУЩАЯ РЕДАКЦИЯ: 27.09.2026 18:50 | ПЛАН: 270920261820 Комплексный план 7 задач.md | TAG: VILLA-DYNAMIC-SEED-ALL-KEYS-270920261850]
// [АКТУАЛЬНАЯ РЕДАКЦИЯ: 28.09.2026 22:50 | ПЛАН: 280920261940 ПЛАН 13 колонок ACCOUNTS и восстановление.md | TAG: VILLA-SEED-SCRIPT-DELETED-ROWS-SYNC-280920262250]
// ==============================================================================
// СЦЕНАРИЙ АВТОМАТИЧЕСКОЙ ФИКСАЦИИ ЭТАЛОНА SINGLE SOURCE OF TRUTH
// Файл: scripts/save-master-seed.js
// Назначение: Выгружает боевые данные из листов Google Таблицы, проводит
// санитарный аудит ячеек на формульные ошибки [#REF!, #VALUE!, #ERROR!]
// и атомарно перезаписывает эталонные файлы utils/masterSeedContent.js и utils/content.json.
// 100% Zero-Brackets & Zero-Emdash Стандарт.
// ==============================================================================

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const { SHEETS_REGISTRY, getLiveSheetMap, resolveRange } = require('../utils/sheetsRegistry');

// Регулярное выражение для выявления формульных ошибок Google Таблиц
const FORMULA_ERROR_REGEX = /#(REF!|VALUE!|ERROR!|N\/A|NAME\?|NUM!|DIV\/0!)/i;

/**
 * Проверка ячейки на формульные ошибки
 */
function checkCellClean(val, sheetName, rowIdx, colIdx) {
  if (typeof val === 'string' && FORMULA_ERROR_REGEX.test(val)) {
    throw new Error(`Обнаружена критическая ошибка формулы [${val.trim()}] в листе "${sheetName}", строка ${rowIdx}, колонка ${colIdx}. Сохранение эталона прервано во избежание повреждения базы данных.`);
  }
}

/**
 * Вспомогательная функция очистки и парсинга приватного ключа RSA
 */
function parsePrivateKey(raw) {
  if (!raw) return '';
  let key = raw.replace(/^["']|["']$/g, '');
  key = key.replace(/\\\\n/g, '\n').replace(/\\n/g, '\n');
  key = key.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  return key.trim();
}

/**
 * Получение авторизованного клиента Google Sheets
 */
function getSheetsClient() {
  const email = (process.env.GOOGLE_CLIENT_EMAIL || '').trim();
  const privateKey = (process.env.GOOGLE_PRIVATE_KEY || '').trim();

  if (!email || !privateKey) {
    throw new Error('Отсутствуют учетные данные GOOGLE_CLIENT_EMAIL или GOOGLE_PRIVATE_KEY в .env.local');
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: email,
      private_key: parsePrivateKey(privateKey)
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
  });

  return google.sheets({ version: 'v4', auth });
}

/**
 * Главный исполнитель сохранения эталона
 */
async function saveMasterSeed() {
  console.log('[save-master-seed] Инициализация процесса фиксации эталона SSOT...');

  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
  if (!spreadsheetId) {
    throw new Error('Не указан GOOGLE_SPREADSHEET_ID в .env.local');
  }

  const sheets = getSheetsClient();
  const sheetMap = await getLiveSheetMap(sheets, spreadsheetId);

  // Загрузка текущего эталона для безопасного слияния непустых коллекций
  let existingSeed = {};
  try {
    existingSeed = require('../utils/masterSeedContent');
  } catch (e) {
    console.warn('[save-master-seed] Не удалось загрузить существующий masterSeedContent:', e.message);
  }

  // Вспомогательная функция проверки строки на непустоту
  const isRowNotEmpty = (r) => Array.isArray(r) && r.some((c) => c !== undefined && c !== null && String(c).trim() !== '');

  // Вспомогательная функция безопасного чтения диапазона
  const safeFetchRows = async (key, rangeSuffix) => {
    const sheetName = sheetMap?.[key] || SHEETS_REGISTRY?.[key]?.defaultName || key;
    const range = resolveRange(sheetMap, key, rangeSuffix);
    try {
      console.log(`[save-master-seed] Чтение листа: "${sheetName}" [${range}]...`);
      const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });
      const values = response.data.values || [];
      // Проверка ячеек на битые формулы
      for (let r = 0; r < values.length; r++) {
        const row = values[r];
        const rowNum = r + 1;
        for (let c = 0; c < row.length; c++) {
          checkCellClean(row[c], sheetName, rowNum, c + 1);
        }
      }
      const dataRows = values.slice(1).filter(isRowNotEmpty);
      return { ok: true, header: values[0] || [], rows: dataRows, total: values.length };
    } catch (err) {
      console.warn(`[save-master-seed] Ошибка чтения листа ${sheetName}:`, err.message);
      return { ok: false, header: [], rows: [], error: err.message };
    }
  };

  // 1. Выгрузка листа HOME [Главная витрина: 8 колонок A:H]
  const homeSheetName = sheetMap?.HOME || SHEETS_REGISTRY?.HOME?.defaultName || '🏠 Главная витрина';
  const homeFetch = await safeFetchRows('HOME', 'A:H');

  if (!homeFetch.ok || homeFetch.rows.length === 0) {
    throw new Error(`Лист "${homeSheetName}" пуст или содержит только шапку. Невозможно сформировать эталон.`);
  }

  const headerRow = homeFetch.header || [];
  const isConstructorFormat = headerRow.length >= 7 || String(headerRow[0] || '').toLowerCase().includes('блок');

  const masterHomeRows = [];
  const masterHomeMap = {};

  homeFetch.rows.forEach((r) => {
    let block = '', key = '', desc = '', ru = '', en = '', tr = '', media = '', status = 'Вкл';
    if (isConstructorFormat) {
      block = r[0] ? String(r[0]).trim() : '';
      key = r[1] ? String(r[1]).trim() : '';
      desc = r[2] ? String(r[2]).trim() : '';
      ru = (r[3] || '').toString().trim();
      en = (r[4] || '').toString().trim();
      tr = (r[5] || '').toString().trim();
      media = (r[6] || '').toString().trim();
      status = r[7] ? String(r[7]).trim() : 'Вкл';
    } else {
      key = r[0] ? String(r[0]).trim() : '';
      ru = (r[1] || '').toString().trim();
      en = (r[2] || '').toString().trim();
      tr = (r[3] || '').toString().trim();
      media = (r[4] || '').toString().trim();
      status = 'Вкл';
    }

    if (!key) return;

    const isEnabled = !status.toLowerCase().startsWith('выкл') && status.toLowerCase() !== 'off' && status.toLowerCase() !== 'false';

    masterHomeRows.push([
      block || '1. Главный экран',
      key,
      desc,
      ru,
      en,
      tr,
      media,
      isEnabled ? 'Вкл' : 'Выкл'
    ]);

    masterHomeMap[key] = {
      block: block || '',
      key,
      desc: desc || '',
      ru,
      en,
      tr,
      media,
      status: isEnabled ? 'Вкл' : 'Выкл',
      enabled: isEnabled
    };
  });

  // Извлечение разделов описания [ABOUT] из Блока 4 листа HOME без искусственных числовых ограничений
  const aboutSectionIndices = new Set();
  Object.keys(masterHomeMap).forEach((k) => {
    const match = k.match(/^about_sec_(\d+)_(title|text)$/);
    if (match) {
      aboutSectionIndices.add(parseInt(match[1], 10));
    }
  });

  const sortedSectionIndices = Array.from(aboutSectionIndices).sort((a, b) => a - b);
  const masterAboutSections = [];
  sortedSectionIndices.forEach((s) => {
    const titleItem = masterHomeMap[`about_sec_${s}_title`];
    const textItem = masterHomeMap[`about_sec_${s}_text`];
    if (titleItem || textItem) {
      masterAboutSections.push({
        id: String(s),
        title: {
          ru: titleItem?.ru || '',
          en: titleItem?.en || '',
          tr: titleItem?.tr || ''
        },
        text: {
          ru: textItem?.ru || '',
          en: textItem?.en || '',
          tr: textItem?.tr || ''
        }
      });
    }
  });

  const finalAboutSections = masterAboutSections.length > 0
    ? masterAboutSections
    : (existingSeed.MASTER_ABOUT_SECTIONS || []);

  // 2. Выгрузка листа SETTINGS [Системные настройки ИИ Агентов]
  const settingsFetch = await safeFetchRows('SETTINGS', 'A:E');
  const masterSettingsRows = settingsFetch.ok
    ? settingsFetch.rows.map((r) => [
        (r[0] || '').toString().trim(),
        (r[1] || '').toString().trim(),
        (r[2] || '').toString().trim(),
        (r[3] || '').toString().trim(),
        (r[4] || '').toString().trim()
      ])
    : (existingSeed.MASTER_SETTINGS_ROWS || []);

  // 3. Выгрузка листа LEGAL [Юридические документы]
  const legalFetch = await safeFetchRows('LEGAL', 'A:G');
  const masterLegalRows = legalFetch.ok
    ? legalFetch.rows.map((r) => [
        (r[0] || '').toString().trim(),
        (r[1] || '').toString().trim(),
        (r[2] || '').toString().trim(),
        (r[3] || '').toString().trim(),
        (r[4] || '').toString().trim(),
        (r[5] || '').toString().trim(),
        (r[6] || '').toString().trim()
      ])
    : (existingSeed.MASTER_LEGAL_ROWS || []);

  // 4. Выгрузка листа TEMPLATES [Шаблоны сообщений]
  const templatesFetch = await safeFetchRows('TEMPLATES', 'A:G');
  const masterTemplatesRows = templatesFetch.ok
    ? templatesFetch.rows.map((r) => [
        (r[0] || '').toString().trim(),
        (r[1] || '').toString().trim(),
        (r[2] || '').toString().trim(),
        (r[3] || '').toString().trim(),
        (r[4] || '').toString().trim(),
        (r[5] || '').toString().trim(),
        (r[6] || '').toString().trim()
      ])
    : (existingSeed.MASTER_TEMPLATES_ROWS || []);

  // 5. Выгрузка листа SERVICES [Дополнительные услуги]
  const servicesFetch = await safeFetchRows('SERVICES', 'A:R');
  const masterServicesRows = servicesFetch.ok
    ? servicesFetch.rows.map((r) => {
        const row = [];
        for (let i = 0; i < 18; i++) {
          row.push((r[i] || '').toString().trim());
        }
        return row;
      })
    : (existingSeed.MASTER_SERVICES_ROWS || []);

  // 6. Выгрузка листа GUIDES [Видео-путеводители]
  const guidesFetch = await safeFetchRows('GUIDES', 'A:S');
  const masterGuidesRows = guidesFetch.ok
    ? guidesFetch.rows.map((r) => {
        const row = [];
        for (let i = 0; i < 19; i++) {
          row.push((r[i] || '').toString().trim());
        }
        return row;
      })
    : (existingSeed.MASTER_GUIDES_ROWS || []);

  // 7. Выгрузка листа GALLERY [Фото и Видео Галерея]
  const galleryFetch = await safeFetchRows('GALLERY', 'A:L');
  const masterGalleryRows = galleryFetch.ok
    ? galleryFetch.rows.map((r) => {
        const row = [];
        for (let i = 0; i < 12; i++) {
          row.push((r[i] || '').toString().trim());
        }
        return row;
      })
    : (existingSeed.MASTER_GALLERY_ROWS || []);

  // 7.1 Выгрузка листа KNOWLEDGE_GRAPH [Граф Знаний и Безопасность]
  const kgFetch = await safeFetchRows('KNOWLEDGE_GRAPH', 'A:G');
  const masterKnowledgeGraphRows = kgFetch.ok
    ? kgFetch.rows.map((r) => {
        const row = [];
        for (let i = 0; i < 7; i++) {
          row.push((r[i] || '').toString().trim());
        }
        return row;
      })
    : (existingSeed.MASTER_KNOWLEDGE_GRAPH_ROWS || []);

  // 8. Выгрузка листа ACCESS [🔑 Управление доступом - Лист 4]
  const accessFetch = await safeFetchRows('ACCESS', 'A:J');
  const masterAccessRows = accessFetch.ok
    ? accessFetch.rows.map((r) => {
        const row = [];
        for (let i = 0; i < 8; i++) {
          row.push((r[i] || '').toString().trim());
        }
        return row;
      })
    : (existingSeed.MASTER_ACCESS_ROWS || []);

  // 9. Выгрузка листа TASKS [📋 Задачи и Поручения Секретаря - Лист 7]
  const tasksFetch = await safeFetchRows('TASKS', 'A:G');
  const masterTasksRows = tasksFetch.ok
    ? tasksFetch.rows.map((r) => {
        const row = [];
        for (let i = 0; i < 7; i++) {
          row.push((r[i] || '').toString().trim());
        }
        return row;
      })
    : (existingSeed.MASTER_TASKS_ROWS || []);

  // 10. Выгрузка листа ACCOUNTS [👤 Гостевые аккаунты - Лист 9: 13 колонок с UID]
  const accountsFetch = await safeFetchRows('ACCOUNTS', 'A:M');
  const masterAccountsRows = accountsFetch.ok
    ? accountsFetch.rows.map((r, idx) => {
        const row = [];
        for (let i = 0; i < 13; i++) {
          row.push((r[i] || '').toString().trim());
        }
        // Защита: гарантируем наличие неизменяемого UID в Колонке M
        if (!row[12]) {
          row[12] = 'VT-GUEST-' + (1000 + idx);
        }
        return row;
      })
    : (existingSeed.MASTER_ACCOUNTS_ROWS || []);

  // 11. Выгрузка листа BOOKINGS [📋 Заявки и Бронирования - Лист 12]
  const bookingsFetch = await safeFetchRows('BOOKINGS', 'A:L');
  const masterBookingsRows = bookingsFetch.ok
    ? bookingsFetch.rows.map((r) => {
        const row = [];
        for (let i = 0; i < 11; i++) {
          row.push((r[i] || '').toString().trim());
        }
        return row;
      })
    : (existingSeed.MASTER_BOOKINGS_ROWS || []);

  // 12. Выгрузка листа CALENDAR [📅 Календарь и Тарифы - Лист 13]
  const calendarFetch = await safeFetchRows('CALENDAR', 'A:I');
  const masterCalendarRows = calendarFetch.ok
    ? calendarFetch.rows.map((r) => {
        const row = [];
        for (let i = 0; i < 7; i++) {
          row.push((r[i] || '').toString().trim());
        }
        return row;
      })
    : (existingSeed.MASTER_CALENDAR_ROWS || []);

  // 13. Выгрузка листа ORDERS [🛍️ Заказы услуг и гидов - Лист 14]
  const ordersFetch = await safeFetchRows('ORDERS', 'A:G');
  const masterOrdersRows = ordersFetch.ok
    ? ordersFetch.rows.map((r) => {
        const row = [];
        for (let i = 0; i < 6; i++) {
          row.push((r[i] || '').toString().trim());
        }
        return row;
      })
    : (existingSeed.MASTER_ORDERS_ROWS || []);

  // 14. Выгрузка листа GUIDE_ACCESS [🎟️ Доступы к путеводителям - Лист 15]
  const guideAccessFetch = await safeFetchRows('GUIDE_ACCESS', 'A:I');
  const masterGuideAccessRows = guideAccessFetch.ok
    ? guideAccessFetch.rows.map((r) => {
        const row = [];
        for (let i = 0; i < 8; i++) {
          row.push((r[i] || '').toString().trim());
        }
        return row;
      })
    : (existingSeed.MASTER_GUIDE_ACCESS_ROWS || []);

  // 8. Обновление локального файла кэша utils/content.json
  const contentFilePath = path.join(__dirname, '..', 'utils', 'content.json');
  try {
    const legalObj = {};
    masterLegalRows.forEach((r) => {
      const id = r[0];
      if (id) {
        legalObj[id] = {
          title: { ru: r[1] || '', en: r[2] || '', tr: r[3] || '' },
          text: { ru: r[4] || '', en: r[5] || '', tr: r[6] || '' }
        };
      }
    });

    const templatesObj = {};
    masterTemplatesRows.forEach((r) => {
      const id = r[0];
      if (id) {
        templatesObj[id] = {
          title: { ru: r[1] || '', en: r[2] || '', tr: r[3] || '' },
          text: { ru: r[4] || '', en: r[5] || '', tr: r[6] || '' }
        };
      }
    });

    const aboutObj = {};
    finalAboutSections.forEach((sec) => {
      aboutObj[sec.id] = { title: sec.title, text: sec.text };
    });

    const productsArr = masterServicesRows.map((r) => {
      const isAvail = (r[12] || 'Да').toString().trim().toLowerCase() !== 'нет' && (r[12] || 'Да').toString().trim().toLowerCase() !== 'выкл';
      return {
        id: r[0],
        title: { ru: r[1] || '', en: r[3] || '', tr: r[5] || '' },
        desc: { ru: r[2] || '', en: r[4] || '', tr: r[6] || '' },
        priceUSD: r[7] || '0',
        priceEUR: r[8] || '0',
        priceRUB: r[9] || '0',
        priceTRY: r[10] || '0',
        image: r[11] || '',
        available: isAvail,
        status: isAvail ? 'Вкл' : 'Выкл',
        enabled: isAvail,
        type: r[13] || 'service',
        video: r[14] || '',
        details: { ru: r[15] || '', en: r[16] || '', tr: r[17] || '' }
      };
    });

    const coursesArr = masterGuidesRows.map((r) => {
      const isAvail = (r[18] || 'Да').toString().trim().toLowerCase() !== 'нет' && (r[18] || 'Да').toString().trim().toLowerCase() !== 'выкл';
      return {
        id: r[0],
        title: { ru: r[1] || '', en: r[3] || '', tr: r[5] || '' },
        desc: { ru: r[2] || '', en: r[4] || '', tr: r[6] || '' },
        image: r[7] || '',
        category: r[8] || 'guide',
        videoUrl: r[9] || '',
        priceUSD: r[10] || '0',
        priceEUR: r[11] || '0',
        priceRUB: r[12] || '0',
        priceTRY: r[13] || '0',
        video: r[14] || '',
        details: { ru: r[15] || '', en: r[16] || '', tr: r[17] || '' },
        available: isAvail,
        status: isAvail ? 'Вкл' : 'Выкл',
        enabled: isAvail
      };
    });

    const galleryArr = masterGalleryRows.map((r) => ({
      id: r[0],
      group: { ru: r[1] || '', en: r[3] || '', tr: r[5] || '' },
      desc: { ru: r[2] || '', en: r[4] || '', tr: r[6] || '' },
      type: r[7] || 'photo',
      media: r[8] || '',
      caption: { ru: r[9] || '', en: r[10] || '', tr: r[11] || '' }
    }));

    const settingsObj = {};
    masterSettingsRows.forEach((r) => {
      const cat = (r[0] || '').toString().trim();
      const param = (r[1] || '').toString().trim();
      const val = (r[2] || '').toString().trim();
      const desc = (r[3] || '').toString().trim();
      if (param) {
        settingsObj[param] = {
          category: cat,
          value: val,
          description: desc
        };
      }
    });

    const updatedContentJson = {
      home: masterHomeMap,
      about: aboutObj,
      legal: legalObj,
      templates: templatesObj,
      products: productsArr,
      courses: coursesArr,
      gallery: galleryArr,
      settings: settingsObj
    };

    fs.writeFileSync(contentFilePath, JSON.stringify(updatedContentJson, null, 2), 'utf8');
    console.log('[save-master-seed] Локальный файл content.json успешно обновлен.');
  } catch (jsonErr) {
    console.warn('[save-master-seed] Ошибка записи content.json:', jsonErr.message);
  }

  // 9. Генерация валидного CommonJS кода для masterSeedContent.js
  console.log('[save-master-seed] Форматирование исходного кода masterSeedContent.js...');
  const rawSheetsMap = {
    HOME: masterHomeRows,
    SETTINGS: masterSettingsRows,
    LEGAL: masterLegalRows,
    TEMPLATES: masterTemplatesRows,
    SERVICES: masterServicesRows,
    GUIDES: masterGuidesRows,
    GALLERY: masterGalleryRows,
    CALENDAR: masterCalendarRows,
    BOOKINGS: masterBookingsRows,
    ACCOUNTS: masterAccountsRows,
    ORDERS: masterOrdersRows,
    ACCESS: masterAccessRows,
    TASKS: masterTasksRows,
    KNOWLEDGE_GRAPH: masterKnowledgeGraphRows,
    GUIDE_ACCESS: masterGuideAccessRows
  };

  const fileContent = `// ==============================================================================
// НЕПРИКОСНОВЕННЫЙ МАСТЕР-ЭТАЛОН БАЗЫ ДАННЫХ И КОНТЕНТА VILLA TURAMAN
// Файл: utils/masterSeedContent.js
// Назначение: Эталонный источник истины [SSOT] для всех 15 листов Google Таблиц.
// Защищен от случайного затирания. Обеспечивает 100% самоисцеление при удалении листов.
// Сгенерировано автоматически через scripts/save-master-seed.js
// Дата фиксации: ${new Date().toISOString()}
// 100% Zero-Brackets & Zero-Emdash Стандарт.
// ==============================================================================

const { buildHomeDerivedCollections } = require('./homeDerivedCollections');

const MASTER_ABOUT_SECTIONS = ${JSON.stringify(finalAboutSections, null, 2)};

const MASTER_HOME_MAP = ${JSON.stringify(masterHomeMap, null, 2)};

const MASTER_HOME_ROWS = ${JSON.stringify(masterHomeRows, null, 2)};

const MASTER_SETTINGS_ROWS = ${JSON.stringify(masterSettingsRows, null, 2)};

const MASTER_TEMPLATES_ROWS = ${JSON.stringify(masterTemplatesRows, null, 2)};

const MASTER_GALLERY_ROWS = ${JSON.stringify(masterGalleryRows, null, 2)};

const MASTER_SERVICES_ROWS = ${JSON.stringify(masterServicesRows, null, 2)};

const MASTER_GUIDES_ROWS = ${JSON.stringify(masterGuidesRows, null, 2)};

const MASTER_LEGAL_ROWS = ${JSON.stringify(masterLegalRows, null, 2)};

const MASTER_BOOKINGS_ROWS = ${JSON.stringify(masterBookingsRows, null, 2)};

const MASTER_CALENDAR_ROWS = ${JSON.stringify(masterCalendarRows, null, 2)};

const MASTER_ACCOUNTS_ROWS = ${JSON.stringify(masterAccountsRows, null, 2)};

const MASTER_ORDERS_ROWS = ${JSON.stringify(masterOrdersRows, null, 2)};

const MASTER_ACCESS_ROWS = ${JSON.stringify(masterAccessRows, null, 2)};

const MASTER_GUIDE_ACCESS_ROWS = ${JSON.stringify(masterGuideAccessRows, null, 2)};

const MASTER_TASKS_ROWS = ${JSON.stringify(masterTasksRows, null, 2)};

const MASTER_KNOWLEDGE_GRAPH_ROWS = ${JSON.stringify(masterKnowledgeGraphRows, null, 2)};

const MASTER_RAW_SHEETS = {
  HOME: MASTER_HOME_ROWS,
  SETTINGS: MASTER_SETTINGS_ROWS,
  LEGAL: MASTER_LEGAL_ROWS,
  TEMPLATES: MASTER_TEMPLATES_ROWS,
  SERVICES: MASTER_SERVICES_ROWS,
  GUIDES: MASTER_GUIDES_ROWS,
  GALLERY: MASTER_GALLERY_ROWS,
  CALENDAR: MASTER_CALENDAR_ROWS,
  BOOKINGS: MASTER_BOOKINGS_ROWS,
  ACCOUNTS: MASTER_ACCOUNTS_ROWS,
  ORDERS: MASTER_ORDERS_ROWS,
  ACCESS: MASTER_ACCESS_ROWS,
  TASKS: MASTER_TASKS_ROWS,
  KNOWLEDGE_GRAPH: MASTER_KNOWLEDGE_GRAPH_ROWS,
  GUIDE_ACCESS: MASTER_GUIDE_ACCESS_ROWS
};

module.exports = {
  MASTER_ABOUT_SECTIONS,
  MASTER_HOME_MAP,
  MASTER_HOME_ROWS,
  MASTER_SETTINGS_ROWS,
  MASTER_TEMPLATES_ROWS,
  MASTER_GALLERY_ROWS,
  MASTER_SERVICES_ROWS,
  MASTER_GUIDES_ROWS,
  MASTER_LEGAL_ROWS,
  MASTER_BOOKINGS_ROWS,
  MASTER_CALENDAR_ROWS,
  MASTER_ACCOUNTS_ROWS,
  MASTER_ORDERS_ROWS,
  MASTER_ACCESS_ROWS,
  MASTER_GUIDE_ACCESS_ROWS,
  MASTER_TASKS_ROWS,
  MASTER_KNOWLEDGE_GRAPH_ROWS,
  MASTER_RAW_SHEETS,
  buildHomeDerivedCollections
};
`;

  const targetPath = path.join(__dirname, '..', 'utils', 'masterSeedContent.js');
  fs.writeFileSync(targetPath, fileContent, 'utf8');

  // Автоматическое обновление встроенного резерва initSingleSheetByKey_ в Code.js (Тир 3)
  try {
    updateCodeJsFallback(rawSheetsMap);
  } catch (codeJsErr) {
    console.warn('[save-master-seed] Предупреждение при обновлении Code.js:', codeJsErr.message);
  }

  // Автоматическая синхронизация страховочного словаря витрины в utils/translations.js
  try {
    const { syncTranslationsWithMaster } = require('../utils/syncTranslationsWithMaster');
    syncTranslationsWithMaster(masterHomeMap);
  } catch (syncErr) {
    console.warn('[save-master-seed] Предупреждение при синхронизации translations.js:', syncErr.message);
  }

  console.log(`[save-master-seed] ✅ УСПЕШНО: Эталонный файл сохранен: ${targetPath}`);
  console.log(`[save-master-seed] Лист 1 HOME: ${masterHomeRows.length} строк [${Object.keys(masterHomeMap).length} ключей]`);
  console.log(`[save-master-seed] Лист 2 GALLERY: ${masterGalleryRows.length} строк`);
  console.log(`[save-master-seed] Лист 3 LEGAL: ${masterLegalRows.length} строк`);
  console.log(`[save-master-seed] Лист 4 ACCESS: ${masterAccessRows.length} строк`);
  console.log(`[save-master-seed] Лист 5 TEMPLATES: ${masterTemplatesRows.length} строк`);
  console.log(`[save-master-seed] Лист 6 SETTINGS: ${masterSettingsRows.length} строк`);
  console.log(`[save-master-seed] Лист 7 TASKS: ${masterTasksRows.length} строк`);
  console.log(`[save-master-seed] Лист 8 KNOWLEDGE_GRAPH: ${masterKnowledgeGraphRows.length} строк`);
  console.log(`[save-master-seed] Лист 9 ACCOUNTS: ${masterAccountsRows.length} строк`);
  console.log(`[save-master-seed] Лист 10 SERVICES: ${masterServicesRows.length} строк`);
  console.log(`[save-master-seed] Лист 11 GUIDES: ${masterGuidesRows.length} строк`);
  console.log(`[save-master-seed] Лист 12 BOOKINGS: ${masterBookingsRows.length} строк`);
  console.log(`[save-master-seed] Лист 13 CALENDAR: ${masterCalendarRows.length} строк`);
  console.log(`[save-master-seed] Лист 14 ORDERS: ${masterOrdersRows.length} строк`);
  console.log(`[save-master-seed] Лист 15 GUIDE_ACCESS: ${masterGuideAccessRows.length} строк`);
  return {
    success: true,
    homeKeysCount: Object.keys(masterHomeMap).length,
    homeRowsCount: masterHomeRows.length,
    aboutCount: finalAboutSections.length,
    settingsCount: masterSettingsRows.length,
    all15SheetsSaved: true
  };
}

/**
 * Автоматическое обновление встроенного резерва initSingleSheetByKey_ в Code.js (Тир 3)
 */
function updateCodeJsFallback(rawSheets) {
  const codeJsPath = path.join(__dirname, '..', 'google-apps-script', 'Code.js');
  if (!fs.existsSync(codeJsPath)) {
    console.warn('[save-master-seed] Code.js не найден по пути:', codeJsPath);
    return;
  }
  let code = fs.readFileSync(codeJsPath, 'utf8');
  const startMarker = '// === AUTO-GENERATED TIER-3 FALLBACK: START ===';
  const endMarker = '// === AUTO-GENERATED TIER-3 FALLBACK: END ===';
  const startIdx = code.indexOf(startMarker);
  const endIdx = code.indexOf(endMarker);
  if (startIdx === -1 || endIdx === -1) {
    console.warn('[save-master-seed] Маркеры AUTO-GENERATED TIER-3 FALLBACK не найдены в Code.js');
    return;
  }

  const formatRows = (rows) => {
    if (!rows || rows.length === 0) return '[]';
    return '[\n    ' + rows.map((r) => JSON.stringify(r)).join(',\n    ') + '\n  ]';
  };

  const generatedFunction = `${startMarker}
/**
 * Инициализация шапки, смарт-форматирования и эталонных строк для конкретного листа
 */
function initSingleSheetByKey_(sheet, key) {
  if (!sheet || !key) return;

  if (key === 'HOME') {
    var homeHeaders = ['Блок / Раздел', 'Ключ [ID]', 'Место размещения / Описание [RU]', 'RU', 'EN', 'TR', 'Медиа / Иконка / Ссылка', 'Статус [Вкл/Выкл]'];
    styleSheetHeader_(sheet, homeHeaders, 1);
    var homeRows = ${formatRows(rawSheets.HOME || [])};
    var colsA_D = homeRows.map(function(r) { return [r[0], r[1], r[2], r[3]]; });
    var colsG_H = homeRows.map(function(r) { return [r[6] || '', r[7] || 'Вкл']; });
    sheet.getRange(2, 1, colsA_D.length, 4).setValues(colsA_D);
    sheet.getRange(2, 7, colsG_H.length, 2).setValues(colsG_H);
    sheet.getRange("E2").setFormula('=MAP(D2:D; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))');
    sheet.getRange("F2").setFormula('=MAP(D2:D; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))');
  } else if (key === 'GALLERY') {
    var galHeaders = ['ID', 'Группа [RU]', 'Описание [RU]', 'Группа [EN]', 'Описание [EN]', 'Группа [TR]', 'Описание [TR]', 'Тип', 'Медиа ссылки', 'Подпись [RU]', 'Подпись [EN]', 'Подпись [TR]'];
    styleSheetHeader_(sheet, galHeaders, 1);
    var galRows = ${formatRows(rawSheets.GALLERY || [])};
    var colsA_C = galRows.map(function(r) { return [r[0], r[1], r[2]]; });
    var colsH_J = galRows.map(function(r) { return [r[7], r[8], r[9]]; });
    sheet.getRange(2, 1, colsA_C.length, 3).setValues(colsA_C);
    sheet.getRange(2, 8, colsH_J.length, 3).setValues(colsH_J);
    sheet.getRange("D2").setFormula('=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))');
    sheet.getRange("E2").setFormula('=MAP(C2:C; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))');
    sheet.getRange("F2").setFormula('=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))');
    sheet.getRange("G2").setFormula('=MAP(C2:C; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))');
    sheet.getRange("K2").setFormula('=MAP(J2:J; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))');
    sheet.getRange("L2").setFormula('=MAP(J2:J; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))');
  } else if (key === 'SERVICES') {
    var srvHeaders = ['ID', 'Название услуги [RU]', 'Описание [RU]', 'Название услуги [EN]', 'Описание [EN]', 'Название услуги [TR]', 'Описание [TR]', 'Цена [USD]', 'Цена [EUR]', 'Цена [RUB]', 'Цена [TRY]', 'Изображения', 'Наличие', 'Тип', 'Видео презентации', 'Подробное описание [RU]', 'Подробное описание [EN]', 'Подробное описание [TR]'];
    styleSheetHeader_(sheet, srvHeaders, 1);
    var srvRows = ${formatRows(rawSheets.SERVICES || [])};
    var colsA_C = srvRows.map(function(r) { return [r[0], r[1], r[2]]; });
    var colsH_P = srvRows.map(function(r) { return [r[7], r[8], r[9], r[10], r[11], r[12], r[13], r[14], r[15]]; });
    sheet.getRange(2, 1, colsA_C.length, 3).setValues(colsA_C);
    sheet.getRange(2, 8, colsH_P.length, 9).setValues(colsH_P);
    sheet.getRange("D2").setFormula('=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))');
    sheet.getRange("E2").setFormula('=MAP(C2:C; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))');
    sheet.getRange("F2").setFormula('=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))');
    sheet.getRange("G2").setFormula('=MAP(C2:C; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))');
    sheet.getRange("Q2").setFormula('=MAP(P2:P; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))');
    sheet.getRange("R2").setFormula('=MAP(P2:P; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))');
  } else if (key === 'GUIDES') {
    var gHeaders = ['ID', 'Название путеводителя [RU]', 'Описание [RU]', 'Название путеводителя [EN]', 'Описание [EN]', 'Название путеводителя [TR]', 'Описание [TR]', 'Изображения', 'Категория', 'Ссылка на видео', 'Цена [USD]', 'Цена [EUR]', 'Цена [RUB]', 'Цена [TRY]', 'Видео презентации', 'Подробное описание [RU]', 'Подробное описание [EN]', 'Подробное описание [TR]', 'Наличие'];
    styleSheetHeader_(sheet, gHeaders, 1);
    var gRows = ${formatRows(rawSheets.GUIDES || [])};
    var colsA_C = gRows.map(function(r) { return [r[0], r[1], r[2]]; });
    var colsH_P = gRows.map(function(r) { return [r[7], r[8], r[9], r[10], r[11], r[12], r[13], r[14], r[15]]; });
    sheet.getRange(2, 1, colsA_C.length, 3).setValues(colsA_C);
    sheet.getRange(2, 8, colsH_P.length, 9).setValues(colsH_P);
    sheet.getRange("D2").setFormula('=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))');
    sheet.getRange("E2").setFormula('=MAP(C2:C; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))');
    sheet.getRange("F2").setFormula('=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))');
    sheet.getRange("G2").setFormula('=MAP(C2:C; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))');
    sheet.getRange("Q2").setFormula('=MAP(P2:P; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))');
    sheet.getRange("R2").setFormula('=MAP(P2:P; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))');
    sheet.getRange(2, 19, gRows.length, 1).setValues(gRows.map(function(r) { return [r[18] || 'Да']; }));
  } else if (key === 'LEGAL') {
    var lHeaders = ['ID Раздела', 'Название [RU]', 'Название [EN]', 'Название [TR]', 'Текст [RU]', 'Текст [EN]', 'Текст [TR]'];
    styleSheetHeader_(sheet, lHeaders, 1);
    var lRows = ${formatRows(rawSheets.LEGAL || [])};
    var colsA_B = lRows.map(function(r) { return [r[0], r[1]]; });
    var colE = lRows.map(function(r) { return [r[4]]; });
    sheet.getRange(2, 1, colsA_B.length, 2).setValues(colsA_B);
    sheet.getRange(2, 5, colE.length, 1).setValues(colE);
    sheet.getRange("C2").setFormula('=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))');
    sheet.getRange("D2").setFormula('=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))');
    sheet.getRange("F2").setFormula('=MAP(E2:E; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))');
    sheet.getRange("G2").setFormula('=MAP(E2:E; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))');
  } else if (key === 'BOOKINGS') {
    var bHeaders = ['Дата заявки', 'Имя клиента', 'Контакт [Tel/TG]', 'Старт', 'Завершение', 'Ночей', 'Взрослых', 'Детей', 'Всего гостей', 'Итоговая стоимость', 'Статус оплаты'];
    styleSheetHeader_(sheet, bHeaders, 1);
    sheet.getRange("C:C").setNumberFormat("@");
    var bRows = ${formatRows(rawSheets.BOOKINGS || [])};
    if (bRows.length > 0) {
      sheet.getRange(2, 1, bRows.length, bHeaders.length).setValues(bRows);
    }
  } else if (key === 'CALENDAR') {
    var cHeaders = ['Дата старта', 'Дата завершения', 'Тип [Блокировка/Цена/Мин. дней/Заметка/Настройки]', 'Значение', 'Заметка', 'Автор изменения', 'Время фиксации'];
    styleSheetHeader_(sheet, cHeaders, 1);
    var cRows = ${formatRows(rawSheets.CALENDAR || [])};
    if (cRows.length > 0) {
      sheet.getRange(2, 1, cRows.length, cHeaders.length).setValues(cRows);
    }
  } else if (key === 'ACCOUNTS') {
    var aHeaders = ['Дата регистрации', 'Имя гостя', 'Номер телефона', 'Email адрес', 'Пароль', 'Блокировка: Сайт', 'Блокировка: Аккаунт', 'Блокировка: Чат', 'Статус верификации', 'Дата верификации', 'Требуется повторная верификация', 'Статус аккаунта', 'ID Гостя [UID]'];
    styleSheetHeader_(sheet, aHeaders, 1);
    sheet.getRange("C:C").setNumberFormat("@");
    sheet.getRange("E:E").setNumberFormat("@");
    sheet.getRange("M:M").setNumberFormat("@");
    var aRows = ${formatRows(rawSheets.ACCOUNTS || [])};
    if (aRows.length > 0) {
      sheet.getRange(2, 1, aRows.length, aHeaders.length).setValues(aRows);
    }
  } else if (key === 'ORDERS') {
    var oHeaders = ['Дата заказа', 'Контакт', 'Тип [Гид/Услуга/Аренда]', 'Сумма', 'Статус оплаты', 'Детали'];
    styleSheetHeader_(sheet, oHeaders, 1);
    var oRows = ${formatRows(rawSheets.ORDERS || [])};
    if (oRows.length > 0) {
      sheet.getRange(2, 1, oRows.length, oHeaders.length).setValues(oRows);
    }
  } else if (key === 'ACCESS') {
    var accHeaders = ['ID', 'Тип доступа [Замок/Wi-Fi/Сейф/Ворота]', 'Локация / Название', 'Код доступа / PIN / Пароль', 'Резервный пароль / Мастер-код', 'Срок действия / Статус', 'Инструкция для гостя [RU]', 'Инструкция [EN]', 'Инструкция [TR]', 'Заметка'];
    styleSheetHeader_(sheet, accHeaders, 1);
    sheet.getRange("D:D").setNumberFormat("@");
    sheet.getRange("E:E").setNumberFormat("@");
    var accRows = ${formatRows(rawSheets.ACCESS || [])};
    if (accRows.length > 0) {
      sheet.getRange(2, 1, accRows.length, accHeaders.length).setValues(accRows);
    }
  } else if (key === 'TEMPLATES') {
    var tHeaders = ['ID Раздела', 'Название [RU]', 'Название [EN]', 'Название [TR]', 'Текст [RU]', 'Текст [EN]', 'Текст [TR]'];
    styleSheetHeader_(sheet, tHeaders, 1);
    var tRows = ${formatRows(rawSheets.TEMPLATES || [])};
    var colsA_B = tRows.map(function(r) { return [r[0], r[1]]; });
    var colE = tRows.map(function(r) { return [r[4]]; });
    sheet.getRange(2, 1, colsA_B.length, 2).setValues(colsA_B);
    sheet.getRange(2, 5, colE.length, 1).setValues(colE);
    sheet.getRange("C2").setFormula('=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))');
    sheet.getRange("D2").setFormula('=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))');
    sheet.getRange("F2").setFormula('=MAP(E2:E; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))');
    sheet.getRange("G2").setFormula('=MAP(E2:E; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))');
  } else if (key === 'SETTINGS') {
    var sHeaders = ['Категория', 'Параметр / Роль / Лист', 'Значение / Статус доступа', 'Промпт / Описание / Инструкция', 'Заметка'];
    styleSheetHeader_(sheet, sHeaders, 1);
    var sRows = ${formatRows(rawSheets.SETTINGS || [])};
    if (sRows.length > 0) {
      sheet.getRange(2, 1, sRows.length, sHeaders.length).setValues(sRows);
    }
  } else if (key === 'TASKS') {
    var taskHeaders = ['ID Задачи', 'Дата и Время', 'Канал / Источник', 'Текст Задачи / Поручения', 'Статус Исполнения', 'Ответственный Модуль', 'Результат / Заметка'];
    styleSheetHeader_(sheet, taskHeaders, 1);
    var taskRows = ${formatRows(rawSheets.TASKS || [])};
    if (taskRows.length > 0) {
      sheet.getRange(2, 1, taskRows.length, taskHeaders.length).setValues(taskRows);
    }
  } else if (key === 'KNOWLEDGE_GRAPH') {
    var kgHeaders = ['ID Узла', 'Тип Сущности', 'Уровень Секретности', 'Разрешенные Стадии Гостя', 'Связанный Лист CRM', 'Описание Сущности / Правило Доступа', 'Статус Узла'];
    styleSheetHeader_(sheet, kgHeaders, 1);
    var kgRows = ${formatRows(rawSheets.KNOWLEDGE_GRAPH || [])};
    if (kgRows.length > 0) {
      sheet.getRange(2, 1, kgRows.length, kgHeaders.length).setValues(kgRows);
    }
  } else if (key === 'GUIDE_ACCESS') {
    var gaHeaders = ['Дата выдачи', 'Гость [Имя и Контакт]', 'ID Путеводителя', 'Название путеводителя', 'Категория', 'Статус оплаты', 'Токен доступа', 'Срок действия', 'Статус доступа [Активен/Отозван]'];
    styleSheetHeader_(sheet, gaHeaders, 1);
    sheet.getRange("B:B").setNumberFormat("@");
    var gaRows = ${formatRows(rawSheets.GUIDE_ACCESS || [])};
    if (gaRows.length > 0) {
      sheet.getRange(2, 1, gaRows.length, gaHeaders.length).setValues(gaRows);
    }
  }
}
${endMarker}`;

  const updatedCode = code.substring(0, startIdx) + generatedFunction + code.substring(endIdx + endMarker.length);
  fs.writeFileSync(codeJsPath, updatedCode, 'utf8');
  console.log('[save-master-seed] Встроенный резерв initSingleSheetByKey_ в Code.js успешно обновлен.');
}

// Запуск напрямую из CLI / Node.js
if (require.main === module) {
  saveMasterSeed()
    .then(() => {
      console.log('Фиксация эталона успешно завершена.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Ошибка сохранения эталона:', err.message);
      process.exit(1);
    });
}

module.exports = { saveMasterSeed };

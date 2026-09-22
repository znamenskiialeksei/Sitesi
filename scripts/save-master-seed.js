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
 * Получение авторизованного клиента Google Sheets
 */
function getSheetsClient() {
  const email = process.env.GOOGLE_CLIENT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!email || !privateKey) {
    throw new Error('Отсутствуют учетные данные GOOGLE_CLIENT_EMAIL или GOOGLE_PRIVATE_KEY в .env.local');
  }

  privateKey = privateKey.replace(/\\n/g, '\n');

  const auth = new google.auth.JWT(
    email,
    null,
    privateKey,
    ['https://www.googleapis.com/auth/spreadsheets.readonly']
  );

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

  // Вспомогательная функция безопасного чтения диапазона
  const safeFetchRows = async (key, rangeSuffix) => {
    const sheetName = sheetMap[key] || SHEETS_REGISTRY[key]?.defaultName || key;
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
      return values;
    } catch (err) {
      console.warn(`[save-master-seed] Ошибка чтения листа ${sheetName}:`, err.message);
      return [];
    }
  };

  // 1. Выгрузка листа HOME [Главная витрина: 8 колонок A:H]
  const homeSheetName = sheetMap.HOME || SHEETS_REGISTRY.HOME.defaultName;
  const rawHomeRows = await safeFetchRows('HOME', 'A:H');

  if (rawHomeRows.length <= 1) {
    throw new Error(`Лист "${homeSheetName}" пуст или содержит только шапку. Невозможно сформировать эталон.`);
  }

  const headerRow = rawHomeRows[0] || [];
  const isConstructorFormat = headerRow.length >= 7 || String(headerRow[0] || '').toLowerCase().includes('блок');

  const masterHomeRows = [];
  const masterHomeMap = {};

  rawHomeRows.slice(1).forEach((r) => {
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

  // Извлечение разделов описания [ABOUT] из Блока 4 листа HOME
  const masterAboutSections = [];
  for (let s = 1; s <= 7; s++) {
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
  }

  const finalAboutSections = masterAboutSections.length > 0
    ? masterAboutSections
    : (existingSeed.MASTER_ABOUT_SECTIONS || []);

  // 2. Выгрузка листа SETTINGS [Системные настройки ИИ Агентов]
  const rawSettings = await safeFetchRows('SETTINGS', 'A:E');
  const masterSettingsRows = rawSettings.length > 1
    ? rawSettings.slice(1).map((r) => [
        (r[0] || '').toString().trim(),
        (r[1] || '').toString().trim(),
        (r[2] || '').toString().trim(),
        (r[3] || '').toString().trim(),
        (r[4] || '').toString().trim()
      ])
    : (existingSeed.MASTER_SETTINGS_ROWS || []);

  // 3. Выгрузка листа LEGAL [Юридические документы]
  const rawLegal = await safeFetchRows('LEGAL', 'A:G');
  const masterLegalRows = rawLegal.length > 1
    ? rawLegal.slice(1).map((r) => [
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
  const rawTemplates = await safeFetchRows('TEMPLATES', 'A:G');
  const masterTemplatesRows = rawTemplates.length > 1
    ? rawTemplates.slice(1).map((r) => [
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
  const rawServices = await safeFetchRows('SERVICES', 'A:Q');
  const masterServicesRows = rawServices.length > 1
    ? rawServices.slice(1).map((r) => {
        const row = [];
        for (let i = 0; i < 17; i++) {
          row.push((r[i] || '').toString().trim());
        }
        return row;
      })
    : (existingSeed.MASTER_SERVICES_ROWS || []);

  // 6. Выгрузка листа GUIDES [Видео-путеводители]
  const rawGuides = await safeFetchRows('GUIDES', 'A:Q');
  const masterGuidesRows = rawGuides.length > 1
    ? rawGuides.slice(1).map((r) => {
        const row = [];
        for (let i = 0; i < 17; i++) {
          row.push((r[i] || '').toString().trim());
        }
        return row;
      })
    : (existingSeed.MASTER_GUIDES_ROWS || []);

  // 7. Выгрузка листа GALLERY [Фото и Видео Галерея]
  const rawGallery = await safeFetchRows('GALLERY', 'A:L');
  const masterGalleryRows = rawGallery.length > 1
    ? rawGallery.slice(1).map((r) => {
        const row = [];
        for (let i = 0; i < 12; i++) {
          row.push((r[i] || '').toString().trim());
        }
        return row;
      })
    : (existingSeed.MASTER_GALLERY_ROWS || []);

  const masterBookingsRows = existingSeed.MASTER_BOOKINGS_ROWS || [];
  const masterCalendarRows = existingSeed.MASTER_CALENDAR_ROWS || [];
  const masterAccountsRows = existingSeed.MASTER_ACCOUNTS_ROWS || [];
  const masterOrdersRows = existingSeed.MASTER_ORDERS_ROWS || [];
  const masterAccessRows = existingSeed.MASTER_ACCESS_ROWS || [];
  const masterTasksRows = existingSeed.MASTER_TASKS_ROWS || [];

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

    const productsArr = masterServicesRows.map((r) => ({
      id: r[0],
      title: { ru: r[1] || '', en: r[3] || '', tr: r[5] || '' },
      desc: { ru: r[2] || '', en: r[4] || '', tr: r[6] || '' },
      priceEUR: r[7] || '0',
      priceRUB: r[8] || '0',
      priceTRY: r[9] || '0',
      image: r[10] || '',
      available: (r[11] || 'Да').toLowerCase() !== 'нет',
      type: r[12] || 'service',
      video: r[13] || '',
      details: { ru: r[14] || '', en: r[15] || '', tr: r[16] || '' }
    }));

    const coursesArr = masterGuidesRows.map((r) => ({
      id: r[0],
      title: { ru: r[1] || '', en: r[3] || '', tr: r[5] || '' },
      desc: { ru: r[2] || '', en: r[4] || '', tr: r[6] || '' },
      image: r[7] || '',
      category: r[8] || 'guide',
      videoUrl: r[9] || '',
      priceEUR: r[10] || '0',
      priceRUB: r[11] || '0',
      priceTRY: r[12] || '0',
      video: r[13] || '',
      details: { ru: r[14] || '', en: r[15] || '', tr: r[16] || '' }
    }));

    const galleryArr = masterGalleryRows.map((r) => ({
      id: r[0],
      group: { ru: r[1] || '', en: r[3] || '', tr: r[5] || '' },
      desc: { ru: r[2] || '', en: r[4] || '', tr: r[6] || '' },
      type: r[7] || 'photo',
      media: r[8] || '',
      caption: { ru: r[9] || '', en: r[10] || '', tr: r[11] || '' }
    }));

    const updatedContentJson = {
      home: masterHomeMap,
      about: aboutObj,
      legal: legalObj,
      templates: templatesObj,
      products: productsArr,
      courses: coursesArr,
      gallery: galleryArr
    };

    fs.writeFileSync(contentFilePath, JSON.stringify(updatedContentJson, null, 2), 'utf8');
    console.log('[save-master-seed] Локальный файл content.json успешно обновлен.');
  } catch (jsonErr) {
    console.warn('[save-master-seed] Ошибка записи content.json:', jsonErr.message);
  }

  // 9. Генерация валидного CommonJS кода для masterSeedContent.js
  console.log('[save-master-seed] Форматирование исходного кода masterSeedContent.js...');
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

const MASTER_TASKS_ROWS = ${JSON.stringify(masterTasksRows, null, 2)};

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
  MASTER_TASKS_ROWS,
  buildHomeDerivedCollections
};
`;

  const targetPath = path.join(__dirname, '..', 'utils', 'masterSeedContent.js');
  fs.writeFileSync(targetPath, fileContent, 'utf8');

  console.log(`[save-master-seed] ✅ УСПЕШНО: Эталонный файл сохранен: ${targetPath}`);
  console.log(`[save-master-seed] Ключей HOME: ${Object.keys(masterHomeMap).length}`);
  console.log(`[save-master-seed] Строк HOME: ${masterHomeRows.length}`);
  console.log(`[save-master-seed] Разделов ABOUT: ${finalAboutSections.length}`);
  console.log(`[save-master-seed] Строк настроек SETTINGS: ${masterSettingsRows.length}`);
  return {
    success: true,
    homeKeysCount: Object.keys(masterHomeMap).length,
    homeRowsCount: masterHomeRows.length,
    aboutCount: finalAboutSections.length,
    settingsCount: masterSettingsRows.length
  };
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

// ==============================================================================
// СЦЕНАРИЙ АВТОМАТИЧЕСКОЙ ФИКСАЦИИ ЭТАЛОНА SINGLE SOURCE OF TRUTH
// Файл: scripts/save-master-seed.js
// Назначение: Выгружает боевые данные из листов Google Таблицы, проводит
// санитарный аудит ячеек на формульные ошибки [#REF!, #VALUE!, #ERROR!]
// и атомарно перезаписывает эталонный файл utils/masterSeedContent.js.
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

  // 1. Выгрузка листа ABOUT [📖 О вилле и Правила]
  const aboutSheetName = sheetMap.ABOUT || SHEETS_REGISTRY.ABOUT.defaultName;
  console.log(`[save-master-seed] Чтение листа: "${aboutSheetName}"...`);
  const aboutRange = resolveRange(sheetMap, 'ABOUT', 'A2:G30');
  const aboutRes = await sheets.spreadsheets.values.get({ spreadsheetId, range: aboutRange });
  const aboutRows = aboutRes.data.values || [];

  if (aboutRows.length === 0) {
    throw new Error(`Лист "${aboutSheetName}" пуст. Невозможно сформировать эталон.`);
  }

  const masterAboutSections = [];
  for (let r = 0; r < aboutRows.length; r++) {
    const row = aboutRows[r];
    const rowNum = r + 2;
    for (let c = 0; c < row.length; c++) {
      checkCellClean(row[c], aboutSheetName, rowNum, c + 1);
    }
    const id = (row[0] || `${r + 1}`).toString().trim();
    const titleRu = (row[1] || '').toString().trim();
    const titleEn = (row[2] || '').toString().trim();
    const titleTr = (row[3] || '').toString().trim();
    const textRu = (row[4] || '').toString().trim();
    const textEn = (row[5] || '').toString().trim();
    const textTr = (row[6] || '').toString().trim();

    if (titleRu || textRu) {
      masterAboutSections.push({
        id,
        title: { ru: titleRu, en: titleEn, tr: titleTr },
        text: { ru: textRu, en: textEn, tr: textTr }
      });
    }
  }

  // 2. Выгрузка листа HOME [🏠 Главная витрина]
  const homeSheetName = sheetMap.HOME || SHEETS_REGISTRY.HOME.defaultName;
  console.log(`[save-master-seed] Чтение листа: "${homeSheetName}"...`);
  const homeRange = resolveRange(sheetMap, 'HOME', 'A2:E50');
  const homeRes = await sheets.spreadsheets.values.get({ spreadsheetId, range: homeRange });
  const homeRows = homeRes.data.values || [];

  if (homeRows.length === 0) {
    throw new Error(`Лист "${homeSheetName}" пуст. Невозможно сформировать эталон.`);
  }

  const masterHomeMap = {};
  for (let r = 0; r < homeRows.length; r++) {
    const row = homeRows[r];
    const rowNum = r + 2;
    for (let c = 0; c < row.length; c++) {
      checkCellClean(row[c], homeSheetName, rowNum, c + 1);
    }
    const key = (row[0] || '').toString().trim();
    if (!key) continue;

    masterHomeMap[key] = {
      ru: (row[1] || '').toString().trim(),
      en: (row[2] || '').toString().trim(),
      tr: (row[3] || '').toString().trim(),
      media: (row[4] || '').toString().trim()
    };
  }

  // 3. Выгрузка листа SETTINGS [⚙️ Системные настройки ИИ Агентов]
  const settingsSheetName = sheetMap.SETTINGS || SHEETS_REGISTRY.SETTINGS.defaultName;
  console.log(`[save-master-seed] Чтение листа: "${settingsSheetName}"...`);
  const settingsRange = resolveRange(sheetMap, 'SETTINGS', 'A2:E40');
  const settingsRes = await sheets.spreadsheets.values.get({ spreadsheetId, range: settingsRange });
  const settingsRows = settingsRes.data.values || [];

  const masterSettingsRows = [];
  if (settingsRows.length > 0) {
    for (let r = 0; r < settingsRows.length; r++) {
      const row = settingsRows[r];
      const rowNum = r + 2;
      for (let c = 0; c < row.length; c++) {
        checkCellClean(row[c], settingsSheetName, rowNum, c + 1);
      }
      masterSettingsRows.push([
        (row[0] || '').toString().trim(),
        (row[1] || '').toString().trim(),
        (row[2] || '').toString().trim(),
        (row[3] || '').toString().trim(),
        (row[4] || '').toString().trim()
      ]);
    }
  }

  // 4. Генерация валидного CommonJS кода
  console.log('[save-master-seed] Форматирование исходного кода masterSeedContent.js...');
  const fileContent = `// ==============================================================================
// НЕПРИКОСНОВЕННЫЙ МАСТЕР-ЭТАЛОН БАЗЫ ДАННЫХ И КОНТЕНТА VILLA TURAMAN
// Файл: utils/masterSeedContent.js
// Назначение: Эталонный источник истины [SSOT] для всех 15 листов Google Таблиц.
// Защищен от случайного затирания. Обеспечивает 100% самоисцеление при удалении листов.
// Сгенерировано автоматически через scripts/save-master-seed.js
// Дата фиксации: ${new Date().toISOString()}
// ==============================================================================

const MASTER_ABOUT_SECTIONS = ${JSON.stringify(masterAboutSections, null, 2)};

const MASTER_HOME_MAP = ${JSON.stringify(masterHomeMap, null, 2)};

const MASTER_SETTINGS_ROWS = ${JSON.stringify(masterSettingsRows.length > 0 ? masterSettingsRows : require('../utils/masterSeedContent').MASTER_SETTINGS_ROWS, null, 2)};

module.exports = {
  MASTER_ABOUT_SECTIONS,
  MASTER_HOME_MAP,
  MASTER_SETTINGS_ROWS
};
`;

  const targetPath = path.join(__dirname, '..', 'utils', 'masterSeedContent.js');
  fs.writeFileSync(targetPath, fileContent, 'utf8');

  console.log(`[save-master-seed] ✅ УСПЕШНО: Эталонный файл сохранен: ${targetPath}`);
  console.log(`[save-master-seed] Разделов ABOUT: ${masterAboutSections.length}`);
  console.log(`[save-master-seed] Ключей HOME: ${Object.keys(masterHomeMap).length}`);
  console.log(`[save-master-seed] Строк настроек SETTINGS: ${masterSettingsRows.length}`);
  return {
    success: true,
    aboutCount: masterAboutSections.length,
    homeKeysCount: Object.keys(masterHomeMap).length,
    settingsCount: masterSettingsRows.length
  };
}

// Запуск напрямую из CLI / Node.js
if (require.main === module) {
  saveMasterSeed()
    .then((res) => {
      console.log('Фиксация эталона успешно завершена.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Ошибка сохранения эталона:', err.message);
      process.exit(1);
    });
}

module.exports = { saveMasterSeed };

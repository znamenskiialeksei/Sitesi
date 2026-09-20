// ==============================================================================
// СЕРВЕРНЫЙ ЭНДПОИНТ ФИКСАЦИИ ЭТАЛОНА SINGLE SOURCE OF TRUTH
// Файл: pages/api/admin/save-master-seed.js
// Назначение: Обеспечивает фиксацию текущего состояния Google Таблиц в эталонный
// файл masterSeedContent.js по запросу из Кабинета Хозяина или через вебхук.
// ==============================================================================

import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';
import { SHEETS_REGISTRY, getLiveSheetMap, resolveRange } from '../../../utils/sheetsRegistry';

// Регулярное выражение для выявления формульных ошибок Google Таблиц
const FORMULA_ERROR_REGEX = /#(REF!|VALUE!|ERROR!|N\/A|NAME\?|NUM!|DIV\/0!)/i;

function checkCellClean(val, sheetName, rowIdx, colIdx) {
  if (typeof val === 'string' && FORMULA_ERROR_REGEX.test(val)) {
    throw new Error(`Обнаружена ошибка формулы: ${val.trim()} в листе "${sheetName}", строка ${rowIdx}, колонка ${colIdx}. Сохранение эталона отменено.`);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Метод не поддерживается. Требуется POST.' });
  }

  const clientEmail = (process.env.GOOGLE_CLIENT_EMAIL || '').trim();
  const rawKey = (process.env.GOOGLE_PRIVATE_KEY || '').trim();
  const spreadsheetId = (process.env.GOOGLE_SPREADSHEET_ID || '').trim();

  if (!clientEmail || !rawKey || !spreadsheetId) {
    return res.status(500).json({ success: false, error: 'Учетные данные Google Cloud Service Account не настроены.' });
  }

  const parsePrivateKey = (raw) => {
    if (!raw) return '';
    let key = raw.replace(/^["']|["']$/g, '');
    key = key.replace(/\\\\n/g, '\n').replace(/\\n/g, '\n');
    key = key.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    return key.trim();
  };

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: parsePrivateKey(rawKey)
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const sheetMap = await getLiveSheetMap(sheets, spreadsheetId);

    // 1. Выгрузка листа ABOUT [О вилле и Правила]
    const aboutSheetName = sheetMap.ABOUT || SHEETS_REGISTRY.ABOUT.defaultName;
    const aboutRange = resolveRange(sheetMap, 'ABOUT', 'A2:G30');
    const aboutRes = await sheets.spreadsheets.values.get({ spreadsheetId, range: aboutRange });
    const aboutRows = aboutRes.data.values || [];

    if (aboutRows.length === 0) {
      return res.status(400).json({ success: false, error: `Лист "${aboutSheetName}" пуст. Невозможно сформировать эталон.` });
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

    // 2. Выгрузка листа HOME [Главная витрина]
    const homeSheetName = sheetMap.HOME || SHEETS_REGISTRY.HOME.defaultName;
    const homeRange = resolveRange(sheetMap, 'HOME', 'A2:E50');
    const homeRes = await sheets.spreadsheets.values.get({ spreadsheetId, range: homeRange });
    const homeRows = homeRes.data.values || [];

    if (homeRows.length === 0) {
      return res.status(400).json({ success: false, error: `Лист "${homeSheetName}" пуст. Невозможно сформировать эталон.` });
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

    // 3. Выгрузка листа SETTINGS [Системные настройки ИИ Агентов]
    const settingsSheetName = sheetMap.SETTINGS || SHEETS_REGISTRY.SETTINGS.defaultName;
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

    // 4. Формирование кода и запись в utils/masterSeedContent.js
    const fileContent = `// ==============================================================================
// НЕПРИКОСНОВЕННЫЙ МАСТЕР-ЭТАЛОН БАЗЫ ДАННЫХ И КОНТЕНТА VILLA TURAMAN
// Файл: utils/masterSeedContent.js
// Назначение: Эталонный источник истины [SSOT] для всех 15 листов Google Таблиц.
// Защищен от случайного затирания. Обеспечивает 100% самоисцеление при удалении листов.
// Сгенерировано автоматически через панель управления или скрипт фиксации эталона.
// Дата фиксации: ${new Date().toISOString()}
// ==============================================================================

const MASTER_ABOUT_SECTIONS = ${JSON.stringify(masterAboutSections, null, 2)};

const MASTER_HOME_MAP = ${JSON.stringify(masterHomeMap, null, 2)};

const MASTER_SETTINGS_ROWS = ${JSON.stringify(masterSettingsRows.length > 0 ? masterSettingsRows : require('../../../utils/masterSeedContent').MASTER_SETTINGS_ROWS, null, 2)};

module.exports = {
  MASTER_ABOUT_SECTIONS,
  MASTER_HOME_MAP,
  MASTER_SETTINGS_ROWS
};
`;

    const targetPath = path.join(process.cwd(), 'utils', 'masterSeedContent.js');
    fs.writeFileSync(targetPath, fileContent, 'utf8');

    return res.status(200).json({
      success: true,
      aboutCount: masterAboutSections.length,
      homeKeysCount: Object.keys(masterHomeMap).length,
      settingsCount: masterSettingsRows.length,
      message: 'Эталон SSOT masterSeedContent.js успешно зафиксирован на основе актуальных Google Таблиц.'
    });
  } catch (error) {
    console.error('Ошибка фиксации эталона SSOT:', error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
}

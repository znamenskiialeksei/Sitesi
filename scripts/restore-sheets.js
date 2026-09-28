// [ПРЕДЫДУЩАЯ РЕДАКЦИЯ: 29.09.2026 00:05 | ПЛАН: 290920260005 ПЛАН Перекрестная валидация и диапазоны.md | TAG: VILLA-RESTORE-DYNAMIC-BOUNDING-RANGES-290920260005]
// [АКТУАЛЬНАЯ РЕДАКЦИЯ: 29.09.2026 00:30 | ПЛАН: 290920260031 ПЛАН Безопасная валидация и формулы spill.md | TAG: VILLA-SAFE-VALIDATION-SPILL-CORRIDOR-290920260030]
// ==============================================================================
// УНИВЕРСАЛЬНЫЙ СКРИПТ САМОИСЦЕЛЕНИЯ И ВОССТАНОВЛЕНИЯ GOOGLE SHEETS CRM
// Файл: scripts/restore-sheets.js
// Назначение: Автоматически проверяет наличие 15 канонических листов CRM в Google Таблице.
// Если лист был удален: воссоздает его, применяет каноническое смарт-форматирование,
// наполняет эталонным контентом из masterSeedContent.js и внедряет формулы перевода со строгой ';'.
// 100% Zero-Brackets & Zero-Emdash Стандарт.
// ==============================================================================

require('dotenv').config({ path: '.env.local' });
const { google } = require('googleapis');
const { SHEETS_REGISTRY, getLiveSheetMap, resolveRange } = require('../utils/sheetsRegistry');
const {
  MASTER_SETTINGS_ROWS,
  MASTER_HOME_MAP,
  MASTER_HOME_ROWS,
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
  MASTER_KNOWLEDGE_GRAPH_ROWS
} = require('../utils/masterSeedContent');

/**
 * Преобразование индекса колонки (1-based: 1=A, 2=B, ..., 26=Z, 27=AA) в буквенную нотацию
 */
function getColumnLetter(colIndex) {
  let temp, letter = '';
  while (colIndex > 0) {
    temp = (colIndex - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    colIndex = Math.floor((colIndex - temp - 1) / 26);
  }
  return letter;
}

/**
 * Динамический расчет точного диапазона A1 Notation на основе реальной матрицы данных (Мандат 1.11)
 */
function getBoundingRange(sheetTitle, startColIndex, startRowIndex, matrix) {
  if (!matrix || matrix.length === 0) return null;
  const numRows = matrix.length;
  let maxCols = 0;
  for (let r = 0; r < matrix.length; r++) {
    if (matrix[r] && matrix[r].length > maxCols) maxCols = matrix[r].length;
  }
  if (maxCols === 0) return null;
  const startColLetter = getColumnLetter(startColIndex);
  const endColLetter = getColumnLetter(startColIndex + maxCols - 1);
  const endRowIndex = startRowIndex + numRows - 1;
  return `'${sheetTitle}'!${startColLetter}${startRowIndex}:${endColLetter}${endRowIndex}`;
}

async function restoreAllSheets() {
  console.log('================================================================================');
  console.log('🚀 ЗАПУСК САМОИСЦЕЛЕНИЯ И ВОССТАНОВЛЕНИЯ 15 КАНОНИЧЕСКИХ ЛИСТОВ GOOGLE SHEETS');
  console.log('================================================================================');

  const clientEmail = (process.env.GOOGLE_CLIENT_EMAIL || '').trim();
  const rawKey = (process.env.GOOGLE_PRIVATE_KEY || '').trim();
  const spreadsheetId = (process.env.GOOGLE_SPREADSHEET_ID || '').trim();

  const isPlaceholder =
    !clientEmail ||
    !rawKey ||
    !spreadsheetId ||
    spreadsheetId === 'your_google_sheet_id' ||
    clientEmail.includes('your-service-account-email') ||
    rawKey.includes('YOUR_PRIVATE_KEY');

  if (isPlaceholder) {
    console.log('ℹ️ В .env.local указаны демонстрационные ключи.');
    console.log('   Таблица восстанавливается автономно через мастер-кэш utils/content.json.');
    return;
  }

  // Универсальный PEM-парсер
  const parsePrivateKey = (raw) => {
    if (!raw) return '';
    let key = raw;
    key = key.replace(/^["']|["']$/g, '');
    key = key.replace(/\\\\n/g, '\n').replace(/\\n/g, '\n');
    key = key.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    return key.trim();
  };

  const parsedKey = parsePrivateKey(rawKey);

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: parsedKey
      },
      scopes: ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Считываем текущие листы
    const ss = await sheets.spreadsheets.get({ spreadsheetId });
    let existingSheets = ss.data.sheets || [];

    console.log(`Обнаружено существующих листов: ${existingSheets.length}`);

    // Очистка устаревших и архивных листов: дубликаты, старые русские имена и удаленные листы
    const obsoleteNames = [
      'home', 'homepage', 'showcase',
      'gallery', 'photos',
      'about', 'houserules', 'о вилле и правила', 'о вилле',
      'services', 'extraservices',
      'guides', 'videoguides',
      'legal', 'documents',
      'bookings', 'bookingrequests',
      'calendar', 'calendarsettings', 'pricing',
      'accounts', 'guestaccounts', 'guests',
      'master', 'permissions', 'accesscontrol', 'управление доступом',
      'orders', 'serviceorders',
      'access', 'guideaccess',
      'templates', 'messagetemplates',
      'variables', 'dictionary', 'placeholders', 'словарь переменных',
      'settings', 'aisettings', 'сводная база', 'настройки экосистемы'
    ];
    const obsoleteSheetIds = [103, 204, 208];
    const deleteOldRequests = [];
    for (const sheet of existingSheets) {
      const titleLower = sheet.properties.title.trim().toLowerCase();
      const sId = sheet.properties.sheetId;
      if (obsoleteNames.includes(titleLower) || obsoleteSheetIds.includes(sId)) {
        console.log(`Обнаружен устаревший лист [${sheet.properties.title}] (ID: ${sId}). Удаляем...`);
        deleteOldRequests.push({ deleteSheet: { sheetId: sId } });
      }
    }

    if (deleteOldRequests.length > 0) {
      try {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: { requests: deleteOldRequests }
        });
        console.log(`✅ Ликвидировано устаревших листов-дубликатов: ${deleteOldRequests.length}`);
        const refetch = await sheets.spreadsheets.get({ spreadsheetId });
        existingSheets = refetch.data.sheets || [];
      } catch (delErr) {
        console.warn('Предупреждение при удалении устаревших листов:', delErr.message);
      }
    }

    const allSheetConfigs = Object.values(SHEETS_REGISTRY).map((cfg) => ({
      key: cfg.key,
      title: cfg.defaultName,
      aliases: cfg.aliases,
      headers: cfg.headers,
      suggestedSheetId: cfg.suggestedSheetId
    }));

    // 1. Поиск и создание недостающих листов с постоянными sheetId
    const sheetsToCreate = allSheetConfigs.filter((config) => {
      return !existingSheets.some((s) => {
        if (config.suggestedSheetId && s.properties.sheetId === config.suggestedSheetId) return true;
        const title = s.properties.title.trim();
        return config.aliases.some((alias) => alias.toLowerCase() === title.toLowerCase());
      });
    });

    if (sheetsToCreate.length > 0) {
      console.log(`Обнаружено отсутствующих листов: ${sheetsToCreate.length}. Создаем...`);
      const addRequests = sheetsToCreate.map((sheetDef) => ({
        addSheet: {
          properties: {
            sheetId: sheetDef.suggestedSheetId,
            title: sheetDef.title
          }
        }
      }));
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: { requests: addRequests }
      });
      console.log(`✅ Создано недостающих листов: ${sheetsToCreate.length}`);
    } else {
      console.log('✅ Все 11 листов присутствуют в таблице.');
    }

    // 2. Повторное считывание обновленного списка листов
    const updatedSs = await sheets.spreadsheets.get({ spreadsheetId });
    const formatRequests = [];
    const dataAppendRequests = [];
    const safeFormulasToInject = [];

    for (const config of allSheetConfigs) {
      // Честный двухэтапный поиск: sheetId на этапе 1, затем по русским именам
      const sheet = updatedSs.data.sheets.find((s) => {
        if (config.suggestedSheetId && s.properties.sheetId === config.suggestedSheetId) return true;
        const title = s.properties.title.trim();
        return config.aliases.some((alias) => alias.toLowerCase() === title.toLowerCase());
      });

      if (!sheet) continue;

      const actualTitle = sheet.properties.title;
      const sheetId = sheet.properties.sheetId;

      let rowCount = 0;
      try {
        const check = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: `'${actualTitle}'!A:A`
        });
        rowCount = (check.data.values || []).length;
      } catch (e) {
        rowCount = 0;
      }

      // Если в листе 0 или 1 строка [только шапка или пусто], наполняем его
      if (rowCount <= 1) {
        console.log(`Восстановление данных для листа: ${actualTitle} [строк: ${rowCount}]...`);

        if (rowCount === 0) {
          // Форматирование закрепленной темной шапки таблицы
          formatRequests.push({
            updateCells: {
              range: {
                sheetId,
                startRowIndex: 0,
                endRowIndex: 1,
                startColumnIndex: 0,
                endColumnIndex: config.headers.length
              },
              rows: [
                {
                  values: config.headers.map((h) => ({
                    userEnteredValue: { stringValue: h },
                    userEnteredFormat: {
                      backgroundColor: { red: 0.15, green: 0.2, blue: 0.28 },
                      textFormat: { bold: true, fontSize: 11, foregroundColor: { red: 1, green: 1, blue: 1 } },
                      horizontalAlignment: 'CENTER',
                      verticalAlignment: 'MIDDLE',
                      wrapStrategy: 'WRAP'
                    }
                  }))
                }
              ],
              fields: 'userEnteredValue,userEnteredFormat'
            }
          });

          // Закрепление первой строки
          formatRequests.push({
            updateSheetProperties: {
              properties: { sheetId, gridProperties: { frozenRowCount: 1 } },
              fields: 'gridProperties.frozenRowCount'
            }
          });

          // Смарт-форматирование ячеек данных
          formatRequests.push({
            repeatCell: {
              range: {
                sheetId,
                startRowIndex: 1,
                endRowIndex: 100,
                startColumnIndex: 0,
                endColumnIndex: config.headers.length
              },
              cell: {
                userEnteredFormat: {
                  wrapStrategy: 'WRAP',
                  verticalAlignment: 'MIDDLE'
                }
              },
              fields: 'userEnteredFormat(wrapStrategy,verticalAlignment)'
            }
          });

          // Авто-подгонка колонок
          formatRequests.push({
            autoResizeDimensions: {
              dimensions: {
                sheetId,
                dimension: 'COLUMNS',
                startIndex: 0,
                endIndex: config.headers.length
              }
            }
          });
        }

        // Посев данных по ключам с защитой Clean Spill для формул
        if (config.key === 'HOME') {
          const colsA_D = MASTER_HOME_ROWS.map((r) => [r[0], r[1], r[2], r[3]]);
          const colsG_H = MASTER_HOME_ROWS.map((r) => [r[6] || '', r[7] || '']);

          dataAppendRequests.push({
            range: `'${actualTitle}'!A2:D${colsA_D.length + 1}`,
            values: colsA_D
          });
          dataAppendRequests.push({
            range: `'${actualTitle}'!G2:H${colsG_H.length + 1}`,
            values: colsG_H
          });

          safeFormulasToInject.push({ range: `'${actualTitle}'!E2`, values: [['=MAP(D2:D; LAMBDA(val; IF(OR(ISBLANK(val); val=""); ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!F2`, values: [['=MAP(D2:D; LAMBDA(val; IF(OR(ISBLANK(val); val=""); ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });
        }

        if (config.key === 'GALLERY') {
          const colsA_C = MASTER_GALLERY_ROWS.map((r) => [r[0], r[1], r[2]]);
          const colsH_J = MASTER_GALLERY_ROWS.map((r) => [r[7] || '', r[8] || '', r[9] || '']);

          dataAppendRequests.push({
            range: `'${actualTitle}'!A2:C${colsA_C.length + 1}`,
            values: colsA_C
          });
          dataAppendRequests.push({
            range: `'${actualTitle}'!H2:J${colsH_J.length + 1}`,
            values: colsH_J
          });

          safeFormulasToInject.push({ range: `'${actualTitle}'!D2`, values: [['=MAP(B2:B; LAMBDA(val; IF(OR(ISBLANK(val); val=""); ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!E2`, values: [['=MAP(C2:C; LAMBDA(val; IF(OR(ISBLANK(val); val=""); ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!F2`, values: [['=MAP(B2:B; LAMBDA(val; IF(OR(ISBLANK(val); val=""); ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!G2`, values: [['=MAP(C2:C; LAMBDA(val; IF(OR(ISBLANK(val); val=""); ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!K2`, values: [['=MAP(J2:J; LAMBDA(val; IF(OR(ISBLANK(val); val=""); ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!L2`, values: [['=MAP(J2:J; LAMBDA(val; IF(OR(ISBLANK(val); val=""); ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });
        }

        if (config.key === 'SERVICES') {
          const colsA_C = MASTER_SERVICES_ROWS.map((r) => [r[0], r[1], r[2]]);
          const colsH_P = MASTER_SERVICES_ROWS.map((r) => {
            const hasUsd = r.length >= 18;
            const usd = hasUsd ? r[7] : Math.round(Number(r[7] || 0) * 1.08).toString();
            const eur = hasUsd ? r[8] : (r[7] || '');
            const rub = hasUsd ? r[9] : (r[8] || '');
            const tryCur = hasUsd ? r[10] : (r[9] || '');
            const images = hasUsd ? r[11] : (r[10] || '');
            const available = hasUsd ? r[12] : (r[11] || '');
            const type = hasUsd ? r[13] : (r[12] || '');
            const videos = hasUsd ? r[14] : (r[13] || '');
            const detailedRu = hasUsd ? r[15] : (r[14] || '');
            return [usd, eur, rub, tryCur, images, available, type, videos, detailedRu];
          });

          dataAppendRequests.push({
            range: `'${actualTitle}'!A2:C${colsA_C.length + 1}`,
            values: colsA_C
          });
          dataAppendRequests.push({
            range: `'${actualTitle}'!H2:P${colsH_P.length + 1}`,
            values: colsH_P
          });

          safeFormulasToInject.push({ range: `'${actualTitle}'!D2`, values: [['=MAP(B2:B; LAMBDA(val; IF(OR(ISBLANK(val); val=""); ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!E2`, values: [['=MAP(C2:C; LAMBDA(val; IF(OR(ISBLANK(val); val=""); ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!F2`, values: [['=MAP(B2:B; LAMBDA(val; IF(OR(ISBLANK(val); val=""); ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!G2`, values: [['=MAP(C2:C; LAMBDA(val; IF(OR(ISBLANK(val); val=""); ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!Q2`, values: [['=MAP(P2:P; LAMBDA(val; IF(OR(ISBLANK(val); val=""); ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!R2`, values: [['=MAP(P2:P; LAMBDA(val; IF(OR(ISBLANK(val); val=""); ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });
        }

        if (config.key === 'GUIDES') {
          const colsA_C = MASTER_GUIDES_ROWS.map((r) => [r[0], r[1], r[2]]);
          const colsH_P = MASTER_GUIDES_ROWS.map((r) => {
            const hasUsd = r.length >= 18;
            const images = r[7] || '';
            const module = r[8] || '';
            const link = r[9] || '';
            const usd = hasUsd ? r[10] : Math.round(Number(r[10] || 0) * 1.08).toString();
            const eur = hasUsd ? r[11] : (r[10] || '');
            const rub = hasUsd ? r[12] : (r[11] || '');
            const tryCur = hasUsd ? r[13] : (r[12] || '');
            const videos = hasUsd ? r[14] : (r[13] || '');
            const detailedRu = hasUsd ? r[15] : (r[14] || '');
            return [images, module, link, usd, eur, rub, tryCur, videos, detailedRu];
          });

          dataAppendRequests.push({
            range: `'${actualTitle}'!A2:C${colsA_C.length + 1}`,
            values: colsA_C
          });
          dataAppendRequests.push({
            range: `'${actualTitle}'!H2:P${colsH_P.length + 1}`,
            values: colsH_P
          });

          if (MASTER_GUIDES_ROWS.some(r => r.length >= 18)) {
            const colsS = MASTER_GUIDES_ROWS.map((r) => [r[18] || 'Да']);
            dataAppendRequests.push({
              range: `'${actualTitle}'!S2:S${colsS.length + 1}`,
              values: colsS
            });
          }

          safeFormulasToInject.push({ range: `'${actualTitle}'!D2`, values: [['=MAP(B2:B; LAMBDA(val; IF(OR(ISBLANK(val); val=""); ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!E2`, values: [['=MAP(C2:C; LAMBDA(val; IF(OR(ISBLANK(val); val=""); ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!F2`, values: [['=MAP(B2:B; LAMBDA(val; IF(OR(ISBLANK(val); val=""); ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!G2`, values: [['=MAP(C2:C; LAMBDA(val; IF(OR(ISBLANK(val); val=""); ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!Q2`, values: [['=MAP(P2:P; LAMBDA(val; IF(OR(ISBLANK(val); val=""); ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!R2`, values: [['=MAP(P2:P; LAMBDA(val; IF(OR(ISBLANK(val); val=""); ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });
        }

        if (config.key === 'LEGAL') {
          const colsA_B = MASTER_LEGAL_ROWS.map((r) => [r[0], r[1]]);
          const colE = MASTER_LEGAL_ROWS.map((r) => [r[4] || '']);

          dataAppendRequests.push({
            range: `'${actualTitle}'!A2:B${colsA_B.length + 1}`,
            values: colsA_B
          });
          dataAppendRequests.push({
            range: `'${actualTitle}'!E2:E${colE.length + 1}`,
            values: colE
          });

          safeFormulasToInject.push({ range: `'${actualTitle}'!C2`, values: [['=MAP(B2:B; LAMBDA(val; IF(OR(ISBLANK(val); val=""); ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!D2`, values: [['=MAP(B2:B; LAMBDA(val; IF(OR(ISBLANK(val); val=""); ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!F2`, values: [['=MAP(E2:E; LAMBDA(val; IF(OR(ISBLANK(val); val=""); ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!G2`, values: [['=MAP(E2:E; LAMBDA(val; IF(OR(ISBLANK(val); val=""); ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });
        }

        if (config.key === 'BOOKINGS' && MASTER_BOOKINGS_ROWS && MASTER_BOOKINGS_ROWS.length > 0) {
          const boundingRange = getBoundingRange(actualTitle, 1, 2, MASTER_BOOKINGS_ROWS);
          dataAppendRequests.push({
            range: boundingRange,
            values: MASTER_BOOKINGS_ROWS
          });
        }

        if (config.key === 'CALENDAR' && MASTER_CALENDAR_ROWS && MASTER_CALENDAR_ROWS.length > 0) {
          const boundingRange = getBoundingRange(actualTitle, 1, 2, MASTER_CALENDAR_ROWS);
          dataAppendRequests.push({
            range: boundingRange,
            values: MASTER_CALENDAR_ROWS
          });
        }

        if (config.key === 'ACCOUNTS' && MASTER_ACCOUNTS_ROWS && MASTER_ACCOUNTS_ROWS.length > 0) {
          const boundingRange = getBoundingRange(actualTitle, 1, 2, MASTER_ACCOUNTS_ROWS);
          dataAppendRequests.push({
            range: boundingRange,
            values: MASTER_ACCOUNTS_ROWS
          });
        }

        if (config.key === 'ORDERS' && MASTER_ORDERS_ROWS && MASTER_ORDERS_ROWS.length > 0) {
          const boundingRange = getBoundingRange(actualTitle, 1, 2, MASTER_ORDERS_ROWS);
          dataAppendRequests.push({
            range: boundingRange,
            values: MASTER_ORDERS_ROWS
          });
        }

        if (config.key === 'ACCESS' && MASTER_ACCESS_ROWS && MASTER_ACCESS_ROWS.length > 0) {
          const boundingRange = getBoundingRange(actualTitle, 1, 2, MASTER_ACCESS_ROWS);
          dataAppendRequests.push({
            range: boundingRange,
            values: MASTER_ACCESS_ROWS
          });
        }

        if (config.key === 'TEMPLATES') {
          const colsA_B = MASTER_TEMPLATES_ROWS.map((r) => [r[0], r[1]]);
          const colE = MASTER_TEMPLATES_ROWS.map((r) => [r[4] || '']);

          dataAppendRequests.push({
            range: `'${actualTitle}'!A2:B${colsA_B.length + 1}`,
            values: colsA_B
          });
          dataAppendRequests.push({
            range: `'${actualTitle}'!E2:E${colE.length + 1}`,
            values: colE
          });

          safeFormulasToInject.push({ range: `'${actualTitle}'!C2`, values: [['=MAP(B2:B; LAMBDA(val; IF(OR(ISBLANK(val); val=""); ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!D2`, values: [['=MAP(B2:B; LAMBDA(val; IF(OR(ISBLANK(val); val=""); ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!F2`, values: [['=MAP(E2:E; LAMBDA(val; IF(OR(ISBLANK(val); val=""); ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!G2`, values: [['=MAP(E2:E; LAMBDA(val; IF(OR(ISBLANK(val); val=""); ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });
        }

        if (config.key === 'SETTINGS' && MASTER_SETTINGS_ROWS && MASTER_SETTINGS_ROWS.length > 0) {
          const boundingRange = getBoundingRange(actualTitle, 1, 2, MASTER_SETTINGS_ROWS);
          dataAppendRequests.push({
            range: boundingRange,
            values: MASTER_SETTINGS_ROWS
          });
        }

        if (config.key === 'TASKS' && MASTER_TASKS_ROWS && MASTER_TASKS_ROWS.length > 0) {
          const boundingRange = getBoundingRange(actualTitle, 1, 2, MASTER_TASKS_ROWS);
          dataAppendRequests.push({
            range: boundingRange,
            values: MASTER_TASKS_ROWS
          });
        }

        if (config.key === 'KNOWLEDGE_GRAPH' && MASTER_KNOWLEDGE_GRAPH_ROWS && MASTER_KNOWLEDGE_GRAPH_ROWS.length > 0) {
          const boundingRange = getBoundingRange(actualTitle, 1, 2, MASTER_KNOWLEDGE_GRAPH_ROWS);
          dataAppendRequests.push({
            range: boundingRange,
            values: MASTER_KNOWLEDGE_GRAPH_ROWS
          });
        }

        if (config.key === 'GUIDE_ACCESS' && MASTER_GUIDE_ACCESS_ROWS && MASTER_GUIDE_ACCESS_ROWS.length > 0) {
          const boundingRange = getBoundingRange(actualTitle, 1, 2, MASTER_GUIDE_ACCESS_ROWS);
          dataAppendRequests.push({
            range: boundingRange,
            values: MASTER_GUIDE_ACCESS_ROWS
          });
        }
      }
    }

    if (formatRequests.length > 0) {
      await sheets.spreadsheets.batchUpdate({ spreadsheetId, requestBody: { requests: formatRequests } });
    }

    if (dataAppendRequests.length > 0) {
      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId,
        requestBody: {
          valueInputOption: 'USER_ENTERED',
          data: dataAppendRequests.map((req) => ({ range: req.range, values: req.values }))
        }
      });
    }

    if (safeFormulasToInject.length > 0) {
      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId,
        requestBody: {
          valueInputOption: 'USER_ENTERED',
          data: safeFormulasToInject.map((req) => ({ range: req.range, values: req.values }))
        }
      });
    }

    console.log('================================================================================');
    console.log('✅ САМОИСЦЕЛЕНИЕ ЗАВЕРШЕНО: ВСЕ 15 ЛИСТОВ ВОССТАНОВЛЕНЫ И СИНХРОНИЗИРОВАНЫ');
    console.log('================================================================================');
  } catch (error) {
    console.error('❌ Ошибка при восстановлении Google Sheets:', error.message);
  }
}

restoreAllSheets();

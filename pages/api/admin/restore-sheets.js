// ==============================================================================
// СЕРВЕРНЫЙ ЭНДПОИНТ САМОИСЦЕЛЕНИЯ И ВОССТАНОВЛЕНИЯ GOOGLE SHEETS
// Файл: pages/api/admin/restore-sheets.js
// Назначение: Обеспечивает вызов восстановления структуры и данных 11 канонических листов
// Google Таблицы из Кабинета Хозяина [/host] или по системному запросу.
// ==============================================================================

import { google } from 'googleapis';
import { SHEETS_REGISTRY } from '../../../utils/sheetsRegistry';
import {
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
  MASTER_ACCESS_ROWS
} from '../../../utils/masterSeedContent';

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
      scopes: ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const ss = await sheets.spreadsheets.get({ spreadsheetId });
    let existingSheets = ss.data.sheets || [];

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
        deleteOldRequests.push({ deleteSheet: { sheetId: sId } });
      }
    }
    if (deleteOldRequests.length > 0) {
      try {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: { requests: deleteOldRequests }
        });
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

    // Создание недостающих листов с каноническими sheetId и русскими именами
    const sheetsToCreate = allSheetConfigs.filter((config) => {
      return !existingSheets.some((s) => {
        if (config.suggestedSheetId && s.properties.sheetId === config.suggestedSheetId) return true;
        const title = s.properties.title.trim();
        return config.aliases.some((alias) => alias.toLowerCase() === title.toLowerCase());
      });
    });

    if (sheetsToCreate.length > 0) {
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
    }

    const updatedSs = await sheets.spreadsheets.get({ spreadsheetId });
    const formatRequests = [];
    const dataAppendRequests = [];
    const safeFormulasToInject = [];
    let restoredCount = sheetsToCreate.length;

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

      if (rowCount <= 1) {
        restoredCount++;
        if (rowCount === 0) {
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

          formatRequests.push({
            updateSheetProperties: {
              properties: { sheetId, gridProperties: { frozenRowCount: 1 } },
              fields: 'gridProperties.frozenRowCount'
            }
          });

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

          safeFormulasToInject.push({ range: `'${actualTitle}'!E2`, values: [['=MAP(D2:D; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!F2`, values: [['=MAP(D2:D; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });
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

          safeFormulasToInject.push({ range: `'${actualTitle}'!D2`, values: [['=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!E2`, values: [['=MAP(C2:C; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!F2`, values: [['=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!G2`, values: [['=MAP(C2:C; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!K2`, values: [['=MAP(J2:J; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!L2`, values: [['=MAP(J2:J; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });
        }

        if (config.key === 'SERVICES') {
          const colsA_C = MASTER_SERVICES_ROWS.map((r) => [r[0], r[1], r[2]]);
          const colsH_O = MASTER_SERVICES_ROWS.map((r) => [r[7] || '', r[8] || '', r[9] || '', r[10] || '', r[11] || '', r[12] || '', r[13] || '', r[14] || '']);

          dataAppendRequests.push({
            range: `'${actualTitle}'!A2:C${colsA_C.length + 1}`,
            values: colsA_C
          });
          dataAppendRequests.push({
            range: `'${actualTitle}'!H2:O${colsH_O.length + 1}`,
            values: colsH_O
          });

          safeFormulasToInject.push({ range: `'${actualTitle}'!D2`, values: [['=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!E2`, values: [['=MAP(C2:C; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!F2`, values: [['=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!G2`, values: [['=MAP(C2:C; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!P2`, values: [['=MAP(O2:O; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!Q2`, values: [['=MAP(O2:O; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });
        }

        if (config.key === 'GUIDES') {
          const colsA_C = MASTER_GUIDES_ROWS.map((r) => [r[0], r[1], r[2]]);
          const colsH_O = MASTER_GUIDES_ROWS.map((r) => [r[7] || '', r[8] || '', r[9] || '', r[10] || '', r[11] || '', r[12] || '', r[13] || '', r[14] || '']);

          dataAppendRequests.push({
            range: `'${actualTitle}'!A2:C${colsA_C.length + 1}`,
            values: colsA_C
          });
          dataAppendRequests.push({
            range: `'${actualTitle}'!H2:O${colsH_O.length + 1}`,
            values: colsH_O
          });

          safeFormulasToInject.push({ range: `'${actualTitle}'!D2`, values: [['=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!E2`, values: [['=MAP(C2:C; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!F2`, values: [['=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!G2`, values: [['=MAP(C2:C; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!P2`, values: [['=MAP(O2:O; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!Q2`, values: [['=MAP(O2:O; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });
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

          safeFormulasToInject.push({ range: `'${actualTitle}'!C2`, values: [['=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!D2`, values: [['=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!F2`, values: [['=MAP(E2:E; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!G2`, values: [['=MAP(E2:E; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });
        }

        if (config.key === 'BOOKINGS') {
          dataAppendRequests.push({
            range: `'${actualTitle}'!A2:K${MASTER_BOOKINGS_ROWS.length + 1}`,
            values: MASTER_BOOKINGS_ROWS
          });
        }

        if (config.key === 'CALENDAR') {
          dataAppendRequests.push({
            range: `'${actualTitle}'!A2:G${MASTER_CALENDAR_ROWS.length + 1}`,
            values: MASTER_CALENDAR_ROWS
          });
        }

        if (config.key === 'ACCOUNTS') {
          dataAppendRequests.push({
            range: `'${actualTitle}'!A2:G${MASTER_ACCOUNTS_ROWS.length + 1}`,
            values: MASTER_ACCOUNTS_ROWS
          });
        }

        if (config.key === 'ORDERS') {
          dataAppendRequests.push({
            range: `'${actualTitle}'!A2:F${MASTER_ORDERS_ROWS.length + 1}`,
            values: MASTER_ORDERS_ROWS
          });
        }

        if (config.key === 'ACCESS') {
          dataAppendRequests.push({
            range: `'${actualTitle}'!A2:G${MASTER_ACCESS_ROWS.length + 1}`,
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

          safeFormulasToInject.push({ range: `'${actualTitle}'!C2`, values: [['=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!D2`, values: [['=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!F2`, values: [['=MAP(E2:E; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!G2`, values: [['=MAP(E2:E; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });
        }

        if (config.key === 'SETTINGS') {
          dataAppendRequests.push({
            range: `'${actualTitle}'!A2:E${MASTER_SETTINGS_ROWS.length + 1}`,
            values: MASTER_SETTINGS_ROWS
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

    return res.status(200).json({
      success: true,
      restoredCount,
      newlyCreatedSheets: sheetsToCreate.map((s) => s.title),
      message: 'Самоисцеление листов Google Таблицы успешно выполнено.'
    });
  } catch (error) {
    console.error('Ошибка в restore-sheets endpoint:', error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
}

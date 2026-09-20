// ==============================================================================
// СЕРВЕРНЫЙ ЭНДПОИНТ САМОИСЦЕЛЕНИЯ И ВОССТАНОВЛЕНИЯ GOOGLE SHEETS
// Файл: pages/api/admin/restore-sheets.js
// Назначение: Обеспечивает вызов восстановления структуры и данных всех 15 листов
// Google Таблицы из Кабинета Хозяина [/host] или по системному запросу.
// ==============================================================================

import { google } from 'googleapis';
import { SHEETS_REGISTRY } from '../../../utils/sheetsRegistry';
import { SMART_TEMPLATES } from '../../../utils/templatesData';
import { MASTER_ABOUT_SECTIONS, MASTER_SETTINGS_ROWS, MASTER_HOME_MAP } from '../../../utils/masterSeedContent';

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
    const existingSheets = ss.data.sheets || [];
    const existingTitles = existingSheets.map((s) => s.properties.title.trim());

    const allSheetConfigs = Object.values(SHEETS_REGISTRY).map((cfg) => ({
      key: cfg.key,
      title: cfg.defaultName,
      aliases: cfg.aliases,
      headers: cfg.headers
    }));

    // Создание недостающих листов
    const sheetsToCreate = allSheetConfigs.filter((config) => {
      return !existingTitles.some((title) =>
        config.aliases.some((alias) => alias.toLowerCase() === title.toLowerCase())
      );
    });

    if (sheetsToCreate.length > 0) {
      const addRequests = sheetsToCreate.map((sheetDef) => ({
        addSheet: { properties: { title: sheetDef.title } }
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
      const sheet = updatedSs.data.sheets.find((s) => {
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
          safeFormulasToInject.push({ range: `'${actualTitle}'!C2`, values: [['=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!D2`, values: [['=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });
          const homeRows = Object.entries(MASTER_HOME_MAP).map(([key, item]) => [
            key,
            item.ru || '',
            item.en || '',
            item.tr || '',
            item.media || ''
          ]);
          dataAppendRequests.push({
            range: `'${actualTitle}'!A2:E${homeRows.length + 1}`,
            values: homeRows
          });
        }

        if (config.key === 'ABOUT') {
          safeFormulasToInject.push({ range: `'${actualTitle}'!C2`, values: [['=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!D2`, values: [['=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!F2`, values: [['=MAP(E2:E; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!G2`, values: [['=MAP(E2:E; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });

          const aboutRows = MASTER_ABOUT_SECTIONS.map((sec) => [
            sec.id,
            sec.title.ru,
            sec.title.en,
            sec.title.tr,
            sec.text.ru,
            sec.text.en,
            sec.text.tr
          ]);
          dataAppendRequests.push({
            range: `'${actualTitle}'!A2:G${aboutRows.length + 1}`,
            values: aboutRows
          });
        }

        if (config.key === 'SETTINGS') {
          dataAppendRequests.push({
            range: `'${actualTitle}'!A2:D${MASTER_SETTINGS_ROWS.length + 1}`,
            values: MASTER_SETTINGS_ROWS
          });
        }

        if (config.key === 'LEGAL') {
          dataAppendRequests.push({
            range: `'${actualTitle}'!A2:E11`,
            values: [
              ['company_name', 'Организация', '', '', 'ALEKSEI ZNAMENSKII - Villa Turaman'],
              ['tax_info', 'Налоговый номер', '', '', 'Ortaca Vergi Dairesi, VKN: 9991120181'],
              ['contact_email', 'Email', '', '', 'villaturaman@gmail.com'],
              ['contract', 'Договор аренды', '', '', 'Договор краткосрочной аренды Villa Turaman [Дальян, Мугла, Турция]. Владелец: Aleksei Znamenskii [VKN: 9991120181].'],
              ['footerDesc', 'О Villa Turaman', '', '', 'Премиальная частная вилла в Дальяне [Турция]. Прямое бронирование от владельца Алексея Знаменского без скрытых комиссий сторонних агрегаторов.'],
              ['footerLocation', 'Адрес', '', '', 'Дальян, Ортаджа, Мугла, Турция'],
              ['etbis_placeholder', 'QR-код ETBIS', '', '', 'ETBIS QR CODE\nVKN: 9991120181'],
              ['etbis_text', 'Госреестр ETBIS', '', '', "ETBİS'e Kayıtlıdır"],
              ['kvkk', 'Политика KVKK', '', '', 'Полный текст политики защиты персональных данных [KVKK Aydınlatma Metni]...'],
              ['privacy', 'Конфиденциальность', '', '', 'Политика конфиденциальности персональных данных гостей виллы...']
            ]
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

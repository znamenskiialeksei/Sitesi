// ==============================================================================
// ЛЕГКОВЕСНЫЙ ВЫДЕЛЕННЫЙ API РОУТ ГОСТЕВЫХ ЧАТОВ VILLA TURAMAN
// Файл: pages/api/guest-messages.js
// Назначение: Обеспечивает 100% изоляцию гостевых чатов от ISR ревалидации витрины.
// 1. Прямая работа с выделенной базой чатов 1oiWwaT7KzbTdRS-pSCjHv-F84ymXlrmrkNE99IFD3rQ;
// 2. Единый 10-колоночный стандарт A..J с автопереводом и ссылкой на вложение;
// 3. Формулы со СТРОГОЙ ТОЧКОЙ С ЗАПЯТОЙ [;] для русской локали Google Таблиц;
// 4. Мгновенная отправка уведомлений суперхозяину в Telegram;
// 5. 100% Zero-Brackets & Zero-Emdash Стандарт.
// ==============================================================================

import { google } from 'googleapis';

const CHATS_SPREADSHEET_ID = process.env.GOOGLE_CHATS_SPREADSHEET_ID || '1oiWwaT7KzbTdRS-pSCjHv-F84ymXlrmrkNE99IFD3rQ';

// Единый 10-колоночный канонический реестр заголовков A..J
const CHAT_HEADERS = [
  'Время',
  'Отправитель',
  'Оригинал сообщения',
  'RU [Перевод]',
  'EN [Translation]',
  'TR [Çeviri]',
  'Ссылка на вложение',
  'Статус',
  'Канал связи',
  'Метаданные / ИИ-суфлер'
];

// Инициализация Google Sheets клиента
async function getSheetsClient() {
  const clientEmail = (process.env.GOOGLE_CLIENT_EMAIL || '').trim();
  const rawKey = (process.env.GOOGLE_PRIVATE_KEY || '').trim();

  if (!clientEmail || !rawKey) return null;

  try {
    let key = rawKey.replace(/^["']|["']$/g, '');
    key = key.replace(/\\\\n/g, '\n').replace(/\\n/g, '\n');
    key = key.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();

    const auth = new google.auth.GoogleAuth({
      credentials: { client_email: clientEmail, private_key: key },
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    return google.sheets({ version: 'v4', auth });
  } catch (err) {
    console.warn('[guest-messages] Ошибка авторизации Google Cloud:', err.message);
    return null;
  }
}

// Формирование безопасного имени вкладки чата
function getChatSheetTitle(guestName, guestContact) {
  const safeName = (guestName || 'Гость').toString().replace(/[\\/?*[\]]/g, '').trim().substring(0, 15);
  const safeContact = (guestContact || 'contact').toString().replace(/[\\/?*[\]]/g, '').trim().substring(0, 30);
  return `Chat_${safeName}_${safeContact}`;
}

// Поиск существующей вкладки чата по контакту
async function findExistingChatSheet(sheets, spreadsheetId, guestContact) {
  try {
    const meta = await sheets.spreadsheets.get({ spreadsheetId });
    const allSheets = meta.data.sheets || [];
    const cleanTarget = (guestContact || '').toLowerCase().replace(/[^a-z0-9]/g, '');

    for (const sh of allSheets) {
      const title = sh.properties?.title || '';
      if (!title.startsWith('Chat_')) continue;
      const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (cleanTarget && cleanTitle.includes(cleanTarget)) {
        return title;
      }
    }
    return null;
  } catch (err) {
    console.warn('[guest-messages] Ошибка поиска листа чата:', err.message);
    return null;
  }
}

// Гарантированное создание и стилизация 10-колоночного листа чата
async function ensureStyledChatSheet(sheets, spreadsheetId, sheetTitle) {
  try {
    const meta = await sheets.spreadsheets.get({ spreadsheetId });
    const existing = (meta.data.sheets || []).find((s) => s.properties?.title === sheetTitle);

    if (existing) return;

    const addRes = await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title: sheetTitle,
                gridProperties: { frozenRowCount: 1 }
              }
            }
          }
        ]
      }
    });

    const newSheetId = addRes.data.replies?.[0]?.addSheet?.properties?.sheetId;
    if (newSheetId !== undefined) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              updateCells: {
                start: { sheetId: newSheetId, rowIndex: 0, columnIndex: 0 },
                rows: [
                  {
                    values: CHAT_HEADERS.map((h) => ({
                      userEnteredValue: { stringValue: h },
                      userEnteredFormat: {
                        backgroundColor: { red: 0.12, green: 0.16, blue: 0.23 },
                        textFormat: { bold: true, fontSize: 10, foregroundColor: { red: 1, green: 1, blue: 1 } },
                        horizontalAlignment: 'CENTER',
                        verticalAlignment: 'MIDDLE',
                        wrapStrategy: 'WRAP'
                      }
                    }))
                  }
                ],
                fields: 'userEnteredValue,userEnteredFormat'
              }
            },
            {
              autoResizeDimensions: {
                dimensions: { sheetId: newSheetId, dimension: 'COLUMNS', startIndex: 0, endIndex: CHAT_HEADERS.length }
              }
            }
          ]
        }
      });
    }
  } catch (e) {
    console.warn(`[guest-messages] Ошибка создания листа ${sheetTitle}:`, e.message);
  }
}

// Отправка уведомления суперхозяину в Telegram
async function notifyHostTelegram(guestName, guestContact, messageText, attachmentUrl) {
  const botToken = (process.env.TELEGRAM_BOT_TOKEN || '').trim();
  const ownerChatId = (process.env.TELEGRAM_CHAT_ID || '').trim().replace(/^["']|["']$/g, '');

  if (!botToken || !ownerChatId) return;

  try {
    let alertText = `💬 Новое сообщение от гостя на сайте!\n\n` +
      `👤 Гость: ${guestName || 'Без имени'}\n` +
      `📞 Контакт: ${guestContact}\n` +
      `⏰ Время: ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' })}\n\n` +
      `Текст сообщения:\n${messageText}`;

    if (attachmentUrl) {
      alertText += `\n\n📎 Вложение: ${attachmentUrl}`;
    }

    const replyMarkup = {
      inline_keyboard: [
        [{ text: `✍️ Ответить гостю`, callback_data: `reply_${guestContact}` }],
        [{ text: `📜 Читать историю`, callback_data: `history_${guestContact}` }]
      ]
    };

    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: ownerChatId,
        text: alertText,
        reply_markup: replyMarkup
      })
    });
  } catch (tgErr) {
    console.warn('[guest-messages] Ошибка отправки в Telegram:', tgErr.message);
  }
}

// Парсинг строки сообщений чата: поддержка 10-колоночного и 7-колоночного стандартов
function parseRowToMessage(r) {
  if (!Array.isArray(r) || r.length === 0) return null;

  const date = r[0] || '';
  const sender = r[1] || '';
  const text = r[2] || '';
  const ru = r[3] && !r[3].toString().startsWith('#') ? r[3] : text;
  const en = r[4] && !r[4].toString().startsWith('#') ? r[4] : text;
  const tr = r[5] && !r[5].toString().startsWith('#') ? r[5] : text;
  const attachmentUrl = r[6] || '';
  const status = r[7] || 'Доставлено';
  const channel = r[8] || 'Веб-сайт';
  const meta = r[9] || '';

  return {
    date,
    sender,
    text,
    original: text,
    ru,
    en,
    tr,
    attachmentUrl,
    file: attachmentUrl,
    status,
    channel,
    meta
  };
}

export default async function handler(req, res) {
  // GET: Чтение истории сообщений чата
  if (req.method === 'GET') {
    const guestContact = (req.query.guestContact || req.query.contact || '').toString().trim();
    const guestName = (req.query.guestName || req.query.name || 'Гость').toString().trim();

    if (!guestContact) {
      return res.status(400).json({ success: false, error: 'Параметр guestContact обязателен.' });
    }

    const sheets = await getSheetsClient();
    if (!sheets) {
      return res.status(200).json({ success: true, messages: [], warning: 'Google Sheets не подключен.' });
    }

    try {
      const existingTitle = await findExistingChatSheet(sheets, CHATS_SPREADSHEET_ID, guestContact);
      const sheetTitle = existingTitle || getChatSheetTitle(guestName, guestContact);

      const rowsRes = await sheets.spreadsheets.values.get({
        spreadsheetId: CHATS_SPREADSHEET_ID,
        range: `'${sheetTitle}'!A2:J`
      }).catch(() => ({ data: { values: [] } }));

      const rawValues = rowsRes.data?.values || [];
      const messages = rawValues
        .map(parseRowToMessage)
        .filter(Boolean);

      return res.status(200).json({
        success: true,
        sheetTitle,
        count: messages.length,
        messages
      });
    } catch (err) {
      console.warn('[guest-messages] Ошибка чтения сообщений:', err.message);
      return res.status(200).json({ success: true, messages: [], error: err.message });
    }
  }

  // POST: Отправка нового сообщения гостя
  if (req.method === 'POST') {
    const body = req.body || {};
    const guestContact = (body.guestContact || body.contact || '').toString().trim();
    const guestName = (body.guestName || body.name || 'Гость').toString().trim();
    const messageText = (body.message || body.text || '').toString().trim();
    const attachmentUrl = (body.attachmentUrl || body.file || '').toString().trim();
    const channel = (body.channel || 'Веб-сайт').toString().trim();

    if (!guestContact) {
      return res.status(400).json({ success: false, error: 'Поле guestContact обязательно.' });
    }
    if (!messageText && !attachmentUrl) {
      return res.status(400).json({ success: false, error: 'Сообщение не может быть пустым.' });
    }

    const sheets = await getSheetsClient();
    if (!sheets) {
      return res.status(500).json({ success: false, error: 'Сервер Google Sheets не настроен.' });
    }

    try {
      const existingTitle = await findExistingChatSheet(sheets, CHATS_SPREADSHEET_ID, guestContact);
      const sheetTitle = existingTitle || getChatSheetTitle(guestName, guestContact);

      // Гарантируем создание листа с 10 колонками
      await ensureStyledChatSheet(sheets, CHATS_SPREADSHEET_ID, sheetTitle);

      const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });

      // Канонические формулы автоперевода со СТРОГОЙ ТОЧКОЙ С ЗАПЯТОЙ [;]
      const fRU = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "ru")';
      const fEN = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "en")';
      const fTR = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "tr")';

      // 10 колонок стандарта A..J: Время, Отправитель, Оригинал, RU, EN, TR, Вложение, Статус, Канал, Мета
      const rowValues = [
        timestamp,
        'Гость',
        messageText,
        fRU,
        fEN,
        fTR,
        attachmentUrl,
        'Отправлено',
        channel,
        ''
      ];

      await sheets.spreadsheets.values.append({
        spreadsheetId: CHATS_SPREADSHEET_ID,
        range: `'${sheetTitle}'!A:J`,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: { values: [rowValues] }
      });

      // Мгновенная тихая отправка в Telegram владельца
      notifyHostTelegram(guestName, guestContact, messageText, attachmentUrl).catch(() => { });

      return res.status(200).json({
        success: true,
        timestamp,
        sheetTitle,
        message: 'Сообщение успешно отправлено и сохранено в таблице чатов.'
      });
    } catch (err) {
      console.error('[guest-messages] Ошибка записи сообщения:', err.message);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Метод не поддерживается. Разрешены GET и POST.' });
}

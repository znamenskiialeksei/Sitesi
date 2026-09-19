// ==============================================================================
// TELEGRAM BOT WEBHOOK & CONTROLLER — ЦЕНТР УПРАВЛЕНИЯ ВЛАДЕЛЬЦА VILLA TURAMAN
// Файл: pages/api/telegram-webhook.js
// Назначение: Полноценный контроллер Telegram-бота для владельца виллы:
// 1. Постоянная нативная Reply-клавиатура управления на смартфоне;
// 2. Интерактивные Inline-кнопки модерации заявок (Одобрить 24ч HOLD, Спецпредложение, Отклонить);
// 3. Мгновенные ответы в чат гостя через свайп (Reply) или по кнопке ответа;
// 4. Просмотр календаря занятости, тарифов, диалогов и статуса платформы.
// ==============================================================================

import { google } from 'googleapis';
import { getLiveSheetMap, resolveRange } from '../../utils/sheetsRegistry';

// Вспомогательный кэш сессий ответов в памяти
const botSessions = global._tgBotSessions || (global._tgBotSessions = {});

// Нативная постоянная Reply-клавиатура на смартфоне владельца
const MAIN_KEYBOARD = {
  keyboard: [
    [{ text: "📋 Заявки и брони" }, { text: "💬 CRM Чаты" }],
    [{ text: "📅 Календарь дат" }, { text: "💳 Тарифы виллы" }],
    [{ text: "📢 Массовая рассылка" }, { text: "⚙️ Статус и Webhook" }]
  ],
  resize_keyboard: true,
  persistent: true
};

// Заголовки таблицы чатов
const CHAT_HEADERS = ["Дата и Время", "Отправитель", "Оригинал", "RU", "EN", "TR", "Ссылка на вложение"];

// Отправка сообщений в Telegram Bot API
async function tgApi(token, method, payload) {
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (err) {
    console.warn(`[Telegram API Error ${method}]:`, err.message);
    return null;
  }
}

// Инициализация Google Sheets клиента
async function getGoogleSheetsClient() {
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;

  if (!rawKey || !clientEmail || !spreadsheetId) return null;

  try {
    let key = rawKey.replace(/^["']|["']$/g, '');
    key = key.replace(/\\\\n/g, '\n').replace(/\\n/g, '\n');
    key = key.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();

    const auth = new google.auth.GoogleAuth({
      credentials: { client_email: clientEmail, private_key: key },
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: 'v4', auth });
    return { sheets, spreadsheetId };
  } catch (err) {
    console.warn('[Google Sheets Init Error]:', err.message);
    return null;
  }
}

// Гарантированное создание и форматирование листа чата гостя
async function ensureStyledChatSheet(sheets, targetChatId, sheetTitle) {
  if (!sheets || !targetChatId || !sheetTitle) return;
  try {
    const meta = await sheets.spreadsheets.get({ spreadsheetId: targetChatId });
    const existing = (meta.data.sheets || []).find((s) => s.properties.title === sheetTitle);

    if (!existing) {
      const addRes = await sheets.spreadsheets.batchUpdate({
        spreadsheetId: targetChatId,
        requestBody: {
          requests: [{ addSheet: { properties: { title: sheetTitle, gridProperties: { frozenRowCount: 1 } } } }]
        }
      });
      const newSheetId = addRes.data.replies?.[0]?.addSheet?.properties?.sheetId;
      if (newSheetId !== undefined) {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId: targetChatId,
          requestBody: {
            requests: [
              {
                updateCells: {
                  start: { sheetId: newSheetId, rowIndex: 0, columnIndex: 0 },
                  rows: [{
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
                  }],
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
    }
  } catch (e) {
    console.warn(`[ensureStyledChatSheet Warning for ${sheetTitle}]:`, e.message);
  }
}

export default async function handler(req, res) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const ownerChatId = process.env.TELEGRAM_CHAT_ID;

  // Ответ на GET запрос: проверка статуса вебхука
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'active',
      service: 'Villa Turaman Telegram Controller',
      configured: Boolean(token && ownerChatId)
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!token) {
    return res.status(500).json({ error: 'TELEGRAM_BOT_TOKEN не задан в переменных окружения' });
  }

  const update = req.body;
  if (!update) {
    return res.status(200).json({ ok: true });
  }

  const gClient = await getGoogleSheetsClient();
  const sheets = gClient?.sheets;
  const spreadsheetId = gClient?.spreadsheetId;
  const chatsSpreadsheetId = process.env.GOOGLE_CHATS_SPREADSHEET_ID || spreadsheetId;
  const sheetMap = sheets ? await getLiveSheetMap(sheets, spreadsheetId) : {};

  // ==============================================================================
  // 1. ОБРАБОТКА CALLBACK QUERY (НАЖАТИЯ НА INLINE-КНОПКИ)
  // ==============================================================================
  if (update.callback_query) {
    const cq = update.callback_query;
    const cqId = cq.id;
    const data = cq.data || '';
    const fromId = cq.from?.id;
    const msg = cq.message;
    const msgId = msg?.message_id;
    const chatId = msg?.chat?.id;

    // Проверка прав владельца
    if (ownerChatId && String(fromId) !== String(ownerChatId)) {
      await tgApi(token, 'answerCallbackQuery', {
        callback_query_id: cqId,
        text: '⛔ Действие доступно только подтвержденному владельцу виллы.',
        show_alert: true
      });
      return res.status(200).json({ ok: true });
    }

    // --- Действие: Одобрение заявки (24ч HOLD) ---
    if (data.startsWith('approve_')) {
      const parts = data.split('_');
      const rowIndex = parseInt(parts[1], 10);
      const contact = parts.slice(2).join('_');

      try {
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
        const deadlineStr = new Date(expiresAt).toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
        const statusStr = `ОЖИДАЕТ ОПЛАТЫ | ${expiresAt}`;

        if (sheets && spreadsheetId) {
          // 1. Обновляем статус в листе бронирований (колонка K)
          await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: resolveRange(sheetMap, 'BOOKINGS', `K${rowIndex + 1}`),
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: [[statusStr]] }
          });

          // 2. Получаем строку заявки для деталей календаря
          const rowData = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: resolveRange(sheetMap, 'BOOKINGS', `A${rowIndex + 1}:K${rowIndex + 1}`)
          });
          const r = rowData.data.values?.[0] || [];
          const guestName = r[1] || 'Гость';
          const checkIn = r[3] || '';
          const checkOut = r[4] || '';
          const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });

          // 3. Ставим HOLD в календарь
          const holdRow = [checkIn, checkOut, "Блокировка", `HOLD | ${contact} | ${expiresAt}`, "Одобрено в Telegram (Ожидает оплаты)", "TelegramBot", timestamp];
          await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: resolveRange(sheetMap, 'CALENDAR', 'A:G'),
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            requestBody: { values: [holdRow] }
          });

          // 4. Отправляем уведомление гостю в чат
          const chatSheetName = `Chat_${guestName.replace(/[\\/?*[\]]/g, '').trim().substring(0, 15)}_${contact.replace(/[\\/?*[\]]/g, '').trim().substring(0, 30)}`;
          await ensureStyledChatSheet(sheets, chatsSpreadsheetId, chatSheetName);

          const fRU = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "ru")';
          const fEN = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "en")';
          const fTR = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "tr")';
          const guestMsg = `✅ Ваша заявка на даты ${checkIn} - ${checkOut} одобрена владельцем через Telegram!\nДаты удержаны за вами на 24 часа. Пожалуйста, завершите онлайн-оплату в личном кабинете на сайте.`;

          await sheets.spreadsheets.values.append({
            spreadsheetId: chatsSpreadsheetId,
            range: `'${chatSheetName}'!A:G`,
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            requestBody: { values: [[timestamp, "Владелец", guestMsg, fRU, fEN, fTR, ""]] }
          });
        }

        await tgApi(token, 'answerCallbackQuery', {
          callback_query_id: cqId,
          text: `✅ Заявка #${rowIndex} для ${contact} успешно одобрена на 24 часа!`,
          show_alert: true
        });

        // Редактируем сообщение в Telegram с обновленным статусом
        const updatedText = (msg.text || '') + `\n\n🟢 СТАТУС: ОДОБРЕНО ВЛАДЕЛЬЦЕМ (ОЖИДАЕТ ОПЛАТЫ ДО ${deadlineStr})`;
        await tgApi(token, 'editMessageText', {
          chat_id: chatId,
          message_id: msgId,
          text: updatedText,
          reply_markup: {
            inline_keyboard: [
              [{ text: `✍️ Написать гостю (${contact})`, callback_data: `reply_${contact}` }]
            ]
          }
        });
      } catch (err) {
        console.error('[Approve Callback Error]:', err);
        await tgApi(token, 'answerCallbackQuery', {
          callback_query_id: cqId,
          text: `❌ Ошибка одобрения: ${err.message}`,
          show_alert: true
        });
      }
      return res.status(200).json({ ok: true });
    }

    // --- Действие: Отклонение заявки ---
    if (data.startsWith('reject_')) {
      const parts = data.split('_');
      const rowIndex = parseInt(parts[1], 10);
      const contact = parts.slice(2).join('_');

      try {
        if (sheets && spreadsheetId) {
          await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: resolveRange(sheetMap, 'BOOKINGS', `K${rowIndex + 1}`),
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: [["ОТКЛОНЕНО"]] }
          });
        }

        await tgApi(token, 'answerCallbackQuery', {
          callback_query_id: cqId,
          text: `❌ Заявка #${rowIndex} отклонена.`,
          show_alert: false
        });

        const updatedText = (msg.text || '') + `\n\n🔴 СТАТУС: ЗАЯВКА ОТКЛОНЕНА ВЛАДЕЛЬЦЕМ`;
        await tgApi(token, 'editMessageText', {
          chat_id: chatId,
          message_id: msgId,
          text: updatedText,
          reply_markup: { inline_keyboard: [] }
        });
      } catch (err) {
        await tgApi(token, 'answerCallbackQuery', {
          callback_query_id: cqId,
          text: `❌ Ошибка: ${err.message}`,
          show_alert: true
        });
      }
      return res.status(200).json({ ok: true });
    }

    // --- Действие: Подготовка ответа гостю в чат ---
    if (data.startsWith('reply_')) {
      const contact = data.replace('reply_', '');
      botSessions[`reply_${chatId}`] = contact;

      await tgApi(token, 'answerCallbackQuery', {
        callback_query_id: cqId,
        text: `✍️ Выбран гость: ${contact}`,
        show_alert: false
      });

      await tgApi(token, 'sendMessage', {
        chat_id: chatId,
        text: `✍️ Введите сообщение для гостя (${contact}):\n(Отправьте текст прямо сюда в чат, и он моментально отобразится у гостя на сайте):`,
        reply_markup: {
          force_reply: true
        }
      });
      return res.status(200).json({ ok: true });
    }

    // --- Действие: Просмотр истории переписки с гостем ---
    if (data.startsWith('history_')) {
      const contact = data.replace('history_', '');
      try {
        let historyText = `📜 История переписки с ${contact}:\n\n`;
        if (sheets && chatsSpreadsheetId) {
          const chatMeta = await sheets.spreadsheets.get({ spreadsheetId: chatsSpreadsheetId });
          const targetSheet = (chatMeta.data.sheets || []).find((s) => s.properties.title.toLowerCase().includes(contact.toLowerCase()));
          if (targetSheet) {
            const rows = await sheets.spreadsheets.values.get({
              spreadsheetId: chatsSpreadsheetId,
              range: `'${targetSheet.properties.title}'!A:C`
            });
            const values = (rows.data.values || []).slice(1);
            const lastMsgs = values.slice(-6);
            if (lastMsgs.length > 0) {
              lastMsgs.forEach((m) => {
                historyText += `[${m[0] || ''}] ${m[1] || ''}: ${m[2] || ''}\n`;
              });
            } else {
              historyText += 'Переписка пока пуста.';
            }
          } else {
            historyText += 'Лист переписки пока не создан в таблице.';
          }
        }
        await tgApi(token, 'sendMessage', {
          chat_id: chatId,
          text: historyText,
          reply_markup: {
            inline_keyboard: [
              [{ text: `✍️ Ответить гостю (${contact})`, callback_data: `reply_${contact}` }]
            ]
          }
        });
      } catch (err) {
        await tgApi(token, 'sendMessage', { chat_id: chatId, text: `Ошибка загрузки истории: ${err.message}` });
      }
      return res.status(200).json({ ok: true });
    }
  }

  // ==============================================================================
  // 2. ОБРАБОТКА ВХОДЯЩИХ ТЕКСТОВЫХ СООБЩЕНИЙ И КОМАНД
  // ==============================================================================
  if (update.message) {
    const msg = update.message;
    const text = (msg.text || '').trim();
    const chatId = msg.chat?.id;
    const fromId = msg.from?.id;

    // Проверка доступа: только владелец
    if (ownerChatId && String(fromId) !== String(ownerChatId) && String(chatId) !== String(ownerChatId)) {
      await tgApi(token, 'sendMessage', {
        chat_id: chatId,
        text: '⛔ Доступ ограничен. Этот бот предназначен исключительно для владельца виллы Villa Turaman.'
      });
      return res.status(200).json({ ok: true });
    }

    // --- Обработка ответа через Telegram Reply (свайп на сообщение гостя) ---
    const replyTo = msg.reply_to_message;
    let targetContact = null;

    if (replyTo && replyTo.text) {
      const origText = replyTo.text;
      const contactMatch = origText.match(/Контакт:\s*([^\n\r]+)/i) || origText.match(/📞\s*([^\n\r]+)/i);
      if (contactMatch && contactMatch[1]) {
        targetContact = contactMatch[1].trim();
      }
    }

    // Либо контакт сохранен в активной сессии ввода ответа
    if (!targetContact && botSessions[`reply_${chatId}`]) {
      targetContact = botSessions[`reply_${chatId}`];
      delete botSessions[`reply_${chatId}`];
    }

    // Если это текст ответа гостю: отправляем на сайт в Google Таблицу чатов
    if (targetContact && text && !text.startsWith('/')) {
      try {
        const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
        const cleanContact = targetContact.replace(/[\\/?*[\]]/g, '').trim();

        if (sheets && chatsSpreadsheetId) {
          const chatMeta = await sheets.spreadsheets.get({ spreadsheetId: chatsSpreadsheetId });
          let targetSheetTitle = (chatMeta.data.sheets || []).find((s) => s.properties.title.toLowerCase().includes(cleanContact.toLowerCase()))?.properties?.title;

          if (!targetSheetTitle) {
            targetSheetTitle = `Chat_Гость_${cleanContact.substring(0, 30)}`;
            await ensureStyledChatSheet(sheets, chatsSpreadsheetId, targetSheetTitle);
          }

          const fRU = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "ru")';
          const fEN = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "en")';
          const fTR = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "tr")';

          await sheets.spreadsheets.values.append({
            spreadsheetId: chatsSpreadsheetId,
            range: `'${targetSheetTitle}'!A:G`,
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            requestBody: { values: [[timestamp, "Владелец", text, fRU, fEN, fTR, ""]] }
          });
        }

        await tgApi(token, 'sendMessage', {
          chat_id: chatId,
          text: `✅ Ваше сообщение успешно доставлено гостю (${targetContact}) на сайт и сохранено в таблице чатов!`,
          reply_markup: MAIN_KEYBOARD
        });
      } catch (err) {
        await tgApi(token, 'sendMessage', {
          chat_id: chatId,
          text: `❌ Ошибка отправки сообщения гостю: ${err.message}`,
          reply_markup: MAIN_KEYBOARD
        });
      }
      return res.status(200).json({ ok: true });
    }

    // --- Команды: /start, /menu, "Главное меню" ---
    if (text === '/start' || text === '/menu' || text === 'Главное меню') {
      const welcomeText = `🏡 Добро пожаловать в Центр Управления Villa Turaman!\n\n` +
        `Здесь вы можете в реальном времени:\n` +
        `• Модерировать заявки и ставить 24ч HOLD;\n` +
        `• Отвечать гостям в чат на сайте прямо из Telegram;\n` +
        `• Проверять календарь дат и тарифы виллы;\n` +
        `• Делать массовые рассылки.\n\n` +
        `Выберите нужный раздел в меню ниже 👇`;

      await tgApi(token, 'sendMessage', {
        chat_id: chatId,
        text: welcomeText,
        reply_markup: MAIN_KEYBOARD
      });
      return res.status(200).json({ ok: true });
    }

    // --- Раздел: 📋 Заявки и брони ---
    if (text === '📋 Заявки и брони' || text === '/requests') {
      try {
        if (!sheets || !spreadsheetId) {
          await tgApi(token, 'sendMessage', { chat_id: chatId, text: '❌ Ошибка подключения к Google Таблицам.' });
          return res.status(200).json({ ok: true });
        }

        const bookingDb = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: resolveRange(sheetMap, 'BOOKINGS', 'A:K')
        });

        const rows = (bookingDb.data.values || []).slice(1);
        const pending = rows
          .map((r, i) => ({ rowIndex: i + 1, r }))
          .filter(({ r }) => {
            const status = (r[10] || '').toUpperCase();
            return status.includes('ЗАПРОС') || status.includes('ОЖИДАЕТ') || status.includes('СПЕЦПРЕДЛОЖЕНИЕ');
          });

        if (pending.length === 0) {
          await tgApi(token, 'sendMessage', {
            chat_id: chatId,
            text: '🎉 В данный момент нет активных заявок, ожидающих модерации.\nВсе заявки обработаны!',
            reply_markup: MAIN_KEYBOARD
          });
          return res.status(200).json({ ok: true });
        }

        await tgApi(token, 'sendMessage', {
          chat_id: chatId,
          text: `📋 Найдено активных заявок: ${pending.length}. Отправляю карточки для модерации 👇`
        });

        for (const item of pending) {
          const r = item.r;
          const idx = item.rowIndex;
          const guestName = r[1] || 'Гость';
          const contact = r[2] || 'Без контакта';
          const checkIn = r[3] || '-';
          const checkOut = r[4] || '-';
          const nights = r[5] || '1';
          const guests = r[8] || '2';
          const price = r[9] || '-';
          const status = r[10] || 'ЗАПРОС';

          const cardText = `📋 Заявка #${idx}\n` +
            `👤 Имя: ${guestName}\n` +
            `📞 Контакт: ${contact}\n` +
            `📅 Даты: ${checkIn} - ${checkOut} (${nights} ночей)\n` +
            `👥 Гостей: ${guests}\n` +
            `💰 Стоимость: ${price}\n` +
            `🏷️ Текущий статус: ${status}`;

          const inlineKeyboard = [
            [
              { text: "✅ Одобрить 24ч HOLD", callback_data: `approve_${idx}_${contact}` },
              { text: "❌ Отклонить", callback_data: `reject_${idx}_${contact}` }
            ],
            [
              { text: `✍️ Написать в чат`, callback_data: `reply_${contact}` }
            ]
          ];

          await tgApi(token, 'sendMessage', {
            chat_id: chatId,
            text: cardText,
            reply_markup: { inline_keyboard: inlineKeyboard }
          });
        }
      } catch (err) {
        await tgApi(token, 'sendMessage', { chat_id: chatId, text: `Ошибка получения заявок: ${err.message}` });
      }
      return res.status(200).json({ ok: true });
    }

    // --- Раздел: 💬 CRM Чаты ---
    if (text === '💬 CRM Чаты' || text === '/chats') {
      try {
        if (!sheets || !chatsSpreadsheetId) {
          await tgApi(token, 'sendMessage', { chat_id: chatId, text: '❌ База чатов недоступна.' });
          return res.status(200).json({ ok: true });
        }

        const chatMeta = await sheets.spreadsheets.get({ spreadsheetId: chatsSpreadsheetId });
        const chatSheets = (chatMeta.data.sheets || []).filter((s) => s.properties.title.startsWith('Chat_'));

        if (chatSheets.length === 0) {
          await tgApi(token, 'sendMessage', {
            chat_id: chatId,
            text: '💬 В базе пока нет созданных диалогов с гостями.',
            reply_markup: MAIN_KEYBOARD
          });
          return res.status(200).json({ ok: true });
        }

        let summary = `💬 Активные диалоги с гостями (${chatSheets.length}):\n\n`;
        const buttons = [];

        for (const s of chatSheets.slice(-8)) {
          const title = s.properties.title;
          const parts = title.split('_');
          const clientName = parts[1] || 'Гость';
          const clientContact = parts.slice(2).join('_') || parts[2] || '';

          summary += `• ${clientName} (${clientContact})\n`;
          buttons.push([
            { text: `✍️ ${clientName}`, callback_data: `reply_${clientContact}` },
            { text: `📜 Читать`, callback_data: `history_${clientContact}` }
          ]);
        }

        await tgApi(token, 'sendMessage', {
          chat_id: chatId,
          text: summary + `\nНажмите кнопку для ответа гостю:`,
          reply_markup: { inline_keyboard: buttons }
        });
      } catch (err) {
        await tgApi(token, 'sendMessage', { chat_id: chatId, text: `Ошибка загрузки чатов: ${err.message}` });
      }
      return res.status(200).json({ ok: true });
    }

    // --- Раздел: 📅 Календарь дат ---
    if (text === '📅 Календарь дат' || text === '/calendar') {
      try {
        if (!sheets || !spreadsheetId) {
          await tgApi(token, 'sendMessage', { chat_id: chatId, text: '❌ Календарь недоступен.' });
          return res.status(200).json({ ok: true });
        }

        const calData = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: resolveRange(sheetMap, 'CALENDAR', 'A:E')
        });

        const calRows = (calData.data.values || []).slice(1).slice(-10);
        let calText = `📅 Последние 10 записей и блокировок календаря:\n\n`;

        if (calRows.length === 0) {
          calText += 'Записей блокировок пока нет. Все даты доступны для бронирования.';
        } else {
          calRows.forEach((r) => {
            calText += `• ${r[0] || ''} — ${r[1] || ''}: ${r[2] || ''} (${r[3] || ''})\n`;
          });
        }

        await tgApi(token, 'sendMessage', {
          chat_id: chatId,
          text: calText,
          reply_markup: MAIN_KEYBOARD
        });
      } catch (err) {
        await tgApi(token, 'sendMessage', { chat_id: chatId, text: `Ошибка календаря: ${err.message}` });
      }
      return res.status(200).json({ ok: true });
    }

    // --- Раздел: 💳 Тарифы виллы ---
    if (text === '💳 Тарифы виллы' || text === '/prices') {
      try {
        const pricesText = `💳 Информация о тарифах Villa Turaman:\n\n` +
          `• Базовый тариф виллы: динамический расчет по сезону;\n` +
          `• Блокировка HOLD: 24 часа с момента одобрения владельцем;\n` +
          `• Оплата: онлайн через личный кабинет гостя;\n` +
          `• Управление ценами: доступно в кабинете хозяина /host или в Google Таблице (лист «📅 Календарь и Тарифы»).`;

        await tgApi(token, 'sendMessage', {
          chat_id: chatId,
          text: pricesText,
          reply_markup: MAIN_KEYBOARD
        });
      } catch (err) {
        await tgApi(token, 'sendMessage', { chat_id: chatId, text: `Ошибка тарифов: ${err.message}` });
      }
      return res.status(200).json({ ok: true });
    }

    // --- Раздел: 📢 Массовая рассылка ---
    if (text === '📢 Массовая рассылка') {
      const broadcastHelp = `📢 Режим массовой рассылки гостям:\n\n` +
        `Чтобы разослать сообщение сразу всем гостям в их чаты на сайте, отправьте текст в формате:\n\n` +
        `/broadcast_all Здравствуйте! Напоминаем о правилах проживания на вилле.`;

      await tgApi(token, 'sendMessage', {
        chat_id: chatId,
        text: broadcastHelp,
        reply_markup: MAIN_KEYBOARD
      });
      return res.status(200).json({ ok: true });
    }

    // Выполнение массовой рассылки
    if (text.startsWith('/broadcast_all ')) {
      const bMsg = text.replace('/broadcast_all ', '').trim();
      if (!bMsg) {
        await tgApi(token, 'sendMessage', { chat_id: chatId, text: 'Укажите текст рассылки.' });
        return res.status(200).json({ ok: true });
      }

      try {
        if (sheets && chatsSpreadsheetId) {
          const chatMeta = await sheets.spreadsheets.get({ spreadsheetId: chatsSpreadsheetId });
          const chatSheets = (chatMeta.data.sheets || []).filter((s) => s.properties.title.startsWith('Chat_'));
          const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
          const fRU = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "ru")';
          const fEN = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "en")';
          const fTR = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "tr")';

          for (const s of chatSheets) {
            await ensureStyledChatSheet(sheets, chatsSpreadsheetId, s.properties.title);
            await sheets.spreadsheets.values.append({
              spreadsheetId: chatsSpreadsheetId,
              range: `'${s.properties.title}'!A:G`,
              valueInputOption: 'USER_ENTERED',
              insertDataOption: 'INSERT_ROWS',
              requestBody: { values: [[timestamp, "Владелец", bMsg, fRU, fEN, fTR, ""]] }
            });
          }

          await tgApi(token, 'sendMessage', {
            chat_id: chatId,
            text: `📢 Массовая рассылка успешно отправлена во все диалоги (${chatSheets.length} листов)!`,
            reply_markup: MAIN_KEYBOARD
          });
        }
      } catch (err) {
        await tgApi(token, 'sendMessage', { chat_id: chatId, text: `Ошибка рассылки: ${err.message}` });
      }
      return res.status(200).json({ ok: true });
    }

    // --- Раздел: ⚙️ Статус и Webhook ---
    if (text === '⚙️ Статус и Webhook' || text === '/status') {
      try {
        const statusText = `⚙️ Статус платформы Villa Turaman:\n\n` +
          `• Сервер сайта: Next.js Vercel (Онлайн 🟢)\n` +
          `• Основная база Google Sheets: ${spreadsheetId ? 'Подключена ✅' : 'Не настроена ❌'}\n` +
          `• База чатов Google Sheets: ${chatsSpreadsheetId ? 'Подключена ✅' : 'Не настроена ❌'}\n` +
          `• Webhook Telegram: Активен (/api/telegram-webhook) 🟢\n` +
          `• Chat ID владельца: ${ownerChatId || 'Не указан'}\n\n` +
          `Все системы работают в штатном режиме.`;

        await tgApi(token, 'sendMessage', {
          chat_id: chatId,
          text: statusText,
          reply_markup: MAIN_KEYBOARD
        });
      } catch (err) {
        await tgApi(token, 'sendMessage', { chat_id: chatId, text: `Ошибка статуса: ${err.message}` });
      }
      return res.status(200).json({ ok: true });
    }

    // Ответ по умолчанию
    await tgApi(token, 'sendMessage', {
      chat_id: chatId,
      text: `Команда принята. Используйте кнопки меню для управления виллой 👇`,
      reply_markup: MAIN_KEYBOARD
    });
  }

  return res.status(200).json({ ok: true });
}

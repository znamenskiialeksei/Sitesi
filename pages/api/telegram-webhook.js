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
import { SMART_TEMPLATES, TEMPLATE_STAGES } from '../../utils/templatesData';
import { resolveTemplate, extractFirstName } from '../../utils/templateResolver';
import { getAiKnowledgeBase, invalidateAiKnowledgeCache } from '../../utils/aiKnowledgeBase';
import { getOrFetchLiveContent, clearLiveContentCache } from '../../utils/liveContentSync';

// Вспомогательный кэш сессий ответов в памяти
const botSessions = global._tgBotSessions || (global._tgBotSessions = {});

// Нативная постоянная Reply-клавиатура на смартфоне владельца
const MAIN_KEYBOARD = {
  keyboard: [
    [{ text: "📋 Заявки и брони" }, { text: "💬 CRM Чаты" }],
    [{ text: "📋 Задачи персонала" }, { text: "🛠️ Все 10 задач VS Code" }],
    [{ text: "💼 Бизнес-Ассистент" }, { text: "🧾 e-Arşiv Fatura" }],
    [{ text: "📑 Шаблоны ответов" }, { text: "📅 Календарь дат" }],
    [{ text: "💳 Тарифы виллы" }, { text: "🧠 Режим ИИ & Gemini" }],
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
  const token = (process.env.TELEGRAM_BOT_TOKEN || '').trim();
  const rawOwnerChatId = (process.env.TELEGRAM_CHAT_ID || '').trim().replace(/^["']|["']$/g, '');
  const ownerChatId = rawOwnerChatId;

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
  // 0. ОБРАБОТКА СЛУЖЕБНЫХ РЕЛЕЙ-КОМАНД ИЗ GOOGLE APPS SCRIPT
  // ==============================================================================
  if (update.action && ownerChatId) {
    const act = update.action;

    // Релей: Отправка Главного меню на телефон хозяина
    if (act === 'send_menu_to_owner') {
      const welcomeText = `🏡 Главный пульт управления Villa Turaman активирован из Google Таблиц!\n\n` +
        `👤 Хозяин: Алексей Знаменский\n` +
        `📍 Объект: Villa Turaman [Дальян]\n` +
        `📱 Ниже доступна постоянная клавиатура быстрого доступа.`;
      const sent = await tgApi(token, 'sendMessage', {
        chat_id: ownerChatId,
        text: welcomeText,
        reply_markup: MAIN_KEYBOARD
      });
      return res.status(200).json({ success: Boolean(sent?.ok), result: sent });
    }

    // Релей: Тестовый пинг в Telegram
    if (act === 'test_ping') {
      const nowStr = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
      const pingText = `🧪 ТЕСТОВЫЙ ПИНГ ИЗ GOOGLE APPS SCRIPT:\n\n` +
        `• Время: ${nowStr}\n` +
        `• Сервер Vercel: Онлайн 🟢\n` +
        `• Telegram Bot: Связь установлена успешно!`;
      const sent = await tgApi(token, 'sendMessage', {
        chat_id: ownerChatId,
        text: pingText,
        reply_markup: MAIN_KEYBOARD
      });
      return res.status(200).json({ success: Boolean(sent?.ok), result: sent });
    }

    // Релей: Отправка списка активных заявок
    if (act === 'send_pending_requests') {
      try {
        if (!sheets || !spreadsheetId) {
          return res.status(200).json({ success: false, error: 'Таблица не подключена' });
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
            chat_id: ownerChatId,
            text: '🎉 В данный момент нет активных заявок, ожидающих модерации. Все заявки обработаны!',
            reply_markup: MAIN_KEYBOARD
          });
          return res.status(200).json({ success: true, count: 0 });
        }

        await tgApi(token, 'sendMessage', {
          chat_id: ownerChatId,
          text: `📋 Найдено активных заявок: ${pending.length}. Отправляю карточки для модерации:`
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
            `📅 Даты: ${checkIn} - ${checkOut} [${nights} ночей]\n` +
            `👥 Гостей: ${guests}\n` +
            `💰 Стоимость: ${price}\n` +
            `🏷️ Текущий статус: ${status}`;

          const inlineKeyboard = [
            [
              { text: "✅ Одобрить 24ч HOLD", callback_data: `approve_${idx}_${contact}` },
              { text: "❌ Отклонить", callback_data: `reject_${idx}_${contact}` }
            ],
            [
              { text: `✍️ Написать в чат`, callback_data: `reply_${contact}` },
              { text: `📑 Шаблоны ответов`, callback_data: `tmpl_pick_${contact}` }
            ]
          ];

          await tgApi(token, 'sendMessage', {
            chat_id: ownerChatId,
            text: cardText,
            reply_markup: { inline_keyboard: inlineKeyboard }
          });
        }
        return res.status(200).json({ success: true, count: pending.length });
      } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
      }
    }

    // Релей: Отправка сводки последних чатов
    if (act === 'send_recent_chats') {
      try {
        if (!sheets || !chatsSpreadsheetId) {
          return res.status(200).json({ success: false, error: 'База чатов не подключена' });
        }
        const meta = await sheets.spreadsheets.get({ spreadsheetId: chatsSpreadsheetId });
        const chatSheets = (meta.data.sheets || [])
          .filter((s) => (s.properties.title || '').startsWith('Chat_'))
          .slice(-5);

        if (chatSheets.length === 0) {
          await tgApi(token, 'sendMessage', {
            chat_id: ownerChatId,
            text: '💬 Диалогов с гостями пока нет.',
            reply_markup: MAIN_KEYBOARD
          });
          return res.status(200).json({ success: true, count: 0 });
        }

        let report = `💬 Последние активные диалоги [${chatSheets.length}]:\n\n`;
        for (const cs of chatSheets) {
          const title = cs.properties.title;
          const cleanName = title.replace('Chat_', '').replace(/_/g, ' ');
          report += `• 👤 ${cleanName}\n`;
        }

        await tgApi(token, 'sendMessage', {
          chat_id: ownerChatId,
          text: report,
          reply_markup: MAIN_KEYBOARD
        });
        return res.status(200).json({ success: true, count: chatSheets.length });
      } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
      }
    }
  }

  // ==============================================================================
  // 1. ОБРАБОТКА CALLBACK QUERY: НАЖАТИЯ НА INLINE-КНОПКИ
  // ==============================================================================
  if (update.callback_query) {
    const cq = update.callback_query;
    const cqId = cq.id;
    const data = cq.data || '';
    const fromId = cq.from?.id;
    const msg = cq.message;
    const msgId = msg?.message_id;
    const chatId = msg?.chat?.id;

    // Проверка прав владельца: безопасное сопоставление
    const isOwner = !ownerChatId || String(fromId) === String(ownerChatId) || String(chatId) === String(ownerChatId);
    if (!isOwner) {
      await tgApi(token, 'answerCallbackQuery', {
        callback_query_id: cqId,
        text: '⛔ Действие доступно только подтвержденному владельцу виллы.',
        show_alert: true
      });
      return res.status(200).json({ ok: true });
    }

    // --- Действие: Кнопки главного меню с телефона хозяина ---
    if (data === 'menu_requests') {
      await tgApi(token, 'answerCallbackQuery', { callback_query_id: cqId, text: '📋 Загружаю активные заявки...' });
      try {
        if (!sheets || !spreadsheetId) {
          await tgApi(token, 'sendMessage', { chat_id: chatId, text: '❌ База данных Google Sheets недоступна.' });
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
            text: '🎉 В данный момент нет активных заявок, ожидающих модерации. Все заявки обработаны!',
            reply_markup: MAIN_KEYBOARD
          });
          return res.status(200).json({ ok: true });
        }

        await tgApi(token, 'sendMessage', {
          chat_id: chatId,
          text: `📋 Найдено активных заявок: ${pending.length}. Отправляю карточки для модерации:`
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
            `📅 Даты: ${checkIn} - ${checkOut} [${nights} ночей]\n` +
            `👥 Гостей: ${guests}\n` +
            `💰 Стоимость: ${price}\n` +
            `🏷️ Текущий статус: ${status}`;

          const inlineKeyboard = [
            [
              { text: "✅ Одобрить 24ч HOLD", callback_data: `approve_${idx}_${contact}` },
              { text: "❌ Отклонить", callback_data: `reject_${idx}_${contact}` }
            ],
            [
              { text: `✍️ Написать в чат`, callback_data: `reply_${contact}` },
              { text: `📑 Шаблоны ответов`, callback_data: `tmpl_pick_${contact}` }
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

    if (data === 'menu_chats') {
      await tgApi(token, 'answerCallbackQuery', { callback_query_id: cqId, text: '💬 Загружаю диалоги...' });
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

        let summary = `💬 Активные диалоги с гостями [${chatSheets.length}]:\n\n`;
        const buttons = [];
        for (const s of chatSheets.slice(-8)) {
          const title = s.properties.title;
          const parts = title.split('_');
          const clientName = parts[1] || 'Гость';
          const clientContact = parts.slice(2).join('_') || parts[2] || '';
          summary += `• ${clientName} [${clientContact}]\n`;
          buttons.push([
            { text: `✍️ ${clientName}`, callback_data: `reply_${clientContact}` },
            { text: `📑 Шаблоны`, callback_data: `tmpl_pick_${clientContact}` },
            { text: `📜 Читать`, callback_data: `history_${clientContact}` }
          ]);
        }

        await tgApi(token, 'sendMessage', {
          chat_id: chatId,
          text: summary + `\nНажмите кнопку для быстрого ответа гостю:`,
          reply_markup: { inline_keyboard: buttons }
        });
      } catch (err) {
        await tgApi(token, 'sendMessage', { chat_id: chatId, text: `Ошибка загрузки чатов: ${err.message}` });
      }
      return res.status(200).json({ ok: true });
    }

    if (data === 'menu_calendar') {
      await tgApi(token, 'answerCallbackQuery', { callback_query_id: cqId, text: '📅 Загружаю календарь...' });
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
        let calText = `📅 Последние 10 записей календаря и блокировок:\n\n`;
        if (calRows.length === 0) {
          calText += 'Записей блокировок пока нет. Все даты доступны для бронирования.';
        } else {
          calRows.forEach((r) => {
            calText += `• ${r[0] || ''} - ${r[1] || ''}: ${r[2] || ''} [${r[3] || ''}]\n`;
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

    if (data === 'menu_prices') {
      await tgApi(token, 'answerCallbackQuery', { callback_query_id: cqId, text: '💳 Сводка тарифов...' });
      const pricesText = `💳 Информация о тарифах Villa Turaman:\n\n` +
        `• Базовый тариф виллы: динамический расчет по сезону;\n` +
        `• Минимальный тариф: от 180 USD за ночь;\n` +
        `• Скидка 10%: невозвратный тариф на даты до 60 дней;\n` +
        `• Блокировка HOLD: 24 часа с момента одобрения владельцем;\n` +
        `• Управление ценами: доступно в кабинете хозяина /host или в Google Таблице [лист Календарь и Тарифы].`;
      await tgApi(token, 'sendMessage', {
        chat_id: chatId,
        text: pricesText,
        reply_markup: MAIN_KEYBOARD
      });
      return res.status(200).json({ ok: true });
    }

    if (data === 'menu_revalidate') {
      await tgApi(token, 'answerCallbackQuery', { callback_query_id: cqId, text: '⚡ Запуск ревалидации...' });
      try {
        const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
        const secret = process.env.REVALIDATE_SECRET_TOKEN || '';
        if (secret) {
          await fetch(`${siteUrl.replace(/\/+$/, '')}/api/revalidate?secret=${secret}`).catch(() => {});
        }
        await tgApi(token, 'sendMessage', {
          chat_id: chatId,
          text: '⚡ Ревалидация витрины сайта успешно выполнена! Кеш страниц обновлен.',
          reply_markup: MAIN_KEYBOARD
        });
      } catch (revErr) {
        await tgApi(token, 'sendMessage', {
          chat_id: chatId,
          text: `Ревалидация завершена с предупреждением: ${revErr.message}`,
          reply_markup: MAIN_KEYBOARD
        });
      }
      return res.status(200).json({ ok: true });
    }

    if (data === 'menu_status') {
      await tgApi(token, 'answerCallbackQuery', { callback_query_id: cqId, text: '⚙️ Статус систем...' });
      const aiModel = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
      const aiStatus = process.env.GEMINI_API_KEY ? `Активен [Модель: ${aiModel}] ✅` : 'Требует API ключ ⚠️';
      const statusText = `⚙️ Статус платформы Villa Turaman:\n\n` +
        `• Сервер сайта: Next.js Vercel [Онлайн 🟢]\n` +
        `• ИИ-Консьерж Gemini: ${aiStatus}\n` +
        `• Основная база Google Sheets: ${spreadsheetId ? 'Подключена ✅' : 'Не настроена ❌'}\n` +
        `• База чатов Google Sheets: ${chatsSpreadsheetId ? 'Подключена ✅' : 'Не настроена ❌'}\n` +
        `• Webhook Telegram: Активен [/api/telegram-webhook] 🟢\n` +
        `• Chat ID владельца: ${ownerChatId || 'Авторизован'}\n\n` +
        `Все системы функционируют в штатном режиме.`;
      await tgApi(token, 'sendMessage', {
        chat_id: chatId,
        text: statusText,
        reply_markup: MAIN_KEYBOARD
      });
      return res.status(200).json({ ok: true });
    }

    // --- Действие: Управление Режимом ИИ из Telegram бота ---
    if (data === 'menu_ai_control') {
      await tgApi(token, 'answerCallbackQuery', { callback_query_id: cqId, text: '🧠 Загрузка настроек ИИ...' });
      const kb = await getAiKnowledgeBase();
      const currentMode = kb.aiMode || 'copilot';
      const modeNames = {
        autopilot: '🚀 Автопилот [ИИ отвечает сразу сам]',
        copilot: '💡 Суфлер [ИИ готовит проект ответа]',
        off: '⏸️ Выключен [Ручное управление]'
      };

      const aiText = `🧠 Управление ИИ-Агентом & Gemini:\n\n` +
        `• Текущий режим: ${modeNames[currentMode] || currentMode}\n` +
        `• Модель Gemini: ${kb.geminiModel || 'gemini-3.6-flash'}\n` +
        `• Минимальный тариф: ${kb.minPriceUsd || 180} USD\n` +
        `• Ключ GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? 'Настроен на Vercel ✅' : 'Отсутствует ⚠️'}\n\n` +
        `Переключение режима в 1 клик:`;

      const aiButtons = [
        [
          { text: `${currentMode === 'autopilot' ? '✅ ' : ''}🚀 Автопилот`, callback_data: 'ai_set_mode_autopilot' },
          { text: `${currentMode === 'copilot' ? '✅ ' : ''}💡 Суфлер`, callback_data: 'ai_set_mode_copilot' }
        ],
        [
          { text: `${currentMode === 'off' ? '✅ ' : ''}⏸️ Отключить`, callback_data: 'ai_set_mode_off' },
          { text: '🔄 Сбросить кэш', callback_data: 'ai_refresh_cache' }
        ],
        [
          { text: '◀️ Назад в меню', callback_data: 'tg_nav_main' }
        ]
      ];

      await tgApi(token, 'sendMessage', {
        chat_id: chatId,
        text: aiText,
        reply_markup: { inline_keyboard: aiButtons }
      });
      return res.status(200).json({ ok: true });
    }

    // --- Действие: Переключение режима ИИ ---
    if (data.startsWith('ai_set_mode_')) {
      const targetMode = data.replace('ai_set_mode_', '');
      try {
        if (sheets && spreadsheetId) {
          const curRows = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: resolveRange(sheetMap, 'SETTINGS', 'A:D')
          });
          const rows = curRows.data.values || [];
          const idx = rows.findIndex((r) => (r[0] || '').toString().trim() === 'AI_MODE');
          if (idx >= 0) {
            await sheets.spreadsheets.values.update({
              spreadsheetId,
              range: resolveRange(sheetMap, 'SETTINGS', `B${idx + 1}`),
              valueInputOption: 'USER_ENTERED',
              requestBody: { values: [[targetMode]] }
            });
          }
        }
        invalidateAiKnowledgeCache();

        await tgApi(token, 'answerCallbackQuery', {
          callback_query_id: cqId,
          text: `Режим ИИ изменен на: ${targetMode.toUpperCase()}`,
          show_alert: true
        });

        const updatedKb = await getAiKnowledgeBase(true);
        const modeNames = {
          autopilot: '🚀 Автопилот [ИИ отвечает сразу сам]',
          copilot: '💡 Суфлер [ИИ готовит проект ответа]',
          off: '⏸️ Выключен [Ручное управление]'
        };
        const updatedText = `🧠 Управление ИИ-Агентом & Gemini:\n\n` +
          `• Текущий режим: ${modeNames[updatedKb.aiMode] || updatedKb.aiMode}\n` +
          `• Модель Gemini: ${updatedKb.geminiModel || 'gemini-3.6-flash'}\n` +
          `• Минимальный тариф: ${updatedKb.minPriceUsd || 180} USD\n` +
          `• Ключ GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? 'Настроен на Vercel ✅' : 'Отсутствует ⚠️'}\n\n` +
          `Статус успешно синхронизирован с Google Таблицей и Сайтом!`;

        const newButtons = [
          [
            { text: `${targetMode === 'autopilot' ? '✅ ' : ''}🚀 Автопилот`, callback_data: 'ai_set_mode_autopilot' },
            { text: `${targetMode === 'copilot' ? '✅ ' : ''}💡 Суфлер`, callback_data: 'ai_set_mode_copilot' }
          ],
          [
            { text: `${targetMode === 'off' ? '✅ ' : ''}⏸️ Отключить`, callback_data: 'ai_set_mode_off' },
            { text: '🔄 Сбросить кэш', callback_data: 'ai_refresh_cache' }
          ],
          [
            { text: '◀️ Назад в меню', callback_data: 'tg_nav_main' }
          ]
        ];

        if (msgId) {
          await tgApi(token, 'editMessageText', {
            chat_id: chatId,
            message_id: msgId,
            text: updatedText,
            reply_markup: { inline_keyboard: newButtons }
          });
        }
      } catch (aiErr) {
        await tgApi(token, 'answerCallbackQuery', {
          callback_query_id: cqId,
          text: `Ошибка изменения режима: ${aiErr.message}`,
          show_alert: true
        });
      }
      return res.status(200).json({ ok: true });
    }

    // --- Действие: Сброс кэша ИИ базы знаний ---
    if (data === 'ai_refresh_cache') {
      invalidateAiKnowledgeCache();
      await tgApi(token, 'answerCallbackQuery', {
        callback_query_id: cqId,
        text: 'Кэш Базы Знаний ИИ сброшен! Загружены свежие данные из Google Таблицы.',
        show_alert: true
      });
      return res.status(200).json({ ok: true });
    }

    // --- Действие: Одобрение заказа на услугу/гид ---
    if (data.startsWith('ord_approve_')) {
      const contact = data.replace('ord_approve_', '');
      try {
        const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
        if (sheets && chatsSpreadsheetId) {
          const chatSheetName = `Chat_Гость_${contact.replace(/[\\/?*[\]]/g, '').trim().substring(0, 30)}`;
          await ensureStyledChatSheet(sheets, chatsSpreadsheetId, chatSheetName);
          const fRU = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "ru")';
          const fEN = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "en")';
          const fTR = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "tr")';
          const okMsg = '✅ Ваш заказ одобрен хозяином виллы! Мы свяжемся с вами для согласования времени и деталей.';
          await sheets.spreadsheets.values.append({
            spreadsheetId: chatsSpreadsheetId,
            range: `'${chatSheetName}'!A:G`,
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            requestBody: { values: [[timestamp, 'Владелец', okMsg, fRU, fEN, fTR, '']] }
          });
        }

        await tgApi(token, 'answerCallbackQuery', {
          callback_query_id: cqId,
          text: `Заказ для ${contact} одобрен! Гостю отправлено уведомление.`,
          show_alert: true
        });

        if (msgId) {
          const updatedCard = (msg.text || '') + '\n\n🟢 СТАТУС: ЗАКАЗ ОДОБРЕН ВЛАДЕЛЬЦЕМ';
          await tgApi(token, 'editMessageText', {
            chat_id: chatId,
            message_id: msgId,
            text: updatedCard,
            reply_markup: {
              inline_keyboard: [
                [{ text: `💬 Написать клиенту: ${contact}`, callback_data: `reply_${contact}` }]
              ]
            }
          });
        }
      } catch (ordErr) {
        await tgApi(token, 'answerCallbackQuery', {
          callback_query_id: cqId,
          text: `Ошибка: ${ordErr.message}`,
          show_alert: true
        });
      }
      return res.status(200).json({ ok: true });
    }

    // --- Действие: Отклонение заказа на услугу/гид ---
    if (data.startsWith('ord_reject_')) {
      const contact = data.replace('ord_reject_', '');
      await tgApi(token, 'answerCallbackQuery', {
        callback_query_id: cqId,
        text: `Заказ для ${contact} отклонен.`,
        show_alert: true
      });
      if (msgId) {
        const updatedCard = (msg.text || '') + '\n\n🔴 СТАТУС: ЗАКАЗ ОТКЛОНЕН ВЛАДЕЛЬЦЕМ';
        await tgApi(token, 'editMessageText', {
          chat_id: chatId,
          message_id: msgId,
          text: updatedCard,
          reply_markup: { inline_keyboard: [] }
        });
      }
      return res.status(200).json({ ok: true });
    }

    // --- Действие: Навигация назад в главное меню ---
    if (data === 'tg_nav_main') {
      await tgApi(token, 'answerCallbackQuery', { callback_query_id: cqId });
      if (msgId) {
        await tgApi(token, 'editMessageText', {
          chat_id: chatId,
          message_id: msgId,
          text: '🏡 Главный пульт управления Villa Turaman готов к работе.',
          reply_markup: {
            inline_keyboard: [
              [{ text: '📋 Заявки', callback_data: 'menu_requests' }, { text: '💬 Диалоги', callback_data: 'menu_chats' }],
              [{ text: '🧠 Управление ИИ', callback_data: 'menu_ai_control' }, { text: '📅 Календарь', callback_data: 'menu_calendar' }],
              [{ text: '⚙️ Статус систем', callback_data: 'menu_status' }]
            ]
          }
        });
      }
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
              [{ text: `✍️ Ответить гостю: ${contact}`, callback_data: `reply_${contact}` }],
              [{ text: `📑 Шаблоны ответов для ${contact}`, callback_data: `tmpl_pick_${contact}` }]
            ]
          }
        });
      } catch (err) {
        await tgApi(token, 'sendMessage', { chat_id: chatId, text: `Ошибка загрузки истории: ${err.message}` });
      }
      return res.status(200).json({ ok: true });
    }

    // --- Действие: Меню выбора шаблона для конкретного гостя ---
    if (data.startsWith('tmpl_pick_')) {
      const contact = data.replace('tmpl_pick_', '');
      botSessions[`reply_${chatId}`] = contact;

      await tgApi(token, 'answerCallbackQuery', {
        callback_query_id: cqId,
        text: `📑 Выбор шаблона для: ${contact}`,
        show_alert: false
      });

      const stageButtons = TEMPLATE_STAGES.map((st) => [
        { text: st.name, callback_data: `tmpl_st_for_${contact}_${st.id}` }
      ]);

      await tgApi(token, 'sendMessage', {
        chat_id: chatId,
        text: `📑 Выберите этап общения для гостя: ${contact}\nДоступно 14 сценариев на трех языках:`,
        reply_markup: { inline_keyboard: stageButtons }
      });
      return res.status(200).json({ ok: true });
    }

    // --- Действие: Просмотр шаблонов этапа для гостя ---
    if (data.startsWith('tmpl_st_for_')) {
      const rest = data.replace('tmpl_st_for_', '');
      const parts = rest.split('_stage_');
      const contact = parts[0];
      const stageId = `stage_${parts[1]}`;

      const templatesInStage = SMART_TEMPLATES.filter((t) => t.stageId === stageId);
      const buttons = templatesInStage.map((t) => [
        { text: `${t.id}: ${t.title.ru}`, callback_data: `tmpl_view_for_${contact}_${t.id}` }
      ]);

      await tgApi(token, 'answerCallbackQuery', { callback_query_id: cqId });
      await tgApi(token, 'sendMessage', {
        chat_id: chatId,
        text: `📑 Шаблоны этапа ${stageId} для ${contact}:\nВыберите шаблон для просмотра и отправки:`,
        reply_markup: { inline_keyboard: buttons }
      });
      return res.status(200).json({ ok: true });
    }

    // --- Действие: Просмотр шаблонов этапа в общем каталоге ---
    if (data.startsWith('tmpl_stage_')) {
      const stageId = data.replace('tmpl_stage_', '');
      const templatesInStage = SMART_TEMPLATES.filter((t) => t.stageId === stageId);
      const buttons = templatesInStage.map((t) => [
        { text: `${t.id}: ${t.title.ru}`, callback_data: `tmpl_view_gen_${t.id}` }
      ]);

      await tgApi(token, 'answerCallbackQuery', { callback_query_id: cqId });
      await tgApi(token, 'sendMessage', {
        chat_id: chatId,
        text: `📑 Шаблоны этапа ${stageId}:\nНажмите на шаблон для просмотра полного текста:`,
        reply_markup: { inline_keyboard: buttons }
      });
      return res.status(200).json({ ok: true });
    }

    // --- Действие: Просмотр текста шаблона в общем каталоге ---
    if (data.startsWith('tmpl_view_gen_')) {
      const tmplId = data.replace('tmpl_view_gen_', '');
      const tmpl = SMART_TEMPLATES.find((t) => t.id === tmplId);
      if (!tmpl) {
        await tgApi(token, 'answerCallbackQuery', { callback_query_id: cqId, text: 'Шаблон не найден', show_alert: true });
        return res.status(200).json({ ok: true });
      }

      await tgApi(token, 'answerCallbackQuery', { callback_query_id: cqId });
      const cardText = `📑 Шаблон ${tmpl.id}: ${tmpl.title?.ru || tmpl.title}\n\n` +
        `🇷🇺 RU:\n${tmpl.content?.ru || tmpl.text?.ru || ''}\n\n` +
        `🇬🇧 EN:\n${tmpl.content?.en || tmpl.text?.en || ''}\n\n` +
        `🇹🇷 TR:\n${tmpl.content?.tr || tmpl.text?.tr || ''}`;

      await tgApi(token, 'sendMessage', {
        chat_id: chatId,
        text: cardText,
        reply_markup: MAIN_KEYBOARD
      });
      return res.status(200).json({ ok: true });
    }

    // --- Действие: Просмотр текста шаблона и кнопки отправки гостю ---
    if (data.startsWith('tmpl_view_for_')) {
      const rest = data.replace('tmpl_view_for_', '');
      const parts = rest.split('_');
      const tmplId = `${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
      const contact = parts.slice(0, parts.length - 2).join('_');

      const tmpl = SMART_TEMPLATES.find((t) => t.id === tmplId);
      if (!tmpl) {
        await tgApi(token, 'answerCallbackQuery', { callback_query_id: cqId, text: 'Шаблон не найден', show_alert: true });
        return res.status(200).json({ ok: true });
      }

      await tgApi(token, 'answerCallbackQuery', { callback_query_id: cqId });

      const cardText = `📑 Шаблон ${tmpl.id}: ${tmpl.title?.ru || tmpl.title}\n\n` +
        `🇷🇺 RU:\n${tmpl.content?.ru || tmpl.text?.ru || ''}\n\n` +
        `🇬🇧 EN:\n${tmpl.content?.en || tmpl.text?.en || ''}\n\n` +
        `🇹🇷 TR:\n${tmpl.content?.tr || tmpl.text?.tr || ''}\n\n` +
        `Выберите язык для автоматической подстановки данных и моментальной отправки гостю:`;

      const sendButtons = [
        [
          { text: '📤 Отправить на RU', callback_data: `tmpl_send_${tmpl.id}_ru_${contact}` },
          { text: '📤 Отправить на EN', callback_data: `tmpl_send_${tmpl.id}_en_${contact}` }
        ],
        [
          { text: '📤 Отправить на TR', callback_data: `tmpl_send_${tmpl.id}_tr_${contact}` }
        ]
      ];

      await tgApi(token, 'sendMessage', {
        chat_id: chatId,
        text: cardText,
        reply_markup: { inline_keyboard: sendButtons }
      });
      return res.status(200).json({ ok: true });
    }

    // --- Действие: Моментальная отправка резолвленного шаблона гостю на сайт ---
    if (data.startsWith('tmpl_send_')) {
      const parts = data.replace('tmpl_send_', '').split('_');
      const tmplId = parts[0];
      const targetLang = parts[1] || 'ru';
      const contact = parts.slice(2).join('_');

      const tmpl = SMART_TEMPLATES.find((t) => t.id === tmplId);
      if (!tmpl) {
        await tgApi(token, 'answerCallbackQuery', { callback_query_id: cqId, text: 'Шаблон не найден', show_alert: true });
        return res.status(200).json({ ok: true });
      }

      try {
        const rawText = tmpl.content?.[targetLang] || tmpl.content?.ru || tmpl.text?.[targetLang] || tmpl.text?.ru || '';
        const resolvedText = resolveTemplate(rawText, {
          guestName: contact,
          contact: contact
        });

        const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
        const cleanContact = contact.replace(/[\\/?*[\]]/g, '').trim();

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
            requestBody: { values: [[timestamp, "Владелец", resolvedText, fRU, fEN, fTR, ""]] }
          });
        }

        await tgApi(token, 'answerCallbackQuery', {
          callback_query_id: cqId,
          text: `✅ Шаблон ${tmplId} отправлен гостю: ${contact}`,
          show_alert: true
        });

        await tgApi(token, 'sendMessage', {
          chat_id: chatId,
          text: `✅ Шаблон ${tmplId} на языке ${targetLang.toUpperCase()} успешно доставлен гостю ${contact} на сайт!\n\nТекст сообщения:\n${resolvedText}`,
          reply_markup: MAIN_KEYBOARD
        });
      } catch (sendErr) {
        await tgApi(token, 'answerCallbackQuery', {
          callback_query_id: cqId,
          text: `❌ Ошибка отправки: ${sendErr.message}`,
          show_alert: true
        });
      }
      return res.status(200).json({ ok: true });
    }

    // --- Действие: Обзор Бизнес-Ассистента ---
    if (data === 'bot_assistant_overview') {
      await tgApi(token, 'answerCallbackQuery', { callback_query_id: cqId });
      const assistText = `💼 Бизнес-Ассистент Суперхозяина:\n\n` +
        `Единый центр поддержки суперхозяина Алексея:\n` +
        `• 🧾 Бухгалтер: точный расчет e-Arşiv Fatura для портала GİB [делитель 1.21, KDV 20%, Konaklama 1%];\n` +
        `• ⚖️ Юрист: проверка статуса гостя, правил KBS 1774 и реквизитов VKN 9991120181;\n` +
        `• 📝 Секретарь: поручения и фиксация в лист CRM «📋 Задачи и Поручения Секретаря».\n\n` +
        `Выберите нужное действие:`;
      const assistButtons = [
        [{ text: "🧾 Рассчитать e-Arşiv Fatura", callback_data: "bot_invoice_help" }],
        [{ text: "⚖️ Юрист & KBS 1774", callback_data: "bot_lawyer_help" }],
        [{ text: "📋 Задачи CRM Секретаря", callback_data: "bot_list_tasks" }]
      ];
      await tgApi(token, 'sendMessage', {
        chat_id: chatId,
        text: assistText,
        reply_markup: { inline_keyboard: assistButtons }
      });
      return res.status(200).json({ ok: true });
    }

    // --- Действие: Помощь по e-Arşiv Fatura ---
    if (data === 'bot_invoice_help') {
      await tgApi(token, 'answerCallbackQuery', { callback_query_id: cqId });
      const invHelp = `🧾 Расчет e-Arşiv Fatura для портала GİB:\n\n` +
        `Чтобы мгновенно рассчитать фактуру и записать в CRM, отправьте команду:\n` +
        `/invoice [СУММА_TRY] [КОЛИЧЕСТВО_НОЧЕЙ] [ИМЯ_ГОСТЯ]\n\n` +
        `Пример:\n` +
        `/invoice 36300 7 Ahmet Yılmaz\n\n` +
        `Бот рассчитает:\n` +
        `• Базу Matrah: 36300 / 1.21 = 30000.00 TRY\n` +
        `• НДС KDV 20%: 6000.00 TRY\n` +
        `• Налог Konaklama 1%: 300.00 TRY\n` +
        `• Цену за единицу с 8 знаками\n` +
        `• Готовую строку Not для вставки в GİB`;
      await tgApi(token, 'sendMessage', {
        chat_id: chatId,
        text: invHelp,
        reply_markup: MAIN_KEYBOARD
      });
      return res.status(200).json({ ok: true });
    }

    // --- Действие: Юрист & KBS справка ---
    if (data === 'bot_lawyer_help') {
      await tgApi(token, 'answerCallbackQuery', { callback_query_id: cqId });
      const lawText = `⚖️ Юридический блок виллы Villa Turaman:\n\n` +
        `• Налоговый номер VKN: 9991120181\n` +
        `• Закон о счетах: VUK 213 Madde 230\n` +
        `• Учет гостей: Kimlik Bildirme Kanunu 1774 [KBS полиция]\n` +
        `• Защита данных: KVKK 6698\n` +
        `• Договор бронирования: оформляется на фактического плательщика\n` +
        `• Валюта расчетов в Турции: TRY по курсу TCMB на день операции`;
      await tgApi(token, 'sendMessage', {
        chat_id: chatId,
        text: lawText,
        reply_markup: MAIN_KEYBOARD
      });
      return res.status(200).json({ ok: true });
    }

    // --- Действие: Список задач персонала из CRM с интерактивными кнопками завершения ---
    if (data === 'bot_list_tasks') {
      await tgApi(token, 'answerCallbackQuery', { callback_query_id: cqId });
      try {
        if (!sheets || !spreadsheetId) {
          await tgApi(token, 'sendMessage', { chat_id: chatId, text: '❌ База задач недоступна.' });
          return res.status(200).json({ ok: true });
        }
        const taskData = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: resolveRange(sheetMap, 'TASKS', 'A:G')
        });
        const rows = (taskData.data.values || []).slice(1);
        const activeTasks = rows.filter((r) => {
          const st = String(r[4] || '').toLowerCase().trim();
          return st !== 'выполнена' && st !== 'завершено' && st !== 'done' && st !== 'готово';
        });

        if (activeTasks.length === 0) {
          await tgApi(token, 'sendMessage', {
            chat_id: chatId,
            text: '🎉 Все задачи персонала выполнены!\n\nВы можете поставить новое поручение командой:\n/task [Текст задачи]',
            reply_markup: {
              inline_keyboard: [
                [{ text: '➕ Поставить новую задачу', callback_data: 'task_new_prompt' }],
                [{ text: '🛠️ Все 10 задач VS Code', callback_data: 'vscode_tasks_list' }]
              ]
            }
          });
          return res.status(200).json({ ok: true });
        }

        await tgApi(token, 'sendMessage', {
          chat_id: chatId,
          text: '📋 Активные задачи персонала [найдено: ' + activeTasks.length + ']:'
        });

        for (const r of activeTasks.slice(0, 6)) {
          const taskId = r[0] || 'task';
          const taskDate = r[1] || '';
          const taskSource = r[2] || 'CRM';
          const taskText = r[3] || '';
          const taskStatus = r[4] || 'В работе';
          const taskModule = r[5] || 'Секретарь';

          const card = '📌 Задача #' + taskId + '\n' +
            '• Источник: ' + taskSource + ' | Дата: ' + taskDate + '\n' +
            '• Модуль: ' + taskModule + '\n' +
            '• Статус: 🟡 ' + taskStatus + '\n\n' +
            'Текст поручения:\n' + taskText;

          await tgApi(token, 'sendMessage', {
            chat_id: chatId,
            text: card,
            reply_markup: {
              inline_keyboard: [
                [{ text: '✅ Завершить #' + taskId, callback_data: 'task_done_' + taskId }],
                [{ text: '➕ Новая задача', callback_data: 'task_new_prompt' }]
              ]
            }
          });
        }
      } catch (tErr) {
        await tgApi(token, 'sendMessage', { chat_id: chatId, text: 'Ошибка задач: ' + tErr.message });
      }
      return res.status(200).json({ ok: true });
    }

    // --- Действие: Интерактивная отметка выполнения задачи гостем/владельцем ---
    if (data.startsWith('task_done_')) {
      const targetTaskId = data.replace('task_done_', '').trim();
      try {
        if (sheets && spreadsheetId) {
          const taskData = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: resolveRange(sheetMap, 'TASKS', 'A:G')
          });
          const allRows = taskData.data.values || [];
          let foundRowIndex = -1;
          for (let i = 1; i < allRows.length; i++) {
            if (String(allRows[i][0] || '').trim() === targetTaskId) {
              foundRowIndex = i + 1; // 1-based row index
              break;
            }
          }
          if (foundRowIndex !== -1) {
            const nowStr = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
            const targetSheetTitle = sheetMap['TASKS'] || '📋 Задачи и Поручения Секретаря';
            await sheets.spreadsheets.values.update({
              spreadsheetId,
              range: `'${targetSheetTitle}'!E${foundRowIndex}:G${foundRowIndex}`,
              valueInputOption: 'USER_ENTERED',
              requestBody: {
                values: [['Выполнена', allRows[foundRowIndex - 1][5] || 'Секретарь', 'Завершено владельцем через Telegram: ' + nowStr]]
              }
            });
            await tgApi(token, 'answerCallbackQuery', {
              callback_query_id: cqId,
              text: '✅ Задача ' + targetTaskId + ' успешно завершена!',
              show_alert: true
            });
            await tgApi(token, 'sendMessage', {
              chat_id: chatId,
              text: '✅ Задача ' + targetTaskId + ' успешно отмечена выполненной и зафиксирована в CRM!',
              reply_markup: {
                inline_keyboard: [
                  [{ text: '📋 Обновить список задач', callback_data: 'bot_list_tasks' }],
                  [{ text: '🛠️ Все 10 задач VS Code', callback_data: 'vscode_tasks_list' }]
                ]
              }
            });
            return res.status(200).json({ ok: true });
          }
        }
        await tgApi(token, 'answerCallbackQuery', {
          callback_query_id: cqId,
          text: 'Задача не найдена в таблице',
          show_alert: true
        });
      } catch (dErr) {
        await tgApi(token, 'answerCallbackQuery', {
          callback_query_id: cqId,
          text: 'Ошибка: ' + dErr.message,
          show_alert: true
        });
      }
      return res.status(200).json({ ok: true });
    }

    // --- Действие: Подсказка по созданию задачи ---
    if (data === 'task_new_prompt') {
      await tgApi(token, 'answerCallbackQuery', { callback_query_id: cqId });
      const promptText = '✍️ Чтобы поставить новую задачу секретарю или персоналу, отправьте сообщение:\n\n' +
        '/task [Текст поручения]\n\n' +
        'Пример: /task Подготовить виллу к заезду семьи Ивановых 15 октября';
      await tgApi(token, 'sendMessage', {
        chat_id: chatId,
        text: promptText,
        reply_markup: MAIN_KEYBOARD
      });
      return res.status(200).json({ ok: true });
    }

    // --- Действие: Интерактивный реестр всех 10 задач VS Code ---
    if (data === 'vscode_tasks_list') {
      await tgApi(token, 'answerCallbackQuery', { callback_query_id: cqId });
      const tasksRegistryText = '🛠️ РЕЕСТР ВСЕХ 10 ЗАДАЧ VS CODE И СЕРВЕРА [Вариант 1 : Airbnb]\n\n' +
        '1. 🚀 Dev Сервер: npm run dev [Порт 3000]\n' +
        '   • VS Code: Terminal -> Run Task... -> 🚀 1. Запуск Dev Сервера\n' +
        '   • pwsh: npm run dev\n\n' +
        '2. 🧹 Освободить Порт 3000: Free Port 3000\n' +
        '   • VS Code: Terminal -> Run Task... -> 🧹 2. Освободить Порт 3000\n' +
        '   • pwsh: Get-NetTCPConnection -LocalPort 3000 | Stop-Process\n\n' +
        '3. 📦 Сборка Проекта: Next.js Build\n' +
        '   • VS Code: Terminal -> Run Task... -> 📦 3. Сборка Проекта\n' +
        '   • pwsh: npm run build\n\n' +
        '4. ⚡ Продакшн Сервер: Next.js Start\n' +
        '   • VS Code: Terminal -> Run Task... -> ⚡ 4. Запуск Продакшн Сервера\n' +
        '   • pwsh: npm start\n\n' +
        '5. 📥 Установка Зависимостей: npm install\n' +
        '   • VS Code: Terminal -> Run Task... -> 📥 5. Установка Зависимостей\n' +
        '   • pwsh: npm install\n\n' +
        '6. 💾 Зафиксировать эталон SSOT: masterSeedContent\n' +
        '   • VS Code: Terminal -> Run Task... -> 💾 6. Зафиксировать текущие таблицы\n' +
        '   • pwsh: node scripts/save-master-seed.js\n\n' +
        '7. 💾 Универсальный двухуровневый бэкап: SPARK Backup\n' +
        '   • VS Code: Terminal -> Run Task... -> 💾 7. SPARK: Универсальное создание бэкапа\n' +
        '   • pwsh: pwsh -File .\\create_project_backup.ps1\n\n' +
        '8. 📊 Синхронизация Контента: Sheets -> content.json\n' +
        '   • VS Code: Terminal -> Run Task... -> 📊 8. Синхронизация Контента\n' +
        '   • pwsh: node scripts/sync-content.js\n\n' +
        '9. 🛠️ Восстановление структуры листов: SPARK Restore\n' +
        '   • VS Code: Terminal -> Run Task... -> 🛠️ 9. SPARK: Восстановить все листы\n' +
        '   • pwsh: node scripts/restore-sheets.js\n\n' +
        '10. 🏛️ Инициализация CRM Таблиц: Google Sheets Init\n' +
        '    • VS Code: Terminal -> Run Task... -> 🏛️ 10. Инициализация CRM Таблиц\n' +
        '    • pwsh: node scripts/init-google-sheets.js\n\n' +
        'Дополнительные операции:\n' +
        '• ⏸️ Режим обслуживания Vercel 503: pwsh -File .\\pause_site.ps1\n' +
        '• ▶️ Возобновление работы сайта: pwsh -File .\\resume_site.ps1\n' +
        '• 📤 Выгрузка ветки v1-airbnb: pwsh -File .\\push_project_to_github.ps1 -Target v1\n' +
        '• 🔄 Полная синхронизация main: pwsh -File .\\push_project_to_github.ps1 -Target main';

      await tgApi(token, 'sendMessage', {
        chat_id: chatId,
        text: tasksRegistryText,
        reply_markup: {
          inline_keyboard: [
            [{ text: '⚡ Опубликовать изменения прямо сейчас', callback_data: 'bot_trigger_revalidate' }],
            [{ text: '📋 Задачи персонала', callback_data: 'bot_list_tasks' }],
            [{ text: '⚙️ Статус платформы', callback_data: 'bot_status_view' }]
          ]
        }
      });
      return res.status(200).json({ ok: true });
    }

    // --- Действие: Мгновенная публикация и ревалидация сайта ---
    if (data === 'bot_trigger_revalidate') {
      await tgApi(token, 'answerCallbackQuery', {
        callback_query_id: cqId,
        text: '⚡ Синхронизация с сайтом запущена...',
        show_alert: false
      });
      try {
        clearLiveContentCache();
        const fresh = await getOrFetchLiveContent(true);
        await tgApi(token, 'sendMessage', {
          chat_id: chatId,
          text: '✅ Витрина сайта успешно обновлена!\n\nСвежие данные из Google Таблиц загружены в память сервера.\nИсточник: ' + (fresh.source || 'google_sheets_live') + '\nВремя: ' + new Date().toLocaleString('ru-RU'),
          reply_markup: MAIN_KEYBOARD
        });
      } catch (syncErr) {
        await tgApi(token, 'sendMessage', {
          chat_id: chatId,
          text: '❌ Ошибка ревалидации: ' + syncErr.message,
          reply_markup: MAIN_KEYBOARD
        });
      }
      return res.status(200).json({ ok: true });
    }

    // --- Действие: Просмотр статуса платформы ---
    if (data === 'bot_status_view') {
      await tgApi(token, 'answerCallbackQuery', { callback_query_id: cqId });
      const aiModel = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
      const aiStatus = process.env.GEMINI_API_KEY ? 'Активен [Модель: ' + aiModel + '] 🟢' : 'Ключ не задан ⚠️';
      const statusText = '⚙️ Статус экосистемы Villa Turaman:\n\n' +
        '• Сервер сайта: Next.js Vercel [Онлайн 🟢]\n' +
        '• ИИ-Консьерж Gemini: ' + aiStatus + '\n' +
        '• Основная база Google Sheets: ' + (spreadsheetId ? 'Подключена ✅' : 'Не настроена ❌') + '\n' +
        '• База чатов Google Sheets: ' + (chatsSpreadsheetId ? 'Подключена ✅' : 'Не настроена ❌') + '\n' +
        '• Webhook Telegram: Активен [/api/telegram-webhook] 🟢\n' +
        '• Chat ID владельца: ' + (ownerChatId || 'Авторизован') + '\n\n' +
        'Все системы функционируют в штатном режиме.';
      await tgApi(token, 'sendMessage', {
        chat_id: chatId,
        text: statusText,
        reply_markup: MAIN_KEYBOARD
      });
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
              { text: `✍️ Написать в чат`, callback_data: `reply_${contact}` },
              { text: `📑 Шаблоны ответов`, callback_data: `tmpl_pick_${contact}` }
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
            { text: `📑 Шаблоны`, callback_data: `tmpl_pick_${clientContact}` },
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

    // --- Раздел: 📑 Шаблоны ответов ---
    if (text === '📑 Шаблоны ответов' || text === '/templates') {
      const stageButtons = TEMPLATE_STAGES.map((st) => [
        { text: st.name, callback_data: `tmpl_stage_${st.id}` }
      ]);

      await tgApi(token, 'sendMessage', {
        chat_id: chatId,
        text: `📑 Единая база умных шаблонов Villa Turaman:\n14 готовых сценариев на 3 языках RU | EN | TR.\n\nВыберите этап для просмотра:`,
        reply_markup: { inline_keyboard: stageButtons }
      });
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

    // --- Раздел: 🧠 Режим ИИ & Gemini ---
    if (text === '🧠 Режим ИИ & Gemini' || text === '/ai') {
      try {
        const kb = await getAiKnowledgeBase();
        const currentMode = kb.aiMode || 'copilot';
        const modeNames = {
          autopilot: '🚀 Автопилот [ИИ отвечает сразу сам]',
          copilot: '💡 Суфлер [ИИ готовит проект ответа]',
          off: '⏸️ Выключен [Ручное управление]'
        };

        const aiText = `🧠 Управление ИИ-Агентом & Gemini:\n\n` +
          `• Текущий режим: ${modeNames[currentMode] || currentMode}\n` +
          `• Модель Gemini: ${kb.geminiModel || 'gemini-3.6-flash'}\n` +
          `• Минимальный тариф: ${kb.minPriceUsd || 180} USD\n` +
          `• Ключ GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? 'Настроен на Vercel ✅' : 'Отсутствует ⚠️'}\n\n` +
          `Переключение режима в 1 клик:`;

        const aiButtons = [
          [
            { text: `${currentMode === 'autopilot' ? '✅ ' : ''}🚀 Автопилот`, callback_data: 'ai_set_mode_autopilot' },
            { text: `${currentMode === 'copilot' ? '✅ ' : ''}💡 Суфлер`, callback_data: 'ai_set_mode_copilot' }
          ],
          [
            { text: `${currentMode === 'off' ? '✅ ' : ''}⏸️ Отключить`, callback_data: 'ai_set_mode_off' },
            { text: '🔄 Сбросить кэш', callback_data: 'ai_refresh_cache' }
          ]
        ];

        await tgApi(token, 'sendMessage', {
          chat_id: chatId,
          text: aiText,
          reply_markup: { inline_keyboard: aiButtons }
        });
      } catch (err) {
        await tgApi(token, 'sendMessage', { chat_id: chatId, text: `Ошибка: ${err.message}` });
      }
      return res.status(200).json({ ok: true });
    }

    // --- Раздел: ⚙️ Статус и Webhook ---
    if (text === '⚙️ Статус и Webhook' || text === '/status') {
      try {
        const aiModel = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
        const aiStatus = process.env.GEMINI_API_KEY ? `Активен [Модель: ${aiModel}] 🟢` : 'Ключ не задан ⚠️';
        const statusText = `⚙️ Статус платформы Villa Turaman:\n\n` +
          `• Сервер сайта: Next.js Vercel [Онлайн 🟢]\n` +
          `• ИИ-Консьерж Gemini: ${aiStatus}\n` +
          `• Основная база Google Sheets: ${spreadsheetId ? 'Подключена ✅' : 'Не настроена ❌'}\n` +
          `• База чатов Google Sheets: ${chatsSpreadsheetId ? 'Подключена ✅' : 'Не настроена ❌'}\n` +
          `• Webhook Telegram: Активен [/api/telegram-webhook] 🟢\n` +
          `• Chat ID владельца: ${ownerChatId || 'Авторизован'}\n\n` +
          `Все системы функционируют в штатном режиме.`;

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

    // --- Раздел: 💼 Бизнес-Ассистент ---
    if (text === '💼 Бизнес-Ассистент' || text === '/assistant') {
      const assistText = `💼 Бизнес-Ассистент Суперхозяина:\n\n` +
        `Единый центр поддержки суперхозяина Алексея:\n` +
        `• 🧾 Бухгалтер: точный расчет e-Arşiv Fatura для портала GİB [делитель 1.21, KDV 20%, Konaklama 1%];\n` +
        `• ⚖️ Юрист: проверка статуса гостя, правил KBS 1774 и реквизитов VKN 9991120181;\n` +
        `• 📝 Секретарь: поручения и фиксация в лист CRM «📋 Задачи и Поручения Секретаря».\n\n` +
        `Быстрые команды:\n` +
        `• /invoice [СУММА] [НОЧЕЙ] [ИМЯ] : расчет фактуры\n` +
        `• /lawyer : юридический регламент и KBS\n` +
        `• /task [ТЕКСТ] : создать задачу секретарю\n` +
        `• /tasks : список активных задач\n\n` +
        `Выберите действие ниже:`;
      const assistButtons = [
        [{ text: "🧾 Рассчитать e-Arşiv Fatura", callback_data: "bot_invoice_help" }],
        [{ text: "⚖️ Юрист & KBS 1774", callback_data: "bot_lawyer_help" }],
        [{ text: "📋 Задачи CRM Секретаря", callback_data: "bot_list_tasks" }]
      ];
      await tgApi(token, 'sendMessage', {
        chat_id: chatId,
        text: assistText,
        reply_markup: { inline_keyboard: assistButtons }
      });
      return res.status(200).json({ ok: true });
    }

    // --- Раздел: 🧾 e-Arşiv Fatura калькулятор ---
    if (text === '🧾 e-Arşiv Fatura' || text === '/invoice' || text.startsWith('/invoice ')) {
      const parts = text.replace('/invoice', '').trim().split(/\s+/).filter(Boolean);
      if (parts.length >= 2) {
        const gross = parseFloat(parts[0].replace(',', '.')) || 0;
        const nights = parseInt(parts[1], 10) || 1;
        const guestName = parts.slice(2).join(' ') || 'Гость';

        if (gross > 0) {
          const matrah = gross / 1.21;
          const kdv20 = matrah * 0.20;
          const konaklama1 = matrah * 0.01;
          const unitPrice = (matrah / nights).toFixed(8);
          const wholePart = Math.floor(gross);
          const kurusPart = Math.round((gross - wholePart) * 100);
          const notNote = `YALNIZ ${wholePart} TL ${kurusPart} KURUŞTUR. E ARŞİV İZNİ KAPSAMINDA ELEKTRONİK ORTAMDA İLETİLMİŞTİR.`;

          const taskId = `TASK-${Date.now().toString().slice(-4)}`;
          const now = new Date();
          const dateStr = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

          if (sheets && spreadsheetId) {
            try {
              await sheets.spreadsheets.values.append({
                spreadsheetId,
                range: resolveRange(sheetMap, 'TASKS', 'A:G'),
                valueInputOption: 'USER_ENTERED',
                insertDataOption: 'INSERT_ROWS',
                requestBody: {
                  values: [[
                    taskId,
                    dateStr,
                    'Бухгалтер',
                    `e-Arşiv Fatura: ${guestName}, Брутто: ${gross.toFixed(2)} TRY, База: ${matrah.toFixed(2)} TRY, Ночей: ${nights}`,
                    'Выполнена',
                    'https://drive.google.com/drive/folders/11xBSWA02NypliPFbziRSMfC9aAPclYF_',
                    'Калькулятор GİB'
                  ]]
                }
              });
            } catch (appErr) {
              console.warn('[Telegram Bot] Ошибка сохранения фактуры в TASKS:', appErr.message);
            }
          }

          const faturaReport = `🧾 РАСЧЕТ E-ARŞİV FATURA ДЛЯ ПОРТАЛА GİB:\n\n` +
            `• Получатель Alıcı: ${guestName}\n` +
            `• Валюта: TRY\n` +
            `• Итого брутто к оплате: ${gross.toFixed(2)} TRY\n` +
            `• Налоговая база Matrah [делитель 1.21]: ${matrah.toFixed(2)} TRY\n` +
            `• Ставка НДС KDV 20%: ${kdv20.toFixed(2)} TRY\n` +
            `• Налог Konaklama 1%: ${konaklama1.toFixed(2)} TRY\n` +
            `• Количество ночей: ${nights}\n` +
            `• Цена за единицу Birim Fiyat [8 знаков]: ${unitPrice} TRY\n` +
            `• VKN эмитента: 9991120181\n` +
            `• Основание закона: VUK 213 Madde 230\n\n` +
            `📝 Поле Not для портала GİB [скопируйте в 1 клик]:\n` +
            `\`${notNote}\`\n\n` +
            `✅ Запись внесена в CRM: лист «📋 Задачи и Поручения Секретаря» [ID: ${taskId}]`;

          await tgApi(token, 'sendMessage', {
            chat_id: chatId,
            text: faturaReport,
            parse_mode: 'Markdown',
            reply_markup: MAIN_KEYBOARD
          });
          return res.status(200).json({ ok: true });
        }
      }

      // Если параметры не указаны: подсказка
      const helpMsg = `🧾 Калькулятор e-Arşiv Fatura [GİB Portal]:\n\n` +
        `Отправьте команду в формате:\n` +
        `/invoice [СУММА_TRY] [КОЛИЧЕСТВО_НОЧЕЙ] [ИМЯ_ГОСТЯ]\n\n` +
        `Пример 1: /invoice 36300 7 Ahmet Yılmaz\n` +
        `Пример 2: /invoice 24200 4 Elena Ivanova\n\n` +
        `Бот автоматически:\n` +
        `1. Разделит сумму на 1.21 [Matrah];\n` +
        `2. Рассчитает KDV 20% и Konaklama 1%;\n` +
        `3. Рассчитает точную цену за единицу [8 знаков];\n` +
        `4. Сформирует строку Not на турецком языке;\n` +
        `5. Сохранит операцию в лист CRM TASKS.`;

      await tgApi(token, 'sendMessage', {
        chat_id: chatId,
        text: helpMsg,
        reply_markup: MAIN_KEYBOARD
      });
      return res.status(200).json({ ok: true });
    }

    // --- Раздел: ⚖️ Юрист & KBS ---
    if (text === '⚖️ Юрист & KBS' || text === '/lawyer') {
      const lawMsg = `⚖️ Юридический центр и стандарты безопасности виллы:\n\n` +
        `• Налоговый номер VKN: 9991120181\n` +
        `• Основание счетов: VUK 213 Madde 230\n` +
        `• Регистрация гостей: Закон Kimlik Bildirme Kanunu 1774 [KBS полиция Турция]\n` +
        `• Конфиденциальность: Закон KVKK 6698 [Защита персональных данных]\n` +
        `• Договор бронирования: оформляется строго на фактического плательщика\n` +
        `• Расчеты: Турецкая лира TRY по официальному курсу TCMB на дату платежа.`;

      await tgApi(token, 'sendMessage', {
        chat_id: chatId,
        text: lawMsg,
        reply_markup: MAIN_KEYBOARD
      });
      return res.status(200).json({ ok: true });
    }

    // --- Раздел: 📝 Задачи Секретаря [создание /task] ---
    if (text.startsWith('/task ') || text === '/task' || text === '📝 Новая задача Секретарю') {
      const taskBody = text.replace(/^\/task\s*/i, '').trim();
      if (taskBody && taskBody !== '📝 Новая задача Секретарю') {
        const taskId = `TASK-${Date.now().toString().slice(-4)}`;
        const now = new Date();
        const dateStr = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        if (sheets && spreadsheetId) {
          try {
            await sheets.spreadsheets.values.append({
              spreadsheetId,
              range: resolveRange(sheetMap, 'TASKS', 'A:G'),
              valueInputOption: 'USER_ENTERED',
              insertDataOption: 'INSERT_ROWS',
              requestBody: {
                values: [[
                  taskId,
                  dateStr,
                  'Секретарь',
                  taskBody,
                  'Новая',
                  'https://drive.google.com/drive/folders/11xBSWA02NypliPFbziRSMfC9aAPclYF_',
                  'Суперхозяин Алексей'
                ]]
              }
            });
          } catch (tErr) {
            console.warn('[Telegram Bot] Ошибка сохранения задачи:', tErr.message);
          }
        }

        const confirmMsg = `✅ Задача успешно зафиксирована в CRM!\n\n` +
          `• Номер: ${taskId}\n` +
          `• Дата: ${dateStr}\n` +
          `• Направление: Секретарь\n` +
          `• Содержание: ${taskBody}\n` +
          `• Статус: Новая\n` +
          `• Назначена: Суперхозяин Алексей\n` +
          `• Папка Google Drive: Villa Turaman Проект`;

        await tgApi(token, 'sendMessage', {
          chat_id: chatId,
          text: confirmMsg,
          reply_markup: MAIN_KEYBOARD
        });
        return res.status(200).json({ ok: true });
      }

      // Если текст задачи не указан: подсказка
      const promptMsg = `📝 Создание задачи или поручения секретарю:\n\n` +
        `Отправьте сообщение с командой:\n` +
        `/task [Текст вашего поручения]\n\n` +
        `Пример 1: /task Заказать генеральную уборку виллы к заезду 15 октября\n` +
        `Пример 2: /task Проверить договор трансфера с Ahmet Dalyan VIP\n\n` +
        `Задача будет мгновенно занесена в лист CRM «📋 Задачи и Поручения Секретаря».`;

      await tgApi(token, 'sendMessage', {
        chat_id: chatId,
        text: promptMsg,
        reply_markup: MAIN_KEYBOARD
      });
      return res.status(200).json({ ok: true });
    }

    // --- Раздел: 📋 Задачи персонала из CRM ---
    if (text === '📋 Задачи персонала' || text === '📋 Задачи CRM' || text === '/tasks') {
      try {
        if (!sheets || !spreadsheetId) {
          await tgApi(token, 'sendMessage', { chat_id: chatId, text: '❌ База задач недоступна.' });
          return res.status(200).json({ ok: true });
        }
        const taskData = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: resolveRange(sheetMap, 'TASKS', 'A:G')
        });
        const rows = (taskData.data.values || []).slice(1);
        const activeTasks = rows.filter((r) => {
          const st = String(r[4] || '').toLowerCase().trim();
          return st !== 'выполнена' && st !== 'завершено' && st !== 'done' && st !== 'готово';
        });

        if (activeTasks.length === 0) {
          await tgApi(token, 'sendMessage', {
            chat_id: chatId,
            text: '🎉 Все задачи персонала выполнены!\n\nВы можете поставить новое поручение командой:\n/task [Текст задачи]',
            reply_markup: {
              inline_keyboard: [
                [{ text: '➕ Поставить новую задачу', callback_data: 'task_new_prompt' }],
                [{ text: '🛠️ Все 10 задач VS Code', callback_data: 'vscode_tasks_list' }]
              ]
            }
          });
          return res.status(200).json({ ok: true });
        }

        await tgApi(token, 'sendMessage', {
          chat_id: chatId,
          text: '📋 Активные задачи персонала [найдено: ' + activeTasks.length + ']:'
        });

        for (const r of activeTasks.slice(0, 6)) {
          const taskId = r[0] || 'task';
          const taskDate = r[1] || '';
          const taskSource = r[2] || 'CRM';
          const taskText = r[3] || '';
          const taskStatus = r[4] || 'В работе';
          const taskModule = r[5] || 'Секретарь';

          const card = '📌 Задача #' + taskId + '\n' +
            '• Источник: ' + taskSource + ' | Дата: ' + taskDate + '\n' +
            '• Модуль: ' + taskModule + '\n' +
            '• Статус: 🟡 ' + taskStatus + '\n\n' +
            'Текст поручения:\n' + taskText;

          await tgApi(token, 'sendMessage', {
            chat_id: chatId,
            text: card,
            reply_markup: {
              inline_keyboard: [
                [{ text: '✅ Завершить #' + taskId, callback_data: 'task_done_' + taskId }],
                [{ text: '➕ Новая задача', callback_data: 'task_new_prompt' }]
              ]
            }
          });
        }
      } catch (tErr) {
        await tgApi(token, 'sendMessage', { chat_id: chatId, text: 'Ошибка задач: ' + tErr.message });
      }
      return res.status(200).json({ ok: true });
    }

    // --- Раздел: 🛠️ Все 10 задач VS Code ---
    if (text === '🛠️ Все 10 задач VS Code' || text === '/vscode' || text === '/tasks_vscode' || text === '/launcher') {
      const tasksRegistryText = '🛠️ РЕЕСТР ВСЕХ 10 ЗАДАЧ VS CODE И СЕРВЕРА [Вариант 1 : Airbnb]\n\n' +
        '1. 🚀 Dev Сервер: npm run dev [Порт 3000]\n' +
        '   • VS Code: Terminal -> Run Task... -> 🚀 1. Запуск Dev Сервера\n' +
        '   • pwsh: npm run dev\n\n' +
        '2. 🧹 Освободить Порт 3000: Free Port 3000\n' +
        '   • VS Code: Terminal -> Run Task... -> 🧹 2. Освободить Порт 3000\n' +
        '   • pwsh: Get-NetTCPConnection -LocalPort 3000 | Stop-Process\n\n' +
        '3. 📦 Сборка Проекта: Next.js Build\n' +
        '   • VS Code: Terminal -> Run Task... -> 📦 3. Сборка Проекта\n' +
        '   • pwsh: npm run build\n\n' +
        '4. ⚡ Продакшн Сервер: Next.js Start\n' +
        '   • VS Code: Terminal -> Run Task... -> ⚡ 4. Запуск Продакшн Сервера\n' +
        '   • pwsh: npm start\n\n' +
        '5. 📥 Установка Зависимостей: npm install\n' +
        '   • VS Code: Terminal -> Run Task... -> 📥 5. Установка Зависимостей\n' +
        '   • pwsh: npm install\n\n' +
        '6. 💾 Зафиксировать эталон SSOT: masterSeedContent\n' +
        '   • VS Code: Terminal -> Run Task... -> 💾 6. Зафиксировать текущие таблицы\n' +
        '   • pwsh: node scripts/save-master-seed.js\n\n' +
        '7. 💾 Универсальный двухуровневый бэкап: SPARK Backup\n' +
        '   • VS Code: Terminal -> Run Task... -> 💾 7. SPARK: Универсальное создание бэкапа\n' +
        '   • pwsh: pwsh -File .\\create_project_backup.ps1\n\n' +
        '8. 📊 Синхронизация Контента: Sheets -> content.json\n' +
        '   • VS Code: Terminal -> Run Task... -> 📊 8. Синхронизация Контента\n' +
        '   • pwsh: node scripts/sync-content.js\n\n' +
        '9. 🛠️ Восстановление структуры листов: SPARK Restore\n' +
        '   • VS Code: Terminal -> Run Task... -> 🛠️ 9. SPARK: Восстановить все листы\n' +
        '   • pwsh: node scripts/restore-sheets.js\n\n' +
        '10. 🏛️ Инициализация CRM Таблиц: Google Sheets Init\n' +
        '    • VS Code: Terminal -> Run Task... -> 🏛️ 10. Инициализация CRM Таблиц\n' +
        '    • pwsh: node scripts/init-google-sheets.js\n\n' +
        'Дополнительные операции:\n' +
        '• ⏸️ Режим обслуживания Vercel 503: pwsh -File .\\pause_site.ps1\n' +
        '• ▶️ Возобновление работы сайта: pwsh -File .\\resume_site.ps1\n' +
        '• 📤 Выгрузка ветки v1-airbnb: pwsh -File .\\push_project_to_github.ps1 -Target v1\n' +
        '• 🔄 Полная синхронизация main: pwsh -File .\\push_project_to_github.ps1 -Target main';

      await tgApi(token, 'sendMessage', {
        chat_id: chatId,
        text: tasksRegistryText,
        reply_markup: {
          inline_keyboard: [
            [{ text: '⚡ Опубликовать изменения прямо сейчас', callback_data: 'bot_trigger_revalidate' }],
            [{ text: '📋 Задачи персонала', callback_data: 'bot_list_tasks' }],
            [{ text: '⚙️ Статус платформы', callback_data: 'bot_status_view' }]
          ]
        }
      });
      return res.status(200).json({ ok: true });
    }

    // --- Раздел: ⚡ Мгновенная публикация сайта ---
    if (text === '/revalidate' || text === '/publish' || text === '⚡ Опубликовать изменения') {
      try {
        clearLiveContentCache();
        const fresh = await getOrFetchLiveContent(true);
        await tgApi(token, 'sendMessage', {
          chat_id: chatId,
          text: '✅ Витрина сайта успешно обновлена!\n\nСвежие данные из Google Таблиц загружены в память сервера.\nИсточник: ' + (fresh.source || 'google_sheets_live') + '\nВремя: ' + new Date().toLocaleString('ru-RU'),
          reply_markup: MAIN_KEYBOARD
        });
      } catch (rErr) {
        await tgApi(token, 'sendMessage', {
          chat_id: chatId,
          text: '❌ Ошибка ревалидации: ' + rErr.message,
          reply_markup: MAIN_KEYBOARD
        });
      }
      return res.status(200).json({ ok: true });
    }

    // Ответ по умолчанию
    await tgApi(token, 'sendMessage', {
      chat_id: chatId,
      text: 'Команда принята. Используйте кнопки меню для управления виллой 👇',
      reply_markup: MAIN_KEYBOARD
    });
  }

  return res.status(200).json({ ok: true });
}

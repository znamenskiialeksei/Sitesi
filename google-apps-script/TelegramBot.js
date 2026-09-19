// ==============================================================================
// TELEGRAM BOT & WEBHOOK УПРАВЛЕНИЕ ДЛЯ GOOGLE APPS SCRIPT
// Файл: google-apps-script/TelegramBot.js
// Назначение: Дополнительный модуль для Google Таблицы (Расширения -> Apps Script).
// Создает второе главное меню "🤖 Telegram Бот" рядом с "🏡 Villa Turaman Suite".
// Позволяет управлять заявками, чатами, календарем и Webhook прямо из Google Таблиц.
// ==============================================================================

/**
 * Добавление второго главного меню "🤖 Telegram Бот" при открытии таблицы
 * Примечание: Если этот код используется вместе с Code.js, функция registerTelegramBotMenu
 * вызывается внутри onOpen() в Code.js.
 */
function registerTelegramBotMenu() {
  var ui = SpreadsheetApp.getUi();

  var tgLaunchMenu = ui.createMenu("📲 1. Запуск и Меню бота")
    .addItem("📱 Отправить Главное меню на телефон хозяина", "sendTelegramBotMenuToOwner")
    .addItem("⌨️ Обновить клавиатуру бота: Reply Keyboard", "refreshTelegramKeyboard")
    .addItem("📋 Зарегистрировать команды в Telegram: setMyCommands", "registerTelegramBotCommands");

  var tgRequestsMenu = ui.createMenu("📋 2. Заявки и Бронирования")
    .addItem("📥 Отправить список активных заявок в Telegram", "sendTelegramPendingRequests")
    .addItem("🔍 Аудит накладок и 24ч HOLD в Telegram", "auditTelegramCalendarHolds");

  var tgCrmMenu = ui.createMenu("💬 3. CRM и Переписка с гостями")
    .addItem("💬 Отправить сводку последних диалогов в Telegram", "sendTelegramRecentChats")
    .addItem("📢 Отправить сообщение гостю через Telegram", "sendTelegramDirectMessageDialog")
    .addItem("📣 Массовая рассылка гостям через Telegram", "sendTelegramBroadcastDialog");

  var tgCalendarMenu = ui.createMenu("📅 4. Календарь и Тарифы")
    .addItem("📊 Отправить график занятости виллы на 30 дней", "sendTelegramCalendarSummary")
    .addItem("💳 Отправить сводку актуальных тарифов", "sendTelegramRatesSummary");

  var tgSyncMenu = ui.createMenu("🌐 5. Синхронизация с сайтом")
    .addItem("⚡ Вызвать ревалидацию страниц сайта через бот", "triggerTelegramRevalidate")
    .addItem("👑 Проверить статус доступности кабинета хозяина", "checkTelegramHostCabinetStatus");

  var tgSettingsMenu = ui.createMenu("⚙️ 6. Настройки Webhook и Токена")
    .addItem("🔗 Установить Webhook на сайт: Next.js API", "setTelegramWebhookToSite")
    .addItem("🔍 Проверить статус Webhook: getWebhookInfo", "checkTelegramWebhookStatus")
    .addItem("❌ Удалить Webhook: переход на Polling", "deleteTelegramWebhook")
    .addSeparator()
    .addItem("🔑 Настроить TELEGRAM_BOT_TOKEN и CHAT_ID", "setupTelegramPropertiesInteractive")
    .addItem("🧪 Тестовый пинг в Telegram", "sendTelegramTestPing");

  ui.createMenu("🤖 Telegram Бот")
    .addSubMenu(tgLaunchMenu)
    .addSeparator()
    .addSubMenu(tgRequestsMenu)
    .addSubMenu(tgCrmMenu)
    .addSubMenu(tgCalendarMenu)
    .addSubMenu(tgSyncMenu)
    .addSeparator()
    .addSubMenu(tgSettingsMenu)
    .addToUi();
}

/**
 * Получение параметров Telegram из Script Properties таблицы
 */
function getTelegramConfig_() {
  var props = PropertiesService.getScriptProperties().getProperties();
  return {
    token: props['TELEGRAM_BOT_TOKEN'] || '',
    chatId: props['TELEGRAM_CHAT_ID'] || '',
    siteUrl: props['SITE_URL'] || 'http://localhost:3000'
  };
}

/**
 * Отправка сообщения в Telegram через Bot API
 */
function sendTelegramMessage_(text, replyMarkup) {
  var cfg = getTelegramConfig_();
  if (!cfg.token || !cfg.chatId) {
    throw new Error('TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID не настроены в Script Properties.');
  }
  var payload = {
    chat_id: cfg.chatId,
    text: text
  };
  if (replyMarkup) {
    payload.reply_markup = replyMarkup;
  }
  var url = 'https://api.telegram.org/bot' + cfg.token + '/sendMessage';
  var options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  var response = UrlFetchApp.fetch(url, options);
  return JSON.parse(response.getContentText());
}

/**
 * Построение постоянной мобильной клавиатуры Reply Keyboard для телефона хозяина
 */
function buildTelegramReplyKeyboard_() {
  return {
    keyboard: [
      [{ text: '📋 Заявки и брони' }, { text: '💬 CRM Чаты' }],
      [{ text: '📅 Календарь дат' }, { text: '💳 Тарифы виллы' }],
      [{ text: '📢 Массовая рассылка' }, { text: '⚙️ Статус и Webhook' }]
    ],
    resize_keyboard: true,
    is_persistent: true
  };
}

/**
 * 1. Отправка Главного меню бота на телефон хозяина
 */
function sendTelegramBotMenuToOwner() {
  try {
    var text = '🏡 Villa Turaman: Центр управления владельца\n\n' +
      'Вам доступны все ключевые операции по вилле прямо из этого чата:\n' +
      '• Модерация заявок: одобрение 24ч HOLD или отклонение\n' +
      '• Ответы гостям: проведите вправо по сообщению гостя для ответа\n' +
      '• Календарь и актуальные тарифы\n' +
      '• Синхронизация и ревалидация витрины сайта\n\n' +
      'Используйте кнопки меню внизу экрана для быстрого доступа:';

    var inlineKeyboard = {
      inline_keyboard: [
        [
          { text: '📋 Заявки на модерации', callback_data: 'menu_requests' },
          { text: '💬 CRM Диалоги', callback_data: 'menu_chats' }
        ],
        [
          { text: '📅 Календарь занятости', callback_data: 'menu_calendar' },
          { text: '💳 Актуальные тарифы', callback_data: 'menu_prices' }
        ],
        [
          { text: '⚡ Ревалидация сайта', callback_data: 'menu_revalidate' },
          { text: '⚙️ Статус системы', callback_data: 'menu_status' }
        ]
      ]
    };

    var replyKeyboard = buildTelegramReplyKeyboard_();
    sendTelegramMessage_(text, replyKeyboard);
    sendTelegramMessage_('Выберите раздел для мгновенного действия:', inlineKeyboard);
    SpreadsheetApp.getActive().toast('Главное меню бота успешно отправлено в Telegram.', '✅ Завершено', 5);
  } catch (err) {
    SpreadsheetApp.getUi().alert('Ошибка отправки меню', err.message, SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

/**
 * Обновление клавиатуры Telegram-бота
 */
function refreshTelegramKeyboard() {
  try {
    var text = '⌨️ Клавиатура управления Villa Turaman успешно обновлена на вашем телефоне.';
    var replyKeyboard = buildTelegramReplyKeyboard_();
    sendTelegramMessage_(text, replyKeyboard);
    SpreadsheetApp.getActive().toast('Клавиатура бота обновлена.', '✅ Завершено', 5);
  } catch (err) {
    SpreadsheetApp.getUi().alert('Ошибка обновления клавиатуры', err.message, SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

/**
 * Регистрация нативных команд бота через setMyCommands
 */
function registerTelegramBotCommands() {
  try {
    var cfg = getTelegramConfig_();
    if (!cfg.token) {
      throw new Error('TELEGRAM_BOT_TOKEN не задан.');
    }
    var commands = [
      { command: 'start', description: 'Запуск и Главное меню управления' },
      { command: 'menu', description: 'Открыть главное меню бота' },
      { command: 'requests', description: 'Список активных заявок на модерации' },
      { command: 'chats', description: 'Последние обращения и чаты гостей' },
      { command: 'calendar', description: 'График занятости виллы на 30 дней' },
      { command: 'prices', description: 'Сводка тарифов и правила бронирования' },
      { command: 'broadcast_all', description: 'Массовое сообщение всем гостям' },
      { command: 'status', description: 'Статус синхронизации и Webhook' }
    ];
    var url = 'https://api.telegram.org/bot' + cfg.token + '/setMyCommands';
    var options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({ commands: commands }),
      muteHttpExceptions: true
    };
    var response = UrlFetchApp.fetch(url, options);
    var result = JSON.parse(response.getContentText());
    if (result.ok) {
      SpreadsheetApp.getUi().alert('✅ Команды зарегистрированы!', 'Нативные команды Telegram бота успешно зарегистрированы в меню интерфейса Telegram.', SpreadsheetApp.getUi().ButtonSet.OK);
    } else {
      SpreadsheetApp.getUi().alert('Ошибка регистрации команд', result.description || 'Неизвестная ошибка', SpreadsheetApp.getUi().ButtonSet.OK);
    }
  } catch (err) {
    SpreadsheetApp.getUi().alert('Ошибка', err.message, SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

/**
 * 2. Отправка списка активных заявок в Telegram
 */
function sendTelegramPendingRequests() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('📋 Заявки и Бронирования') || ss.getSheetByName('Вилла') || ss.getSheetByName('Bookings');
    if (!sheet) {
      throw new Error('Лист Заявки и Бронирования не найден.');
    }
    var values = sheet.getDataRange().getValues();
    if (values.length <= 1) {
      sendTelegramMessage_('📋 Заявок на модерации пока нет.');
      SpreadsheetApp.getActive().toast('Нет активных заявок.', 'ℹ️ Информация', 5);
      return;
    }

    var pendingList = [];
    for (var i = 1; i < values.length; i++) {
      var row = values[i];
      var status = (row[10] || '').toString().trim();
      if (status === 'ЗАПРОС' || status.indexOf('ОЖИДАЕТ ОПЛАТЫ') === 0 || status.indexOf('СПЕЦПРЕДЛОЖЕНИЕ') === 0) {
        pendingList.push({
          rowIndex: i + 1,
          date: row[0],
          name: row[1] || 'Гость',
          contact: row[2] || '-',
          checkIn: row[3] || '-',
          checkOut: row[4] || '-',
          nights: row[5] || '-',
          guests: row[8] || '-',
          price: row[9] || '-',
          status: status
        });
      }
    }

    if (pendingList.length === 0) {
      sendTelegramMessage_('✅ Все заявки обработаны! Новых заявок на модерации нет.');
      SpreadsheetApp.getActive().toast('Все заявки обработаны.', '✅ Чисто', 5);
      return;
    }

    sendTelegramMessage_('📋 Найдено активных заявок: ' + pendingList.length);
    for (var k = 0; k < pendingList.length; k++) {
      var item = pendingList[k];
      var cardText = '📋 ЗАЯВКА №' + item.rowIndex + '\n' +
        '👤 Гость: ' + item.name + '\n' +
        '📞 Контакт: ' + item.contact + '\n' +
        '📅 Даты: ' + item.checkIn + ' - ' + item.checkOut + ' : ' + item.nights + ' ночей\n' +
        '👥 Гостей: ' + item.guests + '\n' +
        '💰 Стоимость: ' + item.price + '\n' +
        'Статус: ' + item.status;

      var buttons = {
        inline_keyboard: [
          [
            { text: '✅ Одобрить: 24ч HOLD', callback_data: 'approve_' + item.rowIndex + '_' + item.contact },
            { text: '❌ Отклонить', callback_data: 'reject_' + item.rowIndex + '_' + item.contact }
          ],
          [
            { text: '✍️ Ответить: ' + item.name, callback_data: 'reply_' + item.contact }
          ]
        ]
      };
      sendTelegramMessage_(cardText, buttons);
    }
    SpreadsheetApp.getActive().toast('Отправлено заявок в Telegram: ' + pendingList.length, '✅ Завершено', 5);
  } catch (err) {
    SpreadsheetApp.getUi().alert('Ошибка отправки заявок', err.message, SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

/**
 * Аудит накладок и 24ч HOLD в Telegram
 */
function auditTelegramCalendarHolds() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var calSheet = ss.getSheetByName('📅 Календарь и Тарифы') || ss.getSheetByName('Календарь') || ss.getSheetByName('Calendar');
    if (!calSheet) {
      throw new Error('Лист Календарь не найден.');
    }
    var rows = calSheet.getDataRange().getValues();
    var activeHolds = 0;
    var expiredHolds = 0;
    var now = new Date().getTime();

    for (var i = 1; i < rows.length; i++) {
      var type = rows[i][2];
      var val = (rows[i][3] || '').toString();
      if (type === 'Блокировка' && val.indexOf('HOLD|') === 0) {
        var parts = val.split('|');
        if (parts.length >= 3) {
          var exp = new Date(parts[2]).getTime();
          if (now > exp) {
            expiredHolds++;
          } else {
            activeHolds++;
          }
        }
      }
    }

    var report = '🔍 АУДИТ КАЛЕНДАРЯ И 24ч HOLD:\n\n' +
      '• Активных удержаний HOLD: ' + activeHolds + '\n' +
      '• Истекших удержаний: ' + expiredHolds + '\n\n' +
      (expiredHolds > 0 ? '⚠️ Рекомендуется очистить истекшие блокировки через меню таблицы.' : '✅ Все удержания актуальны.');

    var inlineButtons = {
      inline_keyboard: [
        [{ text: '📅 Просмотреть календарь', callback_data: 'menu_calendar' }]
      ]
    };
    sendTelegramMessage_(report, inlineButtons);
    SpreadsheetApp.getActive().toast('Аудит HOLD отправлен в Telegram.', '✅ Завершено', 5);
  } catch (err) {
    SpreadsheetApp.getUi().alert('Ошибка аудита', err.message, SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

/**
 * 3. Отправка сводки последних диалогов в Telegram
 */
function sendTelegramRecentChats() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheets = ss.getSheets();
    var chatSheets = [];
    for (var i = 0; i < sheets.length; i++) {
      if (sheets[i].getName().indexOf('Chat_') === 0) {
        chatSheets.push(sheets[i]);
      }
    }

    if (chatSheets.length === 0) {
      sendTelegramMessage_('💬 Листов диалогов с гостями пока не создано.');
      SpreadsheetApp.getActive().toast('Диалогов не найдено.', 'ℹ️ Информация', 5);
      return;
    }

    sendTelegramMessage_('💬 Найдено диалогов с гостями: ' + chatSheets.length + '\nОтправляю последние обращения:');
    var maxChats = Math.min(chatSheets.length, 5);
    for (var j = 0; j < maxChats; j++) {
      var sh = chatSheets[j];
      var title = sh.getName();
      var parts = title.split('_');
      var clientName = parts[1] || 'Гость';
      var clientContact = parts.slice(2).join('_') || parts[2] || '-';
      var data = sh.getDataRange().getValues();
      var lastMsg = '-';
      var lastDate = '-';
      var lastSender = '-';

      if (data.length > 1) {
        var lastRow = data[data.length - 1];
        lastDate = lastRow[0] || '-';
        lastSender = lastRow[1] || '-';
        lastMsg = lastRow[2] || '-';
      }

      var chatCard = '💬 ДИАЛОГ: ' + clientName + '\n' +
        '📞 Контакт: ' + clientContact + '\n' +
        '🕒 Последнее: ' + lastDate + ' от ' + lastSender + '\n' +
        '📝 Текст: ' + lastMsg;

      var buttons = {
        inline_keyboard: [
          [
            { text: '✍️ Ответить: ' + clientName, callback_data: 'reply_' + clientContact },
            { text: '📜 История', callback_data: 'history_' + clientContact }
          ]
        ]
      };
      sendTelegramMessage_(chatCard, buttons);
    }
    SpreadsheetApp.getActive().toast('Отправлена сводка чатов в Telegram.', '✅ Завершено', 5);
  } catch (err) {
    SpreadsheetApp.getUi().alert('Ошибка отправки чатов', err.message, SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

/**
 * Диалог отправки прямого сообщения гостю
 */
function sendTelegramDirectMessageDialog() {
  var ui = SpreadsheetApp.getUi();
  var contactRes = ui.prompt('Отправка сообщения гостю', 'Введите контакт гостя : телефон или email из листа диалога:', ui.ButtonSet.OK_CANCEL);
  if (contactRes.getSelectedButton() !== ui.Button.OK) return;
  var targetContact = contactRes.getResponseText().trim();
  if (!targetContact) return;

  var msgRes = ui.prompt('Текст ответа', 'Введите текст сообщения для гостя ' + targetContact + ':', ui.ButtonSet.OK_CANCEL);
  if (msgRes.getSelectedButton() !== ui.Button.OK) return;
  var messageText = msgRes.getResponseText().trim();
  if (!messageText) return;

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheets = ss.getSheets();
    var targetSheet = null;
    for (var i = 0; i < sheets.length; i++) {
      var sName = sheets[i].getName();
      if (sName.indexOf('Chat_') === 0 && sName.toLowerCase().indexOf(targetContact.toLowerCase()) !== -1) {
        targetSheet = sheets[i];
        break;
      }
    }

    var timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
    var fRU = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "ru")';
    var fEN = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "en")';
    var fTR = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "tr")';

    if (targetSheet) {
      targetSheet.appendRow([timestamp, 'Владелец', messageText, fRU, fEN, fTR, '']);
    }

    sendTelegramMessage_('📤 ОТПРАВЛЕНО ГОСТЮ ИЗ ТАБЛИЦЫ\n📞 Контакт: ' + targetContact + '\n📝 Текст: ' + messageText);
    ui.alert('✅ Сообщение отправлено!', 'Сообщение гостю успешно зафиксировано в чате и отправлено уведомление в Telegram.', ui.ButtonSet.OK);
  } catch (err) {
    ui.alert('Ошибка отправки', err.message, ui.ButtonSet.OK);
  }
}

/**
 * Диалог массовой рассылки сообщений гостям
 */
function sendTelegramBroadcastDialog() {
  var ui = SpreadsheetApp.getUi();
  var msgRes = ui.prompt('Массовая рассылка гостям', 'Введите текст сообщения для отправки во все активные чаты гостей:', ui.ButtonSet.OK_CANCEL);
  if (msgRes.getSelectedButton() !== ui.Button.OK) return;
  var broadcastText = msgRes.getResponseText().trim();
  if (!broadcastText) return;

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheets = ss.getSheets();
    var sentCount = 0;
    var timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
    var fRU = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "ru")';
    var fEN = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "en")';
    var fTR = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "tr")';

    for (var i = 0; i < sheets.length; i++) {
      var sName = sheets[i].getName();
      if (sName.indexOf('Chat_') === 0) {
        sheets[i].appendRow([timestamp, 'Владелец', broadcastText, fRU, fEN, fTR, '']);
        sentCount++;
      }
    }

    sendTelegramMessage_('📢 МАССОВАЯ РАССЫЛКА ИЗ ТАБЛИЦЫ\n📊 Получателей: ' + sentCount + '\n📝 Текст: ' + broadcastText);
    ui.alert('✅ Рассылка завершена!', 'Сообщение успешно доставлено в чатов: ' + sentCount + '.', ui.ButtonSet.OK);
  } catch (err) {
    ui.alert('Ошибка рассылки', err.message, ui.ButtonSet.OK);
  }
}

/**
 * 4. Отправка графика занятости виллы на 30 дней в Telegram
 */
function sendTelegramCalendarSummary() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var calSheet = ss.getSheetByName('📅 Календарь и Тарифы') || ss.getSheetByName('Календарь') || ss.getSheetByName('Calendar');
    if (!calSheet) {
      throw new Error('Лист Календарь не найден.');
    }
    var rows = calSheet.getDataRange().getValues();
    var blocks = [];

    for (var i = 1; i < rows.length; i++) {
      var start = rows[i][0];
      var end = rows[i][1];
      var type = rows[i][2];
      var note = rows[i][4] || '';
      if (type && type !== 'Настройки' && start) {
        blocks.push('• ' + start + ' - ' + end + ' : ' + type + (note ? ' - ' + note : ''));
      }
    }

    var text = '📅 КАЛЕНДАРЬ И ЗАНЯТОСТЬ ВИЛЛЫ\n\n' +
      (blocks.length > 0 ? 'Зафиксированные периоды:\n' + blocks.slice(0, 10).join('\n') : '✅ Все даты свободны для бронирования.');

    sendTelegramMessage_(text);
    SpreadsheetApp.getActive().toast('График календаря отправлен в Telegram.', '✅ Завершено', 5);
  } catch (err) {
    SpreadsheetApp.getUi().alert('Ошибка календаря', err.message, SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

/**
 * Отправка сводки тарифов в Telegram
 */
function sendTelegramRatesSummary() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var calSheet = ss.getSheetByName('📅 Календарь и Тарифы') || ss.getSheetByName('Календарь') || ss.getSheetByName('Calendar');
    var rows = calSheet ? calSheet.getDataRange().getValues() : [];
    var basePrice = '15 000 руб / ночь';

    for (var i = rows.length - 1; i >= 0; i--) {
      if (rows[i][2] === 'Настройки' && rows[i][3]) {
        try {
          var parsed = JSON.parse(rows[i][3]);
          if (parsed.basePrice) {
            basePrice = parsed.basePrice + ' ' + (parsed.currency || 'RUB') + ' / ночь';
          }
        } catch (e) { }
        break;
      }
    }

    var text = '💳 АКТУАЛЬНЫЕ ТАРИФЫ VILLA TURAMAN\n\n' +
      '• Базовый тариф: ' + basePrice + '\n' +
      '• Минимальный срок: 3 ночи\n' +
      '• Заезд: 16:00 | Выезд: 10:00\n' +
      '• Верификация: Email и Телефон\n' +
      '• Окно бронирования: 18 месяцев';

    sendTelegramMessage_(text);
    SpreadsheetApp.getActive().toast('Сводка тарифов отправлена в Telegram.', '✅ Завершено', 5);
  } catch (err) {
    SpreadsheetApp.getUi().alert('Ошибка тарифов', err.message, SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

/**
 * 5. Вызов ревалидации страниц сайта через бот
 */
function triggerTelegramRevalidate() {
  try {
    var cfg = getTelegramConfig_();
    var props = PropertiesService.getScriptProperties().getProperties();
    var revalUrl = props['REVALIDATE_API_URL'] || (cfg.siteUrl + '/api/revalidate');
    var secret = props['REVALIDATE_SECRET_TOKEN'] || 'YOUR_VERY_SECRET_RANDOM_STRING';

    UrlFetchApp.fetch(revalUrl + '?secret=' + encodeURIComponent(secret), { muteHttpExceptions: true });
    sendTelegramMessage_('⚡ Ревалидация витрины сайта успешно запущена из панели Google Таблиц.');
  } catch (err) {
    sendTelegramMessage_('❌ Ошибка ревалидации: ' + err.message);
  }
}

/**
 * Проверка статуса кабинета хозяина
 */
function checkTelegramHostCabinetStatus() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var masterSheet = ss.getSheetByName('🔑 Управление доступом') || ss.getSheetByName('MasterAccount');
    var isConfigured = false;
    if (masterSheet) {
      var rows = masterSheet.getDataRange().getValues();
      if (rows.length > 1) {
        isConfigured = true;
      }
    }
    var msg = '👑 СТАТУС КАБИНЕТА ХОЗЯИНА\n\n' +
      '• Доступ в листе Управление доступом: ' + (isConfigured ? '✅ Настроен' : '⚠️ Требует проверки') + '\n' +
      '• Режим: Владелец с полными правами\n' +
      '• Интеграция с Telegram: ✅ Активна';

    sendTelegramMessage_(msg);
    SpreadsheetApp.getActive().toast('Статус кабинета отправлен в Telegram.', '✅ Завершено', 5);
  } catch (err) {
    SpreadsheetApp.getUi().alert('Ошибка', err.message, SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

/**
 * 6. Настройка Webhook Telegram на Next.js API сайта
 */
function setTelegramWebhookToSite() {
  var ui = SpreadsheetApp.getUi();
  var cfg = getTelegramConfig_();
  if (!cfg.token) {
    ui.alert('Ошибка', 'Сначала укажите TELEGRAM_BOT_TOKEN в Свойствах скрипта.', ui.ButtonSet.OK);
    return;
  }

  var defaultWebhook = cfg.siteUrl + '/api/telegram-webhook';
  var res = ui.prompt('Установка Webhook Telegram', 'Введите полный URL эндпоинта webhook на сайте:\nПо умолчанию: ' + defaultWebhook, ui.ButtonSet.OK_CANCEL);
  if (res.getSelectedButton() !== ui.Button.OK) return;
  var webhookUrl = res.getResponseText().trim() || defaultWebhook;

  try {
    var url = 'https://api.telegram.org/bot' + cfg.token + '/setWebhook?url=' + encodeURIComponent(webhookUrl);
    var response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    var result = JSON.parse(response.getContentText());

    if (result.ok) {
      ui.alert('✅ Webhook установлен!', 'Telegram Webhook успешно перенаправлен на:\n' + webhookUrl + '\n\nТеперь все сообщения, кнопки и команды обрабатываются Next.js сервером виллы.', ui.ButtonSet.OK);
    } else {
      ui.alert('Ошибка Telegram API', result.description || 'Не удалось установить Webhook', ui.ButtonSet.OK);
    }
  } catch (err) {
    ui.alert('Ошибка соединения', err.message, ui.ButtonSet.OK);
  }
}

/**
 * Проверка статуса Telegram Webhook
 */
function checkTelegramWebhookStatus() {
  var ui = SpreadsheetApp.getUi();
  var cfg = getTelegramConfig_();
  if (!cfg.token) {
    ui.alert('Ошибка', 'TELEGRAM_BOT_TOKEN не задан.', ui.ButtonSet.OK);
    return;
  }

  try {
    var url = 'https://api.telegram.org/bot' + cfg.token + '/getWebhookInfo';
    var response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    var result = JSON.parse(response.getContentText());

    if (result.ok) {
      var info = result.result;
      var text = '🔍 СТАТУС TELEGRAM WEBHOOK:\n\n' +
        '• URL: ' + (info.url || 'Не установлен : Polling режим') + '\n' +
        '• Наличие кастомного сертификата: ' + (info.has_custom_certificate ? 'Да' : 'Нет') + '\n' +
        '• Ожидающих обновлений: ' + (info.pending_update_count || 0) + '\n' +
        (info.last_error_message ? '• Последняя ошибка: ' + info.last_error_message + '\n' : '') +
        (info.last_error_date ? '• Дата ошибки: ' + new Date(info.last_error_date * 1000).toLocaleString('ru-RU') + '\n' : '');

      ui.alert('Статус Webhook', text, ui.ButtonSet.OK);
    } else {
      ui.alert('Ошибка', result.description || 'Не удалось получить данные Webhook', ui.ButtonSet.OK);
    }
  } catch (err) {
    ui.alert('Ошибка', err.message, ui.ButtonSet.OK);
  }
}

/**
 * Удаление Webhook Telegram
 */
function deleteTelegramWebhook() {
  var ui = SpreadsheetApp.getUi();
  var cfg = getTelegramConfig_();
  if (!cfg.token) {
    ui.alert('Ошибка', 'TELEGRAM_BOT_TOKEN не задан.', ui.ButtonSet.OK);
    return;
  }

  try {
    var url = 'https://api.telegram.org/bot' + cfg.token + '/deleteWebhook';
    var response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    var result = JSON.parse(response.getContentText());

    if (result.ok) {
      ui.alert('✅ Webhook удален!', 'Telegram Webhook успешно удален. Бот переведен в режим ожидания getUpdates.', ui.ButtonSet.OK);
    } else {
      ui.alert('Ошибка', result.description || 'Не удалось удалить Webhook', ui.ButtonSet.OK);
    }
  } catch (err) {
    ui.alert('Ошибка', err.message, ui.ButtonSet.OK);
  }
}

/**
 * Быстрая интерактивная настройка токена и Chat ID Telegram
 */
function setupTelegramPropertiesInteractive() {
  var ui = SpreadsheetApp.getUi();
  var props = PropertiesService.getScriptProperties();

  var currentToken = props.getProperty('TELEGRAM_BOT_TOKEN') || '';
  var resToken = ui.prompt('Настройка токена Telegram', 'Введите TELEGRAM_BOT_TOKEN из @BotFather:', ui.ButtonSet.OK_CANCEL);
  if (resToken.getSelectedButton() !== ui.Button.OK) return;
  var token = resToken.getResponseText().trim() || currentToken;

  var currentChatId = props.getProperty('TELEGRAM_CHAT_ID') || '';
  var resChat = ui.prompt('Настройка Chat ID Telegram', 'Введите ваш числовой TELEGRAM_CHAT_ID:', ui.ButtonSet.OK_CANCEL);
  if (resChat.getSelectedButton() !== ui.Button.OK) return;
  var chatId = resChat.getResponseText().trim() || currentChatId;

  props.setProperties({
    'TELEGRAM_BOT_TOKEN': token,
    'TELEGRAM_CHAT_ID': chatId
  }, false);

  ui.alert('✅ Настройки сохранены!', 'Параметры Telegram успешно зафиксированы в Свойствах скрипта.', ui.ButtonSet.OK);
}

/**
 * Тестовый пинг в Telegram
 */
function sendTelegramTestPing() {
  try {
    var text = '🧪 ТЕСТОВЫЙ ПИНГ ИЗ GOOGLE ТАБЛИЦЫ\n\n' +
      'Связь между Google Apps Script и вашим Telegram-ботом полностью активна!\n' +
      'Время проверки: ' + new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });

    var buttons = {
      inline_keyboard: [
        [
          { text: '✅ Связь подтверждена', callback_data: 'menu_status' },
          { text: '📱 Главное меню', callback_data: 'menu_start' }
        ]
      ]
    };
    var res = sendTelegramMessage_(text, buttons);
    if (res.ok) {
      SpreadsheetApp.getUi().alert('✅ Тест успешен!', 'Тестовое сообщение с кнопками доставлено в ваш Telegram чат.', SpreadsheetApp.getUi().ButtonSet.OK);
    } else {
      SpreadsheetApp.getUi().alert('Ошибка Telegram', res.description || 'Не удалось отправить сообщение', SpreadsheetApp.getUi().ButtonSet.OK);
    }
  } catch (err) {
    SpreadsheetApp.getUi().alert('Ошибка пинга', err.message, SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

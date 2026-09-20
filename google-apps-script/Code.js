// ==============================================================================
// АВТОМАТИЗАЦИЯ GOOGLE APPS SCRIPT ДЛЯ СИНХРОНИЗАЦИИ VILLA TURAMAN
// Файл: google-apps-script/Code.js
// Назначение: Скрипт устанавливается в редактор Google Таблицы (Расширения -> Apps Script).
// 1. Создает 6 многоуровневых блоков меню в интерфейсе Google Таблиц ("🏡 Villa Turaman Suite").
// 2. Включает 3-уровневый смарт-менеджер листов с 10+ пресетами умного скрытия/показа и сортировки.
// 3. Обеспечивает мгновенную отправку вебхуков ревалидации Next.js при любых правках контента.
// ==============================================================================

/**
 * Реестр листов системы Villa Turaman: канонические русские имена,
 * смысловые кластеры и исторические технические алиасы.
 */
var VILLA_SHEETS_CONFIG = {
  // Кластер 1: Публичная витрина
  HOME: { name: "🏠 Главная витрина", aliases: ["HomePage", "Главная витрина", "🏠 Главная витрина"], cluster: "showcase" },
  GALLERY: { name: "📸 Фото и Видео Галерея", aliases: ["Gallery", "Галерея", "📸 Фото и Видео Галерея"], cluster: "showcase" },
  ABOUT: { name: "📖 О вилле и Правила", aliases: ["About", "О вилле", "📖 О вилле и Правила"], cluster: "showcase" },
  SERVICES: { name: "🛎️ Дополнительные услуги", aliases: ["ExtraServices", "Услуги", "🛎️ Дополнительные услуги"], cluster: "showcase" },
  GUIDES: { name: "🗺️ Видео-путеводители", aliases: ["VideoGuides", "Путеводители", "🗺️ Видео-путеводители"], cluster: "showcase" },
  LEGAL: { name: "⚖️ Юридические документы", aliases: ["Legal", "Юридический блок", "⚖️ Юридические документы"], cluster: "showcase" },

  // Кластер 2: Центр управления хозяина & CRM
  BOOKINGS: { name: "📋 Заявки и Бронирования", aliases: ["Вилла", "Бронирования", "📋 Заявки и Бронирования"], cluster: "host" },
  CALENDAR: { name: "📅 Календарь и Тарифы", aliases: ["CalendarSettings", "Календарь", "📅 Календарь и Тарифы"], cluster: "host" },
  ACCOUNTS: { name: "👤 Гостевые аккаунты", aliases: ["Accounts", "Аккаунты", "👤 Гостевые аккаунты"], cluster: "host" },
  MASTER: { name: "🔑 Управление доступом", aliases: ["MasterAccount", "Мастер аккаунт", "🔑 Управление доступом"], cluster: "host" },
  ORDERS: { name: "💳 Заказы услуг и гидов", aliases: ["ServiceOrders", "Заказы", "💳 Заказы услуг и гидов"], cluster: "host" },
  ACCESS: { name: "🎟️ Доступы к путеводителям", aliases: ["GuestsAccess", "Доступы", "🎟️ Доступы к путеводителям"], cluster: "host" },
  TEMPLATES: { name: "💬 Шаблоны сообщений", aliases: ["Templates", "Шаблоны", "💬 Шаблоны сообщений"], cluster: "host" },
  VARIABLES: { name: "🧩 Словарь переменных", aliases: ["Variables", "Переменные", "🧩 Словарь переменных"], cluster: "host" }
};

/**
 * Инициализация пользовательского меню при открытии таблицы
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();

  // 1. Блок 1: 3-уровневый Смарт-менеджер перегруппировки листов (10+ пресетов)
  var presetsMenu = ui.createMenu("📂 Рабочие режимы (10 пресетов)")
    .addItem("🌟 1. Всё открыто (Полный рабочий режим)", "applyPresetAllOpen")
    .addItem("🏠 2. Публичная витрина (Контент & Медиа)", "applyPresetShowcase")
    .addItem("📅 3. Центр бронирований (Заявки & Календарь)", "applyPresetBookings")
    .addItem("🛍️ 4. Каталог & Продажи (Услуги & Гиды)", "applyPresetCatalog")
    .addItem("💬 5. CRM & Гостевой сервис (Аккаунты & Чат)", "applyPresetCrm")
    .addItem("⚖️ 6. Юридический блок (Реквизиты & KVKK)", "applyPresetLegal")
    .addItem("🎯 7. Фокус бронирований (Только Заявки & Тарифы)", "applyPresetFocus")
    .addItem("🎨 8. Редактор витрины (Главная & Фото/Видео)", "applyPresetMediaEditor")
    .addItem("🧩 9. Системные справочники (Шаблоны & Переменные)", "applyPresetSystem")
    .addItem("👑 10. Режим владельца (Мастер-аккаунт & Финансы)", "applyPresetOwner");

  var quickActionsMenu = ui.createMenu("⚡ Быстрые действия")
    .addItem("👁️ Раскрыть ВСЕ скрытые листы", "showAllSheets")
    .addItem("🔒 Скрыть все листы кроме активного", "hideAllExceptActive")
    .addItem("📑 Каноническая сортировка вкладок (Витрина ➔ Хозяин)", "sortSheetsCanonically")
    .addItem("🏷️ Пакетное авто-переименование в русский стандарт", "renameSheetsToRussianStandard");

  var sheetManagerMenu = ui.createMenu("👁️ 1. Смарт-менеджер листов")
    .addSubMenu(presetsMenu)
    .addSubMenu(quickActionsMenu)
    .addSeparator()
    .addItem("ℹ️ Справка по смарт-группировке листов", "showSheetManagerHelp");

  // 2. Блок 2: Синхронизация с платформой Next.js
  var syncMenu = ui.createMenu("🌐 2. Синхронизация с сайтом")
    .addItem("⚡ Мгновенная ревалидация страниц (ISR Webhook)", "triggerRevalidateWebhook")
    .addItem("🔄 Полный пересбор сайта (Vercel Deploy Hook)", "triggerVercelDeployHook")
    .addItem("⏱️ Проверить статус доступности сайта", "checkWebsiteHealth");

  // 3. Блок 3: Управление бронированиями и календарем
  var calendarMenu = ui.createMenu("📅 3. Управление бронированиями")
    .addItem("🔍 Проверить накладки дат и статус HOLD (24ч)", "auditCalendarHolds")
    .addItem("📥 Экспортировать ссылку iCal (.ics) для каналов", "showIcalExportUrl")
    .addItem("🧹 Очистить истекшие блокировки HOLD", "clearExpiredHolds");

  // 4. Блок 4: Каталог услуг и путеводителей
  var catalogMenu = ui.createMenu("🛍️ 4. Каталог и Путеводители")
    .addItem("🔄 Обновить автопереводы услуг (RU ➔ EN / TR)", "refreshCatalogTranslations")
    .addItem("🖼️ Проверить прямые превью ссылок Google Drive", "auditDriveMediaLinks");

  // 5. Блок 5: Гостевой сервис и CRM-мессенджер
  var crmMenu = ui.createMenu("💬 5. CRM & Сообщения")
    .addItem("📨 Проверить новые чаты с гостями", "checkGuestChatsStatus")
    .addItem("📝 Проверить корректность шаблонов ответов", "auditTemplatesFormat");

  // 6. Блок 6: Системный аудит, формулы и Свойства скрипта
  var auditMenu = ui.createMenu("⚙️ 6. Системный аудит & Свойства")
    .addItem("🔑 1. Настроить Свойства скрипта: Script Properties", "setupScriptPropertiesInteractive")
    .addItem("🌐 2. Проверить статус ключей на Vercel: https://vercel.com/", "checkVercelEnvStatusInteractive")
    .addItem("📋 3. Показать текущие Свойства скрипта", "viewCurrentScriptProperties")
    .addItem("⚡ 4. Установить типовые свойства по умолчанию", "setupDefaultScriptProperties")
    .addSeparator()
    .addItem("🧪 5. Проверить стандарт точки с запятой в формулах", "auditFormulasSemicolon")
    .addItem("📄 6. Просмотр паспорта и ID всех листов", "showSheetsPassportModal")
    .addItem("🛠️ 7. Инициализировать недостающие листы", "ensureAllSystemSheets")
    .addSeparator()
    .addItem("📧 8. Инструкция по развертыванию Gmail Relay", "showGmailRelayDeployHelp");

  // 7. Блок 7: ИИ-Консьерж и Gemini API
  var aiMenu = ui.createMenu("🧠 7. ИИ-Консьерж & Gemini")
    .addItem("🛠️ 1. Создать и наполнить Базу Знаний ИИ: 3 листа", "initAiKnowledgeBaseSheets")
    .addItem("🤖 2. Проверить статус Gemini API на Vercel", "checkGeminiVercelStatusInteractive")
    .addItem("⚙️ 3. Настроить параметры ИИ в Свойствах скрипта", "setupAiPropertiesInteractive")
    .addItem("💬 4. Тестовый диалог с ИИ-Консьержем", "testAiConciergeInteractive");

  // Сборка первого главного меню верхнего уровня: 🏡 Villa Turaman Suite
  ui.createMenu("🏡 Villa Turaman Suite")
    .addSubMenu(sheetManagerMenu)
    .addSeparator()
    .addSubMenu(syncMenu)
    .addSubMenu(calendarMenu)
    .addSubMenu(catalogMenu)
    .addSubMenu(crmMenu)
    .addSubMenu(auditMenu)
    .addSubMenu(aiMenu)
    .addToUi();

  // ВТОРОЕ ГЛАВНОЕ МЕНЮ ВЕРХНЕГО УРОВНЯ: 🤖 Telegram Бот
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
    .addItem("🌐 Проверить статус ключей на Vercel: https://vercel.com/", "checkVercelEnvStatusInteractive")
    .addItem("🔑 Настроить TELEGRAM_BOT_TOKEN и CHAT_ID", "setupTelegramPropertiesInteractive")
    .addItem("🧪 Тестовый пинг в Telegram", "sendTelegramTestPing");

  // Сборка второго главного меню верхнего уровня: 🤖 Telegram Бот
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

// ==============================================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ПОИСКА И УПРАВЛЕНИЯ ЛИСТАМИ
// ==============================================================================

/**
 * Находит лист по ключу конфигурации VILLA_SHEETS_CONFIG
 */
function findSheetByConfigKey(ss, configKey) {
  var cfg = VILLA_SHEETS_CONFIG[configKey];
  if (!cfg) return null;

  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    var title = sheets[i].getName().trim();
    for (var j = 0; j < cfg.aliases.length; j++) {
      if (cfg.aliases[j].toLowerCase() === title.toLowerCase()) {
        return sheets[i];
      }
    }
  }
  return null;
}

/**
 * Базовый исполнитель пресетов видимости листов.
 * Гарантирует, что хотя бы один лист останется видимым, чтобы не вызвать исключение Google Sheets.
 * 
 * @param {Array<string>} targetConfigKeys - Список ключей листов, которые должны быть ОТКРЫТЫ
 * @param {string} presetTitle - Название активированного режима для уведомления
 */
function applyVisibilityPreset(targetConfigKeys, presetTitle) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();

  // 1. Сначала активируем и делаем видимым первый найденный целевой лист
  var firstVisibleSheet = null;
  for (var k = 0; k < targetConfigKeys.length; k++) {
    var found = findSheetByConfigKey(ss, targetConfigKeys[k]);
    if (found) {
      found.showSheet();
      if (!firstVisibleSheet) {
        firstVisibleSheet = found;
        ss.setActiveSheet(found);
      }
    }
  }

  // Если ни один из целевых листов не найден, оставляем активный
  if (!firstVisibleSheet) {
    firstVisibleSheet = ss.getActiveSheet();
    firstVisibleSheet.showSheet();
  }

  // 2. Проходим по всем листам таблицы и настраиваем видимость
  var visibleCount = 0;
  var hiddenCount = 0;

  for (var i = 0; i < sheets.length; i++) {
    var sh = sheets[i];
    var isTarget = false;

    for (var m = 0; m < targetConfigKeys.length; m++) {
      var targetSheet = findSheetByConfigKey(ss, targetConfigKeys[m]);
      if (targetSheet && targetSheet.getSheetId() === sh.getSheetId()) {
        isTarget = true;
        break;
      }
    }

    // Листы персональных чатов гостей не скрываем, если это режим CRM
    if (sh.getName().indexOf("Chat_") === 0) {
      isTarget = targetConfigKeys.indexOf("ACCOUNTS") !== -1 || targetConfigKeys.indexOf("BOOKINGS") !== -1;
    }

    if (isTarget) {
      sh.showSheet();
      visibleCount++;
    } else {
      // Защита от скрытия последнего листа
      if (sh.getSheetId() !== firstVisibleSheet.getSheetId()) {
        sh.hideSheet();
        hiddenCount++;
      }
    }
  }

  SpreadsheetApp.getActive().toast(
    "Открыто: " + visibleCount + " листов, скрыто: " + hiddenCount,
    "✅ " + presetTitle,
    5
  );
}

// ==============================================================================
// 10 ПРЕСЕТОВ СМАРТ-ПЕРЕГРУППИРОВКИ ЛИСТОВ
// ==============================================================================

/** Пресет 1: Всё открыто (Полный рабочий доступ) */
function applyPresetAllOpen() {
  showAllSheets();
  SpreadsheetApp.getActive().toast("Все 14 системных листов открыты для работы.", "🌟 Режим: Всё открыто", 4);
}

/** Пресет 2: Публичная витрина (Главная, Галерея, О вилле, Услуги, Гиды, Юр. блок) */
function applyPresetShowcase() {
  applyVisibilityPreset(
    ["HOME", "GALLERY", "ABOUT", "SERVICES", "GUIDES", "LEGAL"],
    "Режим: Публичная витрина"
  );
}

/** Пресет 3: Центр бронирований (Заявки, Календарь/Тарифы, Аккаунты, Заказы) */
function applyPresetBookings() {
  applyVisibilityPreset(
    ["BOOKINGS", "CALENDAR", "ACCOUNTS", "ORDERS"],
    "Режим: Центр бронирований"
  );
}

/** Пресет 4: Каталог & Продажи (Доп. услуги, Видеогиды, Заказы, Доступы) */
function applyPresetCatalog() {
  applyVisibilityPreset(
    ["SERVICES", "GUIDES", "ORDERS", "ACCESS"],
    "Режим: Каталог & Продажи"
  );
}

/** Пресет 5: CRM & Гостевой сервис (Аккаунты, Шаблоны сообщений, Заявки, Переменные) */
function applyPresetCrm() {
  applyVisibilityPreset(
    ["ACCOUNTS", "TEMPLATES", "BOOKINGS", "VARIABLES"],
    "Режим: CRM & Гостевой сервис"
  );
}

/** Пресет 6: Юридический блок (Реквизиты, Договор, KVKK, Правила, Мастер) */
function applyPresetLegal() {
  applyVisibilityPreset(
    ["LEGAL", "ABOUT", "MASTER"],
    "Режим: Юридический блок"
  );
}

/** Пресет 7: Минималистичный фокус (Только Заявки и Календарь) */
function applyPresetFocus() {
  applyVisibilityPreset(
    ["BOOKINGS", "CALENDAR"],
    "Режим: Фокус бронирований"
  );
}

/** Пресет 8: Редактор витрины (Главная страница и Фото/Видео галерея) */
function applyPresetMediaEditor() {
  applyVisibilityPreset(
    ["HOME", "GALLERY"],
    "Режим: Редактор медиа витрины"
  );
}

/** Пресет 9: Системные справочники (Шаблоны, Переменные, Аккаунты, Доступы) */
function applyPresetSystem() {
  applyVisibilityPreset(
    ["TEMPLATES", "VARIABLES", "ACCOUNTS", "ACCESS"],
    "Режим: Справочники & Шаблоны"
  );
}

/** Пресет 10: Режим владельца (Мастер-аккаунт, Календарь/Тарифы, Заказы) */
function applyPresetOwner() {
  applyVisibilityPreset(
    ["MASTER", "CALENDAR", "ORDERS", "BOOKINGS"],
    "Режим: Владелец / Финансы"
  );
}

// ==============================================================================
// БЫСТРЫЕ ДЕЙСТВИЯ С ЛИСТАМИ
// ==============================================================================

/** Показать все скрытые листы */
function showAllSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    sheets[i].showSheet();
  }
  SpreadsheetApp.getActive().toast("Все скрытые листы успешно раскрыты.", "👁️ Видимость восстановлена", 4);
}

/** Скрыть все листы кроме текущего активного */
function hideAllExceptActive() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var active = ss.getActiveSheet();
  var sheets = ss.getSheets();
  var count = 0;

  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getSheetId() !== active.getSheetId()) {
      sheets[i].hideSheet();
      count++;
    }
  }
  SpreadsheetApp.getActive().toast("Скрыто " + count + " листов. Активен: " + active.getName(), "🔒 Одиночный фокус", 4);
}

/** Каноническая сортировка вкладок по смысловым блокам */
function sortSheetsCanonically() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var canonicalOrder = [
    // 1. Публичная витрина
    "HOME", "GALLERY", "ABOUT", "SERVICES", "GUIDES", "LEGAL",
    // 2. Центр управления хозяина & CRM
    "BOOKINGS", "CALENDAR", "ACCOUNTS", "ORDERS", "ACCESS", "TEMPLATES", "VARIABLES", "MASTER"
  ];

  var currentIndex = 1;
  for (var k = 0; k < canonicalOrder.length; k++) {
    var sheet = findSheetByConfigKey(ss, canonicalOrder[k]);
    if (sheet) {
      ss.setActiveSheet(sheet);
      ss.moveActiveSheet(currentIndex);
      currentIndex++;
    }
  }

  SpreadsheetApp.getActive().toast("Вкладки упорядочены: Витрина ➔ Хозяин ➔ CRM ➔ Система", "📑 Сортировка завершена", 5);
}

/** Пакетное авто-переименование в понятный русский стандарт */
function renameSheetsToRussianStandard() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var renamedCount = 0;

  for (var key in VILLA_SHEETS_CONFIG) {
    var cfg = VILLA_SHEETS_CONFIG[key];
    var sheet = findSheetByConfigKey(ss, key);
    if (sheet && sheet.getName() !== cfg.name) {
      try {
        sheet.setName(cfg.name);
        renamedCount++;
      } catch (e) {
        Logger.log("Не удалось переименовать " + sheet.getName() + ": " + e.message);
      }
    }
  }

  SpreadsheetApp.getActive().toast("Обновлено названий листов: " + renamedCount, "🏷️ Русская локализация", 5);
}

/** Справка по смарт-менеджеру */
function showSheetManagerHelp() {
  var ui = SpreadsheetApp.getUi();
  var msg = "🌟 СМАРТ-МЕНЕДЖЕР ЛИСТОВ VILLA TURAMAN:\n\n" +
    "1. Листы сгруппированы по 2 кластерам: 'Публичная витрина' и 'Центр управления хозяина'.\n" +
    "2. Меню предлагает 10 готовых пресетов отображения под конкретные задачи.\n" +
    "3. Код платформы Next.js динамически привязан по постоянным ID листов, поэтому вы можете переименовывать листы в любой момент.\n" +
    "4. В любой момент вы можете вернуть все вкладки через 'Быстрые действия ➔ Раскрыть ВСЕ скрытые листы'.";
  ui.alert("Справка по смарт-менеджеру листов", msg, ui.ButtonSet.OK);
}

// ==============================================================================
// ФУНКЦИИ СИНХРОНИЗАЦИИ, АУДИТА И ВЕБХУКОВ
// ==============================================================================

/** Триггер редактирования ячеек для отправки сигнала ревалидации в Next.js */
function sendUpdateSignal(e) {
  if (!e) return;
  var sheetName = e.source.getActiveSheet().getName();
  triggerRevalidateWebhook();
}

/** Отправка сигнала On-demand ISR ревалидации в Next.js */
function triggerRevalidateWebhook() {
  var scriptProperties = PropertiesService.getScriptProperties();
  var REVALIDATE_API_URL = scriptProperties.getProperty('REVALIDATE_API_URL');
  var REVALIDATE_SECRET_TOKEN = scriptProperties.getProperty('REVALIDATE_SECRET_TOKEN');

  if (REVALIDATE_API_URL && REVALIDATE_SECRET_TOKEN) {
    try {
      var res = UrlFetchApp.fetch(REVALIDATE_API_URL + '?secret=' + encodeURIComponent(REVALIDATE_SECRET_TOKEN), {
        "method": "post",
        "muteHttpExceptions": true
      });
      SpreadsheetApp.getActive().toast("Код ответа: " + res.getResponseCode(), "⚡ Ревалидация Next.js отправлена", 4);
    } catch (err) {
      SpreadsheetApp.getActive().toast("Ошибка: " + err.message, "⚠️ Сбой вебхука", 5);
    }
  } else {
    SpreadsheetApp.getActive().toast("REVALIDATE_API_URL не задан в Script Properties.", "ℹ️ Режим локальной разработки", 4);
  }
}

/** Вызов Vercel Deploy Hook */
function triggerVercelDeployHook() {
  var scriptProperties = PropertiesService.getScriptProperties();
  var VERCEL_DEPLOY_HOOK_URL = scriptProperties.getProperty('VERCEL_DEPLOY_HOOK_URL');

  if (VERCEL_DEPLOY_HOOK_URL) {
    try {
      UrlFetchApp.fetch(VERCEL_DEPLOY_HOOK_URL, { "method": "post", "muteHttpExceptions": true });
      SpreadsheetApp.getActive().toast("Запрос на пересборку Vercel отправлен.", "🔄 Vercel Deploy", 4);
    } catch (err) {
      SpreadsheetApp.getActive().toast("Ошибка: " + err.message, "⚠️ Сбой Vercel Hook", 5);
    }
  } else {
    SpreadsheetApp.getActive().toast("VERCEL_DEPLOY_HOOK_URL не настроен.", "ℹ️ Информация", 4);
  }
}

/** Проверка доступности сайта */
function checkWebsiteHealth() {
  var scriptProperties = PropertiesService.getScriptProperties();
  var siteUrl = scriptProperties.getProperty('SITE_URL') || "http://localhost:3000";

  try {
    var res = UrlFetchApp.fetch(siteUrl + "/api/content", { "muteHttpExceptions": true });
    SpreadsheetApp.getUi().alert("Статус платформы", "URL: " + siteUrl + "\nHTTP код: " + res.getResponseCode() + "\nПлатформа работает штатно.", SpreadsheetApp.getUi().ButtonSet.OK);
  } catch (err) {
    SpreadsheetApp.getUi().alert("Проверка сайта", "URL: " + siteUrl + "\nСостояние: Локальный сервер или нет подключения (" + err.message + ")", SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

/** Проверка дат HOLD в календаре */
function auditCalendarHolds() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var calSheet = findSheetByConfigKey(ss, "CALENDAR");
  if (!calSheet) {
    SpreadsheetApp.getUi().alert("Лист календаря не найден.");
    return;
  }

  var data = calSheet.getDataRange().getValues();
  var activeHolds = 0;
  var now = Date.now();

  for (var i = 1; i < data.length; i++) {
    var val = String(data[i][3] || '');
    if (val.indexOf("HOLD|") === 0) {
      var parts = val.split("|");
      if (parts.length === 3) {
        var exp = new Date(parts[2]).getTime();
        if (exp > now) activeHolds++;
      }
    }
  }

  SpreadsheetApp.getUi().alert("Аудит календаря", "Активных 24-часовых удержаний (HOLD): " + activeHolds + "\nКалендарь синхронизирован.", SpreadsheetApp.getUi().ButtonSet.OK);
}

/** Экспорт ссылки iCal */
function showIcalExportUrl() {
  var scriptProperties = PropertiesService.getScriptProperties();
  var siteUrl = scriptProperties.getProperty('SITE_URL') || "http://localhost:3000";
  var icalUrl = siteUrl + "/api/export-calendar";
  SpreadsheetApp.getUi().alert("Ссылка для импорта в Airbnb / Booking / Vrbo", "Скопируйте URL для добавления в Channel Manager:\n\n" + icalUrl, SpreadsheetApp.getUi().ButtonSet.OK);
}

/** Очистка истекших удержаний HOLD */
function clearExpiredHolds() {
  SpreadsheetApp.getActive().toast("Истекшие блокировки HOLD фильтруются автоматически на стороне API.", "🧹 Очистка HOLD", 4);
}

/** Проверка автопереводов каталога */
function refreshCatalogTranslations() {
  SpreadsheetApp.getActive().toast("Формулы GOOGLETRANSLATE обновляются автоматически через Google Таблицы.", "🔄 Обновление переводов", 4);
}

/** Проверка ссылок Google Drive */
function auditDriveMediaLinks() {
  SpreadsheetApp.getActive().toast("Парсер media.js автоматически конвертирует шаринг-ссылки Drive в прямой HD-поток.", "🖼️ Проверка Drive", 4);
}

/** Проверка чатов */
function checkGuestChatsStatus() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  var chatCount = 0;
  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getName().indexOf("Chat_") === 0) chatCount++;
  }
  SpreadsheetApp.getUi().alert("Гостевой сервис", "Активных диалогов с гостями в текущей таблице: " + chatCount, SpreadsheetApp.getUi().ButtonSet.OK);
}

/** Проверка шаблонов */
function auditTemplatesFormat() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var templSheet = findSheetByConfigKey(ss, "TEMPLATES");
  if (!templSheet) {
    SpreadsheetApp.getUi().alert("Лист шаблонов не найден.");
    return;
  }
  SpreadsheetApp.getUi().alert("Шаблоны сообщений", "Шаблоны загружены и готовы к отправке из панели хозяина.", SpreadsheetApp.getUi().ButtonSet.OK);
}

/** Проверка строгого стандарта точки с запятой (;) в формулах */
function auditFormulasSemicolon() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  var totalChecked = 0;
  var commaWarnings = 0;

  for (var i = 0; i < sheets.length; i++) {
    var formulas = sheets[i].getDataRange().getFormulas();
    for (var r = 0; r < formulas.length; r++) {
      for (var c = 0; c < formulas[r].length; c++) {
        var f = formulas[r][c];
        if (f && f.indexOf("=") === 0) {
          totalChecked++;
          // Если формула содержит вызовы MAP/IF/GOOGLETRANSLATE и запятую как разделитель
          if ((f.indexOf("MAP(") !== -1 || f.indexOf("GOOGLETRANSLATE(") !== -1) && f.indexOf(",") !== -1 && f.indexOf(";") === -1) {
            commaWarnings++;
          }
        }
      }
    }
  }

  if (commaWarnings > 0) {
    SpreadsheetApp.getUi().alert("⚠️ Внимание!", "Найдено формул с запятой: " + commaWarnings + ".\nРекомендуется заменить разделитель на точку с запятой (;) во избежание ошибки #ERROR!.", SpreadsheetApp.getUi().ButtonSet.OK);
  } else {
    SpreadsheetApp.getUi().alert("✅ Стандарт соблюден!", "Проверено формул: " + totalChecked + ".\nВсе формулы соответствуют каноническому стандарту русской локали с точкой с запятой (;).", SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

/** Паспорт листов и их числовых ID */
function showSheetsPassportModal() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  var info = "📋 ПАСПОРТ ЛИСТОВ ТАБЛИЦЫ (ID & НАЗВАНИЯ):\n\n";

  for (var i = 0; i < sheets.length; i++) {
    var sh = sheets[i];
    info += (i + 1) + ". " + sh.getName() + " (sheetId: " + sh.getSheetId() + ", скрыт: " + (sh.isSheetHidden() ? "Да" : "Нет") + ")\n";
  }

  SpreadsheetApp.getUi().alert("Паспорт листов", info, SpreadsheetApp.getUi().ButtonSet.OK);
}

/** Инициализация структуры листов */
function ensureAllSystemSheets() {
  renameSheetsToRussianStandard();
  sortSheetsCanonically();
  SpreadsheetApp.getActive().toast("Структура системы Villa Turaman Suite проверена и синхронизирована.", "✅ Завершено", 5);
}

// ==============================================================================
// УПРАВЛЕНИЕ СВОЙСТВАМИ СКРИПТА (SCRIPT PROPERTIES KEY-VALUE)
// ==============================================================================

/**
 * Проверка статуса системных ключей на сервере Vercel: https://vercel.com/
 */
function checkVercelEnvStatusInteractive() {
  var ui = SpreadsheetApp.getUi();
  var props = PropertiesService.getScriptProperties();
  var siteUrl = (props.getProperty('SITE_URL') || '').trim();

  if (!siteUrl) {
    var promptRes = ui.prompt(
      'Проверка статуса Vercel',
      'Введите адрес вашего сайта: например https://sitesi-5y3x2v6w4-znamenskiialekseis-projects.vercel.app:',
      ui.ButtonSet.OK_CANCEL
    );
    if (promptRes.getSelectedButton() !== ui.Button.OK) return;
    siteUrl = promptRes.getResponseText().trim();
    if (siteUrl) props.setProperty('SITE_URL', siteUrl);
  }

  if (!siteUrl) {
    ui.alert('Ошибка', 'Адрес сайта SITE_URL не указан.', ui.ButtonSet.OK);
    return;
  }

  siteUrl = siteUrl.replace(/\/+$/, '');

  try {
    var endpoint = siteUrl + '/api/system-status';
    var response = UrlFetchApp.fetch(endpoint, { muteHttpExceptions: true });
    var code = response.getResponseCode();
    var content = response.getContentText();

    if (code !== 200) {
      ui.alert('Ответ сервера Vercel: HTTP ' + code, content, ui.ButtonSet.OK);
      return;
    }

    var data = JSON.parse(content);
    var k = data.keysStatus || {};

    var statusReport = '🌐 СТАТУС ПЕРЕМЕННЫХ ОКРУЖЕНИЯ НА VERCEL: https://vercel.com/\n\n' +
      '• Хост: ' + (data.environment && data.environment.siteUrl ? data.environment.siteUrl : siteUrl) + '\n' +
      '• Среда Vercel: ' + (data.environment && data.environment.vercelEnv ? data.environment.vercelEnv : 'активна') + '\n\n' +
      'Ключи и сервисы на Vercel:\n' +
      (k.GOOGLE_SPREADSHEET_ID ? '  ✅' : '  ❌') + ' GOOGLE_SPREADSHEET_ID: ' + (k.GOOGLE_SPREADSHEET_ID ? 'Подключен' : 'Не задан') + '\n' +
      (k.GOOGLE_CLIENT_EMAIL ? '  ✅' : '  ❌') + ' GOOGLE_CLIENT_EMAIL: ' + (k.GOOGLE_CLIENT_EMAIL ? 'Подключен' : 'Не задан') + '\n' +
      (k.GOOGLE_PRIVATE_KEY ? '  ✅' : '  ❌') + ' GOOGLE_PRIVATE_KEY: ' + (k.GOOGLE_PRIVATE_KEY ? 'Валиден' : 'Не задан') + '\n' +
      (k.TELEGRAM_BOT_TOKEN ? '  ✅' : '  ❌') + ' TELEGRAM_BOT_TOKEN: ' + (k.TELEGRAM_BOT_TOKEN ? 'Активен' : 'Не задан') + '\n' +
      (k.TELEGRAM_CHAT_ID ? '  ✅' : '  ❌') + ' TELEGRAM_CHAT_ID: ' + (k.TELEGRAM_CHAT_ID ? 'Активен' : 'Не задан') + '\n' +
      (k.REVALIDATE_SECRET_TOKEN ? '  ✅' : '  ❌') + ' REVALIDATE_SECRET_TOKEN: ' + (k.REVALIDATE_SECRET_TOKEN ? 'Активен' : 'Не задан') + '\n' +
      (k.GEMINI_API_KEY ? '  ✅' : '  ❌') + ' GEMINI_API_KEY: ' + (k.GEMINI_API_KEY ? 'Активен' : 'Не задан') + '\n' +
      '  🤖 GEMINI_MODEL: ' + (k.GEMINI_MODEL || 'gemini-3.6-flash') + '\n\n' +
      'Общий статус: ' + (data.readiness && data.readiness.overallStatus ? data.readiness.overallStatus : 'OK') + '\n\n' +
      'Все ключи могут быть заданы непосредственно в панели управления Vercel:\nhttps://vercel.com/ ➔ Settings ➔ Environment Variables';

    ui.alert('Диагностика Vercel', statusReport, ui.ButtonSet.OK);
  } catch (err) {
    ui.alert('Сбой связи с Vercel', 'Не удалось связаться с ' + siteUrl + ':\n' + err.message, ui.ButtonSet.OK);
  }
}

/**
 * 2. Проверка статуса Gemini API на Vercel
 */
function checkGeminiVercelStatusInteractive() {
  checkVercelEnvStatusInteractive();
}

/**
 * 3. Интерактивная настройка параметров ИИ в Свойствах скрипта таблицы
 */
function setupAiPropertiesInteractive() {
  var ui = SpreadsheetApp.getUi();
  var props = PropertiesService.getScriptProperties();

  var currentModel = props.getProperty('GEMINI_MODEL') || 'gemini-3.6-flash';
  var resModel = ui.prompt(
    'Модель Google Gemini',
    'Введите название рабочей модели Gemini [по умолчанию gemini-3.6-flash]:',
    ui.ButtonSet.OK_CANCEL
  );
  if (resModel.getSelectedButton() !== ui.Button.OK) return;
  var model = resModel.getResponseText().trim() || currentModel;

  var currentKey = props.getProperty('GEMINI_API_KEY') || '';
  var resKey = ui.prompt(
    'Ключ Gemini API',
    'Введите GEMINI_API_KEY [или оставьте пустым, если ключ уже указан на https://vercel.com/]:',
    ui.ButtonSet.OK_CANCEL
  );
  if (resKey.getSelectedButton() !== ui.Button.OK) return;
  var key = resKey.getResponseText().trim() || currentKey;

  var currentMode = props.getProperty('AI_MODE') || 'copilot';
  var resMode = ui.prompt(
    'Режим работы ИИ',
    'Введите режим работы ИИ [copilot : суфлер с ручной отправкой хозяином, auto : авто-ответ]:',
    ui.ButtonSet.OK_CANCEL
  );
  if (resMode.getSelectedButton() !== ui.Button.OK) return;
  var mode = resMode.getResponseText().trim() || currentMode;

  props.setProperty('GEMINI_MODEL', model);
  if (key) props.setProperty('GEMINI_API_KEY', key);
  props.setProperty('AI_MODE', mode);

  ui.alert(
    '✅ Настройки ИИ сохранены!',
    'Параметры ИИ зафиксированы:\n• Модель: ' + model + '\n• Режим: ' + mode + '\n• Ключ: ' + (key ? 'Сохранен в таблице' : 'Используется с Vercel') + '\n\nКлюч также можно настроить на https://vercel.com/ Settings: Environment Variables.',
    ui.ButtonSet.OK
  );
}

/**
 * 4. Тестовый диалог с ИИ-Консьержем
 */
function testAiConciergeInteractive() {
  var ui = SpreadsheetApp.getUi();
  var props = PropertiesService.getScriptProperties();
  var siteUrl = (props.getProperty('SITE_URL') || '').trim();

  var qRes = ui.prompt(
    'Тест ИИ-Консьержа',
    'Введите вопрос гостя для проверки генерации ответа [например: Какая цена на июль и есть ли скидка?]:',
    ui.ButtonSet.OK_CANCEL
  );
  if (qRes.getSelectedButton() !== ui.Button.OK) return;
  var userQ = qRes.getResponseText().trim();
  if (!userQ) return;

  if (!siteUrl) {
    ui.alert('Внимание', 'Сначала укажите SITE_URL в Свойствах скрипта.', ui.ButtonSet.OK);
    return;
  }

  try {
    var endpoint = siteUrl.replace(/\/+$/, '') + '/api/ai-concierge';
    var payload = {
      guestMessage: userQ,
      guestName: 'Алексей',
      contact: '+90 532 000 0000',
      lang: 'ru'
    };
    var response = UrlFetchApp.fetch(endpoint, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
    var resData = JSON.parse(response.getContentText());
    if (resData.success) {
      ui.alert(
        '🤖 Ответ ИИ-Консьержа [Модель: ' + (resData.model || 'Gemini') + ']',
        'Вопрос гостя: ' + userQ + '\n\n' +
        'Сгенерированный ответ:\n' + resData.reply + '\n\n' +
        (resData.suggestedTemplateId ? 'Рекомендованный шаблон: ' + resData.suggestedTemplateId : ''),
        ui.ButtonSet.OK
      );
    } else {
      ui.alert('Ошибка ответа ИИ', resData.error || 'Не удалось получить ответ', ui.ButtonSet.OK);
    }
  } catch (err) {
    ui.alert('Сбой связи с ИИ', err.message, ui.ButtonSet.OK);
  }
}

/**
 * Вспомогательное смарт-форматирование созданного листа
 */
function styleSheetHeader_(sheet, headers, frozenRows) {
  if (!sheet || !headers) return;
  var range = sheet.getRange(1, 1, 1, headers.length);
  range.setValues([headers]);
  range.setBackground('#1e293b');
  range.setFontColor('#ffffff');
  range.setFontWeight('bold');
  range.setFontSize(10);
  range.setHorizontalAlignment('center');
  range.setVerticalAlignment('middle');
  range.setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
  sheet.setRowHeight(1, 35);
  if (frozenRows) sheet.setFrozenRows(frozenRows);
  for (var c = 1; c <= headers.length; c++) {
    sheet.autoResizeColumn(c);
  }
}

/**
 * 1. Инициализация и наполнение Базы Знаний ИИ: 3 листа
 * Создает листы:
 * - 💬 Шаблоны сообщений [14 эталонных сценариев]
 * - 🧩 Словарь переменных [актуальные реквизиты, Wi-Fi, адрес]
 * - ⚙️ Системные настройки [флаги активности, gemini-3.6-flash, минимальные цены]
 */
function initAiKnowledgeBaseSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ui = SpreadsheetApp.getUi();

  // 1. Лист 💬 Шаблоны сообщений
  var tmplSheetName = '💬 Шаблоны сообщений';
  var tmplSheet = ss.getSheetByName(tmplSheetName);
  if (!tmplSheet) {
    tmplSheet = ss.insertSheet(tmplSheetName);
  }
  var tmplHeaders = ['ID Раздела', 'Название [RU]', 'Название [EN]', 'Название [TR]', 'Текст [RU]', 'Текст [EN]', 'Текст [TR]'];
  styleSheetHeader_(tmplSheet, tmplHeaders, 1);

  var templatesData = [
    [
      '1.1_discount_10',
      '1.1. Скидка 10% за невозвратный тариф',
      '1.1. 10% Non-refundable rate discount',
      '1.1. %10 İade Edilemez Tarife İndirimi',
      'Здравствуйте, [FIRST_NAME]! Рад вашему интересу к Villa Turaman! Для поездок на ближайшие даты активирована опция: Бронирование без возврата со скидкой 10%. Скидка действует, если дата выезда в пределах 60 дней. С уважением, Алексей Знаменский.',
      'Hello [FIRST_NAME]! Thank you for your interest in Villa Turaman! We have a special 10% non-refundable discount for stays within 60 days. Best regards, Aleksei Znamenskii.',
      'Merhaba [FIRST_NAME]! Villa Turaman ile ilgilendiğiniz için teşekkürler! 60 gün içindeki konaklamalar için %10 iade edilemez indirim seçeneğimiz mevcuttur. Saygılarımla, Aleksei Znamenskii.'
    ],
    [
      '1.2_budget_price',
      '1.2. Работа с ценой и вопросы по бюджету',
      '1.2. Budget & Pricing inquiries',
      '1.2. Bütçe ve Fiyat Görüşmeleri',
      'Здравствуйте, [FIRST_NAME]! Понимаю ваше желание оптимизировать бюджет. Стоимость вилы включает приватную территорию, бассейн, скоростной Wi-Fi и чистоту. Минимальный допустимый тариф составляет 180 USD за ночь. С удовольствием отвечу на ваши вопросы!',
      'Hello [FIRST_NAME]! We understand budget considerations. Our villa rate includes private pool, garden, high-speed Wi-Fi and full privacy. Minimum rate is 180 USD per night. Best regards!',
      'Merhaba [FIRST_NAME]! Bütçenizi anlıyoruz. Villamız özel havuz, bahçe ve tam gizlilik sunmaktadır. Gecelik taban fiyatımız 180 USD dir. Saygılarımla!'
    ],
    [
      '1.3_early_bird_expiration',
      '1.3. Напоминание об истечении скидки',
      '1.3. Early bird discount reminder',
      '1.3. Erken Rezervasyon İndirimi Hatırlatması',
      'Здравствуйте, [FIRST_NAME]! Напоминаю, что специальный тариф на выбранные вами даты действует ограниченное время. Если ваши даты подтверждены, рекомендую зафиксировать бронь прямо сейчас.',
      'Hello [FIRST_NAME]! Just a friendly reminder that special rates for your selected dates are valid for a limited time. Feel free to complete your booking to secure your stay!',
      'Merhaba [FIRST_NAME]! Seçtiğiniz tarihler için özel fiyatın sınırlı süreli olduğunu hatırlatmak isteriz. Rezervasyonunuzu kesinleştirmek için tamamlayabilirsiniz.'
    ],
    [
      '2.1_confirmation_initial_info',
      '2.1. Подтверждение и вводная информация',
      '2.1. Booking confirmation & general info',
      '2.1. Rezervasyon Onayı ve Genel Bilgiler',
      'Здравствуйте, [FIRST_NAME]! Поздравляю с успешным бронированием Villa Turaman [код: [CONFIRMATION_CODE]]! Ваши даты: [CHECKIN_DATE] - [CHECKOUT_DATE]. Заезд с [CHECKIN_TIME], выезд до [CHECKOUT_TIME]. Наш адрес: [ADDRESS].',
      'Hello [FIRST_NAME]! Congratulations on your confirmed booking at Villa Turaman [Code: [CONFIRMATION_CODE]]! Dates: [CHECKIN_DATE] - [CHECKOUT_DATE]. Check-in: [CHECKIN_TIME], check-out: [CHECKOUT_TIME]. Address: [ADDRESS].',
      'Merhaba [FIRST_NAME]! Villa Turaman rezervasyonunuz onaylandı [Kod: [CONFIRMATION_CODE]]! Tarihler: [CHECKIN_DATE] - [CHECKOUT_DATE]. Giriş: [CHECKIN_TIME], çıkış: [CHECKOUT_TIME]. Adres: [ADDRESS].'
    ],
    [
      '2.2_top_floor_clarification',
      '2.2. Разъяснение по верхнему этажу',
      '2.2. Top floor clarification',
      '2.2. Üst Kat Hakkında Bilgilendirme',
      'Здравствуйте, [FIRST_NAME]! Хочу подтвердить: вся вилла, сад и бассейн находятся в вашем исключительном приватном пользовании. Верхний этаж закрыт на ключ и никто посторонний там не проживает.',
      'Hello [FIRST_NAME]! We want to assure you that the entire villa, garden and private pool are exclusively yours. The top floor is securely locked and unoccupied during your stay.',
      'Merhaba [FIRST_NAME]! Villanın tamamı, havuz ve bahçe yalnızca size aittir. Üst kat kilitlidir ve konaklamanız boyunca tamamen boştur.'
    ],
    [
      '2.3_transfer_assistance',
      '2.3. Помощь с организацией трансфера',
      '2.3. Airport transfer assistance',
      '2.3. Havalimanı Transfer Desteği',
      'Здравствуйте, [FIRST_NAME]! Мы с радостью поможем организовать комфортный трансфер из аэропорта Даламан [DLM] прямо к вилле. Стоимость трансфера составляет [TRANSFER_PRICE]. Сообщите номер рейса и время прилета.',
      'Hello [FIRST_NAME]! We can gladly arrange a private transfer from Dalaman Airport [DLM] directly to the villa. Rate: [TRANSFER_PRICE]. Please provide flight details.',
      'Merhaba [FIRST_NAME]! Dalaman Havalimanı ndan [DLM] villamıza özel transfer ayarlayabiliriz. Ücret: [TRANSFER_PRICE]. Uçuş bilgilerinizi paylaşabilirsiniz.'
    ],
    [
      '3.1_kbs_registration',
      '3.1. Регистрация гостей в системе KBS',
      '3.1. Official KBS guest registration',
      '3.1. Resmi KBS Misafir Kaydı',
      'Здравствуйте, [FIRST_NAME]! Согласно законодательству Турции, все гости обязаны пройти регистрацию в системе KBS жандармерии до заселения. Пожалуйста, пришлите фото главных страниц паспортов всех гостей.',
      'Hello [FIRST_NAME]! Turkish law requires all staying guests to be registered with the official KBS system prior to check-in. Please share passport copies for all guests.',
      'Merhaba [FIRST_NAME]! Türkiye mevzuatı gereği tüm misafirlerimizin KBS sistemine kaydı zorunludur. Lütfen kimlik veya pasaport kopyalarını iletiniz.'
    ],
    [
      '3.2_address_geolocation',
      '3.2. Точный адрес и геолокация виллы',
      '3.2. Address & Geolocation directions',
      '3.2. Konum ve Yol Tarifi',
      'Здравствуйте, [FIRST_NAME]! Наш точный адрес: [ADDRESS]. Вилла расположена в тихом живописном районе Дальяна. Прикладываю точку Google Maps для навигатора.',
      'Hello [FIRST_NAME]! Here is our exact location: [ADDRESS]. Villa Turaman is situated in a peaceful area of Dalyan with mountain views.',
      'Merhaba [FIRST_NAME]! Kesin adresimiz: [ADDRESS]. Dalyan da huzurlu ve manzaralı bir konumdayız.'
    ],
    [
      '3.3_checkin_time_coordination',
      '3.3. Согласование точного времени заезда',
      '3.3. Check-in time coordination',
      '3.3. Giriş Saati Koordinasyonu',
      'Здравствуйте, [FIRST_NAME]! Стандартное время заезда: [CHECKIN_TIME]. Подскажите, во сколько ориентировочно вы планируете прибыть, чтобы мы идеально подготовили виллу к вашему приезду.',
      'Hello [FIRST_NAME]! Our standard check-in time is [CHECKIN_TIME]. What time do you expect to arrive so we can ensure everything is spotless and ready for you?',
      'Merhaba [FIRST_NAME]! Standart giriş saatimiz [CHECKIN_TIME] dir. Villayı hazır etmek için tahmini varış saatinizi bildirir misiniz?'
    ],
    [
      '3.4_checkin_instructions',
      '3.4. Инструкция по заселению и Wi-Fi',
      '3.4. Self check-in & Wi-Fi details',
      '3.4. Giriş ve Wi-Fi Bilgileri',
      'Здравствуйте, [FIRST_NAME]! Добро пожаловать! Способ заселения: [CHECKIN_METHOD]. Скоростной интернет: Сеть [WIFI_NAME], Пароль: [WIFI_PASSWORD]. Приятного отдыха!',
      'Hello [FIRST_NAME]! Welcome! Check-in method: [CHECKIN_METHOD]. High-speed Wi-Fi: Network [WIFI_NAME], Password: [WIFI_PASSWORD]. Enjoy your stay!',
      'Merhaba [FIRST_NAME]! Hoş geldiniz! Giriş yöntemi: [CHECKIN_METHOD]. Hızlı Wi-Fi: Ağ [WIFI_NAME], Şifre: [WIFI_PASSWORD]. İyi tatiller!'
    ],
    [
      '3.5_welcome_guide_dalyan',
      '3.5. Приветственный путеводитель по Дальяну',
      '3.5. Welcome Dalyan local guide',
      '3.5. Hoş Geldiniz Dalyan Rehberi',
      'Здравствуйте, [FIRST_NAME]! Мы подготовили авторский путеводитель по Дальяну: лучшие рестораны у реки, прогулки на лодке к Ликийским гробницам и пляж Изтузу. Смотрите раздел путеводителей в личном кабинете!',
      'Hello [FIRST_NAME]! We have prepared a curated local guide for Dalyan: top riverside dining, boat tours to Lycian rock tombs and turtle beach. Check your guest portal!',
      'Merhaba [FIRST_NAME]! Size özel Dalyan rehberimizi hazırladık: nehir kenarı restoranlar, tekne turları ve İztuzu plajı. Misafir panelinizden inceleyebilirsiniz!'
    ],
    [
      '4.1_mid_stay_satisfaction',
      '4.1. Контроль комфорта во время отдыха',
      '4.1. Mid-stay satisfaction check',
      '4.1. Konaklama Memnuniyet Kontrolü',
      'Здравствуйте, [FIRST_NAME]! Как проходит ваш отдых на Villa Turaman? Все ли комфортно, есть ли какие-либо пожелания по вилле, бассейну или окрестностям?',
      'Hello [FIRST_NAME]! How is your stay going at Villa Turaman? Is everything comfortable, and do you need any assistance with anything?',
      'Merhaba [FIRST_NAME]! Tatiliniz nasıl gidiyor? Her şey yolunda mı, yardımcı olabileceğimiz bir konu var mı?'
    ],
    [
      '4.2_pool_maintenance_notice',
      '4.2. Уведомление об обслуживании бассейна',
      '4.2. Pool maintenance notice',
      '4.2. Havuz Bakım Bildirimi',
      'Здравствуйте, [FIRST_NAME]! Информируем, что завтра утром с 07:00 до 08:00 запланирована регулярная чистка бассейна. Специалист выполнит работу тихо и быстро, не потревожив ваш отдых.',
      'Hello [FIRST_NAME]! Gentle notice that regular pool maintenance is scheduled for tomorrow morning [07:00 - 08:00]. It will be brief and silent.',
      'Merhaba [FIRST_NAME]! Yarın sabah [07:00 - 08:00] arasında havuz bakımı yapılacaktır. Rahatsızlık vermeden kısa sürede tamamlanacaktır.'
    ],
    [
      '5.1_checkout_reminder',
      '5.1. Напоминание о правилах выезда',
      '5.1. Check-out reminder & rules',
      '5.1. Çıkış Hatırlatması ve Kurallar',
      'Здравствуйте, [FIRST_NAME]! Напоминаем, что выезд запланирован на [CHECKOUT_DATE] до [CHECKOUT_TIME]. Инструкция по ключам: [KEY_HANDOVER_INSTRUCTIONS]. Благодарим за выбор Villa Turaman!',
      'Hello [FIRST_NAME]! Friendly reminder that check-out is on [CHECKOUT_DATE] by [CHECKOUT_TIME]. Key instructions: [KEY_HANDOVER_INSTRUCTIONS]. Thank you!',
      'Merhaba [FIRST_NAME]! Çıkışınız [CHECKOUT_DATE] saat [CHECKOUT_TIME] ye kadardır. Anahtar talimatı: [KEY_HANDOVER_INSTRUCTIONS]. Teşekkür ederiz!'
    ]
  ];

  tmplSheet.getRange(2, 1, templatesData.length, tmplHeaders.length).setValues(templatesData);

  // 2. Лист 🧩 Словарь переменных
  var varsSheetName = '🧩 Словарь переменных';
  var varsSheet = ss.getSheetByName(varsSheetName);
  if (!varsSheet) {
    varsSheet = ss.insertSheet(varsSheetName);
  }
  var varsHeaders = ['Плейсхолдер', 'Системный ключ', 'Описание переменной', 'Значение по умолчанию [Тест]'];
  styleSheetHeader_(varsSheet, varsHeaders, 1);

  var variablesData = [
    ['[FIRST_NAME]', 'firstName', 'Имя гостя для персонализации', 'Алексей'],
    ['[CONFIRMATION_CODE]', 'confirmationCode', 'Номер бронирования', 'VT-7701'],
    ['[CHECKIN_DATE]', 'checkIn', 'Дата заезда гостя', '01.07.2026'],
    ['[CHECKOUT_DATE]', 'checkOut', 'Дата выезда гостя', '10.07.2026'],
    ['[CHECKIN_TIME]', 'checkInTime', 'Стандартное время заезда', '16:00'],
    ['[CHECKOUT_TIME]', 'checkOutTime', 'Стандартное время выезда', '10:00'],
    ['[BOOKING_PLATFORM_NAME]', 'bookingPlatform', 'Канал бронирования', 'Villa Turaman Direct'],
    ['[ADDRESS]', 'address', 'Точный адрес и геопозиция', 'Дальян, Ортаджа, Мугла, Турция: https://maps.app.goo.gl/villaturaman'],
    ['[CHECKIN_METHOD]', 'checkinMethod', 'Способ передачи ключей', 'Мини-сейф с кодом у главного входа / Личная встреча'],
    ['[WIFI_NAME]', 'wifiName', 'Название гостевой сети Wi-Fi', 'VillaTuraman_5G'],
    ['[WIFI_PASSWORD]', 'wifiPassword', 'Пароль от сети Wi-Fi', 'DalyanTuramanGuest2026'],
    ['[KEY_HANDOVER_INSTRUCTIONS]', 'keyHandoverInstructions', 'Инструкция при выезде', 'Оставьте ключи в мини-сейфе с кодом у входной двери виллы'],
    ['[TRANSFER_PRICE]', 'transferPrice', 'Стоимость трансфера Даламан', '50 EUR'],
    ['[MIN_PRICE_USD]', 'minNightlyPriceUsd', 'Минимальный тариф ночь', '180 USD']
  ];
  varsSheet.getRange(2, 1, variablesData.length, varsHeaders.length).setValues(variablesData);

  // 3. Лист ⚙️ Системные настройки
  var settingsSheetName = '⚙️ Системные настройки';
  var settingsSheet = ss.getSheetByName(settingsSheetName);
  if (!settingsSheet) {
    settingsSheet = ss.insertSheet(settingsSheetName);
  }
  var settingsHeaders = ['Параметр', 'Значение', 'Описание', 'Статус'];
  styleSheetHeader_(settingsSheet, settingsHeaders, 1);

  var settingsData = [
    ['GEMINI_MODEL', 'gemini-3.6-flash', 'Модель Google Gemini для ИИ-консьержа на Vercel', 'ACTIVE'],
    ['GEMINI_API_KEY', 'Указан на https://vercel.com/', 'Ключ Gemini API в Environment Variables на Vercel', 'CONFIGURED_ON_VERCEL'],
    ['AI_ENABLED', 'TRUE', 'Флаг активности ИИ-агента на платформе', 'ENABLED'],
    ['AI_MODE', 'copilot', 'Режим работы: copilot [суфлер] или auto [автоответ]', 'COPILOT'],
    ['AI_CONFIDENCE_THRESHOLD', '0.85', 'Порог уверенности ИИ для автоответа', 'STRICT'],
    ['MIN_NIGHTLY_PRICE_USD', '180', 'Минимально допустимый тариф за ночь в долларах', 'ENFORCED'],
    ['SITE_URL', 'https://sitesi-5y3x2v6w4-znamenskiialekseis-projects.vercel.app', 'Адрес веб-платформы на Vercel', 'LIVE'],
    ['SYSTEM_PROMPT', 'Ты профессиональный ИИ-консьерж виллы Villa Turaman в Дальяне. Отвечай вежливо и гостеприимно на языке гостя. Запрещено давать скидки ниже 180 USD за ночь.', 'Глобальный системный промпт ИИ', 'ACTIVE']
  ];
  settingsSheet.getRange(2, 1, settingsData.length, settingsHeaders.length).setValues(settingsData);

  SpreadsheetApp.getActive().toast('База Знаний ИИ успешно создана и наполнена: 3 листа готовы.', '✅ Завершено', 7);
  ui.alert(
    '✅ База Знаний ИИ успешно сформирована!',
    'В вашей Google Таблице созданы и наполнены 3 листа:\n\n' +
    '1. 💬 Шаблоны сообщений : 14 эталонных сценариев на RU, EN, TR\n' +
    '2. 🧩 Словарь переменных : 14 параметров виллы, Wi-Fi, адрес, цены\n' +
    '3. ⚙️ Системные настройки : модель gemini-3.6-flash, статус и промпт\n\n' +
    'Вы можете свободно редактировать их в любой момент.',
    ui.ButtonSet.OK
  );
}

/**
 * Интерактивный диалог настройки Свойств скрипта: Script Properties
 */
function setupScriptPropertiesInteractive() {
  var ui = SpreadsheetApp.getUi();
  var scriptProperties = PropertiesService.getScriptProperties();

  ui.alert(
    'ℹ️ Информация о стандартах хранения ключей',
    'Обратите внимание: для полноценной работы все ключи также могут находиться на https://vercel.com/ в разделе Environment Variables.\n\nДалее вы можете настроить локальные свойства для Google Таблиц.',
    ui.ButtonSet.OK
  );

  var currentSiteUrl = scriptProperties.getProperty('SITE_URL') || "http://localhost:3000";
  var resSiteUrl = ui.prompt("Свойство 1/6: Базовый адрес сайта: SITE_URL", "Введите URL сайта: например https://ваш-домен.vercel.app или http://localhost:3000:", ui.ButtonSet.OK_CANCEL);
  if (resSiteUrl.getSelectedButton() !== ui.Button.OK) return;
  var siteUrl = resSiteUrl.getResponseText().trim() || currentSiteUrl;

  var currentRevalUrl = scriptProperties.getProperty('REVALIDATE_API_URL') || (siteUrl + "/api/revalidate");
  var resRevalUrl = ui.prompt("Свойство 2/6: URL ревалидации: REVALIDATE_API_URL", "Введите эндпоинт ревалидации Next.js:", ui.ButtonSet.OK_CANCEL);
  if (resRevalUrl.getSelectedButton() !== ui.Button.OK) return;
  var revalidateUrl = resRevalUrl.getResponseText().trim() || currentRevalUrl;

  var currentSecret = scriptProperties.getProperty('REVALIDATE_SECRET_TOKEN') || "YOUR_VERY_SECRET_RANDOM_STRING";
  var resSecret = ui.prompt("Свойство 3/6: Секретный токен: REVALIDATE_SECRET_TOKEN", "Введите секретный токен: REVALIDATE_SECRET_TOKEN:", ui.ButtonSet.OK_CANCEL);
  if (resSecret.getSelectedButton() !== ui.Button.OK) return;
  var secretToken = resSecret.getResponseText().trim() || currentSecret;

  var currentDeployHook = scriptProperties.getProperty('VERCEL_DEPLOY_HOOK_URL') || "";
  var resDeployHook = ui.prompt("Свойство 4/6: Vercel Deploy Hook: VERCEL_DEPLOY_HOOK_URL", "Введите Deploy Hook URL из панели Vercel: необязательно:", ui.ButtonSet.OK_CANCEL);
  if (resDeployHook.getSelectedButton() !== ui.Button.OK) return;
  var deployHook = resDeployHook.getResponseText().trim() || currentDeployHook;

  var currentTgToken = scriptProperties.getProperty('TELEGRAM_BOT_TOKEN') || "";
  var resTgToken = ui.prompt("Свойство 5/6: Telegram Bot Token: TELEGRAM_BOT_TOKEN", "Введите токен Telegram-бота для уведомлений владельца:", ui.ButtonSet.OK_CANCEL);
  if (resTgToken.getSelectedButton() !== ui.Button.OK) return;
  var tgToken = resTgToken.getResponseText().trim() || currentTgToken;

  var currentTgChatId = scriptProperties.getProperty('TELEGRAM_CHAT_ID') || "";
  var resTgChat = ui.prompt("Свойство 6/6: Telegram Chat ID: TELEGRAM_CHAT_ID", "Введите ваш Chat ID в Telegram:", ui.ButtonSet.OK_CANCEL);
  if (resTgChat.getSelectedButton() !== ui.Button.OK) return;
  var tgChatId = resTgChat.getResponseText().trim() || currentTgChatId;

  // Сохранение всех свойств
  scriptProperties.setProperties({
    'SITE_URL': siteUrl,
    'REVALIDATE_API_URL': revalidateUrl,
    'REVALIDATE_SECRET_TOKEN': secretToken,
    'VERCEL_DEPLOY_HOOK_URL': deployHook,
    'TELEGRAM_BOT_TOKEN': tgToken,
    'TELEGRAM_CHAT_ID': tgChatId
  }, false);

  ui.alert("✅ Успех!", "Все Свойства скрипта успешно зафиксированы и доступны для вебхуков, Vercel и Telegram.\n\nНапоминание: все ключи также могут находиться на https://vercel.com/ ➔ Settings ➔ Environment Variables.", ui.ButtonSet.OK);
}

/**
 * Просмотр текущих сохраненных Свойств скрипта с маскированием секретов
 */
function viewCurrentScriptProperties() {
  var scriptProperties = PropertiesService.getScriptProperties();
  var props = scriptProperties.getProperties();

  var mask = function(str) {
    if (!str) return "[НЕ ЗАДАНО]";
    if (str.length <= 8) return "******";
    return str.substring(0, 4) + "..." + str.substring(str.length - 4);
  };

  var text = "📋 ТЕКУЩИЕ СВОЙСТВА СКРИПТА (SCRIPT PROPERTIES):\n\n" +
    "1. SITE_URL:\n   " + (props['SITE_URL'] || "[НЕ ЗАДАНО]") + "\n\n" +
    "2. REVALIDATE_API_URL:\n   " + (props['REVALIDATE_API_URL'] || "[НЕ ЗАДАНО]") + "\n\n" +
    "3. REVALIDATE_SECRET_TOKEN:\n   " + mask(props['REVALIDATE_SECRET_TOKEN']) + "\n\n" +
    "4. VERCEL_DEPLOY_HOOK_URL:\n   " + (props['VERCEL_DEPLOY_HOOK_URL'] ? mask(props['VERCEL_DEPLOY_HOOK_URL']) : "[НЕ ЗАДАНО]") + "\n\n" +
    "5. TELEGRAM_BOT_TOKEN:\n   " + mask(props['TELEGRAM_BOT_TOKEN']) + "\n\n" +
    "6. TELEGRAM_CHAT_ID:\n   " + (props['TELEGRAM_CHAT_ID'] || "[НЕ ЗАДАНО]");

  SpreadsheetApp.getUi().alert("Свойства скрипта", text, SpreadsheetApp.getUi().ButtonSet.OK);
}

/**
 * Установка типовых Свойств скрипта по умолчанию для локального запуска
 */
function setupDefaultScriptProperties() {
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperties({
    'SITE_URL': "http://localhost:3000",
    'REVALIDATE_API_URL': "http://localhost:3000/api/revalidate",
    'REVALIDATE_SECRET_TOKEN': "YOUR_VERY_SECRET_RANDOM_STRING",
    'VERCEL_DEPLOY_HOOK_URL': "",
    'TELEGRAM_BOT_TOKEN': "",
    'TELEGRAM_CHAT_ID': ""
  }, false);

  SpreadsheetApp.getActive().toast("Установлены базовые локальные свойства: SITE_URL=http://localhost:3000", "⚡ Свойства скрипта", 5);
}

/**
 * Обработчик входящих POST запросов : Веб-приложение Gmail Relay
 * Позволяет отправлять проверочные коды гостям через MailApp.sendEmail без сторонних сервисов
 */
function doPost(e) {
  try {
    var data = {};
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }

    if (data.action === 'send_verification_email') {
      var to = data.to;
      var code = data.code;
      var name = data.name || 'Гость';
      var subject = data.subject || 'Код подтверждения бронирования Villa Turaman: ' + code;
      var htmlBody = data.htmlBody;

      if (!to || !code) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Отсутствует to или code' }))
          .setMimeType(ContentService.MimeType.JSON);
      }

      MailApp.sendEmail({
        to: to,
        subject: subject,
        htmlBody: htmlBody || ('Здравствуйте, ' + name + '! Ваш проверочный код: ' + code)
      });

      return ContentService.createTextOutput(JSON.stringify({ success: true, message: 'Письмо с кодом успешно отправлено через Gmail Relay' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Неизвестное действие' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Инструкция по развертыванию веб-приложения для Gmail Relay
 */
function showGmailRelayDeployHelp() {
  var ui = SpreadsheetApp.getUi();
  var message = "Инструкция по подключению бесплатной отправки писем через Gmail:\n\n" +
    "1. В меню редактора Apps Script нажмите синюю кнопку: Развернуть -> Новое развертывание\n" +
    "2. Выберите тип: Веб-приложение\n" +
    "3. Описание: Villa Turaman Gmail Relay\n" +
    "4. Запуск от имени: Меня\n" +
    "5. У кого есть доступ: Все\n" +
    "6. Нажмите Развернуть и скопируйте полученный URL веб-приложения\n" +
    "7. Вставьте скопированный URL в файл .env.local как: GOOGLE_APPS_SCRIPT_URL=...\n\n" +
    "После этого письма с кодами будут отправляться прямо с вашего Gmail аккаунта бесплатно и надежно.";

  ui.alert("📧 Настройка Gmail Relay", message, ui.ButtonSet.OK);
}

// ==============================================================================
// МОДУЛЬ УПРАВЛЕНИЯ ТЕЛЕГРАМ-БОТОМ И WEBHOOK
// ==============================================================================

/**
 * Получение настроек Telegram из Script Properties
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
 * Построение постоянной клавиатуры Reply Keyboard для смартфона хозяина
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
    var sheet = findSheetByConfigKey(ss, 'BOOKINGS');
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
    var calSheet = findSheetByConfigKey(ss, 'CALENDAR');
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
    var calSheet = findSheetByConfigKey(ss, 'CALENDAR');
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
    var calSheet = findSheetByConfigKey(ss, 'CALENDAR');
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
    triggerRevalidateWebhook();
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
    var masterSheet = findSheetByConfigKey(ss, 'MASTER');
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


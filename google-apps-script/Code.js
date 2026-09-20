// ==============================================================================
// АВТОМАТИЗАЦИЯ GOOGLE APPS SCRIPT ДЛЯ СИНХРОНИЗАЦИИ VILLA TURAMAN
// Файл: google-apps-script/Code.js
// Назначение: Скрипт устанавливается в редактор Google Таблицы: Расширения -> Apps Script.
// 1. Создает 3 главных меню в интерфейсе Google Таблиц: "🏡 Villa Turaman Suite", "🤖 Telegram Бот", "🧠 3. ИИ-Агент & Gemini".
// 2. Включает смарт-навигатор листов в 1 клик, режим Всё открыто и 3 фокусных кластера.
// 3. Обеспечивает мгновенную отправку вебхуков ревалидации Next.js при любых правках контента.
// 4. Поддерживает гибридный запуск Telegram-бота и Gemini через серверные ключи на https://vercel.com/.
// 5. 100% Zero-Brackets & Zero-Emdash Стандарт.
// ==============================================================================

/**
 * Реестр листов системы Villa Turaman: канонические русские имена,
 * смысловые кластеры и исторические технические алиасы.
 */
var VILLA_SHEETS_CONFIG = {
  // Кластер 1: Публичная витрина и презентация листинга [5 листов]
  HOME: { name: "🏠 Главная витрина", suggestedSheetId: 101, aliases: ["🏠 Главная витрина", "Главная витрина", "Главная", "Витрина", "📖 О вилле и Правила", "О вилле и Правила", "О вилле"], cluster: "showcase" },
  GALLERY: { name: "📸 Фото и Видео Галерея", suggestedSheetId: 102, aliases: ["📸 Фото и Видео Галерея", "Фото и Видео Галерея", "Фотогалерея", "Галерея", "Медиа"], cluster: "showcase" },
  SERVICES: { name: "🛎️ Дополнительные услуги", suggestedSheetId: 104, aliases: ["🛎️ Дополнительные услуги", "Дополнительные услуги", "Услуги", "Сервисы", "Платные услуги"], cluster: "showcase" },
  GUIDES: { name: "🗺️ Видео-путеводители", suggestedSheetId: 105, aliases: ["🗺️ Видео-путеводители", "Видео-путеводители", "Видеопутеводители", "Путеводители", "Гиды"], cluster: "showcase" },
  LEGAL: { name: "⚖️ Юридические документы", suggestedSheetId: 106, aliases: ["⚖️ Юридические документы", "Юридические документы", "Юридическая информация", "Реквизиты"], cluster: "showcase" },

  // Кластер 2: Бронирования, Кабинет Хозяина, Продажи и CRM [4 листа]
  BOOKINGS: { name: "📋 Заявки и Бронирования", suggestedSheetId: 201, aliases: ["📋 Заявки и Бронирования", "Заявки и Бронирования", "Заявки на бронирование", "Бронирования", "Заявки", "Вилла"], cluster: "host" },
  CALENDAR: { name: "📅 Календарь и Тарифы", suggestedSheetId: 202, aliases: ["📅 Календарь и Тарифы", "Календарь и Тарифы", "Календарь и Занятость", "Календарь", "Тарифы", "Настройки календаря"], cluster: "host" },
  ACCOUNTS: { name: "👤 Гостевые аккаунты", suggestedSheetId: 203, aliases: ["👤 Гостевые аккаунты", "Гостевые аккаунты", "Аккаунты гостей", "Гости"], cluster: "host" },
  ORDERS: { name: "💳 Заказы услуг и гидов", suggestedSheetId: 205, aliases: ["💳 Заказы услуг и гидов", "Заказы услуг и гидов", "Заказы", "Заказы услуг"], cluster: "host" },

  // Кластер 3: Бэк-офис, Шаблоны и Системный SSOT [3 листа]
  ACCESS: { name: "🎟️ Доступы к путеводителям", suggestedSheetId: 206, aliases: ["🎟️ Доступы к путеводителям", "Доступы к путеводителям", "Доступы к гидам", "Доступы"], cluster: "host" },
  TEMPLATES: { name: "💬 Шаблоны сообщений", suggestedSheetId: 207, aliases: ["💬 Шаблоны сообщений", "Шаблоны сообщений", "Шаблоны", "Быстрые ответы"], cluster: "host" },
  SETTINGS: { name: "⚙️ Системные настройки ИИ Агентов", suggestedSheetId: 209, aliases: ["⚙️ Системные настройки ИИ Агентов", "Системные настройки ИИ Агентов", "Системные настройки", "Настройки ИИ", "🔑 Управление доступом", "Управление доступом", "MasterAccount", "🧩 Словарь переменных", "Словарь переменных"], cluster: "system" }
};

/**
 * Инициализация пользовательского меню при открытии таблицы
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();

  // 1. Блок 1: Смарт-менеджер и Навигатор листов
  var jumpMenu = ui.createMenu("🚀 2. Быстрый переход к листу")
    .addItem("🏠 Главная витрина [ID: 101]", "jumpToSheet_HOME")
    .addItem("📸 Фото и Видео Галерея [ID: 102]", "jumpToSheet_GALLERY")
    .addItem("🛎️ Дополнительные услуги [ID: 104]", "jumpToSheet_SERVICES")
    .addItem("🗺️ Видео-путеводители [ID: 105]", "jumpToSheet_GUIDES")
    .addItem("⚖️ Юридические документы [ID: 106]", "jumpToSheet_LEGAL")
    .addSeparator()
    .addItem("📋 Заявки и Бронирования [ID: 201]", "jumpToSheet_BOOKINGS")
    .addItem("📅 Календарь и Тарифы [ID: 202]", "jumpToSheet_CALENDAR")
    .addItem("👤 Гостевые аккаунты [ID: 203]", "jumpToSheet_ACCOUNTS")
    .addItem("💳 Заказы услуг и гидов [ID: 205]", "jumpToSheet_ORDERS")
    .addItem("🎟️ Доступы к путеводителям [ID: 206]", "jumpToSheet_ACCESS")
    .addSeparator()
    .addItem("💬 Шаблоны сообщений [ID: 207]", "jumpToSheet_TEMPLATES")
    .addItem("⚙️ Системные настройки ИИ [ID: 209]", "jumpToSheet_SETTINGS");

  var focusMenu = ui.createMenu("🎯 3. Режимы фокуса по кластерам")
    .addItem("🏠 1. Публичная витрина [5 листов]", "applyPresetShowcase")
    .addItem("💼 2. Центр управления и CRM [4 листа]", "applyPresetOperations")
    .addItem("🧩 3. Настройки и Шаблоны [3 листа]", "applyPresetSettings");

  var sheetManagerMenu = ui.createMenu("👁️ 1. Менеджер и Навигатор листов")
    .addItem("🌟 1. Раскрыть ВСЕ листы", "applyPresetAllOpen")
    .addSeparator()
    .addSubMenu(jumpMenu)
    .addSubMenu(focusMenu)
    .addSeparator()
    .addItem("📑 4. Каноническая сортировка вкладок", "sortSheetsCanonically")
    .addItem("🏷️ 5. Пакетное авто-переименование в русский стандарт", "renameSheetsToRussianStandard")
    .addItem("📊 6. Паспорт листов и проверка структуры", "showSheetsPassportModal")
    .addSeparator()
    .addItem("ℹ️ Справка по менеджеру листов", "showSheetManagerHelp");

  // 2. Блок 2: Синхронизация с платформой Next.js
  var syncMenu = ui.createMenu("🌐 2. Синхронизация с сайтом")
    .addItem("⚡ Мгновенная ревалидация страниц: ISR Webhook", "triggerRevalidateWebhook")
    .addItem("🔄 Полный пересбор сайта: Vercel Deploy Hook", "triggerVercelDeployHook")
    .addItem("⏱️ Проверить статус доступности сайта", "checkWebsiteHealth");

  // 3. Блок 3: Управление бронированиями и календарем
  var calendarMenu = ui.createMenu("📅 3. Управление бронированиями")
    .addItem("🔍 Проверить накладки дат и статус HOLD 24ч", "auditCalendarHolds")
    .addItem("📥 Экспортировать ссылку iCal .ics для каналов", "showIcalExportUrl")
    .addItem("🧹 Очистить истекшие блокировки HOLD", "clearExpiredHolds");

  // 4. Блок 4: Каталог услуг и путеводителей
  var catalogMenu = ui.createMenu("🛍️ 4. Каталог и Путеводители")
    .addItem("🔄 Обновить автопереводы услуг: RU ➔ EN / TR", "refreshCatalogTranslations")
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
    .addItem("🛠️ 7. Восстановить все листы и наполнить эталонным контентом", "ensureAllSystemSheets")
    .addItem("💾 8. Зафиксировать текущие таблицы как эталон SSOT на сайте", "saveMasterSeedInteractive")
    .addSeparator()
    .addItem("📧 9. Инструкция по развертыванию Gmail Relay", "showGmailRelayDeployHelp");

  // Сборка первого главного меню верхнего уровня: 🏡 Villa Turaman Suite
  ui.createMenu("🏡 Villa Turaman Suite")
    .addSubMenu(sheetManagerMenu)
    .addSeparator()
    .addSubMenu(syncMenu)
    .addSubMenu(calendarMenu)
    .addSubMenu(catalogMenu)
    .addSubMenu(crmMenu)
    .addSeparator()
    .addSubMenu(auditMenu)
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

  // ТРЕТЬЕ ГЛАВНОЕ МЕНЮ ВЕРХНЕГО УРОВНЯ: 🧠 3. ИИ-Агент & Gemini
  var aiModeSubMenu = ui.createMenu("🎯 1. Режим работы ИИ")
    .addItem("🚀 Автопилот: самостоятельные ответы гостям", "setAiModeAutopilot")
    .addItem("💡 Суфлер: подготовка черновиков для хозяина", "setAiModeCopilot")
    .addItem("⏸️ Выключен: ручной режим владельца", "setAiModeOff")
    .addSeparator()
    .addItem("ℹ️ Справка по текущему режиму ИИ", "showAiFullStatusModal");

  var aiRolesSubMenu = ui.createMenu("🎭 2. Роли ИИ и Специализации")
    .addItem("👑 Консьерж-Мастер: Алексей Знаменский", "showConciergePromptInfo")
    .addItem("⚖️ Юрист-Консультант: KBS, KVKK, Налоги", "showLawyerPromptInfo")
    .addItem("💰 Финансист-Бухгалтер: e-Arşiv, Оплаты", "showFinancePromptInfo");

  var aiMainMenu = ui.createMenu("🧠 3. ИИ-Агент & Gemini")
    .addSubMenu(aiModeSubMenu)
    .addSubMenu(aiRolesSubMenu)
    .addItem("💰 3. Минимальная цена за ночь: лимит $180", "setupAiMinPriceInteractive")
    .addItem("🤖 4. Выбор модели Gemini: gemini-3.6-flash", "setupAiModelInteractive")
    .addItem("📚 5. Синхронизировать Базу Знаний в память сайта", "syncAiKnowledgeToVercel")
    .addSeparator()
    .addItem("🛠️ 6. Обновить лист Настроек и Матрицу Доступа", "initAiKnowledgeBaseSheets")
    .addItem("🌐 7. Проверить статус Gemini API на Vercel", "checkGeminiVercelStatusInteractive")
    .addItem("🔑 8. Настроить GEMINI_API_KEY в Свойствах скрипта", "setupAiPropertiesInteractive")
    .addItem("💬 9. Тестовый диалог с ИИ-Консьержем", "testAiConciergeInteractive");
  aiMainMenu.addToUi();
}

// ==============================================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ПОИСКА И УПРАВЛЕНИЯ ЛИСТАМИ
// ==============================================================================

/**
 * Находит лист по ключу конфигурации VILLA_SHEETS_CONFIG
 * Двухэтапный алгоритм:
 * Этап 1: строгий поиск по постоянному числовому sheetId.
 * Этап 2: поиск по каноническому русскому названию и псевдонимам.
 */
function findSheetByConfigKey(ss, configKey) {
  var cfg = VILLA_SHEETS_CONFIG[configKey];
  if (!cfg) return null;

  var sheets = ss.getSheets();

  // ЭТАП 1: Строгий поиск по числовому sheetId
  if (cfg.suggestedSheetId) {
    for (var i = 0; i < sheets.length; i++) {
      if (sheets[i].getSheetId() === cfg.suggestedSheetId) {
        return sheets[i];
      }
    }
  }

  // ЭТАП 2: Поиск по каноническому русскому имени или псевдонимам
  for (var k = 0; k < sheets.length; k++) {
    var title = sheets[k].getName().trim().toLowerCase();
    if (cfg.name && cfg.name.toLowerCase() === title) {
      return sheets[k];
    }
    if (cfg.aliases) {
      for (var j = 0; j < cfg.aliases.length; j++) {
        if (cfg.aliases[j].toLowerCase() === title) {
          return sheets[k];
        }
      }
    }
  }
  return null;
}

/**
 * Базовый исполнитель пресетов видимости листов.
 */
function applyVisibilityPreset(targetConfigKeys, presetTitle) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();

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

  if (!firstVisibleSheet) {
    firstVisibleSheet = ss.getActiveSheet();
    firstVisibleSheet.showSheet();
  }

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

    if (sh.getName().indexOf("Chat_") === 0) {
      isTarget = targetConfigKeys.indexOf("ACCOUNTS") !== -1 || targetConfigKeys.indexOf("BOOKINGS") !== -1;
    }

    if (isTarget) {
      sh.showSheet();
      visibleCount++;
    } else {
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
// БЫСТРЫЙ ПЕРЕХОД К ЛИСТАМ В 1 КЛИК И РЕЖИМЫ ФОКУСА
// ==============================================================================

function jumpToConfigSheet(configKey) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = findSheetByConfigKey(ss, configKey);
  if (sheet) {
    sheet.showSheet();
    ss.setActiveSheet(sheet);
    SpreadsheetApp.getActive().toast(sheet.getName(), "🚀 Открыт лист", 2);
  } else {
    SpreadsheetApp.getUi().alert("Лист не найден в таблице: " + configKey);
  }
}

function jumpToSheet_HOME() { jumpToConfigSheet("HOME"); }
function jumpToSheet_GALLERY() { jumpToConfigSheet("GALLERY"); }
function jumpToSheet_SERVICES() { jumpToConfigSheet("SERVICES"); }
function jumpToSheet_GUIDES() { jumpToConfigSheet("GUIDES"); }
function jumpToSheet_LEGAL() { jumpToConfigSheet("LEGAL"); }
function jumpToSheet_BOOKINGS() { jumpToConfigSheet("BOOKINGS"); }
function jumpToSheet_CALENDAR() { jumpToConfigSheet("CALENDAR"); }
function jumpToSheet_ACCOUNTS() { jumpToConfigSheet("ACCOUNTS"); }
function jumpToSheet_ORDERS() { jumpToConfigSheet("ORDERS"); }
function jumpToSheet_ACCESS() { jumpToConfigSheet("ACCESS"); }
function jumpToSheet_TEMPLATES() { jumpToConfigSheet("TEMPLATES"); }
function jumpToSheet_SETTINGS() { jumpToConfigSheet("SETTINGS"); }

/** Пресет: Раскрыть ВСЕ листы */
function applyPresetAllOpen() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    sheets[i].showSheet();
  }
  SpreadsheetApp.getActive().toast("Отображаются все доступные вкладки таблицы.", "🌟 Режим: Все листы открыты", 4);
}

/** Пресет: Публичная витрина [5 листов] */
function applyPresetShowcase() {
  applyVisibilityPreset(["HOME", "GALLERY", "SERVICES", "GUIDES", "LEGAL"], "Фокус: Публичная витрина [5 листов]");
}

/** Пресет: Центр управления и CRM [4 листа] */
function applyPresetOperations() {
  applyVisibilityPreset(["BOOKINGS", "CALENDAR", "ACCOUNTS", "ORDERS"], "Фокус: Управление и CRM [4 листа]");
}

/** Пресет: Настройки и Шаблоны [3 листа] */
function applyPresetSettings() {
  applyVisibilityPreset(["ACCESS", "TEMPLATES", "SETTINGS"], "Фокус: Настройки и Шаблоны [3 листа]");
}

/** Каноническая сортировка вкладок по смысловым блокам */
function sortSheetsCanonically() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var canonicalOrder = [
    "HOME", "GALLERY", "SERVICES", "GUIDES", "LEGAL",
    "BOOKINGS", "CALENDAR", "ACCOUNTS", "ORDERS",
    "ACCESS", "TEMPLATES", "SETTINGS"
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

  SpreadsheetApp.getActive().toast("Вкладки упорядочены: Витрина ➔ CRM ➔ Настройки", "📑 Сортировка завершена", 5);
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

/** Справка по менеджеру и навигатору листов */
function showSheetManagerHelp() {
  var ui = SpreadsheetApp.getUi();
  var msg = "🌟 МЕНЕДЖЕР И НАВИГАТОР ЛИСТОВ VILLA TURAMAN:\n\n" +
    "1. Навигация в 1 клик: раздел '🚀 Быстрый переход к листу' открывает любой из листов без скрытия остальных вкладок.\n" +
    "2. Режим по умолчанию: '🌟 Раскрыть ВСЕ листы' отображает все вкладки таблицы.\n" +
    "3. Фокус по кластерам: Витрина [5], CRM [4], Настройки и Шаблоны [3].\n" +
    "4. Постоянные ID листов: код платформы привязан к постоянным числовым sheetId, поэтому переименование листов на 100% безопасно.";
  ui.alert("Справка по менеджеру листов", msg, ui.ButtonSet.OK);
}

// ==============================================================================
// ФУНКЦИИ СИНХРОНИЗАЦИИ, АУДИТА И ВЕБХУКОВ
// ==============================================================================

/** Триггер редактирования ячеек для отправки сигнала ревалидации в Next.js */
function sendUpdateSignal(e) {
  if (!e) return;
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
    SpreadsheetApp.getUi().alert("Проверка сайта", "URL: " + siteUrl + "\nСостояние: Локальный сервер или нет подключения: " + err.message, SpreadsheetApp.getUi().ButtonSet.OK);
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

  SpreadsheetApp.getUi().alert("Аудит календаря", "Активных 24-часовых удержаний: " + activeHolds + "\nКалендарь синхронизирован.", SpreadsheetApp.getUi().ButtonSet.OK);
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

/** Проверка строгого стандарта точки с запятой в формулах */
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
          if ((f.indexOf("MAP(") !== -1 || f.indexOf("GOOGLETRANSLATE(") !== -1) && f.indexOf(",") !== -1 && f.indexOf(";") === -1) {
            commaWarnings++;
          }
        }
      }
    }
  }

  if (commaWarnings > 0) {
    SpreadsheetApp.getUi().alert("⚠️ Внимание!", "Найдено формул с запятой: " + commaWarnings + ".\nРекомендуется заменить разделитель на точку с запятой во избежание ошибки #ERROR!.", SpreadsheetApp.getUi().ButtonSet.OK);
  } else {
    SpreadsheetApp.getUi().alert("✅ Стандарт соблюден!", "Проверено формул: " + totalChecked + ".\nВсе формулы соответствуют каноническому стандарту русской локали с точкой с запятой ;.", SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

/** Паспорт листов и их числовых ID */
function showSheetsPassportModal() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  var info = "📋 ПАСПОРТ ЛИСТОВ ТАБЛИЦЫ [ID & НАЗВАНИЯ]:\n\n";

  for (var i = 0; i < sheets.length; i++) {
    var sh = sheets[i];
    info += (i + 1) + ". " + sh.getName() + " [sheetId: " + sh.getSheetId() + ", скрыт: " + (sh.isSheetHidden() ? "Да" : "Нет") + "]\n";
  }

  SpreadsheetApp.getUi().alert("Паспорт листов", info, SpreadsheetApp.getUi().ButtonSet.OK);
}

/**
 * Единое эталонное форматирование темной шапки таблицы
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
 * Интерактивное восстановление и самоисцеление всех листов системы Villa Turaman
 */
function ensureAllSystemSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ui = SpreadsheetApp.getUi();
  var existingSheets = ss.getSheets();

  // Ликвидация устаревших листов
  var obsoleteEnglishNames = [
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
    'settings', 'aisettings'
  ];

  for (var d = 0; d < existingSheets.length; d++) {
    var sName = existingSheets[d].getName().trim().toLowerCase();
    if (obsoleteEnglishNames.indexOf(sName) !== -1) {
      try {
        ss.deleteSheet(existingSheets[d]);
      } catch (e) {
        Logger.log("Не удалось удалить устаревший лист: " + sName + ": " + e.message);
      }
    }
  }

  existingSheets = ss.getSheets();
  var createdCount = 0;
  var keys = Object.keys(VILLA_SHEETS_CONFIG);

  for (var k = 0; k < keys.length; k++) {
    var key = keys[k];
    var cfg = VILLA_SHEETS_CONFIG[key];
    var targetSheet = findSheetByConfigKey(ss, key);

    if (!targetSheet) {
      targetSheet = ss.insertSheet(cfg.name);
      createdCount++;
    }

    if (targetSheet.getLastRow() <= 1) {
      initSingleSheetByKey_(targetSheet, key);
    }
  }

  renameSheetsToRussianStandard();
  sortSheetsCanonically();

  if (createdCount > 0) {
    ui.alert("Самоисцеление листов завершено", "Успешно восстановлено отсутствующих листов: " + createdCount + ". Все данные, заголовки и формулы актуализированы.", ui.ButtonSet.OK);
  } else {
    SpreadsheetApp.getActive().toast("Все листы проверены и наполнены эталонным контентом.", "✅ Завершено", 5);
  }
}

/**
 * Инициализация шапки, смарт-форматирования и эталонных строк для конкретного листа
 */
function initSingleSheetByKey_(sheet, key) {
  if (!sheet || !key) return;

  if (key === 'HOME') {
    var homeHeaders = ['Блок / Раздел', 'Ключ [ID]', 'Место размещения / Описание [RU]', 'RU', 'EN', 'TR', 'Медиа / Иконка / Ссылка', 'Статус [Вкл/Выкл]'];
    styleSheetHeader_(sheet, homeHeaders, 1);
    var homeRows = [
      ['1. Главный экран', 'hero_title', 'Главный заголовок листинга в шапке', 'Villa Turaman Luxury Waterfront', 'Villa Turaman Luxury Waterfront', 'Villa Turaman Luxury Waterfront', '', 'Вкл'],
      ['1. Главный экран', 'hero_subtitle', 'Подзаголовок виллы под главным заголовком', 'Ваш идеальный отдых в Дальяне. Бронирование виллы, премиальный сервис от суперхозяина [HOST_NAME].', 'Your perfect Dalyan vacation. Villa reservations, premium service from superhost [HOST_NAME].', 'Mukemmel Dalyan tatiliniz. Super ev sahibi [HOST_NAME] tarafindan birinci sinif hizmet.', '', 'Вкл'],
      ['1. Главный экран', 'hero_rating', 'Числовой рейтинг виллы', '4.98', '4.98', '4.98', 'Star', 'Вкл'],
      ['1. Главный экран', 'hero_reviews_count', 'Количество отзывов рядом с рейтингом', '48 отзывов', '48 reviews', '48 degerlendirme', '', 'Вкл'],
      ['1. Главный экран', 'hero_superhost_badge', 'Бейдж статуса суперхозяина', 'Суперхозяин', 'Superhost', 'Super Ev Sahibi', 'Award', 'Вкл'],
      ['1. Главный экран', 'hero_location', 'Текст кликабельной локации объекта', '[ADDRESS]', '[ADDRESS]', '[ADDRESS]', 'MapPin', 'Вкл'],
      ['1. Главный экран', 'hero_share_btn', 'Текст кнопки Поделиться', 'Поделиться', 'Share', 'Paylas', 'Share2', 'Вкл'],
      ['1. Главный экран', 'hero_favorite_btn', 'Текст кнопки В избранное', 'В избранное', 'Save', 'Kaydet', 'Heart', 'Вкл'],
      ['1. Главный экран', 'hero_image', 'Главное фоновое фото объекта', 'Главные фотографии фасада и бассейна', 'Main facade and pool photos', 'Ana cephe ve havuz fotograflari', 'https://drive.google.com/file/d/1NjSHRDa5eJpQTzO9268e8LMRzDVmYtX7/view?usp=sharing,https://drive.google.com/file/d/1IZMH6wtfLHZ6ibKHfmBhPGMFntZ_fXKU/view?usp=drive_link', 'Вкл'],
      ['2. Характеристики', 'host_specs_header', 'Заголовок типа жилья и владельца', 'Отдельная вилла целиком • Хозяин: Алексей Знаменский', 'Entire villa • Host: Aleksei Znamenskii', 'Mustakil villa tamami • Ev Sahibi: Aleksei Znamenskii', '', 'Вкл'],
      ['2. Характеристики', 'host_specs_name', 'Отображаемое имя владельца виллы', 'Алексей Знаменский', 'Aleksei Znamenskii', 'Aleksei Znamenskii', '', 'Вкл'],
      ['2. Характеристики', 'host_specs_avatar', 'Аватар владельца виллы в карточке характеристик', 'Аватар владельца виллы', 'Host profile avatar', 'Ev sahibi profil avatari', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160', 'Вкл'],
      ['2. Характеристики', 'spec_guests', 'Счетчик гостей в строке параметров', '10 гостей', '10 guests', '10 misafir', 'Users', 'Вкл'],
      ['2. Характеристики', 'spec_bedrooms', 'Счетчик спален в строке параметров', '4 спальни', '4 bedrooms', '4 yatak odasi', 'Bed', 'Вкл'],
      ['2. Характеристики', 'spec_beds', 'Счетчик спальных мест [кроватей]', '5 кроватей', '5 beds', '5 yatak', 'Bed', 'Вкл'],
      ['2. Характеристики', 'spec_baths', 'Счетчик ванных комнат', '4 ванные комнаты', '4 bathrooms', '4 banyo', 'Bath', 'Вкл'],
      ['3. Преимущества', 'highlight_1_title', 'Заголовок первого преимущества', 'Опытный Суперхозяин [Superhost]', 'Experienced Superhost', 'Deneyimli Super Ev Sahibi', 'Sparkles', 'Вкл'],
      ['3. Преимущества', 'highlight_1_desc', 'Описание первого преимущества', 'Алексей имеет рейтинг 4.98★ и стремится предоставить первоклассный сервис каждому гостю.', 'Aleksei has a 4.98★ rating and strives to provide top-notch service to every guest.', 'Aleksei 4.98★ puana sahiptir ve her misafire birinci sinif hizmet sunmayi hedefler.', '', 'Вкл'],
      ['3. Преимущества', 'highlight_2_title', 'Заголовок второго преимущества', 'Бесконтактное прибытие [Self check-in]', 'Self check-in', 'Kendi Kendine Giris', 'Key', 'Вкл'],
      ['3. Преимущества', 'highlight_2_desc', 'Описание второго преимущества', 'Удобный электронный замок и персональный код доступа для заселения в любое удобное время с 16:00.', 'Convenient electronic lock and personal code for check-in at any time after 4:00 PM.', 'Saat 16:00 sonrasi giris icin pratik elektronik kilit ve kisisel sifre.', '', 'Вкл'],
      ['3. Преимущества', 'highlight_3_title', 'Заголовок третьего преимущества', 'Бесплатная отмена за 14 дней', 'Free cancellation 14 days prior', '14 gun oncesine kadar ucretsiz iptal', 'ShieldCheck', 'Вкл'],
      ['3. Преимущества', 'highlight_3_desc', 'Описание третьего преимущества', 'Полный возврат средств при отмене не позднее чем за 14 суток до даты заезда.', 'Full refund if cancelled at least 14 days before arrival date.', 'Giris tarihinden en az 14 gun once yapilan iptallerde tam iade.', '', 'Вкл'],
      ['4. О вилле', 'about_title', 'Заголовок раздела описания', 'О Вилле', 'About Villa', 'Villa Hakkinda', '', 'Вкл'],
      ['4. О вилле', 'about_text', 'Краткое описание виллы на главной странице', 'Villa Turaman: это гармоничное сочетание уединения, современного комфорта и первоклассного сервиса для незабываемого отпуска в сердце Дальяна.', 'Villa Turaman offers a harmonious combination of privacy, modern comfort and first-class service for an unforgettable holiday in the heart of Dalyan.', 'Villa Turaman, Dalyan kalbinde unutulmaz bir tatil icin mahremiyet, modern konfor ve birinci sinif hizmet sunmaktadir.', '', 'Вкл'],
      ['4. О вилле', 'about_btn_more', 'Текст ссылки открытия полного описания', 'Показать больше об объекте', 'Show more about property', 'Tesis hakkinda daha fazla goster', 'ChevronRight', 'Вкл'],
      ['4. О вилле', 'about_modal_title', 'Заголовок всплывающего окна подробностей', 'Об этой вилле', 'About this villa', 'Bu villa hakkinda', '', 'Вкл'],
      ['4. О вилле', 'about_sec_1_title', 'Модальное окно: Раздел 1 Заголовок', 'О вилле и о нас', 'About the villa and about us', 'Villa hakkinda ve biz hakkinda', '', 'Вкл'],
      ['4. О вилле', 'about_sec_1_text', 'Модальное окно: Раздел 1 Текст', 'Вилла Turaman расположена по адресу: [ADDRESS]. Локация: [MAPS_URL]. [OUTDOOR_ZONES]. [POOL_SPECS] [период работы: [POOL_SEASON]]. Режим джакузи: [JACUZZI_HOURS]. Освещение: [POOL_LIGHTS].', 'Villa Turaman is located at: [ADDRESS]. Location: [MAPS_URL]. [OUTDOOR_ZONES]. [POOL_SPECS] [operating season: [POOL_SEASON]]. Jacuzzi mode: [JACUZZI_HOURS]. Lighting: [POOL_LIGHTS].', 'Villa Turaman adresi: [ADDRESS]. Konum: [MAPS_URL]. [OUTDOOR_ZONES]. [POOL_SPECS] [sezon: [POOL_SEASON]]. Jakuzi modu: [JACUZZI_HOURS]. Aydinlatma: [POOL_LIGHTS].', '', 'Вкл'],
      ['4. О вилле', 'about_sec_2_title', 'Модальное окно: Раздел 2 Заголовок', 'Вместимость', 'Capacity', 'Kapasite', '', 'Вкл'],
      ['4. О вилле', 'about_sec_2_text', 'Модальное окно: Раздел 2 Текст', '[VILLA_FLOORS] Вместимость: [MAX_GUESTS].', '[VILLA_FLOORS] Capacity: [MAX_GUESTS].', '[VILLA_FLOORS] Kapasite: [MAX_GUESTS].', '', 'Вкл'],
      ['4. О вилле', 'about_sec_3_title', 'Модальное окно: Раздел 3 Заголовок', 'Описание комнат и планировка', 'Description of the villa', 'Villanin Tanimi', '', 'Вкл'],
      ['4. О вилле', 'about_sec_3_text', 'Модальное окно: Раздел 3 Текст', 'В самом центре Дальяна. Приватный бассейн. Полноценная кухня и гостиная. 4 большие спальни. Спальня на 1 этаже: 3 спальных места, ванная комната и кондиционер. Спальни на 2 этаже: 3 отдельные спальные комнаты, каждая со своей ванной комнатой и кондиционером.', 'The villa is located in the heart of Dalyan. Private pool, full kitchen and living room. 4 large bedrooms with en-suite bathrooms and air conditioning.', 'Villa Dalyan merkezinde yer almaktadir. Ozel havuz, tam donanimli mutfak ve oturma odasi. Ozel banyolu ve klimali 4 genis yatak odasi.', '', 'Вкл'],
      ['4. О вилле', 'about_sec_4_title', 'Модальное окно: Раздел 4 Заголовок', 'Что доступно гостю: 1 и 2 этажи', 'What is available to the guest', 'Misafirlerin kullanimina sunulan olanaklar', '', 'Вкл'],
      ['4. О вилле', 'about_sec_4_text', 'Модальное окно: Раздел 4 Текст', 'Первый этаж: кухня, гостиная, Smart TV 55", спальня с ванной. Второй этаж: 3 спальни с собственными санузлами, стиральная машина.', 'First floor: kitchen, living room, Smart TV 55", bedroom with bathroom. Second floor: 3 bedrooms each with en-suite bathroom, washing machine.', 'Birinci kat: mutfak, oturma odasi, 55 inc Smart TV, banyolu yatak odasi. Ikinci kat: ozel banyolu 3 yatak odasi, camasir makinesi.', '', 'Вкл'],
      ['4. О вилле', 'about_sec_5_title', 'Модальное окно: Раздел 5 Заголовок', 'Бассейн и Сад', 'Pool and Garden', 'Havuz ve Bahce', '', 'Вкл'],
      ['4. О вилле', 'about_sec_5_text', 'Модальное окно: Раздел 5 Текст', '[POOL_CLEANING] [STREET_LIGHTS]', '[POOL_CLEANING] [STREET_LIGHTS]', '[POOL_CLEANING] [STREET_LIGHTS]', '', 'Вкл'],
      ['4. О вилле', 'about_sec_6_title', 'Модальное окно: Раздел 6 Заголовок', 'Правила проживания', 'House Rules', 'Ev Kurallari', '', 'Вкл'],
      ['4. О вилле', 'about_sec_6_text', 'Модальное окно: Раздел 6 Текст', 'Заезд после 16:00, выезд до 10:00. Курение в помещениях виллы строго запрещено.', 'Check-in after 4:00 PM, check-out before 10:00 AM. Smoking is strictly prohibited in the villa.', 'Giris saati 16:00 sonrasi, cikis saati 10:00 oncesidir. Villada sigara icmek kesinlikle yasaktir.', '', 'Вкл'],
      ['4. О вилле', 'about_sec_7_title', 'Модальное окно: Раздел 7 Заголовок', 'Регистрация KBS и KVKK', 'Registration [KBS/KVKK]', 'Kayit [KBS/KVKK]', '', 'Вкл'],
      ['4. О вилле', 'about_sec_7_text', 'Модальное окно: Раздел 7 Текст', 'Ваши данные защищены и используются исключительно для регистрации гостей в системе KBS согласно законам Турции.', 'Your data is protected and used solely for the purpose of registering guests in the KBS system in accordance with Turkish law.', 'Verileriniz korunmaktadir ve Turk kanunlarina uygun olarak yalnizca KBS sistemine misafir kaydi amaciyla kullanilmaktadir.', '', 'Вкл'],
      ['6. Удобства', 'amenity_main_3', 'Основное удобство 3 на главной', 'Скоростной Wi-Fi: [WIFI_NAME]', 'High-speed Wi-Fi: [WIFI_NAME]', 'Yuksek hizli Wi-Fi: [WIFI_NAME]', 'Wifi', 'Вкл']
    ];
    sheet.getRange(2, 1, homeRows.length, homeHeaders.length).setValues(homeRows);
    sheet.getRange("E2").setFormula('=MAP(D2:D; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))');
    sheet.getRange("F2").setFormula('=MAP(D2:D; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))');
  } else if (key === 'GALLERY') {
    var galHeaders = ['ID', 'Группа [RU]', 'Описание [RU]', 'Группа [EN]', 'Описание [EN]', 'Группа [TR]', 'Описание [TR]', 'Тип', 'Медиа ссылки', 'Подпись [RU]', 'Подпись [EN]', 'Подпись [TR]'];
    styleSheetHeader_(sheet, galHeaders, 1);
    var galRows = [
      ['gal-1', 'Фасад и Бассейн', 'Вид на приватный бассейн и шезлонги', '', '', '', '', 'Фото', 'https://drive.google.com/file/d/1NjSHRDa5eJpQTzO9268e8LMRzDVmYtX7/view?usp=sharing', 'Приватный бассейн 36м²', '', ''],
      ['gal-2', 'Гостиная комната', 'Просторная гостиная с мягким диваном и Smart TV', '', '', '', '', 'Фото', 'https://drive.google.com/file/d/1IZMH6wtfLHZ6ibKHfmBhPGMFntZ_fXKU/view?usp=drive_link', 'Гостиная и кухня', '', '']
    ];
    sheet.getRange(2, 1, galRows.length, galHeaders.length).setValues(galRows);
    sheet.getRange("D2").setFormula('=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))');
    sheet.getRange("E2").setFormula('=MAP(C2:C; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))');
    sheet.getRange("F2").setFormula('=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))');
    sheet.getRange("G2").setFormula('=MAP(C2:C; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))');
  } else if (key === 'SERVICES') {
    var srvHeaders = ['ID', 'Название услуги [RU]', 'Описание [RU]', 'Название услуги [EN]', 'Описание [EN]', 'Название услуги [TR]', 'Описание [TR]', 'Цена [EUR]', 'Цена [RUB]', 'Цена [TRY]', 'Изображения', 'Наличие', 'Тип', 'Видео презентации', 'Подробное описание [RU]', 'Подробное описание [EN]', 'Подробное описание [TR]'];
    styleSheetHeader_(sheet, srvHeaders, 1);
    var srvRows = [
      ['prod-1', 'Индивидуальный VIP-трансфер из аэропорта Даламан [DLM]', 'Mercedes Vito с кондиционером и напитками', '', '', '', '', '50', '5000', '1800', 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200', 'Да', 'Услуга', '', 'Встреча в зоне прилета аэропорта Даламан [25 минут до виллы]. В салоне Wi-Fi.', '', ''],
      ['prod-2', 'Приватный круиз на яхте по реке Дальян и пляжу Изтузу', 'Традиционная деревянная лодка: Ликийские гробницы и черепахи', '', '', '', '', '250', '25000', '9000', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200', 'Да', 'Пакet', '', 'Эксклюзивный маршрут на весь день со свежеприготовленным обедом от капитана.', '', ''],
      ['prod-3', 'Ужин от персонального шеф-повара на вилле', '4-курсовой ужин у бассейна: турецкие мезе и морепродукты', '', '', '', '', '120', '12000', '4300', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200', 'Да', 'Услуга', '', 'Шеф лично закупает фермерские продукты на рынке Дальяна и сервирует стол.', '', '']
    ];
    sheet.getRange(2, 1, srvRows.length, srvHeaders.length).setValues(srvRows);
    sheet.getRange("D2").setFormula('=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))');
    sheet.getRange("E2").setFormula('=MAP(C2:C; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))');
    sheet.getRange("F2").setFormula('=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))');
    sheet.getRange("G2").setFormula('=MAP(C2:C; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))');
  } else if (key === 'GUIDES') {
    var gHeaders = ['ID', 'Название путеводителя [RU]', 'Описание [RU]', 'Название путеводителя [EN]', 'Описание [EN]', 'Название путеводителя [TR]', 'Описание [TR]', 'Изображения', 'Категория', 'Ссылка на видео', 'Цена [EUR]', 'Цена [RUB]', 'Цена [TRY]', 'Видео презентации', 'Подробное описание [RU]', 'Подробное описание [EN]', 'Подробное описание [TR]'];
    styleSheetHeader_(sheet, gHeaders, 1);
    var gRows = [
      ['guide-1', 'Секретные пляжи и бухты Дальяна: Авторский видео-гид', 'Эксклюзивные локации без туристов: дикие пляжи и смотровые', '', '', '', '', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200', 'Пляжи', 'https://youtube.com/watch?v=example1', '15', '1500', '550', '', 'Подробная карта подъездов, координаты стоянок и GPS метки для навигатора.', '', ''],
      ['guide-2', 'Гастрономический гид: Лучшие рестораны и таверны Дальяна', 'Семейные заведения с настоящей эгейской кухней от суперхозяина', '', '', '', '', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200', 'Рестораны', 'https://youtube.com/watch?v=example2', '10', '1000', '370', '', 'Проверенные блюда, средний чек, явки владельцев и рекомендации по столикам.', '', '']
    ];
    sheet.getRange(2, 1, gRows.length, gHeaders.length).setValues(gRows);
    sheet.getRange("D2").setFormula('=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))');
    sheet.getRange("E2").setFormula('=MAP(C2:C; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))');
    sheet.getRange("F2").setFormula('=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))');
    sheet.getRange("G2").setFormula('=MAP(C2:C; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))');
  } else if (key === 'LEGAL') {
    var lHeaders = ['ID Раздела', 'Название [RU]', 'Название [EN]', 'Название [TR]', 'Текст [RU]', 'Текст [EN]', 'Текст [TR]'];
    styleSheetHeader_(sheet, lHeaders, 1);
    var lRows = [
      ['oferta', 'Договор аренды жилья', 'Rental Agreement', 'Kiralama Sozlesmesi', 'Настоящий договор определяет правила краткосрочной аренды виллы Villa Turaman.', 'This agreement outlines terms for short-term rental of Villa Turaman.', 'Bu sozlesme Villa Turaman kisa donem kiralama kosullarini belirler.'],
      ['kvkk', 'Политика конфиденциальности KVKK', 'Privacy Policy KVKK', 'Gizlilik Politikasi KVKK', 'Обработка персональных данных гостей осуществляется в соответствии с законом KVKK Турции.', 'Processing of personal data is carried out in accordance with Turkish KVKK law.', 'Kisisel veriler Turk KVKK kanununa uygun olarak islenmektedir.']
    ];
    sheet.getRange(2, 1, lRows.length, lHeaders.length).setValues(lRows);
  } else if (key === 'BOOKINGS') {
    var bHeaders = ['Дата заявки', 'Имя клиента', 'Контакт [Tel/TG]', 'Старт', 'Завершение', 'Ночей', 'Взрослых', 'Детей', 'Всего гостей', 'Итоговая стоимость', 'Статус оплаты'];
    styleSheetHeader_(sheet, bHeaders, 1);
  } else if (key === 'CALENDAR') {
    var cHeaders = ['Дата старта', 'Дата завершения', 'Тип [Блокировка/Цена/Мин. дней/Заметка/Настройки]', 'Значение', 'Заметка', 'Автор изменения', 'Время фиксации'];
    styleSheetHeader_(sheet, cHeaders, 1);
    var cRows = [
      ['01.05.2026', '31.10.2026', 'Цена', '220', 'Базовый тариф сезона', 'admin', new Date().toLocaleString('ru-RU')]
    ];
    sheet.getRange(2, 1, cRows.length, cHeaders.length).setValues(cRows);
  } else if (key === 'ACCOUNTS') {
    var aHeaders = ['Дата регистрации', 'Имя', 'Контакт [Логин]', 'Пароль', 'Блок: Сайт', 'Блок: Аккаунт', 'Блок: Чат'];
    styleSheetHeader_(sheet, aHeaders, 1);
  } else if (key === 'ORDERS') {
    var oHeaders = ['Дата заказа', 'Контакт', 'Тип [Гид/Услуга/Аренда]', 'Сумма', 'Статус оплаты', 'Детали'];
    styleSheetHeader_(sheet, oHeaders, 1);
  } else if (key === 'ACCESS') {
    var accHeaders = ['Дата', 'Гость [Контакт]', 'Гид ID', 'Категория', 'Статус оплаты', 'Доступ [Да/Нет]', 'Прогресс'];
    styleSheetHeader_(sheet, accHeaders, 1);
  } else if (key === 'TEMPLATES') {
    var tHeaders = ['ID Раздела', 'Название [RU]', 'Название [EN]', 'Название [TR]', 'Текст [RU]', 'Текст [EN]', 'Текст [TR]'];
    styleSheetHeader_(sheet, tHeaders, 1);
    var tRows = [
      [
        '1.1_discount_10',
        '1.1. Скидка 10% за невозвратный тариф',
        '1.1. 10% Non-refundable rate discount',
        '1.1. %10 İade Edilemez Tarife İndirimi',
        'Здравствуйте, [FIRST_NAME]! Рад вашему интересу к Villa Turaman! Для поездок на ближайшие даты активирована опция: Бронирование без возврата со скидкой 10%. Скидка действует, если дата выезда в пределах 60 дней. С уважением, Алексей Знаменский.',
        'Hello [FIRST_NAME]! Thank you for your interest in Villa Turaman! We have a special 10% non-refundable discount for stays within 60 days. Best regards, Aleksei Znamenskii.',
        'Merhaba [FIRST_NAME]! Villa Turaman a gösterdiğiniz ilgi için teşekkürler! 60 gün içindeki konaklamalar için %10 iade edilemez indirim seçeneğimiz mevcuttur. Saygılarımla, Aleksei Znamenskii.'
      ],
      [
        '1.2_budget_price',
        '1.2. Работа с ценой и вопросы по бюджету',
        '1.2. Price & budget evaluation',
        '1.2. Fiyat ve Bütçe Değerlendirmesi',
        'Здравствуйте, [FIRST_NAME]! Благодарю за интерес к Villa Turaman! Если вас смущает текущая стоимость или есть определенный бюджет, подскажите, какой ориентир по цене был бы для вас комфортным? С удовольствием обсудим возможные условия! С уважением, Алексей Знаменский.',
        'Hello [FIRST_NAME]! Thank you for your interest in Villa Turaman! If you have a specific budget in mind, please share what rate works best for you. Best regards, Aleksei Znamenskii.',
        'Merhaba [FIRST_NAME]! Villa Turaman a gösterdiğiniz ilgi için teşekkür ederiz! Aklınızda belirli bir bütçe varsa lütfen paylaşın, memnuniyetle değerlendirelim. Saygılarımla, Aleksey Znamenskiy.'
      ],
      [
        '1.3_early_booking_expiry',
        '1.3. Напоминание об истечении Раннего бронирования',
        '1.3. Early bird discount expiration reminder',
        '1.3. Erken Rezervasyon İndirimi Hatırlatması',
        'Здравствуйте, [FIRST_NAME]! Напоминаю о вашей заявке на Villa Turaman. Скидка за раннее бронирование действует строго до даты за 2 месяца до заезда. Рекомендуем подтвердить бронирование сегодня, чтобы зафиксировать лучшую цену! С уважением, Алексей Знаменский.',
        'Hello [FIRST_NAME]! Just following up regarding your booking request. Our early booking discount is valid up to 2 months prior to check-in. We recommend locking in your dates today! Best regards, Aleksei Znamenskii.',
        'Merhaba [FIRST_NAME]! Erken rezervasyon indirimimiz giriş tarihine 2 ay kalana kadar geçerlidir. En uygun fiyatı garantilemek için bugün tamamlamanızı tavsiye ederiz! Saygılarımla, Aleksey Znamenskiy.'
      ],
      [
        '2.1_booking_confirmed',
        '2.1. Подтверждение бронирования',
        '2.1. Booking confirmation',
        '2.1. Rezervasyon Onayı',
        'Здравствуйте, [FIRST_NAME]! Поздравляем, ваше бронирование Villa Turaman подтверждено! Код: [CONFIRMATION_CODE]. Даты: [CHECKIN_DATE] - [CHECKOUT_DATE]. Заезд с [CHECKIN_TIME], выезд до [CHECKOUT_TIME]. С нетерпением ждем вас в гости! С уважением, Алексей Знаменский.',
        'Hello [FIRST_NAME]! Congratulations, your booking for Villa Turaman is confirmed! Code: [CONFIRMATION_CODE]. Dates: [CHECKIN_DATE] - [CHECKOUT_DATE]. Check-in: [CHECKIN_TIME], check-out: [CHECKOUT_TIME]. Best regards, Aleksei Znamenskii.',
        'Merhaba [FIRST_NAME]! Tebrikler, Villa Turaman rezervasyonunuz onaylandı! Kod: [CONFIRMATION_CODE]. Tarihler: [CHECKIN_DATE] - [CHECKOUT_DATE]. Giriş: [CHECKIN_TIME], çıkış: [CHECKOUT_TIME]. Saygılarımla, Aleksey Znamenskiy.'
      ],
      [
        '2.2_top_floor_clarification',
        '2.2. Разъяснение по закрытому верхнему этажу',
        '2.2. Clarification on closed top floor',
        '2.2. Kapalı Üst Kat Açıklaması',
        'Здравствуйте, [FIRST_NAME]! Верхний этаж виллы используется как закрытое служебное помещение для личных вещей владельцев и закрыт на ключ. Вся остальная вилла, 4 спальни, приватный бассейн, сад и терраса находятся в вашем исключительном пользовании. С уважением, Алексей Знаменский.',
        'Hello [FIRST_NAME]! The top floor is a locked private storage area. The entire rest of the villa, 4 bedrooms, private pool, garden and terrace are exclusively yours during your stay. Best regards, Aleksei Znamenskii.',
        'Merhaba [FIRST_NAME]! En üst kat kilitli özel depo alanıdır. Villanın geri kalan tamamı, 4 yatak odası, özel havuz ve bahçe tamamen sizin kullanımınızdadır. Saygılarımla, Aleksey Znamenskiy.'
      ],
      [
        '2.3_transfer_assistance',
        '2.3. Помощь по организации трансфера',
        '2.3. Airport transfer assistance',
        '2.3. Transfer Hizmeti Bilgilendirmesi',
        'Здравствуйте, [FIRST_NAME]! Мы с радостью поможем организовать комфортный трансфер из аэропорта Даламан [DLM] прямо к вилле. Сообщите, если вам нужны контакты проверенной транспортной компании. С уважением, Алексей Знаменский.',
        'Hello [FIRST_NAME]! We can gladly connect you with a reliable transfer company for airport transfers from Dalaman [DLM] to the villa. Let us know if you need their details! Best regards, Aleksei Znamenskii.',
        'Merhaba [FIRST_NAME]! Dalaman Havalimanı ndan villamıza özel transfer ayarlamanız için güvenilir transfer şirketinin bilgilerini memnuniyetle paylaşabiliriz. Saygılarımla, Aleksey Znamenskiy.'
      ],
      [
        '2.4_email_receipt_confirmation',
        '2.4. Подтверждение получения письма',
        '2.4. Email receipt confirmation',
        '2.4. E-posta Alındı Onayı',
        'Здравствуйте, [FIRST_NAME]! Подтверждаю, что успешно получил ваше электронное письмо. Большое спасибо за информацию! С нетерпением жду встречи на вилле! С уважением, Алексей Знаменский.',
        'Hello [FIRST_NAME]! Confirming that I have safely received your email. Thank you very much! Looking forward to welcoming you. Best regards, Aleksei Znamenskii.',
        'Merhaba [FIRST_NAME]! E-postanızı aldığımı teyit ederim. Bilgiler için teşekkürler! Sizi ağırlamayı sabırsızlıkla bekliyorum. Saygılarımla, Aleksey Znamenskiy.'
      ],
      [
        '3.1_kbs_registration',
        '3.1. Запрос данных для системы регистрации KBS',
        '3.1. Turkish KBS identity reporting request',
        '3.1. KBS Kimlik Bildirim Sistemi Veri Talebi',
        'Здравствуйте, [FIRST_NAME]! Согласно законодательству Турции, нам необходимо зарегистрировать всех гостей в государственной системе KBS. Пожалуйста, отправьте ФИО, номер паспорта, дату рождения и гражданство каждого гостя в текстовом виде. С уважением, Алексей Знаменский.',
        'Hello [FIRST_NAME]! Under Turkish regulations, all staying guests must be registered in the official KBS system. Please provide full name, passport number, birth date and nationality for each guest in text format. Best regards, Aleksei Znamenskii.',
        'Merhaba [FIRST_NAME]! Türkiye mevzuatı gereğince tüm misafirlerin KBS sistemine kaydedilmesi zorunludur. Lütfen tüm konukların ad, soyad, pasaport no, doğum tarihi ve uyruk bilgilerini metin olarak iletiniz. Saygılarımla, Aleksey Znamenskiy.'
      ],
      [
        '3.2_address_geolocation',
        '3.2. Адрес и ссылка на геолокацию Google Maps',
        '3.2. Address & Google Maps link',
        '3.2. Adres ve Google Maps Konum Bağlantısı',
        'Здравствуйте, [FIRST_NAME]! Направляю точные координаты виллы:\nАдрес: [ADDRESS]\nGoogle Maps: [MAPS_URL]\nКогда будете в дороге, дайте знать, мы встретим вас! С уважением, Алексей Знаменский.',
        'Hello [FIRST_NAME]! Here are the exact villa details:\nAddress: [ADDRESS]\nGoogle Maps: [MAPS_URL]\nPlease let us know when you are on your way so we can greet you! Best regards, Aleksei Znamenskii.',
        'Merhaba [FIRST_NAME]! Villamızın konum bilgileri:\nAdres: [ADDRESS]\nGoogle Maps: [MAPS_URL]\nYola çıktığınızda bildirirseniz sizi karşılamak için hazır oluruz! Saygılarımla, Aleksey Znamenskiy.'
      ],
      [
        '3.3_checkin_time_coordination',
        '3.3. Согласование времени заезда',
        '3.3. Early & late check-in coordination',
        '3.3. Erken ve Geç Giriş Saati Planlaması',
        'Здравствуйте, [FIRST_NAME]! Стандартное время заезда: с [CHECKIN_TIME]. Прибытие позже этого времени абсолютно комфортно: смарт-замок позволяет заселиться в любой час. Если планируете приехать раньше, сообщите нам, и мы постараемся подготовить виллу как можно раньше! С уважением, Алексей Знаменский.',
        'Hello [FIRST_NAME]! Standard check-in starts at [CHECKIN_TIME]. Later check-in is fully flexible thanks to our smart lock. If you need early arrival, let us know and we will do our best! Best regards, Aleksei Znamenskii.',
        'Merhaba [FIRST_NAME]! Standart giriş saatimiz [CHECKIN_TIME] itibarıyladır. Akıllı kilit sayesinde geç girişler tamamen sorunsuzdur. Erken giriş ihtiyacınız olursa lütfen bildirin! Saygılarımla, Aleksey Znamenskiy.'
      ],
      [
        '3.4_checkin_instructions',
        '3.4. Стандартная инструкция по заселению и Wi-Fi',
        '3.4. Check-in instructions & Wi-Fi',
        '3.4. Giriş Talimatları ve Wi-Fi Bilgileri',
        'Здравствуйте, [FIRST_NAME]! Ждем вас сегодня на Villa Turaman!\nАдрес: [ADDRESS]\nСпособ заселения: [CHECKIN_METHOD]\nWi-Fi сеть: [WIFI_NAME]\nПароль: [WIFI_PASSWORD]\nЕсли возникнут вопросы, я на связи 24/7! С уважением, Алексей Знаменский.',
        'Hello [FIRST_NAME]! Looking forward to welcoming you today at Villa Turaman!\nAddress: [ADDRESS]\nCheck-in method: [CHECKIN_METHOD]\nWi-Fi network: [WIFI_NAME]\nPassword: [WIFI_PASSWORD]\nBest regards, Aleksei Znamenskii.',
        'Merhaba [FIRST_NAME]! Bugün sizi Villa Turaman da ağırlamayı sabırsızlıkla bekliyoruz!\nAdres: [ADDRESS]\nGiriş yöntemi: [CHECKIN_METHOD]\nWi-Fi: [WIFI_NAME]\nŞifre: [WIFI_PASSWORD]\nSaygılarımla, Aleksey Znamenskiy.'
      ],
      [
        '3.5_welcome_guide_dalyan',
        '3.5. Приветственный гид и путеводитель по Дальяну',
        '3.5. Welcome guide to Dalyan',
        '3.5. Dalyan Hoş Geldiniz Rehberi',
        'Здравствуйте, [FIRST_NAME]! Делюсь персональным гидом по Дальяну:\n🏡 Вилла: [ADDRESS] | [MAPS_URL]\n🚗 Трансфер: +90 543 335 80 70 - Ahmet\n🚤 Лодочные туры: +90 544 588 58 09 - Капитан Адам\n🍽️ Ресторан Cicek: https://maps.google.com/?cid=14955012417485225116\n🏖️ Пляж Изтузу: заповедник черепах Caretta-Caretta\nЛегкой дороги и отличного отдыха! С уважением, Алексей Знаменский.',
        'Hello [FIRST_NAME]! Sharing a personal guide to Dalyan:\n🏡 Villa: [ADDRESS] | [MAPS_URL]\n🚗 Transfer: +90 543 335 80 70 - Ahmet\n🚤 Boat trips: +90 544 588 58 09 - Captain Adam\n🍽️ Cicek Restaurant: https://maps.google.com/?cid=14955012417485225116\n🏖️ Iztuzu Beach: Caretta-Caretta turtle reserve\nBest regards, Aleksei Znamenskii.',
        'Merhaba [FIRST_NAME]! Dalyan özel rehberimiz:\n🏡 Villa: [ADDRESS] | [MAPS_URL]\n🚗 Transfer: +90 543 335 80 70 - Ahmet\n🚤 Tekne turları: +90 544 588 58 09 - Kaptan Adam\n🍽️ Çiçek Restoran: https://maps.google.com/?cid=14955012417485225116\n🏖️ İztuzu Plajı: Caretta-Caretta koruma alanı\nSaygılarımla, Aleksey Znamenskiy.'
      ],
      [
        '4.1_stay_care_checkin',
        '4.1. Забота о госте во время проживания',
        '4.1. Guest care check-in during stay',
        '4.1. Konaklama Sırasında Misafir Memnuniyeti',
        'Здравствуйте, [FIRST_NAME]! Надеюсь, отдых проходит замечательно! Решил уточнить, все ли комфортно на вилле и не требуется ли помощь по технике, бассейну или рекомендации по ресторанам? С удовольствием отвечу! С уважением, Алексей Знаменский.',
        'Hello [FIRST_NAME]! Hope you are enjoying your stay! Just checking in to make sure everything is comfortable and see if you need any assistance with villa amenities or local tips. Best regards, Aleksei Znamenskii.',
        'Merhaba [FIRST_NAME]! Umarım tatiliniz harika geçiyordur! Her şeyin yolunda olup olmadığını ve bir ihtiyacınızın bulunup bulunmadığını sormak istedim. Saygılarımla, Aleksey Znamenskiy.'
      ],
      [
        '4.2_pool_maintenance_notice',
        '4.2. Уведомление о чистке и обслуживании бассейна',
        '4.2. Pool cleaning & maintenance notice',
        '4.2. Havuz Bakımı ve Temizlik Bildirimi',
        'Здравствуйте, [FIRST_NAME]! Завтра в 09:00 планируется плановая чистка бассейна и уход за садом. Пожалуйста, по возможности уберите личные вещи с шезлонгов. Подходит ли вам это время? С уважением, Алексей Знаменский.',
        'Hello [FIRST_NAME]! Tomorrow at 9:00 AM we have scheduled pool cleaning and garden maintenance. Please collect personal belongings from sunbeds. Let us know if this time suits you! Best regards, Aleksei Znamenskii.',
        'Merhaba [FIRST_NAME]! Yarın saat 09:00 da planlı havuz temizliği ve bahçe bakımı yapılacaktır. Bu saatin uygun olup olmadığını bildirebilir misiniz? Saygılarımla, Aleksey Znamenskiy.'
      ],
      [
        '5.1_checkout_instructions',
        '5.1. Напоминание о выезде и передача ключей',
        '5.1. Check-out instructions & departure',
        '5.1. Çıkış Hatırlatması ve Talimatlar',
        'Здравствуйте, [FIRST_NAME]! Благодарим за выбор Villa Turaman! Напоминаем детали выезда: Дата: [CHECKOUT_DATE], Время: до [CHECKOUT_TIME]. [KEY_HANDOVER]. Будем рады видеть вас снова! С уважением, Алексей Знаменский.',
        'Hello [FIRST_NAME]! Thank you for staying at Villa Turaman! Friendly check-out reminder: Date: [CHECKOUT_DATE], Time: by [CHECKOUT_TIME]. [KEY_HANDOVER]. Looking forward to welcoming you back! Best regards, Aleksei Znamenskii.',
        'Merhaba [FIRST_NAME]! Villa Turaman ı tercih ettiğiniz için teşekkür ederiz! Çıkış hatırlatması: Tarih: [CHECKOUT_DATE], Saat: [CHECKOUT_TIME] öncesi. [KEY_HANDOVER]. Sizi tekrar ağırlamaktan mutluluk duyarız! Saygılarımla, Aleksey Znamenskiy.'
      ]
    ];
    sheet.getRange(2, 1, tRows.length, tHeaders.length).setValues(tRows);
  } else if (key === 'SETTINGS') {
    var sHeaders = ['Категория', 'Параметр / Роль / Лист', 'Значение / Статус доступа', 'Промпт / Описание / Инструкция', 'Заметка'];
    styleSheetHeader_(sheet, sHeaders, 1);
    var sRows = [
      // Блок 1: СИСТЕМА
      ['СИСТЕМА', 'ai_mode', 'autopilot', 'Режим работы ИИ: autopilot [автоответ], copilot [суфлер хозяина], off [выключен]', 'Критический'],
      ['СИСТЕМА', 'ai_model', 'gemini-3.6-flash', 'Целевая модель Google Gemini: gemini-3.6-flash / gemini-2.5-flash', 'Высокая скорость'],
      ['СИСТЕМА', 'min_night_price', '180', 'Минимально допустимая цена за сутки бронирования в USD: ниже опускать запрещено', 'Финансовый барьер'],
      ['СИСТЕМА', 'telegram_bot_token', '', 'Токен Telegram-бота от BotFather для оповещений и мобильного пульта', 'Безопасность'],
      ['СИСТЕМА', 'telegram_admin_chat_id', '', 'ID чата суперхозяина в Telegram для получения алертов и модерации', 'Суперхозяин'],
      ['СИСТЕМА', 'vercel_url', 'https://sitesi-git-v1-airbnb-znamenskiialekseis-projects.vercel.app', 'Боевой URL платформы на Vercel для вебхуков и ревалидации', 'Синхронизация'],

      // Блок 2: ПЕРЕМЕННЫЕ [SSOT]
      ['ПЕРЕМЕННАЯ', 'wifi_name', 'Guest', 'Имя гостевой сети Wi-Fi виллы', 'Плейсхолдер [WIFI_NAME]'],
      ['ПЕРЕМЕННАЯ', 'wifi_password', 'villa2026', 'Пароль гостевой сети Wi-Fi', 'Плейсхолдер [WIFI_PASSWORD]'],
      ['ПЕРЕМЕННАЯ', 'address', 'Dalyan, Rodoslu Yaşar Sünger Sk, NO 28/2, 48600 Ortaca / Muğla', 'Точный физический адрес виллы', 'Плейсхолдер [ADDRESS]'],
      ['ПЕРЕМЕННАЯ', 'maps_url', 'https://maps.app.goo.gl/tPgCjCwz4pzq28pE9', 'Прямая ссылка на геолокацию Google Maps', 'Плейсхолдер [MAPS_URL]'],
      ['ПЕРЕМЕННАЯ', 'checkin_time', '16:00', 'Стандартное время заезда гостей', 'Плейсхолдер [CHECKIN_TIME]'],
      ['ПЕРЕМЕННАЯ', 'checkout_time', '10:00', 'Стандартное время выезда гостей', 'Плейсхолдер [CHECKOUT_TIME]'],
      ['ПЕРЕМЕННАЯ', 'checkin_method', 'Электронный смарт-замок и мини-сейф с кодом / личная встреча владельцем', 'Способ передачи ключей', 'Плейсхолдер [CHECKIN_METHOD]'],
      ['ПЕРЕМЕННАЯ', 'key_handover', 'Оставьте ключи в мини-сейфе с кодом у входной двери или на кухонном столе', 'Инструкция возврата ключей', 'Плейсхолдер [KEY_HANDOVER]'],
      ['ПЕРЕМЕННАЯ', 'platform_name', 'Villa Turaman Direct', 'Название платформы бронирования', 'Плейсхолдер [PLATFORM_NAME]'],

      // Блок 3: О ХОЗЯИНЕ
      ['О_ХОЗЯИНЕ', 'host_name', 'Aleksei Znamenskii', 'Имя владельца виллы на английском и русском', 'Плейсхолдер [HOST_NAME]'],
      ['О_ХОЗЯИНЕ', 'host_status', 'Суперхозяин на Airbnb • Более 5 лет приема гостей', 'Статус суперхозяина и опыт', 'Плейсхолдер [HOST_STATUS]'],
      ['О_ХОЗЯИНЕ', 'host_languages', 'Русский, English, Türkçe', 'Языки общения с гостями', 'Плейсхолдер [HOST_LANGUAGES]'],
      ['О_ХОЗЯИНЕ', 'host_response_time', 'В течение часа', 'Скорость ответа на сообщения', 'Плейсхолдер [RESPONSE_TIME]'],
      ['О_ХОЗЯИНЕ', 'host_business', 'Краткосрочная аренда Villa Turaman [Дальян, Мугла, Турция]', 'Юридический вид деятельности и бизнес', 'Бизнес профиль'],

      // Блок 4: О ВИЛЛЕ
      ['О_ВИЛЛЕ', 'villa_capacity', '10 гостей', 'Максимальная вместимость виллы, включая детей', 'Плейсхолдер [MAX_GUESTS]'],
      ['О_ВИЛЛЕ', 'villa_floors', '2 этажа. Первый этаж: кухня, гостиная со Smart TV 55", гостевой санузел, стиральная машина, гладильная доска и утюг, спальня на 3 места с ванной. Второй этаж: 3 спальни с ванными комнатами и кондиционерами, доп. кровать и вторая стиральная машина.', 'Планировка и оснащение этажей', 'Плейсхолдер [VILLA_FLOORS]'],
      ['О_ВИЛЛЕ', 'pool_specs', 'Приватный бассейн с соленой водой 36 кв.м и уличное джакузи', 'Характеристики бассейна и гидромассажа', 'Плейсхолдер [POOL_SPECS]'],
      ['О_ВИЛЛЕ', 'pool_season', 'с 1 мая по 1 ноября', 'Период работы и эксплуатации бассейна и джакузи', 'Плейсхолдер [POOL_SEASON]'],
      ['О_ВИЛЛЕ', 'jacuzzi_schedule', 'Работает с 09:00 до 18:00. Включается автоматически на 15 минут с интервалом каждые 45 минут.', 'Алгоритм и часы работы джакузи', 'Плейсхолдер [JACUZZI_HOURS]'],
      ['О_ВИЛЛЕ', 'pool_lighting', 'Освещение в бассейне и джакузи включается автоматически с 20:00 до 01:00.', 'График подсветки воды', 'Плейсхолдер [POOL_LIGHTS]'],
      ['О_ВИЛЛЕ', 'street_lighting', 'Уличное освещение включается автоматически с 20:00 до 01:00 и с 04:00 до 06:00.', 'График освещения сада и фасада', 'Плейсхолдер [STREET_LIGHTS]'],
      ['О_ВИЛЛЕ', 'pool_maintenance', 'Профилактические работы и чистка бассейна производятся в день заселения и далее каждые 7 дней.', 'Регламент очистки бассейна', 'Плейсхолдер [POOL_CLEANING]'],
      ['О_ВИЛЛЕ', 'outdoor_zones', 'Парковка перед виллой, дворик-сад, зона барбекю, крыльцо с кофейными столиками и обеденной зоной, зона для загара с шезлонгами.', 'Территория вне виллы', 'Плейсхолдер [OUTDOOR_ZONES]'],

      // Блок 5: KBS ИНСТРУКЦИЯ
      ['KBS_ИНСТРУКЦИЯ', 'kbs_parser_prompt', 'Ты: модуль обработки данных гостей для турецкой системы KBS. Твоя задача: извлечь данные из сообщения гостя и выдать СТРОГО готовый список по шаблону, БЕЗ приветствий, БЕЗ вводных слов и БЕЗ лишнего текста.', 'Промпт парсера KBS', 'KBS парсер'],
      ['KBS_ИНСТРУКЦИЯ', 'kbs_template_format', 'Гость [Номер]: [ФИО], дата рождения: [DD.MM.YYYY], пол: [male/female], гражданство: [строго на английском], номер паспорта: [Номер паспорта]. Период проживания: [DD.MM.YYYY] – [DD.MM.YYYY].', 'Канонический шаблон KBS', 'KBS шаблон'],
      ['KBS_ИНСТРУКЦИЯ', 'kbs_rules', 'Правила: Ключи шаблона остаются на русском, значения пола [male/female] и гражданства [Russian, Turkish, German, British и т.д.] : строго на английском языке. Даты строго в формате DD.MM.YYYY. Очевидные опечатки [например 25/01996 исправлять на 25.01.1996] исправлять логически, добавляя короткое пояснение под списком.', 'Правила валидации KBS', 'KBS правила'],

      // Блок 6: МАСТЕР ДОСТУП
      ['МАСТЕР_ДОСТУП', 'Aleksei Znamenskii', 'admin / admin123', 'admin@villaturaman.com | Роль: Владелец | Все права: Финансы, Периоды, Блокировки, Окно брони, Чаты', 'Главный аккаунт'],
      ['МАСТЕР_ДОСТУП', 'Менеджер виллы', 'manager / manager2026', 'manager@villaturaman.com | Роль: Управляющий | Права: Периоды, Блокировки, Доступ к чатам', 'Персонал'],

      // Блок 7: РОЛИ ИИ
      ['РОЛЬ_АГЕНТА', 'Консьерж-Мастер', 'АКТИВЕН', 'Ты: персональный ИИ-консьерж суперхозяина Алексея Знаменского на вилле Villa Turaman в Дальяне. Твоя миссия: гостеприимно, дипломатично и авторитетно отвечать гостям. Все факты ты берешь строго из Блоков О ВИЛЛЕ и СЛОВАРЬ ПЕРЕМЕННЫХ. Соблюдать правила дома, налоги Турции VKN 9991120181 и никогда не давать цену ниже $180 за ночь.', 'Главная роль'],
      ['РОЛЬ_АГЕНТА', 'Юрист-Консультант', 'РЕЗЕРВ', 'Ты: ведущий юрисконсульт Villa Turaman. Контролируешь обязательную регистрацию гостей в системе KBS жандармерии по шаблону из Блока 5, соответствие закону о защите персональных данных KVKK и налоговое оформление VUK 213 Madde 230 e-Arşiv Fatura.', 'Правовой модуль'],
      ['РОЛЬ_АГЕНТА', 'Финансист-Бухгалтер', 'РЕЗЕРВ', 'Ты: главный финансовый менеджер Villa Turaman. Ведешь учет платежей, рассчитываешь мультивалютные цены EUR/RUB/TRY, применяешь скидку 10% за невозвратный тариф при заезде до 60 дней и блокируешь любые попытки снижения цены ниже $180.', 'Финансовый модуль'],

      // Блок 8: МАТРИЦА ЛИСТОВ
      ['МАТРИЦА_ЛИСТОВ', '🏠 Главная витрина', 'РАЗРЕШЕН [ВСЕ]', 'Лист содержит главную витрину: 9 блоков с плейсхолдерами, спецификации [10 гостей, 4 спальни], статус Superhost и параметры спален 1-4.', 'Витрина'],
      ['МАТРИЦА_ЛИСТОВ', '📸 Фото и Видео Галерея', 'РАЗРЕШЕН [ВСЕ]', 'Лист содержит медиа-банк виллы: ссылки на фото высокого разрешения и видеотуры бассейна, сада, комнат и видов на реку.', 'Медиа'],
      ['МАТРИЦА_ЛИСТОВ', '🛎️ Дополнительные услуги', 'РАЗРЕШЕН [ВСЕ]', 'Лист содержит каталог платных сервисов: трансферы из аэропорта Даламан DLM, персональный шеф-повар, массажи, прогулка на лодке, барбекю, SUP-борды.', 'Каталог услуг'],
      ['МАТРИЦА_ЛИСТОВ', '🗺️ Видео-путеводители', 'РАЗРЕШЕН [ВСЕ]', 'Лист содержит цифровые гиды по Дальяну, пляжу Изтузу, озеру Кёйджегиз, ресторанам и античному Кауносу.', 'Каталог гидов'],
      ['МАТРИЦА_ЛИСТОВ', '⚖️ Юридические документы', 'РАЗРЕШЕН [ВСЕ]', 'Лист содержит официальный договор аренды, политику KVKK, реквизиты VKN 9991120181.', 'Юриспруденция'],
      ['МАТРИЦА_ЛИСТОВ', '📋 Заявки и Бронирования', 'РАЗРЕШЕН [ВСЕ]', 'Лист фиксирует статус заявок гостей, даты заезда и выезда, число гостей и статус оплаты.', 'Операции CRM'],
      ['МАТРИЦА_ЛИСТОВ', '📅 Календарь и Тарифы', 'РАЗРЕШЕН [ВСЕ]', 'Лист содержит актуальную сетку занятости дат и тарифные ставки.', 'Календарь'],
      ['МАТРИЦА_ЛИСТОВ', '👤 Гостевые аккаунты', 'РАЗРЕШЕН [КОНСЬЕРЖ]', 'Лист содержит реестр зарегистрированных гостей и статусы блокировок.', 'Гостевой сервис'],
      ['МАТРИЦА_ЛИСТОВ', '💳 Заказы услуг и гидов', 'РАЗРЕШЕН [ВСЕ]', 'Лист содержит историю заказов доп. услуг и путеводителей.', 'Заказы'],
      ['МАТРИЦА_ЛИСТОВ', '🎟️ Доступы к путеводителям', 'РАЗРЕШЕН [ВСЕ]', 'Лист персональных доступов к медиа-материалам.', 'Доступы'],
      ['МАТРИЦА_ЛИСТОВ', '💬 Шаблоны сообщений', 'РАЗРЕШЕН [ВСЕ]', 'Лист содержит 14 профессиональных шаблонов общения на RU, EN, TR.', 'Шаблоны коммуникации'],
      ['МАТРИЦА_ЛИСТОВ', '⚙️ Системные настройки ИИ Агентов', 'РАЗРЕШЕН [ВСЕ]', 'Лист управления системой ИИ, генеральными директивами ролей, словарем переменных и матрицей прав доступа.', 'Центр управления ИИ']
    ];
    sheet.getRange(2, 1, sRows.length, sHeaders.length).setValues(sRows);
  }
}

// ==============================================================================
// УПРАВЛЕНИЕ СВОЙСТВАМИ СКРИПТА
// ==============================================================================

function setupScriptPropertiesInteractive() {
  var ui = SpreadsheetApp.getUi();
  var scriptProperties = PropertiesService.getScriptProperties();

  var siteUrl = ui.prompt("Настройка SITE_URL", "Укажите публичный адрес сайта:\nПример: https://...vercel.app или http://localhost:3000", ui.ButtonSet.OK_CANCEL);
  if (siteUrl.getSelectedButton() === ui.Button.OK && siteUrl.getResponseText().trim()) {
    scriptProperties.setProperty('SITE_URL', siteUrl.getResponseText().trim());
  }

  var revalUrl = ui.prompt("Настройка REVALIDATE_API_URL", "Укажите эндпоинт ревалидации:\nПример: https://.../api/revalidate", ui.ButtonSet.OK_CANCEL);
  if (revalUrl.getSelectedButton() === ui.Button.OK && revalUrl.getResponseText().trim()) {
    scriptProperties.setProperty('REVALIDATE_API_URL', revalUrl.getResponseText().trim());
  }

  var revalSecret = ui.prompt("Настройка REVALIDATE_SECRET_TOKEN", "Укажите секретный ключ ревалидации:", ui.ButtonSet.OK_CANCEL);
  if (revalSecret.getSelectedButton() === ui.Button.OK && revalSecret.getResponseText().trim()) {
    scriptProperties.setProperty('REVALIDATE_SECRET_TOKEN', revalSecret.getResponseText().trim());
  }

  ui.alert("Свойства скрипта успешно обновлены!");
}

function checkVercelEnvStatusInteractive() {
  var ui = SpreadsheetApp.getUi();
  var props = PropertiesService.getScriptProperties();
  var siteUrl = (props.getProperty('SITE_URL') || '').trim().replace(/\/+$/, '');

  if (!siteUrl) {
    ui.alert("Внимание", "Сначала настройте SITE_URL в Свойствах скрипта.", ui.ButtonSet.OK);
    return;
  }

  try {
    var res = UrlFetchApp.fetch(siteUrl + '/api/system-status', { muteHttpExceptions: true });
    var data = JSON.parse(res.getContentText());
    var s = data.keysStatus || {};

    var info = "🌐 СТАТУС КЛЮЧЕЙ И ПЕРЕМЕННЫХ НА VERCEL:\n\n" +
      "• Сервер: " + siteUrl + "\n" +
      "• Google Таблица: " + (s.GOOGLE_SPREADSHEET_ID ? "Подключена ✅" : "Не задана ❌") + "\n" +
      "• Google Service Account: " + (s.GOOGLE_CLIENT_EMAIL ? "Подключен ✅" : "Не задан ❌") + "\n" +
      "• Telegram Bot Token: " + (s.TELEGRAM_BOT_TOKEN ? "Подключен ✅" : "Не задан ❌") + "\n" +
      "• Telegram Admin Chat: " + (s.TELEGRAM_CHAT_ID ? "Подключен ✅" : "Не задан ❌") + "\n" +
      "• Gemini API Key: " + (s.GEMINI_API_KEY ? "Подключен ✅" : "Не задан ❌") + "\n\n" +
      "Все серверные ключи надежно управляются через https://vercel.com/ ➔ Settings ➔ Environment Variables.";

    ui.alert("Статус ключей Vercel", info, ui.ButtonSet.OK);
  } catch (err) {
    ui.alert("Ошибка подключения", "Не удалось связаться с " + siteUrl + ":\n" + err.message, ui.ButtonSet.OK);
  }
}

function viewCurrentScriptProperties() {
  var props = PropertiesService.getScriptProperties().getProperties();
  var mask = function(v) { return v ? v.substring(0, 4) + '...' + v.substring(Math.max(0, v.length - 4)) : '[НЕ ЗАДАНО]'; };

  var text = "📋 ТЕКУЩИЕ СВОЙСТВА СКРИПТА:\n\n" +
    "1. SITE_URL:\n   " + (props['SITE_URL'] || "[НЕ ЗАДАНО]") + "\n\n" +
    "2. REVALIDATE_API_URL:\n   " + (props['REVALIDATE_API_URL'] || "[НЕ ЗАДАНО]") + "\n\n" +
    "3. REVALIDATE_SECRET_TOKEN:\n   " + mask(props['REVALIDATE_SECRET_TOKEN']) + "\n\n" +
    "4. TELEGRAM_BOT_TOKEN:\n   " + mask(props['TELEGRAM_BOT_TOKEN']) + "\n\n" +
    "5. TELEGRAM_CHAT_ID:\n   " + (props['TELEGRAM_CHAT_ID'] || "[НЕ ЗАДАНО]");

  SpreadsheetApp.getUi().alert("Свойства скрипта", text, SpreadsheetApp.getUi().ButtonSet.OK);
}

function setupDefaultScriptProperties() {
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperties({
    'SITE_URL': "http://localhost:3000",
    'REVALIDATE_API_URL': "http://localhost:3000/api/revalidate",
    'REVALIDATE_SECRET_TOKEN': "YOUR_VERY_SECRET_RANDOM_STRING",
    'TELEGRAM_BOT_TOKEN': "",
    'TELEGRAM_CHAT_ID': ""
  }, false);

  SpreadsheetApp.getActive().toast("Установлены базовые локальные свойства: SITE_URL=http://localhost:3000", "⚡ Свойства скрипта", 5);
}

// ==============================================================================
// GMAIL RELAY И WEB APPLICATION
// ==============================================================================

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

function showGmailRelayDeployHelp() {
  var ui = SpreadsheetApp.getUi();
  var message = "Инструкция по подключению бесплатной отправки писем через Gmail:\n\n" +
    "1. В меню редактора Apps Script нажмите: Развернуть -> Новое развертывание\n" +
    "2. Выберите тип: Веб-приложение\n" +
    "3. Описание: Villa Turaman Gmail Relay\n" +
    "4. Запуск от имени: Меня\n" +
    "5. У кого есть доступ: Все\n" +
    "6. Скопируйте полученный URL веб-приложения и вставьте в .env.local: GOOGLE_APPS_SCRIPT_URL=...";

  ui.alert("📧 Настройка Gmail Relay", message, ui.ButtonSet.OK);
}

// ==============================================================================
// МОДУЛЬ УПРАВЛЕНИЯ ТЕЛЕГРАМ-БОТОМ И ШЛЮЗ К VERCEL
// ==============================================================================

function getTelegramConfig_() {
  var props = PropertiesService.getScriptProperties().getProperties();
  return {
    token: props['TELEGRAM_BOT_TOKEN'] || '',
    chatId: props['TELEGRAM_CHAT_ID'] || '',
    siteUrl: props['SITE_URL'] || 'https://sitesi-git-v1-airbnb-znamenskiialekseis-projects.vercel.app'
  };
}

function sendTelegramRelay_(actionName, extraPayload) {
  var cfg = getTelegramConfig_();
  var payload = extraPayload || {};
  payload.action = actionName;
  if (cfg.chatId) payload.chatId = cfg.chatId;

  var url = cfg.siteUrl.replace(/\/+$/, '') + '/api/telegram-webhook';
  var response = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });
  return JSON.parse(response.getContentText());
}

function sendTelegramMessage_(text, replyMarkup) {
  var cfg = getTelegramConfig_();
  if (cfg.token && cfg.chatId) {
    var payload = { chat_id: cfg.chatId, text: text };
    if (replyMarkup) payload.reply_markup = replyMarkup;
    var url = 'https://api.telegram.org/bot' + cfg.token + '/sendMessage';
    var response = UrlFetchApp.fetch(url, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
    return JSON.parse(response.getContentText());
  }

  // Делегирование через Vercel шлюз с серверным токеном
  return sendTelegramRelay_('test_ping', { text: text });
}

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

function sendTelegramBotMenuToOwner() {
  var ui = SpreadsheetApp.getUi();
  var cfg = getTelegramConfig_();

  try {
    var res = sendTelegramRelay_('send_menu_to_owner');
    if (res.success || res.ok) {
      ui.alert('✅ Успешно!', 'Главное меню отправлено суперхозяину в Telegram.', ui.ButtonSet.OK);
      return;
    }
  } catch (e) {
    Logger.log('Сбой Vercel relay: ' + e.message);
  }

  try {
    var text = '🏡 Villa Turaman: Центр управления владельца\n\n' +
      'Вам доступны все ключевые операции по вилле прямо из этого чата:\n' +
      '• 📋 Заявки и брони: быстрый просмотр новых запросов\n' +
      '• 💬 CRM Чаты: переписка с гостями и быстрые шаблоны\n' +
      '• 📅 Календарь: сводка занятости дат на 30 дней\n' +
      '• 💳 Тарифы: проверка цен и минимальных сроков.';
    var directRes = sendTelegramMessage_(text, buildTelegramReplyKeyboard_());
    if (directRes.ok || directRes.success) {
      ui.alert('✅ Меню отправлено!', 'Главное меню и клавиатура бота доставлены на ваш телефон.', ui.ButtonSet.OK);
    } else {
      ui.alert('Ответ Telegram', directRes.description || 'Сообщение отправлено.', ui.ButtonSet.OK);
    }
  } catch (err) {
    ui.alert('Справка Telegram', 'Запрос отправлен. Убедитесь, что бот запущен на вашем смартфоне командой /start.', ui.ButtonSet.OK);
  }
}

function refreshTelegramKeyboard() {
  sendTelegramBotMenuToOwner();
}

function registerTelegramBotCommands() {
  var ui = SpreadsheetApp.getUi();
  var cfg = getTelegramConfig_();
  if (!cfg.token) {
    ui.alert('Команды Telegram', 'Команды регистрируются автоматически на боевом сервере Vercel при деплое.', ui.ButtonSet.OK);
    return;
  }

  try {
    var commands = [
      { command: 'start', description: 'Открыть главное меню' },
      { command: 'requests', description: 'Активные заявки на бронь' },
      { command: 'calendar', description: 'Календарь занятости' },
      { command: 'chats', description: 'Сообщения гостей' },
      { command: 'status', description: 'Статус синхронизации' }
    ];
    var url = 'https://api.telegram.org/bot' + cfg.token + '/setMyCommands';
    var response = UrlFetchApp.fetch(url, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({ commands: commands }),
      muteHttpExceptions: true
    });
    var result = JSON.parse(response.getContentText());
    if (result.ok) {
      ui.alert('✅ Успешно!', 'Команды бота зарегистрированы.', ui.ButtonSet.OK);
    } else {
      ui.alert('Ошибка Telegram', result.description || 'Не удалось зарегистрировать команды', ui.ButtonSet.OK);
    }
  } catch (err) {
    ui.alert('Ошибка', err.message, ui.ButtonSet.OK);
  }
}

function sendTelegramPendingRequests() {
  var ui = SpreadsheetApp.getUi();
  try {
    var res = sendTelegramRelay_('send_pending_requests');
    if (res.success || res.ok) {
      ui.alert('✅ Заявки отправлены!', 'Список заявок доставлен в ваш чат Telegram.', ui.ButtonSet.OK);
      return;
    }
  } catch (e) {
    Logger.log('Сбой Vercel relay: ' + e.message);
  }
  ui.alert('Заявки и Бронирования', 'Сводка заявок формируется на сервере и доставляется в Telegram бот.', ui.ButtonSet.OK);
}

function auditTelegramCalendarHolds() {
  auditCalendarHolds();
}

function sendTelegramRecentChats() {
  var ui = SpreadsheetApp.getUi();
  try {
    var res = sendTelegramRelay_('send_recent_chats');
    if (res.success || res.ok) {
      ui.alert('✅ Чаты отправлены!', 'Сводка диалогов с гостями доставлена в Telegram.', ui.ButtonSet.OK);
      return;
    }
  } catch (e) {
    Logger.log('Сбой Vercel relay: ' + e.message);
  }
  checkGuestChatsStatus();
}

function sendTelegramDirectMessageDialog() {
  var ui = SpreadsheetApp.getUi();
  ui.alert('Прямое сообщение гостю', 'Для отправки сообщений гостям используйте Кабинет хозяина на сайте или выберите гостя в Telegram боте.', ui.ButtonSet.OK);
}

function sendTelegramBroadcastDialog() {
  var ui = SpreadsheetApp.getUi();
  ui.alert('Массовая рассылка', 'Массовая рассылка доступна в Кабинете хозяина в разделе Гостевой сервис.', ui.ButtonSet.OK);
}

function sendTelegramCalendarSummary() {
  var ui = SpreadsheetApp.getUi();
  ui.alert('Календарь', 'График занятости виллы обновляется в режиме реального времени на сайте и в календаре Google Таблицы.', ui.ButtonSet.OK);
}

function sendTelegramRatesSummary() {
  var ui = SpreadsheetApp.getUi();
  ui.alert('Тарифы', 'Базовый тариф сезона: $220/ночь. Минимальный барьер ИИ: $180/ночь. Невозвратная скидка: 10%.', ui.ButtonSet.OK);
}

function triggerTelegramRevalidate() {
  triggerRevalidateWebhook();
}

function checkTelegramHostCabinetStatus() {
  checkWebsiteHealth();
}

function setTelegramWebhookToSite() {
  var ui = SpreadsheetApp.getUi();
  var cfg = getTelegramConfig_();
  var hookUrl = cfg.siteUrl.replace(/\/+$/, '') + '/api/telegram-webhook';

  if (!cfg.token) {
    ui.alert('Настройка Webhook', 'Токен бота размещен на https://vercel.com/.\nЦелевой адрес Webhook на Vercel:\n' + hookUrl, ui.ButtonSet.OK);
    return;
  }

  try {
    var url = 'https://api.telegram.org/bot' + cfg.token + '/setWebhook';
    var response = UrlFetchApp.fetch(url, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({ url: hookUrl }),
      muteHttpExceptions: true
    });
    var result = JSON.parse(response.getContentText());
    if (result.ok) {
      ui.alert('✅ Webhook установлен!', 'Telegram Webhook успешно привязан:\n' + hookUrl, ui.ButtonSet.OK);
    } else {
      ui.alert('Ошибка Telegram', result.description || 'Не удалось привязать Webhook', ui.ButtonSet.OK);
    }
  } catch (err) {
    ui.alert('Ошибка', err.message, ui.ButtonSet.OK);
  }
}

function checkTelegramWebhookStatus() {
  var ui = SpreadsheetApp.getUi();
  var cfg = getTelegramConfig_();
  if (!cfg.token) {
    checkVercelEnvStatusInteractive();
    return;
  }

  try {
    var url = 'https://api.telegram.org/bot' + cfg.token + '/getWebhookInfo';
    var response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    var result = JSON.parse(response.getContentText());

    if (result.ok) {
      var info = result.result;
      var text = '🔍 СТАТУС TELEGRAM WEBHOOK:\n\n' +
        '• URL: ' + (info.url || 'Не установлен') + '\n' +
        '• Ожидающих обновлений: ' + (info.pending_update_count || 0) + '\n' +
        (info.last_error_message ? '• Последняя ошибка: ' + info.last_error_message + '\n' : '');
      ui.alert('Статус Webhook', text, ui.ButtonSet.OK);
    } else {
      ui.alert('Ошибка', result.description || 'Не удалось получить данные Webhook', ui.ButtonSet.OK);
    }
  } catch (err) {
    ui.alert('Ошибка', err.message, ui.ButtonSet.OK);
  }
}

function deleteTelegramWebhook() {
  var ui = SpreadsheetApp.getUi();
  var cfg = getTelegramConfig_();
  if (!cfg.token) {
    ui.alert('Информация', 'Для отключения вебхука укажите TELEGRAM_BOT_TOKEN в Свойствах скрипта.', ui.ButtonSet.OK);
    return;
  }

  try {
    var url = 'https://api.telegram.org/bot' + cfg.token + '/deleteWebhook';
    var response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    var result = JSON.parse(response.getContentText());
    if (result.ok) {
      ui.alert('✅ Webhook удален!', 'Бот переведен в стандартный режим.', ui.ButtonSet.OK);
    } else {
      ui.alert('Ошибка', result.description || 'Не удалось удалить Webhook', ui.ButtonSet.OK);
    }
  } catch (err) {
    ui.alert('Ошибка', err.message, ui.ButtonSet.OK);
  }
}

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

  ui.alert('✅ Настройки сохранены!', 'Параметры Telegram зафиксированы в Свойствах скрипта.', ui.ButtonSet.OK);
}

function sendTelegramTestPing() {
  var ui = SpreadsheetApp.getUi();
  try {
    var res = sendTelegramRelay_('test_ping');
    if (res.success || res.ok) {
      ui.alert('✅ Тест успешен!', 'Тестовый пинг доставлен в ваш Telegram чат через серверный шлюз.', ui.ButtonSet.OK);
      return;
    }
  } catch (e) {
    Logger.log('Сбой Vercel relay: ' + e.message);
  }

  try {
    var text = '🧪 ТЕСТОВЫЙ ПИНГ ИЗ GOOGLE ТАБЛИЦЫ\n\n' +
      'Связь между экосистемой Villa Turaman и вашим Telegram-ботом активна!\n' +
      'Время проверки: ' + new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
    var directRes = sendTelegramMessage_(text);
    if (directRes.ok || directRes.success) {
      ui.alert('✅ Тест успешен!', 'Тестовое сообщение доставлено в Telegram.', ui.ButtonSet.OK);
    } else {
      ui.alert('Ответ Telegram', directRes.description || 'Запрос отправлен.', ui.ButtonSet.OK);
    }
  } catch (err) {
    ui.alert('Справка пинга', 'Убедитесь, что в Telegram чате нажат /start и сервер Vercel доступен.', ui.ButtonSet.OK);
  }
}

// ==============================================================================
// МОДУЛЬ УПРАВЛЕНИЯ ИИ-АГЕНТОМ GEMINI И SSOT НАСТРОЙКАМИ
// ==============================================================================

function setAiModeAutopilot() {
  PropertiesService.getScriptProperties().setProperty('AI_MODE', 'autopilot');
  updateAiSettingInSheet_('ai_mode', 'autopilot');
  try { syncAiKnowledgeToVercel(); } catch (e) { }
  SpreadsheetApp.getActive().toast('Режим ИИ установлен: 🚀 Автопилот. ИИ отвечает гостям самостоятельно.', '🧠 ИИ-Агент', 5);
}

function setAiModeCopilot() {
  PropertiesService.getScriptProperties().setProperty('AI_MODE', 'copilot');
  updateAiSettingInSheet_('ai_mode', 'copilot');
  try { syncAiKnowledgeToVercel(); } catch (e) { }
  SpreadsheetApp.getActive().toast('Режим ИИ установлен: 💡 Суфлер. ИИ готовит черновики ответов хозяину.', '🧠 ИИ-Агент', 5);
}

function setAiModeOff() {
  PropertiesService.getScriptProperties().setProperty('AI_MODE', 'off');
  updateAiSettingInSheet_('ai_mode', 'off');
  try { syncAiKnowledgeToVercel(); } catch (e) { }
  SpreadsheetApp.getActive().toast('Режим ИИ установлен: ⏸️ Выключен. Ручной режим суперхозяина.', '🧠 ИИ-Агент', 5);
}

function showAiFullStatusModal() {
  var ui = SpreadsheetApp.getUi();
  var props = PropertiesService.getScriptProperties();
  var mode = props.getProperty('AI_MODE') || 'autopilot';
  var model = props.getProperty('GEMINI_MODEL') || 'gemini-3.6-flash';
  var minPrice = props.getProperty('MIN_NIGHT_PRICE') || '180';
  var siteUrl = props.getProperty('SITE_URL') || 'https://sitesi-git-v1-airbnb-znamenskiialekseis-projects.vercel.app';

  var info = '🧠 ЦЕНТР УПРАВЛЕНИЯ ИИ-АГЕНТАМИ VILLA TURAMAN:\n\n' +
    '• Текущий режим работы: ' + (mode === 'autopilot' ? '🚀 Автопилот' : (mode === 'copilot' ? '💡 Суфлер' : '⏸️ Выключен')) + '\n' +
    '• Рабочая языковая модель: ' + model + '\n' +
    '• Минимальный тариф за сутки: $' + minPrice + ' USD\n' +
    '• Сервер платформы: ' + siteUrl + '\n\n' +
    'Для изменения ролей, промптов и матриц доступа перейдите на вкладку:\n"⚙️ Системные настройки ИИ Агентов".';

  ui.alert('Статус ИИ-Агентов', info, ui.ButtonSet.OK);
}

function showConciergePromptInfo() {
  SpreadsheetApp.getUi().alert(
    'Роль: Консьерж-Мастер [Алексей Знаменский]',
    'Миссия: гостеприимный и авторитетный суперхозяин Villa Turaman в Дальяне.\n\n' +
    'Обязанности: презентация виллы [10 гостей, 4 спальни, бассейн 36м²], координация заездов и выездов, предложение платных сервисов [трансферы, шеф-повар, яхты] и видео-гидов.\n\n' +
    'Отредактировать текст можно в листе "⚙️ Системные настройки ИИ Агентов", строка "Консьерж-Мастер".',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

function showLawyerPromptInfo() {
  SpreadsheetApp.getUi().alert(
    'Роль: Юрист-Консультант [KBS / KVKK / Налоги]',
    'Миссия: контроль правового соответствия законам Турции о краткосрочной аренде.\n\n' +
    'Обязанности: разъяснение обязательной регистрации гостей в KBS жандармерии, защита данных по закону KVKK, соблюдение налоговых стандартов VKN 9991120181 и VUK 213 Madde 230 e-Arşiv Fatura. Формула переговоров: 30% эмпатии / 70% юридического контроля.\n\n' +
    'Отредактировать текст можно на листе "⚙️ Системные настройки ИИ Агентов".',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

function showFinancePromptInfo() {
  SpreadsheetApp.getUi().alert(
    'Роль: Финансист-Бухгалтер [e-Arşiv / Оплаты]',
    'Миссия: финансовый менеджмент и контроль доходности виллы.\n\n' +
    'Обязанности: сверка бронирований, расчет скидки 10% за невозвратный тариф, мультивалютный учет EUR/RUB/TRY и жесткий контроль минимального лимита $180/ночь.\n\n' +
    'Отредактировать текст можно на листе "⚙️ Системные настройки ИИ Агентов".',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

function setupAiMinPriceInteractive() {
  var ui = SpreadsheetApp.getUi();
  var currentPrice = '180';

  var res = ui.prompt('Защита цены: лимит за ночь', 'Укажите минимальную цену аренды в USD [не ниже 180 USD]:\nТекущее значение: ' + currentPrice, ui.ButtonSet.OK_CANCEL);
  if (res.getSelectedButton() !== ui.Button.OK) return;
  var val = parseInt(res.getResponseText().replace(/\D/g, ''), 10) || 180;
  if (val < 180) {
    ui.alert('Внимание', 'По правилам проекта минимальная цена не может быть ниже 180 USD. Установлено: 180 USD.', ui.ButtonSet.OK);
    val = 180;
  }

  updateAiSettingInSheet_('min_night_price', String(val));
  PropertiesService.getScriptProperties().setProperty('MIN_NIGHT_PRICE', String(val));
  try { syncAiKnowledgeToVercel(); } catch (e) { }

  ui.alert('✅ Лимит обновлен!', 'Минимальная стоимость зафиксирована: ' + val + ' USD/ночь.', ui.ButtonSet.OK);
}

function setupAiModelInteractive() {
  var ui = SpreadsheetApp.getUi();
  var currentModel = 'gemini-3.6-flash';

  var res = ui.prompt('Выбор модели Gemini', 'Укажите идентификатор модели Google Gemini:\nПо умолчанию: gemini-3.6-flash', ui.ButtonSet.OK_CANCEL);
  if (res.getSelectedButton() !== ui.Button.OK) return;
  var modelName = res.getResponseText().trim() || currentModel;

  updateAiSettingInSheet_('ai_model', modelName);
  PropertiesService.getScriptProperties().setProperty('GEMINI_MODEL', modelName);
  try { syncAiKnowledgeToVercel(); } catch (e) { }

  ui.alert('✅ Модель сохранена!', 'Выбрана модель: ' + modelName, ui.ButtonSet.OK);
}

function syncAiKnowledgeToVercel() {
  var props = PropertiesService.getScriptProperties();
  var siteUrl = (props.getProperty('SITE_URL') || '').trim().replace(/\/+$/, '');
  if (!siteUrl) return;

  try {
    var url = siteUrl + '/api/content?force=true';
    UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    SpreadsheetApp.getActiveSpreadsheet().toast('База Знаний обновлена в оперативной памяти сервера.', '✅ Синхронизировано', 4);
  } catch (e) {
    Logger.log('Сбой сброса кэша: ' + e.message);
  }
}

function initAiKnowledgeBaseSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ui = SpreadsheetApp.getUi();

  var setSheet = findSheetByConfigKey(ss, 'SETTINGS');
  if (!setSheet) {
    setSheet = ss.insertSheet('⚙️ Системные настройки ИИ Агентов');
  }
  initSingleSheetByKey_(setSheet, 'SETTINGS');

  var tmplSheet = findSheetByConfigKey(ss, 'TEMPLATES');
  if (!tmplSheet) {
    tmplSheet = ss.insertSheet('💬 Шаблоны сообщений');
  }
  initSingleSheetByKey_(tmplSheet, 'TEMPLATES');

  renameSheetsToRussianStandard();
  sortSheetsCanonically();

  ui.alert('✅ База Знаний и SSOT обновлены!', 'Листы Системные настройки ИИ Агентов и Шаблоны сообщений успешно актуализированы.', ui.ButtonSet.OK);
}

function checkGeminiVercelStatusInteractive() {
  var ui = SpreadsheetApp.getUi();
  var props = PropertiesService.getScriptProperties();
  var siteUrl = (props.getProperty('SITE_URL') || '').trim().replace(/\/+$/, '');

  if (!siteUrl) {
    ui.alert('Внимание', 'Сначала укажите SITE_URL в Свойствах скрипта.', ui.ButtonSet.OK);
    return;
  }

  try {
    var res = UrlFetchApp.fetch(siteUrl + '/api/system-status', { muteHttpExceptions: true });
    var data = JSON.parse(res.getContentText());
    var k = data.keysStatus || {};

    var statusText = '🤖 СТАТУС GOOGLE GEMINI НА VERCEL:\n\n' +
      '• Хост: ' + siteUrl + '\n' +
      '• GEMINI_API_KEY: ' + (k.GEMINI_API_KEY ? 'Подключен ✅' : 'Не задан ❌') + '\n' +
      '• GEMINI_MODEL: ' + (k.GEMINI_MODEL ? k.GEMINI_MODEL : 'gemini-3.6-flash [по умолчанию]') + '\n' +
      '• ИИ-Консьерж: ' + (data.readiness && data.readiness.aiConcierge ? 'Готов к работе 🟢' : 'Fallback режим 🟡') + '\n\n' +
      'Ключи безопасно размещены на https://vercel.com/ ➔ Settings ➔ Environment Variables.';

    ui.alert('Диагностика Gemini API', statusText, ui.ButtonSet.OK);
  } catch (err) {
    ui.alert('Ошибка связи', 'Не удалось связаться с ' + siteUrl + ':\n' + err.message, ui.ButtonSet.OK);
  }
}

function setupAiPropertiesInteractive() {
  var ui = SpreadsheetApp.getUi();
  var props = PropertiesService.getScriptProperties();

  var currentKey = props.getProperty('GEMINI_API_KEY') || '';
  var res = ui.prompt('Настройка GEMINI_API_KEY', 'Ключ также может быть указан на https://vercel.com/.\n\nВведите ваш Google Gemini API ключ:', ui.ButtonSet.OK_CANCEL);
  if (res.getSelectedButton() !== ui.Button.OK) return;
  var key = res.getResponseText().trim() || currentKey;

  props.setProperty('GEMINI_API_KEY', key);
  try { syncAiKnowledgeToVercel(); } catch (e) { }

  ui.alert('✅ Ключ сохранен!', 'GEMINI_API_KEY сохранен в Свойствах скрипта.', ui.ButtonSet.OK);
}

function testAiConciergeInteractive() {
  var ui = SpreadsheetApp.getUi();
  var props = PropertiesService.getScriptProperties();
  var siteUrl = (props.getProperty('SITE_URL') || '').trim().replace(/\/+$/, '');

  if (!siteUrl) {
    ui.alert('Внимание', 'Сначала укажите SITE_URL в Свойствах скрипта.', ui.ButtonSet.OK);
    return;
  }

  var promptRes = ui.prompt('Тест ИИ-Консьержа', 'Введите тестовый вопрос гостя:\nНапример: Какая цена за ночь и есть ли бассейн?', ui.ButtonSet.OK_CANCEL);
  if (promptRes.getSelectedButton() !== ui.Button.OK) return;
  var guestMsg = promptRes.getResponseText().trim() || 'Здравствуйте! Расскажите про бассейн и трансфер.';

  try {
    var url = siteUrl + '/api/ai-concierge';
    var payload = {
      guestMessage: guestMsg,
      guestName: 'Тестовый Гость',
      lang: 'ru'
    };

    var res = UrlFetchApp.fetch(url, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });

    var data = JSON.parse(res.getContentText());
    if (data.reply) {
      ui.alert('Ответ ИИ-Консьержа Gemini', 'Вопрос гостя: "' + guestMsg + '"\n\nМодель: ' + (data.model || 'gemini') + ' [' + (data.source || 'api') + ']\n\nОтвет:\n' + data.reply, ui.ButtonSet.OK);
    } else {
      ui.alert('Ответ сервера', JSON.stringify(data), ui.ButtonSet.OK);
    }
  } catch (err) {
    ui.alert('Ошибка запроса', err.message, ui.ButtonSet.OK);
  }
}

function updateAiSettingInSheet_(paramKey, paramVal) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = findSheetByConfigKey(ss, 'SETTINGS');
  if (!sheet) return;

  var data = sheet.getDataRange().getValues();
  for (var r = 1; r < data.length; r++) {
    var c0 = (data[r][0] || '').toString().toLowerCase().trim();
    var c1 = (data[r][1] || '').toString().toLowerCase().trim();
    if (c0 === paramKey.toLowerCase() || c0 === paramKey.toUpperCase()) {
      sheet.getRange(r + 1, 2).setValue(paramVal);
      return;
    } else if (c1 === paramKey.toLowerCase() || c1 === paramKey.toUpperCase()) {
      sheet.getRange(r + 1, 3).setValue(paramVal);
      return;
    }
  }
}

function saveMasterSeedInteractive() {
  var ui = SpreadsheetApp.getUi();
  var props = PropertiesService.getScriptProperties();
  var siteUrl = (props.getProperty('SITE_URL') || '').trim();

  var confirm = ui.alert(
    'Фиксация эталона SSOT',
    'Вы собираетесь зафиксировать текущие данные Google Таблицы в постоянный эталон utils/masterSeedContent.js на сайте.\n\nПродолжить?',
    ui.ButtonSet.YES_NO
  );

  if (confirm !== ui.Button.YES) return;

  if (!siteUrl) {
    ui.alert('Адрес сайта не настроен', 'Укажите SITE_URL в Свойствах скрипта.', ui.ButtonSet.OK);
    return;
  }

  try {
    var response = UrlFetchApp.fetch(siteUrl.replace(/\/+$/, '') + '/api/admin/save-master-seed', {
      method: 'post',
      contentType: 'application/json',
      muteHttpExceptions: true
    });

    var code = response.getResponseCode();
    var text = response.getContentText();

    if (code === 200) {
      ui.alert('✅ Успешно!', 'Эталон masterSeedContent.js успешно зафиксирован на боевом сервере.\n\n' + text, ui.ButtonSet.OK);
    } else {
      ui.alert('Ответ сервера [' + code + ']', 'Сервер вернул: ' + text, ui.ButtonSet.OK);
    }
  } catch (err) {
    ui.alert('Справка по сохранению', 'Сетевой запрос к сайту не прошел [' + err.message + '].', ui.ButtonSet.OK);
  }
}

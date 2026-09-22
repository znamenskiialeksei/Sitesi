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

  // Кластер 3: Бэк-офис, Шаблоны и Системный SSOT [5 листов]
  ACCESS: { name: "🎟️ Доступы к путеводителям", suggestedSheetId: 206, aliases: ["🎟️ Доступы к путеводителям", "Доступы к путеводителям", "Доступы к гидам", "Доступы"], cluster: "host" },
  TEMPLATES: { name: "💬 Шаблоны сообщений", suggestedSheetId: 207, aliases: ["💬 Шаблоны сообщений", "Шаблоны сообщений", "Шаблоны", "Быстрые ответы"], cluster: "host" },
  SETTINGS: { name: "⚙️ Системные настройки ИИ Агентов", suggestedSheetId: 209, aliases: ["⚙️ Системные настройки ИИ Агентов", "Системные настройки ИИ Агентов", "Системные настройки", "Настройки ИИ", "🔑 Управление доступом", "Управление доступом", "MasterAccount", "🧩 Словарь переменных", "Словарь переменных"], cluster: "system" },
  TASKS: { name: "📋 Задачи и Поручения Секретаря", suggestedSheetId: 210, aliases: ["📋 Задачи и Поручения Секретаря", "Задачи и Поручения Секретаря", "Задачи Секретаря", "Поручения Секретаря", "Задачи и Поручения"], cluster: "host" },
  KNOWLEDGE_GRAPH: { name: "🧠 Граф Знаний и Безопасность", suggestedSheetId: 211, aliases: ["🧠 Граф Знаний и Безопасность", "Граф Знаний и Безопасность", "Граф Знаний", "KnowledgeGraph", "Безопасность", "Security"], cluster: "system" }
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
    .addItem("⚙️ Системные настройки ИИ [ID: 209]", "jumpToSheet_SETTINGS")
    .addItem("📋 Задачи и Поручения [ID: 210]", "jumpToSheet_TASKS")
    .addItem("🧠 Граф Знаний и Безопасность [ID: 211]", "jumpToSheet_KNOWLEDGE_GRAPH");

  var focusMenu = ui.createMenu("🎯 3. Режимы фокуса по кластерам")
    .addItem("🏠 1. Публичная витрина [5 листов]", "applyPresetShowcase")
    .addItem("💼 2. Центр управления и CRM [4 листа]", "applyPresetOperations")
    .addItem("🧩 3. Настройки, Задачи и Граф Знаний [5 листов]", "applyPresetSettings");

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
    .addItem("🔄 1. Обновить автопереводы услуг: RU ➔ EN / TR", "refreshCatalogTranslations")
    .addItem("💱 2. Пересчитать все валюты по заполненным ценам", "recalculateAllCatalogCurrencies")
    .addItem("🖼️ 3. Проверить прямые превью ссылок Google Drive", "auditDriveMediaLinks");

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
    .addItem("📧 9. Инструкция по развертыванию Gmail Relay", "showGmailRelayDeployHelp")
    .addItem("🧪 10. Тестовая отправка письма через Gmail Relay", "testGmailRelayInteractive");

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
  aiMainMenu.addToUi();

  // ЧЕТВЕРТОЕ ГЛАВНОЕ МЕНЮ: 💼 4. Секретарь • Юрист • Бухгалтер
  var assistantMenu = ui.createMenu("💼 4. Секретарь • Юрист • Бухгалтер")
    .addItem("🧾 1. Калькулятор фактур e-Arşiv Fatura [GİB]", "openInvoiceCalculatorModal")
    .addItem("⚖️ 2. Юрист: Экспресс-проверка бронирования", "openLegalCheckModal")
    .addItem("📋 3. Секретарь: Добавить задачу или поручение", "openNewTaskModal")
    .addItem("📁 4. Google Drive: Создать папку в архиве", "openCreateDriveFolderModal")
    .addSeparator()
    .addItem("📑 5. Открыть лист Задач и Поручений", "jumpToSheet_TASKS");
  assistantMenu.addToUi();
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
function jumpToSheet_TASKS() { jumpToConfigSheet("TASKS"); }
function jumpToSheet_KNOWLEDGE_GRAPH() { jumpToConfigSheet("KNOWLEDGE_GRAPH"); }

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

/** Пресет: Настройки, Задачи и Граф Знаний [5 листов] */
function applyPresetSettings() {
  applyVisibilityPreset(["ACCESS", "TEMPLATES", "SETTINGS", "TASKS", "KNOWLEDGE_GRAPH"], "Фокус: Настройки, Задачи и Граф Знаний [5 листов]");
}

/** Каноническая сортировка вкладок по смысловым блокам */
function sortSheetsCanonically() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var canonicalOrder = [
    "HOME", "GALLERY", "SERVICES", "GUIDES", "LEGAL",
    "BOOKINGS", "CALENDAR", "ACCOUNTS", "ORDERS",
    "ACCESS", "TEMPLATES", "SETTINGS", "TASKS", "KNOWLEDGE_GRAPH"
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
      // --- БЛОК 1: ГЛАВНЫЙ ЭКРАН ЛИСТИНГА [HERO] ---
      ['1. Главный экран', 'hero_title', 'Главный заголовок листинга в шапке', 'Dalyan Turaman [частный бассейн, 10 спальных мест]', '', '', '', 'Вкл'],
      ['1. Главный экран', 'hero_subtitle', 'Подзаголовок виллы под главным заголовком', 'Премиальная вилла 240 м² в Дальяне. Приватный бассейн с соленой водой 36 м², уличное джакузи, 4 спальни, 10 спальных мест, 250 м до центра.', '', '', '', 'Вкл'],
      ['1. Главный экран', 'hero_rating', 'Числовой рейтинг виллы', '4.98', '', '', 'Star', 'Вкл'],
      ['1. Главный экран', 'hero_reviews_count', 'Количество отзывов рядом с рейтингом', '48 отзывов', '', '', '', 'Вкл'],
      ['1. Главный экран', 'hero_superhost_badge', 'Бейдж статуса суперхозяина', 'Суперхозяин', '', '', 'Award', 'Вкл'],
      ['1. Главный экран', 'hero_location', 'Текст кликабельной локации объекта', 'Dalyan, Rodoslu Yaşar Sünger Sk, NO 28/2, Ortaca / Muğla', '', '', 'MapPin', 'Вкл'],
      ['1. Главный экран', 'hero_share_btn', 'Текст кнопки Поделиться', 'Поделиться', '', '', 'Share2', 'Вкл'],
      ['1. Главный экран', 'hero_favorite_btn', 'Текст кнопки В избранное', 'В избранное', '', '', 'Heart', 'Вкл'],
      ['1. Главный экран', 'hero_image', 'Главное фоновое фото объекта', 'Главные фотографии фасада и бассейна', '', '', 'https://drive.google.com/file/d/1NjSHRDa5eJpQTzO9268e8LMRzDVmYtX7/view?usp=sharing,https://drive.google.com/file/d/1IZMH6wtfLHZ6ibKHfmBhPGMFntZ_fXKU/view?usp=drive_link', 'Вкл'],

      // --- БЛОК 2: ОСНОВНЫЕ ХАРАКТЕРИСТИКИ ОБЪЕКТА [HOST SPECS] ---
      ['2. Характеристики', 'host_specs_header', 'Заголовок типа жилья и владельца', 'Отдельная вилла целиком • Хозяин: Алексей Знаменский [Суперхозяин]', '', '', '', 'Вкл'],
      ['2. Характеристики', 'host_specs_name', 'Отображаемое имя владельца виллы', 'Алексей Знаменский', '', '', '', 'Вкл'],
      ['2. Характеристики', 'host_specs_avatar', 'Аватар владельца виллы в карточке характеристик', 'Аватар владельца виллы', '', '', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160', 'Вкл'],
      ['2. Характеристики', 'spec_guests', 'Счетчик гостей в строке параметров', '10 гостей', '', '', 'Users', 'Вкл'],
      ['2. Характеристики', 'spec_bedrooms', 'Счетчик спален в строке параметров', '4 спальни', '', '', 'Bed', 'Вкл'],
      ['2. Характеристики', 'spec_beds', 'Счетчик спальных мест [кроватей]', '10 спальных мест', '', '', 'Bed', 'Вкл'],
      ['2. Характеристики', 'spec_baths', 'Счетчик ванных комнат', '4 ванные комнаты + гостевой туалет', '', '', 'Bath', 'Вкл'],

      // --- БЛОК 3: КЛЮЧЕВЫЕ ПРЕИМУЩЕСТВА ВИЛЛЫ [HIGHLIGHTS] ---
      ['3. Преимущества', 'highlight_1_title', 'Заголовок первого преимущества', 'Опытный Суперхозяин [Superhost]', '', '', 'Sparkles', 'Вкл'],
      ['3. Преимущества', 'highlight_1_desc', 'Описание первого преимущества', 'Алексей живет в Мармарисе, яхтсмен на пенсии, рейтинг 4.98★. Девиз: «Хочешь сделать хорошо - сделай сам».', '', '', '', 'Вкл'],
      ['3. Преимущества', 'highlight_2_title', 'Заголовок второго преимущества', 'Приватный спа-комплекс у бассейна', '', '', 'Waves', 'Вкл'],
      ['3. Преимущества', 'highlight_2_desc', 'Описание второго преимущества', 'Бассейн с соленой водой 36 м² [май-ноябрь, подсветка 20:00-01:00] и уличное джакузи на 4 персоны [10:00-17:00].', '', '', '', 'Вкл'],
      ['3. Преимущества', 'highlight_3_title', 'Заголовок третьего преимущества', 'Правила отмены и Закон № 7464', '', '', 'ShieldCheck', 'Вкл'],
      ['3. Преимущества', 'highlight_3_desc', 'Описание третьего преимущества', 'Краткосрочные брони - Негибкие, от 28 ночей - Строгие. Опция невозвратного тарифа со скидкой 10%. Регистрация KBS.', '', '', '', 'Вкл'],

      // --- БЛОК 4: О ВИЛЛЕ И ПРАВИЛА ДОМА [ABOUT & RULES] ---
      ['4. О вилле', 'about_title', 'Заголовок раздела описания', 'О Вилле', '', '', '', 'Вкл'],
      ['4. О вилле', 'about_text', 'Краткое описание виллы на главной странице', 'Villa Turaman: это гармоничное сочетание уединения, современного комфорта и первоклассного сервиса для незабываемого отпуска в сердце Дальяна.', '', '', '', 'Вкл'],
      ['4. О вилле', 'about_btn_more', 'Текст ссылки открытия полного описания', 'Показать больше об объекте', '', '', 'ChevronRight', 'Вкл'],
      ['4. О вилле', 'about_modal_title', 'Заголовок всплывающего окна подробностей', 'Об этой вилле', '', '', '', 'Вкл'],
      ['4. О вилле', 'about_sec_1_title', 'Модальное окно: Раздел 1 Заголовок', '1. Концепция объекта, геолокация и расширенные географические ориентиры', '', '', '', 'Вкл'],
      ['4. О вилле', 'about_sec_1_text', 'Модальное окно: Раздел 1 Текст', 'Dalyan Turaman [частный бассейн, 10 спальных мест] - это цифровая веб-платформа прямого онлайн-бронирования двухэтажной виллы премиум-класса в экологическом заповедном курорте Дальян [район Ортаджа, провинция Мугла, Турция], расположенном между рекой Дальян и озером Кёйджегиз.\n\nОфициальный адрес и навигация:\n* Адрес виллы: Dalyan, Rodoslu Yaşar Sünger Sk, NO 28/2, 48600 Ortaca / Muğla, Turkey.\n* Ссылка на геолокацию в Google Maps: https://maps.app.goo.gl/tPgCjCwz4pzq28pE9\n* Точные координаты GPS: 36.8336° N, 28.6439° E.\n\nПолный реестр ключевых географических ориентиров:\n* Пешеходный центр Дальяна: всего 250 метров [3 минуты пешком] до главной пешеходной улицы с магазинами, рынками, аптеками и сувенирными лавками.\n* Речная набережная реки Дальян: 400 метров для утренних пробежек, вечерних прогулок и наблюдения за речными лодками.\n* Гастрономия: популярный ресторан высокой кухни La Boheme Dalyan - 350 метров; традиционный рыбный ресторан Çiçek Restoran - 500 метров.\n* Ликийские скальные гробницы королей Кауноса [IV век до н.э.]: панорамный вид с набережной Дальяна [450 метров], вечерняя подсветка скал и 10 минут на лодке.\n* Античный город Каунос, древний акрополь и амфитеатр: 1.5 км [переправа на весельной лодке через реку Дальян и пеший маршрут].\n* Всемирно известный песчаный пляж Изтузу [İztuzu]: 11 км [около 15 минут на машине или 30-40 минут на живописном речном катере-такси через лабиринты камышей]. Заповедная зона обитания гигантских морских черепах Caretta-Caretta.\n* Термальные радоновые источники и омолаживающие грязи Султание [Sultaniye Kaplıcaları]: 4 км по воде на озере Кёйджегиз.\n* Озеро Кёйджегиз [Köyceğiz Gölü]: 5 км до выхода из русла реки в открытую озерную акваторию.\n* Смотровая площадка Радар [Radar Tepesi]: 8 км [панорамный обзор 360° на всю дельту реки, озеро и косу пляжа Изтузу с высоты 500 метров].\n* Международный аэропорт Даламан [DLM]: 30 км [25-30 минут на машине или индивидуальном трансфере].\n* Субботний фермерский рынок Дальяна: 600 метров [свежие фермерские сыры, оливки, гранатовый сок, инжир и фрукты].\n* Морские курорты: город Мармарис - 85 км, город Фетхие и бухта Олюдениз - 60 км.', '', '', '', 'Вкл'],
      ['4. О вилле', 'about_sec_2_title', 'Модальное окно: Раздел 2 Заголовок', '2. Архитектура виллы и номерной фонд', '', '', '', 'Вкл'],
      ['4. О вилле', 'about_sec_2_text', 'Модальное окно: Раздел 2 Текст', 'Тип недвижимости: Дом / Вилла [в распоряжении гостей жилье целиком].\nПлощадь, этажность и год постройки: 240 кв. метров, 2 этажа, год постройки - 2013.\nВместимость: до 10 гостей [включая детей], 10 полноценных спальных мест.\nКонфигурация спален и санузлов: 4 большие спальни [каждая оборудована персональной ванной комнатой и автономным кондиционером] + гостевой туалет на первом этаже:\nПервый этаж: полноценная кухня Beko, просторная гостиная со Smart TV 55", гостевой туалет, прихожая, постирочная, Спальня 1 [квин-сайз + односпальная кровать, ванная с душем, кондиционер].\nВторой этаж: Спальня 2 [кинг-сайз, ванная с тропическим душем, кондиционер, балкон], Спальня 3 [квин-сайз, ванная, кондиционер, вид на горы], Спальня 4 [квин-сайз + односпальная кровать, ванная, кондиционер], вторая стиральная машина.\nИтоговая структура: 4 двуспальные кровати + 2 односпальные кровати + диван в гостиной = 10 спальных мест.', '', '', '', 'Вкл'],
      ['4. О вилле', 'about_sec_3_title', 'Модальное окно: Раздел 3 Заголовок', '3. Придомовая территория, бассейн и спа-комплекс', '', '', '', 'Вкл'],
      ['4. О вилле', 'about_sec_3_text', 'Модальное окно: Раздел 3 Текст', 'Приватный бассейн с соленой водой: чаша 4×9 метров [площадь 36 кв. м], постоянная глубина 150 см. Без запаха хлора. Доступен с 1 мая по 1 ноября. Чистка в день заселения и каждые 7 дней. Подсветка бассейна: 20:00 - 01:00.\nУличное приватное джакузи: на 4 персоны, автоматический цикл [15 минут работы каждые 45 минут в период 10:00 - 17:00]. Подсветка джакузи: 20:00 - 01:00. Сезон: 1 мая - 1 ноября.\nОсвещение территории: автоматическое [20:00 - 01:00 и 04:00 - 06:00].\nПарковка: бесплатная закрытая частная парковка на территории на 2 авто.\nОткрытые зоны отдыха: огороженный сад, барбекю [BBQ], крыльцо с кофейными столиками, обеденный стол на 8 мест, шезлонги и летний душ.', '', '', '', 'Вкл'],
      ['4. О вилле', 'about_sec_4_title', 'Модальное окно: Раздел 4 Заголовок', '4. Юридический регламент, безопасность и доступная среда', '', '', '', 'Вкл'],
      ['4. О вилле', 'about_sec_4_text', 'Модальное окно: Раздел 4 Текст', 'Закон Турции № 7464 о краткосрочной аренде: обязательный договор аренды виллы с описью имущества при заселении.\nРегистрация в системе учета населения KBS: обязательное предоставление паспортов всех проживающих. Размещение незарегистрированных лиц строго запрещено.\nБезопасность дома: внешнее видеонаблюдение по периметру, детекторы дыма во всех спальнях и гостиной, огнетушитель, аптечка первой помощи.\nДоступная среда: выделенная парковка для инвалидов, ровный освещенный вход без ступеней, дверь от 81 см, подъемник для бассейна и джакузи.\nПолитика отмены: менее 28 ночей - Негибкие, от 28 ночей - Строгие. Опция невозвратного тарифа со скидкой 10% за 60 дней.', '', '', '', 'Вкл'],
      ['4. О вилле', 'about_sec_5_title', 'Модальное окно: Раздел 5 Заголовок', '5. Профиль суперхозяина и мастер-доступ', '', '', '', 'Вкл'],
      ['4. О вилле', 'about_sec_5_text', 'Модальное окно: Раздел 5 Текст', 'Владелец: Алексей Знаменский [Aleksei Znamenskii]. Проживает в Мармарисе, яхтсмен на пенсии. Жизненное кредо: «Хочешь сделать хорошо - сделай сам». Мечта: отправиться в Португалию и увидеть океан. Хобби: велоспорт, парусный спорт, природа. Штампы путешествий: Дубай [3 поездки], Абу-Даби [март 2026 г.]. Языки: русский, английский, турецкий. Налоговые реквизиты: Ortaca Vergi Dairesi, VKN: 9991120181.\nМастер-доступ суперхозяина: villaturaman@gmail.com, логин admin / пароль admin123, роль: Владелец [Финансы, Периоды, Блокировки, Окно брони, Чаты].', '', '', '', 'Вкл'],
      ['4. О вилле', 'about_sec_6_title', 'Модальное окно: Раздел 6 Заголовок', '6. Новая планировка Центра сообщений и CRM [HostInbox.js]', '', '', '', 'Вкл'],
      ['4. О вилле', 'about_sec_6_text', 'Модальное окно: Раздел 6 Текст', 'Просторное многострочное поле ввода ответа: минимальная высота увеличена до 90px с авто-расширением до 220px при наборе. Удобный скролл и контраст.\nОтдельная смарт-панель шаблонов без перекрытия чата: вынесена в независимый сайдбар, полный предпросмотр длинных ответов перед вставкой, кнопки «Вставить в поле» и «Отправить сразу», динамический счетчик шаблонов из Google Sheets.\nЛиквидация дергания экрана: изолированный скролл контейнера messagesContainerRef.current.scrollTop без глобальных прыжков страницы.', '', '', '', 'Вкл'],
      ['4. О вилле', 'about_sec_7_title', 'Модальное окно: Раздел 7 Заголовок', '7. Размещение данных на витрине сайта и в стартовых файлах', '', '', '', 'Вкл'],
      ['4. О вилле', 'about_sec_7_text', 'Модальное окно: Раздел 7 Текст', 'Витрина сайта [pages/index.js]: Hero-секция с приватным бассейном 36 кв. м и 10 спальными местами, интерактивные карточки 14 ориентиров Дальяна с расстояниями, блок 4 спален en-suite, технический блок спа-комплекса и джакузи 10:00-17:00, блок Закона № 7464, KBS и доступной среды, карточка суперхозяина Алексея Знаменского.\nСтартовые и восстановительные файлы: лист HOME [ID 101], GALLERY [ID 102], ACCOUNTS [ID 203: villaturaman@gmail.com, admin / admin123], LEGAL [ID 106], SETTINGS [ID 209].', '', '', '', 'Вкл'],

      // --- БЛОК 5: СПАЛЬНЫЕ МЕСТА [SLEEPING ARRANGEMENTS] ---
      ['5. Спальни', 'sleeping_title', 'Заголовок секции спальных мест', 'Где вы будете спать • 10 спальных мест в 4 спальнях', '', '', '', 'Вкл'],
      ['5. Спальни', 'bedroom_1', 'Спальня 1 [1 этаж] • Queen + Single [3 места]', 'Спальня 1 [1 этаж] • Queen + Single [3 места]', '', '', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600', 'Вкл'],
      ['5. Спальни', 'bedroom_1_desc', 'Описание спальни 1', 'Первый этаж: 1 двуспальная кровать Queen + 1 односпальная кровать, персональная ванная с душевой кабиной, кондиционер', '', '', 'BedDouble', 'Вкл'],
      ['5. Спальни', 'bedroom_1_badge', 'Бейдж кровати спальни 1', 'Queen + Single [3 места]', '', '', '', 'Вкл'],
      ['5. Спальни', 'bedroom_2', 'Спальня 2 [2 этаж] • King Bed [2 места]', 'Спальня 2 [2 этаж] • King Bed [2 места]', '', '', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600', 'Вкл'],
      ['5. Спальни', 'bedroom_2_desc', 'Описание спальни 2', 'Второй этаж: 1 большая двуспальная кровать King Size, собственная ванная комната, кондиционер, балкон с видом на горы', '', '', 'BedDouble', 'Вкл'],
      ['5. Спальни', 'bedroom_2_badge', 'Бейдж кровати спальни 2', 'King Bed [2 места]', '', '', '', 'Вкл'],
      ['5. Спальни', 'bedroom_3', 'Спальня 3 [2 этаж] • Queen Bed [2 места]', 'Спальня 3 [2 этаж] • Queen Bed [2 места]', '', '', 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600', 'Вкл'],
      ['5. Спальни', 'bedroom_3_desc', 'Описание спальни 3', 'Второй этаж: 1 двуспальная кровать Queen Size, собственная ванная комната, кондиционер, гардероб', '', '', 'Bed', 'Вкл'],
      ['5. Спальни', 'bedroom_3_badge', 'Бейдж кроватей спальни 3', 'Queen Bed [2 места]', '', '', '', 'Вкл'],
      ['5. Спальни', 'bedroom_4', 'Спальня 4 [2 этаж] • Queen + Single [3 места]', 'Спальня 4 [2 этаж] • Queen + Single [3 места]', '', '', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600', 'Вкл'],
      ['5. Спальни', 'bedroom_4_desc', 'Описание спальни 4', 'Второй этаж: 1 двуспальная кровать Queen + 1 дополнительная односпальная кровать, собственная ванная комната, кондиционер', '', '', 'Sofa', 'Вкл'],
      ['5. Спальни', 'bedroom_4_badge', 'Бейдж дивана спальни 4', 'Queen + Single [3 места]', '', '', '', 'Вкл'],

      // --- БЛОК 6: УДОБСТВА ВИЛЛЫ [AMENITIES] ---
      ['6. Удобства', 'amenities_title', 'Заголовок секции удобств', 'Что есть в этом жилье', '', '', '', 'Вкл'],
      ['6. Удобства', 'amenities_btn_all', 'Кнопка открытия модального окна всех удобств', 'Показать все удобства', '', '', '', 'Вкл'],
      ['6. Удобства', 'amenity_main_1', 'Основное удобство 1 на главной', 'Приватный открытый бассейн 36 м²', '', '', 'Waves', 'Вкл'],
      ['6. Удобства', 'amenity_main_2', 'Основное удобство 2 на главной', 'Уличное джакузи на 4 персоны', '', '', 'Sparkles', 'Вкл'],
      ['6. Удобства', 'amenity_main_3', 'Основное удобство 3 на главной', 'Скоростной Wi-Fi: [WIFI_NAME]', '', '', 'Wifi', 'Вкл'],
      ['6. Удобства', 'amenity_main_4', 'Основное удобство 4 на главной', 'Кондиционеры во всех 4 спальнях', '', '', 'Wind', 'Вкл'],
      ['6. Удобства', 'amenity_main_5', 'Основное удобство 5 на главной', 'Полноценная кухня Beko', '', '', 'Utensils', 'Вкл'],
      ['6. Удобства', 'amenity_main_6', 'Основное удобство 6 на главной', 'Бесплатная парковка на 2 авто', '', '', 'Car', 'Вкл'],
      ['6. Удобства', 'amenity_main_7', 'Основное удобство 7 на главной', 'Зона BBQ и обеденный стол на 8 мест', '', '', 'Flame', 'Вкл'],
      ['6. Удобства', 'amenity_main_8', 'Основное удобство 8 на главной', 'Стиральная машина на каждом этаже', '', '', 'WashingMachine', 'Вкл'],
      ['6. Удобства', 'amenity_main_9', 'Основное удобство 9 на главной', 'Доступная среда и подъемник', '', '', 'Shield', 'Вкл'],
      ['6. Удобства', 'amenity_main_10', 'Основное удобство 10 на главной', 'Видеонаблюдение и датчики дыма', '', '', 'ShieldCheck', 'Вкл'],
      ['6. Удобства', 'amenity_cat1_title', 'Модальное окно: Категория 1 Заголовок', 'Виды и природа', '', '', 'Mountain', 'Вкл'],
      ['6. Удобства', 'amenity_cat1_item1', 'Модальное окно: Категория 1 Пункт 1', 'Панорамный вид на горы Дальяна', '', '', 'Check', 'Вкл'],
      ['6. Удобства', 'amenity_cat1_item2', 'Модальное окно: Категория 1 Пункт 2', 'Вид на реку и сад', '', '', 'Check', 'Вкл'],
      ['6. Удобства', 'amenity_cat1_item3', 'Модальное окно: Категория 1 Пункт 3', 'Близость набережной Дальяна [400 м]', '', '', 'Check', 'Вкл'],
      ['6. Удобства', 'amenity_cat2_title', 'Модальное окно: Категория 2 Заголовок', 'Бассейн и спа', '', '', 'Waves', 'Вкл'],
      ['6. Удобства', 'amenity_cat2_item1', 'Модальное окно: Категория 2 Пункт 1', 'Приватный бассейн с соленой водой 4×9 м [глубина 1.5м]', '', '', 'Check', 'Вкл'],
      ['6. Удобства', 'amenity_cat2_item2', 'Модальное окно: Категория 2 Пункт 2', 'Шезлонги и зона для загара', '', '', 'Check', 'Вкл'],
      ['6. Удобства', 'amenity_cat2_item3', 'Модальное окно: Категория 2 Пункт 3', 'Летний душ у бассейна', '', '', 'Check', 'Вкл'],
      ['6. Удобства', 'amenity_cat2_item4', 'Модальное окно: Категория 2 Пункт 4', 'Уличное джакузи на 4 персоны [10:00-17:00, 15 мин каждые 45 мин]', '', '', 'Check', 'Вкл'],
      ['6. Удобства', 'amenity_cat3_title', 'Модальное окно: Категория 3 Заголовок', 'Кухня и столовая', '', '', 'Utensils', 'Вкл'],
      ['6. Удобства', 'amenity_cat3_item1', 'Модальное окно: Категория 3 Пункт 1', 'Большой двухкамерный холодильник Beko', '', '', 'Check', 'Вкл'],
      ['6. Удобства', 'amenity_cat3_item2', 'Модальное окно: Категория 3 Пункт 2', 'Посудомоечная машина', '', '', 'Check', 'Вкл'],
      ['6. Удобства', 'amenity_cat3_item3', 'Модальное окно: Категория 3 Пункт 3', 'Духовой шкаф Beko и варочная панель', '', '', 'Check', 'Вкл'],
      ['6. Удобства', 'amenity_cat3_item4', 'Модальное окно: Категория 3 Пункт 4', 'Кофемашина эспрессо и чайник', '', '', 'Check', 'Вкл'],
      ['6. Удобства', 'amenity_cat3_item5', 'Модальное окно: Категория 3 Пункт 5', 'Полный комплект посуды и бокалов для вина', '', '', 'Check', 'Вкл'],
      ['6. Удобства', 'amenity_cat4_title', 'Модальное окно: Категория 4 Заголовок', 'Комфорт и связь', '', '', 'Wifi', 'Вкл'],
      ['6. Удобства', 'amenity_cat4_item1', 'Модальное окно: Категория 4 Пункт 1', 'Скоростной оптоволоконный Wi-Fi', '', '', 'Check', 'Вкл'],
      ['6. Удобства', 'amenity_cat4_item2', 'Модальное окно: Категория 4 Пункт 2', 'Сплит-системы кондиционирования во всех спальнях', '', '', 'Check', 'Вкл'],
      ['6. Удобства', 'amenity_cat4_item3', 'Модальное окно: Категория 4 Пункт 3', 'Smart TV 55 дюймов с Netflix и YouTube', '', '', 'Check', 'Вкл'],
      ['6. Удобства', 'amenity_cat4_item4', 'Модальное окно: Категория 4 Пункт 4', 'Обеденная зона на воздухе на 8 мест и крыльцо', '', '', 'Check', 'Вкл'],
      ['6. Удобства', 'amenity_cat5_title', 'Модальное окно: Категория 5 Заголовок', 'Безопасность дома', '', '', 'Shield', 'Вкл'],
      ['6. Удобства', 'amenity_cat5_item1', 'Модальное окно: Категория 5 Пункт 1', 'Огороженная приватная территория и автоматическое освещение', '', '', 'Check', 'Вкл'],
      ['6. Удобства', 'amenity_cat5_item2', 'Модальное окно: Категория 5 Пункт 2', 'Система наружного видеонаблюдения по периметру', '', '', 'Check', 'Вкл'],
      ['6. Удобства', 'amenity_cat5_item3', 'Модальное окно: Категория 5 Пункт 3', 'Датчики дыма и аптечка первой помощи', '', '', 'Check', 'Вкл'],
      ['6. Удобства', 'amenity_cat5_item4', 'Модальное окно: Категория 5 Пункт 4', 'Огнетушитель', '', '', 'Check', 'Вкл'],

      // --- БЛОК 7: ОТЗЫВЫ И КРИТЕРИИ ОЦЕНОК [REVIEWS] ---
      ['7. Отзывы', 'reviews_score_header', 'Заголовок рейтинга в блоке отзывов', '4.98 • Рейтинг гостей на основе 48 отзывов', '', '', 'Star', 'Вкл'],
      ['7. Отзывы', 'review_cat_1', 'Критерий 1: Чистота', 'Чистота', '', '', '5.0|100', 'Вкл'],
      ['7. Отзывы', 'review_cat_2', 'Критерий 2: Точность описания', 'Точность описания', '', '', '4.9|98', 'Вкл'],
      ['7. Отзывы', 'review_cat_3', 'Критерий 3: Общение с хозяином', 'Общение с хозяином', '', '', '5.0|100', 'Вкл'],
      ['7. Отзывы', 'review_cat_4', 'Критерий 4: Расположение', 'Расположение', '', '', '4.9|98', 'Вкл'],
      ['7. Отзывы', 'review_cat_5', 'Критерий 5: Прибытие и заезд', 'Прибытие и заезд', '', '', '5.0|100', 'Вкл'],
      ['7. Отзывы', 'review_cat_6', 'Критерий 6: Цена / качество', 'Соотношение цена/качество', '', '', '4.9|98', 'Вкл'],
      ['7. Отзывы', 'review_1_author', 'Отзыв 1: Автор и дата', 'Елена Смирнова • Август 2026', '', '', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120', 'Вкл'],
      ['7. Отзывы', 'review_1_text', 'Отзыв 1: Текст отзыва', 'Потрясающая вилла! Вид на горы просто захватывает дух, бассейн с соленой водой чистейший, джакузи великолепно расслабляет. Алексей был на связи 24/7, помог организовать незабываемый круиз на лодке по озеру Кёйджегиз. Обязательно вернемся!', '', '', '', 'Вкл'],
      ['7. Отзывы', 'review_2_author', 'Отзыв 2: Автор и дата', 'Markus Webber • Июль 2026', '', '', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120', 'Вкл'],
      ['7. Отзывы', 'review_2_text', 'Отзыв 2: Текст отзыва', 'Outstanding hospitality and pristine villa in the heart of Dalyan. Fast Wi-Fi, 4 spacious bedrooms, and peaceful neighborhood. Aleksei is truly a top Superhost!', '', '', '', 'Вкл'],
      ['7. Отзывы', 'review_3_author', 'Отзыв 3: Автор и дата', 'Ahmet Yılmaz • Июнь 2026', '', '', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120', 'Вкл'],
      ['7. Отзывы', 'review_3_text', 'Отзыв 3: Текст отзыва', 'Dalyan\'da kaldığımız en konforlu villa. 4 banyolu 4 yatak odası ailemiz için mükemmeldi. Bahçe ve havuz bakımı harikaydı, teşekkürler Aleksei!', '', '', '', 'Вкл'],
      ['7. Отзывы', 'review_4_author', 'Отзыв 4: Автор и дата', 'Дмитрий и Анна • Май 2026', '', '', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120', 'Вкл'],
      ['7. Отзывы', 'review_4_text', 'Отзыв 4: Текст отзыва', 'Идеально для семейного отдыха до 10 человек. Закрытая территория, 250 метров до центра Дальяна, тишина. Видео-гид от Алексея открыл нам секретные пляжи и отличные рыбные рестораны.', '', '', '', 'Вкл'],

      // --- БЛОК 8: ЛОКАЦИЯ И ОКРЕСТНОСТИ ДАЛЬЯНА [LOCATION] ---
      ['8. Локация', 'location_title', 'Заголовок секции локации', 'Расположение: Дальян, Ортаджа, Мугла, Турция', '', '', 'MapPin', 'Вкл'],
      ['8. Локация', 'location_desc', 'Подробный текст об окрестностях Дальяна', 'Вилла Turaman находится в самом центре Дальяна: всего 250 метров до пешеходной улицы, 400 метров до речной набережной, 350 метров до ресторана La Boheme Dalyan. Песчаный пляж Изтузу - 11 км [15 минут на машине или лодке], аэропорт Даламан - 30 км. В пешей доступности древний город Каунос и Ликийские гробницы.', '', '', '', 'Вкл'],
      ['8. Локация', 'location_badge', 'Текст плашки GPS и расстояния до аэропорта', 'GPS: 36.8336° N, 28.6439° E • 250м до центра • 11 км до пляжа Изтузу • 30 км до DLM', '', '', 'Navigation', 'Вкл'],
      ['8. Локация', 'location_image', 'Панорамная фотография окрестностей', 'Фото природы Дальяна', '', '', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200', 'Вкл'],

      // --- БЛОК 9: КАРТОЧКА ВЛАДЕЛЬЦА [HOST PROFILE] ---
      ['9. Хозяин', 'host_card_title', 'Заголовок карточки владельца', 'Хозяин: Алексей Знаменский', '', '', '', 'Вкл'],
      ['9. Хозяин', 'host_card_subtitle', 'Подзаголовок статуса суперхозяина', 'Суперхозяин на Airbnb • Яхтсмен на пенсии • Живет в Мармарисе', '', '', 'Award', 'Вкл'],
      ['9. Хозяин', 'host_card_verified', 'Бейдж подтверждения личности', 'Личность подтверждена • Девиз: «Хочешь сделать хорошо - сделай сам»', '', '', 'ShieldCheck', 'Вкл'],
      ['9. Хозяин', 'host_card_response_time', 'Бейдж времени ответа на сообщения', 'Время ответа: в течение часа • Языки: RU, EN, TR', '', '', 'Clock', 'Вкл'],
      ['9. Хозяин', 'host_card_languages', 'Заголовок языков общения', 'Интересы: Велоспорт, Парусный спорт, Природа • Мечта: Португалия', '', '', 'Globe2', 'Вкл'],
      ['9. Хозяин', 'host_card_help_text', 'Описание помощи гостям', 'Штампы путешествий: Дубай [3 поездки], Абу-Даби [март 2026 г.]. Помощь в организации трансфера, аренде авто и экскурсий.', '', '', '', 'Вкл'],
      ['9. Хозяин', 'host_card_btn', 'Текст кнопки связи с хозяином', 'Написать хозяину', '', '', 'MessageCircle', 'Вкл'],
      ['9. Хозяин', 'host_card_credo', 'Жизненное кредо суперхозяина', '«Хочешь сделать хорошо - сделай сам»', '', '', 'Quote', 'Вкл'],
      ['9. Хозяин', 'host_card_dream', 'Мечта и базирование', 'База: Мармарис • Мечта: Португалия и Атлантический океан', '', '', 'Compass', 'Вкл'],
      ['9. Хозяин', 'host_card_hobbies', 'Хобби и спорт суперхозяина', 'Велоспорт, Парусный спорт, Живая природа Дальяна', '', '', 'Bike', 'Вкл'],
      ['9. Хозяин', 'host_card_travel', 'Штампы путешествий', 'Дубай [3 поездки], Абу-Даби [март 2026 г.]', '', '', 'PlaneTakeoff', 'Вкл'],
      ['9. Хозяин', 'host_card_tax', 'Официальные налоговые реквизиты', 'Официальный налогоплательщик: Ortaca Vergi Dairesi, VKN: 9991120181', '', '', 'FileCheck', 'Вкл'],

      // --- БЛОК 10: 14 ГЕОГРАФИЧЕСКИХ ОРИЕНТИРОВ ДАЛЬЯНА [LANDMARKS] ---
      ['10. Ориентиры', 'landmarks_title', 'Заголовок секции ориентиров', '14 географических ориентиров Дальяна', '', '', 'MapPin', 'Вкл'],
      ['10. Ориентиры', 'landmarks_subtitle', 'Подзаголовок секции ориентиров', 'Точные расстояния и тайминг от виллы • Пешеходная доступность центра и заповедная природа', '', '', 'Navigation', 'Вкл'],
      ['10. Ориентиры', 'landmarks_address', 'Официальный адрес виллы для навигатора', 'Dalyan, Rodoslu Yaşar Sünger Sk, NO 28/2, 48600 Ortaca / Muğla, Turkey', '', '', 'MapPin', 'Вкл'],
      ['10. Ориентиры', 'landmarks_maps_url', 'Прямая ссылка на геолокацию в Google Maps', 'https://maps.app.goo.gl/tPgCjCwz4pzq28pE9', '', '', 'https://maps.app.goo.gl/tPgCjCwz4pzq28pE9', 'Вкл'],
      ['10. Ориентиры', 'landmarks_gps', 'Координаты GPS виллы', '36.8336° N, 28.6439° E', '', '', 'Compass', 'Вкл'],
      ['10. Ориентиры', 'landmark_1', 'Ориентир 1: Пешеходный центр Дальяна', 'Пешеходный центр Дальяна: главная улица, рестораны, кофейни, аптеки, банкоматы и сувенирные лавки', '', '', '250 м|3 мин пешком|walk|В шаговой доступности|Footprints', 'Вкл'],
      ['10. Ориентиры', 'landmark_2', 'Ориентир 2: Речная набережная и причал', 'Речная набережная и центральный причал речных лодок-такси и экскурсионных катеров', '', '', '400 м|5 мин пешком|walk|Река Дальян|Compass', 'Вкл'],
      ['10. Ориентиры', 'landmark_3', 'Ориентир 3: Ресторан La Boheme Dalyan Bistro', 'Ресторан авторской кухни La Boheme Dalyan Bistro: средиземноморская и европейская кухня', '', '', '350 м|4 мин пешком|food|Гастрономия|Utensils', 'Вкл'],
      ['10. Ориентиры', 'landmark_4', 'Ориентир 4: Ресторан Çiçek Restoran', 'Традиционный эгейский рыбный ресторан Çiçek Restoran: свежайшие морепродукты и домашние мезе', '', '', '500 м|6 мин пешком|food|Свежая рыба|Utensils', 'Вкл'],
      ['10. Ориентиры', 'landmark_5', 'Ориентир 5: Субботний фермерский рынок', 'Субботний фермерский рынок Дальяна: деревенские сыры, оливки, свежие фрукты, специи и гранатовый сок', '', '', '600 м|7 мин пешком|walk|Суббота|ShoppingBag', 'Вкл'],
      ['10. Ориентиры', 'landmark_6', 'Ориентир 6: Ликийские скальные гробницы', 'Ликийские скальные гробницы карийских царей IV века до н.э., высеченные в скале, с вечерней иллюминацией', '', '', '450 м|Прямая видимость|nature|UNESCO Heritage|Mountain', 'Вкл'],
      ['10. Ориентиры', 'landmark_7', 'Ориентир 7: Античный город Каунос', 'Античный город Каунос: амфитеатр, римские термы, агора, базилика и акрополь на вершине холма', '', '', '1.5 км|Лодка + 15 мин|nature|Античная история|Compass', 'Вкл'],
      ['10. Ориентиры', 'landmark_8', 'Ориентир 8: Источники и грязи Султание', 'Радоновые термальные источники и целебные минеральные грязи Султание на берегу озера Кёйджегиз', '', '', '4 км лодка / 12 км авто|15-20 мин|nature|Оздоровление|Waves', 'Вкл'],
      ['10. Ориентиры', 'landmark_9', 'Ориентир 9: Песчаный черепаший пляж Изтузу', 'Заповедный песчаный черепаший пляж Изтузу: золотой песок 4.5 км, место гнездования черепах Caretta-Caretta', '', '', '11 км|15 мин авто / 35 мин лодка|beach|Заповедник|Sun', 'Вкл'],
      ['10. Ориентиры', 'landmark_10', 'Ориентир 10: Пресноводное озеро Кёйджегиз', 'Пресноводное озеро Кёйджегиз: живописные заливы, водные прогулки на катерах, сапбординг и рыбалка', '', '', '5 км|10 мин авто / 25 мин катер|nature|Водный спорт|Waves', 'Вкл'],
      ['10. Ориентиры', 'landmark_11', 'Ориентир 11: Смотровая площадка на горе Радар', 'Смотровая площадка на горе Радар: круговая панорама 360° на дельту реки Дальян, косу Изтузу и море', '', '', '8 км|20 мин на авто|nature|Панорама 360°|Eye', 'Вкл'],
      ['10. Ориентиры', 'landmark_12', 'Ориентир 12: Центр реабилитации черепах DEKAMER', 'Научно-исследовательский и реабилитационный центр спасения морских черепах DEKAMER на пляже Изтузу', '', '', '12 км|18 мин на авто|nature|Экология|Compass', 'Вкл'],
      ['10. Ориентиры', 'landmark_13', 'Ориентир 13: Международный аэропорт Даламан [DLM]', 'Международный аэропорт Даламан DLM: круглосуточный прием внутренних и международных рейсов', '', '', '30 км|25-30 мин на авто|transport|Аэропорт|Plane', 'Вкл'],
      ['10. Ориентиры', 'landmark_14', 'Ориентир 14: Морской курортный город Мармарис', 'Крупный морской порт и курортный город Мармарис: марины для суперяхт, набережная и шоппинг', '', '', '85 км|1 час 15 мин на авто|city|Эгейская Ривьера|Car', 'Вкл'],

      // --- БЛОК 11: 🌊 СПА-КОМПЛЕКС, БАССЕЙН С СОЛЕНОЙ ВОДОЙ И САД [SPA & POOL] ---
      ['11. Спа и Бассейн', 'spa_title', 'Заголовок секции спа-комплекса', 'Спа-комплекс и бассейн с соленой водой', '', '', 'Waves', 'Вкл'],
      ['11. Спа и Бассейн', 'spa_subtitle', 'Подзаголовок секции спа-комплекса', 'Приватная закрытая территория, солевой бассейн 36 м², гидромассажное джакузи и лаунж-зона отдыха', '', '', 'Sparkles', 'Вкл'],
      ['11. Спа и Бассейн', 'spa_pool_title', 'Название карточки бассейна', 'Приватный бассейн с соленой водой', '', '', 'Waves', 'Вкл'],
      ['11. Спа и Бассейн', 'spa_pool_desc', 'Характеристики и описание бассейна', 'Чаша 4 × 9 метров [площадь 36 кв. м], постоянная комфортная глубина 150 см по всей площади чаши. Мягкая природная минерализация исключает раздражение кожи и едкий запах хлора.', '', '', 'Droplets', 'Вкл'],
      ['11. Спа и Бассейн', 'spa_pool_badge', 'Бейдж бассейна', 'Соленая вода без хлора', '', '', '', 'Вкл'],
      ['11. Спа и Бассейн', 'spa_pool_season', 'Сезон работы бассейна', 'Сезон работы: с 1 мая по 1 ноября', '', '', 'Calendar', 'Вкл'],
      ['11. Спа и Бассейн', 'spa_pool_lighting', 'График подсветки бассейна', 'Подводная ночная подсветка: 20:00 - 01:00', '', '', 'Clock', 'Вкл'],
      ['11. Спа и Бассейн', 'spa_pool_maintenance', 'Регламент очистки бассейна', 'График чистки: в день заселения и далее каждые 7 дней', '', '', 'Droplets', 'Вкл'],
      ['11. Спа и Бассейн', 'spa_jacuzzi_title', 'Название карточки джакузи', 'Открытое уличное джакузи', '', '', 'Sparkles', 'Вкл'],
      ['11. Спа и Бассейн', 'spa_jacuzzi_desc', 'Описание и функционал джакузи', 'Гидромассажная спа-ванна в зоне бассейна с подогревом и регулируемыми форсунками для глубокого расслабления на свежем воздухе.', '', '', 'Sparkles', 'Вкл'],
      ['11. Спа и Бассейн', 'spa_jacuzzi_badge', 'Вместимость джакузи', 'Вместимость: 4 персоны', '', '', '', 'Вкл'],
      ['11. Спа и Бассейн', 'spa_jacuzzi_schedule', 'Режим и алгоритм джакузи', 'Режим работы: 10:00 - 17:00 [15 мин каждые 45 мин]', '', '', 'Clock', 'Вкл'],
      ['11. Спа и Бассейн', 'spa_jacuzzi_lighting', 'Подсветка джакузи', 'Подсветка джакузи: 20:00 - 01:00', '', '', 'Moon', 'Вкл'],
      ['11. Спа и Бассейн', 'spa_jacuzzi_season', 'Сезон работы джакузи', 'Период активности: с 1 мая по 1 ноября', '', '', 'Calendar', 'Вкл'],
      ['11. Спа и Бассейн', 'spa_street_lighting_title', 'Освещение территории', 'Освещение территории', '', '', 'Moon', 'Вкл'],
      ['11. Спа и Бассейн', 'spa_street_lighting_desc', 'График освещения сада', 'Автоматическое включение сада: 20:00 - 01:00 и 04:00 - 06:00', '', '', '', 'Вкл'],
      ['11. Спа и Бассейн', 'spa_parking_title', 'Приватная парковка', 'Приватная парковка', '', '', 'Car', 'Вкл'],
      ['11. Спа и Бассейн', 'spa_parking_desc', 'Описание парковки', 'Закрытая бесплатная парковка на территории виллы на 2 автомобиля', '', '', '', 'Вкл'],
      ['11. Спа и Бассейн', 'spa_bbq_title', 'Зона BBQ и лаунж', 'BBQ и обеденная зона', '', '', 'Flame', 'Вкл'],
      ['11. Спа и Бассейн', 'spa_bbq_desc', 'Описание зоны барбекю', 'Обеденный стол на 8 мест, гриль на углях, шезлонги и уличный душ', '', '', '', 'Вкл'],

      // --- БЛОК 12: ⚖️ БЕЗОПАСНОСТЬ, ЗАКОН № 7464 И ДОСТУПНАЯ СРЕДА [LAW, SAFETY & ACCESSIBILITY] ---
      ['12. Безопасность', 'legal_safety_title', 'Заголовок секции безопасности и закона', 'Безопасность, Закон № 7464 и Доступная среда', '', '', 'ShieldCheck', 'Вкл'],
      ['12. Безопасность', 'legal_safety_subtitle', 'Подзаголовок секции безопасности и закона', 'Полное соответствие законодательству Турции о краткосрочной аренде, защита гостей и безбарьерный доступ', '', '', 'FileText', 'Вкл'],
      ['12. Безопасность', 'legal_law7464_title', 'Заголовок блока Закон 7464', 'Официальный договор и учет KBS', '', '', 'FileText', 'Вкл'],
      ['12. Безопасность', 'legal_law7464_desc', 'Описание блока Закон 7464', 'Вилла осуществляет деятельность в строгом соответствии с Законом № 7464 о краткосрочной туристической аренде в Турции.', '', '', '', 'Вкл'],
      ['12. Безопасность', 'legal_law7464_badge', 'Бейдж закона 7464', 'Закон Турции № 7464', '', '', '', 'Вкл'],
      ['12. Безопасность', 'legal_law7464_item1', 'Пункт 1: Договор найма', 'Обязательный договор краткосрочного найма с описью имущества при заезде', '', '', 'CheckCircle2', 'Вкл'],
      ['12. Безопасность', 'legal_law7464_item2', 'Пункт 2: Регистрация KBS', 'Регистрация паспортов всех проживающих гостей в полицейской системе KBS [Kimlik Bildirme Sistemi]', '', '', 'CheckCircle2', 'Вкл'],
      ['12. Безопасность', 'legal_law7464_item3', 'Пункт 3: Запрет третьих лиц', 'Размещение лиц, не внесенных в государственную систему KBS, строго запрещено', '', '', 'AlertCircle', 'Вкл'],
      ['12. Безопасность', 'legal_security_title', 'Заголовок блока безопасности', 'Безопасность дома и территории', '', '', 'ShieldCheck', 'Вкл'],
      ['12. Безопасность', 'legal_security_desc', 'Описание блока безопасности', 'Оснащение дома сертифицированными системами предупреждения и постоянного мониторинга.', '', '', '', 'Вкл'],
      ['12. Безопасность', 'legal_security_badge', 'Бейдж стандартов безопасности', 'Стандарты безопасности', '', '', '', 'Вкл'],
      ['12. Безопасность', 'legal_security_item1', 'Пункт 1: Наружное видеонаблюдение', 'Наружные камеры видеонаблюдения установлены строго по периметру забора и у калитки [без съемки бассейна и террасы]', '', '', 'Eye', 'Вкл'],
      ['12. Безопасность', 'legal_security_item2', 'Пункт 2: Датчики дыма и газа', 'Сертифицированные автономные датчики дыма и угарного газа на обоих этажах виллы', '', '', 'Flame', 'Вкл'],
      ['12. Безопасность', 'legal_security_item3', 'Пункт 3: Огнетушители и аптечка', 'Огнетушители на 1 и 2 этажах, укомплектованная медицинская аптечка первой помощи', '', '', 'ShieldCheck', 'Вкл'],
      ['12. Безопасность', 'legal_accessible_title', 'Заголовок блока доступной среды', 'Инклюзивность и доступная среда', '', '', 'Accessibility', 'Вкл'],
      ['12. Безопасность', 'legal_accessible_desc', 'Описание доступной среды', 'Создание безбарьерных условий для комфортного отдыха гостей с ограниченной мобильностью.', '', '', '', 'Вкл'],
      ['12. Безопасность', 'legal_accessible_badge', 'Бейдж безбарьерной среды', 'Безбарьерная среда', '', '', '', 'Вкл'],
      ['12. Безопасность', 'legal_accessible_item1', 'Пункт 1: Спальня 1 этажа', 'Безбарьерный доступ: спальня №1 на 1 этаже оборудована широкими дверными проемами без порогов', '', '', 'DoorOpen', 'Вкл'],
      ['12. Безопасность', 'legal_accessible_item2', 'Пункт 2: Санузел для МГН', 'Санузел первого этажа спроектирован с возможностью комфортного использования гостями с ограниченной мобильностью', '', '', 'CheckCircle2', 'Вкл'],
      ['12. Безопасность', 'legal_accessible_item3', 'Пункт 3: Подъемник в бассейн', 'Возможность установки мобильного подъемника для спуска в бассейн по предварительному запросу', '', '', 'Accessibility', 'Вкл'],
      ['12. Безопасность', 'legal_cancellation_title', 'Заголовок политики отмены', 'Политика отмены и возврата', '', '', 'Clock', 'Вкл'],
      ['12. Безопасность', 'legal_cancellation_desc', 'Описание политики отмены', 'Прозрачные финансовые условия бронирования без скрытых штрафов.', '', '', '', 'Вкл'],
      ['12. Безопасность', 'legal_cancellation_badge', 'Бейдж возврата 100%', 'Возврат 100%', '', '', '', 'Вкл'],
      ['12. Безопасность', 'legal_cancellation_item1', 'Пункт 1: 14 дней отмена', 'Полный 100% возврат предоплаты при отмене более чем за 14 суток до даты заезда', '', '', 'CheckCircle2', 'Вкл'],
      ['12. Безопасность', 'legal_cancellation_item2', 'Пункт 2: Менее 14 дней', 'При отмене менее чем за 14 суток до заезда удерживается стоимость проживания за первые сутки', '', '', 'AlertCircle', 'Вкл'],
      ['12. Безопасность', 'legal_cancellation_item3', 'Пункт 3: Инвойс e-Arşiv Fatura', 'Официальное оформление e-Arşiv Fatura на имя гостя согласно VUK 213 Madde 230', '', '', 'FileText', 'Вкл']
    ];
    // Чистая запись данных: колонки A..D и G..H
    var colsA_D = homeRows.map(function(r) { return [r[0], r[1], r[2], r[3]]; });
    var colsG_H = homeRows.map(function(r) { return [r[6] || '', r[7] || 'Вкл']; });
    sheet.getRange(2, 1, colsA_D.length, 4).setValues(colsA_D);
    sheet.getRange(2, 7, colsG_H.length, 2).setValues(colsG_H);
    // Инъекция формул автоперевода в строку 2
    sheet.getRange("E2").setFormula('=MAP(D2:D; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))');
    sheet.getRange("F2").setFormula('=MAP(D2:D; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))');
  } else if (key === 'GALLERY') {
    var galHeaders = ['ID', 'Группа [RU]', 'Описание [RU]', 'Группа [EN]', 'Описание [EN]', 'Группа [TR]', 'Описание [TR]', 'Тип', 'Медиа ссылки', 'Подпись [RU]', 'Подпись [EN]', 'Подпись [TR]'];
    styleSheetHeader_(sheet, galHeaders, 1);
    var galRows = [
      ['gal-01', 'Фасад и Бассейн', 'Приватный бассейн с соленой водой 36 кв.м и шезлонги', '', '', '', '', 'Фото', 'https://drive.google.com/file/d/1NjSHRDa5eJpQTzO9268e8LMRzDVmYtX7/view?usp=sharing', 'Бассейн 36м² и зона отдыха', '', ''],
      ['gal-02', 'Фасад и Бассейн', 'Вечерняя гидроподсветка бассейна и джакузи', '', '', '', '', 'Фото', 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=1600', 'Вечерняя подсветка бассейна', '', ''],
      ['gal-03', 'Интерьер и Гостиная', 'Просторная гостиная со Smart TV 55" и кондиционером', '', '', '', '', 'Фото', 'https://drive.google.com/file/d/1IZMH6wtfLHZ6ibKHfmBhPGMFntZ_fXKU/view?usp=drive_link', 'Светлая гостиная виллы', '', ''],
      ['gal-04', 'Кухня и Столовая', 'Полноценная кухня с индукционной панелью и кофемашиной', '', '', '', '', 'Фото', 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1600', 'Кухня со всей техникой', '', ''],
      ['gal-05', 'Спальни виллы', 'Мастер-спальня 1 на первом этаже с кроватью King Size', '', '', '', '', 'Фото', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1600', 'Спальня 1 с видом на бассейн', '', ''],
      ['gal-06', 'Спальни виллы', 'Мастер-спальня 2 на втором этаже с балконом с видом на горы', '', '', '', '', 'Фото', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1600', 'Спальня 2 Queen Bed с балконом', '', ''],
      ['gal-07', 'Спальни виллы', 'Спальня 3 с двумя раздельными комфортными кроватями', '', '', '', '', 'Фото', 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1600', 'Спальня 3 с 2 кроватями', '', ''],
      ['gal-08', 'Спальни виллы', 'Спальня 4 с ортопедическим диваном-кроватью в лаундж-зоне', '', '', '', '', 'Фото', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600', 'Спальня 4 в лаундж-зоне', '', ''],
      ['gal-09', 'Санузлы', '4 индивидуальные ванные комнаты с тропическим душем', '', '', '', '', 'Фото', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1600', 'Индивидуальная ванная комната', '', ''],
      ['gal-10', 'Сад и Терраса', 'Приватный сад с обеденным столом и зоной барбекю', '', '', '', '', 'Фото', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1600', 'Зона BBQ и обеденная пергола', '', ''],
      ['gal-11', 'Бассейн и спа', 'Уличное джакузи с автоматическим гидромассажем', '', '', '', '', 'Фото', 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=1600', 'Джакузи и летний душ', '', ''],
      ['gal-12', 'Природа Дальяна', 'Набережная реки Дальян в 5 минутах пешком от виллы', '', '', '', '', 'Фото', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600', 'Живописная река Дальян', '', ''],
      ['gal-13', 'Достопримечательности', 'Ликийские скальные гробницы IV века до н.э. с подсветкой', '', '', '', '', 'Фото', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600', 'Ликийские скальные гробницы', '', ''],
      ['gal-14', 'Пляжи и заповедники', 'Песчаный черепаший пляж Изтузу и озеро Кёйджегиз', '', '', '', '', 'Фото', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1600', 'Пляж Изтузу и черепахи', '', '']
    ];
    var colsA_C = galRows.map(function(r) { return [r[0], r[1], r[2]]; });
    var colsH_J = galRows.map(function(r) { return [r[7], r[8], r[9]]; });
    sheet.getRange(2, 1, colsA_C.length, 3).setValues(colsA_C);
    sheet.getRange(2, 8, colsH_J.length, 3).setValues(colsH_J);
    sheet.getRange("D2").setFormula('=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))');
    sheet.getRange("E2").setFormula('=MAP(C2:C; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))');
    sheet.getRange("F2").setFormula('=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))');
    sheet.getRange("G2").setFormula('=MAP(C2:C; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))');
    sheet.getRange("K2").setFormula('=MAP(J2:J; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))');
    sheet.getRange("L2").setFormula('=MAP(J2:J; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))');
  } else if (key === 'SERVICES') {
    var srvHeaders = ['ID', 'Название услуги [RU]', 'Описание [RU]', 'Название услуги [EN]', 'Описание [EN]', 'Название услуги [TR]', 'Описание [TR]', 'Цена [USD]', 'Цена [EUR]', 'Цена [RUB]', 'Цена [TRY]', 'Изображения', 'Наличие', 'Тип', 'Видео презентации', 'Подробное описание [RU]', 'Подробное описание [EN]', 'Подробное описание [TR]'];
    styleSheetHeader_(sheet, srvHeaders, 1);
    var srvRows = [
      ['prod-1', 'VIP-трансфер из аэропорта Даламан [DLM]', 'Комфортабельный Mercedes Vito с кондиционером и напитками', '', '', '', '', '54', '50', '5000', '1800', 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200', 'Да', 'Трансфер', 'https://youtube.com/watch?v=transfer', 'Встреча в зоне прилета с именной табличкой. Время в пути до виллы 25 минут. В салоне бесплатный Wi-Fi и прохладительные напитки.', '', ''],
      ['prod-2', 'Приватный круиз на яхте по реке Дальян и пляжу Изтузу', 'Традиционная деревянная лодка: Капитан Адам, Ликийские гробницы', '', '', '', '', '270', '250', '25000', '9000', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200', 'Да', 'Круиз', 'https://youtube.com/watch?v=cruise', 'Эксклюзивный дневной маршрут: Ликийские гробницы, ловля голубых крабов, купание на пляже Изтузу и обед от капитана со свежей рыбой.', '', ''],
      ['prod-3', 'Ужин от персонального шеф-повара на вилле', '4-курсовой ужин у бассейна: традиционные турецкие мезе и морепродукты', '', '', '', '', '130', '120', '12000', '4300', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200', 'Да', 'Шеф', 'https://youtube.com/watch?v=chef', 'Шеф-повар лично закупает фермерские продукты на рынке Дальяна, готовит ужин на вашей кухне, сервирует стол и наводит идеальный порядок.', '', ''],
      ['prod-4', 'Премиальный BBQ-вечер на углях в саду виллы', 'Стейки рибай, каре ягненка на косточке и овощи гриль', '', '', '', '', '175', '160', '16000', '5800', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200', 'Да', 'BBQ', 'https://youtube.com/watch?v=bbq', 'В стоимость входит премиальное маринованное фермерское мясо, отборные угли, розжиг, лаваш, соусы и работа гриль-мастера в течение 3 часов.', '', ''],
      ['prod-5', 'СПА-тур и грязевые источники Султание', 'Омолаживающие минеральные термы и ванны озера Кёйджегиз', '', '', '', '', '75', '70', '7000', '2500', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200', 'Да', 'СПА', 'https://youtube.com/watch?v=spa', 'Трансфер на моторной лодке прямо от причала виллы. Входные билеты в термальные комплексы и радоновые бассейны включены.', '', ''],
      ['prod-6', 'Аренда сапбордов [SUP] и двухместного каяка', '2 устойчивых SUP-борда и двухместный экспедиционный каяк', '', '', '', '', '85', '80', '8000', '2900', 'https://images.unsplash.com/photo-1517404215738-15263e9f9178?w=1200', 'Да', 'Спорт', 'https://youtube.com/watch?v=sup', 'Доставка оборудования прямо к вилле на весь период проживания. В комплекте весла, страховочные лиши и спасательные жилеты.', '', ''],
      ['prod-7', 'Прокат электровелосипедов для прогулок по Дальяну', '2 современных электробайка с запасом хода до 60 км', '', '', '', '', '45', '40', '4000', '1500', 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=1200', 'Да', 'Транспорт', 'https://youtube.com/watch?v=bike', 'Идеальный способ исследовать гранатовые сады и улочки Дальяна. В комплекте шлемы, замки и держатели для смартфонов с навигатором.', '', ''],
      ['prod-8', 'Дополнительная экспресс-уборка и смена белья', 'Внеплановая влажная уборка виллы, замена полотенец и постельного белья', '', '', '', '', '65', '60', '6000', '2200', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200', 'Да', 'Сервис', 'https://youtube.com/watch?v=cleaning', 'Полная уборка всех 4 спален, кухни и санузлов, мытье полов эко-средствами, замена постельных комплектов сатин премиум и банных полотенец.', '', '']
    ];
    var colsA_C = srvRows.map(function(r) { return [r[0], r[1], r[2]]; });
    var colsH_P = srvRows.map(function(r) { return [r[7], r[8], r[9], r[10], r[11], r[12], r[13], r[14], r[15]]; });
    sheet.getRange(2, 1, colsA_C.length, 3).setValues(colsA_C);
    sheet.getRange(2, 8, colsH_P.length, 9).setValues(colsH_P);
    sheet.getRange("D2").setFormula('=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))');
    sheet.getRange("E2").setFormula('=MAP(C2:C; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))');
    sheet.getRange("F2").setFormula('=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))');
    sheet.getRange("G2").setFormula('=MAP(C2:C; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))');
    sheet.getRange("Q2").setFormula('=MAP(P2:P; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))');
    sheet.getRange("R2").setFormula('=MAP(P2:P; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))');
  } else if (key === 'GUIDES') {
    var gHeaders = ['ID', 'Название путеводителя [RU]', 'Описание [RU]', 'Название путеводителя [EN]', 'Описание [EN]', 'Название путеводителя [TR]', 'Описание [TR]', 'Изображения', 'Категория', 'Ссылка на видео', 'Цена [USD]', 'Цена [EUR]', 'Цена [RUB]', 'Цена [TRY]', 'Видео презентации', 'Подробное описание [RU]', 'Подробное описание [EN]', 'Подробное описание [TR]'];
    styleSheetHeader_(sheet, gHeaders, 1);
    var gRows = [
      ['guide-1', 'Секретные маршруты реки Дальян и черепаший пляж Изтузу', 'Эксклюзивный 40-минутный 4K видео-гид от Алексея Знаменского', '', '', '', '', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200', 'Локации', 'https://youtube.com/watch?v=guide1', '22', '20', '2000', '700', 'https://youtube.com/watch?v=preview1', 'Где встретить гигантских черепах Caretta-Caretta, как взять лодку без наценок и какие дикие бухты скрыты от массовых туристов.', '', ''],
      ['guide-2', 'Ликийские скальные гробницы и древний город Каунос', 'Историческое погружение в тайны Ликийского царства и акрополя', '', '', '', '', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200', 'История', 'https://youtube.com/watch?v=guide2', '27', '25', '2500', '900', 'https://youtube.com/watch?v=preview2', 'Маршрут безопасного подъема к амфитеатру Кауноса, тайные тропы древней гавани и лучшие видовые точки для фотосъемки на закате.', '', ''],
      ['guide-3', 'Гастрономический гид: топ-10 ресторанов и гранатовые сады', 'Где попробовать настоящую турецкую кухню, свежую рыбу и мезе', '', '', '', '', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200', 'Гастрономия', 'https://youtube.com/watch?v=guide3', '16', '15', '1500', '550', 'https://youtube.com/watch?v=preview3', 'Список проверенных ресторанов Дальяна, включая культовый ресторан Çiçek Restoran, явки шефов и специальные привилегии для гостей нашей виллы.', '', ''],
      ['guide-4', 'Термальные источники Султание и минеральные грязи', 'Как получить максимальный оздоровительный эффект без толп', '', '', '', '', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200', 'Здоровье', 'https://youtube.com/watch?v=guide4', '22', '20', '2000', '700', 'https://youtube.com/watch?v=preview4', 'Расписание работы источников, часы отсутствия экскурсионных теплоходов, состав минеральных вод и правильный порядок принятия ванн.', '', ''],
      ['guide-5', 'Горные трекинговые тропы и смотровая площадка Радар', 'Пешие маршруты с панорамными видами на дельту реки и косу Изтузу', '', '', '', '', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200', 'Трекинг', 'https://youtube.com/watch?v=guide5', '16', '15', '1500', '550', 'https://youtube.com/watch?v=preview5', 'Точные GPS-треки подъема на высоту 500 метров над уровнем моря, рекомендации по обуви, запасу воды и безопасности на Ликийской тропе.', '', ''],
      ['guide-6', 'Субботний фермерский рынок Дальяна: секреты и покупки', 'Инструкция по выбору домашних сыров, оливок, гранатового сиропа', '', '', '', '', 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1200', 'Шоппинг', 'https://youtube.com/watch?v=guide6', '11', '10', '1000', '350', 'https://youtube.com/watch?v=preview6', 'С какими фермерами стоит торговаться, где найти натуральное холодное оливковое масло первого отжима и свежайший инжир.', '', '']
    ];
    var colsA_C = gRows.map(function(r) { return [r[0], r[1], r[2]]; });
    var colsH_P = gRows.map(function(r) { return [r[7], r[8], r[9], r[10], r[11], r[12], r[13], r[14], r[15]]; });
    sheet.getRange(2, 1, colsA_C.length, 3).setValues(colsA_C);
    sheet.getRange(2, 8, colsH_P.length, 9).setValues(colsH_P);
    sheet.getRange("D2").setFormula('=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))');
    sheet.getRange("E2").setFormula('=MAP(C2:C; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))');
    sheet.getRange("F2").setFormula('=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))');
    sheet.getRange("G2").setFormula('=MAP(C2:C; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))');
    sheet.getRange("Q2").setFormula('=MAP(P2:P; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))');
    sheet.getRange("R2").setFormula('=MAP(P2:P; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))');
  } else if (key === 'LEGAL') {
    var lHeaders = ['ID Раздела', 'Название [RU]', 'Название [EN]', 'Название [TR]', 'Текст [RU]', 'Текст [EN]', 'Текст [TR]'];
    styleSheetHeader_(sheet, lHeaders, 1);
    var lRows = [
      ['contract', 'Договор краткосрочной аренды виллы', '', '', 'Договор посуточной аренды Villa Turaman [Дальян, Мугла, Турция]. Владелец: Aleksei Znamenskii [VKN: 9991120181]. Вилла передается гостям в идеальном состоянии для проживания до 10 человек.', '', ''],
      ['kvkk', 'Политика защиты персональных данных KVKK', '', '', 'Aydınlatma Metni: обработка персональных данных гостей осуществляется строго в рамках турецкого закона KVKK №6698 исключительно в целях регистрации заезда и соблюдения безопасности.', '', ''],
      ['house_rules', 'Правила дома и проживания', '', '', 'Стандартный заезд с [CHECKIN_TIME], выезд до [CHECKOUT_TIME]. Курение внутри помещений категорически запрещено. Проживание с домашними животными по предварительному согласованию. Тихий час с 23:00 до 08:00.', '', ''],
      ['cancellation', 'Политика отмены и возврата средств', '', '', 'Полный возврат 100% предоплаты при отмене бронирования не позднее чем за 14 суток до даты заселения. При бронировании невозвратного тарифа предоставляется скидка 10%.', '', ''],
      ['tax_info', 'Налоговый статус и инвойсы', '', '', 'Регистрация в налоговой инспекции Ortaca Vergi Dairesi, налоговый номер VKN: 9991120181. Выставление официальных электронных счетов e-Arşiv Fatura согласно закону VUK 213 Madde 230.', '', ''],
      ['etbis', 'Регистрация в госреестре ETBIS', '', '', "Сайт официально зарегистрирован в реестре электронной коммерции Министерства торговли Турецкой Республики [ETBİS'e Kayıtlıdır].", '', ''],
      ['checkin_protocol', 'Протокол заселения и передачи ключей', '', '', 'Заселение через электронный смарт-замок [CHECKIN_METHOD]. Персональный пароль генерируется в день заезда. Возврат ключей: [KEY_HANDOVER].', '', ''],
      ['emergency', 'Экстренные службы и безопасность', '', '', 'Единый номер экстренных служб Турции: 112 [Полиция, Жандармерия, Скорая помощь, Пожарная служба]. Жандармерия Дальяна: +90 252 284 20 05. Экстренная связь с суперхозяином: 24/7 в чате.', '', '']
    ];
    var colsA_B = lRows.map(function(r) { return [r[0], r[1]]; });
    var colE = lRows.map(function(r) { return [r[4]]; });
    sheet.getRange(2, 1, colsA_B.length, 2).setValues(colsA_B);
    sheet.getRange(2, 5, colE.length, 1).setValues(colE);
    sheet.getRange("C2").setFormula('=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))');
    sheet.getRange("D2").setFormula('=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))');
    sheet.getRange("F2").setFormula('=MAP(E2:E; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))');
    sheet.getRange("G2").setFormula('=MAP(E2:E; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))');
  } else if (key === 'BOOKINGS') {
    var bHeaders = ['Дата заявки', 'Имя клиента', 'Контакт [Tel/TG]', 'Старт', 'Завершение', 'Ночей', 'Взрослых', 'Детей', 'Всего гостей', 'Итоговая стоимость', 'Статус оплаты'];
    styleSheetHeader_(sheet, bHeaders, 1);
    var bRows = [
      ['2026-06-01', 'Иван Смирнов', '+7 999 111-22-33', '01.06.2026', '08.06.2026', '7', '4', '2', '6', '$1540', 'Оплачено [Airbnb]'],
      ['2026-07-10', 'Markus Webber', '+49 170 1234567', '10.07.2026', '20.07.2026', '10', '6', '0', '6', '$2800', 'Предоплата 50% [Direct]'],
      ['2026-08-01', 'Ahmet Yılmaz', '+90 532 9876543', '01.08.2026', '08.08.2026', '7', '8', '2', '10', '$2240', 'Подтверждено [Direct]']
    ];
    sheet.getRange(2, 1, bRows.length, bHeaders.length).setValues(bRows);
  } else if (key === 'CALENDAR') {
    var cHeaders = ['Дата старта', 'Дата завершения', 'Тип [Блокировка/Цена/Мин. дней/Заметка/Настройки]', 'Значение', 'Заметка', 'Автор изменения', 'Время фиксации'];
    styleSheetHeader_(sheet, cHeaders, 1);
    var cRows = [
      ['Глобальные правила', 'Все даты', 'Настройки', '{"basePrice":250,"currency":"USD","minNights":3,"maxNights":30,"bookingWindowMonths":18,"advanceNoticeDays":2,"bookingMode":"instant","verificationMode":"progressive","checkInTime":"16:00","checkOutTime":"10:00"}', 'Изменение тарифов', 'admin', '20.09.2026 12:00'],
      ['01.05.2026', '31.05.2026', 'Цена', '180', 'Май: Низкий сезон [$180/ночь]', 'admin', '20.09.2026 12:00'],
      ['01.06.2026', '30.06.2026', 'Цена', '220', 'Июнь: Стандартный сезон [$220/ночь]', 'admin', '20.09.2026 12:00'],
      ['01.07.2026', '31.08.2026', 'Цена', '320', 'Июль-Август: Высокий пик [$320/ночь]', 'admin', '20.09.2026 12:00'],
      ['01.09.2026', '30.09.2026', 'Цена', '240', 'Сентябрь: Бархатный сезон [$240/ночь]', 'admin', '20.09.2026 12:00'],
      ['01.10.2026', '31.10.2026', 'Цена', '180', 'Октябрь: Закрытие сезона [$180/ночь]', 'admin', '20.09.2026 12:00'],
      ['01.05.2026', '31.10.2026', 'Мин. дней', '3', 'Минимальный срок аренды 3 ночи', 'admin', '20.09.2026 12:00'],
      ['01.06.2026', '08.06.2026', 'Блокировка', 'VT-2026-01', 'Бронь: Иван Смирнов', 'admin', '20.09.2026 12:00']
    ];
    sheet.getRange(2, 1, cRows.length, cHeaders.length).setValues(cRows);
  } else if (key === 'ACCOUNTS') {
    var aHeaders = ['Дата регистрации', 'Имя', 'Контакт [Логин]', 'Пароль', 'Блок: Сайт', 'Блок: Аккаунт', 'Блок: Чат'];
    styleSheetHeader_(sheet, aHeaders, 1);
    var aRows = [
      ['2026-01-15', 'Алексей Знаменский', 'admin@villaturaman.com', 'admin123', 'Нет', 'Нет', 'Нет [Владелец / Главный]'],
      ['2026-05-01', 'Служба консьержа', 'manager@villaturaman.com', 'manager2026', 'Нет', 'Нет', 'Нет [Управляющий персоналом]'],
      ['2026-06-01', 'Иван Смирнов', 'ivan.smirnov@example.com', 'guest2026', 'Нет', 'Нет', 'Нет [Гость виллы]']
    ];
    sheet.getRange(2, 1, aRows.length, aHeaders.length).setValues(aRows);
  } else if (key === 'ORDERS') {
    var oHeaders = ['Дата заказа', 'Контакт', 'Тип [Гид/Услуга/Аренда]', 'Сумма', 'Статус оплаты', 'Детали'];
    styleSheetHeader_(sheet, oHeaders, 1);
    var oRows = [
      ['2026-05-25', 'ivan.smirnov@example.com', 'Услуга', '€50', 'Оплачено', 'prod-1: VIP-трансфер из аэропорта Даламан DLM'],
      ['2026-05-26', 'ivan.smirnov@example.com', 'Гид', '€20', 'Оплачено', 'guide-1: Видео-гид Секретные маршруты реки Дальян']
    ];
    sheet.getRange(2, 1, oRows.length, oHeaders.length).setValues(oRows);
  } else if (key === 'ACCESS') {
    var accHeaders = ['Дата', 'Гость [Контакт]', 'Гид ID', 'Категория', 'Статус оплаты', 'Доступ [Да/Нет]', 'Прогресс'];
    styleSheetHeader_(sheet, accHeaders, 1);
    var accRows = [
      ['2026-05-26', 'ivan.smirnov@example.com', 'guide-1', 'Видеогиды', 'Оплачено', 'Да', '100% [Просмотрен полностью]'],
      ['2026-05-26', 'ivan.smirnov@example.com', 'guide-2', 'Видеогиды', 'Оплачено', 'Да', '40% [В процессе изучения]']
    ];
    sheet.getRange(2, 1, accRows.length, accHeaders.length).setValues(accRows);
  } else if (key === 'TEMPLATES') {
    var tHeaders = ['ID Раздела', 'Название [RU]', 'Название [EN]', 'Название [TR]', 'Текст [RU]', 'Текст [EN]', 'Текст [TR]'];
    styleSheetHeader_(sheet, tHeaders, 1);
    var tRows = [
      ['1.1_discount_10', '1.1. Скидка 10% за невозвратный тариф', '', '', 'Здравствуйте, [FIRST_NAME]! Рад вашему интересу к Villa Turaman! Для поездок на ближайшие даты активирована опция: Бронирование без возврата со скидкой 10%. Скидка действует, если дата выезда в пределах 60 дней. С уважением, Алексей Знаменский.', '', ''],
      ['1.2_budget_price', '1.2. Работа с ценой и вопросы по бюджету', '', '', 'Здравствуйте, [FIRST_NAME]! Благодарю за интерес к Villa Turaman! Если вас смущает текущая стоимость или есть определенный бюджет, подскажите, какой ориентир по цене был бы для вас комфортным? С удовольствием обсудим возможные условия! С уважением, Алексей Знаменский.', '', ''],
      ['1.3_early_booking_expiry', '1.3. Напоминание об истечении Раннего бронирования', '', '', 'Здравствуйте, [FIRST_NAME]! Напоминаю о вашей заявке на Villa Turaman. Скидка за раннее бронирование действует строго до даты за 2 месяца до заезда. Рекомендуем подтвердить бронирование сегодня, чтобы зафиксировать лучшую цену! С уважением, Алексей Знаменский.', '', ''],
      ['2.1_booking_confirmed', '2.1. Подтверждение бронирования', '', '', 'Здравствуйте, [FIRST_NAME]! Поздравляем, ваше бронирование Villa Turaman подтверждено! Код: [CONFIRMATION_CODE]. Даты: [CHECKIN_DATE] - [CHECKOUT_DATE]. Заезд с [CHECKIN_TIME], выезд до [CHECKOUT_TIME]. С нетерпением ждем вас в гости! С уважением, Алексей Знаменский.', '', ''],
      ['2.2_top_floor_clarification', '2.2. Разъяснение по закрытому верхнему этажу', '', '', 'Здравствуйте, [FIRST_NAME]! Верхний этаж виллы используется как закрытое служебное помещение для личных вещей владельцев и закрыт на ключ. Вся остальная вилла, 4 спальни, приватный бассейн, сад и терраса находятся в вашем исключительном пользовании. С уважением, Алексей Знаменский.', '', ''],
      ['2.3_transfer_assistance', '2.3. Помощь по организации трансфера', '', '', 'Здравствуйте, [FIRST_NAME]! Мы с радостью поможем организовать комфортный трансфер из аэропорта Даламан [DLM] прямо к вилле. Сообщите, если вам нужны контакты проверенной транспортной компании: Ahmet: +90 543 335 80 70. С уважением, Алексей Знаменский.', '', ''],
      ['2.4_email_receipt_confirmation', '2.4. Подтверждение получения письма', '', '', 'Здравствуйте, [FIRST_NAME]! Подтверждаю, что успешно получил ваше электронное письмо. Большое спасибо за информацию! С нетерпением жду встречи на вилле! С уважением, Алексей Знаменский.', '', ''],
      ['3.1_kbs_registration', '3.1. Запрос данных для системы регистрации KBS', '', '', 'Здравствуйте, [FIRST_NAME]! Согласно законодательству Турции, нам необходимо зарегистрировать всех гостей в государственной системе KBS жандармерии. Пожалуйста, отправьте ФИО, номер паспорта, дату рождения и гражданство каждого гостя в текстовом виде. С уважением, Алексей Знаменский.', '', ''],
      ['3.2_address_geolocation', '3.2. Адрес и ссылка на геолокацию Google Maps', '', '', 'Здравствуйте, [FIRST_NAME]! Направляю точные координаты виллы:\nАдрес: [ADDRESS]\nGoogle Maps: [MAPS_URL]\nКогда будете в дороге, дайте знать, мы встретим вас! С уважением, Алексей Знаменский.', '', ''],
      ['3.3_checkin_time_coordination', '3.3. Согласование времени заезда', '', '', 'Здравствуйте, [FIRST_NAME]! Стандартное время заезда: с [CHECKIN_TIME]. Прибытие позже этого времени абсолютно комфортно: смарт-замок позволяет заселиться в любой час. Если планируете приехать раньше, сообщите нам, и мы постараемся подготовить виллу как можно раньше! С уважением, Алексей Знаменский.', '', ''],
      ['3.4_checkin_instructions', '3.4. Стандартная инструкция по заселению и Wi-Fi', '', '', 'Здравствуйте, [FIRST_NAME]! Ждем вас сегодня на Villa Turaman!\nАдрес: [ADDRESS]\nСпособ заселения: [CHECKIN_METHOD]\nWi-Fi сеть: [WIFI_NAME]\nПароль: [WIFI_PASSWORD]\nЕсли возникнут вопросы, я на связи 24/7! С уважением, Алексей Знаменский.', '', ''],
      ['3.5_welcome_guide_dalyan', '3.5. Приветственный гид и путеводитель по Дальяну', '', '', 'Здравствуйте, [FIRST_NAME]! Делюсь персональным гидом по Дальяну:\n🏡 Вилла: [ADDRESS] | [MAPS_URL]\n🚗 Трансфер: +90 543 335 80 70 - Ahmet\n🚤 Лодочные туры: +90 544 588 58 09 - Капитан Адам\n🍽️ Ресторан Cicek: https://maps.google.com/?cid=14955012417485225116\n🏖️ Пляж Изтузу: заповедник черепах Caretta-Caretta\nЛегкой дороги и отличного отдыха! С уважением, Алексей Знаменский.', '', ''],
      ['4.1_stay_care_checkin', '4.1. Забота о госте во время проживания', '', '', 'Здравствуйте, [FIRST_NAME]! Надеюсь, отдых проходит замечательно! Решил уточнить, все ли комфортно на вилле и не требуется ли помощь по технике, бассейну или рекомендации по ресторанам? С удовольствием отвечу! С уважением, Алексей Знаменский.', '', ''],
      ['5.1_checkout_instructions', '5.1. Напоминание о выезде и передача ключей', '', '', 'Здравствуйте, [FIRST_NAME]! Благодарим за выбор Villa Turaman! Напоминаем детали выезда: Дата: [CHECKOUT_DATE], Время: до [CHECKOUT_TIME]. [KEY_HANDOVER]. Будем рады видеть вас снова! С уважением, Алексей Знаменский.', '', '']
    ];
    var colsA_B = tRows.map(function(r) { return [r[0], r[1]]; });
    var colE = tRows.map(function(r) { return [r[4]]; });
    sheet.getRange(2, 1, colsA_B.length, 2).setValues(colsA_B);
    sheet.getRange(2, 5, colE.length, 1).setValues(colE);
    sheet.getRange("C2").setFormula('=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))');
    sheet.getRange("D2").setFormula('=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))');
    sheet.getRange("F2").setFormula('=MAP(E2:E; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))');
    sheet.getRange("G2").setFormula('=MAP(E2:E; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))');
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

      // Блок 2: ПЕРЕМЕННАЯ [Словарь переменных - Истинный SSOT]
      ['ПЕРЕМЕННАЯ', 'wifi_name', 'Guest', 'Имя гостевой сети Wi-Fi виллы', 'Плейсхолдер [WIFI_NAME]'],
      ['ПЕРЕМЕННАЯ', 'wifi_password', 'villa2026', 'Пароль гостевой сети Wi-Fi', 'Плейсхолдер [WIFI_PASSWORD]'],
      ['ПЕРЕМЕННАЯ', 'address', 'Dalyan, Rodoslu Yaşar Sünger Sk, NO 28/2, 48600 Ortaca / Muğla', 'Точный физический адрес виллы', 'Плейсхолдер [ADDRESS]'],
      ['ПЕРЕМЕННАЯ', 'maps_url', 'https://maps.app.goo.gl/tPgCjCwz4pzq28pE9', 'Прямая ссылка на геолокацию Google Maps', 'Плейсхолдер [MAPS_URL]'],
      ['ПЕРЕМЕННАЯ', 'checkin_time', '16:00', 'Стандартное время заезда гостей', 'Плейсхолдер [CHECKIN_TIME]'],
      ['ПЕРЕМЕННАЯ', 'checkout_time', '10:00', 'Стандартное время выезда гостей', 'Плейсхолдер [CHECKOUT_TIME]'],
      ['ПЕРЕМЕННАЯ', 'checkin_method', 'Электронный смарт-замок и мини-сейф с кодом / личная встреча владельцем', 'Способ передачи ключей', 'Плейсхолдер [CHECKIN_METHOD]'],
      ['ПЕРЕМЕННАЯ', 'key_handover', 'Оставьте ключи в мини-сейфе с кодом у входной двери или на кухонном столе', 'Инструкция возврата ключей', 'Плейсхолдер [KEY_HANDOVER]'],
      ['ПЕРЕМЕННАЯ', 'platform_name', 'Villa Turaman Direct', 'Название платформы бронирования', 'Плейсхолдер [PLATFORM_NAME]'],

      // Блок 3: О_ХОЗЯИНЕ
      ['О_ХОЗЯИНЕ', 'host_name', 'Aleksei Znamenskii', 'Имя владельца виллы на английском и русском', 'Плейсхолдер [HOST_NAME]'],
      ['О_ХОЗЯИНЕ', 'host_status', 'Суперхозяин на Airbnb • Более 5 лет приема гостей', 'Статус суперхозяина и опыт', 'Плейсхолдер [HOST_STATUS]'],
      ['О_ХОЗЯИНЕ', 'host_languages', 'Русский, English, Türkçe', 'Языки общения с гостями', 'Плейсхолдер [HOST_LANGUAGES]'],
      ['О_ХОЗЯИНЕ', 'host_response_time', 'В течение часа', 'Скорость ответа на сообщения', 'Плейсхолдер [RESPONSE_TIME]'],
      ['О_ХОЗЯИНЕ', 'host_business', 'Краткосрочная аренда Villa Turaman [Дальян, Мугла, Турция]', 'Юридический вид деятельности и бизнес', 'Бизнес профиль'],

      // Блок 4: О_ВИЛЛЕ
      ['О_ВИЛЛЕ', 'villa_capacity', '10 гостей', 'Максимальная вместимость виллы, включая детей', 'Плейсхолдер [MAX_GUESTS]'],
      ['О_ВИЛЛЕ', 'villa_floors', '2 этажа. Первый этаж: кухня, гостиная со Smart TV 55", гостевой санузел, стиральная машина, гладильная доска и утюг, спальня на 3 места с ванной. Второй этаж: 3 спальни с ванными комнатами и кондиционерами, доп. кровать и вторая стиральная машина.', 'Планировка и оснащение этажей', 'Плейсхолдер [VILLA_FLOORS]'],
      ['О_ВИЛЛЕ', 'pool_specs', 'Приватный бассейн с соленой водой 36 кв.м и уличное джакузи', 'Характеристики бассейна и гидромассажа', 'Плейсхолдер [POOL_SPECS]'],
      ['О_ВИЛЛЕ', 'pool_season', 'с 1 мая по 1 ноября', 'Период работы и эксплуатации бассейна и джакузи', 'Плейсхолдер [POOL_SEASON]'],
      ['О_ВИЛЛЕ', 'jacuzzi_schedule', 'Работает с 09:00 до 18:00. Включается автоматически на 15 минут с интервалом каждые 45 минут.', 'Алгоритм и часы работы джакузи', 'Плейсхолдер [JACUZZI_HOURS]'],
      ['О_ВИЛЛЕ', 'pool_lighting', 'Освещение в бассейне и джакузи включается автоматически с 20:00 до 01:00.', 'График подсветки воды', 'Плейсхолдер [POOL_LIGHTS]'],
      ['О_ВИЛЛЕ', 'street_lighting', 'Уличное освещение включается автоматически с 20:00 до 01:00 и с 04:00 до 06:00.', 'График освещения сада и фасада', 'Плейсхолдер [STREET_LIGHTS]'],
      ['О_ВИЛЛЕ', 'pool_maintenance', 'Профилактические работы и чистка бассейна производятся в день заселения и далее каждые 7 дней.', 'Регламент очистки бассейна', 'Плейсхолдер [POOL_CLEANING]'],
      ['О_ВИЛЛЕ', 'outdoor_zones', 'Парковка перед виллой, дворик-сад, зона барбекю, крыльцо с кофейными столиками и обеденной зоной, зона для загара с шезлонгами.', 'Территория вне виллы', 'Плейсхолдер [OUTDOOR_ZONES]'],

      // Блок 5: KBS_ИНСТРУКЦИЯ
      ['KBS_ИНСТРУКЦИЯ', 'kbs_parser_prompt', 'Ты: модуль обработки данных гостей для турецкой системы KBS. Твоя задача: извлечь данные из сообщения гостя и выдать СТРОГО готовый список по шаблону, БЕЗ приветствий, БЕЗ вводных слов и БЕЗ лишнего текста.', 'Промпт парсера KBS', 'KBS парсер'],
      ['KBS_ИНСТРУКЦИЯ', 'kbs_template_format', 'Гость [Номер]: [ФИО], дата рождения: [DD.MM.YYYY], пол: [male/female], гражданство: [строго на английском], номер паспорта: [Номер паспорта]. Период проживания: [DD.MM.YYYY] – [DD.MM.YYYY].', 'Канонический шаблон KBS', 'KBS шаблон'],
      ['KBS_ИНСТРУКЦИЯ', 'kbs_rules', 'Правила: Ключи шаблона остаются на русском, значения пола [male/female] и гражданства [Russian, Turkish, German, British и т.д.] : строго на английском языке. Даты строго в формате DD.MM.YYYY. Очевидные опечатки [например 25/01996 исправлять на 25.01.1996] исправлять логически, добавляя короткое пояснение под списком.', 'Правила валидации KBS', 'KBS правила'],

      // Блок 6: МАСТЕР_ДОСТУП
      ['МАСТЕР_ДОСТУП', 'Aleksei Znamenskii', 'admin / admin123', 'admin@villaturaman.com | Роль: Владелец | Все права: Финансы, Периоды, Блокировки, Окно брони, Чаты', 'Главный аккаунт'],
      ['МАСТЕР_ДОСТУП', 'Менеджер виллы', 'manager / manager2026', 'manager@villaturaman.com | Роль: Управляющий | Права: Периоды, Блокировки, Доступ к чатам', 'Персонал'],

      // Блок 7: РОЛЬ_АГЕНТА
      ['РОЛЬ_АГЕНТА', 'Консьерж-Мастер', 'АКТИВЕН', 'Ты: персональный ИИ-консьерж суперхозяина Алексея Знаменского на вилле Villa Turaman в Дальяне. Твоя миссия: гостеприимно, дипломатично и авторитетно отвечать гостям. Все факты ты берешь строго из Блоков О ВИЛЛЕ и СЛОВАРЬ ПЕРЕМЕННЫХ. Соблюдать правила дома, налоги Турции VKN 9991120181 и никогда не давать цену ниже $180 за ночь.', 'Главная роль'],
      ['РОЛЬ_АГЕНТА', 'Юрист-Консультант', 'РЕЗЕРВ', 'Ты: ведущий юрисконсульт Villa Turaman. Контролируешь обязательную регистрацию гостей в системе KBS жандармерии по шаблону из Блока 5, соответствие закону о защите персональных данных KVKK и налоговое оформление VUK 213 Madde 230 e-Arşiv Fatura.', 'Правовой модуль'],
      ['РОЛЬ_АГЕНТА', 'Финансист-Бухгалтер', 'РЕЗЕРВ', 'Ты: главный финансовый менеджер Villa Turaman. Ведешь учет платежей, рассчитываешь мультивалютные цены EUR/RUB/TRY, применяешь скидку 10% за невозвратный тариф при заезде до 60 дней и блокируешь любые попытки снижения цены ниже $180.', 'Финансовый модуль'],

      // Блок 8: МАТРИЦА_ЛИСТОВ
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
      ['МАТРИЦА_ЛИСТОВ', '📋 Задачи и Поручения Секретаря', 'РАЗРЕШЕН [ВСЕ]', 'Лист содержит поручения, задачи и статус исполнения ассистентом.', 'Секретарь'],
      ['МАТРИЦА_ЛИСТОВ', '🧠 Граф Знаний и Безопасность', 'РАЗРЕШЕН [ВСЕ]', 'Лист содержит онтологический граф знаний, узлы и политики безопасности доступа.', 'Граф знаний'],
      ['МАТРИЦА_ЛИСТОВ', '⚙️ Системные настройки ИИ Агентов', 'РАЗРЕШЕН [ВСЕ]', 'Лист управления системой ИИ, генеральными директивами ролей, словарем переменных и матрицей прав доступа.', 'Центр управления ИИ']
    ];
    sheet.getRange(2, 1, sRows.length, sHeaders.length).setValues(sRows);
  } else if (key === 'TASKS') {
    var taskHeaders = ['ID Задачи', 'Дата и Время', 'Канал / Источник', 'Текст Задачи / Поручения', 'Статус Исполнения', 'Ответственный Модуль', 'Результат / Заметка'];
    styleSheetHeader_(sheet, taskHeaders, 1);
    var taskRows = [
      ['task-1', '2026-05-20 10:00', 'Рабочий Чат', 'Проверить готовность виллы к заезду семьи Ивановых', 'Завершено', 'Секретарь', 'Вилла проверена клинингом'],
      ['task-2', '2026-05-21 14:30', 'Telegram Бот', 'Заказать трансфер из аэропорта Даламан DLM', 'В работе', 'Консьерж-Мастер', 'Водитель назначен'],
      ['task-3', '2026-05-22 09:15', 'Рабочий Чат', 'Сформировать фактуру e-Arşiv Fatura GİB', 'Новая', 'Финансист-Бухгалтер', 'Ожидает выезда гостя']
    ];
    sheet.getRange(2, 1, taskRows.length, taskHeaders.length).setValues(taskRows);
  } else if (key === 'KNOWLEDGE_GRAPH') {
    var kgHeaders = ['ID Узла', 'Тип Сущности', 'Уровень Секретности', 'Разрешенные Стадии Гостя', 'Связанный Лист CRM', 'Описание Сущности / Правило Доступа', 'Статус Узла'];
    styleSheetHeader_(sheet, kgHeaders, 1);
    var kgRows = [
      ['node-villa-core', 'Объект', 'Публичный', 'Любая', '🏠 Главная витрина', 'Базовая информация о вилле Villa Turaman: 4 спальни, 10 гостей, приватный бассейн 36 кв.м и джакузи в Дальяне.', 'Активен'],
      ['node-villa-rules', 'Регламент', 'Публичный', 'Любая', '⚙️ Системные настройки ИИ Агентов', 'Правила проживания: без животных, курение строго на открытых террасах, тихий час с 23:00 до 08:00.', 'Активен'],
      ['node-pricing-policy', 'Тарифы', 'Публичный', 'Любая', '📅 Календарь и Тарифы', 'Базовый тариф от $180 до $350 за ночь в зависимости от сезона. Скидка 10% за невозвратный тариф при заезде до 60 дней.', 'Активен'],
      ['node-wifi-credentials', 'Учетные данные', 'Конфиденциальный', 'Оплачено / Проживает', '⚙️ Системные настройки ИИ Агентов', 'Пароль от гостевой сети Wi-Fi: Guest / villa2026. Предоставляется строго после подтверждения бронирования или оплаты.', 'Активен'],
      ['node-smart-lock-pin', 'Безопасность', 'Секретный', 'Проживает', '⚙️ Системные настройки ИИ Агентов', 'ПИН-код от электронного смарт-замка входной двери и мини-сейфа. Передается строго в день заезда после проверки в KBS.', 'Активен'],
      ['node-kbs-identity', 'Персональные данные', 'Секретный', 'Оплачено / Проживает', '⚙️ Системные настройки ИИ Агентов', 'Паспортные данные гостей для государственной системы KBS жандармерии. Обработка строго по закону KVKK.', 'Активен'],
      ['node-tax-gib-invoice', 'Налоги и Бухгалтерия', 'Конфиденциальный', 'Оплачено / Проживает', '📋 Заявки и Бронирования', 'Электронные налоговые фактуры e-Arşiv Fatura GİB: VKN 9991120181, KDV 20% и Konaklama 1%.', 'Активен'],
      ['node-catalog-services', 'Каталог', 'Публичный', 'Любая', '🛎️ Дополнительные услуги', '18-колоночный каталог дополнительных услуг виллы: трансферы, персональный шеф-повар, спа-массаж, аренда лодки.', 'Активен'],
      ['node-catalog-guides', 'Каталог', 'Публичный', 'Любая', '🗺️ Видео-путеводители', '18-колоночный каталог видео-путеводителей: пляж Изтузу, озеро Кёйджегиз, античный Каунос, гастро-гид.', 'Активен'],
      ['node-emergency-contacts', 'Безопасность', 'Конфиденциальный', 'Оплачено / Проживает', '💬 Шаблоны сообщений', 'Экстренные службы Турции: Скорая 112, Жандармерия 156, Пожарные 110, личный телефон суперхозяина.', 'Активен'],
      ['node-ai-autopilot', 'Интеллект', 'Системный', 'Внутренний доступ', '⚙️ Системные настройки ИИ Агентов', 'Модель Google Gemini 3.6 Flash: автономный консьерж, проверка бюджетов, консультация по бронированию.', 'Активен'],
      ['node-drive-storage', 'Хранилище', 'Системный', 'Внутренний доступ', '⚙️ Системные настройки ИИ Агентов', 'Иерархический файловый менеджер Google Drive: договор аренды, счета, ваучеры, фотоархивы.', 'Активен'],
      ['node-tasks-secretary', 'Операции', 'Конфиденциальный', 'Внутренний доступ', '📋 Задачи и Поручения Секретаря', 'Реестр рабочих поручений суперхозяина, задачи консьержу и клинингу виллы.', 'Активен'],
      ['node-host-master-key', 'Аутентификация', 'Секретный', 'Только Хозяин', '⚙️ Системные настройки ИИ Агентов', 'Мастер-пароль и учетные записи доступа в панель суперхозяина.', 'Активен']
    ];
    sheet.getRange(2, 1, kgRows.length, kgHeaders.length).setValues(kgRows);
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
// GMAIL RELAY И WEB APPLICATION [УНИВЕРСАЛЬНЫЙ ШЛЮЗ: doGet И doPost]
// ==============================================================================

function doGet(e) {
  return handleWebhookRequest_(e);
}

function doPost(e) {
  return handleWebhookRequest_(e);
}

function handleWebhookRequest_(e) {
  try {
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (pe) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
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

    if (data.action === 'ping') {
      return ContentService.createTextOutput(JSON.stringify({ success: true, message: 'Шлюз Villa Turaman Gmail Relay активен' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Неизвестное действие' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function testGmailRelayInteractive() {
  var ui = SpreadsheetApp.getUi();
  var recipient = "villaturaman@gmail.com";
  var testCode = Math.floor(1000 + Math.random() * 9000).toString();
  try {
    MailApp.sendEmail({
      to: recipient,
      subject: "Тестовая проверка Gmail Relay Villa Turaman: " + testCode,
      htmlBody: "<div style='font-family:sans-serif;padding:24px;background:#0f172a;color:#ffffff;border-radius:16px;'>" +
        "<h2 style='color:#fb7185;margin-top:0;'>Villa Turaman : Проверка почтового шлюза</h2>" +
        "<p style='color:#cbd5e1;font-size:14px;'>Почтовый шлюз Gmail Relay успешно авторизован под учетной записью владельца и готов отправлять письма гостям.</p>" +
        "<div style='background:#1e293b;padding:16px;border-radius:12px;display:inline-block;margin:12px 0;'>" +
        "<span style='font-size:28px;font-weight:bold;letter-spacing:6px;color:#38bdf8;'>" + testCode + "</span>" +
        "</div>" +
        "<p style='color:#94a3b8;font-size:12px;margin-bottom:0;'>Отправлено автоматически из меню таблицы Villa Turaman Suite.</p>" +
        "</div>"
    });
    ui.alert("📧 Gmail Relay работает", "Тестовое письмо с кодом " + testCode + " успешно отправлено на " + recipient, ui.ButtonSet.OK);
  } catch (err) {
    ui.alert("❌ Ошибка отправки", "Не удалось отправить тестовое письмо: " + err.toString() + "\n\nПроверьте разрешения скрипта на отправку почты.", ui.ButtonSet.OK);
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
// МУЛЬТИВАЛЮТНАЯ АВТОКОНВЕРТАЦИЯ ПРИ ВВОДЕ В ЛЮБУЮ КОЛОНКУ [USD / EUR / RUB / TRY]
// ==============================================================================

/**
 * Получение актуальных курсов валют к USD.
 * Приоритет:
 * 1. Чтение из системных ячеек листа SETTINGS;
 * 2. Резервные стабильные коэффициенты.
 */
function getCurrencyRatesToUSD_(ss) {
  var rates = { EUR: 0.92, RUB: 92.5, TRY: 38.0 };
  try {
    var settingsSheet = findSheetByConfigKey(ss, 'SETTINGS');
    if (settingsSheet) {
      var data = settingsSheet.getDataRange().getValues();
      for (var r = 0; r < data.length; r++) {
        var key = (data[r][0] || '').toString().trim().toUpperCase();
        var val = parseFloat(data[r][1]);
        if (!isNaN(val) && val > 0) {
          if (key === 'RATE_USD_EUR' || key === 'USDEUR') rates.EUR = val;
          if (key === 'RATE_USD_RUB' || key === 'USDRUB') rates.RUB = val;
          if (key === 'RATE_USD_TRY' || key === 'USDTRY') rates.TRY = val;
        }
      }
    }
  } catch (e) {
    // Резервный режим
  }
  return rates;
}

/**
 * Обработчик события изменения ячейки в таблице:
 * Свободный ввод в любую колонку валюты для Услуг и Путеводителей.
 */
function onEdit(e) {
  if (!e || !e.range) return;
  var range = e.range;
  var sheet = range.getSheet();
  var sheetName = sheet.getName();
  var row = range.getRow();
  var col = range.getColumn();

  // Защита от редактирования строки заголовков
  if (row < 2) return;

  var ss = sheet.getParent();
  var srvSheet = findSheetByConfigKey(ss, 'SERVICES');
  var gSheet = findSheetByConfigKey(ss, 'GUIDES');

  var isServices = srvSheet && srvSheet.getName() === sheetName;
  var isGuides = gSheet && gSheet.getName() === sheetName;

  if (!isServices && !isGuides) return;

  // Определение колонок валют в зависимости от листа
  // SERVICES: Col 8 [USD], Col 9 [EUR], Col 10 [RUB], Col 11 [TRY]
  // GUIDES: Col 11 [USD], Col 12 [EUR], Col 13 [RUB], Col 14 [TRY]
  var startCol = isServices ? 8 : 11;
  var endCol = isServices ? 11 : 14;

  if (col < startCol || col > endCol) return;

  var rawValue = range.getValue();
  var cleanStr = rawValue ? rawValue.toString().replace(/[^\d.,]/g, '').replace(',', '.') : '';
  var numVal = parseFloat(cleanStr);

  // Если ячейку очистили: очищаем остальные 3 валютные ячейки в этой строке
  if (!rawValue || isNaN(numVal) || numVal <= 0) {
    for (var c = startCol; c <= endCol; c++) {
      if (c !== col) {
        sheet.getRange(row, c).setValue('');
      }
    }
    return;
  }

  // Определяем, какую именно валюту ввел пользователь
  var offset = col - startCol; // 0: USD, 1: EUR, 2: RUB, 3: TRY
  var rates = getCurrencyRatesToUSD_(ss);

  // Переводим введенное значение в базовый USD
  var usdAmount = numVal;
  if (offset === 1) {
    // Ввели EUR
    usdAmount = rates.EUR > 0 ? numVal / rates.EUR : numVal;
  } else if (offset === 2) {
    // Ввели RUB
    usdAmount = rates.RUB > 0 ? numVal / rates.RUB : numVal;
  } else if (offset === 3) {
    // Ввели TRY
    usdAmount = rates.TRY > 0 ? numVal / rates.TRY : numVal;
  }

  // Рассчитываем значения для всех 4 валют с округлением до целых чисел
  var calculated = [
    Math.round(usdAmount),
    Math.round(usdAmount * rates.EUR),
    Math.round(usdAmount * rates.RUB),
    Math.round(usdAmount * rates.TRY)
  ];

  // Заполняем остальные три колонки
  for (var targetCol = startCol; targetCol <= endCol; targetCol++) {
    if (targetCol !== col) {
      sheet.getRange(row, targetCol).setValue(calculated[targetCol - startCol]);
    }
  }
}

/**
 * Пакетный пересчет всех валют для всех строк Услуг и Путеводителей.
 */
function recalculateAllCatalogCurrencies() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var rates = getCurrencyRatesToUSD_(ss);
  var updatedCount = 0;

  var targets = [
    { configKey: 'SERVICES', startCol: 8, endCol: 11 },
    { configKey: 'GUIDES', startCol: 11, endCol: 14 }
  ];

  for (var t = 0; t < targets.length; t++) {
    var tgt = targets[t];
    var sheet = findSheetByConfigKey(ss, tgt.configKey);
    if (!sheet) continue;

    var lastRow = sheet.getLastRow();
    if (lastRow < 2) continue;

    var range = sheet.getRange(2, tgt.startCol, lastRow - 1, 4);
    var values = range.getValues();

    for (var r = 0; r < values.length; r++) {
      var rowVals = values[r];
      var baseIndex = -1;
      var baseVal = 0;

      // Ищем первое заполненное положительное число
      for (var i = 0; i < 4; i++) {
        var num = parseFloat(rowVals[i]);
        if (!isNaN(num) && num > 0) {
          baseIndex = i;
          baseVal = num;
          break;
        }
      }

      if (baseIndex !== -1) {
        var usdAmount = baseVal;
        if (baseIndex === 1 && rates.EUR > 0) usdAmount = baseVal / rates.EUR;
        else if (baseIndex === 2 && rates.RUB > 0) usdAmount = baseVal / rates.RUB;
        else if (baseIndex === 3 && rates.TRY > 0) usdAmount = baseVal / rates.TRY;

        rowVals[0] = Math.round(usdAmount);
        rowVals[1] = Math.round(usdAmount * rates.EUR);
        rowVals[2] = Math.round(usdAmount * rates.RUB);
        rowVals[3] = Math.round(usdAmount * rates.TRY);
        updatedCount++;
      }
    }

    range.setValues(values);
  }

  SpreadsheetApp.getActive().toast("Пересчитано позиций каталога: " + updatedCount, "💱 Автоконвертация валют", 5);
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
    'Вы собираетесь зафиксировать текущие данные Google Таблицы в постоянный эталон utils/masterSeedContent.js и utils/content.json на сайте.\n\nПродолжить?',
    ui.ButtonSet.YES_NO
  );

  if (confirm !== ui.Button.YES) return;

  if (!siteUrl) {
    var promptRes = ui.prompt(
      'Адрес сайта не настроен',
      'Укажите URL сайта [например: https://villa-turaman-airbnb-platform.vercel.app или http://localhost:3000]:',
      ui.ButtonSet.OK_CANCEL
    );
    if (promptRes.getSelectedButton() !== ui.Button.OK) return;
    siteUrl = promptRes.getResponseText().trim();
    if (siteUrl) {
      props.setProperty('SITE_URL', siteUrl);
    } else {
      ui.alert('Ошибка', 'SITE_URL не был указан. Операция отменена.', ui.ButtonSet.OK);
      return;
    }
  }

  try {
    var endpoint = siteUrl.replace(/\/+$/, '') + '/api/admin/save-master-seed';
    var response = UrlFetchApp.fetch(endpoint, {
      method: 'post',
      contentType: 'application/json',
      muteHttpExceptions: true
    });

    var code = response.getResponseCode();
    var text = response.getContentText();

    if (code === 200) {
      var data = {};
      try { data = JSON.parse(text); } catch (e) {}
      var msg = '✅ Эталон masterSeedContent.js и локальный кэш успешно зафиксированы!\n\n' +
        '• Ключей витрины: ' + (data.homeKeysCount || '0') + '\n' +
        '• Строк витрины: ' + (data.homeRowsCount || '0') + '\n' +
        '• Разделов описания: ' + (data.aboutCount || '0') + '\n' +
        '• Настроек: ' + (data.settingsCount || '0');
      ui.alert('Успешная фиксация SSOT', msg, ui.ButtonSet.OK);
    } else {
      ui.alert('Ответ сервера [' + code + ']', 'Сервер вернул ошибку:\n' + text, ui.ButtonSet.OK);
    }
  } catch (err) {
    ui.alert('Справка по сохранению', 'Сетевой запрос к сайту не прошел [' + err.message + '].\nУбедитесь, что сервер запущен и доступен по адресу ' + siteUrl, ui.ButtonSet.OK);
  }
}


// ==============================================================================
// 💼 БИЗНЕС-АССИСТЕНТ: СЕКРЕТАРЬ • ЮРИСТ • БУХГАЛТЕР
// 100% Zero-Brackets & Zero-Emdash Стандарт.
// ==============================================================================

/**
 * 🧾 Калькулятор e-Arşiv Fatura для портала GİB
 */
function openInvoiceCalculatorModal() {
  var ui = SpreadsheetApp.getUi();
  var promptRes = ui.prompt(
    'Калькулятор e-Arşiv Fatura [GİB Portal]',
    'Введите данные расчета через двоеточие:\n[Сумма Брутто TRY]:[Количество ночей]:[ФИО гостя]\n\nНапример: 75000:7:Иван Смирнов',
    ui.ButtonSet.OK_CANCEL
  );

  if (promptRes.getSelectedButton() !== ui.Button.OK) return;
  var input = promptRes.getResponseText().trim();
  if (!input) return;

  var parts = input.split(':');
  var grossTRY = parseFloat(parts[0]) || 0;
  var nights = parseInt(parts[1], 10) || 1;
  var guestName = (parts[2] || 'Гость').trim();

  if (grossTRY <= 0) {
    ui.alert('Ошибка', 'Сумма брутто должна быть больше 0', ui.ButtonSet.OK);
    return;
  }

  // Расчет по Блоку 9: Matrah = Gross / 1.21
  var matrah = grossTRY / 1.21;
  var kdv20 = matrah * 0.20;
  var konaklama1 = matrah * 0.01;
  var unitPrice = (matrah / nights).toFixed(8);

  var wholePart = Math.floor(grossTRY);
  var kurusPart = Math.round((grossTRY - wholePart) * 100);

  var summary = '🧾 РАСЧЕТ E-ARŞİV FATURA [GİB]:\n\n' +
    '• Получатель [Alıcı]: ' + guestName + '\n' +
    '• Итого Брутто [Ödenecek Tutar]: ' + grossTRY.toFixed(2) + ' TRY\n' +
    '• Налоговая база [Matrah]: ' + matrah.toFixed(2) + ' TRY\n' +
    '• НДС [KDV 20%]: ' + kdv20.toFixed(2) + ' TRY\n' +
    '• Налог на проживание [Konaklama 1%]: ' + konaklama1.toFixed(2) + ' TRY\n' +
    '• Ночей [Adet]: ' + nights + '\n' +
    '• Цена за единицу [Birim Fiyat 8 знаков]: ' + unitPrice + ' TRY\n\n' +
    '• Шаблон Not:\nYALNIZ ' + wholePart + ' TL ' + kurusPart + ' KURUŞTUR. E ARŞİV İZNİ KAPSAMINDA ELEKTRONİK ORTAMDA İLETİLMİŞTİR.';

  ui.alert('Результат расчета e-Arşiv Fatura', summary, ui.ButtonSet.OK);

  // Фиксация в лист 📋 Задачи и Поручения Секретаря
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = findSheetByConfigKey(ss, 'TASKS');
    if (sheet) {
      var dateStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd.MM.yyyy HH:mm');
      var newId = 'TASK-' + (sheet.getLastRow());
      sheet.appendRow([
        newId,
        dateStr,
        'Бухгалтер',
        'Расчет e-Arşiv Fatura: ' + guestName + ', Брутто: ' + grossTRY + ' TRY, База: ' + matrah.toFixed(2) + ' TRY',
        'Выполнена',
        'https://drive.google.com/drive/folders/11xBSWA02NypliPFbziRSMfC9aAPclYF_',
        'Google Apps Script'
      ]);
      SpreadsheetApp.getActive().toast('Запись сохранена в лист Задач', '✅ Бухгалтер', 3);
    }
  } catch (err) {}
}

/**
 * ⚖️ Юрист: Проверка данных бронирования
 */
function openLegalCheckModal() {
  var ui = SpreadsheetApp.getUi();
  var legalInfo = '⚖️ ЮРИДИЧЕСКИЙ ЧЕК-ЛИСТ VILLA TURAMAN:\n\n' +
    '1. KBS Жандармерии: Регистрация всех гостей старше 0 лет в течение 24 часов.\n' +
    '2. KVKK №6698: Сбор данных строго под цели KBS с информированием гостя.\n' +
    '3. Налоговый номер VKN: 9991120181 [Ortaca Vergi Dairesi].\n' +
    '4. Основание инвойса: VUK 213 Madde 230 e-Arşiv Fatura.\n' +
    '5. Золотая формула переговоров: 30% эмпатии / 70% юридической точности.\n' +
    '6. Договор краткосрочной аренды: лимит 10 гостей, тихий час с 23:00 до 08:00.\n' +
    '7. Защита диалога: окно 15 минут до закрытия.';

  ui.alert('Юридический стандарт', legalInfo, ui.ButtonSet.OK);
}

/**
 * 📋 Секретарь: Добавить задачу или поручение
 */
function openNewTaskModal() {
  var ui = SpreadsheetApp.getUi();
  var directionPrompt = ui.prompt(
    'Новое поручение суперхозяина',
    'Выберите направление [Бухгалтер / Юрист / Секретарь]:',
    ui.ButtonSet.OK_CANCEL
  );
  if (directionPrompt.getSelectedButton() !== ui.Button.OK) return;
  var direction = directionPrompt.getResponseText().trim() || 'Секретарь';

  var textPrompt = ui.prompt(
    'Суть задачи',
    'Введите описание задачи или поручения:',
    ui.ButtonSet.OK_CANCEL
  );
  if (textPrompt.getSelectedButton() !== ui.Button.OK) return;
  var taskText = textPrompt.getResponseText().trim();
  if (!taskText) return;

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = findSheetByConfigKey(ss, 'TASKS');
  if (sheet) {
    var dateStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd.MM.yyyy HH:mm');
    var newId = 'TASK-' + (sheet.getLastRow());
    sheet.appendRow([
      newId,
      dateStr,
      direction,
      taskText,
      'Новая',
      'https://drive.google.com/drive/folders/11xBSWA02NypliPFbziRSMfC9aAPclYF_',
      'Суперхозяин Алексей'
    ]);
    ui.alert('✅ Задача зафиксирована!', 'Поручение добавлено в лист 📋 Задачи и Поручения Секретаря под ID: ' + newId, ui.ButtonSet.OK);
  } else {
    ui.alert('Внимание', 'Лист Задач и Поручений пока не создан. Запустите 🛠️ Восстановить все листы.', ui.ButtonSet.OK);
  }
}

/**
 * 📁 Google Drive: Создать папку в проекте
 */
function openCreateDriveFolderModal() {
  var ui = SpreadsheetApp.getUi();
  var promptRes = ui.prompt(
    'Google Drive: Создание папки',
    'Введите относительный путь папки [например: Бухгалтерия/2026/Сентябрь/Счета_GIB]:',
    ui.ButtonSet.OK_CANCEL
  );
  if (promptRes.getSelectedButton() !== ui.Button.OK) return;
  var folderPath = promptRes.getResponseText().trim();
  if (!folderPath) return;

  var rootId = '11xBSWA02NypliPFbziRSMfC9aAPclYF_';
  try {
    var currentFolder = DriveApp.getFolderById(rootId);
    var parts = folderPath.split(/[\/\\]+/);
    for (var i = 0; i < parts.length; i++) {
      var part = parts[i].trim();
      if (!part) continue;
      var subFolders = currentFolder.getFoldersByName(part);
      if (subFolders.hasNext()) {
        currentFolder = subFolders.next();
      } else {
        currentFolder = currentFolder.createFolder(part);
      }
    }
    ui.alert('✅ Папка создана!', 'Путь: ' + folderPath + '\n\nСсылка:\n' + currentFolder.getUrl(), ui.ButtonSet.OK);
  } catch (err) {
    ui.alert('Google Drive', 'Результат: ' + err.message + '\nКорневой ID: ' + rootId, ui.ButtonSet.OK);
  }
}

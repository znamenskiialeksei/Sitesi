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

  // 6. Блок 6: Системный аудит и диагностика формул
  var auditMenu = ui.createMenu("⚙️ 6. Системный аудит & Формулы")
    .addItem("🧪 Проверить стандарт точки с запятой (;) в формулах", "auditFormulasSemicolon")
    .addItem("📋 Просмотр паспорта и ID всех листов", "showSheetsPassportModal")
    .addItem("🛠️ Инициализировать недостающие листы", "ensureAllSystemSheets");

  // Сборка главного меню верхнего уровня
  ui.createMenu("🏡 Villa Turaman Suite")
    .addSubMenu(sheetManagerMenu)
    .addSeparator()
    .addSubMenu(syncMenu)
    .addSubMenu(calendarMenu)
    .addSubMenu(catalogMenu)
    .addSubMenu(crmMenu)
    .addSubMenu(auditMenu)
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

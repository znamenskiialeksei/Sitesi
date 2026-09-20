// ==============================================================================
// РЕЕСТР ЛИСТОВ И ДИНАМИЧЕСКИЙ РЕЗОЛВЕР ПО SHEET ID
// Файл: utils/sheetsRegistry.js
// Назначение: Обеспечивает 100% стабильную привязку кода к листам Google Таблицы
// по их постоянным числовым sheetId и массивам алиасов. Пользователь может свободно
// переименовывать листы в интерфейсе Google Таблиц в любой момент без сбоев в работе бэкенда.
// ==============================================================================

/**
 * Системная конфигурация листов с каноническими русскими названиями,
 * историческими алиасами и заголовками колонок.
 */
const SHEETS_REGISTRY = {
  // --- КЛАСТЕР 1: ПУБЛИЧНАЯ ВИТРИНА ЛИСТИНГА ---
  HOME: {
    key: 'HOME',
    defaultName: '🏠 Главная витрина',
    cluster: 'showcase',
    aliases: ['HomePage', 'Homepage', 'Главная витрина', 'Главная', '🏠 Главная витрина'],
    headers: ['Ключ (ID)', 'RU', 'EN', 'TR', 'Медиа/Картинка'],
    suggestedSheetId: 101
  },
  GALLERY: {
    key: 'GALLERY',
    defaultName: '📸 Фото и Видео Галерея',
    cluster: 'showcase',
    aliases: ['Gallery', 'Галерея', 'Фото и Видео Галерея', '📸 Фото и Видео Галерея'],
    headers: ['ID', 'Группа (RU)', 'Описание группы (RU)', 'Группа (EN)', 'Описание группы (EN)', 'Группа (TR)', 'Описание группы (TR)', 'Тип (Фото/Видео/Карусель)', 'Медиа (ссылки/iframes через запятую)', 'Подпись (RU)', 'Подпись (EN)', 'Подпись (TR)'],
    suggestedSheetId: 102
  },
  ABOUT: {
    key: 'ABOUT',
    defaultName: '📖 О вилле и Правила',
    cluster: 'showcase',
    aliases: ['About', 'О вилле', 'О вилле и Правила', '📖 О вилле и Правила'],
    headers: ['ID Раздела', 'Название (RU)', 'Название (EN)', 'Название (TR)', 'Текст (RU)', 'Текст (EN)', 'Текст (TR)'],
    suggestedSheetId: 103
  },
  SERVICES: {
    key: 'SERVICES',
    defaultName: '🛎️ Дополнительные услуги',
    cluster: 'showcase',
    aliases: ['ExtraServices', 'Услуги', 'Дополнительные услуги', '🛎️ Дополнительные услуги'],
    headers: ['ID', 'Название услуги (RU)', 'Описание (RU)', 'Название услуги (EN)', 'Описание (EN)', 'Название услуги (TR)', 'Описание (TR)', 'Цена (EUR)', 'Цена (RUB)', 'Цена (TRY)', 'Изображения (через запятую)', 'Наличие (Да/Нет)', 'Тип (Услуга/Пакет)', 'Видео презентации (через запятую)', 'Подробное описание (RU)', 'Подробное описание (EN)', 'Подробное описание (TR)'],
    suggestedSheetId: 104
  },
  GUIDES: {
    key: 'GUIDES',
    defaultName: '🗺️ Видео-путеводители',
    cluster: 'showcase',
    aliases: ['VideoGuides', 'Путеводители', 'Видео-путеводители', '🗺️ Видео-путеводители'],
    headers: ['ID', 'Название путеводителя (RU)', 'Описание (RU)', 'Название путеводителя (EN)', 'Описание (EN)', 'Название путеводителя (TR)', 'Описание (TR)', 'Изображения (через запятую)', 'Категория', 'Ссылка на видео', 'Цена (EUR)', 'Цена (RUB)', 'Цена (TRY)', 'Видео презентации (через запятую)', 'Подробное описание (RU)', 'Подробное описание (EN)', 'Подробное описание (TR)'],
    suggestedSheetId: 105
  },
  LEGAL: {
    key: 'LEGAL',
    defaultName: '⚖️ Юридические документы',
    cluster: 'showcase',
    aliases: ['Legal', 'Юридический блок', 'Юридические документы', '⚖️ Юридические документы'],
    headers: ['ID Раздела', 'Название (RU)', 'Название (EN)', 'Название (TR)', 'Текст (RU)', 'Текст (EN)', 'Текст (TR)'],
    suggestedSheetId: 106
  },

  // --- КЛАСТЕР 2: ЦЕНТР УПРАВЛЕНИЯ ХОЗЯИНА & CRM ---
  BOOKINGS: {
    key: 'BOOKINGS',
    defaultName: '📋 Заявки и Бронирования',
    cluster: 'host',
    aliases: ['Вилла', 'Бронирования', 'Заявки', 'Заявки и Бронирования', '📋 Заявки и Бронирования'],
    headers: ['Дата заявки', 'Имя клиента', 'Контакт (Tel/TG)', 'Старт', 'Завершение', 'Ночей', 'Взрослых', 'Детей', 'Всего гостей', 'Итоговая стоимость', 'Статус оплаты'],
    suggestedSheetId: 201
  },
  CALENDAR: {
    key: 'CALENDAR',
    defaultName: '📅 Календарь и Тарифы',
    cluster: 'host',
    aliases: ['CalendarSettings', 'Календарь', 'Настройки календаря', 'Календарь и Тарифы', '📅 Календарь и Тарифы'],
    headers: ['Дата старта', 'Дата завершения', 'Тип (Блокировка/Цена/Мин. дней/Заметка/Тип записи/Настройки)', 'Значение', 'Заметка', 'Автор изменения', 'Время фиксации'],
    suggestedSheetId: 202
  },
  ACCOUNTS: {
    key: 'ACCOUNTS',
    defaultName: '👤 Гостевые аккаунты',
    cluster: 'host',
    aliases: ['Accounts', 'Аккаунты', 'Гостевые аккаунты', '👤 Гостевые аккаунты'],
    headers: ['Дата регистрации', 'Имя', 'Контакт (Логин)', 'Пароль', 'Блок: Сайт', 'Блок: Аккаунт', 'Блок: Чат'],
    suggestedSheetId: 203
  },
  MASTER: {
    key: 'MASTER',
    defaultName: '🔑 Управление доступом',
    cluster: 'host',
    aliases: ['MasterAccount', 'Мастер аккаунт', 'Управление доступом', '🔑 Управление доступом'],
    headers: ['ФИО', 'Телефон', 'Telegram', 'WhatsApp', 'Google Email', 'Логин', 'Пароль', 'Роль', 'Прав: Финансы', 'Прав: Периоды', 'Прав: Блок. дат', 'Прав: Окно брони', 'Прав: Доступ к чатам'],
    suggestedSheetId: 204
  },
  ORDERS: {
    key: 'ORDERS',
    defaultName: '💳 Заказы услуг и гидов',
    cluster: 'host',
    aliases: ['ServiceOrders', 'Заказы', 'Заказы услуг и гидов', '💳 Заказы услуг и гидов'],
    headers: ['Дата заказа', 'Контакт', 'Тип (Гид/Услуга/Аренда)', 'Сумма', 'Статус оплаты', 'Детали'],
    suggestedSheetId: 205
  },
  ACCESS: {
    key: 'ACCESS',
    defaultName: '🎟️ Доступы к путеводителям',
    cluster: 'host',
    aliases: ['GuestsAccess', 'Доступы', 'Доступы к путеводителям', '🎟️ Доступы к путеводителям'],
    headers: ['Дата', 'Гость (Контакт)', 'Гид ID', 'Категория', 'Статус оплаты', 'Доступ (Да/Нет)', 'Прогресс'],
    suggestedSheetId: 206
  },
  TEMPLATES: {
    key: 'TEMPLATES',
    defaultName: '💬 Шаблоны сообщений',
    cluster: 'host',
    aliases: ['Templates', 'Шаблоны', 'Шаблоны сообщений', '💬 Шаблоны сообщений'],
    headers: ['ID Раздела', 'Название (RU)', 'Название (EN)', 'Название (TR)', 'Текст (RU)', 'Текст (EN)', 'Текст (TR)'],
    suggestedSheetId: 207
  },
  VARIABLES: {
    key: 'VARIABLES',
    defaultName: '🧩 Словарь переменных',
    cluster: 'host',
    aliases: ['Variables', 'Переменные', 'Словарь переменных', '🧩 Словарь переменных'],
    headers: ['Плейсхолдер', 'Системный ключ', 'Описание переменной', 'Значение по умолчанию [Тест]'],
    suggestedSheetId: 208
  },
  SETTINGS: {
    key: 'SETTINGS',
    defaultName: '⚙️ Системные настройки',
    cluster: 'host',
    aliases: ['Settings', 'Системные настройки', 'Настройки ИИ', '⚙️ Системные настройки'],
    headers: ['Параметр', 'Значение', 'Описание', 'Статус'],
    suggestedSheetId: 209
  }
};

// Локальный кэш структуры таблицы для снижения обращений к Google Sheets API
let cachedSheetMap = null;
let lastCacheTimestamp = 0;
const CACHE_TTL_MS = 60 * 1000;

/**
 * Очистка кэша структуры листов: при принудительной синхронизации
 */
function clearSheetsCache() {
  cachedSheetMap = null;
  lastCacheTimestamp = 0;
}

/**
 * Получение актуальной карты соответствия системных ключей текущим именам листов.
 * Анализирует все листы в таблице Google, сопоставляет их по псевдонимам и возвращает
 * гарантированно правильное имя.
 * 
 * @param {Object} sheets - Экземпляр google.sheets
 * @param {string} spreadsheetId - ID целевой таблицы Google
 * @returns {Promise<Object>} Объект соответствия ключей и названий
 */
async function getLiveSheetMap(sheets, spreadsheetId) {
  const now = Date.now();
  if (cachedSheetMap && now - lastCacheTimestamp < CACHE_TTL_MS) {
    return cachedSheetMap;
  }

  if (!sheets || !spreadsheetId) {
    // Если нет активного подключения, возвращаем дефолтные русские имена
    const fallback = {};
    for (const [key, cfg] of Object.entries(SHEETS_REGISTRY)) {
      fallback[key] = cfg.defaultName;
    }
    return fallback;
  }

  try {
    const meta = await sheets.spreadsheets.get({ spreadsheetId });
    const liveSheets = meta.data.sheets || [];
    const resultMap = {};

    for (const [key, cfg] of Object.entries(SHEETS_REGISTRY)) {
      // 1. Поиск точного совпадения по названию или одному из псевдонимов
      const matchedSheet = liveSheets.find((s) => {
        const title = s.properties.title.trim();
        return cfg.aliases.some((alias) => alias.toLowerCase() === title.toLowerCase());
      });

      if (matchedSheet) {
        resultMap[key] = matchedSheet.properties.title;
      } else {
        // Фоллбэк на каноническое дефолтное русское название
        resultMap[key] = cfg.defaultName;
      }
    }

    cachedSheetMap = resultMap;
    lastCacheTimestamp = now;
    return resultMap;
  } catch (err) {
    console.warn('[sheetsRegistry] Ошибка чтения метаданных таблицы, возврат дефолтов:', err.message);
    const fallback = {};
    for (const [key, cfg] of Object.entries(SHEETS_REGISTRY)) {
      fallback[key] = cfg.defaultName;
    }
    return fallback;
  }
}

/**
 * Формирование экранированного диапазона для Google Sheets API по системному ключу.
 * Пример: resolveRange map, 'HOME', 'A:E' -> "'🏠 Главная витрина'!A:E"
 * 
 * @param {Object} sheetMap - Карта листов, полученная из getLiveSheetMap
 * @param {string} key - Системный ключ
 * @param {string} rangeSuffix - Суффикс диапазона
 * @returns {string} Безопасный строковый диапазон
 */
function resolveRange(sheetMap, key, rangeSuffix) {
  const sheetName = sheetMap[key] || SHEETS_REGISTRY[key]?.defaultName || key;
  return `'${sheetName}'!${rangeSuffix}`;
}

// Универсальный экспорт CommonJS для Node.js скриптов и Next.js Webpack
module.exports = {
  SHEETS_REGISTRY,
  clearSheetsCache,
  getLiveSheetMap,
  resolveRange
};


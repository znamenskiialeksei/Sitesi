// ==============================================================================
// РЕЕСТР ЛИСТОВ И ДИНАМИЧЕСКИЙ РЕЗОЛВЕР ПО SHEET ID
// Файл: utils/sheetsRegistry.js
// Назначение: Обеспечивает 100% стабильную привязку кода к 14 листам Google Таблицы CRM
// по их постоянным числовым sheetId и каноническим русским именам.
// Приоритет 1: постоянный числовой sheetId. Приоритет 2: каноническое русское имя.
// 100% Zero-Brackets & Zero-Emdash Стандарт.
// ==============================================================================

/**
 * Системная конфигурация 14 листов CRM с каноническими русскими названиями,
 * постоянными sheetId и заголовками колонок.
 * Строгий порядок следования листов от 1 до 14 [Блок 0.2 GEMINI.md].
 */
const SHEETS_REGISTRY = {
  // --- 1. HOME: Главная витрина [Лист 1] ---
  HOME: {
    key: 'HOME',
    defaultName: '🏠 Главная витрина',
    cluster: 'showcase',
    aliases: ['🏠 Главная витрина', 'Главная витрина', 'Главная', 'Витрина', '📖 О вилле и Правила', 'О вилле и Правила', 'О вилле', 'About'],
    headers: ['Блок / Раздел', 'Ключ [ID]', 'Место размещения / Описание [RU]', 'RU', 'EN', 'TR', 'Медиа / Иконка / Ссылка', 'Статус [Вкл/Выкл]'],
    suggestedSheetId: 101
  },

  // --- 2. GALLERY: Фото и Видео Галерея [Лист 2] ---
  GALLERY: {
    key: 'GALLERY',
    defaultName: '📸 Фото и Видео Галерея',
    cluster: 'showcase',
    aliases: ['📸 Фото и Видео Галерея', 'Фото и Видео Галерея', '📸 Фотогалерея', 'Фотогалерея', 'Галерея', 'Медиа'],
    headers: ['ID', 'Группа [RU]', 'Описание [RU]', 'Группа [EN]', 'Описание [EN]', 'Группа [TR]', 'Описание [TR]', 'Тип', 'Медиа ссылки', 'Подпись [RU]', 'Подпись [EN]', 'Подпись [TR]'],
    suggestedSheetId: 102
  },

  // --- 3. LEGAL: Юридические документы [Лист 3] ---
  LEGAL: {
    key: 'LEGAL',
    defaultName: '⚖️ Юридические документы',
    cluster: 'showcase',
    aliases: ['⚖️ Юридические документы', 'Юридические документы', '⚖️ Юридическая информация', 'Юридическая информация', 'Юридический блок', 'Реквизиты'],
    headers: ['ID Раздела', 'Название [RU]', 'Название [EN]', 'Название [TR]', 'Текст [RU]', 'Текст [EN]', 'Текст [TR]'],
    suggestedSheetId: 103
  },

  // --- 4. ACCESS: Управление доступом [Лист 4: PIN смарт-замков, Wi-Fi, протоколы] ---
  ACCESS: {
    key: 'ACCESS',
    defaultName: '🔑 Управление доступом',
    cluster: 'host',
    aliases: ['🔑 Управление доступом', 'Управление доступом', 'Безопасность и Доступ', 'Смарт замки', 'Коды доступа', 'MasterAccess'],
    headers: ['ID', 'Тип доступа [Замок/Wi-Fi/Сейф/Ворота]', 'Локация / Название', 'Код доступа / PIN / Пароль', 'Резервный пароль / Мастер-код', 'Срок действия / Статус', 'Инструкция для гостя [RU]', 'Инструкция [EN]', 'Инструкция [TR]', 'Заметка'],
    suggestedSheetId: 104
  },

  // --- 5. TEMPLATES: Шаблоны сообщений [Лист 5] ---
  TEMPLATES: {
    key: 'TEMPLATES',
    defaultName: '💬 Шаблоны сообщений',
    cluster: 'host',
    aliases: ['💬 Шаблоны сообщений', 'Шаблоны сообщений', 'Шаблоны', 'Быстрые ответы'],
    headers: ['ID Раздела', 'Название [RU]', 'Название [EN]', 'Название [TR]', 'Текст [RU]', 'Текст [EN]', 'Текст [TR]'],
    suggestedSheetId: 105
  },

  // --- 6. SETTINGS: Системные настройки ИИ Агентов [Лист 6] ---
  SETTINGS: {
    key: 'SETTINGS',
    defaultName: '⚙️ Системные настройки ИИ Агентов',
    cluster: 'system',
    aliases: ['⚙️ Системные настройки ИИ Агентов', 'Системные настройки ИИ Агентов', '⚙️ Системные настройки', 'Системные настройки', 'Настройки ИИ', 'MasterAccount', '🧩 Словарь переменных', 'Словарь переменных', 'Variables'],
    headers: ['Категория', 'Параметр / Роль / Лист', 'Значение / Статус доступа', 'Промпт / Описание / Инструкция', 'Заметка'],
    suggestedSheetId: 106
  },

  // --- 7. TASKS: Задачи и Поручения Секретаря [Лист 7] ---
  TASKS: {
    key: 'TASKS',
    defaultName: '📋 Задачи и Поручения Секретаря',
    cluster: 'host',
    aliases: ['📋 Задачи и Поручения Секретаря', 'Задачи и Поручения Секретаря', 'Задачи Секретаря', 'Поручения Секретаря', 'Задачи и Поручения'],
    headers: ['ID', 'Дата и Время', 'Направление [Бухгалтер/Юрист/Секретарь]', 'Суть задачи / Диалог', 'Статус [Новая/В работе/Выполнена]', 'Результат / Ссылка Drive', 'Исполнитель'],
    suggestedSheetId: 107
  },

  // --- 8. KNOWLEDGE_GRAPH: Граф Знаний и Безопасность [Лист 8] ---
  KNOWLEDGE_GRAPH: {
    key: 'KNOWLEDGE_GRAPH',
    defaultName: '🧠 Граф Знаний и Безопасность',
    cluster: 'system',
    aliases: ['🧠 Граф Знаний и Безопасность', 'Граф Знаний и Безопасность', 'Граф Знаний', 'KnowledgeGraph', 'Безопасность', 'Security'],
    headers: ['ID Узла', 'Тип Сущности', 'Уровень Секретности', 'Разрешенные Стадии Гостя', 'Связанный Лист CRM', 'Описание Сущности / Правило Доступа', 'Статус Узла'],
    suggestedSheetId: 108
  },

  // --- 9. ACCOUNTS: Гостевые аккаунты [Лист 9] ---
  ACCOUNTS: {
    key: 'ACCOUNTS',
    defaultName: '👤 Гостевые аккаунты',
    cluster: 'host',
    aliases: ['👤 Гостевые аккаунты', 'Гостевые аккаунты', 'Аккаунты гостей', 'Гости', 'Аккаунты'],
    headers: ['Дата регистрации', 'Имя', 'Контакт [Логин]', 'Пароль', 'Блок: Сайт', 'Блок: Аккаунт', 'Блок: Чат'],
    suggestedSheetId: 109
  },

  // --- 10. SERVICES: Дополнительные услуги [Лист 10] ---
  SERVICES: {
    key: 'SERVICES',
    defaultName: '🛎️ Дополнительные услуги',
    cluster: 'showcase',
    aliases: ['🛎️ Дополнительные услуги', 'Дополнительные услуги', 'Услуги', 'Сервисы', 'Платные услуги'],
    headers: ['ID', 'Название услуги [RU]', 'Описание [RU]', 'Название услуги [EN]', 'Описание [EN]', 'Название услуги [TR]', 'Описание [TR]', 'Цена [USD]', 'Цена [EUR]', 'Цена [RUB]', 'Цена [TRY]', 'Изображения', 'Наличие', 'Тип', 'Видео презентации', 'Подробное описание [RU]', 'Подробное описание [EN]', 'Подробное описание [TR]'],
    suggestedSheetId: 110
  },

  // --- 11. GUIDES: Видео-путеводители [Лист 11] ---
  GUIDES: {
    key: 'GUIDES',
    defaultName: '🗺️ Видео-путеводители',
    cluster: 'showcase',
    aliases: ['🗺️ Видео-путеводители', 'Видео-путеводители', 'Видеопутеводители', 'Путеводители', 'Гиды'],
    headers: ['ID', 'Название путеводителя [RU]', 'Описание [RU]', 'Название путеводителя [EN]', 'Описание [EN]', 'Название путеводителя [TR]', 'Описание [TR]', 'Изображения', 'Категория', 'Ссылка на видео', 'Цена [USD]', 'Цена [EUR]', 'Цена [RUB]', 'Цена [TRY]', 'Видео презентации', 'Подробное описание [RU]', 'Подробное описание [EN]', 'Подробное описание [TR]'],
    suggestedSheetId: 111
  },

  // --- 12. BOOKINGS: Заявки и Бронирования [Лист 12] ---
  BOOKINGS: {
    key: 'BOOKINGS',
    defaultName: '📋 Заявки и Бронирования',
    cluster: 'host',
    aliases: ['📋 Заявки и Бронирования', 'Заявки и Бронирования', '📋 Заявки на бронирование', 'Заявки на бронирование', 'Бронирования', 'Заявки', 'Вилла'],
    headers: ['Дата заявки', 'Имя клиента', 'Контакт [Tel/TG]', 'Старт', 'Завершение', 'Ночей', 'Взрослых', 'Детей', 'Всего гостей', 'Итоговая стоимость', 'Статус оплаты'],
    suggestedSheetId: 112
  },

  // --- 13. CALENDAR: Календарь и Тарифы [Лист 13] ---
  CALENDAR: {
    key: 'CALENDAR',
    defaultName: '📅 Календарь и Тарифы',
    cluster: 'host',
    aliases: ['📅 Календарь и Тарифы', 'Календарь и Тарифы', '📅 Календарь и Занятость', 'Календарь и Занятость', 'Календарь', 'Тарифы', 'Настройки календаря'],
    headers: ['Дата старта', 'Дата завершения', 'Тип [Блокировка/Цена/Мин. дней/Заметка/Настройки]', 'Значение', 'Заметка', 'Автор изменения', 'Время фиксации'],
    suggestedSheetId: 113
  },

  // --- 14. ORDERS: Заказы услуг и гидов [Лист 14] ---
  ORDERS: {
    key: 'ORDERS',
    defaultName: '🛍️ Заказы услуг и гидов',
    cluster: 'host',
    aliases: ['🛍️ Заказы услуг и гидов', 'Заказы услуг и гидов', '💳 Заказы услуг и гидов', 'Заказы', 'Заказы услуг'],
    headers: ['Дата заказа', 'Контакт', 'Тип [Гид/Услуга/Аренда]', 'Сумма', 'Статус оплаты', 'Детали'],
    suggestedSheetId: 114
  },

  // --- 15. GUIDE_ACCESS: Доступы к путеводителям [Лист 15: LMS студенты и покупатели] ---
  GUIDE_ACCESS: {
    key: 'GUIDE_ACCESS',
    defaultName: '🎟️ Доступы к путеводителям',
    cluster: 'host',
    aliases: ['🎟️ Доступы к путеводителям', 'Доступы к путеводителям', 'Доступы к гидам', 'Доступы', 'Студенты'],
    headers: ['Дата выдачи', 'Гость [Имя и Контакт]', 'ID Путеводителя', 'Название путеводителя', 'Категория', 'Статус оплаты', 'Токен доступа', 'Срок действия', 'Статус доступа [Активен/Отозван]'],
    suggestedSheetId: 115
  }
};

// Локальный кэш структуры таблицы для снижения обращений к Google Sheets API
let cachedSheetMap = null;
let lastCacheTimestamp = 0;
const CACHE_TTL_MS = 30 * 1000;

/**
 * Очистка кэша структуры листов: при принудительной синхронизации
 */
function clearSheetsCache() {
  cachedSheetMap = null;
  lastCacheTimestamp = 0;
}

/**
 * Получение актуальной карты соответствия системных ключей текущим именам листов.
 * Двухэтапный алгоритм гарантирует 100% надежность:
 * Этап 1: Поиск по постоянному числовому sheetId [защита от любого переименования в интерфейсе Google Таблиц].
 * Этап 2: Поиск по русскому каноническому имени или русским алиасам.
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
      // 1. Этап 1: Поиск по точному совпадению постоянного числового sheetId
      let matchedSheet = liveSheets.find((s) => {
        return s.properties && Number(s.properties.sheetId) === Number(cfg.suggestedSheetId);
      });

      // 2. Этап 2: Если по ID не найден [лист создан вручную] - поиск по русскому названию или алиасам
      if (!matchedSheet) {
        matchedSheet = liveSheets.find((s) => {
          const title = (s.properties.title || '').trim();
          return cfg.aliases.some((alias) => alias.toLowerCase() === title.toLowerCase());
        });
      }

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
 * Пример: resolveRange(map, 'HOME', 'A:E') -> "'🏠 Главная витрина'!A:E"
 */
function resolveRange(sheetMap, key, rangeSuffix) {
  const sheetName = sheetMap?.[key] || SHEETS_REGISTRY?.[key]?.defaultName || key;
  return `'${sheetName}'!${rangeSuffix}`;
}

module.exports = {
  SHEETS_REGISTRY,
  clearSheetsCache,
  getLiveSheetMap,
  resolveRange
};
module.exports.SHEETS_REGISTRY = SHEETS_REGISTRY;
module.exports.clearSheetsCache = clearSheetsCache;
module.exports.getLiveSheetMap = getLiveSheetMap;
module.exports.resolveRange = resolveRange;
module.exports.default = module.exports;
module.exports.__esModule = true;

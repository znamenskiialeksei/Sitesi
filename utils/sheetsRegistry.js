// ==============================================================================
// РЕЕСТР ЛИСТОВ И ДИНАМИЧЕСКИЙ РЕЗОЛВЕР ПО SHEET ID
// Файл: utils/sheetsRegistry.js
// Назначение: Обеспечивает 100% стабильную привязку кода к 15 листам Google Таблицы
// по их постоянным числовым sheetId и каноническим русским именам.
// Приоритет 1: постоянный числовой sheetId. Приоритет 2: каноническое русское имя.
// 100% Zero-Brackets & Zero-Emdash Стандарт.
// ==============================================================================

/**
 * Системная конфигурация 15 листов с каноническими русскими названиями,
 * постоянными sheetId и заголовками колонок.
 */
const SHEETS_REGISTRY = {
  // --- КЛАСТЕР 1: ПУБЛИЧНАЯ ВИТРИНА ЛИСТИНГА [SHOWCASE CLUSTER] ---
  HOME: {
    key: 'HOME',
    defaultName: '🏠 Главная витрина',
    cluster: 'showcase',
    aliases: ['🏠 Главная витрина', 'Главная витрина', 'Главная'],
    headers: ['Ключ [ID]', 'RU', 'EN', 'TR', 'Медиа / Ссылка'],
    suggestedSheetId: 101
  },
  ABOUT: {
    key: 'ABOUT',
    defaultName: '📖 О вилле и Правила',
    cluster: 'showcase',
    aliases: ['📖 О вилле и Правила', 'О вилле и Правила', 'О вилле'],
    headers: ['ID Раздела', 'Название [RU]', 'Название [EN]', 'Название [TR]', 'Текст [RU]', 'Текст [EN]', 'Текст [TR]'],
    suggestedSheetId: 102
  },
  GALLERY: {
    key: 'GALLERY',
    defaultName: '📸 Фотогалерея',
    cluster: 'showcase',
    aliases: ['📸 Фотогалерея', 'Фотогалерея', '📸 Фото и Видео Галерея', 'Фото и Видео Галерея', 'Галерея'],
    headers: ['ID', 'Группа [RU]', 'Описание [RU]', 'Группа [EN]', 'Описание [EN]', 'Группа [TR]', 'Описание [TR]', 'Тип', 'Медиа ссылки', 'Подпись [RU]', 'Подпись [EN]', 'Подпись [TR]'],
    suggestedSheetId: 103
  },
  REVIEWS: {
    key: 'REVIEWS',
    defaultName: '⭐ Отзывы гостей',
    cluster: 'showcase',
    aliases: ['⭐ Отзывы гостей', 'Отзывы гостей', 'Отзывы'],
    headers: ['ID', 'Имя гостя', 'Дата отзыва', 'Оценка', 'Текст [RU]', 'Текст [EN]', 'Текст [TR]', 'Категория', 'Статус'],
    suggestedSheetId: 104
  },
  BLOG: {
    key: 'BLOG',
    defaultName: '📰 Статьи и Блог',
    cluster: 'showcase',
    aliases: ['📰 Статьи и Блог', 'Статьи и Блог', 'Блог', 'Статьи'],
    headers: ['ID', 'Slug', 'Заголовок [RU]', 'Заголовок [EN]', 'Заголовок [TR]', 'Текст [RU]', 'Текст [EN]', 'Текст [TR]', 'Обложка', 'Дата публикации', 'Статус'],
    suggestedSheetId: 105
  },
  LEGAL: {
    key: 'LEGAL',
    defaultName: '⚖️ Юридическая информация',
    cluster: 'showcase',
    aliases: ['⚖️ Юридическая информация', 'Юридическая информация', 'Юридические документы', 'Юридический блок', 'Реквизиты'],
    headers: ['Ключ', 'Название [RU]', 'Название [EN]', 'Название [TR]', 'Значение / Текст документа'],
    suggestedSheetId: 106
  },
  FAQS: {
    key: 'FAQS',
    defaultName: '❓ Частые вопросы',
    cluster: 'showcase',
    aliases: ['❓ Частые вопросы', 'Частые вопросы', 'Вопросы и ответы', 'FAQ'],
    headers: ['ID', 'Категория', 'Вопрос [RU]', 'Вопрос [EN]', 'Вопрос [TR]', 'Ответ [RU]', 'Ответ [EN]', 'Ответ [TR]', 'Порядок'],
    suggestedSheetId: 107
  },

  // --- КЛАСТЕР 2: КАБИНЕТ ХОЗЯИНА, CRM И БЭК-ОФИС [HOST & OPERATIONS CLUSTER] ---
  BOOKINGS: {
    key: 'BOOKINGS',
    defaultName: '📋 Заявки на бронирование',
    cluster: 'host',
    aliases: ['📋 Заявки на бронирование', 'Заявки на бронирование', 'Заявки и Бронирования', '📋 Заявки и Бронирования', 'Бронирования', 'Заявки', 'Вилла'],
    headers: ['Дата заявки', 'Имя клиента', 'Контакт [Tel/TG]', 'Старт', 'Завершение', 'Ночей', 'Взрослых', 'Детей', 'Всего гостей', 'Итоговая стоимость', 'Статус оплаты'],
    suggestedSheetId: 108
  },
  CALENDAR: {
    key: 'CALENDAR',
    defaultName: '📅 Календарь и Занятость',
    cluster: 'host',
    aliases: ['📅 Календарь и Занятость', 'Календарь и Занятость', 'Календарь и Тарифы', '📅 Календарь и Тарифы', 'Календарь', 'Настройки календаря'],
    headers: ['Дата старта', 'Дата завершения', 'Тип [Блокировка/Цена/Мин. дней/Заметка/Настройки]', 'Значение', 'Заметка', 'Автор изменения', 'Время фиксации'],
    suggestedSheetId: 109
  },
  EXPENSES: {
    key: 'EXPENSES',
    defaultName: '💰 Учет расходов',
    cluster: 'host',
    aliases: ['💰 Учет расходов', 'Учет расходов', 'Расходы', 'Финансы виллы'],
    headers: ['ID', 'Дата расхода', 'Категория', 'Сумма', 'Валюта', 'Описание расхода', 'Получатель / Контрагент', 'Чек / Документ', 'Заметка'],
    suggestedSheetId: 110
  },
  CLEANING: {
    key: 'CLEANING',
    defaultName: '🧹 График клининга',
    cluster: 'host',
    aliases: ['🧹 График клининга', 'График клининга', 'Клининг', 'Уборка'],
    headers: ['ID', 'Дата уборки', 'Тип уборки [Пересменка/Генеральная]', 'Ответственный клинер', 'Статус готовности', 'Время начала', 'Время завершения', 'Чеклист чистоты', 'Замечания'],
    suggestedSheetId: 111
  },
  GUESTS: {
    key: 'GUESTS',
    defaultName: '👥 База гостей',
    cluster: 'host',
    aliases: ['👥 База гостей', 'База гостей', 'Гости', 'Гостевая база', 'Клиенты'],
    headers: ['ID Гостя', 'ФИО Гостя', 'Основной контакт [Телефон/WhatsApp/Telegram]', 'Email', 'Язык общения', 'Количество визитов', 'Суммарный доход', 'Персональная скидка', 'Предпочтения и заметки'],
    suggestedSheetId: 112
  },
  TEMPLATES: {
    key: 'TEMPLATES',
    defaultName: '💬 Шаблоны сообщений',
    cluster: 'host',
    aliases: ['💬 Шаблоны сообщений', 'Шаблоны сообщений', 'Шаблоны', 'Быстрые ответы'],
    headers: ['ID Раздела', 'Название [RU]', 'Название [EN]', 'Название [TR]', 'Текст [RU]', 'Текст [EN]', 'Текст [TR]'],
    suggestedSheetId: 113
  },
  VARIABLES: {
    key: 'VARIABLES',
    defaultName: '🧩 Словарь переменных',
    cluster: 'host',
    aliases: ['🧩 Словарь переменных', 'Словарь переменных', 'Переменные', 'Справочник реквизитов'],
    headers: ['Плейсхолдер', 'Системный ключ', 'Описание переменной', 'Значение по умолчанию [Тест]'],
    suggestedSheetId: 114
  },
  SETTINGS: {
    key: 'SETTINGS',
    defaultName: '⚙️ Системные настройки ИИ Агентов',
    cluster: 'host',
    aliases: ['⚙️ Системные настройки ИИ Агентов', 'Системные настройки ИИ Агентов', '⚙️ Системные настройки', 'Системные настройки', 'Настройки ИИ'],
    headers: ['Категория', 'Параметр / Роль / Лист', 'Значение / Статус доступа', 'Промпт / Описание / Инструкция', 'Заметка'],
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
  const sheetName = sheetMap[key] || SHEETS_REGISTRY[key]?.defaultName || key;
  return `'${sheetName}'!${rangeSuffix}`;
}

module.exports = {
  SHEETS_REGISTRY,
  clearSheetsCache,
  getLiveSheetMap,
  resolveRange
};

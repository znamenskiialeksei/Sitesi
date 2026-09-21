// ==============================================================================
// ЕДИНАЯ БАЗА ЗНАНИЙ ИИ-АГЕНТА И ДИНАМИЧЕСКИЙ SSOT ИЗ GOOGLE ТАБЛИЦ
// Файл: utils/aiKnowledgeBase.js
// Назначение: Загрузка базы знаний строго из листов Google Таблиц:
// Блок 1: СИСТЕМА
// Блок 2: ПЕРЕМЕННАЯ [Wi-Fi, адрес, прямые телефоны суперхозяина и партнера по трансферу]
// Блок 3: О_ХОЗЯИНЕ
// Блок 4: О_ВИЛЛЕ
// Блок 5: KBS_ИНСТРУКЦИЯ
// Блок 6: МАСТЕР_ДОСТУП
// Блок 7: РОЛЬ_АГЕНТА
// Блок 8: СТРАТЕГИЯ_ДИАЛОГА
// Блок 9: СЧЕТ_ФАКТУРА_GIB
// Блок 10: МАТРИЦА_ЛИСТОВ [динамическая подгрузка всех разрешенных листов CRM]
// Кэширование в global._aiKnowledgeCache с TTL 30 секунд.
// 100% Zero-Brackets & Zero-Emdash Стандарт.
// ==============================================================================

const { google } = require('googleapis');
const { getLiveSheetMap, resolveRange } = require('./sheetsRegistry');
const { globalKnowledgeGraph } = require('./aiKnowledgeGraph');
const {
  MASTER_SETTINGS_ROWS,
  MASTER_SERVICES_ROWS,
  MASTER_LEGAL_ROWS,
  MASTER_GUIDES_ROWS,
  MASTER_TEMPLATES_ROWS,
  MASTER_HOME_MAP,
  MASTER_TASKS_ROWS
} = require('./masterSeedContent');

// Время жизни кэша базы знаний в миллисекундах [30 секунд]
const KNOWLEDGE_CACHE_TTL_MS = 30 * 1000;

// Инициализация синглтона в глобальной памяти Node.js
if (!global._aiKnowledgeCache) {
  global._aiKnowledgeCache = {
    data: null,
    lastFetchedAt: 0,
    isFetching: false
  };
}

/**
 * Универсальный парсер приватного ключа PEM
 */
function parsePrivateKey(rawKey) {
  if (!rawKey) return '';
  let key = rawKey.replace(/^["']|["']$/g, '');
  key = key.replace(/\\\\n/g, '\n').replace(/\\n/g, '\n');
  key = key.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  return key.trim();
}

/**
 * Получение резервных данных из неприкосновенного эталона masterSeedContent.js
 * Категорический отказ от захардкоженных переменных внутри функции
 */
function getLocalFallbackKnowledge() {
  const settingsMap = {};
  const variablesObj = {};
  const hostInfo = {};
  const villaInfo = {};
  const kbsInfo = {};
  const masterAccess = [];
  const agentRoles = {};
  const dialogStrategy = {};
  const gibInvoice = {};
  const sheetMatrix = {};

  (MASTER_SETTINGS_ROWS || []).forEach((r) => {
    const col0 = (r[0] || '').toString().trim();
    const col1 = (r[1] || '').toString().trim();
    const col2 = (r[2] || '').toString().trim();
    const col3 = (r[3] || '').toString().trim();
    const col4 = (r[4] || '').toString().trim();

    if (col0 === 'СИСТЕМА') settingsMap[col1] = col2;
    else if (col0 === 'ПЕРЕМЕННАЯ') variablesObj[col1] = col2;
    else if (col0 === 'О_ХОЗЯИНЕ') hostInfo[col1] = col2;
    else if (col0 === 'О_ВИЛЛЕ') villaInfo[col1] = col2;
    else if (col0 === 'KBS_ИНСТРУКЦИЯ') kbsInfo[col1] = col2;
    else if (col0 === 'МАСТЕР_ДОСТУП') masterAccess.push({ name: col1, auth: col2, desc: col3, note: col4 });
    else if (col0 === 'РОЛЬ_АГЕНТА') agentRoles[col1] = { status: col2, prompt: col3, note: col4 };
    else if (col0 === 'СТРАТЕГИЯ_ДИАЛОГА') dialogStrategy[col1] = col2;
    else if (col0 === 'СЧЕТ_ФАКТУРА_GIB') gibInvoice[col1] = col2;
    else if (col0 === 'МАТРИЦА_ЛИСТОВ') sheetMatrix[col1] = { access: col2, prompt: col3, note: col4 };
  });

  const parsedServices = (MASTER_SERVICES_ROWS || []).map((r) => ({
    id: r[0] || '',
    name: r[1] || '',
    desc: r[2] || '',
    priceEur: r[7] || '',
    priceRub: r[8] || '',
    priceTry: r[9] || '',
    available: r[11] || 'Да',
    type: r[12] || '',
    details: r[14] || ''
  }));

  const parsedLegal = (MASTER_LEGAL_ROWS || []).map((r) => ({
    id: r[0] || '',
    title: r[1] || '',
    textRu: r[4] || '',
    textEn: r[5] || '',
    textTr: r[6] || ''
  }));

  const parsedGuides = (MASTER_GUIDES_ROWS || []).map((r) => ({
    id: r[0] || '',
    title: r[1] || '',
    desc: r[2] || '',
    priceEur: r[10] || '',
    videoUrl: r[9] || ''
  }));

  const parsedTemplates = (MASTER_TEMPLATES_ROWS || []).map((r) => ({
    id: r[0] || '',
    title: { ru: r[1] || '', en: r[2] || '', tr: r[3] || '' },
    content: { ru: r[4] || '', en: r[5] || '', tr: r[6] || '' }
  }));

  // Построение графа знаний
  globalKnowledgeGraph.buildFromSheetsData({
    settingsMap: { ...settingsMap, ...variablesObj, ...hostInfo, ...villaInfo, ...dialogStrategy, ...gibInvoice },
    services: parsedServices,
    guides: parsedGuides,
    legal: parsedLegal,
    templates: parsedTemplates
  });

  return {
    source: 'master_seed_fallback',
    aiMode: settingsMap['ai_mode'] || 'copilot',
    aiEnabled: true,
    geminiModel: settingsMap['ai_model'] || process.env.GEMINI_MODEL || 'gemini-3.6-flash',
    minPriceUsd: parseInt(settingsMap['min_night_price'] || '180', 10),
    systemPrompt: agentRoles['Консьерж-Мастер']?.prompt || '',
    blocks: {
      system: settingsMap,
      variables: variablesObj,
      host: hostInfo,
      villa: villaInfo,
      kbs: kbsInfo,
      masterAccess,
      roles: agentRoles,
      dialogStrategy,
      gibInvoice,
      sheetMatrix
    },
    variables: variablesObj,
    host: hostInfo,
    villa: villaInfo,
    kbs: kbsInfo,
    agentRoles,
    dialogStrategy,
    gibInvoice,
    sheetMatrix,
    services: parsedServices,
    legal: parsedLegal,
    guides: parsedGuides,
    templates: parsedTemplates,
    home: MASTER_HOME_MAP || {},
    tasks: MASTER_TASKS_ROWS || [],
    graph: globalKnowledgeGraph
  };
}

/**
 * Основной экспортируемый метод получения актуальной базы знаний ИИ
 * Читает живую Google Таблицу и динамически подключает листы по Блоку 10
 * @param {boolean} forceRefresh - принудительный сброс кэша
 * @returns {Promise<Object>} База знаний
 */
async function getAiKnowledgeBase(forceRefresh = false) {
  const now = Date.now();
  const cache = global._aiKnowledgeCache;

  if (!forceRefresh && cache.data && (now - cache.lastFetchedAt < KNOWLEDGE_CACHE_TTL_MS)) {
    return cache.data;
  }

  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
  const clientEmail = (process.env.GOOGLE_CLIENT_EMAIL || '').trim();
  const rawKey = (process.env.GOOGLE_PRIVATE_KEY || '').trim();

  const isRealServiceAccount =
    clientEmail &&
    rawKey &&
    spreadsheetId &&
    spreadsheetId !== 'your_google_sheet_id' &&
    !clientEmail.includes('your-service-account-email') &&
    !rawKey.includes('YOUR_PRIVATE_KEY');

  if (!isRealServiceAccount) {
    const fallback = getLocalFallbackKnowledge();
    cache.data = fallback;
    cache.lastFetchedAt = now;
    return fallback;
  }

  try {
    const privateKey = parsePrivateKey(rawKey);
    const auth = new google.auth.GoogleAuth({
      credentials: { client_email: clientEmail, private_key: privateKey },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const sheetMap = await getLiveSheetMap(sheets, spreadsheetId);

    const safeGet = async (key, rangeSuffix) => {
      const range = resolveRange(sheetMap, key, rangeSuffix);
      try {
        const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });
        return response.data.values || [];
      } catch (err) {
        console.warn(`[aiKnowledgeBase] Предупреждение чтения диапазона ${range}:`, err.message);
        return [];
      }
    };

    // 1. Первичная загрузка листа системных настроек [SETTINGS]
    const settingsRows = await safeGet('SETTINGS', 'A:E');

    const settingsMap = {};
    const variablesObj = {};
    const hostInfo = {};
    const villaInfo = {};
    const kbsInfo = {};
    const masterAccess = [];
    const agentRoles = {};
    const dialogStrategy = {};
    const gibInvoice = {};
    const sheetMatrix = {};

    settingsRows.slice(1).forEach((r) => {
      const col0 = (r[0] || '').toString().trim();
      const col1 = (r[1] || '').toString().trim();
      const col2 = (r[2] || '').toString().trim();
      const col3 = (r[3] || '').toString().trim();
      const col4 = (r[4] || '').toString().trim();

      if (col0 === 'СИСТЕМА') {
        if (col1) settingsMap[col1] = col2;
      } else if (col0 === 'ПЕРЕМЕННАЯ') {
        if (col1) variablesObj[col1] = col2;
      } else if (col0 === 'О_ХОЗЯИНЕ') {
        if (col1) hostInfo[col1] = col2;
      } else if (col0 === 'О_ВИЛЛЕ') {
        if (col1) villaInfo[col1] = col2;
      } else if (col0 === 'KBS_ИНСТРУКЦИЯ') {
        if (col1) kbsInfo[col1] = col2;
      } else if (col0 === 'МАСТЕР_ДОСТУП') {
        if (col1) masterAccess.push({ name: col1, auth: col2, desc: col3, note: col4 });
      } else if (col0 === 'РОЛЬ_АГЕНТА') {
        if (col1) agentRoles[col1] = { status: col2 || 'АКТИВЕН', prompt: col3 || '', note: col4 || '' };
      } else if (col0 === 'СТРАТЕГИЯ_ДИАЛОГА') {
        if (col1) dialogStrategy[col1] = col2;
      } else if (col0 === 'СЧЕТ_ФАКТУРА_GIB') {
        if (col1) gibInvoice[col1] = col2;
      } else if (col0 === 'МАТРИЦА_ЛИСТОВ') {
        if (col1) sheetMatrix[col1] = { access: col2 || 'РАЗРЕШЕН', prompt: col3 || '', note: col4 || '' };
      } else if (col0) {
        settingsMap[col0] = col1;
      }
    });

    // 2. Определение динамических разрешений листов по Блоку 10 [МАТРИЦА_ЛИСТОВ]
    const isSheetAllowed = (sheetName) => {
      const entry = Object.entries(sheetMatrix).find(([name]) =>
        name.toLowerCase().includes(sheetName.toLowerCase())
      );
      if (!entry) return true; // По умолчанию открыт для витрины
      const status = (entry[1]?.access || '').toUpperCase();
      return status.includes('РАЗРЕШЕН') || status.includes('РАЗРЕШЕНО') || status.includes('АКТИВЕН');
    };

    // 3. Параллельная подгрузка разрешенных листов CRM
    const fetchPromises = [];

    // Услуги
    fetchPromises.push(isSheetAllowed('услуги') ? safeGet('SERVICES', 'A:Q') : Promise.resolve([]));
    // Юридические документы
    fetchPromises.push(isSheetAllowed('юридическ') ? safeGet('LEGAL', 'A:G') : Promise.resolve([]));
    // Путеводители
    fetchPromises.push(isSheetAllowed('путеводител') ? safeGet('GUIDES', 'A:Q') : Promise.resolve([]));
    // Шаблоны сообщений
    fetchPromises.push(isSheetAllowed('шаблон') ? safeGet('TEMPLATES', 'A:G') : Promise.resolve([]));
    // Главная витрина
    fetchPromises.push(isSheetAllowed('витрина') ? safeGet('HOME', 'A:H') : Promise.resolve([]));
    // Календарь
    fetchPromises.push(isSheetAllowed('календар') ? safeGet('CALENDAR', 'A:G') : Promise.resolve([]));
    // Задачи секретаря
    fetchPromises.push(isSheetAllowed('задачи') ? safeGet('TASKS', 'A:G') : Promise.resolve([]));

    const [
      servicesRows,
      legalRows,
      guidesRows,
      templatesRows,
      homeRows,
      calendarRows,
      tasksRows
    ] = await Promise.all(fetchPromises);

    // 4. Парсинг каталога услуг
    const parsedServices = servicesRows.length > 1
      ? servicesRows.slice(1).map((r) => ({
          id: r[0] || '',
          name: r[1] || '',
          desc: r[2] || '',
          nameEn: r[3] || '',
          descEn: r[4] || '',
          nameTr: r[5] || '',
          descTr: r[6] || '',
          priceEur: r[7] || '',
          priceRub: r[8] || '',
          priceTry: r[9] || '',
          available: r[11] || 'Да',
          type: r[12] || '',
          details: r[14] || ''
        })).filter((s) => s.id)
      : (MASTER_SERVICES_ROWS || []).map((r) => ({ id: r[0], name: r[1], desc: r[2], priceEur: r[7], priceTry: r[9], details: r[14] }));

    // 5. Парсинг юридических документов
    const parsedLegal = legalRows.length > 1
      ? legalRows.slice(1).map((r) => ({
          id: r[0] || '',
          title: r[1] || '',
          titleEn: r[2] || '',
          titleTr: r[3] || '',
          textRu: r[4] || '',
          textEn: r[5] || '',
          textTr: r[6] || ''
        })).filter((l) => l.id)
      : (MASTER_LEGAL_ROWS || []).map((r) => ({ id: r[0], title: r[1], textRu: r[4] }));

    // 6. Парсинг видео-путеводителей
    const parsedGuides = guidesRows.length > 1
      ? guidesRows.slice(1).map((r) => ({
          id: r[0] || '',
          title: r[1] || '',
          desc: r[2] || '',
          videoUrl: r[9] || '',
          priceEur: r[10] || '',
          priceTry: r[12] || ''
        })).filter((g) => g.id)
      : (MASTER_GUIDES_ROWS || []).map((r) => ({ id: r[0], title: r[1], desc: r[2], videoUrl: r[9], priceEur: r[10] }));

    // 7. Парсинг шаблонов сообщений
    const parsedTemplates = templatesRows.length > 1
      ? templatesRows.slice(1).map((r) => ({
          id: r[0] || '',
          title: { ru: r[1] || '', en: r[2] || '', tr: r[3] || '' },
          content: { ru: r[4] || '', en: r[5] || '', tr: r[6] || '' }
        })).filter((t) => t.id)
      : (MASTER_TEMPLATES_ROWS || []).map((r) => ({ id: r[0], title: { ru: r[1], en: r[2], tr: r[3] }, content: { ru: r[4], en: r[5], tr: r[6] } }));

    // 8. Парсинг витрины
    const homeObj = {};
    if (homeRows.length > 1) {
      homeRows.slice(1).forEach((r) => {
        const key = r[1] || r[0];
        if (key) {
          homeObj[key.toString().trim()] = {
            ru: r[3] || r[1] || '',
            en: r[4] || r[2] || '',
            tr: r[5] || r[3] || '',
            media: r[6] || r[4] || ''
          };
        }
      });
    }

    // 9. Парсинг задач секретаря
    const parsedTasks = tasksRows.length > 1
      ? tasksRows.slice(1).map((r) => ({
          id: r[0] || '',
          timestamp: r[1] || '',
          direction: r[2] || '',
          taskText: r[3] || '',
          status: r[4] || '',
          resultUrl: r[5] || '',
          assignee: r[6] || ''
        }))
      : (MASTER_TASKS_ROWS || []).map((r) => ({ id: r[0], timestamp: r[1], direction: r[2], taskText: r[3], status: r[4], resultUrl: r[5], assignee: r[6] }));

    // 10. Актуализация графа знаний в памяти
    globalKnowledgeGraph.buildFromSheetsData({
      settingsMap: { ...settingsMap, ...variablesObj, ...hostInfo, ...villaInfo, ...dialogStrategy, ...gibInvoice },
      services: parsedServices,
      guides: parsedGuides,
      legal: parsedLegal,
      templates: parsedTemplates
    });

    const aiMode = (settingsMap['ai_mode'] || 'copilot').toLowerCase();
    const aiEnabled = aiMode !== 'off';
    const geminiModel = settingsMap['ai_model'] || process.env.GEMINI_MODEL || 'gemini-3.6-flash';
    const minPriceUsd = parseInt(settingsMap['min_night_price'] || '180', 10);
    const systemPrompt = agentRoles['Консьерж-Мастер']?.prompt || '';

    const knowledgeBase = {
      source: 'google_sheets_live',
      aiMode,
      aiEnabled,
      geminiModel,
      minPriceUsd,
      systemPrompt,
      blocks: {
        system: settingsMap,
        variables: variablesObj,
        host: hostInfo,
        villa: villaInfo,
        kbs: kbsInfo,
        masterAccess,
        roles: agentRoles,
        dialogStrategy,
        gibInvoice,
        sheetMatrix
      },
      variables: variablesObj,
      host: hostInfo,
      villa: villaInfo,
      kbs: kbsInfo,
      agentRoles,
      dialogStrategy,
      gibInvoice,
      sheetMatrix,
      services: parsedServices,
      legal: parsedLegal,
      guides: parsedGuides,
      templates: parsedTemplates,
      home: Object.keys(homeObj).length > 0 ? homeObj : MASTER_HOME_MAP,
      calendar: calendarRows.slice(1),
      tasks: parsedTasks,
      graph: globalKnowledgeGraph
    };

    cache.data = knowledgeBase;
    cache.lastFetchedAt = now;
    return knowledgeBase;
  } catch (err) {
    console.error('[aiKnowledgeBase] Ошибка загрузки базы знаний из Google Sheets:', err.message);
    const fallback = getLocalFallbackKnowledge();
    cache.data = fallback;
    cache.lastFetchedAt = now;
    return fallback;
  }
}

/**
 * Сброс кэша базы знаний
 */
function invalidateAiKnowledgeCache() {
  if (global._aiKnowledgeCache) {
    global._aiKnowledgeCache.lastFetchedAt = 0;
    global._aiKnowledgeCache.data = null;
  }
}

module.exports = {
  getAiKnowledgeBase,
  invalidateAiKnowledgeCache,
  KNOWLEDGE_CACHE_TTL_MS
};

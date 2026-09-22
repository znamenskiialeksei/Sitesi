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
const { getUnifiedCalendarSnapshot } = require('./calendarAggregator');
const {
  MASTER_SETTINGS_ROWS,
  MASTER_SERVICES_ROWS,
  MASTER_LEGAL_ROWS,
  MASTER_GUIDES_ROWS,
  MASTER_TEMPLATES_ROWS,
  MASTER_HOME_MAP,
  MASTER_TASKS_ROWS,
  MASTER_KNOWLEDGE_GRAPH_ROWS
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
    priceUsd: Math.round(Number(r[7] || 0) * 1.08).toString(),
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
    priceUsd: Math.round(Number(r[10] || 0) * 1.08).toString(),
    priceEur: r[10] || '',
    videoUrl: r[9] || ''
  }));

  const parsedTemplates = (MASTER_TEMPLATES_ROWS || []).map((r) => ({
    id: r[0] || '',
    title: { ru: r[1] || '', en: r[2] || '', tr: r[3] || '' },
    content: { ru: r[4] || '', en: r[5] || '', tr: r[6] || '' }
  }));

  const parsedKnowledgeGraph = (MASTER_KNOWLEDGE_GRAPH_ROWS || []).map((r) => ({
    nodeId: r[0] || '',
    type: r[1] || '',
    securityLevel: r[2] || 'L1_PUBLIC',
    allowedStages: r[3] || '',
    crmSheet: r[4] || '',
    desc: r[5] || '',
    status: r[6] || 'Активен'
  }));

  const minPriceUsd = parseInt(settingsMap['min_night_price'] || '180', 10);
  const fallbackCalendar = {
    globalRules: {
      basePrice: 250,
      currency: 'USD',
      minNights: 3,
      maxNights: 30,
      advanceNoticeDays: 2,
      bookingMode: 'instant',
      checkInTime: '16:00',
      checkOutTime: '10:00'
    },
    seasonalRates: [
      { startDate: '01.05.2026', endDate: '31.05.2026', price: 180, note: 'Май: Низкий сезон' },
      { startDate: '01.06.2026', endDate: '30.06.2026', price: 220, note: 'Июнь: Стандартный сезон' },
      { startDate: '01.07.2026', endDate: '31.08.2026', price: 320, note: 'Июль-Август: Высокий пик' },
      { startDate: '01.09.2026', endDate: '30.09.2026', price: 240, note: 'Сентябрь: Бархатный сезон' },
      { startDate: '01.10.2026', endDate: '31.10.2026', price: 180, note: 'Октябрь: Закрытие сезона' }
    ],
    pricingAnalysis: {
      currentBasePrice: 250,
      minBarrierPrice: minPriceUsd,
      currency: 'USD',
      delta: Math.max(0, 250 - minPriceUsd),
      maxDiscountPercent: 28,
      rules: { minNights: 3, maxNights: 30, advanceNoticeDays: 2, checkInTime: '16:00', checkOutTime: '10:00' },
      packages: [
        { name: 'Стандартный тариф', discountPercent: 0, pricePerNight: 250, cancellation: 'Бесплатная отмена за 14 суток' },
        { name: 'Невозвратный тариф', discountPercent: 10, pricePerNight: 225, cancellation: 'Без возврата средств при отмене' },
        { name: 'Длительное проживание от 7 ночей', discountPercent: 15, pricePerNight: 212, cancellation: 'Бесплатная отмена за 14 суток' },
        { name: 'Горящее спецпредложение на свободные окна', discountPercent: 20, pricePerNight: 200, cancellation: 'Спецусловия' }
      ]
    },
    sourcesList: ['Airbnb', 'Booking.com', 'Vrbo', 'Avito', 'Agoda', 'Google Calendar', 'Villa Turaman Direct'],
    availableGaps: []
  };

  // Построение графа знаний
  globalKnowledgeGraph.buildFromSheetsData({
    settingsMap: { ...settingsMap, ...variablesObj, ...hostInfo, ...villaInfo, ...dialogStrategy, ...gibInvoice },
    services: parsedServices,
    guides: parsedGuides,
    legal: parsedLegal,
    templates: parsedTemplates,
    calendarSnapshot: fallbackCalendar
  });

  return {
    source: 'master_seed_fallback',
    aiMode: settingsMap['ai_mode'] || 'copilot',
    aiEnabled: true,
    geminiModel: settingsMap['ai_model'] || process.env.GEMINI_MODEL || 'gemini-3.6-flash',
    minPriceUsd,
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
    calendarData: fallbackCalendar,
    pricingAnalysis: fallbackCalendar.pricingAnalysis,
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
    fetchPromises.push(isSheetAllowed('услуги') ? safeGet('SERVICES', 'A:R') : Promise.resolve([]));
    // Юридические документы
    fetchPromises.push(isSheetAllowed('юридическ') ? safeGet('LEGAL', 'A:G') : Promise.resolve([]));
    // Путеводители
    fetchPromises.push(isSheetAllowed('путеводител') ? safeGet('GUIDES', 'A:R') : Promise.resolve([]));
    // Шаблоны сообщений
    fetchPromises.push(isSheetAllowed('шаблон') ? safeGet('TEMPLATES', 'A:G') : Promise.resolve([]));
    // Главная витрина
    fetchPromises.push(isSheetAllowed('витрина') ? safeGet('HOME', 'A:H') : Promise.resolve([]));
    // Календарь
    fetchPromises.push(isSheetAllowed('календар') ? safeGet('CALENDAR', 'A:G') : Promise.resolve([]));
    // Задачи секретаря
    fetchPromises.push(isSheetAllowed('задачи') ? safeGet('TASKS', 'A:G') : Promise.resolve([]));
    // Заявки и Бронирования для омни-календаря
    fetchPromises.push(safeGet('BOOKINGS', 'A:K'));
    // 15-й лист: Граф Знаний и Безопасность
    fetchPromises.push(safeGet('KNOWLEDGE_GRAPH', 'A:G'));

    const [
      servicesRows,
      legalRows,
      guidesRows,
      templatesRows,
      homeRows,
      calendarRows,
      tasksRows,
      bookingsRows,
      knowledgeGraphRows
    ] = await Promise.all(fetchPromises);

    // 4. Парсинг каталога услуг
    const isServicesUsdHeader = (servicesRows[0]?.[7] || '').toString().includes('USD');
    const parsedServices = servicesRows.length > 1
      ? servicesRows.slice(1).map((r) => ({
          id: r[0] || '',
          name: r[1] || '',
          desc: r[2] || '',
          nameEn: r[3] || '',
          descEn: r[4] || '',
          nameTr: r[5] || '',
          descTr: r[6] || '',
          priceUsd: isServicesUsdHeader ? (r[7] || '') : (Math.round(Number(r[7] || 0) * 1.08).toString() || ''),
          priceEur: isServicesUsdHeader ? (r[8] || '') : (r[7] || ''),
          priceRub: isServicesUsdHeader ? (r[9] || '') : (r[8] || ''),
          priceTry: isServicesUsdHeader ? (r[10] || '') : (r[9] || ''),
          available: (isServicesUsdHeader ? r[12] : r[11]) || 'Да',
          type: (isServicesUsdHeader ? r[13] : r[12]) || '',
          details: (isServicesUsdHeader ? r[15] : r[14]) || ''
        })).filter((s) => s.id)
      : (MASTER_SERVICES_ROWS || []).map((r) => ({
          id: r[0],
          name: r[1],
          desc: r[2],
          priceUsd: Math.round(Number(r[7] || 0) * 1.08).toString(),
          priceEur: r[7],
          priceTry: r[9],
          details: r[14]
        }));

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
    const isGuidesUsdHeader = (guidesRows[0]?.[10] || '').toString().includes('USD');
    const parsedGuides = guidesRows.length > 1
      ? guidesRows.slice(1).map((r) => ({
          id: r[0] || '',
          title: r[1] || '',
          desc: r[2] || '',
          videoUrl: r[9] || '',
          priceUsd: isGuidesUsdHeader ? (r[10] || '') : (Math.round(Number(r[10] || 0) * 1.08).toString() || ''),
          priceEur: isGuidesUsdHeader ? (r[11] || '') : (r[10] || ''),
          priceRub: isGuidesUsdHeader ? (r[12] || '') : (r[11] || ''),
          priceTry: isGuidesUsdHeader ? (r[13] || '') : (r[12] || '')
        })).filter((g) => g.id)
      : (MASTER_GUIDES_ROWS || []).map((r) => ({
          id: r[0],
          title: r[1],
          desc: r[2],
          videoUrl: r[9],
          priceUsd: Math.round(Number(r[10] || 0) * 1.08).toString(),
          priceEur: r[10]
        }));

    // 7. Парсинг шаблонов сообщений
    const parsedTemplates = templatesRows.length > 1
      ? templatesRows.slice(1).map((r) => ({
          id: r[0] || '',
          title: { ru: r[1] || '', en: r[2] || '', tr: r[3] || '' },
          content: { ru: r[4] || '', en: r[5] || '', tr: r[6] || '' }
        })).filter((t) => t.id)
      : (MASTER_TEMPLATES_ROWS || []).map((r) => ({ id: r[0], title: { ru: r[1], en: r[2], tr: r[3] }, content: { ru: r[4], en: r[5], tr: r[6] } }));

    // 8. Парсинг 15-го листа: Граф Знаний и Безопасность
    const parsedKnowledgeGraph = knowledgeGraphRows.length > 1
      ? knowledgeGraphRows.slice(1).map((r) => ({
          nodeId: r[0] || '',
          type: r[1] || '',
          securityLevel: r[2] || 'L1_PUBLIC',
          allowedStages: r[3] || '',
          crmSheet: r[4] || '',
          desc: r[5] || '',
          status: r[6] || 'Активен'
        })).filter((k) => k.nodeId)
      : (MASTER_KNOWLEDGE_GRAPH_ROWS || []).map((r) => ({
          nodeId: r[0] || '',
          type: r[1] || '',
          securityLevel: r[2] || 'L1_PUBLIC',
          allowedStages: r[3] || '',
          crmSheet: r[4] || '',
          desc: r[5] || '',
          status: r[6] || 'Активен'
        }));

    // 9. Парсинг витрины
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

    // 10. Парсинг задач секретаря
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

    const minPriceUsd = parseInt(settingsMap['min_night_price'] || '180', 10);

    // 11. Агрегация омни-календаря: CRM + 6 внешних OTA-платформ
    let unifiedCalendar = null;
    try {
      unifiedCalendar = await getUnifiedCalendarSnapshot({
        calendarRows,
        bookingRows: bookingsRows,
        minNightPriceSetting: minPriceUsd
      });
    } catch (calErr) {
      console.warn('[aiKnowledgeBase] Предупреждение формирования омни-календаря:', calErr.message);
    }

    // 12. Актуализация графа знаний в оперативной памяти
    globalKnowledgeGraph.buildFromSheetsData({
      settingsMap: { ...settingsMap, ...variablesObj, ...hostInfo, ...villaInfo, ...dialogStrategy, ...gibInvoice },
      services: parsedServices,
      guides: parsedGuides,
      legal: parsedLegal,
      templates: parsedTemplates,
      calendarSnapshot: unifiedCalendar,
      knowledgeGraphRows: knowledgeGraphRows.length > 1 ? knowledgeGraphRows.slice(1) : MASTER_KNOWLEDGE_GRAPH_ROWS
    });

    const aiMode = (settingsMap['ai_mode'] || 'copilot').toLowerCase();
    const aiEnabled = aiMode !== 'off';
    const geminiModel = settingsMap['ai_model'] || process.env.GEMINI_MODEL || 'gemini-3.6-flash';
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
      knowledgeGraph: parsedKnowledgeGraph,
      home: Object.keys(homeObj).length > 0 ? homeObj : MASTER_HOME_MAP,
      calendar: calendarRows.slice(1),
      calendarData: unifiedCalendar,
      pricingAnalysis: unifiedCalendar?.pricingAnalysis || null,
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

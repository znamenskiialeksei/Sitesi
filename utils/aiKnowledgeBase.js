// ==============================================================================
// ЕДИНАЯ БАЗА ЗНАНИЙ ИИ-АГЕНТА И КЭШИРУЮЩИЙ СИНГЛТОН
// Файл: utils/aiKnowledgeBase.js
// Назначение: Загрузка базы знаний из листов Google Таблиц:
// 1. ⚙️ Системные настройки [SETTINGS] -> AI_MODE, GEMINI_MODEL, MIN_NIGHTLY_PRICE_USD, SYSTEM_PROMPT
// 2. 💬 Шаблоны сообщений [TEMPLATES] -> 14 эталонных сценариев на RU, EN, TR
// 3. 🧩 Словарь переменных [VARIABLES] -> актуальные реквизиты, Wi-Fi, адрес, инструкции
// 4. 🏠 Главная витрина [HOME] -> спецификации, Superhost, спальни, правила
// 5. 📖 О вилле и Правила [ABOUT] -> удобства, описание, разделы виллы
// Кэширование в global._aiKnowledgeCache с TTL 30 секунд.
// 100% Zero-Brackets & Zero-Emdash Стандарт.
// ==============================================================================

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const { getLiveSheetMap, resolveRange } = require('./sheetsRegistry');
const { SMART_TEMPLATES } = require('./templatesData');

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
 * Получение резервных данных при отсутствии связи с Google Таблицей
 */
function getLocalFallbackKnowledge() {
  let fallbackContent = {};
  try {
    const fallbackPath = path.join(process.cwd(), 'utils', 'content.json');
    if (fs.existsSync(fallbackPath)) {
      fallbackContent = JSON.parse(fs.readFileSync(fallbackPath, 'utf8'));
    }
  } catch (err) {
    console.warn('[aiKnowledgeBase] Предупреждение чтения content.json:', err.message);
  }

  return {
    source: 'local_fallback',
    aiMode: 'copilot',
    aiEnabled: true,
    geminiModel: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
    minPriceUsd: 180,
    systemPrompt: 'Ты профессиональный ИИ-консьерж виллы Villa Turaman в городе Дальян, Турция. Твоя цель: помогать гостям и формулировать вежливые, точные и гостеприимные ответы на языке обращения гостя [RU, EN, TR]. Минимальный допустимый тариф за ночь составляет 180 USD. Скидка 10% действует только при невозвратном тарифе на даты до 60 дней.',
    variables: {
      wifiName: 'VillaTuraman_5G',
      wifiPassword: 'DalyanTuramanGuest2026',
      address: 'Villa Turaman, Dalyan, Rodoslu Yasar Sunger Sk, NO 28/2, 48600 Ortaca / Mugla',
      minPriceUsd: '180 USD',
      transferPrice: '50 EUR',
      checkInTime: '16:00',
      checkOutTime: '10:00'
    },
    templates: SMART_TEMPLATES || [],
    home: fallbackContent.home || {},
    about: fallbackContent.about || {}
  };
}

/**
 * Основной экспортируемый метод получения актуальной базы знаний ИИ
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
        console.warn(`[aiKnowledgeBase] Не удалось прочитать диапазон ${range}:`, err.message);
        return [];
      }
    };

    // Параллельное чтение 5 листов базы знаний
    const [
      settingsRows,
      templatesRows,
      variablesRows,
      homeRows,
      aboutRows
    ] = await Promise.all([
      safeGet('SETTINGS', 'A:D'),
      safeGet('TEMPLATES', 'A:G'),
      safeGet('VARIABLES', 'A:D'),
      safeGet('HOME', 'A:E'),
      safeGet('ABOUT', 'A:G')
    ]);

    // 1. Разбор системных настроек [SETTINGS]
    const settingsObj = {};
    settingsRows.slice(1).forEach((r) => {
      if (r[0]) {
        settingsObj[r[0].toString().trim()] = (r[1] || '').toString().trim();
      }
    });

    const aiMode = (settingsObj['AI_MODE'] || 'copilot').toLowerCase();
    const aiEnabled = (settingsObj['AI_ENABLED'] || 'TRUE').toUpperCase() === 'TRUE';
    const geminiModel = settingsObj['GEMINI_MODEL'] || process.env.GEMINI_MODEL || 'gemini-3.6-flash';
    const minPriceUsd = parseInt(settingsObj['MIN_NIGHTLY_PRICE_USD'] || '180', 10);
    const systemPrompt = settingsObj['SYSTEM_PROMPT'] || '';

    // 2. Разбор словаря переменных [VARIABLES]
    const variablesObj = {};
    variablesRows.slice(1).forEach((r) => {
      if (r[1]) {
        variablesObj[r[1].toString().trim()] = (r[3] || '').toString().trim();
      }
      if (r[0]) {
        variablesObj[r[0].toString().trim()] = (r[3] || '').toString().trim();
      }
    });

    // 3. Разбор шаблонов [TEMPLATES]
    let loadedTemplates = [];
    if (templatesRows.length > 1) {
      loadedTemplates = templatesRows.slice(1).map((r) => ({
        id: r[0] || '',
        title: { ru: r[1] || '', en: r[2] || '', tr: r[3] || '' },
        content: { ru: r[4] || '', en: r[5] || '', tr: r[6] || '' }
      })).filter((t) => t.id);
    }
    if (loadedTemplates.length === 0) {
      loadedTemplates = SMART_TEMPLATES;
    }

    // 4. Разбор витрины [HOME]
    const homeObj = {};
    homeRows.slice(1).forEach((r) => {
      if (r[0]) {
        homeObj[r[0].toString().trim()] = {
          ru: r[1] || '',
          en: r[2] || '',
          tr: r[3] || '',
          media: r[4] || ''
        };
      }
    });

    // 5. Разбор описания и удобств [ABOUT]
    const aboutObj = {};
    aboutRows.slice(1).forEach((r) => {
      if (r[0]) {
        aboutObj[r[0].toString().trim()] = {
          title: { ru: r[1] || '', en: r[2] || '', tr: r[3] || '' },
          text: { ru: r[4] || '', en: r[5] || '', tr: r[6] || '' }
        };
      }
    });

    const knowledgeBase = {
      source: 'google_sheets_live',
      aiMode,
      aiEnabled,
      geminiModel,
      minPriceUsd,
      systemPrompt: systemPrompt || getLocalFallbackKnowledge().systemPrompt,
      variables: variablesObj,
      templates: loadedTemplates,
      home: homeObj,
      about: aboutObj
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

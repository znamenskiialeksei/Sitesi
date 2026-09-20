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
    about: fallbackContent.about || {},
    agentRoles: {
      КОНСЬЕРЖ_МАСТЕР: { status: 'АКТИВЕН', prompt: 'Ты Главный ИИ-Консьерж Villa Turaman. Веди гостеприимный диалог с гостем, помогай с бронированием, трансфером, экскурсиями по Дальяну и удобствами виллы.' },
      ЮРИСТ_КОНСУЛЬТАНТ: { status: 'АКТИВЕН', prompt: 'Ты Юрисконсульт Villa Turaman. Контролируй соблюдение турецкого законодательства VUK 213, закона о защите данных KVKK и условий краткосрочной аренды виллы.' },
      ФИНАНСИСТ_БУХГАЛТЕР: { status: 'АКТИВЕН', prompt: 'Ты Финансовый аудитор Villa Turaman. Контролируй минимальную планку цен 180 USD, предоплаты 30%, возвратные залоги и учет расходов.' }
    },
    sheetMatrix: {}
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

    // Параллельное чтение 3 ключевых листов базы знаний
    const [
      settingsRows,
      templatesRows,
      homeRows
    ] = await Promise.all([
      safeGet('SETTINGS', 'A:E'),
      safeGet('TEMPLATES', 'A:G'),
      safeGet('HOME', 'A:H')
    ]);

    // 1. Разбор структурированных блоков системных настроек [SETTINGS]
    const settingsObj = {};
    const agentRoles = {};
    const sheetMatrix = {};
    const variablesObj = {};
    const hostInfo = {};
    const villaInfo = {};
    const kbsInfo = {};
    const masterAccess = [];

    settingsRows.slice(1).forEach((r) => {
      const col0 = (r[0] || '').toString().trim();
      const col1 = (r[1] || '').toString().trim();
      const col2 = (r[2] || '').toString().trim();
      const col3 = (r[3] || '').toString().trim();
      const col4 = (r[4] || '').toString().trim();

      if (col0 === 'СИСТЕМА') {
        if (col1) settingsObj[col1] = col2;
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
        if (col1) {
          agentRoles[col1] = {
            status: col2 || 'АКТИВЕН',
            prompt: col3 || '',
            note: col4 || ''
          };
        }
      } else if (col0 === 'МАТРИЦА_ЛИСТОВ') {
        if (col1) {
          sheetMatrix[col1] = {
            access: col2 || 'РАЗРЕШЕНО',
            prompt: col3 || '',
            note: col4 || ''
          };
        }
      } else if (col0) {
        settingsObj[col0] = col1;
      }
    });

    const aiMode = (settingsObj['ai_mode'] || settingsObj['AI_MODE'] || 'copilot').toLowerCase();
    const aiEnabled = (settingsObj['AI_ENABLED'] || 'TRUE').toUpperCase() !== 'FALSE' && aiMode !== 'off';
    const geminiModel = settingsObj['ai_model'] || settingsObj['GEMINI_MODEL'] || process.env.GEMINI_MODEL || 'gemini-3.6-flash';
    const minPriceUsd = parseInt(settingsObj['min_night_price'] || settingsObj['MIN_NIGHTLY_PRICE_USD'] || '180', 10);
    const systemPrompt = settingsObj['SYSTEM_PROMPT'] || '';

    // 2. Разбор шаблонов [TEMPLATES]
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

    // 3. Разбор витрины [HOME]
    const homeObj = {};
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

    const knowledgeBase = {
      source: 'google_sheets_live',
      aiMode,
      aiEnabled,
      geminiModel,
      minPriceUsd,
      systemPrompt: systemPrompt || getLocalFallbackKnowledge().systemPrompt,
      agentRoles,
      sheetMatrix,
      variables: variablesObj,
      host: hostInfo,
      villa: villaInfo,
      kbs: kbsInfo,
      masterAccess,
      templates: loadedTemplates,
      home: homeObj
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

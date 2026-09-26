// ==============================================================================
// УНИВЕРСАЛЬНЫЙ МОДУЛЬ СИНХРОНИЗАЦИИ ЖИВОГО КОНТЕНТА ИЗ GOOGLE SHEETS
// Файл: utils/liveContentSync.js
// Назначение: Единая точка правды для чтения контента из Google Таблиц:
// 1. Используется в pages/api/content.js для клиентских запросов;
// 2. Используется в pages/api/revalidate.js перед ревалидацией ISR;
// 3. Используется в pages/index.js в getStaticProps для мгновенной пересборки страниц;
// 4. Гарантирует дуплекс: Таблица ⇄ Сайт с авто-обновлением оперативного кэша.
// 100% Zero-Brackets & Zero-Emdash Стандарт.
// ==============================================================================

import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { getLiveSheetMap, resolveRange } from './sheetsRegistry';
import { MASTER_ABOUT_SECTIONS, MASTER_HOME_MAP, buildHomeDerivedCollections } from './masterSeedContent';
import { resolveTemplate } from './templateResolver';

// Очистка от битых формул Google Таблиц [#REF!, #VALUE!, #ERROR!, #N/A]
export const sanitizeText = (val, fallback = '') => {
  if (!val) return fallback;
  const s = String(val).trim();
  if (s.startsWith('#REF!') || s.startsWith('#VALUE!') || s.startsWith('#ERROR!') || s.startsWith('#N/A')) {
    return fallback;
  }
  return s;
};

// Глобальный кэш в оперативной памяти сервера Node.js / Vercel
let memoryCache = global._liveContentMemoryCache || null;
let lastCacheTime = global._liveContentLastTime || 0;
const CACHE_TTL_MS = 20 * 1000; // 20 секунд кэширования для снижения нагрузки на квоты Google

/**
 * Сброс оперативного кэша контента в памяти
 */
export function clearLiveContentCache() {
  memoryCache = null;
  lastCacheTime = 0;
  global._liveContentMemoryCache = null;
  global._liveContentLastTime = 0;
}

/**
 * Чтение локального резервного JSON файла контента
 */
export function readLocalFallback() {
  const contentFilePath = path.join(process.cwd(), 'utils', 'content.json');
  try {
    if (fs.existsSync(contentFilePath)) {
      const raw = fs.readFileSync(contentFilePath, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed.home) {
        buildHomeDerivedCollections(parsed.home);
        if (parsed.home.aboutSections && parsed.home.aboutSections.length > 0 && (!parsed.about || Object.keys(parsed.about).length === 0)) {
          parsed.about = {};
          parsed.home.aboutSections.forEach((sec) => {
            parsed.about[sec.id] = { title: sec.title, text: sec.text };
          });
        }
      }
      return parsed;
    }
  } catch (e) {
    console.warn('[LiveContentSync] Предупреждение при чтении резервного content.json:', e.message);
  }
  return { home: {}, about: {}, legal: {}, templates: {}, products: [], courses: [], gallery: [] };
}

/**
 * Прямой запрос к Google Sheets API и парсинг всех активных вкладок
 */
export async function fetchLiveContentFromGoogleSheets() {
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID || '1ESfaH3FBOx-Z0Z1CKU8-c1cQZCE2YjJBiTvX0MV0A5Q';
  const clientEmail = (process.env.GOOGLE_CLIENT_EMAIL || '').trim();
  const rawKey = (process.env.GOOGLE_PRIVATE_KEY || '').trim();

  // Если учетные данные Google Cloud отсутствуют или шаблонные: используем локальный резерв
  if (
    !clientEmail ||
    !rawKey ||
    !spreadsheetId ||
    spreadsheetId === 'your_google_sheet_id' ||
    clientEmail.includes('your-service-account-email') ||
    rawKey.includes('YOUR_PRIVATE_KEY')
  ) {
    return {
      success: true,
      source: 'local_fallback',
      ...readLocalFallback()
    };
  }

  // Универсальный парсер RSA PEM ключа
  const parsePrivateKey = (raw) => {
    if (!raw) return '';
    let key = raw.replace(/^["']|["']$/g, '');
    key = key.replace(/\\\\n/g, '\n').replace(/\\n/g, '\n');
    key = key.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    return key.trim();
  };

  const privateKey = parsePrivateKey(rawKey);

  // Инициализация авторизации Google Cloud
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
  });

  const sheets = google.sheets({ version: 'v4', auth });

  // Динамический реестр вкладок: определение соответствия sheetId и имен
  const sheetMap = await getLiveSheetMap(sheets, spreadsheetId);

  // Безопасное чтение диапазона
  const safeGet = async (key, rangeSuffix) => {
    const range = resolveRange(sheetMap, key, rangeSuffix);
    try {
      const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });
      return response.data.values || [];
    } catch (err) {
      console.warn(`[LiveContentSync] Не удалось прочитать диапазон ${range}:`, err.message);
      return [];
    }
  };

  // Параллельное скачивание всех 7 листов контента
  const [
    homeRows,
    settingsRows,
    legalRows,
    templatesRows,
    productsRows,
    coursesRows,
    galleryRows
  ] = await Promise.all([
    safeGet('HOME', 'A:H'),
    safeGet('SETTINGS', 'A:E'),
    safeGet('LEGAL', 'A:G'),
    safeGet('TEMPLATES', 'A:G'),
    safeGet('SERVICES', 'A:R'),
    safeGet('GUIDES', 'A:R'),
    safeGet('GALLERY', 'A:L')
  ]);

  // Извлечение словаря переменных из листа SETTINGS
  const ssotContext = {
    address: 'Dalyan, Rodoslu Yasar Sunger Sk, NO 28/2, 48600 Ortaca / Mugla',
    mapsUrl: 'https://maps.app.goo.gl/tPgCjCwz4pzq28pE9',
    wifiName: 'Guest',
    wifiPassword: 'villa2026',
    checkInTime: '16:00',
    checkOutTime: '10:00',
    checkinMethod: 'Электронный смарт-замок и мини-сейф с кодом / личная встреча владельцем',
    keyHandoverInstructions: 'Оставьте ключи в мини-сейфе с кодом у входной двери виллы или на кухонном столе',
    hostName: 'Aleksei Znamenskii',
    hostStatus: 'Суперхозяин на Airbnb : Более 5 лет приема гостей',
    hostLanguages: 'Русский, English, Turkce',
    villaCapacity: '10 гостей',
    poolSpecs: 'Приватный бассейн с соленой водой 36 кв.м и уличное джакузи',
    poolSeason: 'с 1 мая по 1 ноября',
    jacuzziSchedule: 'Работает с 09:00 до 18:00. Включается автоматически на 15 минут с интервалом каждые 45 минут.',
    poolLighting: 'Освещение в бассейне и джакузи включается автоматически с 20:00 до 01:00.',
    streetLighting: 'Уличное освещение включается автоматически с 20:00 до 01:00 и с 04:00 до 06:00.',
    poolMaintenance: 'Профилактические работы и чистка бассейна производятся в день заселения и далее по необходимости : как правило каждые 7 дней.',
    outdoorZones: 'Парковка перед виллой, дворик-сад, зона барбекю, крыльцо с кофейными столиками и обеденной зоной на открытом воздухе, зона для загара с шезлонгами.',
    villaFloors: '2 этажа: кухня со Smart TV 55", гостевой туалет, 2 стиральные машины, 4 большие спальни с ванными комнатами и кондиционерами.'
  };

  if (settingsRows.length > 1) {
    settingsRows.slice(1).forEach((r) => {
      const cat = (r[0] || '').toString().trim();
      const param = (r[1] || '').toString().trim();
      const val = (r[2] || '').toString().trim();
      if (cat === 'ПЕРЕМЕННАЯ') {
        if (param === 'wifi_name') ssotContext.wifiName = val;
        if (param === 'wifi_password') ssotContext.wifiPassword = val;
        if (param === 'address') ssotContext.address = val;
        if (param === 'maps_url') ssotContext.mapsUrl = val;
        if (param === 'checkin_time') ssotContext.checkInTime = val;
        if (param === 'checkout_time') ssotContext.checkOutTime = val;
        if (param === 'checkin_method') ssotContext.checkinMethod = val;
        if (param === 'key_handover') ssotContext.keyHandoverInstructions = val;
      } else if (cat === 'О_ХОЗЯИНЕ') {
        if (param === 'host_name') ssotContext.hostName = val;
        if (param === 'host_status') ssotContext.hostStatus = val;
        if (param === 'host_languages') ssotContext.hostLanguages = val;
      } else if (cat === 'О_ВИЛЛЕ') {
        if (param === 'villa_capacity') ssotContext.villaCapacity = val;
        if (param === 'villa_floors') ssotContext.villaFloors = val;
        if (param === 'pool_specs') ssotContext.poolSpecs = val;
        if (param === 'pool_season') ssotContext.poolSeason = val;
        if (param === 'jacuzzi_schedule') ssotContext.jacuzziSchedule = val;
        if (param === 'pool_lighting') ssotContext.poolLighting = val;
        if (param === 'street_lighting') ssotContext.streetLighting = val;
        if (param === 'pool_maintenance') ssotContext.poolMaintenance = val;
        if (param === 'outdoor_zones') ssotContext.outdoorZones = val;
      }
    });
  }

  const fallbackData = readLocalFallback();

  const settingsObj = {};
  if (settingsRows.length > 1) {
    settingsRows.slice(1).forEach((r) => {
      const cat = (r[0] || '').toString().trim();
      const param = (r[1] || '').toString().trim();
      const val = (r[2] || '').toString().trim();
      const desc = (r[3] || '').toString().trim();
      if (param) {
        settingsObj[param] = {
          category: cat,
          value: val,
          description: desc
        };
      }
    });
  } else if (fallbackData.settings && typeof fallbackData.settings === 'object') {
    Object.assign(settingsObj, fallbackData.settings);
  }

  const content = {
    home: {},
    about: {},
    legal: {},
    templates: {},
    products: [],
    courses: [],
    gallery: [],
    settings: settingsObj,
    ssotContext
  };

  // Базовое наполнение SSOT: гарантируем наличие всех ключей мастер-эталона
  const baseHomeMap = { ...MASTER_HOME_MAP };
  if (fallbackData.home && typeof fallbackData.home === 'object') {
    Object.keys(fallbackData.home).forEach((k) => {
      baseHomeMap[k] = fallbackData.home[k];
    });
  }
  content.home = { ...baseHomeMap };

  // 1. Главная страница [HOME]: 8 колонок конструктора
  if (homeRows.length > 1) {
    const headerRow = homeRows[0] || [];
    const isConstructorFormat = headerRow.length >= 7 || String(headerRow[0] || '').toLowerCase().includes('блок');

    homeRows.slice(1).forEach((r) => {
      let block = '', key = '', desc = '', ru = '', en = '', tr = '', media = '', status = 'Вкл';
      if (isConstructorFormat) {
        block = r[0] ? String(r[0]).trim() : '';
        key = r[1] ? String(r[1]).trim() : '';
        desc = r[2] ? String(r[2]).trim() : '';
        ru = r[3] || '';
        en = r[4] || '';
        tr = r[5] || '';
        media = r[6] || '';
        status = r[7] ? String(r[7]).trim() : 'Вкл';
      } else {
        key = r[0] ? String(r[0]).trim() : '';
        ru = r[1] || '';
        en = r[2] || '';
        tr = r[3] || '';
        media = r[4] || '';
        status = 'Вкл';
      }

      if (!key) return;

      const isEnabled = !status.toLowerCase().startsWith('выкл') && status.toLowerCase() !== 'off' && status.toLowerCase() !== 'false';
      const fallbackItem = baseHomeMap[key] || {};
      const rawRu = sanitizeText(ru, fallbackItem.ru || '');
      const rawEn = sanitizeText(en, fallbackItem.en || fallbackItem.ru || '');
      const rawTr = sanitizeText(tr, fallbackItem.tr || fallbackItem.ru || '');

      const rowObj = {
        block: block || fallbackItem.block || '',
        key,
        desc: desc || fallbackItem.desc || '',
        ru: resolveTemplate(rawRu, ssotContext),
        en: resolveTemplate(rawEn, ssotContext),
        tr: resolveTemplate(rawTr, ssotContext),
        media: sanitizeText(media, fallbackItem.media || ''),
        status: isEnabled ? 'Вкл' : 'Выкл',
        enabled: isEnabled
      };

      content.home[key] = rowObj;
    });
  }

  // Синхронизация алиасов для совместимости
  const aliasPairs = [
    ['heroTitle', 'hero_title'],
    ['heroSubtitle', 'hero_subtitle'],
    ['heroImage', 'hero_image'],
    ['hostHeader', 'host_specs_header'],
    ['hostName', 'host_specs_name'],
    ['hostAvatar', 'host_specs_avatar'],
    ['highlightSuperhostTitle', 'highlight_1_title'],
    ['highlightSuperhostDesc', 'highlight_1_desc'],
    ['highlightCheckinTitle', 'highlight_2_title'],
    ['highlightCheckinDesc', 'highlight_2_desc'],
    ['highlightCancellationTitle', 'highlight_3_title'],
    ['highlightCancellationDesc', 'highlight_3_desc'],
    ['aboutTitle', 'about_title'],
    ['aboutText', 'about_text'],
    ['locationTitle', 'location_title'],
    ['locationDesc', 'location_desc'],
    ['locationImage', 'location_image']
  ];
  aliasPairs.forEach(([camelKey, snakeKey]) => {
    if (!content.home[camelKey] && content.home[snakeKey]) {
      content.home[camelKey] = content.home[snakeKey];
    }
    if (!content.home[snakeKey] && content.home[camelKey]) {
      content.home[snakeKey] = content.home[camelKey];
    }
  });

  // Формирование структурированных коллекций для динамического рендеринга
  buildHomeDerivedCollections(content.home);

  // 2. Описание виллы [ABOUT]
  if (content.home.aboutSections && content.home.aboutSections.length > 0) {
    content.home.aboutSections.forEach((sec) => {
      content.about[sec.id] = { title: sec.title, text: sec.text };
    });
  }
  if (Object.keys(content.about).length === 0) {
    if (fallbackData.about && Object.keys(fallbackData.about).length > 0) {
      content.about = fallbackData.about;
    } else {
      MASTER_ABOUT_SECTIONS.forEach((sec) => {
        content.about[sec.id] = { title: sec.title, text: sec.text };
      });
    }
  }

  // 3. Юридические данные и реквизиты [LEGAL]
  if (legalRows.length > 1) {
    legalRows.slice(1).forEach((r) => {
      if (r[0]) {
        content.legal[r[0]] = {
          title: {
            ru: sanitizeText(r[1], fallbackData.legal?.[r[0]]?.title?.ru || ''),
            en: sanitizeText(r[2], fallbackData.legal?.[r[0]]?.title?.en || ''),
            tr: sanitizeText(r[3], fallbackData.legal?.[r[0]]?.title?.tr || '')
          },
          text: {
            ru: sanitizeText(r[4], fallbackData.legal?.[r[0]]?.text?.ru || ''),
            en: sanitizeText(r[5], fallbackData.legal?.[r[0]]?.text?.en || ''),
            tr: sanitizeText(r[6], fallbackData.legal?.[r[0]]?.text?.tr || '')
          }
        };
      }
    });
  }
  if (Object.keys(content.legal).length === 0 && fallbackData.legal) {
    content.legal = fallbackData.legal;
  }

  // 4. Шаблоны ответов [TEMPLATES]
  if (templatesRows.length > 1) {
    templatesRows.slice(1).forEach((r) => {
      if (r[0]) {
        if (!content.templates[r[0]]) content.templates[r[0]] = [];
        content.templates[r[0]].push({
          name: {
            ru: sanitizeText(r[1], ''),
            en: sanitizeText(r[2], ''),
            tr: sanitizeText(r[3], '')
          },
          text: {
            ru: sanitizeText(r[4], ''),
            en: sanitizeText(r[5], ''),
            tr: sanitizeText(r[6], '')
          }
        });
      }
    });
  }
  if (Object.keys(content.templates).length === 0 && fallbackData.templates) {
    content.templates = fallbackData.templates;
  }

  // 5. Каталог услуг [SERVICES]
  if (productsRows.length > 1) {
    const isServicesUsdHeader = (productsRows[0]?.[7] || '').toString().includes('USD');
    content.products = productsRows
      .slice(1)
      .map((r) => {
        const usdVal = isServicesUsdHeader ? (r[7] || '0') : (Math.round(Number(r[7] || 0) * 1.08).toString() || '0');
        const eurVal = isServicesUsdHeader ? (r[8] || '0') : (r[7] || '0');
        const rubVal = isServicesUsdHeader ? (r[9] || '0') : (r[8] || '0');
        const tryVal = isServicesUsdHeader ? (r[10] || '0') : (r[9] || '0');
        const imagesCol = isServicesUsdHeader ? (r[11] || '') : (r[10] || '');
        const typeCol = isServicesUsdHeader ? (r[13] || '') : (r[12] || '');
        const videosCol = isServicesUsdHeader ? (r[14] || '') : (r[13] || '');
        const descRu = isServicesUsdHeader ? (r[15] || '') : (r[14] || '');
        const descEn = isServicesUsdHeader ? (r[16] || '') : (r[15] || '');
        const descTr = isServicesUsdHeader ? (r[17] || '') : (r[16] || '');

        return {
          id: r[0],
          name: {
            ru: sanitizeText(r[1], ''),
            en: sanitizeText(r[3], ''),
            tr: sanitizeText(r[5], '')
          },
          desc: {
            ru: sanitizeText(r[2], ''),
            en: sanitizeText(r[4], ''),
            tr: sanitizeText(r[6], '')
          },
          price: { usd: usdVal, eur: eurVal, rub: rubVal, try: tryVal },
          images: imagesCol.split(',').map((s) => s.trim()).filter(Boolean),
          videos: videosCol.split(',').map((s) => s.trim()).filter(Boolean),
          detailedDesc: {
            ru: sanitizeText(descRu, ''),
            en: sanitizeText(descEn, ''),
            tr: sanitizeText(descTr, '')
          },
          type: {
            ru: typeCol === 'Пакет' ? 'Пакет услуг' : 'Услуга',
            en: typeCol === 'Пакет' ? 'Service Package' : 'Service',
            tr: typeCol === 'Пакет' ? 'Hizmet Paketi' : 'Hizmet'
          }
        };
      })
      .filter((p) => p.id && (p.name.ru || p.name.en));
  }
  if (content.products.length === 0 && fallbackData.products?.length > 0) {
    content.products = fallbackData.products.map((p) => ({
      ...p,
      price: {
        usd: p.price?.usd || Math.round(Number(p.price?.eur || 0) * 1.08).toString(),
        eur: p.price?.eur || '0',
        rub: p.price?.rub || '0',
        try: p.price?.try || '0'
      }
    }));
  }

  // 6. Видео-путеводители [GUIDES]
  if (coursesRows.length > 1) {
    const isGuidesUsdHeader = (coursesRows[0]?.[10] || '').toString().includes('USD');
    content.courses = coursesRows
      .slice(1)
      .map((r) => {
        const imagesCol = r[7] || '';
        const moduleCol = r[8] || 'Основной';
        const privateLinkCol = r[9] || '';
        const usdVal = isGuidesUsdHeader ? (r[10] || '0') : (Math.round(Number(r[10] || 0) * 1.08).toString() || '0');
        const eurVal = isGuidesUsdHeader ? (r[11] || '0') : (r[10] || '0');
        const rubVal = isGuidesUsdHeader ? (r[12] || '0') : (r[11] || '0');
        const tryVal = isGuidesUsdHeader ? (r[13] || '0') : (r[12] || '0');
        const videosCol = isGuidesUsdHeader ? (r[14] || '') : (r[13] || '');
        const descRu = isGuidesUsdHeader ? (r[15] || '') : (r[14] || '');
        const descEn = isGuidesUsdHeader ? (r[16] || '') : (r[15] || '');
        const descTr = isGuidesUsdHeader ? (r[17] || '') : (r[16] || '');

        return {
          id: r[0],
          name: {
            ru: sanitizeText(r[1], ''),
            en: sanitizeText(r[3], ''),
            tr: sanitizeText(r[5], '')
          },
          desc: {
            ru: sanitizeText(r[2], ''),
            en: sanitizeText(r[4], ''),
            tr: sanitizeText(r[6], '')
          },
          images: imagesCol.split(',').map((s) => s.trim()).filter(Boolean),
          module: moduleCol,
          privateLink: privateLinkCol,
          price: { usd: usdVal, eur: eurVal, rub: rubVal, try: tryVal },
          videos: videosCol.split(',').map((s) => s.trim()).filter(Boolean),
          detailedDesc: {
            ru: sanitizeText(descRu, ''),
            en: sanitizeText(descEn, ''),
            tr: sanitizeText(descTr, '')
          },
          level: 'Для гостей'
        };
      })
      .filter((c) => c.id && (c.name.ru || c.name.en));
  }
  if (content.courses.length === 0 && fallbackData.courses?.length > 0) {
    content.courses = fallbackData.courses.map((c) => ({
      ...c,
      price: {
        usd: c.price?.usd || Math.round(Number(c.price?.eur || 0) * 1.08).toString(),
        eur: c.price?.eur || '0',
        rub: c.price?.rub || '0',
        try: c.price?.try || '0'
      }
    }));
  }

  // 7. Фото и видео галерея [GALLERY]
  if (galleryRows.length > 1) {
    content.gallery = galleryRows
      .slice(1)
      .map((r) => ({
        id: r[0],
        group: {
          ru: sanitizeText(r[1], ''),
          en: sanitizeText(r[3], ''),
          tr: sanitizeText(r[5], '')
        },
        groupDesc: {
          ru: sanitizeText(r[2], ''),
          en: sanitizeText(r[4], ''),
          tr: sanitizeText(r[6], '')
        },
        type: r[7] === 'Видео' ? 'video' : 'image',
        media: (r[8] || '').split(',').map((s) => s.trim()).filter(Boolean),
        caption: {
          ru: sanitizeText(r[9], ''),
          en: sanitizeText(r[10], ''),
          tr: sanitizeText(r[11], '')
        }
      }))
      .filter((g) => g.id && g.media.length > 0);
  }
  if (content.gallery.length === 0 && fallbackData.gallery?.length > 0) {
    content.gallery = fallbackData.gallery;
  }

  // Обновление кэша в оперативной памяти сервера
  memoryCache = content;
  lastCacheTime = Date.now();
  global._liveContentMemoryCache = content;
  global._liveContentLastTime = lastCacheTime;

  // Попытка фоновой записи в utils/content.json на диске
  if (Object.keys(content.home).length > 0 && Object.keys(content.about).length > 0) {
    try {
      const contentFilePath = path.join(process.cwd(), 'utils', 'content.json');
      fs.writeFileSync(contentFilePath, JSON.stringify(content, null, 2), 'utf8');
    } catch (writeErr) {
      // В среде Vercel Lambda диск read-only: это штатное поведение
    }
  }

  return {
    success: true,
    source: 'google_sheets_live',
    cached: false,
    sheetMap,
    ...content
  };
}

/**
 * Основная функция получения контента: с учетом кэша в памяти и резерва
 * @param {boolean} forceRefresh - Принудительное обращение к Google Sheets API
 */
export async function getOrFetchLiveContent(forceRefresh = false) {
  const now = Date.now();

  // 1. Быстрый возврат из кэша памяти, если он свежий и не запрошен сброс
  if (!forceRefresh && memoryCache && now - lastCacheTime < CACHE_TTL_MS) {
    return {
      success: true,
      cached: true,
      cacheAgeSeconds: Math.round((now - lastCacheTime) / 1000),
      ...memoryCache
    };
  }

  // 2. Обращение к Google Sheets API
  try {
    const liveData = await fetchLiveContentFromGoogleSheets();
    return liveData;
  } catch (err) {
    console.warn('[LiveContentSync] Сбой обращения к Google Sheets, используем резерв:', err.message);
    const fallbackData = readLocalFallback();
    return {
      success: true,
      source: 'fallback_on_error',
      error: err.message,
      ...fallbackData
    };
  }
}

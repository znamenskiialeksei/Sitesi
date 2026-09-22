// ==============================================================================
// СЕРВЕРНЫЙ ЭНДПОИНТ ДИНАМИЧЕСКОГО КОНТЕНТА GOOGLE SHEETS
// Файл: pages/api/content.js
// Назначение: Чтение в реальном времени всех текстов, авто-переводов, фото, видео,
// услуг, видеогидов и галереи напрямую из Google Таблицы с кэшированием и fallback.
// ДИНАМИЧЕСКАЯ ПРИВЯЗКА: Работает через реестр sheetsRegistry по постоянным sheetId и алиасам.
// ==============================================================================

import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { getLiveSheetMap, resolveRange } from '../../utils/sheetsRegistry';
import { MASTER_ABOUT_SECTIONS, MASTER_HOME_MAP, buildHomeDerivedCollections } from '../../utils/masterSeedContent';
import { resolveTemplate } from '../../utils/templateResolver';

// Очистка от битых формул Google Таблиц [#REF!, #VALUE!, #ERROR!, #N/A]
const sanitizeText = (val, fallback = '') => {
  if (!val) return fallback;
  const s = String(val).trim();
  if (s.startsWith('#REF!') || s.startsWith('#VALUE!') || s.startsWith('#ERROR!') || s.startsWith('#N/A')) {
    return fallback;
  }
  return s;
};

// Кэш в памяти сервера для снижения нагрузки на Google Sheets API
let memoryCache = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 30 * 1000; // 30 секунд кэширования

/**
 * Обработчик запроса получения контента
 * Поддерживает GET и POST (с опцией force=true для сброса кэша)
 */
export default async function handler(req, res) {
  const isForce = req.query.force === 'true' || req.body?.force === true;
  const now = Date.now();

  // Возврат из кэша, если он актуален и не запрошен принудительный сброс
  if (!isForce && memoryCache && now - lastCacheTime < CACHE_TTL_MS) {
    return res.status(200).json({
      success: true,
      cached: true,
      cacheAgeSeconds: Math.round((now - lastCacheTime) / 1000),
      ...memoryCache
    });
  }

  const contentFilePath = path.join(process.cwd(), 'utils', 'content.json');

  // Функция чтения локального резервного JSON файла
  const readFallbackFile = () => {
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
      console.warn('⚠️ Ошибка чтения резервного content.json:', e.message);
    }
    return { home: {}, about: {}, legal: {}, templates: {}, products: [], courses: [], gallery: [] };
  };

  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;

  // Если учетные данные Google Cloud не настроены — отдаем резервный локальный кэш
  if (
    !clientEmail ||
    !privateKey ||
    !spreadsheetId ||
    spreadsheetId === 'your_google_sheet_id' ||
    clientEmail.includes('your-service-account-email') ||
    privateKey.includes('YOUR_PRIVATE_KEY')
  ) {
    const fallbackData = readFallbackFile();
    return res.status(200).json({
      success: true,
      source: 'local_fallback',
      ...fallbackData
    });
  }

  try {
    // Универсальный парсер PEM-ключа (обрабатывает все форматы .env)
    const parsePrivateKey = (raw) => {
      if (!raw) return '';
      let key = raw.replace(/^["']|["']$/g, '');       // снять кавычки
      key = key.replace(/\\\\n/g, '\n').replace(/\\n/g, '\n'); // escaped -> реальный перенос
      key = key.replace(/\r\n/g, '\n').replace(/\r/g, '\n');   // CRLF -> LF
      return key.trim();
    };
    // Аутентификация в Google Cloud с правами чтения таблиц
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail.trim(),
        private_key: parsePrivateKey(privateKey)
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Динамический резолвер листов: находит актуальные имена по ID/алиасам
    const sheetMap = await getLiveSheetMap(sheets, spreadsheetId);

    // Безопасный запрос диапазона с перехватом ошибок
    const safeGet = async (key, rangeSuffix) => {
      const range = resolveRange(sheetMap, key, rangeSuffix);
      try {
        const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });
        return response.data.values || [];
      } catch (err) {
        console.warn(`[Content API] Не удалось прочитать диапазон ${range}:`, err.message);
        return [];
      }
    };

    // Параллельное скачивание всех 7 активных листов контента через динамический маппинг
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
      safeGet('SERVICES', 'A:Q'),
      safeGet('GUIDES', 'A:Q'),
      safeGet('GALLERY', 'A:L')
    ]);

    // 0. Извлечение словаря переменных из листа SETTINGS для авто-резолвинга плейсхолдеров
    const ssotContext = {
      address: 'Dalyan, Rodoslu Yaşar Sünger Sk, NO 28/2, 48600 Ortaca / Muğla',
      mapsUrl: 'https://maps.app.goo.gl/tPgCjCwz4pzq28pE9',
      wifiName: 'Guest',
      wifiPassword: 'villa2026',
      checkInTime: '16:00',
      checkOutTime: '10:00',
      checkinMethod: 'Электронный смарт-замок и мини-сейф с кодом / личная встреча владельцем',
      keyHandoverInstructions: 'Оставьте ключи в мини-сейфе с кодом у входной двери виллы или на кухонном столе',
      hostName: 'Aleksei Znamenskii',
      hostStatus: 'Суперхозяин на Airbnb • Более 5 лет приема гостей',
      hostLanguages: 'Русский, English, Türkçe',
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

    const content = {
      home: {},
      about: {},
      legal: {},
      templates: {},
      products: [],
      courses: [],
      gallery: []
    };

    const fallbackData = readFallbackFile();

    // 1. Главная страница [HOME] : Парсер конструктора витрины [8 колонок] с поддержкой устаревшего формата [5 колонок]
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

        const rawRu = sanitizeText(ru, fallbackData.home?.[key]?.ru || MASTER_HOME_MAP[key]?.ru || '');
        const rawEn = sanitizeText(en, fallbackData.home?.[key]?.en || MASTER_HOME_MAP[key]?.en || '');
        const rawTr = sanitizeText(tr, fallbackData.home?.[key]?.tr || MASTER_HOME_MAP[key]?.tr || '');

        const rowObj = {
          block,
          key,
          desc,
          ru: resolveTemplate(rawRu, ssotContext),
          en: resolveTemplate(rawEn, ssotContext),
          tr: resolveTemplate(rawTr, ssotContext),
          media: sanitizeText(media, fallbackData.home?.[key]?.media || MASTER_HOME_MAP[key]?.media || ''),
          status: isEnabled ? 'Вкл' : 'Выкл',
          enabled: isEnabled
        };

        content.home[key] = rowObj;
      });
    }

    if (Object.keys(content.home).length === 0) {
      content.home = fallbackData.home && Object.keys(fallbackData.home).length > 0
        ? fallbackData.home
        : { ...MASTER_HOME_MAP };
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

    // Формирование структурированных коллекций для динамического рендеринга витрины
    buildHomeDerivedCollections(content.home);

    // 2. Описание виллы [ABOUT] наполняется напрямую из Блока 4 витрины [aboutSections]
    if (content.home.aboutSections && content.home.aboutSections.length > 0) {
      content.home.aboutSections.forEach((sec) => {
        content.about[sec.id] = { title: sec.title, text: sec.text };
      });
    }
    if (Object.keys(content.about).length === 0) {
      if (content.home.aboutSections && content.home.aboutSections.length > 0) {
        content.home.aboutSections.forEach((sec) => {
          content.about[sec.id] = { title: sec.title, text: sec.text };
        });
      } else if (fallbackData.about && Object.keys(fallbackData.about).length > 0) {
        content.about = fallbackData.about;
      } else {
        MASTER_ABOUT_SECTIONS.forEach((sec) => {
          content.about[sec.id] = { title: sec.title, text: sec.text };
        });
      }
    }

    // 3. Юридические данные и реквизиты [LEGAL] с фильтрацией #REF!
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
      content.products = productsRows
        .slice(1)
        .map((r) => ({
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
          price: { eur: r[7] || '0', rub: r[8] || '0', try: r[9] || '0' },
          images: (r[10] || '').split(',').map((s) => s.trim()).filter(Boolean),
          videos: (r[13] || '').split(',').map((s) => s.trim()).filter(Boolean),
          detailedDesc: {
            ru: sanitizeText(r[14], ''),
            en: sanitizeText(r[15], ''),
            tr: sanitizeText(r[16], '')
          },
          type: {
            ru: r[12] === 'Пакет' ? 'Пакет услуг' : 'Услуга',
            en: r[12] === 'Пакет' ? 'Service Package' : 'Service',
            tr: r[12] === 'Пакет' ? 'Hizmet Paketi' : 'Hizmet'
          }
        }))
        .filter((p) => p.id && (p.name.ru || p.name.en));
    }
    if (content.products.length === 0 && fallbackData.products?.length > 0) {
      content.products = fallbackData.products;
    }

    // 6. Видео-путеводители [GUIDES]
    if (coursesRows.length > 1) {
      content.courses = coursesRows
        .slice(1)
        .map((r) => ({
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
          images: (r[7] || '').split(',').map((s) => s.trim()).filter(Boolean),
          module: r[8] || 'Основной',
          privateLink: r[9] || '',
          price: { eur: r[10] || '0', rub: r[11] || '0', try: r[12] || '0' },
          videos: (r[13] || '').split(',').map((s) => s.trim()).filter(Boolean),
          detailedDesc: {
            ru: sanitizeText(r[14], ''),
            en: sanitizeText(r[15], ''),
            tr: sanitizeText(r[16], '')
          },
          level: 'Для гостей'
        }))
        .filter((c) => c.id && (c.name.ru || c.name.en));
    }
    if (content.courses.length === 0 && fallbackData.courses?.length > 0) {
      content.courses = fallbackData.courses;
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

    // Обновление кэша в памяти
    memoryCache = content;
    lastCacheTime = Date.now();

    // Защищенная запись: пишем на диск только если контент не пуст
    if (Object.keys(content.home).length > 0 && Object.keys(content.about).length > 0) {
      try {
        fs.writeFileSync(contentFilePath, JSON.stringify(content, null, 2), 'utf8');
      } catch (writeErr) {
        console.warn('⚠️ Ошибка фонового обновления content.json:', writeErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      source: 'google_sheets_live',
      cached: false,
      sheetMap,
      ...content
    });
  } catch (err) {
    console.error('❌ Ошибка синхронизации контента с Google Sheets:', err.message);
    // При сбое отдаем надежный локальный кэш
    const fallbackData = readFallbackFile();
    return res.status(200).json({
      success: true,
      source: 'error_fallback',
      error: err.message,
      ...fallbackData
    });
  }
}

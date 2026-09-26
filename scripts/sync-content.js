// ==============================================================================
// ВЫГРУЗКА И СИНХРОНИЗАЦИЯ КОНТЕНТА ИЗ GOOGLE SHEETS
// Файл: scripts/sync-content.js
// Назначение: Парсинг таблиц описаний, услуг, путеводителей и галереи в локальный
// кэш utils/content.json для мгновенной серверной генерации страниц (SSG/ISR).
// ==============================================================================

require('dotenv').config({ path: '.env.local' });
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const { getLiveSheetMap, resolveRange } = require('../utils/sheetsRegistry');
const { MASTER_ABOUT_SECTIONS, MASTER_HOME_MAP, buildHomeDerivedCollections } = require('../utils/masterSeedContent');

// Очистка от битых формул Google Таблиц [#REF!, #VALUE!, #ERROR!, #N/A]
const sanitizeText = (val, fallback = '') => {
  if (!val) return fallback;
  const s = String(val).trim();
  if (s.startsWith('#REF!') || s.startsWith('#VALUE!') || s.startsWith('#ERROR!') || s.startsWith('#N/A')) {
    return fallback;
  }
  return s;
};

const GOOGLE_SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
const contentFilePath = path.join(__dirname, '../utils/content.json');

const emptyContent = JSON.stringify(
  { home: {}, about: {}, legal: {}, templates: {}, products: [], courses: [], gallery: [] },
  null,
  2
);

async function syncContent() {
  const clientEmail = (process.env.GOOGLE_CLIENT_EMAIL || '').trim();
  const rawKey = (process.env.GOOGLE_PRIVATE_KEY || '').trim();
  const spreadsheetId = (GOOGLE_SPREADSHEET_ID || '').trim();

  // Проверка на отсутствующие или демонстрационные (placeholder) учетные данные
  const isPlaceholder =
    !clientEmail ||
    !rawKey ||
    !spreadsheetId ||
    spreadsheetId === 'your_google_sheet_id' ||
    clientEmail.includes('your-service-account-email') ||
    rawKey.includes('YOUR_PRIVATE_KEY');

  if (isPlaceholder) {
    console.log('ℹ️ В .env.local используются демонстрационные ключи Google Service Account.');
    console.log('   Витрина работает на полном предустановленном контенте utils/content.json.');
    console.log('   Для синхронизации с Google Sheets укажите реальный Service Account (client_email и private_key) в .env.local.');
    return;
  }

  // Универсальный парсер PEM-ключа: обрабатывает все форматы .env файла
  // (escaped \\n, literal \n, двойное экранирование, кавычки, CRLF)
  const parsePrivateKey = (raw) => {
    if (!raw) return '';
    let key = raw;
    key = key.replace(/^["']|["']$/g, '');
    key = key.replace(/\\\\n/g, '\n').replace(/\\n/g, '\n');
    key = key.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    return key.trim();
  };

  const parsedKey = parsePrivateKey(rawKey);

  // Дополнительная валидация PEM структуры перед передачей в OpenSSL
  if (!parsedKey.includes('-----BEGIN PRIVATE KEY-----') || parsedKey.length < 200) {
    console.warn('⚠️ GOOGLE_PRIVATE_KEY в .env.local не является валидным PEM-ключом RSA.');
    console.warn('   Существующий контент в utils/content.json сохранен без изменений.');
    return;
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: parsedKey
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Динамический резолвер структуры листов по sheetId и алиасам
    const sheetMap = await getLiveSheetMap(sheets, spreadsheetId);

    let existingContent = {};
    try {
      if (fs.existsSync(contentFilePath)) {
        existingContent = JSON.parse(fs.readFileSync(contentFilePath, 'utf8'));
      }
    } catch (_) { }

    const content = {
      home: existingContent.home || {},
      about: existingContent.about || {},
      legal: existingContent.legal || {},
      templates: existingContent.templates || {},
      products: existingContent.products || [],
      courses: existingContent.courses || [],
      gallery: existingContent.gallery || []
    };

    let fetchSuccessCount = 0;

    const safeGet = async (range) => {
      try {
        const res = await sheets.spreadsheets.values.get({ spreadsheetId, range });
        if (res.data && res.data.values && res.data.values.length > 0) fetchSuccessCount++;
        return res;
      } catch (e) {
        console.warn(`- Не удалось получить данные для диапазона ${range}:`, e.message);
        return { data: { values: [] } };
      }
    };

    console.log('Синхронизация контента (Главная, О вилле, Юридический блок, Шаблоны)...');

    // 1. Главная страница [Конструктор витрины 8 колонок A:H либо стандарт 5 колонок]
    const homeData = await safeGet(resolveRange(sheetMap, 'HOME', 'A:H'));
    if (homeData.data.values && homeData.data.values.length > 1) {
      const homeRows = homeData.data.values;
      const isConstructorFormat = homeRows[0] && homeRows[0].length >= 7;

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
        const fallbackItem = MASTER_HOME_MAP[key] || existingContent.home?.[key] || {};

        content.home[key] = {
          block: block || fallbackItem.block || '',
          key,
          desc: desc || fallbackItem.desc || '',
          ru: sanitizeText(ru, fallbackItem.ru || ''),
          en: sanitizeText(en, fallbackItem.en || fallbackItem.ru || ''),
          tr: sanitizeText(tr, fallbackItem.tr || fallbackItem.ru || ''),
          media: sanitizeText(media, fallbackItem.media || ''),
          status: isEnabled ? 'Вкл' : 'Выкл',
          enabled: isEnabled
        };
      });

      // Синхронизация camelCase и snake_case алиасов
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

      if (typeof buildHomeDerivedCollections === 'function') {
        buildHomeDerivedCollections(content.home, true);
      }
    }
    if (Object.keys(content.home).length === 0) {
      content.home = existingContent.home && Object.keys(existingContent.home).length > 0
        ? existingContent.home
        : { ...MASTER_HOME_MAP };
      if (typeof buildHomeDerivedCollections === 'function') {
        buildHomeDerivedCollections(content.home, true);
      }
    }

    // 2. Юридические документы и шаблоны CRM [описание вилы формируется из Листа 1 HOME или эталона]
    const legalData = await safeGet(resolveRange(sheetMap, 'LEGAL', 'A:G'));
    const templatesData = await safeGet(resolveRange(sheetMap, 'TEMPLATES', 'A:G'));

    // Инициализация описания виллы: из существующего кэша либо эталона MASTER_ABOUT_SECTIONS
    if (!content.about || Object.keys(content.about).length === 0) {
      if (existingContent.about && Object.keys(existingContent.about).length > 0) {
        content.about = existingContent.about;
      } else {
        MASTER_ABOUT_SECTIONS.forEach((sec) => {
          content.about[sec.id] = { title: sec.title, text: sec.text };
        });
      }
    }

    if (legalData.data.values && legalData.data.values.length > 1) {
      legalData.data.values.slice(1).forEach((r) => {
        if (r[0]) {
          content.legal[r[0]] = {
            title: {
              ru: sanitizeText(r[1], existingContent.legal?.[r[0]]?.title?.ru || ''),
              en: sanitizeText(r[2], existingContent.legal?.[r[0]]?.title?.en || ''),
              tr: sanitizeText(r[3], existingContent.legal?.[r[0]]?.title?.tr || '')
            },
            text: {
              ru: sanitizeText(r[4], existingContent.legal?.[r[0]]?.text?.ru || ''),
              en: sanitizeText(r[5], existingContent.legal?.[r[0]]?.text?.en || ''),
              tr: sanitizeText(r[6], existingContent.legal?.[r[0]]?.text?.tr || '')
            }
          };
        }
      });
    }

    if (templatesData.data.values && templatesData.data.values.length > 1) {
      templatesData.data.values.slice(1).forEach((r) => {
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

    // 3. Каталог дополнительных услуг: трансферы, аренда яхт, шеф-повар
    console.log('Синхронизация услуг и видео-гидов...');
    const productsSheet = await safeGet(resolveRange(sheetMap, 'SERVICES', 'A:R'));
    const productsRows = productsSheet.data.values || [];
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
          name: { ru: r[1] || '', en: r[3] || '', tr: r[5] || '' },
          desc: { ru: r[2] || '', en: r[4] || '', tr: r[6] || '' },
          price: { usd: usdVal, eur: eurVal, rub: rubVal, try: tryVal },
          images: imagesCol.split(',').map((s) => s.trim()).filter(Boolean),
          videos: videosCol.split(',').map((s) => s.trim()).filter(Boolean),
          detailedDesc: { ru: descRu, en: descEn, tr: descTr },
          type: {
            ru: typeCol === 'Пакет' ? 'Пакет услуг' : 'Услуга',
            en: typeCol === 'Пакет' ? 'Service Package' : 'Service',
            tr: typeCol === 'Пакет' ? 'Hizmet Paketi' : 'Hizmet'
          }
        };
      })
      .filter((p) => p.id && p.name.ru);

    // 4. Авторские видео-путеводители по Дальяну
    const coursesSheet = await safeGet(resolveRange(sheetMap, 'GUIDES', 'A:R'));
    const coursesRows = coursesSheet.data.values || [];
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
          name: { ru: r[1] || '', en: r[3] || '', tr: r[5] || '' },
          desc: { ru: r[2] || '', en: r[4] || '', tr: r[6] || '' },
          images: imagesCol.split(',').map((s) => s.trim()).filter(Boolean),
          module: moduleCol,
          privateLink: privateLinkCol,
          price: { usd: usdVal, eur: eurVal, rub: rubVal, try: tryVal },
          videos: videosCol.split(',').map((s) => s.trim()).filter(Boolean),
          detailedDesc: { ru: descRu, en: descEn, tr: descTr },
          level: 'Для гостей'
        };
      })
      .filter((c) => c.id && c.name.ru);

    // 5. Фотогалерея виллы
    const gallerySheet = await safeGet(resolveRange(sheetMap, 'GALLERY', 'A:L'));
    content.gallery = (gallerySheet.data.values || [])
      .slice(1)
      .map((r) => ({
        id: r[0],
        group: { ru: r[1] || '', en: r[3] || '', tr: r[5] || '' },
        groupDesc: { ru: r[2] || '', en: r[4] || '', tr: r[6] || '' },
        type: r[7] === 'Видео' ? 'video' : 'image',
        media: (r[8] || '').split(',').map((s) => s.trim()).filter(Boolean),
        caption: { ru: r[9] || '', en: r[10] || '', tr: r[11] || '' }
      }))
      .filter((g) => g.id && g.media.length > 0);

// Сохранение обновленного JSON файла только при успешном получении данных и валидном контенте
if (fetchSuccessCount > 0 && Object.keys(content.home).length > 0 && Object.keys(content.about).length > 0) {
  fs.writeFileSync(contentFilePath, JSON.stringify(content, null, 2), 'utf8');
  console.log(`✅ Контент успешно синхронизирован [${fetchSuccessCount} листов] и сохранен в utils/content.json`);
} else {
  console.warn('⚠️ Не удалось прочитать данные с Google Sheets либо контент пуст. Локальный кэш сохранен.');
}
  } catch (err) {
  console.error('Ошибка синхронизации контента:', err.message);
  console.warn('Локальный кэш utils/content.json сохранен без изменений.');
}
}

syncContent();


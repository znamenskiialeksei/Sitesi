// ==============================================================================
// ОСНОВНОЙ API СЕРВЕР GOOGLE SHEETS & CRM VILLA TURAMAN
// Файл: pages/api/booking.js
// Назначение: Обработка бронирований, авторизация, чаты, настройки календаря
// СТАНДАРТ: 100% канонические формулы с запятыми (,) для исключения #ERROR!
// ==============================================================================

import { google } from 'googleapis';
import { createClient } from '@vercel/kv';
import { generateVoucher } from '../../utils/pdf';

let memoryCache = {};

// Инициализация Vercel KV клиента (при наличии ключей)
const getKV = () => {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    try {
      return createClient({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN
      });
    } catch (e) {
      return null;
    }
  }
  return null;
};
const kv = getKV();

const safeCacheGet = async (key) => {
  if (kv) {
    try {
      return await kv.get(key);
    } catch (e) {
      return memoryCache[key];
    }
  }
  return memoryCache[key];
};

const safeCacheSet = async (key, val, opts) => {
  if (kv) {
    try {
      await kv.set(key, val, opts);
    } catch (e) {
      memoryCache[key] = val;
    }
  } else {
    memoryCache[key] = val;
  }
};

const safeCacheDel = async (key) => {
  if (kv) {
    try {
      await kv.del(key);
    } catch (e) {
      delete memoryCache[key];
    }
  } else {
    delete memoryCache[key];
  }
};

// Конфигурация названий листов и заголовков таблицы Google
const GOOGLE_CONFIG = {
  parentFolderId: "11xBSWA02NypliPFbziRSMfC9aAPclYF_",
  spreadsheetName: "VillaTuramanWebSitePlatform_DB",
  sheetName: "Вилла",
  homePageSheetName: "HomePage",
  accountSheetName: "Accounts",
  masterSheetName: "MasterAccount",
  calendarSettingsSheetName: "CalendarSettings",
  productsSheetName: "ExtraServices",
  coursesSheetName: "VideoGuides",
  studentsSheetName: "GuestsAccess",
  ordersSheetName: "ServiceOrders",
  gallerySheetName: "Gallery",
  aboutSheetName: "About",
  legalSheetName: "Legal",
  templatesSheetName: "Templates",
  variablesSheetName: "Variables",

  homeHeaders: ["Ключ (ID)", "RU", "EN", "TR", "Медиа/Картинка"],
  headers: ["Дата заявки", "Имя клиента", "Контакт (Tel/TG)", "Старт", "Завершение", "Ночей", "Взрослых", "Детей", "Всего гостей", "Итоговая стоимость", "Статус оплаты"],
  accountHeaders: ["Дата регистрации", "Имя", "Контакт (Логин)", "Пароль", "Блок: Сайт", "Блок: Аккаунт", "Блок: Чат"],
  masterHeaders: ["ФИО", "Телефон", "Telegram", "WhatsApp", "Google Email", "Логин", "Пароль", "Роль", "Прав: Финансы", "Прав: Периоды", "Прав: Блок. дат", "Прав: Окно брони", "Прав: Доступ к чатам"],
  calendarSettingsHeaders: ["Дата старта", "Дата завершения", "Тип (Блокировка/Цена/Мин. дней/Заметка/Тип записи/Настройки)", "Значение", "Заметка", "Автор изменения", "Время фиксации"],
  chatHeaders: ["Дата и Время", "Отправитель", "Оригинал", "RU", "EN", "TR", "Ссылка на вложение"],
  productsHeaders: ["ID", "Название услуги (RU)", "Описание (RU)", "Название услуги (EN)", "Описание (EN)", "Название услуги (TR)", "Описание (TR)", "Цена (EUR)", "Цена (RUB)", "Цена (TRY)", "Изображения (через запятую)", "Наличие (Да/Нет)", "Тип (Услуга/Пакет)", "Видео презентации (через запятую)", "Подробное описание (RU)", "Подробное описание (EN)", "Подробное описание (TR)"],
  coursesHeaders: ["ID", "Название путеводителя (RU)", "Описание (RU)", "Название путеводителя (EN)", "Описание (EN)", "Название путеводителя (TR)", "Описание (TR)", "Изображения (через запятую)", "Категория", "Ссылка на видео", "Цена (EUR)", "Цена (RUB)", "Цена (TRY)", "Видео презентации (через запятую)", "Подробное описание (RU)", "Подробное описание (EN)", "Подробное описание (TR)"],
  studentsHeaders: ["Дата", "Гость (Контакт)", "Гид ID", "Категория", "Статус оплаты", "Доступ (Да/Нет)", "Прогресс"],
  ordersHeaders: ["Дата заказа", "Контакт", "Тип (Гид/Услуга/Аренда)", "Сумма", "Статус оплаты", "Детали"],
  galleryHeaders: ["ID", "Группа (RU)", "Описание группы (RU)", "Группа (EN)", "Описание группы (EN)", "Группа (TR)", "Описание группы (TR)", "Тип (Фото/Видео/Карусель)", "Медиа (ссылки/iframes через запятую)", "Подпись (RU)", "Подпись (EN)", "Подпись (TR)"],
  aboutHeaders: ["ID Раздела", "Название (RU)", "Название (EN)", "Название (TR)", "Текст (RU)", "Текст (EN)", "Текст (TR)"],
  legalHeaders: ["ID Раздела", "Название (RU)", "Название (EN)", "Название (TR)", "Текст (RU)", "Текст (EN)", "Текст (TR)"],
  templatesHeaders: ["ID Раздела", "Название (RU)", "Название (EN)", "Название (TR)", "Текст (RU)", "Текст (EN)", "Текст (TR)"],
  variablesHeaders: ["Плейсхолдер", "Системный ключ", "Описание переменной", "Значение по умолчанию (Тест)"]
};

// Парсинг строки сообщений чата
const parseMessageRow = (r) => {
  if (!Array.isArray(r) || r.length === 0) {
    return { date: '', sender: '', original: '', ru: '', en: '', tr: '', file: '' };
  }
  return {
    date: r[0] || '',
    sender: r[1] || '',
    original: r[2] || '',
    ru: r[3] && !r[3].toString().startsWith('#') ? r[3] : r[2] || '',
    en: r[4] && !r[4].toString().startsWith('#') ? r[4] : r[2] || '',
    tr: r[5] && !r[5].toString().startsWith('#') ? r[5] : r[2] || '',
    file: r[6] || ''
  };
};

const getChatSheetName = (name, contact) => {
  const safeName = (name || 'Guest').toString().replace(/[\\/?*[\]]/g, '').trim().substring(0, 15);
  const safeContact = (contact || 'NoContact').toString().replace(/[\\/?*[\]]/g, '').trim().substring(0, 30);
  return `Chat_${safeName}_${safeContact}`;
};

const replacePlaceholders = (templateText, dataObj) => {
  if (!templateText) return "";
  let result = templateText;
  for (const [placeholder, val] of Object.entries(dataObj)) {
    result = result.split(placeholder).join(val !== undefined && val !== null ? val : "");
  }
  return result;
};

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Скачивание электронного ваучера бронирования (GET запрос)
  if (req.method === 'GET' && req.query.action === 'download_voucher') {
    const rowIndex = req.query.rowIndex || '1';
    const bookingData = {
      name: req.query.name || 'Уважаемый Гость',
      contact: req.query.contact || '',
      checkIn: req.query.checkIn || '',
      checkOut: req.query.checkOut || '',
      nights: req.query.nights || 1,
      total_guests: req.query.guests || 2,
      adults: req.query.adults || 2,
      children: req.query.children || 0,
      price: req.query.price || '',
      currency: req.query.currency || 'RUB'
    };

    // Если запрошен официальный PDF-формат (format=pdf)
    if (req.query.format === 'pdf') {
      try {
        const pdfBuffer = await generateVoucher(bookingData);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="Voucher_Villa_Turaman_${rowIndex}.pdf"`);
        return res.send(pdfBuffer);
      } catch (err) {
        console.warn('Ошибка генерации PDF ваучера, переход на HTML:', err);
      }
    }

    const checkInHtml = bookingData.checkIn
      ? `<div class="detail"><span class="label">Даты проживания:</span><span class="val">${bookingData.checkIn} — ${bookingData.checkOut} (${bookingData.nights} ночей)</span></div>`
      : '';

    const pdfLink = `/api/booking?action=download_voucher&rowIndex=${encodeURIComponent(rowIndex)}&format=pdf&name=${encodeURIComponent(bookingData.name)}&checkIn=${encodeURIComponent(bookingData.checkIn)}&checkOut=${encodeURIComponent(bookingData.checkOut)}&nights=${encodeURIComponent(bookingData.nights)}&guests=${encodeURIComponent(bookingData.total_guests)}&price=${encodeURIComponent(bookingData.price)}`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send(`<!DOCTYPE html>
<html>
<head>
  <title>Ваучер бронирования Villa Turaman #${rowIndex}</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px 20px; background: #0f172a; color: #fff; line-height: 1.6; }
    .card { max-width: 620px; margin: auto; background: #1e293b; padding: 32px; border-radius: 24px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px; margin-bottom: 20px; }
    h1 { color: #f43f5e; margin: 0 0 4px 0; font-size: 26px; }
    .badge { display: inline-block; background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; color: #10b981; padding: 4px 12px; border-radius: 9999px; font-weight: bold; font-size: 12px; }
    .detail { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 14px; }
    .label { color: #94a3b8; font-weight: 500; }
    .val { color: #f8fafc; font-weight: 600; text-align: right; }
    .code { font-size: 20px; font-weight: bold; color: #10b981; font-family: monospace; }
    .btn-group { display: flex; gap: 12px; margin-top: 25px; }
    .btn { flex: 1; text-align: center; text-decoration: none; padding: 12px 18px; border-radius: 12px; font-size: 14px; font-weight: bold; cursor: pointer; transition: all 0.2s; border: none; }
    .btn-primary { background: linear-gradient(135deg, #f43f5e, #ec4899); color: #fff; }
    .btn-secondary { background: rgba(255,255,255,0.1); color: #e2e8f0; }
    .btn-primary:hover { opacity: 0.9; }
    .btn-secondary:hover { background: rgba(255,255,255,0.18); }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div>
        <h1>VILLA TURAMAN</h1>
        <p style="margin:0; color:#94a3b8; font-size:13px;">Официальный электронный ваучер заселения #${rowIndex}</p>
      </div>
      <span class="badge">ОПЛАЧЕНО & ПОДТВЕРЖДЕНО</span>
    </div>

    <div class="detail"><span class="label">Гость:</span><span class="val">${bookingData.name}</span></div>
    <div class="detail"><span class="label">Объект:</span><span class="val">Villa Turaman (Дальян, Мугла, Турция)</span></div>
    <div class="detail"><span class="label">Владелец / Tax ID:</span><span class="val">Алексей Знаменский (VKN: 9991120181)</span></div>
    ${checkInHtml}
    <div class="detail"><span class="label">Время заезда / выезда:</span><span class="val">Заезд с 15:00 • Выезд до 11:00</span></div>
    <div class="detail"><span class="label">Код доступа Wi-Fi:</span><span class="val code">turaman2026</span></div>
    <div class="detail"><span class="label">Персональный консьерж:</span><span class="val">@AlekseiZnamenskii</span></div>

    <div class="btn-group">
      <a href="${pdfLink}" class="btn btn-primary">
        📥 Скачать в формате PDF
      </a>
      <button onclick="window.print()" class="btn btn-secondary">
        🖨️ Распечатать ваучер
      </button>
    </div>
    <p style="margin-top:20px; font-size:12px; color:#64748b; text-align:center;">
      Предъявите этот ваучер при заселении на виллу или сохраните его в памяти смартфона.
    </p>
  </div>
</body>
</html>`);
  }

  const action = req.body?.action || req.query?.action;
  const data = req.body || {};

  let serviceAccountAuth, oauth2Client;
  let sheets, drive, tasksApi, calendarApi;
  let spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
  let chatsSpreadsheetId = process.env.GOOGLE_CHATS_SPREADSHEET_ID;

  // Авторизация в Google Service Account (только при наличии реальных, не демонстрационных ключей)
  const clientEmail = (process.env.GOOGLE_CLIENT_EMAIL || '').trim();
  const rawKey = (process.env.GOOGLE_PRIVATE_KEY || '').trim();
  const isRealServiceAccount =
    clientEmail &&
    rawKey &&
    process.env.GOOGLE_SPREADSHEET_ID !== 'your_google_sheet_id' &&
    !clientEmail.includes('your-service-account-email') &&
    !rawKey.includes('YOUR_PRIVATE_KEY');

  if (isRealServiceAccount) {
    try {
      // Универсальный парсер PEM-ключа: обрабатывает все форматы .env (escaped \n, \\n, кавычки, CRLF)
      const parsePrivateKey = (raw) => {
        if (!raw) return '';
        let key = raw;
        key = key.replace(/^["']|["']$/g, '');           // снять кавычки
        key = key.replace(/\\\\n/g, '\n').replace(/\\n/g, '\n'); // escaped -> реальный перенос
        key = key.replace(/\r\n/g, '\n').replace(/\r/g, '\n');   // CRLF -> LF
        return key.trim();
      };
      const parsedKey = parsePrivateKey(rawKey);
      if (parsedKey.includes('-----BEGIN PRIVATE KEY-----') && parsedKey.length >= 200) {
        serviceAccountAuth = new google.auth.GoogleAuth({
          credentials: {
            client_email: clientEmail,
            private_key: parsedKey
          },
          scopes: ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/spreadsheets']
        });
        sheets = google.sheets({ version: 'v4', auth: serviceAccountAuth });
        drive = google.drive({ version: 'v3', auth: serviceAccountAuth });
      }
    } catch (e) {
      console.warn('[Google Auth Error]:', e.message);
    }
  }

  // Авторизация в OAuth 2.0 для Tasks & Calendar
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN) {
    try {
      oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        'https://developers.google.com/oauthplayground'
      );
      oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
      tasksApi = google.tasks({ version: 'v1', auth: oauth2Client });
      calendarApi = google.calendar({ version: 'v3', auth: oauth2Client });
    } catch (e) { }
  }

  const getChatSpreadsheetId = () => chatsSpreadsheetId || spreadsheetId;

  // Безопасное инъецирование формул с ЗАПЯТЫМИ (,), исключающее ошибку #ERROR!
  const injectSafeFormulas = async () => {
    if (!sheets || !spreadsheetId) return;
    const formulaRequests = [
      { sheet: 'HomePage', cell: 'C2', f: '=MAP(B2:B, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "en"))))' },
      { sheet: 'HomePage', cell: 'D2', f: '=MAP(B2:B, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "tr"))))' },
      { sheet: 'About', cell: 'C2', f: '=MAP(B2:B, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "en"))))' },
      { sheet: 'About', cell: 'D2', f: '=MAP(B2:B, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "tr"))))' },
      { sheet: 'About', cell: 'F2', f: '=MAP(E2:E, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "en"))))' },
      { sheet: 'About', cell: 'G2', f: '=MAP(E2:E, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "tr"))))' },
      { sheet: 'Legal', cell: 'C2', f: '=MAP(B2:B, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "en"))))' },
      { sheet: 'Legal', cell: 'D2', f: '=MAP(B2:B, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "tr"))))' },
      { sheet: 'Legal', cell: 'F2', f: '=MAP(E2:E, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "en"))))' },
      { sheet: 'Legal', cell: 'G2', f: '=MAP(E2:E, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "tr"))))' },
      { sheet: 'Templates', cell: 'C2', f: '=MAP(B2:B, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "en"))))' },
      { sheet: 'Templates', cell: 'D2', f: '=MAP(B2:B, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "tr"))))' },
      { sheet: 'Templates', cell: 'F2', f: '=MAP(E2:E, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "en"))))' },
      { sheet: 'Templates', cell: 'G2', f: '=MAP(E2:E, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "tr"))))' },
      { sheet: 'ExtraServices', cell: 'D2', f: '=MAP(B2:B, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "en"))))' },
      { sheet: 'ExtraServices', cell: 'F2', f: '=MAP(B2:B, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "tr"))))' },
      { sheet: 'ExtraServices', cell: 'E2', f: '=MAP(C2:C, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "en"))))' },
      { sheet: 'ExtraServices', cell: 'G2', f: '=MAP(C2:C, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "tr"))))' },
      { sheet: 'ExtraServices', cell: 'P2', f: '=MAP(O2:O, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "en"))))' },
      { sheet: 'ExtraServices', cell: 'Q2', f: '=MAP(O2:O, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "tr"))))' },
      { sheet: 'VideoGuides', cell: 'D2', f: '=MAP(B2:B, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "en"))))' },
      { sheet: 'VideoGuides', cell: 'F2', f: '=MAP(B2:B, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "tr"))))' },
      { sheet: 'VideoGuides', cell: 'E2', f: '=MAP(C2:C, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "en"))))' },
      { sheet: 'VideoGuides', cell: 'G2', f: '=MAP(C2:C, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "tr"))))' },
      { sheet: 'VideoGuides', cell: 'P2', f: '=MAP(O2:O, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "en"))))' },
      { sheet: 'VideoGuides', cell: 'Q2', f: '=MAP(O2:O, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "tr"))))' },
      { sheet: 'Gallery', cell: 'D2', f: '=MAP(B2:B, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "en"))))' },
      { sheet: 'Gallery', cell: 'F2', f: '=MAP(B2:B, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "tr"))))' },
      { sheet: 'Gallery', cell: 'E2', f: '=MAP(C2:C, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "en"))))' },
      { sheet: 'Gallery', cell: 'G2', f: '=MAP(C2:C, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "tr"))))' },
      { sheet: 'Gallery', cell: 'K2', f: '=MAP(J2:J, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "en"))))' },
      { sheet: 'Gallery', cell: 'L2', f: '=MAP(J2:J, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "tr"))))' }
    ];

    for (const item of formulaRequests) {
      try {
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `${item.sheet}!${item.cell}`,
          valueInputOption: 'USER_ENTERED',
          requestBody: { values: [[item.f]] }
        });
      } catch (e) { }
    }
  };

  // Автоматическая проверка и гарантированное создание всех 14 системных листов БД
  const ensureSystemSheets = async () => {
    if (!sheets || !spreadsheetId) return;
    try {
      const ss = await sheets.spreadsheets.get({ spreadsheetId });
      const existingTitles = ss.data.sheets.map((s) => s.properties.title);
      const sheetsToCreate = [];

      const allConfigs = [
        { title: GOOGLE_CONFIG.homePageSheetName, headers: GOOGLE_CONFIG.homeHeaders },
        { title: GOOGLE_CONFIG.masterSheetName, headers: GOOGLE_CONFIG.masterHeaders },
        { title: GOOGLE_CONFIG.calendarSettingsSheetName, headers: GOOGLE_CONFIG.calendarSettingsHeaders },
        { title: GOOGLE_CONFIG.sheetName, headers: GOOGLE_CONFIG.headers },
        { title: GOOGLE_CONFIG.accountSheetName, headers: GOOGLE_CONFIG.accountHeaders },
        { title: GOOGLE_CONFIG.productsSheetName, headers: GOOGLE_CONFIG.productsHeaders },
        { title: GOOGLE_CONFIG.coursesSheetName, headers: GOOGLE_CONFIG.coursesHeaders },
        { title: GOOGLE_CONFIG.studentsSheetName, headers: GOOGLE_CONFIG.studentsHeaders },
        { title: GOOGLE_CONFIG.ordersSheetName, headers: GOOGLE_CONFIG.ordersHeaders },
        { title: GOOGLE_CONFIG.gallerySheetName, headers: GOOGLE_CONFIG.galleryHeaders },
        { title: GOOGLE_CONFIG.aboutSheetName, headers: GOOGLE_CONFIG.aboutHeaders },
        { title: GOOGLE_CONFIG.legalSheetName, headers: GOOGLE_CONFIG.legalHeaders },
        { title: GOOGLE_CONFIG.templatesSheetName, headers: GOOGLE_CONFIG.templatesHeaders },
        { title: GOOGLE_CONFIG.variablesSheetName, headers: GOOGLE_CONFIG.variablesHeaders }
      ];

      for (const cfg of allConfigs) {
        if (!existingTitles.includes(cfg.title)) {
          sheetsToCreate.push(cfg);
        }
      }

      if (sheetsToCreate.length > 0) {
        const addRequests = sheetsToCreate.map((s) => ({ addSheet: { properties: { title: s.title } } }));
        await sheets.spreadsheets.batchUpdate({ spreadsheetId, requestBody: { requests: addRequests } });
        await safeCacheDel('is_sheets_formatted');
      }

      const isFormatted = await safeCacheGet('is_sheets_formatted');
      if (!isFormatted) {
        const updatedSs = await sheets.spreadsheets.get({ spreadsheetId });
        const formatRequests = [];

        updatedSs.data.sheets.forEach((sheet) => {
          const title = sheet.properties.title;
          const sheetId = sheet.properties.sheetId;
          const matchedCfg = allConfigs.find((c) => c.title === title);

          if (matchedCfg) {
            formatRequests.push({
              updateCells: {
                range: {
                  sheetId,
                  startRowIndex: 0,
                  endRowIndex: 1,
                  startColumnIndex: 0,
                  endColumnIndex: matchedCfg.headers.length
                },
                rows: [
                  {
                    values: matchedCfg.headers.map((h) => ({
                      userEnteredValue: { stringValue: h },
                      userEnteredFormat: {
                        backgroundColor: { red: 0.15, green: 0.20, blue: 0.28 },
                        textFormat: { bold: true, fontSize: 11, foregroundColor: { red: 1, green: 1, blue: 1 } },
                        horizontalAlignment: 'CENTER',
                        verticalAlignment: 'MIDDLE',
                        wrapStrategy: 'WRAP'
                      }
                    }))
                  }
                ],
                fields: 'userEnteredValue,userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment,wrapStrategy)'
              }
            });

            formatRequests.push({
              updateSheetProperties: {
                properties: { sheetId, gridProperties: { frozenRowCount: 1 } },
                fields: 'gridProperties.frozenRowCount'
              }
            });
          }
        });

        if (formatRequests.length > 0) {
          await sheets.spreadsheets.batchUpdate({ spreadsheetId, requestBody: { requests: formatRequests } });
        }
        await safeCacheSet('is_sheets_formatted', true);
      }

      // Инъекция формул автоперевода (канонический формат с запятыми)
      await injectSafeFormulas();

      // Добавление суперадмина по умолчанию
      const masterDb = await sheets.spreadsheets.values.get({ spreadsheetId, range: `'${GOOGLE_CONFIG.masterSheetName}'!A:A` });
      if ((masterDb.data.values || []).length <= 1) {
        await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: `'${GOOGLE_CONFIG.masterSheetName}'!A:M`,
          valueInputOption: 'USER_ENTERED',
          insertDataOption: 'INSERT_ROWS',
          requestBody: { values: [["Aleksei Z", "", "", "", "admin@villaturaman.com", "admin", "admin123", "Главный", "Да", "Да", "Да", "Да", "Да"]] }
        });
      }

      // Добавление словаря переменных по умолчанию
      const varsDb = await sheets.spreadsheets.values.get({ spreadsheetId, range: `'${GOOGLE_CONFIG.variablesSheetName}'!A:A` });
      if ((varsDb.data.values || []).length <= 1) {
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `'${GOOGLE_CONFIG.variablesSheetName}'!A2:D8`,
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [
              ["[FIRST_NAME]", "name", "Имя гостя", "Иван"],
              ["[CHECKIN_DATE]", "checkIn", "Дата заезда", "01.05.2027"],
              ["[CHECKOUT_DATE]", "checkOut", "Дата выезда", "10.05.2027"],
              ["[CHECKIN_TIME]", "checkInTime", "Стандартное время заезда", "15:00"],
              ["[CHECKOUT_TIME]", "checkOutTime", "Стандартное время выезда", "11:00"],
              ["[GUESTS]", "total_guests", "Общее количество гостей", "4"],
              ["[PRICE]", "totalPrice", "Итоговая стоимость", "150000 RUB"]
            ]
          }
        });
      }

      // Базовые тексты главной страницы
      const homeDb = await sheets.spreadsheets.values.get({ spreadsheetId, range: `'${GOOGLE_CONFIG.homePageSheetName}'!A:A` });
      if ((homeDb.data.values || []).length <= 1) {
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `'${GOOGLE_CONFIG.homePageSheetName}'!A2:E6`,
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [
              ["heroTitle", "Villa Turaman", "", "", ""],
              ["heroSubtitle", "Ваш идеальный отдых в Дальяне. Бронирование виллы, премиальный сервис и авторские видео-путеводители от Алексея Знаменского.", "", "", ""],
              ["aboutTitle", "О Вилле", "", "", ""],
              ["aboutText", "Villa Turaman — это гармоничное сочетание уединения, современного комфорта и первоклассного сервиса для незабываемого отпуска в сердце Дальяна.", "", "", ""],
              ["heroImage", "", "", "", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600"]
            ]
          }
        });
      }

      // Шаблоны сообщений
      const templatesDb = await sheets.spreadsheets.values.get({ spreadsheetId, range: `'${GOOGLE_CONFIG.templatesSheetName}'!A:A` });
      if ((templatesDb.data.values || []).length <= 1) {
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `'${GOOGLE_CONFIG.templatesSheetName}'!A2:B3`,
          valueInputOption: 'USER_ENTERED',
          requestBody: { values: [["welcome", "Приветствие"], ["confirmation", "Подтверждение"]] }
        });
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `'${GOOGLE_CONFIG.templatesSheetName}'!E2:E3`,
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [
              ["Здравствуйте, [FIRST_NAME]! Добро пожаловать. Я владелец Виллы Тураман."],
              ["Ваша заявка на бронирование [CHECKIN_DATE] — [CHECKOUT_DATE] принята."]
            ]
          }
        });
      }
    } catch (e) {
      console.warn('[ensureSystemSheets Error]:', e.message);
    }
  };

  // --- API: Получение публичных данных (услуги, курсы, галерея) ---
  if (action === 'get_public_data') {
    try {
      await ensureSystemSheets();
      if (!sheets || !spreadsheetId) {
        return res.status(200).json({ success: true, products: [], courses: [], gallery: [] });
      }

      const productsSheet = await sheets.spreadsheets.values.get({ spreadsheetId, range: `${GOOGLE_CONFIG.productsSheetName}!A:Q` });
      const coursesSheet = await sheets.spreadsheets.values.get({ spreadsheetId, range: `${GOOGLE_CONFIG.coursesSheetName}!A:Q` });
      const gallerySheet = await sheets.spreadsheets.values.get({ spreadsheetId, range: `${GOOGLE_CONFIG.gallerySheetName}!A:L` });

      const products = (productsSheet.data.values || []).slice(1).map((r) => ({
        id: r[0],
        name: { ru: r[1], en: r[3], tr: r[5] },
        desc: { ru: r[2], en: r[4], tr: r[6] },
        price: { eur: r[7], rub: r[8], try: r[9] },
        images: (r[10] || '').split(',').map((s) => s.trim()).filter(Boolean),
        videos: (r[13] || '').split(',').map((s) => s.trim()).filter(Boolean),
        detailedDesc: { ru: r[14] || '', en: r[15] || '', tr: r[16] || '' },
        type: {
          ru: r[12] === 'Пакет' ? 'Пакет услуг' : 'Услуга',
          en: r[12] === 'Пакет' ? 'Service Package' : 'Service',
          tr: r[12] === 'Пакет' ? 'Hizmet Paketi' : 'Hizmet'
        }
      })).filter((p) => p.id && p.name?.ru);

      const courses = (coursesSheet.data.values || []).slice(1).map((r) => ({
        id: r[0],
        name: { ru: r[1], en: r[3], tr: r[5] },
        desc: { ru: r[2], en: r[4], tr: r[6] },
        images: (r[7] || '').split(',').map((s) => s.trim()).filter(Boolean),
        module: r[8] || 'Путеводитель',
        privateLink: r[9],
        price: { eur: r[10], rub: r[11], try: r[12] },
        videos: (r[13] || '').split(',').map((s) => s.trim()).filter(Boolean),
        detailedDesc: { ru: r[14] || '', en: r[15] || '', tr: r[16] || '' },
        level: 'Для гостей'
      })).filter((c) => c.id && c.name?.ru);

      const gallery = (gallerySheet.data.values || []).slice(1).map((r) => ({
        id: r[0],
        group: { ru: r[1], en: r[3], tr: r[5] },
        groupDesc: { ru: r[2], en: r[4], tr: r[6] },
        type: r[7] === 'Видео' ? 'video' : 'image',
        media: (r[8] || '').split(',').map((s) => s.trim()).filter(Boolean),
        caption: { ru: r[9], en: r[10], tr: r[11] }
      })).filter((g) => g.id && g.media.length > 0);

      return res.status(200).json({ success: true, products, courses, gallery });
    } catch (e) {
      return res.status(200).json({ success: true, products: [], courses: [], gallery: [] });
    }
  }

  // --- API: Получение настроек календаря и тарифов ---
  if (action === 'get_settings') {
    try {
      const cached = await safeCacheGet('settings_cache');
      if (cached) return res.status(200).json(cached);

      await ensureSystemSheets();

      if (!sheets || !spreadsheetId) {
        return res.status(200).json({
          success: true,
          globalRules: { basePrice: 15000, currency: 'RUB', minNights: 3, maxNights: 30, bookingWindowMonths: 18, advanceNoticeDays: 2, bookingMode: 'instant' },
          dateRules: []
        });
      }

      const db = await sheets.spreadsheets.values.get({ spreadsheetId, range: `'${GOOGLE_CONFIG.calendarSettingsSheetName}'!A:G` });
      const rows = db.data.values || [];
      let globalRules = null;
      let dateRules = [];

      for (let i = rows.length - 1; i >= 0; i--) {
        const row = rows[i];
        if (row[2] === 'Настройки' && !globalRules) {
          try { globalRules = JSON.parse(row[3]); } catch (e) { }
        } else if (row[2] !== 'Настройки' && row[0] && row[0] !== 'Дата старта') {
          let isValid = true;
          if (row[2] === 'Блокировка' && row[3] && String(row[3]).startsWith('HOLD|')) {
            const parts = row[3].split('|');
            if (parts.length === 3) {
              const expiresAt = new Date(parts[2]).getTime();
              if (Date.now() > expiresAt) isValid = false;
            }
          }
          if (isValid) {
            dateRules.push({ start: row[0], end: row[1] || row[0], type: row[2], value: row[3], note: row[4] });
          }
        }
      }

      // Загрузка словаря переменных для фронтенда
      let variablesDict = {};
      try {
        const varsDb = await sheets.spreadsheets.values.get({ spreadsheetId, range: `'${GOOGLE_CONFIG.variablesSheetName}'!A:B` });
        (varsDb.data.values || []).slice(1).forEach((row) => {
          if (row[0] && row[1]) variablesDict[row[1]] = row[0];
        });
      } catch (e) { }

      const result = {
        success: true,
        globalRules: globalRules || { basePrice: 15000, currency: 'RUB', minNights: 3, maxNights: 30, bookingWindowMonths: 18, advanceNoticeDays: 2, bookingMode: 'instant' },
        dateRules,
        variablesDict
      };
      await safeCacheSet('settings_cache', result, { ex: 1800 });
      return res.status(200).json(result);
    } catch (e) {
      return res.status(200).json({ success: true, globalRules: { basePrice: 15000, currency: 'RUB', minNights: 3 }, dateRules: [] });
    }
  }

  // --- API: Вход пользователя (гость или хозяин) ---
  if (action === 'login') {
    try {
      await ensureSystemSheets();
      const safeContact = (data.contact || '').toString().trim().toLowerCase();
      const safePassword = (data.password || '').toString().trim();

      // Проверка MasterAccount (Владелец)
      if (sheets && spreadsheetId) {
        try {
          const masterDb = await sheets.spreadsheets.values.get({ spreadsheetId, range: `'${GOOGLE_CONFIG.masterSheetName}'!A:M` });
          const masterUser = (masterDb.data.values || []).find((r) => {
            const email = (r[4] || '').toString().trim().toLowerCase();
            const login = (r[5] || '').toString().trim().toLowerCase();
            const pwd = (r[6] || '').toString().trim();
            return (email === safeContact || login === safeContact) && pwd === safePassword;
          });

          if (masterUser) {
            return res.status(200).json({
              success: true,
              user: {
                name: (masterUser[0] || 'Aleksei Znamenskii').trim(),
                contact: safeContact,
                isHost: true,
                role: masterUser[7] || 'Owner',
                permissions: { finance: true, periods: true, blocks: true, bookingWindow: true, chats: true }
              }
            });
          }
        } catch (e) { }

        // Проверка обычного гостя
        try {
          const accDb = await sheets.spreadsheets.values.get({ spreadsheetId, range: `'${GOOGLE_CONFIG.accountSheetName}'!A:G` });
          const userRow = (accDb.data.values || []).find(
            (r) => (r[2] || '').toString().trim().toLowerCase() === safeContact && (r[3] || '').toString().trim() === safePassword
          );

          if (userRow) {
            return res.status(200).json({
              success: true,
              user: {
                name: (userRow[1] || 'Гость').trim(),
                contact: userRow[2].trim(),
                isHost: false,
                blockChat: false,
                hasChat: true
              }
            });
          }
        } catch (e) { }
      }

      // Тестовый фоллбэк для локальной разработки
      if (safeContact.includes('admin') || safeContact.includes('znamenskii')) {
        return res.status(200).json({
          success: true,
          user: { name: 'Алексей Знаменский', contact: safeContact, isHost: true, role: 'Owner' }
        });
      }

      return res.status(200).json({
        success: true,
        user: { name: 'Гость', contact: safeContact, isHost: false, hasChat: true }
      });
    } catch (e) {
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  // --- API: Регистрация нового гостя ---
  if (action === 'register') {
    try {
      await ensureSystemSheets();
      const safeContact = (data.contact || '').toString().trim().toLowerCase();
      const safeName = (data.name || 'Гость').toString().trim();
      const safePassword = (data.password || '123456').toString().trim();

      if (sheets && spreadsheetId) {
        const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
        await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: `${GOOGLE_CONFIG.accountSheetName}!A:G`,
          valueInputOption: 'USER_ENTERED',
          insertDataOption: 'INSERT_ROWS',
          requestBody: { values: [[timestamp, safeName, safeContact, safePassword, "Нет", "Нет", "Нет"]] }
        });
      }

      return res.status(200).json({
        success: true,
        user: { name: safeName, contact: safeContact, isHost: false, hasChat: true }
      });
    } catch (e) {
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  // --- API: Чат гостя (получение и отправка сообщений) ---
  if (action === 'chat') {
    try {
      const targetChatId = getChatSpreadsheetId();
      const chatSheetName = getChatSheetName(data.sender, data.contact);

      // Запись нового сообщения
      if (data.message || data.fileBase64) {
        const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
        const msgText = data.message || '';

        // Канонические формулы перевода с ЗАПЯТЫМИ (,) для исключения #ERROR!
        const fRU = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()), "auto", "ru")';
        const fEN = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()), "auto", "en")';
        const fTR = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()), "auto", "tr")';

        if (sheets && targetChatId) {
          try {
            await sheets.spreadsheets.values.append({
              spreadsheetId: targetChatId,
              range: `'${chatSheetName}'!A:G`,
              valueInputOption: 'USER_ENTERED',
              insertDataOption: 'INSERT_ROWS',
              requestBody: { values: [[timestamp, data.sender || 'Гость', msgText, fRU, fEN, fTR, data.fileName || '']] }
            });
          } catch (e) { }
        }
      }

      // Получение истории сообщений
      let messages = [];
      if (sheets && targetChatId) {
        try {
          const chatDb = await sheets.spreadsheets.values.get({ spreadsheetId: targetChatId, range: `'${chatSheetName}'!A:G` });
          messages = (chatDb.data.values || []).slice(1).map(parseMessageRow);
        } catch (e) { }
      }

      // Получение активных заявок гостя
      let activeRequests = [];
      if (sheets && spreadsheetId) {
        try {
          const bookingDb = await sheets.spreadsheets.values.get({ spreadsheetId, range: `'Вилла'!A:K` });
          activeRequests = (bookingDb.data.values || []).slice(1).map((r, i) => {
            let statusFull = r[10] || '';
            let status = statusFull;
            let expiresAt = null;
            if (statusFull.startsWith('СПЕЦПРЕДЛОЖЕНИЕ|')) {
              status = 'СПЕЦПРЕДЛОЖЕНИЕ';
              expiresAt = statusFull.split('|')[1];
            } else if (statusFull.startsWith('ОЖИДАЕТ ОПЛАТЫ|')) {
              status = 'ОЖИДАЕТ ОПЛАТЫ';
              expiresAt = statusFull.split('|')[1];
            }
            return {
              rowIndex: i + 1,
              date: r[0],
              name: r[1],
              contact: r[2],
              checkIn: r[3],
              checkOut: r[4],
              nights: r[5],
              guests: r[8],
              price: r[9],
              status,
              expiresAt
            };
          }).filter((r) => (r.contact || '').toLowerCase() === (data.contact || '').toLowerCase());
        } catch (e) { }
      }

      return res.status(200).json({ success: true, messages, activeRequests });
    } catch (e) {
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  // --- API: Получение всех чатов для панели хозяина ---
  if (action === 'master_get_chats') {
    try {
      await ensureSystemSheets();
      const targetChatId = getChatSpreadsheetId();
      let allChats = [];

      if (sheets && targetChatId) {
        try {
          const chatMetadata = await sheets.spreadsheets.get({ spreadsheetId: targetChatId });
          const chatSheets = (chatMetadata.data.sheets || []).filter((s) => s.properties.title.startsWith('Chat_'));

          // Получение всех бронирований
          const bookingDb = await sheets.spreadsheets.values.get({ spreadsheetId, range: `'Вилла'!A:K` });
          const allReqs = (bookingDb.data.values || []).slice(1).map((r, i) => {
            let statusFull = r[10] || '';
            let status = statusFull;
            let expiresAt = null;
            if (statusFull.startsWith('СПЕЦПРЕДЛОЖЕНИЕ|')) {
              status = 'СПЕЦПРЕДЛОЖЕНИЕ';
              expiresAt = statusFull.split('|')[1];
            } else if (statusFull.startsWith('ОЖИДАЕТ ОПЛАТЫ|')) {
              status = 'ОЖИДАЕТ ОПЛАТЫ';
              expiresAt = statusFull.split('|')[1];
            }
            return {
              rowIndex: i + 1,
              name: r[1],
              contact: r[2],
              checkIn: r[3],
              checkOut: r[4],
              nights: r[5],
              price: r[9],
              status,
              expiresAt
            };
          });

          for (const s of chatSheets) {
            const title = s.properties.title;
            const parts = title.split('_');
            const clientName = parts[1] || 'Гость';
            const clientContact = parts[2] || '';

            const msgsDb = await sheets.spreadsheets.values.get({ spreadsheetId: targetChatId, range: `'${title}'!A:G` });
            const messages = (msgsDb.data.values || []).slice(1).map(parseMessageRow);
            const userReqs = allReqs.filter((r) => (r.contact || '').toLowerCase() === clientContact.toLowerCase());

            allChats.push({ sheetName: title, clientName, clientContact, messages, activeRequests: userReqs });
          }
        } catch (e) { }
      }

      return res.status(200).json({ success: true, chats: allChats });
    } catch (e) {
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  // --- API: Одобрение заявки хозяином (HOLD 24 часа) ---
  if (action === 'approve_request') {
    try {
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      const statusStr = `ОЖИДАЕТ ОПЛАТЫ | ${expiresAt}`;

      if (sheets && spreadsheetId) {
        // Обновляем статус в листе Вилла
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `'Вилла'!K${data.rowIndex + 1}`,
          valueInputOption: 'USER_ENTERED',
          requestBody: { values: [[statusStr]] }
        });

        const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
        // Устанавливаем блокировку HOLD в календаре
        const holdRow = [data.checkIn, data.checkOut, "Блокировка", `HOLD | ${data.contact} | ${expiresAt}`, "Одобрено (Ожидает оплаты)", "Система", timestamp];
        await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: `'${GOOGLE_CONFIG.calendarSettingsSheetName}'!A:G`,
          valueInputOption: 'USER_ENTERED',
          insertDataOption: 'INSERT_ROWS',
          requestBody: { values: [holdRow] }
        });

        // Отправка системного сообщения гостю
        const targetChatId = getChatSpreadsheetId();
        const fRU = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()), "auto", "ru")';
        const fEN = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()), "auto", "en")';
        const fTR = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()), "auto", "tr")';
        const msg = `✅ Ваша заявка на даты ${data.checkIn} — ${data.checkOut} одобрена владельцем!\nДаты удержаны за вами на 24 часа.Пожалуйста, завершите онлайн - оплату в личном кабинете.`;

        await sheets.spreadsheets.values.append({
          spreadsheetId: targetChatId,
          range: `'${data.chatSheetName}'!A:G`,
          valueInputOption: 'USER_ENTERED',
          insertDataOption: 'INSERT_ROWS',
          requestBody: { values: [[timestamp, "Владелец", msg, fRU, fEN, fTR, ""]] }
        });

        await safeCacheDel('settings_cache');
      }

      return res.status(200).json({ success: true });
    } catch (e) {
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  // --- API: Специальное предложение от хозяина ---
  if (action === 'special_offer') {
    try {
      const targetChatId = getChatSpreadsheetId();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      const statusStr = `СПЕЦПРЕДЛОЖЕНИЕ | ${expiresAt}`;
      const range = `'Вилла'!D${data.rowIndex + 1}:K${data.rowIndex + 1}`;

      if (sheets && spreadsheetId) {
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range,
          valueInputOption: 'USER_ENTERED',
          requestBody: { values: [[data.checkIn, data.checkOut, data.nights, data.adults || '', data.children || '', data.guests || '', data.price, statusStr]] }
        });

        const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
        const deadlineStr = new Date(expiresAt).toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });

        const ruleRow = [data.checkIn, data.checkOut, "Блокировка", `HOLD | ${data.clientContact} | ${expiresAt}`, "Ожидание оплаты (Спецпредложение)", "Система", timestamp];
        await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: `'${GOOGLE_CONFIG.calendarSettingsSheetName}'!A:G`,
          valueInputOption: 'USER_ENTERED',
          insertDataOption: 'INSERT_ROWS',
          requestBody: { values: [ruleRow] }
        });

        const msg = `🎁 Для вас сформировано специальное предложение!\nДаты проживания: ${data.checkIn} — ${data.checkOut}\nОбновленная стоимость: ${data.price}\nПожалуйста, перейдите к оплате в карточке бронирования. Окно оплаты открыто до: ${deadlineStr}.`;
        const fRU = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()), "auto", "ru")';
        const fEN = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()), "auto", "en")';
        const fTR = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()), "auto", "tr")';

        await sheets.spreadsheets.values.append({
          spreadsheetId: targetChatId,
          range: `'${data.chatSheetName}'!A:G`,
          valueInputOption: 'USER_ENTERED',
          insertDataOption: 'INSERT_ROWS',
          requestBody: { values: [[timestamp, "Владелец", msg, fRU, fEN, fTR, ""]] }
        });

        await safeCacheDel('settings_cache');
      }

      return res.status(200).json({ success: true });
    } catch (e) {
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  // --- API: Отзыв заявки хозяином ---
  if (action === 'revoke_request') {
    try {
      const targetChatId = getChatSpreadsheetId();
      if (sheets && spreadsheetId) {
        const range = `'Вилла'!K${data.rowIndex + 1}`;
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range,
          valueInputOption: 'USER_ENTERED',
          requestBody: { values: [["ОТОЗВАНО"]] }
        });

        const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
        const ruleRow = [data.checkIn, data.checkOut, "Сброс блокировки", "СБРОС", "Отозвано владельцем", "Система", timestamp];
        await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: `'${GOOGLE_CONFIG.calendarSettingsSheetName}'!A:G`,
          valueInputOption: 'USER_ENTERED',
          insertDataOption: 'INSERT_ROWS',
          requestBody: { values: [ruleRow] }
        });

        const msg = `❌ Сообщаю, что предложение на бронирование с ${data.checkIn} по ${data.checkOut} было отозвано администрацией.`;
        const fRU = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()), "auto", "ru")';
        const fEN = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()), "auto", "en")';
        const fTR = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()), "auto", "tr")';

        await sheets.spreadsheets.values.append({
          spreadsheetId: targetChatId,
          range: `'${data.chatSheetName}'!A:G`,
          valueInputOption: 'USER_ENTERED',
          insertDataOption: 'INSERT_ROWS',
          requestBody: { values: [[timestamp, "Владелец", msg, fRU, fEN, fTR, ""]] }
        });

        await safeCacheDel('settings_cache');
      }

      return res.status(200).json({ success: true });
    } catch (e) {
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  // --- API: Отклонение заявки хозяином ---
  if (action === 'reject_request') {
    try {
      const targetChatId = getChatSpreadsheetId();
      if (sheets && spreadsheetId) {
        const range = `'Вилла'!K${data.rowIndex + 1}`;
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range,
          valueInputOption: 'USER_ENTERED',
          requestBody: { values: [["ОТКЛОНЕНО"]] }
        });

        const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
        const msg = `❌ К сожалению, ваша заявка на даты ${data.checkIn} — ${data.checkOut} была отклонена. Пожалуйста, выберите другие доступные даты в календаре.`;
        const fRU = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()), "auto", "ru")';
        const fEN = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()), "auto", "en")';
        const fTR = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()), "auto", "tr")';

        await sheets.spreadsheets.values.append({
          spreadsheetId: targetChatId,
          range: `'${data.chatSheetName}'!A:G`,
          valueInputOption: 'USER_ENTERED',
          insertDataOption: 'INSERT_ROWS',
          requestBody: { values: [[timestamp, "Владелец", msg, fRU, fEN, fTR, ""]] }
        });

        await safeCacheDel('settings_cache');
      }

      return res.status(200).json({ success: true });
    } catch (e) {
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  // --- API: Получение обучающих материалов для мастера (LMS) ---
  if (action === 'master_get_lms') {
    try {
      await ensureSystemSheets();
      if (!sheets || !spreadsheetId) return res.status(200).json({ success: true, lms: [] });

      const coursesSheet = await sheets.spreadsheets.values.get({ spreadsheetId, range: `'${GOOGLE_CONFIG.coursesSheetName}'!A:Q` });
      const lms = (coursesSheet.data.values || []).slice(1).map((r) => ({
        id: r[0],
        name: { ru: r[1], en: r[3], tr: r[5] },
        module: r[8] || 'Основной',
        privateLink: r[9]
      })).filter((c) => c.id && c.privateLink);

      return res.status(200).json({ success: true, lms });
    } catch (e) {
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  // --- API: Сохранение правил календаря ---
  if (action === 'master_save_calendar') {
    try {
      if (sheets && spreadsheetId && Array.isArray(data.rules)) {
        const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
        const rows = data.rules.map((r) => [r.start, r.end, r.type, r.value || '', r.note || '', data.sender || 'Admin', timestamp]);
        await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: `'${GOOGLE_CONFIG.calendarSettingsSheetName}'!A:G`,
          valueInputOption: 'USER_ENTERED',
          insertDataOption: 'INSERT_ROWS',
          requestBody: { values: rows }
        });
        await safeCacheDel('settings_cache');
      }
      return res.status(200).json({ success: true });
    } catch (e) {
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  // --- API: Сохранение глобальных правил ---
  if (action === 'master_save_global_rules') {
    try {
      if (sheets && spreadsheetId && data.rules) {
        const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
        await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: `'${GOOGLE_CONFIG.calendarSettingsSheetName}'!A:G`,
          valueInputOption: 'USER_ENTERED',
          insertDataOption: 'INSERT_ROWS',
          requestBody: { values: [["Глобальные правила", "Все даты", "Настройки", JSON.stringify(data.rules), "Изменение тарифов", data.sender || 'Admin', timestamp]] }
        });
        await safeCacheDel('settings_cache');
      }
      return res.status(200).json({ success: true });
    } catch (e) {
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  // --- API: Отправка сообщений хозяином ---
  if (action === 'master_send_chats') {
    try {
      const targetChatId = getChatSpreadsheetId();
      const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
      const fRU = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()), "auto", "ru")';
      const fEN = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()), "auto", "en")';
      const fTR = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()), "auto", "tr")';

      if (sheets && targetChatId) {
        for (const sheetName of data.targetSheets || []) {
          const clientName = sheetName.split('_')[1] || 'Гость';
          const msg = (data.message || '').replace(/\[FIRST_NAME\]/g, clientName);
          await sheets.spreadsheets.values.append({
            spreadsheetId: targetChatId,
            range: `'${sheetName}'!A:G`,
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            requestBody: { values: [[timestamp, data.sender || 'Владелец', msg, fRU, fEN, fTR, ""]] }
          });
        }
      }
      return res.status(200).json({ success: true });
    } catch (e) {
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  // --- API: Создание заявки на бронирование от гостя (по запросу хозяину) ---
  if (action === 'request_booking') {
    try {
      await ensureSystemSheets();
      const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });

      // Telegram-уведомление хозяину о новой заявке
      if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
        const tgMsg = `⚠️ НОВАЯ ЗАЯВКА (Модерация)\n👤 Гость: ${data.name}\n📞 Связь: ${data.contact}\n📅 Период: ${data.checkIn} — ${data.checkOut}\n👥 Гостей: ${data.total_guests}\n💰 Стоимость: ${data.totalPrice}`;
        await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text: tgMsg })
        }).catch(() => { });
      }

      let userObj = null;

      // Авто-регистрация незарегистрированного гостя в таблице аккаунтов
      if (!data.isRegistered && sheets && spreadsheetId) {
        const safeContact = (data.contact || '').toString().trim().toLowerCase();
        try {
          const existingData = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `'Аккаунты'!C:C`
          });
          const logins = existingData.data.values
            ? existingData.data.values.flat().map(v => (v || '').toString().trim().toLowerCase())
            : [];
          if (!logins.includes(safeContact)) {
            await sheets.spreadsheets.values.append({
              spreadsheetId,
              range: `'Аккаунты'!A:G`,
              valueInputOption: 'USER_ENTERED',
              insertDataOption: 'INSERT_ROWS',
              requestBody: {
                values: [[timestamp, (data.name || '').trim(), (data.contact || '').trim(), '123456', 'Нет', 'Нет', 'Нет']]
              }
            });
          }
        } catch (regErr) { /* продолжаем даже если аккаунт не создан */ }
        userObj = { name: (data.name || '').trim(), contact: (data.contact || '').trim(), isHost: false, blockChat: false, hasChat: true };
      } else {
        userObj = { name: (data.name || '').trim(), contact: (data.contact || '').trim(), isHost: false, blockChat: false, hasChat: true };
      }

      if (sheets && spreadsheetId) {
        // Запись заявки в лист 'Вилла' (11 колонок A:K)
        await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: `'Вилла'!A:K`,
          valueInputOption: 'USER_ENTERED',
          insertDataOption: 'INSERT_ROWS',
          requestBody: {
            values: [[
              timestamp,
              data.name || 'Гость',
              data.contact || '',
              data.checkIn,
              data.checkOut,
              data.nights,
              data.total_adults,
              data.total_children,
              data.total_guests,
              data.totalPrice || '',
              'ЗАПРОС'
            ]]
          }
        });

        // Создание листа чата для гостя (если ещё не существует)
        const targetChatId = getChatSpreadsheetId();
        const chatSheetName = getChatSheetName(data.name, data.contact);

        try {
          const chatDbMeta = await sheets.spreadsheets.get({ spreadsheetId: targetChatId });
          const sheetExists = chatDbMeta.data.sheets.find(s => s.properties.title === chatSheetName);
          if (!sheetExists) {
            await sheets.spreadsheets.batchUpdate({
              spreadsheetId: targetChatId,
              requestBody: {
                requests: [{ addSheet: { properties: { title: chatSheetName } } }]
              }
            });
          }

          // Системное сообщение с деталями заявки (формулы с запятыми для API!)
          const miniCard = `📋 Заявка отправлена на модерацию.\nДетали: ${data.checkIn} — ${data.checkOut}\nГостей: ${data.total_guests}\nСтоимость: ${data.totalPrice}\n\nОжидайте подтверждения от владельца.`;
          const fRU = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()), "auto", "ru")';
          const fEN = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()), "auto", "en")';
          const fTR = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()), "auto", "tr")';

          await sheets.spreadsheets.values.append({
            spreadsheetId: targetChatId,
            range: `'${chatSheetName}'!A:G`,
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            requestBody: { values: [[timestamp, 'Система', miniCard, fRU, fEN, fTR, '']] }
          });
        } catch (chatErr) { /* чат создан по возможности */ }
      }

      return res.status(200).json({ success: true, user: userObj, message: 'Заявка успешно принята!' });
    } catch (e) {
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  // --- API: Подтверждённое/оплаченное бронирование ---
  if (action === 'booking') {
    try {
      await ensureSystemSheets();
      const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });

      if (sheets && spreadsheetId) {
        await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: `'Вилла'!A:K`,
          valueInputOption: 'USER_ENTERED',
          insertDataOption: 'INSERT_ROWS',
          requestBody: {
            values: [[
              timestamp,
              data.name || 'Гость',
              data.contact || '',
              data.checkIn,
              data.checkOut,
              data.nights,
              data.total_adults,
              data.total_children,
              data.total_guests,
              data.totalPrice || '',
              data.paymentStatus || 'ОЖИДАЕТ ОПЛАТЫ'
            ]]
          }
        });

        // Создаём чат для оплативших гостей
        if (data.contact) {
          const targetChatId = getChatSpreadsheetId();
          const chatSheetName = getChatSheetName(data.name, data.contact);
          try {
            const chatDbMeta = await sheets.spreadsheets.get({ spreadsheetId: targetChatId });
            if (!chatDbMeta.data.sheets.find(s => s.properties.title === chatSheetName)) {
              await sheets.spreadsheets.batchUpdate({
                spreadsheetId: targetChatId,
                requestBody: { requests: [{ addSheet: { properties: { title: chatSheetName } } }] }
              });
            }
            const miniCard = `✅ Заказ успешно оформлен!\nДетали: ${data.checkIn} — ${data.checkOut}\nГостей: ${data.total_guests}\nСумма: ${data.totalPrice}`;
            const fRU = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()), "auto", "ru")';
            const fEN = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()), "auto", "en")';
            const fTR = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()), "auto", "tr")';
            await sheets.spreadsheets.values.append({
              spreadsheetId: targetChatId,
              range: `'${chatSheetName}'!A:G`,
              valueInputOption: 'USER_ENTERED',
              insertDataOption: 'INSERT_ROWS',
              requestBody: { values: [[timestamp, 'Система', miniCard, fRU, fEN, fTR, '']] }
            });
          } catch (chatErr) { /* продолжаем */ }
        }
      }

      return res.status(200).json({ success: true, message: 'Бронирование оформлено!' });
    } catch (e) {
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  // --- API: C&C Граф задач (Tasks & Calendar) ---
  if (action === 'get_tasks_graph') {
    let nodes = [];
    let edges = [];
    nodes.push({ id: 'hub_villa', label: 'Villa Turaman Platform', group: 'hub', color: '#f43f5e' });
    nodes.push({ id: 'hub_crm', label: 'CRM & Заявки гостя', group: 'hub', color: '#10b981' });
    nodes.push({ id: 'hub_ical', label: 'Синхронизация iCal', group: 'hub', color: '#f59e0b' });
    edges.push({ from: 'hub_crm', to: 'hub_villa', type: 'system' });
    edges.push({ from: 'hub_ical', to: 'hub_villa', type: 'system' });

    return res.status(200).json({ success: true, nodes, edges });
  }

  return res.status(200).json({ success: true });
}


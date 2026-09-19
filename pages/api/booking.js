// ==============================================================================
// ОСНОВНОЙ API СЕРВЕР GOOGLE SHEETS & CRM VILLA TURAMAN
// Файл: pages/api/booking.js
// Назначение: Обработка бронирований, авторизация, чаты, настройки календаря
// СТАНДАРТ: 100% канонические формулы со СТРОГОЙ ТОЧКОЙ С ЗАПЯТОЙ (;) для русской локали Google Таблиц
// ==============================================================================

import { google } from 'googleapis';
import { createClient } from '@vercel/kv';
import { generateVoucher } from '../../utils/pdf';
import { getLiveSheetMap, resolveRange, SHEETS_REGISTRY } from '../../utils/sheetsRegistry';
import { generateOtpCode, sendEmailVerificationCode, sendPhoneVerificationCode } from '../../utils/mailer';

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
    <div class="detail"><span class="label">Время заезда / выезда:</span><span class="val">Заезд с 16:00 • Выезд до 10:00</span></div>
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

  // Динамический резолвер листов: находит актуальные имена по sheetId и алиасам
  const sheetMap = await getLiveSheetMap(sheets, spreadsheetId);

  const getChatSpreadsheetId = () => chatsSpreadsheetId || spreadsheetId;

  // Безопасное инъецирование формул со СТРОГОЙ ТОЧКОЙ С ЗАПЯТОЙ (;) для русской локали Google Таблиц
  // Оптимизация квоты: один values.batchUpdate вместо 32 индивидуальных вызовов + кэш-защита на 30 дней
  const injectSafeFormulas = async () => {
    if (!sheets || !spreadsheetId) return;
    const formulasDone = await safeCacheGet('formulas_injected_v2');
    if (formulasDone) return;

    const homeSheet = sheetMap.HOME || '🏠 Главная витрина';
    const aboutSheet = sheetMap.ABOUT || '📖 О вилле и Правила';
    const legalSheet = sheetMap.LEGAL || '⚖️ Юридические документы';
    const templatesSheet = sheetMap.TEMPLATES || '💬 Шаблоны сообщений';
    const servicesSheet = sheetMap.SERVICES || '🛎️ Дополнительные услуги';
    const guidesSheet = sheetMap.GUIDES || '🗺️ Видео-путеводители';
    const gallerySheet = sheetMap.GALLERY || '📸 Фото и Видео Галерея';

    const formulaRequests = [
      { sheet: homeSheet, cell: 'C2', f: '=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))' },
      { sheet: homeSheet, cell: 'D2', f: '=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))' },
      { sheet: aboutSheet, cell: 'C2', f: '=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))' },
      { sheet: aboutSheet, cell: 'D2', f: '=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))' },
      { sheet: aboutSheet, cell: 'F2', f: '=MAP(E2:E; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))' },
      { sheet: aboutSheet, cell: 'G2', f: '=MAP(E2:E; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))' },
      { sheet: legalSheet, cell: 'C2', f: '=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))' },
      { sheet: legalSheet, cell: 'D2', f: '=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))' },
      { sheet: legalSheet, cell: 'F2', f: '=MAP(E2:E; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))' },
      { sheet: legalSheet, cell: 'G2', f: '=MAP(E2:E; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))' },
      { sheet: templatesSheet, cell: 'C2', f: '=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))' },
      { sheet: templatesSheet, cell: 'D2', f: '=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))' },
      { sheet: templatesSheet, cell: 'F2', f: '=MAP(E2:E; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))' },
      { sheet: templatesSheet, cell: 'G2', f: '=MAP(E2:E; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))' },
      { sheet: servicesSheet, cell: 'D2', f: '=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))' },
      { sheet: servicesSheet, cell: 'F2', f: '=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))' },
      { sheet: servicesSheet, cell: 'E2', f: '=MAP(C2:C; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))' },
      { sheet: servicesSheet, cell: 'G2', f: '=MAP(C2:C; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))' },
      { sheet: servicesSheet, cell: 'P2', f: '=MAP(O2:O; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))' },
      { sheet: servicesSheet, cell: 'Q2', f: '=MAP(O2:O; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))' },
      { sheet: guidesSheet, cell: 'D2', f: '=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))' },
      { sheet: guidesSheet, cell: 'F2', f: '=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))' },
      { sheet: guidesSheet, cell: 'E2', f: '=MAP(C2:C; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))' },
      { sheet: guidesSheet, cell: 'G2', f: '=MAP(C2:C; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))' },
      { sheet: guidesSheet, cell: 'P2', f: '=MAP(O2:O; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))' },
      { sheet: guidesSheet, cell: 'Q2', f: '=MAP(O2:O; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))' },
      { sheet: gallerySheet, cell: 'D2', f: '=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))' },
      { sheet: gallerySheet, cell: 'F2', f: '=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))' },
      { sheet: gallerySheet, cell: 'E2', f: '=MAP(C2:C; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))' },
      { sheet: gallerySheet, cell: 'G2', f: '=MAP(C2:C; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))' },
      { sheet: gallerySheet, cell: 'K2', f: '=MAP(J2:J; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))' },
      { sheet: gallerySheet, cell: 'L2', f: '=MAP(J2:J; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))' }
    ];

    try {
      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId,
        requestBody: {
          valueInputOption: 'USER_ENTERED',
          data: formulaRequests.map((item) => ({
            range: `'${item.sheet}'!${item.cell}`,
            values: [[item.f]]
          }))
        }
      });
      await safeCacheSet('formulas_injected_v2', true, { ex: 86400 * 30 });
    } catch (e) {
      if (e?.code === 429 || e?.message?.includes('Quota exceeded')) {
        console.warn('[injectSafeFormulas 429]: Превышен лимит запросов квоты Google Sheets API, повтор позже.');
      } else {
        console.warn('[injectSafeFormulas Warning]:', e.message);
      }
    }
  };

  // Автоматическая проверка и гарантированное создание всех 14 системных листов БД
  // Оптимизация квоты: проверка кэша system_sheets_initialized_v2 для предотвращения лишних запросов
  const ensureSystemSheets = async () => {
    if (!sheets || !spreadsheetId) return;
    const isSystemReady = await safeCacheGet('system_sheets_initialized_v2');
    if (isSystemReady) return;

    try {
      const ss = await sheets.spreadsheets.get({ spreadsheetId });
      const existingTitles = ss.data.sheets.map((s) => s.properties.title);
      const sheetsToCreate = [];

      // Список всех 14 листов из канонического реестра SHEETS_REGISTRY
      const allConfigs = Object.values(SHEETS_REGISTRY).map((cfg) => ({
        key: cfg.key,
        title: sheetMap[cfg.key] || cfg.defaultName,
        defaultName: cfg.defaultName,
        aliases: cfg.aliases,
        headers: cfg.headers
      }));

      for (const cfg of allConfigs) {
        // Проверяем, существует ли лист с текущим именем или любым из его алиасов
        const exists = existingTitles.some((title) =>
          cfg.aliases.some((alias) => alias.toLowerCase() === title.trim().toLowerCase())
        );
        if (!exists) {
          sheetsToCreate.push({ title: cfg.defaultName, headers: cfg.headers });
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
          const title = sheet.properties.title.trim();
          const sheetId = sheet.properties.sheetId;
          const matchedCfg = allConfigs.find((c) =>
            c.aliases.some((alias) => alias.toLowerCase() === title.toLowerCase())
          );

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
      const masterDb = await sheets.spreadsheets.values.get({ spreadsheetId, range: resolveRange(sheetMap, 'MASTER', 'A:A') });
      if ((masterDb.data.values || []).length <= 1) {
        await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: resolveRange(sheetMap, 'MASTER', 'A:M'),
          valueInputOption: 'USER_ENTERED',
          insertDataOption: 'INSERT_ROWS',
          requestBody: { values: [["Aleksei Z", "", "", "", "admin@villaturaman.com", "admin", "admin123", "Главный", "Да", "Да", "Да", "Да", "Да"]] }
        });
      }

      // Добавление базовых настроек календаря по умолчанию (15000 RUB)
      const calDb = await sheets.spreadsheets.values.get({ spreadsheetId, range: resolveRange(sheetMap, 'CALENDAR', 'A:A') });
      if ((calDb.data.values || []).length <= 1) {
        const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
        const defaultRules = {
          basePrice: 15000,
          currency: 'RUB',
          minNights: 3,
          maxNights: 30,
          bookingWindowMonths: 18,
          advanceNoticeDays: 2,
          bookingMode: 'instant',
          checkInTime: '16:00',
          checkOutTime: '10:00'
        };
        await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: resolveRange(sheetMap, 'CALENDAR', 'A:G'),
          valueInputOption: 'USER_ENTERED',
          insertDataOption: 'INSERT_ROWS',
          requestBody: { values: [["Глобальные правила", "Все даты", "Настройки", JSON.stringify(defaultRules), "Базовые тарифы по умолчанию", "Admin", timestamp]] }
        });
      }

      // Добавление словаря переменных по умолчанию
      const varsDb = await sheets.spreadsheets.values.get({ spreadsheetId, range: resolveRange(sheetMap, 'VARIABLES', 'A:A') });
      if ((varsDb.data.values || []).length <= 1) {
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: resolveRange(sheetMap, 'VARIABLES', 'A2:D8'),
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [
              ["[FIRST_NAME]", "name", "Имя гостя", "Иван"],
              ["[CHECKIN_DATE]", "checkIn", "Дата заезда", "01.05.2027"],
              ["[CHECKOUT_DATE]", "checkOut", "Дата выезда", "10.05.2027"],
              ["[CHECKIN_TIME]", "checkInTime", "Стандартное время заезда", "16:00"],
              ["[CHECKOUT_TIME]", "checkOutTime", "Стандартное время выезда", "10:00"],
              ["[GUESTS]", "total_guests", "Общее количество гостей", "4"],
              ["[PRICE]", "totalPrice", "Итоговая стоимость", "1500 USD"]
            ]
          }
        });
      }

      // Базовые тексты главной страницы
      const homeDb = await sheets.spreadsheets.values.get({ spreadsheetId, range: resolveRange(sheetMap, 'HOME', 'A:A') });
      if ((homeDb.data.values || []).length <= 1) {
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: resolveRange(sheetMap, 'HOME', 'A2:E6'),
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
      const templatesDb = await sheets.spreadsheets.values.get({ spreadsheetId, range: resolveRange(sheetMap, 'TEMPLATES', 'A:A') });
      if ((templatesDb.data.values || []).length <= 1) {
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: resolveRange(sheetMap, 'TEMPLATES', 'A2:B3'),
          valueInputOption: 'USER_ENTERED',
          requestBody: { values: [["welcome", "Приветствие"], ["confirmation", "Подтверждение"]] }
        });
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: resolveRange(sheetMap, 'TEMPLATES', 'E2:E3'),
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [
              ["Здравствуйте, [FIRST_NAME]! Добро пожаловать. Я владелец Виллы Тураман."],
              ["Ваша заявка на бронирование [CHECKIN_DATE] — [CHECKOUT_DATE] принята."]
            ]
          }
        });
      }
      await safeCacheSet('system_sheets_initialized_v2', true, { ex: 86400 * 30 });
    } catch (e) {
      if (e?.code === 429 || e?.message?.includes('Quota exceeded')) {
        console.warn('[ensureSystemSheets 429]: Превышена квота записи Google Sheets API, отложено.');
      } else {
        console.warn('[ensureSystemSheets Error]:', e.message);
      }
    }
  };

  // --- API: Получение публичных данных (услуги, курсы, галерея) ---
  if (action === 'get_public_data') {
    try {
      if (!sheets || !spreadsheetId) {
        return res.status(200).json({ success: true, products: [], courses: [], gallery: [] });
      }

      const productsSheet = await sheets.spreadsheets.values.get({ spreadsheetId, range: resolveRange(sheetMap, 'SERVICES', 'A:Q') });
      const coursesSheet = await sheets.spreadsheets.values.get({ spreadsheetId, range: resolveRange(sheetMap, 'GUIDES', 'A:Q') });
      const gallerySheet = await sheets.spreadsheets.values.get({ spreadsheetId, range: resolveRange(sheetMap, 'GALLERY', 'A:L') });

      const cleanField = (val) => {
        if (!val || typeof val !== 'string') return '';
        const trimmed = val.trim();
        if (trimmed.startsWith('#') || trimmed.toUpperCase() === 'ERROR') return '';
        return trimmed;
      };

      const products = (productsSheet.data.values || []).slice(1).map((r) => {
        const ruName = cleanField(r[1]);
        const enName = cleanField(r[3]);
        const trName = cleanField(r[5]);
        const ruDesc = cleanField(r[2]);
        const enDesc = cleanField(r[4]);
        const trDesc = cleanField(r[6]);
        const ruDetailed = cleanField(r[14]);
        const enDetailed = cleanField(r[15]);
        const trDetailed = cleanField(r[16]);

        return {
          id: r[0],
          name: { ru: ruName, en: enName, tr: trName },
          desc: { ru: ruDesc, en: enDesc, tr: trDesc },
          price: { eur: r[7], rub: r[8], try: r[9] },
          images: (r[10] || '').split(',').map((s) => s.trim()).filter(Boolean),
          videos: (r[13] || '').split(',').map((s) => s.trim()).filter(Boolean),
          detailedDesc: { ru: ruDetailed, en: enDetailed, tr: trDetailed },
          type: {
            ru: r[12] === 'Пакет' ? 'Пакет услуг' : 'Услуга',
            en: r[12] === 'Пакет' ? 'Service Package' : 'Service',
            tr: r[12] === 'Пакет' ? 'Hizmet Paketi' : 'Hizmet'
          }
        };
      }).filter((p) => p.id && (p.name?.ru || p.name?.en || p.name?.tr));

      const courses = (coursesSheet.data.values || []).slice(1).map((r) => {
        const ruName = cleanField(r[1]);
        const enName = cleanField(r[3]);
        const trName = cleanField(r[5]);
        const ruDesc = cleanField(r[2]);
        const enDesc = cleanField(r[4]);
        const trDesc = cleanField(r[6]);
        const ruDetailed = cleanField(r[14]);
        const enDetailed = cleanField(r[15]);
        const trDetailed = cleanField(r[16]);

        return {
          id: r[0],
          name: { ru: ruName, en: enName, tr: trName },
          desc: { ru: ruDesc, en: enDesc, tr: trDesc },
          images: (r[7] || '').split(',').map((s) => s.trim()).filter(Boolean),
          module: r[8] || 'Путеводитель',
          privateLink: r[9],
          price: { eur: r[10], rub: r[11], try: r[12] },
          videos: (r[13] || '').split(',').map((s) => s.trim()).filter(Boolean),
          detailedDesc: { ru: ruDetailed, en: enDetailed, tr: trDetailed },
          level: 'Для гостей'
        };
      }).filter((c) => c.id && (c.name?.ru || c.name?.en || c.name?.tr));

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

      if (!sheets || !spreadsheetId) {
        return res.status(200).json({
          success: true,
          globalRules: { basePrice: 15000, currency: 'RUB', minNights: 3, maxNights: 30, bookingWindowMonths: 18, advanceNoticeDays: 2, bookingMode: 'instant', verificationMode: 'progressive', checkInTime: '16:00', checkOutTime: '10:00' },
          dateRules: []
        });
      }

      const db = await sheets.spreadsheets.values.get({ spreadsheetId, range: resolveRange(sheetMap, 'CALENDAR', 'A:G') });
      const rows = db.data.values || [];
      let globalRules = null;
      let dateRules = [];

      for (let i = rows.length - 1; i >= 0; i--) {
        const row = rows[i];
        if (row[2] === 'Настройки' && !globalRules) {
          try {
            globalRules = JSON.parse(row[3]);
            if (!globalRules.verificationMode) globalRules.verificationMode = 'progressive';
          } catch (e) { }
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
        const varsDb = await sheets.spreadsheets.values.get({ spreadsheetId, range: resolveRange(sheetMap, 'VARIABLES', 'A:B') });
        (varsDb.data.values || []).slice(1).forEach((row) => {
          if (row[0] && row[1]) variablesDict[row[1]] = row[0];
        });
      } catch (e) { }

      const result = {
        success: true,
        globalRules: globalRules || { basePrice: 15000, currency: 'RUB', minNights: 3, maxNights: 30, bookingWindowMonths: 18, advanceNoticeDays: 2, bookingMode: 'instant', verificationMode: 'progressive', checkInTime: '16:00', checkOutTime: '10:00' },
        dateRules,
        variablesDict
      };
      await safeCacheSet('settings_cache', result, { ex: 1800 });
      return res.status(200).json(result);
    } catch (e) {
      return res.status(200).json({ success: true, globalRules: { basePrice: 15000, currency: 'RUB', minNights: 3, maxNights: 30, bookingWindowMonths: 18, advanceNoticeDays: 2, bookingMode: 'instant', verificationMode: 'progressive', checkInTime: '16:00', checkOutTime: '10:00' }, dateRules: [] });
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
          const masterDb = await sheets.spreadsheets.values.get({ spreadsheetId, range: resolveRange(sheetMap, 'MASTER', 'A:M') });
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
          const accDb = await sheets.spreadsheets.values.get({ spreadsheetId, range: resolveRange(sheetMap, 'ACCOUNTS', 'A:G') });
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
          range: resolveRange(sheetMap, 'ACCOUNTS', 'A:G'),
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

  // --- API: Отправка проверочного кода (Email или Телефон) ---
  if (action === 'send_verification_code') {
    try {
      const channel = data.channel || 'email';
      const target = (data.target || '').toString().trim();
      const guestName = (data.name || 'Гость').toString().trim();

      if (!target) {
        return res.status(400).json({ success: false, error: 'Не указан адрес или номер для отправки кода.' });
      }

      const cleanTarget = channel === 'email' ? target.toLowerCase() : target.replace(/\D/g, '');
      const otpCode = generateOtpCode();
      const cacheKey = `otp_${channel}_${cleanTarget}`;

      // Сохраняем код в кэше с TTL 10 минут и счетчиком попыток
      await safeCacheSet(cacheKey, { code: otpCode, attempts: 0, createdAt: Date.now() }, { ex: 600 });

      let sendResult = null;
      if (channel === 'email') {
        sendResult = await sendEmailVerificationCode({ to: target, code: otpCode, name: guestName });
      } else {
        sendResult = await sendPhoneVerificationCode({ phone: target, code: otpCode, name: guestName });
      }

      return res.status(200).json({
        success: true,
        message: sendResult?.message || `Проверочный код успешно отправлен на ${target}`,
        isDevMode: sendResult?.isDevMode || false,
        devCode: sendResult?.isDevMode ? otpCode : undefined,
        provider: sendResult?.provider || 'default',
        emailSent: sendResult?.emailSent || false,
        telegramSent: sendResult?.telegramSent || false
      });
    } catch (e) {
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  // --- API: Валидация проверочного кода (Email или Телефон) ---
  if (action === 'verify_code') {
    try {
      const channel = data.channel || 'email';
      const target = (data.target || '').toString().trim();
      const code = (data.code || '').toString().trim();

      if (!target || !code) {
        return res.status(400).json({ success: false, error: 'Укажите контакт и проверочный код.' });
      }

      const cleanTarget = channel === 'email' ? target.toLowerCase() : target.replace(/\D/g, '');
      const cacheKey = `otp_${channel}_${cleanTarget}`;
      const cached = await safeCacheGet(cacheKey);

      if (!cached || !cached.code) {
        return res.status(400).json({
          success: false,
          error: 'Срок действия проверочного кода истек. Запросите новый код.'
        });
      }

      const attempts = (cached.attempts || 0) + 1;
      if (attempts > 3) {
        await safeCacheDel(cacheKey);
        return res.status(400).json({
          success: false,
          error: 'Превышен лимит попыток. Запросите новый код.'
        });
      }

      if (cached.code.trim() !== code) {
        await safeCacheSet(cacheKey, { ...cached, attempts }, { ex: 600 });
        const remaining = 3 - attempts;
        return res.status(400).json({
          success: false,
          error: `Неверный код. Осталось попыток: ${remaining}`
        });
      }

      // Код верный: отмечаем контакт подтвержденным на 30 дней и удаляем OTP
      await safeCacheSet(`verified_${channel}_${cleanTarget}`, true, { ex: 86400 * 30 });
      await safeCacheDel(cacheKey);

      return res.status(200).json({
        success: true,
        message: 'Контакт успешно подтвержден!'
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
      const safeContact = (data.contact || '').toString().trim().toLowerCase();

      // Гарантированное создание индивидуального листа диалога при его отсутствии
      const ensureChatSheetExists = async (sheetTitle) => {
        if (!sheets || !targetChatId) return;
        try {
          const meta = await sheets.spreadsheets.get({ spreadsheetId: targetChatId });
          const exists = (meta.data.sheets || []).some((s) => s.properties.title === sheetTitle);
          if (!exists) {
            await sheets.spreadsheets.batchUpdate({
              spreadsheetId: targetChatId,
              requestBody: {
                requests: [
                  {
                    addSheet: {
                      properties: {
                        title: sheetTitle,
                        gridProperties: { frozenRowCount: 1 }
                      }
                    }
                  }
                ]
              }
            });
            await sheets.spreadsheets.values.update({
              spreadsheetId: targetChatId,
              range: `'${sheetTitle}'!A1:G1`,
              valueInputOption: 'USER_ENTERED',
              requestBody: {
                values: [GOOGLE_CONFIG.chatHeaders]
              }
            });
          }
        } catch (err) {
          console.warn('[ensureChatSheetExists Warning]:', err.message);
        }
      };

      // Запись нового сообщения
      if (data.message || data.fileBase64 || data.fileName) {
        const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
        const msgText = data.message || '';

        // Канонические формулы перевода со СТРОГОЙ ТОЧКОЙ С ЗАПЯТОЙ (;) для русской локали Google Таблиц
        const fRU = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "ru")';
        const fEN = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "en")';
        const fTR = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "tr")';

        if (sheets && targetChatId) {
          try {
            await ensureChatSheetExists(chatSheetName);
            await sheets.spreadsheets.values.append({
              spreadsheetId: targetChatId,
              range: `'${chatSheetName}'!A:G`,
              valueInputOption: 'USER_ENTERED',
              insertDataOption: 'INSERT_ROWS',
              requestBody: { values: [[timestamp, data.sender || 'Гость', msgText, fRU, fEN, fTR, data.fileName || '']] }
            });
          } catch (e) {
            console.warn('[Chat Append Error]:', e.message);
          }
        }

        // Сохраняем в кэш в памяти для непрерывности работы
        const cacheKey = `chat_msgs_${safeContact}`;
        const existingCache = (await safeCacheGet(cacheKey)) || [];
        existingCache.push({
          date: timestamp,
          sender: data.sender || 'Гость',
          original: msgText,
          ru: msgText,
          en: msgText,
          tr: msgText,
          file: data.fileName || ''
        });
        await safeCacheSet(cacheKey, existingCache, { ex: 86400 * 7 });

        // Мгновенное Telegram-уведомление хозяину о новом сообщении гостя
        if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
          const fileNote = data.fileName ? `\n📎 Вложение: ${data.fileName}` : '';
          const tgMsg = `💬 НОВОЕ СООБЩЕНИЕ ХОЗЯИНУ\n👤 От: ${data.sender || 'Гость'}\n📞 Контакт: ${data.contact || 'Не указан'}\n📝 Текст: ${msgText}${fileNote}`;
          fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text: tgMsg })
          }).catch(() => { });
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

      // Если Google Sheets не вернул сообщений (демо-режим или задержка), подтягиваем из кэша
      if (messages.length === 0) {
        const cached = await safeCacheGet(`chat_msgs_${safeContact}`);
        if (cached && Array.isArray(cached)) {
          messages = cached;
        }
      }

      // Получение активных заявок гостя
      let activeRequests = [];
      if (sheets && spreadsheetId) {
        try {
          const bookingDb = await sheets.spreadsheets.values.get({ spreadsheetId, range: resolveRange(sheetMap, 'BOOKINGS', 'A:K') });
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
          }).filter((r) => (r.contact || '').toLowerCase() === safeContact);
        } catch (e) { }
      }

      return res.status(200).json({ success: true, messages, activeRequests });
    } catch (e) {
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  // --- API: Прямое обращение гостя к хозяину до регистрации ---
  if (action === 'contact_host') {
    try {
      await ensureSystemSheets();
      const targetChatId = getChatSpreadsheetId();
      const safeContact = (data.contact || '').toString().trim().toLowerCase();
      const safeName = (data.name || data.sender || 'Гость').toString().trim();
      const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
      const msgText = data.message || '';

      // 1. Авто-регистрация гостя в листе ACCOUNTS (если еще не зарегистрирован)
      if (sheets && spreadsheetId && safeContact) {
        try {
          const existingData = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: resolveRange(sheetMap, 'ACCOUNTS', 'C:C')
          });
          const logins = existingData.data.values
            ? existingData.data.values.flat().map((v) => (v || '').toString().trim().toLowerCase())
            : [];
          if (!logins.includes(safeContact)) {
            await sheets.spreadsheets.values.append({
              spreadsheetId,
              range: resolveRange(sheetMap, 'ACCOUNTS', 'A:G'),
              valueInputOption: 'USER_ENTERED',
              insertDataOption: 'INSERT_ROWS',
              requestBody: {
                values: [[timestamp, safeName, safeContact, '123456', 'Нет', 'Нет', 'Нет']]
              }
            });
          }
        } catch (regErr) {
          console.warn('[contact_host auto-register warning]:', regErr.message);
        }
      }

      const isEmailFormat = safeContact.includes('@');
      const userObj = {
        name: safeName,
        contact: safeContact,
        email: isEmailFormat ? safeContact : '',
        phone: !isEmailFormat ? safeContact : '',
        emailVerified: false,
        phoneVerified: false,
        isHost: false,
        blockChat: false,
        hasChat: true
      };

      // 2. Гарантированное создание индивидуального листа диалога
      const chatSheetName = getChatSheetName(safeName, safeContact);
      if (sheets && targetChatId) {
        try {
          const meta = await sheets.spreadsheets.get({ spreadsheetId: targetChatId });
          const exists = (meta.data.sheets || []).some((s) => s.properties.title === chatSheetName);
          if (!exists) {
            await sheets.spreadsheets.batchUpdate({
              spreadsheetId: targetChatId,
              requestBody: {
                requests: [
                  {
                    addSheet: {
                      properties: {
                        title: chatSheetName,
                        gridProperties: { frozenRowCount: 1 }
                      }
                    }
                  }
                ]
              }
            });
            await sheets.spreadsheets.values.update({
              spreadsheetId: targetChatId,
              range: `'${chatSheetName}'!A1:G1`,
              valueInputOption: 'USER_ENTERED',
              requestBody: {
                values: [GOOGLE_CONFIG.chatHeaders]
              }
            });
          }

          // Запись первого сообщения
          const fRU = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "ru")';
          const fEN = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "en")';
          const fTR = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "tr")';

          await sheets.spreadsheets.values.append({
            spreadsheetId: targetChatId,
            range: `'${chatSheetName}'!A:G`,
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            requestBody: { values: [[timestamp, safeName, msgText, fRU, fEN, fTR, data.fileName || '']] }
          });
        } catch (sheetErr) {
          console.warn('[contact_host sheet error]:', sheetErr.message);
        }
      }

      // Кэширование сообщения в памяти
      const cacheKey = `chat_msgs_${safeContact}`;
      const msgItem = {
        date: timestamp,
        sender: safeName,
        original: msgText,
        ru: msgText,
        en: msgText,
        tr: msgText,
        file: data.fileName || ''
      };
      await safeCacheSet(cacheKey, [msgItem], { ex: 86400 * 7 });

      // 3. Мгновенное Telegram-уведомление хозяину
      if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
        const fileNote = data.fileName ? `\n📎 Вложение: ${data.fileName}` : '';
        const tgMsg = `💬 НОВОЕ СООБЩЕНИЕ ХОЗЯИНУ (Прямое обращение)\n👤 Гость: ${safeName}\n📞 Контакт: ${safeContact}\n📝 Текст: ${msgText}${fileNote}`;
        fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text: tgMsg })
        }).catch(() => { });
      }

      return res.status(200).json({
        success: true,
        user: userObj,
        message: 'Сообщение успешно доставлено владельцу виллы!'
      });
    } catch (e) {
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  // --- API: Мгновенная авто-регистрация гостя ---
  if (action === 'auto_register_guest') {
    try {
      await ensureSystemSheets();
      const safeEmail = (data.email || '').toString().trim();
      const safePhone = (data.phone || '').toString().trim();
      const safeContact = (data.contact || (safePhone && safeEmail ? `${safePhone} | ${safeEmail}` : (safePhone || safeEmail || ''))).toString().trim();
      const safeName = (data.name || 'Гость').toString().trim();
      const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });

      if (sheets && spreadsheetId && safeContact) {
        try {
          const existingData = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: resolveRange(sheetMap, 'ACCOUNTS', 'C:C')
          });
          const logins = existingData.data.values
            ? existingData.data.values.flat().map((v) => (v || '').toString().trim().toLowerCase())
            : [];
          const checkKey = safeEmail ? safeEmail.toLowerCase() : safeContact.toLowerCase();
          if (!logins.includes(checkKey) && !logins.includes(safeContact.toLowerCase())) {
            await sheets.spreadsheets.values.append({
              spreadsheetId,
              range: resolveRange(sheetMap, 'ACCOUNTS', 'A:G'),
              valueInputOption: 'USER_ENTERED',
              insertDataOption: 'INSERT_ROWS',
              requestBody: {
                values: [[timestamp, safeName, safeContact, '123456', 'Нет', 'Нет', 'Нет']]
              }
            });
          }
        } catch (regErr) {
          console.warn('[auto_register_guest warning]:', regErr.message);
        }
      }

      return res.status(200).json({
        success: true,
        user: {
          name: safeName,
          contact: safeContact,
          email: safeEmail,
          phone: safePhone,
          emailVerified: !!data.emailVerified,
          phoneVerified: !!data.phoneVerified,
          isHost: false,
          blockChat: false,
          hasChat: true
        }
      });
    } catch (e) {
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  // --- API: Получение всех чатов для панели хозяина ---
  if (action === 'master_get_chats') {
    try {
      const targetChatId = getChatSpreadsheetId();
      let allChats = [];

      if (sheets && targetChatId) {
        try {
          const chatMetadata = await sheets.spreadsheets.get({ spreadsheetId: targetChatId });
          const chatSheets = (chatMetadata.data.sheets || []).filter((s) => s.properties.title.startsWith('Chat_'));

          // Получение всех бронирований
          const bookingDb = await sheets.spreadsheets.values.get({ spreadsheetId, range: resolveRange(sheetMap, 'BOOKINGS', 'A:K') });
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

      return res.status(200).json({ success: true, chats: allChats, allRequests: allReqs });
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
        // Обновляем статус в листе бронирований
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: resolveRange(sheetMap, 'BOOKINGS', `K${data.rowIndex + 1}`),
          valueInputOption: 'USER_ENTERED',
          requestBody: { values: [[statusStr]] }
        });

        const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
        // Устанавливаем блокировку HOLD в календаре
        const holdRow = [data.checkIn, data.checkOut, "Блокировка", `HOLD | ${data.contact} | ${expiresAt}`, "Одобрено (Ожидает оплаты)", "Система", timestamp];
        await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: resolveRange(sheetMap, 'CALENDAR', 'A:G'),
          valueInputOption: 'USER_ENTERED',
          insertDataOption: 'INSERT_ROWS',
          requestBody: { values: [holdRow] }
        });

        // Отправка системного сообщения гостю
        const targetChatId = getChatSpreadsheetId();
        const fRU = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "ru")';
        const fEN = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "en")';
        const fTR = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "tr")';
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
      const range = resolveRange(sheetMap, 'BOOKINGS', `D${data.rowIndex + 1}:K${data.rowIndex + 1}`);

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
          range: resolveRange(sheetMap, 'CALENDAR', 'A:G'),
          valueInputOption: 'USER_ENTERED',
          insertDataOption: 'INSERT_ROWS',
          requestBody: { values: [ruleRow] }
        });

        const msg = `🎁 Для вас сформировано специальное предложение!\nДаты проживания: ${data.checkIn} — ${data.checkOut}\nОбновленная стоимость: ${data.price}\nПожалуйста, перейдите к оплате в карточке бронирования. Окно оплаты открыто до: ${deadlineStr}.`;
        const fRU = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "ru")';
        const fEN = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "en")';
        const fTR = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "tr")';

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
        const range = resolveRange(sheetMap, 'BOOKINGS', `K${data.rowIndex + 1}`);
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
          range: resolveRange(sheetMap, 'CALENDAR', 'A:G'),
          valueInputOption: 'USER_ENTERED',
          insertDataOption: 'INSERT_ROWS',
          requestBody: { values: [ruleRow] }
        });

        const msg = `❌ Сообщаю, что предложение на бронирование с ${data.checkIn} по ${data.checkOut} было отозвано администрацией.`;
        const fRU = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "ru")';
        const fEN = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "en")';
        const fTR = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "tr")';

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
        const range = resolveRange(sheetMap, 'BOOKINGS', `K${data.rowIndex + 1}`);
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range,
          valueInputOption: 'USER_ENTERED',
          requestBody: { values: [["ОТКЛОНЕНО"]] }
        });

        const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
        const msg = `❌ К сожалению, ваша заявка на даты ${data.checkIn} — ${data.checkOut} была отклонена. Пожалуйста, выберите другие доступные даты в календаре.`;
        const fRU = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "ru")';
        const fEN = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "en")';
        const fTR = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "tr")';

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
      if (!sheets || !spreadsheetId) return res.status(200).json({ success: true, lms: [] });

      const coursesSheet = await sheets.spreadsheets.values.get({ spreadsheetId, range: resolveRange(sheetMap, 'GUIDES', 'A:Q') });
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
          range: resolveRange(sheetMap, 'CALENDAR', 'A:G'),
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
      await ensureSystemSheets();
      if (sheets && spreadsheetId && data.rules) {
        const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
        await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: resolveRange(sheetMap, 'CALENDAR', 'A:G'),
          valueInputOption: 'USER_ENTERED',
          insertDataOption: 'INSERT_ROWS',
          requestBody: { values: [["Глобальные правила", "Все даты", "Настройки", JSON.stringify(data.rules), "Изменение тарифов", data.sender || 'Admin', timestamp]] }
        });
        await safeCacheDel('settings_cache');
      }
      return res.status(200).json({ success: true });
    } catch (e) {
      console.error('[master_save_global_rules Error]:', e);
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  // --- API: Отправка сообщений хозяином ---
  if (action === 'master_send_chats') {
    try {
      const targetChatId = getChatSpreadsheetId();
      const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
      const fRU = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "ru")';
      const fEN = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "en")';
      const fTR = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "tr")';

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
      const safeEmail = (data.email || '').toString().trim();
      const safePhone = (data.phone || '').toString().trim();
      const effectiveContact = (data.contact || (safePhone && safeEmail ? `${safePhone} | ${safeEmail}` : (safePhone || safeEmail || ''))).toString().trim();
      const guestName = (data.name || 'Гость').toString().trim();

      // Обязательная проверка заполненности и валидности контактов
      if (!safeEmail || !/\S+@\S+\.\S+/.test(safeEmail)) {
        return res.status(400).json({ success: false, error: 'Укажите корректный адрес электронной почты для бронирования.' });
      }
      if (!safePhone || safePhone.replace(/\D/g, '').length < 6) {
        return res.status(400).json({ success: false, error: 'Укажите действующий номер телефона для бронирования.' });
      }

      // Серверная проверка верификации Email через сессию или кэш проверок
      const isEmailVerified = Boolean(data.emailVerified) || Boolean(await safeCacheGet(`verified_email_${safeEmail.toLowerCase()}`));
      if (!isEmailVerified) {
        return res.status(400).json({
          success: false,
          error: 'Адрес электронной почты не подтвержден. Пожалуйста, подтвердите email кодом из письма.'
        });
      }

      // Telegram-уведомление хозяину о новой заявке со статусами проверки
      if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
        const emailStatus = data.emailVerified ? '✅ Подтвержден' : '⏳ Не подтвержден';
        const phoneStatus = data.phoneVerified ? '✅ Подтвержден' : '⏳ Не подтвержден';
        const tgMsg = `⚠️ НОВАЯ ЗАЯВКА (Модерация)\n👤 Гость: ${guestName}\n📧 Email: ${safeEmail || '—'} (${emailStatus})\n📞 Телефон: ${safePhone || effectiveContact || '—'} (${phoneStatus})\n📅 Период: ${data.checkIn} — ${data.checkOut}\n👥 Гостей: ${data.total_guests}\n💰 Стоимость: ${data.totalPrice}`;
        await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text: tgMsg })
        }).catch(() => { });
      }

      let userObj = {
        name: guestName,
        contact: effectiveContact,
        email: safeEmail,
        phone: safePhone,
        emailVerified: !!data.emailVerified,
        phoneVerified: !!data.phoneVerified,
        isHost: false,
        blockChat: false,
        hasChat: true
      };

      // Авто-регистрация незарегистрированного гостя в таблице аккаунтов
      if (!data.isRegistered && sheets && spreadsheetId && effectiveContact) {
        const safeContactKey = effectiveContact.toLowerCase();
        try {
          const existingData = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: resolveRange(sheetMap, 'ACCOUNTS', 'C:C')
          });
          const logins = existingData.data.values
            ? existingData.data.values.flat().map((v) => (v || '').toString().trim().toLowerCase())
            : [];
          const checkKey = safeEmail ? safeEmail.toLowerCase() : safeContactKey;
          if (!logins.includes(checkKey) && !logins.includes(safeContactKey)) {
            await sheets.spreadsheets.values.append({
              spreadsheetId,
              range: resolveRange(sheetMap, 'ACCOUNTS', 'A:G'),
              valueInputOption: 'USER_ENTERED',
              insertDataOption: 'INSERT_ROWS',
              requestBody: {
                values: [[timestamp, guestName, effectiveContact, '123456', 'Нет', 'Нет', 'Нет']]
              }
            });
          }
        } catch (regErr) { /* продолжаем даже если аккаунт не создан */ }
      }

      if (sheets && spreadsheetId) {
        // Запись заявки в лист бронирований (11 колонок A:K)
        await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: resolveRange(sheetMap, 'BOOKINGS', 'A:K'),
          valueInputOption: 'USER_ENTERED',
          insertDataOption: 'INSERT_ROWS',
          requestBody: {
            values: [[
              timestamp,
              guestName,
              effectiveContact,
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
        const chatSheetName = getChatSheetName(guestName, effectiveContact);

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

          // Системное сообщение с деталями заявки (канонические формулы с точкой с запятой)
          const miniCard = `📋 Заявка отправлена на модерацию.\nДетали: ${data.checkIn} — ${data.checkOut}\nГостей: ${data.total_guests}\nСтоимость: ${data.totalPrice}\n\nОжидайте подтверждения от владельца.`;
          const fRU = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "ru")';
          const fEN = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "en")';
          const fTR = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "tr")';

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
      const safeEmail = (data.email || '').toString().trim();
      const safePhone = (data.phone || '').toString().trim();
      const effectiveContact = (data.contact || (safePhone && safeEmail ? `${safePhone} | ${safeEmail}` : (safePhone || safeEmail || ''))).toString().trim();
      const guestName = (data.name || 'Гость').toString().trim();

      // Обязательная проверка заполненности и валидности контактов
      if (!safeEmail || !/\S+@\S+\.\S+/.test(safeEmail)) {
        return res.status(400).json({ success: false, error: 'Укажите корректный адрес электронной почты для бронирования.' });
      }
      if (!safePhone || safePhone.replace(/\D/g, '').length < 6) {
        return res.status(400).json({ success: false, error: 'Укажите действующий номер телефона для бронирования.' });
      }

      // Серверная проверка верификации Email через сессию или кэш проверок
      const isEmailVerified = Boolean(data.emailVerified) || Boolean(await safeCacheGet(`verified_email_${safeEmail.toLowerCase()}`));
      if (!isEmailVerified) {
        return res.status(400).json({
          success: false,
          error: 'Адрес электронной почты не подтвержден. Пожалуйста, подтвердите email кодом из письма.'
        });
      }

      if (sheets && spreadsheetId) {
        await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: resolveRange(sheetMap, 'BOOKINGS', 'A:K'),
          valueInputOption: 'USER_ENTERED',
          insertDataOption: 'INSERT_ROWS',
          requestBody: {
            values: [[
              timestamp,
              guestName,
              effectiveContact,
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
        if (effectiveContact) {
          const targetChatId = getChatSpreadsheetId();
          const chatSheetName = getChatSheetName(guestName, effectiveContact);
          try {
            const chatDbMeta = await sheets.spreadsheets.get({ spreadsheetId: targetChatId });
            if (!chatDbMeta.data.sheets.find(s => s.properties.title === chatSheetName)) {
              await sheets.spreadsheets.batchUpdate({
                spreadsheetId: targetChatId,
                requestBody: { requests: [{ addSheet: { properties: { title: chatSheetName } } }] }
              });
            }
            const miniCard = `✅ Заказ успешно оформлен!\nДетали: ${data.checkIn} — ${data.checkOut}\nГостей: ${data.total_guests}\nСумма: ${data.totalPrice}`;
            const fRU = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "ru")';
            const fEN = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "en")';
            const fTR = '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "tr")';
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


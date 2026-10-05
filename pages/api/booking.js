import { google } from 'googleapis'; // Подключение Google API
import { createClient } from '@vercel/kv'; // Подключение Vercel KV для кэширования

let memoryCache = {}; // Резервный кэш в оперативной памяти на случай сбоя Redis

// Инициализация KV клиента
const getKV = () => {
   if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      try { 
         return createClient({ 
            url: process.env.KV_REST_API_URL, 
            token: process.env.KV_REST_API_TOKEN 
         }); 
      } catch(e) { 
         return null; 
      }
   } 
   return null;
}
const kv = getKV();

// Безопасное получение данных из кэша
const safeCacheGet = async (key) => {
    if (kv) { 
       try { 
          return await kv.get(key); 
       } catch(e) { 
          return memoryCache[key]; 
       } 
    }
    return memoryCache[key];
};

// Безопасная запись данных в кэш
const safeCacheSet = async (key, val, opts) => {
    if (kv) { 
       try { 
          await kv.set(key, val, opts); 
       } catch(e) { 
          memoryCache[key] = val; 
       } 
    } else { 
       memoryCache[key] = val; 
    }
};

// Безопасное удаление данных из кэша
const safeCacheDel = async (key) => {
    if (kv) { 
       try { 
          await kv.del(key); 
       } catch(e) { 
          delete memoryCache[key]; 
       } 
    } else { 
       delete memoryCache[key]; 
    }
};

// Блок конфигурации системы Google Sheets
const GOOGLE_CONFIG = {
  parentFolderId: "11xBSWA02NypliPFbziRSMfC9aAPclYF_", // ID родительской папки на Google Drive
  spreadsheetName: "VillaTuramanWebSitePlatform_DB", // Имя основного файла БД
  sheetName: "Вилла", // Лист бронирований
  homePageSheetName: "HomePage", // Лист контента главной страницы
  accountSheetName: "Accounts", // Лист гостевых аккаунтов
  masterSheetName: "MasterAccount", // Лист аккаунтов владельцев
  calendarSettingsSheetName: "CalendarSettings", // Лист настроек календаря
  productsSheetName: "ExtraServices", // Лист дополнительных услуг
  coursesSheetName: "VideoGuides", // Лист видео-путеводителей
  studentsSheetName: "GuestsAccess", // Лист доступов гостей к контенту
  ordersSheetName: "ServiceOrders", // Лист заказов
  gallerySheetName: "Gallery", // Лист медиа галереи
  aboutSheetName: "About", // Лист раздела О нас
  legalSheetName: "Legal", // Лист юридических документов
  templatesSheetName: "Templates", // Лист текстовых шаблонов
  variablesSheetName: "Variables", // Лист словаря переменных (плейсхолдеров) - Задача 4.2
  
  // Настройки заголовков колонок для каждого листа
  homeHeaders: ["Ключ (ID)", "RU", "EN", "TR", "Медиа/Картинка"],
  headers: [ "Дата заявки", "Имя клиента", "Контакт (Tel/TG)", "Старт", "Завершение", "Ночей", "Взрослых", "Детей", "Всего гостей", "Итоговая стоимость", "Статус оплаты" ],
  accountHeaders: ["Дата регистрации", "Имя", "Контакт (Логин)", "Пароль", "Блок: Сайт", "Блок: Аккаунт", "Блок: Чат"],
  masterHeaders: ["ФИО", "Телефон", "Telegram", "WhatsApp", "Google Email", "Логин", "Пароль", "Роль", "Прав: Финансы", "Прав: Периоды", "Прав: Блок. дат", "Прав: Окно брони", "Прав: Доступ к чатам"],
  calendarSettingsHeaders: ["Дата старта", "Дата завершения", "Тип (Блокировка/Цена/Мин. дней/Заметка/Тип записи/Настройки)", "Значение", "Заметка", "Автор изменения", "Время фиксации"],
  chatHeaders: ["Дата и Время", "Отправитель", "Оригинал", "RU", "EN", "TR", "Ссылка на вложение"],
  productsHeaders: ["ID", "Название услуги (RU)", "Описание (RU)", "Название услуги (EN)", "Описание (EN)", "Название услуги (TR)", "Описание (TR)", "Цена (EUR)", "Цена (RUB)", "Цена (TRY)", "Изображения (через запятую)", "Наличие (Да/Нет)", "Тип (Услуга/Пакет)", "Видео презентации (через запятую)", "Подробное описание (RU)", "Подробное описание (EN)", "Подробное описание (TR)"],
  coursesHeaders: ["ID", "Название путеводителя (RU)", "Описание (RU)", "Название путеводителя (EN)", "Описание (EN)", "Название путеводителя (TR)", "Описание (TR)", "Изображения (через запятую)", "Категория", "Ссылка на видео", "Цена (EUR)", "Цена (RUB)", "Цена (TRY)", "Видео презентации (через запятую)", "Подробное описание (RU)", "Подробное описание (EN)", "Подробное описание (TR)"],
  galleryHeaders: ["ID", "Группа (RU)", "Описание группы (RU)", "Группа (EN)", "Описание группы (EN)", "Группа (TR)", "Описание группы (TR)", "Тип (Фото/Видео/Карусель)", "Медиа (ссылки/iframes через запятую)", "Подпись (RU)", "Подпись (EN)", "Подпись (TR)"],
  aboutHeaders: ["ID Раздела", "Название (RU)", "Название (EN)", "Название (TR)", "Текст (RU)", "Текст (EN)", "Текст (TR)"],
  legalHeaders: ["ID Раздела", "Название (RU)", "Название (EN)", "Название (TR)", "Текст (RU)", "Текст (EN)", "Текст (TR)"],
  templatesHeaders: ["ID Раздела", "Название (RU)", "Название (EN)", "Название (TR)", "Текст (RU)", "Текст (EN)", "Текст (TR)"],
  variablesHeaders: ["Плейсхолдер", "Системный ключ", "Описание переменной", "Значение по умолчанию (Тест)"] // Настройка словаря переменных
};

// Функция парсинга оригинального сообщения без шумов и ошибок перевода
const parseMessageRow = (r) => {
    if (!Array.isArray(r) || r.length === 0) {
        return { date: '', sender: '', original: '', ru: '', en: '', tr: '', file: '' };
    }
    
    const isOld = r.length < 4;
    const orig = r[2] || '';
    
    // Очистка автоперевода от шумов (#Loading, Загрузка и прочее)
    const cln = (v) => (!v || String(v).startsWith('#') || String(v).includes('Loading') || String(v).includes('Загрузка')) ? orig : String(v);
    
    return {
        date: r[0] || '', 
        sender: r[1] || '', 
        original: orig,
        ru: isOld ? orig : cln(r[3]), 
        en: isOld ? orig : cln(r[4]), 
        tr: isOld ? orig : cln(r[5]),
        file: r[6] || ''
    };
};

// Интеллектуальная функция автоматической замены плейсхолдеров в тексте (Задача 4.2)
const replacePlaceholders = (text, dataObj) => {
    if (!text) return "";
    let newText = String(text);
    const keys = Object.keys(dataObj);
    
    // Динамический поиск ключей в словаре и их замена в шаблонах
    keys.forEach(key => {
        const regex = new RegExp(`\\[${key}\\]`, 'g');
        newText = newText.replace(regex, dataObj[key] || '');
    });
    
    return newText;
};

// Формирование стандартизированного названия листа чата
const getChatSheetName = (name, contact) => {
    return `Chat_${(name || '').toString().replace(/[*?:\[\]\\/']/g, '').trim().substring(0, 30)}_${(contact || '').toString().replace(/[*?:\[\]\\/']/g, '').trim().substring(0, 30)}`;
};

export default async function handler(req, res) {
  // Разрешаем только POST запросы к бэкенду
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  
  const data = req.body; 
  const action = data.action || 'booking';
  
  // Ключи Telegram бота для уведомлений
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN; 
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
  
  let serviceAccountAuth, oauth2Client;
  let sheets, drive, tasksApi, calendarApi;
  let spreadsheetId; // ID основной таблицы
  let chatsSpreadsheetId = process.env.GOOGLE_CHATS_SPREADSHEET_ID; // Внешняя БД для гостевых чатов (Задача 4.5)

  try {
    // Подключение Service Account для работы с Google Sheets / Drive
    if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
      serviceAccountAuth = new google.auth.GoogleAuth({
        credentials: { 
           client_email: process.env.GOOGLE_CLIENT_EMAIL.trim(), 
           private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n').trim() 
        },
        scopes: ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/spreadsheets']
      });
      sheets = google.sheets({ version: 'v4', auth: serviceAccountAuth });
      drive = google.drive({ version: 'v3', auth: serviceAccountAuth });
    }

    // Подключение OAuth 2.0 для задач графа (Tasks) и внешнего календаря
    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN) {
      oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        'https://developers.google.com/oauthplayground'
      );
      oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
      tasksApi = google.tasks({ version: 'v1', auth: oauth2Client });
      calendarApi = google.calendar({ version: 'v3', auth: oauth2Client });
    }

    const isGraphAction = ['get_tasks_graph', 'create_task', 'update_task_status', 'delete_task'].includes(action);
    const isSheetAction = !isGraphAction || action === 'get_tasks_graph';
    
    // Получение или автоматическое создание основной БД
    if (isSheetAction && sheets) {
        const tableSearch = await drive.files.list({ 
           q: `name='${GOOGLE_CONFIG.spreadsheetName}' and '${GOOGLE_CONFIG.parentFolderId}' in parents and trashed=false`, 
           fields: 'files(id)', 
           supportsAllDrives: true, 
           includeItemsFromAllDrives: true 
        });
        
        if (tableSearch.data.files && tableSearch.data.files.length > 0) { 
            spreadsheetId = tableSearch.data.files[0].id; 
        } else { 
            const ss = await sheets.spreadsheets.create({ 
               requestBody: { 
                  properties: { title: GOOGLE_CONFIG.spreadsheetName, locale: 'ru_RU' }, 
                  sheets: [{ properties: { title: GOOGLE_CONFIG.sheetName, index: 0 } }] 
               } 
            }); 
            spreadsheetId = ss.data.spreadsheetId; 
            await drive.files.update({ 
               fileId: spreadsheetId, 
               addParents: GOOGLE_CONFIG.parentFolderId, 
               fields: 'id', 
               supportsAllDrives: true 
            }); 
        }
    } else if (isSheetAction && !sheets) {
        return res.status(500).json({ success: false, error: "Google Service Account credentials for Sheets/Drive are not configured." });
    }
  } catch (err) { 
     return res.status(500).json({ success: false, error: `System Configuration Error: ${err.message}` }); 
  }
  
  // Архитектура устранения циклической ошибки VSTACK (Задача 5.1) 
  // Вынесение формул отдельно от заголовков
  const injectSafeFormulas = async () => {
     const formulaRequests = [];
     const formulaMap = {
        'HomePage': { c: 'C2', f: '=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "ru"; "en"))))' },
        'HomePage_TR': { c: 'D2', f: '=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "ru"; "tr"))))' },
        'About': { c: 'C2', f: '=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "ru"; "en"))))' },
        'About_TR': { c: 'D2', f: '=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "ru"; "tr"))))' },
        'Templates': { c: 'C2', f: '=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "ru"; "en"))))' },
        'Templates_TR': { c: 'D2', f: '=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "ru"; "tr"))))' }
     };

     for (const [key, mapData] of Object.entries(formulaMap)) {
        const sheetName = key.split('_')[0];
        formulaRequests.push({
           range: `'${sheetName}'!${mapData.c}`,
           values: [[mapData.f]]
        });
     }
     
     for (const req of formulaRequests) {
        try {
           await sheets.spreadsheets.values.update({
              spreadsheetId,
              range: req.range,
              valueInputOption: 'USER_ENTERED',
              requestBody: { values: req.values }
           });
        } catch (e) { /* Игнорирование ошибки, если лист еще не создан */ }
     }
  };

  // Функция определения целевой БД для чатов (Задача 4.5)
  // Все гостевые чаты теперь изолированы в отдельной таблице, если указан её ID
  const getChatSpreadsheetId = () => {
      return chatsSpreadsheetId || spreadsheetId;
  };

  const ensureSystemSheets = async () => {
    const ss = await sheets.spreadsheets.get({ spreadsheetId });
    const existingTitles = ss.data.sheets.map(s => s.properties.title);
    const sheetsToCreate = [];
    
    // Проверка и создание системных листов в основной БД
    if (!existingTitles.includes(GOOGLE_CONFIG.homePageSheetName)) sheetsToCreate.push({ title: GOOGLE_CONFIG.homePageSheetName, headers: GOOGLE_CONFIG.homeHeaders });
    if (!existingTitles.includes(GOOGLE_CONFIG.masterSheetName)) sheetsToCreate.push({ title: GOOGLE_CONFIG.masterSheetName, headers: GOOGLE_CONFIG.masterHeaders });
    if (!existingTitles.includes(GOOGLE_CONFIG.calendarSettingsSheetName)) sheetsToCreate.push({ title: GOOGLE_CONFIG.calendarSettingsSheetName, headers: GOOGLE_CONFIG.calendarSettingsHeaders });
    if (!existingTitles.includes(GOOGLE_CONFIG.sheetName)) sheetsToCreate.push({ title: GOOGLE_CONFIG.sheetName, headers: GOOGLE_CONFIG.headers });
    if (!existingTitles.includes(GOOGLE_CONFIG.accountSheetName)) sheetsToCreate.push({ title: GOOGLE_CONFIG.accountSheetName, headers: GOOGLE_CONFIG.accountHeaders });
    if (!existingTitles.includes(GOOGLE_CONFIG.productsSheetName)) sheetsToCreate.push({ title: GOOGLE_CONFIG.productsSheetName, headers: GOOGLE_CONFIG.productsHeaders });
    if (!existingTitles.includes(GOOGLE_CONFIG.coursesSheetName)) sheetsToCreate.push({ title: GOOGLE_CONFIG.coursesSheetName, headers: GOOGLE_CONFIG.coursesHeaders });
    if (!existingTitles.includes(GOOGLE_CONFIG.studentsSheetName)) sheetsToCreate.push({ title: GOOGLE_CONFIG.studentsSheetName, headers: GOOGLE_CONFIG.studentsHeaders });
    if (!existingTitles.includes(GOOGLE_CONFIG.ordersSheetName)) sheetsToCreate.push({ title: GOOGLE_CONFIG.ordersSheetName, headers: GOOGLE_CONFIG.ordersHeaders });
    if (!existingTitles.includes(GOOGLE_CONFIG.gallerySheetName)) sheetsToCreate.push({ title: GOOGLE_CONFIG.gallerySheetName, headers: GOOGLE_CONFIG.galleryHeaders });
    if (!existingTitles.includes(GOOGLE_CONFIG.aboutSheetName)) sheetsToCreate.push({ title: GOOGLE_CONFIG.aboutSheetName, headers: GOOGLE_CONFIG.aboutHeaders });
    if (!existingTitles.includes(GOOGLE_CONFIG.legalSheetName)) sheetsToCreate.push({ title: GOOGLE_CONFIG.legalSheetName, headers: GOOGLE_CONFIG.legalHeaders });
    if (!existingTitles.includes(GOOGLE_CONFIG.templatesSheetName)) sheetsToCreate.push({ title: GOOGLE_CONFIG.templatesSheetName, headers: GOOGLE_CONFIG.templatesHeaders });
    
    // Интеграция листа словарей и плейсхолдеров (Задача 4.2)
    if (!existingTitles.includes(GOOGLE_CONFIG.variablesSheetName)) sheetsToCreate.push({ title: GOOGLE_CONFIG.variablesSheetName, headers: GOOGLE_CONFIG.variablesHeaders });
    
    if (sheetsToCreate.length > 0) {
      const addRequests = sheetsToCreate.map(sheetDef => ({ addSheet: { properties: { title: sheetDef.title } } }));
      await sheets.spreadsheets.batchUpdate({ spreadsheetId, requestBody: { requests: addRequests } });
      await safeCacheDel('is_sheets_formatted');
    }

    const isFormatted = await safeCacheGet('is_sheets_formatted');
    if (!isFormatted) {
      const updatedSs = await sheets.spreadsheets.get({ spreadsheetId });
      const formatRequests = [];
      
      // Настройка визуального форматирования заголовков листов
      updatedSs.data.sheets.forEach(sheet => {
          const title = sheet.properties.title;
          const sheetId = sheet.properties.sheetId;
          let headers = null;
          if (title === GOOGLE_CONFIG.homePageSheetName) headers = GOOGLE_CONFIG.homeHeaders;
          else if (title === GOOGLE_CONFIG.masterSheetName) headers = GOOGLE_CONFIG.masterHeaders;
          else if (title === GOOGLE_CONFIG.calendarSettingsSheetName) headers = GOOGLE_CONFIG.calendarSettingsHeaders;
          else if (title === GOOGLE_CONFIG.sheetName) headers = GOOGLE_CONFIG.headers;
          else if (title === GOOGLE_CONFIG.accountSheetName) headers = GOOGLE_CONFIG.accountHeaders;
          else if (title === GOOGLE_CONFIG.productsSheetName) headers = GOOGLE_CONFIG.productsHeaders;
          else if (title === GOOGLE_CONFIG.coursesSheetName) headers = GOOGLE_CONFIG.coursesHeaders;
          else if (title === GOOGLE_CONFIG.studentsSheetName) headers = GOOGLE_CONFIG.studentsHeaders;
          else if (title === GOOGLE_CONFIG.ordersSheetName) headers = GOOGLE_CONFIG.ordersHeaders;
          else if (title === GOOGLE_CONFIG.gallerySheetName) headers = GOOGLE_CONFIG.galleryHeaders;
          else if (title === GOOGLE_CONFIG.aboutSheetName) headers = GOOGLE_CONFIG.aboutHeaders;
          else if (title === GOOGLE_CONFIG.legalSheetName) headers = GOOGLE_CONFIG.legalHeaders;
          else if (title === GOOGLE_CONFIG.templatesSheetName) headers = GOOGLE_CONFIG.templatesHeaders;
          else if (title === GOOGLE_CONFIG.variablesSheetName) headers = GOOGLE_CONFIG.variablesHeaders;
          
          if (headers) {
              formatRequests.push({ 
                 updateCells: { 
                    range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: headers.length }, 
                    rows: [{ 
                       values: headers.map((h) => {
                          return { 
                             userEnteredValue: { stringValue: h }, 
                             userEnteredFormat: { 
                                backgroundColor: { red: 0.15, green: 0.20, blue: 0.28 }, 
                                textFormat: { bold: true, fontSize: 11, foregroundColor: { red: 1, green: 1, blue: 1 } }, 
                                horizontalAlignment: 'CENTER', 
                                verticalAlignment: 'MIDDLE', 
                                wrapStrategy: 'WRAP' 
                             } 
                          };
                       }) 
                    }], 
                    fields: 'userEnteredValue,userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment,wrapStrategy)' 
                 } 
              });
              // Закрепление первой строки
              formatRequests.push({ updateSheetProperties: { properties: { sheetId, gridProperties: { frozenRowCount: 1 } }, fields: 'gridProperties.frozenRowCount' } });
          }
      });
      
      if (formatRequests.length > 0) {
          await sheets.spreadsheets.batchUpdate({ spreadsheetId, requestBody: { requests: formatRequests } });
      }
      await safeCacheSet('is_sheets_formatted', true);
    }

    // Применение безопасных формул перевода через MAP вместо VSTACK (Задача 5.1)
    await injectSafeFormulas();

    // Создание Master аккаунта, если отсутствует
    const masterDb = await sheets.spreadsheets.values.get({ spreadsheetId, range: `'${GOOGLE_CONFIG.masterSheetName}'!A:A` });
    const masterRows = masterDb.data.values || [];
    if (masterRows.length <= 1) { 
        await sheets.spreadsheets.values.append({ spreadsheetId, range: `'${GOOGLE_CONFIG.masterSheetName}'!A:M`, valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS', requestBody: { values: [["Aleksei Z", "", "", "", "admin@villaturaman.com", "admin", "admin123", "Главный", "Да", "Да", "Да", "Да", "Да"]] } });
    }

    // Автоматическое заполнение словаря переменных / плейсхолдеров (Задача 4.2)
    const varsDb = await sheets.spreadsheets.values.get({ spreadsheetId, range: `'${GOOGLE_CONFIG.variablesSheetName}'!A:A` });
    if ((varsDb.data.values || []).length <= 1) {
        await sheets.spreadsheets.values.update({ 
           spreadsheetId, 
           range: `'${GOOGLE_CONFIG.variablesSheetName}'!A2:D8`, 
           valueInputOption: 'USER_ENTERED', 
           requestBody: { values: [
               ["[FIRST_NAME]", "name", "Имя гостя", "Иван"],
               ["[CHECKIN_DATE]", "checkIn", "Дата заезда", "01.05.2027"],
               ["[CHECKOUT_DATE]", "checkOut", "Дата выезда", "10.05.2027"],
               ["[CHECKIN_TIME]", "checkInTime", "Стандартное время заезда", "15:00"],
               ["[CHECKOUT_TIME]", "checkOutTime", "Стандартное время выезда", "11:00"],
               ["[GUESTS]", "total_guests", "Общее количество гостей", "4"],
               ["[PRICE]", "totalPrice", "Итоговая стоимость", "150000 RUB"]
           ] } 
        });
    }

    // Инициализация базового контента
    const homeDb = await sheets.spreadsheets.values.get({ spreadsheetId, range: `'${GOOGLE_CONFIG.homePageSheetName}'!A:A` });
    if ((homeDb.data.values || []).length <= 1) {
        await sheets.spreadsheets.values.update({ spreadsheetId, range: `'${GOOGLE_CONFIG.homePageSheetName}'!A2:E6`, valueInputOption: 'USER_ENTERED', requestBody: { values: [
            ["heroTitle", "Villa Turaman", "", "", ""],
            ["heroSubtitle", "Ваш идеальный отдых в Дальяне. Бронирование виллы, премиальный сервис и авторские видео-путеводители от Алексея Знаменского.", "", "", ""],
            ["aboutTitle", "О Вилле", "", "", ""],
            ["aboutText", "Villa Turaman — это гармоничное сочетание уединения, современного комфорта и первоклассного сервиса для незабываемого отпуска в сердце Дальяна.", "", "", ""],
            ["heroImage", "", "", "", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600"]
        ] } });
    }

    const templatesDb = await sheets.spreadsheets.values.get({ spreadsheetId, range: `'${GOOGLE_CONFIG.templatesSheetName}'!A:A` });
    if ((templatesDb.data.values || []).length <= 1) {
        await sheets.spreadsheets.values.update({ spreadsheetId, range: `'${GOOGLE_CONFIG.templatesSheetName}'!A2:B3`, valueInputOption: 'USER_ENTERED', requestBody: { values: [ ["welcome", "Приветствие"], ["confirmation", "Подтверждение"] ] } });
        // В шаблонах по умолчанию теперь используются плейсхолдеры из БД
        await sheets.spreadsheets.values.update({ spreadsheetId, range: `'${GOOGLE_CONFIG.templatesSheetName}'!E2:E3`, valueInputOption: 'USER_ENTERED', requestBody: { values: [ ["Здравствуйте, [FIRST_NAME]! Добро пожаловать. Я владелец Виллы Тураман."], ["Ваша заявка на бронирование [CHECKIN_DATE] — [CHECKOUT_DATE] принята."] ] } });
    }
  };

  // --- API: Получение публичных данных (E-Commerce, Галерея) ---
  if (action === 'get_public_data') {
    try {
        await ensureSystemSheets();
        const productsSheet = await sheets.spreadsheets.values.get({ spreadsheetId, range: `'${GOOGLE_CONFIG.productsSheetName}'!A:Q` });
        const coursesSheet = await sheets.spreadsheets.values.get({ spreadsheetId, range: `'${GOOGLE_CONFIG.coursesSheetName}'!A:Q` });
        const gallerySheet = await sheets.spreadsheets.values.get({ spreadsheetId, range: `'${GOOGLE_CONFIG.gallerySheetName}'!A:L` });
        
        const products = (productsSheet.data.values || []).slice(1).map(r => ({
            id: r[0],
            name: { ru: r[1], en: r[3], tr: r[5] },
            desc: { ru: r[2], en: r[4], tr: r[6] },
            price: { eur: r[7], rub: r[8], try: r[9] },
            images: (r[10] || '').split(',').map(s => s.trim()).filter(Boolean),
            videos: (r[13] || '').split(',').map(s => s.trim()).filter(Boolean),
            detailedDesc: { ru: r[14] || '', en: r[15] || '', tr: r[16] || '' },
            type: {
              ru: r[12] === 'Пакет' ? 'Пакет услуг' : 'Услуга',
              en: r[12] === 'Пакет' ? 'Service Package' : 'Service',
              tr: r[12] === 'Пакет' ? 'Hizmet Paketi' : 'Hizmet'
            }
        })).filter(p => p.id && p.name.ru);

        const courses = (coursesSheet.data.values || []).slice(1).map(r => ({
            id: r[0],
            name: { ru: r[1], en: r[3], tr: r[5] },
            desc: { ru: r[2], en: r[4], tr: r[6] },
            images: (r[7] || '').split(',').map(s => s.trim()).filter(Boolean),
            module: r[8] || 'Основной',
            privateLink: r[9],
            price: { eur: r[10], rub: r[11], try: r[12] },
            videos: (r[13] || '').split(',').map(s => s.trim()).filter(Boolean),
            detailedDesc: { ru: r[14] || '', en: r[15] || '', tr: r[16] || '' },
            level: 'Для гостей'
        })).filter(c => c.id && c.name.ru);

        const gallery = (gallerySheet.data.values || []).slice(1).map(r => ({
            id: r[0],
            group: { ru: r[1], en: r[3], tr: r[5] },
            groupDesc: { ru: r[2], en: r[4], tr: r[6] },
            type: r[7] === 'Видео' ? 'video' : 'image',
            media: (r[8] || '').split(',').map(s => s.trim()).filter(Boolean),
            caption: { ru: r[9], en: r[10], tr: r[11] }
        })).filter(g => g.id && g.media.length > 0);

        return res.status(200).json({ success: true, products, courses, gallery });
    } catch (e) {
        console.error(`[API Error] Action: get_public_data`, e);
        return res.status(500).json({ success: false, error: e.message, products: [], courses: [], gallery: [] });
    }
  }

  // --- API: Получение курсов для мастера (LMS) ---
  if (action === 'master_get_lms') {
    try {
      await ensureSystemSheets();
      const coursesSheet = await sheets.spreadsheets.values.get({ spreadsheetId, range: `'${GOOGLE_CONFIG.coursesSheetName}'!A:Q` });
      const lms = (coursesSheet.data.values || []).slice(1).map(r => ({
          id: r[0],
          name: { ru: r[1], en: r[3], tr: r[5] },
          module: r[8] || 'Основной',
          privateLink: r[9]
      })).filter(c => c.id && c.privateLink);
      return res.status(200).json({ success: true, lms });
    } catch (e) { return res.status(500).json({ success: false, error: e.message }); }
  }

  // --- API: Получение глобальных настроек (включая заезд/выезд Задача 2.1) ---
  if (action === 'get_settings') {
    try {
      const cachedSettings = await safeCacheGet('settings_cache');
      if (cachedSettings) return res.status(200).json(cachedSettings);
      
      await ensureSystemSheets();
      const db = await sheets.spreadsheets.values.get({ spreadsheetId, range: `'${GOOGLE_CONFIG.calendarSettingsSheetName}'!A:G`});
      const rows = db.data.values || []; let globalRules = null; let dateRules = [];
      
      for (let i = rows.length - 1; i >= 0; i--) {
        const row = rows[i];
        if (row[2] === 'Настройки' && !globalRules) {
          try { globalRules = JSON.parse(row[3]); } catch (e) {} 
        } else if (row[2] !== 'Настройки' && row[0] && row[0] !== 'Дата старта') { 
          let isValid = true;
          if (row[2] === 'Блокировка' && row[3] && (row[3] || '').toString().startsWith('HOLD|')) {
              const parts = row[3].split('|');
              if (parts.length === 3) {
                  const expiresAt = new Date(parts[2]).getTime();
                  if (Date.now() > expiresAt) isValid = false;
              }
          }
          if (isValid) dateRules.push({ start: row[0], end: row[1] || row[0], type: row[2], value: row[3], note: row[4] }); 
        } 
      }
      
      // Загрузка словаря переменных для фронтенда (Задача 4.2)
      let variablesDict = {};
      try {
         const varsDb = await sheets.spreadsheets.values.get({ spreadsheetId, range: `'${GOOGLE_CONFIG.variablesSheetName}'!A:B` });
         (varsDb.data.values || []).slice(1).forEach(row => {
             if (row[0] && row[1]) variablesDict[row[1]] = row[0]; // key: name, value: [FIRST_NAME]
         });
      } catch (e) {}
      
      const result = { success: true, globalRules, dateRules, variablesDict }; 
      await safeCacheSet('settings_cache', result, { ex: 3600 });
      return res.status(200).json(result);
    } catch (e) { return res.status(500).json({ success: false, error: e.message }); }
  }


  // --- УПРАВЛЕНИЕ И ПОЛУЧЕНИЕ ПСЕВДО-ГРАФА ЗАДАЧ И КАЛЕНДАРЯ ---
  if (action === 'get_tasks_graph') {
    try {
      let nodes = []; let edges = []; const clusterMap = new Set(); const nodeTitles = new Map(); let warnings = [];
      
      // Загрузка задач из Google Tasks
      if (tasksApi) {
        try {
            const listRes = await tasksApi.tasklists.list({ maxResults: 100 });
            const taskLists = listRes.data.items || [];
            for (const list of taskLists) {
                nodes.push({ id: list.id, label: list.title, group: 'list', color: '#3b82f6' });
                const tasksRes = await tasksApi.tasks.list({ tasklist: list.id, maxResults: 100, showCompleted: true });
                const tasks = tasksRes.data.items || [];
                for (const task of tasks) {
                    if (!task.title) continue;
                    nodeTitles.set(task.title.trim().toLowerCase(), task.id);
                    const isCompleted = task.status === 'completed';
                    nodes.push({ id: task.id, listId: list.id, label: task.title, group: 'task', status: task.status, color: isCompleted ? '#10b981' : '#f59e0b' });
                    edges.push({ from: task.id, to: list.id, type: 'belongs' });
                    if (task.notes) {
                        const tags = task.notes.match(/#[a-zA-Z0-9_А-Яа-я]+/g);
                        if (tags) {
                            tags.forEach(tag => {
                                const tagId = `tag_${tag.toLowerCase()}`;
                                if (!clusterMap.has(tagId)) { clusterMap.add(tagId); nodes.push({ id: tagId, label: tag, group: 'cluster', color: '#a855f7' }); }
                                edges.push({ from: task.id, to: tagId, type: 'tag' });
                            });
                        }
                    }
                }
            }
        } catch(e) { warnings.push(`Ошибка при загрузке Google Tasks: ${e.message}`); }
      }
      
      // Загрузка событий из Google Calendar
      if (calendarApi) {
        nodes.push({ id: 'gcalendar_hub', label: 'Google Calendar', group: 'hub', color: '#34A853' });
        try {
            const calendarListRes = await calendarApi.calendarList.list();
            const calendars = calendarListRes.data.items || [];
            for (const calendar of calendars) {
                if (calendar.accessRole === 'owner' || calendar.accessRole === 'writer' || calendar.accessRole === 'reader') {
                    nodes.push({ id: calendar.id, label: calendar.summary, group: 'gcal_list', color: '#81C995' });
                    edges.push({ from: calendar.id, to: 'gcalendar_hub', type: 'belongs' });
                    const eventsRes = await calendarApi.events.list({ calendarId: calendar.id, timeMin: (new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).toISOString(), timeMax: (new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).toISOString(), maxResults: 50, singleEvents: true, orderBy: 'startTime' });
                    const events = eventsRes.data.items || [];
                    for (const event of events) {
                        if (!event.summary) continue;
                        const start = event.start.dateTime || event.start.date;
                        nodes.push({ id: event.id, label: event.summary, group: 'gcal_event', color: '#A5D6A7', details: `Когда: ${new Date(start).toLocaleString()}` });
                        edges.push({ from: event.id, to: calendar.id, type: 'gcal_event' });
                    }
                }
            }
        } catch (e) { warnings.push(`Ошибка при загрузке Google Calendar: ${e.message}`); }
      }
      
      // Интеграция iCal событий в граф (Airbnb/Booking)
      nodes.push({ id: 'ical_hub', label: 'Внешние брони (iCal)', group: 'hub', color: '#F4B400' });
      try {
        if (!ical) ical = (await import('node-ical')).default;
        const icalResults = await Promise.allSettled(icalSources.filter(s => s.enabled).map(async (source) => {
            const response = await fetch(`${source.url}${source.url.includes('?') ? '&' : '?'}nocache=${Date.now()}`, { cache: 'no-store' });
            if (!response.ok) throw new Error(`iCal fetch failed for ${source.name} with status ${response.status}`);
            const icsText = await response.text();
            const data = await ical.async.parseICS(icsText);
            return { data, source };
        }));
        
        icalResults.forEach((result) => {
            if (result.status === 'fulfilled') {
                const { data, source } = result.value;
                for (const k in data) {
                    if (Object.hasOwnProperty.call(data, k)) {
                        const ev = data[k];
                        if (ev.type === 'VEVENT' && ev.start) {
                            const start = normalizeDateToUTC(ev.start); const end = normalizeDateToUTC(ev.end || ev.start);
                            const label = `${source.name}: ${ev.summary?.val || ev.summary || 'Бронь'}`; const nodeId = `ical_${source.id}_${ev.uid?.val || ev.uid || k}`;
                            nodes.push({ id: nodeId, label: label, group: 'ical_event', color: source.color || '#FFD54F', details: `Период: ${start.toISOString().split('T')[0]} - ${end.toISOString().split('T')[0]}` });
                            edges.push({ from: nodeId, to: 'ical_hub', type: 'ical_booking' });
                        }
                    }
                }
            }
        });
      } catch (e) { warnings.push(`Ошибка при загрузке iCal: ${e.message}`); }
      
      // Правила внутренней CRM
      if (sheets) {
        nodes.push({ id: 'calendar_hub', label: 'Календарь Виллы (CRM)', group: 'hub', color: '#ef4444' });
        try {
            await ensureSystemSheets();
            const db = await sheets.spreadsheets.values.get({ spreadsheetId, range: `${GOOGLE_CONFIG.calendarSettingsSheetName}!A:G` });
            const rows = db.data.values || [];
            let activeRules = [];
            for (let i = rows.length - 1; i >= 0; i--) {
                const r = rows[i];
                if (r[2] !== 'Настройки' && r[0] && r[1] && !String(r[2]).startsWith('Сброс')) activeRules.push(r);
                if (activeRules.length > 20) break;
            }
            activeRules.forEach((row, idx) => {
                const ruleId = `cal_${idx}`;
                nodes.push({ id: ruleId, label: `[${row[2]}] ${row[0]} - ${row[1]}`, group: 'calendar', color: row[2]==='Блокировка'?'#f87171':'#60a5fa', details: row[3] || 'Нет данных', note: row[4] || '' });
                edges.push({ from: ruleId, to: 'calendar_hub', type: 'calendar_rule' });
            });
        } catch (e) { warnings.push(`Ошибка при загрузке правил из CRM: ${e.message}`); }
      }
      
      return res.status(200).json({ success: true, nodes, edges, warnings });
    } catch (err) { return res.status(500).json({ success: false, error: err.message }); }
  }

  if (action === 'create_task') {
    try {
      if (!tasksApi) return res.status(400).json({ success: false, error: 'Google Tasks API не настроен.' });
      await tasksApi.tasks.insert({ tasklist: data.listId, requestBody: { title: data.title, notes: data.notes || '' } });
      return res.status(200).json({ success: true });
    } catch (err) { return res.status(500).json({ success: false, error: err.message }); }
  }

  if (action === 'update_task_status') {
    try {
      if (!tasksApi) return res.status(400).json({ success: false, error: 'Google Tasks API не настроен.' });
      const task = await tasksApi.tasks.get({ tasklist: data.listId, task: data.taskId });      
      const updatedTask = { ...task.data, status: data.status };
      await tasksApi.tasks.update({ tasklist: data.listId, task: data.taskId, requestBody: updatedTask });
      return res.status(200).json({ success: true });
    } catch (err) { return res.status(500).json({ success: false, error: err.message }); }
  }

  if (action === 'delete_task') {
    try {
      if (!tasksApi) return res.status(400).json({ success: false, error: 'Google Tasks API не настроен.' });
      await tasksApi.tasks.delete({ tasklist: data.listId, task: data.taskId });
      return res.status(200).json({ success: true });
    } catch (err) { return res.status(500).json({ success: false, error: err.message }); }
  }

  // --- ЛОГИКА CRM И АВТОРИЗАЦИИ (С поддержкой разделенных БД) ---
  if (action === 'register') {
    try {
      const targetChatId = getChatSpreadsheetId(); // Получение ID таблицы для чатов
      
      await ensureSystemSheets(); // Проверка структуры основной БД
      
      const safeContact = (data.contact || '').toString().trim().toLowerCase();
      
      // Проверка существования пользователя в основной БД
      const existingData = await sheets.spreadsheets.values.get({ spreadsheetId, range: `'${GOOGLE_CONFIG.accountSheetName}'!C:C` });
      const logins = existingData.data.values ? existingData.data.values.flat().map(v => (v || '').toString().trim().toLowerCase()) : [];
      if (logins.includes(safeContact)) return res.status(200).json({ success: false, error: "error_user_exists" });
      
      const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
      
      // Запись нового пользователя в основную БД
      await sheets.spreadsheets.values.append({ 
         spreadsheetId, 
         range: `${GOOGLE_CONFIG.accountSheetName}!A:G`, 
         valueInputOption: 'USER_ENTERED', 
         insertDataOption: 'INSERT_ROWS', 
         requestBody: { values: [[timestamp, (data.name || '').toString().trim(), (data.contact || '').toString().trim(), (data.password || '').toString().trim() || "123456", "Нет", "Нет", "Нет"]] } 
      });
      
      // Создание персонального листа чата во ВНЕШНЕЙ БД (Задача 4.5)
      const chatSheetName = getChatSheetName((data.name || '').toString().trim(), (data.contact || '').toString().trim());
      const chatDbMetadata = await sheets.spreadsheets.get({ spreadsheetId: targetChatId });
      
      if (!chatDbMetadata.data.sheets.find(s => s.properties.title === chatSheetName)) {
        // Создаем лист
        await sheets.spreadsheets.batchUpdate({ 
           spreadsheetId: targetChatId, 
           requestBody: { requests: [{ addSheet: { properties: { title: chatSheetName } } }] } 
        });
        
        // Получаем ID созданного листа для форматирования
        const updatedChatDb = await sheets.spreadsheets.get({ spreadsheetId: targetChatId });
        const newSheet = updatedChatDb.data.sheets.find(s => s.properties.title === chatSheetName);
        
        // Применяем заголовки и стили к листу чата
        if (newSheet) {
           await sheets.spreadsheets.batchUpdate({
              spreadsheetId: targetChatId,
              requestBody: {
                 requests: [
                    { 
                       updateCells: { 
                          range: { sheetId: newSheet.properties.sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: GOOGLE_CONFIG.chatHeaders.length }, 
                          rows: [{ values: GOOGLE_CONFIG.chatHeaders.map(h => ({ userEnteredValue: { stringValue: h }, userEnteredFormat: { backgroundColor: { red: 0.15, green: 0.20, blue: 0.28 }, textFormat: { bold: true, fontSize: 11, foregroundColor: { red: 1, green: 1, blue: 1 } }, horizontalAlignment: 'CENTER', verticalAlignment: 'MIDDLE' } })) }], 
                          fields: 'userEnteredValue,userEnteredFormat' 
                       } 
                    },
                    { updateSheetProperties: { properties: { sheetId: newSheet.properties.sheetId, gridProperties: { frozenRowCount: 1 } }, fields: 'gridProperties.frozenRowCount' } }
                 ]
              }
           });
        }
      }
      
      const userObj = { name: (data.name || '').toString().trim(), contact: (data.contact || '').toString().trim(), isHost: false, blockChat: false, hasChat: true };
      return res.status(200).json({ success: true, message: "Регистрация успешна", user: userObj });
    } catch (e) { return res.status(500).json({ success: false, error: e.message }); }
  }

  if (action === 'login') {
    try {
      await ensureSystemSheets();
      const targetChatId = getChatSpreadsheetId();
      const safeContact = (data.contact || '').toString().trim().toLowerCase(); 
      const safePassword = (data.password || '').toString().trim();
      
      // Поиск владельца (MasterAccount)
      const masterDb = await sheets.spreadsheets.values.get({ spreadsheetId, range: `'${GOOGLE_CONFIG.masterSheetName}'!A:M` });
      const masterUser = (masterDb.data.values || []).find(r => { 
         const rowEmail = (r[4] || '').toString().trim().toLowerCase(); 
         const rowLogin = (r[5] || '').toString().trim().toLowerCase(); 
         const rowPassword = (r[6] || '').toString().trim(); 
         return (rowEmail === safeContact || rowLogin === safeContact) && rowPassword === safePassword; 
      });
      
      if (masterUser) {
        const permissions = { finance: (masterUser[8] || '').toString().trim().toLowerCase() === 'да', periods: (masterUser[9] || '').toString().trim().toLowerCase() === 'да', blocks: (masterUser[10] || '').toString().trim().toLowerCase() === 'да', bookingWindow: (masterUser[11] || '').toString().trim().toLowerCase() === 'да', chats: (masterUser[12] || '').toString().trim().toLowerCase() === 'да' };
        return res.status(200).json({ success: true, user: { name: (masterUser[0] || 'Admin').toString().trim(), contact: safeContact, isHost: true, role: (masterUser[7] || 'Admin').toString(), permissions } });
      }
      
      // Поиск гостя (Accounts)
      const db = await sheets.spreadsheets.values.get({ spreadsheetId, range: `'${GOOGLE_CONFIG.accountSheetName}'!A:G` });
      const userRow = (db.data.values || []).find(r => (r[2] || '').toString().trim().toLowerCase() === safeContact && (r[3] || '').toString().trim() === safePassword);
      
      if (!userRow) return res.status(200).json({ success: false, error: "error_invalid_login" });
      if ((userRow[4] || '').toString().trim().toLowerCase() === 'да') return res.status(200).json({ success: false, blockType: 'site', error: "error_site_blocked" });
      if ((userRow[5] || '').toString().trim().toLowerCase() === 'да') return res.status(200).json({ success: false, blockType: 'account', error: "error_account_suspended" });
      
      const blockChat = (userRow[6] || '').toString().trim().toLowerCase() === 'да';
      
      // Проверка чата во ВНЕШНЕЙ БД
      const chatDbMetadata = await sheets.spreadsheets.get({ spreadsheetId: targetChatId });
      const chatExists = !!chatDbMetadata.data.sheets.find(s => s.properties.title === getChatSheetName(userRow[1], userRow[2]));
      
      return res.status(200).json({ success: true, user: { name: (userRow[1] || 'Guest').toString().trim(), contact: (userRow[2] || '').toString().trim(), isHost: false, blockChat, hasChat: chatExists } });
    } catch (e) { return res.status(500).json({ success: false, error: e.message }); }
  }

  // Получение всех чатов для панели администратора (Комбинирование из 2х БД)
  if (action === 'master_get_chats') {
    try {
      await ensureSystemSheets();
      const targetChatId = getChatSpreadsheetId();
      
      // 1. Получаем заказы из ОСНОВНОЙ БД
      let dbBooking = { data: { values: [] } };
      try {
         dbBooking = await sheets.spreadsheets.values.get({ spreadsheetId, range: `'Вилла'!A:K` });
      } catch(e) {}
      
      const allBookings = dbBooking.data.values || [];
      const requests = allBookings.slice(1).map((r, i) => {
        let statusFull = r[10] || ''; let status = statusFull; let expiresAt = null;
        if (statusFull.startsWith('СПЕЦПРЕДЛОЖЕНИЕ|')) { const parts = statusFull.split('|'); status = 'СПЕЦПРЕДЛОЖЕНИЕ'; expiresAt = parts[1]; } 
        else if (statusFull.startsWith('ОЖИДАЕТ ОПЛАТЫ|')) { const parts = statusFull.split('|'); status = 'ОЖИДАЕТ ОПЛАТЫ'; expiresAt = parts[1]; }
        return { rowIndex: i + 1, date: r[0], name: r[1], contact: r[2], checkIn: r[3], checkOut: r[4], nights: r[5], adults: r[6], children: r[7], guests: r[8], price: r[9], status, expiresAt };
      });
      
      // 2. Получаем чаты из ЧАТОВОЙ БД
      const chatDbMetadata = await sheets.spreadsheets.get({ spreadsheetId: targetChatId });
      let allChats = [];
      
      for (const sheet of chatDbMetadata.data.sheets.filter(s => s.properties.title.startsWith('Chat_'))) {
        const title = sheet.properties.title; const parts = title.split('_');
        const clientName = parts[1]; const clientContact = parts[2];
        
        const chatDb = await sheets.spreadsheets.values.get({ spreadsheetId: targetChatId, range: `'${title}'!A:G` });
        
        // Связываем заявки из основной БД с чатом
        const userRequests = requests.filter(r => (r.contact || '').trim().toLowerCase() === (clientContact || '').trim().toLowerCase() && (r.status === 'ЗАПРОС' || r.status === 'ОЖИДАЕТ ОПЛАТЫ' || r.status === 'СПЕЦПРЕДЛОЖЕНИЕ'));
        userRequests.sort((a, b) => { const dA = a.checkIn.split('.').reverse().join(''); const dB = b.checkIn.split('.').reverse().join(''); return dA.localeCompare(dB); });
        
        allChats.push({ sheetName: title, clientName, clientContact, activeRequests: userRequests, messages: (chatDb.data.values || []).slice(1).map(parseMessageRow) });
      }
      return res.status(200).json({ success: true, chats: allChats });
    } catch (e) { return res.status(500).json({ success: false, error: e.message }); }
  }

  // --- ЛОГИКА КЛИЕНТСКОГО ЧАТА (Чтение и Запись через внешнюю БД - Задача 4.5) ---
  if (action === 'chat') {
    try {
      const targetChatId = getChatSpreadsheetId();
      const chatSheetName = getChatSheetName(data.sender, data.contact);
      
      // Обработка входящего сообщения от клиента
      if (data.message || data.fileBase64) {
        const safeContact = (data.contact || '').toString().trim().toLowerCase();
        
        // Проверка блокировки чата пользователя (в основной БД)
        const db = await sheets.spreadsheets.values.get({ spreadsheetId, range: `'${GOOGLE_CONFIG.accountSheetName}'!A:G` });
        const userRow = (db.data.values || []).find(r => (r[2] || '').toString().trim().toLowerCase() === safeContact);
        if (userRow && (userRow[6] || '').toString().trim().toLowerCase() === 'да') {
           return res.status(200).json({ success: false, error: "Доступ к чату заблокирован администратором." });
        }
        
        let fileUrl = "";
        
        // Отправка вложений в Telegram (если настроено)
        if (data.fileBase64 && data.fileName && data.mimeType && TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
          try {
            const formData = new FormData(); 
            formData.append('chat_id', TELEGRAM_CHAT_ID); 
            formData.append('document', new Blob([Buffer.from(data.fileBase64, 'base64')], { type: data.mimeType }), data.fileName); 
            formData.append('caption', `📁 Вложение!\nОт: ${data.sender}\nКонтакт: ${data.contact}`);
            
            const tgRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, { method: 'POST', body: formData });
            fileUrl = (await tgRes.json()).ok ? "Файл доставлен" : "Ошибка доставки";
          } catch (fileErr) { 
            fileUrl = "Сбой передачи"; 
          }
        }
        
        const msgText = data.message || '';
        
        // Формирование безопасных формул перевода для новой строки
        const fRU = msgText && typeof msgText === 'string' ? '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "ru")' : '';
        const fEN = msgText && typeof msgText === 'string' ? '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "en")' : '';
        const fTR = msgText && typeof msgText === 'string' ? '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "tr")' : '';
        
        // Запись сообщения во внешнюю БД чатов
        await sheets.spreadsheets.values.append({ 
           spreadsheetId: targetChatId, 
           range: `'${chatSheetName}'!A:G`, 
           valueInputOption: 'USER_ENTERED', 
           insertDataOption: 'INSERT_ROWS', 
           requestBody: { values: [[new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' }), data.sender || 'Клиент', msgText, fRU, fEN, fTR, fileUrl]] } 
        });
      }
      
      // Чтение истории сообщений из внешней БД
      const chatDb = await sheets.spreadsheets.values.get({ spreadsheetId: targetChatId, range: `'${chatSheetName}'!A:G` });
      
      // Чтение активных заявок из основной БД
      let dbBooking = { data: { values: [] } };
      try { 
         dbBooking = await sheets.spreadsheets.values.get({ spreadsheetId, range: `'Вилла'!A:K` }); 
      } catch(e) {}
      
      const allBookings = dbBooking.data.values || [];
      const userRequests = allBookings.slice(1).map((r, i) => {
        let statusFull = r[10] || ''; let status = statusFull; let expiresAt = null;
        if (statusFull.startsWith('СПЕЦПРЕДЛОЖЕНИЕ|')) { const parts = statusFull.split('|'); status = 'СПЕЦПРЕДЛОЖЕНИЕ'; expiresAt = parts[1]; }
        else if (statusFull.startsWith('ОЖИДАЕТ ОПЛАТЫ|')) { const parts = statusFull.split('|'); status = 'ОЖИДАЕТ ОПЛАТЫ'; expiresAt = parts[1]; }
        return { rowIndex: i + 1, date: r[0], name: r[1], contact: r[2], checkIn: r[3], checkOut: r[4], nights: r[5], adults: r[6], children: r[7], guests: r[8], price: r[9], status, expiresAt };
      }).filter(r => r.contact === data.contact && (r.status === 'ЗАПРОС' || r.status === 'ОЖИДАЕТ ОПЛАТЫ' || r.status === 'СПЕЦПРЕДЛОЖЕНИЕ'));
      
      userRequests.sort((a, b) => { 
         const dA = a.checkIn.split('.').reverse().join(''); 
         const dB = b.checkIn.split('.').reverse().join(''); 
         return dA.localeCompare(dB); 
      });
      
      return res.status(200).json({ success: true, messages: (chatDb.data.values || []).slice(1).map(parseMessageRow), activeRequests: userRequests });
    } catch (e) { 
      return res.status(500).json({ success: false, error: e.message }); 
    }
  }

  // --- ЛОГИКА МОДЕРАЦИИ БРОНИРОВАНИЙ ВЛАДЕЛЬЦЕМ ---

  if (action === 'approve_request') {
    try {
      const targetChatId = getChatSpreadsheetId();
      // Выделяем 24 часа на оплату заявки
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      const statusStr = `ОЖИДАЕТ ОПЛАТЫ|${expiresAt}`;
      const range = `'Вилла'!K${data.rowIndex + 1}`;
      
      // Обновляем статус в основной БД
      await sheets.spreadsheets.values.update({ spreadsheetId, range, valueInputOption: 'USER_ENTERED', requestBody: { values: [[statusStr]] } });
      
      const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
      const deadlineStr = new Date(expiresAt).toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
      
      // Устанавливаем жесткий блок в календаре до истечения времени оплаты
      const ruleRow = [data.checkIn, data.checkOut, "Блокировка", `HOLD|${data.contact}|${expiresAt}`, "Ожидание оплаты (Одобрено)", "Система", timestamp];
      await sheets.spreadsheets.values.append({ spreadsheetId, range: `'${GOOGLE_CONFIG.calendarSettingsSheetName}'!A:G`, valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS', requestBody: { values: [ruleRow] } });
      
      // Формирование дружелюбного сообщения с инструкциями и плейсхолдерами (Задачи 4.2 и 4.3)
      const variablesData = {
          "[CHECKIN_DATE]": data.checkIn,
          "[CHECKOUT_DATE]": data.checkOut,
          "[DEADLINE]": deadlineStr
      };
      
      let msgTemplate = `✅ Здравствуйте! С радостью сообщаю, что ваша заявка на проживание с [CHECKIN_DATE] по [CHECKOUT_DATE] успешно одобрена.\n\nДля подтверждения бронирования и фиксации дат за вами, пожалуйста, перейдите в панель бронирования (наверху) и завершите процесс онлайн-оплаты.\n\n⏳ Счет действителен до: [DEADLINE].\nЕсли у вас возникнут вопросы — я на связи!`;
      const msg = replacePlaceholders(msgTemplate, variablesData);
      
      // Отправка системного сообщения во внешнюю БД чатов
      await sheets.spreadsheets.values.append({ 
         spreadsheetId: targetChatId, 
         range: `'${data.chatSheetName}'!A:G`, 
         valueInputOption: 'USER_ENTERED', 
         insertDataOption: 'INSERT_ROWS', 
         requestBody: { values: [[timestamp, "Владелец", msg, '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "ru")', '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "en")', '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "tr")', ""]] } 
      });
      
      await safeCacheDel('settings_cache');
      return res.status(200).json({ success: true });
    } catch (e) { return res.status(500).json({ success: false, error: e.message }); }
  }

  if (action === 'special_offer') {
    try {
      const targetChatId = getChatSpreadsheetId();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      const statusStr = `СПЕЦПРЕДЛОЖЕНИЕ|${expiresAt}`;
      const range = `'Вилла'!D${data.rowIndex + 1}:K${data.rowIndex + 1}`;
      
      await sheets.spreadsheets.values.update({ spreadsheetId, range, valueInputOption: 'USER_ENTERED', requestBody: { values: [[data.checkIn, data.checkOut, data.nights, data.adults, data.children, data.guests, data.price, statusStr]] } });
      
      const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
      const deadlineStr = new Date(expiresAt).toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
      
      const ruleRow = [data.checkIn, data.checkOut, "Блокировка", `HOLD|${data.clientContact}|${expiresAt}`, "Ожидание оплаты (Спецпредложение)", "Система", timestamp];
      await sheets.spreadsheets.values.append({ spreadsheetId, range: `'${GOOGLE_CONFIG.calendarSettingsSheetName}'!A:G`, valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS', requestBody: { values: [ruleRow] } });
      
      const msg = `🎁 Для вас сформировано специальное предложение!\n\nДаты проживания: ${data.checkIn} — ${data.checkOut}\nОбновленная стоимость: ${data.price}\n\nПожалуйста, перейдите к оплате в карточке бронирования выше. Окно оплаты открыто до: ${deadlineStr}.`;
      await sheets.spreadsheets.values.append({ spreadsheetId: targetChatId, range: `'${data.chatSheetName}'!A:G`, valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS', requestBody: { values: [[timestamp, "Владелец", msg, '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "ru")', '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "en")', '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "tr")', ""]] } });
      
      await safeCacheDel('settings_cache');
      return res.status(200).json({ success: true });
    } catch (e) { return res.status(500).json({ success: false, error: e.message }); }
  }

  if (action === 'revoke_request') {
    try {
      const targetChatId = getChatSpreadsheetId();
      const range = `'Вилла'!K${data.rowIndex + 1}`;
      await sheets.spreadsheets.values.update({ spreadsheetId, range, valueInputOption: 'USER_ENTERED', requestBody: { values: [["ОТОЗВАНО"]] } });
      
      const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
      
      // Сброс блокировки календаря
      const ruleRow = [data.checkIn, data.checkOut, "Сброс блокировки", "СБРОС", "Отозвано владельцем", "Система", timestamp];
      await sheets.spreadsheets.values.append({ spreadsheetId, range: `'${GOOGLE_CONFIG.calendarSettingsSheetName}'!A:G`, valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS', requestBody: { values: [ruleRow] } });
      
      const msg = `❌ Сообщаю, что предложение на бронирование с ${data.checkIn} по ${data.checkOut} было отозвано администрацией. Если это ошибка — напишите мне.`;
      await sheets.spreadsheets.values.append({ spreadsheetId: targetChatId, range: `'${data.chatSheetName}'!A:G`, valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS', requestBody: { values: [[timestamp, "Владелец", msg, '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "ru")', '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "en")', '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "tr")', ""]] } });
      
      await safeCacheDel('settings_cache');
      return res.status(200).json({ success: true });
    } catch (e) { return res.status(500).json({ success: false, error: e.message }); }
  }

  if (action === 'reject_request') {
    try {
      const targetChatId = getChatSpreadsheetId();
      const range = `'Вилла'!K${data.rowIndex + 1}`;
      await sheets.spreadsheets.values.update({ spreadsheetId, range, valueInputOption: 'USER_ENTERED', requestBody: { values: [["ОТКЛОНЕНО"]] } });
      
      const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
      const msg = `❌ К сожалению, ваша заявка на даты ${data.checkIn} — ${data.checkOut} была отклонена. Пожалуйста, выберите другие доступные даты в календаре.`;
      await sheets.spreadsheets.values.append({ spreadsheetId: targetChatId, range: `'${data.chatSheetName}'!A:G`, valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS', requestBody: { values: [[timestamp, "Владелец", msg, '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "ru")', '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "en")', '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "tr")', ""]] } });
      
      await safeCacheDel('settings_cache');
      return res.status(200).json({ success: true });
    } catch (e) { return res.status(500).json({ success: false, error: e.message }); }
  }

  // --- МАССОВАЯ РАССЫЛКА И РУЧНОЕ УПРАВЛЕНИЕ КАЛЕНДАРЕМ ---

  if (action === 'master_send_chats') {
    try {
      const targetChatId = getChatSpreadsheetId();
      const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
      
      for (const sheetName of (data.targetSheets || [])) {
        // Подстановка имени клиента для рассылки (Зачатки плейсхолдеров)
        const cName = sheetName.split('_')[1] || 'Гость';
        const msgText = (data.message || '').toString().replace(/\{Имя\}/g, cName).replace(/\[FIRST_NAME\]/g, cName);
        
        const fRU = msgText && typeof msgText === 'string' ? '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "ru")' : '';
        const fEN = msgText && typeof msgText === 'string' ? '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "en")' : '';
        const fTR = msgText && typeof msgText === 'string' ? '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "tr")' : '';
        
        await sheets.spreadsheets.values.append({ 
           spreadsheetId: targetChatId, 
           range: `'${sheetName}'!A:G`, 
           valueInputOption: 'USER_ENTERED', 
           insertDataOption: 'INSERT_ROWS', 
           requestBody: { values: [[timestamp, data.sender || 'Владелец', msgText, fRU, fEN, fTR, ""]] } 
        });
      }
      return res.status(200).json({ success: true });
    } catch (e) { return res.status(500).json({ success: false, error: e.message }); }
  }

  if (action === 'master_save_calendar') {
    try {
      await ensureSystemSheets();
      const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
      
      const rows = (data.rules || []).map(r => [
          r.start, 
          r.end, 
          r.type, 
          r.value !== undefined ? r.value : "", 
          r.note !== undefined ? r.note : "", 
          data.sender || "Admin", 
          timestamp
      ]);
      
      if (rows.length > 0) {
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
    } catch (e) { return res.status(500).json({ success: false, error: e.message }); }
  }

  if (action === 'master_save_global_rules') {
    try {
      await ensureSystemSheets();
      await sheets.spreadsheets.values.append({ 
         spreadsheetId, 
         range: `'${GOOGLE_CONFIG.calendarSettingsSheetName}'!A:G`, 
         valueInputOption: 'USER_ENTERED', 
         insertDataOption: 'INSERT_ROWS', 
         requestBody: { values: [["Глобальные правила", "Все даты", "Настройки", JSON.stringify(data.rules), "Изменение лимитов", data.sender || "Admin", new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' })]] } 
      });
      await safeCacheDel('settings_cache');
      return res.status(200).json({ success: true });
    } catch (e) { return res.status(500).json({ success: false, error: e.message }); }
  }

  // --- ЛОГИКА СОЗДАНИЯ ЗАЯВОК (С добавлением вывода стоимости Задача 4.1) ---

  if (action === 'request_booking') {
    try {
      if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
        const message = `⚠️ НОВАЯ ЗАЯВКА (Модерация)\n👤 Гость: ${data.name}\n📞 Связь: ${data.contact}\n📅 Период: ${data.checkIn} — ${data.checkOut}\n👥 Количество: ${data.total_guests}\n💰 Стоимость: ${data.totalPrice}`;
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message }) });
      }
      
      const targetChatId = getChatSpreadsheetId();
      let userObj = null;
      
      if (!data.isRegistered) {
        const safeContact = (data.contact || '').toString().trim().toLowerCase();
        const existingData = await sheets.spreadsheets.values.get({ spreadsheetId, range: `'${GOOGLE_CONFIG.accountSheetName}'!C:C` });
        const logins = existingData.data.values ? existingData.data.values.flat().map(v => (v || '').toString().trim().toLowerCase()) : [];
        if (!logins.includes(safeContact)) {
            const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
            await sheets.spreadsheets.values.append({ spreadsheetId, range: `'${GOOGLE_CONFIG.accountSheetName}'!A:G`, valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS', requestBody: { values: [[timestamp, (data.name || '').toString().trim(), (data.contact || '').toString().trim(), "123456", "Нет", "Нет", "Нет"]] } });
        }
        userObj = { name: (data.name || '').toString().trim(), contact: (data.contact || '').toString().trim(), isHost: false, blockChat: false, hasChat: true };
      } else { 
        userObj = { name: (data.name || '').toString().trim(), contact: (data.contact || '').toString().trim(), isHost: false, blockChat: false, hasChat: true }; 
      }
      
      const chatSheetName = getChatSheetName(data.name, data.contact);
      const chatDbMetadata = await sheets.spreadsheets.get({ spreadsheetId: targetChatId });
      
      if (!chatDbMetadata.data.sheets.find(s => s.properties.title === chatSheetName)) {
        await sheets.spreadsheets.batchUpdate({ spreadsheetId: targetChatId, requestBody: { requests: [{ addSheet: { properties: { title: chatSheetName } } }] } });
      }
      
      const ss = await sheets.spreadsheets.get({ spreadsheetId });
      if (!ss.data.sheets.find(s => s.properties.title === 'Вилла')) {
         await sheets.spreadsheets.batchUpdate({ spreadsheetId, requestBody: { requests: [{ addSheet: { properties: { title: 'Вилла' } } }] } });
         await sheets.spreadsheets.values.update({ spreadsheetId, range: `'Вилла'!A1:K1`, valueInputOption: 'USER_ENTERED', requestBody: { values: [GOOGLE_CONFIG.headers] } });
      }

      const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
      
      // Системное сообщение с деталями и стоимостью (Задача 4.1)
      const miniCard = `📋 Заявка отправлена на модерацию.\nДетали: ${data.checkIn} — ${data.checkOut}\nКоличество: ${data.total_guests}\nСтоимость: ${data.totalPrice}\n\nОжидайте подтверждения от владельца.`;
      
      await sheets.spreadsheets.values.append({ spreadsheetId: targetChatId, range: `'${chatSheetName}'!A:G`, valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS', requestBody: { values: [[timestamp, "Система", miniCard, '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "ru")', '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "en")', '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "tr")', ""]] } });
      await sheets.spreadsheets.values.append({ spreadsheetId, range: `'Вилла'!A:K`, valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS', requestBody: { values: [[timestamp, data.name, data.contact, data.checkIn, data.checkOut, data.nights, data.total_adults, data.total_children, data.total_guests, data.totalPrice || "", "ЗАПРОС"]] } });
      
      return res.status(200).json({ success: true, user: userObj });
    } catch (err) { return res.status(500).json({ success: false, error: err.message }); }
  }

  if (action === 'booking') {
    try {
      if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
        const message = `🚀 НОВЫЙ ЗАКАЗ/БРОНЬ (Мгновенная)\n👤 Гость: ${data.name || 'Не указано'}\n📞 Связь: ${data.contact || 'Не указано'}\nДетали: ${data.checkIn} — ${data.checkOut}\nКоличество: ${data.total_guests}\n💰 Оплачено: ${data.totalPrice}`;
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message }) });
      }
      
      const ss = await sheets.spreadsheets.get({ spreadsheetId });
      
      if (!ss.data.sheets.find(s => s.properties.title === 'Вилла')) {
         await sheets.spreadsheets.batchUpdate({ spreadsheetId, requestBody: { requests: [{ addSheet: { properties: { title: 'Вилла' } } }] } });
         await sheets.spreadsheets.values.update({ spreadsheetId, range: `'Вилла'!A1:K1`, valueInputOption: 'USER_ENTERED', requestBody: { values: [GOOGLE_CONFIG.headers] } });
      }

      const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
      await sheets.spreadsheets.values.append({ spreadsheetId, range: `'Вилла'!A:K`, valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS', requestBody: { values: [[timestamp, data.name, data.contact, data.checkIn, data.checkOut, data.nights, data.total_adults, data.total_children, data.total_guests, data.totalPrice || "", data.paymentStatus || "ОЖИДАЕТ ОПЛАТЫ"]] } });
      
      if (data.isRegistered && data.contact) {
        const targetChatId = getChatSpreadsheetId();
        const chatSheetName = getChatSheetName(data.name, data.contact);
        const chatDbMetadata = await sheets.spreadsheets.get({ spreadsheetId: targetChatId });
        
        if (!chatDbMetadata.data.sheets.find(s => s.properties.title === chatSheetName)) {
          await sheets.spreadsheets.batchUpdate({ spreadsheetId: targetChatId, requestBody: { requests: [{ addSheet: { properties: { title: chatSheetName } } }] } });
        }
        
        const miniCard = `✅ Заказ успешно оформлен!\nДетали: ${data.checkIn} — ${data.checkOut}\nКоличество: ${data.total_guests}\nСумма транзакции: ${data.totalPrice}`;
        await sheets.spreadsheets.values.append({ spreadsheetId: targetChatId, range: `'${chatSheetName}'!A:G`, valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS', requestBody: { values: [[timestamp, "Система", miniCard, '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "ru")', '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "en")', '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "tr")', ""]] } });
      }
      return res.status(200).json({ success: true });
    } catch (err) { return res.status(500).json({ success: false, error: err.message }); }
  }
}

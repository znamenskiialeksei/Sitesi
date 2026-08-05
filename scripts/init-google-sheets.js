require('dotenv').config({ path: '.env.local' });
const { google } = require('googleapis');

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
  headers: [ "Дата заявки", "Имя клиента", "Контакт (Tel/TG)", "Старт", "Завершение", "Ночей", "Взрослых", "Детей", "Всего гостей", "Итоговая стоимость", "Статус оплаты" ],
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
  variablesHeaders: ["Плейсхолдер", "Системный ключ", "Описание переменной", "Значение по умолчанию"]
};

const initializeSpreadsheet = async () => {
  console.log('Начинаем инициализацию Google Sheets...');
  if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || process.env.GOOGLE_SPREADSHEET_ID === "your_google_sheet_id") {
    console.warn('⚠️ ОШИБКА: Отсутствуют ключи Google API. Инициализация БД пропущена.');
    return process.exit(0);
  }
  
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: { client_email: process.env.GOOGLE_CLIENT_EMAIL.trim(), private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n').trim() },
      scopes: ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/spreadsheets']
    });
    const sheets = google.sheets({ version: 'v4', auth });
    const drive = google.drive({ version: 'v3', auth });
    let spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    
    const ss = await sheets.spreadsheets.get({ spreadsheetId });
    const existingTitles = ss.data.sheets.map(s => s.properties.title);
    
    const allSheetConfigs = [
        { title: GOOGLE_CONFIG.homePageSheetName, headers: GOOGLE_CONFIG.homeHeaders },
        { title: GOOGLE_CONFIG.masterSheetName, headers: GOOGLE_CONFIG.masterHeaders },
        { title: GOOGLE_CONFIG.calendarSettingsSheetName, headers: GOOGLE_CONFIG.calendarSettingsHeaders },
        { title: GOOGLE_CONFIG.sheetName, headers: GOOGLE_CONFIG.headers },
        { title: GOOGLE_CONFIG.accountSheetName, headers: GOOGLE_CONFIG.accountHeaders },
        { title: GOOGLE_CONFIG.productsSheetName, headers: GOOGLE_CONFIG.productsHeaders },
        { title: GOOGLE_CONFIG.coursesSheetName, headers: GOOGLE_CONFIG.coursesHeaders },
        { title: GOOGLE_CONFIG.gallerySheetName, headers: GOOGLE_CONFIG.galleryHeaders },
        { title: GOOGLE_CONFIG.aboutSheetName, headers: GOOGLE_CONFIG.aboutHeaders },
        { title: GOOGLE_CONFIG.legalSheetName, headers: GOOGLE_CONFIG.legalHeaders },
        { title: GOOGLE_CONFIG.templatesSheetName, headers: GOOGLE_CONFIG.templatesHeaders },
        { title: GOOGLE_CONFIG.variablesSheetName, headers: GOOGLE_CONFIG.variablesHeaders }
    ];
    
    const sheetsToCreate = allSheetConfigs.filter(config => !existingTitles.includes(config.title));
    if (sheetsToCreate.length > 0) {
        const addRequests = sheetsToCreate.map(sheetDef => ({ addSheet: { properties: { title: sheetDef.title } } }));
        await sheets.spreadsheets.batchUpdate({ spreadsheetId, requestBody: { requests: addRequests } });
    }
    
    const updatedSs = await sheets.spreadsheets.get({ spreadsheetId });
    const formatRequests = [];
    const dataAppendRequests = [];
    const safeFormulasToInject = [];
    
    for (const config of allSheetConfigs) {
        const sheet = updatedSs.data.sheets.find(s => s.properties.title === config.title);
        if (sheet) {
            const sheetId = sheet.properties.sheetId;
            const db = await sheets.spreadsheets.values.get({ spreadsheetId, range: `'${config.title}'!A:A` });
            if (!db.data.values || db.data.values.length === 0) {
                // Создание заголовков без формул (VSTACK удален)
                formatRequests.push({ updateCells: { range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: config.headers.length }, rows: [{ values: config.headers.map((h, i) => {
                    return { userEnteredValue: { stringValue: h }, userEnteredFormat: { backgroundColor: { red: 0.15, green: 0.20, blue: 0.28 }, textFormat: { bold: true, fontSize: 11, foregroundColor: { red: 1, green: 1, blue: 1 } }, horizontalAlignment: 'CENTER', verticalAlignment: 'MIDDLE', wrapStrategy: 'WRAP' } };
                }) }], fields: 'userEnteredValue,userEnteredFormat' } });
                formatRequests.push({ updateSheetProperties: { properties: { sheetId, gridProperties: { frozenRowCount: 1 } }, fields: 'gridProperties.frozenRowCount' } });
                
                // Подготовка инъекции чистых MAP формул со второй строки (Устранение зацикливания - Задача 5.1)
                if (config.title === GOOGLE_CONFIG.productsSheetName || config.title === GOOGLE_CONFIG.coursesSheetName) {
                    safeFormulasToInject.push({ range: `'${config.title}'!D2`, values: [['=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "ru"; "en"))))']] });
                    safeFormulasToInject.push({ range: `'${config.title}'!F2`, values: [['=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "ru"; "tr"))))']] });
                }
                if (config.title === GOOGLE_CONFIG.homePageSheetName || config.title === GOOGLE_CONFIG.aboutSheetName || config.title === GOOGLE_CONFIG.legalSheetName) {
                    safeFormulasToInject.push({ range: `'${config.title}'!C2`, values: [['=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "ru"; "en"))))']] });
                    safeFormulasToInject.push({ range: `'${config.title}'!D2`, values: [['=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "ru"; "tr"))))']] });
                }
                
                if (config.title === GOOGLE_CONFIG.masterSheetName) {
                    dataAppendRequests.push({ range: `${config.title}!A2:M2`, values: [["Aleksei Z", "", "", "", "admin@villaturaman.com", "admin", "admin123", "Главный", "Да", "Да", "Да", "Да", "Да"]] });
                }
            }
        }
    }
    
    if (formatRequests.length > 0) await sheets.spreadsheets.batchUpdate({ spreadsheetId, requestBody: { requests: formatRequests } });
    for (const req of dataAppendRequests) await sheets.spreadsheets.values.update({ spreadsheetId, range: req.range, valueInputOption: 'USER_ENTERED', requestBody: { values: req.values } });
    for (const req of safeFormulasToInject) await sheets.spreadsheets.values.update({ spreadsheetId, range: req.range, valueInputOption: 'USER_ENTERED', requestBody: { values: req.values } });
    
    console.log('✅ Инициализация Google Sheets успешно завершена.');
  } catch (error) { console.error('❌ Ошибка инициализации:', error.message); }
};
initializeSpreadsheet();

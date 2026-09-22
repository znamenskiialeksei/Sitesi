// ==============================================================================
// ИНИЦИАЛИЗАЦИЯ И СТРУКТУРИРОВАНИЕ GOOGLE SHEETS CRM
// Файл: scripts/init-google-sheets.js
// Назначение: Создание листов, стилизация шапок и инъекция канонических формул
// автоперевода (строго с точкой с запятой ';' для русской локали Google Таблиц).
// ==============================================================================

require('dotenv').config({ path: '.env.local' });
const { google } = require('googleapis');
const { SHEETS_REGISTRY, getLiveSheetMap, resolveRange } = require('../utils/sheetsRegistry');
const { SMART_TEMPLATES } = require('../utils/templatesData');
const {
  MASTER_ABOUT_SECTIONS,
  MASTER_SETTINGS_ROWS,
  MASTER_HOME_MAP,
  MASTER_HOME_ROWS,
  MASTER_TASKS_ROWS,
  MASTER_SERVICES_ROWS,
  MASTER_GUIDES_ROWS,
  MASTER_CALENDAR_ROWS,
  MASTER_KNOWLEDGE_GRAPH_ROWS
} = require('../utils/masterSeedContent');

// Конфигурация структуры базы данных Google Таблиц
const GOOGLE_CONFIG = {
  parentFolderId: '11xBSWA02NypliPFbziRSMfC9aAPclYF_',
  spreadsheetName: 'VillaTuramanWebSitePlatform_DB',
  sheetName: '📋 Заявки и Бронирования',
  homePageSheetName: '🏠 Главная витрина',
  accountSheetName: '👤 Гостевые аккаунты',
  masterSheetName: '🔑 Управление доступом',
  calendarSettingsSheetName: '📅 Календарь и Тарифы',
  productsSheetName: '🛎️ Дополнительные услуги',
  coursesSheetName: '🗺️ Видео-путеводители',
  studentsSheetName: '🎟️ Доступы к путеводителям',
  ordersSheetName: '💳 Заказы услуг и гидов',
  gallerySheetName: '📸 Фото и Видео Галерея',
  aboutSheetName: '📖 О вилле и Правила',
  legalSheetName: '⚖️ Юридические документы',
  templatesSheetName: '💬 Шаблоны сообщений',
  variablesSheetName: '⚙️ Системные настройки ИИ Агентов',
  tasksSheetName: '📋 Задачи и Поручения Секретаря',
  knowledgeGraphSheetName: '🧠 Граф Знаний и Безопасность',

  homeHeaders: ['Ключ [ID]', 'RU', 'EN', 'TR', 'Медиа/Картинка'],
  headers: [
    'Дата заявки',
    'Имя клиента',
    'Контакт [Tel/TG]',
    'Старт',
    'Завершение',
    'Ночей',
    'Взрослых',
    'Детей',
    'Всего гостей',
    'Итоговая стоимость',
    'Статус оплаты'
  ],
  accountHeaders: ['Дата регистрации', 'Имя', 'Контакт [Логин]', 'Пароль', 'Блок: Сайт', 'Блок: Аккаунт', 'Блок: Чат'],
  masterHeaders: [
    'ФИО',
    'Телефон',
    'Telegram',
    'WhatsApp',
    'Google Email',
    'Логин',
    'Пароль',
    'Роль',
    'Прав: Финансы',
    'Прав: Периоды',
    'Прав: Блок. дат',
    'Прав: Окно брони',
    'Прав: Доступ к чатам'
  ],
  calendarSettingsHeaders: [
    'Дата старта',
    'Дата завершения',
    'Тип [Блокировка/Цена/Мин. дней/Заметка/Тип записи/Настройки]',
    'Значение',
    'Заметка',
    'Автор изменения',
    'Время фиксации'
  ],
  chatHeaders: ['Дата и Время', 'Отправитель', 'Оригинал', 'RU', 'EN', 'TR', 'Ссылка на вложение'],
  productsHeaders: [
    'ID',
    'Название услуги [RU]',
    'Описание [RU]',
    'Название услуги [EN]',
    'Описание [EN]',
    'Название услуги [TR]',
    'Описание [TR]',
    'Цена [USD]',
    'Цена [EUR]',
    'Цена [RUB]',
    'Цена [TRY]',
    'Изображения [через запятую]',
    'Наличие [Да/Нет]',
    'Тип [Услуга/Пакет]',
    'Видео презентации [через запятую]',
    'Подробное описание [RU]',
    'Подробное описание [EN]',
    'Подробное описание [TR]'
  ],
  coursesHeaders: [
    'ID',
    'Название путеводителя [RU]',
    'Описание [RU]',
    'Название путеводителя [EN]',
    'Описание [EN]',
    'Название путеводителя [TR]',
    'Описание [TR]',
    'Изображения [через запятую]',
    'Категория',
    'Ссылка на видео',
    'Цена [USD]',
    'Цена [EUR]',
    'Цена [RUB]',
    'Цена [TRY]',
    'Видео презентации [через запятую]',
    'Подробное описание [RU]',
    'Подробное описание [EN]',
    'Подробное описание [TR]'
  ],
  studentsHeaders: ['Дата', 'Гость [Контакт]', 'Гид ID', 'Категория', 'Статус оплаты', 'Доступ [Да/Нет]', 'Прогресс'],
  ordersHeaders: ['Дата заказа', 'Контакт', 'Тип [Гид/Услуга/Аренда]', 'Сумма', 'Статус оплаты', 'Детали'],
  galleryHeaders: [
    'ID',
    'Группа [RU]',
    'Описание группы [RU]',
    'Группа [EN]',
    'Описание группы [EN]',
    'Группа [TR]',
    'Описание группы [TR]',
    'Тип [Фото/Видео/Карусель]',
    'Медиа [ссылки/iframes через запятую]',
    'Подпись [RU]',
    'Подпись [EN]',
    'Подпись [TR]'
  ],
  aboutHeaders: ['ID Раздела', 'Название [RU]', 'Название [EN]', 'Название [TR]', 'Текст [RU]', 'Текст [EN]', 'Текст [TR]'],
  legalHeaders: ['ID Раздела', 'Название [RU]', 'Название [EN]', 'Название [TR]', 'Текст [RU]', 'Текст [EN]', 'Текст [TR]'],
  templatesHeaders: ['ID Раздела', 'Название [RU]', 'Название [EN]', 'Название [TR]', 'Текст [RU]', 'Текст [EN]', 'Текст [TR]'],
  variablesHeaders: ['Плейсхолдер', 'Системный ключ', 'Описание переменной', 'Значение по умолчанию [Тест]'],
  tasksHeaders: ['ID Задачи', 'Дата и Время', 'Канал / Источник', 'Текст Задачи / Поручения', 'Статус Исполнения', 'Ответственный Модуль', 'Результат / Заметка'],
  knowledgeGraphHeaders: ['ID Узла', 'Тип Сущности', 'Уровень Секретности', 'Разрешенные Стадии Гостя', 'Связанный Лист CRM', 'Описание Сущности / Правило Доступа', 'Статус Узла']
};

const initializeSpreadsheet = async () => {
  console.log('Начинаем инициализацию структуры Google Sheets...');

  const clientEmail = (process.env.GOOGLE_CLIENT_EMAIL || '').trim();
  const rawKey = (process.env.GOOGLE_PRIVATE_KEY || '').trim();
  const spreadsheetId = (process.env.GOOGLE_SPREADSHEET_ID || '').trim();

  // Проверка на отсутствующие или демонстрационные (placeholder) учетные данные
  const isPlaceholder =
    !clientEmail ||
    !rawKey ||
    !spreadsheetId ||
    spreadsheetId === 'your_google_sheet_id' ||
    clientEmail.includes('your-service-account-email') ||
    rawKey.includes('YOUR_PRIVATE_KEY');

  if (isPlaceholder) {
    console.log('ℹ️ В .env.local указаны демонстрационные ключи (YOUR_PRIVATE_KEY).');
    console.log(`   Таблица ID: ${spreadsheetId || '1ESfaH3FBOx-Z0Z1CKU8-c1cQZCE2YjJBiTvX0MV0A5Q'}`);
    console.log('   Для авто-создания и форматирования 14 листов в Google Таблице:');
    console.log('   1. Создайте сервисный аккаунт в Google Cloud Console');
    console.log('   2. Предоставьте ему доступ "Редактор" к вашей Google Таблице');
    console.log('   3. Внесите реальный client_email и private_key в .env.local.');
    return;
  }

  // Универсальный парсер PEM-ключа: обрабатывает все форматы .env файла
  const parsePrivateKey = (raw) => {
    if (!raw) return '';
    let key = raw;
    key = key.replace(/^["']|["']$/g, '');
    key = key.replace(/\\\\n/g, '\n').replace(/\\n/g, '\n');
    key = key.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    return key.trim();
  };

  const parsedKey = parsePrivateKey(rawKey);

  if (!parsedKey.includes('-----BEGIN PRIVATE KEY-----') || parsedKey.length < 200) {
    console.warn('⚠️ GOOGLE_PRIVATE_KEY в .env.local не является валидным PEM-ключом RSA.');
    return;
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: parsedKey
      },
      scopes: ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    // Считываем список существующих листов
    const ss = await sheets.spreadsheets.get({ spreadsheetId });
    const existingSheets = ss.data.sheets || [];
    const existingTitles = existingSheets.map((s) => s.properties.title.trim());

    // Очистка устаревших англоязычных листов-дубликатов
    const deleteOldRequests = [];
    const obsoleteEnglishTitles = ['bookingrequests', 'placeholders', 'videoguides', 'extraservices', 'about', 'legal', 'templates', 'variables'];
    for (const sheet of existingSheets) {
      const lower = sheet.properties.title.trim().toLowerCase();
      if (obsoleteEnglishTitles.includes(lower)) {
        console.log(`Обнаружен устаревший лист [${sheet.properties.title}]. Удаляем...`);
        deleteOldRequests.push({ deleteSheet: { sheetId: sheet.properties.sheetId } });
      }
    }

    if (deleteOldRequests.length > 0) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: { requests: deleteOldRequests }
      });
      console.log(`Ликвидировано устаревших листов-дубликатов: ${deleteOldRequests.length}`);
    }

    // 15 листов из реестра SHEETS_REGISTRY с поддержкой алиасов
    const allSheetConfigs = Object.values(SHEETS_REGISTRY).map((cfg) => ({
      key: cfg.key,
      title: cfg.defaultName,
      aliases: cfg.aliases,
      headers: cfg.headers
    }));

    // 1. Создание недостающих листов [проверка по названию и всем алиасам]
    const sheetsToCreate = allSheetConfigs.filter((config) => {
      return !existingTitles.some((title) =>
        config.aliases.some((alias) => alias.toLowerCase() === title.toLowerCase())
      );
    });

    if (sheetsToCreate.length > 0) {
      const addRequests = sheetsToCreate.map((sheetDef) => ({
        addSheet: { properties: { title: sheetDef.title } }
      }));
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: { requests: addRequests }
      });
      console.log(`Создано новых листов: ${sheetsToCreate.length}`);
    }

    const updatedSs = await sheets.spreadsheets.get({ spreadsheetId });
    const formatRequests = [];
    const dataAppendRequests = [];
    const safeFormulasToInject = [];

    for (const config of allSheetConfigs) {
      // Поиск листа по точному совпадению или любому алиасу
      const sheet = updatedSs.data.sheets.find((s) => {
        const title = s.properties.title.trim();
        return config.aliases.some((alias) => alias.toLowerCase() === title.toLowerCase());
      });

      if (sheet) {
        const actualTitle = sheet.properties.title;
        const sheetId = sheet.properties.sheetId;
        const db = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: `'${actualTitle}'!A:A`
        });

        const rowCount = (db.data.values || []).length;

        if (rowCount <= 1) {
          if (rowCount === 0) {
            // Форматирование закрепленной темной шапки таблицы
            formatRequests.push({
            updateCells: {
              range: {
                sheetId,
                startRowIndex: 0,
                endRowIndex: 1,
                startColumnIndex: 0,
                endColumnIndex: config.headers.length
              },
              rows: [
                {
                  values: config.headers.map((h) => ({
                    userEnteredValue: { stringValue: h },
                    userEnteredFormat: {
                      backgroundColor: { red: 0.15, green: 0.2, blue: 0.28 },
                      textFormat: { bold: true, fontSize: 11, foregroundColor: { red: 1, green: 1, blue: 1 } },
                      horizontalAlignment: 'CENTER',
                      verticalAlignment: 'MIDDLE',
                      wrapStrategy: 'WRAP'
                    }
                  }))
                }
              ],
              fields: 'userEnteredValue,userEnteredFormat'
            }
          });

          // Закрепление первой строки (Frozen row)
          formatRequests.push({
            updateSheetProperties: {
              properties: { sheetId, gridProperties: { frozenRowCount: 1 } },
              fields: 'gridProperties.frozenRowCount'
            }
          });

          // Смарт-форматирование ячеек данных: перенос слов (WRAP) и вертикальное центрирование
          formatRequests.push({
            repeatCell: {
              range: {
                sheetId,
                startRowIndex: 1,
                endRowIndex: 100,
                startColumnIndex: 0,
                endColumnIndex: config.headers.length
              },
              cell: {
                userEnteredFormat: {
                  wrapStrategy: 'WRAP',
                  verticalAlignment: 'MIDDLE'
                }
              },
              fields: 'userEnteredFormat(wrapStrategy,verticalAlignment)'
            }
          });

          // Авто-подгонка оптимальной ширины столбцов под длину содержимого (autoResizeDimensions)
          formatRequests.push({
            autoResizeDimensions: {
              dimensions: {
                sheetId,
                dimension: 'COLUMNS',
                startIndex: 0,
                endIndex: config.headers.length
              }
            }
          });
        }

          // ВАЖНО: Канонический синтаксис формул Google Sheets со СТРОГОЙ ТОЧКОЙ С ЗАПЯТОЙ (;)
          // В русскоязычной локали Google Таблиц разделителем аргументов ВСЕГДА является точка с запятой (;).
          if (config.key === 'SERVICES') {
            // Перевод названий [B -> D, F]
            safeFormulasToInject.push({ range: `'${actualTitle}'!D2`, values: [['=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
            safeFormulasToInject.push({ range: `'${actualTitle}'!F2`, values: [['=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });
            // Перевод кратких описаний [C -> E, G]
            safeFormulasToInject.push({ range: `'${actualTitle}'!E2`, values: [['=MAP(C2:C; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
            safeFormulasToInject.push({ range: `'${actualTitle}'!G2`, values: [['=MAP(C2:C; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });
            // Перевод подробных описаний [P -> Q, R]
            safeFormulasToInject.push({ range: `'${actualTitle}'!Q2`, values: [['=MAP(P2:P; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
            safeFormulasToInject.push({ range: `'${actualTitle}'!R2`, values: [['=MAP(P2:P; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });

            // Посев 18-колоночного каталога услуг с ценой USD
            if (MASTER_SERVICES_ROWS) {
              dataAppendRequests.push({
                range: `'${actualTitle}'!A2:R${MASTER_SERVICES_ROWS.length + 1}`,
                values: MASTER_SERVICES_ROWS
              });
            }
          }

          if (config.key === 'GUIDES') {
            safeFormulasToInject.push({ range: `'${actualTitle}'!D2`, values: [['=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
            safeFormulasToInject.push({ range: `'${actualTitle}'!F2`, values: [['=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });
            safeFormulasToInject.push({ range: `'${actualTitle}'!E2`, values: [['=MAP(C2:C; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
            safeFormulasToInject.push({ range: `'${actualTitle}'!G2`, values: [['=MAP(C2:C; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });
            safeFormulasToInject.push({ range: `'${actualTitle}'!Q2`, values: [['=MAP(P2:P; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
            safeFormulasToInject.push({ range: `'${actualTitle}'!R2`, values: [['=MAP(P2:P; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });

            // Посев 18-колоночного каталога путеводителей с ценой USD
            if (MASTER_GUIDES_ROWS) {
              dataAppendRequests.push({
                range: `'${actualTitle}'!A2:R${MASTER_GUIDES_ROWS.length + 1}`,
                values: MASTER_GUIDES_ROWS
              });
            }
          }

          if (config.key === 'GALLERY') {
            safeFormulasToInject.push({ range: `'${actualTitle}'!D2`, values: [['=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
            safeFormulasToInject.push({ range: `'${actualTitle}'!F2`, values: [['=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });
            safeFormulasToInject.push({ range: `'${actualTitle}'!E2`, values: [['=MAP(C2:C; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
            safeFormulasToInject.push({ range: `'${actualTitle}'!G2`, values: [['=MAP(C2:C; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });
            safeFormulasToInject.push({ range: `'${actualTitle}'!K2`, values: [['=MAP(J2:J; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
            safeFormulasToInject.push({ range: `'${actualTitle}'!L2`, values: [['=MAP(J2:J; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });

            // Посев начальной фото и видео галереи
            dataAppendRequests.push({
              range: `'${actualTitle}'!A2:J7`,
              values: [
                ['gal-1', 'Бассейн и лаунж-терраса', 'Кристально чистый бассейн глубиной 1.5м с шезлонгами', '', '', '', '', 'Фото', 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=1600,https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=1600', 'Приватный бассейн виллы с удобными шезлонгами'],
                ['gal-2', 'Бассейн и лаунж-терраса', 'Кристально чистый бассейн глубиной 1.5м с шезлонгами', '', '', '', '', 'Фото', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1600', 'Затененная пергола для послеобеденного отдыха'],
                ['gal-3', 'Интерьер виллы и спальни', '4 просторные мастер-спальни с индивидуальными ванными', '', '', '', '', 'Фото', 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1600,https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1600', 'Мастер-спальня №1 с кроватью King-Size и террасой'],
                ['gal-4', 'Интерьер виллы и спальни', '4 просторные мастер-спальни с индивидуальными ванными', '', '', '', '', 'Фото', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600', 'Светлая гостиная со Smart TV 65"'],
                ['gal-5', 'Кухня и зона BBQ', 'Полностью оборудованная кухня со всей бытовой техникой', '', '', '', '', 'Фото', 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1600', 'Кухня шеф-повара с посудомоечной машиной и кофемашиной'],
                ['gal-6', 'Окрестности Дальяна и река', 'Уникальная природа: Ликийские гробницы и пляж Изтузу', '', '', '', '', 'Фото', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600', 'Ликийские скальные гробницы IV века до н.э. с подсветкой']
              ]
            });
          }

          if (config.key === 'HOME') {
            const colsA_D = MASTER_HOME_ROWS.map((r) => [r[0], r[1], r[2], r[3]]);
            const colsG_H = MASTER_HOME_ROWS.map((r) => [r[6] || '', r[7] || 'Вкл']);

            dataAppendRequests.push({
              range: `'${actualTitle}'!A2:D${colsA_D.length + 1}`,
              values: colsA_D
            });
            dataAppendRequests.push({
              range: `'${actualTitle}'!G2:H${colsG_H.length + 1}`,
              values: colsG_H
            });

            safeFormulasToInject.push({ range: `'${actualTitle}'!E2`, values: [['=MAP(D2:D; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
            safeFormulasToInject.push({ range: `'${actualTitle}'!F2`, values: [['=MAP(D2:D; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });
          }

          if (config.key === 'LEGAL' || config.key === 'TEMPLATES') {
            safeFormulasToInject.push({ range: `'${actualTitle}'!C2`, values: [['=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
            safeFormulasToInject.push({ range: `'${actualTitle}'!D2`, values: [['=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });
            safeFormulasToInject.push({ range: `'${actualTitle}'!F2`, values: [['=MAP(E2:E; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
            safeFormulasToInject.push({ range: `'${actualTitle}'!G2`, values: [['=MAP(E2:E; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });

            if (config.key === 'LEGAL') {
              dataAppendRequests.push({
                range: `'${actualTitle}'!A2:E11`,
                values: [
                  ['company_name', 'Организация', '', '', 'ALEKSEI ZNAMENSKII - Villa Turaman'],
                  ['tax_info', 'Налоговый номер', '', '', 'Ortaca Vergi Dairesi, VKN: 9991120181'],
                  ['contact_email', 'Email', '', '', 'villaturaman@gmail.com'],
                  ['contract', 'Договор аренды', '', '', 'Договор краткосрочной аренды Villa Turaman [Дальян, Мугла, Турция]. Владелец: Aleksei Znamenskii [VKN: 9991120181].'],
                  ['footerDesc', 'О Villa Turaman', '', '', 'Премиальная частная вилла в Дальяне [Турция]. Прямое бронирование от владельца Алексея Знаменского без скрытых комиссий сторонних агрегаторов.'],
                  ['footerLocation', 'Адрес', '', '', 'Дальян, Ортаджа, Мугла, Турция'],
                  ['etbis_placeholder', 'QR-код ETBIS', '', '', 'ETBIS QR CODE\nVKN: 9991120181'],
                  ['etbis_text', 'Госреестр ETBIS', '', '', "ETBİS'e Kayıtlıdır"],
                  ['kvkk', 'Политика KVKK', '', '', 'Полный текст политики защиты персональных данных [KVKK Aydınlatma Metni]...'],
                  ['privacy', 'Конфиденциальность', '', '', 'Политика конфиденциальности персональных данных гостей виллы...']
                ]
              });
            }
          }

          if (config.key === 'SETTINGS') {
            dataAppendRequests.push({
              range: `'${actualTitle}'!A2:E${MASTER_SETTINGS_ROWS.length + 1}`,
              values: MASTER_SETTINGS_ROWS
            });
          }

          // Добавление учетной записи суперадмина по умолчанию
          if (config.key === 'MASTER') {
            dataAppendRequests.push({
              range: `'${actualTitle}'!A2:M2`,
              values: [
                ['Aleksei Z', '', '', '', 'admin@villaturaman.com', 'admin', 'admin123', 'Главный', 'Да', 'Да', 'Да', 'Да', 'Да']
              ]
            });
          }

          // Добавление полного словаря переменных и плейсхолдеров
          if (config.key === 'VARIABLES') {
            dataAppendRequests.push({
              range: `'${actualTitle}'!A2:D13`,
              values: [
                ['[FIRST_NAME]', 'name', 'Имя гостя', 'Иван'],
                ['[CONFIRMATION_CODE]', 'code', 'Код бронирования', 'VT-7788'],
                ['[CHECKIN_DATE]', 'checkIn', 'Дата заезда', '01.06.2026'],
                ['[CHECKOUT_DATE]', 'checkOut', 'Дата выезда', '08.06.2026'],
                ['[CHECKIN_TIME]', 'checkInTime', 'Стандартное время заезда', '16:00'],
                ['[CHECKOUT_TIME]', 'checkOutTime', 'Стандартное время выезда', '10:00'],
                ['[BOOKING_PLATFORM_NAME]', 'platform', 'Платформа бронирования', 'Villa Turaman Direct'],
                ['[ADDRESS]', 'address', 'Точный адрес виллы', 'Дальян, Ортаджа, Мугла, Турция'],
                ['[CHECKIN_METHOD]', 'checkinMethod', 'Способ передачи ключей', 'Мини-сейф с кодом / личная встреча владельцем'],
                ['[WIFI_NAME]', 'wifiName', 'Имя сети Wi-Fi', 'VillaTuraman_5G'],
                ['[WIFI_PASSWORD]', 'wifiPassword', 'Пароль сети Wi-Fi', 'DalyanTuramanGuest2026'],
                ['[KEY_HANDOVER_INSTRUCTIONS]', 'keyHandover', 'Инструкции возврата ключей', 'Оставьте ключи в мини-сейфе с кодом у входной двери виллы']
              ]
            });
          }

          // Добавление полного сборника 14 умных шаблонов сообщений на трех языках
          if (config.key === 'TEMPLATES') {
            const templateRows = SMART_TEMPLATES.map((tmpl) => [
              tmpl.id,
              tmpl.title.ru,
              tmpl.title.en,
              tmpl.title.tr,
              tmpl.text.ru,
              tmpl.text.en,
              tmpl.text.tr
            ]);
            dataAppendRequests.push({
              range: `'${actualTitle}'!A2:G${templateRows.length + 1}`,
              values: templateRows
            });
          }

          // Посев эталонных задач и поручений секретаря
          if (config.key === 'TASKS' && MASTER_TASKS_ROWS) {
            dataAppendRequests.push({
              range: `'${actualTitle}'!A2:G${MASTER_TASKS_ROWS.length + 1}`,
              values: MASTER_TASKS_ROWS
            });
          }

          // Посев онтологического графа знаний и правил безопасности
          if (config.key === 'KNOWLEDGE_GRAPH' && MASTER_KNOWLEDGE_GRAPH_ROWS) {
            dataAppendRequests.push({
              range: `'${actualTitle}'!A2:G${MASTER_KNOWLEDGE_GRAPH_ROWS.length + 1}`,
              values: MASTER_KNOWLEDGE_GRAPH_ROWS
            });
          }

          // Посев календаря и тарифов с ручными настройками хозяина
          if (config.key === 'CALENDAR' && MASTER_CALENDAR_ROWS) {
            dataAppendRequests.push({
              range: `'${actualTitle}'!A2:G${MASTER_CALENDAR_ROWS.length + 1}`,
              values: MASTER_CALENDAR_ROWS
            });
          }
        }
      }
    }

    // Применение форматирования и структуры
    if (formatRequests.length > 0) {
      await sheets.spreadsheets.batchUpdate({ spreadsheetId, requestBody: { requests: formatRequests } });
    }

    // Заполнение начальных данных единым пакетом (batchUpdate для экономии квоты)
    if (dataAppendRequests.length > 0) {
      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId,
        requestBody: {
          valueInputOption: 'USER_ENTERED',
          data: dataAppendRequests.map((req) => ({
            range: req.range,
            values: req.values
          }))
        }
      });
    }

    // Безопасное внедрение формул авто-перевода со СТРОГОЙ ТОЧКОЙ С ЗАПЯТОЙ (;) единым batchUpdate
    if (safeFormulasToInject.length > 0) {
      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId,
        requestBody: {
          valueInputOption: 'USER_ENTERED',
          data: safeFormulasToInject.map((req) => ({
            range: req.range,
            values: req.values
          }))
        }
      });
    }

    // --- Инициализация и смарт-форматирование таблицы чатов GOOGLE_CHATS_SPREADSHEET_ID ---
    const chatsSpreadsheetId = process.env.GOOGLE_CHATS_SPREADSHEET_ID;
    if (chatsSpreadsheetId) {
      console.log('💬 Проверка и смарт-форматирование таблицы чатов...');
      try {
        const chatMeta = await sheets.spreadsheets.get({ spreadsheetId: chatsSpreadsheetId });
        const chatSheets = (chatMeta.data.sheets || []).filter((s) => s.properties.title.startsWith('Chat_'));

        for (const s of chatSheets) {
          const sheetTitle = s.properties.title;
          const sheetId = s.properties.sheetId;

          let firstRow = [];
          try {
            const checkRows = await sheets.spreadsheets.values.get({
              spreadsheetId: chatsSpreadsheetId,
              range: `'${sheetTitle}'!A1:G1`
            });
            firstRow = (checkRows.data.values && checkRows.data.values[0]) || [];
          } catch (e) {
            firstRow = [];
          }

          const requests = [];

          // Если первой строки с заголовками нет, вставляем строку на позицию 0
          if (!firstRow || firstRow[0] !== 'Дата и Время') {
            requests.push({
              insertDimension: {
                range: {
                  sheetId,
                  dimension: 'ROWS',
                  startIndex: 0,
                  endIndex: 1
                },
                inheritFromBefore: false
              }
            });
          }

          // Закрепление первой строки
          requests.push({
            updateSheetProperties: {
              properties: { sheetId, gridProperties: { frozenRowCount: 1 } },
              fields: 'gridProperties.frozenRowCount'
            }
          });

          // Стилизация шапки (темный фон, белый полужирный текст, центрирование)
          requests.push({
            updateCells: {
              start: { sheetId, rowIndex: 0, columnIndex: 0 },
              rows: [
                {
                  values: GOOGLE_CONFIG.chatHeaders.map((h) => ({
                    userEnteredValue: { stringValue: h },
                    userEnteredFormat: {
                      backgroundColor: { red: 0.12, green: 0.16, blue: 0.23 },
                      textFormat: { bold: true, fontSize: 10, foregroundColor: { red: 1, green: 1, blue: 1 } },
                      horizontalAlignment: 'CENTER',
                      verticalAlignment: 'MIDDLE',
                      wrapStrategy: 'WRAP'
                    }
                  }))
                }
              ],
              fields: 'userEnteredValue,userEnteredFormat'
            }
          });

          // Настройка ячеек данных: перенос строк и вертикальное центрирование
          requests.push({
            repeatCell: {
              range: {
                sheetId,
                startRowIndex: 1,
                endRowIndex: 1000,
                startColumnIndex: 0,
                endColumnIndex: GOOGLE_CONFIG.chatHeaders.length
              },
              cell: {
                userEnteredFormat: {
                  wrapStrategy: 'WRAP',
                  verticalAlignment: 'MIDDLE'
                }
              },
              fields: 'userEnteredFormat(wrapStrategy,verticalAlignment)'
            }
          });

          // Автоподгонка ширины столбцов под длину содержимого
          requests.push({
            autoResizeDimensions: {
              dimensions: {
                sheetId,
                dimension: 'COLUMNS',
                startIndex: 0,
                endIndex: GOOGLE_CONFIG.chatHeaders.length
              }
            }
          });

          if (requests.length > 0) {
            await sheets.spreadsheets.batchUpdate({
              spreadsheetId: chatsSpreadsheetId,
              requestBody: { requests }
            });
          }
        }
        console.log(`✅ Таблица чатов: успешно проверено и отформатировано листов: ${chatSheets.length}`);
      } catch (chatInitErr) {
        console.warn('⚠️ Предупреждение при форматировании таблицы чатов:', chatInitErr.message);
      }
    }

    console.log('✅ Инициализация структуры Google Sheets успешно завершена.');
  } catch (error) {
    console.error('❌ Ошибка инициализации Google Sheets:', error.message);
  }
};

initializeSpreadsheet();


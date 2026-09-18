// ==============================================================================
// ИНИЦИАЛИЗАЦИЯ И СТРУКТУРИРОВАНИЕ GOOGLE SHEETS CRM
// Файл: scripts/init-google-sheets.js
// Назначение: Создание листов, стилизация шапок и инъекция канонических формул
// автоперевода (строго с запятыми ',' для исключения #ERROR! в русском интерфейсе).
// ==============================================================================

require('dotenv').config({ path: '.env.local' });
const { google } = require('googleapis');

// Конфигурация структуры базы данных Google Таблиц
const GOOGLE_CONFIG = {
  parentFolderId: '11xBSWA02NypliPFbziRSMfC9aAPclYF_',
  spreadsheetName: 'VillaTuramanWebSitePlatform_DB',
  sheetName: 'Вилла',
  homePageSheetName: 'HomePage',
  accountSheetName: 'Accounts',
  masterSheetName: 'MasterAccount',
  calendarSettingsSheetName: 'CalendarSettings',
  productsSheetName: 'ExtraServices',
  coursesSheetName: 'VideoGuides',
  studentsSheetName: 'GuestsAccess',
  ordersSheetName: 'ServiceOrders',
  gallerySheetName: 'Gallery',
  aboutSheetName: 'About',
  legalSheetName: 'Legal',
  templatesSheetName: 'Templates',
  variablesSheetName: 'Variables',

  homeHeaders: ['Ключ (ID)', 'RU', 'EN', 'TR', 'Медиа/Картинка'],
  headers: [
    'Дата заявки',
    'Имя клиента',
    'Контакт (Tel/TG)',
    'Старт',
    'Завершение',
    'Ночей',
    'Взрослых',
    'Детей',
    'Всего гостей',
    'Итоговая стоимость',
    'Статус оплаты'
  ],
  accountHeaders: ['Дата регистрации', 'Имя', 'Контакт (Логин)', 'Пароль', 'Блок: Сайт', 'Блок: Аккаунт', 'Блок: Чат'],
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
    'Тип (Блокировка/Цена/Мин. дней/Заметка/Тип записи/Настройки)',
    'Значение',
    'Заметка',
    'Автор изменения',
    'Время фиксации'
  ],
  chatHeaders: ['Дата и Время', 'Отправитель', 'Оригинал', 'RU', 'EN', 'TR', 'Ссылка на вложение'],
  productsHeaders: [
    'ID',
    'Название услуги (RU)',
    'Описание (RU)',
    'Название услуги (EN)',
    'Описание (EN)',
    'Название услуги (TR)',
    'Описание (TR)',
    'Цена (EUR)',
    'Цена (RUB)',
    'Цена (TRY)',
    'Изображения (через запятую)',
    'Наличие (Да/Нет)',
    'Тип (Услуга/Пакет)',
    'Видео презентации (через запятую)',
    'Подробное описание (RU)',
    'Подробное описание (EN)',
    'Подробное описание (TR)'
  ],
  coursesHeaders: [
    'ID',
    'Название путеводителя (RU)',
    'Описание (RU)',
    'Название путеводителя (EN)',
    'Описание (EN)',
    'Название путеводителя (TR)',
    'Описание (TR)',
    'Изображения (через запятую)',
    'Категория',
    'Ссылка на видео',
    'Цена (EUR)',
    'Цена (RUB)',
    'Цена (TRY)',
    'Видео презентации (через запятую)',
    'Подробное описание (RU)',
    'Подробное описание (EN)',
    'Подробное описание (TR)'
  ],
  studentsHeaders: ['Дата', 'Гость (Контакт)', 'Гид ID', 'Категория', 'Статус оплаты', 'Доступ (Да/Нет)', 'Прогресс'],
  ordersHeaders: ['Дата заказа', 'Контакт', 'Тип (Гид/Услуга/Аренда)', 'Сумма', 'Статус оплаты', 'Детали'],
  galleryHeaders: [
    'ID',
    'Группа (RU)',
    'Описание группы (RU)',
    'Группа (EN)',
    'Описание группы (EN)',
    'Группа (TR)',
    'Описание группы (TR)',
    'Тип (Фото/Видео/Карусель)',
    'Медиа (ссылки/iframes через запятую)',
    'Подпись (RU)',
    'Подпись (EN)',
    'Подпись (TR)'
  ],
  aboutHeaders: ['ID Раздела', 'Название (RU)', 'Название (EN)', 'Название (TR)', 'Текст (RU)', 'Текст (EN)', 'Текст (TR)'],
  legalHeaders: ['ID Раздела', 'Название (RU)', 'Название (EN)', 'Название (TR)', 'Текст (RU)', 'Текст (EN)', 'Текст (TR)'],
  templatesHeaders: ['ID Раздела', 'Название (RU)', 'Название (EN)', 'Название (TR)', 'Текст (RU)', 'Текст (EN)', 'Текст (TR)'],
  variablesHeaders: ['Плейсхолдер', 'Системный ключ', 'Описание переменной', 'Значение по умолчанию (Тест)']
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
    const existingTitles = ss.data.sheets.map((s) => s.properties.title);

    const allSheetConfigs = [
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

    // 1. Создание недостающих листов
    const sheetsToCreate = allSheetConfigs.filter((config) => !existingTitles.includes(config.title));
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
      const sheet = updatedSs.data.sheets.find((s) => s.properties.title === config.title);
      if (sheet) {
        const sheetId = sheet.properties.sheetId;
        const db = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: `'${config.title}'!A:A`
        });

        if (!db.data.values || db.data.values.length === 0) {
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

          // ВАЖНО: Канонический синтаксис формул Google Sheets API со строгими запятыми (',')
          // При записи с запятыми движок парсит формулу без ошибки, а в интерфейсе с русской локалью
          // автоматически подставляет точку с запятой (';').
          if (config.title === GOOGLE_CONFIG.productsSheetName) {
            // Перевод названий (B -> D, F)
            safeFormulasToInject.push({ range: `'${config.title}'!D2`, values: [['=MAP(B2:B, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "en"))))']] });
            safeFormulasToInject.push({ range: `'${config.title}'!F2`, values: [['=MAP(B2:B, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "tr"))))']] });
            // Перевод кратких описаний (C -> E, G)
            safeFormulasToInject.push({ range: `'${config.title}'!E2`, values: [['=MAP(C2:C, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "en"))))']] });
            safeFormulasToInject.push({ range: `'${config.title}'!G2`, values: [['=MAP(C2:C, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "tr"))))']] });
            // Перевод подробных описаний (O -> P, Q)
            safeFormulasToInject.push({ range: `'${config.title}'!P2`, values: [['=MAP(O2:O, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "en"))))']] });
            safeFormulasToInject.push({ range: `'${config.title}'!Q2`, values: [['=MAP(O2:O, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "tr"))))']] });

            // Посев начальных услуг
            dataAppendRequests.push({
              range: `${config.title}!A2:O7`,
              values: [
                ['prod-1', 'Индивидуальный VIP-трансфер из аэропорта Даламан (DLM)', 'Mercedes Vito с кондиционером и напитками', '', '', '', '', '50', '5000', '1800', 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200', 'Да', 'Услуга', '', 'Встреча в зоне прилета аэропорта Даламан (25 минут до виллы). В салоне Wi-Fi.'],
                ['prod-2', 'Приватный круиз на яхте по реке Дальян и пляжу Изтузу', 'Традиционная деревянная лодка: Ликийские гробницы и черепахи', '', '', '', '', '250', '25000', '9000', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200', 'Да', 'Пакет', '', 'Эксклюзивный маршрут на весь день со свежеприготовленным обедом от капитана.'],
                ['prod-3', 'Ужин от персонального шеф-повара на вилле', '4-курсовой ужин у бассейна: турецкие мезе и морепродукты', '', '', '', '', '120', '12000', '4300', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200', 'Да', 'Услуга', '', 'Шеф лично закупает фермерские продукты на рынке Дальяна и сервирует стол.'],
                ['prod-4', 'Премиальный BBQ-вечер на углях в саду', 'Стейки рибай, каре ягненка и овощи гриль', '', '', '', '', '160', '16000', '5800', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200', 'Да', 'Пакет', '', 'Включает угли, розжиг, маринованное фермерское мясо и мастера на 3 часа.'],
                ['prod-5', 'СПА-тур и грязевые источники Султание', 'Омолаживающие минеральные термы озера Кёйджегиз', '', '', '', '', '70', '7000', '2500', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200', 'Да', 'Услуга', '', 'Трансфер на моторной лодке от причала виллы. Входные билеты включены.'],
                ['prod-6', 'Аренда сапбордов (SUP) и каяков', '2 устойчивых SUP-борда и двухместный каяк', '', '', '', '', '80', '8000', '2900', 'https://images.unsplash.com/photo-1517404215738-15263e9f9178?w=1200', 'Да', 'Услуга', '', 'Доставка прямо к вилле на весь период проживания для утренних заплывов.']
              ]
            });
          }

          if (config.title === GOOGLE_CONFIG.coursesSheetName) {
            safeFormulasToInject.push({ range: `'${config.title}'!D2`, values: [['=MAP(B2:B, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "en"))))']] });
            safeFormulasToInject.push({ range: `'${config.title}'!F2`, values: [['=MAP(B2:B, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "tr"))))']] });
            safeFormulasToInject.push({ range: `'${config.title}'!E2`, values: [['=MAP(C2:C, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "en"))))']] });
            safeFormulasToInject.push({ range: `'${config.title}'!G2`, values: [['=MAP(C2:C, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "tr"))))']] });
            safeFormulasToInject.push({ range: `'${config.title}'!P2`, values: [['=MAP(O2:O, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "en"))))']] });
            safeFormulasToInject.push({ range: `'${config.title}'!Q2`, values: [['=MAP(O2:O, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "tr"))))']] });

            // Посев начальных путеводителей
            dataAppendRequests.push({
              range: `${config.title}!A2:O5`,
              values: [
                ['guide-1', 'Секретные маршруты реки Дальян и черепаший пляж Изтузу', 'Эксклюзивный 40-минутный 4K видео-гид от Алексея Знаменского', '', '', '', '', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200', 'Локации', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '20', '2000', '700', '', 'Где встретить гигантских черепах Caretta Caretta и как арендовать лодку со скидкой.'],
                ['guide-2', 'Ликийские скальные гробницы и древний город Каунос', 'Историческое погружение в тайны Ликийского царства и акрополя', '', '', '', '', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200', 'История', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '25', '2500', '900', '', 'Маршрут подъема к Кауносу, расшифровка надписей и лучшие видовые точки на закате.'],
                ['guide-3', 'Гастрономический гид: топ ресторанов и гранатовые сады', 'Где попробовать настоящую турецкую кухню и свежую рыбу', '', '', '', '', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200', 'Гастрономия', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '15', '1500', '550', '', 'Список 10 проверенных ресторанов со специальными привилегиями для гостей виллы.'],
                ['guide-4', 'Термальные источники Султание и озеро Кёйджегиз', 'Как получить максимум от целебных минеральных источников', '', '', '', '', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200', 'Здоровье', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '20', '2000', '700', '', 'Секретные часы посещения без туристических групп и рекомендации врачей.']
              ]
            });
          }

          if (config.title === GOOGLE_CONFIG.gallerySheetName) {
            safeFormulasToInject.push({ range: `'${config.title}'!D2`, values: [['=MAP(B2:B, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "en"))))']] });
            safeFormulasToInject.push({ range: `'${config.title}'!F2`, values: [['=MAP(B2:B, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "tr"))))']] });
            safeFormulasToInject.push({ range: `'${config.title}'!E2`, values: [['=MAP(C2:C, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "en"))))']] });
            safeFormulasToInject.push({ range: `'${config.title}'!G2`, values: [['=MAP(C2:C, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "tr"))))']] });
            safeFormulasToInject.push({ range: `'${config.title}'!K2`, values: [['=MAP(J2:J, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "en"))))']] });
            safeFormulasToInject.push({ range: `'${config.title}'!L2`, values: [['=MAP(J2:J, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "tr"))))']] });

            // Посев начальной фото и видео галереи
            dataAppendRequests.push({
              range: `${config.title}!A2:J7`,
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

          if (config.title === GOOGLE_CONFIG.homePageSheetName) {
            safeFormulasToInject.push({ range: `'${config.title}'!C2`, values: [['=MAP(B2:B, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "en"))))']] });
            safeFormulasToInject.push({ range: `'${config.title}'!D2`, values: [['=MAP(B2:B, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "tr"))))']] });

            dataAppendRequests.push({
              range: `${config.title}!A2:E6`,
              values: [
                ['heroTitle', 'Аренда Villa Turaman', '', '', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600'],
                ['heroSubtitle', 'Ваш идеальный отдых в Дальяне. Прямое бронирование виллы, премиальный сервис и авторские видео-путеводители от Алексея Знаменского.', '', '', ''],
                ['aboutTitle', 'О Вилле Turaman', '', '', ''],
                ['aboutText', 'Villa Turaman — это гармоничное сочетание уединения, современного комфорта и первоклассного сервиса для незабываемого отпуска в сердце Дальяна с собственным бассейном, просторным садом и панорамным видом на Ликийские скальные гробницы.', '', '', ''],
                ['heroImage', 'Главное фото фасада виллы', '', '', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600']
              ]
            });
          }

          if (config.title === GOOGLE_CONFIG.aboutSheetName || config.title === GOOGLE_CONFIG.legalSheetName || config.title === GOOGLE_CONFIG.templatesSheetName) {
            safeFormulasToInject.push({ range: `'${config.title}'!C2`, values: [['=MAP(B2:B, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "en"))))']] });
            safeFormulasToInject.push({ range: `'${config.title}'!D2`, values: [['=MAP(B2:B, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "tr"))))']] });
            safeFormulasToInject.push({ range: `'${config.title}'!F2`, values: [['=MAP(E2:E, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "en"))))']] });
            safeFormulasToInject.push({ range: `'${config.title}'!G2`, values: [['=MAP(E2:E, LAMBDA(val, IF(val="", "", GOOGLETRANSLATE(val, "ru", "tr"))))']] });

            if (config.title === GOOGLE_CONFIG.legalSheetName) {
              dataAppendRequests.push({
                range: `${config.title}!A2:E5`,
                values: [
                  ['company_name', 'Организация', '', '', 'ALEKSEI ZNAMENSKII - Villa Turaman'],
                  ['tax_info', 'Налоговый номер', '', '', 'Ortaca Vergi Dairesi, VKN: 9991120181'],
                  ['contact_email', 'Email', '', '', 'villaturaman@gmail.com'],
                  ['contract', 'Договор аренды', '', '', 'Договор краткосрочной аренды Villa Turaman (Дальян, Мугла, Турция). Владелец: Aleksei Znamenskii (VKN: 9991120181).']
                ]
              });
            }
          }

          // Добавление учетной записи суперадмина по умолчанию
          if (config.title === GOOGLE_CONFIG.masterSheetName) {
            dataAppendRequests.push({
              range: `${config.title}!A2:M2`,
              values: [
                ['Aleksei Z', '', '', '', 'admin@villaturaman.com', 'admin', 'admin123', 'Главный', 'Да', 'Да', 'Да', 'Да', 'Да']
              ]
            });
          }

          // Добавление стандартного словаря переменных и плейсхолдеров
          if (config.title === GOOGLE_CONFIG.variablesSheetName) {
            dataAppendRequests.push({
              range: `${config.title}!A2:D8`,
              values: [
                ['[FIRST_NAME]', 'name', 'Имя гостя', 'Иван'],
                ['[CHECKIN_DATE]', 'checkIn', 'Дата заезда', '01.05.2027'],
                ['[CHECKOUT_DATE]', 'checkOut', 'Дата выезда', '10.05.2027'],
                ['[CHECKIN_TIME]', 'checkInTime', 'Стандартное время заезда', '15:00'],
                ['[CHECKOUT_TIME]', 'checkOutTime', 'Стандартное время выезда', '11:00'],
                ['[GUESTS]', 'total_guests', 'Общее количество гостей', '4'],
                ['[PRICE]', 'totalPrice', 'Итоговая стоимость', '150000 RUB']
              ]
            });
          }

          // Добавление шаблонов сообщений по умолчанию
          if (config.title === GOOGLE_CONFIG.templatesSheetName) {
            dataAppendRequests.push({
              range: `${config.title}!A2:E3`,
              values: [
                ['welcome', 'Приветствие', '', '', 'Здравствуйте, [FIRST_NAME]! Добро пожаловать. Я владелец Виллы Тураман.'],
                ['confirmation', 'Подтверждение', '', '', 'Ваша заявка на бронирование [CHECKIN_DATE] — [CHECKOUT_DATE] принята.']
              ]
            });
          }
        }
      }
    }

    // Применение форматирования и структуры
    if (formatRequests.length > 0) {
      await sheets.spreadsheets.batchUpdate({ spreadsheetId, requestBody: { requests: formatRequests } });
    }

    // Заполнение начальных данных
    for (const req of dataAppendRequests) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: req.range,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: req.values }
      });
    }

    // Безопасное внедрение формул авто-перевода с запятыми
    for (const req of safeFormulasToInject) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: req.range,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: req.values }
      });
    }

    console.log('✅ Инициализация структуры Google Sheets успешно завершена.');
  } catch (error) {
    console.error('❌ Ошибка инициализации Google Sheets:', error.message);
  }
};

initializeSpreadsheet();


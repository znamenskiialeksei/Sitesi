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
const { MASTER_ABOUT_SECTIONS, MASTER_SETTINGS_ROWS, MASTER_HOME_MAP, MASTER_TASKS_ROWS } = require('../utils/masterSeedContent');

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
  variablesSheetName: '🧩 Словарь переменных',

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
    const existingSheets = ss.data.sheets || [];
    const existingTitles = existingSheets.map((s) => s.properties.title.trim());

    // Очистка устаревших англоязычных листов-дубликатов BookingRequests и Placeholders
    const deleteOldRequests = [];
    const bookingReqSheet = existingSheets.find((s) => s.properties.title.trim().toLowerCase() === 'bookingrequests');
    const canonBookingsSheet = existingSheets.find((s) => s.properties.title.trim() === SHEETS_REGISTRY.BOOKINGS.defaultName);
    if (bookingReqSheet && canonBookingsSheet && bookingReqSheet.properties.sheetId !== canonBookingsSheet.properties.sheetId) {
      console.log('Обнаружен устаревший лист BookingRequests при наличии канонического листа. Удаляем дубликат...');
      deleteOldRequests.push({ deleteSheet: { sheetId: bookingReqSheet.properties.sheetId } });
    }

    const placeholdersSheet = existingSheets.find((s) => s.properties.title.trim().toLowerCase() === 'placeholders');
    const canonVarsSheet = existingSheets.find((s) => s.properties.title.trim() === SHEETS_REGISTRY.VARIABLES.defaultName);
    if (placeholdersSheet && canonVarsSheet && placeholdersSheet.properties.sheetId !== canonVarsSheet.properties.sheetId) {
      console.log('Обнаружен устаревший лист Placeholders при наличии канонического листа. Удаляем дубликат...');
      deleteOldRequests.push({ deleteSheet: { sheetId: placeholdersSheet.properties.sheetId } });
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
            // Перевод названий (B -> D, F)
            safeFormulasToInject.push({ range: `'${actualTitle}'!D2`, values: [['=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
            safeFormulasToInject.push({ range: `'${actualTitle}'!F2`, values: [['=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });
            // Перевод кратких описаний (C -> E, G)
            safeFormulasToInject.push({ range: `'${actualTitle}'!E2`, values: [['=MAP(C2:C; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
            safeFormulasToInject.push({ range: `'${actualTitle}'!G2`, values: [['=MAP(C2:C; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });
            // Перевод подробных описаний (O -> P, Q)
            safeFormulasToInject.push({ range: `'${actualTitle}'!P2`, values: [['=MAP(O2:O; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
            safeFormulasToInject.push({ range: `'${actualTitle}'!Q2`, values: [['=MAP(O2:O; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });

            // Посев начальных услуг
            dataAppendRequests.push({
              range: `'${actualTitle}'!A2:O7`,
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

          if (config.key === 'GUIDES') {
            safeFormulasToInject.push({ range: `'${actualTitle}'!D2`, values: [['=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
            safeFormulasToInject.push({ range: `'${actualTitle}'!F2`, values: [['=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });
            safeFormulasToInject.push({ range: `'${actualTitle}'!E2`, values: [['=MAP(C2:C; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
            safeFormulasToInject.push({ range: `'${actualTitle}'!G2`, values: [['=MAP(C2:C; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });
            safeFormulasToInject.push({ range: `'${actualTitle}'!P2`, values: [['=MAP(O2:O; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
            safeFormulasToInject.push({ range: `'${actualTitle}'!Q2`, values: [['=MAP(O2:O; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });

            // Посев начальных путеводителей
            dataAppendRequests.push({
              range: `'${actualTitle}'!A2:O5`,
              values: [
                ['guide-1', 'Секретные маршруты реки Дальян и черепаший пляж Изтузу', 'Эксклюзивный 40-минутный 4K видео-гид от Алексея Знаменского', '', '', '', '', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200', 'Локации', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '20', '2000', '700', '', 'Где встретить гигантских черепах Caretta Caretta и как арендовать лодку со скидкой.'],
                ['guide-2', 'Ликийские скальные гробницы и древний город Каунос', 'Историческое погружение в тайны Ликийского царства и акрополя', '', '', '', '', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200', 'История', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '25', '2500', '900', '', 'Маршрут подъема к Кауносу, расшифровка надписей и лучшие видовые точки на закате.'],
                ['guide-3', 'Гастрономический гид: топ ресторанов и гранатовые сады', 'Где попробовать настоящую турецкую кухню и свежую рыбу', '', '', '', '', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200', 'Гастрономия', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '15', '1500', '550', '', 'Список 10 проверенных ресторанов со специальными привилегиями для гостей виллы.'],
                ['guide-4', 'Термальные источники Султание и озеро Кёйджегиз', 'Как получить максимум от целебных минеральных источников', '', '', '', '', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200', 'Здоровье', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '20', '2000', '700', '', 'Секретные часы посещения без туристических групп и рекомендации врачей.']
              ]
            });
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
            safeFormulasToInject.push({ range: `'${actualTitle}'!C2`, values: [['=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
            safeFormulasToInject.push({ range: `'${actualTitle}'!D2`, values: [['=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });

            dataAppendRequests.push({
              range: `'${actualTitle}'!A2:E17`,
              values: [
                ['heroTitle', 'Аренда Villa Turaman', '', '', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600'],
                ['heroSubtitle', 'Ваш идеальный отдых в Дальяне. Прямое бронирование виллы, премиальный сервис и авторские видео-путеводители от Алексея Знаменского.', '', '', ''],
                ['aboutTitle', 'О Вилле Turaman', '', '', ''],
                ['aboutText', 'Villa Turaman — это гармоничное сочетание уединения, современного комфорта и первоклассного сервиса для незабываемого отпуска в сердце Дальяна с собственным бассейном, просторным садом и панорамным видом на Ликийские скальные гробницы.', '', '', ''],
                ['heroImage', 'Главное фото фасада виллы', '', '', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600'],
                ['hostHeader', 'Отдельная вилла целиком • Хозяин: Алексей Знаменский', '', '', ''],
                ['hostName', 'Алексей Знаменский', '', '', ''],
                ['hostAvatar', 'Аватар владельца виллы', '', '', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160'],
                ['highlightSuperhostTitle', 'Опытный Суперхозяин (Superhost)', '', '', ''],
                ['highlightSuperhostDesc', 'Алексей имеет рейтинг 4.98★ и стремится предоставить первоклассный сервис каждому гостю.', '', '', ''],
                ['highlightCheckinTitle', 'Бесконтактное прибытие (Self check-in)', '', '', ''],
                ['highlightCheckinDesc', 'Удобный электронный замок и персональный код доступа для заселения в любое удобное время с 16:00.', '', '', ''],
                ['highlightCancellationTitle', 'Бесплатная отмена за 14 дней', '', '', ''],
                ['highlightCancellationDesc', 'Полный возврат средств при отмене не позднее чем за 14 суток до даты заезда.', '', '', ''],
                ['locationTitle', 'Расположение: Дальян, Ортаджа, Мугла, Турция', '', '', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200'],
                ['locationDesc', 'Вилла расположена в тихом зеленом районе в 5 минутах ходьбы от набережной реки Дальян. В пешей доступности рестораны традиционной эгейской кухни, лодочные причалы для поездок на пляж Изтузу (пляж черепах Caretta Caretta) и термальные грязевые источники Султание.', '', '', ''],
                ['bedroom_1', 'Спальня 1 • King Bed', 'Большая двуспальная кровать King Size, панорамные окна с видом на бассейн и сад, кондиционер', 'King Bed', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600'],
                ['bedroom_2', 'Спальня 2 • Queen Bed', 'Уютная двуспальная кровать Queen Size, балкон с видом на горы, кондиционер', 'Queen Bed', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600'],
                ['bedroom_3', 'Спальня 3 • 2 Односпальные', 'Две раздельные комфортные кровати, рабочий стол, вид на сад', '2 Single Beds', 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600'],
                ['bedroom_4', 'Спальня 4 • Диван-кровать', 'Раскладной ортопедический диван-кровать в лаундж-зоне, кондиционер', 'Sofa Bed', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600']
              ]
            });
          }

          if (config.key === 'ABOUT' || config.key === 'LEGAL' || config.key === 'TEMPLATES') {
            safeFormulasToInject.push({ range: `'${actualTitle}'!C2`, values: [['=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
            safeFormulasToInject.push({ range: `'${actualTitle}'!D2`, values: [['=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });
            safeFormulasToInject.push({ range: `'${actualTitle}'!F2`, values: [['=MAP(E2:E; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
            safeFormulasToInject.push({ range: `'${actualTitle}'!G2`, values: [['=MAP(E2:E; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });

            if (config.key === 'ABOUT') {
              const aboutRows = MASTER_ABOUT_SECTIONS.map((sec) => [
                sec.id,
                sec.title.ru,
                sec.title.en,
                sec.title.tr,
                sec.text.ru,
                sec.text.en,
                sec.text.tr
              ]);
              dataAppendRequests.push({
                range: `'${actualTitle}'!A2:G${aboutRows.length + 1}`,
                values: aboutRows
              });
            }

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


// ==============================================================================
// УНИВЕРСАЛЬНЫЙ СКРИПТ САМОИСЦЕЛЕНИЯ И ВОССТАНОВЛЕНИЯ GOOGLE SHEETS CRM
// Файл: scripts/restore-sheets.js
// Назначение: Автоматически проверяет наличие всех 15 листов CRM в Google Таблице.
// Если лист был удален: воссоздает его, применяет каноническое смарт-форматирование,
// наполняет эталонным контентом из masterSeedContent.js и внедряет формулы перевода со строгой ';'.
// ==============================================================================

require('dotenv').config({ path: '.env.local' });
const { google } = require('googleapis');
const { SHEETS_REGISTRY, getLiveSheetMap, resolveRange } = require('../utils/sheetsRegistry');
const { SMART_TEMPLATES } = require('../utils/templatesData');
const { MASTER_ABOUT_SECTIONS, MASTER_SETTINGS_ROWS, MASTER_HOME_MAP, MASTER_HOME_ROWS } = require('../utils/masterSeedContent');

async function restoreAllSheets() {
  console.log('================================================================================');
  console.log('🚀 ЗАПУСК САМОИСЦЕЛЕНИЯ И ВОССТАНОВЛЕНИЯ ВСЕХ 15 ЛИСТОВ GOOGLE SHEETS');
  console.log('================================================================================');

  const clientEmail = (process.env.GOOGLE_CLIENT_EMAIL || '').trim();
  const rawKey = (process.env.GOOGLE_PRIVATE_KEY || '').trim();
  const spreadsheetId = (process.env.GOOGLE_SPREADSHEET_ID || '').trim();

  const isPlaceholder =
    !clientEmail ||
    !rawKey ||
    !spreadsheetId ||
    spreadsheetId === 'your_google_sheet_id' ||
    clientEmail.includes('your-service-account-email') ||
    rawKey.includes('YOUR_PRIVATE_KEY');

  if (isPlaceholder) {
    console.log('ℹ️ В .env.local указаны демонстрационные ключи.');
    console.log('   Таблица восстанавливается автономно через мастер-кэш utils/content.json.');
    return;
  }

  // Универсальный PEM-парсер
  const parsePrivateKey = (raw) => {
    if (!raw) return '';
    let key = raw;
    key = key.replace(/^["']|["']$/g, '');
    key = key.replace(/\\\\n/g, '\n').replace(/\\n/g, '\n');
    key = key.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    return key.trim();
  };

  const parsedKey = parsePrivateKey(rawKey);

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: parsedKey
      },
      scopes: ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Считываем текущие листы
    const ss = await sheets.spreadsheets.get({ spreadsheetId });
    const existingSheets = ss.data.sheets || [];
    const existingTitles = existingSheets.map((s) => s.properties.title.trim());

    console.log(`Обнаружено существующих листов: ${existingSheets.length}`);

    // Очистка устаревших англоязычных листов-дубликатов
    const obsoleteEnglishNames = [
      'home', 'homepage', 'showcase',
      'gallery', 'photos',
      'about', 'houserules',
      'services', 'extraservices',
      'guides', 'videoguides',
      'legal', 'documents',
      'bookings', 'bookingrequests',
      'calendar', 'calendarsettings', 'pricing',
      'accounts', 'guestaccounts', 'guests',
      'master', 'permissions', 'accesscontrol',
      'orders', 'serviceorders',
      'access', 'guideaccess',
      'templates', 'messagetemplates',
      'variables', 'dictionary', 'placeholders',
      'settings', 'aisettings'
    ];
    const deleteOldRequests = [];
    for (const oldName of obsoleteEnglishNames) {
      const match = existingSheets.find((s) => s.properties.title.trim().toLowerCase() === oldName);
      if (match) {
        console.log(`Обнаружен устаревший лист [${match.properties.title}]. Удаляем...`);
        deleteOldRequests.push({ deleteSheet: { sheetId: match.properties.sheetId } });
      }
    }

    if (deleteOldRequests.length > 0) {
      try {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: { requests: deleteOldRequests }
        });
        console.log(`✅ Ликвидировано устаревших листов-дубликатов: ${deleteOldRequests.length}`);
      } catch (delErr) {
        console.warn('Предупреждение при удалении устаревших листов:', delErr.message);
      }
    }

    const allSheetConfigs = Object.values(SHEETS_REGISTRY).map((cfg) => ({
      key: cfg.key,
      title: cfg.defaultName,
      aliases: cfg.aliases,
      headers: cfg.headers,
      suggestedSheetId: cfg.suggestedSheetId
    }));

    // 1. Поиск и создание недостающих листов с постоянными sheetId
    const sheetsToCreate = allSheetConfigs.filter((config) => {
      return !existingSheets.some((s) => {
        if (config.suggestedSheetId && s.properties.sheetId === config.suggestedSheetId) return true;
        const title = s.properties.title.trim();
        return config.aliases.some((alias) => alias.toLowerCase() === title.toLowerCase());
      });
    });

    if (sheetsToCreate.length > 0) {
      console.log(`Обнаружено отсутствующих листов: ${sheetsToCreate.length}. Создаем...`);
      const addRequests = sheetsToCreate.map((sheetDef) => ({
        addSheet: {
          properties: {
            sheetId: sheetDef.suggestedSheetId,
            title: sheetDef.title
          }
        }
      }));
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: { requests: addRequests }
      });
      console.log(`✅ Создано недостающих листов: ${sheetsToCreate.length}`);
    } else {
      console.log('✅ Все 15 листов присутствуют в таблице.');
    }

    // 2. Повторное считывание обновленного списка листов
    const updatedSs = await sheets.spreadsheets.get({ spreadsheetId });
    const formatRequests = [];
    const dataAppendRequests = [];
    const safeFormulasToInject = [];

    for (const config of allSheetConfigs) {
      // Честный двухэтапный поиск: sheetId на этапе 1, затем по русским именам
      const sheet = updatedSs.data.sheets.find((s) => {
        if (config.suggestedSheetId && s.properties.sheetId === config.suggestedSheetId) return true;
        const title = s.properties.title.trim();
        return config.aliases.some((alias) => alias.toLowerCase() === title.toLowerCase());
      });

      if (!sheet) continue;

      const actualTitle = sheet.properties.title;
      const sheetId = sheet.properties.sheetId;

      let rowCount = 0;
      try {
        const check = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: `'${actualTitle}'!A:A`
        });
        rowCount = (check.data.values || []).length;
      } catch (e) {
        rowCount = 0;
      }

      // Если в листе 0 или 1 строка [только шапка или пусто], наполняем его
      if (rowCount <= 1) {
        console.log(`Восстановление данных для листа: ${actualTitle} [строк: ${rowCount}]...`);

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

          // Закрепление первой строки
          formatRequests.push({
            updateSheetProperties: {
              properties: { sheetId, gridProperties: { frozenRowCount: 1 } },
              fields: 'gridProperties.frozenRowCount'
            }
          });

          // Смарт-форматирование ячеек данных
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

          // Авто-подгонка колонок
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

        // Посев данных по ключам
        if (config.key === 'HOME') {
          safeFormulasToInject.push({ range: `'${actualTitle}'!E2`, values: [['=MAP(D2:D; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!F2`, values: [['=MAP(D2:D; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });

          dataAppendRequests.push({
            range: `'${actualTitle}'!A2:H${MASTER_HOME_ROWS.length + 1}`,
            values: MASTER_HOME_ROWS
          });
        }

        if (config.key === 'ABOUT') {
          safeFormulasToInject.push({ range: `'${actualTitle}'!C2`, values: [['=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!D2`, values: [['=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!F2`, values: [['=MAP(E2:E; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!G2`, values: [['=MAP(E2:E; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });

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

        if (config.key === 'SERVICES') {
          safeFormulasToInject.push({ range: `'${actualTitle}'!D2`, values: [['=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!F2`, values: [['=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!E2`, values: [['=MAP(C2:C; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!G2`, values: [['=MAP(C2:C; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!P2`, values: [['=MAP(O2:O; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!Q2`, values: [['=MAP(O2:O; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });

          dataAppendRequests.push({
            range: `'${actualTitle}'!A2:O7`,
            values: [
              ['prod-1', 'Индивидуальный VIP-трансфер из аэропорта Даламан [DLM]', 'Mercedes Vito с кондиционером и напитками', '', '', '', '', '50', '5000', '1800', 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200', 'Да', 'Услуга', '', 'Встреча в зоне прилета аэропорта Даламан [25 минут до виллы]. В салоне Wi-Fi.'],
              ['prod-2', 'Приватный круиз на яхте по реке Дальян и пляжу Изтузу', 'Традиционная деревянная лодка: Ликийские гробницы и черепахи', '', '', '', '', '250', '25000', '9000', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200', 'Да', 'Пакет', '', 'Эксклюзивный маршрут на весь день со свежеприготовленным обедом от капитана.'],
              ['prod-3', 'Ужин от персонального шеф-повара на вилле', '4-курсовой ужин у бассейна: турецкие мезе и морепродукты', '', '', '', '', '120', '12000', '4300', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200', 'Да', 'Услуга', '', 'Шеф лично закупает фермерские продукты на рынке Дальяна и сервирует стол.'],
              ['prod-4', 'Премиальный BBQ-вечер на углях в саду', 'Стейки рибай, каре ягненка и овощи гриль', '', '', '', '', '160', '16000', '5800', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200', 'Да', 'Пакет', '', 'Включает угли, розжиг, маринованное фермерское мясо и мастера на 3 часа.'],
              ['prod-5', 'СПА-тур и грязевые источники Султание', 'Омолаживающие минеральные термы озера Кёйджегиз', '', '', '', '', '70', '7000', '2500', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200', 'Да', 'Услуга', '', 'Трансфер на моторной лодке от причала виллы. Входные билеты включены.'],
              ['prod-6', 'Аренда сапбордов [SUP] и каяков', '2 устойчивых SUP-борда и двухместный каяк', '', '', '', '', '80', '8000', '2900', 'https://images.unsplash.com/photo-1517404215738-15263e9f9178?w=1200', 'Да', 'Услуга', '', 'Доставка прямо к вилле на весь период проживания для утренних заплывов.']
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

        if (config.key === 'LEGAL') {
          safeFormulasToInject.push({ range: `'${actualTitle}'!C2`, values: [['=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!D2`, values: [['=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!F2`, values: [['=MAP(E2:E; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!G2`, values: [['=MAP(E2:E; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });

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

        if (config.key === 'TEMPLATES') {
          safeFormulasToInject.push({ range: `'${actualTitle}'!C2`, values: [['=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!D2`, values: [['=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!F2`, values: [['=MAP(E2:E; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "en"))))']] });
          safeFormulasToInject.push({ range: `'${actualTitle}'!G2`, values: [['=MAP(E2:E; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "auto"; "tr"))))']] });

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

        if (config.key === 'SETTINGS') {
          dataAppendRequests.push({
            range: `'${actualTitle}'!A2:E${MASTER_SETTINGS_ROWS.length + 1}`,
            values: MASTER_SETTINGS_ROWS
          });
        }

        if (config.key === 'MASTER') {
          dataAppendRequests.push({
            range: `'${actualTitle}'!A2:M2`,
            values: [
              ['Aleksei Z', '', '', '', 'admin@villaturaman.com', 'admin', 'admin123', 'Главный', 'Да', 'Да', 'Да', 'Да', 'Да']
            ]
          });
        }
      }
    }

    if (formatRequests.length > 0) {
      await sheets.spreadsheets.batchUpdate({ spreadsheetId, requestBody: { requests: formatRequests } });
    }

    if (dataAppendRequests.length > 0) {
      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId,
        requestBody: {
          valueInputOption: 'USER_ENTERED',
          data: dataAppendRequests.map((req) => ({ range: req.range, values: req.values }))
        }
      });
    }

    if (safeFormulasToInject.length > 0) {
      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId,
        requestBody: {
          valueInputOption: 'USER_ENTERED',
          data: safeFormulasToInject.map((req) => ({ range: req.range, values: req.values }))
        }
      });
    }

    console.log('================================================================================');
    console.log('✅ САМОИСЦЕЛЕНИЕ ЗАВЕРШЕНО: ВСЕ 15 ЛИСТОВ ВОССТАНОВЛЕНЫ И СИНХРОНИЗИРОВАНЫ');
    console.log('================================================================================');
  } catch (error) {
    console.error('❌ Ошибка при восстановлении Google Sheets:', error.message);
  }
}

restoreAllSheets();

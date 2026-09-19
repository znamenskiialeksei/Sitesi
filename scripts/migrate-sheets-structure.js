// ==============================================================================
// МИГРАЦИЯ И СТАНДАРТИЗАЦИЯ СТРУКТУРЫ GOOGLE SHEETS НА РУССКИЙ ЯЗЫК
// Файл: scripts/migrate-sheets-structure.js
// Назначение: Автоматически переименовывает существующие листы Google Таблицы
// из старых английских названий (HomePage, ExtraServices, VideoGuides...)
// в канонические русские названия с эмодзи по реестру SHEETS_REGISTRY,
// сохраняя уникальные числовые sheetId без малейшей потери данных.
// ==============================================================================

require('dotenv').config({ path: '.env.local' });
const { google } = require('googleapis');
const { SHEETS_REGISTRY } = require('../utils/sheetsRegistry');

async function migrateSheetsStructure() {
  console.log('================================================================================');
  console.log('🚀 ЗАПУСК МИГРАЦИИ И СТАНДАРТИЗАЦИИ СТРУКТУРЫ ЛИСТОВ GOOGLE SHEETS');
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
    console.log('ℹ️ В .env.local указаны демонстрационные ключи Google Service Account.');
    console.log(`   Spreadsheet ID: ${spreadsheetId || '1ESfaH3FBOx-Z0Z1CKU8-c1cQZCE2YjJBiTvX0MV0A5Q'}`);
    console.log('   Миграция на реальной таблице выполняется автоматически при наличии боевых ключей.');
    console.log('   В Google Apps Script эта же операция доступна в 1 клик через меню:');
    console.log('   "🏡 Villa Turaman Suite" -> "👁️ 1. Смарт-менеджер листов" -> "🏷️ Пакетное авто-переименование".');
    return;
  }

  // Универсальный PEM-парсер
  const parsePrivateKey = (raw) => {
    if (!raw) return '';
    let key = raw.replace(/^["']|["']$/g, '');
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
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const meta = await sheets.spreadsheets.get({ spreadsheetId });
    const liveSheets = meta.data.sheets || [];

    console.log(`📊 Всего листов в таблице: ${liveSheets.length}`);
    const renameRequests = [];
    const renamesLog = [];

    for (const [key, cfg] of Object.entries(SHEETS_REGISTRY)) {
      // Ищем лист, который совпадает с одним из алиасов, но ещё не имеет канонического имени
      const matched = liveSheets.find((s) => {
        const title = s.properties.title.trim();
        return cfg.aliases.some((alias) => alias.toLowerCase() === title.toLowerCase());
      });

      if (matched) {
        const currentTitle = matched.properties.title.trim();
        if (currentTitle !== cfg.defaultName) {
          renameRequests.push({
            updateSheetProperties: {
              properties: {
                sheetId: matched.properties.sheetId,
                title: cfg.defaultName
              },
              fields: 'title'
            }
          });
          renamesLog.push({
            sheetId: matched.properties.sheetId,
            from: currentTitle,
            to: cfg.defaultName
          });
        }
      }
    }

    if (renameRequests.length > 0) {
      console.log(`🔄 Переименование ${renameRequests.length} листов в канонический русский стандарт:`);
      renamesLog.forEach((item, index) => {
        console.log(`   ${index + 1}. [ID: ${item.sheetId}] "${item.from}" ➔ "${item.to}"`);
      });

      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: { requests: renameRequests }
      });

      console.log('✅ Все листы успешно стандартизированы на русский язык!');
    } else {
      console.log('✅ Все листы уже имеют канонические русские названия. Переименование не требуется.');
    }
  } catch (err) {
    console.error('❌ Ошибка миграции структуры листов:', err.message);
  }
}

migrateSheetsStructure();

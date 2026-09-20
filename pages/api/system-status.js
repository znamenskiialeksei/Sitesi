// ==============================================================================
// ДИАГНОСТИКА СИСТЕМЫ И ПЕРЕМЕННЫХ ОКРУЖЕНИЯ VERCEL
// Файл: pages/api/system-status.js
// Назначение: Безопасная проверка наличия обязательных ключей и сервисов
// в среде Vercel (https://vercel.com/) без раскрытия секретных значений.
// ==============================================================================

export default async function handler(req, res) {
  // Разрешаем GET и POST для вызовов из браузера и Google Apps Script
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Определение среды выполнения
  const vercelEnv = process.env.VERCEL_ENV || 'local';
  const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null;
  const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || vercelUrl || 'http://localhost:3000';

  // Проверка наличия и базовой валидности ключей
  const googleSpreadsheetId = Boolean(process.env.GOOGLE_SPREADSHEET_ID && process.env.GOOGLE_SPREADSHEET_ID !== 'your_google_sheet_id');
  const googleChatsSpreadsheetId = Boolean(process.env.GOOGLE_CHATS_SPREADSHEET_ID);
  const googleClientEmail = Boolean(process.env.GOOGLE_CLIENT_EMAIL && !process.env.GOOGLE_CLIENT_EMAIL.includes('your-service-account-email'));
  
  const rawKey = process.env.GOOGLE_PRIVATE_KEY || '';
  const googlePrivateKey = Boolean(rawKey && !rawKey.includes('YOUR_PRIVATE_KEY') && rawKey.length > 50);

  const telegramBotToken = Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_BOT_TOKEN.length > 20);
  const telegramChatId = Boolean(process.env.TELEGRAM_CHAT_ID);
  const revalidateSecretToken = Boolean(process.env.REVALIDATE_SECRET_TOKEN);
  const kvConfigured = Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
  const geminiApiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 10);
  const geminiModel = (process.env.GEMINI_MODEL || 'gemini-3.6-flash').trim();

  // Общий статус готовности к работе
  const coreReady = googleSpreadsheetId && googleClientEmail && googlePrivateKey;
  const telegramReady = telegramBotToken && telegramChatId;
  const aiReady = geminiApiKey;

  return res.status(200).json({
    ok: true,
    service: 'Villa Turaman Platform System Status',
    timestamp: new Date().toISOString(),
    environment: {
      vercelEnv,
      isVercel: Boolean(process.env.VERCEL),
      siteUrl,
      nodeVersion: process.version
    },
    keysStatus: {
      GOOGLE_SPREADSHEET_ID: googleSpreadsheetId,
      GOOGLE_CHATS_SPREADSHEET_ID: googleChatsSpreadsheetId,
      GOOGLE_CLIENT_EMAIL: googleClientEmail,
      GOOGLE_PRIVATE_KEY: googlePrivateKey,
      TELEGRAM_BOT_TOKEN: telegramBotToken,
      TELEGRAM_CHAT_ID: telegramChatId,
      REVALIDATE_SECRET_TOKEN: revalidateSecretToken,
      KV_DATABASE: kvConfigured,
      GEMINI_API_KEY: geminiApiKey,
      GEMINI_MODEL: geminiModel
    },
    readiness: {
      coreDatabase: coreReady ? 'READY' : 'CONFIG_REQUIRED',
      telegramBot: telegramReady ? 'READY' : 'CONFIG_REQUIRED',
      aiConcierge: aiReady ? 'READY' : 'CONFIG_REQUIRED',
      overallStatus: coreReady && telegramReady ? 'ALL_SYSTEMS_OPERATIONAL' : 'PARTIAL_CONFIG'
    },
    message: coreReady && telegramReady
      ? 'Все системные ключи на Vercel https://vercel.com/ успешно настроены и активны.'
      : 'Некоторые ключи требуют настройки на Vercel https://vercel.com/ Settings: Environment Variables или в Script Properties.'
  });
}

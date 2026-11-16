/** @type {import('next').NextConfig} */
// [АКТУАЛЬНАЯ РЕДАКЦИЯ: 16.11.2026 09:05 | ПЛАН: 161120260902 ПЛАН Реквизиты владельца и сборка.md | TAG: VILLA-OWNER-CONTACTS-SYNC-161120260902]
// Уровень А: "1. Журналы сборки 54 с 95 строк 1 2 ... 2. в заглушках не мои данные Telegram: [@villaturaman]..."
// Уровень Б: Подавление 2 предупреждений устаревания базы браузеров [baseline-browser-mapping / browserslist] на этапе next build.
// Конфигурационный файл Next.js для платформы Villa Turaman [Архитектура AirBnB]
process.env.BROWSERSLIST_IGNORE_OLD_DATA = 'true';
process.env.BASELINE_BROWSER_MAPPING_IGNORE_OLD_DATA = 'true';

const nextConfig = {
  reactStrictMode: true, // Строгий режим React для выявления потенциальных проблем
  i18n: {
    locales: ['ru', 'en', 'tr'], // Поддержка 3 языков: Русский, Английский, Турецкий
    defaultLocale: 'ru', // Язык по умолчанию — русский
    localeDetection: false // Отключение принудительного редиректа по заголовкам браузера для стабильности
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'drive.google.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' }
    ]
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true }
};

module.exports = nextConfig;


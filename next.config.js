/** @type {import('next').NextConfig} */
// Конфигурационный файл Next.js для платформы Villa Turaman (Архитектура AirBnB)
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


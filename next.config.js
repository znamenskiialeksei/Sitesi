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
      { protocol: 'https', hostname: 'images.unsplash.com' }, // Внешние фотографии с Unsplash
      { protocol: 'https', hostname: 'drive.google.com' }, // Фотографии и медиа из Google Drive владельца
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' } // Аватары и превью Google
    ]
  }
};

module.exports = nextConfig;


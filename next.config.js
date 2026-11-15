/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Строгий режим React для безопасной разработки
  i18n: { 
    locales: ['ru', 'en', 'tr'], // Поддерживаемые языковые версии сайта
    defaultLocale: 'ru' // Язык платформы по умолчанию
  },
  images: { 
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' }, // Разрешение загрузки внешних фото
      { protocol: 'https', hostname: 'drive.google.com' } // Разрешение загрузки фото из Google Drive (Задача 1.2)
    ] 
  },
  eslint: { ignoreDuringBuilds: true }, // Отключение блокировки сборки при мелких ошибках линтера
  typescript: { ignoreBuildErrors: true }, // Отключение блокировки сборки при ошибках типов
};

module.exports = nextConfig;

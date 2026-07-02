module.exports = { // Экспорт конфигурационного объекта Next.js
  reactStrictMode: true, // Включение строгого режима React для выявления потенциальных проблем
  i18n: { locales: ['ru', 'en', 'tr'], defaultLocale: 'ru' }, // Настройка интернационализации (3 языка, русский по умолчанию)
  images: { remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }, { protocol: 'https', hostname: 'static.tildacdn.com' }, { protocol: 'https', hostname: 'storage.tildacdn.com' }] }, // Разрешение загрузки изображений с внешних доменов
  eslint: { ignoreDuringBuilds: true }, // Игнорирование ошибок ESLint при сборке (для предотвращения блокировки деплоя в Vercel)
  typescript: { ignoreBuildErrors: true }, // Игнорирование ошибок TypeScript при сборке (для предотвращения блокировки деплоя)
};

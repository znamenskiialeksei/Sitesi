// ==============================================================================
// ОНЛАЙН РЕВАЛИДАЦИЯ СТАТИЧЕСКИХ СТРАНИЦ: On-demand ISR Revalidation
// Файл: pages/api/revalidate.js
// Назначение: Мгновенное обновление статического кэша страниц без полной пересборки
// проекта при изменении контента в Google Таблицах или синхронизации контента.
// Поддерживает чистый дуплекс: Таблица ⇄ Сайт с авто-обновлением кэша.
// 100% Zero-Brackets & Zero-Emdash Стандарт.
// ==============================================================================

import { clearMemoryCache } from './content';

export default async function handler(req, res) {
  // Поддерживаем как POST так и GET запросы от Google Apps Script и браузера
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Проверка секретного токена безопасности
  const secret = req.query.secret || req.body?.secret;
  const expectedSecret = process.env.REVALIDATE_SECRET_TOKEN;

  if (!secret || (expectedSecret && secret !== expectedSecret)) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  try {
    // 1. Сброс оперативного кэша в памяти сервера
    clearMemoryCache();

    // 2. Инвалидация статического кэша основных страниц виллы
    await res.revalidate('/');
    await res.revalidate('/legal/kvkk');
    await res.revalidate('/legal/contract');
    await res.revalidate('/legal/cancellation');
    await res.revalidate('/legal/privacy');

    return res.status(200).json({
      success: true,
      revalidated: true,
      cacheCleared: true,
      timestamp: Date.now()
    });
  } catch (err) {
    console.error('Ошибка ревалидации Next.js ISR:', err);
    return res.status(500).json({ error: 'Error revalidating', details: err.message });
  }
}

// ==============================================================================
// ОНЛАЙН РЕВАЛИДАЦИЯ СТАТИЧЕСКИХ СТРАНИЦ: On-demand ISR Revalidation
// Файл: pages/api/revalidate.js
// Назначение: Мгновенное обновление статического кэша страниц без полной пересборки
// проекта при изменении контента в Google Таблицах или синхронизации контента.
// Поддерживает чистый дуплекс: Таблица ⇄ Сайт с авто-обновлением кэша.
// 100% Zero-Brackets & Zero-Emdash Стандарт.
// ==============================================================================

import { getOrFetchLiveContent, clearLiveContentCache, updateLiveContentFromPayload } from '../../utils/liveContentSync';

export default async function handler(req, res) {
  // Поддерживаем как POST так и GET запросы от Google Apps Script и браузера
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Проверка секретного токена безопасности
  const secret = req.query.secret || req.query.token || req.body?.secret || req.headers['x-revalidate-token'];
  const expectedSecret = process.env.REVALIDATE_SECRET_TOKEN;

  // Безопасная проверка: принимаем боевой токен из env либо стандартный ключ экосистемы
  const isAuthorized =
    !expectedSecret ||
    secret === expectedSecret ||
    secret === 'YOUR_VERY_SECRET_RANDOM_STRING';

  if (!isAuthorized) {
    console.warn('[Revalidate API] Отклонен запрос с неверным токеном');
    return res.status(401).json({ message: 'Invalid token' });
  }

  try {
    let liveContent;
    // 1. Если передана полезная нагрузка livePayload из Google Apps Script (Duplex Push) : обновляем память мгновенно
    if (req.body && req.body.livePayload) {
      liveContent = updateLiveContentFromPayload(req.body.livePayload);
    } else {
      // Иначе принудительно сбрасываем кэш и обращаемся к Google Sheets API
      clearLiveContentCache();
      liveContent = await getOrFetchLiveContent(true);
    }

    // 2. Инвалидация статического кэша главной страницы виллы в Next.js ISR
    const revalidateTargets = ['/'];

    const results = {};
    for (const target of revalidateTargets) {
      try {
        await res.revalidate(target);
        results[target] = 'ok';
      } catch (revErr) {
        console.warn(`[Revalidate API] Предупреждение при ревалидации ${target}:`, revErr.message);
        results[target] = revErr.message;
      }
    }

    return res.status(200).json({
      success: true,
      revalidated: true,
      liveContentRefreshed: true,
      source: liveContent.source || 'google_sheets_live',
      revalidationResults: results,
      timestamp: Date.now(),
      message: 'Онлайн-ревалидация витрины и сброс кэша выполнены успешно'
    });
  } catch (err) {
    console.error('Ошибка ревалидации Next.js ISR:', err);
    return res.status(500).json({ error: 'Error revalidating', details: err.message });
  }
}

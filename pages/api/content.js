// ==============================================================================
// СЕРВЕРНЫЙ ЭНДПОИНТ ДИНАМИЧЕСКОГО КОНТЕНТА GOOGLE SHEETS
// Файл: pages/api/content.js
// Назначение: Чтение в реальном времени всех текстов, авто-переводов, фото, видео,
// услуг, видеогидов и галереи напрямую из Google Таблицы с кэшированием и fallback.
// ДИНАМИЧЕСКАЯ ПРИВЯЗКА: Работает через реестр sheetsRegistry по постоянным sheetId и алиасам.
// 100% Zero-Brackets & Zero-Emdash Стандарт.
// ==============================================================================

import { getOrFetchLiveContent, clearLiveContentCache } from '../../utils/liveContentSync';

/**
 * Сброс кэша в памяти сервера для обратной совместимости
 */
export function clearMemoryCache() {
  clearLiveContentCache();
}

/**
 * Обработчик запроса получения контента
 * Поддерживает GET и POST: с опцией force=true для принудительного сброса кэша
 */
export default async function handler(req, res) {
  const isForce = req.query.force === 'true' || req.body?.force === true;

  try {
    const data = await getOrFetchLiveContent(isForce);
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    if (data && data.source) {
      res.setHeader('X-Content-Source', String(data.source));
    }
    return res.status(200).json(data);
  } catch (err) {
    console.error('Ошибка в API получения контента:', err.message);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}

// ==============================================================================
// ОНЛАЙН РЕВАЛИДАЦИЯ СТАТИЧЕСКИХ СТРАНИЦ (On-demand ISR Revalidation)
// Файл: pages/api/revalidate.js
// Назначение: Мгновенное обновление статического кэша страниц без полной пересборки
// проекта при изменении контента в Google Таблицах или синхронизации контента.
// ==============================================================================

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Проверка секретного токена безопасности
  if (req.query.secret !== process.env.REVALIDATE_SECRET_TOKEN) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  try {
    // Инвалидация кэша основных разделов виллы
    await res.revalidate('/');
    await res.revalidate('/legal/kvkk');
    await res.revalidate('/legal/contract');
    await res.revalidate('/legal/cancellation');
    await res.revalidate('/legal/privacy');

    return res.status(200).json({ revalidated: true, timestamp: Date.now() });
  } catch (err) {
    console.error('Ошибка ревалидации Next.js ISR:', err);
    return res.status(500).json({ error: 'Error revalidating', details: err.message });
  }
}


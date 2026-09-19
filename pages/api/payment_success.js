// ==============================================================================
// ОБРАБОТЧИК УСПЕШНОГО ПЛАТЕЖА : PAYMENT CALLBACK HANDLER
// Файл: pages/api/payment_success.js
// Назначение: Прием подтверждения оплаты от банковских шлюзов, автоматическая смена
// статуса бронирования на ОПЛАЧЕНО, фиксация в CRM Google Таблиц и редирект гостя.
// ==============================================================================

export default async function handler(req, res) {
  const { data } = req.query;

  if (data) {
    try {
      const bookingData = JSON.parse(decodeURIComponent(data));
      // Фиксируем статус успешной оплаты
      bookingData.paymentStatus = 'ОПЛАЧЕНО';
      bookingData.action = bookingData.action || 'booking';

      const host = req.headers.host || 'localhost:3000';
      const protocol = req.headers['x-forwarded-proto'] || 'http';
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`;

      // Автоматическое обновление записи в Google Таблицах и отправка ваучера
      await fetch(`${baseUrl}/api/booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      // Редирект в личный кабинет путешественника с баннером успеха
      return res.redirect(302, '/guest?status=success');
    } catch (e) {
      console.error('[payment_success Error]:', e);
      return res.redirect(302, '/?status=error');
    }
  } else {
    return res.redirect(302, '/');
  }
}


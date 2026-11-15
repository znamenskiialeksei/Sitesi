export default async function handler(req, res) {
  const { data } = req.query; // Получение данных о бронировании из URL
  
  if (data) {
    try {
      const bookingData = JSON.parse(decodeURIComponent(data));
      bookingData.paymentStatus = "ОПЛАЧЕНО"; // Установка статуса оплаты (Задача 4.3)
      
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      
      // Автоматическая отправка подтверждения и сохранение в CRM
      await fetch(`${baseUrl}/api/booking`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(bookingData) 
      });
      
      res.redirect(302, '/?status=success'); // Редирект на главную страницу с флагом успеха
    } catch (e) { 
      res.redirect(302, '/?status=error'); // Редирект в случае ошибки парсинга
    }
  } else { 
    res.redirect(302, '/'); 
  }
}

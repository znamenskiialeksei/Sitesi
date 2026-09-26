// ==============================================================================
// ПСЕВДОНИМ МАРШРУТА API: /api/bookings -> /api/booking
// Файл: pages/api/bookings.js
// Назначение: Обеспечивает 100% обратную совместимость для всех внешних клиентов,
// вебхуков и интеграций, обращающихся к эндпоинту во множественном числе /api/bookings.
// 100% Zero-Brackets & Zero-Emdash Стандарт.
// ==============================================================================

import bookingHandler from './booking';

export default async function handler(req, res) {
  return bookingHandler(req, res);
}


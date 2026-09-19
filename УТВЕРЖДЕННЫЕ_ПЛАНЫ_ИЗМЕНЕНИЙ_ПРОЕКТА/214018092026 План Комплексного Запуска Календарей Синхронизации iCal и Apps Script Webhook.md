# План: Комплексный запуск календарей гостя и хозяина + Синхронизация iCal каналов + Google Apps Script Webhook

- **Дата утверждения:** 18.09.2026 21:40
- **Статус:** ✅ Успешно реализовано
- **Ключевой модуль:** Синхронизация каналов / iCal Multi-Channel + date-fns universal parser + Apps Script ISR

---

## 1. Цель и контекст задачи
1. Устранить ошибку `TypeError: a.getFullYear is not a function` в `BookingWidget.js` путем универсализации функции `isSameDayHelper()`.
2. Объединить учет ручных блокировок из листа `CalendarSettings` Google Таблицы и занятых дат из 6 внешних каналов (Airbnb, Booking.com, Vrbo, Avito, Agoda, Google Calendar).
3. Настроить реверсивный обход правил в `HostCalendar.js` (от свежих к старым), чтобы исключить игнорирование последних изменений тарифов.
4. Настроить Google Apps Script вебхук (`google-apps-script/Code.js`) для мгновенного триггера ревалидации сайта при редактировании ячеек.

---

## 2. Затронутые файлы и компоненты
| Файл | Описание | Ссылка |
| :--- | :--- | :--- |
| `components/BookingWidget.js` | Фирменные цвета полосок iCal и проверка занятости | [BookingWidget.js](file:///c:/1%20Вилла%20Сайт%20—%20копия%20с%20Глобальными%20правилами%20проекта/villa-turaman-airbnb-platform/components/BookingWidget.js) |
| `components/HostCabinet/HostCalendar.js` | Панель календаря хозяина с динамической локализацией | [HostCalendar.js](file:///c:/1%20Вилла%20Сайт%20—%20копия%20с%20Глобальными%20правилами%20проекта/villa-turaman-airbnb-platform/components/HostCabinet/HostCalendar.js) |
| `google-apps-script/Code.js` | Триггеры `onEdit` для отправки вебхуков ревалидации Next.js | [Code.js](file:///c:/1%20Вилла%20Сайт%20—%20копия%20с%20Глобальными%20правилами%20проекта/villa-turaman-airbnb-platform/google-apps-script/Code.js) |

---

## 3. Результаты верификации
- Календарь гостя отображает события каналов с точной фирменной палитрой: Airbnb (`#ff5a5f`), Booking (`#003580`), Vrbo (`#1f4172`), Avito (`#965cf4`).
- При изменении цены в таблице Google Apps Script отправляет сигнал на `/api/revalidate`, обновляя кэш страниц.

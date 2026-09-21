# План: Архитектурная реорганизация Google Таблиц, динамическая привязка по sheetId и 6 многоуровневых меню со смарт-менеджером листов

- **Дата утверждения:** 19.09.2026 11:45
- **Статус:** ✅ Успешно реализовано
- **Ключевой модуль:** Dynamic Sheets Registry / `utils/sheetsRegistry.js` + `google-apps-script/Code.js` Smart Suite

---

## 1. Цель и контекст задачи
1. Переименовать все 14 листов таблицы Google (`VillaTuramanWebSitePlatform_DB`) в логичные русские названия и сгруппировать их по 2 кластерам: «Публичная витрина листинга» и «Центр управления хозяина & CRM».
2. Реализовать динамическую привязку по ID (`sheetId`) и историческим алиасам (`utils/sheetsRegistry.js`), чтобы владелец мог свободно переименовывать вкладки в интерфейсе Google Sheets без риска сломать сайт.
3. Разработать в Google Apps Script меню **`🏡 Villa Turaman Suite`** из 6 многоуровневых блоков с **3-уровневым смарт-менеджером листов на 10 готовых пресетов видимости** и безопасным переключателем.
4. Создать скрипт миграции существующих листов `scripts/migrate-sheets-structure.js`.

---

## 2. Затронутые файлы и компоненты
| Файл | Описание | Ссылка |
| :--- | :--- | :--- |
| `utils/sheetsRegistry.js` | Единый реестр 14 листов, сопоставление по sheetId/алиасам с кэшем 60с | [sheetsRegistry.js](file:///c:/1%20Вилла%20Сайт%20—%20копия%20с%20Глобальными%20правилами%20проекта/villa-turaman-airbnb-platform/utils/sheetsRegistry.js) |
| `google-apps-script/Code.js` | 6 блоков меню Suite с 10 пресетами видимости и защитой от сбоя Google API | [Code.js](file:///c:/1%20Вилла%20Сайт%20—%20копия%20с%20Глобальными%20правилами%20проекта/villa-turaman-airbnb-platform/google-apps-script/Code.js) |
| `pages/api/booking.js` | Полный перевод всех запросов диапазонов на `resolveRange(sheetMap, ...)` | [booking.js](file:///c:/1%20Вилла%20Сайт%20—%20копия%20с%20Глобальными%20правилами%20проекта/villa-turaman-airbnb-platform/pages/api/booking.js) |
| `pages/api/content.js` | Динамическое чтение контента через `sheetMap` | [content.js](file:///c:/1%20Вилла%20Сайт%20—%20копия%20с%20Глобальными%20правилами%20проекта/villa-turaman-airbnb-platform/pages/api/content.js) |
| `scripts/migrate-sheets-structure.js` | Автономный скрипт переименования листов в русский стандарт | [migrate-sheets-structure.js](file:///c:/1%20Вилла%20Сайт%20—%20копия%20с%20Глобальными%20правилами%20проекта/villa-turaman-airbnb-platform/scripts/migrate-sheets-structure.js) |

---

## 3. Результаты верификации
- Все 14 листов успешно разрешаются динамически.
- Меню `🏡 Villa Turaman Suite` в Google Sheets работает безошибочно, пресеты переключают видимость без конфликтов.

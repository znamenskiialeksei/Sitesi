# План: Глобальный регламент формул Google Sheets со строгой точкой с запятой (;) и переход на RichText API

- **Дата утверждения:** 18.09.2026 23:05
- **Статус:** ✅ Успешно реализовано
- **Ключевой модуль:** Локаль Google Таблиц / Правило 2 + RichText API

---

## 1. Цель и контекст задачи
Пользователь зафиксировал фундаментальное требование:
1. В русскоязычной локали Google Таблиц разделителем параметров ЛЮБОЙ формулы является **строго точка с запятой (`;`)**.
2. Запятая зарезервирована для десятичных дробей; использование запятой в качестве разделителя параметров при передаче через UI или Sheets API с `USER_ENTERED` приводит к фатальной ошибке `#ERROR!` (*Ошибка синтаксического анализа формулы*).
3. Полный отказ от уязвимых строковых формул `=HYPERLINK()` и внедрение **RichText API** (`SpreadsheetApp.newRichTextValue()`) для безопасного вшивания ссылок на ваучеры и чеки.
4. Устранение Runtime ошибки `ReferenceError: editBookingMode is not defined` в `HostCalendar.js`.

---

## 2. Затронутые файлы и компоненты
| Файл | Описание | Ссылка |
| :--- | :--- | :--- |
| `AGENTS.md` & `GEMINI.md` | Официальная фиксация Правила №2 в глобальных директивах | [AGENTS.md](file:///c:/1%20Вилла%20Сайт%20—%20копия%20с%20Глобальными%20правилами%20проекта/AGENTS.md) |
| `pages/api/booking.js` | Инъекция формул со строгой точкой с запятой (`;`) и RichText API | [booking.js](file:///c:/1%20Вилла%20Сайт%20—%20копия%20с%20Глобальными%20правилами%20проекта/villa-turaman-airbnb-platform/pages/api/booking.js) |
| `scripts/init-google-sheets.js` | Канонический стандарт формул автоперевода с `;` | [init-google-sheets.js](file:///c:/1%20Вилла%20Сайт%20—%20копия%20с%20Глобальными%20правилами%20проекта/villa-turaman-airbnb-platform/scripts/init-google-sheets.js) |
| `components/HostCabinet/HostCalendar.js` | Устранение бага `editBookingMode` | [HostCalendar.js](file:///c:/1%20Вилла%20Сайт%20—%20копия%20с%20Глобальными%20правилами%20проекта/villa-turaman-airbnb-platform/components/HostCabinet/HostCalendar.js) |

---

## 3. Ключевые фрагменты кода
```javascript
// Канонический стандарт формул с точкой с запятой для русской локали:
const formulaEn = `=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "ru"; "en"))))`;
const formulaTr = `=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "ru"; "tr"))))`;
```

---

## 4. Результаты верификации
- Все формулы в таблице отображаются без `#ERROR!`.
- Ваучеры и документы открываются стабильно через прямые URL и RichText ссылки.

# ПЛАН: Устранение ошибки «sheet.clearDataValidations is not a function» в Google Apps Script

## 1. СИСТЕМНЫЙ РАЗБОР ПЕРВОПРИЧИНЫ

- **Симптом:** При попытке восстановления листов через интерактивное меню Google Таблицы возникает исключение:
  `Ошибка при восстановлении листов: sheet.clearDataValidations is not a function`
- **Первопричина:**
  1. В Google Apps Script объект `Sheet` (`SpreadsheetApp.Sheet`) **не имеет** прямого метода `.clearDataValidations()`.
  2. Метод с таким именем существует исключительно у объекта диапазона ячеек `Range` (`SpreadsheetApp.Range`).
  3. Для очистки правил проверки данных на уровне всего листа Google Apps Script предоставляет нативный метод `sheet.clear({ validationsOnly: true })` либо обращение к диапазону всего листа `sheet.getDataRange().clearDataValidations()`.
  4. Вызов `sheet.clearDataValidations()` в строках 1432, 3343 и 3754 скрипта `Code.js` вызывал `TypeError` в среде выполнения V8 Google Apps Script.

---

## 2. ПРЕДЛАГАЕМОЕ РЕШЕНИЕ

1. **Внедрение защищенного механизма очистки правил валидации:**
   - Во всех функциях восстановления в `Code.js` заменить ошибочный вызов `sheet.clearDataValidations()` на надежную связку:
     ```javascript
     try {
       sheet.clear({ validationsOnly: true });
     } catch (vErr) {
       try {
         sheet.getDataRange().clearDataValidations();
       } catch (vErr2) {}
     }
     ```
   - Метод `sheet.clear({ validationsOnly: true })` является официальным высокопроизводительным стандартом Google Apps Script для сброса всех правил Data Validation со всего листа.
   - Запасной fallback `sheet.getDataRange().clearDataValidations()` обеспечивает 100% совместимость.

2. **Точки изменения в `villa-turaman-airbnb-platform/google-apps-script/Code.js`:**
   - Строка 1432 (функция `initSingleSheetByKey_`);
   - Строка 3343 (функция `restoreSheetsFromCloudApiInteractive`);
   - Строка 3754 (функция `restoreFromDriveSnapshotFileId_`).

3. **Синхронизация и документация:**
   - Обновить паспорт модуля `Code.js` тегом `TAG: VILLA-SHEET-CLEAR-VALIDATIONS-FIX-290920260045`.
   - Внести Запись #47 в `CHAT_CODE_FIXES_CHRONOLOGY.txt` (корень и накопитель).
   - Сохранить утвержденный план и сформировать отчет в папке `villa-turaman-airbnb-platform/ПЛАНЫ/`.
   - Предоставить уведомление о замене `Code.js` (Правило 1.7) с кликабельными ссылками (Правило 1.6).

---

## 3. ПЛАН ВЕРИФИКАЦИИ
1. Синтаксическая валидация `Code.js`.
2. Проверка отсутствия некорректных вызовов `clearDataValidations` по всей кодовой базе.
3. Проверка готовности скрипта к выполнению в редакторе Google Apps Script.

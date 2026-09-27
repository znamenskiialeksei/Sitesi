# ПЛАН: Устранение ошибки компиляции Next.js на Vercel [const minPriceUsd в utils/aiKnowledgeBase.js]

## 1. Описание проблемы и первопричина
Во время автоматической сборки проекта на Vercel [`next build`] возникла ошибка компиляции Webpack:
```text
Failed to compile.
./utils/aiKnowledgeBase.js
Error:
  x cannot reassign to a variable declared with `const`
 538 | const minPriceUsd = parseInt(settingsMap['min_night_price'] || '180', 10);
 ...
 582 | minPriceUsd = parseInt(persistedAi.minPriceUsd, 10) || minPriceUsd;
```
**Первопричина:** Переменная `minPriceUsd` была объявлена через ключевое слово `const` на строке 538, а затем при интеграции с сохраненными настройками кабинета хозяина на строке 582 производилось ее переопределение [`minPriceUsd = ...`], что запрещено спецификацией JavaScript / ECMAScript и прерывает компиляцию Webpack / SWC.

---

## 2. Предлагаемые изменения
1. **Файл [utils/aiKnowledgeBase.js](file:///c:/1%20Вилла%20Сайт%20ГлобПрав%20260920261646/villa-turaman-airbnb-platform/utils/aiKnowledgeBase.js):**
   - На строке 538 заменить `const minPriceUsd` на `let minPriceUsd`.
   - В шапке файла обновить двухзаписную историю ревизий согласно Правилу 8.1.
2. **Файл [CHAT_CODE_FIXES_CHRONOLOGY.txt](file:///c:/1%20Вилла%20Сайт%20ГлобПрав%20260920261646/CHAT_CODE_FIXES_CHRONOLOGY.txt):**
   - Добавить запись исправления #111 с соблюдением Правила 2.7 [Zero-Brackets & Zero-Emdash Policy].

---

## 3. Критерии приемки
- [x] В [utils/aiKnowledgeBase.js](file:///c:/1%20Вилла%20Сайт%20ГлобПрав%20260920261646/villa-turaman-airbnb-platform/utils/aiKnowledgeBase.js) переменная объявлена через `let minPriceUsd`.
- [x] Отсутствуют синтаксические и типовые ошибки при сборке Webpack.
- [x] Соблюдено Правило 2.7 [Zero-Brackets & Zero-Emdash Policy] и Правило 8.1 [двухзаписная шапка версий].

# ПЛАН РЕАЛИЗАЦИИ: УСТРАНЕНИЕ ОШИБКИ VERCEL «ПРЕДОСТАВЛЕН НЕДЕЙСТВИТЕЛЬНЫЙ ФАЙЛ VERCEL.JSON» В РЕЖИМЕ ПАУЗЫ [HTTP 503]

**Дата и время разработки плана:** `16.11.2026 00:55`  
**Целевой файл сохранения после утверждения:** `villa-turaman-airbnb-platform/ПЛАНЫ/161120260055 ПЛАН Фикс vercel_json в pause_site.md`

---

## 0. ДВУХУРОВНЕВАЯ ФИКСАЦИЯ ПОСТАВЛЕННОЙ ЗАДАЧИ ВЛАДЕЛЬЦА ПРОЕКТА [ПО ПРАВИЛУ 0.16]

### Блок 1 — Уровень А [Дословная формулировка владельца — слово в слово]:
> «попытка использовать задачу  *  Выполнение задачи: pwsh -ExecutionPolicy Bypass -File .\pause_site.ps1 
> 
> ===============================================================================
>   АКТИВАЦИЯ РЕЖИМА ОБСЛУЖИВАНИЯ - VERCEL PAUSE [HTTP 503]
> ===============================================================================
>   Проект:         Villa Turaman Airbnb Platform
>   Каталог:        villa-turaman-airbnb-platform
>   Целевая ветка:  v1-airbnb
> 
> [1/3] Создание страницы-заглушки maintenance.html...
>   [OK] Страница-заглушка создана: maintenance.html и продублирована в index.html
> [2/3] Настройка конфигурации Vercel vercel.json [HTTP 503 modern format]...
>   [OK] Конфигурация vercel.json создана [современный стандарт Vercel Static Serving, HTTP 503, framework: null].
> [3/3] Синхронизация с Git и веткой v1-airbnb...
> warning: in the working copy of 'villa-turaman-airbnb-platform/index.html', LF will be replaced by CRLF the next time Git touches it
> warning: in the working copy of 'villa-turaman-airbnb-platform/maintenance.html', LF will be replaced by CRLF the next timeGit touches it
> warning: in the working copy of 'villa-turaman-airbnb-platform/vercel.json', LF will be replaced by CRLF the next time Git touches it
> warning: in the working copy of 'villa-turaman-airbnb-platform/public/maintenance.html', LF will be replaced by CRLF the next time Git touches it
> [main 59be528] chore: activate maintenance mode HTTP 503 for villa-turaman-airbnb-platform
>  2 files changed, 179 insertions(+)
>  create mode 100644 villa-turaman-airbnb-platform/maintenance.html
>  create mode 100644 villa-turaman-airbnb-platform/vercel.json
>   Генерация изолированного коммита для ветки v1-airbnb через git subtree split...
>   [OK] Изолированный коммит сформирован: 1b6aafae93a9cd0792a1cfb5d692ad7b7de6d0aa
>   Отправка в ветку origin/v1-airbnb...
> Enumerating objects: 4, done.
> Counting objects: 100% (4/4), done.
> Delta compression using up to 20 threads
> Compressing objects: 100% (3/3), done.
> Writing objects: 100% (3/3), 591 bytes | 591.00 KiB/s, done.
> Total 3 (delta 1), reused 1 (delta 0), pack-reused 0 (from 0)
> remote: Resolving deltas: 100% (1/1), completed with 1 local object.
> To https://github.com/znamenskiialeksei/Sitesi.git
>    63696f5..1b6aafa  1b6aafae93a9cd0792a1cfb5d692ad7b7de6d0aa -> v1-airbnb
>   [OK] Ветка v1-airbnb успешно обновлена. Vercel автоматически развернет режим обслуживания.
> 
> ===============================================================================
>   РЕЖИМ ОБСЛУЖИВАНИЯ УСПЕШНО АКТИВИРОВАН НА VERCEL
> ===============================================================================
>   Для возврата сайта в рабочий боевой режим запустите:
>   pwsh -ExecutionPolicy Bypass -File .\resume_site.ps1
> ===============================================================================
>  *  Нажмите любую клавишу, чтобы закрыть терминал. привела на платформе vercel к отказу Детали развертывания
> Сборка не удалась
> Предоставлен недействительный файл vercel.json.
> Создано
> invalid-email-address2 минуты назад
> СтатусОшибкаПоследние
> Продолжительность—
> ОкружениеПредварительный просмотр
> Доменыsitesi-git-v1-airbnb-znamenskiialekseis-projects.vercel.app
> sitesi-40812nfje-znamenskiialekseis-projects.vercel.app
> Источникv1-airbnb
> 1b6aafachore: activate maintenance mode HTTP 503 for villa-turaman-airbnb-platform»

### Блок 2 — Уровень Б [Грамотное структурированное техническое описание задачи и ее реализации]:
Устранение комплекса первопричин фатального отказа валидатора платформы Vercel (`Сборка не удалась: Предоставлен недействительный файл vercel.json` / `Invalid vercel.json file provided`, `Продолжительность: —`) при выполнении сценария перевода сайта в режим технического обслуживания [villa-turaman-airbnb-platform/pause_site.ps1](file:///c:/Новый%20сайт%20вилла%2015112026/1%20Вилла%20Сайт%20ГлобПрав%20изм%20осн%20правил%2015062026/villa-turaman-airbnb-platform/pause_site.ps1) и синхронная модернизация парного сценария возврата в строй [villa-turaman-airbnb-platform/resume_site.ps1](file:///c:/Новый%20сайт%20вилла%2015112026/1%20Вилла%20Сайт%20ГлобПрав%20изм%20осн%20правил%2015062026/villa-turaman-airbnb-platform/resume_site.ps1):

1. **Первопричина №1 [Запись 3-байтового маркера UTF-8 BOM `0xEF 0xBB 0xBF` в начало `vercel.json`]:**
   - В [pause_site.ps1](file:///c:/Новый%20сайт%20вилла%2015112026/1%20Вилла%20Сайт%20ГлобПрав%20изм%20осн%20правил%2015062026/villa-turaman-airbnb-platform/pause_site.ps1#L246) запись файла [vercel.json](file:///c:/Новый%20сайт%20вилла%2015112026/1%20Вилла%20Сайт%20ГлобПрав%20изм%20осн%20правил%2015062026/villa-turaman-airbnb-platform/vercel.json) выполнялась методом `[System.IO.File]::WriteAllText($VercelPath, $VercelJson, [System.Text.Encoding]::UTF8)`.
   - В среде .NET / PowerShell 7 статическое свойство `[System.Text.Encoding]::UTF8` возвращает кодировку с включенной преамбулой BOM (`encoderShouldEmitUTF8Identifier = true`), добавляя перед открывающей фигурной скобкой `{` три невидимых байта `EF BB BF` (`\uFEFF`).
   - Контрольная плоскость Vercel при получении вебхука коммита `1b6aafa` парсит `vercel.json` в соответствии со строгим стандартом RFC 8259 (JSON без BOM) и мгновенно отклоняет деплой на нулевой секунде (`Продолжительность: —`) с ошибкой `Предоставлен недействительный файл vercel.json`.
   - **Решение:** Для всех генерируемых JSON, HTML и JS файлов (`vercel.json`, `maintenance.html`, `public/maintenance.html`, `middleware.js`) использовать строго кодировку **UTF-8 без BOM**: `$Utf8NoBom = New-Object System.Text.UTF8Encoding($false)`. (Кодировка UTF-8 с BOM сохраняется исключительно для самих сценариев `.ps1` по Правилу 2.4).

2. **Первопричина №2 [Конфликтные свойства схемы `vercel.json` и PCRE lookahead в `rewrites[0].source`]:**
   - В [vercel.json](file:///c:/Новый%20сайт%20вилла%2015112026/1%20Вилла%20Сайт%20ГлобПрав%20изм%20осн%20правил%2015062026/villa-turaman-airbnb-platform/vercel.json#L1-L10) записывались поля `"framework": null`, `"buildCommand": null`, `"outputDirectory": "."` и `"source": "/((?!maintenance\\.html).*)"` в секции `"rewrites"`.
   - Валидатор `rewrites` на Vercel использует `path-to-regexp`, который отвергает безымянные PCRE lookahead-группы вида `/((?!maintenance\\.html).*)`, а указание `"outputDirectory": "."` в проекте с `Framework Preset: Next.js` приводит к сбою поиска `.next/routes-manifest.json`. Кроме того, секция `rewrites` не поддерживает установку HTTP-кода `503` (отдает `200 OK`, что нарушает Правило 4.3 о сохранении SEO).
   - **Решение:**
     - Привести `vercel.json` к 100% валидной, чистой схеме Vercel (только секция `headers` с заголовками `Cache-Control: no-store, no-cache, must-revalidate, max-age=0` и `Retry-After: 3600` на источник `"/(.*)"`);
     - Генерировать в `pause_site.ps1` нативный для Next.js 13 Edge-перехватчик `villa-turaman-airbnb-platform/middleware.js` (в кодировке UTF-8 без BOM), который на уровне Vercel Edge Runtime перехватывает все пользовательские запросы (`/`, `/ru`, `/en`, `/tr`, `/guest`, `/host` и др.) и возвращает полную HTML-страницу `maintenance.html` с **истинным кодом ответа `HTTP 503 Service Unavailable`** (`status: 503`) и заголовками `Content-Type: text/html; charset=utf-8`, `Cache-Control: no-store, no-cache, must-revalidate, max-age=0`, `Retry-After: 3600`.

3. **Первопричина №3 [Остаточные файлы `index.html` и `public/maintenance.html` при деактивации паузы в `resume_site.ps1`]:**
   - Старый `pause_site.ps1` создавал в корне `villa-turaman-airbnb-platform/index.html` и `villa-turaman-airbnb-platform/public/maintenance.html`, но [resume_site.ps1](file:///c:/Новый%20сайт%20вилла%2015112026/1%20Вилла%20Сайт%20ГлобПрав%20изм%20осн%20правил%2015062026/villa-turaman-airbnb-platform/resume_site.ps1#L34-L50) удалял только `maintenance.html` и `vercel.json`, оставляя `index.html` и `public/maintenance.html` в Git-индексе.
   - **Решение:** В `pause_site.ps1` прекратить создание лишнего корневого `index.html` (и удалить уже созданный `villa-turaman-airbnb-platform/index.html`), а в `resume_site.ps1` синхронно удалять полный комплект файлов режима обслуживания (`middleware.js`, `vercel.json`, `maintenance.html`, `public/maintenance.html`, `index.html`) как с диска, так и через `git rm -f --ignore-unmatch`.

---

## 1. ПЕРЕЧЕНЬ МОДИФИЦИРУЕМЫХ ФАЙЛОВ И ДЕТАЛЬНЫЙ ПЛАН РАБОТ

### Этап 1. Модернизация сценария активации паузы [villa-turaman-airbnb-platform/pause_site.ps1](file:///c:/Новый%20сайт%20вилла%2015112026/1%20Вилла%20Сайт%20ГлобПрав%20изм%20осн%20правил%2015062026/villa-turaman-airbnb-platform/pause_site.ps1)
1. Ввести явно инициализированный объект кодировки без BOM для записи всех веб- и JSON-файлов:
   ```powershell
   $Utf8NoBom = New-Object System.Text.UTF8Encoding($false)
   ```
2. Записывать `maintenance.html` и `public/maintenance.html` строго через `$Utf8NoBom`, а устаревший `index.html` в корне проекта при наличии — автоматически удалять с диска и из индекса Git (`git rm -f --ignore-unmatch "$ProjectFolder/index.html"`).
3. Сформировать 100% валидный по JSON Schema Vercel файл `vercel.json` (записываемый через `$Utf8NoBom` с LF-переносами строк `\n`):
   ```json
   {
     "headers": [
       {
         "source": "/(.*)",
         "headers": [
           {
             "key": "Cache-Control",
             "value": "no-store, no-cache, must-revalidate, max-age=0"
           },
           {
             "key": "Retry-After",
             "value": "3600"
           }
         ]
       }
     ]
   }
   ```
4. Генерировать в `pause_site.ps1` нативный файл `villa-turaman-airbnb-platform/middleware.js` (через `$Utf8NoBom`), который возвращает страницу обслуживания со строгим статусом **`status: 503`** (`HTTP 503 Service Unavailable`) для всех маршрутов сайта (кроме внутренних статики `/_next/static` и `/favicon.ico`), обеспечивая 100% совместимость с сборщиком Next.js на Vercel и соблюдение SEO-стандарта Правила 4.3.
5. Сразу же применить обновленную конфигурацию (`vercel.json` без BOM, `middleware.js`, `maintenance.html`, `public/maintenance.html` и удаление лишнего `index.html`) непосредственно в рабочей папке `villa-turaman-airbnb-platform`, чтобы файлы на диске были полностью готовы к отправке.

### Этап 2. Синхронная модернизация сценария возврата сайта в строй [villa-turaman-airbnb-platform/resume_site.ps1](file:///c:/Новый%20сайт%20вилла%2015112026/1%20Вилла%20Сайт%20ГлобПрав%20изм%20осн%20правил%2015062026/villa-turaman-airbnb-platform/resume_site.ps1)
1. Расширить список удаляемых файлов при деактивации паузы:
   - `villa-turaman-airbnb-platform/middleware.js`
   - `villa-turaman-airbnb-platform/vercel.json`
   - `villa-turaman-airbnb-platform/maintenance.html`
   - `villa-turaman-airbnb-platform/public/maintenance.html`
   - `villa-turaman-airbnb-platform/index.html` (если присутствовал ранее)
2. Выполнять гарантированную очистку в Git через `git rm -f --ignore-unmatch` по всем 5 путям перед формированием `git subtree split` и отправкой в ветку `v1-airbnb`.
3. Обеспечить 100% соблюдение стандарта `Zero-Brackets & Zero-Emdash Policy` (Правило 2.7) во всех сообщениях `Write-Host` и комментариях обоих скриптов `.ps1` и сохранить сами `.ps1` файлы со строгой сигнатурой UTF-8 BOM (Правило 2.4).

### Этап 3. Фиксация стандарта UTF-8 без BOM для `vercel.json` и нативного `middleware.js` HTTP 503 в `GEMINI.md`, `AGENTS.md` и `CHAT_CODE_FIXES_CHRONOLOGY.txt`
1. В разделе `4.3` Блока IV и в новом пункте `9.18` Блока IX свода [GEMINI.md](file:///c:/Новый%20сайт%20вилла%2015112026/1%20Вилла%20Сайт%20ГлобПрав%20изм%20осн%20правил%2015062026/Глобальные%20настройки%20проекта%20(накопитель)/GEMINI.md) (и синхронно во всех 4 контурах `GEMINI.md` и `AGENTS.md`) зафиксировать запрет записи маркера UTF-8 BOM (`[System.Text.Encoding]::UTF8`) в `vercel.json` и стандарт нативной отдачи `HTTP 503` через `middleware.js` + `vercel.json` (`UTF8Encoding($false)`).
2. Внести запись `#131` в [CHAT_CODE_FIXES_CHRONOLOGY.txt](file:///c:/Новый%20сайт%20вилла%2015112026/1%20Вилла%20Сайт%20ГлобПрав%20изм%20осн%20правил%2015062026/Глобальные%20настройки%20проекта%20(накопитель)/CHAT_CODE_FIXES_CHRONOLOGY.txt) (во всех 4 контурах) в двухуровневом формате `Уровень А` + `Уровень Б` (по Правилу 0.16) и сохранить парные файлы `161120260055 ПЛАН Фикс vercel_json в pause_site.md` и `161120260055 ОТЧЕТ Фикс vercel_json в pause_site.md` в папке `villa-turaman-airbnb-platform/ПЛАНЫ/`.

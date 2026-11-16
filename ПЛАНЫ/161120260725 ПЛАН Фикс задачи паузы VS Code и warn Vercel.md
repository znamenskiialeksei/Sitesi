# ПЛАН РЕАЛИЗАЦИИ: ИСПРАВЛЕНИЕ ЗАПУСКА PAUSE_SITE.PS1 ЧЕРЕЗ ЗАДАЧИ VS CODE [СПОСОБ 2] И ЛИКВИДАЦИЯ 5 ПРЕДУПРЕЖДЕНИЙ СБОРКИ НА VERCEL

**Дата и время разработки плана:** `16.11.2026 07:25`  
**Целевой файл сохранения после утверждения:** `villa-turaman-airbnb-platform/ПЛАНЫ/161120260725 ПЛАН Фикс задачи паузы VS Code и warn Vercel.md`

---

## 0. ДВУХУРОВНЕВАЯ ФИКСАЦИЯ ПОСТАВЛЕННОЙ ЗАДАЧИ ВЛАДЕЛЬЦА ПРОЕКТА [ПО ПРАВИЛУ 0.16]

### Блок 1 — Уровень А [Дословная формулировка владельца — слово в слово]:
> «в дополнение в план запуск паузы не сработал при Способ 2 [Задача в .vscode/tasks.json]. при выполнении Способ 3 [Команда для встроенного терминала PowerShell 7 pwsh.exe] pause_site.ps1 всё сработало вот отчёт(Журналы сборки
> 54 с
> 104 строки
> 1
> 5
> Найти в журналах
> Ctrl
> F
> 07:11:17.870
> Сборка ведется в Вашингтоне, округ Колумбия, США (Восток) – iad1
> 07:11:17.870
> Конфигурация сборочной машины: 2 ядра, 8 ГБ оперативной памяти.
> 07:11:17.996
> Клонирование репозитория github.com/znamenskiialeksei/Sitesi (Ветка: v1-airbnb, Коммит: 16e4295)
> 07:11:18.621
> Клонирование завершено: 625,000 мс
> 07:11:18.946
> Восстановлен кэш сборки из предыдущего развертывания (EzbJf37eqHhf2WMZWTpHLFu1Zh8c)
> 07:11:19.388
> Запуск команды "vercel build"
> 07:11:19.397
> Vercel CLI 65.14.0
> 07:11:19.669
> Установка зависимостей...
> 07:11:20.217
> npm warn Неизвестная конфигурация окружения "cache-dir". Это перестанет работать в следующей основной версии npm. См. `npm help npmrc` для получения информации о поддерживаемых параметрах конфигурации.
> 07:11:20.952
> обновлено за 1 секунду
> 07:11:20.952
> Финансирование доступно для 175 проектов.
>   Для получения подробной информации выполните команду `npm fund`.
> 07:11:20.954
> npm warn install-scripts 1 package has install scripts not yet covered by allowScripts:
> 07:11:20.954
> npm warn install-scripts unrs-resolver@1.12.2 (postinstall: node postinstall.js)
> 07:11:20.954
> npm warn install-scripts
> 07:11:20.955
> npm warn install-scripts Выполните команду `npm install-scripts ls` для проверки или `npm install-scripts approve <pkg>` для разрешения.
> 07:11:20.990
> Обнаружена версия Next.js: 14.2.35
> 07:11:20.997
> Выполнение команды «npm run build»
> ).  аостановление работы сработало и при способе 2 Журналы сборки
> 46 с
> 97 строк
> 1
> 5
> Найти в журналах
> Ctrl
> F
> Сборка ведется в Вашингтоне, округ Колумбия, США (Восток) – iad1
> Конфигурация сборочной машины: 2 ядра, 8 ГБ оперативной памяти.
> Клонирование репозитория github.com/znamenskiialeksei/Sitesi (Ветка: v1-airbnb, Коммит: ed8572b)
> Клонирование завершено: 607,000 мс
> Восстановлен кэш сборки из предыдущего развертывания (2bCiso16Vf3f4VgDC4awAD8ACofT)
> Запуск команды "vercel build"
> Vercel CLI 65.14.0
> Установка зависимостей...
> npm warn Неизвестная конфигурация окружения "cache-dir". Это перестанет работать в следующей основной версии npm. См. `npm help npmrc` для получения информации о поддерживаемых параметрах конфигурации.
> обновлено за 1 секунду
> Финансирование доступно для 175 проектов.
>   Для получения подробной информации выполните команду `npm fund`.
> npm warn install-scripts 1 package has install scripts not yet covered by allowScripts:
> npm warn install-scripts unrs-resolver@1.12.2 (postinstall: node postinstall.js)
> npm warn install-scripts
> npm warn install-scripts Выполните команду `npm install-scripts ls` для проверки или `npm install-scripts approve <pkg>` для разрешения.
> Обнаружена версия Next.js: 14.2.35
> Выполнение команды «npm run build»
> npm warn Неизвестная конфигурация окружения "cache-dir". Это перестанет работать в следующей основной версии npm. См. `npm help npmrc` для получения информации о поддерживаемых параметрах конфигурации.
> но замечания есть в журналах сборки и татм итам»

### Блок 2 — Уровень Б [Грамотное структурированное техническое описание задачи и ее реализации]:
Устранение двух диагностированных проблем при управлении режимом технического обслуживания и сборке проекта `villa-turaman-airbnb-platform` на платформе Vercel:

1. **Первопричина №1 [Почему `pause_site.ps1` не сработал через Способ 2 (Задачи `.vscode/tasks.json`), тогда как через Способ 3 (`pwsh.exe`) и `resume_site.ps1` через Способ 2 сработали штатно]:**
   - В [villa-turaman-airbnb-platform/pause_site.ps1](file:///c:/Новый%20сайт%20вилла%2015112026/1%20Вилла%20Сайт%20ГлобПрав%20изм%20осн%20правил%2015062026/villa-turaman-airbnb-platform/pause_site.ps1#L10) в начале скрипта стояла жесткая директива `$ErrorActionPreference = "Stop"`, отсутствующая в рабочем [resume_site.ps1](file:///c:/Новый%20сайт%20вилла%2015112026/1%20Вилла%20Сайт%20ГлобПрав%20изм%20осн%20правил%2015062026/villa-turaman-airbnb-platform/resume_site.ps1#L9-L11). При запуске через Task Runner VS Code (`type: "shell"`) перенаправление потока ошибок `2>$null` в командах `git` (когда Git выводит в `stderr` уведомления `warning: LF will be replaced by CRLF` или прогресс `git subtree split`) при активном `$ErrorActionPreference = "Stop"` генерирует прерывающую ошибку `NativeCommandError`, останавливая скрипт до отправки коммита в `v1-airbnb`.
   - Кроме того, в `pause_site.ps1` использовались вызовы `Test-Path` и `Push-Location` без ключа `-LiteralPath` и отсутствовал переход `Set-Location -LiteralPath $ProjectRoot`, который есть в `resume_site.ps1`, а в [villa-turaman-airbnb-platform/.vscode/tasks.json](file:///c:/Новый%20сайт%20вилла%2015112026/1%20Вилла%20Сайт%20ГлобПрав%20изм%20осн%20правил%2015062026/villa-turaman-airbnb-platform/.vscode/tasks.json#L171-L189) у задач паузы и возобновления отсутствовал блок `"options": { "cwd": "${workspaceFolder}" }`.
   - **Решение:** Привести архитектуру инициализации путей, кодировки и Git-блока в `pause_site.ps1` к 100% паритету с эталонным рабочим `resume_site.ps1` (без `$ErrorActionPreference = "Stop"`, со строгим `Set-Location -LiteralPath $ProjectRoot` и `-LiteralPath` на всех файловых операциях) и синхронизировать задачи паузы/возобновления во всех трех файлах `.vscode/tasks.json`.

2. **Первопричина №2 [5 предупреждений `npm warn` в журналах сборки Vercel CLI 65.14.0 как при паузе `16e4295`, так и при возобновлении `ed8572b`]:**
   - **Замечания 1 и 5 (`npm warn Неизвестная конфигурация окружения "cache-dir"` при `npm install` и `npm run build`) + уведомление `npm fund`:** Сборочный контейнер Vercel CLI 65.14.0 экспортирует переменную окружения `npm_config_cache_dir`, которую новая версия `npm` помечает предупреждением `Unknown env config "cache-dir"`.
   - **Замечания 2–4 (`npm warn install-scripts: 1 package has install scripts not yet covered by allowScripts: unrs-resolver@1.12.2 (postinstall: node postinstall.js)`):** Валидатор `@vercel/install-scripts` проверяет поле `"allowScripts"` в `package.json` и выдает 4 строки предупреждений для транзитивного пакета `unrs-resolver@1.12.2`.
   - **Решение:**
     1. В [villa-turaman-airbnb-platform/package.json](file:///c:/Новый%20сайт%20вилла%2015112026/1%20Вилла%20Сайт%20ГлобПрав%20изм%20осн%20правил%2015062026/villa-turaman-airbnb-platform/package.json) добавить секцию `"allowScripts": { "unrs-resolver": true }`, официально регистрирующую `unrs-resolver` для Vercel CLI;
     2. Создать в корне проекта файл `villa-turaman-airbnb-platform/.npmrc` (в кодировке UTF-8 без BOM) с параметрами:
        ```ini
        loglevel=error
        fund=false
        audit=false
        ```
        и добавить в `.gitattributes` правило `* text=auto eol=lf` для исключения предупреждений Git `LF will be replaced by CRLF`.

---

## 1. ПЕРЕЧЕНЬ МОДИФИЦИРУЕМЫХ И СОЗДАВАЕМЫХ ФАЙЛОВ

### Этап 1. Приведение [villa-turaman-airbnb-platform/pause_site.ps1](file:///c:/Новый%20сайт%20вилла%2015112026/1%20Вилла%20Сайт%20ГлобПрав%20изм%20осн%20правил%2015062026/villa-turaman-airbnb-platform/pause_site.ps1) к 100% паритету с рабочим `resume_site.ps1` для безотказного запуска через Способ 2 (`.vscode/tasks.json`)
1. Удалить `$ErrorActionPreference = "Stop"`, вызывавшую падение в Task Runner VS Code при перенаправлении `stderr` команд `git`.
2. Внедрить идентичный `resume_site.ps1` блок определения `$ProjectRoot` и `$WorkspaceRoot` через `Set-Location -LiteralPath $ProjectRoot` и `Test-Path -LiteralPath`.
3. Использовать литеральный шаблон `@' ... '@` с `.Replace('__MAINTENANCE_HTML__', $NormalizedHtml)` для генерации `middleware.js` и записывать `vercel.json`, `middleware.js`, `maintenance.html`, `public/maintenance.html` в кодировке UTF-8 без BOM (`$Utf8NoBom`).
4. Синхронизировать задачи `17` (Пауза) и `18` (Возобновление) в:
   - [.vscode/tasks.json](file:///c:/Новый%20сайт%20вилла%2015112026/1%20Вилла%20Сайт%20ГлобПрав%20изм%20осн%20правил%2015062026/.vscode/tasks.json)
   - [Глобальные настройки проекта (накопитель)/.vscode/tasks.json](file:///c:/Новый%20сайт%20вилла%2015112026/1%20Вилла%20Сайт%20ГлобПрав%20изм%20осн%20правил%2015062026/Глобальные%20настройки%20проекта%20(накопитель)/.vscode/tasks.json)
   - [villa-turaman-airbnb-platform/.vscode/tasks.json](file:///c:/Новый%20сайт%20вилла%2015112026/1%20Вилла%20Сайт%20ГлобПрав%20изм%20осн%20правил%2015062026/villa-turaman-airbnb-platform/.vscode/tasks.json)

### Этап 2. Ликвидация всех предупреждений `npm warn` в журналах сборки Vercel
1. В [villa-turaman-airbnb-platform/package.json](file:///c:/Новый%20сайт%20вилла%2015112026/1%20Вилла%20Сайт%20ГлобПрав%20изм%20осн%20правил%2015062026/villa-turaman-airbnb-platform/package.json) добавить поле:
   ```json
   "allowScripts": {
     "unrs-resolver": true
   }
   ```
2. Создать файл `villa-turaman-airbnb-platform/.npmrc` (в кодировке UTF-8 без BOM):
   ```ini
   loglevel=error
   fund=false
   audit=false
   ```
   и убедиться, что `pause_site.ps1` и `resume_site.ps1` включают `.npmrc` и `package.json` в коммит ветки `v1-airbnb`.

### Этап 3. Синхронизация нормативной базы (`GEMINI.md`, `AGENTS.md`, `CHAT_CODE_FIXES_CHRONOLOGY.txt`) и сохранение парного отчета
1. Дополнить правило `9.18` во всех 4 контурах [GEMINI.md](file:///c:/Новый%20сайт%20вилла%2015112026/1%20Вилла%20Сайт%20ГлобПрав%20изм%20осн%20правил%2015062026/Глобальные%20настройки%20проекта%20(накопитель)/GEMINI.md) и [AGENTS.md](file:///c:/Новый%20сайт%20вилла%2015112026/1%20Вилла%20Сайт%20ГлобПрав%20изм%20осн%20правил%2015062026/Глобальные%20настройки%20проекта%20(накопитель)/AGENTS.md) требованием отсутствия `$ErrorActionPreference = "Stop"` перед командами `git` в скриптах деплоя/паузы и стандартом `.npmrc` + `allowScripts` для чистоты журналов сборки Vercel.
2. Внести запись `#132` (в двухуровневом формате `Уровень А` + `Уровень Б` по п. 0.16) во все 4 контура [CHAT_CODE_FIXES_CHRONOLOGY.txt](file:///c:/Новый%20сайт%20вилла%2015112026/1%20Вилла%20Сайт%20ГлобПрав%20изм%20осн%20правил%2015062026/Глобальные%20настройки%20проекта%20(накопитель)/CHAT_CODE_FIXES_CHRONOLOGY.txt) и сохранить парные файлы `161120260725 ПЛАН Фикс задачи паузы VS Code и warn Vercel.md` и `161120260725 ОТЧЕТ Фикс задачи паузы VS Code и warn Vercel.md`.

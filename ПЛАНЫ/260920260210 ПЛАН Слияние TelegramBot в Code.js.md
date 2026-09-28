# ПЛАН #108D [260920260210]: ПОЛНОЕ 100% СЛИЯНИЕ TELEGRAMBOT.JS В ЕДИНЫЙ МОНОЛИТ CODE.JS

> **Статус документа:** УТВЕРЖДЕН ПОЛЬЗОВАТЕЛЕМ И РЕАЛИЗОВАН  
> **Дата и время этапа:** 26.09.2026 02:10  
> **Первоисточник этапа:** [260920260210 Слияние TelegramBot в Code.js.md](file:///c:/1%20Вилла%20Сайт%20ГлобПрав%20260920261646/villa-turaman-airbnb-platform/ПЛАНЫ/260920260210%20Слияние%20TelegramBot%20в%20Code.js.md)  
> **Область действия:** `google-apps-script/Code.js`, упразднение `TelegramBot.js`, документация  
> **Связанные директивы:** GEMINI.md Правила 1.1, 1.2, 1.3, 1.5, 1.6, 2.7, 3.13, 9.12  

---

## 1. ЦЕЛЬ И ЗАДАЧИ ЭТАПА
1. **Реакция на замечание пользователя:**  
   Пользователь обратил внимание на разделение файлов: *«я так и непонял у меня должен быть установлен villa-turaman-airbnb-platform/google-apps-script/TelegramBot.js? почему его не вписать в Code.js»*.
2. **Ликвидация внешней зависимости:**  
   Перенести все 20 бизнес-функций Telegram-бота непосредственно в монолит [Code.js](file:///c:/1%20Вилла%20Сайт%20ГлобПрав%20260920261646/villa-turaman-airbnb-platform/google-apps-script/Code.js), полностью исключив необходимость установки `TelegramBot.js` в Google Apps Script.
3. **Исключение дублирования кода:**  
   Проверить наличие функции `checkVercelEnvStatusInteractive` в `Code.js` [строка 1247] и исключить дублирующие объявления.
4. **Упразднение внешнего файла:**  
   Пометить [TelegramBot.js](file:///c:/1%20Вилла%20Сайт%20ГлобПрав%20260920261646/villa-turaman-airbnb-platform/google-apps-script/TelegramBot.js) как архивный файл с переносом всего кода в `Code.js`.
5. **Обновление инструкций:**  
   В `СВОЙСТВА_СКРИПТА_И_ИНСТРУКЦИЯ.md` зафиксировать правило строго одного файла для развертывания в Google Apps Script.

---

## 2. ПОШАГОВЫЙ ПЛАН РЕАЛИЗАЦИИ
1. **Перенос 20 функций в Code.js:**
   - `getTelegramConfig_`: чтение Script Properties;
   - `sendTelegramMessage_`: отправка запросов в Telegram Bot API;
   - `buildTelegramReplyKeyboard_`: построение Reply-клавиатуры для смартфона;
   - `sendTelegramBotMenuToOwner`: пульт владельца с инлайн-кнопками;
   - `refreshTelegramKeyboard`: обновление мобильной клавиатуры;
   - `registerTelegramBotCommands`: регистрация команд через setMyCommands;
   - `sendTelegramPendingRequests`: выгрузка заявок с инлайн-кнопками 24ч HOLD;
   - `auditTelegramCalendarHolds`: экспресс-аудит истекших блокировок дат;
   - `sendTelegramRecentChats`: сводка обращений гостей из CRM;
   - `sendTelegramDirectMessageDialog`: ответ гостю прямо из таблицы;
   - `sendTelegramBroadcastDialog`: рассылка по активным диалогам;
   - `sendTelegramCalendarSummary`: шахматка занятости на 30 дней;
   - `sendTelegramRatesSummary`: сводка тарифов, правил заезда и депозита;
   - `triggerTelegramRevalidate`: мгновенная ревалидация сайта из Telegram;
   - `checkTelegramHostCabinetStatus`: проверка доступа к Кабинету Хозяина;
   - `setTelegramWebhookToSite`: настройка Webhook на Next.js API сайта;
   - `checkTelegramWebhookStatus`: проверка статуса через getWebhookInfo;
   - `deleteTelegramWebhook`: удаление Webhook и перевод на Polling;
   - `setupTelegramPropertiesInteractive`: интерактивная настройка токенов;
   - `sendTelegramTestPing`: тестовый пинг связи таблицы с Telegram.
2. **Проверка целостности монолита:**
   - Убедиться в отсутствии синтаксических ошибок и конфликтов имен.
3. **Упразднение TelegramBot.js:**
   - Добавить маркер архивного статуса и ссылку на монолит.

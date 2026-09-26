# План реализации: Полное 100% слияние TelegramBot.js в единый монолит Code.js

## 1. Контекст и анализ вопроса пользователя

> **Вопрос пользователя:**  
> *«я так и непонял у меня должен быть установлен villa-turaman-airbnb-platform/google-apps-script/TelegramBot.js? почему его не вписать в Code.js»*

### Прямой и исчерпывающий ответ:
**НЕТ, отдельный файл TelegramBot.js устанавливать НЕ нужно!**  
Замечание пользователя абсолютно точное:
Ранее в Code.js была перенесена только функция регистрации меню и справочные карточки VS Code, а сами функции-обработчики кнопок меню Telegram [20 функций, включая отправку заявок, аудит HOLD, чаты с гостями, Webhook и пинг] оставались в файле TelegramBot.js.

По стандарту Правила 3.13 [Apps Script Monolith SSOT Policy] и Правила 1.2 [Total Root Cause Elimination Policy] в Google Apps Script должен быть **СТРОГО ОДИН ЕДИНСТВЕННЫЙ ФАЙЛ: Code.js**.

---

## 2. Реализованное решение

### 2.1. Полный перенос всех функций из TelegramBot.js в Code.js
В единый монолитный файл Code.js перенесены все 20 бизнес-функций Telegram-бота:
1. `getTelegramConfig_()` : защищенное чтение токена, chat_id и siteUrl из Script Properties;
2. `sendTelegramMessage_(text, replyMarkup)` : ядро отправки запросов в Telegram Bot API;
3. `buildTelegramReplyKeyboard_()` : построение постоянной Reply-клавиатуры для смартфона;
4. `sendTelegramBotMenuToOwner()` : отправка интерактивного пульта владельца с инлайн-кнопками;
5. `refreshTelegramKeyboard()` : принудительное обновление мобильной клавиатуры;
6. `registerTelegramBotCommands()` : автоматическая регистрация команд бота через setMyCommands;
7. `sendTelegramPendingRequests()` : выгрузка активных заявок на модерации с инлайн-кнопками 24ч HOLD;
8. `auditTelegramCalendarHolds()` : экспресс-аудит истекших блокировок дат;
9. `sendTelegramRecentChats()` : сводка последних обращений гостей из листов CRM;
10. `sendTelegramDirectMessageDialog()` : отправка персонального ответа гостю прямо из таблицы;
11. `sendTelegramBroadcastDialog()` : массовая рассылка по всем активным диалогам;
12. `sendTelegramCalendarSummary()` : выгрузка шахматки занятости на 30 дней;
13. `sendTelegramRatesSummary()` : сводка тарифов, правил заезда и депозита;
14. `triggerTelegramRevalidate()` : запуск мгновенной ревалидации сайта из Telegram;
15. `checkTelegramHostCabinetStatus()` : проверка статуса доступа к Кабинету Хозяина;
16. `setTelegramWebhookToSite()` : настройка Webhook на Next.js API сайта;
17. `checkTelegramWebhookStatus()` : проверка статуса через getWebhookInfo;
18. `deleteTelegramWebhook()` : удаление Webhook и перевод на Polling;
19. `setupTelegramPropertiesInteractive()` : интерактивная настройка токенов в Script Properties;
20. `sendTelegramTestPing()` : тестовый пинг связи таблицы с Telegram.

### 2.2. Ликвидация риска дублирования
Функция checkVercelEnvStatusInteractive уже присутствовала в Code.js [строка 1247]. Дублирование исключено.

### 2.3. Упразднение файла TelegramBot.js
Файл снабжен предупреждением об архивном статусе: весь код перенесен в Code.js. В редактор Apps Script копируется строго Code.js.

### 2.4. Обновление документации
В СВОЙСТВА_СКРИПТА_И_ИНСТРУКЦИЯ.md зафиксировано правило строго одного файла.

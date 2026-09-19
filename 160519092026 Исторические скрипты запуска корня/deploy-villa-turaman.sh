#!/bin/bash
echo "🚀 Старт сборки платформы Villa Turaman (Unified Version Aleksei Znamenskii - Расширенная Архитектура)..."

# 1. Создание базового проекта
npx create-next-app@14 villa-turaman-platform --use-npm --eslint --tailwind --app=false --src-dir=false --router=pages --import-alias="@/*" --yes
cd villa-turaman-platform || exit

echo "📦 Установка расширенных библиотек..."
npm install googleapis node-ical lucide-react react-datepicker date-fns@2.30.0 axios @vercel/kv \
    bcryptjs jsonwebtoken stripe @paypal/checkout-server-sdk iyzipay yookassa pdfkit dotenv \
    speakeasy qrcode force-graph
npm install -D typescript @types/node @types/react

echo "⚙️ Настройка запуска скрипта инициализации..."
npm pkg set scripts.postinstall="node scripts/init-google-sheets.js"
# Обновляем скрипт сборки для предварительного скачивания быстрой статики
npm pkg set scripts.build="node scripts/init-google-sheets.js && node scripts/sync-content.js && next build"

echo "📁 Подготовка папок..."
rm -rf pages utils components styles/globals.css
mkdir -p pages/api/webhooks utils public/images components pages/legal pages/admin pages/api/admin styles scripts google-apps-script

echo "🔐 Создание конфигурационного файла .env.local..."
cat << 'EOF' > .env.local
# ВАЖНО: Ниже представлены все переменные окружения для работы системы
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Service Account (for Google Sheets & Drive - Основная БД)
GOOGLE_CLIENT_EMAIL="your-service-account-email@your-project.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
GOOGLE_SPREADSHEET_ID="your_google_sheet_id"

# ID Таблицы исключительно для Гостевых Чатов (Задача 4.5)
GOOGLE_CHATS_SPREADSHEET_ID="1oiWwaT7KzbTdRS-pSCjHv-F84ymXlrmrkNE99IFD3rQ"

# OAuth 2.0 Credentials (for Google Tasks & Calendar)
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_REFRESH_TOKEN="your-google-refresh-token"

# Telegram Bot
TELEGRAM_BOT_TOKEN=""
TELEGRAM_CHAT_ID=""

# Payment Gateways (Платежные шлюзы - Интеграция Stripe, ЮKassa, Т-Банк)
STRIPE_SECRET_KEY=""
YOOKASSA_SHOP_ID=""
YOOKASSA_SECRET_KEY=""
TBANK_TERMINAL_KEY=""
TBANK_SECRET_KEY=""
IYZICO_API_KEY=""
IYZICO_SECRET_KEY=""
PAYPAL_CLIENT_ID=""
PAYPAL_CLIENT_SECRET=""

# 2FA Secret for Admin Page (Двухфакторная аутентификация для владельца)
NEXT_PUBLIC_ADMIN_2FA_SECRET="BASE32SECRET32323232323232323232"

# On-Demand Revalidation Secret (Секрет для мгновенного обновления SSG кэша)
REVALIDATE_SECRET_TOKEN="YOUR_VERY_SECRET_RANDOM_STRING"

# Vercel KV (for persistent caching - Кэширование сессий и настроек)
KV_REST_API_URL=""
KV_REST_API_TOKEN=""
EOF

# 2. Настройка конфигурации Next.js (SSG и i18n)
cat << 'EOF' > next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Строгий режим React для безопасной разработки
  i18n: { 
    locales: ['ru', 'en', 'tr'], // Поддерживаемые языковые версии сайта
    defaultLocale: 'ru' // Язык платформы по умолчанию
  },
  images: { 
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' }, // Разрешение загрузки внешних фото
      { protocol: 'https', hostname: 'drive.google.com' } // Разрешение загрузки фото из Google Drive (Задача 1.2)
    ] 
  },
  eslint: { ignoreDuringBuilds: true }, // Отключение блокировки сборки при мелких ошибках линтера
  typescript: { ignoreBuildErrors: true }, // Отключение блокировки сборки при ошибках типов
};

module.exports = nextConfig;
EOF

# 3. Стили глобальные (С подробными построчными комментариями каждой настройки)
cat << 'EOF' > styles/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: #0f172a; /* Темно-синий фон платформы (Slate 900) */
  color: #f8fafc; /* Светло-серый цвет основного текста для контраста */
  font-family: ui-sans-serif, system-ui, sans-serif; /* Базовый системный шрифт без засечек */
  overflow-x: hidden; /* Жесткий запрет горизонтального скролла для защиты верстки */
}

::-webkit-scrollbar { 
  width: 6px; /* Тонкая ширина вертикального скроллбара */
  height: 6px; /* Тонкая высота горизонтального скроллбара (если появится внутри блоков) */
}

::-webkit-scrollbar-track { 
  background: #0f172a; /* Цвет дорожки скроллбара сливается с фоном */
}

::-webkit-scrollbar-thumb { 
  background: #334155; /* Темно-серый ползунок скроллбара */
  border-radius: 9999px; /* Максимальное закругление краев ползунка */
}

::-webkit-scrollbar-thumb:hover { 
  background: #475569; /* Легкое осветление ползунка при наведении курсора */
}

.fade-in { 
  animation: fadeIn 0.3s ease-in-out; /* Плавное появление элементов за 0.3 секунды */
}

@keyframes fadeIn { 
  from { opacity: 0; } /* Начальная точка анимации (полностью прозрачный) */
  to { opacity: 1; } /* Конечная точка анимации (полностью видимый) */
}

.react-datepicker { 
  background-color: #1e293b !important; /* Фон выпадающего системного календаря */
  border: 1px solid #334155 !important; /* Граница выпадающего календаря */
  border-radius: 1.5rem !important; /* Сильное закругление углов (24px) */
  font-family: inherit !important; /* Наследование шрифта платформы */
  overflow: hidden !important; /* Обрезка выходящих за границы элементов */
}

@media (max-width: 640px) { 
  .react-datepicker__month-container { 
    width: 100% !important; /* Растягивание контейнера месяца на весь экран мобильного */
    float: none !important; /* Отключение обтекания для мобильных экранов */
  } 
}

.react-datepicker__header { 
  background-color: #1e293b !important; /* Цвет фона заголовка календаря */
  border-bottom: 1px solid #334155 !important; /* Разделительная линия под заголовком */
  border-radius: 1.5rem 1.5rem 0 0 !important; /* Закругление только верхних углов */
}

.react-datepicker__current-month, .react-datepicker__day-name, .react-datepicker__day { 
  color: #e2e8f0 !important; /* Светлый цвет для дней недели и чисел месяца */
}

.react-datepicker__day:hover { 
  background-color: #334155 !important; /* Цвет фона дня при наведении мыши */
  border-radius: 0.5rem !important; /* Небольшое закругление при наведении (8px) */
}

.react-datepicker__day--in-range { 
  background-color: #2563eb !important; /* Цвет выбранного диапазона дат (Синий) */
  color: white !important; /* Белый цвет текста внутри выбранного диапазона */
}

.react-datepicker__day--selected, .react-datepicker__day--range-start, .react-datepicker__day--range-end { 
  background-color: #3b82f6 !important; /* Яркий синий цвет для начальной и конечной даты */
  border-radius: 0.5rem !important; /* Закругление выделенных дат */
}

.react-datepicker__day--disabled { 
  color: #475569 !important; /* Темно-серый цвет для недоступных дат */
  text-decoration: line-through; /* Зачеркивание недоступных дат */
  opacity: 0.5; /* Полупрозрачность для визуального отключения */
  cursor: not-allowed !important; /* Курсор запрета наведения */
}
EOF

cat << 'EOF' > .gitignore
/node_modules
/.pnp
.pnp.js
.vercel
/.next/
/out/
/build
.env*.local
utils/content.json
npm-debug.log*
yarn-debug.log*
yarn-error.log*
EOF
# 4. Полный словарь мультиязычности (Строго без сокращений, с новыми ключами и комментариями к каждой строке)
cat << 'EOF' > utils/translations.js
export const translations = {
  ru: {
    // === ОБЩИЕ ЭЛЕМЕНТЫ ===
    login: "ВХОД", // Текст кнопки авторизации
    register: "РЕГИСТРАЦИЯ", // Текст кнопки регистрации
    logout: "ВЫЙТИ", // Текст кнопки выхода из аккаунта
    
    // === ГЛАВНАЯ СТРАНИЦА (HERO БЛОК) ===
    heroTitle: "Аренда Villa Turaman", // Главный заголовок сайта
    heroSubtitle: "Ваш идеальный отдых в Дальяне. Бронирование виллы, премиальный сервис и авторские видео-путеводители от Алексея Знаменского.", // Подзаголовок Hero-блока
    bookBtn: "ЗАБРОНИРОВАТЬ", // Кнопка якоря к форме бронирования
    aboutTitle: "О Вилле", // Заголовок блока "О нас"
    aboutText: "Villa Turaman — это гармоничное сочетание уединения, современного комфорта и первоклассного сервиса для незабываемого отпуска в сердце Дальяна.", // Основной текст описания виллы
    viewDetails: "Подробнее о вилле", // Кнопка открытия модального окна с подробностями
    galleryTitle: "Галерея виллы", // Заголовок блока галереи
    viewAll: "Смотреть всё", // Кнопка просмотра всех фото
    
    // === ФОРМА БРОНИРОВАНИЯ ===
    bookingTitle: "Бронирование проживания", // Заголовок формы бронирования
    checkIn: "Дата заезда", // Метка поля заезда
    checkOut: "Дата выезда", // Метка поля выезда
    name: "Имя и Фамилия", // Метка поля имени гостя
    contact: "Контакт (Telegram / Email)", // Метка поля контактов
    dates: "Период проживания", // Метка календаря
    adults: "Взрослые", // Метка селектора взрослых (изменение 1.1)
    children: "Дети", // Метка селектора детей (изменение 1.1)
    totalPrice: "ИТОГО:", // Текст итоговой стоимости
    guests: "Гостей", // Текст количества гостей
    payBtn: "ПЕРЕЙТИ К ОПЛАТЕ", // Кнопка перехода к шлюзу
    sendRequestBtn: "ОТПРАВИТЬ ЗАЯВКУ", // Кнопка отправки ручной заявки
    loading: "ОБРАБОТКА...", // Текст загрузки при бронировании
    
    // === СИСТЕМНЫЕ МЕТКИ КАЛЕНДАРЯ ===
    minNights: "Мин. ночей", // Отображение минимальных ночей
    bookingWindow: "Раннее бронирование", // Отображение окна бронирования
    advanceNotice: "Мин. дней до заезда", // Отображение буфера до заезда
    maxGuests: "Макс. гостей", // Отображение макс. вместимости
    monthsAbbr: "мес.", // Сокращение месяцев
    daysAbbr: "дн.", // Сокращение дней
    daysLabel: "дней", // Слово дней
    todayLabel: "Сегодня", // Слово сегодня
    dayLabel: "день", // Слово день
    
    // === ЮРИДИЧЕСКИЕ ЧЕКБОКСЫ И ССЫЛКИ ===
    legalKVKK: "С правилами обработки персональных данных (KVKK) ознакомлен и согласен.", // Чекбокс KVKK
    legalContract: "С Договором аренды и правилами отмены ознакомлен и согласен.", // Чекбокс договора
    legalPrivacy: "С Политикой конфиденциальности ознакомлен и согласен.", // Чекбокс приватности
    legalInfo: "Юридическая информация", // Заголовок юридического футера
    linkContract: "Договор аренды", // Ссылка на договор
    linkKVKK: "Политика KVKK", // Ссылка на KVKK
    linkPrivacy: "Конфиденциальность", // Ссылка на приватность
    linkCancellation: "Правила отмены", // Ссылка на правила отмены
    
    // === ПАНЕЛЬ ВЛАДЕЛЬЦА (АДМИНКА) ===
    adminPanel: "Панель Владельца", // Заголовок админ-панели
    adminChats: "СООБЩЕНИЯ", // Вкладка чатов
    adminCalendar: "КАЛЕНДАРЬ", // Вкладка календаря
    activeChats: "Активные диалоги с гостями", // Заголовок списка чатов
    chatHistory: "История переписки", // Заголовок истории чата
    chatTemplatesLabel: "Быстрые ответы", // Заголовок быстрых ответов
    insertTemplateBtn: "Вставить", // Кнопка вставки шаблона (Задача 4.4)
    messagePlaceholder: "Введите сообщение...", // Плейсхолдер инпута чата
    broadcastTitle: "Массовая рассылка", // Заголовок массовой рассылки
    selectedRecipients: "Выбрано гостей", // Счетчик выбранных гостей
    calendarTitle: "Календарь занятости", // Заголовок календаря админа
    selectDatesLabel: "1. Выберите период", // Шаг 1 выбора дат
    settingsDatesLabel: "2. Настройки для выбранных дат", // Шаг 2 настроек
    availabilityStatus: "Доступность", // Статус доступности
    openForBooking: "Доступно", // Статус открыто
    hardBlock: "Заблокировано", // Статус закрыто
    specialPriceLabel: "Стоимость за ночь", // Инпут кастомной цены
    minNightsLabel: "Мин. ночей", // Инпут кастомных мин. ночей
    internalNoteLabel: "Внутренняя заметка", // Инпут заметки
    saveRulesBtn: "СОХРАНИТЬ ИЗМЕНЕНИЯ", // Кнопка сохранения правил дат
    resetGlobalBtn: "СБРОСИТЬ", // Кнопка сброса правил дат
    
    // === БАЗОВЫЕ НАСТРОЙКИ (GLOBAL RULES) ===
    globalRulesTitle: "Базовые настройки бронирования", // Заголовок глобальных правил
    bookingModeLabel: "Режим бронирования", // Метка режима
    modeInstant: "Мгновенная оплата", // Режим мгновенной оплаты
    modeManual: "По запросу", // Режим по запросу
    modeInherit: "По умолчанию", // Наследование режима
    basePriceGlobal: "Базовая цена", // Глобальная базовая цена
    currencyGlobal: "Валюта", // Глобальная валюта
    minNightsGlobal: "Мин. ночей", // Глобальные мин. ночи
    maxNightsGlobal: "Макс. ночей", // Глобальные макс. ночи
    bookingWindowGlobal: "Окно бронирования (мес)", // Глобальное окно
    advanceNoticeGlobal: "Пауза перед заездом (дней)", // Глобальная пауза
    checkInTimeGlobal: "Стандартное время заезда (Check-in)", // Глобальное время заезда (Задача 2.1)
    checkOutTimeGlobal: "Стандартное время выезда (Check-out)", // Глобальное время выезда (Задача 2.1)
    saveGlobalBtn: "СОХРАНИТЬ НАСТРОЙКИ", // Кнопка сохранения глобальных правил
    successRulesSave: "🔥 Календарь успешно обновлен!", // Уведомление об успехе
    successGlobalSave: "🎯 Базовые настройки сохранены!", // Уведомление об успехе
    
    // === УПРАВЛЕНИЕ ЗАЯВКАМИ ===
    bookingRequestPanel: "Запросы на бронирование", // Заголовок панели заявок
    noActiveRequests: "Новых запросов нет.", // Текст при отсутствии заявок
    amountLabel: "Сумма:", // Метка суммы
    statusLabel: "Статус:", // Метка статуса
    approveBtn: "Одобрить", // Кнопка одобрения
    rejectBtn: "Отклонить", // Кнопка отклонения
    specialOfferBtn: "Специальное предложение", // Кнопка создания спец. предложения
    sendOfferBtn: "Отправить гостю", // Кнопка отправки оффера
    offerPrice: "Новая цена", // Инпут новой цены
    requestApproved: "✅ Подтверждение отправлено гостю", // Уведомление об одобрении
    rejectSuccess: "Заявка отклонена.", // Уведомление об отклонении
    payRequestBtn: "ОПЛАТИТЬ БРОНЬ", // Кнопка оплаты для гостя
    offerExpired: "Срок действия истек", // Метка истекшего срока
    payUntil: "Оплатить до:", // Метка дедлайна оплаты
    revokeBtn: "Отозвать предложение", // Кнопка отзыва оффера
    revokeSuccess: "Предложение отозвано.", // Уведомление об отзыве
    msgRevoked: "❌ Предложение было аннулировано владельцем.", // Сообщение об отзыве в чат
    
    // === СТАТУСЫ БРОНИРОВАНИЙ ===
    statusPending: "НА РАССМОТРЕНИИ", // Статус заявки
    statusAwaitingPay: "ОЖИДАЕТ ОПЛАТЫ", // Статус ожидания оплаты
    statusOffer: "СПЕЦПРЕДЛОЖЕНИЕ", // Статус спецпредложения
    statusPaid: "ОПЛАЧЕНО", // Статус успешной оплаты
    statusRevoked: "АННУЛИРОВАНО", // Статус аннуляции
    statusRejected: "ОТКЛОНЕНО", // Статус отклонения
    
    // === ТУЛТИПЫ И ОШИБКИ ===
    tooltipReset: "(сброс)", // Тултип сброса
    tooltipSelected: "Выбрано", // Тултип выбора
    tooltipMin: "мин", // Тултип минимума
    tooltipMax: "Макс", // Тултип максимума
    tooltipCross: "Даты заняты", // Тултип пересечения
    tooltipCheckoutOnly: "Только выезд", // Тултип выезда
    tooltipOccupied: "Нет мест", // Тултип занятости
    tooltipAvailable: "Свободно", // Тултип свободы
    shortStayWarning: "⚠️ Выбранный период ({n} ночей) меньше минимального срока аренды ({min} ночей). Прямая оплата недоступна, но вы можете отправить заявку на рассмотрение владельцу.", // Предупреждение о коротком сроке
    cancelSelection: "Сбросить даты", // Сброс дат в календаре
    overlapsOccupied: "Выбранный период пересекает занятые даты.", // Ошибка пересечения дат
    
    // === ПРОЧЕЕ И ИНТЕРФЕЙС ===
    chatHeader: "Связь с владельцем", // Заголовок чата гостя
    studentChat: "Чат с владельцем", // Кнопка чата на главной
    assignLesson: "🎓 Отправить путеводитель...", // Плейсхолдер отправки путеводителя
    productTypeJewelry: "Услуга", // Тип продукта
    productTypeKit: "Пакет услуг", // Тип пакета
    courseLevel: "Категория", // Категория гида
    tabPool: "Территория", // Вкладка галереи
    tabRooms: "Спальни", // Вкладка галереи
    tabKitchen: "Гостиная и Кухня", // Вкладка галереи
    etbisText: "Система Электронной Коммерции (ETBİS)", // Текст ETBIS
    etbisPlaceholder: "QR КОД ETBIS\nБУДЕТ ДОБАВЛЕН СЮДА", // Заглушка ETBIS
    passwordLabel: "Пароль", // Метка пароля
    presentationBtn: "Подробнее", // Кнопка модалки продукта
    detailsTitle: "Описание", // Заголовок деталей
    courseProgress: "Смотреть", // Кнопка просмотра
    productBuy: "Заказать", // Кнопка покупки
    courseStart: "Открыть гид", // Кнопка открытия гида
    weekdays: "Пн,Вт,Ср,Чт,Пт,Сб,Вс", // Дни недели
    cancelBtn: "Отмена", // Кнопка отмены
    fileTooLarge: "Размер файла превышает лимит (Max 4MB).", // Ошибка размера файла
    requestSentSuccess: "Ваш запрос успешно отправлен! Владелец свяжется с вами в чате в ближайшее время.", // Успешная отправка заявки
    offerSentSuccess: "Специальное предложение успешно отправлено гостю.", // Успешная отправка оффера
    successRulesReset: "Настройки для выбранных дат сброшены к значениям по умолчанию.", // Успешный сброс дат
    
    // === СИСТЕМА БЕЗОПАСНОСТИ ===
    adminAuthTitle: "ВХОД ДЛЯ ВЛАДЕЛЬЦА", // Заголовок 2FA
    adminAuthSubtitle: "Требуется двухфакторная аутентификация", // Подзаголовок 2FA
    adminCrmGuardTitle: "ЗАЩИТА СИСТЕМЫ", // Заголовок защиты CRM
    adminCrmGuardSubtitle: "Введите код верификации", // Подзаголовок защиты CRM
    twoFaCodeLabel: "Код из Google Authenticator", // Метка кода
    verifyBtn: "ВОЙТИ В СИСТЕМУ", // Кнопка входа
    graphTitle: "Центр управления процессами", // Заголовок графа
    backToCrmBtn: "← НАЗАД", // Кнопка назад
    syncingWithGoogle: "Синхронизация с сервисами Google...", // Лоадер синхронизации
    nodeType: "ТИП ОБЪЕКТА", // Тип узла графа
    addNewTask: "Новая задача", // Новая задача в графе
    shortTitlePlaceholder: "Заголовок задачи", // Плейсхолдер заголовка задачи
    taskNotesPlaceholder: "Детали, теги (#уборка) или связи...", // Плейсхолдер деталей задачи
    createNodeBtn: "Создать", // Кнопка создания узла
    deletePermanentlyBtn: "Удалить", // Кнопка удаления узла
    detailsLabel: "Информация", // Детали узла
    noteLabel: "Заметка", // Заметка узла
    legendLists: "Доски задач", // Легенда графа
    legendActive: "В работе", // Легенда графа
    legendCompleted: "Выполнено", // Легенда графа
    legendTags: "Теги", // Легенда графа
    legendRules: "Настройки (CRM)", // Легенда графа
    legendGCal: "Google Календарь", // Легенда графа
    legendICal: "Брони (Airbnb/iCal)", // Легенда графа
    
    // === СИСТЕМНЫЕ ОШИБКИ ===
    criticalErrorTitle: "Системная ошибка", // Заголовок крит. ошибки
    configWarningsTitle: "Предупреждения", // Заголовок варнингов
    error_user_exists: "Пользователь с такими контактными данными уже зарегистрирован.", // Ошибка регистрации
    error_invalid_login: "Неверные учетные данные.", // Ошибка логина
    error_site_blocked: "Доступ к платформе ограничен.", // Блок сайта
    error_account_suspended: "Действие аккаунта приостановлено.", // Блок аккаунта
    error_invalid_2fa: "Неверный код 2FA!", // Ошибка кода 2FA
    error_2fa_verification: "Ошибка проверки безопасности.", // Общая ошибка 2FA
    error_graph_load: "Сбой при загрузке графа задач.", // Ошибка загрузки графа
    error_network: "Ошибка сетевого подключения.", // Ошибка сети
    error_2fa_secret_not_found: "Секретный ключ 2FA не задан в конфигурации (.env).", // Ошибка конфига 2FA
    selectDatesPrompt: "Выберите даты в календаре", // Приглашение выбора дат
    clearDatesBtn: "Очистить даты", // Сброс дат
    
    // === ДИНАМИЧЕСКИЕ ПЛОКБЛОКИ (Плейсхолдеры из БД будут переопределять их) ===
    shopTitle: "Сервис и Услуги", // Магазин
    shopSubtitle: "Дополните свой отдых комфортным трансфером, услугами личного повара и другими опциями.", // Описание магазина
    educationTitle: "Путеводители", // Гиды
    educationSubtitle: "Откройте для себя лучшие рестораны, секретные пляжи и маршруты Дальяна с нашими видео-гидами." // Описание гидов
  },
  en: {
    // Английская версия (зеркальная копия структуры с переводами)
    login: "LOGIN", register: "REGISTER", logout: "LOGOUT",
    heroTitle: "Villa Turaman Rental", heroSubtitle: "Your perfect holiday in Dalyan. Premium villa booking, exclusive services, and curated video guides by Aleksei Znamenskii.",
    bookBtn: "BOOK NOW", aboutTitle: "About the Villa", aboutText: "Villa Turaman offers a seamless blend of ultimate privacy, modern comfort, and exceptional service for an unforgettable stay in the heart of Dalyan.",
    viewDetails: "View Details", galleryTitle: "Villa Gallery", viewAll: "View All",
    bookingTitle: "Book Your Stay", checkIn: "Check-in Date", checkOut: "Check-out Date",
    name: "Full Name", contact: "Contact (Telegram / Email)", dates: "Stay Period",
    adults: "Adults", children: "Children", totalPrice: "TOTAL:", guests: "Guests",
    payBtn: "PROCEED TO PAYMENT", sendRequestBtn: "SEND REQUEST", loading: "PROCESSING...",
    minNights: "Min. Nights", bookingWindow: "Booking Window", advanceNotice: "Advance Notice", maxGuests: "Max Guests",
    monthsAbbr: "mo.", daysAbbr: "days", daysLabel: "days", todayLabel: "Today", dayLabel: "day",
    legalKVKK: "I have read and agree to the KVKK Privacy Policy.", legalContract: "I have read and agree to the Rental Agreement and Cancellation Policy.", legalPrivacy: "I agree to the Privacy Policy.",
    legalInfo: "Legal Information", linkContract: "Rental Agreement", linkKVKK: "KVKK Policy", linkPrivacy: "Privacy Policy", linkCancellation: "Cancellation Policy",
    adminPanel: "Owner Panel", adminChats: "MESSAGES", adminCalendar: "CALENDAR", activeChats: "Active Guest Conversations", 
    chatHistory: "Chat History", chatTemplatesLabel: "Quick Replies", insertTemplateBtn: "Insert", messagePlaceholder: "Type your message...",
    broadcastTitle: "Broadcast Message", selectedRecipients: "Selected guests",
    calendarTitle: "Availability Calendar", selectDatesLabel: "1. Select Dates", settingsDatesLabel: "2. Settings for Selected Dates", 
    availabilityStatus: "Availability", openForBooking: "Available", hardBlock: "Blocked",
    specialPriceLabel: "Nightly Rate", minNightsLabel: "Min. Nights", internalNoteLabel: "Internal Note", saveRulesBtn: "SAVE CHANGES", resetGlobalBtn: "RESET", 
    globalRulesTitle: "Default Booking Settings", bookingModeLabel: "Booking Mode", modeInstant: "Instant Book", modeManual: "Request to Book", modeInherit: "Default",
    basePriceGlobal: "Base Rate", currencyGlobal: "Currency", minNightsGlobal: "Min. Nights", maxNightsGlobal: "Max. Nights", bookingWindowGlobal: "Booking Window (months)", advanceNoticeGlobal: "Advance Notice (days)", checkInTimeGlobal: "Default Check-in Time", checkOutTimeGlobal: "Default Check-out Time", saveGlobalBtn: "SAVE SETTINGS", successRulesSave: "🔥 Calendar successfully updated!", successGlobalSave: "🎯 Default settings saved!",
    bookingRequestPanel: "Booking Requests", noActiveRequests: "No pending requests.", amountLabel: "Total:", statusLabel: "Status:",
    approveBtn: "Approve", rejectBtn: "Decline", specialOfferBtn: "Special Offer", sendOfferBtn: "Send to Guest", offerPrice: "New Price",
    requestApproved: "✅ Approval sent to guest", rejectSuccess: "Request declined.", payRequestBtn: "PAY NOW", offerExpired: "Offer expired",
    payUntil: "Pay before:", revokeBtn: "Revoke Offer", revokeSuccess: "Offer revoked.", msgRevoked: "❌ The offer has been withdrawn by the owner.",
    statusPending: "PENDING", statusAwaitingPay: "AWAITING PAYMENT", statusOffer: "SPECIAL OFFER", statusPaid: "PAID", statusRevoked: "WITHDRAWN", statusRejected: "DECLINED",
    tooltipReset: "(reset)", tooltipSelected: "Selected", tooltipMin: "min", tooltipMax: "Max", tooltipCross: "Dates unavailable", tooltipCheckoutOnly: "Checkout only", tooltipOccupied: "No availability", tooltipAvailable: "Available",
    shortStayWarning: "⚠️ The selected period ({n} nights) is less than the minimum stay ({min} nights). Instant booking is disabled, but you can submit a request for the owner's review.", cancelSelection: "Clear dates", overlapsOccupied: "Selected period overlaps with occupied dates.",
    chatHeader: "Contact Owner", studentChat: "Chat with Owner", assignLesson: "🎓 Send video guide...",
    productTypeJewelry: "Service", productTypeKit: "Package", courseLevel: "Category", tabPool: "Grounds", tabRooms: "Bedrooms", tabKitchen: "Living & Kitchen",
    etbisText: "Electronic Commerce Info System (ETBİS)", etbisPlaceholder: "ETBIS QR CODE\nWILL BE DISPLAYED HERE", passwordLabel: "Password",
    presentationBtn: "Details", detailsTitle: "Description", courseProgress: "Watch", productBuy: "Order", courseStart: "Open Guide",
    weekdays: "Mo,Tu,We,Th,Fr,Sa,Su", cancelBtn: "Cancel", fileTooLarge: "File exceeds the maximum limit (4MB).",
    requestSentSuccess: "Your request has been successfully submitted! The owner will contact you in the chat shortly.", offerSentSuccess: "Special offer successfully sent to the guest.", successRulesReset: "Settings for the selected dates have been restored to defaults.",
    adminAuthTitle: "OWNER LOGIN", adminAuthSubtitle: "Two-factor authentication required", adminCrmGuardTitle: "SYSTEM PROTECTION", adminCrmGuardSubtitle: "Enter verification code", twoFaCodeLabel: "Google Authenticator Code", verifyBtn: "LOG IN", graphTitle: "Process Control Center", backToCrmBtn: "← BACK", syncingWithGoogle: "Syncing with Google services...", nodeType: "OBJECT TYPE", addNewTask: "New Task", shortTitlePlaceholder: "Task title", taskNotesPlaceholder: "Details, tags (#cleaning) or links...", createNodeBtn: "Create", deletePermanentlyBtn: "Delete", detailsLabel: "Information", noteLabel: "Note", legendLists: "Task Boards", legendActive: "In Progress", legendCompleted: "Done", legendTags: "Tags", legendRules: "Settings (CRM)", legendGCal: "Google Calendar", legendICal: "Bookings (Airbnb/iCal)",
    criticalErrorTitle: "System Error", configWarningsTitle: "Warnings", error_user_exists: "A guest with these contact details is already registered.", error_invalid_login: "Invalid credentials.", error_site_blocked: "Access to the platform is restricted.", error_account_suspended: "Your account has been suspended.", error_invalid_2fa: "Invalid 2FA code!", error_2fa_verification: "Security verification failed.", error_graph_load: "Failed to load the task graph.", error_network: "Network connection error.", error_2fa_secret_not_found: "The 2FA secret key is not configured in the environment variables.", selectDatesPrompt: "Select dates in calendar", clearDatesBtn: "Clear Dates",
    shopTitle: "Services & Extras", shopSubtitle: "Enhance your stay with comfortable transfers, private chef services, and more.", educationTitle: "Video Guides", educationSubtitle: "Explore Dalyan's finest restaurants, hidden beaches, and local secrets with our curated video tours."
  },
  tr: {
    // Турецкая версия (зеркальная копия структуры с переводами)
    login: "GİRİŞ", register: "KAYIT OL", logout: "ÇIKIŞ",
    heroTitle: "Villa Turaman Kiralama", heroSubtitle: "Dalyan'da kusursuz tatiliniz. Aleksei Znamenskii'den premium villa kiralama, özel hizmetler ve eşsiz video rehberler.",
    bookBtn: "REZERVASYON YAP", aboutTitle: "Villa Hakkında", aboutText: "Villa Turaman, Dalyan'ın kalbinde unutulmaz bir konaklama için tam mahremiyet, modern konfor ve olağanüstü hizmeti bir araya getiriyor.",
    viewDetails: "Detayları İncele", galleryTitle: "Villa Galerisi", viewAll: "Tümünü Gör",
    bookingTitle: "Konaklama Rezervasyonu", checkIn: "Giriş Tarihi", checkOut: "Çıkış Tarihi",
    name: "Ad Soyad", contact: "İletişim (Telegram / E-posta)", dates: "Konaklama Süresi",
    adults: "Yetişkin", children: "Çocuk", totalPrice: "TOPLAM TUTAR:", guests: "Misafir",
    payBtn: "ÖDEMEYE GEÇ", sendRequestBtn: "TALEP GÖNDER", loading: "İŞLENİYOR...",
    minNights: "Min. Gece", bookingWindow: "Erken Rezervasyon", advanceNotice: "Geliş Öncesi (Gün)", maxGuests: "Maks. Misafir",
    monthsAbbr: "ay", daysAbbr: "gün", daysLabel: "gün", todayLabel: "Bugün", dayLabel: "gün",
    legalKVKK: "KVKK Aydınlatma Metni'ni okudum ve onaylıyorum.", legalContract: "Kiralama Sözleşmesi'ni ve İptal/İade Kurallarını okudum ve kabul ediyorum.", legalPrivacy: "Gizlilik Politikası'nı okudum ve onaylıyorum.",
    legalInfo: "Hukuki Bilgiler", linkContract: "Kiralama Sözleşmesi", linkKVKK: "KVKK Aydınlatma Metni", linkPrivacy: "Gizlilik Politikası", linkCancellation: "İptal Politikası",
    adminPanel: "Sahip Paneli", adminChats: "MESAJLAR", adminCalendar: "TAKVİM", activeChats: "Aktif Misafir Mesajları", 
    chatHistory: "Sohbet Geçmişi", chatTemplatesLabel: "Hızlı Yanıtlar", insertTemplateBtn: "Ekle", messagePlaceholder: "Mesajınızı yazın...",
    broadcastTitle: "Toplu Mesaj", selectedRecipients: "Seçilen misafirler",
    calendarTitle: "Müsaitlik Takvimi", selectDatesLabel: "1. Tarih Seçiniz", settingsDatesLabel: "2. Seçili Tarihler İçin Ayarlar", 
    availabilityStatus: "Durum", openForBooking: "Müsait", hardBlock: "Kapalı",
    specialPriceLabel: "Gecelik Fiyat", minNightsLabel: "Min. Gece", internalNoteLabel: "İç Not", saveRulesBtn: "DEĞİŞİKLİKLERİ KAYDET", resetGlobalBtn: "SIFIRLA", 
    globalRulesTitle: "Varsayılan Rezervasyon Ayarları", bookingModeLabel: "Rezervasyon Modu", modeInstant: "Anında Onay", modeManual: "Talep Üzerine", modeInherit: "Varsayılan",
    basePriceGlobal: "Taban Fiyat", currencyGlobal: "Para Birimi", minNightsGlobal: "Min. Gece", maxNightsGlobal: "Maks. Gece", bookingWindowGlobal: "Rezervasyon Penceresi (Ay)", advanceNoticeGlobal: "Hazırlık Süresi (Gün)", checkInTimeGlobal: "Varsayılan Giriş Saati", checkOutTimeGlobal: "Varsayılan Çıkış Saati", saveGlobalBtn: "AYARLARI KAYDET", successRulesSave: "🔥 Takvim başarıyla güncellendi!", successGlobalSave: "🎯 Varsayılan ayarlar kaydedildi!",
    bookingRequestPanel: "Rezervasyon Talepleri", noActiveRequests: "Bekleyen talep yok.", amountLabel: "Toplam:", statusLabel: "Durum:",
    approveBtn: "Onayla", rejectBtn: "Reddet", specialOfferBtn: "Özel Teklif", sendOfferBtn: "Misafire Gönder", offerPrice: "Yeni Fiyat",
    requestApproved: "✅ Onay misafire gönderildi", rejectSuccess: "Talep reddedildi.", payRequestBtn: "ÖDEME YAP", offerExpired: "Teklifin süresi doldu",
    payUntil: "Son ödeme:", revokeBtn: "Teklifi İptal Et", revokeSuccess: "Teklif iptal edildi.", msgRevoked: "❌ Teklif ev sahibi tarafından geri çekildi.",
    statusPending: "DEĞERLENDİRMEDE", statusAwaitingPay: "ÖDEME BEKLENİYOR", statusOffer: "ÖZEL TEKLİF", statusPaid: "ÖDENDİ", statusRevoked: "İPTAL EDİLDİ", statusRejected: "REDDEDİLDİ",
    tooltipReset: "(sıfırla)", tooltipSelected: "Seçilen", tooltipMin: "min", tooltipMax: "Maks", tooltipCross: "Tarihler dolu", tooltipCheckoutOnly: "Sadece çıkış", tooltipOccupied: "Müsait değil", tooltipAvailable: "Müsait",
    shortStayWarning: "⚠️ Seçilen konaklama süresi ({n} gece) minimum süreden ({min} gece) daha kısadır. Anında ödeme devre dışıdır, ancak ev sahibinin onayı için bir talep gönderebilirsiniz.", cancelSelection: "Tarihleri temizle", overlapsOccupied: "Seçilen dönem dolu tarihlerle çakışıyor.",
    chatHeader: "Ev Sahibi İletişim", studentChat: "Ev Sahibiyle Sohbet", assignLesson: "🎓 Video rehber gönder...",
    productTypeJewelry: "Hizmet", productTypeKit: "Paket", courseLevel: "Kategori", tabPool: "Bahçe", tabRooms: "Yatak Odaları", tabKitchen: "Salon ve Mutfak",
    etbisText: "Elektronik Ticaret Bilgi Sistemi (ETBİS)", etbisPlaceholder: "ETBİS KAREKODU\nBURADA GÖRÜNTÜLENECEK", passwordLabel: "Şifre",
    presentationBtn: "Detaylar", detailsTitle: "Açıklama", courseProgress: "İzle", productBuy: "Sipariş Ver", courseStart: "Rehberi Aç",
    weekdays: "Pzt,Sal,Çar,Per,Cum,Cmt,Paz", cancelBtn: "İptal", fileTooLarge: "Dosya maksimum boyutu (4MB) aşıyor.",
    requestSentSuccess: "Talebiniz başarıyla alındı! Ev sahibi en kısa sürede sohbet üzerinden sizinle iletişime geçecektir.", offerSentSuccess: "Özel teklif misafire başarıyla gönderildi.", successRulesReset: "Seçilen tarihler için ayarlar varsayılana döndürüldü.",
    adminAuthTitle: "SAHİP GİRİŞİ", adminAuthSubtitle: "İki faktörlü kimlik doğrulama gerekli", adminCrmGuardTitle: "SİSTEM KORUMASI", adminCrmGuardSubtitle: "Doğrulama kodunu girin", twoFaCodeLabel: "Google Authenticator Kodu", verifyBtn: "GİRİŞ YAP", graphTitle: "Süreç Kontrol Merkezi", backToCrmBtn: "← GERİ", syncingWithGoogle: "Google servisleriyle senkronize ediliyor...", nodeType: "NESNE TÜRÜ", addNewTask: "Yeni Görev", shortTitlePlaceholder: "Görev başlığı", taskNotesPlaceholder: "Detaylar, etiketler (#temizlik) veya bağlantılar...", createNodeBtn: "Oluştur", deletePermanentlyBtn: "Sil", detailsLabel: "Bilgi", noteLabel: "Not", legendLists: "Görev Panoları", legendActive: "Devam Ediyor", legendCompleted: "Tamamlandı", legendTags: "Etiketler", legendRules: "Ayarlar (CRM)", legendGCal: "Google Takvim", legendICal: "Rezervasyonlar (Airbnb/iCal)",
    criticalErrorTitle: "Sistem Hatası", configWarningsTitle: "Uyarılar", error_user_exists: "Bu iletişim bilgileriyle kayıtlı bir misafir zaten var.", error_invalid_login: "Geçersiz kimlik bilgileri.", error_site_blocked: "Platforma erişim kısıtlandı.", error_account_suspended: "Hesabınız askıya alındı.", error_invalid_2fa: "Geçersiz 2FA kodu!", error_2fa_verification: "Güvenlik doğrulaması başarısız.", error_graph_load: "Görev grafiği yüklenemedi.", error_network: "Ağ bağlantı hatası.", error_2fa_secret_not_found: "2FA gizli anahtarı çevre değişkenlerinde (.env) yapılandırılmamış.", selectDatesPrompt: "Takvimden tarih seçin", clearDatesBtn: "Tarihleri Temizle",
    shopTitle: "Hizmetler ve Ekstralar", shopSubtitle: "Konforlu transferler, özel aşçı hizmetleri ve daha fazlasıyla tatilinizi taçlandırın.", educationTitle: "Video Rehberler", educationSubtitle: "Özel video turlarımızla Dalyan'ın en iyi restoranlarını, gizli plajlarını ve yerel sırlarını keşfedin."
  }
};
EOF

# 5. Провайдер Мультиязычности (Language Context Provider)
cat << 'EOF' > utils/language.js
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { translations } from './translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const router = useRouter();
  const { locale, pathname, asPath, query } = router;
  
  // Установка языка по умолчанию (из локали Next.js или русский)
  const [lang, setLang] = useState(locale || 'ru');

  useEffect(() => { 
    setLang(locale || 'ru'); 
  }, [locale]);

  // Функция перевода. Если ключ не найден, возвращаем сам ключ как fallback
  const t = (key) => translations[lang]?.[key] || key;
  
  // Функция смены языка с роутингом без перезагрузки страницы
  const changeLanguage = (newLang) => { 
    router.push({ pathname, query }, asPath, { locale: newLang, scroll: false }); 
  };

  return (
    <LanguageContext.Provider value={{ t, lang, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
EOF

# 6. Основной компонент _app.js (Обертка всего приложения)
cat << 'EOF' > pages/_app.js
import { LanguageProvider } from '../utils/language';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/globals.css';

// Главный компонент, оборачивающий все страницы провайдером языка и стилями
function MyApp({ Component, pageProps }) {
  return (
    <LanguageProvider>
      <Component {...pageProps} />
    </LanguageProvider>
  );
}
export default MyApp;
EOF

# 7. Компонент SEO для JSON-LD, Hreflang и OpenGraph (С правильным рендерингом для поисковиков)
cat << 'EOF' > components/SEO.js
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function SEO({ 
  title, 
  description, 
  image = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600",
  type = "website",
  schemaData = null
}) {
  const router = useRouter();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://villaturaman.com';
  const currentUrl = `${siteUrl}${router.asPath}`;
  
  // Карта локалей для правильного OpenGraph
  const localeMap = { ru: 'ru-RU', en: 'en-US', tr: 'tr-TR' };
  const currentLocale = localeMap[router.locale] || 'ru-RU';

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Hreflang для локального SEO (помощь поисковикам в определении языковых версий) */}
      <link rel="alternate" hrefLang="ru" href={`${siteUrl}/ru${router.asPath}`} />
      <link rel="alternate" hrefLang="en" href={`${siteUrl}/en${router.asPath}`} />
      <link rel="alternate" hrefLang="tr" href={`${siteUrl}/tr${router.asPath}`} />
      <link rel="alternate" hrefLang="x-default" href={`${siteUrl}/ru${router.asPath}`} />
      
      {/* OpenGraph мета-теги для красивых превью в соц. сетях и мессенджерах */}
      <meta property="og:type" content={type} />
      <meta property="og:locale" content={currentLocale} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Villa Turaman" />
      
      {/* Twitter карточки */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Микроразметка Schema.org (JSON-LD) для расширенных сниппетов в Google */}
      {schemaData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      )}
    </Head>
  );
}
EOF
# 8. Юридические страницы (SSG из content.json + SEO)
cat << 'EOF' > pages/legal/kvkk.js
import { useLanguage } from '../../utils/language';
import dynamicContent from '../../utils/content.json';
import SEO from '../../components/SEO';

export default function LegalPage() {
  const { lang } = useLanguage();
  const content = dynamicContent?.legal?.kvkk || {};
  const pageTitle = content?.title?.[lang] || content?.title?.ru || 'KVKK';
  const pageContent = content?.text?.[lang] || content?.text?.ru || '';

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-300 py-20 px-6 font-sans">
      <SEO title={`${pageTitle} | Villa Turaman`} description={pageContent.substring(0, 150).replace(/\n/g, ' ')} />
      <div className="max-w-4xl mx-auto bg-slate-900/80 p-10 rounded-[2rem] border border-white/10 shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-8 border-b border-white/10 pb-4">{pageTitle}</h1>
        <div className="space-y-6 text-sm leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: pageContent.replace(/\\n/g, '<br />') }} />
      </div>
    </div>
  );
}
EOF

cat << 'EOF' > pages/legal/contract.js
import { useLanguage } from '../../utils/language';
import dynamicContent from '../../utils/content.json';
import SEO from '../../components/SEO';

export default function LegalPage() {
  const { lang } = useLanguage();
  const content = dynamicContent?.legal?.contract || {};
  const pageTitle = content?.title?.[lang] || content?.title?.ru || 'Договор аренды';
  const pageContent = content?.text?.[lang] || content?.text?.ru || '';

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-300 py-20 px-6 font-sans">
      <SEO title={`${pageTitle} | Villa Turaman`} description={pageContent.substring(0, 150).replace(/\n/g, ' ')} />
      <div className="max-w-4xl mx-auto bg-slate-900/80 p-10 rounded-[2rem] border border-white/10 shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-8 border-b border-white/10 pb-4">{pageTitle}</h1>
        <div className="space-y-6 text-sm leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: pageContent.replace(/\\n/g, '<br />') }} />
      </div>
    </div>
  );
}
EOF

cat << 'EOF' > pages/legal/cancellation.js
import { useLanguage } from '../../utils/language';
import dynamicContent from '../../utils/content.json';
import SEO from '../../components/SEO';

export default function LegalPage() {
  const { lang } = useLanguage();
  const content = dynamicContent?.legal?.cancellation || {};
  const pageTitle = content?.title?.[lang] || content?.title?.ru || 'Возврат и Отмена';
  const pageContent = content?.text?.[lang] || content?.text?.ru || '';

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-300 py-20 px-6 font-sans">
      <SEO title={`${pageTitle} | Villa Turaman`} description={pageContent.substring(0, 150).replace(/\n/g, ' ')} />
      <div className="max-w-4xl mx-auto bg-slate-900/80 p-10 rounded-[2rem] border border-white/10 shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-8 border-b border-white/10 pb-4">{pageTitle}</h1>
        <div className="space-y-6 text-sm leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: pageContent.replace(/\\n/g, '<br />') }} />
      </div>
    </div>
  );
}
EOF

cat << 'EOF' > pages/legal/privacy.js
import { useLanguage } from '../../utils/language';
import dynamicContent from '../../utils/content.json';
import SEO from '../../components/SEO';

export default function LegalPage() {
  const { lang } = useLanguage();
  const content = dynamicContent?.legal?.privacy || {};
  const pageTitle = content?.title?.[lang] || content?.title?.ru || 'Конфиденциальность';
  const pageContent = content?.text?.[lang] || content?.text?.ru || '';

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-300 py-20 px-6 font-sans">
      <SEO title={`${pageTitle} | Villa Turaman`} description={pageContent.substring(0, 150).replace(/\n/g, ' ')} />
      <div className="max-w-4xl mx-auto bg-slate-900/80 p-10 rounded-[2rem] border border-white/10 shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-8 border-b border-white/10 pb-4">{pageTitle}</h1>
        <div className="space-y-6 text-sm leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: pageContent.replace(/\\n/g, '<br />') }} />
      </div>
    </div>
  );
}
EOF

# 9. БЭКЕНД: ИНТЕГРАЦИЯ ВНЕШНИХ КАЛЕНДАРЕЙ (iCal Parsing - Задание 3.1)
cat << 'EOF' > pages/api/calendar.js
import ical from 'node-ical'; // Подключение библиотеки для парсинга iCal

// БЛОК КОНФИГУРАЦИИ ИСТОЧНИКОВ (Менеджер каналов Villa Turaman)
// ==========================================
const icalSources = [
  {
    id: "airbnb", 
    name: "Airbnb", 
    url: "https://www.airbnb.ru/calendar/ical/1422403960484282130.ics?t=69c8e5e0d5544dcd903b32b83290099a", 
    enabled: true, // Включение парсинга источника
    importBookings: true, // Импорт подтвержденных бронирований
    importBlocks: true // Импорт ручных блокировок
  },
  {
    id: "booking", 
    name: "Booking", 
    url: "https://ical.booking.com/v1/export?t=e827db15-6756-4e06-9d7b-2018f62e806c", 
    enabled: true, 
    importBookings: true, 
    importBlocks: true 
  },
  {
    id: "vrbo", 
    name: "Vrbo", 
    url: "http://www.vrbo.com/icalendar/72eb9736e6514b82a4c42974f4f205f1.ics", 
    enabled: true, 
    importBookings: true, 
    importBlocks: true 
  },
  {
    id: "avito", 
    name: "Avito", 
    url: "https://www.avito.ru/calendars-export/76/50/7662540950.ics", 
    enabled: true, 
    importBookings: true, 
    importBlocks: true 
  },
  {
    id: "agoda", 
    name: "Agoda", 
    url: "https://ycs.agoda.com/en-us/api/ari/icalendar?key=5rAAt7ANnirTTWAPbRTgMdmYuZ09VqFz", 
    enabled: true, 
    importBookings: true, 
    importBlocks: true 
  },
  {
    id: "google", 
    name: "Google Calendar", 
    url: "https://calendar.google.com/calendar/ical/41f6022c98338bf16240faec973d63393b57d8b067e3b58215f725f509a9be01%40group.calendar.google.com/public/basic.ics", 
    enabled: true, 
    importBookings: true, 
    importBlocks: true 
  }
];

// Функция определения блокировок (поиск ключевых слов в iCal)
const isBlockEvent = (summaryObj) => {
  const text = (typeof summaryObj === 'string' ? summaryObj : summaryObj?.val || "").toLowerCase();
  return (
    text.includes("block") || 
    text.includes("unavailable") || 
    text.includes("not available") || 
    text.includes("закрыто") || 
    text.includes("closed") || 
    text.includes("owner") || 
    text.includes("blocked")
  );
};

// Нормализация даты к стандарту UTC для избежания смещений часовых поясов
const normalizeDateToUTC = (dateObj) => {
  const y = dateObj.getFullYear();
  const m = dateObj.getMonth();
  const d = dateObj.getDate();
  return new Date(Date.UTC(y, m, d));
};

export default async function handler(req, res) {
  // Разрешаем только GET запросы к API
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    let allOccupiedDates = []; // Массив для хранения всех занятых дат
    let allEvents = []; // Массив для хранения объектов событий
    
    // Фильтруем только активные источники
    const activeSources = icalSources.filter(s => s.enabled);

    // Параллельный парсинг всех iCal ссылок
    const results = await Promise.allSettled(
      activeSources.map(async (source) => {
        // Добавление nocache для обхода кэширования браузером/сервером
        const fetchUrl = `${source.url}${source.url.includes('?') ? '&' : '?'}nocache=${Date.now()}`;
        
        const response = await fetch(fetchUrl, {
          cache: 'no-store', // Отключение внутреннего кэширования Next.js
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/calendar'
          }
        });
        
        if (!response.ok) throw new Error(`Status ${response.status}`);
        const icsText = await response.text();
        const data = await ical.async.parseICS(icsText);
        return { data, source };
      })
    );

    // Обработка результатов парсинга
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        const { data, source } = result.value;
        
        for (let k in data) {
          if (data.hasOwnProperty(k)) {
            const ev = data[k];
            
            // Обрабатываем только реальные события (VEVENT) с установленной датой начала
            if (ev.type === 'VEVENT' && ev.start) {
              const summary = ev.summary;
              const isBlock = isBlockEvent(summary);

              // Проверка прав на импорт конкретного типа события для источника
              const shouldImport = (isBlock && source.importBlocks) || (!isBlock && source.importBookings);

              if (shouldImport) {
                let start = normalizeDateToUTC(new Date(ev.start));
                let end = ev.end ? normalizeDateToUTC(new Date(ev.end)) : normalizeDateToUTC(new Date(ev.start));

                // Запись события для рендеринга полосок в календаре
                allEvents.push({
                    start: start.toISOString().split('T')[0],
                    end: end.toISOString().split('T')[0],
                    sourceId: source.id,
                    sourceName: source.name
                });

                let currentTimestamp = start.getTime();
                const endTimestamp = end.getTime();
                const oneDay = 24 * 60 * 60 * 1000;

                // Заполнение массива занятых дат день за днем
                if (currentTimestamp === endTimestamp) {
                  allOccupiedDates.push(new Date(currentTimestamp).toISOString().split('T')[0]);
                } else {
                  while (currentTimestamp < endTimestamp) {
                    allOccupiedDates.push(new Date(currentTimestamp).toISOString().split('T')[0]);
                    currentTimestamp += oneDay;
                  }
                }
              }
            }
          }
        }
      } else {
         console.warn(`Ошибка импорта iCal (${result.value?.source?.name || 'неизвестно'}):`, result.reason);
      }
    });

    // Удаление дубликатов дат (когда брони пересекаются на разных площадках)
    const uniqueDates = [...new Set(allOccupiedDates)];
    
    // Установка заголовков кэширования для оптимизации API
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).json({ dates: uniqueDates, events: allEvents });
  } catch (error) {
    console.error("Глобальная ошибка сервера API календаря:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
EOF

# 10. Платежи, iCal Export и генерация PDF (С поддержкой Т-БАНК - Задача 3.2 с форматированием)
cat << 'EOF' > pages/api/payment.js
import Stripe from 'stripe'; // Подключение Stripe для EUR/USD
import { YooCheckout } from 'yookassa'; // Подключение ЮKassa для RUB
import Iyzipay from 'iyzipay'; // Подключение Iyzico для TRY
import paypal from '@paypal/checkout-server-sdk'; // Подключение PayPal
import crypto from 'crypto'; // Подключение Crypto для генерации токена Т-Банка

export default async function handler(req, res) {
  // Разрешаем только POST запросы для создания сессии оплаты
  if (req.method !== 'POST') return res.status(405).end();

  // Инициализация клиентов платежных шлюзов (с фоллбэком на dummy для защиты от падений)
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy');
  const yooKassa = new YooCheckout({ 
    shopId: process.env.YOOKASSA_SHOP_ID || 'dummy', 
    secretKey: process.env.YOOKASSA_SECRET_KEY || 'dummy' 
  });
  const iyzipay = new Iyzipay({ 
    apiKey: process.env.IYZICO_API_KEY || 'dummy', 
    secretKey: process.env.IYZICO_SECRET_KEY || 'dummy', 
    uri: 'https://api.iyzipay.com' 
  });
  const paypalClient = new paypal.core.PayPalHttpClient(
    new paypal.core.SandboxEnvironment(
      process.env.PAYPAL_CLIENT_ID || 'dummy', 
      process.env.PAYPAL_CLIENT_SECRET || 'dummy'
    )
  );
  
  // Получение данных из тела запроса
  const { gateway, amount, currency, bookingDetails } = req.body;
  
  // Ключи Т-Банк
  const tbankTerminalKey = process.env.TBANK_TERMINAL_KEY;
  const tbankSecretKey = process.env.TBANK_SECRET_KEY;
  
  // Формирование URL-адресов возврата
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const successUrl = `${baseUrl}/api/payment_success?data=${encodeURIComponent(JSON.stringify(bookingDetails))}`;
  const cancelUrl = `${baseUrl}/?payment=cancel`;
  
  try {
    // === ЛОГИКА STRIPE ===
    if (gateway === 'stripe') {
      const session = await stripe.checkout.sessions.create({ 
        payment_method_types: ['card'], 
        line_items: [{ 
          price_data: { 
            currency: currency.toLowerCase(), 
            product_data: { name: 'Villa Turaman Order' }, 
            unit_amount: Math.round(amount * 100) // Конвертация в центы
          }, 
          quantity: 1 
        }], 
        mode: 'payment', 
        success_url: successUrl, 
        cancel_url: cancelUrl 
      });
      return res.status(200).json({ success: true, url: session.url });
    }
    
    // === ЛОГИКА YOOKASSA ===
    if (gateway === 'yookassa') {
      const payment = await yooKassa.createPayment({ 
        amount: { value: amount.toString(), currency: 'RUB' }, 
        confirmation: { type: 'redirect', return_url: successUrl }, 
        capture: true, 
        description: 'Оплата Villa Turaman' 
      });
      return res.status(200).json({ success: true, url: payment.confirmation.confirmation_url });
    }
    
    // === ЛОГИКА PAYPAL ===
    if (gateway === 'paypal') {
      const request = new paypal.orders.OrdersCreateRequest(); 
      request.prefer("return=representation"); 
      request.requestBody({ 
        intent: 'CAPTURE', 
        purchase_units: [{ amount: { currency_code: currency, value: amount.toString() } }], 
        application_context: { return_url: successUrl, cancel_url: cancelUrl } 
      });
      const order = await paypalClient.execute(request); 
      return res.status(200).json({ success: true, url: order.result.links.find(link => link.rel === 'approve').href });
    }
    
    // === ЛОГИКА Т-БАНК (ИНТЕГРАЦИЯ ИЗ ТЗ) ===
    if (gateway === 'tbank') {
      // Проверка наличия ключей Т-Банка
      if (!tbankTerminalKey || !tbankSecretKey) {
        return res.status(500).json({ error: "T-Bank credentials are not configured in environment variables." });
      }
      
      const orderId = `villa-${Date.now()}`;
      
      // Формирование Payload для инициализации платежа
      const payload = {
        TerminalKey: tbankTerminalKey,
        Amount: Math.round(amount * 100), // Т-Банк требует сумму в копейках
        OrderId: orderId,
        Description: `Заказ на ${baseUrl}`,
        SuccessURL: successUrl,
        FailURL: cancelUrl,
        Receipt: {
          Email: bookingDetails.contact && bookingDetails.contact.includes('@') ? bookingDetails.contact : 'no-reply@villaturaman.com',
          Taxation: 'usn_income_outcome',
          Items: [
            {
              Name: bookingDetails.checkIn ? `Аренда виллы ${bookingDetails.checkIn}` : 'Заказ услуги/гида',
              Price: Math.round(amount * 100), // Цена в копейках
              Quantity: 1.00,
              Amount: Math.round(amount * 100), // Итоговая сумма в копейках
              Tax: 'none', // Без НДС
              PaymentObject: 'service', // Тип объекта оплаты - услуга
            }
          ]
        }
      };
      
      // Функция генерации SHA-256 токена защиты (Сортировка ключей -> Конкатенация -> Хеширование)
      const generateToken = (args) => {
        const data = { ...args, Password: tbankSecretKey };
        delete data.Receipt; 
        delete data.DATA; 
        delete data.Token;
        // Сортировка ключей в алфавитном порядке
        const sortedKeys = Object.keys(data).sort((a, b) => a.localeCompare(b));
        // Объединение значений
        const concatenatedValues = sortedKeys.map(key => data[key]).join('');
        return crypto.createHash('sha256').update(concatenatedValues).digest('hex');
      };
      
      payload.Token = generateToken(payload); // Добавление токена в payload

      // Инициализация платежной сессии через API Т-Банка
      const tbankRes = await fetch('https://securepay.tinkoff.ru/v2/Init', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(payload) 
      });
      const tbankData = await tbankRes.json();
      
      // Возврат ссылки на форму оплаты при успехе
      if (tbankData.Success && tbankData.PaymentURL) {
        return res.status(200).json({ success: true, url: tbankData.PaymentURL });
      } else {
        return res.status(400).json({ error: tbankData.Message || "Ошибка инициализации платежа Т-Банк", details: tbankData.Details });
      }
    }
    
    // Фолбек для неизвестных шлюзов
    res.status(400).json({ error: "Неизвестный шлюз оплаты" });
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  }
}
EOF

cat << 'EOF' > pages/api/payment_success.js
export default async function handler(req, res) {
  const { data } = req.query; // Получение данных о бронировании из URL
  
  if (data) {
    try {
      const bookingData = JSON.parse(decodeURIComponent(data));
      bookingData.paymentStatus = "ОПЛАЧЕНО"; // Установка статуса оплаты (Задача 4.3)
      
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      
      // Автоматическая отправка подтверждения и сохранение в CRM
      await fetch(`${baseUrl}/api/booking`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(bookingData) 
      });
      
      res.redirect(302, '/?status=success'); // Редирект на главную страницу с флагом успеха
    } catch (e) { 
      res.redirect(302, '/?status=error'); // Редирект в случае ошибки парсинга
    }
  } else { 
    res.redirect(302, '/'); 
  }
}
EOF

cat << 'EOF' > utils/pdf.js
import PDFDocument from 'pdfkit'; // Подключение библиотеки генерации PDF квитанций

// Функция генерации PDF-ваучера (квитанции) для гостя после успешной оплаты
export const generateVoucher = async (bookingData) => {
  return new Promise((resolve) => {
    const doc = new PDFDocument();
    const buffers = [];
    
    // Сборка буферов данных документа
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    
    // Форматирование квитанции
    doc.fontSize(25).text('RECEIPT / КВИТАНЦИЯ', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Project: Villa Turaman`);
    doc.text(`Guest Name: ${bookingData.name}`);
    doc.text(`Details: ${bookingData.checkIn ? `Check-in: ${bookingData.checkIn}` : 'Service/Guide Order'}`);
    doc.text(`Total Count: ${bookingData.total_guests}`);
    doc.text(`Paid Status: CONFIRMED`);
    
    doc.end(); // Завершение формирования документа
  });
};
EOF

cat << 'EOF' > pages/api/export-calendar.js
import { google } from 'googleapis'; // Подключение Google API для формирования собственного iCal

export default async function handler(req, res) {
  try {
    if (!process.env.GOOGLE_PRIVATE_KEY) return res.status(200).send("BEGIN:VCALENDAR\nVERSION:2.0\nEND:VCALENDAR");
    
    // Авторизация в Google Sheets
    const auth = new google.auth.GoogleAuth({ 
      credentials: { 
        client_email: process.env.GOOGLE_CLIENT_EMAIL, 
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n') 
      }, 
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'] 
    });
    
    const sheets = google.sheets({ version: 'v4', auth });
    
    // Получение настроек блокировок из листа CalendarSettings
    const db = await sheets.spreadsheets.values.get({ 
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID, 
      range: `CalendarSettings!A:G` 
    });
    
    const rows = db.data.values || [];
    
    // Инициализация тела ics файла
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Villa Turaman//Booking System//EN\n";
    
    // Генерация событий блокировок
    rows.slice(1).forEach((row, i) => {
      if(row[0] && row[1] && row[2] === 'Блокировка') {
        const start = row[0].split('.').reverse().join(''); 
        const end = row[1].split('.').reverse().join('');
        icsContent += `BEGIN:VEVENT\nUID:block-${i}@villaturaman.com\nDTSTART;VALUE=DATE:${start}\nDTEND;VALUE=DATE:${end}\nSUMMARY:Closed Dates (Villa Turaman)\nSTATUS:CONFIRMED\nEND:VEVENT\n`;
      }
    });
    
    icsContent += "END:VCALENDAR";
    
    // Установка заголовков для отдачи файла как .ics календаря
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8'); 
    res.setHeader('Content-Disposition', 'attachment; filename="villaturaman-schedule.ics"'); 
    res.status(200).send(icsContent);
  } catch (error) { 
    res.status(500).json({ error: "iCal Export Failed" }); 
  }
}
EOF
# 11. ГЛОБАЛЬНЫЙ БЭКЕНД: НАЧАЛО (Инициализация БД, Кэширование и Конфигурация)
cat << 'EOF' > pages/api/booking.js
import { google } from 'googleapis'; // Подключение Google API
import { createClient } from '@vercel/kv'; // Подключение Vercel KV для кэширования

let memoryCache = {}; // Резервный кэш в оперативной памяти на случай сбоя Redis

// Инициализация KV клиента
const getKV = () => {
   if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      try { 
         return createClient({ 
            url: process.env.KV_REST_API_URL, 
            token: process.env.KV_REST_API_TOKEN 
         }); 
      } catch(e) { 
         return null; 
      }
   } 
   return null;
}
const kv = getKV();

// Безопасное получение данных из кэша
const safeCacheGet = async (key) => {
    if (kv) { 
       try { 
          return await kv.get(key); 
       } catch(e) { 
          return memoryCache[key]; 
       } 
    }
    return memoryCache[key];
};

// Безопасная запись данных в кэш
const safeCacheSet = async (key, val, opts) => {
    if (kv) { 
       try { 
          await kv.set(key, val, opts); 
       } catch(e) { 
          memoryCache[key] = val; 
       } 
    } else { 
       memoryCache[key] = val; 
    }
};

// Безопасное удаление данных из кэша
const safeCacheDel = async (key) => {
    if (kv) { 
       try { 
          await kv.del(key); 
       } catch(e) { 
          delete memoryCache[key]; 
       } 
    } else { 
       delete memoryCache[key]; 
    }
};

// Блок конфигурации системы Google Sheets
const GOOGLE_CONFIG = {
  parentFolderId: "11xBSWA02NypliPFbziRSMfC9aAPclYF_", // ID родительской папки на Google Drive
  spreadsheetName: "VillaTuramanWebSitePlatform_DB", // Имя основного файла БД
  sheetName: "Вилла", // Лист бронирований
  homePageSheetName: "HomePage", // Лист контента главной страницы
  accountSheetName: "Accounts", // Лист гостевых аккаунтов
  masterSheetName: "MasterAccount", // Лист аккаунтов владельцев
  calendarSettingsSheetName: "CalendarSettings", // Лист настроек календаря
  productsSheetName: "ExtraServices", // Лист дополнительных услуг
  coursesSheetName: "VideoGuides", // Лист видео-путеводителей
  studentsSheetName: "GuestsAccess", // Лист доступов гостей к контенту
  ordersSheetName: "ServiceOrders", // Лист заказов
  gallerySheetName: "Gallery", // Лист медиа галереи
  aboutSheetName: "About", // Лист раздела О нас
  legalSheetName: "Legal", // Лист юридических документов
  templatesSheetName: "Templates", // Лист текстовых шаблонов
  variablesSheetName: "Variables", // Лист словаря переменных (плейсхолдеров) - Задача 4.2
  
  // Настройки заголовков колонок для каждого листа
  homeHeaders: ["Ключ (ID)", "RU", "EN", "TR", "Медиа/Картинка"],
  headers: [ "Дата заявки", "Имя клиента", "Контакт (Tel/TG)", "Старт", "Завершение", "Ночей", "Взрослых", "Детей", "Всего гостей", "Итоговая стоимость", "Статус оплаты" ],
  accountHeaders: ["Дата регистрации", "Имя", "Контакт (Логин)", "Пароль", "Блок: Сайт", "Блок: Аккаунт", "Блок: Чат"],
  masterHeaders: ["ФИО", "Телефон", "Telegram", "WhatsApp", "Google Email", "Логин", "Пароль", "Роль", "Прав: Финансы", "Прав: Периоды", "Прав: Блок. дат", "Прав: Окно брони", "Прав: Доступ к чатам"],
  calendarSettingsHeaders: ["Дата старта", "Дата завершения", "Тип (Блокировка/Цена/Мин. дней/Заметка/Тип записи/Настройки)", "Значение", "Заметка", "Автор изменения", "Время фиксации"],
  chatHeaders: ["Дата и Время", "Отправитель", "Оригинал", "RU", "EN", "TR", "Ссылка на вложение"],
  productsHeaders: ["ID", "Название услуги (RU)", "Описание (RU)", "Название услуги (EN)", "Описание (EN)", "Название услуги (TR)", "Описание (TR)", "Цена (EUR)", "Цена (RUB)", "Цена (TRY)", "Изображения (через запятую)", "Наличие (Да/Нет)", "Тип (Услуга/Пакет)", "Видео презентации (через запятую)", "Подробное описание (RU)", "Подробное описание (EN)", "Подробное описание (TR)"],
  coursesHeaders: ["ID", "Название путеводителя (RU)", "Описание (RU)", "Название путеводителя (EN)", "Описание (EN)", "Название путеводителя (TR)", "Описание (TR)", "Изображения (через запятую)", "Категория", "Ссылка на видео", "Цена (EUR)", "Цена (RUB)", "Цена (TRY)", "Видео презентации (через запятую)", "Подробное описание (RU)", "Подробное описание (EN)", "Подробное описание (TR)"],
  galleryHeaders: ["ID", "Группа (RU)", "Описание группы (RU)", "Группа (EN)", "Описание группы (EN)", "Группа (TR)", "Описание группы (TR)", "Тип (Фото/Видео/Карусель)", "Медиа (ссылки/iframes через запятую)", "Подпись (RU)", "Подпись (EN)", "Подпись (TR)"],
  aboutHeaders: ["ID Раздела", "Название (RU)", "Название (EN)", "Название (TR)", "Текст (RU)", "Текст (EN)", "Текст (TR)"],
  legalHeaders: ["ID Раздела", "Название (RU)", "Название (EN)", "Название (TR)", "Текст (RU)", "Текст (EN)", "Текст (TR)"],
  templatesHeaders: ["ID Раздела", "Название (RU)", "Название (EN)", "Название (TR)", "Текст (RU)", "Текст (EN)", "Текст (TR)"],
  variablesHeaders: ["Плейсхолдер", "Системный ключ", "Описание переменной", "Значение по умолчанию (Тест)"] // Настройка словаря переменных
};

// Функция парсинга оригинального сообщения без шумов и ошибок перевода
const parseMessageRow = (r) => {
    if (!Array.isArray(r) || r.length === 0) {
        return { date: '', sender: '', original: '', ru: '', en: '', tr: '', file: '' };
    }
    
    const isOld = r.length < 4;
    const orig = r[2] || '';
    
    // Очистка автоперевода от шумов (#Loading, Загрузка и прочее)
    const cln = (v) => (!v || String(v).startsWith('#') || String(v).includes('Loading') || String(v).includes('Загрузка')) ? orig : String(v);
    
    return {
        date: r[0] || '', 
        sender: r[1] || '', 
        original: orig,
        ru: isOld ? orig : cln(r[3]), 
        en: isOld ? orig : cln(r[4]), 
        tr: isOld ? orig : cln(r[5]),
        file: r[6] || ''
    };
};

// Интеллектуальная функция автоматической замены плейсхолдеров в тексте (Задача 4.2)
const replacePlaceholders = (text, dataObj) => {
    if (!text) return "";
    let newText = String(text);
    const keys = Object.keys(dataObj);
    
    // Динамический поиск ключей в словаре и их замена в шаблонах
    keys.forEach(key => {
        const regex = new RegExp(`\\[${key}\\]`, 'g');
        newText = newText.replace(regex, dataObj[key] || '');
    });
    
    return newText;
};

// Формирование стандартизированного названия листа чата
const getChatSheetName = (name, contact) => {
    return `Chat_${(name || '').toString().replace(/[*?:\[\]\\/']/g, '').trim().substring(0, 30)}_${(contact || '').toString().replace(/[*?:\[\]\\/']/g, '').trim().substring(0, 30)}`;
};
EOF

cat << 'EOF' >> pages/api/booking.js

export default async function handler(req, res) {
  // Разрешаем только POST запросы к бэкенду
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  
  const data = req.body; 
  const action = data.action || 'booking';
  
  // Ключи Telegram бота для уведомлений
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN; 
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
  
  let serviceAccountAuth, oauth2Client;
  let sheets, drive, tasksApi, calendarApi;
  let spreadsheetId; // ID основной таблицы
  let chatsSpreadsheetId = process.env.GOOGLE_CHATS_SPREADSHEET_ID; // Внешняя БД для гостевых чатов (Задача 4.5)

  try {
    // Подключение Service Account для работы с Google Sheets / Drive
    if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
      serviceAccountAuth = new google.auth.GoogleAuth({
        credentials: { 
           client_email: process.env.GOOGLE_CLIENT_EMAIL.trim(), 
           private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n').trim() 
        },
        scopes: ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/spreadsheets']
      });
      sheets = google.sheets({ version: 'v4', auth: serviceAccountAuth });
      drive = google.drive({ version: 'v3', auth: serviceAccountAuth });
    }

    // Подключение OAuth 2.0 для задач графа (Tasks) и внешнего календаря
    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN) {
      oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        'https://developers.google.com/oauthplayground'
      );
      oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
      tasksApi = google.tasks({ version: 'v1', auth: oauth2Client });
      calendarApi = google.calendar({ version: 'v3', auth: oauth2Client });
    }

    const isGraphAction = ['get_tasks_graph', 'create_task', 'update_task_status', 'delete_task'].includes(action);
    const isSheetAction = !isGraphAction || action === 'get_tasks_graph';
    
    // Получение или автоматическое создание основной БД
    if (isSheetAction && sheets) {
        const tableSearch = await drive.files.list({ 
           q: `name='${GOOGLE_CONFIG.spreadsheetName}' and '${GOOGLE_CONFIG.parentFolderId}' in parents and trashed=false`, 
           fields: 'files(id)', 
           supportsAllDrives: true, 
           includeItemsFromAllDrives: true 
        });
        
        if (tableSearch.data.files && tableSearch.data.files.length > 0) { 
            spreadsheetId = tableSearch.data.files[0].id; 
        } else { 
            const ss = await sheets.spreadsheets.create({ 
               requestBody: { 
                  properties: { title: GOOGLE_CONFIG.spreadsheetName, locale: 'ru_RU' }, 
                  sheets: [{ properties: { title: GOOGLE_CONFIG.sheetName, index: 0 } }] 
               } 
            }); 
            spreadsheetId = ss.data.spreadsheetId; 
            await drive.files.update({ 
               fileId: spreadsheetId, 
               addParents: GOOGLE_CONFIG.parentFolderId, 
               fields: 'id', 
               supportsAllDrives: true 
            }); 
        }
    } else if (isSheetAction && !sheets) {
        return res.status(500).json({ success: false, error: "Google Service Account credentials for Sheets/Drive are not configured." });
    }
  } catch (err) { 
     return res.status(500).json({ success: false, error: `System Configuration Error: ${err.message}` }); 
  }
  
  // Архитектура устранения циклической ошибки VSTACK (Задача 5.1) 
  // Вынесение формул отдельно от заголовков
  const injectSafeFormulas = async () => {
     const formulaRequests = [];
     const formulaMap = {
        'HomePage': { c: 'C2', f: '=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "ru"; "en"))))' },
        'HomePage_TR': { c: 'D2', f: '=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "ru"; "tr"))))' },
        'About': { c: 'C2', f: '=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "ru"; "en"))))' },
        'About_TR': { c: 'D2', f: '=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "ru"; "tr"))))' },
        'Templates': { c: 'C2', f: '=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "ru"; "en"))))' },
        'Templates_TR': { c: 'D2', f: '=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "ru"; "tr"))))' }
     };

     for (const [key, mapData] of Object.entries(formulaMap)) {
        const sheetName = key.split('_')[0];
        formulaRequests.push({
           range: `'${sheetName}'!${mapData.c}`,
           values: [[mapData.f]]
        });
     }
     
     for (const req of formulaRequests) {
        try {
           await sheets.spreadsheets.values.update({
              spreadsheetId,
              range: req.range,
              valueInputOption: 'USER_ENTERED',
              requestBody: { values: req.values }
           });
        } catch (e) { /* Игнорирование ошибки, если лист еще не создан */ }
     }
  };
EOF
cat << 'EOF' >> pages/api/booking.js

  // Функция определения целевой БД для чатов (Задача 4.5)
  // Все гостевые чаты теперь изолированы в отдельной таблице, если указан её ID
  const getChatSpreadsheetId = () => {
      return chatsSpreadsheetId || spreadsheetId;
  };

  const ensureSystemSheets = async () => {
    const ss = await sheets.spreadsheets.get({ spreadsheetId });
    const existingTitles = ss.data.sheets.map(s => s.properties.title);
    const sheetsToCreate = [];
    
    // Проверка и создание системных листов в основной БД
    if (!existingTitles.includes(GOOGLE_CONFIG.homePageSheetName)) sheetsToCreate.push({ title: GOOGLE_CONFIG.homePageSheetName, headers: GOOGLE_CONFIG.homeHeaders });
    if (!existingTitles.includes(GOOGLE_CONFIG.masterSheetName)) sheetsToCreate.push({ title: GOOGLE_CONFIG.masterSheetName, headers: GOOGLE_CONFIG.masterHeaders });
    if (!existingTitles.includes(GOOGLE_CONFIG.calendarSettingsSheetName)) sheetsToCreate.push({ title: GOOGLE_CONFIG.calendarSettingsSheetName, headers: GOOGLE_CONFIG.calendarSettingsHeaders });
    if (!existingTitles.includes(GOOGLE_CONFIG.sheetName)) sheetsToCreate.push({ title: GOOGLE_CONFIG.sheetName, headers: GOOGLE_CONFIG.headers });
    if (!existingTitles.includes(GOOGLE_CONFIG.accountSheetName)) sheetsToCreate.push({ title: GOOGLE_CONFIG.accountSheetName, headers: GOOGLE_CONFIG.accountHeaders });
    if (!existingTitles.includes(GOOGLE_CONFIG.productsSheetName)) sheetsToCreate.push({ title: GOOGLE_CONFIG.productsSheetName, headers: GOOGLE_CONFIG.productsHeaders });
    if (!existingTitles.includes(GOOGLE_CONFIG.coursesSheetName)) sheetsToCreate.push({ title: GOOGLE_CONFIG.coursesSheetName, headers: GOOGLE_CONFIG.coursesHeaders });
    if (!existingTitles.includes(GOOGLE_CONFIG.studentsSheetName)) sheetsToCreate.push({ title: GOOGLE_CONFIG.studentsSheetName, headers: GOOGLE_CONFIG.studentsHeaders });
    if (!existingTitles.includes(GOOGLE_CONFIG.ordersSheetName)) sheetsToCreate.push({ title: GOOGLE_CONFIG.ordersSheetName, headers: GOOGLE_CONFIG.ordersHeaders });
    if (!existingTitles.includes(GOOGLE_CONFIG.gallerySheetName)) sheetsToCreate.push({ title: GOOGLE_CONFIG.gallerySheetName, headers: GOOGLE_CONFIG.galleryHeaders });
    if (!existingTitles.includes(GOOGLE_CONFIG.aboutSheetName)) sheetsToCreate.push({ title: GOOGLE_CONFIG.aboutSheetName, headers: GOOGLE_CONFIG.aboutHeaders });
    if (!existingTitles.includes(GOOGLE_CONFIG.legalSheetName)) sheetsToCreate.push({ title: GOOGLE_CONFIG.legalSheetName, headers: GOOGLE_CONFIG.legalHeaders });
    if (!existingTitles.includes(GOOGLE_CONFIG.templatesSheetName)) sheetsToCreate.push({ title: GOOGLE_CONFIG.templatesSheetName, headers: GOOGLE_CONFIG.templatesHeaders });
    
    // Интеграция листа словарей и плейсхолдеров (Задача 4.2)
    if (!existingTitles.includes(GOOGLE_CONFIG.variablesSheetName)) sheetsToCreate.push({ title: GOOGLE_CONFIG.variablesSheetName, headers: GOOGLE_CONFIG.variablesHeaders });
    
    if (sheetsToCreate.length > 0) {
      const addRequests = sheetsToCreate.map(sheetDef => ({ addSheet: { properties: { title: sheetDef.title } } }));
      await sheets.spreadsheets.batchUpdate({ spreadsheetId, requestBody: { requests: addRequests } });
      await safeCacheDel('is_sheets_formatted');
    }

    const isFormatted = await safeCacheGet('is_sheets_formatted');
    if (!isFormatted) {
      const updatedSs = await sheets.spreadsheets.get({ spreadsheetId });
      const formatRequests = [];
      
      // Настройка визуального форматирования заголовков листов
      updatedSs.data.sheets.forEach(sheet => {
          const title = sheet.properties.title;
          const sheetId = sheet.properties.sheetId;
          let headers = null;
          if (title === GOOGLE_CONFIG.homePageSheetName) headers = GOOGLE_CONFIG.homeHeaders;
          else if (title === GOOGLE_CONFIG.masterSheetName) headers = GOOGLE_CONFIG.masterHeaders;
          else if (title === GOOGLE_CONFIG.calendarSettingsSheetName) headers = GOOGLE_CONFIG.calendarSettingsHeaders;
          else if (title === GOOGLE_CONFIG.sheetName) headers = GOOGLE_CONFIG.headers;
          else if (title === GOOGLE_CONFIG.accountSheetName) headers = GOOGLE_CONFIG.accountHeaders;
          else if (title === GOOGLE_CONFIG.productsSheetName) headers = GOOGLE_CONFIG.productsHeaders;
          else if (title === GOOGLE_CONFIG.coursesSheetName) headers = GOOGLE_CONFIG.coursesHeaders;
          else if (title === GOOGLE_CONFIG.studentsSheetName) headers = GOOGLE_CONFIG.studentsHeaders;
          else if (title === GOOGLE_CONFIG.ordersSheetName) headers = GOOGLE_CONFIG.ordersHeaders;
          else if (title === GOOGLE_CONFIG.gallerySheetName) headers = GOOGLE_CONFIG.galleryHeaders;
          else if (title === GOOGLE_CONFIG.aboutSheetName) headers = GOOGLE_CONFIG.aboutHeaders;
          else if (title === GOOGLE_CONFIG.legalSheetName) headers = GOOGLE_CONFIG.legalHeaders;
          else if (title === GOOGLE_CONFIG.templatesSheetName) headers = GOOGLE_CONFIG.templatesHeaders;
          else if (title === GOOGLE_CONFIG.variablesSheetName) headers = GOOGLE_CONFIG.variablesHeaders;
          
          if (headers) {
              formatRequests.push({ 
                 updateCells: { 
                    range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: headers.length }, 
                    rows: [{ 
                       values: headers.map((h) => {
                          return { 
                             userEnteredValue: { stringValue: h }, 
                             userEnteredFormat: { 
                                backgroundColor: { red: 0.15, green: 0.20, blue: 0.28 }, 
                                textFormat: { bold: true, fontSize: 11, foregroundColor: { red: 1, green: 1, blue: 1 } }, 
                                horizontalAlignment: 'CENTER', 
                                verticalAlignment: 'MIDDLE', 
                                wrapStrategy: 'WRAP' 
                             } 
                          };
                       }) 
                    }], 
                    fields: 'userEnteredValue,userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment,wrapStrategy)' 
                 } 
              });
              // Закрепление первой строки
              formatRequests.push({ updateSheetProperties: { properties: { sheetId, gridProperties: { frozenRowCount: 1 } }, fields: 'gridProperties.frozenRowCount' } });
          }
      });
      
      if (formatRequests.length > 0) {
          await sheets.spreadsheets.batchUpdate({ spreadsheetId, requestBody: { requests: formatRequests } });
      }
      await safeCacheSet('is_sheets_formatted', true);
    }

    // Применение безопасных формул перевода через MAP вместо VSTACK (Задача 5.1)
    await injectSafeFormulas();

    // Создание Master аккаунта, если отсутствует
    const masterDb = await sheets.spreadsheets.values.get({ spreadsheetId, range: `'${GOOGLE_CONFIG.masterSheetName}'!A:A` });
    const masterRows = masterDb.data.values || [];
    if (masterRows.length <= 1) { 
        await sheets.spreadsheets.values.append({ spreadsheetId, range: `'${GOOGLE_CONFIG.masterSheetName}'!A:M`, valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS', requestBody: { values: [["Aleksei Z", "", "", "", "admin@villaturaman.com", "admin", "admin123", "Главный", "Да", "Да", "Да", "Да", "Да"]] } });
    }

    // Автоматическое заполнение словаря переменных / плейсхолдеров (Задача 4.2)
    const varsDb = await sheets.spreadsheets.values.get({ spreadsheetId, range: `'${GOOGLE_CONFIG.variablesSheetName}'!A:A` });
    if ((varsDb.data.values || []).length <= 1) {
        await sheets.spreadsheets.values.update({ 
           spreadsheetId, 
           range: `'${GOOGLE_CONFIG.variablesSheetName}'!A2:D8`, 
           valueInputOption: 'USER_ENTERED', 
           requestBody: { values: [
               ["[FIRST_NAME]", "name", "Имя гостя", "Иван"],
               ["[CHECKIN_DATE]", "checkIn", "Дата заезда", "01.05.2027"],
               ["[CHECKOUT_DATE]", "checkOut", "Дата выезда", "10.05.2027"],
               ["[CHECKIN_TIME]", "checkInTime", "Стандартное время заезда", "15:00"],
               ["[CHECKOUT_TIME]", "checkOutTime", "Стандартное время выезда", "11:00"],
               ["[GUESTS]", "total_guests", "Общее количество гостей", "4"],
               ["[PRICE]", "totalPrice", "Итоговая стоимость", "150000 RUB"]
           ] } 
        });
    }

    // Инициализация базового контента
    const homeDb = await sheets.spreadsheets.values.get({ spreadsheetId, range: `'${GOOGLE_CONFIG.homePageSheetName}'!A:A` });
    if ((homeDb.data.values || []).length <= 1) {
        await sheets.spreadsheets.values.update({ spreadsheetId, range: `'${GOOGLE_CONFIG.homePageSheetName}'!A2:E6`, valueInputOption: 'USER_ENTERED', requestBody: { values: [
            ["heroTitle", "Villa Turaman", "", "", ""],
            ["heroSubtitle", "Ваш идеальный отдых в Дальяне. Бронирование виллы, премиальный сервис и авторские видео-путеводители от Алексея Знаменского.", "", "", ""],
            ["aboutTitle", "О Вилле", "", "", ""],
            ["aboutText", "Villa Turaman — это гармоничное сочетание уединения, современного комфорта и первоклассного сервиса для незабываемого отпуска в сердце Дальяна.", "", "", ""],
            ["heroImage", "", "", "", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600"]
        ] } });
    }

    const templatesDb = await sheets.spreadsheets.values.get({ spreadsheetId, range: `'${GOOGLE_CONFIG.templatesSheetName}'!A:A` });
    if ((templatesDb.data.values || []).length <= 1) {
        await sheets.spreadsheets.values.update({ spreadsheetId, range: `'${GOOGLE_CONFIG.templatesSheetName}'!A2:B3`, valueInputOption: 'USER_ENTERED', requestBody: { values: [ ["welcome", "Приветствие"], ["confirmation", "Подтверждение"] ] } });
        // В шаблонах по умолчанию теперь используются плейсхолдеры из БД
        await sheets.spreadsheets.values.update({ spreadsheetId, range: `'${GOOGLE_CONFIG.templatesSheetName}'!E2:E3`, valueInputOption: 'USER_ENTERED', requestBody: { values: [ ["Здравствуйте, [FIRST_NAME]! Добро пожаловать. Я владелец Виллы Тураман."], ["Ваша заявка на бронирование [CHECKIN_DATE] — [CHECKOUT_DATE] принята."] ] } });
    }
  };

  // --- API: Получение публичных данных (E-Commerce, Галерея) ---
  if (action === 'get_public_data') {
    try {
        await ensureSystemSheets();
        const productsSheet = await sheets.spreadsheets.values.get({ spreadsheetId, range: `'${GOOGLE_CONFIG.productsSheetName}'!A:Q` });
        const coursesSheet = await sheets.spreadsheets.values.get({ spreadsheetId, range: `'${GOOGLE_CONFIG.coursesSheetName}'!A:Q` });
        const gallerySheet = await sheets.spreadsheets.values.get({ spreadsheetId, range: `'${GOOGLE_CONFIG.gallerySheetName}'!A:L` });
        
        const products = (productsSheet.data.values || []).slice(1).map(r => ({
            id: r[0],
            name: { ru: r[1], en: r[3], tr: r[5] },
            desc: { ru: r[2], en: r[4], tr: r[6] },
            price: { eur: r[7], rub: r[8], try: r[9] },
            images: (r[10] || '').split(',').map(s => s.trim()).filter(Boolean),
            videos: (r[13] || '').split(',').map(s => s.trim()).filter(Boolean),
            detailedDesc: { ru: r[14] || '', en: r[15] || '', tr: r[16] || '' },
            type: {
              ru: r[12] === 'Пакет' ? 'Пакет услуг' : 'Услуга',
              en: r[12] === 'Пакет' ? 'Service Package' : 'Service',
              tr: r[12] === 'Пакет' ? 'Hizmet Paketi' : 'Hizmet'
            }
        })).filter(p => p.id && p.name.ru);

        const courses = (coursesSheet.data.values || []).slice(1).map(r => ({
            id: r[0],
            name: { ru: r[1], en: r[3], tr: r[5] },
            desc: { ru: r[2], en: r[4], tr: r[6] },
            images: (r[7] || '').split(',').map(s => s.trim()).filter(Boolean),
            module: r[8] || 'Основной',
            privateLink: r[9],
            price: { eur: r[10], rub: r[11], try: r[12] },
            videos: (r[13] || '').split(',').map(s => s.trim()).filter(Boolean),
            detailedDesc: { ru: r[14] || '', en: r[15] || '', tr: r[16] || '' },
            level: 'Для гостей'
        })).filter(c => c.id && c.name.ru);

        const gallery = (gallerySheet.data.values || []).slice(1).map(r => ({
            id: r[0],
            group: { ru: r[1], en: r[3], tr: r[5] },
            groupDesc: { ru: r[2], en: r[4], tr: r[6] },
            type: r[7] === 'Видео' ? 'video' : 'image',
            media: (r[8] || '').split(',').map(s => s.trim()).filter(Boolean),
            caption: { ru: r[9], en: r[10], tr: r[11] }
        })).filter(g => g.id && g.media.length > 0);

        return res.status(200).json({ success: true, products, courses, gallery });
    } catch (e) {
        console.error(`[API Error] Action: get_public_data`, e);
        return res.status(500).json({ success: false, error: e.message, products: [], courses: [], gallery: [] });
    }
  }

  // --- API: Получение курсов для мастера (LMS) ---
  if (action === 'master_get_lms') {
    try {
      await ensureSystemSheets();
      const coursesSheet = await sheets.spreadsheets.values.get({ spreadsheetId, range: `'${GOOGLE_CONFIG.coursesSheetName}'!A:Q` });
      const lms = (coursesSheet.data.values || []).slice(1).map(r => ({
          id: r[0],
          name: { ru: r[1], en: r[3], tr: r[5] },
          module: r[8] || 'Основной',
          privateLink: r[9]
      })).filter(c => c.id && c.privateLink);
      return res.status(200).json({ success: true, lms });
    } catch (e) { return res.status(500).json({ success: false, error: e.message }); }
  }

  // --- API: Получение глобальных настроек (включая заезд/выезд Задача 2.1) ---
  if (action === 'get_settings') {
    try {
      const cachedSettings = await safeCacheGet('settings_cache');
      if (cachedSettings) return res.status(200).json(cachedSettings);
      
      await ensureSystemSheets();
      const db = await sheets.spreadsheets.values.get({ spreadsheetId, range: `'${GOOGLE_CONFIG.calendarSettingsSheetName}'!A:G`});
      const rows = db.data.values || []; let globalRules = null; let dateRules = [];
      
      for (let i = rows.length - 1; i >= 0; i--) {
        const row = rows[i];
        if (row[2] === 'Настройки' && !globalRules) {
          try { globalRules = JSON.parse(row[3]); } catch (e) {} 
        } else if (row[2] !== 'Настройки' && row[0] && row[0] !== 'Дата старта') { 
          let isValid = true;
          if (row[2] === 'Блокировка' && row[3] && (row[3] || '').toString().startsWith('HOLD|')) {
              const parts = row[3].split('|');
              if (parts.length === 3) {
                  const expiresAt = new Date(parts[2]).getTime();
                  if (Date.now() > expiresAt) isValid = false;
              }
          }
          if (isValid) dateRules.push({ start: row[0], end: row[1] || row[0], type: row[2], value: row[3], note: row[4] }); 
        } 
      }
      
      // Загрузка словаря переменных для фронтенда (Задача 4.2)
      let variablesDict = {};
      try {
         const varsDb = await sheets.spreadsheets.values.get({ spreadsheetId, range: `'${GOOGLE_CONFIG.variablesSheetName}'!A:B` });
         (varsDb.data.values || []).slice(1).forEach(row => {
             if (row[0] && row[1]) variablesDict[row[1]] = row[0]; // key: name, value: [FIRST_NAME]
         });
      } catch (e) {}
      
      const result = { success: true, globalRules, dateRules, variablesDict }; 
      await safeCacheSet('settings_cache', result, { ex: 3600 });
      return res.status(200).json(result);
    } catch (e) { return res.status(500).json({ success: false, error: e.message }); }
  }

EOF
cat << 'EOF' >> pages/api/booking.js

  // --- УПРАВЛЕНИЕ И ПОЛУЧЕНИЕ ПСЕВДО-ГРАФА ЗАДАЧ И КАЛЕНДАРЯ ---
  if (action === 'get_tasks_graph') {
    try {
      let nodes = []; let edges = []; const clusterMap = new Set(); const nodeTitles = new Map(); let warnings = [];
      
      // Загрузка задач из Google Tasks
      if (tasksApi) {
        try {
            const listRes = await tasksApi.tasklists.list({ maxResults: 100 });
            const taskLists = listRes.data.items || [];
            for (const list of taskLists) {
                nodes.push({ id: list.id, label: list.title, group: 'list', color: '#3b82f6' });
                const tasksRes = await tasksApi.tasks.list({ tasklist: list.id, maxResults: 100, showCompleted: true });
                const tasks = tasksRes.data.items || [];
                for (const task of tasks) {
                    if (!task.title) continue;
                    nodeTitles.set(task.title.trim().toLowerCase(), task.id);
                    const isCompleted = task.status === 'completed';
                    nodes.push({ id: task.id, listId: list.id, label: task.title, group: 'task', status: task.status, color: isCompleted ? '#10b981' : '#f59e0b' });
                    edges.push({ from: task.id, to: list.id, type: 'belongs' });
                    if (task.notes) {
                        const tags = task.notes.match(/#[a-zA-Z0-9_А-Яа-я]+/g);
                        if (tags) {
                            tags.forEach(tag => {
                                const tagId = `tag_${tag.toLowerCase()}`;
                                if (!clusterMap.has(tagId)) { clusterMap.add(tagId); nodes.push({ id: tagId, label: tag, group: 'cluster', color: '#a855f7' }); }
                                edges.push({ from: task.id, to: tagId, type: 'tag' });
                            });
                        }
                    }
                }
            }
        } catch(e) { warnings.push(`Ошибка при загрузке Google Tasks: ${e.message}`); }
      }
      
      // Загрузка событий из Google Calendar
      if (calendarApi) {
        nodes.push({ id: 'gcalendar_hub', label: 'Google Calendar', group: 'hub', color: '#34A853' });
        try {
            const calendarListRes = await calendarApi.calendarList.list();
            const calendars = calendarListRes.data.items || [];
            for (const calendar of calendars) {
                if (calendar.accessRole === 'owner' || calendar.accessRole === 'writer' || calendar.accessRole === 'reader') {
                    nodes.push({ id: calendar.id, label: calendar.summary, group: 'gcal_list', color: '#81C995' });
                    edges.push({ from: calendar.id, to: 'gcalendar_hub', type: 'belongs' });
                    const eventsRes = await calendarApi.events.list({ calendarId: calendar.id, timeMin: (new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).toISOString(), timeMax: (new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).toISOString(), maxResults: 50, singleEvents: true, orderBy: 'startTime' });
                    const events = eventsRes.data.items || [];
                    for (const event of events) {
                        if (!event.summary) continue;
                        const start = event.start.dateTime || event.start.date;
                        nodes.push({ id: event.id, label: event.summary, group: 'gcal_event', color: '#A5D6A7', details: `Когда: ${new Date(start).toLocaleString()}` });
                        edges.push({ from: event.id, to: calendar.id, type: 'gcal_event' });
                    }
                }
            }
        } catch (e) { warnings.push(`Ошибка при загрузке Google Calendar: ${e.message}`); }
      }
      
      // Интеграция iCal событий в граф (Airbnb/Booking)
      nodes.push({ id: 'ical_hub', label: 'Внешние брони (iCal)', group: 'hub', color: '#F4B400' });
      try {
        if (!ical) ical = (await import('node-ical')).default;
        const icalResults = await Promise.allSettled(icalSources.filter(s => s.enabled).map(async (source) => {
            const response = await fetch(`${source.url}${source.url.includes('?') ? '&' : '?'}nocache=${Date.now()}`, { cache: 'no-store' });
            if (!response.ok) throw new Error(`iCal fetch failed for ${source.name} with status ${response.status}`);
            const icsText = await response.text();
            const data = await ical.async.parseICS(icsText);
            return { data, source };
        }));
        
        icalResults.forEach((result) => {
            if (result.status === 'fulfilled') {
                const { data, source } = result.value;
                for (const k in data) {
                    if (Object.hasOwnProperty.call(data, k)) {
                        const ev = data[k];
                        if (ev.type === 'VEVENT' && ev.start) {
                            const start = normalizeDateToUTC(ev.start); const end = normalizeDateToUTC(ev.end || ev.start);
                            const label = `${source.name}: ${ev.summary?.val || ev.summary || 'Бронь'}`; const nodeId = `ical_${source.id}_${ev.uid?.val || ev.uid || k}`;
                            nodes.push({ id: nodeId, label: label, group: 'ical_event', color: source.color || '#FFD54F', details: `Период: ${start.toISOString().split('T')[0]} - ${end.toISOString().split('T')[0]}` });
                            edges.push({ from: nodeId, to: 'ical_hub', type: 'ical_booking' });
                        }
                    }
                }
            }
        });
      } catch (e) { warnings.push(`Ошибка при загрузке iCal: ${e.message}`); }
      
      // Правила внутренней CRM
      if (sheets) {
        nodes.push({ id: 'calendar_hub', label: 'Календарь Виллы (CRM)', group: 'hub', color: '#ef4444' });
        try {
            await ensureSystemSheets();
            const db = await sheets.spreadsheets.values.get({ spreadsheetId, range: `${GOOGLE_CONFIG.calendarSettingsSheetName}!A:G` });
            const rows = db.data.values || [];
            let activeRules = [];
            for (let i = rows.length - 1; i >= 0; i--) {
                const r = rows[i];
                if (r[2] !== 'Настройки' && r[0] && r[1] && !String(r[2]).startsWith('Сброс')) activeRules.push(r);
                if (activeRules.length > 20) break;
            }
            activeRules.forEach((row, idx) => {
                const ruleId = `cal_${idx}`;
                nodes.push({ id: ruleId, label: `[${row[2]}] ${row[0]} - ${row[1]}`, group: 'calendar', color: row[2]==='Блокировка'?'#f87171':'#60a5fa', details: row[3] || 'Нет данных', note: row[4] || '' });
                edges.push({ from: ruleId, to: 'calendar_hub', type: 'calendar_rule' });
            });
        } catch (e) { warnings.push(`Ошибка при загрузке правил из CRM: ${e.message}`); }
      }
      
      return res.status(200).json({ success: true, nodes, edges, warnings });
    } catch (err) { return res.status(500).json({ success: false, error: err.message }); }
  }

  if (action === 'create_task') {
    try {
      if (!tasksApi) return res.status(400).json({ success: false, error: 'Google Tasks API не настроен.' });
      await tasksApi.tasks.insert({ tasklist: data.listId, requestBody: { title: data.title, notes: data.notes || '' } });
      return res.status(200).json({ success: true });
    } catch (err) { return res.status(500).json({ success: false, error: err.message }); }
  }

  if (action === 'update_task_status') {
    try {
      if (!tasksApi) return res.status(400).json({ success: false, error: 'Google Tasks API не настроен.' });
      const task = await tasksApi.tasks.get({ tasklist: data.listId, task: data.taskId });      
      const updatedTask = { ...task.data, status: data.status };
      await tasksApi.tasks.update({ tasklist: data.listId, task: data.taskId, requestBody: updatedTask });
      return res.status(200).json({ success: true });
    } catch (err) { return res.status(500).json({ success: false, error: err.message }); }
  }

  if (action === 'delete_task') {
    try {
      if (!tasksApi) return res.status(400).json({ success: false, error: 'Google Tasks API не настроен.' });
      await tasksApi.tasks.delete({ tasklist: data.listId, task: data.taskId });
      return res.status(200).json({ success: true });
    } catch (err) { return res.status(500).json({ success: false, error: err.message }); }
  }

  // --- ЛОГИКА CRM И АВТОРИЗАЦИИ (С поддержкой разделенных БД) ---
  if (action === 'register') {
    try {
      const targetChatId = getChatSpreadsheetId(); // Получение ID таблицы для чатов
      
      await ensureSystemSheets(); // Проверка структуры основной БД
      
      const safeContact = (data.contact || '').toString().trim().toLowerCase();
      
      // Проверка существования пользователя в основной БД
      const existingData = await sheets.spreadsheets.values.get({ spreadsheetId, range: `'${GOOGLE_CONFIG.accountSheetName}'!C:C` });
      const logins = existingData.data.values ? existingData.data.values.flat().map(v => (v || '').toString().trim().toLowerCase()) : [];
      if (logins.includes(safeContact)) return res.status(200).json({ success: false, error: "error_user_exists" });
      
      const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
      
      // Запись нового пользователя в основную БД
      await sheets.spreadsheets.values.append({ 
         spreadsheetId, 
         range: `${GOOGLE_CONFIG.accountSheetName}!A:G`, 
         valueInputOption: 'USER_ENTERED', 
         insertDataOption: 'INSERT_ROWS', 
         requestBody: { values: [[timestamp, (data.name || '').toString().trim(), (data.contact || '').toString().trim(), (data.password || '').toString().trim() || "123456", "Нет", "Нет", "Нет"]] } 
      });
      
      // Создание персонального листа чата во ВНЕШНЕЙ БД (Задача 4.5)
      const chatSheetName = getChatSheetName((data.name || '').toString().trim(), (data.contact || '').toString().trim());
      const chatDbMetadata = await sheets.spreadsheets.get({ spreadsheetId: targetChatId });
      
      if (!chatDbMetadata.data.sheets.find(s => s.properties.title === chatSheetName)) {
        // Создаем лист
        await sheets.spreadsheets.batchUpdate({ 
           spreadsheetId: targetChatId, 
           requestBody: { requests: [{ addSheet: { properties: { title: chatSheetName } } }] } 
        });
        
        // Получаем ID созданного листа для форматирования
        const updatedChatDb = await sheets.spreadsheets.get({ spreadsheetId: targetChatId });
        const newSheet = updatedChatDb.data.sheets.find(s => s.properties.title === chatSheetName);
        
        // Применяем заголовки и стили к листу чата
        if (newSheet) {
           await sheets.spreadsheets.batchUpdate({
              spreadsheetId: targetChatId,
              requestBody: {
                 requests: [
                    { 
                       updateCells: { 
                          range: { sheetId: newSheet.properties.sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: GOOGLE_CONFIG.chatHeaders.length }, 
                          rows: [{ values: GOOGLE_CONFIG.chatHeaders.map(h => ({ userEnteredValue: { stringValue: h }, userEnteredFormat: { backgroundColor: { red: 0.15, green: 0.20, blue: 0.28 }, textFormat: { bold: true, fontSize: 11, foregroundColor: { red: 1, green: 1, blue: 1 } }, horizontalAlignment: 'CENTER', verticalAlignment: 'MIDDLE' } })) }], 
                          fields: 'userEnteredValue,userEnteredFormat' 
                       } 
                    },
                    { updateSheetProperties: { properties: { sheetId: newSheet.properties.sheetId, gridProperties: { frozenRowCount: 1 } }, fields: 'gridProperties.frozenRowCount' } }
                 ]
              }
           });
        }
      }
      
      const userObj = { name: (data.name || '').toString().trim(), contact: (data.contact || '').toString().trim(), isHost: false, blockChat: false, hasChat: true };
      return res.status(200).json({ success: true, message: "Регистрация успешна", user: userObj });
    } catch (e) { return res.status(500).json({ success: false, error: e.message }); }
  }

  if (action === 'login') {
    try {
      await ensureSystemSheets();
      const targetChatId = getChatSpreadsheetId();
      const safeContact = (data.contact || '').toString().trim().toLowerCase(); 
      const safePassword = (data.password || '').toString().trim();
      
      // Поиск владельца (MasterAccount)
      const masterDb = await sheets.spreadsheets.values.get({ spreadsheetId, range: `'${GOOGLE_CONFIG.masterSheetName}'!A:M` });
      const masterUser = (masterDb.data.values || []).find(r => { 
         const rowEmail = (r[4] || '').toString().trim().toLowerCase(); 
         const rowLogin = (r[5] || '').toString().trim().toLowerCase(); 
         const rowPassword = (r[6] || '').toString().trim(); 
         return (rowEmail === safeContact || rowLogin === safeContact) && rowPassword === safePassword; 
      });
      
      if (masterUser) {
        const permissions = { finance: (masterUser[8] || '').toString().trim().toLowerCase() === 'да', periods: (masterUser[9] || '').toString().trim().toLowerCase() === 'да', blocks: (masterUser[10] || '').toString().trim().toLowerCase() === 'да', bookingWindow: (masterUser[11] || '').toString().trim().toLowerCase() === 'да', chats: (masterUser[12] || '').toString().trim().toLowerCase() === 'да' };
        return res.status(200).json({ success: true, user: { name: (masterUser[0] || 'Admin').toString().trim(), contact: safeContact, isHost: true, role: (masterUser[7] || 'Admin').toString(), permissions } });
      }
      
      // Поиск гостя (Accounts)
      const db = await sheets.spreadsheets.values.get({ spreadsheetId, range: `'${GOOGLE_CONFIG.accountSheetName}'!A:G` });
      const userRow = (db.data.values || []).find(r => (r[2] || '').toString().trim().toLowerCase() === safeContact && (r[3] || '').toString().trim() === safePassword);
      
      if (!userRow) return res.status(200).json({ success: false, error: "error_invalid_login" });
      if ((userRow[4] || '').toString().trim().toLowerCase() === 'да') return res.status(200).json({ success: false, blockType: 'site', error: "error_site_blocked" });
      if ((userRow[5] || '').toString().trim().toLowerCase() === 'да') return res.status(200).json({ success: false, blockType: 'account', error: "error_account_suspended" });
      
      const blockChat = (userRow[6] || '').toString().trim().toLowerCase() === 'да';
      
      // Проверка чата во ВНЕШНЕЙ БД
      const chatDbMetadata = await sheets.spreadsheets.get({ spreadsheetId: targetChatId });
      const chatExists = !!chatDbMetadata.data.sheets.find(s => s.properties.title === getChatSheetName(userRow[1], userRow[2]));
      
      return res.status(200).json({ success: true, user: { name: (userRow[1] || 'Guest').toString().trim(), contact: (userRow[2] || '').toString().trim(), isHost: false, blockChat, hasChat: chatExists } });
    } catch (e) { return res.status(500).json({ success: false, error: e.message }); }
  }

  // Получение всех чатов для панели администратора (Комбинирование из 2х БД)
  if (action === 'master_get_chats') {
    try {
      await ensureSystemSheets();
      const targetChatId = getChatSpreadsheetId();
      
      // 1. Получаем заказы из ОСНОВНОЙ БД
      let dbBooking = { data: { values: [] } };
      try {
         dbBooking = await sheets.spreadsheets.values.get({ spreadsheetId, range: `'Вилла'!A:K` });
      } catch(e) {}
      
      const allBookings = dbBooking.data.values || [];
      const requests = allBookings.slice(1).map((r, i) => {
        let statusFull = r[10] || ''; let status = statusFull; let expiresAt = null;
        if (statusFull.startsWith('СПЕЦПРЕДЛОЖЕНИЕ|')) { const parts = statusFull.split('|'); status = 'СПЕЦПРЕДЛОЖЕНИЕ'; expiresAt = parts[1]; } 
        else if (statusFull.startsWith('ОЖИДАЕТ ОПЛАТЫ|')) { const parts = statusFull.split('|'); status = 'ОЖИДАЕТ ОПЛАТЫ'; expiresAt = parts[1]; }
        return { rowIndex: i + 1, date: r[0], name: r[1], contact: r[2], checkIn: r[3], checkOut: r[4], nights: r[5], adults: r[6], children: r[7], guests: r[8], price: r[9], status, expiresAt };
      });
      
      // 2. Получаем чаты из ЧАТОВОЙ БД
      const chatDbMetadata = await sheets.spreadsheets.get({ spreadsheetId: targetChatId });
      let allChats = [];
      
      for (const sheet of chatDbMetadata.data.sheets.filter(s => s.properties.title.startsWith('Chat_'))) {
        const title = sheet.properties.title; const parts = title.split('_');
        const clientName = parts[1]; const clientContact = parts[2];
        
        const chatDb = await sheets.spreadsheets.values.get({ spreadsheetId: targetChatId, range: `'${title}'!A:G` });
        
        // Связываем заявки из основной БД с чатом
        const userRequests = requests.filter(r => (r.contact || '').trim().toLowerCase() === (clientContact || '').trim().toLowerCase() && (r.status === 'ЗАПРОС' || r.status === 'ОЖИДАЕТ ОПЛАТЫ' || r.status === 'СПЕЦПРЕДЛОЖЕНИЕ'));
        userRequests.sort((a, b) => { const dA = a.checkIn.split('.').reverse().join(''); const dB = b.checkIn.split('.').reverse().join(''); return dA.localeCompare(dB); });
        
        allChats.push({ sheetName: title, clientName, clientContact, activeRequests: userRequests, messages: (chatDb.data.values || []).slice(1).map(parseMessageRow) });
      }
      return res.status(200).json({ success: true, chats: allChats });
    } catch (e) { return res.status(500).json({ success: false, error: e.message }); }
  }
EOF
cat << 'EOF' >> pages/api/booking.js

  // --- ЛОГИКА КЛИЕНТСКОГО ЧАТА (Чтение и Запись через внешнюю БД - Задача 4.5) ---
  if (action === 'chat') {
    try {
      const targetChatId = getChatSpreadsheetId();
      const chatSheetName = getChatSheetName(data.sender, data.contact);
      
      // Обработка входящего сообщения от клиента
      if (data.message || data.fileBase64) {
        const safeContact = (data.contact || '').toString().trim().toLowerCase();
        
        // Проверка блокировки чата пользователя (в основной БД)
        const db = await sheets.spreadsheets.values.get({ spreadsheetId, range: `'${GOOGLE_CONFIG.accountSheetName}'!A:G` });
        const userRow = (db.data.values || []).find(r => (r[2] || '').toString().trim().toLowerCase() === safeContact);
        if (userRow && (userRow[6] || '').toString().trim().toLowerCase() === 'да') {
           return res.status(200).json({ success: false, error: "Доступ к чату заблокирован администратором." });
        }
        
        let fileUrl = "";
        
        // Отправка вложений в Telegram (если настроено)
        if (data.fileBase64 && data.fileName && data.mimeType && TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
          try {
            const formData = new FormData(); 
            formData.append('chat_id', TELEGRAM_CHAT_ID); 
            formData.append('document', new Blob([Buffer.from(data.fileBase64, 'base64')], { type: data.mimeType }), data.fileName); 
            formData.append('caption', `📁 Вложение!\nОт: ${data.sender}\nКонтакт: ${data.contact}`);
            
            const tgRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, { method: 'POST', body: formData });
            fileUrl = (await tgRes.json()).ok ? "Файл доставлен" : "Ошибка доставки";
          } catch (fileErr) { 
            fileUrl = "Сбой передачи"; 
          }
        }
        
        const msgText = data.message || '';
        
        // Формирование безопасных формул перевода для новой строки
        const fRU = msgText && typeof msgText === 'string' ? '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "ru")' : '';
        const fEN = msgText && typeof msgText === 'string' ? '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "en")' : '';
        const fTR = msgText && typeof msgText === 'string' ? '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "tr")' : '';
        
        // Запись сообщения во внешнюю БД чатов
        await sheets.spreadsheets.values.append({ 
           spreadsheetId: targetChatId, 
           range: `'${chatSheetName}'!A:G`, 
           valueInputOption: 'USER_ENTERED', 
           insertDataOption: 'INSERT_ROWS', 
           requestBody: { values: [[new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' }), data.sender || 'Клиент', msgText, fRU, fEN, fTR, fileUrl]] } 
        });
      }
      
      // Чтение истории сообщений из внешней БД
      const chatDb = await sheets.spreadsheets.values.get({ spreadsheetId: targetChatId, range: `'${chatSheetName}'!A:G` });
      
      // Чтение активных заявок из основной БД
      let dbBooking = { data: { values: [] } };
      try { 
         dbBooking = await sheets.spreadsheets.values.get({ spreadsheetId, range: `'Вилла'!A:K` }); 
      } catch(e) {}
      
      const allBookings = dbBooking.data.values || [];
      const userRequests = allBookings.slice(1).map((r, i) => {
        let statusFull = r[10] || ''; let status = statusFull; let expiresAt = null;
        if (statusFull.startsWith('СПЕЦПРЕДЛОЖЕНИЕ|')) { const parts = statusFull.split('|'); status = 'СПЕЦПРЕДЛОЖЕНИЕ'; expiresAt = parts[1]; }
        else if (statusFull.startsWith('ОЖИДАЕТ ОПЛАТЫ|')) { const parts = statusFull.split('|'); status = 'ОЖИДАЕТ ОПЛАТЫ'; expiresAt = parts[1]; }
        return { rowIndex: i + 1, date: r[0], name: r[1], contact: r[2], checkIn: r[3], checkOut: r[4], nights: r[5], adults: r[6], children: r[7], guests: r[8], price: r[9], status, expiresAt };
      }).filter(r => r.contact === data.contact && (r.status === 'ЗАПРОС' || r.status === 'ОЖИДАЕТ ОПЛАТЫ' || r.status === 'СПЕЦПРЕДЛОЖЕНИЕ'));
      
      userRequests.sort((a, b) => { 
         const dA = a.checkIn.split('.').reverse().join(''); 
         const dB = b.checkIn.split('.').reverse().join(''); 
         return dA.localeCompare(dB); 
      });
      
      return res.status(200).json({ success: true, messages: (chatDb.data.values || []).slice(1).map(parseMessageRow), activeRequests: userRequests });
    } catch (e) { 
      return res.status(500).json({ success: false, error: e.message }); 
    }
  }

  // --- ЛОГИКА МОДЕРАЦИИ БРОНИРОВАНИЙ ВЛАДЕЛЬЦЕМ ---

  if (action === 'approve_request') {
    try {
      const targetChatId = getChatSpreadsheetId();
      // Выделяем 24 часа на оплату заявки
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      const statusStr = `ОЖИДАЕТ ОПЛАТЫ|${expiresAt}`;
      const range = `'Вилла'!K${data.rowIndex + 1}`;
      
      // Обновляем статус в основной БД
      await sheets.spreadsheets.values.update({ spreadsheetId, range, valueInputOption: 'USER_ENTERED', requestBody: { values: [[statusStr]] } });
      
      const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
      const deadlineStr = new Date(expiresAt).toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
      
      // Устанавливаем жесткий блок в календаре до истечения времени оплаты
      const ruleRow = [data.checkIn, data.checkOut, "Блокировка", `HOLD|${data.contact}|${expiresAt}`, "Ожидание оплаты (Одобрено)", "Система", timestamp];
      await sheets.spreadsheets.values.append({ spreadsheetId, range: `'${GOOGLE_CONFIG.calendarSettingsSheetName}'!A:G`, valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS', requestBody: { values: [ruleRow] } });
      
      // Формирование дружелюбного сообщения с инструкциями и плейсхолдерами (Задачи 4.2 и 4.3)
      const variablesData = {
          "[CHECKIN_DATE]": data.checkIn,
          "[CHECKOUT_DATE]": data.checkOut,
          "[DEADLINE]": deadlineStr
      };
      
      let msgTemplate = `✅ Здравствуйте! С радостью сообщаю, что ваша заявка на проживание с [CHECKIN_DATE] по [CHECKOUT_DATE] успешно одобрена.\n\nДля подтверждения бронирования и фиксации дат за вами, пожалуйста, перейдите в панель бронирования (наверху) и завершите процесс онлайн-оплаты.\n\n⏳ Счет действителен до: [DEADLINE].\nЕсли у вас возникнут вопросы — я на связи!`;
      const msg = replacePlaceholders(msgTemplate, variablesData);
      
      // Отправка системного сообщения во внешнюю БД чатов
      await sheets.spreadsheets.values.append({ 
         spreadsheetId: targetChatId, 
         range: `'${data.chatSheetName}'!A:G`, 
         valueInputOption: 'USER_ENTERED', 
         insertDataOption: 'INSERT_ROWS', 
         requestBody: { values: [[timestamp, "Владелец", msg, '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "ru")', '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "en")', '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "tr")', ""]] } 
      });
      
      await safeCacheDel('settings_cache');
      return res.status(200).json({ success: true });
    } catch (e) { return res.status(500).json({ success: false, error: e.message }); }
  }

  if (action === 'special_offer') {
    try {
      const targetChatId = getChatSpreadsheetId();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      const statusStr = `СПЕЦПРЕДЛОЖЕНИЕ|${expiresAt}`;
      const range = `'Вилла'!D${data.rowIndex + 1}:K${data.rowIndex + 1}`;
      
      await sheets.spreadsheets.values.update({ spreadsheetId, range, valueInputOption: 'USER_ENTERED', requestBody: { values: [[data.checkIn, data.checkOut, data.nights, data.adults, data.children, data.guests, data.price, statusStr]] } });
      
      const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
      const deadlineStr = new Date(expiresAt).toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
      
      const ruleRow = [data.checkIn, data.checkOut, "Блокировка", `HOLD|${data.clientContact}|${expiresAt}`, "Ожидание оплаты (Спецпредложение)", "Система", timestamp];
      await sheets.spreadsheets.values.append({ spreadsheetId, range: `'${GOOGLE_CONFIG.calendarSettingsSheetName}'!A:G`, valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS', requestBody: { values: [ruleRow] } });
      
      const msg = `🎁 Для вас сформировано специальное предложение!\n\nДаты проживания: ${data.checkIn} — ${data.checkOut}\nОбновленная стоимость: ${data.price}\n\nПожалуйста, перейдите к оплате в карточке бронирования выше. Окно оплаты открыто до: ${deadlineStr}.`;
      await sheets.spreadsheets.values.append({ spreadsheetId: targetChatId, range: `'${data.chatSheetName}'!A:G`, valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS', requestBody: { values: [[timestamp, "Владелец", msg, '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "ru")', '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "en")', '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "tr")', ""]] } });
      
      await safeCacheDel('settings_cache');
      return res.status(200).json({ success: true });
    } catch (e) { return res.status(500).json({ success: false, error: e.message }); }
  }

  if (action === 'revoke_request') {
    try {
      const targetChatId = getChatSpreadsheetId();
      const range = `'Вилла'!K${data.rowIndex + 1}`;
      await sheets.spreadsheets.values.update({ spreadsheetId, range, valueInputOption: 'USER_ENTERED', requestBody: { values: [["ОТОЗВАНО"]] } });
      
      const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
      
      // Сброс блокировки календаря
      const ruleRow = [data.checkIn, data.checkOut, "Сброс блокировки", "СБРОС", "Отозвано владельцем", "Система", timestamp];
      await sheets.spreadsheets.values.append({ spreadsheetId, range: `'${GOOGLE_CONFIG.calendarSettingsSheetName}'!A:G`, valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS', requestBody: { values: [ruleRow] } });
      
      const msg = `❌ Сообщаю, что предложение на бронирование с ${data.checkIn} по ${data.checkOut} было отозвано администрацией. Если это ошибка — напишите мне.`;
      await sheets.spreadsheets.values.append({ spreadsheetId: targetChatId, range: `'${data.chatSheetName}'!A:G`, valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS', requestBody: { values: [[timestamp, "Владелец", msg, '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "ru")', '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "en")', '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "tr")', ""]] } });
      
      await safeCacheDel('settings_cache');
      return res.status(200).json({ success: true });
    } catch (e) { return res.status(500).json({ success: false, error: e.message }); }
  }

  if (action === 'reject_request') {
    try {
      const targetChatId = getChatSpreadsheetId();
      const range = `'Вилла'!K${data.rowIndex + 1}`;
      await sheets.spreadsheets.values.update({ spreadsheetId, range, valueInputOption: 'USER_ENTERED', requestBody: { values: [["ОТКЛОНЕНО"]] } });
      
      const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
      const msg = `❌ К сожалению, ваша заявка на даты ${data.checkIn} — ${data.checkOut} была отклонена. Пожалуйста, выберите другие доступные даты в календаре.`;
      await sheets.spreadsheets.values.append({ spreadsheetId: targetChatId, range: `'${data.chatSheetName}'!A:G`, valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS', requestBody: { values: [[timestamp, "Владелец", msg, '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "ru")', '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "en")', '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "tr")', ""]] } });
      
      await safeCacheDel('settings_cache');
      return res.status(200).json({ success: true });
    } catch (e) { return res.status(500).json({ success: false, error: e.message }); }
  }

  // --- МАССОВАЯ РАССЫЛКА И РУЧНОЕ УПРАВЛЕНИЕ КАЛЕНДАРЕМ ---

  if (action === 'master_send_chats') {
    try {
      const targetChatId = getChatSpreadsheetId();
      const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
      
      for (const sheetName of (data.targetSheets || [])) {
        // Подстановка имени клиента для рассылки (Зачатки плейсхолдеров)
        const cName = sheetName.split('_')[1] || 'Гость';
        const msgText = (data.message || '').toString().replace(/\{Имя\}/g, cName).replace(/\[FIRST_NAME\]/g, cName);
        
        const fRU = msgText && typeof msgText === 'string' ? '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "ru")' : '';
        const fEN = msgText && typeof msgText === 'string' ? '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "en")' : '';
        const fTR = msgText && typeof msgText === 'string' ? '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "tr")' : '';
        
        await sheets.spreadsheets.values.append({ 
           spreadsheetId: targetChatId, 
           range: `'${sheetName}'!A:G`, 
           valueInputOption: 'USER_ENTERED', 
           insertDataOption: 'INSERT_ROWS', 
           requestBody: { values: [[timestamp, data.sender || 'Владелец', msgText, fRU, fEN, fTR, ""]] } 
        });
      }
      return res.status(200).json({ success: true });
    } catch (e) { return res.status(500).json({ success: false, error: e.message }); }
  }

  if (action === 'master_save_calendar') {
    try {
      await ensureSystemSheets();
      const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
      
      const rows = (data.rules || []).map(r => [
          r.start, 
          r.end, 
          r.type, 
          r.value !== undefined ? r.value : "", 
          r.note !== undefined ? r.note : "", 
          data.sender || "Admin", 
          timestamp
      ]);
      
      if (rows.length > 0) {
        await sheets.spreadsheets.values.append({ 
           spreadsheetId, 
           range: `'${GOOGLE_CONFIG.calendarSettingsSheetName}'!A:G`, 
           valueInputOption: 'USER_ENTERED', 
           insertDataOption: 'INSERT_ROWS', 
           requestBody: { values: rows } 
        });
        await safeCacheDel('settings_cache');
      }
      return res.status(200).json({ success: true });
    } catch (e) { return res.status(500).json({ success: false, error: e.message }); }
  }

  if (action === 'master_save_global_rules') {
    try {
      await ensureSystemSheets();
      await sheets.spreadsheets.values.append({ 
         spreadsheetId, 
         range: `'${GOOGLE_CONFIG.calendarSettingsSheetName}'!A:G`, 
         valueInputOption: 'USER_ENTERED', 
         insertDataOption: 'INSERT_ROWS', 
         requestBody: { values: [["Глобальные правила", "Все даты", "Настройки", JSON.stringify(data.rules), "Изменение лимитов", data.sender || "Admin", new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' })]] } 
      });
      await safeCacheDel('settings_cache');
      return res.status(200).json({ success: true });
    } catch (e) { return res.status(500).json({ success: false, error: e.message }); }
  }

  // --- ЛОГИКА СОЗДАНИЯ ЗАЯВОК (С добавлением вывода стоимости Задача 4.1) ---

  if (action === 'request_booking') {
    try {
      if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
        const message = `⚠️ НОВАЯ ЗАЯВКА (Модерация)\n👤 Гость: ${data.name}\n📞 Связь: ${data.contact}\n📅 Период: ${data.checkIn} — ${data.checkOut}\n👥 Количество: ${data.total_guests}\n💰 Стоимость: ${data.totalPrice}`;
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message }) });
      }
      
      const targetChatId = getChatSpreadsheetId();
      let userObj = null;
      
      if (!data.isRegistered) {
        const safeContact = (data.contact || '').toString().trim().toLowerCase();
        const existingData = await sheets.spreadsheets.values.get({ spreadsheetId, range: `'${GOOGLE_CONFIG.accountSheetName}'!C:C` });
        const logins = existingData.data.values ? existingData.data.values.flat().map(v => (v || '').toString().trim().toLowerCase()) : [];
        if (!logins.includes(safeContact)) {
            const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
            await sheets.spreadsheets.values.append({ spreadsheetId, range: `'${GOOGLE_CONFIG.accountSheetName}'!A:G`, valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS', requestBody: { values: [[timestamp, (data.name || '').toString().trim(), (data.contact || '').toString().trim(), "123456", "Нет", "Нет", "Нет"]] } });
        }
        userObj = { name: (data.name || '').toString().trim(), contact: (data.contact || '').toString().trim(), isHost: false, blockChat: false, hasChat: true };
      } else { 
        userObj = { name: (data.name || '').toString().trim(), contact: (data.contact || '').toString().trim(), isHost: false, blockChat: false, hasChat: true }; 
      }
      
      const chatSheetName = getChatSheetName(data.name, data.contact);
      const chatDbMetadata = await sheets.spreadsheets.get({ spreadsheetId: targetChatId });
      
      if (!chatDbMetadata.data.sheets.find(s => s.properties.title === chatSheetName)) {
        await sheets.spreadsheets.batchUpdate({ spreadsheetId: targetChatId, requestBody: { requests: [{ addSheet: { properties: { title: chatSheetName } } }] } });
      }
      
      const ss = await sheets.spreadsheets.get({ spreadsheetId });
      if (!ss.data.sheets.find(s => s.properties.title === 'Вилла')) {
         await sheets.spreadsheets.batchUpdate({ spreadsheetId, requestBody: { requests: [{ addSheet: { properties: { title: 'Вилла' } } }] } });
         await sheets.spreadsheets.values.update({ spreadsheetId, range: `'Вилла'!A1:K1`, valueInputOption: 'USER_ENTERED', requestBody: { values: [GOOGLE_CONFIG.headers] } });
      }

      const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
      
      // Системное сообщение с деталями и стоимостью (Задача 4.1)
      const miniCard = `📋 Заявка отправлена на модерацию.\nДетали: ${data.checkIn} — ${data.checkOut}\nКоличество: ${data.total_guests}\nСтоимость: ${data.totalPrice}\n\nОжидайте подтверждения от владельца.`;
      
      await sheets.spreadsheets.values.append({ spreadsheetId: targetChatId, range: `'${chatSheetName}'!A:G`, valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS', requestBody: { values: [[timestamp, "Система", miniCard, '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "ru")', '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "en")', '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "tr")', ""]] } });
      await sheets.spreadsheets.values.append({ spreadsheetId, range: `'Вилла'!A:K`, valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS', requestBody: { values: [[timestamp, data.name, data.contact, data.checkIn, data.checkOut, data.nights, data.total_adults, data.total_children, data.total_guests, data.totalPrice || "", "ЗАПРОС"]] } });
      
      return res.status(200).json({ success: true, user: userObj });
    } catch (err) { return res.status(500).json({ success: false, error: err.message }); }
  }

  if (action === 'booking') {
    try {
      if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
        const message = `🚀 НОВЫЙ ЗАКАЗ/БРОНЬ (Мгновенная)\n👤 Гость: ${data.name || 'Не указано'}\n📞 Связь: ${data.contact || 'Не указано'}\nДетали: ${data.checkIn} — ${data.checkOut}\nКоличество: ${data.total_guests}\n💰 Оплачено: ${data.totalPrice}`;
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message }) });
      }
      
      const ss = await sheets.spreadsheets.get({ spreadsheetId });
      
      if (!ss.data.sheets.find(s => s.properties.title === 'Вилла')) {
         await sheets.spreadsheets.batchUpdate({ spreadsheetId, requestBody: { requests: [{ addSheet: { properties: { title: 'Вилла' } } }] } });
         await sheets.spreadsheets.values.update({ spreadsheetId, range: `'Вилла'!A1:K1`, valueInputOption: 'USER_ENTERED', requestBody: { values: [GOOGLE_CONFIG.headers] } });
      }

      const timestamp = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Istanbul' });
      await sheets.spreadsheets.values.append({ spreadsheetId, range: `'Вилла'!A:K`, valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS', requestBody: { values: [[timestamp, data.name, data.contact, data.checkIn, data.checkOut, data.nights, data.total_adults, data.total_children, data.total_guests, data.totalPrice || "", data.paymentStatus || "ОЖИДАЕТ ОПЛАТЫ"]] } });
      
      if (data.isRegistered && data.contact) {
        const targetChatId = getChatSpreadsheetId();
        const chatSheetName = getChatSheetName(data.name, data.contact);
        const chatDbMetadata = await sheets.spreadsheets.get({ spreadsheetId: targetChatId });
        
        if (!chatDbMetadata.data.sheets.find(s => s.properties.title === chatSheetName)) {
          await sheets.spreadsheets.batchUpdate({ spreadsheetId: targetChatId, requestBody: { requests: [{ addSheet: { properties: { title: chatSheetName } } }] } });
        }
        
        const miniCard = `✅ Заказ успешно оформлен!\nДетали: ${data.checkIn} — ${data.checkOut}\nКоличество: ${data.total_guests}\nСумма транзакции: ${data.totalPrice}`;
        await sheets.spreadsheets.values.append({ spreadsheetId: targetChatId, range: `'${chatSheetName}'!A:G`, valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS', requestBody: { values: [[timestamp, "Система", miniCard, '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "ru")', '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "en")', '=GOOGLETRANSLATE(INDIRECT("C"&ROW()); "auto"; "tr")', ""]] } });
      }
      return res.status(200).json({ success: true });
    } catch (err) { return res.status(500).json({ success: false, error: err.message }); }
  }
}
EOF
# 13. БЭКЕНД: РЕВАЛИДАЦИЯ КОНТЕНТА ПО ЗАПРОСУ (On-Demand ISR)
cat << 'EOF' > pages/api/revalidate.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  if (req.query.secret !== process.env.REVALIDATE_SECRET_TOKEN) {
    return res.status(401).json({ message: 'Invalid token' });
  }
  try {
    await res.revalidate('/');
    await res.revalidate('/legal/kvkk');
    await res.revalidate('/legal/contract');
    await res.revalidate('/legal/cancellation');
    await res.revalidate('/legal/privacy');
    return res.json({ revalidated: true });
  } catch (err) {
    return res.status(500).send('Error revalidating');
  }
}
EOF

# 14. БЭКЕНД АВТОРИЗАЦИИ 2FA ДЛЯ ЗАКРЫТОЙ СТРАНИЦЫ ВЛАДЕЛЬЦА
cat << 'EOF' > pages/api/admin/verify-2fa.js
import speakeasy from 'speakeasy';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  const { token } = req.body;
  const appSecret = process.env.NEXT_PUBLIC_ADMIN_2FA_SECRET;
  
  if (!appSecret) {
    return res.status(400).json({ success: false, error: "error_2fa_secret_not_found" });
  }
  
  const verified = speakeasy.totp.verify({
    secret: appSecret,
    encoding: 'base32',
    token: token,
    window: 2
  });
  
  if (verified) {
    const sessionToken = jwt.sign({ role: 'owner' }, appSecret, { expiresIn: '12h' });
    return res.status(200).json({ success: true, sessionToken });
  } else {
    return res.status(400).json({ success: false, error: "error_invalid_2fa" });
  }
}
EOF

# 15. ЗАКРЫТАЯ СТРАНИЦА ВЛАДЕЛЬЦА: ИНТЕРАКТИВНЫЙ ГРАФ БИЗНЕС-ПРОЦЕССОВ
cat << 'EOF' > pages/admin/graph.js
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head'; 
import axios from 'axios';
import Link from 'next/link';
import { X, Plus, Trash2, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../utils/language';

export default function AdminGraphPanel() {
  const { t } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [inputToken, setInputToken] = useState('');
  const [authError, setAuthError] = useState('');
  
  const [loadingGraph, setLoadingGraph] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [graphError, setGraphError] = useState('');
  const [warnings, setWarnings] = useState([]);
  
  const [hoverNode, setHoverNode] = useState(null);
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [selectedNode, setSelectedNode] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskNotes, setNewTaskNotes] = useState('');
  
  const graphContainerRef = useRef(null);
  const forceGraphInstance = useRef(null);
  const twoFaSecret = process.env.NEXT_PUBLIC_ADMIN_2FA_SECRET;

  useEffect(() => {
    const session = localStorage.getItem('owner_session');
    if (session) setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    if (twoFaSecret && !isAuthenticated) {
      import('qrcode').then((QRCode) => {
        const otpauthUrl = `otpauth://totp/AlekseiZnamenskii:Owner?secret=${twoFaSecret}&issuer=AlekseiZnamenskii`;
        QRCode.toDataURL(otpauthUrl, (err, url) => {
          if (!err) setQrCodeUrl(url);
        });
      });
    }
  }, [twoFaSecret, isAuthenticated]);

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await axios.post('/api/admin/verify-2fa', { token: inputToken });
      if (res.data.success) {
        localStorage.setItem('owner_session', res.data.sessionToken);
        setIsAuthenticated(true);
      }
    } catch (err) {
      setAuthError(t(err.response?.data?.error || 'error_2fa_verification'));
    }
  };

  const fetchGraph = async () => {
    setLoadingGraph(true); setGraphError(''); setWarnings([]);
    try {
      const res = await axios.post('/api/booking', { action: 'get_tasks_graph' });
      if (res.data.success) {
        renderGraph(res.data.nodes, res.data.edges);
        if (res.data.warnings && res.data.warnings.length > 0) setWarnings(res.data.warnings);
      } else {
        setGraphError(t(res.data.error || 'error_graph_load'));
      }
    } catch (e) { setGraphError(t(e.response?.data?.error || e.message || 'error_network')); }
    setLoadingGraph(false);
  };

  useEffect(() => {
    if (isAuthenticated) fetchGraph();
  }, [isAuthenticated]);

  useEffect(() => {
    return () => { if (forceGraphInstance.current) forceGraphInstance.current._destructor(); };
  }, []);

  const renderGraph = (nodes, links) => {
    import('force-graph').then((ForceGraph) => {
      if (!graphContainerRef.current) return;
      graphContainerRef.current.innerHTML = '';
      const transformedLinks = links.map(l => ({ source: l.from, target: l.to, type: l.type }));
      
      const handleNodeHover = (node) => {
          highlightNodes.clear(); highlightLinks.clear();
          if (node) {
              highlightNodes.add(node);
              forceGraphInstance.current.graphData().links.forEach(link => {
                  if (link.source.id === node.id || link.target.id === node.id) {
                      highlightLinks.add(link); highlightNodes.add(link.source); highlightNodes.add(link.target);
                  }
              });
          }
          setHoverNode(node); setHighlightNodes(new Set(highlightNodes)); setHighlightLinks(new Set(highlightLinks));
      };
      
      forceGraphInstance.current = ForceGraph.default()(graphContainerRef.current)
        .graphData({ nodes, links: transformedLinks })
        .nodeId('id')
        .nodeVal(node => node.group === 'hub' ? 12 : node.group === 'list' ? 8 : node.group === 'cluster' ? 5 : 3)
        .nodeColor(node => {
            if (hoverNode && !highlightNodes.has(node)) return 'rgba(100, 116, 139, 0.3)';
            return node.color;
        })
        .nodeLabel(node => {
            const details = []; details.push(`[${node.group.toUpperCase()}] ${node.label}`);
            if (node.status) details.push(`${t('statusLabel')}: ${node.status === 'completed' ? t('statusCompleted') : t('statusInProgress')}`);
            if (node.details) details.push(`\n---\n${node.details}`);
            if (node.note) details.push(`${t('noteLabel')}: ${node.note}`);
            return details.join('\n');
        })
        .linkLabel(link => link.type)
        .linkDirectionalParticles(2)
        .linkDirectionalParticleSpeed(0.006)
        .linkWidth(link => highlightLinks.has(link) ? 2 : 1)
        .linkColor(link => highlightLinks.has(link) ? '#facc15' : 'rgba(71, 85, 105, 0.2)')
        .backgroundColor('#0f172a')
        .onNodeHover(handleNodeHover)
        .onNodeClick(node => { setSelectedNode(node); setIsPanelOpen(true); setNewTaskTitle(''); setNewTaskNotes(''); })
        .width(graphContainerRef.current.clientWidth)
        .height(window.innerHeight - 250);
    });
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!selectedNode || selectedNode.group !== 'list') return;
    setIsActionLoading(true);
    try {
      await axios.post('/api/booking', { action: 'create_task', listId: selectedNode.id, title: newTaskTitle, notes: newTaskNotes });
      setNewTaskTitle(''); setNewTaskNotes(''); await fetchGraph(); setIsPanelOpen(false);
    } catch (err) { alert(t('errorTaskCreate')); }
    setIsActionLoading(false);
  };

  const handleToggleTask = async (node) => {
    setIsActionLoading(true);
    try {
      const newStatus = node.status === 'completed' ? 'needsAction' : 'completed';
      await axios.post('/api/booking', { action: 'update_task_status', listId: node.listId, taskId: node.id, status: newStatus });
      await fetchGraph(); if (selectedNode.id === node.id) setIsPanelOpen(false);
    } catch (err) { alert(t('errorTaskUpdate')); }
    setIsActionLoading(false);
  };

  const handleDeleteTask = async (node) => {
    if (!confirm(t('confirmDeleteTask'))) return;
    setIsActionLoading(true);
    try {
      await axios.post('/api/booking', { action: 'delete_task', listId: node.listId, taskId: node.id });
      await fetchGraph(); if (selectedNode.id === node.id) setIsPanelOpen(false);
    } catch (err) { alert(t('errorTaskDelete')); }
    setIsActionLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center font-sans p-6 text-white">
        <Head><title>🔒 Защищенный доступ | Владелец</title></Head>
        <div className="max-w-md w-full bg-slate-900 border border-white/10 rounded-[2rem] p-8 text-center shadow-2xl">
          <Link href="/" className="text-blue-400 text-sm mb-4 block hover:underline">← Назад на сайт</Link>
          <h1 className="text-2xl font-bold tracking-wide mb-2">{t('adminAuthTitle')}</h1>
          <p className="text-xs text-slate-400 mb-6">{t('adminAuthSubtitle')}</p>
          
          {!twoFaSecret ? (
             <div className="bg-red-900/50 text-red-300 p-4 rounded-xl text-xs mb-4 border border-red-500/30">{t('error_2fa_secret_not_found')}</div>
          ) : (
            qrCodeUrl && (
              <div className="bg-white p-4 rounded-xl inline-block mb-4 shadow-inner">
                <img src={qrCodeUrl} alt="2FA QR Code" className="w-40 h-40" />
                <p className="text-[10px] text-slate-800 font-mono mt-1 select-all">Secret: {twoFaSecret}</p>
              </div>
            )
          )}
          
          <form onSubmit={handleVerify2FA} className="space-y-4">
            <div>
              <input type="text" maxLength={6} value={inputToken} onChange={(e) => setInputToken(e.target.value)} placeholder="000000" className="w-full bg-slate-950 text-center text-xl tracking-widest font-mono p-3 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500 transition-all text-white" required disabled={!twoFaSecret} />
            </div>
            {authError && <p className="text-red-500 text-xs font-semibold">{authError}</p>}
            <button type="submit" disabled={!twoFaSecret} className="w-full bg-blue-600 hover:bg-blue-500 p-3 rounded-xl text-xs font-bold tracking-wider transition-all shadow-lg disabled:opacity-50">{t('verifyBtn')}</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-300 font-sans p-8">
      <Head><title>📊 Управление бизнес-процессами</title></Head>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-wrap justify-between items-center bg-slate-900 border border-white/10 p-6 rounded-2xl shadow-xl gap-4">
          <div><h1 className="text-2xl font-bold text-white">{t('graphTitle')}</h1></div>
          <div className="flex items-center gap-4">
            <button onClick={fetchGraph} disabled={loadingGraph} className="bg-slate-800 hover:bg-slate-700 border border-white/10 text-white p-2.5 rounded-xl transition-all disabled:opacity-50 disabled:animate-spin"><RefreshCw size={16}/></button>
            <Link href="/" className="bg-slate-800 hover:bg-slate-700 border border-white/10 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all">{t('backToCrmBtn')}</Link>
            <button onClick={() => { localStorage.removeItem('owner_session'); setIsAuthenticated(false); }} className="bg-red-950/40 hover:bg-red-900 border border-red-500/30 text-red-400 px-4 py-2 rounded-xl text-xs font-bold transition-all">{t('logout')}</button>
          </div>
        </div> 

        <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden relative shadow-xl">
          <div className="p-4 border-b border-white/5 flex flex-wrap gap-x-4 gap-y-2 text-xs font-mono">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-blue-500 rounded-full"></span>{t('legendLists')}</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-amber-500 rounded-full"></span>{t('legendActive')}</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-emerald-500 rounded-full"></span>{t('legendCompleted')}</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-purple-500 rounded-full"></span>{t('legendTags')}</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-red-500 rounded-full"></span>{t('legendRules')}</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-green-500 rounded-full"></span>{t('legendGCal')}</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-yellow-500 rounded-full"></span>{t('legendICal')}</span>
          </div>
          
          {loadingGraph && (<div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50"><span className="text-blue-400 animate-pulse">{t('syncingWithGoogle')}</span></div>)}
          
          <div ref={graphContainerRef} className="w-full bg-slate-950 min-h-[calc(100vh-250px)]"></div>
          
          {isPanelOpen && selectedNode && (
             <div className="absolute top-20 right-6 w-80 bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl p-6 z-[100] text-sm text-slate-300">
                <button onClick={() => setIsPanelOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={16}/></button>
                <h3 className="font-bold text-white mb-2 text-base pr-4">{selectedNode.label}</h3>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-4 border-b border-slate-800 pb-2">{t('nodeType')}: {selectedNode.group}</span>
                
                {selectedNode.group === 'task' && (
                   <div className="flex flex-col gap-3 mt-4">
                      <button disabled={isActionLoading} onClick={() => handleToggleTask(selectedNode)} className="bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all disabled:opacity-50">
                         {selectedNode.status === 'completed' ? <Clock size={16}/> : <CheckCircle size={16}/>}
                         {selectedNode.status === 'completed' ? t('taskSetPending') : t('taskSetCompleted')}
                      </button>
                      <button disabled={isActionLoading} onClick={() => handleDeleteTask(selectedNode)} className="bg-red-900/40 hover:bg-red-800 text-red-400 border border-red-500/20 py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50">
                         <Trash2 size={16}/> {t('deletePermanentlyBtn')}
                      </button>
                   </div>
                )}
                
                {selectedNode.group === 'list' && (
                   <form onSubmit={handleCreateTask} className="mt-4 flex flex-col gap-3">
                      <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-1">{t('addNewTask')}</h4>
                      <input value={newTaskTitle} onChange={e=>setNewTaskTitle(e.target.value)} placeholder={t('shortTitlePlaceholder')} required className="bg-slate-950 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-blue-500 transition-all"/>
                      <textarea value={newTaskNotes} onChange={e=>setNewTaskNotes(e.target.value)} placeholder={t('taskNotesPlaceholder')} className="bg-slate-950 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-blue-500 resize-none h-24 transition-all"/>
                      <button type="submit" disabled={isActionLoading} className="bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-all disabled:opacity-50"><Plus size={16}/> {t('createNodeBtn')}</button>
                   </form>
                )}
                
                {(selectedNode.group === 'calendar' || selectedNode.group === 'gcal_event' || selectedNode.group === 'ical_event') && (
                   <div className="mt-4 bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-2 max-h-60 overflow-y-auto">
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest block">{t('detailsLabel')}:</span>
                      <p className="text-white font-bold break-words">{selectedNode.details}</p>
                      {selectedNode.note && (
                        <>
                          <span className="text-[10px] text-slate-500 uppercase tracking-widest block mt-2">{t('noteLabel')}:</span>
                          <p className="text-slate-300 italic text-xs break-words">{selectedNode.note}</p>
                        </>
                      )}
                   </div>
                )}
             </div>
          )}
        </div>
        
        {(warnings.length > 0 || graphError) && (
          <div className="mt-6 p-4 rounded-2xl border bg-slate-900/50 border-white/10">
            {graphError && (
              <div className="p-4 bg-red-900/50 border border-red-500/30 rounded-xl text-red-300 text-sm">
                <h4 className="font-bold mb-2">{t('criticalErrorTitle')}:</h4>
                <p>{graphError}</p>
              </div>
            )}
            {warnings.length > 0 && (
              <div className={`p-4 bg-yellow-900/50 border border-yellow-500/30 rounded-xl text-yellow-300 text-sm ${graphError ? 'mt-4' : ''}`}>
                <h4 className="font-bold mb-2">{t('configWarningsTitle')}:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {warnings.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
EOF

# 16. СКРИПТ ИНИЦИАЛИЗАЦИИ БАЗЫ ДАННЫХ (Формирование 11 листов и безопасных формул - Задача 5.1)
cat << 'EOF' > scripts/init-google-sheets.js
require('dotenv').config({ path: '.env.local' });
const { google } = require('googleapis');

const GOOGLE_CONFIG = {
  parentFolderId: "11xBSWA02NypliPFbziRSMfC9aAPclYF_", 
  spreadsheetName: "VillaTuramanWebSitePlatform_DB", 
  sheetName: "Вилла", 
  homePageSheetName: "HomePage",
  accountSheetName: "Accounts", 
  masterSheetName: "MasterAccount", 
  calendarSettingsSheetName: "CalendarSettings",
  productsSheetName: "ExtraServices", 
  coursesSheetName: "VideoGuides", 
  studentsSheetName: "GuestsAccess", 
  ordersSheetName: "ServiceOrders",
  gallerySheetName: "Gallery",
  aboutSheetName: "About", 
  legalSheetName: "Legal", 
  templatesSheetName: "Templates",
  variablesSheetName: "Variables",
  
  homeHeaders: ["Ключ (ID)", "RU", "EN", "TR", "Медиа/Картинка"],
  headers: [ "Дата заявки", "Имя клиента", "Контакт (Tel/TG)", "Старт", "Завершение", "Ночей", "Взрослых", "Детей", "Всего гостей", "Итоговая стоимость", "Статус оплаты" ],
  accountHeaders: ["Дата регистрации", "Имя", "Контакт (Логин)", "Пароль", "Блок: Сайт", "Блок: Аккаунт", "Блок: Чат"],
  masterHeaders: ["ФИО", "Телефон", "Telegram", "WhatsApp", "Google Email", "Логин", "Пароль", "Роль", "Прав: Финансы", "Прав: Периоды", "Прав: Блок. дат", "Прав: Окно брони", "Прав: Доступ к чатам"],
  calendarSettingsHeaders: ["Дата старта", "Дата завершения", "Тип (Блокировка/Цена/Мин. дней/Заметка/Тип записи/Настройки)", "Значение", "Заметка", "Автор изменения", "Время фиксации"],
  chatHeaders: ["Дата и Время", "Отправитель", "Оригинал", "RU", "EN", "TR", "Ссылка на вложение"],
  productsHeaders: ["ID", "Название услуги (RU)", "Описание (RU)", "Название услуги (EN)", "Описание (EN)", "Название услуги (TR)", "Описание (TR)", "Цена (EUR)", "Цена (RUB)", "Цена (TRY)", "Изображения (через запятую)", "Наличие (Да/Нет)", "Тип (Услуга/Пакет)", "Видео презентации (через запятую)", "Подробное описание (RU)", "Подробное описание (EN)", "Подробное описание (TR)"],
  coursesHeaders: ["ID", "Название путеводителя (RU)", "Описание (RU)", "Название путеводителя (EN)", "Описание (EN)", "Название путеводителя (TR)", "Описание (TR)", "Изображения (через запятую)", "Категория", "Ссылка на видео", "Цена (EUR)", "Цена (RUB)", "Цена (TRY)", "Видео презентации (через запятую)", "Подробное описание (RU)", "Подробное описание (EN)", "Подробное описание (TR)"],
  studentsHeaders: ["Дата", "Гость (Контакт)", "Гид ID", "Категория", "Статус оплаты", "Доступ (Да/Нет)", "Прогресс"],
  ordersHeaders: ["Дата заказа", "Контакт", "Тип (Гид/Услуга/Аренда)", "Сумма", "Статус оплаты", "Детали"],
  galleryHeaders: ["ID", "Группа (RU)", "Описание группы (RU)", "Группа (EN)", "Описание группы (EN)", "Группа (TR)", "Описание группы (TR)", "Тип (Фото/Видео/Карусель)", "Медиа (ссылки/iframes через запятую)", "Подпись (RU)", "Подпись (EN)", "Подпись (TR)"],
  aboutHeaders: ["ID Раздела", "Название (RU)", "Название (EN)", "Название (TR)", "Текст (RU)", "Текст (EN)", "Текст (TR)"],
  legalHeaders: ["ID Раздела", "Название (RU)", "Название (EN)", "Название (TR)", "Текст (RU)", "Текст (EN)", "Текст (TR)"],
  templatesHeaders: ["ID Раздела", "Название (RU)", "Название (EN)", "Название (TR)", "Текст (RU)", "Текст (EN)", "Текст (TR)"],
  variablesHeaders: ["Плейсхолдер", "Системный ключ", "Описание переменной", "Значение по умолчанию"]
};

const initializeSpreadsheet = async () => {
  console.log('Начинаем инициализацию Google Sheets...');
  if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || process.env.GOOGLE_SPREADSHEET_ID === "your_google_sheet_id") {
    console.warn('⚠️ ОШИБКА: Отсутствуют ключи Google API. Инициализация БД пропущена.');
    return process.exit(0);
  }
  
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: { client_email: process.env.GOOGLE_CLIENT_EMAIL.trim(), private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n').trim() },
      scopes: ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/spreadsheets']
    });
    const sheets = google.sheets({ version: 'v4', auth });
    const drive = google.drive({ version: 'v3', auth });
    let spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    
    const ss = await sheets.spreadsheets.get({ spreadsheetId });
    const existingTitles = ss.data.sheets.map(s => s.properties.title);
    
    const allSheetConfigs = [
        { title: GOOGLE_CONFIG.homePageSheetName, headers: GOOGLE_CONFIG.homeHeaders },
        { title: GOOGLE_CONFIG.masterSheetName, headers: GOOGLE_CONFIG.masterHeaders },
        { title: GOOGLE_CONFIG.calendarSettingsSheetName, headers: GOOGLE_CONFIG.calendarSettingsHeaders },
        { title: GOOGLE_CONFIG.sheetName, headers: GOOGLE_CONFIG.headers },
        { title: GOOGLE_CONFIG.accountSheetName, headers: GOOGLE_CONFIG.accountHeaders },
        { title: GOOGLE_CONFIG.productsSheetName, headers: GOOGLE_CONFIG.productsHeaders },
        { title: GOOGLE_CONFIG.coursesSheetName, headers: GOOGLE_CONFIG.coursesHeaders },
        { title: GOOGLE_CONFIG.gallerySheetName, headers: GOOGLE_CONFIG.galleryHeaders },
        { title: GOOGLE_CONFIG.aboutSheetName, headers: GOOGLE_CONFIG.aboutHeaders },
        { title: GOOGLE_CONFIG.legalSheetName, headers: GOOGLE_CONFIG.legalHeaders },
        { title: GOOGLE_CONFIG.templatesSheetName, headers: GOOGLE_CONFIG.templatesHeaders },
        { title: GOOGLE_CONFIG.variablesSheetName, headers: GOOGLE_CONFIG.variablesHeaders }
    ];
    
    const sheetsToCreate = allSheetConfigs.filter(config => !existingTitles.includes(config.title));
    if (sheetsToCreate.length > 0) {
        const addRequests = sheetsToCreate.map(sheetDef => ({ addSheet: { properties: { title: sheetDef.title } } }));
        await sheets.spreadsheets.batchUpdate({ spreadsheetId, requestBody: { requests: addRequests } });
    }
    
    const updatedSs = await sheets.spreadsheets.get({ spreadsheetId });
    const formatRequests = [];
    const dataAppendRequests = [];
    const safeFormulasToInject = [];
    
    for (const config of allSheetConfigs) {
        const sheet = updatedSs.data.sheets.find(s => s.properties.title === config.title);
        if (sheet) {
            const sheetId = sheet.properties.sheetId;
            const db = await sheets.spreadsheets.values.get({ spreadsheetId, range: `'${config.title}'!A:A` });
            if (!db.data.values || db.data.values.length === 0) {
                // Создание заголовков без формул (VSTACK удален)
                formatRequests.push({ updateCells: { range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: config.headers.length }, rows: [{ values: config.headers.map((h, i) => {
                    return { userEnteredValue: { stringValue: h }, userEnteredFormat: { backgroundColor: { red: 0.15, green: 0.20, blue: 0.28 }, textFormat: { bold: true, fontSize: 11, foregroundColor: { red: 1, green: 1, blue: 1 } }, horizontalAlignment: 'CENTER', verticalAlignment: 'MIDDLE', wrapStrategy: 'WRAP' } };
                }) }], fields: 'userEnteredValue,userEnteredFormat' } });
                formatRequests.push({ updateSheetProperties: { properties: { sheetId, gridProperties: { frozenRowCount: 1 } }, fields: 'gridProperties.frozenRowCount' } });
                
                // Подготовка инъекции чистых MAP формул со второй строки (Устранение зацикливания - Задача 5.1)
                if (config.title === GOOGLE_CONFIG.productsSheetName || config.title === GOOGLE_CONFIG.coursesSheetName) {
                    safeFormulasToInject.push({ range: `'${config.title}'!D2`, values: [['=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "ru"; "en"))))']] });
                    safeFormulasToInject.push({ range: `'${config.title}'!F2`, values: [['=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "ru"; "tr"))))']] });
                }
                if (config.title === GOOGLE_CONFIG.homePageSheetName || config.title === GOOGLE_CONFIG.aboutSheetName || config.title === GOOGLE_CONFIG.legalSheetName) {
                    safeFormulasToInject.push({ range: `'${config.title}'!C2`, values: [['=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "ru"; "en"))))']] });
                    safeFormulasToInject.push({ range: `'${config.title}'!D2`, values: [['=MAP(B2:B; LAMBDA(val; IF(val=""; ""; GOOGLETRANSLATE(val; "ru"; "tr"))))']] });
                }
                
                if (config.title === GOOGLE_CONFIG.masterSheetName) {
                    dataAppendRequests.push({ range: `${config.title}!A2:M2`, values: [["Aleksei Z", "", "", "", "admin@villaturaman.com", "admin", "admin123", "Главный", "Да", "Да", "Да", "Да", "Да"]] });
                }
            }
        }
    }
    
    if (formatRequests.length > 0) await sheets.spreadsheets.batchUpdate({ spreadsheetId, requestBody: { requests: formatRequests } });
    for (const req of dataAppendRequests) await sheets.spreadsheets.values.update({ spreadsheetId, range: req.range, valueInputOption: 'USER_ENTERED', requestBody: { values: req.values } });
    for (const req of safeFormulasToInject) await sheets.spreadsheets.values.update({ spreadsheetId, range: req.range, valueInputOption: 'USER_ENTERED', requestBody: { values: req.values } });
    
    console.log('✅ Инициализация Google Sheets успешно завершена.');
  } catch (error) { console.error('❌ Ошибка инициализации:', error.message); }
};
initializeSpreadsheet();
EOF

# 17. Скрипт синхронизации контента (SSG Pre-build - Задача 5.2 Выкачивает весь контент сайта)
cat << 'EOF' > utils/content.json
{ "home": {}, "about": {}, "legal": {}, "templates": {}, "products": [], "courses": [], "gallery": [] }
EOF

cat << 'EOF' > scripts/sync-content.js
require('dotenv').config({ path: '.env.local' });
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const GOOGLE_SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
const contentFilePath = path.join(__dirname, '../utils/content.json');
const emptyContent = JSON.stringify({ home: {}, about: {}, legal: {}, templates: {}, products: [], courses: [], gallery: [] }, null, 2);

async function syncContent() {
  if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !GOOGLE_SPREADSHEET_ID || GOOGLE_SPREADSHEET_ID === "your_google_sheet_id") {
    console.warn('⚠️ Переменные Google Sheets не заданы корректно. Используется пустой content.json.');
    fs.writeFileSync(contentFilePath, emptyContent);
    return;
  }
  
  try {
    const auth = new google.auth.GoogleAuth({ credentials: { client_email: process.env.GOOGLE_CLIENT_EMAIL.trim(), private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n').trim() }, scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'] });
    const sheets = google.sheets({ version: 'v4', auth });
    
    const content = { home: {}, about: {}, legal: {}, templates: {}, products: [], courses: [], gallery: [] };
    
    const safeGet = async (range) => {
        try { return await sheets.spreadsheets.values.get({ spreadsheetId: GOOGLE_SPREADSHEET_ID, range }); }
        catch (e) { console.warn(`- Не удалось получить данные для диапазона ${range}.`); return { data: { values: [] } }; }
    };

    console.log('Скачиваем тексты (HomePage, About, Legal, Templates)...');
    
    const homeData = await safeGet('HomePage!A:E');
    (homeData.data.values || []).slice(1).forEach(r => {
        if(r[0]) {
            content.home[r[0]] = { ru: r[1] || '', en: r[2] || '', tr: r[3] || '', media: r[4] || '' };
        }
    });

    const aboutData = await safeGet('About!A:G');
    const legalData = await safeGet('Legal!A:G');
    const templatesData = await safeGet('Templates!A:G');

    (aboutData.data.values || []).slice(1).forEach(r => { if(r[0]) content.about[r[0]] = { title: {ru: r[1], en: r[2], tr: r[3]}, text: {ru: r[4], en: r[5], tr: r[6]} }; });
    (legalData.data.values || []).slice(1).forEach(r => { if(r[0]) content.legal[r[0]] = { title: {ru: r[1], en: r[2], tr: r[3]}, text: {ru: r[4], en: r[5], tr: r[6]} }; });
    (templatesData.data.values || []).slice(1).forEach(r => {
        if(r[0]) {
          if (!content.templates[r[0]]) content.templates[r[0]] = [];
          content.templates[r[0]].push({ name: {ru: r[1], en: r[2], tr: r[3]}, text: {ru: r[4], en: r[5], tr: r[6]} });
        }
    });

    console.log('Скачиваем E-Commerce (Продукты и Гиды) и Галерею...');
    const productsSheet = await safeGet('ExtraServices!A:Q');
    content.products = (productsSheet.data.values || []).slice(1).map(r => ({
        id: r[0], name: { ru: r[1], en: r[3], tr: r[5] }, desc: { ru: r[2], en: r[4], tr: r[6] },
        price: { eur: r[7], rub: r[8], try: r[9] }, images: (r[10] || '').split(',').map(s => s.trim()).filter(Boolean),
        videos: (r[13] || '').split(',').map(s => s.trim()).filter(Boolean), detailedDesc: { ru: r[14] || '', en: r[15] || '', tr: r[16] || '' },
        type: { ru: r[12] === 'Пакет' ? 'Пакет услуг' : 'Услуга', en: r[12] === 'Пакет' ? 'Service Package' : 'Service', tr: r[12] === 'Пакет' ? 'Hizmet Paketi' : 'Hizmet' }
    })).filter(p => p.id && p.name.ru);

    const coursesSheet = await safeGet('VideoGuides!A:Q');
    content.courses = (coursesSheet.data.values || []).slice(1).map(r => ({
        id: r[0], name: { ru: r[1], en: r[3], tr: r[5] }, desc: { ru: r[2], en: r[4], tr: r[6] },
        images: (r[7] || '').split(',').map(s => s.trim()).filter(Boolean), module: r[8] || 'Основной', privateLink: r[9],
        price: { eur: r[10], rub: r[11], try: r[12] }, videos: (r[13] || '').split(',').map(s => s.trim()).filter(Boolean),
        detailedDesc: { ru: r[14] || '', en: r[15] || '', tr: r[16] || '' }, level: 'Для гостей'
    })).filter(c => c.id && c.name.ru);

    const gallerySheet = await safeGet('Gallery!A:L');
    content.gallery = (gallerySheet.data.values || []).slice(1).map(r => ({
        id: r[0], group: { ru: r[1], en: r[3], tr: r[5] }, groupDesc: { ru: r[2], en: r[4], tr: r[6] },
        type: r[7] === 'Видео' ? 'video' : 'image', media: (r[8] || '').split(',').map(s => s.trim()).filter(Boolean), caption: { ru: r[9], en: r[10], tr: r[11] }
    })).filter(g => g.id && g.media.length > 0);

    fs.writeFileSync(contentFilePath, JSON.stringify(content, null, 2));
    console.log('✅ Контент успешно выкачан и сохранен в content.json.');
  } catch (err) { fs.writeFileSync(contentFilePath, emptyContent); }
}

syncContent();
EOF

# Удаляем postinstall (чтобы избежать ошибок на Vercel) и ставим правильный порядок сборки
npm pkg delete scripts.postinstall
npm pkg set scripts.build="node scripts/init-google-sheets.js && node scripts/sync-content.js && next build"

# 18. ГЕНЕРАЦИЯ СКРИПТА GOOGLE APPS SCRIPT ДЛЯ СИНХРОНИЗАЦИИ (Webhooks)
cat << 'EOF' > google-apps-script/Code.js
// Этот скрипт вставляется в редактор Apps Script вашей Google Таблицы.
function sendUpdateSignal(e) {
  if (!e) return;
  var sheetName = e.source.getActiveSheet().getName();
  var staticContentSheets = ["HomePage", "About", "Legal", "Templates"];
  var dynamicDataSheets = ["ExtraServices", "VideoGuides", "CalendarSettings", "Gallery"];
  
  var scriptProperties = PropertiesService.getScriptProperties();
  var VERCEL_DEPLOY_HOOK_URL = scriptProperties.getProperty('VERCEL_DEPLOY_HOOK_URL');
  var REVALIDATE_API_URL = scriptProperties.getProperty('REVALIDATE_API_URL');
  var REVALIDATE_SECRET_TOKEN = scriptProperties.getProperty('REVALIDATE_SECRET_TOKEN');
  
  try {
    if (staticContentSheets.indexOf(sheetName) !== -1) {
      if (VERCEL_DEPLOY_HOOK_URL) UrlFetchApp.fetch(VERCEL_DEPLOY_HOOK_URL, { "method": "post", "muteHttpExceptions": true });
    } else if (dynamicDataSheets.indexOf(sheetName) !== -1) {
      if (REVALIDATE_API_URL && REVALIDATE_SECRET_TOKEN) {
        UrlFetchApp.fetch(REVALIDATE_API_URL + '?secret=' + REVALIDATE_SECRET_TOKEN, { "method": "post", "muteHttpExceptions": true });
      }
    }
  } catch (error) { Logger.log("Сбой отправки сигнала: " + error.toString()); }
}
EOF

# 19. ПОЛНАЯ ГЛАВНАЯ СТРАНИЦА (С учетом всех задач)
cat << 'EOF' > pages/index.js
import Head from 'next/head'; 
import { useState, useEffect, useRef } from 'react'; 
import DatePicker, { registerLocale } from 'react-datepicker'; 
import { addMonths, addDays, differenceInDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, format, parse } from 'date-fns'; 
import { ru, enUS, tr } from 'date-fns/locale'; 
import { MessageCircle, Users, Check, X, ChevronRight, ChevronLeft, Clock, Calendar as CalendarIcon, User, Lock, Send, Paperclip, Settings, FileText, Layers, ShoppingBag, PlayCircle, Info, ChevronDown } from 'lucide-react'; 
import { useLanguage } from '../utils/language';
import SEO from '../components/SEO';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';

registerLocale('ru', ru); registerLocale('en', enUS); registerLocale('tr', tr);

// Обработка прямых ссылок Google Drive для Карусели и Hero блока (Задача 1.2)
const parseDriveLink = (url, type = 'image') => {
  if (!url) return "";
  const strItem = String(url).trim();
  const driveMatch = strItem.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (driveMatch) {
      return type === 'image' 
        ? `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w1920` 
        : `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
  }
  return strItem;
}

const MediaCarousel = ({ media, type = 'image' }) => {
  const [idx, setIdx] = useState(0);
  if (!media || media.length === 0) return <div className="h-full bg-slate-800 flex items-center justify-center text-slate-500">Нет медиа</div>;
  const renderMediaItem = (item) => {
    if (!item) return null;
    const strItem = String(item).trim();
    if (strItem.toLowerCase().startsWith('<iframe')) return <div className="absolute inset-0 w-full h-full bg-black/40 [&>iframe]:absolute [&>iframe]:inset-0 [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:object-contain" dangerouslySetInnerHTML={{ __html: strItem }} />;
    const finalUrl = parseDriveLink(strItem, type);
    if (finalUrl.includes('/preview')) return <iframe src={finalUrl} className="absolute inset-0 w-full h-full object-contain bg-black/40 border-0" allow="autoplay; encrypted-media" allowFullScreen></iframe>;
    if (type === 'image') return <img src={finalUrl} className="absolute inset-0 w-full h-full object-cover bg-black/40 transition-opacity duration-300" alt="media" />;
    return <video src={finalUrl} controls controlsList="nodownload" className="absolute inset-0 w-full h-full object-contain bg-black/40" />;
  };

  return (
    <div className="relative w-full h-full group">
      {renderMediaItem(media[idx])}
      {media.length > 1 && (
        <>
          <button onClick={(e) => { e.stopPropagation(); setIdx((prev) => (prev - 1 + media.length) % media.length); }} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"><ChevronLeft size={16}/></button>
          <button onClick={(e) => { e.stopPropagation(); setIdx((prev) => (prev + 1) % media.length); }} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"><ChevronRight size={16}/></button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">{media.map((_, i) => <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === idx ? 'bg-white' : 'bg-white/50'}`}/>)}</div>
        </>
      )}
    </div>
  );
};

const SITE_CONFIG = {
  vesselName: "Villa Turaman", telegramContact: "AlekseiZnamenskii", whatsappContact: "79000000000",
  checkInTime: "15:00", checkOutTime: "11:00",
  basePrice: 15000, currency: 'RUB', minNights: 3, maxNights: 30, maxTotalGuests: 10, bookingWindowMonths: 18, advanceNoticeDays: 2, bookingMode: "instant"
};
const CURRENCY_SYMBOLS = { 'RUB': '₽', 'TRY': '₺', 'USD': '$', 'EUR': '€', 'GBP': '£' };

const parseDateRU = (str) => {
  if (!str || typeof str !== 'string') return new Date(NaN);
  const parts = str.split('.');
  if (parts.length === 3) {
    const d = parseInt(parts[0], 10); const m = parseInt(parts[1], 10) - 1; const y = parseInt(parts[2], 10);
    if (!isNaN(d) && !isNaN(m) && !isNaN(y)) return new Date(y, m, d);
  }
  return new Date(NaN);
};

export async function getStaticProps() {
  const contentPath = path.join(process.cwd(), 'utils', 'content.json');
  let contentData = { home: {}, about: {}, legal: {}, templates: {}, products: [], courses: [], gallery: [] };
  try { contentData = JSON.parse(fs.readFileSync(contentPath, 'utf8')); } catch (err) {}
  return { 
      props: { 
          publicData: { products: contentData.products || [], courses: contentData.courses || [], gallery: contentData.gallery || [] }, 
          contentData 
      }, 
      revalidate: 60 
  };
}

export default function Home({ publicData, contentData }) {
  const { t, changeLanguage, lang } = useLanguage();
  const [presentationModal, setPresentationModal] = useState(null); 
  
  const homeData = {
    title: contentData.home?.heroTitle?.[lang] || contentData.home?.heroTitle?.ru || SITE_CONFIG.vesselName,
    subtitle: contentData.home?.heroSubtitle?.[lang] || contentData.home?.heroSubtitle?.ru || t('heroSubtitle'),
    aboutTitle: contentData.home?.aboutTitle?.[lang] || contentData.home?.aboutTitle?.ru || t('aboutTitle'),
    aboutText: contentData.home?.aboutText?.[lang] || contentData.home?.aboutText?.ru || t('aboutText'),
    heroImage: parseDriveLink(contentData.home?.heroImage?.media || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600", 'image')
  };

  const fullDescription = { sections: Object.values(contentData.about || {}).map(item => ({ title: item.title[lang] || item.title.ru, text: item.text[lang] || item.text.ru })) };
  const roomGalleries = [
    { id: 'pool', label: t('tabPool'), images: ['https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=1200', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200'] },
    { id: 'rooms', label: t('tabRooms'), images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200'] },
    { id: 'kitchen', label: t('tabKitchen'), images: ['https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200'] }
  ];
  
  const [status, setStatus] = useState('idle'); const [descModal, setDescModal] = useState(false); const [galleryModal, setGalleryModal] = useState(false); 
  const [activeCategory, setActiveCategory] = useState('education'); const [lightboxIndex, setLightboxIndex] = useState(null); 
  const [adults, setAdults] = useState(2); const [children, setChildren] = useState(0); 
  
  const [apiOccupiedDates, setApiOccupiedDates] = useState([]); const [apiEvents, setApiEvents] = useState([]);
  const [manualBlockedDates, setManualBlockedDates] = useState([]);
  const occupiedDates = [...apiOccupiedDates, ...manualBlockedDates];
  
  const [dateRange, setDateRange] = useState([null, null]); const [startDate, endDate] = dateRange;
  const [isGuestCalendarOpen, setIsGuestCalendarOpen] = useState(false);
  const [guestCurrentMonth, setGuestCurrentMonth] = useState(new Date());

  const [dynamicRules, setDynamicRules] = useState({
    basePrice: SITE_CONFIG.basePrice, currency: SITE_CONFIG.currency, minNights: SITE_CONFIG.minNights, maxNights: SITE_CONFIG.maxNights, bookingWindowMonths: SITE_CONFIG.bookingWindowMonths, advanceNoticeDays: SITE_CONFIG.advanceNoticeDays, bookingMode: SITE_CONFIG.bookingMode, checkInTime: SITE_CONFIG.checkInTime, checkOutTime: SITE_CONFIG.checkOutTime
  });
  
  const [dateRules, setDateRules] = useState([]); const [variablesDict, setVariablesDict] = useState({});
  const [authMode, setAuthMode] = useState('none'); const [currentUser, setCurrentUser] = useState(null); 
  const [siteBlocked, setSiteBlocked] = useState(false); const [pendingHostUser, setPendingHostUser] = useState(null);
  const [twoFaInput, setTwoFaInput] = useState(''); const [twoFaError, setTwoFaError] = useState(''); const [qrCodeUrl, setQrCodeUrl] = useState('');
  const twoFaSecret = process.env.NEXT_PUBLIC_ADMIN_2FA_SECRET;
  
  const [chatMessages, setChatMessages] = useState([]); const [guestActiveRequests, setGuestActiveRequests] = useState([]);
  const [timeLefter, setTimeLefter] = useState({}); const [chatInput, setChatInput] = useState(''); const [chatFile, setChatFile] = useState(null); const [chatLoading, setChatLoading] = useState(false); 
  
  const [hostTab, setHostTab] = useState('chats'); const [masterAllChats, setMasterAllChats] = useState([]); 
  const [selectedClientSheets, setSelectedClientSheets] = useState([]); const [lmsModules, setLmsModules] = useState([]); 
  const [masterChatInput, setMasterChatInput] = useState(''); const [offerModal, setOfferModal] = useState(false);
  const [offerData, setOfferData] = useState({ checkIn: '', checkOut: '', price: '', rowIndex: null, contact: '' });
  const [expandedTemplate, setExpandedTemplate] = useState(null); // Управление раскрытием карточек шаблонов
  
  const [calSetRange, setCalSetRange] = useState([null, null]); const [editStatus, setEditStatus] = useState('Открыто'); const [editPrice, setEditPrice] = useState(''); const [editMinNights, setEditMinNights] = useState(''); const [editNote, setEditNote] = useState(''); const [editBookingMode, setEditBookingMode] = useState('');
  const [masterChatFile, setMasterChatFile] = useState(null); const [hostCurrentMonth, setHostCurrentMonth] = useState(new Date());
  
  const [agreedKVKK, setAgreedKVKK] = useState(false); const [agreedContract, setAgreedContract] = useState(false); const [agreedPrivacy, setAgreedPrivacy] = useState(false);

  const getCurrencyByLang = () => { if (lang === 'ru') return 'RUB'; if (lang === 'tr') return 'TRY'; return 'EUR'; };
  const activeCurrency = getCurrencyByLang();

  const lodgingSchema = {
    "@context": "https://schema.org", "@type": "VacationRental", "name": homeData.title, "description": homeData.aboutText, "image": homeData.heroImage,
    "address": { "@type": "PostalAddress", "addressLocality": "Dalyan", "addressRegion": "Muğla", "addressCountry": "TR" },
    "priceRange": `${dynamicRules.basePrice} ${dynamicRules.currency}`, "offers": { "@type": "Offer", "price": dynamicRules.basePrice, "priceCurrency": dynamicRules.currency, "availability": "https://schema.org/InStock" }
  };
  const productsSchema = publicData.products.map(p => ({ "@type": "Product", "name": p.name[lang] || p.name.ru, "description": p.desc[lang] || p.desc.ru, "image": p.images[0] || "", "offers": { "@type": "Offer", "price": p.price[activeCurrency.toLowerCase()] || p.price.eur, "priceCurrency": activeCurrency } }));
  const mainSchema = { "@context": "https://schema.org", "@graph": [lodgingSchema, ...productsSchema] };

  const LegalCheckboxes = () => (
    <div className="flex flex-col gap-3 mt-3 mb-3 bg-slate-700/50 p-4 rounded-xl border border-white/10 shadow-inner w-full">
      <label className="flex items-start gap-3 cursor-pointer group"><input type="checkbox" checked={agreedKVKK} onChange={(e) => setAgreedKVKK(e.target.checked)} className="mt-1 w-4 h-4 accent-blue-600 rounded cursor-pointer shrink-0" /><span className="text-[10px] md:text-xs text-slate-200 group-hover:text-white transition-colors leading-tight">{t('legalKVKK')} <Link href={`/legal/kvkk`} target="_blank" className="text-blue-400 underline hover:text-blue-300 ml-1">{t('linkKVKK')}</Link></span></label>
      <label className="flex items-start gap-3 cursor-pointer group"><input type="checkbox" checked={agreedContract} onChange={(e) => setAgreedContract(e.target.checked)} className="mt-1 w-4 h-4 accent-blue-600 rounded cursor-pointer shrink-0" /><span className="text-[10px] md:text-xs text-slate-200 group-hover:text-white transition-colors leading-tight">{t('legalContract')} <Link href={`/legal/contract`} target="_blank" className="text-blue-400 underline hover:text-blue-300 mx-1">{t('linkContract')}</Link></span></label>
      <label className="flex items-start gap-3 cursor-pointer group"><input type="checkbox" checked={agreedPrivacy} onChange={(e) => setAgreedPrivacy(e.target.checked)} className="mt-1 w-4 h-4 accent-blue-600 rounded cursor-pointer shrink-0" /><span className="text-[10px] md:text-xs text-slate-200 group-hover:text-white transition-colors leading-tight">{t('legalPrivacy')} <Link href={`/legal/privacy`} target="_blank" className="text-blue-400 underline hover:text-blue-300 ml-1">{t('linkPrivacy')}</Link></span></label>
    </div>
  );

  const currentImages = roomGalleries.find(c => c.id === activeCategory)?.images || [];
  const chatBottomRef = useRef(null);
  const activeChat = masterAllChats.find(c => selectedClientSheets.includes(c.sheetName));
  const activeRequestsList = activeChat?.activeRequests || [];

  const getNoticeText = (days) => { if (days === 0) return t('todayLabel'); if (days === 1) return `1 ${t('dayLabel')}`; return `${days} ${t('daysLabel')}`; };
  const translateStatus = (st) => {
    if (!st) return ''; if (st.includes('ЗАПРОС')) return t('statusPending') || 'ЗАПРОС'; if (st.includes('ОЖИДАЕТ ОПЛАТЫ')) return t('statusAwaitingPay') || 'ОЖИДАЕТ ОПЛАТЫ';
    if (st.includes('СПЕЦПРЕДЛОЖЕНИЕ')) return t('statusOffer') || 'СПЕЦПРЕДЛОЖЕНИЕ'; if (st.includes('ОПЛАЧЕНО')) return t('statusPaid') || 'ОПЛАЧЕНО';
    if (st.includes('ОТОЗВАНО')) return t('statusRevoked') || 'ОТОЗВАНО'; if (st.includes('ОТКЛОНЕНО')) return t('statusRejected') || 'ОТКЛОНЕНО'; return st;
  };

  const getPriceForDate = (date) => {
    for (const rule of dateRules) {
        const rS = parseDateRU(rule.start); rS.setHours(0,0,0,0); const rE = parseDateRU(rule.end); rE.setHours(0,0,0,0);
        const check = new Date(date); check.setHours(0,0,0,0);
        if (check >= rS && check <= rE) { if (rule.type === 'Цена') return rule.value; if (rule.type === 'Сброс цены') return dynamicRules.basePrice; }
    }
    return dynamicRules.basePrice;
  };

  const isManualBlocked = (date) => {
    for (const rule of dateRules) {
        const rS = parseDateRU(rule.start); rS.setHours(0,0,0,0); const rE = parseDateRU(rule.end); rE.setHours(0,0,0,0);
        const check = new Date(date); check.setHours(0,0,0,0);
        if (check >= rS && check <= rE) { if (rule.type === 'Блокировка') return true; if (rule.type === 'Сброс блокировки') return false; }
    }
    return false;
  };

  const getMinNightsForDate = (date) => {
    for (const rule of dateRules) {
        const rS = parseDateRU(rule.start); rS.setHours(0,0,0,0); const rE = parseDateRU(rule.end); rE.setHours(0,0,0,0);
        const check = new Date(date); check.setHours(0,0,0,0);
        if (check >= rS && check <= rE) { if (rule.type === 'Мин. дней') return parseInt(rule.value) || dynamicRules.minNights; if (rule.type === 'Сброс мин. дней') return dynamicRules.minNights; }
    }
    return dynamicRules.minNights;
  };

  const getTranslated = (obj, key) => { if (!obj || typeof obj !== 'object') return ''; return obj[key]?.[lang] || obj[key]?.['ru'] || ''; };
  const getProductType = (obj) => { if (!obj || typeof obj !== 'object') return ''; return obj.type?.[lang] || obj.type?.['ru'] || ''; };
  const getNoteForDate = (date) => {
    for (const rule of dateRules) {
        const rS = parseDateRU(rule.start); rS.setHours(0,0,0,0); const rE = parseDateRU(rule.end); rE.setHours(0,0,0,0);
        const check = new Date(date); check.setHours(0,0,0,0);
        if (check >= rS && check <= rE) { if (rule.type === 'Заметка') return rule.note; if (rule.type === 'Сброс заметки') return ''; }
    }
    return '';
  };

  const getBookingModeForDateRange = (sDate, eDate) => {
    if (!sDate) return dynamicRules.bookingMode || 'instant';
    let isManual = false; let cur = new Date(sDate); cur.setHours(0,0,0,0); const end = eDate ? new Date(eDate) : new Date(sDate); end.setHours(0,0,0,0);
    while (cur <= end) {
      let dailyMode = dynamicRules.bookingMode || 'instant';
      for (const rule of dateRules) {
        const rS = parseDateRU(rule.start); rS.setHours(0,0,0,0); const rE = parseDateRU(rule.end); rE.setHours(0,0,0,0);
        if (cur >= rS && cur <= rE) { if (rule.type === 'Тип бронирования' || rule.type === 'Тип записи') dailyMode = rule.value; if (rule.type === 'Сброс типа бронирования') dailyMode = dynamicRules.bookingMode || 'instant'; }
      }
      if (dailyMode === 'manual') isManual = true;
      cur.setDate(cur.getDate() + 1);
    }
    return isManual ? 'manual' : 'instant';
  };

  const getBookingModeForSingleDate = (date) => getBookingModeForDateRange(date, date);
  const currentBookingMode = getBookingModeForDateRange(startDate, endDate);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'get_settings' }) });
      const data = await res.json();
      if (data.success) {
        if (data.globalRules) { setDynamicRules({ basePrice: !isNaN(parseInt(data.globalRules.basePrice)) ? parseInt(data.globalRules.basePrice) : SITE_CONFIG.basePrice, currency: data.globalRules.currency || SITE_CONFIG.currency, minNights: !isNaN(parseInt(data.globalRules.minNights)) ? parseInt(data.globalRules.minNights) : SITE_CONFIG.minNights, maxNights: !isNaN(parseInt(data.globalRules.maxNights)) ? parseInt(data.globalRules.maxNights) : SITE_CONFIG.maxNights, bookingWindowMonths: !isNaN(parseInt(data.globalRules.bookingWindowMonths)) ? parseInt(data.globalRules.bookingWindowMonths) : SITE_CONFIG.bookingWindowMonths, advanceNoticeDays: !isNaN(parseInt(data.globalRules.advanceNoticeDays)) ? parseInt(data.globalRules.advanceNoticeDays) : SITE_CONFIG.advanceNoticeDays, bookingMode: data.globalRules.bookingMode || SITE_CONFIG.bookingMode, checkInTime: data.globalRules.checkInTime || SITE_CONFIG.checkInTime, checkOutTime: data.globalRules.checkOutTime || SITE_CONFIG.checkOutTime }); }
        if (data.dateRules) {
          setDateRules(data.dateRules); let manualBlocks = new Set();
          [...data.dateRules].reverse().forEach(rule => {
              const rs = parseDateRU(rule.start); const re = parseDateRU(rule.end);
              if (isNaN(rs) || isNaN(re)) return; 
              let cur = new Date(rs.getFullYear(), rs.getMonth(), rs.getDate()); const end = new Date(re.getFullYear(), re.getMonth(), re.getDate());
              while (cur <= end) {
                  const dateStr = `${cur.getFullYear()}-${cur.getMonth()}-${cur.getDate()}`;
                  if (rule.type === 'Блокировка') manualBlocks.add(dateStr); if (rule.type === 'Сброс блокировки') manualBlocks.delete(dateStr);
                  cur.setDate(cur.getDate() + 1);
              }
          });
          setManualBlockedDates(Array.from(manualBlocks).map(ds => { const [y, m, d] = ds.split('-'); return new Date(y, parseInt(m), parseInt(d)); }));
        }
        if (data.variablesDict) setVariablesDict(data.variablesDict);
      }
    } catch (err) {}
  };

  useEffect(() => {
    async function fetchCalendar() {
      try {
        const res = await fetch('/api/calendar');
        if (res.ok) {
           const data = await res.json();
           if (data && data.dates) { setApiOccupiedDates(data.dates.map(d => { const [y, m, day] = d.split('-'); return new Date(y, m - 1, day); })); setApiEvents(data.events || []); }
           else if (Array.isArray(data)) setApiOccupiedDates(data.map(d => { const [y, m, day] = d.split('-'); return new Date(y, m - 1, day); }));
        }
      } catch (err) {}
    }
    fetchCalendar(); fetchSettings(); 

    const savedUser = localStorage.getItem('villa_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      if (parsed && parsed.hasChat && !parsed.blockChat && !parsed.isHost) setActiveCategory('chat');
      if (parsed.isHost) {
        const session = localStorage.getItem('owner_session');
        if (!session) setPendingHostUser(parsed); else handleAuthSubmit(null, parsed.contact, parsed.password, 'login', true);
      } else { handleAuthSubmit(null, parsed.contact, parsed.password, 'login'); }
    }
  }, []);

  useEffect(() => {
    if (pendingHostUser && twoFaSecret) {
      import('qrcode').then((QRCode) => { QRCode.toDataURL(`otpauth://totp/AlekseiZnamenskii:Owner?secret=${twoFaSecret}&issuer=AlekseiZnamenskii`, (err, url) => { if (!err) setQrCodeUrl(url); }); });
    }
  }, [pendingHostUser, twoFaSecret]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimes = {}; let changed = false;
      guestActiveRequests.forEach(req => {
         if (req.expiresAt && (req.status === 'ОЖИДАЕТ ОПЛАТЫ' || req.status === 'СПЕЦПРЕДЛОЖЕНИЕ')) {
            const diff = new Date(req.expiresAt).getTime() - Date.now();
            if (diff <= 0) newTimes[req.rowIndex] = 'EXPIRED';
            else {
               const h = Math.floor(diff / (1000 * 60 * 60)); const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)); const s = Math.floor((diff % (1000 * 60)) / 1000);
               newTimes[req.rowIndex] = `${h}ч ${m}м ${s}с`;
            }
            changed = true;
         }
      });
      if (changed) setTimeLefter(newTimes);
    }, 1000);
    return () => clearInterval(interval);
  }, [guestActiveRequests]);

  useEffect(() => {
    if (calSetRange[0] && calSetRange[0] === calSetRange[1]) {
        const checkDate = calSetRange[0];
        setEditPrice(getPriceForDate(checkDate) != dynamicRules.basePrice ? getPriceForDate(checkDate) : ''); setEditMinNights(getMinNightsForDate(checkDate) != dynamicRules.minNights ? getMinNightsForDate(checkDate) : ''); setEditStatus(isManualBlocked(checkDate) ? 'Заблокировано' : 'Открыто'); setEditNote(getNoteForDate(checkDate) || ''); setEditBookingMode('');
    } else if (calSetRange[0] && !calSetRange[1]) {
        const checkDate = calSetRange[0];
        setEditPrice(getPriceForDate(checkDate) != dynamicRules.basePrice ? getPriceForDate(checkDate) : ''); setEditMinNights(getMinNightsForDate(checkDate) != dynamicRules.minNights ? getMinNightsForDate(checkDate) : ''); setEditStatus(isManualBlocked(checkDate) ? 'Заблокировано' : 'Открыто'); setEditNote(getNoteForDate(checkDate) || ''); setEditBookingMode('');
    } else { setEditPrice(''); setEditMinNights(''); setEditStatus('Открыто'); setEditNote(''); setEditBookingMode(''); }
  }, [calSetRange, dynamicRules, dateRules]);

  useEffect(() => {
    let interval;
    if (currentUser?.hasChat && !currentUser?.blockChat && !currentUser?.isHost) { fetchChatMessages(); interval = setInterval(fetchChatMessages, 60000); }
    return () => clearInterval(interval);
  }, [currentUser]);

  useEffect(() => {
    let interval;
    if (currentUser?.isHost && currentUser?.permissions?.chats) { fetchMasterChats(); interval = setInterval(fetchMasterChats, 60000); }
    return () => clearInterval(interval);
  }, [currentUser]);

  useEffect(() => { if (chatBottomRef.current) chatBottomRef.current.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages, masterAllChats, selectedClientSheets]);

  const nextPhoto = (e) => { e?.stopPropagation(); setLightboxIndex((prev) => (prev + 1) % currentImages.length); };
  const prevPhoto = (e) => { e?.stopPropagation(); setLightboxIndex((prev) => (prev - 1 + currentImages.length) % currentImages.length); };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowRight') nextPhoto(); if (e.key === 'ArrowLeft') prevPhoto(); if (e.key === 'Escape') setLightboxIndex(null);
    };
    window.addEventListener('keydown', handleKeyDown); return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex]);

  const handleAuthSubmit = async (e, contactFallback, passwordFallback, mode, skip2FA = false) => {
    if (e) e.preventDefault(); const formData = e ? new FormData(e.target) : null;
    const payload = { action: mode, name: formData ? formData.get('name') : null, contact: formData ? formData.get('contact') : contactFallback, password: formData ? formData.get('password') : passwordFallback };
    const res = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const result = await res.json();
    if (result.success) {
      const userObj = { ...result.user, password: payload.password || "123456" }; 
      if (userObj.isHost && !skip2FA && process.env.NEXT_PUBLIC_ADMIN_2FA_SECRET) {
        if (localStorage.getItem('owner_session')) { localStorage.setItem('villa_user', JSON.stringify(userObj)); setCurrentUser(userObj); setAuthMode('none'); } 
        else { setPendingHostUser(userObj); setAuthMode('none'); }
      } else { localStorage.setItem('villa_user', JSON.stringify(userObj)); setCurrentUser(userObj); setAuthMode('none'); }
    } else {
      if (result.blockType === 'site') { setSiteBlocked(true); localStorage.removeItem('villa_user'); alert(t(result.error)); } 
      else { if (e) alert(t(result.error)); if (!e) localStorage.removeItem('villa_user'); }
    }
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault(); setTwoFaError('');
    try {
      const res = await fetch('/api/admin/verify-2fa', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: twoFaInput }) });
      const result = await res.json();
      if (result.success) {
        localStorage.setItem('owner_session', result.sessionToken); localStorage.setItem('villa_user', JSON.stringify(pendingHostUser));
        setCurrentUser(pendingHostUser); setPendingHostUser(null); setTwoFaInput('');
      } else { setTwoFaError(t(result.error || 'error_2fa_verification')); }
    } catch (err) { setTwoFaError(t('error_network')); }
  };

  const handleLogout = () => { localStorage.removeItem('villa_user'); localStorage.removeItem('owner_session'); setCurrentUser(null); setPendingHostUser(null); };

  const fetchChatMessages = async () => {
    const res = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'chat', contact: currentUser.contact, sender: currentUser.name }) });
    const data = await res.json(); 
    if (data.success && data.messages) { setChatMessages(data.messages); setGuestActiveRequests(data.activeRequests || []); }
  };

  const fetchMasterChats = async () => {
    const res = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'master_get_chats' }) });
    const data = await res.json(); if (data.success && data.chats) setMasterAllChats(data.chats);
    const lmsRes = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'master_get_lms' }) });
    const lmsData = await lmsRes.json(); if (lmsData.success && lmsData.lms) setLmsModules(lmsData.lms);
  };

  const handleSendLesson = (e) => {
      const link = e.target.value; if (!link) return;
      const lesson = lmsModules.find(m => m.privateLink === link);
      if (lesson) {
          const lessonName = lesson.name && typeof lesson.name === 'object' ? (lesson.name.ru || lesson.name.en) : lesson.name;
          setMasterChatInput(`🎓 Доступ к путеводителю открыт!\nГид: ${lessonName}\nКатегория: ${lesson.module}\n\nВаша ссылка на закрытое видео:\n${lesson.privateLink}\n\nПриятного просмотра!`);
      }
      e.target.value = ""; 
  };

  const handleFileAttach = (e) => {
    const file = e.target.files[0]; if (!file) return; if (file.size > 4 * 1024 * 1024) return alert(t('fileTooLarge'));
    const reader = new FileReader(); reader.onload = () => { setChatFile({ name: file.name, type: file.type, base64: reader.result.split(',')[1] }); }; reader.readAsDataURL(file);
  };

  const handleMasterFileAttach = (e) => {
    const file = e.target.files[0]; if (!file) return; if (file.size > 4 * 1024 * 1024) return alert(t('fileTooLarge'));
    const reader = new FileReader(); reader.onload = () => { setMasterChatFile({ name: file.name, type: file.type, base64: reader.result.split(',')[1] }); }; reader.readAsDataURL(file);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault(); if (!chatInput.trim() && !chatFile) return; setChatLoading(true);
    const payload = { action: 'chat', contact: currentUser.contact, sender: currentUser.name, message: chatInput, fileName: chatFile?.name, mimeType: chatFile?.type, fileBase64: chatFile?.base64 };
    const res = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if ((await res.json()).success) { setChatInput(''); setChatFile(null); await fetchChatMessages(); } else alert(t('error_network'));
    setChatLoading(false);
  };

  const handleMasterSend = async (e) => {
    e.preventDefault(); if ((!masterChatInput.trim() && !masterChatFile) || selectedClientSheets.length === 0) return;
    const payload = { action: 'master_send_chats', targetSheets: selectedClientSheets, sender: currentUser.name, message: masterChatInput, fileName: masterChatFile?.name, mimeType: masterChatFile?.type, fileBase64: masterChatFile?.base64 };
    const res = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if ((await res.json()).success) { setMasterChatInput(''); setMasterChatFile(null); await fetchMasterChats(); }
  };

  const handleApproveRequest = async (req) => {
    if (!req) return;
    const chatSheet = masterAllChats.find(c => selectedClientSheets.includes(c.sheetName))?.sheetName;
    const res = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'approve_request', rowIndex: req.rowIndex, chatSheetName: chatSheet, checkIn: req.checkIn, checkOut: req.checkOut, contact: req.contact }) });
    if ((await res.json()).success) { alert(t('requestApproved')); fetchMasterChats(); fetchSettings(); }
  };

  const handleRejectRequest = async (req) => {
    if (!req) return;
    const chatSheet = masterAllChats.find(c => selectedClientSheets.includes(c.sheetName))?.sheetName;
    const res = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'reject_request', rowIndex: req.rowIndex, chatSheetName: chatSheet, checkIn: req.checkIn, checkOut: req.checkOut, contact: req.contact }) });
    if ((await res.json()).success) { alert(t('rejectSuccess')); fetchMasterChats(); fetchSettings(); }
  };

  const handleSpecialOffer = async (e) => {
    e.preventDefault();
    const chatSheet = masterAllChats.find(c => selectedClientSheets.includes(c.sheetName))?.sheetName;
    const reqBase = activeRequestsList.find(r => r.rowIndex === offerData.rowIndex); if (!reqBase) return;
    const res = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'special_offer', rowIndex: reqBase.rowIndex, chatSheetName: chatSheet, clientContact: reqBase.contact, checkIn: offerData.checkIn, checkOut: offerData.checkOut, price: offerData.price, nights: differenceInDays(parse(offerData.checkOut, 'dd.MM.yyyy', new Date()), parse(offerData.checkIn, 'dd.MM.yyyy', new Date())), adults: reqBase.adults, children: reqBase.children, guests: reqBase.guests }) });
    if ((await res.json()).success) { alert(t('offerSentSuccess')); setOfferModal(false); fetchMasterChats(); fetchSettings(); }
  };

  const handleRevokeRequest = async (req) => {
    if (!req) return;
    const chatSheet = masterAllChats.find(c => selectedClientSheets.includes(c.sheetName))?.sheetName;
    const res = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'revoke_request', rowIndex: req.rowIndex, chatSheetName: chatSheet, checkIn: req.checkIn, checkOut: req.checkOut, clientContact: req.contact }) });
    if ((await res.json()).success) { alert(t('revokeSuccess')); fetchMasterChats(); fetchSettings(); }
  };

  // Задача 4.4 - Вставка шаблона из мини-карточки
  const insertTemplate = (text) => setMasterChatInput(prev => prev + (prev.length > 0 ? '\n' : '') + text);
  
  const toggleClientSelection = (sheetName) => setSelectedClientSheets(prev => prev.includes(sheetName) ? prev.filter(s => s !== sheetName) : [...prev, sheetName]);

  const handleMasterCalendarSave = async (e) => {
    e.preventDefault();
    const [cStart, cEnd] = calSetRange; if (!cStart) return alert(t('selectDatesLabel'));
    const startStr = format(cStart, 'dd.MM.yyyy'); const endStr = format(cEnd || cStart, 'dd.MM.yyyy');
    const rules = [];
    if (editStatus === 'Заблокировано') rules.push({ start: startStr, end: endStr, type: 'Блокировка', value: '1' }); else if (editStatus === 'Открыто') rules.push({ start: startStr, end: endStr, type: 'Сброс блокировки', value: 'СБРОС' });
    if (editPrice !== '') rules.push({ start: startStr, end: endStr, type: 'Цена', value: editPrice });
    if (editMinNights !== '') rules.push({ start: startStr, end: endStr, type: 'Мин. дней', value: editMinNights });
    if (editNote !== '') rules.push({ start: startStr, end: endStr, type: 'Заметка', note: editNote });
    if (editBookingMode !== '') rules.push({ start: startStr, end: endStr, type: 'Тип записи', value: editBookingMode });
    if (rules.length === 0) return;
    const res = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'master_save_calendar', sender: currentUser.name, rules }) });
    if ((await res.json()).success) { alert(t('successRulesSave')); setCalSetRange([null, null]); setEditPrice(''); setEditMinNights(''); setEditNote(''); setEditStatus('Открыто'); setEditBookingMode(''); fetchSettings(); }
  };

  const handleMasterCalendarReset = async () => {
    const [cStart, cEnd] = calSetRange; if (!cStart) return;
    const startStr = format(cStart, 'dd.MM.yyyy'); const endStr = format(cEnd || cStart, 'dd.MM.yyyy');
    const rules = [ { start: startStr, end: endStr, type: 'Сброс блокировки', value: 'СБРОС' }, { start: startStr, end: endStr, type: 'Сброс цены', value: 'СБРОС' }, { start: startStr, end: endStr, type: 'Сброс мин. дней', value: 'СБРОС' }, { start: startStr, end: endStr, type: 'Сброс заметки', note: 'СБРОС' }, { start: startStr, end: endStr, type: 'Сброс типа бронирования', value: 'СБРОС' } ];
    const res = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'master_save_calendar', sender: currentUser.name, rules }) });
    if ((await res.json()).success) { alert(t('successRulesReset')); setCalSetRange([null, null]); setEditPrice(''); setEditMinNights(''); setEditNote(''); setEditStatus('Открыто'); setEditBookingMode(''); fetchSettings(); }
  };

  const handleMasterGlobalRulesSave = async (e) => {
    e.preventDefault(); const rules = Object.fromEntries(new FormData(e.target));
    const res = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'master_save_global_rules', sender: currentUser.name, rules }) });
    if ((await res.json()).success) { alert(t('successGlobalSave')); setDynamicRules(prev => ({...prev, ...rules})); } 
  };

  const isSameDayHelper = (d1, d2) => {
    if (!d1 || !d2 || isNaN(d1) || isNaN(d2)) return false; 
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
  };

  const isOccupiedDate = (targetDate) => occupiedDates.some(occ => occ && isSameDayHelper(occ, targetDate)) || isManualBlocked(targetDate);
  const safeMinDate = addDays(new Date(), parseInt(dynamicRules.advanceNoticeDays) || 0);

  const handleGuestDayClick = (clickedDate) => {
      const checkDate = new Date(clickedDate.getFullYear(), clickedDate.getMonth(), clickedDate.getDate());
      
      const minStart = new Date(safeMinDate); minStart.setHours(0,0,0,0);
      if (checkDate < minStart) return;

      if (!startDate || (startDate && endDate)) {
          if (isOccupiedDate(checkDate)) {
             const prevDay = addDays(checkDate, -1);
             if (isOccupiedDate(prevDay)) return; 
          }
          setDateRange([checkDate, null]);
      } else {
          const sDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
          if (checkDate <= sDate) {
              if (!isOccupiedDate(checkDate)) setDateRange([checkDate, null]);
              return;
          }
          
          let cur = new Date(sDate); cur.setDate(cur.getDate() + 1);
          let hasOverlap = false;
          while (cur < checkDate) {
              if (isOccupiedDate(cur)) { hasOverlap = true; break; }
              cur.setDate(cur.getDate() + 1);
          }
          
          if (hasOverlap) { alert(t('overlapsOccupied')); return; }
          if (differenceInDays(checkDate, sDate) > dynamicRules.maxNights) return;
          
          setDateRange([sDate, checkDate]);
          setIsGuestCalendarOpen(false); 
      }
  };

  const renderGuestMonth = (monthDate) => {
    const monthStart = startOfMonth(monthDate); const monthEnd = endOfMonth(monthStart);
    const startDateGrid = startOfWeek(monthStart, { weekStartsOn: 1 }); const endDateGrid = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const rows = []; let days = []; let day = startDateGrid; const weekDays = t('weekdays').split(',');
    const header = ( <div className="grid grid-cols-7 gap-1 mb-2 w-full"> {weekDays.map((wd, i) => ( <div key={i} className="text-center text-[10px] md:text-xs text-slate-500 font-bold py-1 uppercase">{wd}</div> ))} </div> );
    
    while (day <= endDateGrid) {
        for (let i = 0; i < 7; i++) {
            const cloneDay = new Date(day); const checkDate = new Date(cloneDay.getFullYear(), cloneDay.getMonth(), cloneDay.getDate());
            const isCurrentMonth = isSameMonth(cloneDay, monthStart);
            const isOccupied = isOccupiedDate(checkDate);
            const minStart = new Date(safeMinDate); minStart.setHours(0,0,0,0);
            const isPast = checkDate < minStart;
            
            let isSelected = false; let isInRange = false; let isCheckoutOnly = false;
            if (startDate && isSameDayHelper(checkDate, startDate)) isSelected = true;
            if (endDate && isSameDayHelper(checkDate, endDate)) isSelected = true;
            if (startDate && endDate && checkDate > startDate && checkDate < endDate) isInRange = true;
            
            if (isOccupied && !isPast) {
                const prevDay = addDays(checkDate, -1);
                if (!isOccupiedDate(prevDay)) isCheckoutOnly = true;
            }

            const currentMinNights = getMinNightsForDate(startDate || checkDate);
            let stateClass = "bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer border border-white/5";
            
            if (!isCurrentMonth) stateClass = "opacity-0 pointer-events-none"; 
            else if (isPast) stateClass = "opacity-30 bg-slate-900 text-slate-500 cursor-not-allowed border border-transparent";
            else if (isOccupied) {
                if (isCheckoutOnly) {
                   if (startDate && checkDate > startDate) stateClass = "bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer border border-white/5 border-l-red-500 border-l-2";
                   else stateClass = "opacity-50 bg-slate-900 text-red-300 cursor-not-allowed border border-transparent";
                } else stateClass = "opacity-40 bg-slate-900 text-slate-500 cursor-not-allowed border border-transparent line-through";
            }
            
            if (isSelected) stateClass = "!bg-blue-600 !border-blue-400 !text-white shadow-[0_0_10px_rgba(37,99,235,0.5)] font-bold z-20 scale-105 rounded-xl";
            if (isInRange) stateClass = "!bg-blue-900/60 !border-blue-500/30 !text-blue-100 rounded-none";
            
            if (startDate && !endDate && isCurrentMonth && !isPast && !isOccupied && checkDate > startDate) {
                const diff = differenceInDays(checkDate, startDate);
                if (diff < currentMinNights) stateClass += " !bg-yellow-500/10 border-dashed !border-yellow-500/50";
            }

            const dayEvents = apiEvents.filter(e => {
                const eS = new Date(e.start); eS.setHours(0,0,0,0); const eE = new Date(e.end); eE.setHours(0,0,0,0);
                return checkDate >= eS && checkDate <= eE; 
            });

            days.push(
                <div key={day.toISOString()} onClick={() => handleGuestDayClick(cloneDay)} className={`relative flex flex-col items-center justify-center w-full h-10 md:h-14 text-sm md:text-base rounded-lg transition-all box-border overflow-hidden ${stateClass}`}>
                    <span className="z-10">{format(cloneDay, 'd')}</span>
                    <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-[1px] z-0 pointer-events-none opacity-50">
                        {dayEvents.map((ev, idx) => {
                            const eS = new Date(ev.start); eS.setHours(0,0,0,0); const eE = new Date(ev.end); eE.setHours(0,0,0,0);
                            const isStart = isSameDayHelper(checkDate, eS); const isEnd = isSameDayHelper(checkDate, eE);
                            if (isStart && isEnd) return null; 
                            const bgColor = ev.sourceId === 'airbnb_sync' ? 'bg-[#ff5a5f]' : 'bg-slate-600';
                            let widthClass = 'w-full';
                            if (isStart) widthClass = 'w-1/2 ml-auto rounded-l-full'; else if (isEnd) widthClass = 'w-1/2 mr-auto rounded-r-full';
                            return <div key={idx} className={`h-1.5 md:h-2 ${bgColor} ${widthClass}`}></div>
                        })}
                    </div>
                </div>
            );
            day = addDays(day, 1);
        }
        rows.push(<div className="grid grid-cols-7 gap-1 mb-1 w-full" key={day.toISOString()}>{days}</div>); days = [];
    }
    
    return (
      <div className="flex flex-col w-full px-2">
         <div className="text-center font-bold text-white mb-4 capitalize tracking-wide text-lg">{format(monthStart, 'LLLL yyyy', { locale: lang === 'en' ? enUS : (lang === 'tr' ? tr : ru) })}</div>
         {header}{rows}
      </div>
    );
  };

  const handleHostDayClick = (clickedDate) => {
    if (!calSetRange[0] || (calSetRange[0] && calSetRange[1])) setCalSetRange([clickedDate, null]);
    else { if (clickedDate < calSetRange[0]) setCalSetRange([clickedDate, calSetRange[0]]); else setCalSetRange([calSetRange[0], clickedDate]); }
  };

  const renderCustomHostCalendar = () => {
    if (!hostCurrentMonth) return null;
    const monthStart = startOfMonth(hostCurrentMonth); const monthEnd = endOfMonth(monthStart);
    const startDateGrid = startOfWeek(monthStart, { weekStartsOn: 1 }); const endDateGrid = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const rows = []; let days = []; let day = startDateGrid; const weekDays = t('weekdays').split(',');
    const header = ( <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2 w-full"> {weekDays.map((wd, i) => ( <div key={i} className="text-center text-xs md:text-sm text-slate-500 font-bold py-2">{wd}</div> ))} </div> );
    
    while (day <= endDateGrid) {
        for (let i = 0; i < 7; i++) {
            const cloneDay = new Date(day); const checkDate = new Date(cloneDay.getFullYear(), cloneDay.getMonth(), cloneDay.getDate());
            const price = getPriceForDate(checkDate); const isManuallyBlocked = isManualBlocked(checkDate);
            const minN = getMinNightsForDate(checkDate); const hasNote = getNoteForDate(checkDate);
            const dailyMode = getBookingModeForSingleDate(checkDate);
            const isCurrentMonth = isSameMonth(cloneDay, monthStart);
            
            let isSelected = false; let isInRange = false;
            if (calSetRange[0] && isSameDayHelper(checkDate, calSetRange[0])) isSelected = true;
            if (calSetRange[1] && isSameDayHelper(checkDate, calSetRange[1])) isSelected = true;
            if (calSetRange[0] && calSetRange[1] && checkDate > calSetRange[0] && checkDate < calSetRange[1]) isInRange = true;
            
            let holdDetailsText = ""; let holdRule = null;
            for (const rule of dateRules) {
                const rS = parseDateRU(rule.start); rS.setHours(0,0,0,0); const rE = parseDateRU(rule.end); rE.setHours(0,0,0,0);
                const check = new Date(cloneDay); check.setHours(0,0,0,0);
                if (check >= rS && check <= rE) {
                    if (rule.type === 'Сброс блокировки') { holdRule = null; break; }
                    if (rule.type === 'Блокировка' && String(rule.value).startsWith('HOLD|')) { holdRule = rule; break; }
                    if (rule.type === 'Блокировка') break;
                }
            }
            const hasHold = !!holdRule;
            if (holdRule) {
                const parts = String(holdRule.value).split('|'); const guestContact = parts[1] || 'Неизвестно'; const expiresIso = parts[2]; const expiresFormatted = expiresIso ? new Date(expiresIso).toLocaleString('ru-RU') : 'Бессрочно';
                const chatForHold = masterAllChats.find(c => c.clientContact === guestContact);
                let reqHold = null;
                if (chatForHold && chatForHold.activeRequests) reqHold = chatForHold.activeRequests.find(r => r.status.includes('СПЕЦПРЕДЛОЖЕНИЕ') || r.status.includes('ОЖИДАЕТ ОПЛАТЫ'));
                if (reqHold) holdDetailsText = `\n\n-- ДАННЫЕ (HOLD) --\nГость: ${chatForHold.clientName} (${guestContact})\nСтатус: ${translateStatus(reqHold.status)}\nПериод: ${reqHold.checkIn}-${reqHold.checkOut}\nСумма: ${reqHold.price}\nОплатить до: ${expiresFormatted}`;
                else holdDetailsText = `\n\n-- УДЕРЖАНИЕ --\nГость: ${guestContact}\nОплатить до: ${expiresFormatted}`;
            }

            const dayEvents = apiEvents.filter(e => { const eS = new Date(e.start); eS.setHours(0,0,0,0); const eE = new Date(e.end); eE.setHours(0,0,0,0); return checkDate >= eS && checkDate <= eE; });
            const tooltipText = `${t('dates')}: ${format(cloneDay, 'dd.MM.yyyy')}\n${t('specialPriceLabel')}: ${price}\n${t('minNightsLabel')}: ${minN}\n${t('bookingModeLabel')}: ${dailyMode === 'manual' ? t('modeManual') : t('modeInstant')}\n${t('availabilityStatus')}: ${isManuallyBlocked ? t('hardBlock') : t('openForBooking')}\n${t('internalNoteLabel')}: ${hasNote || '-'}${holdDetailsText}`;

            days.push(
                <div key={day.toISOString()} title={tooltipText} onClick={() => handleHostDayClick(cloneDay)} className={`relative flex flex-col items-center justify-center w-full min-h-[85px] md:min-h-[120px] p-1 md:p-2 border border-white/10 rounded-lg md:rounded-2xl cursor-pointer transition-all box-border overflow-hidden ${!isCurrentMonth ? 'opacity-40 bg-slate-900/30' : 'bg-slate-800/60 hover:bg-slate-700'} ${isSelected ? '!bg-blue-600 !border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.5)]' : isInRange ? '!bg-blue-900/60' : ''} ${isManuallyBlocked && !isSelected && !isInRange ? '!bg-red-900/40 text-red-300 line-through' : ''}`}>
                    <span className="font-bold text-lg md:text-2xl flex items-center gap-1 z-20">{format(cloneDay, 'd')} {dailyMode === 'manual' && <span className="text-[8px] text-yellow-400">✋</span>}</span>
                    <span className="text-[10px] md:text-sm text-green-400 text-center break-words leading-tight mt-1 w-full max-w-full overflow-hidden z-20">{price}</span>
                    {minN != dynamicRules.minNights && <span className="absolute top-1 left-1 text-[10px] md:text-xs font-bold text-blue-300 z-20">{minN}н</span>}
                    {hasNote && <span className="absolute top-2 right-2 w-2 h-2 md:w-3 md:h-3 bg-yellow-400 rounded-full shadow-[0_0_8px_rgba(250,204,21,0.8)] z-20"></span>}
                    {hasHold && <span className="absolute bottom-6 right-1 text-[10px] md:text-xs z-20" title="Удержание 24ч">⏳</span>}
                    <div className="absolute top-[40%] left-0 right-0 flex flex-col gap-[2px] z-10 pointer-events-none">
                        {dayEvents.map((ev, idx) => {
                            const eS = new Date(ev.start); eS.setHours(0,0,0,0); const eE = new Date(ev.end); eE.setHours(0,0,0,0);
                            const isStart = isSameDayHelper(checkDate, eS); const isEnd = isSameDayHelper(checkDate, eE);
                            if (isStart && isEnd) return null; 
                            const bgColor = ev.sourceId === 'airbnb_sync' ? 'bg-[#ff5a5f]' : 'bg-slate-600';
                            let widthClass = 'w-full';
                            if (isStart) widthClass = 'w-1/2 ml-auto rounded-l-full'; else if (isEnd) widthClass = 'w-1/2 mr-auto rounded-r-full';
                            return <div key={idx} className={`h-full ${bgColor} ${widthClass} opacity-95 shadow-md`}></div>
                        })}
                    </div>
                </div>
            );
            day = addDays(day, 1);
        }
        rows.push(<div className="grid grid-cols-7 gap-1 md:gap-2 mb-1 md:mb-2 w-full" key={day.toISOString()}>{days}</div>); days = [];
    }
    return <div className="w-full flex flex-col">{header}{rows}</div>;
  };

  const calculateTotalPrice = () => {
    if (!startDate || !endDate) return 0;
    let total = 0; let cur = new Date(startDate); cur.setHours(0,0,0,0); const end = new Date(endDate); end.setHours(0,0,0,0);
    while (cur < end) { total += parseInt(getPriceForDate(cur)) || parseInt(dynamicRules.basePrice); cur.setDate(cur.getDate() + 1); }
    return total;
  };

  const currentMinNights = getMinNightsForDate(startDate || safeMinDate);
  const nightsCount = (startDate && endDate) ? differenceInDays(endDate, startDate) : 0;
  const isShortStay = (nightsCount > 0 && nightsCount < currentMinNights);
  const effectiveBookingMode = isShortStay ? 'manual' : currentBookingMode;

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!agreedKVKK || !agreedContract || !agreedPrivacy) return alert(t('legalKVKK'));
    const totalGuests = adults + children;
    if (totalGuests > SITE_CONFIG.maxTotalGuests) return alert(`${t('maxGuests')}: ${SITE_CONFIG.maxTotalGuests}`);
    if (!startDate || !endDate) return alert(t('dates'));
    
    setStatus('loading');
    const formData = new FormData(e.target); const data = Object.fromEntries(formData);
    data.action = effectiveBookingMode === 'manual' ? 'request_booking' : 'booking'; 
    data.isRegistered = !!currentUser;
    if (currentUser) { data.name = currentUser.name; data.contact = currentUser.contact; }
    data.total_adults = adults; data.total_children = children; data.total_guests = totalGuests;
    data.checkIn = format(startDate, 'dd.MM.yyyy'); data.checkOut = format(endDate, 'dd.MM.yyyy');
    data.checkInTime = dynamicRules.checkInTime || SITE_CONFIG.checkInTime; 
    data.checkOutTime = dynamicRules.checkOutTime || SITE_CONFIG.checkOutTime;
    data.nights = nightsCount; data.totalPrice = `${calculateTotalPrice()} ${CURRENCY_SYMBOLS[activeCurrency]}`;
    
    try {
      if (effectiveBookingMode === 'manual') {
        const res = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        const result = await res.json();
        if (result.success) {
           const userObj = { ...result.user }; localStorage.setItem('villa_user', JSON.stringify(userObj)); setCurrentUser(userObj); setStatus('idle'); setDateRange([null, null]); alert(t('requestSentSuccess'));
           setTimeout(() => { if (chatBottomRef.current) chatBottomRef.current.scrollIntoView({ behavior: 'smooth' }); }, 500);
        } else { setStatus('error'); alert(t(result.error)); }
      } else {
        const paymentGateway = activeCurrency === 'RUB' ? 'tbank' : 'stripe';
        const res = await fetch('/api/payment', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ gateway: paymentGateway, amount: calculateTotalPrice(), currency: activeCurrency, bookingDetails: data }) });
        const result = await res.json();
        if (result.url) window.location.href = result.url; else { setStatus('error'); alert(result.error || 'Payment error'); }
      }
    } catch (err) { setStatus('error'); }
  };

  const handleProductPurchase = async (price, type) => {
    if (!currentUser) return setAuthMode('login'); setStatus('loading');
    const paymentGateway = activeCurrency === 'RUB' ? 'tbank' : 'stripe';
    const data = { action: 'booking', isRegistered: true, name: currentUser.name, contact: currentUser.contact, checkIn: null, checkOut: null, nights: 1, total_adults: 1, total_children: 0, total_guests: 1, totalPrice: `${price} ${CURRENCY_SYMBOLS[activeCurrency]}` };
    try {
        const res = await fetch('/api/payment', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ gateway: paymentGateway, amount: price, currency: activeCurrency, bookingDetails: data }) });
        const result = await res.json();
        if (result.url) window.location.href = result.url; else { setStatus('error'); alert(result.error || 'Payment error'); }
    } catch (err) { setStatus('error'); }
  }

  if (siteBlocked) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center p-6 text-center">
        <SEO title="Access Denied" description="Access restricted." />
        <Lock size={64} className="text-red-500 mb-6" /><h1 className="text-3xl font-bold mb-4">Access Denied</h1>
      </div>
    );
  }

  // --- АДМИН ПАНЕЛЬ ---
  if (currentUser?.isHost) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans p-6 md:p-10 flex flex-col gap-8 w-full max-w-[100vw] lg:max-w-7xl mx-auto overflow-x-hidden">
        <SEO title={`${t('adminPanel')} | ${SITE_CONFIG.vesselName}`} description="Admin panel for Villa Turaman" />
        
        <div className="flex flex-wrap justify-between items-center bg-slate-900/80 backdrop-blur p-6 rounded-[2rem] border border-blue-500/30 shadow-2xl gap-4 w-full max-w-full z-50">
          <div className="flex-1 min-w-[200px]">
            <h1 className="text-2xl md:text-3xl font-light text-white tracking-tight flex items-center gap-3">
              <Settings className="text-blue-500 shrink-0"/> <span className="truncate">{t('adminPanel')} ({currentUser.role})</span>
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-1 flex items-center gap-2"><User size={14}/> <span className="truncate">{currentUser.name} ({currentUser.contact})</span></p>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-3 justify-end items-center">
             <button onClick={() => changeLanguage(lang === 'ru' ? 'tr' : (lang === 'tr' ? 'en' : 'ru'))} className="px-4 py-3 rounded-xl font-bold transition-all text-xs md:text-sm bg-slate-800 text-slate-400 hover:bg-slate-700">{lang.toUpperCase()}</button>
             {currentUser.permissions?.chats && (<button onClick={() => setHostTab('chats')} className={`px-4 py-3 rounded-xl font-bold transition-all text-xs md:text-sm ${hostTab === 'chats' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>{t('adminChats')}</button>)}
             {(currentUser.permissions?.blocks || currentUser.permissions?.finance || currentUser.permissions?.periods || currentUser.permissions?.bookingWindow) && (<button onClick={() => setHostTab('calendar')} className={`px-4 py-3 rounded-xl font-bold transition-all text-xs md:text-sm ${hostTab === 'calendar' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>{t('adminCalendar')}</button>)}
             <Link href="/admin/graph" className="px-4 py-3 rounded-xl font-bold transition-all text-xs md:text-sm bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-2"><Layers size={14}/> C&C ГРАФ (2FA)</Link>
             <button onClick={handleLogout} className="px-5 py-3 rounded-xl font-bold bg-red-600 hover:bg-red-500 text-white transition-all shadow-lg shadow-red-900/50 uppercase tracking-widest text-xs md:text-sm shrink-0 whitespace-nowrap">{t('logout')}</button>
          </div>
        </div>

        {hostTab === 'chats' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 flex-1 min-h-[70vh]">
            <div className="bg-slate-900/80 rounded-[2rem] border border-white/10 p-6 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><Users size={20}/> {t('activeChats')}</h2>
              {masterAllChats.map((chat, idx) => (
                <label key={idx} className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer border transition-all ${selectedClientSheets.includes(chat.sheetName) ? 'bg-blue-600/20 border-blue-500' : 'bg-slate-800 border-white/5 hover:bg-slate-700'}`}>
                  <input type="checkbox" checked={selectedClientSheets.includes(chat.sheetName)} onChange={() => toggleClientSelection(chat.sheetName)} className="w-5 h-5 accent-blue-600 rounded" />
                  <div className="flex flex-col"><span className="font-bold text-white">{chat.clientName}</span><span className="text-xs text-slate-400">{chat.clientContact}</span></div>
                </label>
              ))}
            </div>
            
            <div className="md:col-span-2 bg-slate-900/80 rounded-[2rem] border border-white/10 p-6 flex flex-col gap-6 relative">
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <h2 className="text-xl font-bold text-white">{t('broadcastTitle')}</h2>
                <span className="text-sm text-blue-400">{t('selectedRecipients')}: {selectedClientSheets.length}</span>
              </div>
              
              <div className="flex-1 overflow-y-auto bg-slate-950/50 rounded-2xl p-6 border border-white/5 space-y-8">
                {masterAllChats.filter(c => selectedClientSheets.includes(c.sheetName)).map((chat, idx) => (
                  <div key={idx} className="bg-slate-800/50 p-4 rounded-2xl">
                    <h3 className="text-sm font-bold text-slate-300 mb-4 border-b border-white/10 pb-2">{t('chatHistory')}: {chat.clientName}</h3>
                    <div className="space-y-4">
                      {chat.messages.map((m, mIdx) => (
                        <div key={mIdx} className={`flex flex-col ${m.sender === currentUser.name || m.sender === 'Система' || m.sender === 'Владелец' ? 'items-end' : 'items-start'}`}>
                          <span className="text-[10px] text-slate-500 mb-1">
                            {m.sender !== 'Система' && m.sender !== 'Владелец' && m.sender !== currentUser.name ? `${m.sender} (${chat.clientContact})` : m.sender} • {m.date}
                          </span>
                          <div className={`p-3 max-w-[85%] rounded-xl text-sm whitespace-pre-wrap break-all overflow-hidden ${m.sender === currentUser.name || m.sender === 'Владелец' ? 'bg-blue-600 text-white' : m.sender === 'Система' ? 'bg-slate-700 text-slate-300 italic' : 'bg-slate-800 text-slate-200'}`}>{m[lang] || m.original}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
                <div className="bg-blue-900/20 border border-blue-500/30 p-3 rounded-xl mb-2 mt-4">
                   <p className="text-xs text-blue-400 mb-2">💡 <b>Инструкция по гидам:</b> Выберите видео-гид из списка. Текст с доступом вставится в окно автоматически.</p>
                   <select onChange={handleSendLesson} className="w-full bg-slate-900 hover:bg-slate-800 text-sm text-white p-3 rounded-lg border border-slate-700 outline-none cursor-pointer font-bold">
                      <option value="">{t('assignLesson')}</option>
                      {lmsModules.map((m, i) => (
                         <option key={i} value={m.privateLink}>{getTranslated(m, 'name')} ({m.module})</option>
                      ))}
                   </select>
                </div>
                
                {/* Задача 4.4 Разворачивающиеся мини-карточки шаблонов */}
                <div className="flex flex-col gap-2 overflow-x-auto pt-2 pb-2 border-t border-white/10 mt-2">
                  <span className="text-xs text-slate-500 flex items-center font-bold uppercase tracking-widest"><FileText size={14} className="mr-1"/> {t('chatTemplatesLabel')}:</span>
                  <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
                    {Object.entries(contentData.templates || {}).flatMap(([id, tplArray]) => 
                      tplArray.map((tpl, index) => {
                        const tplText = tpl.text[lang] || tpl.text.ru;
                        const isExpanded = expandedTemplate === `${id}-${index}`;
                        return (
                          <div key={`${id}-${index}`} className="flex flex-col bg-slate-800/80 rounded-xl border border-slate-700 shadow-md min-w-[200px] max-w-[280px] shrink-0 snap-start overflow-hidden transition-all">
                             <div className="p-3 cursor-pointer hover:bg-slate-700 flex justify-between items-center" onClick={() => setExpandedTemplate(isExpanded ? null : `${id}-${index}`)}>
                               <span className="text-xs font-bold text-slate-200 truncate">{tpl.name[lang] || tpl.name.ru}</span>
                               <ChevronDown size={14} className={`text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}/>
                             </div>
                             <div className={`px-3 text-[10px] text-slate-400 overflow-hidden transition-all ${isExpanded ? 'max-h-[200px] pb-3' : 'max-h-12 pb-2'}`}>
                                <p className={`whitespace-pre-wrap ${!isExpanded && 'line-clamp-2'}`}>{tplText}</p>
                             </div>
                             {isExpanded && (
                               <button type="button" onClick={() => { insertTemplate(tplText); setExpandedTemplate(null); }} className="w-full bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 text-xs py-2 font-bold border-t border-blue-500/20 transition-colors">
                                 {t('insertTemplateBtn')}
                               </button>
                             )}
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>

                <form onSubmit={handleMasterSend} className="flex flex-col gap-2 mt-2">
                  {masterChatFile && (<div className="flex justify-between bg-slate-900 p-2 rounded-xl border border-white/10 text-xs"><span className="truncate pr-2 text-slate-300">{masterChatFile.name}</span><button type="button" onClick={() => setMasterChatFile(null)} className="text-red-400"><X size={14}/></button></div>)}
                  <div className="flex gap-4 items-end">
                    <label className="cursor-pointer bg-slate-900 hover:bg-slate-700 p-4 rounded-2xl flex justify-center items-center text-slate-300 shrink-0 h-[100px]"><Paperclip size={24} /><input type="file" className="hidden" onChange={handleMasterFileAttach} /></label>
                    <textarea value={masterChatInput} onChange={(e) => setMasterChatInput(e.target.value)} placeholder={t('messagePlaceholder')} className="flex-1 bg-slate-950 border border-slate-700 rounded-2xl p-4 text-sm text-white outline-none focus:border-blue-500 min-h-[100px] resize-none" />
                    <button type="submit" className="bg-blue-600 hover:bg-blue-500 p-4 rounded-2xl text-white font-bold transition-colors h-[100px] flex items-center justify-center min-w-[80px]"><Send size={24} /></button>
                  </div>
                </form>
              </div>
              
            <div className="bg-slate-900/80 rounded-[2rem] border border-white/10 p-6 flex flex-col gap-4">
              <h2 className="text-xl font-bold text-white mb-2">{t('bookingRequestPanel')}</h2>
              {activeRequestsList.length > 0 ? (
                <div className="flex flex-col gap-4 overflow-y-auto max-h-[60vh] pr-2">
                  {activeRequestsList.map((req, idx) => (
                    <div key={idx} className="text-sm text-slate-300 bg-slate-800/50 p-4 rounded-2xl border border-white/5">
                      <p className="font-bold text-lg text-white mb-2">{activeChat.clientName}</p>
                      <div className="space-y-2 border-t border-white/5 pt-2">
                         <p className="text-slate-400">📅 {req.checkIn} – {req.checkOut} ({req.nights} {t('daysAbbr')})</p>
                         <p className="text-slate-400">👥 Гостей: {req.guests} (Взр: {req.adults}, Дет: {req.children})</p>
                         <p className="text-slate-400">💰 {t('amountLabel')} <span className="font-bold text-white text-lg">{req.price}</span></p>
                         <p className="text-xs text-yellow-500 mt-2 px-2 py-1 bg-yellow-500/10 rounded-md w-fit">{t('statusLabel')} {translateStatus(req.status)}</p>
                      </div>
                      
                      {(req.status === 'ЗАПРОС' || req.status === 'СПЕЦПРЕДЛОЖЕНИЕ') && (
                        <div className="mt-4 flex flex-col gap-2 border-t border-white/5 pt-4">
                          <div className="flex gap-2">
                            <button onClick={() => handleApproveRequest(req)} className="flex-1 bg-blue-600 hover:bg-blue-500 py-2 rounded-xl font-bold text-white text-xs transition-all">{t('approveBtn')}</button>
                            <button onClick={() => handleRejectRequest(req)} className="flex-1 bg-slate-700 hover:bg-red-500 py-2 rounded-xl font-bold text-white text-xs transition-all">{t('rejectBtn')}</button>
                          </div>
                          <button onClick={() => { setOfferData({ checkIn: req.checkIn, checkOut: req.checkOut, price: parseInt(req.price), rowIndex: req.rowIndex, contact: req.contact }); setOfferModal(true); }} className="w-full bg-slate-800 hover:bg-slate-700 py-2 rounded-xl font-bold text-slate-300 text-xs transition-all border border-white/10">{t('specialOfferBtn')}</button>
                        </div>
                      )}
                      {(req.status === 'ОЖИДАЕТ ОПЛАТЫ' || req.status === 'СПЕЦПРЕДЛОЖЕНИЕ') && (
                        <div className="mt-2 flex flex-col gap-2">
                          <button onClick={() => handleRevokeRequest(req)} className="w-full bg-orange-600 hover:bg-orange-500 py-2 rounded-xl font-bold text-white text-xs transition-all">{t('revokeBtn')}</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">{t('noActiveRequests')}</div>
              )}
            </div>
          </div>
        )}

        {hostTab === 'calendar' && (
          <div className="flex flex-col gap-8 w-full mx-auto z-10 relative">
            <div className="bg-slate-900/80 rounded-[2rem] border border-white/10 p-4 md:p-10 w-full overflow-hidden shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 md:mb-8 flex items-center gap-3"><CalendarIcon className="text-blue-500"/> {t('calendarTitle')}</h2>
              
              <div className="flex flex-col gap-6 md:gap-8">
                <div className="relative w-full overflow-hidden flex flex-col">
                  <label className="text-xs uppercase tracking-widest text-slate-500 block mb-3 pl-2">{t('selectDatesLabel')}</label>
                  
                  <div className="flex justify-between items-center mb-4 md:mb-6 bg-slate-800/50 p-2 md:p-4 rounded-2xl border border-white/5 shadow-inner">
                      <button onClick={() => setHostCurrentMonth(addMonths(hostCurrentMonth || new Date(), -1))} className="p-2 md:p-3 bg-slate-700 rounded-xl hover:bg-slate-600 text-white transition-all shadow-md"><ChevronLeft size={24}/></button>
                      <span className="text-white font-bold text-lg md:text-2xl capitalize tracking-wide">
                        <DatePicker locale={lang === 'en' ? enUS : (lang === 'tr' ? tr : ru)} selected={hostCurrentMonth || new Date()} onChange={(date) => setHostCurrentMonth(date)} dateFormat="LLLL yyyy" showMonthYearPicker customInput={<span className="cursor-pointer">{format(hostCurrentMonth || new Date(), 'LLLL yyyy', { locale: lang === 'en' ? enUS : (lang === 'tr' ? tr : ru) })}</span>} />
                      </span>
                      <button onClick={() => setHostCurrentMonth(addMonths(hostCurrentMonth || new Date(), 1))} className="p-2 md:p-3 bg-slate-700 rounded-xl hover:bg-slate-600 text-white transition-all shadow-md"><ChevronRight size={24}/></button>
                  </div>
                  
                  <div className="w-full bg-slate-900/50 border border-white/5 rounded-[2rem] p-2 md:p-6 shadow-inner">
                    {renderCustomHostCalendar()}
                  </div>
                </div>

                <div className={`transition-all duration-500 origin-top ${calSetRange[0] ? 'opacity-100 scale-100 h-auto mt-4' : 'opacity-0 scale-95 h-0 overflow-hidden pointer-events-none'}`}>
                  <div className="bg-slate-800/50 p-6 md:p-8 rounded-3xl border border-white/10 shadow-inner">
                    <label className="text-sm font-bold uppercase tracking-widest text-white block mb-6 border-b border-white/10 pb-4">
                      {t('settingsDatesLabel')} <span className="text-blue-400 ml-2">{calSetRange[0] ? `${format(calSetRange[0], 'dd.MM.yyyy')} - ${format(calSetRange[1] || calSetRange[0], 'dd.MM.yyyy')}` : ''}</span>
                    </label>
                    
                    <form onSubmit={handleMasterCalendarSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                          <label className="text-xs uppercase tracking-widest text-slate-400 block mb-2">{t('availabilityStatus')}</label>
                          <select value={editStatus} onChange={e => setEditStatus(e.target.value)} disabled={!currentUser.permissions?.blocks} className="w-full bg-slate-900 border border-slate-700 p-4 rounded-xl text-white outline-none disabled:opacity-50 shadow-inner">
                            <option value="Открыто">{t('openForBooking')}</option>
                            <option value="Заблокировано">{t('hardBlock')}</option>
                          </select>
                      </div>
                      <div>
                          <label className="text-xs uppercase tracking-widest text-slate-400 block mb-2">{t('bookingModeLabel')}</label>
                          <select value={editBookingMode} onChange={e => setEditBookingMode(e.target.value)} disabled={!currentUser.permissions?.blocks} className="w-full bg-slate-900 border border-slate-700 p-4 rounded-xl text-white outline-none disabled:opacity-50 shadow-inner">
                            <option value="">{t('modeInherit')}</option>
                            <option value="instant">{t('modeInstant')}</option>
                            <option value="manual">{t('modeManual')}</option>
                          </select>
                      </div>
                      <div>
                          <label className="text-xs uppercase tracking-widest text-slate-400 block mb-2">{t('specialPriceLabel')} ({CURRENCY_SYMBOLS[dynamicRules.currency]})</label>
                          <input type="number" value={editPrice} onChange={e => setEditPrice(e.target.value)} placeholder={`${dynamicRules.basePrice}`} disabled={!currentUser.permissions?.finance} className="w-full bg-slate-900 border border-slate-700 p-4 rounded-xl text-white outline-none disabled:opacity-50 shadow-inner" />
                      </div>
                      <div>
                          <label className="text-xs uppercase tracking-widest text-slate-400 block mb-2">{t('minNightsLabel')}</label>
                          <input type="number" value={editMinNights} onChange={e => setEditMinNights(e.target.value)} placeholder={`${dynamicRules.minNights}`} disabled={!currentUser.permissions?.periods} className="w-full bg-slate-900 border border-slate-700 p-4 rounded-xl text-white outline-none disabled:opacity-50 shadow-inner" />
                      </div>
                      <div className="md:col-span-2">
                          <label className="text-xs uppercase tracking-widest text-slate-400 block mb-2">{t('internalNoteLabel')}</label>
                          <input value={editNote} onChange={e => setEditNote(e.target.value)} placeholder="..." className="w-full bg-slate-900 border border-slate-700 p-4 rounded-xl text-white outline-none disabled:opacity-50 shadow-inner" />
                      </div>
                      
                      <div className="md:col-span-2 flex flex-col md:flex-row gap-4 mt-4 pt-6 border-t border-white/10">
                          <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold text-white transition-all shadow-lg shadow-blue-900/20">{t('saveRulesBtn')}</button>
                          <button type="button" onClick={handleMasterCalendarReset} className="flex-1 bg-slate-900 hover:bg-slate-800 border border-red-500/30 py-4 rounded-xl font-bold text-red-400 transition-all shadow-inner">{t('resetGlobalBtn')}</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/80 rounded-[2rem] border border-white/10 p-6 md:p-10 w-full mb-10">
              <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3"><Settings className="text-blue-500"/> {t('globalRulesTitle')}</h3>
              <form onSubmit={handleMasterGlobalRulesSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-slate-500 ml-2 block">{t('bookingModeLabel')}</label>
                  <select name="bookingMode" defaultValue={dynamicRules.bookingMode} disabled={!currentUser.permissions?.finance} className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white outline-none disabled:opacity-50">
                     <option value="instant">{t('modeInstant')}</option>
                     <option value="manual">{t('modeManual')}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-slate-500 ml-2 block">{t('currencyGlobal')}</label>
                  <select name="currency" defaultValue={dynamicRules.currency} disabled={!currentUser.permissions?.finance} className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white outline-none disabled:opacity-50">
                     <option value="RUB">RUB (₽)</option>
                     <option value="TRY">TRY (₺)</option>
                     <option value="USD">USD ($)</option>
                     <option value="EUR">EUR (€)</option>
                     <option value="GBP">GBP (£)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-slate-500 ml-2 block">{t('basePriceGlobal')}</label>
                  <input name="basePrice" type="number" defaultValue={dynamicRules.basePrice} disabled={!currentUser.permissions?.finance} className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white outline-none disabled:opacity-50" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-slate-500 ml-2 block">{t('minNightsGlobal')}</label>
                  <input name="minNights" type="number" defaultValue={dynamicRules.minNights} disabled={!currentUser.permissions?.periods} className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white outline-none disabled:opacity-50" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-slate-500 ml-2 block">{t('maxNightsGlobal')}</label>
                  <input name="maxNights" type="number" defaultValue={dynamicRules.maxNights} disabled={!currentUser.permissions?.periods} className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white outline-none disabled:opacity-50" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-slate-500 ml-2 block">{t('bookingWindowGlobal')} ({t('monthsAbbr')})</label>
                  <input name="bookingWindowMonths" type="number" defaultValue={dynamicRules.bookingWindowMonths} disabled={!currentUser.permissions?.bookingWindow} className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white outline-none disabled:opacity-50" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-slate-500 ml-2 block">{t('advanceNoticeGlobal')}</label>
                  <input name="advanceNoticeDays" type="number" defaultValue={dynamicRules.advanceNoticeDays} disabled={!currentUser.permissions?.bookingWindow} className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white outline-none disabled:opacity-50" />
                </div>
                
                {/* Задача 2.1 Настройки времени заезда/выезда */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-slate-500 ml-2 block">{t('checkInTimeGlobal')} (Заезд)</label>
                  <input name="checkInTime" type="time" defaultValue={dynamicRules.checkInTime} disabled={!currentUser.permissions?.bookingWindow} className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white outline-none disabled:opacity-50" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-slate-500 ml-2 block">{t('checkOutTimeGlobal')} (Выезд)</label>
                  <input name="checkOutTime" type="time" defaultValue={dynamicRules.checkOutTime} disabled={!currentUser.permissions?.bookingWindow} className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-white outline-none disabled:opacity-50" />
                </div>

                <div className="md:col-span-2 mt-4">
                  <button type="submit" disabled={!currentUser.permissions?.periods && !currentUser.permissions?.bookingWindow && !currentUser.permissions?.finance} className="w-full bg-slate-700 hover:bg-slate-600 py-5 rounded-2xl font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    {t('saveGlobalBtn')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- КЛИЕНТСКАЯ ЧАСТЬ (Гость) ---
  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-slate-200 font-sans selection:bg-blue-500 relative w-full overflow-x-hidden">
      
      <SEO title={`${homeData.title} - ${homeData.subtitle}`} description={homeData.aboutText} image={homeData.heroImage} schemaData={mainSchema} />
      
      <div className="absolute top-4 left-4 right-4 z-[100] flex flex-col items-center md:flex-row md:justify-between gap-4 pointer-events-none">
        <div className="flex gap-2 pointer-events-auto">
          <button onClick={() => changeLanguage('ru')} className={`px-3 py-1 rounded-full text-sm font-bold transition-all ${lang === 'ru' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>RU</button>
          <button onClick={() => changeLanguage('en')} className={`px-3 py-1 rounded-full text-sm font-bold transition-all ${lang === 'en' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>EN</button>
          <button onClick={() => changeLanguage('tr')} className={`px-3 py-1 rounded-full text-sm font-bold transition-all ${lang === 'tr' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>TR</button>
        </div>
        
        <div className="flex flex-wrap justify-center gap-2 pointer-events-auto">
        {currentUser ? (
          <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur border border-white/10 px-4 py-2 rounded-full shadow-2xl">
            <span className="flex items-center gap-2 text-sm text-slate-300 font-medium"><User size={16} className="text-blue-400"/><span>{currentUser.name}</span></span>
            <button onClick={handleLogout} className="text-xs bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded-full transition-all uppercase tracking-widest font-bold shadow-lg shadow-red-900/50">{t('logout')}</button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => setAuthMode('login')} className="bg-slate-900/80 backdrop-blur border border-white/10 px-6 py-2 rounded-full text-sm font-medium hover:bg-white/10 transition-all">{t('login')}</button>
            <button onClick={() => setAuthMode('register')} className="bg-blue-600 px-6 py-2 rounded-full text-sm font-bold text-white hover:bg-blue-500 transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]">{t('register')}</button>
          </div>
        )}
        </div>
      </div>

      <header className="relative h-[80vh] flex items-center justify-center text-center bg-cover bg-center" style={{ backgroundImage: `url(${homeData.heroImage})` }}>
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px]"></div>
        <div className="relative z-10 px-6 w-full mt-10">
          <h1 className="text-5xl md:text-8xl font-extralight text-white mb-6 tracking-tighter break-words drop-shadow-2xl">{homeData.title}</h1>
          <p className="text-xl text-slate-200 max-w-2xl mx-auto mb-10 font-light drop-shadow-md">{homeData.subtitle}</p>
          <div className="flex flex-col items-center mt-6 gap-4">
            <div className="flex flex-wrap justify-center gap-4">
             <a href="#book" className="px-8 py-4 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(5,150,105,0.4)] text-sm md:text-base bg-emerald-600 text-white hover:bg-emerald-500 hover:-translate-y-1">{t('bookBtn')}</a>
             <a href="#catalog" onClick={() => setActiveCategory('shop')} className={`px-8 py-4 rounded-full font-bold transition-all shadow-lg text-sm md:text-base hover:-translate-y-1 ${activeCategory === 'shop' ? 'bg-blue-600 text-white' : 'bg-slate-800/80 backdrop-blur border border-white/10 text-slate-300 hover:bg-slate-700'}`}>{t('shopTitle')}</a>
             <a href="#catalog" onClick={() => setActiveCategory('education')} className={`px-8 py-4 rounded-full font-bold transition-all shadow-lg text-sm md:text-base hover:-translate-y-1 ${activeCategory === 'education' ? 'bg-purple-600 text-white' : 'bg-slate-800/80 backdrop-blur border border-white/10 text-slate-300 hover:bg-slate-700'}`}>{t('educationTitle')}</a>
            </div>
            {currentUser && !currentUser.isHost && currentUser.hasChat && !currentUser.blockChat && (
               <a href="#catalog" onClick={() => setActiveCategory('chat')} className={`px-8 py-3 rounded-full font-bold transition-all shadow-lg text-sm md:text-base mt-2 hover:-translate-y-1 ${activeCategory === 'chat' ? 'bg-indigo-600 text-white' : 'bg-slate-800/80 backdrop-blur border border-white/10 text-slate-300 hover:bg-slate-700'}`}><MessageCircle size={20} className="inline mr-2 -mt-1"/>{t('studentChat')}</a>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1">
        <section className="py-24 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-light text-white mb-6 tracking-tight">{homeData.aboutTitle}</h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">{homeData.aboutText}</p>
            <button onClick={() => setDescModal(true)} className="flex items-center gap-2 text-blue-400 font-bold hover:text-blue-300 transition-colors group">
              {t('viewDetails')} <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform"/>
            </button>
          </div>
          <div className="bg-slate-900/50 rounded-[3rem] p-8 border border-white/5 hidden md:block shadow-inner">
              <div className="space-y-4">
                  {fullDescription.sections.slice(0, 3).map((s, i) => (
                      <div key={i} className="flex gap-4 items-start"><div className="bg-blue-500/10 p-2 rounded-full shrink-0 mt-1"><Check className="text-blue-500" size={16}/></div><span className="text-slate-300 text-sm leading-relaxed"><b>{s.title}:</b> {s.text.substring(0, 80)}...</span></div>
                  ))}
              </div>
          </div>
        </section>

        {/* E-COMMERCE КАТАЛОГ УСЛУГ & ПУТЕВОДИТЕЛЕЙ & ЧАТ */}
        <section id="catalog" className="py-24 bg-slate-900/30 border-y border-white/5">
          <div className="max-w-6xl mx-auto px-6 space-y-12">
            
            {activeCategory === 'shop' && (
            <div className="animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {publicData.products.map(product => (
                  <div key={product.id} className="bg-slate-800/60 backdrop-blur rounded-[2rem] border border-white/10 overflow-hidden shadow-xl hover:-translate-y-2 transition-transform relative">
                      <div className="absolute top-4 right-4 bg-blue-600/90 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-lg">{getProductType(product)}</div>
                      <div className="h-52 overflow-hidden relative"><MediaCarousel media={product.images} type="image" /></div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-2">{getTranslated(product, 'name')}</h3>
                        <p className="text-slate-400 text-sm mb-4 h-10">{getTranslated(product, 'desc')}</p>
                        <div className="mt-6 flex flex-col h-full">
                          <button onClick={() => setPresentationModal({...product, pType: 'product'})} className="w-full mb-3 bg-slate-700/50 hover:bg-slate-600 py-3 rounded-xl text-white font-bold text-sm transition-colors border border-white/10">{t('presentationBtn')}</button>
                          <LegalCheckboxes />
                          <div className="flex justify-between items-center mt-4">
                              <span className="text-2xl font-bold text-green-400 drop-shadow-md">{product.price[activeCurrency.toLowerCase()] || product.price.eur || 0} {CURRENCY_SYMBOLS[activeCurrency]}</span>
                              <button disabled={!agreedKVKK || !agreedContract || !agreedPrivacy} onClick={() => handleProductPurchase(product.price[activeCurrency.toLowerCase()] || product.price.eur || 0, 'product')} className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 px-5 py-3 rounded-xl text-white font-bold text-sm flex items-center gap-2 shadow-lg"><ShoppingBag size={18}/> {t('productBuy')}</button>
                          </div>
                        </div>
                      </div>
                  </div>
                ))}
              </div>
            </div>
            )}

            {activeCategory === 'education' && (
            <div className="animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {publicData.courses.map(course => (
                  <div key={course.id} className="bg-slate-800/60 backdrop-blur rounded-[2rem] border border-white/10 overflow-hidden shadow-xl hover:-translate-y-2 transition-transform relative">
                      <div className="absolute top-4 right-4 bg-purple-600/90 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-lg">{t('courseType')}</div>
                      <div className="h-52 overflow-hidden relative"><MediaCarousel media={course.images} type="image" /></div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-2">{getTranslated(course, 'name')}</h3>
                        <p className="text-slate-400 text-sm mb-4 h-10">{getTranslated(course, 'desc')}</p>
                        <div className="mt-6 flex flex-col h-full">
                          <button onClick={() => setPresentationModal({...course, pType: 'course'})} className="w-full mb-3 bg-slate-700/50 hover:bg-slate-600 py-3 rounded-xl text-white font-bold text-sm transition-colors border border-white/10">{t('presentationBtn')}</button>
                          <LegalCheckboxes />
                          <div className="flex justify-between items-center mt-4">
                              <span className="text-2xl font-bold text-green-400 drop-shadow-md">{course.price[activeCurrency.toLowerCase()] || course.price.eur || 0} {CURRENCY_SYMBOLS[activeCurrency]}</span>
                              <button disabled={!agreedKVKK || !agreedContract || !agreedPrivacy} onClick={() => handleProductPurchase(course.price[activeCurrency.toLowerCase()] || course.price.eur || 0, 'course')} className="bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 disabled:text-slate-500 px-5 py-3 rounded-xl text-white font-bold text-sm flex items-center gap-2 shadow-lg"><PlayCircle size={18}/> {t('courseStart')}</button>
                          </div>
                        </div>
                      </div>
                  </div>
                ))}
              </div>
            </div>
            )}

            {activeCategory === 'chat' && currentUser && !currentUser.isHost && currentUser.hasChat && !currentUser.blockChat && (
              <div className="animate-in fade-in duration-500 max-w-4xl mx-auto px-4 md:px-0">
                <div className="bg-slate-900 border border-white/10 shadow-2xl w-full rounded-[2rem] flex flex-col relative transition-all overflow-hidden h-[600px]">
                   <div className="bg-slate-800 p-5 border-b border-white/10 flex justify-between items-center z-10">
                       <span className="text-white font-bold flex items-center gap-3"><MessageCircle size={20} className="text-blue-400"/> {t('chatHeader')}</span>
                   </div>
                   
                   <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950/50 flex flex-col shadow-inner">
                      {chatMessages.map((msg, i) => (
                        <div key={i} className={`flex flex-col ${msg.sender === currentUser.name ? 'items-end' : 'items-start'}`}>
                          <span className="text-[10px] text-slate-500 mb-1.5 uppercase tracking-widest">{msg.sender} {msg.sender === currentUser.name ? `(${currentUser.contact})` : ''} • {msg.date}</span>
                          <div className={`p-4 max-w-[85%] text-sm whitespace-pre-wrap break-all overflow-hidden shadow-md ${msg.sender === currentUser.name ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm' : 'bg-slate-800 text-slate-200 rounded-2xl rounded-tl-sm border border-white/5'}`}>
                            {msg[lang] || msg.original}
                            {msg.file && msg.file !== '' && (<div className="mt-3 text-xs font-bold text-blue-200 bg-black/20 p-2.5 rounded-xl w-fit break-words flex items-center gap-2"><Paperclip size={14}/> {msg.file}</div>)}
                          </div>
                        </div>
                      ))}
                      <div ref={chatBottomRef} />
                   </div>
                   
                   <form onSubmit={handleSendMessage} className="p-4 bg-slate-800 border-t border-white/10 flex flex-col gap-2 z-10">
                       {chatFile && (<div className="flex justify-between items-center bg-slate-900 p-3 rounded-xl border border-white/10 text-xs"><span className="truncate pr-2 text-slate-300 flex items-center gap-2"><Paperclip size={14}/>{chatFile.name}</span><button type="button" onClick={() => setChatFile(null)} className="text-red-400 hover:text-red-300 bg-red-400/10 p-1.5 rounded-md transition-colors"><X size={14}/></button></div>)}
                       <div className="flex gap-3">
                         <label className="cursor-pointer bg-slate-900 hover:bg-slate-700 p-4 rounded-2xl flex justify-center items-center text-slate-300 shrink-0 transition-colors shadow-inner"><Paperclip size={20} /><input type="file" className="hidden" onChange={handleFileAttach} /></label>
                         <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder={t('messagePlaceholder')} className="flex-1 bg-slate-900 border border-slate-700 rounded-2xl px-5 text-sm text-white outline-none focus:border-blue-500 transition-colors shadow-inner min-w-0" />
                         <button disabled={chatLoading} type="submit" className="bg-blue-600 hover:bg-blue-500 p-4 rounded-2xl text-white flex justify-center items-center min-w-[60px] shrink-0 transition-all shadow-lg disabled:opacity-50"><Send size={20} className={chatLoading ? 'animate-pulse' : ''}/></button>
                       </div>
                   </form>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* БЛОК БРОНИРОВАНИЯ ВИЛЛЫ С КАСТОМНЫМ КАЛЕНДАРЕМ */}
        <section id="book" className="py-24 max-w-4xl mx-auto px-6 flex flex-col gap-12 overflow-hidden relative">
          <div className="bg-slate-900/60 p-6 md:p-16 rounded-[2rem] md:rounded-[3.5rem] border border-white/10 shadow-2xl w-full box-border backdrop-blur">
            <div className="text-center mb-12 border-b border-white/10 pb-10">
              <h2 className="text-4xl font-light text-white mb-6 tracking-tight">{t('bookingTitle')}</h2>
              <div className="flex justify-center gap-8 text-sm text-slate-400 bg-slate-800/50 w-fit mx-auto px-6 py-3 rounded-full border border-white/5">
                <span className="flex items-center gap-2 font-medium"><Clock size={16} className="text-blue-400"/> {t('checkIn')}: {dynamicRules.checkInTime || SITE_CONFIG.checkInTime}</span>
                <span className="flex items-center gap-2 font-medium"><Clock size={16} className="text-blue-400"/> {t('checkOut')}: {dynamicRules.checkOutTime || SITE_CONFIG.checkOutTime}</span>
              </div>
            </div>
            
            <form onSubmit={handleBooking} className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left w-full relative z-20">
              {!currentUser && (
                <>
                  <div className="space-y-2"><label className="text-xs uppercase tracking-widest text-slate-500 ml-2 font-bold">{t('name')}</label><input name="name" required placeholder="Ivan Ivanov" className="w-full bg-slate-800/80 border border-slate-700 p-5 rounded-2xl focus:border-blue-500 outline-none transition-all text-base box-border text-white shadow-inner" /></div>
                  <div className="space-y-2"><label className="text-xs uppercase tracking-widest text-slate-500 ml-2 font-bold">{t('contact')}</label><input name="contact" required placeholder="@tg / +90..." className="w-full bg-slate-800/80 border border-slate-700 p-5 rounded-2xl focus:border-blue-500 outline-none transition-all text-base box-border text-white shadow-inner" /></div>
                </>
              )}
              
              {/* Задача 1.1 Календарь на всю ширину (md:col-span-2) */}
              <div className={`space-y-2 w-full md:col-span-2 relative`}>
                <div className="flex justify-between items-center ml-2">
                    <label className="text-xs uppercase tracking-widest text-slate-500 font-bold">{t('dates')}</label>
                    {startDate && <button type="button" onClick={() => setDateRange([null, null])} className="text-[10px] bg-red-900/30 text-red-400 hover:text-red-300 border border-red-500/20 px-2 py-1 rounded-md font-bold uppercase transition-colors">{t('clearDatesBtn') || 'Сбросить'}</button>}
                </div>
                
                {/* Триггер Кастомного Календаря */}
                <div onClick={() => setIsGuestCalendarOpen(!isGuestCalendarOpen)} className={`w-full bg-slate-800/80 border ${isGuestCalendarOpen ? 'border-blue-500' : 'border-slate-700 hover:border-blue-500/50'} p-5 rounded-2xl text-white outline-none font-bold text-lg md:text-xl uppercase cursor-pointer box-border flex items-center justify-between transition-all shadow-inner`}>
                   <span>{startDate && endDate ? `${format(startDate, 'dd.MM.yy')} — ${format(endDate, 'dd.MM.yy')}` : startDate ? `${format(startDate, 'dd.MM.yy')} — ...` : t('selectDatesPrompt') || 'Выберите даты'}</span>
                   <CalendarIcon className={`${isGuestCalendarOpen ? 'text-blue-400' : 'text-slate-500'}`} size={24}/>
                </div>
                
                {/* Кастомный Встроенный Календарь */}
                <div className={`absolute top-[85px] left-0 right-0 z-[100] bg-slate-900 border border-blue-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[2rem] overflow-hidden transition-all duration-300 origin-top ${isGuestCalendarOpen ? 'opacity-100 scale-100 h-auto p-4 md:p-6' : 'opacity-0 scale-95 h-0 p-0 pointer-events-none'}`}>
                   <div className="flex justify-between items-center mb-6 bg-slate-800/50 p-2 rounded-2xl border border-white/5">
                      <button type="button" onClick={() => setGuestCurrentMonth(addMonths(guestCurrentMonth, -1))} className="p-3 bg-slate-700 rounded-xl hover:bg-blue-600 text-white transition-colors shadow-md"><ChevronLeft size={20}/></button>
                      <button type="button" onClick={() => setIsGuestCalendarOpen(false)} className="text-slate-400 hover:text-white p-2 font-bold text-xs uppercase tracking-widest bg-slate-800 rounded-xl transition-colors px-4 border border-white/5">{t('cancelBtn')}</button>
                      <button type="button" onClick={() => setGuestCurrentMonth(addMonths(guestCurrentMonth, 1))} className="p-3 bg-slate-700 rounded-xl hover:bg-blue-600 text-white transition-colors shadow-md"><ChevronRight size={20}/></button>
                   </div>
                   
                   <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-center">
                       <div className="w-full md:w-1/2 bg-slate-950/50 p-4 rounded-2xl border border-white/5 shadow-inner">{renderGuestMonth(guestCurrentMonth)}</div>
                       <div className="w-full md:w-1/2 hidden md:block bg-slate-950/50 p-4 rounded-2xl border border-white/5 shadow-inner">{renderGuestMonth(addMonths(guestCurrentMonth, 1))}</div>
                   </div>
                   
                   <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap gap-4 text-[10px] text-slate-400 justify-center uppercase tracking-widest font-bold">
                       <span className="flex items-center gap-2"><span className="w-4 h-4 bg-slate-900 line-through opacity-50 border border-transparent rounded"></span> Занято</span>
                       <span className="flex items-center gap-2"><span className="w-4 h-4 border-l-red-500 border-l-2 bg-slate-800 rounded"></span> {t('tooltipCheckoutOnly')}</span>
                       <span className="flex items-center gap-2"><span className="w-4 h-4 bg-yellow-500/10 border border-yellow-500/50 border-dashed rounded"></span> Мин. ночей</span>
                   </div>
                </div>
              </div>

              {/* Задача 1.1 Поля количества гостей строго под календарем в два ряда (ширина 100%) */}
              <div className="space-y-2 w-full md:col-span-2">
                <label className="text-xs uppercase tracking-widest text-slate-500 ml-2 font-bold">{t('adults')}</label>
                <select value={adults} onChange={(e) => setAdults(parseInt(e.target.value))} className="w-full bg-slate-800/80 border border-slate-700 p-5 rounded-2xl text-white outline-none text-base box-border shadow-inner font-bold appearance-none cursor-pointer">
                  {[...Array(SITE_CONFIG.maxTotalGuests + 1).keys()].slice(1).map(n => (<option key={n} value={n} disabled={n + children > SITE_CONFIG.maxTotalGuests}>{n}</option>))}
                </select>
              </div>
              
              <div className="space-y-2 w-full md:col-span-2">
                <label className="text-xs uppercase tracking-widest text-slate-500 ml-2 font-bold">{t('children')}</label>
                <select value={children} onChange={(e) => setChildren(parseInt(e.target.value))} className="w-full bg-slate-800/80 border border-slate-700 p-5 rounded-2xl text-white outline-none text-base box-border shadow-inner font-bold appearance-none cursor-pointer">
                  {[...Array(SITE_CONFIG.maxTotalGuests).keys()].map(n => (<option key={n} value={n} disabled={n + adults > SITE_CONFIG.maxTotalGuests}>{n}</option>))}
                </select>
              </div>

              {startDate && endDate && (
                <div className="md:col-span-2 mt-6 bg-slate-800 border border-slate-600 p-8 rounded-3xl flex flex-col md:flex-row justify-between items-center shadow-[0_0_20px_rgba(0,0,0,0.3)] transform transition-all hover:scale-[1.01]">
                   <span className="text-lg text-slate-400 font-bold mb-2 md:mb-0 uppercase tracking-widest">{t('totalPrice')}</span>
                   <span className="text-5xl font-extrabold text-green-400 drop-shadow-lg tracking-tighter">{calculateTotalPrice()} <span className="text-3xl text-green-500/70">{CURRENCY_SYMBOLS[activeCurrency]}</span></span>
                </div>
              )}
              
              {isShortStay && (
                  <div className="md:col-span-2 mt-4 bg-yellow-500/10 border border-yellow-500/30 p-5 rounded-2xl shadow-inner flex items-start gap-4">
                     <div className="bg-yellow-500/20 p-2 rounded-full shrink-0 mt-1"><Info className="text-yellow-400" size={20}/></div>
                     <div>
                         <p className="text-yellow-400 text-sm font-bold leading-relaxed">{t('shortStayWarning').replace('{n}', nightsCount).replace('{min}', currentMinNights)}</p>
                     </div>
                  </div>
              )}
              
              <div className="md:col-span-2 mt-4 bg-slate-950/50 p-6 rounded-2xl border border-white/5 shadow-inner">
                <LegalCheckboxes />
              </div>
              
              <div className="md:col-span-2 mt-4 w-full">
                <button type="submit" disabled={status === 'loading' || !agreedKVKK || !agreedContract || !agreedPrivacy} className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:border-slate-700 disabled:border py-6 rounded-2xl font-bold text-2xl text-white shadow-[0_10px_20px_rgba(37,99,235,0.3)] transition-all active:scale-[0.98] box-border flex justify-center items-center gap-3 tracking-wide">
                  {status === 'loading' ? <span className="animate-pulse">{t('loading')}</span> : (effectiveBookingMode === 'manual' ? t('sendRequestBtn') : <>{t('payBtn')} <ChevronRight size={24}/></>)}
                </button>
              </div>
            </form>

            <div className="mt-16 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-[10px] md:text-xs uppercase tracking-widest text-slate-500">
              <div className="flex flex-col gap-2 items-center text-center"><span className="text-slate-400 font-bold">{t('minNights')}</span><span className="text-white font-mono text-base bg-slate-800 px-3 py-1 rounded-lg border border-white/5">{dynamicRules.minNights}</span></div>
              <div className="flex flex-col gap-2 items-center text-center"><span className="text-slate-400 font-bold">{t('bookingWindow')}</span><span className="text-white font-mono text-base bg-slate-800 px-3 py-1 rounded-lg border border-white/5">{dynamicRules.bookingWindowMonths} {t('monthsAbbr')}</span></div>
              <div className="flex flex-col gap-2 items-center text-center"><span className="text-slate-400 font-bold">{t('advanceNotice')}</span><span className="text-white font-mono text-base bg-slate-800 px-3 py-1 rounded-lg border border-white/5">{getNoticeText(dynamicRules.advanceNoticeDays)}</span></div>
              <div className="flex flex-col gap-2 items-center text-center"><span className="text-slate-400 font-bold">{t('maxGuests')}</span><span className="text-white font-mono text-base bg-slate-800 px-3 py-1 rounded-lg border border-white/5">{SITE_CONFIG.maxTotalGuests}</span></div>
            </div>
          </div>
        </section>

        {/* ГАЛЕРЕЯ */}
        <section className="py-24 bg-slate-900/30 border-t border-white/5">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-light text-white mb-16 tracking-tight">{t('galleryTitle')}</h2>
            <div className="flex flex-col gap-20 text-left">
              {publicData.gallery && publicData.gallery.length > 0 ? (
                 Object.values(publicData.gallery.reduce((acc, item) => {
                    const grp = getTranslated(item, 'group') || 'Основная галерея';
                    if (!acc[grp]) acc[grp] = { group: item.group, desc: item.groupDesc, items: [] };
                    acc[grp].items.push(item); return acc;
                 }, {})).map((gObj, gIdx) => (
                    <div key={gIdx} className="w-full">
                       <div className="mb-10 text-center">
                           {getTranslated(gObj, 'group') && <h3 className="text-3xl font-bold text-white mb-4 inline-block pb-2 border-b-2 border-blue-500">{getTranslated(gObj, 'group')}</h3>}
                           {getTranslated(gObj, 'desc') && <p className="text-slate-400 max-w-2xl mx-auto text-sm">{getTranslated(gObj, 'desc')}</p>}
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {gObj.items.map(item => (
                             <div key={item.id} className="bg-slate-800/50 backdrop-blur rounded-[2rem] border border-white/5 overflow-hidden shadow-xl flex flex-col hover:-translate-y-2 transition-transform">
                                <div className="h-[300px] w-full relative overflow-hidden"><MediaCarousel media={item.media} type={item.type} /></div>
                                {getTranslated(item, 'caption') && <div className="p-6 bg-slate-900/50 flex-1 flex items-center justify-center text-center border-t border-white/5"><p className="text-slate-300 text-sm leading-relaxed">{getTranslated(item, 'caption')}</p></div>}
                             </div>
                          ))}
                       </div>
                    </div>
                 ))
              ) : (<div className="text-center text-slate-500 font-medium w-full bg-slate-800/30 py-10 rounded-3xl border border-white/5">Галерея в процессе наполнения...</div>)}
            </div>
          </div>
        </section>
      </div>

      <footer className="w-full mt-20 pt-16 pb-12 px-6 border-t border-white/10 bg-slate-950 text-slate-400 text-sm">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-10">
          <div className="flex flex-col gap-4 text-center lg:text-left">
            <h4 className="text-white font-bold text-lg mb-2">{contentData.legal.legal_info_title?.[lang] || t('legalInfo')}</h4>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-4">
              <Link href="/legal/contract" className="hover:text-blue-400 transition-colors bg-slate-900 px-4 py-2 rounded-xl border border-white/5 shadow-inner">{contentData.legal.contract?.title?.[lang] || t('linkContract')}</Link>
              <Link href="/legal/kvkk" className="hover:text-blue-400 transition-colors bg-slate-900 px-4 py-2 rounded-xl border border-white/5 shadow-inner">{contentData.legal.kvkk?.title?.[lang] || t('linkKVKK')}</Link>
              <Link href="/legal/privacy" className="hover:text-blue-400 transition-colors bg-slate-900 px-4 py-2 rounded-xl border border-white/5 shadow-inner">{contentData.legal.privacy?.title?.[lang] || t('linkPrivacy')}</Link>
              <Link href="/legal/cancellation" className="hover:text-blue-400 transition-colors bg-slate-900 px-4 py-2 rounded-xl border border-white/5 shadow-inner">{contentData.legal.cancellation?.title?.[lang] || t('linkCancellation')}</Link>
            </div>
            <div className="space-y-2 text-xs md:text-sm bg-slate-900/50 p-6 rounded-2xl border border-white/5 inline-block">
              <p><strong className="text-slate-300">Ticari Ünvan:</strong> {contentData.legal.company_name?.text?.[lang] || contentData.legal.company_name?.text?.ru}</p>
              <p><strong className="text-slate-300">Vergi Dairesi ve No:</strong> {contentData.legal.tax_info?.text?.[lang] || contentData.legal.tax_info?.text?.ru}</p>
              <p><strong className="text-slate-300">İletişim:</strong> {contentData.legal.contact_email?.text?.[lang] || contentData.legal.contact_email?.text?.ru}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-4">
            <div className="border border-dashed border-slate-700 p-6 rounded-3xl flex flex-col items-center justify-center text-xs w-48 h-48 bg-slate-900/50 relative overflow-hidden shadow-inner">
               <span className="text-slate-500 text-center mb-2 whitespace-pre-wrap">{contentData.legal.etbis_placeholder?.text?.[lang] || contentData.legal.etbis_placeholder?.text?.ru || t('etbisPlaceholder')}</span>
            </div>
            <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500 bg-slate-900 px-3 py-1 rounded-lg border border-white/5">{contentData.legal.etbis_text?.text?.[lang] || contentData.legal.etbis_text?.ru || t('etbisText')}</span>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-white/5 text-center flex flex-col gap-2">
          <p className="text-xs text-slate-600 font-medium">© {new Date().getFullYear()} ALEKSEI ZNAMENSKII - Villa Turaman.</p>
        </div>
      </footer>

      {/* МОДАЛКИ */}
      {authMode !== 'none' && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 overflow-hidden">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setAuthMode('none')}></div>
          <div className="relative bg-slate-900 border border-blue-500/20 w-full max-w-md p-8 md:p-10 rounded-[2rem] shadow-[0_0_50px_rgba(37,99,235,0.15)] overflow-y-auto max-h-[90vh] box-border">
            <button onClick={() => setAuthMode('none')} className="absolute top-6 right-6 text-slate-500 hover:text-white bg-slate-800 p-2 rounded-full transition-colors"><X size={20}/></button>
            <h2 className="text-2xl font-bold text-white mb-8 tracking-wide">{authMode === 'register' ? t('register') : t('login')}</h2>
            <form onSubmit={(e) => handleAuthSubmit(e, null, null, authMode)} className="space-y-6 w-full">
              {authMode === 'register' && (<div className="w-full"><label className="text-[10px] uppercase tracking-widest text-slate-500 block mb-2 font-bold ml-1">{t('name')}</label><input name="name" required className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-base text-white outline-none focus:border-blue-500 shadow-inner transition-colors" /></div>)}
              <div className="w-full"><label className="text-[10px] uppercase tracking-widest text-slate-500 block mb-2 font-bold ml-1">{t('contact')}</label><input name="contact" required className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-base text-white outline-none focus:border-blue-500 shadow-inner transition-colors" /></div>
              <div className="w-full"><label className="text-[10px] uppercase tracking-widest text-slate-500 block mb-2 font-bold ml-1">{t('passwordLabel')}</label><input name="password" type="password" required className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-base text-white outline-none focus:border-blue-500 shadow-inner transition-colors" /></div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold text-white text-lg shadow-lg transition-transform active:scale-[0.98]">{authMode === 'register' ? t('register') : t('login')}</button>
            </form>
          </div>
        </div>
      )}

      {pendingHostUser && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 overflow-hidden">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md" onClick={() => setPendingHostUser(null)}></div>
          <div className="relative bg-slate-900 border border-red-500/30 w-full max-w-md p-8 md:p-10 rounded-[2rem] shadow-[0_0_50px_rgba(239,68,68,0.15)] text-center box-border">
            <button onClick={() => setPendingHostUser(null)} className="absolute top-6 right-6 text-slate-500 hover:text-white bg-slate-800 p-2 rounded-full transition-colors"><X size={20}/></button>
            <h2 className="text-2xl font-bold text-white mb-2 tracking-wide flex items-center justify-center gap-2"><Lock className="text-red-500" size={24}/> {t('adminCrmGuardTitle')}</h2>
            <p className="text-xs text-slate-400 mb-8">{t('adminCrmGuardSubtitle')}</p>
            
            {!twoFaSecret ? (
               <div className="bg-red-900/30 text-red-400 p-4 rounded-xl text-xs mb-6 border border-red-500/30">{t('error_2fa_secret_not_found')}</div>
            ) : (
              qrCodeUrl && (
                <div className="bg-white p-4 rounded-2xl inline-block mb-8 shadow-inner">
                  <img src={qrCodeUrl} alt="2FA QR Code" className="w-40 h-40" />
                  <p className="text-[10px] text-slate-800 font-mono mt-2 select-all font-bold bg-slate-100 py-1 rounded">Secret: {twoFaSecret}</p>
                </div>
              )
            )}
            
            <form onSubmit={handleVerify2FA} className="space-y-6 w-full">
              <div>
                <label className="block text-left text-[10px] uppercase tracking-widest text-slate-500 mb-2 font-bold ml-1">{t('twoFaCodeLabel')}</label>
                <input type="text" maxLength={6} value={twoFaInput} onChange={(e) => setTwoFaInput(e.target.value)} placeholder="000000" className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-2xl tracking-[0.5em] text-center text-white outline-none focus:border-red-500 font-mono shadow-inner transition-colors" required disabled={!twoFaSecret} />
              </div>
              {twoFaError && <p className="text-red-500 text-xs font-bold bg-red-900/30 py-2 rounded-lg">{twoFaError}</p>}
              <button type="submit" disabled={!twoFaSecret} className="w-full bg-red-600 hover:bg-red-500 py-4 rounded-xl font-bold text-white text-sm tracking-wider shadow-lg disabled:opacity-50 transition-transform active:scale-[0.98]">{t('verifyBtn')}</button>
            </form>
          </div>
        </div>
      )}

      {galleryModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md" onClick={() => setGalleryModal(false)}></div>
          <div className="relative bg-slate-900 border border-white/10 w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-[3rem] flex flex-col shadow-2xl">
            <button onClick={() => setGalleryModal(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white z-10 bg-slate-800 p-3 rounded-full"><X size={24}/></button>
            <div className="p-8 border-b border-white/5 flex gap-4 overflow-x-auto">
              {roomGalleries.map(cat => (
                <button key={cat.id} onClick={() => { setActiveCategory(cat.id); setLightboxIndex(null); }} className={`px-6 py-3 rounded-full transition-all whitespace-nowrap font-bold text-sm ${activeCategory === cat.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {currentImages.map((img, i) => (
                <div key={i} onClick={() => setLightboxIndex(i)} className="rounded-[2rem] overflow-hidden h-[300px] border border-white/5 cursor-zoom-in group relative shadow-lg">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                  <img src={img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/98 backdrop-blur-sm">
          <button onClick={() => setLightboxIndex(null)} className="absolute top-8 right-8 text-white/50 hover:text-white z-50 bg-white/10 p-3 rounded-full transition-colors"><X size={24}/></button>
          <button onClick={prevPhoto} className="absolute left-4 md:left-10 p-4 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"><ChevronLeft size={32}/></button>
          <img src={currentImages[lightboxIndex]} className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]" alt="Gallery"/>
          <button onClick={nextPhoto} className="absolute right-4 md:right-10 p-4 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"><ChevronRight size={32}/></button>
        </div>
      )}

      {descModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setDescModal(false)}></div>
          <div className="relative bg-slate-900 border border-white/10 w-full max-w-4xl max-h-[80vh] overflow-y-auto rounded-[3rem] p-10 md:p-16 shadow-2xl">
            <button onClick={() => setDescModal(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white bg-slate-800 p-3 rounded-full transition-colors"><X size={24}/></button>
            <h2 className="text-4xl font-light text-white mb-12 tracking-tight border-b border-white/10 pb-6">{homeData.aboutTitle}</h2>
            <div className="space-y-12">
              {fullDescription.sections.map((s, i) => (
                <div key={i} className="border-l-4 border-blue-500 pl-8 py-2 bg-gradient-to-r from-slate-800/50 to-transparent rounded-r-3xl">
                  <h3 className="text-2xl font-bold text-white mb-4">{s.title}</h3>
                  <p className="text-slate-400 leading-relaxed text-lg">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {presentationModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-10">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md" onClick={() => setPresentationModal(null)}></div>
          <div className="relative bg-slate-900 border border-white/10 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl flex flex-col md:flex-row">
            <button onClick={() => setPresentationModal(null)} className="absolute top-6 right-6 text-slate-500 hover:text-white z-50 bg-slate-900 p-3 rounded-full border border-white/10 shadow-lg transition-colors"><X size={24}/></button>
            <div className="w-full md:w-1/2 flex flex-col bg-slate-950 rounded-t-[3rem] md:rounded-l-[3rem] md:rounded-tr-none border-b md:border-b-0 md:border-r border-white/5 overflow-hidden">
              <div className="h-[350px] md:h-full w-full"><MediaCarousel media={presentationModal.images} type="image" /></div>
            </div>
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between">
               <div>
                 <div className={`inline-block px-4 py-1.5 text-xs font-bold rounded-full mb-6 uppercase tracking-widest shadow-inner ${presentationModal.pType === 'course' ? 'bg-purple-900/30 text-purple-400 border border-purple-500/20' : 'bg-blue-900/30 text-blue-400 border border-blue-500/20'}`}>
                   {presentationModal.pType === 'product' ? getProductType(presentationModal) : t('courseType')}
                 </div>
                 <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">{getTranslated(presentationModal, 'name')}</h2>
                 <p className="text-slate-400 text-base md:text-lg mb-8 pb-8 border-b border-white/10 leading-relaxed">{getTranslated(presentationModal, 'desc')}</p>
                 
                 {presentationModal.detailedDesc && (presentationModal.detailedDesc[lang] || presentationModal.detailedDesc['ru']) && (
                   <div className="mb-10 bg-slate-800/30 p-6 rounded-2xl border border-white/5 shadow-inner">
                     <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Info size={18} className="text-blue-400"/> {t('detailsTitle')}</h3>
                     <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{presentationModal.detailedDesc[lang] || presentationModal.detailedDesc['ru']}</p>
                   </div>
                 )}
               </div>
               
               <div className="mt-auto bg-slate-800/80 p-8 rounded-[2rem] border border-white/5 shadow-2xl backdrop-blur">
                  <LegalCheckboxes />
                  <div className="flex justify-between items-center mb-8 mt-6">
                    <span className="text-sm text-slate-400 uppercase tracking-widest font-bold">{t('totalPrice')}</span>
                    <span className="text-4xl font-extrabold text-green-400 drop-shadow-md">{presentationModal.price[activeCurrency.toLowerCase()] || presentationModal.price.eur || 0} <span className="text-2xl text-green-500/70">{CURRENCY_SYMBOLS[activeCurrency]}</span></span>
                  </div>
                  <button disabled={!agreedKVKK || !agreedContract || !agreedPrivacy} onClick={() => { handleProductPurchase(presentationModal.price[activeCurrency.toLowerCase()] || presentationModal.price.eur || 0, presentationModal.pType); setPresentationModal(null); }} className={`w-full py-5 rounded-2xl text-white font-bold text-xl shadow-xl transition-transform active:scale-[0.98] flex justify-center items-center gap-3 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed ${presentationModal.pType === 'course' ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-900/30' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/30'}`}>
                    {presentationModal.pType === 'course' ? <PlayCircle size={24}/> : <ShoppingBag size={24}/>}
                    {presentationModal.pType === 'course' ? t('courseStart') : t('productBuy')}
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
EOF

# 20. ЧИСТАЯ ИНИЦИАЛИЗАЦИЯ РЕПОЗИТОРИЯ
rm -rf .git
git init -b main
git remote add origin https://github.com/znamenskiialeksei/Sitesi.git
git add .
git commit -m "Villa Turaman Platform: SSG, Dynamic Hero, Full CRM, UI Fixes, Chats Isolation, Content Prebuild"
git push origin main --force

echo "✅ Платформа Villa Turaman успешно собрана со всем функционалом! Проект отправлен на GitHub!"
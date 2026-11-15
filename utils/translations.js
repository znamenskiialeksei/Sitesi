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

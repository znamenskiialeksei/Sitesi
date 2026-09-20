// ==============================================================================
// НЕПРИКОСНОВЕННЫЙ МАСТЕР-ЭТАЛОН БАЗЫ ДАННЫХ И КОНТЕНТА VILLA TURAMAN
// Файл: utils/masterSeedContent.js
// Назначение: Эталонный источник истины [SSOT] для всех 15 листов Google Таблиц.
// Защищен от перезаписи извне. Обеспечивает 100% самоисцеление при удалении листов.
// ==============================================================================

const MASTER_ABOUT_SECTIONS = [
  {
    id: '1',
    title: {
      ru: 'О вилле и о нас',
      en: 'About the villa and about us',
      tr: 'Villa hakkında ve biz hakkında'
    },
    text: {
      ru: 'Вилла Turaman расположена в живописном маленьком городке Дальян в провинции Мугла [Турция] на берегу реки Дальян и озера Кёйджегиз. Готова принять 10 гостей путешественников. Приватный бассейн 36 квадратных метров и роскошная придомовая территория с террасой и садом. Адрес виллы: Rodoslu Yaşar Sünger Sk, NO 28/2, 48600 Ortaca / Muğla. Локация: https://maps.app.goo.gl/tPgCjCwz4pzq28pE9',
      en: 'Villa Turaman is located in the picturesque small town of Dalyan in the Muğla Province of Turkey, on the banks of the Dalyan River and Lake Köyceğiz. It can accommodate up to 10 guests. It features a private 36-square-meter pool and a luxurious courtyard with a terrace and garden. Address: Rodoslu Yaşar Sünger Sk, NO 28/2, 48600 Ortaca / Muğla. Location: https://maps.app.goo.gl/tPgCjCwz4pzq28pE9',
      tr: "Villa Turaman, Türkiye'nin Muğla ilinin pitoresk Dalyan kasabasında, Dalyan Nehri ve Köyceğiz Gölü kıyısında yer almaktadır. 10 kişiye kadar konaklama imkanı sunan villada, 36 metrekarelik özel bir havuz ve teraslı ve bahçeli lüks bir avlu bulunmaktadır. Adres: Rodoslu Yaşar Sünger Sk, NO 28/2, 48600 Ortaca / Muğla. Konum: https://maps.app.goo.gl/tPgCjCwz4pzq28pE9"
    }
  },
  {
    id: '2',
    title: {
      ru: 'Вместимость',
      en: 'Capacity',
      tr: 'Kapasite'
    },
    text: {
      ru: 'Вилла рассчитана максимум на 10 гостей [включая детей].',
      en: 'The villa can accommodate a maximum of 10 guests [including children].',
      tr: 'Villa en fazla 10 kişiyi [çocuklar dahil] ağırlayabilir.'
    }
  },
  {
    id: '3',
    title: {
      ru: 'Описание виллы',
      en: 'Description of the villa',
      tr: 'Villanın Tanımı'
    },
    text: {
      ru: 'Вилла находится в самом центре Дальяна. Вся компания оценит близость к достопримечательностям. Приватный бассейн. Полноценная кухня и гостиная комната. 4 большие спальни. Спальня на 1 этаже: рассчитана на 3 спальных места, располагает собственной ванной комнатой [душевая кабина] и кондиционером. Спальни на 2 этаже: три отдельные спальные комнаты по 2 спальных места, каждая со своей ванной комнатой и кондиционером. В одной из этих спален дополнительно установлена односпальная кровать [до 10 гостей].',
      en: 'The villa is located in the heart of Dalyan. The whole group will appreciate the proximity to attractions. It features a private pool, a full kitchen, and a living room. Four large bedrooms. The bedroom on the first floor sleeps three and has an en-suite bathroom [shower] and air conditioning. The bedrooms on the second floor include three separate bedrooms, each with its own bathroom and air conditioning. One of these bedrooms can accommodate an additional single bed [sleeps up to 10 guests].',
      tr: 'Villa, Dalyan merkezinde yer almaktadır. Tüm grup, turistik yerlere yakınlığı takdir edecektir. Villada özel havuz, tam donanımlı mutfak ve oturma odası bulunmaktadır. Dört geniş yatak odası mevcuttur. Birinci kattaki yatak odasında üç kişi konaklayabilir ve özel banyo [duş] ve klima bulunmaktadır. İkinci kattaki yatak odaları ise her biri kendi banyosuna ve klimasına sahip üç ayrı yatak odasından oluşmaktadır. Bu yatak odalarından birine ilave bir tek kişilik yatak eklenebilir [10 kişiye kadar konaklama imkanı].'
    }
  },
  {
    id: '4',
    title: {
      ru: 'Что доступно гостю',
      en: 'What is available to the guest?',
      tr: 'Misafirlerin kullanımına sunulan olanaklar nelerdir?'
    },
    text: {
      ru: 'Первый этаж:\nПолноценная кухня и гостиная комната.\n55-дюймовый смарт-телевизор.\nТуалет для гостей, стиральная машина, гладильная доска и утюг.\nСпальня на 3 спальных места с собственной ванной комнатой [душевая кабина].\nПрихожая со шкафом для уличной одежды.\nЛестница на второй этаж.\n\nВторой этаж:\n3 спальные комнаты, каждая из которых имеет собственную ванную комнату.\nДополнительное спальное место в виде односпальной кровати в одной из спален второго этажа.\nСтиральная машина в одной из ванных комнат.',
      en: 'First floor:\nFull kitchen and living room.\n55-inch smart TV.\nGuest toilet, washing machine, ironing board, and iron.\nTriple bedroom with en-suite bathroom [shower].\nEntrance hall with closet for outdoor clothing.\nStairs to the second floor.\n\nSecond floor:\nThree bedrooms, each with its own bathroom.\nAn additional single bed can be added in one of the second-floor bedrooms.\nWashing machine in one of the bathrooms.',
      tr: 'Birinci Kat:\nTam donanımlı mutfak ve oturma odası.\n55 inç akıllı TV.\nMisafir tuvaleti, çamaşır makinesi, ütü masası ve ütü.\nEn-suite banyolu [duşlu] üç kişilik yatak odası.\nDış giyim için dolaplı giriş holü.\nİkinci kata çıkan merdivenler.\n\nİkinci Kat:\nHer biri kendi banyosuna sahip üç yatak odası.\nİkinci kattaki yatak odalarından birine ilave tek kişilik yatak eklenebilir.\nBanyolardan birinde çamaşır makinesi.'
    }
  },
  {
    id: '5',
    title: {
      ru: 'Бассейн и Сад',
      en: 'Pool and Garden',
      tr: 'Havuz ve Bahçe'
    },
    text: {
      ru: 'Очистка бассейна и уход за садом проводятся рано утром с 8 до 10 часов.',
      en: 'Pool cleaning and garden maintenance are carried out early in the morning from 8 am to 10 am.',
      tr: 'Havuz temizliği ve bahçe bakımı sabah erken saatlerde, 08:00 ile 10:00 arasında yapılmaktadır.'
    }
  },
  {
    id: '6',
    title: {
      ru: 'Правила проживания',
      en: 'House Rules',
      tr: 'Ev Kuralları'
    },
    text: {
      ru: 'Заезд после 16:00, выезд до 10:00. Курение в помещениях виллы строго запрещено.',
      en: 'Check-in after 4:00 PM, check-out before 10:00 AM. Smoking is strictly prohibited in the villa.',
      tr: "Giriş saati 16:00'dan sonra, çıkış saati 10:00'dan öncedir. Villada sigara içmek kesinlikle yasaktır."
    }
  },
  {
    id: '7',
    title: {
      ru: 'Регистрация [KBS/KVKK]',
      en: 'Registration [KBS/KVKK]',
      tr: 'Kayıt [KBS/KVKK]'
    },
    text: {
      ru: 'Ваши данные защищены и используются исключительно для регистрации гостей в системе KBS согласно законам Турции.',
      en: 'Your data is protected and used solely for the purpose of registering guests in the KBS system in accordance with Turkish law.',
      tr: 'Verileriniz korunmaktadır ve Türk kanunlarına uygun olarak yalnızca KBS sistemine misafir kaydı amacıyla kullanılmaktadır.'
    }
  }
];

const MASTER_HOME_MAP = {
  heroTitle: {
    ru: 'Villa Turaman',
    en: 'Villa Turaman',
    tr: 'Villa Turaman',
    media: ''
  },
  heroSubtitle: {
    ru: 'Ваш идеальный отдых в Дальяне. Бронирование виллы, премиальный сервис и авторские видео-путеводители от Алексея Знаменского.',
    en: 'Your perfect Dalyan vacation. Villa reservations, premium service, and personalized video guides from Alexey Znamensky.',
    tr: "Mükemmel Dalyan tatiliniz. Alexey Znamensky'den villa rezervasyonları, birinci sınıf hizmet ve kişiselleştirilmiş video rehberleri.",
    media: ''
  },
  aboutTitle: {
    ru: 'О Вилле',
    en: 'About Villa',
    tr: 'Villa Hakkında',
    media: ''
  },
  aboutText: {
    ru: 'Villa Turaman: это гармоничное сочетание уединения, современного комфорта и первоклассного сервиса для незабываемого отпуска в сердце Дальяна.',
    en: 'Villa Turaman offers a harmonious combination of privacy, modern comfort and first-class service for an unforgettable holiday in the heart of Dalyan.',
    tr: "Villa Turaman, Dalyan'ın kalbinde unutulmaz bir tatil için mahremiyet, modern konfor ve birinci sınıf hizmetin uyumlu bir kombinasyonunu sunmaktadır.",
    media: ''
  },
  heroImage: {
    ru: 'Главные фотографии фасада и бассейна',
    en: 'Main facade and pool photos',
    tr: 'Ana cephe ve havuz fotoğrafları',
    media: 'https://drive.google.com/file/d/1NjSHRDa5eJpQTzO9268e8LMRzDVmYtX7/view?usp=sharing,https://drive.google.com/file/d/1IZMH6wtfLHZ6ibKHfmBhPGMFntZ_fXKU/view?usp=drive_link'
  },
  hostHeader: {
    ru: 'Отдельная вилла целиком • Хозяин: Алексей Знаменский',
    en: 'Entire villa • Host: Aleksei Znamenskii',
    tr: 'Müstakil villa tamamı • Ev Sahibi: Aleksei Znamenskii',
    media: ''
  },
  hostName: {
    ru: 'Алексей Знаменский',
    en: 'Aleksei Znamenskii',
    tr: 'Aleksei Znamenskii',
    media: ''
  },
  hostAvatar: {
    ru: 'Аватар владельца виллы',
    en: 'Host profile avatar',
    tr: 'Ev sahibi profil avatarı',
    media: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160'
  },
  highlightSuperhostTitle: {
    ru: 'Опытный Суперхозяин [Superhost]',
    en: 'Experienced Superhost',
    tr: 'Deneyimli Süper Ev Sahibi'
  },
  highlightSuperhostDesc: {
    ru: 'Алексей имеет рейтинг 4.98★ и стремится предоставить первоклассный сервис каждому гостю.',
    en: 'Aleksei has a 4.98★ rating and strives to provide top-notch service to every guest.',
    tr: 'Aleksei 4.98★ puana sahiptir ve her misafire birinci sınıf hizmet sunmayı hedefler.'
  },
  highlightCheckinTitle: {
    ru: 'Бесконтактное прибытие [Self check-in]',
    en: 'Self check-in',
    tr: 'Kendi Kendine Giriş'
  },
  highlightCheckinDesc: {
    ru: 'Удобный электронный замок и персональный код доступа для заселения в любое удобное время с 16:00.',
    en: 'Convenient electronic lock and personal code for check-in at any time after 4:00 PM.',
    tr: "Saat 16:00'dan sonra dilediğiniz zaman giriş için pratik elektronik kilit ve kişisel şifre."
  },
  highlightCancellationTitle: {
    ru: 'Бесплатная отмена за 14 дней',
    en: 'Free cancellation 14 days prior',
    tr: '14 gün öncesine kadar ücretsiz iptal'
  },
  highlightCancellationDesc: {
    ru: 'Полный возврат средств при отмене не позднее чем за 14 суток до даты заезда.',
    en: 'Full refund if cancelled at least 14 days before arrival date.',
    tr: 'Giriş tarihinden en az 14 gün önce yapılan iptallerde tam iade.'
  },
  locationTitle: {
    ru: 'Расположение: Дальян, Ортаджа, Мугла, Турция',
    en: 'Location: Dalyan, Ortaca, Mugla, Turkey',
    tr: 'Konum: Dalyan, Ortaca, Muğla, Türkiye',
    media: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200'
  },
  locationDesc: {
    ru: 'Вилла расположена в тихом зеленом районе в 5 минутах ходьбы от набережной реки Дальян. В пешей доступности рестораны традиционной эгейской кухни, лодочные причалы для поездок на пляж Изтузу и термальные грязевые источники Султание.',
    en: 'The villa is located in a quiet green area just a 5-minute walk from the Dalyan River promenade. Traditional Aegean restaurants, boat docks for trips to Iztuzu Beach, and Sultaniye mud springs are all within easy walking distance.',
    tr: 'Villa, Dalyan Nehri kordonuna 5 dakikalık yürüme mesafesinde, sessiz ve yeşil bir bölgede yer almaktadır. Geleneksel Ege restoranları, İztuzu Plajı tekne iskeleleri ve Sultaniye kaplıcaları yürüme mesafesindedir.'
  },
  bedroom_1: {
    ru: 'Спальня 1 • King Bed',
    en: 'Большая двуспальная кровать King Size, панорамные окна с видом на бассейн и сад, кондиционер',
    tr: 'King Bed',
    media: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600'
  },
  bedroom_2: {
    ru: 'Спальня 2 • Queen Bed',
    en: 'Уютная двуспальная кровать Queen Size, балкон с видом на горы, кондиционер',
    tr: 'Queen Bed',
    media: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600'
  },
  bedroom_3: {
    ru: 'Спальня 3 • 2 Односпальные',
    en: 'Две раздельные комфортные кровати, рабочий стол, вид на сад',
    tr: '2 Single Beds',
    media: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600'
  },
  bedroom_4: {
    ru: 'Спальня 4 • Диван-кровать',
    en: 'Раскладной ортопедический диван-кровать в лаундж-зоне, кондиционер',
    tr: 'Sofa Bed',
    media: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600'
  }
};

const MASTER_SETTINGS_ROWS = [
  // --- БЛОК 1: СИСТЕМНЫЕ ПАРАМЕТРЫ ЭКОСИСТЕМЫ ---
  ['СИСТЕМА', 'ai_mode', 'autopilot', 'Режим работы ИИ: autopilot [автоответ], copilot [суфлер хозяина], off [выключен]', 'Критический'],
  ['СИСТЕМА', 'ai_model', 'gemini-3.6-flash', 'Целевая модель Google Gemini: gemini-3.6-flash / gemini-2.5-flash', 'Высокая скорость'],
  ['СИСТЕМА', 'min_night_price', '180', 'Минимально допустимая цена за сутки бронирования в USD: ниже опускать запрещено', 'Финансовый барьер'],
  ['СИСТЕМА', 'telegram_bot_token', '', 'Токен Telegram-бота от BotFather для оповещений и мобильного пульта', 'Безопасность'],
  ['СИСТЕМА', 'telegram_admin_chat_id', '', 'ID чата суперхозяина в Telegram для получения алертов и модерации', 'Суперхозяин'],
  ['СИСТЕМА', 'vercel_url', 'https://sitesi-git-v1-airbnb-znamenskiialekseis-projects.vercel.app', 'Боевой URL платформы на Vercel для вебхуков и ревалидации', 'Синхронизация'],

  // --- БЛОК 2: ГЕНЕРАЛЬНЫЕ СИСТЕМНЫЕ ПРОМПТЫ РОЛЕЙ ---
  ['РОЛЬ_АГЕНТА', 'Консьерж-Мастер', 'АКТИВЕН', 'Ты: персональный ИИ-консьерж суперхозяина Алексея Знаменского на вилле Villa Turaman в Дальяне. Твоя миссия: гостеприимно, дипломатично и авторитетно отвечать гостям, презентовать приватный бассейн 36 кв.м, 4 спальни до 10 гостей, террасу и сад. Помогать с бронированием, предлагать доп. услуги [трансфер, шеф-повар, массаж, яхта] и авторские путеводители. Соблюдать правила дома, налоги Турции VKN 9991120181 и никогда не давать цену ниже $180 за ночь.', 'Главная роль'],
  ['РОЛЬ_АГЕНТА', 'Юрист-Консультант', 'РЕЗЕРВ', 'Ты: ведущий юрисконсульт Villa Turaman. Контролируешь правомерность краткосрочной аренды по законам Турции, обязательную регистрацию гостей в системе KBS жандармерии, соответствие закону о защите персональных данных KVKK и налоговое оформление VUK 213 Madde 230 e-Arşiv Fatura. Действуешь строго в рамках золотой формулы переговоров 30% эмпатии / 70% юридической дисциплины.', 'Правовой модуль'],
  ['РОЛЬ_АГЕНТА', 'Финансист-Бухгалтер', 'РЕЗЕРВ', 'Ты: главный финансовый менеджер Villa Turaman. Ведешь учет платежей, проверяешь поступления по банковским счетам, рассчитываешь мультивалютные цены EUR/RUB/TRY, применяешь скидку 10% за невозвратный тариф при заезде до 60 дней и блокируешь любые попытки несанкционированного занижения тарифа ниже $180.', 'Финансовый модуль'],

  // --- БЛОК 3: МАТРИЦА ДОСТУПА К ЛИСТАМ И КОНТЕКСТНЫЕ ПРОМПТЫ ---
  ['МАТРИЦА_ЛИСТОВ', '🏠 Главная витрина', 'РАЗРЕШЕН [ВСЕ]', 'Лист содержит главную витрину: заголовок hero, описание about, спецификации [10 гостей, 4 спальни, 6 кроватей, 4.5 ванных], статус Superhost и параметры спален 1-4. Агент использует эти данные для точного описания планировки виллы.', 'Витрина'],
  ['МАТРИЦА_ЛИСТОВ', '📸 Фото и Видео Галерея', 'РАЗРЕШЕН [ВСЕ]', 'Лист содержит медиа-банк виллы: ссылки на фото высокого разрешения и видеотуры бассейна, сада, комнат и видов на реку. Агент рекомендует гостям взглянуть на галерею для знакомства с уютом.', 'Медиа'],
  ['МАТРИЦА_ЛИСТОВ', '📖 О вилле и Правила', 'РАЗРЕШЕН [ВСЕ]', 'Лист содержит 7 фундаментальных разделов виллы: заезд после 16:00, выезд до 10:00, очистка бассейна с 8 до 10 утра, строгий запрет курения внутри помещений, правила тишины и регистрация KBS. Агент неукоснительно транслирует эти правила.', 'База знаний'],
  ['МАТРИЦА_ЛИСТОВ', '🛎️ Дополнительные услуги', 'РАЗРЕШЕН [ВСЕ]', 'Лист содержит каталог платных сервисов: трансферы из аэропорта Даламан DLM, персональный шеф-повар, массажи, прогулка на лодке, барбекю, аренда SUP-бордов. Агент активно предлагает эти услуги для повышения среднего чека.', 'Каталог услуг'],
  ['МАТРИЦА_ЛИСТОВ', '🗺️ Видео-путеводители', 'РАЗРЕШЕН [ВСЕ]', 'Лист содержит цифровые гиды по Дальяну, пляжу Изтузу, озеру Кёйджегиз, ресторанам и античному Кауносу. Агент презентует гиды как уникальный авторский контент от суперхозяина.', 'Каталог гидов'],
  ['МАТРИЦА_ЛИСТОВ', '⚖️ Юридические документы', 'РАЗРЕШЕН [ВСЕ]', 'Лист содержит официальный договор аренды, политику KVKK, реквизиты VKN 9991120181. Агент ссылается на эти пункты при возникновении споров, вопросах о налогах или подтверждении легальности.', 'Юриспруденция'],
  ['МАТРИЦА_ЛИСТОВ', '📋 Заявки и Бронирования', 'РАЗРЕШЕН [ВСЕ]', 'Лист фиксирует статус заявок гостей, даты заезда и выезда, число гостей и статус оплаты. Агент проверяет информацию о бронировании перед персональным обращением.', 'Операции CRM'],
  ['МАТРИЦА_ЛИСТОВ', '📅 Календарь и Тарифы', 'РАЗРЕШЕН [ВСЕ]', 'Лист содержит актуальную сетку занятости дат и тарифные ставки. Агент учитывает занятые даты и минимальный срок проживания, исключая овербукинг.', 'Календарь'],
  ['МАТРИЦА_ЛИСТОВ', '👤 Гостевые аккаунты', 'РАЗРЕШЕН [КОНСЬЕРЖ]', 'Лист содержит реестр зарегистрированных гостей и статусы блокировок. Агент использует имя гостя для теплого персонализированного приветствия.', 'Гостевой сервис'],
  ['МАТРИЦА_ЛИСТОВ', '🔑 Управление доступом', 'ОГРАНИЧЕН [МАСТЕР]', 'Лист административных учетных записей хозяев и персонала. Доступ закрыт для публичных диалогов: только для авторизации в Кабинете хозяина.', 'Безопасность'],
  ['МАТРИЦА_ЛИСТОВ', '💳 Заказы услуг и гидов', 'РАЗРЕШЕН [ВСЕ]', 'Лист содержит историю заказов доп. услуг и путеводителей. Агент благодарит гостя за оформленный заказ и подтверждает передачу заявки суперхозяину.', 'Заказы'],
  ['МАТРИЦА_ЛИСТОВ', '🎟️ Доступы к путеводителям', 'РАЗРЕШЕН [ВСЕ]', 'Лист персональных доступов к медиа-материалам. Агент напоминает гостю о доступных ему видео-материалах после подтверждения оплаты.', 'Доступы'],
  ['МАТРИЦА_ЛИСТОВ', '💬 Шаблоны сообщений', 'РАЗРЕШЕН [ВСЕ]', 'Лист содержит 14 профессиональных шаблонов общения с 12 точными ссылками Google Maps [включая путеводитель по Дальяну]. Агент использует их как золотой эталон дружелюбного тона.', 'Шаблоны коммуникации'],
  ['МАТРИЦА_ЛИСТОВ', '🧩 Словарь переменных', 'РАЗРЕШЕН [ВСЕ]', 'Лист плейсхолдеров [FIRST_NAME], [CHECKIN_DATE], [VILLA_ADDRESS]. Агент автоматически подставляет живые переменные в текст сообщений.', 'Переменные'],
  ['МАТРИЦА_ЛИСТОВ', '⚙️ Системные настройки ИИ Агентов', 'РАЗРЕШЕН [ВСЕ]', 'Лист управления системой ИИ, генеральными директивами ролей и матрицей прав доступа. Агент черпает отсюда свои глобальные рамки поведения.', 'Центр управления ИИ']
];

module.exports = {
  MASTER_ABOUT_SECTIONS,
  MASTER_HOME_MAP,
  MASTER_SETTINGS_ROWS
};

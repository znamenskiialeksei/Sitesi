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

// ==============================================================================
// ПОЛНЫЙ МАСТЕР-ЭТАЛОН 9 БЛОКОВ КОНСТРУКТОРА ВИТРИНЫ
// ==============================================================================

const MASTER_HOME_ROWS = [
  // --- БЛОК 1: ГЛАВНЫЙ ЭКРАН ЛИСТИНГА [HERO] ---
  ['1. Главный экран', 'hero_title', 'Главный заголовок листинга в шапке', 'Villa Turaman Luxury Waterfront', 'Villa Turaman Luxury Waterfront', 'Villa Turaman Luxury Waterfront', '', 'Вкл'],
  ['1. Главный экран', 'hero_subtitle', 'Подзаголовок виллы под главным заголовком', 'Ваш идеальный отдых в Дальяне. Бронирование виллы, премиальный сервис от суперхозяина [HOST_NAME].', 'Your perfect Dalyan vacation. Villa reservations, premium service from superhost [HOST_NAME].', 'Mükemmel Dalyan tatiliniz. Süper ev sahibi [HOST_NAME] tarafından birinci sınıf hizmet.', '', 'Вкл'],
  ['1. Главный экран', 'hero_rating', 'Числовой рейтинг виллы', '4.98', '4.98', '4.98', 'Star', 'Вкл'],
  ['1. Главный экран', 'hero_reviews_count', 'Количество отзывов рядом с рейтингом', '48 отзывов', '48 reviews', '48 değerlendirme', '', 'Вкл'],
  ['1. Главный экран', 'hero_superhost_badge', 'Бейдж статуса суперхозяина', 'Суперхозяин', 'Superhost', 'Süper Ev Sahibi', 'Award', 'Вкл'],
  ['1. Главный экран', 'hero_location', 'Текст кликабельной локации объекта', '[ADDRESS]', '[ADDRESS]', '[ADDRESS]', 'MapPin', 'Вкл'],
  ['1. Главный экран', 'hero_share_btn', 'Текст кнопки Поделиться', 'Поделиться', 'Share', 'Paylaş', 'Share2', 'Вкл'],
  ['1. Главный экран', 'hero_favorite_btn', 'Текст кнопки В избранное', 'В избранное', 'Save', 'Kaydet', 'Heart', 'Вкл'],
  ['1. Главный экран', 'hero_image', 'Главное фоновое фото объекта', 'Главные фотографии фасада и бассейна', 'Main facade and pool photos', 'Ana cephe ve havuz fotoğrafları', 'https://drive.google.com/file/d/1NjSHRDa5eJpQTzO9268e8LMRzDVmYtX7/view?usp=sharing,https://drive.google.com/file/d/1IZMH6wtfLHZ6ibKHfmBhPGMFntZ_fXKU/view?usp=drive_link', 'Вкл'],

  // --- БЛОК 2: ОСНОВНЫЕ ХАРАКТЕРИСТИКИ ОБЪЕКТА [HOST SPECS] ---
  ['2. Характеристики', 'host_specs_header', 'Заголовок типа жилья и владельца', 'Отдельная вилла целиком • Хозяин: Алексей Знаменский', 'Entire villa • Host: Aleksei Znamenskii', 'Müstakil villa tamamı • Ev Sahibi: Aleksei Znamenskii', '', 'Вкл'],
  ['2. Характеристики', 'host_specs_name', 'Отображаемое имя владельца виллы', 'Алексей Знаменский', 'Aleksei Znamenskii', 'Aleksei Znamenskii', '', 'Вкл'],
  ['2. Характеристики', 'host_specs_avatar', 'Аватар владельца виллы в карточке характеристик', 'Аватар владельца виллы', 'Host profile avatar', 'Ev sahibi profil avatarı', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160', 'Вкл'],
  ['2. Характеристики', 'spec_guests', 'Счетчик гостей в строке параметров', '10 гостей', '10 guests', '10 misafir', 'Users', 'Вкл'],
  ['2. Характеристики', 'spec_bedrooms', 'Счетчик спален в строке параметров', '4 спальни', '4 bedrooms', '4 yatak odası', 'Bed', 'Вкл'],
  ['2. Характеристики', 'spec_beds', 'Счетчик спальных мест [кроватей]', '5 кроватей', '5 beds', '5 yatak', 'Bed', 'Вкл'],
  ['2. Характеристики', 'spec_baths', 'Счетчик ванных комнат', '4 ванные комнаты', '4 bathrooms', '4 banyo', 'Bath', 'Вкл'],

  // --- БЛОК 3: КЛЮЧЕВЫЕ ПРЕИМУЩЕСТВА ВИЛЛЫ [HIGHLIGHTS] ---
  ['3. Преимущества', 'highlight_1_title', 'Заголовок первого преимущества', 'Опытный Суперхозяин [Superhost]', 'Experienced Superhost', 'Deneyimli Süper Ev Sahibi', 'Sparkles', 'Вкл'],
  ['3. Преимущества', 'highlight_1_desc', 'Описание первого преимущества', 'Алексей имеет рейтинг 4.98★ и стремится предоставить первоклассный сервис каждому гостю.', 'Aleksei has a 4.98★ rating and strives to provide top-notch service to every guest.', 'Aleksei 4.98★ puana sahiptir ve her misafire birinci sınıf hizmet sunmayı hedefler.', '', 'Вкл'],
  ['3. Преимущества', 'highlight_2_title', 'Заголовок второго преимущества', 'Бесконтактное прибытие [Self check-in]', 'Self check-in', 'Kendi Kendine Giriş', 'Key', 'Вкл'],
  ['3. Преимущества', 'highlight_2_desc', 'Описание второго преимущества', 'Удобный электронный замок и персональный код доступа для заселения в любое удобное время с 16:00.', 'Convenient electronic lock and personal code for check-in at any time after 4:00 PM.', 'Saat 16:00\'dan sonra dilediğiniz zaman giriş için pratik elektronik kilit ve kişisel şifre.', '', 'Вкл'],
  ['3. Преимущества', 'highlight_3_title', 'Заголовок третьего преимущества', 'Бесплатная отмена за 14 дней', 'Free cancellation 14 days prior', '14 gün öncesine kadar ücretsiz iptal', 'ShieldCheck', 'Вкл'],
  ['3. Преимущества', 'highlight_3_desc', 'Описание третьего преимущества', 'Полный возврат средств при отмене не позднее чем за 14 суток до даты заезда.', 'Full refund if cancelled at least 14 days before arrival date.', 'Giriş tarihinden en az 14 gün önce yapılan iptallerde tam iade.', '', 'Вкл'],

  // --- БЛОК 4: О ВИЛЛЕ И ПРАВИЛА ДОМА [ABOUT & RULES] ---
  ['4. О вилле', 'about_title', 'Заголовок раздела описания', 'О Вилле', 'About Villa', 'Villa Hakkında', '', 'Вкл'],
  ['4. О вилле', 'about_text', 'Краткое описание виллы на главной странице', 'Villa Turaman: это гармоничное сочетание уединения, современного комфорта и первоклассного сервиса для незабываемого отпуска в сердце Дальяна.', 'Villa Turaman offers a harmonious combination of privacy, modern comfort and first-class service for an unforgettable holiday in the heart of Dalyan.', 'Villa Turaman, Dalyan\'ın kalbinde unutulmaz bir tatil için mahremiyet, modern konfor ve birinci sınıf hizmetin uyumlu bir kombinasyonunu sunmaktadır.', '', 'Вкл'],
  ['4. О вилле', 'about_btn_more', 'Текст ссылки открытия полного описания', 'Показать больше об объекте', 'Show more about property', 'Tesis hakkında daha fazla göster', 'ChevronRight', 'Вкл'],
  ['4. О вилле', 'about_modal_title', 'Заголовок всплывающего окна подробностей', 'Об этой вилле', 'About this villa', 'Bu villa hakkında', '', 'Вкл'],
  ['4. О вилле', 'about_sec_1_title', 'Модальное окно: Раздел 1 Заголовок', 'О вилле и о нас', 'About the villa and about us', 'Villa hakkında ve biz hakkında', '', 'Вкл'],
  ['4. О вилле', 'about_sec_1_text', 'Модальное окно: Раздел 1 Текст', 'Вилла Turaman расположена по адресу: [ADDRESS]. Локация: [MAPS_URL]. [OUTDOOR_ZONES]. [POOL_SPECS] [период работы: [POOL_SEASON]]. Режим джакузи: [JACUZZI_HOURS]. Освещение: [POOL_LIGHTS].', 'Villa Turaman is located at: [ADDRESS]. Location: [MAPS_URL]. [OUTDOOR_ZONES]. [POOL_SPECS] [operating season: [POOL_SEASON]]. Jacuzzi mode: [JACUZZI_HOURS]. Lighting: [POOL_LIGHTS].', 'Villa Turaman adresi: [ADDRESS]. Konum: [MAPS_URL]. [OUTDOOR_ZONES]. [POOL_SPECS] [sezon: [POOL_SEASON]]. Jakuzi modu: [JACUZZI_HOURS]. Aydınlatma: [POOL_LIGHTS].', '', 'Вкл'],
  ['4. О вилле', 'about_sec_2_title', 'Модальное окно: Раздел 2 Заголовок', 'Вместимость', 'Capacity', 'Kapasite', '', 'Вкл'],
  ['4. О вилле', 'about_sec_2_text', 'Модальное окно: Раздел 2 Текст', '[VILLA_FLOORS] Вместимость: [MAX_GUESTS].', '[VILLA_FLOORS] Capacity: [MAX_GUESTS].', '[VILLA_FLOORS] Kapasite: [MAX_GUESTS].', '', 'Вкл'],
  ['4. О вилле', 'about_sec_3_title', 'Модальное окно: Раздел 3 Заголовок', 'Описание комнат и планировка', 'Description of the villa', 'Villanın Tanımı', '', 'Вкл'],
  ['4. О вилле', 'about_sec_3_text', 'Модальное окно: Раздел 3 Текст', 'В самом центре Дальяна. Приватный бассейн. Полноценная кухня и гостиная. 4 большие спальни. Спальня на 1 этаже: 3 спальных места, ванная комната и кондиционер. Спальни на 2 этаже: 3 отдельные спальные комнаты, каждая со своей ванной комнатой и кондиционером.', 'The villa is located in the heart of Dalyan. Private pool, full kitchen and living room. 4 large bedrooms with en-suite bathrooms and air conditioning.', 'Villa Dalyan merkezinde yer almaktadır. Özel havuz, tam donanımlı mutfak ve oturma odası. Özel banyolu ve klimalı 4 geniş yatak odası.', '', 'Вкл'],
  ['4. О вилле', 'about_sec_4_title', 'Модальное окно: Раздел 4 Заголовок', 'Что доступно гостю: 1 и 2 этажи', 'What is available to the guest', 'Misafirlerin kullanımına sunulan olanaklar', '', 'Вкл'],
  ['4. О вилле', 'about_sec_4_text', 'Модальное окно: Раздел 4 Текст', 'Первый этаж: кухня, гостиная, Smart TV 55", спальня с ванной. Второй этаж: 3 спальни с собственными санузлами, стиральная машина.', 'First floor: kitchen, living room, Smart TV 55", bedroom with bathroom. Second floor: 3 bedrooms each with en-suite bathroom, washing machine.', 'Birinci kat: mutfak, oturma odası, 55 inç Smart TV, banyolu yatak odası. İkinci kat: özel banyolu 3 yatak odası, çamaşır makinesi.', '', 'Вкл'],
  ['4. О вилле', 'about_sec_5_title', 'Модальное окно: Раздел 5 Заголовок', 'Бассейн и Сад', 'Pool and Garden', 'Havuz ve Bahçe', '', 'Вкл'],
  ['4. О вилле', 'about_sec_5_text', 'Модальное окно: Раздел 5 Текст', '[POOL_CLEANING] [STREET_LIGHTS]', '[POOL_CLEANING] [STREET_LIGHTS]', '[POOL_CLEANING] [STREET_LIGHTS]', '', 'Вкл'],
  ['4. О вилле', 'about_sec_6_title', 'Модальное окно: Раздел 6 Заголовок', 'Правила проживания', 'House Rules', 'Ev Kuralları', '', 'Вкл'],
  ['4. О вилле', 'about_sec_6_text', 'Модальное окно: Раздел 6 Текст', 'Заезд после 16:00, выезд до 10:00. Курение в помещениях виллы строго запрещено.', 'Check-in after 4:00 PM, check-out before 10:00 AM. Smoking is strictly prohibited in the villa.', 'Giriş saati 16:00 sonrası, çıkış saati 10:00 öncesidir. Villada sigara içmek kesinlikle yasaktır.', '', 'Вкл'],
  ['4. О вилле', 'about_sec_7_title', 'Модальное окно: Раздел 7 Заголовок', 'Регистрация KBS и KVKK', 'Registration [KBS/KVKK]', 'Kayıt [KBS/KVKK]', '', 'Вкл'],
  ['4. О вилле', 'about_sec_7_text', 'Модальное окно: Раздел 7 Текст', 'Ваши данные защищены и используются исключительно для регистрации гостей в системе KBS согласно законам Турции.', 'Your data is protected and used solely for the purpose of registering guests in the KBS system in accordance with Turkish law.', 'Verileriniz korunmaktadır ve Türk kanunlarına uygun olarak yalnızca KBS sistemine misafir kaydı amacıyla kullanılmaktadır.', '', 'Вкл'],

  // --- БЛОК 5: СПАЛЬНЫЕ МЕСТА [SLEEPING ARRANGEMENTS] ---
  ['5. Спальни', 'sleeping_title', 'Заголовок секции спальных мест', 'Где вы будете спать', 'Where you will sleep', 'Nerede uyuyacaksınız', '', 'Вкл'],
  ['5. Спальни', 'bedroom_1', 'Спальня 1 • King Bed', 'Спальня 1 • King Bed', 'Bedroom 1 • King Bed', 'Yatak Odası 1 • King Bed', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600', 'Вкл'],
  ['5. Спальни', 'bedroom_1_desc', 'Описание спальни 1', 'Большая двуспальная кровать King Size, панорамные окна с видом на бассейн и сад, кондиционер', 'Large King Size double bed, panoramic windows overlooking the pool and garden, air conditioning', 'Geniş King Size çift kişilik yatak, havuz ve bahçe manzaralı panoramik pencereler, klima', 'BedDouble', 'Вкл'],
  ['5. Спальни', 'bedroom_1_badge', 'Бейдж кровати спальни 1', 'King Bed', 'King Bed', 'King Bed', '', 'Вкл'],
  ['5. Спальни', 'bedroom_2', 'Спальня 2 • Queen Bed', 'Спальня 2 • Queen Bed', 'Bedroom 2 • Queen Bed', 'Yatak Odası 2 • Queen Bed', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600', 'Вкл'],
  ['5. Спальни', 'bedroom_2_desc', 'Описание спальни 2', 'Уютная двуспальная кровать Queen Size, балкон с видом на горы, кондиционер', 'Cozy Queen Size double bed, balcony with mountain view, air conditioning', 'Konforlu Queen Size çift kişilik yatak, dağ manzaralı balkon, klima', 'BedDouble', 'Вкл'],
  ['5. Спальни', 'bedroom_2_badge', 'Бейдж кровати спальни 2', 'Queen Bed', 'Queen Bed', 'Queen Bed', '', 'Вкл'],
  ['5. Спальни', 'bedroom_3', 'Спальня 3 • 2 Односпальные', 'Спальня 3 • 2 Односпальные', 'Bedroom 3 • 2 Single Beds', 'Yatak Odası 3 • 2 Tek Kişilik', 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600', 'Вкл'],
  ['5. Спальни', 'bedroom_3_desc', 'Описание спальни 3', 'Две раздельные комфортные кровати, рабочий стол, вид на сад', 'Two separate comfortable beds, work desk, garden view', 'İki ayrı konforlu yatak, çalışma masası, bahçe manzarası', 'Bed', 'Вкл'],
  ['5. Спальни', 'bedroom_3_badge', 'Бейдж кроватей спальни 3', '2 Single Beds', '2 Single Beds', '2 Tek Kişilik Yatak', '', 'Вкл'],
  ['5. Спальни', 'bedroom_4', 'Спальня 4 • Диван-кровать', 'Спальня 4 • Диван-кровать', 'Bedroom 4 • Sofa Bed', 'Yatak Odası 4 • Çekyat', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600', 'Вкл'],
  ['5. Спальни', 'bedroom_4_desc', 'Описание спальни 4', 'Раскладной ортопедический диван-кровать в лаундж-зоне, кондиционер', 'Convertible orthopedic sofa bed in the lounge area, air conditioning', 'Oturma alanında açılır ortopedik çekyat, klima', 'Sofa', 'Вкл'],
  ['5. Спальни', 'bedroom_4_badge', 'Бейдж дивана спальни 4', 'Sofa Bed', 'Sofa Bed', 'Çekyat', '', 'Вкл'],

  // --- БЛОК 6: УДОБСТВА ВИЛЛЫ [AMENITIES] ---
  ['6. Удобства', 'amenities_title', 'Заголовок секции удобств', 'Что есть в этом жилье', 'What this place offers', 'Bu mekanın sundukları', '', 'Вкл'],
  ['6. Удобства', 'amenities_btn_all', 'Кнопка открытия модального окна всех удобств', 'Показать все удобства', 'Show all amenities', 'Tüm olanakları göster', '', 'Вкл'],
  ['6. Удобства', 'amenity_main_1', 'Основное удобство 1 на главной', 'Приватный открытый бассейн', 'Private outdoor pool', 'Özel açık yüzme havuzu', 'Waves', 'Вкл'],
  ['6. Удобства', 'amenity_main_2', 'Основное удобство 2 на главной', 'Панорамный вид на горы', 'Scenic mountain view', 'Panoramik dağ manzarası', 'Mountain', 'Вкл'],
  ['6. Удобства', 'amenity_main_3', 'Основное удобство 3 на главной', 'Скоростной Wi-Fi: [WIFI_NAME]', 'High-speed Wi-Fi: [WIFI_NAME]', 'Yüksek hızlı Wi-Fi: [WIFI_NAME]', 'Wifi', 'Вкл'],
  ['6. Удобства', 'amenity_main_4', 'Основное удобство 4 на главной', 'Кондиционеры во всех комнатах', 'Air conditioning in all rooms', 'Tüm odalarda klima', 'Wind', 'Вкл'],
  ['6. Удобства', 'amenity_main_5', 'Основное удобство 5 на главной', 'Полноценная кухня и посуда', 'Fully equipped kitchen', 'Tam donanımlı mutfak', 'Utensils', 'Вкл'],
  ['6. Удобства', 'amenity_main_6', 'Основное удобство 6 на главной', 'Бесплатная парковка на территории', 'Free on-site parking', 'Tesis içi ücretsiz otopark', 'Car', 'Вкл'],
  ['6. Удобства', 'amenity_main_7', 'Основное удобство 7 на главной', 'Зона BBQ и мангал в саду', 'Garden BBQ grill area', 'Bahçe barbekü alanı', 'Flame', 'Вкл'],
  ['6. Удобства', 'amenity_main_8', 'Основное удобство 8 на главной', 'Стиральная машина', 'Washing machine', 'Çamaşır makinesi', 'WashingMachine', 'Вкл'],
  ['6. Удобства', 'amenity_main_9', 'Основное удобство 9 на главной', 'Выделенное рабочее место', 'Dedicated workspace', 'Özel çalışma alanı', 'Laptop', 'Вкл'],
  ['6. Удобства', 'amenity_main_10', 'Основное удобство 10 на главной', 'Охраняемая территория', 'Secure gated territory', 'Güvenli özel alan', 'Shield', 'Вкл'],
  ['6. Удобства', 'amenity_cat1_title', 'Модальное окно: Категория 1 Заголовок', 'Виды и природа', 'Scenic Views & Nature', 'Manzara ve Doğa', 'Mountain', 'Вкл'],
  ['6. Удобства', 'amenity_cat1_item1', 'Модальное окно: Категория 1 Пункт 1', 'Панорамный вид на горы Дальяна', 'Panoramic view of Dalyan rock mountains', 'Dalyan dağlarının panoramik manzarası', 'Check', 'Вкл'],
  ['6. Удобства', 'amenity_cat1_item2', 'Модальное окно: Категория 1 Пункт 2', 'Вид на реку и сад', 'Direct river and lush garden view', 'Nehir ve yemyeşil bahçe manzarası', 'Check', 'Вкл'],
  ['6. Удобства', 'amenity_cat1_item3', 'Модальное окно: Категория 1 Пункт 3', 'Прямой выход к причалу', 'Private waterfront jetty access', 'Özel iskeleye doğrudan erişim', 'Check', 'Вкл'],
  ['6. Удобства', 'amenity_cat2_title', 'Модальное окно: Категория 2 Заголовок', 'Бассейн и спа', 'Pool & Spa', 'Havuz ve Spa', 'Waves', 'Вкл'],
  ['6. Удобства', 'amenity_cat2_item1', 'Модальное окно: Категория 2 Пункт 1', 'Приватный открытый бассейн глубина 1.5м', 'Private outdoor pool depth 1.5m', 'Özel açık yüzme havuzu derinlik 1.5m', 'Check', 'Вкл'],
  ['6. Удобства', 'amenity_cat2_item2', 'Модальное окно: Категория 2 Пункт 2', 'Шезлонги и зонты от солнца', 'Comfortable sun loungers and umbrellas', 'Konforlu şezlonglar ve şemsiyeler', 'Check', 'Вкл'],
  ['6. Удобства', 'amenity_cat2_item3', 'Модальное окно: Категория 2 Пункт 3', 'Летний душ у бассейна', 'Poolside outdoor summer shower', 'Havuz başı açık yaz duşu', 'Check', 'Вкл'],
  ['6. Удобства', 'amenity_cat2_item4', 'Модальное окно: Категория 2 Пункт 4', 'Вечерняя гидроподсветка бассейна', 'Evening pool hydro-lighting', 'Akşam havuz su altı aydınlatması', 'Check', 'Вкл'],
  ['6. Удобства', 'amenity_cat3_title', 'Модальное окно: Категория 3 Заголовок', 'Кухня и столовая', 'Kitchen & Dining', 'Mutfak ve Yemek', 'Utensils', 'Вкл'],
  ['6. Удобства', 'amenity_cat3_item1', 'Модальное окно: Категория 3 Пункт 1', 'Большой двухкамерный холодильник', 'Large double-door refrigerator', 'Geniş çift kapılı buzdolabı', 'Check', 'Вкл'],
  ['6. Удобства', 'amenity_cat3_item2', 'Модальное окно: Категория 3 Пункт 2', 'Посудомоечная машина', 'Modern dishwasher', 'Modern bulaşık makinesi', 'Check', 'Вкл'],
  ['6. Удобства', 'amenity_cat3_item3', 'Модальное окно: Категория 3 Пункт 3', 'Духовой шкаф и индукционная варочная панель', 'Oven and induction cooktop', 'Fırın ve indüksiyonlu ocak', 'Check', 'Вкл'],
  ['6. Удобства', 'amenity_cat3_item4', 'Модальное окно: Категория 3 Пункт 4', 'Кофемашина эспрессо и чайник', 'Espresso coffee machine and kettle', 'Espresso kahve makinesi ve su ısıtıcısı', 'Check', 'Вкл'],
  ['6. Удобства', 'amenity_cat3_item5', 'Модальное окно: Категория 3 Пункт 5', 'Полный комплект посуды и бокалов', 'Full set of cookware, dishes and wine glasses', 'Eksiksiz tencere, tabak ve kadeh takımı', 'Check', 'Вкл'],
  ['6. Удобства', 'amenity_cat4_title', 'Модальное окно: Категория 4 Заголовок', 'Комфорт и связь', 'Comfort & Tech', 'Konfor ve Teknoloji', 'Wifi', 'Вкл'],
  ['6. Удобства', 'amenity_cat4_item1', 'Модальное окно: Категория 4 Пункт 1', 'Скоростной оптоволоконный Wi-Fi 100 Мбит/с', 'High-speed fiber-optic Wi-Fi 100 Mbps', 'Yüksek hızlı fiber optik Wi-Fi 100 Mbps', 'Check', 'Вкл'],
  ['6. Удобства', 'amenity_cat4_item2', 'Модальное окно: Категория 4 Пункт 2', 'Сплит-системы кондиционирования в каждой комнате', 'Individual split AC units in all rooms', 'Her odada bağımsız split klima', 'Check', 'Вкл'],
  ['6. Удобства', 'amenity_cat4_item3', 'Модальное окно: Категория 4 Пункт 3', 'Smart TV 55 дюймов с Netflix и YouTube', 'Smart TV 55 inch with Netflix and YouTube', 'Netflix ve YouTube özellikli 55 inch Smart TV', 'Check', 'Вкл'],
  ['6. Удобства', 'amenity_cat4_item4', 'Модальное окно: Категория 4 Пункт 4', 'Выделенная рабочая зона с эргономичным креслом', 'Dedicated workspace with ergonomic chair', 'Ergonomik sandalyeli özel çalışma alanı', 'Check', 'Вкл'],
  ['6. Удобства', 'amenity_cat5_title', 'Модальное окно: Категория 5 Заголовок', 'Безопасность дома', 'Home Safety', 'Ev Güvenliği', 'Shield', 'Вкл'],
  ['6. Удобства', 'amenity_cat5_item1', 'Модальное окно: Категория 5 Пункт 1', 'Огороженная приватная территория', 'Gated private enclosed territory', 'Çevrili özel korunaklı mülk alanı', 'Check', 'Вкл'],
  ['6. Удобства', 'amenity_cat5_item2', 'Модальное окно: Категория 5 Пункт 2', 'Система видеонаблюдения по внешнему периметру', 'External perimeter CCTV security', 'Dış çevre güvenlik kamerası sistemi', 'Check', 'Вкл'],
  ['6. Удобства', 'amenity_cat5_item3', 'Модальное окно: Категория 5 Пункт 3', 'Датчики дыма и аптечка первой помощи', 'Smoke detectors and first aid kit', 'Duman dedektörleri ve ilk yardım kiti', 'Check', 'Вкл'],
  ['6. Удобства', 'amenity_cat5_item4', 'Модальное окно: Категория 5 Пункт 4', 'Огнетушитель', 'Fire extinguisher', 'Yangın söndürücü', 'Check', 'Вкл'],

  // --- БЛОК 7: ОТЗЫВЫ И КРИТЕРИИ ОЦЕНОК [REVIEWS] ---
  ['7. Отзывы', 'reviews_score_header', 'Заголовок рейтинга в блоке отзывов', '4.98 • Рейтинг гостей на основе 48 отзывов', '4.98 • Guest rating based on 48 reviews', '4.98 • 48 değerlendirmeye göre misafir puanı', 'Star', 'Вкл'],
  ['7. Отзывы', 'review_cat_1', 'Критерий 1: Чистота', 'Чистота', 'Cleanliness', 'Temizlik', '5.0|100', 'Вкл'],
  ['7. Отзывы', 'review_cat_2', 'Критерий 2: Точность описания', 'Точность описания', 'Accuracy', 'Doğruluk', '4.9|98', 'Вкл'],
  ['7. Отзывы', 'review_cat_3', 'Критерий 3: Общение с хозяином', 'Общение с хозяином', 'Communication', 'İletişim', '5.0|100', 'Вкл'],
  ['7. Отзывы', 'review_cat_4', 'Критерий 4: Расположение', 'Расположение', 'Location', 'Konum', '4.9|98', 'Вкл'],
  ['7. Отзывы', 'review_cat_5', 'Критерий 5: Прибытие и заезд', 'Прибытие и заезд', 'Check-in', 'Giriş', '5.0|100', 'Вкл'],
  ['7. Отзывы', 'review_cat_6', 'Критерий 6: Цена / качество', 'Соотношение цена/качество', 'Value', 'Fiyat/performans', '4.9|98', 'Вкл'],
  ['7. Отзывы', 'review_1_author', 'Отзыв 1: Автор и дата', 'Елена Смирнова • Август 2026', 'Elena Smirnova • August 2026', 'Elena Smirnova • Ağustos 2026', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120', 'Вкл'],
  ['7. Отзывы', 'review_1_text', 'Отзыв 1: Текст отзыва', 'Потрясающая вилла! Вид на горы просто захватывает дух, бассейн чистейший. Алексей был на связи 24/7, помог организовать незабываемый круиз на яхте по озеру Кёйджегиз. Обязательно вернемся!', 'Stunning villa! Mountain views are breathtaking, pool is pristine. Aleksei was available 24/7 and helped organize an unforgettable cruise on Lake Koycegiz. We will definitely return!', 'Harika villa! Dağ manzarası nefes kesici, havuz tertemiz. Aleksei 7/24 iletişimdeydi ve Köyceğiz Gölü\'nde unutulmaz bir tekne turu düzenlememize yardımcı oldu. Kesinlikle tekrar geleceğiz!', '', 'Вкл'],
  ['7. Отзывы', 'review_2_author', 'Отзыв 2: Автор и дата', 'Markus Webber • Июль 2026', 'Markus Webber • July 2026', 'Markus Webber • Temmuz 2026', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120', 'Вкл'],
  ['7. Отзывы', 'review_2_text', 'Отзыв 2: Текст отзыва', 'Outstanding hospitality and pristine villa. Fast Wi-Fi for remote work, peaceful neighborhood, and fully equipped kitchen. Aleksei is truly a top Superhost!', 'Outstanding hospitality and pristine villa. Fast Wi-Fi for remote work, peaceful neighborhood, and fully equipped kitchen. Aleksei is truly a top Superhost!', 'Olağanüstü misafirperverlik ve kusursuz villa. Uzaktan çalışma için hızlı Wi-Fi, huzurlu bir çevre ve tam donanımlı mutfak. Aleksei gerçekten harika bir Süper Ev Sahibi!', '', 'Вкл'],
  ['7. Отзывы', 'review_3_author', 'Отзыв 3: Автор и дата', 'Ahmet Yılmaz • Июнь 2026', 'Ahmet Yilmaz • June 2026', 'Ahmet Yılmaz • Haziran 2026', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120', 'Вкл'],
  ['7. Отзывы', 'review_3_text', 'Отзыв 3: Текст отзыва', 'Dalyan\'da kaldığımız en konforlu villa. Bahçe ve havuz bakımı mükemmeldi. Ailemizle birlikte çok huzurlu bir hafta geçirdik, teşekkürler Aleksei!', 'The most comfortable villa we stayed in Dalyan. Garden and pool maintenance were excellent. We had a peaceful week with our family, thank you Aleksei!', 'Dalyan\'da kaldığımız en konforlu villa. Bahçe ve havuz bakımı mükemmeldi. Ailemizle birlikte çok huzurlu bir hafta geçirdik, teşekkürler Aleksei!', '', 'Вкл'],
  ['7. Отзывы', 'review_4_author', 'Отзыв 4: Автор и дата', 'Дмитрий и Анна • Май 2026', 'Dmitry and Anna • May 2026', 'Dmitry ve Anna • Mayıs 2026', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120', 'Вкл'],
  ['7. Отзывы', 'review_4_text', 'Отзыв 4: Текст отзыва', 'Идеально для семейного отдыха с детьми. Закрытая территория, просторные спальни, тишина. Видео-гид от Алексея открыл нам секретные пляжи Дальяна, где нет толп туристов.', 'Perfect for a family vacation with kids. Gated territory, spacious bedrooms, quiet surroundings. Aleksei\'s video guide revealed secret Dalyan beaches without crowds.', 'Çocuklu aile tatili için ideal. Çevrili özel alan, ferah yatak odaları, sessizlik. Aleksei\'nin video rehberi bize turist kalabalığından uzak gizli Dalyan plajlarını keşfettirdi.', '', 'Вкл'],

  // --- БЛОК 8: ЛОКАЦИЯ И ОКРЕСТНОСТИ ДАЛЬЯНА [LOCATION] ---
  ['8. Локация', 'location_title', 'Заголовок секции локации', 'Расположение: Дальян, Ортаджа, Мугла, Турция', 'Location: Dalyan, Ortaca, Mugla, Turkey', 'Konum: Dalyan, Ortaca, Muğla, Türkiye', 'MapPin', 'Вкл'],
  ['8. Локация', 'location_desc', 'Подробный текст об окрестностях Дальяна', 'Вилла расположена в тихом зеленом районе в 5 минутах ходьбы от набережной реки Дальян. В пешей доступности рестораны традиционной эгейской кухни, лодочные причалы для поездок на пляж Изтузу и термальные грязевые источники Султание.', 'The villa is located in a quiet green area just a 5-minute walk from the Dalyan River promenade. Traditional Aegean restaurants, boat docks for trips to Iztuzu Beach, and Sultaniye mud springs are all within easy walking distance.', 'Villa, Dalyan Nehri kordonuna 5 dakikalık yürüme mesafesinde, sessiz ve yeşil bir bölgede yer almaktadır. Geleneksel Ege restoranları, İztuzu Plajı tekne iskeleleri ve Sultaniye kaplıcaları yürüme mesafesindedir.', '', 'Вкл'],
  ['8. Локация', 'location_badge', 'Текст плашки GPS и расстояния до аэропорта', 'GPS: 36.8336° N, 28.6439° E • 25 минут от аэропорта Даламан [DLM]', 'GPS: 36.8336° N, 28.6439° E • 25 min from Dalaman Airport [DLM]', 'GPS: 36.8336° N, 28.6439° E • Dalaman Havalimanı 25 dakika', 'Navigation', 'Вкл'],
  ['8. Локация', 'location_image', 'Панорамная фотография окрестностей', 'Фото природы Дальяна', 'Dalyan nature photo', 'Dalyan doğa fotoğrafı', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200', 'Вкл'],

  // --- БЛОК 9: КАРТОЧКА ВЛАДЕЛЬЦА [HOST PROFILE] ---
  ['9. Хозяин', 'host_card_title', 'Заголовок карточки владельца', 'Хозяин: Алексей Знаменский', 'Host: Aleksei Znamenskii', 'Ev Sahibi: Aleksei Znamenskii', '', 'Вкл'],
  ['9. Хозяин', 'host_card_subtitle', 'Подзаголовок статуса суперхозяина', 'Суперхозяин на Airbnb • Более 5 лет приема гостей', 'Superhost on Airbnb • 5+ years hosting', 'Airbnb Süper Ev Sahibi • 5+ yıldır ev sahibi', 'Award', 'Вкл'],
  ['9. Хозяин', 'host_card_verified', 'Бейдж подтверждения личности', 'Личность подтверждена', 'Identity verified', 'Kimlik doğrulandı', 'ShieldCheck', 'Вкл'],
  ['9. Хозяин', 'host_card_response_time', 'Бейдж времени ответа на сообщения', 'Время ответа: в течение часа', 'Response time: within an hour', 'Yanıt süresi: bir saat içinde', 'Clock', 'Вкл'],
  ['9. Хозяин', 'host_card_languages', 'Заголовок языков общения', 'Языки: Русский, English, Türkçe', 'Languages: Russian, English, Turkish', 'Diller: Rusça, İngilizce, Türkçe', 'Globe2', 'Вкл'],
  ['9. Хозяин', 'host_card_help_text', 'Описание помощи гостям', 'Помощь в организации трансфера, персональных туров по озеру Кёйджегиз и бронирования ресторанов', 'Assistance with airport transfers, private tours on Lake Koycegiz and restaurant reservations', 'Havalimanı transferi, Köyceğiz Gölü özel tekne turları ve restoran rezervasyonlarında destek', '', 'Вкл'],
  ['9. Хозяин', 'host_card_btn', 'Текст кнопки связи с хозяином', 'Написать хозяину', 'Message host', 'Ev sahibine mesaj gönder', 'MessageCircle', 'Вкл']
];

// Динамическое построение объекта MASTER_HOME_MAP из строк MASTER_HOME_ROWS
const MASTER_HOME_MAP = {};

MASTER_HOME_ROWS.forEach(function (row) {
  var block = row[0];
  var key = row[1];
  var desc = row[2];
  var ru = row[3];
  var en = row[4];
  var tr = row[5];
  var media = row[6];
  var status = row[7];

  MASTER_HOME_MAP[key] = {
    block: block,
    key: key,
    desc: desc,
    ru: ru,
    en: en,
    tr: tr,
    media: media,
    status: status
  };
});

// Дополнительные алиасы для 100% обратной совместимости с camelCase ключами
MASTER_HOME_MAP.heroTitle = MASTER_HOME_MAP.hero_title;
MASTER_HOME_MAP.heroSubtitle = MASTER_HOME_MAP.hero_subtitle;
MASTER_HOME_MAP.heroImage = MASTER_HOME_MAP.hero_image;
MASTER_HOME_MAP.aboutTitle = MASTER_HOME_MAP.about_title;
MASTER_HOME_MAP.aboutText = MASTER_HOME_MAP.about_text;
MASTER_HOME_MAP.hostHeader = MASTER_HOME_MAP.host_specs_header;
MASTER_HOME_MAP.hostName = MASTER_HOME_MAP.host_specs_name;
MASTER_HOME_MAP.hostAvatar = MASTER_HOME_MAP.host_specs_avatar;
MASTER_HOME_MAP.highlightSuperhostTitle = MASTER_HOME_MAP.highlight_1_title;
MASTER_HOME_MAP.highlightSuperhostDesc = MASTER_HOME_MAP.highlight_1_desc;
MASTER_HOME_MAP.highlightCheckinTitle = MASTER_HOME_MAP.highlight_2_title;
MASTER_HOME_MAP.highlightCheckinDesc = MASTER_HOME_MAP.highlight_2_desc;
MASTER_HOME_MAP.highlightCancellationTitle = MASTER_HOME_MAP.highlight_3_title;
MASTER_HOME_MAP.highlightCancellationDesc = MASTER_HOME_MAP.highlight_3_desc;
MASTER_HOME_MAP.locationTitle = MASTER_HOME_MAP.location_title;
MASTER_HOME_MAP.locationDesc = MASTER_HOME_MAP.location_desc;

const { SMART_TEMPLATES } = require('./templatesData');

const MASTER_SETTINGS_ROWS = [
  // --- БЛОК 1: СИСТЕМНЫЕ ПАРАМЕТРЫ ЭКОСИСТЕМЫ ---
  ['СИСТЕМА', 'ai_mode', 'autopilot', 'Режим работы ИИ: autopilot [автоответ], copilot [суфлер хозяина], off [выключен]', 'Критический'],
  ['СИСТЕМА', 'ai_model', 'gemini-3.6-flash', 'Целевая модель Google Gemini: gemini-3.6-flash / gemini-2.5-flash', 'Высокая скорость'],
  ['СИСТЕМА', 'min_night_price', '180', 'Минимально допустимая цена за сутки бронирования в USD: ниже опускать запрещено', 'Финансовый барьер'],
  ['СИСТЕМА', 'telegram_bot_token', '', 'Токен Telegram-бота от BotFather для оповещений и мобильного пульта', 'Безопасность'],
  ['СИСТЕМА', 'telegram_admin_chat_id', '', 'ID чата суперхозяина в Telegram для получения алертов и модерации', 'Суперхозяин'],
  ['СИСТЕМА', 'vercel_url', 'https://sitesi-git-v1-airbnb-znamenskiialekseis-projects.vercel.app', 'Боевой URL платформы на Vercel для вебхуков и ревалидации', 'Синхронизация'],

  // --- БЛОК 2: 🧩 СЛОВАРЬ ПЕРЕМЕННЫХ [ИСТИННЫЙ SSOT] ---
  ['ПЕРЕМЕННАЯ', 'wifi_name', 'Guest', 'Имя гостевой сети Wi-Fi виллы', 'Плейсхолдер [WIFI_NAME]'],
  ['ПЕРЕМЕННАЯ', 'wifi_password', 'villa2026', 'Пароль гостевой сети Wi-Fi', 'Плейсхолдер [WIFI_PASSWORD]'],
  ['ПЕРЕМЕННАЯ', 'address', 'Dalyan, Rodoslu Yaşar Sünger Sk, NO 28/2, 48600 Ortaca / Muğla', 'Точный физический адрес виллы', 'Плейсхолдер [ADDRESS]'],
  ['ПЕРЕМЕННАЯ', 'maps_url', 'https://maps.app.goo.gl/tPgCjCwz4pzq28pE9', 'Прямая ссылка на геолокацию Google Maps', 'Плейсхолдер [MAPS_URL]'],
  ['ПЕРЕМЕННАЯ', 'checkin_time', '16:00', 'Стандартное время заезда гостей', 'Плейсхолдер [CHECKIN_TIME]'],
  ['ПЕРЕМЕННАЯ', 'checkout_time', '10:00', 'Стандартное время выезда гостей', 'Плейсхолдер [CHECKOUT_TIME]'],
  ['ПЕРЕМЕННАЯ', 'checkin_method', 'Электронный смарт-замок и мини-сейф с кодом / личная встреча владельцем', 'Способ передачи ключей', 'Плейсхолдер [CHECKIN_METHOD]'],
  ['ПЕРЕМЕННАЯ', 'key_handover', 'Оставьте ключи в мини-сейфе с кодом у входной двери или на кухонном столе', 'Инструкция возврата ключей', 'Плейсхолдер [KEY_HANDOVER]'],
  ['ПЕРЕМЕННАЯ', 'platform_name', 'Villa Turaman Direct', 'Название платформы бронирования', 'Плейсхолдер [PLATFORM_NAME]'],

  // --- БЛОК 3: 👤 О ХОЗЯИНЕ ---
  ['О_ХОЗЯИНЕ', 'host_name', 'Aleksei Znamenskii', 'Имя владельца виллы на английском и русском', 'Плейсхолдер [HOST_NAME]'],
  ['О_ХОЗЯИНЕ', 'host_status', 'Суперхозяин на Airbnb • Более 5 лет приема гостей', 'Статус суперхозяина и опыт', 'Плейсхолдер [HOST_STATUS]'],
  ['О_ХОЗЯИНЕ', 'host_languages', 'Русский, English, Türkçe', 'Языки общения с гостями', 'Плейсхолдер [HOST_LANGUAGES]'],
  ['О_ХОЗЯИНЕ', 'host_response_time', 'В течение часа', 'Скорость ответа на сообщения', 'Плейсхолдер [RESPONSE_TIME]'],
  ['О_ХОЗЯИНЕ', 'host_business', 'Краткосрочная аренда Villa Turaman [Дальян, Мугла, Турция]', 'Юридический вид деятельности и бизнес', 'Бизнес профиль'],

  // --- БЛОК 4: 🏡 О ВИЛЛЕ И УДОБСТВАХ ---
  ['О_ВИЛЛЕ', 'villa_capacity', '10 гостей', 'Максимальная вместимость виллы, включая детей', 'Плейсхолдер [MAX_GUESTS]'],
  ['О_ВИЛЛЕ', 'villa_floors', '2 этажа. Первый этаж: кухня, гостиная со Smart TV 55", гостевой санузел, стиральная машина, гладильная доска и утюг, спальня на 3 места с ванной. Второй этаж: 3 спальни с ванными комнатами и кондиционерами, доп. кровать и вторая стиральная машина.', 'Планировка и оснащение этажей', 'Плейсхолдер [VILLA_FLOORS]'],
  ['О_ВИЛЛЕ', 'pool_specs', 'Приватный бассейн с соленой водой 36 кв.м и уличное джакузи', 'Характеристики бассейна и гидромассажа', 'Плейсхолдер [POOL_SPECS]'],
  ['О_ВИЛЛЕ', 'pool_season', 'с 1 мая по 1 ноября', 'Период работы и эксплуатации бассейна и джакузи', 'Плейсхолдер [POOL_SEASON]'],
  ['О_ВИЛЛЕ', 'jacuzzi_schedule', 'Работает с 09:00 до 18:00. Включается автоматически на 15 минут с интервалом каждые 45 минут.', 'Алгоритм и часы работы джакузи', 'Плейсхолдер [JACUZZI_HOURS]'],
  ['О_ВИЛЛЕ', 'pool_lighting', 'Освещение в бассейне и джакузи включается автоматически с 20:00 до 01:00.', 'График подсветки воды', 'Плейсхолдер [POOL_LIGHTS]'],
  ['О_ВИЛЛЕ', 'street_lighting', 'Уличное освещение включается автоматически с 20:00 до 01:00 и с 04:00 до 06:00.', 'График освещения сада и фасада', 'Плейсхолдер [STREET_LIGHTS]'],
  ['О_ВИЛЛЕ', 'pool_maintenance', 'Профилактические работы и чистка бассейна производятся в день заселения и далее каждые 7 дней.', 'Регламент очистки бассейна', 'Плейсхолдер [POOL_CLEANING]'],
  ['О_ВИЛЛЕ', 'outdoor_zones', 'Парковка перед виллой, дворик-сад, зона барбекю, крыльцо с кофейными столиками и обеденной зоной, зона для загара с шезлонгами.', 'Территория вне виллы', 'Плейсхолдер [OUTDOOR_ZONES]'],

  // --- БЛОК 5: 🇹🇷 ОБРАБОТКА И ШАБЛОН KBS ---
  ['KBS_ИНСТРУКЦИЯ', 'kbs_parser_prompt', 'Ты: модуль обработки данных гостей для турецкой системы KBS. Твоя задача: извлечь данные из сообщения гостя и выдать СТРОГО готовый список по шаблону, БЕЗ приветствий, БЕЗ вводных слов и БЕЗ лишнего текста.', 'Промпт парсера KBS', 'KBS парсер'],
  ['KBS_ИНСТРУКЦИЯ', 'kbs_template_format', 'Гость [Номер]: [ФИО], дата рождения: [DD.MM.YYYY], пол: [male/female], гражданство: [строго на английском], номер паспорта: [Номер паспорта]. Период проживания: [DD.MM.YYYY] – [DD.MM.YYYY].', 'Канонический шаблон KBS', 'KBS шаблон'],
  ['KBS_ИНСТРУКЦИЯ', 'kbs_rules', 'Правила: Ключи шаблона остаются на русском, значения пола [male/female] и гражданства [Russian, Turkish, German, British и т.д.] : строго на английском языке. Даты строго в формате DD.MM.YYYY. Очевидные опечатки [например 25/01996 исправлять на 25.01.1996] исправлять логически, добавляя короткое пояснение под списком.', 'Правила валидации KBS', 'KBS правила'],

  // --- БЛОК 6: 🔑 МАСТЕР_ДОСТУП ---
  ['МАСТЕР_ДОСТУП', 'Aleksei Znamenskii', 'admin / admin123', 'admin@villaturaman.com | Роль: Владелец | Все права: Финансы, Периоды, Блокировки, Окно брони, Чаты', 'Главный аккаунт'],
  ['МАСТЕР_ДОСТУП', 'Менеджер виллы', 'manager / manager2026', 'manager@villaturaman.com | Роль: Управляющий | Права: Периоды, Блокировки, Доступ к чатам', 'Персонал'],

  // --- БЛОК 7: 🤖 РОЛИ ИИ АГЕНТОВ ---
  ['РОЛЬ_АГЕНТА', 'Консьерж-Мастер', 'АКТИВЕН', 'Ты: персональный ИИ-консьерж суперхозяина Алексея Знаменского на вилле Villa Turaman в Дальяне. Твоя миссия: гостеприимно, дипломатично и авторитетно отвечать гостям. Все факты [бассейн с соленой водой 36 кв.м, джакузи с 09:00 до 18:00, Wi-Fi: Guest / villa2026, адрес Rodoslu Yaşar Sünger Sk, NO 28/2, 48600 Ortaca / Muğla, 4 спальни до 10 гостей] ты берешь строго из Блоков О ВИЛЛЕ и СЛОВАРЬ ПЕРЕМЕННЫХ. Соблюдать правила дома, налоги Турции VKN 9991120181 и никогда не давать цену ниже $180 за ночь.', 'Главная роль'],
  ['РОЛЬ_АГЕНТА', 'Юрист-Консультант', 'РЕЗЕРВ', 'Ты: ведущий юрисконсульт Villa Turaman. Контролируешь обязательную регистрацию гостей в системе KBS жандармерии по шаблону из Блока 5, соответствие закону о защите персональных данных KVKK и налоговое оформление VUK 213 Madde 230 e-Arşiv Fatura. Действуешь строго в рамках золотой формулы переговоров 30% эмпатии / 70% юридической дисциплины.', 'Правовой модуль'],
  ['РОЛЬ_АГЕНТА', 'Финансист-Бухгалтер', 'РЕЗЕРВ', 'Ты: главный финансовый менеджер Villa Turaman. Ведешь учет платежей, рассчитываешь мультивалютные цены EUR/RUB/TRY, применяешь скидку 10% за невозвратный тариф при заезде до 60 дней и блокируешь любые попытки снижения цены ниже $180.', 'Финансовый модуль'],

  // --- БЛОК 8: 📑 МАТРИЦА ДОСТУПА К ЛИСТАМ ---
  ['МАТРИЦА_ЛИСТОВ', '🏠 Главная витрина', 'РАЗРЕШЕН [ВСЕ]', 'Лист содержит главную витрину: 9 блоков с плейсхолдерами, спецификации [10 гостей, 4 спальни], статус Superhost и параметры спален 1-4. Агент использует эти данные для презентации виллы.', 'Витрина'],
  ['МАТРИЦА_ЛИСТОВ', '📸 Фото и Видео Галерея', 'РАЗРЕШЕН [ВСЕ]', 'Лист содержит медиа-банк виллы: ссылки на фото высокого разрешения и видеотуры бассейна, сада, комнат и видов на реку.', 'Медиа'],
  ['МАТРИЦА_ЛИСТОВ', '🛎️ Дополнительные услуги', 'РАЗРЕШЕН [ВСЕ]', 'Лист содержит каталог платных сервисов: трансферы из аэропорта Даламан DLM, персональный шеф-повар, массажи, прогулка на лодке, барбекю, SUP-борды.', 'Каталог услуг'],
  ['МАТРИЦА_ЛИСТОВ', '🗺️ Видео-путеводители', 'РАЗРЕШЕН [ВСЕ]', 'Лист содержит цифровые гиды по Дальяну, пляжу Изтузу, озеру Кёйджегиз, ресторанам и античному Кауносу.', 'Каталог гидов'],
  ['МАТРИЦА_ЛИСТОВ', '⚖️ Юридические документы', 'РАЗРЕШЕН [ВСЕ]', 'Лист содержит официальный договор аренды, политику KVKK, реквизиты VKN 9991120181.', 'Юриспруденция'],
  ['МАТРИЦА_ЛИСТОВ', '📋 Заявки и Бронирования', 'РАЗРЕШЕН [ВСЕ]', 'Лист фиксирует статус заявок гостей, даты заезда и выезда, число гостей и статус оплаты.', 'Операции CRM'],
  ['МАТРИЦА_ЛИСТОВ', '📅 Календарь и Тарифы', 'РАЗРЕШЕН [ВСЕ]', 'Лист содержит актуальную сетку занятости дат и тарифные ставки.', 'Календарь'],
  ['МАТРИЦА_ЛИСТОВ', '👤 Гостевые аккаунты', 'РАЗРЕШЕН [КОНСЬЕРЖ]', 'Лист содержит реестр зарегистрированных гостей и статусы блокировок.', 'Гостевой сервис'],
  ['МАТРИЦА_ЛИСТОВ', '💳 Заказы услуг и гидов', 'РАЗРЕШЕН [ВСЕ]', 'Лист содержит историю заказов доп. услуг и путеводителей.', 'Заказы'],
  ['МАТРИЦА_ЛИСТОВ', '🎟️ Доступы к путеводителям', 'РАЗРЕШЕН [ВСЕ]', 'Лист персональных доступов к медиа-материалам.', 'Доступы'],
  ['МАТРИЦА_ЛИСТОВ', '💬 Шаблоны сообщений', 'РАЗРЕШЕН [ВСЕ]', 'Лист содержит 14 профессиональных шаблонов общения на RU, EN, TR.', 'Шаблоны коммуникации'],
  ['МАТРИЦА_ЛИСТОВ', '⚙️ Системные настройки ИИ Агентов', 'РАЗРЕШЕН [ВСЕ]', 'Лист управления системой ИИ, генеральными директивами ролей, словарем переменных и матрицей прав доступа.', 'Центр управления ИИ']
];

const MASTER_TEMPLATES_ROWS = (SMART_TEMPLATES || []).map(function (tpl) {
  return [
    tpl.id,
    tpl.title ? (tpl.title.ru || '') : '',
    tpl.title ? (tpl.title.en || '') : '',
    tpl.title ? (tpl.title.tr || '') : '',
    tpl.content ? (tpl.content.ru || '') : '',
    tpl.content ? (tpl.content.en || '') : '',
    tpl.content ? (tpl.content.tr || '') : ''
  ];
});

module.exports = {
  MASTER_ABOUT_SECTIONS,
  MASTER_HOME_MAP,
  MASTER_HOME_ROWS,
  MASTER_SETTINGS_ROWS,
  MASTER_TEMPLATES_ROWS
};

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
  ['1. Главный экран', 'hero_title', 'Главный заголовок листинга в шапке', 'Dalyan Turaman [частный бассейн, 10 спальных мест]', 'Dalyan Turaman [private pool, 10 beds]', 'Dalyan Turaman [özel havuz, 10 yatak]', '', 'Вкл'],
  ['1. Главный экран', 'hero_subtitle', 'Подзаголовок виллы под главным заголовком', 'Премиальная вилла 240 м² в Дальяне. Приватный бассейн с соленой водой 36 м², уличное джакузи, 4 спальни, 10 спальных мест, 250 м до центра.', 'Premium 240 m² villa in Dalyan. Private saltwater pool 36 m², outdoor jacuzzi, 4 bedrooms, 10 beds, 250 m to center.', 'Dalyan\'da 240 m² lüks villa. 36 m² özel tuzlu su havuzu, açık jakuzi, 4 yatak odası, 10 yatak, merkeze 250 m.', '', 'Вкл'],
  ['1. Главный экран', 'hero_rating', 'Числовой рейтинг виллы', '4.98', '4.98', '4.98', 'Star', 'Вкл'],
  ['1. Главный экран', 'hero_reviews_count', 'Количество отзывов рядом с рейтингом', '48 отзывов', '48 reviews', '48 değerlendirme', '', 'Вкл'],
  ['1. Главный экран', 'hero_superhost_badge', 'Бейдж статуса суперхозяина', 'Суперхозяин', 'Superhost', 'Süper Ev Sahibi', 'Award', 'Вкл'],
  ['1. Главный экран', 'hero_location', 'Текст кликабельной локации объекта', 'Dalyan, Rodoslu Yaşar Sünger Sk, NO 28/2, Ortaca / Muğla', 'Dalyan, Rodoslu Yaşar Sünger Sk, NO 28/2, Ortaca / Muğla', 'Dalyan, Rodoslu Yaşar Sünger Sk, NO 28/2, Ortaca / Muğla', 'MapPin', 'Вкл'],
  ['1. Главный экран', 'hero_share_btn', 'Текст кнопки Поделиться', 'Поделиться', 'Share', 'Paylaş', 'Share2', 'Вкл'],
  ['1. Главный экран', 'hero_favorite_btn', 'Текст кнопки В избранное', 'В избранное', 'Save', 'Kaydet', 'Heart', 'Вкл'],
  ['1. Главный экран', 'hero_image', 'Главное фоновое фото объекта', 'Главные фотографии фасада и бассейна', 'Main facade and pool photos', 'Ana cephe ve havuz fotoğrafları', 'https://drive.google.com/file/d/1NjSHRDa5eJpQTzO9268e8LMRzDVmYtX7/view?usp=sharing,https://drive.google.com/file/d/1IZMH6wtfLHZ6ibKHfmBhPGMFntZ_fXKU/view?usp=drive_link', 'Вкл'],

  // --- БЛОК 2: ОСНОВНЫЕ ХАРАКТЕРИСТИКИ ОБЪЕКТА [HOST SPECS] ---
  ['2. Характеристики', 'host_specs_header', 'Заголовок типа жилья и владельца', 'Отдельная вилла целиком • Хозяин: Алексей Знаменский [Суперхозяин]', 'Entire villa • Host: Aleksei Znamenskii [Superhost]', 'Müstakil villa tamamı • Ev Sahibi: Aleksei Znamenskii [Süper Ev Sahibi]', '', 'Вкл'],
  ['2. Характеристики', 'host_specs_name', 'Отображаемое имя владельца виллы', 'Алексей Знаменский', 'Aleksei Znamenskii', 'Aleksei Znamenskii', '', 'Вкл'],
  ['2. Характеристики', 'host_specs_avatar', 'Аватар владельца виллы в карточке характеристик', 'Аватар владельца виллы', 'Host profile avatar', 'Ev sahibi profil avatarı', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160', 'Вкл'],
  ['2. Характеристики', 'spec_guests', 'Счетчик гостей в строке параметров', '10 гостей', '10 guests', '10 misafir', 'Users', 'Вкл'],
  ['2. Характеристики', 'spec_bedrooms', 'Счетчик спален в строке параметров', '4 спальни', '4 bedrooms', '4 yatak odası', 'Bed', 'Вкл'],
  ['2. Характеристики', 'spec_beds', 'Счетчик спальных мест [кроватей]', '10 спальных мест', '10 beds', '10 yatak', 'Bed', 'Вкл'],
  ['2. Характеристики', 'spec_baths', 'Счетчик ванных комнат', '4 ванные комнаты + гостевой туалет', '4 bathrooms + guest WC', '4 banyo + misafir WC', 'Bath', 'Вкл'],

  // --- БЛОК 3: КЛЮЧЕВЫЕ ПРЕИМУЩЕСТВА ВИЛЛЫ [HIGHLIGHTS] ---
  ['3. Преимущества', 'highlight_1_title', 'Заголовок первого преимущества', 'Опытный Суперхозяин [Superhost]', 'Experienced Superhost', 'Deneyimli Süper Ev Sahibi', 'Sparkles', 'Вкл'],
  ['3. Преимущества', 'highlight_1_desc', 'Описание первого преимущества', 'Алексей живет в Мармарисе, яхтсмен на пенсии, рейтинг 4.98★. Девиз: «Хочешь сделать хорошо - сделай сам».', 'Aleksei lives in Marmaris, retired yachtsman, 4.98★ rating. Motto: "Do it yourself to do it well".', 'Aleksei Marmaris\'te yaşıyor, emekli yatçı, 4.98★ puan. İlke: "İyi yapmak istiyorsan kendin yap".', '', 'Вкл'],
  ['3. Преимущества', 'highlight_2_title', 'Заголовок второго преимущества', 'Приватный спа-комплекс у бассейна', 'Private pool and outdoor spa', 'Özel havuz ve açık spa', 'Waves', 'Вкл'],
  ['3. Преимущества', 'highlight_2_desc', 'Описание второго преимущества', 'Бассейн с соленой водой 36 м² [май-ноябрь, подсветка 20:00-01:00] и уличное джакузи на 4 персоны [10:00-17:00].', 'Saltwater pool 36 m² [May-Nov, light 20:00-01:00] and outdoor jacuzzi for 4 [10:00-17:00].', '36 m² tuzlu su havuzu [Mayıs-Kasım, ışık 20:00-01:00] ve 4 kişilik açık jakuzi [10:00-17:00].', '', 'Вкл'],
  ['3. Преимущества', 'highlight_3_title', 'Заголовок третьего преимущества', 'Правила отмены и Закон № 7464', 'Cancellation rules and Law 7464', 'İptal kuralları ve 7464 sayılı Kanun', 'ShieldCheck', 'Вкл'],
  ['3. Преимущества', 'highlight_3_desc', 'Описание третьего преимущества', 'Краткосрочные брони - Негибкие, от 28 ночей - Строгие. Опция невозвратного тарифа со скидкой 10%. Регистрация KBS.', 'Short-term - Inflexible, 28+ nights - Strict. 10% non-refundable discount option. KBS registration.', 'Kısa dönem - Esnek olmayan, 28+ gece - Katı. %10 iadesiz indirim seçeneği. KBS kaydı.', '', 'Вкл'],

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
  ['5. Спальни', 'sleeping_title', 'Заголовок секции спальных мест', 'Где вы будете спать • 10 спальных мест в 4 спальнях', 'Where you will sleep • 10 beds in 4 bedrooms', 'Nerede uyuyacaksınız • 4 yatak odasında 10 yatak', '', 'Вкл'],
  ['5. Спальни', 'bedroom_1', 'Спальня 1 [1 этаж] • Queen + Single [3 места]', 'Спальня 1 [1 этаж] • Queen + Single [3 места]', 'Bedroom 1 [Floor 1] • Queen + Single [3 beds]', 'Yatak Odası 1 [Zemin Kat] • Queen + Single [3 yatak]', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600', 'Вкл'],
  ['5. Спальни', 'bedroom_1_desc', 'Описание спальни 1', 'Первый этаж: 1 двуспальная кровать Queen + 1 односпальная кровать, персональная ванная с душевой кабиной, кондиционер', 'First floor: 1 Queen bed + 1 single bed, en-suite bathroom with shower, air conditioning', 'Zemin kat: 1 Queen çift kişilik + 1 tek kişilik yatak, özel duşlu banyo, klima', 'BedDouble', 'Вкл'],
  ['5. Спальни', 'bedroom_1_badge', 'Бейдж кровати спальни 1', 'Queen + Single [3 места]', 'Queen + Single [3 beds]', 'Queen + Single [3 yatak]', '', 'Вкл'],
  ['5. Спальни', 'bedroom_2', 'Спальня 2 [2 этаж] • King Bed [2 места]', 'Спальня 2 [2 этаж] • King Bed [2 места]', 'Bedroom 2 [Floor 2] • King Bed [2 beds]', 'Yatak Odası 2 [2. Kat] • King Bed [2 yatak]', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600', 'Вкл'],
  ['5. Спальни', 'bedroom_2_desc', 'Описание спальни 2', 'Второй этаж: 1 большая двуспальная кровать King Size, собственная ванная комната, кондиционер, балкон с видом на горы', 'Second floor: 1 large King Size bed, en-suite bathroom, air conditioning, balcony with mountain view', 'İkinci kat: 1 geniş King Size yatak, özel banyo, klima, dağ manzaralı balkon', 'BedDouble', 'Вкл'],
  ['5. Спальни', 'bedroom_2_badge', 'Бейдж кровати спальни 2', 'King Bed [2 места]', 'King Bed [2 beds]', 'King Bed [2 yatak]', '', 'Вкл'],
  ['5. Спальни', 'bedroom_3', 'Спальня 3 [2 этаж] • Queen Bed [2 места]', 'Спальня 3 [2 этаж] • Queen Bed [2 места]', 'Bedroom 3 [Floor 2] • Queen Bed [2 beds]', 'Yatak Odası 3 [2. Kat] • Queen Bed [2 yatak]', 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600', 'Вкл'],
  ['5. Спальни', 'bedroom_3_desc', 'Описание спальни 3', 'Второй этаж: 1 двуспальная кровать Queen Size, собственная ванная комната, кондиционер, гардероб', 'Second floor: 1 Queen Size double bed, en-suite bathroom, air conditioning, wardrobe', 'İkinci kat: 1 Queen Size çift kişilik yatak, özel banyo, klima, gardırop', 'Bed', 'Вкл'],
  ['5. Спальни', 'bedroom_3_badge', 'Бейдж кроватей спальни 3', 'Queen Bed [2 места]', 'Queen Bed [2 beds]', 'Queen Bed [2 yatak]', '', 'Вкл'],
  ['5. Спальни', 'bedroom_4', 'Спальня 4 [2 этаж] • Queen + Single [3 места]', 'Спальня 4 [2 этаж] • Queen + Single [3 места]', 'Bedroom 4 [Floor 2] • Queen + Single [3 beds]', 'Yatak Odası 4 [2. Kat] • Queen + Single [3 yatak]', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600', 'Вкл'],
  ['5. Спальни', 'bedroom_4_desc', 'Описание спальни 4', 'Второй этаж: 1 двуспальная кровать Queen + 1 дополнительная односпальная кровать, собственная ванная комната, кондиционер', 'Second floor: 1 Queen bed + 1 additional single bed, en-suite bathroom, air conditioning', 'İkinci kat: 1 Queen yatak + 1 ilave tek kişilik yatak, özel banyo, klima', 'Sofa', 'Вкл'],
  ['5. Спальни', 'bedroom_4_badge', 'Бейдж дивана спальни 4', 'Queen + Single [3 места]', 'Queen + Single [3 beds]', 'Queen + Single [3 yatak]', '', 'Вкл'],

  // --- БЛОК 6: УДОБСТВА ВИЛЛЫ [AMENITIES] ---
  ['6. Удобства', 'amenities_title', 'Заголовок секции удобств', 'Что есть в этом жилье', 'What this place offers', 'Bu mekanın sundukları', '', 'Вкл'],
  ['6. Удобства', 'amenities_btn_all', 'Кнопка открытия модального окна всех удобств', 'Показать все удобства', 'Show all amenities', 'Tüm olanakları göster', '', 'Вкл'],
  ['6. Удобства', 'amenity_main_1', 'Основное удобство 1 на главной', 'Приватный открытый бассейн 36 м²', 'Private outdoor saltwater pool 36 m²', 'Özel açık tuzlu su havuzu 36 m²', 'Waves', 'Вкл'],
  ['6. Удобства', 'amenity_main_2', 'Основное удобство 2 на главной', 'Уличное джакузи на 4 персоны', 'Outdoor jacuzzi for 4 guests', '4 kişilik açık jakuzi', 'Sparkles', 'Вкл'],
  ['6. Удобства', 'amenity_main_3', 'Основное удобство 3 на главной', 'Скоростной Wi-Fi: [WIFI_NAME]', 'High-speed Wi-Fi: [WIFI_NAME]', 'Yüksek hızlı Wi-Fi: [WIFI_NAME]', 'Wifi', 'Вкл'],
  ['6. Удобства', 'amenity_main_4', 'Основное удобство 4 на главной', 'Кондиционеры во всех 4 спальнях', 'Air conditioning in all 4 bedrooms', '4 yatak odasının tamamında klima', 'Wind', 'Вкл'],
  ['6. Удобства', 'amenity_main_5', 'Основное удобство 5 на главной', 'Полноценная кухня Beko', 'Fully equipped Beko kitchen', 'Tam donanımlı Beko mutfak', 'Utensils', 'Вкл'],
  ['6. Удобства', 'amenity_main_6', 'Основное удобство 6 на главной', 'Бесплатная парковка на 2 авто', 'Free on-site parking for 2 cars', 'Tesis içi 2 araçlık ücretsiz otopark', 'Car', 'Вкл'],
  ['6. Удобства', 'amenity_main_7', 'Основное удобство 7 на главной', 'Зона BBQ и обеденный стол на 8 мест', 'BBQ area and outdoor dining table for 8', 'Barbekü alanı ve 8 kişilik açık yemek masası', 'Flame', 'Вкл'],
  ['6. Удобства', 'amenity_main_8', 'Основное удобство 8 на главной', 'Стиральная машина на каждом этаже', 'Washing machine on each floor', 'Her katta çamaşır makinesi', 'WashingMachine', 'Вкл'],
  ['6. Удобства', 'amenity_main_9', 'Основное удобство 9 на главной', 'Доступная среда и подъемник', 'Accessible environment & pool lift', 'Erişilebilir ortam ve havuz asansörü', 'Shield', 'Вкл'],
  ['6. Удобства', 'amenity_main_10', 'Основное удобство 10 на главной', 'Видеонаблюдение и датчики дыма', 'CCTV security and smoke detectors', 'Güvenlik kamerası ve duman dedektörleri', 'ShieldCheck', 'Вкл'],
  ['6. Удобства', 'amenity_cat1_title', 'Модальное окно: Категория 1 Заголовок', 'Виды и природа', 'Scenic Views & Nature', 'Manzara ve Doğa', 'Mountain', 'Вкл'],
  ['6. Удобства', 'amenity_cat1_item1', 'Модальное окно: Категория 1 Пункт 1', 'Панорамный вид на горы Дальяна', 'Panoramic view of Dalyan rock mountains', 'Dalyan dağlarının panoramik manzarası', 'Check', 'Вкл'],
  ['6. Удобства', 'amenity_cat1_item2', 'Модальное окно: Категория 1 Пункт 2', 'Вид на реку и сад', 'Direct river and lush garden view', 'Nehir ve yemyeşil bahçe manzarası', 'Check', 'Вкл'],
  ['6. Удобства', 'amenity_cat1_item3', 'Модальное окно: Категория 1 Пункт 3', 'Близость набережной Дальяна [400 м]', 'Close to Dalyan promenade [400 m]', 'Dalyan kordonuna yakın [400 m]', 'Check', 'Вкл'],
  ['6. Удобства', 'amenity_cat2_title', 'Модальное окно: Категория 2 Заголовок', 'Бассейн и спа', 'Pool & Spa', 'Havuz ve Spa', 'Waves', 'Вкл'],
  ['6. Удобства', 'amenity_cat2_item1', 'Модальное окно: Категория 2 Пункт 1', 'Приватный бассейн с соленой водой 4×9 м [глубина 1.5м]', 'Private saltwater pool 4x9m [depth 1.5m]', 'Özel tuzlu su havuzu 4x9m [derinlik 1.5m]', 'Check', 'Вкл'],
  ['6. Удобства', 'amenity_cat2_item2', 'Модальное окно: Категория 2 Пункт 2', 'Шезлонги и зона для загара', 'Comfortable sun loungers and tanning area', 'Konforlu şezlonglar ve güneşlenme alanı', 'Check', 'Вкл'],
  ['6. Удобства', 'amenity_cat2_item3', 'Модальное окно: Категория 2 Пункт 3', 'Летний душ у бассейна', 'Poolside outdoor summer shower', 'Havuz başı açık yaz duşu', 'Check', 'Вкл'],
  ['6. Удобства', 'amenity_cat2_item4', 'Модальное окно: Категория 2 Пункт 4', 'Уличное джакузи на 4 персоны [10:00-17:00, 15 мин каждые 45 мин]', 'Outdoor jacuzzi for 4 [10:00-17:00, 15 min every 45 min]', '4 kişilik açık jakuzi [10:00-17:00, 45 dakikada bir 15 dk]', 'Check', 'Вкл'],
  ['6. Удобства', 'amenity_cat3_title', 'Модальное окно: Категория 3 Заголовок', 'Кухня и столовая', 'Kitchen & Dining', 'Mutfak ve Yemek', 'Utensils', 'Вкл'],
  ['6. Удобства', 'amenity_cat3_item1', 'Модальное окно: Категория 3 Пункт 1', 'Большой двухкамерный холодильник Beko', 'Large double-door Beko refrigerator', 'Geniş çift kapılı Beko buzdolabı', 'Check', 'Вкл'],
  ['6. Удобства', 'amenity_cat3_item2', 'Модальное окно: Категория 3 Пункт 2', 'Посудомоечная машина', 'Modern dishwasher', 'Modern bulaşık makinesi', 'Check', 'Вкл'],
  ['6. Удобства', 'amenity_cat3_item3', 'Модальное окно: Категория 3 Пункт 3', 'Духовой шкаф Beko и варочная панель', 'Beko oven and cooktop', 'Beko fırın ve ocak', 'Check', 'Вкл'],
  ['6. Удобства', 'amenity_cat3_item4', 'Модальное окно: Категория 3 Пункт 4', 'Кофемашина эспрессо и чайник', 'Espresso coffee machine and kettle', 'Espresso kahve makinesi ve su ısıtıcısı', 'Check', 'Вкл'],
  ['6. Удобства', 'amenity_cat3_item5', 'Модальное окно: Категория 3 Пункт 5', 'Полный комплект посуды и бокалов для вина', 'Full set of cookware, dishes and wine glasses', 'Eksiksiz tencere, tabak ve kadeh takımı', 'Check', 'Вкл'],
  ['6. Удобства', 'amenity_cat4_title', 'Модальное окно: Категория 4 Заголовок', 'Комфорт и связь', 'Comfort & Tech', 'Konfor ve Teknoloji', 'Wifi', 'Вкл'],
  ['6. Удобства', 'amenity_cat4_item1', 'Модальное окно: Категория 4 Пункт 1', 'Скоростной оптоволоконный Wi-Fi', 'High-speed fiber-optic Wi-Fi', 'Yüksek hızlı fiber optik Wi-Fi', 'Check', 'Вкл'],
  ['6. Удобства', 'amenity_cat4_item2', 'Модальное окно: Категория 4 Пункт 2', 'Сплит-системы кондиционирования во всех спальнях', 'Individual split AC units in all bedrooms', 'Tüm yatak odalarında bağımsız split klima', 'Check', 'Вкл'],
  ['6. Удобства', 'amenity_cat4_item3', 'Модальное окно: Категория 4 Пункт 3', 'Smart TV 55 дюймов с Netflix и YouTube', 'Smart TV 55 inch with Netflix and YouTube', 'Netflix ve YouTube özellikli 55 inch Smart TV', 'Check', 'Вкл'],
  ['6. Удобства', 'amenity_cat4_item4', 'Модальное окно: Категория 4 Пункт 4', 'Обеденная зона на воздухе на 8 мест и крыльцо', 'Outdoor dining area for 8 and cozy porch', '8 kişilik açık yemek alanı ve veranda', 'Check', 'Вкл'],
  ['6. Удобства', 'amenity_cat5_title', 'Модальное окно: Категория 5 Заголовок', 'Безопасность дома', 'Home Safety', 'Ev Güvenliği', 'Shield', 'Вкл'],
  ['6. Удобства', 'amenity_cat5_item1', 'Модальное окно: Категория 5 Пункт 1', 'Огороженная приватная территория и автоматическое освещение', 'Gated private territory and automated lighting', 'Çevrili özel mülk alanı ve otomatik aydınlatma', 'Check', 'Вкл'],
  ['6. Удобства', 'amenity_cat5_item2', 'Модальное окно: Категория 5 Пункт 2', 'Система наружного видеонаблюдения по периметру', 'External perimeter CCTV security cameras', 'Dış çevre güvenlik kamerası sistemi', 'Check', 'Вкл'],
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
  ['7. Отзывы', 'review_1_text', 'Отзыв 1: Текст отзыва', 'Потрясающая вилла! Вид на горы просто захватывает дух, бассейн с соленой водой чистейший, джакузи великолепно расслабляет. Алексей был на связи 24/7, помог организовать незабываемый круиз на лодке по озеру Кёйджегиз. Обязательно вернемся!', 'Stunning villa! Mountain views are breathtaking, saltwater pool is pristine, jacuzzi is great. Aleksei was available 24/7 and helped organize an unforgettable boat trip on Lake Koycegiz. We will definitely return!', 'Harika villa! Dağ manzarası nefes kesici, tuzlu su havuzu tertemiz, jakuzi harika. Aleksei 7/24 iletişimdeydi ve Köyceğiz Gölü\'nde unutulmaz bir tekne turu düzenlememize yardımcı oldu. Kesinlikle tekrar geleceğiz!', '', 'Вкл'],
  ['7. Отзывы', 'review_2_author', 'Отзыв 2: Автор и дата', 'Markus Webber • Июль 2026', 'Markus Webber • July 2026', 'Markus Webber • Temmuz 2026', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120', 'Вкл'],
  ['7. Отзывы', 'review_2_text', 'Отзыв 2: Текст отзыва', 'Outstanding hospitality and pristine villa in the heart of Dalyan. Fast Wi-Fi, 4 spacious bedrooms, and peaceful neighborhood. Aleksei is truly a top Superhost!', 'Outstanding hospitality and pristine villa in the heart of Dalyan. Fast Wi-Fi, 4 spacious bedrooms, and peaceful neighborhood. Aleksei is truly a top Superhost!', 'Dalyan\'ın kalbinde olağanüstü misafirperverlik ve kusursuz villa. Hızlı Wi-Fi, 4 geniş yatak odası ve huzurlu bir çevre. Aleksei gerçekten harika bir Süper Ev Sahibi!', '', 'Вкл'],
  ['7. Отзывы', 'review_3_author', 'Отзыв 3: Автор и дата', 'Ahmet Yılmaz • Июнь 2026', 'Ahmet Yilmaz • June 2026', 'Ahmet Yılmaz • Haziran 2026', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120', 'Вкл'],
  ['7. Отзывы', 'review_3_text', 'Отзыв 3: Текст отзыва', 'Dalyan\'da kaldığımız en konforlu villa. 4 banyolu 4 yatak odası ailemiz için mükemmeldi. Bahçe ve havuz bakımı harikaydı, teşekkürler Aleksei!', 'The most comfortable villa in Dalyan. 4 en-suite bedrooms were perfect for our family. Garden and pool maintenance were great, thank you Aleksei!', 'Dalyan\'da kaldığımız en konforlu villa. 4 banyolu 4 yatak odası ailemiz için mükemmeldi. Bahçe ve havuz bakımı harikaydı, teşekkürler Aleksei!', '', 'Вкл'],
  ['7. Отзывы', 'review_4_author', 'Отзыв 4: Автор и дата', 'Дмитрий и Анна • Май 2026', 'Dmitry and Anna • May 2026', 'Dmitry ve Anna • Mayıs 2026', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120', 'Вкл'],
  ['7. Отзывы', 'review_4_text', 'Отзыв 4: Текст отзыва', 'Идеально для семейного отдыха до 10 человек. Закрытая территория, 250 метров до центра Дальяна, тишина. Видео-гид от Алексея открыл нам секретные пляжи и отличные рыбные рестораны.', 'Perfect for a family vacation up to 10 guests. Gated territory, 250 meters to Dalyan center, quiet. Aleksei\'s video guide revealed secret beaches and great fish restaurants.', '10 kişiye kadar aile tatili için ideal. Çevrili özel alan, Dalyan merkezine 250 metre, sessizlik. Aleksei\'nin video rehberi bize gizli plajları ve harika balık restoranlarını keşfettirdi.', '', 'Вкл'],

  // --- БЛОК 8: ЛОКАЦИЯ И ОКРЕСТНОСТИ ДАЛЬЯНА [LOCATION] ---
  ['8. Локация', 'location_title', 'Заголовок секции локации', 'Расположение: Дальян, Ортаджа, Мугла, Турция', 'Location: Dalyan, Ortaca, Mugla, Turkey', 'Konum: Dalyan, Ortaca, Muğla, Türkiye', 'MapPin', 'Вкл'],
  ['8. Локация', 'location_desc', 'Подробный текст об окрестностях Дальяна', 'Вилла Turaman находится в самом центре Дальяна: всего 250 метров до пешеходной улицы, 400 метров до речной набережной, 350 метров до ресторана La Boheme Dalyan. Песчаный пляж Изтузу - 11 км [15 минут на машине или лодке], аэропорт Даламан - 30 км. В пешей доступности древний город Каунос и Ликийские гробницы.', 'Villa Turaman is located in the heart of Dalyan: only 250 meters to the pedestrian street, 400 meters to the river promenade, 350 meters to La Boheme Dalyan restaurant. Sandy Iztuzu beach is 11 km [15 min by car or boat], Dalaman airport is 30 km. Ancient Kaunos and Lycian Tombs are within easy reach.', 'Villa Turaman, Dalyan merkezinde yer almaktadır: yaya caddesine 250 metre, nehir kordonuna 400 metre, La Boheme Dalyan restoranına 350 metre. İztuzu plajı 11 km [arabayla veya tekneyle 15 dk], Dalaman havalimanı 30 km. Antik Kaunos ve Likya Kaya Mezarları çok yakındır.', '', 'Вкл'],
  ['8. Локация', 'location_badge', 'Текст плашки GPS и расстояния до аэропорта', 'GPS: 36.8336° N, 28.6439° E • 250м до центра • 11 км до пляжа Изтузу • 30 км до DLM', 'GPS: 36.8336° N, 28.6439° E • 250m to center • 11 km to Iztuzu Beach • 30 km to DLM', 'GPS: 36.8336° N, 28.6439° E • Merkeze 250m • İztuzu Plajı 11 km • DLM 30 km', 'Navigation', 'Вкл'],
  ['8. Локация', 'location_image', 'Панорамная фотография окрестностей', 'Фото природы Дальяна', 'Dalyan nature photo', 'Dalyan doğa fotoğrafı', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200', 'Вкл'],

  // --- БЛОК 9: КАРТОЧКА ВЛАДЕЛЬЦА [HOST PROFILE] ---
  ['9. Хозяин', 'host_card_title', 'Заголовок карточки владельца', 'Хозяин: Алексей Знаменский', 'Host: Aleksei Znamenskii', 'Ev Sahibi: Aleksei Znamenskii', '', 'Вкл'],
  ['9. Хозяин', 'host_card_subtitle', 'Подзаголовок статуса суперхозяина', 'Суперхозяин на Airbnb • Яхтсмен на пенсии • Живет в Мармарисе', 'Superhost on Airbnb • Retired yachtsman • Lives in Marmaris', 'Airbnb Süper Ev Sahibi • Emekli yatçı • Marmaris\'te yaşıyor', 'Award', 'Вкл'],
  ['9. Хозяин', 'host_card_verified', 'Бейдж подтверждения личности', 'Личность подтверждена • Девиз: «Хочешь сделать хорошо - сделай сам»', 'Identity verified • Motto: "Do it yourself to do it well"', 'Kimlik doğrulandı • İlke: "İyi yapmak istiyorsan kendin yap"', 'ShieldCheck', 'Вкл'],
  ['9. Хозяин', 'host_card_response_time', 'Бейдж времени ответа на сообщения', 'Время ответа: в течение часа • Языки: RU, EN, TR', 'Response time: within an hour • Languages: RU, EN, TR', 'Yanıt süresi: bir saat içinde • Diller: RU, EN, TR', 'Clock', 'Вкл'],
  ['9. Хозяин', 'host_card_languages', 'Заголовок языков общения', 'Интересы: Велоспорт, Парусный спорт, Природа • Мечта: Португалия', 'Interests: Cycling, Sailing, Nature • Dream: Portugal', 'İlgi alanları: Bisiklet, Yelken, Doğa • Hayal: Portekiz', 'Globe2', 'Вкл'],
  ['9. Хозяин', 'host_card_help_text', 'Описание помощи гостям', 'Штампы путешествий: Дубай [3 поездки], Абу-Даби [март 2026 г.]. Помощь в организации трансфера, аренде авто и экскурсий.', 'Travel stamps: Dubai [3 trips], Abu Dhabi [March 2026]. Assistance with transfers, car rental and private tours.', 'Seyahat pulları: Dubai [3 seyahat], Abu Dabi [Mart 2026]. Transfer, araç kiralama ve turlarda destek.', '', 'Вкл'],
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

  // --- БЛОК 2: 🧩 СЛОВАРЬ ПЕРЕМЕННЫХ И КОНТАКТОВ [ИСТИННЫЙ SSOT] ---
  ['ПЕРЕМЕННАЯ', 'wifi_name', 'Guest', 'Имя гостевой сети Wi-Fi виллы', 'Плейсхолдер [WIFI_NAME]'],
  ['ПЕРЕМЕННАЯ', 'wifi_password', 'villa2026', 'Пароль гостевой сети Wi-Fi', 'Плейсхолдер [WIFI_PASSWORD]'],
  ['ПЕРЕМЕННАЯ', 'address', 'Dalyan, Rodoslu Yaşar Sünger Sk, NO 28/2, 48600 Ortaca / Muğla', 'Точный физический адрес виллы', 'Плейсхолдер [ADDRESS]'],
  ['ПЕРЕМЕННАЯ', 'maps_url', 'https://maps.app.goo.gl/tPgCjCwz4pzq28pE9', 'Прямая ссылка на геолокацию Google Maps', 'Плейсхолдер [MAPS_URL]'],
  ['ПЕРЕМЕННАЯ', 'checkin_time', '16:00', 'Стандартное время заезда гостей', 'Плейсхолдер [CHECKIN_TIME]'],
  ['ПЕРЕМЕННАЯ', 'checkout_time', '10:00', 'Стандартное время выезда гостей', 'Плейсхолдер [CHECKOUT_TIME]'],
  ['ПЕРЕМЕННАЯ', 'checkin_method', 'Электронный смарт-замок и мини-сейф с кодом / личная встреча владельцем', 'Способ передачи ключей', 'Плейсхолдер [CHECKIN_METHOD]'],
  ['ПЕРЕМЕННАЯ', 'key_handover', 'Оставьте ключи в мини-сейфе с кодом у входной двери или на кухонном столе', 'Инструкция возврата ключей', 'Плейсхолдер [KEY_HANDOVER]'],
  ['ПЕРЕМЕННАЯ', 'platform_name', 'Villa Turaman Direct', 'Название платформы бронирования', 'Плейсхолдер [PLATFORM_NAME]'],
  ['ПЕРЕМЕННАЯ', 'transfer_partner_name', 'Dalyan VIP Transfer Service', 'Название компании-партнера по трансферу', 'Плейсхолдер [TRANSFER_PARTNER_NAME]'],
  ['ПЕРЕМЕННАЯ', 'transfer_partner_phone', '+90 543 335 80 70', 'Прямой контактный телефон партнера по трансферу [Ahmet]', 'Плейсхолдер [TRANSFER_PARTNER_PHONE]'],
  ['ПЕРЕМЕННАЯ', 'transfer_partner_contact', 'Ahmet', 'Имя диспетчера / координатора трансфера', 'Плейсхолдер [TRANSFER_PARTNER_CONTACT]'],
  ['ПЕРЕМЕННАЯ', 'transfer_partner_whatsapp', '+90 543 335 80 70', 'WhatsApp для оперативного заказа трансфера гостями', 'Плейсхолдер [TRANSFER_PARTNER_WHATSAPP]'],
  ['ПЕРЕМЕННАЯ', 'host_phone', '+90 534 000 00 00', 'Телефон суперхозяина Алексея Знаменского', 'Плейсхолдер [HOST_PHONE]'],
  ['ПЕРЕМЕННАЯ', 'host_whatsapp', '+90 534 000 00 00', 'WhatsApp суперхозяина Алексея', 'Плейсхолдер [HOST_WHATSAPP]'],
  ['ПЕРЕМЕННАЯ', 'host_telegram', '@villaturaman', 'Telegram суперхозяина для прямой связи', 'Плейсхолдер [HOST_TELEGRAM]'],

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
  ['РОЛЬ_АГЕНТА', 'Консьерж-Мастер', 'АКТИВЕН', 'Ты: персональный ИИ-консьерж суперхозяина Алексея Знаменского на вилле Villa Turaman в Дальяне. Твоя миссия: гостеприимно, дипломатично и авторитетно отвечать гостям. Все факты ты берешь строго из Google Таблицы [листов SETTINGS, SERVICES, LEGAL, GUIDES, HOME]. Если гость просит телефон или контакт трансфера / такси : СРАЗУ выдавай прямой номер партнера Ahmet: +90 543 335 80 70 [WhatsApp: +90 543 335 80 70] без лишних встречных вопросов! Никогда не давать цену аренды виллы ниже $180 за ночь.', 'Главная роль'],
  ['РОЛЬ_АГЕНТА', 'Юрист-Консультант', 'АКТИВЕН', 'Ты: ведущий юрисконсульт Villa Turaman. Контролируешь обязательную регистрацию гостей в системе KBS жандармерии по шаблону из Блока 5, соответствие закону о защите персональных данных KVKK и налоговое оформление VUK 213 Madde 230 e-Arşiv Fatura. Действуешь строго в рамках золотой формулы переговоров 30% эмпатии / 70% юридической дисциплины.', 'Правовой модуль'],
  ['РОЛЬ_АГЕНТА', 'Финансист-Бухгалтер', 'АКТИВЕН', 'Ты: главный финансовый менеджер и бухгалтер Villa Turaman. Рассчитываешь фактуры e-Arşiv Fatura по стандарту Блока 9: 100% брутто на имя гостя, валюта TRY, курс TCMB на дату выезда, KDV 20% и Konaklama 1% с делителем 1.21, Birim Fiyat с 8 знаками и примечание Not прописью на турецком до куруша.', 'Финансовый модуль'],
  ['РОЛЬ_АГЕНТА', 'Секретарь-Помощник', 'АКТИВЕН', 'Ты: исполнительный секретарь суперхозяина Алексея. Принимаешь оперативные поручения, фиксируешь задачи в лист CRM 📋 Задачи и Поручения Секретаря, организуешь файлы и папки в Google Drive проекта и готовишь отчеты.', 'Секретарь'],

  // --- БЛОК 8: ⚖️ СТРАТЕГИЯ ДИАЛОГА И ПЕРЕГОВОРОВ [SPARK RULES MANIFEST] ---
  ['СТРАТЕГИЯ_ДИАЛОГА', 'dialog_formula_ratio', '30% эмпатия / 70% юридическая точность', 'Золотая формула переговоров: 30% вежливости и заботы, 70% юридического и налогового порядка', 'Стандарт диалога'],
  ['СТРАТЕГИЯ_ДИАЛОГА', 'no_dialog_close_window', '15 минут', 'Запрет закрытия диалога при активном операторе или в пределах 15-минутного окна ответа', 'Таймаут'],
  ['СТРАТЕГИЯ_ДИАЛОГА', 'tax_registration_vkn', '9991120181', 'Официальный налоговый идентификатор владельца виллы в налоговой Ortaca Vergi Dairesi', 'Налоговый номер'],
  ['СТРАТЕГИЯ_ДИАЛОГА', 'invoice_legal_basis', 'VUK 213 Madde 230', 'Законное основание для оформления электронных фактур e-Arşiv Fatura', 'Статья закона'],
  ['СТРАТЕГИЯ_ДИАЛОГА', 'support_ticket_ref', '#156374380', 'Идентификатор базового кейса и обращений для правовой ссылки', 'Тикет'],

  // --- БЛОК 9: 🧾 СЧЕТ-ФАКТУРЫ E-ARŞİV FATURA [GİB PORTAL] ---
  ['СЧЕТ_ФАКТУРА_GIB', 'vat_kdv_rate', '20%', 'Ставка налога на добавленную стоимость KDV [НДС] в Турции', 'Налог KDV'],
  ['СЧЕТ_ФАКТУРА_GIB', 'accommodation_tax_rate', '1%', 'Ставка налога на проживание Konaklama Vergisi', 'Налог на проживание'],
  ['СЧЕТ_ФАКТУРА_GIB', 'total_tax_divisor', '1.21', 'Коэффициент-делитель брутто для расчета налогооблагаемой базы [Matrah = Gross / 1.21]', 'Делитель налогов'],
  ['СЧЕТ_ФАКТУРА_GIB', 'unit_price_decimals', '8', 'Число десятичных знаков для цены за единицу [Birim Fiyat] на портале GİB', 'Точность округления'],
  ['СЧЕТ_ФАКТУРА_GIB', 'currency_code', 'TRY', 'Каноническая валюта выставления счетов на портале GİB [Türk Lirası]', 'Валюта GİB'],
  ['СЧЕТ_ФАКТУРА_GIB', 'recipient_type', '100% Gross на имя гостя', 'Счет выставляется на 100% брутто-суммы на имя гостя [Alıcı], а не платформы', 'Получатель фактуры'],
  ['СЧЕТ_ФАКТУРА_GIB', 'tcmb_rate_policy', 'Döviz Alış на дату выезда', 'Курс конвертации валюты: курс ЦБ Турции [TCMB Döviz Alış] на дату выезда гостя', 'Курс валюты'],
  ['СЧЕТ_ФАКТУРА_GIB', 'tcmb_rate_time', '15:30', 'Время публикации официального курса TCMB [если выезд в выходной или праздник : берется курс предшествующей пятницы]', 'Время фиксации'],
  ['СЧЕТ_ФАКТУРА_GIB', 'turkish_words_note_template', 'YALNIZ [AMOUNT_WORDS] TL [KURUS_WORDS] KURUŞTUR. E ARŞİV İZNİ KAPSAMINDA ELEKTRONİK ORTAMDA İLETİLMİŞTİR.', 'Обязательный шаблон примечания [Not] с суммой прописью на турецком языке до куруша', 'Шаблон Not'],
  ['СЧЕТ_ФАКТУРА_GIB', 'invoice_law_reference', 'VUK 213 Madde 230', 'Законное основание выставления e-Arşiv Fatura для платформ краткосрочной аренды', 'Правовой базис'],

  // --- БЛОК 10: 📑 ДИНАМИЧЕСКИЙ БЛОК-МАРШРУТИЗАТОР И МАТРИЦА ЛИСТОВ ---
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
  ['МАТРИЦА_ЛИСТОВ', '📋 Задачи и Поручения Секретаря', 'РАЗРЕШЕН [ВСЕ]', 'Лист оперативных поручений хозяина, задач бухгалтерии, юридических сверок и ссылок на документы Google Drive.', 'Рабочий стол хозяина']
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

// --- ЭТАЛОННЫЕ СТРОКИ ГАЛЕРЕИ: 14 МЕДИА-ОБЪЕКТОВ ВСЕХ ЗОН ВИЛЛЫ ---
const MASTER_GALLERY_ROWS = [
  ['gal-01', 'Фасад и Бассейн', 'Приватный бассейн с соленой водой 36 кв.м и шезлонги', '', '', '', '', 'Фото', 'https://drive.google.com/file/d/1NjSHRDa5eJpQTzO9268e8LMRzDVmYtX7/view?usp=sharing', 'Бассейн 36м² и зона отдыха', '', ''],
  ['gal-02', 'Фасад и Бассейн', 'Вечерняя гидроподсветка бассейна и джакузи', '', '', '', '', 'Фото', 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=1600', 'Вечерняя подсветка бассейна', '', ''],
  ['gal-03', 'Интерьер и Гостиная', 'Просторная гостиная со Smart TV 55" и кондиционером', '', '', '', '', 'Фото', 'https://drive.google.com/file/d/1IZMH6wtfLHZ6ibKHfmBhPGMFntZ_fXKU/view?usp=drive_link', 'Светлая гостиная виллы', '', ''],
  ['gal-04', 'Кухня и Столовая', 'Полноценная кухня с индукционной панелью и кофемашиной', '', '', '', '', 'Фото', 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1600', 'Кухня со всей техникой', '', ''],
  ['gal-05', 'Спальни виллы', 'Мастер-спальня 1 на первом этаже с кроватью King Size', '', '', '', '', 'Фото', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1600', 'Спальня 1 с видом на бассейн', '', ''],
  ['gal-06', 'Спальни виллы', 'Мастер-спальня 2 на втором этаже с балконом с видом на горы', '', '', '', '', 'Фото', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1600', 'Спальня 2 Queen Bed с балконом', '', ''],
  ['gal-07', 'Спальни виллы', 'Спальня 3 с двумя раздельными комфортными кроватями', '', '', '', '', 'Фото', 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1600', 'Спальня 3 с 2 кроватями', '', ''],
  ['gal-08', 'Спальни виллы', 'Спальня 4 с ортопедическим диваном-кроватью в лаундж-зоне', '', '', '', '', 'Фото', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600', 'Спальня 4 в лаундж-зоне', '', ''],
  ['gal-09', 'Санузлы', '4 индивидуальные ванные комнаты с тропическим душем', '', '', '', '', 'Фото', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1600', 'Индивидуальная ванная комната', '', ''],
  ['gal-10', 'Сад и Терраса', 'Приватный сад с обеденным столом и зоной барбекю', '', '', '', '', 'Фото', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1600', 'Зона BBQ и обеденная пергола', '', ''],
  ['gal-11', 'Бассейн и спа', 'Уличное джакузи с автоматическим гидромассажем', '', '', '', '', 'Фото', 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=1600', 'Джакузи и летний душ', '', ''],
  ['gal-12', 'Природа Дальяна', 'Набережная реки Дальян в 5 минутах пешком от виллы', '', '', '', '', 'Фото', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600', 'Живописная река Дальян', '', ''],
  ['gal-13', 'Достопримечательности', 'Ликийские скальные гробницы IV века до н.э. с подсветкой', '', '', '', '', 'Фото', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600', 'Ликийские скальные гробницы', '', ''],
  ['gal-14', 'Пляжи и заповедники', 'Песчаный черепаший пляж Изтузу и озеро Кёйджегиз', '', '', '', '', 'Фото', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1600', 'Пляж Изтузу и черепахи', '', '']
];

// --- ЭТАЛОННЫЕ СТРОКИ ДОПОЛНИТЕЛЬНЫХ УСЛУГ: 8 ПРЕМИАЛЬНЫХ СЕРВИСОВ ---
const MASTER_SERVICES_ROWS = [
  ['prod-1', 'VIP-трансфер из аэропорта Даламан [DLM]', 'Комфортабельный Mercedes Vito с кондиционером и напитками', '', '', '', '', '50', '5000', '1800', 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200', 'Да', 'Трансфер', 'https://youtube.com/watch?v=transfer', 'Встреча в зоне прилета с именной табличкой. Время в пути до виллы 25 минут. В салоне бесплатный Wi-Fi и прохладительные напитки.', '', ''],
  ['prod-2', 'Приватный круиз на яхте по реке Дальян и пляжу Изтузу', 'Традиционная деревянная лодка: Капитан Адам, Ликийские гробницы', '', '', '', '', '250', '25000', '9000', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200', 'Да', 'Круиз', 'https://youtube.com/watch?v=cruise', 'Эксклюзивный дневной маршрут: Ликийские гробницы, ловля голубых крабов, купание на пляже Изтузу и обед от капитана со свежей рыбой.', '', ''],
  ['prod-3', 'Ужин от персонального шеф-повара на вилле', '4-курсовой ужин у бассейна: традиционные турецкие мезе и морепродукты', '', '', '', '', '120', '12000', '4300', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200', 'Да', 'Шеф', 'https://youtube.com/watch?v=chef', 'Шеф-повар лично закупает фермерские продукты на рынке Дальяна, готовит ужин на вашей кухне, сервирует стол и наводит идеальный порядок.', '', ''],
  ['prod-4', 'Премиальный BBQ-вечер на углях в саду виллы', 'Стейки рибай, каре ягненка на косточке и овощи гриль', '', '', '', '', '160', '16000', '5800', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200', 'Да', 'BBQ', 'https://youtube.com/watch?v=bbq', 'В стоимость входит премиальное маринованное фермерское мясо, отборные угли, розжиг, лаваш, соусы и работа гриль-мастера в течение 3 часов.', '', ''],
  ['prod-5', 'СПА-тур и грязевые источники Султание', 'Омолаживающие минеральные термы и ванны озера Кёйджегиз', '', '', '', '', '70', '7000', '2500', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200', 'Да', 'СПА', 'https://youtube.com/watch?v=spa', 'Трансфер на моторной лодке прямо от причала виллы. Входные билеты в термальные комплексы и радоновые бассейны включены.', '', ''],
  ['prod-6', 'Аренда сапбордов [SUP] и двухместного каяка', '2 устойчивых SUP-борда и двухместный экспедиционный каяк', '', '', '', '', '80', '8000', '2900', 'https://images.unsplash.com/photo-1517404215738-15263e9f9178?w=1200', 'Да', 'Спорт', 'https://youtube.com/watch?v=sup', 'Доставка оборудования прямо к вилле на весь период проживания. В комплекте весла, страховочные лиши и спасательные жилеты.', '', ''],
  ['prod-7', 'Прокат электровелосипедов для прогулок по Дальяну', '2 современных электробайка с запасом хода до 60 км', '', '', '', '', '40', '4000', '1500', 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=1200', 'Да', 'Транспорт', 'https://youtube.com/watch?v=bike', 'Идеальный способ исследовать гранатовые сады и улочки Дальяна. В комплекте шлемы, замки и держатели для смартфонов с навигатором.', '', ''],
  ['prod-8', 'Дополнительная экспресс-уборка и смена белья', 'Внеплановая влажная уборка виллы, замена полотенец и постельного белья', '', '', '', '', '60', '6000', '2200', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200', 'Да', 'Сервис', 'https://youtube.com/watch?v=cleaning', 'Полная уборка всех 4 спален, кухни и санузлов, мытье полов эко-средствами, замена постельных комплектов сатин премиум и банных полотенец.', '', '']
];

// --- ЭТАЛОННЫЕ СТРОКИ ВИДЕО-ПУТЕВОДИТЕЛЕЙ: 6 АВТОРСКИХ ГИДОВ СУПЕРХОЗЯИНА ---
const MASTER_GUIDES_ROWS = [
  ['guide-1', 'Секретные маршруты реки Дальян и черепаший пляж Изтузу', 'Эксклюзивный 40-минутный 4K видео-гид от Алексея Знаменского', '', '', '', '', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200', 'Локации', 'https://youtube.com/watch?v=guide1', '20', '2000', '700', 'https://youtube.com/watch?v=preview1', 'Где встретить гигантских черепах Caretta-Caretta, как взять лодку без наценок и какие дикие бухты скрыты от массовых туристов.', '', ''],
  ['guide-2', 'Ликийские скальные гробницы и древний город Каунос', 'Историческое погружение в тайны Ликийского царства и акрополя', '', '', '', '', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200', 'История', 'https://youtube.com/watch?v=guide2', '25', '2500', '900', 'https://youtube.com/watch?v=preview2', 'Маршрут безопасного подъема к амфитеатру Кауноса, тайные тропы древней гавани и лучшие видовые точки для фотосъемки на закате.', '', ''],
  ['guide-3', 'Гастрономический гид: топ-10 ресторанов и гранатовые сады', 'Где попробовать настоящую турецкую кухню, свежую рыбу и мезе', '', '', '', '', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200', 'Гастрономия', 'https://youtube.com/watch?v=guide3', '15', '1500', '550', 'https://youtube.com/watch?v=preview3', 'Список проверенных ресторанов Дальяна, включая культовый ресторан Çiçek Restoran, явки шефов и специальные привилегии для гостей нашей виллы.', '', ''],
  ['guide-4', 'Термальные источники Султание и минеральные грязи', 'Как получить максимальный оздоровительный эффект без толп', '', '', '', '', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200', 'Здоровье', 'https://youtube.com/watch?v=guide4', '20', '2000', '700', 'https://youtube.com/watch?v=preview4', 'Расписание работы источников, часы отсутствия экскурсионных теплоходов, состав минеральных вод и правильный порядок принятия ванн.', '', ''],
  ['guide-5', 'Горные трекинговые тропы и смотровая площадка Радар', 'Пешие маршруты с панорамными видами на дельту реки и косу Изтузу', '', '', '', '', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200', 'Трекинг', 'https://youtube.com/watch?v=guide5', '15', '1500', '550', 'https://youtube.com/watch?v=preview5', 'Точные GPS-треки подъема на высоту 500 метров над уровнем моря, рекомендации по обуви, запасу воды и безопасности на Ликийской тропе.', '', ''],
  ['guide-6', 'Субботний фермерский рынок Дальяна: секреты и покупки', 'Инструкция по выбору домашних сыров, оливок, гранатового сиропа', '', '', '', '', 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1200', 'Шоппинг', 'https://youtube.com/watch?v=guide6', '10', '1000', '350', 'https://youtube.com/watch?v=preview6', 'С какими фермерами стоит торговаться, где найти натуральное холодное оливковое масло первого отжима и свежайший инжир.', '', '']
];

// --- ЭТАЛОННЫЕ СТРОКИ ЮРИДИЧЕСКИХ ДОКУМЕНТОВ: 8 ОФИЦИАЛЬНЫХ РАЗДЕЛОВ ---
const MASTER_LEGAL_ROWS = [
  ['contract', 'Договор краткосрочной аренды виллы', '', '', 'Договор посуточной аренды Villa Turaman [Дальян, Мугла, Турция]. Владелец: Aleksei Znamenskii [VKN: 9991120181]. Вилла передается гостям в идеальном состоянии для проживания до 10 человек.', '', ''],
  ['kvkk', 'Политика защиты персональных данных KVKK', '', '', 'Aydınlatma Metni: обработка персональных данных гостей осуществляется строго в рамках турецкого закона KVKK №6698 исключительно в целях регистрации заезда и соблюдения безопасности.', '', ''],
  ['house_rules', 'Правила дома и проживания', '', '', 'Стандартный заезд с [CHECKIN_TIME], выезд до [CHECKOUT_TIME]. Курение внутри помещений категорически запрещено. Проживание с домашними животными по предварительному согласованию. Тихий час с 23:00 до 08:00.', '', ''],
  ['cancellation', 'Политика отмены и возврата средств', '', '', 'Полный возврат 100% предоплаты при отмене бронирования не позднее чем за 14 суток до даты заселения. При бронировании невозвратного тарифа предоставляется скидка 10%.', '', ''],
  ['tax_info', 'Налоговый статус и инвойсы', '', '', 'Регистрация в налоговой инспекции Ortaca Vergi Dairesi, налоговый номер VKN: 9991120181. Выставление официальных электронных счетов e-Arşiv Fatura согласно закону VUK 213 Madde 230.', '', ''],
  ['etbis', 'Регистрация в госреестре ETBIS', '', '', "Сайт официально зарегистрирован в реестре электронной коммерции Министерства торговли Турецкой Республики [ETBİS'e Kayıtlıdır].", '', ''],
  ['checkin_protocol', 'Протокол заселения и передачи ключей', '', '', 'Заселение через электронный смарт-замок [CHECKIN_METHOD]. Персональный пароль генерируется в день заезда. Возврат ключей: [KEY_HANDOVER].', '', ''],
  ['emergency', 'Экстренные службы и безопасность', '', '', 'Единый номер экстренных служб Турции: 112 [Полиция, Жандармерия, Скорая помощь, Пожарная служба]. Жандармерия Дальяна: +90 252 284 20 05. Экстренная связь с суперхозяином: 24/7 в чате.', '', '']
];

// --- ЭТАЛОННЫЕ СТРОКИ ЗАЯВОК И БРОНИРОВАНИЙ: 3 СТАРТОВЫЕ ЗАПИСИ ---
const MASTER_BOOKINGS_ROWS = [
  ['2026-06-01', 'Иван Смирнов', '+7 999 111-22-33', '01.06.2026', '08.06.2026', '7', '4', '2', '6', '$1540', 'Оплачено [Airbnb]'],
  ['2026-07-10', 'Markus Webber', '+49 170 1234567', '10.07.2026', '20.07.2026', '10', '6', '0', '6', '$2800', 'Предоплата 50% [Direct]'],
  ['2026-08-01', 'Ahmet Yılmaz', '+90 532 9876543', '01.08.2026', '08.08.2026', '7', '8', '2', '10', '$2240', 'Подтверждено [Direct]']
];

// --- ЭТАЛОННЫЕ СТРОКИ КАЛЕНДАРЯ И ТАРИФОВ: СЕЗОННАЯ СЕТКА И БЛОКИРОВКИ ---
const MASTER_CALENDAR_ROWS = [
  ['01.05.2026', '31.05.2026', 'Цена', '180', 'Май: Низкий сезон [$180/ночь]', 'admin', '20.09.2026 12:00'],
  ['01.06.2026', '30.06.2026', 'Цена', '220', 'Июнь: Стандартный сезон [$220/ночь]', 'admin', '20.09.2026 12:00'],
  ['01.07.2026', '31.08.2026', 'Цена', '320', 'Июль-Август: Высокий пик [$320/ночь]', 'admin', '20.09.2026 12:00'],
  ['01.09.2026', '30.09.2026', 'Цена', '240', 'Сентябрь: Бархатный сезон [$240/ночь]', 'admin', '20.09.2026 12:00'],
  ['01.10.2026', '31.10.2026', 'Цена', '180', 'Октябрь: Закрытие сезона [$180/ночь]', 'admin', '20.09.2026 12:00'],
  ['01.05.2026', '31.10.2026', 'Мин. дней', '3', 'Минимальный срок аренды 3 ночи', 'admin', '20.09.2026 12:00'],
  ['01.06.2026', '08.06.2026', 'Блокировка', 'VT-2026-01', 'Бронь: Иван Смирнов', 'admin', '20.09.2026 12:00']
];

// --- ЭТАЛОННЫЕ СТРОКИ ГОСТЕВЫХ АККАУНТОВ ---
const MASTER_ACCOUNTS_ROWS = [
  ['2026-01-15', 'Aleksei Znamenskii', 'villaturaman@gmail.com', 'admin123', 'Нет', 'Нет', 'Нет [МАСТЕР_ДОСТУП • Роль: Владелец • Все права: Финансы, Периоды, Блокировки, Окно брони, Чаты • Главный аккаунт]'],
  ['2026-01-15', 'Aleksei Znamenskii', 'admin', 'admin123', 'Нет', 'Нет', 'Нет [МАСТЕР_ДОСТУП • Роль: Владелец • Логин: admin]'],
  ['2026-05-01', 'Служба консьержа', 'manager@villaturaman.com', 'manager2026', 'Нет', 'Нет', 'Нет [Управляющий персоналом]'],
  ['2026-06-01', 'Иван Смирнов', 'ivan.smirnov@example.com', 'guest2026', 'Нет', 'Нет', 'Нет [Гость виллы]']
];

// --- ЭТАЛОННЫЕ СТРОКИ ЗАКАЗОВ УСЛУГ И ГИДОВ ---
const MASTER_ORDERS_ROWS = [
  ['2026-05-25', 'ivan.smirnov@example.com', 'Услуга', '€50', 'Оплачено', 'prod-1: VIP-трансфер из аэропорта Даламан DLM'],
  ['2026-05-26', 'ivan.smirnov@example.com', 'Гид', '€20', 'Оплачено', 'guide-1: Видео-гид Секретные маршруты реки Дальян']
];

// --- ЭТАЛОННЫЕ СТРОКИ ДОСТУПОВ К ПУТЕВОДИТЕЛЯМ ---
const MASTER_ACCESS_ROWS = [
  ['2026-05-26', 'ivan.smirnov@example.com', 'guide-1', 'Видеогиды', 'Оплачено', 'Да', '100% [Просмотрен полностью]'],
  ['2026-05-26', 'ivan.smirnov@example.com', 'guide-2', 'Видеогиды', 'Оплачено', 'Да', '40% [В процессе изучения]']
];

// --- ЭТАЛОННЫЕ СТРОКИ ЗАДАЧ И ПОРУЧЕНИЙ СЕКРЕТАРЯ ---
const MASTER_TASKS_ROWS = [
  ['TASK-001', '21.09.2026 10:00', 'Бухгалтер', 'Расчет e-Arşiv Fatura для бронирования VT-2026-01 [Иван Смирнов]', 'Выполнена', 'https://drive.google.com/drive/folders/11xBSWA02NypliPFbziRSMfC9aAPclYF_', 'Aleksei Znamenskii'],
  ['TASK-002', '21.09.2026 10:15', 'Юрист', 'Проверка данных гостя и договора краткосрочной аренды', 'Выполнена', 'https://drive.google.com/drive/folders/11xBSWA02NypliPFbziRSMfC9aAPclYF_', 'ИИ-Ассистент'],
  ['TASK-003', '21.09.2026 10:30', 'Секретарь', 'Организация трансфера гостя через партнера Ahmet +90 543 335 80 70', 'В работе', 'https://drive.google.com/drive/folders/11xBSWA02NypliPFbziRSMfC9aAPclYF_', 'Секретарь-Помощник']
];

module.exports = {
  MASTER_ABOUT_SECTIONS,
  MASTER_HOME_MAP,
  MASTER_HOME_ROWS,
  MASTER_SETTINGS_ROWS,
  MASTER_TEMPLATES_ROWS,
  MASTER_GALLERY_ROWS,
  MASTER_SERVICES_ROWS,
  MASTER_GUIDES_ROWS,
  MASTER_LEGAL_ROWS,
  MASTER_BOOKINGS_ROWS,
  MASTER_CALENDAR_ROWS,
  MASTER_ACCOUNTS_ROWS,
  MASTER_ORDERS_ROWS,
  MASTER_ACCESS_ROWS,
  MASTER_TASKS_ROWS
};

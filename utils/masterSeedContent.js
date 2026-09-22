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
      ru: '1. Концепция объекта, геолокация и расширенные географические ориентиры',
      en: '1. Property Concept, Geolocation and Extended Landmarks',
      tr: '1. Tesis Konsepti, Coğrafi Konum ve Genişletilmiş Önemli Noktalar'
    },
    text: {
      ru: 'Dalyan Turaman [частный бассейн, 10 спальных мест] - это цифровая веб-платформа прямого онлайн-бронирования двухэтажной виллы премиум-класса в экологическом заповедном курорте Дальян [район Ортаджа, провинция Мугла, Турция], расположенном между рекой Дальян и озером Кёйджегиз.\n\nОфициальный адрес и навигация:\n* Адрес виллы: Dalyan, Rodoslu Yaşar Sünger Sk, NO 28/2, 48600 Ortaca / Muğla, Turkey.\n* Ссылка на геолокацию в Google Maps: https://maps.app.goo.gl/tPgCjCwz4pzq28pE9\n* Точные координаты GPS: 36.8336° N, 28.6439° E.\n\nПолный реестр ключевых географических ориентиров:\n* Пешеходный центр Дальяна: всего 250 метров [3 минуты пешком] до главной пешеходной улицы с магазинами, рынками, аптеками и сувенирными лавками.\n* Речная набережная реки Дальян: 400 метров для утренних пробежек, вечерних прогулок и наблюдения за речными лодками.\n* Гастрономия: популярный ресторан высокой кухни La Boheme Dalyan - 350 метров; традиционный рыбный ресторан Çiçek Restoran - 500 метров.\n* Ликийские скальные гробницы королей Кауноса [IV век до н.э.]: панорамный вид с набережной Дальяна [450 метров], вечерняя подсветка скал и 10 минут на лодке.\n* Античный город Каунос, древний акрополь и амфитеатр: 1.5 км [переправа на весельной лодке через реку Дальян и пеший маршрут].\n* Всемирно известный песчаный пляж Изтузу [İztuzu]: 11 км [около 15 минут на машине или 30-40 минут на живописном речном катере-такси через лабиринты камышей]. Заповедная зона обитания гигантских морских черепах Caretta-Caretta.\n* Термальные радоновые источники и омолаживающие грязи Султание [Sultaniye Kaplıcaları]: 4 км по воде на озере Кёйджегиз.\n* Озеро Кёйджегиз [Köyceğiz Gölü]: 5 км до выхода из русла реки в открытую озерную акваторию.\n* Смотровая площадка Радар [Radar Tepesi]: 8 км [панорамный обзор 360° на всю дельту реки, озеро и косу пляжа Изтузу с высоты 500 метров].\n* Международный аэропорт Даламан [DLM]: 30 км [25-30 минут на машине или индивидуальном трансфере].\n* Субботний фермерский рынок Дальяна: 600 метров [свежие фермерские сыры, оливки, гранатовый сок, инжир и фрукты].\n* Морские курорты: город Мармарис - 85 км, город Фетхие и бухта Олюдениз - 60 км.',
      en: 'Dalyan Turaman [private pool, sleeps 10] is a direct online booking digital platform for a premium 2-story villa in the ecological nature resort of Dalyan [Ortaca district, Muğla province, Turkey], situated between the Dalyan River and Lake Köyceğiz.\n\nOfficial Address & Navigation:\n* Address: Dalyan, Rodoslu Yaşar Sünger Sk, NO 28/2, 48600 Ortaca / Muğla, Turkey.\n* Google Maps: https://maps.app.goo.gl/tPgCjCwz4pzq28pE9\n* GPS: 36.8336° N, 28.6439° E.\n\nKey Geographic Landmarks:\n* Dalyan pedestrian center: 250 m [3 min walk] to shops, markets and pharmacies.\n* Dalyan River promenade: 400 m for scenic walks and boat trips.\n* Dining: La Boheme Dalyan Bistro [350 m], Çiçek Restoran [500 m].\n* Lycian Rock Tombs: 450 m line of sight from promenade.\n* Ancient Kaunos & Amphitheater: 1.5 km across river.\n* Iztuzu Turtle Beach: 11 km [15 min drive or 35 min river boat].\n* Sultaniye Hot Springs & Mud Baths: 4 km via water.\n* Lake Köyceğiz: 5 km.\n* Radar Hill Panoramic View: 8 km [360 degree panoramic view].\n* Dalaman Airport [DLM]: 30 km [25-30 min drive].\n* Saturday Farmers Market: 600 m [7 min walk].\n* Resorts: Marmaris 85 km, Fethiye 60 km.',
      tr: 'Dalyan Turaman [özel havuz, 10 yatak] Dalyan Nehri ile Köyceğiz Gölü arasında yer alan lüks 2 katlı villanın doğrudan online rezervasyon platformudur [Ortaca, Muğla, Türkiye].\n\nResmi Adres ve Konum:\n* Adres: Dalyan, Rodoslu Yaşar Sünger Sk, NO 28/2, 48600 Ortaca / Muğla, Türkiye.\n* Google Maps: https://maps.app.goo.gl/tPgCjCwz4pzq28pE9\n* GPS: 36.8336° N, 28.6439° E.\n\nÖnemli Noktalar:\n* Dalyan yaya merkezi: 250 m [3 dk yürüme].\n* Dalyan Nehri kordonu: 400 m.\n* Restoranlar: La Boheme Dalyan [350 m], Çiçek Restoran [500 m].\n* Likya Kaya Mezarları: 450 m kordondan direkt manzara.\n* Antik Kaunos Kenti: 1.5 km.\n* İztuzu Plajı: 11 km [15 dk araç veya 35 dk tekne].\n* Sultaniye Kaplıcaları ve Çamur Banyosu: 4 km su yolu.\n* Köyceğiz Gölü: 5 km.\n* Radar Tepesi Seyir Noktası: 8 km [360 derece panorama].\n* Dalaman Havalimanı [DLM]: 30 km [25-30 dk araç].\n* Cumartesi Pazarı: 600 m.\n* Tatil merkezleri: Marmaris 85 km, Fethiye 60 km.'
    }
  },
  {
    id: '2',
    title: {
      ru: '2. Архитектура виллы и номерной фонд',
      en: '2. Villa Architecture and Bed Configuration',
      tr: '2. Villa Mimarisi ve Oda Düzeni'
    },
    text: {
      ru: 'Тип недвижимости: Дом / Вилла [в распоряжении гостей жилье целиком].\nПлощадь, этажность и год постройки: 240 кв. метров, 2 этажа, год постройки - 2013.\nВместимость: до 10 гостей [включая детей], 10 полноценных спальных мест.\nКонфигурация спален и санузлов: 4 большие спальни [каждая оборудована персональной ванной комнатой и автономным кондиционером] + гостевой туалет на первом этаже:\n\nПервый этаж:\n* Полноценная оборудованная кухня Beko [большой двухкамерный холодильник, духовка, плита, посудомоечная машина, кофемашина, чайник, полный комплект посуды и столовых приборов].\n* Просторная светлая гостиная: два удобных дивана, 55-дюймовый Smart TV [Netflix, YouTube], журнальный стол.\n* Гостевой туалет, прихожая со шкафом для верхней одежды.\n* Постирочная зона: стиральная машина, гладильная доска и утюг.\n* Спальня 1: рассчитана на 3 спальных места [1 двуспальная кровать квин-сайз + 1 односпальная кровать], собственная ванная комната с душевой кабиной, индивидуальный кондиционер.\n\nВторой этаж:\n* Спальня 2: 1 двуспальная кровать кинг-сайз, ванная комната с тропическим душем, кондиционер, балкон.\n* Спальня 3: 1 двуспальная кровать квин-сайз, ванная комната, кондиционер, вид на горы.\n* Спальня 4: рассчитана на 3 спальных места [1 двуспальная кровать квин-сайз + 1 односпальная кровать], ванная комната, кондиционер.\n* Дополнительная стиральная машина во второй ванной комнате второго этажа.\n\nИтоговая структура 10 спальных мест: 4 двуспальные кровати + 2 односпальные кровати + диван в гостиной = 10 спальных мест.',
      en: 'Property Type: Entire Villa.\nArea & Floors: 240 sqm, 2 floors, built 2013.\nCapacity: up to 10 guests [including children], 10 beds.\n4 large en-suite bedrooms + guest WC on the first floor:\n\nFirst Floor:\n* Full Beko kitchen [refrigerator, oven, stove, dishwasher, coffee maker, kettle, full cookware].\n* Living room: 2 sofas, 55" Smart TV [Netflix, YouTube], coffee table.\n* Guest toilet, entrance hall.\n* Laundry zone: washing machine, iron, ironing board.\n* Bedroom 1: sleeps 3 [1 Queen bed + 1 single bed], en-suite shower, AC.\n\nSecond Floor:\n* Bedroom 2: 1 King bed, en-suite bathroom with tropical shower, AC, balcony.\n* Bedroom 3: 1 Queen bed, en-suite bathroom, AC, mountain view.\n* Bedroom 4: sleeps 3 [1 Queen bed + 1 single bed], en-suite bathroom, AC.\n* Extra washing machine on second floor.\nTotal 10 beds: 4 double beds + 2 single beds + living room sofa.',
      tr: 'Emlak Tipi: Müstakil Villa tamamı.\nAlan ve Kat: 240 m², 2 kat, yapım yılı 2013.\nKapasite: 10 misafire kadar [çocuklar dahil], 10 yatak.\n4 geniş ebeveyn banyolu yatak odası + zemin katta misafir WC:\n\nZemin Kat:\n* Tam donanımlı Beko mutfak [buzdolabı, fırın, ocak, bulaşık makinesi, kahve makinesi, su ısıtıcısı, yemek takımı].\n* Oturma odası: 2 kanepe, 55 inç Smart TV [Netflix, YouTube], sehpa.\n* Misafir tuvaleti, vestiyer.\n* Çamaşır alanı: çamaşır makinesi, ütü ve masası.\n* Yatak Odası 1: 3 kişilik [1 Queen çift kişilik + 1 tek kişilik], özel duşlu banyo, klima.\n\nİkinci Kat:\n* Yatak Odası 2: 1 King yatak, tropikal duşlu özel banyo, klima, balkon.\n* Yatak Odası 3: 1 Queen yatak, özel banyo, klima, dağ manzarası.\n* Yatak Odası 4: 3 kişilik [1 Queen + 1 tek kişilik], özel banyo, klima.\n* İkinci katta ilave çamaşır makinesi.\nToplam 10 yatak kapasitesi.'
    }
  },
  {
    id: '3',
    title: {
      ru: '3. Придомовая территория, бассейн и спа-комплекс',
      en: '3. Courtyard, Pool and Spa Complex',
      tr: '3. Bahçe Alanı, Havuz ve Spa Kompleksi'
    },
    text: {
      ru: 'Приватный бассейн с соленой водой: чаша 4×9 метров [площадь 36 кв. м], постоянная глубина 150 см. Идеальное место для отдыха и освежающих купаний без запаха хлора. Доступен в период с 1 мая по 1 ноября. Профилактическая чистка проводится в день заселения и далее каждые 7 дней. Внутренняя подсветка бассейна активна автоматически с 20:00 до 01:00.\n\nУличное приватное джакузи: гидромассажная спа-ванна на 4 персоны в зоне бассейна. Автоматический режим: включается на 15 минут с интервалом каждые 45 минут в период с 10:00 до 17:00. Подсветка джакузи активна с 20:00 до 01:00. Доступно с 1 мая по 1 ноября.\n\nОсвещение территории: автоматическое включение уличных фонарей в диапазонах с 20:00 до 01:00 и с 04:00 до 06:00.\n\nПарковка: бесплатная частная парковка на закрытой территории перед домом на 2 автомобиля.\n\nОткрытые пространства для отдыха: полностью огороженный задний двор-сад, зона барбекю [гриль на дровах и углях], уютное крыльцо с кофейными столиками, большой обеденный стол на открытом воздухе на 8 персон, терраса для загара с удобными шезлонгами и летний душ.',
      en: 'Private Saltwater Pool: 4x9 m [36 sqm], 150 cm depth. Odor-free natural mineralized water without harsh chlorine. Open May 1 - Nov 1. Cleaning on check-in day and every 7 days. Underwater lighting 20:00 - 01:00.\n\nOutdoor Private Jacuzzi: 4-person spa tub by the pool. Auto-cycle: 15 min on every 45 min between 10:00 and 17:00. Lighting 20:00 - 01:00. Available May 1 - Nov 1.\n\nArea Lighting: Automated lighting 20:00 - 01:00 and 04:00 - 06:00.\n\nParking: Free private parking inside gated grounds for 2 cars.\n\nOutdoor Living: Fenced private garden, charcoal BBQ grill, porch with coffee tables, outdoor dining table for 8, sun loungers and outdoor shower.',
      tr: 'Özel Tuzlu Su Havuzu: 4x9 metre [36 m²], 150 cm derinlik. Klorsuz yumuşak su. 1 Mayıs - 1 Kasım arası açık. Giriş günü ve her 7 günde bir temizlik. Havuz aydınlatması 20:00 - 01:00.\n\nAçık Özel Jakuzi: Havuz başında 4 kişilik hidro-masajlı spa jakuzi. 10:00 - 17:00 arası her 45 dakikada 15 dakika çalışma döngüsü. Aydınlatma 20:00 - 01:00.\n\nBahçe Aydınlatması: Otomatik 20:00 - 01:00 ve 04:00 - 06:00.\n\nOtopark: Kapalı özel bahçe içinde 2 araçlık ücretsiz otopark.\n\nAçık Alanlar: Korunaklı bahçe, barbekü alanı, veranda, 8 kişilik açık yemek masası, şezlonglar ve açık duş.'
    }
  },
  {
    id: '4',
    title: {
      ru: '4. Юридический регламент, безопасность и доступная среда',
      en: '4. Legal Regulations, Safety and Accessible Environment',
      tr: '4. Yasal Mevzuat, Güvenlik ve Engelsiz Erişim'
    },
    text: {
      ru: 'Закон Турции № 7464 о краткосрочной аренде: при заселении гость подписывает официальный договор краткосрочной аренды виллы с описью имущества.\n\nРегистрация в системе учета населения [KBS]: гость обязуется предоставить данные удостоверений личности [паспортов] всех проживающих заранее или при заселении. Размещение лиц, не зарегистрированных в системе, строго запрещено.\n\nБезопасность дома: наружные камеры видеонаблюдения по внешнему периметру территории, детекторы дыма, огнетушитель, аптечка первой помощи.\n\nЭлементы доступной среды: парковочное место для людей с инвалидностью, освещенная ровная дорожка к гостевому входу, доступ без ступеней, входная дверь шириной от 81 см, подъемник для бассейна и джакузи.\n\nПолитика отмены бронирования:\n* Краткосрочные бронирования [менее 28 ночей]: Негибкие.\n* Долгосрочные бронирования [от 28 ночей]: Строгие правила для долгосрочных бронирований.\n* Дополнительный параметр: тариф Без возврата денег со скидкой 10% [активен при заезде в течение ближайших 60 дней] либо стандартный тариф.',
      en: 'Turkish Law No. 7464 on Short-Term Rental: Official short-term lease agreement with inventory signed upon check-in.\n\nPolice KBS Registration: All guests must provide passports for mandatory registration in the KBS system. Unregistered guests strictly prohibited.\n\nHome Safety: External perimeter CCTV cameras, optical smoke detectors, fire extinguisher, first aid kit.\n\nAccessible Environment: Disabled parking space, illuminated step-free path, doorway >= 81 cm, mobile pool and jacuzzi lift.\n\nCancellation Policy:\n* Short-term [< 28 nights]: Inflexible.\n* Long-term [>= 28 nights]: Strict long-term.\n* Non-refundable option: 10% discount for bookings within 60 days of check-in.',
      tr: '7464 Sayılı Konutların Turizm Amaçlı Kiralanması Kanunu: Girişte eşya envanterli resmi kira sözleşmesi imzalanır.\n\nKBS Kimlik Bildirimi: Tüm konukların pasaport/kimlik bilgileri polise bildirilmek zorundadır. Kayıtsız konaklama yasaktır.\n\nGüvenlik: Dış çevre güvenlik kameraları, duman dedektörleri, yangın söndürücü, ilk yardım çantası.\n\nEngelsiz Erişim: Engelli otopark alanı, basamaksız aydınlatılmış yol, 81 cm üzeri kapı genişliği, havuz ve jakuzi lifti.\n\nİptal Politikası:\n* Kısa dönem [< 28 gece]: Esnek olmayan.\n* Uzun dönem [>= 28 gece]: Katı uzun dönem.\n* İadesiz tarife seçeneği: 60 gün öncesi rezervasyonlarda %10 indirim.'
    }
  },
  {
    id: '5',
    title: {
      ru: '5. Профиль суперхозяина и мастер-доступ',
      en: '5. Superhost Profile and Master Access',
      tr: '5. Süper Ev Sahibi Profili ve Ana Erişim'
    },
    text: {
      ru: 'Личность владельца: Алексей Знаменский [Aleksei Znamenskii].\nМесто постоянного проживания: Мармарис, Турция.\nРод занятий: Яхтсмен на пенсии.\nЖизненное кредо: «Хочешь что-то сделать хорошо, сделай это сам».\nМечта: отправиться в Португалию и увидеть океан.\nХобби и интересы: Велоспорт, Парусный спорт, Природа.\nШтампы путешествий: Дубай [ОАЭ, 3 поездки], Абу-Даби [ОАЭ, посещение в марте 2026 г.].\nЯзыки общения: Русский, English, Türkçe.\nРеквизиты налогоплательщика: Ortaca Vergi Dairesi, VKN: 9991120181.\n\nМастер-доступ суперхозяина [стартовые данные восстановления]:\n* Email: villaturaman@gmail.com\n* Логин / Пароль: admin / admin123\n* Роль: Владелец\n* Пакет полномочий: Финансы, Периоды, Блокировки, Окно брони, Чаты [Главный системный аккаунт].',
      en: 'Host: Aleksei Znamenskii.\nResidence: Marmaris, Turkey.\nOccupation: Retired yachtsman.\nMotto: "If you want something done right, do it yourself".\nDream: Visit Portugal and see the Atlantic Ocean.\nHobbies: Cycling, Sailing, Nature.\nTravel Stamps: Dubai [3 trips], Abu Dhabi [March 2026].\nLanguages: Russian, English, Turkish.\nTax ID: Ortaca Vergi Dairesi, VKN: 9991120181.\n\nMaster Access [Recovery & Seed Credentials]:\n* Email: villaturaman@gmail.com\n* Login / Password: admin / admin123\n* Role: Owner\n* Permissions: Finance, Periods, Blocks, Booking Window, Chats [Root Master Account].',
      tr: 'Ev Sahibi: Aleksei Znamenskii.\nİkamet: Marmaris, Türkiye.\nMeslek: Emekli yat kaptanı / yatçı.\nHayat İlkesi: "Bir şeyi iyi yapmak istiyorsan kendin yap".\nHayal: Portekiz\'e gitmek ve okyanusu görmek.\nHobiler: Bisiklet, Yelken, Doğa.\nSeyahat Pulları: Dubai [3 gezi], Abu Dabi [Mart 2026].\nDiller: Rusça, İngilizce, Türkçe.\nVergi No: Ortaca Vergi Dairesi, VKN: 9991120181.\n\nAna Sistem Erişimi:\n* E-posta: villaturaman@gmail.com\n* Kullanıcı / Şifre: admin / admin123\n* Rol: Sahip [Tüm yetkiler].'
    }
  },
  {
    id: '6',
    title: {
      ru: '6. Новая планировка Центра сообщений и CRM [HostInbox.js]',
      en: '6. New Message Center and CRM Layout [HostInbox.js]',
      tr: '6. Yeni Mesaj Merkezi ve CRM Düzeni [HostInbox.js]'
    },
    text: {
      ru: 'Просторное многострочное поле ввода ответа:\n* Минимальная высота увеличена до 90px с автоматическим комфортным расширением до 220px при наборе текста.\n* Текст хозяина больше не сжимается, обеспечен полноценный контраст и удобный скролл.\n\nОтдельная смарт-панель шаблонов [без перекрытия переписки]:\n* Панель шаблонов вынесена в независимый блок, не загораживающий активный чат с гостем.\n* Полноразмерный предпросмотр: возможность полностью прочитать длинные многострочные сценарии [включая расчеты цен, правила заезда и инструкции к бассейну] до их вставки.\n* Две понятные кнопки действия: «Вставить в поле для правки» и «Отправить сразу».\n* Динамический счетчик шаблонов на базе данных из Google Таблицы без жесткого числа «14».\n\nЛиквидация дергания экрана:\n* Замена глобального scrollIntoView на локальный скролл контейнера: messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight.',
      en: 'Spacious Multi-line Reply Input Field:\n* Min height increased to 90px with auto expansion up to 220px.\n* Clear contrast, comfortable leading and smooth scroll.\n\nDedicated Smart Template Sidebar [No chat overlay]:\n* Positioned in independent right panel tab without blocking active conversation.\n* Full preview of lengthy responses prior to insertion.\n* Action buttons: "Insert into input" and "Send immediately".\n* Dynamic template counter based on live Google Sheets.\n\nElimination of Screen Jitter:\n* Isolated container scroll via messagesContainerRef.current.scrollTop.',
      tr: 'Genişletilmiş Çok Satırlı Cevap Giriş Alanı:\n* Minimum yükseklik 90px, yazarken 220px\'e kadar otomatik genişleme.\n* Sohbeti kapatmayan bağımsız şablon paneli.\n* Şablonları eklemeden önce tam metin önizleme imkanı.\n* Doğrudan yerleştirme ve anında gönderme butonları.\n* Canlı Google E-Tablo senkronizasyonlu dinamik sayaç.'
    }
  },
  {
    id: '7',
    title: {
      ru: '7. Размещение данных на витрине сайта и в стартовых файлах',
      en: '7. Showcase Data Placement and Startup Recovery Files',
      tr: '7. Vitrin Veri Yerleşimi ve Başlangıç Kurtarma Dosyaları'
    },
    text: {
      ru: 'Главная витрина сайта [pages/index.js]:\n* В Hero-секции и подзаголовке: четкое указание локации Дальян, приватного бассейна 36 кв. м и 10 спальных мест.\n* Интерактивный блок «Географические ориентиры Дальяна»: карточки с точными расстояниями [250м центр, 400м набережная, 350м ресторан La Boheme, 11км пляж Изтузу, 30км аэропорт Даламан, грязи Султание, гробницы Кауноса].\n* Блок номерного фонда: детальное отображение 4 спален [1 на первом этаже, 3 на втором], санузлов в каждой спальне и схемы спальных мест.\n* Блок спа-комплекса: технические параметры бассейна с соленой водой, график работы джакузи [10:00-17:00], освещения [20:00-01:00] и чистки.\n* Блок безопасности и закона № 7464: обязательная регистрация по паспортам KBS, опись имущества, видеонаблюдение.\n* Карточка суперхозяина: рассказ об Алексее Знаменском, Мармарисе, девизе, интересах и путешествиях.\n* Блок элементов доступной среды и правил отмены.\n\nФайлы эталонного наполнения и восстановления базы данных [masterSeedContent.js, scripts/init-google-sheets.js, scripts/restore-sheets.js]:\n* Лист 🏠 Главная витрина [HOME, ID 101]: все блоки витрины с реальными данными.\n* Лист 📸 Фото и Видео Галерея [GALLERY, ID 102]: полный фототур по всем зонам виллы.\n* Лист 👤 Гостевые аккаунты [ACCOUNTS, ID 203]: мастер-аккаунт villaturaman@gmail.com [admin / admin123].\n* Лист ⚖️ Юридические документы [LEGAL, ID 106]: договор аренды, закон № 7464, KVKK, правила дома.\n* Лист ⚙️ Системные настройки ИИ [SETTINGS, ID 209]: профиль хозяина, тайминги джакузи и освещения, базовая валюта.',
      en: 'Main Showcase [pages/index.js]:\n* Hero section: Dalyan location, 36 sqm saltwater pool, 10 beds.\n* Landmarks grid: 14 cards with exact distances [250m center, 400m river, 350m bistro, 11km beach, 30km DLM airport].\n* 4 en-suite bedrooms layout.\n* Saltwater pool & outdoor jacuzzi specs [10:00-17:00, lighting 20:00-01:00].\n* Law 7464, KBS police registration, security and accessibility.\n* Superhost profile card: Aleksei Znamenskii.\n\nDatabase Recovery & Seed Files [masterSeedContent.js, init-google-sheets.js, restore-sheets.js]:\n* Sheet HOME [ID 101]: Full showcase blocks.\n* Sheet GALLERY [ID 102]: Photo & video tour.\n* Sheet ACCOUNTS [ID 203]: Master account villaturaman@gmail.com [admin / admin123].\n* Sheet LEGAL [ID 106]: Short-term lease contract, Law 7464, KVKK.\n* Sheet SETTINGS [ID 209]: Host profile, jacuzzi & lighting timings, currency.',
      tr: 'Ana Vitrin [pages/index.js]:\n* Hero bölümü: Dalyan konumu, 36 m² tuzlu su havuzu, 10 yatak kapasitesi.\n* Önemli noktalar: 14 kart ve kesin mesafeler [250m merkez, 400m kordon, 11km plaj, 30km havalimanı].\n* 4 ebeveyn banyolu yatak odası.\n* Tuzlu su havuzu ve açık jakuzi çalışma saatleri.\n* 7464 sayılı Kanun, KBS bildirimi, güvenlik ve erişilebilirlik.\n* Süper ev sahibi Aleksei Znamenskii profil kartı.\n\nKurtarma ve Başlangıç Dosyaları:\n* HOME [ID 101], GALLERY [ID 102], ACCOUNTS [ID 203], LEGAL [ID 106], SETTINGS [ID 209].'
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
  ['4. О вилле', 'about_sec_1_title', 'Модальное окно: Раздел 1 Заголовок', '1. Концепция объекта, геолокация и расширенные географические ориентиры', '1. Property Concept, Geolocation and Extended Landmarks', '1. Tesis Konsepti, Coğrafi Konum ve Genişletilmiş Önemli Noktalar', '', 'Вкл'],
  ['4. О вилле', 'about_sec_1_text', 'Модальное окно: Раздел 1 Текст', 'Dalyan Turaman [частный бассейн, 10 спальных мест] - это цифровая веб-платформа прямого онлайн-бронирования двухэтажной виллы премиум-класса в экологическом заповедном курорте Дальян [район Ортаджа, провинция Мугла, Турция], расположенном между рекой Дальян и озером Кёйджегиз.\n\nОфициальный адрес и навигация:\n* Адрес виллы: Dalyan, Rodoslu Yaşar Sünger Sk, NO 28/2, 48600 Ortaca / Muğla, Turkey.\n* Ссылка на геолокацию в Google Maps: https://maps.app.goo.gl/tPgCjCwz4pzq28pE9\n* Точные координаты GPS: 36.8336° N, 28.6439° E.\n\nПолный реестр ключевых географических ориентиров:\n* Пешеходный центр Дальяна: всего 250 метров [3 минуты пешком] до главной пешеходной улицы с магазинами, рынками, аптеками и сувенирными лавками.\n* Речная набережная реки Дальян: 400 метров для утренних пробежек, вечерних прогулок и наблюдения за речными лодками.\n* Гастрономия: популярный ресторан высокой кухни La Boheme Dalyan - 350 метров; традиционный рыбный ресторан Çiçek Restoran - 500 метров.\n* Ликийские скальные гробницы королей Кауноса [IV век до н.э.]: панорамный вид с набережной Дальяна [450 метров], вечерняя подсветка скал и 10 минут на лодке.\n* Античный город Каунос, древний акрополь и амфитеатр: 1.5 км [переправа на весельной лодке через реку Дальян и пеший маршрут].\n* Всемирно известный песчаный пляж Изтузу [İztuzu]: 11 км [около 15 минут на машине или 30-40 минут на живописном речном катере-такси через лабиринты камышей]. Заповедная зона обитания гигантских морских черепах Caretta-Caretta.\n* Термальные радоновые источники и омолаживающие грязи Султание [Sultaniye Kaplıcaları]: 4 км по воде на озере Кёйджегиз.\n* Озеро Кёйджегиз [Köyceğiz Gölü]: 5 км до выхода из русла реки в открытую озерную акваторию.\n* Смотровая площадка Радар [Radar Tepesi]: 8 км [панорамный обзор 360° на всю дельту реки, озеро и косу пляжа Изтузу с высоты 500 метров].\n* Международный аэропорт Даламан [DLM]: 30 км [25-30 минут на машине или индивидуальном трансфере].\n* Субботний фермерский рынок Дальяна: 600 метров [свежие фермерские сыры, оливки, гранатовый сок, инжир и фрукты].\n* Морские курорты: город Мармарис - 85 км, город Фетхие и бухта Олюдениз - 60 км.', 'Dalyan Turaman [private pool, sleeps 10] is a direct online booking digital platform for a premium 2-story villa in the ecological nature resort of Dalyan [Ortaca district, Muğla province, Turkey], situated between the Dalyan River and Lake Köyceğiz.', 'Dalyan Turaman [özel havuz, 10 yatak] Dalyan Nehri ile Köyceğiz Gölü arasında yer alan lüks 2 katlı villanın doğrudan online rezervasyon platformudur [Ortaca, Muğla, Türkiye].', '', 'Вкл'],
  ['4. О вилле', 'about_sec_2_title', 'Модальное окно: Раздел 2 Заголовок', '2. Архитектура виллы и номерной фонд', '2. Villa Architecture and Bed Configuration', '2. Villa Mimarisi ve Oda Düzeni', '', 'Вкл'],
  ['4. О вилле', 'about_sec_2_text', 'Модальное окно: Раздел 2 Текст', 'Тип недвижимости: Дом / Вилла [в распоряжении гостей жилье целиком].\nПлощадь, этажность и год постройки: 240 кв. метров, 2 этажа, год постройки - 2013.\nВместимость: до 10 гостей [включая детей], 10 полноценных спальных мест.\nКонфигурация спален и санузлов: 4 большие спальни [каждая оборудована персональной ванной комнатой и автономным кондиционером] + гостевой туалет на первом этаже:\nПервый этаж: полноценная кухня Beko, просторная гостиная со Smart TV 55", гостевой туалет, прихожая, постирочная, Спальня 1 [квин-сайз + односпальная кровать, ванная с душем, кондиционер].\nВторой этаж: Спальня 2 [кинг-сайз, ванная с тропическим душем, кондиционер, балкон], Спальня 3 [квин-сайз, ванная, кондиционер, вид на горы], Спальня 4 [квин-сайз + односпальная кровать, ванная, кондиционер], вторая стиральная машина.\nИтоговая структура: 4 двуспальные кровати + 2 односпальные кровати + диван в гостиной = 10 спальных мест.', 'Property Type: Entire Villa. Area: 240 sqm, 2 floors, built 2013. Capacity: up to 10 guests, 10 beds. 4 en-suite bedrooms + guest WC.', 'Emlak Tipi: Müstakil Villa tamamı. 240 m², 2 kat, 2013 yapımı. Kapasite: 10 misafir, 10 yatak. 4 ebeveyn banyolu yatak odası + WC.', '', 'Вкл'],
  ['4. О вилле', 'about_sec_3_title', 'Модальное окно: Раздел 3 Заголовок', '3. Придомовая территория, бассейн и спа-комплекс', '3. Courtyard, Pool and Spa Complex', '3. Bahçe Alanı, Havuz ve Spa Kompleksi', '', 'Вкл'],
  ['4. О вилле', 'about_sec_3_text', 'Модальное окно: Раздел 3 Текст', 'Приватный бассейн с соленой водой: чаша 4×9 метров [площадь 36 кв. м], постоянная глубина 150 см. Без запаха хлора. Доступен с 1 мая по 1 ноября. Чистка в день заселения и каждые 7 дней. Подсветка бассейна: 20:00 - 01:00.\nУличное приватное джакузи: на 4 персоны, автоматический цикл [15 минут работы каждые 45 минут в период 10:00 - 17:00]. Подсветка джакузи: 20:00 - 01:00. Сезон: 1 мая - 1 ноября.\nОсвещение территории: автоматическое [20:00 - 01:00 и 04:00 - 06:00].\nПарковка: бесплатная закрытая частная парковка на территории на 2 авто.\nОткрытые зоны отдыха: огороженный сад, барбекю [BBQ], крыльцо с кофейными столиками, обеденный стол на 8 мест, шезлонги и летний душ.', 'Private saltwater pool 4x9 m [36 sqm, 150 cm depth, no chlorine, May 1 - Nov 1]. Outdoor jacuzzi for 4 [10:00-17:00, light 20:00-01:00]. Gated parking for 2 cars, BBQ, dining for 8.', '36 m² özel tuzlu su havuzu [1 Mayıs - 1 Kasım, aydınlatma 20:00-01:00]. 4 kişilik açık jakuzi [10:00-17:00]. 2 araçlık otopark, barbekü, 8 kişilik yemek masası.', '', 'Вкл'],
  ['4. О вилле', 'about_sec_4_title', 'Модальное окно: Раздел 4 Заголовок', '4. Юридический регламент, безопасность и доступная среда', '4. Legal Regulations, Safety and Accessible Environment', '4. Yasal Mevzuat, Güvenlik ve Engelsiz Erişim', '', 'Вкл'],
  ['4. О вилле', 'about_sec_4_text', 'Модальное окно: Раздел 4 Текст', 'Закон Турции № 7464 о краткосрочной аренде: обязательный договор аренды виллы с описью имущества при заселении.\nРегистрация в системе учета населения KBS: обязательное предоставление паспортов всех проживающих. Размещение незарегистрированных лиц строго запрещено.\nБезопасность дома: внешнее видеонаблюдение по периметру, детекторы дыма во всех спальнях и гостиной, огнетушитель, аптечка первой помощи.\nДоступная среда: выделенная парковка для инвалидов, ровный освещенный вход без ступеней, дверь от 81 см, подъемник для бассейна и джакузи.\nПолитика отмены: менее 28 ночей - Негибкие, от 28 ночей - Строгие. Опция невозвратного тарифа со скидкой 10% за 60 дней.', 'Turkish Law No. 7464 on short-term rental: mandatory lease contract with inventory. Mandatory police KBS passport registration. Perimeter CCTV, smoke detectors. Disabled parking, step-free access, door >= 81 cm, pool lift. Inflexible / Strict cancellation.', '7464 Sayılı Kanun gereği envanterli resmi kira sözleşmesi ve zorunlu KBS polis kaydı. Çevre güvenlik kamerası, duman dedektörleri. Engelli otoparkı, basamaksız giriş, 81 cm kapı, havuz asansörü.', '', 'Вкл'],
  ['4. О вилле', 'about_sec_5_title', 'Модальное окно: Раздел 5 Заголовок', '5. Профиль суперхозяина и мастер-доступ', '5. Superhost Profile and Master Access', '5. Süper Ev Sahibi Profili ve Ana Erişim', '', 'Вкл'],
  ['4. О вилле', 'about_sec_5_text', 'Модальное окно: Раздел 5 Текст', 'Владелец: Алексей Знаменский [Aleksei Znamenskii]. Проживает в Мармарисе, яхтсмен на пенсии. Жизненное кредо: «Хочешь сделать хорошо - сделай сам». Мечта: отправиться в Португалию и увидеть океан. Хобби: велоспорт, парусный спорт, природа. Штампы путешествий: Дубай [3 поездки], Абу-Даби [март 2026 г.]. Языки: русский, английский, турецкий. Налоговые реквизиты: Ortaca Vergi Dairesi, VKN: 9991120181.\nМастер-доступ суперхозяина: villaturaman@gmail.com, логин admin / пароль admin123, роль: Владелец [Финансы, Периоды, Блокировки, Окно брони, Чаты].', 'Owner: Aleksei Znamenskii, retired yachtsman living in Marmaris. Motto: "Do it yourself to do it well". Dream: Portugal. Hobbies: Cycling, Sailing, Nature. Stamps: Dubai [3], Abu Dhabi [March 2026]. Tax ID: VKN 9991120181. Master access: villaturaman@gmail.com / admin / admin123.', 'Ev Sahibi: Aleksei Znamenskii, emekli yatçı, Marmaris. İlke: "İyi yapmak istiyorsan kendin yap". Hayal: Portekiz. Hobiler: Bisiklet, Yelken, Doğa. VKN: 9991120181. Ana erişim: villaturaman@gmail.com / admin / admin123.', '', 'Вкл'],
  ['4. О вилле', 'about_sec_6_title', 'Модальное окно: Раздел 6 Заголовок', '6. Новая планировка Центра сообщений и CRM [HostInbox.js]', '6. New Message Center and CRM Layout [HostInbox.js]', '6. Yeni Mesaj Merkezi ve CRM Düzeni [HostInbox.js]', '', 'Вкл'],
  ['4. О вилле', 'about_sec_6_text', 'Модальное окно: Раздел 6 Текст', 'Просторное многострочное поле ввода ответа: минимальная высота увеличена до 90px с авто-расширением до 220px при наборе. Удобный скролл и контраст.\nОтдельная смарт-панель шаблонов без перекрытия чата: вынесена в независимый сайдбар, полный предпросмотр длинных ответов перед вставкой, кнопки «Вставить в поле» и «Отправить сразу», динамический счетчик шаблонов из Google Sheets.\nЛиквидация дергания экрана: изолированный скролл контейнера messagesContainerRef.current.scrollTop без глобальных прыжков страницы.', 'Spacious multiline reply input: min-h 90px expanding to 220px. Dedicated template panel in right sidebar without chat overlay, full preview before sending. Elimination of screen jitter via container scrollTop.', 'Genişletilmiş çok satırlı cevap alanı [90-220px]. Sohbeti kapatmayan bağımsız sağ şablon paneli, tam önizleme. Ekran kaymasını önleyen izole konteyner kaydırma.', '', 'Вкл'],
  ['4. О вилле', 'about_sec_7_title', 'Модальное окно: Раздел 7 Заголовок', '7. Размещение данных на витрине сайта и в стартовых файлах', '7. Showcase Data Placement and Startup Recovery Files', '7. Vitrin Veri Yerleşimi ve Başlangıç Kurtarma Dosyaları', '', 'Вкл'],
  ['4. О вилле', 'about_sec_7_text', 'Модальное окно: Раздел 7 Текст', 'Витрина сайта [pages/index.js]: Hero-секция с приватным бассейном 36 кв. м и 10 спальными местами, интерактивные карточки 14 ориентиров Дальяна с расстояниями, блок 4 спален en-suite, технический блок спа-комплекса и джакузи 10:00-17:00, блок Закона № 7464, KBS и доступной среды, карточка суперхозяина Алексея Знаменского.\nСтартовые и восстановительные файлы: лист HOME [ID 101], GALLERY [ID 102], ACCOUNTS [ID 203: villaturaman@gmail.com, admin / admin123], LEGAL [ID 106], SETTINGS [ID 209].', 'Showcase [pages/index.js]: Hero with 36 sqm pool & 10 beds, 14 landmarks grid with distances, 4 en-suite bedrooms, spa & jacuzzi specs 10:00-17:00, Law 7464, KBS and accessible environment, superhost card. Recovery files: HOME, GALLERY, ACCOUNTS, LEGAL, SETTINGS.', 'Vitrin [pages/index.js]: 36 m² havuz ve 10 yatak, 14 önemli nokta kesin mesafeler, 4 ebeveyn banyolu oda, spa ve jakuzi çalışma saatleri, 7464 sayılı Kanun, KBS, engelsiz erişim, süper ev sahibi kartı. Başlangıç ve kurtarma dosyaları.', '', 'Вкл'],

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
  ['9. Хозяин', 'host_card_btn', 'Текст кнопки связи с хозяином', 'Написать хозяину', 'Message host', 'Ev sahibine mesaj gönder', 'MessageCircle', 'Вкл'],
  ['9. Хозяин', 'host_card_credo', 'Жизненное кредо суперхозяина', '«Хочешь сделать хорошо - сделай сам»', '"Do it yourself to do it well"', '"İyi yapmak istiyorsan kendin yap"', 'Quote', 'Вкл'],
  ['9. Хозяин', 'host_card_dream', 'Мечта и базирование', 'База: Мармарис • Мечта: Португалия и Атлантический океан', 'Base: Marmaris • Dream: Portugal and Atlantic Ocean', 'Üs: Marmaris • Hayal: Portekiz ve Atlantik Okyanusu', 'Compass', 'Вкл'],
  ['9. Хозяин', 'host_card_hobbies', 'Хобби и спорт суперхозяина', 'Велоспорт, Парусный спорт, Живая природа Дальяна', 'Cycling, Sailing, Living Nature of Dalyan', 'Bisiklet, Yelken, Dalyan\'ın Doğası', 'Bike', 'Вкл'],
  ['9. Хозяин', 'host_card_travel', 'Штампы путешествий', 'Дубай [3 поездки], Абу-Даби [март 2026 г.]', 'Dubai [3 trips], Abu Dhabi [March 2026]', 'Dubai [3 seyahat], Abu Dabi [Mart 2026]', 'PlaneTakeoff', 'Вкл'],
  ['9. Хозяин', 'host_card_tax', 'Официальные налоговые реквизиты', 'Официальный налогоплательщик: Ortaca Vergi Dairesi, VKN: 9991120181', 'Official taxpayer: Ortaca Tax Office, VKN: 9991120181', 'Resmi vergi mükellefi: Ortaca Vergi Dairesi, VKN: 9991120181', 'FileCheck', 'Вкл'],

  // --- БЛОК 10: 14 ГЕОГРАФИЧЕСКИХ ОРИЕНТИРОВ ДАЛЬЯНА [LANDMARKS] ---
  ['10. Ориентиры', 'landmarks_title', 'Заголовок секции ориентиров', '14 географических ориентиров Дальяна', '14 Geographical Landmarks of Dalyan', 'Dalyan\'ın 14 Coğrafi İşareti', 'MapPin', 'Вкл'],
  ['10. Ориентиры', 'landmarks_subtitle', 'Подзаголовок секции ориентиров', 'Точные расстояния и тайминг от виллы • Пешеходная доступность центра и заповедная природа', 'Exact distances and travel times from the villa • Walking access to center and nature reserve', 'Villadan kesin mesafeler ve ulaşım süreleri • Merkeze yürüme mesafesi ve koruma altındaki doğa', 'Navigation', 'Вкл'],
  ['10. Ориентиры', 'landmarks_address', 'Официальный адрес виллы для навигатора', 'Dalyan, Rodoslu Yaşar Sünger Sk, NO 28/2, 48600 Ortaca / Muğla, Turkey', 'Dalyan, Rodoslu Yasar Sunger Sk, NO 28/2, 48600 Ortaca / Mugla, Turkey', 'Dalyan, Rodoslu Yaşar Sünger Sk, NO 28/2, 48600 Ortaca / Muğla, Türkiye', 'MapPin', 'Вкл'],
  ['10. Ориентиры', 'landmarks_maps_url', 'Прямая ссылка на геолокацию в Google Maps', 'https://maps.app.goo.gl/tPgCjCwz4pzq28pE9', 'https://maps.app.goo.gl/tPgCjCwz4pzq28pE9', 'https://maps.app.goo.gl/tPgCjCwz4pzq28pE9', 'https://maps.app.goo.gl/tPgCjCwz4pzq28pE9', 'Вкл'],
  ['10. Ориентиры', 'landmarks_gps', 'Координаты GPS виллы', '36.8336° N, 28.6439° E', '36.8336° N, 28.6439° E', '36.8336° N, 28.6439° E', 'Compass', 'Вкл'],
  ['10. Ориентиры', 'landmark_1', 'Ориентир 1: Пешеходный центр Дальяна', 'Пешеходный центр Дальяна: главная улица, рестораны, кофейни, аптеки, банкоматы и сувенирные лавки', 'Pedestrian center of Dalyan: main street, restaurants, cafes, pharmacies, ATMs, shops', 'Dalyan yaya merkezi: ana cadde, restoranlar, kafeler, eczaneler, ATMler ve hediyelik dükkanlar', '250 м|3 мин пешком|walk|В шаговой доступности|Footprints', 'Вкл'],
  ['10. Ориентиры', 'landmark_2', 'Ориентир 2: Речная набережная и причал', 'Речная набережная и центральный причал речных лодок-такси и экскурсионных катеров', 'River promenade and main pier for river water taxis and excursion boats', 'Nehir kordonu ve nehir taksi tekneleri ile tur teknelerinin ana iskelesi', '400 м|5 мин пешком|walk|Река Дальян|Compass', 'Вкл'],
  ['10. Ориентиры', 'landmark_3', 'Ориентир 3: Ресторан La Boheme Dalyan Bistro', 'Ресторан авторской кухни La Boheme Dalyan Bistro: средиземноморская и европейская кухня', 'Gourmet restaurant La Boheme Dalyan Bistro: author Mediterranean and European cuisine', 'Özel lezzetler sunan La Boheme Dalyan Bistro: Akdeniz ve Avrupa mutfağı', '350 м|4 мин пешком|food|Гастрономия|Utensils', 'Вкл'],
  ['10. Ориентиры', 'landmark_4', 'Ориентир 4: Ресторан Çiçek Restoran', 'Традиционный эгейский рыбный ресторан Çiçek Restoran: свежайшие морепродукты и домашние мезе', 'Traditional Aegean fish restaurant Çiçek Restoran: fresh seafood and homemade mezes', 'Geleneksel Ege balık restoranı Çiçek Restoran: taze deniz ürünleri ve ev yapımı mezeler', '500 м|6 мин пешком|food|Свежая рыба|Utensils', 'Вкл'],
  ['10. Ориентиры', 'landmark_5', 'Ориентир 5: Субботний фермерский рынок', 'Субботний фермерский рынок Дальяна: деревенские сыры, оливки, свежие фрукты, специи и гранатовый сок', 'Dalyan Saturday Farmers Market: village cheeses, olives, fresh fruits, spices, pomegranate syrup', 'Dalyan Cumartesi Köy Pazarı: köy peynirleri, zeytinler, taze meyveler, baharatlar ve nar ekşisi', '600 м|7 мин пешком|walk|Суббота|ShoppingBag', 'Вкл'],
  ['10. Ориентиры', 'landmark_6', 'Ориентир 6: Ликийские скальные гробницы', 'Ликийские скальные гробницы карийских царей IV века до н.э., высеченные в скале, с вечерней иллюминацией', 'Lycian rock tombs of Carian kings 4th century BC carved into rock cliff with evening lighting', 'M.Ö. 4. yüzyıl Karia krallarına ait sarp kayalara oyulmuş Likya Kaya Mezarları, akşam ışıklandırmalı', '450 м|Прямая видимость|nature|UNESCO Heritage|Mountain', 'Вкл'],
  ['10. Ориентиры', 'landmark_7', 'Ориентир 7: Античный город Каунос', 'Античный город Каунос: амфитеатр, римские термы, агора, базилика и акрополь на вершине холма', 'Ancient city of Kaunos: amphitheater, Roman baths, agora, basilica, acropolis on hill', 'Antik Kaunos Kenti: amfitiyatro, Roma hamamları, agora, bazilika ve tepedeki akropol', '1.5 км|Лодка + 15 мин|nature|Античная история|Compass', 'Вкл'],
  ['10. Ориентиры', 'landmark_8', 'Ориентир 8: Источники и грязи Султание', 'Радоновые термальные источники и целебные минеральные грязи Султание на берегу озера Кёйджегиз', 'Radon thermal hot springs and healing mineral mud baths of Sultaniye on Lake Koycegiz shore', 'Köyceğiz Gölü kıyısındaki şifalı radon termal kaplıcaları ve Sultaniye kükürtlü çamur banyoları', '4 км лодка / 12 км авто|15-20 мин|nature|Оздоровление|Waves', 'Вкл'],
  ['10. Ориентиры', 'landmark_9', 'Ориентир 9: Песчаный черепаший пляж Изтузу', 'Заповедный песчаный черепаший пляж Изтузу: золотой песок 4.5 км, место гнездования черепах Caretta-Caretta', 'Protected sandy Iztuzu Turtle Beach: 4.5 km golden sand spit, nesting site of Caretta-Caretta turtles', 'Koruma altındaki İztuzu Kaplumbağa Plajı: 4.5 km altın kumsal, Caretta-Caretta yuvalama alanı', '11 км|15 мин авто / 35 мин лодка|beach|Заповедник|Sun', 'Вкл'],
  ['10. Ориентиры', 'landmark_10', 'Ориентир 10: Пресноводное озеро Кёйджегиз', 'Пресноводное озеро Кёйджегиз: живописные заливы, водные прогулки на катерах, сапбординг и рыбалка', 'Freshwater Lake Koycegiz: picturesque bays, motorboat trips, paddleboarding and lake fishing', 'Tatlı su Köyceğiz Gölü: pitoresk koylar, motorlu tekne gezileri, SUP kürek sörfü ve balıkçılık', '5 км|10 мин авто / 25 мин катер|nature|Водный спорт|Waves', 'Вкл'],
  ['10. Ориентиры', 'landmark_11', 'Ориентир 11: Смотровая площадка на горе Радар', 'Смотровая площадка на горе Радар: круговая панорама 360° на дельту реки Дальян, косу Изтузу и море', 'Radar Mountain Viewpoint: 360-degree circular panoramic view over Dalyan delta, Iztuzu spit and sea', 'Radar Tepesi Seyir Noktası: Dalyan deltası, İztuzu kordonu ve denizin 360 derece panoramik manzarası', '8 км|20 мин на авто|nature|Панорама 360°|Eye', 'Вкл'],
  ['10. Ориентиры', 'landmark_12', 'Ориентир 12: Центр реабилитации черепах DEKAMER', 'Научно-исследовательский и реабилитационный центр спасения морских черепах DEKAMER на пляже Изтузу', 'DEKAMER Sea Turtle Research, Rescue and Rehabilitation Center located at Iztuzu Beach', 'İztuzu Plajı\'ndaki DEKAMER Deniz Kaplumbağaları Araştırma, Kurtarma ve Rehabilitasyon Merkezi', '12 км|18 мин на авто|nature|Экология|Compass', 'Вкл'],
  ['10. Ориентиры', 'landmark_13', 'Ориентир 13: Международный аэропорт Даламан [DLM]', 'Международный аэропорт Даламан DLM: круглосуточный прием внутренних и международных рейсов', 'Dalaman International Airport DLM: 24/7 domestic and international flight reception', 'Dalaman Uluslararası Havalimanı DLM: iç ve dış hat uçuşları için 24 saat kesintisiz hizmet', '30 км|25-30 мин на авто|transport|Аэропорт|Plane', 'Вкл'],
  ['10. Ориентиры', 'landmark_14', 'Ориентир 14: Морской курортный город Мармарис', 'Крупный морской порт и курортный город Мармарис: марины для суперяхт, набережная и шоппинг', 'Major maritime seaport and resort city of Marmaris: superyacht marinas, promenade, dining, shopping', 'Büyük liman ve turizm şehri Marmaris: süperyat marinaları, kordon boyu, restoranlar ve alışveriş', '85 км|1 час 15 мин на авто|city|Эгейская Ривьера|Car', 'Вкл'],

  // --- БЛОК 11: 🌊 СПА-КОМПЛЕКС, БАССЕЙН С СОЛЕНОЙ ВОДОЙ И САД [SPA & POOL] ---
  ['11. Спа и Бассейн', 'spa_title', 'Заголовок секции спа-комплекса', 'Спа-комплекс и бассейн с соленой водой', 'Spa Complex & Saltwater Pool', 'Spa Kompleksi ve Tuzlu Su Havuzu', 'Waves', 'Вкл'],
  ['11. Спа и Бассейн', 'spa_subtitle', 'Подзаголовок секции спа-комплекса', 'Приватная закрытая территория, солевой бассейн 36 м², гидромассажное джакузи и лаунж-зона отдыха', 'Gated private territory, 36 sqm saltwater pool, hydro-massage jacuzzi and outdoor relaxation lounge', 'Özel korunaklı alan, 36 m² tuzlu su havuzu, hidromasajlı jakuzi ve açık dinlenme alanı', 'Sparkles', 'Вкл'],
  ['11. Спа и Бассейн', 'spa_pool_title', 'Название карточки бассейна', 'Приватный бассейн с соленой водой', 'Private Saltwater Pool', 'Özel Tuzlu Su Havuzu', 'Waves', 'Вкл'],
  ['11. Спа и Бассейн', 'spa_pool_desc', 'Характеристики и описание бассейна', 'Чаша 4 × 9 метров [площадь 36 кв. м], постоянная комфортная глубина 150 см по всей площади чаши. Мягкая природная минерализация исключает раздражение кожи и едкий запах хлора.', 'Pool bowl 4x9 meters [area 36 sqm], constant comfortable depth of 150 cm throughout. Gentle natural mineralization prevents skin irritation and chlorine smell.', '4x9 metre havuz ölçüsü [36 m² alan], tüm havuz boyunca sabit ve konforlu 150 cm derinlik. Yumuşak doğal mineralizasyon cilt tahrişini ve klor kokusunu önler.', 'Droplets', 'Вкл'],
  ['11. Спа и Бассейн', 'spa_pool_badge', 'Бейдж бассейна', 'Соленая вода без хлора', 'Saltwater without chlorine', 'Klorsuz tuzlu su', '', 'Вкл'],
  ['11. Спа и Бассейн', 'spa_pool_season', 'Сезон работы бассейна', 'Сезон работы: с 1 мая по 1 ноября', 'Operating season: May 1 to November 1', 'Çalışma sezonu: 1 Mayıs - 1 Kasım', 'Calendar', 'Вкл'],
  ['11. Спа и Бассейн', 'spa_pool_lighting', 'График подсветки бассейна', 'Подводная ночная подсветка: 20:00 - 01:00', 'Underwater night lighting: 20:00 - 01:00', 'Gece sualtı aydınlatması: 20:00 - 01:00', 'Clock', 'Вкл'],
  ['11. Спа и Бассейн', 'spa_pool_maintenance', 'Регламент очистки бассейна', 'График чистки: в день заселения и далее каждые 7 дней', 'Maintenance schedule: on check-in day and every 7 days', 'Temizlik takvimi: giriş gününde ve her 7 günde bir', 'Droplets', 'Вкл'],
  ['11. Спа и Бассейн', 'spa_jacuzzi_title', 'Название карточки джакузи', 'Открытое уличное джакузи', 'Outdoor Open-Air Jacuzzi', 'Açık Hava Jakuzisi', 'Sparkles', 'Вкл'],
  ['11. Спа и Бассейн', 'spa_jacuzzi_desc', 'Описание и функционал джакузи', 'Гидромассажная спа-ванна в зоне бассейна с подогревом и регулируемыми форсунками для глубокого расслабления на свежем воздухе.', 'Heated hydromassage spa tub in pool zone with adjustable jets for deep outdoor muscle relaxation.', 'Havuz alanında açık havada derin kas gevşemesi sağlayan ısıtmalı ve ayarlanabilir jetlere sahip hidromasajlı jakuzi.', 'Sparkles', 'Вкл'],
  ['11. Спа и Бассейн', 'spa_jacuzzi_badge', 'Вместимость джакузи', 'Вместимость: 4 персоны', 'Capacity: 4 guests', 'Kapasite: 4 kişi', '', 'Вкл'],
  ['11. Спа и Бассейн', 'spa_jacuzzi_schedule', 'Режим и алгоритм джакузи', 'Режим работы: 10:00 - 17:00 [15 мин каждые 45 мин]', 'Operating hours: 10:00 - 17:00 [15 min every 45 min]', 'Çalışma saatleri: 10:00 - 17:00 [45 dakikada bir 15 dk]', 'Clock', 'Вкл'],
  ['11. Спа и Бассейн', 'spa_jacuzzi_lighting', 'Подсветка джакузи', 'Подсветка джакузи: 20:00 - 01:00', 'Jacuzzi lighting: 20:00 - 01:00', 'Jakuzi aydınlatması: 20:00 - 01:00', 'Moon', 'Вкл'],
  ['11. Спа и Бассейн', 'spa_jacuzzi_season', 'Сезон работы джакузи', 'Период активности: с 1 мая по 1 ноября', 'Activity period: May 1 to November 1', 'Aktif dönem: 1 Mayıs - 1 Kasım', 'Calendar', 'Вкл'],
  ['11. Спа и Бассейн', 'spa_street_lighting_title', 'Освещение территории', 'Освещение территории', 'Territory Lighting', 'Bahçe Aydınlatması', 'Moon', 'Вкл'],
  ['11. Спа и Бассейн', 'spa_street_lighting_desc', 'График освещения сада', 'Автоматическое включение сада: 20:00 - 01:00 и 04:00 - 06:00', 'Automated garden lights: 20:00 - 01:00 and 04:00 - 06:00', 'Otomatik bahçe aydınlatması: 20:00 - 01:00 ve 04:00 - 06:00', '', 'Вкл'],
  ['11. Спа и Бассейн', 'spa_parking_title', 'Приватная парковка', 'Приватная парковка', 'Private On-Site Parking', 'Özel Otopark', 'Car', 'Вкл'],
  ['11. Спа и Бассейн', 'spa_parking_desc', 'Описание парковки', 'Закрытая бесплатная парковка на территории виллы на 2 автомобиля', 'Gated free parking on villa grounds for 2 vehicles', 'Villa mülkü içinde 2 araçlık ücretsiz kapalı otopark', '', 'Вкл'],
  ['11. Спа и Бассейн', 'spa_bbq_title', 'Зона BBQ и лаунж', 'BBQ и обеденная зона', 'BBQ & Dining Area', 'Barbekü ve Yemek Alanı', 'Flame', 'Вкл'],
  ['11. Спа и Бассейн', 'spa_bbq_desc', 'Описание зоны барбекю', 'Обеденный стол на 8 мест, гриль на углях, шезлонги и уличный душ', 'Outdoor dining table for 8, charcoal grill, sun loungers, poolside shower', '8 kişilik açık yemek masası, kömürlü ızgara, şezlonglar ve havuz duşu', '', 'Вкл'],

  // --- БЛОК 12: ⚖️ БЕЗОПАСНОСТЬ, ЗАКОН № 7464 И ДОСТУПНАЯ СРЕДА [LAW, SAFETY & ACCESSIBILITY] ---
  ['12. Безопасность', 'legal_safety_title', 'Заголовок секции безопасности и закона', 'Безопасность, Закон № 7464 и Доступная среда', 'Safety, Law No. 7464 & Accessible Environment', 'Güvenlik, 7464 Sayılı Kanun ve Engelsiz Erişim', 'ShieldCheck', 'Вкл'],
  ['12. Безопасность', 'legal_safety_subtitle', 'Подзаголовок секции безопасности и закона', 'Полное соответствие законодательству Турции о краткосрочной аренде, защита гостей и безбарьерный доступ', 'Full compliance with Turkish short-term rental laws, guest protection and barrier-free access', 'Türkiye kısa dönem kiralama mevzuatına tam uyum, misafir güvenliği ve engelsiz erişim', 'FileText', 'Вкл'],
  ['12. Безопасность', 'legal_law7464_title', 'Заголовок блока Закон 7464', 'Официальный договор и учет KBS', 'Official Contract & KBS Police Registration', 'Resmi Sözleşme ve KBS Polis Kaydı', 'FileText', 'Вкл'],
  ['12. Безопасность', 'legal_law7464_desc', 'Описание блока Закон 7464', 'Вилла осуществляет деятельность в строгом соответствии с Законом № 7464 о краткосрочной туристической аренде в Турции.', 'Villa operates in strict accordance with Turkish Law No. 7464 on Short-Term Tourist Rentals.', 'Villa, Türkiye\'deki 7464 Sayılı Konutların Turizm Amaçlı Kiralanması Kanunu\'na tam uygun olarak işletilmektedir.', '', 'Вкл'],
  ['12. Безопасность', 'legal_law7464_badge', 'Бейдж закона 7464', 'Закон Турции № 7464', 'Turkish Law No. 7464', 'Türkiye Kanunu No. 7464', '', 'Вкл'],
  ['12. Безопасность', 'legal_law7464_item1', 'Пункт 1: Договор найма', 'Обязательный договор краткосрочного найма с описью имущества при заезде', 'Mandatory short-term rental agreement with property inventory upon check-in', 'Girişte demirbaş listesi içeren zorunlu kısa dönem kira sözleşmesi', 'CheckCircle2', 'Вкл'],
  ['12. Безопасность', 'legal_law7464_item2', 'Пункт 2: Регистрация KBS', 'Регистрация паспортов всех проживающих гостей в полицейской системе KBS [Kimlik Bildirme Sistemi]', 'Registration of all residing guests in the Turkish Gendarmerie KBS police system', 'Tüm konaklayan misafirlerin jandarma KBS [Kimlik Bildirme Sistemi] sistemine kaydedilmesi', 'CheckCircle2', 'Вкл'],
  ['12. Безопасность', 'legal_law7464_item3', 'Пункт 3: Запрет третьих лиц', 'Размещение лиц, не внесенных в государственную систему KBS, строго запрещено', 'Accommodation of third parties not registered in the official KBS system is strictly prohibited', 'Resmi KBS sistemine kaydedilmemiş kişilerin konaklaması kesinlikle yasaktır', 'AlertCircle', 'Вкл'],
  ['12. Безопасность', 'legal_security_title', 'Заголовок блока безопасности', 'Безопасность дома и территории', 'Home & Territory Safety Standards', 'Ev ve Mülk Güvenlik Standartları', 'ShieldCheck', 'Вкл'],
  ['12. Безопасность', 'legal_security_desc', 'Описание блока безопасности', 'Оснащение дома сертифицированными системами предупреждения и постоянного мониторинга.', 'Equipping the villa with certified emergency warning systems and 24/7 perimeter monitoring.', 'Villanın sertifikalı uyarı sistemleri ve 24/7 çevre izleme ile donatılması.', '', 'Вкл'],
  ['12. Безопасность', 'legal_security_badge', 'Бейдж стандартов безопасности', 'Стандарты безопасности', 'Safety Standards', 'Güvenlik Standartları', '', 'Вкл'],
  ['12. Безопасность', 'legal_security_item1', 'Пункт 1: Наружное видеонаблюдение', 'Наружные камеры видеонаблюдения установлены строго по периметру забора и у калитки [без съемки бассейна и террасы]', 'External perimeter CCTV security cameras strictly at fence and gate [no cameras in pool or patio]', 'Dış çevre güvenlik kameraları sadece çit ve bahçe kapısında [havuz ve verandada kamera yoktur]', 'Eye', 'Вкл'],
  ['12. Безопасность', 'legal_security_item2', 'Пункт 2: Датчики дыма и газа', 'Сертифицированные автономные датчики дыма и угарного газа на обоих этажах виллы', 'Certified autonomous smoke and carbon monoxide detectors on both villa floors', 'Villanın her iki katında sertifikalı duman ve karbonmonoksit dedektörleri', 'Flame', 'Вкл'],
  ['12. Безопасность', 'legal_security_item3', 'Пункт 3: Огнетушители и аптечка', 'Огнетушители на 1 и 2 этажах, укомплектованная медицинская аптечка первой помощи', 'Fire extinguishers on 1st and 2nd floors, fully equipped emergency first aid kit', '1. ve 2. katlarda yangın söndürücüler, tam donanımlı ilk yardım tıbbi çantası', 'ShieldCheck', 'Вкл'],
  ['12. Безопасность', 'legal_accessible_title', 'Заголовок блока доступной среды', 'Инклюзивность и доступная среда', 'Inclusivity & Accessible Environment', 'Kapsayıcılık ve Engelsiz Erişim', 'Accessibility', 'Вкл'],
  ['12. Безопасность', 'legal_accessible_desc', 'Описание доступной среды', 'Создание безбарьерных условий для комфортного отдыха гостей с ограниченной мобильностью.', 'Creating barrier-free environment for guests with reduced mobility and senior family members.', 'Hareket kısıtlılığı olan misafirler ve yaşlılar için engelsiz yaşam koşulları oluşturma.', '', 'Вкл'],
  ['12. Безопасность', 'legal_accessible_badge', 'Бейдж безбарьерной среды', 'Безбарьерная среда', 'Barrier-free Access', 'Engelsiz Yaşam', '', 'Вкл'],
  ['12. Безопасность', 'legal_accessible_item1', 'Пункт 1: Спальня 1 этажа', 'Безбарьерный доступ: спальня №1 на 1 этаже оборудована широкими дверными проемами без порогов', 'Barrier-free access: Bedroom 1 on ground floor has wide doorways and zero-threshold transitions', 'Engelsiz erişim: Giriş katındaki 1. yatak odası eşiksiz geçişler ve geniş kapılarla donatılmıştır', 'DoorOpen', 'Вкл'],
  ['12. Безопасность', 'legal_accessible_item2', 'Пункт 2: Санузел для МГН', 'Санузел первого этажа спроектирован с возможностью комфортного использования гостями с ограниченной мобильностью', 'Ground floor bathroom designed for comfortable independent access by guests with limited mobility', 'Giriş katındaki banyo, hareket kısıtlılığı olan misafirlerin konforlu kullanımı için tasarlanmıştır', 'CheckCircle2', 'Вкл'],
  ['12. Безопасность', 'legal_accessible_item3', 'Пункт 3: Подъемник в бассейн', 'Возможность установки мобильного подъемника для спуска в бассейн по предварительному запросу', 'Option to install a specialized mobile pool lift for water descent upon advance request', 'Önceden talep edilmesi durumunda havuza iniş için özel mobil asansör kurulum imkanı', 'Accessibility', 'Вкл'],
  ['12. Безопасность', 'legal_cancellation_title', 'Заголовок политики отмены', 'Политика отмены и возврата', 'Cancellation & Refund Policy', 'İptal ve İade Politikası', 'Clock', 'Вкл'],
  ['12. Безопасность', 'legal_cancellation_desc', 'Описание политики отмены', 'Прозрачные финансовые условия бронирования без скрытых штрафов.', 'Transparent booking financial conditions without hidden cancellation fees.', 'Gizli ceza olmaksızın şeffaf rezervasyon ve mali koşullar.', '', 'Вкл'],
  ['12. Безопасность', 'legal_cancellation_badge', 'Бейдж возврата 100%', 'Возврат 100%', '100% Refund', '%100 İade', '', 'Вкл'],
  ['12. Безопасность', 'legal_cancellation_item1', 'Пункт 1: 14 дней отмена', 'Полный 100% возврат предоплаты при отмене более чем за 14 суток до даты заезда', 'Full 100% refund of advance payment if canceled more than 14 days prior to check-in date', 'Giriş tarihinden 14 gün öncesine kadar yapılan iptallerde %100 kesintisiz ön ödeme iadesi', 'CheckCircle2', 'Вкл'],
  ['12. Безопасность', 'legal_cancellation_item2', 'Пункт 2: Менее 14 дней', 'При отмене менее чем за 14 суток до заезда удерживается стоимость проживания за первые сутки', 'For cancellations less than 14 days before arrival, the cost of the first night is retained', 'Girişe 14 günden daha az süre kala yapılan iptallerde ilk gecelik konaklama ücreti tahsil edilir', 'AlertCircle', 'Вкл'],
  ['12. Безопасность', 'legal_cancellation_item3', 'Пункт 3: Инвойс e-Arşiv Fatura', 'Официальное оформление e-Arşiv Fatura на имя гостя согласно VUK 213 Madde 230', 'Official issuance of e-Arşiv Fatura tax invoice in guest\'s name under VUK 213 Article 230', 'VUK 213 Madde 230 uyarınca misafir adına resmi e-Arşiv Fatura düzenlenmesi', 'FileText', 'Вкл']
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

// Построение производных структурированных коллекций для витрины виллы
function buildHomeDerivedCollections(home) {
  if (!home) return;

  // 1. Спальни
  if (!home.bedrooms || home.bedrooms.length === 0) {
    const bedroomsList = [];
    [1, 2, 3, 4].forEach((i) => {
      const item = home[`bedroom_${i}`];
      if (item && item.enabled !== false) {
        const descItem = home[`bedroom_${i}_desc`];
        const badgeItem = home[`bedroom_${i}_badge`];
        bedroomsList.push({
          id: i,
          title: { ru: item.ru, en: item.en, tr: item.tr },
          desc: {
            ru: descItem?.ru || item.ru,
            en: descItem?.en || item.en,
            tr: descItem?.tr || item.tr
          },
          badge: {
            ru: badgeItem?.ru || `Спальня ${i}`,
            en: badgeItem?.en || `Bedroom ${i}`,
            tr: badgeItem?.tr || `Yatak Odası ${i}`
          },
          image: item.media || '',
          iconName: descItem?.media || 'BedDouble'
        });
      }
    });
    home.bedrooms = bedroomsList;
  }

  // 2. Удобства основные [Main Amenities]
  if (!home.mainAmenities || home.mainAmenities.length === 0) {
    const mainAmenitiesList = [];
    for (let i = 1; i <= 20; i++) {
      const item = home[`amenity_main_${i}`];
      if (item && item.enabled !== false) {
        mainAmenitiesList.push({
          key: `amenity_main_${i}`,
          label: { ru: item.ru, en: item.en, tr: item.tr },
          icon: item.media || 'Check'
        });
      }
    }
    home.mainAmenities = mainAmenitiesList;
  }

  // 3. Удобства сгруппированные для модального окна [Grouped Amenities]
  if (!home.amenitiesGrouped || home.amenitiesGrouped.length === 0) {
    const groupedAmenitiesList = [];
    for (let c = 1; c <= 10; c++) {
      const catTitleItem = home[`amenity_cat${c}_title`];
      if (catTitleItem && catTitleItem.enabled !== false) {
        const items = [];
        for (let it = 1; it <= 20; it++) {
          const item = home[`amenity_cat${c}_item${it}`];
          if (item && item.enabled !== false) {
            items.push({
              ru: item.ru,
              en: item.en,
              tr: item.tr
            });
          }
        }
        groupedAmenitiesList.push({
          category: {
            ru: catTitleItem.ru,
            en: catTitleItem.en,
            tr: catTitleItem.tr
          },
          icon: catTitleItem.media || 'Check',
          items
        });
      }
    }
    home.amenitiesGrouped = groupedAmenitiesList;
  }

  // 4. Отзывы и критерии оценок [Reviews]
  if (!home.reviewsData || !home.reviewsData.reviews || home.reviewsData.reviews.length === 0) {
    const reviewCatsList = [];
    for (let c = 1; c <= 10; c++) {
      const item = home[`review_cat_${c}`];
      if (item && item.enabled !== false) {
        const parts = (item.media || '5.0|100').split('|');
        const score = parts[0] || '5.0';
        const percent = parseInt(parts[1], 10) || 100;
        reviewCatsList.push({
          label: { ru: item.ru, en: item.en, tr: item.tr },
          score,
          percent
        });
      }
    }
    const reviewCardsList = [];
    for (let r = 1; r <= 10; r++) {
      const authItem = home[`review_${r}_author`];
      const textItem = home[`review_${r}_text`];
      if (authItem && authItem.enabled !== false) {
        reviewCardsList.push({
          author: { ru: authItem.ru, en: authItem.en, tr: authItem.tr },
          avatar: authItem.media || '',
          comment: { ru: textItem?.ru || '', en: textItem?.en || '', tr: textItem?.tr || '' }
        });
      }
    }
    home.reviewsData = {
      header: home.reviews_score_header || null,
      categories: reviewCatsList,
      reviews: reviewCardsList
    };
  }

  // 5. Описание виллы и правила [About & Rules]
  if (!home.aboutSections || home.aboutSections.length === 0) {
    const aboutSectionsList = [];
    for (let s = 1; s <= 10; s++) {
      const titleItem = home[`about_sec_${s}_title`];
      const textItem = home[`about_sec_${s}_text`];
      if (titleItem && titleItem.enabled !== false) {
        aboutSectionsList.push({
          id: String(s),
          title: { ru: titleItem.ru, en: titleItem.en, tr: titleItem.tr },
          text: { ru: textItem?.ru || '', en: textItem?.en || '', tr: textItem?.tr || '' }
        });
      }
    }
    home.aboutSections = aboutSectionsList;
  }

  // 6. Географические ориентиры Дальяна [Landmarks] (14 локаций)
  if (!home.landmarksList || home.landmarksList.length === 0) {
    const landmarksList = [];
    const landmarkCategoryMap = {
      1: 'walk', 2: 'walk', 3: 'food', 4: 'food', 5: 'walk',
      6: 'nature', 7: 'nature', 8: 'nature', 9: 'beach',
      10: 'nature', 11: 'nature', 12: 'nature', 13: 'transport', 14: 'city'
    };
    const landmarkDefaultTitles = {
      1: { ru: 'Пешеходный центр Дальяна', en: 'Dalyan Pedestrian Center', tr: 'Dalyan Yaya Merkezi' },
      2: { ru: 'Речная набережная и причал', en: 'River Promenade & Pier', tr: 'Nehir Kordonu ve İskele' },
      3: { ru: 'Ресторан La Boheme Dalyan Bistro', en: 'La Boheme Dalyan Bistro Restaurant', tr: 'La Boheme Dalyan Bistro Restoranı' },
      4: { ru: 'Ресторан Çiçek Restoran', en: 'Çiçek Restoran Restaurant', tr: 'Çiçek Restoran' },
      5: { ru: 'Субботний фермерский рынок', en: 'Saturday Farmers Market', tr: 'Cumartesi Köy Pazarı' },
      6: { ru: 'Ликийские скальные гробницы', en: 'Lycian Rock Tombs', tr: 'Likya Kaya Mezarları' },
      7: { ru: 'Античный город Каунос', en: 'Ancient City of Kaunos', tr: 'Antik Kaunos Kenti' },
      8: { ru: 'Источники и грязи Султание', en: 'Sultaniye Thermal Springs & Mud Baths', tr: 'Sultaniye Kaplıcaları ve Çamur Banyoları' },
      9: { ru: 'Песчаный черепаший пляж Изтузу', en: 'Protected Iztuzu Turtle Beach', tr: 'İztuzu Kaplumbağa Plajı' },
      10: { ru: 'Пресноводное озеро Кёйджегиз', en: 'Freshwater Lake Koycegiz', tr: 'Tatlı su Köyceğiz Gölü' },
      11: { ru: 'Смотровая площадка на горе Радар', en: 'Radar Mountain Viewpoint', tr: 'Radar Tepesi Seyir Noktası' },
      12: { ru: 'Центр реабилитации черепах DEKAMER', en: 'DEKAMER Sea Turtle Rescue Center', tr: 'DEKAMER Kaplumbağa Kurtarma Merkezi' },
      13: { ru: 'Международный аэропорт Даламан [DLM]', en: 'Dalaman International Airport [DLM]', tr: 'Dalaman Uluslararası Havalimanı [DLM]' },
      14: { ru: 'Морской курортный город Мармарис', en: 'Resort City of Marmaris', tr: 'Liman Şehri Marmaris' }
    };

    for (let i = 1; i <= 14; i++) {
      const item = home[`landmark_${i}`];
      if (item && item.enabled !== false) {
        const mediaParts = (item.media || '').split('|');
        const distance = mediaParts[0] || '';
        const time = mediaParts[1] || '';
        const category = mediaParts[2] || landmarkCategoryMap[i] || 'nature';
        const badge = mediaParts[3] || '';
        const icon = mediaParts[4] || 'MapPin';
        const titleObj = landmarkDefaultTitles[i] || { ru: `Ориентир ${i}`, en: `Landmark ${i}`, tr: `Nokta ${i}` };

        landmarksList.push({
          id: `landmark_${i}`,
          index: i,
          category,
          icon,
          distance,
          time,
          badge,
          title: titleObj,
          desc: { ru: item.ru, en: item.en, tr: item.tr }
        });
      }
    }
    home.landmarksList = landmarksList;
  }

  // 7. Спа-комплекс, бассейн и сад [Spa & Pool Data]
  if (!home.spaData) {
    home.spaData = {
      title: home.spa_title || { ru: 'Спа-комплекс и бассейн с соленой водой', en: 'Spa Complex & Saltwater Pool', tr: 'Spa Kompleksi ve Tuzlu Su Havuzu' },
      subtitle: home.spa_subtitle || { ru: 'Приватная закрытая территория, солевой бассейн 36 м², гидромассажное джакузи и лаунж-зона отдыха', en: 'Gated private territory, 36 sqm saltwater pool, hydro-massage jacuzzi and outdoor relaxation lounge', tr: 'Özel korunaklı alan, 36 m² tuzlu su havuzu, hidromasajlı jakuzi ve açık dinlenme alanı' },
      poolTitle: home.spa_pool_title || { ru: 'Приватный бассейн с соленой водой', en: 'Private Saltwater Pool', tr: 'Özel Tuzlu Su Havuzu' },
      poolDesc: home.spa_pool_desc || { ru: 'Чаша 4 × 9 метров [площадь 36 кв. м], постоянная комфортная глубина 150 см по всей площади чаши. Мягкая природная минерализация исключает раздражение кожи и едкий запах хлора.', en: 'Pool bowl 4x9 meters [area 36 sqm], constant comfortable depth of 150 cm throughout. Gentle natural mineralization prevents skin irritation and chlorine smell.', tr: '4x9 metre havuz ölçüsü [36 m² alan], tüm havuz boyunca sabit ve konforlu 150 cm derinlik. Yumuşak doğal mineralizasyon cilt tahrişini ve klor kokusunu önler.' },
      poolBadge: home.spa_pool_badge || { ru: 'Соленая вода без хлора', en: 'Saltwater without chlorine', tr: 'Klorsuz tuzlu su' },
      poolSeason: home.spa_pool_season || { ru: 'Сезон работы: с 1 мая по 1 ноября', en: 'Operating season: May 1 to November 1', tr: 'Çalışma sezonu: 1 Mayıs - 1 Kasım' },
      poolLighting: home.spa_pool_lighting || { ru: 'Подводная ночная подсветка: 20:00 - 01:00', en: 'Underwater night lighting: 20:00 - 01:00', tr: 'Gece sualtı aydınlatması: 20:00 - 01:00' },
      poolMaintenance: home.spa_pool_maintenance || { ru: 'График чистки: в день заселения и далее каждые 7 дней', en: 'Maintenance schedule: on check-in day and every 7 days', tr: 'Temizlik takvimi: giriş gününde ve her 7 günde bir' },
      jacuzziTitle: home.spa_jacuzzi_title || { ru: 'Открытое уличное джакузи', en: 'Outdoor Open-Air Jacuzzi', tr: 'Açık Hava Jakuzisi' },
      jacuzziDesc: home.spa_jacuzzi_desc || { ru: 'Гидромассажная спа-ванна в зоне бассейна с подогревом и регулируемыми форсунками для глубокого расслабления на свежем воздухе.', en: 'Heated hydromassage spa tub in pool zone with adjustable jets for deep outdoor muscle relaxation.', tr: 'Havuz alanında açık havada derin kas gevşemesi sağlayan ısıtmalı ve ayarlanabilir jetlere sahip hidromasajlı jakuzi.' },
      jacuzziBadge: home.spa_jacuzzi_badge || { ru: 'Вместимость: 4 персоны', en: 'Capacity: 4 guests', tr: 'Kapasite: 4 kişi' },
      jacuzziSchedule: home.spa_jacuzzi_schedule || { ru: 'Режим работы: 10:00 - 17:00 [15 мин каждые 45 мин]', en: 'Operating hours: 10:00 - 17:00 [15 min every 45 min]', tr: 'Çalışma saatleri: 10:00 - 17:00 [45 dakikada bir 15 dk]' },
      jacuzziLighting: home.spa_jacuzzi_lighting || { ru: 'Подсветка джакузи: 20:00 - 01:00', en: 'Jacuzzi lighting: 20:00 - 01:00', tr: 'Jakuzi aydınlatması: 20:00 - 01:00' },
      jacuzziSeason: home.spa_jacuzzi_season || { ru: 'Период активности: с 1 мая по 1 ноября', en: 'Activity period: May 1 to November 1', tr: 'Aktif dönem: 1 Mayıs - 1 Kasım' },
      streetLightingTitle: home.spa_street_lighting_title || { ru: 'Освещение территории', en: 'Territory Lighting', tr: 'Bahçe Aydınlatması' },
      streetLightingDesc: home.spa_street_lighting_desc || { ru: 'Автоматическое включение сада: 20:00 - 01:00 и 04:00 - 06:00', en: 'Automated garden lights: 20:00 - 01:00 and 04:00 - 06:00', tr: 'Otomatik bahçe aydınlatması: 20:00 - 01:00 ve 04:00 - 06:00' },
      parkingTitle: home.spa_parking_title || { ru: 'Приватная парковка', en: 'Private On-Site Parking', tr: 'Özel Otopark' },
      parkingDesc: home.spa_parking_desc || { ru: 'Закрытая бесплатная парковка на территории виллы на 2 автомобиля', en: 'Gated free parking on villa grounds for 2 vehicles', tr: 'Villa mülkü içinde 2 araçlık ücretsiz kapalı otopark' },
      bbqTitle: home.spa_bbq_title || { ru: 'BBQ и обеденная зона', en: 'BBQ & Dining Area', tr: 'Barbekü ve Yemek Alanı' },
      bbqDesc: home.spa_bbq_desc || { ru: 'Обеденный стол на 8 мест, гриль на углях, шезлонги и уличный душ', en: 'Outdoor dining table for 8, charcoal grill, sun loungers, poolside shower', tr: '8 kişilik açık yemek masası, kömürlü ızgara, şezlonglar ve havuz duşu' }
    };
  }

  // 8. Безопасность, Закон № 7464 и доступная среда [Safety, Law 7464 & Accessibility]
  if (!home.safetyData) {
    home.safetyData = {
      title: home.legal_safety_title || { ru: 'Безопасность, Закон № 7464 и Доступная среда', en: 'Safety, Law No. 7464 & Accessible Environment', tr: 'Güvenlik, 7464 Sayılı Kanun ve Engelsiz Erişim' },
      subtitle: home.legal_safety_subtitle || { ru: 'Полное соответствие законодательству Турции о краткосрочной аренде, защита гостей и безбарьерный доступ', en: 'Full compliance with Turkish short-term rental laws, guest protection and barrier-free access', tr: 'Türkiye kısa dönem kiralama mevzuatına tam uyum, misafir güvenliği ve engelsiz erişim' },
      law7464Title: home.legal_law7464_title || { ru: 'Официальный договор и учет KBS', en: 'Official Contract & KBS Police Registration', tr: 'Resmi Sözleşme ve KBS Polis Kaydı' },
      law7464Desc: home.legal_law7464_desc || { ru: 'Вилла осуществляет деятельность в строгом соответствии с Законом № 7464 о краткосрочной туристической аренде в Турции.', en: 'Villa operates in strict accordance with Turkish Law No. 7464 on Short-Term Tourist Rentals.', tr: 'Villa, Türkiye\'deki 7464 Sayılı Konutların Turizm Amaçlı Kiralanması Kanunu\'na tam uygun olarak işletilmektedir.' },
      law7464Badge: home.legal_law7464_badge || { ru: 'Закон Турции № 7464', en: 'Turkish Law No. 7464', tr: 'Türkiye Kanunu No. 7464' },
      law7464Item1: home.legal_law7464_item1 || { ru: 'Обязательный договор краткосрочного найма с описью имущества при заезде', en: 'Mandatory short-term rental agreement with property inventory upon check-in', tr: 'Girişte demirbaş listesi içeren zorunlu kısa dönem kira sözleşmesi' },
      law7464Item2: home.legal_law7464_item2 || { ru: 'Регистрация паспортов всех проживающих гостей в полицейской системе KBS [Kimlik Bildirme Sistemi]', en: 'Registration of all residing guests in the Turkish Gendarmerie KBS police system', tr: 'Tüm konaklayan misafirlerin jandarma KBS [Kimlik Bildirme Sistemi] sistemine kaydedilmesi' },
      law7464Item3: home.legal_law7464_item3 || { ru: 'Размещение лиц, не внесенных в государственную систему KBS, строго запрещено', en: 'Accommodation of third parties not registered in the official KBS system is strictly prohibited', tr: 'Resmi KBS sistemine kaydedilmemiş kişilerin konaklaması kesinlikle yasaktır' },
      securityTitle: home.legal_security_title || { ru: 'Безопасность дома и территории', en: 'Home & Territory Safety Standards', tr: 'Ev ve Mülk Güvenlik Standartları' },
      securityDesc: home.legal_security_desc || { ru: 'Оснащение дома сертифицированными системами предупреждения и постоянного мониторинга.', en: 'Equipping the villa with certified emergency warning systems and 24/7 perimeter monitoring.', tr: 'Villanın sertifikalı uyarı sistemleri ve 24/7 çevre izleme ile donatılması.' },
      securityBadge: home.legal_security_badge || { ru: 'Стандарты безопасности', en: 'Safety Standards', tr: 'Güvenlik Standartları' },
      securityItem1: home.legal_security_item1 || { ru: 'Наружные камеры видеонаблюдения установлены строго по периметру забора и у калитки [без съемки бассейна и террасы]', en: 'External perimeter CCTV security cameras strictly at fence and gate [no cameras in pool or patio]', tr: 'Dış çevre güvenlik kameraları sadece çit ve bahçe kapısında [havuz ve verandada kamera yoktur]' },
      securityItem2: home.legal_security_item2 || { ru: 'Сертифицированные автономные датчики дыма и угарного газа на обоих этажах виллы', en: 'Certified autonomous smoke and carbon monoxide detectors on both villa floors', tr: 'Villanın her iki katında sertifikalı duman ve karbonmonoksit dedektörleri' },
      securityItem3: home.legal_security_item3 || { ru: 'Огнетушители на 1 и 2 этажах, укомплектованная медицинская аптечка первой помощи', en: 'Fire extinguishers on 1st and 2nd floors, fully equipped emergency first aid kit', tr: '1. ve 2. katlarda yangın söndürücüler, tam donanımlı ilk yardım tıbbi çantası' },
      accessibleTitle: home.legal_accessible_title || { ru: 'Инклюзивность и доступная среда', en: 'Inclusivity & Accessible Environment', tr: 'Kapsayıcılık ve Engelsiz Erişim' },
      accessibleDesc: home.legal_accessible_desc || { ru: 'Создание безбарьерных условий для комфортного отдыха гостей с ограниченной мобильностью.', en: 'Creating barrier-free environment for guests with reduced mobility and senior family members.', tr: 'Hareket kısıtlılığı olan misafirler ve yaşlılar için engelsiz yaşam koşulları oluşturma.' },
      accessibleBadge: home.legal_accessible_badge || { ru: 'Безбарьерная среда', en: 'Barrier-free Access', tr: 'Engelsiz Yaşam' },
      accessibleItem1: home.legal_accessible_item1 || { ru: 'Безбарьерный доступ: спальня №1 на 1 этаже оборудована широкими дверными проемами без порогов', en: 'Barrier-free access: Bedroom 1 on ground floor has wide doorways and zero-threshold transitions', tr: 'Engelsiz erişim: Giriş katındaki 1. yatak odası eşiksiz geçişler ve geniş kapılarla donatılmıştır' },
      accessibleItem2: home.legal_accessible_item2 || { ru: 'Санузел первого этажа спроектирован с возможностью комфортного использования гостями с ограниченной мобильностью', en: 'Ground floor bathroom designed for comfortable independent access by guests with limited mobility', tr: 'Giriş katındaki banyo, hareket kısıtlılığı olan misafirlerin konforlu kullanımı için tasarlanmıştır' },
      accessibleItem3: home.legal_accessible_item3 || { ru: 'Возможность установки мобильного подъемника для спуска в бассейн по предварительному запросу', en: 'Option to install a specialized mobile pool lift for water descent upon advance request', tr: 'Önceden talep edilmesi durumunda havuza iniş için özel mobil asansör kurulum imkanı' },
      cancellationTitle: home.legal_cancellation_title || { ru: 'Политика отмены и возврата', en: 'Cancellation & Refund Policy', tr: 'İptal ve İade Politikası' },
      cancellationDesc: home.legal_cancellation_desc || { ru: 'Прозрачные финансовые условия бронирования без скрытых штрафов.', en: 'Transparent booking financial conditions without hidden cancellation fees.', tr: 'Gizli ceza olmaksızın şeffaf rezervasyon ve mali koşullar.' },
      cancellationBadge: home.legal_cancellation_badge || { ru: 'Возврат 100%', en: '100% Refund', tr: '%100 İade' },
      cancellationItem1: home.legal_cancellation_item1 || { ru: 'Полный 100% возврат предоплаты при отмене более чем за 14 суток до даты заезда', en: 'Full 100% refund of advance payment if canceled more than 14 days prior to check-in date', tr: 'Giriş tarihinden 14 gün öncesine kadar yapılan iptallerde %100 kesintisiz ön ödeme iadesi' },
      cancellationItem2: home.legal_cancellation_item2 || { ru: 'При отмене менее чем за 14 суток до заезда удерживается стоимость проживания за первые сутки', en: 'For cancellations less than 14 days before arrival, the cost of the first night is retained', tr: 'Girişe 14 günden daha az süre kala yapılan iptallerde ilk gecelik konaklama ücreti tahsil edilir' },
      cancellationItem3: home.legal_cancellation_item3 || { ru: 'Официальное оформление e-Arşiv Fatura на имя гостя согласно VUK 213 Madde 230', en: 'Official issuance of e-Arşiv Fatura tax invoice in guest\'s name under VUK 213 Article 230', tr: 'VUK 213 Madde 230 uyarınca misafir adına resmi e-Arşiv Fatura düzenlenmesi' }
    };
  }
}

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
  MASTER_TASKS_ROWS,
  buildHomeDerivedCollections
};

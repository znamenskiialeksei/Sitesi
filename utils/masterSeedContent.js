// ==============================================================================
// НЕПРИКОСНОВЕННЫЙ МАСТЕР-ЭТАЛОН БАЗЫ ДАННЫХ И КОНТЕНТА VILLA TURAMAN
// Файл: utils/masterSeedContent.js
// Назначение: Эталонный источник истины [SSOT] для всех 15 листов Google Таблиц.
// Защищен от случайного затирания. Обеспечивает 100% самоисцеление при удалении листов.
// Сгенерировано автоматически через scripts/save-master-seed.js
// Дата фиксации: 2026-09-26T10:45:58.236Z
// 100% Zero-Brackets & Zero-Emdash Стандарт.
// ==============================================================================

const { buildHomeDerivedCollections } = require('./homeDerivedCollections');

const MASTER_ABOUT_SECTIONS = [
  {
    "id": "1",
    "title": {
      "ru": "1. Концепция объекта, геолокация и расширенные географические ориентиры",
      "en": "1. Object concept, geolocation and extended geographic landmarks",
      "tr": "1. Nesne kavramı, coğrafi konum ve genişletilmiş coğrafi işaretler"
    },
    "text": {
      "ru": "Dalyan Turaman [частный бассейн, 10 спальных мест] - это цифровая веб-платформа прямого онлайн-бронирования двухэтажной виллы премиум-класса в экологическом заповедном курорте Дальян [район Ортаджа, провинция Мугла, Турция], расположенном между рекой Дальян и озером Кёйджегиз.\n\nОфициальный адрес и навигация:\n* Адрес виллы: Dalyan, Rodoslu Yaşar Sünger Sk, NO 28/2, 48600 Ortaca / Muğla, Turkey.\n* Ссылка на геолокацию в Google Maps: https://maps.app.goo.gl/tPgCjCwz4pzq28pE9\n* Точные координаты GPS: 36.8336° N, 28.6439° E.\n\nПолный реестр ключевых географических ориентиров:\n* Пешеходный центр Дальяна: всего 250 метров [3 минуты пешком] до главной пешеходной улицы с магазинами, рынками, аптеками и сувенирными лавками.\n* Речная набережная реки Дальян: 400 метров для утренних пробежек, вечерних прогулок и наблюдения за речными лодками.\n* Гастрономия: популярный ресторан высокой кухни La Boheme Dalyan - 350 метров; традиционный рыбный ресторан Çiçek Restoran - 500 метров.\n* Ликийские скальные гробницы королей Кауноса [IV век до н.э.]: панорамный вид с набережной Дальяна [450 метров], вечерняя подсветка скал и 10 минут на лодке.\n* Античный город Каунос, древний акрополь и амфитеатр: 1.5 км [переправа на весельной лодке через реку Дальян и пеший маршрут].\n* Всемирно известный песчаный пляж Изтузу [İztuzu]: 11 км [около 15 минут на машине или 30-40 минут на живописном речном катере-такси через лабиринты камышей]. Заповедная зона обитания гигантских морских черепах Caretta-Caretta.\n* Термальные радоновые источники и омолаживающие грязи Султание [Sultaniye Kaplıcaları]: 4 км по воде на озере Кёйджегиз.\n* Озеро Кёйджегиз [Köyceğiz Gölü]: 5 км до выхода из русла реки в открытую озерную акваторию.\n* Смотровая площадка Радар [Radar Tepesi]: 8 км [панорамный обзор 360° на всю дельту реки, озеро и косу пляжа Изтузу с высоты 500 метров].\n* Международный аэропорт Даламан [DLM]: 30 км [25-30 минут на машине или индивидуальном трансфере].\n* Субботний фермерский рынок Дальяна: 600 метров [свежие фермерские сыры, оливки, гранатовый сок, инжир и фрукты].\n* Морские курорты: город Мармарис - 85 км, город Фетхие и бухта Олюдениз - 60 км.",
      "en": "Dalyan Turaman [private pool, sleeps 10] is a digital web platform for direct online booking of a premium, two-story villa in the eco-reserve resort of Dalyan [Ortaca district, Muğla Province, Turkey], located between the Dalyan River and Lake Köyceğiz.\n\nOfficial address and navigation:\n* Villa address: Dalyan, Rodoslu Yaşar Sünger Sk, NO 28/2, 48600 Ortaca / Muğla, Turkey.\n* Google Maps geolocation link: https://maps.app.goo.gl/tPgCjCwz4pzq28pE9\n* Exact GPS coordinates: 36.8336° N, 28.6439° E.\n\nFull list of key geographical landmarks:\n* Dalyan Pedestrian Center: just 250 meters (3-minute walk) to the main pedestrian street with shops, markets, pharmacies, and souvenir shops.\n* Dalyan River Promenade: 400 meters for morning jogs, evening strolls, and boat watching.\n* Cuisine: popular fine dining restaurant La Boheme Dalyan - 350 meters; traditional fish restaurant Çiçek Restoran - 500 meters.\n* Lycian Rock Tombs of the Kings of Kaunos [4th century BC]: panoramic view from the Dalyan waterfront [450 meters], evening cliff illumination, and a 10-minute boat ride.\n* Ancient City of Kaunos, ancient acropolis, and amphitheater: 1.5 km [rowboat crossing the Dalyan River and hiking trail].\n* World-famous sandy beach of Iztuzu: 11 km [about 15 minutes by car or 30-40 minutes by scenic river taxi through a labyrinth of reeds]. Protected habitat of the giant Caretta-Caretta sea turtles.\n* Thermal radon springs and rejuvenating mud of Sultaniye: 4 km by boat on Lake Köyceğiz. * Köyceğiz Lake [Köyceğiz Gölü]: 5 km before leaving the riverbed for the open lake.\n* Radar Viewpoint [Radar Tepesi]: 8 km [360° panoramic view of the entire river delta, lake, and Iztuzu Beach spit from an altitude of 500 meters].\n* Dalaman International Airport [DLM]: 30 km [25-30 minutes by car or private transfer].\n* Dalyan Saturday Farmers' Market: 600 meters [fresh farm cheeses, olives, pomegranate juice, figs, and fruit].\n* Seaside resorts: Marmaris - 85 km, Fethiye and Ölüdeniz Bay - 60 km.",
      "tr": "Dalyan Turaman [özel havuz, 10 kişi kapasiteli], Dalyan Nehri ve Köyceğiz Gölü arasında yer alan Dalyan'daki [Ortaca ilçesi, Muğla ili, Türkiye] ekolojik rezerv alanında bulunan birinci sınıf, iki katlı bir villanın doğrudan çevrimiçi rezervasyonu için dijital bir web platformudur.\n\nResmi adres ve yol tarifi:\n* Villa adresi: Dalyan, Rodoslu Yaşar Sünger Sk, NO 28/2, 48600 Ortaca / Muğla, Türkiye.\n\n* Google Haritalar konum bağlantısı: https://maps.app.goo.gl/tPgCjCwz4pzq28pE9\n* Tam GPS koordinatları: 36.8336° K, 28.6439° D.\n\nÖnemli coğrafi yer işaretlerinin tam listesi:\n* Dalyan Yaya Merkezi: Mağazaların, pazarların, eczanelerin ve hediyelik eşya dükkanlarının bulunduğu ana yaya caddesine sadece 250 metre (3 dakikalık yürüme mesafesi).\n* Dalyan Nehri Gezinti Yolu: Sabah koşuları, akşam yürüyüşleri ve tekne izleme için 400 metre.\n\n* Mutfak: Popüler lüks restoran La Boheme Dalyan - 350 metre; geleneksel balık restoranı Çiçek Restoran - 500 metre.\n\n* Kaunos Krallarının Likya Kaya Mezarları [MÖ 4. yüzyıl]: Dalyan kıyısından panoramik manzara [450 metre], akşam kaya aydınlatması ve 10 dakikalık tekne yolculuğu.\n\n* Kaunos Antik Kenti, antik akropolis ve amfitiyatro: 1,5 km [Dalyan Nehri'ni kürekli tekneyle geçme ve yürüyüş parkuru].\n\n* Dünyaca ünlü İztuzu kumlu plajı: 11 km [arabayla yaklaşık 15 dakika veya sazlık labirentinden geçen manzaralı nehir taksisiyle 30-40 dakika]. Dev Caretta-Caretta deniz kaplumbağalarının koruma altındaki yaşam alanı.\n* Sultaniye'nin termal radon kaynakları ve gençleştirici çamuru: Köyceğiz Gölü'nde tekneyle 4 km. * Köyceğiz Gölü: Nehir yatağından açık göle geçmeden 5 km önce.\n\n* Radar Gözlem Noktası: 8 km [500 metre yükseklikten tüm nehir deltası, göl ve İztuzu Plajı'nın 360° panoramik manzarası].\n\n* Dalaman Uluslararası Havalimanı: 30 km [araba veya özel transferle 25-30 dakika].\n\n* Dalyan Cumartesi Çiftçi Pazarı: 600 metre [taze çiftlik peynirleri, zeytin, nar suyu, incir ve meyve].\n\n* Sahil beldeleri: Marmaris - 85 km, Fethiye ve Ölüdeniz Koyu - 60 km."
    }
  },
  {
    "id": "2",
    "title": {
      "ru": "2. Архитектура виллы и номерной фонд",
      "en": "2. Villa architecture and room stock",
      "tr": "2. Villa mimarisi ve oda düzeni"
    },
    "text": {
      "ru": "Тип недвижимости: Дом / Вилла [в распоряжении гостей жилье целиком].\nПлощадь, этажность и год постройки: 240 кв. метров, 2 этажа, год постройки - 2013.\nВместимость: до 10 гостей [включая детей], 10 полноценных спальных мест.\nКонфигурация спален и санузлов: 4 большие спальни [каждая оборудована персональной ванной комнатой и автономным кондиционером] + гостевой туалет на первом этаже:\nПервый этаж: полноценная кухня Beko, просторная гостиная со Smart TV 55\", гостевой туалет, прихожая, постирочная, Спальня 1 [квин-сайз + односпальная кровать, ванная с душем, кондиционер].\nВторой этаж: Спальня 2 [кинг-сайз, ванная с тропическим душем, кондиционер, балкон], Спальня 3 [квин-сайз, ванная, кондиционер, вид на горы], Спальня 4 [квин-сайз + односпальная кровать, ванная, кондиционер], вторая стиральная машина.\nИтоговая структура: 4 двуспальные кровати + 2 односпальные кровати + диван в гостиной = 10 спальных мест.",
      "en": "Property Type: House/Villa [guests have access to the entire property].\nArea, Number of Floors, and Year Built: 240 sq. m, 2 floors, built in 2013.\nCapacity: Up to 10 guests [including children], 10 full beds.\nBedroom and bathroom configuration: 4 large bedrooms (each with an en-suite bathroom and independent air conditioning) + guest toilet on the ground floor:\nFirst floor: Full Beko kitchen, spacious living room with 55\" Smart TV, guest toilet, hallway, laundry room, Bedroom 1 [queen + single bed, en-suite with shower, air conditioning].\nSecond floor: Bedroom 2 [king, en-suite with rain shower, air conditioning, balcony], Bedroom 3 [queen, en-suite, air conditioning, mountain views], Bedroom 4 [queen + single bed, en-suite, air conditioning], second washing machine.\nFinal layout: 4 double beds + 2 single beds + sofa in the living room = 10 beds.",
      "tr": "Mülk Tipi: Ev/Villa [konuklar tüm mülke erişebilir].\nAlan, Kat Sayısı ve İnşa Yılı: 240 m², 2 katlı, 2013 yılında inşa edilmiştir.\nKapasite: 10 kişiye kadar [çocuklar dahil], 10 adet çift kişilik yatak.\nYatak odası ve banyo düzeni: Zemin katta 4 geniş yatak odası (her biri özel banyo ve bağımsız klima ile) + misafir tuvaleti:\nBirinci kat: Tam donanımlı Beko mutfak, 55 inç Smart TV'li geniş oturma odası, misafir tuvaleti, koridor, çamaşırhane, Yatak Odası 1 [çift kişilik + tek kişilik yatak, duşlu özel banyo, klima].\nİkinci kat: Yatak Odası 2 [king yatak, yağmur duşlu özel banyo, klima, balkon], Yatak Odası 3 [çift kişilik yatak, özel banyo, klima, dağ manzarası], Yatak Odası 4 [çift kişilik + tek kişilik yatak, özel banyo, klima], ikinci çamaşır makinesi.\nSon yerleşim: Oturma odasında 4 çift kişilik yatak + 2 tek kişilik yatak + kanepe = 10 yatak."
    }
  },
  {
    "id": "3",
    "title": {
      "ru": "3. Придомовая территория, бассейн и спа-комплекс",
      "en": "3. The local area, swimming pool and spa complex",
      "tr": "3. Bölge, yüzme havuzu ve spa kompleksi"
    },
    "text": {
      "ru": "Приватный бассейн с соленой водой: чаша 4×9 метров [площадь 36 кв. м], постоянная глубина 150 см. Без запаха хлора. Доступен с 1 мая по 1 ноября. Чистка в день заселения и каждые 7 дней. Подсветка бассейна: 20:00 - 01:00.\nУличное приватное джакузи: на 4 персоны, автоматический цикл [15 минут работы каждые 45 минут в период 10:00 - 17:00]. Подсветка джакузи: 20:00 - 01:00. Сезон: 1 мая - 1 ноября.\nОсвещение территории: автоматическое [20:00 - 01:00 и 04:00 - 06:00].\nПарковка: бесплатная закрытая частная парковка на территории на 2 авто.\nОткрытые зоны отдыха: огороженный сад, барбекю [BBQ], крыльцо с кофейными столиками, обеденный стол на 8 мест, шезлонги и летний душ.",
      "en": "Private saltwater pool: 4x9 meter pool (36 sq. m), constant depth of 150 cm. No chlorine odor. Available from May 1st to November 1st. Cleaning on arrival day and every 7 days. Pool lighting: 8:00 PM - 1:00 AM.\nOutdoor private jacuzzi: for 4 people, automatic cycle [15-minute run every 45 minutes from 10:00 AM - 5:00 PM]. Jacuzzi lighting: 8:00 PM - 1:00 AM. Season: May 1st - November 1st.\nGrounds lighting: automatic [8:00 PM - 1:00 AM and 4:00 AM - 6:00 AM].\nParking: Free private enclosed parking on site for 2 cars. Outdoor recreation areas include a fenced garden, BBQ, porch with coffee tables, 8-seat dining table, sun loungers and an outdoor shower.",
      "tr": "Özel tuzlu su havuzu: 4x9 metre havuz (36 m²), 150 cm sabit derinlik. Klor kokusu yok. 1 Mayıs - 1 Kasım tarihleri ​​arasında kullanılabilir. Giriş gününde ve her 7 günde bir temizlik yapılır. Havuz aydınlatması: 20:00 - 01:00.\nÖzel açık hava jakuzisi: 4 kişilik, otomatik döngü [10:00 - 17:00 arası her 45 dakikada bir 15 dakikalık çalışma]. Jakuzi aydınlatması: 20:00 - 01:00. Sezon: 1 Mayıs - 1 Kasım.\nBahçe aydınlatması: otomatik [20:00 - 01:00 ve 04:00 - 06:00].\nOtopark: Tesis bünyesinde 2 araçlık ücretsiz özel kapalı otopark. Açık hava dinlenme alanları arasında çitli bahçe, barbekü, sehpalı veranda, 8 kişilik yemek masası, şezlonglar ve açık duş bulunmaktadır."
    }
  },
  {
    "id": "4",
    "title": {
      "ru": "4. Юридический регламент, безопасность и доступная среда",
      "en": "4. Legal regulations, safety and accessible environment",
      "tr": "4. Yasal düzenlemeler, güvenlik ve erişilebilir ortam"
    },
    "text": {
      "ru": "Закон Турции № 7464 о краткосрочной аренде: обязательный договор аренды виллы с описью имущества при заселении.\nРегистрация в системе учета населения KBS: обязательное предоставление паспортов всех проживающих. Размещение незарегистрированных лиц строго запрещено.\nБезопасность дома: внешнее видеонаблюдение по периметру, детекторы дыма во всех спальнях и гостиной, огнетушитель, аптечка первой помощи.\nДоступная среда: выделенная парковка для инвалидов, ровный освещенный вход без ступеней, дверь от 81 см, подъемник для бассейна и джакузи.\nПолитика отмены: менее 28 ночей - Негибкие, от 28 ночей - Строгие. Опция невозвратного тарифа со скидкой 10% за 60 дней.",
      "en": "Turkish Short-Term Rental Law No. 7464: A mandatory villa rental agreement with an inventory of the property is required upon arrival.\nKBS Population Registration System: Passports of all residents are required. Unregistered occupants are strictly prohibited.\nHome Security: External perimeter video surveillance, smoke detectors in all bedrooms and the living room, fire extinguisher, and first aid kit.\nAccessibility: Dedicated disabled parking, level, illuminated, step-free entrance, door height of at least 81 cm, pool and jacuzzi lift.\nCancellation Policy: Less than 28 nights - Inflexible, 28 nights or more - Strict. Non-refundable rate option with a 10% discount for 60 days.",
      "tr": "Türk Kısa Süreli Kiralama Kanunu No. 7464: Varışta, mülkün envanterini içeren zorunlu bir villa kiralama sözleşmesi gereklidir.\nKBS Nüfus Kayıt Sistemi: Tüm sakinlerin pasaportları gereklidir. Kayıt dışı sakinlerin konaklaması kesinlikle yasaktır.\nEv Güvenliği: Dış çevre video gözetimi, tüm yatak odalarında ve oturma odasında duman dedektörleri, yangın söndürücü ve ilk yardım çantası.\nErişilebilirlik: Engelliler için özel park yeri, düz, aydınlatmalı, basamaksız giriş, en az 81 cm kapı yüksekliği, havuz ve jakuzi asansörü.\nİptal Politikası: 28 geceden az - Esnek değil, 28 gece veya daha fazla - Kesinlikle. 60 gün için %10 indirimli, iade edilmeyen fiyat seçeneği."
    }
  },
  {
    "id": "5",
    "title": {
      "ru": "5. Профиль суперхозяина и мастер-доступ",
      "en": "5. Superhost profile and master access",
      "tr": "5. Süper sunucu profili ve ana erişim"
    },
    "text": {
      "ru": "Владелец: Алексей Знаменский [Aleksei Znamenskii]. Проживает в Мармарисе, яхтсмен на пенсии. Жизненное кредо: «Хочешь сделать хорошо - сделай сам». Мечта: отправиться в Португалию и увидеть океан. Хобби: велоспорт, парусный спорт, природа. Штампы путешествий: Дубай [3 поездки], Абу-Даби [март 2026 г.]. Языки: русский, английский, турецкий. Налоговые реквизиты: Ortaca Vergi Dairesi, VKN: 9991120181.\nМастер-доступ суперхозяина: villaturaman@gmail.com, логин admin / пароль admin123, роль: Владелец [Финансы, Периоды, Блокировки, Окно брони, Чаты].",
      "en": "Owner: Aleksei Znamenskii. Lives in Marmaris, retired yachtsman. Life motto: \"If you want something done right, do it yourself.\" Dream: to go to Portugal and see the ocean. Hobbies: cycling, sailing, nature. Travel stamps: Dubai [3 trips], Abu Dhabi [March 2026]. Languages: Russian, English, Turkish. Tax details: Ortaca Vergi Dairesi, VKN: 9991120181.\nSuperhost master access: villaturaman@gmail.com, login admin / password admin123, role: Owner [Finances, Periods, Blocks, Booking Window, Chats].",
      "tr": "Sahibi: Aleksei Znamenskii. Marmaris'te yaşıyor, emekli yatçı. Hayat felsefesi: \"Bir şeyin doğru yapılmasını istiyorsanız, kendiniz yapın.\" Hayali: Portekiz'e gidip okyanusu görmek. Hobileri: bisiklet, yelken, doğa. Seyahat damgaları: Dubai [3 gezi], Abu Dhabi [Mart 2026]. Diller: Rusça, İngilizce, Türkçe. Vergi bilgileri: Ortaca Vergi Dairesi, VKN: 9991120181.\nSüper ev sahibi ana erişimi: villaturaman@gmail.com, kullanıcı adı admin / şifre admin123, rol: Sahip [Finans, Dönemler, Bloklar, Rezervasyon Penceresi, Sohbetler]."
    }
  },
  {
    "id": "6",
    "title": {
      "ru": "6. Возможна прогулка на морской яхте",
      "en": "6. A trip on a sea yacht is possible",
      "tr": "6. Deniz yatıyla seyahat mümkündür."
    },
    "text": {
      "ru": "Яхта произведена в Германии в 2022 году. \nМодель BAVARIA C45. На площади более 60 м² организовано уютное пространство для путешествий.\nТри каюты, в каждой из них кровать 140 см на 200 см. Такое же спальное место [140 см на 200 см] можно организовать в салоне [стол трансформер]. В кокпите так же столы трансформируются в лежаки, где два взрослых человека комфортно разместятся на ночевку и вахту. Итого 10 спальных мест.\nХолодная и горячая вода присутствует. \nДва туалета с электрической системой слива оборудованы баком-накопителем по 70 литров каждый. Две душевые кабинки и один открытый душ на откидной платформе для купания. \nДва холодильника и отдельная морозильная камера, газовая плита, духовой шкаф, посудомоечная машина, посуда, кухонная техника с кофемашиной - к услугам тех, кто хочет отличиться на кухне и удивить команду. Так же возможно приготовление блюд нашей командой. \nДля дальних переходов на яхте имеется генератор и солнечные панели. \nДве зоны отдыха под навесами, а так же открытые зоны для загара на палубе яхты. \nДля купания откидная платформа имеет удобную систему спуска в воду. \nТехнические данные:\nОбщая длина 14,06 м. Ширина корпуса 4,49 м. Осадка [Киль] 2,60 м. Вес балласта [киль] 2,984 кг. Топливный бак 250 литров. Резервуар для воды 650 литров. Паруса: Грот [закрутка] 51,0 м². Кливер 45,0 м². Генуя 52,0 м². Длина мачты [макс.] от ватерлинии 22,00 м. Район плавания Категория CE А10/Б14/С16 [неограниченно]. Дизайн яхты Cossutti. Безопасность на яхте обеспечена необходимым комплектом: 12 спасательных жилетов, спасательный плот на 10 человек, динги с мотором на 6 человек и другое спасательное оборудование по регламенту. \nТак же на борту имеются: надувные каяк, саб, ватрушка и маски для подводного плавания, применяемые для водных развлечений.",
      "en": "The yacht was built in Germany in 2022.\nModel BAVARIA C45. Over 60 m² of space offers a cozy space for exploring.\nThree cabins, each with a 140 cm x 200 cm bed. A similar berth (140 cm x 200 cm) can be arranged in the salon (transformable table). The cockpit tables also transform into sun loungers, comfortably accommodating two adults for overnight stays and watchkeeping. A total of 10 berths are provided.\nHot and cold running water is available.\nTwo toilets with electric flush systems are equipped with a 70-liter holding tank each. Two shower stalls and one outdoor shower on a fold-down bathing platform.\nTwo refrigerators and a separate freezer, a gas stove, oven, dishwasher, dishes, and kitchen appliances with a coffee machine are available for those who want to excel in the kitchen and impress the crew. Meals can also be prepared by the crew.\n\nFor long-distance cruising, the yacht is equipped with a generator and solar panels.\n\nTwo recreation areas under awnings, as well as open sunbathing areas on the yacht's deck, are available.\n\nFor swimming, a folding platform has a convenient launch system.\n\nTechnical data:\nOverall length: 14.06 m. Hull width: 4.49 m. Draft: 2.60 m. Ballast weight: 2.984 kg. Fuel tank: 250 liters. Water tank: 650 liters. Sails: Mainsail (furling): 51.0 m². Jib: 45.0 m². Genoa 52.0 m². Mast length [max.] from waterline 22.00 m. Sailing area Category CE A10/B14/C16 [unlimited]. Yacht design by Cossutti. Safety on board is ensured by the necessary equipment: 12 life jackets, a 10-person life raft, a 6-person motorized dinghy, and other required safety equipment. \nAlso on board are an inflatable kayak, a SUP, a tube, and snorkeling masks for water activities.",
      "tr": "Yat, 2022 yılında Almanya'da inşa edilmiştir.\nBAVARIA C45 modeli. 60 m²'den fazla alan, keşif için rahat bir ortam sunmaktadır.\nHer biri 140 cm x 200 cm yatak bulunan üç kabin. Salonda (dönüştürülebilir masa) benzer bir yatak (140 cm x 200 cm) düzenlenebilir. Kokpit masaları ayrıca güneşlenme şezlonglarına dönüşerek, gece konaklamaları ve nöbet tutma için iki yetişkini rahatça ağırlayabilir. Toplam 10 yatak mevcuttur.\nSıcak ve soğuk akan su mevcuttur.\nHer biri 70 litrelik atık su tankına sahip elektrikli sifon sistemli iki tuvalet. İki duş kabini ve katlanır yüzme platformu üzerinde bir açık duş.\nMutfakta ustalaşmak ve mürettebatı etkilemek isteyenler için iki buzdolabı ve ayrı bir dondurucu, gazlı ocak, fırın, bulaşık makinesi, tabaklar ve kahve makinesi içeren mutfak aletleri mevcuttur. Yemekler mürettebat tarafından da hazırlanabilir.\n\nUzun mesafeli seyirler için yat, jeneratör ve güneş panelleriyle donatılmıştır.\n\nİki adet tente altında dinlenme alanı ve yatın güvertesinde açık güneşlenme alanları mevcuttur.\n\nYüzme için, kullanışlı bir fırlatma sistemine sahip katlanır bir platform bulunmaktadır.\n\nTeknik veriler:\nToplam uzunluk: 14,06 m. Gövde genişliği: 4,49 m. Su çekimi: 2,60 m. Balast ağırlığı: 2,984 kg. Yakıt deposu: 250 litre. Su deposu: 650 litre. Yelkenler: Ana yelken (sarmalı): 51,0 m². Flok: 45,0 m². Cenova: 52,0 m². Direk uzunluğu [maks.] su hattından 22,00 m. Yelken alanı Kategorisi CE A10/B14/C16 [sınırsız]. Yat tasarımı: Cossutti. Gemideki güvenlik, gerekli ekipmanlarla sağlanmaktadır: 12 can yeleği, 10 kişilik can salı, 6 kişilik motorlu bot ve diğer gerekli güvenlik ekipmanları.\n\nAyrıca gemide şişme kayak, SUP, tüp ve su aktiviteleri için şnorkel maskeleri de bulunmaktadır."
    }
  },
  {
    "id": "7",
    "title": {
      "ru": "7. Возможно путешествие на кемпере",
      "en": "7. Traveling by camper is possible",
      "tr": "7. Karavanla seyahat mümkündür."
    },
    "text": {
      "ru": "Тур «Всё» - это возможность за 1 неделю неспешно отдохнуть меняя ритм, стиль и вид отдыха. Это очень круто. За это время вы однозначно почувствуете разнообразие и красоту Турции и в том числе замечательного места города Дальян [провинция Мугла]. Предъявляя разные требования и пожелания к своему досугу, вы в конечном итоге, будете удовлетворены и поймете, что это было замечательно и великолепно. И скажите мне: Спасибо. Это было настоящее приключение. \nНазвание: Тур «Всё». Вилла, яхта, кемпер, SUP, каяк, велосипеды...\nПлан тура:\nVilla Turaman [2 дня 2 ночи] - Яхта Vasilisa [2 дня 1 ночь] - Кемпер [1 день 2 ночи] - Villa Turaman [2 дня 1 ночь]\n\n1 и 2 день - Villa Turaman [2 дня 2 ночи]: \n1 день. Трансфер из аэропорта. Заселение на виллу после 16.00. Вечерний променад по набережной и пешеходной улице города Дальян. Ужин в ресторане.\n2 день. Отдых на вилле, бассейн. Можно выехать в древний город или взять напрокат лодку с экскурсией по реке. Половить крабов и в конечном итоге по реке добраться до пляжа. День свободный, сможете принять сами решение как его провести. Мы со своей стороны обеспечим вас транспортом и сопровождением по всем местам, что мы знаем всё вам покажем. Этот день мы можем с вами спланировать при формировании брони и сделать его максимально интересным для вас.\n3 и 4 день - Яхта Vasilisa [2 дня 1 ночь]:\n3 день. 6:00 подъем. Сборы. Завтрак. Выезд на яхту Vasilisa в Marmaris. 9.30 заходим на яхту. Готовимся отходить. Маршрут: Marmaris Yacht Marina - Ekincik.\n4 и 5 день - Кемпер Adria Adora 673 PK [1 день 2 ночи]:\n4 день. 16:00 Сборы. На моторной лодке отчаливаем с яхты Vasilisa и двигаемся 5 - 10 минут к берегу бухты Ekincik. Там на береговой линии бухты нас ждет оборудованная площадка для отдыха на караване.\nНеобычный и абсолютно новый семейный караван Adria Adora 673 PK на берегу Средиземного моря в прекрасном тихом месте Ekincik находится в 60 минутах езды от виллы Turaman, выполненный в стиле минимализма, вмещает 3 спальные зоны:\n- в передней части: двуспальная кровать с панорамным видом;\n- в середине: раздельный санузел, обеденная зона со столом, которая разбирается в большую кровать, а напротив кухня;\n- в задней части: комната с диваном и вторым спальным ярусом, отлично подойдет в качестве детской комнаты;\nВ Кемпере Adria Adora 673 PK есть все для полного комфорта: два входа, отопление и бойлер, пол с подогревом, кондиционер, штатное место для аккумулятора, увеличенный холодильник, автоматический слив воды, аудиосистема, установлен бак для воды, вытяжка в кухне, а в комплекте идут: ковры, бак для серой воды, противооткатные упоры. Тип санузла: Раздельный.\nТак же вам будут предоставлены: гриль и принадлежности, маски для плавания, уличная пляжная мебель и посуда.\n6 и 7 день - Villa Turaman [2 дня 2 ночи]:\n6 день. Возвращаемся на виллу. Вечерний променад по набережной и пешеходной улице города Дальян. Ужин в ресторане.\n7 день. Выезд с виллы до 9.00: Завтрак. Трансфер до аэропорта.\nВсе это можно продлить по вашему желанию.\nЕсли у вас есть вопросы, свяжитесь с суперхозяином Алексеем в чате.",
      "en": "The \"Everything\" tour is an opportunity to unwind in one week, changing your pace, style, and type of vacation. It's absolutely fantastic. During this time, you'll definitely experience the diversity and beauty of Turkey, including the wonderful city of Dalyan (Mugla Province). Although you may have different expectations and desires for your leisure time, you'll ultimately be satisfied and realize that it was wonderful and magnificent. And tell me: Thank you. It was a real adventure.\n\nTitle: \"Everything\" Tour. Villa, yacht, camper, SUP, kayak, bicycles...\nTour Plan:\nVilla Turaman [2 days 2 nights] - Yacht Vasilisa [2 days 1 night] - Camper [1 day 2 nights] - Villa Turaman [2 days 1 night]\n\nDays 1 and 2 - Villa Turaman [2 days 2 nights]:\nDay 1. Airport transfer. Check-in at the villa after 4:00 PM. An evening stroll along the Dalyan promenade and pedestrian street. Dinner at a restaurant.\nDay 2. Relax at the villa, pool. You can visit the ancient city or rent a boat for a river excursion. Catch crabs and eventually reach the beach by boat. The day is free, and you can decide how to spend it. We will provide transportation and escort you to all the places we know and will show you. We can plan this day together when making your reservation and make it as interesting as possible for you.\nDays 3 and 4 - Yacht Vasilisa [2 days, 1 night]:\nDay 3. Wake up at 6:00 AM. Pack up. Breakfast. Departure for the yacht Vasilisa in Marmaris. Board the yacht at 9:30 AM. Prepare to depart. Route: Marmaris Yacht Marina - Ekincik.\nDays 4 and 5 - Adria Adora 673 PK Camper [1 day 2 nights]:\nDay 4. 4:00 PM. We depart the Vasilisa yacht by motorboat and travel 5-10 minutes to the shore of Ekincik Bay. There, on the bay's shoreline, a well-equipped campervan area awaits.\nThis unique and brand-new family caravan, the Adria Adora 673 PK, is located on the Mediterranean coast in the beautiful, quiet location of Ekincik, a 60-minute drive from Villa Turaman. Designed in a minimalist style, it features three sleeping areas:\n- Forward: a double bed with panoramic views;\n- Middle: separate bathroom, dining area with table that converts into a large bed, and opposite is the kitchen;\n- Rear: a room with a sofa and a second bunk, perfect for a children's room;\nThe Adria Adora 673 PK camper has everything you need for complete comfort: two entrances, heating and a boiler, underfloor heating, air conditioning, a dedicated battery compartment, an oversized refrigerator, automatic drain, an audio system, a water tank, a kitchen hood, and carpets, a grey water tank, and wheel chocks are included. Bathroom type: Separate.\nYou will also be provided with a grill and accessories, snorkels, outdoor beach furniture, and dishes.\nDays 6 and 7 - Villa Turaman [2 days 2 nights]:\nDay 6. Return to the villa. Evening promenade along the promenade and pedestrian street of Dalyan. Dinner at the restaurant.\nDay 7. Check-out before 9:00 AM: Breakfast. Airport transfer.\nAll of this can be extended at your request.\nIf you have any questions, please contact superhost Alexey via chat.",
      "tr": "\"Her Şey\" turu, bir hafta boyunca rahatlamak, tempoyu, tarzı ve tatil türünü değiştirmek için bir fırsattır. Kesinlikle harika. Bu süre zarfında, Dalyan'ın (Muğla ili) muhteşem şehri de dahil olmak üzere Türkiye'nin çeşitliliğini ve güzelliğini kesinlikle deneyimleyeceksiniz. Boş zamanınız için farklı beklentileriniz ve istekleriniz olsa da, sonunda memnun kalacak ve harika ve muhteşem olduğunu anlayacaksınız. Ve bana söyleyin: Teşekkür ederim. Gerçek bir maceraydı.\n\nBaşlık: \"Her Şey\" Turu. Villa, yat, karavan, SUP, kayak, bisikletler...\nTur Planı:\nVilla Turaman [2 gün 2 gece] - Yat Vasilisa [2 gün 1 gece] - Karavan [1 gün 2 gece] - Villa Turaman [2 gün 1 gece]\n\n1. ve 2. Günler - Villa Turaman [2 gün 2 gece]:\n1. Gün. Havaalanı transferi. Saat 16:00'dan sonra villaya giriş. Dalyan sahil şeridi ve yaya caddesinde akşam yürüyüşü. Restoranda akşam yemeği.\n2. Gün. Villada, havuzda dinlenin. Antik kenti ziyaret edebilir veya nehir gezisi için tekne kiralayabilirsiniz. Yengeç yakalayabilir ve sonunda tekneyle sahile ulaşabilirsiniz. Gün serbesttir ve nasıl geçireceğinize siz karar verebilirsiniz. Bildiğimiz ve size göstereceğimiz tüm yerlere ulaşımınızı sağlayacağız ve size eşlik edeceğiz. Rezervasyonunuzu yaparken bu günü birlikte planlayabilir ve sizin için mümkün olduğunca ilgi çekici hale getirebiliriz.\n3. ve 4. Günler - Vasilisa Yat [2 gün, 1 gece]:\n3. Gün. Sabah 6:00'da uyanın. Eşyalarınızı toplayın. Kahvaltı. Marmaris'teki Vasilisa yatına hareket. Saat 9:30'da yata binin. Harekete hazırlanın. Güzergah: Marmaris Yat Limanı - Ekincik.\n4. ve 5. Günler - Adria Adora 673 PK Karavan [1 gün 2 gece]:\n4. Gün. 16:00. Vasilisa yatından motorlu tekneyle ayrılıp Ekincik Koyu kıyısına 5-10 dakika yolculuk yapıyoruz. Orada, koyun kıyısında, iyi donanımlı bir karavan alanı bizi bekliyor.\nBu eşsiz ve yepyeni aile karavanı, Adria Adora 673 PK, Akdeniz kıyısında, güzel ve sakin Ekincik bölgesinde, Villa Turaman'a 60 dakikalık sürüş mesafesinde yer almaktadır. Minimalist bir tarzda tasarlanan karavan, üç uyku alanına sahiptir:\n- Ön: Panoramik manzaralı çift kişilik yatak;\n\n- Orta: Ayrı banyo, büyük bir yatağa dönüşen masa bulunan yemek alanı ve karşısında mutfak;\n\n- Arka: Çocuk odası için mükemmel olan, kanepe ve ikinci bir ranza bulunan bir oda;\n\nAdria Adora 673 PK karavanı, tam konfor için ihtiyacınız olan her şeye sahiptir: iki giriş, ısıtma ve kazan, yerden ısıtma, klima, özel akü bölmesi, büyük boy buzdolabı, otomatik tahliye, ses sistemi, su deposu, mutfak davlumbazı ve halılar, gri su deposu ve tekerlek takozları dahildir. Banyo tipi: Ayrı.\n\nAyrıca size mangal ve aksesuarları, şnorkeller, dış mekan plaj mobilyaları ve tabaklar da sağlanacaktır.\n6. ve 7. Günler - Villa Turaman [2 gün 2 gece]:\n6. Gün. Villaya dönüş. Dalyan'ın sahil şeridi ve yaya caddesinde akşam gezintisi. Restoranda akşam yemeği.\n\n7. Gün. Sabah 9:00'dan önce çıkış: Kahvaltı. Havaalanı transferi.\nTüm bunlar isteğiniz üzerine uzatılabilir.\nHerhangi bir sorunuz varsa, lütfen süper ev sahibi Alexey ile sohbet yoluyla iletişime geçin."
    }
  }
];

const MASTER_HOME_MAP = {
  "hero_title": {
    "block": "1. Главный экран",
    "key": "hero_title",
    "desc": "Главный заголовок листинга в шапке",
    "ru": "Dalyan Turaman [частный бассейн, 10 спальных мест]",
    "en": "Dalyan Turaman [private pool, sleeps 10]",
    "tr": "Dalyan Turaman [özel havuz, 10 kişilik]",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "hero_subtitle": {
    "block": "1. Главный экран",
    "key": "hero_subtitle",
    "desc": "Подзаголовок виллы под главным заголовком",
    "ru": "Премиальная вилла 240 м² в Дальяне. Приватный бассейн с соленой водой 36 м², уличное джакузи, 4 спальни, 10 спальных мест, 250 м до центра.",
    "en": "A premium 240 m² villa in Dalyan. A private 36 m² saltwater pool, an outdoor jacuzzi, 4 bedrooms, sleeps 10, and is 250 m from the center.",
    "tr": "Dalyan'da 240 m²'lik birinci sınıf bir villa. 36 m²'lik özel tuzlu su havuzu, açık hava jakuzisi, 4 yatak odası, 10 kişiye kadar konaklama kapasitesi ve merkeze 250 metre mesafede yer almaktadır.",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "hero_rating": {
    "block": "1. Главный экран",
    "key": "hero_rating",
    "desc": "Числовой рейтинг виллы",
    "ru": "4.98",
    "en": "4.98",
    "tr": "4.98",
    "media": "Star",
    "status": "Вкл",
    "enabled": true
  },
  "hero_reviews_count": {
    "block": "1. Главный экран",
    "key": "hero_reviews_count",
    "desc": "Количество отзывов рядом с рейтингом",
    "ru": "48 отзывов",
    "en": "48 reviews",
    "tr": "48 değerlendirme",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "hero_superhost_badge": {
    "block": "1. Главный экран",
    "key": "hero_superhost_badge",
    "desc": "Бейдж статуса суперхозяина",
    "ru": "Суперхозяин",
    "en": "Superhost",
    "tr": "Süper ev sahibi",
    "media": "Award",
    "status": "Вкл",
    "enabled": true
  },
  "hero_location": {
    "block": "1. Главный экран",
    "key": "hero_location",
    "desc": "Текст кликабельной локации объекта",
    "ru": "Dalyan, Rodoslu Yaşar Sünger Sk, NO 28/2, Ortaca / Muğla",
    "en": "Dalyan, Rodoslu Yaşar Sünger Sk, NO 28/2, Ortaca / Muğla",
    "tr": "Dalyan, Rodoslu Yaşar Sünger Sk, NO 28/2, Ortaca / Muğla",
    "media": "MapPin",
    "status": "Вкл",
    "enabled": true
  },
  "hero_share_btn": {
    "block": "1. Главный экран",
    "key": "hero_share_btn",
    "desc": "Текст кнопки Поделиться",
    "ru": "Поделиться",
    "en": "Share",
    "tr": "Paylaşmak",
    "media": "Share2",
    "status": "Вкл",
    "enabled": true
  },
  "hero_favorite_btn": {
    "block": "1. Главный экран",
    "key": "hero_favorite_btn",
    "desc": "Текст кнопки В избранное",
    "ru": "В избранное",
    "en": "Add to favorites",
    "tr": "Favorilere ekle",
    "media": "Heart",
    "status": "Вкл",
    "enabled": true
  },
  "hero_image": {
    "block": "1. Главный экран",
    "key": "hero_image",
    "desc": "Главное фоновое фото объекта",
    "ru": "Главные фотографии фасада и бассейна",
    "en": "Main photos of the facade and the pool",
    "tr": "Cephe ve havuzun ana fotoğrafları",
    "media": "https://drive.google.com/file/d/1NjSHRDa5eJpQTzO9268e8LMRzDVmYtX7/view?usp=sharing,https://drive.google.com/file/d/1IZMH6wtfLHZ6ibKHfmBhPGMFntZ_fXKU/view?usp=drive_link",
    "status": "Вкл",
    "enabled": true
  },
  "host_specs_header": {
    "block": "2. Характеристики",
    "key": "host_specs_header",
    "desc": "Заголовок типа жилья и владельца",
    "ru": "Отдельная вилла целиком • Хозяин: Aleksei Znamenskii [Суперхозяин]",
    "en": "Entire detached villa • Host: Aleksei Znamenskii [Superhost]",
    "tr": "Müstakil villanın tamamı • Ev sahibi: Aleksei Znamenskii [Süper Ev Sahibi]",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "host_specs_name": {
    "block": "2. Характеристики",
    "key": "host_specs_name",
    "desc": "Отображаемое имя владельца виллы",
    "ru": "Aleksei Znamenskii",
    "en": "Alexey Znamensky",
    "tr": "Alexey Znamensky",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "host_specs_avatar": {
    "block": "2. Характеристики",
    "key": "host_specs_avatar",
    "desc": "Аватар владельца виллы в карточке характеристик",
    "ru": "Аватар владельца виллы",
    "en": "Avatar of the villa owner",
    "tr": "Villa sahibinin avatarı",
    "media": "https://drive.google.com/file/d/1NjSHRDa5eJpQTzO9268e8LMRzDVmYtX7/view?usp=sharing,https://drive.google.com/file/d/1IZMH6wtfLHZ6ibKHfmBhPGMFntZ_fXKU/view?usp=drive_link",
    "status": "Вкл",
    "enabled": true
  },
  "spec_guests": {
    "block": "2. Характеристики",
    "key": "spec_guests",
    "desc": "Счетчик гостей в строке параметров",
    "ru": "10 гостей",
    "en": "10 guests",
    "tr": "10 misafir",
    "media": "Users",
    "status": "Вкл",
    "enabled": true
  },
  "spec_bedrooms": {
    "block": "2. Характеристики",
    "key": "spec_bedrooms",
    "desc": "Счетчик спален в строке параметров",
    "ru": "4 спальни",
    "en": "4 bedrooms",
    "tr": "4 yatak odası",
    "media": "Bed",
    "status": "Вкл",
    "enabled": true
  },
  "spec_beds": {
    "block": "2. Характеристики",
    "key": "spec_beds",
    "desc": "Счетчик спальных мест [кроватей]",
    "ru": "6 кроватей 10 спальных мест",
    "en": "6 beds 10 sleeping places",
    "tr": "6 yatak, 10 uyku yeri",
    "media": "Bed",
    "status": "Вкл",
    "enabled": true
  },
  "spec_baths": {
    "block": "2. Характеристики",
    "key": "spec_baths",
    "desc": "Счетчик ванных комнат",
    "ru": "4 ванные комнаты + гостевой туалет",
    "en": "4 bathrooms + guest toilet",
    "tr": "4 banyo + misafir tuvaleti",
    "media": "Bath",
    "status": "Вкл",
    "enabled": true
  },
  "highlight_1_title": {
    "block": "3. Преимущества",
    "key": "highlight_1_title",
    "desc": "Заголовок первого преимущества",
    "ru": "Опытный Суперхозяин [Superhost]",
    "en": "Experienced Superhost",
    "tr": "Deneyimli Süper Ev Sahibi",
    "media": "Sparkles",
    "status": "Вкл",
    "enabled": true
  },
  "highlight_1_desc": {
    "block": "3. Преимущества",
    "key": "highlight_1_desc",
    "desc": "Описание первого преимущества",
    "ru": "Алексей живет в Мармарисе, яхтсмен на пенсии, рейтинг 4.98★. Девиз: «Хочешь сделать хорошо - сделай сам».",
    "en": "Alexey lives in Marmaris, is a retired yachtsman, and has a rating of 4.98★. His motto is: \"If you want something done right, do it yourself.\"",
    "tr": "Alexey Marmaris'te yaşıyor, emekli bir yatçı ve 4,98★ yıldızlık bir değerlendirmeye sahip. Mottosu ise: \"Bir işin doğru yapılmasını istiyorsanız, kendiniz yapın.\"",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "highlight_2_title": {
    "block": "3. Преимущества",
    "key": "highlight_2_title",
    "desc": "Заголовок второго преимущества",
    "ru": "Приватный спа-комплекс у бассейна",
    "en": "Private spa complex by the pool",
    "tr": "Havuz kenarında özel spa kompleksi",
    "media": "Waves",
    "status": "Вкл",
    "enabled": true
  },
  "highlight_2_desc": {
    "block": "3. Преимущества",
    "key": "highlight_2_desc",
    "desc": "Описание второго преимущества",
    "ru": "Бассейн с соленой водой 36 м² [май-ноябрь, подсветка 20:00-01:00] и уличное джакузи на 4 персоны [10:00-17:00].",
    "en": "Salt water pool 36 m² [May-November, illuminated 20:00-01:00] and outdoor jacuzzi for 4 people [10:00-17:00].",
    "tr": "36 m²'lik tuzlu su havuzu [Mayıs-Kasım, aydınlatmalı 20:00-01:00] ve 4 kişilik açık hava jakuzisi [10:00-17:00].",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "highlight_3_title": {
    "block": "3. Преимущества",
    "key": "highlight_3_title",
    "desc": "Заголовок третьего преимущества",
    "ru": "Правила отмены и Закон № 7464",
    "en": "Cancellation Rules and Law No. 7464",
    "tr": "İptal Kuralları ve 7464 Sayılı Kanun",
    "media": "ShieldCheck",
    "status": "Вкл",
    "enabled": true
  },
  "highlight_3_desc": {
    "block": "3. Преимущества",
    "key": "highlight_3_desc",
    "desc": "Описание третьего преимущества",
    "ru": "Краткосрочные брони - Негибкие, от 28 ночей - Строгие. Опция невозвратного тарифа со скидкой 10%. Регистрация KBS.",
    "en": "Short-term bookings are non-flexible, and stays of 28 nights or more are strict. Non-refundable rate option with a 10% discount. KBS registration.",
    "tr": "Kısa süreli rezervasyonlar esnek değildir ve 28 gece veya daha uzun süreli konaklamalar kesin şartlara tabidir. %10 indirimli, iade edilmeyen fiyat seçeneği mevcuttur. KBS kaydı gereklidir.",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "about_title": {
    "block": "4. О вилле",
    "key": "about_title",
    "desc": "Заголовок раздела описания",
    "ru": "О Вилле",
    "en": "About Villa",
    "tr": "Villa Hakkında",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "about_text": {
    "block": "4. О вилле",
    "key": "about_text",
    "desc": "Краткое описание виллы на главной странице",
    "ru": "Villa Turaman: это гармоничное сочетание уединения, современного комфорта и первоклассного сервиса для незабываемого отпуска в сердце Дальяна.",
    "en": "Villa Turaman: a harmonious combination of privacy, modern comfort and first-class service for an unforgettable holiday in the heart of Dalyan.",
    "tr": "Villa Turaman: Dalyan'ın kalbinde unutulmaz bir tatil için mahremiyetin, modern konforun ve birinci sınıf hizmetin uyumlu birleşimi.",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "about_btn_more": {
    "block": "4. О вилле",
    "key": "about_btn_more",
    "desc": "Текст ссылки открытия полного описания",
    "ru": "Показать больше об объекте",
    "en": "Show more about the property",
    "tr": "Mülk hakkında daha fazla bilgi göster",
    "media": "ChevronRight",
    "status": "Вкл",
    "enabled": true
  },
  "about_modal_title": {
    "block": "4. О вилле",
    "key": "about_modal_title",
    "desc": "Заголовок всплывающего окна подробностей",
    "ru": "Об этой вилле",
    "en": "About this villa",
    "tr": "Bu villa hakkında",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "about_sec_1_title": {
    "block": "4. О вилле",
    "key": "about_sec_1_title",
    "desc": "Модальное окно: Раздел 1 Заголовок",
    "ru": "1. Концепция объекта, геолокация и расширенные географические ориентиры",
    "en": "1. Object concept, geolocation and extended geographic landmarks",
    "tr": "1. Nesne kavramı, coğrafi konum ve genişletilmiş coğrafi işaretler",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "about_sec_1_text": {
    "block": "4. О вилле",
    "key": "about_sec_1_text",
    "desc": "Модальное окно: Раздел 1 Текст",
    "ru": "Dalyan Turaman [частный бассейн, 10 спальных мест] - это цифровая веб-платформа прямого онлайн-бронирования двухэтажной виллы премиум-класса в экологическом заповедном курорте Дальян [район Ортаджа, провинция Мугла, Турция], расположенном между рекой Дальян и озером Кёйджегиз.\n\nОфициальный адрес и навигация:\n* Адрес виллы: Dalyan, Rodoslu Yaşar Sünger Sk, NO 28/2, 48600 Ortaca / Muğla, Turkey.\n* Ссылка на геолокацию в Google Maps: https://maps.app.goo.gl/tPgCjCwz4pzq28pE9\n* Точные координаты GPS: 36.8336° N, 28.6439° E.\n\nПолный реестр ключевых географических ориентиров:\n* Пешеходный центр Дальяна: всего 250 метров [3 минуты пешком] до главной пешеходной улицы с магазинами, рынками, аптеками и сувенирными лавками.\n* Речная набережная реки Дальян: 400 метров для утренних пробежек, вечерних прогулок и наблюдения за речными лодками.\n* Гастрономия: популярный ресторан высокой кухни La Boheme Dalyan - 350 метров; традиционный рыбный ресторан Çiçek Restoran - 500 метров.\n* Ликийские скальные гробницы королей Кауноса [IV век до н.э.]: панорамный вид с набережной Дальяна [450 метров], вечерняя подсветка скал и 10 минут на лодке.\n* Античный город Каунос, древний акрополь и амфитеатр: 1.5 км [переправа на весельной лодке через реку Дальян и пеший маршрут].\n* Всемирно известный песчаный пляж Изтузу [İztuzu]: 11 км [около 15 минут на машине или 30-40 минут на живописном речном катере-такси через лабиринты камышей]. Заповедная зона обитания гигантских морских черепах Caretta-Caretta.\n* Термальные радоновые источники и омолаживающие грязи Султание [Sultaniye Kaplıcaları]: 4 км по воде на озере Кёйджегиз.\n* Озеро Кёйджегиз [Köyceğiz Gölü]: 5 км до выхода из русла реки в открытую озерную акваторию.\n* Смотровая площадка Радар [Radar Tepesi]: 8 км [панорамный обзор 360° на всю дельту реки, озеро и косу пляжа Изтузу с высоты 500 метров].\n* Международный аэропорт Даламан [DLM]: 30 км [25-30 минут на машине или индивидуальном трансфере].\n* Субботний фермерский рынок Дальяна: 600 метров [свежие фермерские сыры, оливки, гранатовый сок, инжир и фрукты].\n* Морские курорты: город Мармарис - 85 км, город Фетхие и бухта Олюдениз - 60 км.",
    "en": "Dalyan Turaman [private pool, sleeps 10] is a digital web platform for direct online booking of a premium, two-story villa in the eco-reserve resort of Dalyan [Ortaca district, Muğla Province, Turkey], located between the Dalyan River and Lake Köyceğiz.\n\nOfficial address and navigation:\n* Villa address: Dalyan, Rodoslu Yaşar Sünger Sk, NO 28/2, 48600 Ortaca / Muğla, Turkey.\n* Google Maps geolocation link: https://maps.app.goo.gl/tPgCjCwz4pzq28pE9\n* Exact GPS coordinates: 36.8336° N, 28.6439° E.\n\nFull list of key geographical landmarks:\n* Dalyan Pedestrian Center: just 250 meters (3-minute walk) to the main pedestrian street with shops, markets, pharmacies, and souvenir shops.\n* Dalyan River Promenade: 400 meters for morning jogs, evening strolls, and boat watching.\n* Cuisine: popular fine dining restaurant La Boheme Dalyan - 350 meters; traditional fish restaurant Çiçek Restoran - 500 meters.\n* Lycian Rock Tombs of the Kings of Kaunos [4th century BC]: panoramic view from the Dalyan waterfront [450 meters], evening cliff illumination, and a 10-minute boat ride.\n* Ancient City of Kaunos, ancient acropolis, and amphitheater: 1.5 km [rowboat crossing the Dalyan River and hiking trail].\n* World-famous sandy beach of Iztuzu: 11 km [about 15 minutes by car or 30-40 minutes by scenic river taxi through a labyrinth of reeds]. Protected habitat of the giant Caretta-Caretta sea turtles.\n* Thermal radon springs and rejuvenating mud of Sultaniye: 4 km by boat on Lake Köyceğiz. * Köyceğiz Lake [Köyceğiz Gölü]: 5 km before leaving the riverbed for the open lake.\n* Radar Viewpoint [Radar Tepesi]: 8 km [360° panoramic view of the entire river delta, lake, and Iztuzu Beach spit from an altitude of 500 meters].\n* Dalaman International Airport [DLM]: 30 km [25-30 minutes by car or private transfer].\n* Dalyan Saturday Farmers' Market: 600 meters [fresh farm cheeses, olives, pomegranate juice, figs, and fruit].\n* Seaside resorts: Marmaris - 85 km, Fethiye and Ölüdeniz Bay - 60 km.",
    "tr": "Dalyan Turaman [özel havuz, 10 kişi kapasiteli], Dalyan Nehri ve Köyceğiz Gölü arasında yer alan Dalyan'daki [Ortaca ilçesi, Muğla ili, Türkiye] ekolojik rezerv alanında bulunan birinci sınıf, iki katlı bir villanın doğrudan çevrimiçi rezervasyonu için dijital bir web platformudur.\n\nResmi adres ve yol tarifi:\n* Villa adresi: Dalyan, Rodoslu Yaşar Sünger Sk, NO 28/2, 48600 Ortaca / Muğla, Türkiye.\n\n* Google Haritalar konum bağlantısı: https://maps.app.goo.gl/tPgCjCwz4pzq28pE9\n* Tam GPS koordinatları: 36.8336° K, 28.6439° D.\n\nÖnemli coğrafi yer işaretlerinin tam listesi:\n* Dalyan Yaya Merkezi: Mağazaların, pazarların, eczanelerin ve hediyelik eşya dükkanlarının bulunduğu ana yaya caddesine sadece 250 metre (3 dakikalık yürüme mesafesi).\n* Dalyan Nehri Gezinti Yolu: Sabah koşuları, akşam yürüyüşleri ve tekne izleme için 400 metre.\n\n* Mutfak: Popüler lüks restoran La Boheme Dalyan - 350 metre; geleneksel balık restoranı Çiçek Restoran - 500 metre.\n\n* Kaunos Krallarının Likya Kaya Mezarları [MÖ 4. yüzyıl]: Dalyan kıyısından panoramik manzara [450 metre], akşam kaya aydınlatması ve 10 dakikalık tekne yolculuğu.\n\n* Kaunos Antik Kenti, antik akropolis ve amfitiyatro: 1,5 km [Dalyan Nehri'ni kürekli tekneyle geçme ve yürüyüş parkuru].\n\n* Dünyaca ünlü İztuzu kumlu plajı: 11 km [arabayla yaklaşık 15 dakika veya sazlık labirentinden geçen manzaralı nehir taksisiyle 30-40 dakika]. Dev Caretta-Caretta deniz kaplumbağalarının koruma altındaki yaşam alanı.\n* Sultaniye'nin termal radon kaynakları ve gençleştirici çamuru: Köyceğiz Gölü'nde tekneyle 4 km. * Köyceğiz Gölü: Nehir yatağından açık göle geçmeden 5 km önce.\n\n* Radar Gözlem Noktası: 8 km [500 metre yükseklikten tüm nehir deltası, göl ve İztuzu Plajı'nın 360° panoramik manzarası].\n\n* Dalaman Uluslararası Havalimanı: 30 km [araba veya özel transferle 25-30 dakika].\n\n* Dalyan Cumartesi Çiftçi Pazarı: 600 metre [taze çiftlik peynirleri, zeytin, nar suyu, incir ve meyve].\n\n* Sahil beldeleri: Marmaris - 85 km, Fethiye ve Ölüdeniz Koyu - 60 km.",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "about_sec_2_title": {
    "block": "4. О вилле",
    "key": "about_sec_2_title",
    "desc": "Модальное окно: Раздел 2 Заголовок",
    "ru": "2. Архитектура виллы и номерной фонд",
    "en": "2. Villa architecture and room stock",
    "tr": "2. Villa mimarisi ve oda düzeni",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "about_sec_2_text": {
    "block": "4. О вилле",
    "key": "about_sec_2_text",
    "desc": "Модальное окно: Раздел 2 Текст",
    "ru": "Тип недвижимости: Дом / Вилла [в распоряжении гостей жилье целиком].\nПлощадь, этажность и год постройки: 240 кв. метров, 2 этажа, год постройки - 2013.\nВместимость: до 10 гостей [включая детей], 10 полноценных спальных мест.\nКонфигурация спален и санузлов: 4 большие спальни [каждая оборудована персональной ванной комнатой и автономным кондиционером] + гостевой туалет на первом этаже:\nПервый этаж: полноценная кухня Beko, просторная гостиная со Smart TV 55\", гостевой туалет, прихожая, постирочная, Спальня 1 [квин-сайз + односпальная кровать, ванная с душем, кондиционер].\nВторой этаж: Спальня 2 [кинг-сайз, ванная с тропическим душем, кондиционер, балкон], Спальня 3 [квин-сайз, ванная, кондиционер, вид на горы], Спальня 4 [квин-сайз + односпальная кровать, ванная, кондиционер], вторая стиральная машина.\nИтоговая структура: 4 двуспальные кровати + 2 односпальные кровати + диван в гостиной = 10 спальных мест.",
    "en": "Property Type: House/Villa [guests have access to the entire property].\nArea, Number of Floors, and Year Built: 240 sq. m, 2 floors, built in 2013.\nCapacity: Up to 10 guests [including children], 10 full beds.\nBedroom and bathroom configuration: 4 large bedrooms (each with an en-suite bathroom and independent air conditioning) + guest toilet on the ground floor:\nFirst floor: Full Beko kitchen, spacious living room with 55\" Smart TV, guest toilet, hallway, laundry room, Bedroom 1 [queen + single bed, en-suite with shower, air conditioning].\nSecond floor: Bedroom 2 [king, en-suite with rain shower, air conditioning, balcony], Bedroom 3 [queen, en-suite, air conditioning, mountain views], Bedroom 4 [queen + single bed, en-suite, air conditioning], second washing machine.\nFinal layout: 4 double beds + 2 single beds + sofa in the living room = 10 beds.",
    "tr": "Mülk Tipi: Ev/Villa [konuklar tüm mülke erişebilir].\nAlan, Kat Sayısı ve İnşa Yılı: 240 m², 2 katlı, 2013 yılında inşa edilmiştir.\nKapasite: 10 kişiye kadar [çocuklar dahil], 10 adet çift kişilik yatak.\nYatak odası ve banyo düzeni: Zemin katta 4 geniş yatak odası (her biri özel banyo ve bağımsız klima ile) + misafir tuvaleti:\nBirinci kat: Tam donanımlı Beko mutfak, 55 inç Smart TV'li geniş oturma odası, misafir tuvaleti, koridor, çamaşırhane, Yatak Odası 1 [çift kişilik + tek kişilik yatak, duşlu özel banyo, klima].\nİkinci kat: Yatak Odası 2 [king yatak, yağmur duşlu özel banyo, klima, balkon], Yatak Odası 3 [çift kişilik yatak, özel banyo, klima, dağ manzarası], Yatak Odası 4 [çift kişilik + tek kişilik yatak, özel banyo, klima], ikinci çamaşır makinesi.\nSon yerleşim: Oturma odasında 4 çift kişilik yatak + 2 tek kişilik yatak + kanepe = 10 yatak.",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "about_sec_3_title": {
    "block": "4. О вилле",
    "key": "about_sec_3_title",
    "desc": "Модальное окно: Раздел 3 Заголовок",
    "ru": "3. Придомовая территория, бассейн и спа-комплекс",
    "en": "3. The local area, swimming pool and spa complex",
    "tr": "3. Bölge, yüzme havuzu ve spa kompleksi",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "about_sec_3_text": {
    "block": "4. О вилле",
    "key": "about_sec_3_text",
    "desc": "Модальное окно: Раздел 3 Текст",
    "ru": "Приватный бассейн с соленой водой: чаша 4×9 метров [площадь 36 кв. м], постоянная глубина 150 см. Без запаха хлора. Доступен с 1 мая по 1 ноября. Чистка в день заселения и каждые 7 дней. Подсветка бассейна: 20:00 - 01:00.\nУличное приватное джакузи: на 4 персоны, автоматический цикл [15 минут работы каждые 45 минут в период 10:00 - 17:00]. Подсветка джакузи: 20:00 - 01:00. Сезон: 1 мая - 1 ноября.\nОсвещение территории: автоматическое [20:00 - 01:00 и 04:00 - 06:00].\nПарковка: бесплатная закрытая частная парковка на территории на 2 авто.\nОткрытые зоны отдыха: огороженный сад, барбекю [BBQ], крыльцо с кофейными столиками, обеденный стол на 8 мест, шезлонги и летний душ.",
    "en": "Private saltwater pool: 4x9 meter pool (36 sq. m), constant depth of 150 cm. No chlorine odor. Available from May 1st to November 1st. Cleaning on arrival day and every 7 days. Pool lighting: 8:00 PM - 1:00 AM.\nOutdoor private jacuzzi: for 4 people, automatic cycle [15-minute run every 45 minutes from 10:00 AM - 5:00 PM]. Jacuzzi lighting: 8:00 PM - 1:00 AM. Season: May 1st - November 1st.\nGrounds lighting: automatic [8:00 PM - 1:00 AM and 4:00 AM - 6:00 AM].\nParking: Free private enclosed parking on site for 2 cars. Outdoor recreation areas include a fenced garden, BBQ, porch with coffee tables, 8-seat dining table, sun loungers and an outdoor shower.",
    "tr": "Özel tuzlu su havuzu: 4x9 metre havuz (36 m²), 150 cm sabit derinlik. Klor kokusu yok. 1 Mayıs - 1 Kasım tarihleri ​​arasında kullanılabilir. Giriş gününde ve her 7 günde bir temizlik yapılır. Havuz aydınlatması: 20:00 - 01:00.\nÖzel açık hava jakuzisi: 4 kişilik, otomatik döngü [10:00 - 17:00 arası her 45 dakikada bir 15 dakikalık çalışma]. Jakuzi aydınlatması: 20:00 - 01:00. Sezon: 1 Mayıs - 1 Kasım.\nBahçe aydınlatması: otomatik [20:00 - 01:00 ve 04:00 - 06:00].\nOtopark: Tesis bünyesinde 2 araçlık ücretsiz özel kapalı otopark. Açık hava dinlenme alanları arasında çitli bahçe, barbekü, sehpalı veranda, 8 kişilik yemek masası, şezlonglar ve açık duş bulunmaktadır.",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "about_sec_4_title": {
    "block": "4. О вилле",
    "key": "about_sec_4_title",
    "desc": "Модальное окно: Раздел 4 Заголовок",
    "ru": "4. Юридический регламент, безопасность и доступная среда",
    "en": "4. Legal regulations, safety and accessible environment",
    "tr": "4. Yasal düzenlemeler, güvenlik ve erişilebilir ortam",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "about_sec_4_text": {
    "block": "4. О вилле",
    "key": "about_sec_4_text",
    "desc": "Модальное окно: Раздел 4 Текст",
    "ru": "Закон Турции № 7464 о краткосрочной аренде: обязательный договор аренды виллы с описью имущества при заселении.\nРегистрация в системе учета населения KBS: обязательное предоставление паспортов всех проживающих. Размещение незарегистрированных лиц строго запрещено.\nБезопасность дома: внешнее видеонаблюдение по периметру, детекторы дыма во всех спальнях и гостиной, огнетушитель, аптечка первой помощи.\nДоступная среда: выделенная парковка для инвалидов, ровный освещенный вход без ступеней, дверь от 81 см, подъемник для бассейна и джакузи.\nПолитика отмены: менее 28 ночей - Негибкие, от 28 ночей - Строгие. Опция невозвратного тарифа со скидкой 10% за 60 дней.",
    "en": "Turkish Short-Term Rental Law No. 7464: A mandatory villa rental agreement with an inventory of the property is required upon arrival.\nKBS Population Registration System: Passports of all residents are required. Unregistered occupants are strictly prohibited.\nHome Security: External perimeter video surveillance, smoke detectors in all bedrooms and the living room, fire extinguisher, and first aid kit.\nAccessibility: Dedicated disabled parking, level, illuminated, step-free entrance, door height of at least 81 cm, pool and jacuzzi lift.\nCancellation Policy: Less than 28 nights - Inflexible, 28 nights or more - Strict. Non-refundable rate option with a 10% discount for 60 days.",
    "tr": "Türk Kısa Süreli Kiralama Kanunu No. 7464: Varışta, mülkün envanterini içeren zorunlu bir villa kiralama sözleşmesi gereklidir.\nKBS Nüfus Kayıt Sistemi: Tüm sakinlerin pasaportları gereklidir. Kayıt dışı sakinlerin konaklaması kesinlikle yasaktır.\nEv Güvenliği: Dış çevre video gözetimi, tüm yatak odalarında ve oturma odasında duman dedektörleri, yangın söndürücü ve ilk yardım çantası.\nErişilebilirlik: Engelliler için özel park yeri, düz, aydınlatmalı, basamaksız giriş, en az 81 cm kapı yüksekliği, havuz ve jakuzi asansörü.\nİptal Politikası: 28 geceden az - Esnek değil, 28 gece veya daha fazla - Kesinlikle. 60 gün için %10 indirimli, iade edilmeyen fiyat seçeneği.",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "about_sec_5_title": {
    "block": "4. О вилле",
    "key": "about_sec_5_title",
    "desc": "Модальное окно: Раздел 5 Заголовок",
    "ru": "5. Профиль суперхозяина и мастер-доступ",
    "en": "5. Superhost profile and master access",
    "tr": "5. Süper sunucu profili ve ana erişim",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "about_sec_5_text": {
    "block": "4. О вилле",
    "key": "about_sec_5_text",
    "desc": "Модальное окно: Раздел 5 Текст",
    "ru": "Владелец: Алексей Знаменский [Aleksei Znamenskii]. Проживает в Мармарисе, яхтсмен на пенсии. Жизненное кредо: «Хочешь сделать хорошо - сделай сам». Мечта: отправиться в Португалию и увидеть океан. Хобби: велоспорт, парусный спорт, природа. Штампы путешествий: Дубай [3 поездки], Абу-Даби [март 2026 г.]. Языки: русский, английский, турецкий. Налоговые реквизиты: Ortaca Vergi Dairesi, VKN: 9991120181.\nМастер-доступ суперхозяина: villaturaman@gmail.com, логин admin / пароль admin123, роль: Владелец [Финансы, Периоды, Блокировки, Окно брони, Чаты].",
    "en": "Owner: Aleksei Znamenskii. Lives in Marmaris, retired yachtsman. Life motto: \"If you want something done right, do it yourself.\" Dream: to go to Portugal and see the ocean. Hobbies: cycling, sailing, nature. Travel stamps: Dubai [3 trips], Abu Dhabi [March 2026]. Languages: Russian, English, Turkish. Tax details: Ortaca Vergi Dairesi, VKN: 9991120181.\nSuperhost master access: villaturaman@gmail.com, login admin / password admin123, role: Owner [Finances, Periods, Blocks, Booking Window, Chats].",
    "tr": "Sahibi: Aleksei Znamenskii. Marmaris'te yaşıyor, emekli yatçı. Hayat felsefesi: \"Bir şeyin doğru yapılmasını istiyorsanız, kendiniz yapın.\" Hayali: Portekiz'e gidip okyanusu görmek. Hobileri: bisiklet, yelken, doğa. Seyahat damgaları: Dubai [3 gezi], Abu Dhabi [Mart 2026]. Diller: Rusça, İngilizce, Türkçe. Vergi bilgileri: Ortaca Vergi Dairesi, VKN: 9991120181.\nSüper ev sahibi ana erişimi: villaturaman@gmail.com, kullanıcı adı admin / şifre admin123, rol: Sahip [Finans, Dönemler, Bloklar, Rezervasyon Penceresi, Sohbetler].",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "about_sec_6_title": {
    "block": "4. О вилле",
    "key": "about_sec_6_title",
    "desc": "Модальное окно: Раздел 6 Заголовок",
    "ru": "6. Возможна прогулка на морской яхте",
    "en": "6. A trip on a sea yacht is possible",
    "tr": "6. Deniz yatıyla seyahat mümkündür.",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "about_sec_6_text": {
    "block": "4. О вилле",
    "key": "about_sec_6_text",
    "desc": "Модальное окно: Раздел 6 Текст",
    "ru": "Яхта произведена в Германии в 2022 году. \nМодель BAVARIA C45. На площади более 60 м² организовано уютное пространство для путешествий.\nТри каюты, в каждой из них кровать 140 см на 200 см. Такое же спальное место [140 см на 200 см] можно организовать в салоне [стол трансформер]. В кокпите так же столы трансформируются в лежаки, где два взрослых человека комфортно разместятся на ночевку и вахту. Итого 10 спальных мест.\nХолодная и горячая вода присутствует. \nДва туалета с электрической системой слива оборудованы баком-накопителем по 70 литров каждый. Две душевые кабинки и один открытый душ на откидной платформе для купания. \nДва холодильника и отдельная морозильная камера, газовая плита, духовой шкаф, посудомоечная машина, посуда, кухонная техника с кофемашиной - к услугам тех, кто хочет отличиться на кухне и удивить команду. Так же возможно приготовление блюд нашей командой. \nДля дальних переходов на яхте имеется генератор и солнечные панели. \nДве зоны отдыха под навесами, а так же открытые зоны для загара на палубе яхты. \nДля купания откидная платформа имеет удобную систему спуска в воду. \nТехнические данные:\nОбщая длина 14,06 м. Ширина корпуса 4,49 м. Осадка [Киль] 2,60 м. Вес балласта [киль] 2,984 кг. Топливный бак 250 литров. Резервуар для воды 650 литров. Паруса: Грот [закрутка] 51,0 м². Кливер 45,0 м². Генуя 52,0 м². Длина мачты [макс.] от ватерлинии 22,00 м. Район плавания Категория CE А10/Б14/С16 [неограниченно]. Дизайн яхты Cossutti. Безопасность на яхте обеспечена необходимым комплектом: 12 спасательных жилетов, спасательный плот на 10 человек, динги с мотором на 6 человек и другое спасательное оборудование по регламенту. \nТак же на борту имеются: надувные каяк, саб, ватрушка и маски для подводного плавания, применяемые для водных развлечений.",
    "en": "The yacht was built in Germany in 2022.\nModel BAVARIA C45. Over 60 m² of space offers a cozy space for exploring.\nThree cabins, each with a 140 cm x 200 cm bed. A similar berth (140 cm x 200 cm) can be arranged in the salon (transformable table). The cockpit tables also transform into sun loungers, comfortably accommodating two adults for overnight stays and watchkeeping. A total of 10 berths are provided.\nHot and cold running water is available.\nTwo toilets with electric flush systems are equipped with a 70-liter holding tank each. Two shower stalls and one outdoor shower on a fold-down bathing platform.\nTwo refrigerators and a separate freezer, a gas stove, oven, dishwasher, dishes, and kitchen appliances with a coffee machine are available for those who want to excel in the kitchen and impress the crew. Meals can also be prepared by the crew.\n\nFor long-distance cruising, the yacht is equipped with a generator and solar panels.\n\nTwo recreation areas under awnings, as well as open sunbathing areas on the yacht's deck, are available.\n\nFor swimming, a folding platform has a convenient launch system.\n\nTechnical data:\nOverall length: 14.06 m. Hull width: 4.49 m. Draft: 2.60 m. Ballast weight: 2.984 kg. Fuel tank: 250 liters. Water tank: 650 liters. Sails: Mainsail (furling): 51.0 m². Jib: 45.0 m². Genoa 52.0 m². Mast length [max.] from waterline 22.00 m. Sailing area Category CE A10/B14/C16 [unlimited]. Yacht design by Cossutti. Safety on board is ensured by the necessary equipment: 12 life jackets, a 10-person life raft, a 6-person motorized dinghy, and other required safety equipment. \nAlso on board are an inflatable kayak, a SUP, a tube, and snorkeling masks for water activities.",
    "tr": "Yat, 2022 yılında Almanya'da inşa edilmiştir.\nBAVARIA C45 modeli. 60 m²'den fazla alan, keşif için rahat bir ortam sunmaktadır.\nHer biri 140 cm x 200 cm yatak bulunan üç kabin. Salonda (dönüştürülebilir masa) benzer bir yatak (140 cm x 200 cm) düzenlenebilir. Kokpit masaları ayrıca güneşlenme şezlonglarına dönüşerek, gece konaklamaları ve nöbet tutma için iki yetişkini rahatça ağırlayabilir. Toplam 10 yatak mevcuttur.\nSıcak ve soğuk akan su mevcuttur.\nHer biri 70 litrelik atık su tankına sahip elektrikli sifon sistemli iki tuvalet. İki duş kabini ve katlanır yüzme platformu üzerinde bir açık duş.\nMutfakta ustalaşmak ve mürettebatı etkilemek isteyenler için iki buzdolabı ve ayrı bir dondurucu, gazlı ocak, fırın, bulaşık makinesi, tabaklar ve kahve makinesi içeren mutfak aletleri mevcuttur. Yemekler mürettebat tarafından da hazırlanabilir.\n\nUzun mesafeli seyirler için yat, jeneratör ve güneş panelleriyle donatılmıştır.\n\nİki adet tente altında dinlenme alanı ve yatın güvertesinde açık güneşlenme alanları mevcuttur.\n\nYüzme için, kullanışlı bir fırlatma sistemine sahip katlanır bir platform bulunmaktadır.\n\nTeknik veriler:\nToplam uzunluk: 14,06 m. Gövde genişliği: 4,49 m. Su çekimi: 2,60 m. Balast ağırlığı: 2,984 kg. Yakıt deposu: 250 litre. Su deposu: 650 litre. Yelkenler: Ana yelken (sarmalı): 51,0 m². Flok: 45,0 m². Cenova: 52,0 m². Direk uzunluğu [maks.] su hattından 22,00 m. Yelken alanı Kategorisi CE A10/B14/C16 [sınırsız]. Yat tasarımı: Cossutti. Gemideki güvenlik, gerekli ekipmanlarla sağlanmaktadır: 12 can yeleği, 10 kişilik can salı, 6 kişilik motorlu bot ve diğer gerekli güvenlik ekipmanları.\n\nAyrıca gemide şişme kayak, SUP, tüp ve su aktiviteleri için şnorkel maskeleri de bulunmaktadır.",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "about_sec_7_title": {
    "block": "4. О вилле",
    "key": "about_sec_7_title",
    "desc": "Модальное окно: Раздел 7 Заголовок",
    "ru": "7. Возможно путешествие на кемпере",
    "en": "7. Traveling by camper is possible",
    "tr": "7. Karavanla seyahat mümkündür.",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "about_sec_7_text": {
    "block": "4. О вилле",
    "key": "about_sec_7_text",
    "desc": "Модальное окно: Раздел 7 Текст",
    "ru": "Тур «Всё» - это возможность за 1 неделю неспешно отдохнуть меняя ритм, стиль и вид отдыха. Это очень круто. За это время вы однозначно почувствуете разнообразие и красоту Турции и в том числе замечательного места города Дальян [провинция Мугла]. Предъявляя разные требования и пожелания к своему досугу, вы в конечном итоге, будете удовлетворены и поймете, что это было замечательно и великолепно. И скажите мне: Спасибо. Это было настоящее приключение. \nНазвание: Тур «Всё». Вилла, яхта, кемпер, SUP, каяк, велосипеды...\nПлан тура:\nVilla Turaman [2 дня 2 ночи] - Яхта Vasilisa [2 дня 1 ночь] - Кемпер [1 день 2 ночи] - Villa Turaman [2 дня 1 ночь]\n\n1 и 2 день - Villa Turaman [2 дня 2 ночи]: \n1 день. Трансфер из аэропорта. Заселение на виллу после 16.00. Вечерний променад по набережной и пешеходной улице города Дальян. Ужин в ресторане.\n2 день. Отдых на вилле, бассейн. Можно выехать в древний город или взять напрокат лодку с экскурсией по реке. Половить крабов и в конечном итоге по реке добраться до пляжа. День свободный, сможете принять сами решение как его провести. Мы со своей стороны обеспечим вас транспортом и сопровождением по всем местам, что мы знаем всё вам покажем. Этот день мы можем с вами спланировать при формировании брони и сделать его максимально интересным для вас.\n3 и 4 день - Яхта Vasilisa [2 дня 1 ночь]:\n3 день. 6:00 подъем. Сборы. Завтрак. Выезд на яхту Vasilisa в Marmaris. 9.30 заходим на яхту. Готовимся отходить. Маршрут: Marmaris Yacht Marina - Ekincik.\n4 и 5 день - Кемпер Adria Adora 673 PK [1 день 2 ночи]:\n4 день. 16:00 Сборы. На моторной лодке отчаливаем с яхты Vasilisa и двигаемся 5 - 10 минут к берегу бухты Ekincik. Там на береговой линии бухты нас ждет оборудованная площадка для отдыха на караване.\nНеобычный и абсолютно новый семейный караван Adria Adora 673 PK на берегу Средиземного моря в прекрасном тихом месте Ekincik находится в 60 минутах езды от виллы Turaman, выполненный в стиле минимализма, вмещает 3 спальные зоны:\n- в передней части: двуспальная кровать с панорамным видом;\n- в середине: раздельный санузел, обеденная зона со столом, которая разбирается в большую кровать, а напротив кухня;\n- в задней части: комната с диваном и вторым спальным ярусом, отлично подойдет в качестве детской комнаты;\nВ Кемпере Adria Adora 673 PK есть все для полного комфорта: два входа, отопление и бойлер, пол с подогревом, кондиционер, штатное место для аккумулятора, увеличенный холодильник, автоматический слив воды, аудиосистема, установлен бак для воды, вытяжка в кухне, а в комплекте идут: ковры, бак для серой воды, противооткатные упоры. Тип санузла: Раздельный.\nТак же вам будут предоставлены: гриль и принадлежности, маски для плавания, уличная пляжная мебель и посуда.\n6 и 7 день - Villa Turaman [2 дня 2 ночи]:\n6 день. Возвращаемся на виллу. Вечерний променад по набережной и пешеходной улице города Дальян. Ужин в ресторане.\n7 день. Выезд с виллы до 9.00: Завтрак. Трансфер до аэропорта.\nВсе это можно продлить по вашему желанию.\nЕсли у вас есть вопросы, свяжитесь с суперхозяином Алексеем в чате.",
    "en": "The \"Everything\" tour is an opportunity to unwind in one week, changing your pace, style, and type of vacation. It's absolutely fantastic. During this time, you'll definitely experience the diversity and beauty of Turkey, including the wonderful city of Dalyan (Mugla Province). Although you may have different expectations and desires for your leisure time, you'll ultimately be satisfied and realize that it was wonderful and magnificent. And tell me: Thank you. It was a real adventure.\n\nTitle: \"Everything\" Tour. Villa, yacht, camper, SUP, kayak, bicycles...\nTour Plan:\nVilla Turaman [2 days 2 nights] - Yacht Vasilisa [2 days 1 night] - Camper [1 day 2 nights] - Villa Turaman [2 days 1 night]\n\nDays 1 and 2 - Villa Turaman [2 days 2 nights]:\nDay 1. Airport transfer. Check-in at the villa after 4:00 PM. An evening stroll along the Dalyan promenade and pedestrian street. Dinner at a restaurant.\nDay 2. Relax at the villa, pool. You can visit the ancient city or rent a boat for a river excursion. Catch crabs and eventually reach the beach by boat. The day is free, and you can decide how to spend it. We will provide transportation and escort you to all the places we know and will show you. We can plan this day together when making your reservation and make it as interesting as possible for you.\nDays 3 and 4 - Yacht Vasilisa [2 days, 1 night]:\nDay 3. Wake up at 6:00 AM. Pack up. Breakfast. Departure for the yacht Vasilisa in Marmaris. Board the yacht at 9:30 AM. Prepare to depart. Route: Marmaris Yacht Marina - Ekincik.\nDays 4 and 5 - Adria Adora 673 PK Camper [1 day 2 nights]:\nDay 4. 4:00 PM. We depart the Vasilisa yacht by motorboat and travel 5-10 minutes to the shore of Ekincik Bay. There, on the bay's shoreline, a well-equipped campervan area awaits.\nThis unique and brand-new family caravan, the Adria Adora 673 PK, is located on the Mediterranean coast in the beautiful, quiet location of Ekincik, a 60-minute drive from Villa Turaman. Designed in a minimalist style, it features three sleeping areas:\n- Forward: a double bed with panoramic views;\n- Middle: separate bathroom, dining area with table that converts into a large bed, and opposite is the kitchen;\n- Rear: a room with a sofa and a second bunk, perfect for a children's room;\nThe Adria Adora 673 PK camper has everything you need for complete comfort: two entrances, heating and a boiler, underfloor heating, air conditioning, a dedicated battery compartment, an oversized refrigerator, automatic drain, an audio system, a water tank, a kitchen hood, and carpets, a grey water tank, and wheel chocks are included. Bathroom type: Separate.\nYou will also be provided with a grill and accessories, snorkels, outdoor beach furniture, and dishes.\nDays 6 and 7 - Villa Turaman [2 days 2 nights]:\nDay 6. Return to the villa. Evening promenade along the promenade and pedestrian street of Dalyan. Dinner at the restaurant.\nDay 7. Check-out before 9:00 AM: Breakfast. Airport transfer.\nAll of this can be extended at your request.\nIf you have any questions, please contact superhost Alexey via chat.",
    "tr": "\"Her Şey\" turu, bir hafta boyunca rahatlamak, tempoyu, tarzı ve tatil türünü değiştirmek için bir fırsattır. Kesinlikle harika. Bu süre zarfında, Dalyan'ın (Muğla ili) muhteşem şehri de dahil olmak üzere Türkiye'nin çeşitliliğini ve güzelliğini kesinlikle deneyimleyeceksiniz. Boş zamanınız için farklı beklentileriniz ve istekleriniz olsa da, sonunda memnun kalacak ve harika ve muhteşem olduğunu anlayacaksınız. Ve bana söyleyin: Teşekkür ederim. Gerçek bir maceraydı.\n\nBaşlık: \"Her Şey\" Turu. Villa, yat, karavan, SUP, kayak, bisikletler...\nTur Planı:\nVilla Turaman [2 gün 2 gece] - Yat Vasilisa [2 gün 1 gece] - Karavan [1 gün 2 gece] - Villa Turaman [2 gün 1 gece]\n\n1. ve 2. Günler - Villa Turaman [2 gün 2 gece]:\n1. Gün. Havaalanı transferi. Saat 16:00'dan sonra villaya giriş. Dalyan sahil şeridi ve yaya caddesinde akşam yürüyüşü. Restoranda akşam yemeği.\n2. Gün. Villada, havuzda dinlenin. Antik kenti ziyaret edebilir veya nehir gezisi için tekne kiralayabilirsiniz. Yengeç yakalayabilir ve sonunda tekneyle sahile ulaşabilirsiniz. Gün serbesttir ve nasıl geçireceğinize siz karar verebilirsiniz. Bildiğimiz ve size göstereceğimiz tüm yerlere ulaşımınızı sağlayacağız ve size eşlik edeceğiz. Rezervasyonunuzu yaparken bu günü birlikte planlayabilir ve sizin için mümkün olduğunca ilgi çekici hale getirebiliriz.\n3. ve 4. Günler - Vasilisa Yat [2 gün, 1 gece]:\n3. Gün. Sabah 6:00'da uyanın. Eşyalarınızı toplayın. Kahvaltı. Marmaris'teki Vasilisa yatına hareket. Saat 9:30'da yata binin. Harekete hazırlanın. Güzergah: Marmaris Yat Limanı - Ekincik.\n4. ve 5. Günler - Adria Adora 673 PK Karavan [1 gün 2 gece]:\n4. Gün. 16:00. Vasilisa yatından motorlu tekneyle ayrılıp Ekincik Koyu kıyısına 5-10 dakika yolculuk yapıyoruz. Orada, koyun kıyısında, iyi donanımlı bir karavan alanı bizi bekliyor.\nBu eşsiz ve yepyeni aile karavanı, Adria Adora 673 PK, Akdeniz kıyısında, güzel ve sakin Ekincik bölgesinde, Villa Turaman'a 60 dakikalık sürüş mesafesinde yer almaktadır. Minimalist bir tarzda tasarlanan karavan, üç uyku alanına sahiptir:\n- Ön: Panoramik manzaralı çift kişilik yatak;\n\n- Orta: Ayrı banyo, büyük bir yatağa dönüşen masa bulunan yemek alanı ve karşısında mutfak;\n\n- Arka: Çocuk odası için mükemmel olan, kanepe ve ikinci bir ranza bulunan bir oda;\n\nAdria Adora 673 PK karavanı, tam konfor için ihtiyacınız olan her şeye sahiptir: iki giriş, ısıtma ve kazan, yerden ısıtma, klima, özel akü bölmesi, büyük boy buzdolabı, otomatik tahliye, ses sistemi, su deposu, mutfak davlumbazı ve halılar, gri su deposu ve tekerlek takozları dahildir. Banyo tipi: Ayrı.\n\nAyrıca size mangal ve aksesuarları, şnorkeller, dış mekan plaj mobilyaları ve tabaklar da sağlanacaktır.\n6. ve 7. Günler - Villa Turaman [2 gün 2 gece]:\n6. Gün. Villaya dönüş. Dalyan'ın sahil şeridi ve yaya caddesinde akşam gezintisi. Restoranda akşam yemeği.\n\n7. Gün. Sabah 9:00'dan önce çıkış: Kahvaltı. Havaalanı transferi.\nTüm bunlar isteğiniz üzerine uzatılabilir.\nHerhangi bir sorunuz varsa, lütfen süper ev sahibi Alexey ile sohbet yoluyla iletişime geçin.",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "sleeping_title": {
    "block": "5. Спальни",
    "key": "sleeping_title",
    "desc": "Заголовок секции спальных мест",
    "ru": "Где вы будете спать • 10 спальных мест в 4 спальнях",
    "en": "Where you'll sleep • Sleeps 10 in 4 bedrooms",
    "tr": "Konaklama yerleri • 4 yatak odasında 10 kişi konaklayabilir",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "bedroom_1": {
    "block": "5. Спальни",
    "key": "bedroom_1",
    "desc": "Спальня 1 [1 этаж] • Queen + Single [3 места]",
    "ru": "Спальня 1 [1 этаж] • Queen + Single [3 места]",
    "en": "Bedroom 1 [1st floor] • Queen + Single [3 beds]",
    "tr": "Yatak Odası 1 [1. kat] • Çift kişilik + Tek kişilik [3 yatak]",
    "media": "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600",
    "status": "Вкл",
    "enabled": true
  },
  "bedroom_1_desc": {
    "block": "5. Спальни",
    "key": "bedroom_1_desc",
    "desc": "Описание спальни 1",
    "ru": "Первый этаж: 1 двуспальная кровать Queen + 1 односпальная кровать, персональная ванная с душевой кабиной, кондиционер",
    "en": "First floor: 1 queen bed + 1 single bed, private bathroom with shower, air conditioning",
    "tr": "Birinci kat: 1 adet çift kişilik yatak + 1 adet tek kişilik yatak, duşlu özel banyo, klima.",
    "media": "BedDouble",
    "status": "Вкл",
    "enabled": true
  },
  "bedroom_1_badge": {
    "block": "5. Спальни",
    "key": "bedroom_1_badge",
    "desc": "Бейдж кровати спальни 1",
    "ru": "Queen + Single [3 места]",
    "en": "Queen + Single [3 places]",
    "tr": "Kraliçe + Tekli [3 kişilik yer]",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "bedroom_2": {
    "block": "5. Спальни",
    "key": "bedroom_2",
    "desc": "Спальня 2 [2 этаж] • King Bed [2 места]",
    "ru": "Спальня 2 [2 этаж] • King Bed [2 места]",
    "en": "Bedroom 2 [2nd floor] • King Bed [2 beds]",
    "tr": "Yatak Odası 2 [2. kat] • Çift Kişilik Yatak [2 yatak]",
    "media": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600",
    "status": "Вкл",
    "enabled": true
  },
  "bedroom_2_desc": {
    "block": "5. Спальни",
    "key": "bedroom_2_desc",
    "desc": "Описание спальни 2",
    "ru": "Второй этаж: 1 большая двуспальная кровать King Size, собственная ванная комната, кондиционер, балкон с видом на горы",
    "en": "Second floor: 1 king size bed, private bathroom, air conditioning, balcony with mountain views",
    "tr": "İkinci kat: 1 adet çift kişilik yatak, özel banyo, klima, dağ manzaralı balkon.",
    "media": "BedDouble",
    "status": "Вкл",
    "enabled": true
  },
  "bedroom_2_badge": {
    "block": "5. Спальни",
    "key": "bedroom_2_badge",
    "desc": "Бейдж кровати спальни 2",
    "ru": "King Bed [2 места]",
    "en": "King Bed [2 places]",
    "tr": "Çift kişilik büyük yatak [2 kişilik]",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "bedroom_3": {
    "block": "5. Спальни",
    "key": "bedroom_3",
    "desc": "Спальня 3 [2 этаж] • Queen Bed [2 места]",
    "ru": "Спальня 3 [2 этаж] • Queen Bed [2 места]",
    "en": "Bedroom 3 [2nd floor] • Queen Bed [2 beds]",
    "tr": "Yatak Odası 3 [2. kat] • Çift Kişilik Yatak [2 yatak]",
    "media": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600",
    "status": "Вкл",
    "enabled": true
  },
  "bedroom_3_desc": {
    "block": "5. Спальни",
    "key": "bedroom_3_desc",
    "desc": "Описание спальни 3",
    "ru": "Второй этаж: 1 двуспальная кровать Queen Size, собственная ванная комната, кондиционер, гардероб",
    "en": "Second floor: 1 queen size bed, private bathroom, air conditioning, wardrobe",
    "tr": "İkinci kat: 1 adet çift kişilik yatak, özel banyo, klima, gardırop.",
    "media": "Bed",
    "status": "Вкл",
    "enabled": true
  },
  "bedroom_3_badge": {
    "block": "5. Спальни",
    "key": "bedroom_3_badge",
    "desc": "Бейдж кроватей спальни 3",
    "ru": "Queen Bed [2 места]",
    "en": "Queen Bed [2 places]",
    "tr": "Çift Kişilik Yatak [2 kişilik]",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "bedroom_4": {
    "block": "5. Спальни",
    "key": "bedroom_4",
    "desc": "Спальня 4 [2 этаж] • Queen + Single [3 места]",
    "ru": "Спальня 4 [2 этаж] • Queen + Single [3 места]",
    "en": "Bedroom 4 [2nd floor] • Queen + Single [3 beds]",
    "tr": "Yatak Odası 4 [2. kat] • Çift kişilik + Tek kişilik [3 yatak]",
    "media": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600",
    "status": "Вкл",
    "enabled": true
  },
  "bedroom_4_desc": {
    "block": "5. Спальни",
    "key": "bedroom_4_desc",
    "desc": "Описание спальни 4",
    "ru": "Второй этаж: 1 двуспальная кровать Queen + 1 дополнительная односпальная кровать, собственная ванная комната, кондиционер",
    "en": "Second floor: 1 queen bed + 1 extra single bed, private bathroom, air conditioning",
    "tr": "İkinci kat: 1 adet çift kişilik yatak + 1 adet ilave tek kişilik yatak, özel banyo, klima.",
    "media": "Sofa",
    "status": "Вкл",
    "enabled": true
  },
  "bedroom_4_badge": {
    "block": "5. Спальни",
    "key": "bedroom_4_badge",
    "desc": "Бейдж дивана спальни 4",
    "ru": "Queen + Single [3 места]",
    "en": "Queen + Single [3 places]",
    "tr": "Kraliçe + Tekli [3 kişilik yer]",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "amenities_title": {
    "block": "6. Удобства",
    "key": "amenities_title",
    "desc": "Заголовок секции удобств",
    "ru": "Что есть в этом жилье",
    "en": "What is in this housing?",
    "tr": "Bu konutun içinde ne var?",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "amenities_btn_all": {
    "block": "6. Удобства",
    "key": "amenities_btn_all",
    "desc": "Кнопка открытия модального окна всех удобств",
    "ru": "Показать все удобства",
    "en": "Show all amenities",
    "tr": "Tüm olanakları göster",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "amenity_main_1": {
    "block": "6. Удобства",
    "key": "amenity_main_1",
    "desc": "Основное удобство 1 на главной",
    "ru": "Приватный открытый бассейн 36 м²",
    "en": "Private outdoor pool 36 m²",
    "tr": "36 m²'lik özel açık yüzme havuzu",
    "media": "Waves",
    "status": "Вкл",
    "enabled": true
  },
  "amenity_main_2": {
    "block": "6. Удобства",
    "key": "amenity_main_2",
    "desc": "Основное удобство 2 на главной",
    "ru": "Уличное джакузи на 4 персоны",
    "en": "Outdoor Jacuzzi for 4 people",
    "tr": "4 kişilik açık hava jakuzisi",
    "media": "Sparkles",
    "status": "Вкл",
    "enabled": true
  },
  "amenity_main_3": {
    "block": "6. Удобства",
    "key": "amenity_main_3",
    "desc": "Основное удобство 3 на главной",
    "ru": "Скоростной Wi-Fi: [WIFI_NAME]",
    "en": "High-speed Wi-Fi: [WIFI_NAME]",
    "tr": "Yüksek hızlı Wi-Fi: [WIFI_NAME]",
    "media": "Wifi",
    "status": "Вкл",
    "enabled": true
  },
  "amenity_main_4": {
    "block": "6. Удобства",
    "key": "amenity_main_4",
    "desc": "Основное удобство 4 на главной",
    "ru": "Кондиционеры во всех 4 спальнях",
    "en": "Air conditioning in all 4 bedrooms",
    "tr": "4 yatak odasının tamamında klima mevcuttur.",
    "media": "Wind",
    "status": "Вкл",
    "enabled": true
  },
  "amenity_main_5": {
    "block": "6. Удобства",
    "key": "amenity_main_5",
    "desc": "Основное удобство 5 на главной",
    "ru": "Полноценная кухня Beko",
    "en": "Beko full kitchen",
    "tr": "Beko tam donanımlı mutfak",
    "media": "Utensils",
    "status": "Вкл",
    "enabled": true
  },
  "amenity_main_6": {
    "block": "6. Удобства",
    "key": "amenity_main_6",
    "desc": "Основное удобство 6 на главной",
    "ru": "Бесплатная парковка на 2 авто",
    "en": "Free parking for 2 cars",
    "tr": "2 araç için ücretsiz park yeri",
    "media": "Car",
    "status": "Вкл",
    "enabled": true
  },
  "amenity_main_7": {
    "block": "6. Удобства",
    "key": "amenity_main_7",
    "desc": "Основное удобство 7 на главной",
    "ru": "Зона BBQ и обеденный стол на 8 мест",
    "en": "BBQ area and dining table for 8 people",
    "tr": "Barbekü alanı ve 8 kişilik yemek masası",
    "media": "Flame",
    "status": "Вкл",
    "enabled": true
  },
  "amenity_main_8": {
    "block": "6. Удобства",
    "key": "amenity_main_8",
    "desc": "Основное удобство 8 на главной",
    "ru": "Стиральная машина на каждом этаже",
    "en": "Washing machine on each floor",
    "tr": "Her katta çamaşır makinesi bulunmaktadır.",
    "media": "WashingMachine",
    "status": "Вкл",
    "enabled": true
  },
  "amenity_main_9": {
    "block": "6. Удобства",
    "key": "amenity_main_9",
    "desc": "Основное удобство 9 на главной",
    "ru": "Доступная среда и подъемник",
    "en": "Accessible environment and lift",
    "tr": "Erişilebilir ortam ve asansör",
    "media": "Shield",
    "status": "Вкл",
    "enabled": true
  },
  "amenity_main_10": {
    "block": "6. Удобства",
    "key": "amenity_main_10",
    "desc": "Основное удобство 10 на главной",
    "ru": "Видеонаблюдение и датчики дыма",
    "en": "Video surveillance and smoke detectors",
    "tr": "Video gözetimi ve duman dedektörleri",
    "media": "ShieldCheck",
    "status": "Вкл",
    "enabled": true
  },
  "amenity_cat1_title": {
    "block": "6. Удобства",
    "key": "amenity_cat1_title",
    "desc": "Модальное окно: Категория 1 Заголовок",
    "ru": "Виды и природа",
    "en": "Species and nature",
    "tr": "Türler ve doğa",
    "media": "Mountain",
    "status": "Вкл",
    "enabled": true
  },
  "amenity_cat1_item1": {
    "block": "6. Удобства",
    "key": "amenity_cat1_item1",
    "desc": "Модальное окно: Категория 1 Пункт 1",
    "ru": "Панорамный вид на горы Дальяна",
    "en": "Panoramic view of the Dalyan mountains",
    "tr": "Dalyan dağlarının panoramik manzarası",
    "media": "Check",
    "status": "Вкл",
    "enabled": true
  },
  "amenity_cat1_item2": {
    "block": "6. Удобства",
    "key": "amenity_cat1_item2",
    "desc": "Модальное окно: Категория 1 Пункт 2",
    "ru": "Вид на реку и сад",
    "en": "View of the river and garden",
    "tr": "Nehir ve bahçe manzarası",
    "media": "Check",
    "status": "Вкл",
    "enabled": true
  },
  "amenity_cat1_item3": {
    "block": "6. Удобства",
    "key": "amenity_cat1_item3",
    "desc": "Модальное окно: Категория 1 Пункт 3",
    "ru": "Близость набережной Дальяна [400 м]",
    "en": "Proximity to Dalyan's promenade [400 m]",
    "tr": "Dalyan sahil yoluna yakınlık [400 m]",
    "media": "Check",
    "status": "Вкл",
    "enabled": true
  },
  "amenity_cat2_title": {
    "block": "6. Удобства",
    "key": "amenity_cat2_title",
    "desc": "Модальное окно: Категория 2 Заголовок",
    "ru": "Бассейн и спа",
    "en": "Pool and spa",
    "tr": "Havuz ve spa",
    "media": "Waves",
    "status": "Вкл",
    "enabled": true
  },
  "amenity_cat2_item1": {
    "block": "6. Удобства",
    "key": "amenity_cat2_item1",
    "desc": "Модальное окно: Категория 2 Пункт 1",
    "ru": "Приватный бассейн с соленой водой 4×9 м [глубина 1.5м]",
    "en": "Private salt water pool 4x9m [depth 1.5m]",
    "tr": "Özel tuzlu su havuzu 4x9m [derinlik 1.5m]",
    "media": "Check",
    "status": "Вкл",
    "enabled": true
  },
  "amenity_cat2_item2": {
    "block": "6. Удобства",
    "key": "amenity_cat2_item2",
    "desc": "Модальное окно: Категория 2 Пункт 2",
    "ru": "Шезлонги и зона для загара",
    "en": "Sun loungers and sunbathing area",
    "tr": "Şezlonglar ve güneşlenme alanı",
    "media": "Check",
    "status": "Вкл",
    "enabled": true
  },
  "amenity_cat2_item3": {
    "block": "6. Удобства",
    "key": "amenity_cat2_item3",
    "desc": "Модальное окно: Категория 2 Пункт 3",
    "ru": "Летний душ у бассейна",
    "en": "Summer shower by the pool",
    "tr": "Havuz başında yaz duşu",
    "media": "Check",
    "status": "Вкл",
    "enabled": true
  },
  "amenity_cat2_item4": {
    "block": "6. Удобства",
    "key": "amenity_cat2_item4",
    "desc": "Модальное окно: Категория 2 Пункт 4",
    "ru": "Уличное джакузи на 4 персоны [10:00-17:00, 15 мин каждые 45 мин]",
    "en": "Outdoor Jacuzzi for 4 persons [10:00-17:00, 15 min every 45 min]",
    "tr": "4 kişilik açık hava jakuzisi [10:00-17:00, her 45 dakikada bir 15 dakika]",
    "media": "Check",
    "status": "Вкл",
    "enabled": true
  },
  "amenity_cat3_title": {
    "block": "6. Удобства",
    "key": "amenity_cat3_title",
    "desc": "Модальное окно: Категория 3 Заголовок",
    "ru": "Кухня и столовая",
    "en": "Kitchen and dining room",
    "tr": "Mutfak ve yemek odası",
    "media": "Utensils",
    "status": "Вкл",
    "enabled": true
  },
  "amenity_cat3_item1": {
    "block": "6. Удобства",
    "key": "amenity_cat3_item1",
    "desc": "Модальное окно: Категория 3 Пункт 1",
    "ru": "Большой двухкамерный холодильник Beko",
    "en": "Large two-chamber refrigerator Beko",
    "tr": "Büyük boy iki bölmeli Beko buzdolabı",
    "media": "Check",
    "status": "Вкл",
    "enabled": true
  },
  "amenity_cat3_item2": {
    "block": "6. Удобства",
    "key": "amenity_cat3_item2",
    "desc": "Модальное окно: Категория 3 Пункт 2",
    "ru": "Посудомоечная машина",
    "en": "Dishwasher",
    "tr": "Bulaşık makinesi",
    "media": "Check",
    "status": "Вкл",
    "enabled": true
  },
  "amenity_cat3_item3": {
    "block": "6. Удобства",
    "key": "amenity_cat3_item3",
    "desc": "Модальное окно: Категория 3 Пункт 3",
    "ru": "Духовой шкаф Beko и варочная панель",
    "en": "Beko oven and hob",
    "tr": "Beko fırın ve ocak",
    "media": "Check",
    "status": "Вкл",
    "enabled": true
  },
  "amenity_cat3_item4": {
    "block": "6. Удобства",
    "key": "amenity_cat3_item4",
    "desc": "Модальное окно: Категория 3 Пункт 4",
    "ru": "Кофемашина эспрессо и чайник",
    "en": "Espresso coffee machine and kettle",
    "tr": "Espresso kahve makinesi ve su ısıtıcısı",
    "media": "Check",
    "status": "Вкл",
    "enabled": true
  },
  "amenity_cat3_item5": {
    "block": "6. Удобства",
    "key": "amenity_cat3_item5",
    "desc": "Модальное окно: Категория 3 Пункт 5",
    "ru": "Полный комплект посуды и бокалов для вина",
    "en": "A complete set of tableware and wine glasses",
    "tr": "Komple bir yemek takımı ve şarap kadehleri ​​seti.",
    "media": "Check",
    "status": "Вкл",
    "enabled": true
  },
  "amenity_cat4_title": {
    "block": "6. Удобства",
    "key": "amenity_cat4_title",
    "desc": "Модальное окно: Категория 4 Заголовок",
    "ru": "Комфорт и связь",
    "en": "Comfort and communication",
    "tr": "Konfor ve iletişim",
    "media": "Wifi",
    "status": "Вкл",
    "enabled": true
  },
  "amenity_cat4_item1": {
    "block": "6. Удобства",
    "key": "amenity_cat4_item1",
    "desc": "Модальное окно: Категория 4 Пункт 1",
    "ru": "Скоростной оптоволоконный Wi-Fi",
    "en": "High-speed fiber-optic Wi-Fi",
    "tr": "Yüksek hızlı fiber optik Wi-Fi",
    "media": "Check",
    "status": "Вкл",
    "enabled": true
  },
  "amenity_cat4_item2": {
    "block": "6. Удобства",
    "key": "amenity_cat4_item2",
    "desc": "Модальное окно: Категория 4 Пункт 2",
    "ru": "Сплит-системы кондиционирования во всех спальнях",
    "en": "Split-system air conditioning in all bedrooms",
    "tr": "Tüm yatak odalarında split sistem klima mevcuttur.",
    "media": "Check",
    "status": "Вкл",
    "enabled": true
  },
  "amenity_cat4_item3": {
    "block": "6. Удобства",
    "key": "amenity_cat4_item3",
    "desc": "Модальное окно: Категория 4 Пункт 3",
    "ru": "Smart TV 55 дюймов с Netflix и YouTube",
    "en": "55-inch Smart TV with Netflix and YouTube",
    "tr": "Netflix ve YouTube özellikli 55 inçlik Akıllı TV",
    "media": "Check",
    "status": "Вкл",
    "enabled": true
  },
  "amenity_cat4_item4": {
    "block": "6. Удобства",
    "key": "amenity_cat4_item4",
    "desc": "Модальное окно: Категория 4 Пункт 4",
    "ru": "Обеденная зона на воздухе на 8 мест и крыльцо",
    "en": "8-seat outdoor dining area and porch",
    "tr": "8 kişilik açık hava yemek alanı ve veranda",
    "media": "Check",
    "status": "Вкл",
    "enabled": true
  },
  "amenity_cat5_title": {
    "block": "6. Удобства",
    "key": "amenity_cat5_title",
    "desc": "Модальное окно: Категория 5 Заголовок",
    "ru": "Безопасность дома",
    "en": "Home safety",
    "tr": "Ev güvenliği",
    "media": "Shield",
    "status": "Вкл",
    "enabled": true
  },
  "amenity_cat5_item1": {
    "block": "6. Удобства",
    "key": "amenity_cat5_item1",
    "desc": "Модальное окно: Категория 5 Пункт 1",
    "ru": "Огороженная приватная территория и автоматическое освещение",
    "en": "Fenced private area and automatic lighting",
    "tr": "Çitlerle çevrili özel alan ve otomatik aydınlatma",
    "media": "Check",
    "status": "Вкл",
    "enabled": true
  },
  "amenity_cat5_item2": {
    "block": "6. Удобства",
    "key": "amenity_cat5_item2",
    "desc": "Модальное окно: Категория 5 Пункт 2",
    "ru": "Система наружного видеонаблюдения по периметру",
    "en": "Outdoor perimeter video surveillance system",
    "tr": "Dış mekan çevre video gözetim sistemi",
    "media": "Check",
    "status": "Вкл",
    "enabled": true
  },
  "amenity_cat5_item3": {
    "block": "6. Удобства",
    "key": "amenity_cat5_item3",
    "desc": "Модальное окно: Категория 5 Пункт 3",
    "ru": "Датчики дыма и аптечка первой помощи",
    "en": "Smoke detectors and first aid kit",
    "tr": "Duman dedektörleri ve ilk yardım çantası",
    "media": "Check",
    "status": "Вкл",
    "enabled": true
  },
  "amenity_cat5_item4": {
    "block": "6. Удобства",
    "key": "amenity_cat5_item4",
    "desc": "Модальное окно: Категория 5 Пункт 4",
    "ru": "Огнетушитель",
    "en": "Fire extinguisher",
    "tr": "Yangın söndürücü",
    "media": "Check",
    "status": "Вкл",
    "enabled": true
  },
  "reviews_score_header": {
    "block": "7. Отзывы",
    "key": "reviews_score_header",
    "desc": "Заголовок рейтинга в блоке отзывов",
    "ru": "4.98 • Рейтинг гостей на основе 48 отзывов",
    "en": "4.98 • Guest rating based on 48 reviews",
    "tr": "4,98 • 48 değerlendirmeye göre misafir puanı",
    "media": "Star",
    "status": "Вкл",
    "enabled": true
  },
  "review_cat_1": {
    "block": "7. Отзывы",
    "key": "review_cat_1",
    "desc": "Критерий 1: Чистота",
    "ru": "Чистота",
    "en": "Purity",
    "tr": "Saflık",
    "media": "5.0|100",
    "status": "Вкл",
    "enabled": true
  },
  "review_cat_2": {
    "block": "7. Отзывы",
    "key": "review_cat_2",
    "desc": "Критерий 2: Точность описания",
    "ru": "Точность описания",
    "en": "Accuracy of description",
    "tr": "Tanımın doğruluğu",
    "media": "4.9|98",
    "status": "Вкл",
    "enabled": true
  },
  "review_cat_3": {
    "block": "7. Отзывы",
    "key": "review_cat_3",
    "desc": "Критерий 3: Общение с хозяином",
    "ru": "Общение с хозяином",
    "en": "Communication with the owner",
    "tr": "Mülk sahibiyle iletişim",
    "media": "5.0|100",
    "status": "Вкл",
    "enabled": true
  },
  "review_cat_4": {
    "block": "7. Отзывы",
    "key": "review_cat_4",
    "desc": "Критерий 4: Расположение",
    "ru": "Расположение",
    "en": "Location",
    "tr": "Konum",
    "media": "4.9|98",
    "status": "Вкл",
    "enabled": true
  },
  "review_cat_5": {
    "block": "7. Отзывы",
    "key": "review_cat_5",
    "desc": "Критерий 5: Прибытие и заезд",
    "ru": "Прибытие и заезд",
    "en": "Arrival and check-in",
    "tr": "Varış ve giriş işlemleri",
    "media": "5.0|100",
    "status": "Вкл",
    "enabled": true
  },
  "review_cat_6": {
    "block": "7. Отзывы",
    "key": "review_cat_6",
    "desc": "Критерий 6: Цена / качество",
    "ru": "Соотношение цена/качество",
    "en": "Price/quality ratio",
    "tr": "Fiyat/kalite oranı",
    "media": "4.9|98",
    "status": "Вкл",
    "enabled": true
  },
  "review_1_author": {
    "block": "7. Отзывы",
    "key": "review_1_author",
    "desc": "Отзыв 1: Автор и дата",
    "ru": "Елена Смирнова • Август 2026",
    "en": "Elena Smirnova • August 2026",
    "tr": "Elena Smirnova • Ağustos 2026",
    "media": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120",
    "status": "Вкл",
    "enabled": true
  },
  "review_1_text": {
    "block": "7. Отзывы",
    "key": "review_1_text",
    "desc": "Отзыв 1: Текст отзыва",
    "ru": "Потрясающая вилла! Вид на горы просто захватывает дух, бассейн с соленой водой чистейший, джакузи великолепно расслабляет. Алексей был на связи 24/7, помог организовать незабываемый круиз на лодке по озеру Кёйджегиз. Обязательно вернемся!",
    "en": "The villa is stunning! The mountain views are breathtaking, the saltwater pool is crystal clear, and the jacuzzi is incredibly relaxing. Alexey was available 24/7 and helped organize an unforgettable boat cruise on Lake Köyceğiz. We'll definitely be back!",
    "tr": "Villa muhteşem! Dağ manzarası nefes kesici, tuzlu su havuzu kristal berraklığında ve jakuzi inanılmaz derecede rahatlatıcı. Alexey 7/24 ulaşılabilir durumdaydı ve Köyceğiz Gölü'nde unutulmaz bir tekne turu organize etmemize yardımcı oldu. Kesinlikle geri döneceğiz!",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "review_2_author": {
    "block": "7. Отзывы",
    "key": "review_2_author",
    "desc": "Отзыв 2: Автор и дата",
    "ru": "Markus Webber • Июль 2026",
    "en": "Markus Webber • July 2026",
    "tr": "Markus Webber • Temmuz 2026",
    "media": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120",
    "status": "Вкл",
    "enabled": true
  },
  "review_2_text": {
    "block": "7. Отзывы",
    "key": "review_2_text",
    "desc": "Отзыв 2: Текст отзыва",
    "ru": "Outstanding hospitality and pristine villa in the heart of Dalyan. Fast Wi-Fi, 4 spacious bedrooms, and peaceful neighborhood. Aleksei is truly a top Superhost!",
    "en": "Outstanding hospitality and pristine villa in the heart of Dalyan. Fast Wi-Fi, 4 spacious bedrooms, and peaceful neighborhood. Aleksei is truly a top Superhost!",
    "tr": "Dalyan'ın kalbinde olağanüstü misafirperverlik ve tertemiz bir villa. Hızlı Wi-Fi, 4 geniş yatak odası ve huzurlu bir mahalle. Aleksei gerçekten de mükemmel bir ev sahibi!",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "review_3_author": {
    "block": "7. Отзывы",
    "key": "review_3_author",
    "desc": "Отзыв 3: Автор и дата",
    "ru": "Ahmet Yılmaz • Июнь 2026",
    "en": "Ahmet Yılmaz • June 2026",
    "tr": "Ahmet Yılmaz • Июнь 2026",
    "media": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120",
    "status": "Вкл",
    "enabled": true
  },
  "review_3_text": {
    "block": "7. Отзывы",
    "key": "review_3_text",
    "desc": "Отзыв 3: Текст отзыва",
    "ru": "Dalyan'da kaldığımız en konforlu villa. 4 banyolu 4 yatak odası ailemiz için mükemmeldi. Bahçe ve havuz bakımı harikaydı, teşekkürler Aleksei!",
    "en": "The most comfortable villa we stayed in Dalyan. Four bedrooms with four bathrooms were perfect for our family. The garden and pool maintenance was fantastic, thank you Aleksei!",
    "tr": "Dalyan'da kaldığımız en konforlu villa. 4 banyolu 4 yatak odası ailemiz için mükemmeldi. Bahçe ve havuz bakımı harikaydı, teşekkürler Aleksei!",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "review_4_author": {
    "block": "7. Отзывы",
    "key": "review_4_author",
    "desc": "Отзыв 4: Автор и дата",
    "ru": "Дмитрий и Анна • Май 2026",
    "en": "Dmitry and Anna • May 2026",
    "tr": "Dmitry ve Anna • Mayıs 2026",
    "media": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120",
    "status": "Вкл",
    "enabled": true
  },
  "review_4_text": {
    "block": "7. Отзывы",
    "key": "review_4_text",
    "desc": "Отзыв 4: Текст отзыва",
    "ru": "Идеально для семейного отдыха до 10 человек. Закрытая территория, 250 метров до центра Дальяна, тишина. Видео-гид от Алексея открыл нам секретные пляжи и отличные рыбные рестораны.",
    "en": "Ideal for a family vacation of up to 10 people. Gated area, 250 meters from the center of Dalyan, quiet. Alexey's video guide revealed secret beaches and excellent seafood restaurants.",
    "tr": "10 kişiye kadar olan aileler için ideal bir tatil yeri. Güvenlikli site içerisinde, Dalyan merkezine 250 metre mesafede, sakin bir konumda. Alexey'in video rehberi gizli plajları ve mükemmel deniz ürünleri restoranlarını ortaya çıkardı.",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "location_title": {
    "block": "8. Локация",
    "key": "location_title",
    "desc": "Заголовок секции локации",
    "ru": "Расположение: Дальян, Ортаджа, Мугла, Турция",
    "en": "Location: Dalyan, Ortaca, Mugla, Turkey",
    "tr": "Konum: Dalyan, Ortaca, Muğla, Türkiye",
    "media": "MapPin",
    "status": "Вкл",
    "enabled": true
  },
  "location_desc": {
    "block": "8. Локация",
    "key": "location_desc",
    "desc": "Подробный текст об окрестностях Дальяна",
    "ru": "Вилла Turaman находится в самом центре Дальяна: всего 250 метров до пешеходной улицы, 400 метров до речной набережной, 350 метров до ресторана La Boheme Dalyan. Песчаный пляж Изтузу - 11 км [15 минут на машине или лодке], аэропорт Даламан - 30 км. В пешей доступности древний город Каунос и Ликийские гробницы.",
    "en": "Villa Turaman is located in the heart of Dalyan: just 250 meters from the pedestrian street, 400 meters from the river promenade, and 350 meters from the La Boheme Dalyan restaurant. Iztuzu Beach is 11 km away (15 minutes by car or boat), and Dalaman Airport is 30 km away. The ancient city of Kaunos and the Lycian tombs are within walking distance.",
    "tr": "Villa Turaman, Dalyan'ın kalbinde yer almaktadır: yaya caddesine sadece 250 metre, nehir kıyısına 400 metre ve La Boheme Dalyan restoranına 350 metre mesafededir. İztuzu Plajı 11 km (araba veya tekneyle 15 dakika) ve Dalyan Havalimanı 30 km uzaklıktadır. Kaunos antik kenti ve Likya mezarları yürüme mesafesindedir.",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "location_badge": {
    "block": "8. Локация",
    "key": "location_badge",
    "desc": "Текст плашки GPS и расстояния до аэропорта",
    "ru": "GPS: 36.8336° N, 28.6439° E • 250м до центра • 11 км до пляжа Изтузу • 30 км до DLM",
    "en": "GPS: 36.8336° N, 28.6439° E • 250 m to the center • 11 km to Iztuzu beach • 30 km to DLM",
    "tr": "GPS: 36.8336° K, 28.6439° D • Merkeze 250 m • İztuzu plajına 11 km • DLM'ye 30 km",
    "media": "Navigation",
    "status": "Вкл",
    "enabled": true
  },
  "location_image": {
    "block": "8. Локация",
    "key": "location_image",
    "desc": "Панорамная фотография окрестностей",
    "ru": "Фото природы Дальяна",
    "en": "Photos of Dalyan's natural surroundings",
    "tr": "Dalyan'ın doğal çevresine ait fotoğraflar",
    "media": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200",
    "status": "Вкл",
    "enabled": true
  },
  "host_card_title": {
    "block": "9. Хозяин",
    "key": "host_card_title",
    "desc": "Заголовок карточки владельца",
    "ru": "Хозяин: Алексей Знаменский",
    "en": "Owner: Alexey Znamensky",
    "tr": "Sahibi: Alexey Znamensky",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "host_card_subtitle": {
    "block": "9. Хозяин",
    "key": "host_card_subtitle",
    "desc": "Подзаголовок статуса суперхозяина",
    "ru": "Суперхозяин на Airbnb • Яхтсмен на пенсии • Живет в Мармарисе",
    "en": "Airbnb Superhost • Retired Sailor • Lives in Marmaris",
    "tr": "Airbnb Süper Ev Sahibi • Emekli Denizci • Marmaris'te yaşıyor",
    "media": "Award",
    "status": "Вкл",
    "enabled": true
  },
  "host_card_verified": {
    "block": "9. Хозяин",
    "key": "host_card_verified",
    "desc": "Бейдж подтверждения личности",
    "ru": "Личность подтверждена • Девиз: «Хочешь сделать хорошо - сделай сам»",
    "en": "Identity verified • Motto: “If you want something done well, do it yourself”",
    "tr": "Kimlik doğrulandı • Slogan: “Bir işin iyi yapılmasını istiyorsanız, kendiniz yapın”",
    "media": "ShieldCheck",
    "status": "Вкл",
    "enabled": true
  },
  "host_card_response_time": {
    "block": "9. Хозяин",
    "key": "host_card_response_time",
    "desc": "Бейдж времени ответа на сообщения",
    "ru": "Время ответа: в течение часа • Языки: RU, EN, TR",
    "en": "Response time: within an hour • Languages: RU, EN, TR",
    "tr": "Yanıt süresi: bir saat içinde • Diller: RU, EN, TR",
    "media": "Clock",
    "status": "Вкл",
    "enabled": true
  },
  "host_card_languages": {
    "block": "9. Хозяин",
    "key": "host_card_languages",
    "desc": "Заголовок языков общения",
    "ru": "Интересы: Велоспорт, Парусный спорт, Природа • Мечта: Португалия",
    "en": "Interests: Cycling, Sailing, Nature • Dream: Portugal",
    "tr": "İlgi Alanları: Bisiklet, Yelken, Doğa • Hayal: Portekiz",
    "media": "Globe2",
    "status": "Вкл",
    "enabled": true
  },
  "host_card_help_text": {
    "block": "9. Хозяин",
    "key": "host_card_help_text",
    "desc": "Описание помощи гостям",
    "ru": "Штампы путешествий: Дубай [3 поездки], Абу-Даби [март 2026 г.]. Помощь в организации трансфера, аренде авто и экскурсий.",
    "en": "Travel stamps: Dubai [3 trips], Abu Dhabi [March 2026]. Assistance with organizing transfers, car rentals, and excursions.",
    "tr": "Seyahat damgaları: Dubai [3 gezi], Abu Dhabi [Mart 2026]. Transferlerin, araç kiralamanın ve gezilerin organize edilmesinde yardım.",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "host_card_btn": {
    "block": "9. Хозяин",
    "key": "host_card_btn",
    "desc": "Текст кнопки связи с хозяином",
    "ru": "Написать хозяину",
    "en": "Write to the owner",
    "tr": "Sahibine yazın.",
    "media": "MessageCircle",
    "status": "Вкл",
    "enabled": true
  },
  "host_card_credo": {
    "block": "9. Хозяин",
    "key": "host_card_credo",
    "desc": "Жизненное кредо суперхозяина",
    "ru": "«Хочешь сделать хорошо - сделай сам»",
    "en": "\"If you want something done right, do it yourself.\"",
    "tr": "\"Bir işin doğru yapılmasını istiyorsanız, kendiniz yapın.\"",
    "media": "Quote",
    "status": "Вкл",
    "enabled": true
  },
  "host_card_dream": {
    "block": "9. Хозяин",
    "key": "host_card_dream",
    "desc": "Мечта и базирование",
    "ru": "База: Мармарис • Мечта: Португалия и Атлантический океан",
    "en": "Base: Marmaris • Dream: Portugal and the Atlantic Ocean",
    "tr": "Üs:Marmaris • Rüya: Portekiz ve Atlas Okyanusu",
    "media": "Compass",
    "status": "Вкл",
    "enabled": true
  },
  "host_card_hobbies": {
    "block": "9. Хозяин",
    "key": "host_card_hobbies",
    "desc": "Хобби и спорт суперхозяина",
    "ru": "Велоспорт, Парусный спорт, Живая природа Дальяна",
    "en": "Cycling, Sailing, Dalyan Wildlife",
    "tr": "Bisiklet, Yelken, Dalyan Vahşi Yaşamı",
    "media": "Bike",
    "status": "Вкл",
    "enabled": true
  },
  "host_card_travel": {
    "block": "9. Хозяин",
    "key": "host_card_travel",
    "desc": "Штампы путешествий",
    "ru": "Дубай [3 поездки], Абу-Даби [март 2026 г.]",
    "en": "Dubai [3 trips], Abu Dhabi [March 2026]",
    "tr": "Dubai [3 gezi], Abu Dabi [Mart 2026]",
    "media": "PlaneTakeoff",
    "status": "Вкл",
    "enabled": true
  },
  "host_card_tax": {
    "block": "9. Хозяин",
    "key": "host_card_tax",
    "desc": "Официальные налоговые реквизиты",
    "ru": "Официальный налогоплательщик: Ortaca Vergi Dairesi, VKN: 9991120181",
    "en": "Official taxpayer: Ortaca Vergi Dairesi, VKN: 9991120181",
    "tr": "Resmi vergi mükellefi: Ortaca Vergi Dairesi, VKN: 9991120181",
    "media": "FileCheck",
    "status": "Вкл",
    "enabled": true
  },
  "landmarks_title": {
    "block": "10. Ориентиры",
    "key": "landmarks_title",
    "desc": "Заголовок секции ориентиров",
    "ru": "14 географических ориентиров Дальяна",
    "en": "14 Geographical Landmarks of Dalyan",
    "tr": "Dalyan'ın 14 Coğrafi Özelliği",
    "media": "MapPin",
    "status": "Вкл",
    "enabled": true
  },
  "landmarks_subtitle": {
    "block": "10. Ориентиры",
    "key": "landmarks_subtitle",
    "desc": "Подзаголовок секции ориентиров",
    "ru": "Точные расстояния и тайминг от виллы • Пешеходная доступность центра и заповедная природа",
    "en": "Exact distances and timings from the villa • Walking distance to the center and protected nature",
    "tr": "Villaya olan kesin mesafeler ve süreler • Merkeze ve koruma altındaki doğaya yürüme mesafesinde",
    "media": "Navigation",
    "status": "Вкл",
    "enabled": true
  },
  "landmarks_address": {
    "block": "10. Ориентиры",
    "key": "landmarks_address",
    "desc": "Официальный адрес виллы для навигатора",
    "ru": "Dalyan, Rodoslu Yaşar Sünger Sk, NO 28/2, 48600 Ortaca / Muğla, Turkey",
    "en": "Dalyan, Rodoslu Yaşar Sünger Sk, NO 28/2, 48600 Ortaca / Muğla, Turkey",
    "tr": "Dalyan, Rodoslu Yaşar Sünger Sk, NO 28/2, 48600 Ortaca / Muğla, Turkey",
    "media": "MapPin",
    "status": "Вкл",
    "enabled": true
  },
  "landmarks_maps_url": {
    "block": "10. Ориентиры",
    "key": "landmarks_maps_url",
    "desc": "Прямая ссылка на геолокацию в Google Maps",
    "ru": "https://maps.app.goo.gl/tPgCjCwz4pzq28pE9",
    "en": "https://maps.app.goo.gl/tPgCjCwz4pzq28pE9",
    "tr": "https://maps.app.goo.gl/tPgCjCwz4pzq28pE9",
    "media": "https://maps.app.goo.gl/tPgCjCwz4pzq28pE9",
    "status": "Вкл",
    "enabled": true
  },
  "landmarks_gps": {
    "block": "10. Ориентиры",
    "key": "landmarks_gps",
    "desc": "Координаты GPS виллы",
    "ru": "36.8336° N, 28.6439° E",
    "en": "36.8336° N, 28.6439° E",
    "tr": "36.8336° K, 28.6439° D",
    "media": "Compass",
    "status": "Вкл",
    "enabled": true
  },
  "landmark_1": {
    "block": "10. Ориентиры",
    "key": "landmark_1",
    "desc": "Ориентир 1: Пешеходный центр Дальяна",
    "ru": "Пешеходный центр Дальяна: главная улица, рестораны, кофейни, аптеки, банкоматы и сувенирные лавки",
    "en": "Dalyan's pedestrian center: the main street, restaurants, coffee shops, pharmacies, ATMs, and souvenir shops",
    "tr": "Dalyan'ın yaya merkezi: ana cadde, restoranlar, kafeler, eczaneler, ATM'ler ve hediyelik eşya dükkanları.",
    "media": "250 м|3 мин пешком|walk|В шаговой доступности|Footprints",
    "status": "Вкл",
    "enabled": true
  },
  "landmark_2": {
    "block": "10. Ориентиры",
    "key": "landmark_2",
    "desc": "Ориентир 2: Речная набережная и причал",
    "ru": "Речная набережная и центральный причал речных лодок-такси и экскурсионных катеров",
    "en": "The river embankment and the central pier for river taxi boats and excursion boats",
    "tr": "Nehir kıyısı ve nehir taksi tekneleri ile gezi tekneleri için merkezi iskele.",
    "media": "400 м|5 мин пешком|walk|Река Дальян|Compass",
    "status": "Вкл",
    "enabled": true
  },
  "landmark_3": {
    "block": "10. Ориентиры",
    "key": "landmark_3",
    "desc": "Ориентир 3: Ресторан La Boheme Dalyan Bistro",
    "ru": "Ресторан авторской кухни La Boheme Dalyan Bistro: средиземноморская и европейская кухня",
    "en": "La Boheme Dalyan Bistro, a signature restaurant serving Mediterranean and European cuisine",
    "tr": "La Boheme Dalyan Bistro, Akdeniz ve Avrupa mutfağından yemekler sunan, kendine özgü bir restoran.",
    "media": "350 м|4 мин пешком|food|Гастрономия|Utensils",
    "status": "Вкл",
    "enabled": true
  },
  "landmark_4": {
    "block": "10. Ориентиры",
    "key": "landmark_4",
    "desc": "Ориентир 4: Ресторан Çiçek Restoran",
    "ru": "Традиционный эгейский рыбный ресторан Çiçek Restoran: свежайшие морепродукты и домашние мезе",
    "en": "Traditional Aegean fish restaurant Çiçek Restoran: the freshest seafood and homemade mezes",
    "tr": "Geleneksel Ege balık restoranı Çiçek Restoran: En taze deniz ürünleri ve ev yapımı mezeler.",
    "media": "500 м|6 мин пешком|food|Свежая рыба|Utensils",
    "status": "Вкл",
    "enabled": true
  },
  "landmark_5": {
    "block": "10. Ориентиры",
    "key": "landmark_5",
    "desc": "Ориентир 5: Субботний фермерский рынок",
    "ru": "Субботний фермерский рынок Дальяна: деревенские сыры, оливки, свежие фрукты, специи и гранатовый сок",
    "en": "Dalyan's Saturday Farmers' Market: Country cheeses, olives, fresh fruit, spices, and pomegranate juice",
    "tr": "Dalyan'ın Cumartesi Çiftçi Pazarı: Köy peynirleri, zeytinler, taze meyveler, baharatlar ve nar suyu.",
    "media": "600 м|7 мин пешком|walk|Суббота|ShoppingBag",
    "status": "Вкл",
    "enabled": true
  },
  "landmark_6": {
    "block": "10. Ориентиры",
    "key": "landmark_6",
    "desc": "Ориентир 6: Ликийские скальные гробницы",
    "ru": "Ликийские скальные гробницы карийских царей IV века до н.э., высеченные в скале, с вечерней иллюминацией",
    "en": "Lycian rock tombs of the Carian kings from the 4th century BC, carved into the rock, with evening illumination",
    "tr": "MÖ 4. yüzyıla ait Karya krallarının kayaya oyulmuş Likya kaya mezarları, akşam aydınlatmasıyla birlikte.",
    "media": "450 м|Прямая видимость|nature|UNESCO Heritage|Mountain",
    "status": "Вкл",
    "enabled": true
  },
  "landmark_7": {
    "block": "10. Ориентиры",
    "key": "landmark_7",
    "desc": "Ориентир 7: Античный город Каунос",
    "ru": "Античный город Каунос: амфитеатр, римские термы, агора, базилика и акрополь на вершине холма",
    "en": "The ancient city of Kaunos: an amphitheater, Roman baths, agora, basilica and acropolis on a hilltop",
    "tr": "Kaunos antik kenti: bir tepe üzerinde yer alan amfi tiyatro, Roma hamamları, agora, bazilika ve akropolis.",
    "media": "1.5 км|Лодка + 15 мин|nature|Античная история|Compass",
    "status": "Вкл",
    "enabled": true
  },
  "landmark_8": {
    "block": "10. Ориентиры",
    "key": "landmark_8",
    "desc": "Ориентир 8: Источники и грязи Султание",
    "ru": "Радоновые термальные источники и целебные минеральные грязи Султание на берегу озера Кёйджегиз",
    "en": "Sultaniye's radon thermal springs and healing mineral mud on the shores of Lake Koycegiz",
    "tr": "Köyceğiz Gölü kıyısındaki Sultaniye'nin radonlu termal kaynakları ve şifalı mineral çamuru.",
    "media": "4 км лодка / 12 км авто|15-20 мин|nature|Оздоровление|Waves",
    "status": "Вкл",
    "enabled": true
  },
  "landmark_9": {
    "block": "10. Ориентиры",
    "key": "landmark_9",
    "desc": "Ориентир 9: Песчаный черепаший пляж Изтузу",
    "ru": "Заповедный песчаный черепаший пляж Изтузу: золотой песок 4.5 км, место гнездования черепах Caretta-Caretta",
    "en": "Iztuzu Turtle Beach: 4.5 km of golden sand, nesting site for Caretta-Caretta turtles",
    "tr": "İztuzu Kaplumbağa Plajı: 4,5 km uzunluğunda altın kumlu plaj, Caretta-Caretta kaplumbağalarının yuvalama alanı.",
    "media": "11 км|15 мин авто / 35 мин лодка|beach|Заповедник|Sun",
    "status": "Вкл",
    "enabled": true
  },
  "landmark_10": {
    "block": "10. Ориентиры",
    "key": "landmark_10",
    "desc": "Ориентир 10: Пресноводное озеро Кёйджегиз",
    "ru": "Пресноводное озеро Кёйджегиз: живописные заливы, водные прогулки на катерах, сапбординг и рыбалка",
    "en": "Freshwater Lake Köyceğiz: picturesque bays, boat rides, SUP boarding, and fishing",
    "tr": "Köyceğiz Tatlı Su Gölü: Manzaralı koylar, tekne gezileri, SUP (stand-up paddleboarding) ve balıkçılık.",
    "media": "5 км|10 мин авто / 25 мин катер|nature|Водный спорт|Waves",
    "status": "Вкл",
    "enabled": true
  },
  "landmark_11": {
    "block": "10. Ориентиры",
    "key": "landmark_11",
    "desc": "Ориентир 11: Смотровая площадка на горе Радар",
    "ru": "Смотровая площадка на горе Радар: круговая панорама 360° на дельту реки Дальян, косу Изтузу и море",
    "en": "Radar Mountain Viewpoint: 360° panoramic views of the Dalyan River Delta, Iztuzu Spit, and the sea",
    "tr": "Radar Dağı Gözlem Noktası: Dalyan Nehri Deltası, İztuzu Burnu ve denizin 360° panoramik manzarası.",
    "media": "8 км|20 мин на авто|nature|Панорама 360°|Eye",
    "status": "Вкл",
    "enabled": true
  },
  "landmark_12": {
    "block": "10. Ориентиры",
    "key": "landmark_12",
    "desc": "Ориентир 12: Центр реабилитации черепах DEKAMER",
    "ru": "Научно-исследовательский и реабилитационный центр спасения морских черепах DEKAMER на пляже Изтузу",
    "en": "DEKAMER Sea Turtle Rescue and Rehabilitation Center at Iztuzu Beach",
    "tr": "İztuzu Plajı'ndaki DEKAMER Deniz Kaplumbağası Kurtarma ve Rehabilitasyon Merkezi",
    "media": "12 км|18 мин на авто|nature|Экология|Compass",
    "status": "Вкл",
    "enabled": true
  },
  "landmark_13": {
    "block": "10. Ориентиры",
    "key": "landmark_13",
    "desc": "Ориентир 13: Международный аэропорт Даламан [DLM]",
    "ru": "Международный аэропорт Даламан DLM: круглосуточный прием внутренних и международных рейсов",
    "en": "Dalaman International Airport (DLM): 24/7 domestic and international flights",
    "tr": "Dalaman Uluslararası Havalimanı (DLM): 7/24 iç ve dış hat uçuşları",
    "media": "30 км|25-30 мин на авто|transport|Аэропорт|Plane",
    "status": "Вкл",
    "enabled": true
  },
  "landmark_14": {
    "block": "10. Ориентиры",
    "key": "landmark_14",
    "desc": "Ориентир 14: Морской курортный город Мармарис",
    "ru": "Крупный морской порт и курортный город Мармарис: марины для суперяхт, набережная и шоппинг",
    "en": "The major seaport and resort town of Marmaris: superyacht marinas, a promenade, and shopping",
    "tr": "Marmaris, önemli bir liman kenti ve tatil beldesidir: süper yat marinaları, sahil şeridi ve alışveriş merkezleri bulunmaktadır.",
    "media": "85 км|1 час 15 мин на авто|city|Эгейская Ривьера|Car",
    "status": "Вкл",
    "enabled": true
  },
  "spa_title": {
    "block": "11. Спа и Бассейн",
    "key": "spa_title",
    "desc": "Заголовок секции спа-комплекса",
    "ru": "Спа-комплекс и бассейн с соленой водой",
    "en": "Spa complex and salt water pool",
    "tr": "Spa kompleksi ve tuzlu su havuzu",
    "media": "Waves",
    "status": "Вкл",
    "enabled": true
  },
  "spa_subtitle": {
    "block": "11. Спа и Бассейн",
    "key": "spa_subtitle",
    "desc": "Подзаголовок секции спа-комплекса",
    "ru": "Приватная закрытая территория, солевой бассейн 36 м², гидромассажное джакузи и лаунж-зона отдыха",
    "en": "A private enclosed area, a 36 m² salt pool, a hydromassage jacuzzi and a lounge area",
    "tr": "Özel, kapalı bir alan, 36 m²'lik tuz havuzu, hidromasajlı jakuzi ve bir dinlenme alanı.",
    "media": "Sparkles",
    "status": "Вкл",
    "enabled": true
  },
  "spa_pool_title": {
    "block": "11. Спа и Бассейн",
    "key": "spa_pool_title",
    "desc": "Название карточки бассейна",
    "ru": "Приватный бассейн с соленой водой",
    "en": "Private salt water pool",
    "tr": "Özel tuzlu su havuzu",
    "media": "Waves",
    "status": "Вкл",
    "enabled": true
  },
  "spa_pool_desc": {
    "block": "11. Спа и Бассейн",
    "key": "spa_pool_desc",
    "desc": "Характеристики и описание бассейна",
    "ru": "Чаша 4 × 9 метров [площадь 36 кв. м], постоянная комфортная глубина 150 см по всей площади чаши. Мягкая природная минерализация исключает раздражение кожи и едкий запах хлора.",
    "en": "The 4 x 9 meter pool (area 36 sq. m) maintains a comfortable depth of 150 cm throughout the entire pool. The gentle natural mineralization eliminates skin irritation and the pungent chlorine smell.",
    "tr": "4 x 9 metrelik (36 metrekare alan) havuz, tüm havuz boyunca 150 cm'lik konforlu bir derinliği korur. Nazik doğal mineralizasyon, cilt tahrişini ve keskin klor kokusunu ortadan kaldırır.",
    "media": "Droplets",
    "status": "Вкл",
    "enabled": true
  },
  "spa_pool_badge": {
    "block": "11. Спа и Бассейн",
    "key": "spa_pool_badge",
    "desc": "Бейдж бассейна",
    "ru": "Соленая вода без хлора",
    "en": "Salt water without chlorine",
    "tr": "Klor içermeyen tuzlu su",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "spa_pool_season": {
    "block": "11. Спа и Бассейн",
    "key": "spa_pool_season",
    "desc": "Сезон работы бассейна",
    "ru": "Сезон работы: с 1 мая по 1 ноября",
    "en": "Opening season: May 1st to November 1st",
    "tr": "Sezon açılışı: 1 Mayıs - 1 Kasım",
    "media": "Calendar",
    "status": "Вкл",
    "enabled": true
  },
  "spa_pool_lighting": {
    "block": "11. Спа и Бассейн",
    "key": "spa_pool_lighting",
    "desc": "График подсветки бассейна",
    "ru": "Подводная ночная подсветка: 20:00 - 01:00",
    "en": "Underwater night lighting: 20:00 - 01:00",
    "tr": "Sualtı gece aydınlatması: 20:00 - 01:00",
    "media": "Clock",
    "status": "Вкл",
    "enabled": true
  },
  "spa_pool_maintenance": {
    "block": "11. Спа и Бассейн",
    "key": "spa_pool_maintenance",
    "desc": "Регламент очистки бассейна",
    "ru": "График чистки: в день заселения и далее каждые 7 дней",
    "en": "Cleaning schedule: on the day of check-in and then every 7 days",
    "tr": "Temizlik programı: giriş gününde ve ardından her 7 günde bir.",
    "media": "Droplets",
    "status": "Вкл",
    "enabled": true
  },
  "spa_jacuzzi_title": {
    "block": "11. Спа и Бассейн",
    "key": "spa_jacuzzi_title",
    "desc": "Название карточки джакузи",
    "ru": "Открытое уличное джакузи",
    "en": "Outdoor jacuzzi",
    "tr": "Açık hava jakuzisi",
    "media": "Sparkles",
    "status": "Вкл",
    "enabled": true
  },
  "spa_jacuzzi_desc": {
    "block": "11. Спа и Бассейн",
    "key": "spa_jacuzzi_desc",
    "desc": "Описание и функционал джакузи",
    "ru": "Гидромассажная спа-ванна в зоне бассейна с подогревом и регулируемыми форсунками для глубокого расслабления на свежем воздухе.",
    "en": "A heated hot tub in the pool area with adjustable jets for deep relaxation in the fresh air.",
    "tr": "Havuz alanında, temiz havada derinlemesine rahatlama için ayarlanabilir jetlere sahip ısıtmalı bir jakuzi bulunmaktadır.",
    "media": "Sparkles",
    "status": "Вкл",
    "enabled": true
  },
  "spa_jacuzzi_badge": {
    "block": "11. Спа и Бассейн",
    "key": "spa_jacuzzi_badge",
    "desc": "Вместимость джакузи",
    "ru": "Вместимость: 4 персоны",
    "en": "Capacity: 4 persons",
    "tr": "Kapasite: 4 kişi",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "spa_jacuzzi_schedule": {
    "block": "11. Спа и Бассейн",
    "key": "spa_jacuzzi_schedule",
    "desc": "Режим и алгоритм джакузи",
    "ru": "Режим работы: 10:00 - 17:00 [15 мин каждые 45 мин]",
    "en": "Opening hours: 10:00 - 17:00 [15 min every 45 min]",
    "tr": "Açılış saatleri: 10:00 - 17:00 [her 45 dakikada bir 15 dakika]",
    "media": "Clock",
    "status": "Вкл",
    "enabled": true
  },
  "spa_jacuzzi_lighting": {
    "block": "11. Спа и Бассейн",
    "key": "spa_jacuzzi_lighting",
    "desc": "Подсветка джакузи",
    "ru": "Подсветка джакузи: 20:00 - 01:00",
    "en": "Jacuzzi lighting: 8:00 PM - 1:00 AM",
    "tr": "Jakuzi aydınlatması: 20:00 - 01:00",
    "media": "Moon",
    "status": "Вкл",
    "enabled": true
  },
  "spa_jacuzzi_season": {
    "block": "11. Спа и Бассейн",
    "key": "spa_jacuzzi_season",
    "desc": "Сезон работы джакузи",
    "ru": "Период активности: с 1 мая по 1 ноября",
    "en": "Period of activity: May 1 to November 1",
    "tr": "Faaliyet dönemi: 1 Mayıs - 1 Kasım",
    "media": "Calendar",
    "status": "Вкл",
    "enabled": true
  },
  "spa_street_lighting_title": {
    "block": "11. Спа и Бассейн",
    "key": "spa_street_lighting_title",
    "desc": "Освещение территории",
    "ru": "Освещение территории",
    "en": "Lighting of the area",
    "tr": "Bölgenin aydınlatılması",
    "media": "Moon",
    "status": "Вкл",
    "enabled": true
  },
  "spa_street_lighting_desc": {
    "block": "11. Спа и Бассейн",
    "key": "spa_street_lighting_desc",
    "desc": "График освещения сада",
    "ru": "Автоматическое включение сада: 20:00 - 01:00 и 04:00 - 06:00",
    "en": "Automatic garden switching: 20:00 - 01:00 and 04:00 - 06:00",
    "tr": "Otomatik bahçe açma/kapama saatleri: 20:00 - 01:00 ve 04:00 - 06:00",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "spa_parking_title": {
    "block": "11. Спа и Бассейн",
    "key": "spa_parking_title",
    "desc": "Приватная парковка",
    "ru": "Приватная парковка",
    "en": "Private parking",
    "tr": "Özel otopark",
    "media": "Car",
    "status": "Вкл",
    "enabled": true
  },
  "spa_parking_desc": {
    "block": "11. Спа и Бассейн",
    "key": "spa_parking_desc",
    "desc": "Описание парковки",
    "ru": "Закрытая бесплатная парковка на территории виллы на 2 автомобиля",
    "en": "Closed free parking on the villa's territory for 2 cars",
    "tr": "Villanın arazisinde 2 araçlık ücretsiz kapalı otopark mevcuttur.",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "spa_bbq_title": {
    "block": "11. Спа и Бассейн",
    "key": "spa_bbq_title",
    "desc": "Зона BBQ и лаунж",
    "ru": "BBQ и обеденная зона",
    "en": "BBQ and dining area",
    "tr": "Barbekü ve yemek alanı",
    "media": "Flame",
    "status": "Вкл",
    "enabled": true
  },
  "spa_bbq_desc": {
    "block": "11. Спа и Бассейн",
    "key": "spa_bbq_desc",
    "desc": "Описание зоны барбекю",
    "ru": "Обеденный стол на 8 мест, гриль на углях, шезлонги и уличный душ",
    "en": "An 8-seat dining table, charcoal grill, sun loungers and an outdoor shower",
    "tr": "8 kişilik yemek masası, mangal, şezlonglar ve açık hava duşu.",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "legal_safety_title": {
    "block": "12. Безопасность",
    "key": "legal_safety_title",
    "desc": "Заголовок секции безопасности и закона",
    "ru": "Безопасность, Закон № 7464 и Доступная среда",
    "en": "Safety, Law No. 7464 and Accessibility",
    "tr": "Güvenlik, 7464 Sayılı Kanun ve Erişilebilirlik",
    "media": "ShieldCheck",
    "status": "Вкл",
    "enabled": true
  },
  "legal_safety_subtitle": {
    "block": "12. Безопасность",
    "key": "legal_safety_subtitle",
    "desc": "Подзаголовок секции безопасности и закона",
    "ru": "Полное соответствие законодательству Турции о краткосрочной аренде, защита гостей и безбарьерный доступ",
    "en": "Full compliance with Turkish short-term rental legislation, guest protection and barrier-free access",
    "tr": "Türk kısa süreli kiralama mevzuatına tam uyum, misafir güvenliği ve engelsiz erişim.",
    "media": "FileText",
    "status": "Вкл",
    "enabled": true
  },
  "legal_law7464_title": {
    "block": "12. Безопасность",
    "key": "legal_law7464_title",
    "desc": "Заголовок блока Закон 7464",
    "ru": "Официальный договор и учет KBS",
    "en": "Official contract and KBS accounting",
    "tr": "Resmi sözleşme ve KBS muhasebesi",
    "media": "FileText",
    "status": "Вкл",
    "enabled": true
  },
  "legal_law7464_desc": {
    "block": "12. Безопасность",
    "key": "legal_law7464_desc",
    "desc": "Описание блока Закон 7464",
    "ru": "Вилла осуществляет деятельность в строгом соответствии с Законом № 7464 о краткосрочной туристической аренде в Турции.",
    "en": "The villa operates in strict accordance with Law No. 7464 on Short-Term Tourist Rentals in Turkey.",
    "tr": "Villa, Türkiye'deki Kısa Süreli Turist Kiralama Kanunu No. 7464'e tam uyum içinde faaliyet göstermektedir.",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "legal_law7464_badge": {
    "block": "12. Безопасность",
    "key": "legal_law7464_badge",
    "desc": "Бейдж закона 7464",
    "ru": "Закон Турции № 7464",
    "en": "Turkish Law No. 7464",
    "tr": "Türk Kanunu No. 7464",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "legal_law7464_item1": {
    "block": "12. Безопасность",
    "key": "legal_law7464_item1",
    "desc": "Пункт 1: Договор найма",
    "ru": "Обязательный договор краткосрочного найма с описью имущества при заезде",
    "en": "Mandatory short-term lease agreement with inventory of property upon move-in",
    "tr": "Taşınma sırasında eşyaların envanterinin verilmesini içeren zorunlu kısa dönemli kira sözleşmesi.",
    "media": "CheckCircle2",
    "status": "Вкл",
    "enabled": true
  },
  "legal_law7464_item2": {
    "block": "12. Безопасность",
    "key": "legal_law7464_item2",
    "desc": "Пункт 2: Регистрация KBS",
    "ru": "Регистрация паспортов всех проживающих гостей в полицейской системе KBS [Kimlik Bildirme Sistemi]",
    "en": "Registration of passports of all staying guests in the KBS [Kimlik Bildirme Sistemi] police system",
    "tr": "Konaklayan tüm misafirlerin pasaportlarının KBS [Kimlik Bildirme Sistemi] polis sistemine kaydı.",
    "media": "CheckCircle2",
    "status": "Вкл",
    "enabled": true
  },
  "legal_law7464_item3": {
    "block": "12. Безопасность",
    "key": "legal_law7464_item3",
    "desc": "Пункт 3: Запрет третьих лиц",
    "ru": "Размещение лиц, не внесенных в государственную систему KBS, строго запрещено",
    "en": "The placement of persons not included in the state KBS system is strictly prohibited.",
    "tr": "Devlet KBS sistemine dahil olmayan kişilerin yerleştirilmesi kesinlikle yasaktır.",
    "media": "AlertCircle",
    "status": "Вкл",
    "enabled": true
  },
  "legal_security_title": {
    "block": "12. Безопасность",
    "key": "legal_security_title",
    "desc": "Заголовок блока безопасности",
    "ru": "Безопасность дома и территории",
    "en": "Home and territory security",
    "tr": "Ev ve bölge güvenliği",
    "media": "ShieldCheck",
    "status": "Вкл",
    "enabled": true
  },
  "legal_security_desc": {
    "block": "12. Безопасность",
    "key": "legal_security_desc",
    "desc": "Описание блока безопасности",
    "ru": "Оснащение дома сертифицированными системами предупреждения и постоянного мониторинга.",
    "en": "Equipping the house with certified warning and continuous monitoring systems.",
    "tr": "Evi sertifikalı uyarı ve sürekli izleme sistemleriyle donatmak.",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "legal_security_badge": {
    "block": "12. Безопасность",
    "key": "legal_security_badge",
    "desc": "Бейдж стандартов безопасности",
    "ru": "Стандарты безопасности",
    "en": "Safety standards",
    "tr": "Güvenlik standartları",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "legal_security_item1": {
    "block": "12. Безопасность",
    "key": "legal_security_item1",
    "desc": "Пункт 1: Наружное видеонаблюдение",
    "ru": "Наружные камеры видеонаблюдения установлены строго по периметру забора и у калитки [без съемки бассейна и террасы]",
    "en": "Outdoor CCTV cameras are installed strictly along the perimeter of the fence and at the gate [without filming the pool and terrace]",
    "tr": "Dış mekan güvenlik kameraları, havuz ve terası filme almayacak şekilde, yalnızca çitin çevresi boyunca ve kapıya yerleştirilmiştir.",
    "media": "Eye",
    "status": "Вкл",
    "enabled": true
  },
  "legal_security_item2": {
    "block": "12. Безопасность",
    "key": "legal_security_item2",
    "desc": "Пункт 2: Датчики дыма и газа",
    "ru": "Сертифицированные автономные датчики дыма и угарного газа на обоих этажах виллы",
    "en": "Certified independent smoke and carbon monoxide detectors on both floors of the villa",
    "tr": "Villanın her iki katında da sertifikalı, bağımsız duman ve karbonmonoksit dedektörleri bulunmaktadır.",
    "media": "Flame",
    "status": "Вкл",
    "enabled": true
  },
  "legal_security_item3": {
    "block": "12. Безопасность",
    "key": "legal_security_item3",
    "desc": "Пункт 3: Огнетушители и аптечка",
    "ru": "Огнетушители на 1 и 2 этажах, укомплектованная медицинская аптечка первой помощи",
    "en": "Fire extinguishers on the 1st and 2nd floors, a fully equipped first aid kit",
    "tr": "1. ve 2. katlarda yangın söndürücüler, tam donanımlı bir ilk yardım çantası.",
    "media": "ShieldCheck",
    "status": "Вкл",
    "enabled": true
  },
  "legal_accessible_title": {
    "block": "12. Безопасность",
    "key": "legal_accessible_title",
    "desc": "Заголовок блока доступной среды",
    "ru": "Инклюзивность и доступная среда",
    "en": "Inclusiveness and accessibility",
    "tr": "Kapsayıcılık ve erişilebilirlik",
    "media": "Accessibility",
    "status": "Вкл",
    "enabled": true
  },
  "legal_accessible_desc": {
    "block": "12. Безопасность",
    "key": "legal_accessible_desc",
    "desc": "Описание доступной среды",
    "ru": "Создание безбарьерных условий для комфортного отдыха гостей с ограниченной мобильностью.",
    "en": "Creating barrier-free conditions for a comfortable stay for guests with limited mobility.",
    "tr": "Hareket kabiliyeti kısıtlı misafirler için konforlu bir konaklama sağlamak amacıyla engelsiz koşullar oluşturmak.",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "legal_accessible_badge": {
    "block": "12. Безопасность",
    "key": "legal_accessible_badge",
    "desc": "Бейдж безбарьерной среды",
    "ru": "Безбарьерная среда",
    "en": "Barrier-free environment",
    "tr": "Engelsiz ortam",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "legal_accessible_item1": {
    "block": "12. Безопасность",
    "key": "legal_accessible_item1",
    "desc": "Пункт 1: Спальня 1 этажа",
    "ru": "Безбарьерный доступ: спальня №1 на 1 этаже оборудована широкими дверными проемами без порогов",
    "en": "Barrier-free access: Bedroom 1 on the first floor has wide doorways without thresholds",
    "tr": "Engelsiz erişim: Birinci kattaki 1 numaralı yatak odasının eşiksiz geniş kapıları vardır.",
    "media": "DoorOpen",
    "status": "Вкл",
    "enabled": true
  },
  "legal_accessible_item2": {
    "block": "12. Безопасность",
    "key": "legal_accessible_item2",
    "desc": "Пункт 2: Санузел для МГН",
    "ru": "Санузел первого этажа спроектирован с возможностью комфортного использования гостями с ограниченной мобильностью",
    "en": "The first floor bathroom is designed to be comfortable for use by guests with limited mobility.",
    "tr": "Birinci kattaki banyo, hareket kabiliyeti kısıtlı misafirlerin rahatça kullanabileceği şekilde tasarlanmıştır.",
    "media": "CheckCircle2",
    "status": "Вкл",
    "enabled": true
  },
  "legal_accessible_item3": {
    "block": "12. Безопасность",
    "key": "legal_accessible_item3",
    "desc": "Пункт 3: Подъемник в бассейн",
    "ru": "Возможность установки мобильного подъемника для спуска в бассейн по предварительному запросу",
    "en": "Possibility of installing a mobile lift for descent into the pool upon prior request",
    "tr": "Önceden talep edilmesi halinde havuza iniş için mobil asansör kurulumu mümkündür.",
    "media": "Accessibility",
    "status": "Вкл",
    "enabled": true
  },
  "legal_cancellation_title": {
    "block": "12. Безопасность",
    "key": "legal_cancellation_title",
    "desc": "Заголовок политики отмены",
    "ru": "Политика отмены и возврата",
    "en": "Cancellation and Refund Policy",
    "tr": "İptal ve Geri Ödeme Politikası",
    "media": "Clock",
    "status": "Вкл",
    "enabled": true
  },
  "legal_cancellation_desc": {
    "block": "12. Безопасность",
    "key": "legal_cancellation_desc",
    "desc": "Описание политики отмены",
    "ru": "Прозрачные финансовые условия бронирования без скрытых штрафов.",
    "en": "Transparent financial booking conditions without hidden penalties.",
    "tr": "Gizli cezalar içermeyen şeffaf finansal rezervasyon koşulları.",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "legal_cancellation_badge": {
    "block": "12. Безопасность",
    "key": "legal_cancellation_badge",
    "desc": "Бейдж возврата 100%",
    "ru": "Возврат 100%",
    "en": "100% refund",
    "tr": "%100 para iadesi",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "legal_cancellation_item1": {
    "block": "12. Безопасность",
    "key": "legal_cancellation_item1",
    "desc": "Пункт 1: 14 дней отмена",
    "ru": "Полный 100% возврат предоплаты при отмене более чем за 14 суток до даты заезда",
    "en": "Full 100% refund of the prepayment if cancelled more than 14 days before the arrival date",
    "tr": "Varış tarihinden 14 günden daha önce iptal edilmesi durumunda ön ödemenin tamamı (%100) iade edilir.",
    "media": "CheckCircle2",
    "status": "Вкл",
    "enabled": true
  },
  "legal_cancellation_item2": {
    "block": "12. Безопасность",
    "key": "legal_cancellation_item2",
    "desc": "Пункт 2: Менее 14 дней",
    "ru": "Отсутствие ключей Vercel KV: В предоставленном .env.local параметры KV_REST_API_URL и KV_REST_API_TOKEN оставлены пустыми. Эти ключи требуются для кэширования статусов форматирования листов и быстрых сессий",
    "en": "Missing Vercel KV keys: In the provided .env.local file, the KV_REST_API_URL and KV_REST_API_TOKEN parameters are left blank. These keys are required for caching sheet formatting statuses and quick sessions.",
    "tr": "Vercel KV anahtarları eksik: Sağlanan .env.local dosyasında, KV_REST_API_URL ve KV_REST_API_TOKEN parametreleri boş bırakılmıştır. Bu anahtarlar, sayfa biçimlendirme durumlarının önbelleğe alınması ve hızlı oturumlar için gereklidir.",
    "media": "AlertCircle",
    "status": "Вкл",
    "enabled": true
  },
  "legal_cancellation_item3": {
    "block": "12. Безопасность",
    "key": "legal_cancellation_item3",
    "desc": "Пункт 3: Инвойс e-Arşiv Fatura",
    "ru": "Да, это безопасно и технически необходимо для работы вашей архитектуры.",
    "en": "Yes, it is safe and technically necessary for your architecture to work.",
    "tr": "Evet, güvenli ve mimarinizin çalışması için teknik olarak gerekli.",
    "media": "FileText",
    "status": "Вкл",
    "enabled": true
  },
  "brandName": {
    "block": "13. Словарь интерфейса",
    "key": "brandName",
    "desc": "Название бренда в шапке",
    "ru": "Villa Turaman",
    "en": "Villa Turaman",
    "tr": "Villa Turaman",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "login": {
    "block": "13. Словарь интерфейса",
    "key": "login",
    "desc": "Кнопка входа в аккаунт",
    "ru": "Войти",
    "en": "Login",
    "tr": "Giriş yapmak",
    "media": "LogIn",
    "status": "Вкл",
    "enabled": true
  },
  "register": {
    "block": "13. Словарь интерфейса",
    "key": "register",
    "desc": "Кнопка регистрации",
    "ru": "Регистрация",
    "en": "Registration",
    "tr": "Kayıt",
    "media": "UserPlus",
    "status": "Вкл",
    "enabled": true
  },
  "logout": {
    "block": "13. Словарь интерфейса",
    "key": "logout",
    "desc": "Кнопка выхода из системы",
    "ru": "Выйти",
    "en": "Exit",
    "tr": "Çıkış",
    "media": "LogOut",
    "status": "Вкл",
    "enabled": true
  },
  "guestCabinet": {
    "block": "13. Словарь интерфейса",
    "key": "guestCabinet",
    "desc": "Кнопка кабинета гостя",
    "ru": "Мои поездки",
    "en": "My trips",
    "tr": "Seyahatlerim",
    "media": "Compass",
    "status": "Вкл",
    "enabled": true
  },
  "hostCabinet": {
    "block": "13. Словарь интерфейса",
    "key": "hostCabinet",
    "desc": "Кнопка панели суперхозяина",
    "ru": "Панель управления",
    "en": "Control Panel",
    "tr": "Kontrol Paneli",
    "media": "LayoutDashboard",
    "status": "Вкл",
    "enabled": true
  },
  "navAbout": {
    "block": "13. Словарь интерфейса",
    "key": "navAbout",
    "desc": "Пункт меню О вилле",
    "ru": "О вилле",
    "en": "About the villa",
    "tr": "Villa hakkında",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "navAmenities": {
    "block": "13. Словарь интерфейса",
    "key": "navAmenities",
    "desc": "Пункт меню Удобства",
    "ru": "Удобства",
    "en": "Facilities",
    "tr": "Tesisler",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "navReviews": {
    "block": "13. Словарь интерфейса",
    "key": "navReviews",
    "desc": "Пункт меню Отзывы",
    "ru": "Отзывы",
    "en": "Reviews",
    "tr": "Yorumlar",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "navLocation": {
    "block": "13. Словарь интерфейса",
    "key": "navLocation",
    "desc": "Пункт меню Расположение",
    "ru": "Расположение",
    "en": "Location",
    "tr": "Konum",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "navCatalog": {
    "block": "13. Словарь интерфейса",
    "key": "navCatalog",
    "desc": "Пункт меню Услуги и гиды",
    "ru": "Услуги и гиды",
    "en": "Services and guides",
    "tr": "Hizmetler ve rehberler",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "bookNow": {
    "block": "14. Словарь интерфейса",
    "key": "bookNow",
    "desc": "Главная кнопка бронирования",
    "ru": "Забронировать",
    "en": "Book now",
    "tr": "Şimdi rezervasyon yapın",
    "media": "CalendarCheck",
    "status": "Вкл",
    "enabled": true
  },
  "checkIn": {
    "block": "14. Словарь интерфейса",
    "key": "checkIn",
    "desc": "Поле даты заезда",
    "ru": "Заезд",
    "en": "Arrival",
    "tr": "Varış",
    "media": "Calendar",
    "status": "Вкл",
    "enabled": true
  },
  "checkOut": {
    "block": "14. Словарь интерфейса",
    "key": "checkOut",
    "desc": "Поле даты выезда",
    "ru": "Выезд",
    "en": "Departure",
    "tr": "Kalkış",
    "media": "Calendar",
    "status": "Вкл",
    "enabled": true
  },
  "guests": {
    "block": "14. Словарь интерфейса",
    "key": "guests",
    "desc": "Выбор количества гостей",
    "ru": "Гости",
    "en": "Guests",
    "tr": "Misafirler",
    "media": "Users",
    "status": "Вкл",
    "enabled": true
  },
  "perNight": {
    "block": "14. Словарь интерфейса",
    "key": "perNight",
    "desc": "Подпись тарифа за сутки",
    "ru": "за ночь",
    "en": "overnight",
    "tr": "gece",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "nights": {
    "block": "14. Словарь интерфейса",
    "key": "nights",
    "desc": "Подпись количества ночей",
    "ru": "ночей",
    "en": "nights",
    "tr": "geceler",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "totalPrice": {
    "block": "14. Словарь интерфейса",
    "key": "totalPrice",
    "desc": "Итоговая стоимость проживания",
    "ru": "Итого к оплате",
    "en": "Total to be paid",
    "tr": "Ödenecek toplam tutar",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "cleaningFee": {
    "block": "14. Словарь интерфейса",
    "key": "cleaningFee",
    "desc": "Строка сервисного сбора",
    "ru": "Сервисный сбор и финальная уборка",
    "en": "Service fee and final cleaning",
    "tr": "Hizmet bedeli ve son temizlik",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "depositText": {
    "block": "14. Словарь интерфейса",
    "key": "depositText",
    "desc": "Размер гарантийного залога",
    "ru": "Возвратный депозит за сохранность имущества",
    "en": "Refundable security deposit",
    "tr": "İade edilebilir güvenlik depozitosu",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "confirmBooking": {
    "block": "14. Словарь интерфейса",
    "key": "confirmBooking",
    "desc": "Кнопка подтверждения заявки",
    "ru": "Подтвердить бронирование",
    "en": "Confirm your booking",
    "tr": "Rezervasyonunuzu onaylayın",
    "media": "CheckCircle",
    "status": "Вкл",
    "enabled": true
  },
  "selectDates": {
    "block": "14. Словарь интерфейса",
    "key": "selectDates",
    "desc": "Подсказка выбора дат",
    "ru": "Выберите даты поездки",
    "en": "Select travel dates",
    "tr": "Seyahat tarihlerini seçin",
    "media": "Calendar",
    "status": "Вкл",
    "enabled": true
  },
  "close": {
    "block": "15. Словарь интерфейса",
    "key": "close",
    "desc": "Кнопка закрытия модального окна",
    "ru": "Закрыть",
    "en": "Close",
    "tr": "Kapalı",
    "media": "X",
    "status": "Вкл",
    "enabled": true
  },
  "back": {
    "block": "15. Словарь интерфейса",
    "key": "back",
    "desc": "Кнопка возврата назад",
    "ru": "Назад",
    "en": "Back",
    "tr": "Geri",
    "media": "ArrowLeft",
    "status": "Вкл",
    "enabled": true
  },
  "save": {
    "block": "15. Словарь интерфейса",
    "key": "save",
    "desc": "Кнопка сохранения данных",
    "ru": "Сохранить изменения",
    "en": "Save changes",
    "tr": "Değişiklikleri kaydet",
    "media": "Save",
    "status": "Вкл",
    "enabled": true
  },
  "showAllPhotos": {
    "block": "15. Словарь интерфейса",
    "key": "showAllPhotos",
    "desc": "Кнопка открытия галереи фото",
    "ru": "Показать все фото",
    "en": "Show all photos",
    "tr": "Tüm fotoğrafları göster",
    "media": "Grid",
    "status": "Вкл",
    "enabled": true
  },
  "showAllAmenities": {
    "block": "15. Словарь интерфейса",
    "key": "showAllAmenities",
    "desc": "Кнопка открытия всех удобств",
    "ru": "Показать все удобства",
    "en": "Show all amenities",
    "tr": "Tüm olanakları göster",
    "media": "List",
    "status": "Вкл",
    "enabled": true
  },
  "showAllLandmarksBtn": {
    "block": "15. Словарь интерфейса",
    "key": "showAllLandmarksBtn",
    "desc": "Кнопка показа всех ориентиров",
    "ru": "Показать все 14 ориентиров и карту расстояний",
    "en": "Show all 14 landmarks and distance map",
    "tr": "14 önemli yerin tamamını ve mesafe haritasını göster",
    "media": "Compass",
    "status": "Вкл",
    "enabled": true
  },
  "showAllReviewsBtn": {
    "block": "15. Словарь интерфейса",
    "key": "showAllReviewsBtn",
    "desc": "Кнопка показа отзывов",
    "ru": "Показать все 48 отзывов и критерии оценок",
    "en": "Show all 48 reviews and rating criteria",
    "tr": "Tüm 48 yorumu ve değerlendirme kriterlerini göster",
    "media": "Star",
    "status": "Вкл",
    "enabled": true
  },
  "landmarksCategoryTitle": {
    "block": "15. Словарь интерфейса",
    "key": "landmarksCategoryTitle",
    "desc": "Надзаголовок ориентиров",
    "ru": "Географические ориентиры Дальяна",
    "en": "Geographic landmarks of Dalyan",
    "tr": "Dalyan'ın coğrafi yer işaretleri",
    "media": "Compass",
    "status": "Вкл",
    "enabled": true
  },
  "reviewsCategoryTitle": {
    "block": "15. Словарь интерфейса",
    "key": "reviewsCategoryTitle",
    "desc": "Надзаголовок отзывов",
    "ru": "Рейтинг гостей и отзывы",
    "en": "Guest ratings and reviews",
    "tr": "Konuk değerlendirmeleri ve yorumları",
    "media": "Star",
    "status": "Вкл",
    "enabled": true
  },
  "reviewsRatingTitle": {
    "block": "15. Словарь интерфейса",
    "key": "reviewsRatingTitle",
    "desc": "Шаблон рейтинга отзывов",
    "ru": "Рейтинг гостей на основе",
    "en": "Guest rating based on",
    "tr": "Misafir değerlendirmesi şu kriterlere dayanmaktadır:",
    "media": "Star",
    "status": "Вкл",
    "enabled": true
  },
  "legalRegulationHeader": {
    "block": "15. Словарь интерфейса",
    "key": "legalRegulationHeader",
    "desc": "Надзаголовок безопасности",
    "ru": "Юридический регламент и комфорт",
    "en": "Legal regulations and comfort",
    "tr": "Yasal düzenlemeler ve rahatlık",
    "media": "ShieldCheck",
    "status": "Вкл",
    "enabled": true
  },
  "chatWithHost": {
    "block": "16. Словарь интерфейса",
    "key": "chatWithHost",
    "desc": "Кнопка вызова прямого чата с хозяином",
    "ru": "Чат с суперхозяином",
    "en": "Chat with a superhost",
    "tr": "Süper sunucuyla sohbet edin",
    "media": "MessageSquare",
    "status": "Вкл",
    "enabled": true
  },
  "onlineStatus": {
    "block": "16. Словарь интерфейса",
    "key": "onlineStatus",
    "desc": "Индикатор статуса онлайн",
    "ru": "В сети : отвечает мгновенно",
    "en": "Online: Responds instantly",
    "tr": "Çevrimiçi: Anında yanıt verir",
    "media": "Radio",
    "status": "Вкл",
    "enabled": true
  },
  "typing": {
    "block": "16. Словарь интерфейса",
    "key": "typing",
    "desc": "Индикатор набора текста",
    "ru": "Алексей печатает ответ...",
    "en": "Alexey types a reply...",
    "tr": "Alexey bir yanıt yazıyor...",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "send": {
    "block": "16. Словарь интерфейса",
    "key": "send",
    "desc": "Кнопка отправки сообщения в чат",
    "ru": "Отправить",
    "en": "Send",
    "tr": "Göndermek",
    "media": "Send",
    "status": "Вкл",
    "enabled": true
  },
  "messagePlaceholder": {
    "block": "16. Словарь интерфейса",
    "key": "messagePlaceholder",
    "desc": "Плейсхолдер поля ввода в чате",
    "ru": "Напишите ваш вопрос или пожелание...",
    "en": "Write your question or wish...",
    "tr": "Sorunuzu veya dileğinizi yazın...",
    "media": "",
    "status": "Вкл",
    "enabled": true
  },
  "bookingSuccess": {
    "block": "16. Словарь интерфейса",
    "key": "bookingSuccess",
    "desc": "Уведомление об успешной оплате",
    "ru": "Оплата успешно подтверждена! Бронирование внесено в календарь.",
    "en": "Payment successfully confirmed! The reservation has been added to the calendar.",
    "tr": "Ödeme başarıyla onaylandı! Rezervasyon takvime eklendi.",
    "media": "CheckCircle2",
    "status": "Вкл",
    "enabled": true
  }
};

const MASTER_HOME_ROWS = [
  [
    "1. Главный экран",
    "hero_title",
    "Главный заголовок листинга в шапке",
    "Dalyan Turaman [частный бассейн, 10 спальных мест]",
    "Dalyan Turaman [private pool, sleeps 10]",
    "Dalyan Turaman [özel havuz, 10 kişilik]",
    "",
    "Вкл"
  ],
  [
    "1. Главный экран",
    "hero_subtitle",
    "Подзаголовок виллы под главным заголовком",
    "Премиальная вилла 240 м² в Дальяне. Приватный бассейн с соленой водой 36 м², уличное джакузи, 4 спальни, 10 спальных мест, 250 м до центра.",
    "A premium 240 m² villa in Dalyan. A private 36 m² saltwater pool, an outdoor jacuzzi, 4 bedrooms, sleeps 10, and is 250 m from the center.",
    "Dalyan'da 240 m²'lik birinci sınıf bir villa. 36 m²'lik özel tuzlu su havuzu, açık hava jakuzisi, 4 yatak odası, 10 kişiye kadar konaklama kapasitesi ve merkeze 250 metre mesafede yer almaktadır.",
    "",
    "Вкл"
  ],
  [
    "1. Главный экран",
    "hero_rating",
    "Числовой рейтинг виллы",
    "4.98",
    "4.98",
    "4.98",
    "Star",
    "Вкл"
  ],
  [
    "1. Главный экран",
    "hero_reviews_count",
    "Количество отзывов рядом с рейтингом",
    "48 отзывов",
    "48 reviews",
    "48 değerlendirme",
    "",
    "Вкл"
  ],
  [
    "1. Главный экран",
    "hero_superhost_badge",
    "Бейдж статуса суперхозяина",
    "Суперхозяин",
    "Superhost",
    "Süper ev sahibi",
    "Award",
    "Вкл"
  ],
  [
    "1. Главный экран",
    "hero_location",
    "Текст кликабельной локации объекта",
    "Dalyan, Rodoslu Yaşar Sünger Sk, NO 28/2, Ortaca / Muğla",
    "Dalyan, Rodoslu Yaşar Sünger Sk, NO 28/2, Ortaca / Muğla",
    "Dalyan, Rodoslu Yaşar Sünger Sk, NO 28/2, Ortaca / Muğla",
    "MapPin",
    "Вкл"
  ],
  [
    "1. Главный экран",
    "hero_share_btn",
    "Текст кнопки Поделиться",
    "Поделиться",
    "Share",
    "Paylaşmak",
    "Share2",
    "Вкл"
  ],
  [
    "1. Главный экран",
    "hero_favorite_btn",
    "Текст кнопки В избранное",
    "В избранное",
    "Add to favorites",
    "Favorilere ekle",
    "Heart",
    "Вкл"
  ],
  [
    "1. Главный экран",
    "hero_image",
    "Главное фоновое фото объекта",
    "Главные фотографии фасада и бассейна",
    "Main photos of the facade and the pool",
    "Cephe ve havuzun ana fotoğrafları",
    "https://drive.google.com/file/d/1NjSHRDa5eJpQTzO9268e8LMRzDVmYtX7/view?usp=sharing,https://drive.google.com/file/d/1IZMH6wtfLHZ6ibKHfmBhPGMFntZ_fXKU/view?usp=drive_link",
    "Вкл"
  ],
  [
    "2. Характеристики",
    "host_specs_header",
    "Заголовок типа жилья и владельца",
    "Отдельная вилла целиком • Хозяин: Aleksei Znamenskii [Суперхозяин]",
    "Entire detached villa • Host: Aleksei Znamenskii [Superhost]",
    "Müstakil villanın tamamı • Ev sahibi: Aleksei Znamenskii [Süper Ev Sahibi]",
    "",
    "Вкл"
  ],
  [
    "2. Характеристики",
    "host_specs_name",
    "Отображаемое имя владельца виллы",
    "Aleksei Znamenskii",
    "Alexey Znamensky",
    "Alexey Znamensky",
    "",
    "Вкл"
  ],
  [
    "2. Характеристики",
    "host_specs_avatar",
    "Аватар владельца виллы в карточке характеристик",
    "Аватар владельца виллы",
    "Avatar of the villa owner",
    "Villa sahibinin avatarı",
    "https://drive.google.com/file/d/1NjSHRDa5eJpQTzO9268e8LMRzDVmYtX7/view?usp=sharing,https://drive.google.com/file/d/1IZMH6wtfLHZ6ibKHfmBhPGMFntZ_fXKU/view?usp=drive_link",
    "Вкл"
  ],
  [
    "2. Характеристики",
    "spec_guests",
    "Счетчик гостей в строке параметров",
    "10 гостей",
    "10 guests",
    "10 misafir",
    "Users",
    "Вкл"
  ],
  [
    "2. Характеристики",
    "spec_bedrooms",
    "Счетчик спален в строке параметров",
    "4 спальни",
    "4 bedrooms",
    "4 yatak odası",
    "Bed",
    "Вкл"
  ],
  [
    "2. Характеристики",
    "spec_beds",
    "Счетчик спальных мест [кроватей]",
    "6 кроватей 10 спальных мест",
    "6 beds 10 sleeping places",
    "6 yatak, 10 uyku yeri",
    "Bed",
    "Вкл"
  ],
  [
    "2. Характеристики",
    "spec_baths",
    "Счетчик ванных комнат",
    "4 ванные комнаты + гостевой туалет",
    "4 bathrooms + guest toilet",
    "4 banyo + misafir tuvaleti",
    "Bath",
    "Вкл"
  ],
  [
    "3. Преимущества",
    "highlight_1_title",
    "Заголовок первого преимущества",
    "Опытный Суперхозяин [Superhost]",
    "Experienced Superhost",
    "Deneyimli Süper Ev Sahibi",
    "Sparkles",
    "Вкл"
  ],
  [
    "3. Преимущества",
    "highlight_1_desc",
    "Описание первого преимущества",
    "Алексей живет в Мармарисе, яхтсмен на пенсии, рейтинг 4.98★. Девиз: «Хочешь сделать хорошо - сделай сам».",
    "Alexey lives in Marmaris, is a retired yachtsman, and has a rating of 4.98★. His motto is: \"If you want something done right, do it yourself.\"",
    "Alexey Marmaris'te yaşıyor, emekli bir yatçı ve 4,98★ yıldızlık bir değerlendirmeye sahip. Mottosu ise: \"Bir işin doğru yapılmasını istiyorsanız, kendiniz yapın.\"",
    "",
    "Вкл"
  ],
  [
    "3. Преимущества",
    "highlight_2_title",
    "Заголовок второго преимущества",
    "Приватный спа-комплекс у бассейна",
    "Private spa complex by the pool",
    "Havuz kenarında özel spa kompleksi",
    "Waves",
    "Вкл"
  ],
  [
    "3. Преимущества",
    "highlight_2_desc",
    "Описание второго преимущества",
    "Бассейн с соленой водой 36 м² [май-ноябрь, подсветка 20:00-01:00] и уличное джакузи на 4 персоны [10:00-17:00].",
    "Salt water pool 36 m² [May-November, illuminated 20:00-01:00] and outdoor jacuzzi for 4 people [10:00-17:00].",
    "36 m²'lik tuzlu su havuzu [Mayıs-Kasım, aydınlatmalı 20:00-01:00] ve 4 kişilik açık hava jakuzisi [10:00-17:00].",
    "",
    "Вкл"
  ],
  [
    "3. Преимущества",
    "highlight_3_title",
    "Заголовок третьего преимущества",
    "Правила отмены и Закон № 7464",
    "Cancellation Rules and Law No. 7464",
    "İptal Kuralları ve 7464 Sayılı Kanun",
    "ShieldCheck",
    "Вкл"
  ],
  [
    "3. Преимущества",
    "highlight_3_desc",
    "Описание третьего преимущества",
    "Краткосрочные брони - Негибкие, от 28 ночей - Строгие. Опция невозвратного тарифа со скидкой 10%. Регистрация KBS.",
    "Short-term bookings are non-flexible, and stays of 28 nights or more are strict. Non-refundable rate option with a 10% discount. KBS registration.",
    "Kısa süreli rezervasyonlar esnek değildir ve 28 gece veya daha uzun süreli konaklamalar kesin şartlara tabidir. %10 indirimli, iade edilmeyen fiyat seçeneği mevcuttur. KBS kaydı gereklidir.",
    "",
    "Вкл"
  ],
  [
    "4. О вилле",
    "about_title",
    "Заголовок раздела описания",
    "О Вилле",
    "About Villa",
    "Villa Hakkında",
    "",
    "Вкл"
  ],
  [
    "4. О вилле",
    "about_text",
    "Краткое описание виллы на главной странице",
    "Villa Turaman: это гармоничное сочетание уединения, современного комфорта и первоклассного сервиса для незабываемого отпуска в сердце Дальяна.",
    "Villa Turaman: a harmonious combination of privacy, modern comfort and first-class service for an unforgettable holiday in the heart of Dalyan.",
    "Villa Turaman: Dalyan'ın kalbinde unutulmaz bir tatil için mahremiyetin, modern konforun ve birinci sınıf hizmetin uyumlu birleşimi.",
    "",
    "Вкл"
  ],
  [
    "4. О вилле",
    "about_btn_more",
    "Текст ссылки открытия полного описания",
    "Показать больше об объекте",
    "Show more about the property",
    "Mülk hakkında daha fazla bilgi göster",
    "ChevronRight",
    "Вкл"
  ],
  [
    "4. О вилле",
    "about_modal_title",
    "Заголовок всплывающего окна подробностей",
    "Об этой вилле",
    "About this villa",
    "Bu villa hakkında",
    "",
    "Вкл"
  ],
  [
    "4. О вилле",
    "about_sec_1_title",
    "Модальное окно: Раздел 1 Заголовок",
    "1. Концепция объекта, геолокация и расширенные географические ориентиры",
    "1. Object concept, geolocation and extended geographic landmarks",
    "1. Nesne kavramı, coğrafi konum ve genişletilmiş coğrafi işaretler",
    "",
    "Вкл"
  ],
  [
    "4. О вилле",
    "about_sec_1_text",
    "Модальное окно: Раздел 1 Текст",
    "Dalyan Turaman [частный бассейн, 10 спальных мест] - это цифровая веб-платформа прямого онлайн-бронирования двухэтажной виллы премиум-класса в экологическом заповедном курорте Дальян [район Ортаджа, провинция Мугла, Турция], расположенном между рекой Дальян и озером Кёйджегиз.\n\nОфициальный адрес и навигация:\n* Адрес виллы: Dalyan, Rodoslu Yaşar Sünger Sk, NO 28/2, 48600 Ortaca / Muğla, Turkey.\n* Ссылка на геолокацию в Google Maps: https://maps.app.goo.gl/tPgCjCwz4pzq28pE9\n* Точные координаты GPS: 36.8336° N, 28.6439° E.\n\nПолный реестр ключевых географических ориентиров:\n* Пешеходный центр Дальяна: всего 250 метров [3 минуты пешком] до главной пешеходной улицы с магазинами, рынками, аптеками и сувенирными лавками.\n* Речная набережная реки Дальян: 400 метров для утренних пробежек, вечерних прогулок и наблюдения за речными лодками.\n* Гастрономия: популярный ресторан высокой кухни La Boheme Dalyan - 350 метров; традиционный рыбный ресторан Çiçek Restoran - 500 метров.\n* Ликийские скальные гробницы королей Кауноса [IV век до н.э.]: панорамный вид с набережной Дальяна [450 метров], вечерняя подсветка скал и 10 минут на лодке.\n* Античный город Каунос, древний акрополь и амфитеатр: 1.5 км [переправа на весельной лодке через реку Дальян и пеший маршрут].\n* Всемирно известный песчаный пляж Изтузу [İztuzu]: 11 км [около 15 минут на машине или 30-40 минут на живописном речном катере-такси через лабиринты камышей]. Заповедная зона обитания гигантских морских черепах Caretta-Caretta.\n* Термальные радоновые источники и омолаживающие грязи Султание [Sultaniye Kaplıcaları]: 4 км по воде на озере Кёйджегиз.\n* Озеро Кёйджегиз [Köyceğiz Gölü]: 5 км до выхода из русла реки в открытую озерную акваторию.\n* Смотровая площадка Радар [Radar Tepesi]: 8 км [панорамный обзор 360° на всю дельту реки, озеро и косу пляжа Изтузу с высоты 500 метров].\n* Международный аэропорт Даламан [DLM]: 30 км [25-30 минут на машине или индивидуальном трансфере].\n* Субботний фермерский рынок Дальяна: 600 метров [свежие фермерские сыры, оливки, гранатовый сок, инжир и фрукты].\n* Морские курорты: город Мармарис - 85 км, город Фетхие и бухта Олюдениз - 60 км.",
    "Dalyan Turaman [private pool, sleeps 10] is a digital web platform for direct online booking of a premium, two-story villa in the eco-reserve resort of Dalyan [Ortaca district, Muğla Province, Turkey], located between the Dalyan River and Lake Köyceğiz.\n\nOfficial address and navigation:\n* Villa address: Dalyan, Rodoslu Yaşar Sünger Sk, NO 28/2, 48600 Ortaca / Muğla, Turkey.\n* Google Maps geolocation link: https://maps.app.goo.gl/tPgCjCwz4pzq28pE9\n* Exact GPS coordinates: 36.8336° N, 28.6439° E.\n\nFull list of key geographical landmarks:\n* Dalyan Pedestrian Center: just 250 meters (3-minute walk) to the main pedestrian street with shops, markets, pharmacies, and souvenir shops.\n* Dalyan River Promenade: 400 meters for morning jogs, evening strolls, and boat watching.\n* Cuisine: popular fine dining restaurant La Boheme Dalyan - 350 meters; traditional fish restaurant Çiçek Restoran - 500 meters.\n* Lycian Rock Tombs of the Kings of Kaunos [4th century BC]: panoramic view from the Dalyan waterfront [450 meters], evening cliff illumination, and a 10-minute boat ride.\n* Ancient City of Kaunos, ancient acropolis, and amphitheater: 1.5 km [rowboat crossing the Dalyan River and hiking trail].\n* World-famous sandy beach of Iztuzu: 11 km [about 15 minutes by car or 30-40 minutes by scenic river taxi through a labyrinth of reeds]. Protected habitat of the giant Caretta-Caretta sea turtles.\n* Thermal radon springs and rejuvenating mud of Sultaniye: 4 km by boat on Lake Köyceğiz. * Köyceğiz Lake [Köyceğiz Gölü]: 5 km before leaving the riverbed for the open lake.\n* Radar Viewpoint [Radar Tepesi]: 8 km [360° panoramic view of the entire river delta, lake, and Iztuzu Beach spit from an altitude of 500 meters].\n* Dalaman International Airport [DLM]: 30 km [25-30 minutes by car or private transfer].\n* Dalyan Saturday Farmers' Market: 600 meters [fresh farm cheeses, olives, pomegranate juice, figs, and fruit].\n* Seaside resorts: Marmaris - 85 km, Fethiye and Ölüdeniz Bay - 60 km.",
    "Dalyan Turaman [özel havuz, 10 kişi kapasiteli], Dalyan Nehri ve Köyceğiz Gölü arasında yer alan Dalyan'daki [Ortaca ilçesi, Muğla ili, Türkiye] ekolojik rezerv alanında bulunan birinci sınıf, iki katlı bir villanın doğrudan çevrimiçi rezervasyonu için dijital bir web platformudur.\n\nResmi adres ve yol tarifi:\n* Villa adresi: Dalyan, Rodoslu Yaşar Sünger Sk, NO 28/2, 48600 Ortaca / Muğla, Türkiye.\n\n* Google Haritalar konum bağlantısı: https://maps.app.goo.gl/tPgCjCwz4pzq28pE9\n* Tam GPS koordinatları: 36.8336° K, 28.6439° D.\n\nÖnemli coğrafi yer işaretlerinin tam listesi:\n* Dalyan Yaya Merkezi: Mağazaların, pazarların, eczanelerin ve hediyelik eşya dükkanlarının bulunduğu ana yaya caddesine sadece 250 metre (3 dakikalık yürüme mesafesi).\n* Dalyan Nehri Gezinti Yolu: Sabah koşuları, akşam yürüyüşleri ve tekne izleme için 400 metre.\n\n* Mutfak: Popüler lüks restoran La Boheme Dalyan - 350 metre; geleneksel balık restoranı Çiçek Restoran - 500 metre.\n\n* Kaunos Krallarının Likya Kaya Mezarları [MÖ 4. yüzyıl]: Dalyan kıyısından panoramik manzara [450 metre], akşam kaya aydınlatması ve 10 dakikalık tekne yolculuğu.\n\n* Kaunos Antik Kenti, antik akropolis ve amfitiyatro: 1,5 km [Dalyan Nehri'ni kürekli tekneyle geçme ve yürüyüş parkuru].\n\n* Dünyaca ünlü İztuzu kumlu plajı: 11 km [arabayla yaklaşık 15 dakika veya sazlık labirentinden geçen manzaralı nehir taksisiyle 30-40 dakika]. Dev Caretta-Caretta deniz kaplumbağalarının koruma altındaki yaşam alanı.\n* Sultaniye'nin termal radon kaynakları ve gençleştirici çamuru: Köyceğiz Gölü'nde tekneyle 4 km. * Köyceğiz Gölü: Nehir yatağından açık göle geçmeden 5 km önce.\n\n* Radar Gözlem Noktası: 8 km [500 metre yükseklikten tüm nehir deltası, göl ve İztuzu Plajı'nın 360° panoramik manzarası].\n\n* Dalaman Uluslararası Havalimanı: 30 km [araba veya özel transferle 25-30 dakika].\n\n* Dalyan Cumartesi Çiftçi Pazarı: 600 metre [taze çiftlik peynirleri, zeytin, nar suyu, incir ve meyve].\n\n* Sahil beldeleri: Marmaris - 85 km, Fethiye ve Ölüdeniz Koyu - 60 km.",
    "",
    "Вкл"
  ],
  [
    "4. О вилле",
    "about_sec_2_title",
    "Модальное окно: Раздел 2 Заголовок",
    "2. Архитектура виллы и номерной фонд",
    "2. Villa architecture and room stock",
    "2. Villa mimarisi ve oda düzeni",
    "",
    "Вкл"
  ],
  [
    "4. О вилле",
    "about_sec_2_text",
    "Модальное окно: Раздел 2 Текст",
    "Тип недвижимости: Дом / Вилла [в распоряжении гостей жилье целиком].\nПлощадь, этажность и год постройки: 240 кв. метров, 2 этажа, год постройки - 2013.\nВместимость: до 10 гостей [включая детей], 10 полноценных спальных мест.\nКонфигурация спален и санузлов: 4 большие спальни [каждая оборудована персональной ванной комнатой и автономным кондиционером] + гостевой туалет на первом этаже:\nПервый этаж: полноценная кухня Beko, просторная гостиная со Smart TV 55\", гостевой туалет, прихожая, постирочная, Спальня 1 [квин-сайз + односпальная кровать, ванная с душем, кондиционер].\nВторой этаж: Спальня 2 [кинг-сайз, ванная с тропическим душем, кондиционер, балкон], Спальня 3 [квин-сайз, ванная, кондиционер, вид на горы], Спальня 4 [квин-сайз + односпальная кровать, ванная, кондиционер], вторая стиральная машина.\nИтоговая структура: 4 двуспальные кровати + 2 односпальные кровати + диван в гостиной = 10 спальных мест.",
    "Property Type: House/Villa [guests have access to the entire property].\nArea, Number of Floors, and Year Built: 240 sq. m, 2 floors, built in 2013.\nCapacity: Up to 10 guests [including children], 10 full beds.\nBedroom and bathroom configuration: 4 large bedrooms (each with an en-suite bathroom and independent air conditioning) + guest toilet on the ground floor:\nFirst floor: Full Beko kitchen, spacious living room with 55\" Smart TV, guest toilet, hallway, laundry room, Bedroom 1 [queen + single bed, en-suite with shower, air conditioning].\nSecond floor: Bedroom 2 [king, en-suite with rain shower, air conditioning, balcony], Bedroom 3 [queen, en-suite, air conditioning, mountain views], Bedroom 4 [queen + single bed, en-suite, air conditioning], second washing machine.\nFinal layout: 4 double beds + 2 single beds + sofa in the living room = 10 beds.",
    "Mülk Tipi: Ev/Villa [konuklar tüm mülke erişebilir].\nAlan, Kat Sayısı ve İnşa Yılı: 240 m², 2 katlı, 2013 yılında inşa edilmiştir.\nKapasite: 10 kişiye kadar [çocuklar dahil], 10 adet çift kişilik yatak.\nYatak odası ve banyo düzeni: Zemin katta 4 geniş yatak odası (her biri özel banyo ve bağımsız klima ile) + misafir tuvaleti:\nBirinci kat: Tam donanımlı Beko mutfak, 55 inç Smart TV'li geniş oturma odası, misafir tuvaleti, koridor, çamaşırhane, Yatak Odası 1 [çift kişilik + tek kişilik yatak, duşlu özel banyo, klima].\nİkinci kat: Yatak Odası 2 [king yatak, yağmur duşlu özel banyo, klima, balkon], Yatak Odası 3 [çift kişilik yatak, özel banyo, klima, dağ manzarası], Yatak Odası 4 [çift kişilik + tek kişilik yatak, özel banyo, klima], ikinci çamaşır makinesi.\nSon yerleşim: Oturma odasında 4 çift kişilik yatak + 2 tek kişilik yatak + kanepe = 10 yatak.",
    "",
    "Вкл"
  ],
  [
    "4. О вилле",
    "about_sec_3_title",
    "Модальное окно: Раздел 3 Заголовок",
    "3. Придомовая территория, бассейн и спа-комплекс",
    "3. The local area, swimming pool and spa complex",
    "3. Bölge, yüzme havuzu ve spa kompleksi",
    "",
    "Вкл"
  ],
  [
    "4. О вилле",
    "about_sec_3_text",
    "Модальное окно: Раздел 3 Текст",
    "Приватный бассейн с соленой водой: чаша 4×9 метров [площадь 36 кв. м], постоянная глубина 150 см. Без запаха хлора. Доступен с 1 мая по 1 ноября. Чистка в день заселения и каждые 7 дней. Подсветка бассейна: 20:00 - 01:00.\nУличное приватное джакузи: на 4 персоны, автоматический цикл [15 минут работы каждые 45 минут в период 10:00 - 17:00]. Подсветка джакузи: 20:00 - 01:00. Сезон: 1 мая - 1 ноября.\nОсвещение территории: автоматическое [20:00 - 01:00 и 04:00 - 06:00].\nПарковка: бесплатная закрытая частная парковка на территории на 2 авто.\nОткрытые зоны отдыха: огороженный сад, барбекю [BBQ], крыльцо с кофейными столиками, обеденный стол на 8 мест, шезлонги и летний душ.",
    "Private saltwater pool: 4x9 meter pool (36 sq. m), constant depth of 150 cm. No chlorine odor. Available from May 1st to November 1st. Cleaning on arrival day and every 7 days. Pool lighting: 8:00 PM - 1:00 AM.\nOutdoor private jacuzzi: for 4 people, automatic cycle [15-minute run every 45 minutes from 10:00 AM - 5:00 PM]. Jacuzzi lighting: 8:00 PM - 1:00 AM. Season: May 1st - November 1st.\nGrounds lighting: automatic [8:00 PM - 1:00 AM and 4:00 AM - 6:00 AM].\nParking: Free private enclosed parking on site for 2 cars. Outdoor recreation areas include a fenced garden, BBQ, porch with coffee tables, 8-seat dining table, sun loungers and an outdoor shower.",
    "Özel tuzlu su havuzu: 4x9 metre havuz (36 m²), 150 cm sabit derinlik. Klor kokusu yok. 1 Mayıs - 1 Kasım tarihleri ​​arasında kullanılabilir. Giriş gününde ve her 7 günde bir temizlik yapılır. Havuz aydınlatması: 20:00 - 01:00.\nÖzel açık hava jakuzisi: 4 kişilik, otomatik döngü [10:00 - 17:00 arası her 45 dakikada bir 15 dakikalık çalışma]. Jakuzi aydınlatması: 20:00 - 01:00. Sezon: 1 Mayıs - 1 Kasım.\nBahçe aydınlatması: otomatik [20:00 - 01:00 ve 04:00 - 06:00].\nOtopark: Tesis bünyesinde 2 araçlık ücretsiz özel kapalı otopark. Açık hava dinlenme alanları arasında çitli bahçe, barbekü, sehpalı veranda, 8 kişilik yemek masası, şezlonglar ve açık duş bulunmaktadır.",
    "",
    "Вкл"
  ],
  [
    "4. О вилле",
    "about_sec_4_title",
    "Модальное окно: Раздел 4 Заголовок",
    "4. Юридический регламент, безопасность и доступная среда",
    "4. Legal regulations, safety and accessible environment",
    "4. Yasal düzenlemeler, güvenlik ve erişilebilir ortam",
    "",
    "Вкл"
  ],
  [
    "4. О вилле",
    "about_sec_4_text",
    "Модальное окно: Раздел 4 Текст",
    "Закон Турции № 7464 о краткосрочной аренде: обязательный договор аренды виллы с описью имущества при заселении.\nРегистрация в системе учета населения KBS: обязательное предоставление паспортов всех проживающих. Размещение незарегистрированных лиц строго запрещено.\nБезопасность дома: внешнее видеонаблюдение по периметру, детекторы дыма во всех спальнях и гостиной, огнетушитель, аптечка первой помощи.\nДоступная среда: выделенная парковка для инвалидов, ровный освещенный вход без ступеней, дверь от 81 см, подъемник для бассейна и джакузи.\nПолитика отмены: менее 28 ночей - Негибкие, от 28 ночей - Строгие. Опция невозвратного тарифа со скидкой 10% за 60 дней.",
    "Turkish Short-Term Rental Law No. 7464: A mandatory villa rental agreement with an inventory of the property is required upon arrival.\nKBS Population Registration System: Passports of all residents are required. Unregistered occupants are strictly prohibited.\nHome Security: External perimeter video surveillance, smoke detectors in all bedrooms and the living room, fire extinguisher, and first aid kit.\nAccessibility: Dedicated disabled parking, level, illuminated, step-free entrance, door height of at least 81 cm, pool and jacuzzi lift.\nCancellation Policy: Less than 28 nights - Inflexible, 28 nights or more - Strict. Non-refundable rate option with a 10% discount for 60 days.",
    "Türk Kısa Süreli Kiralama Kanunu No. 7464: Varışta, mülkün envanterini içeren zorunlu bir villa kiralama sözleşmesi gereklidir.\nKBS Nüfus Kayıt Sistemi: Tüm sakinlerin pasaportları gereklidir. Kayıt dışı sakinlerin konaklaması kesinlikle yasaktır.\nEv Güvenliği: Dış çevre video gözetimi, tüm yatak odalarında ve oturma odasında duman dedektörleri, yangın söndürücü ve ilk yardım çantası.\nErişilebilirlik: Engelliler için özel park yeri, düz, aydınlatmalı, basamaksız giriş, en az 81 cm kapı yüksekliği, havuz ve jakuzi asansörü.\nİptal Politikası: 28 geceden az - Esnek değil, 28 gece veya daha fazla - Kesinlikle. 60 gün için %10 indirimli, iade edilmeyen fiyat seçeneği.",
    "",
    "Вкл"
  ],
  [
    "4. О вилле",
    "about_sec_5_title",
    "Модальное окно: Раздел 5 Заголовок",
    "5. Профиль суперхозяина и мастер-доступ",
    "5. Superhost profile and master access",
    "5. Süper sunucu profili ve ana erişim",
    "",
    "Вкл"
  ],
  [
    "4. О вилле",
    "about_sec_5_text",
    "Модальное окно: Раздел 5 Текст",
    "Владелец: Алексей Знаменский [Aleksei Znamenskii]. Проживает в Мармарисе, яхтсмен на пенсии. Жизненное кредо: «Хочешь сделать хорошо - сделай сам». Мечта: отправиться в Португалию и увидеть океан. Хобби: велоспорт, парусный спорт, природа. Штампы путешествий: Дубай [3 поездки], Абу-Даби [март 2026 г.]. Языки: русский, английский, турецкий. Налоговые реквизиты: Ortaca Vergi Dairesi, VKN: 9991120181.\nМастер-доступ суперхозяина: villaturaman@gmail.com, логин admin / пароль admin123, роль: Владелец [Финансы, Периоды, Блокировки, Окно брони, Чаты].",
    "Owner: Aleksei Znamenskii. Lives in Marmaris, retired yachtsman. Life motto: \"If you want something done right, do it yourself.\" Dream: to go to Portugal and see the ocean. Hobbies: cycling, sailing, nature. Travel stamps: Dubai [3 trips], Abu Dhabi [March 2026]. Languages: Russian, English, Turkish. Tax details: Ortaca Vergi Dairesi, VKN: 9991120181.\nSuperhost master access: villaturaman@gmail.com, login admin / password admin123, role: Owner [Finances, Periods, Blocks, Booking Window, Chats].",
    "Sahibi: Aleksei Znamenskii. Marmaris'te yaşıyor, emekli yatçı. Hayat felsefesi: \"Bir şeyin doğru yapılmasını istiyorsanız, kendiniz yapın.\" Hayali: Portekiz'e gidip okyanusu görmek. Hobileri: bisiklet, yelken, doğa. Seyahat damgaları: Dubai [3 gezi], Abu Dhabi [Mart 2026]. Diller: Rusça, İngilizce, Türkçe. Vergi bilgileri: Ortaca Vergi Dairesi, VKN: 9991120181.\nSüper ev sahibi ana erişimi: villaturaman@gmail.com, kullanıcı adı admin / şifre admin123, rol: Sahip [Finans, Dönemler, Bloklar, Rezervasyon Penceresi, Sohbetler].",
    "",
    "Вкл"
  ],
  [
    "4. О вилле",
    "about_sec_6_title",
    "Модальное окно: Раздел 6 Заголовок",
    "6. Возможна прогулка на морской яхте",
    "6. A trip on a sea yacht is possible",
    "6. Deniz yatıyla seyahat mümkündür.",
    "",
    "Вкл"
  ],
  [
    "4. О вилле",
    "about_sec_6_text",
    "Модальное окно: Раздел 6 Текст",
    "Яхта произведена в Германии в 2022 году. \nМодель BAVARIA C45. На площади более 60 м² организовано уютное пространство для путешествий.\nТри каюты, в каждой из них кровать 140 см на 200 см. Такое же спальное место [140 см на 200 см] можно организовать в салоне [стол трансформер]. В кокпите так же столы трансформируются в лежаки, где два взрослых человека комфортно разместятся на ночевку и вахту. Итого 10 спальных мест.\nХолодная и горячая вода присутствует. \nДва туалета с электрической системой слива оборудованы баком-накопителем по 70 литров каждый. Две душевые кабинки и один открытый душ на откидной платформе для купания. \nДва холодильника и отдельная морозильная камера, газовая плита, духовой шкаф, посудомоечная машина, посуда, кухонная техника с кофемашиной - к услугам тех, кто хочет отличиться на кухне и удивить команду. Так же возможно приготовление блюд нашей командой. \nДля дальних переходов на яхте имеется генератор и солнечные панели. \nДве зоны отдыха под навесами, а так же открытые зоны для загара на палубе яхты. \nДля купания откидная платформа имеет удобную систему спуска в воду. \nТехнические данные:\nОбщая длина 14,06 м. Ширина корпуса 4,49 м. Осадка [Киль] 2,60 м. Вес балласта [киль] 2,984 кг. Топливный бак 250 литров. Резервуар для воды 650 литров. Паруса: Грот [закрутка] 51,0 м². Кливер 45,0 м². Генуя 52,0 м². Длина мачты [макс.] от ватерлинии 22,00 м. Район плавания Категория CE А10/Б14/С16 [неограниченно]. Дизайн яхты Cossutti. Безопасность на яхте обеспечена необходимым комплектом: 12 спасательных жилетов, спасательный плот на 10 человек, динги с мотором на 6 человек и другое спасательное оборудование по регламенту. \nТак же на борту имеются: надувные каяк, саб, ватрушка и маски для подводного плавания, применяемые для водных развлечений.",
    "The yacht was built in Germany in 2022.\nModel BAVARIA C45. Over 60 m² of space offers a cozy space for exploring.\nThree cabins, each with a 140 cm x 200 cm bed. A similar berth (140 cm x 200 cm) can be arranged in the salon (transformable table). The cockpit tables also transform into sun loungers, comfortably accommodating two adults for overnight stays and watchkeeping. A total of 10 berths are provided.\nHot and cold running water is available.\nTwo toilets with electric flush systems are equipped with a 70-liter holding tank each. Two shower stalls and one outdoor shower on a fold-down bathing platform.\nTwo refrigerators and a separate freezer, a gas stove, oven, dishwasher, dishes, and kitchen appliances with a coffee machine are available for those who want to excel in the kitchen and impress the crew. Meals can also be prepared by the crew.\n\nFor long-distance cruising, the yacht is equipped with a generator and solar panels.\n\nTwo recreation areas under awnings, as well as open sunbathing areas on the yacht's deck, are available.\n\nFor swimming, a folding platform has a convenient launch system.\n\nTechnical data:\nOverall length: 14.06 m. Hull width: 4.49 m. Draft: 2.60 m. Ballast weight: 2.984 kg. Fuel tank: 250 liters. Water tank: 650 liters. Sails: Mainsail (furling): 51.0 m². Jib: 45.0 m². Genoa 52.0 m². Mast length [max.] from waterline 22.00 m. Sailing area Category CE A10/B14/C16 [unlimited]. Yacht design by Cossutti. Safety on board is ensured by the necessary equipment: 12 life jackets, a 10-person life raft, a 6-person motorized dinghy, and other required safety equipment. \nAlso on board are an inflatable kayak, a SUP, a tube, and snorkeling masks for water activities.",
    "Yat, 2022 yılında Almanya'da inşa edilmiştir.\nBAVARIA C45 modeli. 60 m²'den fazla alan, keşif için rahat bir ortam sunmaktadır.\nHer biri 140 cm x 200 cm yatak bulunan üç kabin. Salonda (dönüştürülebilir masa) benzer bir yatak (140 cm x 200 cm) düzenlenebilir. Kokpit masaları ayrıca güneşlenme şezlonglarına dönüşerek, gece konaklamaları ve nöbet tutma için iki yetişkini rahatça ağırlayabilir. Toplam 10 yatak mevcuttur.\nSıcak ve soğuk akan su mevcuttur.\nHer biri 70 litrelik atık su tankına sahip elektrikli sifon sistemli iki tuvalet. İki duş kabini ve katlanır yüzme platformu üzerinde bir açık duş.\nMutfakta ustalaşmak ve mürettebatı etkilemek isteyenler için iki buzdolabı ve ayrı bir dondurucu, gazlı ocak, fırın, bulaşık makinesi, tabaklar ve kahve makinesi içeren mutfak aletleri mevcuttur. Yemekler mürettebat tarafından da hazırlanabilir.\n\nUzun mesafeli seyirler için yat, jeneratör ve güneş panelleriyle donatılmıştır.\n\nİki adet tente altında dinlenme alanı ve yatın güvertesinde açık güneşlenme alanları mevcuttur.\n\nYüzme için, kullanışlı bir fırlatma sistemine sahip katlanır bir platform bulunmaktadır.\n\nTeknik veriler:\nToplam uzunluk: 14,06 m. Gövde genişliği: 4,49 m. Su çekimi: 2,60 m. Balast ağırlığı: 2,984 kg. Yakıt deposu: 250 litre. Su deposu: 650 litre. Yelkenler: Ana yelken (sarmalı): 51,0 m². Flok: 45,0 m². Cenova: 52,0 m². Direk uzunluğu [maks.] su hattından 22,00 m. Yelken alanı Kategorisi CE A10/B14/C16 [sınırsız]. Yat tasarımı: Cossutti. Gemideki güvenlik, gerekli ekipmanlarla sağlanmaktadır: 12 can yeleği, 10 kişilik can salı, 6 kişilik motorlu bot ve diğer gerekli güvenlik ekipmanları.\n\nAyrıca gemide şişme kayak, SUP, tüp ve su aktiviteleri için şnorkel maskeleri de bulunmaktadır.",
    "",
    "Вкл"
  ],
  [
    "4. О вилле",
    "about_sec_7_title",
    "Модальное окно: Раздел 7 Заголовок",
    "7. Возможно путешествие на кемпере",
    "7. Traveling by camper is possible",
    "7. Karavanla seyahat mümkündür.",
    "",
    "Вкл"
  ],
  [
    "4. О вилле",
    "about_sec_7_text",
    "Модальное окно: Раздел 7 Текст",
    "Тур «Всё» - это возможность за 1 неделю неспешно отдохнуть меняя ритм, стиль и вид отдыха. Это очень круто. За это время вы однозначно почувствуете разнообразие и красоту Турции и в том числе замечательного места города Дальян [провинция Мугла]. Предъявляя разные требования и пожелания к своему досугу, вы в конечном итоге, будете удовлетворены и поймете, что это было замечательно и великолепно. И скажите мне: Спасибо. Это было настоящее приключение. \nНазвание: Тур «Всё». Вилла, яхта, кемпер, SUP, каяк, велосипеды...\nПлан тура:\nVilla Turaman [2 дня 2 ночи] - Яхта Vasilisa [2 дня 1 ночь] - Кемпер [1 день 2 ночи] - Villa Turaman [2 дня 1 ночь]\n\n1 и 2 день - Villa Turaman [2 дня 2 ночи]: \n1 день. Трансфер из аэропорта. Заселение на виллу после 16.00. Вечерний променад по набережной и пешеходной улице города Дальян. Ужин в ресторане.\n2 день. Отдых на вилле, бассейн. Можно выехать в древний город или взять напрокат лодку с экскурсией по реке. Половить крабов и в конечном итоге по реке добраться до пляжа. День свободный, сможете принять сами решение как его провести. Мы со своей стороны обеспечим вас транспортом и сопровождением по всем местам, что мы знаем всё вам покажем. Этот день мы можем с вами спланировать при формировании брони и сделать его максимально интересным для вас.\n3 и 4 день - Яхта Vasilisa [2 дня 1 ночь]:\n3 день. 6:00 подъем. Сборы. Завтрак. Выезд на яхту Vasilisa в Marmaris. 9.30 заходим на яхту. Готовимся отходить. Маршрут: Marmaris Yacht Marina - Ekincik.\n4 и 5 день - Кемпер Adria Adora 673 PK [1 день 2 ночи]:\n4 день. 16:00 Сборы. На моторной лодке отчаливаем с яхты Vasilisa и двигаемся 5 - 10 минут к берегу бухты Ekincik. Там на береговой линии бухты нас ждет оборудованная площадка для отдыха на караване.\nНеобычный и абсолютно новый семейный караван Adria Adora 673 PK на берегу Средиземного моря в прекрасном тихом месте Ekincik находится в 60 минутах езды от виллы Turaman, выполненный в стиле минимализма, вмещает 3 спальные зоны:\n- в передней части: двуспальная кровать с панорамным видом;\n- в середине: раздельный санузел, обеденная зона со столом, которая разбирается в большую кровать, а напротив кухня;\n- в задней части: комната с диваном и вторым спальным ярусом, отлично подойдет в качестве детской комнаты;\nВ Кемпере Adria Adora 673 PK есть все для полного комфорта: два входа, отопление и бойлер, пол с подогревом, кондиционер, штатное место для аккумулятора, увеличенный холодильник, автоматический слив воды, аудиосистема, установлен бак для воды, вытяжка в кухне, а в комплекте идут: ковры, бак для серой воды, противооткатные упоры. Тип санузла: Раздельный.\nТак же вам будут предоставлены: гриль и принадлежности, маски для плавания, уличная пляжная мебель и посуда.\n6 и 7 день - Villa Turaman [2 дня 2 ночи]:\n6 день. Возвращаемся на виллу. Вечерний променад по набережной и пешеходной улице города Дальян. Ужин в ресторане.\n7 день. Выезд с виллы до 9.00: Завтрак. Трансфер до аэропорта.\nВсе это можно продлить по вашему желанию.\nЕсли у вас есть вопросы, свяжитесь с суперхозяином Алексеем в чате.",
    "The \"Everything\" tour is an opportunity to unwind in one week, changing your pace, style, and type of vacation. It's absolutely fantastic. During this time, you'll definitely experience the diversity and beauty of Turkey, including the wonderful city of Dalyan (Mugla Province). Although you may have different expectations and desires for your leisure time, you'll ultimately be satisfied and realize that it was wonderful and magnificent. And tell me: Thank you. It was a real adventure.\n\nTitle: \"Everything\" Tour. Villa, yacht, camper, SUP, kayak, bicycles...\nTour Plan:\nVilla Turaman [2 days 2 nights] - Yacht Vasilisa [2 days 1 night] - Camper [1 day 2 nights] - Villa Turaman [2 days 1 night]\n\nDays 1 and 2 - Villa Turaman [2 days 2 nights]:\nDay 1. Airport transfer. Check-in at the villa after 4:00 PM. An evening stroll along the Dalyan promenade and pedestrian street. Dinner at a restaurant.\nDay 2. Relax at the villa, pool. You can visit the ancient city or rent a boat for a river excursion. Catch crabs and eventually reach the beach by boat. The day is free, and you can decide how to spend it. We will provide transportation and escort you to all the places we know and will show you. We can plan this day together when making your reservation and make it as interesting as possible for you.\nDays 3 and 4 - Yacht Vasilisa [2 days, 1 night]:\nDay 3. Wake up at 6:00 AM. Pack up. Breakfast. Departure for the yacht Vasilisa in Marmaris. Board the yacht at 9:30 AM. Prepare to depart. Route: Marmaris Yacht Marina - Ekincik.\nDays 4 and 5 - Adria Adora 673 PK Camper [1 day 2 nights]:\nDay 4. 4:00 PM. We depart the Vasilisa yacht by motorboat and travel 5-10 minutes to the shore of Ekincik Bay. There, on the bay's shoreline, a well-equipped campervan area awaits.\nThis unique and brand-new family caravan, the Adria Adora 673 PK, is located on the Mediterranean coast in the beautiful, quiet location of Ekincik, a 60-minute drive from Villa Turaman. Designed in a minimalist style, it features three sleeping areas:\n- Forward: a double bed with panoramic views;\n- Middle: separate bathroom, dining area with table that converts into a large bed, and opposite is the kitchen;\n- Rear: a room with a sofa and a second bunk, perfect for a children's room;\nThe Adria Adora 673 PK camper has everything you need for complete comfort: two entrances, heating and a boiler, underfloor heating, air conditioning, a dedicated battery compartment, an oversized refrigerator, automatic drain, an audio system, a water tank, a kitchen hood, and carpets, a grey water tank, and wheel chocks are included. Bathroom type: Separate.\nYou will also be provided with a grill and accessories, snorkels, outdoor beach furniture, and dishes.\nDays 6 and 7 - Villa Turaman [2 days 2 nights]:\nDay 6. Return to the villa. Evening promenade along the promenade and pedestrian street of Dalyan. Dinner at the restaurant.\nDay 7. Check-out before 9:00 AM: Breakfast. Airport transfer.\nAll of this can be extended at your request.\nIf you have any questions, please contact superhost Alexey via chat.",
    "\"Her Şey\" turu, bir hafta boyunca rahatlamak, tempoyu, tarzı ve tatil türünü değiştirmek için bir fırsattır. Kesinlikle harika. Bu süre zarfında, Dalyan'ın (Muğla ili) muhteşem şehri de dahil olmak üzere Türkiye'nin çeşitliliğini ve güzelliğini kesinlikle deneyimleyeceksiniz. Boş zamanınız için farklı beklentileriniz ve istekleriniz olsa da, sonunda memnun kalacak ve harika ve muhteşem olduğunu anlayacaksınız. Ve bana söyleyin: Teşekkür ederim. Gerçek bir maceraydı.\n\nBaşlık: \"Her Şey\" Turu. Villa, yat, karavan, SUP, kayak, bisikletler...\nTur Planı:\nVilla Turaman [2 gün 2 gece] - Yat Vasilisa [2 gün 1 gece] - Karavan [1 gün 2 gece] - Villa Turaman [2 gün 1 gece]\n\n1. ve 2. Günler - Villa Turaman [2 gün 2 gece]:\n1. Gün. Havaalanı transferi. Saat 16:00'dan sonra villaya giriş. Dalyan sahil şeridi ve yaya caddesinde akşam yürüyüşü. Restoranda akşam yemeği.\n2. Gün. Villada, havuzda dinlenin. Antik kenti ziyaret edebilir veya nehir gezisi için tekne kiralayabilirsiniz. Yengeç yakalayabilir ve sonunda tekneyle sahile ulaşabilirsiniz. Gün serbesttir ve nasıl geçireceğinize siz karar verebilirsiniz. Bildiğimiz ve size göstereceğimiz tüm yerlere ulaşımınızı sağlayacağız ve size eşlik edeceğiz. Rezervasyonunuzu yaparken bu günü birlikte planlayabilir ve sizin için mümkün olduğunca ilgi çekici hale getirebiliriz.\n3. ve 4. Günler - Vasilisa Yat [2 gün, 1 gece]:\n3. Gün. Sabah 6:00'da uyanın. Eşyalarınızı toplayın. Kahvaltı. Marmaris'teki Vasilisa yatına hareket. Saat 9:30'da yata binin. Harekete hazırlanın. Güzergah: Marmaris Yat Limanı - Ekincik.\n4. ve 5. Günler - Adria Adora 673 PK Karavan [1 gün 2 gece]:\n4. Gün. 16:00. Vasilisa yatından motorlu tekneyle ayrılıp Ekincik Koyu kıyısına 5-10 dakika yolculuk yapıyoruz. Orada, koyun kıyısında, iyi donanımlı bir karavan alanı bizi bekliyor.\nBu eşsiz ve yepyeni aile karavanı, Adria Adora 673 PK, Akdeniz kıyısında, güzel ve sakin Ekincik bölgesinde, Villa Turaman'a 60 dakikalık sürüş mesafesinde yer almaktadır. Minimalist bir tarzda tasarlanan karavan, üç uyku alanına sahiptir:\n- Ön: Panoramik manzaralı çift kişilik yatak;\n\n- Orta: Ayrı banyo, büyük bir yatağa dönüşen masa bulunan yemek alanı ve karşısında mutfak;\n\n- Arka: Çocuk odası için mükemmel olan, kanepe ve ikinci bir ranza bulunan bir oda;\n\nAdria Adora 673 PK karavanı, tam konfor için ihtiyacınız olan her şeye sahiptir: iki giriş, ısıtma ve kazan, yerden ısıtma, klima, özel akü bölmesi, büyük boy buzdolabı, otomatik tahliye, ses sistemi, su deposu, mutfak davlumbazı ve halılar, gri su deposu ve tekerlek takozları dahildir. Banyo tipi: Ayrı.\n\nAyrıca size mangal ve aksesuarları, şnorkeller, dış mekan plaj mobilyaları ve tabaklar da sağlanacaktır.\n6. ve 7. Günler - Villa Turaman [2 gün 2 gece]:\n6. Gün. Villaya dönüş. Dalyan'ın sahil şeridi ve yaya caddesinde akşam gezintisi. Restoranda akşam yemeği.\n\n7. Gün. Sabah 9:00'dan önce çıkış: Kahvaltı. Havaalanı transferi.\nTüm bunlar isteğiniz üzerine uzatılabilir.\nHerhangi bir sorunuz varsa, lütfen süper ev sahibi Alexey ile sohbet yoluyla iletişime geçin.",
    "",
    "Вкл"
  ],
  [
    "5. Спальни",
    "sleeping_title",
    "Заголовок секции спальных мест",
    "Где вы будете спать • 10 спальных мест в 4 спальнях",
    "Where you'll sleep • Sleeps 10 in 4 bedrooms",
    "Konaklama yerleri • 4 yatak odasında 10 kişi konaklayabilir",
    "",
    "Вкл"
  ],
  [
    "5. Спальни",
    "bedroom_1",
    "Спальня 1 [1 этаж] • Queen + Single [3 места]",
    "Спальня 1 [1 этаж] • Queen + Single [3 места]",
    "Bedroom 1 [1st floor] • Queen + Single [3 beds]",
    "Yatak Odası 1 [1. kat] • Çift kişilik + Tek kişilik [3 yatak]",
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600",
    "Вкл"
  ],
  [
    "5. Спальни",
    "bedroom_1_desc",
    "Описание спальни 1",
    "Первый этаж: 1 двуспальная кровать Queen + 1 односпальная кровать, персональная ванная с душевой кабиной, кондиционер",
    "First floor: 1 queen bed + 1 single bed, private bathroom with shower, air conditioning",
    "Birinci kat: 1 adet çift kişilik yatak + 1 adet tek kişilik yatak, duşlu özel banyo, klima.",
    "BedDouble",
    "Вкл"
  ],
  [
    "5. Спальни",
    "bedroom_1_badge",
    "Бейдж кровати спальни 1",
    "Queen + Single [3 места]",
    "Queen + Single [3 places]",
    "Kraliçe + Tekli [3 kişilik yer]",
    "",
    "Вкл"
  ],
  [
    "5. Спальни",
    "bedroom_2",
    "Спальня 2 [2 этаж] • King Bed [2 места]",
    "Спальня 2 [2 этаж] • King Bed [2 места]",
    "Bedroom 2 [2nd floor] • King Bed [2 beds]",
    "Yatak Odası 2 [2. kat] • Çift Kişilik Yatak [2 yatak]",
    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600",
    "Вкл"
  ],
  [
    "5. Спальни",
    "bedroom_2_desc",
    "Описание спальни 2",
    "Второй этаж: 1 большая двуспальная кровать King Size, собственная ванная комната, кондиционер, балкон с видом на горы",
    "Second floor: 1 king size bed, private bathroom, air conditioning, balcony with mountain views",
    "İkinci kat: 1 adet çift kişilik yatak, özel banyo, klima, dağ manzaralı balkon.",
    "BedDouble",
    "Вкл"
  ],
  [
    "5. Спальни",
    "bedroom_2_badge",
    "Бейдж кровати спальни 2",
    "King Bed [2 места]",
    "King Bed [2 places]",
    "Çift kişilik büyük yatak [2 kişilik]",
    "",
    "Вкл"
  ],
  [
    "5. Спальни",
    "bedroom_3",
    "Спальня 3 [2 этаж] • Queen Bed [2 места]",
    "Спальня 3 [2 этаж] • Queen Bed [2 места]",
    "Bedroom 3 [2nd floor] • Queen Bed [2 beds]",
    "Yatak Odası 3 [2. kat] • Çift Kişilik Yatak [2 yatak]",
    "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600",
    "Вкл"
  ],
  [
    "5. Спальни",
    "bedroom_3_desc",
    "Описание спальни 3",
    "Второй этаж: 1 двуспальная кровать Queen Size, собственная ванная комната, кондиционер, гардероб",
    "Second floor: 1 queen size bed, private bathroom, air conditioning, wardrobe",
    "İkinci kat: 1 adet çift kişilik yatak, özel banyo, klima, gardırop.",
    "Bed",
    "Вкл"
  ],
  [
    "5. Спальни",
    "bedroom_3_badge",
    "Бейдж кроватей спальни 3",
    "Queen Bed [2 места]",
    "Queen Bed [2 places]",
    "Çift Kişilik Yatak [2 kişilik]",
    "",
    "Вкл"
  ],
  [
    "5. Спальни",
    "bedroom_4",
    "Спальня 4 [2 этаж] • Queen + Single [3 места]",
    "Спальня 4 [2 этаж] • Queen + Single [3 места]",
    "Bedroom 4 [2nd floor] • Queen + Single [3 beds]",
    "Yatak Odası 4 [2. kat] • Çift kişilik + Tek kişilik [3 yatak]",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600",
    "Вкл"
  ],
  [
    "5. Спальни",
    "bedroom_4_desc",
    "Описание спальни 4",
    "Второй этаж: 1 двуспальная кровать Queen + 1 дополнительная односпальная кровать, собственная ванная комната, кондиционер",
    "Second floor: 1 queen bed + 1 extra single bed, private bathroom, air conditioning",
    "İkinci kat: 1 adet çift kişilik yatak + 1 adet ilave tek kişilik yatak, özel banyo, klima.",
    "Sofa",
    "Вкл"
  ],
  [
    "5. Спальни",
    "bedroom_4_badge",
    "Бейдж дивана спальни 4",
    "Queen + Single [3 места]",
    "Queen + Single [3 places]",
    "Kraliçe + Tekli [3 kişilik yer]",
    "",
    "Вкл"
  ],
  [
    "6. Удобства",
    "amenities_title",
    "Заголовок секции удобств",
    "Что есть в этом жилье",
    "What is in this housing?",
    "Bu konutun içinde ne var?",
    "",
    "Вкл"
  ],
  [
    "6. Удобства",
    "amenities_btn_all",
    "Кнопка открытия модального окна всех удобств",
    "Показать все удобства",
    "Show all amenities",
    "Tüm olanakları göster",
    "",
    "Вкл"
  ],
  [
    "6. Удобства",
    "amenity_main_1",
    "Основное удобство 1 на главной",
    "Приватный открытый бассейн 36 м²",
    "Private outdoor pool 36 m²",
    "36 m²'lik özel açık yüzme havuzu",
    "Waves",
    "Вкл"
  ],
  [
    "6. Удобства",
    "amenity_main_2",
    "Основное удобство 2 на главной",
    "Уличное джакузи на 4 персоны",
    "Outdoor Jacuzzi for 4 people",
    "4 kişilik açık hava jakuzisi",
    "Sparkles",
    "Вкл"
  ],
  [
    "6. Удобства",
    "amenity_main_3",
    "Основное удобство 3 на главной",
    "Скоростной Wi-Fi: [WIFI_NAME]",
    "High-speed Wi-Fi: [WIFI_NAME]",
    "Yüksek hızlı Wi-Fi: [WIFI_NAME]",
    "Wifi",
    "Вкл"
  ],
  [
    "6. Удобства",
    "amenity_main_4",
    "Основное удобство 4 на главной",
    "Кондиционеры во всех 4 спальнях",
    "Air conditioning in all 4 bedrooms",
    "4 yatak odasının tamamında klima mevcuttur.",
    "Wind",
    "Вкл"
  ],
  [
    "6. Удобства",
    "amenity_main_5",
    "Основное удобство 5 на главной",
    "Полноценная кухня Beko",
    "Beko full kitchen",
    "Beko tam donanımlı mutfak",
    "Utensils",
    "Вкл"
  ],
  [
    "6. Удобства",
    "amenity_main_6",
    "Основное удобство 6 на главной",
    "Бесплатная парковка на 2 авто",
    "Free parking for 2 cars",
    "2 araç için ücretsiz park yeri",
    "Car",
    "Вкл"
  ],
  [
    "6. Удобства",
    "amenity_main_7",
    "Основное удобство 7 на главной",
    "Зона BBQ и обеденный стол на 8 мест",
    "BBQ area and dining table for 8 people",
    "Barbekü alanı ve 8 kişilik yemek masası",
    "Flame",
    "Вкл"
  ],
  [
    "6. Удобства",
    "amenity_main_8",
    "Основное удобство 8 на главной",
    "Стиральная машина на каждом этаже",
    "Washing machine on each floor",
    "Her katta çamaşır makinesi bulunmaktadır.",
    "WashingMachine",
    "Вкл"
  ],
  [
    "6. Удобства",
    "amenity_main_9",
    "Основное удобство 9 на главной",
    "Доступная среда и подъемник",
    "Accessible environment and lift",
    "Erişilebilir ortam ve asansör",
    "Shield",
    "Вкл"
  ],
  [
    "6. Удобства",
    "amenity_main_10",
    "Основное удобство 10 на главной",
    "Видеонаблюдение и датчики дыма",
    "Video surveillance and smoke detectors",
    "Video gözetimi ve duman dedektörleri",
    "ShieldCheck",
    "Вкл"
  ],
  [
    "6. Удобства",
    "amenity_cat1_title",
    "Модальное окно: Категория 1 Заголовок",
    "Виды и природа",
    "Species and nature",
    "Türler ve doğa",
    "Mountain",
    "Вкл"
  ],
  [
    "6. Удобства",
    "amenity_cat1_item1",
    "Модальное окно: Категория 1 Пункт 1",
    "Панорамный вид на горы Дальяна",
    "Panoramic view of the Dalyan mountains",
    "Dalyan dağlarının panoramik manzarası",
    "Check",
    "Вкл"
  ],
  [
    "6. Удобства",
    "amenity_cat1_item2",
    "Модальное окно: Категория 1 Пункт 2",
    "Вид на реку и сад",
    "View of the river and garden",
    "Nehir ve bahçe manzarası",
    "Check",
    "Вкл"
  ],
  [
    "6. Удобства",
    "amenity_cat1_item3",
    "Модальное окно: Категория 1 Пункт 3",
    "Близость набережной Дальяна [400 м]",
    "Proximity to Dalyan's promenade [400 m]",
    "Dalyan sahil yoluna yakınlık [400 m]",
    "Check",
    "Вкл"
  ],
  [
    "6. Удобства",
    "amenity_cat2_title",
    "Модальное окно: Категория 2 Заголовок",
    "Бассейн и спа",
    "Pool and spa",
    "Havuz ve spa",
    "Waves",
    "Вкл"
  ],
  [
    "6. Удобства",
    "amenity_cat2_item1",
    "Модальное окно: Категория 2 Пункт 1",
    "Приватный бассейн с соленой водой 4×9 м [глубина 1.5м]",
    "Private salt water pool 4x9m [depth 1.5m]",
    "Özel tuzlu su havuzu 4x9m [derinlik 1.5m]",
    "Check",
    "Вкл"
  ],
  [
    "6. Удобства",
    "amenity_cat2_item2",
    "Модальное окно: Категория 2 Пункт 2",
    "Шезлонги и зона для загара",
    "Sun loungers and sunbathing area",
    "Şezlonglar ve güneşlenme alanı",
    "Check",
    "Вкл"
  ],
  [
    "6. Удобства",
    "amenity_cat2_item3",
    "Модальное окно: Категория 2 Пункт 3",
    "Летний душ у бассейна",
    "Summer shower by the pool",
    "Havuz başında yaz duşu",
    "Check",
    "Вкл"
  ],
  [
    "6. Удобства",
    "amenity_cat2_item4",
    "Модальное окно: Категория 2 Пункт 4",
    "Уличное джакузи на 4 персоны [10:00-17:00, 15 мин каждые 45 мин]",
    "Outdoor Jacuzzi for 4 persons [10:00-17:00, 15 min every 45 min]",
    "4 kişilik açık hava jakuzisi [10:00-17:00, her 45 dakikada bir 15 dakika]",
    "Check",
    "Вкл"
  ],
  [
    "6. Удобства",
    "amenity_cat3_title",
    "Модальное окно: Категория 3 Заголовок",
    "Кухня и столовая",
    "Kitchen and dining room",
    "Mutfak ve yemek odası",
    "Utensils",
    "Вкл"
  ],
  [
    "6. Удобства",
    "amenity_cat3_item1",
    "Модальное окно: Категория 3 Пункт 1",
    "Большой двухкамерный холодильник Beko",
    "Large two-chamber refrigerator Beko",
    "Büyük boy iki bölmeli Beko buzdolabı",
    "Check",
    "Вкл"
  ],
  [
    "6. Удобства",
    "amenity_cat3_item2",
    "Модальное окно: Категория 3 Пункт 2",
    "Посудомоечная машина",
    "Dishwasher",
    "Bulaşık makinesi",
    "Check",
    "Вкл"
  ],
  [
    "6. Удобства",
    "amenity_cat3_item3",
    "Модальное окно: Категория 3 Пункт 3",
    "Духовой шкаф Beko и варочная панель",
    "Beko oven and hob",
    "Beko fırın ve ocak",
    "Check",
    "Вкл"
  ],
  [
    "6. Удобства",
    "amenity_cat3_item4",
    "Модальное окно: Категория 3 Пункт 4",
    "Кофемашина эспрессо и чайник",
    "Espresso coffee machine and kettle",
    "Espresso kahve makinesi ve su ısıtıcısı",
    "Check",
    "Вкл"
  ],
  [
    "6. Удобства",
    "amenity_cat3_item5",
    "Модальное окно: Категория 3 Пункт 5",
    "Полный комплект посуды и бокалов для вина",
    "A complete set of tableware and wine glasses",
    "Komple bir yemek takımı ve şarap kadehleri ​​seti.",
    "Check",
    "Вкл"
  ],
  [
    "6. Удобства",
    "amenity_cat4_title",
    "Модальное окно: Категория 4 Заголовок",
    "Комфорт и связь",
    "Comfort and communication",
    "Konfor ve iletişim",
    "Wifi",
    "Вкл"
  ],
  [
    "6. Удобства",
    "amenity_cat4_item1",
    "Модальное окно: Категория 4 Пункт 1",
    "Скоростной оптоволоконный Wi-Fi",
    "High-speed fiber-optic Wi-Fi",
    "Yüksek hızlı fiber optik Wi-Fi",
    "Check",
    "Вкл"
  ],
  [
    "6. Удобства",
    "amenity_cat4_item2",
    "Модальное окно: Категория 4 Пункт 2",
    "Сплит-системы кондиционирования во всех спальнях",
    "Split-system air conditioning in all bedrooms",
    "Tüm yatak odalarında split sistem klima mevcuttur.",
    "Check",
    "Вкл"
  ],
  [
    "6. Удобства",
    "amenity_cat4_item3",
    "Модальное окно: Категория 4 Пункт 3",
    "Smart TV 55 дюймов с Netflix и YouTube",
    "55-inch Smart TV with Netflix and YouTube",
    "Netflix ve YouTube özellikli 55 inçlik Akıllı TV",
    "Check",
    "Вкл"
  ],
  [
    "6. Удобства",
    "amenity_cat4_item4",
    "Модальное окно: Категория 4 Пункт 4",
    "Обеденная зона на воздухе на 8 мест и крыльцо",
    "8-seat outdoor dining area and porch",
    "8 kişilik açık hava yemek alanı ve veranda",
    "Check",
    "Вкл"
  ],
  [
    "6. Удобства",
    "amenity_cat5_title",
    "Модальное окно: Категория 5 Заголовок",
    "Безопасность дома",
    "Home safety",
    "Ev güvenliği",
    "Shield",
    "Вкл"
  ],
  [
    "6. Удобства",
    "amenity_cat5_item1",
    "Модальное окно: Категория 5 Пункт 1",
    "Огороженная приватная территория и автоматическое освещение",
    "Fenced private area and automatic lighting",
    "Çitlerle çevrili özel alan ve otomatik aydınlatma",
    "Check",
    "Вкл"
  ],
  [
    "6. Удобства",
    "amenity_cat5_item2",
    "Модальное окно: Категория 5 Пункт 2",
    "Система наружного видеонаблюдения по периметру",
    "Outdoor perimeter video surveillance system",
    "Dış mekan çevre video gözetim sistemi",
    "Check",
    "Вкл"
  ],
  [
    "6. Удобства",
    "amenity_cat5_item3",
    "Модальное окно: Категория 5 Пункт 3",
    "Датчики дыма и аптечка первой помощи",
    "Smoke detectors and first aid kit",
    "Duman dedektörleri ve ilk yardım çantası",
    "Check",
    "Вкл"
  ],
  [
    "6. Удобства",
    "amenity_cat5_item4",
    "Модальное окно: Категория 5 Пункт 4",
    "Огнетушитель",
    "Fire extinguisher",
    "Yangın söndürücü",
    "Check",
    "Вкл"
  ],
  [
    "7. Отзывы",
    "reviews_score_header",
    "Заголовок рейтинга в блоке отзывов",
    "4.98 • Рейтинг гостей на основе 48 отзывов",
    "4.98 • Guest rating based on 48 reviews",
    "4,98 • 48 değerlendirmeye göre misafir puanı",
    "Star",
    "Вкл"
  ],
  [
    "7. Отзывы",
    "review_cat_1",
    "Критерий 1: Чистота",
    "Чистота",
    "Purity",
    "Saflık",
    "5.0|100",
    "Вкл"
  ],
  [
    "7. Отзывы",
    "review_cat_2",
    "Критерий 2: Точность описания",
    "Точность описания",
    "Accuracy of description",
    "Tanımın doğruluğu",
    "4.9|98",
    "Вкл"
  ],
  [
    "7. Отзывы",
    "review_cat_3",
    "Критерий 3: Общение с хозяином",
    "Общение с хозяином",
    "Communication with the owner",
    "Mülk sahibiyle iletişim",
    "5.0|100",
    "Вкл"
  ],
  [
    "7. Отзывы",
    "review_cat_4",
    "Критерий 4: Расположение",
    "Расположение",
    "Location",
    "Konum",
    "4.9|98",
    "Вкл"
  ],
  [
    "7. Отзывы",
    "review_cat_5",
    "Критерий 5: Прибытие и заезд",
    "Прибытие и заезд",
    "Arrival and check-in",
    "Varış ve giriş işlemleri",
    "5.0|100",
    "Вкл"
  ],
  [
    "7. Отзывы",
    "review_cat_6",
    "Критерий 6: Цена / качество",
    "Соотношение цена/качество",
    "Price/quality ratio",
    "Fiyat/kalite oranı",
    "4.9|98",
    "Вкл"
  ],
  [
    "7. Отзывы",
    "review_1_author",
    "Отзыв 1: Автор и дата",
    "Елена Смирнова • Август 2026",
    "Elena Smirnova • August 2026",
    "Elena Smirnova • Ağustos 2026",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120",
    "Вкл"
  ],
  [
    "7. Отзывы",
    "review_1_text",
    "Отзыв 1: Текст отзыва",
    "Потрясающая вилла! Вид на горы просто захватывает дух, бассейн с соленой водой чистейший, джакузи великолепно расслабляет. Алексей был на связи 24/7, помог организовать незабываемый круиз на лодке по озеру Кёйджегиз. Обязательно вернемся!",
    "The villa is stunning! The mountain views are breathtaking, the saltwater pool is crystal clear, and the jacuzzi is incredibly relaxing. Alexey was available 24/7 and helped organize an unforgettable boat cruise on Lake Köyceğiz. We'll definitely be back!",
    "Villa muhteşem! Dağ manzarası nefes kesici, tuzlu su havuzu kristal berraklığında ve jakuzi inanılmaz derecede rahatlatıcı. Alexey 7/24 ulaşılabilir durumdaydı ve Köyceğiz Gölü'nde unutulmaz bir tekne turu organize etmemize yardımcı oldu. Kesinlikle geri döneceğiz!",
    "",
    "Вкл"
  ],
  [
    "7. Отзывы",
    "review_2_author",
    "Отзыв 2: Автор и дата",
    "Markus Webber • Июль 2026",
    "Markus Webber • July 2026",
    "Markus Webber • Temmuz 2026",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120",
    "Вкл"
  ],
  [
    "7. Отзывы",
    "review_2_text",
    "Отзыв 2: Текст отзыва",
    "Outstanding hospitality and pristine villa in the heart of Dalyan. Fast Wi-Fi, 4 spacious bedrooms, and peaceful neighborhood. Aleksei is truly a top Superhost!",
    "Outstanding hospitality and pristine villa in the heart of Dalyan. Fast Wi-Fi, 4 spacious bedrooms, and peaceful neighborhood. Aleksei is truly a top Superhost!",
    "Dalyan'ın kalbinde olağanüstü misafirperverlik ve tertemiz bir villa. Hızlı Wi-Fi, 4 geniş yatak odası ve huzurlu bir mahalle. Aleksei gerçekten de mükemmel bir ev sahibi!",
    "",
    "Вкл"
  ],
  [
    "7. Отзывы",
    "review_3_author",
    "Отзыв 3: Автор и дата",
    "Ahmet Yılmaz • Июнь 2026",
    "Ahmet Yılmaz • June 2026",
    "Ahmet Yılmaz • Июнь 2026",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120",
    "Вкл"
  ],
  [
    "7. Отзывы",
    "review_3_text",
    "Отзыв 3: Текст отзыва",
    "Dalyan'da kaldığımız en konforlu villa. 4 banyolu 4 yatak odası ailemiz için mükemmeldi. Bahçe ve havuz bakımı harikaydı, teşekkürler Aleksei!",
    "The most comfortable villa we stayed in Dalyan. Four bedrooms with four bathrooms were perfect for our family. The garden and pool maintenance was fantastic, thank you Aleksei!",
    "Dalyan'da kaldığımız en konforlu villa. 4 banyolu 4 yatak odası ailemiz için mükemmeldi. Bahçe ve havuz bakımı harikaydı, teşekkürler Aleksei!",
    "",
    "Вкл"
  ],
  [
    "7. Отзывы",
    "review_4_author",
    "Отзыв 4: Автор и дата",
    "Дмитрий и Анна • Май 2026",
    "Dmitry and Anna • May 2026",
    "Dmitry ve Anna • Mayıs 2026",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120",
    "Вкл"
  ],
  [
    "7. Отзывы",
    "review_4_text",
    "Отзыв 4: Текст отзыва",
    "Идеально для семейного отдыха до 10 человек. Закрытая территория, 250 метров до центра Дальяна, тишина. Видео-гид от Алексея открыл нам секретные пляжи и отличные рыбные рестораны.",
    "Ideal for a family vacation of up to 10 people. Gated area, 250 meters from the center of Dalyan, quiet. Alexey's video guide revealed secret beaches and excellent seafood restaurants.",
    "10 kişiye kadar olan aileler için ideal bir tatil yeri. Güvenlikli site içerisinde, Dalyan merkezine 250 metre mesafede, sakin bir konumda. Alexey'in video rehberi gizli plajları ve mükemmel deniz ürünleri restoranlarını ortaya çıkardı.",
    "",
    "Вкл"
  ],
  [
    "8. Локация",
    "location_title",
    "Заголовок секции локации",
    "Расположение: Дальян, Ортаджа, Мугла, Турция",
    "Location: Dalyan, Ortaca, Mugla, Turkey",
    "Konum: Dalyan, Ortaca, Muğla, Türkiye",
    "MapPin",
    "Вкл"
  ],
  [
    "8. Локация",
    "location_desc",
    "Подробный текст об окрестностях Дальяна",
    "Вилла Turaman находится в самом центре Дальяна: всего 250 метров до пешеходной улицы, 400 метров до речной набережной, 350 метров до ресторана La Boheme Dalyan. Песчаный пляж Изтузу - 11 км [15 минут на машине или лодке], аэропорт Даламан - 30 км. В пешей доступности древний город Каунос и Ликийские гробницы.",
    "Villa Turaman is located in the heart of Dalyan: just 250 meters from the pedestrian street, 400 meters from the river promenade, and 350 meters from the La Boheme Dalyan restaurant. Iztuzu Beach is 11 km away (15 minutes by car or boat), and Dalaman Airport is 30 km away. The ancient city of Kaunos and the Lycian tombs are within walking distance.",
    "Villa Turaman, Dalyan'ın kalbinde yer almaktadır: yaya caddesine sadece 250 metre, nehir kıyısına 400 metre ve La Boheme Dalyan restoranına 350 metre mesafededir. İztuzu Plajı 11 km (araba veya tekneyle 15 dakika) ve Dalyan Havalimanı 30 km uzaklıktadır. Kaunos antik kenti ve Likya mezarları yürüme mesafesindedir.",
    "",
    "Вкл"
  ],
  [
    "8. Локация",
    "location_badge",
    "Текст плашки GPS и расстояния до аэропорта",
    "GPS: 36.8336° N, 28.6439° E • 250м до центра • 11 км до пляжа Изтузу • 30 км до DLM",
    "GPS: 36.8336° N, 28.6439° E • 250 m to the center • 11 km to Iztuzu beach • 30 km to DLM",
    "GPS: 36.8336° K, 28.6439° D • Merkeze 250 m • İztuzu plajına 11 km • DLM'ye 30 km",
    "Navigation",
    "Вкл"
  ],
  [
    "8. Локация",
    "location_image",
    "Панорамная фотография окрестностей",
    "Фото природы Дальяна",
    "Photos of Dalyan's natural surroundings",
    "Dalyan'ın doğal çevresine ait fotoğraflar",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200",
    "Вкл"
  ],
  [
    "9. Хозяин",
    "host_card_title",
    "Заголовок карточки владельца",
    "Хозяин: Алексей Знаменский",
    "Owner: Alexey Znamensky",
    "Sahibi: Alexey Znamensky",
    "",
    "Вкл"
  ],
  [
    "9. Хозяин",
    "host_card_subtitle",
    "Подзаголовок статуса суперхозяина",
    "Суперхозяин на Airbnb • Яхтсмен на пенсии • Живет в Мармарисе",
    "Airbnb Superhost • Retired Sailor • Lives in Marmaris",
    "Airbnb Süper Ev Sahibi • Emekli Denizci • Marmaris'te yaşıyor",
    "Award",
    "Вкл"
  ],
  [
    "9. Хозяин",
    "host_card_verified",
    "Бейдж подтверждения личности",
    "Личность подтверждена • Девиз: «Хочешь сделать хорошо - сделай сам»",
    "Identity verified • Motto: “If you want something done well, do it yourself”",
    "Kimlik doğrulandı • Slogan: “Bir işin iyi yapılmasını istiyorsanız, kendiniz yapın”",
    "ShieldCheck",
    "Вкл"
  ],
  [
    "9. Хозяин",
    "host_card_response_time",
    "Бейдж времени ответа на сообщения",
    "Время ответа: в течение часа • Языки: RU, EN, TR",
    "Response time: within an hour • Languages: RU, EN, TR",
    "Yanıt süresi: bir saat içinde • Diller: RU, EN, TR",
    "Clock",
    "Вкл"
  ],
  [
    "9. Хозяин",
    "host_card_languages",
    "Заголовок языков общения",
    "Интересы: Велоспорт, Парусный спорт, Природа • Мечта: Португалия",
    "Interests: Cycling, Sailing, Nature • Dream: Portugal",
    "İlgi Alanları: Bisiklet, Yelken, Doğa • Hayal: Portekiz",
    "Globe2",
    "Вкл"
  ],
  [
    "9. Хозяин",
    "host_card_help_text",
    "Описание помощи гостям",
    "Штампы путешествий: Дубай [3 поездки], Абу-Даби [март 2026 г.]. Помощь в организации трансфера, аренде авто и экскурсий.",
    "Travel stamps: Dubai [3 trips], Abu Dhabi [March 2026]. Assistance with organizing transfers, car rentals, and excursions.",
    "Seyahat damgaları: Dubai [3 gezi], Abu Dhabi [Mart 2026]. Transferlerin, araç kiralamanın ve gezilerin organize edilmesinde yardım.",
    "",
    "Вкл"
  ],
  [
    "9. Хозяин",
    "host_card_btn",
    "Текст кнопки связи с хозяином",
    "Написать хозяину",
    "Write to the owner",
    "Sahibine yazın.",
    "MessageCircle",
    "Вкл"
  ],
  [
    "9. Хозяин",
    "host_card_credo",
    "Жизненное кредо суперхозяина",
    "«Хочешь сделать хорошо - сделай сам»",
    "\"If you want something done right, do it yourself.\"",
    "\"Bir işin doğru yapılmasını istiyorsanız, kendiniz yapın.\"",
    "Quote",
    "Вкл"
  ],
  [
    "9. Хозяин",
    "host_card_dream",
    "Мечта и базирование",
    "База: Мармарис • Мечта: Португалия и Атлантический океан",
    "Base: Marmaris • Dream: Portugal and the Atlantic Ocean",
    "Üs:Marmaris • Rüya: Portekiz ve Atlas Okyanusu",
    "Compass",
    "Вкл"
  ],
  [
    "9. Хозяин",
    "host_card_hobbies",
    "Хобби и спорт суперхозяина",
    "Велоспорт, Парусный спорт, Живая природа Дальяна",
    "Cycling, Sailing, Dalyan Wildlife",
    "Bisiklet, Yelken, Dalyan Vahşi Yaşamı",
    "Bike",
    "Вкл"
  ],
  [
    "9. Хозяин",
    "host_card_travel",
    "Штампы путешествий",
    "Дубай [3 поездки], Абу-Даби [март 2026 г.]",
    "Dubai [3 trips], Abu Dhabi [March 2026]",
    "Dubai [3 gezi], Abu Dabi [Mart 2026]",
    "PlaneTakeoff",
    "Вкл"
  ],
  [
    "9. Хозяин",
    "host_card_tax",
    "Официальные налоговые реквизиты",
    "Официальный налогоплательщик: Ortaca Vergi Dairesi, VKN: 9991120181",
    "Official taxpayer: Ortaca Vergi Dairesi, VKN: 9991120181",
    "Resmi vergi mükellefi: Ortaca Vergi Dairesi, VKN: 9991120181",
    "FileCheck",
    "Вкл"
  ],
  [
    "10. Ориентиры",
    "landmarks_title",
    "Заголовок секции ориентиров",
    "14 географических ориентиров Дальяна",
    "14 Geographical Landmarks of Dalyan",
    "Dalyan'ın 14 Coğrafi Özelliği",
    "MapPin",
    "Вкл"
  ],
  [
    "10. Ориентиры",
    "landmarks_subtitle",
    "Подзаголовок секции ориентиров",
    "Точные расстояния и тайминг от виллы • Пешеходная доступность центра и заповедная природа",
    "Exact distances and timings from the villa • Walking distance to the center and protected nature",
    "Villaya olan kesin mesafeler ve süreler • Merkeze ve koruma altındaki doğaya yürüme mesafesinde",
    "Navigation",
    "Вкл"
  ],
  [
    "10. Ориентиры",
    "landmarks_address",
    "Официальный адрес виллы для навигатора",
    "Dalyan, Rodoslu Yaşar Sünger Sk, NO 28/2, 48600 Ortaca / Muğla, Turkey",
    "Dalyan, Rodoslu Yaşar Sünger Sk, NO 28/2, 48600 Ortaca / Muğla, Turkey",
    "Dalyan, Rodoslu Yaşar Sünger Sk, NO 28/2, 48600 Ortaca / Muğla, Turkey",
    "MapPin",
    "Вкл"
  ],
  [
    "10. Ориентиры",
    "landmarks_maps_url",
    "Прямая ссылка на геолокацию в Google Maps",
    "https://maps.app.goo.gl/tPgCjCwz4pzq28pE9",
    "https://maps.app.goo.gl/tPgCjCwz4pzq28pE9",
    "https://maps.app.goo.gl/tPgCjCwz4pzq28pE9",
    "https://maps.app.goo.gl/tPgCjCwz4pzq28pE9",
    "Вкл"
  ],
  [
    "10. Ориентиры",
    "landmarks_gps",
    "Координаты GPS виллы",
    "36.8336° N, 28.6439° E",
    "36.8336° N, 28.6439° E",
    "36.8336° K, 28.6439° D",
    "Compass",
    "Вкл"
  ],
  [
    "10. Ориентиры",
    "landmark_1",
    "Ориентир 1: Пешеходный центр Дальяна",
    "Пешеходный центр Дальяна: главная улица, рестораны, кофейни, аптеки, банкоматы и сувенирные лавки",
    "Dalyan's pedestrian center: the main street, restaurants, coffee shops, pharmacies, ATMs, and souvenir shops",
    "Dalyan'ın yaya merkezi: ana cadde, restoranlar, kafeler, eczaneler, ATM'ler ve hediyelik eşya dükkanları.",
    "250 м|3 мин пешком|walk|В шаговой доступности|Footprints",
    "Вкл"
  ],
  [
    "10. Ориентиры",
    "landmark_2",
    "Ориентир 2: Речная набережная и причал",
    "Речная набережная и центральный причал речных лодок-такси и экскурсионных катеров",
    "The river embankment and the central pier for river taxi boats and excursion boats",
    "Nehir kıyısı ve nehir taksi tekneleri ile gezi tekneleri için merkezi iskele.",
    "400 м|5 мин пешком|walk|Река Дальян|Compass",
    "Вкл"
  ],
  [
    "10. Ориентиры",
    "landmark_3",
    "Ориентир 3: Ресторан La Boheme Dalyan Bistro",
    "Ресторан авторской кухни La Boheme Dalyan Bistro: средиземноморская и европейская кухня",
    "La Boheme Dalyan Bistro, a signature restaurant serving Mediterranean and European cuisine",
    "La Boheme Dalyan Bistro, Akdeniz ve Avrupa mutfağından yemekler sunan, kendine özgü bir restoran.",
    "350 м|4 мин пешком|food|Гастрономия|Utensils",
    "Вкл"
  ],
  [
    "10. Ориентиры",
    "landmark_4",
    "Ориентир 4: Ресторан Çiçek Restoran",
    "Традиционный эгейский рыбный ресторан Çiçek Restoran: свежайшие морепродукты и домашние мезе",
    "Traditional Aegean fish restaurant Çiçek Restoran: the freshest seafood and homemade mezes",
    "Geleneksel Ege balık restoranı Çiçek Restoran: En taze deniz ürünleri ve ev yapımı mezeler.",
    "500 м|6 мин пешком|food|Свежая рыба|Utensils",
    "Вкл"
  ],
  [
    "10. Ориентиры",
    "landmark_5",
    "Ориентир 5: Субботний фермерский рынок",
    "Субботний фермерский рынок Дальяна: деревенские сыры, оливки, свежие фрукты, специи и гранатовый сок",
    "Dalyan's Saturday Farmers' Market: Country cheeses, olives, fresh fruit, spices, and pomegranate juice",
    "Dalyan'ın Cumartesi Çiftçi Pazarı: Köy peynirleri, zeytinler, taze meyveler, baharatlar ve nar suyu.",
    "600 м|7 мин пешком|walk|Суббота|ShoppingBag",
    "Вкл"
  ],
  [
    "10. Ориентиры",
    "landmark_6",
    "Ориентир 6: Ликийские скальные гробницы",
    "Ликийские скальные гробницы карийских царей IV века до н.э., высеченные в скале, с вечерней иллюминацией",
    "Lycian rock tombs of the Carian kings from the 4th century BC, carved into the rock, with evening illumination",
    "MÖ 4. yüzyıla ait Karya krallarının kayaya oyulmuş Likya kaya mezarları, akşam aydınlatmasıyla birlikte.",
    "450 м|Прямая видимость|nature|UNESCO Heritage|Mountain",
    "Вкл"
  ],
  [
    "10. Ориентиры",
    "landmark_7",
    "Ориентир 7: Античный город Каунос",
    "Античный город Каунос: амфитеатр, римские термы, агора, базилика и акрополь на вершине холма",
    "The ancient city of Kaunos: an amphitheater, Roman baths, agora, basilica and acropolis on a hilltop",
    "Kaunos antik kenti: bir tepe üzerinde yer alan amfi tiyatro, Roma hamamları, agora, bazilika ve akropolis.",
    "1.5 км|Лодка + 15 мин|nature|Античная история|Compass",
    "Вкл"
  ],
  [
    "10. Ориентиры",
    "landmark_8",
    "Ориентир 8: Источники и грязи Султание",
    "Радоновые термальные источники и целебные минеральные грязи Султание на берегу озера Кёйджегиз",
    "Sultaniye's radon thermal springs and healing mineral mud on the shores of Lake Koycegiz",
    "Köyceğiz Gölü kıyısındaki Sultaniye'nin radonlu termal kaynakları ve şifalı mineral çamuru.",
    "4 км лодка / 12 км авто|15-20 мин|nature|Оздоровление|Waves",
    "Вкл"
  ],
  [
    "10. Ориентиры",
    "landmark_9",
    "Ориентир 9: Песчаный черепаший пляж Изтузу",
    "Заповедный песчаный черепаший пляж Изтузу: золотой песок 4.5 км, место гнездования черепах Caretta-Caretta",
    "Iztuzu Turtle Beach: 4.5 km of golden sand, nesting site for Caretta-Caretta turtles",
    "İztuzu Kaplumbağa Plajı: 4,5 km uzunluğunda altın kumlu plaj, Caretta-Caretta kaplumbağalarının yuvalama alanı.",
    "11 км|15 мин авто / 35 мин лодка|beach|Заповедник|Sun",
    "Вкл"
  ],
  [
    "10. Ориентиры",
    "landmark_10",
    "Ориентир 10: Пресноводное озеро Кёйджегиз",
    "Пресноводное озеро Кёйджегиз: живописные заливы, водные прогулки на катерах, сапбординг и рыбалка",
    "Freshwater Lake Köyceğiz: picturesque bays, boat rides, SUP boarding, and fishing",
    "Köyceğiz Tatlı Su Gölü: Manzaralı koylar, tekne gezileri, SUP (stand-up paddleboarding) ve balıkçılık.",
    "5 км|10 мин авто / 25 мин катер|nature|Водный спорт|Waves",
    "Вкл"
  ],
  [
    "10. Ориентиры",
    "landmark_11",
    "Ориентир 11: Смотровая площадка на горе Радар",
    "Смотровая площадка на горе Радар: круговая панорама 360° на дельту реки Дальян, косу Изтузу и море",
    "Radar Mountain Viewpoint: 360° panoramic views of the Dalyan River Delta, Iztuzu Spit, and the sea",
    "Radar Dağı Gözlem Noktası: Dalyan Nehri Deltası, İztuzu Burnu ve denizin 360° panoramik manzarası.",
    "8 км|20 мин на авто|nature|Панорама 360°|Eye",
    "Вкл"
  ],
  [
    "10. Ориентиры",
    "landmark_12",
    "Ориентир 12: Центр реабилитации черепах DEKAMER",
    "Научно-исследовательский и реабилитационный центр спасения морских черепах DEKAMER на пляже Изтузу",
    "DEKAMER Sea Turtle Rescue and Rehabilitation Center at Iztuzu Beach",
    "İztuzu Plajı'ndaki DEKAMER Deniz Kaplumbağası Kurtarma ve Rehabilitasyon Merkezi",
    "12 км|18 мин на авто|nature|Экология|Compass",
    "Вкл"
  ],
  [
    "10. Ориентиры",
    "landmark_13",
    "Ориентир 13: Международный аэропорт Даламан [DLM]",
    "Международный аэропорт Даламан DLM: круглосуточный прием внутренних и международных рейсов",
    "Dalaman International Airport (DLM): 24/7 domestic and international flights",
    "Dalaman Uluslararası Havalimanı (DLM): 7/24 iç ve dış hat uçuşları",
    "30 км|25-30 мин на авто|transport|Аэропорт|Plane",
    "Вкл"
  ],
  [
    "10. Ориентиры",
    "landmark_14",
    "Ориентир 14: Морской курортный город Мармарис",
    "Крупный морской порт и курортный город Мармарис: марины для суперяхт, набережная и шоппинг",
    "The major seaport and resort town of Marmaris: superyacht marinas, a promenade, and shopping",
    "Marmaris, önemli bir liman kenti ve tatil beldesidir: süper yat marinaları, sahil şeridi ve alışveriş merkezleri bulunmaktadır.",
    "85 км|1 час 15 мин на авто|city|Эгейская Ривьера|Car",
    "Вкл"
  ],
  [
    "11. Спа и Бассейн",
    "spa_title",
    "Заголовок секции спа-комплекса",
    "Спа-комплекс и бассейн с соленой водой",
    "Spa complex and salt water pool",
    "Spa kompleksi ve tuzlu su havuzu",
    "Waves",
    "Вкл"
  ],
  [
    "11. Спа и Бассейн",
    "spa_subtitle",
    "Подзаголовок секции спа-комплекса",
    "Приватная закрытая территория, солевой бассейн 36 м², гидромассажное джакузи и лаунж-зона отдыха",
    "A private enclosed area, a 36 m² salt pool, a hydromassage jacuzzi and a lounge area",
    "Özel, kapalı bir alan, 36 m²'lik tuz havuzu, hidromasajlı jakuzi ve bir dinlenme alanı.",
    "Sparkles",
    "Вкл"
  ],
  [
    "11. Спа и Бассейн",
    "spa_pool_title",
    "Название карточки бассейна",
    "Приватный бассейн с соленой водой",
    "Private salt water pool",
    "Özel tuzlu su havuzu",
    "Waves",
    "Вкл"
  ],
  [
    "11. Спа и Бассейн",
    "spa_pool_desc",
    "Характеристики и описание бассейна",
    "Чаша 4 × 9 метров [площадь 36 кв. м], постоянная комфортная глубина 150 см по всей площади чаши. Мягкая природная минерализация исключает раздражение кожи и едкий запах хлора.",
    "The 4 x 9 meter pool (area 36 sq. m) maintains a comfortable depth of 150 cm throughout the entire pool. The gentle natural mineralization eliminates skin irritation and the pungent chlorine smell.",
    "4 x 9 metrelik (36 metrekare alan) havuz, tüm havuz boyunca 150 cm'lik konforlu bir derinliği korur. Nazik doğal mineralizasyon, cilt tahrişini ve keskin klor kokusunu ortadan kaldırır.",
    "Droplets",
    "Вкл"
  ],
  [
    "11. Спа и Бассейн",
    "spa_pool_badge",
    "Бейдж бассейна",
    "Соленая вода без хлора",
    "Salt water without chlorine",
    "Klor içermeyen tuzlu su",
    "",
    "Вкл"
  ],
  [
    "11. Спа и Бассейн",
    "spa_pool_season",
    "Сезон работы бассейна",
    "Сезон работы: с 1 мая по 1 ноября",
    "Opening season: May 1st to November 1st",
    "Sezon açılışı: 1 Mayıs - 1 Kasım",
    "Calendar",
    "Вкл"
  ],
  [
    "11. Спа и Бассейн",
    "spa_pool_lighting",
    "График подсветки бассейна",
    "Подводная ночная подсветка: 20:00 - 01:00",
    "Underwater night lighting: 20:00 - 01:00",
    "Sualtı gece aydınlatması: 20:00 - 01:00",
    "Clock",
    "Вкл"
  ],
  [
    "11. Спа и Бассейн",
    "spa_pool_maintenance",
    "Регламент очистки бассейна",
    "График чистки: в день заселения и далее каждые 7 дней",
    "Cleaning schedule: on the day of check-in and then every 7 days",
    "Temizlik programı: giriş gününde ve ardından her 7 günde bir.",
    "Droplets",
    "Вкл"
  ],
  [
    "11. Спа и Бассейн",
    "spa_jacuzzi_title",
    "Название карточки джакузи",
    "Открытое уличное джакузи",
    "Outdoor jacuzzi",
    "Açık hava jakuzisi",
    "Sparkles",
    "Вкл"
  ],
  [
    "11. Спа и Бассейн",
    "spa_jacuzzi_desc",
    "Описание и функционал джакузи",
    "Гидромассажная спа-ванна в зоне бассейна с подогревом и регулируемыми форсунками для глубокого расслабления на свежем воздухе.",
    "A heated hot tub in the pool area with adjustable jets for deep relaxation in the fresh air.",
    "Havuz alanında, temiz havada derinlemesine rahatlama için ayarlanabilir jetlere sahip ısıtmalı bir jakuzi bulunmaktadır.",
    "Sparkles",
    "Вкл"
  ],
  [
    "11. Спа и Бассейн",
    "spa_jacuzzi_badge",
    "Вместимость джакузи",
    "Вместимость: 4 персоны",
    "Capacity: 4 persons",
    "Kapasite: 4 kişi",
    "",
    "Вкл"
  ],
  [
    "11. Спа и Бассейн",
    "spa_jacuzzi_schedule",
    "Режим и алгоритм джакузи",
    "Режим работы: 10:00 - 17:00 [15 мин каждые 45 мин]",
    "Opening hours: 10:00 - 17:00 [15 min every 45 min]",
    "Açılış saatleri: 10:00 - 17:00 [her 45 dakikada bir 15 dakika]",
    "Clock",
    "Вкл"
  ],
  [
    "11. Спа и Бассейн",
    "spa_jacuzzi_lighting",
    "Подсветка джакузи",
    "Подсветка джакузи: 20:00 - 01:00",
    "Jacuzzi lighting: 8:00 PM - 1:00 AM",
    "Jakuzi aydınlatması: 20:00 - 01:00",
    "Moon",
    "Вкл"
  ],
  [
    "11. Спа и Бассейн",
    "spa_jacuzzi_season",
    "Сезон работы джакузи",
    "Период активности: с 1 мая по 1 ноября",
    "Period of activity: May 1 to November 1",
    "Faaliyet dönemi: 1 Mayıs - 1 Kasım",
    "Calendar",
    "Вкл"
  ],
  [
    "11. Спа и Бассейн",
    "spa_street_lighting_title",
    "Освещение территории",
    "Освещение территории",
    "Lighting of the area",
    "Bölgenin aydınlatılması",
    "Moon",
    "Вкл"
  ],
  [
    "11. Спа и Бассейн",
    "spa_street_lighting_desc",
    "График освещения сада",
    "Автоматическое включение сада: 20:00 - 01:00 и 04:00 - 06:00",
    "Automatic garden switching: 20:00 - 01:00 and 04:00 - 06:00",
    "Otomatik bahçe açma/kapama saatleri: 20:00 - 01:00 ve 04:00 - 06:00",
    "",
    "Вкл"
  ],
  [
    "11. Спа и Бассейн",
    "spa_parking_title",
    "Приватная парковка",
    "Приватная парковка",
    "Private parking",
    "Özel otopark",
    "Car",
    "Вкл"
  ],
  [
    "11. Спа и Бассейн",
    "spa_parking_desc",
    "Описание парковки",
    "Закрытая бесплатная парковка на территории виллы на 2 автомобиля",
    "Closed free parking on the villa's territory for 2 cars",
    "Villanın arazisinde 2 araçlık ücretsiz kapalı otopark mevcuttur.",
    "",
    "Вкл"
  ],
  [
    "11. Спа и Бассейн",
    "spa_bbq_title",
    "Зона BBQ и лаунж",
    "BBQ и обеденная зона",
    "BBQ and dining area",
    "Barbekü ve yemek alanı",
    "Flame",
    "Вкл"
  ],
  [
    "11. Спа и Бассейн",
    "spa_bbq_desc",
    "Описание зоны барбекю",
    "Обеденный стол на 8 мест, гриль на углях, шезлонги и уличный душ",
    "An 8-seat dining table, charcoal grill, sun loungers and an outdoor shower",
    "8 kişilik yemek masası, mangal, şezlonglar ve açık hava duşu.",
    "",
    "Вкл"
  ],
  [
    "12. Безопасность",
    "legal_safety_title",
    "Заголовок секции безопасности и закона",
    "Безопасность, Закон № 7464 и Доступная среда",
    "Safety, Law No. 7464 and Accessibility",
    "Güvenlik, 7464 Sayılı Kanun ve Erişilebilirlik",
    "ShieldCheck",
    "Вкл"
  ],
  [
    "12. Безопасность",
    "legal_safety_subtitle",
    "Подзаголовок секции безопасности и закона",
    "Полное соответствие законодательству Турции о краткосрочной аренде, защита гостей и безбарьерный доступ",
    "Full compliance with Turkish short-term rental legislation, guest protection and barrier-free access",
    "Türk kısa süreli kiralama mevzuatına tam uyum, misafir güvenliği ve engelsiz erişim.",
    "FileText",
    "Вкл"
  ],
  [
    "12. Безопасность",
    "legal_law7464_title",
    "Заголовок блока Закон 7464",
    "Официальный договор и учет KBS",
    "Official contract and KBS accounting",
    "Resmi sözleşme ve KBS muhasebesi",
    "FileText",
    "Вкл"
  ],
  [
    "12. Безопасность",
    "legal_law7464_desc",
    "Описание блока Закон 7464",
    "Вилла осуществляет деятельность в строгом соответствии с Законом № 7464 о краткосрочной туристической аренде в Турции.",
    "The villa operates in strict accordance with Law No. 7464 on Short-Term Tourist Rentals in Turkey.",
    "Villa, Türkiye'deki Kısa Süreli Turist Kiralama Kanunu No. 7464'e tam uyum içinde faaliyet göstermektedir.",
    "",
    "Вкл"
  ],
  [
    "12. Безопасность",
    "legal_law7464_badge",
    "Бейдж закона 7464",
    "Закон Турции № 7464",
    "Turkish Law No. 7464",
    "Türk Kanunu No. 7464",
    "",
    "Вкл"
  ],
  [
    "12. Безопасность",
    "legal_law7464_item1",
    "Пункт 1: Договор найма",
    "Обязательный договор краткосрочного найма с описью имущества при заезде",
    "Mandatory short-term lease agreement with inventory of property upon move-in",
    "Taşınma sırasında eşyaların envanterinin verilmesini içeren zorunlu kısa dönemli kira sözleşmesi.",
    "CheckCircle2",
    "Вкл"
  ],
  [
    "12. Безопасность",
    "legal_law7464_item2",
    "Пункт 2: Регистрация KBS",
    "Регистрация паспортов всех проживающих гостей в полицейской системе KBS [Kimlik Bildirme Sistemi]",
    "Registration of passports of all staying guests in the KBS [Kimlik Bildirme Sistemi] police system",
    "Konaklayan tüm misafirlerin pasaportlarının KBS [Kimlik Bildirme Sistemi] polis sistemine kaydı.",
    "CheckCircle2",
    "Вкл"
  ],
  [
    "12. Безопасность",
    "legal_law7464_item3",
    "Пункт 3: Запрет третьих лиц",
    "Размещение лиц, не внесенных в государственную систему KBS, строго запрещено",
    "The placement of persons not included in the state KBS system is strictly prohibited.",
    "Devlet KBS sistemine dahil olmayan kişilerin yerleştirilmesi kesinlikle yasaktır.",
    "AlertCircle",
    "Вкл"
  ],
  [
    "12. Безопасность",
    "legal_security_title",
    "Заголовок блока безопасности",
    "Безопасность дома и территории",
    "Home and territory security",
    "Ev ve bölge güvenliği",
    "ShieldCheck",
    "Вкл"
  ],
  [
    "12. Безопасность",
    "legal_security_desc",
    "Описание блока безопасности",
    "Оснащение дома сертифицированными системами предупреждения и постоянного мониторинга.",
    "Equipping the house with certified warning and continuous monitoring systems.",
    "Evi sertifikalı uyarı ve sürekli izleme sistemleriyle donatmak.",
    "",
    "Вкл"
  ],
  [
    "12. Безопасность",
    "legal_security_badge",
    "Бейдж стандартов безопасности",
    "Стандарты безопасности",
    "Safety standards",
    "Güvenlik standartları",
    "",
    "Вкл"
  ],
  [
    "12. Безопасность",
    "legal_security_item1",
    "Пункт 1: Наружное видеонаблюдение",
    "Наружные камеры видеонаблюдения установлены строго по периметру забора и у калитки [без съемки бассейна и террасы]",
    "Outdoor CCTV cameras are installed strictly along the perimeter of the fence and at the gate [without filming the pool and terrace]",
    "Dış mekan güvenlik kameraları, havuz ve terası filme almayacak şekilde, yalnızca çitin çevresi boyunca ve kapıya yerleştirilmiştir.",
    "Eye",
    "Вкл"
  ],
  [
    "12. Безопасность",
    "legal_security_item2",
    "Пункт 2: Датчики дыма и газа",
    "Сертифицированные автономные датчики дыма и угарного газа на обоих этажах виллы",
    "Certified independent smoke and carbon monoxide detectors on both floors of the villa",
    "Villanın her iki katında da sertifikalı, bağımsız duman ve karbonmonoksit dedektörleri bulunmaktadır.",
    "Flame",
    "Вкл"
  ],
  [
    "12. Безопасность",
    "legal_security_item3",
    "Пункт 3: Огнетушители и аптечка",
    "Огнетушители на 1 и 2 этажах, укомплектованная медицинская аптечка первой помощи",
    "Fire extinguishers on the 1st and 2nd floors, a fully equipped first aid kit",
    "1. ve 2. katlarda yangın söndürücüler, tam donanımlı bir ilk yardım çantası.",
    "ShieldCheck",
    "Вкл"
  ],
  [
    "12. Безопасность",
    "legal_accessible_title",
    "Заголовок блока доступной среды",
    "Инклюзивность и доступная среда",
    "Inclusiveness and accessibility",
    "Kapsayıcılık ve erişilebilirlik",
    "Accessibility",
    "Вкл"
  ],
  [
    "12. Безопасность",
    "legal_accessible_desc",
    "Описание доступной среды",
    "Создание безбарьерных условий для комфортного отдыха гостей с ограниченной мобильностью.",
    "Creating barrier-free conditions for a comfortable stay for guests with limited mobility.",
    "Hareket kabiliyeti kısıtlı misafirler için konforlu bir konaklama sağlamak amacıyla engelsiz koşullar oluşturmak.",
    "",
    "Вкл"
  ],
  [
    "12. Безопасность",
    "legal_accessible_badge",
    "Бейдж безбарьерной среды",
    "Безбарьерная среда",
    "Barrier-free environment",
    "Engelsiz ortam",
    "",
    "Вкл"
  ],
  [
    "12. Безопасность",
    "legal_accessible_item1",
    "Пункт 1: Спальня 1 этажа",
    "Безбарьерный доступ: спальня №1 на 1 этаже оборудована широкими дверными проемами без порогов",
    "Barrier-free access: Bedroom 1 on the first floor has wide doorways without thresholds",
    "Engelsiz erişim: Birinci kattaki 1 numaralı yatak odasının eşiksiz geniş kapıları vardır.",
    "DoorOpen",
    "Вкл"
  ],
  [
    "12. Безопасность",
    "legal_accessible_item2",
    "Пункт 2: Санузел для МГН",
    "Санузел первого этажа спроектирован с возможностью комфортного использования гостями с ограниченной мобильностью",
    "The first floor bathroom is designed to be comfortable for use by guests with limited mobility.",
    "Birinci kattaki banyo, hareket kabiliyeti kısıtlı misafirlerin rahatça kullanabileceği şekilde tasarlanmıştır.",
    "CheckCircle2",
    "Вкл"
  ],
  [
    "12. Безопасность",
    "legal_accessible_item3",
    "Пункт 3: Подъемник в бассейн",
    "Возможность установки мобильного подъемника для спуска в бассейн по предварительному запросу",
    "Possibility of installing a mobile lift for descent into the pool upon prior request",
    "Önceden talep edilmesi halinde havuza iniş için mobil asansör kurulumu mümkündür.",
    "Accessibility",
    "Вкл"
  ],
  [
    "12. Безопасность",
    "legal_cancellation_title",
    "Заголовок политики отмены",
    "Политика отмены и возврата",
    "Cancellation and Refund Policy",
    "İptal ve Geri Ödeme Politikası",
    "Clock",
    "Вкл"
  ],
  [
    "12. Безопасность",
    "legal_cancellation_desc",
    "Описание политики отмены",
    "Прозрачные финансовые условия бронирования без скрытых штрафов.",
    "Transparent financial booking conditions without hidden penalties.",
    "Gizli cezalar içermeyen şeffaf finansal rezervasyon koşulları.",
    "",
    "Вкл"
  ],
  [
    "12. Безопасность",
    "legal_cancellation_badge",
    "Бейдж возврата 100%",
    "Возврат 100%",
    "100% refund",
    "%100 para iadesi",
    "",
    "Вкл"
  ],
  [
    "12. Безопасность",
    "legal_cancellation_item1",
    "Пункт 1: 14 дней отмена",
    "Полный 100% возврат предоплаты при отмене более чем за 14 суток до даты заезда",
    "Full 100% refund of the prepayment if cancelled more than 14 days before the arrival date",
    "Varış tarihinden 14 günden daha önce iptal edilmesi durumunda ön ödemenin tamamı (%100) iade edilir.",
    "CheckCircle2",
    "Вкл"
  ],
  [
    "12. Безопасность",
    "legal_cancellation_item2",
    "Пункт 2: Менее 14 дней",
    "Отсутствие ключей Vercel KV: В предоставленном .env.local параметры KV_REST_API_URL и KV_REST_API_TOKEN оставлены пустыми. Эти ключи требуются для кэширования статусов форматирования листов и быстрых сессий",
    "Missing Vercel KV keys: In the provided .env.local file, the KV_REST_API_URL and KV_REST_API_TOKEN parameters are left blank. These keys are required for caching sheet formatting statuses and quick sessions.",
    "Vercel KV anahtarları eksik: Sağlanan .env.local dosyasında, KV_REST_API_URL ve KV_REST_API_TOKEN parametreleri boş bırakılmıştır. Bu anahtarlar, sayfa biçimlendirme durumlarının önbelleğe alınması ve hızlı oturumlar için gereklidir.",
    "AlertCircle",
    "Вкл"
  ],
  [
    "12. Безопасность",
    "legal_cancellation_item3",
    "Пункт 3: Инвойс e-Arşiv Fatura",
    "Да, это безопасно и технически необходимо для работы вашей архитектуры.",
    "Yes, it is safe and technically necessary for your architecture to work.",
    "Evet, güvenli ve mimarinizin çalışması için teknik olarak gerekli.",
    "FileText",
    "Вкл"
  ],
  [
    "13. Словарь интерфейса",
    "brandName",
    "Название бренда в шапке",
    "Villa Turaman",
    "Villa Turaman",
    "Villa Turaman",
    "",
    "Вкл"
  ],
  [
    "13. Словарь интерфейса",
    "login",
    "Кнопка входа в аккаунт",
    "Войти",
    "Login",
    "Giriş yapmak",
    "LogIn",
    "Вкл"
  ],
  [
    "13. Словарь интерфейса",
    "register",
    "Кнопка регистрации",
    "Регистрация",
    "Registration",
    "Kayıt",
    "UserPlus",
    "Вкл"
  ],
  [
    "13. Словарь интерфейса",
    "logout",
    "Кнопка выхода из системы",
    "Выйти",
    "Exit",
    "Çıkış",
    "LogOut",
    "Вкл"
  ],
  [
    "13. Словарь интерфейса",
    "guestCabinet",
    "Кнопка кабинета гостя",
    "Мои поездки",
    "My trips",
    "Seyahatlerim",
    "Compass",
    "Вкл"
  ],
  [
    "13. Словарь интерфейса",
    "hostCabinet",
    "Кнопка панели суперхозяина",
    "Панель управления",
    "Control Panel",
    "Kontrol Paneli",
    "LayoutDashboard",
    "Вкл"
  ],
  [
    "13. Словарь интерфейса",
    "navAbout",
    "Пункт меню О вилле",
    "О вилле",
    "About the villa",
    "Villa hakkında",
    "",
    "Вкл"
  ],
  [
    "13. Словарь интерфейса",
    "navAmenities",
    "Пункт меню Удобства",
    "Удобства",
    "Facilities",
    "Tesisler",
    "",
    "Вкл"
  ],
  [
    "13. Словарь интерфейса",
    "navReviews",
    "Пункт меню Отзывы",
    "Отзывы",
    "Reviews",
    "Yorumlar",
    "",
    "Вкл"
  ],
  [
    "13. Словарь интерфейса",
    "navLocation",
    "Пункт меню Расположение",
    "Расположение",
    "Location",
    "Konum",
    "",
    "Вкл"
  ],
  [
    "13. Словарь интерфейса",
    "navCatalog",
    "Пункт меню Услуги и гиды",
    "Услуги и гиды",
    "Services and guides",
    "Hizmetler ve rehberler",
    "",
    "Вкл"
  ],
  [
    "14. Словарь интерфейса",
    "bookNow",
    "Главная кнопка бронирования",
    "Забронировать",
    "Book now",
    "Şimdi rezervasyon yapın",
    "CalendarCheck",
    "Вкл"
  ],
  [
    "14. Словарь интерфейса",
    "checkIn",
    "Поле даты заезда",
    "Заезд",
    "Arrival",
    "Varış",
    "Calendar",
    "Вкл"
  ],
  [
    "14. Словарь интерфейса",
    "checkOut",
    "Поле даты выезда",
    "Выезд",
    "Departure",
    "Kalkış",
    "Calendar",
    "Вкл"
  ],
  [
    "14. Словарь интерфейса",
    "guests",
    "Выбор количества гостей",
    "Гости",
    "Guests",
    "Misafirler",
    "Users",
    "Вкл"
  ],
  [
    "14. Словарь интерфейса",
    "perNight",
    "Подпись тарифа за сутки",
    "за ночь",
    "overnight",
    "gece",
    "",
    "Вкл"
  ],
  [
    "14. Словарь интерфейса",
    "nights",
    "Подпись количества ночей",
    "ночей",
    "nights",
    "geceler",
    "",
    "Вкл"
  ],
  [
    "14. Словарь интерфейса",
    "totalPrice",
    "Итоговая стоимость проживания",
    "Итого к оплате",
    "Total to be paid",
    "Ödenecek toplam tutar",
    "",
    "Вкл"
  ],
  [
    "14. Словарь интерфейса",
    "cleaningFee",
    "Строка сервисного сбора",
    "Сервисный сбор и финальная уборка",
    "Service fee and final cleaning",
    "Hizmet bedeli ve son temizlik",
    "",
    "Вкл"
  ],
  [
    "14. Словарь интерфейса",
    "depositText",
    "Размер гарантийного залога",
    "Возвратный депозит за сохранность имущества",
    "Refundable security deposit",
    "İade edilebilir güvenlik depozitosu",
    "",
    "Вкл"
  ],
  [
    "14. Словарь интерфейса",
    "confirmBooking",
    "Кнопка подтверждения заявки",
    "Подтвердить бронирование",
    "Confirm your booking",
    "Rezervasyonunuzu onaylayın",
    "CheckCircle",
    "Вкл"
  ],
  [
    "14. Словарь интерфейса",
    "selectDates",
    "Подсказка выбора дат",
    "Выберите даты поездки",
    "Select travel dates",
    "Seyahat tarihlerini seçin",
    "Calendar",
    "Вкл"
  ],
  [
    "15. Словарь интерфейса",
    "close",
    "Кнопка закрытия модального окна",
    "Закрыть",
    "Close",
    "Kapalı",
    "X",
    "Вкл"
  ],
  [
    "15. Словарь интерфейса",
    "back",
    "Кнопка возврата назад",
    "Назад",
    "Back",
    "Geri",
    "ArrowLeft",
    "Вкл"
  ],
  [
    "15. Словарь интерфейса",
    "save",
    "Кнопка сохранения данных",
    "Сохранить изменения",
    "Save changes",
    "Değişiklikleri kaydet",
    "Save",
    "Вкл"
  ],
  [
    "15. Словарь интерфейса",
    "showAllPhotos",
    "Кнопка открытия галереи фото",
    "Показать все фото",
    "Show all photos",
    "Tüm fotoğrafları göster",
    "Grid",
    "Вкл"
  ],
  [
    "15. Словарь интерфейса",
    "showAllAmenities",
    "Кнопка открытия всех удобств",
    "Показать все удобства",
    "Show all amenities",
    "Tüm olanakları göster",
    "List",
    "Вкл"
  ],
  [
    "15. Словарь интерфейса",
    "showAllLandmarksBtn",
    "Кнопка показа всех ориентиров",
    "Показать все 14 ориентиров и карту расстояний",
    "Show all 14 landmarks and distance map",
    "14 önemli yerin tamamını ve mesafe haritasını göster",
    "Compass",
    "Вкл"
  ],
  [
    "15. Словарь интерфейса",
    "showAllReviewsBtn",
    "Кнопка показа отзывов",
    "Показать все 48 отзывов и критерии оценок",
    "Show all 48 reviews and rating criteria",
    "Tüm 48 yorumu ve değerlendirme kriterlerini göster",
    "Star",
    "Вкл"
  ],
  [
    "15. Словарь интерфейса",
    "landmarksCategoryTitle",
    "Надзаголовок ориентиров",
    "Географические ориентиры Дальяна",
    "Geographic landmarks of Dalyan",
    "Dalyan'ın coğrafi yer işaretleri",
    "Compass",
    "Вкл"
  ],
  [
    "15. Словарь интерфейса",
    "reviewsCategoryTitle",
    "Надзаголовок отзывов",
    "Рейтинг гостей и отзывы",
    "Guest ratings and reviews",
    "Konuk değerlendirmeleri ve yorumları",
    "Star",
    "Вкл"
  ],
  [
    "15. Словарь интерфейса",
    "reviewsRatingTitle",
    "Шаблон рейтинга отзывов",
    "Рейтинг гостей на основе",
    "Guest rating based on",
    "Misafir değerlendirmesi şu kriterlere dayanmaktadır:",
    "Star",
    "Вкл"
  ],
  [
    "15. Словарь интерфейса",
    "legalRegulationHeader",
    "Надзаголовок безопасности",
    "Юридический регламент и комфорт",
    "Legal regulations and comfort",
    "Yasal düzenlemeler ve rahatlık",
    "ShieldCheck",
    "Вкл"
  ],
  [
    "16. Словарь интерфейса",
    "chatWithHost",
    "Кнопка вызова прямого чата с хозяином",
    "Чат с суперхозяином",
    "Chat with a superhost",
    "Süper sunucuyla sohbet edin",
    "MessageSquare",
    "Вкл"
  ],
  [
    "16. Словарь интерфейса",
    "onlineStatus",
    "Индикатор статуса онлайн",
    "В сети : отвечает мгновенно",
    "Online: Responds instantly",
    "Çevrimiçi: Anında yanıt verir",
    "Radio",
    "Вкл"
  ],
  [
    "16. Словарь интерфейса",
    "typing",
    "Индикатор набора текста",
    "Алексей печатает ответ...",
    "Alexey types a reply...",
    "Alexey bir yanıt yazıyor...",
    "",
    "Вкл"
  ],
  [
    "16. Словарь интерфейса",
    "send",
    "Кнопка отправки сообщения в чат",
    "Отправить",
    "Send",
    "Göndermek",
    "Send",
    "Вкл"
  ],
  [
    "16. Словарь интерфейса",
    "messagePlaceholder",
    "Плейсхолдер поля ввода в чате",
    "Напишите ваш вопрос или пожелание...",
    "Write your question or wish...",
    "Sorunuzu veya dileğinizi yazın...",
    "",
    "Вкл"
  ],
  [
    "16. Словарь интерфейса",
    "bookingSuccess",
    "Уведомление об успешной оплате",
    "Оплата успешно подтверждена! Бронирование внесено в календарь.",
    "Payment successfully confirmed! The reservation has been added to the calendar.",
    "Ödeme başarıyla onaylandı! Rezervasyon takvime eklendi.",
    "CheckCircle2",
    "Вкл"
  ]
];

const MASTER_SETTINGS_ROWS = [
  [
    "СИСТЕМА",
    "ai_mode",
    "autopilot",
    "Режим работы ИИ: autopilot [автоответ], copilot [суфлер хозяина], off [выключен]",
    "Критический"
  ],
  [
    "СИСТЕМА",
    "ai_model",
    "gemini-3.6-flash",
    "Целевая модель Google Gemini: gemini-3.6-flash / gemini-2.5-flash",
    "Высокая скорость"
  ],
  [
    "СИСТЕМА",
    "min_night_price",
    "180",
    "Минимально допустимая цена за сутки бронирования в USD: ниже опускать запрещено",
    "Финансовый барьер"
  ],
  [
    "СИСТЕМА",
    "telegram_bot_token",
    "",
    "Токен Telegram-бота от BotFather для оповещений и мобильного пульта",
    "Безопасность"
  ],
  [
    "СИСТЕМА",
    "telegram_admin_chat_id",
    "",
    "ID чата суперхозяина в Telegram для получения алертов и модерации",
    "Суперхозяин"
  ],
  [
    "СИСТЕМА",
    "vercel_url",
    "https://sitesi-git-v1-airbnb-znamenskiialekseis-projects.vercel.app",
    "Боевой URL платформы на Vercel для вебхуков и ревалидации",
    "Синхронизация"
  ],
  [
    "ПЕРЕМЕННАЯ",
    "wifi_name",
    "Guest",
    "Имя гостевой сети Wi-Fi виллы",
    "Плейсхолдер [WIFI_NAME]"
  ],
  [
    "ПЕРЕМЕННАЯ",
    "wifi_password",
    "villa2026",
    "Пароль гостевой сети Wi-Fi",
    "Плейсхолдер [WIFI_PASSWORD]"
  ],
  [
    "ПЕРЕМЕННАЯ",
    "address",
    "Dalyan, Rodoslu Yaşar Sünger Sk, NO 28/2, 48600 Ortaca / Muğla",
    "Точный физический адрес виллы",
    "Плейсхолдер [ADDRESS]"
  ],
  [
    "ПЕРЕМЕННАЯ",
    "maps_url",
    "https://maps.app.goo.gl/tPgCjCwz4pzq28pE9",
    "Прямая ссылка на геолокацию Google Maps",
    "Плейсхолдер [MAPS_URL]"
  ],
  [
    "ПЕРЕМЕННАЯ",
    "checkin_time",
    "16:00",
    "Стандартное время заезда гостей",
    "Плейсхолдер [CHECKIN_TIME]"
  ],
  [
    "ПЕРЕМЕННАЯ",
    "checkout_time",
    "10:00",
    "Стандартное время выезда гостей",
    "Плейсхолдер [CHECKOUT_TIME]"
  ],
  [
    "ПЕРЕМЕННАЯ",
    "checkin_method",
    "Электронный смарт-замок и мини-сейф с кодом / личная встреча владельцем",
    "Способ передачи ключей",
    "Плейсхолдер [CHECKIN_METHOD]"
  ],
  [
    "ПЕРЕМЕННАЯ",
    "key_handover",
    "Оставьте ключи в мини-сейфе с кодом у входной двери или на кухонном столе",
    "Инструкция возврата ключей",
    "Плейсхолдер [KEY_HANDOVER]"
  ],
  [
    "ПЕРЕМЕННАЯ",
    "platform_name",
    "Villa Turaman Direct",
    "Название платформы бронирования",
    "Плейсхолдер [PLATFORM_NAME]"
  ],
  [
    "О_ХОЗЯИНЕ",
    "host_name",
    "Aleksei Znamenskii",
    "Имя владельца виллы на английском и русском",
    "Плейсхолдер [HOST_NAME]"
  ],
  [
    "О_ХОЗЯИНЕ",
    "host_status",
    "Суперхозяин на Airbnb • Более 5 лет приема гостей",
    "Статус суперхозяина и опыт",
    "Плейсхолдер [HOST_STATUS]"
  ],
  [
    "О_ХОЗЯИНЕ",
    "host_languages",
    "Русский, English, Türkçe",
    "Языки общения с гостями",
    "Плейсхолдер [HOST_LANGUAGES]"
  ],
  [
    "О_ХОЗЯИНЕ",
    "host_response_time",
    "В течение часа",
    "Скорость ответа на сообщения",
    "Плейсхолдер [RESPONSE_TIME]"
  ],
  [
    "О_ХОЗЯИНЕ",
    "host_business",
    "Краткосрочная аренда Villa Turaman [Дальян, Мугла, Турция]",
    "Юридический вид деятельности и бизнес",
    "Бизнес профиль"
  ],
  [
    "О_ВИЛЛЕ",
    "villa_capacity",
    "10 гостей",
    "Максимальная вместимость виллы, включая детей",
    "Плейсхолдер [MAX_GUESTS]"
  ],
  [
    "О_ВИЛЛЕ",
    "villa_floors",
    "2 этажа. Первый этаж: кухня, гостиная со Smart TV 55\", гостевой санузел, стиральная машина, гладильная доска и утюг, спальня на 3 места с ванной. Второй этаж: 3 спальни с ванными комнатами и кондиционерами, доп. кровать и вторая стиральная машина.",
    "Планировка и оснащение этажей",
    "Плейсхолдер [VILLA_FLOORS]"
  ],
  [
    "О_ВИЛЛЕ",
    "pool_specs",
    "Приватный бассейн с соленой водой 36 кв.м и уличное джакузи",
    "Характеристики бассейна и гидромассажа",
    "Плейсхолдер [POOL_SPECS]"
  ],
  [
    "О_ВИЛЛЕ",
    "pool_season",
    "с 1 мая по 1 ноября",
    "Период работы и эксплуатации бассейна и джакузи",
    "Плейсхолдер [POOL_SEASON]"
  ],
  [
    "О_ВИЛЛЕ",
    "jacuzzi_schedule",
    "Работает с 09:00 до 18:00. Включается автоматически на 15 минут с интервалом каждые 45 минут.",
    "Алгоритм и часы работы джакузи",
    "Плейсхолдер [JACUZZI_HOURS]"
  ],
  [
    "О_ВИЛЛЕ",
    "pool_lighting",
    "Освещение в бассейне и джакузи включается автоматически с 20:00 до 01:00.",
    "График подсветки воды",
    "Плейсхолдер [POOL_LIGHTS]"
  ],
  [
    "О_ВИЛЛЕ",
    "street_lighting",
    "Уличное освещение включается автоматически с 20:00 до 01:00 и с 04:00 до 06:00.",
    "График освещения сада и фасада",
    "Плейсхолдер [STREET_LIGHTS]"
  ],
  [
    "О_ВИЛЛЕ",
    "pool_maintenance",
    "Профилактические работы и чистка бассейна производятся в день заселения и далее каждые 7 дней.",
    "Регламент очистки бассейна",
    "Плейсхолдер [POOL_CLEANING]"
  ],
  [
    "О_ВИЛЛЕ",
    "outdoor_zones",
    "Парковка перед виллой, дворик-сад, зона барбекю, крыльцо с кофейными столиками и обеденной зоной, зона для загара с шезлонгами.",
    "Территория вне виллы",
    "Плейсхолдер [OUTDOOR_ZONES]"
  ],
  [
    "KBS_ИНСТРУКЦИЯ",
    "kbs_parser_prompt",
    "Ты: модуль обработки данных гостей для турецкой системы KBS. Твоя задача: извлечь данные из сообщения гостя и выдать СТРОГО готовый список по шаблону, БЕЗ приветствий, БЕЗ вводных слов и БЕЗ лишнего текста.",
    "Промпт парсера KBS",
    "KBS парсер"
  ],
  [
    "KBS_ИНСТРУКЦИЯ",
    "kbs_template_format",
    "Гость [Номер]: [ФИО], дата рождения: [DD.MM.YYYY], пол: [male/female], гражданство: [строго на английском], номер паспорта: [Номер паспорта]. Период проживания: [DD.MM.YYYY] – [DD.MM.YYYY].",
    "Канонический шаблон KBS",
    "KBS шаблон"
  ],
  [
    "KBS_ИНСТРУКЦИЯ",
    "kbs_rules",
    "Правила: Ключи шаблона остаются на русском, значения пола [male/female] и гражданства [Russian, Turkish, German, British и т.д.] : строго на английском языке. Даты строго в формате DD.MM.YYYY. Очевидные опечатки [например 25/01996 исправлять на 25.01.1996] исправлять логически, добавляя короткое пояснение под списком.",
    "Правила валидации KBS",
    "KBS правила"
  ],
  [
    "МАСТЕР_ДОСТУП",
    "Aleksei Znamenskii",
    "admin / admin123",
    "admin@villaturaman.com | Роль: Владелец | Все права: Финансы, Периоды, Блокировки, Окно брони, Чаты",
    "Главный аккаунт"
  ],
  [
    "МАСТЕР_ДОСТУП",
    "Менеджер виллы",
    "manager / manager2026",
    "manager@villaturaman.com | Роль: Управляющий | Права: Периоды, Блокировки, Доступ к чатам",
    "Персонал"
  ],
  [
    "РОЛЬ_АГЕНТА",
    "Консьерж-Мастер",
    "АКТИВЕН",
    "Ты: персональный ИИ-консьерж суперхозяина Алексея Знаменского на вилле Villa Turaman в Дальяне. Твоя миссия: гостеприимно, дипломатично и авторитетно отвечать гостям. Все факты ты берешь строго из Блоков О ВИЛЛЕ и СЛОВАРЬ ПЕРЕМЕННЫХ. Соблюдать правила дома, налоги Турции VKN 9991120181 и никогда не давать цену ниже $180 за ночь.",
    "Главная роль"
  ],
  [
    "РОЛЬ_АГЕНТА",
    "Юрист-Консультант",
    "РЕЗЕРВ",
    "Ты: ведущий юрисконсульт Villa Turaman. Контролируешь обязательную регистрацию гостей в системе KBS жандармерии по шаблону из Блока 5, соответствие закону о защите персональных данных KVKK и налоговое оформление VUK 213 Madde 230 e-Arşiv Fatura.",
    "Правовой модуль"
  ],
  [
    "РОЛЬ_АГЕНТА",
    "Финансист-Бухгалтер",
    "РЕЗЕРВ",
    "Ты: главный финансовый менеджер Villa Turaman. Ведешь учет платежей, рассчитываешь мультивалютные цены EUR/RUB/TRY, применяешь скидку 10% за невозвратный тариф при заезде до 60 дней и блокируешь любые попытки снижения цены ниже $180.",
    "Финансовый модуль"
  ],
  [
    "МАТРИЦА_ЛИСТОВ",
    "🏠 Главная витрина",
    "РАЗРЕШЕН [ВСЕ]",
    "Лист содержит главную витрину: 9 блоков с плейсхолдерами, спецификации [10 гостей, 4 спальни], статус Superhost и параметры спален 1-4.",
    "Витрина"
  ],
  [
    "МАТРИЦА_ЛИСТОВ",
    "📸 Фото и Видео Галерея",
    "РАЗРЕШЕН [ВСЕ]",
    "Лист содержит медиа-банк виллы: ссылки на фото высокого разрешения и видеотуры бассейна, сада, комнат и видов на реку.",
    "Медиа"
  ],
  [
    "МАТРИЦА_ЛИСТОВ",
    "🛎️ Дополнительные услуги",
    "РАЗРЕШЕН [ВСЕ]",
    "Лист содержит каталог платных сервисов: трансферы из аэропорта Даламан DLM, персональный шеф-повар, массажи, прогулка на лодке, барбекю, SUP-борды.",
    "Каталог услуг"
  ],
  [
    "МАТРИЦА_ЛИСТОВ",
    "🗺️ Видео-путеводители",
    "РАЗРЕШЕН [ВСЕ]",
    "Лист содержит цифровые гиды по Дальяну, пляжу Изтузу, озеру Кёйджегиз, ресторанам и античному Кауносу.",
    "Каталог гидов"
  ],
  [
    "МАТРИЦА_ЛИСТОВ",
    "⚖️ Юридические документы",
    "РАЗРЕШЕН [ВСЕ]",
    "Лист содержит официальный договор аренды, политику KVKK, реквизиты VKN 9991120181.",
    "Юриспруденция"
  ],
  [
    "МАТРИЦА_ЛИСТОВ",
    "📋 Заявки и Бронирования",
    "РАЗРЕШЕН [ВСЕ]",
    "Лист фиксирует статус заявок гостей, даты заезда и выезда, число гостей и статус оплаты.",
    "Операции CRM"
  ],
  [
    "МАТРИЦА_ЛИСТОВ",
    "📅 Календарь и Тарифы",
    "РАЗРЕШЕН [ВСЕ]",
    "Лист содержит актуальную сетку занятости дат и тарифные ставки.",
    "Календарь"
  ],
  [
    "МАТРИЦА_ЛИСТОВ",
    "👤 Гостевые аккаунты",
    "РАЗРЕШЕН [КОНСЬЕРЖ]",
    "Лист содержит реестр зарегистрированных гостей и статусы блокировок.",
    "Гостевой сервис"
  ],
  [
    "МАТРИЦА_ЛИСТОВ",
    "💳 Заказы услуг и гидов",
    "РАЗРЕШЕН [ВСЕ]",
    "Лист содержит историю заказов доп. услуг и путеводителей.",
    "Заказы"
  ],
  [
    "МАТРИЦА_ЛИСТОВ",
    "🎟️ Доступы к путеводителям",
    "РАЗРЕШЕН [ВСЕ]",
    "Лист персональных доступов к медиа-материалам.",
    "Доступы"
  ],
  [
    "МАТРИЦА_ЛИСТОВ",
    "💬 Шаблоны сообщений",
    "РАЗРЕШЕН [ВСЕ]",
    "Лист содержит 14 профессиональных шаблонов общения на RU, EN, TR.",
    "Шаблоны коммуникации"
  ],
  [
    "МАТРИЦА_ЛИСТОВ",
    "📋 Задачи и Поручения Секретаря",
    "РАЗРЕШЕН [ВСЕ]",
    "Лист содержит поручения, задачи и статус исполнения ассистентом.",
    "Секретарь"
  ],
  [
    "МАТРИЦА_ЛИСТОВ",
    "🧠 Граф Знаний и Безопасность",
    "РАЗРЕШЕН [ВСЕ]",
    "Лист содержит онтологический граф знаний, узлы и политики безопасности доступа.",
    "Граф знаний"
  ],
  [
    "МАТРИЦА_ЛИСТОВ",
    "⚙️ Системные настройки ИИ Агентов",
    "РАЗРЕШЕН [ВСЕ]",
    "Лист управления системой ИИ, генеральными директивами ролей, словарем переменных и матрицей прав доступа.",
    "Центр управления ИИ"
  ],
  [
    "ДИЗАЙН_И_СТИЛЬ",
    "theme_primary_color",
    "#f43f5e",
    "Основной цвет кнопок, бейджей и акцентов [HEX]",
    "Фирменный стиль"
  ],
  [
    "ДИЗАЙН_И_СТИЛЬ",
    "theme_secondary_color",
    "#fb7185",
    "Второстепенный акцентный цвет [HEX]",
    "Фирменный стиль"
  ],
  [
    "ДИЗАЙН_И_СТИЛЬ",
    "theme_accent_color",
    "#e11d48",
    "Цвет при наведении и активных состояний [HEX]",
    "Фирменный стиль"
  ],
  [
    "ДИЗАЙН_И_СТИЛЬ",
    "theme_bg_color",
    "#0f172a",
    "Цвет главного фона сайта [HEX]",
    "Темная тема"
  ],
  [
    "ДИЗАЙН_И_СТИЛЬ",
    "theme_card_bg",
    "#1e293b",
    "Цвет фона карточек и модальных окон [HEX]",
    "Темная тема"
  ],
  [
    "ДИЗАЙН_И_СТИЛЬ",
    "theme_text_primary",
    "#f8fafc",
    "Основной цвет заголовков и текста [HEX]",
    "Типографика"
  ],
  [
    "ДИЗАЙН_И_СТИЛЬ",
    "theme_text_secondary",
    "#94a3b8",
    "Второстепенный цвет описаний и меток [HEX]",
    "Типографика"
  ],
  [
    "ДИЗАЙН_И_СТИЛЬ",
    "theme_border_radius",
    "1.5rem",
    "Радиус скругления углов карточек и кнопок",
    "Геометрия верстки"
  ],
  [
    "ДИЗАЙН_И_СТИЛЬ",
    "theme_font_family",
    "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif",
    "Базовый шрифт интерфейса",
    "Шрифт"
  ]
];

const MASTER_TEMPLATES_ROWS = [
  [
    "1.1_discount_10",
    "1.1. Скидка 10% за невозвратный тариф",
    "1.1. 10% discount for non-refundable fares",
    "1.1. Geri ödemesiz biletlerde %10 indirim",
    "Здравствуйте, [FIRST_NAME]! Рад вашему интересу к Villa Turaman! Для поездок на ближайшие даты активирована опция: Бронирование без возврата со скидкой 10%. Скидка действует, если дата выезда в пределах 60 дней. С уважением, Алексей Знаменский.",
    "Hello, [FIRST_NAME]! We're delighted to hear about your interest in Villa Turaman! For upcoming trips, we've activated the 10% non-refundable booking option. The discount applies to departure dates within 60 days. Sincerely, Alexey Znamensky.",
    "Merhaba, [ADINIZ]! Villa Turaman'a olan ilginizi duymaktan çok memnun olduk! Yaklaşan seyahatleriniz için %10'luk iade edilmeyen rezervasyon indirimini aktif hale getirdik. İndirim, 60 gün içinde yapılacak seyahatler için geçerlidir. Saygılarımla, Alexey Znamensky."
  ],
  [
    "1.2_budget_price",
    "1.2. Работа с ценой и вопросы по бюджету",
    "1.2. Working with price and budget issues",
    "1.2. Fiyat ve bütçe konularıyla çalışma",
    "Здравствуйте, [FIRST_NAME]! Благодарю за интерес к Villa Turaman! Если вас смущает текущая стоимость или есть определенный бюджет, подскажите, какой ориентир по цене был бы для вас комфортным? С удовольствием обсудим возможные условия! С уважением, Алексей Знаменский.",
    "Hello, [FIRST_NAME]! Thank you for your interest in Villa Turaman! If the current price is concerning or you have a specific budget, could you please advise what price range would be comfortable for you? We'd be happy to discuss possible terms! Sincerely, Alexey Znamensky.",
    "Merhaba, [ADINIZ]! Villa Turaman'a gösterdiğiniz ilgi için teşekkür ederiz! Mevcut fiyat sizi endişelendiriyorsa veya belirli bir bütçeniz varsa, sizin için uygun olan fiyat aralığını belirtebilir misiniz? Olası koşulları görüşmekten memnuniyet duyarız! Saygılarımla, Alexey Znamensky."
  ],
  [
    "1.3_early_booking_expiry",
    "1.3. Напоминание об истечении Раннего бронирования",
    "1.3. Early Booking Expiration Reminder",
    "1.3. Erken Rezervasyon Son Kullanma Tarihi Hatırlatması",
    "Здравствуйте, [FIRST_NAME]! Напоминаю о вашей заявке на Villa Turaman. Скидка за раннее бронирование действует строго до даты за 2 месяца до заезда. Рекомендуем подтвердить бронирование сегодня, чтобы зафиксировать лучшую цену! С уважением, Алексей Знаменский.",
    "Hello, [FIRST_NAME]! I'd like to remind you about your reservation at Villa Turaman. The early booking discount is valid only until two months before your arrival. We recommend confirming your reservation today to secure the best price! Sincerely, Alexey Znamensky.",
    "Merhaba, [ADINIZ]! Villa Turaman'daki rezervasyonunuzu hatırlatmak istiyorum. Erken rezervasyon indirimi, varışınızdan iki ay öncesine kadar geçerlidir. En iyi fiyatı garantilemek için rezervasyonunuzu bugün onaylamanızı öneririz! Saygılarımla, Alexey Znamensky."
  ],
  [
    "2.1_booking_confirmed",
    "2.1. Подтверждение бронирования",
    "2.1. Booking confirmation",
    "2.1. Rezervasyon Onayı",
    "Здравствуйте, [FIRST_NAME]! Поздравляем, ваше бронирование Villa Turaman подтверждено! Код: [CONFIRMATION_CODE]. Даты: [CHECKIN_DATE] - [CHECKOUT_DATE]. Заезд с [CHECKIN_TIME], выезд до [CHECKOUT_TIME]. С нетерпением ждем вас в гости! С уважением, Алексей Знаменский.",
    "Hello, [FIRST_NAME]! Congratulations, your reservation at Villa Turaman has been confirmed! Code: [CONFIRMATION_CODE]. Dates: [CHECKIN_DATE] - [CHECKOUT_DATE]. Check-in from [CHECKIN_TIME], check-out by [CHECKOUT_TIME]. We look forward to welcoming you! Sincerely, Alexey Znamensky.",
    "Merhaba, [ADINIZ]! Tebrikler, Villa Turaman'daki rezervasyonunuz onaylandı! Kod: [ONAY_KODU]. Tarihler: [GİRİŞ_TARİHİ] - [ÇIKIŞ_TARİHİ]. Giriş [GİRİŞ_SAATI], çıkış [ÇIKIŞ_SAATI]. Sizi ağırlamayı dört gözle bekliyoruz! Saygılarımla, Alexey Znamensky."
  ],
  [
    "2.2_top_floor_clarification",
    "2.2. Разъяснение по закрытому верхнему этажу",
    "2.2. Clarification on the closed upper floor",
    "2.2. Kapalı üst katla ilgili açıklama",
    "Здравствуйте, [FIRST_NAME]! Верхний этаж виллы используется как закрытое служебное помещение для личных вещей владельцев и закрыт на ключ. Вся остальная вилла, 4 спальни, приватный бассейн, сад и терраса находятся в вашем исключительном пользовании. С уважением, Алексей Знаменский.",
    "Hello, [FIRST_NAME]! The top floor of the villa is used as a closed utility room for the owners' personal belongings and is locked. The rest of the villa, including the four bedrooms, private pool, garden, and terrace, is for your exclusive use. Sincerely, Alexey Znamensky.",
    "Merhaba, [ADINIZ]! Villanın en üst katı, sahiplerinin kişisel eşyaları için kapalı bir depo olarak kullanılmaktadır ve kilitlidir. Dört yatak odası, özel havuz, bahçe ve teras dahil olmak üzere villanın geri kalanı yalnızca sizin kullanımınıza açıktır. Saygılarımla, Alexey Znamensky."
  ],
  [
    "2.3_transfer_assistance",
    "2.3. Помощь по организации трансфера",
    "2.3. Assistance in organizing transfers",
    "2.3. Transferlerin düzenlenmesinde yardım",
    "Здравствуйте, [FIRST_NAME]! Мы с радостью поможем организовать комфортный трансфер из аэропорта Даламан [DLM] прямо к вилле. Сообщите, если вам нужны контакты проверенной транспортной компании: Ahmet: +90 543 335 80 70. С уважением, Алексей Знаменский.",
    "Hello, [FIRST_NAME]! We are happy to arrange a comfortable transfer from Dalaman Airport [DLM] directly to your villa. If you need the contact information of a trusted transport company, please let us know: Ahmet: +90 543 335 80 70. Sincerely, Alexey Znamensky.",
    "Merhaba, [ADINIZ]! Dalaman Havalimanı'ndan [DLM] villanıza konforlu bir transfer ayarlamaktan mutluluk duyarız. Güvenilir bir ulaşım şirketinin iletişim bilgilerine ihtiyacınız varsa, lütfen bize bildirin: Ahmet: +90 543 335 80 70. Saygılarımla, Alexey Znamensky."
  ],
  [
    "2.4_email_receipt_confirmation",
    "2.4. Подтверждение получения письма",
    "2.4. Confirmation of receipt of the letter",
    "2.4. Mektubun alındığının teyidi",
    "Здравствуйте, [FIRST_NAME]! Подтверждаю, что успешно получил ваше электронное письмо. Большое спасибо за информацию! С нетерпением жду встречи на вилле! С уважением, Алексей Знаменский.",
    "Hello, [FIRST_NAME]! I confirm that I received your email. Thank you very much for the information! I look forward to seeing you at the villa! Sincerely, Alexey Znamensky.",
    "Merhaba, [ADINIZ]! E-postanızı aldığımı onaylıyorum. Bilgiler için çok teşekkür ederim! Sizi villada görmeyi dört gözle bekliyorum! Saygılarımla, Alexey Znamensky."
  ],
  [
    "3.1_kbs_registration",
    "3.1. Запрос данных для системы регистрации KBS",
    "3.1. Data request for the KBS registration system",
    "3.1. KBS kayıt sistemi için veri talebi",
    "Здравствуйте, [FIRST_NAME]! Согласно законодательству Турции, нам необходимо зарегистрировать всех гостей в государственной системе KBS жандармерии. Пожалуйста, отправьте ФИО, номер паспорта, дату рождения и гражданство каждого гостя в текстовом виде. С уважением, Алексей Знаменский.",
    "Hello, [FIRST_NAME]! According to Turkish law, we are required to register all guests in the state-run KBS gendarmerie system. Please provide the full name, passport number, date of birth, and nationality of each guest in plain text. Sincerely, Alexey Znamensky.",
    "Merhaba, [ADINIZ]! Türk kanunlarına göre, tüm konuklarımızı devlet jandarması KBS sistemine kaydetmek zorundayız. Lütfen her konuğun tam adını, pasaport numarasını, doğum tarihini ve uyruğunu açık metin olarak verin. Saygılarımla, Alexey Znamensky."
  ],
  [
    "3.2_address_geolocation",
    "3.2. Адрес и ссылка на геолокацию Google Maps",
    "3.2. Address and link to Google Maps geolocation",
    "3.2. Adres ve Google Haritalar konum belirleme bağlantısı",
    "Здравствуйте, [FIRST_NAME]! Направляю точные координаты виллы:\nАдрес: [ADDRESS]\nGoogle Maps: [MAPS_URL]\nКогда будете в дороге, дайте знать, мы встретим вас! С уважением, Алексей Знаменский.",
    "Hello, [FIRST_NAME]! I'm sending you the exact coordinates of the villa:\nAddress: [ADDRESS]\nGoogle Maps: [MAPS_URL]\nWhen you're on your way, let us know, and we'll meet you! Sincerely, Alexey Znamensky.",
    "Merhaba, [ADINIZ]! Villanın tam koordinatlarını size gönderiyorum:\nAdres: [ADRES]\nGoogle Haritalar: [HARİTA_URL]\nYolda olduğunuzda bize haber verin, sizi karşılayalım! Saygılarımla, Alexey Znamensky."
  ],
  [
    "3.3_checkin_time_coordination",
    "3.3. Согласование времени заезда",
    "3.3. Coordination of arrival time",
    "3.3. Varış zamanının koordinasyonu",
    "Здравствуйте, [FIRST_NAME]! Стандартное время заезда: с [CHECKIN_TIME]. Прибытие позже этого времени абсолютно комфортно: смарт-замок позволяет заселиться в любой час. Если планируете приехать раньше, сообщите нам, и мы постараемся подготовить виллу как можно раньше! С уважением, Алексей Знаменский.",
    "Hello, [FIRST_NAME]! Our standard check-in time is [CHECKIN_TIME]. Arrivals later than this are perfectly fine: the smart lock allows you to check in at any time. If you plan to arrive earlier, please let us know, and we'll do our best to prepare your villa as soon as possible! Sincerely, Alexey Znamensky.",
    "Merhaba, [ADINIZ]! Standart giriş saatimiz [GİRİŞ SAATİ]'dir. Bu saatten sonra gelmeniz sorun değil: akıllı kilit sayesinde istediğiniz zaman giriş yapabilirsiniz. Daha erken gelmeyi planlıyorsanız lütfen bize bildirin, villanızı en kısa sürede hazırlamak için elimizden gelenin en iyisini yapacağız! Saygılarımla, Alexey Znamensky."
  ],
  [
    "3.4_checkin_instructions",
    "3.4. Стандартная инструкция по заселению и Wi-Fi",
    "3.4. Standard instructions for check-in and Wi-Fi",
    "3.4. Giriş ve Wi-Fi için standart talimatlar",
    "Здравствуйте, [FIRST_NAME]! Ждем вас сегодня на Villa Turaman!\nАдрес: [ADDRESS]\nСпособ заселения: [CHECKIN_METHOD]\nWi-Fi сеть: [WIFI_NAME]\nПароль: [WIFI_PASSWORD]\nЕсли возникнут вопросы, я на связи 24/7! С уважением, Алексей Знаменский.",
    "Hello, [FIRST_NAME]! We look forward to seeing you at Villa Turaman today!\nAddress: [ADDRESS]\nCheck-in method: [CHECKIN_METHOD]\nWi-Fi network: [WIFI_NAME]\nPassword: [WIFI_PASSWORD]\nIf you have any questions, I'm available 24/7! Sincerely, Alexey Znamensky.",
    "Merhaba, [ADINIZ]! Bugün Villa Turaman'da sizi görmeyi dört gözle bekliyoruz!\n\nAdres: [ADRES]\nGiriş yöntemi: [GİRİŞ YÖNTEMİ]\nWi-Fi ağı: [WIFI_ADI]\nŞifre: [WIFI_ŞİFRESİ]\nHerhangi bir sorunuz olursa, 7/24 hizmetinizdeyim! Saygılarımla, Alexey Znamensky."
  ],
  [
    "3.5_welcome_guide_dalyan",
    "3.5. Приветственный гид и путеводитель по Дальяну",
    "3.5. Welcome Guide and Dalyan Travel Guide",
    "3.5. Hoş Geldiniz Rehberi ve Dalyan Seyahat Rehberi",
    "Здравствуйте, [FIRST_NAME]! Делюсь персональным гидом по Дальяну:\n🏡 Вилла: [ADDRESS] | [MAPS_URL]\n🚗 Трансфер: +90 543 335 80 70 - Ahmet\n🚤 Лодочные туры: +90 544 588 58 09 - Капитан Адам\n🍽️ Ресторан Cicek: https://maps.google.com/?cid=14955012417485225116\n🏖️ Пляж Изтузу: заповедник черепах Caretta-Caretta\nЛегкой дороги и отличного отдыха! С уважением, Алексей Знаменский.",
    "Hello, [FIRST_NAME]! I'm sharing my personal guide to Dalyan:\n🏡 Villa: [ADDRESS] | [MAPS_URL]\n🚗 Transfer: +90 543 335 80 70 - Ahmet\n🚤 Boat Tours: +90 544 588 58 09 - Captain Adam\n🍽️ Cicek Restaurant: https://maps.google.com/?cid=14955012417485225116\n🏖️ Iztuzu Beach: Caretta-Caretta Turtle Sanctuary\nHave an easy journey and a wonderful holiday! Sincerely, Alexey Znamensky",
    "Merhaba, [ADINIZ]! Dalyan için kişisel rehberimi paylaşıyorum:\n🏡 Villa: [ADRES] | [HARİTA_URL]\n🚗 Transfer: +90 543 335 80 70 - Ahmet\n🚤 Tekne Turları: +90 544 588 58 09 - Kaptan Adam\n🍽️ Çiçek Restoranı: https://maps.google.com/?cid=14955012417485225116\n🏖️ İztuzu Plajı: Caretta-Caretta Kaplumbağa Koruma Alanı\nKolay yolculuklar ve harika bir tatil geçirmenizi dilerim! Saygılarımla, Alexey Znamensky"
  ],
  [
    "4.1_stay_care_checkin",
    "4.1. Забота о госте во время проживания",
    "4.1. Care for the guest during their stay",
    "4.1. Misafirlerin konaklamaları süresince onlara özen göstermek",
    "Здравствуйте, [FIRST_NAME]! Надеюсь, отдых проходит замечательно! Решил уточнить, все ли комфортно на вилле и не требуется ли помощь по технике, бассейну или рекомендации по ресторанам? С удовольствием отвечу! С уважением, Алексей Знаменский.",
    "Hello, [FIRST_NAME]! I hope you're having a wonderful vacation! I wanted to check if everything was comfortable at the villa and if I needed any help with the equipment, the pool, or any restaurant recommendations. I'd be happy to answer any questions! Sincerely, Alexey Znamensky.",
    "Merhaba, [ADINIZ]! Umarım harika bir tatil geçiriyorsunuzdur! Villada her şeyin yolunda olup olmadığını ve ekipman, havuz veya restoran önerileri konusunda yardıma ihtiyacım olup olmadığını kontrol etmek istedim. Herhangi bir sorunuz olursa memnuniyetle cevaplarım! Saygılarımla, Alexey Znamensky."
  ],
  [
    "5.1_checkout_instructions",
    "5.1. Напоминание о выезде и передача ключей",
    "5.1. Departure reminder and key collection",
    "5.1. Ayrılış hatırlatıcısı ve anahtar teslimi",
    "Здравствуйте, [FIRST_NAME]! Благодарим за выбор Villa Turaman! Напоминаем детали выезда: Дата: [CHECKOUT_DATE], Время: до [CHECKOUT_TIME]. [KEY_HANDOVER]. Будем рады видеть вас снова! С уважением, Алексей Знаменский.",
    "Hello, [FIRST_NAME]! Thank you for choosing Villa Turaman! Just a reminder of your checkout details: Date: [CHECKOUT_DATE], Time: until [CHECKOUT_TIME]. [KEY_HANDOVER]. We look forward to seeing you again! Sincerely, Alexey Znamensky.",
    "Merhaba, [ADINIZ]! Villa Turaman'ı tercih ettiğiniz için teşekkür ederiz! Çıkış detaylarınızı hatırlatmak isteriz: Tarih: [ÇIKIŞ_TARİHİ], Saat: [ÇIKIŞ_SAATİNE] kadar. [ANAHTAR_TESLİM] Sizi tekrar görmeyi dört gözle bekliyoruz! Saygılarımla, Alexey Znamensky."
  ]
];

const MASTER_GALLERY_ROWS = [
  [
    "gal-01",
    "Фасад и Бассейн",
    "Приватный бассейн с соленой водой 36 кв.м и шезлонги",
    "Facade and Pool",
    "A private 36 sq.m. saltwater pool with sun loungers",
    "Cephe ve Havuz",
    "Güneşlenme şezlonglarıyla donatılmış, 36 metrekarelik özel tuzlu su havuzu.",
    "Фото",
    "https://drive.google.com/file/d/1NjSHRDa5eJpQTzO9268e8LMRzDVmYtX7/view?usp=sharing,https://drive.google.com/file/d/1IZMH6wtfLHZ6ibKHfmBhPGMFntZ_fXKU/view?usp=drive_link",
    "Бассейн 36м² и зона отдыха",
    "36m² swimming pool and relaxation area",
    "36 m² yüzme havuzu ve dinlenme alanı"
  ],
  [
    "gal-02",
    "Фасад и Бассейн",
    "Вечерняя гидроподсветка бассейна и джакузи",
    "Facade and Pool",
    "Evening hydro-lighting for the pool and jacuzzi",
    "Cephe ve Havuz",
    "Havuz ve jakuzi için akşam hidrografik aydınlatma",
    "Фото",
    "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=1600",
    "Вечерняя подсветка бассейна",
    "Evening pool lighting",
    "Akşam havuz aydınlatması"
  ],
  [
    "gal-03",
    "Интерьер и Гостиная",
    "Просторная гостиная со Smart TV 55\" и кондиционером",
    "Interior and Living Room",
    "Spacious living room with 55\" Smart TV and air conditioning",
    "İç Mekan ve Oturma Odası",
    "55 inçlik akıllı TV ve klima bulunan geniş oturma odası.",
    "Фото",
    "https://drive.google.com/file/d/1NjSHRDa5eJpQTzO9268e8LMRzDVmYtX7/view?usp=sharing,https://drive.google.com/file/d/1IZMH6wtfLHZ6ibKHfmBhPGMFntZ_fXKU/view?usp=drive_link",
    "Светлая гостиная виллы",
    "Bright living room of the villa",
    "Villanın aydınlık oturma odası"
  ],
  [
    "gal-04",
    "Кухня и Столовая",
    "Полноценная кухня с индукционной панелью и кофемашиной",
    "Kitchen and Dining Room",
    "Full kitchen with induction hob and coffee machine",
    "Mutfak ve Yemek Odası",
    "İndüksiyonlu ocak ve kahve makinesi bulunan tam donanımlı mutfak.",
    "Фото",
    "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1600",
    "Кухня со всей техникой",
    "Kitchen with all appliances",
    "Tüm ev aletleriyle donatılmış mutfak"
  ],
  [
    "gal-05",
    "Спальни виллы",
    "Мастер-спальня 1 на первом этаже с кроватью King Size",
    "Bedrooms of the villa",
    "Master bedroom 1 on the first floor with a king-size bed",
    "Villanın yatak odaları",
    "Birinci kattaki ana yatak odası 1'de çift kişilik büyük bir yatak bulunmaktadır.",
    "Фото",
    "https://drive.google.com/file/d/1UDK3H8Kiv7VISu4JBlNf8_wDO_ESJ6Ng/view?usp=sharing",
    "Спальня 1 с видом на бассейн",
    "Bedroom 1 with pool view",
    "Havuz manzaralı 1 numaralı yatak odası"
  ],
  [
    "gal-06",
    "Спальни виллы",
    "Мастер-спальня 2 на втором этаже с балконом с видом на горы",
    "Bedrooms of the villa",
    "Master bedroom 2 on the second floor with a balcony overlooking the mountains",
    "Villanın yatak odaları",
    "İkinci kattaki ikinci ana yatak odası, dağ manzaralı bir balkona sahiptir.",
    "Фото",
    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1600",
    "Спальня 2 Queen Bed с балконом",
    "Bedroom 2 Queen Bed with Balcony",
    "Balkonlu 2 Numaralı Yatak Odası (Çift Kişilik Yatak)"
  ],
  [
    "gal-07",
    "Спальни виллы",
    "Спальня 3 с двумя раздельными комфортными кроватями",
    "Bedrooms of the villa",
    "Bedroom 3 with two comfortable twin beds",
    "Villanın yatak odaları",
    "3 numaralı yatak odasında iki adet konforlu tek kişilik yatak bulunmaktadır.",
    "Фото",
    "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1600",
    "Спальня 3 с 2 кроватями",
    "Bedroom 3 with 2 beds",
    "2 yataklı 3 numaralı yatak odası"
  ],
  [
    "gal-08",
    "Спальни виллы",
    "Спальня 4 с ортопедическим диваном-кроватью в лаундж-зоне",
    "Bedrooms of the villa",
    "Bedroom 4 with an orthopedic sofa bed in the lounge area",
    "Villanın yatak odaları",
    "Oturma alanında ortopedik çekyat bulunan 4 numaralı yatak odası.",
    "Фото",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600",
    "Спальня 4 в лаундж-зоне",
    "Bedroom 4 in the lounge area",
    "Salon bölümündeki 4 numaralı yatak odası"
  ],
  [
    "gal-09",
    "Санузлы",
    "4 индивидуальные ванные комнаты с тропическим душем",
    "Bathrooms",
    "4 private bathrooms with rain showers",
    "Banyolar",
    "Yağmur duşlu 4 özel banyo",
    "Фото",
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1600",
    "Индивидуальная ванная комната",
    "Private bathroom",
    "Özel banyo"
  ],
  [
    "gal-10",
    "Сад и Терраса",
    "Приватный сад с обеденным столом и зоной барбекю",
    "Garden and Terrace",
    "Private garden with dining table and barbecue area",
    "Bahçe ve Teras",
    "Yemek masası ve barbekü alanı bulunan özel bahçe.",
    "Фото",
    "https://images.unsplash.com/photo-1544025162-d76694265947?w=1600",
    "Зона BBQ и обеденная пергола",
    "BBQ area and dining pergola",
    "Barbekü alanı ve yemek pergolası"
  ],
  [
    "gal-11",
    "Бассейн и спа",
    "Уличное джакузи с автоматическим гидромассажем",
    "Pool and spa",
    "Outdoor jacuzzi with automatic hydromassage",
    "Havuz ve spa",
    "Otomatik hidromasajlı açık hava jakuzisi",
    "Фото",
    "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=1600",
    "Джакузи и летний душ",
    "Jacuzzi and outdoor shower",
    "Jakuzi ve açık hava duşu"
  ],
  [
    "gal-12",
    "Природа Дальяна",
    "Набережная реки Дальян в 5 минутах пешком от виллы",
    "The nature of Dalyan",
    "The Dalyan River embankment is a 5-minute walk from the villa",
    "Dalyan'ın doğası",
    "Villa, Dalyan Nehri kıyısına 5 dakikalık yürüme mesafesindedir.",
    "Фото",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600",
    "Живописная река Дальян",
    "The picturesque Dalyan River",
    "Manzarasıyla büyüleyici Dalyan Nehri"
  ],
  [
    "gal-13",
    "Достопримечательности",
    "Ликийские скальные гробницы IV века до н.э. с подсветкой",
    "Attractions",
    "Lycian rock tombs from the 4th century BC with illumination",
    "Gezilecek Yerler",
    "MÖ 4. yüzyıla ait Likya kaya mezarları ve üzerlerindeki resimler.",
    "Фото",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600",
    "Ликийские скальные гробницы",
    "Lycian rock tombs",
    "Likya kaya mezarları"
  ],
  [
    "gal-14",
    "Пляжи и заповедники",
    "Песчаный черепаший пляж Изтузу и озеро Кёйджегиз",
    "Beaches and nature reserves",
    "Iztuzu Turtle Beach and Lake Köyceğiz",
    "Plajlar ve doğa koruma alanları",
    "İztuzu Kaplumbağa Plajı ve Köyceğiz Gölü",
    "Фото",
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1600",
    "Пляж Изтузу и черепахи",
    "Iztuzu Beach and Turtles",
    "İztuzu Plajı ve Kaplumbağalar"
  ]
];

const MASTER_SERVICES_ROWS = [
  [
    "prod-1",
    "VIP-трансфер из аэропорта Даламан [DLM]",
    "Комфортабельный Mercedes Vito с кондиционером и напитками",
    "VIP Transfer from Dalaman Airport [DLM]",
    "A comfortable Mercedes Vito with air conditioning and drinks",
    "Dalaman Havalimanından VIP Transfer [DLM]",
    "Klimalı ve içecek servisi bulunan konforlu bir Mercedes Vito.",
    "54",
    "50",
    "5000",
    "1800",
    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200",
    "Да",
    "Трансфер",
    "https://youtube.com/watch?v=transfer",
    "Встреча в зоне прилета с именной табличкой. Время в пути до виллы 25 минут. В салоне бесплатный Wi-Fi и прохладительные напитки.",
    "Meet in the arrivals area with a name sign. Travel time to the villa is 25 minutes. Complimentary Wi-Fi and refreshments are available in the lounge.",
    "Varış alanında isim tabelasıyla buluşalım. Villaya ulaşım süresi 25 dakikadır. Salonda ücretsiz Wi-Fi ve ikramlar mevcuttur."
  ],
  [
    "prod-2",
    "Приватный круиз на яхте по реке Дальян и пляжу Изтузу",
    "Традиционная деревянная лодка: Капитан Адам, Ликийские гробницы",
    "Private Yacht Cruise on the Dalyan River and Iztuzu Beach",
    "Traditional Wooden Boat: Captain Adam, Lycian Tombs",
    "Dalyan Nehri ve İztuzu Plajı'nda Özel Yat Gezisi",
    "Geleneksel Ahşap Tekne: Kaptan Adam, Likya Mezarları",
    "270",
    "250",
    "25000",
    "9000",
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200",
    "Да",
    "Круиз",
    "https://youtube.com/watch?v=cruise",
    "Эксклюзивный дневной маршрут: Ликийские гробницы, ловля голубых крабов, купание на пляже Изтузу и обед от капитана со свежей рыбой.",
    "An exclusive day trip: Lycian tombs, blue crab fishing, swimming at Iztuzu beach and a fresh fish lunch prepared by the captain.",
    "Özel bir günlük gezi: Likya mezarları, mavi yengeç avı, İztuzu plajında ​​yüzme ve kaptan tarafından hazırlanan taze balık öğle yemeği."
  ],
  [
    "prod-3",
    "Ужин от персонального шеф-повара на вилле",
    "4-курсовой ужин у бассейна: традиционные турецкие мезе и морепродукты",
    "Private Chef Dinner in the Villa",
    "4-course poolside dinner: traditional Turkish meze and seafood",
    "Villada Özel Şef Eşliğinde Akşam Yemeği",
    "Havuz başında 4 çeşit yemekten oluşan akşam yemeği: geleneksel Türk mezeleri ve deniz ürünleri.",
    "130",
    "120",
    "12000",
    "4300",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200",
    "Да",
    "Шеф",
    "https://youtube.com/watch?v=chef",
    "Шеф-повар лично закупает фермерские продукты на рынке Дальяна, готовит ужин на вашей кухне, сервирует стол и наводит идеальный порядок.",
    "The chef personally purchases farm produce from the Dalyan market, prepares dinner in your kitchen, sets the table, and keeps everything perfectly tidy.",
    "Şef, Dalyan pazarından bizzat çiftlik ürünleri satın alıyor, mutfağınızda akşam yemeğini hazırlıyor, sofrayı kuruyor ve her şeyi kusursuz bir şekilde düzenli tutuyor."
  ],
  [
    "prod-4",
    "Премиальный BBQ-вечер на углях в саду виллы",
    "Стейки рибай, каре ягненка на косточке и овощи гриль",
    "Premium BBQ evening on coals in the villa's garden",
    "Ribeye steaks, lamb chops and grilled vegetables",
    "Villanın bahçesinde kömür ateşinde birinci sınıf barbekü akşamı.",
    "Antrikot biftek, kuzu pirzola ve ızgara sebzeler",
    "175",
    "160",
    "16000",
    "5800",
    "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200",
    "Да",
    "BBQ",
    "https://youtube.com/watch?v=bbq",
    "В стоимость входит премиальное маринованное фермерское мясо, отборные угли, розжиг, лаваш, соусы и работа гриль-мастера в течение 3 часов.",
    "The price includes premium marinated farm-raised meat, select charcoal, kindling, lavash, sauces, and a 3-hour grill master.",
    "Fiyata birinci sınıf marine edilmiş çiftlik eti, seçkin kömür, tutuşturma odunu, lavaş, soslar ve 3 saatlik ızgara ustası hizmeti dahildir."
  ],
  [
    "prod-5",
    "СПА-тур и грязевые источники Султание",
    "Омолаживающие минеральные термы и ванны озера Кёйджегиз",
    "Sultaniye Spa and Mud Springs Tour",
    "Rejuvenating mineral baths and thermal springs of Lake Köyceğiz",
    "Sultaniye Kaplıcaları ve Çamur Kaplıcaları Turu",
    "Köyceğiz Gölü'nün canlandırıcı mineral banyoları ve termal kaynakları",
    "75",
    "70",
    "7000",
    "2500",
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200",
    "Да",
    "СПА",
    "https://youtube.com/watch?v=spa",
    "Трансфер на моторной лодке прямо от причала виллы. Входные билеты в термальные комплексы и радоновые бассейны включены.",
    "Motorboat transfers directly from the villa's dock. Entrance fees to the thermal baths and radon pools are included.",
    "Villanın iskelesinden doğrudan motorlu tekne transferi sağlanmaktadır. Termal banyolar ve radon havuzlarına giriş ücretleri fiyata dahildir."
  ],
  [
    "prod-6",
    "Аренда сапбордов [SUP] и двухместного каяка",
    "2 устойчивых SUP-борда и двухместный экспедиционный каяк",
    "SUP and double kayak rental",
    "2 stable SUP boards and a two-seater expedition kayak",
    "SUP ve çift kişilik kano kiralama",
    "2 adet sağlam SUP tahtası ve iki kişilik bir keşif kayığı",
    "85",
    "80",
    "8000",
    "2900",
    "https://images.unsplash.com/photo-1517404215738-15263e9f9178?w=1200",
    "Да",
    "Спорт",
    "https://youtube.com/watch?v=sup",
    "Доставка оборудования прямо к вилле на весь период проживания. В комплекте весла, страховочные лиши и спасательные жилеты.",
    "Equipment delivered directly to your villa for the entire stay. Paddles, leashes, and life jackets are included.",
    "Konaklamanız boyunca kullanacağınız ekipmanlar doğrudan villanıza teslim edilir. Kürekler, tasmalar ve can yelekleri dahildir."
  ],
  [
    "prod-7",
    "Прокат электровелосипедов для прогулок по Дальяну",
    "2 современных электробайка с запасом хода до 60 км",
    "Electric bike rentals for exploring Dalyan",
    "2 modern electric bikes with a range of up to 60 km",
    "Dalyan'ı keşfetmek için elektrikli bisiklet kiralama",
    "60 km'ye kadar menzile sahip 2 adet modern elektrikli bisiklet.",
    "45",
    "40",
    "4000",
    "1500",
    "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=1200",
    "Да",
    "Транспорт",
    "https://youtube.com/watch?v=bike",
    "Идеальный способ исследовать гранатовые сады и улочки Дальяна. В комплекте шлемы, замки и держатели для смартфонов с навигатором.",
    "The perfect way to explore the pomegranate orchards and streets of Dalyan. Helmets, locks, and smartphone holders with GPS included.",
    "Dalyan'ın nar bahçelerini ve sokaklarını keşfetmenin mükemmel yolu. Kasklar, kilitler ve GPS'li akıllı telefon tutucuları dahildir."
  ],
  [
    "prod-8",
    "Дополнительная экспресс-уборка и смена белья",
    "Внеплановая влажная уборка виллы, замена полотенец и постельного белья",
    "Additional express cleaning and linen change",
    "Unscheduled wet cleaning of the villa, change of towels and bed linen",
    "Ek ekspres temizlik ve nevresim değişimi",
    "Villanın planlanmamış ıslak temizliği, havlu ve nevresim değişimi.",
    "65",
    "60",
    "6000",
    "2200",
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200",
    "Да",
    "Сервис",
    "https://youtube.com/watch?v=cleaning",
    "Полная уборка всех 4 спален, кухни и санузлов, мытье полов эко-средствами, замена постельных комплектов сатин премиум и банных полотенец.",
    "Full cleaning of all 4 bedrooms, kitchen, and bathrooms, floor cleaning with eco-friendly products, replacement of premium satin bed linens and bath towels.",
    "4 yatak odasının, mutfağın ve banyoların komple temizliği, çevre dostu ürünlerle yer temizliği, birinci sınıf saten nevresim takımları ve banyo havlularının değiştirilmesi."
  ]
];

const MASTER_GUIDES_ROWS = [
  [
    "guide-1",
    "Секретные маршруты реки Дальян и черепаший пляж Изтузу",
    "Эксклюзивный 40-минутный 4K видео-гид от Алексея Знаменского",
    "Secret Routes of the Dalyan River and Iztuzu Turtle Beach",
    "An exclusive 40-minute 4K video guide from Alexey Znamensky",
    "Dalyan Nehri ve İztuzu Kaplumbağa Plajı'nın Gizli Rotaları",
    "Alexey Znamensky'den özel 40 dakikalık 4K video rehberi.",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200",
    "Локации",
    "https://youtube.com/watch?v=guide1",
    "22",
    "20",
    "2000",
    "700",
    "https://youtube.com/watch?v=preview1",
    "Где встретить гигантских черепах Caretta-Caretta, как взять лодку без наценок и какие дикие бухты скрыты от массовых туристов.",
    "Where to spot giant Caretta-Caretta turtles, how to rent a boat without extra charges, and which wild bays are hidden from the masses.",
    "Dev Caretta-Caretta kaplumbağalarını nerede görebilirsiniz, ek ücret ödemeden nasıl tekne kiralayabilirsiniz ve kalabalıkların gözünden uzak hangi vahşi koylar var?"
  ],
  [
    "guide-2",
    "Ликийские скальные гробницы и древний город Каунос",
    "Историческое погружение в тайны Ликийского царства и акрополя",
    "Lycian Rock Tombs and the Ancient City of Kaunos",
    "A historical dive into the mysteries of the Lycian Kingdom and the Acropolis",
    "Likya Kaya Mezarları ve Kaunos Antik Kenti",
    "Likya Krallığı ve Akropolis'in gizemlerine tarihi bir yolculuk.",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200",
    "История",
    "https://youtube.com/watch?v=guide2",
    "27",
    "25",
    "2500",
    "900",
    "https://youtube.com/watch?v=preview2",
    "Маршрут безопасного подъема к амфитеатру Кауноса, тайные тропы древней гавани и лучшие видовые точки для фотосъемки на закате.",
    "A safe route to the Kaunos Amphitheater, the secret paths of the ancient harbor, and the best vantage points for sunset photography.",
    "Kaunos Amfitiyatrosu'na güvenli bir rota, antik limanın gizli yolları ve gün batımı fotoğrafçılığı için en iyi seyir noktaları."
  ],
  [
    "guide-3",
    "Гастрономический гид: топ-10 ресторанов и гранатовые сады",
    "Где попробовать настоящую турецкую кухню, свежую рыбу и мезе",
    "Food Guide: Top 10 Restaurants and Pomegranate Gardens",
    "Where to try authentic Turkish cuisine, fresh fish, and meze",
    "Yemek Rehberi: En İyi 10 Restoran ve Nar Bahçesi",
    "Gerçek Türk mutfağını, taze balığı ve mezeleri nerede deneyebilirsiniz?",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200",
    "Гастрономия",
    "https://youtube.com/watch?v=guide3",
    "16",
    "15",
    "1500",
    "550",
    "https://youtube.com/watch?v=preview3",
    "Список проверенных ресторанов Дальяна, включая культовый ресторан Çiçek Restoran, явки шефов и специальные привилегии для гостей нашей виллы.",
    "A list of Dalyan's trusted restaurants, including the iconic Çiçek Restaurant, chef appearances, and special privileges for our villa guests.",
    "Dalyan'ın güvenilir restoranlarının listesi, ikonik Çiçek Restoranı da dahil olmak üzere, şeflerin katılımları ve villa misafirlerimiz için özel ayrıcalıklar."
  ],
  [
    "guide-4",
    "Термальные источники Султание и минеральные грязи",
    "Как получить максимальный оздоровительный эффект без толп",
    "Sultaniye Thermal Springs and Mineral Mud",
    "How to get maximum health benefits without the crowds",
    "Sultaniye Termal Kaplıcaları ve Mineral Çamuru",
    "Kalabalıktan uzak durarak maksimum sağlık faydasını nasıl elde edebilirsiniz?",
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200",
    "Здоровье",
    "https://youtube.com/watch?v=guide4",
    "22",
    "20",
    "2000",
    "700",
    "https://youtube.com/watch?v=preview4",
    "Расписание работы источников, часы отсутствия экскурсионных теплоходов, состав минеральных вод и правильный порядок принятия ванн.",
    "Spring operating hours, hours when excursion boats are closed, composition of mineral waters, and the correct procedure for taking baths.",
    "İlkbahar çalışma saatleri, gezi teknelerinin kapalı olduğu saatler, maden sularının bileşimi ve banyo yapmanın doğru yöntemi."
  ],
  [
    "guide-5",
    "Горные трекинговые тропы и смотровая площадка Радар",
    "Пешие маршруты с панорамными видами на дельту реки и косу Изтузу",
    "Mountain trekking trails and the Radar observation deck",
    "Hiking trails with panoramic views of the river delta and the Iztuzu Spit",
    "Dağ yürüyüş parkurları ve Radar gözlem güvertesi",
    "Nehir deltası ve İztuzu Yarımadası'nın panoramik manzarasına sahip yürüyüş parkurları.",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200",
    "Трекинг",
    "https://youtube.com/watch?v=guide5",
    "16",
    "15",
    "1500",
    "550",
    "https://youtube.com/watch?v=preview5",
    "Точные GPS-треки подъема на высоту 500 метров над уровнем моря, рекомендации по обуви, запасу воды и безопасности на Ликийской тропе.",
    "Precise GPS tracking of your ascent to 500 meters above sea level, along with recommendations for footwear, water supplies, and safety on the Lycian Way.",
    "Deniz seviyesinden 500 metre yüksekliğe tırmanışınızın hassas GPS takibi, Likya Yolu'nda giyilecek ayakkabı, su temini ve güvenlik önerileri."
  ],
  [
    "guide-6",
    "Субботний фермерский рынок Дальяна: секреты и покупки",
    "Инструкция по выбору домашних сыров, оливок, гранатового сиропа",
    "Dalyan's Saturday Farmers' Market: Secrets and Shopping",
    "Instructions for choosing homemade cheeses, olives, and pomegranate syrup",
    "Dalyan'ın Cumartesi Çiftçi Pazarı: Sırlar ve Alışveriş",
    "Ev yapımı peynir, zeytin ve nar şurubu seçimi için talimatlar",
    "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1200",
    "Шоппинг",
    "https://youtube.com/watch?v=guide6",
    "11",
    "10",
    "1000",
    "350",
    "https://youtube.com/watch?v=preview6",
    "С какими фермерами стоит торговаться, где найти натуральное холодное оливковое масло первого отжима и свежайший инжир.",
    "Which farmers are worth bargaining with, where to find natural cold-pressed extra virgin olive oil and the freshest figs.",
    "Hangi çiftçilerle pazarlık yapmaya değer, doğal soğuk sıkım sızma zeytinyağı ve en taze incirleri nerede bulabilirim?"
  ]
];

const MASTER_LEGAL_ROWS = [
  [
    "contract",
    "Договор краткосрочной аренды виллы",
    "Short-term villa rental agreement",
    "Kısa süreli villa kiralama sözleşmesi",
    "Договор посуточной аренды Villa Turaman [Дальян, Мугла, Турция]. Владелец: Aleksei Znamenskii [VKN: 9991120181]. Вилла передается гостям в идеальном состоянии для проживания до 10 человек.",
    "Daily rental agreement for Villa Turaman [Dalyan, Mugla, Turkey]. Owner: Aleksei Znamenskii [VKN: 9991120181]. The villa is in perfect condition and can accommodate up to 10 people.",
    "Dalyan, Muğla, Türkiye'deki Villa Turaman için günlük kiralama sözleşmesi. Sahibi: Aleksei Znamenskii [VKN: 9991120181]. Villa mükemmel durumda olup 10 kişiye kadar konaklama imkanı sunmaktadır."
  ],
  [
    "kvkk",
    "Политика защиты персональных данных KVKK",
    "KVKK Personal Data Protection Policy",
    "KVKK Kişisel Veri Koruma Politikası",
    "Aydınlatma Metni: обработка персональных данных гостей осуществляется строго в рамках турецкого закона KVKK №6698 исключительно в целях регистрации заезда и соблюдения безопасности.",
    "Aydınlatma Metni: The processing of personal data of guests is carried out strictly within the framework of the Turkish KVKK Law No. 6698, exclusively for the purpose of check-in and security.",
    "Aydınlatma Metni: Misafirlerin kişisel verilerinin işlenmesi, yalnızca giriş ve güvenlik amacıyla, 6698 sayılı Türk KVKK Kanunu çerçevesinde titizlikle gerçekleştirilmektedir."
  ],
  [
    "house_rules",
    "Правила дома и проживания",
    "House and Living Rules",
    "Ev ve Yaşam Kuralları",
    "Стандартный заезд с [CHECKIN_TIME], выезд до [CHECKOUT_TIME]. Курение внутри помещений категорически запрещено. Проживание с домашними животными по предварительному согласованию. Тихий час с 23:00 до 08:00.",
    "Standard check-in is [CHECKIN_TIME], check-out is [CHECKOUT_TIME]. Smoking is strictly prohibited indoors. Pets are allowed by prior arrangement. Quiet hours are from 11:00 PM to 8:00 AM.",
    "Standart giriş saati [GİRİŞ_SAATI], çıkış saati [GİRİŞ_SAATI]'dır. İç mekanlarda sigara içmek kesinlikle yasaktır. Evcil hayvanlara önceden haber verilmesi koşuluyla izin verilir. Sessizlik saatleri 23:00 ile 08:00 arasındadır."
  ],
  [
    "cancellation",
    "Политика отмены и возврата средств",
    "Cancellation and Refund Policy",
    "İptal ve Geri Ödeme Politikası",
    "Полный возврат 100% предоплаты при отмене бронирования не позднее чем за 14 суток до даты заселения. При бронировании невозвратного тарифа предоставляется скидка 10%.",
    "A full 100% refund of the prepayment is available if you cancel your reservation no later than 14 days before your check-in date. A 10% discount is available when booking a non-refundable rate.",
    "Rezervasyonunuzu giriş tarihinizden en geç 14 gün önce iptal etmeniz durumunda ön ödemenin tamamı (%100) iade edilir. İade edilmeyen fiyatlardan yararlanarak rezervasyon yaptığınızda %10 indirim uygulanır."
  ],
  [
    "tax_info",
    "Налоговый статус и инвойсы",
    "Tax status and invoices",
    "Vergi durumu ve faturalar",
    "Регистрация в налоговой инспекции Ortaca Vergi Dairesi, налоговый номер VKN: 9991120181. Выставление официальных электронных счетов e-Arşiv Fatura согласно закону VUK 213 Madde 230.",
    "Registration with the Ortaca Vergi Dairesi tax office, tax identification number VKN: 9991120181. Issuance of official electronic invoices e-Arşiv Fatura in accordance with the law VUK 213 Madde 230.",
    "Ortaca Vergi Dairesi'ne kayıtlı, vergi kimlik numarası VKN: 9991120181. VUK 213 Madde 230 uyarınca resmi elektronik fatura (e-Arşiv Fatura) düzenlenmesi."
  ],
  [
    "etbis",
    "Регистрация в госреестре ETBIS",
    "Registration in the state register ETBIS",
    "ETBIS devlet siciline kayıt",
    "Сайт официально зарегистрирован в реестре электронной коммерции Министерства торговли Турецкой Республики [ETBİS'e Kayıtlıdır].",
    "The site is officially registered in the E-Commerce Registry of the Ministry of Trade of the Republic of Turkey [ETBİS'e Kayıtlıdır].",
    "Bu site, Türkiye Cumhuriyeti Ticaret Bakanlığı E-Ticaret Siciline resmi olarak kayıtlıdır."
  ],
  [
    "checkin_protocol",
    "Протокол заселения и передачи ключей",
    "Check-in and key transfer protocol",
    "Giriş yapma ve anahtar teslim protokolü",
    "Заселение через электронный смарт-замок [CHECKIN_METHOD]. Персональный пароль генерируется в день заезда. Возврат ключей: [KEY_HANDOVER].",
    "Check-in via electronic smart lock [CHECKIN_METHOD]. A personal password is generated on the day of check-in. Key return: [KEY_HANDOVER].",
    "Elektronik akıllı kilit ile giriş yapın [CHECKIN_METHOD]. Giriş gününde kişisel bir parola oluşturulur. Anahtar iadesi: [KEY_HANDOVER]."
  ],
  [
    "emergency",
    "Экстренные службы и безопасность",
    "Emergency services and security",
    "Acil servisler ve güvenlik",
    "Единый номер экстренных служб Турции: 112 [Полиция, Жандармерия, Скорая помощь, Пожарная служба]. Жандармерия Дальяна: +90 252 284 20 05. Экстренная связь с суперхозяином: 24/7 в чате.",
    "Turkey's emergency number: 112 [Police, Gendarmerie, Ambulance, Fire Department]. Dalyan Gendarmerie: +90 252 284 20 05. Superhost emergency contact: 24/7 via chat.",
    "Türkiye'nin acil durum numarası: 112 [Polis, Jandarma, Ambulans, İtfaiye]. Dalyan Jandarması: +90 252 284 20 05. Süper ev sahibi acil durum iletişim: 7/24 sohbet üzerinden."
  ]
];

const MASTER_BOOKINGS_ROWS = [
  [
    "2026-06-01",
    "Иван Смирнов",
    "+7 999 111-22-33",
    "01.06.2026",
    "08.06.2026",
    "7",
    "4",
    "2",
    "6",
    "$1540",
    "Оплачено [Airbnb]"
  ],
  [
    "2026-07-10",
    "Markus Webber",
    "+49 170 1234567",
    "10.07.2026",
    "20.07.2026",
    "10",
    "6",
    "0",
    "6",
    "$2800",
    "Предоплата 50% [Direct]"
  ],
  [
    "2026-08-01",
    "Ahmet Yılmaz",
    "+90 532 9876543",
    "01.08.2026",
    "08.08.2026",
    "7",
    "8",
    "2",
    "10",
    "$2240",
    "Подтверждено [Direct]"
  ]
];

const MASTER_CALENDAR_ROWS = [
  [
    "Глобальные правила",
    "Все даты",
    "Настройки",
    "{\"basePrice\":250,\"currency\":\"USD\",\"minNights\":3,\"maxNights\":30,\"bookingWindowMonths\":18,\"advanceNoticeDays\":2,\"bookingMode\":\"instant\",\"verificationMode\":\"progressive\",\"checkInTime\":\"16:00\",\"checkOutTime\":\"10:00\"}",
    "Изменение тарифов",
    "admin",
    "20.09.2026 12:00"
  ],
  [
    "01.05.2026",
    "31.05.2026",
    "Цена",
    "180",
    "Май: Низкий сезон [$180/ночь]",
    "admin",
    "20.09.2026 12:00"
  ],
  [
    "01.06.2026",
    "30.06.2026",
    "Цена",
    "220",
    "Июнь: Стандартный сезон [$220/ночь]",
    "admin",
    "20.09.2026 12:00"
  ],
  [
    "01.07.2026",
    "31.08.2026",
    "Цена",
    "320",
    "Июль-Август: Высокий пик [$320/ночь]",
    "admin",
    "20.09.2026 12:00"
  ],
  [
    "01.09.2026",
    "30.09.2026",
    "Цена",
    "240",
    "Сентябрь: Бархатный сезон [$240/ночь]",
    "admin",
    "20.09.2026 12:00"
  ],
  [
    "01.10.2026",
    "31.10.2026",
    "Цена",
    "180",
    "Октябрь: Закрытие сезона [$180/ночь]",
    "admin",
    "20.09.2026 12:00"
  ],
  [
    "01.05.2026",
    "31.10.2026",
    "Мин. дней",
    "3",
    "Минимальный срок аренды 3 ночи",
    "admin",
    "20.09.2026 12:00"
  ],
  [
    "01.06.2026",
    "08.06.2026",
    "Блокировка",
    "VT-2026-01",
    "Бронь: Иван Смирнов",
    "admin",
    "20.09.2026 12:00"
  ]
];

const MASTER_ACCOUNTS_ROWS = [
  [
    "2026-01-15",
    "Aleksei Znamenskii",
    "villaturaman@gmail.com",
    "admin123",
    "Нет",
    "Нет",
    "Нет [МАСТЕР_ДОСТУП • Роль: Владелец • Все права: Финансы, Периоды, Блокировки, Окно брони, Чаты • Главный аккаунт]"
  ],
  [
    "2026-01-15",
    "Aleksei Znamenskii",
    "admin",
    "admin123",
    "Нет",
    "Нет",
    "Нет [МАСТЕР_ДОСТУП • Роль: Владелец • Логин: admin]"
  ],
  [
    "2026-05-01",
    "Служба консьержа",
    "manager@villaturaman.com",
    "manager2026",
    "Нет",
    "Нет",
    "Нет [Управляющий персоналом]"
  ],
  [
    "2026-06-01",
    "Иван Смирнов",
    "ivan.smirnov@example.com",
    "guest2026",
    "Нет",
    "Нет",
    "Нет [Гость виллы]"
  ]
];

const MASTER_ORDERS_ROWS = [
  [
    "2026-05-25",
    "ivan.smirnov@example.com",
    "Услуга",
    "€50",
    "Оплачено",
    "prod-1: VIP-трансфер из аэропорта Даламан DLM"
  ],
  [
    "2026-05-26",
    "ivan.smirnov@example.com",
    "Гид",
    "€20",
    "Оплачено",
    "guide-1: Видео-гид Секретные маршруты реки Дальян"
  ]
];

const MASTER_ACCESS_ROWS = [
  [
    "2026-05-26",
    "ivan.smirnov@example.com",
    "guide-1",
    "Видеогиды",
    "Оплачено",
    "Да",
    "100% [Просмотрен полностью]"
  ],
  [
    "2026-05-26",
    "ivan.smirnov@example.com",
    "guide-2",
    "Видеогиды",
    "Оплачено",
    "Да",
    "40% [В процессе изучения]"
  ]
];

const MASTER_TASKS_ROWS = [
  [
    "TASK-001",
    "21.09.2026 10:00",
    "Бухгалтер",
    "Расчет e-Arşiv Fatura для бронирования VT-2026-01 [Иван Смирнов]",
    "Выполнена",
    "https://drive.google.com/drive/folders/11xBSWA02NypliPFbziRSMfC9aAPclYF_",
    "Aleksei Znamenskii"
  ],
  [
    "TASK-002",
    "21.09.2026 10:15",
    "Юрист",
    "Проверка данных гостя и договора краткосрочной аренды",
    "Выполнена",
    "https://drive.google.com/drive/folders/11xBSWA02NypliPFbziRSMfC9aAPclYF_",
    "ИИ-Ассистент"
  ],
  [
    "TASK-003",
    "21.09.2026 10:30",
    "Секретарь",
    "Организация трансфера гостя через партнера Ahmet +90 543 335 80 70",
    "В работе",
    "https://drive.google.com/drive/folders/11xBSWA02NypliPFbziRSMfC9aAPclYF_",
    "Секретарь-Помощник"
  ]
];

const MASTER_KNOWLEDGE_GRAPH_ROWS = [
  [
    "node-villa-core",
    "Объект",
    "Публичный",
    "Любая",
    "🏠 Главная витрина",
    "Базовая информация о вилле Villa Turaman: 4 спальни, 10 гостей, приватный бассейн 36 кв.м и джакузи в Дальяне.",
    "Активен"
  ],
  [
    "node-villa-rules",
    "Регламент",
    "Публичный",
    "Любая",
    "⚙️ Системные настройки ИИ Агентов",
    "Правила проживания: без животных, курение строго на открытых террасах, тихий час с 23:00 до 08:00.",
    "Активен"
  ],
  [
    "node-pricing-policy",
    "Тарифы",
    "Публичный",
    "Любая",
    "📅 Календарь и Тарифы",
    "Базовый тариф от $180 до $350 за ночь в зависимости от сезона. Скидка 10% за невозвратный тариф при заезде до 60 дней.",
    "Активен"
  ],
  [
    "node-wifi-credentials",
    "Учетные данные",
    "Конфиденциальный",
    "Оплачено / Проживает",
    "⚙️ Системные настройки ИИ Агентов",
    "Пароль от гостевой сети Wi-Fi: Guest / villa2026. Предоставляется строго после подтверждения бронирования или оплаты.",
    "Активен"
  ],
  [
    "node-smart-lock-pin",
    "Безопасность",
    "Секретный",
    "Проживает",
    "⚙️ Системные настройки ИИ Агентов",
    "ПИН-код от электронного смарт-замка входной двери и мини-сейфа. Передается строго в день заезда после проверки в KBS.",
    "Активен"
  ],
  [
    "node-kbs-identity",
    "Персональные данные",
    "Секретный",
    "Оплачено / Проживает",
    "⚙️ Системные настройки ИИ Агентов",
    "Паспортные данные гостей для государственной системы KBS жандармерии. Обработка строго по закону KVKK.",
    "Активен"
  ],
  [
    "node-tax-gib-invoice",
    "Налоги и Бухгалтерия",
    "Конфиденциальный",
    "Оплачено / Проживает",
    "📋 Заявки и Бронирования",
    "Электронные налоговые фактуры e-Arşiv Fatura GİB: VKN 9991120181, KDV 20% и Konaklama 1%.",
    "Активен"
  ],
  [
    "node-catalog-services",
    "Каталог",
    "Публичный",
    "Любая",
    "🛎️ Дополнительные услуги",
    "18-колоночный каталог дополнительных услуг виллы: трансферы, персональный шеф-повар, спа-массаж, аренда лодки.",
    "Активен"
  ],
  [
    "node-catalog-guides",
    "Каталог",
    "Публичный",
    "Любая",
    "🗺️ Видео-путеводители",
    "18-колоночный каталог видео-путеводителей: пляж Изтузу, озеро Кёйджегиз, античный Каунос, гастро-гид.",
    "Активен"
  ],
  [
    "node-emergency-contacts",
    "Безопасность",
    "Конфиденциальный",
    "Оплачено / Проживает",
    "💬 Шаблоны сообщений",
    "Экстренные службы Турции: Скорая 112, Жандармерия 156, Пожарные 110, личный телефон суперхозяина.",
    "Активен"
  ],
  [
    "node-ai-autopilot",
    "Интеллект",
    "Системный",
    "Внутренний доступ",
    "⚙️ Системные настройки ИИ Агентов",
    "Модель Google Gemini 3.6 Flash: автономный консьерж, проверка бюджетов, консультация по бронированию.",
    "Активен"
  ],
  [
    "node-drive-storage",
    "Хранилище",
    "Системный",
    "Внутренний доступ",
    "⚙️ Системные настройки ИИ Агентов",
    "Иерархический файловый менеджер Google Drive: договор аренды, счета, ваучеры, фотоархивы.",
    "Активен"
  ],
  [
    "node-tasks-secretary",
    "Операции",
    "Конфиденциальный",
    "Внутренний доступ",
    "📋 Задачи и Поручения Секретаря",
    "Реестр рабочих поручений суперхозяина, задачи консьержу и клинингу виллы.",
    "Активен"
  ],
  [
    "node-host-master-key",
    "Аутентификация",
    "Секретный",
    "Только Хозяин",
    "⚙️ Системные настройки ИИ Агентов",
    "Мастер-пароль и учетные записи доступа в панель суперхозяина.",
    "Активен"
  ]
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
  MASTER_TASKS_ROWS,
  MASTER_KNOWLEDGE_GRAPH_ROWS,
  buildHomeDerivedCollections
};

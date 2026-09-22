// ==============================================================================
// ДВУХУРОВНЕВЫЙ КЭШ ТИПОВЫХ РЕШЕНИЙ FAQ CACHE И МУЛЬТИ-КОМПОЗИТНЫЙ СБОРЩИК
// Файл: utils/faqCacheEngine.js
// Назначение: Моментальная сборка ответов гостям на типовые вопросы без задержек
// и без расхода токенов Gemini API [Уровень 1].
// Структура ответа:
// 1. Неизменяемое уважительное приветствие [Intro] на языке гостя [RU, EN, TR];
// 2. Динамический блок решений [Body]: склейка 1 или нескольких блоков из шаблонов;
// 3. Строгая маскировка секретов L5 [Wi-Fi и замки] до подтверждения бронирования;
// 4. Неизменяемое гостеприимное завершение [Outro] с подписью суперхозяина Алексея.
// 100% Zero-Brackets & Zero-Emdash Стандарт.
// ==============================================================================

const { resolveTemplate } = require('./templateResolver');

/**
 * Определение языка гостя по тексту сообщения или коду языка
 */
function detectLanguage(lang = 'ru', text = '') {
  if (lang === 'tr' || lang === 'en') return lang;
  const lower = (text || '').toLowerCase();
  if (lower.includes('merhaba') || lower.includes('nasılsınız') || lower.includes('teşekkür') || lower.includes('fiyat') || lower.includes('giriş')) {
    return 'tr';
  }
  if (lower.includes('hello') || lower.includes('please') || lower.includes('thank') || lower.includes('price') || lower.includes('transfer') || lower.includes('airport')) {
    return 'en';
  }
  return 'ru';
}

/**
 * Проверка допустимости доступа к секретам L5 [Wi-Fi пароль, пин-код замка]
 * Разрешено строго на стадиях CHECKIN_DAY и IN_HOUSE
 */
function isL5SecretAllowed(guestStage = '') {
  const stage = (guestStage || '').toString().toUpperCase();
  return (
    stage.includes('CHECKIN_DAY') ||
    stage.includes('STAGE_6') ||
    stage.includes('IN_HOUSE') ||
    stage.includes('STAGE_7') ||
    stage.includes('STAGE_4_IN_HOUSE')
  );
}

/**
 * Попытка моментальной сборки типового ответа из кэша FAQ и смарт-шаблонов
 * @param {Object} params
 * @returns {Object} { success: boolean, isCachedFaq: boolean, replyText: string, matchedTopics: Array }
 */
function tryAssembleFaqReply({
  guestMessage = '',
  guestName = 'Гость',
  lang = 'ru',
  guestStage = 'STAGE_1_COLD_LEAD',
  bookingContext = {},
  templates = [],
  settingsMap = {}
}) {
  const text = (guestMessage || '').toLowerCase().trim();
  if (!text) {
    return { success: false, isCachedFaq: false, replyText: '', matchedTopics: [] };
  }

  const effectiveLang = detectLanguage(lang, text);
  const cleanName = guestName && guestName !== 'Гость' && guestName !== 'Guest' ? guestName : (effectiveLang === 'tr' ? 'Misafirimiz' : (effectiveLang === 'en' ? 'Guest' : 'Гость'));

  // Извлечение ключевых системных переменных
  const wifiName = settingsMap.wifi_name || 'Guest';
  const wifiPass = settingsMap.wifi_password || 'villa2026';
  const address = settingsMap.address || 'Dalyan, Rodoslu Yaşar Sünger Sk, NO 28/2, 48600 Ortaca / Muğla';
  const mapsUrl = settingsMap.maps_url || 'https://maps.app.goo.gl/tPgCjCwz4pzq28pE9';
  const checkinMethod = settingsMap.checkin_method || 'Электронный смарт-замок и мини-сейф с кодом';
  const checkinTime = settingsMap.checkin_time || '16:00';
  const checkoutTime = settingsMap.checkout_time || '10:00';

  const transferPartnerName = settingsMap.transfer_partner_name || 'Dalyan VIP Transfer Service';
  const transferPartnerContact = settingsMap.transfer_partner_contact || 'Ahmet';
  const transferPartnerPhone = settingsMap.transfer_partner_phone || '+90 543 335 80 70';
  const transferPartnerWhatsapp = settingsMap.transfer_partner_whatsapp || '+90 543 335 80 70';

  const matchedTopics = [];
  const bodyBlocks = [];
  const l5Allowed = isL5SecretAllowed(guestStage);

  // 1. ТРАНСФЕР, ТАКСИ, АЭРОПОРТ, АХМЕТ, ВОДИТЕЛЬ
  if (
    text.includes('трансфер') ||
    text.includes('такси') ||
    text.includes('transfer') ||
    text.includes('taxi') ||
    text.includes('аэропорт') ||
    text.includes('даламан') ||
    text.includes('dlm') ||
    text.includes('водитель') ||
    text.includes('ахмет') ||
    text.includes('ahmet') ||
    text.includes('передач') ||
    text.includes('доехать')
  ) {
    matchedTopics.push('TRANSFER');
    if (effectiveLang === 'ru') {
      bodyBlocks.push(
        `Организацией индивидуального трансфера из аэропорта Даламан [DLM] прямо к дверям виллы занимается наш проверенный партнер:\n` +
        `• Служба трансфера: ${transferPartnerName}\n` +
        `• Координатор: ${transferPartnerContact}\n` +
        `• Прямой телефон / WhatsApp: ${transferPartnerPhone}\n` +
        `• Автомобиль: комфортабельный минивэн Mercedes Vito VIP [кондиционер, напитки, Wi-Fi]\n` +
        `• Фиксированный тариф виллы: 50 EUR или 1800 TRY [время в пути 25 минут].\n` +
        `Вы можете связаться с координатором напрямую по номеру ${transferPartnerPhone}, назвать виллу Villa Turaman, и автомобиль будет подан точно к прилету вашего рейса.`
      );
    } else if (effectiveLang === 'tr') {
      bodyBlocks.push(
        `Dalaman Havalimanı'ndan [DLM] villaya doğrudan VIP transfer hizmeti güvenilir ortağımız tarafından sağlanmaktadır:\n` +
        `• Transfer Hizmeti: ${transferPartnerName}\n` +
        `• Koordinatör: ${transferPartnerContact}\n` +
        `• Doğrudan Telefon / WhatsApp: ${transferPartnerPhone}\n` +
        `• Araç: Konforlu Mercedes Vito VIP minivan [klima, içecekler, Wi-Fi]\n` +
        `• Villa sabit tarifesi: 50 EUR veya 1800 TRY [yolculuk süresi 25 dakika].\n` +
        `${transferPartnerPhone} numaralı telefondan koordinatörle doğrudan iletişime geçebilirsiniz.`
      );
    } else {
      bodyBlocks.push(
        `Private airport transfers from Dalaman Airport [DLM] directly to Villa Turaman are handled by our trusted partner:\n` +
        `• Transfer Service: ${transferPartnerName}\n` +
        `• Coordinator: ${transferPartnerContact}\n` +
        `• Direct Phone / WhatsApp: ${transferPartnerPhone}\n` +
        `• Vehicle: Premium Mercedes Vito VIP minivan [A/C, refreshments, Wi-Fi]\n` +
        `• Villa fixed rate: €50 or 1800 TRY [travel time: 25 minutes].\n` +
        `You may contact the coordinator directly at ${transferPartnerPhone} referencing Villa Turaman.`
      );
    }
  }

  // 2. WI-FI, ИНТЕРНЕТ, СКОРОСТЬ, ПАРОЛЬ
  if (
    text.includes('wifi') ||
    text.includes('вайфай') ||
    text.includes('вай-фай') ||
    text.includes('wi-fi') ||
    text.includes('интернет') ||
    text.includes('пароль') ||
    text.includes('скорост') ||
    text.includes('password')
  ) {
    matchedTopics.push('WIFI');
    if (l5Allowed) {
      if (effectiveLang === 'ru') {
        bodyBlocks.push(
          `На всей территории виллы, в комнатах, на террасе и у бассейна действует скоростной оптоволоконный интернет 100 Мбит/с:\n` +
          `• Имя сети [SSID]: ${wifiName}\n` +
          `• Пароль доступа: ${wifiPass}\n` +
          `Скорость стабильна для удаленной работы, видеозвонков и потокового видео.`
        );
      } else if (effectiveLang === 'tr') {
        bodyBlocks.push(
          `Villanın tüm alanında, odalarda, terasta ve havuz başında 100 Mbps yüksek hızlı fiber optik internet mevcuttur:\n` +
          `• Ağ Adı [SSID]: ${wifiName}\n` +
          `• Erişim Şifresi: ${wifiPass}\n` +
          `Uzaktan çalışma ve yüksek kaliteli video akışı için uygundur.`
        );
      } else {
        bodyBlocks.push(
          `High-speed 100 Mbps fiber-optic internet is active throughout the villa, bedrooms, terrace, and poolside:\n` +
          `• Network Name [SSID]: ${wifiName}\n` +
          `• Password: ${wifiPass}\n` +
          `Fast and reliable for remote work, HD video calls, and streaming.`
        );
      }
    } else {
      if (effectiveLang === 'ru') {
        bodyBlocks.push(
          `На вилле Villa Turaman установлен скоростной безлимитный оптоволоконный интернет 100 Мбит/с со стабильным покрытием всех 4 спален, гостиной, террасы и зоны бассейна.\n` +
          `В целях безопасности точный пароль от закрытой сети направляется гостям автоматически в день подтверждения бронирования.`
        );
      } else if (effectiveLang === 'tr') {
        bodyBlocks.push(
          `Villa Turaman'da 4 yatak odası, oturma odası, teras ve havuz alanını kapsayan 100 Mbps sınırsız fiber optik internet bulunmaktadır.\n` +
          `Güvenlik nedeniyle, ağ şifresi rezervasyon onaylandıktan sonra iletilmektedir.`
        );
      } else {
        bodyBlocks.push(
          `Villa Turaman is equipped with high-speed 100 Mbps fiber-optic Wi-Fi covering all 4 bedrooms, living spaces, terrace, and pool area.\n` +
          `For security reasons, private network credentials are provided upon confirmed reservation.`
        );
      }
    }
  }

  // 3. ЗАСЕЛЕНИЕ, ВЫЕЗД, КЛЮЧИ, ЗАМОК, АДРЕС, СЕЙФ
  if (
    text.includes('заезд') ||
    text.includes('выезд') ||
    text.includes('заселен') ||
    text.includes('check-in') ||
    text.includes('checkin') ||
    text.includes('checkout') ||
    text.includes('check out') ||
    text.includes('ключ') ||
    text.includes('замок') ||
    text.includes('код') ||
    text.includes('адрес') ||
    text.includes('геолокаци') ||
    text.includes('карта') ||
    text.includes('сейф')
  ) {
    matchedTopics.push('CHECKIN');
    if (l5Allowed) {
      if (effectiveLang === 'ru') {
        bodyBlocks.push(
          `Регламент заезда и заселения на виллу:\n` +
          `• Стандартное время заезда: с ${checkinTime} [ранний заезд по согласованию]\n` +
          `• Время выезда: до ${checkoutTime}\n` +
          `• Способ заселения: ${checkinMethod}\n` +
          `• Официальный адрес: ${address}\n` +
          `• Ссылка на геолокацию Google Maps: ${mapsUrl}`
        );
      } else if (effectiveLang === 'tr') {
        bodyBlocks.push(
          `Giriş ve çıkış kuralları:\n` +
          `• Standart giriş saati: ${checkinTime} sonrası\n` +
          `• Çıkış saati: ${checkoutTime} öncesi\n` +
          `• Giriş yöntemi: ${checkinMethod}\n` +
          `• Resmi adres: ${address}\n` +
          `• Google Haritalar konumu: ${mapsUrl}`
        );
      } else {
        bodyBlocks.push(
          `Check-in and arrival details:\n` +
          `• Check-in time: from ${checkinTime}\n` +
          `• Check-out time: by ${checkoutTime}\n` +
          `• Access method: ${checkinMethod}\n` +
          `• Villa address: ${address}\n` +
          `• Google Maps navigation link: ${mapsUrl}`
        );
      }
    } else {
      if (effectiveLang === 'ru') {
        bodyBlocks.push(
          `Регламент заселения Villa Turaman:\n` +
          `• Стандартный заезд: с ${checkinTime}, выезд: до ${checkoutTime}.\n` +
          `• Вход оборудован современным электронным смарт-замком и мини-сейфом для бесконтактного и автономного заселения в любое удобное время суток.\n` +
          `• Адрес: ${address} [центр Дальяна, 3 минуты пешком до главной улицы].`
        );
      } else if (effectiveLang === 'tr') {
        bodyBlocks.push(
          `Villa Turaman giriş düzenlemeleri:\n` +
          `• Standart giriş: ${checkinTime} sonrası, çıkış: ${checkoutTime} öncesi.\n` +
          `• Villada 7/24 temassız giriş için modern akıllı kilit ve mini kasa sistemi bulunmaktadır.\n` +
          `• Adres: ${address} [Dalyan merkezi, ana caddeye 3 dakika yürüme mesafesinde].`
        );
      } else {
        bodyBlocks.push(
          `Villa Turaman check-in guidelines:\n` +
          `• Standard check-in: from ${checkinTime}, check-out: by ${checkoutTime}.\n` +
          `• Entrance is equipped with a digital smart lock and key safe for smooth 24/7 self check-in.\n` +
          `• Address: ${address} [Dalyan center, 3 minutes walk to the main boulevard].`
        );
      }
    }
  }

  // 4. БАССЕЙН, ДЖАКУЗИ, ВОДА, ПОДОГРЕВ
  if (
    text.includes('бассейн') ||
    text.includes('джакузи') ||
    text.includes('pool') ||
    text.includes('jacuzzi') ||
    text.includes('купани') ||
    text.includes('солен')
  ) {
    matchedTopics.push('POOL');
    if (effectiveLang === 'ru') {
      bodyBlocks.push(
        `Водный комплекс Villa Turaman:\n` +
        `• Приватный бассейн с соленой водой: чаша 4×9 м [площадь 36 кв.м], постоянная глубина 150 см. Вода мягкая, без раздражения кожи и запаха хлора. Сезон работы: с 1 мая по 1 ноября.\n` +
        `• Уличное джакузи: на 4 персоны, автоматические циклы гидромассажа с 09:00 до 18:00 [15 минут работы каждые 45 минут].\n` +
        `• Подсветка бассейна и джакузи: с 20:00 до 01:00.\n` +
        `• Очистка и фильтрация: регулярное обслуживание каждые 7 дней и в день каждого заезда.`
      );
    } else if (effectiveLang === 'tr') {
      bodyBlocks.push(
        `Villa Turaman su kompleksi:\n` +
        `• Özel tuzlu su havuzu: 4×9 m [36 m²], 150 cm sabit derinlik. Klor kokusu yok, cilt dostu. Sezon: 1 Mayıs - 1 Kasım.\n` +
        `• Açık jakuzi: 4 kişilik, 09:00 - 18:00 arası otomatik hidromasaj döngüleri [her 45 dakikada 15 dakika çalışma].\n` +
        `• Aydınlatma: 20:00 - 01:00 arası aktiftir.\n` +
        `• Temizlik ve filtreleme: Her 7 günde bir ve her giriş gününde düzenli bakım.`
      );
    } else {
      bodyBlocks.push(
        `Villa Turaman aquatic amenities:\n` +
        `• Private saltwater pool: 4×9 m [36 sq.m], constant depth of 150 cm. Gentle on skin with zero chlorine odor. Operating season: May 1 to November 1.\n` +
        `• Outdoor Jacuzzi: seats 4, automatic hydro-cycles between 09:00 and 18:00 [15 min run every 45 min].\n` +
        `• Ambient lighting: 20:00 to 01:00.\n` +
        `• Maintenance: professional cleaning every 7 days and prior to each arrival.`
      );
    }
  }

  // 5. РЕСТОРАНЫ, ГАСТРОНОМИЯ, ЕДА, ГДЕ ПОЕСТЬ, ЧИЧЕК
  if (
    text.includes('ресторан') ||
    text.includes('кафе') ||
    text.includes('поесть') ||
    text.includes('еда') ||
    text.includes('кухн') ||
    text.includes('ужин') ||
    text.includes('обед') ||
    text.includes('чичек') ||
    text.includes('cicek') ||
    text.includes('çiçek') ||
    text.includes('the pier') ||
    text.includes('mavi bar') ||
    text.includes('restaurant') ||
    text.includes('dining')
  ) {
    matchedTopics.push('RESTAURANTS');
    if (effectiveLang === 'ru') {
      bodyBlocks.push(
        `Личные гастрономические рекомендации суперхозяина Алексея в Дальяне:\n` +
        `1. 🌸 Çiçek Restaurant [Rodoslu Yaşar Sünger Sk]: уютный семейный сад, бараньи ребрышки на гриле [Kuzu Pirzola], свежий сибас и домашний айран.\n` +
        `2. 🌅 The Pier Dalyan [Maraş Cd. 60]: столик у самой кромки реки с видом на подсвеченные Ликийские гробницы, свежайшая рыба и традиционные мезе.\n` +
        `3. 🎱 Mavi Bar and Restaurant [Özalp Sk. 14]: расположен прямо через дорогу от нашей виллы. Бильярд, открытый бассейн, европейская кухня и коктейли.\n` +
        `4. 👨‍🍳 Ужин от персонального шеф-повара прямо на вилле: 4 курса из фермерских продуктов у бассейна [€120] или вечер барбекю [€160].`
      );
    } else if (effectiveLang === 'tr') {
      bodyBlocks.push(
        `Süper ev sahibi Aleksei'nin Dalyan'daki kişisel restoran tavsiyeleri:\n` +
        `1. 🌸 Çiçek Restaurant: Otantik Ege mutfağı, kuzu pirzola ve taze levrek.\n` +
        `2. 🌅 The Pier Dalyan: Nehir kıyısında Likya Mezarları manzaralı deniz ürünleri.\n` +
        `3. 🎱 Mavi Bar and Restaurant: Villanın hemen karşısında, bilardo ve kokteyller.\n` +
        `4. 👨‍🍳 Villada özel şef akşam yemeği servisi mevcuttur.`
      );
    } else {
      bodyBlocks.push(
        `Superhost Aleksei's top dining recommendations in Dalyan:\n` +
        `1. 🌸 Çiçek Restaurant: Charming garden setting, grilled lamb chops [Kuzu Pirzola], fresh sea bass, and authentic mezes.\n` +
        `2. 🌅 The Pier Dalyan: Riverfront dining right opposite illuminated Lycian Rock Tombs.\n` +
        `3. 🎱 Mavi Bar and Restaurant: Located right across from Villa Turaman with pool table and drinks.\n` +
        `4. 👨‍🍳 In-villa private chef 4-course dinner [€120] or poolside BBQ master evening [€160].`
      );
    }
  }

  // 6. ПЛЯЖ ИЗТУЗУ, ЧЕРЕПАХИ, КАУНОС, ЛОДКИ, КАПИТАН АДАМ
  if (
    text.includes('пляж') ||
    text.includes('изтузу') ||
    text.includes('iztuzu') ||
    text.includes('черепах') ||
    text.includes('caretta') ||
    text.includes('гробниц') ||
    text.includes('каунос') ||
    text.includes('kaunos') ||
    text.includes('капитан') ||
    text.includes('адам') ||
    text.includes('круиз') ||
    text.includes('яхт') ||
    text.includes('лодк')
  ) {
    matchedTopics.push('SIGHTS_AND_BOAT');
    if (effectiveLang === 'ru') {
      bodyBlocks.push(
        `Главные достопримечательности и водные маршруты Дальяна:\n` +
        `• 🏖️ Пляж Изтузу [İztuzu Plajı]: 11 км от виллы [15 минут на машине или 35 минут на речном катере через лабиринты камышей]. Чистейшая 4.5-километровая песчаная коса, заповедник черепах Caretta-Caretta и спасательный центр DEKAMER [вход свободный].\n` +
        `• 🗿 Ликийские скальные гробницы королей Кауноса IV в. до н.э.: видны с набережной Дальяна [450 м от виллы].\n` +
        `• 🏛️ Античный город Каунос: 1.5 км [переправа на гребной лодочке через реку].\n` +
        `• 🚤 Приватный круиз на деревянной лодке с капитаном Адамом: река Дальян, ловля голубых крабов, озеро Кёйджегиз и пляж [€250 за весь день, телефон / WhatsApp: +90 544 588 58 09].`
      );
    } else if (effectiveLang === 'tr') {
      bodyBlocks.push(
        `Dalyan'ın önemli cazibe merkezleri ve tekne turları:\n` +
        `• 🏖️ İztuzu Plajı: 11 km mesafede [arabayla 15 dk veya nehir teknesiyle 35 dk], Caretta-Caretta kaplumbağalarının doğal koruma alanı ve DEKAMER merkezi.\n` +
        `• 🗿 Likya Kaya Mezarları [MÖ 4. yy]: Kıyıdan ve sudan muhteşem manzara.\n` +
        `• 🏛️ Kaunos Antik Kenti: Nehrin karşısında 1.5 km.\n` +
        `• 🚤 Kaptan Adam ile özel ahşap tekne turu: +90 544 588 58 09 [Tam gün €250, mavi yengeç avı ve öğle yemeği dahil].`
      );
    } else {
      bodyBlocks.push(
        `Top local highlights and boat adventures:\n` +
        `• 🏖️ Iztuzu Beach: 11 km from the villa [15 min by car or 35 min scenic river boat ride]. Pristine 4.5 km sandy beach, Caretta-Caretta turtle reserve, and DEKAMER center.\n` +
        `• 🗿 Lycian Rock Tombs: 4th century BC panoramic view from the promenade [450 m away].\n` +
        `• 🏛️ Ancient Kaunos & Acropolis: 1.5 km across the river.\n` +
        `• 🚤 Private full-day wooden boat cruise with Captain Adam: +90 544 588 58 09 [€250/day including blue crab fishing and fresh fish lunch].`
      );
    }
  }

  // Если ни одна тема не совпала: выходим в fallback к Gemini
  if (bodyBlocks.length === 0) {
    return {
      success: false,
      isCachedFaq: false,
      replyText: '',
      matchedTopics: []
    };
  }

  // Сборка финального ответа: Intro + Body + Outro
  let intro = '';
  let outro = '';

  if (effectiveLang === 'ru') {
    intro = `Здравствуйте, ${cleanName}!`;
    outro = `С уважением, суперхозяин Алексей Знаменский [Villa Turaman]. Если у вас возникнут дополнительные вопросы, я всегда на связи здесь в чате!`;
  } else if (effectiveLang === 'tr') {
    intro = `Merhaba, ${cleanName}!`;
    outro = `Saygılarımla, Süper Ev Sahibi Aleksei Znamenskii [Villa Turaman]. Başka bir sorunuz olursa buradan yardımcı olmaktan memnuniyet duyarım!`;
  } else {
    intro = `Hello, ${cleanName}!`;
    outro = `Warm regards, Superhost Aleksei Znamenskii [Villa Turaman]. Please feel free to ask if you have any further questions!`;
  }

  const fullReply = `${intro}\n\n${bodyBlocks.join('\n\n')}\n\n${outro}`;

  return {
    success: true,
    isCachedFaq: true,
    replyText: fullReply,
    matchedTopics,
    lang: effectiveLang
  };
}

module.exports = {
  tryAssembleFaqReply,
  detectLanguage,
  isL5SecretAllowed
};

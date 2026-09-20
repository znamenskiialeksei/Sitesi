const { SMART_TEMPLATES } = require('./templatesData');

/**
 * СМАРТ-РЕЗОЛВЕР ПЛЕЙСХОЛДЕРОВ И ДЕТЕКТОР ЯЗЫКА ДЛЯ ШАБЛОНОВ VILLA TURAMAN
 * Файл: utils/templateResolver.js
 * Назначение: Автоподстановка переменных [VARIABLE_NAME] и определение намерения гостя
 */

/**
 * Извлечение имени гостя из полного ФИО
 */
function extractFirstName(fullName, defaultLabel = 'Гость') {
  if (!fullName || typeof fullName !== 'string') return defaultLabel;
  const clean = fullName.trim();
  if (!clean || clean.toLowerCase() === 'гость' || clean.toLowerCase() === 'guest' || clean.toLowerCase() === 'misafir') {
    return defaultLabel;
  }
  const parts = clean.split(/\s+/);
  return parts[0] || defaultLabel;
}

/**
 * Определение языка гостя по тексту сообщений
 * Возвращает 'ru', 'tr' или 'en'
 */
function detectGuestLanguage(messages = [], defaultLang = 'ru') {
  if (!messages || messages.length === 0) return defaultLang;

  // Анализируем последние сообщения именно от гостя
  const guestMsgs = messages
    .filter((m) => m.sender && m.sender !== 'Владелец' && m.sender !== 'Система')
    .slice(-5)
    .map((m) => (m.original || m.ru || '').toString());

  const sampleText = guestMsgs.join(' ');
  if (!sampleText.trim()) return defaultLang;

  // Турецкие специфические буквы
  if (/[ğüşöçİIıĞÜŞÖÇ]/.test(sampleText) || /\b(merhaba|teşekkür|fiyat|rezervasyon|giriş|çıkış|evet|hayır|lütfen)\b/i.test(sampleText)) {
    return 'tr';
  }

  // Русские буквы
  if (/[а-яА-ЯёЁ]/.test(sampleText)) {
    return 'ru';
  }

  return 'en';
}

/**
 * Резолвер плейсхолдеров шаблонов и витрины Villa Turaman
 */
function resolveTemplate(templateText = '', context = {}) {
  if (!templateText) return '';

  const {
    guestName = 'Гость',
    contact = '',
    checkIn = '',
    checkOut = '',
    checkInTime = '16:00',
    checkOutTime = '10:00',
    confirmationCode = '',
    bookingPlatform = 'Villa Turaman Direct',
    address = 'Dalyan, Rodoslu Yaşar Sünger Sk, NO 28/2, 48600 Ortaca / Muğla',
    mapsUrl = 'https://maps.app.goo.gl/tPgCjCwz4pzq28pE9',
    checkinMethod = 'Электронный смарт-замок и мини-сейф с кодом / личная встреча владельцем',
    wifiName = 'Guest',
    wifiPassword = 'villa2026',
    keyHandoverInstructions = 'Оставьте ключи в мини-сейфе с кодом у входной двери виллы или на кухонном столе',
    hostName = 'Aleksei Znamenskii',
    hostStatus = 'Суперхозяин на Airbnb • Более 5 лет приема гостей',
    hostLanguages = 'Русский, English, Türkçe',
    villaCapacity = '10 гостей',
    poolSpecs = 'Приватный бассейн с соленой водой 36 кв.м и уличное джакузи',
    poolSeason = 'с 1 мая по 1 ноября',
    jacuzziSchedule = 'Работает с 09:00 до 18:00. Включается автоматически на 15 минут с интервалом каждые 45 минут.',
    poolLighting = 'Освещение в бассейне и джакузи включается автоматически с 20:00 до 01:00.',
    streetLighting = 'Уличное освещение включается автоматически с 20:00 до 01:00 и с 04:00 до 06:00.',
    poolMaintenance = 'Профилактические работы и чистка бассейна производятся в день заселения и далее по необходимости : как правило каждые 7 дней.',
    outdoorZones = 'Парковка перед виллой, дворик-сад, зона барбекю, крыльцо с кофейными столиками и обеденной зоной на открытом воздухе, зона для загара с шезлонгами.',
    villaFloors = '2 этажа: кухня со Smart TV 55", гостевой туалет, 2 стиральные машины, 4 большие спальни с ванными комнатами и кондиционерами.'
  } = context;

  const firstName = extractFirstName(guestName);
  const code = confirmationCode || (contact ? `VT-${contact.slice(-4)}` : 'VT-GUEST');
  const platformName = bookingPlatform || 'Villa Turaman Direct';

  let result = templateText;
  result = result.replace(/\[FIRST_NAME\]/g, firstName);
  result = result.replace(/\[CONFIRMATION_CODE\]/g, code);
  result = result.replace(/\[CHECKIN_DATE\]/g, checkIn || 'ДД.ММ.ГГГГ');
  result = result.replace(/\[CHECKOUT_DATE\]/g, checkOut || 'ДД.ММ.ГГГГ');
  result = result.replace(/\[CHECKIN_TIME\]/g, checkInTime);
  result = result.replace(/\[CHECKOUT_TIME\]/g, checkOutTime);
  result = result.replace(/\[BOOKING_PLATFORM_NAME\]/g, platformName);
  result = result.replace(/\[PLATFORM_NAME\]/g, platformName);
  result = result.replace(/\[ADDRESS\]/g, address);
  result = result.replace(/\[MAPS_URL\]/g, mapsUrl);
  result = result.replace(/\[CHECKIN_METHOD\]/g, checkinMethod);
  result = result.replace(/\[WIFI_NAME\]/g, wifiName);
  result = result.replace(/\[WIFI_PASSWORD\]/g, wifiPassword);
  result = result.replace(/\[KEY_HANDOVER_INSTRUCTIONS\]/g, keyHandoverInstructions);
  result = result.replace(/\[KEY_HANDOVER\]/g, keyHandoverInstructions);
  result = result.replace(/\[HOST_NAME\]/g, hostName);
  result = result.replace(/\[HOST_STATUS\]/g, hostStatus);
  result = result.replace(/\[HOST_LANGUAGES\]/g, hostLanguages);
  result = result.replace(/\[MAX_GUESTS\]/g, villaCapacity);
  result = result.replace(/\[POOL_SPECS\]/g, poolSpecs);
  result = result.replace(/\[POOL_SEASON\]/g, poolSeason);
  result = result.replace(/\[JACUZZI_HOURS\]/g, jacuzziSchedule);
  result = result.replace(/\[POOL_LIGHTS\]/g, poolLighting);
  result = result.replace(/\[STREET_LIGHTS\]/g, streetLighting);
  result = result.replace(/\[POOL_CLEANING\]/g, poolMaintenance);
  result = result.replace(/\[OUTDOOR_ZONES\]/g, outdoorZones);
  result = result.replace(/\[VILLA_FLOORS\]/g, villaFloors);

  return result;
}

/**
 * ИИ-суфлер (Фаза 1): Определение намерения гостя и рекомендация шаблона
 */
function matchSuggestedTemplate(guestMessage = '') {
  if (!guestMessage || typeof guestMessage !== 'string') return null;
  const q = guestMessage.toLowerCase();
  let matchedId = null;

  // 1. Скидки и торг по цене
  if (q.includes('скидк') || q.includes('скидка') || q.includes('дешевле') || q.includes('бюджет') || q.includes('стоимост') ||
      q.includes('discount') || q.includes('cheaper') || q.includes('budget') || q.includes('indirim') || q.includes('fiyat') || q.includes('bütçe')) {
    matchedId = '1.2_budget_price';
  }

  // 2. Трансфер
  else if (q.includes('трансфер') || q.includes('такси') || q.includes('аэропорт') ||
      q.includes('transfer') || q.includes('taxi') || q.includes('airport') || q.includes('havalimanı') || q.includes('taksi')) {
    matchedId = '2.3_transfer_assistance';
  }

  // 3. Верхний этаж
  else if (q.includes('этаж') || q.includes('верхний') || q.includes('3 этаж') || q.includes('третий этаж') ||
      q.includes('floor') || q.includes('top floor') || q.includes('3rd floor') || q.includes('üst kat') || q.includes('çatı')) {
    matchedId = '2.2_top_floor_clarification';
  }

  // 4. Документы, паспорт, KBS
  else if (q.includes('паспорт') || q.includes('документ') || q.includes('регистрац') || q.includes('kbs') ||
      q.includes('passport') || q.includes('kimlik') || q.includes('tc') || q.includes('belge')) {
    matchedId = '3.1_kbs_registration';
  }

  // 5. Адрес и локация
  else if (q.includes('адрес') || q.includes('где вы') || q.includes('как доехать') || q.includes('локация') || q.includes('карта') ||
      q.includes('address') || q.includes('location') || q.includes('map') || q.includes('adres') || q.includes('konum') || q.includes('harita')) {
    matchedId = '3.2_address_geolocation';
  }

  // 6. Время заезда: ранний / поздний
  else if (q.includes('раньше') || q.includes('позже') || q.includes('во сколько') || q.includes('заезд') || q.includes('приедем') ||
      q.includes('early') || q.includes('late') || q.includes('arrival') || q.includes('check-in time') || q.includes('giriş saati') || q.includes('erken')) {
    matchedId = '3.3_checkin_time_coordination';
  }

  // 7. Wi-Fi и заселение
  else if (q.includes('вайфай') || q.includes('интернет') || q.includes('пароль') || q.includes('wifi') || q.includes('wi-fi') || q.includes('internet') || q.includes('şifre')) {
    matchedId = '3.4_checkin_instructions';
  }

  // 8. Экскурсии, рестораны, путеводитель
  else if (q.includes('ресторан') || q.includes('гид') || q.includes('пляж') || q.includes('лодка') || q.includes('куда сходить') ||
      q.includes('restaurant') || q.includes('guide') || q.includes('beach') || q.includes('boat') || q.includes('gezilecek') || q.includes('plaj')) {
    matchedId = '3.5_welcome_guide_dalyan';
  }

  // 9. Бассейн
  else if (q.includes('бассейн') || q.includes('чистк') || q.includes('pool') || q.includes('cleaning') || q.includes('havuz') || q.includes('bakım')) {
    matchedId = '4.2_pool_maintenance_notice';
  }

  // 10. Выезд
  else if (q.includes('выезд') || q.includes('уезжаем') || q.includes('ключи') ||
      q.includes('checkout') || q.includes('check-out') || q.includes('leaving') || q.includes('çıkış') || q.includes('anahtar')) {
    matchedId = '5.2_checkout_checklist';
  }

  if (!matchedId) return null;
  const tmpl = SMART_TEMPLATES.find((t) => t.id === matchedId);
  return tmpl ? { id: matchedId, template: tmpl } : null;
}

module.exports = {
  extractFirstName,
  detectGuestLanguage,
  resolveTemplate,
  matchSuggestedTemplate
};

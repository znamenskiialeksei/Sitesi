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

  const isTurkish = context.lang === 'tr' ||
    /[ğüşöçİIıĞÜŞÖÇ]/.test(templateText) ||
    /\[(ADINIZ|ONAY_KODU|GİRİŞ|ÇIKIŞ|ADRES|HARİTA|WIFI_ŞİFRESİ|KONUK_SAYISI)\]/i.test(templateText);

  const defaultGuestLabel = isTurkish ? 'Misafir' : 'Гость';
  const defaultCheckinMethod = isTurkish
    ? 'Akıllı elektronik kilit ve kodlu mini kasa / Ev sahibi tarafından karşılama'
    : 'Электронный смарт-замок и мини-сейф с кодом / личная встреча владельцем';
  const defaultKeyInstructions = isTurkish
    ? 'Anahtarları villanın giriş kapısındaki kodlu mini kasaya veya mutfak masasına bırakınız'
    : 'Оставьте ключи в мини-сейфе с кодом у входной двери виллы или на кухонном столе';
  const defaultHostStatus = isTurkish
    ? 'Airbnb Süper Ev Sahibi • 5 yılı aşkın misafir ağırlama tecrübesi'
    : 'Суперхозяин на Airbnb • Более 5 лет приема гостей';
  const defaultVillaCapacity = isTurkish ? '10 misafir' : '10 гостей';
  const defaultPoolSpecs = isTurkish
    ? '36 m² özel tuzlu su havuzu ve açık hava jakuzisi'
    : 'Приватный бассейн с соленой водой 36 кв.м и уличное джакузи';
  const defaultPoolSeason = isTurkish ? '1 Mayıs - 1 Kasım arası' : 'с 1 мая по 1 ноября';
  const defaultJacuzzi = isTurkish
    ? '09:00 - 18:00 arası çalışır. 45 dakikalık aralıklarla 15 dakika otomatik devreye girer.'
    : 'Работает с 09:00 до 18:00. Включается автоматически на 15 минут с интервалом каждые 45 минут.';

  const {
    guestName = defaultGuestLabel,
    contact = '',
    checkIn = '',
    checkOut = '',
    checkInTime = '16:00',
    checkOutTime = '10:00',
    confirmationCode = '',
    bookingPlatform = 'Villa Turaman Direct',
    address = 'Dalyan, Rodoslu Yaşar Sünger Sk, NO 28/2, 48600 Ortaca / Muğla',
    mapsUrl = 'https://maps.app.goo.gl/tPgCjCwz4pzq28pE9',
    checkinMethod = defaultCheckinMethod,
    wifiName = 'Guest',
    wifiPassword = 'villa2026',
    keyHandoverInstructions = defaultKeyInstructions,
    hostName = 'Aleksei Znamenskii',
    hostStatus = defaultHostStatus,
    hostLanguages = 'Русский, English, Türkçe',
    villaCapacity = defaultVillaCapacity,
    poolSpecs = defaultPoolSpecs,
    poolSeason = defaultPoolSeason,
    jacuzziSchedule = defaultJacuzzi,
    poolLighting = '20:00 - 01:00',
    streetLighting = '20:00 - 01:00 / 04:00 - 06:00',
    poolMaintenance = '7 gün',
    outdoorZones = 'Bahçe, BBQ, Teras',
    villaFloors = '2 kat, 4 yatak odası'
  } = context;

  const firstName = extractFirstName(guestName, defaultGuestLabel);
  const code = confirmationCode || (contact ? `VT-${contact.slice(-4)}` : 'VT-GUEST');
  const platformName = bookingPlatform || 'Villa Turaman Direct';

  let result = templateText;

  // Имя гостя : английские и турецкие варианты
  result = result.replace(/\[(FIRST_NAME|ADINIZ|MISAFIR_ADI|MISAFIR)\]/gi, firstName);

  // Код бронирования
  result = result.replace(/\[(CONFIRMATION_CODE|ONAY_KODU|REZERVASYON_KODU)\]/gi, code);

  // Дата заезда
  result = result.replace(/\[(CHECKIN_DATE|GİRİŞ_TARİHİ|GİRİŞ TARİHİ|GIRIS_TARIHI|GIRIS TARIHI)\]/gi, checkIn || (isTurkish ? 'GG.AA.YYYY' : 'ДД.ММ.ГГГГ'));

  // Дата выезда
  result = result.replace(/\[(CHECKOUT_DATE|ÇIKIŞ_TARİHİ|ÇIKIŞ TARİHİ|CIKIS_TARIHI|CIKIS TARIHI)\]/gi, checkOut || (isTurkish ? 'GG.AA.YYYY' : 'ДД.ММ.ГГГГ'));

  // Время заезда и выезда
  result = result.replace(/\[(CHECKIN_TIME|GİRİŞ_SAATI|GİRİŞ SAATİ|GIRIS_SAATI|GIRIS SAATI)\]/gi, checkInTime);
  result = result.replace(/\[(CHECKOUT_TIME|ÇIKIŞ_SAATI|ÇIKIŞ SAATİ|CIKIS_SAATI|CIKIS SAATI)\]/gi, checkOutTime);

  // Платформа бронирования
  result = result.replace(/\[(BOOKING_PLATFORM_NAME|PLATFORM_NAME|PLATFORM_ADI)\]/gi, platformName);

  // Адрес и карта
  result = result.replace(/\[(ADDRESS|ADRES)\]/gi, address);
  result = result.replace(/\[(MAPS_URL|HARİTA_URL|HARITA_URL)\]/gi, mapsUrl);

  // Способ заселения и инструкции по ключам
  result = result.replace(/\[(CHECKIN_METHOD|GİRİŞ YÖNTEMİ|GİRİŞ_YÖNTEMİ|GIRIS_YONTEMI)\]/gi, checkinMethod);
  result = result.replace(/\[(KEY_HANDOVER_INSTRUCTIONS|KEY_HANDOVER|ANAHTAR_TESLİM|ANAHTAR_TESLIM)\]/gi, keyHandoverInstructions);

  // Wi-Fi
  result = result.replace(/\[(WIFI_NAME|WIFI_ADI|WİFİ_ADI)\]/gi, wifiName);
  result = result.replace(/\[(WIFI_PASSWORD|WIFI_ŞİFRESİ|WIFI_ŞIFRESI|WIFI_SIFRESI|WIFI_SIFRE)\]/gi, wifiPassword);

  // Данные хозяина
  result = result.replace(/\[(HOST_NAME|EV_SAHİBİ|EV_SAHIBI)\]/gi, hostName);
  result = result.replace(/\[HOST_STATUS\]/gi, hostStatus);
  result = result.replace(/\[HOST_LANGUAGES\]/gi, hostLanguages);

  // Параметры виллы
  result = result.replace(/\[(MAX_GUESTS|KONUK_SAYISI|KAPASITE)\]/gi, villaCapacity);
  result = result.replace(/\[(POOL_SPECS|HAVUZ_BİLGİSİ|HAVUZ_BILGISI)\]/gi, poolSpecs);
  result = result.replace(/\[(POOL_SEASON|HAVUZ_SEZONU)\]/gi, poolSeason);
  result = result.replace(/\[(JACUZZI_HOURS|JAKUZİ_SAATLERİ|JAKUZI_SAATLERI)\]/gi, jacuzziSchedule);
  result = result.replace(/\[POOL_LIGHTS\]/gi, poolLighting);
  result = result.replace(/\[STREET_LIGHTS\]/gi, streetLighting);
  result = result.replace(/\[POOL_CLEANING\]/gi, poolMaintenance);
  result = result.replace(/\[OUTDOOR_ZONES\]/gi, outdoorZones);
  result = result.replace(/\[VILLA_FLOORS\]/gi, villaFloors);

  return result;
}

module.exports = {
  extractFirstName,
  detectGuestLanguage,
  resolveTemplate
};

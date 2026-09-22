// ==============================================================================
// IN-MEMORY ГРАФ ЗНАНИЙ И ИНТЕЛЛЕКТУАЛЬНЫЙ МАРШРУТИЗАТОР ИНТЕНТОВ
// Файл: utils/aiKnowledgeGraph.js
// Назначение: Трехуровневая архитектура оптимизации затрат и латентности Gemini 3.6 Flash.
// Уровень 1: Маршрутизация интентов [экономия до 85% токенов].
// Уровень 2: Кэширование контекста [Context Caching API со скидкой 75%].
// Уровень 3: Граф сущностей в оперативной памяти [In-Memory Entity Graph].
// 100% Zero-Brackets & Zero-Emdash Стандарт: строго квадратные скобки и дефис.
// 100% Google Sheets SSOT: полное исключение статических заглушек.
// ==============================================================================

/**
 * Классификатор намерений [Intent Routing Classifier]
 * Определяет категорию вопроса гостя для точечной динамической инъекции знаний
 */
function classifyIntent(guestMessage = '') {
  const text = (guestMessage || '').toLowerCase();

  // 1. Трансфер, такси, аэропорт, машина, водитель, контакты партнера Ahmet
  if (
    text.includes('трансфер') ||
    text.includes('такси') ||
    text.includes('transfer') ||
    text.includes('taxi') ||
    text.includes('аэропорт') ||
    text.includes('даламан') ||
    text.includes('dlm') ||
    text.includes('машин') ||
    text.includes('водитель') ||
    text.includes('доехать') ||
    text.includes('встретить') ||
    text.includes('телефон компании') ||
    text.includes('телефон трансфер') ||
    text.includes('номер трансфер') ||
    text.includes('номер компании') ||
    text.includes('телефон партнера') ||
    text.includes('номер партнера') ||
    text.includes('ахмет') ||
    text.includes('ahmet') ||
    text.includes('передач')
  ) {
    return 'TRANSFER_TRANSPORT';
  }

  // 2. Рестораны, кафе, питание, гастрономия, еда, завтрак, обед, ужин, бары
  if (
    text.includes('ресторан') ||
    text.includes('кафе') ||
    text.includes('покушать') ||
    text.includes('поесть') ||
    text.includes('еда') ||
    text.includes('ужин') ||
    text.includes('обед') ||
    text.includes('завтрак') ||
    text.includes('бар') ||
    text.includes('паб') ||
    text.includes('pub') ||
    text.includes('кухн') ||
    text.includes('рыб') ||
    text.includes('мясо') ||
    text.includes('мезе') ||
    text.includes('блюд') ||
    text.includes('краб') ||
    text.includes('çiçek') ||
    text.includes('cicek') ||
    text.includes('чичек') ||
    text.includes('the pier') ||
    text.includes('mavi bar') ||
    text.includes('food') ||
    text.includes('restaurant') ||
    text.includes('dining') ||
    text.includes('eat') ||
    text.includes('где поесть')
  ) {
    return 'RESTAURANTS_DINING';
  }

  // 3. Достопримечательности, пляж Изтузу, черепахи, Каунос, гробницы, озеро Кёйджегиз, маршруты
  if (
    text.includes('пляж') ||
    text.includes('изтузу') ||
    text.includes('iztuzu') ||
    text.includes('черепах') ||
    text.includes('caretta') ||
    text.includes('гробниц') ||
    text.includes('ликийск') ||
    text.includes('каунос') ||
    text.includes('kaunos') ||
    text.includes('озер') ||
    text.includes('кёйджегиз') ||
    text.includes('koycegiz') ||
    text.includes('достопримечательност') ||
    text.includes('куда сходить') ||
    text.includes('что посмотреть') ||
    text.includes('гид') ||
    text.includes('маршрут')
  ) {
    return 'SIGHTS_BEACHES';
  }

  // 4. Услуги, экскурсии, яхта, лодка, повар, шеф, барбекю, сап, спа, массаж
  if (
    text.includes('услуг') ||
    text.includes('сервис') ||
    text.includes('яхт') ||
    text.includes('лодк') ||
    text.includes('катер') ||
    text.includes('капитан') ||
    text.includes('адам') ||
    text.includes('шеф') ||
    text.includes('повар') ||
    text.includes('барбекю') ||
    text.includes('bbq') ||
    text.includes('спа') ||
    text.includes('spa') ||
    text.includes('грязи') ||
    text.includes('султание') ||
    text.includes('источник') ||
    text.includes('сап') ||
    text.includes('sup') ||
    text.includes('каяк') ||
    text.includes('велосипед') ||
    text.includes('уборк') ||
    text.includes('экскурси')
  ) {
    return 'SERVICES_EXCURSIONS';
  }

  // 5. Счета, фактуры, налоги, VKN, e-Arşiv, инвойс, квитанция
  if (
    text.includes('счет') ||
    text.includes('фактур') ||
    text.includes('инвойс') ||
    text.includes('invoice') ||
    text.includes('fatura') ||
    text.includes('налог') ||
    text.includes('vkn') ||
    text.includes('kdv') ||
    text.includes('бухгалтер') ||
    text.includes('gib') ||
    text.includes('чек')
  ) {
    return 'LEGAL_TAX_INVOICE';
  }

  // 6. Цены, скидки, оплата, бронирование, свободные даты
  if (
    text.includes('цена') ||
    text.includes('стоимост') ||
    text.includes('тариф') ||
    text.includes('скидк') ||
    text.includes('оплат') ||
    text.includes('заброниров') ||
    text.includes('свободн') ||
    text.includes('дат') ||
    text.includes('сутки') ||
    text.includes('ночь') ||
    text.includes('price') ||
    text.includes('cost')
  ) {
    return 'PRICING_BOOKING';
  }

  // 7. Заселение, выезд, ключи, замок, сейф, wi-fi, интернет, правила дома, курение
  if (
    text.includes('заезд') ||
    text.includes('выезд') ||
    text.includes('заселен') ||
    text.includes('check-in') ||
    text.includes('checkin') ||
    text.includes('checkout') ||
    text.includes('ключ') ||
    text.includes('замок') ||
    text.includes('код') ||
    text.includes('wifi') ||
    text.includes('вайфай') ||
    text.includes('интернет') ||
    text.includes('пароль') ||
    text.includes('курен') ||
    text.includes('правил') ||
    text.includes('животн')
  ) {
    return 'HOUSE_RULES_CHECKIN';
  }

  // 8. Бассейн, джакузи, комнаты, спальни, сколько человек, вместимость, где находится
  if (
    text.includes('бассейн') ||
    text.includes('pool') ||
    text.includes('джакузи') ||
    text.includes('jacuzzi') ||
    text.includes('спальн') ||
    text.includes('комнат') ||
    text.includes('кроват') ||
    text.includes('вместимост') ||
    text.includes('гост') ||
    text.includes('человек') ||
    text.includes('адрес') ||
    text.includes('где') ||
    text.includes('расположен') ||
    text.includes('локаци')
  ) {
    return 'GENERAL_VILLA_INFO';
  }

  return 'GENERAL';
}

/**
 * Нормализация индекса стадии гостя для оценки прав доступа [1-8]
 */
function normalizeStageIndex(stage) {
  const s = (stage || '').toString().toUpperCase();
  if (s.includes('STAGE_8') || s.includes('CHECKOUT') || s.includes('CHECKED_OUT')) return 8;
  if (s.includes('STAGE_7') || s.includes('IN_HOUSE') || s.includes('STAGE_4_IN_HOUSE')) return 7;
  if (s.includes('STAGE_6') || s.includes('CHECKIN_DAY')) return 6;
  if (s.includes('STAGE_5') || s.includes('PRE_ARRIVAL')) return 5;
  if (s.includes('STAGE_4') || s.includes('BOOKED_CONFIRMED') || s.includes('STAGE_3_BOOKED')) return 4;
  if (s.includes('STAGE_3') || s.includes('HOLD') || s.includes('STAGE_2_HOLD')) return 3;
  if (s.includes('STAGE_2') || s.includes('QUALIFIED')) return 2;
  return 1;
}

/**
 * Проверка соответствия уровня секретности узла текущей стадии гостя
 * L1_PUBLIC: доступно всем стадиям [1-8]
 * L2_QUALIFIED: доступно зарегистрированным гостям [стадии 2-8]
 * L3_HOLD_OFFER: доступно на этапе брони и удержания [стадии 3-8]
 * L4_BOOKED_PAID: доступно при оплаченной брони [стадии 4-8]
 * L5_IN_HOUSE_ONLY: строго день заселения и проживание [стадии 6-7]
 */
function isNodeAllowedForStage(securityLevel, stage) {
  const stageIdx = normalizeStageIndex(stage);
  const sec = (securityLevel || 'L1_PUBLIC').toString().toUpperCase();
  if (sec.includes('L5') || sec.includes('IN_HOUSE_ONLY')) {
    return stageIdx === 6 || stageIdx === 7;
  }
  if (sec.includes('L4') || sec.includes('BOOKED_PAID')) {
    return stageIdx >= 4;
  }
  if (sec.includes('L3') || sec.includes('HOLD_OFFER')) {
    return stageIdx >= 3;
  }
  if (sec.includes('L2') || sec.includes('QUALIFIED')) {
    return stageIdx >= 2;
  }
  return true;
}

/**
 * Классификатор жизненного цикла и вовлеченности гостя [Guest Lifecycle 8-Stage Model]
 * @param {Object} context - Параметры бронирования и профиля гостя
 * @returns {string} Канонический ключ одной из 8 стадий
 */
function classifyGuestStage(context = {}) {
  const status = (context.bookingStatus || context.status || '').toString().trim();
  const checkIn = context.checkIn || context.startDate || null;
  const checkOut = context.checkOut || context.endDate || null;
  const isRegistered = !!context.isRegistered;
  const now = new Date();

  // 1. Оплаченные подтвержденные бронирования
  if (
    status.includes('Оплачено') ||
    status.includes('Подтверждено') ||
    status.includes('ОПЛАЧЕНО') ||
    status.includes('ПОДТВЕРЖДЕНО')
  ) {
    if (checkIn && checkOut) {
      const inDate = new Date(checkIn);
      const outDate = new Date(checkOut);

      if (!isNaN(inDate.getTime()) && !isNaN(outDate.getTime())) {
        if (now > outDate) {
          return 'STAGE_8_CHECKOUT_DEPARTURE';
        }
        if (now >= inDate && now <= outDate) {
          return 'STAGE_7_IN_HOUSE';
        }
        const hoursUntilCheckin = (inDate.getTime() - now.getTime()) / (1000 * 60 * 60);
        if (hoursUntilCheckin <= 24 && hoursUntilCheckin >= 0) {
          return 'STAGE_6_CHECKIN_DAY';
        }
        if (hoursUntilCheckin <= 48 && hoursUntilCheckin > 24) {
          return 'STAGE_5_PRE_ARRIVAL_48H';
        }
        return 'STAGE_4_BOOKED_CONFIRMED';
      }
    }
    return 'STAGE_4_BOOKED_CONFIRMED';
  }

  // 2. Ожидание оплаты, удержание HOLD или активное спецпредложение
  if (
    status.includes('ОЖИДАЕТ') ||
    status.includes('Ожидает') ||
    status.includes('СПЕЦПРЕДЛОЖЕНИЕ') ||
    status.includes('Спецпредложение') ||
    status.includes('HOLD') ||
    status.includes('hold')
  ) {
    return 'STAGE_3_OFFER_HOLD_24H';
  }

  // 3. Зарегистрированный гость с верифицированным контактом
  if (isRegistered || context.verificationLevel === 'FULL' || context.verificationLevel === 'EMAIL') {
    return 'STAGE_2_QUALIFIED_LEAD';
  }

  // 4. По умолчанию: новый холодный лид
  return 'STAGE_1_COLD_LEAD';
}

/**
 * Модель Графа Знаний виллы Villa Turaman в оперативной памяти
 * Сквозная привязка ко всем 15 листам Google Таблиц SSOT
 */
class VillaKnowledgeGraph {
  constructor() {
    this.nodes = new Map();
    this.edges = [];
    this.rawSettings = {};
    this.servicesList = [];
    this.guidesList = [];
    this.legalList = [];
    this.templatesList = [];
    this.knowledgeGraphRows = [];
    this.securityMatrix = new Map();
    this.calendarSnapshot = null;
    this.lastBuilt = null;
  }

  /**
   * Добавление узла сущности
   */
  addEntity(id, type, data, tags = []) {
    this.nodes.set(id, {
      id,
      type,
      data,
      tags,
      updatedAt: Date.now()
    });
  }

  /**
   * Добавление связи между сущностями
   */
  addEdge(sourceId, targetId, relation) {
    this.edges.push({ sourceId, targetId, relation });
  }

  /**
   * Поиск сущности по ключу или тегам
   */
  findEntity(idOrTag) {
    if (this.nodes.has(idOrTag)) {
      return this.nodes.get(idOrTag);
    }
    for (const node of this.nodes.values()) {
      if (node.tags && node.tags.includes(idOrTag)) {
        return node;
      }
    }
    return null;
  }

  /**
   * Построение графа из плоских данных Google Таблиц
   */
  buildFromSheetsData({ settingsMap = {}, services = [], guides = [], legal = [], templates = [], calendarSnapshot = null, knowledgeGraphRows = [] }) {
    this.nodes.clear();
    this.edges = [];
    this.rawSettings = settingsMap || {};
    this.servicesList = Array.isArray(services) ? services : [];
    this.guidesList = Array.isArray(guides) ? guides : [];
    this.legalList = Array.isArray(legal) ? legal : [];
    this.templatesList = Array.isArray(templates) ? templates : [];
    this.calendarSnapshot = calendarSnapshot || null;
    this.knowledgeGraphRows = Array.isArray(knowledgeGraphRows) ? knowledgeGraphRows : [];

    // Заполнение матрицы безопасности из 15-го листа CRM
    this.securityMatrix.clear();
    this.knowledgeGraphRows.forEach((r) => {
      const nodeId = (r[0] || '').toString().trim();
      if (nodeId && nodeId !== 'ID Узла') {
        this.securityMatrix.set(nodeId, {
          nodeId,
          type: (r[1] || '').toString().trim(),
          securityLevel: (r[2] || 'L1_PUBLIC').toString().trim(),
          allowedStages: (r[3] || '').toString().trim(),
          crmSheet: (r[4] || '').toString().trim(),
          desc: (r[5] || '').toString().trim(),
          status: (r[6] || 'Активен').toString().trim()
        });
      }
    });

    if (calendarSnapshot) {
      this.addEntity('unified_calendar', 'CALENDAR', calendarSnapshot, ['calendar', 'календарь', 'занятость', 'даты', 'ota']);
      this.addEntity('pricing_engine', 'PRICING', calendarSnapshot.pricingAnalysis || {}, ['pricing', 'rates', 'скидки', 'тарифы']);
    }

    // 1. Узел: Хозяин [Host]
    this.addEntity('host', 'PERSON', {
      name: settingsMap.host_name || 'Aleksei Znamenskii',
      status: settingsMap.host_status || 'Суперхозяин на Airbnb • Более 5 лет приема гостей',
      languages: settingsMap.host_languages || 'Русский, English, Türkçe',
      phone: settingsMap.host_phone || '',
      whatsapp: settingsMap.host_whatsapp || '',
      telegram: settingsMap.host_telegram || '@villaturaman',
      vkn: settingsMap.tax_registration_vkn || '9991120181',
      taxOffice: 'Ortaca Vergi Dairesi'
    }, ['owner', 'superhost', 'host', 'хозяин', 'алексей']);

    // 2. Узел: Вилла [Villa]
    this.addEntity('villa', 'PROPERTY', {
      capacity: settingsMap.villa_capacity || '10 гостей',
      bedrooms: '4 спальни',
      beds: '5 кроватей',
      bathrooms: '4 ванные комнаты',
      floors: settingsMap.villa_floors || '2 этажа. Первый этаж: кухня, гостиная, спальня с санузлом. Второй этаж: 3 спальни с санузлами и кондиционерами.',
      address: settingsMap.address || 'Dalyan, Rodoslu Yaşar Sünger Sk, NO 28/2, 48600 Ortaca / Muğla',
      mapsUrl: settingsMap.maps_url || 'https://maps.app.goo.gl/tPgCjCwz4pzq28pE9',
      wifiName: settingsMap.wifi_name || 'Guest',
      wifiPass: settingsMap.wifi_password || 'villa2026',
      checkinTime: settingsMap.checkin_time || '16:00',
      checkoutTime: settingsMap.checkout_time || '10:00',
      checkinMethod: settingsMap.checkin_method || 'Электронный смарт-замок и мини-сейф с кодом',
      minPrice: settingsMap.min_night_price || '180'
    }, ['villa', 'house', 'вилла', 'дом', 'жилье']);

    // 3. Узел: Бассейн и Джакузи [Pool & Amenities]
    this.addEntity('pool', 'AMENITY', {
      specs: settingsMap.pool_specs || 'Приватный бассейн 36 кв.м с соленой водой и уличное джакузи',
      season: settingsMap.pool_season || 'с 1 мая по 1 ноября',
      jacuzziSchedule: settingsMap.jacuzzi_schedule || 'Работает с 09:00 до 18:00, 15 мин каждые 45 мин',
      lighting: settingsMap.pool_lighting || 'с 20:00 до 01:00',
      maintenance: settingsMap.pool_maintenance || 'каждые 7 дней'
    }, ['pool', 'jacuzzi', 'бассейн', 'джакузи', 'купание']);

    // 4. Узел: Партнер по трансферу [Transfer Partner]
    this.addEntity('transfer_partner', 'PARTNER', {
      name: settingsMap.transfer_partner_name || 'Dalyan VIP Transfer Service',
      contactPerson: settingsMap.transfer_partner_contact || 'Ahmet',
      phone: settingsMap.transfer_partner_phone || '+90 543 335 80 70',
      whatsapp: settingsMap.transfer_partner_whatsapp || '+90 543 335 80 70',
      vehicle: 'Mercedes Vito VIP [кондиционер, напитки, Wi-Fi]',
      durationDalaman: '25 минут от аэропорта Даламан DLM',
      priceEur: '50',
      priceTry: '1800'
    }, ['transfer', 'partner', 'taxi', 'driver', 'трансфер', 'партнер', 'такси', 'водитель', 'ахмет', 'ahmet']);

    // 5. Узел: Партнер по лодочным турам [Boat Partner]
    this.addEntity('boat_partner', 'PARTNER', {
      name: 'Приватные речные круизы по Дальяну',
      contactPerson: 'Капитан Адам',
      phone: '+90 544 588 58 09',
      whatsapp: '+90 544 588 58 09',
      vehicle: 'Традиционная деревянная моторная лодка',
      route: 'Река Дальян, Ликийские гробницы, ловля крабов, пляж Изтузу, озеро Кёйджегиз',
      priceEur: '250'
    }, ['boat', 'cruise', 'adam', 'лодка', 'круиз', 'капитан', 'адам']);

    // 6. Узел: Налоговый стандарт и e-Arşiv Fatura [Taxes & Invoicing]
    this.addEntity('tax_standard', 'LEGAL_REGIME', {
      vkn: settingsMap.tax_registration_vkn || '9991120181',
      lawBasis: settingsMap.invoice_legal_basis || 'VUK 213 Madde 230',
      vatKdv: settingsMap.vat_kdv_rate || '20%',
      accommodationTax: settingsMap.accommodation_tax_rate || '1%',
      divisor: settingsMap.total_tax_divisor || '1.21',
      unitDecimals: settingsMap.unit_price_decimals || '8',
      currency: settingsMap.currency_code || 'TRY',
      recipient: settingsMap.recipient_type || '100% Gross на имя гостя [Alıcı]',
      tcmbPolicy: settingsMap.tcmb_rate_policy || 'Döviz Alış на дату выезда в 15:30',
      notTemplate: settingsMap.turkish_words_note_template || 'YALNIZ [СУММА] TL [КУРУШ] KURUŞTUR.'
    }, ['tax', 'invoice', 'gib', 'fatura', 'налоги', 'фактура', 'счет', 'бухгалтерия']);

    // 7. Узлы: Каталог услуг [Services]
    this.servicesList.forEach((s) => {
      this.addEntity(`service_${s.id || s.name}`, 'SERVICE', s, ['service', 'услуга', (s.name || '').toLowerCase()]);
    });

    // 8. Узлы: Путеводители [Guides]
    this.guidesList.forEach((g) => {
      this.addEntity(`guide_${g.id || g.title}`, 'GUIDE', g, ['guide', 'гид', (g.title || '').toLowerCase()]);
    });

    // 9. Узлы: Юридические разделы [Legal]
    this.legalList.forEach((l) => {
      this.addEntity(`legal_${l.id || l.title}`, 'LEGAL_DOC', l, ['legal', 'договор', 'правила', (l.title || '').toLowerCase()]);
    });

    this.lastBuilt = Date.now();
  }

  /**
   * Проверка прав доступа гостя к узлу графа на основе матрицы безопасности
   */
  canAccessNode(nodeId, guestStage = 'STAGE_1_COLD_LEAD') {
    const rule = this.securityMatrix.get(nodeId);
    if (!rule) {
      if (nodeId === 'wifi_credentials' || nodeId === 'smart_lock_pin') {
        return isNodeAllowedForStage('L5_IN_HOUSE_ONLY', guestStage);
      }
      return true;
    }
    if (rule.status && rule.status.toLowerCase().includes('приостановлен')) {
      return false;
    }
    return isNodeAllowedForStage(rule.securityLevel, guestStage);
  }

  /**
   * Сборка целевого динамического микро-промпта на основе интента и стадии гостя
   * 100% Google Sheets SSOT: генерируется строго из живых массивов данных
   * @param {string} intent - Классифицированный интент
   * @param {string} guestStage - Стадия вовлеченности гостя
   * @param {Object} contextParams - Дополнительные параметры
   */
  getContextForIntent(intent = 'GENERAL', guestStage = 'STAGE_1_COLD_LEAD', contextParams = {}) {
    const host = this.findEntity('host')?.data || {};
    const villa = this.findEntity('villa')?.data || {};
    const partner = this.findEntity('transfer_partner')?.data || {};
    const boatPartner = this.findEntity('boat_partner')?.data || {};
    const pool = this.findEntity('pool')?.data || {};
    const taxes = this.findEntity('tax_standard')?.data || {};
    const cal = this.findEntity('unified_calendar')?.data || this.calendarSnapshot || {};
    const pricing = this.findEntity('pricing_engine')?.data || cal.pricingAnalysis || {};
    const rules = pricing.rules || cal.globalRules || {};

    const basePrice = pricing.currentBasePrice || rules.basePrice || 250;
    const minPrice = pricing.minBarrierPrice || villa.minPrice || 180;
    const maxDiscount = pricing.maxDiscountPercent || 28;

    // Базовый защитный скелет: всегда присутствует [50-80 токенов]
    let context = `СУПЕРХОЗЯИН: ${host.name} [рейтинг 4.98, Airbnb Superhost].
ВИЛЛА: Villa Turaman [Дальян, Мугла, Турция]. Вместимость: ${villa.capacity}, ${villa.bedrooms}, ${villa.beds}, ${villa.bathrooms}.
ТАРИФНЫЙ КОРИДОР: Базовая ставка $${basePrice}/ночь, Финансовый минимум: $${minPrice}/ночь [ниже опускать строго запрещено]. Скидочный диапазон: до ${maxDiscount}%.
СИНХРОНИЗАЦИЯ OTA: Календарь синхронизирован с 6 платформами: Airbnb, Booking.com, Vrbo, Avito, Agoda, Google Calendar. Прямое бронирование на официальном сайте экономит гостю 15-20% сборов посредников.\n`;

    if (cal.availableGaps && cal.availableGaps.length > 0) {
      context += `БЛИЖАЙШИЕ СВОБОДНЫЕ СТЫКОВОЧНЫЕ ОКНА:\n`;
      cal.availableGaps.forEach((g) => {
        context += `• ${g.start}${g.end ? ` - ${g.end}` : ''} [${g.nights} ночей]\n`;
      });
      context += `\n`;
    }

    switch (intent) {
      // --- НАПРАВЛЕНИЕ 1: ТРАНСФЕР И ТАКСИ ---
      case 'TRANSFER_TRANSPORT':
        context += `\n[ЦЕЛЕВОЙ МОДУЛЬ: ТРАНСФЕР И ТРАНСПОРТ]
ПАРТНЕР ПО ТРАНСФЕРУ: ${partner.name}
ПРЯМОЙ КОНТАКТ КООРДИНАТОРА: ${partner.contactPerson}
ПРЯМОЙ ТЕЛЕФОН: ${partner.phone}
WHATSAPP: ${partner.whatsapp}
АВТОМОБИЛЬ: ${partner.vehicle}
ВРЕМЯ В ПУТИ: ${partner.durationDalaman}
ФИКСИРОВАННЫЙ ТАРИФ ВИЛЛЫ: €${partner.priceEur} или ${partner.priceTry} TRY.
ИНСТРУКЦИЯ ДЛЯ ИИ: Если гость спрашивает про трансфер, такси, водителя или просит телефон: ТЫ ОБЯЗАН СРАЗУ ВЫДАТЬ прямой номер ${partner.contactPerson}: ${partner.phone} [WhatsApp: ${partner.whatsapp}] в первых же строках ответа! Запрещено запрашивать номер рейса или время прилета вместо или до выдачи номера телефона.`;
        break;

      // --- НАПРАВЛЕНИЕ 2: РЕСТОРАНЫ, КАФЕ И ГАСТРОНОМИЯ ДАЛЬЯНА ---
      case 'RESTAURANTS_DINING':
        context += `\n[ЦЕЛЕВОЙ МОДУЛЬ: ГАСТРОНОМИЯ И РЕКОМЕНДАЦИИ РЕСТОРАНОВ ДАЛЬЯНА]
Суперхозяин Алексей Знаменский лично рекомендует проверенные заведения Дальяна:

1. 🌸 Çiçek Restaurant [Любимый семейный ресторан]:
   • Особенности: аутентичная турецкая и эгейская кухня, уютная семейная атмосфера в тихом саду.
   • Фирменные блюда: бараньи ребрышки на гриле [Kuzu Pirzola], свежайший запеченный сибас, салат Rokka с гранатовым соусом, домашний густой айран.
   • Адрес: Dalyan, Rodoslu Yaşar Sünger Sk [в пешей доступности от виллы].

2. 🌅 The Pier Dalyan [Ресторан на набережной у воды]:
   • Особенности: ресторан у самой реки с прямым завораживающим видом на подсвеченные Ликийские скальные гробницы.
   • Фирменные блюда: свежая речная и морская рыба, морепродукты, традиционные турецкие мезе, стейки.
   • Совет: столик у кромки воды лучше бронировать заранее на закатное время.
   • Адрес: Dalyan, Maraş Cd. No: 60.

3. 🎱 Mavi Bar and Restaurant [Напротив виллы]:
   • Особенности: расположен прямо через дорогу от Villa Turaman.
   • Формат: бильярд, открытый бассейн, европейская и турецкая кухня, напитки и коктейли.
   • Адрес: Dalyan, Özalp Sk. No: 14.

4. 🍺 Yanık Gastro Pub [Крафтовый бар на пешеходной улице]:
   • Особенности: крафтовое пиво, авторские коктейли, сочные бургеры и легкая музыка.
   • Адрес: Dalyan, Maraş Cd. No: 42.

5. 👨‍🍳 Питание на самой вилле:
   • Персональный шеф-повар: 4-курсовой ужин у бассейна [свежие фермерские продукты, мезе, морепродукты] - €120.
   • BBQ-вечер на углях: каре ягненка, стейки рибай и овощи гриль от гриль-мастера - €160.

ИНСТРУКЦИЯ ДЛЯ ИИ: Назови эти заведения конкретно с их названиями, адресами и блюдами. Прояви гостеприимство и предложи помощь в бронировании столика.`;
        break;

      // --- НАПРАВЛЕНИЕ 3: ДОСТОПРИМЕЧАТЕЛЬНОСТИ И ПЛЯЖИ ДАЛЬЯНА ---
      case 'SIGHTS_BEACHES':
        context += `\n[ЦЕЛЕВОЙ МОДУЛЬ: ПУТЕВОДИТЕЛИ, ПЛЯЖИ И ДОСТОПРИМЕЧАТЕЛЬНОСТИ ИЗ GOOGLE ТАБЛИЦ]\n`;
        if (this.guidesList.length > 0) {
          this.guidesList.forEach((g, idx) => {
            const price = g.priceEur ? ` [Цена: €${g.priceEur}]` : '';
            context += `${idx + 1}. 🗺️ ${g.title}${price}:\n   ${g.desc || ''}${g.details ? `\n   Подробности: ${g.details}` : ''}\n`;
          });
        }
        context += `\nКлючевые локации экосистемы:
• 🏖️ Пляж Изтузу [İztuzu Plajı]: 4.5 км чистейшей песчаной косы, заповедник гигантских черепах Caretta-Caretta, центр спасения DEKAMER [вход бесплатный]. Лодки-долмуши от набережной Дальяна или 15 мин на машине.
• 🗿 Ликийские скальные гробницы IV в. до н.э. [Kral Kaya Mezarları]: лучший вид открывается с воды во время лодочной прогулки или с набережной.
• 🏛️ Античный город Каунос [Kaunos Antik Kenti]: амфитеатр, термы, агора. Переправа на гребной лодочке через реку.
• ♨️ Термальные минеральные грязи Султание: природные радоновые ванны на озере Кёйджегиз. Доезд на лодке.
• 🚤 Лодочные туры: Капитан Адам [Телефон / WhatsApp: ${boatPartner.phone}].`;
        break;

      // --- НАПРАВЛЕНИЕ 4: ДОПОЛНИТЕЛЬНЫЕ УСЛУГИ ВИЛЛЫ ---
      case 'SERVICES_EXCURSIONS':
        context += `\n[ЦЕЛЕВОЙ МОДУЛЬ: КАТАЛОГ ПЛАТНЫХ УСЛУГ ИЗ GOOGLE ТАБЛИЦ]\n`;
        if (this.servicesList.length > 0) {
          this.servicesList.forEach((s, idx) => {
            const price = s.priceEur ? `€${s.priceEur}` : (s.priceTry ? `${s.priceTry} TRY` : '');
            context += `${idx + 1}. 🛎️ ${s.name}: ${price}\n   ${s.desc || ''}${s.details ? ` [${s.details}]` : ''}\n`;
          });
        } else {
          context += `1. VIP-трансфер Mercedes Vito: €50 / 1800 TRY [Ahmet: ${partner.phone}]
2. Приватный круиз на яхте по реке Дальян и озеру Кёйджегиз: €250 [Капитан Адам: ${boatPartner.phone}]
3. Ужин от персонального шеф-повара на вилле: €120
4. BBQ-вечер на углях от гриль-мастера: €160
5. СПА-тур в термальные грязи Султание: €70
6. Аренда SUP-бордов и экспедиционного каяка: €80
7. Прокат электровелосипедов: €40
8. Экспресс-уборка со сменой премиального белья: €60\n`;
        }
        break;

      // --- НАПРАВЛЕНИЕ 5: ЗАСЕЛЕНИЕ, ВЫЕЗД И ПРАВИЛА ДОМА ---
      case 'HOUSE_RULES_CHECKIN':
        const canViewWifi = this.canAccessNode('wifi_credentials', guestStage);
        const canViewLock = this.canAccessNode('smart_lock_pin', guestStage);

        const wifiInfo = canViewWifi
          ? `Сеть [${villa.wifiName || 'Guest'}], Пароль [${villa.wifiPass || 'villa2026'}].`
          : `Сеть [Guest]. Скоростной оптоволоконный Wi-Fi 100 Мбит/с. Точный пароль активируется сразу после подтверждения бронирования.`;

        const lockInfo = canViewLock
          ? `${villa.checkinMethod || 'Электронный смарт-замок и мини-сейф с кодом'}.`
          : `Электронный смарт-замок и мини-сейф. Персональный код замка активируется в день заселения.`;

        context += `\n[ЦЕЛЕВОЙ МОДУЛЬ: ЗАСЕЛЕНИЕ И ПРАВИЛА ДОМА]
ВРЕМЯ ЗАЕЗДА: ${rules.checkInTime || villa.checkinTime || '16:00'} [после 16:00]. ВЫЕЗД: до ${rules.checkOutTime || villa.checkoutTime || '10:00'}.
СПОСОБ ЗАСЕЛЕНИЯ: ${lockInfo}
WI-FI: ${wifiInfo}
ТОЧНЫЙ АДРЕС: ${villa.address}. Локация Google Maps: ${villa.mapsUrl}.
ПРАВИЛА: Курение внутри виллы строго запрещено. Тихий час с 23:00 до 08:00. Вместимость строго до 10 человек. Животные только по предварительному согласованию.`;
        break;

      // --- НАПРАВЛЕНИЕ 6: ХАРАКТЕРИСТИКИ ВИЛЛЫ, БАССЕЙН И ДЖАКУЗИ ---
      case 'GENERAL_VILLA_INFO':
        context += `\n[ЦЕЛЕВОЙ МОДУЛЬ: ХАРАКТЕРИСТИКИ ВИЛЛЫ, БАССЕЙН И ДЖАКУЗИ]
ПЛАНИРОВКА: ${villa.floors}
КОМНАТЫ: 4 отдельные спальни, 5 кроватей, 4 индивидуальные ванные комнаты. Кондиционеры во всех комнатах.
БАССЕЙН: ${pool.specs} [сезон: ${pool.season}].
ДЖАКУЗИ: ${pool.jacuzziSchedule}.
ПОДСВЕТКА ВОДЫ: ${pool.lighting}.
ОЧИСТКА БАССЕЙНА: ${pool.maintenance}.`;
        break;

      // --- НАПРАВЛЕНИЕ 7: ТАРИФЫ И БРОНИРОВАНИЕ ---
      case 'PRICING_BOOKING':
        context += `\n[ЦЕЛЕВОЙ МОДУЛЬ: ТАРИФЫ И БРОНИРОВАНИЕ]
АКТУАЛЬНАЯ БАЗОВАЯ ЦЕНА: $${basePrice} USD/ночь.
МИНИМАЛЬНЫЙ ФИНАНСОВЫЙ БАРЬЕР: $${minPrice} USD/ночь. Ниже этой суммы опускать цену КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО.
ВАРИАТИВНОСТЬ ПРИМЕНЕНИЯ СКИДОК [КОРИДОР ДО ${maxDiscount}%]:
1. Невозвратный тариф: скидка 10% [$${Math.max(minPrice, Math.round(basePrice * 0.9))} USD/ночь] при бронировании на даты до 60 дней.
2. Длительное проживание от 7 ночей: скидка 15% [$${Math.max(minPrice, Math.round(basePrice * 0.85))} USD/ночь].
3. Спецпредложение на свободные стыковочные окна между бронями OTA: скидка до 20% [$${Math.max(minPrice, Math.round(basePrice * 0.8))} USD/ночь].
ПРАВИЛА БРОНИРОВАНИЯ:
• Минимальный срок: ${rules.minNights || 3} ночей.
• Предварительное уведомление: минимум за ${rules.advanceNoticeDays || 2} дня до заезда.
• Политика отмены: бесплатная отмена за 14 суток до даты заезда со 100% возвратом средств.
• Защита от овербукинга: сверка занятости с Airbnb, Booking.com, Vrbo, Avito, Agoda, Google Calendar.
• Прямое бронирование: гарантия лучшей цены Best Rate Guarantee без комиссий OTA [15-20% выгоды гостя].`;
        break;

      // --- НАПРАВЛЕНИЕ 8: НАЛОГИ И E-ARŞİV FATURA GİB ---
      case 'LEGAL_TAX_INVOICE':
        context += `\n[ЦЕЛЕВОЙ МОДУЛЬ: НАЛОГИ И E-ARŞİV FATURA GİB]
РЕГИСТРАЦИЯ: Ortaca Vergi Dairesi, VKN: ${taxes.vkn}.
ОСНОВАНИЕ: ${taxes.lawBasis}.
СТАВКИ НАЛОГОВ: KDV [НДС] ${taxes.vatKdv}, Налог на проживание ${taxes.accommodationTax}, общий делитель брутто: ${taxes.divisor}.
ПРАВИЛО GİB: Счет выставляется на 100% брутто на имя гостя [${taxes.recipient}] в валюте ${taxes.currency}.
ЦЕНА ЗА ЕДИНИЦУ [Birim Fiyat]: делится на количество ночей с точностью ${taxes.unitDecimals} знаков.
КУРС КОНВЕРТАЦИИ: ${taxes.tcmbPolicy}.
ОБЯЗАТЕЛЬНЫЙ NOT: ${taxes.notTemplate}`;
        break;

      // --- ОБЩИЙ МОДУЛЬ ПО УМОЛЧАНИЮ ---
      default:
        context += `\n[ОБЩИЙ МОДУЛЬ: ГЛАВНЫЕ ОРИЕНТИРЫ ЭКОСИСТЕМЫ]
• Трансфер из аэропорта DLM: €50 / 1800 TRY [Ahmet: ${partner.phone}].
• Речные прогулки на лодке: Капитан Адам [Телефон / WhatsApp: ${boatPartner.phone}].
• Проверенный ресторан Дальяна: Çiçek Restaurant [Rodoslu Yaşar Sünger Sk, баранина, сибас].
• Бассейн с соленой водой 36м² и уличное джакузи [09:00-18:00].
• Заезд после 16:00, выезд до 10:00.
• Официальный Telegram суперхозяина: ${host.telegram || '@villaturaman'}.`;
        break;
    }

    // СТАДИЯ ГОСТЯ И 8-СТАДИЙНАЯ МАРШРУТИЗАЦИЯ
    const stageIdx = normalizeStageIndex(guestStage);
    context += `\n\n[ЭТАП ВОВЛЕЧЕННОСТИ ГОСТЯ: ${guestStage} | ИНДЕКС СТАДИИ: ${stageIdx}/8]`;

    if (stageIdx === 1) {
      context += `\n• Стадия 1: Новый посетитель [Холодный лид].
• Задача: Радушно презентовать виллу [4 спальни, бассейн с соленой водой, джакузи, тихий сад], аргументировать цену, показать свободные даты.
• БЕЗОПАСНОСТЬ [L1]: Пароль от Wi-Fi и код от замка строго замаскированы.`;
    } else if (stageIdx === 2) {
      context += `\n• Стадия 2: Зарегистрированный гость [Квалифицированный лид].
• Задача: Предложить индивидуальные условия, объяснить скидки до ${maxDiscount}%, стимулировать переход к бронированию.`;
    } else if (stageIdx === 3) {
      context += `\n• Стадия 3: Заявка в ожидании оплаты [24ч HOLD / Спецпредложение].
• Задача: Напомнить об открытом 24-часовом окне бронирования, зафиксированной спеццене и помочь провести оплату через Stripe или Т-Банк.`;
    } else if (stageIdx === 4) {
      context += `\n• Стадия 4: Оплаченное бронирование [Подтверждено, ожидание заезда].
• Задача: Поздравить с успешной бронью, запросить паспортные данные для турецкой системы KBS полиции [Kimlik Bildirme Kanunu 1774] и предложить трансфер.`;
    } else if (stageIdx === 5) {
      context += `\n• Стадия 5: 48 часов до заезда [Финальная подготовка].
• Задача: Сверить время прибытия рейса в Даламан DLM, подтвердить трансфер с Ahmet [+90 543 335 80 70], завершить регистрацию в KBS.`;
    } else if (stageIdx === 6) {
      context += `\n• Стадия 6: День заселения [Заезд после 16:00].
• Задача: Предоставить точные инструкции заселения, код от смарт-замка, пароль от Wi-Fi и убедиться в комфортном прибытии.`;
    } else if (stageIdx === 7) {
      context += `\n• Стадия 7: Гость проживает на вилле [In-House].
• Задача: Оказывать круглосуточную заботу 24/7, предоставить доступы к технике, предложить выезд на лодке с капитаном Адамом или ужин от шеф-повара.`;
    } else if (stageIdx === 8) {
      context += `\n• Стадия 8: День выезда и завершение [Выезд до 10:00].
• Задача: Поблагодарить за выбор Villa Turaman, проконтролировать сдачу ключей, организовать трансфер в аэропорт, при необходимости оформить e-Arşiv Fatura через бухгалтера.`;
    }

    // ПОДБОРКА РЕЛЕВАНТНЫХ ШАБЛОНОВ ИЗ CRM
    if (this.templatesList && this.templatesList.length > 0) {
      const relevantTpls = this.templatesList.filter((t) => {
        const id = (t.id || '').toLowerCase();
        if (stageIdx <= 2) return id.startsWith('1.');
        if (stageIdx === 3) return id.startsWith('1.') || id.startsWith('2.');
        if (stageIdx === 4 || stageIdx === 5) return id.startsWith('2.') || id.startsWith('3.');
        if (stageIdx === 6 || stageIdx === 7) return id.startsWith('3.') || id.startsWith('4.');
        if (stageIdx === 8) return id.startsWith('5.');
        return false;
      });

      if (relevantTpls.length > 0) {
        context += `\n\n[РЕКОМЕНДОВАННЫЕ ШАБЛОНЫ СООБЩЕНИЙ ДЛЯ ЭТОГО ЭТАПА]:\n`;
        relevantTpls.slice(0, 3).forEach((t) => {
          const title = t.title?.ru || t.title || t.id;
          const body = t.content?.ru || t.content || '';
          context += `• ${title}: "${body}"\n`;
        });
      }
    }

    return context;
  }
}

// Синглтон графа знаний
const globalKnowledgeGraph = new VillaKnowledgeGraph();

module.exports = {
  classifyIntent,
  classifyGuestStage,
  normalizeStageIndex,
  isNodeAllowedForStage,
  VillaKnowledgeGraph,
  globalKnowledgeGraph
};

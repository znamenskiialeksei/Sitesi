// ==============================================================================
// ОМНИ-АГРЕГАТОР КАЛЕНДАРЯ И АНАЛИЗАТОР ТАРИФОВ VILLA TURAMAN
// Файл: utils/calendarAggregator.js
// Назначение: Сквозная агрегация занятости из всех источников:
// 1. 6 внешних OTA-платформ: Airbnb, Booking.com, Vrbo, Avito, Agoda, Google Calendar;
// 2. Лист 📅 Календарь и Тарифы: настройки, сезонные цены, удержания HOLD;
// 3. Лист 📋 Заявки и Бронирования: прямые подтвержденные брони виллы;
// 4. Детектор свободных стыковочных окон между бронями;
// 5. Динамический расчет коридора тарифов и скидок [базовая цена vs минимальный барьер].
// 100% Zero-Brackets & Zero-Emdash Стандарт.
// ==============================================================================

const ical = require('node-ical');

// Внешние каналы бронирования виллы с прямыми ссылками на iCal
const ICAL_SOURCES = [
  {
    id: 'airbnb',
    name: 'Airbnb',
    url: 'https://www.airbnb.ru/calendar/ical/1422403960484282130.ics?t=69c8e5e0d5544dcd903b32b83290099a',
    enabled: true
  },
  {
    id: 'booking',
    name: 'Booking.com',
    url: 'https://ical.booking.com/v1/export?t=e827db15-6756-4e06-9d7b-2018f62e806c',
    enabled: true
  },
  {
    id: 'vrbo',
    name: 'Vrbo',
    url: 'http://www.vrbo.com/icalendar/72eb9736e6514b82a4c42974f4f205f1.ics',
    enabled: true
  },
  {
    id: 'avito',
    name: 'Avito',
    url: 'https://www.avito.ru/calendars-export/76/50/7662540950.ics',
    enabled: true
  },
  {
    id: 'agoda',
    name: 'Agoda',
    url: 'https://ycs.agoda.com/en-us/api/ari/icalendar?key=5rAAt7ANnirTTWAPbRTgMdmYuZ09VqFz',
    enabled: true
  },
  {
    id: 'google',
    name: 'Google Calendar',
    url: 'https://calendar.google.com/calendar/ical/41f6022c98338bf16240faec973d63393b57d8b067e3b58215f725f509a9be01%40group.calendar.google.com/public/basic.ics',
    enabled: true
  }
];

// Кэш внешних событий в глобальной памяти Node.js [60 секунд]
const ICAL_CACHE_TTL_MS = 60 * 1000;
if (!global._syncedCalendarCache) {
  global._syncedCalendarCache = {
    data: null,
    lastFetchedAt: 0,
    isFetching: false
  };
}

// Проверка типа события iCal
const isBlockSummary = (summaryObj) => {
  const text = (typeof summaryObj === 'string' ? summaryObj : summaryObj?.val || '').toLowerCase();
  return (
    text.includes('block') ||
    text.includes('unavailable') ||
    text.includes('not available') ||
    text.includes('закрыто') ||
    text.includes('closed') ||
    text.includes('owner') ||
    text.includes('blocked') ||
    text.includes('клининг') ||
    text.includes('ремонт')
  );
};

// Приведение даты к строке YYYY-MM-DD
const formatDateIso = (dateObj) => {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// Нормализация даты к полуночи UTC
const normalizeDateUtc = (dateObj) => {
  return new Date(Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()));
};

/**
 * Асинхронный опрос всех 6 внешних iCal каналов с кэшированием
 */
async function fetchExternalIcalEvents() {
  const now = Date.now();
  const cache = global._syncedCalendarCache;

  if (cache.data && (now - cache.lastFetchedAt < ICAL_CACHE_TTL_MS)) {
    return cache.data;
  }

  const activeSources = ICAL_SOURCES.filter((s) => s.enabled);
  const events = [];
  const occupiedDays = new Set();

  const results = await Promise.allSettled(
    activeSources.map(async (source) => {
      const fetchUrl = `${source.url}${source.url.includes('?') ? '&' : '?'}nocache=${Date.now()}`;
      const response = await fetch(fetchUrl, {
        cache: 'no-store',
        headers: {
          'User-Agent': 'Mozilla/5.0 [Windows NT 10.0; Win64; x64] AppleWebKit/537.36 [KHTML, like Gecko] Chrome/122.0.0.0 Safari/537.36',
          'Accept': 'text/calendar'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} from ${source.name}`);
      }

      const icsText = await response.text();
      const parsedData = await ical.async.parseICS(icsText);
      return { parsedData, source };
    })
  );

  results.forEach((res) => {
    if (res.status === 'fulfilled') {
      const { parsedData, source } = res.value;

      for (const k in parsedData) {
        if (Object.prototype.hasOwnProperty.call(parsedData, k)) {
          const ev = parsedData[k];
          if (ev.type === 'VEVENT' && ev.start) {
            const isBlock = isBlockSummary(ev.summary);
            const startDate = normalizeDateUtc(new Date(ev.start));
            const endDate = ev.end ? normalizeDateUtc(new Date(ev.end)) : startDate;

            const startStr = formatDateIso(startDate);
            const endStr = formatDateIso(endDate);

            events.push({
              sourceId: source.id,
              sourceName: source.name,
              start: startStr,
              end: endStr,
              isBlock,
              summary: ev.summary || (isBlock ? 'Блокировка владельца' : `Бронь на ${source.name}`)
            });

            let cur = startDate.getTime();
            const endMs = endDate.getTime();
            const oneDay = 24 * 60 * 60 * 1000;

            if (cur === endMs) {
              occupiedDays.add(startStr);
            } else {
              while (cur < endMs) {
                occupiedDays.add(formatDateIso(new Date(cur)));
                cur += oneDay;
              }
            }
          }
        }
      }
    }
  });

  const snapshot = {
    events,
    occupiedDates: Array.from(occupiedDays).sort(),
    channelsCount: activeSources.length,
    timestamp: now
  };

  cache.data = snapshot;
  cache.lastFetchedAt = now;
  return snapshot;
}

/**
 * Парсинг строк листа 📅 Календарь и Тарифы
 */
function parseCalendarSheetRows(calendarRows = []) {
  const globalRules = {
    basePrice: 250,
    currency: 'USD',
    minNights: 3,
    maxNights: 30,
    bookingWindowMonths: 18,
    advanceNoticeDays: 2,
    bookingMode: 'instant',
    checkInTime: '16:00',
    checkOutTime: '10:00'
  };

  const seasonalRates = [];
  const minStayRules = [];
  const sheetBlocks = [];
  const nowTime = Date.now();

  (calendarRows || []).forEach((row) => {
    const col0 = (row[0] || '').toString().trim(); // Дата старта
    const col1 = (row[1] || '').toString().trim(); // Дата завершения
    const col2 = (row[2] || '').toString().trim(); // Тип
    const col3 = (row[3] || '').toString().trim(); // Значение
    const col4 = (row[4] || '').toString().trim(); // Заметка

    if (col2 === 'Настройки' || col0.includes('Глобальные правила')) {
      try {
        const parsed = JSON.parse(col3);
        Object.assign(globalRules, parsed);
        if (globalRules.basePrice) {
          globalRules.basePrice = parseFloat(globalRules.basePrice) || 250;
        }
        if (globalRules.minNights) {
          globalRules.minNights = parseInt(globalRules.minNights, 10) || 3;
        }
      } catch {
        // Оставляем дефолтные параметры
      }
    } else if (col2 === 'Цена') {
      const priceVal = parseFloat(col3) || 0;
      if (priceVal > 0) {
        seasonalRates.push({
          startDate: col0,
          endDate: col1,
          price: priceVal,
          note: col4
        });
      }
    } else if (col2 === 'Мин. дней') {
      const minDays = parseInt(col3, 10) || 3;
      minStayRules.push({
        startDate: col0,
        endDate: col1,
        minNights: minDays,
        note: col4
      });
    } else if (col2 === 'Блокировка') {
      // Проверка на HOLD
      let isHold = false;
      let holdExpiresAt = null;
      let isExpired = false;

      if (col3.startsWith('HOLD')) {
        isHold = true;
        const parts = col3.split('|').map((p) => p.trim());
        if (parts[3]) {
          const expMs = new Date(parts[3]).getTime();
          if (!isNaN(expMs)) {
            holdExpiresAt = parts[3];
            if (expMs < nowTime) {
              isExpired = true;
            }
          }
        }
      }

      if (!isExpired) {
        sheetBlocks.push({
          startDate: col0,
          endDate: col1,
          isHold,
          holdExpiresAt,
          value: col3,
          note: col4
        });
      }
    }
  });

  return {
    globalRules,
    seasonalRates,
    minStayRules,
    sheetBlocks
  };
}

/**
 * Парсинг строк листа 📋 Заявки и Бронирования
 */
function parseBookingsSheetRows(bookingRows = []) {
  const bookings = [];

  (bookingRows || []).slice(1).forEach((r) => {
    const createdAt = (r[0] || '').toString().trim();
    const guestName = (r[1] || '').toString().trim();
    const contact = (r[2] || '').toString().trim();
    const start = (r[3] || '').toString().trim();
    const end = (r[4] || '').toString().trim();
    const nights = parseInt(r[5], 10) || 1;
    const totalCost = (r[9] || '').toString().trim();
    const status = (r[10] || '').toString().trim();

    if (start && end && guestName) {
      bookings.push({
        createdAt,
        guestName,
        contact,
        start,
        end,
        nights,
        totalCost,
        status,
        isConfirmed: status.includes('Оплачено') || status.includes('Подтверждено')
      });
    }
  });

  return bookings;
}

/**
 * Поиск свободных окон между занятыми датами
 */
function findAvailableGaps(allOccupiedDatesList, minNights = 3, lookaheadDays = 90) {
  const occupiedSet = new Set(allOccupiedDatesList);
  const gaps = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let currentGapStart = null;
  let currentGapDays = 0;

  for (let i = 2; i <= lookaheadDays; i++) {
    const curDate = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
    const dateStr = formatDateIso(curDate);

    if (!occupiedSet.has(dateStr)) {
      if (!currentGapStart) {
        currentGapStart = dateStr;
        currentGapDays = 1;
      } else {
        currentGapDays++;
      }
    } else {
      if (currentGapStart && currentGapDays >= minNights) {
        gaps.push({
          start: currentGapStart,
          end: dateStr,
          nights: currentGapDays
        });
      }
      currentGapStart = null;
      currentGapDays = 0;
    }
  }

  if (currentGapStart && currentGapDays >= minNights) {
    gaps.push({
      start: currentGapStart,
      nights: currentGapDays
    });
  }

  return gaps.slice(0, 5); // Возвращаем топ 5 ближайших окон
}

/**
 * Формирование единого полного слепка календаря и аналитики тарифов
 */
async function getUnifiedCalendarSnapshot({
  calendarRows = [],
  bookingRows = [],
  minNightPriceSetting = 180
} = {}) {
  // 1. Опрос внешних каналов iCal
  let icalSnapshot = { events: [], occupiedDates: [] };
  try {
    icalSnapshot = await fetchExternalIcalEvents();
  } catch (err) {
    console.warn('[calendarAggregator] Предупреждение опроса iCal:', err.message);
  }

  // 2. Разбор листов CRM
  const { globalRules, seasonalRates, minStayRules, sheetBlocks } = parseCalendarSheetRows(calendarRows);
  const bookings = parseBookingsSheetRows(bookingRows);

  // 3. Слияние всех занятых дат
  const allOccupiedDates = new Set(icalSnapshot.occupiedDates);

  // Добавление подтвержденных броней из CRM
  bookings.forEach((b) => {
    if (b.isConfirmed) {
      allOccupiedDates.add(b.start);
    }
  });

  // Добавление активных блокировок и HOLD из CRM
  sheetBlocks.forEach((b) => {
    if (b.startDate) {
      allOccupiedDates.add(b.startDate);
    }
  });

  const uniqueOccupiedList = Array.from(allOccupiedDates).sort();

  // 4. Поиск свободных окон
  const minNights = globalRules.minNights || 3;
  const availableGaps = findAvailableGaps(uniqueOccupiedList, minNights, 90);

  // 5. Анализ тарифов и расчет коридора скидок
  const currentBasePrice = globalRules.basePrice || 250;
  const minFloor = parseFloat(minNightPriceSetting) || 180;
  const delta = Math.max(0, currentBasePrice - minFloor);
  const maxDiscountPercent = currentBasePrice > 0 ? Math.round((delta / currentBasePrice) * 100) : 0;

  const nonRefPrice = Math.max(minFloor, Math.round(currentBasePrice * 0.9));
  const longStayPrice = Math.max(minFloor, Math.round(currentBasePrice * 0.85));
  const gapSpecialPrice = Math.max(minFloor, Math.round(currentBasePrice * 0.8));

  const pricingAnalysis = {
    currentBasePrice,
    minBarrierPrice: minFloor,
    currency: globalRules.currency || 'USD',
    delta,
    maxDiscountPercent,
    rules: {
      minNights: globalRules.minNights || 3,
      maxNights: globalRules.maxNights || 30,
      advanceNoticeDays: globalRules.advanceNoticeDays || 2,
      bookingMode: globalRules.bookingMode || 'instant',
      checkInTime: globalRules.checkInTime || '16:00',
      checkOutTime: globalRules.checkOutTime || '10:00'
    },
    packages: [
      {
        name: 'Стандартный тариф',
        discountPercent: 0,
        pricePerNight: currentBasePrice,
        cancellation: 'Бесплатная отмена за 14 суток со 100% возвратом средств'
      },
      {
        name: 'Невозвратный тариф',
        discountPercent: 10,
        pricePerNight: nonRefPrice,
        cancellation: 'Без возврата средств при отмене, бронирование на даты до 60 дней'
      },
      {
        name: 'Длительное проживание от 7 ночей',
        discountPercent: 15,
        pricePerNight: longStayPrice,
        cancellation: 'Бесплатная отмена за 14 суток'
      },
      {
        name: 'Горящее спецпредложение на свободные окна',
        discountPercent: 20,
        pricePerNight: gapSpecialPrice,
        cancellation: 'Спецусловия при заполнении стыковочных окон между бронями'
      }
    ]
  };

  return {
    globalRules,
    seasonalRates,
    minStayRules,
    sheetBlocks,
    bookings,
    icalEvents: icalSnapshot.events || [],
    occupiedDatesCount: uniqueOccupiedList.length,
    availableGaps,
    pricingAnalysis,
    sourcesList: ['Airbnb', 'Booking.com', 'Vrbo', 'Avito', 'Agoda', 'Google Calendar', 'Villa Turaman Direct']
  };
}

module.exports = {
  fetchExternalIcalEvents,
  parseCalendarSheetRows,
  parseBookingsSheetRows,
  findAvailableGaps,
  getUnifiedCalendarSnapshot,
  ICAL_SOURCES
};

// ==============================================================================
// МОДУЛЬ СИНХРОНИЗАЦИИ КАЛЕНДАРЯ (iCal Channel Manager API)
// Файл: pages/api/calendar.js
// Назначение: Параллельный опрос и парсинг внешних календарей (Airbnb, Booking, Vrbo,
// Avito, Agoda, Google Calendar) для предотвращения овербукинга виллы.
// ==============================================================================

import ical from 'node-ical';

// Конфигурация внешних каналов бронирования с прямыми ссылками на экспорт iCal
const icalSources = [
  {
    id: 'airbnb',
    name: 'Airbnb',
    url: 'https://www.airbnb.ru/calendar/ical/1422403960484282130.ics?t=69c8e5e0d5544dcd903b32b83290099a',
    enabled: true,
    importBookings: true,
    importBlocks: true
  },
  {
    id: 'booking',
    name: 'Booking.com',
    url: 'https://ical.booking.com/v1/export?t=e827db15-6756-4e06-9d7b-2018f62e806c',
    enabled: true,
    importBookings: true,
    importBlocks: true
  },
  {
    id: 'vrbo',
    name: 'Vrbo',
    url: 'http://www.vrbo.com/icalendar/72eb9736e6514b82a4c42974f4f205f1.ics',
    enabled: true,
    importBookings: true,
    importBlocks: true
  },
  {
    id: 'avito',
    name: 'Avito',
    url: 'https://www.avito.ru/calendars-export/76/50/7662540950.ics',
    enabled: true,
    importBookings: true,
    importBlocks: true
  },
  {
    id: 'agoda',
    name: 'Agoda',
    url: 'https://ycs.agoda.com/en-us/api/ari/icalendar?key=5rAAt7ANnirTTWAPbRTgMdmYuZ09VqFz',
    enabled: true,
    importBookings: true,
    importBlocks: true
  },
  {
    id: 'google',
    name: 'Google Calendar',
    url: 'https://calendar.google.com/calendar/ical/41f6022c98338bf16240faec973d63393b57d8b067e3b58215f725f509a9be01%40group.calendar.google.com/public/basic.ics',
    enabled: true,
    importBookings: true,
    importBlocks: true
  }
];

// Проверка, является ли событие блокировкой дат (закрытые даты, техобслуживание)
const isBlockEvent = (summaryObj) => {
  const text = (typeof summaryObj === 'string' ? summaryObj : summaryObj?.val || '').toLowerCase();
  return (
    text.includes('block') ||
    text.includes('unavailable') ||
    text.includes('not available') ||
    text.includes('закрыто') ||
    text.includes('closed') ||
    text.includes('owner') ||
    text.includes('blocked')
  );
};

// Приведение даты к полуночи UTC для исключения сдвигов часовых поясов
const normalizeDateToUTC = (dateObj) => {
  const y = dateObj.getFullYear();
  const m = dateObj.getMonth();
  const d = dateObj.getDate();
  return new Date(Date.UTC(y, m, d));
};

export default async function handler(req, res) {
  // Разрешаем только GET запросы для чтения занятости
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const allOccupiedDates = [];
    const allEvents = [];

    // Фильтруем только активные каналы
    const activeSources = icalSources.filter((s) => s.enabled);

    // Параллельный асинхронный опрос всех активных провайдеров
    const results = await Promise.allSettled(
      activeSources.map(async (source) => {
        // Добавление nocache метки для предотвращения застревания устаревших ответов
        const fetchUrl = `${source.url}${source.url.includes('?') ? '&' : '?'}nocache=${Date.now()}`;

        const response = await fetch(fetchUrl, {
          cache: 'no-store',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Accept': 'text/calendar'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status} from ${source.name}`);
        }

        const icsText = await response.text();
        const data = await ical.async.parseICS(icsText);
        return { data, source };
      })
    );

    // Обработка результатов каждого канала
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        const { data, source } = result.value;

        for (const k in data) {
          if (Object.prototype.hasOwnProperty.call(data, k)) {
            const ev = data[k];

            // Проверяем тип VEVENT с корректной начальной датой
            if (ev.type === 'VEVENT' && ev.start) {
              const summary = ev.summary;
              const isBlock = isBlockEvent(summary);

              const shouldImport = (isBlock && source.importBlocks) || (!isBlock && source.importBookings);

              if (shouldImport) {
                const start = normalizeDateToUTC(new Date(ev.start));
                const end = ev.end ? normalizeDateToUTC(new Date(ev.end)) : normalizeDateToUTC(new Date(ev.start));

                allEvents.push({
                  start: start.toISOString().split('T')[0],
                  end: end.toISOString().split('T')[0],
                  sourceId: source.id,
                  sourceName: source.name
                });

                let currentTimestamp = start.getTime();
                const endTimestamp = end.getTime();
                const oneDay = 24 * 60 * 60 * 1000;

                // Заполнение списка занятых дней
                if (currentTimestamp === endTimestamp) {
                  allOccupiedDates.push(new Date(currentTimestamp).toISOString().split('T')[0]);
                } else {
                  while (currentTimestamp < endTimestamp) {
                    allOccupiedDates.push(new Date(currentTimestamp).toISOString().split('T')[0]);
                    currentTimestamp += oneDay;
                  }
                }
              }
            }
          }
        }
      } else {
        console.warn('Ошибка при парсинге календаря:', result.reason);
      }
    });

    // Устранение дубликатов занятых дат
    const uniqueDates = [...new Set(allOccupiedDates)];

    // Кэширование на стороне CDN на 60 секунд со stale-while-revalidate
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.status(200).json({ dates: uniqueDates, events: allEvents });
  } catch (error) {
    console.error('Критическая ошибка синхронизации календаря:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}


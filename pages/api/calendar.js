import ical from 'node-ical'; // Подключение библиотеки для парсинга iCal

// БЛОК КОНФИГУРАЦИИ ИСТОЧНИКОВ (Менеджер каналов Villa Turaman)
// ==========================================
const icalSources = [
  {
    id: "airbnb", 
    name: "Airbnb", 
    url: "https://www.airbnb.ru/calendar/ical/1422403960484282130.ics?t=69c8e5e0d5544dcd903b32b83290099a", 
    enabled: true, // Включение парсинга источника
    importBookings: true, // Импорт подтвержденных бронирований
    importBlocks: true // Импорт ручных блокировок
  },
  {
    id: "booking", 
    name: "Booking", 
    url: "https://ical.booking.com/v1/export?t=e827db15-6756-4e06-9d7b-2018f62e806c", 
    enabled: true, 
    importBookings: true, 
    importBlocks: true 
  },
  {
    id: "vrbo", 
    name: "Vrbo", 
    url: "http://www.vrbo.com/icalendar/72eb9736e6514b82a4c42974f4f205f1.ics", 
    enabled: true, 
    importBookings: true, 
    importBlocks: true 
  },
  {
    id: "avito", 
    name: "Avito", 
    url: "https://www.avito.ru/calendars-export/76/50/7662540950.ics", 
    enabled: true, 
    importBookings: true, 
    importBlocks: true 
  },
  {
    id: "agoda", 
    name: "Agoda", 
    url: "https://ycs.agoda.com/en-us/api/ari/icalendar?key=5rAAt7ANnirTTWAPbRTgMdmYuZ09VqFz", 
    enabled: true, 
    importBookings: true, 
    importBlocks: true 
  },
  {
    id: "google", 
    name: "Google Calendar", 
    url: "https://calendar.google.com/calendar/ical/41f6022c98338bf16240faec973d63393b57d8b067e3b58215f725f509a9be01%40group.calendar.google.com/public/basic.ics", 
    enabled: true, 
    importBookings: true, 
    importBlocks: true 
  }
];

// Функция определения блокировок (поиск ключевых слов в iCal)
const isBlockEvent = (summaryObj) => {
  const text = (typeof summaryObj === 'string' ? summaryObj : summaryObj?.val || "").toLowerCase();
  return (
    text.includes("block") || 
    text.includes("unavailable") || 
    text.includes("not available") || 
    text.includes("закрыто") || 
    text.includes("closed") || 
    text.includes("owner") || 
    text.includes("blocked")
  );
};

// Нормализация даты к стандарту UTC для избежания смещений часовых поясов
const normalizeDateToUTC = (dateObj) => {
  const y = dateObj.getFullYear();
  const m = dateObj.getMonth();
  const d = dateObj.getDate();
  return new Date(Date.UTC(y, m, d));
};

export default async function handler(req, res) {
  // Разрешаем только GET запросы к API
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    let allOccupiedDates = []; // Массив для хранения всех занятых дат
    let allEvents = []; // Массив для хранения объектов событий
    
    // Фильтруем только активные источники
    const activeSources = icalSources.filter(s => s.enabled);

    // Параллельный парсинг всех iCal ссылок
    const results = await Promise.allSettled(
      activeSources.map(async (source) => {
        // Добавление nocache для обхода кэширования браузером/сервером
        const fetchUrl = `${source.url}${source.url.includes('?') ? '&' : '?'}nocache=${Date.now()}`;
        
        const response = await fetch(fetchUrl, {
          cache: 'no-store', // Отключение внутреннего кэширования Next.js
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/calendar'
          }
        });
        
        if (!response.ok) throw new Error(`Status ${response.status}`);
        const icsText = await response.text();
        const data = await ical.async.parseICS(icsText);
        return { data, source };
      })
    );

    // Обработка результатов парсинга
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        const { data, source } = result.value;
        
        for (let k in data) {
          if (data.hasOwnProperty(k)) {
            const ev = data[k];
            
            // Обрабатываем только реальные события (VEVENT) с установленной датой начала
            if (ev.type === 'VEVENT' && ev.start) {
              const summary = ev.summary;
              const isBlock = isBlockEvent(summary);

              // Проверка прав на импорт конкретного типа события для источника
              const shouldImport = (isBlock && source.importBlocks) || (!isBlock && source.importBookings);

              if (shouldImport) {
                let start = normalizeDateToUTC(new Date(ev.start));
                let end = ev.end ? normalizeDateToUTC(new Date(ev.end)) : normalizeDateToUTC(new Date(ev.start));

                // Запись события для рендеринга полосок в календаре
                allEvents.push({
                    start: start.toISOString().split('T')[0],
                    end: end.toISOString().split('T')[0],
                    sourceId: source.id,
                    sourceName: source.name
                });

                let currentTimestamp = start.getTime();
                const endTimestamp = end.getTime();
                const oneDay = 24 * 60 * 60 * 1000;

                // Заполнение массива занятых дат день за днем
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
         console.warn(`Ошибка импорта iCal (${result.value?.source?.name || 'неизвестно'}):`, result.reason);
      }
    });

    // Удаление дубликатов дат (когда брони пересекаются на разных площадках)
    const uniqueDates = [...new Set(allOccupiedDates)];
    
    // Установка заголовков кэширования для оптимизации API
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).json({ dates: uniqueDates, events: allEvents });
  } catch (error) {
    console.error("Глобальная ошибка сервера API календаря:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

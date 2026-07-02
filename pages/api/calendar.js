import ical from 'node-ical';

const icalSources = [
  {
    id: "google", name: "Google Calendar",
    url: "https://calendar.google.com/calendar/ical/41f6022c98338bf16240faec973d63393b57d8b067e3b58215f725f509a9be01%40group.calendar.google.com/public/basic.ics",
    enabled: true, importBookings: true, importBlocks: true // Используется для импорта личных событий, блокирующих время для МК
  }
];

const isBlockEvent = (summaryObj) => {
  const text = (typeof summaryObj === 'string' ? summaryObj : summaryObj?.val || "").toLowerCase();
  return (
    text.includes("block") || text.includes("unavailable") || text.includes("not available") || 
    text.includes("закрыто") || text.includes("closed") || text.includes("owner") || text.includes("blocked")
  );
};

const normalizeDateToUTC = (dateObj) => {
  const y = dateObj.getFullYear();
  const m = dateObj.getMonth();
  const d = dateObj.getDate();
  return new Date(Date.UTC(y, m, d));
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    let allOccupiedDates = [];
    let allEvents = [];
    const activeSources = icalSources.filter(s => s.enabled);

    const results = await Promise.allSettled(
      activeSources.map(async (source) => {
        const fetchUrl = `${source.url}${source.url.includes('?') ? '&' : '?'}nocache=${Date.now()}`;
        const response = await fetch(fetchUrl, {
          cache: 'no-store',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/calendar'
          }
        });

        if (!response.ok) throw new Error(`Status ${response.status}`);
        const icsText = await response.text();
        const data = await ical.async.parseICS(icsText); // Используем асинхронный парсер
        return { data, source };
      })
    );

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        const { data, source } = result.value;

        for (let k in data) {
          if (data.hasOwnProperty(k)) {
            const ev = data[k];
            if (ev.type === 'VEVENT' && ev.start) {
              const summary = ev.summary;
              const isBlock = isBlockEvent(summary);
              const shouldImport = (isBlock && source.importBlocks) || (!isBlock && source.importBookings);

              if (shouldImport) {
                let start = normalizeDateToUTC(new Date(ev.start));
                let end = ev.end ? normalizeDateToUTC(new Date(ev.end)) : normalizeDateToUTC(new Date(ev.start));

                allEvents.push({
                    start: start.toISOString().split('T')[0],
                    end: end.toISOString().split('T')[0],
                    sourceId: source.id,
                    sourceName: source.name
                });

                let currentTimestamp = start.getTime();
                const endTimestamp = end.getTime();
                const oneDay = 24 * 60 * 60 * 1000;

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
         console.warn(`Ошибка импорта iCal:`, result.reason);
      }
    });

    const uniqueDates = [...new Set(allOccupiedDates)];
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).json({ dates: uniqueDates, events: allEvents });
  } catch (error) {
    console.error("Глобальная ошибка сервера API:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

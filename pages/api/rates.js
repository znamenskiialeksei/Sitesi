// ==============================================================================
// ШЛЮЗ ВАЛЮТНЫХ КУРСОВ ЦБ ТУРЦИИ (TCMB) И СИНХРОНИЗАЦИЯ С USD БАЗОЙ
// Файл: pages/api/rates.js
// Назначение: Автоматическое получение официальных курсов валют Центробанка Турции
// (TCMB - Türkiye Cumhuriyet Merkez Bankası) с базовой валютой USD ($)
// и расчетом кросс-курсов для EUR, TRY и RUB с отказоустойчивыми шлюзами.
// ==============================================================================

let cachedRates = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 3600 * 1000; // Кэширование на 1 час

// Резервные курсы ЦБ Турции при временной недоступности сети
const FALLBACK_RATES = {
  USD: 1.0,
  EUR: 0.92,
  TRY: 34.50,
  RUB: 92.50
};

// Функция парсинга XML ответа TCMB без сторонних библиотек
function parseTcmbXml(xmlString) {
  try {
    const getVal = (code, field = 'ForexSelling') => {
      const currRegex = new RegExp(`<Currency[^>]*CurrencyCode="${code}"[\\s\\S]*?<\\/Currency>`, 'i');
      const match = xmlString.match(currRegex);
      if (!match) return null;
      const block = match[0];

      const unitMatch = block.match(/<Unit>(\d+)<\/Unit>/i);
      const unit = unitMatch ? parseFloat(unitMatch[1]) : 1;

      const fieldRegex = new RegExp(`<${field}>([0-9.,]+)<\\/${field}>`, 'i');
      const fieldMatch = block.match(fieldRegex);
      if (!fieldMatch) return null;

      const rawVal = parseFloat(fieldMatch[1].replace(',', '.'));
      if (isNaN(rawVal) || rawVal <= 0) return null;
      return rawVal / unit;
    };

    // Курсы TCMB даются относительно TRY:
    // 1 USD = X TRY, 1 EUR = Y TRY, 1 RUB = Z TRY
    const usdToTry = getVal('USD', 'ForexSelling') || 34.50;
    const eurToTry = getVal('EUR', 'ForexSelling') || 37.50;
    const rubToTry = getVal('RUB', 'ForexSelling') || 0.37;

    // Вычисляем кросс-курсы относительно базовой валюты USD:
    return {
      USD: 1.0,
      TRY: Math.round(usdToTry * 10000) / 10000,
      EUR: Math.round((usdToTry / eurToTry) * 10000) / 10000,
      RUB: Math.round((usdToTry / rubToTry) * 10000) / 10000
    };
  } catch (err) {
    console.warn('[TCMB Parser Warning]:', err.message);
    return null;
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const now = Date.now();
  if (cachedRates && (now - lastFetchTime < CACHE_TTL_MS)) {
    return res.status(200).json({
      success: true,
      base: 'USD',
      rates: cachedRates,
      source: 'TCMB_CACHE',
      updatedAt: new Date(lastFetchTime).toISOString()
    });
  }

  let rates = null;
  let source = 'TCMB';

  // 1. Попытка загрузки напрямую с официального сайта Центробанка Турции
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const tcmbResponse = await fetch('https://www.tcmb.gov.tr/kurlar/today.xml', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'application/xml,text/xml;q=0.9,*/*;q=0.8'
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (tcmbResponse.ok) {
      const xmlText = await tcmbResponse.text();
      rates = parseTcmbXml(xmlText);
    }
  } catch (e) {
    console.warn('[TCMB Fetch Warning]:', e.message);
  }

  // 2. Резервный шлюз (Open Exchange Rates API с базой USD)
  if (!rates) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const altRes = await fetch('https://open.er-api.com/v6/latest/USD', { signal: controller.signal });
      clearTimeout(timeoutId);

      if (altRes.ok) {
        const altData = await altRes.json();
        if (altData && altData.rates) {
          rates = {
            USD: 1.0,
            EUR: Math.round((altData.rates.EUR || 0.92) * 10000) / 10000,
            TRY: Math.round((altData.rates.TRY || 34.50) * 10000) / 10000,
            RUB: Math.round((altData.rates.RUB || 92.50) * 10000) / 10000
          };
          source = 'OPEN_RATES_BACKUP';
        }
      }
    } catch (e) {
      console.warn('[Open Rates Fetch Warning]:', e.message);
    }
  }

  // 3. Детерминированный фоллбэк
  if (!rates) {
    rates = FALLBACK_RATES;
    source = 'STATIC_FALLBACK';
  }

  cachedRates = rates;
  lastFetchTime = now;

  return res.status(200).json({
    success: true,
    base: 'USD',
    rates,
    source,
    updatedAt: new Date(now).toISOString()
  });
}

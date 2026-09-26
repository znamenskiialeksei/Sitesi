// ==============================================================================
// КОНТЕКСТ ЯЗЫКА И ВАЛЮТЫ VILLA TURAMAN (AIRBNB PLATFORM)
// Файл: utils/language.js
// Назначение: Управление активным языком (RU, EN, TR) и валютой (RUB, TRY, EUR, USD)
// ==============================================================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { translations } from './translations';

const LanguageContext = createContext();

export const CURRENCY_SYMBOLS = {
  RUB: '₽',
  TRY: '₺',
  EUR: '€',
  USD: '$',
  GBP: '£'
};

// Функция округления в большую сторону до ближайшего числа, кратного 5 без копеек/центов
export const roundToFive = (amount) => {
  const num = Number(amount);
  if (isNaN(num) || num <= 0) return 0;
  return Math.ceil(num / 5) * 5;
};

// Конвертация суммы из валюты fromCurrency в целевую валюту targetCurrency по курсам ЦБ Турции (TCMB)
export const convertPrice = (amount, targetCurrency, currentRates, fromCurrency = 'USD') => {
  const amt = Number(amount) || 0;
  if (amt <= 0) return 0;
  const target = targetCurrency || 'USD';
  const from = fromCurrency || 'USD';

  if (target === from) return roundToFive(amt);

  // Переводим исходную сумму в базовую единицу USD по курсу TCMB
  const fromRate = (currentRates && currentRates[from]) || (from === 'USD' ? 1.0 : (from === 'EUR' ? 0.92 : (from === 'TRY' ? 34.5 : 92.5)));
  const amountInUSD = from === 'USD' ? amt : (amt / fromRate);

  // Переводим из USD в целевую валюту
  const targetRate = (currentRates && currentRates[target]) || (target === 'USD' ? 1.0 : (target === 'EUR' ? 0.92 : (target === 'TRY' ? 34.5 : 92.5)));
  const inTarget = target === 'USD' ? amountInUSD : (amountInUSD * targetRate);

  return roundToFive(inTarget);
};

export const LanguageProvider = ({ children, initialDictionary = null, initialTheme = null }) => {
  const router = useRouter();
  const [lang, setLang] = useState('ru');
  const [currency, setCurrency] = useState('RUB');
  const [liveDictionary, setLiveDictionary] = useState(initialDictionary);
  const [theme, setTheme] = useState(initialTheme);
  const [rates, setRates] = useState({
    USD: 1.0,
    EUR: 0.92,
    TRY: 34.50,
    RUB: 92.50
  });

  // Загрузка официальных курсов ЦБ Турции и живого словаря из Google Таблицы
  useEffect(() => {
    let isMounted = true;
    const fetchLiveEcoSystem = async () => {
      try {
        const [ratesRes, contentRes] = await Promise.all([
          fetch('/api/rates').catch(() => null),
          fetch('/api/content?force=true&t=' + Date.now(), { headers: { 'Cache-Control': 'no-cache' } }).catch(() => null)
        ]);

        if (ratesRes && ratesRes.ok && isMounted) {
          const ratesData = await ratesRes.json();
          if (ratesData && ratesData.rates) {
            setRates(ratesData.rates);
          }
        }

        if (contentRes && contentRes.ok && isMounted) {
          const contentData = await contentRes.json();
          if (contentData) {
            if (contentData.dictionary) {
              setLiveDictionary(contentData.dictionary);
            }
            if (contentData.theme) {
              setTheme(contentData.theme);
            }
          }
        }
      } catch (e) {
        console.warn('Используются резервные параметры экосистемы:', e.message);
      }
    };
    fetchLiveEcoSystem();
    return () => { isMounted = false; };
  }, []);

  // Инициализация языка и валюты из настроек браузера или localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem('villa_lang');
    if (savedLang && ['ru', 'en', 'tr'].includes(savedLang)) {
      setLang(savedLang);
    } else if (router.locale && ['ru', 'en', 'tr'].includes(router.locale)) {
      setLang(router.locale);
    }

    const savedCurrency = localStorage.getItem('villa_currency');
    if (savedCurrency && ['RUB', 'TRY', 'EUR', 'USD'].includes(savedCurrency)) {
      setCurrency(savedCurrency);
    } else {
      // Авто-выбор валюты по языку
      if (lang === 'ru') setCurrency('RUB');
      else if (lang === 'tr') setCurrency('TRY');
      else setCurrency('EUR');
    }
  }, [router.locale]);

  const changeLanguage = (newLang) => {
    if (['ru', 'en', 'tr'].includes(newLang)) {
      setLang(newLang);
      localStorage.setItem('villa_lang', newLang);
      // Авто-подстройка валюты при смене языка, если пользователь явно не менял валюту
      if (newLang === 'ru') setCurrency('RUB');
      else if (newLang === 'tr') setCurrency('TRY');
      else setCurrency('EUR');
    }
  };

  const changeCurrency = (newCurr) => {
    if (['RUB', 'TRY', 'EUR', 'USD'].includes(newCurr)) {
      setCurrency(newCurr);
      localStorage.setItem('villa_currency', newCurr);
    }
  };

  // Функция перевода ключа со 100% приоритетом живого словаря Google Таблицы
  const t = (key, params, defaultText) => {
    if (!key) return defaultText || '';
    let effectiveParams = params;
    let fallbackText = defaultText;
    if (typeof params === 'string') {
      fallbackText = params;
      effectiveParams = null;
    }
    // Приоритет 1: Живой перевод из Google Таблицы на активном языке
    let text = liveDictionary?.[lang]?.[key];
    // Приоритет 2: Живой перевод из Google Таблицы на русском языке
    if (!text) {
      text = liveDictionary?.['ru']?.[key];
    }
    // Приоритет 3: Резервный файл translations.js
    if (!text) {
      text = translations[lang]?.[key] || translations['ru']?.[key] || fallbackText || key;
    }
    if (effectiveParams && typeof effectiveParams === 'object') {
      Object.entries(effectiveParams).forEach(([k, v]) => {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
      });
    }
    return text;
  };

  // Форматирование цены из валюты fromCurrency [по умолчанию USD] со знаком активной валюты и округлением до кратного 5
  const formatMoney = (amount, customCurrency, fromCurrency = 'USD') => {
    const activeCurr = customCurrency || currency;
    const symbol = CURRENCY_SYMBOLS[activeCurr] || activeCurr;
    const num = convertPrice(amount, activeCurr, rates, fromCurrency);
    return `${num.toLocaleString('ru-RU')} ${symbol}`;
  };

  // Форматирование уже рассчитанной в целевой валюте суммы [с гарантией кратности 5 без копеек]
  const formatRawMoney = (amount, customCurrency) => {
    const activeCurr = customCurrency || currency;
    const symbol = CURRENCY_SYMBOLS[activeCurr] || activeCurr;
    const num = roundToFive(amount);
    return `${num.toLocaleString('ru-RU')} ${symbol}`;
  };

  return (
    <LanguageContext.Provider value={{
      lang,
      changeLanguage,
      currency,
      changeCurrency,
      rates,
      t,
      liveDictionary,
      updateLiveDictionary: setLiveDictionary,
      theme,
      setTheme,
      formatMoney,
      formatRawMoney,
      roundToFive,
      convertPrice: (amt, curr, fromCurr) => convertPrice(amt, curr || currency, rates, fromCurr || 'USD'),
      CURRENCY_SYMBOLS
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      lang: 'ru',
      changeLanguage: () => {},
      currency: 'RUB',
      changeCurrency: () => {},
      rates: { USD: 1, EUR: 0.92, TRY: 34.5, RUB: 92.5 },
      liveDictionary: null,
      updateLiveDictionary: () => {},
      theme: null,
      setTheme: () => {},
      t: (key, params, defaultText) => {
        let text = (typeof params === 'string' ? params : defaultText) || key;
        if (params && typeof params === 'object') {
          Object.entries(params).forEach(([k, v]) => {
            text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
          });
        }
        return text;
      },
      formatMoney: (val) => `${roundToFive(val)} ₽`,
      formatRawMoney: (val) => `${roundToFive(val)} ₽`,
      roundToFive,
      convertPrice: (amt) => roundToFive(amt),
      CURRENCY_SYMBOLS
    };
  }
  return context;
};



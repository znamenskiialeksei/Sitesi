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

// Конвертация суммы из базовой валюты USD в целевую валюту по курсам ЦБ Турции (TCMB)
export const convertPrice = (amountInUSD, targetCurrency, currentRates) => {
  const amt = Number(amountInUSD) || 0;
  if (amt <= 0) return 0;
  const target = targetCurrency || 'USD';
  if (target === 'USD') return roundToFive(amt);
  const rate = (currentRates && currentRates[target]) || 1;
  return roundToFive(amt * rate);
};

export const LanguageProvider = ({ children }) => {
  const router = useRouter();
  const [lang, setLang] = useState('ru');
  const [currency, setCurrency] = useState('RUB');
  const [rates, setRates] = useState({
    USD: 1.0,
    EUR: 0.92,
    TRY: 34.50,
    RUB: 92.50
  });

  // Загрузка официальных курсов ЦБ Турции (TCMB) при инициализации приложения
  useEffect(() => {
    let isMounted = true;
    const fetchRates = async () => {
      try {
        const res = await fetch('/api/rates');
        if (res.ok) {
          const data = await res.json();
          if (data && data.rates && isMounted) {
            setRates(data.rates);
          }
        }
      } catch (e) {
        console.warn('Не удалось загрузить курсы ЦБ Турции, используются кэшированные данные:', e);
      }
    };
    fetchRates();
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

  // Функция перевода ключа с фоллбэком на русский язык и поддержкой интерполяции параметров {param}
  const t = (key, params) => {
    if (!key) return '';
    let text = translations[lang]?.[key] || translations['ru']?.[key] || key;
    if (params && typeof params === 'object') {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
      });
    }
    return text;
  };

  // Форматирование цены из базовой валюты USD со знаком активной валюты и округлением до кратного 5
  const formatMoney = (amountInUSD, customCurrency) => {
    const activeCurr = customCurrency || currency;
    const symbol = CURRENCY_SYMBOLS[activeCurr] || activeCurr;
    const num = convertPrice(amountInUSD, activeCurr, rates);
    return `${num.toLocaleString('ru-RU')} ${symbol}`;
  };

  // Форматирование уже рассчитанной в целевой валюте суммы (с гарантией кратности 5 без копеек)
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
      formatMoney,
      formatRawMoney,
      roundToFive,
      convertPrice: (amt, curr) => convertPrice(amt, curr || currency, rates),
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
      t: (key, params) => {
        let text = key;
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



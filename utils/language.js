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

export const LanguageProvider = ({ children }) => {
  const router = useRouter();
  const [lang, setLang] = useState('ru');
  const [currency, setCurrency] = useState('RUB');

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

  // Функция перевода ключа с фоллбэком на русский язык
  const t = (key) => {
    if (!key) return '';
    return translations[lang]?.[key] || translations['ru']?.[key] || key;
  };

  // Форматирование цены со знаком валюты
  const formatMoney = (amount, customCurrency) => {
    const activeCurr = customCurrency || currency;
    const symbol = CURRENCY_SYMBOLS[activeCurr] || activeCurr;
    const num = Number(amount) || 0;
    return `${num.toLocaleString('ru-RU')} ${symbol}`;
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, currency, changeCurrency, t, formatMoney, CURRENCY_SYMBOLS }}>
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
      t: (key) => key,
      formatMoney: (val) => `${val} ₽`,
      CURRENCY_SYMBOLS
    };
  }
  return context;
};


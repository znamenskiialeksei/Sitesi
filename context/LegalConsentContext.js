// ==============================================================================
// ГЛОБАЛЬНЫЙ КОНТЕКСТ ЮРИДИЧЕСКИХ СОГЛАСИЙ (KVKK, ДОГОВОР, КОНФИДЕНЦИАЛЬНОСТЬ)
// Файл: context/LegalConsentContext.js
// Назначение: Централизованная синхронизация состояния чекбоксов согласия
// на всем сайте: в виджете бронирования, карточках каталога и модальных окнах.
// При проставлении галочки в одном месте, она автоматически выставляется везде.
// ==============================================================================

import React, { createContext, useContext, useState, useEffect } from 'react';

const LegalConsentContext = createContext();

export const LegalConsentProvider = ({ children }) => {
  const [agreedKVKK, setAgreedKVKKState] = useState(false);
  const [agreedContract, setAgreedContractState] = useState(false);
  const [agreedPrivacy, setAgreedPrivacyState] = useState(false);

  // Инициализация из localStorage при первом открытии сайта в браузере
  useEffect(() => {
    try {
      const kvkk = localStorage.getItem('villa_legal_kvkk') === 'true';
      const contract = localStorage.getItem('villa_legal_contract') === 'true';
      const privacy = localStorage.getItem('villa_legal_privacy') === 'true';
      if (kvkk) setAgreedKVKKState(true);
      if (contract) setAgreedContractState(true);
      if (privacy) setAgreedPrivacyState(true);
    } catch (e) { }
  }, []);

  const setAgreedKVKK = (val) => {
    const boolVal = Boolean(val);
    setAgreedKVKKState(boolVal);
    try { localStorage.setItem('villa_legal_kvkk', String(boolVal)); } catch (e) { }
  };

  const setAgreedContract = (val) => {
    const boolVal = Boolean(val);
    setAgreedContractState(boolVal);
    try { localStorage.setItem('villa_legal_contract', String(boolVal)); } catch (e) { }
  };

  const setAgreedPrivacy = (val) => {
    const boolVal = Boolean(val);
    setAgreedPrivacyState(boolVal);
    try { localStorage.setItem('villa_legal_privacy', String(boolVal)); } catch (e) { }
  };

  const setAllAgreed = (val) => {
    const boolVal = Boolean(val);
    setAgreedKVKK(boolVal);
    setAgreedContract(boolVal);
    setAgreedPrivacy(boolVal);
  };

  const allAgreed = agreedKVKK && agreedContract && agreedPrivacy;

  return (
    <LegalConsentContext.Provider value={{
      agreedKVKK,
      setAgreedKVKK,
      agreedContract,
      setAgreedContract,
      agreedPrivacy,
      setAgreedPrivacy,
      allAgreed,
      setAllAgreed
    }}>
      {children}
    </LegalConsentContext.Provider>
  );
};

export const useLegalConsent = () => {
  const context = useContext(LegalConsentContext);
  if (!context) {
    return {
      agreedKVKK: false,
      setAgreedKVKK: () => {},
      agreedContract: () => {},
      setAgreedContract: () => {},
      agreedPrivacy: false,
      setAgreedPrivacy: () => {},
      allAgreed: false,
      setAllAgreed: () => {}
    };
  }
  return context;
};

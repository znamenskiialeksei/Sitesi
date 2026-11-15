import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { translations } from './translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const router = useRouter();
  const { locale, pathname, asPath, query } = router;
  
  // Установка языка по умолчанию (из локали Next.js или русский)
  const [lang, setLang] = useState(locale || 'ru');

  useEffect(() => { 
    setLang(locale || 'ru'); 
  }, [locale]);

  // Функция перевода. Если ключ не найден, возвращаем сам ключ как fallback
  const t = (key) => translations[lang]?.[key] || key;
  
  // Функция смены языка с роутингом без перезагрузки страницы
  const changeLanguage = (newLang) => { 
    router.push({ pathname, query }, asPath, { locale: newLang, scroll: false }); 
  };

  return (
    <LanguageContext.Provider value={{ t, lang, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

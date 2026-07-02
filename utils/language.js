import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { translations } from './translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const router = useRouter();
  const { locale, pathname, asPath, query } = router;
  const [lang, setLang] = useState(locale || 'ru');

  useEffect(() => { setLang(locale || 'ru'); }, [locale]);

  const t = (key) => translations[lang]?.[key] || key;
  const changeLanguage = (newLang) => { router.push({ pathname, query }, asPath, { locale: newLang, scroll: false }); };

  return <LanguageContext.Provider value={{ t, lang, changeLanguage }}>{children}</LanguageContext.Provider>;
};
export const useLanguage = () => useContext(LanguageContext);

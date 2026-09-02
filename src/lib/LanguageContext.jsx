import React, { createContext, useContext, useEffect, useState } from 'react';

const LanguageContext = createContext({ lang: 'en', setLang: () => {}, hasChosen: false });

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState('en');
  const [hasChosen, setHasChosen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('amicus_lang');
    if (stored === 'en' || stored === 'zh-TW' || stored === 'bilingual') {
      setLangState(stored);
      setHasChosen(true);
    }
  }, []);

  const setLang = (l) => {
    setLangState(l);
    setHasChosen(true);
    localStorage.setItem('amicus_lang', l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, hasChosen }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
import { createContext, useMemo, useContext, useState, useEffect } from 'react';

const GlobalContext = createContext(null);

export const GlobalProvider = ({ initialLocales, children }) => {
  const [locales, setLocales] = useState(initialLocales ?? [{ name: 'English', short: 'en' }]);
  const [locale, setLocale] = useState({ name: 'English', short: 'en' });

  useEffect(() => {
    if (!locales || locales.length === 0) return;

    const currentLangValue = locales.find((el) => el.short === locale.short) || locales[0];
    setLocale(currentLangValue);
  }, [locales]);

  const value = useMemo(() => {
    return {
      locales,
      locale,
      setLocales,
      setLocale,
    };
  }, [locales, locale]);

  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
};

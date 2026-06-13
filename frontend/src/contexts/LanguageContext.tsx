import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ar, en } from "@/locales";

type Lang = "ar" | "en";
type Translations = typeof ar;

interface LangCtx {
  lang: Lang;
  toggle: () => void;
  t: Translations;
  isRtl: boolean;
}

const LanguageContext = createContext<LangCtx>({
  lang: "ar",
  toggle: () => {},
  t: ar,
  isRtl: true,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem("lang") as Lang) || "ar");

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  const toggle = () => {
    const next: Lang = lang === "ar" ? "en" : "ar";
    setLang(next);
    localStorage.setItem("lang", next);
  };

  return (
    <LanguageContext.Provider value={{ lang, toggle, t: lang === "ar" ? ar : en, isRtl: lang === "ar" }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);

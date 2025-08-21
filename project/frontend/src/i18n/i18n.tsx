"use client";
import React, { createContext, useContext, useMemo, useState, useCallback } from "react";
import { messages as it } from "./locales/it";
import { messages as en } from "./locales/en";
import { messages as de } from "./locales/de";
import { messages as es } from "./locales/es";

export type Locale = "it" | "en" | "de" | "es";
export type Messages = Record<string, string>;

const ALL: Record<Locale, Messages> = { it, en, de, es };

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
};

const I18nCtx = createContext<Ctx | null>(null);

export function I18nProvider({ children, initialLocale }: { children: React.ReactNode; initialLocale?: Locale }) {
  const getInitialLocale = (): Locale => {
    if (initialLocale && ALL[initialLocale]) return initialLocale;
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("e-menu:locale") as Locale | null;
        if (saved && ALL[saved]) return saved;
      } catch {}
    }
    return "it"; // default base language: Italian
  };
  const [localeState, setLocaleState] = useState<Locale>(getInitialLocale);
  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try { if (typeof window !== "undefined") localStorage.setItem("e-menu:locale", l); } catch {}
  }, []);

  const t = useMemo(() => {
    const dict = ALL[localeState] || ALL.it;
    return (key: string, params?: Record<string, string | number>) => {
      let out = dict[key] ?? key;
      if (params) {
        Object.keys(params).forEach((k) => {
          out = out.replace(new RegExp(`{${k}}`, "g"), String(params[k]));
        });
      }
      return out;
    };
  }, [localeState]);

  const value = useMemo<Ctx>(() => ({ locale: localeState, setLocale, t }), [localeState, setLocale, t]);
  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nCtx);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

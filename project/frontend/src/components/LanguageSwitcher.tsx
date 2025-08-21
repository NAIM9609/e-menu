"use client";
import { Locale, useI18n } from "@/i18n/i18n";
import React from "react";

type Props = {
  className?: string;
  ariaLabel?: string;
};

export default function LanguageSwitcher({ className = "", ariaLabel = "Language" }: Props) {
  const { locale, setLocale } = useI18n();
  return (
    <select
      aria-label={ariaLabel}
      value={locale}
      onChange={(e) => setLocale(e.target.value as Locale)}
      className={`bg-transparent border border-neutral-700 rounded px-2 py-1 text-sm text-neutral-200 ${className}`}
    >
      <option value="it">🇮🇹 IT</option>
      <option value="en">🇬🇧 EN</option>
      <option value="de">🇩🇪 DE</option>
      <option value="es">🇪🇸 ES</option>
    </select>
  );
}

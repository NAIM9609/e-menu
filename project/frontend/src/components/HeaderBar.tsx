"use client";
import LanguageSwitcher from "./LanguageSwitcher";

export default function HeaderBar() {
  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-black/50 border-b border-neutral-800">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-neutral-700 grid place-items-center text-white font-bold">
          F
        </div>
        <div className="flex-1">
          <div className="text-sm text-neutral-300 leading-tight">First</div>
          <div className="text-lg font-semibold leading-tight">First Lounge Bar</div>
        </div>
  <LanguageSwitcher />
      </div>
    </header>
  );
}

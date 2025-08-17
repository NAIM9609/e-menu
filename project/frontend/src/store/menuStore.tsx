"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { MenuCategory } from "@/data/menu";
import { menuRepo } from "@/services/menuRepo";

type MenuContextType = {
  categories: MenuCategory[];
  setCategories: (cats: MenuCategory[]) => void;
  resetToDefault: () => void;
};

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<MenuCategory[]>(() => {
    return menuRepo.get();
  });

  useEffect(() => {
    menuRepo.set(categories);
  }, [categories]);

  const resetToDefault = () => setCategories(menuRepo.reset());

  const value = useMemo<MenuContextType>(() => ({ categories, setCategories, resetToDefault }), [categories]);

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function useMenu() {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error("useMenu must be used within MenuProvider");
  return ctx;
}

import type { MenuCategory } from "@/data/menu";
import { MENU_CATEGORIES as DEFAULTS } from "@/data/menu";
import { lsGet, lsSet } from "./storage";

const KEY = "e-menu:menuConfig:v1";

export const menuRepo = {
  get(): MenuCategory[] {
    const data = lsGet<MenuCategory[] | { categories?: MenuCategory[] }>(KEY, DEFAULTS);
    if (Array.isArray(data)) return data;
    if (isWrapped(data)) return data.categories;
    return DEFAULTS;
  },
  set(categories: MenuCategory[]) {
    lsSet(KEY, categories);
  },
  reset(): MenuCategory[] {
    lsSet(KEY, DEFAULTS);
    return DEFAULTS;
  },
};

function isWrapped(v: unknown): v is { categories: MenuCategory[] } {
  return !!v && typeof v === "object" && Array.isArray((v as { categories?: unknown }).categories);
}

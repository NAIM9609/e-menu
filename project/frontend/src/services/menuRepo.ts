import type { MenuCategory, MenuItem } from "@/data/menu";
import { MENU_CATEGORIES as DEFAULTS } from "@/data/menu";
import { lsGet, lsSet } from "./storage";

const KEY = "e-menu:menuConfig:v4";

export const menuRepo = {
  get(): MenuCategory[] {
    const data = lsGet<MenuCategory[] | { categories?: MenuCategory[] }>(KEY, DEFAULTS);
    const stored = Array.isArray(data) ? data : (isWrapped(data) ? data.categories : DEFAULTS);
    // Index defaults by id for merge and backfill
    const defCatById: Record<string, MenuCategory> = {};
    const defItemById: Record<string, MenuItem> = {};
    for (const c of DEFAULTS) {
      defCatById[c.id] = c;
      for (const it of c.items) defItemById[it.id] = it as MenuItem;
    }
    // Merge categories: add missing ones from defaults, and merge items by id
    const mergedCats: MenuCategory[] = [];
    const seenCat = new Set<string>();
    for (const c of stored) {
      seenCat.add(c.id);
      const defC = defCatById[c.id];
      // merge items
      const byId: Record<string, MenuItem> = {};
      for (const it of c.items as MenuItem[]) byId[it.id] = { ...it };
      if (defC) {
        for (const dit of defC.items as MenuItem[]) {
          if (!byId[dit.id]) {
            byId[dit.id] = { ...dit };
          } else {
            // backfill missing imageUrl from defaults when absent
            if (!byId[dit.id].imageUrl && dit.imageUrl) byId[dit.id].imageUrl = dit.imageUrl;
          }
        }
      }
      mergedCats.push({ ...c, items: Object.values(byId) });
    }
    // add entirely missing categories from defaults
    for (const c of DEFAULTS) {
      if (!seenCat.has(c.id)) mergedCats.push(c);
    }
    // Helpers to normalize URLs
    const normalizeUrl = (u?: string) => {
      if (!u) return undefined as string | undefined;
      let s = u.trim();
      if (!s) return undefined;
      // fix common relative forms
      if (s.startsWith("./")) s = s.replace(/^\.\/+/, "/");
      if (s.startsWith("../")) s = "/" + s.replace(/^\.\.\/+/, "");
      if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("data:") || s.startsWith("blob:")) return s;
      // ensure leading slash for local public assets
      if (!s.startsWith("/")) s = "/" + s.replace(/^\/+/, "");
      // collapse accidental double slashes except protocol
      s = s.replace(/([^:])\/\/+/, "$1/");
      return s;
    };
    // Normalize: sanitize all item image URLs and ensure Margherita uses the new default
  const normalized = mergedCats.map((c) => ({
      ...c,
      items: c.items.map((it) => {
        const current = it as MenuItem;
        let img = normalizeUrl(current.imageUrl);
        // Legacy: replace old spaced filename with the canonical one
        if (it.id === "margherita") {
          if (!img || img === "/window.svg" || /Pizza%20Margherita%20di%20Sofia\.jpg|Pizza Margherita di Sofia\.jpg/.test(img)) {
            img = "/PizzaMargheritadiSofia.jpg";
          }
        }
        if (img !== current.imageUrl) {
          return { ...it, imageUrl: img } as typeof it;
        }
        return it;
      }),
    }));
    return normalized;
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

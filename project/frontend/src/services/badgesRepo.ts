import type { Badge } from "@/store/badgesStore";
import { lsGet, lsSet } from "./storage";

const KEY = "e-menu:badges:v1";
const DEFAULTS: Badge[] = [
  { id: "fresco", name: "Fresco", icon: "/icons/fresh.svg", bgColor: "#14532d", textColor: "#a7f3d0" },
  { id: "surgelato", name: "Surgelato", icon: "/icons/frozen.svg", bgColor: "#0c4a6e", textColor: "#bae6fd" },
  { id: "km0", name: "KM0", icon: "/icons/km0.svg", bgColor: "#3f1f0f", textColor: "#fde68a" },
  { id: "stagionale", name: "Stagionale", icon: "/icons/seasonal.svg", bgColor: "#7c2d12", textColor: "#fdba74" },
  { id: "novita", name: "Novità", icon: "/icons/new.svg", bgColor: "#831843", textColor: "#fbcfe8" },
  { id: "best-seller", name: "Best seller", icon: "/icons/star.svg", bgColor: "#92400e", textColor: "#fde68a" },
  { id: "chef", name: "Dello chef", icon: "/icons/chef.svg", bgColor: "#4c1d95", textColor: "#e9d5ff" },
  { id: "piccante", name: "Piccante", icon: "/icons/spicy.svg", bgColor: "#7f1d1d", textColor: "#fecaca" },
  { id: "extra-piccante", name: "Extra piccante", icon: "/icons/fire.svg", bgColor: "#991b1b", textColor: "#fecaca" },
  { id: "veg", name: "Vegetariano", icon: "/icons/leaf.svg", bgColor: "#064e3b", textColor: "#6ee7b7" },
  { id: "vegano", name: "Vegano", icon: "/icons/vegan.svg", bgColor: "#065f46", textColor: "#a7f3d0" },
  { id: "gf", name: "Senza glutine", icon: "/icons/glutenfree.svg", bgColor: "#3f3351", textColor: "#ddd6fe" },
  { id: "lf", name: "Senza lattosio", icon: "/icons/lactosefree.svg", bgColor: "#0b3b3b", textColor: "#99f6e4" },
  { id: "sf", name: "Senza zucchero", icon: "/icons/sugarfree.svg", bgColor: "#083344", textColor: "#a5f3fc" },
  { id: "af", name: "Senza alcool", icon: "/icons/alcoholfree.svg", bgColor: "#312e81", textColor: "#c7d2fe" },
  { id: "noci", name: "Contiene frutta a guscio", icon: "/icons/nuts.svg", bgColor: "#4e342e", textColor: "#ffccbc" },
  { id: "light", name: "Light", icon: "/icons/light.svg", bgColor: "#0e7490", textColor: "#cffafe" },
];

export const badgesRepo = {
  get(): Badge[] {
    const data = lsGet<Badge[] | { badges?: Badge[] }>(KEY, DEFAULTS);
    const stored: Badge[] = Array.isArray(data)
      ? data
      : isWrapped(data)
      ? data.badges
      : DEFAULTS;
    // Merge defaults: add missing ones and backfill colors for existing ids
    const byId: Record<string, Badge> = {};
    for (const b of stored) byId[b.id] = { ...b };
    let changed = false;
    for (const d of DEFAULTS) {
      if (!byId[d.id]) {
        byId[d.id] = { ...d };
        changed = true;
      } else {
        const cur = byId[d.id];
        if (!cur.bgColor && d.bgColor) {
          cur.bgColor = d.bgColor;
          changed = true;
        }
        if (!cur.textColor && d.textColor) {
          cur.textColor = d.textColor;
          changed = true;
        }
        // If icon missing, backfill
        if (!cur.icon && d.icon) {
          cur.icon = d.icon;
          changed = true;
        }
      }
    }
    const merged = Object.values(byId);
    if (changed) lsSet(KEY, merged);
    return merged;
  },
  set(value: Badge[]) {
    lsSet(KEY, value);
  },
  reset(): Badge[] {
    lsSet(KEY, DEFAULTS);
    return DEFAULTS;
  },
};

function isWrapped(v: unknown): v is { badges: Badge[] } {
  return !!v && typeof v === "object" && Array.isArray((v as { badges?: unknown }).badges);
}

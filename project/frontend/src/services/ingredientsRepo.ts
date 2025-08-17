import type { Ingredient } from "@/store/ingredientsStore";
import { lsGet, lsSet } from "./storage";

const KEY = "e-menu:ingredients:v1";
const DEFAULTS: Ingredient[] = [
  { id: "pomodoro", name: "Pomodoro", isExtra: true, defaultPrice: 1 },
  { id: "mozzarella", name: "Mozzarella", isExtra: true, defaultPrice: 1.5 },
  { id: "basilico", name: "Basilico", isExtra: true, defaultPrice: 0.5 },
  { id: "olive", name: "Olive", isExtra: true, defaultPrice: 1 },
  { id: "acciughe", name: "Acciughe", isExtra: true, defaultPrice: 1.5 },
];

export const ingredientsRepo = {
  get(): Ingredient[] {
    const data = lsGet<Ingredient[] | { ingredients?: Ingredient[] }>(KEY, DEFAULTS);
    if (Array.isArray(data)) return data;
    if (isWrapped(data)) return data.ingredients;
    return DEFAULTS;
  },
  set(value: Ingredient[]) {
    lsSet(KEY, value);
  },
  reset(): Ingredient[] {
    lsSet(KEY, DEFAULTS);
    return DEFAULTS;
  },
};

function isWrapped(v: unknown): v is { ingredients: Ingredient[] } {
  return !!v && typeof v === "object" && Array.isArray((v as { ingredients?: unknown }).ingredients);
}

import type { Badge } from "@/store/badgesStore";
import { lsGet, lsSet } from "./storage";

const KEY = "e-menu:badges:v1";
const DEFAULTS: Badge[] = [
  { id: "fresco", name: "Fresco", icon: "/icons/fresh.svg" },
  { id: "surgelato", name: "Surgelato", icon: "/icons/frozen.svg" },
  { id: "km0", name: "KM0", icon: "/icons/km0.svg" },
];

export const badgesRepo = {
  get(): Badge[] {
    const data = lsGet<Badge[] | { badges?: Badge[] }>(KEY, DEFAULTS);
    if (Array.isArray(data)) return data;
    if (isWrapped(data)) return data.badges;
    return DEFAULTS;
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

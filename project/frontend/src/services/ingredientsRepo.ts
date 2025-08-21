import type { Ingredient } from "@/store/ingredientsStore";
import { lsGet, lsSet } from "./storage";

const KEY = "e-menu:ingredients:v2";
const DEFAULTS: Ingredient[] = [
  // Pizzeria / Cucina
  { id: "pomodoro", name: "Pomodoro", isExtra: true, defaultPrice: 1, available: true, canBeBase: true, canBeExtra: true, kind: "food" },
  { id: "salsa-di-pomodoro", name: "Salsa di pomodoro", isExtra: true, defaultPrice: 1, available: true, canBeBase: true, canBeExtra: true, isSauce: true },
  { id: "fior-di-latte", name: "Fior di latte", isExtra: true, defaultPrice: 1.5, available: true, canBeBase: true, canBeExtra: true, kind: "food" },
  { id: "mozzarella", name: "Mozzarella", isExtra: true, defaultPrice: 1.5, available: true, canBeBase: true, canBeExtra: true },
  { id: "mozzarella-di-bufala", name: "Mozzarella di bufala", isExtra: true, defaultPrice: 2.5, available: true, canBeBase: true, canBeExtra: true },
  { id: "basilico", name: "Basilico", isExtra: true, defaultPrice: 0.5, available: true, canBeBase: true, canBeExtra: true },
  { id: "salame-piccante", name: "Salame piccante", isExtra: true, defaultPrice: 2, available: true, canBeBase: true, canBeExtra: true },
  { id: "prosciutto-cotto", name: "Prosciutto cotto", isExtra: true, defaultPrice: 2, available: true, canBeBase: true, canBeExtra: true },
  { id: "prosciutto-crudo", name: "Prosciutto crudo", isExtra: true, defaultPrice: 2.5, available: true, canBeBase: true, canBeExtra: true },
  { id: "funghi-champignon", name: "Funghi champignon", isExtra: true, defaultPrice: 1.5, available: true, canBeBase: true, canBeExtra: true },
  { id: "carciofi", name: "Carciofi", isExtra: true, defaultPrice: 1.5, available: true, canBeBase: true, canBeExtra: true },
  { id: "olive-nere", name: "Olive nere", isExtra: true, defaultPrice: 1, available: true, canBeBase: true, canBeExtra: true },
  { id: "olive-verdi", name: "Olive verdi", isExtra: true, defaultPrice: 1, available: true, canBeBase: true, canBeExtra: true },
  { id: "acciughe", name: "Acciughe", isExtra: true, defaultPrice: 1.5, available: true, canBeBase: true, canBeExtra: true },
  { id: "cipolla", name: "Cipolla", isExtra: true, defaultPrice: 0.5, available: true, canBeBase: true, canBeExtra: true },
  { id: "jalapeno", name: "Jalapeño", isExtra: true, defaultPrice: 1, available: true, canBeBase: true, canBeExtra: true },
  { id: "peperoni", name: "Peperoni", isExtra: true, defaultPrice: 1.2, available: true, canBeBase: true, canBeExtra: true },
  { id: "rucola", name: "Rucola", isExtra: true, defaultPrice: 1, available: true, canBeBase: true, canBeExtra: true },
  { id: "parmigiano", name: "Parmigiano", isExtra: true, defaultPrice: 1.5, available: true, canBeBase: true, canBeExtra: true },
  { id: "wurstel", name: "Wurstel", isExtra: true, defaultPrice: 1.5, available: true, canBeBase: true, canBeExtra: true },
  { id: "patatine-fritte", name: "Patatine fritte", isExtra: true, defaultPrice: 1.5, available: true, canBeBase: true, canBeExtra: true },
  { id: "tonno", name: "Tonno", isExtra: true, defaultPrice: 1.8, available: true, canBeBase: true, canBeExtra: true },
  { id: "gamberetti", name: "Gamberetti", isExtra: true, defaultPrice: 2, available: true, canBeBase: true, canBeExtra: true },
  { id: "zucchine", name: "Zucchine", isExtra: true, defaultPrice: 1.2, available: true, canBeBase: true, canBeExtra: true },
  { id: "melanzane", name: "Melanzane", isExtra: true, defaultPrice: 1.2, available: true, canBeBase: true, canBeExtra: true },
  { id: "gorgonzola", name: "Gorgonzola", isExtra: true, defaultPrice: 2, available: true, canBeBase: true, canBeExtra: true },
  { id: "speck", name: "Speck", isExtra: true, defaultPrice: 2, available: true, canBeBase: true, canBeExtra: true },
  { id: "salsiccia", name: "Salsiccia", isExtra: true, defaultPrice: 2, available: true, canBeBase: true, canBeExtra: true },
  { id: "scamorza", name: "Scamorza", isExtra: true, defaultPrice: 1.8, available: true, canBeBase: true, canBeExtra: true },
  { id: "uova", name: "Uova", isExtra: true, defaultPrice: 1, available: true, canBeBase: true, canBeExtra: true },
  { id: "guanciale", name: "Guanciale", isExtra: true, defaultPrice: 2.5, available: true, canBeBase: true, canBeExtra: true },
  { id: "pecorino-romano", name: "Pecorino Romano", isExtra: true, defaultPrice: 1.5, available: true, canBeBase: true, canBeExtra: true },
  { id: "spaghetti", name: "Spaghetti", isExtra: false, defaultPrice: 0, available: true, canBeBase: true, canBeExtra: false },
  { id: "penne", name: "Penne", isExtra: false, defaultPrice: 0, available: true, canBeBase: true, canBeExtra: false },
  { id: "rigatoni", name: "Rigatoni", isExtra: false, defaultPrice: 0, available: true, canBeBase: true, canBeExtra: false },
  { id: "pomodorini", name: "Pomodorini", isExtra: true, defaultPrice: 1.2, available: true, canBeBase: true, canBeExtra: true },
  { id: "burrata", name: "Burrata", isExtra: true, defaultPrice: 3, available: true, canBeBase: true, canBeExtra: true },
  { id: "stracciatella", name: "Stracciatella", isExtra: true, defaultPrice: 2.5, available: true, canBeBase: true, canBeExtra: true },
  { id: "mortadella", name: "Mortadella", isExtra: true, defaultPrice: 2, available: true, canBeBase: true, canBeExtra: true },
  { id: "pistacchio-granella", name: "Granella di pistacchio", isExtra: true, defaultPrice: 1.5, available: true, canBeBase: true, canBeExtra: true },
  { id: "nduja", name: "'Nduja", isExtra: true, defaultPrice: 2, available: true, canBeBase: true, canBeExtra: true },
  { id: "bresaola", name: "Bresaola", isExtra: true, defaultPrice: 2.5, available: true, canBeBase: true, canBeExtra: true },
  { id: "prezzemolo", name: "Prezzemolo", isExtra: true, defaultPrice: 0.5, available: true, canBeBase: true, canBeExtra: true },
  { id: "cozze", name: "Cozze", isExtra: true, defaultPrice: 2, available: true, canBeBase: true, canBeExtra: true },
  { id: "calamari", name: "Calamari", isExtra: true, defaultPrice: 2.5, available: true, canBeBase: true, canBeExtra: true },
  { id: "pollo", name: "Pollo", isExtra: true, defaultPrice: 2, available: true, canBeBase: true, canBeExtra: true },
  { id: "manzo", name: "Manzo", isExtra: true, defaultPrice: 3, available: true, canBeBase: true, canBeExtra: true },
  { id: "insalata-mista", name: "Insalata mista", isExtra: true, defaultPrice: 1, available: true, canBeBase: true, canBeExtra: true },
  { id: "pomodori", name: "Pomodori", isExtra: true, defaultPrice: 1, available: true, canBeBase: true, canBeExtra: true },
  { id: "cetrioli", name: "Cetrioli", isExtra: true, defaultPrice: 1, available: true, canBeBase: true, canBeExtra: true },
  { id: "feta", name: "Feta", isExtra: true, defaultPrice: 1.8, available: true, canBeBase: true, canBeExtra: true },
  { id: "crostini", name: "Crostini", isExtra: true, defaultPrice: 0.8, available: true, canBeBase: true, canBeExtra: true },
  { id: "pane", name: "Pane", isExtra: true, defaultPrice: 0.5, available: true, canBeBase: true, canBeExtra: true },
  { id: "focaccia", name: "Focaccia", isExtra: true, defaultPrice: 1.2, available: true, canBeBase: true, canBeExtra: true },
  { id: "maionese", name: "Maionese", isExtra: true, defaultPrice: 0.5, available: true, canBeBase: true, canBeExtra: true },
  { id: "ketchup", name: "Ketchup", isExtra: true, defaultPrice: 0.5, available: true, canBeBase: true, canBeExtra: true },
  { id: "senape", name: "Senape", isExtra: true, defaultPrice: 0.5, available: true, canBeBase: true, canBeExtra: true },
  { id: "nutella", name: "Nutella", isExtra: true, defaultPrice: 1, available: true, canBeBase: true, canBeExtra: true },
  { id: "mascarpone", name: "Mascarpone", isExtra: true, defaultPrice: 2, available: true, canBeBase: true, canBeExtra: true },
  { id: "savoiardi", name: "Savoiardi", isExtra: false, defaultPrice: 0, available: true, canBeBase: true, canBeExtra: false },
  { id: "caffe", name: "Caffè", isExtra: true, defaultPrice: 0.5, available: true, canBeBase: true, canBeExtra: true },
  { id: "zucchero", name: "Zucchero", isExtra: true, defaultPrice: 0.3, available: true, canBeBase: true, canBeExtra: true },
  { id: "latte", name: "Latte", isExtra: true, defaultPrice: 0.5, available: true, canBeBase: true, canBeExtra: true },
  { id: "panna", name: "Panna", isExtra: true, defaultPrice: 0.8, available: true, canBeBase: true, canBeExtra: true },
  { id: "cacao-amaro", name: "Cacao amaro", isExtra: true, defaultPrice: 0.5, available: true, canBeBase: true, canBeExtra: true },
  { id: "vaniglia", name: "Vaniglia", isExtra: true, defaultPrice: 0.5, available: true, canBeBase: true, canBeExtra: true },
  { id: "bacon", name: "Bacon", isExtra: true, defaultPrice: 1.5, available: true, canBeBase: true, canBeExtra: true },
  { id: "cheddar", name: "Cheddar", isExtra: true, defaultPrice: 1.2, available: true, canBeBase: true, canBeExtra: true },

  // Bar / Cocktail
  { id: "gin", name: "Gin", isExtra: false, defaultPrice: 0, available: true, canBeBase: true, canBeExtra: false },
  { id: "vodka", name: "Vodka", isExtra: false, defaultPrice: 0, available: true, canBeBase: true, canBeExtra: false },
  { id: "rum-bianco", name: "Rum bianco", isExtra: false, defaultPrice: 0, available: true, canBeBase: true, canBeExtra: false },
  { id: "rum-scuro", name: "Rum scuro", isExtra: false, defaultPrice: 0, available: true, canBeBase: true, canBeExtra: false },
  { id: "tequila", name: "Tequila", isExtra: false, defaultPrice: 0, available: true, canBeBase: true, canBeExtra: false },
  { id: "triple-sec", name: "Triple sec", isExtra: false, defaultPrice: 0, available: true, canBeBase: true, canBeExtra: false },
  { id: "prosecco", name: "Prosecco", isExtra: false, defaultPrice: 0, available: true, canBeBase: true, canBeExtra: false },
  { id: "aperol", name: "Aperol", isExtra: false, defaultPrice: 0, available: true, canBeBase: true, canBeExtra: false },
  { id: "bitter", name: "Bitter", isExtra: false, defaultPrice: 0, available: true, canBeBase: true, canBeExtra: false },
  { id: "vermouth-rosso", name: "Vermouth Rosso", isExtra: false, defaultPrice: 0, available: true, canBeBase: true, canBeExtra: false },
  { id: "vermouth-bianco", name: "Vermouth Bianco", isExtra: false, defaultPrice: 0, available: true, canBeBase: true, canBeExtra: false },
  { id: "soda", name: "Soda", isExtra: true, defaultPrice: 0.5, available: true, canBeBase: true, canBeExtra: true, kind: "beverage" },
  { id: "acqua-tonica", name: "Acqua tonica", isExtra: true, defaultPrice: 0.5, available: true, canBeBase: true, canBeExtra: true, kind: "beverage" },
  { id: "acqua-tonica-mediterranea", name: "Tonica mediterranea", isExtra: true, defaultPrice: 0.7, available: true, canBeBase: true, canBeExtra: true, kind: "beverage" },
  { id: "acqua-tonica-dry", name: "Tonica dry", isExtra: true, defaultPrice: 0.7, available: true, canBeBase: true, canBeExtra: true, kind: "beverage" },
  { id: "acqua-tonica", name: "Acqua tonica", isExtra: true, defaultPrice: 0.5, available: true, canBeBase: true, canBeExtra: true },
  { id: "acqua-tonica-mediterranea", name: "Tonica mediterranea", isExtra: true, defaultPrice: 0.7, available: true, canBeBase: true, canBeExtra: true },
  { id: "acqua-tonica-dry", name: "Tonica dry", isExtra: true, defaultPrice: 0.7, available: true, canBeBase: true, canBeExtra: true },
  { id: "gin-agrumi", name: "Gin agli agrumi", isExtra: false, defaultPrice: 0, available: true, canBeBase: true, canBeExtra: false },
  { id: "gin-erbe", name: "Gin alle erbe", isExtra: false, defaultPrice: 0, available: true, canBeBase: true, canBeExtra: false },
  { id: "gin-frutti-rossi", name: "Gin ai frutti rossi", isExtra: false, defaultPrice: 0, available: true, canBeBase: true, canBeExtra: false },
  { id: "pompelmo", name: "Pompelmo", isExtra: true, defaultPrice: 0.5, available: true, canBeBase: true, canBeExtra: true },
  { id: "mirtilli", name: "Mirtilli", isExtra: true, defaultPrice: 0.8, available: true, canBeBase: true, canBeExtra: true },
  { id: "lamponi", name: "Lamponi", isExtra: true, defaultPrice: 0.8, available: true, canBeBase: true, canBeExtra: true },
  { id: "rosmarino", name: "Rosmarino", isExtra: true, defaultPrice: 0.4, available: true, canBeBase: true, canBeExtra: true },
  { id: "pepe-rosa", name: "Pepe rosa", isExtra: true, defaultPrice: 0.4, available: true, canBeBase: true, canBeExtra: true },
  { id: "succo-darancia", name: "Succo d'arancia", isExtra: true, defaultPrice: 1, available: true, canBeBase: true, canBeExtra: true },
  { id: "succo-di-ananas", name: "Succo di ananas", isExtra: true, defaultPrice: 1, available: true, canBeBase: true, canBeExtra: true },
  { id: "lime", name: "Lime", isExtra: true, defaultPrice: 0.5, available: true, canBeBase: true, canBeExtra: true },
  { id: "limone", name: "Limone", isExtra: true, defaultPrice: 0.5, available: true, canBeBase: true, canBeExtra: true },
  { id: "menta", name: "Menta", isExtra: true, defaultPrice: 0.8, available: true, canBeBase: true, canBeExtra: true },
  { id: "zucchero-di-canna", name: "Zucchero di canna", isExtra: true, defaultPrice: 0.5, available: true, canBeBase: true, canBeExtra: true },
  { id: "sciroppo-semplice", name: "Sciroppo semplice", isExtra: true, defaultPrice: 0.5, available: true, canBeBase: true, canBeExtra: true },
  { id: "ghiaccio", name: "Ghiaccio", isExtra: false, defaultPrice: 0, available: true, canBeBase: true, canBeExtra: false },
];

export const ingredientsRepo = {
  get(): Ingredient[] {
    const data = lsGet<Ingredient[] | { ingredients?: Ingredient[] }>(KEY, DEFAULTS);
    const stored = Array.isArray(data) ? data : isWrapped(data) ? data.ingredients : DEFAULTS;
    // Merge defaults: add any missing default ingredient ids
    const byId: Record<string, Ingredient> = {};
    for (const ing of stored) byId[ing.id] = { ...ing };
    let changed = false;
    for (const d of DEFAULTS) {
      if (!byId[d.id]) {
        byId[d.id] = { ...d };
        changed = true;
      }
    }
    const merged = Object.values(byId).map((ing) => {
      let kind = ing.kind as Ingredient["kind"] | undefined;
      if (!kind) {
        if (ing.isSauce) kind = "sauce";
        else if (["gin","vodka","rum-bianco","rum-scuro","tequila","prosecco","aperol","bitter","vermouth-rosso","vermouth-bianco","soda","acqua-tonica","acqua-tonica-mediterranea","acqua-tonica-dry","succo-darancia","succo-di-ananas","caffe","latte","panna"].includes(ing.id)) kind = "beverage";
        else kind = "food";
      }
      return {
        ...ing,
        canBeBase: ing.canBeBase ?? true,
        canBeExtra: ing.canBeExtra ?? (ing.isExtra ?? true),
        isSauce: ing.isSauce ?? false,
        kind,
      };
    });
    if (changed) lsSet(KEY, merged);
    return merged;
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

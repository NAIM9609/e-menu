export type MenuItem = {
  id: string;
  name: string;
  description?: string;
  price?: number | string;
  badges?: string[]; // e.g., ['veg', 'spicy', 'gluten-free']
  baseIngredients?: string[];
  extras?: { id: string; name: string; price: number }[];
  allowBaseRemoval?: boolean; // if false, base ingredients cannot be removed
  enabled?: boolean; // if false, hide from public menu
  imageUrl?: string; // optional thumbnail image shown in public menu
  stock?: number | null; // optional limit per item
};

export type MenuCategory = {
  id: string; // slug used for anchors
  title: string;
  description?: string;
  imageUrl?: string;
  items: MenuItem[];
  customBuilder?: {
    enabled: boolean;
    label?: string; // display label
    basePrice?: number; // optional starting price
    steps: {
      id: string;
      title: string;
      selection: "single" | "multi";
      ingredientIds: string[]; // options come from Ingredients catalog
      optionOverrides?: Record<string, number>; // per-option price override by ingredient id
      required?: boolean; // if true, enforce selection (single: exactly 1, multi: >=1)
      icon?: string; // optional emoji or short icon label to show in UI
    }[];
  };
};

// Demo data modeled after a digital menu. Replace with backend data later.
export const MENU_CATEGORIES: MenuCategory[] = [
  // Pizzeria
  {
    id: "pizze-classiche",
    title: "Pizze Classiche",
    description: "Impasto tradizionale, ingredienti di qualità",
    items: [
      {
        id: "margherita",
        name: "Margherita",
        description: "Salsa di pomodoro, fior di latte, basilico",
        price: 7.5,
  imageUrl: "https://images.unsplash.com/photo-1548365328-8b849abd0f9c?w=800&auto=format&fit=crop&q=60",
        badges: ["veg"],
        baseIngredients: ["salsa-di-pomodoro", "fior-di-latte", "basilico"],
        extras: [
          { id: "mozzarella-di-bufala", name: "Mozzarella di bufala", price: 2.5 },
          { id: "olive-nere", name: "Olive nere", price: 1 },
          { id: "funghi-champignon", name: "Funghi", price: 1.5 },
        ],
      },
      {
        id: "diavola",
        name: "Diavola",
        description: "Salsa di pomodoro, mozzarella, salame piccante",
        price: 9,
        imageUrl: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&auto=format&fit=crop&q=60",
        badges: ["piccante"],
        baseIngredients: ["salsa-di-pomodoro", "mozzarella", "salame-piccante"],
        extras: [
          { id: "jalapeno", name: "Jalapeño", price: 1 },
          { id: "cipolla", name: "Cipolla", price: 0.5 },
        ],
      },
      {
        id: "quattro-stagioni",
        name: "Quattro Stagioni",
        description: "Pomodoro, mozzarella, prosciutto cotto, funghi, carciofi, olive",
        price: 10,
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=60",
        baseIngredients: ["salsa-di-pomodoro", "mozzarella", "prosciutto-cotto", "funghi-champignon", "carciofi", "olive-nere"],
        extras: [
          { id: "rucola", name: "Rucola", price: 1 },
          { id: "parmigiano", name: "Scaglie di parmigiano", price: 1.5 },
        ],
      },
      {
        id: "prosciutto-e-funghi",
        name: "Prosciutto e Funghi",
        description: "Pomodoro, mozzarella, prosciutto cotto, funghi",
        price: 9.5,
        imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&auto=format&fit=crop&q=60",
        baseIngredients: ["salsa-di-pomodoro", "mozzarella", "prosciutto-cotto", "funghi-champignon"],
      },
    ],
  },
  // Pizze Gourmet
  {
    id: "pizze-gourmet",
    title: "Pizze Gourmet",
    description: "Abbinamenti ricercati",
    items: [
      {
        id: "mortadella-pistacchio",
        name: "Mortadella e Pistacchio",
        description: "Mozzarella, mortadella, stracciatella, granella di pistacchio",
        price: 12,
        imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&auto=format&fit=crop&q=60",
        baseIngredients: ["mozzarella", "mortadella", "stracciatella", "pistacchio-granella"],
      },
      {
        id: "burrata-nduja",
        name: "Burrata e 'Nduja",
        description: "Salsa di pomodoro, mozzarella, 'nduja, burrata",
        price: 12.5,
        imageUrl: "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800&auto=format&fit=crop&q=60",
        badges: ["piccante"],
        baseIngredients: ["salsa-di-pomodoro", "mozzarella", "nduja", "burrata"],
      },
      {
        id: "bresaola-rucola",
        name: "Bresaola e Rucola",
        description: "Mozzarella, bresaola, rucola, scaglie di parmigiano",
        price: 11.5,
        imageUrl: "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800&auto=format&fit=crop&q=60",
        baseIngredients: ["mozzarella", "bresaola", "rucola", "parmigiano"],
      },
    ],
  },
  // Cucina / Primi
  {
    id: "primi-piatti",
    title: "Primi Piatti",
    description: "Paste e risotti",
    items: [
      {
        id: "spaghetti-alla-carbonara",
        name: "Spaghetti alla Carbonara",
        description: "Guanciale, uova, pecorino romano, pepe",
        price: 12,
        imageUrl: "https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=800&auto=format&fit=crop&q=60",
        baseIngredients: ["spaghetti", "guanciale", "uova", "pecorino-romano"],
      },
      {
        id: "penne-al-pomodoro",
        name: "Penne al pomodoro",
        description: "Salsa di pomodoro, basilico",
        price: 8,
        badges: ["veg"],
        imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=800&auto=format&fit=crop&q=60",
        baseIngredients: ["penne", "salsa-di-pomodoro", "basilico"],
        extras: [
          { id: "mozzarella", name: "Mozzarella", price: 1.5 },
          { id: "parmigiano", name: "Parmigiano", price: 1.5 },
        ],
      },
    ],
  },
  // Antipasti di mare
  {
    id: "antipasti-di-mare",
    title: "Antipasti di mare",
    items: [
      {
        id: "calamari-fritti",
        name: "Calamari fritti",
        description: "Calamari in pastella dorata",
        price: 11,
        imageUrl: "https://images.unsplash.com/photo-1523980170405-55c6541f0dc5?w=800&auto=format&fit=crop&q=60",
        baseIngredients: ["calamari"],
      },
      {
        id: "cozze-alla-marinara",
        name: "Cozze alla marinara",
        description: "Cozze, pomodoro, prezzemolo, aglio",
        price: 10,
        imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=60",
        baseIngredients: ["cozze", "salsa-di-pomodoro", "prezzemolo"],
      },
      {
        id: "cocktail-di-gamberi",
        name: "Cocktail di gamberi",
        description: "Gamberetti, salsa cocktail",
        price: 9.5,
        imageUrl: "https://images.unsplash.com/photo-1606755962773-d324e76db5f7?w=800&auto=format&fit=crop&q=60",
        baseIngredients: ["gamberetti", "maionese", "ketchup"],
      },
    ],
  },
  // Insalate
  {
    id: "insalate",
    title: "Insalate",
    items: [
      {
        id: "greca",
        name: "Greca",
        description: "Insalata mista, pomodori, cetrioli, olive, feta",
        price: 9,
        badges: ["light"],
        imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=60",
        baseIngredients: ["insalata-mista", "pomodori", "cetrioli", "olive-nere", "feta"],
      },
      {
        id: "cesare",
        name: "Caesar",
        description: "Insalata mista, pollo, scaglie di parmigiano, crostini",
        price: 10,
        imageUrl: "https://images.unsplash.com/photo-1551248429-40975aa4de74?w=800&auto=format&fit=crop&q=60",
        baseIngredients: ["insalata-mista", "pollo", "parmigiano", "crostini"],
      },
    ],
  },
  // Panini
  {
    id: "panini",
    title: "Panini",
    description: "Pane croccante e farciture gustose",
    items: [
      {
        id: "panino-pollo",
        name: "Pollo alla griglia",
        description: "Pane, pollo, insalata, pomodori, maionese",
        price: 8.5,
        imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=60",
        baseIngredients: ["pane", "pollo", "insalata-mista", "pomodori", "maionese"],
        extras: [
          { id: "scamorza", name: "Scamorza", price: 1 },
          { id: "bacon", name: "Bacon", price: 1.5 },
        ],
      },
      {
        id: "burger-classico",
        name: "Burger classico",
        description: "Pane, manzo, cheddar, insalata, ketchup, senape",
        price: 10,
        imageUrl: "https://images.unsplash.com/photo-1550317138-10000687a72b?w=800&auto=format&fit=crop&q=60",
        baseIngredients: ["pane", "manzo", "cheddar", "insalata-mista", "ketchup", "senape"],
        extras: [
          { id: "pomodori", name: "Pomodori", price: 0.5 },
          { id: "cipolla", name: "Cipolla", price: 0.5 },
          { id: "bacon", name: "Bacon", price: 1.5 },
        ],
      },
      {
        id: "focaccia-vegetariana",
        name: "Focaccia vegetariana",
        description: "Focaccia, zucchine, melanzane, scamorza, rucola",
        price: 8,
        imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=60",
        badges: ["veg"],
        baseIngredients: ["focaccia", "zucchine", "melanzane", "scamorza", "rucola"],
      },
    ],
  },
  // Antipasti
  {
    id: "antipasti",
    title: "Antipasti",
    items: [
      {
        id: "bruschette",
        name: "Bruschette al pomodoro",
        description: "Pane tostato, pomodorini, basilico, olio EVO",
        price: 6,
        imageUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&auto=format&fit=crop&q=60",
        baseIngredients: ["pane", "pomodorini", "basilico"],
      },
      {
        id: "tagliere-misto",
        name: "Tagliere misto",
        description: "Selezione di salumi e formaggi",
        price: 14,
        imageUrl: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&auto=format&fit=crop&q=60",
        baseIngredients: ["prosciutto-crudo", "speck", "gorgonzola", "scamorza"],
      },
      {
        id: "olive-miste",
        name: "Olive miste",
        price: 4.5,
        imageUrl: "https://images.unsplash.com/photo-1505575972945-281fea0883c6?w=800&auto=format&fit=crop&q=60",
        baseIngredients: ["olive-nere", "olive-verdi"],
      },
      {
        id: "patatine-fritte",
        name: "Patatine fritte",
        price: 5,
        imageUrl: "https://images.unsplash.com/photo-1541599188778-cdc73298e8f8?w=800&auto=format&fit=crop&q=60",
        baseIngredients: ["patatine-fritte"],
      },
    ],
  },
  // Dolci
  {
    id: "dolci",
    title: "Dolci",
    items: [
      {
        id: "tiramisu",
        name: "Tiramisù",
        description: "Savoiardi, mascarpone, caffè, cacao amaro",
        price: 5.5,
        imageUrl: "https://images.unsplash.com/photo-1602744370685-1d2d0948f67b?w=800&auto=format&fit=crop&q=60",
        baseIngredients: ["savoiardi", "mascarpone", "caffe", "cacao-amaro"],
      },
      {
        id: "panna-cotta",
        name: "Panna cotta",
        description: "Panna, vaniglia, coulis",
        price: 5,
        imageUrl: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&auto=format&fit=crop&q=60",
        baseIngredients: ["panna", "zucchero", "vaniglia"],
      },
      {
        id: "crepes-nutella",
        name: "Crêpes alla Nutella",
        price: 5.5,
        imageUrl: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&auto=format&fit=crop&q=60",
        baseIngredients: ["nutella", "panna"],
      },
    ],
  },
  // Bar / Cocktail
  {
    id: "cocktail-classici",
    title: "Cocktail Classici",
    description: "I nostri drink più richiesti",
    items: [
      {
        id: "spritz",
        name: "Spritz",
        description: "Aperol, Prosecco, Soda",
        price: 7,
        imageUrl: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&auto=format&fit=crop&q=60",
        baseIngredients: ["aperol", "prosecco", "soda"],
        extras: [
          { id: "lime", name: "Fetta di lime", price: 0.5 },
          { id: "succo-darancia", name: "Splash d'arancia", price: 0.5 },
        ],
        badges: ["af"],
      },
      {
        id: "negroni",
        name: "Negroni",
        description: "Gin, Bitter, Vermouth Rosso",
        price: 9,
        imageUrl: "https://images.unsplash.com/photo-1572414490590-63f2e0eace9b?w=800&auto=format&fit=crop&q=60",
        baseIngredients: ["gin", "bitter", "vermouth-rosso"],
      },
      {
        id: "mojito",
        name: "Mojito",
        description: "Rum bianco, menta, lime, zucchero di canna, soda",
        price: 8.5,
        imageUrl: "https://images.unsplash.com/photo-1570222094114-d054a817e56a?w=800&auto=format&fit=crop&q=60",
        baseIngredients: ["rum-bianco", "menta", "lime", "zucchero-di-canna", "soda"],
      },
    ],
  },
  // Vini
  {
    id: "vini",
    title: "Vini",
    items: [
      { id: "vermentino", name: "Vermentino", price: 18, imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop&q=60" },
      { id: "chardonnay", name: "Chardonnay", price: 22, imageUrl: "https://images.unsplash.com/photo-1507434916370-9c3dd746d3e2?w=800&auto=format&fit=crop&q=60" },
      { id: "chianti", name: "Chianti", price: 20, imageUrl: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=800&auto=format&fit=crop&q=60" },
    ],
  },
  // Distillati
  {
    id: "distillati",
    title: "Distillati",
    items: [
      { id: "whisky", name: "Whisky", price: 6.5, imageUrl: "https://images.unsplash.com/photo-1481391319762-47c0d0e12f96?w=800&auto=format&fit=crop&q=60" },
      { id: "gin-secco", name: "Gin secco", price: 5.5, imageUrl: "https://images.unsplash.com/photo-1527169402691-feff5539e52c?w=800&auto=format&fit=crop&q=60" },
      { id: "vodka-liscia", name: "Vodka liscia", price: 5, imageUrl: "https://images.unsplash.com/photo-1541976590-713941681591?w=800&auto=format&fit=crop&q=60" },
      { id: "rum-scuro-liscio", name: "Rum scuro", price: 5.5, imageUrl: "https://images.unsplash.com/photo-1546173159-315724a3168c?w=800&auto=format&fit=crop&q=60" },
    ],
  },
  // Selezione Gin & Tonic
  {
    id: "gin-tonic-selection",
    title: "Selezione Gin & Tonic",
    description: "Gin differenti con toniche e garnish",
    items: [
      {
        id: "gin-tonic-classico",
        name: "Gin Tonic Classico",
        description: "Gin London Dry, acqua tonica, fetta di lime",
        price: 8,
        imageUrl: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=800&auto=format&fit=crop&q=60",
        baseIngredients: ["gin", "acqua-tonica", "lime"],
        extras: [
          { id: "rosmarino", name: "Rosmarino", price: 0.5 },
          { id: "pepe-rosa", name: "Pepe rosa", price: 0.5 },
        ],
      },
      {
        id: "gin-tonic-agrumi",
        name: "Gin Tonic Agrumi",
        description: "Gin agli agrumi, tonica mediterranea, scorza di pompelmo",
        price: 9,
        imageUrl: "https://images.unsplash.com/photo-1571770095004-6b61b1cf308a?w=800&auto=format&fit=crop&q=60",
        baseIngredients: ["gin-agrumi", "acqua-tonica-mediterranea", "pompelmo"],
      },
      {
        id: "gin-tonic-erbe",
        name: "Gin Tonic alle Erbe",
        description: "Gin alle erbe, tonica dry, rosmarino",
        price: 9,
        imageUrl: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=800&auto=format&fit=crop&q=60",
        baseIngredients: ["gin-erbe", "acqua-tonica-dry", "rosmarino"],
      },
      {
        id: "gin-tonic-frutti-rossi",
        name: "Gin Tonic ai Frutti Rossi",
        description: "Gin infuso ai frutti rossi, tonica, mirtilli e lamponi",
        price: 9.5,
        imageUrl: "https://images.unsplash.com/photo-1576020799627-aeac74d58064?w=800&auto=format&fit=crop&q=60",
        baseIngredients: ["gin-frutti-rossi", "acqua-tonica", "mirtilli", "lamponi"],
      },
    ],
  },
  // Birre
  {
    id: "birre",
    title: "Birre",
    items: [
      { id: "lager", name: "Lager", price: 5, imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=60" },
      { id: "ipa", name: "IPA", price: 6, imageUrl: "https://images.unsplash.com/photo-1541557435984-1c79685a082e?w=800&auto=format&fit=crop&q=60" },
      { id: "stout", name: "Stout", price: 6, imageUrl: "https://images.unsplash.com/photo-1543128639-4cb7e6eeef1b?w=800&auto=format&fit=crop&q=60" },
    ],
  },
  // Analcolici
  {
    id: "analcolici",
    title: "Analcolici",
    items: [
      { id: "cola", name: "Cola", price: 3, imageUrl: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&auto=format&fit=crop&q=60" },
      { id: "aranciata", name: "Aranciata", price: 3, imageUrl: "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=800&auto=format&fit=crop&q=60" },
      { id: "acqua-frizzante", name: "Acqua frizzante", price: 2, imageUrl: "https://images.unsplash.com/photo-1556157382-97eda2c6d911?w=800&auto=format&fit=crop&q=60" },
    ],
  },
  // Caffetteria
  {
    id: "caffetteria",
    title: "Caffetteria",
    items: [
      { id: "espresso", name: "Espresso", price: 1.5, imageUrl: "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800&auto=format&fit=crop&q=60", baseIngredients: ["caffe"] },
      { id: "cappuccino", name: "Cappuccino", price: 2.5, imageUrl: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800&auto=format&fit=crop&q=60", baseIngredients: ["caffe", "latte"] },
      { id: "latte-macchiato", name: "Latte macchiato", price: 2.8, imageUrl: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&auto=format&fit=crop&q=60", baseIngredients: ["latte", "caffe"] },
    ],
  },
];

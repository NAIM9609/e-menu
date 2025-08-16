export type MenuItem = {
  id: string;
  name: string;
  description?: string;
  price?: number | string;
  badges?: string[]; // e.g., ['veg', 'spicy', 'gluten-free']
  baseIngredients?: string[];
  extras?: { id: string; name: string; price: number }[];
};

export type MenuCategory = {
  id: string; // slug used for anchors
  title: string;
  description?: string;
  imageUrl?: string;
  items: MenuItem[];
};

// Demo data modeled after a digital menu. Replace with backend data later.
export const MENU_CATEGORIES: MenuCategory[] = [
  {
    id: "menu-aperitivo",
    title: "Menù aperitivo",
    description: "Selezione per l'aperitivo",
    items: [
      {
        id: "spritz",
        name: "Spritz",
        description: "Aperol, Prosecco, Soda",
        price: 7,
        badges: ["gluten-free"],
        baseIngredients: ["Aperol", "Prosecco", "Soda"],
        extras: [
          { id: "oliva", name: "Oliva", price: 0.5 },
          { id: "fetta-arancia", name: "Fetta d'arancia extra", price: 0.5 },
        ],
      },
      {
        id: "negroni",
        name: "Negroni",
        description: "Gin, Bitter, Vermouth Rosso",
        price: 9,
        baseIngredients: ["Gin", "Bitter", "Vermouth Rosso"],
        extras: [
          { id: "twist-arancia", name: "Twist d'arancia", price: 0.5 },
        ],
      },
    ],
  },
  {
    id: "pizzacce",
    title: "Le nostre pizzacce",
    description: "Base scrocchiarella con ingredienti selezionati",
    items: [
      {
        id: "margherita",
        name: "Margherita",
        description: "Pomodoro, fior di latte, basilico",
        price: 8,
        badges: ["vegetarian"],
        baseIngredients: ["Pomodoro", "Fior di latte", "Basilico"],
        extras: [
          { id: "olive", name: "Olive", price: 1 },
          { id: "acciughe", name: "Acciughe", price: 1.5 },
          { id: "bufala", name: "Mozzarella di bufala", price: 2 },
        ],
      },
      {
        id: "diavola",
        name: "Diavola",
        description: "Salame piccante, mozzarella",
        price: 9,
        badges: ["spicy"],
        baseIngredients: ["Pomodoro", "Mozzarella", "Salame piccante"],
        extras: [
          { id: "jalapeno", name: "Jalapeño", price: 1 },
          { id: "cipolla", name: "Cipolla", price: 0.5 },
        ],
      },
    ],
  },
  {
    id: "vini-bianchi",
    title: "Vini Bianchi",
    items: [
      { id: "vermentino", name: "Vermentino", price: 18 },
      { id: "chardonnay", name: "Chardonnay", price: 22 },
    ],
  },
];

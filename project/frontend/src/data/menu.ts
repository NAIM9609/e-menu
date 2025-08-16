export type MenuItem = {
  id: string;
  name: string;
  description?: string;
  price?: number | string;
  badges?: string[]; // e.g., ['veg', 'spicy', 'gluten-free']
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
      },
      {
        id: "negroni",
        name: "Negroni",
        description: "Gin, Bitter, Vermouth Rosso",
        price: 9,
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
      },
      {
        id: "diavola",
        name: "Diavola",
        description: "Salame piccante, mozzarella",
        price: 9,
        badges: ["spicy"],
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

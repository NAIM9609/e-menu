"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  id: string; // line id (unique per customization)
  baseId: string; // product id
  name: string;
  basePrice: number; // in EUR
  qty: number;
  removedIngredients?: string[];
  extras?: { id: string; name: string; price: number }[];
};

type CartContextType = {
  items: CartItem[];
  totalQty: number;
  totalAmount: number; // EUR
  addItem: (item: { id: string; name: string; price?: number; removedIngredients?: string[]; extras?: { id: string; name: string; price: number }[] }) => void;
  removeItem: (id: string) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  addExtra: (id: string, extra: { id: string; name: string; price: number }) => void;
  removeExtra: (id: string, extraId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "e-menu:cart:v1";

type UnknownRecord = Record<string, unknown>;
const isRecord = (v: unknown): v is UnknownRecord => typeof v === "object" && v !== null;

function normalizeItems(data: unknown): CartItem[] {
  if (!Array.isArray(data)) return [];
  return data.map((raw) => {
    if (!isRecord(raw)) return { id: "", baseId: "", name: "Prodotto", basePrice: 0, qty: 1 } as CartItem;
    const basePrice = typeof raw.basePrice === "number" ? raw.basePrice : (typeof raw.price === "number" ? raw.price : 0);
    const id = String((raw.id as unknown) ?? "");
    const baseId = String((raw.baseId as unknown) ?? id);
    const qty = typeof raw.qty === "number" && raw.qty > 0 ? raw.qty : 1;
    const removedIngredients = Array.isArray(raw.removedIngredients) ? (raw.removedIngredients as unknown[]).map(String) : [];
    const extrasArr = isRecord(raw) && Array.isArray(raw.extras) ? (raw.extras as unknown[]) : [];
    const extras = extrasArr
      .filter((e): e is UnknownRecord => isRecord(e) && typeof e.id === "string")
      .map((e) => ({ id: String(e.id), name: String((e.name as unknown) ?? "Extra"), price: typeof e.price === "number" ? e.price : 0 }));

    return {
      id,
      baseId,
      name: String((raw.name as unknown) ?? "Prodotto"),
      basePrice,
      qty,
      removedIngredients,
      extras,
    } as CartItem;
  });
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      if (typeof window === "undefined") return [];
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return normalizeItems(parsed);
      if (parsed && Array.isArray(parsed.items)) return normalizeItems(parsed.items);
      return [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const addItem: CartContextType["addItem"] = ({ id, name, price, removedIngredients, extras }) => {
    const p = typeof price === "number" && !isNaN(price) ? price : 0;
    setItems((prev) => {
      const rm = [...(removedIngredients ?? [])].sort();
      const ex = [...(extras ?? [])].sort((a, b) => a.id.localeCompare(b.id));
      const isSameConfig = (a: CartItem) => {
        const aRm = [...(a.removedIngredients ?? [])].sort();
        const aEx = [...(a.extras ?? [])].sort((x, y) => x.id.localeCompare(y.id));
        return a.baseId === id && JSON.stringify(aRm) === JSON.stringify(rm) && JSON.stringify(aEx) === JSON.stringify(ex);
      };

      const matchIdx = prev.findIndex(isSameConfig);
      if (matchIdx >= 0) {
        const copy = [...prev];
        copy[matchIdx] = { ...copy[matchIdx], qty: copy[matchIdx].qty + 1 };
        return copy;
      }
      const lineKey = `${id}|rm:${rm.join(',')}|ex:${ex.map(e=>e.id).join(',')}`;
      return [
        ...prev,
        {
          id: lineKey,
          baseId: id,
          name,
          basePrice: p,
          qty: 1,
          removedIngredients: rm,
          extras: ex,
        },
      ];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
  };

  const increment = (id: string) => {
    setItems((prev) => {
      const idx = prev.findIndex((x) => x.id === id);
      if (idx < 0) return prev;
      const copy = [...prev];
      copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 };
      return copy;
    });
  };

  const decrement = (id: string) => {
    setItems((prev) => {
      const idx = prev.findIndex((x) => x.id === id);
      if (idx < 0) return prev;
      const item = prev[idx];
      if (item.qty <= 1) {
        return prev.filter((x) => x.id !== id);
      }
      const copy = [...prev];
      copy[idx] = { ...copy[idx], qty: copy[idx].qty - 1 };
      return copy;
    });
  };

  const clear = () => setItems([]);

  const { totalQty, totalAmount } = useMemo(() => {
    let qty = 0;
    let amt = 0;
    for (const it of items) {
      qty += it.qty;
  const extrasSum = (it.extras ?? []).reduce((s, e) => s + e.price, 0);
  amt += (it.basePrice + extrasSum) * it.qty;
    }
    return { totalQty: qty, totalAmount: amt };
  }, [items]);

  const value: CartContextType = {
    items,
    totalQty,
    totalAmount,
    addItem,
    removeItem,
  increment,
  decrement,
  addExtra: (id, extra) =>
      setItems((prev) => {
        const idx = prev.findIndex((x) => x.id === id);
        if (idx < 0) return prev;
        const copy = [...prev];
        const current = copy[idx];
        const exists = (current.extras ?? []).some((e) => e.id === extra.id);
        if (!exists) {
          copy[idx] = { ...current, extras: [...(current.extras ?? []), extra] };
        }
        return copy;
      }),
    removeExtra: (id, extraId) =>
      setItems((prev) => {
        const idx = prev.findIndex((x) => x.id === id);
        if (idx < 0) return prev;
        const copy = [...prev];
        const current = copy[idx];
        copy[idx] = { ...current, extras: (current.extras ?? []).filter((e) => e.id !== extraId) };
        return copy;
      }),
    clear,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

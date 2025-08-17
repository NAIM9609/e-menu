"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ingredientsRepo } from "@/services/ingredientsRepo";

export type Ingredient = {
  id: string; // slug
  name: string;
  isExtra: boolean; // available as extra by default
  defaultPrice: number; // default price when used as extra
};

type IngredientsContextType = {
  ingredients: Ingredient[];
  addIngredient: (name: string, opts?: { isExtra?: boolean; defaultPrice?: number }) => void;
  removeIngredient: (id: string) => void;
  updateIngredient: (id: string, patch: Partial<Omit<Ingredient, "id">>) => void;
  resetDefaults: () => void;
};


function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

const Ctx = createContext<IngredientsContextType | undefined>(undefined);

export function IngredientsProvider({ children }: { children: React.ReactNode }) {
  const [ingredients, setIngredients] = useState<Ingredient[]>(() => {
  return ingredientsRepo.get();
  });

  useEffect(() => {
    ingredientsRepo.set(ingredients);
  }, [ingredients]);

  const addIngredient = (name: string, opts?: { isExtra?: boolean; defaultPrice?: number }) => {
    const base = slugify(name);
    let id = base || `ing-${Date.now()}`;
    let i = 2;
    while (ingredients.some((ing) => ing.id === id)) {
      id = `${base}-${i++}`;
    }
    setIngredients([
      ...ingredients,
      {
        id,
        name: name.trim(),
        isExtra: opts?.isExtra ?? true,
        defaultPrice: Number.isFinite(opts?.defaultPrice) ? Number(opts!.defaultPrice) : 1,
      },
    ]);
  };

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter((ing) => ing.id !== id));
  };

  const updateIngredient = (id: string, patch: Partial<Omit<Ingredient, "id">>) => {
    setIngredients(
      ingredients.map((ing) => (ing.id === id ? { ...ing, ...patch } : ing))
    );
  };

  const resetDefaults = () => setIngredients(ingredientsRepo.reset());

  return (
    <Ctx.Provider value={{ ingredients, addIngredient, removeIngredient, updateIngredient, resetDefaults }}>
      {children}
    </Ctx.Provider>
  );
}

export function useIngredients() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useIngredients must be used within IngredientsProvider");
  return ctx;
}

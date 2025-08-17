"use client";
import { useEffect, useState } from "react";
import { useMenu } from "@/store/menuStore";
import { useIngredients } from "@/store/ingredientsStore";

export default function BootMigrator() {
  const { categories, setCategories } = useMenu();
  const { ingredients } = useIngredients();
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    try {
      if (typeof window !== "undefined") {
        const flag = localStorage.getItem("e-menu:migr:baseIngToIds:v1");
        if (flag === "1") { setDone(true); return; }
      }
    } catch {}
    if (!ingredients || ingredients.length === 0) return;
    let changedAny = false;
    const next = categories.map((c) => {
      let changedCat = false;
      const items = c.items.map((it) => {
        if (!it.baseIngredients || it.baseIngredients.length === 0) return it;
        const mapped = it.baseIngredients.map((v) => {
          if (ingredients.some((ing) => ing.id === v)) return v;
          const found = ingredients.find((ing) => ing.name.toLowerCase() === String(v).toLowerCase());
          if (found) { changedCat = true; changedAny = true; return found.id; }
          return v;
        });
        return changedCat ? { ...it, baseIngredients: mapped } : it;
      });
      return changedCat ? { ...c, items } : c;
    });
    if (changedAny) setCategories(next);
    setDone(true);
    try { if (typeof window !== "undefined") localStorage.setItem("e-menu:migr:baseIngToIds:v1", "1"); } catch {}
  }, [done, categories, ingredients, setCategories]);

  return null;
}

"use client";
import { useState } from "react";
import { useIngredients } from "@/store/ingredientsStore";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";

export default function IngredientsPanel() {
  const { ingredients, addIngredient, removeIngredient, updateIngredient, resetDefaults } = useIngredients();
  const [ingFilter, setIngFilter] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | null>(null);
  const [isExtraNew, setIsExtraNew] = useState(true);

  return (
    <div className="space-y-2">
      <div>
        <span className="text-sm">Cerca</span>
        <InputText value={ingFilter} onChange={(e) => setIngFilter(e.target.value)} placeholder="Cerca per nome o id" className="w-full mt-1" />
      </div>
      <div className="border border-neutral-800 rounded p-2">
        <div className="text-sm mb-1">Aggiungi ingrediente</div>
        <div className="flex flex-col gap-2">
          <InputText placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} />
          <label className="flex items-center gap-2 text-sm">
            <Checkbox inputId="isExtraNew" checked={isExtraNew} onChange={(e) => setIsExtraNew(!!e.checked)} />
            <span>Disponibile come extra</span>
          </label>
          <div>
            <label className="text-xs">Prezzo extra di default (€)</label>
            <InputNumber value={price} onValueChange={(e) => setPrice((e.value as number) ?? null)} className="w-full" inputClassName="w-full" min={0} mode="decimal" locale="it-IT" minFractionDigits={0} maxFractionDigits={2} />
          </div>
          <Button label="Aggiungi" onClick={() => { if (!name.trim()) return; addIngredient(name.trim(), { isExtra: isExtraNew, defaultPrice: Number(price ?? 0) }); setName(""); setPrice(null); setIsExtraNew(true); }} />
        </div>
      </div>
      <ul className="space-y-2 max-h-[50vh] overflow-auto pr-1">
        {ingredients
          .filter((ing) => {
            const q = ingFilter.trim().toLowerCase();
            if (!q) return true;
            const hay = `${ing.name} ${ ing.id }`.toLowerCase();
            return hay.includes(q);
          })
          .map((ing) => (
          <li key={ing.id} className="border border-neutral-800 rounded p-2">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{ing.name}</div>
                <div className="text-xs text-neutral-400">id: {ing.id}</div>
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-xs">
                  <Checkbox checked={ing.isExtra} onChange={(e) => updateIngredient(ing.id, { isExtra: !!e.checked })} />
                  <span>extra</span>
                </label>
                <div className="w-24">
                  <InputNumber value={ing.defaultPrice} onValueChange={(e) => updateIngredient(ing.id, { defaultPrice: Number((e.value as number) ?? 0) })} className="w-full" inputClassName="w-full" min={0} mode="decimal" locale="it-IT" minFractionDigits={0} maxFractionDigits={2} />
                </div>
                <Button icon="pi pi-trash" text severity="danger" onClick={() => removeIngredient(ing.id)} />
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex justify-end">
        <Button icon="pi pi-refresh" text severity="secondary" onClick={resetDefaults} aria-label="Ripristina ingredienti" />
      </div>
    </div>
  );
}

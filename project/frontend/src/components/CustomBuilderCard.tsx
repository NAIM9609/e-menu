"use client";
import { useMemo, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useIngredients } from "@/store/ingredientsStore";
import { useCart } from "@/context/CartContext";
import { useI18n } from "@/i18n/i18n";
import { useMenu } from "@/store/menuStore";
import type { MenuItem as MenuItemType } from "@/data/menu";

type Step = {
  id: string;
  title: string;
  selection: "single" | "multi";
  ingredientIds: string[];
  optionOverrides?: Record<string, number>;
  required?: boolean;
  icon?: string;
};

export default function CustomBuilderCard({
  categoryId,
  categoryTitle,
  label,
  basePrice,
  steps,
}: {
  categoryId: string;
  categoryTitle: string;
  label?: string;
  basePrice?: number;
  steps: Step[];
}) {
  const { ingredients } = useIngredients();
  const { addItem, items } = useCart();
  const { categories } = useMenu();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Record<string, string[]>>({});

  const resolvedSteps = useMemo(() => {
    return steps.map((s) => ({
      ...s,
      options: s.ingredientIds
        .map((id) => ingredients.find((i) => i.id === id))
        .filter(Boolean)
        .map((ing) => ing!)
        .filter((ing) => ing.available !== false),
    }));
  }, [steps, ingredients]);

  const totalPrice = useMemo(() => {
    const sum = resolvedSteps.reduce((acc, s) => {
      const ids = selected[s.id] || [];
      return acc + ids.reduce((p, id) => {
        const override = s.optionOverrides?.[id];
        if (typeof override === "number") return p + override;
        const ing = ingredients.find((i) => i.id === id);
        return p + ( ing ? ing.defaultPrice : 0 );
      }, 0);
    }, 0);
    return (basePrice || 0) + sum;
  }, [resolvedSteps, selected, ingredients, basePrice]);

  const handleToggle = (stepId: string, optionId: string, selection: "single" | "multi") => {
    setSelected((prev) => {
      const cur = prev[stepId] || [];
      if (selection === "single") return { ...prev, [stepId]: [optionId] };
      const exists = cur.includes(optionId);
      return { ...prev, [stepId]: exists ? cur.filter((x) => x !== optionId) : [...cur, optionId] };
    });
  };

  // Stock checks for builder: ensure selected ingredients won't exceed their stock
  const selectedIds = useMemo(() => Object.values(selected).flat(), [selected]);
  const blockingIngredients = useMemo(() => {
    const over: string[] = [];
    for (const ingId of selectedIds) {
      const ing = ingredients.find((i) => i.id === ingId);
      if (!(typeof ing?.stock === "number" && ing.stock >= 0)) continue;
      const used = items.reduce((sum, line) => {
        let menuItem: MenuItemType | undefined = undefined;
        if (line.baseId) {
          for (const c of categories) {
            const f = (c.items as MenuItemType[]).find((it) => it.id === line.baseId);
            if (f) { menuItem = f; break; }
          }
        }
        const usesBase = Array.isArray(menuItem?.baseIngredients) ? (menuItem.baseIngredients as string[]).includes(ingId) : false;
        const usesExtra = (line.extras ?? []).some((e) => e.id === ingId);
        return sum + ((usesBase || usesExtra) ? line.qty : 0);
      }, 0);
      if (used + 1 > (ing.stock as number)) over.push(ing.name);
    }
    return over;
  }, [selectedIds, items, ingredients, categories]);
  const cannotAdd = blockingIngredients.length > 0;

  return (
    <>
      <div className="border border-dashed border-emerald-700 rounded-lg p-3 flex items-center justify-between bg-emerald-900/10">
        <div>
          <div className="font-semibold text-emerald-300">{label || t("admin.builder.defaultLabel")}</div>
          <div className="text-xs text-neutral-400">{t("builder.card.subtitle", { count: steps.length })}</div>
        </div>
        <Button label={t("builder.card.start")} icon="pi pi-sliders-h" onClick={() => setOpen(true)} tooltip={t("builder.card.tooltip")} />
      </div>

      <Dialog header={label || t("admin.builder.defaultLabel")} visible={open} style={{ width: "36rem" }} modal onHide={() => setOpen(false)}>
        <div className="space-y-5">
          {resolvedSteps.map((s) => (
            <div key={s.id}>
              <div className="font-medium mb-2">
                {s.icon && <span className="mr-2" aria-hidden>{s.icon}</span>}
                {s.title}
                {s.required && <span className="ml-2 text-xs text-amber-300">{t("builder.required")}</span>}
              </div>
              <div className="flex flex-wrap gap-2">
                {s.options.map((ing) => {
                  const active = (selected[s.id] || []).includes(ing.id);
                  const override = s.optionOverrides?.[ing.id];
                  const priceToShow = typeof override === "number" ? override : ing.defaultPrice;
                  return (
                    <button
                      key={ing.id}
                      className={`text-sm px-2 py-1 rounded border ${active ? "border-emerald-400 text-emerald-300" : "border-neutral-600 text-neutral-200"}`}
                      onClick={() => handleToggle(s.id, ing.id, s.selection)}
                    >
                      {ing.name} {priceToShow ? `(€ ${priceToShow.toFixed(2)})` : ""}
                    </button>
                  );
                })}
              </div>
              {s.selection === "single" && (
                <div className="text-xs text-neutral-400 mt-1">{t("builder.singleHint")}</div>
              )}
            </div>
          ))}

          <div className="flex items-center justify-between pt-2">
            <div className="text-sm text-neutral-300">
              {t("common.total")}: <span className="font-semibold">€ {totalPrice.toFixed(2)}</span>
              {cannotAdd && (
                <span className="ml-3 text-xs px-2 py-0.5 inline-block rounded-full bg-amber-900/30 text-amber-200 border border-amber-700" title={t("menu.outOfStockIngredients", { list: blockingIngredients.join(", ") })}>
                  {t("menu.soldOut")}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <Button label={t("menu.dialog.close")} text onClick={() => setOpen(false)} />
              <Button
                label={t("menu.dialog.confirm")}
                icon="pi pi-cart-plus"
                disabled={cannotAdd}
                tooltip={cannotAdd ? t("menu.outOfStockIngredients", { list: blockingIngredients.join(", ") }) : t("menu.dialog.confirmTip")}
                onClick={() => {
                  // validations for required steps
                  const missing = resolvedSteps.filter((s) => s.required && !(selected[s.id] && selected[s.id].length > 0));
                  if (missing.length > 0) {
                    alert(t("builder.alert.missing", { list: missing.map((m) => m.title).join(", ") }));
                    return;
                  }
                  if (cannotAdd) return;
                  const extras = Object.values(selected).flat().map((id) => {
                    const ing = ingredients.find((i) => i.id === id);
                    if (!ing) return null;
                    const fromStep = resolvedSteps.find((s) => (selected[s.id] || []).includes(id));
                    const override = fromStep?.optionOverrides?.[id];
                    const price = typeof override === "number" ? override : ing.defaultPrice;
                    return { id: ing.id, name: ing.name, price };
                  }).filter(Boolean) as { id: string; name: string; price: number }[];
                  const computed = totalPrice;
                  // summary in item name
                  const summary = resolvedSteps
                    .map((s) => {
                      const ids = selected[s.id] || [];
                      if (!ids.length) return null;
                      const names = ids.map((id) => ingredients.find((i) => i.id === id)?.name || id).join(", ");
                      return `${s.title}: ${names}`;
                    })
                    .filter(Boolean)
                    .join(" | ");
                  addItem({ id: `custom-${categoryId}`, name: `${label || t("builder.itemNameDefault")} - ${categoryTitle}${summary ? ` (${summary})` : ""}` , price: computed, removedIngredients: [], extras });
                  setOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}

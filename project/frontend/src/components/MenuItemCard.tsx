"use client";
import { Button } from "primereact/button";
import { useCart } from "@/context/CartContext";
import { useEffect, useMemo, useState } from "react";
import { Dialog } from "primereact/dialog";

type Props = {
  id?: string;
  name: string;
  description?: string;
  price?: number | string;
  badges?: string[];
  baseIngredients?: string[];
  extras?: { id: string; name: string; price: number }[];
};

export default function MenuItemCard({ id, name, description, price, badges, baseIngredients, extras }: Props) {
  const { addItem } = useCart();
  const [pulse, setPulse] = useState(false);
  const [open, setOpen] = useState(false);
  const [removed, setRemoved] = useState<string[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  const numericPrice = useMemo(() => (typeof price === "number" ? price : undefined), [price]);
  const resolveId = useMemo(() => id ?? name.toLowerCase().replace(/\s+/g, "-"), [id, name]);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | undefined;
    if (pulse) {
      t = setTimeout(() => setPulse(false), 420);
    }
    return () => t && clearTimeout(t);
  }, [pulse]);
  const safeBase = baseIngredients ?? [];
  const safeExtras = extras ?? [];

  return (
    <>
    <div className="border border-neutral-800 rounded-lg p-3 flex items-start justify-between gap-3 bg-black/20">
      <div className="flex-1 cursor-pointer" onClick={() => setOpen(true)}>
        <div className="font-semibold text-base text-white">{name}</div>
        {description && (
          <div className="text-sm text-neutral-300 mt-1 leading-snug">{description}</div>
        )}
        {badges && badges.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {badges.map((b) => (
              <span
                key={b}
                className="px-2 py-0.5 text-xs rounded-full bg-neutral-700 text-white capitalize"
              >
                {b}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="text-right shrink-0 flex flex-col items-end gap-2">
        {price !== undefined && (
          <div className="text-foreground font-semibold">
            {typeof price === "number" ? `€ ${price.toFixed(2)}` : price}
          </div>
        )}
        <div className="flex gap-2">
        <Button
          size="small"
          label={pulse ? "Aggiunto" : "Aggiungi"}
          icon={pulse ? "pi pi-check" : "pi pi-plus"}
          className={(pulse ? "btn-pulse p-button-info" : "p-button-success p-button-outlined")}
          onClick={() => {
            addItem({ id: resolveId, name, price: numericPrice, removedIngredients: removed, extras: safeExtras.filter(e => selectedExtras.includes(e.id)) });
            setPulse(true);
          }}
        />
        {(safeBase.length > 0 || safeExtras.length > 0) && (
          <Button size="small" label="Personalizza" text onClick={() => setOpen(true)} />
        )}
        </div>
      </div>
    </div>

    {/* Customization dialog */}
    <Dialog
      header={name}
      visible={open}
      style={{ width: "32rem" }}
      modal
      onHide={() => setOpen(false)}
    >
      <div className="space-y-4">
    {safeBase.length > 0 && (
          <div>
            <div className="font-medium mb-2">Ingredienti</div>
            <div className="flex flex-wrap gap-2">
      {safeBase.map((ing) => {
                const isRemoved = removed.includes(ing);
                return (
                  <button
                    key={ing}
                    className={`text-sm px-2 py-1 rounded border ${
                      isRemoved ? "border-red-400 text-red-300" : "border-neutral-600 text-neutral-200"
                    }`}
                    onClick={() => {
                      setRemoved((prev) =>
                        prev.includes(ing) ? prev.filter((x) => x !== ing) : [...prev, ing]
                      );
                    }}
                  >
                    {isRemoved ? "Rimuovi: " : ""}
                    {ing}
                  </button>
                );
              })}
            </div>
            {removed.length > 0 && (
              <div className="mt-2 text-xs text-neutral-400">
                Rimossi: {removed.join(", ")}. Clicca per reintrodurre.
              </div>
            )}
          </div>
        )}

    {safeExtras.length > 0 && (
          <div>
            <div className="font-medium mb-2">Aggiunte</div>
            <div className="flex flex-wrap gap-2">
      {safeExtras.map((ex) => {
                const active = selectedExtras.includes(ex.id);
                return (
                  <button
                    key={ex.id}
                    className={`text-sm px-2 py-1 rounded border ${
                      active ? "border-emerald-400 text-emerald-300" : "border-neutral-600 text-neutral-200"
                    }`}
                    onClick={() => {
                      setSelectedExtras((prev) =>
                        prev.includes(ex.id) ? prev.filter((x) => x !== ex.id) : [...prev, ex.id]
                      );
                    }}
                  >
                    {ex.name} (+€ {ex.price.toFixed(2)})
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button label="Chiudi" text onClick={() => setOpen(false)} />
          <Button
            label="Aggiungi al conto"
            icon="pi pi-cart-plus"
            onClick={() => {
              addItem({ id: resolveId, name, price: numericPrice, removedIngredients: removed, extras: safeExtras.filter(e => selectedExtras.includes(e.id)) });
              setOpen(false);
              setPulse(true);
            }}
          />
        </div>
      </div>
    </Dialog>
    </>
  );
}

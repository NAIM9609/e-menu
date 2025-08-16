"use client";
import { Button } from "primereact/button";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { Dialog } from "primereact/dialog";
import { useState } from "react";
import { MENU_CATEGORIES } from "@/data/menu";

export default function ActionBar() {
  const { totalAmount, totalQty } = useCart();
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <>
    <div className="sticky bottom-0 z-30 border-t border-neutral-800 bg-black/60 backdrop-blur">
      <div className="max-w-3xl mx-auto px-2 py-2 grid grid-cols-5 gap-2">
  <Button label="Menu" icon="pi pi-list" text onClick={() => setOpenMenu(true)} />
        <Button label="Cerca" icon="pi pi-search" text />
        <Button label="Contatti" icon="pi pi-info-circle" text />
        <Button label="Condividi" icon="pi pi-share-alt" text />
        <div className="relative">
          <Button label="Conto" icon="pi pi-wallet" text onClick={() => router.push("/conto")} />
          <span className="absolute -top-1 -right-1 bg-emerald-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">
            € {totalAmount.toFixed(2)}
          </span>
          <span className="absolute -bottom-1 right-0 translate-y-full mt-1 bg-neutral-800 border border-neutral-700 text-xs px-2 py-0.5 rounded">
            {totalQty}
          </span>
        </div>
      </div>
    </div>

    <Dialog header="Categorie" visible={openMenu} style={{ width: "28rem" }} modal onHide={() => setOpenMenu(false)}>
      <ul className="space-y-2">
        {MENU_CATEGORIES.map((c) => (
          <li key={c.id}>
            <a href={`#${c.id}`} onClick={() => setOpenMenu(false)} className="text-sm">
              {c.title}
            </a>
          </li>
        ))}
      </ul>
    </Dialog>
    </>
  );
}

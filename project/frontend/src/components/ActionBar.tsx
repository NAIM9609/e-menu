"use client";
import { useState } from "react";
import { Button } from "primereact/button";
import CategoryDrawer from "./CategoryDrawer";
import SearchDrawer from "./SearchDrawer";
import type { MenuCategory } from "@/data/menu";

export default function ActionBar({ categories }: { categories: MenuCategory[] }) {
  const [showCats, setShowCats] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  return (
    <>
      <div className="sticky bottom-0 z-30 border-t border-neutral-800 bg-black/60 backdrop-blur">
        <div className="max-w-3xl mx-auto px-2 py-2 grid grid-cols-5 gap-2">
          <Button label="Menu" icon="pi pi-list" text onClick={() => setShowCats(true)} />
          <Button label="Cerca" icon="pi pi-search" text onClick={() => setShowSearch(true)} />
          <Button label="Contatti" icon="pi pi-info-circle" text />
          <Button label="Condividi" icon="pi pi-share-alt" text />
          <Button label="Conto" icon="pi pi-wallet" text />
        </div>
        <div className="max-w-3xl mx-auto px-4 pb-2 flex items-center justify-between text-sm text-neutral-200">
          <div>Totale: € 0</div>
          <Button size="small" label="Conferma" icon="pi pi-check" className="p-button-success" />
        </div>
      </div>

      <CategoryDrawer visible={showCats} onHide={() => setShowCats(false)} categories={categories} />
      <SearchDrawer visible={showSearch} onHide={() => setShowSearch(false)} categories={categories} />
    </>
  );
}

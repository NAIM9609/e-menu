"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMenu } from "@/store/menuStore";
import { Button } from "primereact/button";
import { TabView, TabPanel } from "primereact/tabview";
import IngredientsPanel from "./components/IngredientsPanel";
import BadgesPanel from "./components/BadgesPanel";
import ProductsPanel from "./components/ProductsPanel";

export default function AdminPage() {
  const router = useRouter();
  const { resetToDefault } = useMenu();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isAuthed = localStorage.getItem("e-menu:auth") === "1";
    if (!isAuthed) router.replace("/login");
  }, [router]);

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Gestione Menù</h1>
          <div className="flex gap-2">
            <Button label="Ripristina default" icon="pi pi-refresh" severity="secondary" onClick={resetToDefault} />
            <Button label="Esci" icon="pi pi-sign-out" severity="danger" onClick={() => { localStorage.removeItem("e-menu:auth"); router.push("/"); }} />
          </div>
        </div>
        <div className="mt-4">
          <TabView>
            <TabPanel header="Prodotti">
              <ProductsPanel />
            </TabPanel>
            <TabPanel header="Ingredienti">
              <IngredientsPanel />
            </TabPanel>
            <TabPanel header="Badge">
              <BadgesPanel />
            </TabPanel>
          </TabView>
        </div>
      </div>
    </div>
  );
}
      
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMenu } from "@/store/menuStore";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import IngredientsPanel from "./components/IngredientsPanel";
import BadgesPanel from "./components/BadgesPanel";
import ProductsPanel from "./components/ProductsPanel";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useI18n } from "@/i18n/i18n";

export default function AdminPage() {
  const router = useRouter();
  const { resetToDefault } = useMenu();
  const { t } = useI18n();
  const [section, setSection] = useState<"products" | "ingredients" | "badges">(() => {
    if (typeof window === "undefined") return "products";
    const v = localStorage.getItem("e-menu:admin:section");
    return v === "products" || v === "ingredients" || v === "badges" ? v : "products";
  });
  const [mobileSidebar, setMobileSidebar] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isAuthed = localStorage.getItem("e-menu:auth") === "1";
    if (!isAuthed) router.replace("/login");
  }, [router]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("e-menu:admin:section", section);
  }, [section]);

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {/* Mobile: open overlay sidebar */}
            <Button icon="pi pi-bars" aria-label="Apri menu" onClick={() => setMobileSidebar(true)} />
            <h1 className="text-2xl font-semibold">{t("admin.manage")}</h1>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher ariaLabel="Language" />
            <Button label={t("admin.resetDefaults")} icon="pi pi-refresh" severity="secondary" onClick={resetToDefault} />
            <Button label={t("admin.exit")} icon="pi pi-sign-out" severity="danger" onClick={() => { localStorage.removeItem("e-menu:auth"); router.push("/"); }} />
          </div>
        </div>
        <div className="mt-4">
          {/* Content */}
          <main>
            {section === "products" && <ProductsPanel />}
            {section === "ingredients" && <IngredientsPanel />}
            {section === "badges" && <BadgesPanel />}
          </main>
        </div>

        {/* Mobile overlay sidebar */}
        <Sidebar
          visible={mobileSidebar}
          position="left"
          onHide={() => setMobileSidebar(false)}
          dismissable
          modal
        >
          <div className="p-2">
            <nav className="flex flex-col gap-2" aria-label="Sezioni admin">
              <Button
                label={t("admin.tab.products")}
                icon="pi pi-list"
                className={section === "products" ? "p-button p-button-sm" : "p-button-text p-button-sm"}
                onClick={() => { setSection("products"); setMobileSidebar(false); }}
                aria-current={section === "products" ? "page" : undefined}
              />
              <Button
                label={t("admin.tab.ingredients")}
                icon="pi pi-sliders-h"
                className={section === "ingredients" ? "p-button p-button-sm" : "p-button-text p-button-sm"}
                onClick={() => { setSection("ingredients"); setMobileSidebar(false); }}
                aria-current={section === "ingredients" ? "page" : undefined}
              />
              <Button
                label={t("admin.tab.badges")}
                icon="pi pi-tags"
                className={section === "badges" ? "p-button p-button-sm" : "p-button-text p-button-sm"}
                onClick={() => { setSection("badges"); setMobileSidebar(false); }}
                aria-current={section === "badges" ? "page" : undefined}
              />
            </nav>
          </div>
        </Sidebar>
      </div>
    </div>
  );
}
      
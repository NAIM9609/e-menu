"use client";
import HeaderBar from "@/components/HeaderBar";
import MenuSection from "@/components/MenuSection";
import ActionBar from "@/components/ActionBar";
import { MENU_CATEGORIES } from "@/data/menu";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <HeaderBar />
      <main className="max-w-3xl mx-auto px-4 py-4">
        {MENU_CATEGORIES.map((c) => (
          <MenuSection key={c.id} category={c} />
        ))}
      </main>
  <ActionBar />
    </div>
  );
}
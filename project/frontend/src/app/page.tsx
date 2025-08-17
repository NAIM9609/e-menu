"use client";
import HeaderBar from "@/components/HeaderBar";
import MenuSection from "@/components/MenuSection";
import ActionBar from "@/components/ActionBar";
import { useMenu } from "@/store/menuStore";
import BadgeLegend from "@/components/BadgeLegend";
import BootMigrator from "@/components/BootMigrator";

export default function Home() {
  const { categories } = useMenu();
  return (
    <div className="min-h-screen bg-black text-white">
  <BootMigrator />
      <HeaderBar />
  <BadgeLegend />
      <main className="max-w-3xl mx-auto px-4 py-4">
  {categories.map((c) => (
          <MenuSection key={c.id} category={c} />
        ))}
      </main>
  <ActionBar />
    </div>
  );
}
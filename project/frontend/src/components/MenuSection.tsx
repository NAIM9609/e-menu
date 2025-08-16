"use client";
import MenuItemCard from "./MenuItemCard";
import type { MenuCategory } from "@/data/menu";

export default function MenuSection({ category }: { category: MenuCategory }) {
  return (
    <section id={category.id} className="py-6">
      <h2 className="text-xl font-bold mb-1 text-white">{category.title}</h2>
      {category.description && (
        <p className="text-sm text-neutral-300 mb-4">{category.description}</p>
      )}
      <div className="flex flex-col gap-3">
        {category.items.map((it) => (
          <MenuItemCard
            key={it.id}
            id={it.id}
            name={it.name}
            description={it.description}
            price={it.price}
            badges={it.badges}
            baseIngredients={it.baseIngredients}
            extras={it.extras}
          />
        ))}
      </div>
    </section>
  );
}

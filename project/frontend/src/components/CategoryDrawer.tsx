"use client";
import { Sidebar } from "primereact/sidebar";
import type { MenuCategory } from "@/data/menu";

export default function CategoryDrawer({
  visible,
  onHide,
  categories,
}: {
  visible: boolean;
  onHide: () => void;
  categories: MenuCategory[];
}) {
  return (
    <Sidebar
      visible={visible}
      onHide={onHide}
      position="left"
      className="w-80"
      dismissable
    >
      <div className="p-3">
        <h3 className="text-lg font-semibold mb-3">Categorie</h3>
        <ul className="space-y-2">
          {categories.map((c) => (
            <li key={c.id}>
              <a href={`#${c.id}`} onClick={onHide} className="text-sm">
                {c.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Sidebar>
  );
}

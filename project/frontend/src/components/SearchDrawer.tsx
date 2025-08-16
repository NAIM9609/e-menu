"use client";
import { Sidebar } from "primereact/sidebar";
import { InputText } from "primereact/inputtext";
import { useMemo, useState } from "react";
import type { MenuCategory } from "@/data/menu";

export default function SearchDrawer({
  visible,
  onHide,
  categories,
}: {
  visible: boolean;
  onHide: () => void;
  categories: MenuCategory[];
}) {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [] as { id: string; name: string; cat: MenuCategory }[];
    const items: { id: string; name: string; cat: MenuCategory }[] = [];
    for (const cat of categories) {
      for (const it of cat.items) {
        if (
          it.name.toLowerCase().includes(term) ||
          (it.description && it.description.toLowerCase().includes(term))
        ) {
          items.push({ id: it.id, name: it.name, cat });
        }
      }
    }
    return items;
  }, [q, categories]);

  return (
    <Sidebar
      visible={visible}
      onHide={onHide}
      position="right"
      className="w-[28rem] max-w-full"
      dismissable
    >
      <div className="p-3">
        <h3 className="text-lg font-semibold mb-3">Cerca</h3>
        <span className="p-input-icon-left w-full">
          <i className="pi pi-search" />
          <InputText
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Trova velocemente le voci menù"
            className="w-full"
          />
        </span>
        <div className="mt-4 space-y-2">
          {results.length === 0 ? (
            <div className="text-sm text-neutral-400">Nessun risultato</div>
          ) : (
            <ul className="space-y-2">
              {results.map((r) => (
                <li key={`${r.cat.id}-${r.id}`}>
                  <a
                    href={`#${r.cat.id}`}
                    onClick={onHide}
                    className="text-sm"
                    title={r.cat.title}
                  >
                    <span className="font-medium">{r.name}</span>
                    <span className="text-neutral-400"> — {r.cat.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Sidebar>
  );
}

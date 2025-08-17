"use client";
import { useState } from "react";
import { useBadges } from "@/store/badgesStore";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import Image from "next/image";

export default function BadgesPanel() {
  const { badges, addBadge, removeBadge, updateBadge, resetDefaults } = useBadges();
  const [filter, setFilter] = useState("");
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("/icons/fresh.svg");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editIcon, setEditIcon] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const onPickIcon = async (file: File, setValue: (v: string) => void) => {
    const reader = new FileReader();
    return await new Promise<void>((resolve) => {
      reader.onload = () => { setValue(String(reader.result || "")); resolve(); };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="space-y-2">
      <div>
        <span className="text-sm">Cerca</span>
        <InputText value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Cerca badge" className="w-full mt-1" />
      </div>
      {/* Add badge */}
      <div className="border border-neutral-800 rounded p-2">
        <div className="text-sm mb-1">Aggiungi badge</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <InputText placeholder="Nome badge" value={name} onChange={(e) => setName(e.target.value)} />
          <div className="flex items-center gap-2">
            <InputText placeholder="Icona (path)" value={icon} onChange={(e) => setIcon(e.target.value)} className="flex-1" />
            <label className="text-xs px-2 py-1 border border-neutral-700 rounded cursor-pointer">
              Upload
              <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (f) await onPickIcon(f, setIcon); }} />
            </label>
          </div>
          <Button label="Aggiungi" onClick={() => { if (!name.trim()) return; addBadge(name.trim(), icon.trim(), description.trim() || undefined); setName(""); setIcon("/icons/fresh.svg"); setDescription(""); }} />
        </div>
        <InputText placeholder="Descrizione (opzionale)" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full mt-2" />
      </div>

      <ul className="space-y-2 max-h-[50vh] overflow-auto pr-1">
        {badges
          .filter((b) => {
            const q = filter.trim().toLowerCase();
            if (!q) return true;
            const hay = `${b.name} ${b.id}`.toLowerCase();
            return hay.includes(q);
          })
          .map((b) => (
          <li key={b.id} className="border border-neutral-800 rounded p-2">
            {editingId === b.id ? (
              <div className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div>
                    <label className="text-sm">Nome</label>
                    <InputText value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full mt-1" />
                  </div>
                  <div>
                    <label className="text-sm">Icona (path)</label>
                    <div className="flex items-center gap-2">
                      <InputText value={editIcon} onChange={(e) => setEditIcon(e.target.value)} className="w-full mt-1" />
                      <label className="text-xs px-2 py-1 border border-neutral-700 rounded cursor-pointer mt-1">
                        Upload
                        <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (f) await onPickIcon(f, setEditIcon); }} />
                      </label>
                    </div>
                  </div>
                  <div className="flex items-end gap-2">
                    <Button label="Annulla" text onClick={() => setEditingId(null)} />
                    <Button label="Salva" icon="pi pi-check" onClick={() => { updateBadge(b.id, { name: editName.trim() || b.name, icon: editIcon.trim() || b.icon, description: editDesc.trim() || undefined }); setEditingId(null); }} />
                  </div>
                </div>
                <InputText placeholder="Descrizione (opzionale)" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} className="w-full" />
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <Image src={b.icon} alt="" width={16} height={16} className="opacity-80" />
                  <div className="text-sm font-medium truncate">{b.name}</div>
                  <div className="text-xs text-neutral-500 truncate">id: {b.id}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button icon="pi pi-pencil" text onClick={() => { setEditingId(b.id); setEditName(b.name); setEditIcon(b.icon); setEditDesc(b.description || ""); }} />
                  <Button icon="pi pi-trash" text severity="danger" onClick={() => removeBadge(b.id)} />
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      <div className="flex justify-end">
        <Button icon="pi pi-refresh" text severity="secondary" onClick={resetDefaults} aria-label="Ripristina badge" />
      </div>
    </div>
  );
}

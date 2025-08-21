"use client";
import { useState } from "react";
import { useBadges } from "@/store/badgesStore";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import Image from "next/image";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { useRef } from "react";

export default function BadgesPanel() {
  const { badges, addBadge, removeBadge, updateBadge, resetDefaults } = useBadges();
  const [filter, setFilter] = useState("");
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("/icons/fresh.svg");
  const [description, setDescription] = useState("");
  const [bgColor, setBgColor] = useState<string>("#404040");
  const [textColor, setTextColor] = useState<string>("#ffffff");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editIcon, setEditIcon] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editBg, setEditBg] = useState<string>("#404040");
  const [editText, setEditText] = useState<string>("#ffffff");
  const [createErr, setCreateErr] = useState("");
  const [editErr, setEditErr] = useState("");
  const [confirm, setConfirm] = useState<{ open: boolean; id?: string; title?: string }>({ open: false });
  const toast = useRef<Toast | null>(null);

  const onPickIcon = async (file: File, setValue: (v: string) => void) => {
    const reader = new FileReader();
    return await new Promise<void>((resolve) => {
      reader.onload = () => { setValue(String(reader.result || "")); resolve(); };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="space-y-2">
      <Toast ref={toast} />
      <div>
        <span className="text-sm">Cerca</span>
        <InputText value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Cerca badge" className="w-full mt-1" />
      </div>
      <div className="border border-neutral-800 rounded p-2 flex items-center justify-between">
        <div className="text-sm">Badge</div>
        <Button label="Nuovo" icon="pi pi-plus" onClick={() => { setCreateErr(""); setShowCreateDialog(true); }} />
      </div>

      <ul className="space-y-2 overflow-auto pr-1">
        {badges
          .filter((b) => {
            const q = filter.trim().toLowerCase();
            if (!q) return true;
            const hay = `${b.name} ${b.id}`.toLowerCase();
            return hay.includes(q);
          })
          .map((b) => (
          <li key={b.id} className="border border-neutral-800 rounded p-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className="px-2 py-0.5 rounded-full inline-flex items-center gap-2" style={{ backgroundColor: b.bgColor || "#404040", color: b.textColor || "#ffffff" }}>
                  <Image src={b.icon} alt="" width={16} height={16} className="opacity-80" />
                  <span className="text-sm font-medium truncate">{b.name}</span>
                </span>
                <div className="text-xs text-neutral-500 truncate">id: {b.id}</div>
              </div>
              <div className="flex items-center gap-2">
                <Button icon="pi pi-pencil" text onClick={() => { setEditingId(b.id); setEditName(b.name); setEditIcon(b.icon); setEditDesc(b.description || ""); setEditErr(""); }} />
                <Button icon="pi pi-trash" text severity="danger" onClick={() => setConfirm({ open: true, id: b.id, title: b.name })} />
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex justify-end">
        <Button icon="pi pi-refresh" text severity="secondary" onClick={() => { resetDefaults(); toast.current?.show({ severity: "success", summary: "Badge ripristinati", life: 2000 }); }} aria-label="Ripristina badge" />
      </div>

      {/* Dialogs */}
      <Dialog header="Nuovo badge" visible={showCreateDialog} modal style={{ width: "34rem" }} onHide={() => setShowCreateDialog(false)}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <InputText placeholder="Nome badge" value={name} onChange={(e) => setName(e.target.value)} />
          <div className="flex items-center gap-2">
            <InputText placeholder="Icona (path)" value={icon} onChange={(e) => setIcon(e.target.value)} className="flex-1" />
            <label className="text-xs px-2 py-1 border border-neutral-700 rounded cursor-pointer">
              Upload
              <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (f) await onPickIcon(f, setIcon); }} />
            </label>
          </div>
          <div className="flex items-center gap-2">
            <InputText placeholder="Colore sfondo (#hex)" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
            <InputText placeholder="Colore testo (#hex)" value={textColor} onChange={(e) => setTextColor(e.target.value)} />
          </div>
          <Button label="Crea" onClick={() => {
            const trimmed = name.trim();
            if (!trimmed) { setCreateErr("Nome obbligatorio"); return; }
            if (badges.some(b => b.name.trim().toLowerCase() === trimmed.toLowerCase())) { setCreateErr("Nome già in uso"); return; }
            // using update after add to set colors (since addBadge currently doesn't accept colors)
            addBadge(trimmed, icon.trim(), description.trim() || undefined);
            const createdId = trimmed.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
            updateBadge(createdId, { bgColor, textColor });
            toast.current?.show({ severity: "success", summary: "Badge creato", detail: trimmed, life: 2000 });
            setName(""); setIcon("/icons/fresh.svg"); setDescription(""); setBgColor("#404040"); setTextColor("#ffffff"); setCreateErr(""); setShowCreateDialog(false);
          }} />
        </div>
        <InputText placeholder="Descrizione (opzionale)" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full mt-2" />
        {createErr && <div className="text-xs text-red-400 mt-2">{createErr}</div>}
      </Dialog>

      <Dialog header="Modifica badge" visible={editingId !== null} modal style={{ width: "34rem" }} onHide={() => setEditingId(null)}>
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
            <Button label="Salva" icon="pi pi-check" onClick={() => {
              if (!editingId) return;
              const trimmed = editName.trim();
              if (!trimmed) { setEditErr("Nome obbligatorio"); return; }
              if (badges.some(b => b.name.trim().toLowerCase() === trimmed.toLowerCase() && b.id !== editingId)) { setEditErr("Nome già in uso"); return; }
              updateBadge(editingId, { name: trimmed, icon: editIcon.trim(), description: editDesc.trim() || undefined, bgColor: editBg, textColor: editText });
              toast.current?.show({ severity: "success", summary: "Badge aggiornato", detail: trimmed, life: 2000 });
              setEditingId(null); setEditErr("");
            }} />
          </div>
        </div>
        <InputText placeholder="Descrizione (opzionale)" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} className="w-full mt-2" />
        <div className="grid grid-cols-2 gap-2 mt-2">
          <InputText placeholder="Colore sfondo (#hex)" value={editBg} onChange={(e) => setEditBg(e.target.value)} />
          <InputText placeholder="Colore testo (#hex)" value={editText} onChange={(e) => setEditText(e.target.value)} />
        </div>
        {editErr && <div className="text-xs text-red-400 mt-2">{editErr}</div>}
      </Dialog>
      <Dialog header="Conferma eliminazione" visible={confirm.open} modal style={{ width: "24rem" }} onHide={() => setConfirm({ open: false })}>
        <div className="text-sm">Eliminare &quot;{confirm.title}&quot;?</div>
        <div className="mt-4 flex justify-end gap-2">
          <Button label="Annulla" text onClick={() => setConfirm({ open: false })} />
          <Button label="Elimina" icon="pi pi-trash" severity="danger" onClick={() => { if (confirm.id) { removeBadge(confirm.id); toast.current?.show({ severity: "success", summary: "Badge rimosso", detail: confirm.title, life: 2000 }); } setConfirm({ open: false }); }} />
        </div>
      </Dialog>
    </div>
  );
}

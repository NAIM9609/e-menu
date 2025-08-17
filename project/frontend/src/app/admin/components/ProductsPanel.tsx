"use client";
import { useState, useEffect } from "react";
import { useMenu } from "@/store/menuStore";
import { useIngredients } from "@/store/ingredientsStore";
import { useBadges } from "@/store/badgesStore";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { MultiSelect } from "primereact/multiselect";
import type { MenuItem } from "@/data/menu";

export default function ProductsPanel() {
  const { categories, setCategories } = useMenu();
  const { ingredients } = useIngredients();
  const { badges } = useBadges();

  // simplified from the page, supports add/edit/remove and reorder
  const [catId, setCatId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | null>(null);
  const [itemBadges, setItemBadges] = useState<string[]>([]);
  const [baseIngs, setBaseIngs] = useState<string[]>([]);
  const [extras, setExtras] = useState<{ id: string; name: string; price: number }[]>([]);
  const [didMigrate, setDidMigrate] = useState(false);
  const [dragging, setDragging] = useState<{ catId: string; index: number } | null>(null);

  // category management
  const [newCatTitle, setNewCatTitle] = useState("");
  const [newCatSlug, setNewCatSlug] = useState("");
  const [catErrs, setCatErrs] = useState<{ title?: string; id?: string }>({});
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editErrs, setEditErrs] = useState<{ title?: string; id?: string }>({});

  useEffect(() => {
    if (!catId && categories[0]) setCatId(categories[0].id);
  }, [categories, catId]);

  const slugify = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

  // One-time migration for legacy baseIngredients (names -> IDs)
  useEffect(() => {
    if (didMigrate) return;
    if (!ingredients || ingredients.length === 0) return;
    // guard with localStorage flag to avoid repeated writes
    try {
      if (typeof window !== "undefined") {
        const flag = localStorage.getItem("e-menu:migr:baseIngToIds:v1");
        if (flag === "1") { setDidMigrate(true); return; }
      }
    } catch {}
    let changedAny = false;
    const nextCats = categories.map((c) => {
      let changedCat = false;
      const items = c.items.map((it) => {
        if (!it.baseIngredients || it.baseIngredients.length === 0) return it;
        const mapped = it.baseIngredients.map((v) => {
          if (ingredients.some((ing) => ing.id === v)) return v; // already id
          const found = ingredients.find((ing) => ing.name.toLowerCase() === String(v).toLowerCase());
          if (found) { changedCat = true; changedAny = true; return found.id; }
          return v;
        });
        if (changedCat) return { ...it, baseIngredients: mapped };
        return it;
      });
      return changedCat ? { ...c, items } : c;
    });
    if (changedAny) {
      setCategories(nextCats);
    }
    setDidMigrate(true);
    try { if (typeof window !== "undefined") localStorage.setItem("e-menu:migr:baseIngToIds:v1", "1"); } catch {}
  }, [categories, ingredients, didMigrate, setCategories]);

  const addCategory = () => {
    const errs: { title?: string; id?: string } = {};
    if (!newCatTitle.trim()) errs.title = "Titolo obbligatorio";
    const id = (newCatSlug.trim() || slugify(newCatTitle)).trim();
    if (!id) errs.id = "Slug obbligatorio";
    if (categories.some((c) => c.id === id)) errs.id = "Slug già in uso";
    setCatErrs(errs);
    if (Object.keys(errs).length) return;
    setCategories([...categories, { id, title: newCatTitle.trim(), items: [] }]);
    setNewCatTitle("");
    setNewCatSlug("");
  };

  const startEditCategory = (id: string) => {
    const cat = categories.find((c) => c.id === id);
    if (!cat) return;
    setEditingCatId(id);
    setEditTitle(cat.title);
    setEditSlug(cat.id);
    setEditErrs({});
  };

  const cancelEditCategory = () => {
    setEditingCatId(null);
    setEditErrs({});
  };

  const saveEditCategory = () => {
    if (!editingCatId) return;
    const errs: { title?: string; id?: string } = {};
    if (!editTitle.trim()) errs.title = "Titolo obbligatorio";
    const finalId = (editSlug.trim() || slugify(editTitle)).trim();
    if (!finalId) errs.id = "Slug obbligatorio";
    const taken = categories.some((c) => c.id === finalId && c.id !== editingCatId);
    if (taken) errs.id = "Slug già in uso";
    setEditErrs(errs);
    if (Object.keys(errs).length) return;
    setCategories(categories.map((c) => (c.id === editingCatId ? { ...c, id: finalId, title: editTitle.trim() } : c)));
    setEditingCatId(null);
  };

  const removeCategory = (id: string) => {
    setCategories(categories.filter((c) => c.id !== id));
  };

  const startCreate = (categoryId: string) => {
    setCatId(categoryId);
    setEditingId(null);
    setName("");
    setDescription("");
    setPrice(null);
    setItemBadges([]);
    setBaseIngs([]);
    setExtras([]);
  };

  const startEdit = (categoryId: string, item: MenuItem) => {
    setCatId(categoryId);
    setEditingId(item.id);
    setName(item.name || "");
    setDescription(item.description || "");
    const priceNum = typeof item.price === "number" ? item.price : item.price ? Number(item.price) : null;
    setPrice(Number.isFinite(priceNum || 0) ? (priceNum as number) : null);
    const bIds = (item.badges || []).map((v) => v);
    setItemBadges(bIds);
    const ids = (item.baseIngredients || []).map((v) => v);
    setBaseIngs(ids);
    setExtras(item.extras || []);
  };

  const save = () => {
    if (!catId) return;
    const payload: MenuItem = {
      id: editingId ?? slugify(name),
      name: name.trim(),
      description: description.trim() || undefined,
      price: price === null ? undefined : Number(price),
      badges: itemBadges.length ? itemBadges : undefined,
      baseIngredients: baseIngs.length ? baseIngs : undefined,
      extras: extras.length ? extras.map((e) => ({ id: e.id, name: e.name, price: Number(e.price) })) : undefined,
    };
    setCategories(categories.map((c) => {
      if (c.id !== catId) return c;
      if (editingId) return { ...c, items: c.items.map((it) => (it.id === editingId ? payload : it)) };
      let id = payload.id;
      let i = 2;
      while (c.items.some((it) => it.id === id)) id = `${payload.id}-${i++}`;
      return { ...c, items: [...c.items, { ...payload, id }] };
    }));
    setEditingId(null);
  };

  const remove = (categoryId: string, itemId: string) => {
    setCategories(categories.map((c) => (c.id === categoryId ? { ...c, items: c.items.filter((i) => i.id !== itemId) } : c)));
  };

  const move = (categoryId: string, from: number, to: number) => {
    setCategories(categories.map((c) => {
      if (c.id !== categoryId) return c;
      if (to < 0 || to >= c.items.length) return c;
      const items = [...c.items];
      const [moved] = items.splice(from, 1);
      items.splice(to, 0, moved);
      return { ...c, items };
    }));
  };

  const moveCategory = (from: number, to: number) => {
    if (to < 0 || to >= categories.length) return;
    const next = [...categories];
    const [m] = next.splice(from, 1);
    next.splice(to, 0, m);
    setCategories(next);
  };

  return (
    <div className="space-y-3">
      {/* add category */}
      <div className="border border-neutral-800 rounded p-3">
        <div className="font-semibold mb-2">Categorie</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div>
            <label className="text-sm">Titolo</label>
            <InputText value={newCatTitle} onChange={(e) => setNewCatTitle(e.target.value)} className="w-full mt-1" />
            {catErrs.title && <div className="text-xs text-red-400 mt-1">{catErrs.title}</div>}
          </div>
          <div>
            <label className="text-sm">Slug (opzionale)</label>
            <InputText value={newCatSlug} onChange={(e) => setNewCatSlug(e.target.value)} className="w-full mt-1" placeholder={slugify(newCatTitle)} />
            {catErrs.id && <div className="text-xs text-red-400 mt-1">{catErrs.id}</div>}
          </div>
          <div className="flex items-end">
            <Button label="Aggiungi Categoria" icon="pi pi-plus" onClick={addCategory} className="w-full md:w-auto" />
          </div>
        </div>
      </div>

      {categories.map((c, cIdx) => (
        <div key={c.id} className="border border-neutral-800 rounded p-3">
          <div className="flex items-center justify-between">
            <div className="font-semibold flex items-center gap-2">
              <span>{c.title}</span>
              {editingCatId !== c.id && (
                <Button icon="pi pi-pencil" text onClick={() => startEditCategory(c.id)} />
              )}
            </div>
            <div className="flex gap-2 items-center">
              <Button icon="pi pi-arrow-up" text disabled={cIdx === 0} onClick={() => moveCategory(cIdx, cIdx - 1)} />
              <Button icon="pi pi-arrow-down" text disabled={cIdx === categories.length - 1} onClick={() => moveCategory(cIdx, cIdx + 1)} />
              <Button label="Aggiungi" icon="pi pi-plus" text onClick={() => startCreate(c.id)} />
              <Button label="Rimuovi" icon="pi pi-trash" text severity="danger" onClick={() => removeCategory(c.id)} />
            </div>
          </div>
          {editingCatId === c.id && (
            <div className="mt-3 border border-neutral-800 rounded p-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="text-sm">Titolo</label>
                  <InputText value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full mt-1" />
                  {editErrs.title && <div className="text-xs text-red-400 mt-1">{editErrs.title}</div>}
                </div>
                <div>
                  <label className="text-sm">Slug</label>
                  <InputText value={editSlug} onChange={(e) => setEditSlug(e.target.value)} className="w-full mt-1" placeholder={slugify(editTitle)} />
                  {editErrs.id && <div className="text-xs text-red-400 mt-1">{editErrs.id}</div>}
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-3">
                <Button label="Annulla" text onClick={cancelEditCategory} />
                <Button label="Salva" icon="pi pi-check" onClick={saveEditCategory} />
              </div>
            </div>
          )}
          <ul className="mt-3 space-y-2">
            {c.items.map((it, idx) => (
              <li
                key={it.id}
                className="flex items-center justify-between rounded border border-neutral-800 p-2"
                draggable
                onDragStart={() => setDragging({ catId: c.id, index: idx })}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => { if (dragging && dragging.catId === c.id) { move(c.id, dragging.index, idx); } setDragging(null); }}
              >
                <div>
                  <div className="font-medium">{it.name}</div>
                </div>
                <div className="flex items-center gap-1">
                  <Button icon="pi pi-arrow-up" text disabled={idx === 0} onClick={() => move(c.id, idx, idx - 1)} />
                  <Button icon="pi pi-arrow-down" text disabled={idx === c.items.length - 1} onClick={() => move(c.id, idx, idx + 1)} />
                  <Button icon="pi pi-pencil" text onClick={() => startEdit(c.id, it)} />
                  <Button icon="pi pi-trash" text severity="danger" onClick={() => remove(c.id, it.id)} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* editor */}
      {(catId !== null) && (
        <div className="border border-neutral-800 rounded p-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Nome</label>
              <InputText value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1" />
            </div>
            <div>
              <label className="text-sm">Prezzo (€)</label>
              <InputNumber value={price} onValueChange={(e) => setPrice((e.value as number) ?? null)} className="w-full mt-1" inputClassName="w-full" min={0} mode="decimal" locale="it-IT" minFractionDigits={0} maxFractionDigits={2} />
            </div>
          </div>
          <div className="mt-3">
            <label className="text-sm">Descrizione</label>
            <InputTextarea autoResize value={description} onChange={(e) => setDescription(e.target.value)} className="w-full mt-1" rows={3} />
          </div>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Ingredienti base</label>
              <MultiSelect value={baseIngs} onChange={(e) => setBaseIngs(e.value as string[])} options={ingredients.map((ing) => ({ label: ing.name, value: ing.id }))} filter display="chip" placeholder="Seleziona ingredienti" className="w-full mt-1" />
            </div>
            <div>
              <label className="text-sm">Badge</label>
              <MultiSelect value={itemBadges} onChange={(e) => setItemBadges(e.value as string[])} options={badges.map((b) => ({ label: b.name, value: b.id }))} filter display="chip" placeholder="Seleziona badge" className="w-full mt-1" />
            </div>
          </div>
          <div className="mt-3">
            <label className="text-sm">Extra</label>
            <MultiSelect
              value={extras.map((ex) => ex.id)}
              onChange={(e) => {
                const ids = e.value as string[];
                const selected = ingredients.filter((ing) => ing.isExtra && ids.includes(ing.id)).map((ing) => ({ id: ing.id, name: ing.name, price: ing.defaultPrice }));
                setExtras(selected);
              }}
              options={ingredients.filter((ing) => ing.isExtra).map((ing) => ({ label: `${ing.name} (+€ ${ing.defaultPrice.toFixed(2)})`, value: ing.id }))}
              filter display="chip" placeholder="Seleziona extra" className="w-full mt-1"
            />
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <Button label="Annulla" text onClick={() => setEditingId(null)} />
            <Button label="Salva" icon="pi pi-check" onClick={save} />
          </div>
        </div>
      )}
    </div>
  );
}

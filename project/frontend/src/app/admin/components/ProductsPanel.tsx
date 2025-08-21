"use client";
import { useState, useRef } from "react";
import { useMenu } from "@/store/menuStore";
import { useIngredients } from "@/store/ingredientsStore";
import { useBadges } from "@/store/badgesStore";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { MultiSelect } from "primereact/multiselect";
import type { MenuItem } from "@/data/menu";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { Checkbox } from "primereact/checkbox";
import { SelectButton } from "primereact/selectbutton";
import { Dropdown } from "primereact/dropdown";
import { useI18n } from "@/i18n/i18n";

// Local helper types matching our data model
 type BuilderStep = {
  id: string;
  title: string;
  selection: "single" | "multi";
  ingredientIds: string[];
  required?: boolean;
  icon?: string;
  optionOverrides?: Record<string, number>;
};

type Item = MenuItem & {
  price: number;
  description?: string;
  allowBaseRemoval?: boolean;
  enabled?: boolean;
  baseIngredients?: string[];
  badges?: string[];
  extras?: Extra[];
};

type Category = {
  id: string;
  title: string;
  items: Item[];
  customBuilder?: {
    enabled?: boolean;
    label?: string;
    basePrice?: number;
    steps?: BuilderStep[];
  };
};

type Extra = { id: string; name: string; price: number };

const slugify = (s: string) =>
  (s || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export default function ProductsPanel() {
  const { t } = useI18n();
  const { categories, setCategories } = useMenu();
  const { ingredients } = useIngredients();
  const { badges } = useBadges();

  // Toast
  const toastRef = useRef<Toast | null>(null);

  // Filter
  const [filterMode, setFilterMode] = useState<"all" | "hidden" | "unavailable">("all");

  // Drag & drop reorder within a category
  const [dragging, setDragging] = useState<{ catId: string; index: number } | null>(null);

  // Create Category dialog
  const [showCreateCatDialog, setShowCreateCatDialog] = useState(false);
  const [newCatTitle, setNewCatTitle] = useState("");
  const [newCatSlug, setNewCatSlug] = useState("");
  const [catErrs, setCatErrs] = useState<{ title?: string; id?: string }>({});

  // Edit Category dialog
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editErrs, setEditErrs] = useState<{ title?: string; id?: string }>({});

  // Confirm dialog
  const [confirm, setConfirm] = useState<{ open: boolean; type?: "category" | "product"; categoryId?: string; itemId?: string; title?: string }>({ open: false });

  // Builder dialog
  const [builderDlg, setBuilderDlg] = useState<{ open: boolean; categoryId?: string }>({ open: false });
  const [builderLabel, setBuilderLabel] = useState("");
  const [builderBasePrice, setBuilderBasePrice] = useState<number>(0);
  const [builderSteps, setBuilderSteps] = useState<BuilderStep[]>([]);
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [stepTitle, setStepTitle] = useState("");
  const [stepSelection, setStepSelection] = useState<"single" | "multi">("single");
  const [stepIngs, setStepIngs] = useState<string[]>([]);
  const [stepRequired, setStepRequired] = useState(false);
  const [stepIcon, setStepIcon] = useState("");
  const [stepOverrides, setStepOverrides] = useState<Record<string, number>>({});
  const [stepCatFilter, setStepCatFilter] = useState<"all" | "base" | "extra" | "sauce">("all");

  // Item dialog
  const [showItemDialog, setShowItemDialog] = useState(false);
  const [catId, setCatId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | null>(0);
  const [description, setDescription] = useState("");
  const [allowBaseRemoval, setAllowBaseRemoval] = useState(true);
  const [enabled, setEnabled] = useState(true);
  const [baseIngs, setBaseIngs] = useState<string[]>([]);
  const [itemBadges, setItemBadges] = useState<string[]>([]);
  const [extras, setExtras] = useState<Extra[]>([]);
  const [fieldErr, setFieldErr] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [stock, setStock] = useState<number | null>(null);

  // Normalize image URLs entered by the admin so next/image won't throw on relative strings
  const normalizeImageUrl = (u?: string) => {
    if (!u) return undefined;
    const s = u.trim();
    if (!s) return undefined;
    if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("/") || s.startsWith("data:") || s.startsWith("blob:")) return s;
    // Assume local public asset path
    return "/" + s.replace(/^\/+/, "");
  };

  // Helpers
  const startCreate = (categoryId: string) => {
    setCatId(categoryId);
    setEditingId(null);
    setName("");
    setPrice(0);
    setDescription("");
    setAllowBaseRemoval(true);
    setEnabled(true);
    setBaseIngs([]);
    setItemBadges([]);
    setExtras([]);
    setFieldErr(null);
  setImageUrl("");
  setStock(null);
    setShowItemDialog(true);
  };

  const startEdit = (categoryId: string, it: Item) => {
    setCatId(categoryId);
    setEditingId(it.id);
    setName(it.name || "");
    setPrice(it.price ?? 0);
    setDescription(it.description || "");
    setAllowBaseRemoval(it.allowBaseRemoval ?? true);
    setEnabled(it.enabled ?? true);
    setBaseIngs(it.baseIngredients || []);
  setItemBadges((it.badges as string[]) || []);
  setExtras((it.extras as Extra[]) || []);
    setFieldErr(null);
  setImageUrl((it as Item).imageUrl || "");
  setStock((it as Item).stock ?? null);
    setShowItemDialog(true);
  };

  const cancelItem = () => {
    setShowItemDialog(false);
    setEditingId(null);
    setCatId(null);
    setFieldErr(null);
  };

  const save = () => {
    if (!catId) return;
    if (!name.trim()) {
      setFieldErr(t("validation.required"));
      return;
    }
    setFieldErr(null);

    const cats = categories as unknown as Category[];
    const nextCats = cats.map((c) => {
        if (c.id !== catId) return c;
        const nextItems = [...c.items];
        if (editingId) {
          const idx = nextItems.findIndex((i) => i.id === editingId);
          if (idx >= 0) {
            nextItems[idx] = {
              ...nextItems[idx],
              name: name.trim(),
              price: Number(price || 0),
              description: description || undefined,
              allowBaseRemoval,
              enabled,
              baseIngredients: baseIngs,
              badges: itemBadges,
              extras,
              imageUrl: normalizeImageUrl(imageUrl),
              stock: stock ?? undefined,
            } as Item;
          }
        } else {
          let base = slugify(name);
          if (!base) base = `item-${Date.now()}`;
          let id = base;
          let i = 2;
          while (nextItems.some((it) => it.id === id)) id = `${base}-${i++}`;
          const newItem: Item = {
            id,
            name: name.trim(),
            price: Number(price || 0),
            description: description || undefined,
            allowBaseRemoval,
            enabled,
            baseIngredients: baseIngs,
            badges: itemBadges,
            extras,
            imageUrl: normalizeImageUrl(imageUrl),
            stock: stock ?? undefined,
          };
          nextItems.push(newItem);
        }
        return { ...c, items: nextItems } as Category;
      });
    setCategories(nextCats as unknown as typeof categories);
    setShowItemDialog(false);
    setEditingId(null);
    setCatId(null);
    toastRef.current?.show({ severity: "success", summary: t("toast.saved"), life: 1500 });
  };

  const remove = (categoryId: string, itemId: string) => {
  const cats = categories as unknown as Category[];
  const next = cats.map((c) => (c.id === categoryId ? { ...c, items: c.items.filter((i) => i.id !== itemId) } : c));
  setCategories(next as unknown as typeof categories);
    toastRef.current?.show({ severity: "success", summary: t("toast.removed"), life: 1500 });
  };

  const move = (categoryId: string, from: number, to: number) => {
    if (from === to) return;
    const cats = categories as unknown as Category[];
    const next = cats.map((c) => {
      if (c.id !== categoryId) return c;
      const arr = [...c.items];
      const [m] = arr.splice(from, 1);
      arr.splice(to, 0, m);
      return { ...c, items: arr };
    });
    setCategories(next as unknown as typeof categories);
  };

  const moveCategory = (from: number, to: number) => {
    if (from === to) return;
  const arr = [...(categories as unknown as Category[])];
    const [m] = arr.splice(from, 1);
    arr.splice(to, 0, m);
  setCategories(arr as unknown as typeof categories);
  };

  const removeCategory = (categoryId: string) => {
  const cats = categories as unknown as Category[];
  setCategories(cats.filter((c) => c.id !== categoryId) as unknown as typeof categories);
  };

  const startEditCategory = (categoryId: string) => {
  const cat = (categories as unknown as Category[]).find((c) => c.id === categoryId);
    if (!cat) return;
    setEditingCatId(categoryId);
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
    if (!editTitle.trim()) errs.title = t("validation.required");
    const slug = slugify(editSlug || editTitle);
    if (!slug) errs.id = t("validation.required");
    if ((categories as Category[]).some((c) => c.id === slug && c.id !== editingCatId)) {
      errs.id = t("validation.duplicate");
    }
    setEditErrs(errs);
    if (Object.keys(errs).length) return;
  const cats = categories as unknown as Category[];
  const next = cats.map((c) => (c.id === editingCatId ? { ...c, id: slug, title: editTitle.trim() } : c));
  setCategories(next as unknown as typeof categories);
    setEditingCatId(null);
    toastRef.current?.show({ severity: "success", summary: t("toast.saved"), life: 1500 });
  };

  const handleCreateCategory = () => {
    const errs: { title?: string; id?: string } = {};
    if (!newCatTitle.trim()) errs.title = t("validation.required");
    const slug = slugify(newCatSlug || newCatTitle);
    if (!slug) errs.id = t("validation.required");
    if ((categories as Category[]).some((c) => c.id === slug)) {
      errs.id = t("validation.duplicate");
    }
    setCatErrs(errs);
    if (Object.keys(errs).length) return;
    const next: Category = { id: slug, title: newCatTitle.trim(), items: [] };
  const cats = categories as unknown as Category[];
  setCategories([...(cats as Category[]), next] as unknown as typeof categories);
    setShowCreateCatDialog(false);
    setNewCatTitle("");
    setNewCatSlug("");
    setCatErrs({});
    toastRef.current?.show({ severity: "success", summary: t("toast.created"), life: 1500 });
  };

  return (
    <div className="space-y-3">
      <Toast ref={toastRef} />
      {/* header + new category button */}
      <div className="border border-neutral-800 rounded p-3">
        <div className="flex items-center justify-between">
          <div className="font-semibold">{t("admin.categories")}</div>
          <Button label={t("admin.newCategory")} icon="pi pi-plus" onClick={() => setShowCreateCatDialog(true)} tooltip={t("admin.newCategory")} />
        </div>
      </div>

      {/* Products filter */}
      <div className="border border-neutral-800 rounded p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="font-semibold">{t("admin.filter")}</div>
          <SelectButton
            value={filterMode}
            onChange={(e) => setFilterMode(e.value as typeof filterMode)}
            options={[
              { label: t("admin.filter.all"), value: "all" },
              { label: t("admin.filter.hidden"), value: "hidden" },
              { label: t("admin.filter.unavailable"), value: "unavailable" },
            ]}
            allowEmpty={false}
            aria-label={t("admin.filter")}
            tooltip={t("admin.filter")}
          />
        </div>
      </div>

      {(categories as Category[]).map((c, cIdx) => {
        const filteringActive = filterMode !== "all";
        const filtered = c.items.filter((it) => {
          if (filterMode === "all") return true;
          if (filterMode === "hidden") return it.enabled === false;
          const ids = it.baseIngredients || [];
          const missing = ids.some((id) => ingredients.find((ing) => ing.id === id)?.available === false);
          return missing;
        });
        if (filteringActive && filtered.length === 0) return null;
        return (
          <div key={c.id} className="border border-neutral-800 rounded p-3">
            <div className="flex items-center justify-between">
              <div className="font-semibold flex items-center gap-2">
                <span>{c.title}</span>
                {editingCatId !== c.id && (
                  <Button icon="pi pi-pencil" text onClick={() => startEditCategory(c.id)} />
                )}
              </div>
              <div className="flex gap-2 items-center">
                <Button icon="pi pi-arrow-up" text disabled={cIdx === 0} onClick={() => moveCategory(cIdx, cIdx - 1)} tooltip={t("admin.edit")} />
                <Button icon="pi pi-arrow-down" text disabled={cIdx === categories.length - 1} onClick={() => moveCategory(cIdx, cIdx + 1)} tooltip={t("admin.edit")} />
                <Button label={t("admin.add")} icon="pi pi-plus" text onClick={() => startCreate(c.id)} tooltip={t("admin.add")} />
                <Button label={t("admin.remove")} icon="pi pi-trash" text severity="danger" onClick={() => setConfirm({ open: true, type: "category", categoryId: c.id, title: c.title })} tooltip={t("admin.delete")} />
              </div>
            </div>

            {/* Custom builder controls */}
            <div className="mt-2 flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  inputId={`builder-${c.id}`}
                  checked={!!c.customBuilder?.enabled}
                  onChange={(e) => {
                    const enabled = !!e.checked;
                    {
                      const cats = categories as unknown as Category[];
                      const next = cats.map((cat) =>
                        cat.id === c.id
                          ? {
                              ...cat,
                              customBuilder: {
                                enabled,
                                label: cat.customBuilder?.label || t("admin.builder.defaultLabel"),
                                basePrice: cat.customBuilder?.basePrice || 0,
                                steps: cat.customBuilder?.steps || [],
                              },
                            }
                          : cat
                      );
                      setCategories(next as unknown as typeof categories);
                    }
                  }}
                />
                <span>{t("admin.builder.toggle")}</span>
              </label>
              <div className="flex items-center gap-2">
                <Button
                  label={t("admin.builder.configure")}
                  icon="pi pi-sliders-h"
                  text
                  disabled={!c.customBuilder?.enabled}
                  onClick={() => {
                    setBuilderDlg({ open: true, categoryId: c.id });
                    setBuilderLabel(c.customBuilder?.label || t("admin.builder.defaultLabel"));
                    setBuilderBasePrice(typeof c.customBuilder?.basePrice === "number" ? c.customBuilder!.basePrice! : 0);
                    setBuilderSteps((c.customBuilder?.steps as BuilderStep[]) || []);
                    setEditingStepId(null);
                    setStepTitle("");
                    setStepSelection("single");
                    setStepIngs([]);
                    setStepRequired(false);
                    setStepIcon("");
                    setStepOverrides({});
                  }}
                />
              </div>
            </div>

            <ul className="mt-3 space-y-2">
              {(filteringActive ? filtered : c.items).map((it, idx) => (
                <li
                  key={it.id}
                  className="flex items-center justify-between rounded border border-neutral-800 p-2"
                  draggable={!filteringActive}
                  onDragStart={() => {
                    if (!filteringActive) setDragging({ catId: c.id, index: idx });
                  }}
                  onDragOver={(e) => {
                    if (!filteringActive) e.preventDefault();
                  }}
                  onDrop={() => {
                    if (!filteringActive && dragging && dragging.catId === c.id) {
                      move(c.id, dragging.index, idx);
                    }
                    setDragging(null);
                  }}
                >
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      <span>{it.name}</span>
                      {it.enabled === false && (
                        <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700 text-xs">
                          {t("admin.filter.hidden")}
                        </span>
                      )}
                      {(() => {
                        const ids = it.baseIngredients || [];
                        const missingIds = ids.filter((id) => ingredients.find((ing) => ing.id === id)?.available === false);
                        if (missingIds.length === 0) return null;
                        const missingNames = missingIds.map((id) => ingredients.find((ing) => ing.id === id)?.name || id);
                        return (
                          <span
                            className="px-2 py-0.5 rounded-full bg-red-900/40 text-red-300 border border-red-800 text-xs"
                            title={t("menu.missingIngredients", { list: missingNames.join(", ") })}
                          >
                            {t("admin.filter.unavailable")}
                          </span>
                        );
                      })()}
                      {(() => {
                        // Sold-out by product stock
                        const item = it as Item;
                        if (typeof item?.stock === "number" && item.stock >= 0 && item.stock === 0) {
                          return (
                            <span className="px-2 py-0.5 rounded-full bg-amber-900/30 text-amber-200 border border-amber-700 text-xs" title={t("menu.limitReachedTooltip")}>
                              {t("menu.soldOut")}
                            </span>
                          );
                        }
                        // Ingredient-level sold-out reference
                        const base = (item.baseIngredients || []).filter(Boolean);
                        const depleted = base.filter((bid) => {
                          const ing = ingredients.find((i) => i.id === bid);
                          return typeof ing?.stock === "number" && ing.stock >= 0 && ing.stock === 0;
                        });
                        if (depleted.length === 0) return null;
                        const names = depleted.map((id) => ingredients.find((i) => i.id === id)?.name || id);
                        return (
                          <span className="px-2 py-0.5 rounded-full bg-amber-900/30 text-amber-200 border border-amber-700 text-xs" title={t("menu.outOfStockIngredients", { list: names.join(", ") })}>
                            {t("menu.soldOut")}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button icon="pi pi-arrow-up" text disabled={filteringActive || idx === 0} onClick={() => move(c.id, idx, idx - 1)} tooltip={t("admin.edit")} />
                    <Button icon="pi pi-arrow-down" text disabled={filteringActive || idx === c.items.length - 1} onClick={() => move(c.id, idx, idx + 1)} tooltip={t("admin.edit")} />
                    <Button icon="pi pi-pencil" text onClick={() => startEdit(c.id, it)} tooltip={t("admin.edit")} />
                    <Button icon="pi pi-trash" text severity="danger" onClick={() => setConfirm({ open: true, type: "product", categoryId: c.id, itemId: it.id, title: it.name })} tooltip={t("admin.delete")} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      })}

      {/* Empty state for filter */}
      {filterMode !== "all" &&
        (categories as Category[]).every((c) =>
          c.items.every((it) => {
            if (filterMode === "hidden") return it.enabled !== false;
            const ids = it.baseIngredients || [];
            const missing = ids.some((id) => ingredients.find((ing) => ing.id === id)?.available === false);
            return !missing;
          })
        ) && <div className="text-sm text-neutral-400 px-2">{t("admin.productsFilter.empty")}</div>}

      {/* Dialogs */}
      <Dialog
        header={t("admin.builder.dialogTitle")}
        visible={builderDlg.open}
        style={{ width: "48rem" }}
        modal
        onHide={() => setBuilderDlg({ open: false })}
      >
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="text-sm">{t("admin.label")}</label>
              <InputText value={builderLabel} onChange={(e) => setBuilderLabel(e.target.value)} className="w-full mt-1" />
            </div>
            <div>
              <label className="text-sm">{t("admin.basePrice")}</label>
              <InputNumber value={builderBasePrice} onValueChange={(e) => setBuilderBasePrice((e.value as number) ?? 0)} className="w-full mt-1" inputClassName="w-full" min={0} mode="decimal" locale="it-IT" minFractionDigits={0} maxFractionDigits={2} />
            </div>
          </div>

          <div className="border border-neutral-800 rounded p-3">
            <div className="font-semibold mb-2">{t("admin.steps")}</div>
            <ul className="space-y-2">
              {builderSteps.map((s, idx) => (
                <li key={s.id} className="flex items-center justify-between p-2 rounded border border-neutral-800">
                  <div className="text-sm">
                    <div className="font-medium">{s.title}</div>
                    <div className="text-xs text-neutral-400">{s.selection === "single" ? t("admin.step.single") : t("admin.step.multi")} • opzioni: {s.ingredientIds.length}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button icon="pi pi-arrow-up" text disabled={idx === 0} onClick={() => setBuilderSteps((prev) => { const arr = [...prev]; const [m] = arr.splice(idx, 1); arr.splice(idx - 1, 0, m); return arr; })} tooltip="Sposta su" />
                    <Button icon="pi pi-arrow-down" text disabled={idx === builderSteps.length - 1} onClick={() => setBuilderSteps((prev) => { const arr = [...prev]; const [m] = arr.splice(idx, 1); arr.splice(idx + 1, 0, m); return arr; })} tooltip="Sposta giù" />
                    <Button icon="pi pi-pencil" text onClick={() => { setEditingStepId(s.id); setStepTitle(s.title); setStepSelection(s.selection); setStepIngs(s.ingredientIds); setStepRequired(!!s.required); setStepIcon(s.icon || ""); setStepOverrides(s.optionOverrides || {}); }} tooltip={t("admin.tooltip.step.edit")} />
                    <Button icon="pi pi-trash" text severity="danger" onClick={() => setBuilderSteps((prev) => prev.filter((x) => x.id !== s.id))} tooltip={t("admin.tooltip.step.delete")} />
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-neutral-800 mt-3 pt-3">
              <div className="font-medium mb-2">{editingStepId ? t("admin.step.edit") : t("admin.step.add")}</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="text-sm">{t("admin.title")}</label>
                  <InputText value={stepTitle} onChange={(e) => setStepTitle(e.target.value)} className="w-full mt-1" placeholder={t("admin.placeholder.stepTitle")} />
                </div>
                <div>
                  <label className="text-sm">Selezione</label>
                  <Dropdown className="w-full mt-1" options={[{ label: "Singola", value: "single" }, { label: "Multipla", value: "multi" }]} value={stepSelection} onChange={(e) => setStepSelection(e.value)} />
                </div>
                <div className="md:col-span-3">
                  <div className="flex items-end justify-between gap-3">
                    <div className="flex-1">
                      <label className="text-sm">{t("admin.step.options")}</label>
                    </div>
                    <div className="w-48">
                      <label className="text-xs text-neutral-400">{t("admin.category")}</label>
                      <Dropdown
                        className="w-full mt-1"
                        options={[
                          { label: t("admin.filter.all"), value: "all" },
                          { label: t("ingredients.group.base"), value: "base" },
                          { label: t("ingredients.group.extra"), value: "extra" },
                          { label: t("ingredients.group.sauce"), value: "sauce" },
                        ]}
                        value={stepCatFilter}
                        onChange={(e) => setStepCatFilter(e.value)}
                      />
                    </div>
                  </div>
                  {(() => {
                    type GKey = "base" | "extra" | "sauce";
                    const grouped: Record<GKey, { label: string; items: { label: string; value: string }[] }> = {
                      base: { label: t("ingredients.group.base"), items: [] },
                      extra: { label: t("ingredients.group.extra"), items: [] },
                      sauce: { label: t("ingredients.group.sauce"), items: [] },
                    };
                    for (const ing of ingredients) {
                      const inBase = ing.canBeBase !== false;
                      const inExtra = !!ing.isExtra;
                      const inSauce = !!ing.isSauce;
                      if (inBase) grouped.base.items.push({ label: ing.name, value: ing.id });
                      if (inExtra) grouped.extra.items.push({ label: ing.name, value: ing.id });
                      if (inSauce) grouped.sauce.items.push({ label: ing.name, value: ing.id });
                    }
                    const groupsArr = (Object.keys(grouped) as GKey[])
                      .filter((k) => (stepCatFilter === "all" ? true : k === stepCatFilter))
                      .map((k) => ({ label: grouped[k].label, items: grouped[k].items }));
                    return (
                      <MultiSelect
                        value={stepIngs}
                        onChange={(e) => setStepIngs(e.value as string[])}
                        options={groupsArr}
                        optionGroupLabel="label"
                        optionGroupChildren="items"
                        filter
                        display="chip"
                        placeholder={t("admin.placeholder.selectOptions")}
                        className="w-full mt-1"
                      />
                    );
                  })()}
                </div>
                <div className="md:col-span-1">
                  <label className="text-sm">{t("admin.step.required")}</label>
                  <div className="mt-1">
                    <Checkbox checked={stepRequired} onChange={(e) => setStepRequired(!!e.checked)} />
                    <span className="ml-2 text-sm">Richiedi almeno una scelta</span>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm">{t("admin.step.icon")}</label>
                  <InputText value={stepIcon} onChange={(e) => setStepIcon(e.target.value)} className="w-full mt-1" placeholder="Es. 🍕" />
                </div>
                <div className="md:col-span-3">
                  <label className="text-sm">{t("admin.step.customPrices")}</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {stepIngs.map((id) => {
                      const ing = ingredients.find((i) => i.id === id);
                      if (!ing) return null;
                      return (
                        <div key={id} className="flex items-center gap-2 border border-neutral-800 rounded px-2 py-1">
                          <span className="text-xs">{ing.name}</span>
                          <InputNumber value={stepOverrides[id] ?? null} onValueChange={(e) => setStepOverrides((prev) => ({ ...prev, [id]: (e.value as number) ?? 0 }))} inputClassName="w-24" min={0} mode="decimal" locale="it-IT" minFractionDigits={0} maxFractionDigits={2} placeholder={`€ ${ing.defaultPrice.toFixed(2)}`} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-3">
                {editingStepId ? (
                  <>
                    <Button label={t("admin.cancel")} text onClick={() => { setEditingStepId(null); setStepTitle(""); setStepSelection("single"); setStepIngs([]); setStepRequired(false); setStepIcon(""); setStepOverrides({}); }} />
                    <Button label={t("admin.save")} icon="pi pi-check" onClick={() => {
                      if (!editingStepId) return;
                      const next = builderSteps.map((s) => s.id === editingStepId ? { ...s, title: stepTitle.trim() || s.title, selection: stepSelection, ingredientIds: stepIngs, required: stepRequired, icon: stepIcon || undefined, optionOverrides: Object.keys(stepOverrides).length ? stepOverrides : undefined } : s);
                      setBuilderSteps(next);
                      setEditingStepId(null); setStepTitle(""); setStepSelection("single"); setStepIngs([]); setStepRequired(false); setStepIcon(""); setStepOverrides({});
                    }} />
                  </>
                ) : (
                  <Button label={t("admin.step.add")} icon="pi pi-plus" onClick={() => {
                    if (!stepTitle.trim()) return;
                    const base = slugify(stepTitle);
                    let id = base || `step-${Date.now()}`;
                    let i = 2;
                    while (builderSteps.some((s) => s.id === id)) id = `${base}-${i++}`;
                    setBuilderSteps([...builderSteps, { id, title: stepTitle.trim(), selection: stepSelection, ingredientIds: stepIngs, required: stepRequired, icon: stepIcon || undefined, optionOverrides: Object.keys(stepOverrides).length ? stepOverrides : undefined }]);
                    setStepTitle(""); setStepSelection("single"); setStepIngs([]); setStepRequired(false); setStepIcon(""); setStepOverrides({});
                  }} />
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button label={t("admin.cancel")} text onClick={() => setBuilderDlg({ open: false })} />
            <Button label={t("admin.save")} icon="pi pi-check" onClick={() => {
              if (!builderDlg.categoryId) return;
              const cats = categories as unknown as Category[];
              const next = cats.map((c) => (c.id === builderDlg.categoryId ? { ...c, customBuilder: { enabled: true, label: builderLabel.trim() || t("admin.builder.defaultLabel"), basePrice: Number(builderBasePrice || 0), steps: builderSteps } } : c));
              setCategories(next as unknown as typeof categories);
              setBuilderDlg({ open: false });
            }} />
          </div>
        </div>
      </Dialog>

      <Dialog
        header={t("admin.newCategory")}
        visible={showCreateCatDialog}
        style={{ width: "34rem" }}
        modal
        onHide={() => setShowCreateCatDialog(false)}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <label className="text-sm">{t("admin.title")}</label>
            <InputText value={newCatTitle} onChange={(e) => setNewCatTitle(e.target.value)} className={`w-full mt-1 ${catErrs.title ? "p-invalid" : ""}`} />
            {catErrs.title && <div className="text-xs text-red-400 mt-1">{catErrs.title}</div>}
          </div>
          <div>
            <label className="text-sm">{t("admin.slug")}</label>
            <InputText value={newCatSlug} onChange={(e) => setNewCatSlug(e.target.value)} className={`w-full mt-1 ${catErrs.id ? "p-invalid" : ""}`} placeholder={slugify(newCatTitle)} />
            {catErrs.id && <div className="text-xs text-red-400 mt-1">{catErrs.id}</div>}
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button label={t("admin.cancel")} text onClick={() => setShowCreateCatDialog(false)} />
          <Button label={t("admin.create")} icon="pi pi-check" onClick={handleCreateCategory} />
        </div>
      </Dialog>

      <Dialog
        header={t("admin.delete")}
        visible={confirm.open}
        style={{ width: "24rem" }}
        modal
        onHide={() => setConfirm({ open: false })}
      >
        <div className="text-sm">Eliminare &quot;{confirm.title}&quot;?</div>
        <div className="mt-4 flex justify-end gap-2">
          <Button label={t("admin.cancel")} text onClick={() => setConfirm({ open: false })} />
          <Button
            label={t("admin.delete")}
            icon="pi pi-trash"
            severity="danger"
            onClick={() => {
              if (confirm.type === "category" && confirm.categoryId) {
                const cat = (categories as unknown as Category[]).find((c) => c.id === confirm.categoryId);
                removeCategory(confirm.categoryId);
                toastRef.current?.show({ severity: "success", summary: "Categoria rimossa", detail: cat?.title, life: 2000 });
              } else if (confirm.type === "product" && confirm.categoryId && confirm.itemId) {
                remove(confirm.categoryId, confirm.itemId);
              }
              setConfirm({ open: false });
            }}
          />
        </div>
      </Dialog>

      <Dialog
        header={t("admin.edit")}
        visible={editingCatId !== null}
        style={{ width: "34rem" }}
        modal
        onHide={cancelEditCategory}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <label className="text-sm">{t("admin.title")}</label>
            <InputText value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className={`w-full mt-1 ${editErrs.title ? "p-invalid" : ""}`} />
            {editErrs.title && <div className="text-xs text-red-400 mt-1">{editErrs.title}</div>}
          </div>
          <div>
            <label className="text-sm">{t("admin.slug")}</label>
            <InputText value={editSlug} onChange={(e) => setEditSlug(e.target.value)} className={`w-full mt-1 ${editErrs.id ? "p-invalid" : ""}`} placeholder={slugify(editTitle)} />
            {editErrs.id && <div className="text-xs text-red-400 mt-1">{editErrs.id}</div>}
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button label={t("admin.cancel")} text onClick={cancelEditCategory} />
          <Button label={t("admin.save")} icon="pi pi-check" onClick={saveEditCategory} />
        </div>
      </Dialog>

      <Dialog
        header={editingId ? t("product.edit") : t("product.new")}
        visible={showItemDialog && catId !== null}
        style={{ width: "48rem" }}
        modal
        onHide={cancelItem}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm">{t("product.name")}</label>
            <InputText value={name} onChange={(e) => setName(e.target.value)} className={`w-full mt-1 ${fieldErr ? "p-invalid" : ""}`} />
          </div>
          <div>
            <label className="text-sm">{t("product.price")}</label>
            <InputNumber value={price} onValueChange={(e) => setPrice((e.value as number) ?? null)} className="w-full mt-1" inputClassName="w-full" min={0} mode="decimal" locale="it-IT" minFractionDigits={0} maxFractionDigits={2} />
          </div>
        </div>
        <div className="mt-3">
          <label className="text-sm">{t("product.description")}</label>
          <InputTextarea autoResize value={description} onChange={(e) => setDescription(e.target.value)} className="w-full mt-1" rows={3} />
        </div>
        <div className="mt-3">
          <label className="text-sm">Image URL</label>
          <InputText value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full mt-1" placeholder="https://..." />
        </div>
        <div className="mt-3">
          <label className="text-sm">Stock (limite, opzionale)</label>
          <InputNumber value={stock} onValueChange={(e) => setStock((e.value as number) ?? null)} className="w-full mt-1" inputClassName="w-full" min={0} mode="decimal" locale="it-IT" minFractionDigits={0} maxFractionDigits={0} placeholder="nessun limite" />
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Checkbox inputId="allowBaseRemoval" checked={allowBaseRemoval} onChange={(e) => setAllowBaseRemoval(!!e.checked)} />
          <label htmlFor="allowBaseRemoval" className="text-sm">{t("product.allowBaseRemoval")}</label>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Checkbox inputId="enabled" checked={enabled} onChange={(e) => setEnabled(!!e.checked)} />
          <label htmlFor="enabled" className="text-sm">{t("product.enabled")}</label>
        </div>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm">{t("product.baseIngredients")}</label>
            <MultiSelect value={baseIngs} onChange={(e) => setBaseIngs(e.value as string[])} options={ingredients.filter((ing) => ing.canBeBase !== false).map((ing) => ({ label: ing.name, value: ing.id }))} filter display="chip" placeholder={t("admin.placeholder.selectIngredients")} className="w-full mt-1" />
          </div>
          <div>
            <label className="text-sm">{t("product.badges")}</label>
            <MultiSelect value={itemBadges} onChange={(e) => setItemBadges(e.value as string[])} options={badges.map((b) => ({ label: b.name, value: b.id }))} filter display="chip" placeholder={t("admin.placeholder.selectBadges")} className="w-full mt-1" />
          </div>
        </div>
        <div className="mt-3">
          <label className="text-sm">{t("product.extras")}</label>
          <MultiSelect
            value={extras.map((ex) => ex.id)}
            onChange={(e) => {
              const ids = e.value as string[];
              const selected = ingredients
                .filter((ing) => ing.isExtra && ids.includes(ing.id))
                .map((ing) => ({ id: ing.id, name: ing.name, price: ing.defaultPrice }));
              setExtras(selected);
            }}
            options={ingredients
              .filter((ing) => ing.isExtra)
              .map((ing) => ({ label: `${ing.name} (+€ ${ing.defaultPrice.toFixed(2)})`, value: ing.id }))}
            filter
            display="chip"
            placeholder={t("admin.placeholder.selectExtras")}
            className="w-full mt-1"
          />
        </div>
        {fieldErr && <div className="text-xs text-red-400 mt-2">{fieldErr}</div>}
        <div className="mt-4 flex justify-end gap-2">
          <Button label={t("admin.cancel")} text onClick={cancelItem} />
          <Button label={t("admin.save")} icon="pi pi-check" onClick={save} />
        </div>
      </Dialog>
    </div>
  );
}

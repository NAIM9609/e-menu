"use client";
import { useRef, useState } from "react";
import { useIngredients } from "@/store/ingredientsStore";
import { useMenu } from "@/store/menuStore";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { SelectButton } from "primereact/selectbutton";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { useI18n } from "@/i18n/i18n";

export default function IngredientsPanel() {
  const { ingredients, addIngredient, removeIngredient, updateIngredient, resetDefaults } = useIngredients();
  const { categories, setCategories } = useMenu();
  const { t } = useI18n();
  const [ingFilter, setIngFilter] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | null>(null);
  const [stockNew, setStockNew] = useState<number | null>(null);
  const [isExtraNew, setIsExtraNew] = useState(true);
  const [canBeBaseNew, setCanBeBaseNew] = useState(true);
  const [canBeExtraNew, setCanBeExtraNew] = useState(true);
  const [isSauceNew, setIsSauceNew] = useState(false);
  const [availableNew, setAvailableNew] = useState(true);
  const [kindNew, setKindNew] = useState<"food" | "beverage" | "sauce">("food");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editIsExtra, setEditIsExtra] = useState(true);
  const [editCanBeBase, setEditCanBeBase] = useState(true);
  const [editCanBeExtra, setEditCanBeExtra] = useState(true);
  const [editIsSauce, setEditIsSauce] = useState(false);
  const [editAvailable, setEditAvailable] = useState(true);
  const [editPrice, setEditPrice] = useState<number | null>(null);
  const [editStock, setEditStock] = useState<number | null>(null);
  const [editKind, setEditKind] = useState<"food" | "beverage" | "sauce">("food");
  const [createErr, setCreateErr] = useState("");
  const [editErr, setEditErr] = useState("");
  const toast = useRef<Toast | null>(null);
  const [confirm, setConfirm] = useState<{ open: boolean; id?: string; title?: string }>({ open: false });
  const [availabilityDlg, setAvailabilityDlg] = useState<{
    open: boolean;
    id?: string;
    name?: string;
    toAvailable?: boolean;
    cascade?: boolean;
  }>({ open: false });
  const [impactCount, setImpactCount] = useState<number>(0);
  // Filters
  const [availabilityFilter, setAvailabilityFilter] = useState<"all" | "available" | "unavailable">("all");
  const [catFilter, setCatFilter] = useState<"all" | "base" | "extra" | "sauce">("all");
  const [domainFilter, setDomainFilter] = useState<"all" | "food" | "beverage" | "sauce">("all");

  return (
    <div className="space-y-2">
      <Toast ref={toast} />
      <div>
        <span className="text-sm">{t("ingredients.search")}</span>
        <InputText value={ingFilter} onChange={(e) => setIngFilter(e.target.value)} placeholder={t("ingredients.searchPlaceholder")} className="w-full mt-1" />
      </div>
      <div className="border border-neutral-800 rounded p-2 flex items-center justify-between">
        <div className="text-sm">{t("ingredients.title")}</div>
        <Button label={t("ingredients.new")} icon="pi pi-plus" onClick={() => setShowCreateDialog(true)} tooltip={t("ingredients.new.tooltip")} />
      </div>
      {/* Filters (similar to products) */}
      <div className="border border-neutral-800 rounded p-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="font-semibold">{t("admin.filter")}</div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-300">{t("ingredients.available")}</span>
              <SelectButton
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.value as typeof availabilityFilter)}
                options={[
                  { label: t("admin.filter.all"), value: "all" },
                  { label: t("ingredients.available"), value: "available" },
                  { label: t("admin.filter.unavailable"), value: "unavailable" },
                ]}
                allowEmpty={false}
                aria-label={t("admin.filter")}
                tooltip={t("admin.filter")}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-300">{t("admin.category")}</span>
              <SelectButton
                value={catFilter}
                onChange={(e) => setCatFilter(e.value as typeof catFilter)}
                options={[
                  { label: t("admin.filter.all"), value: "all" },
                  { label: t("ingredients.group.base"), value: "base" },
                  { label: t("ingredients.group.extra"), value: "extra" },
                  { label: t("ingredients.group.sauce"), value: "sauce" },
                ]}
                allowEmpty={false}
                aria-label={t("admin.category")}
                tooltip={t("admin.category")}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-300">Tipo</span>
              <SelectButton
                value={domainFilter}
                onChange={(e) => setDomainFilter(e.value as typeof domainFilter)}
                options={[
                  { label: t("admin.filter.all"), value: "all" },
                  { label: "Cibo", value: "food" },
                  { label: "Bevanda", value: "beverage" },
                  { label: "Salsa", value: "sauce" },
                ]}
                allowEmpty={false}
                aria-label="Tipo ingrediente"
                tooltip="Tipo ingrediente"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-4 overflow-auto pr-1">
        {(() => {
          const q = ingFilter.trim().toLowerCase();
          const matches = (ing: typeof ingredients[number]) => {
            if (!q) return true;
            const hay = `${ing.name} ${ing.id}`.toLowerCase();
            return hay.includes(q);
          };
          const matchesDomain = (ing: typeof ingredients[number]) => {
            if (domainFilter === "all") return true;
            return (ing.kind ?? (ing.isSauce ? "sauce" : "food")) === domainFilter;
          };
          const matchesAvailability = (ing: typeof ingredients[number]) => {
            if (availabilityFilter === "all") return true;
            const isAvail = ing.available !== false;
            return availabilityFilter === "available" ? isAvail : !isAvail;
          };
          // Classify each ingredient into a single category to avoid duplicates across groups.
          type GKey = "base" | "extra" | "sauce";
          const grouped: Record<GKey, typeof ingredients> = { base: [], extra: [], sauce: [] };
          for (const ing of ingredients) {
            if (!matches(ing) || !matchesAvailability(ing) || !matchesDomain(ing)) continue;
            let key: GKey | null = null;
            if (ing.isSauce) key = "sauce"; // sauces first (highest priority)
            else if (ing.isExtra) key = "extra"; // extras take precedence over base when marked as extra
            else if (ing.canBeBase !== false) key = "base"; // then base
            else if (ing.canBeExtra !== false) key = "extra"; // fallback to extras if explicitly allowed
            if (key) grouped[key].push(ing);
          }
          const groups: { key: GKey; title: string; items: typeof ingredients; color: string }[] = [
            { key: "base" as GKey, title: t("ingredients.group.base"), items: grouped.base, color: "text-sky-300" },
            { key: "extra" as GKey, title: t("ingredients.group.extra"), items: grouped.extra, color: "text-emerald-300" },
            { key: "sauce" as GKey, title: t("ingredients.group.sauce"), items: grouped.sauce, color: "text-orange-300" },
          ].filter((g: { key: GKey }) => (catFilter === "all" ? true : g.key === catFilter));
          const any = groups.some((g) => g.items.length > 0);
          if (!any) return <div className="text-sm text-neutral-400">{t("ingredients.empty")}</div>;
          return groups.map((g) => (
            <section key={g.key}>
              <h3 className={`text-xs uppercase tracking-wider mb-1 ${g.color}`}>{g.title}</h3>
              <ul className="space-y-2">
                {g.items.map((ing) => (
                  <li key={ing.id} className="border border-neutral-800 rounded p-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{ing.name}</div>
                        <div className="text-xs text-neutral-400">id: {ing.id} • tipo: {ing.kind || (ing.isSauce ? "sauce" : "food")}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-neutral-400 flex items-center gap-2">
                          {ing.available === false && (
                            <span className="px-2 py-0.5 rounded-full bg-red-900/40 text-red-300 border border-red-800">{t("menu.unavailable")}</span>
                          )}
                          {t("ingredients.baseShort")}: <span className="text-neutral-200">{ing.canBeBase !== false ? t("common.yes") : t("common.no")}</span>
                          <span className="mx-1">•</span>
                          {t("ingredients.extraShort")}: <span className="text-neutral-200">{ing.isExtra ? t("common.yes") : t("common.no")}</span>
                          <span className="mx-1">•</span>
                          {t("ingredients.sauceShort")}: <span className="text-neutral-200">{ing.isSauce ? t("common.yes") : t("common.no")}</span>
                          <span className="mx-1">•</span>
                          {t("ingredients.priceShort")}: <span className="text-neutral-200">€ {ing.defaultPrice.toFixed(2)}</span>
                          {typeof ing.stock === "number" && (
                            <>
                              <span className="mx-1">•</span>
                              <span className="text-neutral-400">Stock:</span> <span className="text-neutral-200">{ing.stock}</span>
                            </>
                          )}
                        </div>
                        <Button
                          icon={ing.available === false ? "pi pi-check-circle" : "pi pi-ban"}
                          text
                          severity={ing.available === false ? "success" : "secondary"}
                          onClick={() => {
                            const currentAvailable = ing.available !== false;
                            const toAvailable = !currentAvailable;
                            const count = categories.reduce((acc, c) => acc + c.items.filter(it => (it.baseIngredients || []).includes(ing.id)).length, 0);
                            setImpactCount(count);
                            setAvailabilityDlg({ open: true, id: ing.id, name: ing.name, toAvailable, cascade: false });
                          }}
                          aria-label={ing.available === false ? t("ingredients.makeAvailable") : t("ingredients.markUnavailable")}
                          tooltip={ing.available === false ? t("ingredients.makeAvailable") : t("ingredients.markUnavailable")}
                        />
                        <Button icon="pi pi-pencil" text onClick={() => { setEditingId(ing.id); setEditName(ing.name); setEditIsExtra(ing.isExtra); setEditCanBeBase(ing.canBeBase !== false); setEditCanBeExtra(ing.canBeExtra !== false); setEditIsSauce(!!ing.isSauce); setEditAvailable(ing.available !== false); setEditPrice(ing.defaultPrice); setEditKind(((ing.kind as "food" | "beverage" | "sauce") ?? (ing.isSauce ? "sauce" : "food"))); setEditErr(""); }} tooltip={t("ingredients.edit.tooltip")} />
                        <Button icon="pi pi-trash" text severity="danger" onClick={() => setConfirm({ open: true, id: ing.id, title: ing.name })} tooltip={t("ingredients.delete.tooltip")} />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ));
        })()}
      </div>
      <div className="flex justify-end">
        <Button icon="pi pi-refresh" text severity="secondary" onClick={() => { resetDefaults(); toast.current?.show({ severity: "success", summary: t("ingredients.reset.toast"), life: 2000 }); }} aria-label={t("ingredients.reset")} tooltip={t("ingredients.reset.tooltip")} />
      </div>

      {/* Dialogs */}
      <Dialog header={t("ingredients.create.title")} visible={showCreateDialog} modal style={{ width: "28rem" }} onHide={() => setShowCreateDialog(false)}>
        <div className="flex flex-col gap-3">
          <InputText placeholder={t("ingredients.name")} value={name} onChange={(e) => setName(e.target.value)} className={createErr ? "p-invalid" : undefined} />
          <label className="flex items-center gap-2 text-sm">
            <Checkbox inputId="isExtraNew" checked={isExtraNew} onChange={(e) => setIsExtraNew(!!e.checked)} />
            <span>{t("ingredients.isExtra")}</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox inputId="canBeBaseNew" checked={canBeBaseNew} onChange={(e) => setCanBeBaseNew(!!e.checked)} />
            <span>{t("ingredients.canBeBase")}</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox inputId="canBeExtraNew" checked={canBeExtraNew} onChange={(e) => setCanBeExtraNew(!!e.checked)} />
            <span>{t("ingredients.canBeExtra")}</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox inputId="isSauceNew" checked={isSauceNew} onChange={(e) => setIsSauceNew(!!e.checked)} />
            <span>{t("ingredients.isSauce")}</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox inputId="availableNew" checked={availableNew} onChange={(e) => setAvailableNew(!!e.checked)} />
            <span>{t("ingredients.available")}</span>
          </label>
          <div className="flex items-center gap-2 text-sm">
            <span>Tipo</span>
            <SelectButton
              value={kindNew}
              onChange={(e) => setKindNew(e.value)}
              options={[
                { label: "Cibo", value: "food" },
                { label: "Bevanda", value: "beverage" },
                { label: "Salsa", value: "sauce" },
              ]}
              allowEmpty={false}
            />
          </div>
          <div>
            <label className="text-xs">{t("ingredients.defaultExtraPrice")}</label>
            <InputNumber value={price} onValueChange={(e) => setPrice((e.value as number) ?? null)} className="w-full" inputClassName={`w-full ${createErr ? "p-invalid" : ""}`} min={0} mode="decimal" locale="it-IT" minFractionDigits={0} maxFractionDigits={2} />
          </div>
          <div>
            <label className="text-xs">Stock (limite, opzionale)</label>
            <InputNumber value={stockNew} onValueChange={(e) => setStockNew((e.value as number) ?? null)} className="w-full" inputClassName="w-full" min={0} mode="decimal" locale="it-IT" minFractionDigits={0} maxFractionDigits={0} placeholder="nessun limite" />
          </div>
          {createErr && <div className="text-xs text-red-400">{createErr}</div>}
          <div className="flex justify-end gap-2">
            <Button label={t("admin.cancel")} text onClick={() => setShowCreateDialog(false)} />
            <Button label={t("admin.create")} icon="pi pi-check" onClick={() => {
              const trimmed = name.trim();
              if (!trimmed) { setCreateErr(t("validation.name.required")); return; }
              const p = Number(price ?? 0);
              if (p < 0) { setCreateErr(t("validation.price.negative")); return; }
              // duplicate name check (case-insensitive)
              if (ingredients.some(i => i.name.trim().toLowerCase() === trimmed.toLowerCase())) { setCreateErr(t("validation.name.duplicate")); return; }
              addIngredient(trimmed, { isExtra: isExtraNew, defaultPrice: p, available: availableNew, canBeBase: canBeBaseNew, canBeExtra: canBeExtraNew, isSauce: isSauceNew, stock: stockNew ?? undefined, kind: kindNew });
              toast.current?.show({ severity: "success", summary: t("ingredients.toast.created"), detail: trimmed, life: 2000 });
              setName(""); setPrice(null); setStockNew(null); setIsExtraNew(true); setCanBeBaseNew(true); setCanBeExtraNew(true); setIsSauceNew(false); setAvailableNew(true); setCreateErr(""); setShowCreateDialog(false);
            }} />
          </div>
        </div>
      </Dialog>

      <Dialog header={t("ingredients.edit.title")} visible={editingId !== null} modal style={{ width: "28rem" }} onHide={() => setEditingId(null)}>
        <div className="flex flex-col gap-3">
          <InputText placeholder={t("ingredients.name")} value={editName} onChange={(e) => setEditName(e.target.value)} className={editErr ? "p-invalid" : undefined} />
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={editIsExtra} onChange={(e) => setEditIsExtra(!!e.checked)} />
            <span>{t("ingredients.isExtra")}</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={editCanBeBase} onChange={(e) => setEditCanBeBase(!!e.checked)} />
            <span>{t("ingredients.canBeBase")}</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={editCanBeExtra} onChange={(e) => setEditCanBeExtra(!!e.checked)} />
            <span>{t("ingredients.canBeExtra")}</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={editIsSauce} onChange={(e) => setEditIsSauce(!!e.checked)} />
            <span>{t("ingredients.isSauce")}</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={editAvailable} onChange={(e) => setEditAvailable(!!e.checked)} />
            <span>{t("ingredients.available")}</span>
          </label>
          <div className="flex items-center gap-2 text-sm">
            <span>Tipo</span>
            <SelectButton
              value={editKind}
              onChange={(e) => setEditKind(e.value)}
              options={[
                { label: "Cibo", value: "food" },
                { label: "Bevanda", value: "beverage" },
                { label: "Salsa", value: "sauce" },
              ]}
              allowEmpty={false}
            />
          </div>
          <div>
            <label className="text-xs">{t("ingredients.defaultExtraPrice")}</label>
            <InputNumber value={editPrice} onValueChange={(e) => setEditPrice((e.value as number) ?? null)} className="w-full" inputClassName={`w-full ${editErr ? "p-invalid" : ""}`} min={0} mode="decimal" locale="it-IT" minFractionDigits={0} maxFractionDigits={2} />
          </div>
          <div>
            <label className="text-xs">Stock (limite, opzionale)</label>
            <InputNumber value={editStock} onValueChange={(e) => setEditStock((e.value as number) ?? null)} className="w-full" inputClassName="w-full" min={0} mode="decimal" locale="it-IT" minFractionDigits={0} maxFractionDigits={0} placeholder="nessun limite" />
          </div>
          {editErr && <div className="text-xs text-red-400">{editErr}</div>}
          <div className="flex justify-end gap-2">
            <Button label={t("admin.cancel")} text onClick={() => setEditingId(null)} />
            <Button label={t("admin.save")} icon="pi pi-check" onClick={() => {
              if (!editingId) return;
              const trimmed = editName.trim();
              if (!trimmed) { setEditErr(t("validation.name.required")); return; }
              const p = Number(editPrice ?? 0);
              if (p < 0) { setEditErr(t("validation.price.negative")); return; }
              if (ingredients.some(i => i.name.trim().toLowerCase() === trimmed.toLowerCase() && i.id !== editingId)) { setEditErr(t("validation.name.duplicate")); return; }
              updateIngredient(editingId, { name: trimmed, isExtra: editIsExtra, defaultPrice: p, available: editAvailable, canBeBase: editCanBeBase, canBeExtra: editCanBeExtra, isSauce: editIsSauce, stock: editStock ?? undefined, kind: editKind });
              toast.current?.show({ severity: "success", summary: t("ingredients.toast.updated"), detail: trimmed, life: 2000 });
              setEditingId(null); setEditErr("");
            }} />
          </div>
        </div>
      </Dialog>
      <Dialog header={t("confirm.delete.title")} visible={confirm.open} modal style={{ width: "24rem" }} onHide={() => setConfirm({ open: false })}>
        <div className="text-sm">{t("confirm.delete.message", { name: String(confirm.title || "") })}</div>
        <div className="mt-4 flex justify-end gap-2">
          <Button label={t("admin.cancel")} text onClick={() => setConfirm({ open: false })} />
          <Button label={t("admin.delete")} icon="pi pi-trash" severity="danger" onClick={() => { if (confirm.id) { removeIngredient(confirm.id); toast.current?.show({ severity: "success", summary: t("ingredients.toast.deleted"), detail: confirm.title, life: 2000 }); } setConfirm({ open: false }); }} />
        </div>
      </Dialog>

      {/* Toggle availability + cascade to products */}
      <Dialog
        header={t("ingredients.availability.title")}
        visible={availabilityDlg.open}
        modal
        style={{ width: "28rem" }}
        onHide={() => setAvailabilityDlg({ open: false })}
      >
        <div className="space-y-3 text-sm">
          <div>
            {availabilityDlg.toAvailable === false ? (
              <>
                {t("ingredients.availability.toUnavailable", { name: String(availabilityDlg.name || "") })}
                <div className="text-xs text-neutral-400 mt-1">{t("ingredients.availability.affected.count", { count: impactCount })}</div>
              </>
            ) : (
              <>
                {t("ingredients.availability.toAvailable", { name: String(availabilityDlg.name || "") })}
                <div className="text-xs text-neutral-400 mt-1">{t("ingredients.availability.affected.visible", { count: impactCount })}</div>
              </>
            )}
          </div>
          <label className="flex items-center gap-2">
            <Checkbox
              checked={!!availabilityDlg.cascade}
              onChange={(e) => setAvailabilityDlg((p) => ({ ...p, cascade: !!e.checked }))}
            />
            <span>
              {availabilityDlg.toAvailable === false
                ? t("ingredients.availability.cascade.hide")
                : t("ingredients.availability.cascade.show")}
            </span>
          </label>
          <div className="text-xs text-neutral-400">{t("ingredients.availability.hint")}</div>
          <div className="flex justify-end gap-2 pt-2">
            <Button label={t("admin.cancel")} text onClick={() => setAvailabilityDlg({ open: false })} />
            <Button
              label={t("admin.confirm")}
              icon="pi pi-check"
              onClick={() => {
                const id = availabilityDlg.id!;
                const setAvail = availabilityDlg.toAvailable !== false; // true if we are making available
                updateIngredient(id, { available: setAvail });
                if (availabilityDlg.cascade) {
                  const updatedIngredients = ingredients.map((x) => x.id === id ? { ...x, available: setAvail } : x);
                  setCategories(
                    categories.map((c) => ({
                      ...c,
                      items: c.items.map((it) => {
                        const uses = (it.baseIngredients || []).includes(id);
                        if (!uses) return it;
                        if (!setAvail) {
                          // making ingredient unavailable -> hide product
                          return { ...it, enabled: false };
                        } else {
                          // making ingredient available -> only re-enable if no other missing base ing
                          const hasOtherMissing = (it.baseIngredients || []).some((bid) => {
                            const ing = updatedIngredients.find((x) => x.id === bid);
                            return ing ? ing.available === false : false;
                          });
                          return hasOtherMissing ? it : { ...it, enabled: true };
                        }
                      }),
                    }))
                  );
                }
                toast.current?.show({ severity: "success", summary: t("ingredients.availability.toast"), detail: availabilityDlg.name, life: 2000 });
                setAvailabilityDlg({ open: false });
              }}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}

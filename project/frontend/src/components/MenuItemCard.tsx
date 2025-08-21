"use client";
import { Button } from "primereact/button";
import { useCart } from "@/context/CartContext";
import { useEffect, useMemo, useState } from "react";
import { Dialog } from "primereact/dialog";
import { useIngredients } from "@/store/ingredientsStore";
import { useBadges } from "@/store/badgesStore";
import Image from "next/image";
import { useMenu } from "@/store/menuStore";
import type { MenuItem as MenuItemType } from "@/data/menu";
import { useI18n } from "@/i18n/i18n";

type Props = {
  id?: string;
  name: string;
  description?: string;
  price?: number | string;
  badges?: string[];
  baseIngredients?: string[];
  extras?: { id: string; name: string; price: number }[];
  allowBaseRemoval?: boolean;
  imageUrl?: string;
  stock?: number | null;
};

export default function MenuItemCard({ id, name, description, price, badges, baseIngredients, extras, allowBaseRemoval, imageUrl, stock }: Props) {
  const { addItem, items } = useCart();
  const { ingredients } = useIngredients();
  const { badges: allBadges } = useBadges();
  const { t } = useI18n();
  const [pulse, setPulse] = useState(false);
  const [open, setOpen] = useState(false);
  const [removed, setRemoved] = useState<string[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  // menu data for ingredient stock calculations across cart
  const { categories } = useMenu();

  const numericPrice = useMemo(() => (typeof price === "number" ? price : undefined), [price]);
  const resolveId = useMemo(() => id ?? name.toLowerCase().replace(/\s+/g, "-"), [id, name]);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | undefined;
    if (pulse) {
      t = setTimeout(() => setPulse(false), 950); // keep in sync with slower badge-fly animation
    }
    return () => t && clearTimeout(t);
  }, [pulse]);
  const safeBase = useMemo(() => baseIngredients ?? [], [baseIngredients]);
  const resolvedBase = useMemo(() =>
    safeBase.map((key) => {
      const found = ingredients.find((ing) => ing.id === key);
      return { key, label: found ? found.name : key };
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(safeBase), ingredients]
  );
  const safeExtrasRaw = useMemo(() => extras ?? [], [extras]);
  const safeExtras = useMemo(() => {
    return safeExtrasRaw.filter((ex) => {
      const ing = ingredients.find((i) => i.id === ex.id);
      return ing ? (ing.available !== false) && !!ing.isExtra : true;
    });
  }, [safeExtrasRaw, ingredients]);

  const missingBase = useMemo(() => {
    if (!safeBase.length) return [] as string[];
    return safeBase.filter((id) => ingredients.find((ing) => ing.id === id)?.available === false);
  }, [safeBase, ingredients]);
  const hasMissingBase = missingBase.length > 0;

  const canRemoveBase = allowBaseRemoval !== false; // default true
  // Normalize URL for rendering and decide if it's a local/public asset
  const normUrl = useMemo(() => {
    const raw = (imageUrl || "").trim();
    if (!raw) return undefined as string | undefined;
    // Treat known placeholders as empty
    const isLegacyPlaceholder = ["/file.svg", "/window.svg", "/globe.svg", "/next.svg", "/vercel.svg"].includes(raw);
    if (isLegacyPlaceholder) return undefined as string | undefined;
    if (raw.startsWith("http://") || raw.startsWith("https://") || raw.startsWith("data:") || raw.startsWith("blob:")) return raw;
    return raw.startsWith("/") ? raw : "/" + raw.replace(/^\/+/, "");
  }, [imageUrl]);
  const [imgError, setImgError] = useState(false);
  const isRemote = !!normUrl && (normUrl.startsWith("http://") || normUrl.startsWith("https://"));
  // Stock-aware UI: compute whether adding one more would exceed limits
  const currentQtyForThis = useMemo(() => items.filter((x) => x.baseId === resolveId).reduce((s, it) => s + it.qty, 0), [items, resolveId]);
  const productStockReached = useMemo(() => typeof stock === "number" && stock >= 0 ? currentQtyForThis >= stock : false, [stock, currentQtyForThis]);
  const blockingIngredients = useMemo(() => {
    // Consider base ingredients and currently selected extras
    const baseIds = (baseIngredients ?? []).filter(Boolean);
    const extraIds = (selectedExtras ?? []).filter(Boolean);
    const needIds = Array.from(new Set<string>([...baseIds, ...extraIds]));
    if (needIds.length === 0) return [] as string[];
    // Build a helper to find a menu item by baseId for cart lines
    const findMenuItem = (baseId: string | undefined): MenuItemType | undefined => {
      if (!baseId) return undefined;
      for (const c of categories) {
        const found = (c.items as MenuItemType[]).find((it) => it.id === baseId);
        if (found) return found;
      }
      return undefined;
    };
    const over: string[] = [];
    for (const ingId of needIds) {
      const ing = ingredients.find((i) => i.id === ingId);
      if (!(typeof ing?.stock === "number" && ing.stock >= 0)) continue;
      const used = items.reduce((sum, line) => {
        const menuItem = findMenuItem(line.baseId);
        const usesBase = Array.isArray(menuItem?.baseIngredients) ? (menuItem.baseIngredients as string[]).includes(ingId) : false;
        const usesExtra = (line.extras ?? []).some((e) => e.id === ingId);
        return sum + ((usesBase || usesExtra) ? line.qty : 0);
      }, 0);
      if (used + 1 > (ing.stock as number)) {
        over.push(ing.name);
      }
    }
    return over;
  }, [baseIngredients, selectedExtras, items, ingredients, categories]);
  const cannotAdd = hasMissingBase || productStockReached || (blockingIngredients.length > 0);
  const limitTooltip = useMemo(() => {
    if (hasMissingBase) return t("menu.notAvailableTooltip");
    if (productStockReached && blockingIngredients.length === 0) return t("menu.limitReachedTooltip");
    if (blockingIngredients.length > 0) return t("menu.outOfStockIngredients", { list: blockingIngredients.join(", ") });
    return t("menu.addToBill");
  }, [hasMissingBase, productStockReached, blockingIngredients, t]);
  return (
    <>
    <div className={`border border-neutral-800 rounded-lg p-3 flex items-start justify-between gap-3 bg-black/20 ${cannotAdd ? "opacity-60" : ""}`}>
      {normUrl && !imgError && (
        <div className="shrink-0">
          {isRemote ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={normUrl} alt="" width={56} height={56} className="rounded-md ring-1 ring-amber-500/30 bg-neutral-900 object-cover" onError={() => setImgError(true)} />
          ) : (
            <Image src={normUrl} alt="" width={56} height={56} className="rounded-md ring-1 ring-amber-500/30 bg-neutral-900 object-cover" onError={() => setImgError(true)} />
          )}
        </div>
      )}
      {(!normUrl || imgError) && (
        <div className="shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/placeholder-food.svg" alt="" width={56} height={56} className="rounded-md ring-1 ring-amber-500/30 bg-neutral-900 object-cover" />
        </div>
      )}
      <div
        className="flex-1 cursor-pointer"
        onClick={() => {
          if (hasMissingBase) return;
          const canOpen = (resolvedBase.length > 0) || (safeExtras.length > 0);
          if (canOpen) setOpen(true);
        }}
      >
        <div className="font-semibold text-base text-white">{name}</div>
        {description && (
          <div className="text-sm text-neutral-300 mt-1 leading-snug">{description}</div>
        )}
        {hasMissingBase && (
          <div
            className="mt-2 text-xs px-2 py-0.5 inline-block rounded-full bg-red-900/40 text-red-300 border border-red-800"
            title={t("menu.missingIngredients", { list: missingBase
              .map((id) => ingredients.find((ing) => ing.id === id)?.name || id)
              .join(", ") })}
          >
            {t("menu.unavailable")}
          </div>
        )}
        {!hasMissingBase && (productStockReached || blockingIngredients.length > 0) && (
          <div
            className="mt-2 text-xs px-2 py-0.5 inline-block rounded-full bg-amber-900/30 text-amber-200 border border-amber-700"
            title={limitTooltip}
          >
            {t("menu.soldOut")}
          </div>
        )}
        {badges && badges.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {badges.map((bid) => {
              const meta = allBadges.find((x) => x.id === bid) || allBadges.find((x) => x.name.toLowerCase() === String(bid).toLowerCase());
              return (
                <span
                  key={bid}
                  className="px-2 py-0.5 text-xs rounded-full capitalize inline-flex items-center gap-1 border border-neutral-700"
                  style={{ backgroundColor: meta?.bgColor || "#404040", color: meta?.textColor || "#ffffff" }}
                  title={meta?.description}
                >
                  {meta?.icon && <Image src={meta.icon} alt="" width={12} height={12} className="opacity-80" />}
                  {meta?.name || bid}
                </span>
              );
            })}
          </div>
        )}
      </div>
      <div className="text-right shrink-0 flex flex-col items-end gap-2">
        {price !== undefined && (
          <div className="text-foreground font-semibold">
            {typeof price === "number" ? `€ ${price.toFixed(2)}` : price}
          </div>
        )}
        <div className="flex gap-2">
          <Button
            size="small"
            label={pulse ? t("menu.added") : t("menu.addToBill")}
            icon={pulse ? "pi pi-check" : "pi pi-plus"}
            className={(pulse ? "btn-pulse p-button-info" : "p-button-success p-button-outlined")}
            badge={pulse ? "+1" : undefined}
            badgeClassName={pulse ? "badge-fly bg-emerald-500 text-black" : undefined}
            disabled={cannotAdd}
            tooltip={limitTooltip}
            onClick={() => {
              addItem({ id: resolveId, name, price: numericPrice, removedIngredients: removed, extras: safeExtras.filter(e => selectedExtras.includes(e.id)) });
              setPulse(true);
            }}
          />
          {(!hasMissingBase) && (((resolvedBase.length > 0) || safeExtras.length > 0)) && (
            <Button size="small" label={t("menu.customize")} text onClick={() => setOpen(true)} tooltip={t("menu.customizeTip")} />
          )}
        </div>
      </div>
    </div>

    {/* Customization dialog */}
    <Dialog
      header={name}
      visible={open}
      style={{ width: "32rem" }}
      modal
      onHide={() => setOpen(false)}
    >
  <div className="space-y-4">
        {normUrl && !imgError && (
          <div className="w-full flex justify-center">
            {isRemote ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={normUrl} alt={name} className="max-w-full h-auto rounded-md ring-1 ring-amber-500/30 bg-neutral-900" onError={() => setImgError(true)} />
            ) : (
              <Image src={normUrl} alt={name} width={0} height={0} sizes="100vw" style={{ width: "100%", height: "auto" }} className="rounded-md ring-1 ring-amber-500/30 bg-neutral-900" onError={() => setImgError(true)} />
            )}
          </div>
        )}
        {(!normUrl || imgError) && (
          <div className="w-full flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/placeholder-food.svg" alt="" className="max-w-full h-auto rounded-md ring-1 ring-amber-500/30 bg-neutral-900" />
          </div>
        )}
        {description && (
          <div className="text-sm text-neutral-300 leading-snug">{description}</div>
        )}
        {badges && badges.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {badges.map((bid) => {
              const meta = allBadges.find((x) => x.id === bid) || allBadges.find((x) => x.name.toLowerCase() === String(bid).toLowerCase());
              return (
                <span
                  key={bid}
                  className="px-2 py-0.5 text-xs rounded-full capitalize inline-flex items-center gap-1 border border-neutral-700"
                  style={{ backgroundColor: meta?.bgColor || "#404040", color: meta?.textColor || "#ffffff" }}
                  title={meta?.description}
                >
                  {meta?.icon && <Image src={meta.icon} alt="" width={12} height={12} className="opacity-80" />}
                  {meta?.name || bid}
                </span>
              );
            })}
          </div>
        )}
    {resolvedBase.length > 0 && (
          <div>
            <div className="font-medium mb-2">{t("menu.ingredients")}</div>
            {canRemoveBase ? (
              <div className="text-xs text-neutral-400 mb-2">{t("menu.tip.remove")}</div>
            ) : (
              <div className="text-xs text-neutral-400 mb-2">{t("menu.tip.cannotRemove")}</div>
            )}
            <div className="flex flex-wrap gap-2">
      {resolvedBase.map(({ key, label }) => {
                if (!canRemoveBase) {
                  return (
                    <span key={key} className="text-sm px-2 py-1 rounded border border-neutral-600 text-neutral-200">
                      {label}
                    </span>
                  );
                }
                const isRemoved = removed.includes(key);
                return (
                  <button
                    key={key}
                    className={`text-sm px-2 py-1 rounded border ${
                      isRemoved ? "border-red-400 text-red-300" : "border-neutral-600 text-neutral-200"
                    }`}
                    onClick={() => {
                      setRemoved((prev) =>
                        prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]
                      );
                    }}
                  >
          {isRemoved ? t("menu.removePrefix") : ""}
                    {label}
                  </button>
                );
              })}
            </div>
            {canRemoveBase && removed.length > 0 && (
              <div className="mt-2 text-xs text-neutral-400">
        {t("menu.removedListHint", { list: removed.map((k) => {
                  const f = ingredients.find((ing) => ing.id === k);
                  return f ? f.name : k;
        }).join(", ") })}
              </div>
            )}
          </div>
        )}

    {safeExtras.length > 0 && (
          <div>
            <div className="font-medium mb-2">{t("menu.extras")}</div>
            <div className="text-xs text-neutral-400 mb-2">{t("menu.tip.extras")}</div>
            <div className="flex flex-wrap gap-2">
      {safeExtras.map((ex) => {
                const active = selectedExtras.includes(ex.id);
                return (
                  <button
                    key={ex.id}
                    className={`text-sm px-2 py-1 rounded border ${
                      active ? "border-emerald-400 text-emerald-300" : "border-neutral-600 text-neutral-200"
                    }`}
                    onClick={() => {
                      setSelectedExtras((prev) =>
                        prev.includes(ex.id) ? prev.filter((x) => x !== ex.id) : [...prev, ex.id]
                      );
                    }}
                  >
                    {ex.name} (+€ {ex.price.toFixed(2)})
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button label={t("menu.dialog.close")} text onClick={() => setOpen(false)} tooltip={t("menu.dialog.closeTip")} />
      <Button
            label={t("menu.dialog.confirm")}
            icon="pi pi-cart-plus"
            tooltip={limitTooltip}
            disabled={cannotAdd}
            onClick={() => {
        const removedToUse = canRemoveBase ? removed : [];
        addItem({ id: resolveId, name, price: numericPrice, removedIngredients: removedToUse, extras: safeExtras.filter(e => selectedExtras.includes(e.id)) });
              setOpen(false);
              setPulse(true);
            }}
          />
        </div>
      </div>
    </Dialog>
    </>
  );
}

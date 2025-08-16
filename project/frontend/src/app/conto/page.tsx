"use client";
import { useCart } from "@/context/CartContext";
import { Button } from "primereact/button";
import { RadioButton } from "primereact/radiobutton";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ContoPage() {
  const { items, increment, decrement, removeItem, removeExtra, totalAmount } = useCart();
  const [payment, setPayment] = useState<"cassa" | "online">("cassa");

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-30 backdrop-blur bg-black/50 border-b border-neutral-800">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-neutral-300 hover:text-white">
            <i className="pi pi-arrow-left" />
          </Link>
          <h1 className="text-lg font-semibold">Conto</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-4 space-y-4">
        {items.length === 0 ? (
          <div className="text-neutral-300">Nessun elemento nel conto.</div>
        ) : (
          <ul className="space-y-3">
            {items.map((it) => {
              const extrasSum = (it.extras ?? []).reduce((s, e) => s + e.price, 0);
              const unit = it.basePrice + extrasSum;
              const rowTotal = unit * it.qty;
              return (
                <li key={it.id} className="border border-neutral-800 rounded-lg p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{it.name}</div>
                      <div className="text-sm text-neutral-400">€ {rowTotal.toFixed(2)} — {it.qty} x € {unit.toFixed(2)}</div>
                      {it.removedIngredients && it.removedIngredients.length > 0 && (
                        <div className="text-xs text-red-300 mt-1">Senza: {it.removedIngredients.join(", ")}</div>
                      )}
                      {it.extras && it.extras.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {it.extras.map(ex => (
                            <span key={ex.id} className="text-xs px-2 py-1 rounded-full bg-neutral-800 border border-neutral-700">
                              {ex.name} +€ {ex.price.toFixed(2)}
                              <button className="ml-1 text-neutral-400 hover:text-white" onClick={() => removeExtra(it.id, ex.id)} aria-label={`Rimuovi ${ex.name}`}>
                                <i className="pi pi-times" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button icon="pi pi-minus" rounded text onClick={() => decrement(it.id)} aria-label="Decrementa" />
                      <span className="w-8 text-center">{it.qty}</span>
                      <Button icon="pi pi-plus" rounded text onClick={() => increment(it.id)} aria-label="Incrementa" />
                      <Button icon="pi pi-trash" rounded text severity="danger" onClick={() => removeItem(it.id)} aria-label="Rimuovi" />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <div className="border border-neutral-800 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-neutral-300">Totale</span>
            <span className="text-xl font-semibold">€ {totalAmount.toFixed(2)}</span>
          </div>

          <div className="pt-2">
            <div className="font-semibold mb-2">Metodo di pagamento</div>
            <div className="flex items-center gap-6 flex-wrap">
              <label className="flex items-center gap-2">
                <RadioButton inputId="pay-cassa" name="payment" value="cassa" onChange={(e) => setPayment(e.value)} checked={payment === "cassa"} />
                <span>In cassa</span>
              </label>
              <label className="flex items-center gap-2">
                <RadioButton inputId="pay-online" name="payment" value="online" onChange={(e) => setPayment(e.value)} checked={payment === "online"} />
                <span>Paga online</span>
              </label>
              <div className="flex items-center gap-2 opacity-80">
                <Image src="/metodi_pagamento_dark.png" alt="Mastercard" width={80} height={32} className="h-6 w-auto" />
              </div>
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <Button label={payment === "online" ? "Procedi al pagamento" : "Conferma in cassa"} className="p-button-success" disabled={items.length === 0} />
            <Link href="/" className="p-button p-component p-button-secondary p-button-text"><span className="p-button-label">Continua ad ordinare</span></Link>
          </div>
        </div>
      </main>
    </div>
  );
}

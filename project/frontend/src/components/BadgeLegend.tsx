"use client";
import { useBadges } from "@/store/badgesStore";
import Image from "next/image";

export default function BadgeLegend() {
  const { badges } = useBadges();
  if (!badges || badges.length === 0) return null;
  return (
    <div className="border-b border-neutral-800 bg-black/40">
      <div className="max-w-3xl mx-auto px-4 py-2 flex items-center gap-3 flex-wrap">
        <span className="text-xs text-neutral-400">Legenda:</span>
        {badges.map((b) => (
          <span key={b.id} className="text-xs px-2 py-1 rounded bg-neutral-800 border border-neutral-700 inline-flex items-center gap-1">
            {b.icon && <Image src={b.icon} alt="" width={12} height={12} className="opacity-80" />}
            <span>{b.name}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

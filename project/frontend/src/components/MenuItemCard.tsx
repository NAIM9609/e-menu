"use client";

type Props = {
  name: string;
  description?: string;
  price?: number | string;
  badges?: string[];
};

export default function MenuItemCard({ name, description, price, badges }: Props) {
  return (
    <div className="border border-neutral-800 rounded-lg p-3 flex items-start justify-between gap-3 bg-black/20">
      <div className="flex-1">
        <div className="font-semibold text-base text-white">{name}</div>
        {description && (
          <div className="text-sm text-neutral-300 mt-1 leading-snug">{description}</div>
        )}
        {badges && badges.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {badges.map((b) => (
              <span
                key={b}
                className="px-2 py-0.5 text-xs rounded-full bg-neutral-700 text-white capitalize"
              >
                {b}
              </span>
            ))}
          </div>
        )}
      </div>
      {price !== undefined && (
        <div className="text-right shrink-0">
          <div className="text-foreground font-semibold">
            {typeof price === "number" ? `€ ${price.toFixed(2)}` : price}
          </div>
        </div>
      )}
    </div>
  );
}

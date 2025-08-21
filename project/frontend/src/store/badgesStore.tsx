"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { badgesRepo } from "@/services/badgesRepo";

export type Badge = {
  id: string; // slug
  name: string;
  icon: string; // path or url
  description?: string;
  bgColor?: string; // hex or rgba
  textColor?: string; // hex
};

type BadgesContextType = {
  badges: Badge[];
  addBadge: (name: string, icon: string, description?: string) => void;
  removeBadge: (id: string) => void;
  updateBadge: (id: string, patch: Partial<Omit<Badge, "id">>) => void;
  resetDefaults: () => void;
};


function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

const Ctx = createContext<BadgesContextType | undefined>(undefined);

export function BadgesProvider({ children }: { children: React.ReactNode }) {
  const [badges, setBadges] = useState<Badge[]>(() => {
  return badgesRepo.get();
  });

  useEffect(() => {
    badgesRepo.set(badges);
  }, [badges]);

  const addBadge = (name: string, icon: string, description?: string) => {
    const base = slugify(name);
    let id = base || `badge-${Date.now()}`;
    let i = 2;
    while (badges.some((b) => b.id === id)) id = `${base}-${i++}`;
    setBadges([...badges, { id, name: name.trim(), icon, description }]);
  };

  const removeBadge = (id: string) => setBadges(badges.filter((b) => b.id !== id));

  const updateBadge = (id: string, patch: Partial<Omit<Badge, "id">>) => {
    setBadges(badges.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  };

  const resetDefaults = () => setBadges(badgesRepo.reset());

  return (
    <Ctx.Provider value={{ badges, addBadge, removeBadge, updateBadge, resetDefaults }}>
      {children}
    </Ctx.Provider>
  );
}

export function useBadges() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBadges must be used within BadgesProvider");
  return ctx;
}

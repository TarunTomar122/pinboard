"use client";

import { Pin } from "@/types";

let cachedPins: Pin[] | null = null;

export async function getPins(): Promise<Pin[]> {
  try {
    const res = await fetch("/api/pins", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch");
    const data = await res.json();
    cachedPins = data;
    return data;
  } catch {
    // Return cached data if available
    if (cachedPins) return cachedPins;
    return [];
  }
}

export async function savePins(pins: Pin[]): Promise<boolean> {
  try {
    const res = await fetch("/api/pins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pins),
    });
    if (!res.ok) throw new Error("Failed to save");
    cachedPins = pins;
    return true;
  } catch {
    return false;
  }
}

export function getCachedPins(): Pin[] | null {
  return cachedPins;
}

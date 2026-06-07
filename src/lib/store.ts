"use client";

import { Pin } from "@/types";

let cachedPins: Pin[] | null = null;
let cachedSha: string | null = null;

export async function getPins(): Promise<Pin[]> {
  try {
    const res = await fetch("/api/pins", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      cachedSha = res.headers.get("x-sha");
      cachedPins = data;
      return data;
    }
    throw new Error(`HTTP ${res.status}`);
  } catch {
    if (cachedPins) return cachedPins;
    return [];
  }
}

export async function savePins(pins: Pin[]): Promise<boolean> {
  try {
    const res = await fetch("/api/pins", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pins, sha: cachedSha }),
    });
    if (res.ok) {
      const data = await res.json();
      cachedSha = data.sha;
      cachedPins = pins;
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function getCachedPins(): Pin[] | null {
  return cachedPins;
}

export function hasToken(): boolean {
  return true;
}

export function setToken(_token: string) {
  // No-op — token is server-side env var
}

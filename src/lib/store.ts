"use client";

import { Pin } from "@/types";

const REPO_OWNER = "TarunTomar122";
const REPO_NAME = "pinboard";
const FILE_PATH = "data/pins.json";
const BRANCH = "main";

const API_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
const RAW_URL = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}/${FILE_PATH}`;

let cachedPins: Pin[] | null = null;

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("pinboard_token");
}

export function setToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("pinboard_token", token);
  }
}

export function hasToken(): boolean {
  return !!getToken();
}

export async function getPins(): Promise<Pin[]> {
  try {
    const res = await fetch(RAW_URL, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      cachedPins = data;
      return data;
    }
    if (res.status === 404) {
      cachedPins = [];
      return [];
    }
    throw new Error(`HTTP ${res.status}`);
  } catch {
    if (cachedPins) return cachedPins;
    return [];
  }
}

async function getFileSha(): Promise<string | null> {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await fetch(`${API_URL}?ref=${BRANCH}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });
    if (res.ok) {
      const data = await res.json();
      return data.sha;
    }
    return null;
  } catch {
    return null;
  }
}

export async function savePins(pins: Pin[]): Promise<boolean> {
  const token = getToken();
  if (!token) {
    console.error("No GitHub token set — go to Settings to add one");
    return false;
  }

  try {
    const sha = await getFileSha();
    const body: Record<string, unknown> = {
      message: sha ? `Update pins` : `Create pins.json`,
      content: Buffer.from(JSON.stringify(pins, null, 2)).toString("base64"),
    };
    if (sha) body.sha = sha;

    const res = await fetch(API_URL, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("Save failed:", err);
      return false;
    }

    cachedPins = pins;
    return true;
  } catch (e) {
    console.error("Save error:", e);
    return false;
  }
}

export function getCachedPins(): Pin[] | null {
  return cachedPins;
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { Pin, ColumnId, COLUMNS, ALL_CATEGORIES, Category, CATEGORY_COLORS } from "@/types";
import { getPins, savePins, hasToken, setToken } from "@/lib/store";
import { seedPins } from "@/lib/seed";
import Column from "./Column";
import SearchBar from "./SearchBar";
import CategoryFilter from "./CategoryFilter";
import PinModal from "./PinModal";
import TokenSetup from "./TokenSetup";

export default function Board() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [modalPin, setModalPin] = useState<Pin | null | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [tokenReady, setTokenReady] = useState(false);

  useEffect(() => {
    setTokenReady(hasToken());
  }, []);

  const loadPins = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data = await getPins();
      if (!data || data.length === 0) {
        data = seedPins;
        await savePins(data);
      }
      setPins(data);
    } catch {
      setError("Failed to load pins");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tokenReady) {
      loadPins();
    }
  }, [tokenReady, loadPins]);

  const persistPins = async (newPins: Pin[]) => {
    setPins(newPins);
    setSaving(true);
    const ok = await savePins(newPins);
    setSaving(false);
    if (!ok) setError("Failed to save — changes may be lost");
    else setError(null);
  };

  const handleSavePin = async (pinData: Omit<Pin, "id" | "createdAt"> & { id?: string }) => {
    let newPins: Pin[];
    if (pinData.id) {
      newPins = pins.map((p) =>
        p.id === pinData.id ? { ...p, ...pinData, id: pinData.id } : p
      );
    } else {
      const newPin: Pin = {
        ...pinData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      newPins = [...pins, newPin];
    }
    await persistPins(newPins);
    setModalPin(undefined);
  };

  const handleDeletePin = async (id: string) => {
    await persistPins(pins.filter((p) => p.id !== id));
  };

  const handleDrop = async (columnId: ColumnId) => {
    const pinId = (window as unknown as { __draggedPinId?: string }).__draggedPinId;
    if (!pinId) return;
    await persistPins(pins.map((p) => p.id === pinId ? { ...p, column: columnId } : p));
  };

  const handleDragStartWithStore = (e: React.DragEvent, pinId: string) => {
    e.dataTransfer.setData("pinId", pinId);
    (window as unknown as { __draggedPinId: string }).__draggedPinId = pinId;
  };

  const filteredPins = pins.filter((pin) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q ||
      pin.title.toLowerCase().includes(q) ||
      pin.description.toLowerCase().includes(q) ||
      pin.notes?.toLowerCase().includes(q);
    const matchesCategory = !selectedCategory || pin.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ALL_CATEGORIES;

  // Token setup screen
  if (!tokenReady) {
    return <TokenSetup onComplete={(token) => { setToken(token); setTokenReady(true); }} />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-[#007AFF] rounded-full animate-spin" />
          <span className="text-sm text-[#86868b]">Loading pins...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="border-b border-[#e5e5e7] px-4 sm:px-6 py-4 bg-white/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">📌 Pinboard</h1>
            <p className="text-xs text-[#86868b] mt-0.5">by tarat & margo</p>
          </div>
          <div className="flex items-center gap-2">
            {saving && (
              <span className="text-xs text-[#86868b] flex items-center gap-1.5">
                <div className="w-3 h-3 border border-gray-300 border-t-[#007AFF] rounded-full animate-spin" />
                Saving...
              </span>
            )}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg text-[#86868b] hover:bg-[#f5f5f7] transition-colors"
              title="Settings"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <button
              onClick={() => setModalPin(null)}
              className="bg-[#007AFF] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0066D6] transition-colors active:scale-[0.97]"
            >
              + Add Pin
            </button>
          </div>
        </div>

        {/* Settings panel */}
        {showSettings && (
          <div className="mb-3 p-3 bg-[#f5f5f7] rounded-lg animate-fade-in">
            <p className="text-xs text-[#86868b] mb-2">GitHub Token (for saving changes)</p>
            <div className="flex gap-2">
              <input
                type="password"
                placeholder="ghp_xxxxx..."
                defaultValue=""
                className="flex-1 px-3 py-1.5 text-xs border border-[#e5e5e7] rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-[#007AFF]"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const val = (e.target as HTMLInputElement).value.trim();
                    if (val) { setToken(val); setTokenReady(true); setShowSettings(false); }
                  }
                }}
              />
              <button
                onClick={() => {
                  const input = document.querySelector<HTMLInputElement>('input[type="password"]');
                  const val = input?.value.trim();
                  if (val) { setToken(val); setTokenReady(true); setShowSettings(false); }
                }}
                className="px-3 py-1.5 text-xs bg-[#007AFF] text-white rounded-md hover:bg-[#0066D6]"
              >
                Save
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <SearchBar onSearch={setSearchQuery} />
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>

        {error && (
          <div className="mt-3 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}
      </header>

      {/* Columns */}
      <main className="flex-1 overflow-x-auto p-4 sm:p-6">
        <div className="flex gap-4 min-h-[calc(100vh-240px)]">
          {COLUMNS.map((col) => (
            <Column
              key={col.id}
              column={col}
              pins={filteredPins.filter((p) => p.column === col.id)}
              onEdit={(pin) => setModalPin(pin)}
              onDelete={handleDeletePin}
              onDragStart={handleDragStartWithStore}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            />
          ))}
        </div>
      </main>

      {/* Modal */}
      {modalPin !== undefined && (
        <PinModal
          pin={modalPin}
          onClose={() => setModalPin(undefined)}
          onSave={handleSavePin}
        />
      )}
    </div>
  );
}

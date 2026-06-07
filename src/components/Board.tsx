"use client";

import { useState, useEffect, useCallback } from "react";
import { Pin, ColumnId, COLUMNS } from "@/types";
import { getPins, savePins } from "@/lib/store";
import { seedPins, CATEGORIES } from "@/lib/seed";
import Column from "./Column";
import SearchBar from "./SearchBar";
import CategoryFilter from "./CategoryFilter";
import PinModal from "./PinModal";

export default function Board() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [modalPin, setModalPin] = useState<Pin | null | undefined>(undefined);
  const [saving, setSaving] = useState(false);

  const loadPins = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data = await getPins();
      if (!data || data.length === 0) {
        // First load — seed the data
        data = seedPins;
        await savePins(data);
      }
      setPins(data);
    } catch {
      setError("Failed to load pins. Showing cached data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPins();
  }, [loadPins]);

  const persistPins = async (newPins: Pin[]) => {
    setPins(newPins);
    setSaving(true);
    const ok = await savePins(newPins);
    setSaving(false);
    if (!ok) setError("Failed to save. Changes may be lost.");
    else setError(null);
  };

  const handleAddPin = () => {
    setModalPin(null);
  };

  const handleEditPin = (pin: Pin) => {
    setModalPin(pin);
  };

  const handleDeletePin = async (id: string) => {
    const newPins = pins.filter((p) => p.id !== id);
    await persistPins(newPins);
  };

  const handleSavePin = async (pinData: Omit<Pin, "id" | "createdAt"> & { id?: string }) => {
    let newPins: Pin[];
    if (pinData.id) {
      // Edit existing
      newPins = pins.map((p) =>
        p.id === pinData.id
          ? { ...p, ...pinData, id: pinData.id }
          : p
      );
    } else {
      // Add new
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

  const handleDragStart = (e: React.DragEvent, pinId: string) => {
    e.dataTransfer.setData("pinId", pinId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (columnId: ColumnId) => {
    const pinId = (window as unknown as { __draggedPinId?: string }).__draggedPinId;
    if (!pinId) return;
    const newPins = pins.map((p) =>
      p.id === pinId ? { ...p, column: columnId } : p
    );
    await persistPins(newPins);
  };

  // Override drag start to also store in window
  const handleDragStartWithStore = (e: React.DragEvent, pinId: string) => {
    e.dataTransfer.setData("pinId", pinId);
    (window as unknown as { __draggedPinId: string }).__draggedPinId = pinId;
  };

  const filteredPins = pins.filter((pin) => {
    const matchesSearch =
      !searchQuery ||
      pin.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pin.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || pin.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(pins.map((p) => p.category))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-gray-500">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Loading pins...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col gap-4 p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">📌 Pinboard</h1>
          <div className="flex items-center gap-3">
            {saving && (
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving...
              </span>
            )}
            <button
              onClick={handleAddPin}
              className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              + Add Pin
            </button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <SearchBar onSearch={setSearchQuery} />
          <CategoryFilter
            categories={categories.length > 0 ? categories : CATEGORIES}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
            {error}
          </div>
        )}
      </div>

      {/* Columns */}
      <div className="flex-1 overflow-x-auto p-4">
        <div className="flex gap-4 min-h-[calc(100vh-200px)]">
          {COLUMNS.map((col) => (
            <Column
              key={col.id}
              column={col}
              pins={filteredPins.filter((p) => p.column === col.id)}
              onEdit={handleEditPin}
              onDelete={handleDeletePin}
              onDragStart={handleDragStartWithStore}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            />
          ))}
        </div>
      </div>

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

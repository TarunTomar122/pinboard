"use client";

import { useState, useEffect } from "react";
import { Pin, ColumnId, Category, CATEGORY_COLORS, ALL_CATEGORIES, COLUMNS } from "@/types";

interface PinModalProps {
  pin?: Pin | null;
  onClose: () => void;
  onSave: (pin: Omit<Pin, "id" | "createdAt"> & { id?: string }) => void;
}

export default function PinModal({ pin, onClose, onSave }: PinModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState<Category>("tools");
  const [column, setColumn] = useState<ColumnId>("pinned");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (pin) {
      setTitle(pin.title);
      setDescription(pin.description);
      setUrl(pin.url);
      setCategory(pin.category);
      setColumn(pin.column);
      setNotes(pin.notes || "");
    }
  }, [pin]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      ...(pin?.id ? { id: pin.id } : {}),
      title: title.trim(),
      description: description.trim(),
      url: url.trim(),
      category,
      column,
      notes: notes.trim(),
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-modal flex items-end sm:items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold">
              {pin ? "Edit Pin" : "New Pin"}
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#f5f5f7] text-[#86868b] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2.5 border border-[#e5e5e7] rounded-xl text-sm bg-[#f5f5f7] focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:border-transparent"
                required
                autoFocus
                placeholder="What's this about?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full px-3 py-2.5 border border-[#e5e5e7] rounded-xl text-sm bg-[#f5f5f7] focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:border-transparent resize-none"
                placeholder="Brief description..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2.5 border border-[#e5e5e7] rounded-xl text-sm bg-[#f5f5f7] focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:border-transparent"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full px-3 py-2.5 border border-[#e5e5e7] rounded-xl text-sm bg-[#f5f5f7] focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:border-transparent resize-none"
                placeholder="Your thoughts, context, reminders..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_CATEGORIES.map((cat) => {
                    const colors = CATEGORY_COLORS[cat];
                    const isActive = category === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                          isActive
                            ? `${colors.bg} ${colors.text} ring-1 ring-current`
                            : "bg-[#f5f5f7] text-[#86868b] hover:bg-[#e5e5e7]"
                        }`}
                      >
                        {colors.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                <select
                  value={column}
                  onChange={(e) => setColumn(e.target.value as ColumnId)}
                  className="w-full px-3 py-2.5 border border-[#e5e5e7] rounded-xl text-sm bg-[#f5f5f7] focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
                >
                  {COLUMNS.map((col) => (
                    <option key={col.id} value={col.id}>{col.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-[#007AFF] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#0066D6] transition-all active:scale-[0.98]"
              >
                {pin ? "Save Changes" : "Add Pin"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 border border-[#e5e5e7] rounded-xl text-sm font-medium text-[#86868b] hover:bg-[#f5f5f7] transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

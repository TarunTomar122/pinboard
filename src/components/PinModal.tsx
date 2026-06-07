"use client";

import { useState, useEffect, useRef } from "react";
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
  const [dirty, setDirty] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

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

  const markDirty = () => { if (!dirty) setDirty(true); };

  const handleSave = () => {
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleSave();
  };

  const col = COLUMNS.find((c) => c.id === column);
  const catColors = CATEGORY_COLORS[category] || CATEGORY_COLORS.random;

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-end sm:items-center justify-center z-50"
      onClick={onClose}
      onKeyDown={handleKeyDown}
    >
      <div
        className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${catColors.bg} ${catColors.text}`}>
              {catColors.label}
            </span>
            <span className="text-xs text-[#86868b]">in</span>
            <select
              value={column}
              onChange={(e) => { setColumn(e.target.value as ColumnId); markDirty(); }}
              className="text-xs font-medium bg-transparent border-none focus:outline-none focus:ring-0 text-gray-600 cursor-pointer hover:text-gray-900"
            >
              {COLUMNS.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#f5f5f7] text-[#86868b] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Title — big editable */}
        <div className="px-6 pb-2">
          <input
            ref={titleRef}
            type="text"
            value={title}
            onChange={(e) => { setTitle(e.target.value); markDirty(); }}
            placeholder="Pin title..."
            className="w-full text-xl font-semibold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-gray-300"
            autoFocus
          />
        </div>

        {/* Fields */}
        <div className="px-6 space-y-4 pb-4">
          {/* URL */}
          <div>
            <label className="block text-xs font-medium text-[#86868b] mb-1">Link</label>
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={url}
                onChange={(e) => { setUrl(e.target.value); markDirty(); }}
                placeholder="https://..."
                className="flex-1 px-3 py-2 text-sm text-gray-700 bg-[#f9f9fb] border border-[#e5e5e7] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#007AFF] focus:border-[#007AFF] transition-shadow"
              />
              {url && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 px-3 py-2 text-sm text-[#007AFF] bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Open ↗
                </a>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-[#86868b] mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => { setDescription(e.target.value); markDirty(); }}
              rows={2}
              placeholder="What's this about..."
              className="w-full px-3 py-2 text-sm text-gray-700 bg-[#f9f9fb] border border-[#e5e5e7] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#007AFF] focus:border-[#007AFF] resize-none transition-shadow"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-[#86868b] mb-1">💭 Notes</label>
            <textarea
              value={notes}
              onChange={(e) => { setNotes(e.target.value); markDirty(); }}
              rows={3}
              placeholder="Your thoughts, context, reminders..."
              className="w-full px-3 py-2 text-sm text-gray-700 bg-[#f9f9fb] border border-[#e5e5e7] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#007AFF] focus:border-[#007AFF] resize-none transition-shadow"
            />
          </div>

          {/* Category picker */}
          <div>
            <label className="block text-xs font-medium text-[#86868b] mb-2">Category</label>
            <div className="flex flex-wrap gap-1.5">
              {ALL_CATEGORIES.map((cat) => {
                const colors = CATEGORY_COLORS[cat];
                const isActive = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => { setCategory(cat); markDirty(); }}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                      isActive
                        ? `${colors.bg} ${colors.text} ring-1 ring-current/30`
                        : "bg-[#f5f5f7] text-[#86868b] hover:bg-[#e5e5e7]"
                    }`}
                  >
                    {colors.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#e5e5e7] bg-[#fafafa] rounded-b-2xl">
          <span className="text-xs text-[#86868b]">
            {pin ? `Created ${new Date(pin.createdAt).toLocaleDateString()}` : "New pin"}
          </span>
          <div className="flex items-center gap-2">
            {dirty && (
              <span className="text-xs text-[#86868b] mr-1">⌘↵ to save</span>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 border border-[#e5e5e7] rounded-lg text-sm font-medium text-[#86868b] hover:bg-[#f5f5f7] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim()}
              className="px-5 py-2 bg-[#007AFF] text-white rounded-lg text-sm font-medium hover:bg-[#0066D6] transition-all active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {pin ? "Save" : "Add Pin"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

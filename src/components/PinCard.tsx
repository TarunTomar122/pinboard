"use client";

import { Pin, CATEGORY_COLORS } from "@/types";

interface PinCardProps {
  pin: Pin;
  onEdit: (pin: Pin) => void;
  onDelete: (id: string) => void;
  onDragStart: (e: React.DragEvent, pinId: string) => void;
}

export default function PinCard({ pin, onEdit, onDelete, onDragStart }: PinCardProps) {
  const colors = CATEGORY_COLORS[pin.category] || CATEGORY_COLORS.random;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, pin.id)}
      className="group bg-white rounded-xl border border-[#e5e5e7] p-3.5 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing active:scale-[0.98]"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium text-sm text-gray-900 leading-snug">{pin.title}</h3>
        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={() => onEdit(pin)}
            className="p-1 rounded-md text-[#86868b] hover:text-[#007AFF] hover:bg-[#f5f5f7]"
            title="Edit"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(pin.id)}
            className="p-1 rounded-md text-[#86868b] hover:text-red-500 hover:bg-red-50"
            title="Delete"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {pin.description && (
        <p className="mt-1.5 text-xs text-[#86868b] line-clamp-2 leading-relaxed">
          {pin.description}
        </p>
      )}

      {pin.notes && (
        <p className="mt-1.5 text-xs text-[#86868b]/70 line-clamp-2 italic leading-relaxed">
          💭 {pin.notes}
        </p>
      )}

      <div className="mt-2.5 flex items-center justify-between">
        <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-full ${colors.bg} ${colors.text}`}>
          {colors.label}
        </span>
        {pin.url && (
          <a
            href={pin.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#007AFF] hover:underline flex items-center gap-0.5"
            onClick={(e) => e.stopPropagation()}
          >
            Open ↗
          </a>
        )}
      </div>
    </div>
  );
}

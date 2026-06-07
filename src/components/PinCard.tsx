"use client";

import { Pin } from "@/types";

interface PinCardProps {
  pin: Pin;
  onEdit: (pin: Pin) => void;
  onDelete: (id: string) => void;
  onDragStart: (e: React.DragEvent, pinId: string) => void;
}

export default function PinCard({ pin, onEdit, onDelete, onDragStart }: PinCardProps) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, pin.id)}
      className="group bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing dark:bg-gray-800 dark:border-gray-700"
    >
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-gray-900 text-sm dark:text-white">{pin.title}</h3>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(pin)}
            className="p-1 text-gray-400 hover:text-blue-500"
            title="Edit"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(pin.id)}
            className="p-1 text-gray-400 hover:text-red-500"
            title="Delete"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      {pin.description && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
          {pin.description}
        </p>
      )}
      <div className="mt-2 flex items-center justify-between">
        <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
          {pin.category}
        </span>
        {pin.url && (
          <a
            href={pin.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-500 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            Open ↗
          </a>
        )}
      </div>
    </div>
  );
}

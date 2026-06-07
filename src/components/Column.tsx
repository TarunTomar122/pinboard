"use client";

import { Pin, ColumnId, COLUMNS } from "@/types";
import PinCard from "./PinCard";

interface ColumnProps {
  column: (typeof COLUMNS)[number];
  pins: Pin[];
  onEdit: (pin: Pin) => void;
  onDelete: (id: string) => void;
  onDragStart: (e: React.DragEvent, pinId: string) => void;
  onDrop: (columnId: ColumnId) => void;
  onDragOver: (e: React.DragEvent) => void;
}

export default function Column({
  column,
  pins,
  onEdit,
  onDelete,
  onDragStart,
  onDrop,
  onDragOver,
}: ColumnProps) {
  return (
    <div
      className={`flex flex-col rounded-xl border-2 ${column.color} min-w-[280px] max-w-[320px] flex-1`}
      onDragOver={onDragOver}
      onDrop={() => onDrop(column.id)}
    >
      <div className="px-4 py-3 flex items-center justify-between">
        <h2 className="font-bold text-gray-800">{column.title}</h2>
        <span className="text-sm text-gray-500 bg-white/60 px-2 py-0.5 rounded-full">
          {pins.length}
        </span>
      </div>
      <div className="flex-1 px-3 pb-3 space-y-2 overflow-y-auto max-h-[calc(100vh-220px)]">
        {pins.map((pin) => (
          <PinCard
            key={pin.id}
            pin={pin}
            onEdit={onEdit}
            onDelete={onDelete}
            onDragStart={onDragStart}
          />
        ))}
        {pins.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">
            Drop pins here
          </div>
        )}
      </div>
    </div>
  );
}

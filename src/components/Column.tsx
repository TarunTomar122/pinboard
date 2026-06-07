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
      className={`flex flex-col rounded-2xl min-w-[260px] max-w-[320px] flex-1 ${column.color} border border-[#e5e5e7]`}
      onDragOver={onDragOver}
      onDrop={() => onDrop(column.id)}
    >
      <div className={`px-4 pt-4 pb-2 border-t-[3px] rounded-t-2xl ${column.borderColor}`}>
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-sm text-gray-800">{column.title}</h2>
          <span className="text-xs text-[#86868b] bg-white/80 px-2 py-0.5 rounded-full font-medium">
            {pins.length}
          </span>
        </div>
      </div>
      <div className="flex-1 px-3 pb-3 space-y-2 overflow-y-auto max-h-[calc(100vh-280px)]">
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
          <div className="text-center py-10 text-[#86868b] text-xs">
            Drop pins here
          </div>
        )}
      </div>
    </div>
  );
}

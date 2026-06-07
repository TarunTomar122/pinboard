"use client";

import { Pin } from "@/types";
import { getTagColor } from "@/lib/tags";

interface PinCardProps {
  pin: Pin;
  dimmed: boolean;
  onMouseDown: (e: React.MouseEvent, pinId: string) => void;
  onTouchStart: (e: React.TouchEvent, pinId: string) => void;
  onClick: (pin: Pin) => void;
  onDelete: (pinId: string) => void;
}

export default function PinCard({
  pin,
  dimmed,
  onMouseDown,
  onTouchStart,
  onClick,
  onDelete,
}: PinCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(pin);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(pin.id);
  };

  return (
    <div
      className="pin-card"
      style={{
        position: "absolute",
        left: pin.x,
        top: pin.y,
        width: 240,
        opacity: dimmed ? 0.2 : 1,
        transition: "opacity 0.2s ease, box-shadow 0.2s ease",
        zIndex: dimmed ? 0 : 1,
      }}
      onMouseDown={(e) => onMouseDown(e, pin.id)}
      onTouchStart={(e) => onTouchStart(e, pin.id)}
      onClick={handleClick}
    >
      <div
        className="pin-card-inner group"
        style={{
          background: "#fff",
          borderRadius: 12,
          border: "1px solid #e5e5e7",
          padding: "16px",
          cursor: "grab",
          userSelect: "none",
          transition: "box-shadow 0.2s ease",
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow =
            "0 4px 12px rgba(0,0,0,0.08)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow =
            "0 1px 2px rgba(0,0,0,0.04)";
        }}
      >
        {/* Delete button */}
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border border-[#e5e5e7] text-[#86868b] text-xs flex items-center justify-center hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all cursor-pointer"
          style={{ position: "absolute" }}
        >
          ×
        </button>

        {/* Title */}
        <h3
          style={{
            fontWeight: 600,
            fontSize: 14,
            color: "#1d1d1f",
            marginBottom: 4,
            lineHeight: 1.3,
          }}
        >
          {pin.title}
        </h3>

        {/* Description */}
        {pin.description && (
          <p
            className="line-clamp-2"
            style={{
              fontSize: 12,
              color: "#86868b",
              lineHeight: 1.4,
              marginBottom: 8,
            }}
          >
            {pin.description}
          </p>
        )}

        {/* URL indicator */}
        {pin.url && (
          <div
            style={{
              fontSize: 11,
              color: "#007AFF",
              marginBottom: 8,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            🔗 {pin.url.replace(/^https?:\/\/(www\.)?/, "").split("/")[0]}
          </div>
        )}

        {/* Tags */}
        {pin.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {pin.tags.map((tag) => {
              const color = getTagColor(tag);
              const isExplore = tag.toLowerCase() === "explore";
              return (
                <span
                  key={tag}
                  className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full"
                  style={{
                    fontSize: 10,
                    fontWeight: 500,
                    backgroundColor: color.bg,
                    color: color.text,
                  }}
                >
                  {isExplore && <span>🔍</span>}
                  {tag}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

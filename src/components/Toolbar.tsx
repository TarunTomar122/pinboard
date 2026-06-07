"use client";

interface ToolbarProps {
  search: string;
  onSearchChange: (q: string) => void;
  onAddPin: () => void;
  onArrange: () => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
}

export default function Toolbar({
  search,
  onSearchChange,
  onAddPin,
  onArrange,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
}: ToolbarProps) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid #e5e5e7",
        padding: "10px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      {/* Left */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
        <span style={{ fontSize: 18 }}>📌</span>
        <span style={{ fontWeight: 700, fontSize: 16, color: "#1d1d1f" }}>
          Pinboard
        </span>
        <span style={{ fontSize: 12, color: "#86868b" }}>by tarat & margo</span>
      </div>

      {/* Center — search */}
      <div
        style={{
          flex: "0 1 320px",
        }}
      >
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search pins..."
          style={{
            width: "100%",
            padding: "7px 12px",
            borderRadius: 8,
            border: "1px solid #e5e5e7",
            fontSize: 13,
            outline: "none",
            background: "#f5f5f7",
            color: "#1d1d1f",
          }}
        />
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button
          onClick={onAddPin}
          style={{
            padding: "7px 14px",
            borderRadius: 8,
            border: "none",
            background: "#007AFF",
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          + Add Pin
        </button>
        <button
          onClick={onArrange}
          style={{
            padding: "7px 14px",
            borderRadius: 8,
            border: "1px solid #e5e5e7",
            background: "#fff",
            color: "#1d1d1f",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          Arrange
        </button>

        {/* Zoom controls */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            border: "1px solid #e5e5e7",
            borderRadius: 8,
            padding: "2px 4px",
          }}
        >
          <button
            onClick={onZoomOut}
            style={{
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "#1d1d1f",
              fontSize: 16,
              borderRadius: 4,
            }}
          >
            −
          </button>
          <button
            onClick={onZoomReset}
            style={{
              padding: "0 6px",
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "#86868b",
              fontSize: 11,
              fontWeight: 500,
              minWidth: 36,
              borderRadius: 4,
            }}
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            onClick={onZoomIn}
            style={{
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "#1d1d1f",
              fontSize: 16,
              borderRadius: 4,
            }}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { Pin } from "@/types";
import TagInput from "./TagInput";

interface PinModalProps {
  pin: Pin | null;
  isNew: boolean;
  onSave: (pin: Pin) => void;
  onClose: () => void;
  onDelete: (pinId: string) => void;
}

export default function PinModal({
  pin,
  isNew,
  onSave,
  onClose,
  onDelete,
}: PinModalProps) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (pin) {
      setTitle(pin.title);
      setUrl(pin.url);
      setDescription(pin.description);
      setNotes(pin.notes);
      setTags([...pin.tags]);
    }
    setTimeout(() => titleRef.current?.focus(), 100);
  }, [pin]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleSave();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  if (!pin) return null;

  function handleSave() {
    if (!pin || !title.trim()) return;
    onSave({
      id: pin.id,
      title: title.trim(),
      url: url.trim(),
      description: description.trim(),
      notes: notes.trim(),
      tags,
      x: pin.x,
      y: pin.y,
      createdAt: pin.createdAt,
    });
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="pin-modal-backdrop"
      onClick={handleBackdropClick}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.3)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <div
        className="animate-slide-up"
        style={{
          background: "#fff",
          borderRadius: 20,
          width: "100%",
          maxWidth: 480,
          maxHeight: "90vh",
          overflow: "auto",
          padding: 24,
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          margin: 16,
        }}
      >
        {/* Title */}
        <input
          ref={titleRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Pin title..."
          style={{
            width: "100%",
            fontSize: 22,
            fontWeight: 600,
            color: "#1d1d1f",
            border: "none",
            outline: "none",
            marginBottom: 16,
            background: "transparent",
          }}
        />

        {/* URL */}
        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 500,
              color: "#86868b",
              marginBottom: 4,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            URL
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              style={{
                flex: 1,
                fontSize: 14,
                color: "#1d1d1f",
                border: "1px solid #e5e5e7",
                borderRadius: 8,
                padding: "8px 12px",
                outline: "none",
                background: "transparent",
              }}
            />
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "1px solid #e5e5e7",
                  fontSize: 13,
                  color: "#007AFF",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                Open ↗
              </a>
            )}
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 500,
              color: "#86868b",
              marginBottom: 4,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's this about?"
            rows={2}
            style={{
              width: "100%",
              fontSize: 14,
              color: "#1d1d1f",
              border: "1px solid #e5e5e7",
              borderRadius: 8,
              padding: "8px 12px",
              outline: "none",
              resize: "vertical",
              background: "transparent",
              fontFamily: "inherit",
            }}
          />
        </div>

        {/* Notes */}
        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 500,
              color: "#86868b",
              marginBottom: 4,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Your thoughts..."
            rows={4}
            style={{
              width: "100%",
              fontSize: 14,
              color: "#1d1d1f",
              border: "1px solid #e5e5e7",
              borderRadius: 8,
              padding: "8px 12px",
              outline: "none",
              resize: "vertical",
              background: "transparent",
              fontFamily: "inherit",
            }}
          />
        </div>

        {/* Tags */}
        <div style={{ marginBottom: 20 }}>
          <label
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 500,
              color: "#86868b",
              marginBottom: 8,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Tags
          </label>
          <TagInput tags={tags} onChange={setTags} />
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #f0f0f0",
            paddingTop: 16,
          }}
        >
          <div style={{ fontSize: 12, color: "#86868b" }}>
            {isNew
              ? "New pin"
              : `Created ${new Date(pin.createdAt).toLocaleDateString()}`}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {!isNew && (
              <button
                onClick={() => onDelete(pin.id)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: "1px solid #e5e5e7",
                  background: "#fff",
                  color: "#be123c",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: "1px solid #e5e5e7",
                background: "#fff",
                color: "#1d1d1f",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim()}
              style={{
                padding: "8px 20px",
                borderRadius: 8,
                border: "none",
                background: title.trim() ? "#007AFF" : "#d1d1d6",
                color: "#fff",
                fontSize: 14,
                fontWeight: 600,
                cursor: title.trim() ? "pointer" : "not-allowed",
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

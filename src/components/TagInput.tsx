"use client";

import { useState, useRef, useCallback } from "react";
import { getTagColor, SUGGESTED_TAGS } from "@/lib/tags";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export default function TagInput({ tags, onChange }: TagInputProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = useCallback(
    (tag: string) => {
      const trimmed = tag.trim().toLowerCase();
      if (trimmed && !tags.includes(trimmed)) {
        onChange([...tags, trimmed]);
      }
      setInput("");
    },
    [tags, onChange]
  );

  const removeTag = useCallback(
    (tag: string) => {
      onChange(tags.filter((t) => t !== tag));
    },
    [tags, onChange]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(input);
    }
    if (e.key === "Backspace" && input === "" && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const suggested = SUGGESTED_TAGS.filter((t) => !tags.includes(t));

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {tags.map((tag) => {
          const color = getTagColor(tag);
          const isExplore = tag.toLowerCase() === "explore";
          return (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
              style={{ backgroundColor: color.bg, color: color.text }}
            >
              {isExplore && <span>🔍</span>}
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-0.5 hover:opacity-70 cursor-pointer"
                style={{ color: color.text }}
              >
                ×
              </button>
            </span>
          );
        })}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add tag..."
          className="flex-1 min-w-[80px] text-sm outline-none bg-transparent text-[#1d1d1f] placeholder:text-[#86868b]"
        />
      </div>
      {suggested.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {suggested.map((tag) => {
            const isExplore = tag === "explore";
            return (
              <button
                key={tag}
                type="button"
                onClick={() => addTag(tag)}
                className="px-2.5 py-1 rounded-full text-xs font-medium border border-[#e5e5e7] text-[#86868b] hover:bg-[#f5f5f7] transition-colors cursor-pointer"
              >
                {isExplore && "🔍 "}
                {tag}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

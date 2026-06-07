"use client";

import { Category, CATEGORY_COLORS, ALL_CATEGORIES } from "@/types";

interface CategoryFilterProps {
  categories: Category[];
  selected: Category | null;
  onSelect: (category: Category | null) => void;
}

export default function CategoryFilter({
  selected,
  onSelect,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <button
        onClick={() => onSelect(null)}
        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
          selected === null
            ? "bg-gray-900 text-white"
            : "bg-[#f5f5f7] text-[#86868b] hover:bg-[#e5e5e7]"
        }`}
      >
        All
      </button>
      {ALL_CATEGORIES.map((cat) => {
        const colors = CATEGORY_COLORS[cat];
        const isActive = selected === cat;
        return (
          <button
            key={cat}
            onClick={() => onSelect(isActive ? null : cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              isActive
                ? `${colors.bg} ${colors.text} ring-1 ring-current/20`
                : "bg-[#f5f5f7] text-[#86868b] hover:bg-[#e5e5e7]"
            }`}
          >
            {colors.label}
          </button>
        );
      })}
    </div>
  );
}

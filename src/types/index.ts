export type ColumnId = "pinned" | "exploring" | "doing" | "done";

export type Category = "tools" | "ideas" | "articles" | "projects" | "people" | "random";

export interface Pin {
  id: string;
  title: string;
  description: string;
  url: string;
  category: Category;
  column: ColumnId;
  notes: string;
  createdAt: string;
}

export interface Column {
  id: ColumnId;
  title: string;
  color: string;
  borderColor: string;
}

export const COLUMNS: Column[] = [
  { id: "pinned", title: "📌 Pinned", color: "bg-red-50", borderColor: "border-t-red-400" },
  { id: "exploring", title: "🔍 Exploring", color: "bg-yellow-50", borderColor: "border-t-yellow-400" },
  { id: "doing", title: "⚡ Doing", color: "bg-blue-50", borderColor: "border-t-blue-400" },
  { id: "done", title: "✅ Done", color: "bg-green-50", borderColor: "border-t-green-400" },
];

export const CATEGORY_COLORS: Record<Category, { bg: string; text: string; label: string }> = {
  tools: { bg: "bg-blue-100", text: "text-blue-700", label: "🔧 Tools" },
  ideas: { bg: "bg-orange-100", text: "text-orange-700", label: "💡 Ideas" },
  articles: { bg: "bg-green-100", text: "text-green-700", label: "📰 Articles" },
  projects: { bg: "bg-purple-100", text: "text-purple-700", label: "🚀 Projects" },
  people: { bg: "bg-pink-100", text: "text-pink-700", label: "👤 People" },
  random: { bg: "bg-gray-100", text: "text-gray-700", label: "🎲 Random" },
};

export const ALL_CATEGORIES = Object.keys(CATEGORY_COLORS) as Category[];

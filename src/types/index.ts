export type ColumnId = "pinned" | "exploring" | "doing" | "done";

export interface Pin {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  column: ColumnId;
  createdAt: string;
  imageUrl?: string;
}

export interface Column {
  id: ColumnId;
  title: string;
  color: string;
}

export const COLUMNS: Column[] = [
  { id: "pinned", title: "📌 Pinned", color: "bg-red-100 border-red-300" },
  { id: "exploring", title: "🔍 Exploring", color: "bg-yellow-100 border-yellow-300" },
  { id: "doing", title: "⚡ Doing", color: "bg-blue-100 border-blue-300" },
  { id: "done", title: "✅ Done", color: "bg-green-100 border-green-300" },
];

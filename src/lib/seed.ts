import { Pin } from "@/types";

export const seedPins: Pin[] = [
  {
    id: "1",
    title: "Next.js Documentation",
    description: "The React framework for production - building full-stack web applications.",
    url: "https://nextjs.org/docs",
    category: "Development",
    column: "pinned",
    createdAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "2",
    title: "Tailwind CSS",
    description: "A utility-first CSS framework for rapidly building custom designs.",
    url: "https://tailwindcss.com",
    category: "Design",
    column: "pinned",
    createdAt: "2026-01-16T10:00:00Z",
  },
  {
    id: "3",
    title: "React Server Components",
    description: "Exploring the new RSC paradigm for server-rendered React apps.",
    url: "https://react.dev/reference/rsc/server-components",
    category: "Development",
    column: "exploring",
    createdAt: "2026-02-01T10:00:00Z",
  },
  {
    id: "4",
    title: "GitHub API Docs",
    description: "REST API documentation for GitHub - repos, issues, and more.",
    url: "https://docs.github.com/en/rest",
    category: "Development",
    column: "exploring",
    createdAt: "2026-02-10T10:00:00Z",
  },
  {
    id: "5",
    title: "Pinboard App",
    description: "Building a kanban-style pinboard with drag and drop support.",
    url: "https://github.com/TarunTomar122/pinboard",
    category: "Project",
    column: "doing",
    createdAt: "2026-03-01T10:00:00Z",
  },
  {
    id: "6",
    title: "TypeScript Handbook",
    description: "Complete guide to TypeScript for JavaScript developers.",
    url: "https://www.typescriptlang.org/docs/handbook/",
    category: "Development",
    column: "done",
    createdAt: "2026-01-01T10:00:00Z",
  },
];

export const CATEGORIES = ["Development", "Design", "Project", "Research", "Other"];

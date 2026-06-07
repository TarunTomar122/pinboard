import { Pin } from "@/types";

export const seedPins: Pin[] = [
  {
    id: "1",
    title: "Google Colab CLI",
    description: "GPU provisioning from terminal — run local scripts on remote Colab runtimes. Zero-friction A100/T4 access, agent-ready.",
    url: "https://developers.googleblog.com/introducing-the-google-colab-cli/",
    category: "tools",
    column: "pinned",
    notes: "Relevant for MSc dissertation work. Could integrate with Hermes. Try with visual context compression pipeline.",
    createdAt: "2026-06-07T10:00:00Z",
  },
  {
    id: "2",
    title: "Wayve — VLA Models",
    description: "#1 target company for post-MSc. London-based, building vision-language-action models for autonomous driving.",
    url: "https://wayve.ai",
    category: "people",
    column: "pinned",
    notes: "Check their careers page regularly. Dissertation on visual context compression could be a strong fit.",
    createdAt: "2026-06-01T10:00:00Z",
  },
  {
    id: "3",
    title: "Edoardo Ponti — Efficient LLM Inference",
    description: "Target professor #1 at Edinburgh. Research on KV cache compression, AToM project, Miniml.AI.",
    url: "https://homepages.inf.ed.ac.uk/eponti/",
    category: "people",
    column: "exploring",
    notes: "Email week 1 October with NanoChat connection. His KV cache work aligns with visual token compression.",
    createdAt: "2026-05-15T10:00:00Z",
  },
  {
    id: "4",
    title: "Visual Context Compression for VLA",
    description: "Dissertation direction — extending NanoChat work to real-time VLA inference. Target: EMNLP/CoRL/TinyML workshop paper.",
    url: "",
    category: "ideas",
    column: "exploring",
    notes: "Core thesis: compression is all we need for on-device multimodal. 64× visual token compression from NanoChat as foundation.",
    createdAt: "2026-06-05T10:00:00Z",
  },
];

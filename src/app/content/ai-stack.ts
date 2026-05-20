import type { Skill } from "@/app/content/skills";

/**
 * Curated AI stack featured in the AI section. Distinct from the general
 * skills marquee (`./skills.ts`) — these are the tools and capabilities
 * the AI section's constellation showcases, in the visual order they
 * arrive on screen.
 *
 * Icon resolution (handled by ai-graph.tsx):
 *   1. simple-icons lookup using the `si*` key (e.g. `siAnthropic`).
 *   2. If that misses, fall back to `extra-brand-icons.ts` keyed by the
 *      lowercase brand slug (e.g. `openai`) — used for brands simple-icons
 *      doesn't ship.
 *   3. `icon: null` renders a typeset text tile (intentional for
 *      capabilities like RAG / Evals / Workflows, which are not brands).
 */
const aiStack: Skill[] = [
  {
    label: "Claude SDK",
    icon: "siAnthropic",
    href: "https://www.anthropic.com",
  },
  { label: "OpenAI SDK", icon: "openai", href: "https://openai.com" },
  {
    label: "Claude Code",
    icon: "siClaude",
    href: "https://claude.com/claude-code",
  },
  {
    label: "LangChain",
    icon: "siLangchaincorporate",
    href: "https://www.langchain.com",
  },
  {
    label: "LangGraph",
    icon: "siLanggraph",
    href: "https://www.langchain.com/langgraph",
  },
  { label: "Langfuse", icon: null },
  { label: "RAG", icon: null },
  { label: "Evals", icon: null },
  { label: "Workflows", icon: null },
];

export default aiStack;

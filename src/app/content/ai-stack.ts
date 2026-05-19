import type {Skill} from '@/app/content/skills';

/**
 * Curated AI stack featured in the AI section. Distinct from the general
 * skills marquee (`./skills.ts`) — these are the tools and capabilities
 * the AI section's constellation showcases, in the visual order they
 * arrive on screen.
 *
 * `icon: null` items render as typeset text tiles via the existing
 * `SkillIcon` fallback (siOpenai and siLangfuse are not in simple-icons
 * 16.20.0; RAG/Evals/Workflows are capabilities, not brands).
 */
const aiStack: Skill[] = [
  {label: 'Claude SDK', icon: 'siAnthropic'},
  {label: 'OpenAI SDK', icon: null},
  {label: 'Claude Code', icon: 'siClaude'},
  {label: 'LangChain', icon: 'siLangchain'},
  {label: 'LangGraph', icon: 'siLanggraph'},
  {label: 'Langfuse', icon: null},
  {label: 'RAG', icon: null},
  {label: 'Evals', icon: null},
  {label: 'Workflows', icon: null},
];

export default aiStack;

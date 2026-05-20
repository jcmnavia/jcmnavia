import type {Skill} from '@/app/content/skills';

/**
 * The stack this portfolio is actually built on. Surfaced in the "Built
 * with" attribution strip beneath the About section — honest credit for
 * the tools that did the work, deliberately compact so it reads as a
 * caption, not another feature section.
 *
 * Icon resolution and rendering follow the same pattern as the AI graph
 * (`resolveIcon()` checks simple-icons first, then `extra-brand-icons.ts`).
 * All 7 icons here resolve directly from simple-icons 16.20.0 — verified
 * at build time of this module. siFramer is the canonical mark for the
 * library now called "motion" (renamed from framer-motion), kept as
 * such by simple-icons; we display "Motion" but use siFramer as the
 * icon source.
 */
const builtWith: Skill[] = [
  {label: 'Next.js', icon: 'siNextdotjs', href: 'https://nextjs.org'},
  {label: 'React', icon: 'siReact', href: 'https://react.dev'},
  {
    label: 'Tailwind CSS',
    icon: 'siTailwindcss',
    href: 'https://tailwindcss.com',
  },
  {label: 'Motion', icon: 'siFramer', href: 'https://motion.dev'},
  {
    label: 'Claude Code',
    icon: 'siClaude',
    href: 'https://claude.com/claude-code',
  },
  {label: 'Vercel', icon: 'siVercel', href: 'https://vercel.com'},
  {
    label: 'GitHub Pages',
    icon: 'siGithubpages',
    href: 'https://pages.github.com',
  },
];

export default builtWith;

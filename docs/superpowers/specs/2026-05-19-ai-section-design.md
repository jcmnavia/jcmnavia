# AI Section — Design Spec

**Date:** 2026-05-19
**Owner:** Juan Camilo Marín Navia
**Status:** Approved design, pending user spec review
**Branch:** `redesign/scrapbook-pop`

## 1. Goal

Add a dedicated AI section to the portfolio that frames the owner as an **AI-native engineer** — identity, not project. Make it visibly stand out from the other sections by carrying a heavier, single-shot dramatic arrival animation, while staying within the existing scrapbook B2 aesthetic (no SaaS-floaty orbs, no glow, no gradient text).

This section signals the freshest, most differentiated capability in the senior/staff narrative. Visitors who skim should immediately register: *recent, deep, current.*

## 2. Scope

**In scope:**
- New `<AI />` section between `<Header />` and `<Work />`.
- New Nav anchor `AI` (`#ai`) at position 0 (becomes 5 links: AI, Work, Skills, Education, About).
- New typed content module `src/app/content/ai-stack.ts` with 9 items.
- Featured-constellation layout: 4 logos + 5 text tiles at varying sizes and positions (desktop); flex-wrap grid on mobile.
- Single dramatic arrival animation (~1.8s total): off-screen corners arcing in with rotation correction, stagger overlap.
- Anti-cliché: no gradients, no blur, no glow, no particle systems, no "✨ AI" badges. Brand register stays scrapbook B2.

**Out of scope:**
- No changes to existing skills marquee (the AI stack is curated separately).
- No new icon system — reuses existing `SkillIcon` primitive.
- No new color tokens — reuses existing OKLCH palette.
- No idle/loop motion — section becomes static after arrival.

**Inherits:** Existing motion principles (ease-out-expo, transform/opacity only, `useReducedMotion` respected); existing typography stack; existing OKLCH theme tokens (light + dark).

## 3. Spec relationships

- **Redesign spec** (`2026-05-19-portfolio-redesign-design.md`): the AI section is a new section addition. Update its §7 layouts to mention the AI section as the first content section.
- **Parallax backdrop spec** (`2026-05-19-parallax-backdrop-design.md`): unrelated; the parallax persists behind the AI section like every other section. The AI section's z-index of normal flow keeps it above the `-z-10` backdrop.

## 4. Approach

**Single client component + typed content + nav anchor + page assembly edit.**

- Component: `AI` — client component (uses `useInView` + `useReducedMotion`).
- Mount: inserted in `src/app/page.tsx` between `<Header />` and `<Work />`.
- Nav: `src/app/components/sections/nav.tsx` `LINKS` array gets `{label: 'AI', href: '#ai'}` prepended.
- Reuses existing `SectionHeading` (kicker + display headline with italic clash), `SkillIcon` (logo-or-text-tile fallback for the 9 items).
- Does NOT use the existing `Reveal` wrapper — this section gets its own custom arrival logic.

Rejected alternatives:
- **Per-item Reveal**: would render as 9 sequential entrances, not one orchestrated assemble — wrong feel for "stand out".
- **Appending to `skills.ts`**: tangles the curated AI stack with the rotating skill marquee — fights the "featured constellation" intent.
- **Scroll-tied throughout**: explicitly rejected during clarification (the user chose single dramatic arrival).

## 5. File Structure

```
src/app/components/sections/ai.tsx         CREATE — client component, constellation + arrival
src/app/content/ai-stack.ts                CREATE — typed Skill[] of 9 AI items
src/app/components/sections/nav.tsx        MODIFY — prepend AI to LINKS
src/app/page.tsx                           MODIFY — insert <AI /> between <Header /> and <Work />
docs/superpowers/specs/
  2026-05-19-portfolio-redesign-design.md  MODIFY — §7 mention new AI section
```

One new component, one new content module, two small modifications, one spec text update.

## 6. Content — the 9 AI stack items

Lives in `src/app/content/ai-stack.ts`, exported as `Skill[]` (same type as `src/app/content/skills.ts`).

| Order | Label | `icon` value | Rendering |
|---|---|---|---|
| 1 | Claude SDK | `'siAnthropic'` | logo (Anthropic mark) |
| 2 | OpenAI SDK | `null` | text tile |
| 3 | Claude Code | `'siClaude'` | logo |
| 4 | LangChain | `'siLangchain'` | logo |
| 5 | LangGraph | `'siLanggraph'` | logo |
| 6 | Langfuse | `null` | text tile |
| 7 | RAG | `null` | text tile (capability) |
| 8 | Evals | `null` | text tile (capability) |
| 9 | Workflows | `null` | text tile (capability) |

Verified during exploration: `siAnthropic`, `siClaude`, `siLangchain`, `siLanggraph` all exist in `simple-icons@16.20.0`. `siOpenai` and `siLangfuse` do NOT exist (brand-policy removed or never added) — they render as text tiles, consistent with the established AWS/LinkedIn/SQL fallback pattern.

## 7. Copy

```
Kicker:    // 1.5 yrs building AI agents
Headline:  AI is how I build now.
           (the word "how" rendered as Spectral-italic clay accent via <em>)
Sub:       Production agents, RAG and evals across OpenAI & Anthropic stacks.
           Shipped with Claude SDK, LangChain, LangGraph, Langfuse.
```

Voice notes:
- "AI is *how* I build now" — process-level identity statement, not "I use AI".
- Sub-line names concrete capability+stack pairs to earn the headline.
- No "the future of", no "✨", no "powered by AI" — those are product-page registers, not portfolio.

## 8. Visual Layout

### Section frame

```
section#ai
  mx-auto max-w-6xl px-6 py-[clamp(5rem,12vh,9rem)]
  relative
  background: --background (no new color)
```

The parallax backdrop spec persists behind this section like every other section. AI section's normal-flow z-index sits above `-z-10`.

### Constellation container

```
div.constellation
  relative h-[clamp(440px,60vh,640px)]
  desktop: items absolutely positioned (see table)
  mobile (<md): flex flex-wrap gap-4 justify-center (items render at uniform sizes in DOM order)
```

### Item positions (desktop only)

| Item | top | left/right | Size |
|---|---|---|---|
| Claude SDK (anchor logo, biggest) | 8vh | left: 42% | 96×96px circle |
| OpenAI SDK | 22vh | left: 12% | text tile, lg |
| Claude Code | 38vh | left: 8% | 64×64px circle |
| LangChain | 42vh | right: 22% | 72×72px circle |
| LangGraph | 6vh | right: 10% | 54×54px circle |
| Langfuse | 24vh | right: 32% | text tile, md |
| RAG | 52vh | right: 8% | text tile, lg |
| Evals | 30vh | right: 4% | text tile, md |
| Workflows | 50vh | left: 42% | text tile, md |

### Item visual treatment

**Logo items** (4):
- `bg-card` cream paper, `border border-border` (1px warm), circle (`rounded-full`), `shadow-lg`.
- SVG `fill-current` with `text-foreground` (dark ink).
- Hover: rotates 6° + shadow upgrades to `shadow-xl`, 300ms ease-out.

**Text tiles** (5):
- `bg-foreground` dark ink, `text-background` cream, `font-mono` uppercase tracking `0.04em`, padding `8px 14px`, `rounded-md`.
- Two sizes: `md` (text-xs, padding 8px 14px) and `lg` (text-sm, padding 10px 18px).
- Sub-type distinction: "tool" tiles (OpenAI SDK, Langfuse) and "capability" tiles (RAG, Evals, Workflows). The 3 capability tiles get a hover behavior that the 2 tool tiles do NOT: a 2px `bg-accent` left border slides in (implementation: `box-shadow: inset 2px 0 0 var(--color-accent)` transitioning from `0 0 0 var(--color-accent)`).
- All tiles: subtle drop shadow matching logo items.

### Section heading + copy

Anchors at bottom of section, outside the constellation:

```
div.copy
  absolute bottom: 6vh, left: 0
  desktop: spans left half of viewport
  mobile: relative below the constellation grid
```

Uses existing `SectionHeading` primitive with the kicker + headline. The sub-line follows the existing `font-body text-muted-foreground max-w-[44ch]` pattern from `Header`.

## 9. Motion — the dramatic arrival

### Trigger

`useInView` from framer-motion, `once: true`, `viewport: {margin: '-100px'}`. Once fired, section becomes static — no idle motion, no loop.

### Arrival sequence (~1.8s total, choreographed)

| Time | What happens |
|---|---|
| 0.0s | All items at `opacity: 0`, positioned at off-screen corners (translateX/Y ±160px, `scale: 0.7`, `rotate: ±8deg` per quadrant). Anthropic anchor at center (`translateY: 40, scale: 0.4`). Copy at `opacity: 0, translateY: 16`. |
| 0.10s | Anthropic anchor begins arriving (center pop). |
| 0.16s | First peripheral items begin orbiting in from corners. |
| 0.16–1.0s | 8 more items arrive in overlapping ~900ms ease-out-expo arcs. Stagger increments ~80ms between items. Each item translates to `0,0`, scales to `1`, rotates to `0deg`. |
| 0.85s | Copy block reveals (`opacity: 0→1, translateY: 16→0`, 800ms). |
| 1.0s | Final item lands. |
| 1.8s | Sequence complete. Section static. |

All eases: `[0.16, 1, 0.3, 1]` (ease-out-expo, matching the rest of the codebase).
All animated properties: `transform` and `opacity` only (per existing motion principles).

### Reduced motion path

`useReducedMotion()` truthy →
- Items render at final positions with `opacity: 1, transform: none` immediately.
- Copy renders at final position with `opacity: 1` immediately.
- Hover micro-interactions remain available (they're CSS, not scroll-tied).
- Section is fully readable from first paint.

### Hover micro-interactions (always on)

- **Logo circles**: 6° rotation + `shadow-xl` upgrade, 300ms ease-out.
- **Capability tiles** (RAG / Evals / Workflows): 2px clay-accent left border slides in (uses `box-shadow: inset 2px 0 0 var(--color-accent)` for free composite performance).
- **All tiles**: cursor stays default (these are not interactive — they're labels). No click handlers.

## 10. Nav integration

`src/app/components/sections/nav.tsx` `LINKS` array changes from:

```ts
const LINKS = [
  {label: 'Work', href: '#work'},
  {label: 'Skills', href: '#skills'},
  {label: 'Education', href: '#education'},
  {label: 'About', href: '#about'},
];
```

to:

```ts
const LINKS = [
  {label: 'AI', href: '#ai'},
  {label: 'Work', href: '#work'},
  {label: 'Skills', href: '#skills'},
  {label: 'Education', href: '#education'},
  {label: 'About', href: '#about'},
];
```

5 items still fit the desktop nav comfortably. Mobile overlay shows 5 items at the existing display-text-3xl size; vertical stack handles 5 the same way it handled 4.

## 11. Page assembly

`src/app/page.tsx`:

```tsx
import {AI} from '@/app/components/sections/ai';
// ... existing imports

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Header />
        <AI />             {/* NEW — between Header and Work */}
        <Work />
        <SkillsMarquee />
        <Education />
        <About />
      </main>
      <Footer />
    </>
  );
}
```

## 12. Theming

Reuses existing OKLCH tokens. No new color introduction.
- Light mode: cream `bg-card` circles on warm-cream `--background`, dark `bg-foreground` text tiles → high contrast.
- Dark mode: dark `bg-card` (espresso shade) circles on `--background` (espresso), cream `bg-foreground` text tiles → inverted contrast preserved.

Both themes verified WCAG-friendly via the existing palette (already audited in the prior whole-implementation review).

## 13. Accessibility

- Section has `id='ai'` for anchor linking.
- Constellation items have no interactive role (they are labels, not buttons/links) — no keyboard focus, no aria-pressed, no aria-label needed beyond the visible text.
- Logo SVGs include `role='img'` and `aria-hidden='true'` (decorative — adjacent text label provides accessible name).
- Reduced motion path renders the section instantly with all content present.
- Headline (`<h2>`) maintains correct semantic outline as the second-level heading after the hero `<h1>`.
- Color contrast already verified by the redesign whole-implementation review (clay on cream 5.87:1, cream on espresso 12+:1).

## 14. Performance

- Single client component; no additional bundle weight beyond `useInView` (already imported by `Reveal`).
- All motion drives `transform` / `opacity` (GPU composited).
- `will-change: transform, opacity` on each animated layer during the arrival window; removed once the arrival completes (set via JS conditional or pruned via the `useInView` boolean toggling a `data-arrived` attribute).
- 9 elements animating in parallel for ~1s is well within budget for any post-2018 device. Tested mentally against the existing parallax + marquee already concurrent — no contention.
- No layout-affecting properties animated. No reflow.

## 15. Risks & Mitigations

- **"It crosses the SaaS-AI-cliché line"** — Mitigated by the visual rules: no glow, no gradient blob, no particle system, no blur. The vocabulary stays scrapbook (cream paper circles, ink text tiles, ease-out-expo motion). Brand register holds.
- **"Arrival overruns and feels long"** — 1.8s budget is calibrated to feel cinematic without being annoying. Most items arrive in the 0.6–1.0s window; the budget is dominated by overlap, not total duration. If user feedback indicates it's too long during the polish pass, the stagger increment can be reduced from 80ms to 50ms.
- **"Constellation positions break on weird viewport ratios"** — Mitigated by the `h-[clamp(440px,60vh,640px)]` container and `vh` + `%` units on positions. On mobile (<md), absolute positioning is disabled entirely in favor of a flex-wrap grid.
- **"AI section heading kicker repeats the `// {profile.title}` antipattern flagged in the prior whole-implementation review"** — Avoided. The AI section's kicker is `// 1.5 yrs building AI agents` (section-specific, not the global profile title). Different content per section is the spirit of the spec's anti-pattern note.

## 16. Verification

- `pnpm build` exits 0, no Sass warnings, `out/index.html` generated.
- `pnpm lint` and `pnpm exec tsc --noEmit` both exit 0.
- Static HTML inspection: `grep -c "AI is how I build now" out/index.html` ≥ 1, `grep -c "1.5 yrs building AI agents" out/index.html` ≥ 1, `grep -c 'href="#ai"' out/index.html` ≥ 1 (proves both Nav link and section anchor render).
- Manual visual: scroll to AI section; observe orchestrated arrival (single shot, ~1.8s), then static state; hover logos rotate 6°; hover capability tiles show left border slide-in.
- Manual reduced-motion: emulate `prefers-reduced-motion: reduce`; confirm section renders fully static (no arrival animation, hover micro-interactions remain functional).
- Manual responsive: 360px / 768px / 1024px / 1440px — constellation collapses to wrap grid on mobile; copy block flows below it.

## 17. Out-of-Scope Follow-ups

- A future "Featured AI Projects" sub-section (case studies) could replace or augment the constellation if the owner wants project-level evidence. Not in this spec.
- Idle/ambient motion on the constellation after arrival (subtle drift on individual items) — explicitly rejected during clarification (the user chose "single dramatic arrival moment", not "arrival + ambient idle"). Worth revisiting if the section feels too static after multiple visits.

# AI Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a dedicated "AI-native engineer" section between Header and Work — a featured constellation of 9 AI stack items (4 logos + 5 text tiles) that arrives with a single dramatic ~1.8s orchestrated animation, then stays static. Reuses existing scrapbook B2 vocabulary; no SaaS-floaty / glow / gradient.

**Architecture:** One new client component (`AI`) with constellation positioning + per-item `whileInView` arrival, one new typed content module (`ai-stack.ts`), nav gets a 5th anchor link (AI prepended), page.tsx inserts the new section between `<Header />` and `<Work />`. Reuses `SectionHeading`, `SkillIcon`, and theme tokens. No new dependencies.

**Tech Stack:** Next.js 16 App Router, React 19, framer-motion v12 (`whileInView` + `useReducedMotion`, already installed), Tailwind CSS v4, `simple-icons` (already installed).

**Spec:** `docs/superpowers/specs/2026-05-19-ai-section-design.md`

**Branch:** `redesign/scrapbook-pop` (all previous redesign + parallax work committed).

---

## Verified Facts (from pre-plan investigation)

- `framer-motion@12.39.0` exports `whileInView`-capable `motion.*` components, `useReducedMotion`, `useInView` (all confirmed). The new section uses `whileInView` per item with custom per-item delays (NOT the simpler `Reveal` wrapper, because the orchestrated 80ms stagger across 9 items + corner-arc per-item variation needs per-element control).
- `SectionHeading` props are `{kicker: string, children: ReactNode, id?: string, className?: string}` — heading is `<h2>`, the `<em>` clash is auto-styled by the `[&_em]:` selectors.
- `SkillIcon` props are `{skill: Skill}` where `Skill = {label: string, icon: string | null}`. It already renders a logo when `icon` resolves in simple-icons, else a text tile.
- `simple-icons` coverage for AI stack (verified at runtime): `siAnthropic` ✓, `siClaude` ✓, `siLangchain` ✓, `siLanggraph` ✓; `siOpenai` MISSING; `siLangfuse` MISSING. The 2 missing fall back to text tiles via `icon: null` — same fallback pattern used by AWS/SQL/VS Code/LinkedIn elsewhere in the project.
- Current `Nav` `LINKS` array (lines 7–12 of `src/app/components/sections/nav.tsx`) is exactly `[Work, Skills, Education, About]`. AI gets prepended.
- Current `src/app/page.tsx` order is `<Header /> <Work /> <SkillsMarquee /> <Education /> <About />` inside `<main>`. AI gets inserted between Header and Work.
- The redesign spec's §7 (Section Layouts) currently lists Nav, Header, Work, Skills, Education, About, Footer — adding AI to that list as the first content section.
- No test framework configured. Verification is via build + lint + tsc + static-HTML grep + manual scroll/reduced-motion check (same pattern as parallax-backdrop plan).

## File Structure

```
src/app/content/ai-stack.ts                CREATE — typed Skill[] of 9 AI items
src/app/components/sections/ai.tsx         CREATE — client component, constellation + arrival
src/app/components/sections/nav.tsx        MODIFY — prepend {label:'AI', href:'#ai'} to LINKS
src/app/page.tsx                           MODIFY — import AI, insert between Header and Work
docs/superpowers/specs/
  2026-05-19-portfolio-redesign-design.md  MODIFY — §7 mention AI section as first content section
```

**Verification commands (used throughout):**
- Build: `pnpm build` → expect exit 0, "Compiled successfully", `out/index.html` generated, no Sass warnings.
- Lint: `pnpm lint` → expect 0 errors.
- Types: `pnpm exec tsc --noEmit` → expect exit 0.

---

## Task 1: Create ai-stack content module

**Files:**
- Create: `src/app/content/ai-stack.ts`

- [ ] **Step 1: Create the typed content module**

Write `src/app/content/ai-stack.ts` with EXACTLY this content:

```ts
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
```

- [ ] **Step 2: Verify types**

Run: `pnpm exec tsc --noEmit; echo "TSC=$?"`
Expected: `TSC=0`. If TS complains about the `Skill` import from `'@/app/content/skills'`, confirm the existing skills.ts exports `Skill` as a named type (it does — verified during investigation).

- [ ] **Step 3: Commit**

```bash
git add src/app/content/ai-stack.ts
git commit -m "feat: ai-stack content module (9 curated AI stack items)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Create the AI section component

**Files:**
- Create: `src/app/components/sections/ai.tsx`

- [ ] **Step 1: Create the AI section component**

Write `src/app/components/sections/ai.tsx` with EXACTLY this content:

```tsx
'use client';

import {motion, useReducedMotion} from 'framer-motion';
import aiStack from '@/app/content/ai-stack';
import {SectionHeading} from '@/app/components/primitives/section-heading';
import {SkillIcon} from '@/app/components/primitives/skill-icon';
import {cn} from '@/app/lib/cn';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Per-item constellation arrival metadata.
 *
 * `from` is the off-screen origin quadrant for the entrance:
 *   - 'tl' / 'tr' / 'bl' / 'br' = arc from that corner (translate ±160 / ±120, rotate ±8deg)
 *   - 'c' = scale-pop from center (translateY 40, scale 0.4 → 1)
 *
 * `delay` is the per-item arrival delay in seconds. The anchor (Claude SDK)
 * arrives first (0.10s); peripheral items follow in overlapping ~80ms steps.
 *
 * Order in this array MATCHES the order of items in `src/app/content/ai-stack.ts`
 * and the indices used by `POSITIONS_BY_INDEX` and `CAPABILITY_INDICES` below.
 * Keep all four aligned when reordering.
 */
const ITEMS: Array<{
  from: 'tl' | 'tr' | 'bl' | 'br' | 'c';
  delay: number;
  size: 'logo-lg' | 'logo-md' | 'logo-sm' | 'tile-lg' | 'tile-md';
}> = [
  {from: 'c', delay: 0.1, size: 'logo-lg'}, // 0 Claude SDK
  {from: 'tl', delay: 0.2, size: 'tile-lg'}, // 1 OpenAI SDK
  {from: 'bl', delay: 0.28, size: 'logo-sm'}, // 2 Claude Code
  {from: 'br', delay: 0.34, size: 'logo-md'}, // 3 LangChain
  {from: 'tr', delay: 0.22, size: 'logo-sm'}, // 4 LangGraph
  {from: 'tr', delay: 0.4, size: 'tile-md'}, // 5 Langfuse
  {from: 'br', delay: 0.46, size: 'tile-lg'}, // 6 RAG
  {from: 'tr', delay: 0.52, size: 'tile-md'}, // 7 Evals
  {from: 'bl', delay: 0.58, size: 'tile-md'}, // 8 Workflows
];

/**
 * Tailwind JIT only extracts class strings that appear LITERALLY in source
 * (it can't follow runtime template strings). Each `top-[Xvh]` / `left-[X%]`
 * / `right-[X%]` arbitrary value therefore has to appear as a static string.
 * Indexed by the same `i` as `ITEMS` and `aiStack`.
 */
const POSITIONS_BY_INDEX = [
  'md:top-[8vh] md:left-[42%]', // 0 Claude SDK (anchor)
  'md:top-[22vh] md:left-[12%]', // 1 OpenAI SDK
  'md:top-[38vh] md:left-[8%]', // 2 Claude Code
  'md:top-[42vh] md:right-[22%]', // 3 LangChain
  'md:top-[6vh] md:right-[10%]', // 4 LangGraph
  'md:top-[24vh] md:right-[32%]', // 5 Langfuse
  'md:top-[52vh] md:right-[8%]', // 6 RAG
  'md:top-[30vh] md:right-[4%]', // 7 Evals
  'md:top-[50vh] md:left-[42%]', // 8 Workflows
];

/**
 * Capability tiles (RAG / Evals / Workflows). They get the clay left-border
 * hover affordance that "tool" tiles (OpenAI SDK, Langfuse) deliberately do
 * not get. Indexed by the same `i` as ITEMS / aiStack / POSITIONS_BY_INDEX.
 */
const CAPABILITY_INDICES = new Set<number>([6, 7, 8]);

function sizeClasses(size: (typeof ITEMS)[number]['size']) {
  switch (size) {
    case 'logo-lg':
      return 'h-24 w-24';
    case 'logo-md':
      return 'h-[72px] w-[72px]';
    case 'logo-sm':
      return 'h-16 w-16';
    case 'tile-lg':
    case 'tile-md':
      return ''; // tile sizing comes from SkillIcon's internal class
  }
}

function initialTransform(from: (typeof ITEMS)[number]['from']) {
  switch (from) {
    case 'tl':
      return {x: -160, y: -120, scale: 0.7, rotate: -8};
    case 'tr':
      return {x: 160, y: -120, scale: 0.7, rotate: 8};
    case 'bl':
      return {x: -160, y: 140, scale: 0.7, rotate: 8};
    case 'br':
      return {x: 160, y: 140, scale: 0.7, rotate: -8};
    case 'c':
      return {x: 0, y: 40, scale: 0.4, rotate: 0};
  }
}

export function AI() {
  const reduced = useReducedMotion();
  const finalState = {opacity: 1, x: 0, y: 0, scale: 1, rotate: 0};

  return (
    <section
      id='ai'
      className='mx-auto max-w-6xl px-6 py-[clamp(5rem,12vh,9rem)]'
    >
      {/*
        Constellation container.
        - Desktop (md+): items absolutely positioned via POSITIONS_BY_INDEX.
        - Mobile (<md): flex-wrap grid; absolute positions ignored.
        Heading + sub-line render OUTSIDE the constellation on desktop
        (bottom-left), ABOVE the wrapped grid on mobile.
      */}
      <div className='relative flex h-auto flex-col gap-10 md:h-[clamp(440px,60vh,640px)]'>
        {/* Mobile heading: above the wrap-grid */}
        <div className='md:hidden'>
          <SectionHeading kicker='// 1.5 yrs building AI agents'>
            AI is <em>how</em> I build now.
          </SectionHeading>
          <p className='mt-4 max-w-[44ch] font-body text-muted-foreground'>
            Production agents, RAG and evals across OpenAI &amp; Anthropic
            stacks. Shipped with Claude SDK, LangChain, LangGraph, Langfuse.
          </p>
        </div>

        {/* Constellation: flex-wrap on mobile, absolute layout on md+ */}
        <div className='flex flex-wrap items-start justify-center gap-4 md:block'>
          {aiStack.map((skill, i) => {
            const meta = ITEMS[i];
            const isCapability = CAPABILITY_INDICES.has(i);
            const isLogo = meta.size.startsWith('logo');

            return (
              <motion.div
                key={skill.label}
                className={cn(
                  'md:absolute',
                  POSITIONS_BY_INDEX[i],
                  isLogo && sizeClasses(meta.size),
                  isCapability &&
                    !isLogo &&
                    'transition-shadow duration-300 hover:shadow-[inset_2px_0_0_var(--color-accent)]'
                )}
                initial={reduced ? finalState : {opacity: 0, ...initialTransform(meta.from)}}
                whileInView={finalState}
                viewport={{once: true, margin: '-100px'}}
                transition={{
                  duration: 0.9,
                  delay: reduced ? 0 : meta.delay,
                  ease: EASE,
                }}
              >
                {isLogo ? (
                  <div
                    className={cn(
                      'flex h-full w-full items-center justify-center rounded-full border border-border bg-card shadow-lg transition-[transform,box-shadow] duration-300 hover:rotate-6 hover:shadow-xl',
                      '[&_svg]:h-[55%] [&_svg]:w-[55%]'
                    )}
                  >
                    <SkillIcon skill={skill} />
                  </div>
                ) : (
                  <SkillIcon skill={skill} />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Desktop heading: bottom-left of the constellation */}
        <div className='hidden md:absolute md:bottom-[6vh] md:left-0 md:right-1/2 md:block'>
          <motion.div
            initial={reduced ? {opacity: 1, y: 0} : {opacity: 0, y: 16}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true, margin: '-100px'}}
            transition={{duration: 0.8, delay: reduced ? 0 : 0.85, ease: EASE}}
          >
            <SectionHeading kicker='// 1.5 yrs building AI agents'>
              AI is <em>how</em> I build now.
            </SectionHeading>
            <p className='mt-4 max-w-[44ch] font-body text-muted-foreground'>
              Production agents, RAG and evals across OpenAI &amp; Anthropic
              stacks. Shipped with Claude SDK, LangChain, LangGraph, Langfuse.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify types + lint**

Run: `pnpm exec tsc --noEmit; echo "TSC=$?"` (expect 0)
Run: `pnpm lint; echo "LINT=$?"` (expect 0)

If TS complains about `[&_svg]:h-[55%]` arbitrary selectors or the `hover:shadow-[inset_2px_0_0_var(--color-accent)]` arbitrary shadow, those are valid Tailwind v4 arbitrary-value classes — report the exact error before changing anything, but they should compile.

If lint flags `Set` initialization without a type annotation, the code already uses `new Set<number>([6, 7, 8])` to preempt that — confirm that line is intact.

- [ ] **Step 3: Commit**

```bash
git add src/app/components/sections/ai.tsx
git commit -m "feat: AI section component (constellation + dramatic arrival)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Add AI to Nav LINKS

**Files:**
- Modify: `src/app/components/sections/nav.tsx`

- [ ] **Step 1: Prepend the AI link**

In `src/app/components/sections/nav.tsx`, the current LINKS array (lines 7–12) is:

```ts
const LINKS = [
  {label: 'Work', href: '#work'},
  {label: 'Skills', href: '#skills'},
  {label: 'Education', href: '#education'},
  {label: 'About', href: '#about'},
];
```

Replace it with:

```ts
const LINKS = [
  {label: 'AI', href: '#ai'},
  {label: 'Work', href: '#work'},
  {label: 'Skills', href: '#skills'},
  {label: 'Education', href: '#education'},
  {label: 'About', href: '#about'},
];
```

Make no other changes to the file.

- [ ] **Step 2: Verify lint + types**

Run: `pnpm exec tsc --noEmit; echo "TSC=$?"` (expect 0)
Run: `pnpm lint; echo "LINT=$?"` (expect 0)

- [ ] **Step 3: Commit**

```bash
git add src/app/components/sections/nav.tsx
git commit -m "feat: add AI link to nav

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Insert AI section into page.tsx

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Add the import**

In `src/app/page.tsx`, the current imports include `Header`, `Work`, `SkillsMarquee`, `Education`, `About`, `Footer`, `Nav`. Add a new import for `AI` immediately AFTER the Header import:

The current import block:
```tsx
import {Nav} from '@/app/components/sections/nav';
import {Header} from '@/app/components/sections/header';
import {Work} from '@/app/components/sections/work';
import {SkillsMarquee} from '@/app/components/sections/skills-marquee';
import {Education} from '@/app/components/sections/education';
import {About} from '@/app/components/sections/about';
import {Footer} from '@/app/components/sections/footer';
```

becomes:
```tsx
import {Nav} from '@/app/components/sections/nav';
import {Header} from '@/app/components/sections/header';
import {AI} from '@/app/components/sections/ai';
import {Work} from '@/app/components/sections/work';
import {SkillsMarquee} from '@/app/components/sections/skills-marquee';
import {Education} from '@/app/components/sections/education';
import {About} from '@/app/components/sections/about';
import {Footer} from '@/app/components/sections/footer';
```

- [ ] **Step 2: Insert `<AI />` in the JSX**

The current `<main>` block:
```tsx
      <main>
        <Header />
        <Work />
        <SkillsMarquee />
        <Education />
        <About />
      </main>
```

becomes:
```tsx
      <main>
        <Header />
        <AI />
        <Work />
        <SkillsMarquee />
        <Education />
        <About />
      </main>
```

Make no other changes to page.tsx.

- [ ] **Step 3: Build gate**

Run: `pnpm build 2>&1 | tail -10; echo "BUILD_EXIT=${PIPESTATUS[0]}"`
Expected: BUILD_EXIT=0, "Compiled successfully", `out/index.html` exists, NO Sass deprecation warnings.

Run: `pnpm exec tsc --noEmit; echo "TSC=$?"` (expect 0)
Run: `pnpm lint; echo "LINT=$?"` (expect 0)

- [ ] **Step 4: Verify the AI section rendered into the static HTML**

Run:
```bash
grep -c 'id="ai"' out/index.html
grep -c "AI is how I build now" out/index.html
grep -c "1.5 yrs building AI agents" out/index.html
grep -c 'href="#ai"' out/index.html
```
Expected:
- First count ≥ 1 (section element rendered).
- Second count ≥ 1 (headline rendered; appears once on desktop layout — may appear twice if both mobile + desktop heading copies are rendered by SSR, that's fine).
- Third count ≥ 1 (kicker rendered).
- Fourth count ≥ 2 (Nav desktop link + Nav mobile-overlay link). If only 1, the mobile overlay link is rendered conditionally (it is — `{open && ...}`) so 1 occurrence on initial render is also acceptable. Re-run with a check on the desktop link specifically: `grep -oE 'href="#ai"[^>]*>AI<' out/index.html | wc -l` — expect ≥ 1.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: mount AI section between Header and Work

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Update redesign spec §7 to mention the AI section

**Files:**
- Modify: `docs/superpowers/specs/2026-05-19-portfolio-redesign-design.md`

- [ ] **Step 1: Locate the §7 layout list**

In `docs/superpowers/specs/2026-05-19-portfolio-redesign-design.md`, §7 currently describes section layouts for Nav, Header, Work, Skills, Education, About, Footer in that order. Find the line that starts the **Header** layout description (`**Header (hero)**`), then insert a new section description immediately AFTER the Header block and BEFORE the Work block.

The new block to insert (verbatim):

```markdown
**AI** — Dedicated "AI-native engineer" identity section. Section kicker `// 1.5 yrs building AI agents` + headline ("AI is *how* I build now."). 9-item featured constellation (4 logos via simple-icons: Claude SDK / Claude Code / LangChain / LangGraph; 5 typeset text tiles: OpenAI SDK / Langfuse / RAG / Evals / Workflows) at varying sizes and positions on desktop, flex-wrap grid on mobile. Single dramatic ~1.8s arrival on `whileInView`: items arrive from off-screen corners arcing in with rotation correction; copy reveals last (~0.85s in). Static after arrival, no idle motion. Reduced-motion: renders fully static from first paint. Spec: `2026-05-19-ai-section-design.md`.
```

Run this command to do the insertion (uses `awk` to find the line containing the Work section start and inject above it):

```bash
awk '
  /^\*\*Work\*\* —/ && !inserted {
    print "**AI** — Dedicated \"AI-native engineer\" identity section. Section kicker `// 1.5 yrs building AI agents` + headline (\"AI is *how* I build now.\"). 9-item featured constellation (4 logos via simple-icons: Claude SDK / Claude Code / LangChain / LangGraph; 5 typeset text tiles: OpenAI SDK / Langfuse / RAG / Evals / Workflows) at varying sizes and positions on desktop, flex-wrap grid on mobile. Single dramatic ~1.8s arrival on `whileInView`: items arrive from off-screen corners arcing in with rotation correction; copy reveals last (~0.85s in). Static after arrival, no idle motion. Reduced-motion: renders fully static from first paint. Spec: `2026-05-19-ai-section-design.md`."
    print ""
    inserted = 1
  }
  { print }
' docs/superpowers/specs/2026-05-19-portfolio-redesign-design.md > /tmp/redesign-spec-updated.md \
  && mv /tmp/redesign-spec-updated.md docs/superpowers/specs/2026-05-19-portfolio-redesign-design.md
```

- [ ] **Step 2: Verify the edit landed**

Run:
```bash
grep -n "^\*\*AI\*\*" docs/superpowers/specs/2026-05-19-portfolio-redesign-design.md
```
Expected: 1 line printed showing the new `**AI** — Dedicated ...` block.

Run:
```bash
grep -nE "^\*\*(Header|AI|Work)\*\* —" docs/superpowers/specs/2026-05-19-portfolio-redesign-design.md
```
Expected: lines appear in this order: `**Header**`, `**AI**`, `**Work**`. If `**AI**` appears AFTER `**Work**`, the awk insertion went into the wrong place — undo with `git checkout` and retry the command.

- [ ] **Step 3: Commit**

```bash
git add docs/superpowers/specs/2026-05-19-portfolio-redesign-design.md
git commit -m "docs: add AI section to redesign spec layout list

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Final verification

**Files:** none (verification only)

- [ ] **Step 1: Full build/lint/types**

Run, in sequence:
1. `pnpm build 2>&1 | tail -10; echo "BUILD_EXIT=${PIPESTATUS[0]}"` — must be 0, "Compiled successfully", `out/index.html` exists, NO Sass deprecation warnings.
2. `pnpm lint; echo "LINT=$?"` — must be 0.
3. `pnpm exec tsc --noEmit; echo "TSC=$?"` — must be 0.

- [ ] **Step 2: Verify rendered static export contains AI content**

Run:
```bash
ls out/index.html out/.nojekyll out/404.html
grep -c 'id="ai"' out/index.html
grep -c "AI is how I build now" out/index.html
grep -c "1.5 yrs building AI agents" out/index.html
grep -c "Claude SDK" out/index.html
grep -c "OpenAI SDK" out/index.html
grep -c "LangGraph" out/index.html
grep -c "RAG" out/index.html
grep -c "Workflows" out/index.html
grep -c 'href="#ai"' out/index.html
```
Expected: all files exist; each grep ≥ 1. (Some labels like "RAG" / "Workflows" may appear multiple times due to mobile + desktop layout duplication — that's expected.)

- [ ] **Step 3: Verify foreground content of OTHER sections still renders (regression check)**

Run:
```bash
grep -c "Marín Navia" out/index.html
grep -c "Treble.ai" out/index.html
grep -c "yrs shipping" out/index.html
grep -c "What I" out/index.html
```
Expected: all ≥ 1. (Sanity: Hero name, Work company, parallax tape, Skills section heading still rendering after the page restructure.)

- [ ] **Step 4: Manual visual check (informational, not blocking)**

Run `pnpm dev` and open `http://localhost:3000`. Verify:
- New "AI" link appears in nav (first position before Work).
- Scrolling to AI section triggers the constellation arrival animation (single shot, ~1.8s, items arriving from off-screen corners).
- After arrival, hover on logo circles rotates them 6° with shadow upgrade.
- Hover on RAG/Evals/Workflows tiles shows clay accent left border slide-in.
- Hover on OpenAI SDK / Langfuse tiles does NOT show the left border (tool tiles distinction).
- Scrolling away and back: animation does NOT re-fire (one-shot, `once: true`).
- Mobile viewport (<768px): constellation collapses to vertical flex-wrap; copy block appears above the items.
- Headline reads "AI is *how* I build now." with *how* rendered in Spectral italic accent.

Then emulate `prefers-reduced-motion: reduce` in browser devtools. Reload. Confirm:
- All 9 items render at final positions immediately (no off-screen arrival).
- Copy is fully visible from first paint.
- Hover effects still work (logo rotation, capability border slide).

- [ ] **Step 5: Working tree + commit log**

Run: `git status --porcelain`
Expected: clean (the only acceptable untracked file is the implementation plan doc itself if it hasn't been committed; planning docs are not required to be committed per the existing pattern from parallax-backdrop).

Run: `git log --oneline main..HEAD | head -8`
Expected: at least 6 new commits since main: the AI section spec, the ai-stack content module, the AI component, the Nav update, the page.tsx insert, the redesign-spec doc edit.

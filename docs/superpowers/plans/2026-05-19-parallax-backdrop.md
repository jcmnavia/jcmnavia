# Parallax Backdrop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a subtle, on-brand scroll-driven parallax backdrop (4 layered scrapbook shapes drifting at different rates) behind the whole page, respecting `prefers-reduced-motion` and both light/dark themes.

**Architecture:** One new client component (`ParallaxBackdrop`) mounted once in `src/app/layout.tsx` as a sibling of `{children}` inside the existing `ThemeProvider`. Positioned `fixed` at `z-index: -1`, `pointer-events: none`. Uses `framer-motion`'s `useScroll` + `useTransform` to map `scrollY` to per-layer `translateY`. Reuses existing scrapbook vocabulary (`.paper-grain` recipe, `TapeLabel` primitive, theme color tokens). No new dependencies.

**Tech Stack:** Next.js 16 App Router, React 19, framer-motion v12 (already installed), Tailwind CSS v4. No new deps.

**Spec:** `docs/superpowers/specs/2026-05-19-parallax-backdrop-design.md`

**Branch:** `redesign/scrapbook-pop` (already created, all previous redesign work committed there).

---

## Verified Facts (from pre-plan investigation)

- `framer-motion@12.39.0` exports `useScroll`, `useTransform`, `useReducedMotion`, `motion` — all confirmed as functions at runtime.
- `src/app/layout.tsx` structure: `<html>` → `<body>` → `<ThemeProvider>` → `{children}`. Insertion point for `<ParallaxBackdrop />` is **inside `<ThemeProvider>`, as a sibling of `{children}`**.
- `TapeLabel` primitive at `src/app/components/primitives/tape-label.tsx` accepts `{children, tone?, rotate?, className?}` — the parallax wraps a `<motion.div>` around it for the scroll transform.
- The `profile` object at `src/app/content/profile.ts` exports `profile.yearsShipping` (currently `6`) — used as a string interpolation for the tape label content.
- The `.paper-grain` CSS utility already exists in `src/app/globals.css` (the recipe `radial-gradient(color-mix(in oklch, var(--color-accent) 7%, transparent) 1.5px, transparent 1.6px)` with `background-size: 14px 14px`). The parallax reuses it.
- The redesign spec at `docs/superpowers/specs/2026-05-19-portfolio-redesign-design.md` line 172 contains the literal text *"prefers-reduced-motion: marquee becomes static wrapped grid; entrance reveals become instant; no parallax."* — this gets updated in Task 3.
- No tests exist in the project (it's a static-export portfolio, no test framework configured). Verification is via build + lint + tsc + manual scroll check.

## File Structure

```
src/app/components/parallax/
  parallax-backdrop.tsx       CREATE — single client component with the 4 layers
src/app/layout.tsx            MODIFY — render <ParallaxBackdrop /> as sibling of children
docs/superpowers/specs/
  2026-05-19-portfolio-redesign-design.md  MODIFY — update §8 reduced-motion line
```

**Verification commands (used throughout):**
- Build: `pnpm build` → expect exit 0, "Compiled successfully", `out/index.html` generated.
- Lint: `pnpm lint` → expect 0 errors.
- Types: `pnpm exec tsc --noEmit` → expect exit 0.

---

## Task 1: Create ParallaxBackdrop component

**Files:**
- Create: `src/app/components/parallax/parallax-backdrop.tsx`

- [ ] **Step 1: Create the component file**

Write `src/app/components/parallax/parallax-backdrop.tsx` with EXACTLY this content:

```tsx
'use client';

import {motion, useScroll, useTransform, useReducedMotion} from 'framer-motion';
import {TapeLabel} from '@/app/components/primitives/tape-label';
import {profile} from '@/app/content/profile';

/**
 * Ambient scrapbook parallax backdrop, mounted once in the root layout.
 *
 * Four layers drift upward at different rates as the user scrolls:
 *   1. Halftone grain (paper-grain), ~20% speed — full-bleed texture.
 *   2. Paper card (warm card token, rotated), ~35% speed — top-right.
 *   3. TapeLabel ("// N YRS SHIPPING", pine), ~28% speed — right-mid.
 *   4. Color dot (clay accent), ~55% speed — left-mid.
 *
 * Always positioned fixed at z-index -1 with pointer-events: none. Honors
 * `prefers-reduced-motion` by rendering the same shapes statically (no
 * scroll-tied transform).
 */
export function ParallaxBackdrop() {
  const reduced = useReducedMotion();
  const {scrollY} = useScroll();

  // Map document scrollY to per-layer translateY. Range [0, 6000] is a
  // generous cap; transforms clamp at the bounds so very long pages still
  // behave (the parallax just stops drifting near the bottom).
  const yGrain = useTransform(scrollY, [0, 6000], [0, -1200]);
  const yCard = useTransform(scrollY, [0, 6000], [0, -2100]);
  const yTape = useTransform(scrollY, [0, 6000], [0, -1700]);
  const yDot = useTransform(scrollY, [0, 6000], [0, -3300]);

  // When reduced motion is requested, the layers render at their initial
  // positions with no `y` binding — no scroll-tied animation occurs.
  // Default to `{}` (not undefined) so the downstream `...spread` is always
  // safe and Type-friendly.
  const grainStyle = reduced ? {} : {y: yGrain};
  const cardStyle = reduced ? {} : {y: yCard};
  const tapeStyle = reduced ? {} : {y: yTape};
  const dotStyle = reduced ? {} : {y: yDot};

  return (
    <div
      aria-hidden='true'
      className='pointer-events-none fixed inset-0 -z-10 overflow-hidden opacity-85'
      style={{transform: 'translate3d(0,0,0)'}}
    >
      {/* Layer 1 — halftone grain, full bleed */}
      <motion.div
        className='paper-grain absolute inset-0'
        style={{...grainStyle, willChange: 'transform'}}
      />

      {/* Layer 2 — paper card, top-right, rotated 8deg, partly off-edge */}
      <motion.div
        className='absolute rounded-md bg-card shadow-lg'
        style={{
          ...cardStyle,
          top: '25vh',
          right: '-8vw',
          width: '340px',
          height: '420px',
          rotate: '8deg',
          willChange: 'transform',
        }}
      />

      {/* Layer 3 — TapeLabel mid-right, drifts slowly */}
      <motion.div
        className='absolute'
        style={{
          ...tapeStyle,
          top: '105vh',
          right: '6vw',
          willChange: 'transform',
        }}
      >
        <TapeLabel tone='pine' rotate={4}>
          {`// ${profile.yearsShipping} yrs shipping`}
        </TapeLabel>
      </motion.div>

      {/* Layer 4 — clay accent dot, fastest, smallest */}
      <motion.div
        className='absolute h-3.5 w-3.5 rounded-full bg-accent'
        style={{
          ...dotStyle,
          top: '75vh',
          left: '8vw',
          willChange: 'transform',
        }}
      />
    </div>
  );
}
```

- [ ] **Step 2: Verify types**

Run: `pnpm exec tsc --noEmit; echo "TSC=$?"`
Expected: `TSC=0`. If TS complains about spreading a `MotionValue<number>` into a style object, report the exact error before changing the pattern — framer-motion v12's `motion.div` style prop accepts MotionValues directly, so this should type-check as-is.

- [ ] **Step 3: Verify lint**

Run: `pnpm lint; echo "LINT=$?"`
Expected: `LINT=0`. The hook calls (`useReducedMotion`, `useScroll`, `useTransform`) are unconditionally called at the top of the function before any branching, so the rules-of-hooks lint should be satisfied.

- [ ] **Step 4: Commit**

```bash
git add src/app/components/parallax/parallax-backdrop.tsx
git commit -m "feat: parallax backdrop component (4 ambient scrapbook layers)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Mount ParallaxBackdrop in the root layout

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Add the import**

In `src/app/layout.tsx`, add this import line immediately after the existing `import {ThemeProvider} from './lib/theme-provider';` line:

```tsx
import {ParallaxBackdrop} from './components/parallax/parallax-backdrop';
```

So the import block now ends with:

```tsx
import './globals.css';
import {ThemeProvider} from './lib/theme-provider';
import {ParallaxBackdrop} from './components/parallax/parallax-backdrop';
```

- [ ] **Step 2: Render the backdrop inside ThemeProvider, as a sibling of `{children}`**

Replace the existing JSX block:

```tsx
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
```

with:

```tsx
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <ParallaxBackdrop />
          {children}
        </ThemeProvider>
```

The backdrop renders first in JSX order, but its `fixed -z-10` positioning places it behind all `{children}` content visually regardless of source order. The DOM order is intentional: backdrop first so screen readers (which skip `aria-hidden='true'`) reach `{children}` content immediately.

- [ ] **Step 3: Build gate — verify it compiles and renders**

Run: `pnpm build 2>&1 | tail -8; echo "BUILD_EXIT=${PIPESTATUS[0]}"`
Expected: `BUILD_EXIT=0`, "Compiled successfully", `out/index.html` exists.

Run: `pnpm exec tsc --noEmit; echo "TSC=$?"` (expect 0) and `pnpm lint; echo "LINT=$?"` (expect 0).

- [ ] **Step 4: Verify the backdrop is in the rendered HTML**

Run:
```bash
grep -c "fixed inset-0 -z-10" out/index.html
grep -c "yrs shipping" out/index.html
```
Expected: first count ≥ 1 (the backdrop wrapper rendered), second count ≥ 2 (one in the hero `Header` tape, one in the parallax tape — confirms layer 3 rendered).

- [ ] **Step 5: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: mount ParallaxBackdrop in root layout

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Update redesign spec to reflect parallax exception

**Files:**
- Modify: `docs/superpowers/specs/2026-05-19-portfolio-redesign-design.md`

- [ ] **Step 1: Update line 172**

In `docs/superpowers/specs/2026-05-19-portfolio-redesign-design.md`, replace the existing line:

```markdown
- `prefers-reduced-motion`: marquee becomes static wrapped grid; entrance reveals become instant; no parallax.
```

with:

```markdown
- `prefers-reduced-motion`: marquee becomes static wrapped grid; entrance reveals become instant; parallax layers render statically (no scroll-tied transform). See `2026-05-19-parallax-backdrop-design.md`.
```

- [ ] **Step 2: Verify the edit landed**

Run:
```bash
grep -n "parallax" docs/superpowers/specs/2026-05-19-portfolio-redesign-design.md
```
Expected: shows the new line with "parallax layers render statically". The literal phrase "no parallax" should NO LONGER appear in the file.

Run:
```bash
grep -c "no parallax" docs/superpowers/specs/2026-05-19-portfolio-redesign-design.md
```
Expected: `0`.

- [ ] **Step 3: Commit**

```bash
git add docs/superpowers/specs/2026-05-19-portfolio-redesign-design.md
git commit -m "docs: update redesign spec to allow scrapbook-native parallax

The original 'no parallax' line rejected SaaS-floaty gradient-orb
parallax; the new scrapbook-native ParallaxBackdrop (separate spec)
shares the scrapbook vocabulary and respects prefers-reduced-motion.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Final verification

**Files:** none (verification only)

- [ ] **Step 1: Full build + checks**

Run, in sequence:
1. `pnpm build 2>&1 | tail -10; echo "BUILD_EXIT=${PIPESTATUS[0]}"` — must be 0, "Compiled successfully", `out/index.html` exists, NO Sass deprecation warnings.
2. `pnpm lint; echo "LINT=$?"` — must be 0.
3. `pnpm exec tsc --noEmit; echo "TSC=$?"` — must be 0.

- [ ] **Step 2: Verify rendered static export**

Run:
```bash
ls out/index.html out/.nojekyll out/404.html
grep -c "fixed inset-0 -z-10" out/index.html
grep -c "Marín Navia" out/index.html
grep -c "yrs shipping" out/index.html
```
Expected: all 3 files exist; first grep ≥ 1 (backdrop present); second ≥ 1 (existing hero name still renders — sanity check the foreground wasn't broken); third ≥ 2 (hero tape + parallax tape).

- [ ] **Step 3: Manual visual check (informational, not blocking)**

Run `pnpm dev` and open `http://localhost:3000`. Scroll the page in both light and dark themes. Observe:
- Halftone grain texture visible across the background.
- A warm cream paper rectangle drifts up off the top-right as you scroll.
- A pine tape label `// 6 YRS SHIPPING` drifts past at a moderate rate.
- A small clay dot drifts up faster than everything else.
- Foreground content (hero text, sections, footer) reads normally with no contrast issues.
- No visible jank (steady scroll, no stutter).

Emulate `prefers-reduced-motion: reduce` in browser devtools. Reload. Confirm the 4 layers are visible but DO NOT animate as you scroll.

- [ ] **Step 4: Working tree check**

Run: `git status --porcelain`
Expected: clean (no uncommitted changes).

Run: `git log --oneline main..HEAD | head -5`
Expected: at least 3 new commits on top of the prior `main..HEAD` baseline (the parallax-backdrop spec commit, the component commit, the layout commit, the spec-update commit).

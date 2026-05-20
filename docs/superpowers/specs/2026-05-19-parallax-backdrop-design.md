# Parallax Backdrop — Design Spec

**Date:** 2026-05-19
**Owner:** Juan Camilo Marín Navia
**Status:** Approved design, pending user spec review
**Branch:** `redesign/scrapbook-pop`

## 1. Goal

Add a subtle, on-brand parallax background that drifts as the user scrolls — adding depth and life to the portfolio without becoming a "feature" or shouting over the foreground content. Specifically: ambient scrapbook shapes (paper, tape, halftone, color dot) layered behind the page, each translating at a different rate.

The user described it as "not too invasive, just in the background." This spec lands on **visible but ambient** — clearly noticeable without being decorative-floaty SaaS clutter.

## 2. Scope

**In scope:**
- One new client component `ParallaxBackdrop` mounted once at the root layout.
- 4 absolutely-positioned background layers, each scroll-tied via `framer-motion` `useScroll` + `useTransform`.
- Reuses existing scrapbook vocabulary (paper-grain texture, paper card, TapeLabel, color dot).
- `prefers-reduced-motion` path: shapes render statically; no animation.
- Works in both light and dark themes (theme-token-bound colors).

**Out of scope:**
- No per-section parallax variations (decision: global, single backdrop).
- No new visual primitives — reuses existing ones.
- No 3D, no glow, no gradient blobs, no glassmorphism, no fade-in-on-scroll effects.
- No new dependencies — `framer-motion` is already installed and used.
- No changes to existing section components or primitives.

## 3. Spec deviation — relationship to the redesign spec

The redesign spec (`2026-05-19-portfolio-redesign-design.md`) §8 line 172 states *"prefers-reduced-motion: …no parallax."* That was a rejection of the **floaty-SaaS gradient-orb parallax aesthetic** represented by Direction C (Neo-Playground), which we rejected in favor of B2 (Scrapbook Pop).

This parallax is **scrapbook-native**: same vocabulary (paper, tape, halftone, dot), same OKLCH palette, same `ease-out-expo` motion principles. It is **not** the parallax the original spec rejected. Reduced-motion still fully disables animation here — the original constraint holds.

**Action:** when implementing, update the redesign spec §8 line 172 to: *"prefers-reduced-motion: marquee becomes static wrapped grid; entrance reveals become instant; parallax layers render statically (no scroll-tied transform)."*

## 4. Approach

**Single component, single mount point, framer-motion `useScroll`.**

- Component: `ParallaxBackdrop` — client component (uses scroll hooks).
- Mount: `src/app/layout.tsx`, sibling of `<main>` (inside `<body>`, outside `<ThemeProvider>` is fine since it doesn't read theme via JS — colors come through CSS tokens).
- Positioning: `position: fixed; inset: 0; z-index: -1; pointer-events: none; overflow: hidden;` — sits behind all content, never intercepts clicks/focus.
- Animation: `useScroll()` for `scrollY`, then `useTransform(scrollY, [0, 6000], [0, -X])` per layer where X is the layer's max translation.

Rejected alternatives:
- **CSS scroll-timeline**: native and zero-JS, but Safari support was only added in 26.0 (mid-2025) and Firefox is flag-only. Falls back to no parallax for a meaningful chunk of recruiter audience.
- **Raw `window.scroll` listener with rAF**: works but reinvents what framer-motion already provides cleanly with shared subscriptions.
- **Per-section parallax components**: more art-directed but visually busier and creates 6 sources-of-truth instead of 1. YAGNI for "background ambient."

## 5. File Structure

```
src/app/components/parallax/
  parallax-backdrop.tsx       CREATE — single client component with the 4 layers
src/app/layout.tsx            MODIFY — render <ParallaxBackdrop /> as sibling of children
docs/superpowers/specs/
  2026-05-19-portfolio-redesign-design.md  MODIFY — update §8 reduced-motion line
```

One new file. One layout.tsx modification. One spec text correction. No primitive changes, no section changes, no `globals.css` changes (reuses `.paper-grain`), no new dependency.

## 6. Visual Content — 4 Layers

All 4 layers are absolutely positioned inside the `position: fixed` wrapper. Their `top`/`left`/`right` values place them relative to the viewport at first paint; `useTransform` then drives a negative `translateY` so they drift **upward as the user scrolls down** (parallax effect — slower than the page's natural scroll). Translation values calibrated against an estimated page height of ~5500–7000px.

| # | Layer | Element | Position (initial) | Speed | Color | Notes |
|---|---|---|---|---|---|---|
| 1 | Halftone grain | `<div className='paper-grain'>` full-bleed | `inset: 0` | ~20% | accent @ ~7% (`color-mix` already in `.paper-grain`) | Always visible; reuses the existing recipe. Mapped: `[0, 6000] → [0, -1200]` |
| 2 | Paper card | `<motion.div>` warm cream rectangle, rotated 8° | top: 25vh; right: -8vw; size: ~340×420px | ~35% | `bg-card` token | Soft drop shadow. Partially off-edge. `[0, 6000] → [0, -2100]` |
| 3 | TapeLabel | Reuses `<TapeLabel>` primitive | top: 105vh; right: 6vw | ~28% | secondary (pine) | Text: `` `// ${profile.yearsShipping} YRS SHIPPING` `` — mirrors the hero tape as a signature motif at a different scroll depth. Rotation: 4°. `[0, 6000] → [0, -1700]` |
| 4 | Color dot | `<motion.div>` clay circle, 14×14px | top: 75vh; left: 8vw | ~55% | `bg-accent` token | The fastest, smallest, tops the depth stack. `[0, 6000] → [0, -3300]` |

Whole wrapper has `opacity: 0.85` so the layers settle slightly into the background and don't compete with foreground text.

## 7. Reduced Motion

`useReducedMotion()` truthy →
- Render the same 4 layers with **no `style.y` binding** (just the static initial positions).
- The depth visual still exists in the initial frame; nothing animates as the user scrolls.
- `.paper-grain` continues to render its texture (CSS-only, not scroll-tied).

The redesign spec §8 line is updated accordingly (see §3).

## 8. Theming

All colors come from OKLCH CSS custom-property tokens (`var(--card)`, `var(--accent)`, `var(--secondary)`), so dark mode inverts correctly via the existing `.dark` class without any component changes. The `.paper-grain` recipe already adapts because it uses `color-mix(in oklch, var(--color-accent) 7%, transparent)` which picks up the theme-active `--accent`.

Specifically:
- Light mode: cream paper card on warm-cream background = subtle depth.
- Dark mode: dark-card-token paper card on espresso background = same subtle depth.

## 9. Performance

- All motion drives `transform: translate3d` (GPU-composited; the only safe scroll-tied animation per craft principles "never animate layout properties").
- `will-change: transform` on each animating layer.
- `useScroll` runs in framer-motion's optimized rAF loop with a single subscription shared across all `useTransform` consumers — not a separate `window.scroll` listener per layer.
- Wrapper is `position: fixed` so layers never reflow; they only repaint composited.
- 4 GPU-composited layers + an existing-asset portfolio with no other heavy graphics → expected 60fps on any post-2017 device.
- Bundle impact: <1 KB gzipped (one component using already-loaded framer-motion APIs).

## 10. Accessibility

- Wrapper is `pointer-events: none` and `aria-hidden='true'`: parallax is purely decorative, invisible to screen readers and keyboard navigation.
- `z-index: -1` ensures it never receives focus or intercepts pointer events.
- Honors `prefers-reduced-motion` per §7.
- No focus traps, no scroll hijacking, no skip-targets needed.

## 11. Risks & Mitigations

- **iOS Safari `position: fixed` + rubber-band overscroll jitter** — known browser quirk. Mitigation: wrap layers in a parent with `transform: translate3d(0,0,0)` to force its own compositor layer (`will-change: transform` would already trigger this for the layers themselves; the wrapper gets it too for safety).
- **Layer positions wrong on very short or very tall viewports** — initial positions use `vh` units so they scale with viewport height; the parallax range `[0, 6000]` is generous enough for the longest expected page height.
- **Page extends past 6000px in future** — transform clamps at the upper bound; parallax effectively stops drifting near the bottom. Acceptable: better than overshooting and revealing layers in wrong positions.
- **Print/CV screenshot** — parallax wrapper is `pointer-events: none` at `z: -1`; browsers strip fixed positioning in print preview. Won't appear in printed output. Confirmed acceptable.
- **Coexistence with the existing `.paper-grain` usages** (hero right-edge bleed, nav scrolled backdrop, footer) — these are foreground textures on specific elements at higher z-indices. The parallax backdrop layer 1 (also `.paper-grain` at z: -1) will subtly compound with those but at different positions and lower stacking — visual effect is added depth, not visible duplication.

## 12. Verification

- `pnpm build` exits 0, "Compiled successfully", `out/index.html` generated.
- `pnpm lint` and `pnpm exec tsc --noEmit` both exit 0.
- Manual: scroll the live page in light and dark; observe 4 layers drifting at distinct rates; foreground content remains legible; no visible jank.
- Manual: emulate `prefers-reduced-motion: reduce`; confirm layers are visible but static (no transform changes on scroll).
- Manual: tab through the page; confirm parallax never receives focus and content tab order is unchanged.
- Manual: print preview shows no parallax artifacts.

## 13. Out-of-Scope Follow-ups

- Per-section ambient variations (different shapes per section) — explicitly out of scope; revisit only if the global parallax feels under-articulated after shipping.
- The 4 Important issues from the prior redesign whole-implementation review (kicker repetition, focus rings on CTAs/footer, mobile overlay focus-trap) remain pending and are not part of this scope.

# Portfolio Redesign — Design Spec

**Date:** 2026-05-19
**Owner:** Juan Camilo Marín Navia
**Status:** Approved design, pending spec review

## 1. Goal & Audience

Redesign the personal portfolio to target **senior / staff engineering roles** (recruiters, engineering managers) while **keeping a bold, playful personality**. The deliberate bet: stand out from the saturated field of minimal "serious" dev portfolios by being memorable *and* credible. Craft must be impeccable so the playfulness reads as confident, not junior.

This is a **brand register** surface (design IS the product). Content is unchanged; this is a visual/UX redesign plus a CSS/tooling migration.

## 2. Scope

**In scope:**
- Full visual redesign of all sections (single-page site).
- Migrate styling: remove Bootstrap, reactstrap, all SCSS → Tailwind CSS v4 + shadcn theming layer.
- Light/dark mode via `next-themes`, system-preference-aware on first load, design tuned primarily for warm-light.
- New icon system: replace `@fortawesome/*` with `lucide-react` (UI) + `simple-icons` (brand/skill/social logos).
- New fonts via `next/font/google`; drop the Roobert custom font.
- Skills presentation changes from a draggable card deck to animated marquee strips.

**Out of scope:**
- No content changes (same jobs, skills, education, bio text, social URLs, CV PDF).
- No new sections (no Projects section).
- No changes to Next.js version, pnpm, or the static-export CI pipeline (all from the prior upgrade, kept working).
- No backend, no analytics, no forms.

**Explicitly unchanged:** Next 16 + React 19 + pnpm + `output: 'export'` GitHub Pages deploy.

## 3. Approach

**In-place rebuild on the existing Next 16 app.** Keep the current working app; add Tailwind v4 + shadcn theming, then rebuild each section component one at a time, deleting Bootstrap/reactstrap/SCSS incrementally as each section is migrated. The build stays green and verifiable section-by-section. Tailwind v4 and the residual SCSS do not conflict during the transition; SCSS files are removed as their consuming sections are migrated, with the final SCSS/Bootstrap/reactstrap/sass removal as the last cleanup step.

Rejected alternatives: parallel rebuild then swap (more duplication, risky big-bang cutover); fresh `create-next-app` (discards the prior upgrade + CI work).

## 4. Tech Stack

**Add:**
- Tailwind CSS v4 — CSS-first config via `@theme` in a single global stylesheet. No `tailwind.config.js`.
- `tw-animate-css` — keyframe utilities for entrance/marquee motion.
- `next-themes` — system-aware light/dark toggle, no flash on load.
- shadcn theming layer (CSS variables) plus only the `Button` primitive and a theme-toggle component. No other shadcn components (this site has no modals/dropdowns/forms).
- `lucide-react` — UI icons (chevrons, sun/moon, arrows).
- `simple-icons` — brand/skill/social logos (React, Node, GitHub, LinkedIn, etc.), monochrome, tree-shakeable.
- Fonts via `next/font/google`: Bricolage Grotesque (display), Spectral italic (literary accent), Hanken Grotesk (body), Geist Mono (labels). All verified available on Google Fonts; self-hosted by `next/font`, no licensing concern for a public site.

**Remove entirely:**
- `bootstrap`, `reactstrap`, `sass`
- `src/app/assets/styles/**` (all 456 lines of SCSS)
- `@fortawesome/fontawesome-svg-core`, `@fortawesome/free-brands-svg-icons`, `@fortawesome/free-regular-svg-icons`, `@fortawesome/free-solid-svg-icons`, `@fortawesome/react-fontawesome`
- `react-anchor-link-smooth-scroll` and `@types/react-anchor-link-smooth-scroll` (replace with native CSS `scroll-behavior: smooth` + anchor links; the project already sets `scroll-behavior: smooth`)
- Roobert custom font files (`src/app/assets/fonts/RoobertVF.*`)

**Keep:** Next 16, React 19, pnpm, static export config, `framer-motion` (already v12, drives entrance/marquee motion).

**Replace:** `classnames` → `clsx` + `tailwind-merge` exposed via a `cn()` helper in `src/app/lib/cn.ts` (standard shadcn convention; required for sane Tailwind class composition). Remove `classnames` after all usages are migrated.

## 5. File Structure

Routing unchanged (single page, static export). Components small and single-purpose; shared scrapbook motifs are reusable primitives, not repeated markup.

```
src/app/
  layout.tsx          ThemeProvider, font CSS vars, metadata
  page.tsx            Assembles sections (Server Component; sections marked 'use client' only where motion needs it)
  globals.css         Tailwind v4 @theme: OKLCH color tokens, font tokens, light/dark, paper-grain
  components/
    ui/
      button.tsx          shadcn Button primitive
      theme-toggle.tsx    sun/moon toggle (next-themes)
    sections/
      nav.tsx
      header.tsx
      work.tsx
      skills-marquee.tsx
      education.tsx
      about.tsx
      footer.tsx
    primitives/
      tape-label.tsx      rotated mono label
      scrawl-text.tsx     Spectral-italic aside
      sticker-badge.tsx   circular rotated badge
      marquee-row.tsx     infinite scroll row, pause-on-hover, reduced-motion aware
  content/
    profile.ts          name, title, contact, social URLs, CV path
    jobs.ts             (existing data, re-typed; content unchanged)
    skills.ts           (existing 24 skills; logos sourced from simple-icons)
    education.ts         (existing 4 entries, extracted from JSX)
  lib/
    cn.ts               clsx + tailwind-merge helper
```

`src/app/assets/` is deleted entirely once migration completes (fonts via next/font, styles via Tailwind, images stay in `public/`).

## 6. Design System

### Color — Committed strategy

Warm cream paper carries the surface; clay-red accent does the work; pine-green secondary for stickers/tape. All OKLCH. Neutrals tinted warm. Never `#fff`/`#000`.

Theme behavior: `next-themes` honors the visitor's OS preference on first load. Both themes are fully designed; the system is tuned and visually optimized primarily for the warm-light look, with warm-dark a solid, deliberate secondary (not an afterthought, not the default-by-fiat).

**Light (visually primary):**
| Token | OKLCH | Role |
|---|---|---|
| `--background` | `oklch(0.94 0.018 75)` | warm cream paper |
| `--foreground` | `oklch(0.22 0.012 50)` | warm near-black ink |
| `--accent` (clay) | `oklch(0.58 0.17 35)` | headline accent, links, primary CTA |
| `--secondary` (pine) | `oklch(0.48 0.08 160)` | tape labels, stickers |
| `--muted` | `oklch(0.86 0.015 75)` | dividers, subtle fills |
| paper-grain | radial-dot SVG, ~3% accent opacity | subtle halftone texture overlay |

**Dark (secondary, solid, same warm world):**
| Token | OKLCH | Role |
|---|---|---|
| `--background` | `oklch(0.20 0.012 50)` | espresso |
| `--foreground` | `oklch(0.92 0.015 75)` | warm cream |
| `--accent` (clay) | `oklch(0.66 0.16 38)` | chroma reduced near extreme per craft rules |
| `--secondary` (pine) | `oklch(0.62 0.10 162)` | brighter pine |
| `--muted` | `oklch(0.30 0.012 50)` | dividers |

Not a cold-gray dark. Same world, lights off.

### Typography — fluid, ratio ≥1.25

- **Display** (Bricolage Grotesque 800): hero `clamp(2.75rem, 8vw, 6.5rem)`; section `clamp(2rem, 5vw, 3.5rem)`; line-height .88; tracking -.03em.
- **Literary accent** (Spectral italic 500): clay color, inline within display headlines.
- **Body** (Hanken Grotesk 400/600): `clamp(1rem, 1.05rem, 1.125rem)`; line-height 1.6; max width **68ch**.
- **Labels/kickers** (Geist Mono 700): tracking .04em; uppercase; ~12px.
- Light text on dark gets +0.05–0.1 line-height.

### Spacing

Fluid section rhythm: `clamp(5rem, 12vh, 9rem)` vertical. Intentionally varied (tight groupings within sections, generous between). Not uniform padding.

### Scrapbook motif primitives

- **TapeLabel** — rotation -2° to 4°, mono text, pine/clay background, 4px radius, subtle drop shadow.
- **ScrawlText** — Spectral italic, slight rotation, clay, for asides.
- **StickerBadge** — circular, rotation ~-12°, ink background, for CTAs/highlights.
- **MarqueeRow** — infinite horizontal scroll, pause-on-hover, `prefers-reduced-motion` → static wrapped grid.
- Halftone dot texture as a deliberate section-level accent (not global).

### Bans honored (craft skill)

No gradient text. No glassmorphism. No side-stripe borders (>1px colored left/right accents). No nested cards. No em dashes in copy (and no `--`). No hero-metric template. No identical card grids. No repeated tiny uppercase tracked labels as section grammar (the tape labels are a deliberate, named brand system, used as motif, not as scaffolding above every heading).

## 7. Section Layouts

Each section is art-directed (brand permission for different visual worlds, consistent voice). Content identical to current site.

**Nav** — Sticky top, minimal. Mono wordmark `JCMN` left; section links (Work / Skills / Education / About) center as understated mono; theme-toggle right. On scroll, subtle paper-grain backdrop fades in. Mobile: a taped "Menu" sticker opens a full-screen warm overlay with the links.

**Header (hero)** — Full-bleed B2 treatment. Mono kicker `// Full Stack JS Engineer` → huge Bricolage headline with Spectral-italic "*work.*" clash ("I don't just *work.* / I make things happen.") → Hanken sub line → clay StickerBadge "Download CV ↓" linking the existing PDF (`/files/Juan Camilo MARIN NAVIA CV.pdf`). Rotated pine TapeLabel `// 7 YRS SHIPPING` top-right. Staggered entrance: kicker → headline lines → sub → badge, ease-out-expo, one orchestrated load. Halftone bleeds from one edge.

**Work** — Section kicker + headline ("I don't just work…"). 5 jobs from `jobs.ts` as an **alternating timeline** (not identical cards): entries alternate left/right; big Bricolage company/role; mono dates as a TapeLabel; bullet description in Hanken; company logo (`/logos/*.png`) as a slightly-rotated pasted photo with subtle border. CV download repeats as an inline ScrawlText link. Scroll-reveal per entry, offset (not uniform).

**Skills** — Headline ("What I've mastered…"). **Two MarqueeRows** of the 24 skills, logos via simple-icons, monochrome ink tint that picks up brand color on hover; opposite directions; different speeds; pause-on-hover; `prefers-reduced-motion` → static wrapped grid. Replaces the draggable deck.

**Education** — Headline ("This is not just some paper…"). 4 entries from `education.ts` as a **scrapbook collage**: varied-size pasted index-card tiles, slight rotations, GPA as a circular StickerBadge where present, place/dates in mono. Deliberate asymmetry, not a uniform grid.

**About** — Headline ("Yep! This is me 😎"). The 3 bio paragraphs unchanged, Hanken, ≤68ch; `me.jpg` as a large taped polaroid (rotated, border, shadow) beside the text. Emojis kept (fits playful voice). Closing invitation line as ScrawlText.

**Footer** — Big Bricolage "Let's make things happen." Social links (GitHub, LinkedIn, GitLab, Discord, Goodreads, Twitter, Instagram — same URLs) as a mono list with hover slide. Email (`jcmnavia@hotmail.com`) and both phone numbers (same as current). Subtle halftone. No fake newsletter, no filler.

## 8. Motion

- Entrance choreography per section on scroll-in, fired once (`framer-motion` `whileInView` + `viewport={{ once: true }}`).
- Ease-out exponential curves (ease-out-expo/quint). No bounce, no elastic.
- Never animate CSS layout properties (animate transform/opacity).
- `prefers-reduced-motion`: marquee becomes static wrapped grid; entrance reveals become instant; parallax layers render statically (no scroll-tied transform). See `2026-05-19-parallax-backdrop-design.md`.

## 9. Responsive

Mobile-first. Hero type scales via `clamp()`. Timeline collapses to single column. Education collage stacks while preserving rotation. Marquee keeps working with touch. Nav collapses to the taped-menu overlay. Verified at 360 / 768 / 1024 / 1440 widths.

## 10. Accessibility

- Color contrast meets WCAG AA in both themes (clay-on-cream and cream-on-espresso verified for body and large text).
- All interactive elements keyboard-reachable; visible focus states (warm accent ring, not default).
- Theme toggle has an accessible label; respects and persists preference.
- Marquee respects `prefers-reduced-motion`; not a keyboard trap; logos have text alternatives.
- Images have descriptive alt text in the brand voice (e.g. company logos, the polaroid).
- Headings form a correct semantic outline; sections use landmarks.

## 11. Verification

- `pnpm build` exits 0 with `output: 'export'` producing `out/` (must hold throughout migration, checked per section).
- `pnpm lint` and `pnpm exec tsc --noEmit` pass with 0 errors.
- After full migration: zero remaining imports of `bootstrap`, `reactstrap`, `sass`, `@fortawesome/*`, `react-anchor-link-smooth-scroll`; `src/app/assets/` deleted; no `.scss` files.
- Manual visual check in light and dark at the four responsive widths.
- `prefers-reduced-motion` emulation verified (marquee static, no entrance motion).

## 12. Risks & Mitigations

- **Tailwind v4 + Next 16 + Turbopack interaction:** v4 uses the `@tailwindcss/postcss` / Vite-style plugin; confirm the Next 16 Turbopack integration during the first setup step before migrating any section. Mitigation: setup-and-verify is its own first plan step with a build gate.
- **simple-icons coverage:** confirm all 24 current skill slugs exist in simple-icons (e.g. vscode, heroku). Mitigation: audit slugs in the plan; any missing logo falls back to a typeset mono name tile (consistent with the collage aesthetic).
- **Static export + next/font:** `next/font/google` works with `output: 'export'` (fonts inlined at build). Low risk; covered by the build gate.
- **Theme flash:** `next-themes` with the correct `suppressHydrationWarning` on `<html>` and the inline script avoids FOUC. Verified in build output / manual check.
- **Incremental coexistence:** during migration, a section may briefly use Tailwind while another still imports SCSS. They do not conflict; the global SCSS import is removed only after the last consuming section is migrated.

## 13. Out-of-Scope Follow-ups (not part of this work)

- Sass `@use`/`math.div` modernization — moot once SCSS is removed.
- A future Projects/case-studies section (explicitly deferred by the owner).

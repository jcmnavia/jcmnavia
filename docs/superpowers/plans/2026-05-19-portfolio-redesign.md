# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the single-page portfolio with a warm "Scrapbook Pop" design (Direction B2), migrating Bootstrap/SCSS to Tailwind CSS v4 + shadcn theming, with system-aware light/dark, while keeping all content and the Next 16 static-export pipeline working.

**Architecture:** In-place rebuild on the existing Next 16 + React 19 app. Add Tailwind v4 + theming infrastructure first (build-gated), extract content to typed modules, build reusable scrapbook primitives, then rebuild each section component one at a time, deleting Bootstrap/reactstrap/SCSS/FontAwesome incrementally. Build stays green and verifiable per task.

**Tech Stack:** Next.js 16, React 19, pnpm, Tailwind CSS v4 (`@tailwindcss/postcss`, CSS-first `@theme`), `next-themes`, shadcn theming + Button, `framer-motion` v12, `lucide-react`, `simple-icons`, `clsx` + `tailwind-merge`. Fonts via `next/font/google`: Bricolage Grotesque, Spectral, Hanken Grotesk, Geist Mono.

**Spec:** `docs/superpowers/specs/2026-05-19-portfolio-redesign-design.md`

**Branch:** `redesign/scrapbook-pop` (already created; Next 16 upgrade + spec already committed).

---

## Verified Facts (from pre-plan investigation)

- Versions: `tailwindcss@4.3.0`, `@tailwindcss/postcss@4.3.0`, `tw-animate-css@1.4.0`, `next-themes@0.4.6`, `clsx@2.1.1`, `tailwind-merge@3.6.0`, `lucide-react@1.16.0`, `simple-icons@16.20.0`, `class-variance-authority@0.7.1`, `shadcn@4.7.0`.
- `simple-icons` import shape: `import { siReact } from 'simple-icons'` → `{ title, hex, path, slug }`.
- **simple-icons does NOT contain: AWS, Heroku, VSCode** (removed for brand policy). The 25 skills (same as the existing site, WordPress included) split into: 21 with logos + 4 (`aws`, `heroku`, `sql`, `vscode`) that render as typeset mono text tiles (on-brand fallback). `sql` is not a brand either → mono tile.
- simple-icons slug map for the 21 available (current skill → simple-icons export):
  `bash→siGnubash`, `bootstrap→siBootstrap`, `docker→siDocker`, `express→siExpress`, `gatsby→siGatsby`, `git→siGit`, `github→siGithub`, `graphql→siGraphql`, `html5→siHtml5`, `jest→siJest`, `js→siJavascript`, `laravel→siLaravel`, `nodejs→siNodedotjs`, `php→siPhp`, `postgres→siPostgresql`, `react→siReact`, `redux→siRedux`, `sass→siSass`, `terraform→siTerraform`, `ts→siTypescript`, `wordpress→siWordpress`. Text-tile fallback: `aws`, `heroku`, `sql`, `vscode`.
- Tailwind v4 + Next: install `tailwindcss @tailwindcss/postcss postcss`, `postcss.config.mjs` with `@tailwindcss/postcss` plugin, `@import "tailwindcss";` in globals.css, custom tokens via `@theme { ... }`.
- Next 16 uses Turbopack by default; Tailwind v4 PostCSS plugin is compatible. A build gate is included after setup (spec risk mitigation).

## File Structure

```
postcss.config.mjs                      CREATE  Tailwind v4 PostCSS plugin
src/app/globals.css                     CREATE  @import tailwindcss + @theme tokens + light/dark + base
src/app/layout.tsx                      MODIFY  fonts, ThemeProvider, metadata, globals.css
src/app/page.tsx                        MODIFY  assemble new sections
src/app/lib/cn.ts                       CREATE  clsx + tailwind-merge helper
src/app/lib/theme-provider.tsx          CREATE  next-themes wrapper (client)
src/app/content/profile.ts              CREATE  name/title/contact/socials/cv
src/app/content/jobs.ts                 MOVE    from assets/content/jobs.ts (unchanged data)
src/app/content/skills.ts               CREATE  24 skills + simple-icons slug or text fallback
src/app/content/education.ts            CREATE  4 entries extracted from old JSX
src/app/components/ui/button.tsx        CREATE  shadcn-style Button (cva)
src/app/components/ui/theme-toggle.tsx  CREATE  sun/moon toggle
src/app/components/primitives/tape-label.tsx     CREATE
src/app/components/primitives/scrawl-text.tsx    CREATE
src/app/components/primitives/sticker-badge.tsx  CREATE
src/app/components/primitives/marquee-row.tsx    CREATE
src/app/components/primitives/skill-icon.tsx     CREATE  renders simple-icons path or text tile
src/app/components/primitives/section-heading.tsx CREATE kicker + display headline w/ italic clash
src/app/components/sections/nav.tsx              CREATE
src/app/components/sections/header.tsx           CREATE
src/app/components/sections/work.tsx             CREATE
src/app/components/sections/skills-marquee.tsx   CREATE
src/app/components/sections/education.tsx        CREATE
src/app/components/sections/about.tsx            CREATE
src/app/components/sections/footer.tsx           CREATE
src/app/components/motion/reveal.tsx             CREATE  framer-motion scroll-reveal wrapper

DELETE at end:
src/app/assets/                         (entire dir: styles/, fonts/, content/)
src/app/sections/                       (old section dirs)
src/app/components/{job-card,skill-deck,nav-card,education-card}/
next.config.js images.unoptimized stays; remove nothing from export config
package.json: remove bootstrap, reactstrap, sass, @fortawesome/*, react-anchor-link-smooth-scroll, @types/react-anchor-link-smooth-scroll, classnames
```

**Verification commands (used throughout):**
- Build: `pnpm build` → expect exit 0, `out/index.html` generated.
- Lint: `pnpm lint` → expect 0 errors.
- Types: `pnpm exec tsc --noEmit` → expect exit 0.

---

## Task 1: Install redesign dependencies

**Files:**
- Modify: `package.json` (via pnpm)

- [ ] **Step 1: Add runtime + dev dependencies**

Run:
```bash
pnpm add tailwindcss@4 @tailwindcss/postcss@4 postcss tw-animate-css next-themes clsx tailwind-merge lucide-react simple-icons class-variance-authority
```
Expected: installs without peer-dependency errors (warnings OK). `package.json` dependencies updated.

- [ ] **Step 2: Verify install**

Run: `pnpm exec tsc --noEmit`
Expected: exit 0 (no code changed yet, just deps).

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "build: add Tailwind v4 + theming deps for redesign

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Tailwind v4 + theme tokens infrastructure (BUILD GATE)

This is the spec's primary risk mitigation: prove Tailwind v4 compiles under Next 16 Turbopack before building any UI.

**Files:**
- Create: `postcss.config.mjs`
- Create: `src/app/globals.css`
- Create: `src/app/lib/cn.ts`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create `postcss.config.mjs`**

```js
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};

export default config;
```

- [ ] **Step 2: Create `src/app/globals.css`** with Tailwind import, OKLCH theme tokens, light/dark, base layer

```css
@import 'tailwindcss';
@import 'tw-animate-css';

@custom-variant dark (&:where(.dark, .dark *));

/* Design tokens — Committed warm scrapbook palette (OKLCH). */
:root {
  --background: oklch(0.94 0.018 75);
  --foreground: oklch(0.22 0.012 50);
  --accent: oklch(0.58 0.17 35);
  --accent-foreground: oklch(0.97 0.01 75);
  --secondary: oklch(0.48 0.08 160);
  --secondary-foreground: oklch(0.97 0.01 75);
  --muted: oklch(0.86 0.015 75);
  --muted-foreground: oklch(0.45 0.012 55);
  --border: oklch(0.78 0.015 70);
  --card: oklch(0.96 0.014 78);
  --ring: oklch(0.58 0.17 35);
  --radius: 0.5rem;
}

.dark {
  --background: oklch(0.20 0.012 50);
  --foreground: oklch(0.92 0.015 75);
  --accent: oklch(0.66 0.16 38);
  --accent-foreground: oklch(0.16 0.01 50);
  --secondary: oklch(0.62 0.10 162);
  --secondary-foreground: oklch(0.14 0.01 50);
  --muted: oklch(0.30 0.012 50);
  --muted-foreground: oklch(0.70 0.012 60);
  --border: oklch(0.34 0.012 55);
  --card: oklch(0.24 0.012 50);
  --ring: oklch(0.66 0.16 38);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
  --color-card: var(--card);
  --color-ring: var(--ring);

  --font-display: var(--font-bricolage), 'Arial Black', sans-serif;
  --font-body: var(--font-hanken), system-ui, sans-serif;
  --font-serif: var(--font-spectral), Georgia, serif;
  --font-mono: var(--font-geist-mono), ui-monospace, monospace;
}

@layer base {
  * {
    border-color: var(--color-border);
  }
  html {
    scroll-behavior: smooth;
  }
  body {
    background-color: var(--color-background);
    color: var(--color-foreground);
    font-family: var(--font-body);
    -webkit-font-smoothing: antialiased;
  }
  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }
  }
}

/* Subtle halftone paper grain, used deliberately as a section accent. */
.paper-grain {
  background-image: radial-gradient(
    color-mix(in oklch, var(--color-accent) 7%, transparent) 1.5px,
    transparent 1.6px
  );
  background-size: 14px 14px;
}
```

- [ ] **Step 3: Create `src/app/lib/cn.ts`**

```ts
import {clsx, type ClassValue} from 'clsx';
import {twMerge} from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 4: Replace `src/app/layout.tsx`** with fonts + globals (ThemeProvider added in Task 3)

```tsx
import type {Metadata} from 'next';
import {
  Bricolage_Grotesque,
  Spectral,
  Hanken_Grotesk,
  Geist_Mono,
} from 'next/font/google';
import './globals.css';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['400', '600', '800'],
  variable: '--font-bricolage',
  display: 'swap',
});
const spectral = Spectral({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['italic'],
  variable: '--font-spectral',
  display: 'swap',
});
const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-hanken',
  display: 'swap',
});
const geistMono = Geist_Mono({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Juan Camilo Marín Navia — Full Stack JS Engineer',
  description:
    'Full Stack JavaScript engineer with 7+ years building production web and mobile across React, Node, AWS and React Native.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang='en'
      className={`${bricolage.variable} ${spectral.variable} ${hanken.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 5: BUILD GATE — verify Tailwind v4 compiles under Next 16**

Run: `pnpm build`
Expected: exit 0, "Compiled successfully", `out/index.html` exists. (Old SCSS page still renders; this only proves Tailwind/PostCSS works alongside Turbopack.)
If it fails with a PostCSS/Turbopack error: STOP. The fallback is to opt the build out of Turbopack via `next build --webpack` in `package.json` (documented Next 16 escape hatch). Re-run and confirm exit 0 before continuing.

- [ ] **Step 6: Verify lint + types**

Run: `pnpm lint && pnpm exec tsc --noEmit`
Expected: both exit 0.

- [ ] **Step 7: Commit**

```bash
git add postcss.config.mjs src/app/globals.css src/app/lib/cn.ts src/app/layout.tsx
git commit -m "feat: Tailwind v4 + OKLCH theme tokens + scrapbook fonts

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Theme provider + system-aware light/dark

**Files:**
- Create: `src/app/lib/theme-provider.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create `src/app/lib/theme-provider.tsx`**

```tsx
'use client';

import {ThemeProvider as NextThemesProvider} from 'next-themes';
import type {ComponentProps} from 'react';

export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

- [ ] **Step 2: Wrap children in `src/app/layout.tsx`**

Add import after the globals import:
```tsx
import {ThemeProvider} from './lib/theme-provider';
```

Replace `<body>{children}</body>` with:
```tsx
      <body>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
```

- [ ] **Step 3: Build + verify no hydration warning / FOUC**

Run: `pnpm build`
Expected: exit 0, `out/index.html` generated. (`suppressHydrationWarning` on `<html>` from Task 2 + `disableTransitionOnChange` prevents theme FOUC in static export.)

- [ ] **Step 4: Commit**

```bash
git add src/app/lib/theme-provider.tsx src/app/layout.tsx
git commit -m "feat: system-aware light/dark via next-themes

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Extract content to typed modules

Content is unchanged — only relocated and typed. Source data already exists in `src/app/assets/content/{jobs,skills}.ts` and in old section JSX.

**Files:**
- Create: `src/app/content/profile.ts`
- Create: `src/app/content/jobs.ts`
- Create: `src/app/content/skills.ts`
- Create: `src/app/content/education.ts`

- [ ] **Step 1: Create `src/app/content/profile.ts`** (extracted from old header/footer/work JSX). NOTE: `title` is `'Full Stack JS Developer'` verbatim from the old header (`src/app/sections/header/index.tsx` line 19) — do NOT change "Developer" to "Engineer"; content is unchanged per spec. The SEO `<title>`/`description` in layout.tsx may say "Engineer" (new metadata, not visible copy).

```ts
export const profile = {
  name: 'Juan Camilo Marín Navia',
  title: 'Full Stack JS Developer',
  tagline: 'I make things happen',
  yearsShipping: 7,
  cvPath: '/files/Juan Camilo MARIN NAVIA CV.pdf',
  email: 'jcmnavia@hotmail.com',
  phones: [
    {label: '+57 (300) 345-3662', href: 'tel:+573003453662'},
    {label: '+1 (754) 248-8834', href: 'tel:+17542488834'},
  ],
  socials: [
    {name: 'GitHub', href: 'https://github.com/jcamilomnavia', slug: 'github'},
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/juan-camilo-marin-navia/',
      slug: 'linkedin',
    },
    {name: 'GitLab', href: 'https://gitlab.com/jcmnavia', slug: 'gitlab'},
    {
      name: 'Discord',
      href: 'https://discord.com/users/jcmnavia#0162',
      slug: 'discord',
    },
    {
      name: 'Goodreads',
      href: 'https://www.goodreads.com/user/show/137777093-juan-camilo-marin-navia',
      slug: 'goodreads',
    },
    {name: 'Twitter', href: 'https://twitter.com/jcmn99', slug: 'x'},
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/jcmnavia',
      slug: 'instagram',
    },
  ],
} as const;

export type Profile = typeof profile;
```

- [ ] **Step 2: Create `src/app/content/jobs.ts`** (verbatim data from `src/app/assets/content/jobs.ts`, typed)

```ts
export type Job = {
  title: string;
  description: string;
  place: string;
  dates: string;
  image: string;
};

const jobs: Job[] = [
  {
    title: 'Full Stack Developer - Freelance',
    description: `▪ Developed a web application that made payment projections for clients and generate different reports.
      \r▪ The stack used was React.js with Bootstrap and Node.js with GraphQL. Deployments of the app were made with docker to a custom server.
      \r▪ This application has helped to speed up processes, since there are several brances, they needed to centralize their data. Current amount of users: 20`,
    place: 'Lar Proyectos S.A.S',
    dates: 'December 2018 - April 2020',
    image: '/logos/lar.png',
  },
  {
    title: 'Full Stack Developer - Freelance',
    description: `▪ Developed the Front-End side of a mobile application, achieving the design proposed to the last minimun detail.
      \r▪ The framework used was Ionic 5 with Angular JS.
      \r▪ Handled API connection with a Django application and modified backend when necessary`,
    place: 'Zaito S.A.S',
    dates: 'April 2020 - May 2020',
    image: '/logos/zaito.png',
  },
  {
    title: 'Junior Full Stack Developer',
    description: `▪ Developed backend's applications with Nest.js using Fastify and express middleware’s. 
      \r▪ Developed 6 frontend applications with React using frameworks such as redux, bootstrap and BEM convention.
      \r▪ Developed 18 landing pages using Gatsby.js optimized for SEO.
      \r▪ Deployed applications/containers in AWS manually and Terraform.`,
    place: 'Red Valley S.A.S',
    dates: 'May 2020 -  August 2021',
    image: '/logos/redvalley.png',
  },
  {
    title: 'Mid Senior Front-end Developer',
    description: `▪ Developed a Front-end library with Rollup.js, made custom components to be used in a custom configured SSR application.
      \r▪ The Frameworks used were react alongside emotion.js for styling`,
    place: 'Huge Inc',
    dates: 'August 2021 - February 2022',
    image: '/logos/huge.png',
  },
  {
    title: 'Mid Senior Full Stack Developer',
    description: `▪ Developed 2 complete React Native applicactions successfully published to the stores
    \r▪ Gave support in Web apps and Backend apps with React and Nestjs. 
    \r▪ Frameworks/libraries used: Expo, Redux, Styled-components, Maps, In-App-Purchases.`,
    place: 'Red Valley S.A.S',
    dates: 'February 2022 - Present',
    image: '/logos/redvalley.png',
  },
];

export default jobs;
```

- [ ] **Step 3: Create `src/app/content/skills.ts`** (24 skills; `icon` = simple-icons export name, or `null` → text tile)

```ts
export type Skill = {
  label: string;
  /** simple-icons export name (e.g. 'siReact'), or null to render a text tile */
  icon: string | null;
};

const skills: Skill[] = [
  {label: 'AWS', icon: null},
  {label: 'Bash', icon: 'siGnubash'},
  {label: 'Bootstrap', icon: 'siBootstrap'},
  {label: 'Docker', icon: 'siDocker'},
  {label: 'Express', icon: 'siExpress'},
  {label: 'Gatsby', icon: 'siGatsby'},
  {label: 'Git', icon: 'siGit'},
  {label: 'GitHub', icon: 'siGithub'},
  {label: 'GraphQL', icon: 'siGraphql'},
  {label: 'Heroku', icon: null},
  {label: 'HTML5', icon: 'siHtml5'},
  {label: 'Jest', icon: 'siJest'},
  {label: 'JavaScript', icon: 'siJavascript'},
  {label: 'Laravel', icon: 'siLaravel'},
  {label: 'Node.js', icon: 'siNodedotjs'},
  {label: 'PHP', icon: 'siPhp'},
  {label: 'PostgreSQL', icon: 'siPostgresql'},
  {label: 'React', icon: 'siReact'},
  {label: 'Redux', icon: 'siRedux'},
  {label: 'Sass', icon: 'siSass'},
  {label: 'SQL', icon: null},
  {label: 'Terraform', icon: 'siTerraform'},
  {label: 'TypeScript', icon: 'siTypescript'},
  {label: 'VS Code', icon: null},
  {label: 'WordPress', icon: 'siWordpress'},
];

export default skills;
```

- [ ] **Step 4: Create `src/app/content/education.ts`** (extracted verbatim from old `sections/education/index.tsx`)

```ts
export type Education = {
  title: string;
  university: string;
  place: string;
  dates: string;
  gpa?: string;
};

const education: Education[] = [
  {
    title: 'Sofware Engineer',
    university: 'EAFIT University',
    place: 'Medellin, Colombia',
    dates: '2017-2022',
    gpa: '4.1',
  },
  {
    title: 'Java tutor',
    university: 'EAFIT University',
    place: 'Medellin, Colombia',
    dates: 'Jan 2019 - May 2019',
  },
  {
    title: 'Black Belt Certificacion',
    university: 'DEV.F',
    place: 'Medellin, Colombia',
    dates: '2019',
  },
  {
    title: 'Sofware Engineer\nExchange Program',
    university: 'La Salle Ramon Lull University',
    place: 'Barcelona, Spain',
    dates: 'Aug 2019 - Jan 2020',
    gpa: '4.5',
  },
];

export default education;
```

- [ ] **Step 5: Verify types**

Run: `pnpm exec tsc --noEmit`
Expected: exit 0.

- [ ] **Step 6: Commit**

```bash
git add src/app/content/
git commit -m "feat: extract content to typed modules (unchanged data)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Motion reveal wrapper

**Files:**
- Create: `src/app/components/motion/reveal.tsx`

- [ ] **Step 1: Create `src/app/components/motion/reveal.tsx`**

```tsx
'use client';

import {motion, useReducedMotion} from 'framer-motion';
import type {ReactNode} from 'react';

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
};

/** Scroll-in reveal, fires once. Respects prefers-reduced-motion. */
export function Reveal({children, delay = 0, y = 24, className}: RevealProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{opacity: 0, y}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: '-80px'}}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Verify types**

Run: `pnpm exec tsc --noEmit`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/app/components/motion/reveal.tsx
git commit -m "feat: scroll-reveal motion wrapper (reduced-motion aware)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Scrapbook primitives

**Files:**
- Create: `src/app/components/primitives/tape-label.tsx`
- Create: `src/app/components/primitives/scrawl-text.tsx`
- Create: `src/app/components/primitives/sticker-badge.tsx`
- Create: `src/app/components/primitives/section-heading.tsx`

- [ ] **Step 1: Create `src/app/components/primitives/tape-label.tsx`**

```tsx
import type {ReactNode} from 'react';
import {cn} from '@/app/lib/cn';

type TapeLabelProps = {
  children: ReactNode;
  tone?: 'pine' | 'clay';
  rotate?: number;
  className?: string;
};

export function TapeLabel({
  children,
  tone = 'pine',
  rotate = -2,
  className,
}: TapeLabelProps) {
  return (
    <span
      className={cn(
        'inline-block rounded-[4px] px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-[0.04em] shadow-sm',
        tone === 'pine'
          ? 'bg-secondary text-secondary-foreground'
          : 'bg-accent text-accent-foreground',
        className
      )}
      style={{transform: `rotate(${rotate}deg)`}}
    >
      {children}
    </span>
  );
}
```

- [ ] **Step 2: Create `src/app/components/primitives/scrawl-text.tsx`**

```tsx
import type {ReactNode} from 'react';
import {cn} from '@/app/lib/cn';

type ScrawlTextProps = {
  children: ReactNode;
  rotate?: number;
  className?: string;
};

/** Handwritten-feel aside in the literary serif italic. */
export function ScrawlText({
  children,
  rotate = -1.5,
  className,
}: ScrawlTextProps) {
  return (
    <span
      className={cn(
        'inline-block font-serif text-lg italic text-accent',
        className
      )}
      style={{transform: `rotate(${rotate}deg)`}}
    >
      {children}
    </span>
  );
}
```

- [ ] **Step 3: Create `src/app/components/primitives/sticker-badge.tsx`**

```tsx
import type {ReactNode} from 'react';
import {cn} from '@/app/lib/cn';

type StickerBadgeProps = {
  children: ReactNode;
  as?: 'span' | 'a';
  href?: string;
  download?: boolean;
  rotate?: number;
  className?: string;
};

/** Circular pasted-sticker, used for CTAs and highlights. */
export function StickerBadge({
  children,
  as = 'span',
  href,
  download,
  rotate = -12,
  className,
}: StickerBadgeProps) {
  const classes = cn(
    'inline-flex h-24 w-24 items-center justify-center rounded-full bg-foreground p-3 text-center font-mono text-[11px] font-bold uppercase leading-tight text-background shadow-md transition-transform duration-300 ease-out hover:scale-105',
    className
  );
  const style = {transform: `rotate(${rotate}deg)`};

  if (as === 'a') {
    return (
      <a href={href} download={download} className={classes} style={style}>
        {children}
      </a>
    );
  }
  return (
    <span className={classes} style={style}>
      {children}
    </span>
  );
}
```

- [ ] **Step 4: Create `src/app/components/primitives/section-heading.tsx`**

```tsx
import type {ReactNode} from 'react';
import {cn} from '@/app/lib/cn';

type SectionHeadingProps = {
  /** mono kicker above the headline */
  kicker: string;
  /** plain headline text; wrap the emphasized word with <em> for the serif-italic clash */
  children: ReactNode;
  id?: string;
  className?: string;
};

/**
 * Section heading: mono kicker + huge Bricolage display headline.
 * Any <em> inside `children` renders in the literary serif italic, in accent.
 */
export function SectionHeading({
  kicker,
  children,
  id,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn('flex flex-col gap-3', className)} id={id}>
      <span className='font-mono text-xs font-bold uppercase tracking-[0.04em] text-accent'>
        {kicker}
      </span>
      <h2 className='max-w-[14ch] font-display text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-[0.88] tracking-[-0.03em] [&_em]:font-serif [&_em]:font-medium [&_em]:italic [&_em]:text-accent'>
        {children}
      </h2>
    </div>
  );
}
```

- [ ] **Step 5: Verify types + lint**

Run: `pnpm exec tsc --noEmit && pnpm lint`
Expected: both exit 0.

- [ ] **Step 6: Commit**

```bash
git add src/app/components/primitives/
git commit -m "feat: scrapbook primitives (tape, scrawl, sticker, heading)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: Skill icon (simple-icons path or text tile)

**Files:**
- Create: `src/app/components/primitives/skill-icon.tsx`

- [ ] **Step 1: Create `src/app/components/primitives/skill-icon.tsx`**

`simple-icons` exports objects keyed by name (e.g. `siReact`) with a `path` (SVG path data). For skills with `icon: null`, render a typeset mono name tile (on-brand scrapbook fallback for AWS/Heroku/SQL/VS Code).

```tsx
import * as simpleIcons from 'simple-icons';
import type {Skill} from '@/app/content/skills';
import {cn} from '@/app/lib/cn';

type SimpleIcon = {title: string; path: string};

export function SkillIcon({skill}: {skill: Skill}) {
  const icon =
    skill.icon &&
    (simpleIcons as unknown as Record<string, SimpleIcon | undefined>)[
      skill.icon
    ];

  if (!icon) {
    return (
      <span
        className={cn(
          'inline-flex h-12 items-center rounded-md border border-border bg-card px-4 font-mono text-sm font-bold text-foreground/80'
        )}
        title={skill.label}
      >
        {skill.label}
      </span>
    );
  }

  return (
    <span
      className='inline-flex items-center gap-2.5 text-foreground/70 transition-colors duration-300 hover:text-accent'
      title={skill.label}
    >
      <svg
        role='img'
        viewBox='0 0 24 24'
        aria-hidden='true'
        className='h-7 w-7 fill-current'
      >
        <path d={icon.path} />
      </svg>
      <span className='font-mono text-sm font-bold'>{skill.label}</span>
    </span>
  );
}
```

- [ ] **Step 2: Verify types**

Run: `pnpm exec tsc --noEmit`
Expected: exit 0. If `simple-icons` typing complains, the `as unknown as Record<...>` cast above handles it; do not add `@ts-ignore`.

- [ ] **Step 3: Commit**

```bash
git add src/app/components/primitives/skill-icon.tsx
git commit -m "feat: skill icon with simple-icons + text-tile fallback

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 8: Marquee row

**Files:**
- Create: `src/app/components/primitives/marquee-row.tsx`

- [ ] **Step 1: Add marquee keyframes to `src/app/globals.css`**

Append at the end of the file:
```css
@keyframes marquee-ltr {
  from {
    transform: translateX(-50%);
  }
  to {
    transform: translateX(0);
  }
}
@keyframes marquee-rtl {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}
.marquee-track {
  display: flex;
  width: max-content;
  gap: 3rem;
  will-change: transform;
}
.marquee-rtl {
  animation: marquee-rtl var(--marquee-duration, 40s) linear infinite;
}
.marquee-ltr {
  animation: marquee-ltr var(--marquee-duration, 40s) linear infinite;
}
.marquee-row:hover .marquee-track {
  animation-play-state: paused;
}
@media (prefers-reduced-motion: reduce) {
  .marquee-rtl,
  .marquee-ltr {
    animation: none;
  }
}
```

- [ ] **Step 2: Create `src/app/components/primitives/marquee-row.tsx`**

Duplicates children once for a seamless 50%-translate loop. Reduced-motion renders a static wrapped grid (no animation, content readable).

```tsx
'use client';

import {useReducedMotion} from 'framer-motion';
import type {ReactNode} from 'react';
import {cn} from '@/app/lib/cn';

type MarqueeRowProps = {
  children: ReactNode[];
  direction?: 'ltr' | 'rtl';
  durationSeconds?: number;
  className?: string;
};

export function MarqueeRow({
  children,
  direction = 'rtl',
  durationSeconds = 40,
  className,
}: MarqueeRowProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div className={cn('flex flex-wrap gap-x-12 gap-y-5', className)}>
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn('marquee-row overflow-hidden', className)}
      aria-hidden='false'
    >
      <div
        className={cn(
          'marquee-track',
          direction === 'rtl' ? 'marquee-rtl' : 'marquee-ltr'
        )}
        style={
          {['--marquee-duration' as string]: `${durationSeconds}s`}
        }
      >
        {children}
        {children.map((child, i) => (
          <span key={`dup-${i}`} aria-hidden='true'>
            {child}
          </span>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Build (validates keyframe CSS compiles)**

Run: `pnpm build`
Expected: exit 0, `out/index.html` generated.

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css src/app/components/primitives/marquee-row.tsx
git commit -m "feat: infinite marquee row (pause-on-hover, reduced-motion grid)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 9: UI primitives — Button + theme toggle

**Files:**
- Create: `src/app/components/ui/button.tsx`
- Create: `src/app/components/ui/theme-toggle.tsx`

- [ ] **Step 1: Create `src/app/components/ui/button.tsx`** (shadcn-style, cva)

```tsx
import * as React from 'react';
import {cva, type VariantProps} from 'class-variance-authority';
import {cn} from '@/app/lib/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        solid: 'bg-foreground text-background hover:bg-accent',
        accent: 'bg-accent text-accent-foreground hover:opacity-90',
        ghost: 'border border-border text-foreground hover:bg-muted',
      },
      size: {
        default: 'h-11 px-5',
        sm: 'h-9 px-4',
      },
    },
    defaultVariants: {variant: 'solid', size: 'default'},
  }
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({className, variant, size, ...props}, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({variant, size}), className)}
      {...props}
    />
  )
);
Button.displayName = 'Button';

export {buttonVariants};
```

- [ ] **Step 2: Create `src/app/components/ui/theme-toggle.tsx`**

Mounted-guard avoids hydration mismatch in static export. NOTE: `eslint-config-next@16` flat config enables `react-hooks/set-state-in-effect`, which flags the standard `useEffect(() => setMounted(true), [])` next-themes guard. Append `// eslint-disable-line react-hooks/set-state-in-effect` to that exact line (user-approved: localized inline disable, do not relax the rule project-wide).

```tsx
'use client';

import {useEffect, useState} from 'react';
import {useTheme} from 'next-themes';
import {Moon, Sun} from 'lucide-react';
import {cn} from '@/app/lib/cn';

export function ThemeToggle({className}: {className?: string}) {
  const {resolvedTheme, setTheme} = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type='button'
      aria-label={
        mounted
          ? `Switch to ${isDark ? 'light' : 'dark'} mode`
          : 'Toggle color theme'
      }
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
    >
      {mounted && isDark ? (
        <Sun className='h-4 w-4' />
      ) : (
        <Moon className='h-4 w-4' />
      )}
    </button>
  );
}
```

- [ ] **Step 3: Verify types + lint**

Run: `pnpm exec tsc --noEmit && pnpm lint`
Expected: both exit 0.

- [ ] **Step 4: Commit**

```bash
git add src/app/components/ui/
git commit -m "feat: Button (cva) + theme toggle primitives

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 10: Nav section

**Files:**
- Create: `src/app/components/sections/nav.tsx`

- [ ] **Step 1: Create `src/app/components/sections/nav.tsx`**

Sticky, mono wordmark + center links + theme toggle. Paper-grain backdrop fades in on scroll. Mobile: taped "Menu" sticker → full-screen warm overlay. Uses native anchor links (`#work` etc.) — `scroll-behavior: smooth` is set globally in `globals.css` (replaces `react-anchor-link-smooth-scroll`).

```tsx
'use client';

import {useEffect, useState} from 'react';
import {ThemeToggle} from '@/app/components/ui/theme-toggle';
import {cn} from '@/app/lib/cn';

const LINKS = [
  {label: 'Work', href: '#work'},
  {label: 'Skills', href: '#skills'},
  {label: 'Education', href: '#education'},
  {label: 'About', href: '#about'},
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-colors duration-300',
        scrolled && 'paper-grain bg-background/85 backdrop-blur-sm'
      )}
    >
      <nav className='mx-auto flex max-w-6xl items-center justify-between px-6 py-4'>
        <a
          href='#top'
          className='font-mono text-sm font-bold tracking-[0.08em] text-foreground'
        >
          JCMN
        </a>

        <div className='hidden items-center gap-7 md:flex'>
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className='rounded-sm font-mono text-xs uppercase tracking-[0.06em] text-muted-foreground transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
            >
              {l.label}
            </a>
          ))}
          <ThemeToggle />
        </div>

        <div className='flex items-center gap-3 md:hidden'>
          <ThemeToggle />
          <button
            type='button'
            aria-label='Open menu'
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className='rounded-[4px] bg-secondary px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-[0.04em] text-secondary-foreground shadow-sm'
            style={{transform: 'rotate(-2deg)'}}
          >
            Menu
          </button>
        </div>
      </nav>

      {open && (
        <div className='fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-background md:hidden'>
          <button
            type='button'
            aria-label='Close menu'
            onClick={() => setOpen(false)}
            className='absolute right-6 top-5 font-mono text-xs font-bold uppercase tracking-[0.06em] text-accent'
          >
            Close ✕
          </button>
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className='font-display text-3xl font-extrabold text-foreground'
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 2: Verify types + lint**

Run: `pnpm exec tsc --noEmit && pnpm lint`
Expected: both exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/app/components/sections/nav.tsx
git commit -m "feat: redesigned nav (sticky, mobile overlay, theme toggle)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 11: Header (hero) section

**Files:**
- Create: `src/app/components/sections/header.tsx`

- [ ] **Step 1: Create `src/app/components/sections/header.tsx`**

B2 treatment: mono kicker → huge Bricolage headline with Spectral-italic clash → Hanken sub → clay sticker CV badge. Pine tape top-right. Staggered entrance via `framer-motion` (reduced-motion aware). Halftone bleed.

```tsx
'use client';

import {motion, useReducedMotion} from 'framer-motion';
import {profile} from '@/app/content/profile';
import {TapeLabel} from '@/app/components/primitives/tape-label';
import {StickerBadge} from '@/app/components/primitives/sticker-badge';

const EASE = [0.16, 1, 0.3, 1] as const;

export function Header() {
  const reduced = useReducedMotion();
  const item = (delay: number) =>
    reduced
      ? {}
      : {
          initial: {opacity: 0, y: 26},
          animate: {opacity: 1, y: 0},
          transition: {duration: 0.75, delay, ease: EASE},
        };

  return (
    <section
      id='top'
      className='relative flex min-h-[88vh] items-center overflow-hidden px-6'
    >
      <div className='paper-grain pointer-events-none absolute right-0 top-0 h-full w-1/3 opacity-70' />

      <div className='absolute right-6 top-28 md:right-16'>
        <TapeLabel tone='pine' rotate={4}>
          {`// ${profile.yearsShipping} yrs shipping`}
        </TapeLabel>
      </div>

      <div className='mx-auto w-full max-w-6xl'>
        <motion.p
          {...item(0)}
          className='mb-3 font-mono text-xs font-bold uppercase tracking-[0.04em] text-accent'
        >
          {`// ${profile.title}`}
        </motion.p>

        <h1 className='font-display text-[clamp(2.75rem,8vw,6.5rem)] font-extrabold leading-[0.88] tracking-[-0.03em]'>
          <motion.span {...item(0.08)} className='block'>
            I don&apos;t just{' '}
            <span className='font-serif font-medium italic text-accent'>
              work.
            </span>
          </motion.span>
          <motion.span {...item(0.16)} className='block'>
            I make things happen.
          </motion.span>
        </h1>

        <motion.p
          {...item(0.24)}
          className='mt-6 max-w-[44ch] font-body text-base leading-relaxed text-muted-foreground md:text-lg'
        >
          Full Stack JavaScript engineer. {profile.yearsShipping}+ years
          building production web &amp; mobile across React, Node, AWS and
          React Native.
        </motion.p>

        <motion.div {...item(0.32)} className='mt-10'>
          <StickerBadge as='a' href={profile.cvPath} download rotate={-8}>
            Download CV ↓
          </StickerBadge>
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify types + lint**

Run: `pnpm exec tsc --noEmit && pnpm lint`
Expected: both exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/app/components/sections/header.tsx
git commit -m "feat: redesigned hero (staggered entrance, scrapbook motifs)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 12: Work section (alternating timeline)

**Files:**
- Create: `src/app/components/sections/work.tsx`

- [ ] **Step 1: Create `src/app/components/sections/work.tsx`**

Alternating left/right entries (not identical cards): big Bricolage place, mono dates as TapeLabel, Hanken bullet description, rotated pasted logo. Inline scrawl CV link. Per-entry reveal with offset delay. Description newlines (`\r`/`\n`) split into bullet lines.

```tsx
import Image from 'next/image';
import jobs from '@/app/content/jobs';
import {profile} from '@/app/content/profile';
import {SectionHeading} from '@/app/components/primitives/section-heading';
import {TapeLabel} from '@/app/components/primitives/tape-label';
import {ScrawlText} from '@/app/components/primitives/scrawl-text';
import {Reveal} from '@/app/components/motion/reveal';
import {cn} from '@/app/lib/cn';

function bullets(description: string) {
  return description
    .split(/[\r\n]+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function Work() {
  return (
    <section
      id='work'
      className='mx-auto max-w-6xl px-6 py-[clamp(5rem,12vh,9rem)]'
    >
      <SectionHeading kicker={`// ${profile.title}`}>
        I don&apos;t just <em>work.</em>
      </SectionHeading>

      <p className='mt-5 font-body text-muted-foreground'>
        Also available as a one-pager:{' '}
        <a href={profile.cvPath} download className='underline'>
          <ScrawlText rotate={-1}>grab the CV ↓</ScrawlText>
        </a>
      </p>

      <div className='mt-16 flex flex-col gap-20'>
        {jobs.map((job, i) => {
          const flip = i % 2 === 1;
          return (
            <Reveal key={`${job.place}-${i}`} delay={(i % 2) * 0.08}>
              <article
                className={cn(
                  'flex flex-col gap-6 md:flex-row md:items-start md:gap-12',
                  flip && 'md:flex-row-reverse'
                )}
              >
                <div className='md:w-1/3'>
                  <div
                    className='inline-block rounded-md border border-border bg-card p-5 shadow-sm'
                    style={{transform: `rotate(${flip ? 2 : -2}deg)`}}
                  >
                    <Image
                      src={job.image}
                      alt={`${job.place} logo`}
                      width={120}
                      height={120}
                      className='h-20 w-auto object-contain'
                    />
                  </div>
                </div>

                <div className='md:w-2/3'>
                  <TapeLabel tone='pine' rotate={flip ? 3 : -3}>
                    {job.dates}
                  </TapeLabel>
                  <h3 className='mt-4 font-display text-[clamp(1.5rem,3vw,2.25rem)] font-extrabold leading-[0.95] tracking-[-0.02em]'>
                    {job.place}
                  </h3>
                  <p className='mt-1 font-mono text-sm font-bold text-accent'>
                    {job.title}
                  </p>
                  <ul className='mt-4 flex flex-col gap-2 font-body text-muted-foreground'>
                    {bullets(job.description).map((line, b) => (
                      <li key={b}>{line}</li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify types + lint**

Run: `pnpm exec tsc --noEmit && pnpm lint`
Expected: both exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/app/components/sections/work.tsx
git commit -m "feat: work section as alternating timeline

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 13: Skills marquee section

**Files:**
- Create: `src/app/components/sections/skills-marquee.tsx`

- [ ] **Step 1: Create `src/app/components/sections/skills-marquee.tsx`**

Two MarqueeRows, opposite directions, different speeds, split of the 24 skills. SkillIcon handles logo-or-text-tile.

```tsx
import skills from '@/app/content/skills';
import {profile} from '@/app/content/profile';
import {SectionHeading} from '@/app/components/primitives/section-heading';
import {MarqueeRow} from '@/app/components/primitives/marquee-row';
import {SkillIcon} from '@/app/components/primitives/skill-icon';

export function SkillsMarquee() {
  const mid = Math.ceil(skills.length / 2);
  const rowA = skills.slice(0, mid);
  const rowB = skills.slice(mid);

  return (
    <section
      id='skills'
      className='overflow-hidden py-[clamp(5rem,12vh,9rem)]'
    >
      <div className='mx-auto mb-14 max-w-6xl px-6'>
        <SectionHeading kicker={`// ${profile.title}`}>
          What I&apos;ve <em>mastered.</em>
        </SectionHeading>
      </div>

      <div className='flex flex-col gap-8'>
        <MarqueeRow direction='rtl' durationSeconds={42}>
          {rowA.map((s) => (
            <SkillIcon key={s.label} skill={s} />
          ))}
        </MarqueeRow>
        <MarqueeRow direction='ltr' durationSeconds={52}>
          {rowB.map((s) => (
            <SkillIcon key={s.label} skill={s} />
          ))}
        </MarqueeRow>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify types + lint**

Run: `pnpm exec tsc --noEmit && pnpm lint`
Expected: both exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/app/components/sections/skills-marquee.tsx
git commit -m "feat: skills as dual motion marquees

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 14: Education section (scrapbook collage)

**Files:**
- Create: `src/app/components/sections/education.tsx`

- [ ] **Step 1: Create `src/app/components/sections/education.tsx`**

Varied-rotation pasted index-card tiles, GPA as circular sticker where present, mono place/dates. Deliberate asymmetry. `title` may contain `\n` (rendered with `whitespace-pre-line`).

```tsx
import education from '@/app/content/education';
import {profile} from '@/app/content/profile';
import {SectionHeading} from '@/app/components/primitives/section-heading';
import {Reveal} from '@/app/components/motion/reveal';

const ROTATIONS = [-2.5, 1.5, -1, 2];

export function Education() {
  return (
    <section
      id='education'
      className='mx-auto max-w-6xl px-6 py-[clamp(5rem,12vh,9rem)]'
    >
      <SectionHeading kicker={`// ${profile.title}`}>
        This is not just <em>some paper.</em>
      </SectionHeading>

      <div className='mt-16 grid gap-8 sm:grid-cols-2'>
        {education.map((e, i) => (
          <Reveal key={`${e.title}-${i}`} delay={(i % 2) * 0.08}>
            <div
              className='relative h-full rounded-md border border-border bg-card p-7 shadow-sm'
              style={{transform: `rotate(${ROTATIONS[i % ROTATIONS.length]}deg)`}}
            >
              {e.gpa && (
                <div
                  className='absolute -right-4 -top-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-center font-mono text-xs font-bold leading-tight text-accent-foreground shadow-md'
                  style={{transform: 'rotate(-12deg)'}}
                >
                  GPA
                  <br />
                  {e.gpa}
                </div>
              )}
              <h3 className='whitespace-pre-line font-display text-2xl font-extrabold leading-[0.95] tracking-[-0.02em]'>
                {e.title}
              </h3>
              <p className='mt-3 font-body text-foreground'>{e.university}</p>
              <p className='mt-1 font-mono text-sm text-muted-foreground'>
                {e.place}
              </p>
              <p className='mt-4 font-mono text-xs uppercase tracking-[0.06em] text-accent'>
                {e.dates}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify types + lint**

Run: `pnpm exec tsc --noEmit && pnpm lint`
Expected: both exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/app/components/sections/education.tsx
git commit -m "feat: education as scrapbook collage

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 15: About + Footer sections

**Files:**
- Create: `src/app/components/sections/about.tsx`
- Create: `src/app/components/sections/footer.tsx`

- [ ] **Step 1: Create `src/app/components/sections/about.tsx`**

Bio text unchanged (verbatim from old `about-me/index.tsx`), ≤68ch Hanken, `me.jpg` as taped polaroid. Emojis kept. Closing line as scrawl. Note: apostrophes in prose use `&apos;` (avoids the `react/no-unescaped-entities` lint error seen in the upgrade work).

```tsx
import Image from 'next/image';
import {profile} from '@/app/content/profile';
import {SectionHeading} from '@/app/components/primitives/section-heading';
import {ScrawlText} from '@/app/components/primitives/scrawl-text';
import {Reveal} from '@/app/components/motion/reveal';

export function About() {
  return (
    <section
      id='about'
      className='mx-auto max-w-6xl px-6 py-[clamp(5rem,12vh,9rem)]'
    >
      <SectionHeading kicker={`// ${profile.title}`}>
        Yep! This is <em>me</em> 😎
      </SectionHeading>

      <div className='mt-14 grid gap-12 md:grid-cols-[1fr_auto] md:items-start'>
        <div className='max-w-[68ch] space-y-5 font-body text-base leading-relaxed text-foreground/85'>
          <p>
            I am a person always interested in learning and improving myself in
            every way. I&apos;m passionate in what I do and always give my best
            no matter what.
          </p>
          <p>
            I&apos;ve been always into computers and stuff (oh, I did... explore
            into some computers - Yes, I broke them 😅). I really believe in
            self-taught learning, that&apos;s why even since I started the
            university, I took the knowledge to the next level and put into real
            world situations, getting that extra experience that gave me a
            boost. Now I&apos;m proud to say that I&apos;ve become a great
            developer, I&apos;ve so much to offer and still so much to learn. My
            journey started at 17th years-old and I don&apos;t expect it to end
            soon, on the contrary, here I am looking for challenges!
          </p>
          <p>
            I also love reading books -- don&apos;t tell me you don&apos;t like
            Harry Potter 🫣, I love practicing tennis 🎾, I&apos;m a photographer
            when I have the chance 📸 and... yeah, I think that&apos;s it. Ah, I
            also like to paint 🎨.
          </p>
          <p className='pt-2'>
            <ScrawlText rotate={-1}>
              Feel free to reach out — coffee, tennis, or that amazing idea
              you have. Anything, really!
            </ScrawlText>
          </p>
        </div>

        <Reveal>
          <div
            className='rounded-md border border-border bg-card p-3 shadow-md'
            style={{transform: 'rotate(3deg)'}}
          >
            <Image
              src='/images/me.jpg'
              alt='Juan Camilo, smiling'
              width={300}
              height={360}
              className='h-auto w-[240px] object-cover'
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `src/app/components/sections/footer.tsx`**

Big Bricolage line, social list (simple-icons), email + phones. No newsletter/filler.

```tsx
import * as simpleIcons from 'simple-icons';
import {profile} from '@/app/content/profile';

type SimpleIcon = {title: string; path: string};

const SOCIAL_ICON: Record<string, string> = {
  github: 'siGithub',
  linkedin: 'siLinkedin',
  gitlab: 'siGitlab',
  discord: 'siDiscord',
  goodreads: 'siGoodreads',
  x: 'siX',
  instagram: 'siInstagram',
};

export function Footer() {
  const icons = simpleIcons as unknown as Record<
    string,
    SimpleIcon | undefined
  >;

  return (
    <footer className='paper-grain border-t border-border'>
      <div className='mx-auto max-w-6xl px-6 py-[clamp(4rem,10vh,7rem)]'>
        <h2 className='font-display text-[clamp(2rem,6vw,4rem)] font-extrabold leading-[0.9] tracking-[-0.03em]'>
          Let&apos;s make <span className='text-accent'>things happen.</span>
        </h2>

        <div className='mt-12 flex flex-col gap-3'>
          {profile.socials.map((s) => {
            const icon = icons[SOCIAL_ICON[s.slug]];
            return (
              <a
                key={s.name}
                href={s.href}
                className='group inline-flex items-center gap-3 font-mono text-sm text-muted-foreground transition-colors hover:text-accent'
              >
                {icon && (
                  <svg
                    role='img'
                    viewBox='0 0 24 24'
                    aria-hidden='true'
                    className='h-4 w-4 fill-current'
                  >
                    <path d={icon.path} />
                  </svg>
                )}
                <span className='transition-transform group-hover:translate-x-1'>
                  {s.name}
                </span>
              </a>
            );
          })}
        </div>

        <div className='mt-12 flex flex-col gap-2 font-mono text-sm text-muted-foreground'>
          <a href={`mailto:${profile.email}`} className='hover:text-accent'>
            {profile.email}
          </a>
          {profile.phones.map((p) => (
            <a key={p.href} href={p.href} className='hover:text-accent'>
              {p.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Verify types + lint**

Run: `pnpm exec tsc --noEmit && pnpm lint`
Expected: both exit 0. (If `siX`/`siGoodreads` are missing in simple-icons, the `icon &&` guard renders the name without a logo — not an error. The plan author confirmed `siGithub` exists; others degrade gracefully.)

- [ ] **Step 4: Commit**

```bash
git add src/app/components/sections/about.tsx src/app/components/sections/footer.tsx
git commit -m "feat: about (taped polaroid) + footer sections

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 16: Assemble page + delete legacy code

**Files:**
- Modify: `src/app/page.tsx`
- Delete: `src/app/sections/`, `src/app/components/{job-card,skill-deck,nav-card,education-card}/`, `src/app/assets/`
- Modify: `package.json` (remove legacy deps)

- [ ] **Step 1: Replace `src/app/page.tsx`**

```tsx
import {Nav} from '@/app/components/sections/nav';
import {Header} from '@/app/components/sections/header';
import {Work} from '@/app/components/sections/work';
import {SkillsMarquee} from '@/app/components/sections/skills-marquee';
import {Education} from '@/app/components/sections/education';
import {About} from '@/app/components/sections/about';
import {Footer} from '@/app/components/sections/footer';

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Header />
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

- [ ] **Step 2: Delete legacy directories**

Run:
```bash
git rm -r src/app/sections src/app/components/job-card src/app/components/skill-deck src/app/components/nav-card src/app/components/education-card src/app/assets
```
Expected: files removed (these are the old Bootstrap/SCSS/FontAwesome components, old SCSS, Roobert fonts, old content).

- [ ] **Step 3: Remove legacy dependencies**

Run:
```bash
pnpm remove bootstrap reactstrap sass @fortawesome/fontawesome-svg-core @fortawesome/free-brands-svg-icons @fortawesome/free-regular-svg-icons @fortawesome/free-solid-svg-icons @fortawesome/react-fontawesome react-anchor-link-smooth-scroll @types/react-anchor-link-smooth-scroll classnames
```
Expected: removed from `package.json`; `pnpm-lock.yaml` updated.

- [ ] **Step 4: Verify no dangling imports**

Run:
```bash
grep -rn "bootstrap\|reactstrap\|fortawesome\|react-anchor-link\|classnames\|assets/styles\|assets/content\|\.scss" src/ ; echo "EXIT=$?"
```
Expected: `EXIT=1` (grep finds nothing — no remaining references). If anything prints, fix that import before continuing.

- [ ] **Step 5: Full verification (build + lint + types)**

Run: `pnpm build`
Expected: exit 0, "Compiled successfully", `out/index.html` generated, no Sass warnings (SCSS is gone).

Run: `pnpm lint && pnpm exec tsc --noEmit`
Expected: both exit 0.

- [ ] **Step 6: Verify static export artifact**

Run:
```bash
ls out/index.html out/.nojekyll && grep -c "Marín Navia" out/index.html
```
Expected: both files exist; grep count ≥ 1 (name rendered in static HTML).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: assemble redesigned page, remove Bootstrap/SCSS/FontAwesome

Legacy sections, SCSS, Roobert fonts and FontAwesome/reactstrap/
classnames fully removed. Site now Tailwind v4 + scrapbook design.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 17: Final polish pass (manual verification)

**Files:** none (verification + targeted fixes only)

- [ ] **Step 1: Visual check, both themes, four widths**

Run: `pnpm dev` then open `http://localhost:3000`.
Check at viewport widths 360 / 768 / 1024 / 1440, in BOTH light and dark (toggle in nav):
- Hero type scales, no overflow; tape/sticker rotations intact.
- Work timeline alternates on desktop, single column on mobile.
- Skills marquees scroll opposite directions; hover pauses.
- Education collage asymmetric; GPA stickers placed; no clipping.
- About text ≤68ch readable; polaroid intact; emojis render.
- Footer social hover slides; links correct.
- Contrast: body and headings legible in both themes.

- [ ] **Step 2: Reduced-motion check**

In browser devtools, emulate `prefers-reduced-motion: reduce`. Reload.
Expected: marquee becomes a static wrapped grid (skills still readable), no entrance animation, no smooth-scroll jank.

- [ ] **Step 3: Fix any issues found**

For each issue, make the minimal targeted edit to the relevant section/primitive. After fixes, re-run: `pnpm build && pnpm lint && pnpm exec tsc --noEmit` (all exit 0).

- [ ] **Step 4: Commit (only if fixes were made)**

```bash
git add -A
git commit -m "polish: responsive + theme + reduced-motion fixes

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 5: Stop the brainstorm visual-companion server**

Run:
```bash
bash /Users/juan/.claude/plugins/cache/claude-plugins-official/superpowers/5.1.0/skills/brainstorming/scripts/stop-server.sh /Users/juan/Documents/repos/jcmn.dev/jcmnavia/.superpowers/brainstorm/81516-1779219518
```
Expected: server stopped (mockups persist under `.superpowers/`, which is gitignored).

---

## Done

The redesign is complete when: `pnpm build` exits 0 with static export, `pnpm lint` and `pnpm exec tsc --noEmit` both 0, no remaining Bootstrap/SCSS/FontAwesome references, and the manual visual + reduced-motion checks pass in both themes. Branch `redesign/scrapbook-pop` is ready for a PR (use `superpowers:finishing-a-development-branch`).

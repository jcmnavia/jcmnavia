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

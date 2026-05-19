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
          {profile.yearsShipping}+ years shipping scalable web &amp; mobile
          across React, Next.js, React Native, Node and Python. Remote, owning
          features end-to-end.
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

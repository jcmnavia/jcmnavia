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

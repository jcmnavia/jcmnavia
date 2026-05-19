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

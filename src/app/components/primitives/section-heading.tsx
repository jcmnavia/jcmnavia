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

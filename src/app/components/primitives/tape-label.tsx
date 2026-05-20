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

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

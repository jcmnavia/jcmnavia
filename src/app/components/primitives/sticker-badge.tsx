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

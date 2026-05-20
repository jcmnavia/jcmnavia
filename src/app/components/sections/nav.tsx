'use client';

import {useEffect, useState} from 'react';
import {ThemeToggle} from '@/app/components/ui/theme-toggle';
import {cn} from '@/app/lib/cn';

const LINKS = [
  {label: 'AI', href: '#ai'},
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

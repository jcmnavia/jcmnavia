'use client';

import {useEffect, useState} from 'react';
import {useTheme} from 'next-themes';
import {Moon, Sun} from 'lucide-react';
import {cn} from '@/app/lib/cn';

export function ThemeToggle({className}: {className?: string}) {
  const {resolvedTheme, setTheme} = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []); // eslint-disable-line react-hooks/set-state-in-effect

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

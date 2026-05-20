import * as simpleIcons from 'simple-icons';
import type {Skill} from '@/app/content/skills';
import {cn} from '@/app/lib/cn';

type SimpleIcon = {title: string; path: string};

export function SkillIcon({skill}: {skill: Skill}) {
  const icon =
    skill.icon &&
    (simpleIcons as unknown as Record<string, SimpleIcon | undefined>)[
      skill.icon
    ];

  if (!icon) {
    return (
      <span
        className={cn(
          'inline-flex h-12 items-center rounded-md border border-border bg-card px-4 font-mono text-sm font-bold text-foreground/80'
        )}
        title={skill.label}
      >
        {skill.label}
      </span>
    );
  }

  return (
    <span
      className='inline-flex items-center gap-2.5 text-foreground/70 transition-colors duration-300 hover:text-accent'
      title={skill.label}
    >
      <svg
        role='img'
        viewBox='0 0 24 24'
        aria-hidden='true'
        className='h-7 w-7 fill-current'
      >
        <path d={icon.path} />
      </svg>
      <span className='font-mono text-sm font-bold'>{skill.label}</span>
    </span>
  );
}

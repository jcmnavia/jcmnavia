import * as simpleIcons from 'simple-icons';
import {profile} from '@/app/content/profile';

type SimpleIcon = {title: string; path: string};

const SOCIAL_ICON: Record<string, string> = {
  github: 'siGithub',
  linkedin: 'siLinkedin',
  gitlab: 'siGitlab',
  discord: 'siDiscord',
  goodreads: 'siGoodreads',
  x: 'siX',
  instagram: 'siInstagram',
};

export function Footer() {
  const icons = simpleIcons as unknown as Record<
    string,
    SimpleIcon | undefined
  >;

  return (
    <footer className='paper-grain border-t border-border'>
      <div className='mx-auto max-w-6xl px-6 py-[clamp(4rem,10vh,7rem)]'>
        <h2 className='font-display text-[clamp(2rem,6vw,4rem)] font-extrabold leading-[0.9] tracking-[-0.03em]'>
          Let&apos;s make <span className='text-accent'>things happen.</span>
        </h2>

        <div className='mt-12 flex flex-col gap-3'>
          {profile.socials.map((s) => {
            const icon = icons[SOCIAL_ICON[s.slug]];
            return (
              <a
                key={s.name}
                href={s.href}
                className='group inline-flex items-center gap-3 font-mono text-sm text-muted-foreground transition-colors hover:text-accent'
              >
                {icon && (
                  <svg
                    role='img'
                    viewBox='0 0 24 24'
                    aria-hidden='true'
                    className='h-4 w-4 fill-current'
                  >
                    <path d={icon.path} />
                  </svg>
                )}
                <span className='transition-transform group-hover:translate-x-1'>
                  {s.name}
                </span>
              </a>
            );
          })}
        </div>

        <div className='mt-12 flex flex-col gap-2 font-mono text-sm text-muted-foreground'>
          <a href={`mailto:${profile.email}`} className='hover:text-accent'>
            {profile.email}
          </a>
          {profile.phones.map((p) => (
            <a key={p.href} href={p.href} className='hover:text-accent'>
              {p.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

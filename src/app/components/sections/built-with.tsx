import * as simpleIcons from 'simple-icons';
import builtWith from '@/app/content/built-with';
import extraBrandIcons from '@/app/lib/extra-brand-icons';

type SimpleIcon = {title: string; path: string};

const icons = simpleIcons as unknown as Record<
  string,
  SimpleIcon | undefined
>;

function resolveIcon(
  iconKey: string | null
): {title: string; path: string} | undefined {
  if (!iconKey) return undefined;
  return icons[iconKey] ?? extraBrandIcons[iconKey];
}

/**
 * "Built with" attribution strip.
 *
 * A compact, footer-adjacent row crediting the tools this portfolio was
 * built on. Deliberately not a "feature" section — reads as a caption
 * sitting between About and Footer, so it's honest about the stack
 * without competing with the work itself.
 *
 * Reuses the existing `Skill` type for items (label + icon key + href) so
 * the icon resolution is the same pattern used by the AI graph and skills
 * marquee. Each item is a clickable anchor with target=_blank/noopener
 * to the tool's homepage, with a small SVG logo and the label inline.
 *
 * Server-rendered. No motion, no state, no client JS. Reduced-motion has
 * nothing to do here since there's no animation to suppress.
 */
export function BuiltWith() {
  return (
    <section
      id='built-with'
      className='mx-auto max-w-6xl border-t border-border/40 px-6 py-12'
    >
      <div className='flex flex-col items-start gap-5 md:flex-row md:items-center md:gap-8'>
        <span className='shrink-0 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground'>
          {'// built with'}
        </span>

        <ul className='flex flex-wrap items-center gap-x-6 gap-y-3'>
          {builtWith.map((item) => {
            const icon = resolveIcon(item.icon);
            return (
              <li key={item.label}>
                <a
                  href={item.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label={`${item.label} — opens in new tab`}
                  className='inline-flex items-center gap-2 rounded-sm font-mono text-xs text-foreground/75 transition-colors duration-200 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
                >
                  {icon ? (
                    <svg
                      role='img'
                      viewBox='0 0 24 24'
                      aria-hidden='true'
                      className='h-4 w-4 fill-current'
                    >
                      <path d={icon.path} />
                    </svg>
                  ) : null}
                  <span>{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

'use client';

import {useEffect, useState, type ReactNode} from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/app/components/ui/tooltip';

type LogoLinkProps = {
  href: string;
  label: string;
  children: ReactNode;
};

/**
 * Logo-node anchor with a deferred tooltip wrapper.
 *
 * Why this exists:
 *   Radix's Tooltip primitive — specifically TooltipTrigger with `asChild`
 *   — mutates the wrapped element's `data-state` attribute on the client
 *   after mount. The Server Component render path doesn't run that mutation,
 *   so the SSR'd `<a>` ships without `data-state`, the client adds it during
 *   hydration, and React throws a hydration mismatch + regenerates the
 *   subtree. The regenerated tree sometimes drops the Tooltip-wrapped
 *   children entirely, silently breaking the 5 logo links.
 *
 * The fix:
 *   On SSR + the first client paint, render a plain `<a>` (no Tooltip).
 *   After the client mounts (post-hydration), swap in the Tooltip-wrapped
 *   variant. SSR and first-paint HTML are now identical → no hydration
 *   mismatch. The tooltip is a pure progressive enhancement that activates
 *   after the page becomes interactive.
 *
 * Same `mounted`-guard pattern the theme-toggle uses for next-themes —
 * established convention in this codebase.
 */
export function LogoLink({href, label, children}: LogoLinkProps) {
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const anchorClassName = 'block';
  const anchorProps = {
    href,
    target: '_blank' as const,
    rel: 'noopener noreferrer',
    'aria-label': `${label} — opens in new tab`,
    className: anchorClassName,
  };

  if (!mounted) {
    // SSR / pre-hydration: plain anchor, no tooltip context, no data-state.
    return <a {...anchorProps}>{children}</a>;
  }

  // Post-mount: wrap with the shadcn Tooltip for the hover/focus hint.
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a {...anchorProps}>{children}</a>
      </TooltipTrigger>
      <TooltipContent side='top'>{label}</TooltipContent>
    </Tooltip>
  );
}

import * as simpleIcons from 'simple-icons';
import aiStack from '@/app/content/ai-stack';
import {cn} from '@/app/lib/cn';
import extraBrandIcons from '@/app/lib/extra-brand-icons';
import {TooltipProvider} from '@/app/components/ui/tooltip';
import {LogoLink} from './logo-link';
import nodes, {
  CAPABILITY_INDICES,
  VIEWBOX_H,
  VIEWBOX_W,
  type NodeSize,
} from './ai-nodes';
import edges from './ai-edges';

type SimpleIcon = {title: string; path: string};

const icons = simpleIcons as unknown as Record<
  string,
  SimpleIcon | undefined
>;

/**
 * Resolve a skill.icon string to an SVG path. Order:
 *   1. simple-icons (the canonical brand-mark source)
 *   2. local `extra-brand-icons.ts` (for brands simple-icons doesn't ship,
 *      e.g. OpenAI removed from simple-icons 16.x)
 * Returns undefined when the icon string is null or matches neither source.
 */
function resolveIcon(
  iconKey: string | null
): {title: string; path: string} | undefined {
  if (!iconKey) return undefined;
  const fromSimple = icons[iconKey];
  if (fromSimple) return fromSimple;
  const fromExtras = extraBrandIcons[iconKey];
  if (fromExtras) return fromExtras;
  return undefined;
}

/**
 * The AI section's living graph: 36 mesh edges + 9 nodes in an organic
 * cluster on the right half of the section.
 *
 * Visual mechanics (CSS-driven, defined in `globals.css`):
 *   • Edges pulse opacity (0.08 → 0.30) AND stroke-width (0.8 → 1.1) on
 *     irregular 4–7s loops with 0–4s per-edge delays.
 *   • Edges fade in collectively (1.1s, starting at 0.95s after page-lift
 *     starts) so the graph "appears through" the rising paper.
 *   • Nodes drift 2–5px on three waypoints over 4.2–5.8s with per-node
 *     phase offsets, starting 1.6s after section reveal.
 *
 * Reduced motion: edges render at static 0.18 opacity; nodes are static at
 * base positions. The fade-in is bypassed (`opacity: 1` immediately).
 * Layout is identical between reduced and non-reduced modes.
 *
 * Server-rendered: this is a Server Component. All "randomness" is
 * hardcoded in `ai-nodes.ts` / `ai-edges.ts`, so SSR output is identical
 * to client output. No hydration mismatch, no client JS required.
 */

/** Pixel dimensions per node-size variant. Logo nodes are circles; tile
 *  nodes are inline-block boxes sized by their text content. */
const LOGO_DIM: Record<Extract<NodeSize, `logo-${string}`>, number> = {
  'logo-lg': 96,
  'logo-md': 80,
  'logo-sm': 64,
};

function isLogo(
  size: NodeSize
): size is Extract<NodeSize, `logo-${string}`> {
  return size.startsWith('logo');
}

export function AIGraph() {
  return (
    <TooltipProvider delayDuration={200}>
      <div
        className='relative mx-auto aspect-[600/480] w-full max-w-[600px] text-foreground'
      >
      {/* Edges layer: SVG with all 36 mesh lines.
          `aspectRatio="none"` stretches the 600×480 viewBox to fit the
          parent (full width on mobile, 600px max on desktop). */}
      <svg
        className='ai-edges absolute inset-0 h-full w-full'
        viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
        preserveAspectRatio='none'
      >
        {edges.map((edge, i) => (
          <line
            key={`e-${i}`}
            className='ai-edge'
            x1={edge.x1}
            y1={edge.y1}
            x2={edge.x2}
            y2={edge.y2}
            style={
              {
                ['--ai-edge-dur' as string]: `${edge.dur}s`,
                ['--ai-edge-delay' as string]: `${edge.delay}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </svg>

      {/* Nodes layer: absolutely positioned DOM elements, centered on
          their pixel coordinates via translate(-50%, -50%). The breath
          animation runs `transform: translate3d` on top of the
          positioning translate — they compose cleanly because the
          positioning lives on the wrapper and the breath on an inner
          motion layer. */}
      {nodes.map((node, i) => {
        const skill = aiStack[i];
        const isCapability = CAPABILITY_INDICES.has(i);
        // `dim` is undefined for tile nodes and the per-variant pixel size
        // for logo nodes. Computed inline so the `isLogo` type predicate
        // narrows `node.size` to the logo-* union when indexing LOGO_DIM.
        const dim = isLogo(node.size) ? LOGO_DIM[node.size] : undefined;
        const icon = resolveIcon(skill.icon);

        // CSS custom properties for the breath animation.
        const motionStyle = {
          ['--ai-dx' as string]: `${node.dx}px`,
          ['--ai-dy' as string]: `${node.dy}px`,
          ['--ai-dx2' as string]: `${node.dx2}px`,
          ['--ai-dy2' as string]: `${node.dy2}px`,
          ['--ai-dx3' as string]: `${node.dx3}px`,
          ['--ai-dy3' as string]: `${node.dy3}px`,
          ['--ai-node-dur' as string]: `${node.dur}s`,
          ['--ai-node-delay' as string]: `${node.delay}s`,
        } as React.CSSProperties;

        // Position wrapper: absolute, % coordinates in the 600×480 space,
        // translated by -50% to center the node visually on (cx, cy).
        const posStyle = {
          left: `${(node.cx / VIEWBOX_W) * 100}%`,
          top: `${(node.cy / VIEWBOX_H) * 100}%`,
          transform: 'translate(-50%, -50%)',
        } as React.CSSProperties;

        // For logo nodes we render the SVG inside a cream-paper circle.
        // Extracted into a variable so the Tooltip+anchor wrapper below
        // can conditionally compose around it without JSX duplication.
        const logoCircle =
          dim !== undefined && icon ? (
            <span
              className={cn(
                'flex items-center justify-center rounded-full border border-border bg-card shadow-lg transition-[transform,box-shadow] duration-300 hover:rotate-6 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
              )}
              style={{width: `${dim}px`, height: `${dim}px`}}
            >
              <svg
                role='img'
                viewBox='0 0 24 24'
                aria-label={node.label}
                className='h-[55%] w-[55%] fill-current text-foreground'
              >
                <path d={icon.path} />
              </svg>
            </span>
          ) : dim !== undefined ? (
            <span
              className='flex items-center justify-center rounded-full border border-border bg-card text-center font-mono text-xs font-bold text-foreground/80 shadow-lg'
              style={{width: `${dim}px`, height: `${dim}px`}}
            >
              {node.label}
            </span>
          ) : null;

        return (
          <div
            key={node.label}
            className='absolute'
            style={posStyle}
          >
            {/* Breath layer — receives the keyframe animation; runs
                INSIDE the positioning wrapper so its transform never
                fights the centering one. `data-ai-node` lives HERE (not
                on the positioning wrapper) so AIGraphMotion's rAF reads
                the drifting bounding-box, not the static parent. */}
            <div
              className='ai-node'
              data-ai-node={i}
              style={motionStyle}
            >
              {dim !== undefined && skill.href ? (
                /* Logo node WITH outbound link: anchor with a deferred
                   Tooltip wrapper (LogoLink). The deferred mount avoids a
                   Radix hydration mismatch that was silently breaking the
                   5 logo nodes — see logo-link.tsx for the explanation. */
                <LogoLink href={skill.href} label={node.label}>
                  {logoCircle}
                </LogoLink>
              ) : dim !== undefined ? (
                /* Logo node without href — render the circle plainly. */
                logoCircle
              ) : (
                /* Text tile: dark ink background, cream label, optional
                   capability hover affordance (clay left-border slide). */
                <span
                  className={cn(
                    'inline-flex items-center rounded-md bg-foreground font-mono font-bold uppercase tracking-[0.04em] text-background shadow-md',
                    node.size === 'tile-lg'
                      ? 'px-4 py-2 text-sm'
                      : 'px-3 py-1.5 text-xs',
                    isCapability &&
                      'transition-shadow duration-300 hover:shadow-[inset_2px_0_0_var(--color-accent)]'
                  )}
                >
                  {node.label}
                </span>
              )}
            </div>
          </div>
        );
      })}
      </div>
    </TooltipProvider>
  );
}

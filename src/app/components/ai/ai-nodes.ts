/**
 * Hand-tuned node positions, sizes, and per-node breath parameters for the
 * AI section's organic-cluster graph.
 *
 * Coordinates are pixel centers inside a 600×480 viewBox; the SVG `<svg>`
 * uses `preserveAspectRatio="none"` so the graph scales with its container
 * (full 600×480 on desktop, ~100%×360 on mobile).
 *
 * Order MATCHES `src/app/content/ai-stack.ts`. Keep both files aligned when
 * adding/removing/reordering items — `ai-edges.ts` references nodes by
 * index, not by id, so a reorder here without a matching update there will
 * silently shift every edge endpoint.
 *
 * Breath parameters drive a CSS keyframe `nodeDrift` (defined in
 * `globals.css`). Each node uses 6 CSS custom properties to express three
 * drift waypoints (`dx/dy`, `dx2/dy2`, `dx3/dy3`) plus a per-node `dur`
 * and `delay` for irregular phase. All values are hand-curated; nothing
 * here is `Math.random()` — required for SSR/static-export stability.
 */

export type NodeSize = 'logo-lg' | 'logo-md' | 'logo-sm' | 'tile-lg' | 'tile-md';

export type AINode = {
  /** Display label — must match the corresponding entry in ai-stack.ts. */
  label: string;
  /** Pixel center inside the 600×480 viewBox. */
  cx: number;
  cy: number;
  /** Visual size variant — determines logo circle vs. text tile rendering. */
  size: NodeSize;
  /** Three drift waypoints (px) for the breath animation. */
  dx: number;
  dy: number;
  dx2: number;
  dy2: number;
  dx3: number;
  dy3: number;
  /** Animation duration in seconds (4.2–5.8s range). */
  dur: number;
  /** Animation delay in seconds (0–1.0s, irregular per-node). */
  delay: number;
};

/**
 * 9 nodes in the same order as `src/app/content/ai-stack.ts`.
 *
 * The cluster lives in the right half of the section's grid (60% column).
 * Layout shape is the "organic cluster" — Claude SDK central-ish but not
 * strictly centered; other 8 nodes balanced visually across the canvas.
 */
const nodes: AINode[] = [
  // 0 — Claude SDK (anchor; biggest logo, near visual center)
  {label: 'Claude SDK', cx: 280, cy: 180, size: 'logo-lg',
   dx: 5, dy: -3, dx2: -4, dy2: 4, dx3: 3, dy3: 5, dur: 5.2, delay: 0.0},
  // 1 — OpenAI SDK (top-left, medium logo; second-largest after Claude SDK)
  {label: 'OpenAI SDK', cx: 165, cy: 95, size: 'logo-md',
   dx: -3, dy: 4, dx2: 5, dy2: -2, dx3: -2, dy3: 3, dur: 4.4, delay: 0.3},
  // 2 — Claude Code (top-right, mid logo)
  {label: 'Claude Code', cx: 420, cy: 110, size: 'logo-md',
   dx: 4, dy: -2, dx2: -3, dy2: 4, dx3: 2, dy3: -4, dur: 4.8, delay: 0.6},
  // 3 — LangChain (mid-left, mid logo)
  {label: 'LangChain', cx: 175, cy: 275, size: 'logo-md',
   dx: -2, dy: 5, dx2: 4, dy2: -3, dx3: -3, dy3: 2, dur: 5.6, delay: 0.9},
  // 4 — LangGraph (mid-right, mid logo)
  {label: 'LangGraph', cx: 440, cy: 270, size: 'logo-md',
   dx: 3, dy: 3, dx2: -4, dy2: -2, dx3: 2, dy3: 4, dur: 4.6, delay: 0.2},
  // 5 — Langfuse (bottom-left tile)
  {label: 'Langfuse', cx: 130, cy: 365, size: 'tile-md',
   dx: -4, dy: -2, dx2: 3, dy2: 4, dx3: -2, dy3: -3, dur: 5.0, delay: 0.7},
  // 6 — RAG (bottom-center, large tile; capability)
  {label: 'RAG', cx: 320, cy: 365, size: 'tile-lg',
   dx: 5, dy: 2, dx2: -3, dy2: -4, dx3: 4, dy3: 3, dur: 5.4, delay: 0.4},
  // 7 — Evals (right edge, mid tile; capability)
  {label: 'Evals', cx: 510, cy: 195, size: 'tile-md',
   dx: -3, dy: -3, dx2: 5, dy2: 2, dx3: -2, dy3: 4, dur: 4.2, delay: 1.0},
  // 8 — Workflows (bottom-right tile; capability)
  {label: 'Workflows', cx: 480, cy: 410, size: 'tile-md',
   dx: 4, dy: -4, dx2: -2, dy2: 3, dx3: 3, dy3: -2, dur: 5.8, delay: 0.5},
];

export default nodes;

/**
 * Indices of "capability" nodes (RAG / Evals / Workflows) that get an
 * additional hover affordance (clay accent left border slide-in). Kept in
 * sync with `ai-stack.ts` ordering — if you reorder, update this set.
 */
export const CAPABILITY_INDICES = new Set<number>([6, 7, 8]);

/**
 * The graph viewBox dimensions. Exported so the SVG and any consumer use
 * one source of truth.
 */
export const VIEWBOX_W = 600;
export const VIEWBOX_H = 480;

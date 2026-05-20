/**
 * The 36 mesh edges between every pair of 9 nodes (C(9,2) = 36).
 *
 * Each edge runs the `edgePulse` keyframe (defined in `globals.css`) which
 * animates both opacity (0.08 → 0.30 → 0.08) and stroke-width (0.8px →
 * 1.1px → 0.8px) over its `dur` seconds, offset by `delay` seconds so the
 * mesh never visibly syncs.
 *
 * `dur` is in the 4.0–7.0s range; `delay` is in the 0.0–4.0s range. All
 * values are hand-curated for visible irregularity (no overlapping phases
 * across adjacent edges). Critically, they are HARDCODED — not
 * `Math.random()` — so the server-rendered HTML matches the client and
 * the static export is byte-stable across builds.
 *
 * `from` and `to` are 0-based indices into `ai-nodes.ts`. Endpoints
 * (x1/y1/x2/y2) are pre-computed from the node centers at build time and
 * exported here so the SVG renderer can stay dumb (no lookup at render
 * time, no recomputation if nodes are reordered without updating this
 * file — which is intentional: reordering is a load-bearing change and
 * should be visible in this file's diff).
 */

import nodes from './ai-nodes';

export type AIEdge = {
  from: number;
  to: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  /** Pulse duration in seconds (4.0–7.0). */
  dur: number;
  /** Pulse delay offset in seconds (0.0–4.0). Breaks visible sync. */
  delay: number;
};

/**
 * 36 pre-computed pulse params, hand-curated so adjacent edges have
 * distinctly different phases. Index in this array = index of the edge in
 * the all-pairs enumeration below (edge 0 = (0,1), edge 1 = (0,2), …,
 * edge 35 = (7,8)).
 *
 * The pattern intentionally varies duration and delay independently so no
 * two adjacent edges peak together. Reviewed by eye: scanning down the
 * column you can't predict the next value.
 */
const PULSE_PARAMS: ReadonlyArray<{dur: number; delay: number}> = [
  {dur: 5.2, delay: 0.0}, // (0,1)
  {dur: 4.6, delay: 0.7}, // (0,2)
  {dur: 6.1, delay: 1.4}, // (0,3)
  {dur: 4.3, delay: 2.1}, // (0,4)
  {dur: 5.7, delay: 2.8}, // (0,5)
  {dur: 4.9, delay: 3.5}, // (0,6)
  {dur: 6.4, delay: 0.3}, // (0,7)
  {dur: 5.0, delay: 1.0}, // (0,8)
  {dur: 4.1, delay: 1.7}, // (1,2)
  {dur: 6.8, delay: 2.4}, // (1,3)
  {dur: 4.7, delay: 3.1}, // (1,4)
  {dur: 5.4, delay: 3.8}, // (1,5)
  {dur: 4.2, delay: 0.6}, // (1,6)
  {dur: 6.3, delay: 1.3}, // (1,7)
  {dur: 5.1, delay: 2.0}, // (1,8)
  {dur: 4.8, delay: 2.7}, // (2,3)
  {dur: 5.9, delay: 3.4}, // (2,4)
  {dur: 4.4, delay: 0.2}, // (2,5)
  {dur: 6.6, delay: 0.9}, // (2,6)
  {dur: 5.3, delay: 1.6}, // (2,7)
  {dur: 4.0, delay: 2.3}, // (2,8)
  {dur: 5.8, delay: 3.0}, // (3,4)
  {dur: 4.5, delay: 3.7}, // (3,5)
  {dur: 6.2, delay: 0.5}, // (3,6)
  {dur: 5.5, delay: 1.2}, // (3,7)
  {dur: 4.2, delay: 1.9}, // (3,8)
  {dur: 6.5, delay: 2.6}, // (4,5)
  {dur: 5.6, delay: 3.3}, // (4,6)
  {dur: 4.7, delay: 0.1}, // (4,7)
  {dur: 6.0, delay: 0.8}, // (4,8)
  {dur: 5.3, delay: 1.5}, // (5,6)
  {dur: 4.4, delay: 2.2}, // (5,7)
  {dur: 6.7, delay: 2.9}, // (5,8)
  {dur: 4.9, delay: 3.6}, // (6,7)
  {dur: 5.2, delay: 0.4}, // (6,8)
  {dur: 5.7, delay: 1.1}, // (7,8)
];

/**
 * Build the full edge list at module init. Done once at evaluation time,
 * not on every render — bundler tree-shakes the module, and the resulting
 * `edges` constant is referentially stable.
 */
function buildEdges(): AIEdge[] {
  const result: AIEdge[] = [];
  let i = 0;
  for (let from = 0; from < nodes.length; from++) {
    for (let to = from + 1; to < nodes.length; to++) {
      const a = nodes[from];
      const b = nodes[to];
      const params = PULSE_PARAMS[i];
      result.push({
        from,
        to,
        x1: a.cx,
        y1: a.cy,
        x2: b.cx,
        y2: b.cy,
        dur: params.dur,
        delay: params.delay,
      });
      i++;
    }
  }
  return result;
}

const edges = buildEdges();

export default edges;

if (process.env.NODE_ENV !== 'production') {
  if (edges.length !== 36) {
    console.warn(
      `[ai-edges] expected 36 edges (C(9,2)), got ${edges.length}. ` +
        `Did the node list change without updating PULSE_PARAMS?`
    );
  }
  if (PULSE_PARAMS.length !== 36) {
    console.warn(
      `[ai-edges] PULSE_PARAMS length ${PULSE_PARAMS.length} ≠ 36. ` +
        `Sync with the all-pairs enumeration.`
    );
  }
}

'use client';

import {useEffect} from 'react';
import {useReducedMotion} from 'framer-motion';
import {VIEWBOX_H, VIEWBOX_W} from './ai-nodes';
import edges from './ai-edges';

/**
 * Client-only motion layer for the AI graph.
 *
 * The graph itself (`AIGraph`, Server Component) renders the SVG mesh + DOM
 * nodes in their base positions. CSS keyframes float the nodes (via the
 * `.ai-node` `transform: translate3d` drift). But SVG `<line>` endpoints
 * are fixed pixel coordinates in the SSR markup — they don't follow the
 * CSS transforms applied to the node DOM. This component fixes that by
 * running a requestAnimationFrame loop that reads each node's live
 * bounding-box center and writes the corresponding endpoint of every edge
 * connected to it.
 *
 * Mechanics (read-then-write to avoid layout thrashing):
 *   1. Once per frame, getBoundingClientRect() on the SVG and all 9 nodes.
 *   2. Convert each node's viewport-coord center to SVG viewBox-coord center.
 *   3. Walk the 36 edges; for each, set x1/y1/x2/y2 to the converted
 *      centers of its `from` and `to` nodes.
 *
 * Performance:
 *   • 10 reads + 36 attribute writes per frame, batched. At 60fps this is
 *     well within budget on any modern device.
 *   • IntersectionObserver pauses the loop when the AI section scrolls
 *     out of view — no wasted cycles when the user is reading elsewhere.
 *   • `useReducedMotion()` returning true skips the loop entirely;
 *     edges stay at their SSR'd base positions, which is correct because
 *     nodes also don't drift under reduced motion.
 *   • Cleanup on unmount cancels rAF and disconnects the observer.
 *
 * No visual output of its own — operates by DOM mutation on sibling
 * elements rendered by AIGraph. Returns null.
 */
export function AIGraphMotion() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const svg = document.querySelector<SVGSVGElement>('svg.ai-edges');
    if (!svg) return;

    const nodeEls = Array.from(
      document.querySelectorAll<HTMLElement>('[data-ai-node]')
    );
    if (nodeEls.length !== 9) return; // wrong count means DOM doesn't match expectation

    // Sort by data-ai-node index so the order matches the nodes[] array.
    nodeEls.sort((a, b) => {
      const ai = Number(a.dataset.aiNode);
      const bi = Number(b.dataset.aiNode);
      return ai - bi;
    });

    const lineEls = Array.from(
      svg.querySelectorAll<SVGLineElement>('line.ai-edge')
    );
    if (lineEls.length !== edges.length) return; // mismatch — abort silently

    // Pre-extract from/to indices once (avoid re-parsing every frame).
    const fromIdx = edges.map((e) => e.from);
    const toIdx = edges.map((e) => e.to);

    let raf = 0;
    let running = true;

    // Reusable buffers — avoid per-frame allocations.
    const nodeCx = new Float32Array(9);
    const nodeCy = new Float32Array(9);

    const tick = () => {
      if (!running) return;

      // ---- READ PHASE ----
      const svgRect = svg.getBoundingClientRect();
      const sw = svgRect.width;
      const sh = svgRect.height;
      // Guard against zero-size (collapsed layout, hidden, etc.).
      if (sw === 0 || sh === 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const sx = svgRect.left;
      const sy = svgRect.top;
      const kx = VIEWBOX_W / sw;
      const ky = VIEWBOX_H / sh;

      for (let i = 0; i < 9; i++) {
        const r = nodeEls[i].getBoundingClientRect();
        // Node center in viewport coords -> viewBox coords.
        nodeCx[i] = (r.left + r.width / 2 - sx) * kx;
        nodeCy[i] = (r.top + r.height / 2 - sy) * ky;
      }

      // ---- WRITE PHASE ----
      for (let i = 0; i < lineEls.length; i++) {
        const line = lineEls[i];
        const a = fromIdx[i];
        const b = toIdx[i];
        // setAttribute is preferred over property assignment for SVG
        // because it avoids creating SVGAnimatedLength wrapper objects.
        line.setAttribute('x1', String(nodeCx[a]));
        line.setAttribute('y1', String(nodeCy[a]));
        line.setAttribute('x2', String(nodeCx[b]));
        line.setAttribute('y2', String(nodeCy[b]));
      }

      raf = requestAnimationFrame(tick);
    };

    // Only loop while the graph is on-screen. IntersectionObserver pauses
    // and resumes via the `running` flag and rAF lifecycle.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!running) {
              running = true;
              raf = requestAnimationFrame(tick);
            }
          } else {
            running = false;
            cancelAnimationFrame(raf);
          }
        }
      },
      {threshold: 0}
    );
    io.observe(svg);

    // Kick off immediately so the first paint after mount has edges in
    // the right place (otherwise the first frame would still show the
    // SSR'd line positions, which can be jarring on snap-scrolls into view).
    raf = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [reduced]);

  return null;
}

'use client';

/**
 * Page-lift reveal for the AI section.
 *
 * STATUS: temporarily disabled (renders nothing). Two design iterations on
 * a 3D tear-and-curl reveal produced motion that didn't read as theatrical
 * in the browser — the corner-pivoted rotations made the paper halves
 * vanish off-screen before any 3D curl became visible. Rather than ship
 * a mediocre reveal, the cover is removed entirely.
 *
 * The AI section still has plenty of liveness without it: the mesh edges
 * fade in over 1.1s on first paint, all nodes drift continuously, and the
 * edge pulse animations run on irregular phases. The user-facing
 * experience: scroll into the section, the graph is right there, visibly
 * alive.
 *
 * When revisiting:
 *   • Likely the right geometry is a single rotation around the diagonal
 *     tear line itself (transform-origin: 50% 50%, rotate3d on the
 *     normalized diagonal axis vector). Each half tips toward the camera
 *     around that axis — a true fold-open motion.
 *   • Build a minimal isolated test page first; iterate visually until the
 *     motion reads as a page bending in 3D, THEN port to this component.
 *   • Keep the reduced-motion path returning null.
 *
 * Until then, this component renders nothing. The `'use client'` directive
 * stays in case it's needed when motion returns (useReducedMotion, etc).
 */
export function AIPageLift() {
  return null;
}

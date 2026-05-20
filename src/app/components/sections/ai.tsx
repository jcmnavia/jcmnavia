import {AIGraph} from '@/app/components/ai/ai-graph';
import {AIGraphMotion} from '@/app/components/ai/ai-graph-motion';
import {AIPageLift} from '@/app/components/ai/ai-page-lift';
import {SectionHeading} from '@/app/components/primitives/section-heading';

/**
 * AI section — "AI-native engineer" identity statement.
 *
 * 2-column composition on desktop:
 *   • LEFT (2fr): kicker + headline + sub copy.
 *   • RIGHT (3fr): the living graph (AIGraph) — 9 nodes, 36 mesh edges,
 *     continuous subtle motion.
 *
 * Mobile (<md): graph first, copy second (single column).
 *
 * On scroll-in, a paper sheet (AIPageLift) covers the section and lifts
 * off over 1.2s, revealing the graph underneath. Once the lift completes,
 * the graph's edges fade in and the node breath begins — orchestrated via
 * CSS animation-delay (see globals.css), not React state.
 *
 * AIPageLift is a client component (uses useInView + useReducedMotion).
 * AIGraph is a pure Server Component — all "random" values are hardcoded
 * in ai-nodes.ts / ai-edges.ts so the SSR'd graph is byte-stable.
 * AIGraphMotion is a tiny client island that runs an rAF loop reading the
 * 9 nodes' bounding-box centers and writing the 36 edge endpoints each
 * frame, so edges visually track the CSS-drifting nodes. Renders no DOM
 * of its own. This file itself is a Server Component — Next composes the
 * client islands inside it transparently.
 *
 * Reduced motion path:
 *   • AIPageLift renders null (no cover, no flash).
 *   • Edges render at static opacity 0.18, stroke 1px (CSS overrides).
 *   • Nodes render at base positions (no drift).
 *   • Layout is identical to non-reduced.
 */
export function AI() {
  return (
    <section
      id='ai'
      className='relative mx-auto max-w-6xl overflow-hidden px-6 py-[clamp(5rem,12vh,9rem)]'
    >
      <AIPageLift />

      <div className='grid items-center gap-12 md:grid-cols-[2fr_3fr]'>
        {/* LEFT — copy */}
        <div className='order-2 md:order-1'>
          <SectionHeading kicker='// 1.5 yrs building AI agents'>
            AI is <em>how</em> I build now.
          </SectionHeading>
          <p className='mt-6 max-w-[44ch] font-body text-muted-foreground'>
            Production agents, RAG and evals across OpenAI &amp; Anthropic
            stacks. Shipped with Claude SDK, LangChain, LangGraph, Langfuse.
          </p>
        </div>

        {/* RIGHT — living graph */}
        <div className='order-1 md:order-2'>
          <AIGraph />
          {/* Client-only rAF loop that keeps edge endpoints tracking the
              CSS-drifting node positions every frame. Renders no DOM of
              its own; reads sibling node bboxes, writes <line> attrs. */}
          <AIGraphMotion />
        </div>
      </div>
    </section>
  );
}


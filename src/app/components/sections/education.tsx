import education from '@/app/content/education';
import {profile} from '@/app/content/profile';
import {SectionHeading} from '@/app/components/primitives/section-heading';
import {Reveal} from '@/app/components/motion/reveal';

const ROTATIONS = [-2.5, 1.5, -1, 2];

export function Education() {
  return (
    <section
      id='education'
      className='mx-auto max-w-6xl px-6 py-[clamp(5rem,12vh,9rem)]'
    >
      <SectionHeading kicker={`// ${profile.title}`}>
        This is not just <em>some paper.</em>
      </SectionHeading>

      <div className='mt-16 grid gap-8 sm:grid-cols-2'>
        {education.map((e, i) => (
          <Reveal key={`${e.title}-${i}`} delay={(i % 2) * 0.08}>
            <div
              className='relative h-full rounded-md border border-border bg-card p-7 shadow-sm'
              style={{transform: `rotate(${ROTATIONS[i % ROTATIONS.length]}deg)`}}
            >
              {e.gpa && (
                <div
                  className='absolute -right-4 -top-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-center font-mono text-xs font-bold leading-tight text-accent-foreground shadow-md'
                  style={{transform: 'rotate(-12deg)'}}
                >
                  GPA
                  <br />
                  {e.gpa}
                </div>
              )}
              <h3 className='whitespace-pre-line font-display text-2xl font-extrabold leading-[0.95] tracking-[-0.02em]'>
                {e.title}
              </h3>
              <p className='mt-3 font-body text-foreground'>{e.university}</p>
              <p className='mt-1 font-mono text-sm text-muted-foreground'>
                {e.place}
              </p>
              <p className='mt-4 font-mono text-xs uppercase tracking-[0.06em] text-accent'>
                {e.dates}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

import Image from 'next/image';
import jobs from '@/app/content/jobs';
import {profile} from '@/app/content/profile';
import {SectionHeading} from '@/app/components/primitives/section-heading';
import {TapeLabel} from '@/app/components/primitives/tape-label';
import {ScrawlText} from '@/app/components/primitives/scrawl-text';
import {Reveal} from '@/app/components/motion/reveal';
import {cn} from '@/app/lib/cn';

function bullets(description: string) {
  return description
    .split(/[\r\n]+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function Work() {
  return (
    <section
      id='work'
      className='mx-auto max-w-6xl px-6 py-[clamp(5rem,12vh,9rem)]'
    >
      <SectionHeading kicker={`// ${profile.title}`}>
        I don&apos;t just <em>work.</em>
      </SectionHeading>

      <p className='mt-5 font-body text-muted-foreground'>
        Also available as a one-pager:{' '}
        <a href={profile.cvPath} download className='underline'>
          <ScrawlText rotate={-1}>grab the CV ↓</ScrawlText>
        </a>
      </p>

      <div className='mt-16 flex flex-col gap-20'>
        {jobs.map((job, i) => {
          const flip = i % 2 === 1;
          return (
            <Reveal key={`${job.place}-${i}`} delay={(i % 2) * 0.08}>
              <article
                className={cn(
                  'flex flex-col gap-6 md:flex-row md:items-start md:gap-12',
                  flip && 'md:flex-row-reverse'
                )}
              >
                <div className='md:w-1/3'>
                  <div
                    className='inline-block rounded-md border border-border bg-card p-5 shadow-sm'
                    style={{transform: `rotate(${flip ? 2 : -2}deg)`}}
                  >
                    <Image
                      src={job.image}
                      alt={`${job.place} logo`}
                      width={120}
                      height={120}
                      className='h-20 w-auto object-contain'
                    />
                  </div>
                </div>

                <div className='md:w-2/3'>
                  <TapeLabel tone='pine' rotate={flip ? 3 : -3}>
                    {job.dates}
                  </TapeLabel>
                  <h3 className='mt-4 font-display text-[clamp(1.5rem,3vw,2.25rem)] font-extrabold leading-[0.95] tracking-[-0.02em]'>
                    {job.place}
                  </h3>
                  <p className='mt-1 font-mono text-sm font-bold text-accent'>
                    {job.title}
                  </p>
                  <ul className='mt-4 flex flex-col gap-2 font-body text-muted-foreground'>
                    {bullets(job.description).map((line, b) => (
                      <li key={b}>{line}</li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

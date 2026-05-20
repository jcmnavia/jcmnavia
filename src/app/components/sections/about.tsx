import Image from 'next/image';
import {profile} from '@/app/content/profile';
import {SectionHeading} from '@/app/components/primitives/section-heading';
import {ScrawlText} from '@/app/components/primitives/scrawl-text';
import {Reveal} from '@/app/components/motion/reveal';

export function About() {
  return (
    <section
      id='about'
      className='mx-auto max-w-6xl px-6 py-[clamp(5rem,12vh,9rem)]'
    >
      <SectionHeading kicker={`// ${profile.title}`}>
        Yep! This is <em>me</em> 😎
      </SectionHeading>

      <div className='mt-14 grid gap-12 md:grid-cols-[1fr_auto] md:items-start'>
        <div className='max-w-[68ch] space-y-5 font-body text-base leading-relaxed text-foreground/85'>
          <p>
            I am a person always interested in learning and improving myself in
            every way. I&apos;m passionate in what I do and always give my best
            no matter what.
          </p>
          <p>
            I&apos;ve been always into computers and stuff (oh, I did... explore
            into some computers - Yes, I broke them 😅). I really believe in
            self-taught learning, that&apos;s why even since I started the
            university, I took the knowledge to the next level and put into real
            world situations, getting that extra experience that gave me a
            boost. Now I&apos;m proud to say that I&apos;ve become a great
            developer, I&apos;ve so much to offer and still so much to learn. My
            journey started at 17th years-old and I don&apos;t expect it to end
            soon, on the contrary, here I am looking for challenges!
          </p>
          <p>
            I also love reading books -- don&apos;t tell me you don&apos;t like
            Harry Potter 🫣, I love practicing tennis 🎾, I&apos;m a photographer
            when I have the chance 📸 and... yeah, I think that&apos;s it. Ah, I
            also like to paint 🎨.
          </p>
          <p className='pt-2'>
            <ScrawlText rotate={-1}>
              Feel free to reach out — coffee, tennis, or that amazing idea
              you have. Anything, really!
            </ScrawlText>
          </p>
        </div>

        <Reveal>
          <div
            className='rounded-md border border-border bg-card p-3 shadow-md'
            style={{transform: 'rotate(3deg)'}}
          >
            <Image
              src='/images/me.jpg'
              alt='Juan Camilo, smiling'
              width={300}
              height={360}
              className='h-auto w-[240px] object-cover'
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

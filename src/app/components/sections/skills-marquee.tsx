import skills from '@/app/content/skills';
import {profile} from '@/app/content/profile';
import {SectionHeading} from '@/app/components/primitives/section-heading';
import {MarqueeRow} from '@/app/components/primitives/marquee-row';
import {SkillIcon} from '@/app/components/primitives/skill-icon';

export function SkillsMarquee() {
  const mid = Math.ceil(skills.length / 2);
  const rowA = skills.slice(0, mid);
  const rowB = skills.slice(mid);

  return (
    <section
      id='skills'
      className='overflow-hidden py-[clamp(5rem,12vh,9rem)]'
    >
      <div className='mx-auto mb-14 max-w-6xl px-6'>
        <SectionHeading kicker={`// ${profile.title}`}>
          What I&apos;ve <em>mastered.</em>
        </SectionHeading>
      </div>

      <div className='flex flex-col gap-8'>
        <MarqueeRow direction='rtl' durationSeconds={42}>
          {rowA.map((s) => (
            <SkillIcon key={s.label} skill={s} />
          ))}
        </MarqueeRow>
        <MarqueeRow direction='ltr' durationSeconds={52}>
          {rowB.map((s) => (
            <SkillIcon key={s.label} skill={s} />
          ))}
        </MarqueeRow>
      </div>
    </section>
  );
}

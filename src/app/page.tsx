import {Nav} from '@/app/components/sections/nav';
import {Header} from '@/app/components/sections/header';
import {Work} from '@/app/components/sections/work';
import {SkillsMarquee} from '@/app/components/sections/skills-marquee';
import {Education} from '@/app/components/sections/education';
import {About} from '@/app/components/sections/about';
import {Footer} from '@/app/components/sections/footer';

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Header />
        <Work />
        <SkillsMarquee />
        <Education />
        <About />
      </main>
      <Footer />
    </>
  );
}

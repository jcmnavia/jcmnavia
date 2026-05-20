export type Job = {
  title: string;
  description: string;
  place: string;
  dates: string;
  /** Path under /public to the company logo, or null to render a typeset card. */
  image: string | null;
};

const jobs: Job[] = [
  {
    title: 'Software Engineer',
    description: `▪ Lead development of core features for a WhatsApp-first customer engagement product with CRM integrations, improving reliability and user experience, focused strongly on adoption and retention.
\r▪ Enhanced CRM syncs and message workflows by implementing caching and robust error handling, reducing integration failures and production incidents.
\r▪ Partner with product/design to ship features quickly while preserving quality through code reviews, automated tests, and architecture alignment.`,
    place: 'Treble.ai',
    dates: 'January 2025 – Present',
    image: '/logos/treble.png',
  },
  {
    title: 'Senior Full Stack Developer',
    description: `▪ Owned end-to-end delivery of high-impact front-end features on a workforce analytics platform using React, with collaborative backend enhancements in Django.
\r▪ Introduced structured planning, estimations, retrospectives, and technical standards to improve team predictability.
\r▪ Built and maintained UI components in Storybook, improving consistency and speeding feature development.
\r▪ Worked closely with backend engineers to ensure performance and resilience of shared services.`,
    place: 'Headcount365',
    dates: 'March 2023 – December 2024',
    image: '/logos/headcount365.png',
  },
  {
    title: 'Mid Senior Full Stack Developer',
    description: `▪ Delivered React Native applications with maps and in-app purchase flows deployed to iOS/Android.
\r▪ Built backend APIs in Nest.js and maintained front-end React features across web projects.
\r▪ Increased code reuse and UI consistency by adopting component-oriented development practices.`,
    place: 'Red Valley S.A.S',
    dates: 'February 2022 – July 2023',
    image: '/logos/redvalley.png',
  },
  {
    title: 'Mid Senior Front-end Developer',
    description: `▪ Built a design-system-ready UI component library using Rollup and emotion for a complex internal SSR application.
\r▪ Implemented responsive, accessible UI components consumed across multiple product pages.`,
    place: 'Huge Inc',
    dates: 'August 2021 – February 2022',
    image: '/logos/huge.png',
  },
  {
    title: 'Junior Full Stack Developer',
    description: `▪ Implemented server-side APIs with Nest.js (Fastify & Express) and delivered multiple React applications.
\r▪ Created SEO optimized landing pages using Gatsby, improving organic traffic and lead generation.
\r▪ Deployed services to AWS with Terraform, Docker, and CI workflows.`,
    place: 'Red Valley S.A.S',
    dates: 'May 2020 – August 2021',
    image: '/logos/redvalley.png',
  },
  {
    title: 'Junior Full Stack Developer',
    description: `▪ Built front-end with Ionic + Angular and integrated with Django REST APIs.
\r▪ Developed a React/GraphQL web app for payment projection and reporting, containerized with Docker.`,
    place: 'Freelance Roles',
    dates: 'May 2018 – May 2020',
    image: null,
  },
];

export default jobs;

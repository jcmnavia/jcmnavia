export type Job = {
  title: string;
  description: string;
  place: string;
  dates: string;
  image: string;
};

const jobs: Job[] = [
  {
    title: 'Full Stack Developer - Freelance',
    description: `▪ Developed a web application that made payment projections for clients and generate different reports.
      \r▪ The stack used was React.js with Bootstrap and Node.js with GraphQL. Deployments of the app were made with docker to a custom server.
      \r▪ This application has helped to speed up processes, since there are several brances, they needed to centralize their data. Current amount of users: 20`,
    place: 'Lar Proyectos S.A.S',
    dates: 'December 2018 - April 2020',
    image: '/logos/lar.png',
  },
  {
    title: 'Full Stack Developer - Freelance',
    description: `▪ Developed the Front-End side of a mobile application, achieving the design proposed to the last minimun detail.
      \r▪ The framework used was Ionic 5 with Angular JS.
      \r▪ Handled API connection with a Django application and modified backend when necessary`,
    place: 'Zaito S.A.S',
    dates: 'April 2020 - May 2020',
    image: '/logos/zaito.png',
  },
  {
    title: 'Junior Full Stack Developer',
    description: `▪ Developed backend's applications with Nest.js using Fastify and express middleware’s. 
      \r▪ Developed 6 frontend applications with React using frameworks such as redux, bootstrap and BEM convention.
      \r▪ Developed 18 landing pages using Gatsby.js optimized for SEO.
      \r▪ Deployed applications/containers in AWS manually and Terraform.`,
    place: 'Red Valley S.A.S',
    dates: 'May 2020 -  August 2021',
    image: '/logos/redvalley.png',
  },
  {
    title: 'Mid Senior Front-end Developer',
    description: `▪ Developed a Front-end library with Rollup.js, made custom components to be used in a custom configured SSR application.
      \r▪ The Frameworks used were react alongside emotion.js for styling`,
    place: 'Huge Inc',
    dates: 'August 2021 - February 2022',
    image: '/logos/huge.png',
  },
  {
    title: 'Mid Senior Full Stack Developer',
    description: `▪ Developed 2 complete React Native applicactions successfully published to the stores
    \r▪ Gave support in Web apps and Backend apps with React and Nestjs. 
    \r▪ Frameworks/libraries used: Expo, Redux, Styled-components, Maps, In-App-Purchases.`,
    place: 'Red Valley S.A.S',
    dates: 'February 2022 - Present',
    image: '/logos/redvalley.png',
  },
];

export default jobs;

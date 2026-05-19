export type Skill = {
  label: string;
  /** simple-icons export name (e.g. 'siReact'), or null to render a text tile */
  icon: string | null;
};

const skills: Skill[] = [
  // Programming Languages
  {label: 'JavaScript', icon: 'siJavascript'},
  {label: 'TypeScript', icon: 'siTypescript'},
  {label: 'Python', icon: 'siPython'},
  {label: 'SQL', icon: null},

  // Frontend
  {label: 'React', icon: 'siReact'},
  {label: 'Next.js', icon: 'siNextdotjs'},
  {label: 'Redux', icon: 'siRedux'},
  {label: 'Tailwind CSS', icon: 'siTailwindcss'},
  {label: 'Storybook', icon: 'siStorybook'},

  // Backend
  {label: 'Node.js', icon: 'siNodedotjs'},
  {label: 'Nest.js', icon: 'siNestjs'},
  {label: 'Express', icon: 'siExpress'},
  {label: 'Django', icon: 'siDjango'},
  {label: 'GraphQL', icon: 'siGraphql'},

  // Cloud & DevOps
  {label: 'AWS', icon: null},
  {label: 'Serverless', icon: 'siServerless'},
  {label: 'Docker', icon: 'siDocker'},
  {label: 'Terraform', icon: 'siTerraform'},
  {label: 'Bash', icon: 'siGnubash'},

  // Databases
  {label: 'PostgreSQL', icon: 'siPostgresql'},
  {label: 'MongoDB', icon: 'siMongodb'},

  // Tools
  {label: 'Git', icon: 'siGit'},
  {label: 'GitHub', icon: 'siGithub'},
  {label: 'Expo', icon: 'siExpo'},
  {label: 'Vercel', icon: 'siVercel'},

  // Integrations
  {label: 'WhatsApp', icon: 'siWhatsapp'},
  {label: 'HubSpot', icon: 'siHubspot'},
];

export default skills;

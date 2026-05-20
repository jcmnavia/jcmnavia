export type Skill = {
  label: string;
  /** simple-icons export name (e.g. 'siReact'), local extra-brand-icons
   *  key (e.g. 'openai'), or null to render a text tile. */
  icon: string | null;
  /** Optional outbound URL. When set on a node in the AI graph, the logo
   *  becomes a clickable anchor (target=_blank, noreferrer) with a
   *  tooltip showing the label. Unused by the general skills marquee. */
  href?: string;
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

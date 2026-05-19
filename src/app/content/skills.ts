export type Skill = {
  label: string;
  /** simple-icons export name (e.g. 'siReact'), or null to render a text tile */
  icon: string | null;
};

const skills: Skill[] = [
  {label: 'AWS', icon: null},
  {label: 'Bash', icon: 'siGnubash'},
  {label: 'Bootstrap', icon: 'siBootstrap'},
  {label: 'Docker', icon: 'siDocker'},
  {label: 'Express', icon: 'siExpress'},
  {label: 'Gatsby', icon: 'siGatsby'},
  {label: 'Git', icon: 'siGit'},
  {label: 'GitHub', icon: 'siGithub'},
  {label: 'GraphQL', icon: 'siGraphql'},
  {label: 'Heroku', icon: null},
  {label: 'HTML5', icon: 'siHtml5'},
  {label: 'Jest', icon: 'siJest'},
  {label: 'JavaScript', icon: 'siJavascript'},
  {label: 'Laravel', icon: 'siLaravel'},
  {label: 'Node.js', icon: 'siNodedotjs'},
  {label: 'PHP', icon: 'siPhp'},
  {label: 'PostgreSQL', icon: 'siPostgresql'},
  {label: 'React', icon: 'siReact'},
  {label: 'Redux', icon: 'siRedux'},
  {label: 'Sass', icon: 'siSass'},
  {label: 'SQL', icon: null},
  {label: 'Terraform', icon: 'siTerraform'},
  {label: 'TypeScript', icon: 'siTypescript'},
  {label: 'VS Code', icon: null},
  {label: 'WordPress', icon: 'siWordpress'},
];

export default skills;

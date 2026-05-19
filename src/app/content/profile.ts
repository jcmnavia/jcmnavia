export const profile = {
  name: 'Juan Camilo Marín Navia',
  title: 'Full Stack JS Engineer',
  tagline: 'I make things happen',
  yearsShipping: 7,
  cvPath: '/files/Juan Camilo MARIN NAVIA CV.pdf',
  email: 'jcmnavia@hotmail.com',
  phones: [
    {label: '+57 (300) 345-3662', href: 'tel:+573003453662'},
    {label: '+1 (754) 248-8834', href: 'tel:+17542488834'},
  ],
  socials: [
    {name: 'GitHub', href: 'https://github.com/jcamilomnavia', slug: 'github'},
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/juan-camilo-marin-navia/',
      slug: 'linkedin',
    },
    {name: 'GitLab', href: 'https://gitlab.com/jcmnavia', slug: 'gitlab'},
    {
      name: 'Discord',
      href: 'https://discord.com/users/jcmnavia#0162',
      slug: 'discord',
    },
    {
      name: 'Goodreads',
      href: 'https://www.goodreads.com/user/show/137777093-juan-camilo-marin-navia',
      slug: 'goodreads',
    },
    {name: 'Twitter', href: 'https://twitter.com/jcmn99', slug: 'x'},
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/jcmnavia',
      slug: 'instagram',
    },
  ],
} as const;

export type Profile = typeof profile;

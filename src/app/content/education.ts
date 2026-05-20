export type Education = {
  title: string;
  university: string;
  place: string;
  dates: string;
  gpa?: string;
};

const education: Education[] = [
  {
    title: 'Sofware Engineer',
    university: 'EAFIT University',
    place: 'Medellin, Colombia',
    dates: '2017-2022',
    gpa: '4.1',
  },
  {
    title: 'Java tutor',
    university: 'EAFIT University',
    place: 'Medellin, Colombia',
    dates: 'Jan 2019 - May 2019',
  },
  {
    title: 'Black Belt Certificacion',
    university: 'DEV.F',
    place: 'Medellin, Colombia',
    dates: '2019',
  },
  {
    title: 'Sofware Engineer\nExchange Program',
    university: 'La Salle Ramon Lull University',
    place: 'Barcelona, Spain',
    dates: 'Aug 2019 - Jan 2020',
    gpa: '4.5',
  },
];

export default education;

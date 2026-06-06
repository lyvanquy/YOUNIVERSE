import { CharmProduct, TeamMember, ValueCard } from './types';

export const CHARM_PRODUCTS: CharmProduct[] = [
  {
    id: 'astra',
    name: 'Charm Astra',
    badge: 'Unique',
    tagline: 'Own your unique name, ignite your inner flame.',
    description: 'A bold statement of identity, customized with your name, celestial symbols, and your unique elemental energy.',
    extendedDesc: 'A personalized visual signature or initial charm set in a unique cosmic crystal lattice, carrying the confident, distinct energy of your celestial sign.',
    color: '#3b82f6', // blue
    brandColor: 'blue',
    iconName: 'Sparkles',
  },
  {
    id: 'sirius',
    name: 'Charm Sirius',
    badge: 'Passion',
    tagline: 'Pack the joy you seek, let your passion speak.',
    description: 'Encapsulate the little things you love, from simple everyday passions and sweet pets to your daily rituals.',
    extendedDesc: 'A lucky charm representing the tiny joys of daily routine, loyal companions, or beloved habits that ignite vibrant emotions and bright passion.',
    color: '#eab308', // yellow
    brandColor: 'yellow',
    iconName: 'Heart',
  },
  {
    id: 'polaris',
    name: 'Charm Polaris',
    badge: 'Inspiring',
    tagline: 'Trust the guiding quote, let your spirit float.',
    description: 'Inspiring quotes that serve as a guiding compass for your soul.',
    extendedDesc: 'An engraving of inspiring mantras, acting as a guiding compass for your soul to support your identity across the infinite cosmos.',
    color: '#ef4444', // red
    brandColor: 'red',
    iconName: 'Compass',
  }
];

export const CORE_VALUES: ValueCard[] = [
  {
    letter: 'Y',
    title: 'You-nique',
    subtitle: 'Unique Identity',
    vietnameseTitle: 'Celebrate your unique identity.',
    description: 'Your universe is one-of-a-kind, never to be copied or cloned by anyone else.'
  },
  {
    letter: 'O',
    title: 'Out-of-the-box',
    subtitle: 'Creative Thinking',
    vietnameseTitle: 'Dare to customize, dare to be crazy.',
    description: 'Challenging every boilerplate boundary, giving you absolute freedom to style and shape your own path.'
  },
  {
    letter: 'U',
    title: 'Unconditional connection',
    subtitle: 'Infinite Bonding',
    vietnameseTitle: 'Harmonize your individual self with the world.',
    description: 'Visualizing deep spiritual connections through tiny, whimsical stories detailed on each exquisite charm.'
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Ms. Nguyen Linh Chi',
    phone: '0335173280',
    role: 'Project Leader'
  },
  {
    name: 'Mr. Tran Hai Dang',
    phone: '0795722279',
    role: 'Lead of Digital Media & Website'
  },
  {
    name: 'Ms. Quach Kha Thi',
    phone: '0858062402',
    role: 'Lead of Market Research & Insights'
  },
  {
    name: 'Ms. Nguyen Ly An Nhien',
    phone: '0334230606',
    role: 'Lead of Operations'
  },
  {
    name: 'Ms. Nguyen Do Nhu Ha',
    phone: '0943484784',
    role: 'Lead of Research & Development'
  },
  {
    name: 'Ms. Le Nu Dan Vy',
    phone: '0914575205',
    role: 'Lead of Sales'
  },
  {
    name: 'Ms. Duong Ngoc Phuong Nghi',
    phone: '0346229446',
    role: 'Production Manager'
  },
  {
    name: 'Ms. Tran Ngoc Thu',
    phone: '0913450445',
    role: 'Lead of Public Relations'
  }
];

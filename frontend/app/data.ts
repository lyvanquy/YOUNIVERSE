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
    price: 129000,
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
    price: 119000,
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
    price: 139000,
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
    nameVi: 'Nguyễn Linh Chi',
    phone: '0335173280',
    role: 'Project Leader',
    image: '/images/team-chi.jpg',
  },
  {
    name: 'Mr. Tran Hai Dang',
    nameVi: 'Trần Hải Đăng',
    phone: '0795722279',
    role: 'Lead of Digital Media & Website',
    image: '/images/team-dang.jpg',
  },
  {
    name: 'Ms. Quach Kha Thi',
    nameVi: 'Quách Khả Thi',
    phone: '0858062402',
    role: 'Lead of Market Research & Insights',
    image: '/images/team-thi.jpg',
  },
  {
    name: 'Ms. Nguyen Ly An Nhien',
    nameVi: 'Nguyễn Lý An Nhiên',
    phone: '0334230606',
    role: 'Lead of Operations',
    image: '/images/team-nhien.jpg',
  },
  {
    name: 'Ms. Nguyen Do Nhu Ha',
    nameVi: 'Nguyễn Đỗ Như Hà',
    phone: '0943484784',
    role: 'Lead of Research & Development',
    image: '/images/team-ha.jpg',
  },
  {
    name: 'Ms. Le Nu Dan Vy',
    nameVi: 'Lê Nữ Đan Vy',
    phone: '0914575205',
    role: 'Lead of Sales',
    image: '/images/team-vy.jpg',
  },
  {
    name: 'Ms. Duong Ngoc Phuong Nghi',
    nameVi: 'Dương Ngọc Phương Nghi',
    phone: '0346229446',
    role: 'Lead of Production',
    image: '/images/team-nghi.jpg',
  },
  {
    name: 'Ms. Tran Ngoc Thu',
    nameVi: 'Trần Ngọc Thư',
    phone: '0913450445',
    role: 'Lead of Public Relations',
    image: '/images/team-thu.jpg',
  }
];

/* ─── Order Page Data ─── */

export type AstraSystemId = 'sun' | 'moon' | 'star';
export type SiriusCategoryId = 'pet' | 'drink';
export type SiriusCharmId = 'dog' | 'cat' | 'hamster' | 'boba' | 'matcha' | 'coffee';
export type PolarisTabId = 'preset' | 'custom' | 'swap';

export interface AstraSystem {
  id: AstraSystemId;
  emoji: string;
  nameEn: string;
  nameVi: string;
  descEn: string;
  descVi: string;
  image: string;
}

export interface SiriusCharm {
  id: SiriusCharmId;
  category: SiriusCategoryId;
  emoji: string;
  nameEn: string;
  nameVi: string;
  image: string;
}

export interface PolarisQuote {
  id: string;
  textEn: string;
  textVi: string;
}

export const ASTRA_SYSTEMS: AstraSystem[] = [
  {
    id: 'sun',
    emoji: '☀️',
    nameEn: 'The Sun',
    nameVi: 'Hệ Mặt Trời',
    descEn: 'For energetic souls, full of passion and always shining brightly.',
    descVi: 'Dành cho những tâm hồn năng động, tràn đầy nhiệt huyết và luôn tỏa sáng rực rỡ.',
    image: '/images/system-sun.png',
  },
  {
    id: 'moon',
    emoji: '🌙',
    nameEn: 'The Moon',
    nameVi: 'Hệ Mặt Trăng',
    descEn: 'A sanctuary of calmness, depth, mystery and keen intuition.',
    descVi: 'Nơi trú ngụ của sự điềm tĩnh, sâu sắc, một chút bí ẩn và trực giác nhạy bén.',
    image: '/images/system-moon.png',
  },
  {
    id: 'star',
    emoji: '⭐',
    nameEn: 'The Star',
    nameVi: 'Hệ Tinh Tú',
    descEn: 'Symbol of dreams, freedom, romance and the pursuit of wonder.',
    descVi: 'Biểu tượng của những ước mơ, sự tự do, lãng mạn và luôn tìm kiếm điều kỳ diệu.',
    image: '/images/system-star.png',
  },
];

export const SIRIUS_CHARMS: SiriusCharm[] = [
  { id: 'dog', category: 'pet', emoji: '🐕', nameEn: 'Dog', nameVi: 'Chó', image: '/images/sirius-dog.png' },
  { id: 'cat', category: 'pet', emoji: '🐈', nameEn: 'Cat', nameVi: 'Mèo', image: '/images/sirius-cat.png' },
  { id: 'hamster', category: 'pet', emoji: '🐹', nameEn: 'Hamster', nameVi: 'Hamster', image: '/images/sirius-hamster.png' },
  { id: 'boba', category: 'drink', emoji: '🧋', nameEn: 'Bubble Tea', nameVi: 'Trà sữa', image: '/images/sirius-boba.png' },
  { id: 'matcha', category: 'drink', emoji: '🍵', nameEn: 'Matcha Latte', nameVi: 'Matcha Latte', image: '/images/sirius-matcha.png' },
  { id: 'coffee', category: 'drink', emoji: '☕', nameEn: 'Coffee', nameVi: 'Cà phê', image: '/images/sirius-coffee.png' },
];

export const POLARIS_QUOTES: PolarisQuote[] = [
  { id: 'q1', textEn: "I'm pretty, your fault", textVi: 'Tôi xinh, Lỗi bạn' },
  { id: 'q2', textEn: 'Classy & Picky', textVi: 'Sang và Khó tính' },
  { id: 'q3', textEn: 'Sassy & Foodie', textVi: 'Kiêu và Ham ăn' },
  { id: 'q4', textEn: 'Goofy & Carefree', textVi: 'Hâm và Vô tư' },
  { id: 'q5', textEn: 'Gentle & Talented', textVi: 'Hiền và Nhiều tài' },
];

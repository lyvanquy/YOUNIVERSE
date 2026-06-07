export interface CharmProduct {
  id: string;
  name: string;
  badge: string;
  tagline: string;
  description: string;
  extendedDesc: string;
  color: string;
  brandColor: 'blue' | 'yellow' | 'red';
  iconName: string;
  price?: number;
}

export interface TeamMember {
  name: string;
  phone: string;
  role: string;
  image?: string;
}

export interface ValueCard {
  letter: 'Y' | 'O' | 'U';
  title: string;
  subtitle: string;
  vietnameseTitle: string;
  description: string;
}

export interface CustomJewelry {
  baseType: 'bracelet' | 'necklace' | 'cord';
  selectedCharms: string[];
  customName: string;
  vibeColor: string;
}

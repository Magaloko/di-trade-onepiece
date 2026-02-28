export type ProductType = 'leader' | 'character' | 'event' | 'stage';
export type ProductRarity = 'common' | 'uncommon' | 'rare' | 'super' | 'secret' | 'manga' | 'alternative';
export type FeaturedType = 'sale' | 'new' | 'rare' | 'promo';
export type TrendType = 'up' | 'down' | 'stable';

export interface Product {
  id: number;
  name: string;
  number: string;
  set: string;
  type: ProductType;
  rarity: ProductRarity;
  price: number;
  oldPrice: number;
  image: string;
  trend: TrendType;
  stats: {
    high: number;
    low: number;
    avg: number;
  };
  description: string;
  attributes: {
    power: number;
    color: string;
    cost: number;
  };
  featured?: boolean;
  featuredType?: FeaturedType;
  featuredOrder?: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;       // emoji
  earnedAt?: string;  // ISO date string; undefined = not yet earned
}

export interface CollectionState {
  owned: number[];
  wishlist: number[];
  cart: number[];
  achievements: Achievement[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isAdmin?: boolean;
}

export interface PriceHistory {
  date: string;
  price: number;
}

export interface FeaturedCard {
  product: Product;
  type: FeaturedType;
  badge: string;
}

export type SetTagStyle = 'primary' | 'gold' | 'muted' | 'white';

export interface SetTag {
  label: string;
  style: SetTagStyle;
}

export interface TcgSet {
  id: number;
  code: string;
  name: string;
  emoji: string;
  bgGradient: string;
  tags: SetTag[];
  description: string;
  cardCount: number;
  specialCount: number;
  specialLabel: string;
  boxPrice: number;
  inStock: boolean;
}

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

export interface CollectionState {
  owned: number[];
  wishlist: number[];
  cart: number[];
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

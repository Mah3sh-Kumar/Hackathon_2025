export interface Category {
  name: string;
  description: string;
  imageUrl: string;
}

export interface Wholesaler {
  name: string;
  imageUrl: string;
  rating: number;
  reviews: number;
  since: number;
  locations: string;
  tier: 'Premium Partner' | 'Verified';
  description: string;
  startingPrice: number;
  minOrder: number;
}
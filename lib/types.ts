export type ProductBadge = 'New' | 'Hot' | 'Sale' | '';

export type Product = {
  _id: string;
  name: string;
  slug: string;
  category: 'rings' | 'necklaces' | 'earrings' | 'bracelets' | 'anklets';
  price: number;
  oldPrice?: number;
  badge?: ProductBadge;
  rating: number;
  reviews?: number;
  imageUrl: string;
  description?: string;
  featured?: boolean;
  inStock?: boolean;
};

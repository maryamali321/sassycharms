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
  gallery?: string[];
  description?: string;
  featured?: boolean;
  stockQuantity: number;
};

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
};

export type OrderStatus = 'pending' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled';

export type OrderItem = {
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
};

export type Order = {
  orderNumber: string;
  status: OrderStatus;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  items: OrderItem[];
  couponCode?: string;
  discountAmount?: number;
  subtotal: number;
  total: number;
  createdAt: string;
};

export type ProductCategory = string;

export interface Product {
  id: string;
  slug: string;
  name: string;
  cat: ProductCategory;
  category?: ProductCategory;
  price: number;
  originalPrice?: number;
  photos: number;
  photoCount?: number;
  deliveryHours?: number;
  badge: string | null;
  badgeType: 'best' | 'cheap' | 'new' | null;
  isPopular?: boolean;
  isPromo?: boolean;
  sold: number;
  rating: number;
  reviews: number;
  reviewsCount?: number;
  imageKey: string;
  coverImage?: string;
  desc: string;
  description?: string;
  features?: string[];
  galleryImages: string[];
  gallery?: string[];
  tags?: string[];
}

export interface CategoryInfo {
  id: string;
  name: string;
  tag: string;
  desc: string;
  image: string;
  headline: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Testimonial {
  id: string;
  name: string;
  city: string;
  text: string;
  rating: number;
  avatar: string;
  productName: string;
}

export interface ToastMessage {
  id: string;
  text: string;
  type?: 'success' | 'info' | 'error';
  icon?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isAdmin: boolean;
  role?: 'ADMIN' | 'LEAD_USER';
  provider: 'google';
  createdAt: string;
}

export interface CustomerPhoto {
  id: string;
  name: string;
  size: number;
  dataUrl?: string;
  url?: string;
  uploadedAt: string;
}

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';

export interface CustomerOrder {
  id: string;
  code: string;
  name: string;
  email: string;
  whatsapp: string;
  items: { product: Product; quantity: number }[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: 'pix' | 'card';
  paymentStatus: PaymentStatus;
  pixId?: string;
  pixQrCode?: string;
  pixQrCodeBase64?: string;
  uploadedPhotos?: CustomerPhoto[];
  customerPhotos?: CustomerPhoto[];
  aiDeliveryLink?: string;
  aiDeliveryStatus?: 'pending' | 'delivered';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderReceipt {
  code: string;
  name: string;
  email: string;
  whatsapp?: string;
  items: { product: Product; quantity: number }[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: 'pix' | 'card';
  createdAt: string;
  pixId?: string;
  uploadedPhotosCount?: number;
}

import { Product } from '../types';
import { PRODUCTS as INITIAL_PRODUCTS } from '../data/products';

const PRODUCTS_STORAGE_KEY = 'mfia_catalog_products';
const ORDERS_STORAGE_KEY = 'mfia_customer_orders';

// Helper to normalize any product object into standard shape
export function normalizeProduct(p: Partial<Product> & { [key: string]: any }): Product {
  const cover =
    p.coverImage ||
    (Array.isArray(p.galleryImages) && p.galleryImages[0]) ||
    (Array.isArray(p.gallery) && p.gallery[0]) ||
    'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80';

  const gallery =
    Array.isArray(p.galleryImages) && p.galleryImages.length > 0
      ? p.galleryImages
      : Array.isArray(p.gallery) && p.gallery.length > 0
      ? p.gallery
      : [cover];

  const cat = (p.category || p.cat || 'Aniversário').toString().trim();
  const photosCount = Number(p.photoCount) || Number(p.photos) || 20;
  const desc = p.description || p.desc || '';

  return {
    id: p.id || `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    slug:
      p.slug ||
      (p.name ? p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `album-${Date.now()}`),
    name: p.name || 'Ensaio Digital IA',
    cat,
    category: cat,
    price: Number(p.price) || 29.9,
    originalPrice: Number(p.originalPrice) || (Number(p.price) ? Number(p.price) * 2 : 59.9),
    photos: photosCount,
    photoCount: photosCount,
    deliveryHours: Number(p.deliveryHours) || 12,
    badge: p.badge || undefined,
    badgeType: (p.badgeType as any) || (p.badge ? 'best' : undefined),
    isPopular: Boolean(p.isPopular),
    isPromo: p.isPromo !== undefined ? Boolean(p.isPromo) : true,
    sold: Number(p.sold) || Math.floor(Math.random() * 500) + 120,
    rating: Number(p.rating) || 4.9,
    reviews: Number(p.reviewsCount) || Number(p.reviews) || 48,
    reviewsCount: Number(p.reviewsCount) || Number(p.reviews) || 48,
    imageKey: p.imageKey || 'aniBlack',
    coverImage: cover,
    desc,
    description: desc,
    features:
      Array.isArray(p.features) && p.features.length > 0
        ? p.features
        : [
            'Fotografias em altíssima resolução 4K',
            'Download instantâneo no e-mail cadastrado',
            'Iluminação e pós-produção IA profissional',
          ],
    galleryImages: gallery,
    gallery: gallery,
    tags: Array.isArray(p.tags) && p.tags.length > 0 ? p.tags : [cat, 'Fotos', 'IA'],
  };
}

// Retrieve products stored in localStorage or fallback to default products
export function getLocalProducts(): Product[] {
  try {
    const raw = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(normalizeProduct);
      }
    }
  } catch (e) {
    console.warn('Failed to parse stored products:', e);
  }

  // If nothing in storage, seed with INITIAL_PRODUCTS
  const initial = INITIAL_PRODUCTS.map(normalizeProduct);
  saveLocalProducts(initial);
  return initial;
}

// Save products array to localStorage
export function saveLocalProducts(products: Product[]): void {
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  } catch (e) {
    console.error('Error saving products to localStorage:', e);
  }
}

// Product Manager with hybrid Server API + LocalStorage support
export const productManager = {
  // Fetch all products (tries API first, falls back to LocalStorage)
  async getAll(): Promise<Product[]> {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        if (data && data.success && Array.isArray(data.products) && data.products.length > 0) {
          const normalized = data.products.map(normalizeProduct);
          saveLocalProducts(normalized);
          return normalized;
        }
      }
    } catch (e) {
      // API call failed (e.g. running statically on Vercel)
    }

    return getLocalProducts();
  },

  // Save product (create or update)
  async saveProduct(productData: Partial<Product>, existingId?: string): Promise<Product> {
    const localList = getLocalProducts();
    const targetId = existingId || productData.id;
    let saved: Product;

    if (targetId) {
      // Update existing
      const index = localList.findIndex((p) => p.id === targetId);
      const existing = index !== -1 ? localList[index] : {};
      saved = normalizeProduct({
        ...existing,
        ...productData,
        id: targetId,
      });

      if (index !== -1) {
        localList[index] = saved;
      } else {
        localList.push(saved);
      }
    } else {
      // Create new
      saved = normalizeProduct(productData);
      localList.unshift(saved);
    }

    // Persist immediately in LocalStorage
    saveLocalProducts(localList);

    // Attempt to sync with backend server if available
    try {
      const url = targetId ? `/api/products/${targetId}` : '/api/products';
      const method = targetId ? 'PUT' : 'POST';
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saved),
      });
    } catch (e) {
      // Server sync error is non-blocking since client state is already saved
      console.warn('Backend sync failed, saved locally:', e);
    }

    return saved;
  },

  // Delete product
  async deleteProduct(id: string): Promise<boolean> {
    const localList = getLocalProducts();
    const updated = localList.filter((p) => p.id !== id);
    saveLocalProducts(updated);

    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Backend delete sync failed, deleted locally:', e);
    }

    return true;
  },

  // Duplicate product
  async duplicateProduct(prod: Product): Promise<Product> {
    const duplicateData: Partial<Product> = {
      ...prod,
      id: `album_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: `${prod.name} (Cópia)`,
      slug: `${prod.slug}-copia-${Date.now()}`,
    };

    return this.saveProduct(duplicateData);
  },

  // Toggle Promo
  async togglePromo(prod: Product): Promise<Product> {
    return this.saveProduct(
      {
        ...prod,
        isPromo: !prod.isPromo,
      },
      prod.id
    );
  },

  // Reset to original default products
  async resetToDefaults(): Promise<Product[]> {
    const defaults = INITIAL_PRODUCTS.map(normalizeProduct);
    saveLocalProducts(defaults);

    try {
      await fetch('/api/products/reset', { method: 'POST' });
    } catch (e) {
      console.warn('Backend reset sync failed:', e);
    }

    return defaults;
  },
};

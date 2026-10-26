import productsData from '@/data/products.json';
import { Product, Collection, CommerceAdapter } from './types';

const typedProducts = (productsData as unknown) as Product[];

export const COLLECTIONS: Collection[] = [
  {
    id: 'col-bags',
    handle: 'bags',
    title: 'Bags',
    description: 'Artisanal leather executive briefcases, travel duffels, and laptop backpacks designed for life’s grandest journeys.',
    image: '/assets/products/Cowhide Leather Duffle Bag.webp',
    productCount: typedProducts.filter(p => p.collectionHandles.includes('bags')).length,
  },
  {
    id: 'col-business-work-bags',
    handle: 'business-work-bags',
    title: 'Business & Work Bags',
    description: 'Sophisticated executive briefcases, backpacks, and laptop sleeves engineered for modern leaders.',
    image: '/assets/products/Black Leather Executive Briefcase.jpg',
    productCount: typedProducts.filter(p => p.collectionHandles.includes('business-work-bags')).length,
  },
  {
    id: 'col-wallets',
    handle: 'wallets',
    title: 'Wallets & Gift Sets',
    description: 'Ultra-slim pocket wallets and substantial long wallets with matching leather key loops.',
    image: '/assets/products/Ultra-Slim Red Leather Long Wallet & Keychain Gift Set.webp',
    productCount: typedProducts.filter(p => p.collectionHandles.includes('wallets')).length,
  },
  {
    id: 'col-belts',
    handle: 'belts',
    title: 'Belts',
    description: 'Solid 4mm vegetable-tanned bridle leather belts hand-finished with solid brass and stainless steel hardware.',
    image: '/assets/products/Classic Black Leather Belt.webp',
    productCount: typedProducts.filter(p => p.collectionHandles.includes('belts')).length,
  },
  {
    id: 'col-keychains',
    handle: 'keychains',
    title: 'Keychains & Gift Sets',
    description: 'Handcrafted leather accessories and gift combinations created for thoughtful gifting.',
    image: '/assets/products/Brown Leather Wallet & Keychain Gift Set.webp',
    productCount: typedProducts.filter(p => p.collectionHandles.includes('keychains')).length,
  },
  {
    id: 'col-all',
    handle: 'all',
    title: 'All Products',
    description: 'The complete Adehawk catalogue of pure handmade leather goods crafted in Great Britain.',
    image: '/assets/products/collection.webp',
    productCount: typedProducts.length,
  },
];

export class LocalCommerceAdapter implements CommerceAdapter {
  async getProducts(): Promise<Product[]> {
    return typedProducts;
  }

  async getProduct(handle: string): Promise<Product | null> {
    const product = typedProducts.find(
      p => p.handle.toLowerCase() === handle.toLowerCase()
    );
    return product || null;
  }

  async getCollections(): Promise<Collection[]> {
    return COLLECTIONS;
  }

  async getCollection(
    handle: string
  ): Promise<{ collection: Collection; products: Product[] } | null> {
    const col = COLLECTIONS.find(c => c.handle.toLowerCase() === handle.toLowerCase());
    if (!col) return null;

    let items: Product[];
    if (col.handle === 'all') {
      items = typedProducts;
    } else {
      items = typedProducts.filter(p => p.collectionHandles.includes(col.handle));
    }

    return {
      collection: col,
      products: items,
    };
  }

  async search(query: string): Promise<Product[]> {
    if (!query || !query.trim()) return [];
    const q = query.toLowerCase().trim();
    return typedProducts.filter(
      p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.colors.some(c => c.name.toLowerCase().includes(q))
    );
  }

  async createCheckoutUrl(): Promise<string> {
    // Default fallback to live Shopify storefront checkout
    return 'https://adehawk.com/cart';
  }
}

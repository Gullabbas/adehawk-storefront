export interface ProductColor {
  name: string;
  hex: string;
  image: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  price: number;
  sku?: string;
  available: boolean;
}

export interface Product {
  id: string;
  title: string;
  handle: string;
  price: number;
  compareAtPrice?: number | null;
  currency: string;
  category: 'bags' | 'wallets' | 'belts' | 'keychains' | 'business-work-bags';
  collectionHandles: string[];
  featured?: boolean;
  bestSeller?: boolean;
  images: string[];
  colors: ProductColor[];
  description: string;
  specs: Record<string, string>;
  features: string[];
  variants?: ProductVariant[];
}

export interface Collection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image?: string;
  productCount: number;
}

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  handle: string;
  price: number;
  image: string;
  colorName?: string;
  quantity: number;
}

export interface CommerceAdapter {
  getProducts(): Promise<Product[]>;
  getProduct(handle: string): Promise<Product | null>;
  getCollections(): Promise<Collection[]>;
  getCollection(handle: string): Promise<{ collection: Collection; products: Product[] } | null>;
  search(query: string): Promise<Product[]>;
  createCheckoutUrl?(items: CartItem[]): Promise<string>;
}

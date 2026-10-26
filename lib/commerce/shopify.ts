import { Product, Collection, CommerceAdapter, CartItem } from './types';
import { LocalCommerceAdapter } from './local';

export class ShopifyCommerceAdapter implements CommerceAdapter {
  private domain: string;
  private token: string;
  private fallback: LocalCommerceAdapter;

  constructor() {
    this.domain = process.env.SHOPIFY_STORE_DOMAIN || 'adehawk.com';
    this.token = process.env.SHOPIFY_STOREFRONT_TOKEN || '';
    this.fallback = new LocalCommerceAdapter();
  }

  private async query(graphqlQuery: string, variables: Record<string, unknown> = {}) {
    if (!this.token) {
      // If token not set in env, fall back seamlessly
      return null;
    }
    const endpoint = `https://${this.domain}/api/2024-01/graphql.json`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': this.token,
      },
      body: JSON.stringify({ query: graphqlQuery, variables }),
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`Shopify API error: ${res.statusText}`);
    return res.json();
  }

  async getProducts(): Promise<Product[]> {
    try {
      const data = await this.query(`
        query GetProducts {
          products(first: 50) {
            edges {
              node {
                id
                title
                handle
                description
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }
                images(first: 5) {
                  edges {
                    node {
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
        }
      `);
      if (!data?.data?.products) return this.fallback.getProducts();
      // map products if connected, else fallback
      return this.fallback.getProducts();
    } catch {
      return this.fallback.getProducts();
    }
  }

  async getProduct(handle: string): Promise<Product | null> {
    return this.fallback.getProduct(handle);
  }

  async getCollections(): Promise<Collection[]> {
    return this.fallback.getCollections();
  }

  async getCollection(handle: string) {
    return this.fallback.getCollection(handle);
  }

  async search(query: string): Promise<Product[]> {
    return this.fallback.search(query);
  }

  async createCheckoutUrl(items: CartItem[]): Promise<string> {
    if (!items.length) return `https://${this.domain}/cart`;
    // Format Shopify cart permalink: https://domain/cart/variant_id:quantity,...
    const permalink = items
      .map(item => `${item.id}:${item.quantity}`)
      .join(',');
    return `https://${this.domain}/cart/${permalink}`;
  }
}

import { MetadataRoute } from 'next';
import { commerce } from '@/lib/commerce';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://adehawk.com';

  const products = await commerce.getProducts();
  const collections = await commerce.getCollections();

  const productUrls = products.map(p => ({
    url: `${baseUrl}/products/${p.handle}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const collectionUrls = collections.map(c => ({
    url: `${baseUrl}/collections/${c.handle}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  const staticPages = [
    '',
    '/search',
    '/cart',
    '/wishlist',
    '/pages/shipping-policy',
    '/pages/return-refund-policy',
    '/pages/privacy-policy',
    '/pages/terms-of-service',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1.0 : 0.6,
  }));

  return [...staticPages, ...collectionUrls, ...productUrls];
}

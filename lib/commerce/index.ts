import { CommerceAdapter } from './types';
import { LocalCommerceAdapter } from './local';
import { ShopifyCommerceAdapter } from './shopify';

export * from './types';
export * from './local';

const useShopify =
  process.env.COMMERCE_PROVIDER === 'shopify' ||
  Boolean(process.env.SHOPIFY_STOREFRONT_TOKEN);

export const commerce: CommerceAdapter = useShopify
  ? new ShopifyCommerceAdapter()
  : new LocalCommerceAdapter();

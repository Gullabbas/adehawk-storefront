import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { commerce } from '@/lib/commerce';
import { ProductDetailClient } from '@/components/product/ProductDetailClient';

interface Props {
  params: Promise<{ handle: string }>;
}

export async function generateStaticParams() {
  const products = await commerce.getProducts();
  return products.map(prod => ({
    handle: prod.handle,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const product = await commerce.getProduct(handle);
  if (!product) return { title: 'Product Not Found' };

  return {
    title: `${product.title} | ADEHAWK LEATHER GOODS`,
    description: product.description,
    openGraph: {
      title: `${product.title} | ADEHAWK LEATHER GOODS`,
      description: product.description,
      images: [
        {
          url: product.images[0] || '/assets/products/collection.webp',
          width: 800,
          height: 1000,
          alt: product.title,
        },
      ],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params;
  const product = await commerce.getProduct(handle);

  if (!product) {
    notFound();
  }

  const allProducts = await commerce.getProducts();
  const related = allProducts.filter(
    p => p.category === product.category && p.id !== product.id
  );

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: `https://adehawk.com${product.images[0]}`,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: 'ADEHAWK LEATHER GOODS',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'GBP',
      price: product.price.toFixed(2),
      availability: 'https://schema.org/InStock',
      url: `https://adehawk.com/products/${product.handle}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <ProductDetailClient product={product} relatedProducts={related} />
    </>
  );
}

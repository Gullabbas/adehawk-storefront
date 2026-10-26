import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { commerce } from '@/lib/commerce';
import { CollectionClient } from '@/components/collection/CollectionClient';

interface Props {
  params: Promise<{ handle: string }>;
}

export async function generateStaticParams() {
  const collections = await commerce.getCollections();
  return collections.map(col => ({
    handle: col.handle,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const result = await commerce.getCollection(handle);
  if (!result) return { title: 'Collection Not Found' };

  return {
    title: `${result.collection.title} | ADEHAWK LEATHER GOODS`,
    description: result.collection.description,
    openGraph: {
      title: `${result.collection.title} | ADEHAWK LEATHER GOODS`,
      description: result.collection.description,
      images: [
        {
          url: result.collection.image || '/assets/products/collection.webp',
          width: 1200,
          height: 800,
          alt: result.collection.title,
        },
      ],
    },
  };
}

export default async function CollectionPage({ params }: Props) {
  const { handle } = await params;
  const result = await commerce.getCollection(handle);

  if (!result) {
    notFound();
  }

  return (
    <CollectionClient
      collection={result.collection}
      products={result.products}
    />
  );
}

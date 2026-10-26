import { commerce } from '@/lib/commerce';
import { Hero } from '@/components/hero/Hero';
import { BrandMarquee } from '@/components/home/BrandMarquee';
import { ShopByCollection } from '@/components/home/ShopByCollection';
import { CraftedForTheJourney } from '@/components/home/CraftedForTheJourney';
import { SignatureBagsRail } from '@/components/home/SignatureBagsRail';
import { TheCraft } from '@/components/home/TheCraft';
import { SignatureWalletsGrid } from '@/components/home/SignatureWalletsGrid';
import { ShopTheLook } from '@/components/home/ShopTheLook';
import { TrustRow } from '@/components/home/TrustRow';

export const revalidate = 3600; // 1 hour cache

export default async function HomePage() {
  const products = await commerce.getProducts();

  return (
    <div className="relative w-full bg-ivory">
      {/* 1. Cinematic WebGL Hero Stage */}
      <Hero />

      {/* 2. Fluid Brand Marquee */}
      <BrandMarquee />

      {/* 3. Shop by Collection (Pinned Horizontal Scroll) */}
      <ShopByCollection />

      {/* 4. The Art of Leather / Crafted for the Journey */}
      <CraftedForTheJourney />

      {/* 5. Signature Bags Draggable Rail */}
      <SignatureBagsRail products={products} />

      {/* 6. The Craft / Crafted with Character (Dark Espresso Pinned) */}
      <TheCraft />

      {/* 7. Signature Wallets Grid with Dynamic Colour Swatches */}
      <SignatureWalletsGrid products={products} />

      {/* 8. Interactive Shop the Look Hotspots */}
      <ShopTheLook />

      {/* 9. Brand Trust Row */}
      <TrustRow />
    </div>
  );
}

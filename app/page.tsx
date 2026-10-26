import { commerce } from '@/lib/commerce';
import { IntroScene } from '@/components/home/IntroScene';
import { ChapterNavigator } from '@/components/ui/ChapterNavigator';
import { Hero } from '@/components/hero/Hero';
import { BrandMarquee } from '@/components/home/BrandMarquee';
import { CollectionShowcase3D } from '@/components/home/CollectionShowcase3D';
import { TheCraftPinned } from '@/components/home/TheCraftPinned';
import { WalletStudio } from '@/components/home/WalletStudio';
import { SpotlightTour } from '@/components/home/SpotlightTour';
import { TrustRow } from '@/components/home/TrustRow';

export const revalidate = 3600; // 1 hour cache

export default async function HomePage() {
  const products = await commerce.getProducts();

  return (
    <div className="relative w-full bg-espresso min-h-screen">
      {/* 1. Intro: Logo First, Scroll Reveal */}
      <IntroScene />

      {/* 2. Right-edge Chapter Navigator & Scroll Progress line under header */}
      <ChapterNavigator />

      {/* 3. Hero Stage (Top of document flow directly under the intro overlay) */}
      <div id="hero-section" className="relative w-full overflow-hidden">
        <Hero />
      </div>

      {/* 4. Interactive Dual-Track Fluid Brand Marquee */}
      <BrandMarquee />

      {/* 5. 3D Coverflow Collection Showcase (Pinned 260vh, direct child in document flow) */}
      <CollectionShowcase3D />

      {/* 6. Apple-Style Pinned Storytelling on Briefcase (Pinned 420vh desktop / 300vh mobile) */}
      <TheCraftPinned />

      {/* 7. Wallet Studio (Light, Tinted, Interactive Swatches & Film Strip - No Pin) */}
      <WalletStudio />

      {/* 8. Shop the Look Guided Spotlight Tour (Pinned 340vh) */}
      <SpotlightTour />

      {/* 9. Brand Assurances Trust Row */}
      <TrustRow />
    </div>
  );
}

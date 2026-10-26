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
      {/* 1. Intro: Logo First, Scroll Reveal (Replaces preloader on Home) */}
      <IntroScene />

      {/* 2. Right-edge Chapter Navigator & Scroll Progress line under header */}
      <ChapterNavigator />

      {/* 3. Site Container with Circular Expansion Mask & De-Blur Driven by Intro */}
      <div
        id="home-reveal-mask"
        className="relative w-full overflow-hidden origin-center will-change-transform"
        style={{
          clipPath: 'circle(150% at 50% 50%)',
          filter: 'none',
          transform: 'scale(1)',
          transition: 'none',
        }}
      >
        {/* Card 1: Cinematic WebGL Hero Stage */}
        <div className="relative z-10">
          <Hero />
        </div>

        {/* Card 2: Interactive Dual-Track Fluid Brand Marquee */}
        <div className="relative z-10">
          <BrandMarquee />
        </div>

        {/* Card 3: 3D Coverflow Collection Showcase (Pinned 300vh) */}
        <div className="relative z-20 -mt-6 rounded-t-[32px] overflow-hidden shadow-[0_-20px_50px_rgba(0,0,0,0.3)]">
          <CollectionShowcase3D />
        </div>

        {/* Card 4: Apple-Style Pinned Storytelling on Briefcase (Pinned 500vh) */}
        <div className="relative z-30 -mt-6 rounded-t-[32px] overflow-hidden shadow-[0_-20px_50px_rgba(0,0,0,0.35)]">
          <TheCraftPinned />
        </div>

        {/* Card 5: Wallet Studio (Light, Tinted, Interactive Swatches & Film Strip) */}
        <div className="relative z-40 -mt-8 rounded-t-[32px] overflow-hidden shadow-[0_-25px_60px_rgba(0,0,0,0.2)]">
          <WalletStudio />
        </div>

        {/* Card 6: Shop the Look Guided Spotlight Tour (Pinned 380vh) */}
        <div className="relative z-50 -mt-8 rounded-t-[32px] overflow-hidden shadow-[0_-25px_60px_rgba(0,0,0,0.35)]">
          <SpotlightTour />
        </div>

        {/* Card 7: Brand Assurances Trust Row */}
        <div className="relative z-[60] -mt-8 rounded-t-[32px] overflow-hidden shadow-[0_-20px_50px_rgba(0,0,0,0.18)]">
          <TrustRow />
        </div>
      </div>
    </div>
  );
}

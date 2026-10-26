export interface HeroSlide {
  id: number;
  kicker: string;
  headline: string;
  ctaText: string;
  ctaHref: string;
  label: string;
  desktopImage: string;
  mobileImage: string;
  imageWidth: number;
  imageHeight: number;
  focalPoint: { x: number; y: number };
  themeBg: string;
}

export const HERO_CONFIG = {
  autoplayDuration: 6.5, // 6500ms
  transitionDuration: 1.4, // 1400ms
  dragThreshold: 0.3, // 30% drag to commit
  velocityThreshold: 0.5, // px/ms
  slides: [
    {
      id: 1,
      kicker: 'TIMELESS BY DESIGN',
      headline: 'Leather goods crafted for the way you move.',
      ctaText: 'Shop the Collection',
      ctaHref: '/collections/bags',
      label: 'Timeless Design',
      desktopImage: '/assets/products/collection.webp',
      mobileImage: '/assets/products/collection.webp',
      imageWidth: 2000,
      imageHeight: 734,
      focalPoint: { x: 0.5, y: 0.45 },
      themeBg: '#161311',
    },
    {
      id: 2,
      kicker: 'EVERYDAY LUXURY',
      headline: 'Fine Leather Goods Made to Last a Lifetime.',
      ctaText: 'Shop the Collection',
      ctaHref: '/collections/wallets',
      label: 'Everyday Luxury',
      desktopImage: '/assets/products/Cowhide Leather Duffle Bag.webp',
      mobileImage: '/assets/products/Cowhide Leather Duffle Bag.webp',
      imageWidth: 800,
      imageHeight: 1000,
      focalPoint: { x: 0.5, y: 0.5 },
      themeBg: '#1A1614',
    },
    {
      id: 3,
      kicker: 'REDEFINING WORKWEAR',
      headline: 'Distinctive Leather Goods That Mean Business.',
      ctaText: 'Shop the Collection',
      ctaHref: '/collections/business-work-bags',
      label: 'Executive Workwear',
      desktopImage: '/assets/products/Black Leather Executive Briefcase.jpg',
      mobileImage: '/assets/products/Black Leather Executive Briefcase.jpg',
      imageWidth: 800,
      imageHeight: 1000,
      focalPoint: { x: 0.5, y: 0.5 },
      themeBg: '#12100E',
    },
  ] as HeroSlide[],
};

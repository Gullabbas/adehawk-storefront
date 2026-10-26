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
  panelAnchor: 'bottom-left' | 'bottom-right';
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
      panelAnchor: 'bottom-left' as const,
    },
    {
      id: 2,
      kicker: 'EVERYDAY LUXURY',
      headline: 'Fine Leather Goods Made to Last a Lifetime.',
      ctaText: 'Shop the Collection',
      ctaHref: '/collections/wallets',
      label: 'Everyday Luxury',
      desktopImage: '/assets/products/cowhide-leather-duffle-bag.webp',
      mobileImage: '/assets/products/cowhide-leather-duffle-bag.webp',
      imageWidth: 800,
      imageHeight: 1000,
      focalPoint: { x: 0.5, y: 0.5 },
      themeBg: '#1A1614',
      panelAnchor: 'bottom-left' as const,
    },
    {
      id: 3,
      kicker: 'REDEFINING WORKWEAR',
      headline: 'Distinctive Leather Goods That Mean Business.',
      ctaText: 'Shop the Collection',
      ctaHref: '/collections/business-work-bags',
      label: 'Executive Workwear',
      desktopImage: '/assets/products/black-leather-executive-briefcase.jpg',
      mobileImage: '/assets/products/black-leather-executive-briefcase.jpg',
      imageWidth: 800,
      imageHeight: 1000,
      focalPoint: { x: 0.5, y: 0.5 },
      themeBg: '#12100E',
      panelAnchor: 'bottom-left' as const,
    },
  ] as HeroSlide[],
};

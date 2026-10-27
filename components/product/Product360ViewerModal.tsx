'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/store/useUIStore';
import { useCartStore } from '@/store/useCartStore';

interface FrameConfig {
  idx: number;
  deg: number;
  label: string;
  shortLabel: string;
  src: string;
  hotspots?: {
    id: string;
    x: number; // percentage from left
    y: number; // percentage from top
    title: string;
    description: string;
  }[];
}

const FRAMES: FrameConfig[] = [
  {
    idx: 0,
    deg: 0,
    label: 'Front Elevation',
    shortLabel: '0° Front',
    src: '/images/360/frames/frame-0.webp',
    hotspots: [
      {
        id: 'h0-1',
        x: 22,
        y: 60,
        title: 'Genuine Hair-on-Hide',
        description: 'Selected black and ivory natural cowhide fur. Unbleached, water-shedding, and tactilely dense.',
      },
      {
        id: 'h0-2',
        x: 48,
        y: 50,
        title: 'Front Passport Pocket',
        description: 'Antique brass zipper with hand-cut full-grain harness leather pull tab for quick-reach travel items.',
      },
      {
        id: 'h0-3',
        x: 64,
        y: 38,
        title: 'Double-Riveted Harness Straps',
        description: 'Vegetable-tanned saddle leather straps anchored through heavy solid brass rivets and double-stitching.',
      },
    ],
  },
  {
    idx: 1,
    deg: 60,
    label: 'Front-Left Three-Quarter',
    shortLabel: '60° 3/4 Left',
    src: '/images/360/frames/frame-1.webp',
    hotspots: [
      {
        id: 'h1-1',
        x: 35,
        y: 36,
        title: 'Dual Brass Top Zippers',
        description: 'Smooth-glide heavy gauge brass zips running the entire barrel length for unobstructed packing.',
      },
      {
        id: 'h1-2',
        x: 75,
        y: 65,
        title: 'Structured Barrel End',
        description: 'Reinforced circular piping protects corners against luggage compartment friction.',
      },
    ],
  },
  {
    idx: 2,
    deg: 120,
    label: 'Side Profile (Shoe Pocket)',
    shortLabel: '120° Profile',
    src: '/images/360/frames/frame-2.webp',
    hotspots: [
      {
        id: 'h2-1',
        x: 50,
        y: 64,
        title: 'Dedicated Shoe Compartment',
        description: 'Curved zipped pouch separating footwear or laundry from the main garment interior.',
      },
      {
        id: 'h2-2',
        x: 50,
        y: 40,
        title: 'Cast Solid Brass D-Ring',
        description: 'Drop-forged antique brass ring rated for 50kg+ tensile weight with the detachable shoulder strap.',
      },
    ],
  },
  {
    idx: 3,
    deg: 180,
    label: 'Top-Down Architecture',
    shortLabel: '180° Top',
    src: '/images/360/frames/frame-3.webp',
    hotspots: [
      {
        id: 'h3-1',
        x: 50,
        y: 48,
        title: 'Dual Main Zippers',
        description: 'Symmetrical brass sliders allowing the duffle to be opened from either side or locked with a travel padlock.',
      },
      {
        id: 'h3-2',
        x: 50,
        y: 22,
        title: 'Rolled Leather Carry Handles',
        description: 'Ergonomic cushioned core wrapped in supple full-grain leather for comfortable hand carry.',
      },
    ],
  },
  {
    idx: 4,
    deg: 240,
    label: 'Rear-Right Three-Quarter',
    shortLabel: '240° 3/4 Rear',
    src: '/images/360/frames/frame-4.webp',
    hotspots: [
      {
        id: 'h4-1',
        x: 65,
        y: 65,
        title: 'Reinforced Base Construction',
        description: 'Heavy duty internal leather stiffener keeps duffle shape intact even when partially packed.',
      },
    ],
  },
  {
    idx: 5,
    deg: 300,
    label: 'Front-Right Three-Quarter',
    shortLabel: '300° 3/4 Right',
    src: '/images/360/frames/frame-5.webp',
    hotspots: [
      {
        id: 'h5-1',
        x: 35,
        y: 45,
        title: 'Detachable Shoulder Strap',
        description: 'Supple leather shoulder sling with antique brass swivel snap hooks and movable padded comfort pad.',
      },
    ],
  },
];

export const Product360ViewerModal: React.FC = () => {
  const { is3DViewerOpen, close3DViewer } = useUIStore();
  const { addItem } = useCartStore();

  const [currentFrame, setCurrentFrame] = useState(0);
  const [isAutoSpinning, setIsAutoSpinning] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isZoomMode, setIsZoomMode] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const [addedToast, setAddedToast] = useState(false);

  const dragStartX = useRef<number>(0);
  const dragStartFrame = useRef<number>(0);
  const turntableRef = useRef<HTMLDivElement>(null);
  const totalFrames = FRAMES.length;

  // Preload all 6 images immediately into browser cache
  useEffect(() => {
    FRAMES.forEach(f => {
      const img = new window.Image();
      img.src = f.src;
    });
  }, []);

  // Keyboard navigation (Esc to close, Left/Right to spin, Space to toggle auto-spin)
  useEffect(() => {
    if (!is3DViewerOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close3DViewer();
      } else if (e.key === 'ArrowRight') {
        setIsAutoSpinning(false);
        setCurrentFrame(prev => (prev + 1) % totalFrames);
      } else if (e.key === 'ArrowLeft') {
        setIsAutoSpinning(false);
        setCurrentFrame(prev => (prev - 1 + totalFrames) % totalFrames);
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsAutoSpinning(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [is3DViewerOpen, close3DViewer, totalFrames]);

  // Lock background scroll when open
  useEffect(() => {
    if (is3DViewerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setIsAutoSpinning(true);
      setIsZoomMode(false);
      setActiveHotspotId(null);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [is3DViewerOpen]);

  // Smooth Auto-Spin Turntable Loop
  useEffect(() => {
    if (!is3DViewerOpen || !isAutoSpinning || isDragging || isZoomMode) return;

    const interval = setInterval(() => {
      setCurrentFrame(prev => (prev + 1) % totalFrames);
    }, 1800);

    return () => clearInterval(interval);
  }, [is3DViewerOpen, isAutoSpinning, isDragging, isZoomMode, totalFrames]);

  // Pointer drag gestures (mouse + touch)
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (isZoomMode) return;
    setIsDragging(true);
    setIsAutoSpinning(false);
    dragStartX.current = e.clientX;
    dragStartFrame.current = currentFrame;
    if (turntableRef.current) {
      turntableRef.current.setPointerCapture(e.pointerId);
    }
  }, [currentFrame, isZoomMode]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (isZoomMode && turntableRef.current) {
      const rect = turntableRef.current.getBoundingClientRect();
      const x = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
      const y = Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100));
      setZoomPos({ x, y });
      return;
    }

    if (!isDragging) return;
    const deltaX = e.clientX - dragStartX.current;
    // Every 45px of drag moves one frame
    const frameOffset = Math.round(deltaX / 45);
    const newFrame = (dragStartFrame.current - frameOffset) % totalFrames;
    setCurrentFrame(newFrame >= 0 ? newFrame : newFrame + totalFrames);
  }, [isDragging, isZoomMode, totalFrames]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      if (turntableRef.current && turntableRef.current.hasPointerCapture(e.pointerId)) {
        turntableRef.current.releasePointerCapture(e.pointerId);
      }
    }
  }, [isDragging]);

  const handleAddToCart = () => {
    addItem({
      productId: 'cowhide-travel-duffle-360',
      title: 'Handmade Cowhide & Harness Leather Travel Duffle',
      handle: 'handmade-cowhide-harness-leather-travel-duffle',
      price: 145,
      image: FRAMES[0].src,
      colorName: 'Black & Ivory Cowhide / Tan Harness Leather',
    });
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2400);
  };

  const currentConfig = FRAMES[currentFrame];

  return (
    <AnimatePresence>
      {is3DViewerOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[600] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-xl"
          onClick={close3DViewer}
        >
          {/* Main Modal Showcase Card */}
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-6xl max-h-[94vh] bg-[#14100E] border border-ivory/15 rounded-[24px] sm:rounded-[32px] shadow-[0_30px_90px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden text-ivory"
            onClick={e => e.stopPropagation()}
          >
            {/* Top Modal Header Bar */}
            <div className="flex items-center justify-between px-5 sm:px-8 py-3.5 sm:py-4 border-b border-ivory/10 bg-espresso/60 backdrop-blur-md">
              <div className="flex items-center space-x-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cognac/20 border border-cognac/40 text-[10px] font-sans font-semibold tracking-wider text-[#D9A066] uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D9A066] animate-pulse" />
                  Interactive 360° Studio
                </span>
                <span className="hidden sm:inline-block text-xs text-ivory/60 font-sans tracking-wide">
                  Signature Cowhide Weekender Duffle
                </span>
              </div>

              {/* Close Button */}
              <button
                onClick={close3DViewer}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-ivory/10 hover:bg-ivory/20 text-ivory/80 hover:text-ivory flex items-center justify-center transition-all cursor-pointer border border-ivory/10"
                aria-label="Close 3D View"
              >
                <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Main Stage & Sidebar Grid */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
              {/* 360 Turntable Interactive Stage */}
              <div className="relative flex-1 flex flex-col justify-between p-4 sm:p-6 min-h-[380px] sm:min-h-[460px] lg:min-h-[520px] select-none bg-[radial-gradient(ellipse_at_center,rgba(40,30,24,0.7)_0%,rgba(14,11,9,0.95)_100%)]">
                {/* Turntable Top Controls Bar */}
                <div className="relative z-20 flex items-center justify-between gap-2">
                  {/* Current Angle Badge & Degree Dial */}
                  <div className="flex items-center space-x-2 bg-espresso/70 backdrop-blur-md border border-ivory/15 rounded-full px-3 py-1 text-xs">
                    <span className="text-[#D9A066] font-mono font-bold tracking-tight">
                      {currentConfig.deg}°
                    </span>
                    <span className="text-ivory/30">|</span>
                    <span className="text-ivory/80 text-[11px] font-sans">
                      {currentConfig.label}
                    </span>
                  </div>

                  {/* Actions: Auto-Spin Toggle & Zoom Magnifier Toggle */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsAutoSpinning(prev => !prev)}
                      className={`px-3 py-1 rounded-full text-xs font-sans tracking-wide border transition-all cursor-pointer flex items-center gap-1.5 ${
                        isAutoSpinning
                          ? 'bg-[#D9A066]/20 border-[#D9A066] text-[#D9A066]'
                          : 'bg-ivory/10 border-ivory/20 text-ivory/70 hover:text-ivory'
                      }`}
                      aria-label={isAutoSpinning ? 'Pause 360 rotation' : 'Auto rotate 360'}
                    >
                      {isAutoSpinning ? (
                        <>
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                            <rect x="6" y="4" width="4" height="16" />
                            <rect x="14" y="4" width="4" height="16" />
                          </svg>
                          <span>Auto-Spinning</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                          <span>Auto-Spin</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setIsZoomMode(prev => !prev);
                        if (!isZoomMode) setIsAutoSpinning(false);
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-sans tracking-wide border transition-all cursor-pointer flex items-center gap-1.5 ${
                        isZoomMode
                          ? 'bg-[#D9A066] text-ink font-semibold border-[#D9A066]'
                          : 'bg-ivory/10 border-ivory/20 text-ivory/70 hover:text-ivory'
                      }`}
                      aria-label="Toggle Magnifier Zoom"
                    >
                      <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        <line x1="11" y1="8" x2="11" y2="14" />
                        <line x1="8" y1="11" x2="14" y2="11" />
                      </svg>
                      <span>{isZoomMode ? 'Exit Zoom' : 'Inspect Grain'}</span>
                    </button>
                  </div>
                </div>

                {/* The Interactive Turntable Viewport */}
                <div
                  ref={turntableRef}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerLeave={handlePointerUp}
                  className={`relative flex-1 w-full flex items-center justify-center my-2 cursor-grab active:cursor-grabbing overflow-hidden rounded-2xl ${
                    isZoomMode ? 'cursor-crosshair' : ''
                  }`}
                  style={{ touchAction: 'none' }}
                >
                  {/* Studio Pedestal Ambient Cognac Glow & Ground Shadow */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[85%] max-w-[560px] h-12 bg-[#D9A066]/15 rounded-full blur-2xl pointer-events-none" />
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[70%] max-w-[460px] h-8 bg-black/70 rounded-full blur-xl pointer-events-none" />

                  {/* Preloaded Layered Frames with Instantaneous Cross-Frame Render */}
                  <div className="relative w-full max-w-[620px] aspect-[4/3] flex items-center justify-center">
                    {FRAMES.map((f, i) => (
                      <div
                        key={f.idx}
                        className="absolute inset-0 flex items-center justify-center transition-opacity duration-150 ease-out pointer-events-none"
                        style={{
                          opacity: i === currentFrame ? 1 : 0,
                          transform: isZoomMode
                            ? `scale(2.2) translate(${50 - zoomPos.x}%, ${50 - zoomPos.y}%)`
                            : 'scale(1)',
                          transition: isZoomMode ? 'transform 0.1s ease-out, opacity 0.15s ease-out' : 'opacity 0.15s ease-out',
                        }}
                      >
                        <Image
                          src={f.src}
                          alt={`Adehawk Duffle Bag - ${f.label}`}
                          fill
                          sizes="(max-width: 1024px) 100vw, 620px"
                          priority
                          className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
                        />
                      </div>
                    ))}

                    {/* Interactive Craftsmanship Hotspots (visible when not zoomed) */}
                    {!isZoomMode &&
                      currentConfig.hotspots?.map(hs => {
                        const isOpen = activeHotspotId === hs.id;
                        return (
                          <div
                            key={hs.id}
                            className="absolute z-30"
                            style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
                            onClick={e => {
                              e.stopPropagation();
                              setActiveHotspotId(isOpen ? null : hs.id);
                            }}
                          >
                            {/* Pulsing Hotspot Pin */}
                            <button
                              className="relative -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#D9A066] border-2 border-ivory text-ink flex items-center justify-center shadow-lg active:scale-95 transition-transform cursor-pointer"
                              aria-label={`Hotspot: ${hs.title}`}
                            >
                              <span className="w-2 h-2 rounded-full bg-espresso animate-ping" />
                              <span className="absolute w-2 h-2 rounded-full bg-espresso" />
                            </button>

                            {/* Hotspot Floating Tooltip */}
                            <AnimatePresence>
                              {isOpen && (
                                <motion.div
                                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                  className="absolute left-1/2 -translate-x-1/2 bottom-8 z-40 w-56 sm:w-64 p-3 rounded-xl bg-espresso/95 backdrop-blur-xl border border-[#D9A066]/40 shadow-2xl text-left pointer-events-auto"
                                  onClick={e => e.stopPropagation()}
                                >
                                  <div className="flex items-center justify-between pb-1 mb-1 border-b border-ivory/10">
                                    <h4 className="text-xs font-serif font-bold text-[#D9A066]">
                                      {hs.title}
                                    </h4>
                                    <button
                                      onClick={() => setActiveHotspotId(null)}
                                      className="text-ivory/40 hover:text-ivory text-xs px-1"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                  <p className="text-[11px] leading-relaxed text-ivory/80 font-sans">
                                    {hs.description}
                                  </p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                  </div>

                  {/* Drag Gesture Hint (fades out after first interaction) */}
                  {!isZoomMode && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex items-center gap-2 px-3 py-1 rounded-full bg-espresso/60 backdrop-blur-md border border-ivory/10 text-[11px] text-ivory/60 font-sans">
                      <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                      <span>Drag to spin 360°</span>
                      <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  )}

                  {/* Zoom Instructions */}
                  {isZoomMode && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none px-3 py-1 rounded-full bg-[#D9A066]/20 backdrop-blur-md border border-[#D9A066]/40 text-[11px] text-[#D9A066] font-sans">
                      Move cursor to inspect 2.2× hair grain & stitching
                    </div>
                  )}
                </div>

                {/* Turntable Quick Navigation: 6 Angle Pills */}
                <div className="relative z-20 flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap pt-2 border-t border-ivory/10">
                  {FRAMES.map((f, i) => {
                    const isActive = i === currentFrame;
                    return (
                      <button
                        key={f.idx}
                        onClick={() => {
                          setIsAutoSpinning(false);
                          setCurrentFrame(i);
                        }}
                        className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] font-sans transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#D9A066] text-ink font-bold shadow-[0_0_15px_rgba(217,160,102,0.4)] scale-105'
                            : 'bg-ivory/5 border border-ivory/10 text-ivory/60 hover:text-ivory hover:border-ivory/30'
                        }`}
                      >
                        {f.shortLabel}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Product Specifications & Purchase Sidebar */}
              <div className="w-full lg:w-[360px] p-5 sm:p-6 sm:px-8 border-t lg:border-t-0 lg:border-l border-ivory/10 bg-espresso/40 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-kicker text-[#D9A066] font-sans font-semibold">
                      Signature Handcrafted Series
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl text-ivory font-light leading-snug mt-1">
                      Cowhide & Harness Leather Travel Duffle
                    </h3>
                    <div className="flex items-baseline space-x-2 mt-2">
                      <span className="text-xl sm:text-2xl font-serif text-[#D9A066]">
                        £145.00
                      </span>
                      <span className="text-xs text-ivory/40 uppercase tracking-widest font-sans">
                        GBP · Free UK Shipping
                      </span>
                    </div>
                  </div>

                  <p className="text-xs leading-relaxed text-ivory/70 font-sans">
                    Individually hand-cut from authentic unbleached hair-on-hide cowhide and vegetable-tanned harness leather. Each duffle features a unique natural pattern with dedicated side shoe pocket and heavy cast antique brass fittings.
                  </p>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-ivory/10 text-xs font-sans">
                    <div className="p-2.5 rounded-xl bg-ivory/5 border border-ivory/10">
                      <span className="block text-[10px] text-ivory/40 uppercase tracking-wider">
                        Capacity
                      </span>
                      <span className="font-medium text-ivory">45 Litres (Carry-on)</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-ivory/5 border border-ivory/10">
                      <span className="block text-[10px] text-ivory/40 uppercase tracking-wider">
                        Hardware
                      </span>
                      <span className="font-medium text-ivory">Solid Cast Brass</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-ivory/5 border border-ivory/10">
                      <span className="block text-[10px] text-ivory/40 uppercase tracking-wider">
                        Leather
                      </span>
                      <span className="font-medium text-ivory">Saddle Harness</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-ivory/5 border border-ivory/10">
                      <span className="block text-[10px] text-ivory/40 uppercase tracking-wider">
                        Shoe Pocket
                      </span>
                      <span className="font-medium text-ivory">Dedicated Zipped</span>
                    </div>
                  </div>
                </div>

                {/* Add to Bag & Close CTAs */}
                <div className="space-y-3 pt-4 border-t border-ivory/10">
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#D9A066] to-[#b87d46] hover:from-[#e2ab75] hover:to-[#c68951] text-ink font-sans font-bold text-xs uppercase tracking-kicker shadow-[0_10px_25px_rgba(217,160,102,0.35)] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <path d="M16 10a4 4 0 01-8 0" />
                    </svg>
                    <span>{addedToast ? 'Added to Bag ✓' : 'Add to Bag · £145.00'}</span>
                  </button>

                  <p className="text-[10px] text-center text-ivory/40 font-sans">
                    30-Day Returns · Lifetime Craftsmanship Guarantee
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

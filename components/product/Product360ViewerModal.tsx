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

const TURNTABLE_FRAMES: FrameConfig[] = [
  {
    idx: 0,
    deg: 0,
    label: 'Front Elevation',
    shortLabel: '0° Front',
    src: '/images/360/frames/frame-0.webp',
    hotspots: [
      {
        id: 'h0-1',
        x: 24,
        y: 62,
        title: 'Genuine Hair-on-Hide',
        description: 'Selected black and ivory natural cowhide fur. Unbleached, water-shedding, and tactilely dense.',
      },
      {
        id: 'h0-2',
        x: 48,
        y: 52,
        title: 'Front Passport Pocket',
        description: 'Antique brass zipper with hand-cut full-grain harness leather pull tab for quick-reach travel items.',
      },
      {
        id: 'h0-3',
        x: 64,
        y: 40,
        title: 'Double-Riveted Harness Straps',
        description: 'Vegetable-tanned saddle leather straps anchored through heavy solid brass rivets and double-stitching.',
      },
    ],
  },
  {
    idx: 1,
    deg: 45,
    label: 'Front-Right Three-Quarter',
    shortLabel: '45° 3/4 Right',
    src: '/images/360/frames/frame-1.webp',
    hotspots: [
      {
        id: 'h1-1',
        x: 42,
        y: 35,
        title: 'Dual Brass Top Zippers',
        description: 'Smooth-glide heavy gauge brass zips running the entire barrel length for unobstructed packing.',
      },
      {
        id: 'h1-2',
        x: 78,
        y: 64,
        title: 'Structured Barrel End',
        description: 'Reinforced circular piping protects corners against luggage compartment friction.',
      },
    ],
  },
  {
    idx: 2,
    deg: 90,
    label: 'Side Profile (Shoe Compartment)',
    shortLabel: '90° Profile',
    src: '/images/360/frames/frame-2.webp',
    hotspots: [
      {
        id: 'h2-1',
        x: 50,
        y: 66,
        title: 'Dedicated Shoe Compartment',
        description: 'Curved zipped pouch separating footwear or laundry from the main garment interior.',
      },
      {
        id: 'h2-2',
        x: 50,
        y: 38,
        title: 'Cast Solid Brass D-Ring',
        description: 'Drop-forged antique brass ring rated for 50kg+ tensile weight with the detachable shoulder strap.',
      },
    ],
  },
  {
    idx: 3,
    deg: 135,
    label: 'Rear-Right Three-Quarter',
    shortLabel: '135° 3/4 Rear',
    src: '/images/360/frames/frame-3.webp',
    hotspots: [
      {
        id: 'h3-1',
        x: 60,
        y: 42,
        title: 'Cylindrical Barrel Form',
        description: 'Ergonomically balanced weight distribution engineered for overhead cabin compartments.',
      },
      {
        id: 'h3-2',
        x: 35,
        y: 65,
        title: 'Reinforced Base Construction',
        description: 'Heavy duty internal leather stiffener keeps duffle shape intact even when partially packed.',
      },
    ],
  },
  {
    idx: 4,
    deg: 180,
    label: 'Rear Elevation',
    shortLabel: '180° Rear',
    src: '/images/360/frames/frame-4.webp',
    hotspots: [
      {
        id: 'h4-1',
        x: 50,
        y: 52,
        title: 'Continuous Hair-on-Hide Back',
        description: 'Seamless natural cowhide pattern with unbroken hair grain and double-stitched harness saddle straps.',
      },
      {
        id: 'h4-2',
        x: 50,
        y: 24,
        title: 'Rolled Leather Carry Handles',
        description: 'Cushioned leather core wrapped in supple full-grain harness leather for hand comfort under heavy loads.',
      },
    ],
  },
  {
    idx: 5,
    deg: 225,
    label: 'Rear-Left Three-Quarter',
    shortLabel: '225° 3/4 Left',
    src: '/images/360/frames/frame-5.webp',
    hotspots: [
      {
        id: 'h5-1',
        x: 65,
        y: 62,
        title: 'Saddle Leather Corner Piping',
        description: 'Hand-burnished leather piping reinforcing the circumference seam against travel wear.',
      },
    ],
  },
  {
    idx: 6,
    deg: 270,
    label: 'Left Side Profile',
    shortLabel: '270° Profile',
    src: '/images/360/frames/frame-6.webp',
    hotspots: [
      {
        id: 'h6-1',
        x: 50,
        y: 38,
        title: 'Heavy Drop-Forged Hardware',
        description: 'Solid brass anchor plate riveted through dual leather layers for maximum strap security.',
      },
    ],
  },
  {
    idx: 7,
    deg: 315,
    label: 'Front-Left Three-Quarter',
    shortLabel: '315° 3/4 Front',
    src: '/images/360/frames/frame-7.webp',
    hotspots: [
      {
        id: 'h7-1',
        x: 35,
        y: 45,
        title: 'Detachable Shoulder Strap',
        description: 'Supple leather shoulder sling with antique brass swivel snap hooks and movable padded comfort pad.',
      },
    ],
  },
];

const TOP_VIEW_CONFIG: FrameConfig = {
  idx: 8,
  deg: 999,
  label: 'Top-Down Architecture View',
  shortLabel: 'Top View',
  src: '/images/360/frames/top-architecture.webp',
  hotspots: [
    {
      id: 'htop-1',
      x: 50,
      y: 48,
      title: 'Dual Heavy Brass Zippers',
      description: 'Symmetrical antique brass sliders running full length allowing the bag to open wide from either side.',
    },
    {
      id: 'htop-2',
      x: 50,
      y: 22,
      title: 'Ergonomic Rolled Handles',
      description: 'Comfortably contoured twin carry handles stitched with heavy rot-resistant bonded thread.',
    },
  ],
};

export const Product360ViewerModal: React.FC = () => {
  const { is3DViewerOpen, close3DViewer } = useUIStore();
  const { addItem } = useCartStore();

  // Rotational state: angle is a continuous float from 0 to 360
  const [angle, setAngle] = useState<number>(0);
  const [isAutoSpinning, setIsAutoSpinning] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isTopView, setIsTopView] = useState<boolean>(false);
  const [isZoomMode, setIsZoomMode] = useState<boolean>(false);
  const [zoomPos, setZoomPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  // 3D Spatial Tilt state (Pitch & Yaw)
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const [addedToast, setAddedToast] = useState<boolean>(false);

  // Turntable physics refs
  const angleRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const isAutoSpinningRef = useRef<boolean>(true);
  const isTopViewRef = useRef<boolean>(false);
  const isZoomModeRef = useRef<boolean>(false);
  const lastPointerXRef = useRef<number>(0);
  const lastPointerTimeRef = useRef<number>(0);

  const turntableRef = useRef<HTMLDivElement>(null);
  const animFrameIdRef = useRef<number | null>(null);

  const totalTurntableFrames = TURNTABLE_FRAMES.length; // 8

  // Synchronize refs with state
  useEffect(() => {
    isAutoSpinningRef.current = isAutoSpinning;
  }, [isAutoSpinning]);

  useEffect(() => {
    isTopViewRef.current = isTopView;
  }, [isTopView]);

  useEffect(() => {
    isZoomModeRef.current = isZoomMode;
  }, [isZoomMode]);

  // Preload all 8 turntable frames + top view immediately into browser cache
  useEffect(() => {
    TURNTABLE_FRAMES.forEach(f => {
      const img = new window.Image();
      img.src = f.src;
    });
    const topImg = new window.Image();
    topImg.src = TOP_VIEW_CONFIG.src;
  }, []);

  // 60FPS Continuous Turntable Physics & Inertia Engine
  useEffect(() => {
    if (!is3DViewerOpen) return;

    let lastTimestamp = performance.now();

    const renderLoop = (timestamp: number) => {
      const deltaMs = Math.min(32, timestamp - lastTimestamp);
      lastTimestamp = timestamp;

      if (!isTopViewRef.current && !isZoomModeRef.current) {
        if (isDraggingRef.current) {
          // While dragging, velocity is tracked in pointer move
        } else if (Math.abs(velocityRef.current) > 0.02) {
          // Inertial momentum glide with smooth exponential decay
          angleRef.current = (angleRef.current + velocityRef.current) % 360;
          if (angleRef.current < 0) angleRef.current += 360;
          velocityRef.current *= 0.94; // friction
          setAngle(angleRef.current);
        } else if (isAutoSpinningRef.current) {
          // Silky continuous 60fps auto-rotation (approx. 0.35 deg per frame)
          const spinStep = 0.32 * (deltaMs / 16.66);
          angleRef.current = (angleRef.current + spinStep) % 360;
          setAngle(angleRef.current);
        }
      }

      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [is3DViewerOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!is3DViewerOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close3DViewer();
      } else if (e.key === 'ArrowRight') {
        setIsAutoSpinning(false);
        setIsTopView(false);
        angleRef.current = (angleRef.current + 45) % 360;
        setAngle(angleRef.current);
      } else if (e.key === 'ArrowLeft') {
        setIsAutoSpinning(false);
        setIsTopView(false);
        angleRef.current = (angleRef.current - 45 + 360) % 360;
        setAngle(angleRef.current);
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsAutoSpinning(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [is3DViewerOpen, close3DViewer]);

  // Body scroll lock
  useEffect(() => {
    if (is3DViewerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setIsAutoSpinning(true);
      setIsTopView(false);
      setIsZoomMode(false);
      setActiveHotspotId(null);
      setTilt({ x: 0, y: 0 });
      velocityRef.current = 0;
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [is3DViewerOpen]);

  // Pointer drag gestures with sub-pixel resolution and momentum
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (isZoomMode) return;
      setIsDragging(true);
      isDraggingRef.current = true;
      setIsAutoSpinning(false);
      velocityRef.current = 0;

      lastPointerXRef.current = e.clientX;
      lastPointerTimeRef.current = performance.now();

      if (turntableRef.current) {
        turntableRef.current.setPointerCapture(e.pointerId);
      }
    },
    [isZoomMode]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!turntableRef.current) return;

      const rect = turntableRef.current.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

      if (isZoomMode) {
        const x = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
        const y = Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100));
        setZoomPos({ x, y });
        return;
      }

      // 3D Spatial Tilt response (subtle pitch & yaw)
      if (!isTopView) {
        setTilt({
          x: Math.min(8, Math.max(-8, normY * -8)), // pitch
          y: Math.min(12, Math.max(-12, normX * 12)), // yaw
        });
      }

      if (!isDraggingRef.current) return;

      const deltaX = e.clientX - lastPointerXRef.current;
      const now = performance.now();
      const dt = Math.max(1, now - lastPointerTimeRef.current);

      // Sensitivity: 360 degrees across 720px of drag
      const degreesPerPixel = 360 / 720;
      const angleDelta = -deltaX * degreesPerPixel;

      angleRef.current = (angleRef.current + angleDelta) % 360;
      if (angleRef.current < 0) angleRef.current += 360;
      setAngle(angleRef.current);

      // Velocity calculation (degrees per frame)
      velocityRef.current = (angleDelta / dt) * 16.66;
      velocityRef.current = Math.min(15, Math.max(-15, velocityRef.current));

      lastPointerXRef.current = e.clientX;
      lastPointerTimeRef.current = now;
    },
    [isZoomMode, isTopView]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (isDraggingRef.current) {
        setIsDragging(false);
        isDraggingRef.current = false;
        if (turntableRef.current && turntableRef.current.hasPointerCapture(e.pointerId)) {
          turntableRef.current.releasePointerCapture(e.pointerId);
        }
      }
    },
    []
  );

  const handlePointerLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    if (isDraggingRef.current) {
      setIsDragging(false);
      isDraggingRef.current = false;
    }
  }, []);

  const handleAddToCart = () => {
    addItem({
      productId: 'cowhide-travel-duffle-360',
      title: 'Handmade Cowhide & Harness Leather Travel Duffle',
      handle: 'handmade-cowhide-harness-leather-travel-duffle',
      price: 145,
      image: TURNTABLE_FRAMES[0].src,
      colorName: 'Black & Ivory Cowhide / Tan Harness Leather',
    });
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2400);
  };

  // Active frame calculation:
  // Each frame covers 45 degrees.
  // To avoid any sudden jumps or ghosting, we compute the primary active frame
  // and a subtle cross-dissolve only in a narrow 6-degree transition band around the boundary.
  const normAngle = ((angle % 360) + 360) % 360;
  const sector = normAngle / 45; // 0.0 to 8.0
  const baseIdx = Math.floor(sector) % totalTurntableFrames;
  const nextIdx = (baseIdx + 1) % totalTurntableFrames;
  const sectorFrac = sector - Math.floor(sector); // 0.0 to 1.0

  // Transition band: 0.85 to 1.0 (last 6.75 degrees of each 45-degree sector)
  let primaryIdx = baseIdx;
  let secondaryIdx = nextIdx;
  let blendOpacity = 0; // opacity of secondary frame

  if (sectorFrac > 0.82) {
    // Smooth cosine dissolve between outgoing and incoming frame
    const t = (sectorFrac - 0.82) / 0.18; // 0 to 1
    blendOpacity = 0.5 * (1 - Math.cos(t * Math.PI));
  } else {
    blendOpacity = 0;
  }

  const nearestIdx = Math.round(sector) % totalTurntableFrames;
  const currentConfig = isTopView ? TOP_VIEW_CONFIG : TURNTABLE_FRAMES[nearestIdx];

  // Dynamic Specular Light Glint Position (sweeps with angle and tilt)
  const lightX = 50 + 40 * Math.sin((angle * Math.PI) / 180) + tilt.y * 1.5;
  const lightY = 35 + tilt.x * 2.0;

  // Dynamic Ground Shadow aspect scale (wide on front/back, narrow on profile)
  const shadowWidthPct = 58 + 26 * Math.abs(Math.cos((angle * Math.PI) / 180));
  const shadowOpacity = 0.75 - 0.15 * Math.abs(Math.sin((angle * Math.PI) / 180));

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
                  Interactive 3D Studio
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
                <div className="relative z-20 flex items-center justify-between gap-2 flex-wrap">
                  {/* Current Angle Badge & Degree Dial */}
                  <div className="flex items-center space-x-2 bg-espresso/70 backdrop-blur-md border border-ivory/15 rounded-full px-3 py-1 text-xs">
                    <span className="text-[#D9A066] font-mono font-bold tracking-tight">
                      {isTopView ? '180° Aerial' : `${Math.round(angle)}°`}
                    </span>
                    <span className="text-ivory/30">|</span>
                    <span className="text-ivory/80 text-[11px] font-sans">
                      {currentConfig.label}
                    </span>
                  </div>

                  {/* Actions: Auto-Spin Toggle, Top Architecture View, & Zoom Magnifier Toggle */}
                  <div className="flex items-center space-x-2">
                    {/* Auto-Spin Toggle */}
                    <button
                      onClick={() => {
                        setIsTopView(false);
                        setIsAutoSpinning(prev => !prev);
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-sans tracking-wide border transition-all cursor-pointer flex items-center gap-1.5 ${
                        isAutoSpinning && !isTopView
                          ? 'bg-[#D9A066]/20 border-[#D9A066] text-[#D9A066]'
                          : 'bg-ivory/10 border-ivory/20 text-ivory/70 hover:text-ivory'
                      }`}
                      aria-label={isAutoSpinning ? 'Pause 360 rotation' : 'Auto rotate 360'}
                    >
                      {isAutoSpinning && !isTopView ? (
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

                    {/* Top Architecture Toggle */}
                    <button
                      onClick={() => {
                        setIsTopView(prev => !prev);
                        setIsAutoSpinning(false);
                        setIsZoomMode(false);
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-sans tracking-wide border transition-all cursor-pointer flex items-center gap-1.5 ${
                        isTopView
                          ? 'bg-[#D9A066] text-ink font-semibold border-[#D9A066]'
                          : 'bg-ivory/10 border-ivory/20 text-ivory/70 hover:text-ivory'
                      }`}
                      aria-label="View Top Architecture"
                    >
                      <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                        <polygon points="12 2 2 7 12 12 22 7 12 2" />
                        <polyline points="2 17 12 22 22 17" />
                        <polyline points="2 12 12 17 22 12" />
                      </svg>
                      <span>Top View</span>
                    </button>

                    {/* Zoom Inspector Toggle */}
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

                {/* The Interactive 3D Turntable Viewport */}
                <div
                  ref={turntableRef}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerLeave={handlePointerLeave}
                  className={`relative flex-1 w-full flex items-center justify-center my-2 cursor-grab active:cursor-grabbing overflow-hidden rounded-2xl ${
                    isZoomMode ? 'cursor-crosshair' : ''
                  }`}
                  style={{ touchAction: 'none' }}
                >
                  {/* Studio Ambient Cognac Glow */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[85%] max-w-[560px] h-14 bg-[#D9A066]/15 rounded-full blur-2xl pointer-events-none" />

                  {/* 3D Perspective Turntable Platter on Floor */}
                  <div
                    className="absolute bottom-5 left-1/2 -translate-x-1/2 pointer-events-none transition-transform duration-100 ease-out"
                    style={{
                      width: '460px',
                      height: '130px',
                      perspective: '800px',
                    }}
                  >
                    {/* Rotating 3D Platter Disc */}
                    <div
                      className="relative w-full h-full rounded-[50%] border border-[#D9A066]/35"
                      style={{
                        background: 'radial-gradient(ellipse at center, rgba(50,38,30,0.85) 0%, rgba(20,15,12,0.95) 70%, rgba(10,8,6,1) 100%)',
                        boxShadow: 'inset 0 2px 10px rgba(217,160,102,0.35), 0 20px 45px rgba(0,0,0,0.95)',
                        transform: `rotateX(64deg) rotateZ(${isTopView ? 0 : -angle}deg)`,
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      {/* Concentric Brushed Brass Rings */}
                      <div className="absolute inset-3 rounded-[50%] border border-[#D9A066]/20 border-dashed pointer-events-none" />
                      <div className="absolute inset-7 rounded-[50%] border border-[#D9A066]/10 pointer-events-none" />

                      {/* 8 Cardinal Degree Indicator Ticks on Turntable Platter */}
                      {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => {
                        const rad = (deg * Math.PI) / 180;
                        const x = 50 + 45 * Math.sin(rad);
                        const y = 50 - 45 * Math.cos(rad);
                        return (
                          <div
                            key={deg}
                            className="absolute w-2 h-2 rounded-full bg-[#D9A066] -translate-x-1/2 -translate-y-1/2 shadow-[0_0_6px_#D9A066]"
                            style={{ left: `${x}%`, top: `${y}%` }}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Dynamic Deforming Ground Shadow */}
                  <div
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 max-w-[480px] h-8 bg-black/85 rounded-full blur-xl pointer-events-none transition-all duration-100 ease-out"
                    style={{
                      width: `${shadowWidthPct}%`,
                      opacity: shadowOpacity,
                      transform: `translateX(-50%) scale(${1 + tilt.y * 0.01})`,
                    }}
                  />

                  {/* 3D Volumetric Product Container */}
                  <div
                    className="relative w-full max-w-[620px] aspect-[4/3] flex items-center justify-center transition-transform duration-100 ease-out"
                    style={{
                      perspective: '1200px',
                      transform: isZoomMode
                        ? `scale(2.2) translate(${50 - zoomPos.x}%, ${50 - zoomPos.y}%)`
                        : `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {/* Top Architecture Single Frame (when in Top View Mode) */}
                    {isTopView ? (
                      <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-200 pointer-events-none">
                        <Image
                          src={TOP_VIEW_CONFIG.src}
                          alt="Adehawk Duffle Bag - Top View"
                          fill
                          sizes="(max-width: 1024px) 100vw, 620px"
                          priority
                          className="object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.65)]"
                        />
                      </div>
                    ) : (
                      /* 360 Turntable Frame Rendering with Soft Dissolve Boundary */
                      <>
                        {/* Primary Frame */}
                        <div
                          key={`primary-${primaryIdx}`}
                          className="absolute inset-0 flex items-center justify-center pointer-events-none will-change-[opacity]"
                          style={{
                            opacity: 1 - blendOpacity,
                          }}
                        >
                          <Image
                            src={TURNTABLE_FRAMES[primaryIdx].src}
                            alt={`Adehawk Duffle Bag - ${TURNTABLE_FRAMES[primaryIdx].label}`}
                            fill
                            sizes="(max-width: 1024px) 100vw, 620px"
                            priority
                            className="object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.65)]"
                          />
                        </div>

                        {/* Secondary Frame (only visible during the soft boundary dissolve) */}
                        {blendOpacity > 0 && (
                          <div
                            key={`secondary-${secondaryIdx}`}
                            className="absolute inset-0 flex items-center justify-center pointer-events-none will-change-[opacity]"
                            style={{
                              opacity: blendOpacity,
                            }}
                          >
                            <Image
                              src={TURNTABLE_FRAMES[secondaryIdx].src}
                              alt={`Adehawk Duffle Bag - ${TURNTABLE_FRAMES[secondaryIdx].label}`}
                              fill
                              sizes="(max-width: 1024px) 100vw, 620px"
                              priority
                              className="object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.65)]"
                            />
                          </div>
                        )}
                      </>
                    )}

                    {/* Dynamic Studio Specular Lighting Glint Overlay */}
                    {!isZoomMode && (
                      <div
                        className="absolute inset-0 pointer-events-none rounded-full transition-opacity duration-300"
                        style={{
                          background: `radial-gradient(circle at ${lightX}% ${lightY}%, rgba(255,245,225,0.35) 0%, rgba(217,160,102,0.12) 32%, transparent 64%)`,
                          mixBlendMode: 'screen',
                          opacity: isTopView ? 0.3 : 0.6,
                        }}
                      />
                    )}

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

                  {/* Drag Gesture Hint */}
                  {!isZoomMode && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex items-center gap-2 px-3 py-1 rounded-full bg-espresso/60 backdrop-blur-md border border-ivory/10 text-[11px] text-ivory/60 font-sans">
                      <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                      <span>Drag to spin 360° · Move cursor to tilt 3D</span>
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

                {/* Turntable Quick Navigation: 8 Angle Pills + Top Architecture */}
                <div className="relative z-20 flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap pt-2 border-t border-ivory/10">
                  {TURNTABLE_FRAMES.map((f, i) => {
                    const isActive = !isTopView && nearestIdx === i;
                    return (
                      <button
                        key={f.idx}
                        onClick={() => {
                          setIsTopView(false);
                          setIsAutoSpinning(false);
                          velocityRef.current = 0;
                          angleRef.current = f.deg;
                          setAngle(f.deg);
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

                  {/* Top View Pill */}
                  <button
                    onClick={() => {
                      setIsTopView(true);
                      setIsAutoSpinning(false);
                      setIsZoomMode(false);
                      velocityRef.current = 0;
                    }}
                    className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] font-sans transition-all cursor-pointer ${
                      isTopView
                        ? 'bg-[#D9A066] text-ink font-bold shadow-[0_0_15px_rgba(217,160,102,0.4)] scale-105'
                        : 'bg-ivory/5 border border-ivory/10 text-ivory/60 hover:text-ivory hover:border-ivory/30'
                    }`}
                  >
                    Top Aerial
                  </button>
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

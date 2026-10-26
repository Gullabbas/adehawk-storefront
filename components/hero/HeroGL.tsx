'use client';

import React, { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle, Texture } from 'ogl';
import gsap from 'gsap';
import { vertexShader, fragmentShader } from './hero.shaders';
import { HERO_CONFIG, HeroSlide } from './hero.config';

interface HeroGLProps {
  currentIndex: number;
  nextIndex: number;
  progress: number;
  direction: number;
  velocity: number;
  onReady: () => void;
  onPerformanceDowngrade: () => void;
}

export const HeroGL: React.FC<HeroGLProps> = ({
  currentIndex,
  nextIndex,
  progress,
  direction,
  velocity,
  onReady,
  onPerformanceDowngrade,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // References to WebGL entities
  const rendererRef = useRef<Renderer | null>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<Program | null>(null);
  const texturesRef = useRef<Texture[]>([]);
  const isVisibleRef = useRef(true);

  // Uniform values
  const uniformsRef = useRef<{
    uProgress: { value: number };
    uTime: { value: number };
    uVel: { value: number };
    uDir: { value: number };
    uZoomFrom: { value: number };
    uZoomTo: { value: number };
    uMouse: { value: [number, number] };
    uRes: { value: [number, number] };
    uSizeFrom: { value: [number, number] };
    uSizeTo: { value: [number, number] };
    uFrom: { value: Texture | null };
    uTo: { value: Texture | null };
  }>({
    uProgress: { value: 0 },
    uTime: { value: 0 },
    uVel: { value: 0 },
    uDir: { value: 1 },
    uZoomFrom: { value: 1.04 },
    uZoomTo: { value: 1.04 },
    uMouse: { value: [0.5, 0.5] },
    uRes: { value: [1, 1] },
    uSizeFrom: { value: [2000, 734] },
    uSizeTo: { value: [800, 1000] },
    uFrom: { value: null },
    uTo: { value: null },
  });

  // Mouse lerping
  const targetMouseRef = useRef({ x: 0.5, y: 0.5 });
  const currentMouseRef = useRef({ x: 0.5, y: 0.5 });

  // Performance monitoring
  const frameTimesRef = useRef<number[]>([]);
  const hasCheckedPerfRef = useRef(false);

  // Update uniforms when props change
  useEffect(() => {
    uniformsRef.current.uProgress.value = progress;
    uniformsRef.current.uDir.value = direction;
    uniformsRef.current.uVel.value = velocity;

    if (texturesRef.current[currentIndex]) {
      uniformsRef.current.uFrom.value = texturesRef.current[currentIndex];
      const fromSlide = HERO_CONFIG.slides[currentIndex];
      uniformsRef.current.uSizeFrom.value = [fromSlide.imageWidth, fromSlide.imageHeight];
    }
    if (texturesRef.current[nextIndex]) {
      uniformsRef.current.uTo.value = texturesRef.current[nextIndex];
      const toSlide = HERO_CONFIG.slides[nextIndex];
      uniformsRef.current.uSizeTo.value = [toSlide.imageWidth, toSlide.imageHeight];
    }
  }, [currentIndex, nextIndex, progress, direction, velocity]);

  // Main setup effect
  useEffect(() => {
    if (!containerRef.current) return;

    // Check device memory / save data
    // @ts-expect-error navigator extensions
    if (navigator?.connection?.saveData || (navigator?.deviceMemory && navigator.deviceMemory <= 2)) {
      onPerformanceDowngrade();
      return;
    }

    const container = containerRef.current;
    const isMobile = window.innerWidth < 768;
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);

    let renderer: Renderer;
    try {
      renderer = new Renderer({
        dpr,
        alpha: false,
        antialias: false,
        powerPreference: 'high-performance',
      });
    } catch {
      onPerformanceDowngrade();
      return;
    }

    rendererRef.current = renderer;
    const gl = renderer.gl;
    glRef.current = gl;
    canvasRef.current = gl.canvas;

    gl.canvas.style.width = '100%';
    gl.canvas.style.height = '100%';
    gl.canvas.style.display = 'block';
    container.appendChild(gl.canvas);

    // Context lost / restored
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      onPerformanceDowngrade();
    };
    gl.canvas.addEventListener('webglcontextlost', handleContextLost, false);

    // Create full-screen triangle
    const geometry = new Triangle(gl);

    // Shader with mobile precision check
    const mobileFragShader = isMobile
      ? fragmentShader.replace('#define OCTAVES 4', '#define OCTAVES 3')
      : fragmentShader;

    // Preload Slide Textures
    const loadedTextures: Texture[] = [];
    const slides: HeroSlide[] = HERO_CONFIG.slides;

    const loadTexture = (slide: HeroSlide): Promise<Texture> => {
      return new Promise((resolve) => {
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.src = isMobile ? slide.mobileImage : slide.desktopImage;

        img.onload = () => {
          const tex = new Texture(gl, {
            image: img,
            generateMipmaps: true,
            minFilter: gl.LINEAR_MIPMAP_LINEAR,
            magFilter: gl.LINEAR,
            wrapS: gl.CLAMP_TO_EDGE,
            wrapT: gl.CLAMP_TO_EDGE,
            flipY: true,
          });
          resolve(tex);
        };

        img.onerror = () => {
          // Fallback texture
          const tex = new Texture(gl);
          resolve(tex);
        };
      });
    };

    // Load sequentially: Slide 1 first, then 2 and 3
    loadTexture(slides[0])
      .then(tex1 => {
        loadedTextures[0] = tex1;
        return Promise.all([loadTexture(slides[1]), loadTexture(slides[2])]);
      })
      .then(([tex2, tex3]) => {
        loadedTextures[1] = tex2;
        loadedTextures[2] = tex3;
        texturesRef.current = loadedTextures;

        // Initialize program
        uniformsRef.current.uFrom.value = loadedTextures[0];
        uniformsRef.current.uTo.value = loadedTextures[1];
        uniformsRef.current.uSizeFrom.value = [slides[0].imageWidth, slides[0].imageHeight];
        uniformsRef.current.uSizeTo.value = [slides[1].imageWidth, slides[1].imageHeight];

        const program = new Program(gl, {
          vertex: vertexShader,
          fragment: mobileFragShader,
          uniforms: uniformsRef.current,
        });
        programRef.current = program;

        const mesh = new Mesh(gl, { geometry, program });

        // Size handler
        const handleResize = () => {
          if (!container || !renderer) return;
          const width = container.clientWidth;
          const height = container.clientHeight;
          renderer.setSize(width, height);
          uniformsRef.current.uRes.value = [width * dpr, height * dpr];
        };

        handleResize();
        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(container);

        // Notify parent that textures & canvas are loaded
        onReady();

        // Start render loop on gsap.ticker
        let lastTime = performance.now();
        const renderTicker = (time: number) => {
          if (!isVisibleRef.current) return;

          const now = performance.now();
          const delta = now - lastTime;
          lastTime = now;

          // Performance guard during transition
          if (uniformsRef.current.uProgress.value > 0.05 && uniformsRef.current.uProgress.value < 0.95 && !hasCheckedPerfRef.current) {
            frameTimesRef.current.push(delta);
            if (frameTimesRef.current.length >= 45) {
              const avg = frameTimesRef.current.reduce((a, b) => a + b, 0) / frameTimesRef.current.length;
              hasCheckedPerfRef.current = true;
              if (avg > 24) {
                onPerformanceDowngrade();
                return;
              }
            }
          }

          // Update time & Ken Burns
          uniformsRef.current.uTime.value = time;
          const prog = uniformsRef.current.uProgress.value;
          uniformsRef.current.uZoomFrom.value = 1.04 + 0.06 * prog;
          uniformsRef.current.uZoomTo.value = 1.10 - 0.06 * (1 - prog);

          // Lerp mouse
          currentMouseRef.current.x += (targetMouseRef.current.x - currentMouseRef.current.x) * 0.06;
          currentMouseRef.current.y += (targetMouseRef.current.y - currentMouseRef.current.y) * 0.06;
          uniformsRef.current.uMouse.value = [
            currentMouseRef.current.x,
            currentMouseRef.current.y,
          ];

          renderer.render({ scene: mesh });
        };

        gsap.ticker.add(renderTicker);

        // Cleanup
        return () => {
          resizeObserver.disconnect();
          gsap.ticker.remove(renderTicker);
          gl.canvas.removeEventListener('webglcontextlost', handleContextLost);
        };
      })
      .catch(() => {
        onPerformanceDowngrade();
      });

    // Mouse move parallax (desktop)
    const handleMouseMove = (e: MouseEvent) => {
      targetMouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };

    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    // IntersectionObserver to pause off-screen
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          isVisibleRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    return () => {
      observer.disconnect();
      if (!isMobile) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      if (canvasRef.current && container.contains(canvasRef.current)) {
        container.removeChild(canvasRef.current);
      }
    };
  }, [onReady, onPerformanceDowngrade]);

  return <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden" />;
};

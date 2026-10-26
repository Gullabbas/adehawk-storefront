'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { HERO_CONFIG } from './hero.config';

export type HeroState = 'idle' | 'dragging' | 'transitioning' | 'paused';

interface UseHeroControllerProps {
  onTransitionUpdate?: (progress: number, dir: number, vel: number) => void;
  onSlideChange?: (newIndex: number) => void;
  onAutoplayProgress?: (progress: number) => void;
  onTextTransition?: (outIndex: number, inIndex: number) => void;
}

export function useHeroController({
  onTransitionUpdate,
  onSlideChange,
  onAutoplayProgress,
  onTextTransition,
}: UseHeroControllerProps = {}) {
  const [index, setIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [heroState, setHeroState] = useState<HeroState>('idle');

  const indexRef = useRef(0);
  const nextIndexRef = useRef(1);
  const stateRef = useRef<HeroState>('idle');
  const isPausedRef = useRef(false);

  const busyRef = useRef(false);
  const queuedRef = useRef<{ target: number; dir: number } | null>(null);

  const autoplayTweenRef = useRef<gsap.core.Tween | null>(null);
  const transitionTimelineRef = useRef<gsap.core.Timeline | null>(null);

  const progressRef = useRef({ value: 0 });
  const dirRef = useRef(1);
  const velRef = useRef(0);

  // Drag tracking
  const dragStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastDragPosRef = useRef<{ x: number; time: number } | null>(null);

  // Sync refs with state
  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    nextIndexRef.current = nextIndex;
  }, [nextIndex]);

  useEffect(() => {
    stateRef.current = heroState;
  }, [heroState]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const totalSlides = HERO_CONFIG.slides.length;

  // Execute transition
  const go = useCallback(
    (target: number, direction: number) => {
      // Loop target bounds
      const normalizedTarget = (target + totalSlides) % totalSlides;
      if (normalizedTarget === indexRef.current && stateRef.current !== 'dragging') {
        return;
      }

      if (busyRef.current) {
        queuedRef.current = { target: normalizedTarget, dir: direction };
        return;
      }

      busyRef.current = true;
      setHeroState('transitioning');
      dirRef.current = direction;
      nextIndexRef.current = normalizedTarget;
      setNextIndex(normalizedTarget);

      // Stop autoplay while transitioning
      if (autoplayTweenRef.current) {
        autoplayTweenRef.current.pause();
      }

      // Trigger text choreography callback
      if (onTextTransition) {
        onTextTransition(indexRef.current, normalizedTarget);
      }

      // Kill any running transition timeline
      if (transitionTimelineRef.current) {
        transitionTimelineRef.current.kill();
      }

      const startProgress = progressRef.current.value;

      transitionTimelineRef.current = gsap.timeline({
        onUpdate: () => {
          if (onTransitionUpdate) {
            onTransitionUpdate(progressRef.current.value, dirRef.current, velRef.current);
          }
        },
        onComplete: () => {
          progressRef.current.value = 0;
          velRef.current = 0;
          indexRef.current = normalizedTarget;
          setIndex(normalizedTarget);
          busyRef.current = false;
          setHeroState(isPausedRef.current ? 'paused' : 'idle');

          if (onSlideChange) {
            onSlideChange(normalizedTarget);
          }
          if (onTransitionUpdate) {
            onTransitionUpdate(0, dirRef.current, 0);
          }

          // Restart autoplay if not paused
          if (!isPausedRef.current) {
            startAutoplay();
          }

          // Execute queued transition if present
          if (queuedRef.current) {
            const next = queuedRef.current;
            queuedRef.current = null;
            go(next.target, next.dir);
          }
        },
      });

      transitionTimelineRef.current.fromTo(
        progressRef.current,
        { value: startProgress },
        {
          value: 1,
          duration: HERO_CONFIG.transitionDuration * (1 - startProgress * 0.5),
          ease: 'power3.inOut',
        }
      );
    },
    [totalSlides, onTextTransition, onTransitionUpdate, onSlideChange]
  );

  const next = useCallback(() => {
    go(indexRef.current + 1, 1);
  }, [go]);

  const prev = useCallback(() => {
    go(indexRef.current - 1, -1);
  }, [go]);

  // Autoplay loop
  const startAutoplay = useCallback(() => {
    if (typeof window === 'undefined') return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || isPausedRef.current) return;

    if (autoplayTweenRef.current) {
      autoplayTweenRef.current.kill();
    }

    const autoplayObj = { progress: 0 };
    autoplayTweenRef.current = gsap.to(autoplayObj, {
      progress: 1,
      duration: HERO_CONFIG.autoplayDuration,
      ease: 'none',
      onUpdate: () => {
        if (onAutoplayProgress) {
          onAutoplayProgress(autoplayObj.progress);
        }
      },
      onComplete: () => {
        if (onAutoplayProgress) {
          onAutoplayProgress(1);
        }
        next();
      },
    });
  }, [next, onAutoplayProgress]);

  const pauseAutoplay = useCallback(() => {
    setIsPaused(true);
    isPausedRef.current = true;
    if (autoplayTweenRef.current) {
      autoplayTweenRef.current.pause();
    }
    setHeroState('paused');
  }, []);

  const resumeAutoplay = useCallback(() => {
    setIsPaused(false);
    isPausedRef.current = false;
    if (autoplayTweenRef.current && stateRef.current !== 'transitioning') {
      autoplayTweenRef.current.resume();
      setHeroState('idle');
    } else if (!autoplayTweenRef.current && stateRef.current !== 'transitioning') {
      startAutoplay();
      setHeroState('idle');
    }
  }, [startAutoplay]);

  const togglePause = useCallback(() => {
    if (isPausedRef.current) {
      resumeAutoplay();
    } else {
      pauseAutoplay();
    }
  }, [pauseAutoplay, resumeAutoplay]);

  // Pointer drag scrubbing (Pointer Events API)
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (busyRef.current) return;

    // Only main mouse button or touch
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    dragStartRef.current = { x: e.clientX, y: e.clientY, time: performance.now() };
    lastDragPosRef.current = { x: e.clientX, time: performance.now() };

    // Pause autoplay on drag start
    if (autoplayTweenRef.current) {
      autoplayTweenRef.current.pause();
    }
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragStartRef.current || busyRef.current) return;

      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;

      // Allow vertical scroll if motion is primarily vertical
      if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 10 && stateRef.current !== 'dragging') {
        dragStartRef.current = null;
        return;
      }

      if (Math.abs(dx) > 8 && stateRef.current !== 'dragging') {
        setHeroState('dragging');
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      }

      if (stateRef.current === 'dragging') {
        const stageWidth = window.innerWidth * 0.6;
        const targetProgress = Math.min(1, Math.max(0, Math.abs(dx) / stageWidth));
        const direction = dx < 0 ? 1 : -1;
        dirRef.current = direction;

        const prospectiveNext = (indexRef.current + direction + totalSlides) % totalSlides;
        if (prospectiveNext !== nextIndexRef.current) {
          nextIndexRef.current = prospectiveNext;
          setNextIndex(prospectiveNext);
        }

        // Calculate drag velocity (px/ms)
        const now = performance.now();
        if (lastDragPosRef.current && now > lastDragPosRef.current.time) {
          const dt = now - lastDragPosRef.current.time;
          const instVel = (e.clientX - lastDragPosRef.current.x) / dt;
          velRef.current = velRef.current * 0.7 + (instVel / 2) * 0.3; // smoothed normalized
        }
        lastDragPosRef.current = { x: e.clientX, time: now };

        // Lerp progress to target
        progressRef.current.value += (targetProgress - progressRef.current.value) * 0.15;

        if (onTransitionUpdate) {
          onTransitionUpdate(progressRef.current.value, dirRef.current, velRef.current);
        }
      }
    },
    [totalSlides, onTransitionUpdate]
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!dragStartRef.current) return;

      try {
        if ((e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) {
          (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
        }
      } catch {
        // Safe catch if capture wasn't held
      }

      if (stateRef.current === 'dragging') {
        const dx = e.clientX - dragStartRef.current.x;
        const dt = Math.max(1, performance.now() - dragStartRef.current.time);
        const velocity = Math.abs(dx / dt);

        const shouldCommit =
          progressRef.current.value > HERO_CONFIG.dragThreshold ||
          velocity > HERO_CONFIG.velocityThreshold;

        if (shouldCommit) {
          // Commit remaining transition distance
          busyRef.current = true;
          setHeroState('transitioning');
          const target = nextIndexRef.current;

          if (onTextTransition) {
            onTextTransition(indexRef.current, target);
          }

          gsap.to(progressRef.current, {
            value: 1,
            duration: 0.7,
            ease: 'power3.out',
            onUpdate: () => {
              if (onTransitionUpdate) {
                onTransitionUpdate(progressRef.current.value, dirRef.current, velRef.current);
              }
            },
            onComplete: () => {
              progressRef.current.value = 0;
              velRef.current = 0;
              indexRef.current = target;
              setIndex(target);
              busyRef.current = false;
              setHeroState(isPausedRef.current ? 'paused' : 'idle');

              if (onSlideChange) onSlideChange(target);
              if (onTransitionUpdate) onTransitionUpdate(0, dirRef.current, 0);
              if (!isPausedRef.current) startAutoplay();
            },
          });
        } else {
          // Spring back to 0
          gsap.to(progressRef.current, {
            value: 0,
            duration: 0.6,
            ease: 'power3.out',
            onUpdate: () => {
              if (onTransitionUpdate) {
                onTransitionUpdate(progressRef.current.value, dirRef.current, 0);
              }
            },
            onComplete: () => {
              progressRef.current.value = 0;
              velRef.current = 0;
              setHeroState(isPausedRef.current ? 'paused' : 'idle');
              if (!isPausedRef.current) startAutoplay();
            },
          });
        }
      } else {
        if (!isPausedRef.current) startAutoplay();
      }

      dragStartRef.current = null;
      lastDragPosRef.current = null;
    },
    [startAutoplay, onTextTransition, onTransitionUpdate, onSlideChange]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if active element is an input
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName || '')) return;

      if (e.key === 'ArrowRight') {
        next();
      } else if (e.key === 'ArrowLeft') {
        prev();
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePause();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [next, prev, togglePause]);

  // Tab visibility check
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (autoplayTweenRef.current) autoplayTweenRef.current.pause();
      } else if (!isPausedRef.current && stateRef.current !== 'transitioning') {
        startAutoplay();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [startAutoplay]);

  // Initial autoplay start
  useEffect(() => {
    startAutoplay();
    return () => {
      if (autoplayTweenRef.current) autoplayTweenRef.current.kill();
      if (transitionTimelineRef.current) transitionTimelineRef.current.kill();
    };
  }, [startAutoplay]);

  return {
    index,
    nextIndex,
    isPaused,
    heroState,
    go,
    next,
    prev,
    pauseAutoplay,
    resumeAutoplay,
    togglePause,
    pointerHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
    },
  };
}

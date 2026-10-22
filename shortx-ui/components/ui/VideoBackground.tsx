'use client';

import React, { useEffect, useRef, useState } from 'react';

interface VideoBackgroundProps {
  src: string;
}

export default function VideoBackground({ src }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const opacityRef = useRef<number>(0);
  const animFrameIdRef = useRef<number | null>(null);
  const fadingOutRef = useRef<boolean>(false);
  const [opacityState, setOpacityState] = useState<number>(0);

  // Custom JS requestAnimationFrame-based fade algorithm
  const animateOpacity = (targetOpacity: number, durationMs: number) => {
    if (animFrameIdRef.current !== null) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }

    const startOpacity = opacityRef.current;
    const opacityDiff = targetOpacity - startOpacity;
    if (durationMs <= 0 || opacityDiff === 0) {
      opacityRef.current = targetOpacity;
      setOpacityState(targetOpacity);
      return;
    }

    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const current = startOpacity + opacityDiff * progress;
      opacityRef.current = current;
      setOpacityState(current);

      if (progress < 1) {
        animFrameIdRef.current = requestAnimationFrame(step);
      } else {
        animFrameIdRef.current = null;
      }
    };

    animFrameIdRef.current = requestAnimationFrame(step);
  };

  const fadeIn = (durationMs = 250) => {
    fadingOutRef.current = false;
    animateOpacity(1, durationMs);
  };

  const fadeOut = (durationMs = 250) => {
    fadingOutRef.current = true;
    animateOpacity(0, durationMs);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      video.play().catch(() => {});
      fadeIn(250);
    };

    const handleTimeUpdate = () => {
      if (!video.duration || isNaN(video.duration)) return;
      const timeRemaining = video.duration - video.currentTime;
      // Trigger 250ms fade-out when 0.55s remain before video end
      if (timeRemaining <= 0.55 && !fadingOutRef.current) {
        fadeOut(250);
      }
    };

    const handleEnded = () => {
      if (animFrameIdRef.current !== null) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
      opacityRef.current = 0;
      setOpacityState(0);

      // 100ms delay, reset to currentTime = 0, play, fade back in (250ms)
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current
            .play()
            .then(() => {
              fadeIn(250);
            })
            .catch(() => {});
        }
      }, 100);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    if (video.readyState >= 2) {
      video.play().catch(() => {});
      fadeIn(250);
    }

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      if (animFrameIdRef.current !== null) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [src]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '115%',
          height: '115%',
          objectFit: 'cover',
          objectPosition: 'top',
          opacity: opacityState,
          /* NO CSS transition as requested - handled strictly via JS requestAnimationFrame */
          transition: 'none',
        }}
      />
      {/* Light subtle gradient overlay for text readability while keeping full video visibility */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.45) 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

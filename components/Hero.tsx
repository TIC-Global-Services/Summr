'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { SummrLogoWhite } from '@/assets';
import WaitlistFloat from './WaitlistFloat';
import { motion, useScroll, useTransform } from 'framer-motion';
import Product from './DeoProduct';

const Hero = () => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);

  // Track scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Smooth video playback
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateVideoTime = (time: number) => {
      const vid = videoRef.current as HTMLVideoElement | null;
      if (vid && vid.readyState >= 2) { // Ensure video is ready
        const progressValue = progress.get();
        vid.currentTime = progressValue * vid.duration;
      }
      requestAnimationFrame(updateVideoTime);
    };

    // Preload video if possible
    const vid = video as HTMLVideoElement | null;
    if (vid) {
      vid.load();
    }

    // Start animation loop
    const animationFrame = requestAnimationFrame(updateVideoTime);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [progress]);

  return (
    <div ref={containerRef} className="relative h-[200vh] w-screen">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black border-b">
        <video
          ref={videoRef}
          src="/hero-banner-bg.mp4"
          className="absolute inset-0 w-full h-full object-cover"
          muted
          playsInline
          preload="auto"
        />

        <div className="absolute inset-0 flex items-center justify-center md:z-50">
          <Product />
        </div>

        <div className="absolute inset-0 bg-black/10 z-10" />

        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
          <Image
            src={SummrLogoWhite}
            alt="Summr Logo White"
            width={120}
            height={120}
          />
        </div>

        <div className=' hidden md:block'>
          <WaitlistFloat />
        </div>

        <div className="absolute bottom-10 w-full text-center z-20 px-4">
          <h1 className="text-white uppercase text-3xl md:text-5xl lg:text-6xl font-normal">
            It’s Getting Real{' '}
            <span className="font-rofane italic">Summr</span> Real Soon.
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Hero;
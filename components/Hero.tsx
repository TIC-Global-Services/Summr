'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SummrHeroBanner, SummrLogoWhite, Deodorant } from '@/assets';
import DeodorantPng from '@/assets/Home/deodorant-png.png'

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bannerRef.current) return;

    gsap.to(bannerRef.current, {
      y: 100,
      ease: 'none',
      scrollTrigger: {
        trigger: bannerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black border-b">
      {/* Parallax Background */}
      <div
        ref={bannerRef}
        className="absolute inset-0 z-0 will-change-transform"
      >
        <Image
          src={SummrHeroBanner}
          alt="Summr Hero Banner"
          fill
          objectFit="cover"
          className=' object-cover'
          priority
        />
      </div>

      <div className='absolute inset-0 flex items-center justify-center'>
        <Image
          src={DeodorantPng}
          alt="Deodorant"
          width={350}
          height={600}
          className='object-top scale-[1.7] -rotate-12'
          priority
          quality={100}
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/10 z-10" />

      {/* Centered Logo */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
        <Image
          src={SummrLogoWhite}
          alt="Summr Logo White"
          width={120}
          height={120}
        />
      </div>

      {/* Bottom Text */}
      <div className="absolute bottom-10 w-full text-center z-20 px-4">
        <h1 className="text-white uppercase text-3xl md:text-5xl lg:text-6xl font-normal">
          It’s Getting Real{' '}
          <span className="font-rofane italic ">Summr</span> Real Soon.
        </h1>
      </div>
    </div>
  );
};

export default Hero;

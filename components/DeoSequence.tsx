'use client'
import { Deodorant } from '@/assets';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DermaIcon, GenderIcon, NaturalIcon, ResidueIcon, SmoothIcon } from '@/assets/icons';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const productDetail = [
  {
    text: '96% natural ingredients',
    icon: NaturalIcon
  },
  {
    text: 'No stains, no residue',
    icon: ResidueIcon
  },
  {
    text: 'Glides smooth with zero tackiness',
    icon: SmoothIcon
  },
  {
    text: 'Subtle, gender-neutral scent',
    icon: GenderIcon
  },
  {
    text: 'Dermatologically tested',
    icon: DermaIcon
  },
]

const DeoSequence = () => {
  const containerRef = useRef(null);
  const stickyRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const contentRef = useRef(null);
  const titleRef = useRef(null);
  const featuresRef = useRef(null);
  const descriptionRef = useRef(null);
  const canvasRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const deodorantImageRef = useRef(null);
  
  const [images, setImages] = useState([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Preload sequence images
  useEffect(() => {
    const loadImages = async () => {
      const imagePromises = [];
      for (let i = 1; i <= 150; i++) {
        const img = new window.Image();
        const paddedNumber = i.toString().padStart(4, '0');
        img.src = `/DeoSeq/pillow/${paddedNumber}.webp`;
        imagePromises.push(
          new Promise((resolve) => {
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null);
          })
        );
      }
      
      const loadedImages = await Promise.all(imagePromises);
      const validImages = loadedImages.filter((img): img is HTMLImageElement => img !== null);
      setImages(validImages as any);
      setImagesLoaded(true);
    };

    loadImages();
  }, []);

  useEffect(() => {
    if (!containerRef.current || !stickyRef.current || !leftRef.current ||
      !rightRef.current || !contentRef.current || !canvasContainerRef.current) return;

    // Create master timeline with much longer scroll distance
    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=1200vh",
        scrub: 0.5,
        pin: stickyRef.current,
        markers: false,
        anticipatePin: 1
      }
    });

    // Set initial states
    gsap.set(contentRef.current, { opacity: 0 });
    gsap.set(titleRef.current, { opacity: 0, y: 50 });
    gsap.set(featuresRef.current, { opacity: 0, y: 80 });
    gsap.set(descriptionRef.current, { opacity: 0, y: 60 });
    gsap.set(canvasContainerRef.current, { opacity: 0 });
    gsap.set(deodorantImageRef.current, { scale: 1 });

    // Phase 1: Right section expansion and deodorant image zoom
    masterTl.to(rightRef.current, {
      width: "100%",
      duration: 6,
      ease: "power2.inOut"
    }, 0)
    .to(leftRef.current, {
      opacity: 0,
      duration: 3,
      ease: "power2.inOut"
    }, 2)
    .to(deodorantImageRef.current, {
      scale: 1.2,
      duration: 6,
      ease: "power2.inOut"
    }, 0);

    // Phase 2: Content background appears
    masterTl.to(contentRef.current, {
      opacity: 1,
      duration: 1,
      ease: "power2.out"
    }, 6);

    // Phase 3: Title animation
    masterTl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 2,
      ease: "power3.out"
    }, 7);

    // Phase 4: Features list animation
    masterTl.to(featuresRef.current, {
      opacity: 1,
      y: 0,
      duration: 3,
      ease: "power3.out"
    }, 9);

    // Phase 5: Description animation
    masterTl.to(descriptionRef.current, {
      opacity: 1,
      y: 0,
      duration: 2,
      ease: "power3.out"
    }, 12);

    // Phase 6: Content fades out
    masterTl.to(contentRef.current, {
      opacity: 0,
      duration: 2,
      ease: "power2.inOut"
    }, 14);

    // Phase 7: Canvas appears
    masterTl.to(canvasContainerRef.current, {
      opacity: 1,
      duration: 1,
      ease: "power2.out"
    }, 16);

    // Image sequence animation
    if (imagesLoaded && images.length > 0) {
      const canvas = canvasRef.current as HTMLCanvasElement | null;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Set canvas size to full screen
      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      let currentFrame = 0;

      const drawFrame = (frameIndex: number) => {
        if (images[frameIndex]) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          const img = images[frameIndex] as HTMLImageElement;
          const canvasAspect = canvas.width / canvas.height;
          const imageAspect = img.width / img.height;
          
          let drawWidth, drawHeight, offsetX, offsetY;
          const scaleFactor = 1.05; // 20% larger images
          
          if (canvasAspect > imageAspect) {
            // Canvas is wider than image
            drawHeight = canvas.height * scaleFactor;
            drawWidth = drawHeight * imageAspect;
            offsetX = (canvas.width - drawWidth) / 2;
            offsetY = (canvas.height - drawHeight) / 2;
          } else {
            // Canvas is taller than image
            drawWidth = canvas.width * scaleFactor;
            drawHeight = drawWidth / imageAspect;
            offsetX = (canvas.width - drawWidth) / 2;
            offsetY = (canvas.height - drawHeight) / 2;
          }
          
          ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        }
      };

      // Image sequence timeline
      masterTl.to({}, {
        duration: 8,
        ease: "none",
        onUpdate: function() {
          const progress = this.progress();
          const frameIndex = Math.min(
            Math.floor(progress * (images.length - 1)),
            images.length - 1
          );
          
          if (frameIndex !== currentFrame) {
            currentFrame = frameIndex;
            drawFrame(frameIndex);
          }
        }
      }, 17);

      drawFrame(0);
    }

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      window.removeEventListener('resize', () => {});
    };
  }, [imagesLoaded, images]);

  return (
    <div ref={containerRef} className='relative border-b' style={{ height: '300vh' }}>
      <div ref={stickyRef} className='h-screen relative overflow-hidden'>
        <div
          ref={leftRef}
          className='absolute left-0 top-0 w-1/2 h-full flex flex-col justify-center px-6 md:px-20 z-10'
        >
          <h1 className='text-5xl md:text-7xl font-medium uppercase text-primary'>
            Feel <span className='font-rofane italic'>Fresh .</span> <br />
            <span className='font-rofane italic'>Live</span> Free
          </h1>
          <p className='text-2xl mt-6'>
            Introducing Summr—a clean, skin-loving roll-on deodorant made for everyday freshness, naturally.
          </p>
        </div>

        <div
          ref={rightRef}
          className='absolute right-0 top-0 w-1/2 h-full flex items-center justify-center z-20 bg-white border-l'
        >
          <div className='absolute inset-0 flex items-center justify-center'>
            <Image
              ref={deodorantImageRef}
              src={Deodorant}
              alt="Deodorant"
              width={400}
              height={600}
              className='object-contain w-[25%] min-w-[350px] pr-[1%] pt-[2%]'
              priority
            />
          </div>

          <div ref={contentRef} className='absolute inset-0'>
            <div ref={titleRef} className='absolute top-16 left-0 right-0 text-center px-8'>
              <h2 className='text-3xl md:text-5xl font-medium text-primary tracking-wider'>
                MEET YOUR <span className='italic font-rofane'>UNDERARMS</span> NEW BFF
              </h2>
            </div>

            <div className='absolute inset-0 flex items-center'>
              <div ref={featuresRef} className='w-1/2 flex justify-center'>
                <div className='space-y-4 max-w-sm'>
                  {productDetail.map((detail, index) => (
                    <div key={index} className='flex items-center gap-4'>
                      <span className='text-lg leading-tight'>
                        {detail.text}
                      </span>
                      <Image 
                        src={detail.icon} 
                        alt={detail.text} 
                        width={32} 
                        height={32}
                        className='flex-shrink-0'
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div ref={descriptionRef} className='w-1/2 flex justify-center items-start pt-8'>
                <div className='max-w-sm'>
                  <p className='text-base leading-relaxed'>
                    A clean, plant-powered roll-on that keeps odor in check—without aluminum, parabens, or the stickiness.
                    Lightly scented, ultra-smooth, and quick-drying, it&apos;s designed for all-day comfort even on the hottest days.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div ref={canvasContainerRef} className='absolute inset-0 z-30'>
            <canvas
              ref={canvasRef}
              className='w-full h-full object-cover'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeoSequence;
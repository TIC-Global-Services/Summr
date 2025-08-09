'use client'
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const DeoSequence = () => {
  const containerRef = useRef(null);
  const stickyRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const contentRef = useRef(null);
  const titleRef = useRef(null);
  const featuresRef = useRef(null);
  const descriptionRef = useRef(null);
  const description2Ref = useRef(null);
  const canvasRef = useRef(null);
  const canvasContainerRef = useRef(null);

  // Product text overlay refs
  const capTextRef = useRef(null);
  const caseTextRef = useRef(null);
  const refillTextRef = useRef(null);

  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Preload sequence images
  useEffect(() => {
    const loadImages = async () => {
      const imagePromises = [];
      for (let i = 1; i <= 250; i++) {
        const img = new window.Image();
        const paddedNumber = i.toString().padStart(4, '0');
        img.src = `/DeoSeq/${paddedNumber}.png`;
        imagePromises.push(
          new Promise((resolve) => {
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null);
          })
        );
      }

      const loadedImages = await Promise.all(imagePromises);
      const validImages = loadedImages.filter((img): img is HTMLImageElement => img !== null);
      setImages(validImages);
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
        end: "+=3000dvh", // Increased for slower animation
        scrub: 0.2,
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
    gsap.set(description2Ref.current, { opacity: 0, y: 60 });
    gsap.set(canvasContainerRef.current, { opacity: 1 });

    // Set initial states for product text overlays
    gsap.set([capTextRef.current, caseTextRef.current, refillTextRef.current], {
      opacity: 0,
      scale: 0.8,
      y: 20
    });

    // Phase 1: Right section expansion
    masterTl.to(rightRef.current, {
      width: "100%",
      duration: 6,
      ease: "power2.inOut"
    }, 0)
      .to(leftRef.current, {
        opacity: 0,
        duration: 3,
        ease: "power2.inOut"
      }, 2);

    // Phase 2: Content background appears
    masterTl.to(contentRef.current, {
      opacity: 1,
      duration: 1,
      ease: "power2.out"
    }, 4);

    // Phase 3: Title animation
    masterTl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 2,
      ease: "power3.out"
    }, 6);

    // Phase 4: Features list animation
    masterTl.to(featuresRef.current, {
      opacity: 1,
      y: 0,
      duration: 3,
      ease: "power3.out"
    }, 8);

    // Phase 5: Description animation
    masterTl.to(descriptionRef.current, {
      opacity: 1,
      y: 0,
      duration: 2,
      ease: "power3.out"
    }, 10);

    masterTl.to(description2Ref.current, {
      opacity: 1,
      y: 0,
      duration: 2,
      ease: "power3.out"
    }, 10);

    // Phase 6: Content fades out
    masterTl.to(contentRef.current, {
      opacity: 0,
      duration: 2,
      ease: "power2.inOut"
    }, 11);

    // Canvas setup and image sequence animation
    if (imagesLoaded && images.length > 0) {
      const canvas = canvasRef.current as HTMLCanvasElement | null;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size
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

          // Check if it's a desktop/landscape view and image is 9:16 ratio
          const isDesktop = window.innerWidth > 768;
          const is9x16Image = imageAspect < 1; // 9:16 ratio is less than 1

          let scaleFactor = 1.05; // Default scale factor

          // Apply additional zoom for 9:16 images on desktop
          if (isDesktop && is9x16Image) {
            scaleFactor = 1.5; // Increased zoom for desktop 9:16 images
          }

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

      // Single continuous image sequence animation
      masterTl.to({}, {
        duration: 50, // Total duration for the entire sequence
        ease: "none",
        onUpdate: function () {
          const progress = this.progress();
          let frameIndex;
          
          // Calculate frame index with different speeds for different ranges
          if (progress <= 0.125) { // 0 to 12.5% = frames 0-74 (fast)
            frameIndex = Math.floor((progress / 0.125) * 75);
          } else if (progress <= 0.75) { // 12.5% to 75% = frames 75-139 (very slow)
            const slowProgress = (progress - 0.125) / (0.75 - 0.125);
            frameIndex = 75 + Math.floor(slowProgress * (140 - 75));
          } else { // 75% to 100% = frames 140-end (normal)
            const fastProgress = (progress - 0.75) / (1 - 0.75);
            frameIndex = 140 + Math.floor(fastProgress * (images.length - 140));
          }
          
          frameIndex = Math.min(frameIndex, images.length - 1);

          if (frameIndex !== currentFrame) {
            currentFrame = frameIndex;
            drawFrame(frameIndex);
          }
        }
      }, 13);

      // Product text animations tied to scroll progress
      // Show text animation (frames 75-140)
      masterTl.fromTo([capTextRef.current, caseTextRef.current, refillTextRef.current], 
        {
          opacity: 0,
          scale: 0.8,
          y: 20
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out"
        }, 27); // Start when frames 75-140 section begins

      // Hide text animation (after frame 140)
      masterTl.to([capTextRef.current, caseTextRef.current, refillTextRef.current], {
        opacity: 0,
        scale: 0.8,
        y: -20,
        duration: 1,
        stagger: 0.1,
        ease: "power2.out"
      }, 42.5); // Start when frames 140+ section begins

      // Draw initial frame
      drawFrame(0);
    }

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      window.removeEventListener('resize', () => { });
    };
  }, [imagesLoaded, images]);

  return (
    <div ref={containerRef} className='relative border-b' >
      <div ref={stickyRef} className='h-screen relative overflow-hidden'>
        <div
          ref={leftRef}
          className='absolute left-0 top-0 w-1/2 h-full flex flex-col justify-center px-6 md:px-20 z-10'
        >
          <h1 className='text-5xl md:text-6xl font-medium'>
            Tested & Proven: <br />
            Fresher, Cleaner, <br />
            Better.
          </h1>
        </div>

        <div
          ref={rightRef}
          className='absolute right-0 top-0 w-1/2 h-full flex items-center justify-center z-20 bg-white border-l'
        >
          {/* Content overlay */}
          <div ref={contentRef} className='absolute inset-0 z-40'>
            <div ref={titleRef} className='absolute top-16 left-0 right-0 text-center px-8'>
              <h2 className='text-base font-medium tracking-tighter'>
                Summr keeps you fresh like any roll-on— <br />just cleaner, safer, and kinder to the <br />planet.
              </h2>
            </div>

            <div className='absolute inset-0 flex items-center'>
              <div ref={featuresRef} className='w-1/2 flex justify-center'>
                <div className='space-y-4 max-w-sm'>
                  <h1 className=' text-5xl text-center tracking-tight'>
                    96% <br />
                    natural ingredients
                  </h1>
                </div>
              </div>

              <div ref={descriptionRef} className='w-1/2 flex justify-center items-start pt-8'>
                <div className='max-w-sm'>
                  <h1 className='text-5xl text-center tracking-tight'>
                    Plant-powered, no nasties, all-day fresh.
                  </h1>
                </div>
              </div>

              <div ref={description2Ref} className=' absolute right-[10%] bottom-10'>
                <div className=' max-w-md text-xs text-right'>
                  <p>The life cycle assessment of Summr was conducted by leading sustainability experts at Anthesis. The report was third-party reviewed and completed in accordance with ISO 14040 and 14044 standards.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Canvas container - centered */}
          <div ref={canvasContainerRef} className='absolute inset-0 z-30 flex items-center justify-center'>
            <canvas
              ref={canvasRef}
              className='w-full h-full object-cover'
            />

            {/* Product Text Overlays */}
            <div className='absolute inset-0 pointer-events-none z-50'>
              {/* Cap - Top Right */}
              <div
                ref={capTextRef}
                className='absolute top-[20%] right-[10%] text-left'
              >
                <div className=' px-4 py-3 flex  items-start gap-2 justify-center '>
                  <div className=' w-[120px] h-[2px] bg-black mt-3'></div>
                  <div className=' max-w-[250px]'>
                    <h3 className='text-lg font-semibold mb-1 uppercase'>Cap</h3>
                    <p className='text-xs leading-relaxed'>
                      Leak-proof design with smooth application mechanism for perfect coverage every time.
                    </p>
                  </div>
                </div>
              </div>

              {/* Case - Left and Top Center */}
              <div
                ref={caseTextRef}
                className='absolute top-[40%] left-[15%] '
              >
                <div className=' px-4 py-3 text-right flex gap-2 justify-center'>
                  <div className=' max-w-[250px]'>
                    <h3 className='text-lg font-semibold uppercase'>Case</h3>
                    <p className='text-xs leading-relaxed'>
                      Durable aluminum housing designed to last a lifetime. Sleek, sustainable, and perfectly portable.
                    </p>
                  </div>
                  <div className=' w-[120px] h-[2px] bg-black mt-3'></div>

                </div>
              </div>

              {/* Refill - Right and Bottom */}
              <div
                ref={refillTextRef}
                className='absolute bottom-[10%] right-[22%] '
              >
                <div className=' px-4 py-3 flex  items-start gap-2 justify-center'>
                  <div className=' w-[120px] h-[2px] bg-black mt-3'></div>
                  <div className=' max-w-[250px]'>
                    <h3 className='text-lg font-semibold uppercase'>Refill</h3>
                    <p className='text-xs leading-relaxed'>
                      96% natural formula with zero plastic waste. Just pop in and you&apos;re ready to go.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeoSequence;
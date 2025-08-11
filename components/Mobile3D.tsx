import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Mobile3D: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const canvasContainerRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const stickyRef = useRef<HTMLDivElement | null>(null);

    // Product text overlay refs
    const capTextRef = useRef(null);
    const caseTextRef = useRef(null);
    const refillTextRef = useRef(null);

    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Preload sequence images
    useEffect(() => {
        const loadImages = async () => {
            try {
                const imagePromises: Promise<HTMLImageElement | null>[] = [];
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
                const validImages = loadedImages.filter(
                    (img): img is HTMLImageElement => img !== null
                );

                if (validImages.length === 0) {
                    setError('No images could be loaded.');
                    return;
                }

                setImages(validImages);
                setImagesLoaded(true);
            } catch (err) {
                setError('Failed to load images.');
                console.error('Image loading error:', err);
            }
        };

        loadImages();
    }, []);

    useEffect(() => {
        if (!containerRef.current || !stickyRef.current || !canvasContainerRef.current || !canvasRef.current) {
            setError('Required DOM elements are missing.');
            return;
        }

        if (!imagesLoaded || images.length === 0) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            setError('Canvas context not supported.');
            return;
        }

        // Set canvas to 9:16 aspect ratio
        const resizeCanvas = () => {
            const aspectRatio = 9 / 16;
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            const canvasWidth = Math.min(windowWidth, windowHeight * aspectRatio);
            const canvasHeight = canvasWidth / aspectRatio;

            canvas.width = canvasWidth * window.devicePixelRatio;
            canvas.height = canvasHeight * window.devicePixelRatio;
            canvas.style.width = `${canvasWidth}px`;
            canvas.style.height = `${canvasHeight}px`;

            // Center the canvas horizontally
            canvas.style.margin = '0 auto';
            canvas.style.display = 'block';

            // Scale context for high-DPI displays
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };

        resizeCanvas();
        const resizeHandler = () => resizeCanvas();
        window.addEventListener('resize', resizeHandler);

        // GSAP timeline setup
        const masterTl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: '+=1000vh',
                scrub: 0.2,
                pin: stickyRef.current,
                anticipatePin: 1,
            },
        });

        gsap.set(canvasContainerRef.current, { opacity: 1 });

       

        let currentFrame = 0;

        const drawFrame = (frameIndex: number) => {
            if (!images[frameIndex] || !ctx) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const img = images[frameIndex];
            const canvasAspect = canvas.width / canvas.height; // 9/16 ≈ 0.5625
            const imageAspect = img.width / img.height; // 16/9 ≈ 1.7778


            const zoomFactor = 1.25; // Zoom to fill 9:16 canvas

            const drawWidth = (canvas.width / window.devicePixelRatio) * zoomFactor;
            const drawHeight = drawWidth / imageAspect;
            const offsetX = ((canvas.width / window.devicePixelRatio) - drawWidth) / 2;
            const offsetY = ((canvas.height / window.devicePixelRatio) - drawHeight) / 2;

            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        };

        // Image sequence timeline
        masterTl.to({}, {
            duration: 20, // Total duration for the entire sequence
            ease: "none",
            onUpdate: function () {
              const progress = this.progress();
              let frameIndex;
              
              // Calculate frame index with different speeds for different ranges
              if (progress <= 0.125) { // 0 to 12.5% = frames 0-74 (fast)
                frameIndex = Math.floor((progress / 0.125) * 125);
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
          }, 2);

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
            }, 4); 

            masterTl.to([capTextRef.current, caseTextRef.current, refillTextRef.current], {
                opacity: 0,
                scale: 0.8,
                y: -20,
                duration: 1,
                stagger: 0.1,
                ease: "power2.out"
              }, 14); 

        // Draw initial frame
        drawFrame(0);

        // Cleanup
        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
            window.removeEventListener('resize', resizeHandler);
            masterTl.kill();
        };
    }, [imagesLoaded, images]);

    if (error) {
        return <div className="text-red-500 text-center p-4">Error: {error}</div>;
    }

    return (
        <div ref={containerRef} className="relative min-h-screen border-y">
            <div ref={stickyRef} className="min-h-screen">
                <div ref={canvasContainerRef} className="absolute inset-0 z-30 flex items-center justify-center">
                    <canvas
                        ref={canvasRef}
                        className="w-full h-screen object-cover"
                    />
                </div>
                {/* Product Text Overlays */}
                <div className='absolute inset-0 pointer-events-none z-50'>
                    {/* Cap - Top Right */}
                    <div
                        ref={capTextRef}
                        className='absolute top-[27%] left-[10%] text-left'
                    >
                        <div className=' px-4 py-3 flex text-right items-start gap-2 justify-center '>
                            <div className=' max-w-[100px]'>
                                <h3 className='text-[11px] font-semibold mb-1 uppercase'>Cap</h3>
                                <p className='text-[9px] leading-relaxed'>
                                    Leak-proof design with smooth application mechanism for perfect coverage every time.
                                </p>
                            </div>
                            <div className=' w-[20px] h-[2px] bg-black mt-3'></div>

                        </div>
                    </div>

                    {/* Case - Left and Top Center */}
                    <div
                        ref={caseTextRef}
                        className='absolute bottom-[40%] right-0 '
                    >
                        <div className=' px-4 py-3 text-left flex gap-2 justify-center'>
                        <div className=' w-[20px] h-[2px] bg-black mt-3'></div>

                            <div className=' max-w-[100px]'>
                                <h3 className='text-[11px] font-semibold uppercase'>Case</h3>
                                <p className='text-[9px] leading-relaxed'>
                                    Durable aluminum housing designed to last a lifetime. Sleek, sustainable, and perfectly portable.
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* Refill - Right and Bottom */}
                    <div
                        ref={refillTextRef}
                        className='absolute bottom-[20%] right-[22%] '
                    >
                        <div className=' px-4 py-3 flex  items-start gap-2 justify-center'>
                            <div className=' w-[20px] h-[2px] bg-black mt-3'></div>
                            <div className=' max-w-[100px]'>
                                <h3 className='text-[11px] font-semibold uppercase'>Refill</h3>
                                <p className='text-[9px] leading-relaxed'>
                                    96% natural formula with zero plastic waste. Just pop in and you&apos;re ready to go.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Mobile3D;
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

        gsap.set(canvasContainerRef.current, { opacity: 0 });

        masterTl.to(
            canvasContainerRef.current,
            {
                opacity: 1,
                duration: 1,
                ease: 'power2.out',
            },
            0
        );

        let currentFrame = 0;

        const drawFrame = (frameIndex: number) => {
            if (!images[frameIndex] || !ctx) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const img = images[frameIndex];
            const canvasAspect = canvas.width / canvas.height; // 9/16 ≈ 0.5625
            const imageAspect = img.width / img.height; // 16/9 ≈ 1.7778

 
            const zoomFactor = 1.5; // Zoom to fill 9:16 canvas

            const drawWidth = (canvas.width / window.devicePixelRatio) * zoomFactor;
            const drawHeight = drawWidth / imageAspect;
            const offsetX = ((canvas.width / window.devicePixelRatio) - drawWidth) / 2;
            const offsetY = ((canvas.height / window.devicePixelRatio) - drawHeight) / 2;

            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        };

        // Image sequence timeline
        masterTl.to(
            {},
            {
                duration: 2,
                ease: 'none',
                onUpdate: function () {
                    const progress = this.progress();
                    const frameIndex = Math.min(
                        Math.floor(progress * (images.length - 1)),
                        images.length - 1
                    );

                    if (frameIndex !== currentFrame) {
                        currentFrame = frameIndex;
                        drawFrame(frameIndex);
                    }
                },
            },
            0
        );

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
            </div>
        </div>
    );
};

export default Mobile3D;
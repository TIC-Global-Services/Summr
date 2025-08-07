'use client';

import { useEffect, ReactNode } from 'react';
import Lenis from 'lenis';
import { usePathname } from 'next/navigation';

export default function LenisProvider({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2, // controls the scroll speed
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            lerp: 0.1, // inertia, 0 to 1
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, [pathname]);

    return <>{children}</>;
}
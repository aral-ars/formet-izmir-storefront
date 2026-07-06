'use client';

import { ReactLenis } from 'lenis/react';
import 'lenis/dist/lenis.css';
import { useEffect, useState } from 'react';

/* Site-wide smooth scrolling.
   Lenis does *real* window scrolling (it eases the actual scrollTop rather than
   transforming a wrapper), so `position: sticky` pins and Framer's `useScroll`
   both keep working — which is exactly what the Location scrollytelling relies on.
   `lerp` is the smoothing factor per frame: lower = floatier/longer trail,
   higher = snappier. 0.1 is a calm, premium default. */
const LERP = 0.08;

export function SmoothScroll({ children }: { children: React.ReactNode }) {
    // Respect prefers-reduced-motion: lerp 1 = no easing (native, instant scroll).
    const [reduce, setReduce] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        const update = () => setReduce(mq.matches);
        update();
        mq.addEventListener('change', update);
        return () => mq.removeEventListener('change', update);
    }, []);

    return (
        <ReactLenis
            root
            options={{
                lerp: reduce ? 1 : LERP,
                smoothWheel: !reduce,
                // Touch stays native — mobile momentum already feels right and syncing it
                // tends to fight the OS. Flip syncTouch on only if you want it smoothed too.
                syncTouch: false,
            }}
        >
            {children}
        </ReactLenis>
    );
}
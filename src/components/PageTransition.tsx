'use client';

import { useEffect, useState, useCallback, createContext, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePathname, useRouter } from 'next/navigation';
import { ASSETS } from '../data';

const TransitionContext = createContext<{
  startTransition: (href: string) => void;
}>({ startTransition: () => {} });

export function usePageTransition() {
  return useContext(TransitionContext);
}

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [phase, setPhase] = useState<'enter' | 'exit'>('enter');
  const isFirstRender = useRef(true);

  const startTransition = useCallback((href: string) => {
    if (href === pathname) return;
    setPendingHref(href);
    setPhase('enter');
    setIsTransitioning(true);
  }, [pathname]);

  // After the enter animation completes, navigate via Next.js router (no reload)
  const handleEnterComplete = useCallback(() => {
    if (pendingHref && phase === 'enter') {
      router.push(pendingHref);
    }
  }, [pendingHref, phase, router]);

  // When the pathname changes (after router.push), play the exit animation
  useEffect(() => {
    // Skip the exit animation on initial page load
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setPhase('exit');
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
      setPendingHref(null);
    }, 700);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <TransitionContext.Provider value={{ startTransition }}>
      {children}

      <AnimatePresence mode="wait">
        {isTransitioning && phase === 'enter' && (
          <motion.div
            key="transition-enter"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            transition={{ duration: 0.45, ease: [0.7, 0, 0.3, 1] }}
            onAnimationComplete={handleEnterComplete}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-earth-dark"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, filter: 'blur(6px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.35, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center"
            >
              <img
                src={ASSETS.formetWordmarkWhite}
                alt="Formet"
                className="h-6 md:h-8 w-auto object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isTransitioning && phase === 'exit' && (
          <motion.div
            key="transition-exit"
            initial={{ clipPath: 'inset(0 0 0% 0)' }}
            animate={{ clipPath: 'inset(100% 0 0 0)' }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.7, 0, 0.3, 1] }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-earth-dark"
          >
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center"
            >
              <img
                src={ASSETS.formetWordmarkWhite}
                alt="Formet"
                className="h-6 md:h-8 w-auto object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  );
}

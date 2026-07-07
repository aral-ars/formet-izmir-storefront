"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Hero } from '../components/Hero';
import { Categories } from '../components/Categories';
import { Featured } from '../components/Featured';
import { Reviews } from '../components/Reviews';
import { Location } from '../components/Location';
import { FAQ } from '../components/FAQ';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';
import { ASSETS, type Product } from '../data';

type HomeClientProps = {
  products: Product[];
  categories: { id: string; name: string; image: string; description?: string; hasProducts?: boolean }[];
  reviews: { authorName: string; authorInitial: string; rating: number; date: string; text: string }[];
  faqs: { question: string; answer: string }[];
};

export function HomeClient({ products, categories, reviews, faqs }: HomeClientProps) {
  const [showSplash, setShowSplash] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  // Scale and translate the section below the hero
  const contentY = useTransform(scrollYProgress, [0, 1], [-150, 0]);
  const contentScale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);

  useEffect(() => {
    // Only show splash on first visit per session
    const hasVisited = sessionStorage.getItem('formet-visited');
    if (!hasVisited) {
      setShowSplash(true);
      sessionStorage.setItem('formet-visited', '1');
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 2800);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ clipPath: 'inset(0 0% 0 0)' }}
            exit={{ clipPath: 'inset(0 100% 0 0)' }}
            transition={{ duration: 0.8, ease: [0.7, 0, 0.3, 1] }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-sand-light"
          >
            <motion.div
              initial={{ clipPath: 'inset(0 100% 0 0)' }}
              animate={{ clipPath: 'inset(0 0% 0 0)' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: [0.7, 0, 0.3, 1] }}
              className="flex flex-col items-center justify-center"
            >
              <img
                src={ASSETS.formetWordmarkBlack}
                alt="Formet"
                className="h-8 md:h-12 w-auto object-contain mb-2"
              />
              <motion.span
                initial={{ opacity: 0, y: 5, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1.2, delay: 1, ease: [0.2, 0.6, 0.2, 1] }}
                className="font-serif italic text-earth/60 text-2xl md:text-3xl font-light tracking-normal md:tracking-wide mt-1"
              >
                Güzelbahçe
              </motion.span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-sand-light text-earth-dark selection:bg-earth selection:text-sand-light overflow-x-clip">
        <Navbar />

        {/* Hero section with higher z-index to cover the content below during parallax */}
        <div ref={heroRef} className="relative z-20 bg-sand-light">
          <Hero />
        </div>

        {/* Content below hero with parallax and scaling effect */}
        <motion.div
          className="relative z-10 bg-sand-light"
          style={{
            y: contentY,
            scale: contentScale,
            transformOrigin: "top center"
          }}
        >
          <Categories categories={categories} />
          <Featured products={products} />
          <Reviews reviews={reviews} />
          <Location />
          <FAQ faqs={faqs} />
          <Footer />
        </motion.div>
      </div>
    </>
  );
}

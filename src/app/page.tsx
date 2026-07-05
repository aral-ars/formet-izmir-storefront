"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Hero } from '../components/Hero';
import { Categories } from '../components/Categories';
import { Featured } from '../components/Featured';
import { Reviews } from '../components/Reviews';
import { Location } from '../components/Location';
import { FAQ } from '../components/FAQ';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';
import { ASSETS } from '../data';

export default function App() {
  const [showSplash, setShowSplash] = useState(false);

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
        <Hero />
        <Categories />
        <Featured />
        <Reviews />
        <Location />
        <FAQ />
        <Footer />
      </div>
    </>
  );
}

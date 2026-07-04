'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, Heart, Search, X, ArrowLeft } from 'lucide-react';
import { ASSETS } from '../data';
import { TransitionLink } from './TransitionLink';

export function ProductsNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 px-4 sm:px-6 lg:px-8 ${isScrolled ? 'py-3' : 'py-5 lg:py-6'}`}
    >
      <div className={`max-w-7xl mx-auto rounded-full px-6 py-3.5 flex items-center justify-between transition-all duration-700 ${isScrolled ? 'glass shadow-lg' : 'bg-white/70 backdrop-blur-xl border border-white/50 shadow-sm'}`}>
        
        {/* Left: Back + Logo */}
        <div className="flex items-center gap-2">
          <TransitionLink 
            href="/" 
            className="p-2 -ml-2 hover:bg-black/5 rounded-full transition-colors text-earth-dark"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-4 h-4" />
          </TransitionLink>
          <TransitionLink href="/" className="flex items-center h-4">
            <img 
              src={ASSETS.formetWordmarkBlack} 
              alt="Formet" 
              className="h-3.5 sm:h-4 w-auto object-contain"
            />
          </TransitionLink>
        </div>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          <TransitionLink href="/" className="text-sm font-medium text-earth-dark hover:text-earth transition-colors">Collections</TransitionLink>
          <TransitionLink href="/products" className="text-sm font-medium text-earth-dark hover:text-earth transition-colors border-b-2 border-earth-dark pb-0.5">Products</TransitionLink>
          <TransitionLink href="/" className="text-sm font-medium text-earth-dark hover:text-earth transition-colors">Showroom</TransitionLink>
          <TransitionLink href="/" className="text-sm font-medium text-earth-dark hover:text-earth transition-colors">FAQ</TransitionLink>
        </div>
        
        {/* Icons */}
        <div className="flex items-center space-x-2 sm:space-x-4 text-earth-dark">
          
          <div className="flex items-center">
            <AnimatePresence>
              {isSearchOpen && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 130, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    autoFocus
                    className="w-full bg-transparent border-b border-earth-dark/30 outline-none px-2 py-1 text-sm text-earth-dark placeholder:text-earth-dark/50"
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)} 
              className="p-2 hover:bg-black/10 rounded-full transition-colors cursor-pointer"
            >
              {isSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
            </button>
          </div>

          <button className="p-2 hover:bg-black/10 rounded-full transition-colors cursor-pointer">
            <Heart className="w-4 h-4" />
          </button>
          <button className="md:hidden p-2 hover:bg-black/10 rounded-full transition-colors cursor-pointer">
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.nav>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Search, X, ArrowLeft } from 'lucide-react';
import { ASSETS } from '../data';
import { TransitionLink } from './TransitionLink';
import { MobileMenu } from './MobileMenu';

export function ProductsNavbar({ overlay = false }: { overlay?: boolean }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuAnimating, setIsMenuAnimating] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuAnimating(true);
    const timer = setTimeout(() => setIsMenuAnimating(false), 850);
    return () => clearTimeout(timer);
  }, [isMenuOpen]);

  return (
    <>
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`fixed top-0 left-0 w-full z-[60] transition-all duration-500 ${(isScrolled || isMenuOpen || isMenuAnimating) ? 'bg-white py-3 md:py-3.5' : overlay ? 'bg-transparent py-4 md:py-5' : 'bg-white/70 backdrop-blur-xl border-b border-white/50 py-4 md:py-5'} ${isScrolled && !isMenuOpen && !isMenuAnimating ? 'shadow-sm border-b border-gray-100' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Left: Back + Logo */}
        <div className="flex items-center gap-2">
          <TransitionLink 
            href="/" 
            className="hidden md:flex p-2 -ml-2 hover:bg-black/5 rounded-full transition-colors text-earth-dark"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-4 h-4" />
          </TransitionLink>
          <TransitionLink href="/" className="flex items-center h-4">
            <img 
              src={ASSETS.formetWordmarkBlack} 
              alt="Formet" 
              className="h-3.5 md:h-4 w-auto object-contain"
            />
          </TransitionLink>
        </div>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          <TransitionLink href="/" className="text-sm font-medium text-earth-dark hover:text-earth transition-colors">Koleksiyonlar</TransitionLink>
          <TransitionLink href="/products" className="text-sm font-medium text-earth-dark hover:text-earth transition-colors border-b-2 border-earth-dark pb-0.5">Ürünler</TransitionLink>
          <TransitionLink href="/" className="text-sm font-medium text-earth-dark hover:text-earth transition-colors">Mağaza</TransitionLink>
          <TransitionLink href="/" className="text-sm font-medium text-earth-dark hover:text-earth transition-colors">SSS</TransitionLink>
        </div>
        
        {/* Icons */}
        <div className="flex items-center gap-1 sm:gap-2 text-earth-dark">
          
          <div className="hidden md:flex items-center">
            <div className="flex items-center mr-2">
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
                      placeholder="Ara..." 
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
          </div>

          <button className="p-2 hover:bg-black/10 rounded-full transition-colors cursor-pointer">
            <Heart className="w-4 h-4" />
          </button>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-black/10 rounded-full transition-colors cursor-pointer relative flex items-center justify-center w-10 h-10"
            aria-label="Toggle menu"
          >
            <span className={`absolute h-[1.5px] bg-current transition-all duration-300 ${isMenuOpen ? 'w-8 rotate-[15deg]' : 'w-6 -translate-y-[3px]'}`}></span>
            <span className={`absolute h-[1.5px] bg-current transition-all duration-300 ${isMenuOpen ? 'w-8 -rotate-[15deg]' : 'w-6 translate-y-[3px]'}`}></span>
          </button>
        </div>
      </div>
    </motion.nav>

      {/* Mobile Menu Overlay */}
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}

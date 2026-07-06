import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Search, X } from 'lucide-react';
import { ASSETS } from '../data';
import { MobileMenu } from './MobileMenu';

export function Navbar() {
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
      className={`fixed top-0 left-0 w-full z-[60] transition-all duration-500 ${(isScrolled || isMenuOpen || isMenuAnimating) ? 'bg-white py-3 md:py-4' : 'bg-transparent py-4 md:py-8'} ${isScrolled && !isMenuOpen && !isMenuAnimating ? 'shadow-sm' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex-shrink-0 h-4 md:h-5 flex items-center">
          <img 
            src={!(isScrolled || isMenuOpen) ? ASSETS.formetWordmarkWhite : ASSETS.formetWordmarkBlack} 
            alt="Formet" 
            className="h-full w-auto object-contain transition-all duration-500"
          />
        </div>
          
        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#collections" className={`text-sm font-medium transition-colors ${!(isScrolled || isMenuOpen) ? 'text-white hover:text-white/70' : 'text-earth-dark hover:text-earth'}`}>Koleksiyonlar</a>
          <a href="#featured" className={`text-sm font-medium transition-colors ${!(isScrolled || isMenuOpen) ? 'text-white hover:text-white/70' : 'text-earth-dark hover:text-earth'}`}>Öne Çıkanlar</a>
          <a href="#showroom" className={`text-sm font-medium transition-colors ${!(isScrolled || isMenuOpen) ? 'text-white hover:text-white/70' : 'text-earth-dark hover:text-earth'}`}>Mağaza</a>
          <a href="#faq" className={`text-sm font-medium transition-colors ${!(isScrolled || isMenuOpen) ? 'text-white hover:text-white/70' : 'text-earth-dark hover:text-earth'}`}>SSS</a>
        </div>
        
        {/* Icons */}
        <div className={`flex items-center gap-1 sm:gap-2 ${!(isScrolled || isMenuOpen) ? 'text-white' : 'text-earth-dark'}`}>
          
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
                      className={`w-full bg-transparent border-b outline-none px-2 py-1 text-sm transition-colors ${!(isScrolled || isMenuOpen) ? 'border-white/50 placeholder:text-white/50 text-white' : 'border-earth-dark/30 placeholder:text-earth-dark/50 text-earth-dark'}`}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)} 
                className="p-2 hover:bg-black/10 rounded-full transition-colors cursor-pointer"
              >
                {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button className="p-2 hover:bg-black/10 rounded-full transition-colors cursor-pointer">
            <Heart className="w-5 h-5" />
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

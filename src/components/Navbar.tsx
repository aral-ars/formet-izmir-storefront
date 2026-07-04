import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, Heart, Search, X } from 'lucide-react';
import { ASSETS } from '../data';

export function Navbar() {
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
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 px-4 sm:px-6 lg:px-8 ${isScrolled ? 'py-4' : 'py-8 lg:py-12'}`}
    >
      <div className={`max-w-7xl mx-auto rounded-full px-6 py-4 flex items-center justify-between transition-all duration-700 ${isScrolled ? 'glass' : 'bg-transparent'}`}>
        
        {/* Logo */}
        <div className="flex-shrink-0 h-5 sm:h-6 flex items-center">
          <img 
            src={!isScrolled ? ASSETS.formetWordmarkWhite : ASSETS.formetWordmarkBlack} 
            alt="Formet" 
            className="h-full w-auto object-contain transition-all duration-500"
          />
        </div>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#collections" className={`text-sm font-medium transition-colors ${!isScrolled ? 'text-white hover:text-white/70' : 'text-earth-dark hover:text-earth'}`}>Collections</a>
          <a href="#featured" className={`text-sm font-medium transition-colors ${!isScrolled ? 'text-white hover:text-white/70' : 'text-earth-dark hover:text-earth'}`}>Featured</a>
          <a href="#showroom" className={`text-sm font-medium transition-colors ${!isScrolled ? 'text-white hover:text-white/70' : 'text-earth-dark hover:text-earth'}`}>Showroom</a>
          <a href="#faq" className={`text-sm font-medium transition-colors ${!isScrolled ? 'text-white hover:text-white/70' : 'text-earth-dark hover:text-earth'}`}>FAQ</a>
        </div>
        
        {/* Icons */}
        <div className={`flex items-center space-x-2 sm:space-x-4 ${!isScrolled ? 'text-white' : 'text-earth-dark'}`}>
          
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
                    className={`w-full bg-transparent border-b outline-none px-2 py-1 text-sm transition-colors ${!isScrolled ? 'border-white/50 placeholder:text-white/50 text-white' : 'border-earth-dark/30 placeholder:text-earth-dark/50 text-earth-dark'}`}
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

          <button className="p-2 hover:bg-black/10 rounded-full transition-colors cursor-pointer">
            <Heart className="w-5 h-5" />
          </button>
          <button className="md:hidden p-2 hover:bg-black/10 rounded-full transition-colors cursor-pointer">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.nav>
  );
}

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Search, X } from 'lucide-react';
import { ASSETS } from '../data';
import { MobileMenu } from './MobileMenu';
import { TransitionLink } from './TransitionLink';
import { DesktopNav } from './NavMenu';

export function Navbar({ forceDarkText = false }: { forceDarkText?: boolean } = {}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuAnimating, setIsMenuAnimating] = useState(false);
  // True while a desktop mega-menu panel is open — solidifies the bar so the
  // panel reads cleanly even over the transparent hero.
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const isInitialRender = useRef(true);

  const useDarkText = forceDarkText || isScrolled || isMenuOpen;
  const isSolid = isScrolled || isMenuOpen || isMenuAnimating;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    
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
      className={`fixed top-0 left-0 w-full z-[60] transition-all duration-500 ${isSolid ? 'bg-white' : 'bg-transparent'} ${isScrolled ? 'py-3 md:py-4' : 'pt-4 md:pt-8 pb-3 md:pb-4'} ${isScrolled && !isMenuOpen && !isMenuAnimating ? 'shadow-sm' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Logo */}
        <TransitionLink href="/" className="flex-shrink-0 h-4 md:h-5 flex items-center cursor-pointer">
          <img 
            src={!useDarkText ? ASSETS.formetWordmarkWhite : ASSETS.formetWordmarkBlack} 
            alt="Formet" 
            className="h-full w-auto object-contain transition-all duration-500"
          />
        </TransitionLink>
          
        {/* Desktop Links + mega-menus */}
        <DesktopNav useDarkText={useDarkText} onOpenChange={setIsNavMenuOpen} />
        
        {/* Icons */}
        <div className={`flex items-center gap-1 sm:gap-2 ${!useDarkText ? 'text-white' : 'text-earth-dark'}`}>
          
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
                      className={`w-full bg-transparent border-b outline-none px-2 py-1 text-sm transition-colors ${!useDarkText ? 'border-white/50 placeholder:text-white/50 text-white' : 'border-earth-dark/30 placeholder:text-earth-dark/50 text-earth-dark'}`}
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

import { motion, AnimatePresence } from 'motion/react';
import { ASSETS } from '../data';
import { TransitionLink } from './TransitionLink';
import { ArrowRightCircle, ArrowUpRight } from 'lucide-react';
import { useEffect } from 'react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const itemVariants = {
  hidden: { y: '100%' },
  visible: (i: number) => ({
    y: '0%',
    transition: {
      duration: 0.65,
      delay: 0.45 + i * 0.1,
      ease: [0.33, 1, 0.68, 1] as [number, number, number, number]
    }
  }),
  exit: {
    y: '0%',
    transition: {
      duration: 0.85,
      ease: [0.76, 0, 0.24, 1] as [number, number, number, number]
    }
  }
};

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          
          {/* Background and Footer Slider */}
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] as [number, number, number, number] }}
            className="absolute inset-0 bg-white flex flex-col justify-end pb-8 text-earth-dark pt-20"
          >
            {/* Bottom Info - Rides the slide down */}
            <motion.div 
              className="flex flex-col items-center space-y-4 text-sm font-sans shrink-0 mt-auto"
            >
              <p className="text-lg md:text-xl">+90 532 456 78 90</p>
              
              <div className="flex items-center gap-3 text-xl md:text-2xl font-medium border-b-2 border-black pb-1 group cursor-pointer hover:text-earth hover:border-earth transition-colors">
                <ArrowRightCircle className="w-6 h-6 md:w-7 md:h-7 fill-black text-white group-hover:fill-earth transition-colors" />
                <a href="mailto:hello@formet.com">hello@formet.com</a>
              </div>
              
              <div className="flex space-x-8 text-earth font-medium pt-2">
                <a href="#" className="hover:text-black transition-colors">Gizlilik Politikası</a>
                <a href="#" className="hover:text-black transition-colors">Hizmet Şartları</a>
              </div>
              
              {/* Language Selector */}
              <div className="flex items-center space-x-3 text-base font-medium mt-1">
                <button className="text-black underline underline-offset-4">EN</button>
                <span className="text-gray-300">|</span>
                <button className="text-gray-400 hover:text-black transition-colors">TR</button>
              </div>
              
              <p className="text-earth/60 mt-4 text-sm">© 2026 Formet Tüm Hakları Saklıdır</p>
            </motion.div>
          </motion.div>

          {/* Menu Links Layer */}
          <motion.div 
            initial={{ y: '0%' }}
            animate={{ y: '0%' }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] as [number, number, number, number] }}
            className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center pt-24 pb-[300px] md:pb-[320px]"
          >
            <div className="flex flex-col items-center justify-center space-y-4 md:space-y-6">
              {['Koleksiyonlar', 'Öne Çıkanlar', 'Mağaza', 'SSS'].map((item, index) => (
                <div key={item} className="overflow-hidden px-2 pt-1 pb-2 -mb-2 pointer-events-auto">
                  <motion.div
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={itemVariants}
                  >
                    <TransitionLink 
                      href={item === 'Koleksiyonlar' || item === 'Öne Çıkanlar' ? '/' : (item === 'Mağaza' ? '/showroom' : '/faq')} 
                      onClick={onClose} 
                      className="text-5xl md:text-6xl font-display font-medium tracking-tight hover:text-earth transition-colors block leading-none text-earth-dark"
                    >
                      {item}
                    </TransitionLink>
                  </motion.div>
                </div>
              ))}
              
              {/* WhatsApp Link */}
              <div className="overflow-hidden px-2 pt-1 pb-2 -mb-2 pointer-events-auto">
                <motion.div
                  custom={4}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={itemVariants}
                >
                  <a 
                    href="https://wa.me/905324567890" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="group flex items-center gap-2 text-5xl md:text-6xl font-display font-medium tracking-tight text-green-600 hover:text-green-700 transition-colors leading-none block"
                  >
                    <div className="flex items-center gap-1">
                      <span>WhatsApp</span>
                      <ArrowUpRight className="w-8 h-8 md:w-10 md:h-10 text-gray-300 group-hover:text-gray-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" strokeWidth={2.5} />
                    </div>
                  </a>
                </motion.div>
              </div>
            </div>
          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
}

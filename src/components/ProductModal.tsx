import { X, Heart, Share2, Check, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence, useDragControls, PanInfo } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { TransitionLink } from './TransitionLink';

interface ProductModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [hasSwiped, setHasSwiped] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const dragControls = useDragControls();
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!hasSwiped) setHasSwiped(true);
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.clientWidth;
    const newIndex = Math.round(scrollLeft / width);
    if (newIndex !== activeImage) {
      setActiveImage(newIndex);
    }
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onClose();
    }
  };

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

  if (!product) return null;

  const images = product.images || [product.image];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-earth-dark/40 backdrop-blur-[2px] z-[70]"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={handleDragEnd}
            className="fixed inset-x-0 bottom-0 z-[70] bg-sand-light rounded-t-3xl max-h-[90vh] flex flex-col md:block md:overflow-y-auto overflow-hidden"
          >
            {/* Absolute Drag Handle (Mobile) */}
            <div className="absolute top-0 inset-x-0 z-30 flex justify-center md:hidden pt-4 pb-4 pointer-events-none">
              <div 
                className="w-12 h-1.5 bg-white/90 rounded-full touch-none cursor-grab active:cursor-grabbing pointer-events-auto shadow-md"
                onPointerDown={(e) => dragControls.start(e)}
                onClick={onClose}
              />
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto md:p-8">
              <div className="max-w-5xl mx-auto">
                {/* Desktop Header */}
                <div className="hidden md:flex justify-between items-center mb-6">
                  <span className="text-earth/60 font-medium uppercase tracking-wider text-sm">
                    {product.category === 'details' ? 'Accessories' : product.category}
                  </span>
                  <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                    <X className="w-6 h-6 text-earth-dark" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
                  <div className="space-y-4 md:space-y-4">
                    <div className="relative w-full overflow-hidden md:rounded-2xl">
                      <div 
                        ref={carouselRef}
                        onScroll={handleScroll}
                        className="flex overflow-x-auto snap-x snap-mandatory w-full bg-sand [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                      >
                        {images.map((img: string, idx: number) => (
                          <div key={idx} className="aspect-[4/3] flex-shrink-0 w-full snap-center relative">
                            <img 
                              src={img} 
                              alt={`${product.name} ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Top Right Like Button */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsLiked(!isLiked);
                        }}
                        className={`absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full glass shadow-lg transition-all duration-300 cursor-pointer ${
                          isLiked 
                            ? 'text-red-500 hover:scale-110 active:scale-95' 
                            : 'text-earth-dark hover:text-red-500 hover:scale-110 active:scale-95'
                        }`}
                      >
                        <Heart className="w-4 h-4" fill={isLiked ? "currentColor" : "none"} />
                      </button>

                      {/* Swipe Dots Indicator */}
                      {images.length > 1 && hasSwiped && (
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none animate-in fade-in duration-500">
                          {images.map((_: any, idx: number) => (
                            <div 
                              key={idx} 
                              className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${activeImage === idx ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col px-5 md:px-0 pb-6 md:pb-0">
                    <div className="flex justify-between items-start gap-4">
                      <h2 className="text-[20px] md:text-3xl font-display font-medium text-earth-dark">
                        {product.name}
                      </h2>
                      <div className="font-sans font-normal text-lg md:text-xl text-earth/60 whitespace-nowrap pt-0.5 md:pt-1">
                        {product.price}
                      </div>
                    </div>

                    <div className="hidden md:block mt-6">
                      <p className="text-earth/80 leading-relaxed mb-8">
                        {product.description || "Eksiksiz yemek deneyimi. Bu özenle seçilmiş set, tamamı aynı mimari alüminyum estetiğini paylaşan Yemek Masası ve uyumlu sandalyeleri içerir."}
                      </p>

                      <div className="flex flex-col gap-3 mb-8">
                        <div className="flex items-center space-x-3 text-earth-dark text-sm">
                          <Check className="w-5 h-5 text-earth/60" />
                          <span>5 Yıl Garanti</span>
                        </div>
                        <div className="flex items-center space-x-3 text-earth-dark text-sm">
                          <Check className="w-5 h-5 text-earth/60" />
                          <span>Ücretsiz Teslimat</span>
                        </div>
                        <div className="flex items-center space-x-3 text-earth-dark text-sm">
                          <Check className="w-5 h-5 text-earth/60" />
                          <span>Montaj Dahil</span>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Footer (Inline) */}
                    <div className="hidden md:flex mt-auto md:mt-12 gap-4">
                      <a 
                        href={`https://wa.me/905555555555?text=${encodeURIComponent(`Hi! I'm interested in ordering the ${product.name} (${product.price}).`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center bg-earth-dark text-white py-4 rounded-full font-medium hover:bg-earth transition-colors"
                      >
                        WhatsApp ile Sipariş Ver
                      </a>
                      <TransitionLink 
                        href={`/products/${product.id}`}
                        onClick={onClose}
                        className="p-4 rounded-full border border-earth/20 hover:border-earth-dark transition-colors flex items-center justify-center"
                      >
                        <ArrowRight className="w-6 h-6 text-earth-dark" />
                      </TransitionLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Footer (Pinned) */}
            <div className="flex-shrink-0 bg-sand-light/95 backdrop-blur-xl z-30 p-5 border-t border-earth/10 md:hidden flex gap-4">
              <a 
                href={`https://wa.me/905555555555?text=${encodeURIComponent(`Hi! I'm interested in ordering the ${product.name} (${product.price}).`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center bg-earth-dark text-white py-4 rounded-full font-medium hover:bg-earth transition-colors"
              >
                WhatsApp ile Sipariş Ver
              </a>
              <TransitionLink 
                href={`/products/${product.id}`}
                onClick={onClose}
                className="p-4 rounded-full border border-earth/20 hover:border-earth-dark transition-colors bg-sand-light flex items-center justify-center"
              >
                <ArrowRight className="w-6 h-6 text-earth-dark" />
              </TransitionLink>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

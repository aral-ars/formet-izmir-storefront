import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { PRODUCTS, formatPrice } from '../data';
import { ArrowUpRight } from 'lucide-react';
import { TextReveal, LineReveal } from './TextReveal';
import { TransitionLink } from './TransitionLink';
import { ProductModal } from './ProductModal';
import { LikeButton } from './LikeButton';
import { PillButton } from './PillButton';

export function Featured() {
  const [likedProducts, setLikedProducts] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const featured = PRODUCTS.slice(0, 9); // Display up to 9 products

  const toggleLike = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setLikedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Parallax logic
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const yMiddle = useTransform(scrollYProgress, [0, 1], [-80, 80]);
  const yRight = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const yNone = useTransform(scrollYProgress, [0, 1], [0, 0]);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getParallaxY = (index: number) => {
    if (isMobile) return yNone; // Remove parallax on mobile
    
    // Desktop:
    // Middle column: starts higher, ends lower
    if (index % 3 === 1) return yMiddle;
    // Right column: slight effect, moves up
    if (index % 3 === 2) return yRight;
    // Left column: static
    return yNone;
  };

  return (
    <section id="featured" className="py-24" ref={containerRef}>
      <div className="max-w-7xl mx-auto px-3 md:px-6 lg:px-8">
        <div className="text-center mb-16">
          <TextReveal
            as="h2"
            className="text-3xl md:text-5xl font-display font-semibold mb-4 tracking-[-0.02em]"
            accentWords={['İmza']}
          >
            İmza Parçalar
          </TextReveal>
          <LineReveal className="text-lg text-earth/80 max-w-2xl mx-auto tracking-wide" delay={0.2}>
            Hassasiyetle tasarlanmış ve en iyi organik malzemelerden üretilmiş ikonik tasarımlar.
          </LineReveal>
        </div>

        <div className="relative">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 md:gap-8 pt-4 pb-12">
            {featured.map((product, index) => {
              const isLiked = likedProducts.includes(product.id.toString());

              return (
                <motion.div
                  key={product.id}
                  style={{ y: getParallaxY(index) }}
                  className={index === 8 ? "hidden md:block" : ""}
                >
                  <div className="h-full">
                    <TransitionLink 
                      href={`/products/${product.slug}`}
                      className="block h-full select-none"
                      draggable={false}
                    >
                      <div className="relative md:bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:border md:border-earth/5 group cursor-pointer flex flex-col h-full transition-all hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 overflow-hidden">

                        {/* Expanding Image Section */}
                        <div className="absolute inset-0 md:left-2 md:right-2 md:bottom-2 md:top-[72px] rounded-[1.5rem] md:group-hover:inset-0 md:group-hover:rounded-[2rem] transition-all duration-700 ease-out overflow-hidden z-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            draggable={false}
                            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
                          />
                          <div className="absolute inset-0 bg-black/0 md:group-hover:bg-black/20 transition-colors duration-700" />
                        </div>

                        {/* Top Bar - relative to stay on top, transparent background */}
                        <div className="relative z-10 flex justify-between items-start md:items-center px-4 md:px-7 pt-4 md:pt-0 md:h-[72px] text-earth-dark md:group-hover:text-white transition-colors duration-500">
                          <div className="flex flex-col items-start overflow-hidden pr-2">
                            <h3 className="font-display font-medium text-[15px] md:text-[20px] tracking-tight truncate text-earth-dark md:group-hover:text-white transition-colors duration-500 leading-tight">{product.name}.</h3>
                            <div className="md:hidden mt-1.5 bg-earth-dark/90 backdrop-blur-md text-white px-1.5 py-0.5 rounded-full font-sans font-medium text-[8px] tracking-wider uppercase shadow-sm">
                              {product.tag}
                            </div>
                          </div>

                          {/* Animated Icon (Glass Arrow on mobile, 3 Dots -> Arrow on Desktop) */}
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setSelectedProduct(product);
                            }}
                            className="relative w-7 h-7 md:w-10 md:h-10 flex items-center justify-center transition-all duration-500 cursor-pointer z-20 group/btn flex-shrink-0"
                          >
                            {/* Glass Background (permanent on mobile, animates in on desktop hover) */}
                            <div className="absolute inset-0 rounded-full glass opacity-100 scale-100 md:opacity-0 md:scale-50 md:group-hover/btn:opacity-100 md:group-hover/btn:scale-100 transition-all duration-300 shadow-sm md:shadow-none" />

                            {/* 3 Dots (Desktop Only) */}
                            <div className="hidden md:flex absolute inset-0 space-x-1 items-center justify-center transition-all duration-500 opacity-20 group-hover:opacity-0 group-hover:scale-50 group-hover:rotate-45 pointer-events-none text-earth-dark">
                              <div className="w-1 h-1 rounded-full bg-current"></div>
                              <div className="w-1 h-1 rounded-full bg-current"></div>
                              <div className="w-1 h-1 rounded-full bg-current"></div>
                            </div>

                            {/* Arrow Icon */}
                            <div className="absolute inset-0 flex items-center justify-center transition-all duration-500 opacity-100 scale-100 rotate-0 md:opacity-0 md:scale-50 md:-rotate-45 md:group-hover:opacity-100 md:group-hover:scale-100 md:group-hover:rotate-0 pointer-events-none z-10">
                              <ArrowUpRight className="w-3.5 h-3.5 md:w-5 md:h-5 stroke-[2.5] md:stroke-2 text-earth-dark md:group-hover:text-white md:group-hover/btn:text-earth-dark transition-colors duration-300" />
                            </div>
                          </button>
                        </div>

                        {/* Invisible spacer to give the card its aspect ratio since image is absolute */}
                        <div className="relative z-0 w-full aspect-[4/3] md:aspect-[4/5] pointer-events-none mt-2"></div>

                        {/* Like Button */}
                        <LikeButton 
                          isLiked={isLiked} 
                          onClick={(e) => toggleLike(e, product.id.toString())} 
                          className="absolute bottom-4 right-4 md:bottom-6 md:right-6 w-7 h-7 md:w-9 md:h-9"
                        />

                        {/* Tag & Price Container */}
                        <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 flex items-center z-10 transition-all duration-500 gap-0 md:group-hover:gap-2">
                          <div className="glass rounded-full font-sans font-normal text-xs md:text-base tracking-wide text-earth-dark whitespace-nowrap overflow-hidden transition-all duration-500 max-w-[120px] opacity-100 px-2 md:px-0 md:max-w-0 md:opacity-0 md:group-hover:max-w-[120px] md:group-hover:opacity-100 flex items-center h-7 md:h-9 md:group-hover:px-4 shadow-sm">
                            {formatPrice(product.price)}
                          </div>
                          <div className="hidden md:flex glass px-3.5 rounded-full font-sans font-medium text-[11px] tracking-widest uppercase text-earth-dark transition-all duration-500 items-center h-9">
                            {product.tag}
                          </div>
                        </div>
                      </div>
                    </TransitionLink>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="flex justify-center mt-12 md:mt-16">
            <PillButton href="/products">
              Tüm Ürünleri Keşfet
            </PillButton>
          </div>
        </div>
      </div>

      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  );
}

import { useState } from 'react';
import { motion } from 'motion/react';
import { PRODUCTS } from '../data';
import { Heart, ArrowUpRight } from 'lucide-react';
import { TextReveal, LineReveal } from './TextReveal';
import { TransitionLink } from './TransitionLink';
import { ProductModal } from './ProductModal';

export function Featured() {
  const [likedProducts, setLikedProducts] = useState<number[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  // Show first 3 products on homepage
  const featured = PRODUCTS.slice(0, 3);

  const toggleLike = (e: React.MouseEvent, productId: number) => {
    e.preventDefault();
    e.stopPropagation();
    setLikedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <section id="featured" className="py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <TextReveal
            as="h2"
            className="text-3xl md:text-5xl font-display font-semibold mb-4 tracking-[-0.02em]"
            accentWords={['İmza']}
          >
            İmza Parçalar
          </TextReveal>
          <LineReveal className="text-lg text-earth/80 max-w-2xl mx-auto tracking-wide" delay={0.2}>
            Hassasiyetle tasarlanmış ve en iyi organik malzemelerden üretilmiş ikonik tasarımlar.
          </LineReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((product, index) => {
            const isLiked = likedProducts.includes(product.id);
            
            return (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              >
                <TransitionLink href={`/products/${product.id}`} className="block h-full">
                  <div className="relative bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-earth/5 group cursor-pointer flex flex-col h-full transition-all hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 overflow-hidden">
                    
                    {/* Expanding Image Section */}
                    <div className="absolute left-2 right-2 bottom-2 top-[72px] rounded-[1.5rem] group-hover:left-0 group-hover:right-0 group-hover:bottom-0 group-hover:top-0 group-hover:rounded-[2rem] transition-all duration-700 ease-out overflow-hidden z-0">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="absolute inset-0 w-full h-full object-cover object-center"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-700" />
                    </div>

                    {/* Top Bar - relative to stay on top, transparent background */}
                    <div className="relative z-10 flex justify-between items-center px-7 h-[72px] text-earth-dark group-hover:text-white transition-colors duration-500">
                      <div className="flex items-baseline">
                        <h3 className="font-display font-medium text-[20px] tracking-tight">{product.name}.</h3>
                      </div>
                      
                      {/* Animated Icon (Dots -> Arrow) */}
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedProduct(product);
                        }}
                        className="relative w-10 h-10 -mr-2 flex items-center justify-center transition-all duration-500 cursor-pointer z-20 group/btn"
                      >
                        {/* Glass Background (animates in on button hover) */}
                        <div className="absolute inset-0 rounded-full glass opacity-0 scale-50 group-hover/btn:opacity-100 group-hover/btn:scale-100 transition-all duration-300" />
                        
                        {/* 3 Dots */}
                        <div className="absolute inset-0 flex space-x-1 items-center justify-center transition-all duration-500 opacity-20 group-hover:opacity-0 group-hover:scale-50 group-hover:rotate-45 pointer-events-none">
                          <div className="w-1 h-1 rounded-full bg-current"></div>
                          <div className="w-1 h-1 rounded-full bg-current"></div>
                          <div className="w-1 h-1 rounded-full bg-current"></div>
                        </div>
                        
                        {/* Arrow Icon */}
                        <div className="absolute inset-0 flex items-center justify-center transition-all duration-500 opacity-0 scale-50 -rotate-45 group-hover:opacity-100 group-hover:scale-100 group-hover:rotate-0 group-hover/btn:text-earth-dark pointer-events-none z-10">
                          <ArrowUpRight className="w-5 h-5 stroke-2" />
                        </div>
                      </button>
                    </div>

                    {/* Invisible spacer to give the card its aspect ratio since image is absolute */}
                    <div className="relative z-0 w-full aspect-square sm:aspect-[4/5] pointer-events-none mt-2"></div>
                    
                    {/* Like Button */}
                    <button
                      onClick={(e) => toggleLike(e, product.id)}
                      className={`absolute bottom-6 right-6 w-9 h-9 flex items-center justify-center rounded-full glass shadow-lg transition-all duration-500 z-10 cursor-pointer ${
                        isLiked 
                          ? 'opacity-100 translate-y-0 text-red-500 hover:scale-110 active:scale-95' 
                          : 'opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 text-earth-dark hover:text-red-500 hover:scale-110 active:scale-95'
                      }`}
                    >
                      <Heart className="w-4 h-4" fill={isLiked ? "currentColor" : "none"} />
                    </button>
                    
                    {/* Tag & Price Container */}
                    <div className="absolute bottom-6 left-6 flex items-center z-10 transition-all duration-500 gap-0 group-hover:gap-2">
                      <div className="glass rounded-full font-sans font-normal text-base tracking-wide text-earth-dark whitespace-nowrap overflow-hidden transition-all duration-500 max-w-0 opacity-0 group-hover:max-w-[120px] group-hover:opacity-100 flex items-center h-9 px-0 group-hover:px-4">
                        {product.price}
                      </div>
                      <div className="glass px-3.5 rounded-full font-sans font-medium text-[11px] tracking-widest uppercase text-earth-dark transition-all duration-500 flex items-center h-9">
                        {product.tag}
                      </div>
                    </div>
                  </div>
                </TransitionLink>
              </motion.div>
            );
          })}
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

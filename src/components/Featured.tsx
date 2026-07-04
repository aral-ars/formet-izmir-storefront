import { useState } from 'react';
import { motion } from 'motion/react';
import { PRODUCTS } from '../data';
import { Plus } from 'lucide-react';
import { TextReveal, LineReveal } from './TextReveal';
import { SpotlightCard } from './SpotlightCard';
import { TransitionLink } from './TransitionLink';
import { ProductModal } from './ProductModal';

export function Featured() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  // Show first 3 products on homepage
  const featured = PRODUCTS.slice(0, 3);

  return (
    <section id="featured" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <TextReveal
            as="h2"
            className="text-3xl md:text-5xl font-display font-semibold mb-4 tracking-[-0.02em]"
            accentWords={['signature']}
          >
            Signature Pieces
          </TextReveal>
          <LineReveal className="text-lg text-earth/80 max-w-2xl mx-auto tracking-wide" delay={0.2}>
            Iconic designs engineered with precision and crafted from the finest organic materials.
          </LineReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((product, index) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
            >
              <TransitionLink href={`/products/${product.id}`}>
                <SpotlightCard
                  className="bg-sand-light rounded-3xl p-6 group cursor-pointer"
                  spotlightColor="rgba(74, 68, 59, 0.06)"
                  spotlightSize={400}
                >
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-sand mb-6">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 glass px-3 py-1 rounded-full text-xs font-medium tracking-wide">
                      {product.tag}
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedProduct(product);
                      }}
                      className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-earth-dark hover:text-white cursor-pointer"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-display font-medium tracking-tight">{product.name}</h3>
                    <span className="text-lg font-medium text-earth/60">{product.price}</span>
                  </div>
                </SpotlightCard>
              </TransitionLink>
            </motion.div>
          ))}
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

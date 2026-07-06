import { motion } from 'motion/react';
import { CATEGORIES } from '../data';
import { ArrowRight, Plus } from 'lucide-react';

export function Categories() {
  const displayCategories = CATEGORIES.slice(0, 5);

  const getCardStyle = (index: number) => {
    // 0: Far Left, 1: Left, 2: Center, 3: Right, 4: Far Right
    const styles = [
      { rotate: -12, y: '15%', x: '-110%', zIndex: 10 },
      { rotate: -6, y: '5%', x: '-55%', zIndex: 20 },
      { rotate: 0, y: '0%', x: '0%', zIndex: 30, scale: 1.05 },
      { rotate: 6, y: '5%', x: '55%', zIndex: 20 },
      { rotate: 12, y: '15%', x: '110%', zIndex: 10 },
    ];
    return styles[index] || styles[2];
  };

  return (
    <div className="px-1.5 pb-1.5 h-auto lg:h-[100dvh]">
      <section id="collections" className="relative w-full h-full rounded-3xl bg-sand/30 overflow-hidden flex flex-col items-center justify-center py-16 lg:py-8 px-6 lg:px-8">
      
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-earth/10 text-earth text-sm font-medium mb-6 lg:mb-8"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Koleksiyonlarımız</span>
        </motion.div>

      {/* Heading */}
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-4xl md:text-5xl font-display font-medium text-center text-earth-dark max-w-3xl mb-10 lg:mb-12 leading-tight tracking-tight"
      >
        Dış mekandan iç mekana — <br className="hidden md:block" />
        <span className="italic font-serif font-light">zahmetsizce</span>
      </motion.h2>

      {/* Fanned Cards */}
      <div className="relative w-full max-w-5xl h-[340px] md:h-[420px] flex justify-center items-center mb-10 lg:mb-12">
        {displayCategories.map((category, index) => {
          const style = getCardStyle(index);
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: '50%', x: '0%', rotate: 0 }}
              whileInView={{ 
                opacity: 1, 
                y: style.y, 
                x: style.x,
                rotate: style.rotate,
                scale: style.scale || 1
              }}
              whileHover={{
                y: `calc(${style.y} - 20px)`,
                scale: (style.scale || 1) + 0.02,
                transition: { duration: 0.3 }
              }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ 
                duration: 1, 
                delay: index * 0.1, 
                ease: [0.21, 0.47, 0.32, 0.98] 
              }}
              className="absolute w-[180px] md:w-[240px] h-[280px] md:h-[340px] rounded-2xl md:rounded-3xl overflow-hidden bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-earth/5 flex flex-col cursor-pointer"
              style={{ zIndex: style.zIndex }}
            >
              {/* Image Section */}
              <div className="relative flex-1 w-full overflow-hidden shrink-0">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-[150%] object-cover object-top"
                />
                {/* Gradient to blend image into white card */}
                <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-white to-white/0" />
              </div>
              
              {/* Text Section */}
              <div className="relative bg-white px-4 pt-3 pb-4 md:px-5 md:pt-4 md:pb-5 flex flex-col justify-start h-[90px] md:h-[100px] shrink-0 z-10 -mt-px">
                <h3 className="text-lg md:text-xl font-serif italic mb-1 text-earth-dark leading-tight">{category.name}</h3>
                <p className="text-xs text-earth/70 leading-relaxed font-light line-clamp-2">{category.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Action Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="group flex items-center bg-earth-dark text-white rounded-full pl-6 pr-2 py-2 hover:bg-earth transition-colors shadow-lg shadow-earth-dark/20"
      >
        <span className="text-sm font-medium mr-4">Koleksiyonları keşfet</span>
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white text-earth-dark flex items-center justify-center group-hover:scale-105 transition-transform">
          <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
        </div>
      </motion.button>

      </section>
    </div>
  );
}

import { motion } from 'motion/react';
import { CATEGORIES } from '../data';
import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { TextReveal, LineReveal } from './TextReveal';

export function Categories() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -carouselRef.current.offsetWidth : carouselRef.current.offsetWidth;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section id="collections" className="py-24 px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <TextReveal as="h2" className="text-3xl md:text-5xl font-display font-semibold mb-4 tracking-[-0.02em]" accentWords={['outdoors']}>
            Curated for the outdoors.
          </TextReveal>
          <LineReveal className="text-lg text-earth/80 max-w-md tracking-wide" delay={0.3}>
            Discover our meticulously designed collections that bring interior comfort to your exterior spaces.
          </LineReveal>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => scroll('left')}
            className="p-3 rounded-full border border-earth/20 text-earth hover:bg-earth hover:text-white transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="p-3 rounded-full border border-earth/20 text-earth hover:bg-earth hover:text-white transition-colors cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
      >
        <div 
          ref={carouselRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`flex overflow-x-auto gap-6 lg:gap-8 pb-12 no-scrollbar -mx-6 px-6 lg:-mx-8 lg:px-8 select-none cursor-grab active:cursor-grabbing ${isDragging ? '' : 'snap-x snap-mandatory scroll-smooth'}`}
        >
          {CATEGORIES.map((category) => (
            <div 
              key={category.id}
              className="group snap-start shrink-0 w-[85vw] sm:w-[60vw] md:w-[40vw] lg:w-[30vw] pointer-events-none sm:pointer-events-auto"
            >
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-sand">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
                <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                  <div className="transform transition-transform duration-500 group-hover:-translate-y-4">
                    <h3 className="text-2xl font-display font-medium mb-2">{category.name}</h3>
                    <p className="text-white/80 text-sm mb-0 sm:mb-4 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{category.description}</p>
                  </div>
                  
                  <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-150">
                    <span className="text-sm font-medium tracking-wider uppercase">Explore</span>
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                      <ArrowRight className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

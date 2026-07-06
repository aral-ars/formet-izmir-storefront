"use client";

import { useRef } from 'react';
import { motion } from 'motion/react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { REVIEWS } from '../data';
import { TextReveal, LineReveal } from './TextReveal';

export function Reviews() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollContainerRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section id="reviews" className="py-24 px-6 lg:px-8 max-w-7xl mx-auto border-t border-earth/5">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div className="text-left">
          <TextReveal as="h2" className="text-3xl md:text-5xl font-display font-semibold mb-4" accentWords={['Deneyimleri']}>
            Müşteri Deneyimleri
          </TextReveal>
          <LineReveal className="text-lg text-earth/80 max-w-2xl tracking-wide" delay={0.2}>
            Müşterilerimizin dış mekan mobilya koleksiyonlarımız hakkında neler söylediğini dinleyin.
          </LineReveal>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={() => scroll('left')}
            className="w-12 h-12 rounded-full border border-earth/20 flex items-center justify-center text-earth hover:bg-earth/5 transition-colors"
            aria-label="Önceki Yorum"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="w-12 h-12 rounded-full border border-earth/20 flex items-center justify-center text-earth hover:bg-earth/5 transition-colors"
            aria-label="Sonraki Yorum"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div 
        ref={scrollContainerRef}
        className="flex gap-6 lg:gap-8 overflow-x-auto snap-x snap-mandatory pb-8 -mx-6 px-6 lg:-mx-8 lg:px-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {REVIEWS.map((review, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
            className="bg-sand-light rounded-3xl p-8 w-[85vw] md:w-[400px] flex-shrink-0 snap-start"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-earth/10 flex-shrink-0 flex items-center justify-center text-earth-dark font-medium text-lg">
                {review.authorInitial}
              </div>
              <div>
                <h4 className="font-medium text-earth-dark">{review.authorName}</h4>
                <div className="flex items-center space-x-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < review.rating ? 'text-[#F4B400] fill-[#F4B400]' : 'text-earth/20'}`} 
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-earth/80 text-sm leading-relaxed italic line-clamp-4">
              "{review.text}"
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

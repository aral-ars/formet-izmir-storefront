"use client";

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { REVIEWS } from '../data';
import { TextReveal, LineReveal } from './TextReveal';

const AVG_RATING =
  REVIEWS.reduce((sum, r) => sum + r.rating, 0) / REVIEWS.length;

export function Reviews() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollContainerRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  // Track which card is centered so the mobile dots + focus effect stay in sync.
  const updateActiveIndex = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const containerCenter = container.getBoundingClientRect().left + container.clientWidth / 2;
    let closest = 0;
    let minDist = Infinity;
    Array.from(container.children).forEach((child, i) => {
      const rect = (child as HTMLElement).getBoundingClientRect();
      const dist = Math.abs(rect.left + rect.width / 2 - containerCenter);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });
    setActiveIndex(closest);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateActiveIndex);
    };
    container.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [updateActiveIndex]);

  const scrollToIndex = (i: number) => {
    const container = scrollContainerRef.current;
    const card = container?.children[i] as HTMLElement | undefined;
    if (!container || !card) return;
    // Reflect the tap immediately; the scroll listener will confirm it on real devices.
    setActiveIndex(i);
    const containerRect = container.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const delta = cardRect.left - containerRect.left - (container.clientWidth - cardRect.width) / 2;
    container.scrollBy({ left: delta, behavior: 'smooth' });
  };

  return (
    <section id="reviews" className="px-1.5 md:px-4 pt-4 md:pt-6 pb-4 md:pb-8">
      <div className="max-w-7xl mx-auto rounded-[2rem] md:rounded-[2.5rem] bg-sand/40 px-6 md:px-12 lg:px-16 py-12 md:py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-16 gap-6 md:gap-8">
        <div className="text-left">
          <TextReveal as="h2" className="text-3xl md:text-5xl font-display font-semibold mb-3 md:mb-4" accentWords={['Deneyimleri']}>
            Müşteri Deneyimleri
          </TextReveal>
          <LineReveal className="text-base md:text-lg text-earth/80 max-w-2xl tracking-wide" delay={0.2}>
            Müşterilerimizin dış mekan mobilya koleksiyonlarımız hakkında neler söylediğini dinleyin.
          </LineReveal>

          {/* Aggregate rating — social proof, prominent on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-5 md:mt-6 inline-flex items-center gap-3 rounded-full bg-white border border-earth/5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] py-2 pl-3 pr-4"
          >
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.round(AVG_RATING) ? 'text-[#F4B400] fill-[#F4B400]' : 'text-earth/20'}`}
                />
              ))}
            </div>
            <span className="text-sm text-earth-dark">
              <span className="font-semibold">{AVG_RATING.toFixed(1)}</span>
              <span className="text-earth/50"> · {REVIEWS.length} değerlendirme</span>
            </span>
          </motion.div>
        </div>

        <div className="hidden md:flex items-center space-x-4">
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
        className="flex gap-4 md:gap-6 lg:gap-8 overflow-x-auto snap-x snap-mandatory pb-4 md:pb-8 -mx-6 px-6 md:-mx-12 md:px-12 lg:-mx-16 lg:px-16 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {REVIEWS.map((review, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
            className={`relative bg-white border border-earth/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 w-[85vw] sm:w-[60vw] md:w-[400px] flex-shrink-0 snap-center md:snap-start transition-all duration-500 md:hover:-translate-y-1 md:hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] ${index === activeIndex ? 'opacity-100' : 'opacity-40 md:opacity-100'}`}
          >
            <Quote className="absolute top-6 right-6 w-7 h-7 text-earth/10 fill-earth/10 md:w-8 md:h-8" aria-hidden="true" />

            <div className="flex items-center space-x-3 md:space-x-4 mb-5 md:mb-6">
              <div className="w-11 h-11 md:w-12 md:h-12 rounded-full overflow-hidden bg-earth/10 flex-shrink-0 flex items-center justify-center text-earth-dark font-medium text-base md:text-lg">
                {review.authorInitial}
              </div>
              <div>
                <h4 className="font-medium text-earth-dark text-sm md:text-base">{review.authorName}</h4>
                <div className="flex items-center space-x-1 mt-0.5 md:mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 md:w-4 md:h-4 ${i < review.rating ? 'text-[#F4B400] fill-[#F4B400]' : 'text-earth/20'}`}
                    />
                  ))}
                </div>
                <p className="text-xs text-earth/40 mt-1.5">{review.date}</p>
              </div>
            </div>
            <p className="text-earth/80 text-[15px] md:text-base leading-relaxed italic line-clamp-5 md:line-clamp-4">
              "{review.text}"
            </p>
          </motion.div>
        ))}
      </div>

      {/* Mobile pagination dots — position/count feedback the arrows can't give on touch.
          Each button is a 44px-tall tap target; the visible dot inside stays small. */}
      <div className="flex md:hidden items-center justify-center mt-4">
        {REVIEWS.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToIndex(i)}
            aria-label={`${i + 1}. yoruma git`}
            aria-current={i === activeIndex}
            className="group flex h-11 w-7 items-center justify-center"
          >
            <span
              className={`h-2 rounded-full transition-all duration-300 ${i === activeIndex ? 'w-6 bg-earth' : 'w-2 bg-earth/25 group-hover:bg-earth/40'}`}
            />
          </button>
        ))}
      </div>
      </div>
    </section>
  );
}

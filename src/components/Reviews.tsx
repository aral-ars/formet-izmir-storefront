"use client";

import { useRef, useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ChevronLeft, ChevronRight, Quote, X } from 'lucide-react';
import { REVIEWS, ASSETS } from '../data';
import { TextReveal, LineReveal } from './TextReveal';
import { SpotlightCard } from './SpotlightCard';

type ReviewCard = {
  authorName: string;
  authorInitial: string;
  rating: number;
  date: string;
  text: string;
  image?: string;
};

export function Reviews({ reviews = REVIEWS }: { reviews?: ReviewCard[] }) {
  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || isHovered || expandedImage || reviews.length <= 1) return;
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % reviews.length;
      scrollToIndex(nextIndex);
    }, 5000);
    return () => clearInterval(interval);
  }, [mounted, isHovered, expandedImage, activeIndex, reviews.length]);

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
      <div className="max-w-7xl mx-auto rounded-[2rem] md:rounded-[2.5rem] bg-sand/40 px-6 md:px-12 lg:px-16 pt-12 md:pt-20 pb-4 md:pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 md:mb-8 gap-6 md:gap-8">
          <div className="text-left">
            <TextReveal
              as="h2"
              className="text-3xl md:text-5xl font-display font-semibold mb-3 md:mb-4"
              accentWords={['Deneyimleri']}
              typewriterWords={['Müşteri', 'Deneyimleri']}
              typewriterSpeed={0.12}
              accentClassName="font-serif italic font-medium relative top-[0.055em]"
            >
              Müşteri Deneyimleri.
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
                    className={`w-4 h-4 ${i < Math.round(avgRating) ? 'text-[#F4B400] fill-[#F4B400]' : 'text-earth/20'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-earth-dark flex items-center">
                <span className="font-semibold">{avgRating.toFixed(1)}</span>
                <span className="text-earth/50 flex items-center">
                  <span className="mx-1">·</span>
                  {reviews.length} değerlendirme
                  <svg viewBox="0 0 48 48" className="w-3.5 h-3.5 ml-2.5" aria-hidden="true">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                </span>
              </span>
            </motion.div>
          </div>

          <div className="hidden md:flex items-center space-x-4 z-10">
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
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
          className="flex gap-6 md:gap-8 lg:gap-12 overflow-x-auto snap-x snap-mandatory pt-4 md:pt-8 pb-12 md:pb-20 -mx-4 px-4 scroll-pl-4 md:-mx-6 md:px-6 md:scroll-pl-6 lg:-mx-10 lg:px-10 lg:scroll-pl-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {reviews.map((review, index) => {
            const reviewImage = review.image;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
                className="w-[85vw] sm:w-[60vw] md:w-[calc((100%-4rem)/3)] lg:w-[calc((100%-6rem)/3)] flex-shrink-0 snap-center md:snap-start"
              >
                <div className={`h-full transition-opacity duration-500 ${index === activeIndex ? 'opacity-100' : 'opacity-40 md:opacity-100'}`}>
                  <SpotlightCard
                    spotlightColor="rgba(74, 68, 59, 0.04)"
                    spotlightSize={300}
                    className="group relative glass-panel !shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 h-full w-full transition-all duration-500 md:hover:-translate-y-1 md:hover:!shadow-[0_12px_30px_rgba(0,0,0,0.06)]"
                  >
                    <Quote className="absolute -top-4 -left-4 w-28 h-28 md:w-32 md:h-32 text-earth/5 fill-earth/5 rotate-12 transition-transform duration-700 md:group-hover:rotate-0" aria-hidden="true" />

                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-5 md:mb-6">
                        <div className="flex items-center space-x-3 md:space-x-4">
                          <div className="w-11 h-11 md:w-12 md:h-12 rounded-full overflow-hidden bg-earth/10 flex-shrink-0 flex items-center justify-center text-earth-dark font-medium text-base md:text-lg shadow-inner">
                            {review.authorInitial}
                          </div>
                          <div>
                            <h4 className="font-medium text-earth-dark text-sm md:text-base tracking-tight">{review.authorName}</h4>
                            <div className="flex items-center space-x-1 mt-0.5 md:mt-1">
                              {[...Array(5)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, scale: 0 }}
                                  whileInView={{ opacity: 1, scale: 1 }}
                                  viewport={{ once: true }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 20,
                                    delay: i * 0.06 + 0.3
                                  }}
                                >
                                  <Star
                                    className={`w-3.5 h-3.5 md:w-4 md:h-4 ${i < review.rating ? 'text-[#F4B400] fill-[#F4B400]' : 'text-earth/20'}`}
                                  />
                                </motion.div>
                              ))}
                            </div>
                            <p className="text-xs text-earth/50 mt-1.5 font-light">{review.date}</p>
                          </div>
                        </div>

                        {/* Small Photo at Top Right */}
                        {reviewImage && (
                          <button
                            onClick={() => setExpandedImage(reviewImage)}
                            className="w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden flex-shrink-0 ml-3 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-earth/50"
                            aria-label="Fotoğrafı büyüt"
                          >
                            <img src={reviewImage} alt={`${review.authorName} review`} className="w-full h-full object-cover" />
                          </button>
                        )}
                      </div>
                      <p className="text-earth/80 text-[15px] md:text-base leading-relaxed italic line-clamp-5 md:line-clamp-4">
                        "{review.text}"
                      </p>
                    </div>
                  </SpotlightCard>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile pagination dots */}
        <div className="flex md:hidden items-center justify-center mt-4">
          {(() => {
            const MAX_DOTS = 7;
            const groupSize = Math.max(1, Math.ceil(reviews.length / MAX_DOTS));
            const dotCount = Math.ceil(reviews.length / groupSize);
            const activeDot = Math.floor(activeIndex / groupSize);

            if (dotCount <= 1) return null;

            return [...Array(dotCount)].map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToIndex(Math.min(i * groupSize, reviews.length - 1))}
                aria-label={`${i + 1}. yoruma git`}
                aria-current={i === activeDot}
                className="group flex h-11 w-7 items-center justify-center"
              >
                <span
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === activeDot ? 'w-6 bg-earth' : 'w-2 bg-earth/25 group-hover:bg-earth/40'
                  }`}
                />
              </button>
            ));
          })()}
        </div>
      </div>

      {/* Expanded Image Lightbox */}
      {mounted && createPortal(
        <AnimatePresence>
          {expandedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-earth-dark/90 backdrop-blur-md"
              onClick={() => setExpandedImage(null)}
            >
              <button
                onClick={() => setExpandedImage(null)}
                className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
                aria-label="Kapat"
              >
                <X className="w-6 h-6" />
              </button>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative max-w-5xl max-h-[85vh] w-full h-full"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
              >
                <img
                  src={expandedImage}
                  alt="Expanded review"
                  className="w-full h-full object-contain"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}

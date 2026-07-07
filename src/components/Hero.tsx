import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ASSETS } from '../data';
import { ArrowRight } from 'lucide-react';
import { TransitionLink } from './TransitionLink';

export function Hero() {
  const words = ["Doğanın", "mükemmel", "uzantısı."];
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  // Light parallax effect: move image slightly down as container scrolls up
  const imageY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <div className="pt-1.5 sm:pt-1.5 lg:pt-1.5 px-1.5 pb-1.5 lg:px-1.5 lg:pb-1.5 h-[100dvh]" ref={heroRef}>
      <div className="relative w-full h-full rounded-3xl overflow-hidden bg-sand">

        <motion.video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ y: imageY, scale: 1.15 }}
        >
          <source src="https://res.cloudinary.com/ocd5tjel/video/upload/v1783276401/Generated_Video_July_05_2026_-_7_51PM_1_jarbzb.mp4" type="video/mp4" />
        </motion.video>
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30" />

        <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12 lg:p-20">
          <div className="max-w-2xl">
            {/* Word-by-word text reveal headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-semibold text-white mb-6 leading-[1.1] tracking-[-0.02em]">
              {words.map((word, i) => (
                <span key={i} className="inline-block overflow-hidden mr-[0.28em] last:mr-0 pb-[0.2em] -mb-[0.2em] pt-[0.1em] -mt-[0.1em]">
                  <motion.span
                    className={`inline-block ${word === 'mükemmel'
                      ? 'font-serif italic font-medium relative'
                      : ''
                      }`}
                    initial={{ y: '120%', opacity: 0 }}
                    animate={{ y: '0%', opacity: 1 }}
                    transition={{
                      duration: 0.8,
                      delay: 0.5 + i * 0.12,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {word}
                    {word === 'mükemmel' && (
                      <motion.span
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
                        className="absolute left-0 bottom-1 sm:bottom-2 h-[3px] sm:h-[4px] bg-white/70 rounded-full"
                      />
                    )}
                  </motion.span>
                </span>
              ))}
            </h1>

            {/* Line reveal for subtitle */}
            <div className="overflow-hidden mb-10 pb-[0.2em] -mb-[0.2em] pt-[0.1em] -mt-[0.1em]">
              <motion.p
                className="text-lg sm:text-xl text-white/90 max-w-lg font-light leading-relaxed tracking-wide"
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{
                  duration: 0.7,
                  delay: 1.0,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                Eviniz ile doğa arasındaki sınırları kaldırmak için hassasiyetle üretilmiş dış mekan mobilyaları.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.3 }}
            >
              <TransitionLink href="/products" className="group glass text-earth-dark font-medium px-8 py-4 rounded-full flex items-center space-x-3 hover:bg-white/80 transition-all cursor-pointer inline-flex">
                <span className="tracking-wide">Koleksiyonu Keşfet</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </TransitionLink>
            </motion.div>
          </div>
        </div>

      </div>
    </div>
  );
}

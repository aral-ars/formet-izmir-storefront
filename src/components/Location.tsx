import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { MapPin, ArrowUpRight, Mail, Clock } from 'lucide-react';

export function Location() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] } }
  };

  return (
    <section ref={ref} id="showroom" className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 max-w-[90rem] mx-auto overflow-hidden">

      <div className="relative rounded-[2.5rem] md:rounded-[3.5rem] bg-earth-dark overflow-hidden shadow-2xl min-h-[85vh] flex items-center">

        {/* Cinematic Blended Video Background */}
        <motion.div
          style={{ y }}
          className="absolute inset-0 w-full h-[120%] -top-[10%] lg:w-[60%] lg:left-auto lg:right-0 pointer-events-none z-0"
        >
          <video
            src="https://res.cloudinary.com/ocd5tjel/video/upload/v1783175887/S%CC%A7%C4%B1kl%C4%B1g%CC%86%C4%B1n_adresi_Mithatpas%CC%A7a_Caddesi_No-651_Siteler_Mahallesi_i4kzlq.mp4"
            className="w-full h-full object-cover opacity-60 lg:opacity-80 [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)] lg:[mask-image:linear-gradient(to_left,black_70%,transparent_100%)] lg:[-webkit-mask-image:linear-gradient(to_left,black_70%,transparent_100%)]"
            autoPlay
            loop
            muted
            playsInline
          />
          {/* Ambient Shadow Overlays for blending */}
          <div className="absolute inset-0 bg-gradient-to-t from-earth-dark via-earth-dark/40 to-transparent lg:bg-gradient-to-r lg:from-earth-dark lg:via-earth-dark/10 lg:to-transparent lg:w-1/2 lg:left-0" />
        </motion.div>

        {/* Content */}
        <div className="relative z-10 w-full px-6 py-16 sm:p-12 lg:p-20 xl:p-24">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-2xl lg:max-w-3xl xl:max-w-4xl"
          >
            <motion.span variants={fadeUp} className="uppercase tracking-[0.2em] text-xs font-medium text-white/50 mb-6 block">
              Flagship Showroom
            </motion.span>

            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-display font-medium leading-[1.05] tracking-tight text-white mb-8">
              Experience <br className="hidden md:block" />
              <span className="font-serif italic font-medium text-white/80">elegance.</span>
            </motion.h2>

            <motion.p variants={fadeUp} className="text-white/70 text-base md:text-lg font-light leading-relaxed mb-12 max-w-md lg:max-w-lg">
              Step into our Izmir space to feel the textures, test the comfort, and consult with our design specialists to bring your outdoor vision to life.
            </motion.p>

            {/* Glassmorphism Cards */}
            <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mt-12 lg:mt-16">

              {/* Location Card */}
              <div className="lg:col-span-1 backdrop-blur-xl bg-white/5 border border-white/10 rounded-[2rem] p-8 hover:bg-white/10 transition-colors duration-500 flex flex-col h-full group">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-500">
                  <MapPin className="w-4 h-4" />
                </div>
                <h4 className="text-white font-medium text-lg mb-2">Location</h4>
                <p className="text-white/60 font-light text-sm leading-relaxed mb-6 flex-grow">
                  Mithatpaşa Caddesi No:651<br />
                  Siteler Mahallesi, İzmir
                </p>
                <a
                  href="https://maps.app.goo.gl/cN8DDk2KxbBAzgrk6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-sm font-medium text-white/80 hover:text-white transition-colors mt-auto group/link"
                >
                  <span>Get Directions</span>
                  <ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                </a>
              </div>

              {/* Hours Card */}
              <div className="lg:col-span-1 backdrop-blur-xl bg-white/5 border border-white/10 rounded-[2rem] p-8 hover:bg-white/10 transition-colors duration-500 flex flex-col group">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Clock className="w-4 h-4" />
                </div>
                <h4 className="text-white font-medium text-lg mb-4">Hours</h4>
                <div className="space-y-2 text-sm font-light text-white/60">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span>Mon - Sat</span>
                    <span className="text-white">10:00 - 19:00</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span>Sunday</span>
                    <span className="text-white/40">Closed</span>
                  </div>
                </div>
              </div>

              {/* Contact Card */}
              <div className="lg:col-span-1 backdrop-blur-xl bg-white/5 border border-white/10 rounded-[2rem] p-8 hover:bg-white/10 transition-colors duration-500 flex flex-col group">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Mail className="w-4 h-4" />
                </div>
                <h4 className="text-white font-medium text-lg mb-4">Contact</h4>
                <div className="space-y-2 text-sm font-light flex flex-col">
                  <a href="tel:+902325550123" className="text-white/60 hover:text-white transition-colors mb-2">
                    +90 (232) 555 0123
                  </a>
                  <a href="mailto:hello@formet-outdoor.com" className="text-white/60 hover:text-white transition-colors">
                    hello@formet-outdoor.com
                  </a>
                </div>
              </div>

            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

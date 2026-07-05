'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent, MotionValue } from 'motion/react';
import { MapPin, ArrowUpRight, Mail, Clock } from 'lucide-react';

/* ── Scroll choreography (progress 0 → 1 over the pinned track) ──
   0.02–0.20  title types out, centered & dark, scrubbed to scroll
   0.20–0.32  dark card fades in; 0.22–0.58 it blooms center-out (horizontal)
   0.24–0.60  title migrates center → its resting spot (top-left of the card)
   0.26–0.50  title color shifts dark → light as the card fills behind it
   0.60–0.92  eyebrow, paragraph, then the three cards stagger in
   0.92–1.00  hold, then the pin releases                                    */
const TYPE_A = 0.02; // typing starts just after the pin engages
const TYPE_B = 0.2;  // title fully typed (still centered)
const MIG_A = 0.24;  // title starts migrating toward the corner
const MIG_B = 0.6;
const BIG = 1.4; // centered title scale relative to its resting size

const LINE1 = 'Experience';
const LINE2 = 'elegance.';
const TOTAL = LINE1.length + LINE2.length;

const clampT = (v: number, a: number, b: number) => Math.min(1, Math.max(0, (v - a) / (b - a)));

// useLayoutEffect on the client, useEffect during SSR (avoids the hydration warning)
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function Caret({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <motion.span
      aria-hidden
      className="inline-block w-[0.055em] h-[0.78em] translate-y-[0.04em] ml-[0.1em] bg-current align-middle"
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
    />
  );
}

export function Location() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLHeadingElement>(null);

  // Progress across the whole pinned track.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  const p = useSpring(scrollYProgress, { damping: 30, stiffness: 140, mass: 0.6 });

  // ── Typewriter driven by scroll: letters appear as you scroll into the pin and
  //    finish while the title is still centred (reverses if you scroll back up) ──
  const [count, setCount] = useState(() =>
    Math.round(clampT(scrollYProgress.get(), TYPE_A, TYPE_B) * TOTAL)
  );
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const c = Math.round(clampT(v, TYPE_A, TYPE_B) * TOTAL);
    setCount((prev) => (prev === c ? prev : c));
  });
  const typingDone = count >= TOTAL;

  const shown1 = Math.min(count, LINE1.length);
  const shown2 = Math.max(0, Math.min(count - LINE1.length, LINE2.length));

  // ── FLIP measurement: the invisible ghost defines the title's resting spot,
  //    the delta to the stage centre defines where the overlay sits at the start ──
  const [m, setM] = useState({ left: 0, top: 0, width: 0, dx: 0, dy: 0, ready: false });

  useIsoLayoutEffect(() => {
    const measure = () => {
      const stage = stageRef.current;
      const ghost = ghostRef.current;
      if (!stage || !ghost) return;
      const left = ghost.offsetLeft;
      const top = ghost.offsetTop;
      const width = ghost.offsetWidth;
      const height = ghost.offsetHeight;
      setM({
        left,
        top,
        width,
        dx: stage.clientWidth / 2 - (left + width / 2),
        dy: stage.clientHeight / 2 - (top + height / 2),
        ready: true,
      });
    };
    measure();
    window.addEventListener('resize', measure);
    // Fonts change the ghost's measured size — re-measure once they're ready.
    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.then(measure).catch(() => { });
    }
    return () => window.removeEventListener('resize', measure);
  }, []);

  // ── Title transforms (transform-origin centred, so scale doesn't shift the centre point) ──
  const titleX = useTransform(p, (v) => m.dx * (1 - clampT(v, MIG_A, MIG_B)));
  const titleY = useTransform(p, (v) => m.dy * (1 - clampT(v, MIG_A, MIG_B)));
  const titleScale = useTransform(p, (v) => BIG + (1 - BIG) * clampT(v, MIG_A, MIG_B));
  const titleColor = useTransform(p, [0.26, 0.5], ['#2C2822', '#F4F2EE']);

  // ── Card bloom (center-out, horizontal emphasis) ──
  const cardClip = useTransform(p, (v) => {
    const t = clampT(v, 0.22, 0.58);
    const lr = 49 * (1 - t); // horizontal — opens wide (left & right)
    const tb = 22 * (1 - t); // vertical — opens less, so it reads as growing sideways
    const r = Math.max(120 - 90 * t, 24);
    return `inset(${tb}% ${lr}% ${tb}% ${lr}% round ${r}px)`;
  });
  const cardOpacity = useTransform(p, [0.2, 0.32], [0, 1]);

  // ── Content reveal (staggered by input range, not by variants) ──
  const mk = (a: number, b: number): [MotionValue<number>, MotionValue<number>] => [
    useTransform(p, [a, b], [0, 1]),
    useTransform(p, [a, b], [26, 0]),
  ];
  const [eyebrowO, eyebrowY] = mk(0.6, 0.72);
  const [paraO, paraY] = mk(0.64, 0.76);
  const [c1O, c1Y] = mk(0.68, 0.82);
  const [c2O, c2Y] = mk(0.73, 0.87);
  const [c3O, c3Y] = mk(0.78, 0.92);

  const titleClasses =
    'font-display font-medium leading-[1.02] tracking-tight text-4xl md:text-5xl lg:text-6xl xl:text-7xl';

  return (
    <section ref={sectionRef} id="showroom" className="relative h-[260vh]">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div ref={stageRef} className="relative w-full max-w-[88rem] mx-auto h-[78vh] md:h-[80vh]">

          {/* Dark card — video background, revealed by the center-out clip bloom */}
          <motion.div
            style={{ clipPath: cardClip, opacity: cardOpacity }}
            className="absolute inset-0 rounded-[2.5rem] md:rounded-[3.5rem] bg-earth-dark overflow-hidden shadow-2xl will-change-[clip-path,opacity]"
          >
            <video
              src="https://res.cloudinary.com/ocd5tjel/video/upload/v1783175887/S%CC%A7%C4%B1kl%C4%B1g%CC%86%C4%B1n_adresi_Mithatpas%CC%A7a_Caddesi_No-651_Siteler_Mahallesi_i4kzlq.mp4"
              className="absolute inset-0 w-full h-full object-cover opacity-90"
              autoPlay
              loop
              muted
              playsInline
            />
            {/* Legibility gradients — darker toward the bottom-left where the copy sits */}
            <div className="absolute inset-0 bg-gradient-to-t from-earth-dark via-earth-dark/55 to-earth-dark/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-earth-dark/90 via-earth-dark/35 to-transparent" />
          </motion.div>

          {/* Content overlay — a sibling of the card so it's never clipped by the bloom */}
          <div className="absolute inset-0 z-10 px-[7%] py-[8%] flex flex-col">
            <motion.span
              style={{ opacity: eyebrowO, y: eyebrowY }}
              className="uppercase tracking-[0.2em] text-xs font-medium text-white/50 mb-6 block"
            >
              Flagship Showroom
            </motion.span>

            {/* Ghost title — invisible, reserves the exact resting layout the overlay lands on.
                self-start + w-fit stop the flex column from stretching it to full width, so its
                measured centre is the real text centre (otherwise dx computes to ~0 → title stays left). */}
            <h2 ref={ghostRef} aria-hidden className={`${titleClasses} self-start w-fit opacity-0 pointer-events-none select-none`}>
              <span className="block">{LINE1}</span>
              <span className="block font-serif italic">{LINE2}</span>
            </h2>

            <motion.p
              style={{ opacity: paraO, y: paraY }}
              className="text-white/70 text-base md:text-lg font-light leading-relaxed mt-8 mb-10 max-w-md lg:max-w-lg"
            >
              Step into our Izmir space to feel the textures, test the comfort, and consult with our design specialists to bring your outdoor vision to life.
            </motion.p>

            {/* Info cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mt-auto max-w-4xl">
              {/* Location */}
              <motion.div
                style={{ opacity: c1O, y: c1Y }}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-[2rem] p-8 hover:bg-white/10 transition-colors duration-500 flex flex-col h-full group"
              >
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-500">
                  <MapPin className="w-4 h-4" />
                </div>
                <h4 className="text-white font-medium text-lg mb-2">Location</h4>
                <p className="text-white/60 font-light text-sm leading-relaxed mb-6 flex-grow">
                  Mithatpaşa Caddesi No:651<br />
                  Siteler Mahallesi, İzmir
                </p>
                <a href="https://maps.app.goo.gl/cN8DDk2KxbBAzgrk6" target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 text-sm font-medium text-white/80 hover:text-white transition-colors mt-auto group/link">
                  <span>Get Directions</span>
                  <ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                </a>
              </motion.div>

              {/* Hours */}
              <motion.div
                style={{ opacity: c2O, y: c2Y }}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-[2rem] p-8 hover:bg-white/10 transition-colors duration-500 flex flex-col group"
              >
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
              </motion.div>

              {/* Contact */}
              <motion.div
                style={{ opacity: c3O, y: c3Y }}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-[2rem] p-8 hover:bg-white/10 transition-colors duration-500 flex flex-col group"
              >
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Mail className="w-4 h-4" />
                </div>
                <h4 className="text-white font-medium text-lg mb-4">Contact</h4>
                <div className="space-y-2 text-sm font-light flex flex-col">
                  <a href="tel:+902325550123" className="text-white/60 hover:text-white transition-colors mb-2">+90 (232) 555 0123</a>
                  <a href="mailto:hello@formet-outdoor.com" className="text-white/60 hover:text-white transition-colors">hello@formet-outdoor.com</a>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Migrating title — the single persistent element that FLIPs from centre to top-left */}
          <motion.div
            style={{
              left: m.left,
              top: m.top,
              width: m.width,
              x: titleX,
              y: titleY,
              scale: titleScale,
              color: titleColor,
              opacity: m.ready ? 1 : 0,
              transformOrigin: 'center center',
            }}
            className="absolute z-20 will-change-transform"
          >
            <h2 className={titleClasses}>
              <span className="block">
                {LINE1.slice(0, shown1)}
                <Caret show={count <= LINE1.length && !typingDone} />
              </span>
              <span className="block font-serif italic opacity-85">
                {LINE2.slice(0, shown2)}
                <Caret show={count > LINE1.length && !typingDone} />
              </span>
            </h2>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent, MotionValue } from 'motion/react';
import { MapPin, ArrowUpRight, Mail, Clock } from 'lucide-react';

/* ── Scroll choreography (progress 0 → 1 over the pinned track) ──
   0.03–0.28  title types out, centered & dark, scrubbed to scroll
   0.28–0.36  breather — the fully-typed title holds, centered & alone
   0.36–0.62  dark card fades in and blooms center-out (horizontal)
   0.36–1.00  video slowly zooms + parallaxes behind the card (living background)
   0.40–0.66  title migrates center → its resting spot (top-left of the card)
   0.44–0.62  title color shifts dark → light as the card fills behind it
   0.60–0.87  eyebrow · word-by-word paragraph · drawn rule · cards assemble in
   0.87–0.96  everything settled — the finished card dwells (extended hold)
   0.96–1.00  stage lifts / recedes / softens, then the pin releases         */
const TYPE_A = 0.03; // typing starts just after the pin engages
const TYPE_B = 0.28; // title fully typed (wide window = slower, more legible letters)
const MIG_A = 0.4;   // title starts migrating toward the corner (after a breather)
const MIG_B = 0.66;
const BIG = 1.4; // centered title scale relative to its resting size

const LINE1 = 'Zarafeti';
const LINE2 = 'deneyimleyin.';
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

const PARAGRAPH =
  'Dokuları hissetmek, konforu test etmek ve dış mekan vizyonunuzu hayata geçirmek için tasarım uzmanlarımıza danışmak üzere İzmir mağazamıza adım atın.';
const PARA_A = 0.63; // paragraph word-reveal window (progress)
const PARA_B = 0.82;

// One word of the scroll-scrubbed paragraph reveal — its own component so hooks stay stable
function ScrollWord({ progress, start, end, children }: {
  progress: MotionValue<number>;
  start: number;
  end: number;
  children: string;
}) {
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const y = useTransform(progress, [start, end], ['0.5em', '0em']);
  return (
    <motion.span style={{ opacity, y }} className="inline-block mr-[0.26em]">
      {children}
    </motion.span>
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
      document.fonts.ready.then(measure).catch(() => {});
    }
    return () => window.removeEventListener('resize', measure);
  }, []);

  // ── Title transforms (transform-origin centred, so scale doesn't shift the centre point) ──
  const titleX = useTransform(p, (v) => m.dx * (1 - clampT(v, MIG_A, MIG_B)));
  const titleY = useTransform(p, (v) => m.dy * (1 - clampT(v, MIG_A, MIG_B)));
  const titleScale = useTransform(p, (v) => BIG + (1 - BIG) * clampT(v, MIG_A, MIG_B));
  const titleColor = useTransform(p, [0.44, 0.62], ['#2C2822', '#F4F2EE']);

  // ── Card bloom (center-out, horizontal emphasis) ──
  const cardClip = useTransform(p, (v) => {
    const t = clampT(v, 0.36, 0.62);
    const lr = 49 * (1 - t); // horizontal — opens wide (left & right)
    const tb = 22 * (1 - t); // vertical — opens less, so it reads as growing sideways
    const r = Math.max(120 - 90 * t, 24);
    return `inset(${tb}% ${lr}% ${tb}% ${lr}% round ${r}px)`;
  });
  const cardOpacity = useTransform(p, [0.36, 0.46], [0, 1]);

  // ── Living video: slow scroll-linked zoom + parallax as the card reveals ──
  const videoScale = useTransform(p, [0.36, 1], [1.25, 1.04]);
  const videoY = useTransform(p, [0.36, 1], ['-3%', '3%']);

  // ── Graceful exit: on release the whole stage lifts, recedes and softens ──
  const sceneY = useTransform(p, [0.96, 1], [0, -48]);
  const sceneScale = useTransform(p, [0.96, 1], [1, 0.955]);
  const sceneOpacity = useTransform(p, [0.96, 1], [1, 0.82]);

  // ── Content reveal (all settled by ~0.87, then a long dwell before the 0.96 exit) ──
  const eyebrowO = useTransform(p, [0.6, 0.68], [0, 1]);
  const eyebrowY = useTransform(p, [0.6, 0.68], [20, 0]);
  const dividerScaleX = useTransform(p, [0.64, 0.78], [0, 1]);

  // Cards assemble from three directions, converging into the grid
  const c1O = useTransform(p, [0.65, 0.77], [0, 1]);
  const c1X = useTransform(p, [0.65, 0.79], ['-16%', '0%']);
  const c1Y = useTransform(p, [0.65, 0.79], ['16%', '0%']);
  const c2O = useTransform(p, [0.69, 0.81], [0, 1]);
  const c2Y = useTransform(p, [0.69, 0.83], ['32%', '0%']);
  const c3O = useTransform(p, [0.73, 0.85], [0, 1]);
  const c3X = useTransform(p, [0.73, 0.87], ['16%', '0%']);
  const c3Y = useTransform(p, [0.73, 0.87], ['16%', '0%']);

  const titleClasses =
    'font-display font-medium leading-[1.02] tracking-tight text-4xl md:text-5xl lg:text-6xl xl:text-7xl';

  return (
    <section ref={sectionRef} id="showroom" className="relative h-[380vh]">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={stageRef}
          style={{ y: sceneY, scale: sceneScale, opacity: sceneOpacity }}
          className="relative w-full max-w-[88rem] mx-auto h-[78vh] md:h-[80vh] will-change-transform"
        >

          {/* Dark card — video background, revealed by the center-out clip bloom */}
          <motion.div
            style={{ clipPath: cardClip, opacity: cardOpacity }}
            className="absolute inset-0 rounded-[2.5rem] md:rounded-[3.5rem] bg-earth-dark overflow-hidden shadow-2xl will-change-[clip-path,opacity]"
          >
            <motion.video
              src="https://res.cloudinary.com/ocd5tjel/video/upload/v1783175887/S%CC%A7%C4%B1kl%C4%B1g%CC%86%C4%B1n_adresi_Mithatpas%CC%A7a_Caddesi_No-651_Siteler_Mahallesi_i4kzlq.mp4"
              style={{ scale: videoScale, y: videoY }}
              className="absolute inset-0 w-full h-full object-cover opacity-90 will-change-transform"
              autoPlay
              loop
              muted
              playsInline
            />
            {/* Legibility gradients — darker toward the bottom-left where the copy sits */}
            <div className="absolute inset-0 bg-gradient-to-t from-earth-dark via-earth-dark/55 to-earth-dark/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-earth-dark/90 via-earth-dark/35 to-transparent" />
          </motion.div>

          {/* Content overlay — a sibling of the card so it's never clipped by the bloom.
              Vertical padding is fixed (not %-of-width) so it stays compact on wide screens
              and the info cards never get pushed out of the fixed-height stage. */}
          <div className="absolute inset-0 z-10 px-[7%] py-6 sm:py-7 lg:py-8 xl:py-9 flex flex-col justify-center">
            <motion.span
              style={{ opacity: eyebrowO, y: eyebrowY }}
              className="uppercase tracking-[0.2em] text-xs font-medium text-white/50 mb-3 lg:mb-4 block"
            >
              Ana Mağaza
            </motion.span>

            {/* Ghost title — invisible, reserves the exact resting layout the overlay lands on.
                self-start + w-fit stop the flex column from stretching it to full width, so its
                measured centre is the real text centre (otherwise dx computes to ~0 → title stays left). */}
            <h2 ref={ghostRef} aria-hidden className={`${titleClasses} self-start w-fit opacity-0 pointer-events-none select-none`}>
              <span className="block">{LINE1}</span>
              <span className="block font-serif italic">{LINE2}</span>
            </h2>

            {/* Paragraph — scroll-scrubbed word-by-word reveal (speaks the site's TextReveal language) */}
            <p className="text-white/70 text-sm md:text-base lg:text-lg font-light leading-relaxed mt-4 mb-8 lg:mt-5 lg:mb-10 max-w-md lg:max-w-lg">
              {PARAGRAPH.split(' ').map((word, i, arr) => {
                const step = (PARA_B - PARA_A) / arr.length;
                const start = PARA_A + i * step;
                return (
                  <ScrollWord key={i} progress={p} start={start} end={start + step * 3}>
                    {word}
                  </ScrollWord>
                );
              })}
            </p>

            {/* Drawn rule + info cards — part of the centered block, not pinned to the bottom */}
            <div className="max-w-4xl">
              <motion.div
                style={{ scaleX: dividerScaleX }}
                className="h-px w-full bg-white/15 origin-left mb-4 lg:mb-5"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                {/* Location — assembles from the left */}
                <motion.div
                  style={{ opacity: c1O, x: c1X, y: c1Y }}
                  className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-[1.25rem] p-4 lg:p-5 hover:bg-white/10 transition-colors duration-500 flex flex-col h-full group"
                >
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform duration-500">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-white font-medium text-sm">Konum</h4>
                </div>
                <p className="text-white/60 font-light text-sm leading-relaxed mb-3 flex-grow">
                  Mithatpaşa Caddesi No:651<br />
                  Siteler Mahallesi, İzmir
                </p>
                <a href="https://maps.app.goo.gl/cN8DDk2KxbBAzgrk6" target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-1.5 text-sm font-medium text-white/80 hover:text-white transition-colors mt-auto group/link">
                  <span>Yol Tarifi Al</span>
                  <ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                </a>
              </motion.div>

              {/* Hours — rises from below */}
              <motion.div
                style={{ opacity: c2O, y: c2Y }}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-[1.25rem] p-4 lg:p-5 hover:bg-white/10 transition-colors duration-500 flex flex-col group"
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform duration-500">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-white font-medium text-sm">Çalışma Saatleri</h4>
                </div>
                <div className="space-y-1.5 text-sm font-light text-white/60">
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span>Pzt - Cmt</span>
                    <span className="text-white">10:00 - 19:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pazar</span>
                    <span className="text-white/40">Kapalı</span>
                  </div>
                </div>
              </motion.div>

              {/* Contact — assembles from the right */}
              <motion.div
                style={{ opacity: c3O, x: c3X, y: c3Y }}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-[1.25rem] p-4 lg:p-5 hover:bg-white/10 transition-colors duration-500 flex flex-col group"
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform duration-500">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-white font-medium text-sm">İletişim</h4>
                </div>
                <div className="space-y-1.5 text-sm font-light flex flex-col">
                  <a href="tel:+902325550123" className="text-white/60 hover:text-white transition-colors">+90 (232) 555 0123</a>
                  <a href="mailto:hello@formet-outdoor.com" className="text-white/60 hover:text-white transition-colors break-all">hello@formet-outdoor.com</a>
                </div>
                </motion.div>
              </div>
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
        </motion.div>

        {/* Whisper-subtle scroll progress — delete if it reads too utilitarian */}
        <motion.div
          style={{ scaleX: p }}
          className="absolute bottom-6 inset-x-0 mx-auto h-px w-40 bg-earth-dark/15 origin-left rounded-full"
        />
      </div>
    </section>
  );
}

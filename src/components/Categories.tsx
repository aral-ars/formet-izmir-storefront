'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { CATEGORIES } from '../data';
import { Plus } from 'lucide-react';
import { PillButton } from './PillButton';

// Resting fan layout, center-out. x/y are percentages of the card's own size.
const FAN = [
  { x: -110, y: 15, rotate: -12, scale: 1, z: 10 },
  { x: -55, y: 5, rotate: -6, scale: 1, z: 20 },
  { x: 0, y: 0, rotate: 0, scale: 1.05, z: 30 },
  { x: 55, y: 5, rotate: 6, scale: 1, z: 20 },
  { x: 110, y: 15, rotate: 12, scale: 1, z: 10 },
];

// A soft settle for the deal / return-to-rest, a snappier one for the hover spread.
const SPRING_REST = { type: 'spring', stiffness: 150, damping: 20, mass: 1 } as const;
const SPRING_SNAPPY = { type: 'spring', stiffness: 320, damping: 30, mass: 0.8 } as const;

const SHADOW_REST = '0 8px 30px rgba(0,0,0,0.08)';
const SHADOW_LIFT = '0 28px 55px rgba(0,0,0,0.18)';
const SHADOW_RECEDE = '0 6px 22px rgba(0,0,0,0.06)';

// The resting fan position for a card — the outer layer animates to this on deal-in.
function restingPose(index: number) {
  const base = FAN[index] ?? FAN[2];
  return { x: `${base.x}%`, y: `${base.y}%`, rotate: base.rotate, scale: base.scale };
}

// The *relative* hover reaction, composed on top of the resting pose by the inner
// layer. Values are deltas (extra translate/rotate/scale) so the fan itself stays put.
function hoverDelta(index: number, hoveredIndex: number | null) {
  if (hoveredIndex === null) {
    return { x: '0%', y: '0%', rotate: 0, scale: 1, opacity: 1, boxShadow: SHADOW_REST };
  }

  const base = FAN[index] ?? FAN[2];

  if (hoveredIndex === index) {
    // Lift the hovered card, straighten it toward the viewer, grow its shadow.
    return { x: '0%', y: '-16%', rotate: -base.rotate * 0.7, scale: 1.06, opacity: 1, boxShadow: SHADOW_LIFT };
  }

  // Neighbours part away from the hovered card and recede slightly.
  const dir = index < hoveredIndex ? -1 : 1;
  return { x: `${dir * 16}%`, y: '6%', rotate: dir * 4, scale: 0.96, opacity: 0.86, boxShadow: SHADOW_RECEDE };
}

export function Categories() {
  const displayCategories = CATEGORIES.slice(0, 5);
  const reduce = useReducedMotion();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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

      {/* Fanned Cards — a deck dealt out, spreading apart on hover */}
      <motion.div
        initial="stacked"
        whileInView="fanned"
        viewport={{ once: true, margin: "-100px" }}
        variants={{ fanned: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } } }}
        onMouseLeave={() => setHoveredIndex(null)}
        className="relative w-full max-w-5xl h-[340px] md:h-[420px] flex justify-center items-center mb-10 lg:mb-12"
      >
        {displayCategories.map((category, index) => {
          const base = FAN[index] ?? FAN[2];
          // Outer layer: dealt from the pile into its resting fan pose (parent staggers these).
          const outerVariants = reduce
            ? {
                stacked: { opacity: 0, ...restingPose(index) },
                fanned: { opacity: 1, ...restingPose(index), transition: { duration: 0.4 } },
              }
            : {
                // Piled at center-bottom, slightly rotated like a deck ready to deal.
                stacked: { opacity: 0, x: '0%', y: '55%', rotate: (index - 2) * 2.5, scale: 0.92 },
                fanned: { opacity: 1, ...restingPose(index), transition: SPRING_REST },
              };
          return (
            <motion.div
              key={category.id}
              variants={outerVariants}
              onMouseEnter={reduce ? undefined : () => setHoveredIndex(index)}
              className="absolute w-[180px] md:w-[240px] h-[280px] md:h-[340px] cursor-pointer"
              style={{ zIndex: hoveredIndex === index ? 50 : base.z }}
            >
              {/* Inner layer: reacts to hover — lifts the hovered card, parts its neighbours. */}
              <motion.div
                initial={false}
                animate={reduce ? { boxShadow: SHADOW_REST } : hoverDelta(index, hoveredIndex)}
                transition={SPRING_SNAPPY}
                className="h-full w-full rounded-2xl md:rounded-3xl overflow-hidden bg-white border border-earth/5 flex flex-col"
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
            </motion.div>
          );
        })}
      </motion.div>

      {/* Action Button */}
      <PillButton
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
      >
        Koleksiyonları keşfet
      </PillButton>

      </section>
    </div>
  );
}

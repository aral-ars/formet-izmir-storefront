'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'motion/react';

interface TextRevealProps {
  children: string;
  className?: string;
  /** Delay before animation starts (seconds) */
  delay?: number;
  /** Duration per word (seconds) */
  wordDuration?: number;
  /** Stagger between words (seconds) */
  stagger?: number;
  /** Whether to use serif italic on specific words */
  accentWords?: string[];
  /** Class for accented words */
  accentClassName?: string;
  /** HTML tag to use */
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

export function TextReveal({
  children,
  className = '',
  delay = 0,
  wordDuration = 0.5,
  stagger = 0.04,
  accentWords = [],
  accentClassName = 'font-serif italic font-medium',
  as: Tag = 'h2',
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const words = children.split(' ');

  return (
    <Tag
      ref={ref as any}
      className={`${className}`}
      style={{ overflow: 'hidden' }}
    >
      {words.map((word, i) => {
        const isAccented = accentWords.some(
          (aw) => word.toLowerCase().replace(/[^a-z]/g, '') === aw.toLowerCase()
        );

        return (
          <span key={i} className="inline-block overflow-hidden mr-[0.28em] last:mr-0">
            <motion.span
              className={`inline-block ${isAccented ? accentClassName : ''}`}
              initial={{ y: '110%', opacity: 0, rotateX: 45 }}
              animate={
                isInView
                  ? { y: '0%', opacity: 1, rotateX: 0 }
                  : { y: '110%', opacity: 0, rotateX: 45 }
              }
              transition={{
                duration: wordDuration,
                delay: delay + i * stagger,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {word}
            </motion.span>
          </span>
        );
      })}
    </Tag>
  );
}


interface LineRevealProps {
  children: string;
  className?: string;
  delay?: number;
  duration?: number;
  as?: 'p' | 'span' | 'div';
}

export function LineReveal({
  children,
  className = '',
  delay = 0,
  duration = 0.7,
  as: Tag = 'p',
}: LineRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <span className="block overflow-hidden">
      <Tag ref={ref as any} className={className}>
        <motion.span
          className="block"
          initial={{ y: '100%', opacity: 0 }}
          animate={
            isInView
              ? { y: '0%', opacity: 1 }
              : { y: '100%', opacity: 0 }
          }
          transition={{
            duration,
            delay,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {children}
        </motion.span>
      </Tag>
    </span>
  );
}

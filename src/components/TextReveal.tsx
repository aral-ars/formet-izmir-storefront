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
  /** Words to animate with a typewriter effect */
  typewriterWords?: string[];
  /** Speed of typewriter effect per character (seconds) */
  typewriterSpeed?: number;
  /** Class for accented words */
  accentClassName?: string;
  /** HTML tag to use */
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

function TypewriterWord({ 
  word, 
  delay, 
  speed, 
  className, 
  isInView 
}: { 
  word: string; 
  delay: number; 
  speed: number; 
  className: string; 
  isInView: boolean;
}) {
  const [charCount, setCharCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!isInView) {
      setCharCount(0);
      setHasStarted(false);
      return;
    }

    const timeout = setTimeout(() => {
      setHasStarted(true);
      let count = 0;
      const interval = setInterval(() => {
        count++;
        setCharCount(count);
        if (count >= word.length) {
          clearInterval(interval);
        }
      }, speed * 1000);
      
      return () => clearInterval(interval);
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [isInView, word, delay, speed]);

  const showCursor = hasStarted && charCount < word.length;

  return (
    <span className={className}>
      <span>{word.slice(0, charCount)}</span>
      <motion.span
        animate={showCursor ? { opacity: [1, 0, 1] } : { opacity: 0 }}
        transition={showCursor ? { duration: 0.8, repeat: Infinity, ease: "linear" } : { duration: 0 }}
        className="inline-block w-[0.08em] h-[0.9em] bg-current ml-[0.05em]"
      />
    </span>
  );
}

export function TextReveal({
  children,
  className = '',
  delay = 0,
  wordDuration = 0.5,
  stagger = 0.04,
  accentWords = [],
  typewriterWords = [],
  typewriterSpeed = 0.05,
  accentClassName = 'font-serif italic font-medium',
  as: Tag = 'h2',
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const words = children.split(' ');

  // Shared wrapper class to ensure identical baseline alignment (via overflow-hidden)
  // and prevent clipping of large italic descenders/ascenders (via expanded padding + negative margin)
  const wrapperClass = "inline-block overflow-hidden pb-[0.4em] -mb-[0.4em] pt-[0.1em] -mt-[0.1em] pr-[0.15em] mr-[0.02em] last:-mr-[0.15em]";

  let currentDelay = delay;

  return (
    <Tag
      ref={ref as any}
      className={`${className}`}
    >
      {words.map((word, i) => {
        // Strip trailing punctuation for cleaner matching, without destroying Turkish characters
        const cleanWord = word.toLowerCase().replace(/[.,!?]+$/, '');
        const isAccented = accentWords.some(
          (aw) => cleanWord === aw.toLowerCase()
        );
        const isTypewriter = typewriterWords.some(
          (tw) => cleanWord === tw.toLowerCase()
        );

        const wordBaseDelay = currentDelay;

        if (isTypewriter) {
          currentDelay += word.length * typewriterSpeed;
          return (
            <span key={i} className={wrapperClass}>
              <TypewriterWord 
                word={word} 
                delay={wordBaseDelay} 
                speed={typewriterSpeed} 
                className={`inline-block ${isAccented ? accentClassName : ''}`} 
                isInView={isInView} 
              />
            </span>
          );
        }

        currentDelay += stagger;

        return (
          <span key={i} className={wrapperClass}>
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
                delay: wordBaseDelay,
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
    <span className="block overflow-hidden pb-[0.2em] -mb-[0.2em] pt-[0.1em] -mt-[0.1em]">
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

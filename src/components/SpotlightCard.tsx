'use client';

import { useRef, useState } from 'react';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  /** Glow color in CSS format */
  spotlightColor?: string;
  /** Glow size in px */
  spotlightSize?: number;
}

export function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(74, 68, 59, 0.08)',
  spotlightSize = 350,
}: SpotlightCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden ${className}`}
      style={{
        '--spotlight-x': `${position.x}px`,
        '--spotlight-y': `${position.y}px`,
        '--spotlight-size': `${spotlightSize}px`,
        '--spotlight-color': spotlightColor,
      } as React.CSSProperties}
    >
      {/* Spotlight glow overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-500"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(
            var(--spotlight-size) circle at var(--spotlight-x) var(--spotlight-y),
            var(--spotlight-color),
            transparent 60%
          )`,
        }}
      />

      {/* Border glow */}
      <div
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] transition-opacity duration-500"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(
            calc(var(--spotlight-size) * 0.8) circle at var(--spotlight-x) var(--spotlight-y),
            rgba(74, 68, 59, 0.12),
            transparent 50%
          )`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '1px',
        }}
      />

      {children}
    </div>
  );
}

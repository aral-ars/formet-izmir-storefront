'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { TransitionLink } from './TransitionLink';
import { useCatalogNav } from './CatalogNavProvider';

type MenuKey = 'categories' | 'collections';

// A single row in either mega-menu. Categories and collections are flattened to
// this shape so both dropdowns render through the same panel/layout.
type MegaItem = {
  id: string;
  name: string;
  image: string;
  href: string;
  comingSoon?: boolean;
};

// Static links that sit alongside the two mega-menus. Root-relative so they work
// from every page (the home sections they target only exist on `/`).
const LINKS = [
  { label: 'Mağaza', href: '/#showroom' },
  { label: 'SSS', href: '/#faq' },
];

export function DesktopNav({
  useDarkText,
  onOpenChange,
}: {
  useDarkText: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const { categories, collections } = useCatalogNav();
  const [active, setActive] = useState<MenuKey | null>(null);
  // Distance from the trigger row down to the navbar's bottom edge, so the panel
  // sits flush under the bar (measured — the bar's height changes with scroll).
  const [gap, setGap] = useState(16);
  const rootRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const categoryItems: MegaItem[] = categories.map((c) => ({
    id: c.id,
    name: c.name,
    image: c.image,
    href: `/products?category=${c.id}`,
    comingSoon: c.comingSoon || !c.hasProducts,
  }));
  const collectionItems: MegaItem[] = collections.map((c) => ({
    id: c.id,
    name: c.name,
    image: c.image,
    href: `/products?collection=${c.id}`,
    comingSoon: !c.hasProducts,
  }));

  const hasCategories = categoryItems.length > 0;
  const hasCollections = collectionItems.length > 0;

  const clearClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const open = useCallback(
    (key: MenuKey) => {
      clearClose();
      setActive(key);
    },
    [clearClose],
  );

  // A small grace period so moving the cursor from a trigger into the panel
  // (or between the two triggers) doesn't flicker the panel shut.
  const scheduleClose = useCallback(() => {
    clearClose();
    closeTimer.current = setTimeout(() => setActive(null), 120);
  }, [clearClose]);

  useEffect(() => {
    onOpenChange?.(active !== null);
  }, [active, onOpenChange]);

  // Keep the panel pinned to the bottom of the navbar as it resizes (the bar
  // shrinks when it turns solid on open) or the page scrolls.
  useEffect(() => {
    if (active === null) return;
    const root = rootRef.current;
    const nav = root?.closest('nav');
    if (!root || !nav) return;
    const measure = () =>
      setGap(Math.max(0, Math.round(nav.getBoundingClientRect().bottom - root.getBoundingClientRect().bottom)));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(nav);
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, [active]);

  useEffect(() => () => clearClose(), [clearClose]);

  const getTriggerClass = (isActive: boolean) => {
    const base = 'relative flex items-center gap-1 text-sm font-medium transition-colors duration-300 cursor-pointer px-4 py-2 rounded-full';
    if (useDarkText) {
      return `${base} ${isActive ? 'text-earth-dark' : 'text-earth-dark hover:text-earth hover:bg-earth/5'}`;
    } else {
      return `${base} ${isActive ? 'text-earth-dark' : 'text-white hover:text-white/90 hover:bg-white/10'}`;
    }
  };

  const linkBase = `text-sm font-medium transition-all duration-300 px-4 py-2 rounded-full ${
    useDarkText ? 'text-earth-dark hover:text-earth hover:bg-earth/5' : 'text-white hover:text-white/90 hover:bg-white/10'
  }`;

  return (
    <div ref={rootRef} className="relative hidden md:flex items-center" onMouseLeave={scheduleClose}>
      <div className="flex items-center space-x-2 lg:space-x-4">
        {hasCategories && (
          <Trigger
            label="Kategoriler"
            isActive={active === 'categories'}
            useDarkText={useDarkText}
            className={getTriggerClass(active === 'categories')}
            onOpen={() => open('categories')}
            onClose={scheduleClose}
          />
        )}
        {hasCollections && (
          <Trigger
            label="Koleksiyonlar"
            isActive={active === 'collections'}
            useDarkText={useDarkText}
            className={getTriggerClass(active === 'collections')}
            onOpen={() => open('collections')}
            onClose={scheduleClose}
          />
        )}
        {LINKS.map((link) => (
          <TransitionLink
            key={link.href}
            href={link.href}
            className={linkBase}
            onFocus={() => setActive(null)}
            onMouseEnter={scheduleClose}
          >
            {link.label}
          </TransitionLink>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <Dropdown gap={gap} onEnter={clearClose} onLeave={scheduleClose}>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.2 }}
              >
                <MegaPanel
                  items={active === 'categories' ? categoryItems : collectionItems}
                  listLabel={active === 'categories' ? 'Kategoriler' : 'Koleksiyonlar'}
                  previewLabel={active === 'categories' ? 'Kategori' : 'Koleksiyon'}
                  footerLabel="Tüm ürünleri gör"
                  footerHref="/products"
                  onNavigate={() => setActive(null)}
                />
              </motion.div>
            </AnimatePresence>
          </Dropdown>
        )}
      </AnimatePresence>
    </div>
  );
}

function Trigger({
  label,
  isActive,
  useDarkText,
  className,
  onOpen,
  onClose,
}: {
  label: string;
  isActive: boolean;
  useDarkText: boolean;
  className: string;
  onOpen: () => void;
  onClose: () => void;
}) {
  return (
    <button
      type="button"
      className={className}
      aria-expanded={isActive}
      onMouseEnter={onOpen}
      onFocus={onOpen}
      onClick={onOpen}
      // Keyboard users can dismiss with Escape.
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      <span className="relative z-10 flex items-center gap-1">
        {label}
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`}
        />
      </span>
      <AnimatePresence>
        {isActive && (
          <motion.div
            layoutId="desktop-nav-pill"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 rounded-full z-0 ${useDarkText ? 'bg-earth/5' : 'bg-white'}`}
            transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
          />
        )}
      </AnimatePresence>
    </button>
  );
}

// The floating panel shell: warm glass card, centered under the trigger row.
// `gap` is applied as padding (not margin) so the bridge between navbar and card
// stays hoverable — the cursor never crosses a dead zone on its way down.
function Dropdown({
  children,
  gap,
  onEnter,
  onLeave,
}: {
  children: React.ReactNode;
  gap: number;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.985 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      style={{ paddingTop: gap }}
      className="absolute top-full left-1/2 -translate-x-1/2 z-50"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className="rounded-[1.75rem] bg-sand-light/95 backdrop-blur-2xl ring-1 ring-white/50 shadow-[0_24px_70px_-20px_rgba(44,40,34,0.35)] overflow-hidden">
        {children}
      </div>
    </motion.div>
  );
}

// Shared layout for both dropdowns: a 2-column text list on the left and a live
// preview image on the right that cross-fades to the hovered row.
function MegaPanel({
  items,
  listLabel,
  previewLabel,
  footerLabel,
  footerHref,
  onNavigate,
}: {
  items: MegaItem[];
  listLabel: string;
  previewLabel: string;
  footerLabel: string;
  footerHref: string;
  onNavigate: () => void;
}) {
  const [preview, setPreview] = useState<MegaItem | undefined>(
    () => items.find((i) => i.image) ?? items[0],
  );

  return (
    <div className="flex w-[880px] h-[320px] p-2.5 gap-2">
      {/* Left: the list */}
      <div className="flex-1 px-4 py-3 flex flex-col">
        <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-[0.15em] text-earth/40">
          {listLabel}
        </p>
        <div className="grid grid-cols-2 gap-1">
          {items.map((item) => {
            const isActive = preview?.id === item.id;
            return (
              <TransitionLink
                key={item.id}
                href={item.href}
                onClick={onNavigate}
                onMouseEnter={() => setPreview(item)}
                onFocus={() => setPreview(item)}
                className={`group flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 transition-all duration-300 ${
                  isActive ? 'bg-white/60 shadow-sm' : 'hover:bg-earth/5'
                }`}
              >
                <span className={`font-display text-[15px] font-medium tracking-tight transition-colors duration-300 ${
                  isActive ? 'text-earth-dark' : 'text-earth-dark/60 group-hover:text-earth-dark'
                }`}>
                  {item.name}
                </span>
                {item.comingSoon ? (
                  <span className="shrink-0 rounded-full bg-sage/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-sage">
                    Yakında
                  </span>
                ) : (
                  <ArrowRight className={`w-3.5 h-3.5 shrink-0 transition-all duration-300 ${
                    isActive ? 'text-earth/40 translate-x-0' : 'text-earth/0 -translate-x-2 group-hover:text-earth/40 group-hover:translate-x-0'
                  }`} />
                )}
              </TransitionLink>
            );
          })}
        </div>
        <TransitionLink
          href={footerHref}
          onClick={onNavigate}
          className="mt-auto group flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-medium text-earth transition-colors hover:bg-earth/5"
        >
          {footerLabel}
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </TransitionLink>
      </div>

      {/* Right: live preview */}
      <PreviewPane image={preview?.image} title={preview?.name} eyebrow={previewLabel} />
    </div>
  );
}

function PreviewPane({
  image,
  title,
  eyebrow,
}: {
  image?: string;
  title?: string;
  eyebrow: string;
}) {
  return (
    <div className="relative w-[420px] shrink-0 overflow-hidden bg-sand rounded-[1.25rem]">
      <AnimatePresence mode="wait">
        {image ? (
          <motion.img
            key={image}
            src={image}
            alt={title ?? ''}
            initial={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          // No imagery yet (e.g. a "coming soon" category) — warm placeholder.
          <motion.div
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-br from-sand to-sage-light"
          />
        )}
      </AnimatePresence>
      {/* Legibility scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-earth-dark/75 via-earth-dark/10 to-transparent pointer-events-none" />
      <AnimatePresence mode="wait">
        <motion.div
          key={title || 'empty'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative flex h-full flex-col justify-end p-5 text-sand-light pointer-events-none"
        >
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-sand-light/70">
            {eyebrow}
          </span>
          <span className="mt-1 font-display text-2xl font-medium tracking-tight leading-tight">
            {title}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Heart,
  Share2,
  Check,
  MessageCircle,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  Truck,
  Wrench,
} from 'lucide-react';
import { ASSETS, priceLabel, getOptionGroups, AVAILABILITY_LABEL, type Product } from '../data';
import { useContact } from './SiteSettingsProvider';
import { TransitionLink } from './TransitionLink';
import { Navbar } from './Navbar';

// Signature easing — a soft, confident settle used across the page.
const EASE = [0.22, 1, 0.36, 1] as const;

const MATERIAL_RE = /malzeme|materyal|material/i;
const CARE_RE = /bak[ıi]m|care/i;
const COLOR_RE = /renk|color/i;

const AVAILABILITY_PILL: Record<string, string> = {
  'in-stock': 'bg-sage-light/70 text-earth',
  'made-to-order': 'bg-sand text-earth',
  'sold-out': 'bg-rose-100 text-rose-700',
  'coming-soon': 'bg-sand text-earth/70',
};

const PROMISES = [
  { icon: ShieldCheck, title: '5-Year Warranty', sub: 'Structural guarantee on every frame' },
  { icon: Truck, title: 'Free Delivery', sub: 'White-glove, straight to your space' },
  { icon: Wrench, title: 'Assembly Included', sub: 'Placed exactly where you want it' },
];

function AccordionItem({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="font-display text-[15px] font-medium text-earth-dark">{title}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-earth/50 transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="pb-4 pr-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ProductExperience({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const contact = useContact();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [copied, setCopied] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Config options — one selector per axis (colour, material, …).
  const optionGroups = getOptionGroups(product);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() =>
    Object.fromEntries(optionGroups.map((g) => [g.title, g.values[0]?.label ?? ''])),
  );

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollLeft, clientWidth } = e.currentTarget;
    const idx = Math.round(scrollLeft / clientWidth);
    if (idx !== activeIndex) setActiveIndex(idx);
  };

  const goToImage = (idx: number) => {
    setActiveIndex(idx);
    const el = carouselRef.current;
    if (el) el.scrollTo({ left: idx * el.clientWidth, behavior: 'smooth' });
  };

  const handleWhatsApp = () => {
    const optionNote = optionGroups
      .map((g) => selectedOptions[g.title])
      .filter(Boolean)
      .join(' / ');
    const optionPart = optionNote ? ` – ${optionNote}` : '';
    const text = encodeURIComponent(
      `Merhaba, ${product.name}${optionPart} (${priceLabel(product)}) ile ilgileniyorum. Daha fazla bilgi alabilir miyim?`
    );
    window.open(`https://wa.me/${contact.whatsapp}?text=${text}`, '_blank');
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      /* user dismissed the share sheet — nothing to do */
    }
  };

  const relatedItems = related.slice(0, 4);

  // Material & care come from dedicated fields (fallback: matching spec labels);
  // everything else lands in the Specifications accordion.
  const materialText =
    product.material || product.specs.find((s) => MATERIAL_RE.test(s.label))?.value || '';
  const careText =
    product.care || product.specs.find((s) => CARE_RE.test(s.label))?.value || '';
  const specRows = product.specs.filter(
    (s) => !MATERIAL_RE.test(s.label) && !CARE_RE.test(s.label) && !COLOR_RE.test(s.label),
  );

  return (
    <div className="flex min-h-screen w-full justify-center bg-sand text-earth-dark selection:bg-earth selection:text-sand-light">
      <div className="relative min-h-screen w-full max-w-[460px] overflow-x-hidden bg-sand-light">

        {/* Site navbar — transparent over the hero, solid on scroll */}
        <Navbar />

        {/* ─── Immersive Hero ─────────────────────────────────────── */}
        <section className="relative h-[66vh] min-h-[440px] w-full bg-sand">
          <div
            ref={carouselRef}
            onScroll={handleScroll}
            className="no-scrollbar flex h-full w-full snap-x snap-mandatory overflow-x-auto"
          >
            {product.images.map((img, idx) => (
              <div key={idx} className="relative h-full w-full shrink-0 snap-center">
                <img
                  src={img}
                  alt={idx === 0 ? product.imageAlt || product.name : `${product.name} — view ${idx + 1}`}
                  className="h-full w-full object-cover object-center"
                />
              </div>
            ))}
          </div>

          {/* Legibility scrims — a soft warm lift under the navbar, and a blend into the sheet */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-sand-light/50 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-sand-light via-sand-light/40 to-transparent" />

          {/* Gallery progress — centered */}
          {product.images.length > 1 && (
            <div className="absolute inset-x-0 bottom-0 z-20 flex justify-center pb-8">
              <div className="flex items-center gap-1.5">
                {product.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToImage(idx)}
                    aria-label={`View image ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === activeIndex ? 'w-6 bg-earth-dark' : 'w-1.5 bg-earth-dark/25'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ─── Content Sheet ──────────────────────────────────────── */}
        <motion.main
          initial={reduce ? false : { y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative z-10 -mt-6 rounded-t-[2rem] bg-sand-light px-5 pt-4 shadow-[0_-12px_40px_rgba(0,0,0,0.05)]"
        >
          {/* Tag kicker · Title + actions · Price */}
          {product.tag && (
            <span className="inline-flex rounded-full bg-earth-dark px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-sand-light">
              {product.tag}
            </span>
          )}
          <div className="mt-2 flex items-start justify-between gap-4">
            <h1 className="font-display text-[2rem] font-medium leading-[1.08] tracking-tight text-earth-dark">
              {product.name}
            </h1>
            <div className="flex shrink-0 gap-2 pt-1.5">
              <button
                onClick={() => setIsWishlisted((v) => !v)}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Save this piece'}
                className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all active:scale-95 ${
                  isWishlisted
                    ? 'border-rose-500 bg-rose-500 text-white'
                    : 'border-earth/15 text-earth-dark hover:bg-earth/5'
                }`}
              >
                <Heart className="h-[17px] w-[17px]" fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={handleShare}
                aria-label="Share this piece"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-earth/15 text-earth-dark transition-all hover:bg-earth/5 active:scale-95"
              >
                {copied ? <Check className="h-[17px] w-[17px]" /> : <Share2 className="h-[17px] w-[17px]" />}
              </button>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <p className="font-sans text-2xl text-earth/70">{priceLabel(product)}</p>
            {product.availability && (
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${AVAILABILITY_PILL[product.availability] ?? 'bg-sand text-earth'}`}
              >
                {AVAILABILITY_LABEL[product.availability]}
              </span>
            )}
          </div>

          {/* Config — one selector per option axis (colour, material, …) */}
          {optionGroups.map((group) => (
            <div key={group.title} className="mt-7">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-widest text-earth/45">{group.title}</span>
                <span className="text-[13px] font-medium text-earth-dark">{selectedOptions[group.title]}</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {group.values.map((v) => {
                  const active = v.label === selectedOptions[group.title];
                  const select = () => setSelectedOptions((s) => ({ ...s, [group.title]: v.label }));
                  const ring = active
                    ? 'ring-2 ring-earth-dark ring-offset-2 ring-offset-sand-light'
                    : 'ring-1 ring-black/10 hover:ring-black/25';
                  if (v.hex) {
                    return (
                      <button
                        key={v.label}
                        onClick={select}
                        aria-label={v.label}
                        aria-pressed={active}
                        style={{ backgroundColor: v.hex }}
                        className={`h-9 w-9 rounded-full transition-all ${ring}`}
                      />
                    );
                  }
                  if (v.swatch) {
                    return (
                      <button
                        key={v.label}
                        onClick={select}
                        aria-label={v.label}
                        aria-pressed={active}
                        className={`h-9 w-9 overflow-hidden rounded-full transition-all ${ring}`}
                      >
                        <img src={v.swatch} alt={v.label} className="h-full w-full object-cover" />
                      </button>
                    );
                  }
                  return (
                    <button
                      key={v.label}
                      onClick={select}
                      aria-pressed={active}
                      className={`h-9 rounded-full px-4 text-[13px] font-medium transition-all ${
                        active
                          ? 'bg-earth-dark text-sand-light'
                          : 'text-earth-dark ring-1 ring-black/10 hover:ring-black/25'
                      }`}
                    >
                      {v.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* About */}
          <section className="mt-9">
            <h2 className="mb-3 font-display text-base font-medium text-earth-dark">About this piece</h2>
            <p className="text-[15px] leading-relaxed text-earth/70">{product.description}</p>
          </section>

          {/* Details accordion */}
          <section className="mt-8">
            <div className="divide-y divide-earth/10 border-y border-earth/10">
              {materialText && (
                <AccordionItem title="Malzemeler" defaultOpen>
                  <ul className="space-y-1.5">
                    {materialText.split(',').map((m, idx) => (
                      <li key={idx} className="text-[14px] leading-relaxed text-earth/70">
                        {m.trim()}
                      </li>
                    ))}
                  </ul>
                </AccordionItem>
              )}

              {specRows.length > 0 && (
                <AccordionItem title="Specifications" defaultOpen={!materialText}>
                  <dl className="space-y-3">
                    {specRows.map((s, idx) => (
                      <div key={idx} className="flex items-start justify-between gap-6">
                        <dt className="shrink-0 text-[13px] text-earth/45">{s.label}</dt>
                        <dd className="text-right text-[13px] font-medium text-earth-dark">{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                </AccordionItem>
              )}

              {careText && (
                <AccordionItem title="Bakım ve temizlik">
                  <p className="text-[14px] leading-relaxed text-earth/70">{careText}</p>
                </AccordionItem>
              )}
            </div>
          </section>

          {/* The Formet promise */}
          <section className="mt-10">
            <h2 className="mb-4 font-display text-base font-medium text-earth-dark">The Formet promise</h2>
            <div className="space-y-3">
              {PROMISES.map(({ icon: Icon, title, sub }) => (
                <div key={title} className="flex items-center gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage-light/70 text-earth">
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-tight text-earth-dark">{title}</p>
                    <p className="text-xs text-earth/50">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Pairs well with — its own band; first card centered, next peeks in from the right */}
          {relatedItems.length > 0 && (
            <section className="-mx-5 mt-12 bg-sand py-9">
              <div className="mb-5 flex items-end justify-between px-5">
                <h2 className="font-display text-base font-medium text-earth-dark">Pairs well with</h2>
                <TransitionLink
                  href={`/products?category=${product.category}`}
                  className="flex items-center gap-1 text-xs font-medium text-earth/55"
                >
                  View all <ChevronRight className="h-3.5 w-3.5" />
                </TransitionLink>
              </div>
              <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-[12%]">
                {relatedItems.map((r) => (
                  <TransitionLink
                    key={r.id}
                    href={`/products/${r.slug}`}
                    className="group w-[76%] shrink-0 snap-center"
                  >
                    <div className="relative mb-3 aspect-[4/5] overflow-hidden rounded-2xl bg-sand-light shadow-sm">
                      <img
                        src={r.image}
                        alt={r.name}
                        className="h-full w-full object-cover object-center transition-transform duration-700 group-active:scale-105"
                      />
                    </div>
                    <div className="flex items-baseline justify-between gap-2 px-0.5">
                      <p className="truncate font-display text-sm font-medium text-earth-dark">{r.name}</p>
                      <p className="shrink-0 text-[13px] text-earth/55">{priceLabel(r)}</p>
                    </div>
                  </TransitionLink>
                ))}
              </div>
            </section>
          )}
        </motion.main>

        {/* Footer — opaque white band that runs to the bottom of the page */}
        <footer className="bg-white px-5 pb-28 pt-10 text-center">
          <img
            src={ASSETS.formetWordmarkBlack}
            alt="Formet"
            className="mx-auto h-3.5 w-auto opacity-70"
          />
          <p className="mt-3 text-[11px] text-earth/40">Handcrafted outdoor living · İzmir</p>
          <p className="mt-1 text-[11px] text-earth/30">© 2026 Formet. All rights reserved.</p>
        </footer>

        {/* ─── Floating Inquire CTA ───────────────────────────────── */}
        <motion.div
          initial={reduce ? false : { y: 90 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.25 }}
          className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center"
        >
          <div className="w-full max-w-[460px] bg-gradient-to-t from-sand-light via-sand-light/85 to-transparent px-4 pb-[calc(0.85rem+env(safe-area-inset-bottom))] pt-12">
            <button
              onClick={handleWhatsApp}
              className="pointer-events-auto flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] py-4 text-[15px] font-medium text-white shadow-xl shadow-[#25D366]/30 transition-transform active:scale-[0.98]"
            >
              <MessageCircle className="h-5 w-5" />
              Inquire on WhatsApp
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

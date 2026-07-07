'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, ChevronRight, ChevronDown, Plus, Share2, Heart, ShieldCheck, Truck, Wrench } from 'lucide-react';
import { formatPrice, type Product } from '../data';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { TransitionLink } from './TransitionLink';

// Signature easing — a soft, confident settle used across the page.
const EASE = [0.22, 1, 0.36, 1] as const;

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
        className="flex w-full items-center justify-between py-4 text-left cursor-pointer"
      >
        <span className="font-display text-base font-medium text-earth-dark">{title}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-earth/50 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
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
            <div className="pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const PROMISES = [
  { icon: ShieldCheck, title: '5 Yıl Garanti', sub: 'Tüm iskeletlerde yapısal garanti' },
  { icon: Truck, title: 'Ücretsiz Teslimat', sub: 'Beyaz eldiven hizmetiyle kapınıza' },
  { icon: Wrench, title: 'Montaj Dahil', sub: 'Tam istediğiniz yere yerleştirilir' },
];

const categoryLabelTR = (c: string) => (c === 'details' ? 'Aksesuarlar' : c);

// English spec labels (from data) → Turkish, so the accordion rows read consistently.
const SPEC_LABEL_TR: Record<string, string> = {
  Materials: 'Malzemeler',
  Dimensions: 'Boyutlar',
  Weight: 'Ağırlık',
  Care: 'Bakım',
  Seating: 'Oturma Kapasitesi',
  Includes: 'İçindekiler',
  Colors: 'Renkler',
};

interface ProductDetailClientProps {
  product: Product;
  related: Product[];
}

export function ProductDetailClient({ product, related }: ProductDetailClientProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Config options — only shown when the product actually offers a choice.
  const colorOptions = product.colors ?? [];
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]?.name ?? '');

  // Each topic becomes its own accordion; colors drive the selector.
  const materialSpec = product.specs.find((s) => s.label.toLowerCase() === 'materials');
  const careSpec = product.specs.find((s) => s.label.toLowerCase() === 'care');
  const detailRows = product.specs.filter((s) => {
    const l = s.label.toLowerCase();
    return l !== 'colors' && l !== 'care' && l !== 'materials';
  });

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.clientWidth;
    const newIndex = Math.round(scrollLeft / width);
    if (newIndex !== activeImageIndex) {
      setActiveImageIndex(newIndex);
    }
  };

  const handleThumbnailClick = (index: number) => {
    setActiveImageIndex(index);
    if (carouselRef.current) {
      const scrollWidth = carouselRef.current.scrollWidth;
      const indexWidth = scrollWidth / (product.images.length || 1);
      carouselRef.current.scrollTo({
        left: index * indexWidth,
        behavior: 'smooth',
      });
    }
  };

  const relatedProducts = related.slice(0, 3);

  const handleWhatsApp = () => {
    const colorNote = selectedColor ? ` – ${selectedColor}` : '';
    const text = encodeURIComponent(
      `Merhaba, ${product.name}${colorNote} (${formatPrice(product.price)}) ile ilgileniyorum. Daha fazla bilgi alabilir miyim?`
    );
    window.open(`https://wa.me/1234567890?text=${text}`, '_blank');
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-sand-light text-earth-dark selection:bg-earth selection:text-sand-light overflow-x-hidden">
      <Navbar forceDarkText />

      {/* Breadcrumb */}
      <div className="pt-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.nav
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 text-sm text-earth/50"
          >
            <TransitionLink href="/" className="hover:text-earth transition-colors">
              Anasayfa
            </TransitionLink>
            <ChevronRight className="w-3.5 h-3.5" />
            <TransitionLink href="/products" className="hover:text-earth transition-colors">
              Ürünler
            </TransitionLink>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-earth-dark font-medium truncate max-w-[200px]">
              {product.name}
            </span>
          </motion.nav>
        </div>
      </div>

      {/* Product Hero Section */}
      <section className="px-6 lg:px-8 pt-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
            {/* ─── Image Gallery ─── */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="w-full lg:w-[58%] flex flex-col gap-4"
            >
              {/* Main Image */}
              <div className="relative aspect-[4/3] lg:aspect-[5/4] rounded-3xl overflow-hidden bg-sand">
                <div
                  ref={carouselRef}
                  onScroll={handleScroll}
                  className="flex overflow-x-auto snap-x snap-mandatory w-full h-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                >
                  {product.images.map((img, idx) => (
                    <div key={idx} className="w-full h-full flex-shrink-0 snap-center relative">
                      <img
                        src={img}
                        alt={`${product.name} — görünüm ${idx + 1}`}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                  ))}
                </div>

                {/* Tag badge */}
                <div className="absolute top-5 left-5 glass px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide">
                  {product.tag}
                </div>

                {/* Actions overlay */}
                <div className="absolute top-5 right-5 flex gap-2">
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`p-2.5 rounded-full backdrop-blur-md shadow-lg transition-all cursor-pointer ${isWishlisted
                        ? 'bg-rose-500 text-white'
                        : 'bg-white/70 text-earth-dark hover:bg-white'
                      }`}
                    aria-label="Favorilere ekle"
                  >
                    <Heart className="w-4 h-4" fill={isWishlisted ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2.5 bg-white/70 backdrop-blur-md rounded-full shadow-lg text-earth-dark hover:bg-white transition-all cursor-pointer"
                    aria-label="Ürünü paylaş"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Image counter */}
                {product.images.length > 1 && (
                  <div className="absolute bottom-5 right-5 glass-dark px-3 py-1.5 rounded-full text-xs font-medium text-white/90">
                    {activeImageIndex + 1} / {product.images.length}
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 overflow-x-auto py-2 -my-2 px-1 -mx-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleThumbnailClick(idx)}
                    className={`relative flex-1 aspect-square rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${idx === activeImageIndex
                        ? 'ring-2 ring-earth-dark ring-offset-2 ring-offset-sand-light shadow-lg'
                        : 'opacity-60 hover:opacity-90 saturate-[0.7] hover:saturate-100'
                      }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} küçük görsel ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* ─── Product Info ─── */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
              className="w-full lg:w-[42%] flex flex-col"
            >
              {/* Title & Price */}
              <h1 className="text-4xl lg:text-5xl font-display font-medium leading-[1.1] mb-3">
                {product.name}
              </h1>
              <p className="font-sans font-normal text-3xl text-earth/60">
                {formatPrice(product.price)}
              </p>

              {/* Config — color selector (only when the product offers a choice) */}
              {colorOptions.length > 0 && (
                <div className="mt-7">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-xs uppercase tracking-[0.2em] text-earth/40 font-medium">Renk</span>
                    <span className="text-sm font-medium text-earth-dark">{selectedColor}</span>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {colorOptions.map((c) => {
                      const active = c.name === selectedColor;
                      return (
                        <button
                          key={c.name}
                          onClick={() => setSelectedColor(c.name)}
                          aria-label={c.name}
                          aria-pressed={active}
                          style={{ backgroundColor: c.hex }}
                          className={`h-9 w-9 rounded-full transition-all cursor-pointer ${active
                              ? 'ring-2 ring-earth-dark ring-offset-2 ring-offset-sand-light'
                              : 'ring-1 ring-black/10 hover:ring-black/25'
                            }`}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Divider */}
              <div className="h-px bg-earth/10 my-8" />

              {/* Description */}
              <div className="mb-10">
                <h2 className="font-display font-medium text-lg mb-4 text-earth-dark">
                  Bu parça hakkında
                </h2>
                <p className="text-earth/70 leading-relaxed text-base lg:text-lg">
                  {product.description}
                </p>
              </div>

              {/* Details — a distinct accordion per section */}
              <div className="mb-10">
                <div className="divide-y divide-earth/10 border-y border-earth/10">
                  {materialSpec && (
                    <AccordionItem title="Malzemeler" defaultOpen>
                      <ul className="space-y-1.5">
                        {materialSpec.value.split(',').map((m, idx) => (
                          <li key={idx} className="text-sm leading-relaxed text-earth/70">
                            {m.trim()}
                          </li>
                        ))}
                      </ul>
                    </AccordionItem>
                  )}
                  {detailRows.length > 0 && (
                    <AccordionItem title="Boyutlar ve detaylar" defaultOpen={!materialSpec}>
                      <dl className="space-y-3">
                        {detailRows.map((spec, idx) => (
                          <div key={idx} className="flex items-start justify-between gap-6">
                            <dt className="shrink-0 text-sm text-earth/50 font-medium">
                              {SPEC_LABEL_TR[spec.label] ?? spec.label}
                            </dt>
                            <dd className="text-right text-sm font-medium text-earth-dark">{spec.value}</dd>
                          </div>
                        ))}
                      </dl>
                    </AccordionItem>
                  )}
                  {careSpec && (
                    <AccordionItem title="Bakım ve temizlik">
                      <p className="text-sm leading-relaxed text-earth/70">{careSpec.value}</p>
                    </AccordionItem>
                  )}
                </div>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3 mb-10">
                {PROMISES.map(({ icon: Icon, title, sub }) => (
                  <div key={title} className="flex flex-col items-center text-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-sage-light/70 flex items-center justify-center text-earth shrink-0">
                      <Icon className="w-6 h-6" strokeWidth={1.75} />
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-earth-dark leading-tight">{title}</p>
                      <p className="text-[11px] text-earth/50 mt-0.5 leading-tight">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-auto">
                <button
                  onClick={handleWhatsApp}
                  className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-5 rounded-full font-medium flex items-center justify-center space-x-3 transition-colors cursor-pointer shadow-lg shadow-[#25D366]/20 text-lg"
                >
                  <MessageCircle className="w-6 h-6" />
                  <span>WhatsApp ile Bilgi Al</span>
                </button>
                <p className="text-center text-xs text-earth/40 mt-3">
                  Genellikle 2 saat içinde yanıt verir
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="px-6 lg:px-8 pb-24">
          <div className="max-w-7xl mx-auto">
            <div className="h-px bg-earth/10 mb-16" />

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-end justify-between mb-10">
                <div>
                  <h2 className="text-3xl font-display font-semibold mb-2">
                    Şunlar da hoşunuza gidebilir
                  </h2>
                  <p className="text-earth/50 text-base">
                    <span className="font-medium text-earth-dark capitalize">
                      {categoryLabelTR(product.category)}
                    </span>{' '}
                    koleksiyonundan daha fazlası
                  </p>
                </div>
                <TransitionLink
                  href={`/products?category=${product.category}`}
                  className="flex items-center gap-1.5 text-sm font-medium text-earth/60 hover:text-earth-dark transition-colors"
                >
                  Tümünü gör
                  <ChevronRight className="w-4 h-4" />
                </TransitionLink>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {relatedProducts.map((related, index) => (
                <motion.div
                  key={related.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                    ease: 'easeOut',
                  }}
                >
                  <TransitionLink
                    href={`/products/${related.slug}`}
                    className="group block"
                  >
                    <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-sand mb-5">
                      <img
                        src={related.image}
                        alt={related.name}
                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-md w-9 h-9 flex items-center justify-center rounded-full shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-earth-dark hover:text-white">
                        <Plus className="w-4 h-4" />
                      </div>
                      {/* Tag & Price Container */}
                      <div className="absolute bottom-4 left-4 flex items-center z-10 transition-all duration-500 gap-0 group-hover:gap-2">
                        <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-full font-sans font-normal text-base tracking-wide text-earth-dark whitespace-nowrap overflow-hidden transition-all duration-500 max-w-0 opacity-0 group-hover:max-w-[120px] group-hover:opacity-100 flex items-center h-9 px-0 group-hover:px-4">
                          {formatPrice(related.price)}
                        </div>
                        <div className="bg-white/80 backdrop-blur-md shadow-lg px-3.5 rounded-full font-sans font-medium text-[11px] tracking-widest uppercase text-earth-dark transition-all duration-500 flex items-center h-9">
                          {related.tag}
                        </div>
                      </div>
                    </div>
                    <div className="px-1">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="text-[20px] font-display font-medium group-hover:text-earth transition-colors leading-tight">
                          {related.name}
                        </h3>
                        <span className="font-sans font-normal text-lg text-earth/70 whitespace-nowrap pt-0.5">
                          {formatPrice(related.price)}
                        </span>
                      </div>
                    </div>
                  </TransitionLink>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}

import { X, Heart, ChevronLeft, ChevronRight, ArrowRight, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence, useDragControls, PanInfo } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { TransitionLink } from './TransitionLink';
import { priceLabel, getOptionGroups, type Product } from '../data';
import { useContact } from './SiteSettingsProvider';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const contact = useContact();

  // Mobile carousel state (unchanged bottom-sheet behaviour).
  const [activeImage, setActiveImage] = useState(0);
  const [hasSwiped, setHasSwiped] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const dragControls = useDragControls();
  const carouselRef = useRef<HTMLDivElement>(null);

  // Desktop gallery: a sliding window of two images.
  const [galleryStart, setGalleryStart] = useState(0);
  // Desktop option selection (colour / material / …).
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  // Portal target — the home content sits inside a scroll-scaled `motion.div`,
  // and a transformed ancestor makes `position: fixed` resolve against it
  // instead of the viewport. Rendering into `document.body` escapes that.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const optionGroups = product ? getOptionGroups(product) : [];

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!hasSwiped) setHasSwiped(true);
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.clientWidth;
    const newIndex = Math.round(scrollLeft / width);
    if (newIndex !== activeImage) {
      setActiveImage(newIndex);
    }
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onClose();
    }
  };

  // Reset per-product state whenever a new product opens.
  useEffect(() => {
    setGalleryStart(0);
    setActiveImage(0);
    setHasSwiped(false);
    setIsLiked(false);
    setSelectedOptions(
      Object.fromEntries(optionGroups.map((g) => [g.title, g.values[0]?.label ?? ''])),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  // Lock scroll + Escape-to-close while open.
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', onKey);
      return () => {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        window.removeEventListener('keydown', onKey);
      };
    }
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }, [isOpen, onClose]);

  if (!product) return null;

  const images: string[] = product.images?.length ? product.images : [product.image];
  const len = images.length;

  // Desktop: single image gallery
  const currentImg = images[galleryStart % len];
  const showArrows = len > 1;
  const stepGallery = (dir: number) =>
    setGalleryStart((s) => (s + dir + len) % len);

  const waHref = () => {
    const optionNote = optionGroups
      .map((g) => selectedOptions[g.title])
      .filter(Boolean)
      .join(' / ');
    const optionPart = optionNote ? ` – ${optionNote}` : '';
    const text = encodeURIComponent(
      `Merhaba, ${product.name}${optionPart} (${priceLabel(product)}) ile ilgileniyorum. Daha fazla bilgi alabilir miyim?`,
    );
    return `https://wa.me/${contact.whatsapp}?text=${text}`;
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-earth-dark/40 backdrop-blur-[2px] z-[70]"
            onClick={onClose}
          />

          {/* ─────────────── Mobile: bottom sheet (unchanged) ─────────────── */}
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={handleDragEnd}
            className="md:hidden fixed inset-x-0 bottom-0 z-[70] bg-sand-light rounded-t-3xl max-h-[90vh] flex flex-col overflow-hidden"
          >
            {/* Drag handle */}
            <div className="absolute top-0 inset-x-0 z-30 flex justify-center pt-4 pb-4 pointer-events-none">
              <div
                className="w-12 h-1.5 bg-white/90 rounded-full touch-none cursor-grab active:cursor-grabbing pointer-events-auto shadow-md"
                onPointerDown={(e) => dragControls.start(e)}
                onClick={onClose}
              />
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="relative w-full overflow-hidden">
                <div
                  ref={carouselRef}
                  onScroll={handleScroll}
                  className="flex overflow-x-auto snap-x snap-mandatory w-full bg-sand [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                >
                  {images.map((img, idx) => (
                    <div key={idx} className="aspect-[3/2] flex-shrink-0 w-full snap-center relative">
                      <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLiked(!isLiked);
                  }}
                  className={`absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full glass shadow-lg transition-all duration-300 cursor-pointer ${
                    isLiked ? 'text-red-500' : 'text-earth-dark hover:text-red-500'
                  }`}
                >
                  <Heart className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} />
                </button>

                {len > 1 && hasSwiped && (
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none animate-in fade-in duration-500">
                    {images.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${activeImage === idx ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col px-4 pb-4 pt-4 relative z-10 -mt-6 rounded-t-3xl bg-sand-light shadow-[0_-16px_40px_rgba(255,255,255,0.6)]">
                <div className="flex justify-between items-start gap-3">
                  <h2 className="text-lg font-display font-medium text-earth-dark">{product.name}</h2>
                  <div className="font-sans font-normal text-base text-earth/60 whitespace-nowrap pt-0.5">
                    {priceLabel(product)}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 bg-sand-light/95 backdrop-blur-xl z-30 p-4 border-t border-earth/10 flex gap-3">
              <a
                href={waHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center bg-earth-dark text-white py-3 rounded-full text-sm font-medium hover:bg-earth transition-colors"
              >
                WhatsApp ile Sipariş Ver
              </a>
              <TransitionLink
                href={`/products/${product.slug}`}
                onClick={onClose}
                className="p-3 rounded-full border border-earth/20 hover:border-earth-dark transition-colors bg-sand-light flex items-center justify-center"
              >
                <ArrowRight className="w-5 h-5 text-earth-dark" />
              </TransitionLink>
            </div>
          </motion.div>

          {/* ─────────────── Desktop: centered quick-view card ─────────────── */}
          <div className="hidden md:flex fixed inset-0 z-[70] items-center justify-center p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              className="pointer-events-auto w-full max-w-2xl max-h-[96vh] flex flex-col bg-sand-light rounded-3xl shadow-2xl shadow-earth-dark/20 overflow-hidden relative"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                aria-label="Kapat"
                className="absolute top-4 right-4 z-50 w-9 h-9 flex items-center justify-center rounded-full glass shadow-lg text-earth-dark hover:scale-105 transition-transform cursor-pointer bg-white/50 backdrop-blur-md"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Gallery */}
              <div className="relative shrink-0 bg-sand">
                <div className="aspect-[3/2] w-full overflow-hidden bg-sand relative shadow-sm">
                  <img src={currentImg} alt={product.name} className="w-full h-full object-cover absolute inset-0" />
                </div>



                {showArrows && (
                  <>
                    <button
                      onClick={() => stepGallery(-1)}
                      aria-label="Önceki görsel"
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center rounded-full glass shadow-lg text-earth-dark hover:scale-105 transition-transform cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => stepGallery(1)}
                      aria-label="Sonraki görsel"
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center rounded-full glass shadow-lg text-earth-dark hover:scale-105 transition-transform cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 pt-5 pb-5 relative z-10 -mt-6 rounded-t-3xl bg-sand-light shadow-[0_-16px_40px_rgba(255,255,255,0.6)]">
                {product.collectionName && (
                  <span className="mb-1 inline-block text-[11px] uppercase tracking-[0.2em] text-earth/50">
                    {product.collectionName}
                  </span>
                )}

                <div className="flex items-start gap-3">
                  <h2 className="text-2xl font-display font-medium text-earth-dark leading-tight">
                    {product.name}
                  </h2>
                  {product.tag && (
                    <span className="mt-1 shrink-0 bg-earth-dark text-white text-[10px] font-medium uppercase tracking-wider px-2.5 py-1 rounded-full">
                      {product.tag}
                    </span>
                  )}
                </div>

                <div className="mt-2 flex items-center gap-3">
                  <span className="font-sans font-normal text-lg text-earth/70">
                    {priceLabel(product)}
                  </span>
                </div>

                {/* Option selectors */}
                {optionGroups.map((group) => (
                  <div key={group.title} className="mt-4">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-xs uppercase tracking-[0.2em] text-earth/40 font-medium">
                        {group.title}
                      </span>
                      <span className="text-sm font-medium text-earth-dark">
                        {selectedOptions[group.title]}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      {group.values.map((v) => {
                        const active = v.label === selectedOptions[group.title];
                        const select = () =>
                          setSelectedOptions((s) => ({ ...s, [group.title]: v.label }));
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
                              className={`h-9 w-9 rounded-full transition-all cursor-pointer ${ring}`}
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
                              className={`h-9 w-9 overflow-hidden rounded-full transition-all cursor-pointer ${ring}`}
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
                            className={`h-9 rounded-full px-4 text-sm font-medium transition-all cursor-pointer ${
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

                <div className="h-px bg-earth/10 my-4" />

                {/* Actions */}
                <a
                  href={waHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 bg-earth-dark text-white py-3 rounded-full text-sm font-medium hover:bg-earth transition-colors shadow-lg shadow-earth-dark/20"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp ile Sipariş Ver
                </a>
                <TransitionLink
                  href={`/products/${product.slug}`}
                  onClick={onClose}
                  className="mt-3 flex items-center justify-center gap-1.5 text-[13px] font-medium text-earth-dark hover:text-earth transition-colors group"
                >
                  Detayları Gör
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </TransitionLink>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}

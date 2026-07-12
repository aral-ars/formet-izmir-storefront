'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Grid3x3, LayoutList, ChevronDown, Plus, X, ArrowUpDown, Check } from 'lucide-react';
import { priceLabel, type Product } from '../../data';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { TextReveal, LineReveal } from '../../components/TextReveal';
import { SpotlightCard } from '../../components/SpotlightCard';
import { TransitionLink } from '../../components/TransitionLink';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';
type ViewMode = 'grid' | 'list';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Öne Çıkanlar' },
  { value: 'price-asc', label: 'Fiyat: Düşükten Yükseğe' },
  { value: 'price-desc', label: 'Fiyat: Yüksekten Düşüğe' },
  { value: 'name-asc', label: 'İsim: A\'dan Z\'ye' },
  { value: 'name-desc', label: 'İsim: Z\'den A\'ya' },
];

type Category = {
  id: string;
  name: string;
  image: string;
  description?: string;
  hasProducts: boolean;
};

type ProductsViewProps = {
  products: Product[];
  categories: Category[];
  // Initial filters, e.g. from /products?category=lounge or ?collection=rattan.
  initialCategory?: string;
  initialCollection?: string;
};

// One entry in the collection rail: a value to filter by, plus the imagery/count
// shown on the tile. `all` is synthesised from every product.
type RailItem = { value: string; label: string; image: string; count: number };

export function ProductsView({
  products,
  categories,
  initialCategory,
  initialCollection,
}: ProductsViewProps) {
  const [selectedCategory, setSelectedCategory] = useState(
    initialCategory && categories.some((c) => c.id === initialCategory) ? initialCategory : 'all',
  );
  // Collection is an orthogonal filter (marketing series) that ANDs with category.
  const [selectedCollection, setSelectedCollection] = useState(initialCollection ?? '');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Product count per category id — drives the "N ürün" line on each rail tile.
  const countsByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of products) counts[p.category] = (counts[p.category] ?? 0) + 1;
    return counts;
  }, [products]);

  // The collection rail: an "all" tile followed by every category that actually
  // has products, so a tile never resolves to an empty grid.
  const RAIL: RailItem[] = useMemo(
    () => [
      { value: 'all', label: 'Tüm Ürünler', image: products[0]?.image ?? '', count: products.length },
      ...categories
        .filter((c) => c.hasProducts)
        .map((c) => ({
          value: c.id,
          label: c.name,
          image: c.image,
          count: countsByCategory[c.id] ?? 0,
        })),
    ],
    [categories, products, countsByCategory],
  );

  // Display name of the active collection, derived from the products themselves.
  const activeCollectionName = useMemo(() => {
    if (!selectedCollection) return '';
    return (
      products.find((p) => p.collection === selectedCollection)?.collectionName ??
      selectedCollection
    );
  }, [products, selectedCollection]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(
      (p) =>
        (selectedCategory === 'all' || p.category === selectedCategory) &&
        (!selectedCollection || p.collection === selectedCollection),
    );

    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return filtered;
  }, [products, selectedCategory, selectedCollection, sortBy]);

  const activeCategoryLabel = RAIL.find(c => c.value === selectedCategory)?.label || 'Tüm Ürünler';
  const activeSortLabel = SORT_OPTIONS.find(s => s.value === sortBy)?.label || 'Öne Çıkanlar';

  return (
    <div className="min-h-screen bg-sand-light text-earth-dark selection:bg-earth selection:text-sand-light overflow-x-hidden">
      <Navbar forceDarkText />

      {/* Hero Banner */}
      <section className="pt-28 sm:pt-32 pb-8 sm:pb-10 px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[400px] h-[400px] bg-earth/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 left-0 -ml-20 w-[300px] h-[300px] bg-sand-dark/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 text-[13px] font-medium tracking-wide text-earth/40 mb-10 uppercase"
          >
            <a href="/" className="hover:text-earth transition-colors">Anasayfa</a>
            <span>/</span>
            <span className="text-earth-dark">Ürünler</span>
          </motion.div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-6">
            <div className="max-w-2xl">
              <TextReveal
                as="h1"
                className="text-4xl sm:text-5xl lg:text-6xl font-serif italic mb-4 leading-[1.1] tracking-tight"
                delay={0.1}
              >
                Koleksiyonumuz
              </TextReveal>
              <LineReveal className="text-base sm:text-lg text-earth/60 font-light leading-relaxed tracking-wide" delay={0.35}>
                Evinizin salonundaki konforu açık havaya taşımak için her parça en iyi malzemelerden özenle üretildi.
              </LineReveal>
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="hidden lg:block text-right"
            >
              <span className="block text-3xl font-display font-light text-earth-dark">{products.length}</span>
              <span className="text-xs uppercase tracking-widest text-earth/40">Özel Tasarım</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Unified Sticky Control Bar */}
      <section className="px-6 lg:px-8 sticky top-[72px] sm:top-[76px] z-40 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-7xl mx-auto"
        >
          <div className="relative bg-white/70 backdrop-blur-2xl rounded-2xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col sm:flex-row sm:items-center justify-between p-2 gap-4">
            
            {/* Category Pills (Scrollable) */}
            <div className="flex-1 overflow-x-auto no-scrollbar scroll-px-2">
              <div className="flex items-center gap-1.5 w-max px-2 sm:px-0">
                {RAIL.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${
                      selectedCategory === cat.value
                        ? 'text-earth-dark'
                        : 'text-earth/50 hover:text-earth-dark hover:bg-earth/5'
                    }`}
                  >
                    {selectedCategory === cat.value && (
                      <motion.div
                        layoutId="activeCategory"
                        className="absolute inset-0 bg-white rounded-xl shadow-sm border border-earth/5"
                        initial={false}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      {cat.label}
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        selectedCategory === cat.value 
                          ? 'bg-earth/10 text-earth-dark' 
                          : 'bg-earth/5 text-earth/40'
                      }`}>
                        {cat.count}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Controls (Sort + View Mode) */}
            <div className="flex items-center gap-3 px-2 sm:px-2 pb-2 sm:pb-0 shrink-0 border-t sm:border-t-0 border-earth/5 pt-3 sm:pt-0">
              <div className="relative shrink-0">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-earth/10 bg-white/50 text-sm font-medium hover:bg-white transition-colors cursor-pointer whitespace-nowrap"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-earth/50" />
                  <span className="hidden sm:inline text-earth-dark">{activeSortLabel}</span>
                  <span className="sm:hidden text-earth-dark">Sırala</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-earth/50 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {showSortDropdown && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowSortDropdown(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-[calc(100%+8px)] w-56 bg-white/95 backdrop-blur-3xl rounded-2xl border border-white/60 shadow-2xl py-2 z-20 overflow-hidden"
                      >
                        {SORT_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => { setSortBy(option.value); setShowSortDropdown(false); }}
                            className={`w-full text-left px-5 py-3 text-sm transition-colors cursor-pointer flex items-center justify-between ${
                              sortBy === option.value
                                ? 'bg-earth/5 text-earth-dark font-medium'
                                : 'text-earth/60 hover:bg-earth/5 hover:text-earth-dark'
                            }`}
                          >
                            {option.label}
                            {sortBy === option.value && <Check className="w-4 h-4 text-earth-dark" />}
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* View Mode Toggle */}
              <div className="hidden sm:flex items-center bg-earth/5 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'grid' ? 'bg-white shadow-sm text-earth-dark' : 'text-earth/40 hover:text-earth-dark'
                  }`}
                  aria-label="Grid view"
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'list' ? 'bg-white shadow-sm text-earth-dark' : 'text-earth/40 hover:text-earth-dark'
                  }`}
                  aria-label="List view"
                >
                  <LayoutList className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Active collection filter chip */}
      {selectedCollection && (
        <section className="px-6 lg:px-8 pb-2">
          <div className="max-w-7xl mx-auto flex items-center gap-2">
            <span className="text-sm text-earth/50">Koleksiyon:</span>
            <button
              onClick={() => setSelectedCollection('')}
              className="inline-flex items-center gap-1.5 rounded-full bg-earth-dark text-sand-light pl-3.5 pr-2.5 py-1.5 text-sm font-medium hover:bg-earth transition-colors cursor-pointer"
            >
              {activeCollectionName}
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      )}

      {/* Products Grid / List inside the signature rounded section shell */}
      <section className="px-6 lg:px-8 pt-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-[2rem] bg-sand/30 p-4 sm:p-6 lg:p-8">
            <AnimatePresence mode="wait">
              {filteredAndSortedProducts.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center py-24"
                >
                  <p className="text-2xl font-display text-earth/40 mb-4">Ürün bulunamadı</p>
                  <p className="text-earth/40 mb-8">Aradığınızı bulmak için filtrelerinizi ayarlamayı deneyin.</p>
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="px-6 py-3 rounded-full bg-earth-dark text-sand-light font-medium hover:bg-earth transition-colors cursor-pointer"
                  >
                    Tüm Ürünleri Gör
                  </button>
                </motion.div>
              ) : viewMode === 'grid' ? (
                <motion.div
                  key={`grid-${selectedCategory}-${sortBy}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                >
                  {filteredAndSortedProducts.map((product, index) => (
                    <ProductGridCard
                      key={product.id}
                      product={product}
                      index={index}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key={`list-${selectedCategory}-${sortBy}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-5"
                >
                  {filteredAndSortedProducts.map((product, index) => (
                    <ProductListCard
                      key={product.id}
                      product={product}
                      index={index}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}



/* ─── Grid Card ─────────────────────────────────────────────────────── */

function ProductGridCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: 'easeOut' }}
    >
      <TransitionLink href={`/products/${product.slug}`} className="group block cursor-pointer">
        <SpotlightCard
          className="rounded-3xl"
          spotlightColor="rgba(74, 68, 59, 0.07)"
          spotlightSize={400}
        >
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-sand mb-5">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Quick view icon */}
            <div className="absolute bottom-4 right-4 bg-white/85 backdrop-blur-2xl w-9 h-9 flex items-center justify-center rounded-full shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              <Plus className="w-4 h-4" />
            </div>

            {/* Tag & Price Container */}
            <div className="absolute bottom-4 left-4 flex items-center z-10 transition-all duration-500 gap-0 group-hover:gap-2">
              <div className="bg-white/85 backdrop-blur-2xl shadow-lg rounded-full font-sans font-normal text-base tracking-wide text-earth-dark whitespace-nowrap overflow-hidden transition-all duration-500 max-w-0 opacity-0 group-hover:max-w-[120px] group-hover:opacity-100 flex items-center h-9 px-0 group-hover:px-4">
                {priceLabel(product)}
              </div>
              {product.tag && (
                <div className="bg-white/85 backdrop-blur-2xl shadow-lg px-3.5 rounded-full font-sans font-medium text-[11px] tracking-widest uppercase text-earth-dark transition-all duration-500 flex items-center h-9">
                  {product.tag}
                </div>
              )}
            </div>
          </div>

          <div className="px-1">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="text-[20px] font-display font-medium tracking-tight group-hover:text-earth transition-colors leading-tight">
                  {product.name}
                </h3>
              </div>
              <span className="font-sans font-normal text-lg text-earth/70 whitespace-nowrap pt-0.5">
                {priceLabel(product)}
              </span>
            </div>
          </div>
        </SpotlightCard>
      </TransitionLink>
    </motion.div>
  );
}


/* ─── List Card ─────────────────────────────────────────────────────── */

function ProductListCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
    >
      <TransitionLink
        href={`/products/${product.slug}`}
        className="group block cursor-pointer bg-white/50 backdrop-blur-sm rounded-2xl border border-white/60 hover:bg-white/80 hover:shadow-lg transition-all duration-500 overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="relative w-full sm:w-56 lg:w-72 aspect-[4/3] sm:aspect-auto shrink-0 overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {product.tag && (
              <div className="absolute bottom-3 left-3 glass px-3 py-1 rounded-full text-xs font-medium tracking-widest uppercase">
                {product.tag}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="text-[20px] font-display font-medium group-hover:text-earth transition-colors">
                    {product.name}
                  </h3>
                </div>
                <span className="font-sans font-normal text-lg text-earth-dark whitespace-nowrap">
                  {priceLabel(product)}
                </span>
              </div>
              <p className="text-sm text-earth/60 leading-relaxed line-clamp-2">
                {product.description}
              </p>
            </div>

            <div className="flex items-center justify-between mt-5 pt-5 border-t border-earth/8">
              <div className="flex gap-4">
                {product.specs.slice(0, 2).map((spec, idx) => (
                  <div key={idx} className="text-xs">
                    <span className="text-earth/40">{spec.label}: </span>
                    <span className="text-earth-dark font-medium">{spec.value.split(',')[0]}</span>
                  </div>
                ))}
              </div>
              <span className="text-sm font-medium text-earth/50 group-hover:text-earth-dark transition-colors flex items-center gap-1">
                Detayları Gör
                <Plus className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      </TransitionLink>
    </motion.div>
  );
}

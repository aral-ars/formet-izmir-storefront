'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SlidersHorizontal, Grid3x3, LayoutList, ChevronDown, Plus, X, ArrowUpDown } from 'lucide-react';
import { PRODUCTS, CATEGORIES, type Product } from '../../data';
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

const FILTER_CATEGORIES = [
  { value: 'all', label: 'Tüm Ürünler' },
  ...CATEGORIES.map(c => ({ value: c.id, label: c.name })),
];

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = selectedCategory === 'all'
      ? [...PRODUCTS]
      : PRODUCTS.filter(p => p.category === selectedCategory);

    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.priceValue - b.priceValue);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.priceValue - a.priceValue);
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
  }, [selectedCategory, sortBy]);

  const activeCategoryLabel = FILTER_CATEGORIES.find(c => c.value === selectedCategory)?.label || 'Tüm Ürünler';
  const activeSortLabel = SORT_OPTIONS.find(s => s.value === sortBy)?.label || 'Öne Çıkanlar';

  return (
    <div className="min-h-screen bg-sand-light text-earth-dark selection:bg-earth selection:text-sand-light overflow-x-hidden">
      <Navbar forceDarkText />

      {/* Hero Banner */}
      <section className="pt-28 sm:pt-32 pb-16 sm:pb-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div>
            {/* Breadcrumb */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 text-sm text-earth/50 mb-8"
            >
              <a href="/" className="hover:text-earth transition-colors">Anasayfa</a>
              <span>/</span>
              <span className="text-earth-dark font-medium">Ürünler</span>
            </motion.div>

            <TextReveal
              as="h1"
              className="text-4xl sm:text-5xl lg:text-6xl font-display font-semibold mb-5 leading-[1.1] tracking-[-0.02em]"
              accentWords={['collection']}
              delay={0.1}
            >
              Koleksiyonumuz
            </TextReveal>
            <LineReveal className="text-lg sm:text-xl text-earth/70 max-w-2xl font-light leading-relaxed tracking-wide" delay={0.35}>
              Evinizin salonundaki konforu açık havaya taşımak için her parça en iyi malzemelerden özenle üretildi.
            </LineReveal>
          </div>
        </div>
      </section>

      {/* Filters & Sort Bar */}
      <section className="px-6 lg:px-8 sticky top-[72px] sm:top-[76px] z-40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-7xl mx-auto"
        >
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-sm px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            
            {/* Left: Filter Toggles */}
            <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap sm:overflow-hidden sm:flex-1">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="sm:hidden flex items-center gap-2 px-4 py-2 rounded-full border border-earth/15 text-sm font-medium hover:bg-earth/5 transition-colors cursor-pointer shrink-0"
              >
                <SlidersHorizontal className="w-4 h-4 shrink-0" />
                <span>Filtreler</span>
                {selectedCategory !== 'all' && (
                  <span className="w-2 h-2 rounded-full bg-earth-dark" />
                )}
              </button>

              {/* Desktop category pills */}
              <div className="hidden sm:flex items-center gap-2 overflow-x-auto no-scrollbar w-full">
                {FILTER_CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                      selectedCategory === cat.value
                        ? 'bg-earth-dark text-sand-light shadow-md shadow-earth-dark/20'
                        : 'bg-transparent text-earth/70 hover:bg-earth/8 hover:text-earth-dark'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Sort + View Mode */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Sort Dropdown */}
              <div className="relative shrink-0">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-earth/15 text-sm font-medium hover:bg-earth/5 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline whitespace-nowrap">{activeSortLabel}</span>
                  <span className="sm:hidden whitespace-nowrap">Sırala</span>
                  <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {showSortDropdown && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowSortDropdown(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-52 bg-white/90 backdrop-blur-2xl rounded-2xl border border-white/60 shadow-xl py-2 z-20 overflow-hidden"
                      >
                        {SORT_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => { setSortBy(option.value); setShowSortDropdown(false); }}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                              sortBy === option.value
                                ? 'bg-earth-dark/5 text-earth-dark font-medium'
                                : 'text-earth/70 hover:bg-earth/5 hover:text-earth-dark'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* View Mode Toggle */}
              <div className="hidden sm:flex items-center bg-earth/5 rounded-full p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-full transition-all cursor-pointer ${
                    viewMode === 'grid' ? 'bg-white shadow-sm text-earth-dark' : 'text-earth/50 hover:text-earth-dark'
                  }`}
                  aria-label="Grid view"
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-full transition-all cursor-pointer ${
                    viewMode === 'list' ? 'bg-white shadow-sm text-earth-dark' : 'text-earth/50 hover:text-earth-dark'
                  }`}
                  aria-label="List view"
                >
                  <LayoutList className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile filter panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="sm:hidden overflow-hidden"
              >
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-sm mt-3 px-5 py-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-earth-dark">Kategoriler</span>
                    {selectedCategory !== 'all' && (
                      <button
                        onClick={() => setSelectedCategory('all')}
                        className="text-xs text-earth/50 hover:text-earth-dark transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                        Temizle
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {FILTER_CATEGORIES.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => { setSelectedCategory(cat.value); setShowFilters(false); }}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                          selectedCategory === cat.value
                            ? 'bg-earth-dark text-sand-light shadow-md shadow-earth-dark/20'
                            : 'bg-earth/5 text-earth/70 hover:bg-earth/10 hover:text-earth-dark'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Results Count */}
      <section className="px-6 lg:px-8 mt-8 mb-6">
        <div className="max-w-7xl mx-auto">
          <motion.p
            key={`${selectedCategory}-${sortBy}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-earth/50"
          >
            Gösteriliyor: <span className="text-earth-dark font-medium">{filteredAndSortedProducts.length}</span>{' '}
            ürün
            {selectedCategory !== 'all' && (
              <> (<span className="text-earth-dark font-medium">{activeCategoryLabel}</span> kategorisinde)</>
            )}
          </motion.p>
        </div>
      </section>

      {/* Products Grid / List */}
      <section className="px-6 lg:px-8 pb-24">
        <div className="max-w-7xl mx-auto">
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
      <TransitionLink href={`/products/${product.id}`} className="group block cursor-pointer">
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
            <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-md w-9 h-9 flex items-center justify-center rounded-full shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              <Plus className="w-4 h-4" />
            </div>

            {/* Tag & Price Container */}
            <div className="absolute bottom-4 left-4 flex items-center z-10 transition-all duration-500 gap-0 group-hover:gap-2">
              <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-full font-sans font-normal text-base tracking-wide text-earth-dark whitespace-nowrap overflow-hidden transition-all duration-500 max-w-0 opacity-0 group-hover:max-w-[120px] group-hover:opacity-100 flex items-center h-9 px-0 group-hover:px-4">
                {product.price}
              </div>
              <div className="bg-white/80 backdrop-blur-md shadow-lg px-3.5 rounded-full font-sans font-medium text-[11px] tracking-widest uppercase text-earth-dark transition-all duration-500 flex items-center h-9">
                {product.tag}
              </div>
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
                {product.price}
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
        href={`/products/${product.id}`}
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
            <div className="absolute bottom-3 left-3 glass px-3 py-1 rounded-full text-xs font-medium tracking-widest uppercase">
              {product.tag}
            </div>
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
                  {product.price}
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

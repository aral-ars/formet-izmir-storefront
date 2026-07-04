'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, ChevronRight, Plus, ArrowLeft, Check, Share2, Heart } from 'lucide-react';
import { PRODUCTS, type Product } from '../data';
import { ProductsNavbar } from './ProductsNavbar';
import { Footer } from './Footer';
import { TransitionLink } from './TransitionLink';

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 3);

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Hi, I'm interested in the ${product.name} (${product.price}). Could you provide more info?`
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
      <ProductsNavbar />

      {/* Breadcrumb */}
      <div className="pt-28 sm:pt-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.nav
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 text-sm text-earth/50"
          >
            <TransitionLink href="/" className="hover:text-earth transition-colors">
              Home
            </TransitionLink>
            <ChevronRight className="w-3.5 h-3.5" />
            <TransitionLink href="/products" className="hover:text-earth transition-colors">
              Products
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
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImageIndex}
                    src={product.images[activeImageIndex]}
                    alt={`${product.name} — view ${activeImageIndex + 1}`}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="w-full h-full object-cover object-center"
                  />
                </AnimatePresence>

                {/* Tag badge */}
                <div className="absolute top-5 left-5 glass px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide">
                  {product.tag}
                </div>

                {/* Actions overlay */}
                <div className="absolute top-5 right-5 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsWishlisted(!isWishlisted);
                    }}
                    className={`p-3 rounded-full backdrop-blur-md shadow-lg transition-all cursor-pointer ${
                      isWishlisted
                        ? 'bg-rose-500 text-white'
                        : 'bg-white/70 text-earth-dark hover:bg-white'
                    }`}
                    aria-label="Add to wishlist"
                  >
                    <Heart
                      className="w-5 h-5"
                      fill={isWishlisted ? 'currentColor' : 'none'}
                    />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare();
                    }}
                    className="p-3 bg-white/70 backdrop-blur-md rounded-full shadow-lg text-earth-dark hover:bg-white transition-all cursor-pointer"
                    aria-label="Share product"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Image counter */}
                <div className="absolute bottom-5 right-5 glass-dark px-3 py-1.5 rounded-full text-xs font-medium text-white/90">
                  {activeImageIndex + 1} / {product.images.length}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative flex-1 aspect-square rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
                      idx === activeImageIndex
                        ? 'ring-2 ring-earth-dark ring-offset-2 ring-offset-sand-light shadow-lg'
                        : 'opacity-60 hover:opacity-90 saturate-[0.7] hover:saturate-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
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
              {/* Category label */}
              <span className="text-xs uppercase tracking-[0.2em] text-earth/40 font-medium mb-4">
                {product.category === 'details'
                  ? 'Accessories'
                  : product.category}
              </span>

              {/* Title & Price */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold leading-[1.1] mb-3">
                {product.name}
              </h1>
              <p className="text-2xl sm:text-3xl text-earth/60 font-medium mb-8">
                {product.price}
              </p>

              {/* Divider */}
              <div className="h-px bg-earth/10 mb-8" />

              {/* Description */}
              <div className="mb-10">
                <h2 className="font-display font-medium text-lg mb-4 text-earth-dark">
                  About this piece
                </h2>
                <p className="text-earth/70 leading-relaxed text-base lg:text-lg">
                  {product.description}
                </p>
              </div>

              {/* Specs */}
              <div className="mb-10">
                <h2 className="font-display font-medium text-lg mb-5 text-earth-dark">
                  Specifications
                </h2>
                <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-white/60 overflow-hidden">
                  {product.specs.map((spec, idx) => (
                    <div
                      key={idx}
                      className={`flex justify-between items-center px-5 py-4 ${
                        idx < product.specs.length - 1
                          ? 'border-b border-earth/8'
                          : ''
                      }`}
                    >
                      <span className="text-sm text-earth/50 font-medium">
                        {spec.label}
                      </span>
                      <span className="text-sm font-medium text-earth-dark text-right max-w-[55%]">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-6 mb-10 flex-wrap">
                {[
                  '5-Year Warranty',
                  'Free Delivery',
                  'Assembly Included',
                ].map((badge) => (
                  <div
                    key={badge}
                    className="flex items-center gap-2 text-sm text-earth/50"
                  >
                    <div className="w-5 h-5 rounded-full bg-sage-light/80 flex items-center justify-center">
                      <Check className="w-3 h-3 text-earth" />
                    </div>
                    <span>{badge}</span>
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
                  <span>Inquire via WhatsApp</span>
                </button>
                <p className="text-center text-xs text-earth/40 mt-3">
                  Typically replies within 2 hours
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
                  <h2 className="text-2xl sm:text-3xl font-display font-semibold mb-2">
                    You may also like
                  </h2>
                  <p className="text-earth/50 text-sm sm:text-base">
                    More from the{' '}
                    <span className="font-medium text-earth-dark capitalize">
                      {product.category === 'details'
                        ? 'Accessories'
                        : product.category}
                    </span>{' '}
                    collection
                  </p>
                </div>
                <TransitionLink
                  href={`/products?category=${product.category}`}
                  className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-earth/60 hover:text-earth-dark transition-colors"
                >
                  View all
                  <ChevronRight className="w-4 h-4" />
                </TransitionLink>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
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
                    href={`/products/${related.id}`}
                    className="group block"
                  >
                    <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-sand mb-5">
                      <img
                        src={related.image}
                        alt={related.name}
                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute top-4 left-4 glass px-3 py-1.5 rounded-full text-xs font-medium tracking-wide">
                        {related.tag}
                      </div>
                      <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-md p-3.5 rounded-full shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-earth-dark hover:text-white">
                        <Plus className="w-5 h-5" />
                      </div>
                      <div className="absolute bottom-4 left-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-75">
                        <span className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-full text-sm font-semibold text-earth-dark shadow-lg">
                          {related.price}
                        </span>
                      </div>
                    </div>
                    <div className="px-1">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="text-lg font-display font-medium group-hover:text-earth transition-colors leading-tight">
                          {related.name}
                        </h3>
                        <span className="text-base font-semibold text-earth/70 whitespace-nowrap pt-0.5">
                          {related.price}
                        </span>
                      </div>
                    </div>
                  </TransitionLink>
                </motion.div>
              ))}
            </div>

            <div className="sm:hidden mt-8 text-center">
              <TransitionLink
                href={`/products?category=${product.category}`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-earth/60 hover:text-earth-dark transition-colors"
              >
                View all in this collection
                <ChevronRight className="w-4 h-4" />
              </TransitionLink>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}

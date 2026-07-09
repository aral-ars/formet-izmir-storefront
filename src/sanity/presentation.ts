import { defineLocations, type PresentationPluginOptions } from 'sanity/presentation';

// Maps each editable document type to the storefront URL(s) it appears on.
// Without this, Presentation can only show whatever URL you happen to be on —
// it can't jump there from the document list, or offer "Open in Presentation"
// from a document.
export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    product: defineLocations({
      select: { name: 'name', slug: 'slug.current' },
      resolve: (doc) => ({
        locations: [
          { title: doc?.name || 'İsimsiz ürün', href: `/products/${doc?.slug}` },
          { title: 'Ürünler', href: '/products' },
        ],
      }),
    }),
    category: defineLocations({
      select: { name: 'name' },
      resolve: (doc) => ({
        locations: [{ title: doc?.name || 'İsimsiz kategori', href: '/products' }],
      }),
    }),
    collection: defineLocations({
      select: { name: 'name' },
      resolve: (doc) => ({
        locations: [{ title: doc?.name || 'İsimsiz koleksiyon', href: '/products' }],
      }),
    }),
    review: defineLocations({
      select: { authorName: 'authorName' },
      resolve: (doc) => ({
        locations: [{ title: doc?.authorName || 'İsimsiz yorum', href: '/#reviews' }],
      }),
    }),
    faq: defineLocations({
      select: { question: 'question' },
      resolve: (doc) => ({
        locations: [{ title: doc?.question || 'İsimsiz soru', href: '/#faq' }],
      }),
    }),
    siteSettings: defineLocations({
      select: {},
      resolve: () => ({
        locations: [
          { title: 'Ana Sayfa', href: '/' },
          { title: 'Mağaza Bilgisi', href: '/#showroom' },
        ],
      }),
    }),
  },
};

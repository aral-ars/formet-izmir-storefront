import { defineType, defineField, defineArrayMember } from 'sanity';
import { PackageIcon } from '@sanity/icons';

// Predefined badges so the shown tag stays consistent instead of drifting
// ("En Çok Satan" vs "Çok Satan"). Add new options here, not free-text.
const TAG_OPTIONS = [
  'Yeni Ürün',
  'En Çok Satan',
  'Öne Çıkan',
  'Sınırlı Sayıda',
  'Takım',
];

// Availability is a status, not a stock count — orders go out over WhatsApp,
// there's no checkout to decrement inventory, so a numeric count would just rot.
const AVAILABILITY_OPTIONS = [
  { title: 'Stokta', value: 'in-stock' },
  { title: 'Siparişe Özel', value: 'made-to-order' },
  { title: 'Tükendi', value: 'sold-out' },
  { title: 'Yakında', value: 'coming-soon' },
];

export const product = defineType({
  name: 'product',
  title: 'Ürün',
  type: 'document',
  icon: PackageIcon,
  groups: [
    { name: 'content', title: 'İçerik', default: true },
    { name: 'pricing', title: 'Fiyat & Durum' },
    { name: 'media', title: 'Görseller' },
    { name: 'options', title: 'Seçenekler' },
    { name: 'organize', title: 'Sıralama & Bağlantılar' },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Ad',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: { source: 'name', maxLength: 96 },
      description: 'Ürün URL’si: /products/[slug]',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Açıklama',
      type: 'text',
      group: 'content',
      rows: 4,
    }),
    defineField({
      name: 'material',
      title: 'Malzeme',
      type: 'text',
      group: 'content',
      rows: 2,
      description:
        'Malzemeler, virgülle ayrılmış (örn. "Toz boya kaplı alüminyum, Rattan örgü"). Ürün sayfasında ayrı bir bölümde gösterilir.',
    }),
    defineField({
      name: 'care',
      title: 'Bakım',
      type: 'text',
      group: 'content',
      rows: 2,
      description: 'Bakım ve temizlik talimatları. Ürün sayfasında ayrı bir bölümde gösterilir.',
    }),
    defineField({
      name: 'specs',
      title: 'Teknik Özellikler',
      type: 'array',
      group: 'content',
      description: 'Boyut, ağırlık, oturma kapasitesi gibi tablolanacak diğer detaylar.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'spec',
          fields: [
            defineField({ name: 'label', title: 'Etiket', type: 'string' }),
            defineField({ name: 'value', title: 'Değer', type: 'string' }),
          ],
          preview: { select: { title: 'label', subtitle: 'value' } },
        }),
      ],
    }),

    // ── Pricing & availability ──────────────────────────────────────────
    defineField({
      name: 'price',
      title: 'Fiyat (₺)',
      type: 'number',
      group: 'pricing',
      description: 'Türk Lirası cinsinden, sayı olarak (biçimlendirme otomatik).',
      validation: (rule) =>
        rule.required().min(0).custom((price, ctx) => {
          const doc = ctx.document as { hidden?: boolean; priceOnRequest?: boolean } | undefined;
          // Guardrail: a live (non-hidden) product must have a real price, unless
          // it's explicitly "price on request" — stops accidental ₺0 going public.
          if (!doc?.hidden && !doc?.priceOnRequest && (!price || price <= 0)) {
            return 'Yayındaki bir ürünün fiyatı 0’dan büyük olmalı (veya “Fiyat için sorun” işaretlenmeli).';
          }
          return true;
        }),
    }),
    defineField({
      name: 'priceOnRequest',
      title: 'Fiyat için sorun',
      type: 'boolean',
      group: 'pricing',
      initialValue: false,
      description: 'İşaretlenirse fiyat yerine “Fiyat için sorun” gösterilir.',
    }),
    defineField({
      name: 'availability',
      title: 'Durum',
      type: 'string',
      group: 'pricing',
      initialValue: 'in-stock',
      options: { list: AVAILABILITY_OPTIONS, layout: 'radio' },
    }),
    defineField({
      name: 'tag',
      title: 'Etiket',
      type: 'string',
      group: 'pricing',
      description: 'Kart üzerinde gösterilen rozet.',
      options: { list: TAG_OPTIONS },
    }),

    // ── Media ───────────────────────────────────────────────────────────
    defineField({
      name: 'image',
      title: 'Ana Görsel',
      type: 'image',
      group: 'media',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternatif Metin',
          type: 'string',
          description: 'Erişilebilirlik ve SEO için görsel açıklaması.',
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Galeri',
      type: 'array',
      group: 'media',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', title: 'Alternatif Metin', type: 'string' }),
          ],
        }),
      ],
    }),

    // ── Options (colour / material axes) ────────────────────────────────
    defineField({
      name: 'options',
      title: 'Seçenek Grupları',
      type: 'array',
      group: 'options',
      description:
        'Renk ve materyal gibi bağımsız seçim eksenleri. Her grup kendi değerlerini taşır.',
      of: [defineArrayMember({ type: 'optionGroup' })],
    }),
    defineField({
      name: 'colors',
      title: 'Renk Seçenekleri (eski)',
      type: 'array',
      group: 'options',
      description:
        'Eski tek eksenli renk alanı. Yeni ürünlerde “Seçenek Grupları”nı kullanın; bu alan geçiş için korunuyor.',
      of: [defineArrayMember({ type: 'colorOption' })],
      hidden: ({ value }) => !Array.isArray(value) || value.length === 0,
    }),

    // ── Organisation & linking ──────────────────────────────────────────
    defineField({
      name: 'category',
      title: 'Kategori',
      description: 'Ürünün türü (örn. Oturma Grubu, Yemek Grubu).',
      type: 'reference',
      group: 'organize',
      to: [{ type: 'category' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'collection',
      title: 'Koleksiyon',
      description: 'Ürünün ait olduğu pazarlama koleksiyonu, varsa (örn. Rattan Koleksiyonu).',
      type: 'reference',
      group: 'organize',
      to: [{ type: 'collection' }],
    }),
    defineField({
      name: 'series',
      title: 'Seri',
      type: 'string',
      group: 'organize',
      description:
        'Aynı model ailesini gruplar (örn. "Eyfel"). Eyfel Masa Takımı ve Eyfel Bahçe Takımı ayrı ürünlerdir ama aynı seriyi paylaşır.',
    }),
    defineField({
      name: 'related',
      title: 'İlgili Ürünler',
      type: 'array',
      group: 'organize',
      description: 'Elle seçilen “birlikte iyi gider” önerileri. Boşsa seri/kategori kullanılır.',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'product' }] })],
    }),
    defineField({
      name: 'order',
      title: 'Sıra',
      type: 'number',
      group: 'organize',
      initialValue: 0,
      description: 'Listeleme ve “öne çıkanlar” sıralaması (küçük önce).',
    }),
    defineField({
      name: 'hidden',
      title: 'Gizli',
      type: 'boolean',
      group: 'organize',
      initialValue: false,
      description:
        'İşaretlenirse ürün mağazada görünmez (yumuşak silme). Belge silinmez.',
    }),
  ],
  orderings: [
    {
      title: 'Sıra',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'name',
      price: 'price',
      media: 'image',
      hidden: 'hidden',
      priceOnRequest: 'priceOnRequest',
      availability: 'availability',
    },
    prepare({ title, price, media, hidden, priceOnRequest, availability }) {
      const priceLabel = priceOnRequest
        ? 'Fiyat için sorun'
        : typeof price === 'number' && price > 0
          ? `₺${price.toLocaleString('tr-TR')}`
          : '₺0 — fiyat girilmemiş';
      const status = availability && availability !== 'in-stock' ? ` · ${availability}` : '';
      return {
        title: hidden ? `${title} (gizli)` : title,
        subtitle: `${priceLabel}${status}`,
        media,
      };
    },
  },
});

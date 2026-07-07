import { defineType, defineField, defineArrayMember } from 'sanity';
import { PackageIcon } from '@sanity/icons';

export const product = defineType({
  name: 'product',
  title: 'Ürün',
  type: 'document',
  icon: PackageIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Ad',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      description: 'Ürün URL’si: /products/[slug]',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Fiyat (₺)',
      type: 'number',
      description: 'Türk Lirası cinsinden, sayı olarak (biçimlendirme otomatik).',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'tag',
      title: 'Etiket',
      type: 'string',
      description: 'Örn. "Yeni Ürün", "En Çok Satan".',
    }),
    defineField({
      name: 'category',
      title: 'Kategori',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Ana Görsel',
      type: 'image',
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Galeri',
      type: 'array',
      of: [defineArrayMember({ type: 'image', options: { hotspot: true } })],
    }),
    defineField({
      name: 'description',
      title: 'Açıklama',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'specs',
      title: 'Teknik Özellikler',
      type: 'array',
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
    defineField({
      name: 'colors',
      title: 'Renk Seçenekleri',
      type: 'array',
      of: [defineArrayMember({ type: 'colorOption' })],
    }),
    defineField({
      name: 'order',
      title: 'Sıra',
      type: 'number',
      initialValue: 0,
      description: 'Listeleme ve “öne çıkanlar” sıralaması (küçük önce).',
    }),
    defineField({
      name: 'hidden',
      title: 'Gizli',
      type: 'boolean',
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
    select: { title: 'name', price: 'price', media: 'image', hidden: 'hidden' },
    prepare({ title, price, media, hidden }) {
      return {
        title: hidden ? `${title} (gizli)` : title,
        subtitle: typeof price === 'number' ? `₺${price.toLocaleString('tr-TR')}` : '',
        media,
      };
    },
  },
});

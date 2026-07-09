import { defineType, defineField } from 'sanity';
import { StackIcon } from '@sanity/icons';

// A marketing/series grouping (e.g. "Rattan Koleksiyonu"), distinct from
// `category` which is the product's functional type (e.g. "Oturma Grubu").
// A product can belong to at most one category but any collection, including
// none — not every product is part of a named catalog collection.
export const collection = defineType({
  name: 'collection',
  title: 'Koleksiyon',
  type: 'document',
  icon: StackIcon,
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
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Açıklama',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'image',
      title: 'Görsel',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'order',
      title: 'Sıra',
      type: 'number',
      initialValue: 0,
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
    select: { title: 'name', subtitle: 'slug.current', media: 'image' },
  },
});

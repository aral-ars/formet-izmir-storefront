import { defineType, defineField } from 'sanity';
import { StarIcon } from '@sanity/icons';

export const review = defineType({
  name: 'review',
  title: 'Yorum',
  type: 'document',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'authorName',
      title: 'Yazar',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'rating',
      title: 'Puan',
      type: 'number',
      initialValue: 5,
      validation: (rule) => rule.required().min(1).max(5).integer(),
    }),
    defineField({
      name: 'date',
      title: 'Tarih',
      type: 'date',
      options: { dateFormat: 'D MMMM YYYY' },
      description: 'Yorumun tarihi. Görüntüleme biçimi otomatik (örn. "12 Mayıs 2026").',
    }),
    defineField({
      name: 'text',
      title: 'Yorum',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
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
    select: { title: 'authorName', subtitle: 'text' },
  },
});

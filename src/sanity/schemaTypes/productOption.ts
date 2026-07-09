import { defineType, defineField, defineArrayMember } from 'sanity';

// A single selectable value within an option group.
// - `hex` renders as a color swatch dot (finishes/fabrics with a solid tone).
// - `swatch` renders as a small texture thumbnail (materials like Rattan / İp).
// - neither → a plain text pill.
// hex and swatch are independent; a value may set one, both, or neither.
export const optionValue = defineType({
  name: 'optionValue',
  title: 'Seçenek Değeri',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Ad',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'hex',
      title: 'Renk (HEX)',
      type: 'string',
      description: 'Renk seçenekleri için. Örn. #9C7A54. Malzeme için boş bırakın.',
      validation: (rule) =>
        rule.regex(/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/, { name: 'hex rengi' }).warning(
          'Geçerli bir HEX rengi girin (örn. #9C7A54) veya boş bırakın.',
        ),
    }),
    defineField({
      name: 'swatch',
      title: 'Doku Görseli',
      type: 'image',
      description: 'Malzeme/doku seçenekleri için küçük örnek görsel (örn. Rattan, İp).',
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'hex', media: 'swatch' },
  },
});

// An axis of choice on a product (e.g. "Renk", "Materyal"). Products can carry
// several groups at once, so colour and material are chosen independently
// instead of being crammed into one flat list ("İp Cappuccino", …).
export const optionGroup = defineType({
  name: 'optionGroup',
  title: 'Seçenek Grubu',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Başlık',
      type: 'string',
      description: 'Örn. "Renk", "Materyal".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'values',
      title: 'Değerler',
      type: 'array',
      of: [defineArrayMember({ type: 'optionValue' })],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: 'title', values: 'values' },
    prepare({ title, values }) {
      const count = Array.isArray(values) ? values.length : 0;
      return { title, subtitle: `${count} değer` };
    },
  },
});

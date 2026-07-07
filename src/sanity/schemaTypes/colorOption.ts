import { defineType, defineField } from 'sanity';

// A selectable finish/fabric option: display name + swatch color.
export const colorOption = defineType({
  name: 'colorOption',
  title: 'Renk Seçeneği',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Ad',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'hex',
      title: 'Renk (HEX)',
      type: 'string',
      description: 'Örn. #D9CBB2',
      validation: (rule) =>
        rule
          .required()
          .regex(/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/, { name: 'hex rengi' }),
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'hex' },
  },
});

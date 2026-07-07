import { defineType, defineField, defineArrayMember } from 'sanity';
import { CogIcon } from '@sanity/icons';

// Singleton: the "few images here and there" on the site presentation.
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Ayarları',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Başlık',
      type: 'string',
      initialValue: 'Formet',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Görseli',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'wordmarkDark',
      title: 'Logo (koyu)',
      type: 'image',
      description: 'Açık zeminlerde kullanılan koyu logo.',
    }),
    defineField({
      name: 'wordmarkLight',
      title: 'Logo (açık)',
      type: 'image',
      description: 'Koyu zeminlerde kullanılan açık logo.',
    }),
    defineField({
      name: 'showroomImages',
      title: 'Showroom Görselleri',
      type: 'array',
      of: [defineArrayMember({ type: 'image', options: { hotspot: true } })],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Site Ayarları' }),
  },
});

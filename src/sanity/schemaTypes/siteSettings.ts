import { defineType, defineField, defineArrayMember } from 'sanity';
import { CogIcon } from '@sanity/icons';

// Singleton: contact + showroom details the client edits without touching code.
// Read site-wide via SiteSettingsProvider (see src/lib/catalog.ts →
// getSiteSettings). Presentation imagery (hero, logo) stays in code for now.
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Ayarları',
  type: 'document',
  icon: CogIcon,
  groups: [
    { name: 'contact', title: 'İletişim', default: true },
    { name: 'hours', title: 'Çalışma Saatleri' },
    { name: 'branding', title: 'Markalama' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Başlık',
      type: 'string',
      initialValue: 'Formet',
      hidden: true,
    }),
    defineField({
      name: 'phone',
      title: 'Telefon',
      type: 'string',
      group: 'contact',
      description: 'Görünen telefon numarası. Örn: +90 (232) 555 0123',
    }),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp Numarası',
      type: 'string',
      group: 'contact',
      description:
        'Sipariş bağlantıları için. Ülke koduyla, sadece rakamlar (boşluk/işaret yok). Örn: 905321234567',
      validation: (Rule) =>
        Rule.regex(/^\d{10,15}$/, { name: 'yalnızca rakamlar' }).warning(
          'Sadece rakamlardan oluşmalı — boşluk, +, veya parantez olmadan.',
        ),
    }),
    defineField({
      name: 'email',
      title: 'E-posta',
      type: 'string',
      group: 'contact',
      validation: (Rule) => Rule.email().warning('Geçerli bir e-posta adresi girin.'),
    }),
    defineField({
      name: 'address',
      title: 'Adres',
      type: 'text',
      rows: 2,
      group: 'contact',
      description: 'Her satır sitede ayrı bir satır olarak gösterilir.',
    }),
    defineField({
      name: 'mapUrl',
      title: 'Harita Bağlantısı',
      type: 'url',
      group: 'contact',
      description: 'Google Maps "Yol Tarifi" bağlantısı.',
    }),
    defineField({
      name: 'hours',
      title: 'Çalışma Saatleri',
      type: 'array',
      group: 'hours',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'hoursRow',
          title: 'Satır',
          fields: [
            defineField({ name: 'days', title: 'Günler', type: 'string' }),
            defineField({ name: 'value', title: 'Saatler', type: 'string' }),
          ],
          preview: { select: { title: 'days', subtitle: 'value' } },
        }),
      ],
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Görseli',
      type: 'image',
      group: 'branding',
      options: { hotspot: true },
    }),
    defineField({
      name: 'wordmarkDark',
      title: 'Koyu Logo (Wordmark)',
      type: 'image',
      group: 'branding',
    }),
    defineField({
      name: 'wordmarkLight',
      title: 'Açık Logo (Wordmark)',
      type: 'image',
      group: 'branding',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Site Ayarları' }),
  },
});

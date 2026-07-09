import { type ComponentType } from 'react';
import { PackageIcon, EditIcon, EyeOpenIcon, EyeClosedIcon, WarningOutlineIcon } from '@sanity/icons';
import { type StructureResolver } from 'sanity/structure';

// A filtered product list: same editor, a GROQ-narrowed set of documents.
const productFilter = (
  S: Parameters<StructureResolver>[0],
  title: string,
  icon: ComponentType,
  filter: string,
) =>
  S.listItem()
    .title(title)
    .icon(icon)
    .child(
      S.documentTypeList('product')
        .title(title)
        .filter(`_type == "product" && ${filter}`)
        .defaultOrdering([{ field: 'order', direction: 'asc' }]),
    );

// Pins Site Settings as a single editable document and lists the content types.
// Products get task-oriented sub-views (esp. "needs pricing" for the freshly
// imported ₺0/hidden catalog) alongside the full list.
export const structure: StructureResolver = (S) =>
  S.list()
    .title('İçerik')
    .items([
      S.listItem()
        .title('Site Ayarları')
        .id('siteSettings')
        .child(
          S.document().schemaType('siteSettings').documentId('siteSettings'),
        ),
      S.divider(),
      S.listItem()
        .title('Ürünler')
        .icon(PackageIcon)
        .child(
          S.list()
            .title('Ürünler')
            .items([
              S.documentTypeListItem('product').title('Tüm Ürünler').icon(PackageIcon),
              S.divider(),
              productFilter(
                S,
                'Fiyat Girilmemiş',
                WarningOutlineIcon,
                '(!defined(price) || price == 0) && !priceOnRequest',
              ),
              productFilter(S, 'Yayında', EyeOpenIcon, '!hidden'),
              productFilter(S, 'Gizli', EyeClosedIcon, 'hidden == true'),
              productFilter(S, 'Taslaklar', EditIcon, '_id in path("drafts.**")'),
            ]),
        ),
      S.documentTypeListItem('category').title('Kategoriler'),
      S.documentTypeListItem('collection').title('Koleksiyonlar'),
      S.documentTypeListItem('review').title('Yorumlar'),
      S.documentTypeListItem('faq').title('SSS'),
    ]);

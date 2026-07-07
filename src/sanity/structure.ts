import { type StructureResolver } from 'sanity/structure';

// Pins Site Settings as a single editable document and lists the content types.
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
      S.documentTypeListItem('product').title('Ürünler'),
      S.documentTypeListItem('category').title('Kategoriler'),
      S.documentTypeListItem('review').title('Yorumlar'),
      S.documentTypeListItem('faq').title('SSS'),
    ]);

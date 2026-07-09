import { defineQuery } from 'next-sanity';

// Shared projection so list and detail return the same product shape.
// `image`/`images` stay as raw Sanity image objects — resolve with urlFor().
const productProjection = /* groq */ `
  "id": _id,
  name,
  "slug": slug.current,
  price,
  priceOnRequest,
  availability,
  tag,
  "category": category->slug.current,
  "collection": collection->slug.current,
  "collectionName": collection->name,
  series,
  description,
  material,
  care,
  image,
  "imageAlt": image.alt,
  images,
  specs[]{ label, value },
  options[]{ title, values[]{ label, hex, "swatch": swatch.asset->url } },
  colors[]{ name, hex },
  "relatedSlugs": related[]->slug.current,
  order
`;

// Storefront reads exclude soft-deleted (hidden) products.
export const PRODUCTS_QUERY = defineQuery(`
  *[_type == "product" && !hidden] | order(order asc, name asc){
    ${productProjection}
  }
`);

export const PRODUCT_SLUGS_QUERY = defineQuery(`
  *[_type == "product" && !hidden && defined(slug.current)]{ "slug": slug.current }
`);

export const PRODUCT_BY_SLUG_QUERY = defineQuery(`
  *[_type == "product" && slug.current == $slug && !hidden][0]{
    ${productProjection}
  }
`);

// `hasProducts` lets the storefront hide category filters that would be empty.
export const CATEGORIES_QUERY = defineQuery(`
  *[_type == "category"] | order(order asc, name asc){
    "id": slug.current,
    name,
    description,
    image,
    comingSoon,
    "hasProducts": count(*[_type == "product" && !hidden && references(^._id)]) > 0
  }
`);

export const COLLECTIONS_QUERY = defineQuery(`
  *[_type == "collection"] | order(order asc, name asc){
    "id": slug.current,
    name,
    description,
    image,
    "hasProducts": count(*[_type == "product" && !hidden && references(^._id)]) > 0
  }
`);

export const REVIEWS_QUERY = defineQuery(`
  *[_type == "review"] | order(order asc){ authorName, rating, date, text, image }
`);

export const FAQS_QUERY = defineQuery(`
  *[_type == "faq"] | order(order asc){ question, answer }
`);

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0]{
    phone, whatsapp, email, address, mapUrl, hours[]{ days, value }
  }
`);

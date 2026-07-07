import { type SchemaTypeDefinition } from 'sanity';

import { product } from './product';
import { category } from './category';
import { colorOption } from './colorOption';
import { review } from './review';
import { faq } from './faq';
import { siteSettings } from './siteSettings';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, category, colorOption, review, faq, siteSettings],
};

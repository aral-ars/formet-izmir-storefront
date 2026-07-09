import { type SchemaTypeDefinition } from 'sanity';

import { product } from './product';
import { category } from './category';
import { collection } from './collection';
import { colorOption } from './colorOption';
import { optionValue, optionGroup } from './productOption';
import { review } from './review';
import { faq } from './faq';
import { siteSettings } from './siteSettings';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    product,
    category,
    collection,
    colorOption,
    optionValue,
    optionGroup,
    review,
    faq,
    siteSettings,
  ],
};

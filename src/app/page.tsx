import {
  getProducts,
  getCategories,
  getReviews,
  getFaqs,
} from '@/lib/catalog';
import { HomeClient } from './HomeClient';

export default async function Page() {
  const [products, categories, reviews, faqs] = await Promise.all([
    getProducts(),
    getCategories(),
    getReviews(),
    getFaqs(),
  ]);

  return (
    <HomeClient
      products={products}
      categories={categories}
      reviews={reviews}
      faqs={faqs}
    />
  );
}

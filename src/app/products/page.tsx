import { getProducts, getCategories } from '@/lib/catalog';
import { ProductsView } from './ProductsView';

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return <ProductsView products={products} categories={categories} />;
}

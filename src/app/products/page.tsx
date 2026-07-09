import { getProducts, getCategories } from '@/lib/catalog';
import { ProductsView } from './ProductsView';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; collection?: string }>;
}) {
  const [{ category, collection }, products, categories] = await Promise.all([
    searchParams,
    getProducts(),
    getCategories(),
  ]);

  return (
    <ProductsView
      products={products}
      categories={categories}
      initialCategory={category}
      initialCollection={collection}
    />
  );
}

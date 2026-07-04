import { PRODUCTS } from '../../../data';
import { ProductDetailClient } from '../../../components/ProductDetail';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: String(p.id) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.id === Number(id));
  if (!product) return { title: 'Product Not Found | Formet' };

  return {
    title: `${product.name} | Formet Outdoor Furniture`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.id === Number(id));
  if (!product) notFound();

  return <ProductDetailClient product={product} />;
}

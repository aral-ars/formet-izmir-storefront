import { PRODUCTS, getProductBySlug } from '../../../data';
import { ProductDetailClient } from '../../../components/ProductDetail';
import { ProductExperience } from '../../../components/ProductExperience';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: 'Product Not Found | Formet' };

  return {
    title: `${product.name} | Formet Outdoor Furniture`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <>
      {/* Mobile (< md): immersive product experience */}
      <div className="md:hidden">
        <ProductExperience product={product} />
      </div>
      {/* Tablet & desktop (>= md): full two-column layout */}
      <div className="hidden md:block">
        <ProductDetailClient product={product} />
      </div>
    </>
  );
}

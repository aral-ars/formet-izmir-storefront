import { getProductBySlug, getProductSlugs, getProducts } from '@/lib/catalog';
import { ProductDetailClient } from '../../../components/ProductDetail';
import { ProductExperience } from '../../../components/ProductExperience';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  const slugs = await getProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
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
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  // Same-category siblings for the "related products" rails.
  const all = await getProducts();
  const related = all.filter(
    (p) => p.category === product.category && p.slug !== product.slug,
  );

  return (
    <>
      {/* Mobile (< md): immersive product experience */}
      <div className="md:hidden">
        <ProductExperience product={product} related={related} />
      </div>
      {/* Tablet & desktop (>= md): full two-column layout */}
      <div className="hidden md:block">
        <ProductDetailClient product={product} related={related} />
      </div>
    </>
  );
}

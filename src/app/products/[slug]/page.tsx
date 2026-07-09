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

  // Related rail, in priority order: editorially-picked → same series (e.g. other
  // "Eyfel" pieces) → same category. Deduped, self excluded, capped downstream.
  const all = await getProducts();
  const bySlug = new Map(all.map((p) => [p.slug, p]));
  const seen = new Set<string>([product.slug]);
  const related: typeof all = [];
  const add = (candidates: typeof all) => {
    for (const p of candidates) {
      if (p && !seen.has(p.slug)) {
        seen.add(p.slug);
        related.push(p);
      }
    }
  };
  add((product.relatedSlugs ?? []).map((s) => bySlug.get(s)!).filter(Boolean));
  if (product.series) add(all.filter((p) => p.series === product.series));
  add(all.filter((p) => p.category === product.category));

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

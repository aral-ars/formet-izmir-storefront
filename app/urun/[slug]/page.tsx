import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatPrice, getProductBySlug, products } from "@/lib/products";
import { ProductView } from "./product-view";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} — Formet`,
    description: `${product.name} · ${product.sub} · ${formatPrice(product.price)}`,
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

  const related = products
    .filter(
      (p) =>
        p.slug !== product.slug &&
        (p.collection === product.collection || p.category === product.category),
    )
    .slice(0, 4);

  const fallback = products
    .filter((p) => p.slug !== product.slug && !related.includes(p))
    .slice(0, 4 - related.length);

  return <ProductView product={product} related={[...related, ...fallback]} />;
}

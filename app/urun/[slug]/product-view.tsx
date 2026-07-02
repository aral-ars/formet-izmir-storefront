"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PromoBar } from "@/components/promo-bar";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  categoryShortLabel,
  formatPrice,
  type Product,
} from "@/lib/products";

const perks = [
  {
    title: "Ücretsiz teslimat",
    body: "81 il · 2–5 iş günü",
    icon: (
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="1" y="6" width="14" height="10" rx="1.5"></rect>
        <path d="M15 9h4l3 3v4h-7"></path>
        <circle cx="6" cy="18" r="2"></circle>
        <circle cx="18" cy="18" r="2"></circle>
      </svg>
    ),
  },
  {
    title: "Kapıda montaj",
    body: "Ekibimiz kurar",
    icon: (
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 7l-5 5-2-2"></path>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      </svg>
    ),
  },
  {
    title: "10 yıl garanti",
    body: "Pasa karşı",
    icon: (
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V5z"></path>
      </svg>
    ),
  },
  {
    title: "14 gün iade",
    body: "Koşulsuz",
    icon: (
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z"></path>
        <path d="M9 12l2 2 4-4"></path>
      </svg>
    ),
  },
];

function Placeholder({ label }: { label: string }) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center p-4 text-center"
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg,#EAE1D2 0 15px,#E3D9C8 15px 30px)",
      }}
    >
      <span className="text-[11px] leading-[1.5] tracking-[0.06em] text-[#A5987F] uppercase">
        {label}
      </span>
    </div>
  );
}

export function ProductView({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const gallery = product.gallery?.length
    ? product.gallery
    : [{ label: product.name, img: product.img }];

  const [imgIndex, setImgIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const [sizeIndex, setSizeIndex] = useState(
    product.sizes ? Math.min(1, product.sizes.length - 1) : 0,
  );
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const activeImg = gallery[imgIndex]?.img;
  const placeholderLabel = `${categoryShortLabel[product.category]} görseli`;

  const handleAddToCart = () => {
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div className="min-h-screen bg-paper p-2 text-ink">
      <PromoBar />
      <SiteHeader variant="product" />

      <div className="mx-auto max-w-[1280px] px-2.5 pt-5 pb-3.5 text-[13px] text-muted">
        <Link href="/" className="text-inherit no-underline">
          Ana Sayfa
        </Link>
        <span className="mx-2 opacity-50">/</span>
        <Link href="/magaza" className="text-inherit no-underline">
          Bahçe Mobilyaları
        </Link>
        <span className="mx-2 opacity-50">/</span>
        <span className="font-semibold text-ink">{product.name}</span>
      </div>

      <section className="mx-auto grid max-w-[1280px] grid-cols-1 items-start gap-2 xl:grid-cols-2">
        {/* gallery */}
        <div className="flex flex-col gap-2 xl:sticky xl:top-[100px]">
          <div className="animate-fm-up relative aspect-[5/6] overflow-hidden rounded-[16px] border border-ink/8 bg-chip">
            {activeImg ? (
              <Image
                key={activeImg}
                src={activeImg}
                alt={gallery[imgIndex]?.label ?? product.name}
                fill
                sizes="(min-width: 1280px) 50vw, 100vw"
                className="object-cover"
                priority
              />
            ) : (
              <Placeholder label={placeholderLabel} />
            )}
            {product.compareAtPrice && (
              <span className="absolute top-4 left-[18px] rounded-full bg-accent px-3 py-1.5 text-[11px] font-bold tracking-[0.04em] text-white">
                %
                {Math.round(
                  (1 - product.price / product.compareAtPrice) * 100,
                )}{" "}
                indirim
              </span>
            )}
            <button
              type="button"
              aria-label="Beğen"
              className="absolute top-3.5 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-card/92 shadow-[0_4px_14px_rgba(32,29,25,0.10)] backdrop-blur-[6px]"
            >
              <svg
                width="19"
                height="19"
                viewBox="0 0 22 22"
                fill="none"
                stroke="#837A6D"
                strokeWidth="1.7"
                strokeLinejoin="round"
              >
                <path d="M11 19C5.2 15 2.6 11.2 2.6 7.9 2.6 5.7 4.4 4 6.6 4 8.2 4 9.6 4.9 11 6.7 12.4 4.9 13.8 4 15.4 4 17.6 4 19.4 5.7 19.4 7.9 19.4 11.2 16.8 15 11 19Z"></path>
              </svg>
            </button>
          </div>
          {gallery.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {gallery.map((g, i) => (
                <button
                  key={g.img ?? g.label}
                  onClick={() => setImgIndex(i)}
                  aria-label={g.label}
                  className="relative aspect-square overflow-hidden rounded-xl bg-chip p-0"
                  style={{
                    border:
                      i === imgIndex
                        ? "2px solid var(--color-accent)"
                        : "1px solid rgba(32,29,25,0.12)",
                  }}
                >
                  {g.img && (
                    <Image
                      src={g.img}
                      alt={g.label}
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* info */}
        <div className="flex flex-col rounded-[16px] border border-ink/8 bg-card p-6.5 sm:p-10">
          {product.collection && (
            <div className="mb-3 text-xs font-bold tracking-[0.16em] text-accent uppercase">
              {product.collection} Koleksiyonu
            </div>
          )}
          <h1 className="m-0 mb-3 font-display text-[clamp(30px,4vw,40px)] leading-[1.04] font-bold tracking-[-0.025em]">
            {product.name}
          </h1>
          {product.rating && (
            <div className="mb-5 flex items-center gap-2.5">
              <span className="text-sm tracking-[2px] text-accent">
                ★★★★★
              </span>
              <span className="text-[13px] text-muted">
                {product.rating.value} · {product.rating.count} değerlendirme
              </span>
            </div>
          )}
          <div className="mb-6 flex items-baseline gap-3">
            <span className="font-display text-[clamp(28px,3.4vw,34px)] font-bold tracking-[-0.02em]">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-[17px] text-muted line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
          {product.description?.[0] && (
            <p className="m-0 mb-6.5 text-[15px] leading-[1.65] text-muted">
              {product.description[0]}
            </p>
          )}

          {product.colors && (
            <div className="mb-5.5">
              <div className="mb-3 flex justify-between">
                <span className="text-[13px] font-bold">Renk</span>
                <span className="text-[13px] text-muted">
                  {product.colors[colorIndex].name}
                </span>
              </div>
              <div className="flex gap-3">
                {product.colors.map((c, i) => (
                  <button
                    key={c.name}
                    onClick={() => setColorIndex(i)}
                    aria-label={c.name}
                    className="h-[34px] w-[34px] rounded-full border-none"
                    style={{
                      background: c.hex,
                      boxShadow:
                        i === colorIndex
                          ? "0 0 0 2px #FBF8F2, 0 0 0 4px var(--color-accent)"
                          : "0 0 0 1px rgba(32,29,25,0.12)",
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {product.sizes && (
            <div className="mb-6.5">
              <div className="mb-3 flex justify-between">
                <span className="text-[13px] font-bold">Konfigürasyon</span>
                <span className="text-[13px] text-muted">
                  {product.sizes[sizeIndex]}
                </span>
              </div>
              <div className="flex gap-2">
                {product.sizes.map((label, i) => (
                  <button
                    key={label}
                    onClick={() => setSizeIndex(i)}
                    className="flex-1 rounded-xl px-2.5 py-3.5 text-[13.5px] font-semibold transition-colors"
                    style={{
                      background: i === sizeIndex ? "var(--color-accent)" : "#FBF8F2",
                      color: i === sizeIndex ? "#fff" : "#201D19",
                      border: `1px solid ${i === sizeIndex ? "var(--color-accent)" : "rgba(32,29,25,0.14)"}`,
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6 flex flex-wrap gap-2.5">
            <div className="flex items-center rounded-full border border-ink/12 p-1">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Azalt"
                className="flex h-10 w-10 items-center justify-center rounded-full border-none bg-chip text-xl leading-none text-ink"
              >
                −
              </button>
              <span className="min-w-[38px] text-center text-[15px] font-bold">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => Math.min(9, q + 1))}
                aria-label="Arttır"
                className="flex h-10 w-10 items-center justify-center rounded-full border-none bg-chip text-xl leading-none text-ink"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className="min-w-[200px] flex-1 rounded-full border-none py-[15px] text-[15px] font-bold text-white transition-colors"
              style={{ background: added ? "var(--color-sage)" : "var(--color-accent)" }}
            >
              {added ? "Sepete eklendi ✓" : "Sepete ekle"}
            </button>
          </div>

          <div className="mt-auto grid grid-cols-1 gap-4 border-t border-ink/9 pt-6 min-[420px]:grid-cols-2">
            {perks.map((perk) => (
              <div key={perk.title} className="flex items-center gap-2.5">
                <span className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-[10px] bg-accent/12">
                  {perk.icon}
                </span>
                <div>
                  <div className="text-[13.5px] font-bold">{perk.title}</div>
                  <div className="text-xs text-muted">{perk.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DESCRIPTION + SPECS */}
      <section className="mx-auto max-w-[1280px] pt-12 sm:pt-18">
        <div className="grid grid-cols-1 items-start gap-2 lg:grid-cols-2">
          <div className="rounded-[16px] border border-ink/8 bg-card p-6.5 sm:p-10">
            <h2 className="m-0 mb-4.5 font-display text-[clamp(21px,2.6vw,26px)] font-bold tracking-[-0.01em]">
              Ürün açıklaması
            </h2>
            {(product.description ?? []).map((paragraph, i) => (
              <p
                key={i}
                className="m-0 mb-4 text-[15px] leading-[1.7] text-muted last:mb-0"
              >
                {paragraph}
              </p>
            ))}
          </div>
          <div className="rounded-[16px] border border-ink/8 bg-card p-6.5 sm:p-10">
            <h2 className="m-0 mb-2 font-display text-[clamp(21px,2.6vw,26px)] font-bold tracking-[-0.01em]">
              Teknik özellikler
            </h2>
            {(product.specs ?? []).map((spec, i, arr) => (
              <div
                key={spec.label}
                className={`flex justify-between gap-4 py-3.5 ${i < arr.length - 1 ? "border-b border-ink/9" : ""}`}
              >
                <span className="text-sm text-muted">{spec.label}</span>
                <span className="text-right text-sm font-semibold">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RELATED */}
      {related.length > 0 && (
        <section className="mx-auto max-w-[1280px] py-13 sm:py-20">
          <div className="mb-6.5 text-center sm:mb-10">
            <h2 className="m-0 font-display text-[clamp(24px,3.2vw,34px)] font-bold tracking-[-0.02em]">
              Bunlar da ilginizi çekebilir
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/urun/${p.slug}`}
                className="group block overflow-hidden rounded-[16px] border border-ink/8 bg-card text-inherit no-underline transition-shadow hover:shadow-[0_20px_44px_rgba(32,29,25,0.12)]"
              >
                <div className="relative aspect-square overflow-hidden bg-chip">
                  {p.img ? (
                    <Image
                      src={p.img}
                      alt={p.name}
                      fill
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <Placeholder
                      label={`${categoryShortLabel[p.category]} görseli`}
                    />
                  )}
                </div>
                <div className="p-4.5">
                  <div className="font-display text-base font-bold tracking-[-0.01em]">
                    {p.name}
                  </div>
                  <div className="mt-2 text-[15px] font-bold">
                    {formatPrice(p.price)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <SiteFooter />
    </div>
  );
}

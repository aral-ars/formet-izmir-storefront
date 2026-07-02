"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { PromoBar } from "@/components/promo-bar";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  categoryList,
  categoryShortLabel,
  formatPrice,
  products,
  type ProductCategory,
} from "@/lib/products";

type SortKey = "featured" | "new" | "price-asc" | "price-desc";

const ArrowIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14"></path>
    <path d="M13 6l6 6-6 6"></path>
  </svg>
);

const perks = [
  {
    title: "Ücretsiz teslimat",
    body: "81 ile 2–5 iş günü içinde ücretsiz kargo.",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="1" y="6" width="14" height="11" rx="1.5"></rect>
        <path d="M15 9h4l3 3v5h-7"></path>
        <circle cx="6" cy="18" r="2"></circle>
        <circle cx="18" cy="18" r="2"></circle>
      </svg>
    ),
  },
  {
    title: "Kapıda montaj",
    body: "Büyük ürünlerde kurulum ekibimizden ücretsiz.",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.4 2.4-2-2 2.4-2.4Z"></path>
      </svg>
    ),
  },
  {
    title: "10 yıl garanti",
    body: "Metal iskelette pas ve dayanıklılık garantisi.",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z"></path>
        <path d="M9 12l2 2 4-4"></path>
      </svg>
    ),
  },
];

export default function CollectionPage() {
  const [activeCat, setActiveCat] = useState<"all" | ProductCategory>("all");
  const [sort, setSort] = useState<SortKey>("featured");

  const cats = useMemo(
    () =>
      categoryList.map((c) => ({
        ...c,
        count:
          c.id === "all"
            ? products.length
            : products.filter((p) => p.category === c.id).length,
      })),
    [],
  );

  const list = useMemo(() => {
    const filtered =
      activeCat === "all"
        ? products.slice()
        : products.filter((p) => p.category === activeCat);
    if (sort === "price-asc")
      return filtered.sort((a, b) => a.price - b.price);
    if (sort === "price-desc")
      return filtered.sort((a, b) => b.price - a.price);
    if (sort === "new")
      return filtered.sort(
        (a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0),
      );
    return filtered;
  }, [activeCat, sort]);

  return (
    <div className="min-h-screen bg-paper p-2 text-ink">
      <PromoBar />
      <SiteHeader variant="page" active="shop" />

      <div className="mx-auto max-w-[1280px] px-2.5 pt-5 pb-1.5 text-[13px] text-muted">
        <Link href="/" className="text-inherit no-underline">
          Ana Sayfa
        </Link>
        <span className="mx-2 opacity-50">/</span>
        <span className="font-semibold text-ink">Mağaza</span>
      </div>

      <header className="mx-auto max-w-[1280px] px-2.5 pt-3.5 pb-6 sm:pb-8">
        <div className="animate-fm-up max-w-[640px]">
          <div className="mb-3.5 text-xs font-bold tracking-[0.2em] text-accent uppercase">
            Tüm koleksiyon
          </div>
          <h1 className="m-0 text-balance font-display text-[clamp(34px,5vw,60px)] leading-[1.02] font-bold tracking-[-0.025em] text-ink">
            Dış mekan mobilyaları
          </h1>
          <p className="mt-4 max-w-[480px] text-[clamp(14px,1.5vw,16px)] leading-[1.6] text-muted">
            Bahçe oturma gruplarından mangala, şezlongdan metal
            ayakkabılığa — atölyemizde üretilen, dört mevsim dışarıda kalmak
            için tasarlanmış parçalar.
          </p>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4 px-2.5">
        <div className="flex flex-wrap gap-2">
          {cats.map((c) => {
            const active = c.id === activeCat;
            return (
              <button
                key={c.id}
                onClick={() => setActiveCat(c.id)}
                className={`inline-flex items-center gap-2 rounded-full px-[18px] py-[11px] text-[13.5px] transition-colors ${
                  active
                    ? "border border-ink bg-ink font-semibold text-paper"
                    : "border border-ink/12 bg-card font-medium text-ink"
                }`}
              >
                <span>{c.label}</span>
                <span
                  className={`text-[11px] font-semibold ${active ? "text-paper/60" : "text-muted-2"}`}
                >
                  {c.count}
                </span>
              </button>
            );
          })}
        </div>
        <div className="flex flex-none items-center gap-3.5">
          <div className="text-[13.5px] whitespace-nowrap text-muted">
            {list.length} ürün
          </div>
          <div className="relative inline-flex items-center">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="cursor-pointer appearance-none rounded-full border border-ink/14 bg-card py-[11px] pr-[38px] pl-[18px] font-sans text-[13.5px] font-semibold text-ink outline-none"
            >
              <option value="featured">Öne çıkanlar</option>
              <option value="new">Yeni gelenler</option>
              <option value="price-asc">Fiyat: artan</option>
              <option value="price-desc">Fiyat: azalan</option>
            </select>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#837A6D"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="pointer-events-none absolute right-[15px]"
            >
              <path d="M6 9l6 6 6-6"></path>
            </svg>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-[1280px] px-2.5 pt-6 pb-10 sm:pt-8 sm:pb-16">
        {list.length > 0 ? (
          <div className="grid grid-cols-1 gap-2 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((p) => (
              <Link
                key={p.slug}
                href={`/urun/${p.slug}`}
                className="animate-fm-fade group flex flex-col overflow-hidden rounded-[16px] border border-ink/8 bg-card text-inherit no-underline transition-[box-shadow,transform] hover:-translate-y-[3px] hover:shadow-[0_22px_48px_rgba(32,29,25,0.12)]"
              >
                <div className="relative aspect-square overflow-hidden bg-chip">
                  {p.img ? (
                    <Image
                      src={p.img}
                      alt={p.name}
                      fill
                      sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 480px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div
                      className="absolute inset-0 flex items-center justify-center p-4 text-center"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(135deg,#EAE1D2 0 15px,#E3D9C8 15px 30px)",
                      }}
                    >
                      <span className="text-[10.5px] leading-[1.5] tracking-[0.06em] text-[#A5987F] uppercase">
                        {categoryShortLabel[p.category]} görseli
                      </span>
                    </div>
                  )}
                  {p.badge && (
                    <span
                      className={`absolute top-[13px] left-3.5 rounded-full px-[11px] py-[5px] text-[10.5px] font-semibold tracking-[0.05em] uppercase backdrop-blur-[6px] ${
                        p.badge === "Çok satan"
                          ? "bg-accent text-white"
                          : "bg-card/92 text-ink"
                      }`}
                    >
                      {p.badge}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <div className="mb-1.5 text-[11px] font-semibold tracking-[0.04em] text-[#A5987F] uppercase">
                    {categoryShortLabel[p.category]}
                  </div>
                  <div className="font-display text-[18px] leading-[1.2] font-bold tracking-[-0.01em] text-ink">
                    {p.name}
                  </div>
                  <div className="mt-[5px] text-[12.5px] text-muted">
                    {p.sub}
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-[18px]">
                    <div className="text-[16.5px] font-bold text-ink">
                      {formatPrice(p.price)}
                    </div>
                    <span className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-full bg-accent/12 text-accent">
                      <ArrowIcon />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-[16px] border border-dashed border-ink/16 bg-card px-5 py-[clamp(50px,8vw,90px)] text-center">
            <div className="mb-2 font-display text-[clamp(20px,2.6vw,26px)] font-bold text-ink">
              Yakında burada
            </div>
            <p className="m-0 text-[14.5px] text-muted">
              Bu kategoriye yeni ürünler ekleniyor. Diğer koleksiyonlara göz
              atın.
            </p>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-[1280px] px-2.5 pb-10 sm:pb-16">
        <div className="grid grid-cols-1 gap-2 min-[480px]:grid-cols-2 lg:grid-cols-3">
          {perks.map((perk) => (
            <div
              key={perk.title}
              className="rounded-[16px] border border-ink/8 bg-card p-[22px] sm:p-7"
            >
              <div className="mb-4 flex h-[42px] w-[42px] items-center justify-center rounded-full bg-accent/12 text-accent">
                {perk.icon}
              </div>
              <div className="font-display text-base font-bold text-ink">
                {perk.title}
              </div>
              <div className="mt-[5px] text-[13px] leading-[1.55] text-muted">
                {perk.body}
              </div>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter className="mt-5 sm:mt-10" />
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { PromoBar } from "@/components/promo-bar";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/reveal";
import { FaqAccordion } from "@/components/faq-accordion";
import {
  faqs,
  featuredSlugs,
  formatPrice,
  getProductBySlug,
  reviews,
  stores,
} from "@/lib/products";

const ArrowIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
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

const featuredProducts = featuredSlugs
  .map((slug) => getProductBySlug(slug))
  .filter((p): p is NonNullable<typeof p> => Boolean(p));

export default function Home() {
  return (
    <div className="min-h-screen bg-paper p-2 text-ink">
      <PromoBar gap />
      <SiteHeader variant="home" />

      {/* HERO */}
      <section
        className="relative h-[clamp(560px,90vh,940px)] overflow-hidden rounded-[16px]"
        style={{ marginTop: "calc(var(--nav-h, 84px) * -1)" }}
      >
        <Image
          src="/assets/formet-hero.png"
          alt="Formet dış mekan mobilyaları"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_46%]"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg,rgba(20,16,12,0.42) 0%,rgba(20,16,12,0.04) 26%,rgba(20,16,12,0) 44%,rgba(20,16,12,0.34) 78%,rgba(20,16,12,0.62) 100%)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-6 p-7 sm:p-16">
          <div className="animate-fm-up max-w-[640px]">
            <div className="mb-3.5 text-xs font-bold tracking-[0.22em] text-white/92 uppercase sm:mb-5">
              El işçiliği · Dış mekan
            </div>
            <h1
              className="m-0 mb-3.5 font-display text-[clamp(38px,6vw,76px)] leading-[1.0] font-bold tracking-[-0.025em] text-white sm:mb-5"
              style={{ textShadow: "0 2px 40px rgba(0,0,0,0.28)" }}
            >
              Açık havada,
              <br />
              zarafetle yaşayın.
            </h1>
            <p className="m-0 max-w-[480px] text-[clamp(15px,1.6vw,18px)] leading-[1.55] text-white/90">
              Toz boyalı alüminyum ve el örmesi halattan, dört mevsim dışarıda
              kalmak için üretilen bahçe ve teras mobilyaları.
            </p>
          </div>
          <Link
            href="/magaza"
            className="inline-flex flex-none items-center gap-2.5 rounded-full bg-card px-8 py-4 text-[15px] font-semibold whitespace-nowrap text-ink no-underline shadow-[0_14px_34px_rgba(0,0,0,0.22)] transition-transform hover:-translate-y-0.5"
          >
            Koleksiyonu keşfet
            <ArrowIcon />
          </Link>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="mx-auto max-w-[1120px] px-5 py-[clamp(74px,11vw,150px)] text-center sm:px-10">
        <Reveal>
          <div className="mb-[clamp(20px,3vw,30px)] text-xs font-bold tracking-[0.2em] text-accent uppercase">
            2008&apos;den beri İstanbul
          </div>
          <h2 className="m-0 text-balance font-display text-[clamp(26px,4.2vw,52px)] leading-[1.16] font-medium tracking-[-0.02em] text-ink">
            Her parça, atölyemizde tek tek örülür — güneşe, yağmura ve tuzlu
            havaya karşı test edilir. Dışarıda geçen yıllara dayanmak için
            tasarlandı.
          </h2>
        </Reveal>
      </section>

      {/* COLLECTION CHAPTERS */}
      <section className="flex flex-col gap-2">
        <Reveal>
          <a
            href="#collection"
            className="relative block h-[clamp(440px,62vh,720px)] overflow-hidden rounded-[16px] text-inherit no-underline"
          >
            <Image
              src="/assets/santana-lifestyle.png"
              alt="Santana Koleksiyonu"
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg,rgba(20,16,12,0.5) 0%,rgba(20,16,12,0.12) 46%,rgba(20,16,12,0) 70%)",
              }}
            />
            <div className="absolute inset-y-0 left-0 flex max-w-[560px] flex-col justify-end p-7 text-white sm:p-14">
              <div className="mb-3.5 text-xs font-bold tracking-[0.2em] opacity-90 uppercase">
                Öne çıkan
              </div>
              <div className="font-display text-[clamp(30px,4.5vw,54px)] leading-[1.02] font-bold tracking-[-0.02em]">
                Santana Koleksiyonu
              </div>
              <p className="my-4 max-w-[400px] text-[clamp(14px,1.5vw,16px)] leading-[1.55] text-white/90">
                Örme halat dokusu ve pudralı alüminyum iskelet — modern
                terasların merkezine yakışan yumuşak hatlar.
              </p>
              <span className="inline-flex items-center gap-2.5 text-[14.5px] font-semibold">
                İncele
                <ArrowIcon size={17} />
              </span>
            </div>
          </a>
        </Reveal>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {[
            {
              img: "/assets/isabel-lifestyle.png",
              name: "Isabel",
              sub: "El örmesi rattan · daybed",
              alt: "Isabel Koleksiyonu",
            },
            {
              img: "/assets/pisa-lifestyle.png",
              name: "Pisa",
              sub: "Doğal halat · ahşap ayak",
              alt: "Pisa Koleksiyonu",
            },
          ].map((chapter) => (
            <Reveal key={chapter.name}>
              <a
                href="#collection"
                className="relative block h-[clamp(380px,46vh,520px)] overflow-hidden rounded-[16px] text-inherit no-underline"
              >
                <Image
                  src={chapter.img}
                  alt={chapter.alt}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg,rgba(20,16,12,0) 42%,rgba(20,16,12,0.58))",
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                  <div className="font-display text-[clamp(24px,2.8vw,32px)] leading-[1.04] font-bold tracking-[-0.015em]">
                    {chapter.name}
                  </div>
                  <div className="mt-1.5 text-[13.5px] text-white/85">
                    {chapter.sub}
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PRODUCT GRID */}
      <section
        id="collection"
        className="mx-auto max-w-[1280px] scroll-mt-20 px-4 pt-[clamp(72px,10vw,128px)] pb-[clamp(40px,6vw,60px)] sm:px-7"
      >
        <Reveal className="mb-[clamp(30px,4vw,48px)] flex flex-wrap items-end justify-between gap-5">
          <div>
            <div className="mb-3.5 text-xs font-bold tracking-[0.2em] text-accent uppercase">
              Sezonun koleksiyonu
            </div>
            <h2 className="m-0 font-display text-[clamp(30px,4.4vw,50px)] leading-[1.02] font-bold tracking-[-0.025em] text-ink">
              Dışarısı için yapıldı
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-ink px-5 py-[11px] text-[13.5px] font-semibold text-paper">
              Tümü
            </span>
            {["Santana", "Isabel", "Pisa"].map((label) => (
              <span
                key={label}
                className="rounded-full border border-ink/12 bg-card px-5 py-[11px] text-[13.5px] font-medium text-ink"
              >
                {label}
              </span>
            ))}
          </div>
        </Reveal>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((p) => (
            <Reveal key={p.slug} className="group">
              <Link
                href={`/urun/${p.slug}`}
                className="flex h-full flex-col overflow-hidden rounded-[16px] border border-ink/8 bg-card text-inherit no-underline transition-shadow hover:shadow-[0_22px_48px_rgba(32,29,25,0.12)]"
              >
                <div className="relative aspect-square overflow-hidden bg-chip">
                  {p.img && (
                    <Image
                      src={p.img}
                      alt={p.name}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <span className="absolute top-3.5 left-[15px] rounded-full bg-card/92 px-[11px] py-[5px] text-[10.5px] font-semibold tracking-[0.05em] text-ink uppercase backdrop-blur-[6px]">
                    {p.collection ?? "Formet"}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-[18px] sm:p-[22px]">
                  <div className="font-display text-[19px] font-bold tracking-[-0.01em] text-ink">
                    {p.name}
                  </div>
                  <div className="mt-[5px] text-[13px] text-muted">
                    {p.sub}
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-[18px]">
                    <div className="text-[17px] font-bold text-ink">
                      {formatPrice(p.price)}
                    </div>
                    <span className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-accent/12 text-accent">
                      <ArrowIcon size={17} />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CRAFT / MATERIALS */}
      <section
        id="craft"
        className="mx-auto max-w-[1280px] scroll-mt-20 px-4 py-[clamp(60px,9vw,110px)] sm:px-7"
      >
        <Reveal className="grid grid-cols-1 items-stretch gap-2 lg:grid-cols-2">
          <div className="relative min-h-[clamp(340px,44vw,520px)] overflow-hidden rounded-[16px]">
            <Image
              src="/assets/santana-detail.png"
              alt="Halat dokusu detayı"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center rounded-[16px] border border-ink/8 bg-card p-7 sm:p-13">
            <div className="mb-4 text-xs font-bold tracking-[0.18em] text-accent uppercase">
              Malzeme &amp; dayanıklılık
            </div>
            <h2 className="m-0 mb-[18px] font-display text-[clamp(26px,3.4vw,40px)] leading-[1.08] font-bold tracking-[-0.02em] text-ink">
              Yıllarca dışarıda kalmak için.
            </h2>
            <p className="m-0 mb-[clamp(24px,3vw,34px)] max-w-[440px] text-[clamp(14px,1.5vw,16px)] leading-[1.65] text-muted">
              Toz boyalı çelik iskelet, UV korumalı el örmesi halat ve su
              geçirmez akrilik minderler — çizilmeye, pasa ve solmaya karşı
              test edilir.
            </p>
            <div className="mb-[clamp(24px,3vw,34px)] flex flex-wrap gap-6 sm:gap-12">
              {[
                { value: "10 yıl", label: "iskelet garantisi" },
                { value: "%100", label: "el işçiliği" },
                { value: "4 mevsim", label: "dış mekan" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="font-display text-[clamp(30px,3.6vw,42px)] font-bold tracking-[-0.02em] text-ink">
                    {stat.value}
                  </div>
                  <div className="mt-0.5 text-[12.5px] text-muted">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2.5">
              {[
                "Toz boyalı çelik",
                "UV korumalı kumaş",
                "Su geçirmez minder",
                "Kolay montaj",
              ].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-chip px-[15px] py-2.5 text-[12.5px] font-medium text-ink"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* REVIEWS */}
      <section className="mx-auto max-w-[1280px] px-4 py-[clamp(40px,6vw,60px)] sm:px-7">
        <Reveal className="mb-[clamp(28px,4vw,44px)] text-center">
          <div className="mb-3 text-xs font-bold tracking-[0.18em] text-accent uppercase">
            Müşteri yorumları
          </div>
          <h2 className="m-0 font-display text-[clamp(26px,3.6vw,42px)] font-bold tracking-[-0.02em] text-ink">
            Türkiye genelinde sevildi
          </h2>
        </Reveal>
        <Reveal className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((rv) => (
            <div
              key={rv.name}
              className="flex flex-col rounded-[16px] border border-ink/8 bg-card p-7 sm:p-8"
            >
              <div className="mb-4 text-sm tracking-[3px] text-accent">
                ★★★★★
              </div>
              <p className="m-0 mb-[22px] flex-1 text-[15px] leading-[1.65] text-[#3A352E]">
                {rv.text}
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/12 font-display text-[15px] font-bold text-accent">
                  {rv.initial}
                </div>
                <div>
                  <div className="text-[13.5px] font-bold text-ink">
                    {rv.name}
                  </div>
                  <div className="text-xs text-muted">{rv.city}</div>
                </div>
              </div>
            </div>
          ))}
        </Reveal>
      </section>

      {/* STORES + DELIVERY */}
      <section
        id="stores"
        className="mx-auto max-w-[1280px] scroll-mt-20 px-4 py-[clamp(40px,6vw,70px)] sm:px-7"
      >
        <Reveal className="grid grid-cols-1 gap-2 lg:grid-cols-2">
          <div className="rounded-[16px] border border-ink/8 bg-card p-7 sm:p-10">
            <div className="font-display text-[clamp(22px,2.6vw,30px)] font-bold tracking-[-0.015em] text-ink">
              Mağazalarımız
            </div>
            <div className="mt-1.5 mb-[22px] text-[13.5px] text-muted">
              Türkiye genelinde 3 showroom
            </div>
            {stores.map((st) => (
              <Link
                key={st.city}
                href="/magazalar"
                className="flex items-center justify-between gap-3.5 border-t border-ink/9 py-[18px] text-inherit no-underline"
              >
                <div>
                  <div className="font-display text-base font-bold text-ink">
                    {st.city}
                  </div>
                  <div className="mt-0.5 text-[12.5px] text-muted">
                    {st.name}
                  </div>
                </div>
                <span className="inline-flex flex-none items-center gap-1.5 text-[12.5px] font-semibold text-accent">
                  Yol tarifi
                  <ArrowIcon size={15} />
                </span>
              </Link>
            ))}
          </div>
          <div className="relative flex min-h-[280px] flex-col justify-end overflow-hidden rounded-[16px] p-7 text-white sm:p-10">
            <Image
              src="/assets/isabel-set.png"
              alt=""
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg,rgba(20,16,12,0.15),rgba(20,16,12,0.72))",
              }}
            />
            <div className="relative">
              <div className="font-display text-[clamp(20px,2.4vw,26px)] font-bold tracking-[-0.01em]">
                Türkiye&apos;nin her yerine ücretsiz teslimat
              </div>
              <div className="mt-5 flex flex-wrap gap-5 sm:gap-8">
                {[
                  { value: "2–5", label: "iş günü" },
                  { value: "81 il", label: "teslimat" },
                  { value: "Kapıda", label: "montaj" },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="font-display text-[22px] font-bold">
                      {s.value}
                    </div>
                    <div className="text-xs opacity-85">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-[900px] px-4 py-[clamp(40px,6vw,70px)] sm:px-7">
        <Reveal className="mb-[clamp(28px,4vw,44px)] text-center">
          <div className="mb-3 text-xs font-bold tracking-[0.18em] text-accent uppercase">
            Sıkça sorulan sorular
          </div>
          <h2 className="m-0 font-display text-[clamp(26px,3.6vw,42px)] font-bold tracking-[-0.02em] text-ink">
            Merak edilenler
          </h2>
        </Reveal>
        <FaqAccordion items={faqs} />
      </section>

      <SiteFooter className="mt-5 sm:mt-10" />
    </div>
  );
}

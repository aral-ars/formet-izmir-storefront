"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PromoBar } from "@/components/promo-bar";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const schedule = [
  { day: "Pazartesi", range: "09:00 – 19:00", dow: 1 },
  { day: "Salı", range: "09:00 – 19:00", dow: 2 },
  { day: "Çarşamba", range: "09:00 – 19:00", dow: 3 },
  { day: "Perşembe", range: "09:00 – 19:00", dow: 4 },
  { day: "Cuma", range: "09:00 – 19:00", dow: 5 },
  { day: "Cumartesi", range: "09:00 – 19:00", dow: 6 },
  { day: "Pazar", range: "11:00 – 18:00", dow: 0 },
];

const directionsUrl =
  "https://www.google.com/maps/dir/?api=1&destination=" +
  encodeURIComponent("Formet Bağcılar İstanbul");

function parseRange(range: string) {
  const m = range.match(/(\d{2}):(\d{2})\s*–\s*(\d{2}):(\d{2})/);
  if (!m) return null;
  return {
    open: Number(m[1]) * 60 + Number(m[2]),
    close: Number(m[3]) * 60 + Number(m[4]),
  };
}

const gettingHere = [
  {
    title: "Toplu taşıma",
    body: "M1B Metro Bağcılar durağına 6 dk yürüme mesafesinde. Kirazlı aktarma noktası yakınında.",
    icon: (
      <svg
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="5" y="3" width="14" height="15" rx="3"></rect>
        <path d="M5 12h14"></path>
        <path d="M8 18l-1.5 3M16 18l1.5 3"></path>
        <circle cx="8.5" cy="15" r="0.6" fill="currentColor"></circle>
        <circle cx="15.5" cy="15" r="0.6" fill="currentColor"></circle>
      </svg>
    ),
  },
  {
    title: "Otopark",
    body: "Mağaza önünde ücretsiz misafir otoparkı. Büyük ürünlerde yükleme desteği sağlanır.",
    icon: (
      <svg
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 13l1.5-5A2 2 0 0 1 8.4 6.5h7.2a2 2 0 0 1 1.9 1.5L19 13v5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H8v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-5Z"></path>
        <circle cx="8" cy="15.5" r="0.8" fill="currentColor"></circle>
        <circle cx="16" cy="15.5" r="0.8" fill="currentColor"></circle>
      </svg>
    ),
  },
  {
    title: "Randevu ile ziyaret",
    body: "Kişisel danışmanlık için randevu alabilirsiniz. Hafta içi daha sakin bir deneyim için idealdir.",
    icon: (
      <svg
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="4" y="5" width="16" height="16" rx="2.5"></rect>
        <path d="M4 9h16M8 3v4M16 3v4"></path>
        <path d="M9.5 14l1.8 1.8L15 12"></path>
      </svg>
    ),
  },
];

export default function VisitPage() {
  const [now, setNow] = useState<{ dow: number; mins: number } | null>(null);

  useEffect(() => {
    // Reads the system clock (an external system), so this can only run
    // client-side after mount — computing it during render would mismatch SSR.
    const d = new Date();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow({ dow: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() });
  }, []);

  let statusText = "Çalışma saatleri";
  if (now) {
    const todayRow = schedule.find((s) => s.dow === now.dow);
    const t = todayRow ? parseRange(todayRow.range) : null;
    if (t && now.mins >= t.open && now.mins < t.close) {
      statusText =
        "Şu anda açık · " + todayRow!.range.split(" – ")[1] + "'a kadar";
    } else {
      statusText = "Şu anda kapalı";
    }
  }

  return (
    <div className="min-h-screen bg-paper p-2 text-ink">
      <PromoBar />
      <SiteHeader variant="page" active="visit" />

      <div className="mx-auto max-w-[1280px] px-2.5 pt-5 pb-1.5 text-[13px] text-muted">
        <Link href="/" className="text-inherit no-underline">
          Ana Sayfa
        </Link>
        <span className="mx-2 opacity-50">/</span>
        <span className="font-semibold text-ink">Mağazamızı Ziyaret Edin</span>
      </div>

      <header className="mx-auto max-w-[1280px] px-2.5 pt-3.5 pb-5 sm:pb-6.5">
        <div className="animate-fm-up max-w-[660px]">
          <div className="mb-3.5 text-xs font-bold tracking-[0.2em] text-accent uppercase">
            İstanbul · Bağcılar
          </div>
          <h1 className="m-0 text-balance font-display text-[clamp(34px,5vw,60px)] leading-[1.02] font-bold tracking-[-0.025em] text-ink">
            Showroom&apos;umuza bekleriz
          </h1>
          <p className="mt-4 max-w-[520px] text-[clamp(14px,1.5vw,16px)] leading-[1.6] text-muted">
            Koleksiyonun tamamını yerinde görün, halat dokusuna dokunun,
            minderlerin rahatlığını deneyin. Ekibimiz doğru parçayı
            seçmenize yardımcı olur.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-[1280px] px-2.5">
        <div className="grid grid-cols-1 items-stretch gap-2 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="flex flex-col rounded-[16px] border border-ink/8 bg-card p-6.5 sm:p-10">
            <div className="mb-5 inline-flex items-center gap-2.5 self-start rounded-full bg-sage/12 py-[7px] pr-[13px] pl-[11px] text-xs font-semibold text-[#4A5C40]">
              <span className="animate-fm-pulse h-2 w-2 rounded-full bg-sage" />
              {statusText}
            </div>
            <div className="font-display text-[clamp(24px,3vw,32px)] leading-[1.08] font-bold tracking-[-0.015em] text-ink">
              Formet Showroom
            </div>
            <div className="mt-1.5 text-[13.5px] text-muted">
              Tek showroom · fabrika satış mağazası
            </div>

            <div className="mt-6.5 flex flex-col gap-0.5">
              <div className="flex gap-3.5 border-t border-ink/9 py-[15px]">
                <span className="mt-px flex-none text-accent">
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z"></path>
                    <circle cx="12" cy="10" r="2.6"></circle>
                  </svg>
                </span>
                <div>
                  <div className="text-[14.5px] font-semibold text-ink">
                    Adres
                  </div>
                  <div className="mt-0.5 text-[13.5px] leading-[1.6] text-muted">
                    Merkez Mah. 1234. Sk. No:12
                    <br />
                    Bağcılar, İstanbul 34200
                  </div>
                </div>
              </div>
              <div className="flex gap-3.5 border-t border-ink/9 py-[15px]">
                <span className="mt-px flex-none text-accent">
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L20 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"></path>
                  </svg>
                </span>
                <div>
                  <div className="text-[14.5px] font-semibold text-ink">
                    Telefon
                  </div>
                  <a
                    href="tel:+902125550123"
                    className="mt-0.5 block text-[13.5px] leading-[1.6] text-muted no-underline"
                  >
                    +90 212 555 0123
                  </a>
                </div>
              </div>
              <div className="flex gap-3.5 border-t border-b border-ink/9 py-[15px]">
                <span className="mt-px flex-none text-accent">
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2"></rect>
                    <path d="M4 6l8 6 8-6"></path>
                  </svg>
                </span>
                <div>
                  <div className="text-[14.5px] font-semibold text-ink">
                    E-posta
                  </div>
                  <a
                    href="mailto:info@formet.com.tr"
                    className="mt-0.5 block text-[13.5px] leading-[1.6] text-muted no-underline"
                  >
                    info@formet.com.tr
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-6.5 flex flex-wrap gap-2.5">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener"
                className="inline-flex min-w-[150px] flex-1 items-center justify-center gap-2.5 rounded-full bg-ink px-5.5 py-[15px] text-[14.5px] font-semibold text-paper no-underline transition-transform hover:-translate-y-0.5"
              >
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
                  <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z"></path>
                  <circle cx="12" cy="10" r="2.6"></circle>
                </svg>
                Yol tarifi al
              </a>
              <a
                href="tel:+902125550123"
                className="inline-flex flex-none items-center justify-center gap-2.5 rounded-full border border-ink/16 bg-card px-5.5 py-[15px] text-[14.5px] font-semibold text-ink no-underline"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L20 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"></path>
                </svg>
                Ara
              </a>
            </div>
          </div>

          <div className="relative min-h-[360px] overflow-hidden rounded-[16px] border border-ink/8 bg-chip sm:min-h-[440px]">
            <iframe
              title="Formet Showroom haritası"
              src="https://maps.google.com/maps?q=Bagcilar,Istanbul&z=13&output=embed"
              className="absolute inset-0 h-full w-full border-0"
              style={{ filter: "grayscale(0.18) contrast(1.02)" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-2.5 pt-2">
        <div className="grid grid-cols-1 items-start gap-2 lg:grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
          <div className="rounded-[16px] border border-ink/8 bg-card p-6.5 sm:p-9.5">
            <div className="mb-4 text-xs font-bold tracking-[0.16em] text-accent uppercase">
              Çalışma saatleri
            </div>
            {schedule.map((s) => {
              const today = now?.dow === s.dow;
              return (
                <div
                  key={s.day}
                  className="-mx-3.5 flex items-center justify-between gap-4 rounded-xl px-3.5 py-3"
                  style={{
                    background: today
                      ? "rgba(10,77,156,0.12)"
                      : "transparent",
                  }}
                >
                  <span
                    className={`text-[14.5px] ${today ? "font-bold text-ink" : "font-medium text-[#3A352E]"}`}
                  >
                    {s.day}
                    {today ? " · Bugün" : ""}
                  </span>
                  <span
                    className={`text-sm ${today ? "font-bold text-accent" : "font-medium text-muted"}`}
                  >
                    {s.range}
                  </span>
                </div>
              );
            })}
            <div className="mt-5 flex items-center gap-2.5 border-t border-ink/9 pt-[18px] text-[13px] text-muted">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="9"></circle>
                <path d="M12 7v5l3 2"></path>
              </svg>
              Resmi tatillerde kapalıyız.
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {gettingHere.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 rounded-[16px] border border-ink/8 bg-card p-[22px] sm:p-7"
              >
                <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-accent/12 text-accent">
                  {item.icon}
                </div>
                <div>
                  <div className="font-display text-base font-bold text-ink">
                    {item.title}
                  </div>
                  <div className="mt-1 text-[13.5px] leading-[1.55] text-muted">
                    {item.body}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-2.5 pt-10 sm:pt-16">
        <div className="mb-5 sm:mb-7">
          <div className="mb-3 text-xs font-bold tracking-[0.18em] text-accent uppercase">
            Mağazadan
          </div>
          <h2 className="m-0 font-display text-[clamp(24px,3.4vw,40px)] font-bold tracking-[-0.02em] text-ink">
            Koleksiyonu yerinde görün
          </h2>
        </div>
        <div className="grid grid-cols-2 grid-rows-2 gap-2">
          <div className="relative col-span-1 row-span-2 min-h-[300px] overflow-hidden rounded-[16px]">
            <Image
              src="/assets/santana-lifestyle.png"
              alt="Formet showroom"
              fill
              sizes="(min-width: 640px) 50vw, 60vw"
              className="object-cover"
            />
          </div>
          <div className="relative min-h-[150px] overflow-hidden rounded-[16px]">
            <Image
              src="/assets/isabel-lifestyle.png"
              alt="Showroom detay"
              fill
              sizes="(min-width: 640px) 25vw, 40vw"
              className="object-cover"
            />
          </div>
          <div className="relative min-h-[150px] overflow-hidden rounded-[16px]">
            <Image
              src="/assets/pisa-lifestyle.png"
              alt="Showroom detay"
              fill
              sizes="(min-width: 640px) 25vw, 40vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-2.5 py-10 sm:py-16">
        <div className="relative flex flex-col items-center overflow-hidden rounded-[16px] px-6 py-10 text-center text-white sm:px-15 sm:py-20">
          <Image
            src="/assets/isabel-set.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg,rgba(20,16,12,0.42),rgba(20,16,12,0.66))",
            }}
          />
          <div className="relative max-w-[560px]">
            <h2 className="m-0 text-balance font-display text-[clamp(26px,3.8vw,46px)] leading-[1.06] font-bold tracking-[-0.02em]">
              Sorularınız mı var? Bize ulaşın.
            </h2>
            <p className="my-4 text-[clamp(14px,1.6vw,17px)] leading-[1.55] text-white/90">
              Stok, teslimat veya montaj hakkında hafta içi 09:00–18:00 arası
              telefonla yanınızdayız.
            </p>
            <div className="flex flex-wrap justify-center gap-2.5">
              <a
                href="tel:+902125550123"
                className="inline-flex items-center gap-2.5 rounded-full bg-card px-7.5 py-[15px] text-[15px] font-semibold text-ink no-underline"
              >
                +90 212 555 0123
              </a>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2.5 rounded-full border border-white/40 bg-white/12 px-7.5 py-[15px] text-[15px] font-semibold text-white no-underline"
              >
                Yol tarifi al
              </a>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter className="mt-3 sm:mt-6" />
    </div>
  );
}

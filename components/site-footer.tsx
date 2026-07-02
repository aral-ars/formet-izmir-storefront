import type { ReactNode } from "react";

function SocialLink({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <a
      href="#"
      aria-label={label}
      className="flex h-[34px] w-[34px] items-center justify-center rounded-full border border-paper/20 text-paper/75 no-underline"
    >
      {children}
    </a>
  );
}

export function SiteFooter({ className = "" }: { className?: string }) {
  return (
    <footer
      className={`relative overflow-hidden rounded-[16px] bg-ink px-5 pb-7 text-paper sm:px-9 ${className}`}
    >
      <div className="flex h-[74px] items-start justify-center overflow-hidden sm:h-[100px] lg:h-[120px]">
        <div className="pt-2.5 font-display text-[120px] leading-[0.74] font-extrabold tracking-[0.01em] whitespace-nowrap text-paper/6 select-none sm:text-[220px] lg:text-[300px]">
          FORMET
        </div>
      </div>

      <div className="mt-2 grid grid-cols-1 gap-8 border-t border-paper/14 pt-9 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
        <div>
          <div className="mb-3.5 text-[15px] font-bold">Konum</div>
          <div className="text-[13.5px] leading-[1.75] text-paper/62">
            Formet Showroom · Bağcılar
            <br />
            Merkez Mah. 1234. Sk. No:12
            <br />
            İstanbul, Türkiye 34200
          </div>
        </div>
        <div>
          <div className="mb-3.5 text-[15px] font-bold">İletişim</div>
          <div className="text-[13.5px] leading-[1.75] text-paper/62">
            +90 212 555 0123
            <br />
            Hafta içi 09:00 – 18:00
            <br />
            <a href="mailto:info@formet.com.tr" className="no-underline">
              info@formet.com.tr
            </a>
          </div>
        </div>
        <div>
          <div className="mb-4 font-display text-[20px] font-bold tracking-[-0.01em] sm:text-[24px]">
            Bültenimize kaydolun
          </div>
          <form className="flex max-w-[420px] items-center gap-2 rounded-full border border-paper/16 bg-paper/8 py-1.5 pr-1.5 pl-5">
            <input
              type="email"
              placeholder="E-posta adresiniz"
              className="min-w-0 flex-1 border-none bg-transparent text-sm text-paper outline-none placeholder:text-paper/50"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-paper px-6 py-3 text-sm font-semibold text-ink"
            >
              Katıl
            </button>
          </form>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-paper/14 pt-[22px] sm:mt-10">
        <div className="flex gap-2.5">
          <SocialLink label="Instagram">
            <svg
              width="16"
              height="16"
              viewBox="0 0 22 22"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <rect x="3.5" y="3.5" width="15" height="15" rx="4.5"></rect>
              <circle cx="11" cy="11" r="3.6"></circle>
              <circle
                cx="15.6"
                cy="6.4"
                r="0.9"
                fill="currentColor"
                stroke="none"
              ></circle>
            </svg>
          </SocialLink>
          <SocialLink label="Pinterest">
            <span className="text-[13px] font-bold">P</span>
          </SocialLink>
          <SocialLink label="Facebook">
            <span className="text-[13px] font-bold">f</span>
          </SocialLink>
        </div>
        <div className="text-[13px] text-paper/55">
          © 2026 Formet. Tüm hakları saklıdır.
        </div>
        <a href="#" className="text-[13px] text-paper/55 no-underline">
          Şartlar &amp; Koşullar
        </a>
      </div>
    </footer>
  );
}

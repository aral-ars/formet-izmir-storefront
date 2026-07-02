"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type NavLink = { label: string; href: string };

type HeaderVariant = "home" | "page" | "product";

const PAGE_LINKS: NavLink[] = [
  { label: "Mağaza", href: "/magaza" },
  { label: "Zanaat", href: "/#craft" },
  { label: "Mağazalar", href: "/magazalar" },
];

const PRODUCT_DESKTOP_LINKS: NavLink[] = [
  { label: "Zanaat", href: "/#craft" },
];

const PRODUCT_MOBILE_LINKS: NavLink[] = [
  { label: "Mağaza", href: "/#collection" },
  { label: "Zanaat", href: "/#craft" },
  { label: "Mağazalar", href: "/magazalar" },
];

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 22 22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    >
      <circle cx="9.5" cy="9.5" r="6.5"></circle>
      <line x1="14.5" y1="14.5" x2="20" y2="20"></line>
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 22 22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    >
      <path d="M11 19C5.2 15 2.6 11.2 2.6 7.9 2.6 5.7 4.4 4 6.6 4 8.2 4 9.6 4.9 11 6.7 12.4 4.9 13.8 4 15.4 4 17.6 4 19.4 5.7 19.4 7.9 19.4 11.2 16.8 15 11 19Z"></path>
    </svg>
  );
}

function CartIcon() {
  return (
    <span className="relative inline-flex text-inherit">
      <svg
        width="21"
        height="21"
        viewBox="0 0 22 22"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <path d="M5 7h12l-1.1 12.4a1 1 0 0 1-1 .9H7.1a1 1 0 0 1-1-.9L5 7Z"></path>
        <path d="M8 7a3 3 0 0 1 6 0"></path>
      </svg>
      <span className="absolute -top-[3px] -right-[5px] flex h-[15px] w-[15px] items-center justify-center rounded-full bg-accent text-[9px] font-bold text-white">
        2
      </span>
    </span>
  );
}

function MenuIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <line x1="3" y1="7" x2="21" y2="7"></line>
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="17" x2="21" y2="17"></line>
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <line x1="6" y1="6" x2="18" y2="18"></line>
      <line x1="18" y1="6" x2="6" y2="18"></line>
    </svg>
  );
}

function BackIcon() {
  return (
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
      <path d="M15 18l-6-6 6-6"></path>
    </svg>
  );
}

export function SiteHeader({
  variant = "page",
  active,
}: {
  variant?: HeaderVariant;
  active?: "shop" | "craft" | "visit";
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = variant === "home";
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  // Home's hero sits behind the transparent nav, pulled up by exactly the
  // nav's rendered height (which varies with breakpoint/content) via this var.
  useEffect(() => {
    if (!isHome || !navRef.current) return;
    const el = navRef.current;
    const setVar = () =>
      document.documentElement.style.setProperty(
        "--nav-h",
        `${el.getBoundingClientRect().height}px`,
      );
    setVar();
    const ro = new ResizeObserver(setVar);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isHome]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const dark = !isHome || scrolled;

  const desktopLinks =
    variant === "product" ? PRODUCT_DESKTOP_LINKS : PAGE_LINKS;
  const mobileLinks =
    variant === "product" ? PRODUCT_MOBILE_LINKS : PAGE_LINKS;

  const linkWeight = (label: string) => {
    if (variant === "product" || isHome) return "font-semibold";
    const isActive =
      (active === "shop" && label === "Mağaza") ||
      (active === "visit" && label === "Mağazalar");
    return isActive ? "font-bold" : "font-semibold";
  };

  return (
    <>
      <nav
        ref={navRef}
        className="nav:px-8 -mx-2 sticky top-0 z-40 grid grid-cols-[1fr_auto_1fr] items-center px-4 py-[15px] transition-[background-color,color,box-shadow,border-color] duration-400 nav:py-[17px]"
        style={{
          backgroundColor: dark ? "rgba(251,248,242,0.82)" : "transparent",
          color: dark ? "#201D19" : "#FBF8F2",
          borderBottom: `1px solid ${dark ? "rgba(32,29,25,0.10)" : "transparent"}`,
          boxShadow: dark ? "0 6px 26px rgba(32,29,25,0.08)" : "none",
          backdropFilter: dark ? "blur(22px) saturate(160%)" : "none",
          WebkitBackdropFilter: dark ? "blur(22px) saturate(160%)" : "none",
        }}
      >
        <div className="nav:flex hidden items-center gap-[26px]">
          {variant === "product" && (
            <Link
              href="/"
              className="inline-flex items-center gap-[7px] text-sm font-semibold text-inherit no-underline"
            >
              <BackIcon />
              Mağaza
            </Link>
          )}
          {desktopLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`text-sm text-inherit no-underline ${linkWeight(link.label)}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Menü"
          className="nav:hidden flex h-10 w-10 items-center justify-center border-none bg-transparent p-0 text-inherit"
        >
          <MenuIcon />
        </button>

        <Link
          href="/"
          className="flex items-center justify-center text-inherit no-underline"
        >
          {isHome ? (
            <span className="relative inline-block h-[16px] w-[122px] flex-none nav:h-[21px] nav:w-[160px]">
              <Image
                src="/assets/formet-wordmark-white.png"
                alt="Formet"
                fill
                sizes="160px"
                className="object-contain object-center transition-opacity duration-400"
                style={{ opacity: dark ? 0 : 1 }}
                priority
              />
              <Image
                src="/assets/formet-wordmark-black.png"
                alt=""
                aria-hidden
                fill
                sizes="160px"
                className="object-contain object-center transition-opacity duration-400"
                style={{ opacity: dark ? 1 : 0 }}
              />
            </span>
          ) : (
            <Image
              src="/assets/formet-wordmark-black.png"
              alt="Formet"
              width={140}
              height={19}
              className="h-4 w-auto object-contain nav:h-[21px]"
              priority
            />
          )}
        </Link>

        <div className="flex items-center justify-end gap-3.5 text-inherit nav:gap-5">
          <a href="#" aria-label="Ara" className="inline-flex text-inherit">
            <SearchIcon />
          </a>
          <a
            href="#"
            aria-label="Beğeniler"
            className="nav:inline-flex hidden text-inherit"
          >
            <HeartIcon />
          </a>
          <a href="#" aria-label="Sepet" className="inline-flex text-inherit">
            <CartIcon />
          </a>
        </div>
      </nav>

      {menuOpen && (
        <div className="animate-fm-fade fixed inset-0 z-60 flex flex-col bg-ink p-[26px] text-paper">
          <div className="flex items-center justify-between">
            <Image
              src="/assets/formet-wordmark-white.png"
              alt="Formet"
              width={110}
              height={22}
              className="h-[22px] w-auto object-contain"
            />
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Kapat"
              className="flex h-[42px] w-[42px] items-center justify-center border-none bg-transparent text-inherit"
            >
              <CloseIcon />
            </button>
          </div>
          <div className="mt-11 flex flex-col gap-1.5">
            {mobileLinks.map((link, i) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`py-3 font-display text-[34px] font-semibold tracking-[-0.01em] text-inherit no-underline ${
                  i < mobileLinks.length - 1 || isHome
                    ? "border-b border-paper/14"
                    : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isHome && (
              <Link
                href="/#collection"
                onClick={() => setMenuOpen(false)}
                className="py-3 font-display text-[34px] font-semibold tracking-[-0.01em] text-inherit no-underline"
              >
                Koleksiyonlar
              </Link>
            )}
          </div>
          {isHome && (
            <div className="mt-auto text-[13px] leading-[1.7] text-paper/60">
              İstanbul · İzmir · Ankara
              <br />
              +90 212 555 0123
            </div>
          )}
        </div>
      )}
    </>
  );
}

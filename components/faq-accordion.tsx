"use client";

import { useState } from "react";
import type { faqs as faqsType } from "@/lib/products";

export function FaqAccordion({ items }: { items: typeof faqsType }) {
  const [open, setOpen] = useState<boolean[]>(() =>
    items.map((_, i) => i === 0),
  );

  return (
    <div className="flex flex-col gap-2">
      {items.map((f, i) => {
        const isOpen = open[i];
        return (
          <div
            key={f.q}
            className="overflow-hidden rounded-[16px] border border-ink/9 bg-card"
          >
            <button
              onClick={() =>
                setOpen((s) => s.map((v, idx) => (idx === i ? !v : v)))
              }
              className="flex w-full items-center justify-between gap-[18px] px-5 py-[19px] text-left font-sans sm:px-7 sm:py-6"
            >
              <span className="font-display text-[16px] font-semibold text-ink sm:text-[18px]">
                {f.q}
              </span>
              <span
                className="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-full bg-chip transition-transform duration-300"
                style={{ transform: isOpen ? "rotate(180deg)" : "none" }}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 9l6 6 6-6"></path>
                </svg>
              </span>
            </button>
            {isOpen && (
              <div className="px-5 pb-[22px] sm:px-7 sm:pb-[26px]">
                <p className="m-0 max-w-[720px] text-[15px] leading-[1.65] text-muted">
                  {f.a}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

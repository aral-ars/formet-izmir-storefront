export function PromoBar({ gap = false }: { gap?: boolean }) {
  return (
    <div
      className={`-mx-2 -mt-2 bg-ink px-4 py-[11px] text-center text-[11px] font-semibold tracking-[0.14em] text-paper uppercase ${gap ? "mb-2" : ""}`}
    >
      Yaz koleksiyonu · Türkiye&apos;nin her yerine ücretsiz teslimat
    </div>
  );
}

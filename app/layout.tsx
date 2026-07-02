import type { Metadata } from "next";
import { Archivo, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Formet — Dış Mekan Mobilyaları",
  description:
    "El işçiliği dış mekan mobilyaları. Toz boyalı alüminyum ve el örmesi halattan, dört mevsim dışarıda kalmak için üretilen bahçe ve teras mobilyaları.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${archivo.variable} ${hanken.variable}`}>
      <body className="min-h-full font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  );
}

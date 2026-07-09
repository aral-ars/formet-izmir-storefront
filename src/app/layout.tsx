import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "../components/Providers";
import { SiteSettingsProvider } from "../components/SiteSettingsProvider";
import { getSiteSettings } from "@/lib/catalog";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Formet Dış Mekan Mobilyaları",
  description: "Modern dış mekan mobilya mağazası",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const contact = await getSiteSettings();
  let isDraftMode = false;
  try {
    isDraftMode = (await draftMode()).isEnabled;
  } catch (e) {
    // Expected to throw in build-time static generation
  }

  return (
    <html lang="tr" className={cn("font-sans", geist.variable)}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&display=swap" rel="stylesheet" />
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,600,700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <SiteSettingsProvider value={contact}>
          <Providers>{children}</Providers>
        </SiteSettingsProvider>
        {isDraftMode && <VisualEditing />}
      </body>
    </html>
  );
}

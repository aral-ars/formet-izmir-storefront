import type { Metadata } from "next";
import "./globals.css";
import { PageTransitionProvider } from "../components/PageTransition";

export const metadata: Metadata = {
  title: "Formet Outdoor Furniture",
  description: "Modern outdoor furniture store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&display=swap" rel="stylesheet" />
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,600,700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <PageTransitionProvider>
          {children}
        </PageTransitionProvider>
      </body>
    </html>
  );
}

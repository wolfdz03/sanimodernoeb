import type { Metadata } from "next";
import { Geist, Geist_Mono, Cairo, Inter, Space_Grotesk } from "next/font/google";
import { Toaster } from "sonner";
import { CartProvider } from "@/context/CartContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { MarketingScripts } from "@/app/components/MarketingScripts";
import { ThemeStyles } from "@/app/components/ThemeStyles";
import { getSiteContent } from "@/lib/site-content";
import { getSiteSettings } from "@/lib/site-settings";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["latin", "arabic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteTitle = settings.site_title?.trim() || "Sani Modern OEB";
  return {
    title: `${siteTitle} | Salles de Bain Modernes`,
    description:
      "Solutions de salle de bain premium. Douches, baignoires, lavabos, toilettes et robinetterie. Qualité, innovation et service exceptionnel.",
    openGraph: {
      title: `${siteTitle} | Salles de Bain Modernes`,
      description: "Solutions de salle de bain premium. Douches, baignoires, lavabos, toilettes et robinetterie.",
      url: "https://sanimodernoeb.com",
      siteName: siteTitle,
      locale: "fr_DZ",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteTitle} | Salles de Bain Modernes`,
      description: "Solutions de salle de bain premium en Algérie.",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [contentOverrides, settings] = await Promise.all([
    getSiteContent(),
    getSiteSettings(),
  ]);
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cairo.variable} ${inter.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <ThemeStyles />
        <MarketingScripts
          tracking_enabled={settings.tracking_enabled}
          meta_pixel_id={settings.meta_pixel_id}
          ga4_measurement_id={settings.ga4_measurement_id}
          gtm_container_id={settings.gtm_container_id}
        />
        <LanguageProvider contentOverrides={contentOverrides}>
          <CartProvider>{children}</CartProvider>
        </LanguageProvider>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}

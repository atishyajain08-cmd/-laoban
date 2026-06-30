import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/layout/ClientProviders";
import PremiumLoader from "@/components/layout/PremiumLoader";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  metadataBase: new URL("https://atishyajain08-cmd.github.io/-laoban/"),
  title: {
    default: "Laoban — Premium Men's Fashion",
    template: "%s | Laoban",
  },
  description:
    "Discover premium men's fashion at Laoban. Shop tees, polos, outerwear, and refined essentials. Luxury meets everyday confidence for the modern Indian man.",
  keywords: [
    "men's fashion",
    "luxury clothing",
    "premium menswear",
    "Indian menswear",
    "Laoban",
  ],
  openGraph: {
    title: "Laoban — Premium Men's Fashion",
    description: "Premium menswear essentials for the modern Indian man.",
    url: "https://atishyajain08-cmd.github.io/-laoban/",
    siteName: "Laoban",
    images: ["/assets/brand/laoban-premium-logo.png"],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Laoban — Premium Men's Fashion",
    description: "Premium menswear essentials for the modern Indian man.",
    images: ["/assets/brand/laoban-premium-logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased bg-warm-white text-charcoal min-h-screen flex flex-col">
        <PremiumLoader />
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}

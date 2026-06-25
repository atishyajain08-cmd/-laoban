import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/layout/ClientProviders";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
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
  // TODO: Add Google Analytics, Search Console verification, OG images
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased bg-warm-white text-charcoal min-h-screen flex flex-col">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}

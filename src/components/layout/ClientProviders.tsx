"use client";
import { ReactNode } from "react";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <GoogleAnalytics />
      <CartProvider>
        <WishlistProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppButton />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

"use client";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import Hero from "@/components/home/Hero";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import BestSellers from "@/components/home/BestSellers";
import Testimonials from "@/components/home/Testimonials";
import InstagramGrid from "@/components/home/InstagramGrid";
import LeadCapture from "@/components/home/LeadCapture";
import LiveCatalog from "@/components/home/LiveCatalog";

const ThreeDSection = dynamic(() => import("@/components/home/ThreeDSection"), {
  ssr: false,
  loading: () => (
    <div className="py-28 bg-charcoal flex items-center justify-center">
      <div className="shimmer w-16 h-16 rounded-full" />
    </div>
  ),
});

export default function Home() {
  useEffect(() => {
    const { hash, search, pathname, origin } = window.location;
    const recoveryPayload =
      hash.includes("type=recovery") ||
      hash.includes("access_token=") ||
      search.includes("type=recovery") ||
      search.includes("code=");

    if (!recoveryPayload) return;

    const basePath = pathname.startsWith("/-laoban") ? "/-laoban" : "";
    window.location.replace(`${origin}${basePath}/reset-password.html${search}${hash}`);
  }, []);

  return (
    <>
      <Hero />
      <LiveCatalog compact />
      <FeaturedCollections />
      <LiveCatalog
        compact
        section="lookbook"
        eyebrow="Shop the Look"
        title="Buyable Lookbook"
        description="Looks uploaded to Laoban Admin under Lookbook appear here as shoppable products."
        tone="ivory"
      />
      <ThreeDSection />
      <BestSellers />
      <LeadCapture />
      <Testimonials />
      <InstagramGrid />
    </>
  );
}

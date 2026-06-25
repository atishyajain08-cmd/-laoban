"use client";
import dynamic from "next/dynamic";
import Hero from "@/components/home/Hero";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import NewArrivals from "@/components/home/NewArrivals";
import BestSellers from "@/components/home/BestSellers";
import Testimonials from "@/components/home/Testimonials";
import InstagramGrid from "@/components/home/InstagramGrid";
import LeadCapture from "@/components/home/LeadCapture";

const ThreeDSection = dynamic(() => import("@/components/home/ThreeDSection"), {
  ssr: false,
  loading: () => (
    <div className="py-28 bg-charcoal flex items-center justify-center">
      <div className="shimmer w-16 h-16 rounded-full" />
    </div>
  ),
});

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedCollections />
      <NewArrivals />
      <ThreeDSection />
      <BestSellers />
      <LeadCapture />
      <Testimonials />
      <InstagramGrid />
    </>
  );
}

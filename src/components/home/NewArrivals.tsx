"use client";
import LiveCatalog from "@/components/home/LiveCatalog";

export default function NewArrivals() {
  return (
    <LiveCatalog
      compact
      section="new-arrivals"
      eyebrow="Just Dropped"
      title="New Arrivals"
      description="Products uploaded under New Arrivals in Laoban Admin appear here automatically."
      tone="ivory"
      showEmpty
    />
  );
}

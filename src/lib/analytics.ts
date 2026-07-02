import { Product } from "@/data/products";

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

type GtagCommand = "config" | "event" | "js" | "set";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (command: GtagCommand, targetId: string | Date, config?: Record<string, unknown>) => void;
  }
}

function isAnalyticsEnabled() {
  return Boolean(GA_MEASUREMENT_ID) && typeof window !== "undefined" && typeof window.gtag === "function";
}

function itemFromProduct(product: Product, quantity = 1) {
  return {
    item_id: product.productCode || product.id,
    item_name: product.name,
    item_category: product.category,
    item_variant: product.subcategory,
    price: product.price,
    quantity,
  };
}

export function pageview(path: string) {
  if (!isAnalyticsEnabled()) return;
  window.gtag?.("config", GA_MEASUREMENT_ID, {
    page_path: path,
  });
}

export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (!isAnalyticsEnabled()) return;
  window.gtag?.("event", name, params);
}

export function trackSelectItem(product: Product) {
  trackEvent("select_item", {
    currency: "INR",
    value: product.price,
    items: [itemFromProduct(product)],
  });
}

export function trackViewItem(product: Product) {
  trackEvent("view_item", {
    currency: "INR",
    value: product.price,
    items: [itemFromProduct(product)],
  });
}

export function trackAddToCart(product: Product, quantity = 1, size?: string, color?: string) {
  trackEvent("add_to_cart", {
    currency: "INR",
    value: product.price * quantity,
    size,
    color,
    items: [itemFromProduct(product, quantity)],
  });
}

export function trackAddToWishlist(product: Product) {
  trackEvent("add_to_wishlist", {
    currency: "INR",
    value: product.price,
    items: [itemFromProduct(product)],
  });
}

export function trackBeginCheckout(total: number, itemCount: number) {
  trackEvent("begin_checkout", {
    currency: "INR",
    value: total,
    item_count: itemCount,
  });
}

export function trackPurchase(orderId: string, total: number, items: Product[]) {
  trackEvent("purchase", {
    transaction_id: orderId,
    currency: "INR",
    value: total,
    items: items.map((product) => itemFromProduct(product)),
  });
}

import { Product } from "@/data/products";

const SUPABASE_URL = "https://lzbdavmurwmrsbfhubtu.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_4YMXFJhyg-Gf37mrOweG7g_ISIRDiOF";

interface CatalogItem {
  id: string | number;
  product_code?: string;
  title?: string;
  description?: string;
  price?: number | string;
  product_type?: string;
  fit?: string;
  material?: string;
  colors?: { name: string; hex: string }[];
  badge?: "new" | "bestseller" | "sale";
  section?: string;
  label?: string;
  image_url?: string;
  is_active?: boolean;
}

function cleanDescription(description?: string) {
  return String(description || "")
    .replace(/\s*\[laoban_stock:S=\d+,M=\d+,L=\d+,XL=\d+\]\s*/g, "")
    .trim();
}

function inventoryFromDescription(description?: string) {
  const match = String(description || "").match(/\[laoban_stock:S=(\d+),M=(\d+),L=(\d+),XL=(\d+)\]/);
  return match
    ? { S: Number(match[1]), M: Number(match[2]), L: Number(match[3]), XL: Number(match[4]) }
    : null;
}

function usableImage(url?: string) {
  if (!url) return "/-laoban/assets/campaign/hero-black.png";
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/-laoban/")) return url;
  if (url.startsWith("/")) return `/-laoban${url}`;
  return `/-laoban/${url}`;
}

function itemToProduct(item: CatalogItem): Product {
  const inventory = inventoryFromDescription(item.description);
  const sizes = inventory
    ? (["S", "M", "L", "XL"] as const).filter((size) => Number(inventory[size]) > 0)
    : ["S", "M", "L", "XL"];

  return {
    id: `live-${item.id}`,
    productCode: item.product_code || `LBN-LIVE-${item.id}`,
    name: item.title || "Laoban Product",
    slug: "",
    price: Number(item.price || 0),
    description: cleanDescription(item.description) || "Premium Laoban menswear piece from the live catalog.",
    category: item.product_type?.toLowerCase() || item.section || "live catalog",
    subcategory: item.fit || item.label || "Laoban",
    images: [usableImage(item.image_url)],
    sizes: sizes.length ? sizes : ["S", "M", "L", "XL"],
    colors: Array.isArray(item.colors) && item.colors.length
      ? item.colors
      : [{ name: "Pure White", hex: "#FFFFFF" }],
    rating: 4.8,
    reviews: 0,
    badge: item.badge || "new",
    inStock: !inventory || Object.values(inventory).some((stock) => stock > 0),
    deliveryDays: 3,
    isLiveCatalog: true,
  };
}

export async function fetchLiveCatalogProducts(): Promise<Product[]> {
  const endpoint = `${SUPABASE_URL}/rest/v1/catalog_items?select=*&is_active=eq.true&order=sort_order.asc&order=created_at.desc`;
  const response = await fetch(endpoint, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error("Could not load live Laoban catalog.");
  }

  const data = (await response.json()) as CatalogItem[];
  return data.map(itemToProduct);
}

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
  thumbnail_url?: string;
  image_url?: string;
  pdf_url?: string;
  gallery_urls?: string[];
  is_active?: boolean;
}

function cleanDescription(description?: string) {
  return String(description || "")
    .replace(/\s*\[laoban_stock:S=\d+,M=\d+,L=\d+,XL=\d+(?:,XXL=\d+)?\]\s*/g, "")
    .replace(/\s*\[laoban_meta:[^\]]+\]\s*/g, "")
    .trim();
}

function metaFromDescription(description?: string) {
  const match = String(description || "").match(/\[laoban_meta:([^\]]+)\]/);
  if (!match) return {};
  try {
    return JSON.parse(decodeURIComponent(match[1])) as Partial<CatalogItem>;
  } catch {
    return {};
  }
}

function inventoryFromDescription(description?: string) {
  const match = String(description || "").match(/\[laoban_stock:S=(\d+),M=(\d+),L=(\d+),XL=(\d+)(?:,XXL=(\d+))?\]/);
  return match
    ? { S: Number(match[1]), M: Number(match[2]), L: Number(match[3]), XL: Number(match[4]), XXL: Number(match[5] || 0) }
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
  const meta = metaFromDescription(item.description);
  const inventory = inventoryFromDescription(item.description);
  const sizes = inventory
    ? (["S", "M", "L", "XL", "XXL"] as const).filter((size) => Number(inventory[size]) > 0)
    : ["S", "M", "L", "XL", "XXL"];

  const galleryImages = [
    item.thumbnail_url || meta.thumbnail_url,
    item.image_url || meta.image_url,
    ...(Array.isArray(item.gallery_urls) ? item.gallery_urls : []),
    ...(Array.isArray(meta.gallery_urls) ? meta.gallery_urls : []),
  ]
    .filter(Boolean)
    .map((url) => usableImage(url))
    .filter((url, index, all) => all.indexOf(url) === index);

  return {
    id: `live-${item.id}`,
    liveCatalogId: String(item.id),
    productCode: item.product_code || meta.product_code || `LBN-LIVE-${item.id}`,
    name: item.title || "Laoban Product",
    slug: "",
    price: Number(item.price || 0),
    description: cleanDescription(item.description) || "Premium Laoban menswear piece from the live catalog.",
    category: item.product_type?.toLowerCase() || meta.product_type?.toLowerCase() || item.section || "live catalog",
    subcategory: item.fit || meta.fit || item.label || "Laoban",
    images: galleryImages.length ? galleryImages : [usableImage(item.thumbnail_url || meta.thumbnail_url || item.image_url || meta.image_url)],
    sizes: sizes.length ? sizes : ["S", "M", "L", "XL", "XXL"],
    colors: Array.isArray(item.colors) && item.colors.length
      ? item.colors
      : Array.isArray(meta.colors) && meta.colors.length
      ? meta.colors
      : [{ name: "Pure White", hex: "#FFFFFF" }],
    rating: 4.8,
    reviews: 0,
    badge: item.badge || meta.badge || "new",
    inStock: !inventory || Object.values(inventory).some((stock) => stock > 0),
    deliveryDays: 3,
    isLiveCatalog: true,
    pdfUrl: item.pdf_url || meta.pdf_url,
    galleryImages,
  };
}

export async function fetchLiveCatalogProducts(section?: string): Promise<Product[]> {
  const sectionFilter = section ? `&section=eq.${encodeURIComponent(section)}` : "";
  const endpoint = `${SUPABASE_URL}/rest/v1/catalog_items?select=*&is_active=eq.true${sectionFilter}&order=sort_order.asc&order=created_at.desc`;
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

export async function fetchLiveCatalogProductById(id: string): Promise<Product | null> {
  const endpoint = `${SUPABASE_URL}/rest/v1/catalog_items?select=*&id=eq.${encodeURIComponent(id)}&limit=1`;
  const response = await fetch(endpoint, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error("Could not load this Laoban product.");
  }

  const data = (await response.json()) as CatalogItem[];
  return data[0] ? itemToProduct(data[0]) : null;
}

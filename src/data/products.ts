export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  subcategory: string;
  images: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  rating: number;
  reviews: number;
  badge?: "new" | "bestseller" | "sale";
  inStock: boolean;
  deliveryDays: number;
}

// Men's campaign shots (placeholders — swap for real per-product photos later).
const ASSET_BASE = "/-laoban/assets/campaign";
const A = `${ASSET_BASE}/hero-black.png`;
const B = `${ASSET_BASE}/ivory-tee.png`;
const C = `${ASSET_BASE}/forest-polo.png`;

const SIZES = ["S", "M", "L", "XL", "XXL"];
const BLACKS = [
  { name: "Jet Black", hex: "#0A0A0A" },
  { name: "Charcoal", hex: "#2D2D2D" },
];
const NEUTRALS = [
  { name: "Ivory", hex: "#F2EFE7" },
  { name: "Stone", hex: "#C9C4B8" },
];

export const products: Product[] = [
  { id: "1", name: "Noir Essential Crew Tee", slug: "noir-essential-crew-tee", price: 1299, originalPrice: 1999, description: "The quintessential black crew-neck tee in 100% premium Supima cotton. Ultra-soft hand-feel, a clean shoulder line, and a relaxed-but-sharp body. Pre-shrunk and colour-locked for a lasting deep black. The everyday foundation of a men's wardrobe.", category: "tops", subcategory: "tshirts", images: [A, B], sizes: SIZES, colors: BLACKS, rating: 4.8, reviews: 324, badge: "bestseller", inStock: true, deliveryDays: 2 },
  { id: "2", name: "Midnight V-Neck Tee", slug: "midnight-v-neck-tee", price: 1499, description: "A sleek V-neck in deep midnight black, cut from a buttery cotton-modal blend. Slim through the body with a slightly elongated hem for a modern silhouette.", category: "tops", subcategory: "tshirts", images: [B, A], sizes: SIZES, colors: BLACKS, rating: 4.9, reviews: 187, badge: "new", inStock: true, deliveryDays: 2 },
  { id: "3", name: "Shadow Oversized Tee", slug: "shadow-oversized-tee", price: 1799, originalPrice: 2499, description: "An oversized tee with dropped shoulders and a boxy silhouette. Heavyweight 240 GSM cotton for a premium, structured drape. Built for relaxed weekend layering.", category: "tops", subcategory: "tshirts", images: [A, C], sizes: SIZES, colors: BLACKS, rating: 4.6, reviews: 265, badge: "sale", inStock: true, deliveryDays: 3 },
  { id: "4", name: "Obsidian Boxy Tee", slug: "obsidian-boxy-tee", price: 1199, description: "A trend-forward boxy tee with a raw-cut hem and a clean straight body. Soft ringspun cotton with an easy drape. The effortless go-to for off-duty days.", category: "tops", subcategory: "tshirts", images: [C, A], sizes: SIZES, colors: BLACKS, rating: 4.7, reviews: 193, badge: "bestseller", inStock: true, deliveryDays: 2 },
  { id: "5", name: "Eclipse Tailored Tee", slug: "eclipse-tailored-tee", price: 1399, description: "A tailored black tee with a modern crew neck, cut from a cotton-elastane blend that moves with you. Refined seam detailing and a clean taper for a sharp line.", category: "tops", subcategory: "tshirts", images: [A, B], sizes: SIZES, colors: BLACKS, rating: 4.5, reviews: 156, badge: "new", inStock: true, deliveryDays: 2 },
  { id: "6", name: "Carbon Long Sleeve Tee", slug: "carbon-long-sleeve-tee", price: 1699, description: "A versatile long-sleeve tee in lightweight jersey cotton with a slightly relaxed fit. Perfect for layering or wearing solo in cooler weather.", category: "tops", subcategory: "tshirts", images: [B, C], sizes: SIZES, colors: BLACKS, rating: 4.8, reviews: 178, badge: "new", inStock: true, deliveryDays: 3 },
  { id: "7", name: "Velvet Touch Black Tee", slug: "velvet-touch-black-tee", price: 999, originalPrice: 1499, description: "An unbelievably soft velvet-finish black tee with a micro-suede hand-feel. Relaxed crew neck with reinforced shoulder seams. As luxurious as it looks.", category: "tops", subcategory: "tshirts", images: [A, C], sizes: SIZES, colors: BLACKS, rating: 4.4, reviews: 301, badge: "sale", inStock: true, deliveryDays: 2 },
  { id: "8", name: "Phantom Pocket Tee", slug: "phantom-pocket-tee", price: 1599, description: "A classic pocket tee elevated with premium organic cotton and a single chest-pocket detail. Midweight fabric with a lived-in softness from the first wear.", category: "tops", subcategory: "tshirts", images: [B, A], sizes: SIZES, colors: BLACKS, rating: 4.9, reviews: 145, inStock: true, deliveryDays: 3 },
  { id: "9", name: "Raven Muscle Tee", slug: "raven-muscle-tee", price: 1099, description: "A bold muscle tee with elongated armholes and a straight hem. Breathable cotton for all-day comfort. A statement layering piece or standalone summer essential.", category: "tops", subcategory: "tshirts", images: [C, B], sizes: SIZES, colors: BLACKS, rating: 4.6, reviews: 132, inStock: true, deliveryDays: 2 },
  { id: "10", name: "Ivory Heavyweight Tee", slug: "ivory-heavyweight-tee", price: 1690, description: "A clean ivory tee in dense 220 GSM combed cotton. Holds its line through the shoulder and body. The neutral counterpoint to every black in the rotation.", category: "tops", subcategory: "tshirts", images: [B, A], sizes: SIZES, colors: NEUTRALS, rating: 4.7, reviews: 121, badge: "new", inStock: true, deliveryDays: 2 },
  { id: "11", name: "Onyx Henley Tee", slug: "onyx-henley-tee", price: 1890, description: "A three-button henley in soft slub cotton with a refined placket. Quietly elevated — works on its own or under an overshirt.", category: "tops", subcategory: "tshirts", images: [A, C], sizes: SIZES, colors: BLACKS, rating: 4.8, reviews: 98, badge: "bestseller", inStock: true, deliveryDays: 3 },
  { id: "12", name: "Slate Crew Tee", slug: "slate-crew-tee", price: 1290, originalPrice: 1690, description: "A mid-weight crew tee in a muted slate tone. Compact cotton with a regular fit refined for Indian frames. An easy everyday staple.", category: "tops", subcategory: "tshirts", images: [C, A], sizes: SIZES, colors: NEUTRALS, rating: 4.5, reviews: 110, badge: "sale", inStock: true, deliveryDays: 2 },
];

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
export function getNewArrivals(): Product[] {
  return products.filter((p) => p.badge === "new");
}
export function getBestSellers(): Product[] {
  return products.filter((p) => p.badge === "bestseller");
}
export function getSaleProducts(): Product[] {
  return products.filter((p) => p.badge === "sale");
}

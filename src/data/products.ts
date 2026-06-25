export interface Product {
  id: string;
  productCode: string;
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
  isLiveCatalog?: boolean;
}

const WHITE_TEE = "/-laoban/assets/products/basic-white-tee.svg";
const SIZES = ["S", "M", "L", "XL", "XXL"];
const WHITE_COLORS = [
  { name: "Pure White", hex: "#FFFFFF" },
  { name: "Soft White", hex: "#F7F3EA" },
];

export const products: Product[] = [
  {
    id: "1",
    productCode: "LBN-WT-001",
    name: "Laoban Classic White Crew Tee",
    slug: "laoban-classic-white-crew-tee",
    price: 999,
    originalPrice: 1299,
    description: "Plain basic white men’s crew-neck T-shirt in soft breathable cotton. Clean fit, everyday comfort, and a premium minimal look for Indian weather.",
    category: "t-shirts",
    subcategory: "white basics",
    images: [WHITE_TEE],
    sizes: SIZES,
    colors: WHITE_COLORS,
    rating: 4.8,
    reviews: 124,
    badge: "bestseller",
    inStock: true,
    deliveryDays: 2,
  },
  {
    id: "2",
    productCode: "LBN-WT-002",
    name: "Laoban Regular Fit White Tee",
    slug: "laoban-regular-fit-white-tee",
    price: 1099,
    description: "A simple regular-fit white T-shirt with a smooth hand-feel and reinforced neckline. Made as a dependable daily essential.",
    category: "t-shirts",
    subcategory: "white basics",
    images: [WHITE_TEE],
    sizes: SIZES,
    colors: WHITE_COLORS,
    rating: 4.7,
    reviews: 86,
    badge: "new",
    inStock: true,
    deliveryDays: 2,
  },
  {
    id: "3",
    productCode: "LBN-WT-003",
    name: "Laoban Oversized White Tee",
    slug: "laoban-oversized-white-tee",
    price: 1199,
    originalPrice: 1499,
    description: "Plain white oversized T-shirt with dropped shoulders and a relaxed streetwear silhouette. Minimal, clean, and easy to style.",
    category: "t-shirts",
    subcategory: "white basics",
    images: [WHITE_TEE],
    sizes: SIZES,
    colors: WHITE_COLORS,
    rating: 4.6,
    reviews: 101,
    badge: "sale",
    inStock: true,
    deliveryDays: 3,
  },
  {
    id: "4",
    productCode: "LBN-WT-004",
    name: "Laoban Premium Heavyweight White Tee",
    slug: "laoban-premium-heavyweight-white-tee",
    price: 1399,
    description: "Structured heavyweight white T-shirt with a clean fall and elevated neckline. Built for a premium minimal menswear wardrobe.",
    category: "t-shirts",
    subcategory: "white basics",
    images: [WHITE_TEE],
    sizes: SIZES,
    colors: WHITE_COLORS,
    rating: 4.9,
    reviews: 72,
    badge: "new",
    inStock: true,
    deliveryDays: 3,
  },
  {
    id: "5",
    productCode: "LBN-WT-005",
    name: "Laoban Slim Fit White Tee",
    slug: "laoban-slim-fit-white-tee",
    price: 999,
    description: "Plain white slim-fit T-shirt with a sharper chest and shoulder line. Designed for a polished, clean everyday outfit.",
    category: "t-shirts",
    subcategory: "white basics",
    images: [WHITE_TEE],
    sizes: SIZES,
    colors: WHITE_COLORS,
    rating: 4.5,
    reviews: 64,
    inStock: true,
    deliveryDays: 2,
  },
  {
    id: "6",
    productCode: "LBN-WT-006",
    name: "Laoban Longline White Tee",
    slug: "laoban-longline-white-tee",
    price: 1199,
    description: "Minimal longline white T-shirt with a slightly extended hem. Clean enough for basics, refined enough for layered outfits.",
    category: "t-shirts",
    subcategory: "white basics",
    images: [WHITE_TEE],
    sizes: SIZES,
    colors: WHITE_COLORS,
    rating: 4.7,
    reviews: 58,
    inStock: true,
    deliveryDays: 2,
  },
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

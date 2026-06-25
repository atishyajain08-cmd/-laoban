export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
}

const ASSET_BASE = "/-laoban/assets/campaign";

export const categories: Category[] = [
  {
    id: "1",
    name: "Crew Neck",
    slug: "tops",
    image: `${ASSET_BASE}/hero-black.png`,
    description: "Classic crew-neck tees in every fit",
    subcategories: [
      { id: "1a", name: "Essential Fit", slug: "tshirts" },
      { id: "1b", name: "Relaxed Fit", slug: "tshirts" },
      { id: "1c", name: "Slim Fit", slug: "tshirts" },
    ],
  },
  {
    id: "2",
    name: "V-Neck",
    slug: "tops",
    image: `${ASSET_BASE}/ivory-tee.png`,
    description: "Sleek V-neck silhouettes for a modern look",
    subcategories: [
      { id: "2a", name: "Deep V", slug: "tshirts" },
      { id: "2b", name: "Classic V", slug: "tshirts" },
    ],
  },
  {
    id: "3",
    name: "Oversized",
    slug: "tops",
    image: `${ASSET_BASE}/forest-polo.png`,
    description: "Oversized & boxy fits for relaxed styling",
    subcategories: [
      { id: "3a", name: "Drop Shoulder", slug: "tshirts" },
      { id: "3b", name: "Boxy Fit", slug: "tshirts" },
      { id: "3c", name: "Longline", slug: "tshirts" },
    ],
  },
  {
    id: "4",
    name: "Henley & Muscle",
    slug: "tops",
    image: `${ASSET_BASE}/hero-black.png`,
    description: "Henleys and muscle tees with a sharper line",
    subcategories: [
      { id: "4a", name: "Henley", slug: "tshirts" },
      { id: "4b", name: "Muscle Tee", slug: "tshirts" },
      { id: "4c", name: "Pocket Tee", slug: "tshirts" },
    ],
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

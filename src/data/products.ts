import { asset } from '../utils/asset';

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  colors: string[];
  sizes: string[];
  images: string[];
  featured: boolean;
  new: boolean;
  tags: string[];
}

const rawProducts: Product[] = [
  {
    id: 'tee-classic-crew',
    name: 'Classic Crew Neck Tee',
    slug: 'classic-crew-neck-tee',
    price: 1299,
    description: 'The foundation of every boss\'s wardrobe. Cut from premium 180 GSM cotton with a relaxed fit that drapes just right. Double-stitched collar that holds its shape wash after wash.',
    category: 'T-Shirts',
    colors: ['White'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: ['/assets/products/classic-crew-1.jpg', '/assets/products/classic-crew-2.jpg'],
    featured: true,
    new: false,
    tags: ['essentials', 'crew-neck'],
  },
  {
    id: 'tee-premium-vneck',
    name: 'Premium V-Neck Tee',
    slug: 'premium-v-neck-tee',
    price: 1499,
    description: 'A refined V-neck silhouette in buttery-soft Supima cotton. The slightly deeper neckline adds an edge to smart-casual layering. Tailored slim fit.',
    category: 'T-Shirts',
    colors: ['White'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: ['/assets/products/premium-vneck-1.jpg', '/assets/products/premium-vneck-2.jpg'],
    featured: true,
    new: true,
    tags: ['premium', 'v-neck'],
  },
  {
    id: 'tee-oversized',
    name: 'Oversized Drop-Shoulder Tee',
    slug: 'oversized-drop-shoulder-tee',
    price: 1699,
    description: 'Deliberately loose. Intentionally confident. Our oversized tee features dropped shoulders, a boxy cut, and heavyweight 220 GSM fabric that gives it that premium drape.',
    category: 'T-Shirts',
    colors: ['White'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: ['/assets/products/oversized-1.jpg', '/assets/products/oversized-2.jpg'],
    featured: true,
    new: true,
    tags: ['streetwear', 'oversized'],
  },
  {
    id: 'tee-henley',
    name: 'Henley Tee',
    slug: 'henley-tee',
    price: 1799,
    description: 'Three-button henley in a textured cotton-linen blend. The subtle slub texture and relaxed collar give it an effortlessly polished look. Perfect undone.',
    category: 'T-Shirts',
    colors: ['White'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: ['/assets/products/henley-1.jpg', '/assets/products/henley-2.jpg'],
    featured: false,
    new: false,
    tags: ['smart-casual', 'henley'],
  },
  {
    id: 'tee-polo',
    name: 'Boss Polo',
    slug: 'boss-polo',
    price: 2199,
    description: 'Our signature polo — piqué cotton with a structured collar that stays crisp. Subtle Laoban eagle embroidery at the chest. The polo that means business.',
    category: 'T-Shirts',
    colors: ['White'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: ['/assets/products/polo-1.jpg', '/assets/products/polo-2.jpg'],
    featured: true,
    new: false,
    tags: ['polo', 'signature'],
  },
  {
    id: 'tee-longline',
    name: 'Longline Curved Hem Tee',
    slug: 'longline-curved-hem-tee',
    price: 1599,
    description: 'Extended length with a gently curved hem for a modern silhouette. Lightweight 160 GSM cotton keeps it breathable for all-day wear. Layer it or let it stand alone.',
    category: 'T-Shirts',
    colors: ['White'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: ['/assets/products/longline-1.jpg', '/assets/products/longline-2.jpg'],
    featured: false,
    new: true,
    tags: ['streetwear', 'longline'],
  },
  {
    id: 'tee-fullsleeve',
    name: 'Full Sleeve Essential Tee',
    slug: 'full-sleeve-essential-tee',
    price: 1899,
    description: 'The long-sleeve counterpart to our classic crew. Same premium cotton, same impeccable fit, with ribbed cuffs that sit clean at the wrist. Transition-season essential.',
    category: 'T-Shirts',
    colors: ['White'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: ['/assets/products/fullsleeve-1.jpg', '/assets/products/fullsleeve-2.jpg'],
    featured: false,
    new: false,
    tags: ['essentials', 'long-sleeve'],
  },
  {
    id: 'tee-muscle-fit',
    name: 'Muscle Fit Tee',
    slug: 'muscle-fit-tee',
    price: 1499,
    description: 'Engineered for an athletic build. Tapered through the torso with slightly shorter sleeves that sit right on the bicep. Stretch-cotton blend moves with you.',
    category: 'T-Shirts',
    colors: ['White'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: ['/assets/products/muscle-fit-1.jpg', '/assets/products/muscle-fit-2.jpg'],
    featured: true,
    new: false,
    tags: ['athletic', 'muscle-fit'],
  },
  {
    id: 'tee-pocket',
    name: 'Pocket Detail Tee',
    slug: 'pocket-detail-tee',
    price: 1399,
    description: 'A minimal chest pocket adds just enough detail to elevate the everyday tee. Medium weight cotton with a regular fit that works on every frame.',
    category: 'T-Shirts',
    colors: ['White'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: ['/assets/products/pocket-1.jpg', '/assets/products/pocket-2.jpg'],
    featured: false,
    new: false,
    tags: ['essentials', 'pocket'],
  },
  {
    id: 'tee-raglan',
    name: 'Raglan Sleeve Tee',
    slug: 'raglan-sleeve-tee',
    price: 1599,
    description: 'Raglan sleeves for unrestricted movement and a sportier silhouette. Clean tonal stitching on premium combed cotton. Equally at home on the pitch or at brunch.',
    category: 'T-Shirts',
    colors: ['White'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: ['/assets/products/raglan-1.jpg', '/assets/products/raglan-2.jpg'],
    featured: false,
    new: true,
    tags: ['sportswear', 'raglan'],
  },
];

// Resolve every public image path against the deploy base (dev "/" vs prod "/laoban/").
export const products: Product[] = rawProducts.map((p) => ({
  ...p,
  images: p.images.map(asset),
}));

export const categories = ['T-Shirts'] as const;

export const sizes = ['S', 'M', 'L', 'XL', 'XXL'] as const;

export const priceRanges = [
  { label: 'Under ₹1,500', min: 0, max: 1500 },
  { label: '₹1,500 – ₹2,000', min: 1500, max: 2000 },
  { label: 'Above ₹2,000', min: 2000, max: Infinity },
] as const;

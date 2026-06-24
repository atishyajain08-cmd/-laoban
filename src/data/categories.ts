import { asset } from '../utils/asset';

export interface SubCategory {
  name: string;
  slug: string;
}

export interface Category {
  name: string;
  slug: string;
  image: string;
  blurb: string;
  subcategories: SubCategory[];
}

const img = {
  black: asset('/assets/campaign/hero-black.png'),
  ivory: asset('/assets/campaign/ivory-tee.png'),
  forest: asset('/assets/campaign/forest-polo.png'),
};

// Top-level menswear taxonomy. `name` doubles as the value stored on a product's
// `category`, and a subcategory `name` matches a product's `subcategory`.
export const categories: Category[] = [
  {
    name: 'T-Shirts',
    slug: 'T-Shirts',
    image: img.black,
    blurb: 'The daily foundation',
    subcategories: [
      { name: 'Crew Neck', slug: 'Crew Neck' },
      { name: 'V-Neck', slug: 'V-Neck' },
      { name: 'Oversized', slug: 'Oversized' },
      { name: 'Henley', slug: 'Henley' },
    ],
  },
  {
    name: 'Polos',
    slug: 'Polos',
    image: img.forest,
    blurb: 'Polish without the stiffness',
    subcategories: [
      { name: 'Classic', slug: 'Classic' },
      { name: 'Knitted', slug: 'Knitted' },
    ],
  },
  {
    name: 'Shirts',
    slug: 'Shirts',
    image: img.ivory,
    blurb: 'From desk to dinner',
    subcategories: [
      { name: 'Casual', slug: 'Casual' },
      { name: 'Resort', slug: 'Resort' },
    ],
  },
  {
    name: 'Trousers',
    slug: 'Trousers',
    image: img.black,
    blurb: 'A sharper line',
    subcategories: [
      { name: 'Trousers', slug: 'Trousers' },
      { name: 'Joggers', slug: 'Joggers' },
    ],
  },
];

export const categoryNames: string[] = ['All', ...categories.map((c) => c.name)];

export function getCategory(name: string): Category | undefined {
  return categories.find((c) => c.name === name);
}

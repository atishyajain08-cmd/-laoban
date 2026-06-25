export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  category: string;
  readTime: number;
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "The Art of Capsule Wardrobes: 20 Pieces, Endless Looks",
    slug: "capsule-wardrobe-guide",
    excerpt: "Discover how to build a versatile capsule wardrobe with just 20 carefully curated pieces that work together seamlessly.",
    content: "A capsule wardrobe is the ultimate expression of intentional fashion. By investing in quality over quantity, you create a collection of pieces that mix and match effortlessly...",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800",
    author: "Laoban Style Team",
    date: "2024-12-18",
    category: "Style Guide",
    readTime: 5,
  },
  {
    id: "2",
    title: "Winter 2025: The Trends Defining This Season",
    slug: "winter-2025-trends",
    excerpt: "From rich velvets to structured silhouettes, explore the trends shaping winter fashion this year.",
    content: "This winter season brings a delicious mix of textures and silhouettes. Velvet makes a powerful comeback, while structured blazers continue to dominate...",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800",
    author: "Laoban Style Team",
    date: "2024-12-10",
    category: "Trends",
    readTime: 4,
  },
  {
    id: "3",
    title: "How to Style a Blazer: 8 Ways From Boardroom to Bar",
    slug: "how-to-style-blazer",
    excerpt: "The blazer is the most versatile piece in your wardrobe. Here are 8 ways to wear it for every occasion.",
    content: "The modern blazer has transcended its corporate origins. Today, it's the ultimate chameleon piece that works just as well with jeans and sneakers as it does with tailored trousers...",
    image: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800",
    author: "Laoban Style Team",
    date: "2024-12-05",
    category: "Style Guide",
    readTime: 6,
  },
  {
    id: "4",
    title: "Sustainable Fashion: Making Conscious Choices",
    slug: "sustainable-fashion-choices",
    excerpt: "How small changes in your fashion habits can make a big impact on the planet.",
    content: "Sustainability in fashion isn't about perfection — it's about making better choices, one purchase at a time. At Laoban, we believe luxury and responsibility go hand in hand...",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800",
    author: "Laoban Style Team",
    date: "2024-11-28",
    category: "Sustainability",
    readTime: 5,
  },
];

export function getBlogBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

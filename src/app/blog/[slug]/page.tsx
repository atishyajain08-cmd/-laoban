import { blogPosts } from "@/data/blog";
import BlogDetailClient from "./BlogDetailClient";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export default function Page() {
  return <BlogDetailClient />;
}

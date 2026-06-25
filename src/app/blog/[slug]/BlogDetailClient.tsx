"use client";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getBlogBySlug, blogPosts } from "@/data/blog";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const post = getBlogBySlug(slug as string);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-3xl mb-4">Post Not Found</h1>
          <Link href="/blog" className="text-gold hover:underline">Back to Blog</Link>
        </div>
      </div>
    );
  }

  const otherPosts = blogPosts.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-warm-white">
      {/* Hero */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <Image src={post.image} alt={post.title} fill className="object-cover" />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-20 relative z-10 pb-20">
        <AnimatedSection>
          <div className="bg-white p-8 md:p-12 border border-ivory-dark">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-warm-gray hover:text-gold mb-6">
              <ArrowLeft size={16} /> Back to Blog
            </Link>
            <p className="text-gold text-xs tracking-[0.2em] uppercase mb-3">{post.category}</p>
            <h1 className="font-display text-3xl md:text-4xl text-charcoal mb-4">{post.title}</h1>
            <div className="flex items-center gap-4 text-xs text-warm-gray mb-8 pb-8 border-b border-ivory-dark">
              <span>{post.author}</span>
              <span>•</span>
              <span>{new Date(post.date).toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" })}</span>
              <span>•</span>
              <span>{post.readTime} min read</span>
            </div>
            <div className="prose prose-sm max-w-none text-warm-gray leading-relaxed space-y-4">
              <p>{post.excerpt}</p>
              <p>{post.content}</p>
              <p>
                Fashion is an ever-evolving art form, and staying ahead of the curve means understanding
                both the classics and the contemporary. At Laoban, we believe in curating pieces that
                transcend seasons while embracing the spirit of the moment.
              </p>
              <p>
                Whether you&apos;re building a wardrobe from scratch or adding statement pieces to your
                existing collection, the key is to invest in quality, choose versatile pieces, and always
                build for the life you want to live.
              </p>
            </div>
          </div>
        </AnimatedSection>

        {/* Related Posts */}
        {otherPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl text-charcoal mb-8 text-center">More from the Journal</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {otherPosts.map((p) => (
                <Link key={p.id} href={`/blog/${p.slug}`} className="group">
                  <div className="relative aspect-[4/3] overflow-hidden mb-3">
                    <Image src={p.image} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <h3 className="text-sm font-medium text-charcoal group-hover:text-gold transition-colors line-clamp-2">{p.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

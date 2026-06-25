"use client";
import Image from "next/image";
import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { blogPosts } from "@/data/blog";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-warm-white">
      <div className="bg-charcoal text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <AnimatedSection>
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">Style & Stories</p>
            <h1 className="font-display text-4xl md:text-6xl">The Laoban Journal</h1>
          </AnimatedSection>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        {/* Featured Post */}
        <AnimatedSection className="mb-16">
          <Link href={`/blog/${blogPosts[0].slug}`} className="group block">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={blogPosts[0].image}
                  alt={blogPosts[0].title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute top-4 left-4 bg-gold text-white px-3 py-1 text-[10px] tracking-[0.15em] uppercase">
                  Featured
                </span>
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-gold text-xs tracking-[0.2em] uppercase mb-2">{blogPosts[0].category}</p>
                <h2 className="font-display text-2xl md:text-3xl text-charcoal mb-4 group-hover:text-gold transition-colors">
                  {blogPosts[0].title}
                </h2>
                <p className="text-warm-gray text-sm leading-relaxed mb-4">{blogPosts[0].excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-warm-gray">
                  <span>{blogPosts[0].author}</span>
                  <span>•</span>
                  <span>{blogPosts[0].readTime} min read</span>
                  <span>•</span>
                  <span>{new Date(blogPosts[0].date).toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" })}</span>
                </div>
              </div>
            </div>
          </Link>
        </AnimatedSection>

        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {blogPosts.slice(1).map((post, i) => (
            <AnimatedSection key={post.id} delay={i * 0.1}>
              <Link href={`/blog/${post.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden mb-4">
                  <Image src={post.image} alt={post.title} fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
                <p className="text-gold text-[10px] tracking-[0.2em] uppercase mb-2">{post.category}</p>
                <h3 className="font-display text-lg text-charcoal mb-2 group-hover:text-gold transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-warm-gray text-sm line-clamp-2 mb-3">{post.excerpt}</p>
                <div className="flex items-center gap-3 text-[11px] text-warm-gray">
                  <span>{post.readTime} min read</span>
                  <span>•</span>
                  <span>{new Date(post.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</span>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  );
}

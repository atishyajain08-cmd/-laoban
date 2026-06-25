"use client";
import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-warm-white">
      {/* Hero */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920"
          alt="About Laoban"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <AnimatedSection className="text-center">
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">Our Story</p>
            <h1 className="font-display text-4xl md:text-6xl text-white">About Laoban</h1>
          </AnimatedSection>
        </div>
      </div>

      {/* Story */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
        <AnimatedSection className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-6">
            Where Luxury Meets <span className="text-gradient-gold italic">Confidence</span>
          </h2>
          <p className="text-warm-gray leading-relaxed max-w-2xl mx-auto">
            Born from a passion for empowering men through fashion, Laoban is more than a clothing brand
            — it&apos;s a movement. We believe that every man deserves to feel composed in what he wears,
            whether it&apos;s a boardroom layer or a weekend essential.
          </p>
        </AnimatedSection>

        {/* Values */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {[
            {
              title: "Premium Quality",
              desc: "Every piece is crafted from carefully selected fabrics, ensuring durability and comfort without compromising on style.",
            },
            {
              title: "Timeless Design",
              desc: "Our designs blend contemporary trends with classic elegance, creating pieces that remain stylish season after season.",
            },
            {
              title: "Ethical Fashion",
              desc: "We are committed to responsible manufacturing practices, fair wages, and reducing our environmental footprint.",
            },
          ].map((value, i) => (
            <AnimatedSection key={value.title} delay={i * 0.15}>
              <div className="text-center p-8 border border-ivory-dark hover:border-gold transition-colors">
                <div className="w-12 h-12 bg-gold/10 flex items-center justify-center mx-auto mb-4">
                  <span className="font-display text-gold text-xl">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="font-display text-lg text-charcoal mb-3">{value.title}</h3>
                <p className="text-warm-gray text-sm leading-relaxed">{value.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Mission */}
        <AnimatedSection>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800"
                alt="Laoban Mission"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">Our Mission</p>
              <h2 className="font-display text-2xl md:text-3xl text-charcoal mb-6">
                Fashion That Empowers
              </h2>
              <div className="space-y-4 text-warm-gray text-sm leading-relaxed">
                <p>
                  At Laoban, our mission is to create premium, accessible fashion that celebrates
                  individuality and confidence. We design for the man who knows his worth and styles himself
                  to reflect it.
                </p>
                <p>
                  From the sketch pad to the final stitch, every Laoban piece goes through rigorous
                  quality checks. We partner with skilled artisans who share our vision of excellence
                  and attention to detail.
                </p>
                <p>
                  Our vision is to become the most trusted name in men&apos;s premium fashion, known not
                  just for our beautiful designs but for the confidence our customers feel wearing them.
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}

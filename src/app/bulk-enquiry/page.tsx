"use client";
import { useState } from "react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { categories } from "@/data/categories";

export default function BulkEnquiryPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-warm-white">
      <div className="bg-charcoal text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <AnimatedSection>
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">For Business</p>
            <h1 className="font-display text-4xl md:text-6xl">Bulk Orders</h1>
            <p className="text-white/60 text-sm mt-4 max-w-lg mx-auto">
              Need large quantities? We offer special pricing for bulk orders. Fill out the form below and our team will get back to you.
            </p>
          </AnimatedSection>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
        {submitted ? (
          <AnimatedSection className="bg-gold/10 border border-gold/20 p-8 text-center">
            <h3 className="font-display text-xl text-charcoal mb-2">Enquiry Received!</h3>
            <p className="text-warm-gray text-sm">Our team will contact you within 24 hours with pricing and availability.</p>
          </AnimatedSection>
        ) : (
          <AnimatedSection>
            {/* TODO: Connect to backend API and admin enquiry management */}
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs tracking-[0.1em] uppercase font-medium mb-2">Full Name *</label>
                  <input type="text" required className="w-full px-4 py-3 border border-ivory-dark focus:outline-none focus:border-gold text-sm" />
                </div>
                <div>
                  <label className="block text-xs tracking-[0.1em] uppercase font-medium mb-2">Phone *</label>
                  <input type="tel" required className="w-full px-4 py-3 border border-ivory-dark focus:outline-none focus:border-gold text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs tracking-[0.1em] uppercase font-medium mb-2">Email *</label>
                <input type="email" required className="w-full px-4 py-3 border border-ivory-dark focus:outline-none focus:border-gold text-sm" />
              </div>
              <div>
                <label className="block text-xs tracking-[0.1em] uppercase font-medium mb-2">Product Interest *</label>
                <select required className="w-full px-4 py-3 border border-ivory-dark focus:outline-none focus:border-gold text-sm bg-white">
                  <option value="">Select a category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                  <option value="custom">Custom / Mixed</option>
                </select>
              </div>
              <div>
                <label className="block text-xs tracking-[0.1em] uppercase font-medium mb-2">Quantity (approx.) *</label>
                <input type="number" min={10} required className="w-full px-4 py-3 border border-ivory-dark focus:outline-none focus:border-gold text-sm"
                  placeholder="Minimum 10 pieces" />
              </div>
              <div>
                <label className="block text-xs tracking-[0.1em] uppercase font-medium mb-2">Message</label>
                <textarea rows={4} className="w-full px-4 py-3 border border-ivory-dark focus:outline-none focus:border-gold text-sm resize-none"
                  placeholder="Tell us about your requirements, desired styles, customization needs, etc." />
              </div>
              <button type="submit"
                className="w-full py-3 bg-charcoal text-white text-sm tracking-[0.15em] uppercase hover:bg-gold transition-colors">
                Submit Enquiry
              </button>
            </form>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}

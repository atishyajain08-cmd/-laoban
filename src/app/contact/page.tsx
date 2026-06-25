"use client";
import { useState } from "react";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-warm-white">
      <div className="bg-charcoal text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <AnimatedSection>
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">Get in Touch</p>
            <h1 className="font-display text-4xl md:text-6xl">Contact Us</h1>
          </AnimatedSection>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Form */}
          <AnimatedSection>
            {submitted ? (
              <div className="bg-gold/10 border border-gold/20 p-8 text-center">
                <h3 className="font-display text-xl text-charcoal mb-2">Thank You!</h3>
                <p className="text-warm-gray text-sm">We&apos;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs tracking-[0.1em] uppercase font-medium mb-2">Name</label>
                    <input type="text" required className="w-full px-4 py-3 border border-ivory-dark focus:outline-none focus:border-gold text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs tracking-[0.1em] uppercase font-medium mb-2">Phone</label>
                    <input type="tel" className="w-full px-4 py-3 border border-ivory-dark focus:outline-none focus:border-gold text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs tracking-[0.1em] uppercase font-medium mb-2">Email</label>
                  <input type="email" required className="w-full px-4 py-3 border border-ivory-dark focus:outline-none focus:border-gold text-sm" />
                </div>
                <div>
                  <label className="block text-xs tracking-[0.1em] uppercase font-medium mb-2">Subject</label>
                  <input type="text" required className="w-full px-4 py-3 border border-ivory-dark focus:outline-none focus:border-gold text-sm" />
                </div>
                <div>
                  <label className="block text-xs tracking-[0.1em] uppercase font-medium mb-2">Message</label>
                  <textarea rows={5} required className="w-full px-4 py-3 border border-ivory-dark focus:outline-none focus:border-gold text-sm resize-none" />
                </div>
                <button type="submit" className="w-full py-3 bg-charcoal text-white text-sm tracking-[0.15em] uppercase hover:bg-gold transition-colors">
                  Send Message
                </button>
              </form>
            )}
          </AnimatedSection>

          {/* Info */}
          <AnimatedSection direction="right">
            <div className="space-y-8">
              {[
                { icon: MapPin, title: "Visit Us", lines: ["123 Fashion Street, Bandra West", "Mumbai, Maharashtra 400050"] },
                { icon: Phone, title: "Call Us", lines: ["+91 99999 99999", "Mon - Sat, 10am - 7pm"] },
                { icon: Mail, title: "Email Us", lines: ["hello@laoban.com", "support@laoban.com"] },
                { icon: MessageCircle, title: "WhatsApp", lines: ["+91 99999 99999", "Quick responses guaranteed"] },
              ].map(({ icon: Icon, title, lines }) => (
                <div key={title} className="flex gap-4">
                  <div className="w-12 h-12 bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-gold" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-charcoal mb-1">{title}</h3>
                    {lines.map((line) => (
                      <p key={line} className="text-sm text-warm-gray">{line}</p>
                    ))}
                  </div>
                </div>
              ))}

              {/* Map Placeholder */}
              <div className="bg-ivory border border-ivory-dark h-64 flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={32} className="text-gold mx-auto mb-2" />
                  <p className="text-sm text-warm-gray">Google Map Placeholder</p>
                  <p className="text-[10px] text-warm-gray mt-1">
                    {/* TODO: Embed Google Maps iframe here */}
                    Embed your Google Maps here
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}

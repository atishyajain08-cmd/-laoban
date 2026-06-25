"use client";
import Link from "next/link";
import { Camera, Globe, Play, MessageSquare } from "lucide-react";

const footerLinks = {
  Shop: [
    { label: "Crew Tees", href: "/shop?category=tops" },
    { label: "V-Necks", href: "/shop?category=tops" },
    { label: "Oversized", href: "/shop?category=tops" },
    { label: "Outerwear", href: "/shop?category=outerwear" },
    { label: "New Arrivals", href: "/shop?filter=new" },
    { label: "Sale", href: "/shop?filter=sale" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
    { label: "Bulk Orders", href: "/bulk-enquiry" },
    { label: "Testimonials", href: "/testimonials" },
  ],
  Support: [
    { label: "Shipping Policy", href: "/contact" },
    { label: "Return Policy", href: "/contact" },
    { label: "Privacy Policy", href: "/contact" },
    { label: "Terms of Service", href: "/contact" },
    { label: "FAQ", href: "/contact" },
  ],
};

const socialLinks = [
  { icon: Camera, href: "https://instagram.com", label: "Instagram" },
  { icon: Globe, href: "https://facebook.com", label: "Facebook" },
  { icon: Play, href: "https://youtube.com", label: "YouTube" },
  { icon: MessageSquare, href: "https://x.com", label: "X (Twitter)" },
];

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="font-display text-2xl md:text-3xl mb-3">
              Join the <span className="text-gold">Laoban</span> Club
            </h3>
            <p className="text-white/60 text-sm mb-6">
              Be the first to know about new collections, exclusive offers, and style tips.
            </p>
            <form className="flex gap-0" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-gold text-sm"
              />
              <button className="px-6 py-3 bg-gold text-white text-sm tracking-[0.1em] uppercase hover:bg-gold-dark transition-colors font-medium">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h2 className="font-display text-2xl tracking-[0.15em] mb-4">LAOBAN</h2>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              Redefining modern luxury fashion for the confident man. Premium quality, timeless style.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-white/20 flex items-center justify-center hover:bg-gold hover:border-gold transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm tracking-[0.15em] uppercase font-semibold mb-4 text-gold">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-white/50 text-sm hover:text-gold transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs">
            © 2025 Laoban. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-white/40 text-xs">
            <span>We accept: Visa, Mastercard, UPI, COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

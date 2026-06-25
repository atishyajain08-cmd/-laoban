"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { categories } from "@/data/categories";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [shopDropdown, setShopDropdown] = useState(false);
  const { totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const navLinks: { label: string; href: string; hasDropdown?: boolean }[] = [
    { label: "New Arrivals", href: "/shop?filter=new" },
    { label: "Collection", href: "/shop" },
    { label: "Lookbook", href: "/blog" },
    { label: "Products", href: "/shop" },
  ];

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-charcoal text-white text-center py-2 text-xs tracking-[0.2em] uppercase">
        Free shipping on orders above ₹2,999 | Use code <span className="text-gold font-semibold">WELCOME10</span>
      </div>

      <motion.header
        className={`sticky top-0 z-40 transition-all duration-500 ${
          scrolled ? "glass shadow-lg" : "bg-warm-white"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 -ml-2"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>

            {/* Logo */}
            <Link href="/" className="flex flex-shrink-0 items-center gap-3" aria-label="Laoban home">
              <img
                src="/-laoban/assets/brand/laoban-lb-mark.png"
                alt="Laoban LB logo"
                className="h-10 w-10 rounded-full object-cover shadow-[0_8px_24px_rgba(200,169,110,0.22)] md:h-12 md:w-12"
              />
              <h1 className="hidden font-display text-2xl tracking-[0.15em] text-charcoal sm:block md:text-3xl">
                LAOBAN
              </h1>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => link.hasDropdown && setShopDropdown(true)}
                  onMouseLeave={() => link.hasDropdown && setShopDropdown(false)}
                >
                  <Link
                    href={link.href}
                    className="text-sm tracking-[0.15em] uppercase text-charcoal hover:text-gold transition-colors duration-300 flex items-center gap-1"
                  >
                    {link.label}
                    {link.hasDropdown && <ChevronDown size={14} />}
                  </Link>

                  {/* Shop Dropdown */}
                  {link.hasDropdown && (
                    <AnimatePresence>
                      {shopDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-0 mt-2 w-64 bg-white shadow-xl border border-ivory-dark py-4"
                        >
                          {categories.map((cat) => (
                            <Link
                              key={cat.id}
                              href={`/shop?category=${cat.slug}`}
                              className="block px-6 py-2.5 text-sm text-charcoal hover:text-gold hover:bg-ivory transition-colors"
                            >
                              {cat.name}
                            </Link>
                          ))}
                          <div className="border-t border-ivory-dark mt-2 pt-2">
                            <Link
                              href="/shop"
                              className="block px-6 py-2.5 text-sm font-semibold text-gold"
                            >
                              View All →
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-3 md:gap-4">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 hover:text-gold transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
              <Link href="/dashboard/wishlist" className="p-2 hover:text-gold transition-colors relative">
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-gold text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link href="/cart" className="p-2 hover:text-gold transition-colors relative">
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 bg-gold text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </Link>
              <Link href="/dashboard" className="p-2 hover:text-gold transition-colors hidden md:block">
                <User size={20} />
              </Link>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-ivory-dark overflow-hidden"
            >
              <div className="max-w-2xl mx-auto px-4 py-4">
                <div className="relative">
                  <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray" />
                  <input
                    type="text"
                    placeholder="Search for tees, polos, outerwear..."
                    className="w-full pl-12 pr-4 py-3 bg-ivory border border-ivory-dark text-charcoal placeholder:text-warm-gray focus:outline-none focus:border-gold text-sm tracking-wide"
                    autoFocus
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-ivory-dark">
                <span className="flex items-center gap-3 font-display text-xl tracking-[0.15em]">
                  <img src="/-laoban/assets/brand/laoban-lb-mark.png" alt="Laoban" className="h-9 w-9 rounded-full object-cover" />
                  LAOBAN
                </span>
                <button onClick={() => setMobileOpen(false)}>
                  <X size={24} />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto py-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-6 py-4 text-sm tracking-[0.15em] uppercase text-charcoal hover:text-gold hover:bg-ivory transition-colors border-b border-ivory"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/bulk-enquiry"
                  onClick={() => setMobileOpen(false)}
                  className="block px-6 py-4 text-sm tracking-[0.15em] uppercase text-charcoal hover:text-gold hover:bg-ivory transition-colors border-b border-ivory"
                >
                  Bulk Orders
                </Link>
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="block px-6 py-4 text-sm tracking-[0.15em] uppercase text-charcoal hover:text-gold hover:bg-ivory transition-colors border-b border-ivory"
                >
                  Login / Sign Up
                </Link>
              </nav>
              <div className="p-6 border-t border-ivory-dark">
                <p className="text-xs text-warm-gray text-center">© 2025 Laoban. All rights reserved.</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

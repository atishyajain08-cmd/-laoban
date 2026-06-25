"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { User, ShoppingBag, Heart, Search, Settings, LogOut } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { useAuth } from "@/context/AuthContext";

const menuItems = [
  { icon: User, label: "My Profile", href: "/dashboard/profile", desc: "View and edit your profile" },
  { icon: ShoppingBag, label: "My Orders", href: "/dashboard/orders", desc: "Track and manage your orders" },
  { icon: Heart, label: "Wishlist", href: "/dashboard/wishlist", desc: "Your saved items" },
  { icon: Search, label: "Search Products", href: "/shop", desc: "Find your perfect style" },
  { icon: Settings, label: "Account Settings", href: "/dashboard/profile", desc: "Change password & preferences" },
];

export default function DashboardPage() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-white px-4">
        <AnimatedSection className="text-center">
          <User size={64} className="text-ivory-dark mx-auto mb-6" />
          <h1 className="font-display text-3xl text-charcoal mb-3">Sign In Required</h1>
          <p className="text-warm-gray text-sm mb-8">Please sign in to access your dashboard.</p>
          <Link href="/auth/login"
            className="inline-block px-8 py-3 bg-charcoal text-white text-sm tracking-[0.15em] uppercase hover:bg-gold transition-colors">
            Sign In
          </Link>
        </AnimatedSection>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-white">
      <div className="bg-charcoal text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <AnimatedSection>
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-2">Welcome Back</p>
            <h1 className="font-display text-3xl md:text-4xl">{user?.name || "User"}</h1>
            <p className="text-white/50 text-sm mt-1">{user?.email}</p>
          </AnimatedSection>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, i) => (
            <AnimatedSection key={item.label} delay={i * 0.1}>
              <Link href={item.href}>
                <motion.div whileHover={{ y: -4 }}
                  className="bg-white border border-ivory-dark p-6 hover:border-gold transition-colors group">
                  <item.icon size={24} className="text-gold mb-4" />
                  <h3 className="font-medium text-charcoal group-hover:text-gold transition-colors mb-1">
                    {item.label}
                  </h3>
                  <p className="text-warm-gray text-sm">{item.desc}</p>
                </motion.div>
              </Link>
            </AnimatedSection>
          ))}

          <AnimatedSection delay={0.5}>
            <button onClick={logout} className="w-full text-left">
              <motion.div whileHover={{ y: -4 }}
                className="bg-white border border-ivory-dark p-6 hover:border-red-300 transition-colors group">
                <LogOut size={24} className="text-warm-gray mb-4 group-hover:text-red-500" />
                <h3 className="font-medium text-charcoal group-hover:text-red-500 transition-colors mb-1">
                  Logout
                </h3>
                <p className="text-warm-gray text-sm">Sign out of your account</p>
              </motion.div>
            </button>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}

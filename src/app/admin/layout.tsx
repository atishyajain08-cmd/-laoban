"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, ShoppingBag, Users, Package, Grid3X3, Layers,
  Tag, FileText, Truck, RotateCcw, Search, Image, Menu, X, LogOut, ChevronRight,
} from "lucide-react";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: ShoppingBag, label: "Orders", href: "/admin/orders" },
  { icon: Users, label: "Customers", href: "/admin/customers" },
  { icon: Package, label: "Products", href: "/admin/products" },
  { icon: Grid3X3, label: "Categories", href: "/admin/categories" },
  { icon: Layers, label: "Sub-Categories", href: "/admin/subcategories" },
  { icon: Tag, label: "Coupons", href: "/admin/coupons" },
  { icon: FileText, label: "Blog", href: "/admin/blog" },
  { icon: Truck, label: "Shipping", href: "/admin/shipping" },
  { icon: RotateCcw, label: "Refunds", href: "/admin/refunds" },
  { icon: Search, label: "Enquiries", href: "/admin/enquiries" },
  { icon: Image, label: "Banners", href: "/admin/banners" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-charcoal text-white fixed inset-y-0 left-0 z-30">
        <div className="p-6 border-b border-white/10">
          <Link href="/admin" className="font-display text-xl tracking-[0.15em]">LAOBAN</Link>
          <p className="text-white/40 text-[10px] tracking-[0.2em] uppercase mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          {sidebarItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                  active ? "text-gold bg-white/5 border-r-2 border-gold" : "text-white/60 hover:text-white hover:bg-white/5"
                }`}>
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <Link href="/" className="flex items-center gap-2 text-white/40 text-sm hover:text-white transition-colors">
            <LogOut size={16} /> Back to Store
          </Link>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-64 bg-charcoal text-white z-50 lg:hidden">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <span className="font-display text-xl tracking-[0.15em]">LAOBAN</span>
              <button onClick={() => setSidebarOpen(false)}><X size={20} /></button>
            </div>
            <nav className="overflow-y-auto py-4">
              {sidebarItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-6 py-3 text-sm ${
                      active ? "text-gold bg-white/5" : "text-white/60 hover:text-white"
                    }`}>
                    <item.icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <div className="flex items-center text-sm text-gray-400">
              <Link href="/admin" className="hover:text-gold">Admin</Link>
              {pathname !== "/admin" && (
                <>
                  <ChevronRight size={14} className="mx-1" />
                  <span className="text-charcoal capitalize">
                    {pathname.split("/").pop()?.replace(/-/g, " ")}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gold text-white flex items-center justify-center text-sm font-medium">
              A
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

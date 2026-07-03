"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, Package, User } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { formatPrice } from "@/lib/utils";
import { LaobanOrder, readLocalOrders } from "@/lib/laobanOrders";
import { useAuth } from "@/context/AuthContext";

const statusColor: Record<string, string> = {
  Delivered: "bg-green-100 text-green-700",
  Shipped: "bg-blue-100 text-blue-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Processing: "bg-yellow-100 text-yellow-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<LaobanOrder[]>([]);
  const [open, setOpen] = useState<string | null>(null);

  // Real orders placed on this device — no demo data, ever.
  useEffect(() => {
    setOrders(readLocalOrders());
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-white px-4">
        <AnimatedSection className="text-center">
          <User size={64} className="text-ivory-dark mx-auto mb-6" />
          <h1 className="font-display text-3xl text-charcoal mb-3">Sign In Required</h1>
          <p className="text-warm-gray text-sm mb-8">Please sign in to view your orders.</p>
          <Link href="/auth/login?next=/dashboard/orders/"
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
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-2">Dashboard</p>
            <h1 className="font-display text-3xl">My Orders</h1>
          </AnimatedSection>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {orders.length === 0 ? (
          <AnimatedSection className="text-center py-16">
            <Package size={48} className="text-ivory-dark mx-auto mb-4" />
            <p className="font-display text-xl text-charcoal mb-2">No Orders Yet</p>
            <p className="text-warm-gray text-sm mb-8">
              When you place an order, it will appear here.
            </p>
            <Link href="/shop"
              className="inline-block px-8 py-3 bg-charcoal text-white text-sm tracking-[0.15em] uppercase hover:bg-gold transition-colors">
              Start Shopping
            </Link>
          </AnimatedSection>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <AnimatedSection key={order.id} delay={Math.min(i * 0.08, 0.4)}>
                <div className="bg-white border border-ivory-dark hover:border-gold transition-colors">
                  <button
                    onClick={() => setOpen(open === order.id ? null : order.id)}
                    className="w-full p-5 text-left"
                    aria-expanded={open === order.id}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="font-medium text-sm text-charcoal">{order.id}</p>
                        <p className="text-xs text-warm-gray mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" })}
                          {" • "}
                          {order.items.reduce((n, it) => n + it.quantity, 0)} item
                          {order.items.reduce((n, it) => n + it.quantity, 0) > 1 ? "s" : ""}
                          {" • "}
                          {order.customer.paymentMethod === "COD" ? "Cash on Delivery" : order.customer.paymentMethod}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 text-[10px] tracking-wider uppercase font-medium ${statusColor[order.status] || "bg-yellow-100 text-yellow-700"}`}>
                          {order.status}
                        </span>
                        <span className="font-semibold text-sm">{formatPrice(order.total)}</span>
                        <ChevronDown
                          size={16}
                          className={`text-warm-gray transition-transform ${open === order.id ? "rotate-180" : ""}`}
                        />
                      </div>
                    </div>
                  </button>

                  {open === order.id && (
                    <div className="border-t border-ivory px-5 pb-5">
                      <div className="divide-y divide-ivory">
                        {order.items.map((item, j) => (
                          <div key={j} className="flex items-center justify-between gap-3 py-3 text-sm">
                            <div>
                              <p className="text-charcoal">{item.product.name}</p>
                              <p className="text-xs text-warm-gray mt-0.5">
                                Size {item.size} · {item.color} · Qty {item.quantity}
                              </p>
                            </div>
                            <span className="font-medium">{formatPrice(item.product.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 space-y-1.5 border-t border-ivory pt-3 text-xs text-warm-gray">
                        <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
                        <div className="flex justify-between"><span>Shipping</span><span>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</span></div>
                        <div className="flex justify-between font-semibold text-charcoal text-sm"><span>Total</span><span>{formatPrice(order.total)}</span></div>
                      </div>
                    </div>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

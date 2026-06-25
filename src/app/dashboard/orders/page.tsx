"use client";
import { Download, Eye, Package } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { formatPrice } from "@/lib/utils";

const dummyOrders = [
  { id: "ORD-2024-001", date: "2024-12-20", status: "Delivered", total: 7498, items: 2, tracking: "DL12345678" },
  { id: "ORD-2024-002", date: "2024-12-15", status: "Shipped", total: 4999, items: 1, tracking: "SH87654321" },
  { id: "ORD-2024-003", date: "2024-12-10", status: "Processing", total: 11998, items: 3, tracking: null },
  { id: "ORD-2024-004", date: "2024-11-28", status: "Delivered", total: 2999, items: 1, tracking: "DL99887766" },
];

const statusColor: Record<string, string> = {
  Delivered: "bg-green-100 text-green-700",
  Shipped: "bg-blue-100 text-blue-700",
  Processing: "bg-yellow-100 text-yellow-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function OrdersPage() {
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
        {dummyOrders.length === 0 ? (
          <AnimatedSection className="text-center py-16">
            <Package size={48} className="text-ivory-dark mx-auto mb-4" />
            <p className="font-display text-xl text-charcoal mb-2">No Orders Yet</p>
            <p className="text-warm-gray text-sm">Your order history will appear here.</p>
          </AnimatedSection>
        ) : (
          <div className="space-y-4">
            {dummyOrders.map((order, i) => (
              <AnimatedSection key={order.id} delay={i * 0.1}>
                <div className="bg-white border border-ivory-dark p-5 hover:border-gold transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                    <div>
                      <p className="font-medium text-sm text-charcoal">{order.id}</p>
                      <p className="text-xs text-warm-gray mt-0.5">
                        {new Date(order.date).toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" })}
                        {" • "}{order.items} item{order.items > 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 text-[10px] tracking-wider uppercase font-medium ${statusColor[order.status]}`}>
                        {order.status}
                      </span>
                      <span className="font-semibold text-sm">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 pt-3 border-t border-ivory">
                    <button className="flex items-center gap-1.5 text-xs text-warm-gray hover:text-gold transition-colors">
                      <Eye size={14} /> View Details
                    </button>
                    <button className="flex items-center gap-1.5 text-xs text-warm-gray hover:text-gold transition-colors">
                      <Download size={14} /> Download Invoice
                    </button>
                    {order.tracking && (
                      <span className="text-xs text-warm-gray ml-auto">
                        Tracking: {order.tracking}
                      </span>
                    )}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

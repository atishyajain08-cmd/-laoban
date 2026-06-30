"use client";
import { useEffect, useMemo, useState } from "react";
import { Download, Eye, FileText, Search } from "lucide-react";
import { LaobanOrder, readLocalOrders } from "@/lib/laobanOrders";

const statusColors: Record<string, string> = {
  Processing: "bg-yellow-100 text-yellow-700",
  Shipped: "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function AdminOrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orders, setOrders] = useState<LaobanOrder[]>([]);

  useEffect(() => {
    setOrders(readLocalOrders());
  }, []);

  const filtered = useMemo(() => orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase())
      || o.customer.name.toLowerCase().includes(search.toLowerCase())
      || o.customer.phone.includes(search);
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  }), [orders, search, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">{orders.length} storefront order{orders.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => {
            const blob = new Blob([JSON.stringify(orders, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "laoban-orders.json";
            link.click();
            URL.revokeObjectURL(url);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-charcoal text-white text-sm rounded-lg hover:bg-gold transition-colors"
        >
          <Download size={16} /> Export Orders
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold bg-white">
          <option value="all">All Statuses</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {["Order ID", "Customer", "Items", "Total", "Payment", "Status", "Date", "Actions"].map((h) => (
                <th key={h} className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="p-4 font-medium">{order.id}</td>
                <td className="p-4"><div className="text-charcoal">{order.customer.name}</div><div className="text-xs text-gray-400">{order.customer.phone} · {order.customer.email}</div></td>
                <td className="p-4 text-gray-600">{order.items.reduce((total, item) => total + item.quantity, 0)}</td>
                <td className="p-4 font-medium">₹{order.total.toLocaleString("en-IN")}</td>
                <td className="p-4 text-gray-600">{order.customer.paymentMethod}</td>
                <td className="p-4">
                  <select defaultValue={order.status}
                    className={`px-2 py-1 text-[10px] tracking-wider uppercase font-medium rounded-full border-0 cursor-pointer ${statusColors[order.status]}`}>
                    {Object.keys(statusColors).map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="p-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 hover:bg-gray-100 rounded" title="View"><Eye size={14} /></button>
                    <button className="p-1.5 hover:bg-gray-100 rounded" title="Invoice"><FileText size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="p-8 text-center text-sm text-gray-500">
                  No orders yet. Orders placed from the Laoban cart will appear here and are also submitted to the Supabase orders table when the database schema is installed.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";
import { useEffect, useMemo, useState } from "react";
import { Download, Eye, FileText, RefreshCw, Search } from "lucide-react";
import { fetchLaobanOrders, LaobanOrder, readLocalOrders } from "@/lib/laobanOrders";

const statusColors: Record<string, string> = {
  Processing: "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-emerald-100 text-emerald-700",
  Shipped: "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function AdminOrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orders, setOrders] = useState<LaobanOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"supabase" | "local">("local");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    const load = async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        const remoteOrders = await fetchLaobanOrders();
        if (!active) return;
        setOrders(remoteOrders);
        setSource("supabase");
        setMessage("Live Supabase orders connected. This page refreshes automatically.");
      } catch (error) {
        if (!active) return;
        setOrders(readLocalOrders());
        setSource("local");
        setMessage(
          `Could not read Supabase orders from this admin page. ${
            error instanceof Error ? error.message : ""
          } Use backend.html if Supabase admin login is required.`
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    const interval = window.setInterval(() => load(true), 10000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
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
          <p className="text-sm text-gray-500 mt-1">
            {orders.length} storefront order{orders.length !== 1 ? "s" : ""} ·{" "}
            {source === "supabase" ? "Live Supabase backend" : "Local fallback"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={async () => {
              setLoading(true);
              try {
                const remoteOrders = await fetchLaobanOrders();
                setOrders(remoteOrders);
                setSource("supabase");
                setMessage("Orders refreshed from Supabase.");
              } catch (error) {
                setMessage(error instanceof Error ? error.message : "Could not refresh orders.");
              } finally {
                setLoading(false);
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-sm rounded-lg hover:border-gold transition-colors"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
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
      </div>

      {message && (
        <div className={`rounded-lg border px-4 py-3 text-sm ${
          source === "supabase" ? "border-green-200 bg-green-50 text-green-700" : "border-yellow-200 bg-yellow-50 text-yellow-800"
        }`}>
          {message}
        </div>
      )}

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
              {["Order ID", "Customer", "Delivery Address", "Items", "Total", "Payment", "Status", "Date", "Actions"].map((h) => (
                <th key={h} className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="p-4 font-medium">{order.id}</td>
                <td className="p-4"><div className="text-charcoal">{order.customer.name}</div><div className="text-xs text-gray-400">{order.customer.phone} · {order.customer.email}</div></td>
                <td className="p-4 text-xs leading-5 text-gray-600 min-w-[220px]">
                  <div>{order.customer.houseNumber}</div>
                  <div>{order.customer.street}</div>
                  {order.customer.landmark && <div>Landmark: {order.customer.landmark}</div>}
                  <div>{order.customer.city}, {order.customer.state} - {order.customer.pincode}</div>
                </td>
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
                <td colSpan={9} className="p-8 text-center text-sm text-gray-500">
                  {loading ? "Loading orders..." : "No orders yet. Orders placed from checkout will appear here after Supabase accepts them."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

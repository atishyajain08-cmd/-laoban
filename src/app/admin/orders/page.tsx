"use client";
import { useState } from "react";
import { Download, Eye, FileText, Search } from "lucide-react";

const orders = [
  { id: "ORD-001", customer: "Priya Sharma", email: "priya@email.com", total: 7498, items: 2, status: "Processing", date: "2024-12-20", payment: "Prepaid" },
  { id: "ORD-002", customer: "Ananya Reddy", email: "ananya@email.com", total: 4999, items: 1, status: "Shipped", date: "2024-12-19", payment: "COD" },
  { id: "ORD-003", customer: "Meera Patel", email: "meera@email.com", total: 11998, items: 3, status: "Delivered", date: "2024-12-18", payment: "Prepaid" },
  { id: "ORD-004", customer: "Kavya Nair", email: "kavya@email.com", total: 2999, items: 1, status: "Cancelled", date: "2024-12-17", payment: "Prepaid" },
  { id: "ORD-005", customer: "Isha Gupta", email: "isha@email.com", total: 8999, items: 2, status: "Processing", date: "2024-12-16", payment: "COD" },
];

const statusColors: Record<string, string> = {
  Processing: "bg-yellow-100 text-yellow-700",
  Shipped: "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function AdminOrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = orders.filter((o) => {
    const matchesSearch = o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">{orders.length} total orders</p>
        </div>
        {/* TODO: Implement Excel export with backend API */}
        <button className="flex items-center gap-2 px-4 py-2 bg-charcoal text-white text-sm rounded-lg hover:bg-gold transition-colors">
          <Download size={16} /> Export to Excel
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
                <td className="p-4"><div className="text-charcoal">{order.customer}</div><div className="text-xs text-gray-400">{order.email}</div></td>
                <td className="p-4 text-gray-600">{order.items}</td>
                <td className="p-4 font-medium">₹{order.total.toLocaleString()}</td>
                <td className="p-4 text-gray-600">{order.payment}</td>
                <td className="p-4">
                  <select defaultValue={order.status}
                    className={`px-2 py-1 text-[10px] tracking-wider uppercase font-medium rounded-full border-0 cursor-pointer ${statusColors[order.status]}`}>
                    {Object.keys(statusColors).map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="p-4 text-gray-500">{new Date(order.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 hover:bg-gray-100 rounded" title="View"><Eye size={14} /></button>
                    <button className="p-1.5 hover:bg-gray-100 rounded" title="Invoice"><FileText size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import { Download, Search, Eye, Edit2 } from "lucide-react";

const customers = [
  { id: "1", name: "Arjun Mehta", email: "arjun@email.com", phone: "+91 98765 43210", orders: 5, spent: 24990, joined: "2024-10-15" },
  { id: "2", name: "Rohan Kapoor", email: "rohan@email.com", phone: "+91 87654 32109", orders: 3, spent: 15497, joined: "2024-11-01" },
  { id: "3", name: "Kabir Malhotra", email: "kabir@email.com", phone: "+91 76543 21098", orders: 8, spent: 42990, joined: "2024-09-20" },
  { id: "4", name: "Vivaan Nair", email: "vivaan@email.com", phone: "+91 65432 10987", orders: 2, spent: 8998, joined: "2024-11-15" },
  { id: "5", name: "Aditya Gupta", email: "aditya@email.com", phone: "+91 54321 09876", orders: 6, spent: 31994, joined: "2024-10-01" },
];

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("");
  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal">Customers</h1>
          <p className="text-sm text-gray-500 mt-1">{customers.length} registered users</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-charcoal text-white text-sm rounded-lg hover:bg-gold transition-colors">
          <Download size={16} /> Export to Excel
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search customers..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold" />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {["Name", "Email", "Phone", "Orders", "Total Spent", "Joined", "Actions"].map((h) => (
                <th key={h} className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="p-4 font-medium">{c.name}</td>
                <td className="p-4 text-gray-600">{c.email}</td>
                <td className="p-4 text-gray-600">{c.phone}</td>
                <td className="p-4">{c.orders}</td>
                <td className="p-4 font-medium">₹{c.spent.toLocaleString()}</td>
                <td className="p-4 text-gray-500">{new Date(c.joined).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button className="p-1.5 hover:bg-gray-100 rounded" title="View"><Eye size={14} /></button>
                    <button className="p-1.5 hover:bg-gray-100 rounded" title="Edit"><Edit2 size={14} /></button>
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

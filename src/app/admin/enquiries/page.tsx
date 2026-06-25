"use client";
import { Download, Eye, Mail } from "lucide-react";

const enquiries = [
  { id: "1", name: "Raj Fashion House", email: "raj@fashion.com", phone: "+91 98765 43210", category: "Premium Tees", quantity: 100, message: "Need elevated black tees for a corporate gifting event", date: "2024-12-20", status: "New" },
  { id: "2", name: "Style Boutique", email: "info@style.com", phone: "+91 87654 32109", category: "Outerwear", quantity: 50, message: "Bulk order for winter collection", date: "2024-12-18", status: "Contacted" },
  { id: "3", name: "Pune Menswear Co.", email: "orders@punemenswear.com", phone: "+91 76543 21098", category: "Polos", quantity: 200, message: "Looking for wholesale pricing on polos and long-sleeve tees", date: "2024-12-15", status: "Quoted" },
  { id: "4", name: "Mumbai Retail Co.", email: "info@mumbairetail.com", phone: "+91 65432 10987", category: "Custom", quantity: 500, message: "Custom uniforms for hotel staff", date: "2024-12-12", status: "Closed" },
];

const statusColors: Record<string, string> = {
  New: "bg-blue-100 text-blue-700",
  Contacted: "bg-yellow-100 text-yellow-700",
  Quoted: "bg-purple-100 text-purple-700",
  Closed: "bg-gray-100 text-gray-500",
};

export default function AdminEnquiriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal">Bulk Enquiries</h1>
          <p className="text-sm text-gray-500 mt-1">{enquiries.length} enquiries</p>
        </div>
        {/* TODO: Implement Excel export with xlsx library */}
        <button className="flex items-center gap-2 px-4 py-2 bg-charcoal text-white text-sm rounded-lg hover:bg-gold transition-colors">
          <Download size={16} /> Export to Excel
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {["Name", "Contact", "Category", "Qty", "Message", "Date", "Status", "Actions"].map((h) => (
                <th key={h} className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {enquiries.map((e) => (
              <tr key={e.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="p-4 font-medium">{e.name}</td>
                <td className="p-4"><div className="text-xs text-gray-600">{e.email}</div><div className="text-xs text-gray-400">{e.phone}</div></td>
                <td className="p-4 text-gray-600">{e.category}</td>
                <td className="p-4 font-medium">{e.quantity}</td>
                <td className="p-4 text-gray-500 text-xs max-w-[200px] truncate">{e.message}</td>
                <td className="p-4 text-gray-500">{new Date(e.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 text-[10px] tracking-wider uppercase font-medium rounded-full ${statusColors[e.status]}`}>
                    {e.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-1">
                    <button className="p-1.5 hover:bg-gray-100 rounded" title="View"><Eye size={14} /></button>
                    <button className="p-1.5 hover:bg-gray-100 rounded" title="Email"><Mail size={14} /></button>
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

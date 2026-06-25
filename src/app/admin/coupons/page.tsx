"use client";
import { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";

const dummyCoupons = [
  { id: "1", code: "WELCOME10", discount: "10%", type: "percentage", minOrder: 999, maxDiscount: 500, active: true, uses: 234, expires: "2025-03-31" },
  { id: "2", code: "LAOBAN20", discount: "20%", type: "percentage", minOrder: 2999, maxDiscount: 1000, active: true, uses: 156, expires: "2025-02-28" },
  { id: "3", code: "FASHION15", discount: "15%", type: "percentage", minOrder: 1999, maxDiscount: 750, active: true, uses: 89, expires: "2025-06-30" },
  { id: "4", code: "FLAT500", discount: "₹500", type: "flat", minOrder: 3999, maxDiscount: 500, active: false, uses: 412, expires: "2024-12-31" },
];

export default function AdminCouponsPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal">Coupon Codes</h1>
          <p className="text-sm text-gray-500 mt-1">{dummyCoupons.length} coupons</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-gold text-white text-sm rounded-lg hover:bg-gold-dark transition-colors">
          <Plus size={16} /> Create Coupon
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <h3 className="font-semibold">New Coupon</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Code</label>
              <input type="text" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm uppercase focus:outline-none focus:border-gold" placeholder="SUMMER25" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Type</label>
              <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-gold">
                <option value="percentage">Percentage</option>
                <option value="flat">Flat Amount</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Discount Value</label>
              <input type="number" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Min Order (₹)</label>
              <input type="number" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Max Discount (₹)</label>
              <input type="number" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Expiry Date</label>
              <input type="date" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold" />
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-gold text-white text-sm rounded-lg">Create</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-200 text-sm rounded-lg">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {["Code", "Discount", "Min Order", "Max Discount", "Uses", "Expires", "Status", "Actions"].map((h) => (
                <th key={h} className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dummyCoupons.map((c) => (
              <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="p-4 font-mono font-medium">{c.code}</td>
                <td className="p-4 font-medium text-gold">{c.discount}</td>
                <td className="p-4 text-gray-600">₹{c.minOrder}</td>
                <td className="p-4 text-gray-600">₹{c.maxDiscount}</td>
                <td className="p-4">{c.uses}</td>
                <td className="p-4 text-gray-500">{c.expires}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 text-[10px] rounded-full ${c.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {c.active ? "Active" : "Expired"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-1">
                    <button className="p-1.5 hover:bg-gray-100 rounded"><Edit2 size={14} /></button>
                    <button className="p-1.5 hover:bg-red-50 rounded text-red-500"><Trash2 size={14} /></button>
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

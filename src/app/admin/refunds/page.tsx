"use client";
import { Eye } from "lucide-react";

const refunds = [
  { id: "REF-001", orderId: "ORD-001", customer: "Priya Sharma", amount: 4999, reason: "Size not fitting", status: "Pending", date: "2024-12-20" },
  { id: "REF-002", orderId: "ORD-003", customer: "Meera Patel", amount: 2999, reason: "Wrong color received", status: "Approved", date: "2024-12-18" },
  { id: "REF-003", orderId: "ORD-004", customer: "Kavya Nair", amount: 2999, reason: "Changed mind", status: "Rejected", date: "2024-12-17" },
  { id: "REF-004", orderId: "ORD-005", customer: "Isha Gupta", amount: 5499, reason: "Damaged product", status: "Refunded", date: "2024-12-15" },
];

const statusColors: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-700",
  Approved: "bg-blue-100 text-blue-700",
  Rejected: "bg-red-100 text-red-700",
  Refunded: "bg-green-100 text-green-700",
};

export default function AdminRefundsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-charcoal">Refunds & Cancellations</h1>
        <p className="text-sm text-gray-500 mt-1">Manage return requests and refund statuses</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {["Refund ID", "Order ID", "Customer", "Amount", "Reason", "Status", "Date", "Action"].map((h) => (
                <th key={h} className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {refunds.map((r) => (
              <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="p-4 font-medium">{r.id}</td>
                <td className="p-4 text-gray-600">{r.orderId}</td>
                <td className="p-4">{r.customer}</td>
                <td className="p-4 font-medium">₹{r.amount.toLocaleString()}</td>
                <td className="p-4 text-gray-500 text-xs max-w-[150px] truncate">{r.reason}</td>
                <td className="p-4">
                  <select defaultValue={r.status}
                    className={`px-2 py-1 text-[10px] tracking-wider uppercase font-medium rounded-full border-0 cursor-pointer ${statusColors[r.status]}`}>
                    {Object.keys(statusColors).map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td className="p-4 text-gray-500">{new Date(r.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</td>
                <td className="p-4">
                  <button className="p-1.5 hover:bg-gray-100 rounded"><Eye size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

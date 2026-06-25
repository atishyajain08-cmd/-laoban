"use client";
import { motion } from "framer-motion";
import { ShoppingBag, Users, Package, IndianRupee, TrendingUp, Eye } from "lucide-react";

const stats = [
  { icon: IndianRupee, label: "Total Revenue", value: "₹12,45,000", change: "+12.5%", color: "bg-green-50 text-green-600" },
  { icon: ShoppingBag, label: "Total Orders", value: "456", change: "+8.2%", color: "bg-blue-50 text-blue-600" },
  { icon: Users, label: "Total Customers", value: "1,234", change: "+15.3%", color: "bg-purple-50 text-purple-600" },
  { icon: Package, label: "Total Products", value: "89", change: "+3", color: "bg-orange-50 text-orange-600" },
];

const recentOrders = [
  { id: "ORD-001", customer: "Priya Sharma", total: "₹7,498", status: "Processing", date: "Today" },
  { id: "ORD-002", customer: "Ananya Reddy", total: "₹4,999", status: "Shipped", date: "Yesterday" },
  { id: "ORD-003", customer: "Meera Patel", total: "₹11,998", status: "Delivered", date: "2 days ago" },
  { id: "ORD-004", customer: "Kavya Nair", total: "₹2,999", status: "Processing", date: "3 days ago" },
  { id: "ORD-005", customer: "Isha Gupta", total: "₹8,999", status: "Pending", date: "4 days ago" },
];

const statusColors: Record<string, string> = {
  Processing: "bg-yellow-100 text-yellow-700",
  Shipped: "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
  Pending: "bg-gray-100 text-gray-700",
};

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-charcoal">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of your store performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border border-gray-200 p-5 rounded-lg"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <span className="text-xs text-green-600 flex items-center gap-0.5">
                <TrendingUp size={12} />
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-semibold text-charcoal">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-semibold text-charcoal">Recent Orders</h2>
          <a href="/admin/orders" className="text-sm text-gold hover:underline">View All</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4 font-medium">{order.id}</td>
                  <td className="p-4 text-gray-600">{order.customer}</td>
                  <td className="p-4 font-medium">{order.total}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-[10px] tracking-wider uppercase font-medium rounded-full ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500">{order.date}</td>
                  <td className="p-4">
                    <button className="text-gold hover:underline flex items-center gap-1"><Eye size={14} /> View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

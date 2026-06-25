"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Search, Edit2, Trash2, Eye } from "lucide-react";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/utils";

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal">Products</h1>
          <p className="text-sm text-gray-500 mt-1">{products.length} total products</p>
        </div>
        <Link href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2 bg-gold text-white text-sm rounded-lg hover:bg-gold-dark transition-colors">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold" />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {["Image", "Name", "Category", "Price", "Stock", "Rating", "Actions"].map((h) => (
                <th key={h} className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="p-4">
                  <div className="w-12 h-14 relative bg-gray-100 rounded overflow-hidden">
                    <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-medium">{p.name}</div>
                  {p.badge && <span className="text-[10px] text-gold uppercase">{p.badge}</span>}
                </td>
                <td className="p-4 text-gray-600 capitalize">{p.category}</td>
                <td className="p-4">
                  <div className="font-medium">{formatPrice(p.price)}</div>
                  {p.originalPrice && <div className="text-xs text-gray-400 line-through">{formatPrice(p.originalPrice)}</div>}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 text-[10px] rounded-full ${p.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {p.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </td>
                <td className="p-4 text-gray-600">{p.rating} ★</td>
                <td className="p-4">
                  <div className="flex gap-1">
                    <button className="p-1.5 hover:bg-gray-100 rounded" title="View"><Eye size={14} /></button>
                    <button className="p-1.5 hover:bg-gray-100 rounded" title="Edit"><Edit2 size={14} /></button>
                    <button className="p-1.5 hover:bg-red-50 rounded text-red-500" title="Delete"><Trash2 size={14} /></button>
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

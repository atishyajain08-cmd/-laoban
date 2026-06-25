"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Upload } from "lucide-react";
import { categories } from "@/data/categories";

export default function AddProductPage() {
  const [selectedCategory, setSelectedCategory] = useState("");

  const subcategories = categories.find((c) => c.slug === selectedCategory)?.subcategories || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft size={20} /></Link>
        <div>
          <h1 className="text-2xl font-semibold text-charcoal">Add New Product</h1>
          <p className="text-sm text-gray-500 mt-1">Fill in the product details</p>
        </div>
      </div>

      {/* TODO: Connect to backend API for product creation */}
      <form onSubmit={(e) => e.preventDefault()} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
            <h2 className="font-semibold text-charcoal">Basic Information</h2>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Product Code</label>
              <input type="text" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold"
                placeholder="e.g., LBN-WT-007" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Product Name</label>
              <input type="text" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold"
                placeholder="e.g., Laoban Plain White Tee" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Description</label>
              <textarea rows={4} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold resize-none"
                placeholder="Product description..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Price (₹)</label>
                <input type="number" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Original Price (₹)</label>
                <input type="number" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold"
                  placeholder="Optional, for sale items" />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="font-semibold text-charcoal mb-4">Product Images</h2>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
              <Upload size={32} className="text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500 mb-1">Drag & drop images or click to upload</p>
              <p className="text-xs text-gray-400">PNG, JPG up to 5MB each</p>
              <input type="file" multiple accept="image/*" className="hidden" id="product-images" />
              <label htmlFor="product-images"
                className="inline-block mt-4 px-4 py-2 border border-gray-200 rounded-lg text-sm cursor-pointer hover:border-gold transition-colors">
                Choose Files
              </label>
            </div>
          </div>

          {/* Variants */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
            <h2 className="font-semibold text-charcoal">Variants</h2>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Sizes (comma separated)</label>
              <input type="text" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold"
                placeholder="XS, S, M, L, XL" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Colors (name:hex, comma separated)</label>
              <input type="text" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold"
                placeholder="Black:#1A1A1A, Gold:#C8A96E" />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
            <h2 className="font-semibold text-charcoal">Organization</h2>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Category</label>
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold bg-white">
                <option value="">Select Category</option>
                {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
              </select>
            </div>
            {subcategories.length > 0 && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Sub-Category</label>
                <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold bg-white">
                  <option value="">Select Sub-Category</option>
                  {subcategories.map((s) => <option key={s.id} value={s.slug}>{s.name}</option>)}
                </select>
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Badge</label>
              <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold bg-white">
                <option value="">None</option>
                <option value="new">New</option>
                <option value="bestseller">Bestseller</option>
                <option value="sale">Sale</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Delivery Days</label>
              <input type="number" min={1} defaultValue={3}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" defaultChecked id="in-stock" className="accent-gold" />
              <label htmlFor="in-stock" className="text-sm">In Stock</label>
            </div>
          </div>

          <button type="submit"
            className="w-full py-3 bg-gold text-white text-sm rounded-lg font-medium hover:bg-gold-dark transition-colors">
            Add Product
          </button>
          <Link href="/admin/products"
            className="block text-center text-sm text-gray-500 hover:text-charcoal">Cancel</Link>
        </div>
      </form>
    </div>
  );
}

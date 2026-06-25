"use client";
import { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { categories } from "@/data/categories";

export default function AdminCategoriesPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">{categories.length} categories</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-gold text-white text-sm rounded-lg hover:bg-gold-dark transition-colors">
          <Plus size={16} /> Add Category
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <h3 className="font-semibold">New Category</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Name</label>
              <input type="text" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold"
                placeholder="e.g., Accessories" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Image URL</label>
              <input type="url" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Description</label>
            <input type="text" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold" />
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-gold text-white text-sm rounded-lg">Save</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-200 text-sm rounded-lg">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {["Name", "Slug", "Sub-Categories", "Description", "Actions"].map((h) => (
                <th key={h} className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="p-4 font-medium">{cat.name}</td>
                <td className="p-4 text-gray-500 font-mono text-xs">{cat.slug}</td>
                <td className="p-4 text-gray-600">{cat.subcategories.length}</td>
                <td className="p-4 text-gray-500 text-xs max-w-xs truncate">{cat.description}</td>
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

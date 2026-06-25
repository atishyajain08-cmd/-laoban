"use client";
import { useState } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, Eye } from "lucide-react";
import { blogPosts } from "@/data/blog";

export default function AdminBlogPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal">Blog Posts</h1>
          <p className="text-sm text-gray-500 mt-1">{blogPosts.length} posts</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-gold text-white text-sm rounded-lg hover:bg-gold-dark transition-colors">
          <Plus size={16} /> Create Post
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <h3 className="font-semibold">New Blog Post</h3>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Title</label>
            <input type="text" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Excerpt</label>
            <input type="text" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Content</label>
            <textarea rows={6} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Category</label>
              <input type="text" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold" placeholder="Style Guide, Trends, etc." />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Cover Image URL</label>
              <input type="url" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold" />
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-gold text-white text-sm rounded-lg">Publish</button>
            <button className="px-4 py-2 border border-gray-200 text-sm rounded-lg">Save Draft</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-500">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {["Image", "Title", "Category", "Author", "Date", "Actions"].map((h) => (
                <th key={h} className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {blogPosts.map((post) => (
              <tr key={post.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="p-4">
                  <div className="w-16 h-12 relative bg-gray-100 rounded overflow-hidden">
                    <Image src={post.image} alt={post.title} fill className="object-cover" />
                  </div>
                </td>
                <td className="p-4 font-medium max-w-xs"><div className="line-clamp-1">{post.title}</div></td>
                <td className="p-4 text-gray-600">{post.category}</td>
                <td className="p-4 text-gray-500">{post.author}</td>
                <td className="p-4 text-gray-500">{new Date(post.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</td>
                <td className="p-4">
                  <div className="flex gap-1">
                    <button className="p-1.5 hover:bg-gray-100 rounded"><Eye size={14} /></button>
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

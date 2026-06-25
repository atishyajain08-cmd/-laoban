"use client";
import { useState } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, GripVertical } from "lucide-react";

const dummyBanners = [
  { id: "1", title: "New Collection 2025", image: "/assets/campaign/laoban-hero-men.png", link: "/shop?filter=new", active: true, position: "hero" },
  { id: "2", title: "Occasionwear Edit", image: "/assets/campaign/laoban-look-4.png", link: "/shop?filter=sale", active: true, position: "secondary" },
  { id: "3", title: "Premium Tailoring", image: "/assets/campaign/laoban-look-6.png", link: "/shop?category=outerwear", active: false, position: "secondary" },
];

export default function AdminBannersPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal">Homepage Banners</h1>
          <p className="text-sm text-gray-500 mt-1">Manage hero and promotional banners</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-gold text-white text-sm rounded-lg hover:bg-gold-dark transition-colors">
          <Plus size={16} /> Add Banner
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <h3 className="font-semibold">New Banner</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Title</label>
              <input type="text" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Link URL</label>
              <input type="text" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold" placeholder="/shop" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Image URL</label>
              <input type="url" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Position</label>
              <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-gold">
                <option value="hero">Hero (Main)</option>
                <option value="secondary">Secondary</option>
                <option value="popup">Popup</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-gold text-white text-sm rounded-lg">Save</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-200 text-sm rounded-lg">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {dummyBanners.map((banner) => (
          <div key={banner.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4">
            <button className="cursor-grab text-gray-300 hover:text-gray-500">
              <GripVertical size={18} />
            </button>
            <div className="w-24 h-14 relative bg-gray-100 rounded overflow-hidden flex-shrink-0">
              <Image src={banner.image} alt={banner.title} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{banner.title}</p>
              <p className="text-xs text-gray-400">{banner.link} • {banner.position}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-2 py-0.5 text-[10px] rounded-full ${banner.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {banner.active ? "Active" : "Hidden"}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={banner.active} className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 peer-checked:bg-gold rounded-full
                  after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4
                  after:transition-all peer-checked:after:translate-x-full" />
              </label>
              <button className="p-1.5 hover:bg-gray-100 rounded"><Edit2 size={14} /></button>
              <button className="p-1.5 hover:bg-red-50 rounded text-red-500"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

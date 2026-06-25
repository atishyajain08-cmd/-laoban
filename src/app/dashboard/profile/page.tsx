"use client";
import { useState } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, phone, bio });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-warm-white">
      <div className="bg-charcoal text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <AnimatedSection>
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-2">Dashboard</p>
            <h1 className="font-display text-3xl">My Profile</h1>
          </AnimatedSection>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <AnimatedSection>
          <form onSubmit={handleSave} className="space-y-8">
            {/* Avatar */}
            <div className="flex items-center gap-6">
              <div className="relative w-20 h-20 rounded-full overflow-hidden bg-ivory border-2 border-ivory-dark">
                {user?.avatar ? (
                  <Image src={user.avatar} alt="Avatar" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gold font-display text-2xl">
                    {(user?.name || "U")[0]}
                  </div>
                )}
                <button type="button"
                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Camera size={18} className="text-white" />
                </button>
              </div>
              <div>
                <p className="font-medium text-charcoal">{user?.name || "User"}</p>
                <p className="text-sm text-warm-gray">{user?.email}</p>
              </div>
            </div>

            <div className="grid gap-5">
              <div>
                <label className="block text-xs tracking-[0.1em] uppercase font-medium mb-2">Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-ivory-dark focus:outline-none focus:border-gold text-sm" />
              </div>
              <div>
                <label className="block text-xs tracking-[0.1em] uppercase font-medium mb-2">Email</label>
                <input type="email" value={user?.email || ""} disabled
                  className="w-full px-4 py-3 border border-ivory-dark text-sm bg-ivory text-warm-gray" />
              </div>
              <div>
                <label className="block text-xs tracking-[0.1em] uppercase font-medium mb-2">Phone</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-ivory-dark focus:outline-none focus:border-gold text-sm"
                  placeholder="+91 99999 99999" />
              </div>
              <div>
                <label className="block text-xs tracking-[0.1em] uppercase font-medium mb-2">Bio</label>
                <textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-3 border border-ivory-dark focus:outline-none focus:border-gold text-sm resize-none"
                  placeholder="Tell us about yourself..." />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button type="submit"
                className="px-8 py-3 bg-charcoal text-white text-sm tracking-[0.15em] uppercase hover:bg-gold transition-colors">
                Save Changes
              </button>
              {saved && <span className="text-green-600 text-sm">Profile updated!</span>}
            </div>

            {/* Change Password */}
            <div className="border-t border-ivory-dark pt-8 mt-8">
              <h3 className="text-sm font-semibold tracking-[0.1em] uppercase mb-5">Change Password</h3>
              <div className="grid gap-4">
                <input type="password" placeholder="Current password"
                  className="w-full px-4 py-3 border border-ivory-dark focus:outline-none focus:border-gold text-sm" />
                <input type="password" placeholder="New password"
                  className="w-full px-4 py-3 border border-ivory-dark focus:outline-none focus:border-gold text-sm" />
                <input type="password" placeholder="Confirm new password"
                  className="w-full px-4 py-3 border border-ivory-dark focus:outline-none focus:border-gold text-sm" />
              </div>
              <button type="button"
                className="mt-4 px-6 py-2 border border-charcoal text-charcoal text-sm tracking-[0.1em] uppercase hover:bg-charcoal hover:text-white transition-colors">
                Update Password
              </button>
            </div>
          </form>
        </AnimatedSection>
      </div>
    </div>
  );
}

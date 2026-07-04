"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, MapPin } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { lookupPincode } from "@/lib/pincode";

const inputClass =
  "w-full px-4 py-3 border border-ivory-dark focus:outline-none focus:border-gold text-sm";
const labelClass = "block text-xs tracking-[0.1em] uppercase font-medium mb-2";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [street, setStreet] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");
  const [pinLooking, setPinLooking] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmSent, setConfirmSent] = useState(false);
  const { signup } = useAuth();
  const router = useRouter();

  // 6-digit PIN → auto-fill city & state (India Post data). Still editable.
  const onPincodeChange = async (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 6);
    setPincode(digits);
    if (digits.length === 6) {
      setPinLooking(true);
      const info = await lookupPincode(digits);
      setPinLooking(false);
      if (info) {
        setCity(info.city);
        setStateName(info.state);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }
    if (!/^\d{6}$/.test(pincode.trim())) {
      setError("Enter a valid 6-digit PIN code.");
      return;
    }
    setLoading(true);
    try {
      const result = await signup(name, email, password, {
        phone,
        houseNumber,
        street,
        landmark,
        city,
        state: stateName,
        pincode,
      });
      if (!result.ok) {
        setError(result.message || "Failed to create account.");
        return;
      }
      if (result.needsEmailConfirm) {
        setConfirmSent(true);
        return;
      }
      const next = new URLSearchParams(window.location.search).get("next");
      router.push(next && next.startsWith("/") ? next : "/dashboard");
    } catch {
      setError("Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white p-8 md:p-10 border border-ivory-dark"
      >
        <div className="text-center mb-8">
          <Link href="/" className="font-display text-2xl tracking-[0.15em] text-charcoal">
            LAOBAN
          </Link>
          <h2 className="font-display text-xl mt-4 text-charcoal">Create Account</h2>
          <p className="text-warm-gray text-sm mt-1">
            One-time details — checkout will be auto-filled for you
          </p>
        </div>

        {confirmSent ? (
          <div className="text-center py-6">
            <h3 className="font-display text-lg mb-2 text-charcoal">Confirm Your Email</h3>
            <p className="text-warm-gray text-sm mb-6">
              We&apos;ve sent a confirmation link to <strong>{email}</strong>.
              Open it, then sign in to continue.
            </p>
            <Link href="/auth/login" className="text-gold hover:underline text-sm font-medium">
              Go to Sign In
            </Link>
          </div>
        ) : (
        <>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 mb-6">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={labelClass}>Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
              className={inputClass} placeholder="Your full name" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className={inputClass} placeholder="you@example.com" />
            </div>
            <div>
              <label className={labelClass}>Mobile Number</label>
              <input type="tel" value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} required
                className={inputClass} placeholder="10-digit mobile" />
            </div>
          </div>

          <div className="border-t border-ivory-dark pt-5">
            <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-charcoal">
              <MapPin size={14} className="text-gold" /> Delivery Address (India only)
            </p>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>House / Flat Number</label>
                <input type="text" value={houseNumber} onChange={(e) => setHouseNumber(e.target.value)} required
                  className={inputClass} placeholder="Flat 12B / House 44" />
              </div>
              <div>
                <label className={labelClass}>Street / Locality</label>
                <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} required
                  className={inputClass} placeholder="Street, area, colony" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Landmark (Optional)</label>
                <input type="text" value={landmark} onChange={(e) => setLandmark(e.target.value)}
                  className={inputClass} placeholder="Near metro station, gate, shop…" />
              </div>
              <div>
                <label className={labelClass}>PIN Code</label>
                <input type="text" inputMode="numeric" value={pincode}
                  onChange={(e) => onPincodeChange(e.target.value)} required
                  className={inputClass} placeholder="6-digit PIN" />
                {pinLooking && <p className="mt-1 text-[11px] text-warm-gray">Finding your city…</p>}
              </div>
              <div>
                <label className={labelClass}>City</label>
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required
                  className={inputClass} placeholder="Auto-fills from PIN" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>State</label>
                <input type="text" value={stateName} onChange={(e) => setStateName(e.target.value)} required
                  className={inputClass} placeholder="Auto-fills from PIN" />
              </div>
            </div>
          </div>

          <div className="border-t border-ivory-dark pt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password}
                  onChange={(e) => setPassword(e.target.value)} required minLength={8}
                  className={`${inputClass} pr-10`} placeholder="Min 8 characters" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-gray">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className={labelClass}>Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                required className={inputClass} placeholder="••••••••" />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3 bg-charcoal text-white text-sm tracking-[0.15em] uppercase hover:bg-gold transition-colors disabled:opacity-50">
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-warm-gray mt-6">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-gold hover:underline font-medium">Sign In</Link>
        </p>
        </>
        )}
      </motion.div>
    </div>
  );
}

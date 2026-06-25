"use client";
import { Truck, CreditCard, MapPin } from "lucide-react";

const shippingMethods = [
  { id: "1", name: "Cash on Delivery", icon: Truck, enabled: true, description: "Customers pay on delivery", charge: 49 },
  { id: "2", name: "Prepaid Order", icon: CreditCard, enabled: true, description: "Online payment via UPI, Cards, Wallets", charge: 0 },
  { id: "3", name: "Local Pickup", icon: MapPin, enabled: false, description: "Customer picks up from store", charge: 0 },
];

export default function AdminShippingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-charcoal">Shipping Methods</h1>
        <p className="text-sm text-gray-500 mt-1">Configure your shipping and delivery options</p>
      </div>

      <div className="grid gap-4">
        {shippingMethods.map((method) => (
          <div key={method.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center">
                  <method.icon size={22} className="text-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal">{method.name}</h3>
                  <p className="text-sm text-gray-500">{method.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs text-gray-500">Charge</p>
                  <p className="font-medium">{method.charge > 0 ? `₹${method.charge}` : "Free"}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={method.enabled} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-checked:bg-gold rounded-full peer-focus:outline-none transition-colors
                    after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5
                    after:transition-all peer-checked:after:translate-x-full" />
                </label>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Charge (₹)</label>
                <input type="number" defaultValue={method.charge}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Free Above (₹)</label>
                <input type="number" defaultValue={2999}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Est. Days</label>
                <input type="number" defaultValue={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold" />
              </div>
              <div className="flex items-end">
                <button className="px-4 py-2 bg-charcoal text-white text-sm rounded-lg hover:bg-gold transition-colors w-full">
                  Save
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import Link from "next/link";
import { RotateCcw, ShieldCheck, Truck, Ruler } from "lucide-react";

const policies = [
  {
    icon: Truck,
    title: "Shipping",
    body: "Orders are prepared within 1–3 working days. Shipping is free above ₹2,999 across India. Standard shipping is calculated at checkout for smaller orders.",
  },
  {
    icon: RotateCcw,
    title: "Returns",
    body: "We support 7-day return requests for unused products with original tags and packaging. Size exchanges are prioritized whenever inventory is available.",
  },
  {
    icon: Ruler,
    title: "Sizing",
    body: "Every product page includes size guidance. For a relaxed fit, choose your usual size. For a sharper fit, compare chest and shoulder measurements before ordering.",
  },
  {
    icon: ShieldCheck,
    title: "Payments",
    body: "Cash on Delivery and UPI-after-confirmation flows are supported. Razorpay can be connected when you are ready to accept prepaid online payments.",
  },
];

export default function PoliciesPage() {
  return (
    <main className="min-h-screen bg-warm-white">
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold">Laoban Care</p>
        <h1 className="max-w-3xl font-display text-5xl leading-none text-charcoal md:text-7xl">
          Clear policies for a confident purchase.
        </h1>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-warm-gray">
          Premium shopping should feel calm. These are the customer-facing basics for shipping,
          returns, sizing, and payment confidence.
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {policies.map(({ icon: Icon, title, body }) => (
            <article key={title} className="border border-ivory-dark bg-white p-6 shadow-[0_20px_60px_rgba(26,26,26,0.05)]">
              <Icon className="mb-5 text-charcoal" size={24} />
              <h2 className="font-display text-2xl text-charcoal">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-warm-gray">{body}</p>
            </article>
          ))}
        </div>

        <div className="mt-12 border border-charcoal bg-charcoal p-6 text-white md:p-8">
          <h2 className="font-display text-3xl">Need help choosing size?</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/65">
            Message Laoban support with your height, weight, and preferred fit. We can help pick
            the right size before you place the order.
          </p>
          <Link href="/contact" className="mt-6 inline-flex border-b border-gold pb-1 text-xs uppercase tracking-[0.18em] text-gold">
            Contact support
          </Link>
        </div>
      </section>
    </main>
  );
}

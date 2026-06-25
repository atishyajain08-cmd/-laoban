export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  text: string;
  product: string;
  date: string;
  location: string;
}

// Avatars use the men's campaign shots as placeholders — swap for real portraits later.
const AV = "/assets/campaign/hero-black.png";
const AV2 = "/assets/campaign/ivory-tee.png";
const AV3 = "/assets/campaign/forest-polo.png";

export const testimonials: Testimonial[] = [
  { id: "1", name: "Arjun Mehta", avatar: AV, rating: 5, text: "The Noir Essential Crew is exactly what I struggle to find in India — clean through the shoulders without being tight. It's become the first thing I reach for.", product: "Noir Essential Crew Tee", date: "2025-12-15", location: "Mumbai" },
  { id: "2", name: "Vikram Rao", avatar: AV2, rating: 5, text: "The Onyx Henley is beautifully made. The placket sits perfectly and the fabric holds its shape. Worth every rupee.", product: "Onyx Henley Tee", date: "2025-11-28", location: "Bangalore" },
  { id: "3", name: "Rohan Iyer", avatar: AV3, rating: 4, text: "Premium cotton that actually feels premium. The collar still holds its shape after a dozen washes. Will order again.", product: "Slate Crew Tee", date: "2025-12-02", location: "Delhi" },
  { id: "4", name: "Aditya Khanna", avatar: AV, rating: 5, text: "Wore the Shadow Oversized to a rooftop dinner and got three compliments. Effortless drape, no fuss.", product: "Shadow Oversized Tee", date: "2025-12-20", location: "Hyderabad" },
  { id: "5", name: "Karan Malhotra", avatar: AV2, rating: 5, text: "Oversized done right — structured, not sloppy. The weight of the cotton makes it feel expensive.", product: "Obsidian Boxy Tee", date: "2025-11-15", location: "Pune" },
  { id: "6", name: "Sameer Joshi", avatar: AV3, rating: 4, text: "Finally a tee cut for an Indian frame. Quiet, confident, and built to last. The packaging was a nice touch too.", product: "Eclipse Tailored Tee", date: "2025-12-10", location: "Jaipur" },
];

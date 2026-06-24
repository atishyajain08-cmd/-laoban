export interface Testimonial {
  id: string;
  name: string;
  location: string;
  product: string;
  rating: number;
  text: string;
}

export const testimonials: Testimonial[] = [
  { id: 't1', name: 'Arjun Mehta', location: 'Mumbai', product: 'Knitted Authority Polo', rating: 5, text: 'The fit is exactly what I struggle to find in India — clean through the shoulders without being tight. It has become the first thing I reach for.' },
  { id: 't2', name: 'Vikram Rao', location: 'Bangalore', product: 'Single Pleat Trouser', rating: 5, text: 'Formal enough for client meetings, comfortable enough to wear all day. The fabric holds its line beautifully.' },
  { id: 't3', name: 'Rohan Iyer', location: 'Delhi', product: 'Signature Crew', rating: 4, text: 'Premium cotton that actually feels premium. The collar still holds its shape after a dozen washes.' },
  { id: 't4', name: 'Aditya Khanna', location: 'Hyderabad', product: 'After Hours Resort Shirt', rating: 5, text: 'Wore it to a rooftop dinner and got three compliments. Effortless drape, no fuss.' },
  { id: 't5', name: 'Karan Malhotra', location: 'Pune', product: 'Heavyweight Oversized Tee', rating: 5, text: 'Oversized done right — structured, not sloppy. The weight of the cotton makes it feel expensive.' },
  { id: 't6', name: 'Sameer Joshi', location: 'Jaipur', product: 'The Structure Tee', rating: 4, text: 'Finally a tee cut for an Indian frame. Quiet, confident, and built to last.' },
];

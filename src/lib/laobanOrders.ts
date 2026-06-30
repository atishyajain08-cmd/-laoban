import { CartItem } from "@/context/CartContext";

const SUPABASE_URL = "https://lzbdavmurwmrsbfhubtu.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_4YMXFJhyg-Gf37mrOweG7g_ISIRDiOF";
const LOCAL_ORDERS_KEY = "laoban_orders";

export interface CheckoutCustomer {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: "COD" | "UPI";
}

export interface LaobanOrder {
  id: string;
  customer: CheckoutCustomer;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  couponCode?: string;
  status: "Processing" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: string;
}

function orderCode() {
  const date = new Date();
  const stamp = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("");
  return `LBN-${stamp}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

export function readLocalOrders(): LaobanOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY) || "[]") as LaobanOrder[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLocalOrder(order: LaobanOrder) {
  if (typeof window === "undefined") return;
  const orders = readLocalOrders();
  localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify([order, ...orders].slice(0, 50)));
}

export async function createLaobanOrder({
  customer,
  items,
  subtotal,
  shipping,
  total,
  couponCode,
}: {
  customer: CheckoutCustomer;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  couponCode?: string;
}) {
  const order: LaobanOrder = {
    id: orderCode(),
    customer,
    items,
    subtotal,
    shipping,
    total,
    couponCode,
    status: "Processing",
    createdAt: new Date().toISOString(),
  };

  saveLocalOrder(order);

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        order_code: order.id,
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone,
        shipping_address: {
          address: customer.address,
          city: customer.city,
          state: customer.state,
          pincode: customer.pincode,
        },
        payment_method: customer.paymentMethod,
        status: order.status,
        subtotal,
        shipping,
        total,
        coupon_code: couponCode || null,
        items: items.map((item) => ({
          product_id: item.product.id,
          live_catalog_id: item.product.liveCatalogId || null,
          product_code: item.product.productCode,
          name: item.product.name,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          price: item.product.price,
          image: item.product.images[0],
        })),
      }),
    });
    if (!response.ok) throw new Error("Supabase order insert failed");
  } catch {
    // Local order is already saved. Supabase is best-effort so customers are not blocked by network issues.
  }

  return order;
}

import { CartItem } from "@/context/CartContext";

const SUPABASE_URL = "https://lzbdavmurwmrsbfhubtu.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_4YMXFJhyg-Gf37mrOweG7g_ISIRDiOF";
const LOCAL_ORDERS_KEY = "laoban_orders";

export interface CheckoutCustomer {
  name: string;
  email: string;
  phone: string;
  houseNumber: string;
  street: string;
  landmark?: string;
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

function deliveryAddress(customer: CheckoutCustomer) {
  return {
    house_number: customer.houseNumber.trim(),
    street: customer.street.trim(),
    landmark: customer.landmark?.trim() || "",
    city: customer.city.trim(),
    state: customer.state.trim(),
    pincode: customer.pincode.trim(),
    country: "India",
    address: [
      customer.houseNumber.trim(),
      customer.street.trim(),
      customer.landmark?.trim(),
      customer.city.trim(),
      customer.state.trim(),
      customer.pincode.trim(),
    ].filter(Boolean).join(", "),
  };
}

function orderItems(items: CartItem[]) {
  return items.map((item) => ({
    product_id: item.product.id,
    live_catalog_id: item.product.liveCatalogId || null,
    product_code: item.product.productCode,
    name: item.product.name,
    size: item.size,
    color: item.color,
    quantity: item.quantity,
    price: item.product.price,
    image: item.product.images[0],
  }));
}

async function insertOrderPayload(payload: Record<string, unknown>) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      // return=minimal: orders are admin-readable only, so asking for the
      // inserted row back would be blocked by RLS and fail the whole insert.
      Prefer: "return=minimal",
    },
    body: JSON.stringify(payload),
  });
  const responseText = await response.text();
  return { ok: response.ok, responseText };
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

  try {
    const delivery = deliveryAddress(customer);
    const lineItems = orderItems(items);
    const richPayload = {
      order_code: order.id,
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone,
      shipping_address: delivery,
      payment_method: customer.paymentMethod,
      status: order.status,
      subtotal,
      shipping,
      total,
      coupon_code: couponCode || null,
      items: lineItems,
    };
    const legacyPayload = {
      full_name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: JSON.stringify({
        order_code: order.id,
        customer,
        shipping_address: delivery,
        coupon_code: couponCode || null,
        items: lineItems,
      }),
      payment_method: customer.paymentMethod,
      status: order.status,
      subtotal,
      shipping,
      total,
    };

    const richInsert = await insertOrderPayload(richPayload);
    const richSchemaMissing = /column orders\.(order_code|customer_name|customer_email|customer_phone|shipping_address|coupon_code|items) does not exist/i.test(
      richInsert.responseText
    );
    const finalInsert = richInsert.ok
      ? richInsert
      : richSchemaMissing
        ? await insertOrderPayload(legacyPayload)
        : richInsert;

    if (!finalInsert.ok) {
      throw new Error(finalInsert.responseText || "Supabase order insert failed");
    }
    saveLocalOrder(order);
  } catch (error) {
    throw error instanceof Error ? error : new Error("Could not save order to Laoban backend.");
  }

  return order;
}

interface SupabaseOrderRow {
  id?: string;
  order_code?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  address?: string | Record<string, unknown>;
  shipping_address?: Record<string, string>;
  payment_method?: "COD" | "UPI";
  status?: LaobanOrder["status"];
  subtotal?: number;
  shipping?: number;
  total?: number;
  coupon_code?: string | null;
  items?: CartItem[];
  created_at?: string;
}

function parseLegacyAddress(value: SupabaseOrderRow["address"]) {
  if (!value) return {};
  if (typeof value === "object") return value as Record<string, unknown>;
  try {
    return JSON.parse(value) as Record<string, unknown>;
  } catch {
    return { shipping_address: { address: value } };
  }
}

function rowToOrder(row: SupabaseOrderRow): LaobanOrder {
  const legacy = parseLegacyAddress(row.address);
  const legacyCustomer = (legacy.customer || {}) as Partial<CheckoutCustomer>;
  const address = row.shipping_address || (legacy.shipping_address as Record<string, string> | undefined) || {};
  const legacyItems = Array.isArray(legacy.items) ? legacy.items : [];
  return {
    id: row.order_code || String(legacy.order_code || row.id || ""),
    customer: {
      name: row.customer_name || row.full_name || legacyCustomer.name || "",
      email: row.customer_email || row.email || legacyCustomer.email || "",
      phone: row.customer_phone || row.phone || legacyCustomer.phone || "",
      houseNumber: address.house_number || address.houseNumber || "",
      street: address.street || address.address || "",
      landmark: address.landmark || "",
      city: address.city || "",
      state: address.state || "",
      pincode: address.pincode || "",
      paymentMethod: row.payment_method || "COD",
    },
    items: Array.isArray(row.items) ? row.items : (legacyItems as CartItem[]),
    subtotal: Number(row.subtotal || 0),
    shipping: Number(row.shipping || 0),
    total: Number(row.total || 0),
    couponCode: row.coupon_code || undefined,
    status: row.status || "Processing",
    createdAt: row.created_at || new Date().toISOString(),
  };
}

export async function fetchLaobanOrders(): Promise<LaobanOrder[]> {
  const endpoint = `${SUPABASE_URL}/rest/v1/orders?select=*&order=created_at.desc&limit=100`;
  const response = await fetch(endpoint, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || "Could not load Supabase orders.");
  }

  const rows = (await response.json()) as SupabaseOrderRow[];
  return rows.map(rowToOrder);
}

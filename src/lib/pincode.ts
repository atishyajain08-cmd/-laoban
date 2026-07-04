// City/state autofill from a 6-digit Indian PIN code, via India Post's free
// public API. Laoban ships within India only.
export interface PincodeInfo {
  city: string;
  state: string;
}

export async function lookupPincode(pincode: string): Promise<PincodeInfo | null> {
  if (!/^\d{6}$/.test(pincode.trim())) return null;
  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${pincode.trim()}`);
    if (!res.ok) return null;
    const data = await res.json();
    const entry = Array.isArray(data) ? data[0] : null;
    const office = entry?.Status === "Success" ? entry?.PostOffice?.[0] : null;
    if (!office?.District || !office?.State) return null;
    return { city: String(office.District), state: String(office.State) };
  } catch {
    return null;
  }
}

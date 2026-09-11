const FIELD_LABELS = {
  fullName: "Name",
  phone: "Phone",
  address: "Street address",
  line1: "Address line 1",
  line2: "Address line 2",
  city: "City",
  postcode: "Postcode",
  postalCode: "Postal code",
  zip: "ZIP code",
  state: "State / region",
  country: "Country",
};

function humanizeKey(key) {
  if (!key || typeof key !== "string") return "Field";
  const spaced = key.replace(/([A-Z])/g, " $1").replace(/_/g, " ").trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/** Preferred display order for checkout form-shaped addresses. */
const PREFERRED_KEYS = [
  "fullName",
  "phone",
  "address",
  "line1",
  "line2",
  "city",
  "postcode",
  "postalCode",
  "zip",
  "state",
  "country",
];

/**
 * @param {Record<string, unknown> | null | undefined} addr
 * @returns {{ label: string, value: string }[]} lines for plain-text display (no JSON).
 */
export function shippingAddressEntries(addr) {
  if (!addr || typeof addr !== "object" || Array.isArray(addr)) return [];

  const used = new Set();
  /** @type {{ label: string, value: string }[]} */
  const out = [];

  for (const key of PREFERRED_KEYS) {
    const raw = addr[key];
    if (raw === undefined || raw === null) continue;
    const value = typeof raw === "string" ? raw.trim() : String(raw).trim();
    if (!value) continue;
    out.push({
      label: FIELD_LABELS[key] || humanizeKey(key),
      value,
    });
    used.add(key);
  }

  for (const [key, raw] of Object.entries(addr)) {
    if (used.has(key)) continue;
    if (raw === undefined || raw === null) continue;
    if (typeof raw === "object") continue;
    const value = typeof raw === "string" ? raw.trim() : String(raw).trim();
    if (!value) continue;
    out.push({
      label: FIELD_LABELS[key] || humanizeKey(key),
      value,
    });
  }

  return out;
}

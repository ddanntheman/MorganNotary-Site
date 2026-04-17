/**
 * Single source of truth for Name, Address, Phone, hours, and geo.
 * Anything that displays contact info MUST import from here.
 * Update once, everywhere changes. See scripts/validate-nap.mjs.
 */

export const NAP = {
  legalName: "Morgan Danner, Notary LLC",
  displayName: "Morgan Danner, Notary",
  shortName: "Morgan Danner Notary",
  tagline: "Richmond's boutique notary experience.",
  description:
    "Mobile notary public, loan signing agent, and apostille service based in Richmond, Virginia. Serving the Richmond metro evenings and weekends.",

  phone: import.meta.env.PUBLIC_BUSINESS_PHONE ?? "+18042156674",
  phoneDisplay: import.meta.env.PUBLIC_BUSINESS_PHONE_DISPLAY ?? "(804) 215-6674",
  email: import.meta.env.PUBLIC_BUSINESS_EMAIL ?? "morgan@morgannotary.com",
  commission: import.meta.env.PUBLIC_BUSINESS_COMMISSION ?? "8056572",

  address: {
    locality: "Richmond",
    region: "VA",
    country: "US",
  },

  geo: {
    latitude: 37.5407,
    longitude: -77.436,
  },

  serviceArea: {
    radiusMi: 50,
    cities: [
      "Richmond",
      "Midlothian",
      "Glen Allen",
      "Mechanicsville",
      "Chester",
      "Short Pump",
      "Ashland",
    ],
  },

  hours: {
    mondayFriday: { opens: "16:00", closes: "21:00", display: "4:00 pm – 9:00 pm" },
    saturday: { opens: "09:00", closes: "19:00", display: "9:00 am – 7:00 pm" },
    sunday: { opens: "10:00", closes: "17:00", display: "10:00 am – 5:00 pm" },
  },

  credentials: ["Richmond, VA", "Licensed", "Insured", "NNA Member"] as const,

  integrations: {
    formspreeClient: import.meta.env.PUBLIC_FORMSPREE_CLIENT_ID ?? "",
    formspreePartner: import.meta.env.PUBLIC_FORMSPREE_PARTNER_ID ?? "",
    squareApptUrl: import.meta.env.PUBLIC_SQUARE_APPT_URL ?? "",
    plausibleDomain: import.meta.env.PUBLIC_PLAUSIBLE_DOMAIN ?? "morgannotary.com",
    ga4Id: import.meta.env.PUBLIC_GA4_ID ?? "",
    turnstileSiteKey: import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ?? "",
  },
} as const;

export type NapType = typeof NAP;

/** Format +18045551234 → (804) 555-1234 */
export function formatPhone(e164: string): string {
  const digits = e164.replace(/\D/g, "");
  const n = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  if (n.length !== 10) return e164;
  return `(${n.slice(0, 3)}) ${n.slice(3, 6)}-${n.slice(6)}`;
}

export const TEL_HREF = `tel:${NAP.phone}`;
export const SMS_HREF = `sms:${NAP.phone}`;
export const MAILTO_HREF = `mailto:${NAP.email}`;

/**
 * Static service metadata for cross-linking. Pricing lives in the MDX
 * frontmatter; this is the shape for nav grids, related-service strips,
 * and the service-areas template.
 */

export type ServiceSlug =
  | "loan-signing"
  | "estate-trust"
  | "remote-online-notary"
  | "apostille"
  | "general-mobile-notary";

export interface ServiceMeta {
  slug: ServiceSlug;
  name: string;
  shortName: string;
  tagline: string;
  icon: string; // Lucide icon name
  order: number;
  b2b: boolean;
}

export const SERVICES: ServiceMeta[] = [
  {
    slug: "loan-signing",
    name: "Loan signing agent",
    shortName: "Loan signing",
    tagline: "Closing day handled. Every page. Every signature.",
    icon: "file-signature",
    order: 1,
    b2b: true,
  },
  {
    slug: "estate-trust",
    name: "Estate & trust signings",
    shortName: "Estate & trust",
    tagline: "Some signings matter more than others.",
    icon: "heart-handshake",
    order: 2,
    b2b: true,
  },
  {
    slug: "remote-online-notary",
    name: "Remote online notary (RON)",
    shortName: "Remote online",
    tagline: "Get it notarized. Don't go anywhere.",
    icon: "globe",
    order: 3,
    b2b: false,
  },
  {
    slug: "apostille",
    name: "Apostille & authentication",
    shortName: "Apostille",
    tagline: "International paperwork is confusing. I handle it.",
    icon: "scroll-text",
    order: 4,
    b2b: true,
  },
  {
    slug: "general-mobile-notary",
    name: "General mobile notary",
    shortName: "Mobile notary",
    tagline: "Whatever needs signing, I come to you.",
    icon: "user-round",
    order: 5,
    b2b: false,
  },
];

export function serviceBySlug(slug: string): ServiceMeta | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

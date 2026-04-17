/** Static area metadata — city + county + geo + CTA color. */

export type AreaSlug =
  | "richmond-va"
  | "midlothian-va"
  | "glen-allen-va"
  | "mechanicsville-va"
  | "chester-va"
  | "short-pump-va"
  | "ashland-va";

export interface AreaMeta {
  slug: AreaSlug;
  city: string;
  county: string;
  driveTime: string;
  latitude: number;
  longitude: number;
  ctaColor: "plum" | "emerald" | "navy" | "gold";
}

export const AREAS: AreaMeta[] = [
  {
    slug: "richmond-va",
    city: "Richmond",
    county: "Richmond City",
    driveTime: "0 min (base)",
    latitude: 37.5407,
    longitude: -77.436,
    ctaColor: "plum",
  },
  {
    slug: "midlothian-va",
    city: "Midlothian",
    county: "Chesterfield",
    driveTime: "~20 min",
    latitude: 37.5071,
    longitude: -77.6561,
    ctaColor: "navy",
  },
  {
    slug: "glen-allen-va",
    city: "Glen Allen",
    county: "Henrico",
    driveTime: "~15 min",
    latitude: 37.6652,
    longitude: -77.5147,
    ctaColor: "emerald",
  },
  {
    slug: "mechanicsville-va",
    city: "Mechanicsville",
    county: "Hanover",
    driveTime: "~20 min",
    latitude: 37.6087,
    longitude: -77.3733,
    ctaColor: "gold",
  },
  {
    slug: "chester-va",
    city: "Chester",
    county: "Chesterfield",
    driveTime: "~25 min",
    latitude: 37.3568,
    longitude: -77.4406,
    ctaColor: "plum",
  },
  {
    slug: "short-pump-va",
    city: "Short Pump",
    county: "Henrico",
    driveTime: "~20 min",
    latitude: 37.6529,
    longitude: -77.6144,
    ctaColor: "navy",
  },
  {
    slug: "ashland-va",
    city: "Ashland",
    county: "Hanover",
    driveTime: "~30 min",
    latitude: 37.7595,
    longitude: -77.4797,
    ctaColor: "emerald",
  },
];

export function areaBySlug(slug: string): AreaMeta | undefined {
  return AREAS.find((a) => a.slug === slug);
}

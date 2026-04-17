/** Site-wide constants used by SEO, sitemap, and BaseHead. */

export const SITE_URL = (import.meta.env.PUBLIC_SITE_URL ?? "https://morgannotary.com").replace(
  /\/$/,
  "",
);

export const SITE_TITLE_SUFFIX = " | Morgan Danner Notary";
export const SITE_DEFAULT_OG = `${SITE_URL}/og-default.jpg`;

/**
 * Absolute URL helper.
 * @param path must start with "/" (or be empty for the homepage).
 */
export function absUrl(path = "/"): string {
  const p = path === "" ? "/" : path;
  return `${SITE_URL}${p.startsWith("/") ? p : `/${p}`}`;
}

export const NAV_LINKS: { label: string; href: string }[] = [
  { label: "Services", href: "/#services" },
  { label: "Service areas", href: "/#service-areas" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

import { SITE_DEFAULT_OG, SITE_TITLE_SUFFIX, SITE_URL, absUrl } from "./site";

export interface Meta {
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
  noindex: boolean;
  type: "website" | "article" | "profile";
}

export interface BuildMetaInput {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  noindex?: boolean;
  type?: "website" | "article" | "profile";
  appendSuffix?: boolean;
}

export function buildMeta({
  title,
  description,
  path,
  ogImage,
  noindex = false,
  type = "website",
  appendSuffix = true,
}: BuildMetaInput): Meta {
  const fullTitle =
    appendSuffix && !title.endsWith(SITE_TITLE_SUFFIX.trim()) ? title + SITE_TITLE_SUFFIX : title;

  return {
    title: fullTitle,
    description,
    canonical: absUrl(path),
    ogImage: ogImage ?? SITE_DEFAULT_OG,
    noindex,
    type,
  };
}

export { SITE_URL, absUrl };

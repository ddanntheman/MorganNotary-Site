import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const seoSchema = z.object({
  title: z.string().min(20).max(75),
  description: z.string().min(80).max(180),
  keywords: z.array(z.string()).max(12).optional(),
  canonical: z.string().url().optional(),
  ogImage: z.string().optional(),
  noindex: z.boolean().default(false),
});

const ctaSchema = z.object({
  label: z.string(),
  href: z.string(),
  variant: z.enum(["primary", "secondary", "ghost", "dark"]).default("primary"),
});

const site = defineCollection({
  loader: glob({ base: "src/content/site", pattern: "**/*.mdx" }),
  schema: z.object({
    pageType: z.enum(["home", "about", "pricing", "contact", "faq", "peoples-rate", "legal"]),
    seo: seoSchema,
    greeting: z.string().optional(),
    h1: z.string(),
    subhead: z.string().optional(),
    heroImage: z.string().optional(),
    ctaPrimary: ctaSchema.optional(),
    ctaSecondary: ctaSchema.optional(),
    lastUpdated: z.coerce.date(),
  }),
});

const services = defineCollection({
  loader: glob({ base: "src/content/services", pattern: "**/*.mdx" }),
  schema: z.object({
    slug: z.string(),
    name: z.string(),
    shortName: z.string(),
    tagline: z.string(),
    icon: z.string(),
    order: z.number(),
    seo: seoSchema,
    h1: z.string(),
    subhead: z.string(),
    consumerCopy: z.string(),
    b2bCopy: z.string().optional(),
    pullQuote: z
      .object({
        text: z.string(),
        attribution: z.string().optional(),
      })
      .optional(),
    pricing: z
      .array(
        z.object({
          label: z.string(),
          price: z.string(),
          includes: z.string().optional(),
        }),
      )
      .optional(),
    process: z
      .array(
        z.object({
          step: z.number(),
          title: z.string(),
          detail: z.string(),
        }),
      )
      .optional(),
    platforms: z.array(z.string()).optional(),
    relatedFaqTopics: z.array(z.string()).default([]),
    relatedAreas: z.array(z.string()).default(["richmond-va"]),
    lastUpdated: z.coerce.date(),
  }),
});

const areas = defineCollection({
  loader: glob({ base: "src/content/areas", pattern: "**/*.mdx" }),
  schema: z.object({
    slug: z.string(),
    city: z.string(),
    state: z.string().default("VA"),
    county: z.string(),
    zipCodes: z.array(z.string()).min(1),
    latitude: z.number(),
    longitude: z.number(),
    population: z.number().optional(),
    seo: seoSchema,
    h1: z.string(),
    heroBlurb: z.string().min(80).max(280),
    localCallout: z.object({
      title: z.string(),
      body: z.string(),
      references: z.array(z.string()),
    }),
    driveTimeFromBase: z.string(),
    neighborhoodsCovered: z.array(z.string()),
    areaSpecificFaq: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        }),
      )
      .min(2)
      .max(4),
    testimonialHighlight: z.string().optional(),
    servicesFeatured: z
      .array(z.string())
      .default([
        "loan-signing",
        "estate-trust",
        "remote-online-notary",
        "apostille",
        "general-mobile-notary",
      ]),
    ctaColor: z.enum(["plum", "emerald", "navy", "gold"]).default("plum"),
    lastUpdated: z.coerce.date(),
  }),
});

const faqItems = defineCollection({
  loader: glob({ base: "src/content/faq-items", pattern: "**/*.mdx" }),
  schema: z.object({
    id: z.string(),
    question: z.string().min(10).max(180),
    answer: z.string().min(40),
    topics: z.array(
      z.enum([
        "general",
        "loan-signing",
        "estate-trust",
        "remote-online-notary",
        "apostille",
        "pricing",
        "scheduling",
        "peoples-rate",
        "mobile",
        "for-partners",
      ]),
    ),
    audience: z.enum(["consumer", "partner", "both"]).default("both"),
    order: z.number().default(100),
    featured: z.boolean().default(false),
    areas: z.array(z.string()).optional(),
    lastUpdated: z.coerce.date(),
  }),
});

const testimonials = defineCollection({
  loader: glob({ base: "src/content/testimonials", pattern: "**/*.mdx" }),
  schema: z.object({
    id: z.string(),
    quote: z.string().min(40).max(600),
    author: z.string(),
    city: z.string(),
    service: z.enum([
      "loan-signing",
      "estate-trust",
      "remote-online-notary",
      "apostille",
      "general",
      "partner",
    ]),
    rating: z.number().min(1).max(5).default(5),
    isComposite: z.boolean().default(true),
    consentOnFile: z.boolean().default(false),
    datePublished: z.coerce.date(),
  }),
});

const blog = defineCollection({
  loader: glob({ base: "src/content/blog", pattern: "**/*.mdx" }),
  schema: z.object({
    title: z.string().min(20).max(80),
    description: z.string().min(80).max(180),
    slug: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default("Morgan Danner"),
    heroImage: z.string().optional(),
    heroAlt: z.string().optional(),
    topics: z.array(z.string()),
    relatedServices: z.array(z.string()).default([]),
    relatedAreas: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    readingTime: z.string().optional(),
  }),
});

export const collections = { site, services, areas, faqItems, testimonials, blog };

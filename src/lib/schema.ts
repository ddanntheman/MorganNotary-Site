import { NAP } from "./nap";
import { SITE_URL } from "./site";

const BUSINESS_ID = `${SITE_URL}/#business`;
const PERSON_ID = `${SITE_URL}/#person`;

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": BUSINESS_ID,
    name: NAP.legalName,
    alternateName: NAP.shortName,
    description: NAP.description,
    url: SITE_URL,
    telephone: NAP.phone,
    email: NAP.email,
    image: `${SITE_URL}/images/morgan-headshot.jpg`,
    logo: `${SITE_URL}/images/logo.png`,
    priceRange: "$$",
    currenciesAccepted: "USD",
    paymentAccepted: ["Cash", "Credit Card", "Debit Card", "Check", "Zelle", "Venmo"],
    address: {
      "@type": "PostalAddress",
      addressLocality: NAP.address.locality,
      addressRegion: NAP.address.region,
      addressCountry: NAP.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: NAP.geo.latitude,
      longitude: NAP.geo.longitude,
    },
    areaServed: [
      ...NAP.serviceArea.cities.map((c) => ({
        "@type": "City",
        name: c,
        addressRegion: "VA",
      })),
      { "@type": "State", name: "Virginia" },
    ],
    serviceArea: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: NAP.geo.latitude,
        longitude: NAP.geo.longitude,
      },
      geoRadius: `${NAP.serviceArea.radiusMi} mi`,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: NAP.hours.mondayFriday.opens,
        closes: NAP.hours.mondayFriday.closes,
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: NAP.hours.saturday.opens,
        closes: NAP.hours.saturday.closes,
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: NAP.hours.sunday.opens,
        closes: NAP.hours.sunday.closes,
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Notary services",
      itemListElement: [
        { name: "Loan signing", price: "150.00" },
        { name: "Estate & trust signings", price: "100.00" },
        { name: "Remote online notarization", price: "35.00" },
        { name: "Apostille", price: "85.00" },
        { name: "General mobile notary", price: "35.00" },
      ].map(({ name, price }) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name },
        price,
        priceCurrency: "USD",
      })),
    },
    knowsAbout: [
      "Notary public",
      "Loan signing",
      "Remote online notarization",
      "Apostille",
      "Estate planning document signings",
    ],
    founder: { "@id": PERSON_ID },
    employee: { "@id": PERSON_ID },
  } as const;
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: "Morgan Danner",
    jobTitle: "Notary Public & Signing Agent",
    description:
      "Virginia-commissioned mobile notary based in Richmond, Virginia. NNA Certified Notary Signing Agent. Specializes in estate, trust, and loan signing appointments.",
    image: `${SITE_URL}/images/morgan-headshot.jpg`,
    url: `${SITE_URL}/about`,
    email: NAP.email,
    telephone: NAP.phone,
    worksFor: { "@id": BUSINESS_ID },
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        name: "Virginia Notary Public Commission",
        credentialCategory: "License",
        recognizedBy: { "@type": "GovernmentOrganization", name: "Commonwealth of Virginia" },
      },
      {
        "@type": "EducationalOccupationalCredential",
        name: "NNA Certified Notary Signing Agent",
        credentialCategory: "Certification",
        recognizedBy: { "@type": "Organization", name: "National Notary Association" },
      },
    ],
    knowsLanguage: ["en"],
  } as const;
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: NAP.legalName,
    alternateName: NAP.shortName,
    url: SITE_URL,
    publisher: { "@id": BUSINESS_ID },
    inLanguage: "en-US",
  } as const;
}

export function breadcrumbJsonLd(crumbs: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  } as const;
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.slice(0, 10).map((i) => ({
      "@type": "Question",
      name: i.question,
      acceptedAnswer: { "@type": "Answer", text: i.answer },
    })),
  } as const;
}

export function serviceJsonLd(input: {
  name: string;
  description: string;
  url: string;
  price?: string;
  areaServed?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: input.name,
    name: input.name,
    description: input.description,
    url: input.url,
    provider: { "@id": BUSINESS_ID },
    areaServed: (input.areaServed ?? NAP.serviceArea.cities).map((c) => ({
      "@type": "City",
      name: c,
      addressRegion: "VA",
    })),
    ...(input.price && {
      offers: {
        "@type": "Offer",
        price: input.price,
        priceCurrency: "USD",
      },
    }),
  } as const;
}

export function articleJsonLd(input: {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    url: input.url,
    image: input.image ?? `${SITE_URL}/og-default.jpg`,
    author: { "@id": PERSON_ID },
    publisher: { "@id": BUSINESS_ID },
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    mainEntityOfPage: input.url,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".prose-brand p"],
    },
  } as const;
}

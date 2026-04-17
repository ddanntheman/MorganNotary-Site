import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
// @ts-check
import { defineConfig } from "astro/config";

const siteUrl = process.env.PUBLIC_SITE_URL ?? "https://morgannotary.com";

export default defineConfig({
  site: siteUrl,
  trailingSlash: "never",
  output: "static",
  integrations: [
    mdx(),
    react(),
    icon({
      iconDir: "src/icons",
      include: {
        lucide: [
          "phone",
          "message-circle",
          "calendar",
          "map-pin",
          "shield-check",
          "clock",
          "mail",
          "arrow-right",
          "check",
          "chevron-down",
          "chevron-right",
          "printer",
          "user-round",
          "heart-handshake",
          "globe",
          "file-signature",
          "file-pen",
          "scroll-text",
          "star",
          "menu",
          "x",
        ],
      },
    }),
    sitemap({
      filter: (page) => !page.includes("/404"),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  server: {
    host: true,
    port: 4321,
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: "hover",
  },
  build: {
    inlineStylesheets: "auto",
    assets: "_assets",
  },
});

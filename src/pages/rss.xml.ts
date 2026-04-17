import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import { NAP } from "@lib/nap";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const posts = await getCollection("blog", (p) => !p.data.draft);
  return rss({
    title: `${NAP.legalName} — Blog`,
    description: "Field notes and guides from Morgan Danner — Richmond's boutique mobile notary.",
    site: context.site ?? "https://morgannotary.com",
    items: posts
      .sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime())
      .map((post) => ({
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.publishDate,
        link: `/blog/${post.data.slug}`,
      })),
    customData: "<language>en-us</language>",
  });
}

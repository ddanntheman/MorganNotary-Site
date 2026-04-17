#!/usr/bin/env node
/**
 * check-upl.mjs
 *
 * Virginia Code § 54.1-3900 prohibits non-attorneys from giving legal advice,
 * explaining documents, or interpreting terms. To keep the site compliant,
 * content/copy should never tell a user we will "explain / interpret / advise
 * on" their documents.
 */

import { readFile, readdir } from "node:fs/promises";
import { extname, join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;

const FORBIDDEN = [
  /\b(?:I|we)\s+(?:will|can)\s+explain\b/gi,
  /\b(?:I|we)\s+(?:will|can)\s+interpret\b/gi,
  /\b(?:I|we)\s+(?:will|can)\s+advise\b/gi,
  /\bgive\s+you\s+legal\s+advice\b/gi,
];

const SKIP_PATH_PATTERNS = [
  /\/content\/testimonials\//,
  /\/content\/site\/legal\//,
  /\/scripts\//,
  /\/node_modules\//,
  /\/dist\//,
  /\/\.astro\//,
  /\/docs\//,
];

async function walk(dir, acc = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name.startsWith(".") && e.name !== ".github") continue;
    if (["node_modules", ".astro", "dist", ".vercel", ".git"].includes(e.name)) continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) await walk(full, acc);
    else if ([".mdx", ".md", ".astro"].includes(extname(e.name))) {
      acc.push(full);
    }
  }
  return acc;
}

async function main() {
  const files = await walk(ROOT);
  const violations = [];

  for (const file of files) {
    const rel = relative(ROOT, file);
    if (SKIP_PATH_PATTERNS.some((p) => p.test(rel))) continue;

    const text = await readFile(file, "utf8");
    for (const pattern of FORBIDDEN) {
      const matches = text.match(pattern);
      if (matches) {
        for (const m of matches) {
          violations.push({ file: rel, match: m });
        }
      }
    }
  }

  if (violations.length > 0) {
    console.error("\x1b[31m[upl] Potential UPL violations found (Va. Code § 54.1-3900):\x1b[0m");
    for (const v of violations) {
      console.error(`  - ${v.file} :: "${v.match}"`);
    }
    console.error(
      "\n  A notary who is not a licensed attorney may not explain, interpret, or advise on legal documents.",
    );
    process.exit(1);
  }

  console.log("[upl] ok, no unauthorized-practice copy detected.");
}

main().catch((err) => {
  console.error("[upl] error:", err);
  process.exit(1);
});

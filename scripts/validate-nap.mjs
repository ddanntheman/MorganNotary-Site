#!/usr/bin/env node
/**
 * validate-nap.mjs
 *
 * Ensures that the site's Name / Address / Phone information is referenced
 * only via the shared @lib/nap module, never hard-coded into components,
 * pages, or content. A mismatch here is the #1 source of local-SEO damage,
 * so we fail the build if anyone drops a raw phone number into a component.
 */

import { readFile, readdir } from "node:fs/promises";
import { extname, join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const PHONE_PATTERN = /\(?\s*804\s*\)?[-.\s]?215[-.\s]?6674/g;

const IGNORED_DIRS = new Set(["node_modules", ".astro", "dist", ".vercel", ".git", "public"]);

const ALLOWED_FILES = new Set(["src/lib/nap.ts", "src/components/forms/ContactForm.tsx"]);

async function walk(dir, acc = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name.startsWith(".") && e.name !== ".github") continue;
    if (IGNORED_DIRS.has(e.name)) continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) await walk(full, acc);
    else if ([".ts", ".tsx", ".astro", ".js", ".mjs"].includes(extname(e.name))) {
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
    if (ALLOWED_FILES.has(rel)) continue;
    const text = await readFile(file, "utf8");
    if (PHONE_PATTERN.test(text)) {
      violations.push(rel);
    }
  }

  if (violations.length > 0) {
    console.error("\x1b[31m[nap] Hard-coded phone numbers found in:\x1b[0m");
    for (const v of violations) console.error("  -", v);
    console.error("\n  Import phone/email/address from @lib/nap to keep NAP consistent.");
    process.exit(1);
  }

  console.log("[nap] ok, all NAP references route through @lib/nap.");
}

main().catch((err) => {
  console.error("[nap] error:", err);
  process.exit(1);
});

import { readFileSync } from "node:fs";
import path from "node:path";

type ManifestImage = { path: string; kind: "product" | "editor" };
type ManifestProduct = { slug: string; images: ManifestImage[] };
type Manifest = { products: ManifestProduct[] };

const PLACEHOLDER = "/products/lti/placeholder.svg";

let cache: Map<string, string> | null = null;

function load(): Map<string, string> {
  if (cache) return cache;
  const file = path.join(process.cwd(), "public/products/_manifest.json");
  const manifest = JSON.parse(readFileSync(file, "utf-8")) as Manifest;
  cache = new Map();
  for (const p of manifest.products) {
    const primary = p.images.find((i) => i.kind === "product") ?? p.images[0];
    if (primary) cache.set(p.slug.toLowerCase(), primary.path);
  }
  return cache;
}

export function resolveProductImage(slug: string): string {
  return load().get(slug.toLowerCase()) ?? PLACEHOLDER;
}

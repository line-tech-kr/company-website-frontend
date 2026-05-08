#!/usr/bin/env python3
"""
Remove background from product photos using rembg (ML-based matting).

Unlike the threshold/flood-fill approach, this uses a trained model that
understands "this is a product" vs "this is backdrop" — chrome highlights and
white reflections inside the product silhouette stay intact.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

from rembg import new_session, remove


# birefnet-general is the highest-quality model available in rembg as of writing —
# it preserves chrome and reflective surfaces that u2net/isnet drop. ~1GB model,
# ~15s per image on CPU. Trade quality for speed by switching to "isnet-general-use"
# (~170MB) or "u2netp" (~5MB) if needed.
MODEL = "birefnet-general"

REPO_ROOT = Path(__file__).resolve().parent.parent
PRODUCTS_DIR = REPO_ROOT / "public" / "products"
SKU_PATTERN = re.compile(r"[a-z0-9][a-z0-9_-]*")
SOURCE_EXTENSIONS = ("jpg", "jpeg", "png", "gif")


def resolve_source(sku: str) -> Path | None:
    for ext in SOURCE_EXTENSIONS:
        candidate = PRODUCTS_DIR / sku / f"product-1.{ext}"
        if candidate.exists():
            return candidate
    return None


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(description="Remove background from product photos.")
    parser.add_argument("skus", nargs="+", help="SKU(s) to process")
    parser.add_argument("--input", help="Explicit input image path (only valid with a single SKU)")
    parser.add_argument("--output", help="Explicit output filename within the SKU dir (default: cutout.png)")
    args = parser.parse_args(argv[1:])

    if args.input and len(args.skus) > 1:
        print("--input is only valid with a single SKU", file=sys.stderr)
        return 1

    jobs: list[tuple[str, Path, Path]] = []
    out_name = args.output or "cutout.png"
    for sku in args.skus:
        if not SKU_PATTERN.fullmatch(sku):
            print(f"  skip {sku}: invalid SKU (expected [a-z0-9_-]+)", file=sys.stderr)
            continue
        if args.input:
            src = Path(args.input)
            if not src.exists():
                print(f"  skip {sku}: --input path does not exist: {src}", file=sys.stderr)
                continue
        else:
            src = resolve_source(sku)
            if src is None:
                print(f"  skip {sku}: no product-1 image found", file=sys.stderr)
                continue
        dst_dir = PRODUCTS_DIR / sku
        dst_dir.mkdir(parents=True, exist_ok=True)
        dst = dst_dir / out_name
        jobs.append((sku, src, dst))

    if not jobs:
        print("nothing to do — no valid SKUs resolved", file=sys.stderr)
        return 1

    print(f"loading model: {MODEL}")
    session = new_session(MODEL)

    for sku, src, dst in jobs:
        try:
            with open(src, "rb") as f:
                input_bytes = f.read()
            output_bytes = remove(input_bytes, session=session)
            dst.write_bytes(output_bytes)
            print(f"  {sku}: {src} -> {dst.name}")
        except Exception as e:
            print(f"  fail {sku}: {e}", file=sys.stderr)
            continue

    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))

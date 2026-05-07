#!/usr/bin/env python3
"""
Remove background from product photos using rembg (ML-based matting).

Unlike the threshold/flood-fill approach, this uses a trained model that
understands "this is a product" vs "this is backdrop" — chrome highlights and
white reflections inside the product silhouette stay intact.
"""

from __future__ import annotations

import sys
from pathlib import Path

from rembg import new_session, remove


# birefnet-general is the highest-quality model available in rembg as of writing —
# it preserves chrome and reflective surfaces that u2net/isnet drop. ~1GB model,
# ~15s per image on CPU. Trade quality for speed by switching to "isnet-general-use"
# (~170MB) or "u2netp" (~5MB) if needed.
MODEL = "birefnet-general"


def main(argv: list[str]) -> int:
    if len(argv) < 2:
        print("usage: remove-bg-ml.py <sku> [<sku> ...]", file=sys.stderr)
        return 1

    cwd = Path.cwd()
    products_dir = cwd / "public" / "products"

    print(f"loading model: {MODEL}")
    session = new_session(MODEL)

    for sku in argv[1:]:
        src = None
        for ext in ("jpg", "jpeg", "png", "gif"):
            candidate = products_dir / sku / f"product-1.{ext}"
            if candidate.exists():
                src = candidate
                break
        if src is None:
            print(f"  skip {sku}: no product-1 image found", file=sys.stderr)
            continue

        with open(src, "rb") as f:
            input_bytes = f.read()
        output_bytes = remove(input_bytes, session=session)
        dst = products_dir / sku / "cutout.png"
        dst.write_bytes(output_bytes)
        print(f"  {sku}: {src.name} -> cutout.png")

    return 0




if __name__ == "__main__":
    raise SystemExit(main(sys.argv))

# `remove-bg-ml.py` — product photo cutout tool

Removes the white studio backdrop from product photos and writes the result to
`public/products/<sku>/cutout.png`. Used to generate the 39 cutouts shipped in
PR #155; kept in the repo so future SKUs can be processed the same way.

## Quick reference

```bash
# one product
python3 scripts/remove-bg-ml.py md100m

# multiple
python3 scripts/remove-bg-ml.py md100m md400c ms3030va
```

The script reads `public/products/<sku>/product-1.{jpg,jpeg,png,gif}` and
writes `public/products/<sku>/cutout.png`.

## Setup (only when running the script)

The dependencies and the model file are NOT kept around between runs — they're
installed on demand and can be deleted afterward.

```bash
pip3 install --only-binary=:all: rembg onnxruntime
```

The `--only-binary=:all:` flag avoids a source-build failure on `llvmlite`
(seen on macOS / Python 3.10 — needs prebuilt wheels).

The first run downloads the model (~1 GB) to `~/.u2net/birefnet-general.onnx`.
After that runs are local-only.

## Cleanup after running

```bash
rm -rf ~/.u2net
pip3 uninstall -y rembg onnxruntime opencv-python-headless scikit-image numba pymatting
```

## Model choice — what worked, what didn't

Tried in order, kept the last:

| Model               | Size    | Result                                                |
| ------------------- | ------- | ----------------------------------------------------- |
| `u2netp`            | ~5 MB   | Dropped chrome fittings entirely on multiple products |
| `u2net`             | ~170 MB | Better silhouette, still lost some chrome             |
| `isnet-general-use` | ~170 MB | Better edges, but reflective surfaces still vanished  |
| `birefnet-general`  | ~1 GB   | ✅ Preserves chrome + reflections cleanly             |

Switching is a one-line edit in `remove-bg-ml.py` (`MODEL = "..."`). If a
future product photo trips up `birefnet-general`, the obvious fallback is the
hybrid approach (ML mask UNION not-pure-white threshold) — not implemented
because BiRefNet handled all 39 of the existing catalog.

## Pre-rembg attempts (rejected)

For the record, before reaching for an ML model:

1. **Hand-drawn SVG line art** — author wrote SVG paths from photos directly.
   Output was too iconic, lost the product's identity. Files removed.
2. **Threshold + corner flood-fill** (`scripts/remove-bg.py` — also removed) —
   pure-white pixels reachable from photo corners get zeroed. Cheap, no
   dependencies, but chrome and the white backdrop are mathematically the
   same colour, so chrome got cut out too. Hit a hard quality ceiling.

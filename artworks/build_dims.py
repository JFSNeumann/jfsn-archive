#!/usr/bin/env python3
"""
Read pixel dimensions from all thumbnail AVIFs and write dims.json.

Run this whenever new artworks are added to artworks/thumbs/:

    python3 artworks/build_dims.py

Output: config/dims.json — read by build_catalog.py and tools/utils/verify.py
for CSS Grid masonry span calculation.

Format: {"art0001": [400, 800], "art0002": [400, 535], ...}
All thumbs have width=400; height varies by original aspect ratio.
"""

import json, re, subprocess
from pathlib import Path

THUMBS = Path(__file__).parent / "thumbs"
OUT    = Path(__file__).parent.parent / "config" / "dims.json"


def get_dims(path: Path):
    """Return (width, height) for an image file using macOS sips."""
    result = subprocess.run(
        ["sips", "-g", "pixelWidth", "-g", "pixelHeight", str(path)],
        capture_output=True, text=True,
    )
    w = h = None
    for line in result.stdout.splitlines():
        m = re.search(r"pixelWidth:\s*(\d+)", line)
        if m: w = int(m.group(1))
        m = re.search(r"pixelHeight:\s*(\d+)", line)
        if m: h = int(m.group(1))
    return (w, h) if w and h else None


dims = {}
skipped = []
thumbs = sorted(THUMBS.glob("art*.avif"))
print(f"Reading dimensions for {len(thumbs)} thumbnails…")

for i, p in enumerate(thumbs):
    result = get_dims(p)
    if result:
        dims[p.stem] = list(result)
    else:
        skipped.append(p.name)
    if (i + 1) % 200 == 0:
        print(f"  {i + 1}/{len(thumbs)}")

OUT.write_text(json.dumps(dims, separators=(",", ":")))
print(f"dims.json — {len(dims)} entries ({OUT.stat().st_size // 1024} KB)")

# Aspect ratio stats
ratios = [h / w for w, h in dims.values()]
portrait  = sum(1 for r in ratios if r > 1.05)
landscape = sum(1 for r in ratios if r < 0.95)
square    = len(ratios) - portrait - landscape
print(f"Portrait: {portrait}  Landscape: {landscape}  Square: {square}")
print(f"Ratio range: {min(ratios):.2f} – {max(ratios):.2f}")

if skipped:
    print(f"Skipped {len(skipped)}: {skipped[:5]}")

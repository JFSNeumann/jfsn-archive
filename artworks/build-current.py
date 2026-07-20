#!/usr/bin/env python3
"""
Build config/current.json from catalog.json for artwork.html.
Transforms full catalog format into compressed format used by The Current page.
Sorted by year (descending) to show newest works first.

Run after build_catalog.py to regenerate current.json with new artworks:
    python3 artworks/build-current.py
"""

import json
from pathlib import Path

ROOT = Path(__file__).parent.parent
OUT = ROOT / "config" / "current.json"
CATALOG = ROOT / "config" / "catalog.json"
DIMS = ROOT / "config" / "dims.json"

# Load catalog
with open(CATALOG) as f:
    records = json.load(f)

# Load dimensions if available
dims_data = {}
if DIMS.exists():
    with open(DIMS) as f:
        dims_data = json.load(f)

# Transform to current.json format
current = []
for rec in records:
    art_id = rec.get('file', '').replace('.avif', '')
    if not art_id:
        continue

    # Get dimensions (stored as [width, height])
    dims = dims_data.get(art_id, [400, 600])
    w = dims[0] if isinstance(dims, list) and len(dims) > 0 else 400
    h = dims[1] if isinstance(dims, list) and len(dims) > 1 else 600

    # Build compressed record
    palette = rec.get('palette', [])
    color = palette[0] if palette and len(palette) > 0 else None

    item = {
        'i': art_id,                                    # artwork ID
        'y': rec.get('year'),                          # year (int)
        'c': color,                                    # color (first palette color)
        't': rec.get('title'),                         # title
        'yd': rec.get('year_display'),                # year_display (e.g. "1970s (est.)")
        'm': rec.get('work_type'),                    # medium/work_type
        'o': rec.get('orientation'),                 # orientation (v/h/s)
        'x': 0,                                       # sort order (unused, kept for compat)
        'w': w,                                       # width
        'h': h,                                       # height
    }

    # Add optional fields
    if rec.get('featured'):
        item['f'] = 1
    if rec.get('has_back'):
        item['b'] = 1  # back-side indicator for reverse image support

    current.append(item)

# Sort by year descending (newest first), then by ID descending
current.sort(key=lambda r: (-(r.get('y') or 0), -(int(r['i'].replace('art', '')) or 0)))

# Write JSON
OUT.write_text(json.dumps(current, separators=(',', ':')))
print(f"config/current.json — {len(current)} records ({OUT.stat().st_size // 1024} KB)")

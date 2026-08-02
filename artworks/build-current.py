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

# Color name to hex code mapping
COLOR_MAP = {
    "red": "#CC0000",
    "vermilion": "#E34234",
    "magenta": "#FF00FF",
    "pink": "#FF69B4",
    "orange": "#FF6600",
    "yellow": "#FFFF00",
    "ochre": "#CC7722",
    "gold": "#FFD700",
    "silver": "#C0C0C0",
    "iridescent": "#E0B0FF",
    "white": "#FFFFFF",
    "ivory": "#FFFFF0",
    "black": "#000000",
    "grey": "#808080",
    "brown": "#8B4513",
    "green": "#00AA00",
    "turquoise": "#40E0D0",
    "blue": "#0066FF",
    "ultramarine": "#120078",
    "purple": "#800080"
}

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
    color_name = palette[0] if palette and len(palette) > 0 else None
    color_hex = COLOR_MAP.get(color_name, "#808080") if color_name else "#808080"

    item = {
        'i': art_id,                                    # artwork ID
        'y': rec.get('year'),                          # year (int)
        'c': color_hex,                                # color (first palette color as hex)
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

    # Audio: the artist's own recorded voice — the least reproducible material
    # in the archive. This was originally hand-written straight into
    # config/current.json (commit f40a5398), which this script overwrites, so
    # the first regeneration silently erased it. Source of truth is now the
    # sidecar, like every other authored field.
    if rec.get('audio'):
        item['audio'] = rec['audio']
        if rec.get('audio_title'):
            item['audio_title'] = rec['audio_title']

    current.append(item)

# Sort by year descending (newest first), then by ID descending
current.sort(key=lambda r: (-(r.get('y') or 0), -(int(r['i'].replace('art', '')) or 0)))

# Write JSON
OUT.write_text(json.dumps(current, separators=(',', ':')))
print(f"config/current.json — {len(current)} records ({OUT.stat().st_size // 1024} KB)")

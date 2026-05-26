#!/usr/bin/env python3
"""make_colors.py — Extract dominant color from each artwork thumbnail.

Outputs /JFSN/colors.json: { "art0001": "#hexcolor", ... }

These colors can be used as per-thumbnail background placeholders, so
the page shows a colored box instead of a gray box while images load.

Requirements:
  pip install Pillow pillow-avif-plugin

Usage (from JFSN project root):
  python3 artworks/make_colors.py

After running, upload colors.json to the server alongside the JSON files.
"""

import json, pathlib, sys
from collections import Counter

try:
    import pillow_avif  # noqa — registers AVIF decoder
    from PIL import Image
except ImportError:
    print("Missing dependencies. Run:  pip install Pillow pillow-avif-plugin")
    sys.exit(1)

ROOT    = pathlib.Path(__file__).parent          # artworks/
THUMBS  = ROOT / 'thumbs'
OUT     = ROOT.parent / 'colors.json'           # JFSN/colors.json

BUCKET  = 5   # color quantization bucket size (power of 2 alignment)
RESIZE  = 64  # resize to NxN before analysis — fast and still accurate


def dominant_color(path: pathlib.Path) -> str:
    """Return the most visually dominant hex color from a thumbnail.

    Excludes extreme near-white (boring paper/background) and near-black
    (shadows / literal dark fills) so the returned color is more interesting.
    """
    with Image.open(path) as img:
        img = img.convert('RGB').resize((RESIZE, RESIZE), Image.LANCZOS)

    pixels = list(img.getdata())

    # Quantize into coarse buckets so similar shades cluster together
    def bucket(v):
        step = 256 // (256 // BUCKET)
        return (v // step) * step

    bucketed = [(bucket(r), bucket(g), bucket(b)) for r, g, b in pixels]

    # Filter extreme whites and blacks; they dominate but aren't interesting
    filtered = [
        p for p in bucketed
        if not (all(c > 210 for c in p))    # near-white
        and not (all(c < 40 for c in p))    # near-black
    ]

    pool = filtered if filtered else bucketed
    (r, g, b), _ = Counter(pool).most_common(1)[0]
    return f'#{r:02x}{g:02x}{b:02x}'


def main():
    avifs = sorted(THUMBS.glob('*.avif'))
    if not avifs:
        print(f'No thumbnails found in {THUMBS}')
        sys.exit(1)

    total  = len(avifs)
    colors = {}
    errors = 0

    print(f'Processing {total} thumbnails…')
    for i, path in enumerate(avifs, 1):
        art_id = path.stem
        try:
            colors[art_id] = dominant_color(path)
        except Exception as exc:
            print(f'  {art_id}: error — {exc}', file=sys.stderr)
            colors[art_id] = '#1a1a1a'   # dark fallback
            errors += 1
        if i % 200 == 0 or i == total:
            print(f'  {i}/{total} …')

    OUT.write_text(json.dumps(colors, indent=None, separators=(',', ':')))
    print(f'\nDone. {len(colors)} colors → {OUT}')
    if errors:
        print(f'  ({errors} errors — check stderr above)')


if __name__ == '__main__':
    main()

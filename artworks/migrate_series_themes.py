#!/usr/bin/env python3
"""
One-time migration: update existing 140 sidecars to match new vocab.
  - Remove retired themes: Aviation, Reliquaries, Totems, Guernica (theme)
  - Remap retired series: XXIII → Guernica, Squadron → Guernica
Run: python3 artworks/migrate_series_themes.py --run
"""
import json, sys
from pathlib import Path

DRY = "--run" not in sys.argv
ROOT = Path(__file__).parent.parent
FULL = ROOT / "artworks" / "full"

RETIRED_THEMES = {"Aviation", "Reliquaries", "Totems", "Guernica"}
SERIES_REMAP   = {"XXIII": "Guernica", "Squadron": "Guernica"}

changed = 0
for path in sorted(FULL.glob("*.json")):
    rec = json.loads(path.read_text())
    dirty = False

    # Remap series
    s = rec.get("series")
    if s in SERIES_REMAP:
        print(f"  {path.name}: series {s!r} → 'Guernica'")
        rec["series"] = "Guernica"
        dirty = True

    # Remove retired themes
    themes = rec.get("themes", [])
    new_themes = [t for t in themes if t not in RETIRED_THEMES]
    if new_themes != themes:
        removed = [t for t in themes if t in RETIRED_THEMES]
        print(f"  {path.name}: removed themes {removed}")
        rec["themes"] = new_themes
        dirty = True

    if dirty:
        changed += 1
        if not DRY:
            path.write_text(json.dumps(rec, indent=2, sort_keys=True) + "\n")

print(f"\n{'DRY RUN — ' if DRY else ''}{'Updated' if not DRY else 'Would update'} {changed} sidecars.")
if DRY and changed:
    print("Run with --run to apply.")

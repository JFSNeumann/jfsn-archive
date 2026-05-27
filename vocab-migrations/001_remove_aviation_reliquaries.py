#!/usr/bin/env python3
"""
Migration 001 — Remove retired themes and remap retired series.

Changes applied to existing JSON sidecars:
  - Removed themes: Aviation, Reliquaries, Totems, Guernica (theme — moved to series only)
  - Series remapped: XXIII → Guernica, Squadron → Guernica

Background: In May 2026 the vocabulary was consolidated from 14 themes + 3 series
down to 10 themes + 1 named series (XXXIII · Guernica). Aviation, Reliquaries, and
Totems were retired as standalone series; XXIII and Squadron works were merged into
the Guernica named series. The Guernica theme was removed to avoid confusion with
the Guernica named series.

Run:
    python3 vocab-migrations/001_remove_aviation_reliquaries.py           # dry-run
    python3 vocab-migrations/001_remove_aviation_reliquaries.py --run     # apply

Status: ALREADY APPLIED (2026-05-27) — run dry-run to verify all clear.
"""
import json, sys
from pathlib import Path

DRY  = "--run" not in sys.argv
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
    themes     = rec.get("themes", [])
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

if changed == 0:
    print("All clear — no sidecars need updating.")
else:
    print(f"\n{'DRY RUN — ' if DRY else ''}{'Updated' if not DRY else 'Would update'} {changed} sidecars.")
    if DRY and changed:
        print("Run with --run to apply.")

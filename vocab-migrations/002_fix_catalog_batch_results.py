#!/usr/bin/env python3
"""
Migration 002 — Fix errors introduced by the May 2026 catalog batch.

Issues found via validate_catalog.py after the 939-image AI batch:
  1. Model added 'Guernica' as a theme (31 records) — should be series only.
     Fix: move to series='Guernica' when series is null; remove from themes.
  2. 'multicolor' / 'multicolored' in palette (3 records) — not in controlled vocab.
     Fix: remove these terms (palette still has real color terms from the same record).
  3. 'torso' in motifs (1 record) — not in controlled vocab.
     Fix: remove (the motif is not in the vocabulary; use 'photographic-face' if applicable).

NOTE: 'cassette', 'keyboard', 'tape' motif errors were fixed by adding those terms
      to VALID_MOTIFS in artist-config.json — no sidecar changes needed for those.

Run:
    python3 vocab-migrations/002_fix_catalog_batch_results.py           # dry-run
    python3 vocab-migrations/002_fix_catalog_batch_results.py --run     # apply
"""
import json, sys
from pathlib import Path

DRY  = "--run" not in sys.argv
ROOT = Path(__file__).parent.parent
FULL = ROOT / "artworks" / "full"

INVALID_PALETTE = {"multicolor", "multicolored"}
INVALID_MOTIFS  = {"torso"}

changed = 0
for path in sorted(FULL.glob("art*.json")):
    rec   = json.loads(path.read_text())
    dirty = False

    # 1. Guernica theme → series
    themes = rec.get("themes", [])
    if "Guernica" in themes:
        new_themes = [t for t in themes if t != "Guernica"]
        print(f"  {path.name}: removed theme 'Guernica'", end="")
        if not rec.get("series"):
            rec["series"] = "Guernica"
            print(" → series = 'Guernica'", end="")
        print()
        rec["themes"] = new_themes
        dirty = True

    # 2. Out-of-vocab palette terms
    palette = rec.get("palette", [])
    bad_pal = [p for p in palette if p in INVALID_PALETTE]
    if bad_pal:
        rec["palette"] = [p for p in palette if p not in INVALID_PALETTE]
        print(f"  {path.name}: removed palette {bad_pal}")
        dirty = True

    # 3. Out-of-vocab motif terms
    motifs = rec.get("motifs", [])
    bad_mot = [m for m in motifs if m in INVALID_MOTIFS]
    if bad_mot:
        rec["motifs"] = [m for m in motifs if m not in INVALID_MOTIFS]
        print(f"  {path.name}: removed motifs {bad_mot}")
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

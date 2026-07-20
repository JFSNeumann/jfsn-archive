#!/usr/bin/env python3
# ─────────────────────────────────────────────────────────────────────────────
# scaffold_sidecar.py — create empty, schema-correct metadata sidecars.
#
#   python3 scripts/scaffold_sidecar.py art1085 [art1086 ...]
#   python3 scripts/scaffold_sidecar.py 1085 1086          # bare numbers ok
#   python3 scripts/scaffold_sidecar.py art1085 --force    # overwrite existing
#
# Phase 2.1 of the Catalog Intake workflow.
#
# It removes ONE piece of repetitive mechanics: hand-creating a new
# artworks/full/artNNNN.json sidecar with the right keys, the right `file`
# value, and the right schema_version. It writes STRUCTURE only.
#
#     Automate execution. Never automate authorship.
#     The scaffolder creates structure. The curator creates history.
#
# Every curator-authored field is present but intentionally EMPTY. The tool
# invents nothing — no title, year, description, theme, motif, or material.
# validate_catalog.py remains the authority on whether a sidecar is complete;
# an empty scaffold is deliberately incomplete until a human authors it.
#
# Read-only toward existing data: it never edits or overwrites an existing
# sidecar unless --force is given, and never touches any other file.
# ─────────────────────────────────────────────────────────────────────────────

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

# artworks/full/ is where sidecars live, relative to this script.
# Path is: tools/intake/scaffold_sidecar.py → up 3 levels to project root
FULL = Path(__file__).resolve().parents[2] / "artworks" / "full"

# A well-formed artwork ID: "art" + at least four digits.
_ID_RE = re.compile(r"^art(\d+)$")


def normalize_id(raw: str) -> str:
    """Accept 'art1085' or '1085'; return canonical 'art1085'. Raise on garbage.
    Deterministic: zero-pads to at least four digits, never truncates."""
    s = raw.strip()
    if s.isdigit():
        return f"art{int(s):04d}"
    m = _ID_RE.match(s)
    if not m:
        raise ValueError(
            f"invalid artwork ID {raw!r} — expected 'artNNNN' or a number")
    return f"art{int(m.group(1)):04d}"


def sidecar_template(art_id: str) -> dict:
    """The scaffold: deterministic structural fields + empty authorship fields.

    Ordered for a human editing the file. Contains exactly the keys
    validate_catalog.py requires — nothing invented, nothing derived that
    build_catalog.py will compute downstream (orientation, year_display,
    year_precision, composite are omitted on purpose)."""
    return {
        # ── deterministic structure (objective, not authored) ──
        "file": f"{art_id}.avif",
        "schema_version": "1",
        "featured": False,
        # ── curator-authored: present, intentionally empty ──
        "title": "",
        "year": None,
        "work_type": "",
        "description": "",
        "palette": [],
        "motifs": [],
        "materials": [],
        "composition": "",
        "themes": [],
        "series": None,
        "keywords": [],
    }


def write_sidecar(art_id: str, force: bool) -> tuple[str, Path]:
    """Write one sidecar. Returns (status, path) where status is
    'created' | 'overwritten' | 'skipped'. Never overwrites without force."""
    path = FULL / f"{art_id}.json"
    if path.exists() and not force:
        return "skipped", path
    status = "overwritten" if path.exists() else "created"
    text = json.dumps(sidecar_template(art_id), indent=2) + "\n"
    path.write_text(text, encoding="utf-8")
    return status, path


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(
        description="Create empty, schema-correct metadata sidecars for new works.")
    ap.add_argument("ids", nargs="+", metavar="artNNNN",
                    help="one or more newly assigned artwork IDs")
    ap.add_argument("--force", action="store_true",
                    help="overwrite existing sidecars (destructive; off by default)")
    args = ap.parse_args(argv)

    if not FULL.is_dir():
        print(f"error: {FULL} does not exist", file=sys.stderr)
        return 2

    # Validate ALL inputs first — refuse the whole batch on any bad ID, so a
    # typo never writes a partial, misnamed set of files.
    try:
        ids = [normalize_id(raw) for raw in args.ids]
    except ValueError as e:
        print(f"error: {e}", file=sys.stderr)
        print("No files were written.", file=sys.stderr)
        return 2

    # De-duplicate while preserving order (deterministic).
    seen, unique_ids = set(), []
    for wid in ids:
        if wid not in seen:
            seen.add(wid)
            unique_ids.append(wid)

    created, skipped = [], []
    for wid in unique_ids:
        status, path = write_sidecar(wid, force=args.force)
        if status == "skipped":
            skipped.append(path.name)
        else:
            created.append(path.name)

    # ── summary ──
    if created:
        print("Created:\n")
        for name in created:
            print(f"  {name}")
        print()

    if skipped:
        print("Skipped (already exist — use --force to overwrite):\n")
        for name in skipped:
            print(f"  {name}")
        print()

    if created:
        print("Next step:\n")
        print("  Complete the metadata for these works.\n")
        print("  No further automation occurs until curator authorship is complete.")

    if skipped and not created:
        print("Nothing to do — every requested sidecar already exists.")

    # exit 1 signals "not fully done" (a collision the curator must resolve);
    # exit 0 only when every requested ID got a fresh (or forced) sidecar.
    return 1 if skipped else 0


if __name__ == "__main__":
    sys.exit(main())

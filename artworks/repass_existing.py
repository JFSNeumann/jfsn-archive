#!/usr/bin/env python3
"""
Apply retroactive rule fixes to existing JSON sidecars.
Safe to re-run at any time — idempotent.

Rules applied
─────────────
1. SCHEMA BASELINE
   Ensure every record has year (null if absent), schema_version ("1"),
   and series (null if absent). Fixes records generated before these
   fields were added to the schema.

2. STREET-PHOTO MR. SNOWMANN
   For work_type "photograph" with keyword "street-art": the snowman is
   typically a tag on someone else's work — not a Mr. Snowmann piece.
   Remove "Mr. Snowmann" from themes; add "tag-on-other-work" keyword.

3. PHOTO FIELD CLEANUP
   For photograph / installation_view records: remove motifs, materials,
   and composition when they hold empty/null values ([] or "").
   Non-empty values are preserved — they contain real data.

4. KEYWORD COUNT ENFORCEMENT
   Trim keyword arrays exceeding 4 items (drop generic terms first).
   Records with fewer than 2 keywords are flagged for manual review —
   auto-adding keywords without the image would be wrong.

Usage
─────
    python3 artworks/repass_existing.py            # apply all rules
    python3 artworks/repass_existing.py --dry-run  # preview changes
"""

import json, argparse
from pathlib import Path

FULL = Path(__file__).parent / "full"

VALID_SERIES = {"XXIII", "Squadron", "Guernica", None}

# Generic keywords to prefer dropping when trimming over-long arrays
GENERIC_KW = {
    "panoramic", "saturated", "minimal", "text", "street", "narrative",
    "metallic", "maximalist", "pop", "all-over", "negative-space",
    "dark-palette", "minimal-mixed-media", "framed-work", "music",
    "sport", "exhibition", "political", "monochrome", "geometric",
    "documentary", "abstract", "sparse", "dense",
}


def trim_keywords(kw: list) -> list:
    """Trim to 4 items, preferring to keep specific (non-generic) terms."""
    specific = [k for k in kw if k not in GENERIC_KW][:4]
    for k in kw:
        if k not in specific and len(specific) < 4:
            specific.append(k)
    return specific


def detect_series(title: str) -> str | None:
    """Auto-detect named series from title text."""
    t = title.lower()
    if "xxiii" in t:            return "XXIII"
    if "squadron" in t:         return "Squadron"
    if t.startswith("guernica"): return "Guernica"
    return None


def apply_rules(name: str, rec: dict) -> tuple[dict, list[str]]:
    """Return (updated_rec, list_of_changes). Changes list is empty if nothing changed."""
    changes = []
    wt  = rec.get("work_type", "")
    kw  = list(rec.get("keywords", []))
    kw_set = set(kw)

    # ── Rule 1: schema baseline ───────────────────────────────────────────────
    if "year" not in rec:
        rec["year"] = None
        changes.append("added year:null")

    if rec.get("schema_version") != "1":
        rec["schema_version"] = "1"
        changes.append("set schema_version:1")

    if "series" not in rec:
        detected = detect_series(rec.get("title", ""))
        rec["series"] = detected
        changes.append(f"added series:{detected!r}")
    elif rec.get("series") not in VALID_SERIES:
        # Invalid series value — reset to detected or null
        detected = detect_series(rec.get("title", ""))
        rec["series"] = detected
        changes.append(f"corrected series → {detected!r}")

    # ── Rule 2: street-photo Mr. Snowmann ─────────────────────────────────────
    if wt == "photograph" and "street-art" in kw_set:
        themes = rec.get("themes", [])
        if "Mr. Snowmann" in themes:
            rec["themes"] = [t for t in themes if t != "Mr. Snowmann"]
            changes.append("removed Mr. Snowmann from street photo themes")
        if "tag-on-other-work" not in kw_set:
            if len(kw) < 4:
                # Room to add cleanly
                kw.append("tag-on-other-work")
                kw_set.add("tag-on-other-work")
                changes.append("added tag-on-other-work keyword")
            else:
                # List is full — swap out street-art (tag-on-other-work is more specific
                # and implies street context, so no information is lost)
                idx = kw.index("street-art")
                kw[idx] = "tag-on-other-work"
                kw_set.discard("street-art")
                kw_set.add("tag-on-other-work")
                changes.append("replaced street-art → tag-on-other-work")

    # ── Rule 3: photo field cleanup ───────────────────────────────────────────
    if wt in ("photograph", "installation_view"):
        for field in ("motifs", "materials"):
            v = rec.get(field)
            if v == [] or v is None:
                rec.pop(field, None)
                changes.append(f"stripped empty {field}")
        v = rec.get("composition")
        if v == "" or v is None:
            rec.pop("composition", None)
            changes.append("stripped empty composition")

    # ── Rule 4: keyword count ─────────────────────────────────────────────────
    if len(kw) > 4:
        trimmed = trim_keywords(kw)
        if trimmed != kw:
            original_len = len(kw)
            rec["keywords"] = trimmed
            kw = trimmed
            changes.append(f"trimmed keywords {original_len}→{len(trimmed)}")
    elif len(kw) < 2:
        changes.append(f"WARNING: only {len(kw)} keyword(s) — manual review needed")

    # Sync keywords back if kw list was modified but not yet written
    if kw != list(rec.get("keywords", [])):
        rec["keywords"] = kw

    return rec, changes


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true", help="Preview without writing")
    args = ap.parse_args()

    jsons = sorted(FULL.glob("art*.json"))
    total = changed = warnings = 0

    for jf in jsons:
        total += 1
        try:
            rec = json.loads(jf.read_text())
        except Exception as e:
            print(f"  SKIP  {jf.name}: invalid JSON ({e})")
            continue

        rec, changes = apply_rules(jf.name, rec)

        if changes:
            changed += 1
            prefix = "DRY   " if args.dry_run else "FIXED "
            warn_changes = [c for c in changes if c.startswith("WARNING")]
            real_changes = [c for c in changes if not c.startswith("WARNING")]
            if real_changes:
                print(f"{prefix}{jf.name}: {'; '.join(real_changes)}")
            for w in warn_changes:
                print(f"WARN  {jf.name}: {w}")
                warnings += 1
            if not args.dry_run:
                jf.write_text(json.dumps(rec, indent=2))

    print(f"\nScanned {total} records. {'Would change' if args.dry_run else 'Changed'} {changed}.")
    if warnings:
        print(f"Warnings: {warnings} records need manual keyword review.")


if __name__ == "__main__":
    main()

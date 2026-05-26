#!/usr/bin/env python3
"""
JFSN Catalog Validator
======================
Run after every generation batch to surface schema violations before
rebuilding catalog.json.

    python3 artworks/validate_catalog.py              # full report
    python3 artworks/validate_catalog.py --quiet      # errors only, exit 1 if any
    python3 artworks/validate_catalog.py --fix        # auto-patch fixable issues
    python3 artworks/validate_catalog.py --legacy-ok  # opener violations → warnings
                                                        (use until repass_descriptions
                                                        runs on the pre-rule batch)
    python3 artworks/validate_catalog.py --from art0141  # validate only new records
    python3 artworks/validate_catalog.py --stats      # vocabulary statistics
"""

import json, sys, argparse
from pathlib import Path
from collections import Counter

FULL = Path(__file__).parent / "full"

# ── Controlled vocabularies — single source in vocab.py ───────────────────────
from vocab import (
    VALID_WORK_TYPES, PHOTO_TYPES,
    PALETTE_SET   as VALID_PALETTE,
    MOTIFS_SET    as VALID_MOTIFS,
    MATERIALS_SET as VALID_MATERIALS,
    THEMES_SET    as VALID_THEMES,
    VALID_SERIES,
)

REQUIRED_ALWAYS = {
    "file", "title", "year", "work_type",
    "description", "palette", "themes", "series", "keywords", "featured", "schema_version",
}
REQUIRED_FULL_MEDIA = {"motifs", "materials", "composition"}
BANNED_OPENERS = {"a", "an", "the"}

# ── Validator ─────────────────────────────────────────────────────────────────

def validate(name: str, rec: dict, legacy_ok: bool = False) -> tuple[list[str], list[str]]:
    """Return (errors, warnings) for a single record.
    If legacy_ok=True, description opener violations become warnings."""
    errors = []
    warnings = []
    wt = rec.get("work_type", "")

    # work_type
    if wt not in VALID_WORK_TYPES:
        errors.append(f"invalid work_type: {wt!r}")
    elif wt == "installation_view":
        warnings.append("installation_view is deprecated — run repass_installation_view.py")

    # Required fields
    missing = REQUIRED_ALWAYS - rec.keys()
    if missing:
        errors.append(f"missing fields: {sorted(missing)}")
    if wt not in PHOTO_TYPES:
        missing_full = REQUIRED_FULL_MEDIA - rec.keys()
        if missing_full:
            errors.append(f"missing full-media fields: {sorted(missing_full)}")

    # file field matches filename
    expected_file = name.replace(".json", ".avif")
    if rec.get("file") != expected_file:
        errors.append(f"file field {rec.get('file')!r} != expected {expected_file!r}")

    # year
    year = rec.get("year")
    if year is not None and "year" in rec:
        if not (isinstance(year, int) and 1900 <= year <= 2100):
            errors.append(f"invalid year: {year!r}")

    # schema_version
    if rec.get("schema_version") != "1":
        errors.append(f"schema_version should be '1', got {rec.get('schema_version')!r}")

    # palette
    pal = rec.get("palette", [])
    if not isinstance(pal, list):
        errors.append("palette must be a list")
    else:
        if len(pal) < 1:
            errors.append(f"palette empty")
        oob = [p for p in pal if p not in VALID_PALETTE]
        if oob:
            errors.append(f"palette out-of-vocab: {oob}")

    # motifs (if present)
    motifs = rec.get("motifs")
    if motifs is not None:
        if not isinstance(motifs, list):
            errors.append("motifs must be a list")
        else:
            oob = [m for m in motifs if m not in VALID_MOTIFS]
            if oob:
                errors.append(f"motifs out-of-vocab: {oob}")

    # materials (if present)
    mats = rec.get("materials")
    if mats is not None:
        if not isinstance(mats, list):
            errors.append("materials must be a list")
        else:
            oob = [m for m in mats if m not in VALID_MATERIALS]
            if oob:
                errors.append(f"materials out-of-vocab: {oob}")

    # themes
    themes = rec.get("themes", [])
    if not isinstance(themes, list):
        errors.append("themes must be a list")
    else:
        if len(themes) > 4:
            errors.append(f"themes has {len(themes)} items (max 4)")
        oob = [t for t in themes if t not in VALID_THEMES]
        if oob:
            errors.append(f"themes out-of-vocab: {oob}")

    # keywords
    kw = rec.get("keywords", [])
    if not isinstance(kw, list):
        errors.append("keywords must be a list")
    else:
        if len(kw) < 2:
            errors.append(f"keywords has {len(kw)} items (min 2)")
        if len(kw) > 4:
            errors.append(f"keywords has {len(kw)} items (max 4)")

    # description opener
    desc = rec.get("description", "")
    first_word = desc.split()[0].rstrip(",").lower() if desc.split() else ""
    if first_word in BANNED_OPENERS:
        msg = f"description opens with banned word {first_word!r}"
        if legacy_ok:
            warnings.append(msg)
        else:
            errors.append(msg)

    # description length
    word_count = len(desc.split())
    if word_count > 55:
        errors.append(f"description is {word_count} words (max 55)")
    if word_count < 10:
        errors.append(f"description is only {word_count} words (suspiciously short)")

    # series
    if "series" in rec:
        s = rec.get("series")
        if s not in VALID_SERIES:
            errors.append(f"invalid series: {s!r} — must be 'XXIII', 'Squadron', 'Guernica', or null")

    return errors, warnings


def _detect_series(title: str) -> str | None:
    t = title.lower()
    if "xxiii" in t:             return "XXIII"
    if "squadron" in t:          return "Squadron"
    if t.startswith("guernica"): return "Guernica"
    return None


def auto_fix(name: str, rec: dict) -> tuple[dict, list[str]]:
    """Apply safe auto-fixes. Returns (updated_rec, list_of_fixes_applied)."""
    fixes = []

    if "year" not in rec:
        rec["year"] = None
        fixes.append("added year:null")

    if rec.get("schema_version") != "1":
        rec["schema_version"] = "1"
        fixes.append("set schema_version:1")

    if "series" not in rec:
        s = _detect_series(rec.get("title", ""))
        rec["series"] = s
        fixes.append(f"added series:{s!r}")
    elif rec.get("series") not in VALID_SERIES:
        s = _detect_series(rec.get("title", ""))
        rec["series"] = s
        fixes.append(f"corrected series → {s!r}")

    return rec, fixes


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    ap = argparse.ArgumentParser(description="Validate all JSON sidecars in artworks/full/")
    ap.add_argument("--quiet",      action="store_true", help="Suppress warnings; exit 1 on errors")
    ap.add_argument("--fix",        action="store_true", help="Auto-patch fixable issues (year, schema_version)")
    ap.add_argument("--stats",      action="store_true", help="Print vocabulary statistics")
    ap.add_argument("--legacy-ok",  action="store_true",
                    help="Downgrade description-opener violations to warnings "
                         "(use until repass_descriptions.py has been run)")
    ap.add_argument("--from",       dest="from_id", default=None, metavar="art0NNN",
                    help="Only validate records at or after this ID (e.g. --from art0141)")
    args = ap.parse_args()

    jsons = sorted(FULL.glob("art*.json"))
    if not jsons:
        print(f"No JSON files found in {FULL}")
        sys.exit(1)

    # Apply --from filter
    if args.from_id:
        jsons = [jf for jf in jsons if jf.stem >= args.from_id]
        print(f"Filtering to records >= {args.from_id}: {len(jsons)} files")

    total_errors   = 0
    total_warnings = 0
    total_fixed    = 0
    keyword_counts = Counter()
    theme_counts   = Counter()
    series_counts  = Counter()
    opener_counts  = Counter()

    for jf in jsons:
        try:
            rec = json.loads(jf.read_text())
        except json.JSONDecodeError as e:
            print(f"INVALID JSON  {jf.name}: {e}")
            total_errors += 1
            continue

        # Auto-fix pass
        if args.fix:
            rec, fixes = auto_fix(jf.name, rec)
            if fixes:
                jf.write_text(json.dumps(rec, indent=2))
                total_fixed += 1
                if not args.quiet:
                    print(f"FIXED  {jf.name}: {', '.join(fixes)}")

        # Validation pass
        errors, warnings = validate(jf.name, rec, legacy_ok=args.legacy_ok)

        if errors:
            total_errors += len(errors)
            for e in errors:
                print(f"ERROR  {jf.name}: {e}")

        if warnings and not args.quiet:
            total_warnings += len(warnings)
            for w in warnings:
                # Suppress series warnings — they'll all resolve after repass_series runs
                if "series field missing" not in w:
                    print(f"WARN   {jf.name}: {w}")
        elif warnings:
            total_warnings += len(warnings)

        # Stats accumulation
        if args.stats:
            for k in rec.get("keywords", []):
                keyword_counts[k] += 1
            for t in rec.get("themes", []):
                theme_counts[t] += 1
            series_counts[rec.get("series", "—")] += 1
            desc = rec.get("description", "")
            first = desc.split()[0].rstrip(",") if desc.split() else ""
            opener_counts[first] += 1

    # Summary
    print(f"\n{'─'*60}")
    print(f"Scanned  : {len(jsons)} records")
    print(f"Errors   : {total_errors}")
    print(f"Warnings : {total_warnings}")
    if args.legacy_ok:
        print(f"           (--legacy-ok active: opener violations are warnings)")
    if args.fix:
        print(f"Fixed    : {total_fixed}")

    if args.stats:
        print(f"\nTop 15 keywords (drift risk if any > 10):")
        for k, v in keyword_counts.most_common(15):
            flag = "  ⚠" if v > 10 else ""
            print(f"  {v:3}x  {k}{flag}")

        print(f"\nTheme distribution:")
        for t, v in theme_counts.most_common():
            print(f"  {v:3}x  {t}")

        print(f"\nSeries distribution:")
        for s, v in series_counts.most_common():
            print(f"  {v:3}x  {s!r}")

        print(f"\nDescription openers (top 10):")
        for w, v in opener_counts.most_common(10):
            flag = "  ⚠ BANNED" if w.lower() in BANNED_OPENERS else ""
            print(f"  {v:3}x  {w!r}{flag}")

    print(f"{'─'*60}")
    if total_errors:
        sys.exit(1)


if __name__ == "__main__":
    main()

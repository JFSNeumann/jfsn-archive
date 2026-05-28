#!/usr/bin/env python3
"""
Apply dating decisions from curate.html (Years tab) back to the archive.

Reads:   curate-session.json  (__years__ key — artId → decade-start year)
Writes:  artworks/full/*.json (sets `year` field on each dated sidecar)
         pending-themes.json  (merges year into each artId entry)
Then:    runs build_catalog.py to regenerate all catalogs.

Convention: years from curate.html are decade-start (1970, 1980, ...).
Meaning: "sometime in the 1970s", not "exactly 1970."

Usage:
    python3 artworks/apply_dates.py --dry-run    # preview, no writes
    python3 artworks/apply_dates.py              # apply (preserves more-specific years)
    python3 artworks/apply_dates.py --overwrite  # also overwrite conflicting existing years
    python3 artworks/apply_dates.py --no-build   # apply but skip build_catalog

Safety: by default, sidecars that already have a year value DIFFERENT from the
curate-session value are SKIPPED, not overwritten. This protects more-specific
data (e.g. an AI-cataloged year like 2013) from being clobbered by a coarser
decade pick (e.g. 2010). Pass --overwrite to apply them anyway after reviewing
the conflicts list in --dry-run output.
"""
import json
import sys
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SESSION = ROOT / "curate-session.json"
SIDECAR_DIR = ROOT / "artworks" / "full"
PENDING = ROOT / "pending-themes.json"
BUILD_SCRIPT = ROOT / "artworks" / "build_catalog.py"

VALID_DECADES = {1970, 1980, 1990, 2000, 2010, 2020}


def main():
    dry_run = "--dry-run" in sys.argv
    no_build = "--no-build" in sys.argv
    overwrite = "--overwrite" in sys.argv

    if not SESSION.exists():
        print(f"ERROR: {SESSION} not found. Save from curate.html first.", file=sys.stderr)
        sys.exit(1)

    session = json.loads(SESSION.read_text())
    years = session.get("__years__", {})
    if not years:
        print(f"No dates found in __years__ key of {SESSION.name}.")
        print("Did you save curate.html while in the Years tab?")
        sys.exit(0)

    # Validate
    invalid = [(k, v) for k, v in years.items() if v not in VALID_DECADES]
    if invalid:
        print(f"ERROR: {len(invalid)} entries have invalid years (not a decade-start):")
        for k, v in invalid[:10]:
            print(f"  {k} → {v}")
        sys.exit(2)

    print(f"Found {len(years)} dating decisions in curate-session.json")
    mode_label = "DRY RUN (no writes)" if dry_run else (
        "APPLY (--overwrite: replaces existing years too)" if overwrite else
        "APPLY (preserves existing year values; pass --overwrite to replace)"
    )
    print(f"  Mode: {mode_label}")
    print()

    # Categorize before writing
    stats = {"new": 0, "same": 0, "overwrite_applied": 0, "overwrite_skipped": 0, "missing": 0}
    overwrites = []  # (artId, old, new, applied)
    missing = []

    for art_id, new_year in sorted(years.items()):
        sidecar = SIDECAR_DIR / f"{art_id}.json"
        if not sidecar.exists():
            stats["missing"] += 1
            missing.append(art_id)
            continue

        data = json.loads(sidecar.read_text())
        old_year = data.get("year")

        write_this = False
        if old_year is None:
            stats["new"] += 1
            write_this = True
        elif old_year == new_year:
            stats["same"] += 1
            continue  # no change needed
        else:
            # Conflict — only write if --overwrite passed
            if overwrite:
                stats["overwrite_applied"] += 1
                overwrites.append((art_id, old_year, new_year, True))
                write_this = True
            else:
                stats["overwrite_skipped"] += 1
                overwrites.append((art_id, old_year, new_year, False))

        if write_this and not dry_run:
            data["year"] = new_year
            sidecar.write_text(json.dumps(data, indent=2, ensure_ascii=False))

    # Pending-themes.json — only updates entries we actually wrote to sidecars
    pending = json.loads(PENDING.read_text()) if PENDING.exists() else {}
    pending_changes = 0
    skipped_ids = {art_id for art_id, _, _, applied in overwrites if not applied}
    for art_id, new_year in years.items():
        if art_id in skipped_ids:
            continue  # don't update pending for skipped overwrites
        entry = pending.get(art_id, {})
        if entry.get("year") != new_year:
            entry["year"] = new_year
            pending[art_id] = entry
            pending_changes += 1

    if not dry_run and pending_changes:
        PENDING.write_text(json.dumps(pending, indent=2, ensure_ascii=False, sort_keys=True))

    # Report
    print(f"  Newly dated:        {stats['new']}")
    print(f"  Already matched:    {stats['same']}  (skipped, no change)")
    if overwrite:
        print(f"  Year overwritten:   {stats['overwrite_applied']}  (--overwrite was passed)")
    else:
        print(f"  Conflicts SKIPPED:  {stats['overwrite_skipped']}  (existing year preserved; pass --overwrite to replace)")
    print(f"  Missing sidecars:   {stats['missing']}")
    print(f"  pending-themes.json updates: {pending_changes}")

    if overwrites:
        verb = "Overwritten" if overwrite else "SKIPPED (existing year preserved)"
        print(f"\n{verb}:")
        for art_id, old, new, _ in overwrites[:20]:
            print(f"  {art_id}:  {old} → {new}")
        if len(overwrites) > 20:
            print(f"  ... and {len(overwrites) - 20} more")

    if missing:
        print(f"\nMissing sidecars (skipped):")
        for m in missing[:10]:
            print(f"  {m}")

    if dry_run:
        print("\n[dry run] No files written. Re-run without --dry-run to apply.")
        return

    # Run build_catalog.py
    if no_build:
        print("\n[--no-build] Skipping build_catalog.py. Run manually before deploying.")
        return

    print("\nRunning build_catalog.py to regenerate catalogs...")
    result = subprocess.run(
        ["python3", str(BUILD_SCRIPT)],
        cwd=str(ROOT),
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        print(f"ERROR: build_catalog.py failed (exit {result.returncode})")
        print(result.stdout)
        print(result.stderr, file=sys.stderr)
        sys.exit(3)
    # Show only the tail of build output
    out_lines = result.stdout.strip().splitlines()
    for line in out_lines[-8:]:
        print(f"  {line}")
    print("\n✓ Dates applied and catalogs rebuilt. Run ./deploy.sh to push live.")


if __name__ == "__main__":
    main()

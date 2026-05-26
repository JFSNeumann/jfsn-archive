#!/usr/bin/env python3
"""
Migrate work_type "installation_view" → "photograph".

Assigns theme "Gallery" to any record that doesn't already have a
context theme (Studio, Gallery). All other metadata is preserved.

    python3 artworks/repass_installation_view.py          # dry-run (default)
    python3 artworks/repass_installation_view.py --run    # apply changes
"""

import json, sys, argparse
from pathlib import Path

FULL = Path(__file__).parent / "full"

CONTEXT_THEMES = {"Studio", "Gallery"}


def migrate(jf: Path, apply: bool) -> tuple[str, str]:
    rec = json.loads(jf.read_text())
    if rec.get("work_type") != "installation_view":
        return jf.name, "skip"

    changes = ["work_type: installation_view → photograph"]
    rec["work_type"] = "photograph"

    themes = rec.get("themes", [])
    if not any(t in CONTEXT_THEMES for t in themes):
        themes.append("Gallery")
        rec["themes"] = themes
        changes.append("theme: + Gallery")

    if apply:
        jf.write_text(json.dumps(rec, indent=2))

    return jf.name, ", ".join(changes)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--run", action="store_true",
                    help="Apply changes (default: dry-run preview only)")
    args = ap.parse_args()

    jsons = sorted(FULL.glob("art*.json"))
    targets = [jf for jf in jsons
               if json.loads(jf.read_text()).get("work_type") == "installation_view"]

    if not targets:
        print("No installation_view records found. Nothing to do.")
        return

    mode = "APPLYING" if args.run else "DRY RUN"
    print(f"{mode}: {len(targets)} installation_view records\n")

    for jf in targets:
        name, summary = migrate(jf, apply=args.run)
        prefix = "  ✓" if args.run else "  →"
        print(f"{prefix} {name}: {summary}")

    if not args.run:
        print(f"\nRun with --run to apply. Then run validate_catalog.py to confirm.")
    else:
        print(f"\nDone. Run validate_catalog.py to confirm clean state.")


if __name__ == "__main__":
    main()

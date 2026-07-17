#!/usr/bin/env python3
# ─────────────────────────────────────────────────────────────────────────────
# intake_status.py — read-only Catalog Intake status.
#
#   python3 scripts/intake_status.py          human-readable report
#   python3 scripts/intake_status.py --json   machine-readable
#
# Phase 2.2 of the Catalog Intake workflow.
#
# It answers one question and only observes:
#
#     What work is waiting for the curator?
#
# STRICTLY READ-ONLY. It creates, edits, regenerates, and deletes nothing. It
# invents no metadata and suggests no titles, dates, or themes. It reports facts
# about files already on disk.
#
# A work is "done" (and excluded) when its required authored fields are filled,
# it has a rendered page, and it is present in catalog.json. Everything short of
# that is either awaiting authorship or awaiting the finish step. This scoping
# means the settled corpus never appears here, and legacy stylistic debt is not
# resurfaced as intake work — only genuinely incomplete or unpublished works are.
#
# Validation detail is delegated to artworks/validate_catalog.py — the single
# source of the archive's schema rules — so this tool duplicates no rules.
# ─────────────────────────────────────────────────────────────────────────────

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

# Data location (overridable in tests). The validator RULES load from the fixed
# install path below, not from here, so pointing ROOT at a fixture never changes
# which schema rules apply.
_INSTALL_ARTWORKS = Path(__file__).resolve().parent.parent / "artworks"

ROOT = Path(__file__).resolve().parent.parent
FULL = ROOT / "artworks" / "full"
THUMBS = ROOT / "artworks" / "thumbs"
PAGES = ROOT / "artworks" / "pages"
CATALOG = ROOT / "catalog.json"

# The required authored fields whose emptiness means "waiting for the curator".
# Mirrors validate_catalog.py's content rules (work_type valid, palette >= 1,
# keywords >= 2, description present) plus `title`, which validate_catalog does
# not check for emptiness. `year` is intentionally excluded — the archive
# publishes decade estimates and validate_catalog accepts year: null.
E_FIELDS = ["title", "work_type", "description", "palette", "keywords"]


def _empty(v) -> bool:
    if v is None:
        return True
    if isinstance(v, str):
        return v.strip() == ""
    if isinstance(v, (list, dict)):
        return len(v) == 0
    return False


def _missing_fields(rec: dict) -> list[str]:
    """Which required authored fields are empty/insufficient. Objective only."""
    missing = []
    if _empty(rec.get("title")):
        missing.append("title")
    if _empty(rec.get("work_type")):
        missing.append("work_type")
    if _empty(rec.get("description")):
        missing.append("description")
    pal = rec.get("palette")
    if not (isinstance(pal, list) and len(pal) >= 1):
        missing.append("palette")
    kw = rec.get("keywords")
    if not (isinstance(kw, list) and len(kw) >= 2):
        missing.append("keywords")
    return missing


def _validation_issues(wid: str, rec: dict, missing: list[str]) -> list[str]:
    """Reuse validate_catalog.py for issues on fields that ARE present.
    Skips anything already reported as missing, so nothing is double-counted."""
    try:
        sys.path.insert(0, str(_INSTALL_ARTWORKS))
        import validate_catalog as vc
    except Exception:
        return []  # validator unavailable — emptiness report still stands
    try:
        errors, _warnings = vc.validate(f"{wid}.json", rec)
    except Exception:
        return []
    return [e for e in errors if not any(f in e for f in missing)]


def _catalog_ids_with_title() -> set[str]:
    """IDs present in catalog.json with a non-null title (i.e. truly published,
    not a null-metadata stub)."""
    if not CATALOG.exists():
        return set()
    try:
        cat = json.loads(CATALOG.read_text())
    except (json.JSONDecodeError, OSError):
        return set()
    out = set()
    for e in cat:
        if isinstance(e, dict) and e.get("file") and not _empty(e.get("title")):
            out.add(e["file"].rsplit(".", 1)[0])
    return out


def scan() -> tuple[list[dict], list[str]]:
    """Return (pending, ready). Read-only.
    pending: list of {id, missing, issues, note}. ready: list of ids."""
    published = _catalog_ids_with_title()
    sidecars = {p.stem: p for p in FULL.glob("art*.json")} if FULL.is_dir() else {}
    ingested = {p.stem for p in THUMBS.glob("art*.avif")} if THUMBS.is_dir() else set()

    candidates = sorted(set(sidecars) | ingested)
    pending, ready = [], []

    for wid in candidates:
        # Ingested but never scaffolded — needs a sidecar, then authorship.
        if wid not in sidecars:
            pending.append({"id": wid, "missing": list(E_FIELDS),
                            "issues": [], "note": "no sidecar yet"})
            continue

        try:
            rec = json.loads(sidecars[wid].read_text())
        except json.JSONDecodeError as e:
            pending.append({"id": wid, "missing": [],
                            "issues": [f"malformed sidecar (invalid JSON): {e}"],
                            "note": "malformed"})
            continue

        missing = _missing_fields(rec)
        has_page = (PAGES / f"{wid}.html").exists()
        is_published = wid in published

        # Done — authored, paged, and in the catalog. Excluded from intake.
        if not missing and has_page and is_published:
            continue

        issues = _validation_issues(wid, rec, missing)
        if missing or issues:
            pending.append({"id": wid, "missing": missing,
                            "issues": issues, "note": None})
        else:
            # Authored and valid, but not yet built into page/catalog.
            ready.append(wid)

    return pending, ready


# ── rendering ────────────────────────────────────────────────────────────────

def render(pending: list[dict], ready: list[str]) -> str:
    lines = ["Catalog Intake Status", "-" * 21, ""]

    if not pending and not ready:
        lines += ["Nothing is waiting for the curator.",
                  "All ingested works are fully cataloged.", ""]
    else:
        if pending:
            lines += ["Pending Authorship", ""]
            for item in pending:
                lines.append(item["id"])
                if item["note"] == "no sidecar yet":
                    lines.append("  No sidecar yet — run the scaffolder, then author:")
                if item["missing"]:
                    lines.append("  Missing:")
                    for f in item["missing"]:
                        lines.append(f"    • {f}")
                if item["issues"]:
                    lines.append("  Validation issues:")
                    for iss in item["issues"]:
                        lines.append(f"    • {iss}")
                lines.append("")
        if ready:
            lines += ["Ready for Finish", ""]
            for wid in ready:
                lines.append(wid)
            lines.append("")

    lines += ["Summary",
              f"Pending authorship: {len(pending)}",
              f"Ready for finish: {len(ready)}"]
    return "\n".join(lines)


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(
        description="Read-only Catalog Intake status: what is waiting for the curator.")
    ap.add_argument("--json", action="store_true",
                    help="machine-readable output")
    args = ap.parse_args(argv)

    pending, ready = scan()

    if args.json:
        print(json.dumps({
            "pending_authorship": pending,
            "ready_for_finish": ready,
            "summary": {"pending": len(pending), "ready": len(ready)},
        }, indent=2))
    else:
        print(render(pending, ready))

    # Read-only status is not a gate: it always exits 0.
    return 0


if __name__ == "__main__":
    sys.exit(main())

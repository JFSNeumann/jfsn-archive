#!/usr/bin/env python3
# ─────────────────────────────────────────────────────────────────────────────
# intake.py — Catalog Intake orchestration (Phase 2.3).
#
#   python3 scripts/intake.py        (or: archive intake)
#
# One command prepares new artworks for authorship, then deliberately stops:
#
#     1. verify prerequisites
#     2. run the existing ingest (image tiers, ID reservation, dims.json)
#     3. scaffold an empty sidecar for each newly assigned ID
#     4. display intake status
#     5. STOP — at the boundary where curator judgment begins
#
#     Automate execution. Never automate authorship.
#
# It does NOT rebuild catalogs, generate pages, update derived files, run
# deployment checks, or call `archive verify`. Those belong to Phase 2.4.
#
# This is a COORDINATOR, not a reimplementation. Each underlying tool
# (artworks/ingest.py, scripts/scaffold_sidecar.py, scripts/intake_status.py)
# remains independently executable; this file only sequences them and stops.
# ─────────────────────────────────────────────────────────────────────────────

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

_SCRIPTS = Path(__file__).resolve().parent
_ROOT = _SCRIPTS.parent
sys.path.insert(0, str(_SCRIPTS))
sys.path.insert(0, str(_ROOT / "artworks"))

import ingest  # noqa: E402  (safe: heavy deps are imported lazily inside ingest)
import scaffold_sidecar  # noqa: E402
import intake_status  # noqa: E402

# Reused from ingest so there is a single source of truth for these.
INBOX = ingest.INBOX
THUMBS = ingest.THUMBS
INBOX_EXTS = ingest.INBOX_EXTS
INGEST_SCRIPT = Path(ingest.__file__)


def inbox_has_images() -> bool:
    if not INBOX.is_dir():
        return False
    return any(f.is_file() and f.suffix.lower() in INBOX_EXTS
               for f in INBOX.iterdir())


def existing_ids() -> set[str]:
    """IDs that already have a generated thumbnail (i.e. already ingested)."""
    if not THUMBS.is_dir():
        return set()
    return {p.stem for p in THUMBS.glob("art*.avif")}


def run_ingest() -> int:
    """Run the existing ingest as a subprocess; return its exit code.
    Kept as a separate function so it is easy to substitute in tests."""
    return subprocess.run([sys.executable, str(INGEST_SCRIPT)]).returncode


def intake() -> int:
    # ── 1. prerequisites ────────────────────────────────────────────────────
    if not INGEST_SCRIPT.exists():
        print(f"error: ingest script not found at {INGEST_SCRIPT}", file=sys.stderr)
        return 1
    if not inbox_has_images():
        print("Inbox is empty.")
        print(f"Drop photos into {INBOX}/ and run this again.")
        return 0  # nothing to do is not a failure

    before = existing_ids()

    # ── 2. ingest ───────────────────────────────────────────────────────────
    print("Ingesting new artworks…\n")
    rc = run_ingest()
    if rc != 0:
        print("\nIngest failed — stopping. Nothing was scaffolded.", file=sys.stderr)
        print("Fix the problem above and re-run. No later steps have run.",
              file=sys.stderr)
        return 1

    new_ids = sorted(existing_ids() - before)
    if not new_ids:
        print("\nIngest ran but produced no new works — stopping.", file=sys.stderr)
        print("Check the ingest output above for skipped or failed files.",
              file=sys.stderr)
        return 1

    # ── 3. scaffold sidecars for the new IDs ────────────────────────────────
    created, collided = [], []
    try:
        for wid in new_ids:
            status, _path = scaffold_sidecar.write_sidecar(wid, force=False)
            if status == "skipped":
                collided.append(wid)   # a sidecar already existed — never overwrite
            else:
                created.append(wid)
    except OSError as e:
        print(f"\nScaffolding failed: {e}", file=sys.stderr)
        print("Stopping. Some sidecars may not have been created — run "
              "`archive intake status` to see the current state.", file=sys.stderr)
        return 1

    # ── 4. report + transition to authorship ────────────────────────────────
    print("\nCatalog Intake Complete\n")
    if created:
        print("Created:\n")
        for wid in created:
            print(f"  {wid}")
        print("\nThese works now require curator authorship.")
    if collided:
        print("\nAlready had a sidecar (left untouched):\n")
        for wid in collided:
            print(f"  {wid}")

    print("\nNext step:\n")
    print("  Complete the metadata sidecars, then check progress:")
    print("    archive intake status")
    print("\n  When every work is authored, run the finish step (Phase 2.4) to")
    print("  build and verify them. No further automation runs until then.")

    # ── 5. display intake status, then STOP ─────────────────────────────────
    print("\n" + "─" * 40 + "\n")
    pending, ready = intake_status.scan()
    print(intake_status.render(pending, ready))

    return 0


def main(argv=None) -> int:
    return intake()


if __name__ == "__main__":
    sys.exit(main())

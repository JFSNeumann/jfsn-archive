#!/usr/bin/env python3
# ─────────────────────────────────────────────────────────────────────────────
# intake_finish.py — Catalog Intake finish (Phase 2.4).
#
#   python3 tools/intake/intake_finish.py     (or: archive intake finish)
#
# Transforms completed curator-authored metadata into a fully generated,
# verified archive state. It coordinates existing tools in a fixed order and
# stops the moment any stage fails:
#
#     1. validate authored sidecars      (artworks/validate_catalog.py)
#     2. STOP if validation fails
#     3. rebuild catalogs                (artworks/build_catalog.py)
#     4. generate pages for new works    (gen-artwork-pages.py --id …)
#     5. update derived artifacts        (artworks/build_changes.py)
#     6. run the archive verifier        (tools/utils/verify.py)  ← the final gate
#     7. present a readiness report
#
#     Automate execution. Never automate authorship.
#     The curator decides what the archive says. This command decides only
#     how the existing tools are run.
#
# It NEVER commits, pushes, deploys, tags, or invokes any deployment script.
# Publication remains an intentional human decision.
#
# This is a COORDINATOR: it duplicates no validation, build, or verification
# logic, and each underlying tool remains independently executable.
# ─────────────────────────────────────────────────────────────────────────────

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

_THIS_FILE = Path(__file__).resolve()
_ROOT = _THIS_FILE.parents[2]  # tools/intake/intake_finish.py -> project root
sys.path.insert(0, str(_THIS_FILE.parent))
import intake_status  # noqa: E402

# The existing tools this command coordinates (paths, not reimplementations).
VALIDATE = _ROOT / "artworks" / "validate_catalog.py"
BUILD_CATALOG = _ROOT / "artworks" / "build_catalog.py"
GEN_PAGES = _ROOT / "tools" / "generators" / "gen-artwork-pages.py"
BUILD_CHANGES = _ROOT / "artworks" / "build_changes.py"
VERIFY = _ROOT / "tools" / "utils" / "verify.py"

# What build_catalog.py regenerates — listed for the report, not recomputed here.
REBUILT = ["catalog.json", "catalog-lite.json", "catalog-home.json",
           "API (api/v1/*)", "sitemap.xml"]


# ── stage seams (each returns (returncode, combined_output)) ─────────────────

def _run(cmd) -> tuple[int, str]:
    p = subprocess.run(cmd, capture_output=True, text=True)
    return p.returncode, (p.stdout or "") + (p.stderr or "")


def run_validate(from_id: str) -> tuple[int, str]:
    return _run([sys.executable, str(VALIDATE), "--from", from_id, "--quiet"])


def run_build_catalog() -> tuple[int, str]:
    return _run([sys.executable, str(BUILD_CATALOG)])


def run_gen_pages(ids: list[str]) -> tuple[int, str]:
    out = []
    for wid in ids:
        rc, o = _run([sys.executable, str(GEN_PAGES), "--id", wid])
        out.append(o)
        if rc != 0:
            return rc, "".join(out)
    return 0, "".join(out)


def run_build_changes() -> tuple[int, str]:
    return _run([sys.executable, str(BUILD_CHANGES)])


def run_verify() -> tuple[int, str]:
    return _run([sys.executable, str(VERIFY), "--quiet"])


# ── failure helper ───────────────────────────────────────────────────────────

def _stop(stage: str, detail: str, note: str) -> int:
    print(f"\nStage failed: {stage}", file=sys.stderr)
    if detail.strip():
        print(detail.rstrip(), file=sys.stderr)
    print(f"\n{note}", file=sys.stderr)
    print("Stopping. No commit or deployment has been performed.", file=sys.stderr)
    return 1


# ── orchestration ────────────────────────────────────────────────────────────

def finish() -> int:
    pending, ready = intake_status.scan()

    # Nothing awaiting build.
    if not pending and not ready:
        print("Nothing to finish — no works are awaiting build.")
        print("Run `archive intake status` to see the current state.")
        return 0

    # Validation gate #1: any incomplete/malformed/un-scaffolded work blocks the
    # whole batch. Reuses the state intake_status already computed — no new rules.
    if pending:
        lines = [f"{len(pending)} work(s) are not ready for finish:\n"]
        for item in pending:
            lines.append(f"  {item['id']}")
            for f in item["missing"]:
                lines.append(f"    • missing: {f}")
            for iss in item["issues"]:
                lines.append(f"    • {iss}")
        return _stop("Validate authored sidecars", "\n".join(lines),
                     "Complete authorship, then re-run `archive intake finish`. "
                     "Existing outputs are unchanged.")

    # Validation gate #2: the authoritative schema tool on the ready works only.
    from_id = min(ready)
    rc, out = run_validate(from_id)
    if rc != 0:
        return _stop("Validate authored sidecars", out,
                     "validate_catalog.py rejected the metadata above. "
                     "Existing outputs are unchanged.")

    # Build catalogs.
    rc, out = run_build_catalog()
    if rc != 0:
        return _stop("Rebuild catalogs", out,
                     "build_catalog.py failed before completing.")

    # Generate pages for the newly completed works only.
    rc, out = run_gen_pages(ready)
    if rc != 0:
        return _stop("Generate artwork pages", out,
                     "gen-artwork-pages.py failed. Catalogs were rebuilt; "
                     "pages may be incomplete.")

    # Update derived artifacts.
    rc, out = run_build_changes()
    if rc != 0:
        return _stop("Update derived artifacts", out,
                     "build_changes.py failed after catalogs and pages were built.")

    # The final gate: archive verify. Always runs; always decides readiness.
    vrc, vout = run_verify()
    verified_pass = (vrc == 0)

    _report(ready, verified_pass, vout)
    return 0 if verified_pass else 1


def _report(validated: list[str], verified_pass: bool, verify_output: str):
    print("\nCatalog Finish Complete\n")

    print("Validated:")
    for wid in validated:
        print(f"  {wid}")

    print("\nRebuilt:")
    for f in REBUILT:
        print(f"  {f}")

    print("\nGenerated:")
    print(f"  artwork pages ({', '.join(validated)})")

    print("\nVerified:")
    print(f"  {'PASS' if verified_pass else 'FAIL'}")

    print("\nArchive Status:")
    print("READY" if verified_pass else "NOT READY")

    if verified_pass:
        print("\nThe archive has been prepared for normal commit and deployment.")
        print("\nNo commit or deployment has been performed.")
    else:
        print("\nThe verifier reported integrity FAILURES — the archive is NOT ready.")
        print("Review `archive verify` output before any commit or deployment.\n")
        # Surface the verifier's own report so the curator sees exactly why.
        print(verify_output.rstrip())


def main(argv=None) -> int:
    return finish()


if __name__ == "__main__":
    sys.exit(main())

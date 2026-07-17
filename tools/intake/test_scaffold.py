#!/usr/bin/env python3
# ─────────────────────────────────────────────────────────────────────────────
# test_scaffold.py — verification tests for the sidecar scaffolder.
#
#   python3 scripts/test_scaffold.py
#
# Dependency-free. Points the scaffolder at a temp artworks/full/ and asserts:
# single & multiple IDs, existing-sidecar protection, malformed input, valid
# JSON, no invented metadata, and compatibility with validate_catalog.py
# (structural checks pass; only completeness gates remain).
# ─────────────────────────────────────────────────────────────────────────────

import json
import sys
import tempfile
from pathlib import Path

_THIS_FILE = Path(__file__).resolve()
sys.path.insert(0, str(_THIS_FILE.parent))
import scaffold_sidecar as scaf  # noqa: E402

# Make validate_catalog.py importable (it lives in artworks/ and imports vocab).
_ROOT = _THIS_FILE.parents[2]  # tools/intake/test_scaffold.py -> project root
ARTWORKS = _ROOT / "artworks"
sys.path.insert(0, str(ARTWORKS))

_failures = []


def check(name, cond):
    print(f"  [{'ok  ' if cond else 'FAIL'}] {name}")
    if not cond:
        _failures.append(name)


def use_temp_full():
    d = tempfile.mkdtemp()
    scaf.FULL = Path(d)
    return scaf.FULL


def test_single_id():
    full = use_temp_full()
    rc = scaf.main(["art1085"])
    p = full / "art1085.json"
    check("single ID exits 0", rc == 0)
    check("single ID creates file", p.exists())
    rec = json.loads(p.read_text())
    check("file field is 'art1085.avif'", rec["file"] == "art1085.avif")
    check("schema_version is string '1'", rec["schema_version"] == "1")


def test_multiple_ids():
    full = use_temp_full()
    rc = scaf.main(["art1085", "art1086", "art1087"])
    check("multiple IDs exit 0", rc == 0)
    check("all three created",
          all((full / f"art108{n}.json").exists() for n in (5, 6, 7)))


def test_bare_number_normalized():
    full = use_temp_full()
    scaf.main(["1085"])
    check("bare number normalizes to art1085.json",
          (full / "art1085.json").exists())


def test_existing_sidecar_protected():
    full = use_temp_full()
    p = full / "art1085.json"
    p.write_text('{"title": "Real Human Title"}')
    rc = scaf.main(["art1085"])
    check("existing sidecar -> exit 1", rc == 1)
    check("existing sidecar NOT overwritten",
          json.loads(p.read_text())["title"] == "Real Human Title")


def test_force_overwrites():
    full = use_temp_full()
    p = full / "art1085.json"
    p.write_text('{"title": "Old"}')
    rc = scaf.main(["art1085", "--force"])
    check("--force exits 0", rc == 0)
    check("--force overwrites to empty scaffold",
          json.loads(p.read_text())["title"] == "")


def test_malformed_input_writes_nothing():
    full = use_temp_full()
    rc = scaf.main(["art1085", "not-an-id"])
    check("malformed input -> exit 2", rc == 2)
    check("malformed batch writes NO files (atomic refuse)",
          not any(full.iterdir()))


def test_valid_json_and_no_invented_metadata():
    full = use_temp_full()
    scaf.main(["art1085"])
    rec = json.loads((full / "art1085.json").read_text())  # raises if invalid
    check("output is valid JSON", isinstance(rec, dict))
    # No invented authorship: every human field is empty/null.
    empty_ok = (
        rec["title"] == "" and rec["year"] is None and rec["work_type"] == ""
        and rec["description"] == "" and rec["palette"] == []
        and rec["motifs"] == [] and rec["materials"] == []
        and rec["composition"] == "" and rec["themes"] == []
        and rec["series"] is None and rec["keywords"] == []
    )
    check("no invented metadata (all authored fields empty)", empty_ok)


def test_validate_catalog_structural_pass():
    """Compatibility: validate_catalog sees a structurally-correct record —
    no missing-field / bad-file / bad-schema_version / malformed errors. The
    only errors are completeness gates (empty work_type/palette/keywords/desc),
    which correctly force curator authorship before publication."""
    full = use_temp_full()
    scaf.main(["art1085"])
    rec = json.loads((full / "art1085.json").read_text())
    try:
        import validate_catalog as vc
    except Exception as e:
        check(f"validate_catalog importable ({e})", False)
        return
    errors, _warnings = vc.validate("art1085.json", rec)

    structural_markers = ("missing fields", "missing full-media fields",
                          "file field", "schema_version", "INVALID JSON")
    structural = [e for e in errors if any(m in e for m in structural_markers)]
    check("no STRUCTURAL validation errors", not structural)

    # And it IS flagged incomplete — authorship is still required.
    check("validator flags it incomplete (authorship still required)",
          len(errors) > 0)


def main():
    print("scaffold_sidecar.py — verification tests\n")
    saved = scaf.FULL
    try:
        for name, fn in sorted(globals().items()):
            if name.startswith("test_") and callable(fn):
                fn()
    finally:
        scaf.FULL = saved
    print()
    if _failures:
        print(f"{len(_failures)} test(s) FAILED: {', '.join(_failures)}")
        return 1
    print("All tests passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

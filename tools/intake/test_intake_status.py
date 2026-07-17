#!/usr/bin/env python3
# ─────────────────────────────────────────────────────────────────────────────
# test_intake_status.py — verification tests for the read-only intake status.
#
#   python3 scripts/test_intake_status.py
#
# Builds temp fixtures and asserts: no pending, one pending, multiple pending,
# partial sidecar, malformed sidecar, missing sidecar, ready-for-finish,
# validate_catalog interaction, and — critically — that nothing is modified.
# ─────────────────────────────────────────────────────────────────────────────

import json
import sys
import tempfile
from pathlib import Path

_THIS_FILE = Path(__file__).resolve()
sys.path.insert(0, str(_THIS_FILE.parent))
import intake_status as st  # noqa: E402

_failures = []


def check(name, cond):
    print(f"  [{'ok  ' if cond else 'FAIL'}] {name}")
    if not cond:
        _failures.append(name)


# A fully-authored, valid record (real vocab values so validate_catalog passes).
def done_record(wid):
    return {
        "file": f"{wid}.avif", "schema_version": "1", "featured": False,
        "title": "A Real Title", "year": 1990, "work_type": "collage",
        "description": ("Layered mixed-media collage assembling printed ephemera, "
                        "cord, and fabric across a warm ground with drawn marks."),
        "palette": ["ivory", "gold"], "motifs": [], "materials": [],
        "composition": "centered panel", "themes": [], "series": None,
        "keywords": ["collage", "mixed-media"],
    }


def build(root: Path, sidecars=None, thumbs=None, pages=None, catalog=None):
    """Wire intake_status's module paths at a temp fixture and populate it."""
    full = root / "artworks" / "full"
    thumbs_d = root / "artworks" / "thumbs"
    pages_d = root / "artworks" / "pages"
    for d in (full, thumbs_d, pages_d):
        d.mkdir(parents=True, exist_ok=True)
    st.ROOT, st.FULL, st.THUMBS, st.PAGES = root, full, thumbs_d, pages_d
    st.CATALOG = root / "catalog.json"

    for wid, rec in (sidecars or {}).items():
        (full / f"{wid}.json").write_text(rec if isinstance(rec, str)
                                          else json.dumps(rec))
    for wid in (thumbs or []):
        (thumbs_d / f"{wid}.avif").write_bytes(b"\x00")
    for wid in (pages or []):
        (pages_d / f"{wid}.html").write_text("<html></html>")
    st.CATALOG.write_text(json.dumps(catalog if catalog is not None else []))


def fresh():
    return Path(tempfile.mkdtemp())


def test_no_pending_works():
    root = fresh()
    build(root, sidecars={"art0001": done_record("art0001")},
          thumbs=["art0001"], pages=["art0001"],
          catalog=[done_record("art0001")])
    pending, ready = st.scan()
    check("done work -> 0 pending", len(pending) == 0)
    check("done work -> 0 ready", len(ready) == 0)


def test_one_pending_empty_scaffold():
    root = fresh()
    empty = {**done_record("art1085"), "title": "", "work_type": "",
             "description": "", "palette": [], "keywords": []}
    build(root, sidecars={"art1085": empty}, thumbs=["art1085"])
    pending, ready = st.scan()
    check("empty scaffold -> 1 pending", len(pending) == 1)
    check("lists all five missing fields",
          pending and pending[0]["missing"] == st.E_FIELDS)


def test_multiple_pending():
    root = fresh()
    empty = lambda w: {**done_record(w), "title": "", "work_type": "",
                       "description": "", "palette": [], "keywords": []}
    build(root, sidecars={"art1085": empty("art1085"),
                          "art1086": empty("art1086")},
          thumbs=["art1085", "art1086"])
    pending, _ = st.scan()
    check("two empty scaffolds -> 2 pending", len(pending) == 2)


def test_partial_sidecar():
    root = fresh()
    partial = {**done_record("art1086"), "description": "", "keywords": []}
    build(root, sidecars={"art1086": partial}, thumbs=["art1086"])
    pending, _ = st.scan()
    check("partial sidecar -> pending",
          len(pending) == 1 and pending[0]["missing"] == ["description", "keywords"])


def test_malformed_sidecar():
    root = fresh()
    build(root, sidecars={"art1090": "{ not: valid json ,,"}, thumbs=["art1090"])
    pending, _ = st.scan()
    check("malformed sidecar -> pending",
          len(pending) == 1 and pending[0]["note"] == "malformed")
    check("malformed reported as validation issue",
          pending and "malformed sidecar" in pending[0]["issues"][0])


def test_missing_sidecar():
    root = fresh()
    build(root, thumbs=["art1091"])  # ingested, no sidecar
    pending, _ = st.scan()
    check("ingested w/o sidecar -> pending",
          len(pending) == 1 and pending[0]["note"] == "no sidecar yet")
    check("no-sidecar lists all authored fields",
          pending and pending[0]["missing"] == st.E_FIELDS)


def test_ready_for_finish():
    root = fresh()
    # Authored & valid, but no page and not in catalog yet.
    build(root, sidecars={"art1087": done_record("art1087")}, thumbs=["art1087"])
    pending, ready = st.scan()
    check("authored-but-unbuilt -> ready for finish",
          ready == ["art1087"] and len(pending) == 0)


def test_validate_catalog_interaction():
    root = fresh()
    # Fully authored, but an out-of-vocab theme -> validate_catalog flags it.
    rec = {**done_record("art1088"), "themes": ["NotARealTheme"]}
    build(root, sidecars={"art1088": rec}, thumbs=["art1088"])
    pending, ready = st.scan()
    ok = (len(pending) == 1
          and any("out-of-vocab" in i for i in pending[0]["issues"]))
    check("validate_catalog surfaces out-of-vocab theme as issue", ok)
    check("invalid-but-authored work is NOT 'ready'", ready == [])


def test_reports_are_read_only():
    root = fresh()
    empty = {**done_record("art1085"), "title": "", "palette": []}
    build(root, sidecars={"art1085": empty, "art0001": done_record("art0001")},
          thumbs=["art1085", "art0001"], pages=["art0001"],
          catalog=[done_record("art0001")])
    before = {p: p.stat().st_mtime_ns for p in root.rglob("*") if p.is_file()}
    st.scan()
    st.render(*st.scan())
    after = {p: p.stat().st_mtime_ns for p in root.rglob("*") if p.is_file()}
    check("intake status modifies no files", before == after)
    check("intake status creates/deletes no files", set(before) == set(after))


def main():
    print("intake_status.py — verification tests\n")
    saved = (st.ROOT, st.FULL, st.THUMBS, st.PAGES, st.CATALOG)
    try:
        for name, fn in sorted(globals().items()):
            if name.startswith("test_") and callable(fn):
                fn()
    finally:
        st.ROOT, st.FULL, st.THUMBS, st.PAGES, st.CATALOG = saved
    print()
    if _failures:
        print(f"{len(_failures)} test(s) FAILED: {', '.join(_failures)}")
        return 1
    print("All tests passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

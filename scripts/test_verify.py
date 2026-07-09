#!/usr/bin/env python3
# ─────────────────────────────────────────────────────────────────────────────
# test_verify.py — verification tests for the archive verifier.
#
#   python3 scripts/test_verify.py        (also: npm test)
#
# Dependency-free. Builds tiny synthetic archive fixtures in a temp dir, points
# the verifier at them, and asserts each checker returns the expected severity.
# Proves the verifier catches what it claims to — and, critically, that it
# NEVER fails on human-authored omissions.
# ─────────────────────────────────────────────────────────────────────────────

import json
import os
import struct
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import verify  # noqa: E402

PASS, WARNING, FAIL = verify.PASS, verify.WARNING, verify.FAIL

_failures = []


def check(name, cond):
    mark = "ok  " if cond else "FAIL"
    print(f"  [{mark}] {name}")
    if not cond:
        _failures.append(name)


def levels(results):
    return {r.level for r in results}


def worst(results):
    return verify.overall_level(results)


# ── Fixture builder ──────────────────────────────────────────────────────────

_AVIF_HEADER = b"\x00\x00\x00\x20ftypavif\x00\x00\x00\x00avifmif1miafMA1B"


def write_avif(path: Path, valid=True):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(_AVIF_HEADER if valid else b"NOT-AN-IMAGE-AT-ALL-1234")


def build_fixture(root: Path, entries, *, dims=None, lite=None,
                  extra_images=None, corrupt=None):
    """Create a minimal archive tree. `entries` is a list of master records."""
    (root / "catalog.json").write_text(json.dumps(entries))
    lite = entries if lite is None else lite
    (root / "catalog-lite.json").write_text(json.dumps(lite))
    (root / "catalog-home.json").write_text(json.dumps(entries[:1]))
    (root / "changes.json").write_text(json.dumps([]))
    if dims is None:
        dims = {e["file"].rsplit(".", 1)[0]: [400, 800] for e in entries}
    (root / "dims.json").write_text(json.dumps(dims))

    api = root / "api" / "v1"
    api.mkdir(parents=True)
    (api / "works.json").write_text(json.dumps(
        {"count": len(entries), "works": entries}))
    (api / "works").mkdir()
    for e in entries:
        wid = e["file"].rsplit(".", 1)[0]
        (api / "works" / f"{wid}.json").write_text(json.dumps(e))

    corrupt = corrupt or set()
    for e in entries:
        wid = e["file"].rsplit(".", 1)[0]
        for tier in verify.TIERS:
            write_avif(root / "artworks" / tier / f"{wid}.avif",
                       valid=(f"{tier}/{wid}" not in corrupt))
        (root / "artworks" / "full" / f"{wid}.json").write_text(json.dumps(e))
        pg = root / "artworks" / "pages" / f"{wid}.html"
        pg.parent.mkdir(parents=True, exist_ok=True)
        pg.write_text("<html></html>")

    for name in (extra_images or []):
        write_avif(root / "artworks" / "full" / f"{name}.avif")

    # Files the repo-health checker expects.
    (root / "site.min.css").write_text("body{}")
    (root / "sw.js").write_text("const CACHE_V = 'jfsn-1234567890';")
    (root / "sitemap.xml").write_text(
        "<urlset><url><loc>https://x/</loc></url></urlset>")


def entry(wid, **over):
    e = {
        "file": f"{wid}.avif", "title": f"Work {wid}", "year": 1990,
        "work_type": "collage", "orientation": "vertical",
        "schema_version": 1, "favorite": False,
        "themes": [], "materials": [], "motifs": [],  # human-authored, may be empty
    }
    e.update(over)
    return e


def ctx_for(root, full=False):
    verify.ROOT = root
    return verify.Context(full=full)


# ── Tests ────────────────────────────────────────────────────────────────────

def test_clean_archive_passes():
    with tempfile.TemporaryDirectory() as d:
        root = Path(d)
        build_fixture(root, [entry("art0001"), entry("art0002")])
        ctx = ctx_for(root)
        results = verify.run(ctx)
        # No FAIL anywhere on a clean fixture (working-tree warn is possible
        # only in a git repo; temp dir is not one, so that's a WARNING at most).
        check("clean archive has no FAIL", FAIL not in levels(results))


def test_empty_human_fields_never_fail():
    with tempfile.TemporaryDirectory() as d:
        root = Path(d)
        # All human-authored fields empty — must NOT fail.
        build_fixture(root, [entry("art0001", themes=[], materials=[],
                                    motifs=[], description="")])
        ctx = ctx_for(root)
        r = verify.check_required_fields(ctx)
        check("empty themes/materials/motifs never FAIL", worst(r) == PASS)


def test_duplicate_id_fails():
    with tempfile.TemporaryDirectory() as d:
        root = Path(d)
        build_fixture(root, [entry("art0001"), entry("art0001")])
        ctx = ctx_for(root)
        check("duplicate ID -> FAIL",
              worst(verify.check_duplicate_ids(ctx)) == FAIL)


def test_missing_required_field_fails():
    with tempfile.TemporaryDirectory() as d:
        root = Path(d)
        build_fixture(root, [entry("art0001", title="")])
        ctx = ctx_for(root)
        check("empty required title -> FAIL",
              worst(verify.check_required_fields(ctx)) == FAIL)


def test_missing_dimension_fails():
    with tempfile.TemporaryDirectory() as d:
        root = Path(d)
        build_fixture(root, [entry("art0001")], dims={})
        ctx = ctx_for(root)
        check("missing dimensions -> FAIL",
              worst(verify.check_dimensions(ctx)) == FAIL)


def test_orphan_image_warns_but_variant_ok():
    with tempfile.TemporaryDirectory() as d:
        root = Path(d)
        build_fixture(root, [entry("art0001")],
                      extra_images=["art0001-hero", "art9999"])
        ctx = ctx_for(root)
        r = verify.check_orphan_images(ctx)
        # art0001-hero is a recognized variant (fine); art9999 is a true orphan.
        check("true orphan -> WARNING", worst(r) == WARNING)
        check("hero variant not counted as orphan",
              all("art0001-hero" not in x.detail for x in r))


def test_corrupt_image_fails_separately_from_absence():
    with tempfile.TemporaryDirectory() as d:
        root = Path(d)
        build_fixture(root, [entry("art0001")],
                      corrupt={"thumbs/art0001"})
        ctx = ctx_for(root)
        check("corrupt AVIF -> FAIL",
              worst(verify.check_image_corruption(ctx)) == FAIL)
        # Absence is a different checker; corruption checker skips missing files.
        check("tier-presence still PASS when file merely corrupt",
              worst(verify.check_tier_presence(ctx)) == PASS)


def test_lite_drift_fails():
    with tempfile.TemporaryDirectory() as d:
        root = Path(d)
        build_fixture(root, [entry("art0001"), entry("art0002")],
                      lite=[entry("art0001")])  # lite missing art0002
        ctx = ctx_for(root)
        check("catalog-lite drift -> FAIL",
              worst(verify.check_lite_consistency(ctx)) == FAIL)


def test_invalid_json_fails():
    with tempfile.TemporaryDirectory() as d:
        root = Path(d)
        build_fixture(root, [entry("art0001")])
        (root / "broken.json").write_text("{ not valid json ,, }")
        ctx = ctx_for(root)
        check("invalid JSON -> FAIL",
              worst(verify.check_json_validity(ctx)) == FAIL)


def test_read_only_leaves_fixture_unchanged():
    with tempfile.TemporaryDirectory() as d:
        root = Path(d)
        build_fixture(root, [entry("art0001"), entry("art0002")])
        before = {p: p.stat().st_mtime_ns for p in root.rglob("*") if p.is_file()}
        ctx = ctx_for(root)
        verify.run(ctx)
        after = {p: p.stat().st_mtime_ns for p in root.rglob("*") if p.is_file()}
        check("verifier modifies no files", before == after)
        check("verifier creates/deletes no files", set(before) == set(after))


def main():
    print("verify.py — verification tests\n")
    saved_root = verify.ROOT
    try:
        for name, fn in sorted(globals().items()):
            if name.startswith("test_") and callable(fn):
                fn()
    finally:
        verify.ROOT = saved_root
    print()
    if _failures:
        print(f"{len(_failures)} test(s) FAILED: {', '.join(_failures)}")
        return 1
    print("All tests passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

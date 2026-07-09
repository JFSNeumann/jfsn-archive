#!/usr/bin/env python3
# ─────────────────────────────────────────────────────────────────────────────
# test_intake.py — verification tests for the intake orchestrator.
#
#   python3 scripts/test_intake.py
#
# The real ingest (heavy image deps + side effects) is substituted with a mock
# that simulates writing thumbnails. Every other tool runs for real against a
# temp fixture. Asserts the orchestration sequence, the automation/authorship
# boundary, error handling, and that NO catalog/page/deploy work occurs.
# ─────────────────────────────────────────────────────────────────────────────

import io
import json
import sys
import tempfile
from contextlib import redirect_stdout, redirect_stderr
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import intake  # noqa: E402
import scaffold_sidecar  # noqa: E402
import intake_status  # noqa: E402

_failures = []


def check(name, cond):
    print(f"  [{'ok  ' if cond else 'FAIL'}] {name}")
    if not cond:
        _failures.append(name)


def wire(root: Path):
    """Point every tool at a temp fixture and return key dirs."""
    inbox = root / "artworks" / "inbox"
    thumbs = root / "artworks" / "thumbs"
    full = root / "artworks" / "full"
    pages = root / "artworks" / "pages"
    for d in (inbox, thumbs, full, pages):
        d.mkdir(parents=True, exist_ok=True)
    (root / "catalog.json").write_text("[]")

    intake.INBOX = inbox
    intake.THUMBS = thumbs
    intake.INBOX_EXTS = {".jpg", ".png", ".heic"}
    intake.INGEST_SCRIPT = root / "artworks" / "ingest.py"
    intake.INGEST_SCRIPT.write_text("# stub")  # existence check only

    scaffold_sidecar.FULL = full
    intake_status.ROOT = root
    intake_status.FULL = full
    intake_status.THUMBS = thumbs
    intake_status.PAGES = pages
    intake_status.CATALOG = root / "catalog.json"
    return inbox, thumbs, full, pages


def mock_ingest(thumbs: Path, new_ids, before_high=1084, rc=0):
    """Return a run_ingest replacement that writes thumbs for new_ids."""
    def _run():
        if rc == 0:
            for wid in new_ids:
                (thumbs / f"{wid}.avif").write_bytes(b"\x00")
        return rc
    return _run


def run_intake():
    out, err = io.StringIO(), io.StringIO()
    with redirect_stdout(out), redirect_stderr(err):
        rc = intake.main()
    return rc, out.getvalue(), err.getvalue()


def test_empty_inbox():
    root = Path(tempfile.mkdtemp())
    inbox, thumbs, full, _ = wire(root)
    called = {"ingest": False}
    intake.run_ingest = lambda: called.__setitem__("ingest", True) or 0
    rc, out, _ = run_intake()
    check("empty inbox -> exit 0", rc == 0)
    check("empty inbox never runs ingest", called["ingest"] is False)
    check("empty inbox creates no sidecars", not list(full.glob("*.json")))


def test_normal_intake():
    root = Path(tempfile.mkdtemp())
    inbox, thumbs, full, pages = wire(root)
    (inbox / "photo.jpg").write_bytes(b"\x00")
    intake.run_ingest = mock_ingest(thumbs, ["art1085"])
    rc, out, _ = run_intake()
    check("normal intake -> exit 0", rc == 0)
    check("scaffold created for new ID", (full / "art1085.json").exists())
    check("no pages generated (no page written)", not list(pages.glob("*.html")))
    check("catalog.json untouched ([])", root.joinpath("catalog.json").read_text() == "[]")
    check("messaging shows completion", "Catalog Intake Complete" in out)
    check("messaging names the new work", "art1085" in out)
    check("messaging points to authorship", "require curator authorship" in out)
    check("messaging points to status command", "archive intake status" in out)


def test_multiple_new_artworks():
    root = Path(tempfile.mkdtemp())
    inbox, thumbs, full, _ = wire(root)
    (inbox / "a.jpg").write_bytes(b"\x00")
    ids = ["art1085", "art1086", "art1087"]
    intake.run_ingest = mock_ingest(thumbs, ids)
    rc, out, _ = run_intake()
    check("multiple -> exit 0", rc == 0)
    check("every new work has a scaffold",
          all((full / f"{w}.json").exists() for w in ids))


def test_ingest_failure():
    root = Path(tempfile.mkdtemp())
    inbox, thumbs, full, _ = wire(root)
    (inbox / "a.jpg").write_bytes(b"\x00")
    intake.run_ingest = mock_ingest(thumbs, ["art1085"], rc=1)
    rc, out, err = run_intake()
    check("ingest failure -> exit 1", rc == 1)
    check("ingest failure stops before scaffolding",
          not list(full.glob("*.json")))
    check("ingest failure explains itself", "Ingest failed" in err)


def test_scaffold_failure():
    root = Path(tempfile.mkdtemp())
    inbox, thumbs, full, _ = wire(root)
    (inbox / "a.jpg").write_bytes(b"\x00")
    intake.run_ingest = mock_ingest(thumbs, ["art1085"])
    orig = scaffold_sidecar.write_sidecar
    scaffold_sidecar.write_sidecar = lambda *a, **k: (_ for _ in ()).throw(OSError("disk full"))
    try:
        rc, out, err = run_intake()
    finally:
        scaffold_sidecar.write_sidecar = orig
    check("scaffold failure -> exit 1", rc == 1)
    check("scaffold failure explains itself", "Scaffolding failed" in err)


def test_existing_sidecar_collision():
    root = Path(tempfile.mkdtemp())
    inbox, thumbs, full, _ = wire(root)
    (inbox / "a.jpg").write_bytes(b"\x00")
    # A sidecar with real content already exists for the id ingest will assign.
    (full / "art1085.json").write_text('{"title": "Human Authored"}')
    intake.run_ingest = mock_ingest(thumbs, ["art1085"])
    rc, out, _ = run_intake()
    check("collision -> still exit 0", rc == 0)
    check("collision does NOT overwrite existing sidecar",
          json.loads((full / "art1085.json").read_text())["title"] == "Human Authored")
    check("collision reported as left untouched", "left untouched" in out)


def test_status_reflects_new_state():
    root = Path(tempfile.mkdtemp())
    inbox, thumbs, full, _ = wire(root)
    (inbox / "a.jpg").write_bytes(b"\x00")
    intake.run_ingest = mock_ingest(thumbs, ["art1085"])
    rc, out, _ = run_intake()
    # The appended intake-status report should list the scaffolded work as pending.
    check("status section present in output", "Catalog Intake Status" in out)
    check("new work shown pending in status",
          "Pending authorship: 1" in out)


def main():
    print("intake.py — verification tests\n")
    saved = (intake.INBOX, intake.THUMBS, intake.INBOX_EXTS,
             intake.INGEST_SCRIPT, intake.run_ingest,
             scaffold_sidecar.FULL,
             intake_status.ROOT, intake_status.FULL,
             intake_status.THUMBS, intake_status.PAGES, intake_status.CATALOG)
    try:
        for name, fn in sorted(globals().items()):
            if name.startswith("test_") and callable(fn):
                fn()
    finally:
        (intake.INBOX, intake.THUMBS, intake.INBOX_EXTS,
         intake.INGEST_SCRIPT, intake.run_ingest,
         scaffold_sidecar.FULL,
         intake_status.ROOT, intake_status.FULL,
         intake_status.THUMBS, intake_status.PAGES, intake_status.CATALOG) = saved
    print()
    if _failures:
        print(f"{len(_failures)} test(s) FAILED: {', '.join(_failures)}")
        return 1
    print("All tests passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

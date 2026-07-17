#!/usr/bin/env python3
# ─────────────────────────────────────────────────────────────────────────────
# test_intake_finish.py — verification tests for the finish orchestrator.
#
#   python3 scripts/test_intake_finish.py
#
# Every stage seam (validate / build / gen-pages / changes / verify) and the
# intake_status scan are substituted, so the real heavy tools never run. Asserts
# the fixed sequence, that validation blocks publication, that verify is always
# the final gate, and that NO git/deploy work is even referenced.
# ─────────────────────────────────────────────────────────────────────────────

import io
import sys
from contextlib import redirect_stdout, redirect_stderr
from pathlib import Path

_THIS_FILE = Path(__file__).resolve()
sys.path.insert(0, str(_THIS_FILE.parent))
import intake_finish as fin  # noqa: E402
import intake_status  # noqa: E402

_failures = []


def check(name, cond):
    print(f"  [{'ok  ' if cond else 'FAIL'}] {name}")
    if not cond:
        _failures.append(name)


class Recorder:
    """Records stage calls in order and returns programmed exit codes."""
    def __init__(self, fail_at=None):
        self.calls = []
        self.fail_at = fail_at  # stage name that should return rc=1

    def _rc(self, stage):
        return 1 if stage == self.fail_at else 0

    def validate(self, from_id):
        self.calls.append("validate")
        return self._rc("validate"), "validation output"

    def build_catalog(self):
        self.calls.append("build")
        return self._rc("build"), "build output"

    def gen_pages(self, ids):
        self.calls.append("gen")
        return self._rc("gen"), "gen output"

    def build_changes(self):
        self.calls.append("changes")
        return self._rc("changes"), "changes output"

    def verify(self):
        self.calls.append("verify")
        return self._rc("verify"), "verify output"


def install(rec: Recorder, pending=None, ready=None):
    fin.run_validate = rec.validate
    fin.run_build_catalog = rec.build_catalog
    fin.run_gen_pages = rec.gen_pages
    fin.run_build_changes = rec.build_changes
    fin.run_verify = rec.verify
    intake_status.scan = lambda: (pending or [], ready or [])


def run():
    out, err = io.StringIO(), io.StringIO()
    with redirect_stdout(out), redirect_stderr(err):
        rc = fin.main()
    return rc, out.getvalue(), err.getvalue()


def test_successful_finish():
    rec = Recorder()
    install(rec, ready=["art1085", "art1086"])
    rc, out, _ = run()
    check("successful finish -> exit 0", rc == 0)
    check("fixed sequence executed",
          rec.calls == ["validate", "build", "gen", "changes", "verify"])
    check("report shows READY", "READY" in out and "NOT READY" not in out)
    check("report shows Verified PASS", "Verified:\n  PASS" in out)
    check("no commit/deploy performed (stated)", "No commit or deployment" in out)


def test_multiple_completed_artworks():
    rec = Recorder()
    install(rec, ready=["art1085", "art1086", "art1087"])
    rc, out, _ = run()
    check("multiple -> exit 0", rc == 0)
    check("all validated listed", all(w in out for w in
                                      ("art1085", "art1086", "art1087")))


def test_no_completed_artworks():
    rec = Recorder()
    install(rec, pending=[], ready=[])
    rc, out, _ = run()
    check("nothing to finish -> exit 0", rc == 0)
    check("nothing-to-finish runs no stages", rec.calls == [])
    check("nothing-to-finish message", "Nothing to finish" in out)


def test_validation_blocks_on_pending():
    rec = Recorder()
    install(rec, pending=[{"id": "art1085",
                           "missing": ["title", "description"],
                           "issues": [], "note": None}],
            ready=["art1086"])
    rc, out, err = run()
    check("pending work -> exit 1", rc == 1)
    check("validation blocks BEFORE any build", rec.calls == [])
    check("names the blocking work", "art1085" in err)
    check("failure names the stage", "Validate authored sidecars" in err)


def test_validation_failure_from_tool():
    rec = Recorder(fail_at="validate")
    install(rec, ready=["art1085"])
    rc, out, err = run()
    check("validator rejects -> exit 1", rc == 1)
    check("stops after validate, no build", rec.calls == ["validate"])


def test_build_failure():
    rec = Recorder(fail_at="build")
    install(rec, ready=["art1085"])
    rc, out, err = run()
    check("build failure -> exit 1", rc == 1)
    check("stops after build, no page gen", rec.calls == ["validate", "build"])
    check("build failure names stage", "Rebuild catalogs" in err)


def test_page_generation_failure():
    rec = Recorder(fail_at="gen")
    install(rec, ready=["art1085"])
    rc, out, err = run()
    check("page-gen failure -> exit 1", rc == 1)
    check("stops after gen, no changes", rec.calls == ["validate", "build", "gen"])


def test_verify_failure_is_final_gate():
    rec = Recorder(fail_at="verify")
    install(rec, ready=["art1085"])
    rc, out, _ = run()
    check("verify failure -> exit 1", rc == 1)
    check("all stages ran; verify is last",
          rec.calls == ["validate", "build", "gen", "changes", "verify"])
    check("report shows NOT READY", "NOT READY" in out)
    check("report shows Verified FAIL", "Verified:\n  FAIL" in out)


def test_no_git_or_deploy_referenced():
    """The finish orchestrator must never reference git or deploy tooling."""
    src = (Path(fin.__file__)).read_text()
    for token in ("git ", "deploy-hostgator", "session-end", '"push"',
                  "'push'", "git commit", "subprocess.run(['git",
                  'subprocess.run(["git'):
        check(f"source does not invoke {token.strip()!r}", token not in src)


def main():
    print("intake_finish.py — verification tests\n")
    saved = (fin.run_validate, fin.run_build_catalog, fin.run_gen_pages,
             fin.run_build_changes, fin.run_verify, intake_status.scan)
    try:
        for name, fn in sorted(globals().items()):
            if name.startswith("test_") and callable(fn):
                fn()
    finally:
        (fin.run_validate, fin.run_build_catalog, fin.run_gen_pages,
         fin.run_build_changes, fin.run_verify, intake_status.scan) = saved
    print()
    if _failures:
        print(f"{len(_failures)} test(s) FAILED: {', '.join(_failures)}")
        return 1
    print("All tests passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

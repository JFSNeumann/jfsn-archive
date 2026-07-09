# `archive verify` — the Conservator's Inspection

*Phase 1 of the JFSN Stewardship Automation Program.*
*Read-only. It reports; humans decide.*

## Purpose

One command answers one question:

> **Can this archive still be trusted?**

`archive verify` inspects the archive's integrity — metadata, images, catalogs,
generated artifacts, and repository state — and reports `PASS` / `WARNING` /
`FAIL` per category. It is a conservator's inspection, not a test runner.

It is the single command to run **before every deployment** and **after every
major cataloging session.**

## Guarantee

The verifier is strictly **read-only**. It never modifies, regenerates, repairs,
or infers a single byte of the archive. This is enforced by a test
(`test_read_only_leaves_fixture_unchanged`) that asserts no file is created,
deleted, or altered during a full run.

Human-authored omissions — empty `themes`, `materials`, `motifs`, `composition`,
or `description` — are **never** a `FAIL`. Incompleteness of authorship is not
corruption of record (CONSTITUTION §IX: *uncertainty is data*).

## Usage

```bash
archive verify              # full inspection, human-readable report
archive verify --full       # also decode-check every image tier (slower)
archive verify --json       # machine-readable output (for hooks / CI)
archive verify --quiet      # no ANSI color

npm run verify              # equivalent to `archive verify`
python3 scripts/verify.py   # equivalent, no wrapper needed
```

**Exit codes:** `0` = no integrity FAILURES (PASS or WARNING); `1` = one or more
FAIL. A `WARNING` never blocks — it is a curator review item, not a failure.

**Timing:** ~0.8s default; ~1.2s with `--full` (decode-checks all five tiers,
~5,400 images). Deterministic.

## What it checks

| Category | Checks |
|---|---|
| **Metadata Integrity** | JSON validity (whole tree); required structural fields (`file, title, year, work_type, orientation`) present & non-empty; duplicate IDs; duplicate filenames; `schema_version` uniformity. |
| **Image Integrity** | Every work present in every tier (`full, medium, thumbs, mini, micro`); dimensions present & positive in `dims.json`; AVIF container-magic decode (default: `thumbs`; `--full`: all tiers). **Absence and corruption are reported separately.** |
| **Catalog Consistency** | `catalog-lite`, `catalog-home`, `api/v1/works.json`, `api/v1/works/*.json`, and `artworks/full/*.json` all agree with the master `catalog.json`; dims coverage; favorites survive into projections. |
| **Generated Artifacts** | `sitemap.xml` artwork URLs resolve; every work has a rendered page; `changes.json` references real works. **Drift detection only — never regenerates.** |
| **Repository Health** | Expected generated files present & non-empty; `sw.js` `CACHE_V` format; working-tree cleanliness (WARNING — `pre-deploy-check.sh` remains the hard deploy gate). |
| **Informational** | Vocabulary drift, capitalization/synonym clusters in controlled fields, unusual years. **Report only — never fails.** |

### Report structure — integrity vs. workflow state

The report is deliberately split so repository workflow never dilutes the trust
answer:

- **Archive Integrity** — Metadata, Image, Catalog, and Generated-Artifact
  results. These four sections alone determine **Overall Archive Integrity**.
- **Repository State** — working tree (CLEAN/DIRTY) and deployment readiness.
  Informational only; it cannot change the integrity verdict. A repository may be
  intentionally dirty mid-session while the archive is perfectly healthy.
- **Informational** — curatorial review items (vocabulary drift, unusual years).
- **Archive Trust Summary** — total Failures/Warnings and the integrity verdict.

The `--json` output is unchanged: it still reports a single `overall` (max across
all sections) plus per-section levels, for any hook that consumes it.

### Severity philosophy

- **FAIL** — objective integrity problems: invalid JSON, duplicate IDs, missing
  images/dimensions, corrupt images, broken catalog↔projection ID sets, dangling
  references.
- **WARNING** — a curator should look, but the record is not corrupt: orphan
  images, projection field drift, dirty working tree, mixed schema versions.
- **PASS / INFO** — clean, or human-authored omissions and vocabulary notes.

## Design

- One file, `scripts/verify.py`, Python standard library only — no dependencies.
- A `Context` loads every data source once. Each checker is a small, independent
  function registered with `@checker("Section")` returning `Result`s. The runner
  executes **all** checkers even if one fails or errors.
- To extend: add a `@checker`-decorated function. It joins the inspection
  automatically. Keep each check focused on one question.
- Known non-catalog image variants (`-hero`, `-hero-m`, `-mobile`, `-lcp`, …)
  are recognized and never reported as orphans.

## Tests

```bash
npm test                        # or: python3 scripts/test_verify.py
```

Builds synthetic archive fixtures in a temp dir and asserts each checker's
severity, including that empty human-authored fields never fail and that the
verifier changes no files.

## Known standing findings (as of first run, 2026-07-09)

- **Catalog Consistency — WARNING:** ~139 `artworks/full/*.json` files record
  `orientation` as `portrait`/`landscape`/`null`, while the master and
  `catalog-lite` use `vertical`/`horizontal`/`square` (per CLAUDE.md, sourced
  from `dims.json`). This is projection drift in the per-artwork files, not
  master corruption. Left for curatorial decision — the verifier does not repair.

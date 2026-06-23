# JFSN Archive — Daily Workflow

## Overview

```
catalog.py          →  validate_catalog.py  →  build_catalog.py
(generate sidecars)    (QA gate)               (publish)
```

Run these scripts from the project root (`/Documents/JFSN/`).

---

## 1. Generate new sidecars

```bash
export ANTHROPIC_API_KEY=sk-ant-...

# Test on a small batch first
python3 artworks/catalog.py --limit 5

# Review the 5 output JSONs in artworks/full/ before proceeding
# Full batch
python3 artworks/catalog.py --workers 4
```

**Cost:** ~$0.01–0.02 per image for any new works added.  
**Resumable:** already-processed AVIFs are skipped automatically.  
**Errors:** written to `artworks/logs/catalog_errors.jsonl` (JSONL — queryable with `jq`). Re-running picks them up.

---

## 2. Validate

```bash
# During the pre-repass period (until repass_descriptions.py runs):
python3 artworks/validate_catalog.py --legacy-ok --quiet

# After repass_descriptions.py has run, use strict mode:
python3 artworks/validate_catalog.py --quiet

# To validate only the records from the latest batch:
python3 artworks/validate_catalog.py --legacy-ok --from art0141 --quiet

# Full report with vocabulary statistics:
python3 artworks/validate_catalog.py --legacy-ok --stats
```

Exit code 0 = clean (or only legacy warnings). Exit code 1 = real errors to fix.

**Watch for:** keywords with >10 uses in the stats output — early sign of vocabulary drift.

---

## 3. Publish

```bash
python3 artworks/build_catalog.py
```

Outputs: `catalog.json`, `catalog-lite.json`, `catalog-home.json`, `sitemap.xml`.  
Run this after every validated batch. No harm in running it multiple times.

---

## One-time operations

### Fix legacy description openers — ✅ COMPLETE (all migrations done 2026-06-06)
All 1,084 records pass strict validation. `repass_descriptions.py` has been run.
Journal diffs in `artworks/logs/repass-YYYYMMDD.jsonl` for audit if needed.

### When schema changes
1. Update `SYSTEM_PROMPT` in `catalog.py`
2. Update `validate_record()` in `catalog.py`
3. Update `validate()` in `validate_catalog.py`
4. Bump `schema_version` in both files (e.g. `"1"` → `"2"`)
5. Write a `repass_*.py` migration script for any existing records that need updating
6. Run migration script + `validate_catalog.py` before next batch

### Rebuild pixel dimensions (run after adding new thumbs)
```bash
python3 artworks/build_dims.py
```

---

## Featured works

Edit `featured.txt` — one artwork ID per line (e.g. `art0075`). Lines starting with `#` are comments.  
Run `build_catalog.py` to apply. Featured works appear first on the homepage.

---

## Data files (what each root-level JSON does)

| File | Role | Consumed by |
|---|---|---|
| `featured.txt` | Controls homepage artwork selection | `build_catalog.py` |
| `pending-themes.json` | Pre-seeds `year` and `themes` for uncataloged stubs | `build_catalog.py` |
| `curate-session.json` | `curate.html` tool state (theme-by-theme curation) | `curate.html` only — **not** a build input |
| `dims.json` | Pixel dimensions for masonry layout | Archive HTML pages |

`pending-themes.json` and `curate-session.json` serve different purposes and do not conflict. `featured.txt` is the canonical source for homepage selection.

---

## Open Archive API

`build_catalog.py` automatically generates `api/v1/` alongside the catalog files.

| Endpoint | Description |
|---|---|
| `api/v1/meta.json` | Discovery — counts, all endpoint URLs, license, citation |
| `api/v1/works.json` | All cataloged works (compact JSON) |
| `api/v1/works/{id}.json` | Single work + asset links (one file per work) |
| `api/v1/themes.json` | Theme index with work IDs and counts |
| `api/v1/series.json` | Named series (XXIII, Squadron, Guernica) index |
| `api/v1/motifs.json` | Motif vocabulary index with work IDs |
| `api/v1/palette.json` | Palette color index with work IDs |
| `api/.htaccess` | CORS headers for Apache/cPanel (auto-generated) |

Documentation page: `api.html` — upload alongside the other HTML files.

---

## Git hooks (one-time setup after cloning)

Run `bash setup-hooks.sh` once after cloning this repo. It copies `hooks/pre-commit`
into `.git/hooks/pre-commit` — git never installs hooks automatically, and anything
placed directly in `.git/hooks/` is local to that one clone and invisible to everyone
else (this is how the pre-commit checks below went uninstalled on a fresh machine
until this script existed, 2026-06-23). The hook runs on every `git commit`:
navigation audit (`audit-nav.sh`), a real CSS rebuild-and-diff check when HTML/JS
changed (not just "is site.min.css staged" — a content-free edit legitimately
produces no CSS diff and shouldn't be blocked), and a CACHE_V-bump check when
`site.min.css` changed. Edit `hooks/pre-commit` (the tracked copy, not `.git/hooks/`)
and re-run `setup-hooks.sh` to update it.

## Scripts reference

| Script | Purpose | When to run |
|---|---|---|
| `artworks/catalog.py` | Generate JSON sidecars via API | When new AVIFs are added |
| `artworks/validate_catalog.py` | QA check all sidecars | After every generation batch |
| `artworks/build_catalog.py` | Publish catalog.json + api/v1/ outputs | After validation passes |
| `artworks/build_dims.py` | Rebuild dims.json from thumbnails | After new thumbs are added |
| `artworks/repass_existing.py` | Apply retroactive rule fixes | After schema rule changes |
| `artworks/repass_descriptions.py` | Fix legacy description openers | ✅ Done — all migrations complete |
| `artworks/repass_installation_view.py` | Migrate installation_view → photograph | Run once (6 records) |
| `artworks/vocab.py` | Single source of truth for controlled vocabularies | Edit to add/change vocab terms |

## QA tool

Open `qa.html` locally (via `python3 server.py` then http://localhost:8000/qa.html) to visually review the archive for issues: missing year, empty motifs/materials/themes, short descriptions, uncataloged stubs, and keyword drift. Read-only — click any thumbnail to open the artwork page.

---

## Per-deploy hygiene

- After meaningful CSS/HTML changes that returning visitors should see immediately, bump `CACHE_V` in `sw.js`. Convention: `jfsn-YYYYMMDD-<reason>` (e.g. `jfsn-20260603-drop-site-css`).
- When adding new top-level pages, add them to `entries[]` in `artworks/build_catalog.py` so they end up in `sitemap.xml`.

---

## Schema quick reference

```json
{
  "file":           "art0001.avif",
  "title":          "Effigy in Red",
  "year":           null,
  "work_type":      "collage",
  "description":    "Two sentences, max 55 words. No A/An/The opener.",
  "palette":        ["vermilion", "gold", "ivory", "black"],
  "motifs":         ["compact-disc", "photographic-face"],
  "materials":      ["paper", "paint"],
  "composition":    "axial vertical totem on flat ground",
  "themes":         ["Mr. Snowmann", "Torsos & Faces", "Totems"],
  "series":         null,
  "keywords":       ["lace-cross-arrangement", "cardinal-disc-placement"],
  "featured":       false,
  "schema_version": "1"
}
```

**Controlled vocabularies** — edit `artworks/vocab.py` only, never duplicate:  
- `palette`: 20 terms  
- `motifs`: 30 terms  
- `materials`: 15 terms  
- `themes`: 10 terms  
- `series`: Guernica · null  (XXIII and Squadron retired — use Guernica or null)
- `work_type`: collage · sculpture · painting · photograph  
  _(installation_view deprecated — run `repass_installation_view.py`)_

For photograph records: `motifs`, `materials`, `composition` are optional. Use theme "Gallery" for exhibition views, "Studio" for studio shots.

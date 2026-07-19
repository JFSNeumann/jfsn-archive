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
| `dims.json` | Pixel dimensions for masonry layout | Archive HTML pages |

`featured.txt` is the canonical source for homepage selection. (`pending-themes.json` and `curate-session.json` — the pre-seeding/theme-curation data files this table used to list — no longer exist on disk; their consumers, the theme-by-theme dating pass and the `curate.html` tool, both finished their job and were removed. Cataloging is at 100% coverage, 1,084/1,084 — see `CURRENT_STATE.md`.)

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

The endpoints are live and undocumented — `api.html` (the docs page) was deleted 2026-07-16 in the pruning to 14 core pages; archive.html points visitors at the GitHub repo instead. **Confirmed with Jeff 2026-07-19: staying that way** — no known external consumer justifies rebuilding a docs page speculatively. Don't re-link `/api.html` unless that changes.

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
| ~~`artworks/repass_installation_view.py`~~ | Migrated installation_view → photograph | ✅ Done — script removed after running; catalog.json has zero remaining `installation_view` records (verified 2026-07-19) |
| `artworks/vocab.py` | Single source of truth for controlled vocabularies | Edit to add/change vocab terms |

## QA tool

`qa.html` (visual review tool: missing year, empty motifs/materials/themes, short descriptions, uncataloged stubs, keyword drift) was deleted 2026-07-16 in the pruning to 14 core pages. Run `artworks/validate_catalog.py` for the equivalent checks from the command line. **Confirmed with Jeff 2026-07-19: staying that way** — cataloging is at 100% coverage (1,084/1,084), the tool's original job is done, and `validate_catalog.py` covers ongoing QA for any future additions. Worth rebuilding if a large new batch of works gets added and visual review becomes valuable again — not before.

---

## Working History Collection — charter has dangling page references

`docs/sources/working-history/WORKING-HISTORY-CHARTER-v1.0.md` governs `working-history.html` and is marked "approved, permanent... architectural decisions recorded here are closed" — i.e. it's meant to keep being consulted for future work on that collection, not just a dated snapshot. Per `CLAUDE.md`'s doc taxonomy, `docs/sources/` is only ever added to, never revised, so this note lives here instead of editing the charter itself.

**As of 2026-07-19, the charter (and `docs/sources/oral-history/master-notes.md`) reference several pages as hand-authored siblings or next-step targets that no longer exist** — deleted in the 2026-07-16 pruning to 14 core pages: `start-here.html`, `why-i-made-things.html`, `imagined-museum.html`, `series-index.html`, `lost.html`. If you're expanding the Working History Collection and the charter tells you to add a card/link to one of these, don't — check the current 14-page list first (`DESIGN-SYSTEM.md` § "Architecture" has it) and find the equivalent live page, or ask Jeff whether the referenced page should come back.

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
  _(installation_view deprecated — the migration script already ran and was removed; catalog.json has zero remaining occurrences as of 2026-06-23. If it ever reappears, fix by hand: work_type "photograph" + theme "Gallery" or "Studio")_

For photograph records: `motifs`, `materials`, `composition` are optional. Use theme "Gallery" for exhibition views, "Studio" for studio shots.

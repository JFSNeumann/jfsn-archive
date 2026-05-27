# Vocab Migrations

Versioned scripts for updating existing JSON sidecars when the vocabulary changes.

Similar to database migrations: each script has a number, runs once, and is kept for record.

---

## When to add a migration

Any time you:
- Rename a theme (e.g. `"Snowmann"` → `"Mr. Snowmann"`)
- Remove a theme or series from the vocabulary
- Merge two series into one
- Reclassify a work type

Update `artist-config.json` first (that governs all new cataloging).
Then write a migration script to fix the existing 140+ sidecars.

---

## Running a migration

```bash
python3 vocab-migrations/001_remove_aviation_reliquaries.py           # dry-run
python3 vocab-migrations/001_remove_aviation_reliquaries.py --run     # apply
```

Always dry-run first. The script prints every sidecar it would change.

---

## Naming convention

```
NNN_short_description.py
```

- `NNN` — zero-padded sequential number (001, 002, …)
- Short description of what the migration does

---

## History

| # | Script | What it did | Date |
|---|--------|-------------|------|
| 001 | `001_remove_aviation_reliquaries.py` | Removed Aviation, Reliquaries, Totems themes; remapped XXIII→Guernica and Squadron→Guernica series | 2026-05-27 |
| 002 | `002_fix_catalog_batch_results.py` | Moved Guernica from themes→series (31 records); removed multicolor/multicolored palette terms (3 records); removed torso motif (1 record). Added cassette, keyboard, tape, torso to VALID_MOTIFS in artist-config.json. | 2026-05-27 |

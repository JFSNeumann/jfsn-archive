# Catalog Intake — Stewardship Automation (Phase 2)

*Automate execution. Never automate authorship.*
*The scaffolder creates structure. The curator creates history.*

Phase 2 removes the repetitive mechanics of adding a new artwork while leaving
every curatorial decision — title, date, description, themes, motifs,
provenance, uncertainty — entirely to the human.

## Phase 2.1 — Sidecar Scaffolder (implemented)

`scripts/scaffold_sidecar.py` creates an empty, schema-correct metadata sidecar
(`artworks/full/artNNNN.json`) for one or more newly-assigned artwork IDs. It
writes **structure only**: the deterministic fields (`file`, `schema_version`,
`featured`) and every curator-authored field present but intentionally empty. It
invents no metadata.

### Usage

```bash
python3 scripts/scaffold_sidecar.py art1085              # one work
python3 scripts/scaffold_sidecar.py art1085 art1086      # several
python3 scripts/scaffold_sidecar.py 1085                 # bare number ok → art1085
python3 scripts/scaffold_sidecar.py art1085 --force      # overwrite existing
```

**Exit codes:** `0` = every requested sidecar freshly created (or forced);
`1` = one or more already existed and were skipped (nothing overwritten);
`2` = invalid input — the whole batch is refused and no files are written.

### Behavior guarantees

- **Never overwrites** an existing sidecar without `--force`.
- **Atomic input validation:** a single bad ID refuses the entire batch before
  writing anything, so a typo never leaves a partial, misnamed set.
- **Deterministic:** same IDs in, byte-identical files out.
- **Reversible:** the only effect is new files under `artworks/full/`; delete
  them to undo.
- **Invents nothing:** all authored fields are empty/`null`.

### Generated sidecar

```json
{
  "file": "art1085.avif",
  "schema_version": "1",
  "featured": false,
  "title": "",
  "year": null,
  "work_type": "",
  "description": "",
  "palette": [],
  "motifs": [],
  "materials": [],
  "composition": "",
  "themes": [],
  "series": null,
  "keywords": []
}
```

### Compatibility with `validate_catalog.py`

Run on a fresh scaffold, the validator reports **no structural errors** (no
missing fields, `file` matches the filename, `schema_version` is `"1"`,
`year: null` accepted). The only errors it raises are **completeness gates** —
empty `work_type`, `palette`, `keywords`, and `description` — which is exactly
what forces curator authorship before the work is published. The scaffolder
makes the authored file easy to start; the validator remains the authority on
whether it is finished.

### Design decisions

- **`schema_version` is the string `"1"`, and `file` carries the `.avif`
  extension** — matching what `validate_catalog.py` and `build_catalog.py`
  actually require on disk (not the illustrative values in the design brief).
- **Derived fields are omitted** (`orientation`, `year_display`,
  `year_precision`, `composite`). `build_catalog.py` computes these from
  `dims.json`, the year, themes, and title — duplicating them here would either
  repeat a derivation or place empty values that look authored.
- **Not yet wired into an `archive intake` command.** The scaffolder is a
  standalone tool; the orchestrating `intake` command is Phase 2.3.

### Tests

`python3 scripts/test_scaffold.py` (also part of `npm test`) covers single &
multiple IDs, existing-sidecar protection, `--force`, malformed input (atomic
refuse), valid-JSON output, absence of invented metadata, and the
`validate_catalog.py` structural-pass / completeness-gate split.

## Phase 2.2 — Intake Status (implemented)

`scripts/intake_status.py` answers one question, **strictly read-only**:

> What work is waiting for the curator?

It reports artworks that have entered the pipeline but are not yet fully
cataloged, in two groups, and modifies nothing.

### Usage

```bash
python3 scripts/intake_status.py            # human-readable report
python3 scripts/intake_status.py --json     # machine-readable
```

Always exits `0` — it is observation, not a gate.

### What it reports

- **Pending Authorship** — a work with an empty required authored field
  (`title`, `work_type`, `description`, `palette`, `keywords`), an ingested work
  with no sidecar yet, or a malformed sidecar. Each lists exactly which fields
  are missing, plus any `validate_catalog.py` issues on fields that *are*
  present (e.g. an out-of-vocab theme).
- **Ready for Finish** — a work whose sidecar is authored and valid but not yet
  built into a page and the catalog.

### Scoping — why the settled corpus never appears

A work is **done** (and excluded) when its required authored fields are filled,
it has a rendered page, and it is in `catalog.json`. The validator is run only
on works that are *not* done, so the 1,084 published works never surface here
and legacy stylistic debt is not resurfaced as intake work. On a clean repo the
report is `Pending: 0 / Ready: 0`.

### Guarantees

- **Read-only:** creates, edits, regenerates, and deletes nothing (asserted by a
  test that snapshots file mtimes across a full scan).
- **Invents nothing:** suggests no titles, dates, or themes — it lists only which
  objective fields are empty.
- **No duplicated rules:** validation detail is delegated to
  `validate_catalog.py`, the single source of the archive's schema rules. Its
  rules load from the fixed install path, independent of the data location.

### Design decisions

- **Emptiness gate = `{title, work_type, description, palette, keywords}`** —
  mirrors `validate_catalog.py`'s content rules plus `title` (which the validator
  does not check for emptiness). `year` is excluded: the archive publishes
  decade estimates and the validator accepts `year: null`.
- **"Published" means a non-null title in `catalog.json`**, so a null-metadata
  stub is correctly treated as pending, not done.
- **Not wired into an `archive intake` command** — orchestration is Phase 2.3.

### Tests

`python3 scripts/test_intake_status.py` (part of `npm test`) covers no-pending,
one/multiple pending, partial sidecars, malformed sidecars, missing sidecars,
ready-for-finish, the `validate_catalog.py` interaction, and read-only behavior.

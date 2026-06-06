# Prompt Test Protocol — Run Before Full Batch

> **Status as of 2026-06-06:** 1,084 works cataloged, 0 errors. All migrations complete.
> Run `validate_catalog.py --legacy-ok --quiet` before any new batch to confirm clean baseline.

Run this before triggering any new batch. Takes ~5 minutes.

---

## Step 1 — Pick 5 test images

Choose a spread across work types — don't just test 5 collages:

```
art0141 – art0145   (whatever the next 5 unprocessed AVIFs are)
```

Or pick manually to cover:
- 1 collage with a warplane
- 1 collage without (e.g. target-only, or a cross piece)
- 1 sculpture
- 1 photograph (street)
- 1 photograph (studio or installation)

---

## Step 2 — Run the test

```bash
export ANTHROPIC_API_KEY=sk-ant-...

cd /Users/jeffreyneumann/Documents/JFSN
python3 artworks/catalog.py --limit 5
```

This processes the 5 lowest-numbered unprocessed AVIFs.
Sidecars are written to `artworks/full/`.

---

## Step 3 — Validate immediately

```bash
python3 artworks/validate_catalog.py --legacy-ok --from art0141 --quiet
```

Should show: `Errors: 0`. If not, fix before proceeding.

---

## Step 4 — Review each record against this checklist

Open each new JSON and check:

### Schema
- [ ] All required fields present: `file`, `title`, `year`, `work_type`, `orientation`,
      `description`, `palette`, `themes`, `series`, `keywords`, `featured`, `schema_version`
- [ ] `year` is present as a key (even if null)
- [ ] `schema_version` is `"1"`
- [ ] `series` is `"Guernica"` or `null` (XXIII and Squadron are retired — all go to Guernica or null)
- [ ] `featured` is `false`

### Description
- [ ] Does NOT start with "A", "An", or "The"
- [ ] Two sentences, ≤ 55 words
- [ ] No evaluative language (striking, powerful, remarkable, dynamic)
- [ ] Specific to this image — not generic enough to fit 10 other works
- [ ] Second sentence adds new information (doesn't just restate the first)

### Controlled vocabularies
- [ ] All palette terms are from the 20-term list
- [ ] All motif terms are from the 30-term list
- [ ] All material terms are from the 15-term list
- [ ] All theme terms are from the 10-term list (Mr. SNOWmann, Targets, Crosses, Torsos & Faces, Gallery, Framed, Studio, Tracings, Art School, Collaboration)
- [ ] No invented series values

### Judgment calls
- [ ] `work_type` matches what the image actually is
- [ ] `themes` are genuinely present — not over-applied
- [ ] `Mr. Snowmann` applied to all collages/sculptures; correctly withheld on street photos
      where snowman is a small background tag
- [ ] `keywords` are specific to THIS work, not generic (check: would these keywords
      distinguish this work from 50 similar ones?)
- [ ] `composition` is 5–8 words, precise, useful as a search term
- [ ] `series` is correctly identified (XXIII/Squadron/Guernica) or null

---

## Step 5 — Decision

**All 5 pass → proceed with full batch:**
```bash
python3 artworks/catalog.py --workers 4
```

**Any failures → fix the prompt in `catalog.py`, delete the 5 test sidecars, re-run test:**
```bash
rm artworks/full/art0141.json artworks/full/art0142.json  # etc.
python3 artworks/catalog.py --limit 5
```

---

## What to watch for specifically

The three rules that are NEW since the original 140 records — verify each works:

1. **Opener rule** — first word of description must not be A/An/The.
   The validator catches this and forces a retry, but confirm at least 3 of 5
   descriptions open with something distinctive.

2. **Series field** — if any of the 5 test images are clearly CD-formation or warplane/Guernica works,
   confirm the model assigns `series: "Guernica"`. All others should be `null`.

3. **Keyword specificity** — the biggest ongoing risk. Read the 5 keyword arrays.
   Are they terms you'd use to find ONLY this work, or terms you'd find everywhere?
   Bad: `["panoramic", "saturated", "minimal"]`
   Good: `["stacked-twin-planes", "gold-foil-ground", "sequin-dot-band"]`

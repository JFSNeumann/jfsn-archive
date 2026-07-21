# JFSN Intake Quickstart
**For ingesting 40 new artworks (art1085–art1124)**

---

## Setup (One-Time)

```bash
pip3 install --break-system-packages pillow pillow-avif-plugin pillow-heif
brew install libavif
```

---

## Workflow Per Batch (Suggest 10 works at a time)

### **Step 1: Photograph & Edit**
- Shoot primary side + back side
- Edit locally (Lightroom/Photoshop): crop, color correct
- Export primary as HEIC or JPG (iPhone: HEIC is fine, auto-converts)

### **Step 2: Drop Photos**
```bash
# Copy edited photos to inbox
cp ~/Pictures/art1085.heic ~/Documents/JFSN/artworks/inbox/
cp ~/Pictures/art1086.heic ~/Documents/JFSN/artworks/inbox/
# ... (10 photos total)
```

### **Step 3: Auto-Ingest (Converts HEIC→AVIF, assigns IDs)**
```bash
python3 artworks/ingest.py
```

**Output:**
- ✓ Creates `artworks/full/art1085.avif`, `artworks/full/art1086.avif`, etc.
- ✓ Auto-generates thumbnails (thumbs/, mini/, medium/, micro/)
- ✓ Records pixel dimensions in `dims.json`
- ✓ Scaffolds empty JSON sidecars: `artworks/full/art1085.json`, etc.
- ✓ Moves originals to `artworks/inbox/done/`

### **Step 4: Edit JSON Sidecars (Manual — This is Authorship)**
Open each file and fill in:

```json
{
  "file": "art1085.avif",
  "title": "Actual title",
  "year": 2024,
  "work_type": "collage",        // or "painting", "photograph", "sculpture"
  "orientation": "portrait",      // or "landscape", "square"
  "description": "What the work looks like, themes, materials visible",
  "palette": ["color1", "color2"],
  "motifs": ["motif1", "motif2"],
  "materials": ["oil", "canvas"],
  "composition": "Brief spatial description",
  "themes": ["Faces", "Abstracts"],
  "keywords": ["tag1", "tag2"]
}
```

**Examples already in repo:** `artworks/full/art0001.json` through `art1086.json`

### **Step 5: Finish Intake (Validates, Builds, Verifies)**
```bash
python3 tools/intake/intake_finish.py
```

Stops at first error — fix and re-run. No deployment happens here.

### **Step 6: Commit & Deploy**
```bash
git add -A
git commit -m "Ingest: Add 10 new artworks (art1085–art1094, 3x4)"
bash scripts/deploy-hostgator.sh
```

---

## Per-Batch Checklist

- [ ] Photograph & edit 10 primary images
- [ ] `cp` photos to `artworks/inbox/`
- [ ] `python3 artworks/ingest.py` ✓ (auto-converts, assigns IDs)
- [ ] Edit 10 × `artworks/full/art####.json` sidecars
- [ ] `python3 tools/intake/intake_finish.py` ✓ (validates, builds)
- [ ] `git add -A && git commit -m "Ingest: Add 10…"`
- [ ] `bash scripts/deploy-hostgator.sh` ✓ (live on jfsn.com)
- [ ] Verify on https://jfsn.com/archive.html (search for title)

---

## Cleanup (When Done Ingesting)

Delete the 3 test placeholders:
```bash
rm artworks/full/art990*.json
python3 artworks/build_catalog.py
bash scripts/deploy-hostgator.sh
```

---

## Notes

- **Both sides:** Save back-side photos for archival (copy to `artworks/full/art####_back.avif`), but don't include in JSON — only primary shows in the archive
- **Batch size:** 10 works = ~30 min to photograph & edit, ~5 min auto-ingest, ~30 min to author JSON, ~15 min build & deploy = ~90 min per cycle
- **No backlog:** Each batch deploys before starting the next
- **Dry-run available:** `python3 artworks/ingest.py --dry-run` (preview without writing)

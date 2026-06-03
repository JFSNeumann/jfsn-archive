# Client Archive — Workflow

Step-by-step for building an archive for another artist.
Keep this open alongside the project.

---

## Stage 1 — Before You Start

**Confirm before touching anything:**
- [ ] Tier agreed: Starter ($500 / ≤200 works) · Standard ($800 / ≤500 works) · Full ($1,500 / unlimited)
- [ ] Deposit or full payment received
- [ ] Photo delivery method settled (Dropbox / Google Drive / WeTransfer)
- [ ] You have their domain info, or they're OK with a free `.netlify.app` address for now

**Ask them:**
- Roughly how many works?
- Any they want featured on the homepage?
- Any recurring themes or named series you should know about?
- Do they have a domain?

---

### First-reply email template

> Hi [name],
>
> Thanks for reaching out. I'd love to help you build your archive.
>
> To get started: send me your photos — any format (JPEG, HEIC, iPhone exports all fine). Dropbox or Google Drive works well. No need to rename or organize them; I handle all of that.
>
> A few quick questions:
> - Roughly how many works do you have?
> - Any you'd especially want on the homepage?
> - Are there recurring themes or named series in your work I should know about?
> - Do you have a domain name, or is a free yourname.netlify.app address fine for now?
>
> Once I have the photos I'll handle the rest — thumbnails, AI catalog descriptions, search, timeline, all of it. You'll get a link to review within a week or so.
>
> — Jeff

---

## Stage 2 — Set Up the Project

```bash
bash setup-client.sh [clientname]
# Example:  bash setup-client.sh sarah-jones
# Creates:  ~/Documents/JFSN-sarah-jones  with a clean template
```

Then configure it for this artist:
```bash
cd ~/Documents/JFSN-sarah-jones
bash init.sh
```

`init.sh` will ask:
- Artist name (e.g. "Sarah Jones")
- Site URL (e.g. `sarah-jones.netlify.app` or their real domain)
- Work types (collage / painting / sculpture / photography — pick what applies)
- Themes — ask the artist, or start broad and refine during curation
- Any named series?

---

## Stage 3 — Get Their Photos In

1. Download their folder from Dropbox/Drive
2. Copy everything into `artworks/full/`:
   ```bash
   cp -R ~/Downloads/sarah-photos/* artworks/full/
   ```
3. Run ingest (makes thumbnails + minis, converts to AVIF):
   ```bash
   python3 artworks/ingest.py artworks/full/
   ```
   Takes a few minutes. You'll see `artworks/thumbs/` filling up.

---

## Stage 4 — AI Catalog Run

```bash
python3 artworks/catalog.py
```

**Time:** roughly 1 min per 10 works.
- 200 works ≈ 20 min
- 500 works ≈ 1 hr

Leave it running. If it stops partway, run it again — it skips already-cataloged works.

---

## Stage 5 — Curation  ← The Real Work

This is where you shape the archive. Budget **2–4 hours per 200 works**.

```bash
python3 server.py
# Then open: http://localhost:3900/curate.html
```

**In curate.html:**

| Tab | What to do |
|-----|-----------|
| **Themes** | Click a theme chip → click works that belong. Shift-click for a range. Space bar toggles selected. A work can have up to 4 themes. |
| **Years** | Click a decade → click works from that era. Use the "Undated" filter to focus on what's unassigned. |
| **Series** | Only if they have a named series. Click the series → click its works. |

**Save often** (the Save button in curate.html). After each session, rebuild:
```bash
python3 artworks/apply_dates.py       # writes decade years to sidecars
python3 artworks/build_catalog.py     # rebuilds all JSON + sitemap
```

Check the result at `http://localhost:3900/archive.html`.

---

## Stage 6 — Quality Check Before Delivery

```bash
python3 artworks/validate_catalog.py   # should show 0 errors
```

Then go through manually:
- [ ] `archive.html` — all works visible, filter chips work, search returns results
- [ ] Open 5–10 random works on `artwork.html` — titles, descriptions, years look right
- [ ] `timeline.html` — decades roughly distributed, scrubber works
- [ ] `constellation.html` — loads, clusters make sense
- [ ] `index.html` — homepage hero looks good

**Featured works** — edit `featured.txt` with 6–8 of their strongest work IDs (one per line, e.g. `art0042`). These go on the homepage.

**About page** — update `about.html` with their bio, medium, contact info, and "Now" section.

**Nav** — if any nav links were customized, run `bash stamp-nav.sh` to propagate the canonical nav to all Stitch pages.

---

## Stage 7 — Deploy to Netlify

1. Go to [netlify.com](https://netlify.com) → **Add new site → Deploy manually**
2. Drag the project folder onto the drop zone
3. They get a `random-words.netlify.app` URL immediately

**Rename the subdomain:**
Site settings → Domain management → Options → Edit site name → `sarah-jones-archive`

**Custom domain (if they have one):**
Site settings → Domain management → Add custom domain → Netlify walks you through the DNS change

---

## Stage 8 — Deliver

Send them:
1. The live URL
2. A short screen-recording tour (Loom, 5 min) showing how to browse their archive
3. Their GitHub repo link (if you set one up)
4. The "Adding New Works" section below, copy-pasted into an email

**Full tier:** 30-minute screen share walkthrough — show them the archive, answer questions, demo the search and timeline.

---

## Adding New Works Later

When they shoot more and want to add them:

```bash
# Copy new photos in
cp -R ~/Downloads/new-photos/* artworks/full/

# Run ingest on just the new ones
python3 artworks/ingest.py artworks/full/

# Catalog only the new ones (skips anything already done)
python3 artworks/catalog.py

# Rebuild everything
python3 artworks/build_catalog.py

# Re-deploy: drag folder to Netlify, or push to GitHub
```

---

## Pricing reminders

| Tier | Works | Price | What's included |
|------|-------|-------|-----------------|
| Starter | ≤200 | $500 | Archive, search, timeline. Deployed to their domain. |
| Standard | ≤500 | $800 | Everything + Constellation view. Custom vocab. GitHub repo. |
| Full | Unlimited | $1,500 | Everything + open API. Curation consult. 30 days revisions. |

Founding rate (first 3 clients): 30% off Standard and Full.
Track slots in `for-artists.html` → `.founding__eyebrow` text.

---

## Common problems

**`catalog.py` keeps stopping** — usually a rate limit or network blip. Just run it again; it resumes from where it left off.

**Thumbnails look wrong** — re-run `ingest.py` on the specific file. Ingest is non-destructive (won't overwrite if the thumbnail already exists — delete it first if needed).

**`validate_catalog.py` shows errors** — usually a banned opener on a description ("A " or "An " at the start). Run `python3 artworks/repass_descriptions.py` to fix them all automatically.

**Netlify deploy looks stale** — bump `CACHE_V` in `sw.js` to force a cache clear. Pattern: `jfsn-YYYYMMDD-reason`.

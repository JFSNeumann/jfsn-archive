# JFSN Archive — AI-Cataloged Artist Archive Website

A static, open-source archive site for visual artists. No CMS, no database, no monthly fees. Built for [jfsn.com](https://jfsn.com) — 1,084 works spanning 50 years, live on a $5/month shared host.

**Don't want to set it up yourself?** I build these for other artists, starting at $500. → [jfsn.com/for-artists](https://jfsn.com/for-artists.html)

---

## What you get

![Archive grid, timeline, and constellation view](https://jfsn.com/og-card.jpg)

- **Archive** — masonry grid, full-text search (⌘K), filters by decade/theme/series/palette, favorites
- **Series** — theme and named-series pages with work counts
- **Timeline** — horizontal scrub strip, all dated works 1974–present
- **Constellation** — D3 force-directed galaxy, theme clusters, pan/zoom, search
- **Chromatic River** — HiDPI canvas of all works as color slices by year
- **Wall** — all 1,084 works as a dense mini grid
- **Mosaic** — photomosaic of all works forming a portrait
- **Artwork detail** — lightbox, keyboard/swipe nav, related works, color palette, JSON-LD structured data
- **Static artwork pages** — 1,084 pre-rendered pages with unique title/description for Google indexing
- **Companion** — AI assistant with full knowledge of the archive (Netlify Function + Claude API)
- **Open Archive API** — auto-generated `api/v1/` endpoints (works, themes, motifs, palette, series)
- **RSS feed** — `feed.xml` of the 20 most recently added works
- **Service worker** — offline-first, auto-cache-busted on every build
- **AI auto-cataloging** — Claude reads your images and writes titles, descriptions, themes, palette, motifs

Works on Netlify (free), GitHub Pages (free), or cPanel shared hosting (~$5/month).

---

## Want one built for you?

→ **[jfsn.com/for-artists](https://jfsn.com/for-artists.html)**  
Starting at $500 · One-time fee · No ongoing costs · Full source code handed off

---

## Quick start

### 1. Clone

```bash
git clone https://github.com/jfsneumann/jfsn-archive.git my-archive
cd my-archive
```

### 2. Configure

```bash
./init.sh   # wizard: name, URL, themes, series → writes artist-config.json
```

Or edit `artist-config.json` directly.

### 3. Add your artwork

Drop photos into `artworks/inbox/`, then:

```bash
bash add-works.sh              # ingest + catalog + build
bash add-works.sh --no-deploy  # ingest + build only
bash add-works.sh --dry-run    # preview what would happen
```

Or step by step:

```bash
python3 artworks/ingest.py     # HEIC/JPG → AVIF, assigns IDs, builds thumbs
```

### 4. Auto-catalog

```bash
export ANTHROPIC_API_KEY=sk-ant-...   # https://console.anthropic.com
python3 artworks/catalog.py --limit 5  # test on 5 first
python3 artworks/catalog.py            # process all
```

Uses `claude-haiku-4-5` (fast + cheap). Cost: ~$0.01–0.02 per image.

### 5. Build & preview

```bash
python3 artworks/build_catalog.py   # outputs catalog.json, sitemap.xml, feed.xml, api/v1/
python3 server.py                   # http://localhost:3900
```

### 6. Build CSS

After adding new pages or tokens:

```bash
./node_modules/.bin/tailwindcss -i input.css -o site.min.css --minify
```

Install once with `npm install` (Tailwind v3 is in `package.json`).

### 7. Deploy

```bash
cp .ftp.env.example .ftp.env   # fill in your host/user/pass
bash end-session.sh             # git commit + push + backup
bash deploy.sh                  # FTP upload to server
```

Or drag the folder into Netlify / GitHub Pages.

---

## Design system

The site uses a custom light design system built on Tailwind CSS:

| Token | Value | Use |
|-------|-------|-----|
| `background` | `#fcf9f3` | Page background (bone-white) |
| `deep-ink` | `#0B0B0B` | Primary text |
| `international-orange` | `#FF6600` | Accent — hover, active links only |
| `archive-gray` | `#575757` | Secondary text, labels |
| `outline-variant` | `#c4c7c7` | Borders |
| Headings | Playfair Display | 400–700 |
| UI / labels | Inter ALL CAPS | 0.1em tracking |

Rules: no rounded corners · no shadows · no gradients · artwork thumbnails grayscale by default, color on hover.

CSS is pre-built to `site.min.css` (31KB). The Tailwind CDN is not used in production.

---

## iPhone pipeline

Shoot in HEIC or JPEG. Drop files into `artworks/inbox/`. Run:

```bash
bash add-works.sh
```

Auto-assigns sequential IDs (`art0001`, `art0002`, …), converts to AVIF, creates full-res / thumbnail (400px) / mini (200px) sizes, AI-catalogs, builds, and deploys.

---

## Scripts

| Script | Purpose |
|--------|---------|
| `add-works.sh` | Full ingest pipeline: inbox → AVIF → catalog → build → deploy |
| `artworks/ingest.py` | HEIC/JPG → AVIF conversion and ID assignment |
| `artworks/catalog.py` | AI cataloging via Anthropic API (claude-haiku-4-5) |
| `artworks/validate_catalog.py` | Schema QA — run before building |
| `artworks/build_catalog.py` | Publishes catalog.json + sitemap.xml + feed.xml + api/v1/ |
| `artworks/make_colors.py` | Extracts dominant colors → colors.json |
| `end-session.sh` | git commit + push + backup (does NOT deploy) |
| `deploy.sh` | FTP mirror to HostGator + health check |
| `backup.sh` | rsync to external drive (JEFFS-4TB) |
| `stamp-nav.sh` | Propagates `_shared/top-nav.html` nav to all Stitch pages |

---

## Fork for your own archive

Everything artist-specific lives in one file: **`artist-config.json`**.

```bash
git clone https://github.com/jfsneumann/jfsn-archive.git my-archive
cd my-archive
./init.sh   # wizard → writes artist-config.json
```

### What artist-config.json controls

| Section | What it affects |
|---------|----------------|
| `artist_name`, `site_url` | API endpoints, meta.json, HTML page titles |
| `themes` | AI prompt, filter chips, series pages, constellation view |
| `named_series` | AI prompt, series pages, series index, filter chips |
| `palette` / `motifs` / `materials` | AI prompt controlled vocabulary |

---

## Configuration

| File | What to change |
|------|---------------|
| **`artist-config.json`** | Artist name, site URL, themes, series, palette, motifs |
| `about.html` | Bio, exhibitions, contact |
| `featured.txt` | Works shown on homepage (run `build_catalog.py` after) |
| `.ftp.env` | FTP host/user/pass (gitignored) |
| `tailwind.config.js` | Color tokens, fonts, spacing |

---

## Hosting options

| Host | Cost | Notes |
|------|------|-------|
| **Netlify** | Free | Drag-drop or CLI. Companion AI requires Netlify. |
| **GitHub Pages** | Free | Push `main` → live. No server-side functions. |
| **cPanel shared hosting** | ~$5/mo | Use `deploy.sh` with FTP credentials. |

---

## Companion (AI assistant)

Claude-powered chat at `/companion.html`. Knows every work, theme, series, and year. Requires a Netlify Function (`netlify/functions/companion.mjs`) with `ANTHROPIC_API_KEY` set in your Netlify dashboard.

Uses `claude-haiku-4-5` for fast queries, `claude-sonnet-4-6` for deep search.

Does not work on GitHub Pages or plain cPanel (no server-side function support).

---

## SEO

- **Static artwork pages** — `artworks/pages/artNNNN.html` pre-renders title, description, and JSON-LD `VisualArtwork` schema for all 1,084 works. Googlebot can index without JS rendering.
- **Sitemap** — `sitemap.xml` auto-generated with 2,190 URLs including all artwork pages.
- **Structured data** — `CollectionPage` JSON-LD on archive pages, `VisualArtwork` on artwork pages, `Person` on about page.
- **Canonical tags** — static on all pages, dynamic on artwork pages.

---

## Data format

Each artwork gets a JSON sidecar in `artworks/full/`:

```json
{
  "file": "art0001",
  "title": "Effigy in Red",
  "year": 1987,
  "work_type": "collage",
  "description": "Two sentences max. No A/An/The opener.",
  "palette": ["vermilion", "gold", "ivory"],
  "motifs": ["compact-disc", "photographic-face"],
  "materials": ["paper", "paint"],
  "composition": "axial vertical totem on flat ground",
  "themes": ["Targets", "Torsos & Faces"],
  "series": null,
  "keywords": ["assemblage", "portrait"],
  "featured": false,
  "schema_version": "1"
}
```

`build_catalog.py` merges all sidecars → `catalog.json` → `catalog-lite.json` → `api/v1/`.

---

## Open Archive API

Auto-generated on every build. Pure static JSON — no server required.

| Endpoint | Description |
|----------|-------------|
| `api/v1/meta.json` | Discovery: counts, all endpoint URLs |
| `api/v1/works.json` | All cataloged works |
| `api/v1/works/{id}.json` | Single work + asset links |
| `api/v1/themes.json` | Theme index with work IDs |
| `api/v1/series.json` | Named series index |
| `api/v1/motifs.json` | Motif vocabulary index |
| `api/v1/palette.json` | Palette color index |

CC BY 4.0 by default (metadata only — you control your image rights).

---

## License

Code: [MIT](LICENSE)  
Artwork and content: belongs to the artist. This repo includes sample data only — replace with your own work.

---

## Credits

Built by [Jeff Neumann](https://jfsn.com) — artist, product designer, Cleveland.  
Open-sourced so other artists can build their own archive.

[Hire me to build yours](https://jfsn.com/for-artists.html) · [Buy me a coffee](https://github.com/sponsors/JFSNeumann)

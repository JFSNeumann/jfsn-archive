# JFSN Archive — AI-Cataloged Artist Archive Website

A static, open-source archive site for visual artists. No CMS, no database, no monthly fees. Built for [jfsn.com](https://jfsn.com) — 1,084 works spanning 50 years, live on a $5/month shared host.

**Don't want to set it up yourself?** I build these for other artists, starting at $500. Reply within 48 hours. → [jfsn.com/for-artists](https://jfsn.com/for-artists.html)

---

## What you get

![Archive grid, timeline, and constellation view](https://jfsn.com/og-card.jpg)

- **Archive** — masonry grid, full-text search, filters by decade/theme/series/palette, favorites
- **Series** — theme and named-series pages with work counts
- **Timeline** — decade strips from 1970s–2020s
- **Constellation** — d3-force galaxy view, theme clusters, pan/zoom, search
- **Mosaic** — photomosaic of all works forming a portrait
- **Artwork detail** — lightbox, keyboard/swipe nav, related works, color palette, JSON-LD structured data
- **Companion** — AI assistant with full knowledge of the archive (Netlify Function + Claude API)
- **Open Archive API** — auto-generated `api/v1/` endpoints (works, themes, motifs, palette, series)
- **RSS feed** — `feed.xml` of the 20 most recently added works, autodiscovery on every page
- **Service worker** — offline-first, auto-cache-busted on every build
- **AI auto-cataloging** — Claude reads your images and writes titles, descriptions, themes, palette, motifs

Works on Netlify (free), GitHub Pages (free), or cPanel shared hosting (~$5/month).

---

## Want one built for you?

I built this for my own 50-year archive and now build them for other artists. You send photos, I deploy a live archive to your domain — usually within a week.

→ **[See the service and pricing at jfsn.com/for-artists](https://jfsn.com/for-artists.html)**

Starting at $500 · One-time fee · No ongoing costs · Full source code handed off

---

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

Or edit `artist-config.json` directly. All scripts and browser JS read from it — no need to touch `vocab.py` or `build_catalog.py`.

### 3. Add your artwork

Drop photos into `artworks/inbox/`:

```bash
python3 artworks/ingest.py   # converts HEIC/JPG → AVIF, assigns IDs, builds thumbs
```

### 4. Auto-catalog

```bash
export ANTHROPIC_API_KEY=sk-ant-...   # https://console.anthropic.com
python3 artworks/catalog.py --limit 5  # test on 5 first
python3 artworks/catalog.py            # process all
```

Uses `claude-sonnet-4-6`. Cost: ~$0.01–0.02 per image.

### 5. Build & preview

```bash
python3 artworks/build_catalog.py   # outputs catalog.json, sitemap.xml, feed.xml, api/v1/
python3 server.py                   # http://localhost:3900
```

### 6. Deploy

```bash
cp .ftp.env.example .ftp.env        # fill in your host/user/pass
./deploy.sh                          # build → upload → verify
```

Or drag the folder into Netlify / GitHub Pages.

---

## iPhone pipeline

Shoot in HEIC (flat 2D works) or JPEG. Drop files into `artworks/inbox/`. Run:

```bash
python3 artworks/ingest.py
```

This auto-assigns sequential IDs (`art0001`, `art0002`, …), converts to AVIF, and creates full-res, thumbnail (400px), and mini (200px) sizes.

---

## Scripts

| Script | Purpose |
|--------|---------|
| `artworks/ingest.py` | iPhone/HEIC → AVIF pipeline |
| `artworks/catalog.py` | AI cataloging via Anthropic API |
| `artworks/validate_catalog.py` | Schema QA — run before building |
| `artworks/build_catalog.py` | Publishes catalog.json + sitemap.xml + feed.xml + api/v1/ + stamps cache busters |
| `artworks/build_dims.py` | Rebuilds dims.json for masonry layout |
| `artworks/make_colors.py` | Extracts dominant colors → colors.json |
| `deploy.sh` | One-command: build → upload → verify |
| `artworks/verify_deploy.py` | 16 live-site health checks |

---

## Fork for your own archive

Everything artist-specific lives in one file: **`artist-config.json`** at the project root.

```bash
git clone https://github.com/jfsneumann/jfsn-archive.git my-archive
cd my-archive
./init.sh      # wizard: name, URL, themes, series → writes artist-config.json
```

The wizard creates your config. Then fill in descriptions and run:

```bash
python3 artworks/build_catalog.py   # generates artist-config.js for browser pages
```

That's it. All HTML pages, the AI cataloging prompt, and the API endpoints pull from
`artist-config.json` automatically.

### What artist-config.json controls

| Section | What it affects |
|---------|----------------|
| `artist_name`, `site_url` | API endpoints, meta.json, HTML page titles |
| `themes` | AI prompt, filter chips, series pages, constellation view |
| `named_series` | AI prompt, series pages, series index, filter chips |
| `palette` / `motifs` / `materials` | AI prompt controlled vocabulary |

### Vocabulary migrations

When you change or rename a theme/series after cataloging has run, existing sidecar
JSON files need updating. Add a numbered script to `vocab-migrations/`:

```bash
python3 vocab-migrations/001_remove_old_theme.py          # dry-run
python3 vocab-migrations/001_remove_old_theme.py --run    # apply
```

See `vocab-migrations/README.md` for the naming convention and history.

---

## Configuration

Key files to edit when setting up as your own archive:

| File | What to change |
|------|---------------|
| **`artist-config.json`** | **Everything** — artist name, site URL, themes, series, palette, motifs |
| `about.html` | Your bio, name, exhibitions, contact |
| `featured.txt` | Which works appear on the homepage |
| `.ftp.env` | FTP host/user/pass (never commit — already in .gitignore) |
| `site.css` (`:root` tokens) | Colors, fonts, spacing |

### Themes and series

Edit `artist-config.json` to define your themes and series. The AI cataloging prompt,
browser filter chips, constellation view, and all series pages read from it automatically
after running `python3 artworks/build_catalog.py`.

---

## Hosting options

| Host | Cost | Notes |
|------|------|-------|
| **Netlify** | Free | Drag-drop or CLI. Auto-deploys from GitHub. Companion AI function requires Netlify. |
| **GitHub Pages** | Free | Push `main` → live. No server-side functions. |
| **cPanel shared hosting** | ~$5/mo | Use `deploy.sh` with FTP credentials. Images stay on server, not in git. |

---

## Companion (AI assistant)

The Companion is a Claude-powered chat interface with full knowledge of the archive — every work, theme, series, and year. It lives at `/companion.html` and requires a Netlify Function (`netlify/functions/companion.js`) with an `ANTHROPIC_API_KEY` environment variable set in your Netlify dashboard.

It does not work on GitHub Pages or cPanel (no server-side function support).

---

## Data format

Each artwork gets a JSON sidecar in `artworks/full/`:

```json
{
  "file": "art0001.avif",
  "title": "Effigy in Red",
  "year": 1987,
  "work_type": "collage",
  "description": "Two sentences max. No A/An/The opener.",
  "palette": ["vermilion", "gold", "ivory"],
  "motifs": ["compact-disc", "photographic-face"],
  "materials": ["paper", "paint"],
  "composition": "axial vertical totem on flat ground",
  "themes": ["Totems", "Torsos & Faces"],
  "series": null,
  "keywords": ["lace-cross-arrangement"],
  "featured": false,
  "schema_version": "1"
}
```

`build_catalog.py` merges all sidecars → `catalog.json` → `catalog-lite.json` → `api/v1/`.

---

## Open Archive API

Auto-generated on every build. No server required — pure static JSON.

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

## RSS feed

`feed.xml` is auto-generated by `build_catalog.py` — the 20 most recently added works, with title, description, and thumbnail. Subscribe in any RSS reader. Autodiscovery `<link>` tag is present on every page.

---

## License

Code: [MIT](LICENSE)  
Artwork and content: belongs to the artist using this template. This repo includes placeholder/sample data only — replace with your own work.

---

## Credits

Built by [Jeff Neumann](https://jfsn.com) — artist, product designer, Cleveland.  
Open-sourced so other artists can build their own archive without starting from scratch.

If this saved you time, [buy me a coffee](https://github.com/sponsors/JFSNeumann) or [hire me to build yours](https://jfsn.com/for-artists.html).

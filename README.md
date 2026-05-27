# JFSN Archive — Artist/Designer Portfolio Template

A static, open-source archive site for artists and designers. Built for [jfsn.com](https://jfsn.com) — a 1,000+ work archive spanning 50 years of practice. No CMS, no database. Pure static files that deploy anywhere.

---

## What this is

A fully-featured personal archive with:

- **Archive** — masonry grid, search, filters by decade/theme/series, infinite scroll, palette swatches, favorites
- **Series** — groupings with scroll progress
- **Timeline** — decade strips from 1970s–2020s
- **Constellation** — d3-force galaxy view, 14 theme clusters, pan/zoom, search
- **Artwork detail** — lightbox, keyboard/swipe nav, related works, JSON-LD
- **Open Archive API** — auto-generated `api/v1/` endpoints (works, themes, motifs, palette, series)
- **Service worker** — offline-first, auto-cache-busted on every build
- **AI auto-cataloging** — Anthropic API reads your images and writes titles, descriptions, themes, palette, motifs

Works on Netlify (free tier), cPanel shared hosting, GitHub Pages, or any static host.

---

## Quick start

### 1. Clone

```bash
git clone https://github.com/jfsneumann/jfsn-archive.git my-archive
cd my-archive
```

### 2. Configure

Edit `artworks/build_catalog.py` — change `SITE_URL` to your domain. Edit `artworks/vocab.py` to set your themes, series, and motif vocabulary.

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

Cost: ~$0.01–0.02 per image.

### 5. Build & preview

```bash
python3 artworks/build_catalog.py   # outputs catalog.json + api/v1/
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
| `artworks/build_catalog.py` | Publishes catalog.json + api/v1/ + stamps cache busters |
| `artworks/build_dims.py` | Rebuilds dims.json for masonry layout |
| `artworks/make_colors.py` | Extracts dominant colors → colors.json |
| `deploy.sh` | One-command: build → upload → verify |
| `artworks/verify_deploy.py` | 16 live-site health checks |

---

## Configuration

Key files to edit when setting up as your own archive:

| File | What to change |
|------|---------------|
| `about.html` | Your bio, name, contact |
| `artworks/vocab.py` | Your themes, motifs, materials, palette terms |
| `artworks/build_catalog.py` | `SITE_URL` — change to your deployed domain |
| `featured.txt` | Which works appear on the homepage |
| `.ftp.env` | FTP host/user/pass (never commit — already in .gitignore) |
| `site.css` (`:root` tokens) | Colors, fonts, spacing |

### Themes

Edit `artworks/vocab.py` to define your own themes, series, and motif vocabulary. The AI cataloging prompt reads from `vocab.py` automatically — no prompt editing needed.

---

## Hosting options

| Host | Cost | Notes |
|------|------|-------|
| **Netlify** | Free | Drag-drop or CLI. Auto-deploys from GitHub. |
| **GitHub Pages** | Free | Push `main` → live. |
| **cPanel shared hosting** | ~$5/mo | Use `deploy.sh` with FTP credentials. |

For large image libraries (1,000+ works), Netlify free tier handles static files well. Images aren't deployed via git — they stay on your server.

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

## License

Code: [MIT](LICENSE)  
Artwork and content: belongs to the artist using this template. This repo includes placeholder/sample data only — replace with your own work.

---

## Credits

Built by [Jeff Neumann](https://jfsn.com) for jfsn.com — 50 years of art and design, 1,000+ works.  
Open-sourced so other artists and designers can build their own archive without starting from scratch.

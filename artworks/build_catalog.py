#!/usr/bin/env python3
"""
Merge all JSON sidecars into a single catalog.json for the archive site.
Run this after any batch of catalog.py completes, or after editing featured.txt.

    python3 artworks/build_catalog.py

Featured works: edit /featured.txt (one art ID per line, # = comment).
Those works get featured:true in catalog.json, which drives the homepage grid.

Configuration is read from artist-config.json at the project root.
This script also generates artist-config.js for use by browser-side JS.
"""

import json, datetime, urllib.parse, re
from pathlib import Path

ROOT    = Path(__file__).parent.parent
API_V1  = ROOT / "api" / "v1"
API_WORKS = API_V1 / "works"

FULL        = Path(__file__).parent / "full"
OUT         = ROOT / "catalog.json"
OUT_LITE    = ROOT / "catalog-lite.json"
OUT_HOME    = ROOT / "catalog-home.json"
OUT_SITEMAP = ROOT / "sitemap.xml"
OUT_JS_CFG  = ROOT / "artist-config.js"

HOME_LIMIT  = 30   # max records served to the homepage

# ── Load artist-config.json ───────────────────────────────────────────────────
_CFG_PATH = ROOT / "artist-config.json"
_cfg: dict = {}
if _CFG_PATH.exists():
    try:
        _cfg = json.loads(_CFG_PATH.read_text())
    except Exception as e:
        print(f"Warning: could not parse artist-config.json: {e}")

SITE_URL    = _cfg.get("site_url", "https://example.com")
ARTIST_NAME = _cfg.get("artist_name", "Unknown Artist")
ARTIST_SHORT = _cfg.get("artist_short") or ARTIST_NAME
# ─────────────────────────────────────────────────────────────────────────────

# Fields kept in the lite catalog (used by archive grid, homepage, artwork prev/next)
LITE_FIELDS = {'file', 'title', 'work_type', 'year', 'themes', 'series', 'keywords', 'motifs', 'palette', 'featured', 'description', 'composition'}
FEATURED = Path(__file__).parent.parent / "featured.txt"

# Load featured IDs (strip comments and whitespace)
featured_ids = set()
if FEATURED.exists():
    for line in FEATURED.read_text().splitlines():
        line = line.split('#')[0].strip()
        if line:
            featured_ids.add(line)

records = []
skipped = []
cataloged_ids = set()

# Load records that have full sidecar JSON
for p in sorted(FULL.glob("art*.json")):
    try:
        rec = json.loads(p.read_text())
        art_id = p.stem  # e.g. "art0061"
        rec['featured'] = art_id in featured_ids
        records.append(rec)
        cataloged_ids.add(art_id)
    except Exception as e:
        skipped.append(f"{p.name}: {e}")

# Add stub entries for every thumbnail that has no sidecar yet.
# This makes all artworks visible in the archive before the AI batch runs.
THUMBS   = Path(__file__).parent / "thumbs"
PENDING  = Path(__file__).parent.parent / "pending-themes.json"
pending  = {}
if PENDING.exists():
    try:
        pending = json.loads(PENDING.read_text())
    except Exception:
        pass

for p in sorted(THUMBS.glob("art*.avif")):
    art_id = p.stem
    if art_id not in cataloged_ids:
        pdata = pending.get(art_id, {})
        records.append({
            'file':     art_id + '.avif',
            'title':    None,
            'year':     pdata.get('year'),
            'work_type': None,
            'themes':   pdata.get('themes', []),
            'series':   None,
            'keywords': [],
            'motifs':   [],
            'palette':  [],
            'featured': art_id in featured_ids,
            'description': None,
            'composition': None,
        })

# Keep catalog in stable ID order
records.sort(key=lambda r: r.get('file', ''))

OUT.write_text(json.dumps(records, separators=(',', ':')))
print(f"catalog.json      — {len(records)} records ({OUT.stat().st_size // 1024} KB)")

lite = [{k: v for k, v in r.items() if k in LITE_FIELDS} for r in records]
OUT_LITE.write_text(json.dumps(lite, separators=(',', ':')))
print(f"catalog-lite.json — {len(lite)} records ({OUT_LITE.stat().st_size // 1024} KB)")

# catalog-home.json: featured first, then most recent — capped at HOME_LIMIT
# "Most recent" = highest year DESC (when available), then highest ID DESC as fallback.
# IDs are assigned at digitisation time, not creation time, so ID order is an
# approximation; it will self-correct as year fields are populated.
def sort_key(r):
    art_id = r.get('file', '').replace('.avif', '')
    id_num = int(re.sub(r'\D', '', art_id) or 0)
    yr = r.get('year')
    return (yr if isinstance(yr, int) else 0, id_num)

featured_records = [r for r in records if r.get('featured')]
recent_records   = sorted(
    (r for r in records if not r.get('featured')),
    key=sort_key, reverse=True
)
home_pool        = (featured_records + recent_records)[:HOME_LIMIT]
home_lite        = [{k: v for k, v in r.items() if k in LITE_FIELDS} for r in home_pool]
OUT_HOME.write_text(json.dumps(home_lite, separators=(',', ':')))
print(f"catalog-home.json — {len(home_lite)} records ({OUT_HOME.stat().st_size // 1024} KB)")

if featured_ids:
    found = sum(1 for r in records if r.get('featured'))
    print(f"Featured: {found} works marked (from featured.txt)")
if skipped:
    print(f"Skipped {len(skipped)}:")
    for s in skipped:
        print(f"  {s}")

# ── sitemap.xml ──────────────────────────────────────────────────────────────
today       = datetime.date.today().isoformat()
theme_pages = sorted({t for r in records for t in (r.get('themes') or [])})
series_pages = sorted({r['series'] for r in records if r.get('series')})

entries = [
    (SITE_URL + '/',                    '1.0', 'monthly'),
    (SITE_URL + '/archive.html',        '0.9', 'weekly'),
    (SITE_URL + '/for-artists.html',    '0.9', 'monthly'),
    (SITE_URL + '/series-index.html',   '0.8', 'monthly'),
    (SITE_URL + '/timeline.html',       '0.8', 'monthly'),
    (SITE_URL + '/constellation.html',  '0.8', 'monthly'),
    (SITE_URL + '/api.html',            '0.7', 'monthly'),
    (SITE_URL + '/about.html',          '0.7', 'monthly'),
    (SITE_URL + '/changes.html',        '0.4', 'weekly'),
    (SITE_URL + '/privacy.html',        '0.3', 'yearly'),
]
# Theme-based series pages
for theme in theme_pages:
    entries.append((
        f"{SITE_URL}/series.html?theme={urllib.parse.quote(theme, safe='')}",
        '0.8', 'monthly',
    ))
# Named-series pages
for s in series_pages:
    entries.append((
        f"{SITE_URL}/series.html?series={urllib.parse.quote(s, safe='')}",
        '0.8', 'monthly',
    ))
for r in records:
    art_id = r['file'].replace('.avif', '')
    entries.append((f"{SITE_URL}/artwork.html?id={art_id}", '0.6', 'monthly'))

lines = ['<?xml version="1.0" encoding="UTF-8"?>',
         '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for loc, prio, freq in entries:
    lines += [
        '  <url>',
        f'    <loc>{loc}</loc>',
        f'    <lastmod>{today}</lastmod>',
        f'    <changefreq>{freq}</changefreq>',
        f'    <priority>{prio}</priority>',
        '  </url>',
    ]
lines.append('</urlset>')
OUT_SITEMAP.write_text('\n'.join(lines) + '\n')
print(f"sitemap.xml       — {len(entries)} URLs")

# ── Stamp build timestamp into index.html catalog fetch URL ──────────────────
# Replaces ?v=BUILD_TS so browsers always fetch fresh catalog-home.json after deploy.
INDEX  = Path(__file__).parent.parent / "index.html"
SW     = Path(__file__).parent.parent / "sw.js"
build_ts = datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%d%H%M%S')

if INDEX.exists():
    stamped = re.sub(r'\?v=(?:BUILD_TS|\d{14})', f'?v={build_ts}', INDEX.read_text())
    INDEX.write_text(stamped)
    print(f"index.html        — cache stamp updated (?v={build_ts})")

# ── Auto-bump sw.js CACHE_V so returning visitors always get fresh assets ────
if SW.exists():
    sw_text  = SW.read_text()
    new_cache_v = f"jfsn-{build_ts}"
    stamped_sw  = re.sub(r"CACHE_V\s*=\s*'jfsn-[^']+'", f"CACHE_V  = '{new_cache_v}'", sw_text)
    if stamped_sw != sw_text:
        SW.write_text(stamped_sw)
        print(f"sw.js             — CACHE_V bumped to '{new_cache_v}'")

# ── Open Archive API — static JSON endpoints ─────────────────────────────────
# Generates api/v1/ at the site root so every build stays in sync.
# All endpoints are plain JSON files served by Apache/nginx with CORS headers.

API_V1.mkdir(parents=True, exist_ok=True)
API_WORKS.mkdir(parents=True, exist_ok=True)

now        = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
cataloged  = [r for r in records if r.get('title')]   # exclude uncataloged stubs

def _slug(name: str) -> str:
    return re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')

def _work_links(art_id: str) -> dict:
    return {
        "image": f"{SITE_URL}/artworks/full/{art_id}.avif",
        "thumb": f"{SITE_URL}/artworks/thumbs/{art_id}.avif",
        "mini":  f"{SITE_URL}/artworks/mini/{art_id}.avif",
        "page":  f"{SITE_URL}/artwork.html?id={art_id}",
    }

# meta.json — discovery + counts
meta = {
    "api_version": "1",
    "schema_version": "1",
    "generated": now,
    "artist": ARTIST_NAME,
    "archive_url": SITE_URL,
    "counts": {
        "cataloged": len(cataloged),
        "total_including_stubs": len(records),
    },
    "endpoints": {
        "meta":    f"{SITE_URL}/api/v1/meta.json",
        "works":   f"{SITE_URL}/api/v1/works.json",
        "themes":  f"{SITE_URL}/api/v1/themes.json",
        "series":  f"{SITE_URL}/api/v1/series.json",
        "motifs":  f"{SITE_URL}/api/v1/motifs.json",
        "palette": f"{SITE_URL}/api/v1/palette.json",
        "work":    f"{SITE_URL}/api/v1/works/{{id}}.json",
    },
    "license": "CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/",
    "citation": f"Jeffrey F. S. Neumann Archive. {SITE_URL}/api/v1/meta.json",
}
(API_V1 / "meta.json").write_text(json.dumps(meta, indent=2))

# works.json — full catalog (compact; large file)
works_envelope = {
    "api_version": "1",
    "generated": now,
    "count": len(cataloged),
    "works": cataloged,
}
(API_V1 / "works.json").write_text(json.dumps(works_envelope, separators=(',', ':')))

# works/{id}.json — one file per cataloged work
for r in cataloged:
    art_id = r['file'].replace('.avif', '')
    doc = {
        "api_version": "1",
        "id": art_id,
        "work": r,
        "links": _work_links(art_id),
    }
    (API_WORKS / f"{art_id}.json").write_text(json.dumps(doc, indent=2))

# ── Facet index helpers ───────────────────────────────────────────────────────
def _facet_index(field: str, label: str, series_param: str | None = None) -> list[dict]:
    bucket: dict[str, list[str]] = {}
    for r in cataloged:
        vals = r.get(field, []) or []
        if isinstance(vals, str):
            vals = [vals]
        for v in vals:
            if v:
                bucket.setdefault(v, []).append(r['file'].replace('.avif', ''))
    out = []
    for name, ids in sorted(bucket.items(), key=lambda x: (-len(x[1]), x[0])):
        entry = {
            "name": name,
            "slug": _slug(name),
            "count": len(ids),
            "work_ids": ids,
        }
        if series_param == "theme":
            entry["series_url"] = f"{SITE_URL}/series.html?theme={urllib.parse.quote(name, safe='')}"
        elif series_param == "series":
            entry["series_url"] = f"{SITE_URL}/series.html?series={urllib.parse.quote(name, safe='')}"
        out.append(entry)
    return out

# themes.json
themes_data = _facet_index("themes", "theme", "theme")
(API_V1 / "themes.json").write_text(json.dumps({
    "api_version": "1", "generated": now,
    "count": len(themes_data), "themes": themes_data,
}, separators=(',', ':')))

# series.json — named series only
series_bucket: dict[str, list[str]] = {}
for r in cataloged:
    s = r.get("series")
    if s:
        series_bucket.setdefault(s, []).append(r['file'].replace('.avif', ''))
named_series = [
    {
        "name": name,
        "slug": _slug(name),
        "count": len(ids),
        "series_url": f"{SITE_URL}/series.html?series={urllib.parse.quote(name, safe='')}",
        "work_ids": ids,
    }
    for name, ids in sorted(series_bucket.items(), key=lambda x: (-len(x[1]), x[0]))
]
(API_V1 / "series.json").write_text(json.dumps({
    "api_version": "1", "generated": now,
    "count": len(named_series), "series": named_series,
}, separators=(',', ':')))

# motifs.json
motifs_data = _facet_index("motifs", "motif")
(API_V1 / "motifs.json").write_text(json.dumps({
    "api_version": "1", "generated": now,
    "count": len(motifs_data), "motifs": motifs_data,
}, separators=(',', ':')))

# palette.json
palette_data = _facet_index("palette", "color")
(API_V1 / "palette.json").write_text(json.dumps({
    "api_version": "1", "generated": now,
    "count": len(palette_data), "palette": palette_data,
}, separators=(',', ':')))

# .htaccess — CORS + content-type for Apache (cPanel compatible)
htaccess = """\
# Disable mod_security for API endpoints (cPanel shared hosting)
<IfModule mod_security.c>
  SecFilterEngine Off
  SecFilterScanPOST Off
</IfModule>
<IfModule mod_security2.c>
  SecRuleEngine Off
</IfModule>

<IfModule mod_headers.c>
  <FilesMatch "\\.json$">
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, OPTIONS"
    Header set Cache-Control "public, max-age=3600"
    Header set X-Content-Type-Options "nosniff"
    Header set Content-Type "application/json; charset=utf-8"
  </FilesMatch>
</IfModule>
"""
(API_V1.parent / ".htaccess").write_text(htaccess)

# ── Generate artist-config.js for browser-side consumption ───────────────────
# HTML pages load this script synchronously to get theme/series data without
# a network fetch. Regenerated on every build so it stays in sync with
# artist-config.json.  Only includes the fields the browser actually needs.
if _cfg:
    browser_cfg = {
        "artistName":   _cfg.get("artist_name", ""),
        "artistShort":  _cfg.get("artist_short", ""),
        "artistActive": _cfg.get("artist_active", ""),
        "siteUrl":      _cfg.get("site_url", ""),
        "siteTitle":    _cfg.get("site_title", ""),
        "license":      _cfg.get("license", ""),
        "licenseUrl":   _cfg.get("license_url", ""),
        "themes": [
            {
                "name":         t["name"],
                "displayTitle": t.get("display_title", t["name"]),
                "description":  t.get("description", ""),
            }
            for t in _cfg.get("themes", [])
        ],
        "namedSeries": [
            {
                "key":          s["key"],
                "displayTitle": s.get("display_title", s["key"]),
                "description":  s.get("description", ""),
            }
            for s in _cfg.get("named_series", [])
        ],
        "palette":   _cfg.get("palette", []),
        "motifs":    _cfg.get("motifs", []),
        "materials": _cfg.get("materials", []),
        "workTypes": _cfg.get("work_types", []),
    }
    js_body = json.dumps(browser_cfg, indent=2, ensure_ascii=False)
    OUT_JS_CFG.write_text(
        f"/* Auto-generated by build_catalog.py — do not edit directly.\n"
        f"   Edit artist-config.json and re-run build_catalog.py. */\n"
        f"window.ARCHIVE_CONFIG = {js_body};\n"
    )
    print(f"artist-config.js  — browser config ({OUT_JS_CFG.stat().st_size // 1024 + 1} KB)")
else:
    print("artist-config.js  — skipped (no artist-config.json found)")

n_works = len(cataloged)
print(f"\napi/v1/meta.json  — discovery endpoint")
print(f"api/v1/works.json — {n_works} cataloged works")
print(f"api/v1/works/     — {n_works} per-work files")
print(f"api/v1/themes.json, series.json, motifs.json, palette.json")
print(f"api/.htaccess     — CORS headers (Apache/cPanel)")

# ── Living changelog ─────────────────────────────────────────────────────────
# Parses git log into changes.json for the /changes.html page.
try:
    import sys
    sys.path.insert(0, str(Path(__file__).parent))
    import build_changes
    build_changes.main()
except Exception as e:
    print(f"changes.json      — skipped ({e})")

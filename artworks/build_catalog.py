#!/usr/bin/env python3
"""
Merge all JSON sidecars into a single catalog.json for the archive site.
Run this after any batch of catalog.py completes, or after editing featured.txt.

    python3 artworks/build_catalog.py

Featured works: edit /featured.txt (one art ID per line, # = comment).
Those works get featured:true in catalog.json, which drives the homepage grid.

Configuration is read from artist-config.json at the project root.
"""

import json, datetime, urllib.parse, re, hashlib
from pathlib import Path

# ── Stable writes — skip rewriting a generated file when only a timestamp would
#    change, so no-op builds don't churn git (api `generated`, feed dates). This
#    is what left session-end.sh with post-commit residuals every run. ────────
_GEN_TS  = [r'"generated":\s*"[^"]*"']
_FEED_TS = [r'<lastBuildDate>[^<]*</lastBuildDate>', r'<pubDate>[^<]*</pubDate>']

def _write_stable(path, content, volatile=()):
    """Write only if `content` differs from the existing file once `volatile`
    regex substrings are blanked out. Returns True if it actually wrote."""
    if path.exists():
        norm = (lambda s: re.sub('|'.join(volatile), '', s)) if volatile else (lambda s: s)
        if norm(path.read_text()) == norm(content):
            return False
    path.write_text(content)
    return True

ROOT    = Path(__file__).parent.parent
API_V1  = ROOT / "api" / "v1"
API_WORKS = API_V1 / "works"

FULL        = Path(__file__).parent / "full"
OUT         = ROOT / "config" / "catalog.json"
OUT_LITE    = ROOT / "config" / "catalog-lite.json"
OUT_HOME    = ROOT / "config" / "catalog-home.json"
OUT_SITEMAP = ROOT / "sitemap.xml"
OUT_FEED    = ROOT / "feed.xml"

HOME_LIMIT  = 30   # max records served to the homepage

# ── Load artist-config.json ───────────────────────────────────────────────────
_CFG_PATH = ROOT / "config" / "artist-config.json"
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

# Fields kept in the lite catalog.
# Consumers: search.js (file,title,year,work_type,themes,keywords,motifs)
#            series.html (series — needed for ?series= named-series filter)
# Stripped: palette, composition — not read by any consumer
# Stripped: description — search.js does not index it; no consumer reads it from
#            catalog-lite.json (gen-artwork-pages.py reads catalog.json directly).
#            Removing it cuts the gzipped wire payload from ~153KB to ~66KB (57%).
LITE_FIELDS = {'file', 'title', 'work_type', 'year', 'themes', 'keywords', 'motifs', 'favorite', 'featured', 'series', 'orientation', 'composite', 'year_precision', 'year_display', 'has_back'}

# Title language that marks an image as a staged "imagined placement" composite
# even when it isn't tagged Gallery/Studio (master-notes §22/§25).
PLACEMENT_RE = re.compile(
    r'installation|panorama|gallery|exhibit|crowd|booth|art fair|'
    r'wall installation|wall with works|on the wall', re.I)
FEATURED   = Path(__file__).parent.parent / "featured.txt"
FAVORITES  = Path(__file__).parent.parent / "favorites.txt"

def _load_id_file(path):
    ids = set()
    if path.exists():
        for line in path.read_text().splitlines():
            line = line.split('#')[0].strip()
            if line:
                ids.add(line)
    return ids

featured_ids = _load_id_file(FEATURED)
favorite_ids = _load_id_file(FAVORITES)

# ── Orientation (derived from image proportions) ──────────────────────────────
# dims.json holds [width, height] in thumbnail pixels for every work. This is a
# stand-in for physical dimensions (which require Jeff to measure) — it lets the
# archive filter and artwork pages show whether a piece is vertical, horizontal,
# or square. A 10% tolerance band keeps near-square works out of the tall/wide
# buckets. Rerun build_dims.py if dims.json is ever missing or stale.
DIMS = ROOT / "config" / "dims.json"
_dims = {}
if DIMS.exists():
    try:
        _dims = json.loads(DIMS.read_text())
    except Exception as e:
        print(f"Warning: could not parse dims.json: {e}")

def _orientation(art_id):
    wh = _dims.get(art_id)
    if not wh or len(wh) < 2 or not wh[0] or not wh[1]:
        return None
    w, h = wh[0], wh[1]
    if h > w * 1.1:
        return 'vertical'
    if w > h * 1.1:
        return 'horizontal'
    return 'square'

records = []
skipped = []
cataloged_ids = set()

# Load records that have full sidecar JSON
# Skip _back.json files — these are associated media for double-sided works, not independent records
for p in sorted(FULL.glob("art*.json")):
    art_id = p.stem  # e.g. "art0061"
    if art_id.endswith("_back"):
        continue  # Skip back-side metadata; only the primary artwork is cataloged
    try:
        rec = json.loads(p.read_text())
        rec['featured'] = art_id in featured_ids
        rec['favorite'] = art_id in favorite_ids
        rec['orientation'] = _orientation(art_id)
        # Detect if this artwork has a reverse side
        rec['has_back'] = (FULL / f"{art_id}_back.avif").exists()
        records.append(rec)
        cataloged_ids.add(art_id)
    except Exception as e:
        skipped.append(f"{p.name}: {e}")

# Add stub entries for every thumbnail that has no sidecar yet.
# This makes all artworks visible in the archive before the AI batch runs.
# Skip _back.avif files — these are associated media for double-sided works, not independent records.
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
    if art_id.endswith("_back"):
        continue  # Skip back-side images; only primary artwork is cataloged
    if art_id not in cataloged_ids:
        pdata = pending.get(art_id, {})
        # Detect if this artwork has a reverse side
        has_back = (FULL / f"{art_id}_back.avif").exists()
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
            'favorite': art_id in favorite_ids,
            'description': None,
            'composition': None,
            'orientation': _orientation(art_id),
            'has_back': has_back,
        })

# Keep catalog in stable ID order
records.sort(key=lambda r: r.get('file', ''))

# ── Provenance fields (session 36) ───────────────────────────────────────────
# year_precision: every year is a decade-bucket estimate (creator-confirmed —
#   even the 9 non-round ones are guesses, not known dates). Display as "1990s (est.)".
# composite: Gallery/Studio/installation imagery = Photoshop "imagined placements",
#   NOT real single works or real exhibitions (master-notes §22/§25). Broadest sweep:
#   Gallery theme OR Studio theme OR placement-language title.
#
# Amended 2026-08-02 (Jeff, creator): the blanket "everything is an estimate"
# rule above was right for the corpus but wrong for the handful of works Jeff
# signed and dated himself. Those dates are not guesses — they are written on
# the work in his hand, and calling them "(est.)" understated what the archive
# can prove. A sidecar may now declare year_precision "exact"; anything that
# does not is still an estimate, so the default is unchanged and nothing can
# become "exact" by accident.
#
# Setting it requires meeting §4.1 of the METADATA-STEWARDSHIP-CONSTITUTION —
# primary-source evidence, which here means a legible date on the work itself,
# confirmed by Jeff. It is deliberately not inferred from the catalog
# description: those are machine-written and demonstrably unreliable about
# exactly this (art0379's description reads the signature as 11/30/2022; the
# work plainly says 1/30/2022).
for r in records:
    y = r.get('year')
    authored_precision = r.get('year_precision')  # curator-authored, if present
    if y not in (None, '') and str(y).isdigit():
        decade = (int(y) // 10) * 10
        if authored_precision == 'exact':
            r['year_precision'] = 'exact'
            r['year_display'] = str(int(y))
        else:
            r['year_precision'] = 'estimated'
            r['year_display'] = f'{decade}s (est.)'
    th = r.get('themes') or []
    r['composite'] = ('Gallery' in th) or ('Studio' in th) or bool(PLACEMENT_RE.search(r.get('title') or ''))

_n_comp = sum(1 for r in records if r.get('composite'))
print(f"provenance        — {_n_comp} composites flagged; {len(records)} years marked estimated")

_new_catalog = json.dumps(records, separators=(',', ':'))
_catalog_changed = not OUT.exists() or OUT.read_text() != _new_catalog
OUT.write_text(_new_catalog)
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
if favorite_ids:
    found_fav = sum(1 for r in records if r.get('favorite'))
    print(f"Favorites: {found_fav} works marked (from favorites.txt)")
if skipped:
    print(f"Skipped {len(skipped)}:")
    for s in skipped:
        print(f"  {s}")

# ── sitemap.xml ──────────────────────────────────────────────────────────────
# Intentionally excluded from sitemap:
#   artwork.html   — dynamic (?id=artNNNN); the durable equivalent is
#                    artworks/pages/artNNNN.html, which IS listed below
#   404.html       — error page, not indexable
# When adding a new public page: add it to entries[] AND run audit-nav.sh to verify
# (its reverse-sitemap check reports any public page missing from this list).
today       = datetime.date.today().isoformat()

entries = [
    (SITE_URL + '/',                        '1.0', 'monthly'),
    (SITE_URL + '/archive.html',            '0.9', 'weekly'),
    # Museum rooms (primary navigation)
    (SITE_URL + '/current.html',            '0.8', 'monthly'),
    (SITE_URL + '/flooded-wing.html',       '0.8', 'monthly'),
    (SITE_URL + '/guernica-passage.html',   '0.8', 'monthly'),
    (SITE_URL + '/hall-of-openings.html',   '0.8', 'monthly'),
    (SITE_URL + '/the-studio.html',         '0.8', 'monthly'),
    (SITE_URL + '/working-history.html',    '0.8', 'monthly'),
    (SITE_URL + '/about.html',              '0.8', 'monthly'),
    (SITE_URL + '/stories.html',            '0.7', 'monthly'),
    # Reference
    (SITE_URL + '/privacy.html',            '0.3', 'yearly'),
    (SITE_URL + '/sitemap.html',            '0.7', 'monthly'),
]
# Every individual artwork page. These are the archive — excluding them left
# fifty years of work effectively invisible to search.
#
# They were previously omitted on the reasoning "discovery via archive.html +
# filters instead". That path is built entirely in JavaScript: a crawler that
# does not execute JS finds exactly one link into the whole collection (the
# static-catalog link on archive.html) and would have to walk a 1,087-deep
# prev/next chain from there — which crawlers abandon. So the stated
# alternative did not actually provide discovery.
#
# Priority 0.6, below the rooms, because they are numerous and individually
# less important than the curated entry points — not because they are
# optional. Lastmod is per-file mtime so a corrected record re-announces
# itself rather than the whole catalog looking freshly changed every build.
_ART_PAGES = ROOT / "artworks" / "pages"
for r in records:
    art_id = r['file'].replace('.avif', '')
    page = _ART_PAGES / f"{art_id}.html"
    if not page.exists():
        continue  # never advertise a URL that would 404
    mtime = datetime.date.fromtimestamp(page.stat().st_mtime).isoformat()
    entries.append((f"{SITE_URL}/artworks/pages/{art_id}.html", '0.6', 'yearly', mtime))

lines = ['<?xml version="1.0" encoding="UTF-8"?>',
         '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for entry in entries:
    # Room/reference entries are (loc, prio, freq) and use today's date.
    # Artwork pages carry a 4th element, their own mtime, so that correcting a
    # single record doesn't announce all 1,087 as modified today.
    loc, prio, freq = entry[0], entry[1], entry[2]
    lastmod = entry[3] if len(entry) > 3 else today
    lines += [
        '  <url>',
        f'    <loc>{loc}</loc>',
        f'    <lastmod>{lastmod}</lastmod>',
        f'    <changefreq>{freq}</changefreq>',
        f'    <priority>{prio}</priority>',
        '  </url>',
    ]
lines.append('</urlset>')
OUT_SITEMAP.write_text('\n'.join(lines) + '\n')
print(f"sitemap.xml       — {len(entries)} URLs")

# ── RSS feed — 20 most recently added works ───────────────────────────────────
def _xml(s):
    return str(s).replace('&','&amp;').replace('<','&lt;').replace('>','&gt;').replace('"','&quot;')

recent_20 = sorted(records, key=lambda r: r['file'], reverse=True)[:20]
pub_date  = datetime.datetime.now(datetime.timezone.utc).strftime('%a, %d %b %Y %H:%M:%S +0000')
feed_lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    f'    <title>{_xml(ARTIST_NAME)} — Archive</title>',
    f'    <link>{_xml(SITE_URL)}/</link>',
    f'    <description>New works added to the archive of {_xml(ARTIST_NAME)}</description>',
    f'    <atom:link href="{_xml(SITE_URL)}/feed.xml" rel="self" type="application/rss+xml"/>',
    f'    <lastBuildDate>{pub_date}</lastBuildDate>',
    '    <language>en-us</language>',
    '    <ttl>1440</ttl>',
]
for r in recent_20:
    art_id    = r['file'].replace('.avif', '')
    title     = r.get('title') or art_id
    url       = f"{SITE_URL}/artworks/pages/{art_id}.html"
    img_url   = f"{SITE_URL}/artworks/thumbs/{r['file']}"
    year      = r.get('year', '')
    work_type = (r.get('work_type') or '').replace('_', ' ').title()
    desc      = r.get('description', '')
    meta      = ', '.join(filter(None, [str(year) if year else '', work_type]))
    full_desc = f"{desc} {meta}".strip() if desc else meta
    feed_lines += [
        '    <item>',
        f'      <title>{_xml(title)}</title>',
        f'      <link>{_xml(url)}</link>',
        f'      <guid isPermaLink="true">{_xml(url)}</guid>',
        f'      <description>{_xml(full_desc)}&lt;br&gt;&lt;img src="{_xml(img_url)}" alt="{_xml(title)}"&gt;</description>',
        f'      <pubDate>{pub_date}</pubDate>',
        '    </item>',
    ]
feed_lines += ['  </channel>', '</rss>']
_write_stable(OUT_FEED, '\n'.join(feed_lines) + '\n', _FEED_TS)
print(f"feed.xml          — {len(recent_20)} recent works")

# ── Auto-patch work counts in medium, theme, and decade pages ─────────────────
# Each entry: (html_filename, count_function)
# The function receives the full records list and returns an integer count.
# build_catalog.py replaces every occurrence of the old number in context-sensitive
# patterns (numberOfItems, meta description, og:description, JSON-LD description,
# visible paragraph text) so all counts stay in sync whenever new works are ingested.

def _count_type(recs, wtype):
    return sum(1 for r in recs if (r.get('work_type') or '') == wtype)

def _count_theme(recs, theme):
    return sum(1 for r in recs if theme in (r.get('themes') or []))

def _count_series(recs, series_name):
    return sum(1 for r in recs if (r.get('series') or '') == series_name)

def _count_decade(recs, start, end):
    return sum(1 for r in recs if start <= (r.get('year') or 0) <= end)

PAGE_COUNTS = [
    # Medium pages
    ('collage.html',        lambda r: _count_type(r, 'collage')),
    ('photography.html',    lambda r: _count_type(r, 'photograph')),
    ('sculpture.html',      lambda r: _count_type(r, 'sculpture')),
    ('painting.html',       lambda r: _count_type(r, 'painting')),
    # Theme pages
    ('targets.html',        lambda r: _count_theme(r, 'Targets')),
    ('framed.html',         lambda r: _count_theme(r, 'Framed')),
    ('torsos-faces.html',   lambda r: _count_theme(r, 'Torsos & Faces')),
    ('gallery-images.html', lambda r: _count_theme(r, 'Gallery')),
    ('mr-snowmann.html',    lambda r: _count_theme(r, 'Mr. Snowmann')),
    ('crosses.html',        lambda r: _count_theme(r, 'Crosses')),
    ('collaboration.html',  lambda r: _count_theme(r, 'Collaboration')),
    # Series pages
    ('guernica.html',       lambda r: _count_series(r, 'Guernica')),
    # Decade pages
    ('1970s.html',          lambda r: _count_decade(r, 1970, 1979)),
    ('1980s.html',          lambda r: _count_decade(r, 1980, 1989)),
    ('1990s.html',          lambda r: _count_decade(r, 1990, 1999)),
    ('2000s.html',          lambda r: _count_decade(r, 2000, 2009)),
    ('2010s.html',          lambda r: _count_decade(r, 2010, 2019)),
    ('2020s.html',          lambda r: _count_decade(r, 2020, 2029)),
]

# Patterns that contain the count — each is a (search, replace_template) pair
# where {old} and {new} are substituted before applying re.sub.
COUNT_PATTERNS = [
    # JSON-LD numberOfItems
    (r'"numberOfItems":\s*{old}\b',         '"numberOfItems": {new}'),
    # visible paragraph: "NNN works" or "NNN&nbsp;works"
    (r'\b{old}(?:&nbsp;|&#x00A0;|\s)works\b', '{new} works'),
    (r'\b{old} works\b',                     '{new} works'),
    # numberOfItems already covered; catch stray bare numbers only in specific attrs
    (r'(?<="numberOfItems": ){old}\b',       '{new}'),
]

_patch_count = 0
for page_file, count_fn in PAGE_COUNTS:
    page_path = ROOT / page_file
    if not page_path.exists():
        continue
    new_count = count_fn(records)
    html = page_path.read_text(encoding='utf-8')

    # Find the current count written in the file (numberOfItems value)
    m = re.search(r'"numberOfItems":\s*(\d+)', html)
    if not m:
        continue
    old_count = int(m.group(1))
    if old_count == new_count:
        continue  # nothing to do

    old_s, new_s = str(old_count), str(new_count)

    # 1. numberOfItems
    html = re.sub(
        r'("numberOfItems":\s*)' + old_s + r'\b',
        r'\g<1>' + new_s,
        html
    )
    # 2. visible text: "NNN works" and "NNN&nbsp;works"
    html = re.sub(r'\b' + old_s + r'(?=(?:&nbsp;|&#x00A0;)works\b)', new_s, html)
    html = re.sub(r'\b' + old_s + r'(?= works\b)', new_s, html)
    # 3. meta/og/JSON-LD description strings that start with the count
    #    e.g. content="638 collage works..." or "638 collages..."
    html = re.sub(r'(?<=["\s])' + old_s + r'(?= \w)', new_s, html)

    page_path.write_text(html, encoding='utf-8')
    _patch_count += 1
    print(f"{page_file:<28} — count updated {old_s} → {new_s}")

if _patch_count == 0:
    print("page counts       — all up to date")

# ── Stamp build timestamp into index.html catalog fetch URL ──────────────────
# Replaces ?v=BUILD_TS so browsers always fetch fresh catalog-home.json after deploy.
INDEX  = Path(__file__).parent.parent / "index.html"
SW     = Path(__file__).parent.parent / "sw.js"
build_ts = datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%d%H%M%S')

if INDEX.exists():
    stamped = re.sub(r'\?v=(?:BUILD_TS|\d{14})', f'?v={build_ts}', INDEX.read_text())

    # ── Stamp the hero pool from artworks/featured-hero.txt into index.html ──
    # The pool is inlined between HERO_POOL markers so the LCP hero image is
    # discovered at HTML parse time (no featured-hero.txt fetch on the critical
    # path). featured-hero.txt remains the editing surface — rerun this script
    # after changing it.
    hero_txt = Path(__file__).parent / "featured-hero.txt"
    if hero_txt.exists():
        pool = []
        for line in hero_txt.read_text().splitlines():
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            parts = [p.strip() for p in line.split('|')]
            if len(parts) < 2 or not parts[0]:
                continue
            entry = {"id": parts[0], "caption": parts[1],
                     "pos": parts[2] if len(parts) > 2 and parts[2] else "center center"}
            if len(parts) > 3 and parts[3]:
                entry["origin"] = parts[3]
            pool.append(entry)
        pool_js = ("  /* HERO_POOL:START — auto-generated, do not edit by hand */\n"
                   f"  var POOL = {json.dumps(pool, ensure_ascii=False)};\n"
                   "  /* HERO_POOL:END */")
        stamped, n = re.subn(
            r'[ \t]*/\* HERO_POOL:START[^\n]*\n.*?/\* HERO_POOL:END \*/',
            lambda m: pool_js, stamped, flags=re.S)
        if n:
            print(f"index.html        — hero pool stamped ({len(pool)} works)")
        else:
            print("index.html        — WARNING: HERO_POOL markers not found, pool not stamped")

        # ── Stamp the <head> preload links from pool[0] (the LCP anchor) ──
        # Slide 0 is fixed in init(), so we can preload its exact image at parse
        # time. href matches the /full/ path the <img> requests (htaccess rewrites
        # to the flat dir server-side; preload-match is on the requested URL).
        if pool:
            lcp_id = pool[0]["id"]
            preload_html = (
                "<!-- HERO_PRELOAD:START — auto-generated from featured-hero.txt line 1 by build_catalog.py -->\n"
                f'<link rel="preload" as="image" href="artworks/full/{lcp_id}-hero-m.avif" type="image/avif" media="(max-width: 767px)" fetchpriority="high"/>\n'
                f'<link rel="preload" as="image" href="artworks/full/{lcp_id}-hero.avif" type="image/avif" media="(min-width: 768px)" fetchpriority="high"/>\n'
                "<!-- HERO_PRELOAD:END -->")
            stamped, pn = re.subn(
                r'<!-- HERO_PRELOAD:START.*?HERO_PRELOAD:END -->',
                lambda m: preload_html, stamped, flags=re.S)
            if pn:
                print(f"index.html        — hero preload stamped ({lcp_id})")
            else:
                print("index.html        — WARNING: HERO_PRELOAD markers not found, preload not stamped")

            # ── Stamp the static slide-0 <img> (the LCP element) in both heroes ──
            # Rendering slide 0 as real HTML (not JS-injected) lets it paint
            # straight from the preload, off the JS critical path. init() reuses
            # it (skips i===0). Kept in sync with pool[0] here.
            cap0 = (pool[0].get("caption") or "").replace('"', '&quot;')
            pos0 = pool[0].get("pos") or "center center"
            for suf, var in (("M", "-hero-m"), ("D", "-hero")):
                cls = f"hero-slide hero-slide-{suf.lower()} is-active"
                slide0 = (
                    f"<!-- HERO_SLIDE0_{suf}:START -->"
                    f'<img class="{cls}" src="artworks/full/{lcp_id}{var}.avif" '
                    f'alt="{cap0} — Jeffrey F. S. Neumann" '
                    f'style="width:100%;height:100%;object-fit:cover;object-position:{pos0}" fetchpriority="high">'
                    f"<!-- HERO_SLIDE0_{suf}:END -->")
                stamped, s0n = re.subn(
                    rf'<!-- HERO_SLIDE0_{suf}:START -->.*?<!-- HERO_SLIDE0_{suf}:END -->',
                    lambda m: slide0, stamped, flags=re.S)
                if not s0n:
                    print(f"index.html        — WARNING: HERO_SLIDE0_{suf} markers not found")
            print(f"index.html        — static slide-0 stamped ({lcp_id})")

    INDEX.write_text(stamped)
    print(f"index.html        — cache stamp updated (?v={build_ts})")

# ── Stamp the live work count into the pages ─────────────────────────────────
# The count appeared as a hardcoded literal in ~70 places across 14 pages and
# went stale the moment a work was added — it read 1,086 while the catalog held
# 1,087. Stamping it here means it is correct by construction on every rebuild,
# which is exactly when it can change.
#
# Every pattern is anchored to work-context ("N WORKS", "N works", or a known
# counter element). It must never match a bare comma-number: the CSS carries 87
# instances of rgb(255,102,0) and friends, and a naive \d{1,3},\d{3} would
# rewrite them into colours that don't exist. That is the whole reason this is a
# list of narrow patterns rather than one convenient regex.
#
# Narrative prose deliberately does NOT carry a figure — it says "over a
# thousand" (or omits the number) so it reads as written English and never
# needs stamping. Only real figures are stamped.
_count_str = f"{len(records):,}"
_COUNT_PATTERNS = [
    # "1,086 WORKS" / "1,086 works" / "1,086 Works" — keeps the original casing.
    (re.compile(r"\b\d{1,3},\d{3}(?=\s+(?:WORKS|works|Works)\b)"), _count_str),
    # Dedicated counter elements whose entire content is the number.
    (re.compile(r'(<span class="stat-number">)\d{1,3},\d{3}(</span>)'),
     rf"\g<1>{_count_str}\g<2>"),
    (re.compile(r'(<span id="count">)\d{1,3},\d{3}(</span>)'),
     rf"\g<1>{_count_str}\g<2>"),
]
_stamped_pages = 0
for _page in sorted(ROOT.glob("*.html")):
    _orig = _page.read_text(encoding="utf-8")
    _new = _orig
    for _pat, _repl in _COUNT_PATTERNS:
        _new = _pat.sub(_repl, _new)
    if _new != _orig:
        _page.write_text(_new, encoding="utf-8")
        _stamped_pages += 1
if _stamped_pages:
    print(f"work count        — stamped {_count_str} into {_stamped_pages} page(s)")
else:
    print(f"work count        — already {_count_str} everywhere")

# ── Auto-bump sw.js CACHE_V whenever catalog OR a watched static asset changed ─
# Watched assets: compiled CSS, shared JS/CSS, search.js, and every top-level
# HTML page. Hash is cached in artworks/.asset_hash so a no-op run (nothing
# changed) leaves sw.js untouched, matching the catalog-unchanged behavior above.
_ASSET_HASH_FILE = Path(__file__).parent / ".asset_hash"
_watched = [ROOT / "site.min.css", ROOT / "search.js"]
_watched += sorted((ROOT / "_shared").glob("*.js"))
_watched += sorted((ROOT / "_shared").glob("*.css"))
_watched += [p for p in sorted(ROOT.glob("*.html")) if p.name != "index.html"]
# index.html is excluded: build_catalog re-stamps it (build_ts, hero pool) on
# every run, which would make the hash look "changed" even with no real edits.
_hasher = hashlib.sha256()
for _f in _watched:
    if _f.exists():
        _hasher.update(_f.read_bytes())
_new_asset_hash = _hasher.hexdigest()
_prev_asset_hash = _ASSET_HASH_FILE.read_text().strip() if _ASSET_HASH_FILE.exists() else ""
_assets_changed = _new_asset_hash != _prev_asset_hash
_ASSET_HASH_FILE.write_text(_new_asset_hash)

if SW.exists():
    if not (_catalog_changed or _assets_changed):
        print("sw.js             — CACHE_V unchanged (catalog + assets unchanged)")
    else:
        if _assets_changed and not _catalog_changed:
            print("sw.js             — bumping CACHE_V (static asset changed)")
        sw_text     = SW.read_text()
        new_cache_v = f"jfsn-{build_ts}"
        cur_match   = re.search(r"CACHE_V\s*=\s*'(jfsn-[^']+)'", sw_text)
        cur_cache_v = cur_match.group(1) if cur_match else ""
        if new_cache_v > cur_cache_v:
            stamped_sw = re.sub(r"CACHE_V\s*=\s*'jfsn-[^']+'", f"CACHE_V  = '{new_cache_v}'", sw_text)
            SW.write_text(stamped_sw)
            print(f"sw.js             — CACHE_V bumped to '{new_cache_v}'")
        else:
            print(f"sw.js             — CACHE_V unchanged (current '{cur_cache_v}' is newer or equal)")

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
        "page":  f"{SITE_URL}/artworks/pages/{art_id}.html",
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
    # Anyone consuming this data will otherwise assume the artist wrote the
    # titles and descriptions. He did not. Stated here because the citation
    # line above actively invites scholarly reuse.
    "metadata_provenance": {
        "titles_and_descriptions": (
            "Machine-generated from photographs of the works by a vision-language "
            "model, not authored by the artist. Reviewed unevenly. Treat as finding "
            "aids, not as the artist's words or as curatorial authority. Known to "
            "contain errors — see 'known_issues'."
        ),
        "years": (
            "Decade estimates, not documented dates. Every record carries "
            "year_precision 'estimated', including works that are visibly signed "
            "and dated."
        ),
        "composite_flag": (
            "composite: true marks a Photoshop composite depicting an imagined "
            "installation. These are artworks, not documentation — the exhibitions "
            "they show never happened. 250 of 1087 records."
        ),
        "artist_own_words": f"{SITE_URL}/stories.html — verbatim, dated oral history",
        "known_issues": (
            "Machine-written titles can contradict their own descriptions, including "
            "on colour. Corrections are made only on the artist's confirmation."
        ),
    },
}
_write_stable(API_V1 / "meta.json", json.dumps(meta, indent=2), _GEN_TS)

# works.json — full catalog (compact; large file)
works_envelope = {
    "api_version": "1",
    "generated": now,
    "count": len(cataloged),
    "works": cataloged,
}
_write_stable(API_V1 / "works.json", json.dumps(works_envelope, separators=(',', ':')), _GEN_TS)

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
_write_stable(API_V1 / "themes.json", json.dumps({
    "api_version": "1", "generated": now,
    "count": len(themes_data), "themes": themes_data,
}, separators=(',', ':')), _GEN_TS)

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
_write_stable(API_V1 / "series.json", json.dumps({
    "api_version": "1", "generated": now,
    "count": len(named_series), "series": named_series,
}, separators=(',', ':')), _GEN_TS)

# motifs.json
motifs_data = _facet_index("motifs", "motif")
_write_stable(API_V1 / "motifs.json", json.dumps({
    "api_version": "1", "generated": now,
    "count": len(motifs_data), "motifs": motifs_data,
}, separators=(',', ':')), _GEN_TS)

# palette.json
palette_data = _facet_index("palette", "color")
_write_stable(API_V1 / "palette.json", json.dumps({
    "api_version": "1", "generated": now,
    "count": len(palette_data), "palette": palette_data,
}, separators=(',', ':')), _GEN_TS)

# materials.json
materials_data = _facet_index("materials", "material")
_write_stable(API_V1 / "materials.json", json.dumps({
    "api_version": "1", "generated": now,
    "count": len(materials_data), "materials": materials_data,
}, separators=(',', ':')), _GEN_TS)

# .htaccess — CORS + content-type for Apache (cPanel compatible)
# Note: mod_security directives removed — IfModule guards are insufficient on
# HostGator; SecFilter*/SecRuleEngine in .htaccess returns 500 regardless.
htaccess = """\
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

n_works = len(cataloged)
print(f"\napi/v1/meta.json  — discovery endpoint")
print(f"api/v1/works.json — {n_works} cataloged works")
print(f"api/v1/works/     — {n_works} per-work files")
print(f"api/v1/themes.json, materials.json, series.json, motifs.json, palette.json")
print(f"api/.htaccess     — CORS headers (Apache/cPanel)")

# ── Patch hard-coded counts in search.js browseHTML() ────────────────────────
# search.js embeds three work counts as string literals in browseHTML().
# Keeps them in sync with the catalog automatically on every build.
SEARCH_JS = ROOT / "search.js"
if SEARCH_JS.exists():
    _sjs = SEARCH_JS.read_text()
    _sjs_orig = _sjs
    _search_patches = [
        ('Guernica',     _count_series(records, 'Guernica'),  r"(label: 'Guernica Series'.*?meta: ')\d+ works(')"),
        ('Targets',      _count_theme(records,  'Targets'),   r"(label: 'Targets'.*?meta: ')\d+ works(')"),
        ('Mr. SNOWmann', _count_theme(records,  'Mr. Snowmann'), r"(label: 'Mr. SNOWmann'.*?meta: ')\d+ works(')"),
    ]
    for name, count, pattern in _search_patches:
        _sjs = re.sub(pattern, rf"\g<1>{count} works\g<2>", _sjs, flags=re.DOTALL)
    if _sjs != _sjs_orig:
        SEARCH_JS.write_text(_sjs)
        print(f"search.js         — browse counts updated")
    else:
        print(f"search.js         — browse counts up to date")

# ── Living changelog ─────────────────────────────────────────────────────────
# Parses git log into changes.json for the /changes.html page.
try:
    import sys
    sys.path.insert(0, str(Path(__file__).parent))
    import build_changes
    build_changes.main()
except Exception as e:
    print(f"changes.json      — skipped ({e})")

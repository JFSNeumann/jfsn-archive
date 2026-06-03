#!/usr/bin/env python3
"""Generate static artwork detail pages at artworks/pages/artNNNN.html."""
import json, os, html, re, sys

BASE = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(BASE, 'artworks', 'pages')

with open(os.path.join(BASE, 'catalog.json')) as f:
    catalog = json.load(f)

with open(os.path.join(BASE, 'chromatic.json')) as f:
    chromatic = json.load(f)

# Build color lookup
color_by_id = {item['id']: item['bg'] for item in chromatic}

# Sort by numeric ID
def work_id(w):
    m = re.search(r'(\d+)', w['file'])
    return int(m.group(1)) if m else 0

catalog.sort(key=work_id)
id_to_idx = {w['file'].replace('.avif',''): i for i, w in enumerate(catalog)}

# Theme slug map
THEME_SLUGS = {
    'Mr. Snowmann':   'mr-snowmann.html',
    'Crosses':        'crosses.html',
    'Targets':        'targets.html',
    'Torsos & Faces': 'torsos-faces.html',
    'Framed':         'framed.html',
    'Gallery':        'gallery-images.html',
    'Collaboration':  'collaboration.html',
}
SERIES_SLUGS = {
    'Guernica': 'guernica.html',
}

TYPE_LABELS = {
    'collage':    'Collage',
    'sculpture':  'Sculpture',
    'photography':'Photography',
    'painting':   'Painting',
    'drawing':    'Drawing',
    'print':      'Print',
    'mixed-media':'Mixed Media',
}

def type_label(t):
    return TYPE_LABELS.get(t, t.replace('-', ' ').title() if t else 'Work')

def related_works(w, n=4):
    wid = w['file'].replace('.avif','')
    pool = [x for x in catalog if x['file'] != w['file']]
    if w.get('series'):
        same = [x for x in pool if x.get('series') == w['series']]
    else:
        same = [x for x in pool if x.get('work_type') == w.get('work_type')]
    import random; rng = random.Random(wid)
    rng.shuffle(same)
    picks = same[:n]
    if len(picks) < n:
        rest = [x for x in pool if x not in picks]
        rng.shuffle(rest)
        picks += rest[:n - len(picks)]
    return picks[:n]

def theme_link(theme):
    slug = THEME_SLUGS.get(theme)
    if slug:
        return f'<a href="../../{slug}" style="color:#FF6600;text-decoration:none;border-bottom:1px solid rgba(255,102,0,0.3);">{html.escape(theme)}</a>'
    return html.escape(theme)

def series_link(series):
    slug = SERIES_SLUGS.get(series)
    if slug:
        return f'<a href="../../{slug}" style="color:#FF6600;text-decoration:none;border-bottom:1px solid rgba(255,102,0,0.3);">{html.escape(series)}</a>'
    return html.escape(series)

def meta_row(label, value):
    return (
        f'<div style="display:flex;flex-direction:column;gap:2px;padding-bottom:12px;border-bottom:1px solid rgba(11,11,11,0.08);">'
        f'<span style="font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#575757;">{label}</span>'
        f'<span style="font-size:14px;color:#0B0B0B;">{value}</span>'
        f'</div>'
    )

def related_card(rw):
    rid = rw['file'].replace('.avif','')
    rtitle = html.escape(rw.get('title','Untitled'))
    ryear = rw.get('year','')
    rcolor = color_by_id.get(rid, '#ebe8e2')
    return (
        f'<a href="{rid}.html" style="display:block;text-decoration:none;color:#0B0B0B;">'
        f'<div style="background:{rcolor};overflow:hidden;aspect-ratio:1/1;margin-bottom:6px;">'
        f'<img src="../thumbs/{rw["file"]}" alt="{rtitle}" loading="lazy" '
        f'style="width:100%;height:100%;object-fit:cover;filter:grayscale(100%);transition:filter 0.4s ease;" '
        f'onmouseover="this.style.filter=\'grayscale(0%)\'" onmouseout="this.style.filter=\'grayscale(100%)\'"></div>'
        f'<div style="font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#575757;line-height:1.4;">'
        f'{rtitle}<br><span style="color:#9b9b9b;">{ryear}</span></div>'
        f'</a>'
    )

def generate(w, idx):
    wid = w['file'].replace('.avif','')
    title = w.get('title','Untitled')
    year = w.get('year','')
    wtype = w.get('work_type','')
    desc = w.get('description','')
    palette = w.get('palette',[])
    motifs = w.get('motifs',[])
    materials = w.get('materials',[])
    composition = w.get('composition','')
    themes = w.get('themes',[])
    series = w.get('series')
    dominant = color_by_id.get(wid, '#ebe8e2')

    # Prev / next
    prev_w = catalog[idx-1] if idx > 0 else None
    next_w = catalog[idx+1] if idx < len(catalog)-1 else None

    canonical = f'https://jfsn.com/artworks/pages/{wid}.html'
    og_desc = f'{html.escape(desc[:200])} — From the archive of Jeffrey F. S. Neumann.' if desc else f'{html.escape(title)}, {year} — {type_label(wtype)} by Jeffrey F. S. Neumann.'

    json_ld = {
        "@context": "https://schema.org",
        "@type": "VisualArtwork",
        "name": title,
        "url": canonical,
        "image": f"https://jfsn.com/artworks/thumbs/{w['file']}",
        "dateCreated": str(year) if year else None,
        "artMedium": ', '.join(materials) if materials else type_label(wtype),
        "description": desc or None,
        "creator": {
            "@type": "Person",
            "name": "Jeffrey F. S. Neumann",
            "url": "https://jfsn.com/about.html",
            "jobTitle": "Artist",
            "address": {"@type": "PostalAddress", "addressLocality": "Cleveland", "addressRegion": "OH"}
        },
        "isPartOf": {
            "@type": "CollectionPage",
            "name": "The Archive — Jeffrey F. S. Neumann",
            "url": "https://jfsn.com/archive.html"
        },
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type":"ListItem","position":1,"name":"Archive","item":"https://jfsn.com/archive.html"},
                {"@type":"ListItem","position":2,"name":title,"item":canonical}
            ]
        }
    }
    # Remove None values
    json_ld = {k:v for k,v in json_ld.items() if v is not None}

    # Meta rows
    rows = []
    rows.append(meta_row('Year', str(year) if year else '—'))
    rows.append(meta_row('Medium', type_label(wtype)))
    if materials:
        rows.append(meta_row('Materials', html.escape(', '.join(materials))))
    if series:
        rows.append(meta_row('Series', series_link(series)))
    if themes:
        rows.append(meta_row('Themes', ', '.join(theme_link(t) for t in themes)))
    if palette:
        swatches = ''.join(f'<span title="{p}" style="display:inline-block;width:14px;height:14px;border-radius:50%;background:{p};border:1px solid rgba(0,0,0,0.1);margin-right:4px;"></span>' for p in palette[:6])
        rows.append(meta_row('Palette', swatches + ' ' + html.escape(', '.join(palette[:6]))))
    if motifs:
        rows.append(meta_row('Motifs', html.escape(', '.join(motifs[:8]))))
    if composition:
        rows.append(meta_row('Composition', html.escape(composition)))
    rows_html = '\n'.join(rows)

    # Prev/next nav
    prev_html = ''
    if prev_w:
        pid = prev_w['file'].replace('.avif','')
        ptitle = html.escape(prev_w.get('title','Untitled'))
        prev_html = (
            f'<a href="{pid}.html" style="display:flex;align-items:center;padding:0 16px;height:100%;text-decoration:none;overflow:hidden;'
            f'transition:background 0.15s;" onmouseover="this.style.background=\'#ebe8e2\'" onmouseout="this.style.background=\'transparent\'">'
            f'<span style="font-family:\'Material Symbols Outlined\';font-size:20px;color:#0B0B0B;margin-right:10px;">arrow_back</span>'
            f'<div style="overflow:hidden;">'
            f'<div style="font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#575757;line-height:1;">Previous</div>'
            f'<div style="font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#0B0B0B;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{ptitle}</div>'
            f'</div></a>'
        )
    next_html = ''
    if next_w:
        nid = next_w['file'].replace('.avif','')
        ntitle = html.escape(next_w.get('title','Untitled'))
        next_html = (
            f'<a href="{nid}.html" style="display:flex;align-items:center;justify-content:flex-end;padding:0 16px;height:100%;text-decoration:none;overflow:hidden;'
            f'transition:background 0.15s;" onmouseover="this.style.background=\'#ebe8e2\'" onmouseout="this.style.background=\'transparent\'">'
            f'<div style="overflow:hidden;text-align:right;">'
            f'<div style="font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#575757;line-height:1;">Next</div>'
            f'<div style="font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#0B0B0B;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{ntitle}</div>'
            f'</div>'
            f'<span style="font-family:\'Material Symbols Outlined\';font-size:20px;color:#0B0B0B;margin-left:10px;">arrow_forward</span>'
            f'</a>'
        )

    # Related works
    rels = related_works(w)
    related_html = '\n'.join(related_card(r) for r in rels)

    meta_desc_raw = f'{title}, {year} — {type_label(wtype)} by Jeffrey F. S. Neumann. {desc[:160]}' if desc else f'{title}, {year} — {type_label(wtype)} by Jeffrey F. S. Neumann, Cleveland.'

    page = f'''<!DOCTYPE html>
<html class="light" lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="theme-color" content="#fcf9f3"/>
<title>{html.escape(title)} — Jeffrey F. S. Neumann</title>
<meta name="description" content="{html.escape(meta_desc_raw[:300])}"/>
<link rel="canonical" href="{canonical}"/>
<meta property="og:type" content="website"/>
<meta property="og:title" content="{html.escape(title)} — Jeffrey F. S. Neumann"/>
<meta property="og:description" content="{html.escape(og_desc[:300])}"/>
<meta property="og:image" content="https://jfsn.com/artworks/thumbs/{w['file']}"/>
<meta property="og:url" content="{canonical}"/>
<link rel="icon" href="../../favicon.svg" type="image/svg+xml"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="../../site.min.css"/>
<script type="application/ld+json">
{json.dumps(json_ld, ensure_ascii=False, indent=2)}
</script>
<style>
.msym{{font-family:'Material Symbols Outlined';font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24;display:inline-block;vertical-align:middle;line-height:1;}}
body{{-webkit-font-smoothing:antialiased;}}
@media(prefers-reduced-motion:reduce){{*,*::before,*::after{{transition:none!important;}}}}
</style>
</head>
<body style="background:#fcf9f3;color:#0B0B0B;font-family:Inter,sans-serif;margin:0;">

<!-- NAV -->
<a href="#main" style="position:absolute;left:-999px;top:auto;width:1px;height:1px;overflow:hidden;">Skip to content</a>
<header style="position:fixed;top:0;left:0;width:100%;z-index:50;display:flex;justify-content:space-between;align-items:center;padding:0 clamp(1rem,4vw,3rem);height:64px;background:#fcf9f3;border-bottom:1px solid #0B0B0B;box-sizing:border-box;">
  <div style="display:flex;align-items:center;gap:2rem;">
    <a href="../../index.html" style="font-family:'Playfair Display',serif;font-size:20px;font-weight:700;letter-spacing:-0.02em;color:#0B0B0B;text-decoration:none;">JFSN</a>
    <nav style="display:flex;gap:1.5rem;" aria-label="Primary">
      <a href="../../archive.html"      style="font-size:13px;font-weight:500;letter-spacing:0.06em;text-transform:uppercase;color:#0B0B0B;text-decoration:none;">Archive</a>
      <a href="../../series-index.html" style="font-size:13px;font-weight:500;letter-spacing:0.06em;text-transform:uppercase;color:#0B0B0B;text-decoration:none;">Series</a>
      <a href="../../timeline.html"     style="font-size:13px;font-weight:500;letter-spacing:0.06em;text-transform:uppercase;color:#0B0B0B;text-decoration:none;">Timeline</a>
      <a href="../../companion.html"    style="font-size:13px;font-weight:500;letter-spacing:0.06em;text-transform:uppercase;color:#0B0B0B;text-decoration:none;">Companion</a>
      <a href="../../about.html"        style="font-size:13px;font-weight:500;letter-spacing:0.06em;text-transform:uppercase;color:#0B0B0B;text-decoration:none;">About</a>
    </nav>
  </div>
</header>

<main id="main" style="padding-top:64px;">

  <!-- Breadcrumb -->
  <div style="padding:12px clamp(1rem,4vw,3rem);border-bottom:1px solid rgba(11,11,11,0.08);">
    <nav aria-label="Breadcrumb">
      <ol style="list-style:none;padding:0;margin:0;display:flex;gap:8px;align-items:center;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#575757;">
        <li><a href="../../archive.html" style="color:#575757;text-decoration:none;">Archive</a></li>
        <li aria-hidden="true" style="opacity:0.4;">/</li>
        <li aria-current="page" style="color:#0B0B0B;">{html.escape(title)}</li>
      </ol>
    </nav>
  </div>

  <!-- Primary grid -->
  <div style="display:grid;grid-template-columns:1fr;gap:2rem;padding:clamp(1.5rem,4vw,3rem) clamp(1rem,4vw,3rem);max-width:1400px;margin:0 auto;box-sizing:border-box;">

    <div style="display:grid;grid-template-columns:1fr;gap:2rem;" class="artwork-grid">
      <style>@media(min-width:768px){{.artwork-grid{{grid-template-columns:2fr 1fr;}}}}</style>

      <!-- Image -->
      <section style="border:1px solid #0B0B0B;overflow:hidden;">
        <div style="background:{dominant};overflow:hidden;">
          <img src="../thumbs/{w['file']}"
               srcset="../mini/{w['file']} 200w, ../thumbs/{w['file']} 400w"
               sizes="(max-width:767px) calc(100vw - 2rem), calc(66vw - 3rem)"
               alt="{html.escape(title)}"
               loading="eager"
               style="width:100%;height:auto;display:block;filter:grayscale(100%);transition:filter 0.6s ease;"
               onmouseover="this.style.filter='grayscale(0%)'"
               onmouseout="this.style.filter='grayscale(100%)'"/>
        </div>
        <div style="padding:10px 16px;display:flex;justify-content:space-between;align-items:center;border-top:1px solid #0B0B0B;background:#fcf9f3;">
          <span style="font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#575757;">Hover to reveal color</span>
          <a href="../full/{w['file']}" style="font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#575757;text-decoration:none;" target="_blank" rel="noopener">
            Full resolution <span class="msym" style="font-size:14px;">zoom_in</span>
          </a>
        </div>
      </section>

      <!-- Metadata -->
      <aside style="display:flex;flex-direction:column;gap:1rem;">
        <div style="padding-bottom:1rem;border-bottom:1px solid #0B0B0B;">
          <h1 style="font-family:'Playfair Display',serif;font-size:clamp(1.5rem,3vw,2.5rem);font-weight:600;line-height:1.15;margin:0 0 6px;">{html.escape(title)}</h1>
          <p style="font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#FF6600;margin:0;">Jeffrey F. S. Neumann</p>
        </div>

        <div style="display:flex;flex-direction:column;gap:12px;">
          {rows_html}
        </div>

        {f'<p style="font-size:15px;line-height:1.7;color:#575757;margin:0;">{html.escape(desc)}</p>' if desc else ''}

        <div style="display:flex;flex-direction:column;gap:10px;margin-top:8px;">
          <a href="../../companion.html" style="display:flex;align-items:center;justify-content:center;gap:8px;background:#0B0B0B;color:#fcf9f3;padding:14px;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;text-decoration:none;transition:background 0.15s;" onmouseover="this.style.background='#FF6600'" onmouseout="this.style.background='#0B0B0B'">
            Ask the Archive about this work <span class="msym" style="font-size:16px;">psychology</span>
          </a>
          <a href="../../archive.html" style="display:flex;align-items:center;justify-content:center;gap:8px;border:1px solid #0B0B0B;color:#0B0B0B;padding:14px;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;text-decoration:none;transition:all 0.15s;" onmouseover="this.style.color='#FF6600';this.style.borderColor='#FF6600'" onmouseout="this.style.color='#0B0B0B';this.style.borderColor='#0B0B0B'">
            Browse All Works <span class="msym" style="font-size:16px;">grid_view</span>
          </a>
        </div>
      </aside>
    </div>

    <!-- Prev/Next -->
    <nav aria-label="Adjacent works" style="border:1px solid #0B0B0B;display:grid;grid-template-columns:1fr 1fr;height:56px;">
      <div style="border-right:1px solid rgba(11,11,11,0.15);overflow:hidden;">
        {prev_html}
      </div>
      <div style="overflow:hidden;">
        {next_html}
      </div>
    </nav>

    <!-- Related works -->
    <section>
      <div style="display:flex;justify-content:space-between;align-items:flex-end;border-bottom:1px solid #0B0B0B;padding-bottom:8px;margin-bottom:20px;">
        <h2 style="font-family:'Playfair Display',serif;font-size:1.25rem;font-weight:600;margin:0;letter-spacing:-0.01em;">Related Works</h2>
        <a href="../../archive.html" style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#FF6600;text-decoration:none;">View All</a>
      </div>
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:1rem;">
        <style>@media(min-width:600px){{.related-grid{{grid-template-columns:repeat(4,1fr)!important;}}}}</style>
        <div class="related-grid" style="display:grid;grid-template-columns:repeat(2,1fr);gap:1rem;grid-column:1/-1;">
          {related_html}
        </div>
      </div>
    </section>

  </div>
</main>

<!-- Footer -->
<footer style="border-top:1px solid rgba(11,11,11,0.12);padding:clamp(2rem,4vw,3rem) clamp(1rem,4vw,3rem);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#575757;">
  <span>&copy; Jeffrey F. S. Neumann</span>
  <nav aria-label="Footer" style="display:flex;gap:1.5rem;">
    <a href="../../about.html"   style="color:inherit;text-decoration:none;">About</a>
    <a href="../../privacy.html" style="color:inherit;text-decoration:none;">Privacy</a>
    <a href="../../for-artists.html" style="color:#FF6600;text-decoration:none;">For Artists</a>
  </nav>
</footer>

</body>
</html>'''
    return page

# Generate all pages
print(f'Generating {len(catalog)} artwork pages...')
for i, w in enumerate(catalog):
    wid = w['file'].replace('.avif','')
    out_path = os.path.join(OUT_DIR, f'{wid}.html')
    page = generate(w, i)
    with open(out_path, 'w') as f:
        f.write(page)
    if (i+1) % 100 == 0 or i == len(catalog)-1:
        print(f'  {i+1}/{len(catalog)}')

print(f'\nDone. {len(catalog)} pages written to artworks/pages/')

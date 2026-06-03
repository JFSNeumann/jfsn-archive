#!/usr/bin/env python3
"""Generate static theme/series landing pages for SEO."""
import json, os, html

BASE = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(BASE, 'catalog.json')) as f:
    catalog = json.load(f)

# Build lookup: id -> work
work_by_id = {w['file'].replace('.avif','').replace('.jpg','').replace('.png',''): w for w in catalog}

GROUPS = [
    {
        'slug': 'guernica',
        'name': 'Guernica',
        'display_title': 'Guernica',
        'kind': 'series',
        'display_kind': 'Named Series',
        'description': (
            'The Guernica series spans five decades and 232 works — '
            'the longest-running named series in the archive. '
            'Named for Picasso\'s 1937 painting, it builds its own visual language: '
            'compact discs as warplane halos, target forms as compositional anchors, '
            'aerial geometry refracted through collage and assemblage. '
            'Conflict without declaration; formation without command. '
            'Cleveland artist Jeffrey F. S. Neumann has been extending this series since 1990.'
        ),
        'meta_description': (
            'Guernica — 232 works across five decades by Cleveland artist Jeffrey F. S. Neumann. '
            'Collage and assemblage built from compact discs, target forms, and aerial geometry. '
            'The longest-running named series in the archive.'
        ),
        'filter': lambda w: w.get('series') == 'Guernica',
        'breadcrumb_name': 'Guernica',
    },
    {
        'slug': 'targets',
        'name': 'Targets',
        'display_title': 'Targets',
        'kind': 'theme',
        'display_kind': 'Recurring Theme',
        'description': (
            'Concentric rings, bull\'s-eye forms, and range markers appear across 403 works '
            'as compositional anchors and loaded symbols. '
            'Precision without declared purpose. '
            'The target as both invitation and warning — '
            'a form that compels attention before meaning is assigned. '
            'Cleveland mixed-media artist Jeffrey F. S. Neumann has deployed this motif '
            'across collage, painting, and assemblage spanning five decades.'
        ),
        'meta_description': (
            'Targets — 403 works by Jeffrey F. S. Neumann, Cleveland. '
            'Concentric rings, bull\'s-eye forms, and range markers as compositional anchors '
            'across five decades of collage, painting, and assemblage.'
        ),
        'filter': lambda w: 'Targets' in (w.get('themes') or []),
        'breadcrumb_name': 'Targets',
    },
    {
        'slug': 'framed',
        'name': 'Framed',
        'display_title': 'Framed Pieces',
        'kind': 'theme',
        'display_kind': 'Recurring Theme',
        'description': (
            'Works conceived with framing as an integral compositional element — '
            'the frame not as neutral container but as collaborator. '
            'Edge and interior in negotiation; the boundary of the work as part of the work itself. '
            'Across 230 works, Cleveland artist Jeffrey F. S. Neumann treats the physical frame '
            'as a participant in the image rather than a finishing gesture.'
        ),
        'meta_description': (
            'Framed Pieces — 230 works by Jeffrey F. S. Neumann, Cleveland. '
            'Works where the frame is an integral compositional element, not a neutral container. '
            'Mixed-media collage and assemblage spanning five decades.'
        ),
        'filter': lambda w: 'Framed' in (w.get('themes') or []),
        'breadcrumb_name': 'Framed Pieces',
    },
    {
        'slug': 'torsos-faces',
        'name': 'Torsos & Faces',
        'display_title': 'Torsos & Faces',
        'kind': 'theme',
        'display_kind': 'Recurring Theme',
        'description': (
            'Photographic fragments of the human body — '
            'cropped, magnified, repositioned — '
            'set against grounds that compete with and complement the figure. '
            'Presence through reduction; the body as found material, '
            'as much subject as surface. '
            '172 works by Cleveland artist Jeffrey F. S. Neumann '
            'across collage, photography, and mixed-media spanning five decades.'
        ),
        'meta_description': (
            'Torsos & Faces — 172 works by Jeffrey F. S. Neumann, Cleveland. '
            'Photographic fragments of the human body, cropped and repositioned '
            'as found material in collage and mixed-media. Five decades of work.'
        ),
        'filter': lambda w: 'Torsos & Faces' in (w.get('themes') or []),
        'breadcrumb_name': 'Torsos & Faces',
    },
    {
        'slug': 'gallery-images',
        'name': 'Gallery',
        'display_title': 'Gallery Images',
        'kind': 'theme',
        'display_kind': 'Documentation',
        'description': (
            'Exhibition views and installation photographs from five decades of showing work. '
            'The archive of the archive: spaces, arrangements, and the accumulated evidence '
            'of a practice made public and encountered by other eyes. '
            '149 photographs documenting shows by Cleveland artist Jeffrey F. S. Neumann '
            'across gallery and museum spaces from the 1970s to the present.'
        ),
        'meta_description': (
            'Gallery Images — 149 exhibition and installation photographs by Jeffrey F. S. Neumann, Cleveland. '
            'Five decades of gallery documentation: spaces, arrangements, and the practice made public.'
        ),
        'filter': lambda w: 'Gallery' in (w.get('themes') or []),
        'breadcrumb_name': 'Gallery Images',
    },
    {
        'slug': 'mr-snowmann',
        'name': 'Mr. Snowmann',
        'display_title': 'Mr. SNOWmann',
        'kind': 'theme',
        'display_kind': 'Recurring Figure',
        'description': (
            'A recurring figure — part totem, part pop effigy — '
            'assembled from the residue of consumer culture. '
            'Across more than 72 works spanning five decades, '
            'the Snowmann shape-shifts and accumulates: '
            'a sustained riff on American iconography, assembly, and the act of making something from nothing. '
            'Cleveland artist Jeffrey F. S. Neumann\'s most iconic recurring motif.'
        ),
        'meta_description': (
            'Mr. SNOWmann — 72 works by Jeffrey F. S. Neumann, Cleveland. '
            'A recurring pop effigy assembled from consumer culture across five decades of collage and assemblage. '
            'American iconography, assembly, making something from nothing.'
        ),
        'filter': lambda w: 'Mr. Snowmann' in (w.get('themes') or []),
        'breadcrumb_name': 'Mr. SNOWmann',
    },
    {
        'slug': 'crosses',
        'name': 'Crosses',
        'display_title': 'Crosses',
        'kind': 'theme',
        'display_kind': 'Recurring Form',
        'description': (
            'The cross reduced to its geometry — '
            'symmetry, perpendicular meeting, four directions held in tension. '
            'Form that carries cultural weight before any specific reading is applied, '
            'returned to pure structure and asked to hold whatever the viewer brings. '
            '69 works across five decades by Cleveland artist Jeffrey F. S. Neumann '
            'in collage, painting, and mixed-media assemblage.'
        ),
        'meta_description': (
            'Crosses — 69 works by Jeffrey F. S. Neumann, Cleveland. '
            'The cross as geometric form and cultural weight, returned to pure structure '
            'across five decades of collage, painting, and mixed-media assemblage.'
        ),
        'filter': lambda w: 'Crosses' in (w.get('themes') or []),
        'breadcrumb_name': 'Crosses',
    },
    {
        'slug': 'collaboration',
        'name': 'Collaboration',
        'display_title': 'Collaboration',
        'kind': 'theme',
        'display_kind': 'Collaborative Work',
        'description': (
            'Works made in collaboration with other artists — '
            'shared process, dual authorship, two practices finding common ground. '
            '31 collaborative works by Cleveland artist Jeffrey F. S. Neumann, '
            'built with other makers across decades of practice. '
            'Mixed-media, collage, and assemblage where authorship is shared '
            'and the result belongs to the conversation between artists.'
        ),
        'meta_description': (
            'Collaboration — 31 collaborative works by Jeffrey F. S. Neumann, Cleveland. '
            'Shared process, dual authorship, two practices finding common ground '
            'in mixed-media, collage, and assemblage.'
        ),
        'filter': lambda w: 'Collaboration' in (w.get('themes') or []),
        'breadcrumb_name': 'Collaboration',
    },
]

NAV_HTML = '''\
<a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-deep-ink focus:text-bone-white focus:font-label-caps focus:text-label-caps">Skip to content</a>
<header class="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-desktop h-16 bg-background border-b border-deep-ink">
  <div class="flex items-center gap-8">
    <a href="index.html" class="font-headline-md text-headline-md tracking-tighter text-deep-ink">JFSN</a>
    <nav class="hidden md:flex gap-6" aria-label="Primary">
      <a class="font-nav-link text-nav-link text-deep-ink hover:text-international-orange transition-colors duration-200" href="archive.html">Archive</a>
      <a class="font-nav-link text-nav-link text-deep-ink hover:text-international-orange transition-colors duration-200" href="series-index.html">Series</a>
      <a class="font-nav-link text-nav-link text-deep-ink hover:text-international-orange transition-colors duration-200" href="timeline.html">Timeline</a>
      <a class="font-nav-link text-nav-link text-deep-ink hover:text-international-orange transition-colors duration-200" href="companion.html">Companion</a>
      <a class="font-nav-link text-nav-link text-deep-ink hover:text-international-orange transition-colors duration-200" href="about.html">About</a>
    </nav>
  </div>
  <div class="flex items-center gap-4">
    <button class="material-symbols-outlined text-deep-ink hover:text-international-orange transition-colors" aria-label="Search" id="nav-search-btn">search</button>
    <button class="md:hidden material-symbols-outlined text-deep-ink" aria-label="Open menu" id="nav-menu-btn">menu</button>
  </div>
</header>

<div id="mobile-menu" aria-hidden="true" style="display:none;position:fixed;inset:0;z-index:40;">
  <div id="mobile-menu-backdrop" style="position:absolute;inset:0;background:rgba(11,11,11,0.5);"></div>
  <nav id="mobile-menu-drawer" aria-label="Mobile menu"
    style="position:absolute;top:0;right:0;width:min(280px,85vw);height:100%;background:#fcf9f3;border-left:1px solid #0B0B0B;display:flex;flex-direction:column;transform:translateX(100%);transition:transform 0.25s ease;">
    <div style="display:flex;justify-content:space-between;align-items:center;padding:0 20px;height:64px;border-bottom:1px solid #0B0B0B;">
      <span style="font-family:\'Playfair Display\',serif;font-size:18px;font-weight:600;letter-spacing:-0.02em;color:#0B0B0B;">JFSN</span>
      <button id="nav-menu-close" aria-label="Close menu"
        style="background:none;border:none;cursor:pointer;color:#0B0B0B;font-size:24px;padding:8px;margin-right:-8px;line-height:1;">&times;</button>
    </div>
    <div style="flex:1;overflow-y:auto;padding:8px 0;">
      <a href="archive.html"      style="display:block;padding:16px 24px;font-family:Inter,sans-serif;font-size:13px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:#0B0B0B;text-decoration:none;border-bottom:1px solid #c4c7c7;">Archive</a>
      <a href="series-index.html" style="display:block;padding:16px 24px;font-family:Inter,sans-serif;font-size:13px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:#0B0B0B;text-decoration:none;border-bottom:1px solid #c4c7c7;">Series</a>
      <a href="timeline.html"     style="display:block;padding:16px 24px;font-family:Inter,sans-serif;font-size:13px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:#0B0B0B;text-decoration:none;border-bottom:1px solid #c4c7c7;">Timeline</a>
      <a href="companion.html"    style="display:block;padding:16px 24px;font-family:Inter,sans-serif;font-size:13px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:#0B0B0B;text-decoration:none;border-bottom:1px solid #c4c7c7;">Companion</a>
      <a href="about.html"        style="display:block;padding:16px 24px;font-family:Inter,sans-serif;font-size:13px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:#0B0B0B;text-decoration:none;border-bottom:1px solid #c4c7c7;">About</a>
      <a href="for-artists.html"  style="display:block;padding:16px 24px;font-family:Inter,sans-serif;font-size:13px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:#FF6600;text-decoration:none;">For Artists</a>
    </div>
    <div style="padding:16px 24px;border-top:1px solid #c4c7c7;">
      <button id="mobile-menu-search"
        style="width:100%;display:flex;align-items:center;gap:10px;background:none;border:1px solid #c4c7c7;padding:10px 14px;cursor:pointer;color:#575757;font-family:Inter,sans-serif;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;">
        <span class="material-symbols-outlined" style="font-size:16px;">search</span>
        Search archive
      </button>
    </div>
  </nav>
</div>

<script>
(function(){
  var menu=document.getElementById('mobile-menu'),drawer=document.getElementById('mobile-menu-drawer'),
      openBtn=document.getElementById('nav-menu-btn'),closeBtn=document.getElementById('nav-menu-close'),
      backdrop=document.getElementById('mobile-menu-backdrop'),menuSearchBtn=document.getElementById('mobile-menu-search');
  function openMenu(){menu.style.display='block';menu.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';requestAnimationFrame(function(){drawer.style.transform='translateX(0)';});closeBtn.focus();}
  function closeMenu(){drawer.style.transform='translateX(100%)';document.body.style.overflow='';setTimeout(function(){menu.style.display='none';menu.setAttribute('aria-hidden','true');},260);openBtn.focus();}
  if(openBtn)openBtn.addEventListener('click',openMenu);
  if(closeBtn)closeBtn.addEventListener('click',closeMenu);
  if(backdrop)backdrop.addEventListener('click',closeMenu);
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&menu.style.display==='block')closeMenu();});
  if(menuSearchBtn)menuSearchBtn.addEventListener('click',function(){closeMenu();setTimeout(function(){if(window.openSiteSearch)window.openSiteSearch();},280);});
})();
</script>
<script src="search.js" defer></script>'''


def build_figure(w, idx):
    wid = w['file'].replace('.avif','')
    title = html.escape(w.get('title','Untitled'))
    year = w.get('year','')
    color = w.get('dominant_color','') or '#ebe8e2'
    orient = w.get('orientation','portrait')
    # width/height hint for CLS
    if orient == 'landscape':
        wh = 'width="400" height="267"'
    elif orient == 'square':
        wh = 'width="400" height="400"'
    else:
        wh = 'width="400" height="600"'
    loading = 'eager' if idx < 8 else 'lazy'
    return (
        f'<figure class="thumb">'
        f'<a class="thumb__link" href="artwork.html?id={wid}" style="background-color:{color};">'
        f'<img srcset="artworks/mini/{w["file"]} 200w, artworks/thumbs/{w["file"]} 400w" '
        f'sizes="(max-width:600px) calc(50vw - 1rem),(max-width:1024px) calc(33vw - 1rem),calc(25vw - 1rem)" '
        f'src="artworks/thumbs/{w["file"]}" alt="{title}" loading="{loading}" {wh}>'
        f'<figcaption class="thumb__caption"><a href="artwork.html?id={wid}">{title}</a>'
        f'<span>{year}</span></figcaption></a></figure>'
    )


def year_range(works):
    years = [w['year'] for w in works if w.get('year')]
    if not years:
        return ''
    mn, mx = min(years), max(years)
    if mn == mx:
        return str(mn)
    return f'{mn}–{mx}'


def generate_page(g):
    works = [w for w in catalog if g['filter'](w)]
    works.sort(key=lambda w: (w.get('year') or 0, w.get('file','')))
    count = len(works)
    yr = year_range(works)
    slug = g['slug']
    display_title = g['display_title']
    name = g['name']
    desc = g['description']
    meta_desc = g['meta_description']
    kind_label = g['display_kind']
    canonical = f'https://jfsn.com/{slug}.html'

    json_ld = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": f"{display_title} — Jeffrey F. S. Neumann Archive",
        "description": meta_desc,
        "url": canonical,
        "creator": {
            "@type": "Person",
            "name": "Jeffrey F. S. Neumann",
            "url": "https://jfsn.com"
        },
        "about": {
            "@type": "Collection",
            "name": f"{display_title} — Archive of Jeffrey F. S. Neumann",
            "numberOfItems": count
        },
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type":"ListItem","position":1,"name":"Archive","item":"https://jfsn.com/archive.html"},
                {"@type":"ListItem","position":2,"name":"Series & Themes","item":"https://jfsn.com/series-index.html"},
                {"@type":"ListItem","position":3,"name":g['breadcrumb_name'],"item":canonical}
            ]
        }
    }

    figures = '\n    '.join(build_figure(w, i) for i, w in enumerate(works))

    yr_display = yr if yr else 'present'
    meta_count = f'{count} works &middot; {yr_display}'

    page = f'''<!DOCTYPE html>
<html class="light" lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{html.escape(display_title)} — Jeffrey F. S. Neumann</title>
  <meta name="description" content="{html.escape(meta_desc)}">
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="alternate" type="application/rss+xml" title="Jeffrey F. S. Neumann — Archive" href="https://jfsn.com/feed.xml">
  <link rel="canonical" href="{canonical}">
  <link rel="manifest" href="manifest.json">
  <link rel="apple-touch-icon" href="icon-192.png">
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&family=Inter:wght@400;500;600&display=swap" rel="stylesheet"/>
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
  <link rel="stylesheet" href="_shared/ui.css">
  <link rel="stylesheet" href="site.min.css"/>
  <meta name="theme-color" content="#fcf9f3"/>
  <meta property="og:type"        content="website">
  <meta property="og:title"       content="{html.escape(display_title)} by Jeffrey F. S. Neumann">
  <meta property="og:description" content="{html.escape(meta_desc)}">
  <meta property="og:image"       content="https://jfsn.com/og-card.jpg">
  <meta property="og:url"         content="{canonical}">
  <script type="application/ld+json">
  {json.dumps(json_ld, ensure_ascii=False, indent=2)}
  </script>
  <style>
    .material-symbols-outlined{{font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24;}}
    @media(prefers-reduced-motion:reduce){{*,*::before,*::after{{transition:none!important;animation:none!important;}}}}
    .medium-page {{
      padding-top: clamp(3rem, 6vw, 6rem);
      padding-bottom: clamp(4rem, 10vw, 10rem);
    }}
    .medium-page__head {{
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 1rem;
      flex-wrap: wrap;
      padding-bottom: clamp(1.5rem, 3vw, 2.5rem);
      border-bottom: 1px solid rgba(11,11,11,0.12);
      margin-bottom: clamp(1.5rem, 3vw, 2.5rem);
    }}
    .medium-page__title {{
      font-family: 'Playfair Display', Georgia, serif;
      font-size: clamp(2.5rem, 5.5vw, 4.5rem);
      font-weight: 300;
      letter-spacing: -0.01em;
      line-height: 1.1;
      margin: 0;
    }}
    .medium-page__meta {{
      font-size: 0.75rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #575757;
      margin: 0;
      padding-bottom: 0.25rem;
    }}
    .medium-page__kind {{
      display: inline-block;
      font-size: 0.68rem;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: #FF6600;
      border: 1px solid #FF6600;
      padding: 2px 8px;
      margin-bottom: 0.75rem;
    }}
    .medium-page__intro {{
      max-width: 52ch;
      line-height: 1.7;
      color: #575757;
      margin-bottom: clamp(2rem, 4vw, 3.5rem);
    }}
    .medium-page__intro a {{
      color: #0B0B0B;
      border-bottom: 1px solid rgba(11,11,11,0.12);
      transition: color 0.15s, border-color 0.15s;
    }}
    .medium-page__intro a:hover {{
      color: #FF6600;
      border-color: #FF6600;
    }}
    .medium-grid {{
      column-count: 4;
      column-gap: 0.75rem;
    }}
    @media (max-width: 1024px) {{ .medium-grid {{ column-count: 3; }} }}
    @media (max-width: 600px)  {{ .medium-grid {{ column-count: 2; }} }}
    .thumb {{
      break-inside: avoid;
      margin: 0 0 0.75rem;
    }}
    .thumb__link {{
      display: block;
      overflow: hidden;
      border-radius: 2px;
      background: #ebe8e2;
      text-decoration: none;
    }}
    .thumb__link img {{
      display: block;
      width: 100%;
      height: auto;
      transition: transform 0.35s ease;
    }}
    .thumb__link:hover img {{ transform: scale(1.05); }}
    .thumb__caption {{
      padding: 0.35rem 0 0;
      font-size: 0.75rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #575757;
      line-height: 1.35;
    }}
    .thumb__caption a {{ color: inherit; text-decoration: none; }}
    .thumb__caption a:hover {{ color: #0B0B0B; }}
    .thumb__caption span {{ display: block; }}
    @media (prefers-reduced-motion: reduce) {{
      .thumb__link img {{ transition: none; }}
      .thumb__link:hover img {{ transform: none; }}
    }}
  </style>
</head>
<body class="bg-background text-deep-ink overflow-x-hidden">

<!-- NAV:START -->
{NAV_HTML}
<!-- NAV:END -->

<main id="main" class="pt-16">
  <div class="container medium-page">

    <nav aria-label="Breadcrumb" style="margin-bottom:1.5rem;">
      <ol style="list-style:none;padding:0;margin:0;display:flex;gap:0.5rem;align-items:center;font-size:0.75rem;letter-spacing:0.1em;text-transform:uppercase;color:#575757;">
        <li><a href="series-index.html" style="color:#575757;text-decoration:none;border-bottom:1px solid rgba(11,11,11,0.12);">Series &amp; Themes</a></li>
        <li aria-hidden="true" style="opacity:0.4;">/</li>
        <li aria-current="page" style="color:#0B0B0B;">{html.escape(display_title)}</li>
      </ol>
    </nav>

    <div class="medium-page__head">
      <div>
        <div class="medium-page__kind">{html.escape(kind_label)}</div>
        <h1 class="medium-page__title">{html.escape(display_title)}</h1>
      </div>
      <p class="medium-page__meta">{meta_count}</p>
    </div>

    <p class="medium-page__intro">
      {html.escape(desc)}
      <a href="series-index.html">All series &amp; themes &rarr;</a>
    </p>

    <div class="medium-grid" id="grid">
    {figures}
    </div>

  </div>
</main>

<!-- FOOTER:START -->
<footer style="border-top:1px solid rgba(11,11,11,0.12);padding:clamp(2rem,4vw,3rem) clamp(1rem,4vw,3rem);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;font-size:0.75rem;letter-spacing:0.1em;text-transform:uppercase;color:#575757;">
  <span>&copy; Jeffrey F. S. Neumann</span>
  <nav aria-label="Footer">
    <a href="about.html"     style="color:inherit;text-decoration:none;margin-right:1.5rem;">About</a>
    <a href="privacy.html"   style="color:inherit;text-decoration:none;margin-right:1.5rem;">Privacy</a>
    <a href="for-artists.html" style="color:#FF6600;text-decoration:none;">For Artists</a>
  </nav>
</footer>
<!-- FOOTER:END -->

</body>
</html>'''
    return page, count


generated = []
for g in GROUPS:
    page_html, count = generate_page(g)
    out_path = os.path.join(BASE, f'{g["slug"]}.html')
    with open(out_path, 'w') as f:
        f.write(page_html)
    generated.append((g['slug'], g['display_title'], count))
    print(f'  wrote {g["slug"]}.html ({count} works)')

print(f'\nGenerated {len(generated)} pages.')
print('Slugs:', [s for s,_,_ in generated])

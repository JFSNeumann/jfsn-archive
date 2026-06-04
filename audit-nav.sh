#!/usr/bin/env bash
# audit-nav.sh — check all public pages for nav/footer consistency
cd "$(dirname "$0")"

python3 << 'PYEOF'
import re, glob

files = [f for f in glob.glob('*.html') if not any(x in f for x in ['old-site','curate','jeff.html','qa.html','dedupe'])]
files.sort()

issues_found = False
for fname in files:
    with open(fname) as f:
        content = f.read()

    issues = []

    # Mobile nav check
    mob_nav_m = re.search(r'(aria-label="Mobile navigation".*?</nav>)', content, re.DOTALL)
    if mob_nav_m:
        mob = mob_nav_m.group()
        links = re.findall(r'<a href="([^"]+)"', mob)
        if len(links) < 5:
            issues.append(f'mobile nav: {len(links)} items (need 5)')
        first = re.search(r'<a href="([^"]+)".*?(?=<a )', mob, re.DOTALL)
        if first:
            if 'index.html' not in first.group(): issues.append('first nav item not Home')
            if 'home' not in first.group():       issues.append('first nav item missing home icon')
            if 'inventory_2' in first.group():    issues.append('first nav item has wrong icon (inventory_2)')
    elif fname not in ['api.html']:
        issues.append('no mobile nav')

    # Footer check
    footer_m = re.search(r'FOOTER:START.*?FOOTER:END', content, re.DOTALL)
    if footer_m:
        ft = footer_m.group()
        if 'wall.html'          not in ft: issues.append('footer missing wall.html')
        if 'constellation.html' not in ft: issues.append('footer missing constellation.html')
    elif fname not in ['index.html']:
        issues.append('no FOOTER:START')

    # Link check — local HTML files (skip JS template literals like ${dec.key}.html)
    hrefs = re.findall(r'href="([^"#?${}]+\.html)"', content)
    import os
    for href in set(hrefs):
        if not href.startswith('http') and not os.path.exists(href):
            issues.append(f'broken link: {href}')

    # SEO checks (skip known false positives)
    # artwork.html sets <title> via JS; 404.html needs no canonical or JSON-LD
    if fname not in ['artwork.html']:
        if not re.search(r'<title>', content):                issues.append('missing <title>')
    if fname not in ['404.html']:
        if not re.search(r'<link rel="canonical"', content):  issues.append('missing canonical')
        if not re.search(r'application/ld\+json', content):   issues.append('missing JSON-LD')
    if not re.search(r'<meta name="description"', content):   issues.append('missing meta description')
    if not re.search(r'og:title', content):                   issues.append('missing og:title')
    if not re.search(r'og:image', content):                   issues.append('missing og:image')

    # Assets
    if 'cdn.tailwindcss' in content:                          issues.append('Tailwind CDN in use (should be site.min.css)')
    if 'search.js' not in content:                            issues.append('missing search.js')
    if 'nav-active.js' not in content:                        issues.append('missing nav-active.js')

    # Accessibility
    if not re.search(r'lang="en"', content):                  issues.append('missing lang=en')
    if not re.search(r'[Ss]kip.*content', content):           issues.append('missing skip-to-content')

    if issues:
        issues_found = True
        print(f'\n{fname}:')
        for i in issues:
            print(f'  ⚠  {i}')

if not issues_found:
    print('✅  All clear — no nav/footer/link issues found.')
PYEOF


# ── Sitemap validator ─────────────────────────────────────────────────────────
python3 << 'PYEOF'
import re, os

with open('sitemap.xml') as f:
    content = f.read()

urls = re.findall(r'<loc>https://jfsn\.com/([^<]+)</loc>', content)

missing = []
for url in urls:
    # Strip query strings for file check
    path = url.split('?')[0]
    if path and not os.path.exists(path):
        missing.append(url)

if missing:
    print(f'\nsitemap.xml — {len(missing)} URL(s) point to missing files:')
    for u in missing[:20]:
        print(f'  ⚠  {u}')
    if len(missing) > 20:
        print(f'  ... and {len(missing)-20} more')
else:
    print('✅  Sitemap: all URLs resolve to real files.')
PYEOF


# ── Alt text audit ────────────────────────────────────────────────────────────
python3 << 'PYEOF'
import re, glob

files = [f for f in glob.glob('*.html') if not any(x in f for x in ['old-site','curate','jeff.html','qa.html','dedupe'])]
files.sort()

issues_found = False
for fname in files:
    with open(fname) as f:
        content = f.read()

    # Find img tags missing alt entirely (not just empty alt, which is valid for decorative)
    imgs = re.findall(r'<img(?![^>]*\balt\s*=)[^>]*>', content)
    # Filter out template/JS-generated tags
    real = [i for i in imgs if '${' not in i and 'artworks/' not in i]
    if real:
        issues_found = True
        print(f'\n{fname}: {len(real)} <img> tag(s) missing alt attribute')
        for img in real[:3]:
            print(f'  ⚠  {img[:120]}')

if not issues_found:
    print('✅  Alt text: all <img> tags have alt attributes.')
PYEOF


# ── Thumbnail integrity ───────────────────────────────────────────────────────
python3 << 'PYEOF'
import json, os

with open('catalog.json') as f:
    catalog = json.load(f)

missing_thumb = []
missing_mini  = []

for w in catalog:
    fname = w['file']  # e.g. art0001.avif
    stem  = fname.replace('.avif', '')
    if not os.path.exists(f'artworks/thumbs/{fname}'):
        missing_thumb.append(stem)
    if not os.path.exists(f'artworks/mini/{fname}'):
        missing_mini.append(stem)

if missing_thumb:
    print(f'\nThumbnails: {len(missing_thumb)} missing in artworks/thumbs/')
    for s in missing_thumb[:5]: print(f'  ⚠  {s}')
    if len(missing_thumb) > 5: print(f'  ... and {len(missing_thumb)-5} more')
else:
    print('✅  Thumbnails: all 1,084 present in artworks/thumbs/')

if missing_mini:
    print(f'\nMinis: {len(missing_mini)} missing in artworks/mini/')
    for s in missing_mini[:5]: print(f'  ⚠  {s}')
    if len(missing_mini) > 5: print(f'  ... and {len(missing_mini)-5} more')
else:
    print('✅  Minis: all 1,084 present in artworks/mini/')
PYEOF

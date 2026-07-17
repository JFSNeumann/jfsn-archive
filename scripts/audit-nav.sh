#!/usr/bin/env bash
# audit-nav.sh — check all public pages for nav/footer consistency
cd "$(git rev-parse --show-toplevel)"

python3 << 'PYEOF'
import re, glob

files = [f for f in glob.glob('*.html') if not any(x in f for x in ['old-site','curate.html','curator.html','jeff.html','qa.html','dedupe'])]
files.sort()

issues_found = False
for fname in files:
    with open(fname) as f:
        content = f.read()

    issues = []

    # Footer check (Phase 1-2 simplified footer: privacy, github, copyright, back-to-top)
    footer_m = re.search(r'FOOTER:START.*?FOOTER:END', content, re.DOTALL)
    if footer_m:
        ft = footer_m.group()
        if 'privacy.html'       not in ft: issues.append('footer missing privacy.html')
        if 'github.com'         not in ft: issues.append('footer missing github link')
    elif fname not in ['index.html']:
        issues.append('no FOOTER:START')

    # Link check — local HTML files (skip JS template literals like ${dec.key}.html)
    hrefs = re.findall(r'href="([^"#?${}]+\.html)"', content)
    import os
    for href in set(hrefs):
        if not href.startswith('http') and not os.path.exists(href.lstrip('/')):
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
    if 'search.js' not in content and 'nav-early.bundle.js' not in content:  issues.append('missing search.js (or nav-early.bundle.js)')
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

files = [f for f in glob.glob('*.html') if not any(x in f for x in ['old-site','curate.html','curator.html','jeff.html','qa.html','dedupe'])]
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

with open('config/catalog.json') as f:
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


# ── sw.js freshness check ─────────────────────────────────────────────────────
python3 << 'PYEOF'
import re
from datetime import datetime, timezone

with open('sw.js') as f:
    content = f.read()

m = re.search(r"CACHE_V\s*=\s*'jfsn-(\d+)'", content)
if not m:
    print('⚠  sw.js: could not parse CACHE_V')
else:
    digits = m.group(1)
    stamp = None
    if len(digits) == 14:
        # early-session format: jfsn-YYYYMMDDHHMMSS
        try:
            stamp = datetime.strptime(digits, '%Y%m%d%H%M%S').replace(tzinfo=timezone.utc)
        except ValueError:
            stamp = None
    if stamp is None:
        # current format (since ~session 75): jfsn-<unix-epoch-seconds>
        try:
            stamp = datetime.fromtimestamp(int(digits), tz=timezone.utc)
        except (ValueError, OverflowError):
            stamp = None
    if stamp is None:
        print('⚠  sw.js: could not parse CACHE_V')
    else:
        age_days = (datetime.now(timezone.utc) - stamp).days
        if age_days > 7:
            print(f'⚠  sw.js: CACHE_V is {age_days} days old — consider bumping before deploy')
        else:
            print(f'✅  sw.js: CACHE_V is current ({age_days}d old)')
PYEOF


# ── Page weight check ─────────────────────────────────────────────────────────
python3 << 'PYEOF'
import re, glob

STYLE_WARN_BYTES = 33000  # warn if inline <style> block exceeds 33KB
CDN_PATTERNS = ['cdn.tailwindcss', 'unpkg.com']
CDN_EXCEPTIONS = {}

files = [f for f in glob.glob('*.html') if not any(x in f for x in ['old-site','curate.html','curator.html','jeff.html','qa.html','dedupe'])]
files.sort()

issues_found = False
for fname in files:
    with open(fname) as f:
        content = f.read()
    issues = []

    # Inline style block size
    styles = re.findall(r'<style[^>]*>(.*?)</style>', content, re.DOTALL)
    total = sum(len(s) for s in styles)
    if total > STYLE_WARN_BYTES:
        issues.append(f'{total//1024}KB inline <style> (>{STYLE_WARN_BYTES//1024}KB threshold)')

    # CDN scripts that shouldn't be in production
    exceptions = CDN_EXCEPTIONS.get(fname, [])
    for cdn in CDN_PATTERNS:
        if cdn in content and cdn not in exceptions:
            issues.append(f'CDN reference found: {cdn}')

    if issues:
        issues_found = True
        print(f'\n{fname}:')
        for i in issues: print(f'  ⚠  {i}')

if not issues_found:
    print('✅  Page weight: no oversized inline styles or CDN references.')
PYEOF


# ── Catalog integrity ─────────────────────────────────────────────────────────
python3 << 'PYEOF'
import json

try:
    with open('config/catalog.json') as f:
        catalog = json.load(f)
except json.JSONDecodeError as e:
    print(f'❌  catalog.json: invalid JSON — {e}')
    exit()

REQUIRED = ['file', 'title', 'year', 'work_type']
issues = []
seen_ids = {}

for w in catalog:
    stem = w.get('file', '').replace('.avif', '')
    # Duplicate check
    if stem in seen_ids:
        issues.append(f'Duplicate ID: {stem}')
    seen_ids[stem] = True
    # Required fields
    for field in REQUIRED:
        if not w.get(field):
            issues.append(f'{stem}: missing {field}')

if issues:
    print(f'\ncatalog.json — {len(issues)} issue(s):')
    for i in issues[:10]: print(f'  ⚠  {i}')
    if len(issues) > 10: print(f'  ... and {len(issues)-10} more')
else:
    print(f'✅  Catalog: {len(catalog)} works, no duplicates, all required fields present.')
PYEOF


# ── JSON-LD validity ──────────────────────────────────────────────────────────
python3 << 'PYEOF'
import re, json, glob

files = [f for f in glob.glob('*.html') if not any(x in f for x in ['old-site','curate','jeff.html','qa.html','dedupe','404'])]
files.sort()

issues_found = False
for fname in files:
    with open(fname) as f:
        content = f.read()
    blocks = re.findall(r'<script type="application/ld\+json">(.*?)</script>', content, re.DOTALL)
    for block in blocks:
        try:
            json.loads(block)
        except json.JSONDecodeError as e:
            issues_found = True
            print(f'\n{fname}: invalid JSON-LD — {e}')

if not issues_found:
    print('✅  JSON-LD: all structured data blocks are valid JSON.')
PYEOF


# ── OG image check ────────────────────────────────────────────────────────────
python3 << 'PYEOF'
import re, glob, os

files = [f for f in glob.glob('*.html') if not any(x in f for x in ['old-site','curate.html','curator.html','jeff.html','qa.html','dedupe'])]

issues_found = False
for fname in files:
    with open(fname) as f:
        content = f.read()
    m = re.search(r'og:image.*?content="https://jfsn\.com/([^"]+)"', content)
    if m:
        path = m.group(1)
        if not os.path.exists(path):
            issues_found = True
            print(f'\n{fname}: og:image points to missing file: {path}')

if not issues_found:
    print('✅  OG images: all og:image files exist.')
PYEOF


# ── Reverse sitemap check — public pages that are NOT in sitemap ──────────────
# This catches new pages added to the project that were never added to the
# sitemap list in build_catalog.py. Run this after adding any new .html file.
python3 << 'PYEOF'
import re, glob

# Pages intentionally excluded from sitemap:
#   artwork.html   — dynamic (?id=), covered by artworks/pages/*.html
#   series.html    — dynamic (?theme= / ?series=), covered by those param URLs
#   404.html       — error page, not indexable
#   qa.html        — dev tool (noindex, deploy-excluded)
#   curator.html   — back-of-house curator index (noindex, deliberately unlinked)
#   (curate.html / dedupe.html / jeff.html — deleted, dropped from this list 2026-07-03)
EXCLUDED = {
    'artwork.html', 'series.html', '404.html',
    'qa.html', 'curator.html',
}

with open('sitemap.xml') as f:
    sitemap = f.read()

# Extract bare page names from sitemap (strip query strings, strip leading /)
sitemap_pages = set()
for loc in re.findall(r'<loc>https://jfsn\.com/([^<]+)</loc>', sitemap):
    bare = loc.split('?')[0]
    sitemap_pages.add(bare)
# index.html lives at / in the sitemap
sitemap_pages.add('index.html')

public_html = sorted(
    f for f in glob.glob('*.html')
    if f not in EXCLUDED
)

missing = [f for f in public_html if f not in sitemap_pages]

if missing:
    print(f'\n⚠  {len(missing)} public page(s) not in sitemap.xml — add to build_catalog.py:')
    for f in missing:
        print(f'  ⚠  {f}')
else:
    print('✅  Sitemap coverage: all public pages are in sitemap.xml.')
PYEOF

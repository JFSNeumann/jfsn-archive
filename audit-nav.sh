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

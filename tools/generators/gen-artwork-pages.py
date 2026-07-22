#!/usr/bin/env python3
"""
gen-artwork-pages.py — regenerate all static artwork pages.

Each page in artworks/pages/ is a fully baked SEO page for Googlebot.
Reads catalog.json + colors.json; writes artworks/pages/artNNNN.html.

Usage:
    python3 gen-artwork-pages.py              # all pages
    python3 gen-artwork-pages.py --limit 5    # test run
    python3 gen-artwork-pages.py --id art0001 # single page
"""

import argparse
import html
import json
import sys
import urllib.parse
from pathlib import Path

ROOT     = Path(__file__).resolve().parents[2]
CATALOG  = ROOT / 'config' / 'catalog.json'
COLORS   = ROOT / 'config' / 'colors.json'
OUT_DIR  = ROOT / 'artworks' / 'pages'
SITE_URL = 'https://jfsn.com'

# Themes that have a dedicated page; others render as plain text
THEME_PAGES = {
    'Guernica':       '../../guernica.html',
    'Targets':        '../../targets.html',
    'Framed':         '../../framed.html',
    'Torsos & Faces': '../../torsos-faces.html',
    'Gallery':        '../../gallery-images.html',
    'Mr. Snowmann':   '../../mr-snowmann.html',
    'Crosses':        '../../crosses.html',
    'Collaboration':  '../../collaboration.html',
}

MEDIUM_LABELS = {
    'collage':    'Collage',
    'photograph': 'Photography',
    'sculpture':  'Sculpture',
    'painting':   'Painting',
}

# ── Verified creator testimony ────────────────────────────────────────────────
# Primary-source oral-history testimony tied to a specific work, kept here as an
# explicit per-work record rather than a catalog-schema field: testimony is
# primary source, not descriptive metadata, and this is a single, securely
# attributed pilot (oral history master-notes §29, 2026-07-18), not a system.
# The dynamic artwork.html carries the same entry for art0518; this keeps the
# durable static page in parity (readable with JavaScript disabled).
# Add entries only with secure, unhedged attribution. Verbatim — the "=)" and
# the slash are Jeff's own typed register and must not be normalized.
CREATOR_VOICE = {
    'art0518': {
        'voice':   'desperate=)',
        'context': 'not selling anything / trying to',
        'attr':    'Jeffrey F. S. Neumann, 2026',
    },
}

# Orientation is derived from image proportions (dims.json) — a stand-in for
# physical dimensions until those are measured. Links to the archive filter.
ORIENT_LABELS = {
    'vertical':   'Vertical',
    'horizontal': 'Horizontal',
    'square':     'Square',
}


def e(s):
    return html.escape(str(s or ''), quote=True)


def theme_link(theme):
    # Dedicated deep-dive page if one exists; otherwise the generic theme view.
    page = THEME_PAGES.get(theme)
    if not page:
        page = '../../series.html?theme=' + urllib.parse.quote(theme, safe='')
    # Map theme names to color scheme slugs
    theme_slug = theme.lower().replace(' ', '-').replace('&', '')
    return (f'<a href="{page}" '
            f'data-theme-tag="{theme_slug}" '
            f'class="theme-tag hover:text-international-orange transition-colors underline underline-offset-2">'
            f'{e(theme)}</a>')


def meta_row(label, value_html):
    return (
        f'<div class="grid grid-cols-3 gap-xs items-baseline border-b border-deep-ink py-sm">'
        f'<span class="font-label-md text-label-md text-secondary uppercase">{label}</span>'
        f'<span class="col-span-2 font-body-md text-body-md">{value_html}</span>'
        f'</div>'
    )


def generate_page(work, idx, all_works, colors):
    art_id  = work['file'].replace('.avif', '')
    title   = work.get('title') or 'Untitled'
    year    = work.get('year')
    # Years are decade-bucket estimates — show "1990s (est.)", not a hard year.
    year_disp = work.get('year_display') or (str(year) if year else None)
    composite = work.get('composite')
    wtype   = work.get('work_type') or ''
    medium  = MEDIUM_LABELS.get(wtype, wtype.title() if wtype else '')
    desc    = work.get('description') or ''
    palette = work.get('palette') or []
    motifs  = work.get('motifs') or []
    themes  = work.get('themes') or []
    series  = work.get('series')
    comp    = work.get('composition') or ''
    bgcolor = colors.get(art_id, '#ebe8e2')
    has_back = bool(work.get('has_back'))
    # Image paths are always derived from art_id, not the raw 'file' field —
    # some records (e.g. art1085/art1086) store 'file' without the .avif
    # extension, which would otherwise break the <img src>.
    front_img = f'{art_id}.avif'
    back_img  = f'{art_id}_back.avif'

    # Prev / next (by catalog order)
    prev_work  = all_works[idx - 1] if idx > 0 else None
    next_work  = all_works[idx + 1] if idx < len(all_works) - 1 else None
    prev_id    = prev_work['file'].replace('.avif', '') if prev_work else None
    next_id    = next_work['file'].replace('.avif', '') if next_work else None
    prev_title = e(prev_work.get('title') or '') if prev_work else ''
    next_title = e(next_work.get('title') or '') if next_work else ''

    # SEO description (first 155 chars of description, else fallback)
    if desc:
        raw_seo = (desc[:152] + '…') if len(desc) > 155 else desc
        seo_desc = e(raw_seo)
    else:
        seo_desc = e(f"{title}{', ' + year_disp if year_disp else ''} — {medium} by Jeffrey F. S. Neumann.")

    # JSON-LD
    ld: dict = {
        "@context": "https://schema.org",
        "@type": "VisualArtwork",
        "name": title,
        "url": f"{SITE_URL}/artworks/pages/{art_id}.html",
        "image": f"{SITE_URL}/artworks/thumbs/{front_img}",
        "creator": {
            "@type": "Person",
            "name": "Jeffrey F. S. Neumann",
            "url": f"{SITE_URL}/about.html",
            "jobTitle": "Artist",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Cleveland",
                "addressRegion": "OH"
            }
        },
        "isPartOf": {
            "@type": "CollectionPage",
            "name": "The Archive — Jeffrey F. S. Neumann",
            "url": f"{SITE_URL}/archive.html"
        },
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1,
                 "name": "Archive", "item": f"{SITE_URL}/archive.html"},
                {"@type": "ListItem", "position": 2,
                 "name": title,
                 "item": f"{SITE_URL}/artworks/pages/{art_id}.html"}
            ]
        }
    }
    if year:
        ld["dateCreated"] = str(year)
    if desc:
        ld["description"] = desc
    if medium:
        ld["artMedium"] = medium

    # Meta rows
    rows = meta_row('Year', e(year_disp) if year_disp else '—')
    rows += meta_row('Medium', e(medium))
    if composite:
        rows += meta_row(
            'Image',
            '<span class="italic text-archive-gray">Photoshop composite — imagined placement</span>'
        )
    orientation = work.get('orientation')
    if orientation in ORIENT_LABELS:
        rows += meta_row(
            'Orientation',
            f'<a href="../../archive.html?orientation={orientation}" '
            f'class="hover:text-international-orange transition-colors underline underline-offset-2">'
            f'{ORIENT_LABELS[orientation]}</a>'
        )
    if series:
        series_href = '../../guernica.html' if series == 'Guernica' else (
            f'../../series.html?series={html.escape(series, quote=True)}')
        rows += meta_row(
            'Series',
            f'<a href="{series_href}" '
            f'class="underline underline-offset-2 hover:text-international-orange">'
            f'{e(series)}</a>'
        )
    if themes:
        rows += meta_row('Themes', ', '.join(theme_link(t) for t in themes))
    if motifs:
        rows += meta_row('Motifs', e(', '.join(motifs)))
    if palette:
        rows += meta_row('Palette', e(', '.join(palette)))
    if comp:
        rows += meta_row('Composition', e(comp))
    rows += meta_row('Archive No.', f"<span class=\"cursor-pointer hover:text-international-orange transition-colors\" onclick=\"navigator.clipboard.writeText('{art_id.upper()}').then(()=>window.showToast('Copied: {art_id.upper()}!'))\" title=\"Click to copy\">{art_id.upper()}</span>")

    # Prev / next strip
    if prev_id:
        prev_html = (
            f'<a href="{prev_id}.html" data-direction="prev" '
            f'class="adjacent-nav-btn group flex items-center px-margin-mobile md:px-md h-full overflow-hidden relative">'
            f'<img src="../../artworks/thumbs/{prev_id}.avif" alt="{e(prev_title)}" class="adjacent-preview" loading="lazy" width="80" height="80"/>'
            f'<svg class="text-deep-ink group-hover:text-international-orange mr-sm shrink-0" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><line x1="20" y1="12" x2="5" y2="12"/><polyline points="11 6 5 12 11 18"/></svg>'
            f'<div class="flex flex-col overflow-hidden">'
            f'<span class="font-label-caps text-[10px] text-archive-gray uppercase tracking-widest leading-none mb-[2px]">PREVIOUS</span>'
            f'<span class="font-label-caps text-[11px] text-deep-ink uppercase truncate group-hover:text-international-orange">{prev_title}</span>'
            f'</div></a>'
        )
    else:
        prev_html = '<span></span>'

    if next_id:
        next_html = (
            f'<a href="{next_id}.html" data-direction="next" '
            f'class="adjacent-nav-btn group flex items-center justify-end px-margin-mobile md:px-md h-full overflow-hidden relative">'
            f'<img src="../../artworks/thumbs/{next_id}.avif" alt="{e(next_title)}" class="adjacent-preview" loading="lazy" width="80" height="80"/>'
            f'<div class="flex flex-col overflow-hidden text-right">'
            f'<span class="font-label-caps text-[10px] text-archive-gray uppercase tracking-widest leading-none mb-[2px]">NEXT</span>'
            f'<span class="font-label-caps text-[11px] text-deep-ink uppercase truncate group-hover:text-international-orange">{next_title}</span>'
            f'</div>'
            f'<svg class="text-deep-ink group-hover:text-international-orange ml-sm shrink-0" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><line x1="4" y1="12" x2="19" y2="12"/><polyline points="13 6 19 12 13 18"/></svg>'
            f'</a>'
        )
    else:
        next_html = '<span></span>'

    desc_html = (
        f'<p class="font-body-md text-body-md text-secondary leading-relaxed mt-md">{e(desc)}</p>'
        if desc else ''
    )

    # Creator voice — pilot, art0518 only (see CREATOR_VOICE). Placed after the
    # record (metadata rows + description) so the durable page reads
    # object → record → creator, matching the dynamic artwork.html.
    # Fully self-contained inline styles (on-palette: deep-ink #0B0B0B for the
    # voice, secondary #5e5e5e for eyebrow/attribution, Playfair italic for the
    # spoken lines). These durable SEO pages don't compile the design-system's
    # text-size/colour utilities, so inline styling is what actually renders —
    # and it stays readable with JavaScript disabled, needing no CSS rebuild.
    cv = CREATOR_VOICE.get(art_id)
    if cv:
        _cap = 'font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#5e5e5e'
        _serif = "font-family:'Playfair Display',Georgia,serif;font-style:italic"
        creator_voice_html = (
            f'<div style="margin-top:28px">'
            f'<p style="{_cap};margin:0 0 14px">In his own words</p>'
            f'<p style="{_serif};font-size:24px;line-height:1.25;color:#0B0B0B;margin:0">&ldquo;{e(cv["voice"])}&rdquo;</p>'
            f'<p style="{_serif};font-size:16px;line-height:1.4;color:#5e5e5e;margin:8px 0 0">&ldquo;{e(cv["context"])}&rdquo;</p>'
            f'<p style="{_cap};margin:14px 0 0">{e(cv["attr"])}</p>'
            f'</div>'
        )
    else:
        creator_voice_html = ''

    # Reverse side: a native <details> disclosure needs no JavaScript to be
    # discoverable or viewable. Closed <details> content isn't laid out, so
    # loading="lazy" defers the fetch until a visitor actually opens it —
    # single-sided works (the vast majority) emit none of this at all.
    if has_back:
        back_html = (
            f'<details class="border-t border-deep-ink">'
            f'<summary class="reverse-summary font-label-md text-label-md uppercase tracking-widest '
            f'text-secondary hover:text-international-orange transition-colors cursor-pointer select-none p-sm">'
            f'[ VIEW BACK SIDE → ]</summary>'
            f'<div style="background-color:{bgcolor};">'
            f'<img src="../full/{back_img}" alt="{e(title)} — reverse side" '
            f'class="w-full h-auto object-contain" loading="lazy" width="1200" height="900"/>'
            f'</div>'
            f'</details>'
            f'<script>(function(){{'
            f'var d=document.currentScript.previousElementSibling,s=d.querySelector("summary");'
            f'd.addEventListener("toggle",function(){{s.textContent=d.open?"[ VIEW FRONT → ]":"[ VIEW BACK SIDE → ]";}});'
            f'}})();</script>'
        )
    else:
        back_html = ''

    # Related works by same theme
    related_works_html = ''
    if themes:
        related = []
        for other in all_works:
            if other == work:
                continue
            other_themes = other.get('themes', [])
            if any(t in other_themes for t in themes):
                related.append(other)
                if len(related) >= 3:
                    break

        if related:
            related_html = '<div class="grid grid-cols-3 gap-4 mt-lg pt-lg border-t border-archival-outline">'
            related_html += '<h3 class="col-span-3 font-headline-sm text-headline-sm mb-2">Related Works</h3>'
            for rel_work in related:
                rel_id = rel_work['file'].replace('.avif', '')
                rel_title = rel_work.get('title', 'Untitled')[:30]
                thumb_file = f'{rel_id}.avif'
                related_html += (
                    f'<a href="{rel_id}.html" class="group cursor-pointer">'
                    f'<img src="../../artworks/thumbs/{thumb_file}" alt="{e(rel_title)}" '
                    f'class="w-full h-auto object-cover" loading="lazy" width="200" height="200"/>'
                    f'<p class="font-body-sm text-body-sm mt-1 group-hover:text-international-orange transition-colors">{e(rel_title)}</p>'
                    f'</a>'
                )
            related_html += '</div>'
            related_works_html = related_html

    return f'''<!DOCTYPE html>
<html class="light" lang="en">
<head>
<meta charset="utf-8"/>
<script>try{{var t=localStorage.getItem('jfsn-theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')}}catch(e){{}}</script><!-- THEME_INIT: head-blocking, prevents dark-mode FOUC -->
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<meta name="theme-color" content="#fcf9f3"/>
<title>{e(title)} — Jeffrey F. S. Neumann</title>
<meta name="description" content="{seo_desc}"/>
<link rel="canonical" href="{SITE_URL}/artworks/pages/{art_id}.html"/>
<meta property="og:type" content="website"/>
<meta property="og:title" content="{e(title)} — Jeffrey F. S. Neumann"/>
<meta property="og:description" content="{seo_desc}"/>
<meta property="og:image" content="{SITE_URL}/artworks/thumbs/{front_img}"/>
<meta property="og:url" content="{SITE_URL}/artworks/pages/{art_id}.html"/>
<link rel="icon" href="../../favicon.svg" type="image/svg+xml"/>
<link rel="preload" as="font" type="font/woff2" href="/fonts/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7W0Q5nw.woff2" crossorigin/>
<link rel="preload" as="font" type="font/woff2" href="/fonts/nuFiD-vYSZviVYUb_rj3ij__anPXDTzYgEM86xQ.woff2" crossorigin/>
<link rel="stylesheet" href="../../_shared/ui.css"/>
<link rel="stylesheet" href="../../site.min.css"/>
<script type="application/ld+json">
{json.dumps(ld, ensure_ascii=False)}
</script>
<style>
  .material-symbols-outlined {{
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    display: inline-block;
    vertical-align: middle;
  }}
  body {{ -webkit-font-smoothing: antialiased; }}
  /* Cross-document view transition: a clicked thumbnail elsewhere on the site
     morphs into this page's main image. No-op in unsupporting browsers. */
  @view-transition {{ navigation: auto; }}
  .vt-artwork-main {{ view-transition-name: artwork-hero; }}
  @media (prefers-reduced-motion: reduce) {{
    ::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*) {{ animation: none !important; }}
  }}
</style>
</head>
<body class="font-body-md text-body-md bg-bone-white text-deep-ink">

<!-- NAV:START -->
<a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-deep-ink focus:text-bone-white focus:font-label-caps focus:text-label-caps">Skip to content</a>
<header class="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-desktop h-16 bg-background border-b border-deep-ink">
  <div class="flex items-center gap-8">
    <a href="../../index.html" class="font-headline-md text-headline-md tracking-tighter text-deep-ink">JFSN</a>
    <nav class="hidden md:flex gap-6" aria-label="Primary">
      <a class="font-nav-link text-nav-link text-deep-ink hover:text-international-orange transition-colors duration-200" href="../../archive.html">Archive</a>
      <a class="font-nav-link text-nav-link text-deep-ink hover:text-international-orange transition-colors duration-200" href="../../series-index.html">Series</a>
      <a class="font-nav-link text-nav-link text-deep-ink hover:text-international-orange transition-colors duration-200" href="../../about.html">About</a>
      <a class="font-nav-link text-nav-link text-deep-ink hover:text-international-orange transition-colors duration-200" href="../../lost.html">Lost Works</a>
    </nav>
  </div>
  <div class="flex items-center gap-4">
    <button class="md:hidden text-deep-ink" aria-label="Open menu" id="nav-menu-btn"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg></button>
  </div>
</header>
<div id="mobile-menu" aria-hidden="true" style="display:none;position:fixed;inset:0;z-index:40;">
  <div id="mobile-menu-backdrop" style="position:absolute;inset:0;background:rgba(11,11,11,0.5);"></div>
  <nav id="mobile-menu-drawer" aria-label="Mobile menu"
    style="position:absolute;top:0;right:0;width:min(280px,85vw);height:100%;background:#fcf9f3;border-left:1px solid #0B0B0B;display:flex;flex-direction:column;transform:translateX(100%);transition:transform 0.25s ease;">
    <div style="display:flex;justify-content:space-between;align-items:center;padding:0 20px;height:64px;border-bottom:1px solid #0B0B0B;">
      <span style="font-family:'Playfair Display',serif;font-size:18px;font-weight:500;letter-spacing:-0.02em;color:#0B0B0B;">JFSN</span>
      <button id="nav-menu-close" aria-label="Close menu"
        style="background:none;border:none;cursor:pointer;color:#0B0B0B;font-size:24px;padding:8px;margin-right:-8px;line-height:1;">&times;</button>
    </div>
    <div style="flex:1;overflow-y:auto;padding:8px 0;">
      <a href="../../archive.html"      style="display:block;padding:16px 24px;font-family:Inter,sans-serif;font-size:13px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:#0B0B0B;text-decoration:none;border-bottom:1px solid #c4c7c7;">Archive</a>
      <a href="../../series-index.html" style="display:block;padding:16px 24px;font-family:Inter,sans-serif;font-size:13px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:#0B0B0B;text-decoration:none;border-bottom:1px solid #c4c7c7;">Series</a>
      <a href="../../about.html"        style="display:block;padding:16px 24px;font-family:Inter,sans-serif;font-size:13px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:#0B0B0B;text-decoration:none;border-bottom:1px solid #c4c7c7;">About</a>
      <a href="../../lost.html"         style="display:block;padding:16px 24px;font-family:Inter,sans-serif;font-size:13px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:#0B0B0B;text-decoration:none;">Lost Works</a>
    </div>
  </nav>
</div>
<script>
(function(){{
  var menu=document.getElementById('mobile-menu');
  var drawer=document.getElementById('mobile-menu-drawer');
  var btn=document.getElementById('nav-menu-btn');
  var close=document.getElementById('nav-menu-close');
  var backdrop=document.getElementById('mobile-menu-backdrop');
  function open(){{menu.style.display='block';menu.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';requestAnimationFrame(function(){{drawer.style.transform='translateX(0)';}});close.focus();}}
  function shut(){{drawer.style.transform='translateX(100%)';document.body.style.overflow='';setTimeout(function(){{menu.style.display='none';menu.setAttribute('aria-hidden','true');}},260);btn.focus();}}
  if(btn)btn.addEventListener('click',open);
  if(close)close.addEventListener('click',shut);
  if(backdrop)backdrop.addEventListener('click',shut);
  document.addEventListener('keydown',function(e){{if(e.key==='Escape'&&menu.style.display==='block')shut();}});
}})();
</script>
<!-- NAV:END -->

<main id="main" class="pt-[100px] pb-xl px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto">

  <nav aria-label="Breadcrumb" class="mb-lg">
    <ol class="flex gap-xs items-center font-label-md text-label-md text-secondary uppercase tracking-widest" style="list-style:none;padding:0;margin:0;">
      <li class="breadcrumb-item" data-crumb-idx="0"><a href="../../archive.html" class="hover:text-international-orange transition-colors">Archive</a></li>
      <li aria-hidden="true" class="opacity-40 breadcrumb-item" data-crumb-idx="1">/</li>
      <li aria-current="page" class="text-deep-ink truncate breadcrumb-item" data-crumb-idx="2">{e(title)}</li>
    </ol>
  </nav>

  <div class="grid grid-cols-1 md:grid-cols-12 gap-gutter items-start mb-xl">

    <!-- Image -->
    <section class="md:col-span-8 border border-deep-ink">
      <div style="background-color:{bgcolor};">
        <img src="../full/{front_img}"
             alt="{e(title)}"
             class="w-full h-auto object-contain vt-artwork-main"
             loading="eager"
             width="1200" height="900"
             data-dominant-color="{bgcolor}"/>
      </div>
      {back_html}<div class="p-sm border-t border-deep-ink flex justify-between items-center gap-2">
        <span class="font-label-md text-label-md text-secondary uppercase tracking-widest cursor-pointer hover:text-international-orange transition-colors" onclick="navigator.clipboard.writeText('{e(art_id.upper())}').then(()=>window.showToast('Copied: {e(art_id.upper())}!'))" title="Click to copy">{e(art_id.upper())}</span>
        <div class="flex gap-2 items-center">
          <button class="favorite-btn" data-art-id="{art_id}" onclick="window.toggleFavorite('{art_id}')" title="Add to favorites">Favorite</button>
          <a href="../full/{front_img}"
             class="font-label-md text-label-md uppercase tracking-widest text-secondary hover:text-international-orange transition-colors"
             target="_blank" rel="noopener">
            Full resolution <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="7"/><line x1="20.4" y1="20.4" x2="16" y2="16"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
          </a>
        </div>
      </div>
    </section>

    <!-- Metadata -->
    <aside class="md:col-span-4 flex flex-col gap-md sticky top-[100px]">
      <div class="border-b border-deep-ink pb-md">
        <h1 class="font-headline-md text-headline-md leading-tight mb-xs">{e(title)}</h1>
        <p class="font-label-md text-label-md text-orange-ink uppercase tracking-widest">Jeffrey F. S. Neumann</p>
      </div>
      <div class="flex flex-col gap-sm">
        {rows}
      </div>
      {desc_html}
      {creator_voice_html}
    </aside>

  </div>

  <!-- Related works by theme -->
  {related_works_html}

  <!-- Prev / Next -->
  <nav class="w-full bg-bone-white border-y border-deep-ink grid grid-cols-2 divide-x divide-outline-variant h-[56px] items-center" aria-label="Adjacent works">
    {prev_html}
    {next_html}
  </nav>

</main>

<!-- FOOTER:START -->
<footer class="bg-surface-container-high py-16 px-margin-desktop border-t border-outline-variant">
  <div class="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
    <div>
      <h3 class="font-headline-md text-headline-md tracking-tighter mb-6">JFSN</h3>
      <p class="font-body-md text-archive-gray text-sm leading-relaxed">The personal archive of Jeffrey F. S. Neumann — {len(all_works):,} works spanning five decades. Collage, sculpture, photography.</p>
    </div>
    <div>
      <h4 class="font-label-caps text-label-caps mb-6 text-deep-ink">EXPLORE</h4>
      <ul class="space-y-3 font-nav-link text-nav-link text-archive-gray">
        <li><a class="hover:text-international-orange transition-colors" href="../../archive.html">Complete Archive</a></li>
        <li><a class="hover:text-international-orange transition-colors" href="../../series-index.html">Series Index</a></li>
        <li><a class="hover:text-international-orange transition-colors" href="../../lost.html">Lost Works</a></li>
      </ul>
    </div>
    <div>
      <h4 class="font-label-caps text-label-caps mb-6 text-deep-ink">RESOURCES</h4>
      <ul class="space-y-3 font-nav-link text-nav-link text-archive-gray">
        <li><a class="hover:text-international-orange transition-colors" href="../../chromatic.html">Chromatic River</a></li>
        <li><a class="hover:text-international-orange transition-colors" href="../../wall.html">The Wall</a></li>
      </ul>
    </div>
    <div>
      <h4 class="font-label-caps text-label-caps mb-6 text-deep-ink">CONTACT</h4>
      <a class="font-nav-link text-nav-link text-deep-ink block mb-4 border-b border-deep-ink inline-block pb-1 hover:text-international-orange hover:border-international-orange transition-all" href="mailto:jfsneumann@gmail.com">jfsneumann@gmail.com</a>
    </div>
  </div>
  <div class="mt-16 pt-8 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-4">
    <p class="font-label-caps text-[10px] text-archive-gray">© 2026 JEFFREY F. S. NEUMANN. ALL RIGHTS RESERVED.</p>
    <div class="flex gap-8"><a class="font-label-caps text-[10px] text-archive-gray hover:text-deep-ink" href="../../privacy.html">PRIVACY</a></div>
  </div>
</footer>
<script data-goatcounter="https://jfsn.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
<script>if('serviceWorker'in navigator)navigator.serviceWorker.register('../../sw.js').catch(function(){{}});</script>
<!-- FOOTER:END -->

<!-- Mobile bottom nav -->
<nav class="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center pt-2 px-4 bg-background border-t border-deep-ink h-16" style="padding-bottom: env(safe-area-inset-bottom, 8px)" aria-label="Mobile navigation">
  <a href="../../index.html" class="flex flex-col items-center justify-center text-secondary">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h5v-5.5h3V20h5v-9.5"/></svg>
    <span class="font-label-md text-[10px] uppercase">Home</span>
  </a>
  <a href="../../archive.html" class="flex flex-col items-center justify-center text-orange-ink">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="3.5" y="3.5" width="17" height="5"/><path d="M5 8.5V20.5h14V8.5"/><line x1="10" y1="12.5" x2="14" y2="12.5"/></svg>
    <span class="font-label-md text-[10px] uppercase">Archive</span>
  </a>
  <a href="../../series-index.html" class="flex flex-col items-center justify-center text-secondary">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="9" y="9" width="11.5" height="11.5"/><path d="M5.8 17.2V5.8h11.4"/><path d="M3 14V3h11"/></svg>
    <span class="font-label-md text-[10px] uppercase">Series</span>
  </a>
  <a href="../../about.html" class="flex flex-col items-center justify-center text-secondary">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    <span class="font-label-md text-[10px] uppercase">About</span>
  </a>
</nav>

<script src="../../search.js" defer></script>
<script src="../../_shared/nav-active.js" defer></script>
<script src="../../_shared/artwork-page-min.js" defer></script>
</body>
</html>'''


def main():
    parser = argparse.ArgumentParser(description='Generate static artwork pages.')
    parser.add_argument('--limit', type=int, default=None, help='Process only first N works')
    parser.add_argument('--id', type=str, default=None, help='Generate a single page by art ID')
    args = parser.parse_args()

    all_works = json.loads(CATALOG.read_text())
    colors    = json.loads(COLORS.read_text())
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    if args.id:
        target = args.id.lower()
        matches = [(i, w) for i, w in enumerate(all_works)
                   if w['file'].replace('.avif', '') == target]
        if not matches:
            print(f'Error: no work found with id "{args.id}"', file=sys.stderr)
            sys.exit(1)
        idx, work = matches[0]
        art_id = work['file'].replace('.avif', '')
        (OUT_DIR / f'{art_id}.html').write_text(
            generate_page(work, idx, all_works, colors), encoding='utf-8')
        print(f'Generated: artworks/pages/{art_id}.html')
        return

    to_build = all_works[:args.limit] if args.limit else all_works

    for idx, work in enumerate(to_build):
        art_id = work['file'].replace('.avif', '')
        page   = generate_page(work, idx, all_works, colors)
        (OUT_DIR / f'{art_id}.html').write_text(page, encoding='utf-8')

    n = len(to_build)
    print(f'Generated {n} page{"s" if n != 1 else ""} → artworks/pages/')


if __name__ == '__main__':
    main()

#!/usr/bin/env python3
"""
Generates curatorial-companion.html from the canonical markdown source:
  docs/sources/curatorial/CURATORIAL-COMPANION-v1.0.md

The markdown file is the single authoritative source. This script only
handles presentation (page chrome, TOC, art-ID links) — it must never
alter the wording of the Companion. Re-run after any change to the
canonical .md; do not hand-edit curatorial-companion.html's <article> body.

Usage: python3 gen-curatorial-companion.py
"""
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).parent
SRC_MD = ROOT / "docs" / "sources" / "curatorial" / "CURATORIAL-COMPANION-v1.0.md"
CATALOG = ROOT / "catalog.json"
OUT_HTML = ROOT / "curatorial-companion.html"

ART_ID_RE = re.compile(r"\bart\d{4}\b")


def valid_art_ids():
    data = json.loads(CATALOG.read_text())
    return {d["file"].split(".")[0] for d in data}


def slugify(text):
    text = re.sub(r"^\d+\.\s*", "", text)  # drop leading "1. "
    text = re.sub(r"[^a-z0-9\s-]", "", text.lower())
    text = re.sub(r"\s+", "-", text.strip())
    return "cc-" + text


def linkify_art_ids(text, ids):
    def repl(m):
        aid = m.group(0)
        if aid in ids:
            return f'<a href="artwork.html?id={aid}" class="cc-art-link">{aid}</a>'
        return aid
    return ART_ID_RE.sub(repl, text)


def inline_format(text, ids):
    text = html.escape(text, quote=False)
    text = linkify_art_ids(text, ids)
    text = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", text)
    text = re.sub(r"(?<!\w)\*(.+?)\*(?!\w)", r"<em>\1</em>", text)
    text = re.sub(r"`(.+?)`", r"<code>\1</code>", text)
    return text


def parse_markdown(md_text, ids):
    lines = md_text.split("\n")
    html_parts = []
    toc = []  # (level, id, text)
    i = 0
    n = len(lines)

    def flush_list(buf):
        if not buf:
            return
        html_parts.append("<ul>")
        for item in buf:
            html_parts.append(f"<li>{inline_format(item, ids)}</li>")
        html_parts.append("</ul>")
        buf.clear()

    def flush_quote(buf):
        if not buf:
            return
        html_parts.append('<blockquote class="cc-quote">')
        for line in buf:
            html_parts.append(f"<p>{inline_format(line, ids)}</p>")
        html_parts.append("</blockquote>")
        buf.clear()

    list_buf = []
    quote_buf = []

    while i < n:
        line = lines[i].rstrip()

        if not line.strip():
            flush_list(list_buf)
            flush_quote(quote_buf)
            i += 1
            continue

        if line.strip() == "---":
            flush_list(list_buf)
            flush_quote(quote_buf)
            html_parts.append('<hr class="cc-rule"/>')
            i += 1
            continue

        heading_match = re.match(r"^(#{1,6})\s+(.*)$", line)
        if heading_match:
            flush_list(list_buf)
            flush_quote(quote_buf)
            level = len(heading_match.group(1))
            raw_text = heading_match.group(2).strip()
            anchor = slugify(raw_text)
            rendered = inline_format(raw_text, ids)
            tag = f"h{min(level, 6)}"  # ## -> h2, ### -> h3 (page <h1> is the hero title)
            html_parts.append(f'<{tag} id="{anchor}" class="cc-heading cc-h{level}">{rendered}</{tag}>')
            if level in (2, 3):
                toc.append((level, anchor, rendered))
            i += 1
            continue

        if line.startswith("- "):
            flush_quote(quote_buf)
            list_buf.append(line[2:].strip())
            i += 1
            continue

        if line.startswith(">"):
            flush_list(list_buf)
            quote_buf.append(line.lstrip(">").strip())
            i += 1
            continue

        flush_list(list_buf)
        flush_quote(quote_buf)
        para_lines = [line.strip()]
        i += 1
        while i < n and lines[i].strip() and not lines[i].strip().startswith(("#", "-", ">", "---")):
            para_lines.append(lines[i].strip())
            i += 1
        html_parts.append(f"<p>{inline_format(' '.join(para_lines), ids)}</p>")

    flush_list(list_buf)
    flush_quote(quote_buf)
    return "\n".join(html_parts), toc


def build_toc_html(toc):
    items = []
    for level, anchor, text in toc:
        cls = "cc-toc-l2" if level == 2 else "cc-toc-l3"
        items.append(f'<a href="#{anchor}" class="cc-toc-link {cls}">{text}</a>')
    return "\n".join(items)


TEMPLATE = """<!DOCTYPE html>
<!--
  GENERATED FILE — do not hand-edit.
  Source of truth: docs/sources/curatorial/CURATORIAL-COMPANION-v1.0.md
  Regenerate with: python3 gen-curatorial-companion.py && bash scripts/stamp-nav.sh
  (stamp-nav.sh restamps the real NAV/SCRIPTS/FOOTER blocks after generation)
-->
<html class="light" lang="en">
<head>
<meta charset="utf-8"/>
<script>try{{var t=localStorage.getItem('jfsn-theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')}}catch(e){{}}</script><!-- THEME_INIT: head-blocking, prevents dark-mode FOUC -->
<script>document.documentElement.classList.add('js')</script><!-- JS-on flag: gates the .reveal-section hidden state so content stays visible with JS off -->
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<meta name="theme-color" content="#fcf9f3"/>
<title>Curatorial Companion — Jeffrey F. S. Neumann</title>
<meta name="description" content="A museum-style companion volume to the JFSN Archive — curatorial methodology, a chief curator's essay, seven gallery panels, and twenty-five verified works, read across fifty years of Jeffrey F. S. Neumann's practice."/>
<link rel="canonical" href="https://jfsn.com/curatorial-companion.html"/>
<link rel="icon" href="favicon.svg" type="image/svg+xml"/>
<link rel="alternate" type="application/rss+xml" title="Jeffrey F. S. Neumann — Archive" href="https://jfsn.com/feed.xml"/>
<link rel="manifest" href="manifest.json"/>
<link rel="apple-touch-icon" href="icon-192.png"/>
<meta property="og:type" content="website"/>
<meta property="og:title" content="Curatorial Companion — Jeffrey F. S. Neumann"/>
<meta property="og:description" content="A museum-style companion volume to the JFSN Archive — methodology, essay, gallery panels, and twenty-five verified works."/>
<meta property="og:image" content="https://jfsn.com/assets/og-card.jpg"/>
<meta property="og:url" content="https://jfsn.com/curatorial-companion.html"/>
<script type="application/ld+json">
{{"@context":"https://schema.org","@type":"CreativeWork","name":"JFSN Archive — Curatorial Companion","url":"https://jfsn.com/curatorial-companion.html","description":"A museum-style companion volume to the JFSN Archive.","creator":{{"@type":"Person","name":"Jeffrey F. S. Neumann","url":"https://jfsn.com"}}}}
</script>
<link rel="preload" as="font" type="font/woff2" href="/fonts/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7W0Q5nw.woff2" crossorigin/>
<link rel="preload" as="font" type="font/woff2" href="/fonts/nuFiD-vYSZviVYUb_rj3ij__anPXDTzYgEM86xQ.woff2" crossorigin/>
<link rel="stylesheet" href="_shared/ui.css"/>
<link rel="stylesheet" href="_shared/dark-mode.css"/>
<link rel="stylesheet" href="site.min.css"/>
<link rel="stylesheet" href="_shared/section-tints.css"/>
<style>
  body {{ -webkit-font-smoothing: antialiased; }}
  #reading-progress {{ position:fixed;top:0;left:0;width:0%;height:2px;background:#FF6600;z-index:200;transition:width 0.1s linear;pointer-events:none; }}
  @media(prefers-reduced-motion:reduce){{ #reading-progress {{ transition:none; }} }}
  .mobile-toc-link{{display:block;padding:9px 0;font-family:Inter,sans-serif;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#575757;text-decoration:none;border-bottom:1px solid #f0ede7;}}
  .mobile-toc-link:hover,.mobile-toc-link:active{{color:#FF6600;}}
  .mobile-toc-link.toc-active{{color:#B84700;font-weight:600;}}
  .section-label {{
    font-family: Inter, sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #8e7164;
    margin-bottom: 20px;
    display: block;
  }}
  .bracket-link {{
    font-family: Inter, sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #B84700;
    text-decoration: none;
    transition: color 0.2s ease;
  }}
  .bracket-link:hover {{ color: #0B0B0B; }}
  @media (prefers-reduced-motion: reduce) {{ .bracket-link {{ transition: none; }} }}

  /* Companion typography — museum-publication register */
  #cc-article {{
    font-family: Inter, sans-serif;
    font-size: 17px;
    line-height: 1.8;
    color: #575757;
    max-width: 680px;
  }}
  #cc-article p {{ margin: 1.25em 0 0; }}
  #cc-article p:first-of-type {{ margin-top: 0; }}
  #cc-article em {{ color: #0B0B0B; }}
  #cc-article strong {{ color: #0B0B0B; font-weight: 600; }}
  .dark #cc-article strong {{ color: #f0f0f0; }}
  .dark #cc-article .cc-quote p {{ color: #f0f0f0; }}
  #cc-article code {{ font-family: ui-monospace,'SF Mono',Menlo,monospace; font-size: 0.9em; background: #f0ede7; padding: 0.1em 0.35em; }}
  #cc-article .cc-art-link {{ color: #B84700; text-decoration: none; border-bottom: 1px dotted #B84700; }}
  #cc-article .cc-art-link:hover {{ color: #0B0B0B; border-bottom-color: #0B0B0B; }}
  .dark #cc-article .cc-art-link {{ color: #FF6600; border-bottom-color: #FF6600; }}
  .dark #cc-article .cc-art-link:hover {{ color: #f0f0f0; border-bottom-color: #f0f0f0; }}
  .dark #cc-article code {{ background: #2a2a2a; color: #d0d0d0; }}
  #cc-article .cc-heading {{ font-family: 'Playfair Display', Georgia, serif; color: #0B0B0B; scroll-margin-top: 96px; }}
  #cc-article .cc-h2 {{ font-size: clamp(28px,4vw,36px); font-weight: 700; margin: 2.4em 0 0.6em; letter-spacing: -0.01em; }}
  #cc-article .cc-h2:first-child {{ margin-top: 0; }}
  #cc-article .cc-h3 {{ font-size: 22px; font-weight: 600; margin: 1.8em 0 0.5em; }}
  #cc-article .cc-h3:first-child {{ margin-top: 0.4em; }}
  #cc-article .cc-rule {{ border: none; border-top: 1px solid #e3bfb1; margin: 2.4em 0; }}
  #cc-article ul {{ margin: 1em 0 0; padding-left: 1.4em; }}
  #cc-article li {{ margin-top: 0.6em; }}
  #cc-article .cc-quote {{ border-left: 3px solid #8e7164; margin: 1.4em 0; padding: 0.2em 0 0.2em 20px; }}
  #cc-article .cc-quote p {{ font-style: italic; color: #0B0B0B; }}

  /* Desktop sticky TOC */
  #cc-toc {{ position: sticky; top: 96px; }}
  #cc-toc-list {{ display: flex; flex-direction: column; }}
  .cc-toc-link {{
    font-family: Inter, sans-serif;
    text-decoration: none;
    color: #575757;
    padding: 8px 0 8px 14px;
    border-left: 2px solid #e3bfb1;
    transition: color 0.15s ease, border-color 0.15s ease;
  }}
  .cc-toc-l2 {{ font-size: 12px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; }}
  .cc-toc-l3 {{ font-size: 12px; padding-left: 26px; color: #8e7164; }}
  .cc-toc-link:hover {{ color: #FF6600; }}
  .cc-toc-link.cc-toc-active {{ color: #B84700; border-left-color: #FF6600; }}
  .dark .cc-toc-link.cc-toc-active {{ color: #FF6600; }}
  .dark .mobile-toc-link.toc-active {{ color: #FF6600; }}
  @media (prefers-reduced-motion: reduce) {{ .cc-toc-link {{ transition: none; }} }}
</style>
  <link rel="stylesheet" href="/_shared/lightbox.css"/>
  <link rel="stylesheet" href="/_shared/enhancements.css"/>
  <link rel="stylesheet" href="/_shared/toast.css"/>
  <link rel="stylesheet" href="/_shared/skeleton.css"/>
  <link rel="stylesheet" href="/_shared/hover-preview.css?v=20260703T4"/>
  <link rel="stylesheet" href="/_shared/page-transitions.css"/>
  <link rel="stylesheet" href="/_shared/lazy-load.css"/>
</head>
<body class="bg-background text-deep-ink font-body-md" data-page-label="CURATORIAL COMPANION">

<!-- NAV:START -->
{nav_placeholder}
<!-- NAV:END -->
<!-- SCRIPTS:START -->
{scripts_placeholder}
<!-- SCRIPTS:END -->
<script src="_shared/drone-fleet.js?v=20260703131542" defer></script>

<div id="reading-progress" aria-hidden="true"></div>
<div id="main" tabindex="-1" style="outline:none;"></div>

<main class="pt-16">

  <!-- Hero -->
  <div class="px-margin-desktop py-16" style="border-bottom:1px solid #8e7164;">
    <div class="max-w-container-max mx-auto">
      <span style="font-family:Inter,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#B84700;display:block;margin-bottom:16px;">A Companion Volume to the JFSN Archive — Version 1.0</span>
      <h1 style="font-family:'Playfair Display',serif;font-size:clamp(40px,6vw,72px);font-weight:700;line-height:1.05;letter-spacing:-0.02em;color:#0B0B0B;">Curatorial Companion</h1>
      <p style="font-family:'Playfair Display',Georgia,serif;font-style:italic;font-size:20px;color:#575757;margin-top:14px;line-height:1.4;max-width:640px;">A companion volume to the JFSN Archive — methodology, a chief curator's essay, seven gallery panels, and twenty-five verified works, read across fifty years of practice.</p>
      <p style="margin-top:24px;">
        <a href="archive.html" class="bracket-link">[ ← Back to the Archive ]</a>
      </p>
    </div>
  </div>

  <!-- Mobile jump nav -->
  <div class="md:hidden border-b border-outline-variant px-margin-mobile">
    <button id="cc-mobile-toc-btn" aria-expanded="false" aria-controls="cc-mobile-toc-list"
      style="width:100%;display:flex;justify-content:space-between;align-items:center;padding:14px 0;background:none;border:none;cursor:pointer;font-family:Inter,sans-serif;font-size:10px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;color:#575757;">
      <span>Jump to Section</span><span id="cc-mobile-toc-chevron" style="transition:transform 0.2s ease;">↓</span>
    </button>
    <div id="cc-mobile-toc-list" style="display:none;padding-bottom:12px;">
{mobile_toc}
    </div>
  </div>
  <script>
  (function(){{
    var btn=document.getElementById('cc-mobile-toc-btn');
    var list=document.getElementById('cc-mobile-toc-list');
    var chev=document.getElementById('cc-mobile-toc-chevron');
    if(!btn)return;
    btn.addEventListener('click',function(){{
      var open=list.style.display==='block';
      list.style.display=open?'none':'block';
      btn.setAttribute('aria-expanded',String(!open));
      chev.style.transform=open?'rotate(0deg)':'rotate(180deg)';
    }});
    list.querySelectorAll('a').forEach(function(a){{
      a.addEventListener('click',function(){{
        list.style.display='none';
        btn.setAttribute('aria-expanded','false');
        chev.style.transform='rotate(0deg)';
      }});
    }});
  }})();
  </script>

  <!-- Two-column body -->
  <div class="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto" style="padding-top:64px;padding-bottom:96px;">
    <div class="grid grid-cols-1 md:grid-cols-12 gap-8">

      <!-- Sticky desktop TOC -->
      <div class="hidden md:block md:col-span-3">
        <nav id="cc-toc" aria-label="Table of contents">
          <span class="section-label" style="margin-bottom:16px;">Contents</span>
          <div id="cc-toc-list">
{desktop_toc}
          </div>
        </nav>
      </div>

      <!-- Companion text -->
      <div class="md:col-span-9">
        <article id="cc-article">
{article_html}
        </article>

        <!-- Bottom navigation back into the archive -->
        <div style="margin-top:64px;padding-top:32px;border-top:1px solid #e3bfb1;">
          <span class="section-label">Continue Exploring</span>
          <div style="display:flex;flex-wrap:wrap;gap:12px 28px;margin-top:8px;">
            <a href="archive.html" class="bracket-link">[ Archive → ]</a>
            <a href="start-here.html" class="bracket-link">[ Start Here → ]</a>
            <a href="stories.html" class="bracket-link">[ Stories → ]</a>
            <a href="why-i-made-things.html" class="bracket-link">[ Why I Made Things → ]</a>
          </div>
        </div>
      </div>

    </div>
  </div>

</main>
<script>
(function(){{
  var links = document.querySelectorAll('#cc-mobile-toc-list .mobile-toc-link, .cc-toc-link');
  var headings = document.querySelectorAll('#cc-article .cc-heading[id]');
  if (links.length && headings.length) {{
    var obs = new IntersectionObserver(function(entries){{
      entries.forEach(function(e){{
        if (e.isIntersecting) {{
          links.forEach(function(l){{ l.classList.remove('toc-active','cc-toc-active'); }});
          document.querySelectorAll('a[href="#'+e.target.id+'"]').forEach(function(a){{
            a.classList.add('toc-active');
            a.classList.add('cc-toc-active');
          }});
        }}
      }});
    }}, {{ rootMargin: '-10% 0px -75% 0px' }});
    headings.forEach(function(h){{ obs.observe(h); }});
  }}
}})();
</script>
<script>
(function(){{
  var progressBar = document.getElementById('reading-progress');
  if (progressBar) {{
    window.addEventListener('scroll', function(){{
      var s = document.documentElement;
      var pct = (s.scrollTop / (s.scrollHeight - s.clientHeight)) * 100;
      progressBar.style.width = Math.min(pct, 100) + '%';
    }}, {{ passive: true }});
  }}
}})();
</script>
<!-- FOOTER:START -->
{footer_placeholder}
<!-- FOOTER:END -->
<script src="_shared/nav-active.js" defer></script>
<script src="_shared/core.bundle.js" defer></script>
  <script src="/_shared/hover-preview.js?v=20260703T4" defer></script>
</body>
</html>
"""


def strip_duplicate_title(md_text):
    """Drop the source's own H1 title and Version subheading — the page
    template's hero already renders both, so keeping them would duplicate."""
    lines = md_text.split("\n")
    if lines and lines[0].startswith("# "):
        lines.pop(0)
    while lines and not lines[0].strip():
        lines.pop(0)
    if lines and lines[0].startswith("### ") and "version" in lines[0].lower():
        lines.pop(0)
    return "\n".join(lines)


def main():
    ids = valid_art_ids()
    md_text = strip_duplicate_title(SRC_MD.read_text())
    article_html, toc = parse_markdown(md_text, ids)

    mobile_toc = "\n".join(
        f'      <a href="#{anchor}" class="mobile-toc-link">{"&nbsp;&nbsp;" if level == 3 else ""}{text}</a>'
        for level, anchor, text in toc
    )
    desktop_toc = build_toc_html(toc)

    out = TEMPLATE.format(
        nav_placeholder="<!-- Stamped by stamp-nav.sh from _shared/top-nav.html -->",
        scripts_placeholder="<!-- Stamped by stamp-nav.sh from _shared/top-nav.html -->",
        footer_placeholder="<!-- Stamped by stamp-nav.sh from _shared/footer.html -->",
        mobile_toc=mobile_toc,
        desktop_toc=desktop_toc,
        article_html=article_html,
    )
    OUT_HTML.write_text(out)
    print(f"Wrote {OUT_HTML} ({len(out):,} bytes), {len(toc)} TOC entries.")
    print("Run: bash scripts/stamp-nav.sh   (to stamp real NAV/SCRIPTS/FOOTER blocks)")


if __name__ == "__main__":
    main()

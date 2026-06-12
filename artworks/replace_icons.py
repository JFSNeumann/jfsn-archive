#!/usr/bin/env python3
"""
One-time sweep: replace Material Symbols glyphs with inline SVG and drop the
Material+Symbols+Outlined family from every Google Fonts URL.

Why: the icon font was a render-blocking download used for a handful of glyphs,
and glyph names flashed as raw text ("search", "menu") before the font loaded.
Inline SVG paints immediately and inherits color via currentColor, so all
existing hover classes keep working.

Targets: root *.html, _shared/top-nav.html, gen-artwork-pages.py (template).
Safe to re-run (idempotent: patterns disappear after first pass).
"""
import re, glob, sys
from pathlib import Path

ROOT = Path(__file__).parent.parent

S = 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'

ICONS = {
    'search':       f'<circle cx="11" cy="11" r="7"/><line x1="20.4" y1="20.4" x2="16" y2="16"/>',
    'menu':         f'<line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>',
    'close':        f'<line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/>',
    'arrow_forward':f'<line x1="4" y1="12" x2="19" y2="12"/><polyline points="13 6 19 12 13 18"/>',
    'arrow_back':   f'<line x1="20" y1="12" x2="5" y2="12"/><polyline points="11 6 5 12 11 18"/>',
    'zoom_in':      f'<circle cx="11" cy="11" r="7"/><line x1="20.4" y1="20.4" x2="16" y2="16"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>',
    'home':         f'<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h5v-5.5h3V20h5v-9.5"/>',
    'inventory_2':  f'<rect x="3.5" y="3.5" width="17" height="5"/><path d="M5 8.5V20.5h14V8.5"/><line x1="10" y1="12.5" x2="14" y2="12.5"/>',
    'auto_awesome_motion': f'<rect x="9" y="9" width="11.5" height="11.5"/><path d="M5.8 17.2V5.8h11.4"/><path d="M3 14V3h11"/>',
    'chat_bubble':  f'<path d="M21 4H3v13h5v4l5-4h8z"/>',
    'scan_delete':  f'<rect x="4" y="4" width="16" height="16"/>',
}

def svg(glyph, size, extra_cls='', extra_style=''):
    cls = f' class="{extra_cls.strip()}"' if extra_cls.strip() else ''
    sty = f' style="{extra_style.strip()}"' if extra_style.strip() else ''
    return (f'<svg{cls}{sty} width="{size}" height="{size}" viewBox="0 0 24 24" {S} '
            f'aria-hidden="true" focusable="false">{ICONS[glyph]}</svg>')

SPAN_RE = re.compile(
    r'<span class="material-symbols-outlined\s*([^"]*)"((?:\s+style="([^"]*)")?[^>]*)>\s*([a-z_0-9]+)\s*</span>')

def span_sub(m):
    extra_cls, attrs, style, glyph = m.group(1), m.group(2) or '', m.group(3) or '', m.group(4)
    if glyph not in ICONS:
        print(f"  !! unknown glyph '{glyph}' left untouched"); return m.group(0)
    size = 24
    fs = re.search(r'font-size:\s*(\d+)px', style)
    if fs: size = int(fs.group(1))
    # icons render slightly larger than glyph metrics — trim a hair
    size = max(12, round(size * 0.92))
    keep_style = re.sub(r'(font-size|line-height|font-variation-settings)\s*:[^;]+;?', '', style).strip()
    return svg(glyph, size, extra_cls, keep_style)

# menu button where the button itself carries the icon class
BTN_RE = re.compile(
    r'<button class="md:hidden material-symbols-outlined ([^"]*)"([^>]*)>\s*menu\s*</button>')

def btn_sub(m):
    return (f'<button class="md:hidden {m.group(1)}"{m.group(2)}>'
            + svg('menu', 22) + '</button>')

FONT_RE = re.compile(r'family=Material\+Symbols\+Outlined:[^&"]*&(amp;)?')

def process(path):
    p = Path(path)
    text = orig = p.read_text()
    text = BTN_RE.sub(btn_sub, text)
    text = SPAN_RE.sub(span_sub, text)
    text = FONT_RE.sub('', text)
    if text != orig:
        p.write_text(text)
        return True
    return False

targets = sorted(glob.glob(str(ROOT / '*.html'))) + [str(ROOT / '_shared/top-nav.html'),
                                                     str(ROOT / 'gen-artwork-pages.py')]
changed = [Path(t).name for t in targets if process(t)]
print(f"changed {len(changed)} files:", ', '.join(changed))
leftover = []
for t in targets:
    txt = Path(t).read_text()
    if 'material-symbols-outlined"' in txt and SPAN_RE.search(txt):
        leftover.append(Path(t).name)
print("files with unconverted glyph spans:", leftover or "none")

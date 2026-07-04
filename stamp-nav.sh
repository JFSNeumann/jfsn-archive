#!/usr/bin/env bash
# stamp-nav.sh — replace NAV:START/END and FOOTER:START/END blocks in all HTML files
# Usage: bash stamp-nav.sh
# Run this whenever the nav or footer changes (_shared/ is the single source of truth)
set -e
cd "$(dirname "$0")"

NAV_FILE="_shared/top-nav.html"
FOOTER_FILE="_shared/footer.html"
if [ ! -f "$NAV_FILE" ]; then
  echo "ERROR: $NAV_FILE not found."
  exit 1
fi
if [ ! -f "$FOOTER_FILE" ]; then
  echo "ERROR: $FOOTER_FILE not found."
  exit 1
fi

TARGETS=(
  index.html archive.html artwork.html series-index.html
  about.html
  lost.html
  collage.html sculpture.html photography.html painting.html
  changes.html chromatic.html
  guernica.html targets.html framed.html torsos-faces.html
  gallery-images.html mr-snowmann.html crosses.html collaboration.html
  privacy.html series.html wall.html 404.html api.html
  start-here.html favorites.html
  stories.html why-i-made-things.html imagined-museum.html  1970s.html 1980s.html 1990s.html 2000s.html 2010s.html 2020s.html
  curatorial-map.html curatorial-companion.html
  style-guide.html
)
# Note: decade pages migrated to the canonical Stitch nav/footer 2026-06-16
# (global review) — they now carry NAV:START/FOOTER:END markers like every
# other page, so they're included here. They still use Material Design
# tailwind tokens for their hero/grid/prev-next chrome — only the header and
# footer chrome were unified.

STAMPED=0
SKIPPED=0

for f in "${TARGETS[@]}"; do
  if [ ! -f "$f" ]; then
    echo "  skipping $f (not found)"
    ((SKIPPED++)) || true
    continue
  fi

  if ! grep -q "<!-- NAV:START -->" "$f"; then
    echo "  skipping $f (no NAV:START marker)"
    ((SKIPPED++)) || true
    continue
  fi

  python3 - "$f" "$NAV_FILE" "$FOOTER_FILE" <<'PYEOF'
import sys, re

html_path    = sys.argv[1]
nav_path     = sys.argv[2]
footer_path  = sys.argv[3]

nav_src      = open(nav_path).read()
footer_src   = open(footer_path).read()

# Extract each block from the source files rather than using the full file,
# so NAV, SCRIPTS, and FOOTER are stamped independently and page-specific
# scripts placed after <!-- SCRIPTS:END --> are never touched.
nav_block = re.search(
    r'<!-- NAV:START -->.*?<!-- NAV:END -->', nav_src, re.DOTALL
).group()
scripts_block = re.search(
    r'<!-- SCRIPTS:START -->.*?<!-- SCRIPTS:END -->', nav_src, re.DOTALL
).group()
footer_block = re.search(
    r'<!-- FOOTER:START -->.*?<!-- FOOTER:END -->', footer_src, re.DOTALL
).group()

content = open(html_path).read()
new_content = re.sub(
    r'<!-- NAV:START -->.*?<!-- NAV:END -->',
    nav_block, content, flags=re.DOTALL
)
new_content = re.sub(
    r'<!-- SCRIPTS:START -->.*?<!-- SCRIPTS:END -->',
    scripts_block, new_content, flags=re.DOTALL
)
new_content = re.sub(
    r'<!-- FOOTER:START -->.*?<!-- FOOTER:END -->',
    footer_block, new_content, flags=re.DOTALL
)

if new_content != content:
    open(html_path, 'w').write(new_content)
    print(f"  stamped: {html_path}")
else:
    print(f"  unchanged: {html_path}")
PYEOF

  ((STAMPED++)) || true
done

echo ""
echo "Done. $STAMPED file(s) processed, $SKIPPED skipped."
echo "Active page highlights (orange underline) must still be set per-page."
echo "Footer source of truth: _shared/footer.html"

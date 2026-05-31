#!/usr/bin/env bash
# stamp-nav.sh — replace <!-- NAV:START --> ... <!-- NAV:END --> in all HTML files
# Usage: bash stamp-nav.sh
# Run this whenever the nav changes (_shared/top-nav.html is the single source of truth)
set -e
cd "$(dirname "$0")"

NAV_FILE="_shared/top-nav.html"
if [ ! -f "$NAV_FILE" ]; then
  echo "ERROR: $NAV_FILE not found."
  exit 1
fi

TARGETS=(
  index.html archive.html artwork.html series-index.html
  timeline.html companion.html about.html
  lost.html mosaic.html
)

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

  python3 - "$f" "$NAV_FILE" <<'PYEOF'
import sys, re

html_path = sys.argv[1]
nav_path  = sys.argv[2]

content = open(html_path).read()
nav_block = open(nav_path).read().strip()

new_content = re.sub(
    r'<!-- NAV:START -->.*?<!-- NAV:END -->',
    nav_block,
    content,
    flags=re.DOTALL
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

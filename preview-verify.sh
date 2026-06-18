#!/bin/bash
# preview-verify.sh — Visual verification workflow before deployment
# Verifies key pages look correct before shipping to production

set -e

echo "════════════════════════════════════════════════════════════"
echo "VISUAL VERIFICATION WORKFLOW"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "This script will:"
echo "1. Start preview server"
echo "2. Open key pages in browser"
echo "3. Prompt visual verification checklist"
echo "4. Confirm safe to deploy"
echo ""
echo "Duration: ~5 minutes"
echo ""

# Check if server already running
if lsof -i :8000 > /dev/null 2>&1; then
  echo "✅ Preview server already running on port 8000"
else
  echo "Starting preview server on port 8000..."
  cd /Users/jeffreyneumann/Documents/JFSN
  python3 -m http.server 8000 > /tmp/preview.log 2>&1 &
  sleep 2
  echo "✅ Preview server started"
fi

echo ""
echo "════════════════════════════════════════════════════════════"
echo "VISUAL VERIFICATION CHECKLIST"
echo "════════════════════════════════════════════════════════════"
echo ""

# Function to ask yes/no
verify() {
  local question="$1"
  read -p "✓ $question (y/n)? " response
  if [[ ! "$response" =~ ^[Yy]$ ]]; then
    echo "❌ Verification failed. Fix before deploying."
    exit 1
  fi
}

echo "📱 TESTING ON DESKTOP (Browser will open)"
echo ""
echo "Opening: http://localhost:8000/index.html (light mode)"
open "http://localhost:8000/index.html"
sleep 2

verify "Homepage looks good (headings dramatic, spacing generous, images framed)"

echo ""
echo "Switching to dark mode (⌘Shift+D or Ctrl+Shift+D in browser)"
sleep 3
verify "Dark mode looks intentional (warm tones, not inverted, images glow subtly)"

echo ""
echo "Opening: http://localhost:8000/archive.html"
open "http://localhost:8000/archive.html"
sleep 2

verify "Archive page looks good (section headers clear, grid spacing, medium color-coding)"

echo ""
echo "Opening single artwork: http://localhost:8000/artwork.html?id=art0953"
open "http://localhost:8000/artwork.html?id=art0953"
sleep 2

verify "Artwork page looks good (title prominent, metadata grid, image centered, related works)"

echo ""
echo "📱 TESTING ON MOBILE (iPhone 15 Pro size: 390×844)"
echo ""
echo "Resizing browser to mobile width..."
# Note: This is manual in browser
echo "Please manually resize browser to ~390px width or open in DevTools mobile view"
read -p "Press enter when ready..."

verify "Mobile homepage looks good (typography scales, spacing appropriate, touch-friendly)"
verify "Mobile archive looks good (grid responsive, spacing works)"
verify "Mobile artwork page looks good (single column, readable on small screen)"

echo ""
echo "════════════════════════════════════════════════════════════"
echo "FEATURE SPOT-CHECKS"
echo "════════════════════════════════════════════════════════════"
echo ""

verify "Dark mode toggle works (⌘Shift+D / Ctrl+Shift+D)"
verify "Search suggestions appear (start typing in search box)"
verify "Audio player appears on pages with audio (play/pause button visible)"
verify "Hover effects smooth (hover over images, cards, links)"
verify "Transitions smooth at 60fps (check DevTools Performance)"

echo ""
echo "════════════════════════════════════════════════════════════"
echo "✅ VERIFICATION COMPLETE"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "Safe to deploy? All checks passed ✓"
echo ""
echo "Next step: npm run build:css && git add ... && git commit && git push && bash deploy.sh"
echo ""

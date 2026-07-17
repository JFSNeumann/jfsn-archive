#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# init.sh — Artist Archive Setup Wizard
#
# Run this once when forking the archive for a new artist.
# Creates a fresh artist-config.json with your details, and optionally
# replaces artist-specific text in the HTML pages.
#
# Usage:
#   chmod +x init.sh
#   ./init.sh
# ─────────────────────────────────────────────────────────────────────────────

set -e

BOLD="\033[1m"
GREEN="\033[32m"
YELLOW="\033[33m"
CYAN="\033[36m"
RESET="\033[0m"

echo ""
echo -e "${BOLD}╔══════════════════════════════════════════╗${RESET}"
echo -e "${BOLD}║     Artist Archive — Setup Wizard        ║${RESET}"
echo -e "${BOLD}╚══════════════════════════════════════════╝${RESET}"
echo ""
echo "This wizard creates artist-config.json for your archive."
echo "Answer the prompts below. Press Enter to keep the default."
echo ""

# ── Gather info ───────────────────────────────────────────────────────────────
read -r -p "Artist full name          [e.g. Jane Smith]:           " ARTIST_NAME
read -r -p "Artist short name/handle  [e.g. JSMITH]:               " ARTIST_SHORT
read -r -p "Years active              [e.g. 1990–present]:         " ARTIST_ACTIVE
read -r -p "Site URL (no trailing /)  [e.g. https://janesmith.com]:" SITE_URL
read -r -p "Site title                [e.g. Jane Smith Archive]:   " SITE_TITLE

echo ""
echo -e "${CYAN}Now define your themes.${RESET}"
echo "Themes are the recurring subjects / categories in your work."
echo "Enter one per line. Press Enter on a blank line when done."
echo "(Example themes: Portraits, Landscapes, Abstractions, Installation)"
echo ""

THEMES=()
while true; do
    read -r -p "  Theme name (or Enter to finish): " THEME
    [[ -z "$THEME" ]] && break
    THEMES+=("$THEME")
done

echo ""
echo -e "${CYAN}Now define your named series.${RESET}"
echo "Named series are specific bodies of work with a defined scope."
echo "Enter one per line. Press Enter on a blank line when done."
echo "(Example: Nocturnes, The Red Suite — or leave empty if none)"
echo ""

SERIES_NAMES=()
while true; do
    read -r -p "  Series name (or Enter to finish): " SER
    [[ -z "$SER" ]] && break
    SERIES_NAMES+=("$SER")
done

# ── Build JSON ────────────────────────────────────────────────────────────────
CONFIG_FILE="artist-config.json"

# If config already exists, back it up
if [[ -f "$CONFIG_FILE" ]]; then
    BACKUP="${CONFIG_FILE%.json}_backup_$(date +%Y%m%d%H%M%S).json"
    cp "$CONFIG_FILE" "$BACKUP"
    echo ""
    echo -e "${YELLOW}Backed up existing config to: $BACKUP${RESET}"
fi

# Build themes JSON array
THEMES_JSON="["
for i in "${!THEMES[@]}"; do
    NAME="${THEMES[$i]}"
    COMMA=","
    [[ $i -eq $((${#THEMES[@]} - 1)) ]] && COMMA=""
    THEMES_JSON+="
    {
      \"name\": \"${NAME}\",
      \"display_title\": \"${NAME}\",
      \"description\": \"Description for ${NAME}. Edit in artist-config.json.\",
      \"ai_note\": \"Apply when this theme is relevant.\"
    }${COMMA}"
done
THEMES_JSON+="
  ]"

# Build series JSON array
SERIES_JSON="["
for i in "${!SERIES_NAMES[@]}"; do
    NAME="${SERIES_NAMES[$i]}"
    COMMA=","
    [[ $i -eq $((${#SERIES_NAMES[@]} - 1)) ]] && COMMA=""
    SERIES_JSON+="
    {
      \"key\": \"${NAME}\",
      \"display_title\": \"${NAME}\",
      \"description\": \"Description for ${NAME} series. Edit in artist-config.json.\",
      \"ai_rule\": \"Apply when this work belongs to the ${NAME} series.\"
    }${COMMA}"
done
SERIES_JSON+="
  ]"

cat > "$CONFIG_FILE" <<EOF
{
  "_comment": "Single source of truth for this archive. Edit this file — Python scripts and browser JS both read from it. Run 'python3 artworks/build_catalog.py' after any change.",

  "artist_name": "${ARTIST_NAME}",
  "artist_short": "${ARTIST_SHORT}",
  "artist_active": "${ARTIST_ACTIVE}",
  "site_url": "${SITE_URL}",
  "site_title": "${SITE_TITLE}",
  "license": "CC BY 4.0",
  "license_url": "https://creativecommons.org/licenses/by/4.0/",

  "themes": ${THEMES_JSON},

  "named_series": ${SERIES_JSON},

  "palette": [
    "red", "vermilion", "magenta", "pink", "orange", "yellow", "ochre", "gold",
    "silver", "iridescent", "white", "ivory", "black", "grey", "brown", "green",
    "turquoise", "blue", "ultramarine", "purple"
  ],

  "motifs": [
    "compact-disc", "vinyl-record", "warplane-topdown", "warplane-side", "chess-piece",
    "target", "bullseye", "concentric-rings", "roundel", "perforated-dots", "lace-doily",
    "crown", "cross", "numerals", "fabric-letters", "photographic-face", "american-football",
    "soccer-ball", "lips", "honeycomb", "gold-leaf", "beaded-thread", "sequins",
    "ribbon-stripe", "polka-dot", "grid", "vertical-stripes", "star", "ink-drip", "map-fragment"
  ],

  "materials": [
    "paper", "paint", "ink", "silver-foil", "gold-leaf", "cardboard", "plastic", "lace",
    "resin", "cassette", "ribbon", "keyboard", "sequins", "tape", "canvas"
  ],

  "work_types": ["collage", "sculpture", "painting", "photograph"]
}
EOF

echo ""
echo -e "${GREEN}✓ Created ${CONFIG_FILE}${RESET}"
echo ""
echo "Next steps:"
echo "  1. Edit artist-config.json to fill in theme/series descriptions and AI notes"
echo "  2. Edit about.html with your bio"
echo "  3. Drop artwork images in artworks/inbox/ and run: python3 artworks/ingest.py"
echo "  4. Set up your API key: export ANTHROPIC_API_KEY=sk-ant-..."
echo "  5. Test cataloging: python3 artworks/catalog.py --limit 5"
echo "  6. Build: python3 artworks/build_catalog.py"
echo "  7. Preview: python3 tools/utils/server.py  →  http://localhost:3900"
echo ""
echo "See README.md for the full workflow."
echo ""

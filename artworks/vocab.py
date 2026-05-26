"""
Single source of truth for JFSN archive controlled vocabularies.

Import from catalog.py, validate_catalog.py, and any future tooling.
Edit HERE only — never duplicate these lists elsewhere.
"""

VALID_PALETTE = [
    "red", "vermilion", "magenta", "pink", "orange", "yellow", "ochre", "gold",
    "silver", "iridescent", "white", "ivory", "black", "grey", "brown", "green",
    "turquoise", "blue", "ultramarine", "purple",
]

VALID_MOTIFS = [
    "compact-disc", "vinyl-record", "warplane-topdown", "warplane-side", "chess-piece",
    "target", "bullseye", "concentric-rings", "roundel", "perforated-dots", "lace-doily",
    "crown", "cross", "numerals", "fabric-letters", "photographic-face", "american-football",
    "soccer-ball", "lips", "honeycomb", "gold-leaf", "beaded-thread", "sequins",
    "ribbon-stripe", "polka-dot", "grid", "vertical-stripes", "star", "ink-drip", "map-fragment",
]

VALID_MATERIALS = [
    "paper", "paint", "ink", "silver-foil", "gold-leaf", "cardboard", "plastic", "lace",
    "resin", "cassette", "ribbon", "keyboard", "sequins", "tape", "canvas",
]

VALID_THEMES = [
    "Mr. Snowmann", "Guernica", "Aviation", "Reliquaries", "Crosses", "Targets",
    "Torsos & Faces", "Totems", "Framed", "Studio", "Gallery", "Collaboration",
    "Tracings", "Art School",
]

# DEPRECATED: "installation_view" — migrate existing records with
#   python3 artworks/repass_installation_view.py --run
# New records: use work_type "photograph" + theme "Gallery" or "Studio".
VALID_WORK_TYPES = {"collage", "sculpture", "painting", "photograph", "installation_view"}

PHOTO_TYPES = {"photograph", "installation_view"}

VALID_SERIES = {"XXIII", "Squadron", "Guernica", None}

# Kept for reference; not enforced in schema — derived from dims.json at build time.
VALID_ORIENTATIONS = {"portrait", "landscape", "square"}

# Derived sets for O(1) membership tests
PALETTE_SET   = set(VALID_PALETTE)
MOTIFS_SET    = set(VALID_MOTIFS)
MATERIALS_SET = set(VALID_MATERIALS)
THEMES_SET    = set(VALID_THEMES)

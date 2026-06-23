"""
Controlled vocabularies for the artist archive.

Loaded from artist-config.json at import time — edit that file, not this one.
Hardcoded fallbacks are provided so scripts never break if the config is missing.
"""

import json
from pathlib import Path

_CFG_PATH = Path(__file__).parent.parent / "artist-config.json"

def _load_config() -> dict:
    if _CFG_PATH.exists():
        try:
            return json.loads(_CFG_PATH.read_text())
        except Exception:
            pass
    return {}

_cfg = _load_config()

# ── Vocabularies (from config, with hardcoded fallbacks) ────────────────────

VALID_PALETTE = _cfg.get("palette") or [
    "red", "vermilion", "magenta", "pink", "orange", "yellow", "ochre", "gold",
    "silver", "iridescent", "white", "ivory", "black", "grey", "brown", "green",
    "turquoise", "blue", "ultramarine", "purple",
]

VALID_MOTIFS = _cfg.get("motifs") or [
    "compact-disc", "vinyl-record", "warplane-topdown", "warplane-side", "chess-piece",
    "target", "bullseye", "concentric-rings", "roundel", "perforated-dots", "lace-doily",
    "crown", "cross", "numerals", "fabric-letters", "photographic-face", "american-football",
    "soccer-ball", "lips", "honeycomb", "gold-leaf", "beaded-thread", "sequins",
    "ribbon-stripe", "polka-dot", "grid", "vertical-stripes", "star", "ink-drip", "map-fragment",
]

VALID_MATERIALS = _cfg.get("materials") or [
    "paper", "paint", "ink", "silver-foil", "gold-leaf", "cardboard", "plastic", "lace",
    "resin", "cassette", "ribbon", "keyboard", "sequins", "tape", "canvas",
]

VALID_THEMES = [t["name"] for t in _cfg.get("themes", [])] or [
    "Mr. Snowmann", "Crosses", "Targets",
    "Torsos & Faces", "Framed", "Studio", "Gallery", "Collaboration",
    "Tracings", "Art School",
]

# DEPRECATED: "installation_view" — the one-time migration script
# (repass_installation_view.py) already ran (6 records, 2026) and was
# removed afterward; catalog.json has zero remaining occurrences as of
# 2026-06-23. If this value ever reappears (e.g. a hand-edited sidecar),
# fix it manually: set work_type to "photograph" + theme "Gallery" or
# "Studio". New records: use work_type "photograph" directly.
_work_types = set(_cfg.get("work_types") or ["collage", "sculpture", "painting", "photograph"])
VALID_WORK_TYPES = _work_types | {"installation_view"}

PHOTO_TYPES = {"photograph", "installation_view"}

VALID_SERIES = {s["key"] for s in _cfg.get("named_series", [])} | {None} or {"Guernica", None}

# Kept for reference; not enforced in schema — derived from dims.json at build time.
VALID_ORIENTATIONS = {"portrait", "landscape", "square"}

# Derived sets for O(1) membership tests
PALETTE_SET   = set(VALID_PALETTE)
MOTIFS_SET    = set(VALID_MOTIFS)
MATERIALS_SET = set(VALID_MATERIALS)
THEMES_SET    = set(VALID_THEMES)

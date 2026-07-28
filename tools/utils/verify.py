#!/usr/bin/env python3
# ─────────────────────────────────────────────────────────────────────────────
# verify.py — the JFSN Archive conservator's inspection
#
#   Entry point:  archive verify   (see the `archive` wrapper)
#   Or directly:  python3 tools/utils/verify.py  [--full] [--json] [--quiet]
#
# Purpose (and the ONLY purpose): answer one question —
#
#     Can this archive still be trusted?
#
# This tool is READ-ONLY. It never modifies, regenerates, repairs, or infers a
# single byte of the archive. It inspects and reports. Humans decide.
#
# It reports, per archive-integrity category:
#     PASS      — no issue
#     WARNING   — a curator should look; not a threat to integrity
#     FAIL      — an objective integrity problem
#
# Human-authored omissions (themes, materials, motifs, composition, memories)
# are NEVER a FAIL. Incompleteness of authorship is not corruption of record.
# (CONSTITUTION §IX: uncertainty is data, preserved as carefully as fact.)
#
# Dependency-free (Python standard library only). Deterministic. Extensible:
# add a function decorated with @checker and it joins the inspection.
# ─────────────────────────────────────────────────────────────────────────────

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import time
from pathlib import Path

# Repo root is three levels up from tools/utils/verify.py.
ROOT = Path(__file__).resolve().parent.parent.parent

# ── Result model ─────────────────────────────────────────────────────────────

PASS, WARNING, FAIL = "PASS", "WARNING", "FAIL"
_SEVERITY = {PASS: 0, WARNING: 1, FAIL: 2}

# Report sections, in display order. (Also the JSON output's section set — kept
# stable so the JSON schema is unchanged.)
SECTIONS = [
    "Metadata Integrity",
    "Image Integrity",
    "Catalog Consistency",
    "Generated Artifacts",
    "Repository Health",
    "Informational",
]

# Presentation-only groupings for the human report. These decide how sections are
# DISPLAYED and which ones determine the archive-integrity verdict; they do not
# change any check, threshold, or the JSON output.
#
# Only these four sections determine whether the archive itself can be trusted.
ARCHIVE_INTEGRITY_SECTIONS = [
    "Metadata Integrity",
    "Image Integrity",
    "Catalog Consistency",
    "Generated Artifacts",
]
# Repository workflow state — reported separately, informational, never dilutes
# the integrity verdict.
REPOSITORY_STATE_SECTIONS = ["Repository Health"]


class Result:
    __slots__ = ("section", "level", "detail")

    def __init__(self, section: str, level: str, detail: str):
        self.section = section
        self.level = level
        self.detail = detail


# Checker registry: list of (section, function).
_CHECKERS: list[tuple[str, callable]] = []


def checker(section: str):
    """Register a checker under a report section."""
    def wrap(fn):
        _CHECKERS.append((section, fn))
        return fn
    return wrap


# ── Context: load every data source once, tolerantly ─────────────────────────

# Image tiers every cataloged work is expected to have.
TIERS = ["full", "medium", "thumbs", "mini", "micro"]

# Suffix pattern for legitimate NON-catalog image variants (hero/mobile/lcp
# renders). These are expected assets, not orphans.
VARIANT_RE = re.compile(r"-(hero|hero-m|hero-lcp|hero-lcp-m|mobile|mobile-m|m)$|_back$")

# Required fields that must be present AND non-empty on every master entry.
# Deliberately excludes human-authored fields (themes/materials/motifs/
# composition/description) — their emptiness is never a FAIL.
REQUIRED_FIELDS = ["file", "title", "year", "work_type", "orientation"]

# Files expected to exist and be non-empty for the archive to be deployable.
EXPECTED_GENERATED = [
    "config/catalog.json", "config/catalog-lite.json", "config/catalog-home.json",
    "config/dims.json", "config/changes.json", "sitemap.xml",
    "site.min.css", "sw.js", "api/v1/works.json",
]


def id_of(filename: str) -> str:
    """Canonical work ID from a filename: 'art0001.avif' -> 'art0001'."""
    return filename.rsplit(".", 1)[0]


class Context:
    def __init__(self, full: bool):
        self.full = full
        self.json_errors: list[tuple[str, str]] = []  # (path, message)

        self.catalog = self._load_json("config/catalog.json", default=[])
        self.catalog_lite = self._load_json("config/catalog-lite.json", default=[])
        self.catalog_home = self._load_json("config/catalog-home.json", default=[])
        self.dims = self._load_json("config/dims.json", default={})
        self.changes = self._load_json("config/changes.json", default=[])
        self.api_works = self._load_json("api/v1/works.json", default={})

        # Master ID set and quick lookup.
        self.ids = [id_of(e["file"]) for e in self.catalog if isinstance(e, dict) and e.get("file")]
        self.by_id = {id_of(e["file"]): e for e in self.catalog
                      if isinstance(e, dict) and e.get("file")}

    def _load_json(self, rel: str, default):
        p = ROOT / rel
        if not p.exists():
            self.json_errors.append((rel, "file missing"))
            return default
        try:
            with p.open(encoding="utf-8") as fh:
                return json.load(fh)
        except (json.JSONDecodeError, UnicodeDecodeError) as e:
            self.json_errors.append((rel, str(e)))
            return default

    def tier_ids(self, tier: str) -> set[str]:
        d = ROOT / "artworks" / tier
        if not d.is_dir():
            return set()
        return {id_of(f.name) for f in d.glob("*.avif")}


# ── Metadata Integrity ───────────────────────────────────────────────────────

@checker("Metadata Integrity")
def check_json_validity(ctx: Context):
    """Every JSON file in the archive must parse."""
    out = []
    # Report load-time errors from context (the known/central files).
    for rel, msg in ctx.json_errors:
        out.append(Result("Metadata Integrity", FAIL, f"{rel}: {msg}"))
    # Sweep the whole tree (excluding node_modules/.git) for any other JSON.
    checked = 0
    skip = {"node_modules", ".git", ".netlify"}
    for p in ROOT.rglob("*.json"):
        if any(part in skip for part in p.parts):
            continue
        checked += 1
        try:
            with p.open(encoding="utf-8") as fh:
                json.load(fh)
        except (json.JSONDecodeError, UnicodeDecodeError) as e:
            out.append(Result("Metadata Integrity", FAIL,
                              f"{p.relative_to(ROOT)}: {e}"))
    if not out:
        out.append(Result("Metadata Integrity", PASS,
                          f"All {checked} JSON files parse cleanly"))
    return out


@checker("Metadata Integrity")
def check_required_fields(ctx: Context):
    """Structural fields present and non-empty (never human-authored fields)."""
    missing = []
    for e in ctx.catalog:
        if not isinstance(e, dict):
            missing.append(("(non-object entry)", "entire entry"))
            continue
        wid = id_of(e.get("file", "?"))
        for f in REQUIRED_FIELDS:
            v = e.get(f)
            if v is None or (isinstance(v, str) and not v.strip()):
                missing.append((wid, f))
    if missing:
        sample = ", ".join(f"{w}:{f}" for w, f in missing[:6])
        return [Result("Metadata Integrity", FAIL,
                       f"{len(missing)} required-field problem(s) — e.g. {sample}")]
    return [Result("Metadata Integrity", PASS,
                   f"All {len(ctx.catalog)} entries carry required fields "
                   f"({', '.join(REQUIRED_FIELDS)})")]


@checker("Metadata Integrity")
def check_duplicate_ids(ctx: Context):
    """No work ID may appear twice in the master catalog."""
    seen, dups = set(), []
    for wid in ctx.ids:
        if wid in seen:
            dups.append(wid)
        seen.add(wid)
    if dups:
        return [Result("Metadata Integrity", FAIL,
                       f"Duplicate IDs: {', '.join(sorted(set(dups)))}")]
    return [Result("Metadata Integrity", PASS,
                   f"{len(seen)} unique work IDs, no duplicates")]


@checker("Metadata Integrity")
def check_duplicate_filenames(ctx: Context):
    """No filename may appear twice in the master catalog."""
    seen, dups = set(), []
    for e in ctx.catalog:
        f = e.get("file") if isinstance(e, dict) else None
        if not f:
            continue
        if f in seen:
            dups.append(f)
        seen.add(f)
    if dups:
        return [Result("Metadata Integrity", FAIL,
                       f"Duplicate filenames: {', '.join(sorted(set(dups)))}")]
    return [Result("Metadata Integrity", PASS,
                   f"{len(seen)} unique filenames, no duplicates")]


@checker("Metadata Integrity")
def check_schema_version(ctx: Context):
    """schema_version should be consistent across entries (drift is a warning)."""
    versions = {}
    for wid, e in ctx.by_id.items():
        v = e.get("schema_version")
        versions.setdefault(v, 0)
        versions[v] += 1
    present = {k: v for k, v in versions.items() if k is not None}
    if not present:
        return [Result("Metadata Integrity", WARNING,
                       "No schema_version field present on catalog entries")]
    if len(present) > 1:
        return [Result("Metadata Integrity", WARNING,
                       "Mixed schema_version values: "
                       + ", ".join(f"{k}×{n}" for k, n in sorted(present.items(), key=lambda kv: str(kv[0]))))]
    only = next(iter(present))
    return [Result("Metadata Integrity", PASS,
                   f"schema_version uniform (v{only}) across catalog")]


# ── Image Integrity ──────────────────────────────────────────────────────────

def _valid_avif(path: Path) -> bool:
    """Cheap container check: an AVIF begins with an ftyp box branded 'avif'."""
    try:
        head = path.read_bytes()[:32] if False else _read_head(path, 32)
    except OSError:
        return False
    return len(head) >= 12 and head[4:8] == b"ftyp" and b"avif" in head[:24]


def _read_head(path: Path, n: int) -> bytes:
    with path.open("rb") as fh:
        return fh.read(n)


@checker("Image Integrity")
def check_tier_presence(ctx: Context):
    """Every cataloged work must have an image in every expected tier."""
    out, any_missing = [], False
    for tier in TIERS:
        present = ctx.tier_ids(tier)
        if not present:
            out.append(Result("Image Integrity", FAIL,
                              f"Tier '{tier}' directory missing or empty"))
            any_missing = True
            continue
        missing = [w for w in ctx.ids if w not in present]
        if missing:
            any_missing = True
            out.append(Result("Image Integrity", FAIL,
                              f"Tier '{tier}': {len(missing)} cataloged work(s) "
                              f"have no image — e.g. {', '.join(missing[:6])}"))
    if not any_missing:
        out.append(Result("Image Integrity", PASS,
                          f"All {len(ctx.ids)} works present in every tier "
                          f"({', '.join(TIERS)})"))
    return out


@checker("Image Integrity")
def check_orphan_images(ctx: Context):
    """Images with no catalog entry — excluding known hero/mobile variants."""
    catset = set(ctx.ids)
    orphans = []
    for tier in TIERS:
        for wid in ctx.tier_ids(tier):
            base = VARIANT_RE.sub("", wid)
            if base in catset:
                continue          # a recognized render variant of a real work
            if wid in catset:
                continue
            orphans.append(f"{tier}/{wid}")
    if orphans:
        return [Result("Image Integrity", WARNING,
                       f"{len(orphans)} image(s) with no catalog entry "
                       f"(not variants) — e.g. {', '.join(sorted(orphans)[:6])}")]
    return [Result("Image Integrity", PASS,
                   "No orphan images (every image maps to a cataloged work "
                   "or a recognized render variant)")]


@checker("Image Integrity")
def check_dimensions(ctx: Context):
    """Every work must have positive dimensions recorded in dims.json."""
    missing, bad = [], []
    for wid in ctx.ids:
        d = ctx.dims.get(wid)
        if d is None:
            missing.append(wid)
        elif (not isinstance(d, (list, tuple)) or len(d) != 2
              or not all(isinstance(x, int) and x > 0 for x in d)):
            bad.append(f"{wid}={d}")
    out = []
    if missing:
        out.append(Result("Image Integrity", FAIL,
                          f"{len(missing)} work(s) missing dimensions — "
                          f"e.g. {', '.join(missing[:6])}"))
    if bad:
        out.append(Result("Image Integrity", FAIL,
                          f"{len(bad)} work(s) with invalid dimensions — "
                          f"e.g. {', '.join(bad[:6])}"))
    if not out:
        out.append(Result("Image Integrity", PASS,
                          f"All {len(ctx.ids)} works have valid dimensions"))
    return out


@checker("Image Integrity")
def check_image_corruption(ctx: Context):
    """Container-magic decode. Default: thumbs tier. --full: every tier.
    Corruption (bad magic) is reported SEPARATELY from absence."""
    tiers = TIERS if ctx.full else ["thumbs"]
    corrupt, scanned = [], 0
    for tier in tiers:
        d = ROOT / "artworks" / tier
        if not d.is_dir():
            continue
        for wid in ctx.ids:
            p = d / f"{wid}.avif"
            if not p.exists():
                continue  # absence is check_tier_presence's job, not this one
            scanned += 1
            if not _valid_avif(p):
                corrupt.append(f"{tier}/{wid}")
    scope = "all tiers" if ctx.full else "thumbs tier"
    if corrupt:
        return [Result("Image Integrity", FAIL,
                       f"{len(corrupt)} image(s) failed AVIF container check "
                       f"({scope}) — e.g. {', '.join(corrupt[:6])}")]
    return [Result("Image Integrity", PASS,
                   f"{scanned} image(s) pass AVIF container check ({scope}); "
                   f"pass --full to decode-check every tier")]


# ── Catalog Consistency ──────────────────────────────────────────────────────

def _ids_from(records) -> set[str]:
    return {id_of(e["file"]) for e in records
            if isinstance(e, dict) and e.get("file")}


@checker("Catalog Consistency")
def check_lite_consistency(ctx: Context):
    """catalog-lite must cover exactly the master ID set."""
    lite = _ids_from(ctx.catalog_lite)
    master = set(ctx.ids)
    missing, extra = master - lite, lite - master
    if missing or extra:
        parts = []
        if missing:
            parts.append(f"{len(missing)} in master not in lite")
        if extra:
            parts.append(f"{len(extra)} in lite not in master")
        return [Result("Catalog Consistency", FAIL,
                       "catalog-lite.json drift: " + "; ".join(parts))]
    return [Result("Catalog Consistency", PASS,
                   f"catalog-lite.json matches master ({len(lite)} works)")]


@checker("Catalog Consistency")
def check_home_consistency(ctx: Context):
    """catalog-home is a curated subset; its IDs must exist in master."""
    home = _ids_from(ctx.catalog_home)
    master = set(ctx.ids)
    dangling = home - master
    if dangling:
        return [Result("Catalog Consistency", FAIL,
                       f"catalog-home.json references {len(dangling)} unknown "
                       f"work(s): {', '.join(sorted(dangling)[:6])}")]
    return [Result("Catalog Consistency", PASS,
                   f"catalog-home.json subset valid ({len(home)} works, all in master)")]


@checker("Catalog Consistency")
def check_api_consistency(ctx: Context):
    """api/v1/works.json and per-work api files must match master."""
    out = []
    works = ctx.api_works.get("works") if isinstance(ctx.api_works, dict) else None
    if works is None:
        out.append(Result("Catalog Consistency", WARNING,
                          "api/v1/works.json has no 'works' array to verify"))
    else:
        api_ids = _ids_from(works)
        master = set(ctx.ids)
        if api_ids != master:
            miss, extra = master - api_ids, api_ids - master
            out.append(Result("Catalog Consistency", FAIL,
                              f"api/v1/works.json drift: {len(miss)} missing, "
                              f"{len(extra)} extra vs master"))
        else:
            declared = ctx.api_works.get("count")
            if declared is not None and declared != len(master):
                out.append(Result("Catalog Consistency", WARNING,
                                  f"api/v1/works.json count={declared} but "
                                  f"{len(master)} works present"))
            else:
                out.append(Result("Catalog Consistency", PASS,
                                  f"api/v1/works.json matches master "
                                  f"({len(api_ids)} works)"))
    # Per-work API files.
    api_dir = ROOT / "api" / "v1" / "works"
    if api_dir.is_dir():
        files = {id_of(p.name) for p in api_dir.glob("*.json")}
        master = set(ctx.ids)
        miss, extra = master - files, files - master
        if miss or extra:
            out.append(Result("Catalog Consistency", FAIL,
                              f"api/v1/works/*.json drift: {len(miss)} missing, "
                              f"{len(extra)} extra vs master"))
        else:
            out.append(Result("Catalog Consistency", PASS,
                              f"api/v1/works/ has one file per work ({len(files)})"))
    return out


@checker("Catalog Consistency")
def check_perartwork_consistency(ctx: Context):
    """artworks/full/*.json projections must agree with master on shared fields."""
    d = ROOT / "artworks" / "full"
    if not d.is_dir():
        return [Result("Catalog Consistency", WARNING,
                       "artworks/full/ directory missing")]
    files = {id_of(p.name): p for p in d.glob("*.json")}
    master = set(ctx.ids)
    miss = master - set(files)
    if miss:
        return [Result("Catalog Consistency", FAIL,
                       f"{len(miss)} work(s) have no artworks/full/*.json — "
                       f"e.g. {', '.join(sorted(miss)[:6])}")]
    # Field-level agreement on the fields the projection carries.
    mismatches = []
    check_fields = ("title", "year", "work_type", "orientation", "file")
    for wid in ctx.ids:
        try:
            with files[wid].open(encoding="utf-8") as fh:
                proj = json.load(fh)
        except (json.JSONDecodeError, OSError):
            continue  # JSON validity check owns parse failures
        m = ctx.by_id[wid]
        for f in check_fields:
            if f in proj and proj[f] != m.get(f):
                mismatches.append(f"{wid}:{f}")
    if mismatches:
        return [Result("Catalog Consistency", WARNING,
                       f"{len(mismatches)} per-artwork field mismatch(es) vs "
                       f"master — e.g. {', '.join(mismatches[:6])}")]
    return [Result("Catalog Consistency", PASS,
                   f"All {len(files)} artworks/full/*.json agree with master")]


@checker("Catalog Consistency")
def check_favorites(ctx: Context):
    """Favorites are flagged in master; verify the flag survives into projections."""
    fav_master = {wid for wid, e in ctx.by_id.items() if e.get("favorite")}
    if not fav_master:
        return [Result("Catalog Consistency", WARNING,
                       "No works flagged 'favorite' in master catalog")]
    lite_fav = {id_of(e["file"]) for e in ctx.catalog_lite
                if isinstance(e, dict) and e.get("favorite") and e.get("file")}
    lost = fav_master - lite_fav
    if lost:
        return [Result("Catalog Consistency", WARNING,
                       f"{len(lost)} favorite(s) not marked favorite in "
                       f"catalog-lite: {', '.join(sorted(lost)[:6])}")]
    return [Result("Catalog Consistency", PASS,
                   f"{len(fav_master)} favorites consistent across catalog & lite")]


# ── Generated Artifacts ──────────────────────────────────────────────────────

@checker("Generated Artifacts")
def check_sitemap(ctx: Context):
    """sitemap.xml artwork-page URLs must resolve to real files. Drift only."""
    p = ROOT / "sitemap.xml"
    if not p.exists():
        return [Result("Generated Artifacts", FAIL, "sitemap.xml missing")]
    text = p.read_text(encoding="utf-8")
    locs = re.findall(r"<loc>\s*([^<]+?)\s*</loc>", text)
    broken = []
    for url in locs:
        path = re.sub(r"^https?://[^/]+/", "", url).strip()
        if not path or path.endswith("/"):
            continue  # site root / section index
        # Only verify artwork-page URLs; other pages are checked by pre-deploy.
        if "artworks/pages/" in path:
            if not (ROOT / path).exists():
                broken.append(path)
    if broken:
        return [Result("Generated Artifacts", FAIL,
                       f"{len(broken)} sitemap artwork URL(s) resolve to no file "
                       f"— e.g. {', '.join(broken[:4])}")]
    return [Result("Generated Artifacts", PASS,
                   f"sitemap.xml: {len(locs)} URLs, all artwork pages resolve")]


@checker("Generated Artifacts")
def check_artwork_pages(ctx: Context):
    """Every cataloged work should have a rendered page."""
    d = ROOT / "artworks" / "pages"
    if not d.is_dir():
        return [Result("Generated Artifacts", FAIL,
                       "artworks/pages/ directory missing")]
    pages = {id_of(p.name) for p in d.glob("*.html")}
    missing = [w for w in ctx.ids if w not in pages]
    if missing:
        return [Result("Generated Artifacts", FAIL,
                       f"{len(missing)} work(s) have no rendered page — "
                       f"e.g. {', '.join(missing[:6])}")]
    return [Result("Generated Artifacts", PASS,
                   f"All {len(ctx.ids)} works have a rendered page")]


@checker("Generated Artifacts")
def check_changes(ctx: Context):
    """changes.json entries must reference real works. Drift only."""
    if not isinstance(ctx.changes, list):
        return [Result("Generated Artifacts", WARNING,
                       "changes.json is not a list; skipping reference check")]
    master = set(ctx.ids)
    dangling = []
    for e in ctx.changes:
        f = e.get("file") if isinstance(e, dict) else None
        if f and id_of(f) not in master:
            dangling.append(id_of(f))
    if dangling:
        return [Result("Generated Artifacts", WARNING,
                       f"changes.json references {len(dangling)} unknown work(s): "
                       f"{', '.join(sorted(set(dangling))[:6])}")]
    return [Result("Generated Artifacts", PASS,
                   f"changes.json: {len(ctx.changes)} entries, all reference real works")]


# ── Repository Health ────────────────────────────────────────────────────────

@checker("Repository Health")
def check_expected_files(ctx: Context):
    """The files a deploy depends on must exist and be non-empty."""
    missing = [f for f in EXPECTED_GENERATED
               if not (ROOT / f).is_file() or (ROOT / f).stat().st_size == 0]
    if missing:
        return [Result("Repository Health", FAIL,
                       f"Expected generated file(s) missing/empty: "
                       f"{', '.join(missing)}")]
    return [Result("Repository Health", PASS,
                   f"All {len(EXPECTED_GENERATED)} expected generated files present")]


@checker("Repository Health")
def check_cache_version(ctx: Context):
    """Service-worker CACHE_V should follow the jfsn-TIMESTAMP convention."""
    sw = ROOT / "sw.js"
    if not sw.exists():
        return [Result("Repository Health", FAIL, "sw.js missing")]
    if re.search(r"CACHE_V\s*=\s*'jfsn-\d{10}'", sw.read_text(encoding="utf-8")):
        return [Result("Repository Health", PASS,
                       "sw.js CACHE_V follows jfsn-TIMESTAMP convention")]
    return [Result("Repository Health", WARNING,
                   "sw.js CACHE_V not in expected jfsn-TIMESTAMP format")]


@checker("Repository Health")
def check_working_tree(ctx: Context):
    """A dirty tree mid-session is normal, so this is a WARNING, not a FAIL.
    pre-deploy-check.sh remains the hard gate that blocks a dirty deploy."""
    try:
        out = subprocess.run(["git", "status", "--porcelain"], cwd=ROOT,
                             capture_output=True, text=True, timeout=15)
    except (OSError, subprocess.SubprocessError):
        return [Result("Repository Health", WARNING,
                       "git not available; working-tree cleanliness unknown")]
    if out.returncode != 0:
        return [Result("Repository Health", WARNING,
                       "not a git repository; working-tree status unknown")]
    changed = [ln for ln in out.stdout.splitlines() if ln.strip()]
    if changed:
        return [Result("Repository Health", WARNING,
                       f"{len(changed)} uncommitted change(s); commit before "
                       f"deploy (pre-deploy-check.sh enforces this)")]
    return [Result("Repository Health", PASS, "Working tree clean")]


# ── Informational (never fails) ──────────────────────────────────────────────

@checker("Informational")
def check_vocabulary(ctx: Context):
    """Surface possible vocabulary drift in controlled fields. Review items only."""
    out = []
    for field in ("work_type", "orientation", "series"):
        values = {}
        for e in ctx.by_id.values():
            v = e.get(field)
            if isinstance(v, str) and v.strip():
                values[v] = values.get(v, 0) + 1
        if not values:
            continue
        # Capitalization / whitespace collisions on the same lowered token.
        lowered = {}
        for v in values:
            lowered.setdefault(v.strip().lower(), set()).add(v)
        clusters = {k: vs for k, vs in lowered.items() if len(vs) > 1}
        if clusters:
            ex = "; ".join("/".join(sorted(vs)) for vs in list(clusters.values())[:3])
            out.append(Result("Informational", WARNING,
                              f"{field}: possible capitalization/synonym drift — {ex}"))
        else:
            out.append(Result("Informational", PASS,
                              f"{field}: {len(values)} distinct value(s), no obvious drift"))
    return out


@checker("Informational")
def check_year_bounds(ctx: Context):
    """Years outside a plausible span are worth a human glance. Never a FAIL."""
    odd = []
    for wid, e in ctx.by_id.items():
        y = e.get("year")
        if isinstance(y, int) and not (1970 <= y <= time.localtime().tm_year + 1):
            odd.append(f"{wid}={y}")
    if odd:
        return [Result("Informational", WARNING,
                       f"{len(odd)} work(s) with an unusual year — "
                       f"e.g. {', '.join(odd[:6])}")]
    return [Result("Informational", PASS,
                   "All years fall within the archive's plausible span")]


# ── Runner & reporting ───────────────────────────────────────────────────────

def run(ctx: Context) -> list[Result]:
    results = []
    for _section, fn in _CHECKERS:
        try:
            results.extend(fn(ctx))
        except Exception as e:  # a checker must never abort the inspection
            results.append(Result(_section_of(fn), FAIL,
                                  f"checker '{fn.__name__}' errored: {e}"))
    return results


def _section_of(fn) -> str:
    for section, f in _CHECKERS:
        if f is fn:
            return section
    return "Informational"


def section_level(results: list[Result], section: str) -> str:
    levels = [r.level for r in results if r.section == section]
    if not levels:
        return PASS
    return max(levels, key=lambda l: _SEVERITY[l])


def overall_level(results: list[Result]) -> str:
    if not results:
        return PASS
    return max((r.level for r in results), key=lambda l: _SEVERITY[l])


def archive_integrity_level(results: list[Result]) -> str:
    """The trust verdict — computed ONLY from the four integrity sections.
    Repository workflow state can never change this answer."""
    levels = [r.level for r in results
              if r.section in ARCHIVE_INTEGRITY_SECTIONS]
    if not levels:
        return PASS
    return max(levels, key=lambda l: _SEVERITY[l])


def _working_tree_state(repo_results: list[Result]) -> str:
    """Derive a state word for display from the existing working-tree result.
    Presentation only — reads results already produced, runs no new check."""
    for r in repo_results:
        d = r.detail.lower()
        if "working tree clean" in d:
            return "CLEAN"
        if "uncommitted" in d:
            return "DIRTY"
        if "not a git repository" in d or "git not available" in d:
            return "UNKNOWN"
    return "UNKNOWN"


def _color(level: str, text: str, enabled: bool) -> str:
    if not enabled:
        return text
    c = {PASS: "\033[0;32m", WARNING: "\033[1;33m", FAIL: "\033[0;31m"}[level]
    return f"{c}{text}\033[0m"


def print_report(results: list[Result], elapsed: float, color: bool, quiet: bool):
    print()
    print("  JFSN Archive — Conservator's Inspection")
    print("  " + "─" * 44)
    print()

    # ── Archive Integrity — the trust question ──────────────────────────────
    print("  Archive Integrity")
    print("  " + "-" * 17)
    for section in ARCHIVE_INTEGRITY_SECTIONS:
        lvl = section_level(results, section)
        dots = "." * max(4, 26 - len(section))
        print(f"  {section} {dots} {_color(lvl, lvl, color)}")
    integrity = archive_integrity_level(results)
    print()
    print(f"  Overall Archive Integrity: {_color(integrity, integrity, color)}")

    # Detail for integrity results that are not PASS.
    integ_issues = [r for r in results
                    if r.section in ARCHIVE_INTEGRITY_SECTIONS and r.level != PASS]
    if integ_issues:
        print()
        print("  Integrity details:")
        for r in integ_issues:
            mark = "FAIL" if r.level == FAIL else "warn"
            print(f"    [{_color(r.level, mark, color)}] {r.section}: {r.detail}")
    print()

    # ── Repository State — workflow, informational only ─────────────────────
    repo_results = [r for r in results
                    if r.section in REPOSITORY_STATE_SECTIONS]
    print("  Repository State  (informational — does not affect integrity)")
    print("  " + "-" * 16)
    working_tree = _working_tree_state(repo_results)
    # "Ready" here means the deployable artifacts exist; a dirty tree does not
    # make it "not ready" — pre-deploy-check.sh is the gate that blocks a dirty
    # deploy. Derived from existing results; no new check is run.
    deploy = "NOT READY" if any(r.level == FAIL for r in repo_results) else "READY"
    for label, value in (("Working Tree", working_tree),
                         ("Deployment Readiness", deploy)):
        dots = "." * max(4, 26 - len(label))
        print(f"  {label} {dots} {value}")
    for r in repo_results:
        if r.level != PASS:
            mark = "FAIL" if r.level == FAIL else "note"
            print(f"    [{_color(r.level, mark, color)}] {r.detail}")
    print()

    # ── Informational — curatorial review, report-only ──────────────────────
    info_issues = [r for r in results
                   if r.section == "Informational" and r.level != PASS]
    if info_issues:
        print("  Informational  (curatorial review — never affects integrity)")
        print("  " + "-" * 15)
        for r in info_issues:
            print(f"    [{_color(WARNING, 'note', color)}] {r.detail}")
        print()

    # ── Archive Trust Summary ───────────────────────────────────────────────
    fails = sum(1 for r in results if r.level == FAIL)
    warns = sum(1 for r in results if r.level == WARNING)
    print("  Archive Trust Summary")
    print("  " + "-" * 21)
    print(f"  Failures: {fails}")
    print(f"  Warnings: {warns}")
    print(f"  Archive Integrity: {_color(integrity, integrity, color)}")
    print()

    if integrity == PASS:
        print("  This archive remains internally consistent and suitable for")
        print("  long-term preservation.")
    elif integrity == WARNING:
        print("  No integrity failures — but review the integrity warnings above.")
        print("  These are curator items, not corruption of the record.")
    else:
        print("  Integrity FAILURES detected. The archive is NOT verified.")
        print("  Resolve the failures above before deploying or trusting a backup.")
    print()
    print(f"  Inspected in {elapsed:.2f}s.")
    print()


def main(argv=None):
    ap = argparse.ArgumentParser(
        description="Read-only integrity inspection of the JFSN Archive.")
    ap.add_argument("--full", action="store_true",
                    help="decode-check every image tier (slower)")
    ap.add_argument("--json", action="store_true",
                    help="emit machine-readable JSON instead of a report")
    ap.add_argument("--quiet", action="store_true",
                    help="suppress ANSI color")
    args = ap.parse_args(argv)

    start = time.perf_counter()
    ctx = Context(full=args.full)
    results = run(ctx)
    elapsed = time.perf_counter() - start

    if args.json:
        payload = {
            "overall": overall_level(results),
            "elapsed_seconds": round(elapsed, 3),
            "sections": {s: section_level(results, s) for s in SECTIONS},
            "results": [{"section": r.section, "level": r.level,
                         "detail": r.detail} for r in results],
        }
        print(json.dumps(payload, indent=2))
    else:
        color = sys.stdout.isatty() and not args.quiet
        print_report(results, elapsed, color, args.quiet)

    return 1 if overall_level(results) == FAIL else 0


if __name__ == "__main__":
    sys.exit(main())

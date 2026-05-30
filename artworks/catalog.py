#!/usr/bin/env python3
"""
Artist Archive Catalog Generator
==================================

Generates JSON sidecars for every AVIF in /full/ using the Anthropic API.
Resumable: skips any file that already has a .json sidecar.

Vocabulary and artist info are read from artist-config.json at the project root.
Edit that file to customize themes, series, and other settings for your archive.

Setup
-----
    pip install --break-system-packages anthropic pillow pillow-avif-plugin
    export ANTHROPIC_API_KEY=sk-ant-...   # get one at https://console.anthropic.com

Run
---
    python3 catalog.py              # process everything missing
    python3 catalog.py --limit 10   # test on 10 first
    python3 catalog.py --workers 8  # faster if your API tier allows

Cost: roughly $0.01–0.02 per image on first run. Prompt caching cuts ~80% off the
system-prompt tokens on every image after the first, so repeat runs (or large batches)
cost significantly less.
"""

import os, json, base64, io, sys, argparse, time, random
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import Any

try:
    from PIL import Image
    import pillow_avif  # noqa: F401  registers AVIF
except ImportError:
    sys.exit("Run: pip install --break-system-packages pillow pillow-avif-plugin")

try:
    from anthropic import Anthropic
except ImportError:
    sys.exit("Run: pip install --break-system-packages anthropic")

FULL_DIR  = Path(__file__).parent / "full"
LOGS_DIR  = FULL_DIR.parent / "logs"
ERROR_LOG = LOGS_DIR / "catalog_errors.jsonl"
MODEL = "claude-sonnet-4-6"
MAX_RETRIES = 3

# Single required-field set for all work types.
# motifs / materials / composition are optional for photograph + installation_view
# but must be present (may be empty) for collage / sculpture / painting.
from vocab import VALID_WORK_TYPES, PHOTO_TYPES, VALID_SERIES

REQUIRED_FIELDS_ALL  = {"file", "title", "year", "work_type",
                        "description", "palette", "themes", "series", "keywords",
                        "featured", "schema_version"}
REQUIRED_FIELDS_FULL = {"motifs", "materials", "composition"} | REQUIRED_FIELDS_ALL

# ── Load artist-config.json ─────────────────────────────────────────────────
_CFG_PATH = Path(__file__).parent.parent / "artist-config.json"
_cfg: dict = {}
if _CFG_PATH.exists():
    try:
        _cfg = json.loads(_CFG_PATH.read_text())
    except Exception as e:
        print(f"Warning: could not parse artist-config.json: {e}", file=sys.stderr)

def _build_system_prompt() -> str:
    artist_name  = _cfg.get("artist_short") or _cfg.get("artist_name", "the artist")
    active       = _cfg.get("artist_active", "active")
    themes       = _cfg.get("themes", [])
    named_series = _cfg.get("named_series", [])
    palette      = _cfg.get("palette", [])
    motifs       = _cfg.get("motifs", [])
    materials    = _cfg.get("materials", [])

    # ── Controlled Themes block ──────────────────────────────────────────────
    theme_lines = []
    for i, t in enumerate(themes):
        name = t["name"]
        note = t.get("ai_note", "")
        if i == 0:
            theme_lines.append(f"{name:<16}— {note}")
        else:
            theme_lines.append(f"{name:<16}— {note}")
    themes_block = "\n".join(theme_lines)

    # ── Series block ─────────────────────────────────────────────────────────
    series_keys   = [s["key"]   for s in named_series]
    series_values = []
    for s in named_series:
        series_values.append(
            f'  "{s["key"]}"  — {s["ai_rule"]}'
        )
    null_note = '  null        — All other works. Use null, not "" or "None".'
    series_values.append(null_note)
    series_block = "\n".join(series_values)

    # ── Named-series note in Themes block ────────────────────────────────────
    series_theme_note = ""
    if named_series:
        series_key_list = ", ".join(f'"{s["key"]}"' for s in named_series)
        series_theme_note = (
            f'\nNOTE: Do NOT add {series_key_list} as a theme — that content belongs in the\n'
            f'      series field only, never in themes.'
        )

    return f"""You are cataloging an art archive of mixed-media collages, sculptures, photographs, and installation views by the artist {artist_name} ({active}).

Return ONLY a JSON object. No prose, no code fences, no markdown.

════════════════════════════════════════════════
SCHEMA
════════════════════════════════════════════════
{{
  "file": "art0XXX.avif",
  "title": "...",
  "year": <4-digit integer or null>,
  "work_type": "collage" | "sculpture" | "painting" | "photograph",
  "description": "<see DESCRIPTION RULE>",
  "palette": [3–5 items from CONTROLLED PALETTE],
  "motifs": [items from CONTROLLED MOTIFS],
  "materials": [items from CONTROLLED MATERIALS],
  "composition": "<short phrase, max 8 words>",
  "themes": [up to 4 items from CONTROLLED THEMES],
  "series": "<named series or null — see SERIES RULE>",
  "keywords": [2–4 specific long-tail search terms],
  "featured": false,
  "schema_version": "1"
}}

For photograph records (studio shots, gallery views, installation images): motifs,
materials, and composition are optional — include them only when clearly identifiable.
Use [] for motifs/materials and omit composition if nothing meaningful applies.
Use themes to flag context: "Studio" for studio shots, "Gallery" for exhibition views.

════════════════════════════════════════════════
YEAR RULE
════════════════════════════════════════════════
Extract year only from direct visual evidence: a date printed or written on the
work itself, a visible timestamp, or a clearly dated label in frame.
Do not infer from style, aging, or context. Use null when uncertain.

════════════════════════════════════════════════
CONTROLLED PALETTE
════════════════════════════════════════════════
{", ".join(palette)}

Use 3–5 terms. List most dominant colors first.

════════════════════════════════════════════════
CONTROLLED MOTIFS
════════════════════════════════════════════════
{", ".join(motifs)}

Only list motifs that are clearly and unambiguously present. If uncertain, omit.
Use [] if none apply.

════════════════════════════════════════════════
CONTROLLED MATERIALS
════════════════════════════════════════════════
{", ".join(materials)}

Only list materials that are clearly identifiable from the image.
Use [] if none can be determined.

════════════════════════════════════════════════
CONTROLLED THEMES  (max 4, apply in priority order shown)
════════════════════════════════════════════════
{themes_block}{series_theme_note}

════════════════════════════════════════════════
SERIES RULE
════════════════════════════════════════════════
series identifies membership in a named body of work. Use one of these values
or null — do not invent new series names:

{series_block}

════════════════════════════════════════════════
TITLE RULE
════════════════════════════════════════════════
Use an evocative title (max 4 words) when the image clearly suggests one.
Otherwise: "Untitled (Brief Subject)" — e.g., "Untitled (Collage with Target)".

════════════════════════════════════════════════
DESCRIPTION RULE
════════════════════════════════════════════════
Two sentences. Maximum 55 words total. Catalog tone: precise, objective, no editorializing.

HARD RULE: Your first word must NOT be "A", "An", or "The". Open with a noun,
adjective, number, gerund, or cross-reference word. This rule is enforced — a
description beginning with "A", "An", or "The" will be rejected and regenerated.

Do NOT use evaluative language: striking, powerful, remarkable, compelling, dynamic.
Describe only what is visually present.


════════════════════════════════════════════════
FIELD RULES
════════════════════════════════════════════════
• featured: always false. The artist marks these manually.
• schema_version: always "1".
• year: integer if a date is printed/written/labeled on the work itself. Otherwise null.
  Do not infer from style, aging, or context.
• keywords: must be specific to THIS work. Do not use broad categorical terms that
  apply to dozens of works (e.g. panoramic, saturated, minimal, text, street,
  narrative, metallic, maximalist). Use terms that distinguish this work from others
  in the archive: subject matter, technique variant, named reference, visual anomaly.
• Use [] for any array field with no applicable values — never omit the field.
• Do not invent terms outside the controlled lists.
• Return only the JSON object — no explanation, no wrapper."""

SYSTEM_PROMPT = _build_system_prompt()

# Wrapped for prompt caching — the system prompt is identical for every image,
# so after the first API call it's served from cache at ~10% of normal token cost.
SYSTEM_PROMPT_CACHED = [
    {
        "type": "text",
        "text": SYSTEM_PROMPT,
        "cache_control": {"type": "ephemeral"},
    }
]


def encode_image(avif_path: Path) -> str:
    img = Image.open(avif_path).convert("RGB")
    img.thumbnail((800, 800))
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=80)
    return base64.standard_b64encode(buf.getvalue()).decode("utf-8")

def parse_json_response(text: str) -> dict:
    text = text.strip()
    if text.startswith("```"):
        text = text.strip("`")
        if text.lower().startswith("json"):
            text = text.split("\n", 1)[1] if "\n" in text else text[4:]
        text = text.strip()
        if text.endswith("```"):
            text = text[:-3].strip()
    return json.loads(text)

def validate_record(rec: dict) -> str | None:
    """Return an error string if the record is invalid, else None."""
    wt = rec.get("work_type", "")
    if wt not in VALID_WORK_TYPES:
        return f"invalid work_type: {wt!r}"

    # Required fields: core always; full-media fields for non-photo types
    required = REQUIRED_FIELDS_ALL if wt in PHOTO_TYPES else REQUIRED_FIELDS_FULL
    missing = required - rec.keys()
    if missing:
        return f"missing fields: {sorted(missing)}"

    year = rec.get("year")
    if year is not None and not (isinstance(year, int) and 1900 <= year <= 2100):
        return f"invalid year: {year!r}"

    # Series
    if "series" in rec:
        s = rec.get("series")
        if s not in VALID_SERIES:
            return f"invalid series: {s!r} — must be 'Guernica' or null"

    # Palette must have at least 1 item
    pal = rec.get("palette", [])
    if not isinstance(pal, list) or len(pal) < 1:
        return f"palette must have at least 1 item"

    # Keywords: 2–4 items
    kw = rec.get("keywords", [])
    if not isinstance(kw, list) or len(kw) < 2:
        return f"keywords must have at least 2 items (got {len(kw)})"
    if len(kw) > 4:
        return f"keywords must have at most 4 items (got {len(kw)})"

    # Description opener: must not start with A / An / The
    desc = rec.get("description", "")
    first_word = desc.split()[0].rstrip(",") if desc.split() else ""
    if first_word.lower() in {"a", "an", "the"}:
        return f"description must not open with {first_word!r} — use a noun, adjective, number, or gerund"

    return None

def log_error(fname: str, reason: str) -> None:
    LOGS_DIR.mkdir(exist_ok=True)
    entry = {"ts": time.strftime('%Y-%m-%dT%H:%M:%S'), "file": fname, "reason": reason}
    with ERROR_LOG.open("a") as f:
        f.write(json.dumps(entry) + "\n")

def process_one(client: Anthropic, avif_path: Path) -> tuple[str, str, dict]:
    fname = avif_path.name
    sidecar = avif_path.with_suffix(".json")
    if sidecar.exists():
        return fname, "skip", {}

    img_b64 = encode_image(avif_path)
    last_err = ""

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            msg = client.messages.create(
                model=MODEL,
                max_tokens=1500,
                system=SYSTEM_PROMPT_CACHED,
                messages=[{
                    "role": "user",
                    "content": [
                        {"type": "image", "source": {"type": "base64",
                                                     "media_type": "image/jpeg",
                                                     "data": img_b64}},
                        {"type": "text", "text": f"Catalog this image. file = {fname}"}
                    ]
                }]
            )
            rec = parse_json_response(msg.content[0].text)
            rec["file"] = fname
            rec.setdefault("featured", False)
            rec.setdefault("schema_version", "1")
            if "series" not in rec:
                rec["series"] = None

            err = validate_record(rec)
            if err:
                last_err = f"validation: {err}"
                continue

            sidecar.write_text(json.dumps(rec, indent=2))
            usage = {
                "input":          getattr(msg.usage, "input_tokens", 0),
                "output":         getattr(msg.usage, "output_tokens", 0),
                "cache_created":  getattr(msg.usage, "cache_creation_input_tokens", 0),
                "cache_read":     getattr(msg.usage, "cache_read_input_tokens", 0),
            }
            return fname, "ok", usage

        except Exception as e:
            last_err = repr(e)
            if attempt < MAX_RETRIES:
                time.sleep(2 ** attempt + random.random())

    log_error(fname, last_err)
    return fname, f"err: {last_err}", {}

def _make_request_params(avif_path: Path) -> dict[str, Any]:
    img_b64 = encode_image(avif_path)
    return {
        "model":      MODEL,
        "max_tokens": 1500,
        "system":     SYSTEM_PROMPT_CACHED,
        "messages": [{
            "role": "user",
            "content": [
                {"type": "image", "source": {"type": "base64",
                                             "media_type": "image/jpeg",
                                             "data": img_b64}},
                {"type": "text", "text": f"Catalog this image. file = {avif_path.name}"}
            ]
        }]
    }


def run_batch(client: Anthropic, todo: list[Path]) -> None:
    """Submit todo as a single Batch API job (50% cheaper, async)."""
    print(f"Encoding {len(todo)} images…")
    requests = [
        {"custom_id": p.name, "params": _make_request_params(p)}
        for p in todo
    ]

    batch = client.messages.batches.create(requests=requests)
    print(f"Batch submitted: {batch.id}  ({len(todo)} requests)")
    print("Polling every 30s…")

    while batch.processing_status == "in_progress":
        time.sleep(30)
        batch = client.messages.batches.retrieve(batch.id)
        rc = batch.request_counts
        print(f"  {batch.processing_status} — processing:{rc.processing} "
              f"succeeded:{rc.succeeded} errored:{rc.errored}")

    print(f"Batch complete: {batch.processing_status}")
    ok = err = 0
    for result in client.messages.batches.results(batch.id):
        fname = result.custom_id
        avif_path = FULL_DIR / fname
        if result.result.type == "errored":
            log_error(fname, repr(result.result.error))
            err += 1
            continue
        try:
            rec = parse_json_response(result.result.message.content[0].text)
            rec["file"] = fname
            rec.setdefault("featured", False)
            rec.setdefault("schema_version", "1")
            if "series" not in rec:
                rec["series"] = None
            validation_err = validate_record(rec)
            if validation_err:
                log_error(fname, f"validation: {validation_err}")
                err += 1
                continue
            avif_path.with_suffix(".json").write_text(json.dumps(rec, indent=2))
            ok += 1
        except Exception as e:
            log_error(fname, repr(e))
            err += 1

    print(f"\nDone. {ok} written, {err} errors.")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit",   type=int,  default=None)
    ap.add_argument("--workers", type=int,  default=4)
    ap.add_argument("--batch",   action="store_true",
                    help="Use Batch API (async, 50%% cheaper) instead of streaming")
    args = ap.parse_args()

    if not os.environ.get("ANTHROPIC_API_KEY"):
        sys.exit("Set ANTHROPIC_API_KEY. Get a key at https://console.anthropic.com")

    client = Anthropic()
    avifs = sorted(FULL_DIR.glob("art*.avif"))
    todo = [p for p in avifs if not p.with_suffix(".json").exists()]
    if args.limit:
        todo = todo[:args.limit]

    print(f"{len(avifs)} AVIFs in folder. {len(todo)} missing sidecars.")
    if not todo:
        print("Nothing to do.")
        return

    if args.batch:
        run_batch(client, todo)
        return

    print(f"Processing {len(todo)} with {args.workers} parallel workers.")
    print(f"Errors logged to: {ERROR_LOG} (JSONL format)")
    start = time.time()
    ok = err = 0
    total_input = total_output = total_cache_created = total_cache_read = 0

    with ThreadPoolExecutor(max_workers=args.workers) as ex:
        futures = {ex.submit(process_one, client, p): p for p in todo}
        for i, fut in enumerate(as_completed(futures), 1):
            fname, status, usage = fut.result()
            if status == "ok":
                ok += 1
                total_input        += usage.get("input", 0)
                total_output       += usage.get("output", 0)
                total_cache_created += usage.get("cache_created", 0)
                total_cache_read   += usage.get("cache_read", 0)
            elif status.startswith("err"):
                err += 1
                print(f"  [{i}/{len(todo)}] {fname}: {status}")
            if i % 25 == 0:
                elapsed = time.time() - start
                rate = i / elapsed if elapsed else 0
                eta = (len(todo) - i) / rate if rate else 0
                print(f"  [{i}/{len(todo)}] {ok} ok / {err} err / {rate:.1f}/s / ETA {eta/60:.0f}m")

    elapsed = time.time() - start
    print(f"\nDone. {ok} written, {err} errors. {elapsed:.0f}s elapsed.")
    if total_input or total_cache_read:
        print(f"\nToken usage:")
        print(f"  Input (uncached):  {total_input:,}")
        print(f"  Cache writes:      {total_cache_created:,}")
        print(f"  Cache reads:       {total_cache_read:,}  ← billed at ~10% of normal")
        print(f"  Output:            {total_output:,}")
        if total_cache_read + total_input > 0:
            hit_pct = 100 * total_cache_read / (total_cache_read + total_input)
            print(f"  Cache hit rate:    {hit_pct:.0f}%")

if __name__ == "__main__":
    main()

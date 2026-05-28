#!/usr/bin/env python3
"""
Re-evaluates theme assignments for all works using updated ai_note rules.

Sends each work's thumbnail image + metadata to Claude Haiku, gets back
a fresh theme list, and writes it to the sidecar JSON.

Cost: ~$0.001–0.002 per work × 1,084 works ≈ $1–2 total.

Usage:
    python3 artworks/repass_themes.py                  # fix all works
    python3 artworks/repass_themes.py --dry-run        # preview without writing
    python3 artworks/repass_themes.py --limit 10       # test on first 10
    python3 artworks/repass_themes.py --id art0042     # fix one specific work
"""

import os, json, base64, io, sys, argparse, time, random
from pathlib import Path

try:
    from PIL import Image
    import pillow_avif  # noqa: F401
except ImportError:
    sys.exit("Run: pip install --break-system-packages pillow pillow-avif-plugin")

try:
    from anthropic import Anthropic
except ImportError:
    sys.exit("Run: pip install --break-system-packages anthropic")

ROOT      = Path(__file__).parent.parent
FULL      = Path(__file__).parent / "full"
THUMBS    = Path(__file__).parent / "thumbs"
CONFIG    = ROOT / "artist-config.json"
MODEL     = "claude-haiku-4-5-20251001"
MAX_TOKENS = 150
MAX_RETRIES = 3


def load_theme_rules() -> tuple[list[str], str]:
    """Return (valid_names, rules_text) from artist-config.json."""
    config = json.loads(CONFIG.read_text())
    names  = [t["name"] for t in config["themes"]]
    lines  = []
    for t in config["themes"]:
        lines.append(f'• "{t["name"]}": {t["ai_note"]}')
    return names, "\n".join(lines)


VALID_NAMES, THEME_RULES = load_theme_rules()

SYSTEM_PROMPT = f"""You assign themes to artworks in a personal archive.

Available themes and STRICT rules for each:
{THEME_RULES}

Assignment rules:
- Assign 0 to 4 themes maximum.
- Only assign a theme when the rule is clearly met — be conservative. If in doubt, omit it.
- Return ONLY a JSON object with a single key "themes" containing a list of theme name strings.
- Use exact theme names from the list above.
- Example: {{"themes": ["Targets", "Torsos & Faces"]}}
- If no themes apply: {{"themes": []}}
"""


def encode_thumb(art_id: str) -> str | None:
    """Return base64 JPEG of the thumbnail (or full-res if no thumb)."""
    thumb = THUMBS / f"{art_id}.avif"
    full  = FULL   / f"{art_id}.avif"
    src   = thumb if thumb.exists() else full if full.exists() else None
    if src is None:
        return None
    img = Image.open(src).convert("RGB")
    img.thumbnail((600, 600))
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=75)
    return base64.standard_b64encode(buf.getvalue()).decode()


def repass_one(client: Anthropic, jf: Path, dry_run: bool = False) -> tuple[str, str]:
    art_id  = jf.stem  # e.g. "art0042"
    rec     = json.loads(jf.read_text())
    old     = rec.get("themes", [])

    img_b64 = encode_thumb(art_id)
    if img_b64 is None:
        return art_id, "skip — no image"

    title   = rec.get("title", "Untitled")
    wtype   = rec.get("work_type", "unknown")
    desc    = rec.get("description", "")
    series  = rec.get("series", "")

    user_text = (
        f'Title: "{title}"\n'
        f'Work type: {wtype}\n'
        f'Description: {desc}\n'
    )
    if series:
        user_text += f'Named series: {series}\n'
    user_text += '\nAssign themes for this work.'

    last_err = ""
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            msg = client.messages.create(
                model=MODEL,
                max_tokens=MAX_TOKENS,
                system=SYSTEM_PROMPT,
                messages=[{
                    "role": "user",
                    "content": [
                        {"type": "image", "source": {
                            "type": "base64",
                            "media_type": "image/jpeg",
                            "data": img_b64,
                        }},
                        {"type": "text", "text": user_text},
                    ],
                }],
            )

            raw  = msg.content[0].text.strip()
            # Extract the first {...} object regardless of surrounding text
            import re as _re
            m = _re.search(r'\{[^{}]*\}', raw, _re.DOTALL)
            if not m:
                last_err = f"no JSON object in: {raw[:80]!r}"
                if attempt < MAX_RETRIES:
                    time.sleep(1)
                continue
            data = json.loads(m.group())
            new  = data.get("themes", [])

            # Validate names
            bad = [t for t in new if t not in VALID_NAMES]
            if bad:
                last_err = f"invalid theme names: {bad}"
                if attempt < MAX_RETRIES:
                    time.sleep(1)
                continue

            if not dry_run:
                rec["themes"] = new
                jf.write_text(json.dumps(rec, indent=2))

            change = f"{old} → {new}" if old != new else "no change"
            return art_id, f"ok — {change}"

        except Exception as e:
            last_err = repr(e)
            if attempt < MAX_RETRIES:
                time.sleep(2 ** attempt + random.random())

    return art_id, f"err: {last_err}"


def main():
    ap = argparse.ArgumentParser(description="Re-evaluate theme assignments for archive works.")
    ap.add_argument("--dry-run",  action="store_true", help="preview changes without writing")
    ap.add_argument("--limit",    type=int,            help="process only this many works")
    ap.add_argument("--id",       type=str,            help="process a single work by ID (e.g. art0042)")
    args = ap.parse_args()

    api_key = os.environ.get("ANTHROPIC_API_KEY") or ""
    if not api_key:
        env_path = ROOT / ".ftp.env"
        if env_path.exists():
            for line in env_path.read_text().splitlines():
                if line.startswith("ANTHROPIC_API_KEY="):
                    api_key = line.split("=", 1)[1].strip()
    if not api_key:
        sys.exit("ANTHROPIC_API_KEY not found in environment or .ftp.env")

    client = Anthropic(api_key=api_key)

    if args.id:
        jfs = [FULL / f"{args.id}.json"]
    else:
        jfs = sorted(FULL.glob("art*.json"))

    if args.limit:
        jfs = jfs[:args.limit]

    total   = len(jfs)
    changed = 0
    errors  = 0

    print(f"{'DRY RUN — ' if args.dry_run else ''}Processing {total} works with model {MODEL}…\n")

    for i, jf in enumerate(jfs, 1):
        art_id, result = repass_one(client, jf, dry_run=args.dry_run)
        status = "✓" if result.startswith("ok") else ("~" if result.startswith("skip") else "✗")
        print(f"  [{i:4}/{total}] {status} {art_id}: {result}")
        if result.startswith("ok") and "no change" not in result:
            changed += 1
        if result.startswith("err"):
            errors += 1
        # Gentle rate limiting
        if i % 10 == 0:
            time.sleep(0.5)

    print(f"\nDone. {changed} changed, {errors} errors, {total - changed - errors} unchanged.")

    if not args.dry_run and changed > 0:
        print("\nRebuild the catalog:")
        print("  python3 artworks/build_catalog.py")
        print("Then deploy:")
        print("  ./deploy.sh")


if __name__ == "__main__":
    main()

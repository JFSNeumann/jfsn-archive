#!/usr/bin/env python3
"""
Repass description field for records that violate the opener rule.
Re-generates ONLY the description field for each offending record —
all other metadata is preserved exactly.

Cost: ~$0.005 per record × ~100 records ≈ $0.50–1.00

Usage:
    python3 artworks/repass_descriptions.py           # fix all opener violations
    python3 artworks/repass_descriptions.py --dry-run # show which records would be fixed
    python3 artworks/repass_descriptions.py --limit 5 # test on 5 first
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

FULL      = Path(__file__).parent / "full"
LOGS      = Path(__file__).parent / "logs"
MODEL     = "claude-sonnet-4-6"
MAX_RETRIES = 3
BANNED    = {"a", "an", "the"}

DESCRIPTION_PROMPT = r"""You are writing a single catalog description for one artwork in an archive.

Return ONLY a JSON object with a single key "description". No prose, no code fences.

{"description": "..."}

Rules:
• Two sentences. Maximum 55 words total.
• Catalog tone: precise, objective, no editorializing.
• HARD RULE: Your first word must NOT be "A", "An", or "The".
  Open with a noun, adjective, number, gerund, or cross-reference word.
  Examples of valid openers:
    "Layered fragments of printed ephemera..."
    "Gold foil and lace doilies..."
    "Centered against a black ground..."
    "Three overlapping warplane silhouettes..."
    "Dense with surface incident,..."
    "Ivory and ochre tones dominate..."
    "Two-register composition:..."
    "Vertical totem structure:..."
• Do NOT use evaluative language: striking, powerful, remarkable, compelling, dynamic.
• Describe only what is visually present."""


def encode_image(avif_path: Path) -> str:
    img = Image.open(avif_path).convert("RGB")
    img.thumbnail((800, 800))
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=80)
    return base64.standard_b64encode(buf.getvalue()).decode("utf-8")


def parse_description(text: str) -> str:
    text = text.strip()
    if text.startswith("```"):
        text = text.strip("`")
        if text.lower().startswith("json"):
            text = text.split("\n", 1)[1] if "\n" in text else text[4:]
        text = text.strip().rstrip("`").strip()
    return json.loads(text)["description"]


def opener_ok(desc: str) -> bool:
    first = desc.split()[0].rstrip(",").lower() if desc.split() else ""
    return first not in BANNED


def fix_one(client: Anthropic, jf: Path, journal: list | None = None) -> tuple[str, str]:
    rec = json.loads(jf.read_text())
    avif = jf.with_suffix(".avif")
    if not avif.exists():
        return jf.name, "skip — no avif"

    old_desc = rec.get("description", "")
    img_b64  = encode_image(avif)
    last_err = ""

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            msg = client.messages.create(
                model=MODEL,
                max_tokens=200,
                system=DESCRIPTION_PROMPT,
                messages=[{
                    "role": "user",
                    "content": [
                        {"type": "image", "source": {"type": "base64",
                                                     "media_type": "image/jpeg",
                                                     "data": img_b64}},
                        {"type": "text",
                         "text": f"Write a new catalog description for this artwork. "
                                 f"Current (rejected) description for reference: {old_desc!r}"}
                    ]
                }]
            )
            new_desc = parse_description(msg.content[0].text)

            if not opener_ok(new_desc):
                last_err = f"opener still banned: {new_desc[:40]!r}"
                if attempt < MAX_RETRIES:
                    time.sleep(1)
                continue

            word_count = len(new_desc.split())
            if word_count > 55:
                last_err = f"still too long: {word_count} words"
                if attempt < MAX_RETRIES:
                    time.sleep(1)
                continue

            rec["description"] = new_desc
            jf.write_text(json.dumps(rec, indent=2))
            if journal is not None:
                journal.append({"file": jf.name, "before": old_desc, "after": new_desc})
            return jf.name, f"ok — was: {old_desc[:40]!r} → {new_desc[:40]!r}"

        except Exception as e:
            last_err = repr(e)
            if attempt < MAX_RETRIES:
                time.sleep(2 ** attempt + random.random())

    return jf.name, f"err: {last_err}"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--limit",   type=int, default=None)
    ap.add_argument("--journal", action="store_true",
                    help="Write before/after diffs to artworks/logs/repass-YYYYMMDD.jsonl")
    args = ap.parse_args()

    if not args.dry_run and not os.environ.get("ANTHROPIC_API_KEY"):
        sys.exit("Set ANTHROPIC_API_KEY. Get a key at https://console.anthropic.com")

    # Find all records with banned openers
    violators = []
    for jf in sorted(FULL.glob("art*.json")):
        rec = json.loads(jf.read_text())
        desc = rec.get("description", "")
        first = desc.split()[0].rstrip(",").lower() if desc.split() else ""
        if first in BANNED:
            violators.append(jf)

    if args.limit:
        violators = violators[:args.limit]

    print(f"Found {len(violators)} records with banned description openers.")

    if args.dry_run:
        for jf in violators:
            rec = json.loads(jf.read_text())
            print(f"  {jf.name}: {rec['description'][:60]!r}...")
        return

    client = Anthropic()
    ok = err = 0
    start = time.time()
    journal = [] if args.journal else None

    for i, jf in enumerate(violators, 1):
        name, status = fix_one(client, jf, journal)
        if status.startswith("ok"):
            ok += 1
            print(f"  [{i}/{len(violators)}] ✓ {name}: {status[5:]}")
        else:
            err += 1
            print(f"  [{i}/{len(violators)}] ✗ {name}: {status}")

    elapsed = time.time() - start
    print(f"\nDone. {ok} fixed, {err} errors. {elapsed:.0f}s elapsed.")

    if journal:
        LOGS.mkdir(exist_ok=True)
        jpath = LOGS / f"repass-{time.strftime('%Y%m%d')}.jsonl"
        with jpath.open("a") as f:
            for entry in journal:
                f.write(json.dumps(entry) + "\n")
        print(f"Journal: {jpath} ({len(journal)} entries)")

    print(f"Run validate_catalog.py to confirm clean state.")


if __name__ == "__main__":
    main()

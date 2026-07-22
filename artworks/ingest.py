#!/usr/bin/env python3
"""
JFSN Artwork Ingest
====================
Converts new photos from artworks/inbox/ into full/thumb/mini AVIFs and
assigns sequential art IDs starting after the highest existing one.

Supported input: HEIC, HEIF, JPG, JPEG, PNG, TIFF, WEBP

Setup (one-time):
    pip3 install --break-system-packages pillow pillow-avif-plugin pillow-heif

Run from the project root:
    python3 artworks/ingest.py              # process all inbox files
    python3 artworks/ingest.py --dry-run    # preview without writing anything

Output:
    artworks/full/art1085.avif    — full resolution
    artworks/thumbs/art1085.avif  — 400 px wide
    artworks/mini/art1085.avif    — 200 px wide
    artworks/micro/art1085.avif   — 80 px wide (The Wall mosaic, mobile tiles)
    artworks/inbox/done/          — originals moved here after processing

After running:
    python3 artworks/build_catalog.py       # picks up new stubs automatically
"""

import argparse, json, os, shutil, subprocess, sys, tempfile
from pathlib import Path

# ── quality settings ─────────────────────────────────────────────────────────
Q_FULL   = 82   # full-res AVIF quality  (0–100, higher = better)
Q_THUMB  = 76   # 400 px thumbnail quality
Q_MEDIUM = 78   # 900 px medium quality
Q_MINI   = 70   # 200 px mini quality
Q_MICRO  = 62   # 80 px micro quality (The Wall mosaic, mobile tiles)

MEDIUM_W = 900
THUMB_W  = 400
MINI_W   = 200
MICRO_W  = 80

INBOX_EXTS = {".heic", ".heif", ".jpg", ".jpeg", ".png", ".tiff", ".tif", ".webp"}

# ── paths (relative to this script's location) ───────────────────────────────
HERE   = Path(__file__).parent
INBOX  = HERE / "inbox"
DONE   = HERE / "inbox" / "done"
FULL   = HERE / "full"
MEDIUM = HERE / "medium"
THUMBS = HERE / "thumbs"
MINI   = HERE / "mini"
MICRO  = HERE / "micro"
DIMS   = HERE.parent / "config" / "dims.json"

# ─────────────────────────────────────────────────────────────────────────────

def check_deps():
    missing = []
    try:
        from PIL import Image
        import pillow_avif  # noqa: F401
    except ImportError:
        missing.append("pillow pillow-avif-plugin")
    try:
        import pillow_heif  # noqa: F401
    except ImportError:
        missing.append("pillow-heif")
    if missing:
        sys.exit(f"Install missing packages:\n  pip3 install --break-system-packages {' '.join(missing)}")
    if not shutil.which("avifenc"):
        sys.exit("avifenc not found — install with: brew install libavif")


def next_art_id():
    """Return the next art ID after the highest existing one in full/."""
    existing = sorted(FULL.glob("art*.avif"))
    # Filter out _back variants; only consider main artwork files
    existing = [f for f in existing if not f.stem.endswith("_back")]
    if not existing:
        return 1
    last = existing[-1].stem  # e.g. "art1084"
    return int(last[3:]) + 1


def resize_fit(img, width):
    """Resize image to given width, maintaining aspect ratio. Never upscales."""
    from PIL import Image
    w, h = img.size
    if w <= width:
        return img  # already smaller than target — don't upscale
    new_h = round(h * width / w)
    return img.resize((width, new_h), Image.LANCZOS)


def sharpen(img):
    """Gentle unsharp mask — recovers softness from HEIC/JPEG compression."""
    from PIL import ImageFilter
    return img.filter(ImageFilter.UnsharpMask(radius=0.8, percent=80, threshold=2))


def save_avif(img, path, quality):
    """Save PIL image as AVIF using avifenc (better quality than pillow-avif-plugin).
    avifenc -q uses 0–100 scale where 100 = lossless, same direction as Pillow.
    """
    tmp_fd, tmp_path = tempfile.mkstemp(suffix=".png")
    try:
        os.close(tmp_fd)
        img.save(tmp_path, format="PNG")
        subprocess.run(
            ["avifenc", "--speed", "4", "-q", str(quality), tmp_path, str(path)],
            check=True, capture_output=True,
        )
    finally:
        os.unlink(tmp_path)


def load_image(src: Path):
    """Load any supported image, returning a PIL Image in RGB mode."""
    import pillow_heif
    pillow_heif.register_heif_opener()
    from PIL import Image

    img = Image.open(src)

    # Handle palette or RGBA modes
    if img.mode in ("P", "RGBA", "LA", "L"):
        bg = Image.new("RGB", img.size, (255, 255, 255))
        if img.mode in ("RGBA", "LA"):
            img = img.convert("RGBA")
            bg.paste(img, mask=img.split()[-1])
        else:
            bg.paste(img.convert("RGB"))
        img = bg
    elif img.mode != "RGB":
        img = img.convert("RGB")

    return img


def process(src: Path, art_id: str, dry_run: bool) -> dict:
    """Convert one source file → full/medium/thumb/mini AVIFs. Returns dims entry."""
    full_out   = FULL   / f"{art_id}.avif"
    medium_out = MEDIUM / f"{art_id}.avif"
    thumb_out  = THUMBS / f"{art_id}.avif"
    mini_out   = MINI   / f"{art_id}.avif"
    micro_out  = MICRO  / f"{art_id}.avif"
    done_out  = DONE   / src.name

    if dry_run:
        # Still load to get dimensions
        img = load_image(src)
        w, h = img.size
        tw = THUMB_W
        th = round(h * THUMB_W / w)
        print(f"  {art_id}  {src.name}  ({w}×{h} → thumb {tw}×{th})  [dry-run]")
        return {art_id: [tw, th]}

    print(f"  {art_id}  {src.name}", end="", flush=True)

    img  = load_image(src)
    img  = sharpen(img)
    w, h = img.size

    # Full-res
    save_avif(img, full_out, Q_FULL)
    print(" ✓full", end="", flush=True)

    # Medium (900px — for featured grid on desktop)
    medium = resize_fit(img, MEDIUM_W)
    save_avif(medium, medium_out, Q_MEDIUM)
    print(" ✓medium", end="", flush=True)

    # Thumbnail
    thumb = resize_fit(img, THUMB_W)
    save_avif(thumb, thumb_out, Q_THUMB)
    print(" ✓thumb", end="", flush=True)

    # Mini
    mini = resize_fit(img, MINI_W)
    save_avif(mini, mini_out, Q_MINI)
    print(" ✓mini", end="", flush=True)

    # Micro (80px — The Wall mosaic, mobile tile srcset)
    micro = resize_fit(img, MICRO_W)
    save_avif(micro, micro_out, Q_MICRO)
    print(" ✓micro", end="", flush=True)

    # Move original to done/
    DONE.mkdir(parents=True, exist_ok=True)
    shutil.move(str(src), str(done_out))
    print(f"  →done")

    tw, th = thumb.size
    return {art_id: [tw, th]}


def update_dims(new_entries: dict, dry_run: bool):
    """Merge new_entries into dims.json."""
    if dry_run:
        return
    dims = {}
    if DIMS.exists():
        dims = json.loads(DIMS.read_text())
    dims.update(new_entries)
    # Sort by art ID
    dims = dict(sorted(dims.items()))
    DIMS.write_text(json.dumps(dims, separators=(",", ":")))
    print(f"\ndims.json updated — {len(dims)} total entries")


def main():
    parser = argparse.ArgumentParser(description="Ingest new artworks from inbox/")
    parser.add_argument("--dry-run", action="store_true",
                        help="Preview without writing any files")
    args = parser.parse_args()

    check_deps()

    # Ensure output dirs exist
    if not args.dry_run:
        for d in (FULL, MEDIUM, THUMBS, MINI):
            d.mkdir(parents=True, exist_ok=True)

    # Collect inbox files
    INBOX.mkdir(parents=True, exist_ok=True)
    sources = sorted(
        f for f in INBOX.iterdir()
        if f.is_file() and f.suffix.lower() in INBOX_EXTS
    )

    if not sources:
        print(f"No images found in {INBOX}/")
        print("Drop HEIC, JPG, PNG, etc. into artworks/inbox/ and re-run.")
        return

    next_id = next_art_id()
    print(f"Found {len(sources)} file(s). Starting at art{next_id:04d}.")
    if args.dry_run:
        print("(dry-run — no files will be written)\n")

    new_dims = {}
    for i, src in enumerate(sources):
        art_id = f"art{next_id + i:04d}"
        try:
            entry = process(src, art_id, dry_run=args.dry_run)
            new_dims.update(entry)
        except Exception as e:
            print(f"\n  ✗ {src.name}: {e}")

    update_dims(new_dims, dry_run=args.dry_run)

    if not args.dry_run:
        print(f"\nDone. Added {len(new_dims)} artwork(s).")
        print("Next steps:")
        print("  python3 artworks/build_catalog.py   # picks up new stubs")
        print("  ./deploy.sh                          # or run after cataloging")


if __name__ == "__main__":
    main()

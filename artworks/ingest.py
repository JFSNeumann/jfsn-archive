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

import argparse, json, os, re, shutil, subprocess, sys, tempfile
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


def _recover_id_from_done(base_name: str, allow_historical: bool = False) -> str:
    """Recover artwork ID from done/ for a given base filename.

    Returns:
      - "art####" if marker found and validated (partial failure recovery)
      - "art####" if allow_historical=True and completed file exists (orphan back recovery)
      - "AMBIGUOUS" if multiple matches found
      - None if no match found
    """
    # Check for markers first (partial failure recovery)
    marker_pattern = re.compile(rf"^\.{re.escape(base_name)}__(\w+)\.marker$")
    markers = []
    if DONE.exists():
        for marker_file in DONE.glob(f".{base_name}__*.marker"):
            match = marker_pattern.match(marker_file.name)
            if match:
                art_id = match.group(1)
                # Validate: check if full derivative exists
                if (FULL / f"{art_id}.avif").exists():
                    markers.append(art_id)

    if markers:
        if len(markers) > 1:
            return "AMBIGUOUS"
        return markers[0]

    # Fallback to historical completed files only if allow_historical=True
    if allow_historical:
        pattern = re.compile(rf"^{re.escape(base_name)}__(\w+)\..*$")
        completed = []
        if DONE.exists():
            for done_file in DONE.glob(f"{base_name}__*"):
                match = pattern.match(done_file.name)
                if match:
                    art_id = match.group(1)
                    completed.append(art_id)

        if completed:
            if len(completed) > 1:
                return "AMBIGUOUS"
            return completed[0]

    return None


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


def process(src: Path, art_id: str, dry_run: bool, is_back: bool = False) -> dict:
    """Convert one source file → full/medium/thumb/mini/micro AVIFs. Returns dims entry.

    For back images: art_id is the front's ID; file is saved as art_id_back.avif.
    """
    if is_back:
        suffix_back = "_back"
        full_out   = FULL   / f"{art_id}{suffix_back}.avif"
        medium_out = MEDIUM / f"{art_id}{suffix_back}.avif"
        thumb_out  = THUMBS / f"{art_id}{suffix_back}.avif"
        mini_out   = MINI   / f"{art_id}{suffix_back}.avif"
        micro_out  = MICRO  / f"{art_id}{suffix_back}.avif"
    else:
        full_out   = FULL   / f"{art_id}.avif"
        medium_out = MEDIUM / f"{art_id}.avif"
        thumb_out  = THUMBS / f"{art_id}.avif"
        mini_out   = MINI   / f"{art_id}.avif"
        micro_out  = MICRO  / f"{art_id}.avif"

    if dry_run:
        # Still load to get dimensions
        img = load_image(src)
        w, h = img.size
        tw = THUMB_W
        th = round(h * THUMB_W / w)
        side = " (back)" if is_back else ""
        print(f"  {art_id}  {src.name}  ({w}×{h} → thumb {tw}×{th}){side}  [dry-run]")
        return {art_id: [tw, th]}

    print(f"  {art_id}  {src.name}", end="", flush=True)

    # Create marker BEFORE processing (durability checkpoint for ID assignment)
    if not is_back:
        DONE.mkdir(parents=True, exist_ok=True)
        marker = DONE / f".{src.stem}__{art_id}.marker"
        marker.touch()

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

    # Move original to done/ with embedded ID
    DONE.mkdir(parents=True, exist_ok=True)
    if is_back:
        done_out = DONE / src.name
    else:
        done_out = DONE / f"{src.stem}__{art_id}{src.suffix}"
    shutil.move(str(src), str(done_out))

    # Clean up marker after successful move
    if not is_back:
        marker.unlink(missing_ok=True)

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
        for d in (FULL, MEDIUM, THUMBS, MINI, MICRO):
            d.mkdir(parents=True, exist_ok=True)

    # Collect inbox files
    INBOX.mkdir(parents=True, exist_ok=True)
    all_sources = sorted(
        f for f in INBOX.iterdir()
        if f.is_file() and f.suffix.lower() in INBOX_EXTS
    )

    if not all_sources:
        print(f"No images found in {INBOX}/")
        print("Drop HEIC, JPG, PNG, etc. into artworks/inbox/ and re-run.")
        return

    # Separate fronts and backs
    fronts = [f for f in all_sources if not f.stem.endswith("_back")]
    backs = [f for f in all_sources if f.stem.endswith("_back")]

    if not fronts and not backs:
        print(f"No images found in {INBOX}/")
        print("Drop HEIC, JPG, PNG, etc. into artworks/inbox/ and re-run.")
        return

    next_id = next_art_id()
    total_files = len(fronts) + len(backs)
    print(f"Found {total_files} file(s) ({len(fronts)} front(s), {len(backs)} back(s)). Starting at art{next_id:04d}.")
    if args.dry_run:
        print("(dry-run — no files will be written)\n")

    new_dims = {}
    source_to_id = {}

    # Process fronts first
    for i, src in enumerate(fronts):
        # Check for partial failure recovery
        recovered_id = _recover_id_from_done(src.stem, allow_historical=False)
        if recovered_id == "AMBIGUOUS":
            print(f"\n  ✗ {src.name}: Multiple partial failures found — ambiguous recovery. Remove stale markers and retry.")
            continue
        elif recovered_id:
            art_id = recovered_id
            print(f"\n  [recovering] {art_id}  {src.name}")
        else:
            art_id = f"art{next_id + i:04d}"

        try:
            entry = process(src, art_id, dry_run=args.dry_run, is_back=False)
            new_dims.update(entry)
            source_to_id[src.stem] = art_id
        except Exception as e:
            print(f"\n  ✗ {src.name}: {e}")

    # Process backs second (using source_to_id map or recovering from done/)
    for src in backs:
        back_stem = src.stem  # e.g., "photo_back"
        base_name = back_stem[:-5] if back_stem.endswith("_back") else back_stem

        # First check current batch mapping
        if base_name in source_to_id:
            art_id = source_to_id[base_name]
        else:
            # Try recovery for orphan back (front was processed in prior run)
            recovered_id = _recover_id_from_done(base_name, allow_historical=True)
            if recovered_id == "AMBIGUOUS":
                print(f"\n  ✗ {src.name}: Ambiguous ID recovery — multiple matches found. Manual intervention needed.")
                continue
            elif recovered_id:
                art_id = recovered_id
            else:
                print(f"\n  ✗ {src.name}: No matching front found (expected {base_name}) and no recovery possible. Skipping.")
                continue

        try:
            entry = process(src, art_id, dry_run=args.dry_run, is_back=True)
            # Back dims don't update dims.json (only fronts do)
        except Exception as e:
            print(f"\n  ✗ {src.name}: {e}")

    update_dims(new_dims, dry_run=args.dry_run)

    if not args.dry_run:
        print(f"\nDone. Added {len(new_dims)} artwork derivative(s).")
        print("Next steps:")
        print("  python3 artworks/build_catalog.py   # picks up new stubs")
        print("  ./deploy.sh                          # or run after cataloging")


if __name__ == "__main__":
    main()

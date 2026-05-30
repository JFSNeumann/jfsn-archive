#!/usr/bin/env python3
"""
Catalog audit fix — 2026-05-30
Removes 7 misapplied themes from catalog-lite.json:
  - 'Crosses' removed from: art0003, art0016, art0154, art0293, art0302, art0537
  - 'Targets' removed from: art0125

Run from JFSN directory:
    python3 fix_catalog.py

Creates catalog-lite.backup.json before making any changes.
"""

import json, shutil, os

SRC = "catalog-lite.json"
BACKUP = "catalog-lite.backup.json"

if not os.path.exists(SRC):
    print("ERROR: catalog-lite.json not found. Run from JFSN directory.")
    exit(1)

# Backup
shutil.copy(SRC, BACKUP)
print(f"Backup written: {BACKUP}")

with open(SRC, encoding="utf-8") as f:
    catalog = json.load(f)

print(f"Loaded {len(catalog)} works.")

# Fixes
crosses_remove = {
    "art0003.avif",
    "art0016.avif",
    "art0154.avif",
    "art0293.avif",
    "art0302.avif",
    "art0537.avif",
}
targets_remove = {"art0125.avif"}

changes = []
for w in catalog:
    fid = w.get("file", "")
    themes = w.get("themes", [])

    if fid in crosses_remove and "Crosses" in themes:
        w["themes"] = [t for t in themes if t != "Crosses"]
        changes.append(f"  {fid}: removed 'Crosses'  {themes} → {w['themes']}")

    if fid in targets_remove and "Targets" in w.get("themes", []):
        w["themes"] = [t for t in w.get("themes", []) if t != "Targets"]
        changes.append(f"  {fid}: removed 'Targets'  {themes} → {w['themes']}")

if not changes:
    print("No changes needed — already applied?")
    exit(0)

print(f"\nChanges ({len(changes)}):")
for c in changes:
    print(c)

with open(SRC, "w", encoding="utf-8") as f:
    json.dump(catalog, f, ensure_ascii=False, separators=(",", ":"))

print(f"\nDone. {SRC} updated.")
print(f"To restore original: cp {BACKUP} {SRC}")

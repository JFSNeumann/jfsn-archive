#!/usr/bin/env python3
"""
Sync sidecar JSON files to match the master catalog.

The build_catalog.py script derives certain fields (orientation, featured, favorite,
has_back, year_precision, year_display, composite) and stores them in catalog.json.
This script ensures the per-work sidecar JSON files in artworks/full/ stay in sync
with those derived values, without touching user-authored metadata (title, description,
themes, materials, composition, motifs).

Usage:
  python3 artworks/sync_sidecars_from_catalog.py

This script is idempotent: safe to run multiple times. It only updates the fields
that build_catalog.py derives, leaving all other sidecar content unchanged.
"""

import json
import os
from pathlib import Path

# Fields that are derived by build_catalog.py and should be synced from master catalog
DERIVED_FIELDS = {
    'orientation', 'featured', 'favorite', 'has_back',
    'year_precision', 'year_display', 'composite'
}

def main():
    catalog_path = Path('config/catalog.json')
    sidecar_dir = Path('artworks/full')

    if not catalog_path.exists():
        print(f"Error: {catalog_path} not found")
        return 1

    if not sidecar_dir.exists():
        print(f"Error: {sidecar_dir} not found")
        return 1

    # Load master catalog
    with open(catalog_path) as f:
        catalog = json.load(f)

    catalog_by_id = {record['file']: record for record in catalog}

    # Sync each sidecar
    synced_count = 0
    skipped_count = 0
    error_count = 0

    for record in catalog:
        art_id = record['file']
        sidecar_path = sidecar_dir / f"{art_id}.json"

        # If sidecar doesn't exist, skip (it's optional)
        if not sidecar_path.exists():
            skipped_count += 1
            continue

        try:
            with open(sidecar_path) as f:
                sidecar = json.load(f)

            # Update only the derived fields from master
            for field in DERIVED_FIELDS:
                if field in record:
                    sidecar[field] = record[field]
                elif field in sidecar:
                    # If field is in sidecar but not in master, remove it (stale)
                    del sidecar[field]

            # Write back
            with open(sidecar_path, 'w') as f:
                json.dump(sidecar, f, ensure_ascii=False, indent=2)
                f.write('\n')

            synced_count += 1

        except (json.JSONDecodeError, IOError) as e:
            print(f"Error syncing {art_id}: {e}")
            error_count += 1

    # Report
    print(f"Synced {synced_count} sidecar(s)")
    if skipped_count > 0:
        print(f"Skipped {skipped_count} (no sidecar file)")
    if error_count > 0:
        print(f"Errors: {error_count}")
        return 1

    return 0

if __name__ == '__main__':
    exit(main())

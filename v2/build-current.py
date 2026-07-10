#!/usr/bin/env python3
"""Build v2/current.json — the data spine of The Current.

Merges chromatic.json (id/year/color) with catalog-lite.json (honest
metadata: year_display, medium, orientation, composite flag) into one
compact array sorted by year then id. Run from repo root or v2/:

    python3 v2/build-current.py
"""
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

chromatic = json.load(open(os.path.join(ROOT, "chromatic.json")))
lite = json.load(open(os.path.join(ROOT, "catalog-lite.json")))

meta = {}
for w in lite:
    wid = w["file"].rsplit(".", 1)[0]
    meta[wid] = w

works = []
for c in chromatic:
    m = meta.get(c["id"])
    if m is None:
        raise SystemExit(f"{c['id']} in chromatic.json but not catalog-lite.json")
    works.append({
        "i": c["id"],
        "y": c["year"],
        "c": c["bg"],
        "t": m["title"],
        "yd": m["year_display"],
        "m": m["work_type"],
        "o": (m.get("orientation") or "vertical")[0],  # v / h / s
        "x": 1 if m.get("composite") else 0,
    })

works.sort(key=lambda w: (w["y"], w["i"]))

out = os.path.join(ROOT, "v2", "current.json")
with open(out, "w") as f:
    json.dump(works, f, separators=(",", ":"))

print(f"{len(works)} works → {out} ({os.path.getsize(out)//1024} KB)")

# ---- guernica.json: the passage's subset, with true aspect ratios ----
dims = json.load(open(os.path.join(ROOT, "dims.json")))
guernica = []
for w in works:
    if meta[w["i"]].get("series") == "Guernica":
        g = dict(w)
        wh = dims.get(w["i"])
        if wh:
            g["w"], g["h"] = wh
        guernica.append(g)

gout = os.path.join(ROOT, "v2", "guernica.json")
with open(gout, "w") as f:
    json.dump(guernica, f, separators=(",", ":"))

print(f"{len(guernica)} works → {gout} ({os.path.getsize(gout)//1024} KB)")

# ---- openings.json: the 250 flagged composites, sectioned by what they depict ----
openings = []
for w in works:
    if not w["x"]:
        continue
    themes = meta[w["i"]].get("themes") or []
    o = dict(w)
    wh = dims.get(w["i"])
    if wh:
        o["w"], o["h"] = wh
    # gallery pictures first (rooms/crowds), then studio views, else placement-titled
    o["s"] = "gal" if "Gallery" in themes else ("stu" if "Studio" in themes else "plc")
    openings.append(o)

oout = os.path.join(ROOT, "v2", "openings.json")
with open(oout, "w") as f:
    json.dump(openings, f, separators=(",", ":"))

from collections import Counter
print(f"{len(openings)} works → {oout} ({os.path.getsize(oout)//1024} KB)",
      dict(Counter(o['s'] for o in openings)))

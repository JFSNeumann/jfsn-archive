#!/usr/bin/env python3
"""
Post-deploy verification — checks the live site is healthy.
Run automatically by deploy.sh, or manually: python3 artworks/verify_deploy.py
"""

import urllib.request, json, sys
from pathlib import Path

SITE = "https://jfsn.com"
OK   = "✅"
FAIL = "❌"
WARN = "⚠️ "
errors = 0
warnings = 0

def fetch(path):
    try:
        req = urllib.request.Request(
            f"{SITE}{path}",
            headers={
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
                "Accept": "text/html,application/json,*/*",
            }
        )
        with urllib.request.urlopen(req, timeout=15) as r:
            return r.status, r.read()
    except Exception as e:
        return 0, str(e).encode()

def check(label, path, expect_status=200, contains=None, json_check=None, warn_only=False):
    global errors, warnings
    status, body = fetch(path)
    ok = status == expect_status
    if contains and ok:
        ok = contains.encode() in body
    extra = ""
    if json_check and ok:
        try:
            data = json.loads(body)
            result = json_check(data)
            if result is not True:
                ok = False
                extra = f" ({result})"
        except Exception as e:
            ok = False
            extra = f" (JSON error: {e})"
    if ok:
        icon = OK
    elif warn_only:
        icon = WARN
        warnings += 1
    else:
        icon = FAIL
        errors += 1
    print(f"  {icon}  {label}{extra}")
    if not ok and warn_only:
        print(f"       (new directories may take ~1-2h to propagate on this host)")

def leak_check():
    """Any local top-level directory not explicitly known-public must NOT be
    reachable on the live site. Catches the design-concepts/ leak failure mode
    (that one slipped through because nothing checked new top-level folders)."""
    global errors
    root = Path(__file__).parent.parent
    KNOWN_PUBLIC = {"_shared", "api", "artworks"}
    HIDDEN_OR_VCS = {".git", ".claude", ".netlify", "node_modules"}
    found_any = False
    for entry in sorted(root.iterdir()):
        if not entry.is_dir() or entry.name in KNOWN_PUBLIC or entry.name in HIDDEN_OR_VCS:
            continue
        found_any = True
        status, _ = fetch(f"/{entry.name}/")
        ok = status in (403, 404, 0)
        icon = OK if ok else FAIL
        if not ok:
            errors += 1
        print(f"  {icon}  leak-check: /{entry.name}/ → {status} (expected non-200; add to deploy.sh excludes if new)")
    if not found_any:
        print(f"  {OK}  leak-check: no unexpected top-level directories")

print(f"\nVerifying {SITE} …\n")

print("Leak check (unexpected public top-level folders):")
leak_check()
print()

# Pages
check("index.html",          "/index.html")
check("archive.html",        "/archive.html")
check("about.html",          "/about.html")
check("lost.html",           "/lost.html")
check("api.html",            "/api.html")
check("companion.html",      "/companion.html")

# Catalog
check("catalog-home.json — exists",   "/catalog-home.json",
      json_check=lambda d: True if isinstance(d, list) and len(d) > 0 else f"got {len(d)} records")
check("catalog-home.json — featured", "/catalog-home.json",
      json_check=lambda d: True if sum(1 for r in d if r.get("featured")) >= 1 else "no featured works")
check("catalog-lite.json",   "/catalog-lite.json",
      json_check=lambda d: True if len(d) >= 1000 else f"only {len(d)} records")

# API — warn_only because new directories take ~1-2h to propagate on this host
check("api/v1/meta.json",    "/api/v1/meta.json",
      json_check=lambda d: True if d.get("api_version") == "1" else "wrong api_version",
      warn_only=True)
check("api/v1/works.json",   "/api/v1/works.json",  warn_only=True)
check("api/v1/themes.json",  "/api/v1/themes.json", warn_only=True)

# Service worker — cache key is jfsn-YYYYMMDDHHMMSS (auto-bumped by build_catalog.py)
check("sw.js — CACHE_V",     "/sw.js",
      contains="jfsn-")

# Assets
check("search.js",           "/search.js")
check("icon-192.png",        "/icon-192.png")
check("manifest.json",       "/manifest.json")

summary = []
if errors == 0 and warnings == 0:
    summary.append("All checks passed.")
if errors > 0:
    summary.append(f"{errors} check(s) failed — review above.")
if warnings > 0:
    summary.append(f"{warnings} warning(s) — see above.")
print(f"\n{' '.join(summary)}\n")
sys.exit(0 if errors == 0 else 1)

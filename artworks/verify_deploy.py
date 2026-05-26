#!/usr/bin/env python3
"""
Post-deploy verification — checks the live site is healthy.
Run automatically by deploy.sh, or manually: python3 artworks/verify_deploy.py
"""

import urllib.request, json, sys

SITE = "https://jfsn.com"
OK   = "✅"
FAIL = "❌"
WARN = "⚠️ "
errors = 0

def fetch(path):
    try:
        with urllib.request.urlopen(f"{SITE}{path}", timeout=15) as r:
            return r.status, r.read()
    except Exception as e:
        return 0, str(e).encode()

def check(label, path, expect_status=200, contains=None, json_check=None):
    global errors
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
    icon = OK if ok else FAIL
    print(f"  {icon}  {label}{extra}")
    if not ok:
        errors += 1

print(f"\nVerifying {SITE} …\n")

# Pages
check("index.html",          "/index.html")
check("archive.html",        "/archive.html")
check("constellation.html",  "/constellation.html")
check("api.html",            "/api.html")
check("timeline.html",       "/timeline.html")
check("about.html",          "/about.html")

# Catalog
check("catalog-home.json — exists",   "/catalog-home.json",
      json_check=lambda d: True if isinstance(d, list) and len(d) > 0 else f"got {len(d)} records")
check("catalog-home.json — featured", "/catalog-home.json",
      json_check=lambda d: True if sum(1 for r in d if r.get("featured")) >= 1 else "no featured works")
check("catalog-lite.json",   "/catalog-lite.json",
      json_check=lambda d: True if len(d) >= 1000 else f"only {len(d)} records")

# API
check("api/v1/meta.json",    "/api/v1/meta.json",
      json_check=lambda d: True if d.get("api_version") == "1" else "wrong api_version")
check("api/v1/works.json",   "/api/v1/works.json")
check("api/v1/themes.json",  "/api/v1/themes.json")

# Service worker
check("sw.js — CACHE_V v2",  "/sw.js",
      contains="jfsn-v2")

# Assets
check("site.css",            "/site.css")
check("search.js",           "/search.js")
check("icon-192.png",        "/icon-192.png")
check("manifest.json",       "/manifest.json")

print(f"\n{'All checks passed.' if errors == 0 else f'{errors} check(s) failed — review above.'}\n")
sys.exit(0 if errors == 0 else 1)

#!/usr/bin/env python3
"""
Parse `git log` into changes.json — a typographic feed of every revision
to the archive. Renders at /changes.html.

Why: the archive is a living personal record, not a snapshot. The changelog
makes the ongoing work visible.

Run automatically by build_catalog.py. Can also be run standalone:
    python3 artworks/build_changes.py
"""
import json
import subprocess
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "changes.json"

# Delimiter unlikely to appear in a commit message
SEP = "<<<CHANGE-ENTRY>>>"
FIELD = "<<<FIELD>>>"


def main():
    fmt = f"%H{FIELD}%ai{FIELD}%s{FIELD}%b{SEP}"
    try:
        out = subprocess.check_output(
            ["git", "log", "--no-merges", f"--pretty=format:{fmt}", "main"],
            cwd=str(ROOT),
            text=True,
        )
    except subprocess.CalledProcessError as e:
        print(f"ERROR: git log failed: {e}")
        return

    entries = []
    for chunk in out.split(SEP):
        chunk = chunk.strip()
        if not chunk:
            continue
        parts = chunk.split(FIELD, 3)
        if len(parts) < 4:
            continue
        sha, iso_date, title, body = parts
        # Trim co-author trailers from the body — they're noise in a public feed
        body_lines = []
        for line in body.split("\n"):
            if re.match(r"^\s*Co-Authored-By:", line, re.I):
                continue
            body_lines.append(line.rstrip())
        # Collapse multiple blank lines + strip surrounding blanks
        body_text = "\n".join(body_lines).strip()
        body_text = re.sub(r"\n{3,}", "\n\n", body_text)

        # Date as YYYY-MM-DD
        date = iso_date.split(" ")[0] if iso_date else ""

        entries.append({
            "sha": sha[:7],
            "date": date,
            "title": title.strip(),
            "body": body_text,
        })

    OUT.write_text(json.dumps(entries, indent=2, ensure_ascii=False))
    print(f"  changes.json    — {len(entries)} commits")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
JFSN local curation server.
Serves static files + accepts POST /save-session to persist curate-session.json.
Usage: python3 server.py
"""
import json, os
from http.server import SimpleHTTPRequestHandler, HTTPServer
from pathlib import Path

ROOT = Path(__file__).parent
PORT = 3900

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_POST(self):
        if self.path == '/save-session':
            length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(length)
            try:
                data = json.loads(body)
                out = ROOT / 'curate-session.json'
                out.write_text(json.dumps(data, indent=2, sort_keys=True))
                self._json(200, {"ok": True})
                print(f"  [save] curate-session.json updated")
            except Exception as e:
                self._json(400, {"error": str(e)})

        elif self.path == '/rename-works':
            # Body: {"art0001": "New Title", "art0042": "Another Title", ...}
            length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(length)
            try:
                renames = json.loads(body)   # {artId: newTitle}
                full_dir = ROOT / 'artworks' / 'full'
                changed = []
                for art_id, new_title in renames.items():
                    new_title = new_title.strip()
                    if not new_title:
                        continue
                    jf = full_dir / f'{art_id}.json'
                    if not jf.exists():
                        continue
                    rec = json.loads(jf.read_text())
                    if rec.get('title') != new_title:
                        rec['title'] = new_title
                        jf.write_text(json.dumps(rec, indent=2))
                        changed.append(art_id)
                print(f"  [rename] {len(changed)} titles updated")
                # Rebuild catalog
                import subprocess, sys
                result = subprocess.run(
                    [sys.executable, str(ROOT / 'artworks' / 'build_catalog.py')],
                    cwd=str(ROOT), capture_output=True, text=True
                )
                print(f"  [build] {'ok' if result.returncode == 0 else 'FAILED'}")
                self._json(200, {"ok": True, "changed": len(changed),
                                 "build": result.returncode == 0})
            except Exception as e:
                self._json(400, {"error": str(e)})

        else:
            self.send_response(404)
            self.end_headers()

    def _json(self, code, data):
        payload = json.dumps(data).encode()
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(payload)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def log_message(self, fmt, *args):
        # Suppress noisy GET logs for images; show everything else
        if args and str(args[1]) == '200' and any(
            str(args[0]).endswith(ext) for ext in ('.avif', '.png', '.ico')
        ):
            return
        super().log_message(fmt, *args)

if __name__ == '__main__':
    os.chdir(ROOT)
    print(f"JFSN server on http://localhost:{PORT}")
    print(f"  Static files: {ROOT}")
    print(f"  Save endpoint: POST /save-session")
    HTTPServer(('', PORT), Handler).serve_forever()

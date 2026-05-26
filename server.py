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
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(b'{"ok":true}')
                print(f"  [save] curate-session.json updated")
            except Exception as e:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode())
        else:
            self.send_response(404)
            self.end_headers()

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

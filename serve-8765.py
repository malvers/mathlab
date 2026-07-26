#!/usr/bin/env python3
# Doc's local dev server for HTML/ (port 8765) — drop-in replacement for
# `python3 -m http.server 8765`, plus ONE write endpoint so the vsb-seal editor
# can persist the master SVG automatically (no manual export).
#
#   PUT /vsb-siegel-150mm-edit.svg   -> writes HTML/vsb-siegel-150mm-edit.svg
#
# Only this exact path is writable (allowlist), body limited to 8 MB, atomic
# replace via temp file. Everything else behaves like the stock http.server.
# Start:  python3 serve-8765.py   (from the repo root; serves HTML/ as web root)
import http.server
import json
import os
import subprocess
import sys

BASE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(BASE, 'HTML')
WRITABLE = {'/vsb-siegel-150mm-edit.svg'}
MAX_BYTES = 8 * 1024 * 1024
PIPE_PY = os.path.join(BASE, 'tools', 'vsb', '.venv', 'bin', 'python')
PIPE_RUN = os.path.join(BASE, 'tools', 'vsb', 'run_all.py')
PIPE_TMP = '/tmp/vsb-pipeline'
PIPE_LOCK = os.path.join(PIPE_TMP, 'build.lock')
PIPE_LOG = os.path.join(PIPE_TMP, 'build.log')


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def do_GET(self):
        if self.path.startswith('/__pipeline/status'):
            running = os.path.exists(PIPE_LOCK)
            tail = ''
            try:
                with open(PIPE_LOG) as f:
                    tail = ''.join(f.readlines()[-6:])
            except OSError:
                pass
            body = json.dumps({'running': running, 'log': tail}).encode()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Cache-Control', 'no-store')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        super().do_GET()

    def do_POST(self):
        if self.path != '/__pipeline':
            self.send_error(403, 'unknown endpoint')
            return
        if os.path.exists(PIPE_LOCK):
            self.send_response(409)
            self.end_headers()
            return
        subprocess.Popen([PIPE_PY, PIPE_RUN],
                         stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        self.send_response(202)
        self.end_headers()

    def do_PUT(self):
        if self.path not in WRITABLE:
            self.send_error(403, 'not writable')
            return
        try:
            n = int(self.headers.get('Content-Length', '0'))
        except ValueError:
            self.send_error(411, 'length required')
            return
        if not 0 < n <= MAX_BYTES:
            self.send_error(413, 'too large')
            return
        body = self.rfile.read(n)
        target = os.path.join(ROOT, self.path.lstrip('/'))
        tmp = target + '.tmp'
        try:
            with open(tmp, 'wb') as f:
                f.write(body)
            os.replace(tmp, target)
        except OSError as e:
            self.send_error(500, str(e))
            return
        self.send_response(204)
        self.end_headers()

    def log_message(self, fmt, *args):
        # keep PUTs visible, silence the GET spam like the old server didn't
        if args and str(args[0]).startswith('PUT'):
            super().log_message(fmt, *args)


if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
    print(f'serving {ROOT} on http://localhost:{port} (PUT enabled for {WRITABLE})')
    http.server.ThreadingHTTPServer(('', port), Handler).serve_forever()

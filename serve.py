#!/usr/bin/env python3
"""Local dev server for HTML/ - like `python3 -m http.server`, plus a LOCAL badge.

Every HTML page served from here gets a small fixed "LOCAL" pill top right,
so a local tab can never be mistaken for docalvers.de again. Nothing in the
repo is touched: the badge is injected on the way out, only by this server.
Other local servers (pinker2) import inject() from here, so the badge lives once.

Decks (HTML/decks/*.html) also get the text editor (decks/deck-edit.js) and its two endpoints
/__deck/source and /__deck/save (tools/pptx/deck_edit.py) - editing exists only on this machine.
Every page also gets live reload (/__live/reload.js, tools/live_reload.py): it reloads itself when its file or
the scripts and styles it loads change (Doc, 17.09.2026).

    python3 serve.py            # 127.0.0.1:8765, serves the HTML/ folder
    python3 serve.py 8080       # other port
"""
import http.server
import importlib
import json
import os
import re
import sys

HTML_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'HTML')
TOOLS_PPTX = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'tools', 'pptx')
TOOLS = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'tools')
DECK_EDITOR = b'<script src="/decks/deck-edit.js"></script>\n'
LIVE_RELOAD = b'<script src="/__live/reload.js"></script>\n'
PORT = 8765
BIND = '127.0.0.1'

# Arial on purpose: debug overlays never wear Orbitron. Upsilon red tag, click-through, above everything, not on paper.
BADGE = (b'<div id="local-badge" style="position:fixed;top:8px;right:8px;z-index:2147483647;'
         b'pointer-events:none;font:700 15px/1 Arial,sans-serif;letter-spacing:.14em;'
         b'padding:7px 11px;border-radius:5px;background:rgb(176,36,24);color:#fff;'
         b'box-shadow:0 2px 8px rgba(0,0,0,.35)">LOCAL</div>'
         b'<style>@media print{#local-badge{display:none}}</style>\n')

BODY_END = re.compile(rb'</body\s*>', re.IGNORECASE)

# Red lambda for local tabs. Every page in HTML/ links resources/favicon.svg and
# resources/favicon.png, so swapping the two files here paints the tab icon red
# without touching a single page — the tab strip then shows at a glance which
# tabs come off this machine (Doc, 08.09.2026).
LOCAL_ICONS = {
    '/resources/favicon.svg': 'resources/favicon-local.svg',
    '/resources/favicon.png': 'resources/favicon-local.png',
}


def local_icon(path):
    """The red twin to serve instead of `path`, or None when it is not an icon request.

    Every local server imports this, not just :8765 - the review servers (filmkritik,
    tourkritik) served the yellow lambda for months, so their tabs looked live
    (Doc, 20.09.2026: "alle lokalen sollen rot sein").
    """
    swap = LOCAL_ICONS.get(path.split('?', 1)[0])
    if swap and os.path.isfile(os.path.join(HTML_DIR, swap)):
        return '/' + swap
    return None


def inject(html, extra=b''):
    """Put the badge (and `extra`) right before the last </body>; pages without one get it appended."""
    hits = list(BODY_END.finditer(html))
    if not hits:
        return html + BADGE + extra
    i = hits[-1].start()
    return html[:i] + BADGE + extra + html[i:]


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=HTML_DIR, **kwargs)

    def end_headers(self):
        """Never let the browser keep anything from the dev server.

        Without a Cache-Control header the browser GUESSES how long a file stays
        fresh (a heuristic from Last-Modified), and it guessed wrong: an edited
        .js kept being served from Chrome's cache while the file on disk was
        already new - the page then shows old behaviour and even Cmd-Shift-R
        does not always cure it (Doc, 01.09.2026, the group switch that "always
        said FOS"). no-store means: ask every time. Costs nothing on localhost.
        """
        self.send_header('Cache-Control', 'no-store, max-age=0')
        super().end_headers()

    def deck_api(self):
        """The deck editor's endpoints - the module is reloaded per call, so no restart after a change."""
        n = int(self.headers.get('Content-Length') or 0)
        if n > 1024 * 1024:
            return self.send_error(413, 'too large')
        data = self.rfile.read(n) if n else b''
        try:
            if TOOLS_PPTX not in sys.path:
                sys.path.insert(0, TOOLS_PPTX)
            import deck_edit
            deck_edit = importlib.reload(deck_edit)
            status, reply = deck_edit.handle(self.command, self.path, self.headers, data)
        except Exception as err:                       # the page shows this instead of an empty reply
            status, reply = 500, {'error': 'serve.py: %s: %s' % (type(err).__name__, err)}
        body = json.dumps(reply, ensure_ascii=False).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def live_api(self):
        """Live reload (tools/live_reload.py) - reloaded per call, so a change there needs no restart."""
        try:
            if TOOLS not in sys.path:
                sys.path.insert(0, TOOLS)
            import live_reload
            status, ctype, body = importlib.reload(live_reload).handle(self.path)
        except Exception as err:
            status, ctype, body = 500, 'application/json', json.dumps({'error': str(err)}).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', ctype)
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def proben_api(self):
        """Handwriting probes for vorrechnen.html (tools/proben.py) - reloaded per call, no restart after a change."""
        n = int(self.headers.get('Content-Length') or 0)
        if n > 4 * 1024 * 1024:
            return self.send_error(413, 'too large')
        data = self.rfile.read(n) if n else b''
        try:
            if TOOLS not in sys.path:
                sys.path.insert(0, TOOLS)
            import proben
            status, reply = importlib.reload(proben).handle(self.command, self.path, self.headers, data)
        except Exception as err:
            status, reply = 500, {'error': 'serve.py: %s: %s' % (type(err).__name__, err)}
        body = json.dumps(reply, ensure_ascii=False).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self):
        if self.path.startswith('/__deck/'):
            return self.deck_api()
        if self.path.startswith('/__proben/'):
            return self.proben_api()
        self.send_error(405, 'read-only server')

    def do_GET(self):
        if self.path.startswith('/__deck/'):
            return self.deck_api()
        if self.path.startswith('/__proben/'):
            return self.proben_api()
        if self.path.startswith('/__live/'):
            return self.live_api()
        self.path = local_icon(self.path) or self.path   # served as usual, just the red file
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            if not self.path.split('?', 1)[0].endswith('/'):
                return super().do_GET()          # let the base class redirect to the slash form
            path = os.path.join(path, 'index.html')
        if not (path.lower().endswith(('.html', '.htm')) and os.path.isfile(path)):
            return super().do_GET()              # css, js, images, json ... untouched
        deck = os.path.dirname(os.path.abspath(path)) == os.path.join(HTML_DIR, 'decks')
        try:
            with open(path, 'rb') as f:
                body = inject(f.read(), LIVE_RELOAD + (DECK_EDITOR if deck else b''))
        except OSError:
            return self.send_error(404, 'File not found')
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Last-Modified', self.date_time_string(os.stat(path).st_mtime))
        self.end_headers()
        self.wfile.write(body)


if __name__ == '__main__':
    if len(sys.argv) > 1:
        PORT = int(sys.argv[1])
    if not os.path.isdir(HTML_DIR):
        sys.exit('HTML/ not found next to serve.py: ' + HTML_DIR)
    server = http.server.ThreadingHTTPServer((BIND, PORT), Handler)
    print(f'LOCAL server: http://{BIND}:{PORT}/  ->  {HTML_DIR}')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass

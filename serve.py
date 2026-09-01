#!/usr/bin/env python3
"""Local dev server for HTML/ - like `python3 -m http.server`, plus a LOCAL badge.

Every HTML page served from here gets a small fixed "LOCAL" pill top right,
so a local tab can never be mistaken for docalvers.de again. Nothing in the
repo is touched: the badge is injected on the way out, only by this server.
Other local servers (pinker2) import inject() from here, so the badge lives once.

    python3 serve.py            # 127.0.0.1:8765, serves the HTML/ folder
    python3 serve.py 8080       # other port
"""
import http.server
import os
import re
import sys

HTML_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'HTML')
PORT = 8765
BIND = '127.0.0.1'

# Arial on purpose: debug overlays never wear Orbitron. Upsilon red tag, click-through, above everything, not on paper.
BADGE = (b'<div id="local-badge" style="position:fixed;top:8px;right:8px;z-index:2147483647;'
         b'pointer-events:none;font:700 15px/1 Arial,sans-serif;letter-spacing:.14em;'
         b'padding:7px 11px;border-radius:5px;background:rgb(176,36,24);color:#fff;'
         b'box-shadow:0 2px 8px rgba(0,0,0,.35)">LOCAL</div>'
         b'<style>@media print{#local-badge{display:none}}</style>\n')

BODY_END = re.compile(rb'</body\s*>', re.IGNORECASE)


def inject(html):
    """Put the badge right before the last </body>; pages without one get it appended."""
    hits = list(BODY_END.finditer(html))
    if not hits:
        return html + BADGE
    i = hits[-1].start()
    return html[:i] + BADGE + html[i:]


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

    def do_GET(self):
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            if not self.path.split('?', 1)[0].endswith('/'):
                return super().do_GET()          # let the base class redirect to the slash form
            path = os.path.join(path, 'index.html')
        if not (path.lower().endswith(('.html', '.htm')) and os.path.isfile(path)):
            return super().do_GET()              # css, js, images, json ... untouched
        try:
            with open(path, 'rb') as f:
                body = inject(f.read())
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

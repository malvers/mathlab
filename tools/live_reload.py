"""Live reload for the local dev server (serve.py, 127.0.0.1:8765) - never part of docalvers.de.

Doc, 17.09.2026: three agents change decks and labs at the same time, "jedesmal alles neu laden". serve.py puts
/__live/reload.js into every HTML page it serves; the page asks /__live/stamp every second whether its own file or
one of the scripts and styles it loads changed, and reloads itself when nobody is in the middle of something (see
RELOAD_JS). Each frame watches only itself, so a lab inside a deck slide reloads on its own.

serve.py reloads this module on every call - a change here needs no restart of the LaunchAgent.
"""
import json
import os
import re
from urllib.parse import urlsplit, parse_qs

HTML_DIR = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "HTML"))
DECKS = os.path.join(HTML_DIR, "decks")
# what a page loads itself: <script src>, <link href> (only .css counts below), and ES module imports in the page
REFS = re.compile(r'<script\b[^>]*\bsrc="([^"#?]+)"|<link\b[^>]*\bhref="([^"#?]+)"|\bfrom\s+[\'"]([^\'"#?]+\.m?js)[\'"]', re.I)
WATCHED = (".js", ".mjs", ".css")


def _local(ref, base):
    if re.match(r"^[a-z][a-z0-9+.-]*:|^//", ref, re.I):
        return None                                   # http:, data:, //cdn - not ours
    p = os.path.normpath(os.path.join(HTML_DIR, ref.lstrip("/")) if ref.startswith("/") else os.path.join(base, ref))
    return p if p.startswith(HTML_DIR + os.sep) else None


def files_for(page):
    """The page file and the local scripts and styles it loads, as paths on disk."""
    rel = urlsplit(page).path or "/"
    if rel.endswith("/"):
        rel += "index.html"
    path = os.path.normpath(os.path.join(HTML_DIR, rel.lstrip("/")))
    if not path.startswith(HTML_DIR + os.sep):
        return []
    out = [path]
    try:
        with open(path, encoding="utf-8", errors="replace") as f:
            text = f.read()
    except OSError:
        return out
    base = os.path.dirname(path)
    for groups in REFS.findall(text):
        p = _local(next(g for g in groups if g), base)
        if p and p.endswith(WATCHED):
            out.append(p)
    if base == DECKS:                                 # serve.py injects the editor into decks - not in the file
        out += [os.path.join(DECKS, "deck-edit.js"), os.path.join(DECKS, "deck-image.js")]
    return out


def stamp(page):
    newest = 0
    for p in files_for(page):
        try:
            newest = max(newest, os.stat(p).st_mtime_ns)
        except OSError:
            pass
    return str(newest)


RELOAD_JS = r"""// Live reload - only on Doc's machine: serve.py puts this into every page, docalvers.de never has it.
// The page asks every second (a frame every 3 s) whether it or its scripts/styles changed and then reloads itself -
// but never while someone types, a deck is in edit mode or runs fullscreen, Solita talks or her panel is open, or in
// the presenter window; it simply tries again a moment later. The deck editor calls __liveReload.rebase() after each
// of its own writes, so saving a text or moving a picture never counts as a change. (tools/live_reload.py)
(function () {
  if (window.__liveReload) return;
  const page = location.pathname;
  const TYPING = 'input:not([type]),input[type=text],input[type=search],input[type=number],input[type=password],'
    + 'input[type=email],input[type=url],textarea,[contenteditable]';
  let first = null;
  function busy() {
    const a = document.activeElement;
    if (a && a.matches && (a.isContentEditable || a.matches(TYPING))) return true;
    if (document.fullscreenElement) return true;
    if (document.documentElement.classList.contains('deck-edit')) return true;   // a reload would drop the editing
    if (document.documentElement.classList.contains('presenter')) return true;
    const ask = document.getElementById('ask-panel');
    if (ask && !ask.hidden) return true;
    try { if (typeof narr !== 'undefined' && narr.playing) return true; } catch (e) { }
    return false;
  }
  function check() {
    if (document.visibilityState !== 'visible') return;
    fetch('/__live/stamp?page=' + encodeURIComponent(page), { cache: 'no-store' })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (first === null) { first = j.stamp; return; }
        if (j.stamp === first || busy()) return;
        location.reload();
      })
      .catch(function () { });                        // server restarting: next round
  }
  // the page wrote a file itself (deck editor): what is on disk now is what it shows
  window.__liveReload = {
    rebase: function () {
      fetch('/__live/stamp?page=' + encodeURIComponent(page), { cache: 'no-store' })
        .then(function (r) { return r.json(); }).then(function (j) { first = j.stamp; }).catch(function () { });
    }
  };
  setInterval(check, window.top === window ? 1000 : 3000);
  document.addEventListener('visibilitychange', check);
  check();
})();
"""


def handle(path):
    """(status, content type, body bytes) for /__live/..."""
    url = urlsplit(path)
    if url.path == "/__live/reload.js":
        return 200, "application/javascript; charset=utf-8", RELOAD_JS.encode("utf-8")
    if url.path == "/__live/stamp":
        page = parse_qs(url.query).get("page", ["/"])[0]
        return 200, "application/json", json.dumps({"stamp": stamp(page)}).encode("utf-8")
    return 404, "application/json", b'{"error": "unknown"}'

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
        out += [os.path.join(DECKS, f) for f in ("deck-edit.js", "deck-image.js", "deck-label.js")]
    return out


def stamp(page, refs=()):
    """Newest mtime of everything the page hangs on.

    files_for() only sees what stands in the HTML. Scripts that another script loads at runtime are invisible to it -
    HTML/svp/svp-plan.js writes its twenty parts with document.write and builds their names by string concat, so
    editing svp-plan-untis.js changed nothing and the plan pages did not reload (Doc, 20.09.2026: "wieso laedt das
    nicht automatisch?"). The page therefore reports what it ACTUALLY loaded (RELOAD_JS: document.scripts and the
    stylesheet links); only files under HTML/ count, like everywhere else here.
    """
    paths = files_for(page)
    for ref in refs:
        p = _local(ref, HTML_DIR)
        if p and p.endswith(WATCHED) and p not in paths:
            paths.append(p)
    newest = 0
    for p in paths:
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
  let first = null, firstRefs = '';
  // What the page really loaded - including the scripts another script pulled in (svp-plan.js writes its parts with
  // document.write; nothing in the HTML names them). Same origin and only .js/.mjs/.css: the server watches nothing
  // else anyway.
  function refs() {
    const out = [];
    function add(u) {
      if (!u) return;
      try {
        const x = new URL(u, location.href);
        if (x.origin !== location.origin) return;
        if (!/\.(m?js|css)$/i.test(x.pathname)) return;
        if (out.indexOf(x.pathname) < 0) out.push(x.pathname);
      } catch (e) { }
    }
    for (const s of document.scripts) add(s.src);
    for (const l of document.querySelectorAll('link[rel=stylesheet]')) add(l.href);
    // Same trap on the CSS side: svp.css pulls its parts in with @import, and an imported sheet hangs in no
    // <link>. Without this, editing one of the parts would never reload the page. Same-origin sheets hand out
    // their rules; a foreign one throws and is skipped.
    function imports(sheet) {
      let rules = null;
      try { rules = sheet.cssRules; } catch (e) { return; }
      for (const r of rules || []) {
        if (r.styleSheet) { add(r.styleSheet.href); imports(r.styleSheet); }
      }
    }
    for (const sheet of document.styleSheets) imports(sheet);
    return out.sort().join(',');
  }
  function busy() {
    const a = document.activeElement;
    if (a && a.matches && (a.isContentEditable || a.matches(TYPING))) return true;
    if (document.fullscreenElement) return true;
    if (document.documentElement.classList.contains('deck-edit')) return true;   // a reload would drop the editing
    if (document.documentElement.classList.contains('presenter')) return true;
    const ask = document.getElementById('ask-panel');
    if (ask && !ask.hidden) return true;
    try { if (typeof narr !== 'undefined' && narr.playing) return true; } catch (e) { }
    // any page can say "not now" without this file knowing it (filmkritik.html: a remark is being
    // recorded or the film is running - a reload would lose both)
    try { if (typeof window.__liveReloadBusy === 'function' && window.__liveReloadBusy()) return true; } catch (e) { }
    return false;
  }
  function check() {
    if (document.visibilityState !== 'visible') return;
    const now = refs();
    fetch('/__live/stamp?page=' + encodeURIComponent(page) + '&refs=' + encodeURIComponent(now), { cache: 'no-store' })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        // A page that loads more scripts later watches more files than a moment ago - that is a longer list, not a
        // change on disk. Taking it for one would reload, and after the reload again: a loop. So: take the new
        // ground and wait for a REAL change.
        if (first === null || now !== firstRefs) { first = j.stamp; firstRefs = now; return; }
        if (j.stamp === first || busy()) return;
        location.reload();
      })
      .catch(function () { });                        // server restarting: next round
  }
  // the page wrote a file itself (deck editor): what is on disk now is what it shows
  window.__liveReload = {
    rebase: function () {
      const now = refs();
      fetch('/__live/stamp?page=' + encodeURIComponent(page) + '&refs=' + encodeURIComponent(now), { cache: 'no-store' })
        .then(function (r) { return r.json(); })
        .then(function (j) { first = j.stamp; firstRefs = now; }).catch(function () { });
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
        q = parse_qs(url.query)
        page = q.get("page", ["/"])[0]
        refs = [r for r in q.get("refs", [""])[0].split(",") if r]
        return 200, "application/json", json.dumps({"stamp": stamp(page, refs)}).encode("utf-8")
    return 404, "application/json", b'{"error": "unknown"}'

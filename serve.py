#!/usr/bin/env python3
"""Local dev server for HTML/ - like `python3 -m http.server`, plus a LOCAL badge.

Every HTML page served from here gets a red glowing frame around the whole window
(the "LOCAL badge", id local-badge), so a local tab can never be mistaken for
docalvers.de again. Nothing in the
repo is touched: the badge is injected on the way out, only by this server.
Other local servers (pinker2) import inject() from here, so the badge lives once.

Decks (HTML/decks/*.html) also get the text editor (decks/deck-edit.js) and its two endpoints
/__deck/source and /__deck/save (tools/pptx/deck_edit.py) - editing exists only on this machine.
Every page also gets live reload (/__live/reload.js, tools/live_reload.py): it reloads itself when its file or
the scripts and styles it loads change (Doc, 17.09.2026).
The plans' "Notizen" button opens Doc's DocMitschrift of a week from /__mitschrift/ (docmitschrift-app/mitschrift_seite.py,
school data from ~/Documents/mitschrift, so it exists only here, never on docalvers.de); /__mitschrift/tag shows a day,
and a POST to /__mitschrift/papierkorb hides one section of it, never deleting anything.

    python3 serve.py            # http://localhost:8765, serves the HTML/ folder
    python3 serve.py 8080       # other port

The address to open and to hand out is ALWAYS localhost, never 127.0.0.1: a page opened under 127.0.0.1 is
redirected there (Handler.one_address), so everything a page remembers lives under one address.
"""
import http.server
import importlib
import json
import os
import re
import subprocess
import sys
import time

HTML_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'HTML')
TOOLS_PPTX = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'tools', 'pptx')
TOOLS = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'tools')
DECK_EDITOR = b'<script src="/decks/deck-edit.js"></script>\n'
LIVE_RELOAD = b'<script src="/__live/reload.js"></script>\n'
PORT = 8765
BIND = '127.0.0.1'

# Doc, 19.11.2026: "der geht nicht ganz nach rechts bis zur Browserfensterkante". With classic scroll bars (a mouse on
# the Mac) a fixed box ends at the page's scroll bar or at its reserved gutter (kalender, todo: scrollbar-gutter
# stable) and no page content can paint there. So while the frame measures such a strip, the root scroll bar is drawn
# by us - same width, so nothing moves - with the frame's red edge and glow on its outer side, and the frame itself
# slides under it so its own right line does not show twice. A reserved gutter without a scroll bar gets
# overflow-y:scroll (a scroll bar exactly where the gutter is), unless the body's overflow would then stop locking
# the page. Overlay scroll bars: no strip, nothing done. No pulse: a scroll bar cannot pulse along with the frame.
# Doc, 19.11.2026: "dann machst du ihn in der Hintergrundfarbe ... Das soll direkt übergehen" - the strip shows,
# row by row, the colour the page shows right next to it (DocCal's white toolbar, then the page background, with the
# toolbar's bottom line), read again on theme changes, DOM changes, scrolling and resizing; the thumb stays faint.
FRAME_JS = """(function () {
    var b = document.getElementById("local-badge");
    if (!b || !window.ResizeObserver || !document.elementsFromPoint) return;
    var de = document.documentElement, gx = 0, gy = 0, gut = false, th = "", painted = "", queued = 0, last = 0, mo = null;
    var R = "rgb(176,36,24)", P = ",rgba(176,36,24,.31) 2px,rgba(176,36,24,.17) 8px,rgba(176,36,24,.06) 14px,rgba(176,36,24,0) 24px)";
    function L(d) { return "linear-gradient(to " + d + "," + R + " 2px" + P; }   // the frame's own profile, measured
    var st = document.createElement("style"), sk = document.createElement("style");   // bar shape / bar colours
    st.id = "local-badge-bar"; sk.id = "local-badge-paint";
    b.parentNode.insertBefore(sk, b.nextSibling); b.parentNode.insertBefore(st, b.nextSibling);
    function rgba(t) {
        var m = (t || "").match(/-?[\\d.]+/g);
        if (!m || m.length < 3) return [0, 0, 0, 0];
        var f = /^color\\(srgb/.test(t) ? 255 : 1;
        return [m[0] * f, m[1] * f, m[2] * f, m.length > 3 ? +m[3] : 1];
    }
    function canvas() {
        var k = rgba(getComputedStyle(de).backgroundColor);
        if (k[3]) return k;
        k = rgba(getComputedStyle(document.body).backgroundColor);
        return k[3] ? k : [255, 255, 255, 1];
    }
    function css(k) { return "rgb(" + Math.round(k[0]) + "," + Math.round(k[1]) + "," + Math.round(k[2]) + ")"; }
    // a fixed, window-wide ::before / ::after of body or html with a picture (svp's "natur" photo): what lies behind
    function backdrop() {
        var els = [document.body, de], ps = ["::before", "::after"], i, j, s;
        for (i = 0; i < 2; i++) for (j = 0; j < 2; j++) {
            s = getComputedStyle(els[i], ps[j]);
            if (s.content !== "none" && s.display !== "none" && s.position === "fixed" && s.backgroundImage !== "none"
                && s.top === "0px" && s.left === "0px" && s.right === "0px" && s.bottom === "0px") return s;
        }
        return null;
    }
    var bd = null, prop = false, imgs = {};
    // what the page shows at a point: backgrounds (or a top / bottom border) stacked front to back, the canvas below;
    // with a backdrop the rest is left see-through, the backdrop's own layers fill it in
    function colorAt(x, y) {
        var els = document.elementsFromPoint(x, y), c = [0, 0, 0], a = 0, i, s, k, r, w, bt, bb;
        for (i = 0; i < els.length && a < 0.995; i++) {
            if (bd && (els[i] === de || (els[i] === document.body && prop))) break;   // painted behind the backdrop
            s = getComputedStyle(els[i]);
            if (bd && s.backgroundImage !== "none" && /fixed/.test(s.backgroundAttachment)) break;   // the photo again
            bt = parseFloat(s.borderTopWidth) || 0; bb = parseFloat(s.borderBottomWidth) || 0;
            if (bt || bb) {   // a top / bottom border line, over the element's own background
                r = els[i].getBoundingClientRect(); k = null;
                if (bt && y < r.top + bt) k = rgba(s.borderTopColor);
                else if (bb && y >= r.bottom - bb) k = rgba(s.borderBottomColor);
                if (k && k[3]) { w = (1 - a) * k[3]; c[0] += w * k[0]; c[1] += w * k[1]; c[2] += w * k[2]; a += w; }
            }
            k = rgba(s.backgroundColor);
            if (!k[3]) continue;
            w = (1 - a) * k[3]; c[0] += w * k[0]; c[1] += w * k[1]; c[2] += w * k[2]; a += w;
        }
        if (a < 0.995) {
            if (bd) return a ? "rgba(" + Math.round(c[0] / a) + "," + Math.round(c[1] / a) + "," + Math.round(c[2] / a) + "," + a.toFixed(3) + ")" : "transparent";
            k = canvas(); w = 1 - a; c[0] += w * k[0]; c[1] += w * k[1]; c[2] += w * k[2];
        }
        return css(c);
    }
    // the column just left of the strip, top to bottom, as hard colour stops (every 8 px, exact at each change)
    function column(x, h) {
        var prev = colorAt(x, 0), from = 0, ok = 0, stops = [], y, k, c;
        while (ok < h - 1) {
            y = Math.min(ok + 8, h - 1);
            if (colorAt(x, y) === prev) { ok = y; continue; }
            for (k = ok + 1; (c = colorAt(x, k)) === prev; k++);
            stops.push(prev + " " + from + "px " + k + "px"); prev = c; from = ok = k;
        }
        stops.push(prev + " " + from + "px");
        return "linear-gradient(" + (stops.length > 1 ? stops.join(",") : prev + "," + prev) + ")";
    }
    function split(t) {   // a comma list of CSS values, commas inside brackets left alone
        var out = [], depth = 0, cur = "", i, ch;
        for (i = 0; i < t.length; i++) {
            ch = t[i];
            if (ch === "(") depth++; else if (ch === ")") depth--;
            if (ch === "," && !depth) { out.push(cur.trim()); cur = ""; } else cur += ch;
        }
        out.push(cur.trim());
        return out;
    }
    function len(v, free) { return /%$/.test(v) ? parseFloat(v) / 100 * free : parseFloat(v) || 0; }
    // a picture that ends right at the page edge: its last pixel column, drawn out over the strip
    var cv = null, cols = {};
    function edge(f, u, sx, y0, th) {
        var key = u + "|" + Math.round(sx) + "|" + Math.round(y0) + "|" + Math.round(th), N = 48, i, d, out = [];
        if (key in cols) return cols[key];
        try {
            cv = cv || document.createElement("canvas"); cv.width = 1; cv.height = N;
            var g = cv.getContext("2d"); g.clearRect(0, 0, 1, N);
            g.drawImage(f, Math.max(0, Math.min(f.naturalWidth - 1, Math.floor(sx))), 0, 1, f.naturalHeight, 0, 0, 1, N);
            d = g.getImageData(0, 0, 1, N).data;
            for (i = 0; i < N; i++) out.push("rgba(" + d[4 * i] + "," + d[4 * i + 1] + "," + d[4 * i + 2] + "," + (d[4 * i + 3] / 255).toFixed(3) + ") " + (y0 + (i + 0.5) * th / N).toFixed(1) + "px");
            return (cols[key] = "linear-gradient(" + out.join(",") + ")");
        } catch (e) { return (cols[key] = ""); }   // a picture from another site: the plain colour has to do
    }
    // the backdrop's layers continued into the strip: same tile size and place as on the page (box w x h), moved by w
    function behind(s, w, h) {
        var im = split(s.backgroundImage), sz = split(s.backgroundSize), pos = split(s.backgroundPosition),
            rep = split(s.backgroundRepeat), out = [], i, u, n, m, f, tw, th, p;
        for (i = 0; i < im.length; i++) {
            u = im[i].match(/^url\\(\\s*["']?([^"')]+)/); n = null;
            if (u) {
                f = imgs[u[1]];
                if (!f) { f = imgs[u[1]] = new Image(); f.onload = later; f.src = u[1]; }
                if (!f.naturalWidth) continue;   // still loading - the next paint has it
                n = [f.naturalWidth, f.naturalHeight];
            }
            m = (sz[i % sz.length] || "auto").split(" ");
            if (m[0] === "cover" || m[0] === "contain") {
                f = n ? Math[m[0] === "cover" ? "max" : "min"](w / n[0], h / n[1]) : 0;
                tw = n ? n[0] * f : w; th = n ? n[1] * f : h;
            } else {
                tw = m[0] === "auto" ? 0 : len(m[0], w); th = !m[1] || m[1] === "auto" ? 0 : len(m[1], h);
                if (!tw && !th) { tw = n ? n[0] : w; th = n ? n[1] : h; }
                else if (!tw) tw = n ? th * n[0] / n[1] : w;
                else if (!th) th = n ? tw * n[1] / n[0] : h;
            }
            p = (pos[i % pos.length] || "0% 0%").split(" ");
            m = len(p[0], w - tw); f = len(p[1] || "50%", h - th);
            if (u && m + tw < w + 1 && !/^repeat|round|space/.test(rep[i % rep.length] || "")) {
                u = edge(imgs[u[1]], u[1], (w - 1 - m) / tw * n[0], f, th);
                if (u) out.push(u);
                continue;
            }
            out.push(im[i] + " " + (m - w) + "px " + f + "px/" + tw + "px " + th + "px " + (rep[i % rep.length] || "repeat"));
        }
        return out;
    }
    function paint() {
        queued = 0; last = Date.now();
        if (!gx && !gy) return;
        var w = innerWidth - gx, x = Math.max(0, w - 1), h = Math.max(1, innerHeight - gy), hs = getComputedStyle(de);
        bd = backdrop(); prop = !rgba(hs.backgroundColor)[3] && hs.backgroundImage === "none";
        var under = "";
        if (bd) {
            var k = rgba(bd.backgroundColor), more = behind(bd, w, h);
            under = (more.length ? "," + more.join(",") : "") + "," + (k[3] ? bd.backgroundColor : css(canvas()));
        }
        var low = colorAt(x, h - 1), t = "html::-webkit-scrollbar-track:vertical{background:" + L("left") + "," + L("bottom") + "," + L("top") + "," + column(x, h) + under + "}"
            + "html::-webkit-scrollbar-track:horizontal{background:" + L("top") + "," + L("right") + "," + L("left") + ",linear-gradient(" + low + "," + low + ")" + under + "}"
            + "html::-webkit-scrollbar-corner{background:" + L("left") + "," + L("top") + ",linear-gradient(" + low + "," + low + ")" + under + "}";
        if (t === painted) return;
        painted = t; sk.textContent = t;
        // Chrome keeps painting a custom scroll bar as it was built - a new track style alone does not show:
        // take the bar away and give it back within this task (layout in between, no frame painted without it)
        var keep = st.textContent; st.textContent = ""; de.getBoundingClientRect(); st.textContent = keep;
    }
    function later() {   // at most every 150 ms, in a frame
        if (queued || (!gx && !gy)) return;
        queued = setTimeout(function () { requestAnimationFrame(paint); }, Math.max(0, 150 - (Date.now() - last)));
    }
    function fit() {
        if (!b.isConnected || getComputedStyle(b).display === "none") {   // hidden (focus / beamer) or removed (recordings)
            if (gx || gy) { gx = gy = 0; st.textContent = sk.textContent = painted = ""; if (mo) mo.disconnect(); }
            return;
        }
        var r = b.getBoundingClientRect();
        // the strip the frame misses on the right / at the bottom (the frame is already pushed out by gx / gy)
        var x = Math.round(innerWidth - r.right) + gx, y = Math.round(innerHeight - r.bottom) + gy;
        x = x > 1 ? x : 0; y = y > 1 ? y : 0;
        if (x === gx && y === gy) return;
        if (!gx && !gy) {
            var h = getComputedStyle(de);
            gut = /stable/.test(h.scrollbarGutter) && /visible|auto/.test(h.overflowY) && getComputedStyle(document.body).overflowY === "visible";
            // the page's own thumb colour (svp) stays; otherwise a faint grey
            var c = h.scrollbarColor && h.scrollbarColor !== "auto" ? h.scrollbarColor.match(/rgba?\\([^)]*\\)|#\\w+|[a-z]+/gi) : 0;
            th = c && c[0] || "rgba(128,128,128,.4)";
        }
        gx = x; gy = y;
        var n = Math.max(x, y);
        if (!n) { st.textContent = sk.textContent = painted = ""; if (mo) mo.disconnect(); return; }
        st.textContent = "html{scrollbar-width:auto!important;scrollbar-color:auto!important" + (gut ? ";overflow-y:scroll" : "") + "}"
            + "html::-webkit-scrollbar{width:" + n + "px;height:" + n + "px;background:transparent}"
            + "html::-webkit-scrollbar-thumb{background:" + th + ";background-clip:padding-box;border:4px solid transparent;border-radius:99px}"
            + "html #local-badge#local-badge{right:-" + x + "px!important;bottom:-" + y + "px!important}";
        paint();
        if (!mo) mo = new MutationObserver(later);   // theme switches, a toolbar that appears, ...
        mo.observe(de, { attributes: true, childList: true, subtree: true });
    }
    // fit() resizes the frame itself - outside the observer's callback, or Chrome reports a "ResizeObserver loop"
    new ResizeObserver(function () { requestAnimationFrame(fit); later(); }).observe(b);
    addEventListener("scroll", later, { passive: true });
    if (window.matchMedia) matchMedia("(prefers-color-scheme: dark)").addEventListener("change", later);
})()"""


# Doc, 19.11.2026: the "LOCAL" pill top right covered toolbar buttons (kalender) - "dass das ganze Ding so rot
# umrandet ist, so mit so einem Schein, wie das ist, wenn du dir den Chrome schnappst". So the badge is now a red
# glowing frame around the whole window: Upsilon red, click-through, above everything, not on paper. It keeps the
# id local-badge, so every page, tour and recording that hides or removes the badge still does. The doubled id +
# !important outrank the old per-page moves of the pill (buch.css, vorrechnen.css, buch-druck.js): a frame has
# nowhere to go. display stays free for the pages that hide it.
# Arial on purpose for the lag tag: debug overlays never wear Orbitron.
BADGE = (b'<div id="local-badge" aria-hidden="true"></div>'
         b'<style>#local-badge#local-badge{position:fixed!important;inset:0!important;width:auto!important;'
         b'height:auto!important;margin:0!important;transform:none!important;z-index:2147483647;pointer-events:none;'
         b'box-shadow:inset 0 0 0 2px rgb(176,36,24),inset 0 0 18px 4px rgba(176,36,24,.55)}'
         b'#local-badge>span{position:absolute;left:6px;bottom:6px;font:700 9px/1 Arial,sans-serif;'
         b'letter-spacing:.08em;padding:2px 6px;border-radius:3px;background:rgb(176,36,24);color:#fff}'
         b'@media print{#local-badge{display:none}}</style>'
         # a page in a frame (a deck's live widget, the 3D die) is part of the page around it, which wears the badge
         # already - a second one sat inside the slide (07.10.2026, unendliche-summe-live.html on slide 10)
         b'<script>if(window.top!==window){var lb=document.getElementById("local-badge");if(lb)lb.remove()}</script>'
         b'<script>' + FRAME_JS.encode('utf-8') + b'</script>\n')

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


# Doc, 26.10.2026: localhost showed a main checkout 538 commits behind GitHub and nobody noticed
# ("das ist missleading") - the badge of THIS server says how far behind origin/main its checkout is.
# The refs are shared by every worktree, so any agent's `git fetch` keeps the number fresh.
ROOT = os.path.dirname(os.path.abspath(__file__))
_lag = {'t': 0.0, 'n': 0}


def behind():
    """Commits this checkout lags behind origin/main; asked from git at most once a minute."""
    if time.time() - _lag['t'] > 60:
        try:
            out = subprocess.run(['git', 'rev-list', '--count', 'HEAD..origin/main'], cwd=ROOT,
                                 capture_output=True, text=True, timeout=5).stdout.strip()
            _lag['n'] = int(out or 0)
        except (OSError, ValueError, subprocess.SubprocessError):
            _lag['n'] = 0
        _lag['t'] = time.time()
    return _lag['n']


def inject(html, extra=b'', lag=False):
    """Put the badge (and `extra`) right before the last </body>; pages without one get it appended.
    lag=True (only this server, not the ones importing inject) adds a tiny "N hinter GitHub" tag bottom left
    inside the frame - only when the checkout is behind; the frame alone carries no text."""
    badge = BADGE
    n = behind() if lag else 0
    if n:
        badge = BADGE.replace(b'"true"></div>', ('"true"><span>%d hinter GitHub</span></div>' % n).encode('utf-8'))
    hits = list(BODY_END.finditer(html))
    if not hits:
        return html + badge + extra
    i = hits[-1].start()
    return html[:i] + badge + extra + html[i:]


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

    def log_request(self, code='-', size='-'):
        """No line for live reload's polling: every open page asks once a second, the log had grown to 2.7 GB (01.11.2026)."""
        if not getattr(self, 'path', '').startswith('/__live/stamp'):
            super().log_request(code, size)

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

    def termine_api(self):
        """The "war da" ticks of stundenplan.html (tools/termine_status.py) - reloaded per call, no restart after a change."""
        n = int(self.headers.get('Content-Length') or 0)
        if n > 4096:
            return self.send_error(413, 'too large')
        data = self.rfile.read(n) if n else b''
        try:
            if TOOLS not in sys.path:
                sys.path.insert(0, TOOLS)
            import termine_status
            status, reply = importlib.reload(termine_status).handle(self.command, self.path, self.headers, data)
        except Exception as err:
            status, reply = 500, {'error': 'serve.py: %s: %s' % (type(err).__name__, err)}
        body = json.dumps(reply, ensure_ascii=False).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def mail_api(self):
        """Mail drafts to the pupils who missed a test (tools/nachschreiber_mail.py) - reloaded per call, no restart
        after a change. It never sends; Doc presses Send in Outlook."""
        n = int(self.headers.get('Content-Length') or 0)
        if n > 256 * 1024:
            return self.send_error(413, 'too large')
        data = self.rfile.read(n) if n else b''
        try:
            if TOOLS not in sys.path:
                sys.path.insert(0, TOOLS)
            import nachschreiber_mail
            status, reply = importlib.reload(nachschreiber_mail).handle(self.command, self.path, self.headers, data)
        except Exception as err:
            status, reply = 500, {'ok': False, 'error': 'serve.py: %s: %s' % (type(err).__name__, err)}
        body = json.dumps(reply, ensure_ascii=False).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Cache-Control', 'no-store')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def mitschrift_api(self):
        """DocMitschrift for the plans' "Notizen" button (docmitschrift-app/mitschrift_seite.py, reloaded per call,
        Doc 06.11.2026). The text is school data from ~/Documents/mitschrift: only for pages of this server - and,
        to read only, for Doc's own devices through Tailscale Serve (Doc 09.11.2026: "ohne Push hier auch auf dem
        Telefon"). The trash and the editing (POST) stay on the Mac."""
        if not (self.local_caller() or (self.command == 'GET' and self.tailnet_owner())):
            return self.send_error(403, 'local pages only')
        here = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'docmitschrift-app')
        sent = b''
        served = b'reload.js?served=%d' % time.time_ns()   # before the build: what changes after this is not in the page
        if self.command == 'POST':               # a section into the trash or back (Doc 07.11.2026), a few bytes
            sent = self.rfile.read(min(int(self.headers.get('Content-Length') or 0), 65536))
        try:
            if here not in sys.path:
                sys.path.insert(0, here)
            import mitschrift_seite
            status, ctype, body = importlib.reload(mitschrift_seite).handle(self.path, self.command, sent)
        except Exception as err:
            status, ctype = 500, 'text/plain; charset=utf-8'
            body = ('serve.py: %s: %s' % (type(err).__name__, err)).encode('utf-8')
        if ctype.startswith('text/html'):
            # the LOCAL badge and live reload, like every page served here (live reload was missing until
            # 07.11.2026 - Doc: "ich muss jedes Mal einen harten Reload machen"); what it watches: tools/live_reload.py
            body = inject(body, LIVE_RELOAD.replace(b'reload.js', served))
        self.send_response(status)
        self.send_header('Content-Type', ctype)
        self.send_header('Cache-Control', 'no-store')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def local_caller(self):
        """Only our own pages may write here (audit 27.09.2026).

        The server binds to 127.0.0.1, but any web site open in the browser can still POST to it -
        with text/plain there is not even a preflight - and the deck editor writes files. So a POST
        must come from a page served here (Origin) and be addressed to this machine (Host).
        """
        ok = ('localhost', '127.0.0.1', '[::1]', '::1')
        host = (self.headers.get('Host') or '').rsplit(':', 1)[0]
        origin = self.headers.get('Origin') or ''
        origin_host = origin.split('//', 1)[-1].rsplit(':', 1)[0] if origin else host
        return host in ok and origin_host in ok

    TAILNET = {}

    def tailnet_owner(self):
        """True for a request that Tailscale Serve brings from the Mac's own owner (his phone, his tablet).

        The server binds to 127.0.0.1, so only this machine reaches it; Tailscale Serve proxies the tailnet to it,
        keeps the Host (<mac>.<tailnet>.ts.net) and adds Tailscale-User-Login for a request from a tailnet user.
        A web page in the browser can set neither (Host is the address it calls, a custom header needs a CORS
        preflight this server never grants). Name and login come from tailscaled itself, so the repo holds neither.
        """
        login = self.headers.get('Tailscale-User-Login') or ''
        host = (self.headers.get('Host') or '').rsplit(':', 1)[0].lower()
        if not login or not host.endswith('.ts.net'):
            return False
        me = self.TAILNET
        if time.time() - me.get('at', 0) > 300:   # asked again every 5 minutes; a missing tailscaled just says no
            me.clear()
            me['at'] = time.time()
            sock = os.path.expanduser('~/Library/Application Support/de.docalvers.tailscale/tailscaled.sock')
            exe = next((x for x in ('/opt/homebrew/bin/tailscale', '/usr/local/bin/tailscale') if os.path.exists(x)), 'tailscale')
            try:
                out = subprocess.run([exe, '--socket=' + sock, 'status', '--json'], capture_output=True, timeout=5, check=True)
                st = json.loads(out.stdout)
                me['host'] = (st['Self']['DNSName'] or '').rstrip('.').lower()
                me['login'] = st['User'][str(st['Self']['UserID'])]['LoginName']
            except (OSError, ValueError, KeyError, TypeError, subprocess.SubprocessError):
                pass
        return bool(me.get('login')) and login == me['login'] and host == me.get('host')

    UNTIS_CACHE = {}

    def untis_api(self):
        """Who is absent in Doc's current lesson of a group, read from WebUntis (Mission Control, 05.11.2026:
        a circle with a check for present, with an X for absent, as in WebUntis' class register).

        The names go WebUntis -> node (tools/webuntis.local.js `abwesend`) -> this server -> the browser on this
        Mac, nowhere else, and are kept only in memory for a minute so the school server is asked at most once a
        minute per group. Only our own pages, and only with the custom header (a foreign site cannot send it
        without a preflight this server never answers).
        """
        if not self.local_caller() or self.headers.get('X-Mission-Control') != '1':
            return self.send_error(403, 'local pages only')
        from urllib.parse import urlsplit, parse_qs
        q = parse_qs(urlsplit(self.path).query)
        gruppe = (q.get('gruppe') or [''])[0]
        tag = (q.get('tag') or [''])[0]
        zeit = (q.get('zeit') or [''])[0]          # HHMM: the lesson around that time (when the test ran)
        if not re.fullmatch(r'[A-Za-z0-9_-]{1,20}', gruppe) or (tag and not re.fullmatch(r'\d{8}', tag)) \
                or (zeit and not (tag and re.fullmatch(r'\d{4}', zeit))):
            return self.send_error(400, 'bad request')
        key = gruppe + '|' + tag + '|' + zeit
        hit = self.UNTIS_CACHE.get(key)
        if hit and time.time() - hit[0] < 60 and (q.get('frisch') or [''])[0] != '1':
            body = hit[1]
        else:
            node = next((n for n in ('/opt/homebrew/bin/node', '/usr/local/bin/node') if os.path.exists(n)), 'node')
            root = os.path.dirname(os.path.abspath(__file__))
            try:
                r = subprocess.run([node, os.path.join(root, 'tools', 'webuntis.js'), 'abwesend', gruppe]
                                   + ([tag] if tag else []) + (['--zeit=' + zeit] if zeit else []),
                                   capture_output=True, timeout=45, cwd=root)
                line = next((l for l in reversed(r.stdout.decode('utf-8', 'replace').splitlines()) if l.startswith('{')), '')
                body = line.encode('utf-8') if line else json.dumps({'ok': False, 'error': 'WebUntis antwortet nicht'}).encode()
            except subprocess.TimeoutExpired:
                body = json.dumps({'ok': False, 'error': 'WebUntis zu langsam'}).encode()
            if b'"ok":true' in body:
                self.UNTIS_CACHE[key] = (time.time(), body)
        self.send_response(200)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Cache-Control', 'no-store')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self):
        if not self.local_caller():
            return self.send_error(403, 'local pages only')
        if self.path.startswith('/__deck/'):
            return self.deck_api()
        if self.path.startswith('/__proben/'):
            return self.proben_api()
        if self.path.startswith('/__termine/'):
            return self.termine_api()
        if self.path.startswith('/__mail/'):
            return self.mail_api()
        if self.path.startswith('/__mitschrift/'):
            return self.mitschrift_api()
        self.send_error(405, 'read-only server')

    def one_address(self):
        """A page opened under 127.0.0.1 is sent on to localhost - True when the redirect went out.

        To the browser the two are different sites, each with its own localStorage: what a page remembers
        under one (Solita's password, the plans' login, settings) is missing under the other, and the page
        asks again as if nothing had ever been stored (Doc, 30.09.2026: an hour lost on vorrechnen.html,
        "unbedingt merken/fixen"). Only a page a browser navigates to is redirected (Sec-Fetch-Mode) -
        scripts, curl and the page's own requests get their answer as before.
        """
        if self.headers.get('Sec-Fetch-Mode') != 'navigate':
            return False
        host, _, port = (self.headers.get('Host') or '').rpartition(':')
        if host not in ('127.0.0.1', '[::1]'):
            return False
        self.send_response(307)
        self.send_header('Location', 'http://localhost:' + port + self.path)
        self.send_header('Content-Length', '0')
        self.end_headers()
        return True

    def do_GET(self):
        if self.one_address():
            return
        if self.path.startswith('/__deck/'):
            return self.deck_api()
        if self.path.startswith('/__proben/'):
            return self.proben_api()
        if self.path.startswith('/__live/'):
            return self.live_api()
        if self.path.startswith('/__untis/abwesend'):
            return self.untis_api()
        if self.path.startswith('/__mitschrift/'):
            return self.mitschrift_api()
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
            served = b'reload.js?served=%d' % time.time_ns()   # before the read: what changes after this is not in the page
            with open(path, 'rb') as f:
                body = inject(f.read(), LIVE_RELOAD.replace(b'reload.js', served) + (DECK_EDITOR if deck else b''), lag=True)
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
    print(f'LOCAL server: http://localhost:{PORT}/  ->  {HTML_DIR}')   # the one address to hand out (one_address)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass

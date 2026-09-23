"""Pictures on the slides of an HTML deck - DocPoint step 1 (Doc, 17.09.2026: "ich träume von DocPoint, das cooler ist
als PPT"). A picture dropped or pasted in the deck editor lands in the deck file and can be moved, resized and removed.

deck_edit.handle() forwards every /__deck/image path here, after its Host/Origin checks:

    POST /__deck/image/upload?deck=<name>.html   body: the picture, Content-Type image/...   -> {src}
    POST /__deck/image/pic  {deck, slide, op, ...}                                           -> {id, style, mtime, pending}
         op "add":  {src, x, y, w}              a new picture on slide `slide`
         op "move": {id, old, x, y, w, h?, r?}  only while the picture still has the style the page saw (old);
                                                h = stretched height, r = rotation in degrees
         op "del":  {id, old}
         op "free": {src, n, x, y, w, h?, del?}  a picture the generator placed (in a .pic, .below or .chap-pic box, or
                                                by hand with left/top) becomes a free-pic where it is shown - from then
                                                on it moves like any other (Doc, 23.09.2026: "verschieben etc ... IMMER!").
                                                n counts the slide's not-yet-free pictures with that src (mostly 0).
                                                del: it is removed instead of freed. A box that held only this picture
                                                goes with it.

A picture is one tag, always written the same way, with inline styles only (like the live frames) - deck.css needs no
rule and docalvers.de shows it as it is:

    <img class="free-pic" data-pic="1a2b3c4d" src="img/<deck>-<sha1:10>.webp" alt="" style="position:absolute;left:..">

It never sits inside a text element, so the text addresses of deck_edit.py (n-th SELECTOR match per slide) stay as they
are. The file is saved once per content (same picture, same file) under HTML/decks/img/, where publish() already finds
it - the green cloud takes it along. Reading, locking and writing are deck_edit.py's: one way to touch a deck.
"""
import hashlib
import json
import math
import os
import re
import secrets
import sys
from urllib.parse import urlsplit, parse_qs

HERE = os.path.dirname(os.path.abspath(__file__))
MAX_BYTES = 5 * 1024 * 1024      # Doc: nothing big in git, above 5 MB ask him - the page downscales long before this
EXT = {"image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/gif": "gif", "image/svg+xml": "svg"}
PIC = re.compile(r'<img class="free-pic" data-pic="([0-9a-f]{8})" src="([^"]*)" alt="" style="([^"]*)">')
IMG = re.compile(r'<img\b[^>]*>')
IMG_SRC = re.compile(r'\ssrc="([^"]*)"')
# a generator box that holds nothing but the picture: it leaves with it (an empty .pic/.below is invisible, an empty
# .chap-pic would stay as a bare card)
BOX_OPEN = re.compile(r'<(div|figure) class="(?:pic|below|chap-pic)(?: [a-z-]+)*">\s*$')
BOX_CLOSE = re.compile(r'\s*</(div|figure)>')
SRC = re.compile(r"img/[a-z0-9._-]+\.(?:png|jpg|webp|gif|svg)")
# an SVG in an <img> runs no script, but opened on its own on docalvers.de it would
SVG_ACTIVE = re.compile(rb"<script|\son[a-z]+\s*=|javascript:|<foreignObject", re.I)


def _edit():
    """deck_edit as serve.py just loaded it for this request - the forward came from there."""
    if HERE not in sys.path:
        sys.path.insert(0, HERE)
    import deck_edit
    return deck_edit


def _sniff(data):
    """The picture type by its first bytes - the Content-Type header alone could claim anything."""
    if data.startswith(b"\x89PNG\r\n\x1a\n"):
        return "image/png"
    if data.startswith(b"\xff\xd8\xff"):
        return "image/jpeg"
    if data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        return "image/webp"
    if data[:6] in (b"GIF87a", b"GIF89a"):
        return "image/gif"
    head = data[:4096].lstrip()
    if head.startswith((b"<?xml", b"<svg", b"<!--")) and b"<svg" in head:
        return "image/svg+xml"
    return None


def upload(deck, ctype, data):
    """Save the picture next to the deck's other pictures. Returns (status, reply)."""
    e = _edit()
    e._read(deck)                                     # a real deck with a valid name, or ValueError / OSError
    if not data:
        return 400, {"error": "Kein Bild angekommen."}
    if len(data) > MAX_BYTES:
        return 413, {"error": "Das Bild ist größer als 5 MB – bitte kleiner machen."}
    kind = _sniff(data)
    if kind is None or kind != ctype.split(";")[0].strip().lower():
        return 415, {"error": "Nur PNG, JPEG, WebP, GIF oder SVG."}
    if kind == "image/svg+xml" and SVG_ACTIVE.search(data):
        return 422, {"error": "Dieses SVG enthält Skript – so kommt es nicht ins Deck."}
    name = "%s-%s.%s" % (deck[:-5], hashlib.sha1(data).hexdigest()[:10], EXT[kind])
    path = os.path.join(e.DECKS, "img", name)
    if not os.path.exists(path):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        tmp = path + ".tmp"
        with open(tmp, "wb") as f:
            f.write(data)
        os.replace(tmp, path)
    return 200, {"src": "img/" + name}


def _num(q, key, lo, hi):
    v = float(q[key])
    if not (math.isfinite(v) and lo <= v <= hi):
        raise ValueError("%s out of range" % key)
    return round(v, 1)


def _style(q):
    """left/top/width in slide px (960x540), a height only once a side handle stretched the picture, a rotation
    only when it is turned - the only things the page may set."""
    style = "position:absolute;left:%gpx;top:%gpx;width:%gpx" % (
        _num(q, "x", -2000, 3000), _num(q, "y", -2000, 3000), _num(q, "w", 8, 3000))
    if q.get("h") is not None:
        style += ";height:%gpx" % _num(q, "h", 8, 3000)
    if q.get("r") is not None:
        r = _num(q, "r", -360, 360)
        if r % 360:
            style += ";transform:rotate(%gdeg)" % r
    return style


def _tag(pid, src, style):
    return '<img class="free-pic" data-pic="%s" src="%s" alt="" style="%s">' % (pid, src, style)


def pic(q):
    """Add, move or remove one picture on one slide. Returns (status, reply)."""
    e = _edit()
    gen = e._gen()
    deck, slide, op = q["deck"], int(q["slide"]), q["op"]
    if op not in ("add", "move", "del", "free"):
        return 400, {"error": "unknown op"}
    style = _style(q) if op in ("add", "move") or (op == "free" and not q.get("del")) else None
    with e._lock:
        page = e._read(deck)
        bounds = e.elements(page, gen)[1]
        if not 0 <= slide < len(bounds):
            return 409, {"error": "Diese Folie gibt es in der Datei nicht mehr – bitte neu laden."}
        a, b = bounds[slide]
        body = page[a:b]
        if op == "add":
            src = q["src"]
            if not SRC.fullmatch(src) or not os.path.isfile(os.path.join(e.DECKS, src)):
                return 422, {"error": "Das Bild liegt nicht (mehr) im Ordner img/."}
            pid = secrets.token_hex(4)
            while 'data-pic="%s"' % pid in page:
                pid = secrets.token_hex(4)
            end = body.rfind("</section>")
            if end < 0:
                return 409, {"error": "Die Folie ist in der Datei nicht vollständig – bitte neu laden."}
            foot = body.rfind('<p class="foot">', 0, end)   # under the footer line and page number, like all content
            at = foot if foot >= 0 else end
            body = body[:at] + _tag(pid, src, style) + body[at:]
        elif op == "free":
            src = q["src"]
            fixed = [m for m in IMG.finditer(body)
                     if not m.group(0).startswith('<img class="free-pic"')
                     and (IMG_SRC.search(m.group(0)) or [None, None])[1] == src]
            n = int(q.get("n") or 0)
            if not 0 <= n < len(fixed):
                return 409, {"error": "Dieses Bild gibt es in der Datei nicht (mehr) – bitte neu laden."}
            m = fixed[n]
            s, t = m.start(), m.end()
            box = BOX_OPEN.search(body, 0, s)
            close = BOX_CLOSE.match(body, t)
            if box and close and box.group(1) == close.group(1):
                s, t = box.start(), close.end()
            body = body[:s] + body[t:]
            pid = None
            if style:
                pid = secrets.token_hex(4)
                while 'data-pic="%s"' % pid in page:
                    pid = secrets.token_hex(4)
                end = body.rfind("</section>")
                foot = body.rfind('<p class="foot">', 0, end)
                at = foot if foot >= 0 else end
                body = body[:at] + _tag(pid, src, style) + body[at:]
        else:
            pid = q["id"]
            m = next((m for m in PIC.finditer(body) if m.group(1) == pid), None)
            if not m:
                return 409, {"error": "Dieses Bild gibt es in der Datei nicht mehr – bitte neu laden."}
            if m.group(3) != q["old"]:
                return 409, {"error": "Das Bild wurde inzwischen verändert – bitte neu laden."}
            new = _tag(pid, m.group(2), style) if op == "move" else ""
            body = body[:m.start()] + new + body[m.end():]
        what = {"add": "Bild eingefügt", "move": "Bild verschoben", "del": "Bild entfernt",
                "free": "Bild entfernt" if style is None else "Bild freigestellt"}[op]   # "Rückgängig: ..."
        e._write(deck, page[:a] + body + page[b:], gen, what=what)
    return 200, {"id": pid, "style": style, "mtime": e._mtime(deck), "pending": e.pending(deck)}


def handle(method, path, headers, body):
    """The HTTP side, called by deck_edit.handle() after its Host/Origin checks: returns (status, dict)."""
    url = urlsplit(path)
    ctype = headers.get("Content-Type") or ""
    try:
        if method == "POST" and url.path == "/__deck/image/upload":
            return upload(parse_qs(url.query).get("deck", [""])[0], ctype, body)
        if method == "POST" and url.path == "/__deck/image/pic":
            if not ctype.startswith("application/json"):
                return 415, {"error": "json only"}
            return pic(json.loads(body.decode("utf-8")))
    except (ValueError, KeyError, TypeError, OSError) as err:
        return 400, {"error": str(err)}
    return 404, {"error": "unknown"}

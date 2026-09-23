"""A figure's words (<p class="fl">, html_deck.figure) moved and sized in the deck editor - the file side of
HTML/decks/deck-label.js (Doc, 23.09.2026: "bitte verschieb/änderbar (size)"). deck_edit.handle() forwards
/__deck/label here after its Host/Origin checks:

    POST /__deck/label  {deck, slide, n, old, x, y, w, size?}   -> {style, mtime, pending}

n: the label's index among the slide's <p class="fl"> in document order; old: its style as the page saw it, so a
stale page never overwrites a newer file. x, y, w in the picture box's px (816 x 330, html_deck.figure), size the
type in px - only once a corner handle scaled it. The text is deck_edit.py's business (p.fl is editable there);
this rewrites nothing but the style attribute, so the text addresses (n-th SELECTOR match) stay as they are.
Reading, locking and writing are deck_edit.py's: one way to touch a deck.
"""
import json
import os
import re
import sys
from urllib.parse import urlsplit

HERE = os.path.dirname(os.path.abspath(__file__))
LABEL = re.compile(r'<p class="fl" style="([^"]*)">')


def _edit():
    """deck_edit as serve.py just loaded it for this request - the forward came from there."""
    if HERE not in sys.path:
        sys.path.insert(0, HERE)
    import deck_edit
    return deck_edit


def _style(q):
    """left/top/width in box px, a type size only once a corner handle scaled the label."""
    from deck_image import _num                       # the same range check as for pictures
    style = "left:%gpx;top:%gpx;width:%gpx" % (
        _num(q, "x", -2000, 3000), _num(q, "y", -2000, 3000), _num(q, "w", 8, 3000))
    if q.get("size") is not None:
        style += ";font-size:%gpx" % _num(q, "size", 4, 200)
    return style


def move(q):
    """Give one label of one slide its new place and size. Returns (status, reply)."""
    e = _edit()
    gen = e._gen()
    deck, slide, n = q["deck"], int(q["slide"]), int(q["n"])
    style = _style(q)
    with e._lock:
        page = e._read(deck)
        bounds = e.elements(page, gen)[1]
        if not 0 <= slide < len(bounds):
            return 409, {"error": "Diese Folie gibt es in der Datei nicht mehr – bitte neu laden."}
        a, b = bounds[slide]
        body = page[a:b]
        found = list(LABEL.finditer(body))
        if not 0 <= n < len(found):
            return 409, {"error": "Diese Beschriftung gibt es in der Datei nicht (mehr) – bitte neu laden."}
        m = found[n]
        if m.group(1) != q["old"]:
            return 409, {"error": "Die Beschriftung wurde inzwischen verändert – bitte neu laden."}
        body = body[:m.start()] + '<p class="fl" style="%s">' % style + body[m.end():]
        e._write(deck, page[:a] + body + page[b:], gen, what="Beschriftung verschoben")   # "Rückgängig: ..."
    return 200, {"style": style, "mtime": e._mtime(deck), "pending": e.pending(deck)}


def handle(method, path, headers, body):
    """The HTTP side, called by deck_edit.handle() after its Host/Origin checks: returns (status, dict)."""
    url = urlsplit(path)
    try:
        if method == "POST" and url.path == "/__deck/label":
            if not (headers.get("Content-Type") or "").startswith("application/json"):
                return 415, {"error": "json only"}
            return move(json.loads(body.decode("utf-8")))
    except (ValueError, KeyError, TypeError, OSError) as err:
        return 400, {"error": str(err)}
    return 404, {"error": "unknown"}

"""A figure's words (<p class="fl">, html_deck.figure) moved and sized in the deck editor - the file side of
HTML/decks/deck-label.js (Doc, 23.09.2026: "bitte verschieb/änderbar (size)"). deck_edit.handle() forwards
/__deck/label here after its Host/Origin checks:

    POST /__deck/label  {deck, slide, n, old, x, y, w, size?}   -> {style, mtime, pending}

n: the label's index among the slide's <p class="fl"> in document order; old: its style as the page saw it, so a
stale page never overwrites a newer file. x, y, w in the picture box's px (816 x 330, html_deck.figure), size the
type in px - only once a corner handle scaled it. The text is deck_edit.py's business (p.fl is editable there);
this rewrites nothing but the style attribute, so the text addresses (n-th SELECTOR match) stay as they are.

Every text box standing on a slide (KINDS: the heading, the body, kicker and sub, a table ...) is moved, sized and
removed the same way (Doc, 05.10.2026: "die Box ... löschen ... beziehungsweise verschieben können", "die
Überschriftenboxen ... Alle Textboxen, die wir drin haben, genauso behandeln"):

    POST /__deck/box  {deck, slide, kind, n, old, op: "move", x, y, w?, scale?}   -> {style, mtime, pending}
    POST /__deck/box  {deck, slide, kind, n, old, op: "del"}                      -> {narration, mtime, pending}

kind: one of KINDS; n: the box's index among the slide's own children of that kind (never one nested deeper); old:
its style attribute as the page saw it (null when it has none). x, y in slide px; w only once a side handle changed
the width - otherwise the width stays the file's; scale (CSS scale from the top left corner) once a corner handle
sized the box, 1 takes it off again. Every other declaration (the generator's top/height) stays. Removing takes the
whole box with all it holds; a click group that lived only in it goes, the later ones move up one, and Solita's parts
with them - as Cmd-Backspace does for a single line.
Reading, locking and writing are deck_edit.py's: one way to touch a deck.
"""
import json
import os
import re
import sys
from html.parser import HTMLParser
from urllib.parse import urlsplit

HERE = os.path.dirname(os.path.abspath(__file__))
# a label that comes with a click carries its step classes and group too (class="fl step ghost" data-g="1", ziegen_svg.py),
# one that goes again its data-bis (html_deck.figure_label)
LABEL = re.compile(r'<p class="(fl(?: [^"]*)?)"((?: data-g="\d+")?(?: data-bis="\d+")?) style="([^"]*)">')
# the text boxes that stand on a slide as html_deck.py writes them - tag.class, or a bare heading (deck-label.js: KINDS)
KINDS = ("div.body", "div.colgrid", "div.codepanel", "table.dtable", "h1", "h2", "h3", "p.kicker", "p.sub",
         "p.satz", "p.label", "p.labnote", "p.greet-lead", "p.greet-quote", "p.greet-author", "div.labbar")
RIGHT = ("div.labbar",)                                # hangs from the right in deck.css: moved, it needs right:auto
VOID = ("area", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr")
STYLE = re.compile(r'\sstyle="[^"]*"')


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
        if m.group(3) != q["old"]:
            return 409, {"error": "Die Beschriftung wurde inzwischen verändert – bitte neu laden."}
        body = body[:m.start()] + '<p class="%s"%s style="%s">' % (m.group(1), m.group(2), style) + body[m.end():]
        e._write(deck, page[:a] + body + page[b:], gen, what="Beschriftung verschoben")   # "Rückgängig: ..."
    return 200, {"style": style, "mtime": e._mtime(deck), "pending": e.pending(deck)}


def _restyle(old, q, kind=""):
    """The box's style with its new left/top - width and scale once a handle changed them; the rest as it was."""
    from deck_image import _num
    decl = [(k.strip(), v.strip()) for k, v in (d.split(":", 1) for d in (old or "").split(";") if ":" in d)]
    was = dict(decl)
    out = ["left:%gpx" % _num(q, "x", -2000, 3000), "top:%gpx" % _num(q, "y", -2000, 3000)]
    if q.get("w") is not None:
        out.append("width:%gpx" % _num(q, "w", 24, 3000))
    elif was.get("width"):
        out.append("width:" + was["width"])
    scale = round(float(q["scale"]), 3) if q.get("scale") is not None else None
    if scale is not None and not 0.1 <= scale <= 8:
        raise ValueError("scale out of range")
    if scale is not None and scale != 1:
        out += ["scale:%g" % scale, "transform-origin:0 0"]
    elif scale is None and was.get("scale"):
        out += ["scale:" + was["scale"], "transform-origin:0 0"]
    gone = ("left", "top", "width", "scale", "transform-origin")
    if kind in RIGHT:
        out.append("right:auto")
        gone += ("right", "bottom")
    return ";".join(out + ["%s:%s" % (k, v) for k, v in decl if k not in gone])


class _Kids(HTMLParser):
    """The elements standing right on a slide (children of its <section>): tag, classes, style, where the start
    tag runs (os..ts) and where the element ends (oe) - as offsets into the fed slide."""
    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.starts = [0] + [m.end() for m in re.finditer("\n", text)]
        self.depth, self.kids = 0, []

    def _at(self):
        line, col = self.getpos()
        return self.starts[line - 1] + col

    def handle_starttag(self, tag, attrs):
        if tag in VOID:
            return
        self.depth += 1
        if self.depth == 2:
            a, at = dict(attrs), self._at()
            self.kids.append({"tag": tag, "cls": (a.get("class") or "").split(), "style": a.get("style"),
                              "os": at, "ts": at + len(self.get_starttag_text()), "oe": None})

    def handle_endtag(self, tag):
        if tag in VOID:
            return
        if self.depth == 2 and self.kids and self.kids[-1]["oe"] is None:
            self.kids[-1]["oe"] = self._at() + len("</%s>" % tag)
        self.depth -= 1


def _is(kid, kind):
    tag, _, cls = kind.partition(".")
    return kid["tag"] == tag and (not cls or cls in kid["cls"])


def box(q):
    """Move, size or remove one text box of one slide. Returns (status, reply)."""
    e = _edit()
    gen = e._gen()
    deck, slide, kind, n, op = q["deck"], int(q["slide"]), q["kind"], int(q["n"]), q.get("op", "move")
    if op not in ("move", "del") or kind not in KINDS:
        return 400, {"error": "unknown op or kind"}
    with e._lock:
        page = e._read(deck)
        bounds = e.elements(page, gen)[1]
        if not 0 <= slide < len(bounds):
            return 409, {"error": "Diese Folie gibt es in der Datei nicht mehr – bitte neu laden."}
        a, b = bounds[slide]
        body = page[a:b]
        p = _Kids(body)
        p.feed(body)
        p.close()
        found = [k for k in p.kids if _is(k, kind)]
        if not 0 <= n < len(found) or found[n]["oe"] is None:
            return 409, {"error": "Diese Textbox gibt es in der Datei nicht (mehr) – bitte neu laden."}
        m = found[n]
        if (m["style"] or None) != (q.get("old") or None):   # an empty style is no style
            return 409, {"error": "Die Textbox wurde inzwischen verändert – bitte neu laden."}
        if op == "move":
            style = _restyle(m["style"], q, kind)
            tag = body[m["os"]:m["ts"]]
            tag = STYLE.sub(' style="%s"' % style, tag, count=1) if STYLE.search(tag) else \
                re.sub(r"\s*/?>$", ' style="%s">' % style, tag)
            body = body[:m["os"]] + tag + body[m["ts"]:]
            e._write(deck, page[:a] + body + page[b:], gen, what="Textbox verschoben")   # "Rückgängig: ..."
            return 200, {"style": style, "mtime": e._mtime(deck), "pending": e.pending(deck)}
        gone, rest = body[m["os"]:m["oe"]], body[:m["os"]] + body[m["oe"]:]
        groups = lambda t: {g for g in map(e._group, e.STEP_TAG.findall(t)) if g is not None}
        own = sorted(groups(gone) - groups(rest), reverse=True)   # from the top: a shift never moves one still to come
        for g in own:
            rest = e._shift(rest, g, -1)
        page = page[:a] + rest + page[b:]
        spoken = False
        for g in own:
            page, moved = e._narration(page, deck, slide, g + 1, -1)
            spoken = spoken or moved
        e._write(deck, page, gen, what="Textbox gelöscht", stuck=spoken)
    return 200, {"narration": spoken, "mtime": e._mtime(deck), "pending": e.pending(deck)}


def handle(method, path, headers, body):
    """The HTTP side, called by deck_edit.handle() after its Host/Origin checks: returns (status, dict)."""
    url = urlsplit(path)
    try:
        if method == "POST" and url.path == "/__deck/label":
            if not (headers.get("Content-Type") or "").startswith("application/json"):
                return 415, {"error": "json only"}
            return move(json.loads(body.decode("utf-8")))
        if method == "POST" and url.path == "/__deck/box":
            if not (headers.get("Content-Type") or "").startswith("application/json"):
                return 415, {"error": "json only"}
            return box(json.loads(body.decode("utf-8")))
    except (ValueError, KeyError, TypeError, OSError) as err:
        return 400, {"error": str(err)}
    return 404, {"error": "unknown"}

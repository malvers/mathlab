"""Edit the text of an HTML deck in place - the deck is the master (Doc, 17.09.2026: "Deck ist Master").

Only the local dev server (serve.py, 127.0.0.1:8765) talks to this module; the live site never can:

    GET  /__deck/source?deck=<name>.html  -> {selector, slides: [[source or null, ...], ...]}
    POST /__deck/save  {deck, slide, n, old, new}  -> {html, src}   one element rewritten in the file

A text travels as the source the build scripts write: $...$ for formulas, **bold**, <i>, <c1>...</c1>.
deck_markup.markup() turns it back into markup - the formatter html_deck.py builds with, so an edited line is
exactly what a build would have written. An element whose markup does not survive that round trip stays read-only.

Element n of slide i is the n-th element matching EDITABLE in the i-th <section class="slide">, in
document order - the page counts with the selector it gets from here, so both sides use one rule, and a
save only goes through when the element still holds the text the page showed (old).

A deck saved from the browser carries EDITED_MARK right after the deck start; html_deck.py then leaves
the file alone instead of rebuilding it from its script.
"""
import importlib
import json
import os
import re
import sys
import threading
from html.parser import HTMLParser
from urllib.parse import urlsplit, parse_qs

HERE = os.path.dirname(os.path.abspath(__file__))
DECKS = os.environ.get("DECK_EDIT_DIR") or os.path.normpath(os.path.join(HERE, "..", "..", "HTML", "decks"))   # env: tests on a copy
EDITED_MARK = "<!-- deck-master: edited in the browser (tools/pptx/deck_edit.py) - html_deck.py does not overwrite this deck -->\n"

# the text containers html_deck.py writes; foot, pageno and the live greeting line are not text of the deck
EDITABLE_TAGS = ("h1", "h2", "h3", "th", "td")
EDITABLE_P = ("kicker", "sub", "line", "col", "satz", "label", "labnote", "greet-quote", "greet-author")
SELECTOR = ",".join(EDITABLE_TAGS + tuple("p." + c for c in EDITABLE_P))
DECK_NAME = re.compile(r"[a-z0-9][a-z0-9._-]*\.html")
_lock = threading.Lock()


def _gen():
    """deck_markup.py, fresh on every call - its rules may change while serve.py keeps running.
    Not html_deck.py itself: that pulls in design_lib and PIL, which the LaunchAgent's Python cannot load."""
    if HERE not in sys.path:
        sys.path.insert(0, HERE)
    import deck_markup
    return importlib.reload(deck_markup)


def _editable(tag, attrs):
    if tag in EDITABLE_TAGS:
        return True
    if tag != "p":
        return False
    return bool(set((dict(attrs).get("class") or "").split()) & set(EDITABLE_P))


class _Ranges(HTMLParser):
    """Inner ranges (start, end) of every editable element, per slide, as offsets into the fed text."""
    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.starts = [0] + [m.end() for m in re.finditer("\n", text)]
        self.slides = []
        self.open = None                              # [tag, depth, inner_start]

    def _at(self):
        line, col = self.getpos()
        return self.starts[line - 1] + col

    def handle_starttag(self, tag, attrs):
        if tag == "section" and "slide" in (dict(attrs).get("class") or "").split():
            self.slides.append([])
        elif self.open:
            if tag == self.open[0]:
                self.open[1] += 1
        elif self.slides and _editable(tag, attrs):
            self.open = [tag, 0, self._at() + len(self.get_starttag_text())]

    def handle_endtag(self, tag):
        if not self.open or tag != self.open[0]:
            return
        if self.open[1]:
            self.open[1] -= 1
        else:
            self.slides[-1].append((self.open[2], self._at()))
            self.open = None


def ranges(page, gen):
    """Per slide the inner ranges of its editable elements, as offsets into the whole page."""
    a = page.index(gen._DECK_START) + len(gen._DECK_START)
    b = page.index(gen._DECK_END, a)
    p = _Ranges(page[a:b])
    p.feed(page[a:b])
    p.close()
    return [[(a + s, a + e) for s, e in sl] for sl in p.slides]


class _Source(HTMLParser):
    """Markup back to source. `bold` picks **word** or <b>word</b>; unknown markup makes it fail."""
    def __init__(self, bold):
        super().__init__(convert_charrefs=True)
        self.bold, self.out, self.stack, self.bad = bold, [], [], False

    def handle_starttag(self, tag, attrs):
        cls = (dict(attrs).get("class") or "").split()
        if self.stack and self.stack[-1] == "tex":
            self.bad = True
        elif tag == "span" and cls == ["tex"]:
            self.out.append("$" + (dict(attrs).get("data-tex") or "") + "$")
            self.stack.append("tex")
        elif tag == "span" and len(cls) == 1 and cls[0] in ("c1", "c2", "c3"):
            self.out.append("<%s>" % cls[0])
            self.stack.append("</%s>" % cls[0])
        elif tag == "b" and not attrs:
            self.out.append("**" if self.bold else "<b>")
            self.stack.append("**" if self.bold else "</b>")
        elif tag == "i" and not attrs:
            self.out.append("<i>")
            self.stack.append("</i>")
        else:
            self.bad = True

    def handle_endtag(self, tag):
        if not self.stack:
            self.bad = True
            return
        close = self.stack.pop()
        if close != "tex":
            self.out.append(close)

    def handle_data(self, data):
        if self.stack and self.stack[-1] == "tex":
            self.bad = True                           # a placeholder is empty in the file
        else:
            self.out.append(data)

    def handle_startendtag(self, tag, attrs):
        self.bad = True


def to_source(inner, markup):
    """The source a build script would have written for this markup, or None if there is none."""
    for bold in (True, False):                        # **word** reads nicer; <b> where ** cannot say it
        p = _Source(bold)
        p.feed(inner)
        p.close()
        if p.bad or p.stack:
            continue
        src = "".join(p.out)
        if markup(src) == inner:
            return src
    return None


def source_map(deck):
    page = _read(deck)
    gen = _gen()
    return {"selector": SELECTOR, "mtime": _mtime(deck),
            "slides": [[to_source(page[s:e], gen.markup) for s, e in sl] for sl in ranges(page, gen)]}


def save(deck, slide, n, old, new):
    """Rewrite element n of slide `slide`. Returns (status, reply)."""
    new = re.sub(r"\s*\n\s*", " ", new).strip()
    gen = _gen()
    markup = gen.markup
    with _lock:
        page = _read(deck)
        rs = ranges(page, gen)
        if not (0 <= slide < len(rs) and 0 <= n < len(rs[slide])):
            return 409, {"error": "Dieses Element gibt es in der Datei nicht mehr – bitte neu laden."}
        s, e = rs[slide][n]
        if to_source(page[s:e], markup) != old:
            return 409, {"error": "Die Datei hat sich inzwischen geändert – bitte neu laden."}
        inner = markup(new)
        src = to_source(inner, markup)                # "<b>x</b>" comes back as "**x**" - same markup
        if src is None:
            return 422, {"error": "So kann ich das nicht sauber speichern – steht irgendwo ein ** oder $ zu viel?"}
        page = page[:s] + inner + page[e:]
        if EDITED_MARK not in page:
            a = page.index(gen._DECK_START) + len(gen._DECK_START)
            page = page[:a] + EDITED_MARK + page[a:]
        path = os.path.join(DECKS, deck)
        tmp = path + ".tmp"
        with open(tmp, "w", encoding="utf-8") as f:
            f.write(page)
        os.replace(tmp, path)
    return 200, {"html": inner, "src": src, "mtime": _mtime(deck)}


def _mtime(deck):
    """Whole seconds, like the Last-Modified header the page was served with."""
    return int(os.stat(os.path.join(DECKS, deck)).st_mtime)


def _read(deck):
    if not DECK_NAME.fullmatch(deck or ""):
        raise ValueError("bad deck name")
    with open(os.path.join(DECKS, deck), encoding="utf-8") as f:
        return f.read()


def handle(method, path, headers, body):
    """The HTTP side for serve.py: returns (status, dict). Only same-origin JSON gets through."""
    host = headers.get("Host", "")
    if not re.fullmatch(r"(127\.0\.0\.1|localhost)(:\d+)?", host):
        return 403, {"error": "host"}
    origin = headers.get("Origin")
    if origin and urlsplit(origin).netloc != host:
        return 403, {"error": "origin"}
    url = urlsplit(path)
    try:
        if method == "GET" and url.path == "/__deck/source":
            return 200, source_map(parse_qs(url.query).get("deck", [""])[0])
        if method == "POST" and url.path == "/__deck/save":
            if not (headers.get("Content-Type") or "").startswith("application/json"):
                return 415, {"error": "json only"}
            q = json.loads(body.decode("utf-8"))
            return save(q["deck"], int(q["slide"]), int(q["n"]), q["old"], q["new"])
    except (ValueError, KeyError, TypeError, OSError) as err:
        return 400, {"error": str(err)}
    return 404, {"error": "unknown"}


if __name__ == "__main__":
    # check every deck: how many texts are editable, and does each round trip byte for byte?
    import glob
    total = ok = 0
    for p in sorted(glob.glob(os.path.join(DECKS, "*.html"))):
        try:
            m = source_map(os.path.basename(p))
        except ValueError:
            continue
        cells = [x for sl in m["slides"] for x in sl]
        total += len(cells)
        ok += sum(x is not None for x in cells)
        bad = len(cells) - sum(x is not None for x in cells)
        if bad:
            print("%-50s %d read-only" % (os.path.basename(p), bad))
    print("editable: %d of %d texts" % (ok, total))

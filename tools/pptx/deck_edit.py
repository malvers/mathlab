"""Edit the text of an HTML deck in place - the deck is the master (Doc, 17.09.2026: "Deck ist Master").

Only the local dev server (serve.py, 127.0.0.1:8765) talks to this module; the live site never can:

    GET  /__deck/source?deck=<name>.html  -> {selector, slides: [[source or null, ...], ...]}
    POST /__deck/save  {deck, slide, n, old, new}  -> {html, src}   one element rewritten in the file
    POST /__deck/line  {deck, slide, n, old, op}  -> {own, g}   Cmd-D copies a line below itself, Cmd-Backspace removes it
    POST /__deck/slide {deck, index, op, to}  -> {order|hidden|at}   the overview: move, hide, show, insert, dup, del
    POST /__deck/publish  {deck}  -> {commit, files}   the deck (and pictures it needs) onto origin/main
    POST /__deck/undo  {deck, redo}  -> {what, mtime, pending}   one step back or forward (deck_undo.py)
    *    /__deck/image/...   pictures on slides - handled by deck_image.py
    *    /__deck/label       a figure's words moved or sized - handled by deck_label.py

Publishing is Doc's click on "Änderungen speichern" - his standing go-ahead for exactly these pushes (Doc,
17.09.2026: "Nur von/für hier um Änderungen zu pushen ja: Dauerfreigabe"). The commit is built on origin/main in a
separate index, so whatever else lies half-done in the working tree (other sessions) never rides along.

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
import subprocess
import sys
import threading
from html.parser import HTMLParser
from urllib.parse import urlsplit, parse_qs

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.environ.get("DECK_EDIT_REPO") or os.path.normpath(os.path.join(HERE, "..", ".."))   # env: tests on a copy
DECKS = os.path.join(REPO, "HTML", "decks")
BRANCH = "main"
EDITED_MARK = "<!-- deck-master: edited in the browser (tools/pptx/deck_edit.py) - html_deck.py does not overwrite this deck -->\n"

# the text containers html_deck.py writes; foot, pageno and the live greeting line are not text of the deck
EDITABLE_TAGS = ("h1", "h2", "h3", "th", "td")
EDITABLE_P = ("kicker", "sub", "line", "col", "satz", "label", "labnote", "greet-quote", "greet-author",
              "fl")   # a figure's words over its SVG (html_deck.figure)
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
    """Every editable element, per slide, as offsets into the fed text: (start, end) inside its tags, the whole
    element from '<' to after '>', and its class names. `sections` holds where each slide starts."""
    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.starts = [0] + [m.end() for m in re.finditer("\n", text)]
        self.slides, self.sections = [], []
        self.open = None                              # [tag, depth, inner_start, outer_start, classes]

    def _at(self):
        line, col = self.getpos()
        return self.starts[line - 1] + col

    def handle_starttag(self, tag, attrs):
        if tag == "section" and "slide" in (dict(attrs).get("class") or "").split():
            self.slides.append([])
            self.sections.append(self._at())
        elif self.open:
            if tag == self.open[0]:
                self.open[1] += 1
        elif self.slides and _editable(tag, attrs):
            at = self._at()
            self.open = [tag, 0, at + len(self.get_starttag_text()), at, (dict(attrs).get("class") or "").split()]

    def handle_endtag(self, tag):
        if not self.open or tag != self.open[0]:
            return
        if self.open[1]:
            self.open[1] -= 1
        else:
            at = self._at()
            self.slides[-1].append({"s": self.open[2], "e": at, "os": self.open[3], "tag": tag, "cls": self.open[4],
                                    "oe": at + len("</%s>" % tag)})
            self.open = None


def elements(page, gen):
    """Per slide its editable elements (offsets into the whole page) and each slide's (start, end)."""
    a = page.index(gen._DECK_START) + len(gen._DECK_START)
    b = page.index(gen._DECK_END, a)
    p = _Ranges(page[a:b])
    p.feed(page[a:b])
    p.close()
    els = [[{k: (a + v if k in ("s", "e", "os", "oe") else v) for k, v in el.items()} for el in sl] for sl in p.slides]
    bounds = [(a + s, a + e) for s, e in zip(p.sections, p.sections[1:] + [b - a])]
    return els, bounds


def ranges(page, gen):
    """Per slide the inner ranges of its editable elements, as offsets into the whole page."""
    return [[(el["s"], el["e"]) for el in sl] for sl in elements(page, gen)[0]]


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
        elif tag == "span" and len(cls) == 1 and re.fullmatch(r"[cf][1-9]", cls[0]):
            self.out.append("<%s>" % cls[0])
            self.stack.append("</%s>" % cls[0])
        elif tag == "b" and not attrs:
            self.out.append("**" if self.bold else "<b>")
            self.stack.append("**" if self.bold else "</b>")
        elif tag in ("i", "u", "s") and not attrs:
            self.out.append("<%s>" % tag)
            self.stack.append("</%s>" % tag)
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
    return {"selector": SELECTOR, "mtime": _mtime(deck), "pending": pending(deck),
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
        _write(deck, page[:s] + inner + page[e:], gen, what="Text")
    return 200, {"html": inner, "src": src, "mtime": _mtime(deck), "pending": pending(deck)}


# the lines Cmd-D copies and Cmd-Backspace removes: bullets and column entries - not titles, table cells, labels
LINES = ("line", "col")
STEP_TAG = re.compile(r'<[a-z][a-z0-9]*\b[^>]*>')
DATA_G = re.compile(r'\bdata-g="(\d+)"')
NARRATION = re.compile(r'(<script id="narration" type="application/json">)(.*?)(</script>)', re.S)


def _group(tag):
    """The click group of a start tag, or None when it is not a step."""
    cls = re.search(r'\bclass="([^"]*)"', tag)
    g = DATA_G.search(tag)
    return int(g.group(1)) if g and cls and "step" in cls.group(1).split() else None


def _shift(text, above, by):
    """Every step in text whose click group is above `above` moves `by` groups."""
    def one(m):
        g = _group(m.group(0))
        return DATA_G.sub('data-g="%d"' % (g + by), m.group(0)) if g is not None and g > above else m.group(0)
    return STEP_TAG.sub(one, text)


def line(deck, slide, n, old, op):
    """op "dup": copy element n of slide `slide` right below it; op "del": remove it. Returns (status, reply).

    A line alone in its click group brings (or takes away) a group of its own: the groups after it move one on,
    and so do Solita's parts and clips for that slide - the copy is silent (Doc, 17.09.2026: "erst mal nix").
    A line that shares its group (column entries coming in together) just joins or leaves it."""
    gen = _gen()
    with _lock:
        page = _read(deck)
        els, bounds = elements(page, gen)
        if not (0 <= slide < len(els) and 0 <= n < len(els[slide])):
            return 409, {"error": "Dieses Element gibt es in der Datei nicht mehr – bitte neu laden."}
        el = els[slide][n]
        if to_source(page[el["s"]:el["e"]], gen.markup) != old:
            return 409, {"error": "Die Datei hat sich inzwischen geändert – bitte neu laden."}
        if el["tag"] != "p" or not set(el["cls"]) & set(LINES):
            return 422, {"error": "Kopieren und Löschen geht nur bei Aufzählungszeilen."}
        lines = [x for x in els[slide] if x["tag"] == "p" and set(x["cls"]) & set(LINES)]
        if op == "del" and len(lines) == 1:
            return 422, {"error": "Die letzte Zeile einer Folie bleibt – sonst gibt es nichts mehr zum Kopieren."}
        a, b = bounds[slide]
        g = _group(page[el["os"]:page.index(">", el["os"]) + 1])
        own = g is not None and sum(_group(t) == g for t in STEP_TAG.findall(page[a:b])) == 1
        by = 1 if op == "dup" else -1
        if op == "dup":
            copy = page[el["os"]:el["oe"]]
            if own:
                copy = DATA_G.sub('data-g="%d"' % (g + 1), copy, count=1)
            before, after = page[a:el["oe"]], page[el["oe"]:b]
            body = (_shift(before, g, by) + "\n" + copy + _shift(after, g, by)) if own else before + "\n" + copy + after
        elif op == "del":
            s, e = el["os"], el["oe"]
            if page[e:e + 1] == "\n":
                e += 1
            elif page[s - 1:s] == "\n":
                s -= 1
            body = page[a:s] + page[e:b]
            if own:
                body = _shift(body, g, by)
        else:
            return 400, {"error": "unknown op"}
        page = page[:a] + body + page[b:]
        spoken = False
        if own:
            page, spoken = _narration(page, deck, slide, g + 1, by)
        _write(deck, page, gen, what="Zeile kopiert" if op == "dup" else "Zeile gelöscht", stuck=spoken)
    return 200, {"own": own, "g": g, "narration": spoken, "mtime": _mtime(deck), "pending": pending(deck)}


# ------------------------------------------------------------- whole slides ---
SECTION_TAG = re.compile(r"<section\b[^>]*>")
CLASS_ATTR = re.compile(r'\bclass="([^"]*)"')
SKIP = "skip"                                         # a hidden slide: stays in the file, no navigation lands on it
SLIDE_CLIP = re.compile(r"^s(\d{2})-(\d{2})\.mp3$")


def slide_op(deck, index, op, to=None):
    """Move a slide inside the deck, hide / show it, or put one in and take one out (the overview in edit
    mode, Doc 21.09.2026). Returns (status, reply).

    Moving rewrites the order of the <section class="slide"> blocks and takes Solita with it: her parts, her
    hold list and her clips are keyed by slide number, so they are renumbered in the same step. Hiding only
    sets a class - numbering and narration stay exactly as they are, which is why it is the safe one.
    """
    gen = _gen()
    with _lock:
        page = _read(deck)
        _, bounds = elements(page, gen)
        n = len(bounds)
        if not (0 <= index < n):
            return 409, {"error": "Diese Folie gibt es in der Datei nicht mehr – bitte neu laden."}
        if op in ("hide", "show"):
            a = bounds[index][0]
            m = SECTION_TAG.match(page, a)
            cls = CLASS_ATTR.search(m.group(0)) if m else None
            if not cls:
                return 500, {"error": "Folienanfang nicht gefunden – bitte neu laden."}
            names = cls.group(1).split()
            if op == "hide" and SKIP not in names:
                names.append(SKIP)
            elif op == "show":
                names = [c for c in names if c != SKIP]
            tag = m.group(0)[:cls.start(1)] + " ".join(names) + m.group(0)[cls.end(1):]
            page = page[:m.start()] + tag + page[m.end():]
            _write(deck, page, gen, what="Folie ausgeblendet" if op == "hide" else "Folie eingeblendet")
            return 200, {"hidden": op == "hide", "mtime": _mtime(deck), "pending": pending(deck)}
        if op in ("insert", "dup", "del"):
            blocks = [page[a:b] for a, b in bounds]
            if op == "del" and n == 1:
                return 422, {"error": "Die letzte Folie bleibt – sonst wäre das Deck leer."}
            if op == "del":
                del blocks[index]
                mapping = {k: (None if k == index else k - (k > index)) for k in range(n)}
                at = min(index, n - 2)                # where the deck stands afterwards
            else:
                blocks.insert(index + 1, _new_slide(blocks[index]) if op == "insert" else _copy_slide(blocks[index]))
                mapping = {k: k + (k > index) for k in range(n)}
                at = index + 1
            page = page[:bounds[0][0]] + "".join(blocks) + page[bounds[-1][1]:]
            page, spoken = _reorder(page, deck, mapping)
            what = {"insert": "Folie eingefügt", "dup": "Folie kopiert", "del": "Folie gelöscht"}[op]
            _write(deck, page, gen, what=what, stuck=spoken)
            return 200, {"at": at, "narration": spoken, "mtime": _mtime(deck), "pending": pending(deck)}
        if op != "move":
            return 400, {"error": "unknown op"}
        if to is None or not (0 <= int(to) < n):
            return 409, {"error": "Dorthin lässt sich die Folie nicht schieben."}
        to = int(to)
        if to == index:
            return 200, {"order": list(range(n)), "mtime": _mtime(deck), "pending": pending(deck), "narration": False}
        blocks = [page[a:b] for a, b in bounds]
        order = list(range(n))
        order.insert(to, order.pop(index))            # the same move the overview shows
        page = page[:bounds[0][0]] + "".join(blocks[k] for k in order) + page[bounds[-1][1]:]
        page, spoken = _reorder(page, deck, {old: new for new, old in enumerate(order)})
        _write(deck, page, gen, what="Folie verschoben", stuck=spoken)
    return 200, {"order": order, "narration": spoken, "mtime": _mtime(deck), "pending": pending(deck)}


FOOT = re.compile(r'<p class="foot">.*?</p>', re.S)
PAGENO = '<p class="pageno"></p>'


def _new_slide(near):
    """An empty content slide, ready to be typed over - the footer line comes from its neighbour, so the new
    slide wears the same one as the rest of the deck."""
    foot = FOOT.search(near)
    tail = (foot.group(0) if foot else '<p class="foot"></p>') + PAGENO
    end = "\n" if near.endswith("\n") else ""
    return ('<section class="slide content"><h3>Neue Folie</h3><div class="rules"></div>'
            '<div class="body"><p class="line l0 step" data-g="0">Erster Punkt</p></div>'
            + tail + "</section>" + end)


def _copy_slide(block):
    """The same slide once more - it keeps its clicks, only the marks the editor sets are dropped."""
    return re.sub(r'\sclass="([^"]*)\bskip\b([^"]*)"', lambda m: ' class="%s"' % " ".join(
        (m.group(1) + m.group(2)).split()), block, count=1)


def _reorder(page, deck, mapping):
    """The slides changed places: Solita's parts, her hold list and her clips (audio/<deck>/sNN-KK.mp3 with
    texts.json) follow, so no clip is spoken on the wrong slide. Returns (page, whether anything spoken moved)."""
    m = NARRATION.search(page)
    if not m or not m.group(2).strip():
        return page, False
    data = json.loads(m.group(2).replace("<\\/", "</"))
    parts = data.get("slides") or {}
    spoken = False
    where = lambda k: mapping[k] if k in mapping else k       # None: that slide is gone
    if parts:
        data["slides"] = {str(where(int(k))): v for k, v in parts.items() if where(int(k)) is not None}
        spoken = any(where(int(k)) != int(k) for k in parts)
    if isinstance(data.get("hold"), list):
        data["hold"] = sorted(where(h) for h in data["hold"] if where(h) is not None)
    text = json.dumps(data, ensure_ascii=False).replace("</", "<\\/")
    page = page[:m.start(2)] + text + page[m.end(2):]
    folder = os.path.join(DECKS, "audio", data.get("deck") or deck[:-5])
    if os.path.isdir(folder):
        renames = []
        for fn in sorted(os.listdir(folder)):
            c = SLIDE_CLIP.match(fn)
            if not c:
                continue
            old = int(c.group(1))
            new = where(old)
            if new != old:
                renames.append((fn, None if new is None else "s%02d-%02d.mp3" % (new, int(c.group(2)))))
        if renames:                                   # two passes: a straight rename would overwrite a clip
            spoken = True
            for fn, _ in renames:
                os.replace(os.path.join(folder, fn), os.path.join(folder, fn + ".moving"))
            for fn, dst in renames:
                if dst is None:
                    os.remove(os.path.join(folder, fn + ".moving"))   # the deleted slide's clip - git still has it
                else:
                    os.replace(os.path.join(folder, fn + ".moving"), os.path.join(folder, dst))
            texts_path = os.path.join(folder, "texts.json")
            if os.path.exists(texts_path):
                texts = json.load(open(texts_path, encoding="utf-8"))
                to = dict(renames)
                texts = {to.get(k, k): v for k, v in texts.items() if to.get(k, k) is not None}
                with open(texts_path, "w", encoding="utf-8") as f:
                    f.write(json.dumps(texts, ensure_ascii=False, indent=1))
    return page, spoken


def _narration(page, deck, slide, part, by):
    """Solita's parts for `slide`: by +1 puts an empty part after `part`, by -1 removes `part` - and her clips
    (audio/<deck>/sNN-KK.mp3 with texts.json) move along, so no clip is spoken at the wrong line or recorded again.
    Returns (page, whether anything spoken moved)."""
    m = NARRATION.search(page)
    if not m or not m.group(2).strip():
        return page, False
    data = json.loads(m.group(2).replace("<\\/", "</"))
    parts = data.get("slides", {}).get(str(slide))
    at = part + 1 if by > 0 else part                 # the index that is inserted or removed
    if not parts or at >= len(parts):
        return page, False                            # nothing spoken after it - nothing moves
    count = len(parts)
    if by > 0:
        parts.insert(at, "")
    else:
        parts.pop(at)
    text = json.dumps(data, ensure_ascii=False).replace("</", "<\\/")
    page = page[:m.start(2)] + text + page[m.end(2):]
    folder = os.path.join(DECKS, "audio", data.get("deck") or deck[:-5])
    if os.path.isdir(folder):
        name = lambda k: "s%02d-%02d.mp3" % (slide, k)
        texts_path = os.path.join(folder, "texts.json")
        texts = json.load(open(texts_path, encoding="utf-8")) if os.path.exists(texts_path) else None
        moves = [(k, k + 1) for k in range(count - 1, at - 1, -1)] if by > 0 else \
                [(at, None)] + [(k, k - 1) for k in range(at + 1, count)]
        for src, dst in moves:
            p = os.path.join(folder, name(src))
            if dst is None:
                if os.path.exists(p):
                    os.remove(p)                      # the removed line's clip - git still has it
            elif os.path.exists(p):
                os.replace(p, os.path.join(folder, name(dst)))
        if texts is not None:                         # same order and format as deck_audio.mjs writes it
            to = {name(src): (name(dst) if dst is not None else None) for src, dst in moves}
            texts = {to.get(k, k): v for k, v in texts.items() if to.get(k, k) is not None}
            with open(texts_path, "w", encoding="utf-8") as f:
                f.write(json.dumps(texts, ensure_ascii=False, indent=1))
    return page, True


def _write(deck, page, gen, record=True, what="Änderung", stuck=False):
    """Write the deck atomically, with EDITED_MARK so html_deck.py leaves it alone from now on. Every write is one
    undo step (deck_undo.py, Doc 17.09.2026: "Undo gemeinsam angehen ... intelligent klein") - texts, lines and pictures
    alike; `stuck` marks a step that cannot be undone (Solita's clips were moved), record=False is the undo itself."""
    if EDITED_MARK not in page:
        a = page.index(gen._DECK_START) + len(gen._DECK_START)
        page = page[:a] + EDITED_MARK + page[a:]
    path = os.path.join(DECKS, deck)
    try:
        with open(path, encoding="utf-8") as f:
            old = f.read()
    except OSError:
        old = None
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        f.write(page)
    os.replace(tmp, path)
    if record:
        try:                                          # the text is saved - a failing undo record must not undo that
            if HERE not in sys.path:
                sys.path.insert(0, HERE)
            import deck_undo
            importlib.reload(deck_undo).record(sys.modules[__name__], deck, old, page, what, stuck)
        except Exception as err:
            print("deck_edit: no undo step for %s: %s" % (deck, err), file=sys.stderr)


# ------------------------------------------------------------------ publish ---
def _git(*args, env=None):
    r = subprocess.run(["git"] + list(args), cwd=REPO, capture_output=True, text=True, timeout=120,
                       env=dict(os.environ, **env) if env else None)
    if r.returncode:
        lines = (r.stderr or r.stdout).strip().splitlines()
        raise RuntimeError(lines[-1] if lines else "git " + args[0])
    return r.stdout.strip()


def _blob_at(ref, rel):
    try:
        return _git("rev-parse", "-q", "--verify", "%s:%s" % (ref, rel))
    except RuntimeError:
        return None


def pending(deck):
    """True while a deck edited in the browser differs from origin/main as last fetched - not live yet."""
    rel = "HTML/decks/" + deck
    try:
        if EDITED_MARK not in _read(deck):
            return False                              # other changes (a rebuild) are not this button's business
        return _git("hash-object", rel) != _blob_at("origin/" + BRANCH, rel)
    except (RuntimeError, OSError, subprocess.SubprocessError):
        return False


# keys that must never reach the public repo (CLAUDE.md rule 18) - checked on the added lines only. Only formats
# that ARE keys: "Passwort: Sommer2024!" is a normal example on an Informatik slide and must not block.
LEAKS = re.compile(r"sk-ant-[\w-]{10,}|sk-[A-Za-z0-9]{20,}|gh[pousr]_[A-Za-z0-9]{20,}|github_pat_\w{20,}"
                   r"|AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{35}|xox[abprs]-[\w-]{10,}|sb_secret_\w{10,}"
                   r"|-----BEGIN [A-Z ]*PRIVATE KEY-----|eyJ[\w-]{15,}\.[\w-]{15,}\.[\w-]{10,}")


def _assets(page, base):
    """Pictures the deck points to (img/..., morning/...) that origin/main does not have yet."""
    out = []
    for ref in sorted(set(re.findall(r'(?:src|href)="([^"#?:]+)"', page))):
        if ref.startswith(("/", "../")) or ref.endswith((".html", ".js", ".css")):
            continue
        rel = os.path.normpath("HTML/decks/" + ref)
        if rel.startswith("HTML/decks/") and os.path.isfile(os.path.join(REPO, rel)) and not _blob_at(base, rel):
            out.append(rel)
    return out


def _clips(page, base):
    """Solita's clips of this deck (audio/<deck>/) that differ from origin/main, and those only main still has -
    a copied or removed line moves them, and the live deck must play the same ones as here."""
    m = NARRATION.search(page)
    name = json.loads(m.group(2).replace("<\\/", "</")).get("deck") if m and m.group(2).strip() else None
    if not name:
        return [], []
    rel = "HTML/decks/audio/" + name
    folder = os.path.join(REPO, rel)
    here = sorted(rel + "/" + f for f in os.listdir(folder) if f.endswith(".mp3") or f == "texts.json") \
        if os.path.isdir(folder) else []                # never a .DS_Store
    there = {}
    for row in _git("ls-tree", "-r", base, "--", rel + "/").splitlines():
        meta, path = row.split("\t", 1)
        there[path] = meta.split()[2]
    hashes = _git("hash-object", "-w", "--", *here).splitlines() if here else []
    return [p for p, h in zip(here, hashes) if there.get(p) != h], [p for p in there if p not in here]


def publish(deck):
    """Commit this deck onto origin/main and push it - the working tree, other files and other sessions' work
    stay untouched. Returns (status, reply)."""
    rel = "HTML/decks/" + deck
    with _lock:
        page = _read(deck)
        if EDITED_MARK not in page:
            return 409, {"error": "Über diesen Knopf gehen nur im Browser bearbeitete Decks live."}
        try:
            _git("fetch", "-q", "origin", BRANCH)
            for attempt in (1, 2):                   # someone pushed in between: build again on the new tip
                base = _git("rev-parse", "origin/" + BRANCH)
                old = _blob_at(base, rel)
                before = _git("cat-file", "-p", old) if old else ""
                seen = set(before.splitlines())
                added = [l for l in page.splitlines() if l not in seen]
                hit = next((m.group(0) for l in added for m in [LEAKS.search(l)] if m), None)
                if hit:
                    return 422, {"error": "Nicht live gestellt: das sieht aus wie ein Schlüssel oder Passwort (%s…)." % hit[:10]}
                clips, gone = _clips(page, base)
                paths = [rel] + _assets(page, base) + clips
                blobs = [(p, _git("hash-object", "-w", p)) for p in paths]
                if not gone and all(_blob_at(base, p) == b for p, b in blobs):
                    return 200, {"commit": base[:8], "files": [], "pending": False}
                paths += gone
                index = {"GIT_INDEX_FILE": os.path.join(_git("rev-parse", "--absolute-git-dir"), "deck-publish.index")}
                _git("read-tree", base, env=index)
                for p, b in blobs:
                    _git("update-index", "--add", "--cacheinfo", "100644,%s,%s" % (b, p), env=index)
                for p in gone:
                    _git("update-index", "--force-remove", p, env=index)
                tree = _git("write-tree", env=index)
                commit = _git("commit-tree", tree, "-p", base, "-m",
                              "decks: %s - text edited in the browser, put live with 'Änderungen speichern'" % deck)
                try:
                    _git("push", "-q", "origin", "%s:refs/heads/%s" % (commit, BRANCH))
                    break
                except RuntimeError:
                    if attempt == 2:
                        raise
                    _git("fetch", "-q", "origin", BRANCH)
        except (RuntimeError, subprocess.SubprocessError) as err:
            return 502, {"error": "Nicht live gestellt – git: %s" % err}
        # the local side catches up without a checkout, but only when main sat exactly on the commit built on:
        # main moves along and the index learns the new blobs (--add: a new picture would otherwise show as deleted)
        try:
            _git("fetch", "-q", "origin", BRANCH)
            if _git("symbolic-ref", "-q", "HEAD") == "refs/heads/" + BRANCH and _git("rev-parse", "HEAD") == base:
                _git("update-ref", "refs/heads/" + BRANCH, commit, base)
                for p, b in blobs:
                    _git("update-index", "--add", "--cacheinfo", "100644,%s,%s" % (b, p))
                for p in gone:
                    _git("update-index", "--force-remove", p)
        except RuntimeError:
            pass                                      # index busy or main moved: git status shows it, nothing lost
    return 200, {"commit": commit[:8], "files": paths, "pending": pending(deck)}


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
        if url.path == "/__deck/label":
            # a figure's words moved or sized (deck_label.py) - reloaded per call like deck_image
            if HERE not in sys.path:
                sys.path.insert(0, HERE)
            import deck_label
            return importlib.reload(deck_label).handle(method, path, headers, body)
        if url.path.startswith("/__deck/image"):
            # DocPoint pictures live in deck_image.py: raw image bytes, it checks its own content types - so this comes
            # after the Host/Origin checks but before the JSON-only rule below. Reloaded per call, like deck_markup.
            if HERE not in sys.path:
                sys.path.insert(0, HERE)
            import deck_image
            return importlib.reload(deck_image).handle(method, path, headers, body)
        if method == "GET" and url.path == "/__deck/source":
            return 200, source_map(parse_qs(url.query).get("deck", [""])[0])
        if method == "POST" and url.path == "/__deck/save":
            if not (headers.get("Content-Type") or "").startswith("application/json"):
                return 415, {"error": "json only"}
            q = json.loads(body.decode("utf-8"))
            return save(q["deck"], int(q["slide"]), int(q["n"]), q["old"], q["new"])
        if method == "POST" and url.path == "/__deck/line":
            if not (headers.get("Content-Type") or "").startswith("application/json"):
                return 415, {"error": "json only"}
            q = json.loads(body.decode("utf-8"))
            return line(q["deck"], int(q["slide"]), int(q["n"]), q["old"], q["op"])
        if method == "POST" and url.path == "/__deck/slide":
            if not (headers.get("Content-Type") or "").startswith("application/json"):
                return 415, {"error": "json only"}
            q = json.loads(body.decode("utf-8"))
            return slide_op(q["deck"], int(q["index"]), q["op"], q.get("to"))
        if method == "POST" and url.path == "/__deck/undo":
            if not (headers.get("Content-Type") or "").startswith("application/json"):
                return 415, {"error": "json only"}
            q = json.loads(body.decode("utf-8"))
            if HERE not in sys.path:
                sys.path.insert(0, HERE)
            import deck_undo
            return importlib.reload(deck_undo).back(sys.modules[__name__], q["deck"], bool(q.get("redo")))
        if method == "POST" and url.path == "/__deck/publish":
            if not (headers.get("Content-Type") or "").startswith("application/json"):
                return 415, {"error": "json only"}
            return publish(json.loads(body.decode("utf-8"))["deck"])
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

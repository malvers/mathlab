#!/usr/bin/env python3
"""Render a deck build script as a sharp HTML slide show instead of a .pptx.

    python3 tools/pptx/html_deck.py build_nichtlinear_mathe11.py
    python3 tools/pptx/html_deck.py --prefix fos12- build_datenbanken_fos12.py
    python3 tools/pptx/html_deck.py --reshell    # PAGE changed: put it around every deck's own slides
    python3 tools/pptx/html_deck.py --inline DIR build_x.py   # one self-contained file, e.g. for offline

Every deck links the shared shell HTML/decks/deck.css + deck.js instead of carrying a copy: one change
reaches all decks at once, without rebuilding them. The two files are edited in place - this module
only links or (--inline) embeds them.

The build scripts describe every slide semantically (title, bullets, chapter,
merksatz, two columns). This module offers a stand-in for `omml.MathDeck` that
records those calls and writes a 960x540 HTML deck: real text, CSS instead of a
background bitmap, KaTeX for the $...$ formulas, one click per level-0 bullet
exactly like the PowerPoint build. Nothing in the .pptx pipeline is touched.

Slide 0 (Auftaktfolie) is included, with a licence-clean image (Pixabay Content
License, HTML/decks/morning/) and a time-aware greeting - the browser corrects
"Good morning!" to whatever time it actually is, something a .pptx never can.
"""
import collections
import html as _html
import json
import os
import re
import shutil
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

from design_lib import (INK, BODY, MUTED, STROKE, CARD, CODE_BG, CODE_INK, CODE_MUTED,
                        ORANGE, RED, GREEN, GREET_BG, W, H, MARGIN, CONTENT_W, TITLE_Y,
                        RULE_Y, BODY_Y, BODY_H, FOOT_Y, FOOTER_TEXT)

OUT_DIR = os.path.join(HERE, "..", "..", "HTML", "decks")
PREFIX = ""               # set by --prefix on the command line, see __main__
LAB_MIN_H = 640.0         # labs warn below 980x620 - give them a window that clears it
LAB_NOTE_Y = 126.0        # a lab's note sits right under the rules and the lab takes the room below, down to 496:
                          # Doc raised the Würfelspiel lab to this in the editor (17.09.2026), 18.09.: "Lab höher"
FRAME_ZOOM = 2.0          # live frames render twice as large and shrink back: sharp on a big screen
KATEX = "../morpheus/vendor/katex"

# Begruessungsfolie geometry - mirrors build_design.py's layout "Begrüßung" (the
# single source of truth for the .pptx master). Kept in sync by hand: a change
# there needs the same change here.
GREET_QUOTE = "Nur das Schöne wird die Welt retten!"
GREET_AUTHOR = "Fjodor Dostojewski"
GREET_IMG_W = 312.0
GREET_X = GREET_IMG_W + 24
GREET_W = W - GREET_X - MARGIN


# ------------------------------------------------------------- live frames ---
def live_frames(frames):
    """Small live pages laid over a slide at design coordinates - Doc, 16.09.2026: real 3D dice
    (wuerfel3d.html) next to the die nets. Each frame is dict(src=path under HTML/, x, y, w, h,
    title). Inline styles only, no CSS rule: decks without frames stay byte-identical. A click
    inside a frame stays there (the slide does not turn); the page passes keys back up.
    g: the click group the frame comes with (deck.css .step.kommt) - not there before it."""
    out = []
    for f in frames or ():
        kommt = ' step kommt" data-g="%d' % f["g"] if f.get("g") is not None else ""
        out.append('<iframe class="live-frame%s" src="../%s" title="%s" loading="lazy" '
                   'allowtransparency="true" style="position:absolute;left:%gpx;top:%gpx;'
                   'width:%gpx;height:%gpx;border:0;background:transparent;'
                   'transform:scale(%g);transform-origin:0 0"></iframe>'
                   % (kommt, _html.escape(f["src"], quote=True), _html.escape(f.get("title", ""), quote=True),
                      f["x"], f["y"], f["w"] * FRAME_ZOOM, f["h"] * FRAME_ZOOM, 1 / FRAME_ZOOM))
    return "".join(out)


# ------------------------------------------------------------------ markup ---
# the formatter lives in deck_markup.py - the browser editor (deck_edit.py) writes texts with the same one
from deck_markup import markup, _tex_spans, _bold, _DECK_START, _DECK_END   # noqa: F401


_CREDITS_CACHE = None


def _credit_for(image):
    """{author, page} for a morning/ image, read from HTML/decks/morning/credits.json -
    used for the tiny attribution link Pixabay's licence asks for but does not require."""
    global _CREDITS_CACHE
    if _CREDITS_CACHE is None:
        try:
            with open(os.path.join(OUT_DIR, "morning", "credits.json"), encoding="utf-8") as f:
                _CREDITS_CACHE = {r["file"]: r for r in json.load(f)}
        except (OSError, ValueError):
            _CREDITS_CACHE = {}
    row = _CREDITS_CACHE.get(os.path.basename(image))
    if not row:
        return None
    m = re.search(r"/([a-z0-9\-]+-\d+)_\d+\.(?:jpg|png)$", row.get("source", ""))
    page = "https://pixabay.com/photos/%s/" % m.group(1) if m else row.get("source")
    return {"author": row.get("author", ""), "page": page}


def web_morning_image(key):
    """Which of the 20 clean-licence Pixabay images belongs to which HTML deck.

    Separate from slides.morning_image(), which draws from tools/pptx/img/morning/ -
    a pool that still mixes those 20 with the 25 older, unlicensed motifs from
    Stift.pptx. This one only ever sees HTML/decks/morning/, so every HTML deck
    stays public-safe no matter which build script calls it. Same self-healing,
    least-used, stable-by-key logic as the .pptx side."""
    global _CREDITS_CACHE
    if _CREDITS_CACHE is None:
        _credit_for("")            # populate the cache as a side effect
    pool = sorted(_CREDITS_CACHE)
    if not pool:
        return None
    zuordnung = os.path.join(OUT_DIR, "morning", "zuordnung.json")
    try:
        with open(zuordnung, encoding="utf-8") as f:
            table = json.load(f)
    except (OSError, ValueError):
        table = {}
    if table.get(key) not in pool:
        used = collections.Counter(v for v in table.values() if v in pool)
        table[key] = min(pool, key=lambda name: (used[name], name))
        with open(zuordnung, "w", encoding="utf-8") as f:
            json.dump(dict(sorted(table.items())), f, indent=2, ensure_ascii=False)
            f.write("\n")
    return "morning/" + table[key]


def asset(path):
    """Copy a picture into HTML/decks/img/ and return the src to use from a deck.

    Diagrams are generated into tools/pptx/img/, which is git-ignored and lies
    outside the served root - a deck pointing there would show a broken image on
    the web. The .pptx embeds its pictures, so only the HTML twin needs this."""
    if not os.path.isabs(path):
        return path
    dst_dir = os.path.join(OUT_DIR, "img")
    os.makedirs(dst_dir, exist_ok=True)
    name = os.path.basename(path)
    shutil.copyfile(path, os.path.join(dst_dir, name))
    return "img/" + name


def click_groups(lines):
    """One click per level-0 line; deeper lines join the group above them."""
    groups = []
    for i, (_, level) in enumerate(lines):
        if level == 0 or not groups:
            groups.append([i])
        else:
            groups[-1].append(i)
    return groups


def bullet_list(lines, kind="line", start=0):
    """Render [(text, level)] as one paragraph per line, grouped for the build.
    `start` continues the click numbering - the right column comes after the left."""
    out = []
    groups = click_groups(lines)
    for gi, group in enumerate(groups):
        for i in group:
            text, level = lines[i]
            out.append('<p class="%s l%d step" data-g="%d">%s</p>'
                       % (kind, level, start + gi, markup(text)))
    return "\n".join(out), start + len(groups)


def figure_label(lab):
    """One word of a drawn figure as <p class="fl">, centred on (x, y) in the picture box.
    A label is (centre x, centre y, width, text) and may carry a fifth item: its own CSS, e.g.
    "font-size:24px;color:#0E244E" for a word that belongs inside a drawn box. The line height
    follows the type size (deck.css: line-height 1.28), so a bigger label stays centred.
    A sixth item is the click group the label comes with - faint and grey until then, like the svg <g> of its part
    (deck.css .step.ghost; ziegen_svg.py writes the same by hand); None or missing: always there. It may also be a
    dict: {"g": 3} as the number, {"g": 3, "kommt": True} not there at all before its click (deck.css .step.kommt),
    {"bis": 7} gone again once group 7 is on (data-bis) - with or without a g; "sanft": True fades it in and out
    (deck.css .sanft)."""
    x, y, w, text = lab[:4]
    css = lab[4] if len(lab) > 4 else ""
    k = lab[5] if len(lab) > 5 else None
    k = k if isinstance(k, dict) else {"g": k}
    m = re.search(r"font-size:\s*([\d.]+)px", css)
    line = float(m.group(1)) * 1.28 if m else 16.0
    cls = (" step %s" % ("kommt" if k.get("kommt") else "ghost")) if k.get("g") is not None else ""
    cls += " sanft" if k.get("sanft") else ""
    data = (' data-g="%d"' % k["g"] if k.get("g") is not None else "") + \
           (' data-bis="%d"' % k["bis"] if k.get("bis") is not None else "")
    return ('<p class="fl%s"%s style="left:%gpx;top:%gpx;width:%gpx%s">%s</p>'
            % (cls, data, x - w / 2, y - line / 2, w, ";" + css if css else "", markup(text)))


# -------------------------------------------------------------------- deck ---
class HtmlDeck:
    """Same call surface as slides.Deck / omml.MathDeck - writes HTML."""

    def __init__(self, out_name, greeting=True, greet_text="Good morning!",
                 greet_quote=GREET_QUOTE, greet_author=GREET_AUTHOR, greet_image=None):
        # HTML/decks/ is one flat, public namespace. The Mathe-11 .pptx names carry their
        # own prefix; the Informatik series do not (their OneDrive folder was the prefix),
        # so "normalisierung" or "wiederholung-lb1" would collide between FOS 12 and
        # Inf 11/13. --prefix puts the series in front of the file name, nothing else.
        base = os.path.splitext(os.path.basename(out_name))[0]
        tag = PREFIX.rstrip("-")
        if tag and base.endswith("-" + tag):   # "datenschutz-info9" -> "info9-datenschutz", not twice
            base = base[:-len(tag) - 1]
        self.name = PREFIX + base
        self.slides = []
        self.doc_title = self.name
        self.subtitle = ""
        self.narration = {}   # slide index -> spoken parts, see say()
        self.summaries = {}   # slide index -> one compact line for "Frag Solita", see summary()
        self.holds = set()    # slides after which Solita waits for a click, see say(hold=)
        if greeting:
            img = greet_image or web_morning_image(os.path.basename(out_name))
            self.greeting(greet_text, greet_quote, greet_author, img)

    # ------------------------------------------------------------ slides ---
    def _slide(self, cls, body):
        foot = ('<p class="foot">%s</p><p class="pageno"></p>'
                % _html.escape(FOOTER_TEXT, quote=False))
        self.slides.append('<section class="slide %s">%s%s</section>' % (cls, body, foot))

    def greeting(self, text="Good morning!", quote=GREET_QUOTE, author=GREET_AUTHOR,
                 image=None, index=0):
        """The Auftaktfolie - every HTML deck gets one automatically, same as the
        .pptx (see __init__ and slides.Deck.__init__), drawing its image from the
        clean-licence pool via web_morning_image() so nothing unlicensed ever
        reaches a public page.

        `text` is only the no-JS fallback. The live page knows the viewer's own
        clock, so it corrects "Good morning!" to whatever time it actually is -
        something a .pptx, built once and reused for months, can never do."""
        pic = ""
        if image:
            src = image if not os.path.isabs(image) else os.path.relpath(image, OUT_DIR)
            pic = '<img class="greet-pic" src="%s" alt="">' % _html.escape(src, quote=True)
            credit = _credit_for(image)
            if credit and credit["author"]:
                pic += ('<a class="greet-credit" href="%s" target="_blank" '
                        'rel="noopener">%s</a>'
                        % (_html.escape(credit["page"], quote=True),
                           _html.escape(credit["author"], quote=False)))
        body = """
      <div class="greet-ground"></div>%s
      <p class="greet-lead" id="greet-text">%s</p>
      <p class="greet-quote">%s</p>
      <p class="greet-author">%s</p>
      <p class="foot">%s</p><p class="pageno"></p>""" % (
            pic, _html.escape(text, quote=False), markup(quote), markup(author),
            _html.escape(FOOTER_TEXT, quote=False))
        self.slides.insert(index, '<section class="slide greet">%s</section>' % body)

    def title(self, kicker, title, sub):
        self.doc_title, self.subtitle = title, sub
        self._slide("title", """
      <div class="ring"></div><div class="ring-inner"></div><div class="orbit-dot"></div>
      <div class="title-bar"></div>
      <p class="kicker">%s</p>
      <h1>%s</h1>
      <p class="sub">%s</p>""" % (markup(kicker), markup(title), markup(sub)))

    def chapter(self, num, title, sub, image=None, credit=None, credit_url=None):
        """Chapter divider. With `image` a picture sits on the right and the text
        narrows to the left; `credit` (linked to `credit_url`) names the source
        under it - the decks are public, so every foreign picture carries its
        licence line. Same geometry as slides.Deck.chapter."""
        cls, pic = "chapter", ""
        if image:
            cls = "chapter has-pic"
            pic = ('<figure class="chap-pic"><img src="%s" alt=""></figure>'
                   % _html.escape(asset(image), quote=True))
            if credit and credit_url:
                pic += ('<a class="chap-credit" href="%s" target="_blank" rel="noopener">%s</a>'
                        % (_html.escape(credit_url, quote=True), _html.escape(credit, quote=False)))
            elif credit:
                pic += '<p class="chap-credit">%s</p>' % _html.escape(credit, quote=False)
        self._slide(cls, """
      <div class="chapter-bar"></div>
      <p class="kicker">Kapitel %02d</p>
      <h2>%s</h2>
      <p class="sub">%s</p>
      <div class="hair"></div>%s""" % (num, markup(title), markup(sub), pic))

    def bullets(self, title, lines, below=None, corner=None, corner_size=None):
        """`below`: a picture under the bullets that takes the rest of the slide down to the
        footer (Doc, 17.09.2026: the whole tree under the sum rule). It is always visible,
        only the bullets come in on clicks.
        `corner`: a small picture bottom right, like table_top's, but the bullets keep their full
        width - check that the lines stay clear of it. corner_size=(w, h) overrides the
        200x190 box (Doc, 17.09.2026: "auf 15 noch rechts unten klein den Baum")."""
        body, _ = bullet_list(lines)
        if below:
            body += '<div class="below"><img src="%s" alt=""></div>' % _html.escape(asset(below), quote=True)
        pic = ""
        if corner:
            size = (' style="max-width:%gpx;max-height:%gpx"' % corner_size) if corner_size else ""
            pic = '<img class="corner-pic" src="%s" alt=""%s>' % (_html.escape(asset(corner), quote=True), size)
        self._slide("content has-below" if below else "content",
                    '<h3>%s</h3><div class="rules"></div><div class="body">%s</div>%s'
                    % (markup(title), body, pic))

    def two_cols(self, title, left_lines, right_lines):
        left, n = bullet_list(left_lines, "col")
        right, _ = bullet_list(right_lines, "col", start=n)
        self._slide("content twocols", """
      <h3>%s</h3><div class="rules"></div>
      <div class="colgrid">
        <div class="card left">%s</div>
        <div class="card right">%s</div>
      </div>""" % (markup(title), left, right))

    def merksatz(self, text, label="Merksatz"):
        self._slide("merksatz", '<div class="quote-bar"></div><p class="satz">%s</p>'
                    '<p class="label">%s</p>' % (markup(text), markup(label)))

    def code(self, title, lines, size=None):
        rows = []
        for line in lines:
            rows.append(_html.escape(line if isinstance(line, str)
                                     else "".join(t for t, _ in line), quote=False))
        # the panel is 300 px high including 40 px padding top and bottom (border-box), so 12 lines
        # of 13.5 px (line-height 1.3, see CSS) fit. A longer listing takes the .pptx size steps and
        # a thinner padding, and shrinks further only if that is not enough - otherwise its last
        # lines run out of the dark panel. Up to 12 lines the markup stays as it was.
        n, box, pre = max(len(rows), 1), "", ""
        if n * 13.5 * 1.3 > 220:
            size = 11.5 if n <= 14 else 10.5 if n <= 16 else 10
            pad = min(40.0, max(14.0, (300 - n * size * 1.3) / 2))
            size = min(size, (300 - 2 * pad) / (n * 1.3) // 0.5 * 0.5)
            box = ' style="padding-top:%gpx;padding-bottom:%gpx"' % (pad, pad)
            pre = ' style="font-size:%gpx"' % size
        self._slide("content code", '<h3>%s</h3><div class="rules"></div>'
                    '<div class="codepanel"%s><pre%s>%s</pre></div>'
                    % (markup(title), box, pre, "\n".join(rows) or " "))

    @staticmethod
    def _table(rows, col_w, left, top, marks=None, font_size=12, bold_cols=(),
               mono_cols=(), align=None):
        """One <table> with the authored column widths, placed like the native
        PowerPoint table it stands for. The canvas is 960 units wide in both
        worlds, so pt map to px 1:1. Shared by table_top and table_bullets."""
        marks = marks or {}
        cols = "".join('<col style="width:%gpx">' % w for w in col_w)
        out = []
        for r, row in enumerate(rows):
            head = r == 0
            cells = []
            for c, text in enumerate(row):
                cls = []
                if not head:
                    if c in bold_cols:
                        cls.append("b")
                    if c in mono_cols:
                        cls.append("m")
                if align and align[c]:
                    cls.append("a" + align[c])
                tint = marks.get((r, c), marks.get(r))
                tag = "th" if head else "td"
                cells.append("<%s%s%s>%s</%s>" % (
                    tag,
                    ' class="%s"' % " ".join(cls) if cls else "",
                    ' style="background:#%s"' % tint if tint and not head else "",
                    markup(str(text)), tag))
            out.append("<tr>%s</tr>" % "".join(cells))
        return ('<table class="dtable" style="left:%gpx;top:%gpx;width:%gpx;'
                'font-size:%gpx"><colgroup>%s</colgroup>%s</table>'
                % (left, top, sum(col_w), font_size, cols, "".join(out)))

    def table_top(self, title, rows, col_w, lines, marks=None, font_size=12, row_h=None,
                  bold_cols=(), mono_cols=(), align=None, x=None, corner=None, frames=None):
        """Full-width table on top, bullets underneath - the HTML twin of
        slides.Deck.table_top. Same numbers, same look: the .pptx draws a native
        table, here it becomes a <table> with the authored column widths.
        `corner` puts a small picture bottom right (the thing the table talks about,
        e.g. the die net next to its counting table); the bullets narrow around it."""
        row_h = row_h or font_size * 1.85
        table = self._table(rows, col_w, MARGIN if x is None else x, BODY_Y, marks,
                            font_size, bold_cols, mono_cols, align)
        body = ""
        if lines:
            top = BODY_Y + row_h * len(rows) + 14
            body = ('<div class="body" style="top:%gpx;height:%gpx">%s</div>'
                    % (top, FOOT_Y - top - 8, bullet_list(lines)[0]))
        pic = ('<img class="corner-pic" src="%s" alt="">' % _html.escape(asset(corner), quote=True)
               if corner else "")
        self._slide("content has-corner" if corner else "content",
                    '<h3>%s</h3><div class="rules"></div>%s%s%s%s'
                    % (markup(title), table, body, pic, live_frames(frames)))

    def table_bullets(self, title, lines, rows, col_w, marks=None, font_size=11,
                      bold_cols=(), mono_cols=(), align=None, body_w=404, y=None,
                      more=()):
        """Bullets on the left, table on the right - the twin of
        slides.Deck.table_bullets, same numbers: the body keeps `body_w`, the
        table hangs off the right margin and starts 4 px under the rule.
        `more`: further tables, same dicts as in slides.Deck (rows, col_w, y, ...)."""
        table = self._table(rows, col_w, W - MARGIN - sum(col_w),
                            BODY_Y + 4 if y is None else y, marks, font_size,
                            bold_cols, mono_cols, align)
        for t in more:
            t = dict(t)
            t_rows, t_cols, t_y = t.pop("rows"), t.pop("col_w"), t.pop("y")
            t.pop("name", None)                       # a PowerPoint shape name, nothing here
            table += self._table(t_rows, t_cols, W - MARGIN - sum(t_cols), t_y,
                                 t.get("marks"), t.get("font_size", font_size),
                                 t.get("bold_cols", ()), t.get("mono_cols", ()),
                                 t.get("align"))
        body = ('<div class="body" style="width:%gpx">%s</div>'
                % (body_w, bullet_list(lines)[0]))
        self._slide("content", '<h3>%s</h3><div class="rules"></div>%s%s'
                    % (markup(title), body, table))

    def lab(self, title, src, lines=None, note="", bottom=496.0):
        """A Mathe-Labor page inside the slide - the thing PowerPoint cannot do.
        `src` is relative to the site root, e.g. "binomischeslabor.html". The lab is
        laid out wide (LAB_W) and scaled into the content column, so its own
        responsive layout gets a landscape window instead of a letterbox."""
        if not note and lines:
            first = lines[0]
            note = first[0] if isinstance(first, tuple) else first
        top = LAB_NOTE_Y + (24.0 if note else 0.0)
        # the lab gets a landscape window of its own, then rides a scale into the
        # content column - below 980x620 the labs put a warning over themselves
        scale = (bottom - top) / LAB_MIN_H
        lab_w = -(-CONTENT_W / scale * 100 // 1) / 100.0   # up to 0.01 px: %g cut it to 815.99 px, a hairline showed
        cap = ('<p class="labnote" style="top:%gpx">%s</p>' % (LAB_NOTE_Y, markup(note))
               if note else "")
        self._slide("content lab", """
      <h3>%s</h3><div class="rules"></div>%s
      <div class="labframe" style="top:%gpx;height:%gpx">
        <iframe src="../%s" title="%s" style="width:%gpx;height:%gpx;transform:scale(%g)"></iframe>
      </div>
      <div class="labbar">
        <a href="../%s" target="_blank" rel="noopener">Öffne das Lab in neuem Tab</a>
      </div>""" % (markup(title), cap, top, bottom - top, _html.escape(src, quote=True),
                   _html.escape(title, quote=True), lab_w, LAB_MIN_H, scale,
                   _html.escape(src, quote=True)))

    def picture(self, title, path, lines=None, align="center", frames=None, **kw):
        """align="left" puts the picture at the left margin instead of the middle -
        a tree diagram reads from the left, and centred it floats in the slide.
        With `lines` the picture goes under the bullets (has-below, like bullets(below=)):
        .pic and .body share the same absolute box, so as siblings the text ran straight
        over the picture (Doc, 20.09.2026: "das ist durcheinander")."""
        img = '<img src="%s" alt="">' % _html.escape(asset(path), quote=True)
        if lines:
            self._slide("content has-below", '<h3>%s</h3><div class="rules"></div>'
                        '<div class="body">%s<div class="below%s">%s</div></div>%s'
                        % (markup(title), bullet_list(lines)[0],
                           " left" if align == "left" else "", img, live_frames(frames)))
        else:
            self._slide("content", '<h3>%s</h3><div class="rules"></div>'
                        '<div class="%s">%s</div>%s'
                        % (markup(title), "pic left" if align == "left" else "pic",
                           img, live_frames(frames)))

    def figure(self, title, svg, labels=None, png=None, lines=None, align="center", frames=None, **kw):
        """A drawn figure in the picture box (tools/pptx/ai_svg.py, svgfig): the shapes as inline SVG - sharp
        on any beamer - and the words as <p class="fl"> laid over it, which the deck editor changes like any
        line (Doc, 23.09.2026: "solche Bilder immer im HTML malen ... kann ich dann editieren?"). A label is
        (centre x, centre y, width, text[, css]) in the box's 816 x 330 coordinates; the SVG must fill the box for
        them to line up, so `lines` (the smaller .below box) takes no labels. `png`: the .pptx twin only.
        `source`: (text, url) - a small linked source under the picture box (deck.css .fig-source)."""
        words = "".join(figure_label(lab) for lab in (labels or []))
        src = kw.get("source")
        quelle = ('<a class="fig-source" href="%s" target="_blank" rel="noopener">%s</a>'
                  % (_html.escape(src[1], quote=True), _html.escape(src[0], quote=False))) if src else ""
        if lines:
            assert not labels, "labels need the full picture box - no lines= with labels"
            self._slide("content has-below", '<h3>%s</h3><div class="rules"></div>'
                        '<div class="body">%s<div class="below%s">%s</div></div>%s'
                        % (markup(title), bullet_list(lines)[0],
                           " left" if align == "left" else "", svg, live_frames(frames)))
        else:
            self._slide("content", '<h3>%s</h3><div class="rules"></div>'
                        '<div class="%s">%s%s</div>%s%s'
                        % (markup(title), "pic left" if align == "left" else "pic",
                           svg, words, quelle, live_frames(frames)))

    @staticmethod
    def fit(path, box_w, box_h):
        """Size of a picture scaled into box_w x box_h - up or down, like the .pptx does."""
        from PIL import Image
        iw, ih = Image.open(path).size
        k = min(box_w / iw, box_h / ih)
        return iw * k, ih * k

    @staticmethod
    def placed_img(path, x, y, w, h):
        """A picture at design coordinates - for layouts that place it by hand, as the .pptx does."""
        return ('<img src="%s" alt="" style="position:absolute;left:%gpx;top:%gpx;width:%gpx;height:%gpx">'
                % (_html.escape(asset(path), quote=True), x, y, w, h))

    def picture_bullets(self, title, path, lines, pic_w=380, pic_h=None, side="right"):
        """Bullets on one side, picture on the other - the twin of slides.Deck.picture_bullets,
        same numbers: the picture fits pic_w x pic_h, centred in its column 4 px under the rule."""
        w, h = self.fit(path, pic_w, pic_h or BODY_H)
        body_w = CONTENT_W - pic_w - 24
        if side == "right":
            body_x, col_x = MARGIN, W - MARGIN - pic_w
        else:
            body_x, col_x = W - MARGIN - body_w, MARGIN
        self._slide("content", '<h3>%s</h3><div class="rules"></div>'
                    '<div class="body" style="left:%gpx;width:%gpx">%s</div>%s'
                    % (markup(title), body_x, body_w, bullet_list(lines)[0],
                       self.placed_img(path, col_x + (pic_w - w) / 2, BODY_Y + 4, w, h)))

    def picture_table(self, title, path, rows, col_w, lines, pic_w=380, font_size=11,
                      bold_cols=(), marks=None, align=None, mono_cols=()):
        """Picture left, table right, bullets underneath both - the twin of
        slides.Deck.picture_table, same numbers."""
        w, h = self.fit(path, pic_w, 210)
        table = self._table(rows, col_w, W - MARGIN - sum(col_w), BODY_Y + 4, marks, font_size,
                            bold_cols, mono_cols, align)
        top = BODY_Y + max(h, font_size * 1.9 * len(rows)) + 14
        self._slide("content", '<h3>%s</h3><div class="rules"></div>%s%s'
                    '<div class="body" style="top:%gpx;height:%gpx">%s</div>'
                    % (markup(title), self.placed_img(path, MARGIN, BODY_Y, w, h), table,
                       top, FOOT_Y - top - 8, bullet_list(lines)[0]))

    def say(self, *parts, hold=False):
        """Narration for the slide just added (Doc, 15.09.2026: Solita reads the deck -
        "NIEMALS Browserstimme! So wie beim DocPad!"). parts[0] is spoken when the slide
        appears, parts[k] while click group k comes in. The clips are made separately by
        tools/pptx/deck_audio.mjs with Solita's DocPad voice; the page only plays them.
        hold=True: after this slide Solita does not turn on by herself - the next slide (a
        solution) comes only on a click, and she goes on talking there."""
        self.narration[len(self.slides) - 1] = [p.strip() for p in parts if p and p.strip()]
        if hold:
            self.holds.add(len(self.slides) - 1)

    def summary(self, text):
        """One compact line for the slide just added - what "Frag Solita" sends for every slide
        that is NOT on screen (Doc, 16.09.2026: sending the whole deck cost ~3,500 tokens a
        question). Plain text, no LaTeX, but keep the key numbers ("4 steht 4-mal = 2/3"):
        pupils ask about earlier slides without naming them, and without the numbers Claude
        guesses. Lives right next to the slide so a change to one reminds you of the other."""
        self.summaries[len(self.slides) - 1] = " ".join(text.split())

    # ------------------------------------------------------------- output ---
    def save(self, path=None):
        os.makedirs(OUT_DIR, exist_ok=True)
        if INLINE_DIR:                                   # self-contained copy, the public deck stays untouched
            os.makedirs(INLINE_DIR, exist_ok=True)
            path = path or os.path.join(INLINE_DIR, self.name + ".html")
        path = path or os.path.join(OUT_DIR, self.name + ".html")
        # a deck edited in the browser is the master now (Doc, 17.09.2026) - its script would undo the edits
        from deck_edit import EDITED_MARK
        if not INLINE_DIR and os.path.exists(path) and EDITED_MARK in open(path, encoding="utf-8").read():
            print("%s  NICHT überschrieben: im Browser bearbeitet (Marke deck-master in der Datei)"
                  % os.path.normpath(path))
            return path
        with open(path, "w", encoding="utf-8") as f:
            f.write(self.render())
        print("%s  (%d Folien)" % (os.path.normpath(path), len(self.slides)))
        return path

    def set_avatar(self, src, alt):
        """Who sits in the Frag-Solita row. Solita by default; a deck can put someone else there
        (Doc, 24.09.2026: the Maya deck shows his own team photo). src is relative to HTML/decks/."""
        self.avatar = (src, alt)

    def set_voice(self, voice):
        """'doc': Frag Solita answers in Doc's own voice (a Google Voice Replication, 24.09.2026)."""
        self.voice = voice

    def render(self):
        # the spoken parts travel inside the page - deck_audio.mjs reads them from here too
        narr = (json.dumps({"deck": self.name,
                            "slides": {str(k): v for k, v in sorted(self.narration.items())},
                            "hold": sorted(self.holds)},
                           ensure_ascii=False).replace("</", "<\\/") if self.narration else "")
        summ = json.dumps({str(k): v for k, v in sorted(self.summaries.items())},
                          ensure_ascii=False).replace("</", "<\\/")
        out = page(_html.escape(self.doc_title, quote=False), _html.escape(self.subtitle, quote=False),
                   "\n".join(self.slides), narr, summ)
        voice = getattr(self, "voice", None)
        if voice:
            assert out.count("<body>") == 1, "PAGE has no plain <body> - set_voice() needs updating"
            out = out.replace("<body>", '<body data-voice="%s">' % _html.escape(voice, quote=True), 1)
        avatar = getattr(self, "avatar", None)
        if avatar:
            old = '<img src="../resources/solita-avatar.png" alt="Solita"'
            assert old in out, "the Solita avatar moved in PAGE - set_avatar() needs updating"
            out = out.replace(old, '<img src="%s" alt="%s"' % (_html.escape(avatar[0], quote=True),
                                                               _html.escape(avatar[1], quote=True)), 1)
        return out


# --------------------------------------------------------------- template ----
PAGE = """<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>__TITLE__</title>
<meta name="description" content="__SUB__">
<link rel="icon" type="image/svg+xml" href="../resources/favicon.svg">
<link rel="icon" type="image/png" sizes="256x256" href="../resources/favicon.png">
<link rel="stylesheet" href="__KATEX__/katex.min.css">
<script defer src="__KATEX__/katex.min.js"></script>
<script defer src="../js/solita-listen.js"></script>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Raleway:wght@300;400;600&display=swap" rel="stylesheet">
__SHELL_CSS__
</head>
<body>
<div id="stage"><div id="deck">
__SLIDES__
</div></div>
<div id="bar"></div>
<div id="nav"><button id="nav-prev" type="button" title="Vorige Folie, fertig aufgebaut (Shift+←)" aria-label="Vorige Folie"></button><button id="nav-next" type="button" title="Nächste Folie, fertig aufgebaut (Shift+→)" aria-label="Nächste Folie"></button></div>
<div id="hud"><button id="play" title="Solita erklärt" aria-label="Solita erklärt" hidden></button><button id="full" title="Vollbild (f)" aria-label="Vollbild"></button></div>
<div id="ask">
  <div id="ask-panel" hidden>
    <div id="ask-head"><span>Frag Solita zur Folie oder Präsi<b id="ask-cost" title="Kosten der letzten Frage"></b></span><button id="ask-close" type="button" title="Schließen (Esc)" aria-label="Schließen">&times;</button></div>
    <div id="ask-out" aria-live="polite"></div>
    <label for="ask-in" hidden></label>
    <div id="ask-row"><button id="ask-mic" type="button" title="Frage sprechen" aria-label="Frage sprechen"></button><button id="ask-tts" type="button" title="Solita liest vor" aria-label="Vorlesen an/aus"></button><input id="ask-in" type="text" autocomplete="off" placeholder="Warum zwei Drittel?" aria-label="Deine Frage an Solita"><button id="ask-send" type="button" title="Abschicken (Enter)" aria-label="Abschicken">?</button></div>
  </div>
  <button id="ask-btn" class="invite" type="button" title="Frag Solita" aria-label="Frag Solita"><img src="../resources/solita-avatar.png" alt="Solita" width="46" height="46"></button>
</div>
<script id="narration" type="application/json">__NARR__</script>
<script id="summary" type="application/json">__SUMMARY__</script>
__SHELL_JS__
</body>
</html>
"""



# ------------------------------------------------------------ shared shell ---
# The shell every deck shares - HTML/decks/deck.css and deck.js - IS the source (refactor audit 27.09.2026).
# This file used to carry a copy of both as strings and wrote them out with --shell; Doc edits the two files
# directly (the pen, the skip slides, the green dot all happened there), so the copies had fallen behind and
# --shell would have thrown those changes away. Now a public deck links the files, --inline embeds them as
# they are, and there is nothing to generate. No cache-busting query on purpose - it would put the shell's
# version back into every deck; GitHub Pages caches for 10 minutes.
SHELL_CSS, SHELL_JS = "deck.css", "deck.js"
INLINE_DIR = ""           # --inline DIR: embed the shell and write there - a PRIVATE single-file variant
# (e.g. the Wuerfelspiel with the real test numbers on OneDrive). What cannot be packed - pictures, Solita's
# audio, labs, the 3D dice, KaTeX - resolves against the live site through <base> (Doc, 16.09.2026).
SITE = "https://docalvers.de/decks/"


def shell_text(name):
    """The live shell file (deck.css or deck.js) as it is, for a self-contained copy."""
    with open(os.path.join(OUT_DIR, name), encoding="utf-8") as f:
        return f.read()


def page_inline_base(tpl):
    """Every relative URL of a single-file copy points to the live decks folder - one line, no rewriting."""
    return tpl.replace('<meta charset="utf-8">\n', '<meta charset="utf-8">\n<base href="%s">\n' % SITE, 1)


def page(title, sub, slides_html, narr, summ):
    """The whole deck page. title and sub arrive HTML-escaped."""
    if INLINE_DIR:
        css, js = "<style>%s</style>" % shell_text(SHELL_CSS), "<script>%s</script>" % shell_text(SHELL_JS)
        return (page_inline_base(PAGE).replace("__TITLE__", title).replace("__SUB__", sub)
                    .replace("__KATEX__", KATEX).replace("__SHELL_CSS__", css).replace("__SLIDES__", slides_html)
                    .replace("__NARR__", narr).replace("__SUMMARY__", summ).replace("__SHELL_JS__", js))
    else:
        css = '<link rel="stylesheet" href="%s">' % SHELL_CSS
        js = '<script src="%s"></script>' % SHELL_JS
    return (PAGE.replace("__TITLE__", title).replace("__SUB__", sub).replace("__KATEX__", KATEX)
                .replace("__SHELL_CSS__", css).replace("__SLIDES__", slides_html)
                .replace("__NARR__", narr).replace("__SUMMARY__", summ).replace("__SHELL_JS__", js))


def reshell():
    """Put the current PAGE around every deck in HTML/decks - slides, narration and summaries stay
    byte for byte what they are. Only needed when PAGE itself changes."""
    import glob
    changed = total = 0
    for path in sorted(glob.glob(os.path.join(OUT_DIR, "*.html"))):
        s = open(path, encoding="utf-8").read()
        if _DECK_START not in s:
            continue
        total += 1
        a = s.index(_DECK_START) + len(_DECK_START)
        slides_html = s[a:s.index(_DECK_END, a)]
        title = re.search(r"<title>(.*?)</title>", s, re.S).group(1)
        sub = re.search(r'<meta name="description" content="(.*?)">', s, re.S).group(1)
        narr = re.search(r'<script id="narration" type="application/json">(.*?)</script>', s, re.S)
        summ = re.search(r'<script id="summary" type="application/json">(.*?)</script>', s, re.S)
        t = page(title, sub, slides_html, narr.group(1) if narr else "", summ.group(1) if summ else "{}")
        if t != s:
            with open(path, "w", encoding="utf-8") as f:
                f.write(t)
            changed += 1
    print("reshell: %d of %d decks rewritten" % (changed, total))


# ------------------------------------------------------------------ runner ---
def build(script):
    """Run a build_*.py with MathDeck/Deck replaced by HtmlDeck."""
    import runpy
    import omml, slides
    omml.MathDeck = HtmlDeck
    slides.Deck = HtmlDeck
    path = script if os.path.isabs(script) else os.path.join(HERE, script)
    runpy.run_path(path, run_name="__html_deck__")


if __name__ == "__main__":
    args = sys.argv[1:]
    if args == ["--shell"]:
        sys.exit("--shell is gone (27.09.2026): HTML/decks/deck.css and deck.js are the source, edit them in place.")
    if args == ["--reshell"]:
        reshell()
        sys.exit()
    if args[:1] == ["--inline"] and len(args) >= 3:
        INLINE_DIR, args = os.path.abspath(args[1]), args[2:]
    if args[:1] == ["--prefix"] and len(args) >= 3:
        PREFIX, args = args[1], args[2:]
    if len(args) < 1:
        sys.exit(__doc__)
    build(args[0])

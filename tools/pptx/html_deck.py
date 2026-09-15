#!/usr/bin/env python3
"""Render a deck build script as a sharp HTML slide show instead of a .pptx.

    python3 tools/pptx/html_deck.py build_nichtlinear_mathe11.py
    python3 tools/pptx/html_deck.py --prefix fos12- build_datenbanken_fos12.py

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
KATEX = "../morpheus/vendor/katex"

# Begruessungsfolie geometry - mirrors build_design.py's layout "Begrüßung" (the
# single source of truth for the .pptx master). Kept in sync by hand: a change
# there needs the same change here.
GREET_QUOTE = "Nur das Schöne wird die Welt retten!"
GREET_AUTHOR = "Fjodor Dostojewski"
GREET_IMG_W = 312.0
GREET_X = GREET_IMG_W + 24
GREET_W = W - GREET_X - MARGIN


# ------------------------------------------------------------------ markup ---
def _tex_spans(text):
    """$...$ becomes a KaTeX placeholder, everything else is escaped text."""
    out = []
    for i, part in enumerate(re.split(r"\$([^$]*)\$", text)):
        if i % 2:
            out.append('<span class="tex" data-tex="%s"></span>'
                       % _html.escape(part, quote=True))
        else:
            out.append(_bold(part))
    return "".join(out)


def _bold(part):
    """**word** becomes bold; <b>, <i> and the <c2>/<c3> colour tags survive."""
    esc = _html.escape(part, quote=False)
    esc = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", esc)
    esc = esc.replace("&lt;b&gt;", "<b>").replace("&lt;/b&gt;", "</b>")
    esc = esc.replace("&lt;i&gt;", "<i>").replace("&lt;/i&gt;", "</i>")
    esc = re.sub(r"&lt;c([123])&gt;", r'<span class="c\1">', esc)
    return esc.replace("&lt;/c1&gt;", "</span>").replace("&lt;/c2&gt;", "</span>") \
              .replace("&lt;/c3&gt;", "</span>")


def markup(text):
    return _tex_spans(text) if "$" in text else _bold(text)


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


# -------------------------------------------------------------------- deck ---
class HtmlDeck:
    """Same call surface as slides.Deck / omml.MathDeck - writes HTML."""

    def __init__(self, out_name, greeting=True, greet_text="Good morning!",
                 greet_quote=GREET_QUOTE, greet_author=GREET_AUTHOR, greet_image=None):
        # HTML/decks/ is one flat, public namespace. The Mathe-11 .pptx names carry their
        # own prefix; the Informatik series do not (their OneDrive folder was the prefix),
        # so "normalisierung" or "wiederholung-lb1" would collide between FOS 12 and
        # Inf 11/13. --prefix puts the series in front of the file name, nothing else.
        self.name = PREFIX + os.path.splitext(os.path.basename(out_name))[0]
        self.slides = []
        self.doc_title = self.name
        self.subtitle = ""
        self.narration = {}   # slide index -> spoken parts, see say()
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

    def bullets(self, title, lines):
        body, _ = bullet_list(lines)
        self._slide("content", '<h3>%s</h3><div class="rules"></div><div class="body">%s</div>'
                    % (markup(title), body))

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
        self._slide("content code", '<h3>%s</h3><div class="rules"></div>'
                    '<div class="codepanel"><pre>%s</pre></div>'
                    % (markup(title), "\n".join(rows) or " "))

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
                  bold_cols=(), mono_cols=(), align=None, x=None, corner=None):
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
                    '<h3>%s</h3><div class="rules"></div>%s%s%s'
                    % (markup(title), table, body, pic))

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

    def lab(self, title, src, lines=None, note="", bottom=486.0):
        """A Mathe-Labor page inside the slide - the thing PowerPoint cannot do.
        `src` is relative to the site root, e.g. "binomischeslabor.html". The lab is
        laid out wide (LAB_W) and scaled into the content column, so its own
        responsive layout gets a landscape window instead of a letterbox."""
        if not note and lines:
            first = lines[0]
            note = first[0] if isinstance(first, tuple) else first
        top = BODY_Y + (26.0 if note else 0.0)
        # the lab gets a landscape window of its own, then rides a scale into the
        # content column - below 980x620 the labs put a warning over themselves
        scale = (bottom - top) / LAB_MIN_H
        lab_w = CONTENT_W / scale
        cap = ('<p class="labnote" style="top:%gpx">%s</p>' % (BODY_Y, markup(note))
               if note else "")
        self._slide("content lab", """
      <h3>%s</h3><div class="rules"></div>%s
      <div class="labframe" style="top:%gpx;height:%gpx">
        <iframe src="../%s" title="%s" style="width:%gpx;height:%gpx;transform:scale(%g)"></iframe>
      </div>
      <div class="labbar">
        <a href="../%s" target="_blank" rel="noopener">Neuer Tab</a>
        <button class="labnext">Weiter &#9656;</button>
      </div>""" % (markup(title), cap, top, bottom - top, _html.escape(src, quote=True),
                   _html.escape(title, quote=True), lab_w, LAB_MIN_H, scale,
                   _html.escape(src, quote=True)))

    def picture(self, title, path, lines=None, align="center", **kw):
        """align="left" puts the picture at the left margin instead of the middle -
        a tree diagram reads from the left, and centred it floats in the slide."""
        src = asset(path)
        cls = "pic left" if align == "left" else "pic"
        self._slide("content", '<h3>%s</h3><div class="rules"></div>'
                    '<div class="%s"><img src="%s" alt=""></div>%s'
                    % (markup(title), cls, _html.escape(src, quote=True),
                       '<div class="body">%s</div>' % bullet_list(lines)[0] if lines else ""))

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

    # ------------------------------------------------------------- output ---
    def save(self, path=None):
        os.makedirs(OUT_DIR, exist_ok=True)
        path = path or os.path.join(OUT_DIR, self.name + ".html")
        with open(path, "w", encoding="utf-8") as f:
            f.write(self.render())
        print("%s  (%d Folien)" % (os.path.normpath(path), len(self.slides)))
        return path

    def render(self):
        # the spoken parts travel inside the page - deck_audio.mjs reads them from here too
        narr = (json.dumps({"deck": self.name,
                            "slides": {str(k): v for k, v in sorted(self.narration.items())},
                            "hold": sorted(self.holds)},
                           ensure_ascii=False).replace("</", "<\\/") if self.narration else "")
        return (PAGE.replace("__TITLE__", _html.escape(self.doc_title, quote=False))
                    .replace("__SUB__", _html.escape(self.subtitle, quote=False))
                    .replace("__KATEX__", KATEX)
                    .replace("__CSS__", CSS)
                    .replace("__SLIDES__", "\n".join(self.slides))
                    .replace("__NARR__", narr)
                    .replace("__JS__", JS))


# --------------------------------------------------------------- template ----
CSS = """
:root{
  --ink:#__INK__; --body:#__BODY__; --muted:#__MUTED__; --stroke:#__STROKE__;
  --card:#__CARD__; --orange:#__ORANGE__; --red:#__RED__; --green:#__GREEN__;
  --codebg:#__CODEBG__; --codeink:#__CODEINK__; --codemuted:#__CODEMUTED__;
  --greetbg:#__GREETBG__;
}
*{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;background:#0E244E;overflow:hidden}
body{font-family:Raleway,system-ui,sans-serif;color:var(--body)}
#stage{position:fixed;inset:0;display:grid;place-items:center}
#deck{width:__W__px;height:__H__px;position:relative;transform-origin:center center}
.slide{position:absolute;inset:0;display:none;overflow:hidden;
  background-image:
    radial-gradient(rgba(14,36,78,.10) 1px, transparent 1px),
    radial-gradient(58% 62% at 84% 10%, rgba(245,194,66,.30), transparent 70%),
    radial-gradient(52% 55% at 4% 96%, rgba(121,158,49,.20), transparent 70%),
    linear-gradient(122deg,#fff 0%, #b0c4e2 100%);
  background-size:24px 24px, auto, auto, auto;
}
.slide.on{display:block}

/* footer, shared by every slide */
.slide::before{content:"";position:absolute;left:__M__px;top:__FOOT__px;
  width:__CW__px;height:1px;background:rgba(14,36,78,.16)}
.foot{position:absolute;left:__M__px;top:__FOOTT__px;font-size:10px;letter-spacing:1.2px;
  color:var(--muted)}
.pageno{position:absolute;right:72px;top:__FOOTT__px;font-size:10px;letter-spacing:1.2px;
  color:var(--muted)}

h1,h2,h3,.kicker,.label,.card>.col.l0{font-family:Orbitron,system-ui,sans-serif}
b{font-weight:600;color:var(--ink)}
.c1{color:var(--orange)}.c2{color:var(--red)}.c3{color:var(--green)}

/* --- content ------------------------------------------------------------ */
.slide h3{position:absolute;left:__M__px;top:__TY__px;width:__CW__px;font-size:28px;font-weight:700;
  color:var(--ink);letter-spacing:-.2px;line-height:1.05}
.rules{position:absolute;left:__M__px;top:__RY__px;width:64px;height:3px}
.rules::before,.rules::after{content:"";position:absolute;top:0;height:3px}
.rules::before{left:0;width:44px;background:var(--orange)}
.rules::after{left:50px;width:14px;background:var(--green)}
.body{position:absolute;left:__M__px;top:__BY__px;width:__CW__px;height:__BH__px}

p.line{position:relative;line-height:1.25}
p.line.l0{font-size:20px;color:var(--body);margin-top:12px;padding-left:20px}
p.line.l1{font-size:17px;color:var(--muted);margin-top:6px;margin-left:24px;padding-left:20px;
  line-height:1.2}
p.line.l2{font-size:15px;color:var(--muted);margin-top:4px;margin-left:48px;padding-left:20px}
p.line:first-child{margin-top:0}
p.line::before{content:"";position:absolute;left:0;width:7px;height:7px;top:.55em}
p.line.l0::before{background:var(--red)}
p.line.l1::before{background:var(--green);width:6px;height:6px}
p.line.l2::before{background:#4A79C9;width:6px;height:6px}

/* --- two columns -------------------------------------------------------- */
.colgrid{position:absolute;left:__M__px;top:__BY__px;width:__CW__px;height:304px;
  display:grid;grid-template-columns:396px 396px;gap:24px}
.card{background:var(--card);border:.75px solid rgba(14,36,78,.12);padding:26px;
  position:relative}
.card::before{content:"";position:absolute;left:0;top:0;right:0;height:3px}
.card.left::before{background:var(--orange)}
.card.right::before{background:var(--green)}
p.col{position:relative;line-height:1.25}
p.col.l0{font-size:15px;font-weight:700;color:var(--ink);letter-spacing:2px;
  text-transform:uppercase;line-height:1.2}
p.col.l1{font-size:17px;color:var(--body);margin-top:10px;padding-left:20px}
p.col.l1::before{content:"";position:absolute;left:0;top:.55em;width:7px;height:7px}
.card.left p.col.l1::before{background:var(--red)}
.card.right p.col.l1::before{background:var(--green)}

/* --- title -------------------------------------------------------------- */
.slide.title .ring{position:absolute;left:690px;top:96px;width:340px;height:340px;
  border:1px solid rgba(14,36,78,.14);border-radius:50%}
.slide.title .ring-inner{position:absolute;left:762px;top:168px;width:196px;height:196px;
  border:1.5px solid rgba(245,194,66,.7);border-radius:50%}
.slide.title .orbit-dot{position:absolute;left:848px;top:158px;width:20px;height:20px;
  border-radius:50%;background:var(--orange)}
.slide.title .title-bar{position:absolute;left:__M__px;top:214px;width:64px;height:4px;
  background:var(--orange)}
.slide.title .kicker{position:absolute;left:__M__px;top:232px;font-size:12px;font-weight:700;
  color:var(--red);letter-spacing:3px;text-transform:uppercase}
.slide.title h1{position:absolute;left:__M__px;top:262px;width:600px;font-size:44px;
  font-weight:700;color:var(--ink);line-height:1.08;letter-spacing:-.5px}
.slide.title .sub{position:absolute;left:__M__px;top:392px;width:600px;font-size:19px;
  color:var(--muted);line-height:1.3}

/* --- chapter ------------------------------------------------------------ */
.slide.chapter .chapter-bar{position:absolute;left:__M__px;top:188px;width:4px;height:128px;
  background:var(--orange)}
.slide.chapter .kicker{position:absolute;left:__MC__px;top:188px;font-size:12px;font-weight:700;
  color:var(--red);letter-spacing:3px;text-transform:uppercase}
.slide.chapter h2{position:absolute;left:__MC__px;top:216px;width:700px;font-size:34px;
  font-weight:700;color:var(--ink);line-height:1.1;letter-spacing:-.3px}
.slide.chapter .sub{position:absolute;left:__MC__px;top:312px;width:640px;font-size:17px;
  color:var(--muted);line-height:1.3}
.slide.chapter .hair{position:absolute;left:__M__px;top:356px;width:__CW__px;height:1px;
  background:rgba(14,36,78,.14)}
/* with a picture: text on the left, picture + licence line on the right */
.slide.chapter.has-pic h2{width:420px;font-size:28px}
.slide.chapter.has-pic .sub{width:420px}
.slide.chapter.has-pic .hair{width:448px;top:372px}   /* room for a two-line sub */
.chap-pic{position:absolute;left:560px;top:150px;width:328px;height:230px;margin:0;
  display:block;overflow:hidden;background:var(--card);
  border:.75px solid rgba(14,36,78,.12)}
.chap-pic img{width:100%;height:100%;object-fit:contain;display:block}   /* never cropped */
.chap-credit{position:absolute;left:560px;top:388px;width:328px;font-size:9px;line-height:1.3;
  color:var(--muted);text-decoration:none;letter-spacing:.2px}
a.chap-credit:hover{color:var(--red);text-decoration:underline}

/* --- merksatz ----------------------------------------------------------- */
.slide.merksatz .quote-bar{position:absolute;left:__M__px;top:190px;width:4px;height:150px;
  background:var(--orange)}
.slide.merksatz .satz{position:absolute;left:__MQ__px;top:186px;width:760px;font-size:30px;
  font-weight:700;color:var(--ink);line-height:1.28}
.slide.merksatz .label{position:absolute;left:__MQ__px;top:362px;font-size:12px;font-weight:700;
  color:var(--red);letter-spacing:2.4px;text-transform:uppercase}

/* --- code --------------------------------------------------------------- */
.codepanel{position:absolute;left:__M__px;top:__BY__px;width:__CW__px;height:300px;
  background:var(--codebg);border-left:3px solid var(--green);padding:40px 28px}
.codepanel pre{font-family:Menlo,monospace;font-size:13.5px;line-height:1.3;color:var(--codeink)}
.pic{position:absolute;left:__M__px;top:__BY__px;width:__CW__px;height:__BH__px;
  display:flex;align-items:center;justify-content:center}
/* flex, not grid: in a grid the % heights resolve against an auto track and a tall picture
   runs out of the box; here they resolve against the box - shrink to fit, never upscale */
.pic img{max-width:100%;max-height:100%;object-fit:contain}
.pic.left{justify-content:flex-start}
/* small picture bottom right next to a table (table_top corner=) - text keeps clear of it */
.corner-pic{position:absolute;right:72px;bottom:44px;max-width:200px;max-height:190px}
.slide.has-corner .body{width:580px}

/* --- table_top ---------------------------------------------------------- */
.dtable{position:absolute;border-collapse:collapse;table-layout:fixed;
  font-family:Raleway,system-ui,sans-serif}
.dtable th,.dtable td{padding:0 6px;text-align:left;overflow:hidden;white-space:nowrap;
  border:.75px solid var(--stroke);line-height:1.85}
.dtable th{background:var(--ink);color:#fff;font-family:Orbitron,Raleway,sans-serif;
  font-weight:700;font-size:.75em;border-color:var(--ink)}
.dtable td{background:#fff;color:var(--body)}
.dtable td.b{font-weight:700;color:var(--ink)}
.dtable td.m{font-family:Menlo,monospace}
.dtable .ac{text-align:center}
.dtable .ar{text-align:right}

/* --- greeting (Auftaktfolie) --------------------------------------------- */
.slide.greet{background-image:none;background-color:var(--greetbg)}
.slide.greet::before{left:__GFX__px;width:__GFW__px;background:rgba(230,236,248,.14)}
.slide.greet .foot{left:__GFX__px;color:var(--codemuted)}
.slide.greet .pageno{color:var(--codemuted)}
.greet-ground{position:absolute;inset:0;background:var(--greetbg)}
.greet-pic{position:absolute;left:0;top:0;width:__GIMGW__px;height:__H__px;
  object-fit:cover;display:block}
.greet-credit{position:absolute;left:10px;bottom:8px;font-size:9px;
  font-family:Raleway,sans-serif;color:rgba(255,255,255,.5);text-decoration:none;
  letter-spacing:.2px;text-shadow:0 1px 2px rgba(0,0,0,.6)}
.greet-credit:hover{color:rgba(255,255,255,.9);text-decoration:underline}
.greet-lead{position:absolute;left:__GLX__px;top:168px;width:__GLW__px;
  font-family:Raleway,sans-serif;font-weight:300;font-size:46px;color:var(--orange);
  line-height:1.05;letter-spacing:-.5px}
.greet-quote{position:absolute;left:__GQX__px;top:368px;width:__GQW__px;text-align:center;
  font-family:Raleway,sans-serif;font-weight:300;font-size:17px;color:var(--orange);
  line-height:1.2}
.greet-author{position:absolute;left:__GAX__px;top:404px;width:__GAW__px;text-align:center;
  font-size:11px;color:var(--codemuted);letter-spacing:.3px}

/* --- lab in a slide ------------------------------------------------------ */
.labnote{position:absolute;left:__M__px;width:__CW__px;font-size:15px;color:var(--muted)}
.labframe{position:absolute;left:__M__px;width:__CW__px;overflow:hidden;
  background:var(--card);border:.75px solid rgba(14,36,78,.12)}
.labframe iframe{border:0;transform-origin:0 0;display:block}
.labbar{position:absolute;right:__M__px;top:__LABBAR__px;display:flex;gap:10px;
  align-items:center;font-family:Orbitron,sans-serif;font-size:11px}
.labbar a{color:var(--muted);text-decoration:none;letter-spacing:1px}
.labbar a:hover{color:var(--red)}
.labbar button{font:inherit;color:var(--ink);background:var(--card);cursor:pointer;
  border:.75px solid rgba(14,36,78,.20);border-radius:4px;padding:5px 10px;letter-spacing:1px}
.labbar button:hover{border-color:var(--red);color:var(--red)}

/* --- click build -------------------------------------------------------- */
.step{opacity:0;transition:opacity .4s ease}
.step.on{opacity:1}

/* --- HUD ---------------------------------------------------------------- */
#hud{position:fixed;right:10px;bottom:8px;z-index:9;display:flex;gap:6px}
#hud button{display:flex;align-items:center;justify-content:center;width:22px;height:22px;padding:0;border:0;border-radius:5px;
  background:#7E8FB5;box-shadow:0 1px 1px rgba(0,0,0,.12);   /* Dostojewski's colour on the greeting slide */
  color:#fff;opacity:.85;cursor:pointer;transition:opacity .2s}
#hud button:hover{opacity:1}
#hud button svg{display:block;width:13px;height:13px;margin:0;stroke-width:1.4;flex:none}
#hud button[hidden]{display:none}   /* flex would otherwise show a hidden button */
/* Solita reads the deck (say() + deck_audio.mjs): play button on the title slide, in the middle
   of the orbit ring (Doc, 15.09.2026: "kleiner, alles gruen, weiter nach rechts, 2. Folie") */
.play-big{position:absolute;left:838px;top:244px;width:44px;height:44px;border-radius:50%;
  border:0;background:var(--green);color:#fff;cursor:pointer;z-index:2;
  box-shadow:0 2px 8px rgba(0,0,0,.25);display:grid;place-items:center}
.play-big svg{width:20px;height:20px}
.play-big:hover{filter:brightness(1.08)}
.play-big-label{position:absolute;left:760px;width:200px;top:298px;text-align:center;
  font-family:Orbitron,sans-serif;font-size:10px;letter-spacing:1.5px;color:var(--green);
  text-transform:uppercase}
/* slide number typed for a jump (1 7 Enter) */
#jump{position:fixed;right:10px;bottom:42px;z-index:9;padding:4px 10px;border-radius:7px;
  background:rgba(255,255,255,.85);box-shadow:0 1px 4px rgba(0,0,0,.28);color:#0E244E;
  font:600 14px Raleway,system-ui,sans-serif}
/* overview of all slides (o, grid button in the HUD bottom right) */
#hud{display:flex;gap:4px}          /* overview, play and fullscreen side by side */
#hud #ovbtn svg{width:14px;height:14px}
#overview{position:fixed;inset:0;z-index:20;background:rgba(14,36,78,.94);overflow:auto;padding:28px;
  display:grid;grid-template-columns:repeat(auto-fill,minmax(248px,1fr));gap:18px;align-content:start;
  grid-auto-rows:max-content}   /* the tiles' overflow:hidden would let the rows shrink to the window */
#overview[hidden]{display:none}
.ov-cell{position:relative;cursor:pointer;border-radius:6px;overflow:hidden;
  outline:3px solid transparent;box-shadow:0 2px 10px rgba(0,0,0,.35)}
.ov-cell:hover{outline-color:#799E31}
.ov-cell.cur{outline-color:#F5C242}
.ov-thumb{position:relative;width:100%;aspect-ratio:16/9;overflow:hidden;background:#fff}
.ov-thumb > .slide{display:block!important;position:absolute;left:0;top:0;width:960px;height:540px;
  transform-origin:0 0;pointer-events:none}
.ov-thumb .step{opacity:1!important}
.ov-num{position:absolute;left:8px;bottom:6px;padding:2px 7px;border-radius:5px;
  background:rgba(14,36,78,.78);color:#fff;font:600 12px Raleway,system-ui,sans-serif}
@media print{#ovbtn,#overview,#jump{display:none!important}}
#bar{position:fixed;left:0;bottom:0;height:3px;background:var(--orange);width:0;
  transition:width .25s ease;z-index:9}

@media print{
  html,body{overflow:visible;background:#fff}
  #hud,#bar,.play-big,.play-big-label{display:none}
  #stage{position:static;display:block}
  #deck{transform:none!important;width:auto;height:auto}
  .slide{display:block!important;position:relative;width:__W__px;height:__H__px;
    page-break-after:always;break-after:page}
  .step{opacity:1!important}
}
"""

JS = """
// time-aware greeting - the browser knows the real clock, a .pptx never does
(function(){
  var h = new Date().getHours();
  var t = h < 5 ? 'Good night!' : h < 12 ? 'Good morning!' :
          h < 18 ? 'Good afternoon!' : h < 22 ? 'Good evening!' : 'Good night!';
  var el = document.getElementById('greet-text');
  if (el) el.textContent = t;
})();

const deck = document.getElementById('deck');
const slides = [...document.querySelectorAll('.slide')];
let si = 0, step = 0;
slides.forEach((s, i) => {
  const p = s.querySelector('.pageno');
  if (p) p.textContent = (i + 1) + ' / ' + slides.length;
});

// keep the 960x540 stage as large as the window allows - phone, beamer, print
function fit(){
  const s = Math.min(innerWidth / __W__, innerHeight / __H__);
  deck.style.transform = 'scale(' + s + ')';
}
addEventListener('resize', fit); fit();

function groups(sl){
  return [...new Set([...sl.querySelectorAll('.step')].map(e => +e.dataset.g))].length;
}
function paint(){
  slides.forEach((s, i) => s.classList.toggle('on', i === si));
  const sl = slides[si];
  sl.querySelectorAll('.step').forEach(e => e.classList.toggle('on', +e.dataset.g < step));
  document.getElementById('bar').style.width = ((si + 1) / slides.length * 100) + '%';
}
function next(){
  if (step < groups(slides[si])) { step++; }
  else if (si < slides.length - 1) { si++; step = 0; }
  paint();
}
function prev(){
  if (step > 0) { step--; }
  else if (si > 0) { si--; step = groups(slides[si]); }
  paint();
}
addEventListener('keydown', e => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;     // never eat Cmd-Shift-R
  const k = e.key;
  if (/^(Arrow|Page|Home|End| )/.test(k)) narr.stop();   // turning pages by hand pauses Solita
  if (k === 'ArrowRight' || k === 'ArrowDown' || k === ' ' || k === 'PageDown') { next(); e.preventDefault(); }
  else if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'PageUp') { prev(); e.preventDefault(); }
  else if (k === 'Home') { si = 0; step = 0; paint(); }
  else if (k === 'End') { si = slides.length - 1; step = groups(slides[si]); paint(); }
  else if (k === 'f' || k === 'F') { full(); }
});
addEventListener('click', e => {
  // links (lab bar, picture credits) open - they do not turn the page as well
  if (e.target.closest('#hud') || e.target.closest('a') || e.target.closest('.play-big')) return;
  narr.stop();                                       // a click turns the page by hand
  if (e.target.closest('.labbar button')) { next(); return; }
  next();
});   // clicks inside a lab stay in the lab - they never reach this document
// type the slide number, then Enter: 1 7 Enter jumps to slide 17 (Doc, 15.09.2026) - like
// PowerPoint the slide starts unbuilt; Esc or a 2.5 s pause drops the typed number
(function () {
  let buf = '', timer = 0;
  const box = document.createElement('div');
  box.id = 'jump';
  box.hidden = true;
  document.body.appendChild(box);
  const clear = function () { buf = ''; box.hidden = true; };
  addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (/^[0-9]$/.test(e.key)) {
      buf = (buf + e.key).replace(/^0+/, '').slice(-3);
      box.textContent = 'Folie ' + (buf || '0');
      box.hidden = false;
      clearTimeout(timer); timer = setTimeout(clear, 2500);
      e.preventDefault();
    } else if (e.key === 'Enter' && buf) {
      const n = parseInt(buf, 10);
      clear();
      if (n >= 1 && n <= slides.length) {
        if (typeof narr !== 'undefined') narr.stop();   // a jump pauses Solita like turning by hand
        si = n - 1; step = 0; paint();
      }
      e.preventDefault();
    } else if (e.key === 'Escape' && buf) { clear(); }
  });
})();
// overview of all slides: o (or the grid button bottom right) opens it, a click jumps there,
// Esc, o or a click beside the tiles closes it (Doc, 15.09.2026: "Uebersicht ueber alle Folien")
(function () {
  const ov = document.createElement('div');
  ov.id = 'overview';
  ov.hidden = true;
  document.body.appendChild(ov);
  const btn = document.createElement('button');
  btn.id = 'ovbtn';
  btn.type = 'button';
  btn.title = 'Übersicht aller Folien (o)';
  btn.setAttribute('aria-label', 'Übersicht aller Folien');
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">'
    + '<rect x="2.5" y="2.5" width="8.5" height="8.5" rx="1.2"/><rect x="13" y="2.5" width="8.5" height="8.5" rx="1.2"/>'
    + '<rect x="2.5" y="13" width="8.5" height="8.5" rx="1.2"/><rect x="13" y="13" width="8.5" height="8.5" rx="1.2"/></svg>';
  const hudBox = document.getElementById('hud');   // bottom right, next to play and fullscreen
  if (hudBox) hudBox.insertBefore(btn, hudBox.firstChild); else document.body.appendChild(btn);
  let built = false;
  function close() { ov.hidden = true; }
  function build() {
    slides.forEach(function (s, i) {
      const cell = document.createElement('div');
      cell.className = 'ov-cell';
      const thumb = document.createElement('div');
      thumb.className = 'ov-thumb';
      const c = s.cloneNode(true);                     // a copy, fully built, without ids
      c.querySelectorAll('[id]').forEach(function (e) { e.removeAttribute('id'); });
      c.classList.add('on');
      thumb.appendChild(c);
      const num = document.createElement('span');
      num.className = 'ov-num';
      num.textContent = i + 1;
      cell.appendChild(thumb);
      cell.appendChild(num);
      cell.addEventListener('click', function (e) {
        e.stopPropagation();
        if (typeof narr !== 'undefined') narr.stop();
        si = i; step = 0; paint(); close();
      });
      ov.appendChild(cell);
    });
    built = true;
  }
  function scale() {
    ov.querySelectorAll('.ov-thumb').forEach(function (t) {
      t.firstChild.style.transform = 'scale(' + (t.clientWidth / 960) + ')';
    });
  }
  function open() {
    if (typeof narr !== 'undefined') narr.stop();
    if (!built) build();
    ov.hidden = false;
    [].forEach.call(ov.children, function (c, i) { c.classList.toggle('cur', i === si); });
    scale();
    if (ov.children[si]) ov.children[si].scrollIntoView({ block: 'center' });
  }
  btn.addEventListener('click', function (e) { e.stopPropagation(); if (ov.hidden) open(); else close(); });
  ov.addEventListener('click', function (e) { e.stopPropagation(); close(); });
  addEventListener('resize', function () { if (!ov.hidden) scale(); });
  addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === 'o' || e.key === 'O') {
      if (ov.hidden) open(); else close();
      e.preventDefault(); e.stopImmediatePropagation(); return;
    }
    if (!ov.hidden) {                                  // nothing underneath moves meanwhile
      if (e.key === 'Escape') close();
      e.preventDefault(); e.stopImmediatePropagation();
    }
  }, true);
})();
// fullscreen toggle - the same corner-bracket icon as the SVP pill, in and out
const ICON_ENTER = '<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M16 3h3a2 2 0 0 1 2 2v3"/>'
  + '<path d="M8 21H5a2 2 0 0 1-2-2v-3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>';
const ICON_EXIT = '<path d="M3 8h3a2 2 0 0 0 2-2V3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/>'
  + '<path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/>';
const fullBtn = document.getElementById('full');
const fsOn = () => !!(document.fullscreenElement || document.webkitFullscreenElement);
function paintFull(){
  fullBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" '
    + 'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    + (fsOn() ? ICON_EXIT : ICON_ENTER) + '</svg>';
  fullBtn.title = fsOn() ? 'Vollbild verlassen (Esc)' : 'Vollbild (f)';
}
function full(){
  const el = document.documentElement;
  if (fsOn()) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
  else {
    const req = el.requestFullscreen || el.webkitRequestFullscreen;
    if (req) Promise.resolve(req.call(el)).catch(() => {});
  }
}
fullBtn.onclick = full;
document.addEventListener('fullscreenchange', paintFull);
document.addEventListener('webkitfullscreenchange', paintFull);
if (document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen) paintFull();
else fullBtn.hidden = true;   // no fullscreen API (iPhone Safari) - nothing to press

// #7 in the URL opens slide 7 fully built - handy for linking a single slide
function fromHash(){
  const n = parseInt(location.hash.slice(1), 10);
  if (n >= 1 && n <= slides.length) { si = n - 1; step = groups(slides[si]); paint(); }
}
addEventListener('hashchange', fromHash);

// formulas: KaTeX renders every $...$ the build script wrote
addEventListener('load', () => {
  if (!window.katex) return;
  document.querySelectorAll('.tex').forEach(el => {
    try { katex.render(el.dataset.tex, el, { throwOnError: false, displayMode: false }); }
    catch (err) { el.textContent = el.dataset.tex; }
  });
});
// Solita reads the deck (Doc, 15.09.2026: "NIEMALS Browserstimme! So wie beim DocPad!") - the
// clips come from tools/pptx/deck_audio.mjs with her DocPad voice, nothing is synthesised here.
// Part 0 of a slide is spoken when it appears, part k while click group k comes in, then on.
const narr = (function () {
  const api = { playing: false, stop: function () {} };
  let data = null;
  try { data = JSON.parse(document.getElementById('narration').textContent || 'null'); } catch (e) { }
  if (!data || !data.slides) return api;
  const btn = document.getElementById('play');
  const PLAY = '<path d="M6.5 5v14l11-7z" fill="currentColor"/>';
  const PAUSE = '<path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor"/>';
  const pad = n => String(n).padStart(2, '0');
  const parts = s => (data.slides[s] || []).length;
  let audio = null, aSlide = -1, part = 0;
  const holds = data.hold || [];
  let held = -1;                                      // slide where Solita waits for a click
  const big = document.createElement('button');
  big.type = 'button';
  big.className = 'play-big';
  const label = document.createElement('div');
  label.className = 'play-big-label';
  label.textContent = 'Solita erklärt';
  const home = document.querySelector('.slide.title') || slides[0];   // title slide, in the orbit ring
  home.appendChild(big);
  home.appendChild(label);
  btn.hidden = false;
  function show() {
    const icon = '<svg viewBox="0 0 24 24" aria-hidden="true">' + (api.playing ? PAUSE : PLAY) + '</svg>';
    const t = api.playing ? 'Pause (p)' : held >= 0 ? 'Weiter mit Klick (p)' : 'Solita erklärt (p)';
    [btn, big].forEach(b => { b.innerHTML = icon; b.title = t; b.setAttribute('aria-label', t); });
  }
  function run() {
    if (!api.playing) return;
    if (part >= parts(si)) {                          // slide done: everything in, then on
      step = groups(slides[si]); paint();
      if (si >= slides.length - 1) { api.playing = false; audio = null; show(); return; }
      // say(hold=True): e.g. before a solution - the next slide comes only on a click
      if (holds.indexOf(si) >= 0) { api.playing = false; audio = null; held = si; show(); return; }
      setTimeout(function () { if (!api.playing) return; si++; step = 0; part = 0; paint(); run(); }, 700);
      return;
    }
    if (part > 0) { step = Math.min(part, groups(slides[si])); paint(); }
    aSlide = si;
    audio = new Audio('audio/' + data.deck + '/s' + pad(si) + '-' + pad(part) + '.mp3');
    audio.onended = function () { part++; run(); };
    audio.onerror = function () { part++; run(); };   // a missing clip must not hang the talk
    audio.play().catch(function () { api.playing = false; show(); });
  }
  function resume(n) {                                // go on talking from the top of slide n
    held = -1; api.playing = true; si = n; step = 0; part = 0; audio = null; show(); paint(); run();
  }
  function toggle() {
    if (!api.playing && held >= 0 && si === held && si < slides.length - 1) { resume(si + 1); return; }
    held = -1;
    if (api.playing) { api.playing = false; if (audio) audio.pause(); show(); return; }
    api.playing = true; show();
    if (audio && aSlide === si && audio.paused && !audio.ended && audio.currentTime > 0) { audio.play(); return; }
    part = step; audio = null; run();                 // start where the page stands
  }
  api.stop = function () {
    if (held >= 0) {
      // waiting at a hold: the click that turns to the next slide lets Solita go on there
      // (stop runs before the page handler's next(), so look once that has happened)
      const h = held; held = -1; show();
      setTimeout(function () { if (!api.playing && si === h + 1) resume(si); }, 0);
      return;
    }
    if (!api.playing) return;
    api.playing = false; if (audio) audio.pause(); audio = null; show();
  };
  // stop the click here: toggle redraws the icon, and the page's click handler would then no
  // longer see the (detached) target inside #hud - it turned the page and paused Solita again
  btn.onclick = function (e) { e.stopPropagation(); toggle(); };
  big.onclick = function (e) { e.stopPropagation(); toggle(); };
  addEventListener('keydown', function (e) {
    if ((e.key === 'p' || e.key === 'P') && !e.metaKey && !e.ctrlKey && !e.altKey) toggle();
  });
  show();
  return api;
})();

paint();
fromHash();
"""

PAGE = """<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>__TITLE__</title>
<meta name="description" content="__SUB__">
<link rel="icon" type="image/svg+xml" href="../resources/favicon.svg">
<link rel="icon" type="image/png" sizes="256x256" href="../resources/favicon.png">
<link rel="stylesheet" href="__KATEX__/katex.min.css">
<script defer src="__KATEX__/katex.min.js"></script>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Raleway:wght@300;400;600&display=swap" rel="stylesheet">
<style>__CSS__</style>
</head>
<body>
<div id="stage"><div id="deck">
__SLIDES__
</div></div>
<div id="bar"></div>
<div id="hud"><button id="play" title="Solita erklärt" aria-label="Solita erklärt" hidden></button><button id="full" title="Vollbild (f)" aria-label="Vollbild"></button></div>
<script id="narration" type="application/json">__NARR__</script>
<script>__JS__</script>
</body>
</html>
"""

# geometry and palette are substituted once, from design_lib - single source
for _k, _v in {"__INK__": INK, "__BODY__": BODY, "__MUTED__": MUTED, "__STROKE__": STROKE,
               "__CARD__": CARD, "__ORANGE__": ORANGE, "__RED__": RED, "__GREEN__": GREEN,
               "__CODEBG__": CODE_BG, "__CODEINK__": CODE_INK,
               "__W__": W, "__H__": H, "__M__": MARGIN, "__CW__": CONTENT_W,
               "__TY__": TITLE_Y, "__RY__": RULE_Y, "__BY__": BODY_Y, "__BH__": BODY_H,
               "__FOOT__": FOOT_Y, "__FOOTT__": FOOT_Y + 8,
               "__MC__": MARGIN + 28, "__MQ__": MARGIN + 32,
               "__LABBAR__": TITLE_Y + 4, "__CODEMUTED__": CODE_MUTED, "__GREETBG__": GREET_BG,
               "__GIMGW__": GREET_IMG_W, "__GFX__": GREET_X, "__GFW__": GREET_W,
               "__GLX__": GREET_X + 97, "__GLW__": GREET_W - 97,
               "__GQX__": GREET_X + 150, "__GQW__": GREET_W - 150,
               "__GAX__": GREET_X + 260, "__GAW__": GREET_W - 260}.items():
    _s = ("%g" % _v) if isinstance(_v, float) else str(_v)
    CSS = CSS.replace(_k, _s)
    JS = JS.replace(_k, _s)


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
    if args[:1] == ["--prefix"] and len(args) >= 3:
        PREFIX, args = args[1], args[2:]
    if len(args) < 1:
        sys.exit(__doc__)
    build(args[0])

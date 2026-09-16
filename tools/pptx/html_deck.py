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
        summ = json.dumps({str(k): v for k, v in sorted(self.summaries.items())},
                          ensure_ascii=False).replace("</", "<\\/")
        return (PAGE.replace("__TITLE__", _html.escape(self.doc_title, quote=False))
                    .replace("__SUB__", _html.escape(self.subtitle, quote=False))
                    .replace("__KATEX__", KATEX)
                    .replace("__CSS__", CSS)
                    .replace("__SLIDES__", "\n".join(self.slides))
                    .replace("__NARR__", narr)
                    .replace("__SUMMARY__", summ)
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
/* centred by offsets, not by a grid: on a phone the grid track grows to the unscaled
   deck size and pushes the scaled deck off-centre, half out of the screen */
#stage{position:fixed;inset:0;overflow:hidden}
#deck{width:__W__px;height:__H__px;position:absolute;left:calc(50% - __W__px / 2);top:calc(50% - __H__px / 2);
  transform-origin:center center}
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
#hud{position:fixed;right:calc(10px + env(safe-area-inset-right, 0px));bottom:8px;z-index:9;display:flex;gap:6px}
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
#jump{position:fixed;right:calc(10px + env(safe-area-inset-right, 0px));bottom:42px;z-index:9;padding:4px 10px;border-radius:7px;
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
/* --- ask Solita (avatar bottom right, Claude Haiku + her DocPad voice) ---- */
#ask{position:fixed;right:calc(10px + env(safe-area-inset-right, 0px));bottom:38px;z-index:11;
  font-family:Raleway,system-ui,sans-serif;--askbg:#EAF0FA}
/* the photo stands free - no ring, no white edge (Doc, 16.09.2026: "sieht frei besser aus") */
#ask-btn{display:block;width:46px;height:46px;padding:0;border:0;border-radius:50%;cursor:pointer;
  background:transparent;box-shadow:0 2px 8px rgba(0,0,0,.3);
  overflow:hidden;opacity:.92;transition:opacity .2s,transform .2s}
#ask-btn:hover{opacity:1;transform:scale(1.06)}
#ask-btn img{width:100%;height:100%;object-fit:cover;display:block}
#ask-panel{position:absolute;right:0;bottom:56px;width:min(360px,calc(100vw - 24px));
  background:var(--askbg);border-radius:10px;box-shadow:0 6px 24px rgba(14,36,78,.4);
  padding:12px 12px 10px;color:var(--ink)}
#ask-panel[hidden]{display:none}
/* a light blue tint (Doc, 16.09.2026: "leicht bläulich"); the field and the round buttons stay white */
/* the header sits on its own strip with a soft shadow, so answers scroll away UNDER it
   (Doc, 16.09.2026: "setz den Header besser ab") - z-index lifts the shadow above the text */
#ask-head{font-family:Orbitron,sans-serif;font-size:10px;letter-spacing:1.6px;text-transform:uppercase;
  color:#7E8FB5;display:flex;justify-content:space-between;align-items:center;
  position:relative;z-index:1;margin:-12px -12px 0;padding:11px 12px 9px;background:var(--askbg);
  border-radius:10px 10px 0 0;box-shadow:0 4px 8px -4px rgba(14,36,78,.35)}
#ask-close{border:0;background:none;color:#7E8FB5;font-size:16px;line-height:1;cursor:pointer;padding:0 2px}
#ask-close:hover{color:var(--red)}
#ask-out{font-size:14px;line-height:1.45;color:var(--body);max-height:230px;overflow:auto;
  margin-bottom:9px;padding-top:9px;white-space:pre-wrap}
#ask-out:empty{display:none}
#ask-out:empty + label{margin-top:10px}
#ask-out .ask-q{color:var(--ink);font-weight:600}
#ask-out .ask-err{color:var(--red)}
/* karaoke: the word Solita is saying right now */
#ask-out .ask-w{border-radius:3px;transition:background-color .12s,box-shadow .12s}
#ask-out .ask-w.on{background:color-mix(in srgb,var(--orange) 55%,transparent);
  box-shadow:0 0 0 2px color-mix(in srgb,var(--orange) 55%,transparent)}
/* Solita is thinking: a travelling wave of bars, until her voice is ready to play */
#ask-out .ask-wave{display:flex;align-items:center;gap:3px;height:22px;padding:2px 0}
#ask-out .ask-wave i{display:block;width:3px;height:100%;border-radius:2px;background:var(--ink);
  transform:scaleY(.2);animation:askwave 1.1s ease-in-out infinite}
#ask-out .ask-wave i:nth-child(2){animation-delay:.1s}
#ask-out .ask-wave i:nth-child(3){animation-delay:.2s}
#ask-out .ask-wave i:nth-child(4){animation-delay:.3s}
#ask-out .ask-wave i:nth-child(5){animation-delay:.4s}
#ask-out .ask-wave i:nth-child(6){animation-delay:.5s}
#ask-out .ask-wave i:nth-child(7){animation-delay:.6s}
@keyframes askwave{0%,100%{transform:scaleY(.2)}50%{transform:scaleY(1)}}
@media (prefers-reduced-motion:reduce){#ask-out .ask-wave i{animation-duration:2.4s}}
#ask-out::-webkit-scrollbar{width:8px}
#ask-out::-webkit-scrollbar-thumb{background:#b8c6df;border-radius:4px}
#ask-out{scrollbar-width:thin;scrollbar-color:#b8c6df transparent}
#ask label{display:block;font-family:Orbitron,sans-serif;font-size:9px;letter-spacing:1.3px;
  text-transform:uppercase;color:var(--muted);margin-bottom:4px}
#ask-row{display:flex;gap:6px}
#ask-cost{margin-left:9px;font-weight:400;color:var(--muted);cursor:pointer}
#ask-mic,#ask-tts{flex:none;width:34px;display:grid;place-items:center;cursor:pointer;color:var(--ink);
  background:#fff;border:1px solid var(--stroke);border-radius:7px}
#ask-mic svg,#ask-tts svg{width:16px;height:16px}
#ask-mic.on{background:var(--red);border-color:var(--red);color:#fff}   /* listening */
#ask-tts.off{color:var(--muted);border-color:var(--stroke);opacity:.75}   /* no reading aloud, no voice cost */
#ask-mic[hidden],#ask-tts[hidden]{display:none}
#ask input{flex:1;min-width:0;padding:7px 9px;border:1px solid var(--stroke);border-radius:7px;
  font:400 14px Raleway,system-ui,sans-serif;color:var(--ink);background:#fff}
#ask input:focus{outline:2px solid var(--ink);outline-offset:-1px;border-color:transparent}
#ask-send{border:0;border-radius:7px;padding:0 13px;cursor:pointer;background:var(--green);color:#fff;
  font-family:Orbitron,sans-serif;font-size:11px;letter-spacing:1px}
#ask-send:hover{filter:brightness(1.08)}
#ask-send:disabled{opacity:.5;cursor:default}
@media print{#ask{display:none!important}}
@media print{#ovbtn,#overview,#jump{display:none!important}}
#bar{position:fixed;left:0;bottom:0;height:3px;background:var(--orange);width:0;
  transition:width .25s ease;z-index:9}

@media print{
  html,body{overflow:visible;background:#fff}
  #hud,#bar,.play-big,.play-big-label{display:none}
  #stage{position:static;display:block}
  #deck{transform:none!important;width:auto;height:auto;position:static}
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
    // this one listens in the capture phase, so a question typed to Solita would reach it first:
    // 'o' would open the overview mid-sentence. Nothing from inside #ask belongs to the deck.
    if (e.target && e.target.closest && e.target.closest('#ask')) return;
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
  let wait = 0;                                       // pending pause after a clip or before the next slide
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
      // Doc 16.09.2026 "zu schnell, ein wenig mehr Pausen": the finished slide stands a moment longer
      wait = setTimeout(function () { if (!api.playing) return; si++; step = 0; part = 0; paint(); run(); }, 1600);
      return;
    }
    if (part > 0) { step = Math.min(part, groups(slides[si])); paint(); }
    aSlide = si;
    audio = new Audio('audio/' + data.deck + '/s' + pad(si) + '-' + pad(part) + '.mp3');
    audio.onended = function () { part++; wait = setTimeout(run, part < parts(si) ? 900 : 0); };
    audio.onerror = function () { part++; run(); };   // a missing clip must not hang the talk
    audio.play().catch(function () { api.playing = false; show(); });
  }
  function resume(n) {                                // go on talking from the top of slide n
    clearTimeout(wait);
    held = -1; api.playing = true; si = n; step = 0; part = 0; audio = null; show(); paint(); run();
  }
  function toggle() {
    clearTimeout(wait);
    if (!api.playing && held >= 0 && si === held && si < slides.length - 1) { resume(si + 1); return; }
    held = -1;
    if (api.playing) { api.playing = false; if (audio) audio.pause(); show(); return; }
    api.playing = true; show();
    if (audio && aSlide === si && audio.paused && !audio.ended && audio.currentTime > 0) { audio.play(); return; }
    part = step; audio = null; run();                 // start where the page stands
  }
  api.stop = function () {
    clearTimeout(wait);
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

# Ask Solita (avatar bottom right). Own raw string: the JS carries regex and \n escapes that a
# plain triple-quoted string would eat - that broke the generated deck once (16.09.2026).
ASK_JS = r"""
// Ask Solita about the slide on screen: Claude Haiku answers from the deck's own text, her DocPad
// voice reads it out (Doc, 16.09.2026: "bau mal mit Haiku (solita nur voice)"). The API keys live in
// the Supabase edge functions, never here (Rule 21) - the shared password gates the proxy and is
// remembered per device in localStorage 'dev_access', the same key solita.html uses.
(function () {
  const box = document.getElementById('ask');
  if (!box) return;
  const AI_URL = 'https://fyfhxzyymmurlaenmzse.supabase.co/functions/v1/claude';
  const TTS_URL = 'https://fyfhxzyymmurlaenmzse.supabase.co/functions/v1/tts';
  const MODEL = 'claude-haiku-4-5';        // ~0.3 ct per question; the voice costs far more than the answer
  const VOICE = 'de-DE-Studio-C';          // Solita's DocPad voice - NEVER the browser voice (Doc)
  const SYS = 'Du bist Solita, die Tutorin in Doc Alvers Mathe-Labor. Du hilfst Schülerinnen und '
    + 'Schülern der Klassen 11 bis 13 am Beruflichen Gymnasium und an der Fachoberschule. '
    + 'Du bekommst eine Übersicht der Präsentation und die Folie, auf der die Klasse gerade steht. '
    + 'Antworte auf Deutsch, kurz und klar: höchstens vier Sätze, gesprochene Sprache - die Antwort wird '
    + 'vorgelesen. Formeln in LaTeX zwischen Dollarzeichen. Stütze dich zuerst auf die Folien. '
    + 'Hintergrundwissen zum Thema - Personen, Geschichte, Anwendungen, verwandte Begriffe - darfst du '
    + 'ergänzen, wenn du dir sicher bist; sonst sag kurz, dass du es nicht genau weißt. Kurze Nachfragen '
    + 'wie "und woher kam der?" beziehen sich auf das bisherige Gespräch. Sprich nie über deinen Kontext, '
    + 'die Präsentation als Quelle oder darüber, ob eine Frage zum Thema passt - antworte einfach. Nur wenn '
    + 'eine Frage gar nichts mit dem Unterricht zu tun hat, lenk in einem Satz freundlich zur Folie zurück. '
    + 'Keine Emojis, keine Aufzählungen.';
  // Doc, 16.09.2026: "war der Engländer?" after a question about Efron came back as "passt nicht zum
  // Thema, ich kenne keinen Kontext". Two causes: every question went out alone, without the talk
  // before it, and the prompt forbade anything not on the slides. Now the last HIST_MAX exchanges
  // travel along (plain text, no slide context - that only rides with the new question).
  const HIST_MAX = 4;
  const hist = [];

  // What a question REALLY costs (worked out 16.09.2026, after Doc asked why nothing ever turns up on
  // the Google bill): Claude is billed from the first token - no free tier - while Google grants a free
  // quota of characters per voice type per CALENDAR MONTH, and a lesson never gets near it. The counter
  // therefore keeps two different things apart: euros for Claude, characters for the voice, and it turns
  // characters into euros only for what runs OVER the monthly quota.
  // ttsFree/ttsUsd are list values: Google's pricing table is built by JS and cannot be read from here.
  // Third-party sources say 30 $ per 1M, the older note in supabase/functions/tts says 160 $ - the higher
  // one is used on purpose, so the counter warns early rather than late. The truth is in Cloud Billing
  // (console.cloud.google.com/billing/reports, Service = Cloud Text-to-Speech API). Doc's account carries
  // a 10 EUR/month budget alert - a mail, not a tap that closes.
  const RATE = { in: 1, out: 5, cacheRead: 0.1, cacheWrite: 1.25, eur: 0.92,
                 ttsUsd: 160, ttsFree: 1e6 };

  const panel = document.getElementById('ask-panel');
  const out = document.getElementById('ask-out');
  const input = document.getElementById('ask-in');
  const send = document.getElementById('ask-send');
  const label = box.querySelector('label');
  const micBtn = document.getElementById('ask-mic');
  const ttsBtn = document.getElementById('ask-tts');
  const costEl = document.getElementById('ask-cost');
  let audio = null, busy = false, ear = null;

  // What THIS question cost - not a running total (Doc, 16.09.2026: the sum belongs in the 08:00
  // mail, where it covers every device). Claude is real money from the first token; the voice is
  // characters against Google's monthly free quota, so it shows as characters, with the list price
  // it WOULD cost only in the tooltip.
  let last = null;
  function money(eur) {
    if (eur >= 1) return eur.toFixed(2).replace('.', ',') + ' \u20ac';
    const ct = eur * 100;
    return (ct < 1 ? ct.toFixed(2) : ct.toFixed(1)).replace('.', ',') + ' ct';
  }
  function showCost() {
    if (!last) { costEl.textContent = ''; costEl.title = 'Kosten der letzten Frage'; return; }
    costEl.textContent = money(last.claude);         // voice characters only in the tooltip (Doc, 16.09.2026)
    costEl.title = 'Diese Frage\n'
      + 'Claude (Haiku): ' + money(last.claude) + ' - ' + last.tin + ' Token rein, '
      + last.tout + ' raus, wird ab dem ersten Token berechnet\n'
      + (last.chars
          ? 'Stimme: ' + last.chars + ' Zeichen - frei im Monatskontingent, zum Listenpreis waere es '
            + money(last.chars / 1e6 * RATE.ttsUsd * RATE.eur)
          : 'Stimme: aus')
      + '\nWartezeit: Claude ' + secs(last.msAi) + (last.msVoice ? ' + Stimme ' + secs(last.msVoice) : '');
  }
  function secs(ms) { return ms ? (ms / 1000).toFixed(1).replace('.', ',') + ' s' : '-'; }
  function addClaude(usage, ms) {
    const u = usage || {};
    last = {
      claude: ((u.input_tokens || 0) * RATE.in
             + (u.cache_read_input_tokens || 0) * RATE.in * RATE.cacheRead
             + (u.cache_creation_input_tokens || 0) * RATE.in * RATE.cacheWrite
             + (u.output_tokens || 0) * RATE.out) / 1e6 * RATE.eur,
      tin: (u.input_tokens || 0) + (u.cache_read_input_tokens || 0),
      tout: u.output_tokens || 0,
      chars: 0,
      msAi: ms, msVoice: 0,
    };
    showCost();
  }
  function addVoice(chars, ms) { if (last) { last.chars = chars; last.msVoice = ms; showCost(); } }
  // Reading aloud on/off. Same localStorage key as solita.html, so switching her quiet holds here
  // too - and with it off, no TTS request goes out at all (the voice is 97 % of what a question costs).
  const TTS_KEY = 'solita_tts';
  let ttsOn = true;
  try { ttsOn = localStorage.getItem(TTS_KEY) !== '0'; } catch (e) { }
  const SPK_ON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" '
    + 'stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4z"/>'
    + '<path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>';
  const SPK_OFF = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" '
    + 'stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4z"/>'
    + '<path d="m16 9 5 6"/><path d="m21 9-5 6"/></svg>';
  function showTts() {
    ttsBtn.innerHTML = ttsOn ? SPK_ON : SPK_OFF;
    ttsBtn.classList.toggle('off', !ttsOn);
    const t = ttsOn ? 'Solita liest vor' : 'Solita liest NICHT vor (keine Stimm-Kosten)';
    ttsBtn.title = t; ttsBtn.setAttribute('aria-label', t);
  }
  ttsBtn.onclick = function () {
    ttsOn = !ttsOn;
    try { localStorage.setItem(TTS_KEY, ttsOn ? '1' : '0'); } catch (e) { }
    if (!ttsOn) stopAudio();
    showTts();
  };
  showTts();

  costEl.onclick = function () { last = null; showCost(); };
  showCost();

  // Keys and clicks inside the panel stay there: typing a question must not turn pages, open the
  // overview ('o') or pause Solita ('p'). Measured 16.09.2026: a capture listener on window is the
  // wrong tool - it kills the event before the button's own handler sees it, yet window's own bubble
  // listeners (page keys, slide jump, overview) still fire. Stopping on the way up from #ask does
  // both right: handlers inside #ask run, nothing reaches the deck.
  box.addEventListener('keydown', function (e) { e.stopPropagation(); });
  box.addEventListener('click', function (e) { e.stopPropagation(); });

  function pwd() { try { return localStorage.getItem('dev_access') || ''; } catch (e) { return ''; } }
  // Every call goes out as a CORS "simple request": no custom headers, the body is plain text (both
  // functions read it with req.json() anyway) and the password rides in the body, which the claude
  // function accepts as well as x-app-pass. Custom headers (apikey, Authorization, x-app-pass) made
  // the browser send an OPTIONS preflight before EVERY call - measured in the Supabase logs on
  // 16.09.2026, those preflights took 4.6-13.3 s from Doc's Chrome, 62 % of the whole wait. The
  // gateway does not need the anon key: both functions run with --no-verify-jwt, and the tts guard
  // accepts the browser's Origin header instead.
  function post(url, body, signal) {
    return fetch(url, { method: 'POST', body: JSON.stringify(body), signal: signal });
  }
  // Wake both functions while the question is still being typed, at no cost: an empty tts call is
  // refused before Google is asked, a ping only checks the password. At most once a minute.
  let warmAt = 0;
  function warm() {
    if (Date.now() - warmAt < 60000) return;
    warmAt = Date.now();
    post(TTS_URL, {}).catch(function () { });
    if (pwd()) post(AI_URL, { ping: true, pass: pwd() }).catch(function () { });
  }
  function askPassword() {          // no password yet: the same field asks for it once, then remembers
    label.textContent = 'Passwort — wird auf diesem Gerät gemerkt';
    input.type = 'password'; input.value = ''; input.placeholder = '';
    input.setAttribute('autocomplete', 'current-password');
    send.textContent = 'OK';
    micBtn.hidden = true; ttsBtn.hidden = true;
  }
  function askQuestion() {
    label.textContent = 'Deine Frage zur Folie';
    input.type = 'text'; input.value = ''; input.placeholder = 'Warum zwei Drittel?';
    input.setAttribute('autocomplete', 'off');
    send.textContent = 'Los';
    micBtn.hidden = !(window.SpeechRecognition || window.webkitSpeechRecognition);
    ttsBtn.hidden = false;
  }
  function say(html, cls) {
    const p = document.createElement('div');
    if (cls) p.className = cls;
    p.innerHTML = html;
    out.appendChild(p); out.scrollTop = out.scrollHeight;
    return p;
  }

  // the deck is its own source: slide text with the TeX put back in - minus the footer and page
  // number, which every slide repeats (13 % of the old context was "Nicht verzagen, ..." 24 times)
  function slideText(s) {
    const c = s.cloneNode(true);
    c.querySelectorAll('.foot, .pageno').forEach(function (e) { e.remove(); });
    c.querySelectorAll('[data-tex]').forEach(function (e) { e.textContent = '$' + e.dataset.tex + '$'; });
    return (c.textContent || '').replace(/\s+/g, ' ').trim();
  }
  let SUMMARY = {}, NARR = null;
  try { SUMMARY = JSON.parse(document.getElementById('summary').textContent || '{}') || {}; } catch (e) { }
  try { NARR = JSON.parse(document.getElementById('narration').textContent || 'null'); } catch (e) { }
  function overviewLine(i) {                        // a deck built without summaries still gets a line
    if (SUMMARY[String(i)]) return SUMMARY[String(i)];
    const h = slides[i].querySelector('h1, h2, h3');
    return h ? h.textContent.replace(/\s+/g, ' ').trim() : slideText(slides[i]).slice(0, 90);
  }

  // Compact context (Doc, 16.09.2026): one summary line per slide, the slide on screen in full, and
  // any slide the question names ("Folie 15", "F15", "Seite 15") in full too. Measured before: the
  // whole deck in full was ~3,500 tokens a question.
  // Slides behind a hold - a solution - stay OUT until the class has reached them, and Claude is told
  // not to work the task out: otherwise it hands over the answer while the class is still on it.
  function context(q) {
    const ahead = ((NARR && NARR.hold) || []).filter(function (h) { return h >= si; });
    const last = ahead.length ? Math.min.apply(null, ahead) : slides.length - 1;
    const lines = ['Deck: ' + document.title, 'Übersicht, eine Zeile je Folie:'];
    for (let i = 0; i <= last; i++) lines.push('F' + (i + 1) + ': ' + overviewLine(i));
    const full = [si];
    String(q).replace(/\b(?:folie|seite|slide|f)\s*(\d{1,3})\b/gi, function (m, n) {
      const i = +n - 1;
      if (i >= 0 && i <= last && full.indexOf(i) < 0) full.push(i);
      return m;
    });
    full.forEach(function (i) {
      lines.push('', (i === si ? 'Die Klasse steht auf Folie ' + (i + 1)
                               : 'Folie ' + (i + 1) + ', nach der gefragt wird') + ' - voller Inhalt:');
      lines.push(slideText(slides[i]));
      const spoken = NARR && NARR.slides && NARR.slides[String(i)];
      if (spoken && spoken.length) lines.push('Solita erklärt dazu: ' + spoken.join(' '));
    });
    if (ahead.length) {
      lines.push('', 'Wichtig: Die Lösung zu Folie ' + (last + 1) + ' hat die Klasse noch nicht gesehen. '
        + 'Rechne diese Aufgabe nicht vor und nenne kein Ergebnis - gib höchstens einen Tipp.');
    }
    return lines.join('\n');
  }
  window.askSolitaContext = context;   // debug: askSolitaContext('F15?') shows exactly what goes out

  function render(el, text) {       // formulas the model wrote in $...$ come out as real maths
    el.textContent = '';
    String(text).split(/(\$[^$\n]+\$)/).forEach(function (part) {
      if (/^\$[^$\n]+\$$/.test(part)) {
        const span = document.createElement('span');
        try { katex.render(part.slice(1, -1), span, { throwOnError: false, displayMode: false }); }
        catch (e) { span.textContent = part; }
        el.appendChild(span);
      } else if (part) {                          // one span per word, so her voice can light it up
        part.split(/(\s+)/).forEach(function (tok) {
          if (!tok) return;
          if (/^\s+$/.test(tok)) { el.appendChild(document.createTextNode(tok)); return; }
          const w = document.createElement('span');
          w.className = 'ask-w'; w.textContent = tok;
          el.appendChild(w);
        });
      }
    });
  }

  // Karaoke (Doc, 16.09.2026): the word Solita is saying lights up. Google returns no word timestamps
  // for Studio voices - they do not support SSML <mark> - so the times are ESTIMATED: syllables per
  // word, a pause after commas and sentence ends, spread over the length of the audio. Measured on
  // 16.09.2026 against Studio-C syntheses of the answer cut off after every word: mean error 0.13 s,
  // worst 0.24 s, on an answer the weights were NOT tuned on. Letters instead of syllables were twice
  // as far off, and anchoring on the pauses found in the audio made it worse, not better.
  // lead/tail: the silence Google puts before and after the speech (measured 0.10 s and 0.09 s).
  const KARA = { lead: 0.10, tail: 0.09, base: 0.3, sentence: 1.5, comma: 0.6 };
  function syllables(w) {
    const v = w.toLowerCase().match(/[aeiouyäöü]+/g);
    if (v) return v.length;
    const d = w.replace(/\D/g, '');
    return d.length * 1.5;                           // a bare number: roughly one and a half per digit
  }
  function karaoke(el, a) {
    const items = [];
    let pos = 0;
    el.querySelectorAll('.ask-w').forEach(function (sp) {
      const w = sp.textContent.replace(/[*_`#>]/g, '');   // what speak() strips is not spoken either
      const n = syllables(w);
      if (n) { items.push({ sp: sp, s: pos }); pos += n + KARA.base; }
      if (/[.!?]["')\]]*$/.test(w)) pos += KARA.sentence;
      else if (/[,;:]["')\]]*$/.test(w)) pos += KARA.comma;
    });
    if (!items.length) return;
    const last = items[items.length - 1];
    const total = last.s + syllables(last.sp.textContent) + KARA.base;
    let on = null;
    function mark(sp) {
      if (sp === on) return;
      if (on) on.classList.remove('on');
      on = sp;
      if (!sp) return;
      sp.classList.add('on');
      const r = sp.getBoundingClientRect(), o = out.getBoundingClientRect();   // keep her word in view
      if (r.bottom > o.bottom - 4) out.scrollTop += r.bottom - o.bottom + 24;
      else if (r.top < o.top + 4) out.scrollTop -= o.top - r.top + 24;
    }
    function frame() {
      if (audio !== a || a.paused) { mark(null); return; }   // stopped, closed or finished
      if (isFinite(a.duration) && a.duration > 0) {
        const u = (a.currentTime - KARA.lead) / Math.max(0.1, a.duration - KARA.lead - KARA.tail) * total;
        let i = -1;
        while (i + 1 < items.length && items[i + 1].s <= u) i++;
        mark(i >= 0 ? items[i].sp : null);
      }
      requestAnimationFrame(frame);
    }
    a.addEventListener('playing', function () { requestAnimationFrame(frame); });
  }

  // Solita's own voice via the tts edge function. NO browser-voice fallback (Doc: "NIEMALS
  // Browserstimme") - if the cloud voice fails, the answer just stays on screen.
  // show() puts the answer on screen only once her voice has arrived (Doc, 16.09.2026: "den Text erst
  // zeigen, wenn die audiodaten da sind"), so reading and hearing start together. Speaker off, nothing
  // to say, no voice or a voice that hangs: the answer shows anyway.
  const TTS_WAIT = 20000;                            // ms - a hanging voice must not hide the answer
  function speak(text, show) {
    let shown = false, el = null;
    function once() { if (!shown) { shown = true; el = show(); } }
    const clean = String(text)
      .replace(/\$\$[\s\S]*?\$\$/g, ' ').replace(/\$[^$\n]*?\$/g, ' ')   // maths is shown, not read
      .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}️‍]/gu, '')
      .replace(/[*_`#>]/g, '')
      .replace(/\s+/g, ' ').trim();
    if (!ttsOn || !clean) { once(); return; }        // speaker off: no request, no cost
    const ctl = window.AbortController ? new AbortController() : null;
    const timer = setTimeout(function () { if (ctl) ctl.abort(); }, TTS_WAIT);
    const t0 = Date.now();
    // no password here: the tts function has no password gate - never send it where it is not needed
    post(TTS_URL, { text: clean.slice(0, 4800), voice: VOICE, languageCode: 'de-DE', speakingRate: 1.0 },
         ctl ? ctl.signal : undefined)
      .then(function (r) { return r.json(); })
      .then(function (j) {
        clearTimeout(timer);
        if (!j || !j.audioContent) throw new Error('keine Stimme');
        addVoice(clean.length, Date.now() - t0);     // Google bills it even if it is not played
        once();
        if (!ttsOn || panel.hidden) return;          // switched off or closed while she was fetching
        stopAudio();
        audio = new Audio('data:audio/mp3;base64,' + j.audioContent);
        if (el) karaoke(el, audio);
        audio.play().catch(function () { });
      })
      .catch(function () {
        clearTimeout(timer);
        once();
        say('Solitas Stimme war gerade nicht erreichbar.', 'ask-err');
      });
  }
  function stopAudio() { if (audio) { try { audio.pause(); } catch (e) { } audio = null; } }

  function submit() {
    const v = input.value.trim();
    if (!v || busy) return;
    if (!pwd()) {                                   // first use on this device: verify and remember
      busy = true; send.disabled = true;
      post(AI_URL, { ping: true, pass: v })
        .then(function (r) {
          busy = false; send.disabled = false;
          if (!r.ok) { say('Passwort stimmt nicht.', 'ask-err'); input.value = ''; return; }
          try { localStorage.setItem('dev_access', v); } catch (e) { }
          askQuestion(); input.focus();
        })
        .catch(function () { busy = false; send.disabled = false; say('Kein Netz.', 'ask-err'); });
      return;
    }
    busy = true; send.disabled = true;
    if (ear && ear.active) ear.stop();               // nothing may land in the field behind the answer
    input.value = '';
    say('<span class="ask-q">' + v.replace(/[<&]/g, function (c) { return c === '<' ? '&lt;' : '&amp;'; }) + '</span>');
    // the wave runs while Claude thinks AND while her voice is fetched - it gives way to the answer
    const wait = say('<span class="ask-wave" role="status" aria-label="Solita denkt nach">'
      + '<i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>');
    const t0 = Date.now();
    post(AI_URL, { pass: pwd(), model: MODEL, max_tokens: 600,
      messages: [{ role: 'system', content: SYS }]
        .concat(hist.reduce(function (m, h) {
          return m.concat({ role: 'user', content: 'Frage der Klasse: ' + h.q },
                          { role: 'assistant', content: h.a });
        }, []))
        .concat({ role: 'user', content: context(v) + '\n\nFrage der Klasse: ' + v }) })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        const text = res.ok && res.j && res.j.choices && res.j.choices[0]
          && res.j.choices[0].message && res.j.choices[0].message.content;
        if (!text) {
          busy = false; send.disabled = false;
          wait.className = 'ask-err';
          wait.textContent = (res.j && res.j.error) ? String(res.j.error) : 'Das hat nicht geklappt.';
          return;
        }
        addClaude(res.j.usage, Date.now() - t0);
        hist.push({ q: v, a: text });
        if (hist.length > HIST_MAX) hist.shift();
        speak(text, function () {
          busy = false; send.disabled = false;
          render(wait, text);
          out.scrollTop = out.scrollHeight;
          input.value = ''; input.focus();           // done - empty line for the next question
          return wait;                               // karaoke lights up the words in here
        });
      })
      .catch(function () {
        busy = false; send.disabled = false;
        wait.className = 'ask-err'; wait.textContent = 'Kein Netz.';
      });
  }

  // Speaking the question: the shared engine from js/solita-listen.js (it survives mid-sentence
  // pauses and Android's cumulative results). Recognised text lands in the field - sending stays a
  // deliberate press, so a misheard question never costs money on its own.
  micBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" '
    + 'stroke-linecap="round"><path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z"/>'
    + '<path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/></svg>';
  if (!(window.SpeechRecognition || window.webkitSpeechRecognition)) micBtn.hidden = true;
  micBtn.onclick = function () {
    if (ear && ear.active) { ear.stop(); return; }
    if (!window.SolitaListen) { say('Spracheingabe ist hier nicht geladen.', 'ask-err'); return; }
    stopAudio();                                    // otherwise the mic hears Solita herself
    if (!ear) ear = window.SolitaListen({
      lang: 'de-DE',
      onState: function (st) { micBtn.classList.toggle('on', st === 'listening'); },
      onPartial: function (t) { input.value = t; },
      onFinal: function (t) { input.value = t; micBtn.classList.remove('on'); input.focus(); }
    });
    ear.start();
  };

  function open() {
    if (typeof narr !== 'undefined') narr.stop();   // asking pauses the talk, like turning a page
    panel.hidden = false;
    if (!pwd()) askPassword(); else askQuestion();
    input.focus();
    warm();
  }
  function close() { panel.hidden = true; stopAudio(); }

  document.getElementById('ask-btn').onclick = function () { if (panel.hidden) open(); else close(); };
  document.getElementById('ask-close').onclick = close;
  send.onclick = submit;
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); submit(); }
    else if (e.key === 'Escape') { e.preventDefault(); close(); }
  });
})();
"""
JS = JS + ASK_JS


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
<style>__CSS__</style>
</head>
<body>
<div id="stage"><div id="deck">
__SLIDES__
</div></div>
<div id="bar"></div>
<div id="hud"><button id="play" title="Solita erklärt" aria-label="Solita erklärt" hidden></button><button id="full" title="Vollbild (f)" aria-label="Vollbild"></button></div>
<div id="ask">
  <div id="ask-panel" hidden>
    <div id="ask-head"><span>Frag Solita<b id="ask-cost" title="Kosten der letzten Frage"></b></span><button id="ask-close" type="button" title="Schließen (Esc)" aria-label="Schließen">&times;</button></div>
    <div id="ask-out" aria-live="polite"></div>
    <label for="ask-in">Deine Frage zur Folie</label>
    <div id="ask-row"><button id="ask-mic" type="button" title="Frage sprechen" aria-label="Frage sprechen"></button><button id="ask-tts" type="button" title="Solita liest vor" aria-label="Vorlesen an/aus"></button><input id="ask-in" type="text" autocomplete="off" placeholder="Warum zwei Drittel?"><button id="ask-send" type="button">Los</button></div>
  </div>
  <button id="ask-btn" type="button" title="Frag Solita" aria-label="Frag Solita"><img src="../resources/solita-avatar.png" alt="Solita" width="46" height="46"></button>
</div>
<script id="narration" type="application/json">__NARR__</script>
<script id="summary" type="application/json">__SUMMARY__</script>
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

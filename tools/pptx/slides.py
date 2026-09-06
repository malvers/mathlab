#!/usr/bin/env python3
"""Slide recipes on top of the Informatik design - one call per slide kind.

Deck(name) opens the template; every method adds one slide with the click build
from feedback_pptx_deck_standard (one click per level-0 bullet, native fade).
Coordinates in points. Tables are native (tables.py), pictures come from Pillow.
"""
import collections
import glob
import json
import os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from design_lib import (ORANGE, GREEN, RED, CODE_INK, CODE_MUTED, FONT_M,
                        MARGIN, BODY_Y, BODY_H, CONTENT_W, W, FOOT_Y, emu)
from deck_util import fill_ph, drop_ph, fill_picture, add_click_build, save_deck
from tables import add_table, check_fit, text_width_pt
from design_lib import FONT_H, FONT_B
import math
from pptx import Presentation
from pptx.util import Pt
from pptx.oxml.ns import qn
from pptx.dml.color import RGBColor
from PIL import Image

# Code panel geometry, measured on a rendered PDF (pdftotext -bbox), not guessed:
# the first line sits at y = 188 pt, the panel ends at 446 pt, and PowerPoint turns the
# layout's line_spacing 1.3 into a pitch of 1.3 * 1.2 = 1.56 * font size.
CODE_TOP, CODE_BOTTOM, CODE_PITCH = 188.0, 446.0, 1.56
CODE_SPACE = CODE_BOTTOM - CODE_TOP - 6          # 252 pt of room


def code_max_size(n):
    """Largest font size at which n code lines still fit inside the panel."""
    return CODE_SPACE / (CODE_PITCH * n - (CODE_PITCH - 1.2))

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "out")
IMG = os.path.join(HERE, "img")
os.makedirs(IMG, exist_ok=True)

SQL_KEYWORDS = {"SELECT", "FROM", "WHERE", "ORDER", "BY", "ASC", "DESC", "INSERT", "INTO",
                "VALUES", "UPDATE", "SET", "DELETE", "CREATE", "TABLE", "DROP", "AND", "OR",
                "NOT", "IN", "LIKE", "BETWEEN", "IS", "NULL", "GROUP", "HAVING", "JOIN",
                "ON", "AS", "COUNT", "SUM", "AVG", "MIN", "MAX", "LIMIT", "DISTINCT",
                "PRAGMA", "INNER", "LEFT", "ALTER", "ADD", "COLUMN", "CASCADE", "RESTRICT"}
SQL_CONSTRAINTS = {"PRIMARY", "KEY", "FOREIGN", "REFERENCES", "UNIQUE", "CHECK", "DEFAULT",
                   "AUTOINCREMENT", "INTEGER", "TEXT", "REAL", "DATE"}


def sql_parts(line):
    """Colour one SQL line: keywords orange, types/constraints green, strings green,
    comments muted. Returns [(text, hex)] for code()."""
    out = []
    if "--" in line:
        code, comment = line.split("--", 1)
        out += sql_parts(code)
        out.append(("--" + comment, CODE_MUTED))
        return out
    for tok in re.split(r"('[^']*')", line):
        if not tok:
            continue
        if tok.startswith("'"):
            out.append((tok, GREEN))
            continue
        for word in re.split(r"(\w+)", tok):
            if not word:
                continue
            up = word.upper()
            if up in SQL_KEYWORDS and word == up:
                out.append((word, ORANGE))
            elif up in SQL_CONSTRAINTS and word == up:
                out.append((word, GREEN))
            else:
                out.append((word, CODE_INK))
    # merge neighbouring runs of the same colour
    merged = []
    for text, col in out:
        if merged and merged[-1][1] == col:
            merged[-1] = (merged[-1][0] + text, col)
        else:
            merged.append((text, col))
    return merged


# ------------------------------------------------------------- Begruessung ---
# Die Auftaktfolie vor jedem Deck: randloses Motiv links, Gruss und Zitat rechts.
# Die Motive liegen in img/morning/ (extract_morning.py) - fremdes Material, deshalb
# nicht im oeffentlichen Repo. Jedes Deck bekommt ueber seinen Namen stabil dasselbe.
MORNING_DIR = os.path.join(IMG, "morning")
GREET_TEXT = "Good morning!"
GREET_QUOTE = "Nur das Schöne wird die Welt retten!"
GREET_AUTHOR = "Fjodor Dostojewski"


MORNING_MAP = os.path.join(HERE, "morning-zuordnung.json")


def morning_image(key):
    """Welches Motiv gehoert zu welchem Deck.

    Die Zuordnung steht in morning-zuordnung.json und bleibt damit ueber Rebuilds
    stabil - ein Deck behaelt sein Bild. Neue Decks bekommen automatisch das am
    seltensten benutzte Motiv, damit sich nichts haeuft. Zum Tauschen einfach die
    Zeile in der JSON aendern (oder loeschen, dann wird neu gezogen).
    """
    pool = sorted(os.path.basename(f) for f in glob.glob(os.path.join(MORNING_DIR, "*.jpg")))
    if not pool:
        return None
    try:
        with open(MORNING_MAP, encoding="utf-8") as f:
            table = json.load(f)
    except (OSError, ValueError):
        table = {}
    if table.get(key) not in pool:
        used = collections.Counter(v for v in table.values() if v in pool)
        table[key] = min(pool, key=lambda name: (used[name], name))
        with open(MORNING_MAP, "w", encoding="utf-8") as f:
            json.dump(dict(sorted(table.items())), f, indent=2, ensure_ascii=False)
            f.write("\n")
    return os.path.join(MORNING_DIR, table[key])


def move_slide(prs, index):
    """Die zuletzt angelegte Folie an Position `index` schieben."""
    ids = prs.slides._sldIdLst
    el = list(ids)[-1]
    ids.remove(el)
    ids.insert(index, el)


def add_greeting(prs, layouts, key, text=GREET_TEXT, quote=GREET_QUOTE,
                 author=GREET_AUTHOR, image=None, index=0):
    """Begruessungsfolie anlegen und nach vorn schieben. Gibt die Folie zurueck."""
    s = prs.slides.add_slide(layouts["Begrüßung"])
    img = image or morning_image(key)
    if img:
        fill_picture(s, 2, img)
    else:
        drop_ph(s, 2)
        print("  WARN kein Motiv in img/morning - erst extract_morning.py laufen lassen")
    s.shapes.title.text_frame.text = text
    fill_ph(s, 1, [(quote, 0)])
    fill_ph(s, 3, [(author, 0)])
    move_slide(prs, index)
    return s


class Deck:
    def __init__(self, out_name, greeting=True, greet_text=GREET_TEXT,
                 greet_quote=GREET_QUOTE, greet_author=GREET_AUTHOR, greet_image=None):
        self.out = os.path.join(OUT, out_name)
        self.prs = Presentation(os.path.join(OUT, "informatik-vorlage.pptx"))
        self.lay = {l.name: l for l in self.prs.slide_layouts}
        if greeting:
            self.greeting(greet_text, greet_quote, greet_author, greet_image)

    def greeting(self, text=GREET_TEXT, quote=GREET_QUOTE, author=GREET_AUTHOR,
                 image=None, index=0):
        """Die Auftaktfolie - steht als Folie 0 vor allem anderen."""
        return add_greeting(self.prs, self.lay, os.path.basename(self.out),
                            text, quote, author, image, index)

    # ------------------------------------------------------------ basics ---
    def _add(self, layout):
        return self.prs.slides.add_slide(self.lay[layout])

    @staticmethod
    def place(ph, x, y, w, h):
        """Move a placeholder - all four values at once, else the rest falls to 0."""
        ph.left, ph.top, ph.width, ph.height = emu(x), emu(y), emu(w), emu(h)

    def _content(self, layout, title, lines):
        s = self._add(layout)
        if title:
            s.shapes.title.text_frame.text = title
            self._check_title(title, 28, CONTENT_W)
        body = fill_ph(s, 1, lines) if lines else None
        return s, body

    # ------------------------------------------------------- measuring ---
    @staticmethod
    def _check_title(title, size, width):
        w = text_width_pt(title, FONT_H, size, bold=True)
        if w > width:
            print(f"  WARN title wraps ({w:.0f} > {width:.0f} pt): {title}")

    @staticmethod
    def body_height(lines, width, sizes=(20, 17), spacing=1.25, before=(12, 6), marl=(20, 44)):
        """Estimated height in pt of a bullet list rendered in `width` pt."""
        total = 0.0
        for i, (text, level) in enumerate(lines):
            size = sizes[min(level, len(sizes) - 1)]
            plain = text.replace("**", "")
            tw = text_width_pt(plain, FONT_B, size) * 1.04     # bold runs are a bit wider
            avail = width - marl[min(level, 1)] - 14
            n = max(1, math.ceil(tw / avail))
            total += n * size * spacing + (before[min(level, 1)] if i else 0)
        return total

    def _check_body(self, lines, width, height, title="", **kw):
        if not lines:
            return
        h = self.body_height(lines, width, **kw)
        if h > height:
            print(f"  WARN body overflows ({h:.0f} > {height:.0f} pt): {title}")

    # ------------------------------------------------------------ slides ---
    def title(self, kicker, title, sub):
        s = self._add("Titel")
        fill_ph(s, 10, [(kicker, 0)])
        fill_ph(s, 0, [(title, 0)])
        fill_ph(s, 1, [(sub, 0)])
        return s

    def chapter(self, num, title, sub):
        s = self._add("Kapitel")
        fill_ph(s, 10, [(f"Kapitel {num:02d}", 0)])
        s.shapes.title.text_frame.text = title
        self._check_title(title, 34, 700)
        fill_ph(s, 1, [(sub, 0)])
        return s

    def bullets(self, title, lines):
        s, body = self._content("Inhalt", title, lines)
        self._check_body(lines, CONTENT_W, BODY_H, title)
        add_click_build(s, [(body, lines)])
        return s

    def two_cols(self, title, left_lines, right_lines):
        s = self._add("Zwei Spalten")
        s.shapes.title.text_frame.text = title
        self._check_title(title, 28, CONTENT_W)
        for ls in (left_lines, right_lines):
            self._check_body(ls, 344, 254, title, sizes=(15, 17), before=(0, 10), marl=(0, 20))
        left = fill_ph(s, 1, left_lines)
        right = fill_ph(s, 2, right_lines)
        add_click_build(s, [(left, left_lines), (right, right_lines)])
        return s

    def merksatz(self, text, label="Merksatz"):
        s = self._add("Merksatz")
        fill_ph(s, 1, [(text, 0)])
        fill_ph(s, 2, [(label, 0)])
        return s

    def code(self, title, lines, size=None):
        """lines: list of str (SQL, auto-coloured) or list of [(text, hex)]."""
        s = self._add("Code")
        s.shapes.title.text_frame.text = title
        self._check_title(title, 28, CONTENT_W)
        n = len(lines)
        size = size or (13 if n <= 12 else 11.5 if n <= 14 else 10.5 if n <= 16 else 10)
        fits = code_max_size(n)
        if size > fits:
            neu = fits // 0.5 * 0.5
            print(f"  WARN Code zu hoch ({n} Zeilen bei {size} pt) - auf {neu:.1f} pt "
                  f"verkleinert{' - BITTE AUFTEILEN' if neu < 9 else ''}: {title}")
            size = neu
        tf = s.placeholders[1].text_frame
        tf.word_wrap = False
        for i, line in enumerate(lines):
            p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
            parts = sql_parts(line) if isinstance(line, str) else line
            for text, color in parts:
                r = p.add_run()
                r.text = text
                r.font.name = FONT_M
                r.font.size = Pt(size)
                r.font.color.rgb = RGBColor.from_string(color)
        return s

    def table_bullets(self, title, lines, rows, col_w, marks=None, font_size=11,
                      bold_cols=(), mono_cols=(), align=None, body_w=404, y=None):
        """Bullets left, native table right (top aligned with the body)."""
        s, body = self._content("Inhalt", title, lines)
        self.place(body, MARGIN, BODY_Y, body_w, BODY_H)
        self._check_body(lines, body_w, BODY_H, title)
        bad = check_fit(rows, col_w, font_size, bold_cols, mono_cols)
        assert not bad, (title, bad)
        add_table(s, rows, W - MARGIN - sum(col_w), y if y is not None else BODY_Y + 4,
                  col_w, font_size=font_size, marks=marks, bold_cols=bold_cols,
                  mono_cols=mono_cols, align=align)
        add_click_build(s, [(body, lines)])
        return s

    def table_top(self, title, rows, col_w, lines, marks=None, font_size=12, row_h=None,
                  bold_cols=(), mono_cols=(), align=None, x=None):
        """Full-width table on top, bullets underneath."""
        s, body = self._content("Inhalt", title, lines)
        bad = check_fit(rows, col_w, font_size, bold_cols, mono_cols)
        assert not bad, (title, bad)
        row_h = row_h or font_size * 1.85
        x = MARGIN if x is None else x
        add_table(s, rows, x, BODY_Y, col_w, font_size=font_size, row_h=row_h, marks=marks,
                  bold_cols=bold_cols, mono_cols=mono_cols, align=align)
        top = BODY_Y + row_h * len(rows) + 14
        if body is not None:
            self.place(body, MARGIN, top, CONTENT_W, FOOT_Y - top - 8)
            self._check_body(lines, CONTENT_W, FOOT_Y - top - 8, title)
            add_click_build(s, [(body, lines)])
        return s

    def picture(self, title, path, lines=None, width=CONTENT_W, gap=6):
        """Picture across the top (scaled to width), bullets underneath."""
        s, body = self._content("Inhalt", title, lines)
        iw, ih = Image.open(path).size
        h = width * ih / iw
        s.shapes.add_picture(path, emu(MARGIN + (CONTENT_W - width) / 2), emu(BODY_Y),
                             emu(width), emu(h))
        if body is not None:
            top = BODY_Y + h + gap
            self.place(body, MARGIN, top, CONTENT_W, FOOT_Y - top - 8)
            self._check_body(lines, CONTENT_W, FOOT_Y - top - 8, title)
            add_click_build(s, [(body, lines)])
        else:
            drop_ph(s, 1)
        return s

    def picture_bullets(self, title, path, lines, pic_w=380, pic_h=None, side="right"):
        """Bullets on one side, picture on the other (fits inside pic_w x BODY_H)."""
        s, body = self._content("Inhalt", title, lines)
        iw, ih = Image.open(path).size
        pic_h = pic_h or BODY_H
        scale = min(pic_w / iw, pic_h / ih)
        w, h = iw * scale, ih * scale
        body_w = CONTENT_W - pic_w - 24
        if side == "right":
            self.place(body, MARGIN, BODY_Y, body_w, BODY_H)
            px = W - MARGIN - pic_w + (pic_w - w) / 2
        else:
            self.place(body, W - MARGIN - body_w, BODY_Y, body_w, BODY_H)
            px = MARGIN + (pic_w - w) / 2
        s.shapes.add_picture(path, emu(px), emu(BODY_Y + 4), emu(w), emu(h))
        self._check_body(lines, body_w, BODY_H, title)
        add_click_build(s, [(body, lines)])
        return s

    def picture_table(self, title, path, rows, col_w, lines, pic_w=380, font_size=11,
                      bold_cols=(), marks=None, align=None, mono_cols=()):
        """Picture left, table right, bullets underneath both."""
        s, body = self._content("Inhalt", title, lines)
        iw, ih = Image.open(path).size
        scale = min(pic_w / iw, 210 / ih)
        w, h = iw * scale, ih * scale
        s.shapes.add_picture(path, emu(MARGIN), emu(BODY_Y), emu(w), emu(h))
        bad = check_fit(rows, col_w, font_size, bold_cols, mono_cols)
        assert not bad, (title, bad)
        add_table(s, rows, W - MARGIN - sum(col_w), BODY_Y + 4, col_w, font_size=font_size,
                  marks=marks, bold_cols=bold_cols, mono_cols=mono_cols, align=align)
        row_h = font_size * 1.9
        top = BODY_Y + max(h, row_h * len(rows)) + 14
        self.place(body, MARGIN, top, CONTENT_W, FOOT_Y - top - 8)
        self._check_body(lines, CONTENT_W, FOOT_Y - top - 8, title)
        add_click_build(s, [(body, lines)])
        return s

    def save(self):
        save_deck(self.prs, self.out)
        print("deck:", self.out, len(self.prs.slides._sldIdLst), "Folien")
        return self.out


# ------------------------------------------------------------------ Python ---
PY_KEYWORDS = {"def", "return", "if", "elif", "else", "for", "while", "in", "not", "and",
               "or", "import", "from", "class", "try", "except", "finally", "with", "as",
               "lambda", "pass", "break", "continue", "global", "None", "True", "False",
               "is", "assert", "yield", "raise", "del"}
PY_BUILTINS = {"print", "input", "int", "float", "str", "len", "range", "round", "sum",
               "min", "max", "sorted", "list", "dict", "set", "tuple", "open", "abs",
               "type", "bool", "enumerate", "zip", "super", "self", "__init__", "format"}


def py_parts(line):
    """Colour one Python line: keywords orange, builtins/strings green, comments muted."""
    out = []
    if "#" in line and line.count("'") % 2 == 0 and line.count('"') % 2 == 0:
        code, comment = line.split("#", 1)
        out += py_parts(code)
        out.append(("#" + comment, CODE_MUTED))
        return out
    for tok in re.split(r"('[^']*'|\"[^\"]*\")", line):
        if not tok:
            continue
        if tok[:1] in "'\"":
            out.append((tok, GREEN))
            continue
        for word in re.split(r"(\w+)", tok):
            if not word:
                continue
            if word in PY_KEYWORDS:
                out.append((word, ORANGE))
            elif word in PY_BUILTINS:
                out.append((word, GREEN))
            else:
                out.append((word, CODE_INK))
    merged = []
    for text, col in out:
        if merged and merged[-1][1] == col:
            merged[-1] = (merged[-1][0] + text, col)
        else:
            merged.append((text, col))
    return merged


def py(deck, title, lines, size=None):
    """Code slide with Python colouring."""
    return deck.code(title, [py_parts(l) for l in lines], size=size)


# -------------------------------------------------------------- HTML / CSS ---
def html_parts(line):
    """Colour one HTML line: tags orange, attribute names green, comments muted."""
    if line.strip().startswith("<!--") or line.strip().startswith("#"):
        return [(line, CODE_MUTED)]
    out = []
    for chunk in re.split(r"(<[^>]*>)", line):
        if not chunk:
            continue
        if not chunk.startswith("<"):
            out.append((chunk, CODE_INK))
            continue
        for tok in re.split(r"(\"[^\"]*\")", chunk):
            if not tok:
                continue
            if tok.startswith('"'):
                out.append((tok, CODE_INK))
                continue
            for word in re.split(r"([A-Za-z0-9_:.-]+)", tok):
                if not word:
                    continue
                if re.match(r"^[A-Za-z][A-Za-z0-9]*$", word) and (
                        out and out[-1][0].rstrip().endswith(("<", "/"))):
                    out.append((word, ORANGE))
                elif re.match(r"^[a-z-]+$", word):
                    out.append((word, GREEN))
                else:
                    out.append((word, ORANGE))
    merged = []
    for text, col in out:
        if merged and merged[-1][1] == col:
            merged[-1] = (merged[-1][0] + text, col)
        else:
            merged.append((text, col))
    return merged


def css_parts(line):
    """Colour one CSS line: selectors orange, properties green, values plain."""
    stripped = line.strip()
    if stripped.startswith("/*") or stripped.startswith("*"):
        return [(line, CODE_MUTED)]
    if ":" in line and not stripped.endswith("{"):
        prop, value = line.split(":", 1)
        return [(prop, GREEN), (":", CODE_INK), (value, CODE_INK)]
    if stripped.endswith("{") or stripped in ("}", ""):
        return [(line, ORANGE)]
    return [(line, CODE_INK)]


# ------------------------------------------------------- JavaScript / PHP ---
def _kw_parts(line, keywords, builtins, comment="//"):
    """Generic colouring: keywords orange, builtins/strings green, comments muted."""
    out = []
    if comment and comment in line and line.count("'") % 2 == 0 and line.count('"') % 2 == 0:
        head, tail = line.split(comment, 1)
        out += _kw_parts(head, keywords, builtins, comment)
        out.append((comment + tail, CODE_MUTED))
        return out
    for tok in re.split(r"('[^']*'|\"[^\"]*\")", line):
        if not tok:
            continue
        if tok[:1] in "'\"":
            out.append((tok, GREEN))
            continue
        for word in re.split(r"([A-Za-z_$][A-Za-z0-9_$]*)", tok):
            if not word:
                continue
            if word in keywords:
                out.append((word, ORANGE))
            elif word in builtins:
                out.append((word, GREEN))
            else:
                out.append((word, CODE_INK))
    merged = []
    for text, col in out:
        if merged and merged[-1][1] == col:
            merged[-1] = (merged[-1][0] + text, col)
        else:
            merged.append((text, col))
    return merged


JS_KEYWORDS = {"const", "let", "var", "function", "return", "if", "else", "for", "while",
               "of", "in", "new", "class", "extends", "await", "async", "true", "false",
               "null", "undefined", "try", "catch", "import", "export", "default"}
JS_BUILTINS = {"document", "window", "console", "log", "fetch", "querySelector", "JSON",
               "addEventListener", "getElementById", "Math", "parseInt", "parseFloat",
               "innerHTML", "textContent", "value", "then", "map", "filter", "push", "length"}

PHP_KEYWORDS = {"function", "return", "if", "else", "elseif", "foreach", "as", "while",
                "echo", "require", "include", "new", "try", "catch", "true", "false",
                "null", "class", "public", "private", "use", "and", "or", "not"}
PHP_BUILTINS = {"PDO", "prepare", "execute", "fetchAll", "fetch", "htmlspecialchars",
                "isset", "empty", "count", "array", "password_hash", "password_verify",
                "session_start", "header", "bindValue", "query"}


def js_parts(line):
    return _kw_parts(line, JS_KEYWORDS, JS_BUILTINS, "//")


def php_parts(line):
    return _kw_parts(line, PHP_KEYWORDS, PHP_BUILTINS, "//")


def plain_parts(line):
    """No syntax at all - protocol dumps, console output."""
    return [(line, CODE_INK)]

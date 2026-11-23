#!/usr/bin/env python3
"""The figures of the deck mathe11-lt1-nachgebessert (Leistungstest 1: Papier und online) - svgfig, inline SVG.

    python3 tools/pptx/mathe11_lt1_nachgebessert_svg.py              # lists the figures
    python3 tools/pptx/mathe11_lt1_nachgebessert_svg.py ablauf       # prints the <svg> markup of one figure
    python3 tools/pptx/mathe11_lt1_nachgebessert_svg.py notenspiegel-folie   # the whole grade slide, to paste

The grade slide: three tables (online / paper / final). The third one ("final", online + bonus points) is a grey
placeholder until FINAL below is filled in. Then rebuild the deck (build_lt1_nachgebessert_mathe11.py) - or, if it
has been edited in the browser by then, paste the output of "notenspiegel-folie" over slide 9 and update its line
in the deck's summary JSON.

Leistungstest 1 Mathe BGY26 (23.11.2026) was answered on paper first and online after that. Once a test was
submitted, the test page showed the right answer next to the pupil's own wrong one; on several sheets exactly those
wrong answers were then blackened or erased on paper and the shown answer crossed. Doc's decision: the online result
counts. The deck shows what happened, why that does not work, what counts now and what changed (no solutions after
submitting any more). Anonymous throughout: the sheets are A, B, D, the pictures show only the answer rows.

Returns (svg, labels) like the other deck figures: shapes in the 816 x 330 picture box, every word and number as an
HTML label (centre x, centre y, width, text[, css[, click]]) the deck editor can change (rule 23). The scans of the
answer rows lie in the SVG as <image> (HTML/decks/img/lt1-nachgebessert/), framed red where the answer chosen online
was wrong and green where the test page showed the right one.
"""
import os
import struct
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.join(HERE, "..", "aufgaben"))
import svgfig as S   # noqa: E402
from svgfig import fmt   # noqa: E402

W, H = 816, 330
IMG = "img/lt1-nachgebessert/"                       # relative to HTML/decks/
IMG_DIR = os.path.join(HERE, "..", "..", "HTML", "decks", "img", "lt1-nachgebessert")
TEXT = "var(--formel)"                               # the blue of the bullets
PEN, SCRIBBLE = "#1F3A93", "#22306E"                 # a ballpoint cross and a blackened box in the icons
CARD_EDGE = "#C9D3E3"                                # a quiet edge for the white cards


def lab(left, top, w, text, size=14, color=TEXT, g=None, align="left", extra=""):
    """A label by its left edge and top (figure_label wants the centre of a one-line box: line = 1.28 x size)."""
    css = "font-size:%gpx;color:%s;--fg:%s;text-align:%s%s" % (size, color, color, align, extra)
    click = {"g": g, "kommt": True} if g is not None else None
    return (left + w / 2.0, top + 0.64 * size, w, text, css, click)


def _g(c, g):
    c.raw('<g class="step kommt" data-g="%d">' % g)


def _end(c):
    c.raw('</g>')


# ------------------------------------------------------------------------------------------------------ icons ---
def icon_sheet(c, cx, cy, s=1.0, rows=("x", "", ""), ring=None):
    """A test sheet with three answer rows: 'x' crossed, 'fill' blackened, '' empty; ring = row with a red circle."""
    w, h, fold = 62 * s, 78 * s, 16 * s
    x0, y0 = cx - w / 2, cy - h / 2
    c.path("M %s %s H %s L %s %s V %s H %s Z" % (fmt(x0), fmt(y0), fmt(x0 + w - fold), fmt(x0 + w),
           fmt(y0 + fold), fmt(y0 + h), fmt(x0)), stroke=S.INK, width=1.6, fill=S.PAPER)
    c.path("M %s %s V %s H %s" % (fmt(x0 + w - fold), fmt(y0), fmt(y0 + fold), fmt(x0 + w)), stroke=S.INK, width=1.4)
    q = 10 * s
    for n, kind in enumerate(rows):
        ry, bx = y0 + (26 + 18 * n) * s, x0 + 10 * s
        fill = SCRIBBLE if kind == "fill" else S.PAPER
        c.rect(bx, ry - q / 2, q, q, fill=fill, stroke=(SCRIBBLE if kind == "fill" else S.INK), width=1.2, rx=1.5)
        if kind == "x":
            d = 1.5 * s
            c.line(bx + d, ry - q / 2 + d, bx + q - d, ry + q / 2 - d, PEN, 1.6)
            c.line(bx + q - d, ry - q / 2 + d, bx + d, ry + q / 2 - d, PEN, 1.6)
        c.line(bx + q + 7 * s, ry, x0 + w - 10 * s, ry, S.MUTED, 1.4)
        if ring == n:
            c.circle(bx + q / 2, ry, 11 * s, fill="none", stroke=S.RED, width=2.2)


def icon_screen(c, cx, cy, s=1.0, mode="online"):
    """A screen: 'online' = answers and the submit button, 'loesung' = rows ticked green / crossed red."""
    w, h = 90 * s, 58 * s
    x0, y0 = cx - w / 2, cy - h / 2 - 8 * s
    c.rect(x0, y0, w, h, fill=S.PAPER, stroke=S.INK, width=1.6, rx=5 * s)
    c.path("M %s %s L %s %s H %s L %s %s" % (fmt(cx - 8 * s), fmt(y0 + h), fmt(cx - 13 * s), fmt(y0 + h + 13 * s),
           fmt(cx + 13 * s), fmt(cx + 8 * s), fmt(y0 + h)), stroke=S.INK, width=1.4, fill=S.PAPER)
    c.line(cx - 22 * s, y0 + h + 13 * s, cx + 22 * s, y0 + h + 13 * s, S.INK, 1.6)
    if mode == "online":
        for n in range(3):
            ry = y0 + (12 + 12 * n) * s
            c.circle(x0 + 12 * s, ry, 3.2 * s, fill=(S.INK if n == 1 else S.PAPER), stroke=S.INK, width=1.1)
            c.line(x0 + 21 * s, ry, x0 + 58 * s, ry, S.MUTED, 1.3)
        c.rect(x0 + 54 * s, y0 + 42 * s, 28 * s, 9 * s, fill=S.INK, rx=2.5 * s)
        return
    for n, ok in enumerate((True, False, True)):
        ry, mx = y0 + (13 + 15 * n) * s, x0 + 13 * s
        col = S.GREEN if ok else S.RED
        c.circle(mx, ry, 5.2 * s, fill=col, stroke=col, width=1)
        if ok:
            c.path("M %s %s L %s %s L %s %s" % (fmt(mx - 2.6 * s), fmt(ry + .2 * s), fmt(mx - .6 * s),
                   fmt(ry + 2.4 * s), fmt(mx + 3 * s), fmt(ry - 2.2 * s)), stroke=S.PAPER, width=1.5)
        else:
            d = 2.2 * s
            c.line(mx - d, ry - d, mx + d, ry + d, S.PAPER, 1.5)
            c.line(mx + d, ry - d, mx - d, ry + d, S.PAPER, 1.5)
        c.line(x0 + 24 * s, ry, x0 + 76 * s, ry, col, 2.2, opacity=.55)


def _card(c, x, y, w, h, bar, edge=S.INK, width=1.0):
    c.rect(x, y, w, h, fill=S.PAPER, stroke=edge, width=width, rx=12)
    c.raw('<rect x="%s" y="%s" width="%s" height="5" rx="2.5" fill="%s"/>' % (fmt(x + 14), fmt(y), fmt(w - 28), bar))


# ----------------------------------------------------------------------------------------------- the flow ---
def ablauf():
    """Paper -> online -> solution shown -> paper changed: four cards, one per click, the last one red."""
    c = S.Canvas(W, H)
    cards = [
        (S.ORANGE, S.INK, "Papier", "Teil A auf dem Papierbogen ankreuzen"),
        (S.INK, "#FFFFFF", "Online", "dieselben Antworten online eingeben und abgeben"),
        (S.GREEN, "#FFFFFF", "Lösung angezeigt", "Die Testseite zeigt die richtige Antwort grün, die eigene falsche rot."),
        (S.RED, "#FFFFFF", "Papier geändert",
         "auf einigen Bögen: falsche Kreuze geschwärzt oder radiert, die angezeigte Lösung angekreuzt"),
    ]
    w, gap, top, h = 176, 37, 18, 294
    labels = []
    for i, (col, num_ink, title, text) in enumerate(cards):
        x = i * (w + gap)
        cy = top + 90
        _g(c, i)
        _card(c, x, top, w, h, col, edge=(S.RED if i == 3 else S.INK), width=(1.8 if i == 3 else 1.0))
        c.circle(x + 28, top + 30, 13, fill=col, stroke=col, width=1)
        if i == 0:
            icon_sheet(c, x + w / 2, cy, 1.0, rows=("x", "x", ""))
        elif i == 1:
            icon_screen(c, x + w / 2, cy, 1.0, "online")
        elif i == 2:
            icon_screen(c, x + w / 2, cy, 1.0, "loesung")
        else:
            icon_sheet(c, x + w / 2, cy, 1.0, rows=("fill", "x", ""), ring=0)
        _end(c)
        if i < 3:                        # the arrow comes with the next card
            _g(c, i + 1)
            c.arrow(x + w + 5, cy, x + w + gap - 5, cy, S.MUTED, 2.2)
            _end(c)
        labels.append((x + 28, top + 30, 26, str(i + 1),
                       "font-size:14px;font-weight:700;font-family:Arial,Helvetica,sans-serif;color:%s" % num_ink, {"g": i, "kommt": True}))
        labels.append(lab(x + 8, top + 146, w - 16, title, 14, S.RED if i == 3 else "var(--ink)", i, "center",
                          ";font-family:Orbitron,system-ui,sans-serif;font-weight:700"))
        labels.append(lab(x + 12, top + 178, w - 24, text, 14, "var(--body)", i, "center", ";line-height:1.32"))
    return c.svg("Ablauf: Papier, online, Lösung angezeigt, Papier geändert"), labels


def neu():
    """What changed: the same flow with the solution display struck out, and the two sentences below it."""
    c = S.Canvas(W, H)
    labels = []
    w, gap, top, h = 232, 60, 2, 168
    cards = [(S.ORANGE, "Papier", "Teil A auf dem Bogen ankreuzen"), (S.INK, "Online", "eingeben und abgeben")]
    for i, (col, title, text) in enumerate(cards):
        x = i * (w + gap)
        _card(c, x, top, w, h, col)
        if i == 0:
            icon_sheet(c, x + w / 2, 58, 0.78, rows=("x", "x", ""))
        else:
            icon_screen(c, x + w / 2, 62, 0.82, "online")
        c.arrow(x + w + 6, 66, x + w + gap - 6, 66, S.MUTED, 2.2)
        labels.append(lab(x + 8, 112, w - 16, title, 14, "var(--ink)", None, "center",
                          ";font-family:Orbitron,system-ui,sans-serif;font-weight:700"))
        labels.append(lab(x + 10, 138, w - 20, text, 14, "var(--body)", None, "center"))
    x, cx = 2 * (w + gap), 2 * (w + gap) + w / 2
    _g(c, 0)
    c.raw('<rect x="%s" y="%s" width="%s" height="%s" rx="12" fill="#FFFFFF" fill-opacity=".5" stroke="%s"'
          ' stroke-width="1.2" stroke-dasharray="6 5"/>' % (fmt(x), top, w, h, S.MUTED))
    c.raw('<g opacity=".32">')
    icon_screen(c, cx, 62, 0.82, "loesung")
    c.raw('</g>')
    c.line(cx - 52, 22, cx + 52, 102, S.RED, 4)
    c.line(cx + 52, 22, cx - 52, 102, S.RED, 4)
    _end(c)
    labels.append(lab(x + 8, 112, w - 16, "Lösung angezeigt", 14, "var(--muted)", 0, "center",
                      ";font-family:Orbitron,system-ui,sans-serif;font-weight:700;text-decoration:line-through;"
                      "text-decoration-thickness:2px"))
    labels.append(lab(x + 10, 138, w - 20, "gibt es nicht mehr", 14, "var(--red)", 0, "center", ";font-weight:700"))
    # the two sentences, each with the square of a bullet
    lines = [(196, 1, "Nach dem Abgeben zeigt die Testseite **keine Lösungen** mehr an."),
             (238, 2, "Ein Teil des Fehlers lag **bei uns**: Die Lösungen hätten nicht sichtbar sein dürfen, "
                      "solange die Papierbögen noch auf dem Tisch lagen.")]
    for y, g, text in lines:
        _g(c, g)
        c.rect(0, y + 9.3, 7, 7, fill="#000050")
        _end(c)
        labels.append(lab(20, y, 796, text, 20, TEXT, g))
    return c.svg("Neu: keine Lösungsanzeige mehr nach dem Abgeben"), labels


# --------------------------------------------------------------------------------------------- the scans ---
def _png_size(name):
    with open(os.path.join(IMG_DIR, name), "rb") as f:
        head = f.read(24)
    assert head[:8] == b"\x89PNG\r\n\x1a\n", name
    return struct.unpack(">II", head[16:24])


# file, question, chosen online (wrong), shown as right, what the paper says now,
# box of the wrong and of the shown answer (left/top of the printed 46 px square, image pixels)
STRIPS = {
    "a01": ("bogen-a-frage-01.png", 1, "C", "A", "**A**, C geschwärzt", (965, 15), (18, 15)),
    "a02": ("bogen-a-frage-02.png", 2, "C", "D", "**D**, C geschwärzt", (965, 14), (1437, 15)),
    "a12": ("bogen-a-frage-12.png", 12, "C", "D", "**D**, C geschwärzt", (19, 70), (961, 70)),
    "a19": ("bogen-a-frage-19.png", 19, "A", "D", "**D**, A geschwärzt", (17, 17), (1431, 17)),
    "b09": ("bogen-b-frage-09.png", 9, "D", "B", "**B**, Kästchen D wegradiert", (962, 71), (962, 15)),
    "b11": ("bogen-b-frage-11.png", 11, "B", "C", "**C**, Kästchen B wegradiert", (489, 15), (960, 15)),
    "b15": ("bogen-b-frage-15.png", 15, "B", "D", "**D**, Kästchen B wegradiert", (489, 15), (1428, 15)),
    "d05": ("bogen-d-frage-05.png", 5, "B", "A", "**A**, B geschwärzt", (490, 15), (18, 15)),
    "d13": ("bogen-d-frage-13.png", 13, "A", "B", "**B**, A geschwärzt", (20, 13), (487, 13)),
}
STRIP_W, PAD_X, PAD_Y = 800.0, 8.0, 6.0      # the scan in its white card, full box width
CAP_H, GAP = 22.0, 10.0                       # the caption line above a scan, the room between two scans


def _strip(c, labels, key, y, g):
    """One answer row: caption, white card, scan, red and green frame. Returns the y below it."""
    src, q, online, shown, paper, bad, good = STRIPS[key]
    iw, ih = _png_size(src)
    k = STRIP_W / iw
    h = ih * k
    labels.append(lab(0, y, W, "<f2><z4>**Frage %d**</z4></f2>\u2003<c2>online gewählt: **%s** (falsch)</c2>\u2002·\u2002"
                      "<c3>danach angezeigt: **%s**</c3>\u2002·\u2002Papier jetzt: %s" % (q, online, shown, paper),
                      14.5, "var(--body)", g, extra=";white-space:nowrap"))
    top = y + CAP_H
    _g(c, g)
    c.rect(0, top, W, h + 2 * PAD_Y, fill=S.PAPER, stroke=CARD_EDGE, width=1, rx=6)
    c.raw('<image href="%s%s" x="%s" y="%s" width="%s" height="%s" preserveAspectRatio="none"/>'
          % (IMG, src, fmt(PAD_X), fmt(top + PAD_Y), fmt(STRIP_W), fmt(h)))
    px, py = (8, 3) if key == "b09" else (8, 8)      # B and D share a column there: flatter frames
    for (bx, by), col in ((bad, S.RED), (good, S.GREEN)):
        c.rect(PAD_X + (bx - px) * k, top + PAD_Y + (by - py) * k, (46 + 2 * px) * k, (46 + 2 * py) * k,
               stroke=col, width=2.4, rx=5)
    _end(c)
    return top + h + 2 * PAD_Y + GAP


def _hinweis(c, labels, y, tag, text, g):
    """A box under the scans: an orange tag and one or two lines of text."""
    h = 72
    _g(c, g)
    c.raw('<rect x="0" y="%s" width="%d" height="%d" rx="8" fill="#FFFFFF" fill-opacity=".62"/>' % (fmt(y), W, h))
    c.rect(0, y, 4, h, fill=S.ORANGE)
    c.rect(20, y + 15, 112, 20, fill=S.ORANGE, rx=5)
    _end(c)
    labels.append((77.25, y + 25, 112, tag, "font-size:11px;font-weight:700;font-family:Orbitron,system-ui,sans-serif;"
                   "letter-spacing:2.5px;text-transform:uppercase;color:var(--ink)", {"g": g, "kommt": True}))
    labels.append(lab(148, y + 12, W - 168, text, 18, TEXT, g, extra=";line-height:1.3"))
    return y + h


def beispiel(keys, hinweis=None):
    """Scans one under the other, one per click; hinweis = (tag, text) comes as a box after them."""
    c = S.Canvas(W, H)
    labels, y = [], 0.0
    for g, key in enumerate(keys):
        y = _strip(c, labels, key, y, g)
    if hinweis:
        _hinweis(c, labels, y + 2, hinweis[0], hinweis[1], len(keys))
    assert y <= H + GAP and (not hinweis or y + 74 <= H), "the scans run out of the picture box"
    return c.svg("Ausschnitte der Antwortzeilen mit rotem und grünem Rahmen"), labels


# ------------------------------------------------------------------------------------------ the grade table ---
# Leistungstest 1 BGY26, Teil A, 20 tests, key of HTML/svp/punktetabelle.html for Klassenstufe 11 (Note 1 from 19,
# 2 from 16, 3 from 13, 4 from 9, 5 from 5 of 20 BE). Three tables on one scale (Doc, 23.11.2026):
#   ONLINE  what was submitted online, without bonus - recomputed 23.11.2026, 19:40 from the submissions;
#   PAPIER  what the changed paper would have given - the paper points of the correction of the scanned sheets
#           (4 uncertain readings, counted as there); it does NOT count;
#   FINAL   online + bonus points (Teil B) - None until the bonus sheets are scanned again (24.11.), then the third
#           panel fills itself.
# BESSER / SCHLECHTER: grades better / worse on paper than online, compared test by test in Doc's private file
# lt1-bgy26-notenspiegel-papier.json (codes stay there, never here).
ONLINE = {1: 10, 2: 7, 3: 0, 4: 3, 5: 0, 6: 0}
PAPIER = {1: 14, 2: 4, 3: 1, 4: 1, 5: 0, 6: 0}
FINAL = None
STAND_ONLINE = "23.11., 19:40"
FINAL_FOLGT = "am 24.11."
UNSICHER = 4
BESSER, SCHLECHTER = 5, 0
SCHLUESSEL = "1 ab 19, 2 ab 16, 3 ab 13, 4 ab 9, 5 ab 5 von 20 BE"
GRADE_COL = {1: S.GREEN, 2: S.GREEN, 3: S.ORANGE, 4: S.ORANGE, 5: S.RED, 6: S.RED}


def schnitt(counts):
    """(mean as '1,80', the sum written out) - the sum of grades over the number of tests."""
    n = sum(counts.values())
    total = sum(g * k for g, k in counts.items())
    terms = " + ".join("%d · %d" % (k, g) for g, k in sorted(counts.items()) if k)
    return ("%.2f" % (total / float(n))).replace(".", ","), "(%s) / %d = %d / %d" % (terms, n, total, n)


assert sum(ONLINE.values()) == 20 and schnitt(ONLINE)[0] == "1,80"
assert sum(PAPIER.values()) == 20 and schnitt(PAPIER)[0] == "1,45"
assert FINAL is None or sum(FINAL.values()) == 20


def _panel(c, labels, x0, w, title, sub, counts, y_max, faint=False):
    """One grade table: a column per grade, its count on top, mean and n below. counts None = grey placeholder;
    faint = paler bars (the paper table, which does not count)."""
    top, h = 4, 322
    base, bar_h, band, bw = 252.0, 132.0, (w - 28) / 6.0, 20.0
    empty = counts is None
    if empty:
        c.raw('<rect x="%s" y="%d" width="%s" height="%d" rx="12" fill="#FFFFFF" fill-opacity=".4" stroke="%s"'
              ' stroke-width="1.2" stroke-dasharray="6 5"/>' % (fmt(x0), top, fmt(w), h, S.MUTED))
    else:
        c.rect(x0, top, w, h, fill=S.PAPER, stroke=S.INK, width=1, rx=12)
    ink = "var(--muted)" if empty else "var(--ink)"
    labels.append(lab(x0 + 14, top + 12, w - 28, title, 13, ink, None,
                      extra=";font-family:Orbitron,system-ui,sans-serif;font-weight:700"))
    labels.append(lab(x0 + 14, top + 50, w - 28, sub, 11.5, "var(--muted)", extra=";white-space:nowrap"))
    c.line(x0 + 14, base, x0 + w - 14, base, S.INK, 1, opacity=(.15 if empty else .3))
    for i, g in enumerate(range(1, 7)):
        cx = x0 + 14 + band * (i + .5)
        labels.append((cx, base + 16, 30, str(g), "font-size:14px;font-weight:700;color:%s" % ink))
        if empty:
            continue
        k = counts.get(g, 0)
        bh = k / float(y_max) * bar_h
        if k:
            x, t = cx - bw / 2, base - bh
            c.raw('<path d="M %s %s V %s Q %s %s %s %s H %s Q %s %s %s %s V %s Z" fill="%s"%s><title>Note %d: %d</title>'
                  '</path>' % (fmt(x), fmt(base), fmt(t + 4), fmt(x), fmt(t), fmt(x + 4), fmt(t), fmt(x + bw - 4),
                               fmt(x + bw), fmt(t), fmt(x + bw), fmt(t + 4), fmt(base), GRADE_COL[g],
                               ' fill-opacity=".6"' if faint else "", g, k))
        labels.append((cx, base - bh - 12, 34, str(k), "font-size:15px;font-weight:700;color:%s"
                       % ("var(--ink)" if k else "var(--muted)")))
    c.line(x0 + 14, top + 284, x0 + w - 14, top + 284, S.INK, 1, opacity=.12)
    if empty:
        labels.append((x0 + w / 2, 160, w - 28, "folgt", "font-size:20px;font-weight:700;"
                       "font-family:Orbitron,system-ui,sans-serif;letter-spacing:3px;color:var(--muted)"))
        labels.append((x0 + w / 2, 188, w - 28, FINAL_FOLGT, "font-size:14px;color:var(--muted)"))
        labels.append(lab(x0 + 14, top + 293, w - 28, "Ø folgt", 14, "var(--muted)"))
    else:
        labels.append(lab(x0 + 14, top + 293, w - 28, "Ø **%s**  ·  n = %d" % (schnitt(counts)[0], sum(counts.values())),
                          14, "var(--ink)"))


def notenspiegel(online=ONLINE, papier=PAPIER, final=FINAL):
    """Three grade tables side by side on one scale: without the changes (online), with them (paper), final."""
    c = S.Canvas(W, H)
    labels = []
    gap = 14.0
    w = (W - 2 * gap) / 3
    peak = max(v for t in (online, papier, final) if t for v in t.values())
    y_max = max(10, peak)
    _panel(c, labels, 0, w, "ohne Nachbessern<nl>(online)", "Teil A online · Stand %s" % STAND_ONLINE, online, y_max)
    _panel(c, labels, w + gap, w, "mit Nachbessern<nl>(Papier)", "Papier laut Korrektur · <c2>zählt nicht</c2>",
           papier, y_max, faint=True)
    _panel(c, labels, 2 * (w + gap), w, "final:<nl>online + Bonus", "online + Bonuspunkte" if final else
           "online + Bonuspunkte · folgt %s" % FINAL_FOLGT, final, y_max)
    return c.svg("Notenspiegel ohne Nachbessern (online), mit Nachbessern (Papier) und final"), labels


def notenspiegel_effekt():
    """The quiet line beside the title strokes: what the changes would have done."""
    worse = "keine schlechter" if not SCHLECHTER else "%d schlechter" % SCHLECHTER
    return "Hätte das nachgebesserte Papier gezählt: **%d Noten besser**, %s." % (BESSER, worse)


def notenspiegel_quelle(online=ONLINE, papier=PAPIER, final=FINAL):
    """The line under the picture box: how the means come about, the uncertain readings, the key."""
    short = lambda t: "%s = %s" % (schnitt(t)[1].split(" = ")[1], schnitt(t)[0])
    parts = ["Ø online %s" % short(online), "Ø Papier %s" % short(papier)]
    if final:
        parts.append("Ø final %s" % short(final))
    parts.append("Papier: %d unsichere Lesestellen, gewertet wie in der Korrektur" % UNSICHER)
    parts.append("Schlüssel 19/16/13/9/5 von 20 BE")
    return " · ".join(parts)


# ----------------------------------------------------------------------------- where the changes paid off ---
# Doc, 23.11.2026: "eine kleine Liste, wo das Verbessern auf dem Papier was gebracht hat - von welcher Note zu welcher
# Note". Every test whose paper grade would have been better than its online grade, from Doc's private file
# lt1-bgy26-notenspiegel-papier.json (codes stay there). Sheet letter only where the deck shows that sheet, else None
# ("ohne Bild"). (sheet, online points, paper points, what changed), sorted by the jump.
FAELLE = [
    ("A", 12, 19, "7 Fragen geändert"),
    ("B", 16, 20, "4 Fragen geändert"),
    (None, 17, 20, "3 Fragen geändert"),
    ("D", 18, 20, "2 Fragen geändert"),
    (None, 12, 13, "1 Frage, nur Striche (Grenzfall)"),
]
OHNE_WIRKUNG = [(16, 18), (16, 17)]          # more points on paper, same grade


def note(points):
    """The grade of Teil A on 20 BE (Klassenstufe 11)."""
    return next((n for t, n in ((19, 1), (16, 2), (13, 3), (9, 4), (5, 5)) if points >= t), 6)


def _check_faelle():
    jumps = [(note(o) - note(p), p - o) for _, o, p, _ in FAELLE]
    assert all(j > 0 for j, _ in jumps) and jumps == sorted(jumps, reverse=True), "sorted by the jump"
    assert len(FAELLE) == BESSER and SCHLECHTER == 0
    spiegel = dict(ONLINE)                   # online table, these tests moved to their paper grade = paper table
    for _, o, p, _ in FAELLE:
        spiegel[note(o)] -= 1
        spiegel[note(p)] += 1
    assert spiegel == PAPIER, spiegel
    assert all(note(o) == note(p) and p > o for o, p in OHNE_WIRKUNG)


_check_faelle()


PFEIL = ('<svg class="pfeil" viewBox="0 0 96 26" aria-hidden="true" style="color:var(--red)"><line x1="2" y1="13" '
         'x2="80" y2="13"/><path d="M 94 13 L 73 4 L 79 13 L 73 22 Z"/></svg>')   # deck.css svg.pfeil, here red
WORT = {1: "eine Note", 2: "zwei Noten", 3: "drei Noten", 4: "vier Noten", 5: "fünf Noten"}


def _mark(cx, cy, g, box):
    """The ? of deck.css (.pop-mark) in a table cell: a click opens the box with that id (deck.js), comes on click g."""
    return ('<p class="fl pop-mark step kommt" data-g="%d" data-pop="%s" style="left:%gpx;top:%gpx;width:26px;'
            'height:26px;font-size:15px">?</p>' % (g, box, cx - 13, cy - 13))


def _pop(box, title, parts):
    """A box of deck.css (.pop) with its x, a title and paragraphs - parts are HTML already (markup() or raw)."""
    from html_deck import markup
    return ('<div class="pop" id="%s" style="--pop-w:560px" hidden><button class="pop-x" aria-label="Schließen">×'
            '</button><h4>%s</h4>%s</div>' % (box, markup(title), "".join("<p>%s</p>" % x for x in parts)))


def wirkung():
    """A small table: Fall · online (counts) · paper, changed · jump. Paper and jump hide behind the deck's ?-boxes
    (Doc, 23.11.2026: "vielleicht auch auf dem Fragezeichen, dass man das zeigen kann"). Row by row: the row with its
    paper ?, then its jump ?. Returns (svg with the ? marks, labels, the boxes for the end of the section)."""
    from html_deck import markup
    c = S.Canvas(W, H)
    labels, marks, pops = [], [], []
    cols = [(0, 210), (210, 450), (450, 650), (650, W)]           # Fall | online | Papier | Sprung
    head_h, row_h, gap = 32.0, 44.0, 4.0
    c.rect(0, 0, W, head_h, fill=S.INK, rx=6)
    for (x0, x1), text, align in zip(cols, ("Fall", "online (zählt)", "Papier nachgebessert", "Sprung"),
                                     ("left", "center", "center", "center")):
        left = x0 + 16 if align == "left" else x0
        labels.append(lab(left, head_h / 2 - 7.7, (x1 - x0) - (16 if align == "left" else 0), text, 12, "#FFFFFF",
                          None, align, ";font-family:Orbitron,system-ui,sans-serif;font-weight:700;letter-spacing:.5px"))
    for i, (bogen, o, p, was) in enumerate(FAELLE):
        y = head_h + gap + i * (row_h + gap)
        mid = y + row_h / 2
        g_row, g_jump = 2 * i, 2 * i + 1
        _g(c, g_row)
        c.rect(0, y, W, row_h, fill=S.PAPER, stroke=CARD_EDGE, width=1, rx=6)
        _end(c)
        labels.append(lab(16, mid - 8.3, 70, "Fall %d" % (i + 1), 13, "var(--ink)", g_row,
                          extra=";font-family:Orbitron,system-ui,sans-serif;font-weight:700"))
        labels.append(lab(90, mid - 7.7, 116, "Bogen " + bogen if bogen else "ohne Bild", 12,
                          "var(--body)" if bogen else "var(--muted)", g_row))
        labels.append(lab(cols[1][0], mid - 10.2, cols[1][1] - cols[1][0], "**%d** Punkte  ·  Note **%d**"
                          % (o, note(o)), 16, "var(--body)", g_row, "center"))
        box_p, box_s = "lt1-papier-%d" % (i + 1), "lt1-sprung-%d" % (i + 1)
        marks.append(_mark((cols[2][0] + cols[2][1]) / 2.0, mid, g_row, box_p))
        marks.append(_mark((cols[3][0] + cols[3][1]) / 2.0, mid, g_jump, box_s))
        sheet = "Bogen " + bogen if bogen else "ohne Bild im Deck"
        pops.append(_pop(box_p, "Fall %d · Papier nachgebessert" % (i + 1), [
            markup("<z7>**%d** Punkte  ·  Note **%d**</z7>" % (p, note(p))),
            markup("%s · %s" % (was, sheet)),
            markup("Online abgegeben: **%d** Punkte, Note\u00a0**%d** – das zählt." % (o, note(o)))]))
        pops.append(_pop(box_s, "Fall %d · Sprung" % (i + 1), [
            '<span class="z8">%s%s<span class="c2">%s</span></span>'
            % (markup("Note **%d**" % note(o)), PFEIL, markup("Note **%d**" % note(p))),
            markup("%s besser, hätte das Papier gezählt – gewertet wird online: Note\u00a0**%d**."
                   % (WORT[note(o) - note(p)][0].upper() + WORT[note(o) - note(p)][1:], note(o)))]))
    n = len(FAELLE)
    labels.append(lab(0, head_h + gap + n * (row_h + gap) + 6, W, "Ohne Notenwirkung, aber mehr Punkte: %d Bögen (%s)"
                      % (len(OHNE_WIRKUNG), ", ".join("%d → %d" % x for x in OHNE_WIRKUNG)), 13, "var(--muted)", 2 * n))
    svg = c.svg("Tabelle: wo das Nachbessern auf dem Papier die Note verändert hätte")
    return svg + "".join(marks), labels, "".join(pops)


FIGURES = {
    "ablauf": ablauf,
    "beispiel_a": lambda: beispiel(["a01", "a02", "a12", "a19"]),
    "beispiel_b": lambda: beispiel(["b09", "b11", "b15"]),
    "beispiel_d": lambda: beispiel(["d05", "d13"]),
    "neu": neu,
    "notenspiegel": notenspiegel,
    "wirkung": lambda: wirkung()[:2],
}

def notenspiegel_section():
    """The whole slide 9 as the deck holds it - to paste over the old one once FINAL is filled in, if the deck has
    been edited in the browser by then (otherwise simply run the build script again)."""
    from html_deck import figure_label, markup
    svg, labels = notenspiegel()
    return ('<section class="slide content"><h3>%s</h3><div class="rules"></div><p class="h3-unter">%s</p>'
            '<div class="pic">%s%s</div><p class="fig-source">%s</p><p class="foot">Nicht verzagen, Doc Alvers fragen!'
            '</p><p class="pageno"></p></section>'
            % (markup("Notenspiegel: online · Papier · final"), markup(notenspiegel_effekt()), svg,
               "".join(figure_label(x) for x in labels), markup(notenspiegel_quelle())))


if __name__ == "__main__":
    if sys.argv[1:] == ["notenspiegel-folie"]:
        print(notenspiegel_section())
    elif len(sys.argv) > 1:
        print(FIGURES[sys.argv[1]]()[0])
    else:
        for name in list(FIGURES) + ["notenspiegel-folie"]:
            print(name)

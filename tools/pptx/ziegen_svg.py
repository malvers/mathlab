#!/usr/bin/env python3
"""The Ziegenproblem (Monty Hall) as one deck slide - drawn with svgfig, words as HTML labels.

    python3 tools/pptx/ziegen_svg.py          # prints the <section> markup

Doc, 02.10.2026: "Und noch eine Folie Ziegenproblem!" - after the slide on Marilyn vos Savant, in today's deck
and in the Vorrechnen deck. The three columns are the three equally likely places of the car; you always pick
door 1, the host (who knows) opens a goat door; the two rows below show what staying and switching win.
The canvas is the picture box of a content slide, 816 x 330 (deck.css .pic); labels use the same coordinates.
Car and goat are Apple's emoji from iamcal's emoji-data, as everywhere else on the site.
"""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "aufgaben"))
import svgfig as S

W, H = 816, 330
EMOJI = "https://cdn.jsdelivr.net/gh/iamcal/emoji-data@master/img-apple-160/%s.png"
CAR, GOAT = "1f697", "1f410"
COLS = (136, 408, 680)                      # column centres
HEAD_TOP = 54                               # "Auto hinter Tür k"
DOOR_W, DOOR_H, DOOR_TOP, DOOR_GAP = 58, 80, 82, 76
ROWS = (("Bleiben", 216), ("Wechseln", 260))
RESULT_TOP, SOURCE_TOP = 298, 338           # the source under the canvas, just above the footer
INK_CSS = "color:#0E244E"


def tex(s):
    return '<span class="tex" data-tex="%s"></span>' % S.esc(s)


def label(x, top, w, html, css="", g=None):
    """One word or line over the figure, centred on x, its top at `top` (the deck editor's text);
    with g it belongs to that click (a ghost step, see below)."""
    step = ' step ghost" data-g="%d' % g if g is not None else ""
    return '<p class="fl%s" style="left:%gpx;top:%gpx;width:%gpx%s">%s</p>' % (
        step, x - w / 2, top, w, ";" + css if css else "", html)


def emoji(c, code, x, y, size):
    c.raw('<image href="%s" x="%s" y="%s" width="%s" height="%s"/>'
          % (EMOJI % code, S.fmt(x - size / 2), S.fmt(y - size / 2), size, size))


def check(c, x, y, ok):
    """A green tick or a red cross beside a result."""
    if ok:
        c.path("M %s %s L %s %s L %s %s" % (x - 7, y, x - 2, y + 5, x + 8, y - 6), stroke=S.GREEN, width=3)
    else:
        c.line(x - 6, y - 6, x + 6, y + 6, color=S.RED, width=3)
        c.line(x - 6, y + 6, x + 6, y - 6, color=S.RED, width=3)


def ziegen():
    c = S.Canvas(W, H)
    words = [label(W / 2, 0, W,
                   "Drei Türen: hinter einer ein Auto, hinter zwei je eine Ziege. Du wählst Tür 1. Der Moderator "
                   "weiß, wo das Auto steht, und öffnet eine <b>andere</b> Tür mit Ziege. Bleiben oder wechseln?",
                   "font-size:14px;line-height:1.3;color:#2C3C60")]
    for x in (272, 544):
        c.line(x, HEAD_TOP - 4, x, ROWS[-1][1] + 18, color="#DCE4F0", width=1)
    # the first case stands from the start; the other two, then the two results come one click each, faint and
    # grey until then (Doc, 03.10.2026: "am Anfang ganz schwach grau zu sehen ... beide sollen animiert kommen")
    for k, cx in enumerate(COLS):
        car = k                                   # the car stands behind door k + 1
        opened = 2 if car in (0, 1) else 1        # the host's goat door (with the car behind 1 he could also take 2)
        g = k - 1 if k else None
        if g is not None:
            c.raw('<g class="step ghost" data-g="%d">' % g)
        words.append(label(cx, HEAD_TOP, 250, "Auto hinter Tür %d · %s" % (car + 1, tex(r"\tfrac{1}{3}")),
                           "font-size:14px;font-weight:600;" + INK_CSS, g))
        for j in range(3):
            dx = cx + (j - 1) * DOOR_GAP
            if j == 0:
                c.rect(dx - DOOR_W / 2, DOOR_TOP, DOOR_W, DOOR_H, fill="#F4F7FC", stroke=S.ORANGE, width=3, rx=6)
            elif j == opened:
                c.rect(dx - DOOR_W / 2, DOOR_TOP, DOOR_W, DOOR_H, fill="#FFFFFF", stroke=S.RED, width=2, rx=6)
                c.raw('<rect x="%s" y="%s" width="%s" height="%s" rx="6" fill="none" stroke="%s" stroke-width="2"'
                      ' stroke-dasharray="5 4"/>' % (S.fmt(dx - DOOR_W / 2 + 4), DOOR_TOP + 4, DOOR_W - 8,
                                                    DOOR_H - 8, S.RED))
            else:
                c.rect(dx - DOOR_W / 2, DOOR_TOP, DOOR_W, DOOR_H, fill="#F4F7FC", stroke=S.INK, width=1.2, rx=6)
            emoji(c, CAR if j == car else GOAT, dx, DOOR_TOP + 46, 40)
            words.append(label(dx, DOOR_TOP + 3, 40, str(j + 1), "font-size:11px;font-weight:600", g))
        # what happens under the doors: your pick, the host's door
        for j, text, colour in ((0, "deine Wahl", S.ORANGE), (opened, "Moderator öffnet", S.RED)):
            dx = cx + (j - 1) * DOOR_GAP
            tip = DOOR_TOP + DOOR_H + 5
            c.poly([(dx - 6, tip + 7), (dx + 6, tip + 7), (dx, tip)], stroke=colour, fill=colour, width=1)
            words.append(label(dx, tip + 10, 84, text, "font-size:10.5px;line-height:1.15" +
                               (";color:#B02418" if colour == S.RED else ""), g))
        # the two strategies
        switch_to = 3 - opened                     # the door that is still closed besides yours (0-based: 1 or 2)
        for (name, y), door in zip(ROWS, (0, switch_to)):
            win = door == car
            c.rect(cx - 112, y - 16, 224, 32, fill=S.GREEN if win else S.RED, rx=8, opacity=0.13)
            words.append(label(cx - 52, y - 9, 96, name, "font-size:14px;text-align:right;color:#2C3C60", g))
            emoji(c, CAR if win else GOAT, cx + 26, y, 26)
            check(c, cx + 62, y, win)
        if g is not None:
            c.raw('</g>')
    words.append(label(240, RESULT_TOP, 400, "Bleiben gewinnt in <b>1</b> von 3 Fällen: " + tex(r"\tfrac{1}{3}"),
                       "font-size:16px;" + INK_CSS, 2))
    words.append(label(576, RESULT_TOP, 400, "Wechseln gewinnt in <b>2</b> von 3 Fällen: " + tex(r"\tfrac{2}{3}"),
                       "font-size:16px;font-weight:600;" + INK_CSS, 3))
    words.append(label(W / 2, SOURCE_TOP, W,
                       "Leserfrage von Craig F. Whitaker an „Ask Marilyn“, Parade, 9. September 1990 · "
                       '<a href="https://en.wikipedia.org/wiki/Monty_Hall_problem" target="_blank" rel="noopener">'
                       "Wikipedia: Monty Hall problem</a>", "font-size:10px"))
    svg = c.svg("Ziegenproblem: drei gleich wahrscheinliche Fälle; Bleiben gewinnt einmal, Wechseln zweimal")
    return svg, words


def slide():
    svg, words = ziegen()
    return ('<section class="slide content"><h3>Ziegenproblem: bleiben oder wechseln?</h3><div class="rules"></div>'
            '<div class="pic">%s%s</div><p class="foot">Nicht verzagen, Doc Alvers fragen!</p>'
            '<p class="pageno"></p></section>' % (svg, "".join(words)))


if __name__ == "__main__":
    print(slide())

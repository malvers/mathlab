#!/usr/bin/env python3
"""Figures of the deck "Wie viele Noten muss ich geben?" (school year 2026/27) as SVG - drawn with svgfig.

    python3 tools/pptx/noten_soll_svg.py drei     # prints the <svg> markup

Same contract as ai_svg.py (Doc, 23.09.2026: drawn figures in HTML, never a PNG): each figure returns
(svg, labels) - shapes as SVG, every word as an HTML label <p class="fl"> the deck editor can change.
The canvas is the picture box of a content slide, 816 x 330 design pixels.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "aufgaben"))
import svgfig as S

W, H = 816, 330
TINT = "#EEF2F8"          # card ground, the head fill of svgfig tables
HEAD = "font-family:Orbitron,sans-serif"
LEFT = "text-align:left"


def css(size, color=S.BODY, extra=""):
    return "font-size:%gpx;color:%s%s" % (size, color, ";" + extra if extra else "")


def left(x, y, w, text, style):
    """A left-aligned label whose box starts at x (labels are given by their centre)."""
    return (x + w / 2, y, w, text, style + ";" + LEFT)


def drei():
    """Three numbers that must not be mixed up: dates to plan, grades to enter, pupils who get them."""
    c, labels = S.Canvas(W, H), []
    gap = 24
    widths = (236, 312, 220)        # the middle number is the longest - its card gets the room
    cards = [(S.RED, "61–77", "Leistungs­erhebungen", "Termine, die ich planen muss – je Lerngruppe einer",
              "1. Hj 33–41 · 2. Hj 28–36"),
             (S.GREEN, "1.309–1.633", "Noten", "was ich eintragen muss – jede Erhebung gibt jedem Schüler eine",
              "1. Hj 712–874 · 2. Hj 597–759"),
             (S.ORANGE, "237", "Noten­empfänger", "Schüler mal Kurs – 216 Köpfe, BGY26 zählt doppelt",
              "Mathe 11 und Info 11")]
    x = 0
    for i, (color, big, head, text, note) in enumerate(cards):
        cw = widths[i]
        c.rect(x, 8, cw, 314, fill=TINT, rx=14)
        c.circle(x + 40, 48, r=14, fill=color, stroke=color)
        labels += [left(x + 24, 112, cw - 48, big, css(30, S.INK, HEAD + ";font-weight:700;white-space:nowrap")),
                   left(x + 24, 160, cw - 48, head, css(19, S.INK, "font-weight:600")),
                   left(x + 24, 218, cw - 48, text, css(15, S.BODY)),
                   left(x + 24, 292, cw - 48, note, css(13, S.MUTED))]
        x += cw + gap
    return c.svg("61 bis 77 Leistungserhebungen, 1.309 bis 1.633 Noten, 237 Notenempfänger"), labels


def voraussetzungen():
    """The rules behind the numbers: per course what is required each half-year, and who decided it."""
    c, labels = S.Canvas(W, H), []
    x1, w1, x2, w2, x3, w3 = 12, 178, 202, 352, 570, 246
    head = css(11.5, S.MUTED, HEAD + ";letter-spacing:.06em")
    labels += [left(x1, 12, w1, "KURS", head), left(x2, 12, w2, "PFLICHT JE HALBJAHR", head),
               left(x3, 12, w3, "BESCHLOSSEN VON", head)]
    rows = [("Mathe 11", "BGY 11 · Kernfach", "**2 Klassenarbeiten** + 3–5 sonstige Noten",
             "Schule BGY · Übersicht „Bewertungen“"),
            ("Info 11", "BGY 11", "**1 Klassenarbeit** + 2–4 sonstige Noten",
             "Schule BGY · Übersicht „Bewertungen“"),
            ("Info 12 · 13", "BGY · Grundkurs", "**mind. 1 Klausur** + 2–4 sonstige Noten · "
             "komplexe Leistung nur zusätzlich", "BGySO 2024 · Mail der Schulleitung BGY vom 29.10.2026"),
            ("Info FO 12", "FOS 12", "**1. Hj 3 Noten, 2. Hj 2 Noten**, je mind. 1 Klassenarbeit (zählt doppelt)",
             "Schule FOS · Übersicht „Fachoberschule – Notengebung“"),
            ("Info 9a · 9b", "Oberschule", "keine Klassenarbeit, **mind. 2 kleine Noten** · "
             "Jahresnote mind. 3 Nachweise", "Fachschaft Informatik 12.08.2026 · Grundsätze des Lehrbetriebs")]
    top, rh = 30, 59
    for i, (kurs, art, pflicht, wer) in enumerate(rows):
        y = top + i * rh
        if i % 2 == 0:
            c.rect(0, y, W, rh - 3, fill=TINT, rx=8)
        cy = y + (rh - 3) / 2
        labels += [left(x1, cy - 9, w1, kurs, css(16, S.INK, "font-weight:700")),
                   left(x1, cy + 11, w1, art, css(12, S.MUTED)),
                   left(x2, cy, w2, pflicht, css(14.5, S.BODY)),
                   left(x3, cy, w3, wer, css(12.5, S.MUTED))]
    return c.svg("Pflicht je Kurs und Halbjahr und wer sie beschlossen hat"), labels


def beispiel():
    """One Klassenarbeit, 21 pupils, 21 grades - the difference between a date and a grade."""
    c, labels = S.Canvas(W, H), []
    c.rect(0, 40, 250, 250, fill=TINT, rx=14)
    c.circle(125, 120, r=46, fill=S.RED, stroke=S.RED)
    labels += [(125, 120, 92, "1", css(44, "#FFFFFF", HEAD + ";font-weight:700")),
               (125, 200, 220, "Leistungs­erhebung", css(19, S.INK, "font-weight:600")),
               (125, 246, 220, "Mathe-Klassenarbeit BGY26 am Mo 09.11.", css(14, S.BODY))]
    c.arrow(272, 165, 362, 165, color=S.MUTED, width=2.2)
    # 21 dots = 21 pupils, 7 x 3
    x0, y0, step = 400, 72, 46
    for k in range(21):
        cx, cy = x0 + (k % 7) * step, y0 + (k // 7) * step
        c.circle(cx, cy, r=15, fill=S.GREEN, stroke=S.GREEN)
    labels += [left(x0 - 16, 228, 420, "21 Noten", css(30, S.INK, HEAD + ";font-weight:700")),
               left(x0 - 16, 272, 420, "eine für jeden Schüler der Lerngruppe", css(16, S.BODY))]
    return c.svg("Eine Leistungserhebung, 21 Schüler, 21 Noten"), labels


if __name__ == "__main__":
    print({"drei": drei, "beispiel": beispiel}[sys.argv[1]]()[0])

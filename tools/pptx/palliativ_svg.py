#!/usr/bin/env python3
"""The palliative care deck's figures as SVG - drawn with svgfig, embedded inline in the deck.

    python3 tools/pptx/palliativ_svg.py stufen     # prints the <svg> markup

Same contract as ai_svg.py (Doc, 23.09.2026: drawn figures in HTML, never a PNG): each figure returns
(svg, labels) - shapes and bars as SVG, every word as an HTML label <p class="fl"> the deck editor can
change. The canvas is the picture box of a content slide, 816 x 330 design pixels.

The numbers are Ute Hartenstein's, from her talk "Die zunehmende Bedeutung der geriatrischen
Palliativversorgung" (03.09.2024); the bar lengths are computed from them here.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "aufgaben"))
import svgfig as S
from ai_svg import text_width

W, H = 816, 330
TINT = "#EEF2F8"          # card ground, the head fill of svgfig tables
TINT2 = "#DCE4F0"         # one step darker, the grid colour of svgfig plots
HEAD = "font-family:Orbitron,sans-serif"
LEFT = "text-align:left"


def css(size, color=S.BODY, extra=""):
    return "font-size:%gpx;color:%s%s" % (size, color, ";" + extra if extra else "")


def left(x, y, w, text, style):
    """A left-aligned label whose box starts at x (labels are given by their centre)."""
    return (x + w / 2, y, w, text, style + ";" + LEFT)


def arrow_glyph(c, cx, cy, up, color="#FFFFFF"):
    """A trend arrow inside a circle: up and to the right, or down and to the right."""
    d = 1 if up else -1
    c.path("M %g %g L %g %g L %g %g L %g %g" % (cx - 13, cy + 7 * d, cx - 4, cy - 2 * d, cx + 2, cy + 4 * d,
                                                 cx + 12, cy - 7 * d), stroke=color, width=3)
    c.path("M %g %g L %g %g L %g %g" % (cx + 4, cy - 8 * d, cx + 12, cy - 7 * d, cx + 12, cy + 1 * d),
           stroke=color, width=3)


def zahl():
    """(Nur) eine Zahl: 26.615 people over 100, three short facts beside it."""
    c, labels = S.Canvas(W, H), []
    labels += [
        left(0, 112, 400, "26.615", css(78, S.INK, HEAD + ";font-weight:700")),
        left(0, 196, 380, "Menschen in Deutschland sind über 100 Jahre alt", css(21, S.BODY)),
        left(0, 262, 380, "Stand: Ende 2023", css(13, S.MUTED)),
    ]
    c.rect(440, 8, 376, 314, fill=TINT, rx=14)
    facts = [("4×", S.RED, "4 × mehr Frauen als Männer", "unter den über 100-Jährigen"),
             (None, S.GREEN, "Tendenz steigend", "Jahr für Jahr mehr Hundertjährige"),
             ("80+", S.INK, "Auch die über 80-Jährigen", "werden seit Jahren mehr")]
    for i, (glyph, color, head, sub) in enumerate(facts):
        cy = 64 + i * 101
        c.circle(494, cy, r=28, fill=color, stroke=color)
        if glyph:
            labels.append((494, cy, 56, glyph, css(16, "#FFFFFF", HEAD + ";font-weight:700")))
        else:
            arrow_glyph(c, 494, cy, up=True)
        labels += [left(540, cy - 12, 260, head, css(17, S.INK, "font-weight:600")),
                   left(540, cy + 13, 260, sub, css(14, S.BODY))]
    return c.svg("26.615 Menschen in Deutschland über 100 Jahre"), labels


def herausforderungen():
    """Fewer carers and doctors - more old, multimorbid people. The open question in the middle."""
    c, labels = S.Canvas(W, H), []
    cw = 350
    sides = [(0, S.INK, False, "Immer weniger",
              ["Pflegende in Krankenhäusern, Seniorenheimen und in der ambulanten Pflege",
               "(Haus-)Ärztinnen und Ärzte"]),
             (W - cw, S.RED, True, "Immer mehr",
              ["(multi-)morbide und (hoch)betagte Menschen, die Versorgung brauchen"])]
    for x, color, up, head, items in sides:
        c.rect(x, 8, cw, 314, fill=TINT, rx=14)
        c.circle(x + 54, 62, r=28, fill=color, stroke=color)
        arrow_glyph(c, x + 54, 62, up=up)
        labels.append(left(x + 30, 126, cw - 60, head, css(24, S.INK, HEAD)))
        y = 178
        for t in items:
            labels.append(left(x + 30, y, cw - 60, t, css(17, S.BODY)))
            lines = -(-text_width(t, 17) // (cw - 60))      # ceil: how many lines the label wraps to
            y += lines * 17 * 1.28 + 16
    c.circle(W / 2, 165, r=38, fill=S.ORANGE, stroke=S.ORANGE)
    labels.append((W / 2, 165, 76, "?", css(40, S.INK, HEAD + ";font-weight:700")))
    return c.svg("Herausforderungen: immer weniger Pflegende und Ärzte, immer mehr Versorgungsbedürftige"), labels


def praxis():
    """The practice 2024 against 2012: four tiles, each with its number and the two years as bars."""
    c, labels = S.Canvas(W, H), []
    labels.append(left(0, 10, 600, "2024 im Vergleich zu 2012 (Praxisübernahme)", css(15, S.MUTED)))
    # (big number, label, 2012 value, 2024 value, bars are shares of 100 % unless relative, note)
    tiles = [("+66 %", "Patient:innen", 1.00, 1.66, True, "insgesamt · 2012: 844"),
             ("64 %", "Rentner:innen", 60, 64, False, "2012: 60 %"),
             ("53 %", "über 70 Jahre", 46, 53, False, "2012: 46 %"),
             ("15 %", "mit Hausbesuch", 10, 15, False, "ca. 200–300 pro Quartal · 2012: < 10 %")]
    gap, tw, ty, th = 20, (W - 3 * 20) / 4, 34, 222
    bar_x, bar_w = 44, tw - 44 - 18
    for i, (big, lab, old, new, rel, note) in enumerate(tiles):
        x = i * (tw + gap)
        c.rect(x, ty, tw, th, fill=TINT, rx=12)
        labels += [left(x + 18, ty + 42, tw - 36, big, css(32, S.INK, HEAD + ";font-weight:700")),
                   left(x + 18, ty + 86, tw - 36, lab, css(15, S.INK, "font-weight:600"))]
        top = max(old, new) if rel else 100.0
        for k, (year, v, color) in enumerate((("2012", old, S.MUTED), ("2024", new, S.RED))):
            by = ty + 118 + k * 24
            c.rect(x + bar_x, by, bar_w, 12, fill="#FFFFFF", rx=3)
            c.rect(x + bar_x, by, bar_w * v / top, 12, fill=color, rx=3)   # "< 10 %" drawn at 10, the note says "<"
            labels.append(left(x + 14, by + 6, 30, year, css(10.5, S.MUTED)))
        labels.append(left(x + 18, ty + 190, tw - 36, note, css(12, S.MUTED)))
    labels += [left(0, 284, W, "**Team:** 3 nichtärztliche Mitarbeiterinnen (Quereinsteigerinnen) · "
                    "3 ärztliche Mitarbeiter:innen (Teilzeit) · 1 MFA-Azubi", css(14, S.BODY)),
               left(0, 310, W, "**Hausbesuche im Team** bei geriatrischen und palliativen Patient:innen "
                    "an 4 Tagen pro Woche", css(14, S.BODY))]
    return c.svg("Hausärztliche Praxis 2024 im Vergleich zu 2012"), labels


def stufen():
    """AAPV, BQKPMV, SAPV as three rising steps, the share of palliative need underneath."""
    c, labels = S.Canvas(W, H), []
    gap = 16
    sw = (W - 2 * gap) / 3
    base = 262
    steps = [(168, TINT, S.INK, S.BODY, "AAPV", "Palliative Primärversorgung",
              "§ 27 SGB V · Abrechnung über EBM · Zulassung als Ärztin/Arzt"),
             (212, TINT2, S.INK, S.BODY, "BQKPMV", "Besonders qualifizierte und koordinierte palliativmedizinische Versorgung",
              "§ 87 Abs. 1b SGB V · Anlage 30 BMV-Ä · z. B. 40-h-Kurs, 8 h Fortbildung pro Jahr, BtM-Rezepte"),
             (256, S.INK, "#FFFFFF", "#DCE4F0", "SAPV", "Spezialisierte ambulante Palliativversorgung",
              "§ 37b SGB V · Abrechnung mit den Krankenkassen · Bundesrahmenvertrag: Kernteam, "
              "Zusatzbezeichnung Palliativmedizin, Teamleistung")]
    for i, (h, fill, fg, body, name, sub, det) in enumerate(steps):
        x, y = i * (sw + gap), base - h
        c.rect(x, y, sw, h, fill=fill, rx=12)
        c.circle(x + 32, y + 32, r=16, fill=S.ORANGE, stroke=S.ORANGE)
        labels += [(x + 32, y + 32, 32, str(i + 1), css(15, S.INK, HEAD + ";font-weight:700")),
                   left(x + 58, y + 32, sw - 76, name, css(20, fg, HEAD + ";font-weight:700")),
                   left(x + 18, y + 80, sw - 36, sub, css(13.5, fg, "font-weight:600")),
                   left(x + 18, y + 132, sw - 36, det, css(12, body))]
    ly = base + 16
    c.line(0, ly, 2 * sw + gap, ly, color=S.RED, width=2)
    c.line(2 * (sw + gap), ly, W, ly, color=S.RED, width=2)
    labels += [left(0, ly + 20, 2 * sw + gap, "**85–90 %** des palliativen Bedarfs: allgemeine ambulante "
                    "Palliativversorgung", css(14, S.BODY)),
               left(2 * (sw + gap), ly + 20, sw, "**10–15 %** spezialisiert", css(14, S.BODY))]
    return c.svg("Gestufte ambulante Palliativversorgung: AAPV, BQKPMV, SAPV"), labels


if __name__ == "__main__":
    print(globals()[sys.argv[1] if len(sys.argv) > 1 else "stufen"]()[0])

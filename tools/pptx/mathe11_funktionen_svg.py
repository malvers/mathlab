#!/usr/bin/env python3
"""The figures of the deck mathe11-funktionen (Der Funktionsbegriff) - drawn with svgfig, inline SVG.

    python3 tools/pptx/mathe11_funktionen_svg.py            # lists the figures
    python3 tools/pptx/mathe11_funktionen_svg.py nullstellen  # prints one <svg>

Doc, 28.09.2026: "Mach hier bitte noch sinnvolle Abbildungen rein" - and: "Nicht neu erzeugen mit Script!"
So this file only DRAWS; the SVGs go straight into the existing slides of HTML/decks/mathe11-funktionen.html
(the deck HTML is the source, the build script was only initial). Each figure sits in the .below box under
the four bullets of its slide (class has-below): about 816 x 180 design pixels. The figures carry maths only -
formulas, coordinates, axis names - and no words, so nothing in them needs the deck editor.
Colours: ink for the curves, red for what the slide asks for (a zero, the second hit), green for what is fine,
orange for a range on an axis.
"""
import math
import os
import re
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "aufgaben"))
import svgfig as S

H = 180          # height of the .below box under four bullet lines (measured in the deck)
FS = 15          # formula size


def tex(s):
    """A tiny TeX subset as SVG text content: x^2, x^{-1}, 2^x, - as a real minus, \\sqrt{5}, \\mid."""
    s = s.replace("\\mid", "|").replace("\\pi", "π").replace("\\cdot", "·")
    s = re.sub(r"\\sqrt\{([^}]*)\}", "√\\1", s)
    s = re.sub(r"(?<![\w)])-|(?<=[ (=])-|^-", "−", s)
    s = s.replace(" - ", " − ")
    out, i = [], 0
    for m in re.finditer(r"\^(\{[^}]*\}|.)", s):
        out.append(S.esc(s[i:m.start()]))
        exp = m.group(1).strip("{}")
        out.append('<tspan baseline-shift="super" font-size="68%%">%s</tspan>' % S.esc(exp))
        i = m.end()
    out.append(S.esc(s[i:]))
    return "".join(out)


def formula(c, x, y, s, size=FS, color=S.INK, anchor="middle", halo=True):
    """A formula label in the textbook serif (italic), with real superscripts."""
    c.raw('<text x="%s" y="%s" font-family="%s" font-style="italic" font-size="%s" fill="%s" text-anchor="%s"%s>%s</text>'
          % (S.fmt(x), S.fmt(y), S.MATH, size, color, anchor,
             ' stroke="%s" stroke-width="4" paint-order="stroke" stroke-linejoin="round"' % S.PAPER if halo else "",
             tex(s)))


def plot(xlim, ylim, w, h=H, xstep=1, ystep=1, pad=(34, 22, 14, 24), grid=True, gstep=None, **ax):
    """A coordinate system for the flat box. The y tick -1 stays unlabelled by default: at about 20 px per
    unit its number would sit on the O of the origin."""
    p = S.Plot(xlim, ylim, w=w, h=h, pad=pad)
    if grid:
        p.grid(*(gstep or (xstep, ystep)))
    ax.setdefault("skip_y", (0, -1))
    p.axes(xstep, ystep, defer_labels=True, **ax)
    return p


def dot(p, u, v, color=S.RED, r=4.2):
    p.circle(p.X(u), p.Y(v), r, color)


def ring(p, u, v, color=S.RED, r=4.2):
    """An open point - the value that is left out."""
    p.circle(p.X(u), p.Y(v), r, S.PAPER, color, 1.8)


def check(c, x, y, s=14, color=S.GREEN):
    c.path("M %s %s L %s %s L %s %s" % (S.fmt(x - s * .5), S.fmt(y), S.fmt(x - s * .12), S.fmt(y + s * .4),
                                        S.fmt(x + s * .55), S.fmt(y - s * .45)), color, 3.2)


def cross(c, x, y, s=12, color=S.RED):
    c.line(x - s / 2, y - s / 2, x + s / 2, y + s / 2, color, 3.2)
    c.line(x - s / 2, y + s / 2, x + s / 2, y - s / 2, color, 3.2)


def band_x(p, a, b, color=S.ORANGE):
    """A range on the x-axis, drawn as a thick band on the axis."""
    p.line(p.X(a), p.Y(0), p.X(b), p.Y(0), color, 7, cap="butt", opacity=0.75)


def band_y(p, a, b, color=S.GREEN):
    p.line(p.X(0), p.Y(a), p.X(0), p.Y(b), color, 7, cap="butt", opacity=0.75)


def side(*plots, gap=40):
    return S.panel(list(plots), gap=gap)


# ------------------------------------------------------------------ figures ---
def zuordnung():
    """Slide 'Die Bedingung': arrows from x to y - two x may share a y, one x may not have two."""
    def oval(c, cx, cy, rx, ry):
        c.path("M %s %s A %s %s 0 1 0 %s %s A %s %s 0 1 0 %s %s Z"
               % (S.fmt(cx - rx), S.fmt(cy), rx, ry, S.fmt(cx + rx), S.fmt(cy), rx, ry, S.fmt(cx - rx), S.fmt(cy)),
               S.INK, 1.6, fill="#F4F7FC")

    def mapping(c, xs, ys, arrows, bad):
        lx, rx_ = 70, 250
        oval(c, lx, 96, 38, 70)
        oval(c, rx_, 96, 38, 70)
        formula(c, lx, 16, "x", 16, halo=False)
        formula(c, rx_, 16, "y", 16, halo=False)
        pos = {}
        for side_, items, x in (("x", xs, lx), ("y", ys, rx_)):
            n = len(items)
            for k, v in enumerate(items):
                y = 96 + (k - (n - 1) / 2.0) * 44
                pos[(side_, v)] = (x, y)
                formula(c, x, y + 5, v, 16, halo=False)
        for a, b in arrows:
            (x1, y1), (x2, y2) = pos[("x", a)], pos[("y", b)]
            color = S.RED if (a, b) in bad else S.GREEN
            c.arrow(x1 + 16, y1, x2 - 18, y2, color, 2.0)

    left = S.Canvas(330, H)
    mapping(left, ["-2", "0", "2"], ["5", "1"], [("-2", "5"), ("2", "5"), ("0", "1")], ())
    check(left, 316, 30)
    right = S.Canvas(330, H)
    mapping(right, ["4", "9"], ["2", "-2", "3"], [("4", "2"), ("4", "-2"), ("9", "3")], {("4", "2"), ("4", "-2")})
    cross(right, 316, 30)
    return side(left, right, gap=90)


def senkrechte():
    """Slide 'Wann es keine Funktion ist': a vertical line meets a parabola once, the relation y^2 = x twice."""
    a = plot((-3, 3), (-2, 5), 330, ystep=1)
    a.curve(lambda x: x * x - 1, -3, 3, S.INK)
    a.seg((1.5, -2), (1.5, 5), S.MUTED, 1.6, dash="6 5")
    dot(a, 1.5, 1.25, S.GREEN)
    formula(a, a.X(-1.25), a.Y(3.9), "y = x^2 - 1")
    check(a, a.X(2.55), a.Y(4.2))
    a.draw_labels()
    b = plot((-1, 6), (-3, 3), 330, ystep=1)
    b.curve(lambda x: math.sqrt(x), 0, 6, S.INK)
    b.curve(lambda x: -math.sqrt(x), 0, 6, S.INK)
    b.seg((4, -3), (4, 3), S.MUTED, 1.6, dash="6 5")
    dot(b, 4, 2)
    dot(b, 4, -2)
    formula(b, b.X(4) - 10, b.Y(2) - 9, "(4 \\mid 2)", 14, anchor="end")
    formula(b, b.X(4) - 10, b.Y(-2) + 19, "(4 \\mid -2)", 14, anchor="end")
    formula(b, b.X(1.5), b.Y(2.35), "y^2 = x")
    cross(b, b.X(5.55), b.Y(2.55))
    b.draw_labels()
    return side(a, b)


def definitionsbereich():
    """Slide 'Definitionsbereich': 1/(x-4) has a gap at 4, sqrt(x-3) starts at 3."""
    a = plot((-1, 9), (-3, 3), 350, ystep=1)
    band_x(a, -1, 3.93)
    band_x(a, 4.07, 9)
    a.seg((4, -3), (4, 3), S.RED, 1.4, dash="5 5")
    a.curve(lambda x: 1 / (x - 4), -1, 3.97, S.INK)
    a.curve(lambda x: 1 / (x - 4), 4.03, 9, S.INK)
    ring(a, 4, 0)
    formula(a, a.X(6.6), a.Y(2.2), "f(x) = 1/(x - 4)")
    a.draw_labels()
    b = plot((-1, 9), (-1, 3), 350, ystep=1)
    band_x(b, 3, 9)
    b.curve(lambda x: math.sqrt(x - 3), 3, 9, S.INK)
    dot(b, 3, 0, S.INK)
    formula(b, b.X(6.2), b.Y(2.65), "f(x) = √(x - 3)")
    b.draw_labels()
    return side(a, b)


def wertebereich():
    """Slide 'Wertebereich': D along the x-axis (orange), W up the y-axis (green)."""
    p = plot((-3, 3), (-1, 6), 360, ystep=1)
    band_x(p, -3, 3)
    band_y(p, 0, 6)
    p.curve(lambda x: x * x, -3, 3, S.INK)
    formula(p, p.X(2.7), p.Y(0) - 10, "D", 16, S.ORANGE)
    formula(p, p.X(0) + 18, p.Y(5.4), "W", 16, S.GREEN, anchor="start")
    formula(p, p.X(1.4), p.Y(4.4), "y = x^2", anchor="end")
    p.draw_labels()
    return p.svg("Die Normalparabel: Definitionsbereich entlang der x-Achse, Wertebereich y ≥ 0 entlang der y-Achse")


def nullstellen():
    """Slide 'Nullstellen': 2x - 6 hits the axis at 3, x^2 - 4 at -2 and 2."""
    a = plot((-1, 5), (-4, 3), 330, ystep=1, skip_x=(0, 3))
    a.curve(lambda x: 2 * x - 6, -1, 5, S.INK)
    dot(a, 3, 0)
    formula(a, a.X(3) - 8, a.Y(0) - 10, "x = 3", 14, S.RED, anchor="end")
    formula(a, a.X(0.4), a.Y(2.1), "y = 2x - 6", anchor="start")
    a.draw_labels()
    b = plot((-3, 3), (-4, 3), 330, ystep=1, skip_x=(0, -2, 2))
    b.curve(lambda x: x * x - 4, -3, 3, S.INK)
    dot(b, -2, 0)
    dot(b, 2, 0)
    formula(b, b.X(-2) - 8, b.Y(0) - 10, "−2", 14, S.RED, anchor="end")
    formula(b, b.X(2) + 8, b.Y(0) - 10, "2", 14, S.RED, anchor="start")
    formula(b, b.X(-1.3), b.Y(-3.0), "y = x^2 - 4", anchor="end")
    b.draw_labels()
    return side(a, b)


def achsenabschnitt():
    """Slide 'y-Achsenabschnitt': 3x - 5 crosses the y-axis at -5; (2|3) lies on x^2 - 1."""
    a = plot((-2, 4), (-6, 4), 330, ystep=2)
    a.curve(lambda x: 3 * x - 5, -2, 4, S.INK)
    dot(a, 0, -5)
    formula(a, a.X(0) + 10, a.Y(-5) + 5, "(0 \\mid -5)", 14, S.RED, anchor="start")
    formula(a, a.X(2.35), a.Y(2.3), "y = 3x - 5", anchor="end")
    a.draw_labels()
    b = plot((-3, 3), (-2, 5), 330, ystep=1)
    b.curve(lambda x: x * x - 1, -3, 3, S.INK)
    b.dashto(2, 3)
    dot(b, 2, 3, S.GREEN)
    formula(b, b.X(2) - 10, b.Y(3) - 6, "(2 \\mid 3)", 14, S.GREEN, anchor="end")
    formula(b, b.X(0.25), b.Y(4.15), "y = x^2 - 1", anchor="start")
    b.draw_labels()
    return side(a, b)


def monotonie():
    """Slide 'Monotonie': -2x + 1 falls everywhere; x^2 falls left of 0 (red) and rises right of it (green)."""
    a = plot((-2, 3), (-4, 4), 330, ystep=2)
    a.curve(lambda x: -2 * x + 1, -2, 3, S.RED)
    formula(a, a.X(0.9), a.Y(2.4), "y = -2x + 1", anchor="start")
    a.draw_labels()
    b = plot((-3, 3), (-1, 6), 330, ystep=1)
    b.curve(lambda x: x * x, -3, 0, S.RED)
    b.curve(lambda x: x * x, 0, 3, S.GREEN)
    b.arrow(b.X(-2.6), b.Y(5.2), b.X(-1.9), b.Y(2.5), S.RED, 2)
    b.arrow(b.X(1.9), b.Y(2.5), b.X(2.6), b.Y(5.2), S.GREEN, 2)
    dot(b, 0, 0, S.INK, 3.6)
    formula(b, b.X(-0.9), b.Y(4.7), "y = x^2", anchor="end")
    b.draw_labels()
    return side(a, b)


def schnittpunkte():
    """Slide 'Schnittpunkte zählen': y = 5 meets y = x^2 at -sqrt5 and sqrt5."""
    p = plot((-3, 4.2), (-1, 7), 460, ystep=1, skip_x=(0, -2, 2))
    p.curve(lambda x: x * x, -3, 4.2, S.INK)
    p.seg((-3, 5), (4.2, 5), S.ORANGE, 2.4)
    r = math.sqrt(5)
    for u in (-r, r):
        p.line(p.X(u), p.Y(5), p.X(u), p.Y(0), S.MUTED, 1, dash="3 3")
        dot(p, u, 5)
    formula(p, p.X(-r), p.Y(0) + 20, "−√5", 14, S.RED)
    formula(p, p.X(r), p.Y(0) + 20, "√5", 14, S.RED)
    formula(p, p.X(4.15), p.Y(5) - 8, "y = 5", 14, S.INK, anchor="end")
    formula(p, p.X(0.95), p.Y(3.4), "y = x^2")
    p.draw_labels()
    return p.svg("Die Gerade y = 5 schneidet die Normalparabel zweimal, bei minus Wurzel 5 und Wurzel 5")


def symmetrie():
    """Slide 'Zwei Symmetrien': x^4 - x^2 mirrors at the y-axis, x^3 turns about the origin."""
    f = lambda x: x ** 4 - x * x
    a = plot((-1.6, 1.6), (-0.6, 1.4), 330, xstep=1, ystep=1, gstep=(0.5, 0.5))
    a.seg((0, -0.6), (0, 1.4), S.GREEN, 3)
    a.curve(f, -1.6, 1.6, S.INK)
    u = 1.25
    a.seg((-u, f(u)), (u, f(u)), S.MUTED, 1.2, dash="4 4")
    dot(a, -u, f(u), S.GREEN)
    dot(a, u, f(u), S.GREEN)
    formula(a, a.X(0.35), a.Y(1.15), "y = x^4 - x^2", anchor="start")
    a.draw_labels()
    b = plot((-1.6, 1.6), (-2, 2), 330, xstep=1, ystep=1, gstep=(0.5, 0.5))
    b.curve(lambda x: x ** 3, -1.6, 1.6, S.INK)
    u = 1.1
    b.seg((-u, -u ** 3), (u, u ** 3), S.MUTED, 1.2, dash="4 4")
    dot(b, -u, -u ** 3, S.GREEN)
    dot(b, u, u ** 3, S.GREEN)
    dot(b, 0, 0, S.GREEN, 5)
    formula(b, b.X(-0.35), b.Y(1.35), "y = x^3", anchor="end")
    b.draw_labels()
    return side(a, b)


def gemischt():
    """Slide 'Wenn sich die Exponenten mischen': f(x) = x^2 + x and its mirror f(-x) = x^2 - x do not coincide."""
    p = plot((-2.5, 2.5), (-1.2, 4), 420, ystep=1, xticks=False)
    p.curve(lambda x: x * x - x, -2.5, 2.5, S.MUTED, 1.8, dash="6 5")
    p.curve(lambda x: x * x + x, -2.5, 2.5, S.INK)
    formula(p, p.X(-1.1), p.Y(-0.8), "f(x) = x^2 + x", anchor="end")
    formula(p, p.X(1.1), p.Y(-0.8), "f(-x) = x^2 - x", 14, S.MUTED, anchor="start")
    p.draw_labels()
    return p.svg("f(x) = x² + x und ihr Spiegelbild f(−x) = x² − x fallen nicht zusammen")


def periode():
    """Slide 'Periodisch': sin x over two periods, the period 2pi as a measure between two maxima."""
    pi = math.pi
    p = plot((-0.3, 4 * pi + 0.3), (-1.4, 1.9), 760, xstep=pi / 2, ystep=1, xticks=False, pad=(34, 26, 12, 24))
    for k in range(1, 5):
        p.line(p.X(k * pi), p.Y(0) - 3.5, p.X(k * pi), p.Y(0) + 3.5, S.INK, 1.1)
        formula(p, p.X(k * pi), p.Y(0) + 17, ("%dπ" % k) if k > 1 else "π", 13, S.MUTED)
    p.curve(math.sin, -0.3, 4 * pi + 0.3, S.INK)
    dot(p, pi / 2, 1, S.GREEN)
    dot(p, 5 * pi / 2, 1, S.GREEN)
    p.brace(pi / 2, 5 * pi / 2, 1.5, "")
    formula(p, p.X(3 * pi / 2), p.Y(1.5) - 7, "p = 2π", 14, S.RED)
    formula(p, p.X(3.55 * pi), p.Y(1.35), "y = sin x")
    p.draw_labels()
    return p.svg("Die Sinuskurve über zwei Perioden, die Periode 2π zwischen zwei Hochpunkten")


def tabelle():
    """Slide 'Wenn nur eine Tabelle gegeben ist': 2, 4, 8, 16 - each value twice the one before, on 2^x."""
    p = plot((0, 4.6), (0, 18), 420, ystep=4, pad=(34, 22, 12, 24))
    p.curve(lambda x: 2 ** x, 0, 4.4, S.MUTED, 1.6, dash="6 5")
    pts = [(1, 2), (2, 4), (3, 8), (4, 16)]
    for (u, v), (u2, v2) in zip(pts, pts[1:]):
        p.arrow(p.X(u) + 6, p.Y(v) - 4, p.X(u2) - 7, p.Y(v2) + 6, S.ORANGE, 1.8)
        formula(p, (p.X(u) + p.X(u2)) / 2 - 12, (p.Y(v) + p.Y(v2)) / 2 - 4, "·2", 14, S.RED, anchor="end")
    for u, v in pts:
        dot(p, u, v, S.INK)
    formula(p, p.X(4.3), p.Y(9), "y = 2^x", 15, S.MUTED, anchor="start")
    p.draw_labels()
    return p.svg("Die Werte 2, 4, 8, 16 an den Stellen 1 bis 4: jeder doppelt so groß wie der vorige, auf y = 2 hoch x")


# slide index in the deck (0 = greeting) -> figure
FIGURES = {
    4: zuordnung, 5: senkrechte, 6: definitionsbereich, 7: wertebereich, 10: nullstellen,
    11: achsenabschnitt, 12: monotonie, 13: schnittpunkte, 15: symmetrie, 16: gemischt, 17: periode, 19: tabelle,
}

if __name__ == "__main__":
    names = {f.__name__: f for f in FIGURES.values()}
    if len(sys.argv) > 1:
        print(names[sys.argv[1]]())
    else:
        for i, f in FIGURES.items():
            print("%2d  %s" % (i, f.__name__))

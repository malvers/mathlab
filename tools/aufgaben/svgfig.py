#!/usr/bin/env python3
"""Inline-SVG figures for the Aufgaben sheets.

The exam originals embed their figures as small bitmaps (~400x500 px, blurry in print).
Ours are drawn here instead: vector, sharp on screen and on paper, and every coordinate
comes from the same numbers the solution is checked against.

    from svgfig import Plot, Solid, V3
    p = Plot((-1, 5), (-2, 6), w=520, h=340)
    p.axes(xstep=1, ystep=2, xlabel="x", ylabel="y")
    p.curve(lambda x: x**3 - 6*x**2 + 9*x, -0.6, 4.2)
    p.point(1, 4, "H", "above")
    svg = p.svg()

Every id inside a figure is suffixed with a per-figure counter, so several figures can
sit on one page without their arrow markers stealing each other's definitions.
"""
import math

# Palette of the sheets (tools/pptx/design_lib.py) - one look for slides and worksheets.
INK = "#0E244E"
BODY = "#2C3C60"
MUTED = "#6E7E9F"
ORANGE = "#F5C242"
RED = "#B02418"
GREEN = "#799E31"
PAPER = "#FFFFFF"

SANS = "Raleway, system-ui, sans-serif"
# Variables are set in an italic serif, the way a textbook sets them - it keeps
# axis names apart from the plain numbers on the ticks.
MATH = "Cambria Math, Georgia, Times New Roman, serif"

_SEQ = [0]


def esc(s):
    return (str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
            .replace('"', "&quot;"))


def fmt(v):
    """Short decimal - SVG files stay readable and small."""
    return ("%.2f" % v).rstrip("0").rstrip(".")


def num(v, dec=0):
    """German decimal comma for labels inside a figure."""
    s = ("%." + str(dec) + "f") % v
    return s.replace(".", ",")


class Canvas:
    """Bare pixel canvas - the base for every figure type."""

    def __init__(self, w, h):
        _SEQ[0] += 1
        self.uid = "f%d" % _SEQ[0]
        self.w, self.h = w, h
        self.defs = []
        self.body = []

    # ------------------------------------------------------------- primitives --
    def raw(self, markup):
        self.body.append(markup)

    def line(self, x1, y1, x2, y2, color=INK, width=1.2, dash=None, opacity=None, cap="round"):
        self.raw('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-width="%s"'
                 ' stroke-linecap="%s"%s%s/>'
                 % (fmt(x1), fmt(y1), fmt(x2), fmt(y2), color, width, cap,
                    ' stroke-dasharray="%s"' % dash if dash else "",
                    ' opacity="%s"' % opacity if opacity is not None else ""))

    def path(self, d, stroke=INK, width=1.6, fill="none", dash=None, opacity=None):
        self.raw('<path d="%s" fill="%s" stroke="%s" stroke-width="%s" stroke-linejoin="round"'
                 ' stroke-linecap="round"%s%s/>'
                 % (d, fill, stroke, width,
                    ' stroke-dasharray="%s"' % dash if dash else "",
                    ' opacity="%s"' % opacity if opacity is not None else ""))

    def poly(self, pts, stroke=INK, width=1.4, fill="none", dash=None, opacity=None, close=True):
        d = "M " + " L ".join("%s %s" % (fmt(x), fmt(y)) for x, y in pts) + (" Z" if close else "")
        self.path(d, stroke=stroke, width=width, fill=fill, dash=dash, opacity=opacity)

    def circle(self, x, y, r=3.4, fill=RED, stroke=PAPER, width=1.4):
        self.raw('<circle cx="%s" cy="%s" r="%s" fill="%s" stroke="%s" stroke-width="%s"/>'
                 % (fmt(x), fmt(y), r, fill, stroke, width))

    def rect(self, x, y, w, h, fill="none", stroke=None, width=1, rx=0, opacity=None):
        self.raw('<rect x="%s" y="%s" width="%s" height="%s" rx="%s" fill="%s"%s%s/>'
                 % (fmt(x), fmt(y), fmt(w), fmt(h), rx, fill,
                    ' stroke="%s" stroke-width="%s"' % (stroke, width) if stroke else "",
                    ' opacity="%s"' % opacity if opacity is not None else ""))

    def text(self, x, y, s, size=13, color=BODY, anchor="middle", italic=False,
             weight=None, family=None, baseline=None, halo=None):
        """halo=<colour> paints the paper colour behind the glyphs, so a label stays
        readable where it has to sit on top of a grid line or a curve."""
        self.raw('<text x="%s" y="%s" font-family="%s" font-size="%s" fill="%s"'
                 ' text-anchor="%s"%s%s%s%s>%s</text>'
                 % (fmt(x), fmt(y), family or (MATH if italic else SANS), size, color, anchor,
                    ' font-style="italic"' if italic else "",
                    ' font-weight="%s"' % weight if weight else "",
                    ' dominant-baseline="%s"' % baseline if baseline else "",
                    ' stroke="%s" stroke-width="4" paint-order="stroke"'
                    ' stroke-linejoin="round"' % halo if halo else "",
                    esc(s)))

    def arrowhead(self, color):
        """One marker per colour, defined once per figure."""
        mid = "%s-ar-%s" % (self.uid, color.lstrip("#"))
        marker = ('<marker id="%s" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7"'
                  ' markerHeight="7" orient="auto-start-reverse">'
                  '<path d="M 0 1 L 10 5 L 0 9 z" fill="%s"/></marker>' % (mid, color))
        if marker not in self.defs:
            self.defs.append(marker)
        return mid

    def arrow(self, x1, y1, x2, y2, color=INK, width=1.2, dash=None):
        mid = self.arrowhead(color)
        self.raw('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-width="%s"'
                 ' marker-end="url(#%s)"%s/>'
                 % (fmt(x1), fmt(y1), fmt(x2), fmt(y2), color, width, mid,
                    ' stroke-dasharray="%s"' % dash if dash else ""))

    def legend(self, x, y, entries, size=11.5, gap=17, swatch=17, box=True):
        """entries = [(text, colour, kind)] with kind in 'line' | 'dash' | 'fill' | 'dot'.
        Four sheets each built their own before this existed."""
        if box:
            wide = swatch + 8 + max(len(t) for t, _, _ in entries) * size * 0.55
            self.rect(x - 7, y - size, wide + 14, gap * len(entries) + 8,
                      fill=PAPER, stroke="#DCE4F0", width=1, rx=4, opacity=0.92)
        for i, (text, color, kind) in enumerate(entries):
            cy = y + i * gap
            if kind == "fill":
                self.rect(x, cy - 6, swatch, 11, fill=color, opacity=0.45)
            elif kind == "dot":
                self.circle(x + swatch / 2.0, cy, 3.6, color)
            else:
                self.line(x, cy, x + swatch, cy, color, 2.1,
                          dash="5 3" if kind == "dash" else None)
            self.text(x + swatch + 8, cy + 4, text, size, BODY, "start")

    def sector(self, cx, cy, r, a0, a1, fill=ORANGE, opacity=0.75, stroke=PAPER, width=1.4,
               label=None, lcolor=INK, lsize=12.5, lr=0.62):
        """Pie sector, angles in degrees, 0 = 12 o'clock, clockwise - the way a Gluecksrad
        is described. Label sits at lr times the radius."""
        def pt(a):
            rad = math.radians(a - 90)
            return (cx + r * math.cos(rad), cy + r * math.sin(rad))
        x0, y0 = pt(a0)
        x1, y1 = pt(a1)
        large = 1 if (a1 - a0) % 360 > 180 else 0
        d = ("M %s %s L %s %s A %s %s 0 %d 1 %s %s Z"
             % (fmt(cx), fmt(cy), fmt(x0), fmt(y0), fmt(r), fmt(r), large, fmt(x1), fmt(y1)))
        self.raw('<path d="%s" fill="%s" opacity="%s" stroke="%s" stroke-width="%s"/>'
                 % (d, fill, opacity, stroke, width))
        if label:
            mx, my = pt((a0 + a1) / 2.0)
            self.text(cx + (mx - cx) * lr, cy + (my - cy) * lr + 4, label, lsize, lcolor,
                      halo=PAPER)

    def arc(self, cx, cy, r, a0, a1, color=MUTED, width=1.3, label=None, lsize=11.5, lr=1.35):
        """Angle arc between two directions, angles in degrees measured from the x-axis,
        counter-clockwise - for marking an angle in a figure."""
        def pt(a):
            rad = math.radians(-a)
            return (cx + r * math.cos(rad), cy + r * math.sin(rad))
        x0, y0 = pt(a0)
        x1, y1 = pt(a1)
        large = 1 if abs(a1 - a0) > 180 else 0
        sweep = 0 if a1 > a0 else 1
        self.raw('<path d="M %s %s A %s %s 0 %d %d %s %s" fill="none" stroke="%s"'
                 ' stroke-width="%s"/>'
                 % (fmt(x0), fmt(y0), fmt(r), fmt(r), large, sweep, fmt(x1), fmt(y1),
                    color, width))
        if label:
            mx, my = pt((a0 + a1) / 2.0)
            self.text(cx + (mx - cx) * lr, cy + (my - cy) * lr + 4, label, lsize, color,
                      halo=PAPER)

    # ------------------------------------------------------------------ output --
    def svg(self, label=None):
        defs = ("<defs>%s</defs>" % "".join(self.defs)) if self.defs else ""
        role = ' role="img" aria-label="%s"' % esc(label) if label else ' role="presentation"'
        return ('<svg viewBox="0 0 %d %d" width="%d" height="%d"'
                ' preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg"%s>'
                '%s%s</svg>' % (self.w, self.h, self.w, self.h, role, defs, "".join(self.body)))


class Plot(Canvas):
    """A 2-D coordinate system in world units."""

    def __init__(self, xlim, ylim, w=520, h=340, pad=(40, 22, 20, 34)):
        Canvas.__init__(self, w, h)
        self.x0, self.x1 = xlim
        self.y0, self.y1 = ylim
        self.pl, self.pr, self.pt, self.pb = pad
        self.sx = (w - self.pl - self.pr) / float(self.x1 - self.x0)
        self.sy = (h - self.pt - self.pb) / float(self.y1 - self.y0)
        # Curves are clipped to the axis window, so a steep branch stops at the frame
        # instead of running off across the caption.
        self.clip = "%s-clip" % self.uid
        self.defs.append('<clipPath id="%s"><rect x="%s" y="%s" width="%s" height="%s"/></clipPath>'
                         % (self.clip, fmt(self.pl - 1), fmt(self.pt - 1),
                            fmt(w - self.pl - self.pr + 2), fmt(h - self.pt - self.pb + 2)))

    def clipped(self, draw):
        """Run a drawing callable with everything it emits clipped to the axis window."""
        mark = len(self.body)
        draw()
        inner = "".join(self.body[mark:])
        del self.body[mark:]
        self.body.append('<g clip-path="url(#%s)">%s</g>' % (self.clip, inner))

    def X(self, u):
        return self.pl + (u - self.x0) * self.sx

    def Y(self, v):
        return self.h - self.pb - (v - self.y0) * self.sy

    def P(self, u, v):
        return (self.X(u), self.Y(v))

    # ------------------------------------------------------------------- frame --
    def grid(self, xstep=1, ystep=1, color="#DCE4F0"):
        u = math.ceil(self.x0 / xstep) * xstep
        while u <= self.x1 + 1e-9:
            self.line(self.X(u), self.Y(self.y0), self.X(u), self.Y(self.y1), color, 1, cap="butt")
            u += xstep
        v = math.ceil(self.y0 / ystep) * ystep
        while v <= self.y1 + 1e-9:
            self.line(self.X(self.x0), self.Y(v), self.X(self.x1), self.Y(v), color, 1, cap="butt")
            v += ystep

    def axes(self, xstep=1, ystep=1, xlabel="x", ylabel="y", xticks=True, yticks=True,
             origin="O", skip_x=(0,), skip_y=(0,), xdec=0, ydec=0, defer_labels=False):
        """defer_labels=True draws the ticks but keeps their numbers back until
        draw_labels() is called - put that after the curves and filled areas, otherwise
        the data paints over the numbers (four sheets ran into this)."""
        self._pending = []
        ax, ay = self.X(0), self.Y(0)
        self.arrow(self.X(self.x0), ay, self.X(self.x1), ay, INK, 1.3)
        self.arrow(ax, self.Y(self.y0), ax, self.Y(self.y1), INK, 1.3)
        self.text(self.X(self.x1) + 2, ay + 16, xlabel, 14, INK, "start", italic=True)
        self.text(ax - 12, self.Y(self.y1) - 2, ylabel, 14, INK, "end", italic=True)
        if origin:
            self.text(ax - 7, ay + 15, origin, 12, MUTED, "end", italic=True)
        def label(x, y, s, anchor):
            if defer_labels:
                self._pending.append((x, y, s, anchor))
            else:
                self.text(x, y, s, 11.5, MUTED, anchor)
        if xticks:
            u = math.ceil(self.x0 / xstep) * xstep
            while u <= self.x1 - 0.2 * xstep:
                if all(abs(u - s) > 1e-9 for s in skip_x):
                    self.line(self.X(u), ay - 3.5, self.X(u), ay + 3.5, INK, 1.1)
                    label(self.X(u), ay + 16, num(u, xdec), "middle")
                u += xstep
        if yticks:
            v = math.ceil(self.y0 / ystep) * ystep
            while v <= self.y1 - 0.2 * ystep:
                if all(abs(v - s) > 1e-9 for s in skip_y):
                    self.line(ax - 3.5, self.Y(v), ax + 3.5, self.Y(v), INK, 1.1)
                    label(ax - 7, self.Y(v) + 4, num(v, ydec), "end")
                v += ystep

    def draw_labels(self, halo=PAPER):
        """Emit the tick numbers held back by axes(defer_labels=True) - call it after
        everything that could paint over them."""
        for x, y, s, anchor in getattr(self, "_pending", []):
            self.text(x, y, s, 11.5, MUTED, anchor, halo=halo)
        self._pending = []

    def vmeasure(self, u, v1, v2, label=None, color=MUTED, side=1, size=11.5):
        """Vertical measure at x = u between two y values, arrows on both ends."""
        x = self.X(u)
        self.arrow(x, self.Y(v1), x, self.Y(v2), color, 1.2)
        self.arrow(x, self.Y(v2), x, self.Y(v1), color, 1.2)
        if label:
            self.text(x + 8 * side, (self.Y(v1) + self.Y(v2)) / 2.0 + 4, label, size, color,
                      "start" if side > 0 else "end", halo=PAPER)

    # -------------------------------------------------------------------- data --
    def _samples(self, fn, a, b, n=260):
        pts = []
        for i in range(n + 1):
            u = a + (b - a) * i / float(n)
            try:
                v = fn(u)
            except (ValueError, ZeroDivisionError, OverflowError):
                continue
            if v != v or abs(v) == float("inf"):
                continue
            # clip generously so a steep branch leaves the frame instead of squashing it
            if self.y0 - 3 * (self.y1 - self.y0) < v < self.y1 + 3 * (self.y1 - self.y0):
                pts.append(self.P(u, v))
        return pts

    def curve(self, fn, a, b, color=RED, width=2.1, dash=None, n=260):
        pts = self._samples(fn, a, b, n)
        if len(pts) > 1:
            self.clipped(lambda: self.poly(pts, stroke=color, width=width, dash=dash, close=False))

    def area(self, fn, a, b, fill=ORANGE, opacity=0.3, base=0.0, n=180):
        pts = self._samples(fn, a, b, n)
        if len(pts) < 2:
            return
        d = ("M %s %s L " % (fmt(self.X(a)), fmt(self.Y(base)))
             + " L ".join("%s %s" % (fmt(x), fmt(y)) for x, y in pts)
             + " L %s %s Z" % (fmt(self.X(b)), fmt(self.Y(base))))
        self.clipped(lambda: self.raw('<path d="%s" fill="%s" opacity="%s"/>' % (d, fill, opacity)))

    def area_between(self, f, g, a, b, fill=GREEN, opacity=0.25, n=180):
        top = self._samples(f, a, b, n)
        bot = self._samples(g, a, b, n)
        if len(top) < 2 or len(bot) < 2:
            return
        d = ("M " + " L ".join("%s %s" % (fmt(x), fmt(y)) for x, y in top)
             + " L " + " L ".join("%s %s" % (fmt(x), fmt(y)) for x, y in reversed(bot)) + " Z")
        self.clipped(lambda: self.raw('<path d="%s" fill="%s" opacity="%s"/>' % (d, fill, opacity)))

    def seg(self, p, q, color=INK, width=1.4, dash=None, clip=False):
        draw = lambda: self.line(self.X(p[0]), self.Y(p[1]), self.X(q[0]), self.Y(q[1]),
                                 color, width, dash)
        self.clipped(draw) if clip else draw()

    def tangent(self, fn, dfn, x, half=1.4, color=GREEN, width=1.7, dash=None):
        m, y = dfn(x), fn(x)
        self.seg((x - half, y - m * half), (x + half, y + m * half), color, width, dash, clip=True)

    def point(self, u, v, label=None, pos="above", color=RED, size=3.6, dec=0):
        self.circle(self.X(u), self.Y(v), size, color)
        if label:
            dx, dy, anchor = {"above": (0, -10, "middle"), "below": (0, 19, "middle"),
                              "left": (-9, 5, "end"), "right": (9, 5, "start"),
                              "above-left": (-8, -8, "end"), "above-right": (8, -8, "start"),
                              "below-right": (8, 16, "start"), "below-left": (-8, 16, "end")}[pos]
            self.text(self.X(u) + dx, self.Y(v) + dy, label, 13, INK, anchor,
                      italic=True, halo=PAPER)

    def dashto(self, u, v, color=MUTED):
        """Dotted helper lines from a point down to both axes."""
        self.line(self.X(u), self.Y(v), self.X(u), self.Y(0), color, 1, dash="3 3")
        self.line(self.X(u), self.Y(v), self.X(0), self.Y(v), color, 1, dash="3 3")

    def bars(self, values, x0=0, fill=ORANGE, stroke=None, width=0.62, opacity=1.0,
             highlight=(), hi_fill=RED):
        """Bar chart in world units - one bar per value, centred on x0+i."""
        for i, val in enumerate(values):
            u = x0 + i
            left, right = self.X(u - width / 2.0), self.X(u + width / 2.0)
            top, bottom = self.Y(val), self.Y(0)
            self.rect(left, top, right - left, bottom - top,
                      fill=hi_fill if i + x0 in highlight else fill,
                      stroke=stroke or PAPER, width=0.8, opacity=opacity)

    def brace(self, u1, u2, v, label, color=MUTED, up=True, halo=PAPER):
        """Horizontal measure between two x values, drawn at height v."""
        y = self.Y(v)
        self.arrow(self.X(u1), y, self.X(u2), y, color, 1.2)
        self.arrow(self.X(u2), y, self.X(u1), y, color, 1.2)
        self.text((self.X(u1) + self.X(u2)) / 2.0, y - 7 if up else y + 16, label, 12, color,
                  halo=halo)


# --------------------------------------------------------------------- 3-D ----
class Solid(Canvas):
    """Oblique (cabinet) projection of 3-D points - the way the exams draw their bodies.

    x runs to the lower left, y to the right, z upwards. Give the world extent and a
    scale in pixels per unit; origin is placed so the whole body fits.
    """

    def __init__(self, w=520, h=360, scale=26, ox=None, oy=None, skew=(-0.35, -0.45)):
        Canvas.__init__(self, w, h)
        self.s = scale
        self.kx, self.ky = skew
        self.ox = w * 0.30 if ox is None else ox
        self.oy = h * 0.78 if oy is None else oy

    def P(self, p):
        x, y, z = p
        return (self.ox + self.s * (y + self.kx * x),
                self.oy - self.s * (z + self.ky * x))

    def axes(self, lx=3, ly=9, lz=6, labels=("x", "y", "z")):
        o = self.P((0, 0, 0))
        for vec, lab in (((lx, 0, 0), labels[0]), ((0, ly, 0), labels[1]), ((0, 0, lz), labels[2])):
            q = self.P(vec)
            self.arrow(o[0], o[1], q[0], q[1], MUTED, 1.1)
            dx = 10 if q[0] >= o[0] else -10
            self.text(q[0] + dx, q[1] + (14 if lab != labels[2] else -4), lab, 13, MUTED,
                      "start" if dx > 0 else "end", italic=True)

    def shade(self, pts, fill=ORANGE, opacity=0.22):
        """Fill a face without outlining it - the edges are drawn separately, so a
        shared edge is never painted twice at half opacity."""
        d = "M " + " L ".join("%s %s" % (fmt(x), fmt(y)) for x, y in (self.P(p) for p in pts)) + " Z"
        self.raw('<path d="%s" fill="%s" opacity="%s"/>' % (d, fill, opacity))

    def face(self, pts, fill=ORANGE, opacity=0.22, stroke=INK, width=1.4, dash=None):
        self.shade(pts, fill, opacity)
        if stroke:
            self.poly([self.P(p) for p in pts], stroke=stroke, width=width, fill="none", dash=dash)

    def edge(self, p, q, color=INK, width=1.5, dash=None):
        a, b = self.P(p), self.P(q)
        self.line(a[0], a[1], b[0], b[1], color, width, dash)

    def edges(self, pairs, color=INK, width=1.5, dash=None):
        for p, q in pairs:
            self.edge(p, q, color, width, dash)

    def vertex(self, p, label=None, pos="above", color=INK, size=3.0):
        x, y = self.P(p)
        self.circle(x, y, size, color)
        if label:
            dx, dy, anchor = {"above": (0, -9, "middle"), "below": (0, 17, "middle"),
                              "left": (-8, 5, "end"), "right": (8, 5, "start"),
                              "above-left": (-7, -7, "end"), "above-right": (7, -7, "start"),
                              "below-left": (-7, 15, "end"), "below-right": (7, 15, "start")}[pos]
            self.text(x + dx, y + dy, label, 13, INK, anchor, italic=True, halo=PAPER)

    def arrow3(self, p, q, color=GREEN, width=1.6, dash=None):
        a, b = self.P(p), self.P(q)
        self.arrow(a[0], a[1], b[0], b[1], color, width, dash)

    def label3(self, p, s, dx=0, dy=0, size=12, color=MUTED, anchor="middle", italic=False,
               halo=PAPER):
        x, y = self.P(p)
        self.text(x + dx, y + dy, s, size, color, anchor, italic=italic, halo=halo)


# ------------------------------------------------------------------ diagrams --
class Diagram(Canvas):
    """Boxes and arrows in pixel space - Gozinto graphs, trees, four-field tables."""

    def box(self, x, y, w, h, label, fill=PAPER, stroke=INK, color=INK, size=13,
            rx=5, sub=None, italic=True):
        self.rect(x - w / 2.0, y - h / 2.0, w, h, fill=fill, stroke=stroke, width=1.3, rx=rx)
        self.text(x, y + (0 if sub is None else -3), label, size, color, italic=italic,
                  baseline="middle")
        if sub:
            self.text(x, y + 15, sub, 10.5, MUTED)

    def link(self, p, q, label=None, color=MUTED, width=1.2, off=(0, -6), size=11,
             lcolor=BODY, dash=None, shorten=20, t=0.5, halo=PAPER):
        """Arrow between two box centres, pulled back so it stops at the box edge.

        t moves the label along the arrow - crossing arrows get 0.3 and 0.7 so their
        labels do not land on the same spot."""
        (x1, y1), (x2, y2) = p, q
        dx, dy = x2 - x1, y2 - y1
        d = math.hypot(dx, dy) or 1.0
        ux, uy = dx / d, dy / d
        self.arrow(x1 + ux * shorten, y1 + uy * shorten,
                   x2 - ux * shorten, y2 - uy * shorten, color, width, dash)
        if label:
            self.text(x1 + dx * t + off[0], y1 + dy * t + off[1], label, size, lcolor,
                      halo=halo)

    def table(self, x, y, cols, rows, cw, ch, cells, head_fill="#EEF2F8", size=13):
        """cells[r][c] as strings; row 0 and column 0 are the headers."""
        for r in range(rows):
            for c in range(cols):
                cx, cy = x + c * cw, y + r * ch
                head = (r == 0 or c == 0)
                self.rect(cx, cy, cw, ch, fill=head_fill if head else PAPER,
                          stroke=INK, width=1.0)
                s = cells[r][c]
                if s:
                    self.text(cx + cw / 2.0, cy + ch / 2.0, s, size,
                              INK if head else BODY, italic=head, baseline="middle")

    def node(self, x, y, label=None, pos="right", color=INK, size=13):
        self.circle(x, y, 3.4, color, PAPER, 1.3)
        if label:
            dx, dy, anchor = {"right": (10, 5, "start"), "left": (-10, 5, "end"),
                              "above": (0, -10, "middle"), "below": (0, 17, "middle")}[pos]
            self.text(x + dx, y + dy, label, size, INK, anchor, italic=True)

    def selfloop(self, x, y, w=58, h=40, label=None, color=MUTED, width=1.2, size=11,
                 side=1):
        """Arrow that leaves a box and comes back to it - the own-consumption edge in a
        Leontief diagram. side=1 loops to the right, -1 to the left."""
        r = 18
        sx, sy = x + side * w / 2.0, y - h * 0.22
        ex, ey = x + side * w / 2.0, y + h * 0.22
        cx = x + side * (w / 2.0 + r * 2.1)
        mid = self.arrowhead(color)
        self.raw('<path d="M %s %s C %s %s, %s %s, %s %s" fill="none" stroke="%s"'
                 ' stroke-width="%s" marker-end="url(#%s)"/>'
                 % (fmt(sx), fmt(sy), fmt(cx), fmt(sy - r), fmt(cx), fmt(ey + r),
                    fmt(ex), fmt(ey), color, width, mid))
        if label:
            self.text(cx + side * 12, y + 4, label, size, BODY, "start" if side > 0 else "end",
                      halo=PAPER)

    def branch(self, p, q, label=None, color=MUTED, width=1.3, size=11.5, lift=9):
        """A tree branch with its probability written along it, just off the line."""
        (x1, y1), (x2, y2) = p, q
        d = math.hypot(x2 - x1, y2 - y1) or 1.0
        ux, uy = (x2 - x1) / d, (y2 - y1) / d
        self.line(x1 + ux * 6, y1 + uy * 6, x2 - ux * 6, y2 - uy * 6, color, width)
        if label:
            mx, my = (x1 + x2) / 2.0, (y1 + y2) / 2.0
            # push the text away from the line, on the side the branch points to
            self.text(mx - uy * 0, my + (-lift if uy < 0 else lift + 4), label, size, BODY)


# ------------------------------------------------------------------- panels ---
def panel(canvases, gap=20, captions=None, csize=12, cheight=20, label=None):
    """Several figures side by side in ONE svg - for "the same thing for two values of t".

    Takes Canvas objects (not their svg() strings), so the ids in their defs stay unique
    and nothing collides. Each figure keeps its own coordinate system.
    """
    cap = cheight if captions else 0
    w = sum(c.w for c in canvases) + gap * (len(canvases) - 1)
    h = max(c.h for c in canvases) + cap
    defs, body = [], []
    dx = 0
    for i, c in enumerate(canvases):
        defs.extend(c.defs)
        body.append('<g transform="translate(%s,0)">%s</g>' % (fmt(dx), "".join(c.body)))
        if captions:
            body.append('<text x="%s" y="%s" font-family="%s" font-size="%s" fill="%s"'
                        ' text-anchor="middle">%s</text>'
                        % (fmt(dx + c.w / 2.0), fmt(h - 5), SANS, csize, MUTED,
                           esc(captions[i])))
        dx += c.w + gap
    head = ("<defs>%s</defs>" % "".join(defs)) if defs else ""
    role = ' role="img" aria-label="%s"' % esc(label) if label else ' role="presentation"'
    return ('<svg viewBox="0 0 %d %d" width="%d" height="%d" preserveAspectRatio="xMidYMid meet"'
            ' xmlns="http://www.w3.org/2000/svg"%s>%s%s</svg>'
            % (w, h, w, h, role, head, "".join(body)))

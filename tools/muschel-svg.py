#!/usr/bin/env python3
"""Draw the scallop shell that stands for zero in the Maya lab, as a plain SVG.

A Pecten read as a fan of tongues: every rib is an outline of its own - two radial edges and a
round cap - and the caps land on the circle that sits on the umbo, so the rim is a row of arcs.
The two ears hang under the outermost tongue and share its lower edge, so no line ever crosses
another. The viewBox is measured from the geometry itself, stroke included, so nothing is cut
off at the sides - the shell is a touch wider than it is tall.

    python3 tools/muschel-svg.py > HTML/resources/muschel.svg
"""
import math
import sys

RIBS = 9
END_A = 22.0          # where the rim stops, in degrees off the hinge line
FILL = 0.88           # how much of its slot a tongue fills
ROOT = 0.02           # radius at which the tongues meet at the hinge
EAR_LEN = 0.72        # how far along that tongue's edge the ear reaches
SOLE = 0.022          # the flat sole of the ear, above the umbo
SCALE = 100.0         # the shell is SCALE tall, in user units
STROKE = 3.2


def build():
    """Return the path data and the box it needs: (d, x, y, width, height)."""
    a0, a1 = math.radians(END_A), math.pi - math.radians(END_A)
    step = (a1 - a0) / RIBS
    half = step / 2 * FILL
    seen = []                               # every point the outline touches
    flank = {}                              # the edge each ear has to sit on

    def P(x, y):                            # unit shape (y up) -> user units (y down)
        p = (SCALE * x, -SCALE * y)
        seen.append(p)
        return p

    def ray(a, r):
        return P(r * math.cos(a), r * math.sin(a))

    def fmt(p):
        return "%.2f %.2f" % p

    parts = []
    for k in range(RIBS):
        a = a0 + step * (k + 0.5)
        L = math.sin(a)                     # the circle of diameter 1 through the umbo
        cap = L * math.sin(half)
        stem = L - cap
        ux, uy = math.cos(a), math.sin(a)
        px, py = -uy, ux                    # across the rib
        tip = ray(a, ROOT)
        left = P(ux * stem + px * cap, uy * stem + py * cap)
        right = P(ux * stem - px * cap, uy * stem - py * cap)
        if k == 0:
            flank[1] = (tip, right)             # lower edge of the outermost tongue, right
        if k == RIBS - 1:
            flank[-1] = (tip, left)             # ... and left
        for i in range(1, 32):              # the cap itself, for the box
            f = math.pi * i / 32
            P(ux * stem + px * cap * math.cos(f) + ux * cap * math.sin(f),
              uy * stem + py * cap * math.cos(f) + uy * cap * math.sin(f))
        r = cap * SCALE
        parts.append("M %s L %s A %.2f %.2f 0 0 1 %s Z"
                     % (fmt(tip), fmt(left), r, r, fmt(right)))

    # the ears, one open path each: down the very edge of the outermost tongue - the same two
    # points that tongue is drawn from, so the lines meet exactly - then along the sole and in
    # to the umbo
    for sgn in (1, -1):
        inner, edge_end = flank[sgn]
        outer = (inner[0] + (edge_end[0] - inner[0]) * EAR_LEN,
                 inner[1] + (edge_end[1] - inner[1]) * EAR_LEN)
        seen.append(outer)
        sole = P(sgn * 0.05, SOLE)
        corner = (outer[0], sole[1])
        seen.append(corner)
        parts.append("M %s L %s L %s L %s L %s"
                     % (fmt(inner), fmt(outer), fmt(corner), fmt(sole), fmt(P(0, 0))))

    pad = STROKE / 2
    xs = [p[0] for p in seen]
    ys = [p[1] for p in seen]
    x, y = min(xs) - pad, min(ys) - pad
    return " ".join(parts), x, y, max(xs) - min(xs) + 2 * pad, max(ys) - min(ys) + 2 * pad


def main():
    d, x, y, w, h = build()
    sys.stdout.write(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="%.2f %.2f %.2f %.2f" '
        'width="%.2f" height="%.2f" fill="none" stroke="currentColor" stroke-width="%g" '
        'stroke-linejoin="round" stroke-linecap="round">\n'
        '  <title>Muschel - die Null der Maya</title>\n'
        '  <path d="%s"/>\n</svg>\n' % (x, y, w, h, w, h, STROKE, d))


if __name__ == "__main__":
    main()

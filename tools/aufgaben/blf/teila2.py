#!/usr/bin/env python3
"""BLF-Training Gymnasium Klasse 10 - Teil A, ohne Hilfsmittel (Satz 2).

    python3 tools/aufgaben/blf/teila2.py

Second set for Teil A of the Sachsen BLF: the other half of the Ankreuz topics that
come up year after year (right triangle, sine function, linear system, counting), a
circle around the origin with Thales, and the algebra that has to work without a
calculator (rearranging formulas, a parameter in a quadratic equation). Wording,
numbers and every figure are our own.
"""
import math
import os
import sys
from fractions import Fraction as Fr
from itertools import permutations, product
from math import pi, sqrt

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from textaufgaben import Sheet                                     # noqa: E402
import svgfig as S                                                 # noqa: E402


# ---------------------------------------------------- Aufgabe 2: der Kreis -----
KP, KQ = (3, 4), (-4, 3)                   # both on the circle x^2 + y^2 = 25
KR = (-3, -4)                              # opposite P: PR is a diameter
RADIUS = 5

# ---------------------------------------------------- Aufgabe 3: Rechteck ------
RU, RD = 34, 13                            # perimeter and diagonal
RA, RB = 12, 5


# ----------------------------------------------------------------- figures ---
def fig_dreieck():
    """Right triangle, right angle at C - the labelling the exam uses."""
    c = S.Canvas(440, 250)
    # C on the Thales circle over AB, so the right angle at C is exact in the picture
    A, B = (50, 205), (390, 205)
    C = (220 + 170 * math.cos(math.radians(120)), 205 - 170 * math.sin(math.radians(120)))
    assert abs((A[0] - C[0]) * (B[0] - C[0]) + (A[1] - C[1]) * (B[1] - C[1])) < 1e-6
    c.raw('<path d="M %s %s L %s %s L %s %s Z" fill="%s" opacity="0.18"/>'
          % (A[0], A[1], B[0], B[1], C[0], C[1], S.ORANGE))
    c.poly([A, B, C], stroke=S.INK, width=1.7)

    def toward(p, q, d):
        dx, dy = q[0] - p[0], q[1] - p[1]
        n = math.hypot(dx, dy)
        return (p[0] + dx / n * d, p[1] + dy / n * d)

    u, v = toward(C, A, 16), toward(C, B, 16)
    w = (u[0] + v[0] - C[0], u[1] + v[1] - C[1])
    c.poly([u, w, v], stroke=S.INK, width=1.1, close=False)
    c.circle(w[0] - (w[0] - C[0]) * 0.45, w[1] - (w[1] - C[1]) * 0.45, 1.6, S.INK, S.INK, 0)
    for p, lab, dx, dy in ((A, "A", -12, 8), (B, "B", 12, 8), (C, "C", -4, -10)):
        c.text(p[0] + dx, p[1] + dy, lab, 15, S.INK, italic=True)
    # sides opposite their vertex: a = BC, b = AC, c = AB
    c.text((B[0] + C[0]) / 2.0 + 12, (B[1] + C[1]) / 2.0 - 6, "a", 15, S.RED, "start",
           italic=True)
    c.text((A[0] + C[0]) / 2.0 - 12, (A[1] + C[1]) / 2.0 - 2, "b", 15, S.RED, "end",
           italic=True)
    c.text((A[0] + B[0]) / 2.0, A[1] + 24, "c", 15, S.RED, italic=True)
    ang_a = math.degrees(math.atan2(A[1] - C[1], C[0] - A[0]))
    c.arc(A[0], A[1], 34, 0, ang_a, S.GREEN, 1.4, label="α", lr=1.45)
    ang_b = math.degrees(math.atan2(B[1] - C[1], C[0] - B[0]))
    c.arc(B[0], B[1], 38, ang_b, 180, S.GREEN, 1.4, label="β", lr=1.45)
    return c.svg("Rechtwinkliges Dreieck ABC mit dem rechten Winkel bei C, den Seiten a, "
                 "b und c und den Winkeln alpha bei A und beta bei B")


def fig_kreis(thales=False):
    p = S.Plot((-6.4, 6.4), (-6.0, 6.0), w=404, h=378, pad=(30, 22, 18, 30))
    assert abs(p.sx - p.sy) < 1e-9          # same scale on both axes, or the circle is an ellipse
    p.grid(1, 1)
    p.axes(1, 1, defer_labels=True)
    cx, cy = p.P(0, 0)
    r = RADIUS * p.sx
    p.raw('<circle cx="%s" cy="%s" r="%s" fill="none" stroke="%s" stroke-width="2"/>'
          % (S.fmt(cx), S.fmt(cy), S.fmt(r), S.RED))
    if thales:
        p.poly([p.P(*KP), p.P(*KQ), p.P(*KR)], stroke="none", width=0,
               fill=S.GREEN, opacity=0.2)
        p.poly([p.P(*KP), p.P(*KQ), p.P(*KR)], stroke=S.GREEN, width=1.8)
        p.seg(KP, KR, S.GREEN, 1.8)
    else:
        p.raw('<path d="M %s %s L %s %s A %s %s 0 0 0 %s %s Z" fill="%s" opacity="0.35"/>'
              % (S.fmt(cx), S.fmt(cy), S.fmt(p.X(KP[0])), S.fmt(p.Y(KP[1])), S.fmt(r),
                 S.fmt(r), S.fmt(p.X(KQ[0])), S.fmt(p.Y(KQ[1])), S.ORANGE))
        p.seg((0, 0), KP, S.INK, 1.4)
        p.seg((0, 0), KQ, S.INK, 1.4)
    p.draw_labels()
    p.point(*KP, label="P", pos="above-right", color=S.INK)
    p.point(*KQ, label="Q", pos="above-left", color=S.INK)
    if thales:
        p.point(*KR, label="R", pos="below-left", color=S.INK)
    return p.svg("Kreis um den Ursprung mit dem Radius 5 und den Punkten P(3|4) und Q(-4|3)"
                 + ("; dazu R(-3|-4) und das Dreieck PQR" if thales else
                    "; der Kreissektor zwischen P und Q ist hinterlegt"))


def fig_rechteck():
    c = S.Canvas(360, 190)
    x0, y0, w, h = 60, 30, 240, 100                     # 12 : 5
    c.rect(x0, y0, w, h, fill=S.ORANGE, opacity=0.18)
    c.rect(x0, y0, w, h, stroke=S.INK, width=1.6)
    c.line(x0, y0 + h, x0 + w, y0, S.RED, 1.8)
    c.text(x0 + w / 2.0, y0 + h + 22, "a", 15, S.INK, italic=True)
    c.text(x0 + w + 12, y0 + h / 2.0 + 5, "b", 15, S.INK, "start", italic=True)
    c.text(x0 + w / 2.0 + 8, y0 + h / 2.0 - 8, "d = 13 cm", 13, S.RED, "start", halo=S.PAPER)
    c.text(x0 + w / 2.0, y0 + h + 50, "Umfang 34 cm", 13, S.MUTED)
    return c.svg("Rechteck mit den Seiten a und b und der Diagonalen d von 13 Zentimetern, "
                 "Umfang 34 Zentimeter")


# ------------------------------------------------------------------- sheet ---
s = Sheet("blf-gy-teila2", "Teil A — ohne Hilfsmittel (Satz 2)",
          kind="BLF-Training",
          suffix="",
          klasse="Gymnasium · Klasse 10",
          sub="Gymnasium · Klasse 10 · Besondere Leistungsfeststellung Mathematik · Teil A · "
              "25 Minuten, nur Zeichengeräte · drei Aufgaben, Anforderungsbereiche I bis III",
          desc="BLF-Training Mathematik Gymnasium Klasse 10, Teil A ohne Hilfsmittel: "
               "Ankreuzaufgaben zu Trigonometrie, Sinusfunktion, Gleichungssystem und "
               "Abzählen, ein Kreis mit Thales und Gleichungen ohne Rechner, mit Lösungen.",
          plan=("../svp/mathe/blf.html", "Zur Übersicht"))

s.task(
    "Noch viermal ankreuzen", 1,
    r"Bei jeder Teilaufgabe ist genau **eine** der fünf Antworten richtig. Notieren Sie "
    r"nur den Buchstaben. Die Abbildung gehört zu Teilaufgabe a).",
    [
        r"Welche Aussage über das abgebildete Dreieck $ABC$ ist **falsch**? • "
        r"(A) $\sin\alpha = \frac{a}{c}$ • (B) $\cos\alpha = \frac{b}{c}$ • "
        r"(C) $\tan\alpha = \frac{a}{b}$ • (D) $\sin\beta = \frac{a}{c}$ • "
        r"(E) $a^2 + b^2 = c^2$",

        r"Für die in $\mathbb{R}$ definierte Funktion $f$ mit $f(x) = 2 \cdot \sin x + 1$ "
        r"gilt: • (A) Der Wertebereich ist $-1 \leq y \leq 3$. • (B) Die kleinste Periode "
        r"ist $\pi$. • (C) Der Graph ist symmetrisch zur $y$-Achse. • (D) $f(0) = 2$ • "
        r"(E) $x = 0$ ist eine Nullstelle von $f$.",

        r"Das Gleichungssystem $2x + y = 7$ und $x - y = -1$ hat die Lösung: • "
        r"(A) $x = 3;\ y = 1$ • (B) $x = 2;\ y = 3$ • (C) $x = 1;\ y = 5$ • "
        r"(D) $x = 3;\ y = 4$ • (E) $x = -2;\ y = -1$",

        r"Ein Fahrradschloss hat drei Stellräder mit je den Ziffern $0$ bis $9$. Wie viele "
        r"verschiedene Einstellungen gibt es? • (A) $30$ • (B) $100$ • (C) $720$ • "
        r"(D) $1000$ • (E) $59\,049$",
    ],
    [
        r"Falsch ist **(D)**. Für $\beta$ ist $b$ die Gegenkathete, also "
        r"$\sin\beta = \frac{b}{c}$. Der Bruch $\frac{a}{c}$ gehört zu $\cos\beta$. "
        r"(A) bis (C) sind richtig: $a$ liegt $\alpha$ gegenüber, $b$ liegt an $\alpha$ an, "
        r"$c$ ist die Hypotenuse. (E) ist der Satz des Pythagoras mit dem rechten Winkel "
        r"bei $C$.",

        r"Richtig ist **(A)**. $\sin x$ läuft zwischen $-1$ und $1$; verdoppelt sind das "
        r"$-2$ bis $2$, um $1$ nach oben verschoben $-1$ bis $3$. (B) Die Periode bleibt "
        r"$2\pi$, denn vor dem $x$ steht kein Faktor. (C) Der Graph ist nicht "
        r"achsensymmetrisch, denn $f\left(\frac{\pi}{2}\right) = 3$, aber "
        r"$f\left(-\frac{\pi}{2}\right) = -1$. (D) und (E) scheitern an "
        r"$f(0) = 2 \cdot 0 + 1 = 1$.",

        r"Richtig ist **(B)**. Addiert man beide Gleichungen, fällt $y$ weg: $3x = 6$, "
        r"also $x = 2$ und $y = 7 - 4 = 3$. Probe: $2 - 3 = -1$. Die anderen vier "
        r"Paare erfüllen jeweils **nur eine** der beiden Gleichungen, (A) und (C) die "
        r"erste, (D) und (E) die zweite. Eine Probe muss deshalb immer beide Gleichungen "
        r"prüfen.",

        r"Richtig ist **(D)**. Jedes Rad hat unabhängig von den anderen $10$ "
        r"Möglichkeiten, und Ziffern dürfen sich wiederholen: $10 \cdot 10 \cdot 10 = "
        r"1000$. Das sind genau die Zahlen von $000$ bis $999$. (C) $= 10 \cdot 9 \cdot 8$ "
        r"verbietet Wiederholungen, (A) addiert statt zu multiplizieren, und (E) "
        r"$= 3^{10}$ vertauscht Basis und Exponent.",
    ],
    falle=r"Bei a) hilft es, jedes Mal vom Winkel aus zu fragen: Welche Seite liegt "
          r"**gegenüber**, welche **anliegend**? Wer sich „$a$ steht immer oben“ merkt, "
          r"liegt bei $\beta$ falsch.",
    figs=[(fig_dreieck(), "Zu a): Das Dreieck ABC mit dem rechten Winkel bei C.")],
)

s.task(
    "Kreis, Sektor und Thales", 2,
    r"In einem Koordinatensystem liegt ein Kreis mit dem Mittelpunkt $M$ im "
    r"Koordinatenursprung. Er verläuft durch den Punkt $P(3 \mid 4)$. Rechnen Sie ohne "
    r"Taschenrechner; $\pi$ und Wurzeln dürfen im Ergebnis stehen bleiben.",
    [
        r"Geben Sie den Radius des Kreises an.",
        r"Zeigen Sie, dass auch $Q(-4 \mid 3)$ auf dem Kreis liegt und dass die Strecken "
        r"$\overline{MP}$ und $\overline{MQ}$ senkrecht aufeinander stehen.",
        r"Berechnen Sie den Flächeninhalt des Kreissektors zwischen $\overline{MP}$ und "
        r"$\overline{MQ}$ und die Länge des zugehörigen Kreisbogens.",
        r"Ein dritter Punkt $R$ liegt so auf dem Kreis, dass $\angle PQR = 90°$ ist. "
        r"Geben Sie die Länge der Strecke $\overline{PR}$ an und begründen Sie Ihre "
        r"Angabe.",
    ],
    [
        r"Der Radius ist der Abstand von $M(0 \mid 0)$ zu $P$: "
        r"$r = \sqrt{3^2 + 4^2} = \sqrt{25} = 5$.",

        r"$(-4)^2 + 3^2 = 16 + 9 = 25 = r^2$, also hat $Q$ ebenfalls den Abstand $5$ von "
        r"$M$ und liegt auf dem Kreis. Die Gerade $MP$ hat den Anstieg $\frac{4}{3}$, die "
        r"Gerade $MQ$ den Anstieg $\frac{3}{-4} = -\frac{3}{4}$. Das Produkt ist "
        r"$\frac{4}{3} \cdot \left(-\frac{3}{4}\right) = -1$, die beiden Strecken stehen "
        r"also senkrecht aufeinander.",

        r"Der Mittelpunktswinkel beträgt $90°$, der Sektor ist ein Viertelkreis. "
        r"$A = \frac{1}{4} \pi r^2 = \frac{25}{4}\pi$ und "
        r"$b = \frac{1}{4} \cdot 2\pi r = \frac{5}{2}\pi$. Das sind etwa $19{,}6$ "
        r"Flächeneinheiten und $7{,}9$ Längeneinheiten.",

        r"$\overline{PR} = 10$. Nach der Umkehrung des **Satzes des Thales** liegt ein "
        r"rechter Winkel $\angle PQR$ genau dann vor, wenn $\overline{PR}$ ein Durchmesser "
        r"des Kreises ist. Also ist $\overline{PR} = 2r = 10$ und $R$ der Punkt "
        r"$(-3 \mid -4)$ gegenüber von $P$.",
    ],
    falle=r"Bei d) muss man nichts ausrechnen, wenn man Thales erkennt: Der rechte Winkel "
          r"liegt bei $Q$, also ist die Seite **gegenüber** von $Q$ der Durchmesser.",
    figs=[(fig_kreis(), "Der Kreis mit P und Q. Der Sektor zwischen MP und MQ ist "
                        "orange hinterlegt.")],
    solfigs=[(fig_kreis(thales=True),
              "Zu d): R liegt P genau gegenüber. Das Dreieck PQR hat bei Q einen rechten "
              "Winkel.")],
)

s.task(
    "Gleichungen ohne Rechner", 3,
    r"Die vier Teilaufgaben sind unabhängig voneinander und ohne Hilfsmittel zu lösen.",
    [
        r"Das Volumen eines Kegels ist $V = \frac{1}{3} \pi r^2 h$. Stellen Sie die "
        r"Formel nach $h$ um.",
        r"Bestimmen Sie $p$ so, dass $x = -2$ eine Lösung der Gleichung "
        r"$x^2 + p \cdot x - 10 = 0$ ist, und geben Sie die zweite Lösung an.",
        r"Ein Rechteck hat den Umfang $34$ cm, seine Diagonale ist $13$ cm lang. "
        r"Berechnen Sie den Flächeninhalt des Rechtecks.",
        r"Geben Sie alle Werte von $c$ an, für die die Gleichung $x^2 - 6x + c = 0$ **keine** "
        r"reelle Lösung hat. Begründen Sie Ihre Angabe.",
    ],
    [
        r"Mit $3$ multiplizieren und durch $\pi r^2$ teilen: "
        r"$h = \dfrac{3V}{\pi r^2}$.",

        r"Einsetzen: $(-2)^2 + p \cdot (-2) - 10 = 0$, also $4 - 2p - 10 = 0$ und "
        r"$p = -3$. Die Gleichung lautet dann $x^2 - 3x - 10 = 0$, zerlegt "
        r"$(x + 2)(x - 5) = 0$. Die zweite Lösung ist $x = 5$. Nach Vieta passt das: "
        r"$-2 \cdot 5 = -10$ und $-2 + 5 = 3 = -p$.",

        r"Aus dem Umfang folgt $a + b = 17$, aus dem Pythagoras $a^2 + b^2 = 169$. "
        r"Quadriert man die erste Gleichung, erhält man $a^2 + 2ab + b^2 = 289$. "
        r"Zieht man die zweite ab, bleibt $2ab = 120$, also $A = ab = 60\ \mathrm{cm}^2$. "
        r"Die Seiten selbst braucht man dafür nicht; es sind $12$ cm und $5$ cm.",

        r"Quadratisch ergänzen: $x^2 - 6x + c = (x - 3)^2 - 9 + c$. Die Gleichung "
        r"$(x - 3)^2 = 9 - c$ hat keine Lösung, wenn die rechte Seite negativ ist, denn "
        r"ein Quadrat ist nie negativ. Also für alle $c > 9$. Bei $c = 9$ gibt es genau "
        r"eine Lösung ($x = 3$), bei $c < 9$ zwei.",
    ],
    falle=r"Bei c) ist der Umweg über die einzelnen Seiten möglich, aber länger: Man "
          r"müsste eine quadratische Gleichung lösen. Der Trick mit $(a + b)^2$ liefert "
          r"das Produkt $ab$ direkt, und nach dem ist gefragt.",
    figs=[(fig_rechteck(), "Zu c): Das Rechteck mit seiner Diagonalen.")],
)


def check():
    """Every number in the solutions, recomputed - exact where a Fraction can do it."""
    # --- 1 a) Trigonometrie: an einem echten rechtwinkligen Dreieck pruefen -------
    a, b = 3.0, 4.0
    c = math.hypot(a, b)
    alpha, beta = math.atan2(a, b), math.atan2(b, a)            # a gegenueber alpha
    assert abs(alpha + beta - pi / 2) < 1e-12
    assert abs(math.sin(alpha) - a / c) < 1e-12                 # (A) richtig
    assert abs(math.cos(alpha) - b / c) < 1e-12                 # (B) richtig
    assert abs(math.tan(alpha) - a / b) < 1e-12                 # (C) richtig
    assert abs(math.sin(beta) - a / c) > 0.1                    # (D) falsch
    assert abs(math.sin(beta) - b / c) < 1e-12 and abs(math.cos(beta) - a / c) < 1e-12
    assert abs(a * a + b * b - c * c) < 1e-12                   # (E) richtig
    # --- 1 b) Sinusfunktion --------------------------------------------------------
    f = lambda x: 2 * math.sin(x) + 1
    ys = [f(k * 2 * pi / 3600) for k in range(3601)]
    assert abs(min(ys) + 1) < 1e-9 and abs(max(ys) - 3) < 1e-9  # (A)
    assert abs(f(1.0 + pi) - f(1.0)) > 0.5                      # (B) pi ist keine Periode
    assert abs(f(pi / 2) - 3) < 1e-12 and abs(f(-pi / 2) + 1) < 1e-12   # (C)
    assert f(0) == 1                                            # (D), (E)
    # --- 1 c) Gleichungssystem -----------------------------------------------------
    eq1 = lambda x, y: 2 * x + y == 7
    eq2 = lambda x, y: x - y == -1
    opts = {"A": (3, 1), "B": (2, 3), "C": (1, 5), "D": (3, 4), "E": (-2, -1)}
    for k, (x, y) in opts.items():
        assert (eq1(x, y) and eq2(x, y)) == (k == "B"), k
    assert eq1(*opts["A"]) and eq1(*opts["C"]) and not eq2(*opts["A"]) and not eq2(*opts["C"])
    assert eq2(*opts["D"]) and eq2(*opts["E"]) and not eq1(*opts["D"]) and not eq1(*opts["E"])
    # --- 1 d) Abzaehlen ------------------------------------------------------------
    assert len(list(product(range(10), repeat=3))) == 1000
    assert len(list(permutations(range(10), 3))) == 720
    assert 3 * 10 == 30 and 3 ** 10 == 59049
    # --- 2) Kreis ------------------------------------------------------------------
    for pt in (KP, KQ, KR):
        assert pt[0] ** 2 + pt[1] ** 2 == RADIUS ** 2
    assert Fr(KP[1], KP[0]) * Fr(KQ[1], KQ[0]) == -1            # Anstiege 4/3 und -3/4
    assert KP[0] * KQ[0] + KP[1] * KQ[1] == 0                   # dasselbe als Skalarprodukt
    assert Fr(1, 4) * RADIUS ** 2 == Fr(25, 4)                  # Sektor / pi
    assert Fr(1, 4) * 2 * RADIUS == Fr(5, 2)                    # Bogen / pi
    assert round(25 / 4 * pi, 1) == 19.6 and round(5 / 2 * pi, 1) == 7.9
    qp = (KP[0] - KQ[0], KP[1] - KQ[1])
    qr = (KR[0] - KQ[0], KR[1] - KQ[1])
    assert qp[0] * qr[0] + qp[1] * qr[1] == 0                   # rechter Winkel bei Q
    assert math.hypot(KP[0] - KR[0], KP[1] - KR[1]) == 2 * RADIUS == 10
    # --- 3 a) Umstellen ------------------------------------------------------------
    for r, h in ((2.0, 5.0), (0.7, 3.3)):
        V = pi * r * r * h / 3
        assert abs(3 * V / (pi * r * r) - h) < 1e-12
    # --- 3 b) Parameter ------------------------------------------------------------
    p = Fr(-3)
    assert (-2) ** 2 + p * (-2) - 10 == 0
    assert 5 ** 2 + p * 5 - 10 == 0
    assert all((x + 2) * (x - 5) == x * x - 3 * x - 10 for x in range(-5, 6))
    # --- 3 c) Rechteck -------------------------------------------------------------
    assert 2 * (RA + RB) == RU and RA ** 2 + RB ** 2 == RD ** 2
    assert (RU // 2) ** 2 == 289 and RD ** 2 == 169 and 289 - 169 == 120
    assert RA * RB == 60
    # --- 3 d) keine Loesung --------------------------------------------------------
    for cc in (Fr(9), Fr(19, 2), Fr(8), Fr(0)):
        disc = 9 - cc                                           # (x-3)^2 = 9 - c
        n_sol = 0 if disc < 0 else (1 if disc == 0 else 2)
        assert n_sol == (0 if cc > 9 else (1 if cc == 9 else 2))
        assert all((x - 3) ** 2 - 9 + cc == x * x - 6 * x + cc for x in range(-3, 4))


s.verify(check)
s.save()

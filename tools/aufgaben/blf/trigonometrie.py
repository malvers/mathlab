#!/usr/bin/env python3
"""BLF-Training Gymnasium Klasse 10 - Trigonometrie (Teil B, mit MMS).

    python3 tools/aufgaben/blf/trigonometrie.py

Sinussatz, Kosinussatz and the area formula in general triangles - Lernbereich 3 of
Klasse 10 and a fixture of Teil B: a boat and a lighthouse (2023/24), a parallelogram
with its diagonals (2024/25), the angle between two towers (2022/23), a camera and its
field of view (2023/24). Wording, numbers and every figure are our own.
"""
import math
import os
import sys
from math import asin, acos, atan, cos, degrees, radians, sin, sqrt, tan

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from textaufgaben import Sheet                                     # noqa: E402
import svgfig as S                                                 # noqa: E402


# ----------------------------------------------- Aufgabe 1: das Dreieck ------
TA, TB, TC = 8.0, 5.0, None                   # a = BC, b = AC, gamma = 60 degrees
GAMMA = 60.0
TC = sqrt(TA ** 2 + TB ** 2 - 2 * TA * TB * cos(radians(GAMMA)))          # = 7
ALPHA = degrees(acos((TB ** 2 + TC ** 2 - TA ** 2) / (2 * TB * TC)))        # cos = 1/7
BETA = 180 - GAMMA - ALPHA
AREA = 0.5 * TA * TB * sin(radians(GAMMA))                                # 10 sqrt 3
HC = 2 * AREA / TC

# ------------------------------------------------ Aufgabe 2: die Boje --------
AB2, WA, WB = 800.0, 52.0, 71.0               # base line on the shore, two angles
WL = 180 - WA - WB
AL = AB2 * sin(radians(WB)) / sin(radians(WL))
D_SHORE = AL * sin(radians(WA))
AF = AL * cos(radians(WA))
AC2 = AB2 + 300
LC = sqrt(AL ** 2 + AC2 ** 2 - 2 * AL * AC2 * cos(radians(WA)))

# ------------------------------------------------ Aufgabe 3: die Kamera ------
TOWER, DIST, LENS, VIEW = 45.0, 30.0, 1.5, 60.0
UP = degrees(atan((TOWER - LENS) / DIST))
DOWN = degrees(atan(LENS / DIST))


def seen(x):
    """Angle under which the whole tower appears from distance x."""
    return degrees(atan((TOWER - LENS) / x) + atan(LENS / x))


# seen(x) = 60 degrees: tan-addition gives x^2 - (45/sqrt 3) x - 65,25 = 0
_q = TOWER / sqrt(3)
X_MIN = (_q + sqrt(_q ** 2 + 4 * (TOWER - LENS) * LENS)) / 2
X_LEVEL = (TOWER - LENS) / tan(radians(VIEW / 2))


# ----------------------------------------------------------------- figures ---
def fig_dreieck():
    sc = 40.0
    ox, oy = 60, 240
    A = (ox, oy)
    B = (ox + TC * sc, oy)
    C = (ox + TB * cos(radians(ALPHA)) * sc, oy - TB * sin(radians(ALPHA)) * sc)
    c = S.Canvas(420, 290)
    c.raw('<path d="M %s %s L %s %s L %s %s Z" fill="%s" opacity="0.18"/>'
          % (S.fmt(A[0]), S.fmt(A[1]), S.fmt(B[0]), S.fmt(B[1]), S.fmt(C[0]), S.fmt(C[1]),
             S.ORANGE))
    c.poly([A, B, C], stroke=S.INK, width=1.7)
    for p, lab, dx, dy in ((A, "A", -12, 8), (B, "B", 12, 8), (C, "C", 0, -12)):
        c.text(p[0] + dx, p[1] + dy, lab, 15, S.INK, italic=True)
    c.text((B[0] + C[0]) / 2.0 + 10, (B[1] + C[1]) / 2.0 - 4, "a = 8 cm", 13, S.RED,
           "start", halo=S.PAPER)
    c.text((A[0] + C[0]) / 2.0 - 10, (A[1] + C[1]) / 2.0, "b = 5 cm", 13, S.RED, "end",
           halo=S.PAPER)
    c.text((A[0] + B[0]) / 2.0, oy + 22, "c", 15, S.RED, italic=True)
    # gamma between CA and CB, measured counter-clockwise from the x-axis
    a_ca = degrees(math.atan2(-(A[1] - C[1]), A[0] - C[0]))
    a_cb = degrees(math.atan2(-(B[1] - C[1]), B[0] - C[0]))
    c.arc(C[0], C[1], 30, a_cb, a_ca, S.GREEN, 1.5, label="60°", lr=1.6)
    return c.svg("Dreieck ABC mit a gleich 8 cm, b gleich 5 cm und dem Winkel gamma von "
                 "60 Grad bei C; die Seite c ist gesucht")


def fig_boje():
    sc = 0.33
    ox, oy = 40, 300
    A = (ox, oy)
    B = (ox + AB2 * sc, oy)
    Cp = (ox + AC2 * sc, oy)
    L = (ox + AF * sc, oy - D_SHORE * sc)
    F = (L[0], oy)
    c = S.Canvas(460, 340)
    c.rect(0, oy, 460, 40, fill="#E4DCC8", opacity=0.6)                    # the beach
    c.rect(0, 0, 460, oy, fill="#DCE8F5", opacity=0.55)                     # the lake
    c.line(0, oy, 460, oy, S.INK, 1.6)
    c.poly([A, B, L], stroke=S.INK, width=1.5)
    c.line(L[0], L[1], F[0], F[1], S.RED, 1.5, dash="5 4")
    c.line(L[0], L[1], Cp[0], Cp[1], S.GREEN, 1.5, dash="7 4")
    c.arc(A[0], A[1], 34, 0, WA, S.MUTED, 1.3, label="52°", lr=1.55)
    c.arc(B[0], B[1], 30, 180 - WB, 180, S.MUTED, 1.3, label="71°", lr=1.6)
    for p, lab, dx, dy in ((A, "A", -2, 20), (B, "B", -8, 20), (Cp, "C", 0, 20),
                           (L, "L", 0, -12), (F, "F", 10, 20)):
        c.circle(p[0], p[1], 3.2, S.INK)
        c.text(p[0] + dx, p[1] + dy, lab, 14, S.INK, italic=True, halo=S.PAPER)
    c.text(F[0] + 7, (L[1] + F[1]) / 2.0, "d", 15, S.RED, "start", italic=True, halo=S.PAPER)
    c.text((A[0] + B[0]) / 2.0, oy + 34, "800 m", 12.5, S.BODY)
    c.text((B[0] + Cp[0]) / 2.0, oy + 34, "300 m", 12.5, S.BODY)
    return c.svg("Uferlinie mit den Punkten A, B und C, darueber die Boje L; die Winkel "
                 "52 Grad bei A und 71 Grad bei B, gestrichelt der Abstand d zum Ufer")


def fig_kamera():
    sc = 5.4
    ox, oy = 90, 290
    # the tripod is drawn higher than to scale - at 1,5 m it would sit on the ground line
    # and the lower ray would vanish in it; the caption says "nicht massstaeblich"
    Kx, Ky = ox, oy - 28
    Tx, Ty = ox + DIST * sc, oy - TOWER * sc
    c = S.Canvas(440, 330)
    c.line(20, oy, 430, oy, S.INK, 1.6)
    c.rect(Tx - 7, Ty, 14, TOWER * sc, fill=S.MUTED, opacity=0.55)
    c.rect(Tx - 7, Ty, 14, TOWER * sc, stroke=S.INK, width=1.2)
    c.line(Kx, Ky, Tx, Ty, S.RED, 1.4)
    c.line(Kx, Ky, Tx, oy, S.RED, 1.4)
    c.line(Kx, Ky, Tx + 50, Ky, S.MUTED, 1.1, dash="4 3")
    c.line(Kx - 8, oy, Kx, Ky, S.INK, 1.3)                       # tripod legs
    c.line(Kx + 8, oy, Kx, Ky, S.INK, 1.3)
    c.rect(Kx - 9, Ky - 7, 16, 13, fill=S.INK, rx=2)
    up = math.degrees(math.atan2(Ky - Ty, Tx - Kx))
    down = math.degrees(math.atan2(oy - Ky, Tx - Kx))
    c.arc(Kx, Ky, 52, -down, up, S.GREEN, 1.6, label="?", lr=1.3)
    c.arrow(Kx - 26, oy, Kx - 26, Ky, S.MUTED, 1.1)
    c.arrow(Kx - 26, Ky, Kx - 26, oy, S.MUTED, 1.1)
    c.text(Kx - 32, (oy + Ky) / 2.0 + 4, "1,5 m", 11.5, S.MUTED, "end")
    c.text(Tx + 14, (oy + Ty) / 2.0, "45 m", 13, S.BODY, "start")
    c.text((Kx + Tx) / 2.0, oy + 22, "30 m", 13, S.BODY)
    c.text(Tx + 9, Ty - 6, "S", 14, S.INK, "start", italic=True)
    c.text(Tx + 9, oy + 16, "F", 14, S.INK, "start", italic=True)
    c.text(Kx - 4, Ky - 14, "K", 14, S.INK, "end", italic=True)
    return c.svg("Kamera K auf einem Stativ in 1,5 m Hoehe, 30 m vor einem 45 m hohen "
                 "Turm FS; die Strahlen zur Spitze und zum Fusspunkt schliessen den "
                 "gesuchten Winkel ein")


# ------------------------------------------------------------------- sheet ---
s = Sheet("blf-gy-trigonometrie", "Trigonometrie",
          kind="BLF-Training",
          suffix="",
          klasse="Gymnasium · Klasse 10",
          sub="Gymnasium · Klasse 10 · Besondere Leistungsfeststellung Mathematik · Teil B, "
              "mit MMS und Formelsammlung · drei Aufgaben, Anforderungsbereiche I bis III",
          desc="BLF-Training Mathematik Gymnasium Klasse 10: Sinussatz, Kosinussatz und "
               "Flächeninhalt allgemeiner Dreiecke, eine Boje vor dem Ufer und der "
               "Blickwinkel einer Kamera, mit Lösungen und Abbildungen.",
          plan=("../svp/mathe/blf.html", "Zur Übersicht"))

s.task(
    "Ein Dreieck, drei Sätze", 1,
    r"Im Dreieck $ABC$ sind $a = 8$ cm, $b = 5$ cm und $\gamma = 60°$ gegeben "
    r"(siehe Abbildung, nicht maßstäblich).",
    [
        r"Berechnen Sie die Länge der Seite $c$.",
        r"Berechnen Sie die Größen der Winkel $\alpha$ und $\beta$.",
        r"Berechnen Sie den Flächeninhalt des Dreiecks.",
        r"Berechnen Sie die Länge der Höhe $h_c$ auf die Seite $c$.",
    ],
    [
        r"Kosinussatz: $c^2 = a^2 + b^2 - 2ab \cdot \cos\gamma = 64 + 25 - 2 \cdot 8 \cdot 5 "
        r"\cdot 0{,}5 = 49$, also $c = 7$ cm.",

        r"Den Winkel gegenüber der **kürzeren** Seite zuerst, dann ist der Sinussatz "
        r"eindeutig: $\sin\beta = \frac{b \cdot \sin\gamma}{c} = \frac{5 \cdot \sin 60°}{7} "
        r"\approx 0{,}619$, also $\beta \approx 38{,}2°$ (spitz, weil $b < c$ und damit "
        r"$\beta < \gamma$). Dann $\alpha = 180° - 60° - 38{,}2° \approx 81{,}8°$. "
        r"Kontrolle mit dem Kosinussatz: $\cos\alpha = \frac{25 + 49 - 64}{2 \cdot 5 \cdot 7} "
        r"= \frac{1}{7}$, $\alpha \approx 81{,}8°$.",

        r"$A = \frac{1}{2} \cdot a \cdot b \cdot \sin\gamma = \frac{1}{2} \cdot 8 \cdot 5 "
        r"\cdot \sin 60° = 10\sqrt{3} \approx 17{,}3\ \mathrm{cm}^2$.",

        r"Aus $A = \frac{1}{2} \cdot c \cdot h_c$ folgt $h_c = \frac{2A}{c} = "
        r"\frac{20\sqrt{3}}{7} \approx 4{,}95$ cm.",
    ],
    falle=r"Bei b) liefert der Sinussatz für $\alpha$ zunächst $\sin\alpha \approx 0{,}990$, "
          r"und dazu passen **zwei** Winkel, $81{,}8°$ und $98{,}2°$. Der Rechner zeigt nur "
          r"den spitzen. Wer mit dem Winkel gegenüber der kürzeren Seite beginnt oder den "
          r"Kosinussatz nimmt, umgeht diese Falle.",
    figs=[(fig_dreieck(), "Das Dreieck ABC (nicht maßstäblich).")],
)

s.task(
    "Die Boje vor dem Ufer", 2,
    r"Von zwei Punkten $A$ und $B$ an einem geraden Seeufer, die $800$ m voneinander "
    r"entfernt sind, wird eine Boje $L$ angepeilt. Es gilt $\angle BAL = 52°$ und "
    r"$\angle ABL = 71°$ (siehe Abbildung). Der Punkt $F$ ist der Punkt des Ufers, der "
    r"der Boje am nächsten liegt.",
    [
        r"Berechnen Sie die Entfernung der Boje vom Punkt $A$.",
        r"Berechnen Sie den kürzesten Abstand $d$ der Boje vom Ufer.",
        r"Berechnen Sie die Entfernung des Punktes $F$ vom Punkt $A$.",
        r"Der Punkt $C$ liegt auf dem Ufer $300$ m hinter $B$. Ein Boot fährt geradlinig "
        r"von der Boje nach $C$. Berechnen Sie die Länge dieser Strecke.",
    ],
    [
        r"Der Winkel bei $L$ ist $180° - 52° - 71° = 57°$. Sinussatz: "
        r"$\overline{AL} = \frac{800 \cdot \sin 71°}{\sin 57°} \approx 902$ m.",

        r"Im rechtwinkligen Dreieck $AFL$ ist $d$ die Gegenkathete von $52°$: "
        r"$d = \overline{AL} \cdot \sin 52° \approx 902 \cdot 0{,}788 \approx 711$ m.",

        r"$\overline{AF} = \overline{AL} \cdot \cos 52° \approx 555$ m. Der Punkt $F$ liegt "
        r"also zwischen $A$ und $B$, näher an $B$.",

        r"Kosinussatz im Dreieck $ALC$ mit $\overline{AC} = 1100$ m: "
        r"$\overline{LC}^2 = 902^2 + 1100^2 - 2 \cdot 902 \cdot 1100 \cdot \cos 52°$, "
        r"also $\overline{LC} \approx 895$ m. Zweiter Weg über Pythagoras: "
        r"$\overline{FC} \approx 1100 - 555 = 545$ m und "
        r"$\overline{LC} = \sqrt{711^2 + 545^2} \approx 896$ m. Der eine Meter "
        r"Unterschied kommt allein von den gerundeten Zwischenwerten.",
    ],
    falle=r"Mit gerundeten Zwischenergebnissen weicht das Ergebnis in d) um einen Meter ab. "
          r"Im MMS mit gespeicherten Werten weiterrechnen und erst die Antwort runden.",
    figs=[(fig_boje(), "Das Ufer mit A, B und C, die Boje L und der Abstand d "
                       "(nicht maßstäblich).")],
)

s.task(
    "Passt der Turm aufs Foto?", 3,
    r"Eine Kamera $K$ steht auf einem Stativ in $1{,}5$ m Höhe, $30$ m vom Fuß $F$ eines "
    r"$45$ m hohen Turms entfernt. Das Objektiv hat einen senkrechten Öffnungswinkel von "
    r"$60°$: Auf dem Foto erscheint alles, was innerhalb dieses Winkels liegt. Die Kamera "
    r"darf geneigt werden, wenn nichts anderes gesagt ist.",
    [
        r"Berechnen Sie den Winkel, unter dem die Turmspitze $S$ von $K$ aus über der "
        r"Waagerechten erscheint.",
        r"Untersuchen Sie, ob der Turm von $K$ aus in voller Höhe auf ein Foto passt.",
        r"Ermitteln Sie den kleinsten Abstand vom Turm, aus dem der ganze Turm gerade noch "
        r"auf ein Foto passt.",
        r"Die Kamera wird nun waagerecht gehalten, die Bildmitte zeigt also waagerecht nach "
        r"vorn. Begründen Sie, dass der Turm aus $30$ m Entfernung dann nicht vollständig "
        r"auf das Foto passt, und berechnen Sie, ab welchem Abstand es gelingt.",
    ],
    [
        r"Die Spitze liegt $45 - 1{,}5 = 43{,}5$ m über dem Objektiv: "
        r"$\tan\varepsilon = \frac{43{,}5}{30}$, also $\varepsilon \approx 55{,}4°$.",

        r"Der Fußpunkt liegt $1{,}5$ m unter dem Objektiv: $\tan\delta = \frac{1{,}5}{30}$, "
        r"$\delta \approx 2{,}9°$. Der Turm erscheint unter "
        r"$\angle FKS \approx 55{,}4° + 2{,}9° = 58{,}3°$. Das ist weniger als $60°$: Der "
        r"Turm passt knapp auf das Foto, wenn die Kamera passend geneigt wird.",

        r"Gesucht ist $x$ mit $\arctan\frac{43{,}5}{x} + \arctan\frac{1{,}5}{x} = 60°$. "
        r"Das MMS liefert $x \approx 28{,}3$ m. Näher heran darf die Kamera nicht, denn "
        r"der Winkel wird mit kleinerem Abstand größer.",

        r"Waagerecht gehalten reicht das Bild nur $30°$ über die Waagerechte. Die Spitze "
        r"erscheint aber unter $55{,}4°$ und liegt damit außerhalb. Es gelingt, sobald "
        r"$\frac{43{,}5}{x} \leq \tan 30°$ ist, also ab "
        r"$x = \frac{43{,}5}{\tan 30°} = 43{,}5 \cdot \sqrt{3} \approx 75{,}3$ m. Der "
        r"Fußpunkt liegt dann nur $1{,}1°$ unter der Waagerechten und ist ebenfalls im Bild.",
    ],
    falle=r"Der Öffnungswinkel ist der Winkel zwischen den **beiden Randstrahlen**, nicht "
          r"der Winkel zur Spitze allein. In b) gehört deshalb der kleine Winkel nach unten "
          r"zum Fußpunkt dazu, und genau der entscheidet, dass es mit $58{,}3°$ noch passt.",
    figs=[(fig_kamera(), "Die Kamera K und der Turm FS (nicht maßstäblich). Gesucht ist der "
                         "Winkel zwischen den beiden roten Strahlen.")],
)


def check():
    """Every number in the solutions, recomputed."""
    # --- Aufgabe 1 -----------------------------------------------------------------
    assert abs(TC - 7) < 1e-12 and abs(TC ** 2 - 49) < 1e-9
    assert abs(cos(radians(ALPHA)) - 1 / 7) < 1e-12
    sb = TB * sin(radians(GAMMA)) / TC
    assert round(sb, 3) == 0.619 and abs(degrees(asin(sb)) - BETA) < 1e-9
    assert round(BETA, 1) == 38.2 and round(ALPHA, 1) == 81.8
    assert round(180 - 60 - round(BETA, 1), 1) == 81.8
    sa = TA * sin(radians(GAMMA)) / TC
    assert round(sa, 3) == 0.990 and round(180 - degrees(asin(sa)), 1) == 98.2
    assert TB < TC                                              # beta < gamma, spitz
    assert abs(AREA - 10 * sqrt(3)) < 1e-12 and round(AREA, 1) == 17.3
    assert abs(HC - 20 * sqrt(3) / 7) < 1e-12 and round(HC, 2) == 4.95
    # Hoehe von C ueber AB im Koordinatenbild stimmt
    assert abs(TB * sin(radians(ALPHA)) - HC) < 1e-12
    # --- Aufgabe 2 -----------------------------------------------------------------
    assert WL == 57
    assert round(AL) == 902 and round(D_SHORE) == 711 and round(AF) == 555
    assert round(sin(radians(52)), 3) == 0.788
    assert 0 < AF < AB2                                         # F zwischen A und B
    assert AF > AB2 / 2                                         # naeher an B
    assert round(LC) == 895
    assert abs(sqrt(D_SHORE ** 2 + (AC2 - AF) ** 2) - LC) < 1e-9   # beide Wege gleich
    assert round(AC2 - AF) == 545
    rounded = sqrt(711 ** 2 + 545 ** 2)
    assert round(rounded) == 896 and round(LC) == 895          # die Falle: gerundet
    # --- Aufgabe 3 -----------------------------------------------------------------
    assert round(UP, 1) == 55.4 and round(DOWN, 1) == 2.9
    assert round(seen(DIST), 1) == 58.3 and seen(DIST) < VIEW
    assert abs(seen(X_MIN) - VIEW) < 1e-9 and round(X_MIN, 1) == 28.3
    assert seen(X_MIN - 0.5) > VIEW > seen(X_MIN + 0.5)        # monoton fallend
    assert all(seen(x) > seen(x + 1) for x in range(5, 100))
    # Kontrolle ueber den Kosinussatz im Dreieck FKS
    kt = sqrt(DIST ** 2 + (TOWER - LENS) ** 2)
    kf = sqrt(DIST ** 2 + LENS ** 2)
    ang = degrees(acos((kt ** 2 + kf ** 2 - TOWER ** 2) / (2 * kt * kf)))
    assert abs(ang - seen(DIST)) < 1e-9
    assert UP > VIEW / 2                                        # waagerecht: Spitze fehlt
    assert abs(X_LEVEL - 43.5 * sqrt(3)) < 1e-9 and round(X_LEVEL, 1) == 75.3
    assert round(degrees(atan(LENS / X_LEVEL)), 1) == 1.1


s.verify(check)
s.save()

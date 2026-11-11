#!/usr/bin/env python3
"""Vergleichsarbeit-Training BGY Klasse 11 - Trigonometrie und Koerper (Teil B, mit MMS).

    python3 tools/aufgaben/va/geometrie.py

Right triangles and solids, the sine and cosine rule in composite figures, a pyramid and a
cone with a statement to judge - the geometry that turns up in Teil B of every VA, in B2
next to stochastics and inside the long context task B3 (Lernbereich 2 of Klasse 11).
Task types follow the originals of 2022-2025; wording, numbers and every figure are our own.
"""
import math
import os
import sys
from math import acos, asin, atan, ceil, cos, degrees, pi, radians, sin, sqrt, tan

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from textaufgaben import Sheet                                     # noqa: E402
import svgfig as S                                                 # noqa: E402


# --------------------------------------- Aufgabe 1: Slipanlage Kriebstein ----
RL, RH, RW = 14.0, 1.8, 4.5                    # horizontal run, rise, width in m
TRUCK, BUCKET, LIMIT = 8.0, 10.0, 15.0         # m^3 per truck, m^2 per bucket, max %
R_S = sqrt(RL ** 2 + RH ** 2)
R_ANG = degrees(atan(RH / RL))
R_PCT = RH / RL * 100
R_G = RL * RH / 2
R_V = R_G * RW
R_AREA = R_S * RW
ZF = 2.5                                        # height drawn 2.5 times too high

# --------------------------------------------- Aufgabe 2: Bastei -------------
PQ, AL_P, AL_Q = 140.0, 31.0, 47.0             # base line, elevation angles in degrees
B_ANG = AL_Q - AL_P
QB = PQ * sin(radians(AL_P)) / sin(radians(B_ANG))
HB = QB * sin(radians(AL_Q))
FQ = QB * cos(radians(AL_Q))
BL, BK, G_B = 3.2, 4.9, 28.0                   # map: km, km, degrees
LK = sqrt(BL ** 2 + BK ** 2 - 2 * BL * BK * cos(radians(G_B)))
SIN_L = BK * sin(radians(G_B)) / LK
LAM = degrees(acos((BL ** 2 + LK ** 2 - BK ** 2) / (2 * BL * LK)))

# ------------------------------------------ Aufgabe 3: Turmdach Goerlitz -----
TA, TS = 8.0, 9.0                               # base edge, lateral edge in m
T_HD = TA * sqrt(2) / 2                         # half diagonal = radius of the circumcircle
T_H = sqrt(TS ** 2 - T_HD ** 2)                 # = 7
T_HS = sqrt(T_H ** 2 + (TA / 2) ** 2)           # = sqrt 65
T_FACE = degrees(atan(T_H / (TA / 2)))
T_EDGE = degrees(atan(T_H / T_HD))
T_ROOF = 4 * TA * T_HS / 2
K_M = sqrt(T_HD ** 2 + T_H ** 2)                # slant line of the cone, = 9
K_OMEGA = 2 * degrees(atan(T_HD / T_H))
K_ROOF = pi * T_HD * K_M
K_IN = pi * (TA / 2) * T_HS                     # cone over the incircle


# ----------------------------------------------------------------- figures ---
RAMP_SOLID = dict(w=480, h=250, scale=25, ox=72, oy=150)


def ramp_points():
    """Corners of the ramp - x towards the reader, y along the run, z (overdrawn) up."""
    z = RH * ZF
    return {"A": (RW, 0, 0), "B": (RW, RL, 0), "C": (RW, RL, z),
            "D": (0, 0, 0), "E": (0, RL, 0), "F": (0, RL, z)}


def fig_rampe():
    sd = S.Solid(**RAMP_SOLID)
    p = ramp_points()
    A, B, C, D, E, F = (p[k] for k in "ABCDEF")
    sd.shade([A, C, F, D], S.GREEN, 0.22)                  # the sloping deck
    sd.shade([A, B, C], S.MUTED, 0.20)                     # front face
    sd.shade([B, E, F, C], S.MUTED, 0.10)
    sd.edges([(A, B), (B, C), (A, C), (A, D), (D, F), (C, F), (B, E), (E, F)])
    sd.edge(D, E, S.MUTED, 1.2, dash="5 4")
    for k, pos in (("A", "below-left"), ("B", "below"), ("C", "above-left"),
                   ("D", "above-left"), ("E", "right"), ("F", "above-right")):
        sd.vertex(p[k], k, pos, size=2.6)
    sd.label3((RW, RL / 2, 0), "14,0 m", 0, 20, 12.5, S.BODY)
    sd.label3((RW, RL, RH * ZF * 0.78), "1,8 m", -8, 4, 12.5, S.BODY, anchor="end")
    sd.label3((RW / 2, RL, 0), "4,5 m", 10, 14, 12.5, S.BODY, anchor="start")
    sd.label3((RW, RL * 0.55, RH * ZF * 0.55), "s", -2, -9, 15, S.RED, italic=True)
    a = sd.P(A)
    sd.arc(a[0], a[1], 58, 0, degrees(atan(RH * ZF / RL)), S.RED, 1.4, label="α", lr=1.25)
    return sd.svg("Schraegbild der Rampe als dreiseitiges Prisma: 14,0 m lang, 1,8 m hoch, "
                  "4,5 m breit; die schraege Fahrflaeche s ist gruen")


BASTEI_SC = 1.05                                # px per metre, both directions


def fig_bastei():
    sc = BASTEI_SC
    fx, gy = 400, 236                           # foot point F on screen, ground line
    F = (fx, gy)
    B = (fx, gy - HB * sc)
    Q = (fx - FQ * sc, gy)
    P = (Q[0] - PQ * sc, gy)
    c = S.Canvas(470, 270)
    # the rock face under the platform and the river in front of it
    c.poly([(fx - 6, gy), (fx - 2, gy - 60), (fx - 9, gy - 112), (fx - 3, B[1] + 42),
            (fx - 10, B[1] + 12), (fx, B[1]), (fx + 24, B[1] - 3), (fx + 32, B[1] + 28),
            (fx + 48, B[1] + 70), (fx + 54, gy - 44), (fx + 66, gy)],
           stroke="none", fill=S.MUTED, opacity=0.25)
    c.rect(Q[0] + 22, gy - 4, fx - Q[0] - 34, 8, fill="#9CC3E6", opacity=0.7)
    c.line(10, gy, 462, gy, S.INK, 1.4)
    c.line(P[0], P[1], B[0], B[1], S.RED, 1.5)
    c.line(Q[0], Q[1], B[0], B[1], S.RED, 1.5)
    c.line(B[0], B[1], F[0], F[1], S.INK, 1.3, dash="5 4")
    c.rect(fx - 9, gy - 9, 9, 9, stroke=S.INK, width=1)        # right angle at F
    c.arc(P[0], P[1], 46, 0, AL_P, S.GREEN, 1.4, label="31°", lr=1.45)
    c.arc(Q[0], Q[1], 34, 0, AL_Q, S.GREEN, 1.4, label="47°", lr=1.55)
    for pt, lab, dx, dy in ((P, "P", 0, 20), (Q, "Q", 0, 20), (F, "F", 10, 20),
                            (B, "B", -10, -6)):
        c.circle(pt[0], pt[1], 3.2, S.INK)
        c.text(pt[0] + dx, pt[1] + dy, lab, 14, S.INK, italic=True, halo=S.PAPER)
    c.text((P[0] + Q[0]) / 2.0, gy + 20, "140 m", 12.5, S.BODY)
    c.text(fx + 8, (B[1] + gy) / 2.0, "h", 15, S.INK, "start", italic=True, halo=S.PAPER)
    c.text((fx + Q[0]) / 2.0 + 14, gy - 12, "Elbe", 11.5, S.MUTED, halo=S.PAPER)
    return c.svg("Seitenansicht: von P und Q am Elbufer wird die Plattform B unter 31 Grad "
                 "und 47 Grad angepeilt; P und Q sind 140 m voneinander entfernt, F liegt "
                 "senkrecht unter B")


KARTE_SC = 46.0                                 # px per km


def inner_arc(c, v, p, q, r, color, label, lr):
    """Arc for the angle p-v-q inside the triangle - Canvas.arc takes two directions
    counter-clockwise, so the start is chosen that the span stays below 180 degrees."""
    a = degrees(math.atan2(-(p[1] - v[1]), p[0] - v[0]))
    b = degrees(math.atan2(-(q[1] - v[1]), q[0] - v[0]))
    if (b - a) % 360 > 180:
        a, b = b, a
    b = a + (b - a) % 360
    c.arc(v[0], v[1], r, a, b, color, 1.4, label=label, lr=lr)


def karte_points():
    """Bastei on top; bearings clockwise from north, screen y grows to the south.
    The two bearings 166 and 194 degrees are 28 degrees apart, as in the text."""
    B = (150.0, 34.0)
    L = (B[0] + BL * KARTE_SC * sin(radians(166)), B[1] - BL * KARTE_SC * cos(radians(166)))
    K = (B[0] + BK * KARTE_SC * sin(radians(194)), B[1] - BK * KARTE_SC * cos(radians(194)))
    return B, L, K


def fig_karte():
    B, L, K = karte_points()
    c = S.Canvas(300, 290)
    c.poly([B, L, K], stroke="none", fill=S.ORANGE, opacity=0.22)
    c.line(B[0], B[1], L[0], L[1], S.INK, 1.6)
    c.line(B[0], B[1], K[0], K[1], S.INK, 1.6)
    c.line(L[0], L[1], K[0], K[1], S.RED, 1.6, dash="6 4")
    inner_arc(c, B, L, K, 44, S.GREEN, "28°", 1.45)
    inner_arc(c, L, B, K, 20, S.RED, "λ", 1.8)
    for pt, lab, dx, dy, anchor in ((B, "B  Bastei", 10, -2, "start"),
                                    (L, "L  Lilienstein", 10, 14, "start"),
                                    (K, "K  Königstein", -10, 14, "end")):
        c.circle(pt[0], pt[1], 3.4, S.INK)
        c.text(pt[0] + dx, pt[1] + dy, lab, 12.5, S.INK, anchor, halo=S.PAPER)
    c.text((B[0] + L[0]) / 2.0 + 10, (B[1] + L[1]) / 2.0 + 4, "3,2 km", 12.5, S.BODY,
           "start", halo=S.PAPER)
    c.text((B[0] + K[0]) / 2.0 - 10, (B[1] + K[1]) / 2.0 + 4, "4,9 km", 12.5, S.BODY,
           "end", halo=S.PAPER)
    # north arrow
    c.arrow(272, 74, 272, 30, S.MUTED, 1.3)
    c.text(272, 90, "N", 12, S.MUTED)
    return c.svg("Kartenskizze: von der Bastei B sind es 3,2 km zum Lilienstein L und 4,9 km "
                 "zur Festung Koenigstein K, die Richtungen schliessen 28 Grad ein")


TURM_SOLID = dict(w=430, h=335, scale=25, ox=150, oy=196)


def turm_points():
    a, h = TA, T_H
    return {"A": (a, 0, 0), "B": (a, a, 0), "C": (0, a, 0), "D": (0, 0, 0),
            "M": (a / 2, a / 2, 0), "S": (a / 2, a / 2, h), "E": (a, a / 2, 0)}


def fig_turmdach():
    p = turm_points()
    A, B, C, D, M, Sp, E = (p[k] for k in "ABCDMSE")
    sd = S.Solid(**TURM_SOLID)
    sd.shade([A, B, Sp], S.ORANGE, 0.32)
    sd.shade([B, C, Sp], S.ORANGE, 0.18)
    sd.edges([(A, B), (B, C), (A, Sp), (B, Sp), (C, Sp)])
    sd.edges([(A, D), (D, C), (D, Sp)], color=S.MUTED, dash="5 4")
    sd.edge(M, Sp, S.RED, 1.6, dash="4 3")
    sd.edge(E, Sp, S.GREEN, 1.6, dash="4 3")
    sd.edge(M, E, S.MUTED, 1.0, dash="3 3")
    for k, pos in (("A", "left"), ("B", "right"), ("C", "right"), ("D", "below-right"),
                   ("S", "above")):
        sd.vertex(p[k], k, pos)
    sd.vertex(M, "M", "below", color=S.MUTED, size=2.4)
    sd.vertex(E, "E", "below", color=S.GREEN, size=2.4)
    sd.label3((TA, TA * 0.8, 0), "8 m", 0, 20, 12.5, S.BODY)
    sd.label3((0.4 * B[0] + 0.6 * Sp[0], 0.4 * B[1] + 0.6 * Sp[1], 0.6 * T_H), "9 m", 10, 2,
              12.5, S.BODY, anchor="start")
    sd.label3((TA / 2, TA / 2, T_H * 0.62), "h", -7, 4, 15, S.RED, anchor="end",
              italic=True)
    return sd.svg("Schraegbild des Turmdachs als quadratische Pyramide ABCDS mit Grundkante "
                  "8 m und Seitenkante 9 m; rot die Hoehe h, gruen die Hoehe einer "
                  "Dachflaeche")


def fig_kegel():
    sc = 15.0
    top = S.Canvas(250, 215)
    cx, cy = 125, 100
    r_out, r_in, half = T_HD * sc, TA / 2 * sc, TA / 2 * sc
    top.raw('<circle cx="%s" cy="%s" r="%s" fill="%s" opacity="0.18"/>'
            % (cx, cy, S.fmt(r_out), S.ORANGE))
    top.raw('<circle cx="%s" cy="%s" r="%s" fill="none" stroke="%s" stroke-width="1.6"/>'
            % (cx, cy, S.fmt(r_out), S.RED))
    top.raw('<circle cx="%s" cy="%s" r="%s" fill="none" stroke="%s" stroke-width="1.3" '
            'stroke-dasharray="5 4"/>' % (cx, cy, S.fmt(r_in), S.MUTED))
    top.rect(cx - half, cy - half, 2 * half, 2 * half, fill=S.MUTED, opacity=0.18)
    top.rect(cx - half, cy - half, 2 * half, 2 * half, fill="none", stroke=S.INK,
             width=1.6)
    top.line(cx, cy, cx + half, cy - half, S.RED, 1.4)
    top.circle(cx, cy, 2.6, S.INK)
    top.text(cx + half / 2.0 + 10, cy - half / 2.0 + 2, "r", 14, S.RED, "start",
             italic=True, halo=S.PAPER)
    top.text(cx, cy + half + 18, "8 m", 12, S.BODY, halo=S.PAPER)
    top.text(cx, cy + 4 + r_out + 14, "Umkreis", 11.5, S.RED, halo=S.PAPER)
    side = S.Canvas(270, 170)
    bx, by = 135, 140
    rr, hh = T_HD * sc, T_H * sc
    apex = (bx, by - hh)
    side.poly([(bx - rr, by), (bx + rr, by), apex], stroke="none", fill=S.ORANGE,
              opacity=0.22)
    side.poly([(bx - rr, by), (bx + rr, by), apex], stroke=S.INK, width=1.6)
    side.line(bx, by, apex[0], apex[1], S.RED, 1.3, dash="4 3")
    a_l = degrees(math.atan2(-(by - apex[1]), (bx - rr) - apex[0]))
    a_r = degrees(math.atan2(-(by - apex[1]), (bx + rr) - apex[0]))
    side.arc(apex[0], apex[1], 30, a_l, a_r, S.GREEN, 1.4, label="ω", lr=1.55)
    side.text(bx + 6, by - hh * 0.22, "7 m", 12, S.RED, "start", halo=S.PAPER)
    side.text(bx + rr / 2.0 + 12, by - hh / 2.0 - 6, "9 m", 12, S.BODY, "start",
              halo=S.PAPER)
    side.text(bx - rr / 2.0, by + 18, "r ≈ 5,66 m", 12, S.BODY, halo=S.PAPER)
    return (top.svg("Draufsicht: das Turmquadrat mit 8 m Seitenlaenge, sein Umkreis und "
                    "gestrichelt sein Inkreis"),
            side.svg("Achsenschnitt des Kegels mit Hoehe 7 m, Mantellinie 9 m und dem "
                     "Oeffnungswinkel omega"))


# ------------------------------------------------------------------- sheet ---
KEGEL = fig_kegel()
s = Sheet("va-bgy11-geometrie", "Trigonometrie und Körper",
          kind="Vergleichsarbeit-Training",
          suffix="",
          klasse="Berufliches Gymnasium · Klasse 11",
          sub="Berufliches Gymnasium · Klasse 11 · Vergleichsarbeit Mathematik · Teil B · "
              "mit MMS und Formelsammlung · drei Aufgaben, Anforderungsbereiche I bis III",
          desc="Vergleichsarbeit-Training Mathematik BGY Klasse 11: ein rechtwinkliges "
               "Dreieck und ein Prisma an der Talsperre Kriebstein, Sinus- und Kosinussatz "
               "an der Bastei, ein Turmdach in Görlitz als Pyramide und als Kegel, mit "
               "Lösungen und Abbildungen.",
          plan=("../svp/mathe/vergleichsarbeit.html", "Zur Übersicht"))

s.task(
    "Die Slipanlage an der Talsperre Kriebstein", 1,
    r"An der Talsperre Kriebstein wird eine Slipanlage gebaut, über die Boote ins Wasser "
    r"gelassen werden. Die Rampe ist ein gerades dreiseitiges Prisma aus Beton mit einem "
    r"rechtwinkligen Dreieck als Grundfläche: Sie steigt auf $14{,}0$ m waagerechter Länge "
    r"um $1{,}8$ m an und ist $4{,}5$ m breit (siehe Abbildung, nicht maßstäblich).",
    [
        r"Berechnen Sie die Länge $s$ der schrägen Fahrfläche und den Neigungswinkel "
        r"$\alpha$ der Rampe.",
        r"Ein Ratgeber empfiehlt für Slipanlagen eine Steigung von höchstens $15\ \%$. "
        r"Prüfen Sie, ob die Rampe diese Empfehlung einhält.",
        r"Berechnen Sie das Betonvolumen der Rampe. Ein Fahrmischer bringt höchstens "
        r"$8\ \mathrm{m}^3$ Beton je Fahrt. Ermitteln Sie die Anzahl der nötigen Fahrten.",
        r"Die Fahrfläche erhält eine rutschfeste Beschichtung, ein Eimer reicht für "
        r"$10\ \mathrm{m}^2$. Ermitteln Sie, wie viele Eimer gekauft werden müssen.",
    ],
    [
        r"Pythagoras im rechtwinkligen Dreieck: $s = \sqrt{14{,}0^2 + 1{,}8^2} = "
        r"\sqrt{199{,}24} \approx 14{,}1$ m. Neigungswinkel: "
        r"$\tan\alpha = \frac{1{,}8}{14{,}0}$, also $\alpha \approx 7{,}3°$.",

        r"Die Steigung ist das Verhältnis von Höhe zu waagerechter Länge: "
        r"$\frac{1{,}8}{14{,}0} \approx 0{,}129$, also $12{,}9\ \%$. Das ist weniger als "
        r"$15\ \%$, die Rampe hält die Empfehlung ein.",

        r"Grundfläche: $G = \frac{1}{2} \cdot 14{,}0 \cdot 1{,}8 = 12{,}6\ \mathrm{m}^2$. "
        r"Volumen: $V = G \cdot 4{,}5 = 56{,}7\ \mathrm{m}^3$. Fahrten: "
        r"$\frac{56{,}7}{8} \approx 7{,}1$. Nach sieben Fahrten fehlen noch "
        r"$0{,}7\ \mathrm{m}^3$, es sind also **8 Fahrten** nötig.",

        r"Die Fahrfläche ist ein Rechteck mit den Seiten $s$ und $4{,}5$ m: "
        r"$A = s \cdot 4{,}5 \approx 63{,}5\ \mathrm{m}^2$; mit dem gerundeten Wert "
        r"$s = 14{,}1$ m sind es $63{,}45\ \mathrm{m}^2$. Sechs Eimer reichen in beiden "
        r"Fällen nur für $60\ \mathrm{m}^2$, also müssen **7 Eimer** gekauft werden.",
    ],
    falle=r"Bei b) sind $12{,}9\ \%$ **kein** Winkel von $12{,}9°$. Die Steigung in Prozent "
          r"ist $\tan\alpha$, der Winkel selbst ist nur $7{,}3°$. Bei c) und d) wird "
          r"**aufgerundet**, auch wenn die Nachkommastelle klein ist: $7{,}1$ Fahrten heißen "
          r"$8$ Fahrten.",
    figs=[(fig_rampe(), "Die Rampe als Prisma (nicht maßstäblich, die Höhe ist überhöht "
                        "gezeichnet).")],
)

s.task(
    "Peilung zur Bastei", 2,
    r"Von zwei Punkten $P$ und $Q$ am Elbufer gegenüber der Bastei wird die "
    r"Aussichtsplattform $B$ angepeilt. $P$ und $Q$ liegen $140$ m auseinander auf einer "
    r"waagerechten Geraden durch den Punkt $F$, der auf Höhe des Elbufers senkrecht unter "
    r"$B$ liegt. Von $P$ aus erscheint $B$ unter dem Höhenwinkel $31°$, von $Q$ aus unter "
    r"$47°$ (Abbildung 1). Auf einer Wanderkarte (Abbildung 2) misst man von der Bastei "
    r"aus $3{,}2$ km bis zum Lilienstein $L$ und $4{,}9$ km bis zur Festung Königstein "
    r"$K$; die beiden Richtungen schließen einen Winkel von $28°$ ein.",
    [
        r"Begründen Sie, dass das Dreieck $PQB$ bei $B$ einen Winkel von $16°$ hat, und "
        r"berechnen Sie die Länge der Strecke $\overline{QB}$.",
        r"Berechnen Sie, wie hoch die Plattform über dem Elbufer liegt.",
        r"Berechnen Sie die Entfernung zwischen dem Lilienstein und der Festung Königstein.",
        r"Berechnen Sie die Größe des Winkels $\lambda$, unter dem man vom Lilienstein aus "
        r"die Bastei und die Festung Königstein sieht.",
    ],
    [
        r"Im Dreieck $PQB$ ist der Winkel bei $Q$ der Nebenwinkel von $47°$, also "
        r"$180° - 47° = 133°$. Winkelsumme: $180° - 31° - 133° = 16°$. Sinussatz: "
        r"$\overline{QB} = \frac{140 \cdot \sin 31°}{\sin 16°} \approx 261{,}6$ m.",

        r"Im rechtwinkligen Dreieck $QFB$ ist die Höhe $h = \overline{FB}$ die "
        r"Gegenkathete von $47°$: $h = 261{,}6 \cdot \sin 47° \approx 191{,}3$ m. Die "
        r"Plattform liegt rund $191$ m über dem Elbufer. Wer $\overline{QB}$ auf $262$ m "
        r"gerundet hat, erhält $191{,}6$ m, also knapp $192$ m; beides ist richtig "
        r"gerechnet. Zweiter Weg ohne Sinussatz: Mit $x = \overline{FQ}$ gilt "
        r"$h = x \cdot \tan 47°$ und $h = (x + 140) \cdot \tan 31°$. Gleichsetzen ergibt "
        r"$x \approx 178{,}4$ m und wieder $h \approx 191{,}3$ m.",

        r"Kosinussatz im Dreieck $BLK$: $\overline{LK}^2 = 3{,}2^2 + 4{,}9^2 - 2 \cdot 3{,}2 "
        r"\cdot 4{,}9 \cdot \cos 28° \approx 6{,}561$, also $\overline{LK} \approx 2{,}56$ km.",

        r"Sinussatz: $\sin\lambda = \frac{4{,}9 \cdot \sin 28°}{2{,}561} \approx 0{,}898$. "
        r"Der Rechner liefert $63{,}9°$. Doch $\lambda$ liegt der **längsten** Seite "
        r"$\overline{BK}$ gegenüber und ist deshalb der größte Winkel im Dreieck; mit "
        r"$63{,}9°$ bliebe für $K$ der größere Winkel $88{,}1°$. Also gilt "
        r"$\lambda = 180° - 63{,}9° \approx 116{,}1°$. Kontrolle mit dem Kosinussatz: "
        r"$\cos\lambda = \frac{3{,}2^2 + 2{,}561^2 - 4{,}9^2}{2 \cdot 3{,}2 \cdot 2{,}561} "
        r"\approx -0{,}440$, also $\lambda \approx 116{,}1°$. Mit dem gerundeten Wert "
        r"$2{,}56$ km ergibt sich $116{,}0°$.",
    ],
    falle=r"Der Sinussatz liefert zu $\sin\lambda \approx 0{,}898$ **zwei** Winkel, "
          r"$63{,}9°$ und $116{,}1°$; der Rechner zeigt nur den spitzen. Liegt der gesuchte "
          r"Winkel der längsten Seite gegenüber, ist der Kosinussatz der sichere Weg: Ein "
          r"negativer Kosinus verrät den stumpfen Winkel sofort.",
    figs=[(fig_bastei(), "Abbildung 1: die Peilung vom Elbufer aus (Seitenansicht)."),
          (fig_karte(), "Abbildung 2: Kartenskizze mit Bastei, Lilienstein und Festung "
                        "Königstein (nicht maßstäblich).")],
)

s.task(
    "Ein neues Turmdach in Görlitz", 3,
    r"Ein Turm in der Görlitzer Altstadt hat einen quadratischen Grundriss mit $8$ m "
    r"Seitenlänge. Er erhält ein Dach in Form einer geraden quadratischen Pyramide, deren "
    r"Seitenkanten $9$ m lang sind (siehe Abbildung, nicht maßstäblich). Die Dachflächen "
    r"werden mit Kupferblech gedeckt.",
    [
        r"Berechnen Sie die Höhe $h$ des Daches.",
        r"Berechnen Sie die Größe des Neigungswinkels der Dachflächen gegen die "
        r"Waagerechte und den Inhalt der mit Kupfer gedeckten Fläche.",
        r"Als Alternative wird ein kegelförmiges Dach mit derselben Höhe vorgeschlagen, "
        r"dessen Grundkreis durch die vier Ecken des Turms verläuft. Weisen Sie nach, dass "
        r"seine Mantellinie ebenfalls $9$ m lang ist, und berechnen Sie die Größe des "
        r"Öffnungswinkels des Kegels.",
        r"Ein Stadtrat meint: „Ein Kegel ist die sparsamere Form, er braucht weniger "
        r"Kupfer als die Pyramide.“ Beurteilen Sie diese Aussage.",
    ],
    [
        r"Der Fußpunkt $M$ der Höhe ist der Mittelpunkt des Quadrats. Die halbe Diagonale "
        r"ist $\frac{8\sqrt{2}}{2} = 4\sqrt{2} \approx 5{,}66$ m. Im rechtwinkligen Dreieck "
        r"$AMS$: $h = \sqrt{9^2 - (4\sqrt{2})^2} = \sqrt{81 - 32} = \sqrt{49} = 7$ m.",

        r"Im Schnitt durch $M$ und die Mitte $E$ einer Grundkante steigt die Dachfläche auf "
        r"$4$ m waagerechter Strecke um $7$ m: $\tan\varphi = \frac{7}{4}$, also "
        r"$\varphi \approx 60{,}3°$. Höhe einer Dachfläche (grün): "
        r"$h_s = \sqrt{7^2 + 4^2} = \sqrt{65} \approx 8{,}06$ m, ebenso aus "
        r"$\sqrt{9^2 - 4^2}$. Kupferfläche: $4 \cdot \frac{1}{2} \cdot 8 \cdot \sqrt{65} = "
        r"16\sqrt{65} \approx 129{,}0\ \mathrm{m}^2$.",

        r"Der Grundkreis ist der Umkreis des Quadrats, sein Radius die halbe Diagonale "
        r"$r = 4\sqrt{2}$ m. Mantellinie: $m = \sqrt{r^2 + h^2} = \sqrt{32 + 49} = 9$ m, "
        r"genau so lang wie die Seitenkante der Pyramide. Der Öffnungswinkel $\omega$ ist "
        r"der Winkel an der Spitze des Achsenschnitts: "
        r"$\tan\frac{\omega}{2} = \frac{4\sqrt{2}}{7} \approx 0{,}808$, also "
        r"$\frac{\omega}{2} \approx 38{,}94°$ und $\omega \approx 77{,}9°$.",

        r"Mantelfläche des Kegels: $M = \pi \cdot r \cdot m = \pi \cdot 4\sqrt{2} \cdot 9 "
        r"\approx 159{,}9\ \mathrm{m}^2$. Das sind rund $24\ \%$ **mehr** als die "
        r"$129{,}0\ \mathrm{m}^2$ der Pyramide; für dieses Dach ist die Aussage falsch. Der "
        r"Grund: Der Grundkreis muss die Ecken des Turms umschließen und ist mit "
        r"$\pi \cdot 32 \approx 100{,}5\ \mathrm{m}^2$ viel größer als das Quadrat mit "
        r"$64\ \mathrm{m}^2$, das Dach steht ringsum über. Ein Kegel über dem Inkreis "
        r"mit $r = 4$ m und $m = \sqrt{65} \approx 8{,}06$ m bräuchte zwar nur "
        r"$\pi \cdot 4 \cdot \sqrt{65} \approx 101{,}3\ \mathrm{m}^2$, ließe aber die vier "
        r"Ecken des Turms offen.",
    ],
    falle=r"Bei b) ist der Neigungswinkel der **Dachfläche** gefragt, gemessen über der "
          r"Mitte einer Grundkante. Wer stattdessen die Seitenkante nimmt, rechnet "
          r"$\tan\beta = \frac{7}{4\sqrt{2}}$ und erhält $\beta \approx 51{,}1°$: den "
          r"Neigungswinkel der Kante, rund neun Grad zu wenig.",
    figs=[(fig_turmdach(), "Das Turmdach als Pyramide. Rot: die Höhe h, grün: die Höhe "
                           "einer Dachfläche.")],
    solfigs=[(KEGEL[0], "Zu c) und d), Draufsicht: Der Kegel steht über dem Umkreis, der "
                        "gestrichelte Inkreis würde die Ecken des Turms nicht abdecken."),
             (KEGEL[1], "Zu c): der Achsenschnitt des Kegels mit dem Öffnungswinkel ω.")],
)


# ------------------------------------------------------------------ verify ---
def min_gap(screen):
    keys = sorted(screen)
    return min(math.hypot(screen[a][0] - screen[b][0], screen[a][1] - screen[b][1])
               for i, a in enumerate(keys) for b in keys[i + 1:])


def check():
    """Every number in the solutions, recomputed."""
    # --- Aufgabe 1 -----------------------------------------------------------------
    assert abs(R_S ** 2 - 199.24) < 1e-9 and round(R_S, 1) == 14.1
    assert round(R_ANG, 1) == 7.3
    assert round(RH / RL, 3) == 0.129 and round(R_PCT, 1) == 12.9 and R_PCT < LIMIT
    assert abs(tan(radians(R_ANG)) * 100 - R_PCT) < 1e-9          # Steigung = tan(alpha)
    assert abs(R_G - 12.6) < 1e-12 and abs(R_V - 56.7) < 1e-9
    assert round(R_V / TRUCK, 1) == 7.1 and ceil(R_V / TRUCK) == 8
    assert abs(R_V - 7 * TRUCK - 0.7) < 1e-9
    assert abs(14.1 * 4.5 - 63.45) < 1e-9 and round(R_AREA, 1) == 63.5
    assert 6 * BUCKET < 14.1 * 4.5 < 7 * BUCKET and 6 * BUCKET < R_AREA < 7 * BUCKET
    assert ceil(R_AREA / BUCKET) == 7
    # --- Aufgabe 2 -----------------------------------------------------------------
    assert B_ANG == 16 and 180 - AL_Q == 133 and 180 - AL_P - 133 == 16
    assert round(QB, 1) == 261.6 and round(HB, 1) == 191.3 and round(HB) == 191
    assert round(262 * sin(radians(AL_Q)), 1) == 191.6                # gerundet: knapp 192
    assert round(261.6 * sin(radians(AL_Q)), 1) == 191.3
    # zweiter Weg: x tan 47 = (x + 140) tan 31
    x = PQ * tan(radians(AL_P)) / (tan(radians(AL_Q)) - tan(radians(AL_P)))
    assert round(x, 1) == 178.4 and abs(x - FQ) < 1e-9
    assert abs(x * tan(radians(AL_Q)) - HB) < 1e-9
    assert round(LK ** 2, 3) == 6.561 and round(LK, 2) == 2.56
    assert round(BK * sin(radians(G_B)) / 2.561, 3) == 0.898 and round(SIN_L, 3) == 0.898
    acute = degrees(asin(SIN_L))
    assert round(acute, 1) == 63.9 and round(180 - G_B - round(acute, 1), 1) == 88.1
    assert BK > BL and BK > LK                                     # BK is the longest side
    assert round(180 - acute, 1) == 116.1 and abs(180 - acute - LAM) < 1e-9
    cos_r = (BL ** 2 + 2.561 ** 2 - BK ** 2) / (2 * BL * 2.561)
    assert round(cos_r, 3) == -0.440 and round(degrees(acos(cos_r)), 1) == 116.1
    assert round(180 - degrees(asin(BK * sin(radians(G_B)) / 2.56)), 1) == 116.0
    # --- Aufgabe 3 -----------------------------------------------------------------
    assert abs(T_HD - 4 * sqrt(2)) < 1e-12 and round(T_HD, 2) == 5.66
    assert abs(T_HD ** 2 - 32) < 1e-9 and abs(T_H - 7) < 1e-12
    assert round(T_FACE, 1) == 60.3
    assert abs(T_HS - sqrt(65)) < 1e-12 and round(T_HS, 2) == 8.06
    assert abs(sqrt(TS ** 2 - (TA / 2) ** 2) - T_HS) < 1e-12        # ebenso aus 9 und 4
    assert abs(T_ROOF - 16 * sqrt(65)) < 1e-9 and round(T_ROOF, 1) == 129.0
    assert abs(K_M - 9) < 1e-12
    assert round(T_HD / T_H, 3) == 0.808 and round(K_OMEGA / 2, 2) == 38.94
    assert round(K_OMEGA, 1) == 77.9
    assert abs(2 * degrees(asin(T_HD / K_M)) - K_OMEGA) < 1e-9    # Kontrolle ueber sin
    assert round(K_ROOF, 1) == 159.9 and abs(K_ROOF - 36 * sqrt(2) * pi) < 1e-9
    assert round((K_ROOF / T_ROOF - 1) * 100) == 24
    assert round(pi * 32, 1) == 100.5 and TA ** 2 == 64
    assert round(K_IN, 1) == 101.3 and K_IN < T_ROOF < K_ROOF
    assert round(T_EDGE, 1) == 51.1 and round(T_FACE - T_EDGE) == 9   # die Falle
    # --- figures: no two corners meet on screen, everything inside the canvas ----
    for solid, pts in ((RAMP_SOLID, ramp_points()), (TURM_SOLID, turm_points())):
        sd = S.Solid(**solid)
        screen = {k: sd.P(v) for k, v in pts.items()}
        gap = min_gap(screen)
        assert gap > 40, "two vertices collide in the oblique projection: %.1f px" % gap
        for px, py in screen.values():
            assert 20 < px < solid["w"] - 20 and 20 < py < solid["h"] - 30, (px, py)
    B, L, K = karte_points()
    assert abs(math.hypot(L[0] - B[0], L[1] - B[1]) - BL * KARTE_SC) < 1e-9
    assert abs(math.hypot(K[0] - B[0], K[1] - B[1]) - BK * KARTE_SC) < 1e-9
    u = (L[0] - B[0], L[1] - B[1])
    v = (K[0] - B[0], K[1] - B[1])
    ang = degrees(acos((u[0] * v[0] + u[1] * v[1]) / (BL * BK * KARTE_SC ** 2)))
    assert abs(ang - G_B) < 1e-9
    assert all(10 < q[0] < 290 and 10 < q[1] < 270 for q in (B, L, K))
    assert 400 - (FQ + PQ) * BASTEI_SC > 20 and 236 - HB * BASTEI_SC > 15


s.verify(check)
s.save()

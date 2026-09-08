#!/usr/bin/env python3
"""Abitur-Training BGY - Modellieren (Steckbrief, Uebergang ohne Knick).

    python3 tools/aufgaben/abi/modellieren.py

Task types follow the Sachsen originals 2022-2025 (Steckbrief einer ganzrationalen
Funktion dritten Grades, abschnittsweise definiertes Profil mit knickfreiem Anschluss,
Beurteilen eines Modells). Wording, numbers and every figure are our own - the
originals are not reproduced.
"""
import math
import os
import sys
from fractions import Fraction as F

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from textaufgaben import Sheet                                     # noqa: E402
import svgfig as S                                                 # noqa: E402


# --------------------------------------------------------------- functions ---
# Aufgabe 1: f(x) = 1/8 x^3 - 3/4 x^2 + 1, fixed by P(0|1), T(4|-3), f'(4) = 0, f''(2) = 0
def f(x):
    return 0.125 * x ** 3 - 0.75 * x ** 2 + 1.0


def df(x):
    return 0.375 * x ** 2 - 1.5 * x


def ddf(x):
    return 0.75 * x - 1.5


def wtan(x):
    """Tangent in the point of inflection W(2|-1)."""
    return -1.5 * x + 2.0


# Aufgaben 2 und 3: the roller-coaster profile, three sections over [0, 26]
def gline(x):
    """Section 1, straight, 0 <= x <= 10."""
    return 20.0 - x


def bogen(x):
    """Section 2, transition arc, 10 <= x <= 20."""
    return 0.05 * x ** 2 - 2.0 * x + 25.0


def dbogen(x):
    return 0.1 * x - 2.0


def brems(x):
    """Section 3, horizontal brake run, 20 <= x <= 26."""
    return 5.0


def profil(x):
    return gline(x) if x <= 10 else (bogen(x) if x <= 20 else brems(x))


def dprofil(x):
    return -1.0 if x <= 10 else (dbogen(x) if x <= 20 else 0.0)


# ------------------------------------------------------------------ helper ---
def framed(p, xstep, ystep, xlabel, ylabel, xdec=0, ydec=0):
    """Box frame with ticks for a zoomed window that does not contain the origin.

    Plot.axes draws its axes at world x = 0 resp. y = 0 - outside such a window they
    would simply be missing, so the frame takes their place."""
    left, right = p.X(p.x0), p.X(p.x1)
    bottom, top = p.Y(p.y0), p.Y(p.y1)
    p.rect(left, top, right - left, bottom - top, fill="none", stroke=S.MUTED, width=1.1)
    u = math.ceil(p.x0 / xstep) * xstep
    while u <= p.x1 + 1e-9:
        p.line(p.X(u), bottom, p.X(u), bottom - 4.5, S.MUTED, 1.1)
        p.text(p.X(u), bottom + 15, S.num(u, xdec), 11.5, S.MUTED)
        u += xstep
    v = math.ceil(p.y0 / ystep) * ystep
    while v <= p.y1 + 1e-9:
        p.line(left, p.Y(v), left + 4.5, p.Y(v), S.MUTED, 1.1)
        p.text(left - 7, p.Y(v) + 4, S.num(v, ydec), 11.5, S.MUTED, "end")
        v += ystep
    p.text((left + right) / 2.0, bottom + 32, xlabel, 12, S.MUTED)
    p.text(left, top - 10, ylabel, 12, S.MUTED, "start")


# ----------------------------------------------------------------- figures ---
def fig_steckbrief(loesung=False):
    """The finished cubic with the four given conditions marked."""
    p = S.Plot((-1.7, 5.7), (-4.6, 3.4), w=520, h=340)
    p.grid(1, 1)
    p.axes(1, 1, xlabel="x", ylabel="y")
    p.line(p.X(2), p.Y(-4.6), p.X(2), p.Y(3.4), S.MUTED, 1.1, dash="4 3")
    p.curve(f, -1.6, 5.6, S.RED, 2.2)
    p.tangent(f, df, 4, 1.3, S.GREEN, 1.9)
    p.point(4, -3, "T", "below-right")
    p.text(p.X(2) + 7, p.Y(3.05), "Wendestelle x = 2", 12, S.MUTED, "start", halo=S.PAPER)
    p.text(p.X(5.6), p.Y(-4.05), "waagerechte Tangente", 11.5, S.GREEN, "end", halo=S.PAPER)
    if loesung:
        p.tangent(f, df, 0, 1.2, S.GREEN, 1.9)
        p.tangent(f, df, 2, 1.5, S.ORANGE, 1.9)
        p.point(0, 1, "H", "above-right")
        p.point(2, -1, "W", "above-right", color=S.ORANGE)
        return p.svg("Graph von f mit Hochpunkt, Wendepunkt samt Wendetangente und Tiefpunkt")
    p.point(0, 1, "P", "above-right")
    return p.svg("Graph von f mit dem Punkt P, dem Punkt T mit waagerechter Tangente "
                 "und der Wendestelle bei 2")


def fig_profil():
    """The composite profile, one colour per section, both seams marked."""
    p = S.Plot((-2.5, 28), (-2.5, 23), w=560, h=340, pad=(46, 26, 20, 36))
    p.grid(2, 5)
    p.axes(2, 5, xlabel="x", ylabel="h")
    p.line(p.X(10), p.Y(10), p.X(10), p.Y(0), S.MUTED, 1, dash="3 3")
    p.line(p.X(20), p.Y(5), p.X(20), p.Y(0), S.MUTED, 1, dash="3 3")
    p.seg((0, 20), (10, 10), S.GREEN, 3.2)
    p.curve(bogen, 10, 20, S.RED, 3.2)
    p.seg((20, 5), (26, 5), S.ORANGE, 3.6)
    p.point(10, 10, "N1", "above-right", color=S.INK)
    p.point(20, 5, "N2", "above-right", color=S.INK)
    for yy, col, lab in ((21.2, S.GREEN, "Abschnitt 1: gerade Abfahrt"),
                         (18.7, S.RED, "Abschnitt 2: Übergangsbogen"),
                         (16.2, S.ORANGE, "Abschnitt 3: Bremsstrecke")):
        x0 = p.X(13.2)
        p.line(x0, p.Y(yy), x0 + 26, p.Y(yy), col, 3.4)
        p.text(x0 + 34, p.Y(yy) + 4, lab, 12, S.BODY, "start")
    p.text(p.X(27.8), p.Y(1.4), "x und h in Metern", 11.5, S.MUTED, "end", halo=S.PAPER)
    return p.svg("Profil der Achterbahn aus drei Abschnitten mit den Nahtstellen N1 und N2")


def fig_naht():
    """Zoom on the first seam - the arc leaves the straight line tangentially."""
    p = S.Plot((7.6, 13.4), (6.6, 12.9), w=470, h=320, pad=(48, 24, 22, 44))
    p.grid(1, 1)
    framed(p, 1, 1, "x in Metern", "h in Metern")
    p.seg((7.6, gline(7.6)), (10, 10), S.GREEN, 3.2, clip=True)
    p.seg((10, 10), (13.4, gline(13.4)), S.MUTED, 1.6, dash="6 4", clip=True)
    p.curve(bogen, 10, 13.4, S.RED, 3.2)
    p.point(10, 10, "N1", "above-right", color=S.INK)
    p.text(p.X(8.8), p.Y(10.6), "Gerade", 12, S.GREEN, "middle", halo=S.PAPER)
    p.text(p.X(12.4), p.Y(9.1), "Parabel", 12, S.RED, "middle", halo=S.PAPER)
    p.text(p.X(12.0), p.Y(6.9), "gemeinsame Tangente", 11.5, S.MUTED, "end", halo=S.PAPER)
    return p.svg("Vergroesserung der Nahtstelle N1, Gerade und Parabel mit gemeinsamer Tangente")


def fig_ableitung():
    """The derivative of the profile - continuous, but kinked at both seams."""
    p = S.Plot((-2.5, 28), (-1.55, 0.55), w=560, h=300, pad=(50, 26, 22, 36))
    p.grid(2, 0.5)
    p.axes(2, 0.5, xlabel="x", ylabel="h′", ydec=1)
    for u in (10, 20):          # in two pieces - the tick labels sit below the axis
        p.line(p.X(u), p.Y(0.55), p.X(u), p.Y(0) - 3, S.MUTED, 1, dash="3 3")
        p.line(p.X(u), p.Y(0) + 21, p.X(u), p.Y(-1.55), S.MUTED, 1, dash="3 3")
    p.seg((0, -1), (10, -1), S.GREEN, 3.2)
    p.seg((10, -1), (20, 0), S.RED, 3.2)
    p.seg((20, 0), (26, 0), S.ORANGE, 3.6)
    p.point(10, -1, None, color=S.INK, size=3.2)
    p.point(20, 0, None, color=S.INK, size=3.2)
    p.text(p.X(5), p.Y(-1.3), "Gefälle 100 %", 12, S.GREEN, "middle", halo=S.PAPER)
    p.text(p.X(15.4), p.Y(-1.15), "h′ wächst linear", 12, S.RED, "middle", halo=S.PAPER)
    p.text(p.X(24), p.Y(0.2), "h′ = 0", 12, S.BODY, "middle", halo=S.PAPER)
    p.text(p.X(2), p.Y(0.42), "stetig, aber bei x = 10 und x = 20 geknickt",
           12, S.BODY, "start", halo=S.PAPER)
    return p.svg("Graph der Ableitung des Profils, konstant minus eins, dann linear "
                 "wachsend, dann null")


def fig_lichte():
    """Zoom on the clearance: the track has to stay above 5,10 m."""
    p = S.Plot((15.5, 27), (4.75, 6.5), w=520, h=300, pad=(52, 24, 22, 44))
    p.grid(1, 0.5)
    framed(p, 1, 0.5, "x in Metern", "h in Metern", ydec=1)
    p.curve(bogen, 15.5, 20, S.RED, 2.8)
    p.seg((20, 5), (27, 5), S.ORANGE, 3.2)
    p.seg((15.5, 5.1), (27, 5.1), S.GREEN, 1.8, dash="6 4")
    xs = 20 - math.sqrt(2)
    p.line(p.X(xs), p.Y(5.1), p.X(xs), p.Y(4.75), S.MUTED, 1.1, dash="3 3")
    p.point(xs, 5.1, None, color=S.GREEN, size=3.4)
    p.brace(15.5, xs, 6.25, "hier passt der Weg hindurch", S.MUTED)
    p.text(p.X(xs) - 8, p.Y(4.88), "x = 18,59", 12, S.BODY, "end", halo=S.PAPER)
    p.text(p.X(26.8), p.Y(5.28), "gebraucht: 5,10 m", 11.5, S.GREEN, "end", halo=S.PAPER)
    p.text(p.X(26.8), p.Y(4.85), "Bremsstrecke nur 5,00 m", 11.5, S.BODY, "end", halo=S.PAPER)
    return p.svg("Bogen und Bremsstrecke mit der gebrauchten Hoehe von 5,10 Metern")


# ------------------------------------------------------------------- sheet ---
s = Sheet("abitur-bgy-modellieren", "Modellieren — Steckbrief und Übergang ohne Knick",
          kind="Abitur-Training",
          suffix="",
          klasse="Berufliches Gymnasium",
          sub="Berufliches Gymnasium · Pflichtaufgabe 1 · Grund- und Leistungskurs · "
              "drei Aufgaben, Anforderungsbereiche I bis III",
          desc="Abitur-Training Mathematik BGY, Modellieren: Steckbriefaufgabe zu einer "
               "ganzrationalen Funktion dritten Grades und ein abschnittsweise definiertes "
               "Profil mit knickfreien Übergängen, mit Lösungen und Abbildungen.",
          plan=("../svp/mathe/abitur.html", "Zur Übersicht"))

s.task(
    "Gesucht per Steckbrief", 1,
    r"Von einer ganzrationalen Funktion $f$ dritten Grades mit "
    r"$f(x) = a \cdot x^3 + b \cdot x^2 + c \cdot x + d$ ist bekannt: Der Graph verläuft "
    r"durch den Punkt $P(0 \mid 1)$, er besitzt im Punkt $T(4 \mid -3)$ eine waagerechte "
    r"Tangente, und an der Stelle $x = 2$ liegt ein Wendepunkt. Die Abbildung zeigt den "
    r"Graphen mit diesen Angaben.",
    [
        r"Stellen Sie ein lineares Gleichungssystem für $a$, $b$, $c$ und $d$ auf.",
        r"Lösen Sie das Gleichungssystem und geben Sie den Funktionsterm an.",
        r"Führen Sie die Probe durch und entscheiden Sie, ob in $T$ ein Hoch- oder ein "
        r"Tiefpunkt vorliegt.",
        r"Bestimmen Sie die Koordinaten des Wendepunktes und eine Gleichung der Wendetangente.",
    ],
    [
        r"Aus $f(x) = a \cdot x^3 + b \cdot x^2 + c \cdot x + d$ folgt "
        r"$f'(x) = 3a \cdot x^2 + 2b \cdot x + c$ sowie $f''(x) = 6a \cdot x + 2b$. Die vier "
        r"Angaben liefern vier Gleichungen: aus $f(0) = 1$ wird $d = 1$, aus $f(4) = -3$ wird "
        r"$64a + 16b + 4c + d = -3$, aus $f'(4) = 0$ wird $48a + 8b + c = 0$, und aus "
        r"$f''(2) = 0$ wird $12a + 2b = 0$.",
        r"Die vierte Gleichung gibt $b = -6a$. Damit wird die dritte zu "
        r"$48a - 48a + c = 0$, also $c = 0$. Mit $d = 1$ bleibt von der zweiten Gleichung "
        r"$64a - 96a + 1 = -3$, also $-32a = -4$ und $a = \frac{1}{8}$. Rückwärts folgt "
        r"$b = -\frac{3}{4}$. Der gesuchte Funktionsterm lautet damit "
        r"**$f(x) = \frac{1}{8} \cdot x^3 - \frac{3}{4} \cdot x^2 + 1$**, in Dezimalschreibweise "
        r"$f(x) = 0{,}125 \cdot x^3 - 0{,}75 \cdot x^2 + 1$.",
        r"Probe: Es ist $f(0) = 1$, der Punkt $P$ liegt also auf dem Graphen. Weiter ist "
        r"$f(4) = 8 - 12 + 1 = -3$, damit stimmt auch $T$. Aus "
        r"$f'(x) = \frac{3}{8} \cdot x^2 - \frac{3}{2} \cdot x = \frac{3}{8} \cdot x \cdot (x - 4)$ "
        r"folgt $f'(4) = 0$, die Tangente in $T$ ist also waagerecht, und aus "
        r"$f''(x) = \frac{3}{4} \cdot x - \frac{3}{2}$ folgt $f''(2) = 0$. Wegen "
        r"$f''(4) = \frac{3}{2} > 0$ ist $T$ ein **Tiefpunkt**. Nebenbei fällt auf: Auch "
        r"$f'(0) = 0$, und wegen $f''(0) = -\frac{3}{2} < 0$ ist der gegebene Punkt $P$ der "
        r"**Hochpunkt** $H(0 \mid 1)$.",
        r"Die Wendestelle ist $x = 2$; dort gilt $f(2) = 1 - 3 + 1 = -1$, also "
        r"$W(2 \mid -1)$. Der Anstieg der Wendetangente ist "
        r"$f'(2) = \frac{3}{2} - 3 = -\frac{3}{2}$. Aus "
        r"$y = -\frac{3}{2} \cdot (x - 2) - 1$ folgt die Gleichung "
        r"**$y = -1{,}5 \cdot x + 2$**.",
    ],
    falle=r"„Wendepunkt an der Stelle $x = 2$“ liefert genau **eine** Gleichung, nämlich "
          r"$f''(2) = 0$. Die zugehörige $y$-Koordinate ist nicht gegeben und darf nicht "
          r"erfunden werden — wer daraus zwei Gleichungen macht, überbestimmt das System "
          r"und rechnet sich in einen Widerspruch.",
    figs=[(fig_steckbrief(), "Der Graph von f mit dem Punkt P, der waagerechten Tangente "
                             "in T und der Wendestelle x = 2.")],
    solfigs=[(fig_steckbrief(True),
              "Der fertige Graph: Hochpunkt H, Tiefpunkt T und der Wendepunkt W mit "
              "seiner Wendetangente (orange).")],
)

s.task(
    "Die Achterbahn ohne Knick", 2,
    r"Der erste Abfall einer Achterbahn wird für $0 \leq x \leq 26$ durch ein Profil aus "
    r"drei Abschnitten beschrieben. Dabei ist $x$ die waagerechte Entfernung von der Kuppe "
    r"und $h(x)$ die Höhe der Fahrbahn über dem Boden, beides in Metern. Für "
    r"$0 \leq x \leq 10$ verläuft die Bahn geradlinig nach $g(x) = 20 - x$. Für "
    r"$10 \leq x \leq 20$ folgt ein Übergangsbogen mit $p(x) = a \cdot x^2 + b \cdot x + c$. "
    r"Ab $x = 20$ schließt sich die waagerechte Bremsstrecke in $5$ m Höhe an.",
    [
        r"Stellen Sie die drei Bedingungen auf, die den knickfreien Anschluss an die Gerade "
        r"bei $x = 10$ und den waagerechten Anschluss bei $x = 20$ sichern, und berechnen "
        r"Sie damit $a$, $b$ und $c$.",
        r"Weisen Sie nach, dass der Übergangsbogen bei $x = 20$ genau die Höhe der "
        r"Bremsstrecke erreicht.",
        r"Berechnen Sie den Neigungswinkel der geraden Abfahrt gegen die Waagerechte und "
        r"begründen Sie, dass die Bahn nirgends steiler fällt.",
        r"Bestimmen Sie die Stelle, an der das Gefälle der Bahn noch $10\,\%$ beträgt.",
    ],
    [
        r"Knickfrei heißt an einer Nahtstelle: gleicher Funktionswert **und** gleicher "
        r"Anstieg. Mit $g(10) = 10$ und $g'(x) = -1$ sind das die Bedingungen "
        r"$p(10) = 10$ sowie $p'(10) = -1$; die Bremsstrecke ist waagerecht, also gilt "
        r"außerdem $p'(20) = 0$. Mit $p'(x) = 2a \cdot x + b$ lautet das System "
        r"$100a + 10b + c = 10$, $20a + b = -1$, $40a + b = 0$. Die Differenz der beiden "
        r"letzten Gleichungen ergibt $20a = 1$, also $a = 0{,}05$, daraus $b = -2$ und aus "
        r"der ersten Gleichung $c = 10 - 5 + 20 = 25$. Der Bogen lautet damit "
        r"**$p(x) = 0{,}05 \cdot x^2 - 2 \cdot x + 25$**.",
        r"Es ist $p(20) = 0{,}05 \cdot 400 - 40 + 25 = 20 - 40 + 25 = 5$. Der Bogen endet "
        r"also genau auf $5$ m, der Höhe der Bremsstrecke — der Übergang erfolgt ohne "
        r"Stufe. Zusammen mit $p'(20) = 0$ geht die Bahn dort auch ohne Knick in die "
        r"Waagerechte über.",
        r"Für die Gerade ist der Anstieg $m = -1$, also $\tan(\alpha) = 1$ und "
        r"$\alpha = 45^\circ$; das entspricht $100\,\%$ Gefälle. Auf dem Bogen ist "
        r"$p'(x) = 0{,}1 \cdot x - 2$ streng monoton wachsend, mit $p'(10) = -1$ und "
        r"$p'(20) = 0$ gilt dort $-1 \leq p'(x) \leq 0$. Auf der Bremsstrecke ist der "
        r"Anstieg $0$. Nirgends ist der Betrag des Anstiegs größer als $1$, die Bahn fällt "
        r"also **nirgends steiler** als auf der geraden Abfahrt.",
        r"Ein Gefälle von $10\,\%$ bedeutet den Anstieg $-0{,}1$. Auf der Geraden ist der "
        r"Anstieg konstant $-1$, auf der Bremsstrecke $0$ — die Stelle liegt also auf dem "
        r"Bogen. Aus $0{,}1 \cdot x - 2 = -0{,}1$ folgt $x = 19$. Dort ist die Fahrbahn noch "
        r"$p(19) = 18{,}05 - 38 + 25 = 5{,}05$ Meter hoch.",
    ],
    falle=r"Knickfrei ist eine Bedingung an die **Ableitung**, stufenfrei eine an den "
          r"**Funktionswert**. An jeder Nahtstelle sind das zwei Gleichungen, nicht eine: "
          r"Wer nur die Höhen angleicht, baut eine Bahn mit Knick; wer nur die Anstiege "
          r"angleicht, eine mit Stufe.",
    figs=[(fig_profil(), "Das Profil aus drei Abschnitten mit den Nahtstellen N1 und N2.")],
    solfigs=[(fig_naht(),
              "Zu a): Lupe an der Nahtstelle N1. Die Parabel löst sich tangential von der "
              "Geraden — beide haben dort dieselbe Tangente, also keinen Knick.")],
)

s.task("Was der Ableitungsgraph verrät", 3,
    r"Betrachtet wird dieselbe Achterbahn wie in Aufgabe 2, also $h(x) = 20 - x$ für "
    r"$0 \leq x \leq 10$, dann $h(x) = 0{,}05 \cdot x^2 - 2 \cdot x + 25$ für "
    r"$10 \leq x \leq 20$ und schließlich $h(x) = 5$ für $20 \leq x \leq 26$. Die Abbildung "
    r"zeigt den Graphen der Ableitung $h'$.",
    [
        r"Beschreiben Sie anhand des Graphen von $h'$, wie sich die Steilheit der Bahn "
        r"längs der Strecke ändert, und geben Sie an, wo die Bahn am steilsten fällt.",
        r"Unter der Bahn soll ein waagerechter Wartungsweg auf Bodenhöhe hindurchführen. "
        r"Die Fahrbahnkonstruktion ist $0{,}60$ m dick, darunter werden $4{,}50$ m lichte "
        r"Höhe gebraucht. Untersuchen Sie, bis zu welcher Stelle das möglich ist.",
        r"Beurteilen Sie, ob das Modell am linken Rand des Definitionsbereichs sinnvoll an "
        r"die Bergfahrt anschließt, die die Wagen waagerecht über die Kuppe führt.",
        r"Beurteilen Sie die Aussage: „Weil der Graph von $h'$ nirgends springt, verläuft "
        r"die Bahn überall gleich sanft — an den Nahtstellen ist nichts zu spüren.“",
    ],
    [
        r"Auf $[0; 10]$ ist $h'$ konstant $-1$: gleichmäßiges Gefälle, und weil der Betrag "
        r"des Anstiegs hier am größten ist, fällt die Bahn auf diesem ganzen Abschnitt am "
        r"steilsten, nämlich unter $45^\circ$. Auf $[10; 20]$ wächst $h'$ linear von $-1$ "
        r"auf $0$; das Gefälle nimmt gleichmäßig ab, die Bahn wird also immer flacher. Auf "
        r"$[20; 26]$ ist $h' = 0$, die Bahn verläuft waagerecht. Der Graph von $h'$ hat "
        r"keine Sprungstelle — genau das ist die Knickfreiheit aus Aufgabe 2.",
        r"Gebraucht wird eine Fahrbahnhöhe von $4{,}50 + 0{,}60 = 5{,}10$ Metern, also "
        r"$h(x) \geq 5{,}10$. Auf der Bremsstrecke ist $h(x) = 5$ und damit zu wenig. Auf "
        r"dem Bogen führt $0{,}05 \cdot x^2 - 2 \cdot x + 25 = 5{,}10$ auf "
        r"$x^2 - 40 \cdot x + 398 = 0$ mit $x_{1,2} = 20 \pm \sqrt{2}$; im Intervall liegt "
        r"$x = 20 - \sqrt{2} \approx 18{,}59$. Da $h$ monoton fällt, gilt "
        r"$h(x) \geq 5{,}10$ genau für $x \leq 18{,}59$. Der Weg passt also nur bis etwa "
        r"$18{,}6$ Meter hindurch; unter der Bremsstrecke fehlen **10 Zentimeter**.",
        r"Am linken Rand hat das Modell den Anstieg $h'(0) = -1$, die Bergfahrt über die "
        r"Kuppe dagegen den Anstieg $0$. An der Stelle $x = 0$ träfen also zwei Abschnitte "
        r"mit verschiedenen Anstiegen aufeinander — **genau der Knick**, den das Modell im "
        r"Inneren so sorgfältig vermeidet. Als Beschreibung der Kuppe taugt es deshalb "
        r"nicht; sinnvoll wird es erst, wenn vor $x = 0$ ein weiterer Übergangsbogen "
        r"eingefügt wird. Am rechten Rand ist es harmloser: Dort endet die Bremsstrecke, "
        r"das Modell macht über $x = 26$ hinaus einfach keine Aussage mehr.",
        r"Die Aussage ist **falsch**. Dass $h'$ stetig ist, sichert nur, dass die Bahn "
        r"keinen Knick hat. Die zweite Ableitung springt jedoch: Auf der Geraden ist "
        r"$h'' = 0$, auf dem Bogen $h'' = 0{,}1$ und auf der Bremsstrecke wieder $h'' = 0$. "
        r"Mit der Krümmung springt auch die Beschleunigung, die die Fahrgäste in die Sitze "
        r"drückt — an beiden Nahtstellen unvermittelt von null auf einen festen Wert. Das "
        r"ist als Ruck deutlich spürbar. Im Straßen- und Bahnbau nimmt man deshalb "
        r"Übergangsbögen mit stetig wachsender Krümmung, etwa Klothoiden, statt einer "
        r"Parabel.",
    ],
    falle=r"Knickfrei ist nicht ruckfrei. Der Anschluss ohne Knick macht nur $h'$ stetig; "
          r"ruckfrei wäre der Übergang erst, wenn auch $h''$ stetig ist. Am Graphen von "
          r"$h'$ sieht man es sofort: Er ist an den Nahtstellen selbst geknickt.",
    figs=[(fig_ableitung(),
           "Der Graph von h′: konstant −1, dann linear wachsend, dann null. "
           "Die Sprungfreiheit dieses Graphen ist die Knickfreiheit der Bahn.")],
    solfigs=[(fig_lichte(),
              "Zu b): Ab etwa x = 18,6 Metern liegt die Fahrbahn unter den gebrauchten "
              "5,10 Metern; die Bremsstrecke bleibt 10 Zentimeter darunter.")],
)


# ------------------------------------------------------------------ verify ---
def gauss(rows):
    """Exact Gauss-Jordan over the rationals; rows = [[coeffs ..., rhs], ...]."""
    m = [[F(v) for v in r] for r in rows]
    n = len(m)
    for i in range(n):
        piv = next(r for r in range(i, n) if m[r][i] != 0)
        m[i], m[piv] = m[piv], m[i]
        m[i] = [v / m[i][i] for v in m[i]]
        for r in range(n):
            if r != i and m[r][i] != 0:
                fac = m[r][i]
                m[r] = [x - fac * y for x, y in zip(m[r], m[i])]
    return [r[-1] for r in m]


def check():
    """Every number in the solutions, recomputed - the system exactly, the seams by hand."""
    # ---- Aufgabe 1: the Steckbrief system, solved over the rationals
    a, b, c, d = gauss([[0, 0, 0, 1, 1],          # f(0) = 1
                        [64, 16, 4, 1, -3],       # f(4) = -3
                        [48, 8, 1, 0, 0],         # f'(4) = 0
                        [12, 2, 0, 0, 0]])        # f''(2) = 0
    assert (a, b, c, d) == (F(1, 8), F(-3, 4), F(0), F(1)), (a, b, c, d)
    F0 = lambda x: a * x ** 3 + b * x ** 2 + c * x + d
    F1 = lambda x: 3 * a * x ** 2 + 2 * b * x + c
    F2 = lambda x: 6 * a * x + 2 * b
    assert F0(F(0)) == 1                          # Bedingung 1: P(0|1)
    assert F0(F(4)) == -3                         # Bedingung 2: T(4|-3)
    assert F1(F(4)) == 0                          # Bedingung 3: waagerechte Tangente
    assert F2(F(2)) == 0                          # Bedingung 4: Wendestelle x = 2
    assert F1(F(4)) == 0 and F2(F(4)) == F(3, 2) > 0          # Tiefpunkt in T
    assert F1(F(0)) == 0 and F2(F(0)) == F(-3, 2) < 0         # P ist der Hochpunkt
    assert F0(F(2)) == -1 and F1(F(2)) == F(-3, 2)            # W(2|-1), Anstieg dort
    tang = lambda x: F(-3, 2) * x + 2                          # Wendetangente y = -1,5x + 2
    assert tang(F(2)) == F0(F(2))
    assert F0(F(4)) == 8 - 12 + 1 and F0(F(2)) == 1 - 3 + 1    # Zwischenschritte der Probe
    for t in range(-20, 61):                      # the float twins used for drawing
        x = t / 10.0
        assert abs(f(x) - float(F0(F(t, 10)))) < 1e-12
        assert abs(df(x) - float(F1(F(t, 10)))) < 1e-12
        assert abs(ddf(x) - float(F2(F(t, 10)))) < 1e-12
        assert abs(wtan(x) - float(tang(F(t, 10)))) < 1e-12

    # ---- Aufgabe 2: the transition arc from the three seam conditions
    a2, b2, c2 = gauss([[100, 10, 1, 10],         # p(10) = g(10) = 10
                        [20, 1, 0, -1],           # p'(10) = g'(10) = -1
                        [40, 1, 0, 0]])           # p'(20) = 0 (waagerechte Bremsstrecke)
    assert (a2, b2, c2) == (F(1, 20), F(-2), F(25)), (a2, b2, c2)
    P0 = lambda x: a2 * x ** 2 + b2 * x + c2
    P1 = lambda x: 2 * a2 * x + b2
    G0 = lambda x: 20 - x                          # Abschnitt 1
    assert G0(F(10)) == 10 and P0(F(10)) == G0(F(10))          # Nahtstelle 1: gleicher Wert
    assert P1(F(10)) == -1                                     # Nahtstelle 1: gleicher Anstieg
    assert P0(F(20)) == 5 and brems(20) == 5                   # Nahtstelle 2: gleicher Wert
    assert P1(F(20)) == 0                                      # Nahtstelle 2: gleicher Anstieg
    assert c2 == 10 - 5 + 20 and 20 * a2 == 1                  # Zwischenschritte
    assert math.degrees(math.atan(1.0)) == 45.0                # Neigungswinkel der Geraden
    assert all(-1 <= P1(F(t, 10)) <= 0 for t in range(100, 201))
    assert P1(F(19)) == F(-1, 10) and P0(F(19)) == F(101, 20)  # 10 % Gefaelle bei x = 19
    assert abs(bogen(19) - 5.05) < 1e-12
    for t in range(100, 201):                     # float twin of the arc
        x = t / 10.0
        assert abs(bogen(x) - float(P0(F(t, 10)))) < 1e-12
        assert abs(dbogen(x) - float(P1(F(t, 10)))) < 1e-12
    assert profil(5) == gline(5) == 15 and dprofil(5) == -1
    assert abs(dprofil(15) + 0.5) < 1e-12 and dprofil(23) == 0

    # ---- Aufgabe 3: clearance and the jump of the second derivative
    need = F(45, 10) + F(6, 10)                    # 4,50 m + 0,60 m
    assert need == F(51, 10)
    assert brems(21) < float(need)                 # Bremsstrecke: 5,00 m sind zu wenig
    assert abs(float(need) - brems(21) - 0.10) < 1e-12          # es fehlen 10 cm
    xs = 20 - math.sqrt(2)
    assert abs(bogen(xs) - 5.1) < 1e-12 and abs(xs - 18.5858) < 1e-4
    assert bogen(18.5) > 5.1 > bogen(18.7)         # h faellt, also gilt es links davon
    for t in (20 - math.sqrt(2), 20 + math.sqrt(2)):            # x^2 - 40x + 398 = 0
        assert abs(t ** 2 - 40 * t + 398) < 1e-9
    assert 2 * a2 == F(1, 10)                      # h'' auf dem Bogen
    assert dprofil(0) == -1 and dprofil(10) == -1 and dprofil(20) == 0


s.verify(check)
s.save()

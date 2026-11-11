#!/usr/bin/env python3
"""Vergleichsarbeit-Training BGY Klasse 11 (Sachsen) - Exponential-, Sinus- und
Wurzelfunktionen (Teil B, mit MMS).

    python3 tools/aufgaben/va/exponential.py

B1 of the Vergleichsarbeit is often an exponential function of the form a * q^x + b:
range, monotony, "every value is greater than ...", zeros, the argument for a given value,
a and b from two points. B3 puts a sine or a square-root function into a real situation.
Wording, numbers and every figure are our own.
"""
import math
import os
import sys
from fractions import Fraction as Fr
from math import asin, log, pi, sin, sqrt

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from textaufgaben import Sheet                                     # noqa: E402
import svgfig as S                                                 # noqa: E402


# --------------------------------------------- Aufgabe 1: Exponentialfunktion --
def f1(x):
    return Fr(1, 2) * Fr(2) ** x - 4 if isinstance(x, int) else 0.5 * 2 ** x - 4


A_G, B_G = 2, -1                                 # g(x) = 2 * 2^x - 1


def g1(x):
    return A_G * 2 ** x + B_G


X6 = log(20) / log(2)                            # f(x) = 6


# ------------------------------------------------------ Aufgabe 2: Medikament --
M_A, M_B = 100.0, 0.8


def med(t):
    return M_A * M_B ** t


T10 = log(0.1) / log(M_B)
T_HALF = log(0.5) / log(M_B)


# ------------------------------------------------------- Aufgabe 3: Riesenrad --
AXIS, RAD, PERIOD = 30.0, 26.0, 16.0


def hoehe(t):
    return RAD * sin(pi / 8 * t) + AXIS


def sicht(x):
    return 3.6 * sqrt(x)


X25 = (25 / 3.6) ** 2                            # height for 25 km of view
T25 = asin((48.2 - AXIS) / RAD) * 8 / pi         # with the rounded 48,2 m, as in class


# ----------------------------------------------------------------- figures ---
def fig_exp():
    p = S.Plot((-4.6, 6.2), (-5.6, 13.6), w=430, h=420, pad=(34, 22, 16, 28))
    p.grid(1, 1)
    p.axes(1, 2, defer_labels=True)
    p.line(p.X(-4.6), p.Y(-4), p.X(6.2), p.Y(-4), S.MUTED, 1.3, dash="6 4")
    p.seg((0, -3.5), (3, 0), S.INK, 1.3, dash="3 3")
    p.curve(g1, -4.6, 2.9, S.GREEN, 2.0, dash="7 4")
    p.curve(f1, -4.6, 5.3, S.RED, 2.2)
    p.draw_labels()
    p.point(0, -3.5, "Sᵧ", "right", color=S.RED)
    p.point(3, 0, "N", "below-right", color=S.RED)
    p.point(5, 12, None, color=S.RED)
    p.point(0, 1, "A", "left", color=S.GREEN)
    p.point(2, 7, "B", "left", color=S.GREEN)
    p.text(p.X(5.15), p.Y(10.6), "f", 15, S.RED, "start", italic=True, halo=S.PAPER)
    p.text(p.X(2.75), p.Y(11.6), "g", 15, S.GREEN, "end", italic=True, halo=S.PAPER)
    p.text(p.X(-4.4), p.Y(-4) - 6, "y = −4", 11.5, S.MUTED, "start", halo=S.PAPER)
    return p.svg("Der steigende Graph von f mit der waagerechten Asymptote y = -4, den "
                 "Achsenschnittpunkten und ihrem Abstand, dazu der Graph von g durch A und B")


def fig_med():
    p = S.Plot((-0.8, 13.6), (-9, 110), w=520, h=300, pad=(44, 52, 18, 34))
    p.grid(1, 10)
    p.axes(1, 20, xlabel="t in h", ylabel="m in mg", defer_labels=True)
    p.line(p.X(-0.8), p.Y(10), p.X(13.6), p.Y(10), S.GREEN, 1.2, dash="6 4")
    p.line(p.X(T10), p.Y(10), p.X(T10), p.Y(0), S.GREEN, 1.1, dash="3 3")
    p.dashto(T_HALF, 50)
    p.curve(med, 0, 13.4, S.RED, 2.2)
    p.draw_labels()
    p.point(1, 80, "M₁", "above-right", color=S.INK, size=3.4)
    p.point(3, 51.2, "M₂", "above-right", color=S.INK, size=3.4)
    p.point(T_HALF, 50, None, color=S.RED, size=3.2)
    p.point(T10, 10, None, color=S.GREEN, size=3.2)
    p.text(p.X(13.5), p.Y(10) - 6, "10 mg", 11.5, S.GREEN, "end", halo=S.PAPER)
    p.text(p.X(T10), p.Y(0) - 6, "10,32", 11, S.GREEN, "middle", halo=S.PAPER)
    p.text(p.X(T_HALF) + 4, p.Y(0) - 6, "3,11", 11, S.MUTED, "start", halo=S.PAPER)
    p.text(p.X(5.2), p.Y(40), "m", 15, S.RED, "start", italic=True, halo=S.PAPER)
    return p.svg("Abnahme des Wirkstoffs von 100 mg mit den beiden Messwerten, der "
                 "Halbwertszeit 3,11 h und der Wirkgrenze 10 mg nach 10,32 h")


def fig_rad():
    c = S.Canvas(360, 300)
    cx, cy, r = 140, 136, 104
    c.line(cx - 64, 282, cx, cy, S.INK, 2)
    c.line(cx + 64, 282, cx, cy, S.INK, 2)
    c.line(14, 282, 346, 282, S.INK, 1.6)
    c.line(cx, cy, cx + r + 34, cy, S.MUTED, 1, dash="4 3")
    c.raw('<circle cx="%d" cy="%d" r="%d" fill="none" stroke="%s" stroke-width="2"/>'
          % (cx, cy, r, S.INK))
    for i in range(16):
        a = 2 * pi * i / 16
        x, y = cx + r * math.cos(a), cy - r * math.sin(a)
        c.line(cx, cy, x, y, S.MUTED, 0.7)
        c.circle(x, y, 5.6 if i == 0 else 4.2, S.RED if i == 0 else S.ORANGE, S.INK, 0.8)
    c.circle(cx, cy, 4, S.INK, S.INK, 0)
    # direction of turn: an arc outside the wheel, counter-clockwise past the start
    rr, a0, a1 = r + 16, math.radians(-28), math.radians(32)
    mid = c.arrowhead(S.RED)
    c.raw('<path d="M %s %s A %s %s 0 0 0 %s %s" fill="none" stroke="%s" stroke-width="1.6"'
          ' marker-end="url(#%s)"/>'
          % (S.fmt(cx + rr * math.cos(a0)), S.fmt(cy - rr * math.sin(a0)), rr, rr,
             S.fmt(cx + rr * math.cos(a1)), S.fmt(cy - rr * math.sin(a1)), S.RED, mid))
    c.text(cx + r + 38, cy + 4, "Achshöhe", 11, S.MUTED, "start")
    c.text(cx + r + 38, cy + 22, "rote Gondel:", 11, S.RED, "start")
    c.text(cx + r + 38, cy + 37, "Start", 11, S.RED, "start")
    return c.svg("Riesenrad mit 16 Gondeln; die rote Gondel startet rechts auf Hoehe der "
                 "Achse und faehrt nach oben, das Rad dreht sich gegen den Uhrzeigersinn")


def fig_hoehe():
    p = S.Plot((-0.8, 17.4), (-4, 62), w=520, h=300, pad=(44, 52, 18, 34))
    p.grid(1, 5)
    p.axes(1, 10, xlabel="t in min", ylabel="h in m", defer_labels=True)
    p.line(p.X(-0.8), p.Y(43), p.X(17.4), p.Y(43), S.GREEN, 1.2, dash="6 4")
    p.line(p.X(-0.8), p.Y(48.2), p.X(17.4), p.Y(48.2), S.INK, 1.1, dash="2 3")
    p.curve(hoehe, 0, 17.2, S.RED, 2.2)
    p.draw_labels()
    for t in (4 / 3, 20 / 3):
        p.point(t, 43, None, color=S.GREEN, size=3.2)
    p.text(p.X(9.6), p.Y(43) + 15, "43 m", 11.5, S.GREEN, "middle", halo=S.PAPER)
    p.text(p.X(9.6), p.Y(48.2) - 6, "48,2 m", 11.5, S.INK, "middle", halo=S.PAPER)
    p.text(p.X(12.2), p.Y(14), "h", 15, S.RED, "start", italic=True, halo=S.PAPER)
    return p.svg("Hoehe der Gondel ueber der Zeit, eine Sinuskurve zwischen 4 m und 56 m "
                 "mit der Periode 16 Minuten, dazu die Linien in 43 m und 48,2 m Hoehe")


def fig_sicht():
    p = S.Plot((-4, 63), (-3, 32), w=470, h=280, pad=(44, 52, 18, 34))
    p.grid(5, 5)
    p.axes(10, 5, xlabel="x in m", ylabel="s in km", defer_labels=True)
    p.dashto(14, sicht(14))
    p.dashto(56, sicht(56))
    p.curve(sicht, 0, 62, S.RED, 2.2, n=400)
    p.draw_labels()
    p.point(14, sicht(14), None, color=S.RED, size=3.4)
    p.point(56, sicht(56), None, color=S.RED, size=3.4)
    p.text(p.X(14) + 6, p.Y(sicht(14)) + 18, "14 m: 13,5 km", 11.5, S.INK, "start",
           halo=S.PAPER)
    p.text(p.X(56) - 6, p.Y(sicht(56)) - 7, "56 m: 26,9 km", 11.5, S.INK, "end",
           halo=S.PAPER)
    p.text(p.X(32), p.Y(16.5), "s", 15, S.RED, "end", italic=True, halo=S.PAPER)
    return p.svg("Sichtweite in Abhaengigkeit von der Hoehe: aus 14 m Hoehe 13,5 km, aus "
                 "der vierfachen Hoehe 56 m die doppelte Sichtweite 26,9 km")


# ------------------------------------------------------------------- sheet ---
s = Sheet("va-bgy11-exponential", "Exponential-, Sinus- und Wurzelfunktionen",
          kind="Vergleichsarbeit-Training",
          suffix="",
          klasse="Berufliches Gymnasium · Klasse 11",
          sub="Berufliches Gymnasium · Klasse 11 · Vergleichsarbeit Mathematik · Teil B · "
              "mit MMS und Formelsammlung · drei Aufgaben, Anforderungsbereiche I bis III",
          desc="Vergleichsarbeit-Training Mathematik, Berufliches Gymnasium Klasse 11: "
               "Exponentialfunktion mit Asymptote und Parametern, der Abbau eines "
               "Medikaments, ein Riesenrad als Sinusfunktion und die Sichtweite als "
               "Wurzelfunktion, mit Lösungen und Abbildungen.",
          plan=("../svp/mathe/vergleichsarbeit.html", "Zur Übersicht"))

s.task(
    "Eine Exponentialfunktion", 1,
    r"Gegeben ist die in $\mathbb{R}$ definierte Funktion $f$ mit "
    r"$f(x) = 0{,}5 \cdot 2^x - 4$.",
    [
        r"Geben Sie den Wertebereich von $f$ an und beschreiben Sie das Monotonieverhalten "
        r"von $f$. Begründen Sie, dass jeder Funktionswert von $f$ größer als $-4$ ist.",
        r"Berechnen Sie die Koordinaten der Schnittpunkte des Graphen mit den beiden "
        r"Koordinatenachsen und den Abstand dieser beiden Punkte.",
        r"Ermitteln Sie das Argument von $f$ zum Funktionswert $12$ und das Argument zum "
        r"Funktionswert $6$.",
        r"Der Graph der Funktion $g$ mit $g(x) = a \cdot 2^x + b$ verläuft durch die Punkte "
        r"$A(0 \mid 1)$ und $B(2 \mid 7)$. Bestimmen Sie $a$ und $b$ und geben Sie den "
        r"Wertebereich von $g$ an.",
    ],
    [
        r"$W_f = \{y \mid y \in \mathbb{R};\ y > -4\}$. Die Basis $2$ ist größer als $1$ "
        r"und der Faktor $0{,}5$ ist positiv, also ist $f$ streng monoton steigend. "
        r"Begründung: Jede Potenz $2^x$ ist positiv, also auch $0{,}5 \cdot 2^x > 0$ und "
        r"damit $f(x) = 0{,}5 \cdot 2^x - 4 > -4$. Für sehr kleine $x$ kommt $2^x$ der "
        r"$0$ beliebig nahe: Die Gerade $y = -4$ ist waagerechte Asymptote, der Wert "
        r"$-4$ selbst wird nie erreicht.",

        r"$f(0) = 0{,}5 \cdot 1 - 4 = -3{,}5$, also $S_y(0 \mid -3{,}5)$. Nullstelle: "
        r"$0{,}5 \cdot 2^x = 4$ ergibt $2^x = 8$, also $x = 3$ und $N(3 \mid 0)$. Abstand: "
        r"$d = \sqrt{3^2 + 3{,}5^2} = \sqrt{21{,}25} \approx 4{,}61$ LE.",

        r"$0{,}5 \cdot 2^x - 4 = 12$ ergibt $2^x = 32 = 2^5$, also $x = 5$. Für den "
        r"Funktionswert $6$: $0{,}5 \cdot 2^x = 10$, also $2^x = 20$ und "
        r"$x = \log_2 20 = \frac{\ln 20}{\ln 2} \approx 4{,}32$.",

        r"Punktprobe mit $A$: $a \cdot 2^0 + b = 1$, also $a + b = 1$. Mit $B$: "
        r"$a \cdot 2^2 + b = 7$, also $4a + b = 7$. Die erste Gleichung von der zweiten "
        r"abziehen: $3a = 6$, also $a = 2$ und $b = -1$. Damit ist "
        r"$g(x) = 2 \cdot 2^x - 1$ und $W_g = \{y \mid y \in \mathbb{R};\ y > -1\}$.",
    ],
    falle=r"Der Wert $-4$ gehört **nicht** zum Wertebereich, der Graph nähert sich der "
          r"Asymptote nur an. Bei d) ist $2^0 = 1$ und nicht $0$; wer das übersieht, "
          r"bekommt aus $A$ fälschlich $b = 1$ und daraus $a = 1{,}5$.",
    solfigs=[(fig_exp(),
              "Der Graph von f (rot) mit der Asymptote y = −4, den Achsenschnittpunkten "
              "und ihrem Abstand (gepunktet), dazu g durch A und B (grün, gestrichelt).")],
)

s.task(
    "Ein Medikament wird abgebaut", 2,
    r"Ein Patient nimmt um $8$ Uhr eine Tablette ein. Vereinfacht wird angenommen, dass der "
    r"Wirkstoff sofort vollständig ins Blut gelangt. Seine Menge im Blut wird dann durch "
    r"$m(t) = a \cdot b^t$ beschrieben, $t$ in Stunden nach der Einnahme, $m(t)$ in "
    r"Milligramm. Eine Stunde nach der Einnahme werden $80$ mg gemessen, drei Stunden "
    r"nach der Einnahme $51{,}2$ mg.",
    [
        r"Bestimmen Sie $a$ und $b$.",
        r"Deuten Sie die Werte von $a$ und $b$ im Sachzusammenhang.",
        r"Der Wirkstoff wirkt, solange mindestens $10$ mg im Blut sind. Berechnen Sie, bis "
        r"zu welcher Uhrzeit die Tablette wirkt.",
        r"Berechnen Sie die Halbwertszeit des Wirkstoffs. Begründen Sie, dass der Wirkstoff "
        r"nach diesem Modell nie vollständig abgebaut wird, und beurteilen Sie diese "
        r"Eigenschaft des Modells.",
    ],
    [
        r"$a \cdot b = 80$ und $a \cdot b^3 = 51{,}2$. Teilt man die zweite Gleichung durch "
        r"die erste, fällt $a$ heraus: $b^2 = \frac{51{,}2}{80} = 0{,}64$, also "
        r"$b = 0{,}8$. Dann ist $a = \frac{80}{0{,}8} = 100$ und "
        r"$m(t) = 100 \cdot 0{,}8^t$.",

        r"$m(0) = a = 100$: Die Tablette enthält $100$ mg Wirkstoff. $b = 0{,}8$: Nach "
        r"jeder Stunde sind noch $80\ \%$ der Menge vom Anfang dieser Stunde im Blut, es "
        r"werden also $20\ \%$ pro Stunde abgebaut.",

        r"$100 \cdot 0{,}8^t = 10$ ergibt $0{,}8^t = 0{,}1$, also "
        r"$t = \frac{\ln 0{,}1}{\ln 0{,}8} \approx 10{,}32$ h. Weil $m$ fällt, sind danach "
        r"weniger als $10$ mg im Blut. $0{,}32$ h sind etwa $19$ min: Die Tablette wirkt "
        r"bis etwa $18{:}19$ Uhr.",

        r"$0{,}8^t = 0{,}5$ ergibt $t = \frac{\ln 0{,}5}{\ln 0{,}8} \approx 3{,}11$ h, das "
        r"sind etwa $3$ h und $6$ min. Jede Potenz $0{,}8^t$ ist positiv, also ist "
        r"$m(t) > 0$ für jedes $t$: Nach dem Modell bleibt immer ein Rest. In Wirklichkeit "
        r"ist der Wirkstoff nach einigen Tagen abgebaut. Das Modell liefert dann winzige "
        r"Werte, etwa $m(48) \approx 0{,}002$ mg. Für die ersten Stunden beschreibt es den "
        r"Abbau gut; dass es nie genau null wird, hat praktisch keine Bedeutung.",
    ],
    falle=r"$20\ \%$ Abbau pro Stunde heißt Faktor $0{,}8$, nicht $0{,}2$. Aus "
          r"$b^2 = 0{,}64$ folgt rechnerisch auch $b = -0{,}8$; das scheidet aus, denn die "
          r"Basis einer Exponentialfunktion ist positiv.",
    solfigs=[(fig_med(),
              "Die Abnahme des Wirkstoffs mit den Messwerten M₁ und M₂, der Halbwertszeit "
              "und der Wirkgrenze von 10 mg (grün).")],
)

s.task(
    "Riesenrad mit Aussicht", 3,
    r"Die Höhe einer Gondel eines Riesenrads über dem Boden wird durch "
    r"$h(t) = 26 \cdot \sin\left(\frac{\pi}{8} \cdot t\right) + 30$ beschrieben, $t$ in "
    r"Minuten ab dem Moment, in dem die Gondel auf Höhe der Radachse nach oben fährt, "
    r"$h(t)$ in Metern. Bei klarem Wetter reicht der Blick aus der Höhe $x$ (in Metern) "
    r"näherungsweise $s(x) = 3{,}6 \cdot \sqrt{x}$ Kilometer weit.",
    [
        r"Geben Sie die kleinste Periode und den Wertebereich von $h$ an und deuten Sie die "
        r"Zahlen $26$ und $30$ im Sachzusammenhang. Begründen Sie, dass $h$ keine "
        r"Nullstellen hat.",
        r"Neben dem Rad steht ein Turm mit einer Aussichtsplattform in $43$ m Höhe. "
        r"Bestimmen Sie die Nullstellen der Funktion $k$ mit $k(t) = h(t) - 43$ für "
        r"$0 \leq t \leq 16$ und deuten Sie sie. Geben Sie an, wie lange die Gondel während "
        r"einer Umdrehung höher als die Plattform ist.",
        r"Berechnen Sie die größte Sichtweite während der Fahrt. Ermitteln Sie, ab welcher "
        r"Höhe man mindestens $25$ km weit sieht und wie lange das während einer Umdrehung "
        r"der Fall ist.",
        r"Beurteilen Sie die Aussage: „Wer doppelt so hoch sitzt, sieht doppelt so weit.“ "
        r"Geben Sie an, wie sich die Höhe ändern muss, damit sich die Sichtweite "
        r"verdoppelt.",
    ],
    [
        r"Periode: $p = \frac{2\pi}{\pi/8} = 16$ min, so lange dauert eine Umdrehung. Der "
        r"Sinus liegt zwischen $-1$ und $1$, also "
        r"$W_h = \{y \mid y \in \mathbb{R};\ 4 \leq y \leq 56\}$. $30$ m ist die Höhe der "
        r"Radachse, $26$ m der Radius, das Rad hat also $52$ m Durchmesser. Wegen "
        r"$h(t) \geq 30 - 26 = 4 > 0$ hat $h$ keine Nullstellen: Auch ganz unten ist die "
        r"Gondel noch $4$ m über dem Boden, der Einstieg liegt auf einem Podest.",

        r"$26 \cdot \sin\left(\frac{\pi}{8}t\right) + 30 = 43$ ergibt "
        r"$\sin\left(\frac{\pi}{8}t\right) = \frac{1}{2}$. Im Intervall gilt das für "
        r"$\frac{\pi}{8}t = \frac{\pi}{6}$ und für $\frac{\pi}{8}t = \frac{5\pi}{6}$, also "
        r"$t_1 = \frac{4}{3} \approx 1{,}33$ und $t_2 = \frac{20}{3} \approx 6{,}67$. Nach "
        r"$1$ min $20$ s erreicht die Gondel auf dem Weg nach oben die Höhe der Plattform, "
        r"nach $6$ min $40$ s auf dem Weg nach unten wieder. Dazwischen ist sie höher, "
        r"nämlich $\frac{16}{3}$ min lang, also $5$ min $20$ s, ein Drittel der Umdrehung.",

        r"Am höchsten Punkt: $s(56) = 3{,}6 \cdot \sqrt{56} \approx 26{,}9$ km. Aus "
        r"$3{,}6 \cdot \sqrt{x} \geq 25$ folgt $\sqrt{x} \geq \frac{25}{3{,}6}$, also "
        r"$x \geq \left(\frac{25}{3{,}6}\right)^2 \approx 48{,}2$ m. Mit dem MMS hat "
        r"$h(t) = 48{,}2$ in der ersten Umdrehung die Lösungen $t_1 \approx 1{,}97$ und "
        r"$t_2 \approx 6{,}03$. Etwa $4$ Minuten lang reicht der Blick $25$ km weit oder "
        r"weiter.",

        r"Die Aussage ist **falsch**. $s(2x) = 3{,}6 \cdot \sqrt{2x} = \sqrt{2} \cdot s(x) "
        r"\approx 1{,}41 \cdot s(x)$: Die doppelte Höhe bringt nur etwa $41\ \%$ mehr "
        r"Sichtweite. Für die doppelte Sichtweite braucht man die vierfache Höhe, denn "
        r"$\sqrt{4x} = 2 \cdot \sqrt{x}$. Beispiel am Rad: Aus $14$ m Höhe sieht man "
        r"$s(14) \approx 13{,}5$ km weit, aus der vierfachen Höhe von $56$ m etwa "
        r"$26{,}9$ km, also doppelt so weit.",
    ],
    falle=r"Bei b) liefert der Rechner für $\sin z = \frac{1}{2}$ nur $z = \frac{\pi}{6}$. "
          r"Die zweite Lösung $\pi - \frac{\pi}{6} = \frac{5\pi}{6}$ kommt aus der "
          r"Symmetrie der Sinuskurve. Das MMS muss dabei im Bogenmaß rechnen, sonst stimmen "
          r"die Zeiten nicht.",
    figs=[(fig_rad(),
           "Das Riesenrad. Die rote Gondel startet auf Höhe der Achse und fährt nach oben.")],
    solfigs=[(fig_hoehe(),
              "Zu b) und c): Die Höhe der Gondel, die Plattform in 43 m (grün) und die "
              "Höhe 48,2 m für 25 km Sicht (gepunktet)."),
             (fig_sicht(),
              "Zu d): Die vierfache Höhe ergibt die doppelte Sichtweite.")],
)


def check():
    """Every number in the solutions, recomputed."""
    # --- Aufgabe 1 -----------------------------------------------------------------
    assert f1(0) == Fr(-7, 2) and f1(3) == 0 and f1(5) == 12
    assert all(f1(k / 10) > -4 for k in range(-200, 80))
    assert all(f1(k / 10) < f1((k + 1) / 10) for k in range(-80, 80))
    assert abs(f1(-40.0) + 4) < 1e-9                         # Asymptote y = -4
    assert 2 ** 3 == 8 and 2 ** 5 == 32
    assert 3 ** 2 + 3.5 ** 2 == 21.25 and round(sqrt(21.25), 2) == 4.61
    assert abs(f1(X6) - 6) < 1e-12 and round(X6, 2) == 4.32
    assert abs(log(20, 2) - X6) < 1e-12
    assert g1(0) == 1 and g1(2) == 7
    assert A_G + B_G == 1 and 4 * A_G + B_G == 7 and 3 * A_G == 6
    assert all(g1(k / 10) > -1 for k in range(-300, 50))
    # die Falle: 2^0 als 0 gelesen -> b = 1, dann 4a + 1 = 7
    assert Fr(7 - 1, 4) == Fr(3, 2)
    # --- Aufgabe 2 -----------------------------------------------------------------
    assert abs(med(1) - 80) < 1e-9 and abs(med(3) - 51.2) < 1e-9
    assert abs(51.2 / 80 - 0.64) < 1e-12 and abs(sqrt(0.64) - M_B) < 1e-12
    assert abs(80 / 0.8 - M_A) < 1e-12 and med(0) == 100
    assert abs(med(T10) - 10) < 1e-9 and round(T10, 2) == 10.32
    assert all(med(T10 + k / 10) < 10 for k in range(1, 100))
    assert round((T10 - 10) * 60) == 19                     # 18:19 Uhr
    h_end, m_end = 8 + int(T10), round((T10 - int(T10)) * 60)
    assert (h_end, m_end) == (18, 19)
    assert abs(med(T_HALF) - 50) < 1e-9 and round(T_HALF, 2) == 3.11
    assert round((T_HALF - 3) * 60) == 6
    assert round(med(48), 3) == 0.002
    assert all(med(t) > 0 for t in range(0, 500))
    # --- Aufgabe 3 -----------------------------------------------------------------
    assert abs(2 * pi / (pi / 8) - PERIOD) < 1e-12
    hs = [hoehe(k / 100) for k in range(0, 1601)]
    assert abs(min(hs) - 4) < 1e-6 and abs(max(hs) - 56) < 1e-6
    assert hoehe(0) == 30 and hoehe(0.1) > 30                # startet nach oben
    assert AXIS - RAD == 4 and 2 * RAD == 52
    t1, t2 = 4 / 3, 20 / 3
    assert abs(hoehe(t1) - 43) < 1e-9 and abs(hoehe(t2) - 43) < 1e-9
    assert abs(pi / 8 * t1 - pi / 6) < 1e-12 and abs(pi / 8 * t2 - 5 * pi / 6) < 1e-12
    assert round(t1, 2) == 1.33 and round(t2, 2) == 6.67
    assert round(t1 * 60) == 80 and round(t2 * 60) == 400   # 1 min 20 s, 6 min 40 s
    assert abs((t2 - t1) - 16 / 3) < 1e-12 and round((t2 - t1) * 60) == 320
    assert abs((t2 - t1) / PERIOD - 1 / 3) < 1e-12
    above = sum(1 for k, v in enumerate(hs) if v > 43) / 100
    assert abs(above - 16 / 3) < 0.02
    assert round(sicht(56), 1) == 26.9
    assert abs(sicht(X25) - 25) < 1e-9 and round(X25, 1) == 48.2
    assert round(T25, 2) == 1.97 and round(8 - T25, 2) == 6.03
    assert abs(hoehe(T25) - 48.2) < 1e-9 and abs(hoehe(8 - T25) - 48.2) < 1e-9
    assert round(8 - 2 * T25) == 4
    # with the exact height instead of 48,2 the duration hardly changes
    t_exact = asin((X25 - AXIS) / RAD) * 8 / pi
    assert round(8 - 2 * t_exact) == 4
    assert abs(sicht(2 * 20) / sicht(20) - sqrt(2)) < 1e-12 and round(sqrt(2), 2) == 1.41
    assert round((sqrt(2) - 1) * 100) == 41
    assert abs(sicht(4 * 7) / sicht(7) - 2) < 1e-12
    assert round(sicht(14), 1) == 13.5 and abs(sicht(56) / sicht(14) - 2) < 1e-12


s.verify(check)
s.save()

#!/usr/bin/env python3
"""Abitur-Training BGY - Wachstum und Zerfall (Exponentialfunktionen).

    python3 tools/aufgaben/abi/wachstum.py

Task types follow the Sachsen originals 2022-2025 (exponential decay with half-life,
bounded growth towards a saturation level, two competing models on the same data).
Wording, numbers and every figure are our own - the originals are not reproduced.
"""
import os
import sys
from math import exp, log

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from textaufgaben import Sheet                                     # noqa: E402
import svgfig as S                                                 # noqa: E402


# --------------------------------------------------------------- functions ---
# Task 1: radon in a sealed cellar, 900 Bq/m3 at t = 0, 300 Bq/m3 after six days.
K_ZERFALL = log(3) / 6.0                    # decay constant per day
T_HALB = log(2) / K_ZERFALL                 # half-life in days


def akt(t):
    """Activity concentration in Bq per cubic metre, t in days."""
    return 900 * exp(-K_ZERFALL * t)


# Task 2: battery on the charger, 20 % at t = 0, 60 % after 15 minutes.
K_LADEN = log(2) / 15.0                     # per minute


def lad(t):
    """State of charge in percent, t in minutes."""
    return 100 - 80 * exp(-K_LADEN * t)


def dlad(t):
    """Rate of charge in percentage points per minute."""
    return 80 * K_LADEN * exp(-K_LADEN * t)


# Task 3: two models on the same two data points, 2 (in thousands) at t = 0 and 6 at t = 4.
A_EXP = log(3) / 4.0                        # exponential model, per month
B_BES = log(5.0 / 3.0) / 4.0                # bounded model, per month


def na(t):
    """Exponential model, users in thousands, t in months."""
    return 2 * exp(A_EXP * t)


def nb(t):
    """Bounded model with saturation 12 (thousand users)."""
    return 12 - 10 * exp(-B_BES * t)


def diff(t):
    return na(t) - nb(t)


def root(fn, a, b, n=90):
    """Plain bisection - the difference equation mixes two exponentials and has no
    closed form, so the sheet solves it the way the exam allows: by trying."""
    for _ in range(n):
        m = 0.5 * (a + b)
        if fn(a) * fn(m) <= 0:
            b = m
        else:
            a = m
    return 0.5 * (a + b)


T_STERN = root(lambda t: diff(t) - 3.0, 4.0, 8.0)     # gap first exceeds 3000 users
T_MAX_AB = root(lambda t: 2 * A_EXP * exp(A_EXP * t) - 10 * B_BES * exp(-B_BES * t), 0.5, 4.0)


# ------------------------------------------------------------------ helper ---
def vmeasure(p, u, v1, v2, label, lx, ly, anchor="start", color=S.GREEN, size=12):
    """Vertical double arrow at world x = u between two world y values.

    svgfig only knows the horizontal brace, so the measure is built from two arrows;
    the label is placed in pixel coordinates, which keeps it off the curve."""
    x = p.X(u)
    p.arrow(x, p.Y(v1), x, p.Y(v2), color, 1.2)
    p.arrow(x, p.Y(v2), x, p.Y(v1), color, 1.2)
    if label:
        p.text(lx, ly, label, size, color, anchor, halo=S.PAPER)


# ----------------------------------------------------------------- figures ---
def fig_zerfall():
    """Decay curve with the halving staircase - two equal steps on the time axis."""
    p = S.Plot((-1.3, 14.6), (-95, 1010), w=540, h=340, pad=(52, 26, 22, 36))
    p.grid(1, 150)
    p.axes(2, 300, xlabel="t", ylabel="A")
    p.curve(akt, 0, 14.5, S.RED, 2.2)
    # staircase: down to half, across to the curve, down to a quarter, across again
    p.seg((0, 450), (T_HALB, 450), S.ORANGE, 1.7, dash="5 4")
    p.seg((T_HALB, 450), (T_HALB, 225), S.ORANGE, 1.7, dash="5 4")
    p.seg((T_HALB, 225), (2 * T_HALB, 225), S.ORANGE, 1.7, dash="5 4")
    p.seg((T_HALB, 225), (T_HALB, 0), S.MUTED, 1.0, dash="3 3")
    p.seg((2 * T_HALB, 225), (2 * T_HALB, 0), S.MUTED, 1.0, dash="3 3")
    p.point(0, 900, None)
    p.point(T_HALB, 450, None)
    p.point(2 * T_HALB, 225, None)
    p.text(p.X(0) + 10, p.Y(900) + 4, "900", 12, S.INK, "start", halo=S.PAPER)
    p.text(p.X(T_HALB) + 10, p.Y(450) - 7, "450", 12, S.INK, "start", halo=S.PAPER)
    p.text(p.X(2 * T_HALB) + 10, p.Y(225) - 7, "225", 12, S.INK, "start", halo=S.PAPER)
    p.brace(0, T_HALB, 55, "3,8 Tage", S.GREEN)
    p.brace(T_HALB, 2 * T_HALB, 55, "3,8 Tage", S.GREEN)
    p.text(p.X(14.5), p.Y(950), "t in Tagen, A in Bq je Kubikmeter", 12, S.MUTED, "end")
    return p.svg("Zerfallskurve mit zwei gleich langen Halbierungsschritten von 900 auf "
                 "450 und von 450 auf 225")


def fig_akku():
    """Bounded growth: the curve, its asymptote and the gap to saturation at t = 15."""
    p = S.Plot((-4.5, 72), (-9, 119), w=540, h=330, pad=(50, 26, 22, 36))
    p.grid(5, 10)
    p.axes(10, 20, xlabel="t", ylabel="L")
    p.seg((0, 100), (72, 100), S.ORANGE, 1.8, dash="7 4")
    p.text(p.X(70), p.Y(107), "Sättigungsgrenze S = 100 %", 12, S.BODY, "end", halo=S.PAPER)
    p.curve(lad, 0, 71.5, S.RED, 2.2)
    p.seg((15, 0), (15, 60), S.MUTED, 1.0, dash="3 3")
    vmeasure(p, 15, 60, 100, "Abstand 40", p.X(15) + 8, p.Y(78))
    p.point(0, 20, None)
    p.point(15, 60, None)
    p.text(p.X(70), p.Y(9), "t in Minuten, L in Prozent", 12, S.MUTED, "end")
    return p.svg("Ladekurve, die sich von unten der waagerechten Linie bei hundert Prozent "
                 "naehert, mit dem Abstand von vierzig Prozentpunkten nach 15 Minuten")


def fig_abstaende():
    """Solution figure: the gap to saturation halves every quarter of an hour."""
    p = S.Plot((-4.5, 72), (-9, 119), w=540, h=330, pad=(50, 26, 22, 36))
    p.grid(5, 10)
    p.axes(10, 20, xlabel="t", ylabel="L")
    p.seg((0, 100), (72, 100), S.ORANGE, 1.8, dash="7 4")
    p.curve(lad, 0, 71.5, S.RED, 2.2)
    for t, v in ((15, 60), (30, 80), (45, 90)):
        p.seg((t, 0), (t, v), S.MUTED, 1.0, dash="3 3")
        p.point(t, v, None)
    vmeasure(p, 15, 60, 100, "40", p.X(15) + 8, p.Y(78))
    vmeasure(p, 30, 80, 100, "20", p.X(30) + 8, p.Y(89))
    vmeasure(p, 45, 90, 100, "10", p.X(45) + 8, p.Y(85) + 22)
    p.text(p.X(70), p.Y(105), "Sättigungsgrenze 100 %", 12, S.BODY, "end", halo=S.PAPER)
    p.text(p.X(3), p.Y(112), "alle 15 Minuten halbiert sich der Abstand", 12, S.MUTED, "start")
    return p.svg("Dieselbe Ladekurve mit den Abstaenden vierzig, zwanzig und zehn "
                 "Prozentpunkten nach 15, 30 und 45 Minuten")


def fig_modelle():
    """Both models through the same two data points, the gap between them shaded."""
    p = S.Plot((-0.9, 12.7), (-1.6, 20.6), w=540, h=350, pad=(50, 26, 22, 36))
    p.grid(1, 2)
    p.axes(2, 4, xlabel="t", ylabel="N")
    p.area_between(na, nb, 4, 12, S.ORANGE, 0.22)
    p.seg((0, 12), (12.7, 12), S.MUTED, 1.4, dash="6 4")
    p.curve(na, 0, 12.4, S.RED, 2.2)
    p.curve(nb, 0, 12.5, S.GREEN, 2.2)
    p.point(0, 2, None, color=S.INK)
    p.point(4, 6, None, color=S.INK)
    p.text(p.X(4) - 9, p.Y(6) - 9, "Messwerte", 12, S.INK, "end", halo=S.PAPER)
    p.text(p.X(8.3) - 8, p.Y(19.0), "exponentiell", 12.5, S.RED, "end", halo=S.PAPER)
    p.text(p.X(10.5), p.Y(9.384) + 24, "beschränkt", 12.5, S.GREEN, "middle", halo=S.PAPER)
    p.text(p.X(12.5), p.Y(12) - 7, "Sättigungsgrenze 12 000 Nutzer", 12, S.BODY, "end",
           halo=S.PAPER)
    p.text(p.X(12.5), p.Y(1.2), "t in Monaten, N in Tausend", 12, S.MUTED, "end")
    return p.svg("Beide Modellkurven durch dieselben zwei Messpunkte, danach geht die "
                 "Schere zwischen ihnen auf")


def fig_differenz():
    """Solution figure: the difference of the two models against the 3000 mark."""
    p = S.Plot((-0.7, 8.6), (-1.4, 6.6), w=520, h=360, pad=(48, 24, 20, 34))
    p.grid(1, 1)
    p.axes(1, 1, xlabel="t", ylabel="D")
    p.seg((0, 3), (8.6, 3), S.ORANGE, 1.7, dash="6 4")
    p.curve(diff, 0, 8.5, S.RED, 2.2)
    p.seg((T_STERN, 3), (T_STERN, 0), S.MUTED, 1.0, dash="3 3")
    p.point(T_STERN, 3, None)
    p.point(0, 0, None, color=S.INK, size=3.0)
    p.point(4, 0, None, color=S.INK, size=3.0)
    p.text(p.X(0.4), p.Y(3) - 8, "Grenze 3000 Nutzer", 12, S.BODY, "start", halo=S.PAPER)
    p.text(p.X(T_STERN) + 9, p.Y(3) + 17, "t = 5,98", 12, S.INK, "start", halo=S.PAPER)
    p.text(p.X(6.3), p.Y(5.6), "Differenz der beiden Modelle", 12, S.MUTED, "end",
           halo=S.PAPER)
    return p.svg("Graph der Differenz beider Modelle, zwischen null und vier Monaten "
                 "negativ, danach steigend und bei knapp sechs Monaten ueber der Marke drei")


# ------------------------------------------------------------------- sheet ---
s = Sheet("abitur-bgy-wachstum", "Wachstum und Zerfall — Exponentialfunktionen",
          kind="Abitur-Training",
          suffix="",
          klasse="Berufliches Gymnasium",
          sub="Berufliches Gymnasium · Pflichtaufgabe 1 · Grund- und Leistungskurs · "
              "drei Aufgaben, Anforderungsbereiche I bis III",
          desc="Abitur-Training Mathematik BGY, Wachstum und Zerfall: exponentieller "
               "Zerfall mit Halbwertszeit, beschränktes Wachstum mit Sättigungsgrenze "
               "und der Vergleich zweier Modelle, mit Lösungen und Abbildungen.",
          plan=("../svp/mathe/abitur.html", "Zur Übersicht"))

s.task(
    "Radon im Keller", 1,
    r"Ein Kellerraum wird gegen aufsteigendes Radon abgedichtet, neues Gas dringt danach "
    r"nicht mehr nach. Die Aktivitätskonzentration des eingeschlossenen Radons nimmt dann "
    r"exponentiell ab: $A(t) = A_0 \cdot e^{-k \cdot t}$. Dabei ist $t$ die Zeit in Tagen "
    r"seit dem Abdichten und $A(t)$ die Konzentration in Becquerel je Kubikmeter. "
    r"Unmittelbar nach dem Abdichten werden 900 Bq je Kubikmeter gemessen, sechs Tage "
    r"später noch 300.",
    [
        r"Bestimmen Sie $A_0$ und die Zerfallskonstante $k$ aus den beiden Messwerten.",
        r"Berechnen Sie die Halbwertszeit des Radons.",
        r"Berechnen Sie die Konzentration zehn Tage nach dem Abdichten.",
        r"Bestimmen Sie den Zeitpunkt, zu dem die Konzentration auf 100 Bq je Kubikmeter "
        r"gesunken ist.",
    ],
    [
        r"Der erste Messwert gehört zu $t = 0$, also ist $A_0 = 900$. Der zweite liefert "
        r"$900 \cdot e^{-6k} = 300$, nach Division $e^{-6k} = \dfrac{1}{3}$. Logarithmieren "
        r"beider Seiten ergibt $-6 \cdot k = \ln \dfrac{1}{3} = -\ln 3$ und damit "
        r"$k = \dfrac{\ln 3}{6} \approx 0{,}1831$ je Tag.",
        r"Halbwertszeit heißt $A(T) = \dfrac{1}{2} \cdot A_0$, also $e^{-k \cdot T} = "
        r"\dfrac{1}{2}$ und $T = \dfrac{\ln 2}{k} = \dfrac{6 \cdot \ln 2}{\ln 3} \approx "
        r"3{,}79$ Tage. Der Anfangswert $A_0$ kürzt sich heraus: Die Halbwertszeit ist "
        r"**immer dieselbe**, egal von welchem Wert aus man misst.",
        r"$A(10) = 900 \cdot e^{-0{,}1831 \cdot 10} \approx 900 \cdot 0{,}1602 \approx 144$. "
        r"Zehn Tage nach dem Abdichten sind es noch rund **144 Bq je Kubikmeter**.",
        r"Aus $900 \cdot e^{-k \cdot t} = 100$ folgt $e^{-k \cdot t} = \dfrac{1}{9}$, also "
        r"$k \cdot t = \ln 9 = 2 \cdot \ln 3$ und damit "
        r"$t = \dfrac{2 \cdot \ln 3}{k} = \dfrac{2 \cdot \ln 3 \cdot 6}{\ln 3} = 12$. "
        r"Nach **genau 12 Tagen** ist der Wert erreicht — das sind zwei Schritte von je "
        r"sechs Tagen, in denen sich die Konzentration jeweils drittelt.",
    ],
    falle=r"Der Zerfall ist nicht linear. Wer aus dem Rückgang um 600 Bq je Kubikmeter in "
          r"sechs Tagen 100 Bq je Tag macht, ist nach neun Tagen bei null. Konstant ist "
          r"nicht die Differenz, sondern der **Faktor**: alle sechs Tage ein Drittel, alle "
          r"3,8 Tage die Hälfte — deshalb wird der Wert nie null.",
    figs=[(fig_zerfall(),
           "Die Zerfallskurve. Von 900 auf 450 vergehen 3,8 Tage, von 450 auf 225 noch "
           "einmal genauso lange — die Halbierungszeit bleibt gleich.")],
)

s.task(
    "Die letzten Prozent am Ladegerät", 2,
    r"Ein Akku hängt am Ladegerät. Sein Ladezustand lässt sich durch "
    r"$L(t) = 100 - 80 \cdot e^{-k \cdot t}$ beschreiben; dabei ist $t$ die Ladezeit in "
    r"Minuten und $L(t)$ der Ladezustand in Prozent. Beim Anstecken zeigt der Akku 20 %, "
    r"nach 15 Minuten sind es 60 %.",
    [
        r"Bestimmen Sie die Konstante $k$.",
        r"Untersuchen Sie das Verhalten von $L$ für $t \to \infty$ und begründen Sie, dass "
        r"der Ladezustand von 100 % nie erreicht wird.",
        r"Berechnen Sie den Zeitpunkt, zu dem der Akku zu 90 % geladen ist.",
        r"Berechnen Sie die momentane Änderungsrate des Ladezustands nach 15 Minuten und "
        r"vergleichen Sie sie mit der Änderungsrate zu Beginn.",
    ],
    [
        r"$L(15) = 60$ bedeutet $100 - 80 \cdot e^{-15k} = 60$, also $80 \cdot e^{-15k} = 40$ "
        r"und nach Division $e^{-15k} = \dfrac{1}{2}$. Logarithmieren liefert "
        r"$-15 \cdot k = -\ln 2$, also $k = \dfrac{\ln 2}{15} \approx 0{,}0462$ je Minute.",
        r"Für $t \to \infty$ geht $e^{-k \cdot t}$ gegen null, also $L(t) \to 100$. Der "
        r"Graph nähert sich der waagerechten Asymptote bei 100 von unten an. Erreicht wird "
        r"sie nie, denn die e-Funktion ist **immer positiv**: Der Abstand zur Grenze ist "
        r"$100 - L(t) = 80 \cdot e^{-k \cdot t} > 0$ für jedes $t$. Die Sättigungsgrenze "
        r"beträgt **100 %**.",
        r"$100 - 80 \cdot e^{-k \cdot t} = 90$ ergibt $e^{-k \cdot t} = \dfrac{10}{80} = "
        r"\dfrac{1}{8}$, also $k \cdot t = \ln 8 = 3 \cdot \ln 2$ und damit "
        r"$t = \dfrac{3 \cdot \ln 2}{k} = \dfrac{3 \cdot \ln 2 \cdot 15}{\ln 2} = 45$. Nach "
        r"**45 Minuten** ist der Akku zu 90 % geladen — für die nächsten 30 Prozentpunkte "
        r"braucht er mit 30 Minuten doppelt so lange wie für die ersten 40 Prozentpunkte.",
        r"Mit der Kettenregel ist $L'(t) = 80 \cdot k \cdot e^{-k \cdot t}$. Zu Beginn "
        r"$L'(0) = 80 \cdot \dfrac{\ln 2}{15} \approx 3{,}70$ Prozentpunkte je Minute, nach "
        r"15 Minuten $L'(15) = 3{,}70 \cdot \dfrac{1}{2} \approx 1{,}85$ Prozentpunkte je "
        r"Minute. Der Akku lädt dann also nur noch **halb so schnell**; in derselben Zeit, "
        r"in der sich der Abstand zur Sättigungsgrenze halbiert, halbiert sich auch die "
        r"Änderungsrate.",
    ],
    falle=r"Was sich alle 15 Minuten halbiert, ist nicht der Ladezustand, sondern der "
          r"**Abstand zur Sättigungsgrenze**: 80, 40, 20, 10 Prozentpunkte. Wer die 40 "
          r"Prozentpunkte der ersten Viertelstunde einfach fortschreibt, meldet den Akku "
          r"nach einer halben Stunde als voll — tatsächlich sind es dann erst 80 %.",
    figs=[(fig_akku(),
           "Die Ladekurve mit der Sättigungsgrenze als gestrichelter Linie. Nach 15 "
           "Minuten fehlen noch 40 Prozentpunkte bis zur Grenze.")],
    solfigs=[(fig_abstaende(),
              "Zu d): Der Abstand zur Sättigungsgrenze halbiert sich alle 15 Minuten — 40, "
              "20, 10 Prozentpunkte. Genauso verhält sich die Änderungsrate.")],
)

s.task(
    "Zwei Modelle, eine Messreihe", 3,
    r"Eine Lern-App wird seit dem Start beobachtet. Zu Beginn waren 2000 Nutzerinnen und "
    r"Nutzer registriert, nach vier Monaten 6000. Der erreichbare Markt umfasst höchstens "
    r"12 000 Personen. Zwei Modelle sollen die Entwicklung beschreiben, dabei ist $t$ die "
    r"Zeit in Monaten und $N$ die Nutzerzahl in Tausend: das exponentielle Modell "
    r"$N_A(t) = 2 \cdot e^{a \cdot t}$ und das beschränkte Modell "
    r"$N_B(t) = 12 - 10 \cdot e^{-b \cdot t}$.",
    [
        r"Bestimmen Sie die Konstanten $a$ und $b$ so, dass beide Modelle die beiden "
        r"Messwerte treffen.",
        r"Berechnen Sie die Prognosen beider Modelle für $t = 12$ und begründen Sie mit dem "
        r"Verhalten für $t \to \infty$, welches Modell für eine langfristige Vorhersage "
        r"geeignet ist.",
        r"Bestimmen Sie den Zeitpunkt, ab dem sich die beiden Prognosen um mehr als 3000 "
        r"Nutzer unterscheiden.",
        r"Beurteilen Sie die Aussage: „Nach einem Jahr hat die App mehr als 50 000 Nutzer.“",
    ],
    [
        r"**Modell A:** Wegen $N_A(0) = 2$ passt der Anfangswert bereits. Aus $N_A(4) = 6$ "
        r"folgt $2 \cdot e^{4a} = 6$, also $e^{4a} = 3$ und "
        r"$a = \dfrac{\ln 3}{4} \approx 0{,}2747$. **Modell B:** Auch hier stimmt der "
        r"Anfangswert schon, denn $N_B(0) = 12 - 10 = 2$. Aus $N_B(4) = 6$ folgt "
        r"$10 \cdot e^{-4b} = 6$, also $e^{-4b} = 0{,}6$ und "
        r"$b = -\dfrac{\ln 0{,}6}{4} = \dfrac{\ln \frac{5}{3}}{4} \approx 0{,}1277$.",
        r"$N_A(12) = 2 \cdot e^{12a} = 2 \cdot 3^3 = 54$, also **54 000** Nutzer. "
        r"$N_B(12) = 12 - 10 \cdot 0{,}6^3 = 12 - 2{,}16 = 9{,}84$, also **9840** Nutzer. "
        r"Für $t \to \infty$ geht $e^{-b \cdot t}$ gegen null, damit $N_B(t) \to 12$: Modell "
        r"B bleibt für immer unter der Marktgrenze. Modell A wächst dagegen über jede "
        r"Schranke und überschreitet die 12 000 schon nach "
        r"$t = \dfrac{\ln 6}{a} \approx 6{,}5$ Monaten. Langfristig ist deshalb nur "
        r"**Modell B** brauchbar.",
        r"Gesucht ist die Lösung von $D(t) = N_A(t) - N_B(t) = 3$, ausgeschrieben "
        r"$2 \cdot e^{a \cdot t} + 10 \cdot e^{-b \cdot t} - 12 = 3$. In dieser Gleichung "
        r"stehen zwei verschiedene Exponentialterme, sie lässt sich nicht nach $t$ "
        r"auflösen — hier hilft systematisches Probieren. Aus $D(5{,}9) \approx 2{,}82$ und "
        r"$D(6) \approx 3{,}04$ folgt: Die Grenze wird zwischen diesen beiden Zeitpunkten "
        r"überschritten, genauer bei $t \approx 5{,}98$. Also **nach knapp sechs Monaten** "
        r"unterscheiden sich die Prognosen um mehr als 3000 Nutzer.",
        r"Die Aussage stützt sich **allein auf Modell A**, dort ist $N_A(12) = 54$, also "
        r"mehr als 50. Modell B sagt für denselben Zeitpunkt nur 9840 Nutzer voraus. Dass "
        r"beide Modelle die Messwerte exakt treffen, ist kein Gütesiegel: Zwei Messwerte "
        r"legen in beiden Modellen genau die zwei freien Größen fest. Entscheidend ist die "
        r"Sachlage — es gibt höchstens 12 000 mögliche Nutzer, und Modell A verletzt diese "
        r"Vorgabe bereits nach gut einem halben Jahr. Die Aussage ist damit **nicht "
        r"haltbar**. Kurzfristig taugen beide Modelle: In den ersten vier Monaten liegen "
        r"sie nie mehr als rund 800 Nutzer auseinander.",
    ],
    falle=r"„Geht durch die Messpunkte“ ist kein Argument für ein Modell. Zwei Punkte legen "
          r"zwei Parameter fest, das schafft hier **jedes** der beiden Modelle. Wer "
          r"entscheiden will, muss auf das Verhalten zwischen den Messwerten und auf das "
          r"Grenzverhalten danach schauen.",
    figs=[(fig_modelle(),
           "Beide Modelle laufen durch dieselben zwei Messpunkte. Danach geht die Schere "
           "auf: Der exponentielle Graph verlässt das Bild, der beschränkte legt sich an "
           "die Marktgrenze.")],
    solfigs=[(fig_differenz(),
              "Zu c): der Graph der Differenz beider Modelle. Zwischen den Messwerten ist "
              "sie negativ — dort liegt das beschränkte Modell vorn —, danach steigt sie "
              "und überschreitet die Marke 3 kurz vor dem sechsten Monat.")],
)


def check():
    """Every number in the solutions, recomputed."""
    # --- Aufgabe 1: Zerfall -------------------------------------------------
    assert abs(akt(0) - 900) < 1e-9 and abs(akt(6) - 300) < 1e-9
    assert abs(K_ZERFALL - 0.1831) < 0.0005
    assert abs(T_HALB - 3.79) < 0.005
    assert abs(6 * log(2) / log(3) - T_HALB) < 1e-12
    assert abs(exp(-K_ZERFALL * 10) - 0.1602) < 0.0005
    assert abs(akt(10) - 144) < 0.5
    assert abs(akt(12) - 100) < 1e-9                       # exactly twelve days
    assert abs(2 * log(3) / K_ZERFALL - 12) < 1e-12
    assert abs(akt(T_HALB) - 450) < 1e-9                   # the staircase in the figure
    assert abs(akt(2 * T_HALB) - 225) < 1e-9
    assert abs(900 - 100 * 9) < 1e-12                      # linear guess would hit zero at t = 9

    # --- Aufgabe 2: beschraenktes Wachstum ----------------------------------
    assert abs(lad(0) - 20) < 1e-9 and abs(lad(15) - 60) < 1e-9
    assert abs(K_LADEN - 0.0462) < 0.0005
    assert abs(lad(45) - 90) < 1e-9                        # exactly 45 minutes
    assert abs(3 * log(2) / K_LADEN - 45) < 1e-12
    assert abs(lad(30) - 80) < 1e-9                        # the "already full" trap
    for t, gap in ((0, 80), (15, 40), (30, 20), (45, 10)):
        assert abs((100 - lad(t)) - gap) < 1e-9
    assert lad(200) < 100 and 100 - lad(200) > 0            # never reaches the limit
    assert abs(lad(15) - lad(0) - 40) < 1e-9 and abs(lad(45) - lad(15) - 30) < 1e-9
    assert abs(dlad(0) - 3.70) < 0.005
    assert abs(dlad(15) - 1.85) < 0.005
    assert abs(dlad(15) - dlad(0) / 2) < 1e-12

    # --- Aufgabe 3: zwei Modelle --------------------------------------------
    assert abs(na(0) - 2) < 1e-9 and abs(nb(0) - 2) < 1e-9
    assert abs(na(4) - 6) < 1e-9 and abs(nb(4) - 6) < 1e-9
    assert abs(A_EXP - 0.2747) < 0.0005
    assert abs(B_BES - 0.1277) < 0.0005
    assert abs(na(12) - 54) < 1e-9                         # 2 * 3^3
    assert abs(nb(12) - 9.84) < 1e-9                       # 12 - 10 * 0.6^3
    assert abs(log(6) / A_EXP - 6.52) < 0.005              # model A passes the market cap
    assert abs(diff(5.9) - 2.82) < 0.005
    assert abs(diff(6.0) - 3.04) < 0.005
    assert abs(T_STERN - 5.98) < 0.005
    assert diff(T_STERN - 0.1) < 3 < diff(T_STERN + 0.1)   # crossing, not touching
    assert all(diff(t / 20.0) < 0 for t in range(1, 80))   # bounded model ahead until t = 4
    assert abs(diff(T_MAX_AB) + 0.79) < 0.005              # largest early gap: 790 users
    assert 2.0 < T_MAX_AB < 2.2
    assert all(abs(diff(t / 20.0)) < 0.8 for t in range(0, 81))


s.verify(check)
s.save()

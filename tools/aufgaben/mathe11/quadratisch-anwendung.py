#!/usr/bin/env python3
"""Textaufgaben Mathe 11, KW 48: Anwendungen quadratischer Modelle, Extremwerte ueber den Scheitel.
Deck: tools/pptx/build_quadratisch_anwendung_mathe11.py - Quiz: HTML/mathetest11-quadratisch-anwendung.html"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from textaufgaben import Sheet

s = Sheet("mathe11-quadratisch-anwendung", "Quadratische Modelle", kw=48)

# ---------------------------------------------------------------- AFB I ----
s.task("Das Gehege an der Hauswand", 1,
       r"Ein Hühnergehege soll rechteckig werden und an einer Seite an die Hauswand grenzen, dort wird kein Zaun gebraucht. Zur Verfügung stehen $60$ m Zaun. Die Breite senkrecht zur Wand heißt $x$.",
       [r"Drücke die Länge des Geheges durch $x$ aus und stelle die Flächenfunktion $A(x)$ auf.",
        r"Berechne den Scheitelpunkt von $A$.",
        r"Wie groß ist die größtmögliche Fläche, und welche Maße hat das Gehege dann?",
        r"Gib den im Sachzusammenhang sinnvollen Definitionsbereich an. Vergleiche mit einem Gehege ohne Hauswand, bei dem alle vier Seiten gezäunt werden müssen."],
       solution=[
        r"Gezäunt werden zwei Breiten und eine Länge: $2x + \ell = 60$, also $\ell = 60 - 2x$. Damit $A(x) = x(60 - 2x) = -2x^2 + 60x$.",
        r"$x_S = -\dfrac{60}{2 \cdot (-2)} = \dfrac{60}{4} = 15$. Fläche dort: $A(15) = -2 \cdot 225 + 900 = -450 + 900 = 450$. Scheitel $S(15 \mid 450)$.",
        r"Die größte Fläche ist $450\ \mathrm{m^2}$. Sie entsteht bei $x = 15$ m Breite und $\ell = 60 - 30 = 30$ m Länge. Probe: $15 \cdot 30 = 450\ \mathrm{m^2}$ und $2 \cdot 15 + 30 = 60$ m Zaun.",
        r"Sinnvoll ist $0 < x < 30$: bei $x = 0$ und $x = 30$ ist die Fläche null. Ohne Hauswand gilt $2x + 2\ell = 60$, also $\ell = 30 - x$ und $A(x) = -x^2 + 30x$ mit Scheitel bei $x = 15$ und $A = 225\ \mathrm{m^2}$ — ein Quadrat mit $15$ m Seite. Die Hauswand **verdoppelt** die mögliche Fläche."],
       falle=r"Bei drei gezäunten Seiten ist die Länge $60 - 2x$, nicht $\dfrac{60 - x}{2}$. Eine Skizze mit eingezeichneter Wand verhindert diesen Fehler zuverlässiger als jede Formel.")

# --------------------------------------------------------------- AFB II ----
s.task("Ab wann lohnt die Produktion?", 2,
       r"Ein Kleinbetrieb verkauft jedes Stück für $40$ €. Die Kosten für $x$ Stück betragen $K(x) = 0{,}5x^2 + 10x + 300$ Euro.",
       [r"Stelle die Gewinnfunktion $G(x) = E(x) - K(x)$ auf und deute die Zahl $300$.",
        r"Bei welcher Stückzahl ist der Gewinn am größten, und wie hoch ist er?",
        r"Bestimme die Gewinnschwelle und die Gewinngrenze. Ab welcher und bis zu welcher **ganzen** Stückzahl wird Gewinn gemacht?",
        r"Prüfe deine Antwort aus c), indem du den Gewinn bei $12$, $13$, $47$ und $48$ Stück berechnest."],
       solution=[
        r"Erlös: $E(x) = 40x$. Damit $G(x) = 40x - (0{,}5x^2 + 10x + 300) = -0{,}5x^2 + 30x - 300$. Die $300$ sind die **Fixkosten**: sie fallen auch dann an, wenn kein einziges Stück produziert wird, denn $K(0) = 300$. Entsprechend ist $G(0) = -300$, der Betrieb startet mit Verlust.",
        r"$x_S = -\dfrac{30}{2 \cdot (-0{,}5)} = \dfrac{30}{1} = 30$. Gewinn dort: $G(30) = -0{,}5 \cdot 900 + 900 - 300 = -450 + 600 = 150$. Das Maximum liegt bei **$30$ Stück mit $150$ € Gewinn**.",
        r"Nullstellen von $G$: $-0{,}5x^2 + 30x - 300 = 0$, mal $-2$ gibt $x^2 - 60x + 600 = 0$. pq-Formel: $x_{1,2} = 30 \pm \sqrt{900 - 600} = 30 \pm \sqrt{300} \approx 30 \pm 17{,}32$. Also $x \approx 12{,}68$ und $x \approx 47{,}32$. Gewinn wird von **$13$ bis $47$ Stück** gemacht.",
        r"$G(12) = -72 + 360 - 300 = -12$ €, also noch Verlust. $G(13) = -84{,}5 + 390 - 300 = 5{,}5$ €, also Gewinn. $G(47) = -1\,104{,}5 + 1\,410 - 300 = 5{,}5$ €, noch Gewinn. $G(48) = -1\,152 + 1\,440 - 300 = -12$ €, wieder Verlust. Die Randwerte bestätigen den Bereich — und sie sind paarweise gleich, weil die Parabel symmetrisch zu $x = 30$ liegt."],
       falle=r"Die Nullstellen sind nicht die Antwort auf „ab wann Gewinn“, solange nicht gerundet wurde — und hier wird **nach innen** gerundet: $12{,}68$ wird zu $13$, $47{,}32$ zu $47$. Wer wie gewohnt kaufmännisch rundet, macht bei $48$ Stück Verlust.")

# -------------------------------------------------------------- AFB III ----
s.task("Der Scheitel ist immer die Antwort?", 3,
       r"Ein Mitschüler fasst zusammen: **„Bei jeder Sachaufgabe mit einer Parabel rechne ich den Scheitel aus, dann habe ich die Lösung.“** Zur Prüfung dienen die Modelle aus dieser Woche.",
       [r"Nenne eine Frage, bei der er recht hat, und begründe warum.",
        r"Beim Wurfmodell $h(x) = -0{,}05(x - 10)^2 + 6{,}8$ wird nach der **Wurfweite** gefragt. Führt der Scheitel hier zum Ziel? Rechne nach.",
        r"Der Betrieb aus Aufgabe 2 kann höchstens $25$ Stück am Tag fertigen. Wo liegt jetzt der größte Gewinn?",
        r"Beurteile die Aussage und formuliere eine Reihenfolge, in der man bei solchen Aufgaben vorgeht."],
       solution=[
        r"Bei der Frage nach der **größten Fläche** des Geheges: dort wird ein Maximum gesucht, und bei einer nach unten geöffneten Parabel ist der Scheitel genau dieser höchste Punkt. Ebenso beim größten Gewinn in Aufgabe 2.",
        r"Nein. Der Scheitel $S(10 \mid 6{,}8)$ nennt die **größte Höhe**, nicht die Weite. Die Wurfweite ist die positive Nullstelle: $(x - 10)^2 = 136$, also $x = 10 + \sqrt{136} \approx 21{,}66$ m. Die Frage entscheidet, welche Stelle der Parabel gebraucht wird.",
        r"Der rechnerische Scheitel liegt bei $x = 30$ und damit **außerhalb** des möglichen Bereichs $0 \leq x \leq 25$. Auf diesem Bereich ist $G$ streng monoton steigend, das Maximum liegt also am rechten Rand: $G(25) = -312{,}5 + 750 - 300 = 137{,}5$ €. Der Betrieb macht mit voller Auslastung $137{,}50$ € Gewinn, nicht $150$ €.",
        r"Die Aussage ist zu pauschal. Sinnvolle Reihenfolge: erstens **die Frage lesen** — Maximum, Nullstelle oder ein bestimmter Wert? Zweitens den **Definitionsbereich** aus dem Sachtext bestimmen. Drittens den Scheitel berechnen und prüfen, ob er überhaupt im Definitionsbereich liegt. Viertens, falls nicht, die **Randwerte** vergleichen. Und zum Schluss die Probe im Sachzusammenhang: Sind negative Längen, Stückzahlen oder Zeiten entstanden?"],
       falle=r"Ein Scheitel außerhalb des Definitionsbereichs ist kein Ergebnis, sondern eine Warnung. Auf einem eingeschränkten Bereich liegt das Maximum dann immer am Rand — dort muss gerechnet werden.")


# ---------------------------------------------------------- numbers check ----
def check():
    import math
    import sympy as sp
    x = sp.symbols("x")
    A = lambda t: -2 * t ** 2 + 60 * t
    assert A(15) == 450 and 60 - 2 * 15 == 30 and 15 * 30 == 450 and 2 * 15 + 30 == 60
    assert sp.simplify(x * (60 - 2 * x) - (-2 * x ** 2 + 60 * x)) == 0
    assert -60 / (2 * -2) == 15 and A(0) == 0 and A(30) == 0
    A2 = lambda t: -t ** 2 + 30 * t
    assert A2(15) == 225 and 450 / 225 == 2
    G = lambda t: -0.5 * t ** 2 + 30 * t - 300
    K = lambda t: 0.5 * t ** 2 + 10 * t + 300
    assert all(abs(G(t) - (40 * t - K(t))) < 1e-9 for t in range(0, 60))
    assert K(0) == 300 and G(0) == -300
    assert -30 / (2 * -0.5) == 30 and G(30) == 150
    assert 900 - 600 == 300 and abs(math.sqrt(300) - 17.3205) < 1e-4
    lo, hi = 30 - math.sqrt(300), 30 + math.sqrt(300)
    assert abs(lo - 12.6795) < 1e-4 and abs(hi - 47.3205) < 1e-4
    assert math.ceil(lo) == 13 and math.floor(hi) == 47
    assert G(12) == -12 and G(13) == 5.5 and G(47) == 5.5 and G(48) == -12
    assert abs(G(25) - 137.5) < 1e-9 and G(25) < G(30)
    assert all(G(t) < G(t + 1) for t in range(0, 25))
    w = lambda t: -0.05 * (t - 10) ** 2 + 6.8
    assert abs(w(10) - 6.8) < 1e-12 and abs(6.8 / 0.05 - 136) < 1e-9
    assert abs(10 + math.sqrt(136) - 21.6619) < 1e-4


s.verify(check)
s.save()

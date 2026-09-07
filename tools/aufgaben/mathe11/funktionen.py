#!/usr/bin/env python3
"""Textaufgaben Mathe 11, KW 40: Funktionsbegriff, Definitions- und Wertebereich, Nullstellen.
Deck: tools/pptx/build_funktionen_mathe11.py - Quiz: HTML/mathetest11-funktionen.html"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from textaufgaben import Sheet

s = Sheet("mathe11-funktionen", "Der Funktionsbegriff", kw=40)

# ---------------------------------------------------------------- AFB I ----
s.task("Der Tank läuft leer", 1,
       r"Ein Wassertank enthält $600$ Liter. Ein Ventil lässt gleichmäßig $40$ Liter je Minute ab. Die Füllmenge nach $t$ Minuten beschreibt $f(t) = 600 - 40t$.",
       [r"Berechne $f(0)$, $f(5)$ und $f(10)$ und sage in Worten, was jeder Wert bedeutet.",
        r"Bestimme die Nullstelle von $f$ und deute sie im Sachzusammenhang.",
        r"Gib den Definitionsbereich und den Wertebereich an, die im Sachzusammenhang sinnvoll sind.",
        r"Ist $f$ monoton steigend oder fallend? Nach wie vielen Minuten sind noch $150$ Liter im Tank?"],
       solution=[
        r"$f(0) = 600$: zu Beginn sind $600$ Liter im Tank. $f(5) = 600 - 200 = 400$: nach fünf Minuten noch $400$ Liter. $f(10) = 600 - 400 = 200$: nach zehn Minuten noch $200$ Liter.",
        r"$600 - 40t = 0$ ergibt $40t = 600$, also $t = 15$. Nach **$15$ Minuten** ist der Tank leer — die Nullstelle ist die Leerlaufzeit.",
        r"Sinnvoll ist $D = \{t \mid 0 \leq t \leq 15\}$: vorher gibt es keine Messung, nachher ist der Tank leer und die Formel würde negative Mengen liefern. Der Wertebereich ist $W = \{y \mid 0 \leq y \leq 600\}$.",
        r"Der Vorfaktor $-40$ ist negativ, also ist $f$ streng monoton **fallend**. Aus $600 - 40t = 150$ folgt $40t = 450$, also $t = 11{,}25$ Minuten, das sind $11$ Minuten und $15$ Sekunden. Probe: $600 - 40 \cdot 11{,}25 = 600 - 450 = 150$."],
       falle=r"Der rechnerische Definitionsbereich der Formel ist ganz $\mathbb{R}$, der sachliche nur $0 \leq t \leq 15$. Für $t = 20$ liefert die Formel $-200$ Liter — rechnerisch richtig, sachlich Unsinn.")

# --------------------------------------------------------------- AFB II ----
s.task("Die Tunneleinfahrt", 2,
       r"Ein Tunnel hat einen halbkreisförmigen Querschnitt: die Fahrbahn ist $10$ m breit, in der Mitte ist der Tunnel $5$ m hoch. Legt man den Nullpunkt in die Fahrbahnmitte, so beschreibt $h(x) = \sqrt{25 - x^2}$ die Höhe des Bogens an der Stelle $x$.",
       [r"Bestimme den Definitionsbereich von $h$ rechnerisch und erkläre, was er im Tunnel bedeutet.",
        r"Berechne $h(3)$ und $h(4)$. Bestimme die Nullstellen von $h$ und deute sie.",
        r"Zeige, dass $h(-x) = h(x)$ gilt, und benenne die Symmetrie. Warum ist der **ganze** Kreis keine Funktion, der Halbkreis aber schon?",
        r"Ein Lastwagen ist $2{,}60$ m breit und $3{,}80$ m hoch. Passt er mittig durch den Tunnel? Rechne mit der ungünstigsten Stelle."],
       solution=[
        r"Unter der Wurzel darf nichts Negatives stehen: $25 - x^2 \geq 0$, also $x^2 \leq 25$ und damit $-5 \leq x \leq 5$. Das ist genau die $10$ m breite Fahrbahn, gemessen von der Mitte aus je $5$ m nach links und rechts.",
        r"$h(3) = \sqrt{25 - 9} = \sqrt{16} = 4$ m und $h(4) = \sqrt{25 - 16} = \sqrt{9} = 3$ m. Nullstellen: $\sqrt{25 - x^2} = 0$ ergibt $x^2 = 25$, also $x = -5$ und $x = 5$ — dort trifft der Bogen auf die Fahrbahn, das sind die beiden Tunnelwände.",
        r"$h(-x) = \sqrt{25 - (-x)^2} = \sqrt{25 - x^2} = h(x)$, weil das Quadrat das Vorzeichen frisst. Der Graph ist also **achsensymmetrisch zur $y$-Achse**. Beim ganzen Kreis gehören zu jedem $x$ zwischen $-5$ und $5$ zwei Höhen, $+\sqrt{25 - x^2}$ und $-\sqrt{25 - x^2}$ — eine Senkrechte trifft ihn zweimal, das ist keine Funktion. Die Wurzel liefert nur den oberen Bogen und damit genau einen Wert.",
        r"Der Lastwagen steht mittig, seine Ecken sind $1{,}30$ m von der Mitte entfernt. Dort ist der Tunnel am niedrigsten für das Fahrzeug: $h(1{,}30) = \sqrt{25 - 1{,}69} = \sqrt{23{,}31} \approx 4{,}83$ m. Das ist mehr als $3{,}80$ m, der Lastwagen **passt** mit gut einem Meter Luft."],
       falle=r"Nicht die Tunnelmitte entscheidet, sondern die **Ecke** des Fahrzeugs. Wer $h(0) = 5$ m mit der Fahrzeughöhe vergleicht, rechnet an der falschen Stelle — bei einem breiteren Fahrzeug wird das gefährlich.")

# -------------------------------------------------------------- AFB III ----
s.task("Zu jedem Wert genau eine Stelle?", 3,
       r"Ein Mitschüler fasst zusammen: **„Eine Funktion ist eindeutig. Also gehört auch zu jedem $y$ genau ein $x$.“**",
       [r"Prüfe die Behauptung an $f(x) = x^2$, indem du $f(2)$ und $f(-2)$ berechnest.",
        r"Ist $f$ trotzdem eine Funktion? Begründe mit der Definition und mit dem Senkrechten-Test.",
        r"Übertrage auf einen Tagesverlauf: Ein Thermometer misst um $9$ Uhr $12\ ^\circ$C, um $14$ Uhr $19\ ^\circ$C und um $19$ Uhr wieder $12\ ^\circ$C. Welche Zuordnung ist eine Funktion, welche nicht?",
        r"Beurteile die Behauptung und formuliere, was Eindeutigkeit bei einer Funktion genau verlangt."],
       solution=[
        r"$f(2) = 4$ und $f(-2) = (-2)^2 = 4$. Zum Wert $y = 4$ gehören also **zwei** Stellen, $x = 2$ und $x = -2$. Die Behauptung ist damit widerlegt.",
        r"Ja, $f$ ist eine Funktion: zu jedem $x$ gehört genau ein $y$ — $2$ hat nur den Wert $4$, $-2$ hat nur den Wert $4$. Verboten ist allein, dass **eine** Stelle zwei Werte bekommt. Der Senkrechten-Test prüft genau das: jede senkrechte Gerade trifft die Normalparabel höchstens einmal.",
        r"„Jeder Uhrzeit ihre Temperatur“ ist eine Funktion: zu jedem Zeitpunkt gibt es genau eine Temperatur. „Jeder Temperatur ihre Uhrzeit“ ist **keine** Funktion: zu $12\ ^\circ$C gehören $9$ Uhr **und** $19$ Uhr. Dass zwei Stellen denselben Wert haben, ist erlaubt und im Alltag der Normalfall.",
        r"Die Behauptung ist falsch. Eindeutigkeit verlangt nur eine Richtung: **jedem $x$ genau ein $y$**. Die umgekehrte Eindeutigkeit ist eine zusätzliche Eigenschaft, die viele Funktionen nicht haben — sie entscheidet später darüber, ob sich eine Funktion umkehren lässt."],
       falle=r"„Eindeutig“ heißt nicht „umkehrbar“. Wer beides verwechselt, hält $f(x) = x^2$ für keine Funktion und verliert bei $x^2 = 49$ später die Lösung $x = -7$.")


# ---------------------------------------------------------- numbers check ----
def check():
    import math
    from fractions import Fraction as F
    f = lambda t: 600 - 40 * t
    assert f(0) == 600 and f(5) == 400 and f(10) == 200 and f(15) == 0
    assert F(600, 40) == 15 and F(450, 40) == F(45, 4) and f(F(45, 4)) == 150
    assert F(45, 4) == 11.25 and 0.25 * 60 == 15
    assert f(20) == -200
    h = lambda x: math.sqrt(25 - x * x)
    assert h(0) == 5.0 and h(3) == 4.0 and h(4) == 3.0 and h(5) == 0.0
    assert abs(h(-3) - h(3)) < 1e-15
    assert abs(25 - 1.3 ** 2 - 23.31) < 1e-12
    assert abs(h(1.3) - 4.8280) < 1e-4 and h(1.3) > 3.80 and h(1.3) - 3.80 > 1.0
    assert 2.60 / 2 == 1.30
    assert 2 ** 2 == 4 and (-2) ** 2 == 4


s.verify(check)
s.save()

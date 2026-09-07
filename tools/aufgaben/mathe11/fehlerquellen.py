#!/usr/bin/env python3
"""Textaufgaben Mathe 11, KW 20: Typische Fehlerquellen erkennen und korrigieren.
Deck: tools/pptx/build_fehlerquellen_mathe11.py - Quiz: HTML/mathetest11-fehlerquellen.html"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from textaufgaben import Sheet

s = Sheet("mathe11-fehlerquellen", "Fehler finden und korrigieren", kw=20)

# ---------------------------------------------------------------- AFB I ----
s.task("Die Renovierung", 1,
       r"Jonas plant die Renovierung seines Zimmers und rechnet vier Dinge aus. In jeder Rechnung steckt **genau ein** typischer Fehler. Finde ihn, benenne die verletzte Regel und rechne richtig.",
       [r"Das Zimmer ist quadratisch mit $5{,}5$ m Seitenlänge. Jonas rechnet im Kopf: $(5 + 0{,}5)^2 = 5^2 + 0{,}5^2 = 25{,}25\ \mathrm{m^2}$.",
        r"Werkzeug und Grundierung kosten $450$ €, dazu $3$ € Farbe je Quadratmeter Wand. Die Kosten je Quadratmeter bei $x\ \mathrm{m^2}$ sind $\dfrac{450 + 3x}{x}$. Jonas kürzt: $\dfrac{450 + 3x}{x} = 450 + 3 = 453$ € je Quadratmeter.",
        r"Das Budget ist $900$ €. Der Maler verlangt für jeden Quadratmeter über $50\ \mathrm{m^2}$ einen Zuschlag von $3$ €, das Restbudget ist $R = 900 - 3(x - 50)$. Für $x = 80$ rechnet Jonas: $R = 900 - 3x - 150 = 900 - 240 - 150 = 510$ €.",
        r"Der Schrank kostet $800$ €. Der Händler gibt erst $25\,\%$ Rabatt und schlägt eine Woche später $25\,\%$ auf. Jonas: „Dann kostet er wieder $800$ €.“"],
       solution=[
        r"Fehler: Die binomische Formel wurde ohne Mittelglied benutzt, $(a + b)^2$ ist nicht $a^2 + b^2$. Richtig: $(5 + 0{,}5)^2 = 25 + 2 \cdot 5 \cdot 0{,}5 + 0{,}25 = 25 + 5 + 0{,}25 = 30{,}25\ \mathrm{m^2}$. Probe: $5{,}5 \cdot 5{,}5 = 30{,}25$. Es fehlten genau $5\ \mathrm{m^2}$.",
        r"Fehler: Aus einer Summe wurde gekürzt. Nur Faktoren dürfen gekürzt werden, $450$ ist aber ein Summand. Richtig: $\dfrac{450 + 3x}{x} = \dfrac{450}{x} + 3$. Für $x = 30$: $15 + 3 = 18$ € je Quadratmeter. Probe: $\dfrac{450 + 90}{30} = \dfrac{540}{30} = 18$. Die $453$ € hätten schon bei der Größenordnung auffallen müssen.",
        r"Fehler: Das Minus vor der Klammer gilt für **beide** Summanden, $-3 \cdot (-50) = +150$. Richtig: $R = 900 - 3x + 150 = 900 - 240 + 150 = 810$ €. Probe ohne Ausmultiplizieren: $900 - 3 \cdot (80 - 50) = 900 - 90 = 810$.",
        r"Fehler: Die beiden Prozente beziehen sich auf verschiedene Grundwerte. Richtig: $800 \cdot 0{,}75 = 600$ €, dann $600 \cdot 1{,}25 = 750$ €. Der Schrank kostet $50$ € weniger als vorher, denn $0{,}75 \cdot 1{,}25 = 0{,}9375$, also $6{,}25\,\%$ unter dem alten Preis."],
       falle=r"Drei der vier Fehler sind derselbe Fehler: eine Regel, die für Produkte gilt, wurde auf eine Summe angewendet. Wer das Muster kennt, findet solche Stellen in Sekunden mit einer Zahlenprobe.")

# --------------------------------------------------------------- AFB II ----
s.task("Der Ball beim Sportfest", 2,
       r"Beim Sportfest wird ein Ball senkrecht nach oben geworfen. Seine Höhe über dem Abwurfpunkt in Metern nach $t$ Sekunden ist $h(t) = 20t - 5t^2$.",
       [r"Wann ist der Ball wieder auf Abwurfhöhe? Ein Schüler teilt $20t - 5t^2 = 0$ durch $t$ und erhält $t = 4$. Was hat er dabei verloren?",
        r"Wann ist der Ball $15$ m hoch? Löse die Gleichung und deute beide Lösungen.",
        r"Erreicht der Ball eine Höhe von $25$ m? Begründe rechnerisch.",
        r"Eine Schülerin berechnet $h(5) = -25$ und sagt: „Nach $5$ Sekunden ist der Ball $25$ m unter dem Abwurfpunkt.“ Beurteile."],
       solution=[
        r"Ausklammern statt teilen: $t(20 - 5t) = 0$, also $t = 0$ oder $20 - 5t = 0$, das heißt $t = 4$. Beim Teilen durch $t$ geht die Lösung $t = 0$ verloren, der Abwurf selbst. Der Ball ist beim Abwurf und nach $4$ s auf Abwurfhöhe. Probe: $h(4) = 80 - 80 = 0$.",
        r"$20t - 5t^2 = 15$, durch $-5$ geteilt und geordnet: $t^2 - 4t + 3 = 0$. Vieta: Summe $4$, Produkt $3$, also $t = 1$ und $t = 3$. Probe: $h(1) = 20 - 5 = 15$ und $h(3) = 60 - 45 = 15$. Beide Lösungen sind sinnvoll: Der Ball passiert die $15$ m einmal beim Aufstieg und einmal beim Fallen.",
        r"$20t - 5t^2 = 25$ ergibt $t^2 - 4t + 5 = 0$. Quadratisch ergänzt: $(t - 2)^2 + 1 = 0$, und ein Quadrat plus $1$ ist nie null. **Keine** Lösung, der Ball erreicht die $25$ m nicht. Das passt zum Scheitel: Bei $t = 2$ ist $h(2) = 40 - 20 = 20$ m die größte Höhe.",
        r"Rechnerisch stimmt $h(5) = 100 - 125 = -25$. Aber das Modell gilt nur, solange der Ball fliegt, also für $0 \le t \le 4$. Nach der Landung liegt er am Boden, die Formel beschreibt nichts mehr. Der Definitionsbereich gehört zur Lösung: Ein Wert außerhalb wird begründet verworfen, nicht gedeutet. Nur wenn der Ball von einem hohen Balkon geworfen würde, könnte $-25$ m etwas bedeuten."],
       falle=r"Falle in a): Teilen durch die Unbekannte. Das ist nur erlaubt, wenn sie nicht null sein kann, und hier ist $t = 0$ gerade eine Lösung.")

# -------------------------------------------------------------- AFB III ----
s.task("Die Abkürzung über den Sportplatz", 3,
       r"Der Sportplatz ist ein Rechteck von $30$ m mal $40$ m. Ein Mitschüler behauptet: **„Die Abkürzung über die Diagonale bringt nichts, denn $\sqrt{a^2 + b^2} = a + b$.“**",
       [r"Prüfe die Behauptung für den Sportplatz. Wie viele Meter spart die Diagonale gegenüber dem Weg über die Ecke, und wie viel Prozent sind das?",
        r"Für welche Seitenlängen $a, b \ge 0$ gilt $\sqrt{a^2 + b^2} = a + b$ tatsächlich? Quadriere und vergleiche.",
        r"Begründe allgemein, dass für $a, b > 0$ die Diagonale immer kürzer ist als der Weg über die Ecke.",
        r"Bei welchem Seitenverhältnis spart die Diagonale prozentual am meisten? Untersuche das Quadrat ($a = b$), den Sportplatz und ein langes Rechteck mit $a = 10$ m, $b = 100$ m, und begründe die Tendenz."],
       solution=[
        r"Diagonale: $\sqrt{30^2 + 40^2} = \sqrt{900 + 1600} = \sqrt{2500} = 50$ m. Über die Ecke: $30 + 40 = 70$ m. Die Behauptung ist falsch, $50 \neq 70$. Ersparnis $20$ m, das sind $\dfrac{20}{70} \approx 0{,}286$, also rund $29\,\%$ des Umwegs.",
        r"Beide Seiten sind nicht negativ, Quadrieren ist also erlaubt: $a^2 + b^2 = (a + b)^2 = a^2 + 2ab + b^2$, damit $2ab = 0$, also $a = 0$ oder $b = 0$. Die Gleichung stimmt nur, wenn das Rechteck zu einer Strecke zusammenfällt. Dann gibt es keine Abkürzung, weil es keine Ecke gibt. Probe mit $a = 0$: $\sqrt{b^2} = b$ für $b \ge 0$.",
        r"Für $a, b > 0$ ist $2ab > 0$, also $(a + b)^2 = a^2 + 2ab + b^2 > a^2 + b^2$. Wurzelziehen erhält die Reihenfolge bei positiven Zahlen: $a + b > \sqrt{a^2 + b^2}$. Der Weg über die Ecke ist immer länger, das ist die Dreiecksungleichung: Eine Seite ist kürzer als die beiden anderen zusammen.",
        r"Quadrat mit Seite $a$: Diagonale $a\sqrt{2}$, Ersparnis $\dfrac{2a - a\sqrt{2}}{2a} = \dfrac{2 - \sqrt{2}}{2} \approx 0{,}293$, also $29{,}3\,\%$. Sportplatz: $28{,}6\,\%$. Langes Rechteck: Diagonale $\sqrt{100 + 10\,000} = \sqrt{10\,100} \approx 100{,}5$ m, Umweg $110$ m, Ersparnis $9{,}5$ m, das sind $8{,}6\,\%$. Je länglicher das Rechteck, desto mehr verläuft die Diagonale ohnehin entlang der langen Seite, und desto weniger spart sie. Am meisten bringt die Abkürzung beim Quadrat, weniger als $29{,}3\,\%$ sind es nie mehr."],
       falle=r"Falle in b): Nach dem Quadrieren nicht zurückprüfen. Hier ist es harmlos, weil beide Seiten nicht negativ sind. Bei $\sqrt{x} = -2$ dagegen erzeugt Quadrieren eine Lösung, die es nicht gibt.")


# ---------------------------------------------------------- numbers check ----
def check():
    import math
    from fractions import Fraction as F
    # AFB I
    assert abs(5.5 ** 2 - 30.25) < 1e-12 and 25 + 2 * 5 * 0.5 + 0.25 == 30.25 and 25 + 0.25 == 25.25 and 30.25 - 25.25 == 5
    assert F(450, 30) + 3 == 18 and F(450 + 3 * 30, 30) == 18 and 450 + 90 == 540 and 450 + 3 == 453
    assert 900 - 3 * (80 - 50) == 810 and 900 - 3 * 80 + 150 == 810 and 900 - 240 - 150 == 510 and -3 * -50 == 150 and 3 * 80 == 240
    assert 800 * 0.75 == 600 and 600 * 1.25 == 750 and 800 - 750 == 50 and abs(0.75 * 1.25 - 0.9375) < 1e-12 and (1 - 0.9375) * 100 == 6.25
    # AFB II: h(t) = 20t - 5t^2
    h = lambda t: 20 * t - 5 * t ** 2
    assert h(0) == 0 and h(4) == 0 and h(1) == 15 and h(3) == 15 and h(2) == 20 and h(5) == -25
    assert 1 + 3 == 4 and 1 * 3 == 3 and 80 - 80 == 0 and 60 - 45 == 15 and 40 - 20 == 20 and 100 - 125 == -25
    assert (2 - 2) ** 2 + 1 == 1 and 4 * 4 - 4 * 5 < 0  # t^2 - 4t + 5: Diskriminante negativ
    # AFB III
    assert math.sqrt(30 ** 2 + 40 ** 2) == 50 and 900 + 1600 == 2500 and 30 + 40 == 70 and 70 - 50 == 20
    assert abs(20 / 70 - 0.286) < 0.001
    assert abs((2 - math.sqrt(2)) / 2 - 0.293) < 0.001
    d = math.sqrt(10 ** 2 + 100 ** 2)
    assert 100 + 10000 == 10100 and abs(d - 100.5) < 0.01 and abs((110 - d) - 9.5) < 0.01 and abs((110 - d) / 110 - 0.086) < 0.001
    assert (2 - math.sqrt(2)) / 2 > 20 / 70 > (110 - d) / 110
    assert math.sqrt(0 ** 2 + 7 ** 2) == 0 + 7


s.verify(check)
s.save()

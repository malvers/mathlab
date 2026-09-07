#!/usr/bin/env python3
"""Textaufgaben Mathe 11, KW 46: quadratische Funktionen, Scheitelpunktform, beschleunigte Bewegung.
Quadratische Gleichungen werden hier noch inhaltlich geloest - die pq-Formel kommt erst in KW 47.
Deck: tools/pptx/build_quadratisch_mathe11.py - Quiz: HTML/mathetest11-quadratisch.html"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from textaufgaben import Sheet

s = Sheet("mathe11-quadratisch", "Quadratische Funktionen", kw=46)

# ---------------------------------------------------------------- AFB I ----
s.task("Die Wasserfontäne", 1,
       r"Eine Fontäne im Park wird durch $h(x) = -0{,}5(x - 4)^2 + 8$ beschrieben. Dabei ist $x$ die waagerechte Entfernung von der Düse in Metern und $h$ die Höhe des Wasserstrahls in Metern.",
       [r"Lies den Scheitelpunkt ab und sage, was er im Park bedeutet. In welche Richtung ist die Parabel geöffnet?",
        r"Berechne $h(0)$ und erkläre, was das über die Lage der Düse aussagt.",
        r"Wo trifft das Wasser wieder auf den Boden? Löse die Gleichung inhaltlich, ohne Ausmultiplizieren.",
        r"Rechne die Scheitelpunktform in die Normalform $h(x) = ax^2 + bx + c$ um und prüfe dein Ergebnis an der Stelle $x = 4$."],
       solution=[
        r"Aus $(x - 4)^2$ folgt $d = 4$, das Vorzeichen dreht sich um. Mit $e = 8$ ist der Scheitel $S(4 \mid 8)$: der Strahl erreicht in $4$ m Entfernung seinen **höchsten Punkt** von $8$ m. Der Faktor $-0{,}5$ ist negativ, die Parabel ist also nach unten geöffnet, und der Scheitel ist der höchste Punkt.",
        r"$h(0) = -0{,}5 \cdot (0 - 4)^2 + 8 = -0{,}5 \cdot 16 + 8 = -8 + 8 = 0$. Die Düse sitzt also genau auf Bodenhöhe.",
        r"$-0{,}5(x - 4)^2 + 8 = 0$ ergibt $0{,}5(x - 4)^2 = 8$ und damit $(x - 4)^2 = 16$. Vorgelesen: welche Zahl ergibt quadriert $16$? Das sind $4$ und $-4$, also $x - 4 = 4$ oder $x - 4 = -4$ und damit $x = 8$ oder $x = 0$. Das Wasser landet in **$8$ m** Entfernung; $x = 0$ ist die Düse selbst.",
        r"$(x - 4)^2 = x^2 - 8x + 16$, also $h(x) = -0{,}5(x^2 - 8x + 16) + 8 = -0{,}5x^2 + 4x - 8 + 8 = -0{,}5x^2 + 4x$. Probe: $h(4) = -0{,}5 \cdot 16 + 16 = -8 + 16 = 8$ — das ist der Scheitelwert aus a)."],
       falle=r"In $(x - 4)^2$ steht der Scheitel bei $x = +4$, nicht bei $-4$. Und beim Ausmultiplizieren muss $-0{,}5$ **alle drei** Summanden treffen, auch die $16$.")

# --------------------------------------------------------------- AFB II ----
s.task("Der weite Wurf", 2,
       r"Ein Ball wird aus $1{,}8$ m Höhe geworfen. Seine Flugbahn beschreibt $h(x) = -0{,}05x^2 + x + 1{,}8$, mit $x$ als Wurfweite in Metern.",
       [r"Deute die Zahl $1{,}8$ und das Vorzeichen von $-0{,}05$ im Sachzusammenhang.",
        r"Berechne den Scheitelpunkt mit $x_S = -\dfrac{b}{2a}$ und gib die Scheitelpunktform an.",
        r"In welcher Entfernung ist der Ball genau $5$ m hoch? Nutze die Scheitelpunktform.",
        r"Wie weit fliegt der Ball, bis er auf dem Boden aufkommt? Runde auf zwei Nachkommastellen."],
       solution=[
        r"$h(0) = 1{,}8$: die $1{,}8$ ist die **Abwurfhöhe**, der Ball ist bei $x = 0$ noch in der Hand. Der negative Faktor $-0{,}05$ öffnet die Parabel nach unten — der Ball steigt erst und fällt dann, wie es sein muss.",
        r"$x_S = -\dfrac{1}{2 \cdot (-0{,}05)} = -\dfrac{1}{-0{,}1} = 10$. Höhe dort: $h(10) = -0{,}05 \cdot 100 + 10 + 1{,}8 = -5 + 11{,}8 = 6{,}8$. Scheitel $S(10 \mid 6{,}8)$, Scheitelpunktform $h(x) = -0{,}05(x - 10)^2 + 6{,}8$.",
        r"$-0{,}05(x - 10)^2 + 6{,}8 = 5$ ergibt $0{,}05(x - 10)^2 = 1{,}8$ und $(x - 10)^2 = 36$. Also $x - 10 = 6$ oder $x - 10 = -6$, damit $x = 16$ m oder $x = 4$ m. Der Ball ist **zweimal** auf $5$ m Höhe: beim Steigen nach $4$ m und beim Fallen nach $16$ m.",
        r"$-0{,}05(x - 10)^2 + 6{,}8 = 0$ ergibt $(x - 10)^2 = 136$, also $x = 10 + \sqrt{136} \approx 10 + 11{,}66 = 21{,}66$ m. Die zweite rechnerische Lösung $x \approx -1{,}66$ liegt hinter dem Werfer und entfällt."],
       falle=r"Der Scheitel liegt bei $10$ m, die Landung aber nicht bei $20$ m. Symmetrisch wäre das nur bei Abwurf vom Boden — die Abwurfhöhe $1{,}8$ m verschiebt die Landung nach hinten.")

# -------------------------------------------------------------- AFB III ----
s.task("Doppelt so schnell, doppelter Bremsweg?", 3,
       r"Ein Mitschüler sagt: **„Wenn ich doppelt so schnell fahre, brauche ich doppelt so weit zum Anhalten.“** In der Fahrschule gelten die Faustformeln: Bremsweg $s_B = \left(\dfrac{v}{10}\right)^2$ und Reaktionsweg $s_R = \dfrac{v}{10} \cdot 3$, jeweils in Metern bei $v$ in $\dfrac{\mathrm{km}}{\mathrm{h}}$.",
       [r"Berechne den Bremsweg bei $50$ und bei $100\ \dfrac{\mathrm{km}}{\mathrm{h}}$ und vergleiche.",
        r"Berechne beide Reaktionswege und die gesamten Anhaltewege. Um welchen Faktor wächst der Anhalteweg?",
        r"Begründe mit der Bewegungsgleichung $s = \dfrac{a}{2}t^2$, warum der Bremsweg quadratisch von der Geschwindigkeit abhängt, der Reaktionsweg aber nicht.",
        r"Beurteile die Behauptung. Was folgt daraus für das Fahren in der Stadt?"],
       solution=[
        r"Bei $50$: $s_B = 5^2 = 25$ m. Bei $100$: $s_B = 10^2 = 100$ m. Der Bremsweg wird **viermal** so lang, nicht doppelt so lang.",
        r"Reaktionswege: $5 \cdot 3 = 15$ m und $10 \cdot 3 = 30$ m — dieser Teil verdoppelt sich tatsächlich. Anhaltewege: $25 + 15 = 40$ m und $100 + 30 = 130$ m. Der Anhalteweg wächst um den Faktor $\dfrac{130}{40} = 3{,}25$.",
        r"Während der Reaktionszeit fährt das Auto mit **konstanter** Geschwindigkeit, der Weg ist $v$ mal Zeit — das ist linear in $v$. Beim Bremsen wirkt eine konstante Verzögerung, und in $s = \dfrac{a}{2}t^2$ steckt die Zeit im Quadrat. Da die Bremszeit selbst proportional zu $v$ ist, wächst der Bremsweg mit $v^2$.",
        r"Die Behauptung ist falsch: nur der Reaktionsweg verdoppelt sich, der Bremsweg vervierfacht sich, der Anhalteweg wächst insgesamt auf mehr als das Dreifache. In der Stadt heißt das: der Unterschied zwischen $30$ und $50\ \dfrac{\mathrm{km}}{\mathrm{h}}$ ist kein Drittel mehr Weg, sondern aus $18$ m werden $40$ m — an genau dieser Stelle steht meistens jemand auf der Straße."],
       falle=r"Der Bremsweg allein ist nicht der Anhalteweg. Wer die Reaktionszeit vergisst, unterschätzt bei $50\ \dfrac{\mathrm{km}}{\mathrm{h}}$ die Strecke um $15$ m, also um mehr als drei Autolängen.")


# ---------------------------------------------------------- numbers check ----
def check():
    import math
    from fractions import Fraction as F
    h = lambda x: F(-1, 2) * (x - 4) ** 2 + 8
    assert h(4) == 8 and h(0) == 0 and h(8) == 0 and (4 - 4) ** 2 == 0
    # normal form
    hn = lambda x: F(-1, 2) * x ** 2 + 4 * x
    assert all(h(x) == hn(x) for x in range(-3, 12)) and hn(4) == 8
    # throw with launch height
    w = lambda x: -0.05 * x ** 2 + x + 1.8
    assert abs(w(0) - 1.8) < 1e-12 and abs(-1 / (2 * -0.05) - 10) < 1e-12
    assert abs(w(10) - 6.8) < 1e-12
    ws = lambda x: -0.05 * (x - 10) ** 2 + 6.8
    assert all(abs(w(x) - ws(x)) < 1e-9 for x in range(0, 22))
    assert abs(w(4) - 5) < 1e-9 and abs(w(16) - 5) < 1e-9 and (4 - 10) ** 2 == 36
    assert abs(6.8 / 0.05 - 136) < 1e-9 and abs(math.sqrt(136) - 11.6619) < 1e-4
    x_land = 10 + math.sqrt(136)
    assert abs(x_land - 21.6619) < 1e-4 and abs(w(x_land)) < 1e-9 and 10 - math.sqrt(136) < 0
    # stopping distance
    sB = lambda v: (v / 10) ** 2
    sR = lambda v: (v / 10) * 3
    assert sB(50) == 25 and sB(100) == 100 and sB(100) / sB(50) == 4
    assert sR(50) == 15 and sR(100) == 30 and sR(100) / sR(50) == 2
    assert sB(50) + sR(50) == 40 and sB(100) + sR(100) == 130
    assert abs(130 / 40 - 3.25) < 1e-12
    assert sB(30) + sR(30) == 18 and sB(50) + sR(50) == 40


s.verify(check)
s.save()

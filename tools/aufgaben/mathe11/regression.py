#!/usr/bin/env python3
"""Textaufgaben Mathe 11, KW 52: Regression mit digitalen Hilfsmitteln, Modellwahl, Modellkritik.
Deck: tools/pptx/build_regression_mathe11.py - Quiz: HTML/mathetest11-regression.html"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from textaufgaben import Sheet

s = Sheet("mathe11-regression", "Regression und Modellkritik", kw=52)

# ---------------------------------------------------------------- AFB I ----
s.task("Dünger und Ertrag", 1,
       r"Auf fünf gleich großen Versuchsfeldern wird unterschiedlich viel Dünger ausgebracht. Gemessen wurde der Ertrag in Dezitonnen: bei $1$ kg $2{,}1$; bei $2$ kg $3{,}9$; bei $3$ kg $6{,}2$; bei $4$ kg $7{,}8$; bei $5$ kg $10{,}1$. Der Rechner liefert als Regressionsgerade $y = 1{,}99x + 0{,}05$.",
       [r"Bilde die Differenzen der Ertragswerte. Warum ist ein lineares Modell hier vertretbar?",
        r"Deute den Anstieg $1{,}99$ und den Achsenabschnitt $0{,}05$ im Sachzusammenhang.",
        r"Welchen Ertrag sagt das Modell für $8$ kg Dünger voraus?",
        r"Berechne für $x = 3$ und $x = 4$ die Abweichung zwischen Messwert und Modellwert. Warum trifft die Gerade keinen einzigen Punkt genau?"],
       solution=[
        r"Differenzen: $3{,}9 - 2{,}1 = 1{,}8$; $6{,}2 - 3{,}9 = 2{,}3$; $7{,}8 - 6{,}2 = 1{,}6$; $10{,}1 - 7{,}8 = 2{,}3$. Sie sind nicht gleich, schwanken aber nur um etwa $2$ herum, ohne erkennbaren Trend nach oben oder unten. Bei Messwerten ist das der Normalfall — ein lineares Modell ist vertretbar.",
        r"Der Anstieg $1{,}99$ heißt: jedes zusätzliche Kilogramm Dünger bringt rund $2$ Dezitonnen mehr Ertrag. Der Achsenabschnitt $0{,}05$ ist der rechnerische Ertrag ohne Dünger — praktisch null. Sachlich ist er kaum zu deuten, weil bei $x = 0$ gar nicht gemessen wurde.",
        r"$y = 1{,}99 \cdot 8 + 0{,}05 = 15{,}92 + 0{,}05 = 15{,}97$ Dezitonnen. Das ist eine **Extrapolation** weit außerhalb der Messwerte und deshalb mit Vorsicht zu genießen.",
        r"Modellwerte: $y(3) = 6{,}02$ gegenüber gemessenen $6{,}2$, Abweichung $+0{,}18$. $y(4) = 8{,}01$ gegenüber $7{,}8$, Abweichung $-0{,}21$. Die Gerade trifft keinen Punkt genau, weil sie nicht durch die Punkte gelegt wird, sondern **zwischen** sie: sie soll den Trend beschreiben, nicht jede einzelne Messung. Böden, Wetter und Messfehler streuen, und die Abweichungen heben sich in der Summe fast auf."],
       falle=r"Regression ist keine Interpolation. Wer erwartet, dass die Gerade durch die Messpunkte geht, hält jede Abweichung für einen Rechenfehler — dabei ist genau diese Streuung die Information über die Datenqualität.")

# --------------------------------------------------------------- AFB II ----
s.task("Welches Modell passt zum Bestand?", 2,
       r"Der Bestand einer Wildpopulation wurde fünf Jahre lang gezählt: im Jahr $0$ waren es $100$ Tiere, dann $121$, $146$, $177$ und im Jahr $4$ genau $214$.",
       [r"Wende den Prüfgriff an: bilde Differenzen und Quotienten. Welches Modell passt?",
        r"Stelle die Modellgleichung mit dem gerundeten Faktor auf und prüfe sie an den Jahren $2$ und $4$.",
        r"Sage den Bestand für das Jahr $10$ voraus. Vergleiche mit einer Geraden durch die Punkte des Jahres $0$ und des Jahres $4$.",
        r"Beurteile, wie weit man dieses Modell in die Zukunft fortschreiben darf."],
       solution=[
        r"Differenzen: $21$, $25$, $31$, $37$ — sie wachsen deutlich, also nicht linear. Quotienten: $\dfrac{121}{100} = 1{,}21$; $\dfrac{146}{121} \approx 1{,}207$; $\dfrac{177}{146} \approx 1{,}212$; $\dfrac{214}{177} \approx 1{,}209$. Die Quotienten sind nahezu konstant — es passt ein **exponentielles** Modell mit $q \approx 1{,}21$, also rund $21\,\%$ Zuwachs im Jahr.",
        r"$N(t) = 100 \cdot 1{,}21^t$. Probe: $N(2) = 100 \cdot 1{,}4641 \approx 146{,}4$ gegenüber gezählten $146$. $N(4) = 100 \cdot 1{,}21^4 \approx 214{,}4$ gegenüber gezählten $214$. Die Abweichungen liegen unter einem Tier.",
        r"$N(10) = 100 \cdot 1{,}21^{10} \approx 100 \cdot 6{,}7275 \approx 673$ Tiere. Die Gerade durch $(0 \mid 100)$ und $(4 \mid 214)$ hat den Anstieg $\dfrac{214 - 100}{4} = 28{,}5$ und lautet $y = 28{,}5t + 100$; sie liefert für $t = 10$ nur $385$ Tiere. Die beiden Modelle unterscheiden sich um rund $288$ Tiere, obwohl sie im Messbereich fast gleich gut passen.",
        r"Nur sehr begrenzt. Innerhalb der gemessenen fünf Jahre ist das Modell gut belegt, für Jahr $6$ oder $7$ noch vertretbar. Auf Dauer kann kein Bestand exponentiell wachsen: Futter, Fläche und Krankheiten begrenzen ihn, das Wachstum flacht ab. Ein exponentielles Modell beschreibt immer nur die **Anfangsphase**, und je weiter man extrapoliert, desto stärker wirkt sich die Wahl des Modelltyps aus."],
       falle=r"Im Messbereich sehen beide Modelle brauchbar aus, weil sie sich dort kaum unterscheiden. Der Modelltyp entscheidet erst bei der **Prognose** — und dann um Hunderte von Tieren.")

# -------------------------------------------------------------- AFB III ----
s.task("Das Bestimmtheitsmaß sagt es doch", 3,
       r"Ein Mitschüler sagt: **„Mein Rechner hat $R^2 = 0{,}98$ ausgegeben. Damit ist das Modell richtig, und ich kann beliebig weit vorhersagen.“** Als Beispiel nennt er eine Sonnenblume, die in den ersten Wochen gemessen $5$ cm am Tag wächst.",
       [r"Rechne aus, wie groß die Sonnenblume nach zwei Jahren wäre, wenn man sein lineares Modell fortschreibt. Beurteile das Ergebnis.",
        r"Was misst $R^2$ überhaupt, und was misst es **nicht**?",
        r"In einer Region wurden über Jahre die Zahl der Storchenpaare und die Zahl der Geburten erfasst; beide Reihen passen gut zueinander. Was folgt daraus, und was folgt nicht?",
        r"Beurteile die Aussage und formuliere drei Fragen, die man nach jeder Regression stellen sollte."],
       solution=[
        r"Zwei Jahre sind $730$ Tage: $5 \cdot 730 = 3\,650$ cm, also $36{,}5$ m. Eine Sonnenblume wird knapp $3$ m hoch. Das Modell beschreibt die Wachstumsphase gut, wird aber sinnlos, sobald die Pflanze ausgewachsen ist — und es kennt weder Blüte noch Winter.",
        r"$R^2$ misst, welcher Anteil der Streuung in den Daten durch das Modell erklärt wird, also wie gut die Kurve **zu den vorhandenen Messwerten** passt. Es misst nicht, ob der Modelltyp der richtige ist, ob die Daten sauber erhoben wurden, ob es einen ursächlichen Zusammenhang gibt oder ob das Modell außerhalb des Messbereichs noch gilt.",
        r"Es folgt, dass beide Größen **gemeinsam schwanken**, also miteinander zusammenhängen. Es folgt **nicht**, dass Störche Kinder bringen. Beide Reihen können von einer dritten Ursache abhängen, etwa vom Wandel ländlicher Räume, oder der Gleichlauf ist Zufall. Zusammenhang in den Zahlen ist kein Nachweis von Ursache und Wirkung.",
        r"Die Aussage ist in beiden Teilen falsch. Drei Fragen nach jeder Regression: Erstens — habe ich die Daten **gezeichnet** und sieht die Punktwolke wirklich nach diesem Modelltyp aus? Zweitens — liegt meine Vorhersage noch im **Bereich der Messwerte**, und wenn nicht, ist die Fortschreibung sachlich plausibel? Drittens — gibt es einen **inhaltlichen Grund** für genau diesen Zusammenhang, oder rechne ich nur Zahlen gegeneinander?"],
       falle=r"Ein hohes $R^2$ lässt sich immer erreichen, indem man ein Modell mit genügend Parametern wählt. Es passt dann perfekt zu den Messwerten und sagt über neue Daten nichts aus.")


# ---------------------------------------------------------- numbers check ----
def check():
    from fractions import Fraction as F
    xs = [1, 2, 3, 4, 5]
    ys = [F(21, 10), F(39, 10), F(62, 10), F(78, 10), F(101, 10)]
    n = len(xs)
    xm = F(sum(xs), n)
    ym = sum(ys) / n
    sxy = sum((F(x) - xm) * (y - ym) for x, y in zip(xs, ys))
    sxx = sum((F(x) - xm) ** 2 for x in xs)
    m, b = sxy / sxx, ym - (sxy / sxx) * xm
    assert xm == 3 and ym == F(602, 100)
    assert m == F(199, 100) and b == F(5, 100)          # the calculator's y = 1.99x + 0.05
    y = lambda t: m * t + b
    assert y(8) == F(1597, 100)
    assert [float(ys[i + 1] - ys[i]) for i in range(4)] == [1.8, 2.3, 1.6, 2.3]
    assert y(3) == F(602, 100) and ys[2] - y(3) == F(18, 100)
    assert y(4) == F(801, 100) and ys[3] - y(4) == F(-21, 100)
    assert abs(sum(ys[i] - y(xs[i]) for i in range(n))) < F(1, 1000)
    # population
    N = [100, 121, 146, 177, 214]
    assert [N[i + 1] - N[i] for i in range(4)] == [21, 25, 31, 37]
    qs = [N[i + 1] / N[i] for i in range(4)]
    assert abs(qs[0] - 1.21) < 1e-9 and all(abs(q - 1.21) < 0.005 for q in qs)
    mod = lambda t: 100 * 1.21 ** t
    assert abs(mod(2) - 146.41) < 1e-6 and abs(mod(4) - 214.3588) < 1e-3
    assert abs(mod(2) - 146) < 1 and abs(mod(4) - 214) < 1
    assert abs(1.21 ** 10 - 6.7275) < 1e-3 and abs(mod(10) - 672.75) < 0.1
    lin = lambda t: 28.5 * t + 100
    assert (214 - 100) / 4 == 28.5 and lin(4) == 214 and lin(10) == 385
    assert abs(mod(10) - lin(10) - 287.75) < 0.1
    # sunflower
    assert 2 * 365 == 730 and 5 * 730 == 3650 and 3650 / 100 == 36.5


s.verify(check)
s.save()

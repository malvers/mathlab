#!/usr/bin/env python3
"""Textaufgaben Mathe 11, KW 19: Wiederholung vor Klassenarbeit 3 - LGS, Matrizen, Stochastik.
Deck: tools/pptx/build_ka3_mathe11.py - Quiz: HTML/mathetest11-ka3.html"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from textaufgaben import Sheet

s = Sheet("mathe11-ka3", "Wiederholung: Gleichungssysteme und Stochastik", kw=19)

# ---------------------------------------------------------------- AFB I ----
s.task("Der Kinoabend", 1,
       r"Familie Berger zahlt an der Kinokasse für $2$ Karten und $3$ Portionen Popcorn $33$ €. Die Nachbarn zahlen für $4$ Karten und $1$ Portion Popcorn $41$ €. Der Kartenpreis heißt $k$, der Popcornpreis $p$.",
       [r"Stelle das lineare Gleichungssystem auf.",
        r"Schreibe die Koeffizientenmatrix und die erweiterte Koeffizientenmatrix auf und gib ihr Format an.",
        r"Löse das System mit dem Additionsverfahren.",
        r"Mache die Probe in **beiden** Gleichungen und berechne, was $3$ Karten mit $2$ Portionen Popcorn kosten."],
       solution=[
        r"Gleichung I: $2k + 3p = 33$. Gleichung II: $4k + p = 41$.",
        r"Koeffizientenmatrix $\begin{pmatrix} 2 & 3 \\ 4 & 1 \end{pmatrix}$, Format $2 \times 2$ (zwei Gleichungen, zwei Unbekannte). Erweitert um die rechte Seite: $\begin{pmatrix} 2 & 3 & 33 \\ 4 & 1 & 41 \end{pmatrix}$, Format $2 \times 3$.",
        r"II mal $(-3)$: $-12k - 3p = -123$. Dazu I addieren: $-10k = -90$, also $k = 9$. In II: $36 + p = 41$, also $p = 5$. Eine Karte kostet $9$ €, das Popcorn $5$ €.",
        r"I: $2 \cdot 9 + 3 \cdot 5 = 18 + 15 = 33$, stimmt. II: $4 \cdot 9 + 5 = 41$, stimmt. Erst jetzt ist die Lösung sicher. Dann: $3 \cdot 9 + 2 \cdot 5 = 27 + 10 = 37$ €."],
       falle=r"Falle in c): beim Addieren der Zeilen das Vorzeichen nur beim $k$ umdrehen, nicht beim $p$ und nicht bei der rechten Seite. Der Faktor $-3$ gilt für die ganze Zeile.")

# --------------------------------------------------------------- AFB II ----
s.task("Zwei Paketdienste", 2,
       r"Ein Onlineshop verschickt $70\,\%$ seiner Pakete mit Dienst A, den Rest mit Dienst B. Bei A kommen $90\,\%$ der Pakete pünktlich an, bei B nur $80\,\%$.",
       [r"Zeichne das Baumdiagramm und berechne die Wahrscheinlichkeiten aller vier Pfade. Prüfe ihre Summe.",
        r"Wie groß ist die Wahrscheinlichkeit, dass ein zufällig gewähltes Paket pünktlich ankommt?",
        r"Ein Kunde beschwert sich über ein verspätetes Paket. Mit welcher Wahrscheinlichkeit hat es Dienst A befördert? Deute das Ergebnis, obwohl A der zuverlässigere Dienst ist.",
        r"Sind „Dienst A“ und „pünktlich“ unabhängige Ereignisse? Was würde Unabhängigkeit hier inhaltlich bedeuten?"],
       solution=[
        r"Erste Stufe A mit $0{,}7$ und B mit $0{,}3$, zweite Stufe pünktlich oder verspätet. Pfadregel: $P(\text{A} \cap \text{pünktlich}) = 0{,}7 \cdot 0{,}9 = 0{,}63$, $P(\text{A} \cap \text{verspätet}) = 0{,}7 \cdot 0{,}1 = 0{,}07$, $P(\text{B} \cap \text{pünktlich}) = 0{,}3 \cdot 0{,}8 = 0{,}24$, $P(\text{B} \cap \text{verspätet}) = 0{,}3 \cdot 0{,}2 = 0{,}06$. Summe $0{,}63 + 0{,}07 + 0{,}24 + 0{,}06 = 1$.",
        r"Beide Pünktlich-Pfade addieren: $P(\text{pünktlich}) = 0{,}63 + 0{,}24 = 0{,}87$, also $87\,\%$. Entsprechend sind $13\,\%$ der Pakete verspätet.",
        r"Bedingung „verspätet“: Teilmenge durch Bedingung, $P(\text{A} \mid \text{verspätet}) = \dfrac{0{,}07}{0{,}13} = \dfrac{7}{13} \approx 0{,}54$. Gut jeder zweite Verspätungsfall geht auf A zurück, obwohl A pro Paket seltener zu spät ist ($10\,\%$ gegen $20\,\%$). Der Grund ist die Menge: A befördert mehr als doppelt so viele Pakete, dadurch kommen absolut mehr Verspätungen zusammen ($0{,}07$ gegen $0{,}06$).",
        r"Unabhängig hieße $P(\text{A} \cap \text{pünktlich}) = P(\text{A}) \cdot P(\text{pünktlich})$. Rechts: $0{,}7 \cdot 0{,}87 = 0{,}609$, links $0{,}63$. Ungleich, also **abhängig**. Inhaltlich hieße Unabhängigkeit: Die Pünktlichkeit hängt nicht vom Dienst ab, beide hätten dieselbe Quote von $87\,\%$. Genau das ist hier nicht der Fall."],
       falle=r"Falle in c): $P(\text{verspätet} \mid \text{A}) = 0{,}1$ als Antwort geben. Gefragt ist die Umkehrung, der Dienst unter der Bedingung „verspätet“, mit dem Nenner $0{,}13$.")

# -------------------------------------------------------------- AFB III ----
s.task("Drei Tage am Saftstand", 3,
       r"Am Saftstand werden $10$ Liter Mischsaft aus Apfelsaft ($x$ Liter, $2$ € je Liter) und Orangensaft ($y$ Liter, $3$ € je Liter) angesetzt. Ein Mitschüler behauptet: **„Zwei Gleichungen mit zwei Unbekannten haben immer genau eine Lösung.“**",
       [r"Montag: Die $10$ Liter kosten $24$ €. Stelle das Gleichungssystem auf und löse es.",
        r"Dienstag: Orangensaft ist im Angebot und kostet ebenfalls $2$ € je Liter, die $10$ Liter kosten $20$ €. Was passiert beim Lösen? Deute das Ergebnis am Stand.",
        r"Mittwoch: Wieder beide Sorten zu $2$ € je Liter, aber auf der Rechnung stehen $24$ €. Löse und deute.",
        r"Beurteile die Behauptung. Beschreibe die drei Fälle auch geometrisch, wenn man jede Gleichung als Gerade zeichnet."],
       solution=[
        r"I: $x + y = 10$, II: $2x + 3y = 24$. I mal $(-2)$ zu II addieren: $y = 4$, dann $x = 6$. Probe: $6 + 4 = 10$ und $12 + 12 = 24$. Also $6$ Liter Apfel- und $4$ Liter Orangensaft, **genau eine** Lösung.",
        r"I: $x + y = 10$, II: $2x + 2y = 20$. I mal $(-2)$ zu II addieren: $0 = 0$. Die zweite Gleichung sagt nichts Neues, sie ist das Doppelte der ersten. **Unendlich viele** Lösungen: Jede Mischung mit $x + y = 10$ kostet $20$ €, etwa $(5 \mid 5)$ oder $(8 \mid 2)$. Sinnvoll sind nur $0 \le x \le 10$, denn negative Liter gibt es nicht. Aus dem Preis lässt sich das Mischverhältnis nicht mehr ablesen, weil beide Sorten gleich viel kosten.",
        r"I: $x + y = 10$, II: $2x + 2y = 24$. Dieselbe Umformung ergibt $0 = 4$, ein Widerspruch: **keine** Lösung. Deutung: Wenn jeder Liter $2$ € kostet, kosten $10$ Liter genau $20$ €. Die Rechnung über $24$ € kann so nicht stimmen, es steckt ein Tippfehler oder ein weiterer Posten darin.",
        r"Die Behauptung ist falsch, es gibt drei Fälle: genau eine Lösung (Montag), unendlich viele (Dienstag), keine (Mittwoch). Geometrisch: Zwei Geraden schneiden sich in einem Punkt, oder sie sind identisch, oder sie sind parallel und verschieden. Dienstag und Mittwoch haben dieselbe Steigung $-1$ (gleiches Verhältnis der Koeffizienten), nur der Achsenabschnitt entscheidet zwischen „identisch“ und „parallel“. Der Regelfall ist der Schnittpunkt, die beiden anderen treten auf, sobald eine Gleichung ein Vielfaches der anderen ist."],
       falle=r"Falle in b): Die Zeile $0 = 0$ als „$x = 0$ und $y = 0$“ lesen. Sie bedeutet nur, dass eine Gleichung wegfällt, und $(0 \mid 0)$ erfüllt $x + y = 10$ gerade nicht.")


# ---------------------------------------------------------- numbers check ----
def check():
    from fractions import Fraction as F
    # AFB I: 2k + 3p = 33, 4k + p = 41
    k, p = 9, 5
    assert 2 * k + 3 * p == 33 and 4 * k + p == 41
    assert -3 * 4 == -12 and -3 * 1 == -3 and -3 * 41 == -123 and 2 - 12 == -10 and 33 - 123 == -90
    assert -90 / -10 == 9 and 4 * 9 == 36 and 41 - 36 == 5 and 18 + 15 == 33
    assert 3 * k + 2 * p == 37 and 27 + 10 == 37
    # AFB II: Paketdienste
    a, b = F(7, 10), F(3, 10)
    ap, av, bp, bv = a * F(9, 10), a * F(1, 10), b * F(8, 10), b * F(2, 10)
    assert (ap, av, bp, bv) == (F(63, 100), F(7, 100), F(24, 100), F(6, 100))
    assert ap + av + bp + bv == 1 and ap + bp == F(87, 100) and av + bv == F(13, 100)
    assert av / (av + bv) == F(7, 13) and abs(float(F(7, 13)) - 0.54) < 0.005 and av > bv
    assert a * F(87, 100) == F(609, 1000) and F(609, 1000) != ap
    # AFB III: Saftstand
    assert 6 + 4 == 10 and 2 * 6 + 3 * 4 == 24
    assert 2 * 5 + 2 * 5 == 20 and 2 * 8 + 2 * 2 == 20 and 5 + 5 == 10 and 8 + 2 == 10
    assert 2 * 10 == 20 and 24 - 20 == 4 and 0 + 0 != 10


s.verify(check)
s.save()

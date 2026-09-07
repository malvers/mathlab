#!/usr/bin/env python3
"""Textaufgaben Mathe 11, KW 17: Simulation von Zufallsversuchen, Gesetz der grossen Zahlen.
Deck: tools/pptx/build_simulation_mathe11.py - Quiz: HTML/mathetest11-simulation.html"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from textaufgaben import Sheet

s = Sheet("mathe11-simulation", "Simulieren statt rechnen", kw=17)

# ---------------------------------------------------------------- AFB I ----
s.task("Der Würfel in drei Versuchsreihen", 1,
       r"Ein Würfel wurde in drei Reihen geworfen und die Sechsen gezählt: bei $60$ Würfen $14$ Sechsen, bei $600$ Würfen $112$ und bei $6\,000$ Würfen $1\,005$.",
       [r"Berechne für jede Reihe die relative Häufigkeit der Sechs auf vier Nachkommastellen.",
        r"Vergleiche mit der theoretischen Wahrscheinlichkeit. Wie groß ist der Abstand jeweils?",
        r"Berechne für jede Reihe die **erwartete** Anzahl Sechsen und die absolute Abweichung davon. Was fällt im Vergleich zu b) auf?",
        r"Formuliere, was das Gesetz der großen Zahlen aussagt — und was es nicht aussagt."],
       solution=[
        r"$\dfrac{14}{60} \approx 0{,}2333$; $\dfrac{112}{600} \approx 0{,}1867$; $\dfrac{1\,005}{6\,000} = 0{,}1675$.",
        r"Theoretisch ist $P(6) = \dfrac{1}{6} \approx 0{,}1667$. Abstände: $0{,}0667$, dann $0{,}0200$, dann $0{,}0008$. Mit wachsender Versuchszahl wird die relative Häufigkeit der Wahrscheinlichkeit immer ähnlicher.",
        r"Erwartet werden $10$, $100$ und $1\,000$ Sechsen. Absolute Abweichungen: $4$, $12$ und $5$. Sie werden **nicht** kleiner, sondern schwanken. Nur die **relative** Abweichung geht zurück — das ist der entscheidende Unterschied.",
        r"Das Gesetz der großen Zahlen sagt: bei wachsender Versuchszahl nähert sich die **relative Häufigkeit** der Wahrscheinlichkeit an. Es sagt **nicht**, dass die absolute Anzahl der Sechsen dem Erwartungswert näher kommt, und es sagt erst recht nichts über einen einzelnen Wurf. Der Würfel hat kein Gedächtnis."],
       falle=r"Aus $1\,005$ statt $1\,000$ Sechsen folgt nicht, dass der Würfel besser geworden ist. Bei $6\,000$ Würfen sind Abweichungen von einigen Dutzend völlig normal — die Rechnung muss immer relativ erfolgen.")

# --------------------------------------------------------------- AFB II ----
s.task("Das Glücksrad simulieren", 2,
       r"Ein Glücksrad hat $8$ gleich große Felder, $3$ davon sind Gewinnfelder. Statt zu rechnen, soll das Spiel in einer Tabellenkalkulation simuliert werden.",
       [r"Berechne die theoretische Gewinnwahrscheinlichkeit.",
        r"Beschreibe, wie du einen einzelnen Dreh mit Zufallszahlen nachbildest und wie du daraus einen Treffer erkennst.",
        r"Die Simulation ergibt bei $1\,000$ Durchläufen $361$ Gewinne. Berechne die relative Häufigkeit und den Abstand zum theoretischen Wert.",
        r"Die Genauigkeit einer Simulation wächst etwa mit $\dfrac{1}{\sqrt{n}}$. Wie viele Durchläufe braucht man ungefähr, um auf zwei Nachkommastellen genau zu sein?"],
       solution=[
        r"$P(\text{Gewinn}) = \dfrac{3}{8} = 0{,}375$.",
        r"Man erzeugt je Durchlauf eine ganze Zufallszahl zwischen $1$ und $8$, in einer Tabellenkalkulation etwa mit `ZUFALLSBEREICH(1;8)`. Alle acht Zahlen sind gleich wahrscheinlich, genau wie die acht Felder. Als Treffer zählt man die Zahlen $1$, $2$ und $3$, also alle Werte kleiner oder gleich $3$. Das Ergebnis wird als $1$ oder $0$ notiert und am Ende aufsummiert.",
        r"$\dfrac{361}{1\,000} = 0{,}361$. Der Abstand zum theoretischen Wert beträgt $0{,}375 - 0{,}361 = 0{,}014$, also $1{,}4$ Prozentpunkte.",
        r"Bei $n = 1\,000$ ist $\dfrac{1}{\sqrt{1\,000}} \approx 0{,}032$ — die beobachtete Abweichung von $0{,}014$ passt gut in diese Größenordnung. Für eine Genauigkeit von $0{,}01$ braucht man $\dfrac{1}{\sqrt{n}} \approx 0{,}01$, also $\sqrt{n} \approx 100$ und damit $n \approx 10\,000$ Durchläufe. Zehnfache Genauigkeit kostet die **hundertfache** Zahl an Versuchen."],
       falle=r"Eine Simulation liefert nie den exakten Wert, sondern eine Schätzung mit Streuung. Wer aus $0{,}361$ schließt, das Rad sei manipuliert, verwechselt Zufallsschwankung mit einem Befund.")

# -------------------------------------------------------------- AFB III ----
s.task("Jetzt muss Zahl aufholen", 3,
       r"Beim Münzwurf kam in $100$ Würfen $60$-mal Kopf. Ein Mitschüler sagt: **„Das Gesetz der großen Zahlen sorgt für Ausgleich. Jetzt muss Zahl aufholen, damit am Ende wieder die Hälfte herauskommt.“**",
       [r"Berechne die relative Häufigkeit von Kopf nach den $100$ Würfen und den Überschuss an Kopf-Würfen.",
        r"Angenommen, in den nächsten $900$ Würfen fällt genau $450$-mal Kopf. Berechne relative Häufigkeit und Überschuss nach allen $1\,000$ Würfen.",
        r"Setze die Rechnung mit weiteren $9\,000$ ausgeglichenen Würfen fort. Was passiert mit den beiden Größen?",
        r"Beurteile die Aussage und benenne den Denkfehler."],
       solution=[
        r"Relative Häufigkeit: $\dfrac{60}{100} = 0{,}60$. Der Überschuss beträgt $60 - 40 = 20$ Würfe zugunsten von Kopf.",
        r"Insgesamt $60 + 450 = 510$ Kopf bei $1\,000$ Würfen: $\dfrac{510}{1\,000} = 0{,}51$. Der Überschuss ist $510 - 490 = 20$ — er hat sich **überhaupt nicht** verändert.",
        r"Nach weiteren $9\,000$ ausgeglichenen Würfen: $510 + 4\,500 = 5\,010$ Kopf bei $10\,000$ Würfen, also $\dfrac{5\,010}{10\,000} = 0{,}501$. Der Überschuss bleibt bei $20$. Die relative Häufigkeit nähert sich $0{,}5$ immer weiter an, obwohl der absolute Vorsprung gar nicht abgebaut wird.",
        r"Die Aussage ist falsch. Der Ausgleich entsteht nicht dadurch, dass Zahl aufholt, sondern dadurch, dass der feste Überschuss von $20$ neben immer größeren Gesamtzahlen **immer weniger ins Gewicht fällt**. Die Münze hat kein Gedächtnis: jede Wahrscheinlichkeit bleibt $\dfrac{1}{2}$, unabhängig davon, was vorher fiel. Der Denkfehler heißt Spielerfehlschluss — er unterstellt dem Zufall ein Bestreben, frühere Abweichungen auszugleichen."],
       falle=r"„Ausgleich“ bedeutet Verdünnung, nicht Rückzahlung. Wer auf eine Aufholjagd wettet, setzt auf eine Eigenschaft, die der Zufall nicht hat.")


# ---------------------------------------------------------- numbers check ----
def check():
    import math
    from fractions import Fraction as F
    reihen = [(60, 14), (600, 112), (6000, 1005)]
    rel = [F(k, n) for n, k in reihen]
    assert [round(float(r), 4) for r in rel] == [0.2333, 0.1867, 0.1675]
    p = F(1, 6)
    assert abs(float(p) - 0.1667) < 1e-4
    abst = [round(abs(float(r - p)), 4) for r in rel]
    assert abst == [0.0667, 0.02, 0.0008] and abst[0] > abst[1] > abst[2]
    erwartet = [n * p for n, _ in reihen]
    assert [float(e) for e in erwartet] == [10.0, 100.0, 1000.0]
    absw = [abs(k - float(e)) for (n, k), e in zip(reihen, erwartet)]
    assert absw == [4.0, 12.0, 5.0] and not (absw[0] > absw[1] > absw[2])
    # wheel of fortune
    assert F(3, 8) == F(375, 1000)
    assert abs(float(F(361, 1000)) - 0.361) < 1e-12 and abs(0.375 - 0.361 - 0.014) < 1e-9
    assert abs(1 / math.sqrt(1000) - 0.0316) < 1e-4 and 0.014 < 0.0316
    assert abs(1 / math.sqrt(10000) - 0.01) < 1e-12 and 100 ** 2 == 10000
    # gambler's fallacy
    assert F(60, 100) == F(3, 5) and 60 - 40 == 20
    assert 60 + 450 == 510 and F(510, 1000) == F(51, 100) and 510 - 490 == 20
    assert 510 + 4500 == 5010 and F(5010, 10000) == F(501, 1000) and 5010 - 4990 == 20
    assert float(F(51, 100)) == 0.51 and float(F(501, 1000)) == 0.501


s.verify(check)
s.save()

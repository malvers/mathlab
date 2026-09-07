#!/usr/bin/env python3
"""Textaufgaben Mathe 11, KW 36: lineare Gleichungen, Formeln umstellen, Klammern - ohne Hilfsmittel.
Deck: tools/pptx/build_gleichungen_mathe11.py - Quiz: HTML/mathetest11-gleichungen.html"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from textaufgaben import Sheet

s = Sheet("mathe11-w4-gleichungen", "Gleichungen ohne Hilfsmittel", kw=36)

# ---------------------------------------------------------------- AFB I ----
s.task("Zwei Handytarife", 1,
       r"Ein Anbieter hat zwei Tarife. **Tarif A**: $8$ € Grundgebühr im Monat und $0{,}12$ € je Gesprächsminute. **Tarif B**: $20$ € Grundgebühr und $0{,}04$ € je Minute. Gerechnet wird ohne Taschenrechner.",
       [r"Was kostet ein Monat mit $100$ Gesprächsminuten in beiden Tarifen?",
        r"Bei welcher Minutenzahl kosten beide Tarife gleich viel? Stelle eine Gleichung auf und löse sie.",
        r"Welcher Tarif ist bei $200$ Minuten günstiger, und um wie viel?",
        r"Stelle die Kostenformel $K = G + p \cdot m$ nach der Minutenzahl $m$ um und berechne damit, wie lange man in Tarif B für $32$ € telefonieren kann."],
       solution=[
        r"Tarif A: $8 + 0{,}12 \cdot 100 = 8 + 12 = 20$ €. Tarif B: $20 + 0{,}04 \cdot 100 = 20 + 4 = 24$ €. Bei $100$ Minuten ist A um $4$ € günstiger.",
        r"Gleichung: $8 + 0{,}12m = 20 + 0{,}04m$. Sortieren: $-0{,}04m$ auf beiden Seiten gibt $8 + 0{,}08m = 20$, dann $-8$ gibt $0{,}08m = 12$. Normieren: $m = \dfrac{12}{0{,}08} = 150$ Minuten. Probe: $8 + 0{,}12 \cdot 150 = 26$ und $20 + 0{,}04 \cdot 150 = 26$ — beide $26$ €.",
        r"Tarif A: $8 + 0{,}12 \cdot 200 = 32$ €. Tarif B: $20 + 0{,}04 \cdot 200 = 28$ €. Jetzt ist **B** günstiger, und zwar um $4$ €. Ab $150$ Minuten dreht sich das Bild.",
        r"$K = G + p \cdot m$, also $K - G = p \cdot m$ und damit $m = \dfrac{K - G}{p}$. Für Tarif B mit $K = 32$ €: $m = \dfrac{32 - 20}{0{,}04} = \dfrac{12}{0{,}04} = 300$ Minuten. Probe: $20 + 0{,}04 \cdot 300 = 32$ €."],
       falle=r"Die kleinere Grundgebühr macht einen Tarif nicht dauerhaft billiger. Wer nur die $8$ € gegen die $20$ € hält, übersieht den Minutenpreis — und der entscheidet ab $150$ Minuten.")

# --------------------------------------------------------------- AFB II ----
s.task("Farbe anmischen", 2,
       r"Ein Malerbetrieb mischt Wandfarbe aus zwei Bestandteilen: **Basisfarbe** für $8$ € je Liter und **Pigmentfarbe** für $20$ € je Liter. Gemischt werden $25$ Liter, und der Mischpreis soll genau $11{,}60$ € je Liter betragen. Die Menge Pigmentfarbe heißt $x$.",
       [r"Stelle eine Gleichung für $x$ auf. Denke daran, wie viele Liter Basisfarbe dann übrig bleiben.",
        r"Löse die Gleichung. Wie viele Liter jeder Sorte kommen in die Mischung?",
        r"Stelle die allgemeine Gleichung $p \cdot x + b \cdot (G - x) = G \cdot m$ nach $x$ um.",
        r"Ein Kunde möchte eine kräftigere Farbe zu $14$ € je Liter, wieder $25$ Liter. Berechne die Pigmentmenge mit deiner Formel."],
       solution=[
        r"Bei $x$ Litern Pigmentfarbe bleiben $25 - x$ Liter Basisfarbe. Die Gesamtkosten sind $20x + 8(25 - x)$, und die Mischung soll $25 \cdot 11{,}60 = 290$ € kosten. Gleichung: $20x + 8(25 - x) = 290$.",
        r"Klammer zuerst: $20x + 200 - 8x = 290$, also $12x + 200 = 290$ und $12x = 90$. Damit $x = 7{,}5$ Liter Pigmentfarbe und $25 - 7{,}5 = 17{,}5$ Liter Basisfarbe. Probe: $7{,}5 \cdot 20 = 150$ €, $17{,}5 \cdot 8 = 140$ €, zusammen $290$ € — geteilt durch $25$ Liter sind das $11{,}60$ € je Liter.",
        r"Klammer auflösen: $px + bG - bx = Gm$. Die $x$-Terme zusammenfassen: $(p - b)x = Gm - bG = G(m - b)$. Also $x = \dfrac{G(m - b)}{p - b}$. Kontrolle mit den Zahlen von oben: $\dfrac{25(11{,}60 - 8)}{20 - 8} = \dfrac{25 \cdot 3{,}6}{12} = \dfrac{90}{12} = 7{,}5$.",
        r"$x = \dfrac{25(14 - 8)}{20 - 8} = \dfrac{25 \cdot 6}{12} = \dfrac{150}{12} = 12{,}5$ Liter Pigmentfarbe, dazu $12{,}5$ Liter Basisfarbe. Probe: $12{,}5 \cdot 20 + 12{,}5 \cdot 8 = 250 + 100 = 350$ €, geteilt durch $25$ sind $14$ € je Liter."],
        falle=r"Beim Auflösen von $8(25 - x)$ muss die $8$ **beide** Summanden treffen: $200 - 8x$. Wer nur $200 - x$ schreibt, bekommt $19x = 90$ und eine krumme Zahl, die keine Probe besteht.")

# -------------------------------------------------------------- AFB III ----
s.task("Immer genau eine Lösung?", 3,
       r"Eine Mitschülerin behauptet: **„Eine Gleichung mit einem $x$ hat immer genau eine Lösung — man muss nur richtig umformen.“**",
       [r"Prüfe die Behauptung an den drei Gleichungen $4x - 7 = 2x + 1$, $4x - 7 = 4x + 1$ und $4x - 7 = 4x - 7$.",
        r"Ein Mitschüler löst $x^2 = 5x$, indem er beide Seiten durch $x$ teilt, und erhält $x = 5$. Prüfe durch Einsetzen, ob damit alle Lösungen gefunden sind, und erkläre den Fehler.",
        r"Untersuche die allgemeine Gleichung $ax + b = cx + d$. Wovon hängt es ab, wie viele Lösungen es gibt?",
        r"Beurteile die Behauptung und formuliere eine Regel, wann man durch einen Term teilen darf."],
       solution=[
        r"Erste Gleichung: $2x = 8$, also $x = 4$ — genau eine Lösung. Probe: beide Seiten ergeben $9$. Zweite: $-7 = 1$ ist eine falsche Aussage, es gibt **keine** Lösung. Dritte: beide Seiten sind gleich, jede Zahl passt — **unendlich viele** Lösungen. Die Behauptung ist also falsch.",
        r"$x = 0$ eingesetzt: links $0^2 = 0$, rechts $5 \cdot 0 = 0$. Die Aussage ist wahr, $x = 0$ ist also ebenfalls Lösung und beim Teilen verloren gegangen. Richtig: $x^2 - 5x = 0$, ausklammern zu $x(x - 5) = 0$, ein Produkt ist null, wenn ein Faktor null ist — also $x = 0$ oder $x = 5$.",
        r"Sortieren gibt $(a - c)x = d - b$. Ist $a \neq c$, darf man durch $a - c$ teilen: genau eine Lösung $x = \dfrac{d - b}{a - c}$. Ist $a = c$, steht links $0$: bei $b = d$ ist $0 = 0$ immer wahr (alle Zahlen), bei $b \neq d$ ist die Aussage nie wahr (keine Lösung).",
        r"Die Behauptung ist falsch: es gibt genau drei Möglichkeiten — eine Lösung, keine Lösung oder unendlich viele. Regel: Teilen ist nur dann eine Äquivalenzumformung, wenn der Teiler **sicher nicht null** ist. Eine Zahl wie $4$ ist unbedenklich, ein Term wie $x$ oder $x - 3$ nicht — dort wird ausgeklammert statt geteilt."],
       falle=r"Teilen durch einen Term **verliert** Lösungen, Multiplizieren mit einem Term kann falsche **hinzufügen**. In beiden Fällen rettet nur die Probe.")


# ---------------------------------------------------------- numbers check ----
def check():
    from fractions import Fraction as F
    A = lambda m: 8 + F(12, 100) * m
    B = lambda m: 20 + F(4, 100) * m
    assert A(100) == 20 and B(100) == 24 and 24 - 20 == 4
    assert F(12, 1) / F(8, 100) == 150 and A(150) == 26 and B(150) == 26
    assert A(200) == 32 and B(200) == 28 and 32 - 28 == 4
    assert (F(32) - 20) / F(4, 100) == 300 and B(300) == 32
    # mixing: 20x + 8(25-x) = 290
    assert 25 * F(1160, 100) == 290
    x = F(90, 12)
    assert x == F(15, 2) and 20 * x + 8 * (25 - x) == 290 and 25 - x == F(35, 2)
    assert x * 20 == 150 and (25 - x) * 8 == 140 and F(290, 25) == F(1160, 100)
    form = lambda G, m, b, p: F(G) * (m - b) / (p - b)
    assert form(25, F(1160, 100), 8, 20) == F(15, 2)
    x2 = form(25, F(14), 8, 20)
    assert x2 == F(25, 2) and x2 * 20 + (25 - x2) * 8 == 350 and F(350, 25) == 14
    # equations with one / none / infinitely many solutions
    assert (4 * 4 - 7) == 9 and (2 * 4 + 1) == 9
    assert 0 ** 2 == 5 * 0 and 5 ** 2 == 5 * 5
    # the wrong split 200 - x would give 19x = 90, not an integer count of half litres
    assert F(90, 19) != x


s.verify(check)
s.save()

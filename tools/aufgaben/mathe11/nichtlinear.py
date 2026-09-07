#!/usr/bin/env python3
"""Textaufgaben Mathe 11, KW 37: nichtlineare Gleichungen inhaltlich loesen, Prozent, Binome.
Deck: tools/pptx/build_nichtlinear_mathe11.py - Quiz: HTML/mathetest11-nichtlinear.html"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from textaufgaben import Sheet

s = Sheet("mathe11-nichtlinear", "Nichtlineare Gleichungen, Prozent, Binome", kw=37)

# ---------------------------------------------------------------- AFB I ----
s.task("Das E-Bike im Angebot", 1,
       r"Ein E-Bike kostet $2\,400$ €. Im Herbstangebot wird der Preis um $15\,\%$ gesenkt.",
       [r"Wie viel Euro spart man im Angebot?",
        r"Was kostet das E-Bike im Angebot?",
        r"Ein anderes Modell kostet nach demselben Rabatt von $15\,\%$ genau $1\,700$ €. Was hat es vorher gekostet?",
        r"Nach dem Angebot steigt der Preis des ersten E-Bikes von $2\,400$ € auf $2\,640$ €. Um wie viel Prozent ist er gestiegen?"],
       solution=[
        r"$15\,\%$ von $2\,400$ €: $2\,400 \cdot 0{,}15 = 360$ €. Man spart $360$ €.",
        r"$2\,400 - 360 = 2\,040$ €. Schneller mit dem Faktor: $2\,400 \cdot 0{,}85 = 2\,040$ €.",
        r"$1\,700$ € sind nicht der Grundwert, sondern $85\,\%$ davon: $G \cdot 0{,}85 = 1\,700$, also $G = \dfrac{1\,700}{0{,}85} = 2\,000$ €. Probe: $2\,000 \cdot 0{,}85 = 1\,700$.",
        r"Änderung zuerst: $2\,640 - 2\,400 = 240$ €. Immer auf den alten Wert beziehen: $\dfrac{240}{2\,400} = 0{,}10$, also $10\,\%$."],
       falle=r"Falle in c): $15\,\%$ von $1\,700$ € dazuzählen ergibt $1\,955$ € und ist falsch, weil der Grundwert der alte Preis ist, nicht der neue.")

# --------------------------------------------------------------- AFB II ----
s.task("Das Beet wird größer", 2,
       r"Ein quadratisches Gemüsebeet soll vergrößert werden: **jede Seite wird um $3$ m verlängert**. Danach hat das Beet eine Fläche von $121\ \mathrm{m^2}$. Die ursprüngliche Seitenlänge heißt $x$.",
       [r"Stelle eine Gleichung für $x$ auf.",
        r"Löse die Gleichung **inhaltlich**, also durch Vorlesen und Nachdenken, nicht durch Ausmultiplizieren. Rechnerisch gibt es zwei Lösungen. Begründe, warum nur eine davon in Frage kommt.",
        r"Um wie viele Quadratmeter ist das Beet gewachsen? Zerlege diesen Zuwachs mit der ersten binomischen Formel in drei Teilflächen und beschreibe, wo sie im Beet liegen.",
        r"Um wie viel Prozent ist die Fläche gewachsen?"],
       solution=[
        r"Neue Seitenlänge $x + 3$, neue Fläche $(x + 3)^2$. Gleichung: $(x + 3)^2 = 121$.",
        r"Vorgelesen: „Welche Zahl ergibt quadriert $121$?“ Das sind $11$ und $-11$. Also $x + 3 = 11$ oder $x + 3 = -11$, damit $x = 8$ oder $x = -14$. Eine Seitenlänge kann nicht negativ sein, also bleibt **$x = 8$ m**. Probe: $(8 + 3)^2 = 11^2 = 121$.",
        r"Alte Fläche $8^2 = 64\ \mathrm{m^2}$, neue Fläche $121\ \mathrm{m^2}$, Zuwachs $57\ \mathrm{m^2}$. Mit $(x + 3)^2 = x^2 + 2 \cdot 3x + 9$ besteht der Zuwachs aus $2 \cdot 3 \cdot 8 = 48\ \mathrm{m^2}$ und $3^2 = 9\ \mathrm{m^2}$: zwei Streifen $8 \times 3$ m an zwei Seiten des alten Quadrats und ein kleines Quadrat $3 \times 3$ m in der Ecke. $48 + 9 = 57$.",
        r"$\dfrac{57}{64} \approx 0{,}891$, also rund $89\,\%$. Bezogen auf die alte Fläche, nicht auf die neue."],
       falle=r"Wer die Gleichung ausmultipliziert, landet bei $x^2 + 6x - 112 = 0$ und braucht ein Lösungsverfahren, das erst in ein paar Wochen kommt. Vorlesen reicht hier.")

# -------------------------------------------------------------- AFB III ----
s.task("Plus und minus heben sich auf?", 3,
       r"Ein Mitschüler behauptet: **„Wenn eine Aktie erst um $20\,\%$ steigt und dann um $20\,\%$ fällt, ist man wieder beim Anfang. Plus und minus heben sich auf.“**",
       [r"Prüfe die Behauptung an einem Kurs von $50$ €.",
        r"Zeige mit einer binomischen Formel, dass man bei $+p\,\%$ und anschließend $-p\,\%$ **immer** unter dem Ausgangswert landet. Um wie viel Prozent, ausgedrückt durch $p$?",
        r"Ändert sich etwas, wenn die Aktie erst um $20\,\%$ fällt und dann um $20\,\%$ steigt? Begründe ohne neue Rechnung.",
        r"Um wie viel Prozent muss eine Aktie nach einem Verlust von $20\,\%$ steigen, um den Verlust auszugleichen? Um wie viel nach einem Verlust von $50\,\%$? Formuliere, was daran allgemein gilt, und warum."],
       solution=[
        r"$50 \cdot 1{,}2 = 60$ €, danach $60 \cdot 0{,}8 = 48$ €. Das sind $2$ € oder $4\,\%$ **weniger** als am Anfang. Die Behauptung ist falsch.",
        r"Mit $q = \dfrac{p}{100}$ lauten die Faktoren $1 + q$ und $1 - q$. Dritte binomische Formel: $(1 + q)(1 - q) = 1 - q^2$. Weil $q^2 > 0$ für jedes $p \neq 0$, ist das Ergebnis immer kleiner als $1$. Der Verlust beträgt $q^2 = \dfrac{p^2}{10\,000}$, in Prozent also $\dfrac{p^2}{100}\,\%$. Für $p = 20$ ergibt das $\dfrac{400}{100}\,\% = 4\,\%$ wie in a).",
        r"Nein. Die Reihenfolge ist egal, weil $0{,}8 \cdot 1{,}2 = 1{,}2 \cdot 0{,}8$ ist: Faktoren darf man vertauschen. Der Grund ist also die Multiplikation der Wachstumsfaktoren, nicht die Reihenfolge der Nachrichten.",
        r"Nach $-20\,\%$ bleibt der Faktor $0{,}8$. Gesucht ist der Faktor $f$ mit $0{,}8 \cdot f = 1$, also $f = \dfrac{1}{0{,}8} = 1{,}25$: die Aktie muss um **$25\,\%$** steigen. Nach $-50\,\%$: $\dfrac{1}{0{,}5} = 2$, also **$+100\,\%$**. Allgemein: der nötige Zuwachs ist immer **größer** als der Verlust, und der Abstand wächst mit dem Verlust. Der Grund ist der Grundwert: der Verlust bezieht sich auf den hohen Kurs, der Zuwachs auf den niedrigen. Ein Verlust von $100\,\%$ lässt sich durch keinen Prozentsatz mehr ausgleichen."],
       falle=r"Genau deshalb stimmt „$+10\,\%$ und $-10\,\%$ ist ein Nullsummenspiel“ nie: $1{,}1 \cdot 0{,}9 = 0{,}99$.")


# ---------------------------------------------------------- numbers check ----
def check():
    from fractions import Fraction as F
    assert 2400 * F(15, 100) == 360 and 2400 - 360 == 2040 and 2400 * F(85, 100) == 2040
    assert F(1700) / F(85, 100) == 2000 and 1700 * F(115, 100) == 1955
    assert F(2640 - 2400, 2400) == F(1, 10)
    assert (8 + 3) ** 2 == 121 and (-14 + 3) ** 2 == 121 and 121 - 64 == 57 and 2 * 3 * 8 + 9 == 57
    assert abs(57 / 64 - 0.891) < 0.001
    assert 50 * 1.2 == 60 and abs(60 * 0.8 - 48) < 1e-9 and (1 - 0.2 * 0.2) == 0.96
    assert abs(1 / 0.8 - 1.25) < 1e-12 and 1 / 0.5 == 2 and abs(1.1 * 0.9 - 0.99) < 1e-12
    # x^2 + 6x - 112 is (x+3)^2 - 121 expanded
    assert (8 ** 2 + 6 * 8 - 112) == 0 and ((-14) ** 2 + 6 * (-14) - 112) == 0


s.verify(check)
s.save()

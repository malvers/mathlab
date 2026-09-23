#!/usr/bin/env python3
"""Aufgaben FO Mathe 11, Woche 36 / KW 22: Exkurs Komplexe Zahlen (Wahlbereich 1) -
Zahlbereichserweiterung, imaginaere Einheit, Rechenoperationen, Gausssche Zahlenebene.
Plan: HTML/svp/mathe/mathefos11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos11

Q = fos11(nr=36, slug='komplexe-zahlen', thema='Exkurs: Komplexe Zahlen', lb='WB 1',
          blurb='Zahlbereichserweiterung, imaginäre Einheit, Rechenoperationen, Gaußsche Zahlenebene',
          comment='Blocks: Notwendigkeit der Erweiterung (1-5), Darstellung (6-11), Rechenoperationen (12-17), Zahlenebene und Gleichungen (18-20).')

# --------------------------------------------- Notwendigkeit der Erweiterung ----
Q.q(r'Warum reichen die reellen Zahlen nicht aus, um jede quadratische Gleichung zu lösen?',
    [r'Weil ein Quadrat im Reellen nie negativ ist, hat $x^2 = -1$ keine reelle Lösung.',
     r'Weil die Lösungsformel nur für positive Koeffizienten gilt.',
     r'Weil quadratische Gleichungen immer zwei Lösungen haben müssen.',
     r'Weil die reellen Zahlen nicht dicht liegen.'],
    [r'Für jede reelle Zahl $x$ gilt $x^2 \geq 0$.',
     r'Also kann $x^2 = -1$ im Reellen nicht erfüllt werden.',
     r'Die Lösungsmenge ist leer — genau hier setzt die Erweiterung an.'])

Q.q(r'Wie lautet die Kette der Zahlbereichserweiterungen?',
    [r'$\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q} \subset \mathbb{R} \subset \mathbb{C}$',
     r'$\mathbb{C} \subset \mathbb{R} \subset \mathbb{Q} \subset \mathbb{Z} \subset \mathbb{N}$',
     r'$\mathbb{N} \subset \mathbb{Q} \subset \mathbb{Z} \subset \mathbb{R} \subset \mathbb{C}$',
     r'$\mathbb{Z} \subset \mathbb{N} \subset \mathbb{Q} \subset \mathbb{R} \subset \mathbb{C}$'],
    [r'Jede Erweiterung macht eine bisher unlösbare Aufgabe lösbar.',
     r'$\mathbb{Z}$ erlaubt das Subtrahieren, $\mathbb{Q}$ das Dividieren, $\mathbb{R}$ das Wurzelziehen aus positiven Zahlen.',
     r'$\mathbb{C}$ schließlich erlaubt das Wurzelziehen aus negativen Zahlen.'])

Q.q(r'Welche Aufgabe wird durch den Übergang von $\mathbb{Z}$ zu $\mathbb{Q}$ lösbar?',
    [r'das Teilen, etwa $3 : 4$', r'das Subtrahieren, etwa $3 - 5$',
     r'das Wurzelziehen, etwa $\sqrt{2}$', r'das Wurzelziehen aus negativen Zahlen'],
    [r'In $\mathbb{Z}$ lässt sich $3 : 4$ nicht ausführen.',
     r'Die Brüche schließen diese Lücke.',
     r'$\sqrt{2}$ erfordert dagegen den Schritt zu $\mathbb{R}$.'],)

Q.q(r'Wie ist die imaginäre Einheit $i$ definiert?',
    [r'durch $i^2 = -1$', r'durch $i = -1$', r'durch $i^2 = 1$', r'durch $i = 0$'],
    [r'$i$ ist die Zahl, deren Quadrat $-1$ ergibt.',
     r'Man schreibt auch $i = \sqrt{-1}$, meint damit aber die Festlegung $i^2 = -1$.',
     r'Mit dieser einen Festlegung wird jede quadratische Gleichung lösbar.'])

Q.q(r'Was ist der Nutzen der komplexen Zahlen über die Mathematik hinaus?',
    [r'Sie beschreiben Wechselströme und Schwingungen in der Elektrotechnik.',
     r'Sie werden nur in der reinen Mathematik gebraucht.',
     r'Sie ersetzen die reellen Zahlen in der Statistik.',
     r'Sie dienen ausschließlich dem Lösen von Gleichungen.'],
    [r'In der Elektrotechnik wird der Wechselstromwiderstand als komplexe Größe gerechnet.',
     r'Auch Schwingungen und Regelungstechnik nutzen sie.',
     r'Der Name „imaginär“ täuscht: die Anwendungen sind sehr handfest.'])

# ------------------------------------------------------------------ Darstellung ----
Q.q(r'Wie lautet die allgemeine Form einer komplexen Zahl?',
    [r'$z = a + b\,i$ mit reellen $a$ und $b$', r'$z = a \cdot b\,i$',
     r'$z = a^b \cdot i$', r'$z = \dfrac{a}{b}\,i$'],
    [r'Jede komplexe Zahl besteht aus einem reellen und einem imaginären Anteil.',
     r'$z = a + b\,i$ heißt algebraische oder Normalform.',
     r'$a$ und $b$ sind dabei gewöhnliche reelle Zahlen.'])

Q.q(r'Wie lauten Real- und Imaginärteil von $z = 3 + 4i$?',
    [r'$\operatorname{Re}(z) = 3$ und $\operatorname{Im}(z) = 4$',
     r'$\operatorname{Re}(z) = 3$ und $\operatorname{Im}(z) = 4i$',
     r'$\operatorname{Re}(z) = 4$ und $\operatorname{Im}(z) = 3$',
     r'$\operatorname{Re}(z) = 7$ und $\operatorname{Im}(z) = 0$'],
    [r'Der Realteil ist der Summand ohne $i$.',
     r'Der Imaginärteil ist der Vorfaktor von $i$ — eine reelle Zahl, ohne das $i$.',
     r'Also $\operatorname{Re}(z) = 3$ und $\operatorname{Im}(z) = 4$.'])

Q.q(r'Welche komplexen Zahlen sind zugleich reelle Zahlen?',
    [r'die mit dem Imaginärteil $0$', r'die mit dem Realteil $0$',
     r'die mit $a = b$', r'gar keine'],
    [r'Für $b = 0$ bleibt $z = a$ übrig.',
     r'Das ist eine gewöhnliche reelle Zahl.',
     r'Deshalb ist $\mathbb{R}$ eine Teilmenge von $\mathbb{C}$.'])

Q.q(r'Was ist eine rein imaginäre Zahl?',
    [r'eine Zahl der Form $b\,i$ mit $b \neq 0$, also mit Realteil $0$',
     r'eine Zahl mit Imaginärteil $0$',
     r'eine Zahl mit $a = b$',
     r'jede komplexe Zahl'],
    [r'Für $a = 0$ bleibt $z = b\,i$ übrig.',
     r'Beispiele sind $2i$ oder $-5i$.',
     r'Sie liegen in der Zahlenebene auf der imaginären Achse.'])

Q.q(r'Wie lautet die konjugiert komplexe Zahl zu $z = 2 - 5i$?',
    [r'$\overline{z} = 2 + 5i$', r'$\overline{z} = -2 + 5i$', r'$\overline{z} = -2 - 5i$', r'$\overline{z} = 5 - 2i$'],
    [r'Beim Konjugieren kehrt das Vorzeichen des Imaginärteils um.',
     r'Aus $2 - 5i$ wird $2 + 5i$.',
     r'Der Realteil bleibt unverändert.'])

Q.q(r'Wie berechnet man den Betrag einer komplexen Zahl $z = a + b\,i$?',
    [r'$\left|z\right| = \sqrt{a^2 + b^2}$', r'$\left|z\right| = a + b$',
     r'$\left|z\right| = \sqrt{a^2 - b^2}$', r'$\left|z\right| = a \cdot b$'],
    [r'In der Zahlenebene ist $z$ der Punkt $(a|b)$.',
     r'Der Betrag ist sein Abstand vom Ursprung.',
     r'Nach dem Satz des Pythagoras $\sqrt{a^2 + b^2}$.'])

# ------------------------------------------------------------ Rechenoperationen ----
Q.q(r'Berechne $(2 + 3i) + (1 - 5i)$.',
    [r'$3 - 2i$', r'$3 + 8i$', r'$1 - 2i$', r'$3 - 2$'],
    [r'Real- und Imaginärteile werden getrennt addiert.',
     r'$(2+1) + (3-5)\,i$',
     r'$= 3 - 2i$'])

Q.q(r'Berechne $(4 + i) - (1 + 3i)$.',
    [r'$3 - 2i$', r'$3 + 4i$', r'$5 + 4i$', r'$3 + 2i$'],
    [r'Getrennt subtrahieren: $(4-1) + (1-3)\,i$.',
     r'$= 3 - 2i$',
     r'Das Minus vor der Klammer trifft beide Teile.'])

Q.q(r'Berechne $(2 + 3i)(1 - i)$.',
    [r'$5 + i$', r'$2 - 3i$', r'$-1 + i$', r'$5 - i$'],
    [r'Ausmultiplizieren wie bei Klammern: $2 - 2i + 3i - 3i^2$.',
     r'Wegen $i^2 = -1$ wird $-3i^2 = +3$.',
     r'$= (2+3) + (-2+3)\,i = 5 + i$'])

Q.q(r'Welchen Wert hat $i^3$?',
    [r'$-i$', r'$i$', r'$1$', r'$-1$'],
    [r'$i^3 = i^2 \cdot i$',
     r'$= (-1) \cdot i = -i$',
     r'Die Potenzen wiederholen sich im Viererrhythmus: $i$, $-1$, $-i$, $1$.'])

Q.q(r'Welchen Wert hat $i^4$?',
    [r'$1$', r'$-1$', r'$i$', r'$-i$'],
    [r'$i^4 = \left(i^2\right)^2$',
     r'$= (-1)^2 = 1$',
     r'Deshalb ist $i^{100} = 1$, denn $100$ ist durch $4$ teilbar.'])

Q.q(r'Berechne $(3 + 4i)(3 - 4i)$.',
    [r'$25$', r'$9 - 16i$', r'$-7$', r'$9 + 16i^2$ und damit $-7$'],
    [r'Dritte binomische Formel: $a^2 - b^2$ mit $b = 4i$.',
     r'$9 - 16i^2 = 9 + 16$',
     r'$= 25$. Das Produkt aus $z$ und $\overline{z}$ ist stets reell und gleich $\left|z\right|^2$.'])

# ------------------------------------------- Zahlenebene und Gleichungen ----
Q.q(r'Wie stellt man komplexe Zahlen anschaulich dar?',
    [r'als Punkte in der Gaußschen Zahlenebene, waagerecht der Real-, senkrecht der Imaginärteil',
     r'auf dem gewöhnlichen Zahlenstrahl',
     r'als Vektoren im dreidimensionalen Raum',
     r'gar nicht, sie sind nicht darstellbar'],
    [r'Eine komplexe Zahl braucht zwei Angaben, passt also nicht auf eine Gerade.',
     r'In der Ebene entspricht $z = a + b\,i$ dem Punkt $(a|b)$.',
     r'Die reellen Zahlen liegen dabei auf der waagerechten Achse.'])

Q.q(r'Wie lauten die Lösungen von $x^2 + 1 = 0$ in $\mathbb{C}$?',
    [r'$x = i$ und $x = -i$', r'nur $x = i$', r'$x = 1$ und $x = -1$', r'keine Lösung'],
    [r'$x^2 = -1$',
     r'Sowohl $i$ als auch $-i$ haben das Quadrat $-1$, denn $(-i)^2 = i^2 = -1$.',
     r'Also zwei Lösungen — im Komplexen hat jede quadratische Gleichung zwei.'])

Q.q(r'Wie lauten die Lösungen von $x^2 - 2x + 5 = 0$ in $\mathbb{C}$?',
    [r'$x = 1 + 2i$ und $x = 1 - 2i$', r'$x = 2 + i$ und $x = 2 - i$',
     r'$x = 1 + 4i$ und $x = 1 - 4i$', r'keine Lösung'],
    [r'Lösungsformel: $x = \dfrac{2 \pm \sqrt{4 - 20}}{2} = \dfrac{2 \pm \sqrt{-16}}{2}$',
     r'$\sqrt{-16} = 4i$, also $x = \dfrac{2 \pm 4i}{2}$',
     r'$= 1 \pm 2i$. Die beiden Lösungen sind zueinander konjugiert komplex — das gilt bei reellen Koeffizienten immer.'])


def check():
    import sympy as sp
    I = sp.I
    assert sp.I ** 2 == -1 and sp.I ** 3 == -sp.I and sp.I ** 4 == 1 and sp.I ** 100 == 1
    z = 3 + 4 * I
    assert sp.re(z) == 3 and sp.im(z) == 4
    assert sp.conjugate(2 - 5 * I) == 2 + 5 * I
    assert sp.Abs(z) == 5 and sp.sqrt(3 ** 2 + 4 ** 2) == 5
    assert (2 + 3 * I) + (1 - 5 * I) == 3 - 2 * I
    assert (4 + I) - (1 + 3 * I) == 3 - 2 * I
    assert sp.expand((2 + 3 * I) * (1 - I)) == 5 + I
    assert sp.expand((3 + 4 * I) * (3 - 4 * I)) == 25 and sp.Abs(z) ** 2 == 25
    x = sp.Symbol('x')
    assert sorted(sp.solve(x ** 2 + 1, x), key=str) == sorted([I, -I], key=str)
    assert sp.solveset(x ** 2 + 1, x, sp.S.Reals) == sp.S.EmptySet
    loes = sp.solve(x ** 2 - 2 * x + 5, x)
    assert sorted(loes, key=str) == sorted([1 + 2 * I, 1 - 2 * I], key=str)
    assert sp.sqrt(-16) == 4 * I and (-I) ** 2 == -1
    assert sp.Rational(3, 4) not in sp.S.Integers


Q.verify(check)
Q.save()

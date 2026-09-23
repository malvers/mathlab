#!/usr/bin/env python3
"""Aufgaben FO Mathe 11, Woche 23 / KW 8 (LB 2): relative Haeufigkeit und
Wahrscheinlichkeit, Laplace-Versuche, Gesetz der grossen Zahlen.
Plan: HTML/svp/mathe/mathefos11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos11

Q = fos11(nr=23, slug='haeufigkeit-wahrscheinlichkeit', thema='Häufigkeit und Wahrscheinlichkeit', lb='LB 2',
          blurb='relative Häufigkeit, Laplace-Wahrscheinlichkeit, Eigenschaften, Gesetz der großen Zahlen',
          comment='Blocks: relative Haeufigkeit (1-6), Laplace-Wahrscheinlichkeit (7-12), Eigenschaften (13-17), Gesetz der grossen Zahlen (18-20).')

# ------------------------------------------------------ relative Häufigkeit ----
Q.q(r'Wie berechnet man die relative Häufigkeit eines Ereignisses?',
    [r'absolute Häufigkeit geteilt durch die Anzahl der Versuche',
     r'Anzahl der Versuche geteilt durch die absolute Häufigkeit',
     r'absolute Häufigkeit mal Anzahl der Versuche',
     r'absolute Häufigkeit minus Anzahl der Versuche'],
    [r'Die absolute Häufigkeit zählt, wie oft das Ereignis eingetreten ist.',
     r'Die relative Häufigkeit setzt das ins Verhältnis zur Gesamtzahl: $h = \dfrac{k}{n}$.',
     r'Dadurch werden Versuchsreihen unterschiedlicher Länge vergleichbar.'])

Q.q(r'Bei $60$ Würfen fällt $12$-mal eine Sechs. Wie groß ist die relative Häufigkeit?',
    [r'$0{,}2$', r'$12$', r'$5$', r'$0{,}12$'],
    [r'$h = \dfrac{12}{60}$',
     r'$= \dfrac{1}{5} = 0{,}2$',
     r'Das sind $20\,\%$ der Würfe — deutlich mehr als der theoretische Wert $\dfrac{1}{6} \approx 0{,}167$.'])

Q.q(r'Welche Werte kann eine relative Häufigkeit annehmen?',
    [r'alle Werte zwischen $0$ und $1$ einschließlich der Grenzen',
     r'alle Werte zwischen $-1$ und $1$',
     r'alle natürlichen Zahlen',
     r'nur Werte zwischen $0$ und $0{,}5$'],
    [r'Der Zähler ist höchstens so groß wie der Nenner.',
     r'Tritt das Ereignis nie ein, ist $h = 0$; tritt es immer ein, ist $h = 1$.',
     r'Also $0 \leq h \leq 1$.'])

Q.q(r'Was ergibt die Summe der relativen Häufigkeiten aller Ergebnisse einer Versuchsreihe?',
    [r'immer $1$', r'immer $0$', r'die Anzahl der Versuche', r'das hängt vom Versuch ab'],
    [r'Jeder Versuch liefert genau ein Ergebnis.',
     r'Die absoluten Häufigkeiten addieren sich also zur Versuchszahl $n$.',
     r'Geteilt durch $n$ ergibt das $1$.'])

Q.q(r'Bei $200$ Würfen einer Münze fällt $94$-mal Kopf. Wie groß ist die relative Häufigkeit für Zahl?',
    [r'$0{,}53$', r'$0{,}47$', r'$0{,}5$', r'$106$'],
    [r'Zahl fiel $200 - 94 = 106$-mal.',
     r'$h = \dfrac{106}{200} = 0{,}53$',
     r'Die Summe beider relativer Häufigkeiten ist $0{,}47 + 0{,}53 = 1$.'])

Q.q(r'Wozu dient die relative Häufigkeit in der Wahrscheinlichkeitsrechnung?',
    [r'Sie ist ein Schätzwert für die Wahrscheinlichkeit, wenn diese nicht theoretisch bestimmbar ist.',
     r'Sie ist immer genau gleich der Wahrscheinlichkeit.',
     r'Sie ersetzt die Ergebnismenge.',
     r'Sie gibt an, wie oft ein Versuch wiederholt werden muss.'],
    [r'Bei einer Reißzwecke oder einem verbeulten Würfel lässt sich die Wahrscheinlichkeit nicht ausrechnen.',
     r'Man ermittelt sie dann durch viele Versuche und nimmt die relative Häufigkeit als Schätzwert.',
     r'Je mehr Versuche, desto verlässlicher der Schätzwert.'])

# --------------------------------------------- Laplace-Wahrscheinlichkeit ----
Q.q(r'Wie berechnet man die Wahrscheinlichkeit bei einem Laplace-Versuch?',
    [r'Anzahl der günstigen Ergebnisse geteilt durch die Anzahl aller Ergebnisse',
     r'Anzahl aller Ergebnisse geteilt durch die günstigen',
     r'günstige Ergebnisse mal alle Ergebnisse',
     r'günstige Ergebnisse minus alle Ergebnisse'],
    [r'$P(A) = \dfrac{\left|A\right|}{\left|\Omega\right|}$',
     r'Voraussetzung ist, dass alle Ergebnisse gleich wahrscheinlich sind.',
     r'Nur dann darf einfach abgezählt werden.'])

Q.q(r'Wie groß ist beim Würfel die Wahrscheinlichkeit für eine gerade Augenzahl?',
    [r'$\dfrac{1}{2}$', r'$\dfrac{1}{3}$', r'$\dfrac{1}{6}$', r'$\dfrac{2}{3}$'],
    [r'Günstig sind $2$, $4$ und $6$, also drei Ergebnisse.',
     r'$P = \dfrac{3}{6} = \dfrac{1}{2}$',
     r'Gerade und ungerade sind gleich wahrscheinlich.'])

Q.q(r'Wie groß ist beim Würfel die Wahrscheinlichkeit für eine Augenzahl größer als $4$?',
    [r'$\dfrac{1}{3}$', r'$\dfrac{1}{2}$', r'$\dfrac{1}{6}$', r'$\dfrac{2}{6}$ und damit $\dfrac{1}{4}$'],
    [r'Günstig sind $5$ und $6$.',
     r'$P = \dfrac{2}{6} = \dfrac{1}{3}$',
     r'Die $4$ zählt nicht mit, denn gefragt ist „größer als“, nicht „mindestens“.'])

Q.q(r'In einer Urne liegen $3$ rote und $5$ blaue Kugeln. Wie groß ist die Wahrscheinlichkeit, eine rote zu ziehen?',
    [r'$\dfrac{3}{8}$', r'$\dfrac{3}{5}$', r'$\dfrac{1}{3}$', r'$\dfrac{5}{8}$'],
    [r'Insgesamt sind es $3 + 5 = 8$ Kugeln.',
     r'$P(\text{rot}) = \dfrac{3}{8}$',
     r'$\dfrac{3}{5}$ wäre das Verhältnis rot zu blau, nicht die Wahrscheinlichkeit.'])

Q.q(r'Aus einem Skatblatt mit $32$ Karten wird eine gezogen. Wie groß ist die Wahrscheinlichkeit für Herz?',
    [r'$\dfrac{1}{4}$', r'$\dfrac{1}{8}$', r'$\dfrac{1}{32}$', r'$\dfrac{8}{24}$'],
    [r'Von den vier Farben hat jede $8$ Karten.',
     r'$P = \dfrac{8}{32} = \dfrac{1}{4}$',
     r'Das ist derselbe Wert wie der Anteil einer Farbe am Blatt.'])

Q.q(r'Welcher Versuch ist KEIN Laplace-Versuch?',
    [r'das Ziehen einer Kugel aus einer Urne mit $3$ roten und $5$ blauen Kugeln, wenn nur die Farbe zählt',
     r'das Werfen eines fairen Würfels',
     r'das Werfen einer fairen Münze',
     r'das Ziehen einer Karte aus einem gut gemischten Skatblatt'],
    [r'Bei einem Laplace-Versuch müssen alle Ergebnisse gleich wahrscheinlich sein.',
     r'Zählt nur die Farbe, hat $\Omega = \{\text{rot};\,\text{blau}\}$ zwei Ergebnisse — aber blau ist wahrscheinlicher.',
     r'Zählt man dagegen die einzelnen Kugeln, ist es wieder ein Laplace-Versuch.'])

# ---------------------------------------------------------- Eigenschaften ----
Q.q(r'Welchen Wert hat die Wahrscheinlichkeit des sicheren Ereignisses?',
    [r'$P(\Omega) = 1$', r'$P(\Omega) = 0$', r'$P(\Omega) = 0{,}5$', r'das hängt vom Versuch ab'],
    [r'Das sichere Ereignis umfasst alle Ergebnisse.',
     r'$P(\Omega) = \dfrac{\left|\Omega\right|}{\left|\Omega\right|} = 1$',
     r'Eine Wahrscheinlichkeit von $1$ bedeutet: es tritt mit Sicherheit ein.'])

Q.q(r'Welchen Wert hat die Wahrscheinlichkeit des unmöglichen Ereignisses?',
    [r'$0$', r'$1$', r'$-1$', r'das ist nicht definiert'],
    [r'Das unmögliche Ereignis ist die leere Menge.',
     r'Es enthält kein günstiges Ergebnis: $P = \dfrac{0}{\left|\Omega\right|} = 0$.',
     r'Beispiel: beim Würfel eine Sieben zu werfen.'])

Q.q(r'Ein Ereignis $A$ hat die Wahrscheinlichkeit $P(A) = 0{,}3$. Wie groß ist $P\left(\overline{A}\right)$?',
    [r'$0{,}7$', r'$0{,}3$', r'$-0{,}3$', r'$1{,}3$'],
    [r'Ein Ereignis und sein Gegenereignis schließen einander aus und decken zusammen $\Omega$ ab.',
     r'$P\left(\overline{A}\right) = 1 - P(A)$',
     r'$1 - 0{,}3 = 0{,}7$. Diese Regel spart oft viel Rechnerei.'])

Q.q(r'Welche Angabe kann KEINE Wahrscheinlichkeit sein?',
    [r'$1{,}2$', r'$0$', r'$0{,}85$', r'$1$'],
    [r'Für jede Wahrscheinlichkeit gilt $0 \leq P(A) \leq 1$.',
     r'$1{,}2$ liegt außerhalb dieses Bereichs.',
     r'Auch negative Werte sind ausgeschlossen.'])

Q.q(r'Beim Würfel ist $A = \{1;\,2\}$. Wie groß ist die Wahrscheinlichkeit, dass $A$ NICHT eintritt?',
    [r'$\dfrac{2}{3}$', r'$\dfrac{1}{3}$', r'$\dfrac{1}{2}$', r'$\dfrac{5}{6}$'],
    [r'$P(A) = \dfrac{2}{6} = \dfrac{1}{3}$',
     r'$P\left(\overline{A}\right) = 1 - \dfrac{1}{3} = \dfrac{2}{3}$',
     r'Probe durch Abzählen: $\overline{A} = \{3;\,4;\,5;\,6\}$, also $\dfrac{4}{6} = \dfrac{2}{3}$.'])

# ----------------------------------------- Gesetz der großen Zahlen ----
Q.q(r'Was besagt das Gesetz der großen Zahlen?',
    [r'Mit wachsender Versuchszahl nähert sich die relative Häufigkeit der Wahrscheinlichkeit an.',
     r'Nach vielen Versuchen tritt jedes Ergebnis genau gleich oft ein.',
     r'Je mehr Versuche, desto größer die Wahrscheinlichkeit.',
     r'Ab $100$ Versuchen stimmt die relative Häufigkeit mit der Wahrscheinlichkeit überein.'],
    [r'Bei wenigen Würfen schwankt die relative Häufigkeit stark.',
     r'Mit wachsender Versuchszahl werden die Schwankungen kleiner.',
     r'Sie verschwinden aber nie ganz — exakte Gleichheit ist nicht garantiert.'])

Q.q(r'Eine Münze wurde fünfmal geworfen, jedes Mal fiel Kopf. Wie groß ist die Wahrscheinlichkeit, dass beim sechsten Wurf Zahl fällt?',
    [r'$\dfrac{1}{2}$, wie bei jedem Wurf', r'größer als $\dfrac{1}{2}$, weil Zahl nun fällig ist',
     r'kleiner als $\dfrac{1}{2}$, weil Kopf eine Serie hat', r'$\dfrac{1}{6}$'],
    [r'Die Münze hat kein Gedächtnis: jeder Wurf ist unabhängig von den vorherigen.',
     r'Die Wahrscheinlichkeit bleibt $\dfrac{1}{2}$.',
     r'Der gegenteilige Glaube heißt Spielerfehlschluss; das Gesetz der großen Zahlen gleicht nichts aus, es verdünnt nur.'])

Q.q(r'In einer Simulation mit $6000$ Würfen fällt die Sechs $1050$-mal. Wie beurteilst du das?',
    [r'Die relative Häufigkeit $0{,}175$ liegt nahe am theoretischen Wert $\dfrac{1}{6} \approx 0{,}167$.',
     r'Der Würfel ist eindeutig gezinkt.',
     r'Das Ergebnis widerspricht dem Gesetz der großen Zahlen.',
     r'Die Simulation ist fehlerhaft, es müssten genau $1000$ sein.'],
    [r'$h = \dfrac{1050}{6000} = 0{,}175$',
     r'Der theoretische Wert ist $\dfrac{1}{6} \approx 0{,}167$, der Erwartungswert also rund $1000$ Sechsen.',
     r'Eine Abweichung von $50$ bei $6000$ Würfen ist normale Schwankung, kein Hinweis auf einen gezinkten Würfel.'])


def check():
    from fractions import Fraction as F
    assert F(12, 60) == F(1, 5) and float(F(1, 5)) == 0.2
    assert abs(float(F(1, 6)) - 0.167) < 0.0005
    assert 200 - 94 == 106 and F(106, 200) == F(53, 100) and F(94, 200) + F(106, 200) == 1
    # Laplace
    assert F(3, 6) == F(1, 2) and F(2, 6) == F(1, 3) and F(2, 6) != F(1, 4)
    assert F(3, 3 + 5) == F(3, 8) and F(3, 5) != F(3, 8)
    assert F(8, 32) == F(1, 4)
    assert F(5, 8) != F(1, 2)                      # blau ist wahrscheinlicher als rot
    # Eigenschaften
    assert F(6, 6) == 1 and F(0, 6) == 0
    assert 1 - F(3, 10) == F(7, 10)
    assert not (0 <= F(12, 10) <= 1)
    assert 1 - F(2, 6) == F(4, 6) == F(2, 3)
    # Gesetz der grossen Zahlen
    assert F(1050, 6000) == F(7, 40) and float(F(7, 40)) == 0.175
    assert abs(float(F(7, 40)) - float(F(1, 6))) < 0.01 and F(6000, 6) == 1000
    assert F(1, 2) == F(1, 2)                      # der sechste Wurf bleibt unbeeinflusst


Q.verify(check)
Q.save()

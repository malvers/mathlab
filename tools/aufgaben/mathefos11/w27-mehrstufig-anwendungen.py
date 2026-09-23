#!/usr/bin/env python3
"""Aufgaben FO Mathe 11, Woche 27 / KW 12 (LB 2): Anwendungen mehrstufiger
Zufallsexperimente - Qualitaetskontrolle, Auswahlverfahren, Raten, Technik.
Plan: HTML/svp/mathe/mathefos11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos11

Q = fos11(nr=27, slug='mehrstufig-anwendungen', thema='Anwendungen mehrstufiger Versuche', lb='LB 2',
          blurb='Qualitätskontrolle, Lose und Auswahl, Raten, technische Anlagen',
          comment='Blocks: Qualitaetskontrolle (1-6), Lose und Auswahl (7-11), Raten und Wuerfeln (12-16), Technik (17-20).')

# ------------------------------------------------------- Qualitätskontrolle ----
Q.q(r'In einer Fertigung sind $5\,\%$ der Teile fehlerhaft. Zwei Teile werden unabhängig geprüft. Wie groß ist die Wahrscheinlichkeit, dass beide in Ordnung sind?',
    [r'$90{,}25\,\%$', r'$95\,\%$', r'$90\,\%$', r'$25\,\%$'],
    [r'Jedes Teil ist mit $0{,}95$ in Ordnung.',
     r'$P = 0{,}95 \cdot 0{,}95 = 0{,}9025$',
     r'Also $90{,}25\,\%$, etwas weniger als die $95\,\%$ eines einzelnen Teils.'])

Q.q(r'Wie groß ist in der vorigen Aufgabe die Wahrscheinlichkeit, dass mindestens ein Teil fehlerhaft ist?',
    [r'$9{,}75\,\%$', r'$10\,\%$', r'$5\,\%$', r'$0{,}25\,\%$'],
    [r'Gegenereignis zu „beide in Ordnung“.',
     r'$1 - 0{,}9025 = 0{,}0975$',
     r'Also $9{,}75\,\%$ — knapp unter den $10\,\%$, die eine naive Addition liefern würde.'])

Q.q(r'Drei Teile werden geprüft, jedes ist unabhängig mit $5\,\%$ fehlerhaft. Wie groß ist die Wahrscheinlichkeit, dass alle drei in Ordnung sind?',
    [r'etwa $85{,}7\,\%$', r'etwa $95\,\%$', r'etwa $15\,\%$', r'etwa $99\,\%$'],
    [r'$P = 0{,}95^3$',
     r'$= 0{,}857375$',
     r'Also rund $85{,}7\,\%$. Mit jedem weiteren Teil sinkt die Wahrscheinlichkeit, dass alles fehlerfrei ist.'])

Q.q(r'Ein Ausschussanteil von $2\,\%$ ist bekannt. Wie groß ist die Wahrscheinlichkeit, dass unter $10$ unabhängig entnommenen Teilen kein einziges fehlerhaft ist?',
    [r'etwa $81{,}7\,\%$', r'etwa $98\,\%$', r'etwa $20\,\%$', r'etwa $2\,\%$'],
    [r'$P = 0{,}98^{10}$',
     r'$\approx 0{,}817$',
     r'Rund $82\,\%$ — bei zehn Teilen ist ein Fehler also schon recht wahrscheinlich.'])

Q.q(r'Maschine A fertigt $60\,\%$ der Teile mit $2\,\%$ Ausschuss, Maschine B die übrigen $40\,\%$ mit $5\,\%$ Ausschuss. Wie groß ist der Ausschussanteil insgesamt?',
    [r'$3{,}2\,\%$', r'$3{,}5\,\%$', r'$7\,\%$', r'$2{,}8\,\%$'],
    [r'Zweistufiger Versuch: erst die Maschine, dann die Qualität.',
     r'$P = 0{,}60 \cdot 0{,}02 + 0{,}40 \cdot 0{,}05 = 0{,}012 + 0{,}020$',
     r'$= 0{,}032$, also $3{,}2\,\%$. Der Mittelwert $3{,}5\,\%$ wäre falsch, weil A mehr Teile liefert.'])

Q.q(r'Wie groß ist in der vorigen Aufgabe die Wahrscheinlichkeit, dass ein zufällig entnommenes Teil von Maschine A stammt UND fehlerhaft ist?',
    [r'$1{,}2\,\%$', r'$2\,\%$', r'$3{,}2\,\%$', r'$60\,\%$'],
    [r'Das ist genau ein Pfad im Baumdiagramm.',
     r'$P = 0{,}60 \cdot 0{,}02 = 0{,}012$',
     r'Also $1{,}2\,\%$ — das ist der größere der beiden Ausschuss-Pfade.'])

# ------------------------------------------------------- Lose und Auswahl ----
Q.q(r'Unter $100$ Losen sind $10$ Gewinne. Zwei Lose werden nacheinander OHNE Zurücklegen gezogen. Wie groß ist die Wahrscheinlichkeit für zwei Gewinne?',
    [r'$\dfrac{1}{110}$', r'$\dfrac{1}{100}$', r'$\dfrac{1}{10}$', r'$\dfrac{9}{100}$'],
    [r'Erstes Los: $\dfrac{10}{100}$. Danach sind noch $9$ Gewinne unter $99$ Losen.',
     r'$P = \dfrac{10}{100} \cdot \dfrac{9}{99} = \dfrac{90}{9900}$',
     r'$= \dfrac{1}{110}$'])

Q.q(r'Dieselben Lose: wie groß ist die Wahrscheinlichkeit, dass keines der beiden gezogenen Lose gewinnt?',
    [r'$\dfrac{89}{110}$', r'$\dfrac{81}{100}$', r'$\dfrac{9}{10}$', r'$\dfrac{1}{110}$'],
    [r'$P = \dfrac{90}{100} \cdot \dfrac{89}{99}$',
     r'$= \dfrac{8010}{9900} = \dfrac{89}{110}$',
     r'Das sind rund $80{,}9\,\%$.'])

Q.q(r'Wie groß ist bei denselben Losen die Wahrscheinlichkeit für mindestens einen Gewinn?',
    [r'$\dfrac{21}{110}$', r'$\dfrac{1}{110}$', r'$\dfrac{89}{110}$', r'$\dfrac{1}{5}$'],
    [r'Über das Gegenereignis „kein Gewinn“.',
     r'$1 - \dfrac{89}{110} = \dfrac{21}{110}$',
     r'Das sind rund $19{,}1\,\%$.'])

Q.q(r'Würde man die beiden Lose MIT Zurücklegen ziehen, wie groß wäre die Wahrscheinlichkeit für zwei Gewinne?',
    [r'$\dfrac{1}{100}$', r'$\dfrac{1}{110}$', r'$\dfrac{1}{10}$', r'$\dfrac{1}{50}$'],
    [r'Mit Zurücklegen bleibt die Gewinnwahrscheinlichkeit $\dfrac{10}{100} = \dfrac{1}{10}$.',
     r'$P = \dfrac{1}{10} \cdot \dfrac{1}{10} = \dfrac{1}{100}$',
     r'Das ist etwas mehr als ohne Zurücklegen — dort fehlt beim zweiten Zug ein Gewinnlos.'])

Q.q(r'Aus $5$ Bewerbungen werden nacheinander zwei verschiedene ausgewählt. Wie viele Reihenfolgen sind möglich?',
    [r'$20$', r'$10$', r'$25$', r'$4$'],
    [r'Für die erste Auswahl gibt es $5$ Möglichkeiten, für die zweite noch $4$.',
     r'$5 \cdot 4 = 20$',
     r'Kommt es auf die Reihenfolge nicht an, wären es nur $10$ Paare.'])

# ------------------------------------------------------ Raten und Würfeln ----
Q.q(r'Bei drei Fragen mit je vier Antworten wird geraten. Wie groß ist die Wahrscheinlichkeit, alle drei richtig zu treffen?',
    [r'$\dfrac{1}{64}$', r'$\dfrac{1}{12}$', r'$\dfrac{3}{4}$', r'$\dfrac{1}{4}$'],
    [r'Jede Frage wird unabhängig mit $\dfrac{1}{4}$ richtig geraten.',
     r'$P = \left(\dfrac{1}{4}\right)^3 = \dfrac{1}{64}$',
     r'Das sind rund $1{,}6\,\%$ — Raten lohnt sich nicht.'])

Q.q(r'Wie groß ist bei denselben drei Fragen die Wahrscheinlichkeit, keine einzige richtig zu raten?',
    [r'$\dfrac{27}{64}$', r'$\dfrac{1}{64}$', r'$\dfrac{3}{4}$', r'$\dfrac{37}{64}$'],
    [r'Jede Frage wird mit $\dfrac{3}{4}$ falsch geraten.',
     r'$P = \left(\dfrac{3}{4}\right)^3 = \dfrac{27}{64}$',
     r'Das sind rund $42\,\%$.'])

Q.q(r'Wie groß ist bei denselben drei Fragen die Wahrscheinlichkeit, mindestens eine richtig zu raten?',
    [r'$\dfrac{37}{64}$', r'$\dfrac{27}{64}$', r'$\dfrac{3}{4}$', r'$\dfrac{1}{64}$'],
    [r'Gegenereignis zu „keine richtig“.',
     r'$1 - \dfrac{27}{64} = \dfrac{37}{64}$',
     r'Rund $58\,\%$ — mindestens ein Treffer ist also wahrscheinlicher als keiner.'])

Q.q(r'Ein Würfel wird dreimal geworfen. Wie groß ist die Wahrscheinlichkeit, keine einzige Sechs zu werfen?',
    [r'$\dfrac{125}{216}$', r'$\dfrac{91}{216}$', r'$\dfrac{1}{216}$', r'$\dfrac{5}{6}$'],
    [r'Jeder Wurf ist mit $\dfrac{5}{6}$ keine Sechs.',
     r'$P = \left(\dfrac{5}{6}\right)^3 = \dfrac{125}{216}$',
     r'Das sind rund $58\,\%$.'])

Q.q(r'Wie groß ist bei drei Würfen die Wahrscheinlichkeit für mindestens eine Sechs?',
    [r'$\dfrac{91}{216}$', r'$\dfrac{125}{216}$', r'$\dfrac{1}{2}$', r'$\dfrac{3}{6}$'],
    [r'Gegenereignis: keine Sechs mit $\dfrac{125}{216}$.',
     r'$1 - \dfrac{125}{216} = \dfrac{91}{216}$',
     r'Rund $42\,\%$. Die naive Rechnung $3 \cdot \dfrac{1}{6} = \dfrac{1}{2}$ ist falsch, sie zählt Mehrfachtreffer doppelt.'])

# ------------------------------------------------------------------ Technik ----
Q.q(r'Auf dem Weg zur Arbeit liegen drei Ampeln, jede zeigt unabhängig mit $40\,\%$ Rot. Wie groß ist die Wahrscheinlichkeit, bei allen dreien Grün zu haben?',
    [r'$21{,}6\,\%$', r'$60\,\%$', r'$6{,}4\,\%$', r'$78{,}4\,\%$'],
    [r'Jede Ampel zeigt mit $0{,}6$ Grün.',
     r'$P = 0{,}6^3 = 0{,}216$',
     r'Also $21{,}6\,\%$ — eine freie Fahrt ist selten.'])

Q.q(r'Wie groß ist in der vorigen Aufgabe die Wahrscheinlichkeit, mindestens einmal halten zu müssen?',
    [r'$78{,}4\,\%$', r'$40\,\%$', r'$21{,}6\,\%$', r'$120\,\%$'],
    [r'Gegenereignis zu „überall Grün“.',
     r'$1 - 0{,}216 = 0{,}784$',
     r'Also $78{,}4\,\%$.'])

Q.q(r'Eine Anlage hat zwei parallel geschaltete Pumpen; sie läuft, solange mindestens eine arbeitet. Jede fällt unabhängig mit $20\,\%$ aus. Wie zuverlässig ist die Anlage?',
    [r'$96\,\%$', r'$80\,\%$', r'$64\,\%$', r'$4\,\%$'],
    [r'Die Anlage steht nur, wenn beide ausfallen: $0{,}2 \cdot 0{,}2 = 0{,}04$.',
     r'$1 - 0{,}04 = 0{,}96$',
     r'Also $96\,\%$ — die Parallelschaltung ist zuverlässiger als eine einzelne Pumpe mit $80\,\%$.'])

Q.q(r'Dieselben zwei Pumpen, aber in Reihe geschaltet: die Anlage läuft nur, wenn beide arbeiten. Wie zuverlässig ist sie dann?',
    [r'$64\,\%$', r'$96\,\%$', r'$80\,\%$', r'$40\,\%$'],
    [r'Beide müssen funktionieren: $0{,}8 \cdot 0{,}8$.',
     r'$= 0{,}64$, also $64\,\%$.',
     r'Reihenschaltung senkt die Zuverlässigkeit, Parallelschaltung hebt sie — derselbe Bauteilsatz, ein Unterschied von $32$ Prozentpunkten.'])


def check():
    from fractions import Fraction as F
    g = F(95, 100)
    assert g * g == F(9025, 10000) and 1 - g * g == F(975, 10000)
    assert g ** 3 == F(857375, 1000000) and abs(float(g ** 3) - 0.857) < 0.0005
    assert abs(float(F(98, 100) ** 10) - 0.817) < 0.0005
    assert F(60, 100) * F(2, 100) + F(40, 100) * F(5, 100) == F(32, 1000)
    assert F(60, 100) * F(2, 100) == F(12, 1000) and F(35, 1000) != F(32, 1000)
    # Lose
    assert F(10, 100) * F(9, 99) == F(1, 110)
    assert F(90, 100) * F(89, 99) == F(89, 110) and abs(float(F(89, 110)) - 0.809) < 0.0005
    assert 1 - F(89, 110) == F(21, 110) and abs(float(F(21, 110)) - 0.191) < 0.0005
    assert F(1, 10) * F(1, 10) == F(1, 100) and F(1, 100) > F(1, 110)
    assert 5 * 4 == 20 and F(5 * 4, 2) == 10
    # Raten und Wuerfeln
    assert F(1, 4) ** 3 == F(1, 64) and abs(float(F(1, 64)) - 0.016) < 0.0005
    assert F(3, 4) ** 3 == F(27, 64) and abs(float(F(27, 64)) - 0.42) < 0.005
    assert 1 - F(27, 64) == F(37, 64) and abs(float(F(37, 64)) - 0.58) < 0.005
    assert F(5, 6) ** 3 == F(125, 216) and 1 - F(125, 216) == F(91, 216)
    assert abs(float(F(125, 216)) - 0.58) < 0.005 and abs(float(F(91, 216)) - 0.42) < 0.005
    assert 3 * F(1, 6) == F(1, 2) and F(1, 2) != F(91, 216)
    # Technik
    assert F(6, 10) ** 3 == F(216, 1000) and 1 - F(216, 1000) == F(784, 1000)
    assert F(2, 10) * F(2, 10) == F(4, 100) and 1 - F(4, 100) == F(96, 100)
    assert F(8, 10) * F(8, 10) == F(64, 100) and F(96, 100) - F(64, 100) == F(32, 100)


Q.verify(check)
Q.save()

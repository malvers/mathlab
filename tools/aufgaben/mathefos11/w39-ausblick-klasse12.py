#!/usr/bin/env python3
"""Aufgaben FO Mathe 11, Woche 39 / KW 25: Ausblick auf Klasse 12 - erste Schritte
in Vektorrechnung und Differenzialrechnung. Alles aus dem Aufgabentext heraus
loesbar, es wird kein Stoff der Klasse 12 vorausgesetzt.
Plan: HTML/svp/mathe/mathefos11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos11, vec

Q = fos11(nr=39, slug='ausblick-klasse12', thema='Ausblick auf Klasse 12', lb='Ausblick',
          blurb='erste Schritte in Vektorrechnung und Differenzialrechnung',
          comment='Blocks: Vektoren erste Schritte (1-7), Aenderungsrate und Anstieg (8-14), was in Klasse 12 kommt (15-20). Alle Regeln stehen jeweils in der Aufgabe.')

# ----------------------------------------------------- Vektoren erste Schritte ----
Q.q(r'Ein Vektor beschreibt eine Verschiebung im Raum. Wie viele Zahlen braucht man dafür im $\mathbb{R}^3$?',
    [r'drei, je eine für jede Koordinatenrichtung', r'zwei', r'eine', r'vier'],
    [r'Der Raum hat drei Richtungen, üblicherweise $x$, $y$ und $z$.',
     r'Eine Verschiebung legt für jede Richtung einen Wert fest.',
     r'Deshalb schreibt man einen Vektor als Spalte mit drei Zahlen.'])

Q.q(r'Der Ortsvektor eines Punktes zeigt vom Ursprung zu diesem Punkt. Wie lautet er für $P(2|3|6)$?',
    [r'$' + vec(2, 3, 6) + '$', r'$' + vec(6, 3, 2) + '$', r'$' + vec(0, 0, 0) + '$', r'$' + vec(2, 3, 6) + r'$ geteilt durch $3$'],
    [r'Der Ortsvektor trägt genau die Koordinaten des Punktes.',
     r'$\overrightarrow{OP} = ' + vec(2, 3, 6) + '$',
     r'Punkt und Ortsvektor werden deshalb oft gleichgesetzt.'])

Q.q(r'Die Länge eines Vektors berechnet man mit $\sqrt{a_1^2 + a_2^2 + a_3^2}$. Wie lang ist $' + vec(2, 3, 6) + '$?',
    [r'$7$', r'$11$', r'$49$', r'$\sqrt{11}$'],
    [r'$\sqrt{4 + 9 + 36} = \sqrt{49}$',
     r'$= 7$',
     r'Das ist die räumliche Fassung des Satzes von Pythagoras.'])

Q.q(r'Der Verbindungsvektor von $A$ nach $B$ ist „Spitze minus Fuß“. Wie lautet er für $A(1|0|2)$ und $B(4|4|2)$?',
    [r'$' + vec(3, 4, 0) + '$', r'$' + vec(-3, -4, 0) + '$', r'$' + vec(5, 4, 4) + '$', r'$' + vec(4, 4, 2) + '$'],
    [r'$\overrightarrow{AB} = \vec b - \vec a$',
     r'$' + vec(4, 4, 2) + ' - ' + vec(1, 0, 2) + ' = ' + vec(3, 4, 0) + '$',
     r'Die dritte Koordinate ist $0$ — beide Punkte liegen gleich hoch.'])

Q.q(r'Wie lang ist die Strecke $\overline{AB}$ aus der vorigen Aufgabe?',
    [r'$5$', r'$7$', r'$25$', r'$\sqrt{7}$'],
    [r'Die Länge der Strecke ist der Betrag des Verbindungsvektors.',
     r'$\sqrt{9 + 16 + 0} = \sqrt{25}$',
     r'$= 5$'])

Q.q(r'Vektoren werden koordinatenweise addiert. Wie lautet $' + vec(1, 2, 0) + ' + ' + vec(3, -1, 5) + '$?',
    [r'$' + vec(4, 1, 5) + '$', r'$' + vec(4, 3, 5) + '$', r'$' + vec(-2, 3, -5) + '$', r'$' + vec(3, -2, 0) + '$'],
    [r'Jede Zeile für sich addieren: $1+3$, $2+(-1)$, $0+5$.',
     r'$= ' + vec(4, 1, 5) + '$',
     r'Anschaulich hängt man die zweite Verschiebung an die erste an.'])

Q.q(r'Wozu braucht man Vektoren in Klasse 12?',
    [r'um Geraden und Ebenen im Raum zu beschreiben und Lagen, Winkel und Abstände zu berechnen',
     r'nur um Punkte aufzuschreiben',
     r'um Gleichungen zu lösen',
     r'um Wahrscheinlichkeiten zu berechnen'],
    [r'Mit Vektoren lassen sich Geraden als $\vec x = \vec p + t\,\vec u$ schreiben.',
     r'Ebenen bekommen eine ähnliche Darstellung.',
     r'Darauf bauen Schnittpunkte, Schnittwinkel, Lotfußpunkte und Flächeninhalte auf.'])

# ------------------------------------------------- Änderungsrate und Anstieg ----
Q.q(r'Die mittlere Änderungsrate einer Funktion zwischen $x_1$ und $x_2$ ist $\dfrac{f(x_2) - f(x_1)}{x_2 - x_1}$. Wie groß ist sie für $f(x) = x^2$ zwischen $1$ und $4$?',
    [r'$5$', r'$15$', r'$3$', r'$\dfrac{1}{5}$'],
    [r'$f(4) = 16$ und $f(1) = 1$.',
     r'$\dfrac{16 - 1}{4 - 1} = \dfrac{15}{3}$',
     r'$= 5$. Das ist der Anstieg der Geraden durch die beiden Kurvenpunkte.'])

Q.q(r'Wie heißt die Gerade, die den Graphen in zwei Punkten schneidet und deren Anstieg die mittlere Änderungsrate ist?',
    [r'Sekante', r'Tangente', r'Normale', r'Asymptote'],
    [r'Die Sekante verbindet zwei Punkte des Graphen.',
     r'Ihr Anstieg ist der Differenzenquotient.',
     r'Lässt man die beiden Punkte zusammenrücken, wird aus der Sekante die Tangente.'])

Q.q(r'Berechne die mittlere Änderungsrate von $f(x) = x^2$ zwischen $2$ und $3$.',
    [r'$5$', r'$1$', r'$6$', r'$\dfrac{13}{2}$'],
    [r'$f(3) = 9$ und $f(2) = 4$.',
     r'$\dfrac{9 - 4}{3 - 2} = 5$',
     r'Zufällig derselbe Wert wie zwischen $1$ und $4$ — die Sekanten sind parallel.'])

Q.q(r'Was ist die momentane Änderungsrate an einer Stelle?',
    [r'der Anstieg der Tangente in diesem Punkt', r'der Anstieg der Sekante',
     r'der Funktionswert an dieser Stelle', r'der Abstand zur $x$-Achse'],
    [r'Man lässt die zweite Stelle immer näher an die erste heranrücken.',
     r'Die Sekanten nähern sich dabei einer Grenzlage, der Tangente.',
     r'Deren Anstieg heißt momentane Änderungsrate oder Ableitung.'])

Q.q(r'Für $f(x) = x^2$ gilt die Ableitung $f^{\prime}(x) = 2x$. Wie groß ist der Tangentenanstieg an der Stelle $x = 3$?',
    [r'$6$', r'$9$', r'$3$', r'$2$'],
    [r'$f^{\prime}(3) = 2 \cdot 3$',
     r'$= 6$',
     r'$9$ wäre der Funktionswert $f(3)$, nicht der Anstieg.'])

Q.q(r'Ein Fahrzeug legt nach $t$ Sekunden den Weg $s(t) = 5t^2$ Meter zurück. Wie groß ist seine mittlere Geschwindigkeit in den ersten $4$ Sekunden?',
    [r'$20\,\mathrm{m/s}$', r'$80\,\mathrm{m/s}$', r'$40\,\mathrm{m/s}$', r'$5\,\mathrm{m/s}$'],
    [r'$s(4) = 80$ Meter, $s(0) = 0$.',
     r'$\dfrac{80 - 0}{4 - 0} = 20$',
     r'Also $20\,\mathrm{m/s}$. Die Geschwindigkeit am Ende ist höher, weil das Fahrzeug beschleunigt.'])

Q.q(r'Warum ist die momentane Geschwindigkeit nach $4$ Sekunden größer als die mittlere über die ersten $4$ Sekunden?',
    [r'Weil das Fahrzeug beschleunigt und am Anfang langsamer war.',
     r'Weil die mittlere Geschwindigkeit immer zu groß ist.',
     r'Weil die Strecke falsch gemessen wurde.',
     r'Sie ist nicht größer, beide sind gleich.'],
    [r'Der Weg wächst quadratisch, also immer schneller.',
     r'Die mittlere Geschwindigkeit mittelt über die langsame Anfangsphase mit.',
     r'Mit $s^{\prime}(t) = 10t$ ergibt sich momentan $40\,\mathrm{m/s}$ — doppelt so viel wie im Mittel.'])

# ----------------------------------------------- was in Klasse 12 kommt ----
Q.q(r'Welche Lernbereiche stehen in Klasse 12 an?',
    [r'Vektorrechnung, Differenzialrechnung, Integralrechnung und weitere Funktionsklassen',
     r'nur Stochastik', r'nur Vektorrechnung', r'dieselben wie in Klasse 11'],
    [r'Klasse 12 beginnt mit der Vektorrechnung bei geometrischen Problemen.',
     r'Danach folgen Differenzialrechnung, Integralrechnung und gebrochenrationale sowie e-Funktionen.',
     r'Die Stochastik aus Klasse 11 wird nicht fortgesetzt, bleibt aber prüfungsrelevant.'])

Q.q(r'Womit schließt die Klasse 12 ab?',
    [r'mit der schriftlichen Prüfung zur Fachhochschulreife', r'mit einer Klassenarbeit',
     r'mit einer Projektarbeit', r'mit einem Praktikumsbericht'],
    [r'Am Ende der Klasse 12 steht die Prüfung zur Fachhochschulreife.',
     r'Mathematik wird dabei schriftlich geprüft.',
     r'Die Inhalte beider Jahre können vorkommen.'])

Q.q(r'Welches Hilfsmittel ist laut Lehrplan in Klasse 12 vorgesehen?',
    [r'der grafikfähige Taschenrechner ohne Computeralgebrasystem',
     r'ein Computeralgebrasystem in allen Aufgaben',
     r'gar kein Hilfsmittel',
     r'nur ein einfacher Taschenrechner'],
    [r'Der Lehrplan nennt durchgehend „GTR ohne CAS“.',
     r'Der Rechner darf also Graphen zeichnen und numerisch lösen, aber nicht symbolisch umformen.',
     r'Nur im Wahlbereich ist ein Computeralgebrasystem ausdrücklich vorgesehen.'])

Q.q(r'Welcher Stoff aus Klasse 11 wird in Klasse 12 am unmittelbarsten gebraucht?',
    [r'das Untersuchen ganzrationaler Funktionen und das Lösen von Gleichungen',
     r'die Abzählprobleme', r'die Bernoulli-Ketten', r'das Urnenmodell'],
    [r'Die Differenzialrechnung untersucht ganzrationale Funktionen weiter.',
     r'Nullstellen, Linearfaktoren und das Verhalten im Unendlichen sind dort Alltag.',
     r'Auch das sichere Lösen von Gleichungen wird ständig gebraucht.'])

Q.q(r'Wie lässt sich der Übergang in Klasse 12 gut vorbereiten?',
    [r'indem man Termumformungen und das Lösen von Gleichungen sicher beherrscht',
     r'indem man die Stochastik vergisst',
     r'indem man alle Formeln auswendig lernt',
     r'indem man nur mit dem Rechner arbeitet'],
    [r'In der Analysis steckt in fast jeder Aufgabe eine Gleichung, die gelöst werden muss.',
     r'Wer dort sicher ist, kann sich auf das Neue konzentrieren.',
     r'Formeln stehen in der Formelsammlung, die Umformungen müssen im Kopf sitzen.'])

Q.q(r'Die Ableitung von $f(x) = x^2$ ist $f^{\prime}(x) = 2x$, die von $f(x) = x^3$ ist $f^{\prime}(x) = 3x^2$. Wie lautet vermutlich die Ableitung von $f(x) = x^4$?',
    [r'$f^{\prime}(x) = 4x^3$', r'$f^{\prime}(x) = 4x^4$', r'$f^{\prime}(x) = x^3$', r'$f^{\prime}(x) = 3x^4$'],
    [r'Das Muster: der Exponent wandert als Faktor nach vorn und wird um $1$ kleiner.',
     r'Aus $x^4$ wird also $4x^3$.',
     r'Diese Regel heißt Potenzregel und ist das erste Werkzeug der Differenzialrechnung.'])


def check():
    from fractions import Fraction as F
    from math import isqrt
    import sympy as sp
    x, t = sp.symbols('x t')
    n2 = lambda *c: sum(v * v for v in c)
    assert isqrt(n2(2, 3, 6)) == 7 and n2(2, 3, 6) == 49
    assert (4 - 1, 4 - 0, 2 - 2) == (3, 4, 0) and isqrt(n2(3, 4, 0)) == 5
    assert (1 + 3, 2 - 1, 0 + 5) == (4, 1, 5)
    # Aenderungsraten
    f = x ** 2
    assert F(int(f.subs(x, 4)) - int(f.subs(x, 1)), 4 - 1) == 5
    assert F(int(f.subs(x, 3)) - int(f.subs(x, 2)), 3 - 2) == 5
    assert sp.diff(f, x) == 2 * x and sp.diff(f, x).subs(x, 3) == 6 and f.subs(x, 3) == 9
    s = 5 * t ** 2
    assert s.subs(t, 4) == 80 and F(80, 4) == 20
    assert sp.diff(s, t) == 10 * t and sp.diff(s, t).subs(t, 4) == 40 and 40 == 2 * 20
    # Potenzregel
    assert sp.diff(x ** 3, x) == 3 * x ** 2 and sp.diff(x ** 4, x) == 4 * x ** 3


Q.verify(check)
Q.save()

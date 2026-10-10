#!/usr/bin/env python3
"""Exercises GY Mathe 11 LK, week 34 / KW 20 (LB 4): stochastic independence of events and of random variables -
11 questions of the Grundkurs sheet mathegy11/w32, 9 new ones (criterion P_B(A) = P(A), random variables,
complements, drawing without replacement, medical test). Plan: HTML/svp/mathe/mathegy11lk.html."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..')); sys.path.insert(0, HERE)
from quiz import gy11lk
from _reuse import harvest

Q = gy11lk(nr=34, slug='unabhaengigkeit', thema='Stochastische Unabhängigkeit', lb='LB 4',
           blurb='Unabhängigkeit von Ereignissen und Zufallsgrößen, Kriterium P_B(A) = P(A), Abgrenzung zu unvereinbar',
           comment='Questions 1-11 from the Grundkurs sheet (mathegy11/w32), 12-20 Leistungskurs.')

qs, check_gk = harvest('w32-vierfeldertafel.py', [5, 6, 7, 8, 9, 10, 11, 12, 13, 16, 18])
for a, k in qs:
    Q.q(*a, **k)

# ------------------------------------------------------------ Leistungskurs ----
Q.q(r'Es gilt $P(A) = 0{,}3$ und $P_B(A) = 0{,}3$. Was folgt?',
    [r'$A$ und $B$ sind unabhängig.', r'$A$ und $B$ sind unvereinbar.', r'$B$ ist das Gegenereignis von $A$.', r'$P(B) = 0{,}3$'],
    [r'Unabhängig heißt: Das Eintreten von $B$ ändert die Wahrscheinlichkeit von $A$ nicht.',
     r'$P_B(A) = P(A) \Leftrightarrow P(A \cap B) = P(A) \cdot P(B)$ (für $P(B) > 0$).'])

Q.q(r'Es gilt $P(A) = 0{,}5$ und $P_B(A) = 0{,}8$. Was folgt?',
    [r'$A$ und $B$ sind abhängig; unter $B$ wird $A$ wahrscheinlicher.', r'$A$ und $B$ sind unabhängig.',
     r'$A$ und $B$ sind unvereinbar.', r'$P(A \cap B) = 0{,}4$'],
    [r'$P_B(A) \neq P(A)$.',
     r'Für $P(A \cap B)$ fehlt noch $P(B)$.'])

Q.q(r'Von 200 Personen sind 120 Frauen, 80 tragen eine Brille, 50 Frauen tragen eine Brille. Vergleiche $P_{\text{Frau}}(\text{Brille})$ mit $P(\text{Brille})$.',
    [r'$0{,}417 \neq 0{,}4$: schwach abhängig', r'beide 0,4: unabhängig', r'$0{,}625 \neq 0{,}4$: stark abhängig', r'Man kann es nicht vergleichen.'],
    [r'$P_{\text{Frau}}(\text{Brille}) = \tfrac{50}{120} \approx 0{,}417$, $P(\text{Brille}) = \tfrac{80}{200} = 0{,}4$.',
     r'Bei echten Daten entscheidet man, ob die kleine Abweichung zufällig sein kann.'])

Q.q(r'Wann heißen zwei Zufallsgrößen $X$ und $Y$ unabhängig?',
    [r'wenn $P(X = x \wedge Y = y) = P(X = x) \cdot P(Y = y)$ für alle Werte $x$, $y$ gilt', r'wenn $X$ und $Y$ verschiedene Werte haben',
     r'wenn $E(X) = E(Y)$ ist', r'wenn $X + Y$ konstant ist'],
    [r'Jedes Ereignis über $X$ ist von jedem Ereignis über $Y$ unabhängig.',
     r'Beispiel: die Augenzahlen zweier getrennt geworfener Würfel.'])

Q.q(r'Zwei Würfel: $X$ ist die Augenzahl des ersten Würfels, $S$ die Augensumme. Sind $X$ und $S$ unabhängig?',
    [r'Nein, $P(X = 1 \wedge S = 12) = 0$, aber $P(X = 1) \cdot P(S = 12) = \tfrac{1}{6} \cdot \tfrac{1}{36} > 0$.', r'Ja, die Würfel sind unabhängig.',
     r'Ja, weil $S$ mehr Werte hat als $X$.', r'Man kann es nicht entscheiden.'],
    [r'$S$ enthält $X$ als Summanden.',
     r'Ein einziges Gegenbeispiel genügt.'])

Q.q(r'Sind $A$ und sein Gegenereignis $\overline{A}$ unabhängig (mit $0 < P(A) < 1$)?',
    [r'Nein, $P(A \cap \overline{A}) = 0$, aber $P(A) \cdot P(\overline{A}) > 0$.', r'Ja, immer.',
     r'Nur für $P(A) = 0{,}5$.', r'Ja, weil sie unvereinbar sind.'],
    [r'Weiß man, dass $\overline{A}$ eingetreten ist, ist $A$ sicher nicht eingetreten.'])

Q.q(r'$A$ und $B$ sind unabhängig. Was gilt für $A$ und $\overline{B}$?',
    [r'Sie sind ebenfalls unabhängig.', r'Sie sind unvereinbar.', r'Sie sind abhängig.', r'Das hängt von den Zahlen ab.'],
    [r'$P(A \cap \overline{B}) = P(A) - P(A \cap B) = P(A) - P(A)P(B) = P(A)\,(1 - P(B))$.',
     r'Also $P(A \cap \overline{B}) = P(A) \cdot P(\overline{B})$.'])

Q.q(r'Urne mit 3 roten und 2 blauen Kugeln, zweimal ohne Zurücklegen. $A$: erste Kugel rot, $B$: zweite Kugel rot. Sind $A$ und $B$ unabhängig?',
    [r'Nein, $P(B) = \tfrac{3}{5}$, aber $P_A(B) = \tfrac{1}{2}$.', r'Ja, beide haben die Wahrscheinlichkeit $\tfrac{3}{5}$.',
     r'Ja, weil die Kugeln gemischt sind.', r'Nein, weil $P(B) = 0$ ist.'],
    [r'$P(B) = \tfrac{3}{5} \cdot \tfrac{2}{4} + \tfrac{2}{5} \cdot \tfrac{3}{4} = \tfrac{3}{5}$.',
     r'Mit Zurücklegen wären die Züge unabhängig.'])

Q.q(r'Wären die Ereignisse „krank“ und „Test positiv“ unabhängig, was hieße das?',
    [r'Der Test wäre wertlos: Ein positiver Befund änderte die Wahrscheinlichkeit, krank zu sein, nicht.', r'Der Test wäre perfekt.',
     r'Alle Getesteten wären krank.', r'Der Test fiele nie positiv aus.'],
    [r'$P_{\text{positiv}}(\text{krank}) = P(\text{krank})$.',
     r'Ein brauchbarer Test macht die beiden Ereignisse gerade abhängig.'])


def check():
    from fractions import Fraction as F
    check_gk()
    assert abs(50 / 120 - 0.417) < 0.0005 and 80 / 200 == 0.4
    assert sum(1 for a in range(1, 7) for b in range(1, 7) if a == 1 and a + b == 12) == 0 and F(1, 6) * F(1, 36) > 0
    pa, pb = F(3, 10), F(1, 2)
    assert pa - pa * pb == pa * (1 - pb)
    pB = F(3, 5) * F(2, 4) + F(2, 5) * F(3, 4)
    assert pB == F(3, 5) and F(2, 4) != pB


Q.verify(check)
Q.save()

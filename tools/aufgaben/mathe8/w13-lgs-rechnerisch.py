#!/usr/bin/env python3
"""Aufgaben OS Mathe 8 (Realschule), Woche 13 / KW 48 (LB 2): lineare Gleichungssysteme
rechnerisch lösen - Gleichsetzungs-, Einsetzungs-, Additionsverfahren. Plan: HTML/svp/mathe/mathe8.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os8

Q = os8(nr=13, slug='lgs-rechnerisch', thema='Gleichungssysteme rechnerisch lösen', lb='LB 2',
        blurb='Gleichsetzungs-, Einsetzungs- und Additionsverfahren, Probe, Sachaufgaben',
        comment='Blocks: the three methods (1-8, 12, 19), check and special cases (9-11), word problems (13-18, 20).')

# --------------------------------------------------------------- Verfahren ----
Q.q(r'Löse mit dem Gleichsetzungsverfahren: $y = 2x + 3$ und $y = -x + 9$.',
    [r'$x = 2$, $y = 7$', r'$x = 4$, $y = 11$', r'$x = 2$, $y = 5$', r'$x = -2$, $y = -1$'],
    [r'Gleichsetzen: $2x + 3 = -x + 9$',
     r'$3x = 6$, also $x = 2$.',
     r'$y = 2 \cdot 2 + 3 = 7$'])

Q.q(r'Löse mit dem Einsetzungsverfahren: $y = 3x$ und $x + y = 20$.',
    [r'$x = 5$, $y = 15$', r'$x = 15$, $y = 5$', r'$x = 4$, $y = 16$', r'$x = 10$, $y = 10$'],
    [r'$y = 3x$ in die zweite Gleichung einsetzen: $x + 3x = 20$.',
     r'$4x = 20$, $x = 5$',
     r'$y = 3 \cdot 5 = 15$'])

Q.q(r'Löse mit dem Additionsverfahren: $x + y = 10$ und $x - y = 2$.',
    [r'$x = 6$, $y = 4$', r'$x = 4$, $y = 6$', r'$x = 5$, $y = 5$', r'$x = 12$, $y = -2$'],
    [r'Beide Gleichungen addieren: $2x = 12$, also $x = 6$.',
     r'$y = 10 - 6 = 4$'])

Q.q(r'Löse: $2x + 3y = 12$ und $2x - y = 4$.',
    [r'$x = 3$, $y = 2$', r'$x = 2$, $y = 3$', r'$x = 4$, $y = 4$', r'$x = 6$, $y = 0$'],
    [r'Zweite von der ersten subtrahieren: $4y = 8$, also $y = 2$.',
     r'$2x - 2 = 4$, also $x = 3$.',
     r'Probe: $6 + 6 = 12$ und $6 - 2 = 4$'])

Q.q(r'Welches Verfahren bietet sich bei $y = 4x - 1$ und $y = 2x + 5$ an?',
    [r'das Gleichsetzungsverfahren', r'das Additionsverfahren mit Multiplikation', r'nur das zeichnerische Verfahren', r'gar keines, das System ist unlösbar'],
    [r'Beide Gleichungen sind schon nach $y$ aufgelöst.',
     r'Gleichsetzen: $4x - 1 = 2x + 5$, also $x = 3$ und $y = 11$.'])

Q.q(r'Löse: $x = 2y$ und $3x + y = 14$.',
    [r'$x = 4$, $y = 2$', r'$x = 2$, $y = 4$', r'$x = 2$, $y = 1$', r'$x = 7$, $y = 3{,}5$'],
    [r'Einsetzen: $3 \cdot 2y + y = 14$, also $7y = 14$.',
     r'$y = 2$, $x = 2 \cdot 2 = 4$'])

Q.q(r'Gegeben: $3x + 2y = 16$ und $x - y = 2$. Mit welcher Zahl multiplizierst du die zweite Gleichung, damit $y$ beim Addieren wegfällt?',
    [r'mit 2', r'mit 3', r'mit −2', r'mit −3'],
    [r'In der ersten Gleichung steht $+2y$, in der zweiten $-y$.',
     r'Mal 2 ergibt $2x - 2y = 4$; beim Addieren heben sich $+2y$ und $-2y$ auf.'])

Q.q(r'Löse: $3x + 2y = 16$ und $x - y = 2$.',
    [r'$x = 4$, $y = 2$', r'$x = 2$, $y = 4$', r'$x = 5$, $y = 0{,}5$', r'$x = 6$, $y = 4$'],
    [r'Zweite Gleichung mal 2: $2x - 2y = 4$',
     r'Addieren: $5x = 20$, also $x = 4$.',
     r'$y = x - 2 = 2$'])

# ------------------------------------------------------ Probe und Sonderfälle ----
Q.q(r'Welches Zahlenpaar löst $2x + y = 5$ und $x - 3y = 6$?',
    [r'$x = 3$, $y = -1$', r'$x = -1$, $y = 3$', r'$x = 2$, $y = 1$', r'$x = 6$, $y = 0$'],
    [r'Probe mit $(3 \mid -1)$: $6 - 1 = 5$ und $3 + 3 = 6$, beide stimmen.',
     r'$(2 \mid 1)$ erfüllt nur die erste, $(6 \mid 0)$ nur die zweite Gleichung.'])

Q.q(r'Beim rechnerischen Lösen eines Systems erhältst du am Ende $0 = 2$. Was bedeutet das?',
    [r'Das System hat keine Lösung.', r'Das System hat unendlich viele Lösungen.',
     r'Die Lösung ist $x = 0$ und $y = 2$.', r'Du hast dich sicher verrechnet.'],
    [r'Die Variablen sind verschwunden und es bleibt eine falsche Aussage.',
     r'Kein Zahlenpaar erfüllt beide Gleichungen: Die Geraden sind parallel.'])

Q.q(r'Beim Lösen bleibt am Ende $0 = 0$ stehen. Was bedeutet das?',
    [r'Das System hat unendlich viele Lösungen.', r'Das System hat keine Lösung.',
     r'Die Lösung ist $x = 0$ und $y = 0$.', r'Das System hat genau eine Lösung.'],
    [r'Es bleibt eine immer wahre Aussage.',
     r'Beide Gleichungen beschreiben dieselbe Gerade.'])

Q.q(r'Löse: $y = 0{,}5x + 1$ und $y = 2x - 5$.',
    [r'$x = 4$, $y = 3$', r'$x = 3$, $y = 4$', r'$x = 2$, $y = -1$', r'$x = -4$, $y = -1$'],
    [r'$0{,}5x + 1 = 2x - 5$',
     r'$6 = 1{,}5x$, also $x = 4$.',
     r'$y = 0{,}5 \cdot 4 + 1 = 3$'])

# --------------------------------------------------------------- Sachaufgaben ----
Q.q(r'3 kg Äpfel und 2 kg Birnen kosten 9,20 €, 1 kg Äpfel und 2 kg Birnen kosten 5,60 €. Was kostet 1 kg Äpfel?',
    [r'1,80 €', r'1,90 €', r'3,60 €', r'2,30 €'],
    [r'$3a + 2b = 9{,}20$ und $a + 2b = 5{,}60$',
     r'Subtrahieren: $2a = 3{,}60$',
     r'$a = 1{,}80$'])

Q.q(r'Was kostet in der vorigen Aufgabe 1 kg Birnen (1 kg Äpfel kostet 1,80 €, $a + 2b = 5{,}60$)?',
    [r'1,90 €', r'1,80 €', r'3,80 €', r'2,80 €'],
    [r'$1{,}80 + 2b = 5{,}60$',
     r'$2b = 3{,}80$, also $b = 1{,}90$.'])

Q.q(r'Eine Zahl ist um 5 größer als eine andere. Zusammen ergeben sie 31. Wie heißen die Zahlen?',
    [r'13 und 18', r'12 und 19', r'5 und 26', r'15,5 und 15,5'],
    [r'$x + y = 31$ und $y = x + 5$',
     r'Einsetzen: $2x + 5 = 31$, also $x = 13$ und $y = 18$.'])

Q.q(r'Ein Rechteck hat den Umfang 30 cm. Die Länge ist doppelt so groß wie die Breite. Wie lang sind die Seiten?',
    [r'Breite 5 cm, Länge 10 cm', r'Breite 10 cm, Länge 20 cm', r'Breite 7,5 cm, Länge 15 cm', r'Breite 6 cm, Länge 9 cm'],
    [r'$2l + 2b = 30$ und $l = 2b$',
     r'Einsetzen: $4b + 2b = 30$, also $b = 5$.',
     r'$l = 10$'])

Q.q(r'In einer Spardose liegen 20 Münzen, nur 1-€- und 2-€-Münzen, zusammen 32 €. Wie viele 2-€-Münzen sind es?',
    [r'12', r'8', r'16', r'10'],
    [r'$x + y = 20$ und $2x + y = 32$ ($x$: 2-€-Münzen)',
     r'Subtrahieren: $x = 12$',
     r'Dazu $y = 8$ Münzen zu 1 €; Probe: $24 + 8 = 32$'])

Q.q(r'Ein Café mischt Kaffee zu 12 € pro kg und zu 18 € pro kg zu 10 kg einer Mischung, die 14,40 € pro kg kosten soll. Wie viel kg der billigeren Sorte braucht es?',
    [r'6 kg', r'4 kg', r'5 kg', r'7,2 kg'],
    [r'$x + y = 10$ und $12x + 18y = 144$',
     r'$y = 10 - x$ einsetzen: $12x + 180 - 18x = 144$',
     r'$-6x = -36$, also $x = 6$ kg und $y = 4$ kg.'])

Q.q(r'Gegeben: $4x + 3y = 18$ und $4x - y = 2$. Welche Gleichung entsteht, wenn du die zweite von der ersten subtrahierst?',
    [r'$4y = 16$', r'$2y = 16$', r'$4y = 20$', r'$8x + 2y = 20$'],
    [r'$4x - 4x = 0$, $3y - (-y) = 4y$, $18 - 2 = 16$',
     r'Also $4y = 16$, $y = 4$ und $x = 1{,}5$.'])

Q.q(r'Ein Vater ist 28 Jahre älter als sein Sohn. In 4 Jahren ist er dreimal so alt wie der Sohn. Wie alt ist der Sohn heute?',
    [r'10 Jahre', r'14 Jahre', r'8 Jahre', r'12 Jahre'],
    [r'$v = s + 28$ und $v + 4 = 3 \cdot (s + 4)$',
     r'Einsetzen: $s + 32 = 3s + 12$, also $2s = 20$.',
     r'$s = 10$, $v = 38$. Probe: in 4 Jahren 42 und 14.'])


def check():
    import sympy as sp
    x, y = sp.symbols('x y')
    S = lambda a, b: sp.solve((a, b), (x, y), dict=True)
    one = lambda a, b, sx, sy: S(a, b) == [{x: sx, y: sy}]
    assert one(y - 2*x - 3, y + x - 9, 2, 7)
    assert one(y - 3*x, x + y - 20, 5, 15)
    assert one(x + y - 10, x - y - 2, 6, 4)
    assert one(2*x + 3*y - 12, 2*x - y - 4, 3, 2)
    assert one(y - 4*x + 1, y - 2*x - 5, 3, 11)
    assert one(x - 2*y, 3*x + y - 14, 4, 2)
    assert one(3*x + 2*y - 16, x - y - 2, 4, 2)
    assert one(2*x + y - 5, x - 3*y - 6, 3, -1) and 2*2 + 1 == 5 and 2 - 3 != 6
    assert S(x + y - 3, 2*x + 2*y - 8) == []
    assert one(y - x / 2 - 1, y - 2*x + 5, 4, 3)
    R = sp.Rational
    assert one(3*x + 2*y - R(92, 10), x + 2*y - R(56, 10), R(18, 10), R(19, 10))
    assert one(x + y - 31, y - x - 5, 13, 18)
    assert one(2*x + 2*y - 30, x - 2*y, 10, 5)
    assert one(x + y - 20, 2*x + y - 32, 12, 8)
    assert one(x + y - 10, 12*x + 18*y - R(144), 6, 4) and R(144) == R(1440, 100) * 10
    assert one(4*x + 3*y - 18, 4*x - y - 2, R(3, 2), 4)
    assert one(x - y - 28, x + 4 - 3*(y + 4), 38, 10)


Q.verify(check)
Q.save()

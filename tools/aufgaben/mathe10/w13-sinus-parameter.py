#!/usr/bin/env python3
"""Aufgaben OS Mathe 10 (Realschule), Woche 13 / KW 48 (LB 2): y = a · sin(b · x), Amplitude
und Periode, Sachbezüge, Funktionen systematisieren. Plan: HTML/svp/mathe/mathe10.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os10

Q = os10(nr=13, slug='sinus-parameter', thema='Parameter der Sinusfunktion und Systematik', lb='LB 2',
         blurb='Amplitude und Periode, Wechselstrom und Schwingungen, Funktionstypen unterscheiden',
         comment='Blocks: amplitude (1, 4-6, 8), period (2-3, 7, 9, 19), values (17-18), context (10-12, 20), function types (13-16).')

Q.q(r'Welche Amplitude hat $y = 3 \sin x$?',
    [r'3', r'1', r'$\dfrac{1}{3}$', r'$2\pi$'],
    [r'Der Faktor vor dem Sinus streckt in y-Richtung.', r'Die Werte schwanken zwischen $-3$ und 3: Amplitude 3.'])

Q.q(r'Welche Periode hat $y = \sin(2x)$?',
    [r'$\pi$', r'$2\pi$', r'$4\pi$', r'2'],
    [r'Periode $= \dfrac{2\pi}{b} = \dfrac{2\pi}{2} = \pi$', r'Der Graph schwingt doppelt so schnell wie $\sin x$.'])

Q.q(r'Welche Periode hat $y = \sin(0{,}5x)$?',
    [r'$4\pi$', r'$\pi$', r'$2\pi$', r'0,5'],
    [r'Periode $= \dfrac{2\pi}{0{,}5} = 4\pi$', r'Der Graph wird in x-Richtung auf das Doppelte gedehnt.'])

Q.q(r'Wie unterscheidet sich $y = -2 \sin x$ von $y = \sin x$?',
    [r'Amplitude 2 und an der x-Achse gespiegelt', r'Periode halbiert', r'um 2 nach unten verschoben', r'Amplitude $-2$, sonst gleich'],
    [r'Der Betrag des Faktors (2) ist die Amplitude.', r'Das Minuszeichen spiegelt den Graphen an der x-Achse: er beginnt bei 0 mit einem Tal statt mit einem Berg.'])

Q.q(r'Welche Werte nimmt $y = 4 \sin x$ an?',
    [r'alle Zahlen von $-4$ bis 4', r'alle Zahlen von 0 bis 4', r'alle Zahlen von $-1$ bis 1', r'nur 4 und $-4$'],
    [r'$\sin x$ liegt zwischen $-1$ und 1, mal 4 also zwischen $-4$ und 4.'])

Q.q(r'Welchen größten Wert hat $y = 2 \sin(3x)$?',
    [r'2', r'3', r'6', r'1'],
    [r'Der Faktor $b = 3$ ändert nur die Periode, nicht die Höhe.', r'Größter Wert: $2 \cdot 1 = 2$.'])

Q.q(r'Wie berechnet man die Periode $p$ von $y = a \sin(b x)$ für $b > 0$?',
    [r'$p = \dfrac{2\pi}{b}$', r'$p = 2\pi b$', r'$p = \dfrac{2\pi}{a}$', r'$p = \dfrac{b}{2\pi}$'],
    [r'Eine volle Schwingung ist erreicht, wenn $b x = 2\pi$ ist.', r'Also $x = \dfrac{2\pi}{b}$.'])

Q.q(r'Ein Sinusgraph schwankt zwischen $-1{,}5$ und $1{,}5$. Wie groß ist $a$ in $y = a \sin x$ (mit $a > 0$)?',
    [r'1,5', r'3', r'0,75', r'$-1{,}5$'],
    [r'Die Amplitude ist der Abstand von der Mittellinie zum Hochpunkt: $a = 1{,}5$.', r'3 ist der Abstand von ganz unten bis ganz oben.'])

Q.q(r'Ein Graph $y = \sin(b x)$ hat die Nullstellen $0$, $\dfrac{\pi}{2}$, $\pi$, … Wie groß ist $b$?',
    [r'2', r'0,5', r'$\pi$', r'4'],
    [r'Zwischen zwei Nullstellen liegt eine halbe Periode: $\dfrac{\pi}{2}$. Die Periode ist also $\pi$.', r'$\dfrac{2\pi}{b} = \pi$ ergibt $b = 2$.'])

Q.q(r'Der Wechselstrom im Haushalt hat 50 Hz (50 Schwingungen pro Sekunde). Wie lange dauert eine Periode?',
    [r'0,02 s', r'50 s', r'0,5 s', r'2 s'],
    [r'$\dfrac{1 \text{ s}}{50} = 0{,}02$ s'])

Q.q(r'Die Netzspannung lässt sich durch $U(t) = 325 \cdot \sin(100\pi \cdot t)$ beschreiben ($U$ in V, $t$ in s). Wie groß ist die Höchstspannung?',
    [r'325 V', r'230 V', r'100 V', r'650 V'],
    [r'Die Amplitude ist der Faktor vor dem Sinus: 325 V.', r'Die bekannten 230 V sind ein Mittelwert (Effektivwert), nicht der Höchstwert.'])

Q.q(r'Welche Periode hat $U(t) = 325 \cdot \sin(100\pi \cdot t)$?',
    [r'0,02 s', r'100 s', r'0,01 s', r'$2\pi$ s'],
    [r'$p = \dfrac{2\pi}{100\pi} = \dfrac{1}{50} = 0{,}02$ s – passend zu 50 Hz.'])

Q.q(r'Welche Funktion ist periodisch?',
    [r'$y = \sin x$', r'$y = x^2$', r'$y = 2^x$', r'$y = 3x - 2$'],
    [r'Nur beim Sinus wiederholen sich die Werte in festen Abständen.'])

Q.q(r'Welcher Funktionstyp beschreibt das Wachstum eines Sparguthabens mit Zinseszins?',
    [r'Exponentialfunktion', r'lineare Funktion', r'quadratische Funktion', r'Sinusfunktion'],
    [r'Jedes Jahr wird mit demselben Faktor multipliziert: $K(n) = K_0 \cdot q^n$.'])

Q.q(r'Welcher Graph ist eine Gerade?',
    [r'$y = 3x - 2$', r'$y = 3x^2$', r'$y = 3^x$', r'$y = \dfrac{3}{x}$'],
    [r'Lineare Funktionen $y = m x + n$ haben Geraden als Graphen.'])

Q.q(r'Welche Funktion hat eine Parabel mit Scheitelpunkt $(0 \mid -4)$ als Graphen?',
    [r'$y = x^2 - 4$', r'$y = (x - 4)^2$', r'$y = -4x$', r'$y = 4^x$'],
    [r'$y = x^2 - 4$ ist die Normalparabel, um 4 nach unten verschoben.', r'$(x - 4)^2$ hätte den Scheitel bei $(4 \mid 0)$.'])

Q.q(r'Berechne $y = 2 \sin x$ für $x = \dfrac{\pi}{6}$.',
    [r'1', r'2', r'0,5', r'0,26'],
    [r'$\dfrac{\pi}{6}$ entspricht $30^\circ$, und $\sin 30^\circ = 0{,}5$.', r'$2 \cdot 0{,}5 = 1$'])

Q.q(r'Berechne $y = \sin(2x)$ für $x = \dfrac{\pi}{4}$.',
    [r'1', r'0,5', r'0,707', r'2'],
    [r'$2 \cdot \dfrac{\pi}{4} = \dfrac{\pi}{2}$', r'$\sin \dfrac{\pi}{2} = 1$'])

Q.q(r'Welche Nullstellen hat $y = \sin(2x)$ im Intervall $0 \leq x \leq \pi$?',
    [r'$0$, $\dfrac{\pi}{2}$ und $\pi$', r'nur $0$ und $\pi$', r'$\dfrac{\pi}{4}$ und $\dfrac{3\pi}{4}$', r'$0$, $\pi$ und $2\pi$'],
    [r'$\sin(2x) = 0$ für $2x = 0$, $\pi$, $2\pi$.', r'Also $x = 0$, $\dfrac{\pi}{2}$, $\pi$.'])

Q.q(r'Eine Schaukel schwingt mit einem größten Ausschlag von 1,2 m, eine volle Schwingung dauert 4 s. Welche Gleichung passt ($t$ in s)?',
    [r'$s(t) = 1{,}2 \cdot \sin\left(\dfrac{\pi}{2} t\right)$', r'$s(t) = 4 \cdot \sin(1{,}2\, t)$',
     r'$s(t) = 1{,}2 \cdot \sin(4t)$', r'$s(t) = 1{,}2 \cdot \sin(2\pi t)$'],
    [r'Amplitude $a = 1{,}2$.', r'Periode 4: $\dfrac{2\pi}{b} = 4$, also $b = \dfrac{\pi}{2}$.'])


def check():
    from math import sin, pi
    R = lambda x, n=3: round(x, n)
    assert R(2 * pi / 2) == R(pi) and R(2 * pi / 0.5) == R(4 * pi)
    assert max(R(-2 * sin(x / 10)) for x in range(0, 63)) == 2
    assert R(max(2 * sin(3 * x / 100) for x in range(0, 300)), 2) == 2.0
    assert R(sin(2 * pi / 2)) == 0 and R(sin(2 * pi / 4)) == 1
    assert 1 / 50 == 0.02 and R(2 * pi / (100 * pi)) == 0.02
    assert R(2 * sin(pi / 6)) == 1 and R(sin(2 * pi / 4)) == 1
    assert all(abs(sin(2 * x)) < 1e-9 for x in (0, pi / 2, pi))
    assert R(2 * pi / (pi / 2)) == 4


Q.verify(check)
Q.save()

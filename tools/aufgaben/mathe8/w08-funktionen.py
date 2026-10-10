#!/usr/bin/env python3
"""Aufgaben OS Mathe 8 (Realschule), Woche 8 / KW 41 (LB 2): Funktion als eindeutige
Zuordnung, Argument, Funktionswert, Definitions- und Wertebereich. Plan: HTML/svp/mathe/mathe8.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os8

Q = os8(nr=8, slug='funktionen', thema='Funktionen', lb='LB 2',
        blurb='Eindeutige Zuordnung, Argument und Funktionswert, Definitions- und Wertebereich',
        comment='Blocks: function or not (1-3, 11, 20), terms argument and value (4-6, 12-14), domain and range (7-10, 19), context (15-18).')

# ------------------------------------------------------ Funktion oder nicht ----
Q.q(r'Welche Zuordnung ist eine Funktion?',
    [r'Jeder Person wird ihr Geburtsjahr zugeordnet.',
     r'Jedem Geburtsjahr werden die Personen zugeordnet, die in diesem Jahr geboren sind.',
     r'Jeder natürlichen Zahl werden ihre Teiler zugeordnet.',
     r'Jeder Postleitzahl werden die Straßen mit dieser Postleitzahl zugeordnet.'],
    [r'Eine Funktion ordnet jedem Element genau ein Element zu.',
     r'Jede Person hat genau ein Geburtsjahr.',
     r'Zu einem Jahr gehören viele Personen, zu 12 gehören die Teiler 1, 2, 3, 4, 6 und 12, zu einer Postleitzahl viele Straßen.'])

Q.q(r'Was bedeutet „eindeutig“ bei einer Funktion?',
    [r'Jedem Argument wird genau ein Funktionswert zugeordnet.',
     r'Jeder Funktionswert kommt genau einmal vor.',
     r'Alle Funktionswerte sind positiv.',
     r'Der Graph ist eine Gerade.'],
    [r'Eindeutig heißt: Zu jedem $x$ gibt es genau ein $y$.',
     r'Derselbe Funktionswert darf aber mehrmals vorkommen, z. B. bei $f(x) = x^2$: $f(-2) = f(2) = 4$.'])

Q.q(r'Welche Wertetabelle gehört zu keiner Funktion?',
    [r'x: 1, 2, 3, 2 und y: 4, 5, 6, 7', r'x: 1, 2, 3, 4 und y: 5, 5, 5, 5',
     r'x: −1, 0, 1, 2 und y: 1, 0, 1, 4', r'x: 1, 2, 3, 4 und y: 2, 4, 6, 8'],
    [r'In der ersten Tabelle gehören zu $x = 2$ die beiden Werte 5 und 7, das ist nicht eindeutig.',
     r'Gleiche $y$-Werte für verschiedene $x$ sind erlaubt, z. B. immer 5.'])

# ------------------------------------------------- Argument, Funktionswert ----
Q.q(r'Für $f(x) = 2x + 1$ gilt $f(3) = 7$. Wie heißen die Zahlen 3 und 7?',
    [r'3 ist das Argument, 7 ist der Funktionswert.', r'3 ist der Funktionswert, 7 ist das Argument.',
     r'3 ist die Steigung, 7 ist der Achsenabschnitt.', r'Beide heißen Funktionswerte.'],
    [r'Das Argument ist die Zahl, die man für $x$ einsetzt.',
     r'Der Funktionswert ist das Ergebnis $f(x)$.'])

Q.q(r'Berechne $f(-2)$ für $f(x) = x^2 - 1$.',
    [r'3', r'−5', r'5', r'−3'],
    [r'$f(-2) = (-2)^2 - 1$',
     r'$(-2)^2 = 4$, also $f(-2) = 3$.'])

Q.q(r'Für welches Argument hat $f(x) = 3x - 2$ den Funktionswert 10?',
    [r'4', r'28', r'12', r'$\dfrac{8}{3}$'],
    [r'Gesucht: $3x - 2 = 10$',
     r'$3x = 12$, also $x = 4$.',
     r'28 wäre $f(10)$, also der Funktionswert zum Argument 10.'])

# --------------------------------------------- Definitions- und Wertebereich ----
Q.q(r'Welche Zahl gehört nicht zum Definitionsbereich von $f(x) = \dfrac{1}{x}$?',
    [r'0', r'1', r'−1', r'0,5'],
    [r'Durch 0 kann man nicht teilen.',
     r'Für alle anderen Zahlen ist $\dfrac{1}{x}$ berechenbar, z. B. $\dfrac{1}{0{,}5} = 2$.'])

Q.q(r'Die Funktion $f(x) = x^2$ ist für alle Zahlen $x$ definiert. Welche Zahlen bilden den Wertebereich?',
    [r'alle $y$ mit $y \geq 0$', r'alle Zahlen', r'alle $y$ mit $y > 0$', r'nur natürliche Zahlen'],
    [r'Ein Quadrat ist nie negativ: $(-3)^2 = 9$, $3^2 = 9$.',
     r'Der Wert 0 wird bei $x = 0$ angenommen.',
     r'Wertebereich: alle Zahlen $y \geq 0$.'])

Q.q(r'Ein Parkhaus kostet 2 € pro angefangene Stunde. Man darf höchstens 10 Stunden parken. Welcher Definitionsbereich ist für die Anzahl der Stunden sinnvoll?',
    [r'die Zahlen 1 bis 10', r'alle rationalen Zahlen', r'die Zahlen 2, 4, 6, …, 20', r'die Zahlen von −10 bis 10'],
    [r'Argumente sind die angefangenen Stunden: mindestens 1, höchstens 10.',
     r'Negative Stunden oder mehr als 10 Stunden sind nicht möglich.'])

Q.q(r'Welcher Wertebereich gehört zum Parkhaus aus der vorigen Aufgabe (2 € pro angefangene Stunde, 1 bis 10 Stunden)?',
    [r'die Beträge 2 €, 4 €, 6 €, …, 20 €', r'die Zahlen 1 bis 10', r'alle Beträge von 0 € bis 20 €', r'die Beträge 2 € bis 10 €'],
    [r'Funktionswerte sind die Preise: $2 \cdot 1 = 2$ bis $2 \cdot 10 = 20$.',
     r'Es kommen nur Vielfache von 2 € vor.'])

Q.q(r'Ein Graph enthält die Punkte $A(2 \mid 1)$ und $B(2 \mid 5)$. Kann er zu einer Funktion gehören?',
    [r'Nein, dem Argument 2 wären zwei Funktionswerte zugeordnet.',
     r'Ja, weil die Punkte verschieden sind.',
     r'Ja, wenn der Graph eine Gerade ist.',
     r'Nein, weil 5 größer als 1 ist.'],
    [r'Beide Punkte haben dieselbe $x$-Koordinate 2.',
     r'Eine senkrechte Linie bei $x = 2$ trifft den Graphen zweimal, das ist bei einer Funktion nicht erlaubt.'])

Q.q(r'„Jeder Zahl wird ihr Dreifaches, vermindert um 4, zugeordnet.“ Welche Funktionsgleichung passt?',
    [r'$f(x) = 3x - 4$', r'$f(x) = 3 \cdot (x - 4)$', r'$f(x) = 4 - 3x$', r'$f(x) = x^3 - 4$'],
    [r'Das Dreifache von $x$: $3x$',
     r'vermindert um 4: $3x - 4$'])

Q.q(r'Gegeben ist $f(x) = -2x + 3$. Welcher Funktionswert gehört zu $x = 4$?',
    [r'−5', r'11', r'−11', r'5'],
    [r'$f(4) = -2 \cdot 4 + 3$',
     r'$f(4) = -8 + 3 = -5$'])

Q.q(r'Welcher Punkt liegt auf dem Graphen von $f(x) = 2x + 1$?',
    [r'$P(3 \mid 7)$', r'$Q(7 \mid 3)$', r'$R(2 \mid 4)$', r'$S(-1 \mid 1)$'],
    [r'Prüfen: $f(3) = 7$, der Punkt $P(3 \mid 7)$ liegt also auf dem Graphen.',
     r'$f(7) = 15$, $f(2) = 5$, $f(-1) = -1$: die anderen Punkte passen nicht.'])

# --------------------------------------------------------------- Sachbezug ----
Q.q(r'Beim Füllen eines Beckens gilt für die Wasserhöhe $h(t) = 5t + 20$ (in cm, $t$ in Minuten). Wie hoch steht das Wasser nach 6 Minuten?',
    [r'50 cm', r'31 cm', r'150 cm', r'25 cm'],
    [r'$h(6) = 5 \cdot 6 + 20$',
     r'$h(6) = 30 + 20 = 50$, also 50 cm.'])

Q.q(r'Ein Brötchen kostet 0,45 €. Wie heißt die Zuordnung Anzahl der Brötchen → Preis?',
    [r'proportional', r'antiproportional', r'keine Funktion', r'weder steigend noch fallend'],
    [r'Doppelt so viele Brötchen kosten doppelt so viel.',
     r'Der Quotient Preis durch Anzahl ist immer 0,45 €: Die Zuordnung ist proportional.'])

Q.q(r'Vier Personen brauchen für eine Arbeit 6 Tage. Wie lange brauchen drei Personen bei gleichem Tempo?',
    [r'8 Tage', r'4,5 Tage', r'5 Tage', r'7 Tage'],
    [r'Weniger Personen brauchen länger: antiproportional.',
     r'Das Produkt bleibt gleich: $4 \cdot 6 = 24$ Personentage.',
     r'$24 : 3 = 8$ Tage.'])

Q.q(r'Eine 24 cm lange Kerze brennt pro Stunde 3 cm ab. Welche Funktion beschreibt die Höhe nach $x$ Stunden?',
    [r'$h(x) = 24 - 3x$', r'$h(x) = 24 + 3x$', r'$h(x) = 3x - 24$', r'$h(x) = 24 - x$'],
    [r'Start: 24 cm.',
     r'Pro Stunde werden 3 cm weniger: $-3x$.',
     r'$h(x) = 24 - 3x$'])

Q.q(r'Für welche Zeiten $x$ (in Stunden) ist die Kerzenfunktion $h(x) = 24 - 3x$ sinnvoll?',
    [r'$0 \leq x \leq 8$', r'$0 \leq x \leq 24$', r'$x \geq 0$', r'$0 \leq x \leq 3$'],
    [r'Die Kerze ist abgebrannt, wenn $h(x) = 0$ ist: $24 - 3x = 0$, also $x = 8$.',
     r'Sinnvoll sind also die Zeiten von 0 bis 8 Stunden.'])

Q.q(r'Manche Personen haben zwei Handynummern. Ist die Zuordnung Person → Handynummer dann eine Funktion?',
    [r'Nein, einer Person wären zwei Werte zugeordnet.', r'Ja, jede Nummer gehört zu einer Person.',
     r'Ja, Zuordnungen sind immer Funktionen.', r'Nein, weil Handynummern keine Zahlen sind.'],
    [r'Bei einer Funktion bekommt jedes Argument genau einen Wert.',
     r'Eine Person mit zwei Nummern verletzt die Eindeutigkeit.',
     r'Umgekehrt (Nummer → Person) wäre es eindeutig.'])


def check():
    from fractions import Fraction as F
    assert {1, 2, 3, 4, 6, 12} == {d for d in range(1, 13) if 12 % d == 0}
    xs, ys = [1, 2, 3, 2], [4, 5, 6, 7]
    assert len(set(xs)) < len(xs) and len({(a, b) for a, b in zip(xs, ys)}) == 4
    f = lambda x: 2 * x + 1
    assert f(3) == 7
    assert (-2) ** 2 - 1 == 3
    assert F(10 + 2, 3) == 4 and 3 * 10 - 2 == 28
    assert F(1) / F('0.5') == 2
    assert [2 * h for h in range(1, 11)] == list(range(2, 21, 2))
    assert -2 * 4 + 3 == -5
    assert f(3) == 7 and f(7) == 15 and f(2) == 5 and f(-1) == -1
    assert 5 * 6 + 20 == 50
    assert 4 * 6 == 24 and F(24, 3) == 8
    assert F(24, 3) == 8 and 24 - 3 * 8 == 0


Q.verify(check)
Q.save()

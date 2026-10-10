#!/usr/bin/env python3
"""Exercises GY Mathe 11 LK, week 30 / KW 16 (LB 4): approaches to probability - statistical (law of large numbers,
J. Bernoulli), classical (Laplace), axiomatic (Kolmogorow), simulation; de Mere's problem. 18 new questions with
sources in the steps, 2 on simulation from the Grundkurs sheet mathegy11/w31. Plan: HTML/svp/mathe/mathegy11lk.html."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..')); sys.path.insert(0, HERE)
from quiz import gy11lk
from _reuse import harvest

Q = gy11lk(nr=30, slug='wahrscheinlichkeitsbegriff', thema='Zugänge zum Wahrscheinlichkeitsbegriff', lb='LB 4',
           blurb='relative Häufigkeit und Gesetz der großen Zahlen, Laplace, Kolmogorow, Simulation',
           comment='New questions (sources in the steps); questions on simulation from the Grundkurs sheet mathegy11/w31.')

qs_s, check_s = harvest('w31-mehrstufig.py', [18, 19])

# ------------------------------------------------------------- statistical ----
Q.q(r'Eine Reißzwecke wird 1000-mal geworfen und landet 620-mal mit der Spitze nach oben. Welcher Schätzwert für die Wahrscheinlichkeit folgt?',
    [r'0,62', r'0,5', r'620', r'0,38'],
    [r'Statistischer Zugang: Die relative Häufigkeit $\tfrac{620}{1000}$ schätzt die Wahrscheinlichkeit.',
     r'Ein exakter Wert lässt sich hier nicht ausrechnen.'])

Q.q(r'Was besagt das Gesetz der großen Zahlen?',
    [r'Mit wachsender Versuchszahl schwankt die relative Häufigkeit immer weniger um die Wahrscheinlichkeit.',
     r'Nach vielen Misserfolgen wird ein Erfolg wahrscheinlicher.', r'Die absolute Häufigkeit wird gleich $n \cdot p$.', r'Bei vielen Versuchen treten alle Ergebnisse gleich oft auf.'],
    [r'Die relative Häufigkeit stabilisiert sich; die absolute Abweichung von $n \cdot p$ kann dabei sogar wachsen.',
     r'Quelle: Jakob Bernoulli bewies es als Erster streng, Ars Conjectandi, Teil IV, Basel 1713 (nach seinem Tod erschienen).'])

Q.q(r'Beim Roulette kam fünfmal hintereinander Rot. Ist jetzt Schwarz wahrscheinlicher?',
    [r'Nein, die Drehungen sind unabhängig; die Wahrscheinlichkeit bleibt gleich.', r'Ja, das Gesetz der großen Zahlen gleicht aus.',
     r'Ja, Schwarz ist jetzt sicher.', r'Nein, Rot ist jetzt wahrscheinlicher.'],
    [r'Der Kessel hat kein Gedächtnis.',
     r'Das Gesetz der großen Zahlen wirkt durch Verdünnen, nicht durch Ausgleichen (Spielerfehlschluss).'])

# --------------------------------------------------------------- Laplace ----
Q.q(r'Wie definiert P. S. Laplace die Wahrscheinlichkeit eines Ereignisses $A$?',
    [r'$P(A) = \dfrac{\text{Anzahl der günstigen Ergebnisse}}{\text{Anzahl der möglichen Ergebnisse}}$, wenn alle Ergebnisse gleich möglich sind',
     r'als relative Häufigkeit nach 1000 Versuchen', r'als Zahl, die drei Axiome erfüllt', r'als persönliche Einschätzung'],
    [r'Laplace-Experiment: endlich viele, gleich wahrscheinliche Ergebnisse.',
     r'Quelle: P.-S. Laplace, Essai philosophique sur les probabilités, Paris 1814.'])

Q.q(r'Bei welchem Experiment darf man NICHT nach Laplace rechnen?',
    [r'eine Reißzwecke werfen', r'eine Münze werfen', r'einen fairen Würfel werfen', r'eine Kugel aus einer gut gemischten Urne ziehen'],
    [r'Die beiden Lagen der Reißzwecke sind nicht gleich wahrscheinlich.',
     r'Hier hilft nur der statistische Zugang.'])

Q.q(r'Ein fairer Würfel wird geworfen. Wie groß ist die Wahrscheinlichkeit für eine Primzahl?',
    [r'$\dfrac{1}{2}$', r'$\dfrac{1}{3}$', r'$\dfrac{2}{3}$', r'$\dfrac{1}{6}$'],
    [r'Günstig: 2, 3, 5. Möglich: 6 Ergebnisse.'])

Q.q(r'Zwei Würfel werden geworfen. Warum nimmt man als Ergebnismenge die 36 Paare und nicht die Augensummen 2 bis 12?',
    [r'Nur die 36 Paare sind gleich wahrscheinlich; die Augensummen nicht.', r'Weil 36 eine Quadratzahl ist.',
     r'Weil die Augensumme 7 nicht vorkommen kann.', r'Das ist egal, beide Wege sind Laplace-Experimente.'],
    [r'Summe 2 hat ein Paar, Summe 7 hat sechs Paare.',
     r'Nach Laplace darf man nur bei gleich möglichen Ergebnissen zählen.'])

Q.q(r'Aus dem Wort MATHEMATIK wird zufällig ein Buchstabe gewählt. Wie wahrscheinlich ist ein M?',
    [r'0,2', r'0,1', r'0,25', r'$\dfrac{1}{8}$'],
    [r'10 Buchstaben, davon 2 M.',
     r'$\tfrac{2}{10} = 0{,}2$'])

# ------------------------------------------------------------ Kolmogorow ----
Q.q(r'Welche Aussage gehört NICHT zu den Axiomen von Kolmogorow?',
    [r'$P(A \cap B) = P(A) \cdot P(B)$', r'$P(A) \geq 0$', r'$P(\Omega) = 1$', r'$P(A \cup B) = P(A) + P(B)$ für unvereinbare $A$, $B$'],
    [r'Die Produktformel gilt nur für unabhängige Ereignisse.',
     r'Die Axiome: Nichtnegativität, Normierung, Additivität.'])

Q.q(r'Wie folgt $P(\overline{A}) = 1 - P(A)$ aus den Axiomen?',
    [r'$A$ und $\overline{A}$ sind unvereinbar mit $A \cup \overline{A} = \Omega$, also $P(A) + P(\overline{A}) = 1$.', r'Durch Messen.',
     r'Aus der Laplace-Formel.', r'Es folgt nicht, es ist ein eigenes Axiom.'],
    [r'Additivität und Normierung zusammen.'])

Q.q(r'Welche Zahl kann keine Wahrscheinlichkeit sein?',
    [r'1,2', r'0', r'1', r'0,999'],
    [r'Aus den Axiomen folgt $0 \leq P(A) \leq 1$.'])

Q.q(r'Was leistete A. N. Kolmogorow 1933?',
    [r'Er begründete die Wahrscheinlichkeitsrechnung axiomatisch: Er legte fest, welche Regeln jede Wahrscheinlichkeit erfüllen muss.',
     r'Er berechnete als Erster die Wahrscheinlichkeit beim Würfeln.', r'Er erfand das Baumdiagramm.', r'Er bewies, dass es keinen Zufall gibt.'],
    [r'Die Axiome sagen nicht, welchen Wert $P(A)$ hat, sondern wie Wahrscheinlichkeiten zusammenpassen.',
     r'Quelle: A. N. Kolmogorow, Grundbegriffe der Wahrscheinlichkeitsrechnung, Springer, Berlin 1933.'])

Q.q(r'Es gilt $P(A) = 0{,}5$, $P(B) = 0{,}4$ und $P(A \cap B) = 0{,}2$. Wie groß ist $P(A \cup B)$?',
    [r'0,7', r'0,9', r'0,2', r'1,1'],
    [r'Allgemeiner Additionssatz: $P(A \cup B) = P(A) + P(B) - P(A \cap B)$.',
     r'Die Schnittmenge würde sonst doppelt gezählt.'])

Q.q(r'Welcher Zugang liefert einen Wert für $P(\text{Sechs})$ bei einem gezinkten Würfel?',
    [r'der statistische: sehr oft werfen und die relative Häufigkeit bestimmen', r'der Laplace-Zugang: $\tfrac{1}{6}$',
     r'der axiomatische: die Axiome liefern den Wert', r'keiner'],
    [r'Beim gezinkten Würfel sind die Seiten nicht gleich wahrscheinlich.',
     r'Die Axiome sagen nur, dass alle sechs Werte zusammen 1 ergeben.'])

# ------------------------------------------------------------- simulation ----
Q.q(r'Wie simuliert man mit einer Zufallszahl $z$ aus $[0;\,1)$ ein Ereignis mit der Wahrscheinlichkeit 0,3?',
    [r'Treffer, wenn $z < 0{,}3$', r'Treffer, wenn $z = 0{,}3$', r'Treffer, wenn $z > 0{,}3$', r'Treffer, wenn $z < 0{,}7$'],
    [r'Das Intervall $[0;\,0{,}3)$ macht 30 % von $[0;\,1)$ aus.'])
for a, k in qs_s:
    Q.q(*a, **k)

Q.q(r'Welcher Befehl simuliert in einer Tabellenkalkulation einen Würfelwurf?',
    [r'=ZUFALLSBEREICH(1;6)', r'=ZUFALLSZAHL()', r'=RUNDEN(6;0)', r'=SUMME(1;6)'],
    [r'ZUFALLSBEREICH liefert eine ganze Zufallszahl zwischen den Grenzen.',
     r'ZUFALLSZAHL() liefert eine Dezimalzahl aus $[0;\,1)$.'])

Q.q(r'Eine Simulation liefert nach 100 Durchgängen den Anteil 0,47, nach 10 000 Durchgängen 0,491. Welcher Wert ist verlässlicher?',
    [r'0,491, denn bei mehr Durchgängen schwankt die relative Häufigkeit weniger.', r'0,47, weil er zuerst kam.',
     r'Beide gleich.', r'Keiner, Simulationen sind nie verlässlich.'],
    [r'Gesetz der großen Zahlen.',
     r'Der Wert passt zur nächsten Aufgabe.'])

Q.q(r'Chevalier de Méré wettete auf mindestens eine Doppelsechs in 24 Würfen mit zwei Würfeln und verlor auf Dauer. Wie groß ist die Gewinnwahrscheinlichkeit?',
    [r'$1 - \left(\tfrac{35}{36}\right)^{24} \approx 0{,}491$', r'$\tfrac{24}{36} \approx 0{,}667$', r'$\left(\tfrac{1}{36}\right)^{24}$', r'genau 0,5'],
    [r'Gegenereignis: 24-mal keine Doppelsechs, Wahrscheinlichkeit $\left(\tfrac{35}{36}\right)^{24} \approx 0{,}509$.',
     r'De Mérés Dreisatz $\tfrac{4}{6} = \tfrac{24}{36}$ (eine Sechs in vier Würfen, etwa 0,518) trägt nicht.',
     r'Quelle: Briefwechsel B. Pascal – P. de Fermat, 1654 (Brief Pascals vom 29. Juli 1654); MacTutor History of Mathematics, St Andrews.'])


def check():
    from fractions import Fraction as F
    check_s()
    assert F(620, 1000) == F(62, 100)
    assert F(3, 6) == F(1, 2)
    assert sum(1 for a in range(1, 7) for b in range(1, 7) if a + b == 7) == 6
    w = 'MATHEMATIK'
    assert len(w) == 10 and w.count('M') == 2
    assert 0.5 + 0.4 - 0.2 == 0.7 or abs(0.5 + 0.4 - 0.2 - 0.7) < 1e-12
    p = 1 - (35 / 36) ** 24
    assert abs(p - 0.491) < 0.001 and abs((35 / 36) ** 24 - 0.509) < 0.001
    assert abs(1 - (5 / 6) ** 4 - 0.518) < 0.001


Q.verify(check)
Q.save()

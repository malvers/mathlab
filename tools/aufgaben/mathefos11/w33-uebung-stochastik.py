#!/usr/bin/env python3
"""Aufgaben FO Mathe 11, Woche 33 / KW 19 (LB 2): Auswertung der Klausur und
vermischte Uebung zur Stochastik, dazu klassische Trugschluesse.
Plan: HTML/svp/mathe/mathefos11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos11

Q = fos11(nr=33, slug='uebung-stochastik', thema='Übung Stochastik', lb='Übung',
          blurb='vermischte Aufgaben, typische Fehler und klassische Trugschlüsse',
          comment='Blocks: vermischte Rechnungen (1-8), typische Fehler (9-14), klassische Trugschluesse (15-20).')

# ------------------------------------------------------- vermischte Rechnungen ----
Q.q(r'Zwei Würfel werden geworfen. Wie groß ist die Wahrscheinlichkeit, dass die Augensumme $7$ beträgt?',
    [r'$\dfrac{1}{6}$', r'$\dfrac{1}{12}$', r'$\dfrac{7}{36}$', r'$\dfrac{1}{36}$'],
    [r'Günstig sind die Paare $(1;6)$, $(2;5)$, $(3;4)$, $(4;3)$, $(5;2)$, $(6;1)$ — also sechs.',
     r'Möglich sind $6 \cdot 6 = 36$ Paare.',
     r'$P = \dfrac{6}{36} = \dfrac{1}{6}$. Die $7$ ist die häufigste Augensumme.'])

Q.q(r'Zwei Würfel: wie groß ist die Wahrscheinlichkeit für die Augensumme $12$?',
    [r'$\dfrac{1}{36}$', r'$\dfrac{1}{6}$', r'$\dfrac{1}{12}$', r'$\dfrac{2}{36}$'],
    [r'Nur das Paar $(6;6)$ ist günstig.',
     r'$P = \dfrac{1}{36}$',
     r'Deshalb sind die Augensummen nicht gleich wahrscheinlich — anders als die $36$ Paare selbst.'])

Q.q(r'Eine Urne enthält $5$ grüne und $5$ gelbe Kugeln. Zweimal wird ohne Zurücklegen gezogen. Wie groß ist die Wahrscheinlichkeit für zwei gleiche Farben?',
    [r'$\dfrac{4}{9}$', r'$\dfrac{1}{2}$', r'$\dfrac{5}{9}$', r'$\dfrac{1}{4}$'],
    [r'Zwei grüne: $\dfrac{5}{10} \cdot \dfrac{4}{9} = \dfrac{20}{90}$. Zwei gelbe ebenso.',
     r'Zusammen $\dfrac{40}{90} = \dfrac{4}{9}$.',
     r'Verschiedene Farben haben also $\dfrac{5}{9}$ — bei ungleicher Zahl wäre das Bild anders.'])

Q.q(r'Ein Test mit $6$ Fragen und je $4$ Antworten wird geraten. Wie groß ist die Wahrscheinlichkeit, alle sechs richtig zu treffen?',
    [r'$\dfrac{1}{4096}$', r'$\dfrac{1}{24}$', r'$\dfrac{1}{64}$', r'$\dfrac{6}{4096}$'],
    [r'$P = \left(\dfrac{1}{4}\right)^6$',
     r'$= \dfrac{1}{4096}$',
     r'Das ist rund eine Chance von $0{,}024\,\%$.'])

Q.q(r'Aus $12$ Personen werden $3$ für eine Arbeitsgruppe gewählt. Wie viele Möglichkeiten gibt es?',
    [r'$220$', r'$1320$', r'$1728$', r'$36$'],
    [r'Die Reihenfolge ist gleichgültig.',
     r'$\binom{12}{3} = \dfrac{12 \cdot 11 \cdot 10}{3 \cdot 2 \cdot 1} = \dfrac{1320}{6}$',
     r'$= 220$. Die $1320$ gehört zur Zählung mit Reihenfolge.'])

Q.q(r'Ein Bauteil ist mit $3\,\%$ fehlerhaft. Wie groß ist die Wahrscheinlichkeit, dass unter $5$ Bauteilen keines fehlerhaft ist?',
    [r'etwa $0{,}859$', r'etwa $0{,}97$', r'etwa $0{,}141$', r'etwa $0{,}15$'],
    [r'$P = 0{,}97^5$',
     r'$\approx 0{,}859$',
     r'Also fällt mit rund $14\,\%$ mindestens eines aus.'])

Q.q(r'Für zwei unabhängige Ereignisse gilt $P(A) = 0{,}4$ und $P(B) = 0{,}5$. Wie groß ist $P(A \cup B)$?',
    [r'$0{,}7$', r'$0{,}9$', r'$0{,}2$', r'$0{,}6$'],
    [r'Wegen der Unabhängigkeit ist $P(A \cap B) = 0{,}4 \cdot 0{,}5 = 0{,}2$.',
     r'$P(A \cup B) = 0{,}4 + 0{,}5 - 0{,}2$',
     r'$= 0{,}7$. Unabhängig heißt nicht unvereinbar — sonst käme fälschlich $0{,}9$ heraus.'])

Q.q(r'Eine Münze wird fünfmal geworfen. Wie groß ist die Wahrscheinlichkeit für genau viermal Kopf?',
    [r'$\dfrac{5}{32}$', r'$\dfrac{1}{32}$', r'$\dfrac{4}{32}$', r'$\dfrac{1}{16}$'],
    [r'$P = \binom{5}{4} \cdot \left(\dfrac{1}{2}\right)^5 = 5 \cdot \dfrac{1}{32}$',
     r'$= \dfrac{5}{32}$',
     r'Der Faktor $5$ steht für die fünf möglichen Positionen der einen Zahl.'])

# ------------------------------------------------------------- typische Fehler ----
Q.q(r'Jemand rechnet für „mindestens eine Sechs bei $3$ Würfen“ den Wert $3 \cdot \dfrac{1}{6} = \dfrac{1}{2}$. Wo liegt der Fehler?',
    [r'Die drei Fälle überschneiden sich, Mehrfachtreffer werden doppelt gezählt.',
     r'Es müsste durch $3$ geteilt werden.',
     r'Die Wahrscheinlichkeit einer Sechs ist nicht $\dfrac{1}{6}$.',
     r'Es ist gar kein Fehler.'],
    [r'Addiert werden dürfen nur Wahrscheinlichkeiten unvereinbarer Ereignisse.',
     r'„Sechs im ersten Wurf“ und „Sechs im zweiten Wurf“ können aber zugleich eintreten.',
     r'Richtig ist der Weg über das Gegenereignis: $1 - \left(\dfrac{5}{6}\right)^3 = \dfrac{91}{216} \approx 0{,}42$.'])

Q.q(r'Jemand addiert für zwei überschneidende Ereignisse $P(A) + P(B)$ und erhält $1{,}1$. Was folgt daraus?',
    [r'Der Additionssatz wurde ohne Abzug von $P(A \cap B)$ angewandt.',
     r'Die Ereignisse sind unvereinbar.',
     r'Eine der Wahrscheinlichkeiten ist falsch gemessen.',
     r'Das Ergebnis ist korrekt.'],
    [r'Eine Wahrscheinlichkeit größer als $1$ kann es nicht geben.',
     r'Das Ergebnis verrät, dass die Überschneidung doppelt gezählt wurde.',
     r'Ein Wert über $1$ ist immer ein Alarmsignal für einen Rechenfehler.'])

Q.q(r'Jemand berechnet die Wahrscheinlichkeit für „erst rot, dann blau“ und addiert die beiden Astwahrscheinlichkeiten. Wo liegt der Fehler?',
    [r'Längs eines Pfades wird multipliziert, nicht addiert.',
     r'Es müsste subtrahiert werden.',
     r'Die Reihenfolge darf nicht beachtet werden.',
     r'Es ist kein Fehler.'],
    [r'Die erste Pfadregel gilt für das Nacheinander innerhalb eines Pfades: multiplizieren.',
     r'Addiert wird erst über mehrere Pfade hinweg, also nach der zweiten Regel.',
     r'Wer addiert, erhält oft Werte über $1$ und merkt den Fehler daran.'])

Q.q(r'Jemand behandelt das Ziehen ohne Zurücklegen als Bernoulli-Kette. Warum ist das falsch?',
    [r'Weil sich $p$ von Zug zu Zug ändert und die Züge nicht unabhängig sind.',
     r'Weil eine Bernoulli-Kette höchstens zwei Versuche haben darf.',
     r'Weil Urnen nicht zu Bernoulli-Ketten passen.',
     r'Weil die Reihenfolge nicht zählt.'],
    [r'Die Bernoulli-Kette verlangt unabhängige Versuche mit gleichbleibendem $p$.',
     r'Ohne Zurücklegen ändert der erste Zug den Urneninhalt.',
     r'Mit Zurücklegen dagegen ist die Bernoulli-Kette genau das richtige Modell.'])

Q.q(r'Jemand liest aus $\binom{10}{3} = 120$ ab, dass es $120$ Reihenfolgen gibt. Wo liegt der Fehler?',
    [r'Der Binomialkoeffizient zählt Auswahlen ohne Reihenfolge; mit Reihenfolge wären es $720$.',
     r'Der Wert $120$ ist falsch berechnet.',
     r'Es müsste $\binom{10}{7}$ heißen.',
     r'Es ist kein Fehler.'],
    [r'$\binom{10}{3}$ zählt, welche drei Elemente gewählt werden.',
     r'Jede dieser Auswahlen lässt sich auf $3! = 6$ Arten anordnen.',
     r'$120 \cdot 6 = 720$ Reihenfolgen.'])

Q.q(r'Jemand gibt als Wahrscheinlichkeit den Wert $-0{,}2$ an. Was ist zu tun?',
    [r'Die Rechnung prüfen, denn Wahrscheinlichkeiten liegen stets zwischen $0$ und $1$.',
     r'Den Betrag nehmen und mit $0{,}2$ weiterrechnen.',
     r'Zu $1$ addieren.',
     r'Das Ergebnis akzeptieren.'],
    [r'Für jede Wahrscheinlichkeit gilt $0 \leq P \leq 1$.',
     r'Ein negativer Wert entsteht meist durch ein falsches Vorzeichen im Additionssatz.',
     r'Das Ergebnis ist ein Hinweis auf den Fehler, kein Zwischenergebnis.'])

# ---------------------------------------------------- klassische Trugschlüsse ----
Q.q(r'Beim Roulette fiel fünfmal hintereinander Rot. Wie steht es um die Wahrscheinlichkeit für Schwarz im nächsten Spiel?',
    [r'Sie ist unverändert, das Rad hat kein Gedächtnis.',
     r'Sie ist größer, weil Schwarz nun fällig ist.',
     r'Sie ist kleiner, weil Rot eine Serie hat.',
     r'Sie lässt sich nicht mehr angeben.'],
    [r'Jedes Spiel ist unabhängig von den vorherigen.',
     r'Die Kugel kennt die Vorgeschichte nicht.',
     r'Dieser Irrtum heißt Spielerfehlschluss und hat schon viele Kassen gefüllt.'])

Q.q(r'In einer Gruppe von $23$ Personen — wie wahrscheinlich ist es, dass zwei am selben Tag Geburtstag haben?',
    [r'etwas über $50\,\%$', r'etwa $6\,\%$', r'etwa $23\,\%$', r'unter $1\,\%$'],
    [r'Man rechnet über das Gegenereignis: alle Geburtstage verschieden.',
     r'$P = \dfrac{365}{365} \cdot \dfrac{364}{365} \cdot \ldots \cdot \dfrac{343}{365} \approx 0{,}493$',
     r'Also rund $50{,}7\,\%$ für mindestens ein gemeinsames Paar — überraschend viel, weil alle Paare zählen, nicht nur die mit der eigenen Person.'])

Q.q(r'Beim Ziegenproblem wählt man eine von drei Türen, der Moderator öffnet eine andere mit einer Ziege und bietet den Wechsel an. Was ist günstiger?',
    [r'Wechseln, die Gewinnchance steigt von $\dfrac{1}{3}$ auf $\dfrac{2}{3}$.',
     r'Bleiben, die Gewinnchance ist dann $\dfrac{2}{3}$.',
     r'Es ist gleichgültig, beide Chancen sind $\dfrac{1}{2}$.',
     r'Wechseln, beide Chancen sind aber $\dfrac{1}{2}$.'],
    [r'Die zuerst gewählte Tür hat unverändert die Gewinnchance $\dfrac{1}{3}$.',
     r'Die gesamte übrige Wahrscheinlichkeit $\dfrac{2}{3}$ sammelt sich auf der verbliebenen Tür.',
     r'Der Moderator öffnet bewusst eine Ziegentür — diese Zusatzinformation macht den Unterschied.'])

Q.q(r'Ein Test erkennt eine seltene Krankheit fast immer richtig, dennoch ist ein positives Ergebnis oft ein Fehlalarm. Woran liegt das?',
    [r'Weil die Krankheit so selten ist, dass die wenigen Fehlalarme unter den vielen Gesunden zahlreicher sind als die echten Fälle.',
     r'Weil der Test schlecht ist.',
     r'Weil die Wahrscheinlichkeiten addiert werden müssen.',
     r'Weil positive Tests immer falsch sind.'],
    [r'Bei $1$ Erkranktem unter $1000$ und $5\,\%$ Fehlalarm testen von $1000$ Personen rund $50$ Gesunde positiv.',
     r'Dem steht etwa $1$ echter Fall gegenüber.',
     r'Also ist nur rund jeder $51$. positive Test ein echter — die Grundhäufigkeit entscheidet mit.'])

Q.q(r'Was besagt das Gesetz der großen Zahlen NICHT?',
    [r'dass sich Abweichungen später wieder ausgleichen',
     r'dass sich die relative Häufigkeit der Wahrscheinlichkeit annähert',
     r'dass die Schwankungen mit wachsender Versuchszahl kleiner werden',
     r'dass es nur für beliebig oft wiederholbare Versuche gilt'],
    [r'Ein Überschuss an Kopf wird nicht durch späteren Überschuss an Zahl kompensiert.',
     r'Der absolute Unterschied kann sogar wachsen.',
     r'Nur der relative Anteil nähert sich an — die Abweichung wird verdünnt, nicht ausgeglichen.'])

Q.q(r'Zwei Ereignisse haben $P(A) = 0{,}5$ und $P(B) = 0{,}5$. Jemand schließt daraus $P(A \cap B) = 0{,}25$. Ist das zulässig?',
    [r'Nur, wenn die Unabhängigkeit vorher bekannt ist.',
     r'Ja, das gilt immer.',
     r'Nein, richtig wäre $0{,}5$.',
     r'Nein, richtig wäre $1$.'],
    [r'Die Multiplikationsregel setzt Unabhängigkeit voraus.',
     r'Ohne diese Voraussetzung kann $P(A \cap B)$ alles zwischen $0$ und $0{,}5$ sein.',
     r'Sind $A$ und $B$ etwa unvereinbar, so ist $P(A \cap B) = 0$.'])


def check():
    from math import comb, factorial as fa
    from fractions import Fraction as F
    paare = [(i, j) for i in range(1, 7) for j in range(1, 7)]
    assert len(paare) == 36
    assert sum(1 for p in paare if sum(p) == 7) == 6 and F(6, 36) == F(1, 6)
    assert sum(1 for p in paare if sum(p) == 12) == 1
    # Urne 5 gruen 5 gelb
    gleich = F(5, 10) * F(4, 9) + F(5, 10) * F(4, 9)
    assert gleich == F(40, 90) == F(4, 9) and 1 - F(4, 9) == F(5, 9)
    assert F(1, 4) ** 6 == F(1, 4096) and abs(float(F(1, 4096)) - 0.00024) < 0.00001
    assert comb(12, 3) == 220 and 12 * 11 * 10 == 1320 and 1320 // fa(3) == 220
    assert abs(float(F(97, 100) ** 5) - 0.859) < 0.0005
    assert abs(float(1 - F(97, 100) ** 5) - 0.141) < 0.0005
    assert F(4, 10) * F(5, 10) == F(2, 10)
    assert F(4, 10) + F(5, 10) - F(2, 10) == F(7, 10)
    assert comb(5, 4) * F(1, 2) ** 5 == F(5, 32)
    # typische Fehler
    assert 3 * F(1, 6) == F(1, 2) and 1 - F(5, 6) ** 3 == F(91, 216)
    assert abs(float(F(91, 216)) - 0.42) < 0.005
    assert comb(10, 3) == 120 and 120 * fa(3) == 720
    # Trugschluesse
    p = F(1, 1)
    for k in range(23):
        p *= F(365 - k, 365)
    assert abs(float(p) - 0.4927) < 0.0005 and abs(float(1 - p) - 0.5073) < 0.0005
    assert F(2, 3) > F(1, 3)
    # Testparadoxon
    krank, fehlalarm = 1, 5 * 999 / 100
    assert abs(fehlalarm - 49.95) < 0.01 and abs(krank / (krank + fehlalarm) - 0.0196) < 0.0005
    assert F(1, 2) * F(1, 2) == F(1, 4)


Q.verify(check)
Q.save()

#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Grundkurs, Woche 11 (LB 6): Grundprobleme der beurteilenden
Statistik, Schätzen von Parametern - Grundgesamtheit und Stichprobe, Hochrechnung,
Stichprobenmittel, Stichprobenvarianz. Plan: HTML/svp/mathe/mathegy12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy12
from fractions import Fraction as Fr
import math

Q = gy12(nr=11, slug='schaetzen', thema='Schätzen von Parametern', lb='LB 6',
         blurb='Stichprobe und Grundgesamtheit, Hochrechnung, Stichprobenmittel und -varianz',
         comment='Blocks: Grundbegriffe und Stichprobe (7-9, 12, 19), Anteile schätzen und hochrechnen (1, 2, 13-16, 18), Stichprobenmittel und -varianz (3-6, 10, 11, 17, 20). Stichprobenvarianz mit 1/(n-1). Taschenrechner erlaubt.')

Q.q(r'Von $1000$ zufällig ausgewählten Wahlberechtigten wollen $420$ Partei A wählen. Welcher Schätzwert ergibt sich für den Anteil $p$ in der Grundgesamtheit?',
    [r'$\hat p = 0{,}42$', r'$\hat p = 0{,}58$', r'$\hat p = 4{,}2$', r'$\hat p = 0{,}042$'],
    [r'Die relative Häufigkeit in der Stichprobe schätzt den Anteil: $\hat p = \tfrac{420}{1000}$.',
     r'$= 0{,}42$, also etwa $42\,\%$.'])

Q.q(r'Im Wahlkreis aus Aufgabe 1 gibt es $50\,000$ Wahlberechtigte. Mit wie vielen Stimmen für A ist nach der Hochrechnung zu rechnen?',
    [r'etwa $21\,000$', r'etwa $420$', r'etwa $29\,000$', r'etwa $2\,100$'],
    [r'Hochrechnung: geschätzter Anteil mal Größe der Grundgesamtheit.',
     r'$0{,}42 \cdot 50\,000 = 21\,000$, sofern alle zur Wahl gehen.'])

Q.q(r'Berechne das Stichprobenmittel $\bar x$ der Werte $4$; $6$; $7$; $5$; $8$.',
    [r'$\bar x = 6$', r'$\bar x = 7$', r'$\bar x = 5$', r'$\bar x = 30$'],
    [r'$\bar x = \tfrac15 (4 + 6 + 7 + 5 + 8) = \tfrac{30}{5}$.',
     r'$= 6$. $7$ wäre ein Wert der Liste, nicht der Mittelwert.'])

Q.q(r'Berechne die Stichprobenvarianz $s^2 = \dfrac{1}{n - 1}\sum (x_i - \bar x)^2$ der Werte $4$; $6$; $7$; $5$; $8$.',
    [r'$s^2 = 2{,}5$', r'$s^2 = 2$', r'$s^2 = 10$', r'$s^2 = 1{,}58$'],
    [r'Abweichungen von $\bar x = 6$: $-2$; $0$; $1$; $-1$; $2$, Quadrate $4$; $0$; $1$; $1$; $4$, Summe $10$.',
     r'$s^2 = \tfrac{10}{5 - 1} = 2{,}5$. Mit $\tfrac1n$ käme $2$ heraus, das schätzt die Varianz im Mittel zu klein.'])

Q.q(r'Wie groß ist die Stichprobenstandardabweichung $s$ zu den Werten aus Aufgabe 4?',
    [r'$s \approx 1{,}58$', r'$s = 2{,}5$', r'$s \approx 1{,}41$', r'$s = 6{,}25$'],
    [r'$s = \sqrt{s^2} = \sqrt{2{,}5}$.',
     r'$\approx 1{,}58$. $\sqrt2 \approx 1{,}41$ gehört zur Varianz mit $\tfrac1n$.'])

Q.q(r'Warum teilt man bei der Stichprobenvarianz durch $n - 1$ und nicht durch $n$?',
    [r'So schätzt $s^2$ die Varianz der Grundgesamtheit im Mittel richtig.', r'Weil ein Wert immer falsch gemessen ist.', r'Damit das Ergebnis eine ganze Zahl wird.', r'Weil $\bar x$ selbst null ist.'],
    [r'Die Abweichungen werden vom Stichprobenmittel aus gemessen, nicht vom unbekannten wahren Mittelwert; dadurch fallen sie im Schnitt etwas zu klein aus.',
     r'Der Faktor $\tfrac{1}{n - 1}$ gleicht das aus: Die Schätzung ist erwartungstreu. Den Beweis lassen wir weg.'])

Q.q(r'Was ist bei einer Umfrage zur Bundestagswahl die Grundgesamtheit?',
    [r'alle Wahlberechtigten', r'die befragten Personen', r'alle Parteien', r'die Wahlergebnisse der letzten Wahl'],
    [r'Die Grundgesamtheit ist die Menge, über die eine Aussage getroffen werden soll.',
     r'Die Befragten bilden die Stichprobe, aus der man auf die Grundgesamtheit schließt.'])

Q.q(r'Warum sollte eine Stichprobe zufällig ausgewählt werden?',
    [r'Damit sie die Grundgesamtheit nicht systematisch verzerrt abbildet.', r'Damit sie möglichst klein sein kann.', r'Damit jedes Ergebnis gleich wahrscheinlich ist.', r'Weil der Zufall immer das richtige Ergebnis liefert.'],
    [r'Nur wenn jedes Element die gleiche Chance hat, gewählt zu werden, lässt sich vom Ergebnis auf die Grundgesamtheit schließen.',
     r'Auch eine Zufallsstichprobe hat Zufallsschwankungen, aber keinen systematischen Fehler.'])

Q.q(r'Eine Zeitung befragt ihre Online-Leserinnen und -Leser zur Nutzung des Internets. Was ist das Problem?',
    [r'Die Stichprobe ist verzerrt: Wer online liest, nutzt das Internet häufiger als der Durchschnitt.', r'Die Stichprobe ist zu groß.', r'Online-Umfragen sind immer verboten.', r'Es gibt kein Problem.'],
    [r'Die Auswahl hängt mit der untersuchten Frage zusammen.',
     r'So entsteht ein systematischer Fehler, den auch eine größere Stichprobe nicht beseitigt.'])

Q.q(r'Fünf Messungen der Fallbeschleunigung ergeben $9{,}78$; $9{,}82$; $9{,}80$; $9{,}81$; $9{,}79$ (in m/s²). Welcher Wert wird als Messergebnis angegeben?',
    [r'$9{,}80$ m/s²', r'$9{,}82$ m/s²', r'$9{,}81$ m/s²', r'$9{,}78$ m/s²'],
    [r'Das Stichprobenmittel schätzt den wahren Wert: $\tfrac15 \cdot 49{,}00$.',
     r'$= 9{,}80$ m/s².'])

Q.q(r'Wie groß ist die Stichprobenstandardabweichung $s$ der fünf Messwerte aus Aufgabe 10?',
    [r'$s \approx 0{,}016$ m/s²', r'$s \approx 0{,}014$ m/s²', r'$s = 0{,}001$ m/s²', r'$s = 0{,}04$ m/s²'],
    [r'Abweichungen $-0{,}02$; $0{,}02$; $0$; $0{,}01$; $-0{,}01$, Quadratsumme $0{,}001$.',
     r'$s^2 = \tfrac{0{,}001}{4} = 0{,}00025$, $s \approx 0{,}016$. Angabe etwa: $(9{,}80 \pm 0{,}02)$ m/s².'])

Q.q(r'Wie verändert sich die Genauigkeit einer Schätzung, wenn man die Stichprobe vergrößert?',
    [r'Die Schätzwerte schwanken weniger um den wahren Wert.', r'Die Schätzung wird ungenauer.', r'Die Genauigkeit bleibt gleich.', r'Ab $100$ Personen ist sie immer exakt.'],
    [r'Mehr Daten mitteln Zufallsschwankungen besser aus.',
     r'Die Streuung des Schätzwerts $\hat p$ nimmt mit $\tfrac{1}{\sqrt n}$ ab: viermal so groß heißt halb so weit gestreut.'])

Q.q(r'Die Streuung von $\hat p$ ist proportional zu $\tfrac{1}{\sqrt n}$. Um welchen Faktor muss man $n$ vergrößern, damit sie sich halbiert?',
    [r'um den Faktor $4$', r'um den Faktor $2$', r'um den Faktor $\sqrt2$', r'um den Faktor $8$'],
    [r'$\tfrac{1}{\sqrt{kn}} = \tfrac12 \cdot \tfrac{1}{\sqrt n}$ heißt $\sqrt k = 2$.',
     r'Also $k = 4$. Doppelte Genauigkeit kostet die vierfache Stichprobe.'])

Q.q(r'Bei einer Kontrolle sind $12$ von $300$ Teilen defekt. Schätze den Ausschussanteil.',
    [r'$4\,\%$', r'$12\,\%$', r'$2{,}5\,\%$', r'$0{,}4\,\%$'],
    [r'$\hat p = \tfrac{12}{300} = 0{,}04$.',
     r'Also etwa $4\,\%$.'])

Q.q(r'Wie viele defekte Teile sind in einer Lieferung von $10\,000$ Teilen nach Aufgabe 14 zu erwarten?',
    [r'etwa $400$', r'etwa $1\,200$', r'etwa $40$', r'etwa $250$'],
    [r'Erwartungswert $n \cdot \hat p = 10\,000 \cdot 0{,}04$.',
     r'$= 400$.'])

Q.q(r'Welche Größe ist ein Schätzwert für den Erwartungswert $\mu$ einer Zufallsgröße?',
    [r'das Stichprobenmittel $\bar x$', r'die Stichprobenvarianz $s^2$', r'der größte Messwert', r'die Anzahl $n$ der Messungen'],
    [r'Der Erwartungswert ist der Mittelwert auf lange Sicht.',
     r'Er wird durch den Mittelwert der Stichprobe geschätzt; $s^2$ schätzt die Varianz.'])

Q.q(r'In einem Teich werden $100$ Fische markiert und wieder ausgesetzt. Später werden $50$ Fische gefangen, $5$ davon sind markiert. Wie viele Fische leben etwa im Teich?',
    [r'etwa $1\,000$', r'etwa $500$', r'etwa $250$', r'etwa $10\,000$'],
    [r'Der Anteil markierter Fische im Fang schätzt den Anteil im Teich: $\tfrac{5}{50} = \tfrac{100}{N}$.',
     r'$N \approx \tfrac{100 \cdot 50}{5} = 1\,000$.'])

Q.q(r'Zwei Umfragen ergeben $30\,\%$ für Partei B, eine mit $100$, eine mit $1\,000$ Befragten. Welche Aussage stimmt?',
    [r'Die Umfrage mit $1\,000$ Befragten ist verlässlicher.', r'Beide sind gleich verlässlich, weil der Anteil gleich ist.', r'Die kleinere Umfrage ist verlässlicher.', r'Keine ist verlässlich, weil $30\,\%$ unter $50\,\%$ liegt.'],
    [r'Bei kleinem $n$ schwankt der Anteil stärker von Umfrage zu Umfrage.',
     r'Mit zehnfacher Größe ist die Streuung etwa $\sqrt{10} \approx 3$-mal kleiner, sofern beide zufällig ausgewählt sind.'])

Q.q(r'Was bedeutet „Schließen von einer Zufallsstichprobe auf die Grundgesamtheit“?',
    [r'Aus den Ergebnissen der Stichprobe auf unbekannte Kenngrößen der Grundgesamtheit schließen', r'Aus der Grundgesamtheit die Stichprobe berechnen', r'Die Stichprobe so lange wiederholen, bis sie stimmt', r'Die Grundgesamtheit vollständig befragen'],
    [r'Das ist das Grundproblem der beurteilenden Statistik.',
     r'Man kennt die Grundgesamtheit nicht vollständig und muss mit Unsicherheit umgehen.'])

Q.q(r'In einer Stichprobe kommen die Werte $1$, $2$, $3$ mit den Häufigkeiten $5$, $10$, $5$ vor. Berechne $\bar x$.',
    [r'$\bar x = 2$', r'$\bar x = 6{,}67$', r'$\bar x = 10$', r'$\bar x = 1{,}5$'],
    [r'$\bar x = \tfrac{1 \cdot 5 + 2 \cdot 10 + 3 \cdot 5}{20} = \tfrac{40}{20}$.',
     r'$= 2$. Geteilt wird durch die Anzahl aller Werte, $20$.'])


def check():
    assert Fr(420, 1000) == Fr(42, 100) and Fr(42, 100) * 50000 == 21000
    xs = [4, 6, 7, 5, 8]
    m = Fr(sum(xs), len(xs))
    ss = sum((v - m) ** 2 for v in xs)
    assert m == 6 and ss == 10 and ss / 4 == Fr(5, 2) and ss / 5 == 2 and abs(math.sqrt(2.5) - 1.58) < 0.005
    g = [Fr(978, 100), Fr(982, 100), Fr(980, 100), Fr(981, 100), Fr(979, 100)]
    mg = sum(g) / 5
    sg = sum((v - mg) ** 2 for v in g)
    assert mg == Fr(980, 100) and sg == Fr(1, 1000) and abs(math.sqrt(float(sg / 4)) - 0.016) < 0.0005
    assert math.sqrt(4) == 2
    assert Fr(12, 300) == Fr(4, 100) and 10000 * Fr(4, 100) == 400
    assert 100 * 50 / 5 == 1000 and abs(math.sqrt(10) - 3.16) < 0.01
    assert Fr(1 * 5 + 2 * 10 + 3 * 5, 20) == 2


Q.verify(check)
Q.save()

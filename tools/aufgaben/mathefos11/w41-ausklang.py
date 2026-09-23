#!/usr/bin/env python3
"""Aufgaben FO Mathe 11, Woche 41 / KW 27: Ausklang - Mathematik im Alltag und
mathematische Kuriositaeten zum Schuljahresende.
Plan: HTML/svp/mathe/mathefos11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos11

Q = fos11(nr=41, slug='ausklang', thema='Ausklang: Mathematik im Alltag', lb='Abschluss',
          blurb='Prozente, Maßstab, Einheiten und mathematische Kuriositäten',
          comment='Blocks: Geld und Prozente (1-6), Messen und Umrechnen (7-13), Kuriositaeten (14-20). Leichte Abschlusswoche.')

# ------------------------------------------------------------- Geld und Prozente ----
Q.q(r'Ein Artikel kostet $45$ € und wird um $20\,\%$ reduziert. Was kostet er dann?',
    [r'$36$ €', r'$25$ €', r'$9$ €', r'$54$ €'],
    [r'Reduzierung um $20\,\%$ bedeutet Multiplikation mit $0{,}8$.',
     r'$45 \cdot 0{,}8 = 36$ €',
     r'Der Rabatt selbst beträgt $9$ €.'])

Q.q(r'Wie viel Trinkgeld sind $10\,\%$ auf eine Rechnung von $38$ €?',
    [r'$3{,}80$ €', r'$3{,}00$ €', r'$4{,}20$ €', r'$0{,}38$ €'],
    [r'$10\,\%$ entspricht dem Zehntel.',
     r'$\dfrac{38}{10} = 3{,}80$ €',
     r'Insgesamt zahlt man dann $41{,}80$ €.'])

Q.q(r'Ein Netto-Preis von $150$ € wird mit $19\,\%$ Umsatzsteuer belegt. Wie hoch ist der Brutto-Preis?',
    [r'$178{,}50$ €', r'$169{,}00$ €', r'$121{,}50$ €', r'$28{,}50$ €'],
    [r'$150 \cdot 1{,}19$',
     r'$= 178{,}50$ €',
     r'Die Steuer allein beträgt $28{,}50$ €.'])

Q.q(r'Ein Brutto-Preis beträgt $119$ €, darin sind $19\,\%$ Umsatzsteuer enthalten. Wie hoch ist der Netto-Preis?',
    [r'$100$ €', r'$96{,}39$ €', r'$99{,}00$ €', r'$101$ €'],
    [r'Der Brutto-Preis entspricht $119\,\%$ des Netto-Preises.',
     r'$\dfrac{119}{1{,}19} = 100$ €',
     r'Falsch wäre, $19\,\%$ von $119$ € abzuziehen — das ergäbe $96{,}39$ €.'])

Q.q(r'Drei Personen teilen sich eine Rechnung von $87$ € zu gleichen Teilen. Wie viel zahlt jede?',
    [r'$29$ €', r'$27$ €', r'$30$ €', r'$26$ €'],
    [r'$\dfrac{87}{3}$',
     r'$= 29$ €',
     r'Probe: $3 \cdot 29 = 87$ €.'])

Q.q(r'Ein Guthaben von $2500$ € wird ein Jahr lang mit $1{,}5\,\%$ verzinst. Wie viel Zinsen sind das?',
    [r'$37{,}50$ €', r'$375$ €', r'$15$ €', r'$3{,}75$ €'],
    [r'$2500 \cdot 0{,}015$',
     r'$= 37{,}50$ €',
     r'Das Guthaben wächst also auf $2537{,}50$ €.'])

# ---------------------------------------------------------- Messen und Umrechnen ----
Q.q(r'Auf einer Karte im Maßstab $1 : 25\,000$ sind zwei Orte $4\,\mathrm{cm}$ voneinander entfernt. Wie weit sind sie in Wirklichkeit auseinander?',
    [r'$1\,\mathrm{km}$', r'$100\,\mathrm{m}$', r'$10\,\mathrm{km}$', r'$25\,\mathrm{km}$'],
    [r'$1\,\mathrm{cm}$ auf der Karte sind $25\,000\,\mathrm{cm}$ in der Natur.',
     r'$4 \cdot 25\,000 = 100\,000\,\mathrm{cm}$',
     r'$= 1000\,\mathrm{m} = 1\,\mathrm{km}$'])

Q.q(r'Wie viele Meter pro Sekunde sind $90\,\mathrm{km/h}$?',
    [r'$25\,\mathrm{m/s}$', r'$90\,\mathrm{m/s}$', r'$1{,}5\,\mathrm{m/s}$', r'$324\,\mathrm{m/s}$'],
    [r'$90\,\mathrm{km} = 90\,000\,\mathrm{m}$ und $1\,\mathrm{h} = 3600\,\mathrm{s}$.',
     r'$\dfrac{90\,000}{3600} = 25$',
     r'Merkregel: durch $3{,}6$ teilen.'])

Q.q(r'Ein Auto verbraucht $6{,}5$ Liter auf $100\,\mathrm{km}$. Wie viel braucht es für $250\,\mathrm{km}$?',
    [r'$16{,}25$ Liter', r'$26$ Liter', r'$15$ Liter', r'$2{,}6$ Liter'],
    [r'Der Verbrauch ist proportional zur Strecke.',
     r'$\dfrac{6{,}5}{100} \cdot 250 = 0{,}065 \cdot 250$',
     r'$= 16{,}25$ Liter'])

Q.q(r'Ein Zimmer ist $4{,}50\,\mathrm{m}$ lang und $3{,}20\,\mathrm{m}$ breit. Wie groß ist seine Bodenfläche?',
    [r'$14{,}4\,\mathrm{m^2}$', r'$15{,}4\,\mathrm{m^2}$', r'$7{,}7\,\mathrm{m^2}$', r'$14{,}4\,\mathrm{m}$'],
    [r'$A = 4{,}50 \cdot 3{,}20$',
     r'$= 14{,}4\,\mathrm{m^2}$',
     r'Die Einheit einer Fläche ist Quadratmeter, nicht Meter.'])

Q.q(r'Ein Becken ist $5\,\mathrm{m}$ lang, $3\,\mathrm{m}$ breit und $1{,}2\,\mathrm{m}$ tief. Wie viele Liter fasst es?',
    [r'$18\,000$ Liter', r'$18$ Liter', r'$1800$ Liter', r'$180\,000$ Liter'],
    [r'$V = 5 \cdot 3 \cdot 1{,}2 = 18\,\mathrm{m^3}$',
     r'Ein Kubikmeter fasst $1000$ Liter.',
     r'$18 \cdot 1000 = 18\,000$ Liter'])

Q.q(r'Ein Rezept für $4$ Personen braucht $300\,\mathrm{g}$ Mehl. Wie viel braucht man für $6$ Personen?',
    [r'$450\,\mathrm{g}$', r'$400\,\mathrm{g}$', r'$500\,\mathrm{g}$', r'$200\,\mathrm{g}$'],
    [r'Dreisatz: pro Person $\dfrac{300}{4} = 75\,\mathrm{g}$.',
     r'$6 \cdot 75 = 450\,\mathrm{g}$',
     r'Oder direkt mit dem Faktor $\dfrac{6}{4} = 1{,}5$: $300 \cdot 1{,}5 = 450\,\mathrm{g}$.'])

Q.q(r'Jemand hat die Noten $2$, $3$, $1$ und $2$ geschrieben. Wie lautet der Durchschnitt?',
    [r'$2{,}0$', r'$2{,}5$', r'$1{,}75$', r'$8$'],
    [r'$\dfrac{2 + 3 + 1 + 2}{4} = \dfrac{8}{4}$',
     r'$= 2{,}0$',
     r'Die $8$ ist nur die Summe, noch nicht der Mittelwert.'])

# ------------------------------------------------------------------ Kuriositäten ----
Q.q(r'Warum gilt $0{,}\overline{9} = 1$?',
    [r'Weil $0{,}\overline{3} = \dfrac{1}{3}$ ist und das Dreifache davon sowohl $0{,}\overline{9}$ als auch $1$ ergibt.',
     r'Weil man großzügig rundet.',
     r'Weil die Differenz zu klein zum Messen ist.',
     r'Das gilt gar nicht, $0{,}\overline{9}$ ist kleiner als $1$.'],
    [r'$\dfrac{1}{3} = 0{,}\overline{3}$ ist unstrittig.',
     r'Multipliziert man beide Seiten mit $3$, steht links $1$ und rechts $0{,}\overline{9}$.',
     r'Es sind zwei Schreibweisen derselben Zahl, keine Näherung.'])

Q.q(r'Was ist das Besondere am Möbiusband?',
    [r'Es hat nur eine Seite und nur eine Kante.',
     r'Es hat unendlich viele Seiten.',
     r'Es lässt sich nicht aus Papier herstellen.',
     r'Es ist immer kreisrund.'],
    [r'Man klebt einen Papierstreifen zusammen und dreht ein Ende zuvor um eine halbe Drehung.',
     r'Fährt man mit dem Stift entlang, landet man ohne abzusetzen wieder am Start — auf der „anderen“ Seite.',
     r'Schneidet man es längs in der Mitte durch, zerfällt es nicht in zwei Teile.'])

Q.q(r'Wie viele Primzahlen gibt es?',
    [r'unendlich viele, das hat Euklid bewiesen', r'genau $1000$',
     r'so viele, wie man bisher gefunden hat', r'nur endlich viele, die größte ist bekannt'],
    [r'Euklids Beweis ist über zweitausend Jahre alt und erstaunlich kurz.',
     r'Nimmt man alle bekannten Primzahlen, multipliziert sie und addiert $1$, so ist die neue Zahl durch keine von ihnen teilbar.',
     r'Also fehlte mindestens eine — die Liste kann nie vollständig sein.'])

Q.q(r'Was besagt der Vier-Farben-Satz?',
    [r'Jede Landkarte lässt sich mit vier Farben so färben, dass benachbarte Länder verschiedene Farben haben.',
     r'Jede Landkarte braucht mindestens vier Farben.',
     r'Es gibt genau vier Grundfarben.',
     r'Vier Länder können nie aneinandergrenzen.'],
    [r'Die Vermutung stammt von 1852, der Beweis gelang erst 1976.',
     r'Er war der erste große Beweis, der ohne Computer nicht auskam.',
     r'Manche Karten kommen mit weniger Farben aus, mehr als vier braucht aber keine.'])

Q.q(r'Der $14$. März wird weltweit als Pi-Tag gefeiert. Warum gerade dieser Tag?',
    [r'weil er in amerikanischer Schreibweise $3/14$ lautet und $\pi \approx 3{,}14$ ist',
     r'weil $\pi$ an diesem Tag berechnet wurde',
     r'weil der März der dritte Monat ist',
     r'weil $14 : 3 \approx \pi$ gilt'],
    [r'In den USA schreibt man den Monat zuerst: $3/14$.',
     r'Das sind die ersten drei Ziffern von $\pi = 3{,}14159\ldots$',
     r'Wer es genauer mag, feiert um $1$ Uhr $59$.'])

Q.q(r'Was sind Primzahlzwillinge?',
    [r'zwei Primzahlen mit dem Abstand $2$, etwa $11$ und $13$',
     r'zwei gleich große Primzahlen',
     r'Primzahlen mit derselben Quersumme',
     r'Primzahlen, die aufeinanderfolgende Zahlen sind'],
    [r'Beispiele sind $3$ und $5$, $11$ und $13$, $17$ und $19$.',
     r'Näher als $2$ können zwei Primzahlen über $2$ nicht beieinanderliegen, denn eine von zwei Nachbarzahlen ist gerade.',
     r'Ob es unendlich viele Zwillinge gibt, ist bis heute ungelöst.'])

Q.q(r'Womit geht es in Klasse 12 weiter?',
    [r'mit der Vektorrechnung, danach Differenzial- und Integralrechnung',
     r'mit der Stochastik', r'mit der Finanzmathematik', r'mit denselben Themen wie in Klasse 11'],
    [r'Klasse 12 beginnt mit Geraden und Ebenen im Raum.',
     r'Danach folgt die Analysis bis zur Integralrechnung.',
     r'Am Ende steht die schriftliche Prüfung zur Fachhochschulreife. Schöne Ferien!'])


def check():
    from fractions import Fraction as F
    assert 45 * F(8, 10) == 36 and 45 * F(2, 10) == 9
    assert F(38, 10) == F(19, 5) and abs(float(F(38, 10)) - 3.8) < 1e-9
    assert 38 + F(38, 10) == F(418, 10)
    assert 150 * F(119, 100) == F(17850, 100) and 150 * F(19, 100) == F(2850, 100)
    assert F(119, 1) / F(119, 100) == 100 and abs(float(119 - 119 * F(19, 100)) - 96.39) < 0.01
    assert F(87, 3) == 29 and 3 * 29 == 87
    assert 2500 * F(15, 1000) == F(375, 10) and 2500 + F(375, 10) == F(25375, 10)
    # Messen
    assert 4 * 25000 == 100000 and 100000 // 100 == 1000
    assert F(90000, 3600) == 25 and abs(90 / 3.6 - 25) < 1e-9
    assert F(65, 1000) * 250 == F(1625, 100) and abs(float(F(1625, 100)) - 16.25) < 1e-9
    assert F(450, 100) * F(320, 100) == F(144, 10) and abs(float(F(144, 10)) - 14.4) < 1e-9
    assert 5 * 3 * F(12, 10) == 18 and 18 * 1000 == 18000
    assert F(300, 4) == 75 and 6 * 75 == 450 and 300 * F(6, 4) == 450
    assert F(2 + 3 + 1 + 2, 4) == 2
    # Kuriositaeten
    assert F(1, 3) * 3 == 1
    assert all(p in (3, 5, 11, 13, 17, 19) for p in (3, 5, 11, 13, 17, 19))
    assert 13 - 11 == 2 and 19 - 17 == 2 and 5 - 3 == 2
    assert abs(3.14159 - 3.14) < 0.005


Q.verify(check)
Q.save()

#!/usr/bin/env python3
"""Aufgaben FO Mathe 11, Woche 35 / KW 21 (WB 2): Finanzmathematik II -
Sparplan und Tilgungsrechnung. Plan: HTML/svp/mathe/mathefos11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos11

Q = fos11(nr=35, slug='finanzmathematik2', thema='Finanzmathematik: Sparplan und Tilgung', lb='WB 2',
          blurb='regelmäßige Zahlungen, Endwert eines Sparplans, Tilgungsplan, Angebote vergleichen',
          comment='Blocks: Sparplan verstehen (1-6), Endwert berechnen (7-11), Tilgungsrechnung (12-17), Angebote vergleichen (18-20). Beispielkredit: 10000 Euro, 5 Prozent, Annuitaet 3000 Euro.')

# ------------------------------------------------------------ Sparplan verstehen ----
Q.q(r'Was kennzeichnet einen Sparplan gegenüber einer einmaligen Anlage?',
    [r'Es wird regelmäßig ein gleichbleibender Betrag eingezahlt, jede Rate wird ab ihrer Einzahlung verzinst.',
     r'Es wird einmal eingezahlt und regelmäßig ausgezahlt.',
     r'Die Zinsen werden nicht mitverzinst.',
     r'Der Zinssatz ändert sich jedes Jahr.'],
    [r'Beim Sparplan kommt jedes Jahr eine neue Rate hinzu.',
     r'Jede Rate wird von ihrer Einzahlung an mitverzinst.',
     r'Die zuerst eingezahlten Raten tragen deshalb am meisten zum Endwert bei.'])

Q.q(r'Jemand zahlt drei Jahre lang je $1000$ € ein, es gibt keine Zinsen. Wie hoch ist der Endwert?',
    [r'$3000$ €', r'$1000$ €', r'$3152{,}50$ €', r'$3300$ €'],
    [r'Ohne Verzinsung addieren sich nur die Raten.',
     r'$3 \cdot 1000 = 3000$ €',
     r'Mit Zinsen läge der Endwert darüber — die Differenz ist der Zinsertrag.'])

Q.q(r'Wie lautet der Endwert eines nachschüssigen Sparplans mit $n$ Raten der Höhe $r$ und dem Faktor $q$?',
    [r'$E = r \cdot \dfrac{q^n - 1}{q - 1}$', r'$E = r \cdot q^n$',
     r'$E = r \cdot n \cdot q$', r'$E = \dfrac{r}{q^n}$'],
    [r'Die erste Rate wird $n-1$ Jahre verzinst, die letzte gar nicht.',
     r'Die Summe $r + rq + rq^2 + \ldots + rq^{n-1}$ ist eine geometrische Summe.',
     r'Ihr Wert ist $r \cdot \dfrac{q^n - 1}{q - 1}$.'])

Q.q(r'Warum steht in der Sparplanformel eine geometrische Summe?',
    [r'Weil jede Rate mit einer anderen Potenz von $q$ verzinst wird.',
     r'Weil die Raten sich jedes Jahr verdoppeln.',
     r'Weil der Zinssatz geometrisch wächst.',
     r'Weil die Laufzeit geometrisch gemessen wird.'],
    [r'Die zuerst eingezahlte Rate liegt am längsten und wird mit $q^{n-1}$ verzinst.',
     r'Die nächste mit $q^{n-2}$ und so weiter bis zur letzten mit $q^0 = 1$.',
     r'Aufsummiert ergibt das genau eine geometrische Summe.'])

Q.q(r'Welche Rate eines Sparplans trägt am meisten zum Endwert bei?',
    [r'die zuerst eingezahlte, weil sie am längsten verzinst wird',
     r'die zuletzt eingezahlte, weil sie am frischesten ist',
     r'alle gleich viel, weil sie gleich hoch sind',
     r'die mittlere Rate'],
    [r'Alle Raten sind gleich hoch, aber unterschiedlich lange angelegt.',
     r'Die erste Rate wird $n-1$ Jahre verzinst.',
     r'Deshalb lohnt früh anfangen mehr als später mehr einzahlen.'])

Q.q(r'Was bedeutet „nachschüssig“ bei einem Sparplan?',
    [r'Die Rate wird am Ende jeder Periode eingezahlt.',
     r'Die Rate wird am Anfang jeder Periode eingezahlt.',
     r'Die Zinsen werden erst am Ende der Laufzeit gutgeschrieben.',
     r'Die Raten steigen von Jahr zu Jahr.'],
    [r'Nachschüssig heißt: Zahlung am Periodenende.',
     r'Die letzte Rate wird dann gar nicht mehr verzinst.',
     r'Vorschüssig wäre die Zahlung am Periodenanfang, der Endwert entsprechend um den Faktor $q$ größer.'])

# ---------------------------------------------------------- Endwert berechnen ----
Q.q(r'Jemand zahlt drei Jahre lang nachschüssig je $1000$ € bei $5\,\%$ ein. Wie hoch ist der Endwert?',
    [r'$3152{,}50$ €', r'$3000{,}00$ €', r'$3310{,}00$ €', r'$1157{,}63$ €'],
    [r'$E = 1000 \cdot \dfrac{1{,}05^3 - 1}{0{,}05}$',
     r'$= 1000 \cdot \dfrac{0{,}157625}{0{,}05} = 1000 \cdot 3{,}15250$',
     r'$= 3152{,}50$ €, also $152{,}50$ € Zinsertrag.'])

Q.q(r'Jemand zahlt vier Jahre lang nachschüssig je $500$ € bei $4\,\%$ ein. Wie hoch ist der Endwert?',
    [r'$2123{,}23$ €', r'$2000{,}00$ €', r'$2080{,}00$ €', r'$2338{,}25$ €'],
    [r'$E = 500 \cdot \dfrac{1{,}04^4 - 1}{0{,}04}$',
     r'$= 500 \cdot \dfrac{0{,}169859}{0{,}04} \approx 500 \cdot 4{,}246464$',
     r'$\approx 2123{,}23$ €'])

Q.q(r'Wie hoch ist beim Sparplan aus der vorigen Aufgabe der reine Zinsertrag?',
    [r'etwa $123{,}23$ €', r'etwa $23{,}23$ €', r'etwa $80{,}00$ €', r'etwa $500{,}00$ €'],
    [r'Eingezahlt wurden $4 \cdot 500 = 2000$ €.',
     r'$2123{,}23 - 2000 = 123{,}23$ €',
     r'Der Zinsertrag ist die Differenz zwischen Endwert und Summe der Einzahlungen.'])

Q.q(r'Wie verändert sich der Endwert eines Sparplans, wenn die Rate verdoppelt wird?',
    [r'Er verdoppelt sich ebenfalls.', r'Er vervierfacht sich.',
     r'Er steigt um den Faktor $q$.', r'Er bleibt gleich.'],
    [r'In der Formel steht $r$ als Faktor vor dem Bruch.',
     r'Verdoppelt man $r$, verdoppelt sich das gesamte Produkt.',
     r'Die Laufzeit wirkt dagegen im Exponenten und damit viel stärker.'])

Q.q(r'Ein Sparplan läuft zehn Jahre mit jährlich $1200$ € bei $3\,\%$. Welche Größenordnung hat der Endwert?',
    [r'rund $13\,757$ €', r'rund $12\,000$ €', r'rund $16\,127$ €', r'rund $1613$ €'],
    [r'$E = 1200 \cdot \dfrac{1{,}03^{10} - 1}{0{,}03}$',
     r'$1{,}03^{10} \approx 1{,}343916$, also $E \approx 1200 \cdot 11{,}4638$',
     r'$\approx 13\,757$ €. Eingezahlt wurden $12\,000$ €, der Rest sind Zinsen.'])

# ------------------------------------------------------------ Tilgungsrechnung ----
Q.q(r'Ein Kredit über $10\,000$ € wird mit $5\,\%$ verzinst, jährlich werden $3000$ € zurückgezahlt. Wie hoch ist die Restschuld nach einem Jahr?',
    [r'$7500$ €', r'$7000$ €', r'$8000$ €', r'$7350$ €'],
    [r'Zuerst werden die Zinsen aufgeschlagen: $10\,000 \cdot 1{,}05 = 10\,500$ €.',
     r'Dann wird die Zahlung abgezogen: $10\,500 - 3000$.',
     r'$= 7500$ €. $7000$ € wäre das Ergebnis ohne Berücksichtigung der Zinsen.'])

Q.q(r'Wie hoch ist die Restschuld desselben Kredits nach zwei Jahren?',
    [r'$4875$ €', r'$4500$ €', r'$5000$ €', r'$4750$ €'],
    [r'$7500 \cdot 1{,}05 = 7875$ €',
     r'$7875 - 3000 = 4875$ €',
     r'Jedes Jahr wird dieselbe Rechnung auf die neue Restschuld angewandt.'])

Q.q(r'Wie hoch ist die Restschuld desselben Kredits nach drei Jahren?',
    [r'$2118{,}75$ €', r'$1875{,}00$ €', r'$2000{,}00$ €', r'$2500{,}00$ €'],
    [r'$4875 \cdot 1{,}05 = 5118{,}75$ €',
     r'$5118{,}75 - 3000 = 2118{,}75$ €',
     r'Im vierten Jahr wäre der Kredit mit einer kleineren Schlusszahlung getilgt.'])

Q.q(r'Wie teilt sich die erste Zahlung von $3000$ € in Zins- und Tilgungsanteil?',
    [r'$500$ € Zinsen und $2500$ € Tilgung', r'$3000$ € Zinsen und $0$ € Tilgung',
     r'$150$ € Zinsen und $2850$ € Tilgung', r'$2500$ € Zinsen und $500$ € Tilgung'],
    [r'Zinsen des ersten Jahres: $10\,000 \cdot 0{,}05 = 500$ €.',
     r'Der Rest der Zahlung tilgt: $3000 - 500 = 2500$ €.',
     r'Probe: $10\,000 - 2500 = 7500$ € Restschuld.'])

Q.q(r'Wie teilt sich die zweite Zahlung von $3000$ € auf?',
    [r'$375$ € Zinsen und $2625$ € Tilgung', r'$500$ € Zinsen und $2500$ € Tilgung',
     r'$300$ € Zinsen und $2700$ € Tilgung', r'$250$ € Zinsen und $2750$ € Tilgung'],
    [r'Zinsen auf die Restschuld: $7500 \cdot 0{,}05 = 375$ €.',
     r'Tilgung: $3000 - 375 = 2625$ €.',
     r'Probe: $7500 - 2625 = 4875$ € Restschuld.'])

Q.q(r'Warum wächst bei gleichbleibender Zahlung der Tilgungsanteil von Jahr zu Jahr?',
    [r'Weil die Restschuld sinkt und damit auch der Zinsanteil kleiner wird.',
     r'Weil der Zinssatz jedes Jahr fällt.',
     r'Weil die Zahlung jedes Jahr steigt.',
     r'Weil die Bank den Tilgungsanteil festlegt.'],
    [r'Die Zahlung bleibt gleich, sie teilt sich aber neu auf.',
     r'Die Zinsen richten sich nach der jeweiligen Restschuld, und die sinkt.',
     r'Was an Zinsen wegfällt, wird zusätzlich zur Tilgung frei — deshalb geht es am Ende schnell.'])

# ------------------------------------------------------- Angebote vergleichen ----
Q.q(r'Angebot A: $10\,000$ € zu $5\,\%$ über $4$ Jahre. Angebot B: derselbe Betrag zu $4\,\%$ über $5$ Jahre. Was lässt sich ohne Rechnung sagen?',
    [r'Nichts Sicheres — niedrigerer Zinssatz und längere Laufzeit wirken gegeneinander.',
     r'B ist immer günstiger, weil der Zinssatz niedriger ist.',
     r'A ist immer günstiger, weil die Laufzeit kürzer ist.',
     r'Beide kosten gleich viel.'],
    [r'Ein niedrigerer Zinssatz spricht für B.',
     r'Eine längere Laufzeit bedeutet aber, dass länger Zinsen anfallen.',
     r'Welcher Effekt überwiegt, zeigt erst die Rechnung mit den tatsächlichen Zahlungen.'])

Q.q(r'Worauf sollte man beim Vergleich zweier Kreditangebote vor allem achten?',
    [r'auf die Gesamtkosten über die ganze Laufzeit, nicht nur auf die Höhe der Rate',
     r'nur auf die monatliche Rate',
     r'nur auf den Zinssatz',
     r'nur auf die Laufzeit'],
    [r'Eine niedrige Rate kann durch eine lange Laufzeit erkauft sein.',
     r'Dann zahlt man insgesamt mehr, obwohl es monatlich günstiger aussieht.',
     r'Aussagekräftig ist die Summe aller Zahlungen im Vergleich zur Kreditsumme.'])

Q.q(r'Wozu eignet sich eine Tabellenkalkulation bei der Tilgungsrechnung besonders gut?',
    [r'Eine Zeile je Jahr mit Restschuld, Zinsen und Tilgung lässt sich nach unten kopieren.',
     r'Sie berechnet den Zinssatz automatisch.',
     r'Sie ersetzt die Zinseszinsformel.',
     r'Sie ist dafür ungeeignet.'],
    [r'Jede Zeile greift auf die Restschuld der Vorzeile zu.',
     r'Genau solche rekursiven Rechnungen erledigt eine Tabellenkalkulation in einem Zug.',
     r'So sieht man auf einen Blick, wie sich Zins- und Tilgungsanteil über die Jahre verschieben.'])


def check():
    from fractions import Fraction as F
    E = lambda r, q, n: r * (q ** n - 1) / (q - 1)
    assert 3 * 1000 == 3000
    q5, q4, q3 = F(105, 100), F(104, 100), F(103, 100)
    e1 = E(1000, q5, 3)
    assert e1 == F(63050, 20) and abs(float(e1) - 3152.50) < 0.01
    assert abs(float(q5 ** 3 - 1) - 0.157625) < 1e-6
    e2 = E(500, q4, 4)
    assert abs(float(e2) - 2123.23) < 0.01 and abs(float(q4 ** 4) - 1.16985856) < 1e-8
    assert abs(float(q4 ** 4 - 1) - 0.169859) < 1e-6
    assert abs(float(e2) - 2000 - 123.23) < 0.01 and 4 * 500 == 2000
    assert E(2000, q5, 3) == 2 * E(1000, q5, 3)
    e3 = E(1200, q3, 10)
    assert abs(float(e3) - 13757) < 1 and abs(float(q3 ** 10) - 1.343916) < 1e-6
    assert abs(float((q3 ** 10 - 1) / (q3 - 1)) - 11.4638) < 0.0005 and 10 * 1200 == 12000
    # Tilgung
    rest = F(10000)
    zins_1 = rest * F(5, 100)
    assert zins_1 == 500 and 3000 - 500 == 2500
    rest = rest * q5 - 3000
    assert rest == 7500 and 10000 * q5 == 10500
    zins_2 = rest * F(5, 100)
    assert zins_2 == 375 and 3000 - 375 == 2625 and 7500 - 2625 == 4875
    rest = rest * q5 - 3000
    assert rest == 4875 and 7500 * q5 == 7875
    rest = rest * q5 - 3000
    assert rest == F(211875, 100) and abs(float(rest) - 2118.75) < 0.01
    assert 4875 * q5 == F(511875, 100)


Q.verify(check)
Q.save()

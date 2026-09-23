#!/usr/bin/env python3
"""Aufgaben FO Mathe 11, Woche 34 / KW 20 (WB 2): Finanzmathematik I -
Zinsrechnung, Zinseszins, Wachstumsfaktor. Ohne Logarithmus, wie im Lehrplan der
Klassenstufe 11 vorgesehen. Plan: HTML/svp/mathe/mathefos11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos11

Q = fos11(nr=34, slug='finanzmathematik1', thema='Finanzmathematik: Zins und Zinseszins', lb='WB 2',
          blurb='Zinsen, Wachstumsfaktor, Zinseszinsformel, Kapital vorwärts und rückwärts',
          comment='Blocks: einfache Zinsrechnung (1-6), Zinseszins (7-13), rueckwaerts rechnen (14-17), Anwendungen (18-20).')

# ----------------------------------------------------- einfache Zinsrechnung ----
Q.q(r'Wie viel Zinsen bringt ein Kapital von $2000$ € in einem Jahr bei $3\,\%$?',
    [r'$60$ €', r'$600$ €', r'$6$ €', r'$2060$ €'],
    [r'$Z = 2000 \cdot 0{,}03$',
     r'$= 60$ €',
     r'$2060$ € wäre das Kapital nach dem Jahr, nicht der Zinsbetrag.'])

Q.q(r'Auf welchen Betrag wächst das Kapital aus der vorigen Aufgabe nach einem Jahr?',
    [r'$2060$ €', r'$2003$ €', r'$2600$ €', r'$60$ €'],
    [r'Kapital plus Zinsen: $2000 + 60$.',
     r'$= 2060$ €',
     r'Kürzer über den Wachstumsfaktor: $2000 \cdot 1{,}03 = 2060$ €.'])

Q.q(r'Wie lautet der Wachstumsfaktor bei einem Zinssatz von $3\,\%$?',
    [r'$1{,}03$', r'$0{,}03$', r'$3$', r'$0{,}97$'],
    [r'Aus $100\,\%$ werden $103\,\%$.',
     r'Als Faktor: $q = 1 + \dfrac{p}{100} = 1{,}03$.',
     r'$0{,}97$ wäre der Faktor bei einer Minderung um $3\,\%$.'])

Q.q(r'Ein Kapital von $2000$ € wird drei Jahre lang mit $3\,\%$ verzinst, die Zinsen werden aber jährlich ausgezahlt und nicht mitverzinst. Wie viel Zinsen sind das insgesamt?',
    [r'$180$ €', r'$185{,}45$ €', r'$60$ €', r'$2180$ €'],
    [r'Ohne Mitverzinsung bleibt der Zinsbetrag jedes Jahr gleich.',
     r'$3 \cdot 60 = 180$ €',
     r'Mit Zinseszins wären es $185{,}45$ € — die Differenz wächst mit der Laufzeit.'])

Q.q(r'Wie viel Zinsen bringt ein Kapital von $6000$ € in $4$ Monaten bei $3\,\%$ Jahreszins?',
    [r'$60$ €', r'$180$ €', r'$720$ €', r'$15$ €'],
    [r'Jahreszinsen: $6000 \cdot 0{,}03 = 180$ €.',
     r'Für $4$ von $12$ Monaten also ein Drittel davon.',
     r'$\dfrac{180}{3} = 60$ €'])

Q.q(r'Worin unterscheiden sich Zins und Zinseszins?',
    [r'Beim Zinseszins werden die Zinsen dem Kapital zugeschlagen und künftig mitverzinst.',
     r'Beim Zinseszins ist der Zinssatz höher.',
     r'Beim Zinseszins wird monatlich statt jährlich verzinst.',
     r'Es gibt keinen Unterschied.'],
    [r'Bei einfacher Verzinsung bleibt die Berechnungsgrundlage das Anfangskapital.',
     r'Beim Zinseszins wächst sie jedes Jahr mit.',
     r'Deshalb ist einfaches Zinswachstum linear, Zinseszins dagegen exponentiell.'])

# ------------------------------------------------------------------ Zinseszins ----
Q.q(r'Wie lautet die Zinseszinsformel?',
    [r'$K_n = K_0 \cdot q^n$', r'$K_n = K_0 \cdot q \cdot n$',
     r'$K_n = K_0 + q^n$', r'$K_n = K_0 \cdot n^q$'],
    [r'Jedes Jahr wird mit demselben Faktor $q$ multipliziert.',
     r'Nach $n$ Jahren also $n$-mal: $K_n = K_0 \cdot q^n$.',
     r'Das ist eine geometrische Folge mit dem Quotienten $q$.'])

Q.q(r'Auf welchen Betrag wachsen $2000$ € in drei Jahren bei $3\,\%$ Zinseszins?',
    [r'$2185{,}45$ €', r'$2180{,}00$ €', r'$2060{,}00$ €', r'$2270{,}00$ €'],
    [r'$K_3 = 2000 \cdot 1{,}03^3$',
     r'$= 2000 \cdot 1{,}092727 = 2185{,}454$',
     r'Gerundet $2185{,}45$ € — gut $5$ € mehr als bei einfacher Verzinsung.'])

Q.q(r'Auf welchen Betrag wachsen $1000$ € in zehn Jahren bei $5\,\%$?',
    [r'$1628{,}89$ €', r'$1500{,}00$ €', r'$1050{,}00$ €', r'$2000{,}00$ €'],
    [r'$K_{10} = 1000 \cdot 1{,}05^{10}$',
     r'$\approx 1000 \cdot 1{,}62889 = 1628{,}89$ €',
     r'$1500$ € wäre die einfache Verzinsung — der Zinseszins bringt gut $128$ € mehr.'])

Q.q(r'Auf welchen Betrag wachsen $5000$ € in fünf Jahren bei $2\,\%$?',
    [r'$5520{,}40$ €', r'$5500{,}00$ €', r'$5100{,}00$ €', r'$6000{,}00$ €'],
    [r'$K_5 = 5000 \cdot 1{,}02^5$',
     r'$\approx 5000 \cdot 1{,}10408 = 5520{,}40$ €',
     r'Auf fünf Jahre macht der Zinseszins hier gut $20$ € aus.'])

Q.q(r'Nach wie vielen Jahren hat sich ein Kapital bei $5\,\%$ etwa verdoppelt?',
    [r'nach etwa $15$ Jahren', r'nach etwa $20$ Jahren', r'nach etwa $10$ Jahren', r'nach etwa $50$ Jahren'],
    [r'Gesucht ist $1{,}05^n \approx 2$; mit dem GTR probiert man.',
     r'$1{,}05^{14} \approx 1{,}98$ und $1{,}05^{15} \approx 2{,}08$.',
     r'Also nach rund $15$ Jahren. Ohne Zinseszins wären $20$ Jahre nötig.'])

Q.q(r'Ein Kapital wächst mit dem Faktor $q = 1{,}04$. Wie hoch ist der Zinssatz?',
    [r'$4\,\%$', r'$1{,}04\,\%$', r'$104\,\%$', r'$0{,}4\,\%$'],
    [r'$q = 1 + \dfrac{p}{100}$',
     r'$1{,}04 - 1 = 0{,}04$, also $p = 4$.',
     r'Der Zinssatz beträgt $4\,\%$.'])

Q.q(r'Warum wächst ein Kapital bei Zinseszins exponentiell und nicht linear?',
    [r'Weil jedes Jahr mit demselben Faktor multipliziert wird, statt denselben Betrag zu addieren.',
     r'Weil der Zinssatz jedes Jahr steigt.',
     r'Weil die Laufzeit im Exponenten der Zinsen steht.',
     r'Weil die Zinsen jedes Jahr niedriger werden.'],
    [r'Linear heißt: gleicher Zuwachs je Zeitschritt.',
     r'Exponentiell heißt: gleicher Faktor je Zeitschritt.',
     r'Beim Zinseszins wächst die Grundlage mit, deshalb wird der Zuwachs jedes Jahr größer.'])

# ------------------------------------------------------- rückwärts rechnen ----
Q.q(r'Welches Anfangskapital ergibt bei $10\,\%$ nach zwei Jahren genau $1210$ €?',
    [r'$1000$ €', r'$1100$ €', r'$1008{,}33$ €', r'$968$ €'],
    [r'$K_0 = \dfrac{K_n}{q^n} = \dfrac{1210}{1{,}1^2}$',
     r'$= \dfrac{1210}{1{,}21} = 1000$ €',
     r'Probe: $1000 \cdot 1{,}21 = 1210$ €.'])

Q.q(r'Ein Kapital von $1000$ € ist nach zwei Jahren auf $1102{,}50$ € gewachsen. Wie hoch war der Zinssatz?',
    [r'$5\,\%$', r'$10{,}25\,\%$', r'$5{,}125\,\%$', r'$2\,\%$'],
    [r'$q^2 = \dfrac{1102{,}50}{1000} = 1{,}1025$',
     r'$q = \sqrt{1{,}1025} = 1{,}05$',
     r'Also $5\,\%$. Die $10{,}25\,\%$ sind der Gesamtzuwachs über beide Jahre.'])

Q.q(r'Wie berechnet man den Zinssatz aus Anfangs- und Endkapital bei $n$ Jahren?',
    [r'$q = \sqrt[n]{\dfrac{K_n}{K_0}}$', r'$q = \dfrac{K_n}{K_0 \cdot n}$',
     r'$q = \dfrac{K_n - K_0}{n}$', r'$q = \left(\dfrac{K_n}{K_0}\right)^n$'],
    [r'Aus $K_n = K_0 \cdot q^n$ folgt $q^n = \dfrac{K_n}{K_0}$.',
     r'Die $n$-te Wurzel liefert $q$.',
     r'Der Zinssatz ist dann $p = (q - 1) \cdot 100$.'])

Q.q(r'Ein Kapital von $4000$ € wächst in $3$ Jahren auf $4630{,}50$ €. Wie hoch ist der Zinssatz?',
    [r'$5\,\%$', r'$4\,\%$', r'$6\,\%$', r'$5{,}25\,\%$'],
    [r'$q^3 = \dfrac{4630{,}50}{4000} = 1{,}157625$',
     r'$q = \sqrt[3]{1{,}157625} = 1{,}05$',
     r'Also $5\,\%$. Probe: $4000 \cdot 1{,}05^3 = 4630{,}50$ €.'])

# ----------------------------------------------------------------- Anwendungen ----
Q.q(r'Jemand legt $3000$ € für $6$ Jahre bei $2{,}5\,\%$ an. Welchen Betrag erhält er am Ende?',
    [r'etwa $3479{,}08$ €', r'etwa $3450{,}00$ €', r'etwa $3075{,}00$ €', r'etwa $4500{,}00$ €'],
    [r'$K_6 = 3000 \cdot 1{,}025^6$',
     r'$\approx 3000 \cdot 1{,}159693 = 3479{,}08$ €',
     r'Die einfache Verzinsung ergäbe $3450$ € — rund $29$ € weniger.'])

Q.q(r'Ein Kredit von $8000$ € wird mit $6\,\%$ verzinst und zwei Jahre lang nicht getilgt. Welche Schuld besteht dann?',
    [r'$8988{,}80$ €', r'$8960{,}00$ €', r'$8480{,}00$ €', r'$9600{,}00$ €'],
    [r'Auch Schulden wachsen mit dem Zinseszins.',
     r'$8000 \cdot 1{,}06^2 = 8000 \cdot 1{,}1236$',
     r'$= 8988{,}80$ €. Ohne Tilgung wächst die Schuld also spürbar.'])

Q.q(r'Die Preise steigen jährlich um $2\,\%$. Wie viel ist ein heutiger Euro in zehn Jahren wert?',
    [r'etwa $0{,}82$ €', r'etwa $0{,}80$ €', r'etwa $1{,}22$ €', r'etwa $0{,}98$ €'],
    [r'Die Kaufkraft sinkt um denselben Faktor, um den die Preise steigen.',
     r'$\dfrac{1}{1{,}02^{10}} \approx \dfrac{1}{1{,}21899}$',
     r'$\approx 0{,}82$ €. Rund ein Fünftel der Kaufkraft ist in zehn Jahren dahin.'])


def check():
    from fractions import Fraction as F
    assert 2000 * F(3, 100) == 60 and 2000 + 60 == 2060 and 2000 * F(103, 100) == 2060
    assert F(103, 100) == 1 + F(3, 100)
    assert 3 * 60 == 180 and 2000 + 180 == 2180
    assert 6000 * F(3, 100) == 180 and F(180, 3) == 60
    # Zinseszins
    k3 = 2000 * F(103, 100) ** 3
    assert abs(float(k3) - 2185.454) < 0.001 and round(float(k3), 2) == 2185.45
    assert abs(float(F(103, 100) ** 3) - 1.092727) < 1e-6
    k10 = 1000 * F(105, 100) ** 10
    assert abs(float(k10) - 1628.89) < 0.01 and abs(float(F(105, 100) ** 10) - 1.62889) < 1e-5
    assert 1000 + 10 * 50 == 1500
    k5 = 5000 * F(102, 100) ** 5
    assert abs(float(k5) - 5520.40) < 0.01 and abs(float(F(102, 100) ** 5) - 1.104081) < 1e-6
    assert abs(float(F(105, 100) ** 14) - 1.9799) < 0.0005
    assert abs(float(F(105, 100) ** 15) - 2.0789) < 0.0005
    assert float(F(105, 100) ** 14) < 2 < float(F(105, 100) ** 15)
    assert F(104, 100) - 1 == F(4, 100)
    # rueckwaerts
    assert F(1210, 1) / F(11, 10) ** 2 == 1000 and F(11, 10) ** 2 == F(121, 100)
    assert F(11025, 10000) == F(105, 100) ** 2
    assert F(46305, 10) / 4000 == F(105, 100) ** 3
    assert abs(float(F(105, 100) ** 3) - 1.157625) < 1e-6
    assert 4000 * F(105, 100) ** 3 == F(46305, 10)
    # Anwendungen
    k6 = 3000 * F(1025, 1000) ** 6
    assert abs(float(k6) - 3479.08) < 0.01 and abs(float(F(1025, 1000) ** 6) - 1.159693) < 1e-6
    assert 3000 + 6 * 75 == 3450
    assert 8000 * F(106, 100) ** 2 == F(898880, 100) and abs(float(8000 * F(106, 100) ** 2) - 8988.80) < 0.01
    assert abs(float(F(102, 100) ** 10) - 1.21899) < 1e-5
    assert abs(1 / float(F(102, 100) ** 10) - 0.82) < 0.005


Q.verify(check)
Q.save()

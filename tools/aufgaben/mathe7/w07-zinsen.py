#!/usr/bin/env python3
"""Exercises OS Mathe 7 (Realschule), week 7 / KW 40 (LB 1): interest as percent
arithmetic - capital, interest rate, interest; yearly, monthly and daily interest with the
bank year of 360 days; savings and loans. Plan: HTML/svp/mathe/mathe7.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from decimal import Decimal as D
from quiz import os7

Q = os7(nr=7, slug='zinsen', thema='Zinsen', lb='LB 1',
        blurb='Kapital, Zinssatz, Zinsen, Jahres-, Monats- und Tageszinsen, Sparen und Kredit',
        comment='Blocks: terms (1-2, 10-11, 18), yearly interest (3-7, 17), months and days (8-9, 13, 15-16, 20), loans and comparisons (12, 14, 19).')

Z = lambda K, p, t=360: D(str(K)) * D(str(p)) / 100 * D(t) / 360

# -------------------------------------------------------------------------- terms ----
Q.q(r'Wie heißt der Geldbetrag, den man bei der Bank anlegt oder sich leiht?',
    [r'Kapital', r'Zinssatz', r'Zinsen', r'Rabatt'],
    [r'Zinsrechnung ist Prozentrechnung mit eigenen Namen.',
     r'Das Kapital $K$ ist der Grundwert.',
     r'Der Zinssatz $p\,\%$ ist der Prozentsatz, die Zinsen $Z$ sind der Prozentwert.'])

Q.q(r'Wie heißt bei der Zinsrechnung der Prozentsatz?',
    [r'Zinssatz', r'Kapital', r'Zinsen', r'Skonto'],
    [r'Der Zinssatz gibt an, wie viel Prozent des Kapitals man in einem Jahr bekommt oder zahlen muss.',
     r'Beispiel: 2 % pro Jahr.',
     r'Er heißt auch Jahreszinssatz.'])

Q.q(r'Mit wie vielen Tagen rechnen Banken in Deutschland meist für ein Zinsjahr?',
    [r'360', r'365', r'100', r'12'],
    [r'Bei der kaufmännischen Zinsrechnung vereinfacht man:',
     r'Jeder Monat hat 30 Tage.',
     r'$12 \cdot 30 = 360$ Tage'])

Q.q(r'Mit wie vielen Tagen rechnet man dabei für einen Monat?',
    [r'30', r'31', r'28', r'4'],
    [r'Das Zinsjahr hat 360 Tage.',
     r'$360 : 12 = 30$',
     r'Jeder Monat zählt 30 Tage, auch der Februar.'])

Q.q(r'Wer zahlt bei einem Kredit die Zinsen?',
    [r'die Person, die sich das Geld leiht', r'die Bank', r'niemand', r'der Staat'],
    [r'Beim Sparen leiht man der Bank Geld: Die Bank zahlt Zinsen.',
     r'Beim Kredit leiht die Bank Geld aus.',
     r'Dann zahlt die Person, die sich Geld leiht, Zinsen an die Bank.'])

# ------------------------------------------------------------------ yearly interest ----
Q.q(r'500 € werden ein Jahr lang zu 2 % angelegt. Wie viele Zinsen gibt es?',
    [r'10 €', r'1 €', r'100 €', r'510 €'],
    [r'$Z = K \cdot \dfrac{p}{100} = 500 \cdot \dfrac{2}{100}$',
     r'$= 5 \cdot 2$',
     r'$= 10$ €'])

Q.q(r'1200 € werden ein Jahr lang zu 3,5 % angelegt. Wie viele Zinsen gibt es?',
    [r'42 €', r'35 €', r'4,20 €', r'420 €'],
    [r'1 % von 1200 € sind 12 €.',
     r'$3{,}5 \cdot 12$',
     r'$= 42$ €'])

Q.q(r'800 € werden ein Jahr lang zu 2,5 % angelegt. Wie viel Geld ist nach einem Jahr auf dem Konto?',
    [r'820 €', r'20 €', r'802,50 €', r'1000 €'],
    [r'Zinsen: 1 % sind 8 €, also $2{,}5 \cdot 8 = 20$ €.',
     r'Neues Guthaben: $800 + 20$',
     r'$= 820$ € (oder $800 \cdot 1{,}025$).'])

Q.q(r'2000 € bringen in einem Jahr 60 € Zinsen. Wie hoch ist der Zinssatz?',
    [r'3 %', r'6 %', r'0,3 %', r'30 %'],
    [r'Zinssatz = Zinsen : Kapital',
     r'$\dfrac{60}{2000} = \dfrac{3}{100}$',
     r'= 3 %'])

Q.q(r'Bei 4 % Zinsen bekommt Max in einem Jahr 36 €. Wie viel Geld hat er angelegt?',
    [r'900 €', r'144 €', r'1440 €', r'90 €'],
    [r'4 % → 36 €',
     r'1 % → 9 €',
     r'100 % → 900 €'])

Q.q(r'1000 € liegen 2 Jahre zu 3 %. Die Zinsen werden jedes Jahr abgehoben. Wie viele Zinsen gibt es insgesamt?',
    [r'60 €', r'30 €', r'61,80 €', r'600 €'],
    [r'Pro Jahr: 3 % von 1000 € = 30 €.',
     r'Weil die Zinsen abgehoben werden, bleibt das Kapital 1000 €.',
     r'Zwei Jahre: $2 \cdot 30 = 60$ €'])

# ------------------------------------------------------------------ months and days ----
Q.q(r'3000 € werden 6 Monate lang zu 2 % angelegt. Wie viele Zinsen gibt es?',
    [r'30 €', r'60 €', r'360 €', r'5 €'],
    [r'Jahreszinsen: 2 % von 3000 € = 60 €.',
     r'6 Monate sind ein halbes Jahr.',
     r'$60 : 2 = 30$ €'])

Q.q(r'1800 € werden 90 Tage lang zu 4 % angelegt. Wie viele Zinsen gibt es?',
    [r'18 €', r'72 €', r'162 €', r'1,80 €'],
    [r'Jahreszinsen: 4 % von 1800 € = 72 €.',
     r'90 Tage sind $\dfrac{90}{360} = \dfrac{1}{4}$ Jahr.',
     r'$72 : 4 = 18$ €'])

Q.q(r'Mit welcher Formel berechnet man Tageszinsen für $t$ Tage?',
    [r'$Z = K \cdot \dfrac{p}{100} \cdot \dfrac{t}{360}$', r'$Z = K \cdot \dfrac{p}{100} \cdot t$',
     r'$Z = K \cdot p \cdot 360$', r'$Z = \dfrac{K}{t}$'],
    [r'Erst die Zinsen für ein ganzes Jahr: $K \cdot \dfrac{p}{100}$.',
     r'Davon nur den Anteil $\dfrac{t}{360}$ des Jahres.',
     r'$Z = K \cdot \dfrac{p}{100} \cdot \dfrac{t}{360}$'])

Q.q(r'Ein Konto ist 30 Tage lang mit 400 € im Minus. Die Bank verlangt dafür 12 % Zinsen im Jahr. Wie viele Zinsen sind das?',
    [r'4 €', r'48 €', r'12 €', r'1,20 €'],
    [r'Jahreszinsen: 12 % von 400 € = 48 €.',
     r'30 Tage sind ein Monat, also $\dfrac{1}{12}$ Jahr.',
     r'$48 : 12 = 4$ €'])

Q.q(r'600 € bringen bei 3 % Zinsen 9 € Zinsen. Wie lange waren sie angelegt?',
    [r'6 Monate', r'3 Monate', r'1 Jahr', r'9 Monate'],
    [r'Jahreszinsen wären 3 % von 600 € = 18 €.',
     r'9 € sind die Hälfte davon.',
     r'Also ein halbes Jahr, 6 Monate.'])

Q.q(r'3600 € liegen zu 2 % auf dem Konto. Wie viele Zinsen bringt das an einem Tag?',
    [r'0,20 €', r'2 €', r'72 €', r'0,02 €'],
    [r'Jahreszinsen: 2 % von 3600 € = 72 €.',
     r'Ein Zinsjahr hat 360 Tage.',
     r'$72 : 360 = 0{,}20$ €'])

# ---------------------------------------------------------- loans and comparisons ----
Q.q(r'Familie Kaya leiht sich 5000 € für ein Jahr zu 6 %. Wie viel muss sie nach einem Jahr zurückzahlen?',
    [r'5300 €', r'300 €', r'5060 €', r'5600 €'],
    [r'Zinsen: 6 % von 5000 € = 300 €.',
     r'Zurück zahlt man Kredit plus Zinsen.',
     r'$5000 + 300 = 5300$ €'])

Q.q(r'Für 1000 € bietet Bank A 2,5 % Zinsen im Jahr, Bank B 2,2 % und dazu 10 € Bonus. Wo bekommt man nach einem Jahr mehr?',
    [r'bei Bank B (32 € statt 25 €)', r'bei Bank A (25 € statt 22 €)', r'bei beiden gleich viel', r'bei Bank A, weil 2,5 % mehr ist'],
    [r'A: 2,5 % von 1000 € = 25 €.',
     r'B: 2,2 % von 1000 € = 22 €, dazu 10 € Bonus = 32 €.',
     r'Bank B bringt mehr – erst rechnen, dann entscheiden.'])

Q.q(r'Ein Fernseher kostet bar 600 €. Bei Ratenzahlung zahlt man 12 Raten zu je 54 €. Um wie viel Prozent ist der Ratenkauf teurer?',
    [r'8 %', r'48 %', r'54 %', r'4,8 %'],
    [r'Ratenkauf: $12 \cdot 54 = 648$ €',
     r'Mehrkosten: $648 - 600 = 48$ €',
     r'$\dfrac{48}{600} = \dfrac{8}{100} = 8\,\%$'])


def check():
    assert Z(500, 2) == 10 and Z(1200, '3.5') == 42 and 800 + Z(800, '2.5') == 820
    assert D(60) / 2000 * 100 == 3 and D(36) / 4 * 100 == 900 and 2 * Z(1000, 3) == 60
    assert Z(3000, 2, 180) == 30 and Z(1800, 4, 90) == 18 and Z(400, 12, 30) == 4
    assert Z(600, 3, 180) == 9 and Z(3600, 2, 1) == D('0.2')
    assert 5000 + Z(5000, 6) == 5300
    assert Z(1000, '2.5') == 25 and Z(1000, '2.2') + 10 == 32
    assert 12 * 54 == 648 and D(48) / 600 * 100 == 8
    assert 12 * 30 == 360


Q.verify(check)
Q.save()

#!/usr/bin/env python3
"""Aufgaben OS Mathe 8 (Realschule), Woche 35 / KW 21 (LB 6): Lebenshaltungskosten -
Miete, Nebenkosten, Strom und Wasser mit Abschlägen, Rechnungen prüfen. Plan: HTML/svp/mathe/mathe8.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os8

Q = os8(nr=35, slug='lebenshaltungskosten', thema='Lebenshaltungskosten', lb='LB 6',
        blurb='Miete und Nebenkosten, Strom- und Wasserabrechnung, Abschläge, Mehrwertsteuer, Rechnungen prüfen',
        comment='All prices are plausible examples, not current tariffs. Blocks: rent (1-3, 11-12), energy and water (4-7, 15-18), VAT and invoices (8-10, 13-14), budget (19-20).')

# ------------------------------------------------------------------- Miete ----
Q.q(r'Eine Wohnung kostet 520 € Kaltmiete, 140 € Nebenkosten und 85 € Heizkosten im Monat. Wie hoch ist die Warmmiete?',
    [r'745 €', r'660 €', r'605 €', r'435 €'],
    [r'Warmmiete = Kaltmiete + Nebenkosten + Heizkosten',
     r'$520 + 140 + 85 = 745$ €'])

Q.q(r'Die Wohnung hat 65 m² und kostet 520 € kalt. Wie hoch ist die Kaltmiete pro Quadratmeter?',
    [r'8,00 €', r'12,50 €', r'0,13 €', r'6,50 €'],
    [r'$520 : 65 = 8$',
     r'Also 8,00 € pro m².'])

Q.q(r'Die Kaltmiete von 520 € wird um 8 % erhöht. Wie hoch ist die neue Kaltmiete?',
    [r'561,60 €', r'528,00 €', r'41,60 €', r'478,40 €'],
    [r'Erhöhung: $520 \cdot 0{,}08 = 41{,}60$ €',
     r'Neu: $520 \cdot 1{,}08 = 561{,}60$ €'])

# ------------------------------------------------------------ Strom, Wasser ----
Q.q(r'Ein Stromtarif hat 12,50 € Grundpreis pro Monat und 0,32 € pro kWh. Ein Haushalt verbraucht 2400 kWh im Jahr. Wie hoch sind die Jahreskosten?',
    [r'918 €', r'780,50 €', r'768 €', r'1068 €'],
    [r'Grundpreis: $12 \cdot 12{,}50 = 150$ €',
     r'Arbeitspreis: $2400 \cdot 0{,}32 = 768$ €',
     r'Zusammen $150 + 768 = 918$ €'])

Q.q(r'Die Jahreskosten von 918 € werden in 12 gleichen monatlichen Abschlägen bezahlt. Wie hoch ist ein Abschlag?',
    [r'76,50 €', r'91,80 €', r'75,00 €', r'64,00 €'],
    [r'$918 : 12 = 76{,}50$ €'])

Q.q(r'Ein Haushalt hat 12 Abschläge zu je 70 € gezahlt. Die Jahresabrechnung ergibt 918 €. Was ist die Folge?',
    [r'eine Nachzahlung von 78 €', r'eine Rückzahlung von 78 €', r'eine Nachzahlung von 848 €', r'Es bleibt alles gleich.'],
    [r'Gezahlt: $12 \cdot 70 = 840$ €',
     r'Fehlbetrag: $918 - 840 = 78$ €, das muss nachgezahlt werden.'])

Q.q(r'Frischwasser kostet 2,10 € pro m³, Abwasser 2,60 € pro m³. Ein Haushalt verbraucht 90 m³ im Jahr. Wie hoch sind die Wasserkosten?',
    [r'423 €', r'189 €', r'234 €', r'211,50 €'],
    [r'Jeder Kubikmeter kostet zusammen $2{,}10 + 2{,}60 = 4{,}70$ €.',
     r'$90 \cdot 4{,}70 = 423$ €'])

# --------------------------------------------------------- Mehrwertsteuer ----
Q.q(r'Ein Gerät kostet netto 250 €. Dazu kommen 19 % Mehrwertsteuer. Wie hoch ist der Bruttopreis?',
    [r'297,50 €', r'269,00 €', r'47,50 €', r'202,50 €'],
    [r'$250 \cdot 1{,}19 = 297{,}50$ €'])

Q.q(r'Ein Preis von 119 € enthält 19 % Mehrwertsteuer. Wie hoch ist der Nettopreis?',
    [r'100 €', r'96,39 €', r'22,61 €', r'138,61 €'],
    [r'Brutto = 119 % vom Netto.',
     r'Netto $= 119 : 1{,}19 = 100$ €',
     r'96,39 € entsteht, wenn man fälschlich 19 % von 119 € abzieht.'])

Q.q(r'Auf einem Kassenbon stehen 3 Hefte zu 4,99 € und 2 Stifte zu 2,49 €, Summe 20,45 €. Was ist der richtige Betrag?',
    [r'19,95 €', r'20,45 €', r'17,46 €', r'22,44 €'],
    [r'$3 \cdot 4{,}99 = 14{,}97$ und $2 \cdot 2{,}49 = 4{,}98$',
     r'$14{,}97 + 4{,}98 = 19{,}95$ €; der Bon ist um 0,50 € zu hoch.'])

Q.q(r'Eine Person verdient 2400 € netto im Monat und zahlt 745 € Warmmiete. Wie viel Prozent des Einkommens sind das (gerundet)?',
    [r'31 %', r'3 %', r'32 %', r'25 %'],
    [r'$745 : 2400 \approx 0{,}310$',
     r'Also etwa 31 %.'])

Q.q(r'Ein Haus hat 400 m² Wohnfläche und 6000 € Betriebskosten im Jahr, verteilt nach Fläche. Wie viel zahlt eine Wohnung mit 80 m²?',
    [r'1200 €', r'480 €', r'1500 €', r'75 €'],
    [r'Anteil: $\dfrac{80}{400} = \dfrac{1}{5} = 20$ %',
     r'$6000 \cdot 0{,}2 = 1200$ €'])

Q.q(r'Ein Handyvertrag läuft 24 Monate zu 19,99 € monatlich, dazu einmalig 1 € für das Gerät. Was kostet er insgesamt?',
    [r'480,76 €', r'479,76 €', r'20,99 €', r'503,76 €'],
    [r'$24 \cdot 19{,}99 = 479{,}76$ €',
     r'Plus 1 €: 480,76 €'])

Q.q(r'Eine Haftpflichtversicherung kostet 6,50 € im Monat oder 72 € im Jahr. Wie viel spart man bei jährlicher Zahlung?',
    [r'6 €', r'65,50 €', r'0,50 €', r'12 €'],
    [r'Monatlich über ein Jahr: $12 \cdot 6{,}50 = 78$ €',
     r'Ersparnis: $78 - 72 = 6$ €'])

Q.q(r'Ein Haushalt heizt mit Gas zu 0,12 € pro kWh und verbraucht 12 000 kWh im Jahr. Wie hoch sind die Gaskosten (ohne Grundpreis)?',
    [r'1440 €', r'144 €', r'100 000 €', r'14 400 €'],
    [r'$12\,000 \cdot 0{,}12 = 1440$ €'])

Q.q(r'Der Strompreis steigt von 0,32 € auf 0,36 € pro kWh. Um wie viel Prozent ist er gestiegen?',
    [r'12,5 %', r'4 %', r'11,1 %', r'0,04 %'],
    [r'Anstieg: 0,04 €',
     r'$\dfrac{0{,}04}{0{,}32} = 0{,}125 = 12{,}5$ %',
     r'11,1 % entsteht, wenn man auf den neuen Preis bezieht.'])

Q.q(r'Ein Kühlschrank verbraucht 150 kWh im Jahr. Was kostet sein Strom bei 0,32 € pro kWh?',
    [r'48 €', r'4,80 €', r'468,75 €', r'150,32 €'],
    [r'$150 \cdot 0{,}32 = 48$ €'])

Q.q(r'Ein Gerät verbraucht im Stand-by 10 Watt, das ganze Jahr über. Was kostet das bei 0,32 € pro kWh (gerundet)?',
    [r'28 €', r'3 €', r'280 €', r'0,08 €'],
    [r'$10 \text{ W} \cdot 24 \text{ h} \cdot 365 = 87\,600$ Wh = 87,6 kWh',
     r'$87{,}6 \cdot 0{,}32 \approx 28{,}03$ €'])

# ----------------------------------------------------------------- Budget ----
Q.q(r'Ein Haushalt hat 2600 € Einnahmen im Monat. Ausgaben: 745 € Miete, 520 € Lebensmittel, 900 € Sonstiges. Wie viel bleibt übrig?',
    [r'435 €', r'1165 €', r'535 €', r'335 €'],
    [r'Ausgaben: $745 + 520 + 900 = 2165$ €',
     r'Rest: $2600 - 2165 = 435$ €'])

Q.q(r'Welcher Anteil der Einnahmen von 2600 € entfällt auf Lebensmittel (520 €)?',
    [r'20 %', r'5 %', r'52 %', r'26 %'],
    [r'$\dfrac{520}{2600} = 0{,}2 = 20$ %'])


def check():
    from fractions import Fraction as F
    assert 520 + 140 + 85 == 745 and F(520, 65) == 8
    assert 520 * F('1.08') == F('561.6')
    y = 12 * F('12.5') + 2400 * F('0.32')
    assert y == 918 and y / 12 == F('76.5') and y - 12 * 70 == 78
    assert 90 * (F('2.1') + F('2.6')) == 423
    assert 250 * F('1.19') == F('297.5') and F(119) / F('1.19') == 100 and round(119 * 0.81, 2) == 96.39
    assert 3 * F('4.99') + 2 * F('2.49') == F('19.95') and F('20.45') - F('19.95') == F('0.5')
    assert round(745 / 2400 * 100) == 31
    assert 6000 * F(80, 400) == 1200
    assert 24 * F('19.99') + 1 == F('480.76')
    assert 12 * F('6.5') - 72 == 6
    assert 12000 * F('0.12') == 1440
    assert F('0.04') / F('0.32') == F('0.125') and round(0.04 / 0.36 * 100, 1) == 11.1
    assert 150 * F('0.32') == 48
    assert round(10 * 24 * 365 / 1000 * 0.32, 2) == 28.03
    assert 2600 - (745 + 520 + 900) == 435 and F(520, 2600) == F(1, 5)


Q.verify(check)
Q.save()

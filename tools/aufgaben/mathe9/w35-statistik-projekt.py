#!/usr/bin/env python3
"""Aufgaben OS Mathe 9 (Realschule), Woche 35 / KW 21 (LB 4): Projekt statistische Erhebung -
Fragebogen, Stichprobe, Auswertung mit Tabellenkalkulation, Nachhaltigkeit. Plan: HTML/svp/mathe/mathe9.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os9

Q = os9(nr=35, slug='statistik-projekt', thema='Projekt: Eine statistische Erhebung', lb='LB 4',
        blurb='Fragestellung, Fragebogen, Stichprobe, Auswertung, Diagramme, Verkehrsmittel und regionale Produkte',
        comment='Emission values are rounded example values, not official figures. Blocks: planning (1-3, 13-14), counting and shares (4-6, 10, 12, 15, 19), diagrams and spreadsheet (7-9), data checks (16-17), sustainability (11, 18, 20).')

# ---------------------------------------------------------------- Planung ----
Q.q(r'In welcher Reihenfolge läuft eine statistische Erhebung sinnvoll ab?',
    [r'Frage festlegen, Daten erheben, auswerten, darstellen, bewerten', r'Diagramm zeichnen, Frage festlegen, Daten erheben',
     r'Ergebnis festlegen, passende Daten suchen', r'Daten erheben, Frage danach überlegen'],
    [r'Zuerst muss klar sein, was man wissen will.',
     r'Erst dann kann man die passenden Daten erheben und auswerten.'])

Q.q(r'Welche Frage ist geschlossen und gut auszuwerten?',
    [r'„Wie kommst du meistens zur Schule? (Bus / Rad / zu Fuß / Auto)“', r'„Was denkst du über den Schulweg?“',
     r'„Erzähl etwas über deine Mobilität.“', r'„Warum?“'],
    [r'Feste Antwortmöglichkeiten lassen sich leicht auszählen.',
     r'Offene Fragen liefern Texte, die man erst einordnen muss.'])

Q.q(r'Wie wählt man eine Stichprobe für eine Schulumfrage am besten aus?',
    [r'zufällig aus allen Klassenstufen', r'nur die eigenen Freundinnen und Freunde', r'nur eine Klasse', r'nur Personen, die sich freiwillig melden'],
    [r'Die Stichprobe soll die ganze Schule gut abbilden.',
     r'Freunde oder Freiwillige antworten oft ähnlich und verfälschen das Bild.'])

# --------------------------------------------------------- Auszählen, Anteile ----
Q.q(r'Wozu dient eine Strichliste?',
    [r'um beim Erheben die absoluten Häufigkeiten zu zählen', r'um den Mittelwert zu berechnen', r'um ein Kreisdiagramm zu zeichnen', r'um Fragen zu formulieren'],
    [r'Jede Antwort ergibt einen Strich, Fünferbündel erleichtern das Zählen.'])

Q.q(r'Von 200 Befragten fahren 64 mit dem Rad zur Schule. Wie groß ist die relative Häufigkeit?',
    [r'32 %', r'64 %', r'3,1 %', r'0,64 %'],
    [r'$\dfrac{64}{200} = 0{,}32 = 32$ %'])

Q.q(r'Welcher Mittelpunktswinkel gehört im Kreisdiagramm zu 32 %?',
    [r'$115{,}2^\circ$', r'$32^\circ$', r'$64^\circ$', r'$120^\circ$'],
    [r'$0{,}32 \cdot 360^\circ = 115{,}2^\circ$'])

# --------------------------------------------- Diagramme, Tabellenkalkulation ----
Q.q(r'Welches Diagramm zeigt am besten, wie sich die Zahl der Radfahrenden über mehrere Jahre entwickelt?',
    [r'ein Liniendiagramm', r'ein Kreisdiagramm', r'eine Strichliste', r'ein Piktogramm ohne Achsen'],
    [r'Entwicklungen über die Zeit zeigt man mit einer Linie über einer Zeitachse.'])

Q.q(r'Welches Diagramm eignet sich, um die Häufigkeiten verschiedener Verkehrsmittel nebeneinander zu vergleichen?',
    [r'ein Säulendiagramm', r'ein Liniendiagramm', r'eine Wertetabelle mit $x$ und $y$', r'ein Streckenzug'],
    [r'Säulen für jede Kategorie machen Unterschiede direkt sichtbar.'])

Q.q(r'In C2 steht die Anteilsformel =B2/B7, in B7 die Summe. Warum muss der Bezug auf B7 beim Kopieren nach unten festgehalten werden?',
    [r'Sonst wird beim Kopieren aus B7 nacheinander B8, B9, … und die Summe fehlt.', r'Weil B7 sonst gelöscht wird.',
     r'Weil man nur einmal teilen darf.', r'Das muss man nicht, es geht auch so.'],
    [r'Beim Kopieren nach unten wandern relative Bezüge mit: B2 wird B3, B7 würde B8.',
     r'Ein fester (absoluter) Bezug auf die Zeile 7 verhindert das.'])

Q.q(r'150 Personen wurden befragt, 45 kaufen oft regionale Lebensmittel. Wie viel Prozent sind das?',
    [r'30 %', r'45 %', r'3,3 %', r'15 %'],
    [r'$\dfrac{45}{150} = 0{,}3 = 30$ %'])

Q.q(r'Ein Schulweg ist 12 km lang. Mit dem Auto entstehen pro Person etwa 150 g CO₂ pro km, mit dem Bus etwa 80 g. Wie viel spart man auf einem Weg?',
    [r'840 g', r'70 g', r'1800 g', r'960 g'],
    [r'Ersparnis pro km: $150 - 80 = 70$ g',
     r'$12 \cdot 70 = 840$ g'])

Q.q(r'Bei einer Frage waren mehrere Antworten erlaubt. Die Prozentwerte ergeben zusammen 140 %. Ist das ein Fehler?',
    [r'Nein, bei Mehrfachantworten kann die Summe über 100 % liegen.', r'Ja, die Summe muss immer 100 % sein.',
     r'Ja, man hat falsch gezählt.', r'Nein, man muss die Werte halbieren.'],
    [r'Jede Person kann mehrfach gezählt werden.',
     r'Ein Kreisdiagramm passt dann allerdings nicht.'])

Q.q(r'Was ist an der Frage „Fährst du umweltbewusst mit dem Rad oder bequem mit dem Auto?“ problematisch?',
    [r'Sie wertet die Antworten schon vorher und lenkt.', r'Sie ist zu kurz.', r'Sie hat nur zwei Antworten.', r'Nichts.'],
    [r'Wörter wie „umweltbewusst“ und „bequem“ beeinflussen die Antwort.'])

Q.q(r'Warum werden Umfragen meist anonym durchgeführt?',
    [r'zum Schutz der persönlichen Daten und damit ehrlich geantwortet wird', r'weil Namen nicht ausgewertet werden können',
     r'weil es sonst zu lange dauert', r'Das ist nicht wichtig.'],
    [r'Datenschutz: Persönliche Angaben dürfen nicht ohne Weiteres gesammelt werden.',
     r'Ohne Namen antworten viele ehrlicher.'])

Q.q(r'In der Stichprobe nutzen 30 % den Bus. Wie viele wären das an einer Schule mit 600 Personen ungefähr?',
    [r'etwa 180', r'etwa 30', r'etwa 200', r'etwa 420'],
    [r'$0{,}3 \cdot 600 = 180$'])

Q.q(r'Bei der Frage nach der Länge des Schulwegs steht einmal „250 km“. Was tut man?',
    [r'Den Wert prüfen: Wahrscheinlich ein Tippfehler, er darf die Auswertung nicht verfälschen.', r'Ihn so übernehmen.',
     r'Alle Werte mit 250 multiplizieren.', r'Die ganze Umfrage verwerfen.'],
    [r'Ausreißer erst prüfen, dann begründet entscheiden.',
     r'Ein solcher Wert würde das Mittel stark verfälschen.'])

Q.q(r'Wie bestimmt man aus 25 Antworten zum Schulweg den Zentralwert?',
    [r'Werte der Größe nach ordnen und den 13. Wert nehmen', r'alle Werte addieren und durch 25 teilen',
     r'den häufigsten Wert nehmen', r'den 25. Wert nehmen'],
    [r'Bei 25 Werten stehen 12 davor und 12 danach.'])

Q.q(r'Erdbeeren kosten im Januar 7,98 € pro kg, aus der Region im Juni 4,99 € pro kg. Um wie viel Prozent sind die Januar-Erdbeeren teurer (gerundet)?',
    [r'um 59,9 %', r'um 37,5 %', r'um 2,99 %', r'um 160 %'],
    [r'Unterschied: $7{,}98 - 4{,}99 = 2{,}99$ €',
     r'Bezogen auf den Juni-Preis: $\dfrac{2{,}99}{4{,}99} \approx 0{,}599$'])

Q.q(r'20 Befragte haben im Mittel 6,5 km Schulweg. Wie lang sind alle Schulwege zusammen?',
    [r'130 km', r'26,5 km', r'3,25 km', r'65 km'],
    [r'Summe = Mittel mal Anzahl: $6{,}5 \cdot 20 = 130$ km'])

Q.q(r'Für eine Urlaubsreise von 800 km nimmt man pro Person etwa 0,23 kg CO₂ pro km für das Flugzeug und 0,03 kg pro km für die Bahn an. Wie groß ist der Unterschied?',
    [r'160 kg', r'184 kg', r'24 kg', r'0,2 kg'],
    [r'Flugzeug: $800 \cdot 0{,}23 = 184$ kg, Bahn: $800 \cdot 0{,}03 = 24$ kg',
     r'Unterschied: 160 kg'])


def check():
    from fractions import Fraction as F
    assert F(64, 200) == F(8, 25) and F(32, 100) * 360 == F('115.2') and F(45, 150) == F(3, 10)
    assert 12 * (150 - 80) == 840 and F(3, 10) * 600 == 180
    assert round((7.98 - 4.99) / 4.99 * 100, 1) == 59.9 and F('6.5') * 20 == 130
    assert 800 * F('0.23') - 800 * F('0.03') == 160 and 800 * F('0.23') == 184
    assert (25 + 1) // 2 == 13


Q.verify(check)
Q.save()

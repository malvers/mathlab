#!/usr/bin/env python3
"""Informatik 12 (BGY), Woche 11 / KW 46: Projektmanagement II - Ablaufplan,
Netzplantechnik, Gantt-Diagramm (LB 1, Ustd. 17-18/22)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("projektmanagement-netzplan.pptx")

d.title("Informatik — Grundkurs 12", "Netzplan und Gantt",
        "Vom Strukturplan zum Termin — und der kritische Pfad")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Vom Strukturplan zum Ablauf", "Erst zerlegen, dann verketten")

d.bullets("Die Reihenfolge der Planung", [
    ("**Projektstrukturplan**: das Projekt in Arbeitspakete zerlegen — ohne Termine", 0),
    ("**Ablaufplan**: welche Pakete hängen voneinander ab?", 0),
    ("**Dauer schätzen**: je Paket, in Tagen", 0),
    ("**Netzplan rechnen**: früheste und späteste Termine, Puffer", 0),
    ("**Gantt zeichnen**: das Ergebnis auf eine Zeitachse legen", 0),
])

d.table_top("Unser Beispielprojekt: acht Arbeitspakete", [
    ["AP", "Vorgang", "Dauer", "Vorgänger"],
    ["A", "Anforderungen aufnehmen", "3", "—"],
    ["B", "Ist-Prozess modellieren", "2", "A"],
    ["C", "Soll-Prozess modellieren", "3", "B"],
    ["D", "Datenmodell entwerfen", "4", "B"],
    ["E", "Umsetzung", "5", "C, D"],
    ["F", "Test", "2", "E"],
    ["G", "Schulung vorbereiten", "2", "C"],
    ["H", "Übergabe", "1", "F, G"],
], [70, 400, 130, 216], [
    ("**C und D** laufen parallel, ebenso **G** neben E und F", 0),
], font_size=10.5, bold_cols=(0,))

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Der Netzplan", "Vorwärts rechnen, rückwärts rechnen")

d.bullets("Die vier Zeitwerte je Vorgang", [
    ("**FAZ** — frühester Anfangszeitpunkt: wann kann es frühestens losgehen?", 0),
    ("**FEZ** — frühestes Ende: FAZ plus Dauer", 0),
    ("**SEZ** — spätestes Ende: wann muss es spätestens fertig sein?", 0),
    ("**SAZ** — spätester Anfang: SEZ minus Dauer", 0),
    ("**Gesamtpuffer GP = SAZ − FAZ**: wie viel Verzug verträgt der Vorgang?", 0),
])

d.table_top("Die Rechnung für unser Projekt (Tage ab 0)", [
    ["AP", "Dauer", "FAZ", "FEZ", "SAZ", "SEZ", "GP"],
    ["A", "3", "0", "3", "0", "3", "0"],
    ["B", "2", "3", "5", "3", "5", "0"],
    ["C", "3", "5", "8", "6", "9", "1"],
    ["D", "4", "5", "9", "5", "9", "0"],
    ["E", "5", "9", "14", "9", "14", "0"],
    ["F", "2", "14", "16", "14", "16", "0"],
    ["G", "2", "8", "10", "14", "16", "6"],
    ["H", "1", "16", "17", "16", "17", "0"],
], [90, 120, 100, 100, 100, 100, 206], [
    ("**Vorwärts**: FAZ ist das größte FEZ aller Vorgänger. **Rückwärts**: SEZ ist das kleinste SAZ aller Nachfolger", 0),
    ("Die Projektdauer beträgt **17 Tage** — das größte FEZ", 0),
    ("**G** hat 6 Tage Puffer, **C** hat 1 Tag. Alle anderen haben **null**", 0),
], font_size=11, bold_cols=(0,),
   marks={(3, 6): TINT_ORANGE, (7, 6): TINT_ORANGE} |
         {(r, 6): TINT_GREEN for r in (1, 2, 4, 5, 6, 8)})

d.bullets("Der kritische Pfad", [
    ("Alle Vorgänge mit **Gesamtpuffer null** bilden zusammen den kritischen Pfad", 0),
    ("Hier ist das **A, B, D, E, F, H** — zusammen genau 17 Tage", 0),
    ("Verzögert sich einer davon um einen Tag, verzögert sich **das ganze Projekt**", 0),
    ("**C** darf einen Tag später werden, **G** sogar sechs — ohne Folgen für den Endtermin", 0),
    ("Deshalb schaut die Projektleitung zuerst auf den kritischen Pfad", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Das Gantt-Diagramm", "Dieselbe Planung, andere Darstellung")

d.table_top("Netzplan und Gantt im Vergleich", [
    ["", "Netzplan", "Gantt-Diagramm"],
    ["zeigt gut", "Abhängigkeiten und Puffer", "Zeitverlauf und Auslastung"],
    ["zeigt schlecht", "wann etwas im Kalender liegt", "warum etwas wann liegt"],
    ["Rechnung", "liefert Puffer und kritischen Pfad", "übernimmt die Ergebnisse"],
    ["Einsatz", "Planung und Analyse", "Kommunikation und Steuerung"],
], [200, 300, 316], [
    ("In der Praxis rechnet das Werkzeug den Netzplan und **zeigt** das Gantt", 0),
    ("Balkenlänge ist die Dauer, der Versatz ist der Anfangstermin, hellere Fortsätze sind der **Puffer**", 0),
], font_size=11, bold_cols=(0,))

d.bullets("Was man aus dem Gantt sofort sieht", [
    ("Welche Vorgänge **gleichzeitig** laufen — und ob dafür genug Leute da sind", 0),
    ("Wo **Meilensteine** liegen (Balken der Länge null)", 0),
    ("Wie stark eine Verzögerung nach hinten **durchschlägt**", 0),
    ("Und im Soll-Ist-Vergleich: wo das Projekt gerade **steht**", 0),
    ("Deshalb hängt das Gantt an der Wand — und der Netzplan liegt in der Schublade", 0),
])

d.merksatz("Der kritische Pfad ist die Kette der Vorgänge ohne Puffer. "
           "Er bestimmt die Projektdauer — alles andere darf sich verspäten.")

d.bullets("Fun Facts: Netzplantechnik", [
    ("**PERT** entstand 1958 für das Polaris-Raketenprogramm der US-Marine", 0),
    ("Fast gleichzeitig entwickelte DuPont die **Critical Path Method** für Wartungsstillstände", 0),
    ("Das **Gantt-Diagramm** ist älter: Henry Gantt entwarf es um 1910", 0),
    ("**Ähnliche Balkenpläne** benutzte schon Karol Adamiecki 1896 — nur auf Polnisch veröffentlicht", 0),
    ("Faustregel aus der Praxis: hat ein Projekt **keinen** kritischen Pfad, ist der Plan zu grob", 0),
])

d.bullets("Eure Aufgabe: rechnen und zeichnen", [
    ("Nehmt eure **Arbeitspakete** von letzter Woche und schätzt je eine Dauer", 0),
    ("Legt die **Vorgänger** fest — was muss fertig sein, bevor es weitergeht?", 0),
    ("Rechnet **FAZ, FEZ, SAZ, SEZ und GP** von Hand aus", 0),
    ("Markiert den **kritischen Pfad** und nennt die Projektdauer", 0),
    ("Zeichnet daraus ein **Gantt-Diagramm** — Papier oder Tabellenkalkulation genügt", 0),
])

d.save()

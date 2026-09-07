#!/usr/bin/env python3
"""Informatik 12 (BGY), Woche 47: Ausklang - aufraeumen und Logikraetsel."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("ausklang-inf12.pptx")

d.title("Informatik — Grundkurs 12", "Ausklang",
        "Accounts und Abgaben aufräumen — und zum Schluss ein paar Logikrätsel")

d.chapter(1, "Aufräumen", "Zwanzig Minuten, die sich lohnen")

d.table_top("Die Aufräumliste", [
    ["Was", "warum"],
    ["Abgaben vollständig hochgeladen", "sonst fehlt etwas in der Bewertung"],
    ["Datenbanken exportieren", "das Anlege-Skript ist mehr wert als die Datei"],
    ["Eigene Dateien vom Schulrechner", "die Rechner werden zurückgesetzt"],
    ["Cloud-Freigaben zurücknehmen", "Freigaben laufen nicht von selbst ab"],
    ["Testdaten mit Namen löschen", "auch erfundene Daten sammelt man nicht"],
], [330, 486], [
    ("Das **Anlege-Skript** und das **ER-Modell** solltet ihr behalten — in 13 knüpfen wir daran an", 0),
], font_size=11, bold_cols=(0,), marks={(2, 0): TINT_GREEN})

d.chapter(2, "Drei Rätsel", "Logik, wie sie in Aufnahmetests vorkommt")

d.table_top("Rätsel 1: die Wahrheitstafel", [
    ["Aussage", "Person"],
    ["„Ich war es nicht.“", "Anna"],
    ["„Ben war es.“", "Chiara"],
    ["„Chiara lügt.“", "Ben"],
], [500, 316], [
    ("Genau **eine** Person sagt die Wahrheit. Wer war es?", 0),
    ("Vorgehen: **jede Annahme durchspielen** und auf Widerspruch prüfen", 0),
    ("Genau so arbeitet auch ein logisches Schlussverfahren", 0),
], font_size=12, bold_cols=(0,))

d.bullets("Rätsel 2: die Normalform im Kopf", [
    ("Gegeben: **Bestellung(BestNr, Datum, KundenNr, KundenName, ArtNr, Menge)**", 0),
    ("Der Primärschlüssel ist **(BestNr, ArtNr)**", 0),
    ("Findet **zwei** partielle Abhängigkeiten und **eine** transitive", 0),
    ("Zerlegt bis zur 3NF — **ohne** aufzuschreiben, nur im Kopf und dann erklären", 0),
    ("Wer es erklären kann, braucht es nie wieder nachzuschlagen", 0),
])

d.bullets("Rätsel 3: der kritische Pfad im Kopf", [
    ("A (2 Tage) ohne Vorgänger, B (3) nach A, C (1) nach A", 0),
    ("D (4) nach B, E (2) nach C, F (1) nach D und E", 0),
    ("Wie lange dauert das Projekt, und welcher Weg ist kritisch?", 0),
    ("Probe: Summe der Dauern auf dem kritischen Pfad = Projektdauer", 0),
    ("Wer beides im Kopf schafft, hat den Netzplan verstanden", 0),
])

d.chapter(3, "Zum Schluss", "Was ihr mitnehmt")

d.bullets("Nach einem Jahr Grundkurs 12", [
    ("Ihr könnt einen **Prozess aufnehmen** und formal korrekt aufschreiben", 0),
    ("Ihr könnt ein **Projekt planen** und den kritischen Pfad bestimmen", 0),
    ("Ihr könnt eine **Datenbank entwerfen**, normalisieren und implementieren", 0),
    ("Ihr könnt **SQL lesen und schreiben**", 0),
    ("Und ihr wisst, dass zu jedem gespeicherten Datum ein **Zweck** gehört", 0),
])

d.merksatz("Ein Jahr Informatik in einem Satz: erst verstehen, dann modellieren, "
           "dann bauen — und zwischendurch prüfen.")

d.bullets("Fun Facts: zum Mitnehmen", [
    ("Beim **Wahrheitsrätsel** hilft die Annahme, jede Aussage sei wahr — der Widerspruch verrät den Rest", 0),
    ("Die **Normalisierung** im Kopf ist die beste Vorbereitung auf die Abiturprüfung", 0),
    ("Beim **Netzplan** stimmt die Antwort: 10 Tage über A, B, D, F", 0),
    ("Logikrätsel dieser Art stehen in fast jedem **Einstellungstest** der IT-Branche", 0),
    ("Und sie sind genau das: **Informatik ohne Rechner**", 0),
])

d.bullets("Schöne Ferien", [
    ("Räumt eure Dateien und Freigaben auf, bevor ihr geht", 0),
    ("Nehmt **Anlege-Skript** und **ER-Modell** mit — sie werden wieder gebraucht", 0),
    ("In 13 beginnt es mit **Algorithmen und Python**", 0),
    ("Wer mag, schaut sich vorher die Struktogramme aus KW 17 noch einmal an", 0),
    ("Erholt euch gut", 0),
])

d.save()

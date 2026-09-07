#!/usr/bin/env python3
"""Informatik 9 (Oberschule), Woche 17 / KW 52: Puffer und Jahresausklang -
Informatik-Weihnachtsraetsel."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("jahresausklang-caesar.pptx")

d.title("Informatik — Klasse 9", "Geheimschrift zum Jahresende",
        "Die Caesar-Chiffre knacken — ganz ohne Rechner")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Die Caesar-Chiffre", "2000 Jahre alt und leicht zu verstehen")

d.bullets("Wie sie funktioniert", [
    ("Jeder Buchstabe wird um eine feste Anzahl Stellen **verschoben**", 0),
    ("Bei Verschiebung 3 wird aus **A** ein **D**, aus **B** ein **E**, aus **C** ein **F**", 0),
    ("Am Ende des Alphabets geht es vorn weiter: aus **Z** wird **C**", 0),
    ("Die Verschiebung ist der **Schlüssel** — Sender und Empfänger müssen ihn kennen", 0),
    ("Julius Caesar soll damit seine Botschaften geschützt haben", 0),
])

d.table_top("Die Verschiebung um 3", [
    ["Klartext", "A", "B", "C", "D", "E", "F", "G"],
    ["Geheim", "D", "E", "F", "G", "H", "I", "J"],
], [130, 98, 98, 98, 98, 98, 98, 98], [
    ("Zum **Entschlüsseln** verschiebt man in die andere Richtung", 0),
    ("Mit 26 Buchstaben gibt es nur **25** sinnvolle Schlüssel — das ist die Schwäche", 0),
], font_size=13, bold_cols=(0,))

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Knacken", "Zwei Wege, einer ist schnell")

d.bullets("So kommt man an den Schlüssel", [
    ("**Alle durchprobieren**: 25 Möglichkeiten, das schafft man von Hand", 0),
    ("Der Fachbegriff dafür ist **Brute Force** — rohe Gewalt", 0),
    ("**Häufigkeiten zählen**: das **E** ist im Deutschen der häufigste Buchstabe", 0),
    ("Der häufigste Buchstabe im Geheimtext ist also vermutlich das verschobene **E**", 0),
    ("Danach genügt eine Subtraktion — und der Schlüssel steht", 0),
])

d.table_top("Häufigste Buchstaben im Deutschen", [
    ["Buchstabe", "Anteil"],
    ["E", "rund 17 %"],
    ["N", "rund 10 %"],
    ["I", "rund 8 %"],
    ["S", "rund 7 %"],
], [408, 408], [
    ("Diese Verteilung ändert sich beim Verschieben **nicht** — sie wandert nur mit", 0),
    ("Genau daran scheitert jede Verschiebechiffre", 0),
], font_size=13, bold_cols=(0,), marks={(1, 0): TINT_ORANGE, (1, 1): TINT_ORANGE})

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Das Rätsel", "Drei Botschaften, ein Preis")

d.table_top("Knackt diese drei", [
    ["Nr", "Geheimtext", "Hinweis"],
    ["1", "GDWHQEDQN", "Verschiebung 3"],
    ["2", "IURKHV IHVW", "dieselbe Verschiebung"],
    ["3", "XHMQZJXXJQ", "Schlüssel unbekannt"],
], [80, 430, 306], [
    ("Nummer 3 knackt ihr mit **Häufigkeiten** oder mit Ausprobieren", 0),
    ("Wer alle drei hat, denkt sich eine **eigene** Botschaft aus und gibt sie weiter", 0),
], font_size=12, bold_cols=(0,), mono_cols=(1,), marks={(3, 2): TINT_ORANGE})

d.merksatz("Ein Verfahren ist nur so sicher wie die Anzahl seiner Schlüssel. "
           "Bei Caesar sind es 25 — das reicht heute für gar nichts mehr.")

d.bullets("Fun Facts: Geheimschriften", [
    ("**ROT13** ist eine Caesar-Chiffre mit 13 — zweimal angewandt kommt der Klartext zurück", 0),
    ("Die **Enigma** der Wehrmacht hatte über 150 Billionen Einstellungen — und wurde trotzdem geknackt", 0),
    ("Geknackt haben sie polnische Mathematiker und später das Team um **Alan Turing** in Bletchley Park", 0),
    ("Moderne Verschlüsselung hat so viele Schlüssel, dass Durchprobieren **länger dauert als das Universum alt ist**", 0),
    ("Trotzdem gilt: geknackt wird meist nicht die Mathematik, sondern das **Passwort** davor", 0),
])

d.bullets("Zum Jahresende", [
    ("Ihr könnt jetzt eine **Datenbank entwerfen**, bauen, füllen und befragen", 0),
    ("Ihr wisst, warum ein **Datentyp** kein Detail ist", 0),
    ("Und ihr wisst, dass eine Zahl ohne ihren **Filter** wenig bedeutet", 0),
    ("Im neuen Jahr geht es um **Automatisierung** — und danach an euer eigenes Projekt", 0),
    ("Schöne Ferien!", 0),
])

d.save()

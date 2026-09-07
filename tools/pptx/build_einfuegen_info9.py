#!/usr/bin/env python3
"""Informatik 9 (Oberschule), Woche 10 / KW 45: Operationen auf Datenbanken I -
Daten einfuegen, aendern, loeschen (LB 1, Ustd. 8/13)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("operationen-einfuegen.pptx")

d.title("Informatik — Klasse 9", "Daten hinein, heraus und weg",
        "Einfügen, Ändern, Löschen — und warum Tippfehler teuer sind")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Drei Operationen", "Mehr passiert mit Datensätzen nicht")

d.table_top("Was man mit einem Datensatz tun kann", [
    ["Operation", "heißt", "Beispiel"],
    ["Einfügen", "eine neue Zeile anlegen", "ein neues Spiel aufnehmen"],
    ["Ändern", "einen Wert überschreiben", "Preis korrigieren"],
    ["Löschen", "eine Zeile entfernen", "verkauftes Spiel austragen"],
    ["Lesen", "nachschauen, ohne zu ändern", "„Wer hat Momo?“"],
], [180, 300, 336], [
    ("Die ersten drei **verändern** die Datenbasis, das Lesen nicht", 0),
    ("Nur wer die **Rechte** dafür hat, darf verändern — lesen dürfen meist viel mehr Leute", 0),
], font_size=11.5, bold_cols=(0,),
   marks={(r, 0): TINT_ORANGE for r in range(1, 4)} | {(4, 0): TINT_GREEN})

d.bullets("Löschen ist endgültig", [
    ("Ein gelöschter Datensatz ist **weg** — es gibt kein Strg+Z wie in Word", 0),
    ("Deshalb fragt ein gutes Programm vorher **nach**", 0),
    ("In echten Systemen wird oft gar nicht gelöscht, sondern als **„ungültig“ markiert**", 0),
    ("So bleibt nachvollziehbar, was einmal dagestanden hat", 0),
    ("Und deshalb gibt es **Sicherungskopien** — für den Fall, dass doch jemand danebengreift", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Die Eingabemaske", "Ein Formular statt einer Tabelle")

d.bullets("Warum man nicht direkt in die Tabelle tippt", [
    ("Eine **Eingabemaske** zeigt einen Datensatz **groß** und übersichtlich", 0),
    ("Sie kann **erklären**, was in ein Feld gehört", 0),
    ("Sie kann **prüfen**, bevor gespeichert wird", 0),
    ("Sie kann Felder **vorbelegen** — heutiges Datum, letzter Verlag", 0),
    ("Und sie zeigt nur die Felder, die derjenige ausfüllen **darf**", 0),
])

d.table_top("Was die Maske abfangen kann", [
    ["Eingabe", "Reaktion der Maske"],
    ["Jahr: „zweitausend“", "abgelehnt — hier gehört eine Zahl hin"],
    ["USK: 15", "abgelehnt — erlaubt sind 0, 6, 12, 16, 18"],
    ["Titel: leer", "abgelehnt — Pflichtfeld"],
    ["Nr: 5 (gibt es schon)", "abgelehnt — Schlüssel muss eindeutig sein"],
    ["gekauft am: 30.02.2026", "abgelehnt — diesen Tag gibt es nicht"],
], [260, 556], [
    ("Jede dieser Prüfungen spart später **Stunden** Fehlersuche", 0),
], font_size=11.5, bold_cols=(0,), marks={(r, 1): TINT_RED for r in range(1, 6)})

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Datenqualität", "Was ein einziger Tippfehler anrichtet")

d.table_top("Ein Buchstabe, vier Folgen", [
    ["In der Datenbank steht", "Folge"],
    ["„Kosmoss“ statt „Kosmos“", "der Verlag taucht als zweiter Verlag auf"],
    ["„ Momo“ mit Leerzeichen", "die Suche nach „Momo“ findet es nicht"],
    ["„momo“ klein geschrieben", "je nach Einstellung ein anderer Eintrag"],
    ["Jahr 1937 statt 1973", "das Buch ist plötzlich 36 Jahre älter"],
], [280, 536], [
    ("Eine Datenbank ist **genau so gut wie ihre Daten** — sie prüft nicht, ob etwas stimmt", 0),
    ("Deshalb: bei der Eingabe **einmal genau**, statt später zehnmal suchen", 0),
], font_size=11.5, bold_cols=(0,))

d.bullets("Wie Profis Tippfehler vermeiden", [
    ("**Auswahllisten** statt freier Eingabe: der Verlag wird ausgewählt, nicht getippt", 0),
    ("**Pflichtfelder**, die nicht leer bleiben dürfen", 0),
    ("**Prüfregeln**: USK nur 0, 6, 12, 16 oder 18", 0),
    ("**Vier-Augen-Prinzip** bei wichtigen Daten", 0),
    ("Und regelmäßig eine **Suche nach Doppelten** laufen lassen", 0),
])

d.merksatz("Eine Datenbank prüft die Form, nicht den Inhalt. Ob „Kosmoss“ richtig "
           "geschrieben ist, weiß nur der Mensch davor.")

d.bullets("Fun Facts: Datenqualität", [
    ("Amerikanische Firmen schätzen ihre Verluste durch schlechte Daten auf **Milliarden** jährlich", 0),
    ("Die **NASA** verlor 1999 eine Marssonde, weil ein Team in Pfund und eines in Newton rechnete", 0),
    ("Es gibt Menschen, die heißen wirklich **„Null“** — Datenbanken bringt das regelmäßig durcheinander", 0),
    ("Der Fachbegriff für einen leeren Eintrag ist **NULL** — er heißt „unbekannt“, nicht „null“", 0),
    ("Große Firmen haben eigene Leute nur für **Datenpflege** — Beruf: Data Steward", 0),
])

d.bullets("Eure Aufgabe am Rechner", [
    ("Legt zu eurer Tabelle eine **Eingabemaske** an (Assistent im DBMS)", 0),
    ("Erfasst damit **zehn** Datensätze — sauber, ohne Abkürzungen", 0),
    ("Baut eine **Prüfregel** ein: das Jahr muss zwischen 1900 und heute liegen", 0),
    ("Probiert aus, was bei einer **doppelten** Nummer passiert", 0),
    ("Ändert einen Datensatz und **löscht** einen — und schreibt auf, was dabei auffällt", 0),
])

d.save()

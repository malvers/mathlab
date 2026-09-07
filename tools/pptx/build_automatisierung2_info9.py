#!/usr/bin/env python3
"""Informatik 9 (Oberschule), Woche 20 / KW 2: Wahlbereich II - Datenschutz,
Datensicherheit, politische Meinungsbildung (2/2)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("automatisierung-2.pptx")

d.title("Informatik — Klasse 9", "Wer redet da eigentlich?",
        "Assistenten, Bots und Fake-Accounts — Automatisierung und Meinung")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Das Mikrofon im Raum", "Was ein Sprachassistent wirklich tut")

d.table_top("Der Weg einer Sprachanfrage", [
    ["Schritt", "wo es passiert", "was dabei entsteht"],
    ["Mikrofon hört zu", "im Gerät", "ein kurzer Ringspeicher"],
    ["Weckwort erkannt", "im Gerät", "erst jetzt geht es weiter"],
    ["Anfrage verstehen", "auf einem Server", "eine Aufnahme in der Cloud"],
    ["Antwort und Aktion", "Server und Gerät", "ein Eintrag in eurem Profil"],
], [200, 250, 366], [
    ("Das Weckwort erkennt das Gerät **selbst** — dafür muss das Mikrofon aber **immer** zuhören", 0),
    ("Ab Schritt 3 verlassen Daten das Haus. Was dort gespeichert wird, steht in den **Einstellungen**", 0),
], font_size=11, bold_cols=(0,), marks={(3, 2): TINT_ORANGE, (4, 2): TINT_ORANGE})

d.bullets("Was ihr selbst prüfen könnt", [
    ("Gibt es eine **Liste der Aufnahmen** — und könnt ihr sie löschen?", 0),
    ("Lässt sich das Mikrofon **hardwareseitig** abschalten?", 0),
    ("Wird die Aufnahme zum **Verbessern** weiterverwendet? Wer hört sie ab?", 0),
    ("Was passiert mit den Daten, wenn ihr das Gerät **verkauft**?", 0),
    ("Gilt die Zustimmung auch für **Gäste**, die gar nicht gefragt wurden?", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Bots", "Automatisierte Konten, die Meinung machen")

d.table_top("Woran man ein Bot-Konto erkennen kann", [
    ["Merkmal", "was auffällt"],
    ["Menge", "hunderte Beiträge am Tag, auch nachts"],
    ["Wiederholung", "derselbe Satz von vielen Konten"],
    ["Profil", "kaum Eigenes, Bild aus dem Netz, neu angelegt"],
    ["Verhalten", "antwortet nie auf Rückfragen"],
    ["Timing", "Beiträge kommen in Wellen, kurz vor Ereignissen"],
], [200, 616], [
    ("Kein Merkmal allein beweist etwas — **mehrere zusammen** sind ein starkes Anzeichen", 0),
    ("Und: auch Menschen können sich so verhalten. Vorsicht mit dem Vorwurf", 0),
], font_size=11.5, bold_cols=(0,))

d.bullets("Warum das für Wahlen wichtig ist", [
    ("Wer viele Konten steuert, kann eine Meinung **größer aussehen** lassen, als sie ist", 0),
    ("Menschen richten sich danach, was **die meisten** zu denken scheinen", 0),
    ("Empfehlungssysteme verstärken, was **viele Reaktionen** bekommt — auch Streit", 0),
    ("So entsteht ein schiefes Bild, ohne dass jemand lügen muss", 0),
    ("Gegenmittel: **Quelle prüfen**, zweite Quelle suchen, Datum ansehen", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Grenzen", "Was Automatisierung nicht kann")

d.table_top("Möglichkeiten und Grenzen nebeneinander", [
    ["Automatisierung kann", "Automatisierung kann nicht"],
    ["Muster in riesigen Datenmengen finden", "wissen, ob das Muster einen Sinn ergibt"],
    ["rund um die Uhr gleich schnell arbeiten", "eine Ausnahme als Ausnahme erkennen"],
    ["Vorschläge machen", "Verantwortung übernehmen"],
    ["billiger sein als Menschen", "entscheiden, ob sie eingesetzt werden soll"],
], [400, 416], [
    ("Die rechte Spalte bleibt beim **Menschen** — und zwar bei allen, nicht nur bei Fachleuten", 0),
], font_size=11, bold_cols=(0,), marks={(r, 1): TINT_BLUE for r in range(1, 5)})

d.merksatz("Ein automatisiertes System kann sehr viel und sehr schnell entscheiden. "
           "Ob es entscheiden darf, entscheiden Menschen.")

d.bullets("Fun Facts: Bots und Meinung", [
    ("Der erste Chatbot **ELIZA** von 1966 stellte nur Rückfragen — Menschen vertrauten ihm trotzdem", 0),
    ("Sein Erfinder **Joseph Weizenbaum** erschrak darüber und wurde zum Technikkritiker", 0),
    ("Der **Turing-Test** fragt, ob ein Mensch im Gespräch merkt, dass er mit einer Maschine redet", 0),
    ("Fake-Konten kosten im Netz wenige Cent das Stück — die Menge macht die Wirkung", 0),
    ("Plattformen löschen Millionen Konten pro Quartal — und es werden trotzdem nicht weniger", 0),
])

d.bullets("Eure Aufgabe: das Kurzstatement", [
    ("Jeder schreibt **fünf Sätze** zum Thema „Automatisierung und ich“", 0),
    ("Satz 1: **eine Sache**, die ich gern automatisiert hätte", 0),
    ("Satz 2: **eine Sache**, die ich nie automatisiert sehen möchte", 0),
    ("Satz 3 und 4: die **Begründung** dazu, mit einem Beispiel", 0),
    ("Satz 5: **welche Daten** ich dafür hergeben würde — und welche nicht", 0),
])

d.save()

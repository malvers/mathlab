#!/usr/bin/env python3
"""Informatik 9 (Oberschule), Woche 31 / KW 14: Umsetzung III - Kommunikations- und
Kooperationstools (LB 2, Ustd. 8/12)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("umsetzung-3-zusammenarbeit.pptx")

d.title("Informatik — Klasse 9", "Zusammen arbeiten, ohne nebeneinander zu sitzen",
        "Zwischenstände teilen, Feedback geben, offene Punkte einsammeln")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Werkzeuge", "Wofür man was benutzt")

d.table_top("Vier Arten von Werkzeugen", [
    ["Art", "wofür", "Beispiel"],
    ["Ablage", "Dateien an einem Ort für alle", "Lernplattform, Cloud-Ordner"],
    ["Nachricht", "kurze Absprachen zwischendurch", "Kurs-Chat, Mail"],
    ["gemeinsames Dokument", "gleichzeitig am selben Text schreiben", "Online-Textdokument"],
    ["Aufgabenliste", "wer macht was bis wann", "Tabelle oder Kanban-Brett"],
], [200, 320, 296], [
    ("Das häufigste Problem ist nicht die Technik, sondern **zu viele** Werkzeuge nebeneinander", 0),
    ("Einigt euch auf **eines je Art** — und benutzt es dann auch", 0),
], font_size=11, bold_cols=(0,))

d.bullets("Regeln, damit es hilft statt zu nerven", [
    ("**Ein** Ort für Dateien. Wer woanders speichert, arbeitet allein", 0),
    ("Dateinamen mit **Nummer** — auch in der Cloud", 0),
    ("Nachrichten kurz und **mit Frage**: „Kannst du bis Freitag X?“ statt „Hi“", 0),
    ("Was verabredet wird, kommt in die **Aufgabenliste**, nicht nur in den Chat", 0),
    ("Und: Absprachen im Unterricht gelten — nicht das, was jemand allein zu Hause dachte", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Die Feedbackrunde", "Fremde Augen sehen mehr")

d.table_top("Wie ihr euch gegenseitig Rückmeldung gebt", [
    ["Schritt", "was gesagt wird"],
    ["1. Zeigen", "das Team führt zwei Minuten lang vor, ohne zu erklären"],
    ["2. Beschreiben", "die anderen sagen, was sie gesehen haben"],
    ["3. Loben", "was funktioniert gut? Mindestens eine Sache"],
    ["4. Fragen", "was habt ihr euch bei X gedacht?"],
    ["5. Vorschlagen", "ein konkreter Tipp, keine Grundsatzkritik"],
], [200, 616], [
    ("Beschreiben vor Bewerten — sonst wird aus Rückmeldung ein Streit", 0),
    ("**Ein** Tipp reicht. Zehn Tipps kann niemand umsetzen", 0),
], font_size=11.5, bold_cols=(0,), marks={(2, 0): TINT_GREEN, (5, 0): TINT_BLUE})

d.bullets("Feedback annehmen", [
    ("Erst **zuhören**, dann antworten — nicht sofort verteidigen", 0),
    ("**Nachfragen**, wenn ihr etwas nicht versteht: „Was genau war unklar?“", 0),
    ("Alles **aufschreiben**, auch das, was ihr nicht umsetzen wollt", 0),
    ("Danach entscheiden: **was übernehmen wir, was nicht** — und warum", 0),
    ("Ihr müsst nicht jeden Tipp umsetzen. Aber jeden **verstanden** haben", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Restplanung", "Vier Stunden bis zur Präsentation")

d.table_top("Was bis wann noch passieren muss", [
    ["Wann", "Was"],
    ["heute", "Zwischenstand teilen, Feedback einsammeln"],
    ["nächste Stunde", "Feinschliff, offene Muss-Punkte abschließen"],
    ["danach", "Testen und Fehler beheben"],
    ["dann", "Dokumentation fertigstellen"],
    ["Mai", "Präsentation"],
], [230, 586], [
    ("Streicht jetzt die **Kann-Punkte**, die nicht mehr zu schaffen sind — bewusst, nicht heimlich", 0),
    ("Ein fertiges kleines Produkt ist mehr wert als ein halbes großes", 0),
], font_size=11.5, bold_cols=(0,), marks={(2, 1): TINT_ORANGE})

d.merksatz("Erst beschreiben, dann bewerten. Und was verabredet wird, "
           "gehört in die Aufgabenliste, nicht in den Chatverlauf.")

d.bullets("Fun Facts: Zusammenarbeit", [
    ("Ein **Kanban-Brett** hat drei Spalten: zu tun, in Arbeit, fertig — erfunden bei Toyota", 0),
    ("Die Regel „**höchstens drei Sachen gleichzeitig in Arbeit**“ macht Teams messbar schneller", 0),
    ("Beim Feedback gilt die **Sandwich-Regel** als überholt — ehrlich und konkret schlägt verpackt", 0),
    ("In verteilten Teams gilt: **was nicht aufgeschrieben ist, ist nicht passiert**", 0),
    ("Der häufigste Satz in Projektpostmortems lautet: „**Das hätten wir früher sagen sollen**“", 0),
])

d.bullets("Eure Aufgabe heute", [
    ("**Zwischenstand** an den vereinbarten Ort hochladen, mit Nummer im Namen", 0),
    ("**Feedbackrunde** mit dem Nachbarteam: zeigen, beschreiben, loben, fragen, vorschlagen", 0),
    ("Alle Rückmeldungen in eine **Liste** schreiben", 0),
    ("Entscheiden: **was übernehmen wir** — und was streichen wir aus den Kann-Punkten?", 0),
    ("Aufgabenplan für die letzten Stunden **aktualisieren**", 0),
])

d.save()

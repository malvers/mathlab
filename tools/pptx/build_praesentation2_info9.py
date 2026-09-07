#!/usr/bin/env python3
"""Informatik 9 (Oberschule), Woche 38 / KW 20: Praesentationen II und Puffer."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("praesentation-projekte-2.pptx")

d.title("Informatik — Klasse 9", "Die restlichen Teams",
        "Präsentationen zu Ende bringen — und schon einmal zurückschauen")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Heute dran", "Die verbliebenen Teams")

d.table_top("Ablauf", [
    ["Zeit", "was passiert"],
    ["0–3", "Aufbau und Reihenfolge"],
    ["3–13", "Team 4 präsentiert, danach Feedback"],
    ["16–26", "Team 5 präsentiert, danach Feedback"],
    ["29–40", "Sammlung: was ist uns bei allen Projekten aufgefallen?"],
    ["40–45", "Ausblick: nächste Woche Auswertung und Noten"],
], [130, 686], [
    ("Auch heute: wer nicht präsentiert, füllt den **Bewertungsbogen** aus", 0),
], font_size=11.5, bold_cols=(0,))

d.bullets("Aus der letzten Stunde mitgenommen", [
    ("Die Vorführung wirkt am besten, wenn jemand **erklärt, was er gerade tut**", 0),
    ("Ein **offen benannter** Fehler kostet nichts", 0),
    ("Wer zu schnell spricht, verliert das Publikum — **langsamer als es sich anfühlt**", 0),
    ("Und: der Blick geht **ins Publikum**, nicht auf den Bildschirm", 0),
    ("Teams 4 und 5: genau darauf achten", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Quer durch alle Projekte", "Was war überall gleich?")

d.table_top("Die wiederkehrenden Muster", [
    ["Beobachtung", "was man daraus lernt"],
    ["Die kleinste Version lief am schnellsten", "früh etwas Lauffähiges haben lohnt sich"],
    ["Schnittstellen machten die meiste Arbeit", "Namen vorher absprechen"],
    ["Die letzten Prozent dauerten am längsten", "Puffer einplanen"],
    ["Fremdtests fanden echte Fehler", "selbst testen genügt nicht"],
    ["Gute Doku entstand nebenbei, nicht am Ende", "unterwegs mitschreiben"],
], [380, 436], [
    ("Diese fünf Sätze gelten für **jedes** Projekt — auch für die in Klasse 10", 0),
], font_size=11, bold_cols=(0,))

d.bullets("Was jedes Team anders gelöst hat", [
    ("Manche haben **früh** zerlegt, andere erst nach dem ersten Ärger", 0),
    ("Manche haben **Rollen** ernst genommen, andere alles gemeinsam gemacht", 0),
    ("Manche hatten einen **Testplan**, andere haben herumprobiert", 0),
    ("Schaut euch an, welche Wege **schneller** zum Ergebnis führten", 0),
    ("Und was ihr beim nächsten Mal **anders** machen würdet", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Vor der Auswertung", "Zwei Fragen zum Mitnehmen")

d.bullets("Denkt bis nächste Woche darüber nach", [
    ("**Was lief in unserem Team gut** — und woran lag es genau?", 0),
    ("**Was würden wir anders machen** — und was wäre der erste Schritt dazu?", 0),
    ("Schreibt zu jeder Frage **drei Sätze** auf, jeder für sich", 0),
    ("Nicht „wir hätten mehr Zeit gebraucht“ — das sagen alle immer", 0),
    ("Sondern: **was hätten wir mit derselben Zeit besser machen können?**", 0),
])

d.merksatz("Das Projekt ist zu Ende, wenn man sagen kann, was man beim "
           "nächsten Mal anders macht. Vorher ist es nur abgegeben.")

d.bullets("Fun Facts: aus Projekten lernen", [
    ("Profis nennen die Nachbetrachtung **Retrospektive** — sie ist fest eingeplant", 0),
    ("Die wichtigste Regel dabei: **es geht um Abläufe, nicht um Personen**", 0),
    ("Teams, die regelmäßig zurückschauen, werden messbar schneller", 0),
    ("Und: die meisten Erkenntnisse sind **unspektakulär** — früher absprechen, früher testen", 0),
    ("Genau die wirken aber beim nächsten Mal am stärksten", 0),
])

d.bullets("Eure Aufgabe heute", [
    ("Teams 4 und 5: **präsentieren**", 0),
    ("Alle anderen: **Bewertungsbogen** ausfüllen", 0),
    ("Gemeinsam: die **Sammlung** an der Tafel ergänzen", 0),
    ("Jeder für sich: die **zwei Fragen** aus Kapitel 3 beantworten", 0),
    ("Mitbringen nächste Woche: eure Antworten und die vollständige Abgabe", 0),
])

d.save()

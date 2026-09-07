#!/usr/bin/env python3
"""Informatik 9 (Oberschule), Woche 39 / KW 21: Projektauswertung, Bewertung,
Reflexion."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("projektauswertung.pptx")

d.title("Informatik — Klasse 9", "Zurückschauen und weiterkommen",
        "Reflexion, Bewertung und Einzelfeedback zum Projekt")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Die Retrospektive", "Abläufe, nicht Personen")

d.table_top("Drei Spalten an der Tafel", [
    ["Spalte", "was hineinkommt"],
    ["Lief gut", "was wir beibehalten wollen"],
    ["Lief schlecht", "was uns aufgehalten hat"],
    ["Nächstes Mal", "ein konkreter erster Schritt"],
], [230, 586], [
    ("Die dritte Spalte ist die wichtigste — ohne sie ist es nur ein Gespräch", 0),
    ("Regel: **es geht um Abläufe, nicht um Personen**. Keine Namen an der Tafel", 0),
], font_size=12, bold_cols=(0,), marks={(3, 0): TINT_GREEN, (3, 1): TINT_GREEN})

d.bullets("Was ihr aus euren Notizen mitbringt", [
    ("**Was lief gut** — und woran lag es genau?", 0),
    ("**Was würden wir anders machen** — und was wäre der erste Schritt?", 0),
    ("Nicht zulässig: „wir hätten mehr Zeit gebraucht“ — das sagen alle", 0),
    ("Stattdessen: **was hätten wir mit derselben Zeit besser machen können?**", 0),
    ("Jede Antwort in ganzen Sätzen — die kommen an die Tafel", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Die Bewertung", "Wie die Note zustande kommt")

d.table_top("Die Punkte im Überblick", [
    ["Bereich", "Punkte", "wovon es abhängt"],
    ["Produkt: Anforderungen", "0–10", "wie viele Muss-Punkte laufen"],
    ["Produkt: Umsetzung", "0–5", "sauber gelöst, nachvollziehbar aufgebaut"],
    ["Dokumentation", "0–8", "vollständig, Probleme konkret beschrieben"],
    ["Präsentation", "0–7", "verständlich, alle beteiligt, Zeit gehalten"],
], [230, 130, 456], [
    ("Insgesamt **30 Punkte**. Die Umrechnung in die Note steht an der Tafel", 0),
    ("Die Note gilt für das **Team** — Ausnahmen gibt es nur bei sehr ungleicher Beteiligung", 0),
], font_size=11, bold_cols=(0,))

d.bullets("Häufige Fragen zur Bewertung", [
    ("„Zählt ein Fehler im Produkt?“ — nur, wenn er einen **Muss-Punkt** betrifft", 0),
    ("„Zählen die Kann-Punkte?“ — sie können fehlende Punkte bei der Umsetzung ausgleichen", 0),
    ("„Was, wenn jemand krank war?“ — das wird berücksichtigt, sagt es rechtzeitig", 0),
    ("„Warum zählt die Doku so viel?“ — weil dort steht, **wie** ihr gedacht habt", 0),
    ("„Kann man die Note verbessern?“ — nicht rückwirkend. Aber in Klasse 10 wieder", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Einzelfeedback", "Fünf Minuten je Team")

d.bullets("Wie das Gespräch abläuft", [
    ("Ihr sagt **zuerst**, wie ihr euer Projekt selbst einschätzt", 0),
    ("Dann höre ich zu und ergänze, was mir aufgefallen ist", 0),
    ("Ihr bekommt **eine Stärke** und **eine Sache**, an der ihr weiterarbeiten könnt", 0),
    ("Fragen zur Bewertung: **jetzt**, nicht in vier Wochen", 0),
    ("Wer währenddessen nicht dran ist, arbeitet an der Cloud-Übung von nächster Woche", 0),
])

d.merksatz("Ein Projekt ist ausgewertet, wenn jeder sagen kann, was er beim "
           "nächsten Mal anders macht — und was der erste Schritt dahin ist.")

d.bullets("Fun Facts: Auswerten", [
    ("Die Retrospektive stammt aus der **agilen Entwicklung** und ist dort Pflichttermin", 0),
    ("Die **Prime Directive** dabei lautet: jeder hat mit dem gehandelt, was er wusste", 0),
    ("Deshalb wird nach **Ursachen** gefragt, nicht nach Schuldigen", 0),
    ("Teams, die das ernst nehmen, machen denselben Fehler **nicht zweimal**", 0),
    ("Und das ist der einzige Unterschied zwischen Erfahrung und langer Berufszeit", 0),
])

d.bullets("Eure Aufgabe heute", [
    ("**Retrospektive** im Team: drei Spalten füllen, an die Tafel bringen", 0),
    ("Aus „Nächstes Mal“ **eine** Sache auswählen, die ihr euch wirklich vornehmt", 0),
    ("**Einzelfeedback** in Ruhe anhören und nachfragen", 0),
    ("Die eigene Einschätzung **vor** dem Gespräch aufschreiben", 0),
    ("Abgaben, die noch fehlen: heute nachreichen", 0),
])

d.save()

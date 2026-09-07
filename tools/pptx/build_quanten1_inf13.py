#!/usr/bin/env python3
"""Informatik 13 (BGY), Woche 26 / KW 9: Wahlbereich Quanteninformatik I -
Quanteninformation vs. klassische Information (WB, Ustd. 1-2/4)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("quanteninformatik-1.pptx")

d.title("Informatik — Grundkurs 13", "Bit und Qubit",
        "Superposition und Verschränkung — was daran wirklich anders ist")

d.chapter(1, "Das klassische Bit", "Woher wir kommen")

d.bullets("Was ein Bit ist", [
    ("Ein **Bit** hat genau einen von zwei Zuständen: 0 oder 1", 0),
    ("Es ist **jederzeit ablesbar**, ohne sich dabei zu ändern", 0),
    ("Es lässt sich **beliebig oft kopieren**", 0),
    ("**n Bits** stellen genau **einen** von 2ⁿ möglichen Zuständen dar", 0),
    ("Alles, was ihr bisher programmiert habt, beruht auf diesen vier Sätzen", 0),
])

d.table_top("Bit und Qubit gegenübergestellt", [
    ["", "Bit", "Qubit"],
    ["Zustand", "0 oder 1", "Überlagerung von 0 und 1"],
    ["Ablesen", "ändert nichts", "legt den Zustand fest, zerstört die Überlagerung"],
    ["Kopieren", "beliebig oft", "nicht möglich (No-Cloning)"],
    ["n Stück", "ein Zustand aus 2ⁿ", "eine Überlagerung aller 2ⁿ"],
], [140, 250, 426], [
    ("Die dritte Zeile ist der wichtigste Unterschied: **Messen verändert**", 0),
    ("Und die vierte erklärt, warum manche Aufgaben schneller gehen könnten", 0),
], font_size=10.5, bold_cols=(0,), marks={(2, 2): TINT_ORANGE, (4, 2): TINT_BLUE})

d.chapter(2, "Superposition", "Nicht beides gleichzeitig")

d.bullets("Was Superposition heißt — und was nicht", [
    ("Ein Qubit ist **nicht** „0 und 1 gleichzeitig“ im Sinne von zwei Werten nebeneinander", 0),
    ("Es befindet sich in einem Zustand, der sich als **Überlagerung** beider beschreiben lässt", 0),
    ("Beim **Messen** kommt immer ein eindeutiges Ergebnis heraus: 0 oder 1", 0),
    ("Welches, ist **wahrscheinlich**, nicht bestimmt — die Anteile legen die Wahrscheinlichkeit fest", 0),
    ("Nach der Messung ist die Überlagerung **weg**. Man kann sie nicht noch einmal ablesen", 0),
])

d.table_top("Ein Bild, das trägt — und wo es aufhört", [
    ["Bild", "trägt für", "hört auf bei"],
    ["Münze in der Luft", "unbestimmt bis zum Auffangen", "die Münze hat schon eine Seite"],
    ["Wahrscheinlichkeitswolke", "Anteile für 0 und 1", "Interferenz erklärt es nicht"],
    ["Parallelwelten", "gar nicht", "irreführend, bitte meiden"],
], [230, 300, 286], [
    ("Jedes Bild hat eine Grenze — wichtig ist, sie zu **kennen**", 0),
    ("Der eigentliche Rechenvorteil kommt aus **Interferenz**: falsche Wege löschen sich aus", 0),
], font_size=10.5, bold_cols=(0,), marks={(3, 1): TINT_RED})

d.chapter(3, "Verschränkung", "Der wirklich seltsame Teil")

d.bullets("Was Verschränkung bedeutet", [
    ("Zwei Qubits können so präpariert werden, dass ihr Zustand nur **gemeinsam** beschreibbar ist", 0),
    ("Misst man das eine, steht das Ergebnis des anderen **sofort** fest — egal wie weit entfernt", 0),
    ("Das überträgt **keine Information**: das Einzelergebnis bleibt zufällig", 0),
    ("Deshalb widerspricht es der Relativitätstheorie nicht", 0),
    ("Nutzbar wird es erst im **Vergleich** beider Ergebnisse — dafür braucht es einen normalen Kanal", 0),
])

d.table_top("Anknüpfung an Klasse 11", [
    ["Wissenschaftsbereich", "Beitrag zur Quanteninformatik"],
    ["Physik", "beschreibt das Verhalten der Qubits"],
    ["Mathematik", "Vektoren und Wahrscheinlichkeiten"],
    ["Informatik", "Algorithmen, Schaltkreise, Fehlerkorrektur"],
    ["Ingenieurwesen", "Kühlung, Steuerung, Ausleseelektronik"],
], [280, 536], [
    ("Quanteninformatik ist ein Musterbeispiel für ein **interdisziplinäres** Feld", 0),
    ("Genau darum ging es in LB 1 der Jahrgangsstufe 11", 0),
], font_size=11, bold_cols=(0,))

d.merksatz("Ein Qubit ist nicht 0 und 1 gleichzeitig. Es ist unbestimmt, "
           "bis man misst — und dann ist die Überlagerung weg.")

d.bullets("Fun Facts: Quanteninformation", [
    ("Den Begriff **Qubit** prägte Benjamin Schumacher 1995", 0),
    ("Das **No-Cloning-Theorem** von 1982 verbietet das Kopieren eines unbekannten Qubits", 0),
    ("Genau daraus entsteht der Sicherheitsgewinn der **Quantenkryptografie**", 0),
    ("Einstein nannte die Verschränkung **„spukhafte Fernwirkung“** — und hielt sie für unvollständig", 0),
    ("2022 gab es den **Physik-Nobelpreis** für Experimente, die die Verschränkung bestätigten", 0),
])

d.bullets("Eure Aufgabe", [
    ("Erklärt in eigenen Worten den Unterschied **Bit und Qubit** in vier Sätzen", 0),
    ("Benennt an drei Bildern für Superposition jeweils die **Grenze**", 0),
    ("Erklärt, warum Verschränkung **keine** Information schneller als Licht überträgt", 0),
    ("Ordnet vier Aussagen zu: **richtig, irreführend oder falsch**", 0),
    ("Bringt eine **Frage** mit, die wir nächste Woche am Simulator ausprobieren", 0),
])

d.save()

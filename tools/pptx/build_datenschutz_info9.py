#!/usr/bin/env python3
"""Informatik 9 (Oberschule), Woche 15 / KW 50: Datenschutz, Persoenlichkeitsrechte,
gesetzliche Grundlagen (LB 1, Ustd. 13/13 - Abschluss LB 1)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("datenschutz-info9.pptx")

d.title("Informatik — Klasse 9", "Meine Daten gehören mir",
        "Informationelle Selbstbestimmung — und was das im Alltag heißt")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Ein Recht mit sperrigem Namen", "Informationelle Selbstbestimmung")

d.bullets("Was das Wort bedeutet", [
    ("Jeder darf **selbst bestimmen**, wer was über ihn weiß und was damit geschieht", 0),
    ("Das Bundesverfassungsgericht hat es **1983** aus dem Grundgesetz abgeleitet", 0),
    ("Anlass war eine **Volkszählung**, gegen die Hunderttausende protestierten", 0),
    ("Der Kern: **Wer nicht weiß, wer was über ihn weiß, verhält sich anders**", 0),
    ("Deshalb ist Datenschutz kein Technikthema, sondern ein **Freiheitsthema**", 0),
])

d.table_top("Die wichtigsten Regeln der DSGVO", [
    ["Regel", "heißt im Alltag"],
    ["Zweckbindung", "Daten nur für den Zweck nutzen, für den sie erhoben wurden"],
    ["Datensparsamkeit", "nur erheben, was wirklich gebraucht wird"],
    ["Richtigkeit", "falsche Daten müssen berichtigt werden"],
    ["Löschung", "wenn der Zweck weg ist, müssen die Daten weg"],
    ["Auskunft", "jeder darf fragen: Was habt ihr über mich gespeichert?"],
], [230, 586], [
    ("Die **DSGVO** gilt seit 2018 in der ganzen EU", 0),
    ("Sie schützt **personenbezogene Daten** — alles, womit man einen Menschen erkennen kann", 0),
], font_size=11.5, bold_cols=(0,))

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Drei Fälle", "Was darf gespeichert werden?")

d.table_top("Schule, Verein, Onlineshop", [
    ["Wer", "darf speichern", "darf nicht"],
    ["Schule", "Name, Klasse, Noten, Fehlzeiten", "Religion der Eltern, Hobbys"],
    ["Sportverein", "Name, Geburtsdatum, Beitrag", "Schulnoten"],
    ["Onlineshop", "Adresse, Bestellung, Zahlung", "was ihr sonst noch anschaut"],
], [180, 330, 306], [
    ("Der Maßstab ist immer derselbe: **Wird die Angabe für den Zweck gebraucht?**", 0),
    ("Fotos sind heikel: für eine Veröffentlichung braucht es eine **Einwilligung**", 0),
], font_size=11, bold_cols=(0,), marks={(r, 2): TINT_RED for r in range(1, 4)})

d.bullets("Eure Rechte — konkret", [
    ("**Auskunft**: Ihr dürft verlangen zu erfahren, was gespeichert ist", 0),
    ("**Berichtigung**: Falsches muss korrigiert werden", 0),
    ("**Löschung**: „Recht auf Vergessenwerden“ — wenn der Zweck entfällt", 0),
    ("**Widerspruch**: gegen Werbung immer, jederzeit, ohne Begründung", 0),
    ("Unter 16 Jahren brauchen viele Dienste die **Zustimmung der Eltern**", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Und in der Datenbank?", "Der Bezug zu unserem Lernbereich")

d.bullets("Datenschutz beginnt beim Entwurf", [
    ("Jedes Feld, das ihr **nicht** anlegt, kann auch nicht missbraucht werden", 0),
    ("Deshalb war „Handynummer: nein“ in unserem Bibliotheksmodell eine **Datenschutzentscheidung**", 0),
    ("**Rechte im DBMS**: wer darf lesen, wer ändern? Nicht jeder braucht alles", 0),
    ("**Löschfristen**: Ausleihdaten von 2019 braucht heute niemand mehr", 0),
    ("Der Fachbegriff dafür heißt **Datenschutz durch Technikgestaltung**", 0),
])

d.merksatz("Die sparsamste Datenbank ist die sicherste: Was gar nicht "
           "gespeichert wird, kann nicht verloren gehen und nicht missbraucht werden.")

d.bullets("Fun Facts: Datenschutz", [
    ("Das **Volkszählungsurteil** von 1983 gilt als Geburtsstunde des modernen Datenschutzes", 0),
    ("Deutschland hatte 1970 das **weltweit erste** Datenschutzgesetz — in Hessen", 0),
    ("Die **DSGVO** kann Bußgelder bis zu 4 % des weltweiten Jahresumsatzes verhängen", 0),
    ("**Personenbezogen** ist mehr, als man denkt: auch eine IP-Adresse gehört dazu", 0),
    ("Schon **vier** Orts- und Zeitangaben genügen meist, um eine Person eindeutig zu erkennen", 0),
])

d.bullets("Abschluss LB 1: die gemeinsame Mindmap", [
    ("In der Mitte steht **Datenbank** — außen herum kommen eure Äste", 0),
    ("Ast 1: **Aufbau** — Datenbanksystem, Tabelle, Datensatz, Datenfeld, Schlüssel", 0),
    ("Ast 2: **Arbeiten damit** — einfügen, sortieren, filtern, auswerten", 0),
    ("Ast 3: **Beurteilen** — vollständig, aktuell, plausibel", 0),
    ("Ast 4: **Verantwortung** — Datenschutz, Sparsamkeit, Rechte", 0),
])

d.save()

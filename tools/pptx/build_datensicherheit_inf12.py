#!/usr/bin/env python3
"""Informatik 12 (BGY), Woche 29 / KW 12: Datensicherheit und Datenschutz bei
Datenbanken, grosse Datenmengen (LB 2, Ustd. 23-24/24 - Abschluss LB 2)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG, sql_parts
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("datensicherheit-datenschutz-inf12.pptx")
sql = lambda t, ls, **kw: d.code(t, [sql_parts(l) for l in ls], **kw)

d.title("Informatik — Grundkurs 12", "Sicherheit, Schutz und große Datenmengen",
        "Zwei Wörter, die verwechselt werden — und eine Positionierung zum Schluss")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Zwei verschiedene Dinge", "Datensicherheit und Datenschutz")

d.table_top("Der Unterschied", [
    ["", "Datensicherheit", "Datenschutz"],
    ["schützt", "die Daten", "die Personen hinter den Daten"],
    ["Frage", "Sind die Daten vor Verlust und Zugriff sicher?", "Dürfen wir sie überhaupt haben?"],
    ["Mittel", "Rechte, Sicherung, Verschlüsselung", "Zweckbindung, Sparsamkeit, Fristen"],
    ["Grundlage", "Technik und Organisation", "DSGVO, BDSG, SächsDSG"],
], [140, 340, 336], [
    ("Man kann Daten **sicher** speichern, die man gar nicht speichern **darf**", 0),
    ("Und man kann erlaubte Daten **unsicher** speichern. Beides sind verschiedene Fehler", 0),
], font_size=10.5, bold_cols=(0,), marks={(1, 1): TINT_BLUE, (1, 2): TINT_ORANGE})

sql("Datensicherheit im DBMS: Rechte vergeben", [
    "CREATE USER sekretariat IDENTIFIED BY '...';",
    "",
    "GRANT SELECT ON Schueler TO sekretariat;",
    "GRANT SELECT, INSERT, UPDATE ON Belegung TO lehrkraft;",
    "REVOKE UPDATE ON Schueler FROM lehrkraft;",
    "",
    "-- Sicht: nur die erlaubten Spalten",
    "CREATE VIEW Kursliste AS",
    "  SELECT k.bezeichnung, s.name FROM Kurs k",
    "  JOIN Belegung b ON k.knr = b.knr",
    "  JOIN Schueler s ON b.snr = s.snr;",
], size=11.5)

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Der rechtliche Rahmen", "DSGVO, BDSG und das sächsische Gesetz")

d.table_top("Welches Gesetz wofür", [
    ["Regelwerk", "gilt für", "Beispiel"],
    ["DSGVO", "die ganze EU, Grundregeln", "Zweckbindung, Auskunftsrecht"],
    ["BDSG", "Ergänzungen für Deutschland", "Beschäftigtendatenschutz"],
    ["SächsDSG", "sächsische Behörden und Schulen", "Verarbeitung an Schulen"],
    ["Schulordnungen", "was die Schule konkret speichern darf", "Noten, Fehlzeiten"],
], [160, 320, 336], [
    ("Für **eure** Schuldatenbank gilt: DSGVO als Rahmen, dazu das sächsische Recht", 0),
    ("Die Grundregeln sind überall dieselben: **Zweckbindung, Sparsamkeit, Fristen, Rechte**", 0),
], font_size=10.5, bold_cols=(0,))

d.bullets("Was das für einen Datenbankentwurf heißt", [
    ("**Datensparsamkeit** ist eine Entwurfsregel, keine Bitte: jedes Feld braucht einen Zweck", 0),
    ("**Löschfristen** gehören ins Modell — etwa ein Feld „gespeichert bis“", 0),
    ("**Rechte** je Rolle festlegen, nicht je Person", 0),
    ("**Pseudonymisieren**, wo Auswertungen keine Namen brauchen", 0),
    ("Das nennt man **Datenschutz durch Technikgestaltung** — Artikel 25 DSGVO", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Große Datenmengen", "Sich begründet positionieren")

d.table_top("Argumente in der Debatte", [
    ["dafür", "dagegen"],
    ["Erkenntnisse, die anders nicht möglich sind", "Rückschlüsse auf Einzelne trotz Anonymisierung"],
    ["bessere Vorhersagen, etwa in der Medizin", "Schieflagen in den Daten werden verstärkt"],
    ["effizientere Abläufe und weniger Verbrauch", "Machtgefälle: wer Daten hat, entscheidet"],
    ["Grundlage moderner Verfahren", "einmal erhoben, ist schwer zu löschen"],
], [400, 416], [
    ("Beide Spalten sind ernst zu nehmen — eine Positionierung braucht **beide**", 0),
    ("Die Frage ist selten **ob**, sondern **wofür**, **von wem** und **mit welcher Kontrolle**", 0),
], font_size=10.5, bold_cols=(0,))

d.bullets("Wie eine begründete Positionierung aussieht", [
    ("**These** in einem Satz — klar, nicht schwammig", 0),
    ("**Zwei Argumente** dafür, jeweils mit Beispiel", 0),
    ("**Ein Gegenargument** benennen und ernsthaft entkräften", 0),
    ("**Bedingungen** nennen, unter denen ihr eure Position ändern würdet", 0),
    ("Der letzte Punkt unterscheidet eine Position von einer Meinung", 0),
])

d.merksatz("Datensicherheit fragt: Sind die Daten geschützt? Datenschutz fragt: "
           "Dürfen wir sie überhaupt haben? Die zweite Frage kommt zuerst.")

d.bullets("Fun Facts: Datenschutz und Datenbanken", [
    ("Vier Orts- und Zeitangaben genügen, um **95 %** der Menschen in einem Mobilfunkdatensatz zu erkennen", 0),
    ("Die **Netflix-Preisdaten** von 2006 galten als anonym — Forscher deanonymisierten sie 2008", 0),
    ("Deshalb gilt Anonymisierung heute als **schwierig**, nicht als gelöst", 0),
    ("Die DSGVO kennt das **Recht auf Auskunft** — jede Datenbank muss es beantworten können", 0),
    ("Wer eine Datenbank entwirft, entscheidet damit, welche Auskunft später **möglich** ist", 0),
])

d.bullets("Eure Aufgabe: Abschluss LB 2", [
    ("Setzt an eurer Datenbank **Rechte** für zwei Rollen und eine **Sicht**", 0),
    ("Prüft euer Modell auf **Datensparsamkeit**: welches Feld könnte entfallen?", 0),
    ("Ergänzt eine **Löschfrist** und beschreibt, wie sie umgesetzt würde", 0),
    ("Schreibt eine **Positionierung** zu großen Datenmengen nach dem Muster oben", 0),
    ("Damit ist LB 2 abgeschlossen — nach den Ferien beginnt LB 3", 0),
])

d.save()

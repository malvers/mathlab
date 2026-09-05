#!/usr/bin/env python3
"""Datenbankanbindung der Webpraesenz planen (Woche 27, Anschluss LB 1)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG, php_parts
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE
from er_diagrams import er_diagram, schema_diagram, ORA, RD, GRN, NAVY

d = Deck("datenbankanbindung-planen.pptx")
P = lambda n: os.path.join(IMG, n)
php = lambda t, ls, **kw: d.code(t, [php_parts(l) for l in ls], **kw)

d.title("Informatik — FOS 12", "Die Daten hinter der Seite",
        "Datenbankanbindung planen — das ER-Modell aus Lernbereich 1 kommt zurück")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Erst das Modell", "Eine Webseite ist nur die Oberfläche")

d.bullets("Warum wir jetzt nicht programmieren", [
    ("Ohne Datenmodell entstehen Seiten, die **später nicht zusammenpassen**", 0),
    ("Die Fragen sind dieselben wie in **Lernbereich 1**: Welche Dinge? Welche Beziehungen?", 0),
    ("Ihr habt das Werkzeug schon: **ER-Modell**, **Überführung**, **Normalformen**", 0),
    ("Ein Fehler im Modell kostet in der Umsetzung das Zehnfache — jetzt ist er billig", 0),
    ("Am Ende dieser Woche steht ein **Schema**, gegen das ihr zwei Wochen lang programmieren könnt", 0),
])

d.table_top("Vom Projektthema zum Modell — in vier Schritten", [
    ["Schritt", "Frage", "Ergebnis"],
    ["1 Substantive", "Über welche Dinge speichern wir etwas?", "Liste der Entitätstypen"],
    ["2 Eigenschaften", "Was wissen wir über jedes Ding?", "Attribute, Schlüssel markiert"],
    ["3 Beziehungen", "Wie hängen die Dinge zusammen?", "Beziehungstypen mit Kardinalität"],
    ["4 Überführung", "Welche Tabellen entstehen daraus?", "Schema mit PK und FK"],
], [160, 350, 306], [
    ("Jeder **n:m**-Beziehungstyp wird zu einer **eigenen Tabelle** — das ist die häufigste Falle", 0),
    ("Danach mit den **Normalformen** gegenprüfen: steht jede Information genau einmal?", 0),
], font_size=11, bold_cols=(0,))

er = er_diagram(P("er-tagebuch.png"), 1870, 640, {
    "Nutzer":      {"pos": (330, 380), "color": ORA,
                    "attrs": [("NNr", True, (-200, -170)), ("Anzeigename", False, (0, -210)),
                              ("Tagesziel", False, (200, -170))]},
    "Mahlzeit":    {"pos": (940, 380), "color": RD,
                    "attrs": [("MNr", True, (-200, -170)), ("Datum", False, (0, -210)),
                              ("Art", False, (200, -170))]},
    "Lebensmittel": {"pos": (1540, 380), "color": GRN,
                     "attrs": [("LNr", True, (-210, -170)), ("Name", False, (0, -210)),
                               ("kcal", False, (210, -170))]},
}, [
    {"name": "führt", "pos": (635, 380), "ends": [("Nutzer", "1"), ("Mahlzeit", "n")]},
    {"name": "enthält", "pos": (1240, 380), "ends": [("Mahlzeit", "n"), ("Lebensmittel", "m")],
     "attrs": [("Menge", (0, 150))]},
])
d.picture("Beispielmodell: Ernährungstagebuch", er, [
    ("**1:n** zwischen Nutzer und Mahlzeit — ein Nutzer führt viele Mahlzeiten", 0),
    ("**n:m** zwischen Mahlzeit und Lebensmittel, mit dem Beziehungsattribut **Menge**", 0),
    ("Genau dieses n:m wird gleich zur dritten Tabelle", 0),
], width=680)

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Das Schema", "Aus dem Modell werden Tabellen")

sch = schema_diagram(P("schema-tagebuch.png"), [
    ("NUTZER", [("NNr", "PK"), ("Anzeigename", ""), ("Tagesziel", "")], ORA),
    ("MAHLZEIT", [("MNr", "PK"), ("Datum", ""), ("Art", ""), ("NNr", "FK")], RD),
    ("POSITION", [("MNr", "FK"), ("LNr", "FK"), ("Menge", "")], NAVY),
    ("LEBENSMITTEL", [("LNr", "PK"), ("Name", ""), ("kcal", "")], GRN),
], Hd=400, caption="Vier Tabellen - POSITION entsteht aus der n:m-Beziehung")
d.picture("Das Schema dazu", sch, [
    ("Die **1:n**-Beziehung wandert als **Fremdschlüssel NNr** in die Tabelle MAHLZEIT", 0),
    ("Die **n:m**-Beziehung wird zur Tabelle **POSITION** mit zusammengesetztem Schlüssel", 0),
    ("Das **Beziehungsattribut Menge** hat nur dort Platz — nirgends sonst", 0),
], width=760)

php("Die Tabellen anlegen (SQLite)", [
    "CREATE TABLE nutzer (",
    "    nnr INTEGER PRIMARY KEY,",
    "    anzeigename TEXT NOT NULL,",
    "    tagesziel INTEGER",
    ");",
    "CREATE TABLE mahlzeit (",
    "    mnr INTEGER PRIMARY KEY,",
    "    datum TEXT NOT NULL,",
    "    art TEXT,",
    "    nnr INTEGER REFERENCES nutzer(nnr)",
    ");",
    "CREATE TABLE position (",
    "    mnr INTEGER REFERENCES mahlzeit(mnr),",
    "    lnr INTEGER REFERENCES lebensmittel(lnr),",
    "    menge REAL,",
    "    PRIMARY KEY (mnr, lnr)",
    ");",
], size=10.5)

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Anbindung planen", "Welche Seite braucht welche Abfrage?")

d.table_top("Der Anbindungsplan — für jede Seite eine Zeile", [
    ["Seite", "zeigt / tut", "Tabellen", "Abfrage (grob)"],
    ["index.html", "Begrüßung, Tagesziel", "nutzer", "SELECT ... WHERE nnr = ?"],
    ["tag.php", "Mahlzeiten eines Tages", "mahlzeit, position, lebensmittel", "JOIN über drei Tabellen"],
    ["neu.php", "Mahlzeit eintragen", "mahlzeit, position", "INSERT INTO ..."],
    ["liste.php", "alle Lebensmittel, sortiert", "lebensmittel", "SELECT ... ORDER BY name"],
    ["suche.php", "Lebensmittel suchen", "lebensmittel", "WHERE name LIKE ?"],
], [130, 240, 260, 186], [
    ("Diese Tabelle ist **das** Planungsergebnis der Woche — sie sagt, was zu programmieren ist", 0),
    ("Fällt eine Seite auf, die **keine** Datenbank braucht: gut, die ist schnell fertig", 0),
    ("Fehlt einer Abfrage eine Tabelle: dann fehlt dem Modell etwas — jetzt nachbessern", 0),
], font_size=10.5, bold_cols=(0,), mono_cols=(3,))

php("Die typische Abfrage — mit Verbund", [
    "SELECT m.datum, m.art, l.name, p.menge, l.kcal * p.menge / 100 AS kcal_gesamt",
    "FROM mahlzeit m",
    "JOIN position p ON p.mnr = m.mnr",
    "JOIN lebensmittel l ON l.lnr = p.lnr",
    "WHERE m.nnr = ? AND m.datum = ?",
    "ORDER BY m.mnr;",
], size=11.5)

d.bullets("Was ihr aus Lernbereich 1 wiedererkennt", [
    ("Der **Verbund (JOIN)** setzt zusammen, was die Normalisierung getrennt hat", 0),
    ("Die **Fremdschlüssel** sind genau die Spalten, über die verbunden wird", 0),
    ("Das **Fragezeichen** ist ein Platzhalter — nie Nutzereingaben in den SQL-Text kleben", 0),
    ("**AS** benennt eine berechnete Spalte, damit die Ausgabe lesbar bleibt", 0),
    ("Testet jede Abfrage **zuerst im DBMS**, erst danach im Programm", 0),
])

# ---------------------------------------------------------------- Kapitel 04
d.chapter(4, "Dokumentieren", "Problemanalyse und Lösungsentwurf schriftlich")

d.table_top("Was diese Woche ins Projekttagebuch kommt", [
    ["Abschnitt", "Inhalt", "Umfang"],
    ["Problemanalyse", "Was soll die Anwendung leisten? Für wen? Welche Daten?", "½ Seite"],
    ["Datenmodell", "ER-Modell als Zeichnung, mit Kardinalitäten", "1 Bild"],
    ["Schema", "Tabellen mit Primär- und Fremdschlüsseln, CREATE-Anweisungen", "1 Seite"],
    ["Anbindungsplan", "die Tabelle „Seite — zeigt — Tabellen — Abfrage“", "1 Tabelle"],
    ["Offene Fragen", "was noch geklärt werden muss und von wem", "Stichpunkte"],
], [170, 400, 246], [
    ("Diese fünf Punkte sind zugleich der **Bewertungsteil „Prozess“** — sie werden gelesen", 0),
    ("Schreibt in **Fachsprache**: Entitätstyp, Kardinalität, Fremdschlüssel, Verbund", 0),
], font_size=11, bold_cols=(0,))

d.bullets("Häufige Planungsfehler — jetzt vermeiden", [
    ("**Alles in eine Tabelle**: erzeugt genau die Anomalien aus Woche 3", 0),
    ("**n:m ohne eigene Tabelle**: geht nicht, egal wie sehr man es sich wünscht", 0),
    ("**Kein Primärschlüssel**: dann lässt sich kein Datensatz eindeutig ansprechen", 0),
    ("**Berechnetes gespeichert**: Kalorien pro Mahlzeit gehören berechnet, nicht abgelegt", 0),
    ("**Zu groß geplant**: lieber vier Tabellen, die laufen, als zehn, die nie fertig werden", 0),
])

d.merksatz("Erst das Modell, dann das Schema, dann der Anbindungsplan. "
           "Wer in dieser Reihenfolge arbeitet, programmiert nur einmal.")

d.bullets("Fun Facts: Daten im Web", [
    ("Fast jede Website, die mehr als Text zeigt, ist eine **Datenbankanwendung** mit Oberfläche", 0),
    ("**WordPress** betreibt über 40 % aller Websites — mit einem Schema aus rund zwölf Tabellen", 0),
    ("**SQLite** steckt in jedem Smartphone, in Browsern und Flugzeugen — die meistverbreitete Datenbank der Welt", 0),
    ("Die größte Schwachstelle von Webanwendungen war jahrelang die **SQL-Injection** — Thema in Woche 30", 0),
])

d.bullets("Eure Aufgabe: das Modell für euer Projekt", [
    ("Zeichnet das **ER-Modell** eures Themas mit mindestens drei Entitätstypen und Kardinalitäten", 0),
    ("**Überführt** es in ein Schema und schreibt die **CREATE TABLE**-Anweisungen auf", 0),
    ("Prüft mit den **Normalformen** gegen — dokumentiert, was ihr geändert habt", 0),
    ("Füllt den **Anbindungsplan** für alle geplanten Seiten aus", 0),
    ("Legt **Testdaten** an: drei bis fünf Zeilen je Tabelle, frei erfunden, keine echten Personen", 0),
])

d.save()

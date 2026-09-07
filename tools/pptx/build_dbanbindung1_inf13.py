#!/usr/bin/env python3
"""Informatik 13 (BGY), Woche 17 / KW 52: Datenbankanbindung I - Konzept und
Anbindung (LB 4, Ustd. 9-10/18)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG, php_parts, html_parts
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE
from flow_diagrams import pap

d = Deck("datenbankanbindung-1.pptx")
P = lambda n: os.path.join(IMG, n)
php = lambda t, ls, **kw: d.code(t, [php_parts(l) for l in ls], **kw)
html = lambda t, ls, **kw: d.code(t, [html_parts(l) for l in ls], **kw)

d.title("Informatik — Grundkurs 13", "Die Seite bekommt ein Gedächtnis",
        "Datenmodell, Anbindung und Formulare — vom Browser bis in die Tabelle")

d.chapter(1, "Das Konzept", "Wer macht was")

dia = pap(P("pap-webstack-inf13.png"), 1560, 400, {
    "b": dict(pos=(200, 130), w=300, h=120, kind="io", text="Browser: HTML-Formular"),
    "s": dict(pos=(650, 130), w=320, h=120, text="Server: Skript (PHP)"),
    "d": dict(pos=(1150, 130), w=300, h=120, text="Datenbank: MySQL"),
}, [
    ("b", "s", "POST"),
    ("s", "d", "SQL"),
    ("d", "s", "Ergebnis", [(1150, 290), (650, 290)]),
    ("s", "b", "HTML", [(450, 350), (200, 350)]),
], notes=[("Der Browser sieht nie die Datenbank", (820, 372))], size=27)
d.picture("Die drei Schichten", dia, [
    ("Der Browser spricht **nie** direkt mit der Datenbank — immer über das Serverskript", 0),
    ("Das ist derselbe Gedanke wie beim DBMS: **eine Stelle, die aufpasst**", 0),
], width=816)

d.table_top("Wer wofür zuständig ist", [
    ["Schicht", "Aufgabe", "Sprache"],
    ["Browser (Client)", "Anzeige, Eingabe entgegennehmen", "HTML, CSS, JS"],
    ["Server", "prüfen, rechnen, Datenbank befragen", "PHP, Python, Java"],
    ["Datenbank", "speichern, suchen, Integrität sichern", "SQL"],
], [200, 350, 266], [
    ("Prüfungen im Browser sind **Bequemlichkeit** — die verbindliche Prüfung passiert auf dem Server", 0),
    ("Denn wer den Browser umgeht, umgeht auch dessen Prüfung", 0),
], font_size=11, bold_cols=(0,), marks={(2, 0): TINT_GREEN})

d.chapter(2, "Das Formular", "Daten vom Nutzer zum Server")

html("Ein Formular, das speichert", [
    "<form action=\"speichern.php\" method=\"post\">",
    "  <label for=\"name\">Vereinsname</label>",
    "  <input id=\"name\" name=\"name\" type=\"text\" required maxlength=\"80\">",
    "",
    "  <label for=\"ort\">Ort</label>",
    "  <input id=\"ort\" name=\"ort\" type=\"text\" required>",
    "",
    "  <button type=\"submit\">Speichern</button>",
    "</form>",
], size=12),

d.table_top("GET oder POST?", [
    ["", "GET", "POST"],
    ["Daten stehen", "in der URL", "im Nachrichtenkörper"],
    ["sichtbar", "ja, auch im Verlauf", "nein"],
    ["Länge", "begrenzt", "praktisch unbegrenzt"],
    ["geeignet für", "Suchen und Filtern", "Speichern und Ändern"],
], [180, 320, 316], [
    ("Faustregel: **GET liest, POST verändert**", 0),
    ("Ein Löschlink per GET ist ein Klassiker unter den Fehlern — Suchmaschinen klicken ihn", 0),
], font_size=11, bold_cols=(0,), marks={(4, 2): TINT_GREEN})

d.chapter(3, "Die Anbindung", "Vorbereitete Anweisungen")

php("Speichern - richtig gemacht", [
    "<?php",
    "$pdo = new PDO('mysql:host=localhost;dbname=vereine;charset=utf8mb4',",
    "               $benutzer, $passwort);",
    "",
    "$name = trim($_POST['name'] ?? '');",
    "$ort  = trim($_POST['ort']  ?? '');",
    "",
    "if ($name === '' || $ort === '') {",
    "    die('Bitte alle Felder ausfuellen.');",
    "}",
    "",
    "$stmt = $pdo->prepare('INSERT INTO Verein (name, ort) VALUES (?, ?)');",
    "$stmt->execute([$name, $ort]);",
    "?>",
], size=11)

d.bullets("Warum prepare und execute?", [
    ("Zusammengeklebtes SQL erlaubt **SQL-Injection**: Eingaben werden zu Befehlen", 0),
    ("**prepare** schickt die Anweisung **ohne** die Werte an die Datenbank", 0),
    ("Die Werte kommen **getrennt** hinterher und können nie als Befehl gelesen werden", 0),
    ("Das ist keine Stilfrage, sondern die **Grundregel** jeder Datenbankanbindung", 0),
    ("Und die Zugangsdaten stehen **nicht** im Quelltext, sondern in einer Konfigurationsdatei außerhalb", 0),
])

d.merksatz("Nie Nutzereingaben in einen SQL-Text kleben. Immer vorbereitete "
           "Anweisungen mit Platzhaltern — sonst schreibt der Nutzer eure Befehle.")

d.bullets("Fun Facts: Anbindung", [
    ("**SQL-Injection** steht seit Jahren in den Top-Risiken der OWASP-Liste", 0),
    ("Der Klassiker ist der Comic mit dem Schüler **„Robert'); DROP TABLE Students;--“**", 0),
    ("**PDO** ist eine einheitliche Schnittstelle: derselbe Code spricht mit MySQL, SQLite, PostgreSQL", 0),
    ("**utf8mb4** statt utf8 — nur damit funktionieren Emojis und seltene Zeichen zuverlässig", 0),
    ("Zugangsdaten im öffentlichen Repository sind der häufigste Anfängerfehler überhaupt", 0),
])

d.bullets("Eure Aufgabe am Rechner", [
    ("Legt eure **Datenbank** nach dem ER-Modell aus KW 48 an", 0),
    ("Baut ein **Formular** mit mindestens drei Feldern und passenden Labels", 0),
    ("Speichert die Daten mit **prepare und execute**", 0),
    ("Prüft die Eingaben **auf dem Server**, nicht nur im Browser", 0),
    ("Legt die **Zugangsdaten** in eine eigene Datei, die nicht im Projektordner der Webseite liegt", 0),
])

d.save()

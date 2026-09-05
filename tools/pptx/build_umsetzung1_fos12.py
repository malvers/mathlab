#!/usr/bin/env python3
"""Umsetzung I: Implementierung der Webpraesenz (Woche 28)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG, html_parts, php_parts
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("umsetzung1-implementierung.pptx")
P = lambda n: os.path.join(IMG, n)
php = lambda t, ls, **kw: d.code(t, [php_parts(l) for l in ls], **kw)
html = lambda t, ls, **kw: d.code(t, [html_parts(l) for l in ls], **kw)

d.title("Informatik — FOS 12", "Umsetzung I",
        "Vom Plan zum laufenden Projekt: Seitenstruktur und Datenbankanbindung")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Reihenfolge", "In welcher Ordnung ein Projekt entsteht")

d.table_top("Sieben Schritte — in dieser Reihenfolge", [
    ["Schritt", "was entsteht", "fertig, wenn …"],
    ["1 Gerüst", "Ordnerstruktur, index, stil.css", "die Startseite lädt mit Layout"],
    ["2 Navigation", "Kopf, Menü, Fuß auf allen Seiten", "jede Seite ist von jeder erreichbar"],
    ["3 Statische Inhalte", "Texte und Bilder zum Thema", "die Seite ist ohne Daten schon lesbar"],
    ["4 Datenbank", "Tabellen + Testdaten angelegt", "Abfragen laufen im DBMS"],
    ["5 Verbindung", "eine Seite zeigt echte Datensätze", "die Liste kommt aus der Datenbank"],
    ["6 Eingabe", "ein Formular schreibt in die Datenbank", "der neue Datensatz erscheint in der Liste"],
    ["7 Rest", "weitere Seiten nach demselben Muster", "der Anbindungsplan ist abgearbeitet"],
], [150, 300, 366], [
    ("Schritt 5 ist der **Meilenstein** dieser Woche: **eine** Seite mit echten Daten", 0),
    ("Nie zwei Baustellen gleichzeitig — erst wenn ein Schritt läuft, beginnt der nächste", 0),
], font_size=10.5, bold_cols=(0,), marks={(5, c): TINT_GREEN for c in range(3)})

d.bullets("Ordnung im Projektordner", [
    ("**index.html** ganz oben — der Einstiegspunkt heißt immer so", 0),
    ("**css/** für Stylesheets, **bilder/** für Bilder, **daten/** für die Datenbankdatei", 0),
    ("Dateinamen **klein**, ohne Leerzeichen und ohne Umlaute — Server sind da strenger als Windows", 0),
    ("**Relative Pfade** benutzen (bilder/apfel.jpg), keine Laufwerksbuchstaben", 0),
    ("Eine **Sicherungskopie** je Arbeitstag — im Teamordner, mit Datum im Namen", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Seitenstruktur", "Kopf und Fuß nur einmal schreiben")

php("Wiederholtes auslagern", [
    "<?php include 'teile/kopf.php'; ?>",
    "",
    "<main>",
    "    <h1>Mein Tag</h1>",
    "    <p>Hier stehen die Mahlzeiten von heute.</p>",
    "</main>",
    "",
    "<?php include 'teile/fuss.php'; ?>",
], size=13.5)

d.bullets("Warum das der wichtigste Handgriff der Woche ist", [
    ("Navigation und Fußzeile stehen **einmal** da — Änderung wirkt auf allen Seiten", 0),
    ("Genau dasselbe Prinzip wie **eine** CSS-Datei für alle Seiten", 0),
    ("Ohne Serverumgebung geht **include** nicht — dann kopiert ihr den Block und pflegt ihn bewusst", 0),
    ("Vergesst nicht: Seiten mit PHP-Code müssen auf **.php** enden", 0),
    ("Testet nach dem Umbau **jede** Seite einmal — ein fehlender Pfad fällt sonst erst spät auf", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Daten holen", "Die erste Seite mit echten Datensätzen")

php("Verbindung und Abfrage", [
    "<?php",
    "// teile/db.php - wird von jeder Seite eingebunden",
    "$db = new PDO('sqlite:daten/tagebuch.db');",
    "$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);",
    "?>",
    "",
    "<?php include 'teile/db.php'; ?>",
    "<table>",
    "    <tr><th>Lebensmittel</th><th>kcal je 100 g</th></tr>",
    "<?php",
    "$stmt = $db->query('SELECT name, kcal FROM lebensmittel ORDER BY name');",
    "foreach ($stmt as $zeile) {",
    "    echo '<tr><td>' . htmlspecialchars($zeile['name']) . '</td>';",
    "    echo '<td>' . (int)$zeile['kcal'] . '</td></tr>';",
    "}",
    "?>",
    "</table>",
], size=10.5)

php("Ein Formular, das speichert", [
    "<form method=\"post\" action=\"neu.php\">",
    "    <label for=\"name\">Lebensmittel</label>",
    "    <input type=\"text\" id=\"name\" name=\"name\" required>",
    "",
    "    <label for=\"kcal\">kcal je 100 g</label>",
    "    <input type=\"number\" id=\"kcal\" name=\"kcal\" min=\"0\" max=\"900\" required>",
    "",
    "    <button type=\"submit\">Speichern</button>",
    "</form>",
    "",
    "<?php",
    "if (isset($_POST['name'])) {",
    "    $stmt = $db->prepare('INSERT INTO lebensmittel (name, kcal) VALUES (?, ?)');",
    "    $stmt->execute([$_POST['name'], (int)$_POST['kcal']]);",
    "    echo '<p>Gespeichert.</p>';",
    "}",
    "?>",
], size=10.5)

d.bullets("Drei Regeln, die ab jetzt immer gelten", [
    ("**method=\"post\"** für alles, was speichert — GET nur zum Abholen", 0),
    ("**prepare** mit Platzhaltern, nie Nutzertext in den SQL-Text kleben", 0),
    ("**htmlspecialchars** um jede Ausgabe, die aus der Datenbank oder vom Nutzer kommt", 0),
    ("Jedes Eingabefeld braucht ein **label** — Pflicht für Barrierefreiheit und Bedienung", 0),
    ("Warum das mehr als Stil ist, klären wir in **Woche 30**: SQL-Injection und XSS", 0),
])

d.table_top("Wenn nichts erscheint — die Checkliste", [
    ["Symptom", "häufige Ursache", "Prüfung"],
    ["weiße Seite", "PHP-Fehler wird nicht angezeigt", "Fehlermeldungen einschalten, Log ansehen"],
    ["PHP-Code steht im Browser", "Datei heißt .html statt .php", "umbenennen, über den Server aufrufen"],
    ["Tabelle bleibt leer", "Abfrage liefert nichts", "dieselbe Abfrage im DBMS ausführen"],
    ["„no such table“", "falscher Pfad zur Datenbankdatei", "Pfad relativ zur aufrufenden Datei prüfen"],
    ["Umlaute kaputt", "Zeichensatz", "UTF-8 in HTML, Datei und Datenbank"],
    ["Formular tut nichts", "name-Attribut fehlt", "jedes Feld braucht name=\"…\""],
], [180, 280, 356], [
    ("**Immer zuerst** die Abfrage im DBMS testen — dann weiß man, wo der Fehler nicht liegt", 0),
], font_size=10.5, bold_cols=(0,), marks={(r, 0): TINT_RED for r in range(1, 7)})

# ---------------------------------------------------------------- Kapitel 04
d.chapter(4, "Arbeitsstand", "Dokumentieren, während es passiert")

d.table_top("Wann eine Aufgabe wirklich fertig ist", [
    ["Kriterium", "erfüllt, wenn …"],
    ["Es läuft", "die Seite lädt ohne Fehlermeldung"],
    ["Es stimmt", "mindestens ein Testfall wurde durchgespielt und notiert"],
    ["Es ist sauber", "HTML validiert, CSS getrennt, sprechende Namen"],
    ["Es ist im Ordner", "die Datei liegt im Teamordner, nicht nur lokal"],
    ["Es steht im Tagebuch", "Datum, wer, was, welches Problem"],
], [200, 616], [
    ("Diese fünf Punkte sind die **Definition of Done** — ohne sie gilt eine Aufgabe als offen", 0),
    ("„Bei mir lief es“ ist keine Abgabe: es muss im **gemeinsamen** Ordner laufen", 0),
], font_size=11, bold_cols=(0,))

d.bullets("Das Projekttagebuch dieser Woche", [
    ("Pro Stunde **ein Absatz**: Datum, Anwesende, Ziel, Ergebnis, Probleme, nächster Schritt", 0),
    ("**Screenshots** vom Zwischenstand — sie sind später der Beleg für den Fortschritt", 0),
    ("**Entscheidungen begründen**: warum diese Struktur, warum dieses Feld?", 0),
    ("**Quellen** sofort notieren: Bilder, Codeschnipsel, Tutorials — mit Datum und Lizenz", 0),
    ("Wer **KI-Werkzeuge** nutzt, schreibt hinein, wofür und was davon geändert wurde", 0),
])

d.bullets("Fun Facts: Umsetzung", [
    ("Die **90-90-Regel**: Die ersten 90 % des Codes brauchen 90 % der Zeit. Die letzten 10 % brauchen die anderen 90 %", 0),
    ("**PHP** hieß ursprünglich „Personal Home Page Tools“ und war 1994 ein Bastelprojekt von Rasmus Lerdorf", 0),
    ("Der Fachbegriff für „erst das Gerüst, dann die Details“ ist **Walking Skeleton** — ein Programm, das von Anfang an durchläuft", 0),
    ("**Ctrl+S** ist die meistgedrückte Tastenkombination in jeder Projektwoche — Sicherungskopien nicht vergessen", 0),
])

d.bullets("Eure Aufgabe: der Meilenstein dieser Woche", [
    ("**Alle** geplanten Seiten existieren mit Kopf, Navigation und Fuß", 0),
    ("Die **Datenbank** ist angelegt und mit Testdaten gefüllt", 0),
    ("**Mindestens eine** Seite zeigt echte Datensätze aus der Datenbank", 0),
    ("**Ein** Formular schreibt einen Datensatz — mit prepare und htmlspecialchars", 0),
    ("Der **Arbeitsstand** ist im Tagebuch dokumentiert, inklusive Screenshot und offener Punkte", 0),
])

d.save()

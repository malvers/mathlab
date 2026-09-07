#!/usr/bin/env python3
"""Informatik 13 (BGY), Woche 19 / KW 1: Datenbankanbindung II - dynamische
Inhalte (LB 4, Ustd. 11-12/18)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG, php_parts
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("datenbankanbindung-2.pptx")
php = lambda t, ls, **kw: d.code(t, [php_parts(l) for l in ls], **kw)

d.title("Informatik — Grundkurs 13", "Inhalte aus der Datenbank",
        "Dynamisch anzeigen, filtern, ausgeben — und der Team-Review")

d.chapter(1, "Auslesen und anzeigen", "Die Gegenrichtung zum Speichern")

php("Alle Vereine ausgeben", [
    "<?php",
    "$stmt = $pdo->query('SELECT name, ort FROM Verein ORDER BY name');",
    "$vereine = $stmt->fetchAll(PDO::FETCH_ASSOC);",
    "?>",
    "<ul>",
    "<?php foreach ($vereine as $v): ?>",
    "  <li><?= htmlspecialchars($v['name']) ?> (<?= htmlspecialchars($v['ort']) ?>)</li>",
    "<?php endforeach; ?>",
    "</ul>",
], size=11.5)

d.bullets("Was in diesen neun Zeilen steckt", [
    ("**query** genügt hier, weil keine Nutzereingabe im SQL steht", 0),
    ("**fetchAll** holt alle Zeilen als Liste von Datensätzen", 0),
    ("Die **Schleife** erzeugt je Datensatz ein Listenelement", 0),
    ("**htmlspecialchars** wandelt Sonderzeichen um — das verhindert **Cross-Site-Scripting**", 0),
    ("Ohne diese Funktion könnte ein Vereinsname ein Skript in eure Seite schmuggeln", 0),
])

d.table_top("Die zwei Angriffe, die man kennen muss", [
    ["Angriff", "Idee", "Gegenmittel"],
    ["SQL-Injection", "Eingabe wird zu SQL-Befehl", "prepare mit Platzhaltern"],
    ["Cross-Site-Scripting", "Eingabe wird zu HTML oder JavaScript", "beim Ausgeben maskieren"],
], [200, 350, 266], [
    ("Merksatz: **beim Hineinschreiben vorbereiten, beim Herausgeben maskieren**", 0),
    ("Beides ist Pflicht — eines allein genügt nicht", 0),
], font_size=11, bold_cols=(0,), marks={(1, 2): TINT_GREEN, (2, 2): TINT_GREEN})

d.chapter(2, "Filtern", "Parameter aus der URL")

php("Eine Liste mit Filter", [
    "<?php",
    "$ort = $_GET['ort'] ?? '';",
    "",
    "if ($ort !== '') {",
    "    $stmt = $pdo->prepare('SELECT name, ort FROM Verein WHERE ort = ? ORDER BY name');",
    "    $stmt->execute([$ort]);",
    "} else {",
    "    $stmt = $pdo->query('SELECT name, ort FROM Verein ORDER BY name');",
    "}",
    "$vereine = $stmt->fetchAll(PDO::FETCH_ASSOC);",
    "?>",
], size=11.5)

d.bullets("Warum hier prepare zwingend ist", [
    ("**$_GET['ort']** kommt vom Nutzer — es steht in der URL und ist frei änderbar", 0),
    ("Zusammengeklebt wäre das eine offene Tür für **SQL-Injection**", 0),
    ("Mit Platzhalter bleibt der Wert ein **Wert** und wird nie zum Befehl", 0),
    ("Zusätzlich: prüfen, ob der Wert überhaupt **plausibel** ist", 0),
    ("Und den Filter im Formular als **Auswahlliste** anbieten statt als freies Feld", 0),
])

d.chapter(3, "Der Team-Review", "Zwischenstand ansehen lassen")

d.table_top("Die Prüfliste für den Review", [
    ["Bereich", "Frage"],
    ["Funktion", "Läuft Speichern und Anzeigen auf einem fremden Rechner?"],
    ["Sicherheit", "Steht überall prepare und htmlspecialchars?"],
    ["Zugangsdaten", "Liegen sie außerhalb des Webordners?"],
    ["Datenmodell", "Passt es noch zu dem, was die Seite tatsächlich braucht?"],
    ["Barrierefreiheit", "Haben alle Felder ein Label, alle Bilder ein alt?"],
], [200, 616], [
    ("Der Review passiert **zwischen** den Teams, nicht innerhalb", 0),
    ("Fremde Augen finden die Stellen, an denen man selbst blind geworden ist", 0),
], font_size=11, bold_cols=(0,), marks={(3, 0): TINT_RED})

d.merksatz("Beim Hineinschreiben vorbereiten, beim Herausgeben maskieren. "
           "Zwei Handgriffe, die die häufigsten Angriffe unmöglich machen.")

d.bullets("Fun Facts: dynamische Seiten", [
    ("**PHP** entstand 1994 als Sammlung von Skripten für eine private Homepage", 0),
    ("**XSS** steht seit Jahren neben SQL-Injection in den Top-Risiken der OWASP-Liste", 0),
    ("Ein einziges vergessenes **htmlspecialchars** genügt für eine Lücke", 0),
    ("Deshalb maskieren moderne Vorlagensysteme **automatisch** beim Ausgeben", 0),
    ("Der Merksatz der Praxis lautet: **Traue niemals Eingaben** — auch nicht der eigenen Datenbank", 0),
])

d.bullets("Eure Aufgabe am Rechner", [
    ("Zeigt eure Daten **dynamisch** an — als Liste oder Tabelle", 0),
    ("Baut einen **Filter** über einen GET-Parameter ein, mit prepare", 0),
    ("Prüft jede Ausgabe auf **htmlspecialchars**", 0),
    ("**Team-Review** mit dem Nachbarteam nach der Prüfliste", 0),
    ("Notiert die Funde und arbeitet mindestens **drei** davon ab", 0),
])

d.save()

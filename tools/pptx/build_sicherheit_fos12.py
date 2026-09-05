#!/usr/bin/env python3
"""Datensicherheit und Datenschutz der Webanwendung (Woche 30)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG, php_parts, html_parts
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("datensicherheit-datenschutz.pptx")
P = lambda n: os.path.join(IMG, n)
php = lambda t, ls, **kw: d.code(t, [php_parts(l) for l in ls], **kw)

d.title("Informatik — FOS 12", "Datensicherheit und Datenschutz",
        "Warum es nötig ist — und was ihr im Projekt konkret tut")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Zwei Begriffe", "Sie klingen ähnlich und meinen Verschiedenes")

d.table_top("Datenschutz und Datensicherheit", [
    ["", "Datenschutz", "Datensicherheit"],
    ["schützt", "die Person", "die Daten"],
    ["Frage", "Darf ich diese Daten überhaupt haben?", "Sind meine Daten vor Verlust und Zugriff geschützt?"],
    ["Grundlage", "DSGVO, BDSG — Recht", "Technik und Organisation"],
    ["Beispiel", "Nur die E-Mail speichern, die wirklich gebraucht wird", "Passwörter gehasht, Verbindung verschlüsselt"],
    ["Verstoß", "Bußgeld, Abmahnung", "Datenleck, Ausfall, Manipulation"],
], [130, 340, 346], [
    ("Man kann Daten **sicher** speichern, die man **gar nicht speichern dürfte** — und umgekehrt", 0),
    ("Im Projekt braucht ihr **beides** und dokumentiert **beides**", 0),
], font_size=10.5, bold_cols=(0,),
   marks={(r, 1): TINT_ORANGE for r in range(1, 6)} | {(r, 2): TINT_BLUE for r in range(1, 6)})

d.bullets("Die DSGVO-Grundsätze, die euer Projekt betreffen", [
    ("**Datenminimierung**: nur erheben, was für den Zweck wirklich nötig ist", 0),
    ("**Zweckbindung**: die Daten nur für das benutzen, wofür sie erhoben wurden", 0),
    ("**Transparenz**: der Nutzer erfährt, was gespeichert wird — Datenschutzhinweis auf der Seite", 0),
    ("**Speicherbegrenzung**: löschen, was nicht mehr gebraucht wird", 0),
    ("**Integrität und Vertraulichkeit**: technische Maßnahmen sind gesetzlich vorgeschrieben", 0),
    ("Im Schulprojekt am einfachsten erfüllt durch: **erfundene Testdaten**, keine echten Personen", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Angriffe", "Zwei Lücken, die fast jedes Anfängerprojekt hat")

php("SQL-Injection — so entsteht die Lücke", [
    "<?php",
    "// FALSCH: Nutzereingabe wird in den SQL-Text geklebt",
    "$name = $_POST['name'];",
    "$sql = \"SELECT * FROM nutzer WHERE name = '$name'\";",
    "$db->query($sql);",
    "",
    "// Eingabe:   x' OR '1'='1",
    "// Ergebnis:  SELECT * FROM nutzer WHERE name = 'x' OR '1'='1'",
    "//            -> liefert ALLE Datensaetze",
    "",
    "// Eingabe:   x'; DROP TABLE nutzer; --",
    "//            -> im schlimmsten Fall ist die Tabelle weg",
    "?>",
], size=11.5)

php("SQL-Injection — so wird sie verhindert", [
    "<?php",
    "// RICHTIG: Platzhalter, der Wert wird nie Teil des Befehls",
    "$stmt = $db->prepare('SELECT * FROM nutzer WHERE name = ?');",
    "$stmt->execute([$_POST['name']]);",
    "$treffer = $stmt->fetchAll();",
    "",
    "// Die Datenbank kennt den Befehl BEVOR sie den Wert sieht.",
    "// Aus x' OR '1'='1 wird dann einfach ein Name, den es nicht gibt.",
    "?>",
], size=12.5)

php("Cross-Site-Scripting (XSS) — Ausgabe entschärfen", [
    "<?php",
    "// FALSCH: fremder Text landet ungeprueft in der Seite",
    "echo '<p>' . $_POST['kommentar'] . '</p>';",
    "// Eingabe: <script>alert('gehackt')</script>  -> wird ausgefuehrt",
    "",
    "// RICHTIG: Sonderzeichen unschaedlich machen",
    "echo '<p>' . htmlspecialchars($_POST['kommentar']) . '</p>';",
    "// aus < wird &lt; - der Browser zeigt es an, statt es auszufuehren",
    "?>",
], size=12)

d.table_top("Schwachstellen und Gegenmaßnahmen", [
    ["Schwachstelle", "was passiert", "Gegenmaßnahme"],
    ["SQL-Injection", "fremder SQL-Code wird ausgeführt", "prepare mit Platzhaltern"],
    ["XSS", "fremdes JavaScript läuft im Browser", "htmlspecialchars bei jeder Ausgabe"],
    ["fehlende Serverprüfung", "Browserprüfung wird umgangen", "alles auf dem Server erneut prüfen"],
    ["Klartext-Passwörter", "ein Leck betrifft alle Nutzer", "password_hash statt Klartext"],
    ["unverschlüsselte Übertragung", "Mitlesen im WLAN", "HTTPS erzwingen"],
    ["zu viele Rechte", "ein Fehler betrifft alles", "nur die nötigen Rechte vergeben"],
], [220, 300, 296], [
    ("Die ersten beiden Zeilen decken den größten Teil aller Angriffe auf kleine Webprojekte ab", 0),
], font_size=10.5, bold_cols=(0,), marks={(1, 0): TINT_RED, (2, 0): TINT_RED})

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Passwörter", "Niemals im Klartext, niemals selbst gebaut")

php("So werden Passwörter behandelt", [
    "<?php",
    "// Registrierung: nur den Hash speichern, nie das Passwort",
    "$hash = password_hash($_POST['passwort'], PASSWORD_DEFAULT);",
    "$stmt = $db->prepare('INSERT INTO nutzer (name, pwhash) VALUES (?, ?)');",
    "$stmt->execute([$_POST['name'], $hash]);",
    "",
    "// Anmeldung: vergleichen, nicht entschluesseln",
    "$stmt = $db->prepare('SELECT pwhash FROM nutzer WHERE name = ?');",
    "$stmt->execute([$_POST['name']]);",
    "$zeile = $stmt->fetch();",
    "",
    "if ($zeile && password_verify($_POST['passwort'], $zeile['pwhash'])) {",
    "    session_start();",
    "    $_SESSION['nutzer'] = $_POST['name'];",
    "}",
    "?>",
], size=10.5)

d.bullets("Was daran wichtig ist", [
    ("Ein **Hash** lässt sich nicht zurückrechnen — man kann nur **vergleichen**", 0),
    ("**password_hash** würzt jedes Passwort mit einem Zufallswert (**Salt**) — gleiche Passwörter, verschiedene Hashes", 0),
    ("Niemals eine **eigene** Verschlüsselung erfinden: dafür gibt es geprüfte Funktionen", 0),
    ("**Niemals** ein Passwort im Quelltext, in einem Kommentar oder in einer Beispieldatei", 0),
    ("Und im Schulprojekt: Passwörter nur für **erfundene** Testkonten", 0),
])

d.table_top("Übertragung und Speicherung", [
    ["Maßnahme", "schützt gegen", "Aufwand im Projekt"],
    ["HTTPS statt HTTP", "Mitlesen und Verändern unterwegs", "Servereinstellung"],
    ["Sitzungen (Sessions)", "fremdes Weiterbenutzen eines Logins", "session_start und Abmelden"],
    ["Datenbank außerhalb des Webordners", "direkter Download der Datei", "Ordner umlegen"],
    ["Sicherungskopien", "Verlust durch Fehler oder Defekt", "täglich, im Teamordner"],
    ["Rechte einschränken", "Schaden bei einem Einbruch", "eigener Datenbanknutzer"],
], [270, 290, 256], [
    ("Bei **SQLite** ist die Datenbank eine Datei — sie darf **nicht** über die URL erreichbar sein", 0),
], font_size=10.5, bold_cols=(0,))

# ---------------------------------------------------------------- Kapitel 04
d.chapter(4, "Im Projekt", "Maßnahmen umsetzen und dokumentieren")

d.table_top("Eure Sicherheitscheckliste", [
    ["Nr", "Prüfpunkt", "erledigt"],
    ["1", "Jede Datenbankabfrage mit Nutzereingabe benutzt prepare", "____"],
    ["2", "Jede Ausgabe fremder Daten geht durch htmlspecialchars", "____"],
    ["3", "Jede Eingabe wird auf dem Server geprüft (Typ, Bereich, Länge)", "____"],
    ["4", "Passwörter nur als Hash, kein Klartext im Code oder in der DB", "____"],
    ["5", "Keine echten personenbezogenen Daten im Projekt", "____"],
    ["6", "Datenschutzhinweis auf der Seite: was wird gespeichert, wozu", "____"],
    ["7", "Datenbankdatei nicht über die URL erreichbar", "____"],
    ["8", "Sicherungskopie vorhanden und wiederherstellbar", "____"],
], [50, 610, 156], [
    ("Diese acht Punkte gehören **ausgefüllt** in die Projektdokumentation", 0),
    ("Zu jedem Punkt: **eine Zeile**, wie ihr ihn umgesetzt habt — nicht nur ein Häkchen", 0),
], font_size=10.5, bold_cols=(0,), align="cll")

d.bullets("Anschluss an Klasse 11", [
    ("In **Klasse 11, LB 2** ging es um Gefahren im Netz und um Schutz der eigenen Daten", 0),
    ("Jetzt seid ihr auf der **anderen Seite**: ihr baut das System, das Daten anderer verwaltet", 0),
    ("Damit übernehmt ihr **Verantwortung** — auch in einem Schulprojekt", 0),
    ("Die Frage „**Brauche ich dieses Feld wirklich?**“ ist die wirksamste Sicherheitsmaßnahme", 0),
    ("Was nicht gespeichert wird, kann nicht gestohlen werden", 0),
])

d.merksatz("Was nicht gespeichert wird, kann nicht verloren gehen. "
           "Datenminimierung ist die stärkste Sicherheitsmaßnahme.")

d.bullets("Fun Facts: Sicherheit", [
    ("**Little Bobby Tables** ist der berühmteste Comic der Informatik — ein Kind namens Robert'); DROP TABLE Students; --", 0),
    ("Die **OWASP Top 10** listen seit 2003 die häufigsten Web-Schwachstellen; Injection war fast immer auf Platz 1", 0),
    ("Beim **Adobe-Leck 2013** waren 153 Mio. Passwörter schlecht verschlüsselt — die Hinweise standen im Klartext daneben", 0),
    ("Das meistgenutzte Passwort der Welt ist seit Jahren **123456** — dicht gefolgt von **password**", 0),
    ("Die **DSGVO** gilt seit Mai 2018 und kann bis zu 4 % des weltweiten Jahresumsatzes kosten", 0),
])

d.bullets("Eure Aufgabe: absichern und aufschreiben", [
    ("Geht euren gesamten Code durch und setzt die **Punkte 1 bis 3** der Checkliste um", 0),
    ("Testet die **SQL-Injection** an eurer eigenen Seite mit x' OR '1'='1 — vorher und nachher", 0),
    ("Testet **XSS** mit einem harmlosen script-Tag im Formular — vorher und nachher", 0),
    ("Schreibt den **Datenschutzhinweis** für eure Seite: welche Daten, wozu, wie lange", 0),
    ("Dokumentiert alle acht Punkte mit je einer Zeile **Begründung** — das wird bewertet", 0),
])

d.save()

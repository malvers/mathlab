#!/usr/bin/env python3
"""Umsetzung II: Implementierung und Test, Feedbackrunde (Woche 29)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG, php_parts, html_parts
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("umsetzung2-test.pptx")
P = lambda n: os.path.join(IMG, n)
php = lambda t, ls, **kw: d.code(t, [php_parts(l) for l in ls], **kw)
html = lambda t, ls, **kw: d.code(t, [html_parts(l) for l in ls], **kw)

d.title("Informatik — FOS 12", "Umsetzung II und Test",
        "Fertigstellen, systematisch prüfen und sich Rückmeldung holen")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Restarbeiten", "Was jetzt noch dazukommt")

d.table_top("Die typische Restliste", [
    ["Aufgabe", "warum sie oft übrig bleibt", "Aufwand"],
    ["restliche Seiten anbinden", "die erste war spannend, der Rest ist Fleiß", "je 20 Min."],
    ["Formular prüfen", "„geht ja auch so“ — bis jemand Unsinn eingibt", "30 Min."],
    ["Fehlermeldungen", "man sieht sie beim eigenen Testen nie", "20 Min."],
    ["leere Ergebnisliste", "kein Datensatz gefunden → leere Seite", "10 Min."],
    ["Rechtschreibung", "wird immer unterschätzt und immer bemerkt", "20 Min."],
    ["Bilder und Lizenzen", "Quelle nicht notiert, Bild zu groß", "30 Min."],
], [220, 380, 116], [
    ("Schreibt die Restliste **auf** und verteilt sie — sonst macht sie am Ende einer allein", 0),
    ("Alles, was nach dieser Woche noch offen ist, wird in Woche 31 knapp", 0),
], font_size=11, bold_cols=(0,), align="llc")

php("Zwei kleine Dinge, die sofort professionell wirken", [
    "<?php",
    "// 1) Leere Ergebnisliste abfangen",
    "$zeilen = $stmt->fetchAll();",
    "if (count($zeilen) === 0) {",
    "    echo '<p>Noch keine Eintraege vorhanden.</p>';",
    "} else {",
    "    foreach ($zeilen as $z) { /* Tabelle ausgeben */ }",
    "}",
    "",
    "// 2) Eingaben auf dem Server pruefen - nicht nur im Browser",
    "$kcal = (int)($_POST['kcal'] ?? -1);",
    "if ($kcal < 0 || $kcal > 900) {",
    "    echo '<p class=\"fehler\">Bitte einen Wert zwischen 0 und 900 angeben.</p>';",
    "} else {",
    "    // erst jetzt speichern",
    "}",
    "?>",
], size=10.5)

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Systematisch testen", "Nicht klicken, bis es zufällig klappt")

d.table_top("Sechs Testarten — jede findet andere Fehler", [
    ["Testart", "Frage", "Beispiel in eurem Projekt"],
    ["Funktionstest", "Tut jede Funktion, was sie soll?", "Formular speichert, Liste zeigt es"],
    ["Grenzwerttest", "Was passiert an den Rändern?", "0 kcal, 900 kcal, 901 kcal"],
    ["Fehleingabetest", "Was bei Unsinn?", "Text im Zahlenfeld, leeres Feld"],
    ["Navigationstest", "Führt jeder Link irgendwohin?", "alle Menüpunkte anklicken"],
    ["Darstellungstest", "Sieht es überall gut aus?", "zwei Browser, Handybreite"],
    ["Datentest", "Bleiben die Daten korrekt?", "Datensatz anlegen, neu laden, prüfen"],
], [180, 290, 346], [
    ("Der **Grenzwerttest** findet die meisten Fehler — genau wie in der Klausur zu LB 2", 0),
    ("Testet **fremde** Bereiche: wer den Code geschrieben hat, sieht seine Lücken nicht", 0),
], font_size=10.5, bold_cols=(0,))

d.table_top("Das Testprotokoll — so wird es geführt", [
    ["Nr", "Testfall", "erwartet", "beobachtet", "Status"],
    ["1", "Lebensmittel „Apfel“, 52 kcal speichern", "erscheint in der Liste", "erscheint", "ok"],
    ["2", "kcal = 901 speichern", "Meldung, kein Eintrag", "wird gespeichert", "Fehler"],
    ["3", "Feld Name leer lassen", "Meldung, kein Eintrag", "Meldung", "ok"],
    ["4", "Liste bei leerer Tabelle", "Hinweistext", "leere Seite", "Fehler"],
    ["5", "Menü auf 360 px Breite", "Links untereinander", "Links untereinander", "ok"],
], [50, 290, 200, 180, 96], [
    ("Fünf Spalten genügen — aber sie werden **beim Testen** ausgefüllt, nicht danach aus dem Kopf", 0),
    ("Zu jedem **Fehler** gehört ein Eintrag in der Aufgabenliste mit Name und Termin", 0),
    ("Nach der Korrektur wird der Testfall **erneut** ausgeführt und der Status geändert", 0),
], font_size=10.5, bold_cols=(0,),
   marks={(1, 4): TINT_GREEN, (3, 4): TINT_GREEN, (5, 4): TINT_GREEN,
          (2, 4): TINT_RED, (4, 4): TINT_RED})

d.bullets("Wie ihr auf gute Testfälle kommt", [
    ("Geht den **Anbindungsplan** durch: jede Seite, jede Funktion mindestens ein Testfall", 0),
    ("Zu jedem Eingabefeld: **gültig**, **Grenze**, **ungültig**, **leer**", 0),
    ("Denkt an den **ersten Besuch**: leere Datenbank, noch keine Daten", 0),
    ("Denkt an den **bösen Fall**: jemand tippt Anführungszeichen, spitze Klammern, 300 Zeichen", 0),
    ("Und an den **doppelten Klick**: wird der Datensatz zweimal gespeichert?", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Fehler beheben", "Erst verstehen, dann ändern")

d.table_top("Vorgehen bei einem gemeldeten Fehler", [
    ["Schritt", "was ihr tut"],
    ["1 Nachstellen", "den Fehler selbst auslösen — sonst ist er nicht bewiesen"],
    ["2 Eingrenzen", "welche Datei, welche Zeile? Zwischenausgaben oder Entwicklertools"],
    ["3 Ursache benennen", "in einem Satz aufschreiben, **warum** es schiefgeht"],
    ["4 Ändern", "eine Sache auf einmal ändern, nicht drei"],
    ["5 Nachtesten", "denselben Testfall wiederholen — und die Nachbarfälle gleich mit"],
    ["6 Notieren", "Testprotokoll aktualisieren, Tagebucheintrag schreiben"],
], [180, 636], [
    ("Schritt 3 ist der, der am häufigsten übersprungen wird — und ohne ihn wird nur geraten", 0),
    ("Wenn nach der Änderung etwas **anderes** kaputt ist: eine Änderung zu viel auf einmal", 0),
], font_size=11, bold_cols=(0,))

d.bullets("Fehler, die in fast jedem Projekt auftauchen", [
    ("**Pfad stimmt lokal, aber nicht auf dem Server** — Groß-/Kleinschreibung beachten", 0),
    ("**Formular speichert doppelt** beim Neuladen — nach dem Speichern umleiten hilft", 0),
    ("**Umlaute** kaputt an genau einer Stelle — meist die Datenbankverbindung", 0),
    ("**Layout bricht** bei langen Wörtern oder großen Bildern — max-width nicht vergessen", 0),
    ("**Zahl als Text** verglichen — '10' < '9' ist wahr, wenn es Text ist", 0),
])

# ---------------------------------------------------------------- Kapitel 04
d.chapter(4, "Feedbackrunde", "Fremde Augen sehen mehr")

d.table_top("Ablauf der Runde (45 Minuten)", [
    ["Zeit", "was passiert"],
    ["5 Min.", "Team A zeigt kurz: Thema, was läuft, wo es hakt"],
    ["10 Min.", "Team B benutzt die Seite selbst — ohne Erklärung, nur beobachtet"],
    ["10 Min.", "Team B nennt: drei Dinge, die gut sind, drei, die stören, eine Frage"],
    ["5 Min.", "Team A notiert alles — ohne zu widersprechen"],
    ["15 Min.", "Rollen tauschen"],
], [110, 706], [
    ("Die zehn Minuten **stilles Benutzen** sind das Wertvollste: dabei zeigt sich, was unklar ist", 0),
    ("Team A darf in dieser Zeit **nicht helfen** — genau das kann später auch niemand", 0),
], font_size=11, bold_cols=(0,))

d.bullets("Feedbackregeln", [
    ("**Beschreiben statt bewerten**: „Ich habe den Speichern-Knopf nicht gefunden“ statt „unübersichtlich“", 0),
    ("**Konkret**: Seite, Klick, Erwartung, Beobachtung", 0),
    ("**Zuerst das Gute** — und zwar ernst gemeint, nicht als Pflichtübung", 0),
    ("Als Empfänger: **nur zuhören und mitschreiben**, nicht erklären, nicht rechtfertigen", 0),
    ("Danach im Team entscheiden, **was** ihr übernehmt — und das im Tagebuch begründen", 0),
])

d.merksatz("Ein Fehler, den ihr selbst findet, kostet Minuten. "
           "Einer, den die Präsentation findet, kostet Punkte.")

d.bullets("Fun Facts: Testen", [
    ("Der erste dokumentierte **Bug** war 1947 eine echte Motte im Relais des Harvard Mark II — eingeklebt ins Logbuch", 0),
    ("**Testen kann die Anwesenheit von Fehlern zeigen, nie ihre Abwesenheit** — Dijkstra, 1969", 0),
    ("Der **Knight-Capital**-Fehler 2012 kostete 440 Mio. $ in 45 Minuten — alter Code, der nie getestet wurde", 0),
    ("Beim **Hallway Testing** fragt man einfach jemanden vom Flur — fünf Personen finden 80 % der Bedienprobleme", 0),
])

d.bullets("Eure Aufgabe bis nächste Woche", [
    ("**Alle** Funktionen aus dem Anbindungsplan laufen — oder sind begründet gestrichen", 0),
    ("Ein **ausgefülltes Testprotokoll** mit mindestens zwölf Testfällen", 0),
    ("Alle beim Test gefundenen Fehler sind **behoben oder in der Aufgabenliste** mit Termin", 0),
    ("Das **Feedback** des Partnerteams ist notiert, mit eurer Entscheidung dazu", 0),
    ("Nächste Woche: **Datensicherheit und Datenschutz** — schaut euch schon einmal eure Formulare an", 0),
])

d.save()

#!/usr/bin/env python3
"""Informatik 13 (BGY), Woche 21 / KW 3: Datensicherheit und Datenschutz im
Webprojekt (LB 4, Ustd. 13-14/18)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG, php_parts
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("websicherheit-datenschutz.pptx")
php = lambda t, ls, **kw: d.code(t, [php_parts(l) for l in ls], **kw)

d.title("Informatik — Grundkurs 13", "Sicher und sparsam",
        "Passwörter, Eingabevalidierung, HTTPS — und welche Daten die Seite wirklich braucht")

d.chapter(1, "Passwörter", "Niemals im Klartext")

d.table_top("Wie ein Passwort gespeichert wird", [
    ["Verfahren", "Bewertung", "warum"],
    ["Klartext", "grob fahrlässig", "ein Datenleck gibt alles preis"],
    ["verschlüsselt", "falsch", "wer den Schlüssel hat, liest alles"],
    ["gehasht (MD5, SHA1)", "veraltet", "zu schnell, per Wörterbuch knackbar"],
    ["gehasht mit Salt und langsamem Verfahren", "richtig", "bcrypt, Argon2"],
], [280, 200, 336], [
    ("Ein **Hash** ist eine Einbahnstraße: aus dem Passwort wird ein Wert, zurück geht es nicht", 0),
    ("Das **Salt** ist ein Zufallswert je Nutzer — es verhindert vorberechnete Tabellen", 0),
], font_size=10.5, bold_cols=(0,),
   marks={(1, 1): TINT_RED, (2, 1): TINT_RED, (3, 1): TINT_ORANGE, (4, 1): TINT_GREEN})

php("Passwörter richtig behandeln", [
    "<?php",
    "// beim Registrieren",
    "$hash = password_hash($passwort, PASSWORD_DEFAULT);",
    "$stmt = $pdo->prepare('INSERT INTO Nutzer (name, pwhash) VALUES (?, ?)');",
    "$stmt->execute([$name, $hash]);",
    "",
    "// beim Anmelden",
    "$stmt = $pdo->prepare('SELECT pwhash FROM Nutzer WHERE name = ?');",
    "$stmt->execute([$name]);",
    "$zeile = $stmt->fetch();",
    "",
    "if ($zeile && password_verify($passwort, $zeile['pwhash'])) {",
    "    // angemeldet",
    "}",
], size=11)

d.chapter(2, "Eingaben prüfen", "Auf dem Server, immer")

d.table_top("Die drei Schritte bei jeder Eingabe", [
    ["Schritt", "heißt", "Beispiel"],
    ["1. Prüfen", "ist der Wert überhaupt zulässig?", "Länge, Format, Wertebereich"],
    ["2. Normalisieren", "in eine einheitliche Form bringen", "trim, Kleinschreibung"],
    ["3. Sicher verwenden", "prepare beim Speichern, maskieren beim Ausgeben", "PDO, htmlspecialchars"],
], [150, 330, 336], [
    ("Prüfungen im Browser sind **Komfort** — wer den Browser umgeht, umgeht sie", 0),
    ("Verbindlich ist immer die Prüfung **auf dem Server**", 0),
], font_size=10.5, bold_cols=(0,), marks={(3, 0): TINT_GREEN})

d.bullets("Was geprüft wird", [
    ("**Pflichtfelder**: ist überhaupt etwas angekommen?", 0),
    ("**Länge**: eine Ortsangabe mit 5000 Zeichen ist keine", 0),
    ("**Format**: Datum, E-Mail, Postleitzahl — mit passendem Prüfmuster", 0),
    ("**Wertebereich**: eine Jahreszahl 1200 oder 3000 ergibt keinen Sinn", 0),
    ("**Zugehörigkeit**: darf dieser Nutzer diesen Datensatz überhaupt ändern?", 0),
])

d.chapter(3, "HTTPS und Datensparsamkeit", "Übertragung und Erhebung")

d.table_top("Was HTTPS leistet — und was nicht", [
    ["leistet", "leistet nicht"],
    ["verschlüsselt die Übertragung", "schützt nicht vor SQL-Injection"],
    ["prüft die Identität des Servers", "sagt nichts über die Seriosität"],
    ["verhindert Mitlesen im WLAN", "schützt die Daten nicht auf dem Server"],
], [400, 416], [
    ("Das Schloss im Browser bedeutet: **die Leitung ist dicht**, nicht: **die Seite ist gut**", 0),
    ("Ohne HTTPS gehen Passwörter im offenen WLAN im Klartext über die Leitung", 0),
], font_size=11, bold_cols=(0,), marks={(r, 1): TINT_ORANGE for r in range(1, 4)})

d.bullets("Welche Daten braucht eure Seite wirklich?", [
    ("Zu jedem Feld die Frage: **wofür** wird es gebraucht? Keine Antwort heißt: weglassen", 0),
    ("**Keine** Klarnamen, wo eine Nummer genügt", 0),
    ("**Keine** Geburtsdaten, wenn nur das Alter zählt — und oft zählt nicht mal das", 0),
    ("**Löschfrist** je Datenart festlegen und aufschreiben", 0),
    ("Und eine **Datenschutzerklärung**, die in verständlichen Sätzen sagt, was passiert", 0),
])

d.merksatz("Das Schloss im Browser sagt nur: die Leitung ist dicht. "
           "Was auf dem Server passiert, sagt es nicht.")

d.bullets("Fun Facts: Websicherheit", [
    ("**password_hash** in PHP wählt automatisch ein sicheres Verfahren und erzeugt das Salt selbst", 0),
    ("**Rainbow Tables** sind vorberechnete Hashtabellen — genau dagegen hilft das Salt", 0),
    ("**Let's Encrypt** stellt seit 2016 kostenlose Zertifikate aus — seither ist HTTPS Standard", 0),
    ("Die **OWASP Top Ten** listen die häufigsten Webrisiken — sie sind seit Jahren ähnlich", 0),
    ("Der häufigste Fund bei Schulprojekten: **Zugangsdaten im Quelltext**", 0),
])

d.bullets("Eure Aufgabe am Rechner", [
    ("Falls ihr eine **Anmeldung** habt: password_hash und password_verify einbauen", 0),
    ("**Jede** Eingabe auf dem Server prüfen — Pflicht, Länge, Format, Bereich", 0),
    ("Prüft, ob **Zugangsdaten** irgendwo im Webordner oder Repository liegen", 0),
    ("Geht euer **Datenmodell** durch: welches Feld könnt ihr streichen?", 0),
    ("Schreibt eine kurze **Datenschutzerklärung** in verständlichen Sätzen", 0),
])

d.save()

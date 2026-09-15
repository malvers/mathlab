#!/usr/bin/env python3
"""Informatik 11 (BGY), Woche 19 / KW 1 (live plan): Puffer / Uebung - Bedrohungen und
Schutzziele an Faellen aus dem Alltag (LB 3).

A short practice deck. Facts line up with the worksheet HTML/inf11test-uebung1.html
(20 Aufgaben, case based). Chapter pictures come from Wikimedia Commons, each with its licence
line on the slide.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("inf11-uebung1.pptx")

d.title("Informatik — Grundkurs 11", "Übung: Bedrohungen und Schutzziele",
        "Fälle aus dem Alltag durchdenken — und ein Sicherheits-Quiz in Teams")

d.bullets("Wo wir stehen", [
    ("Vor den Ferien: Angriffe, Versagen, Social Engineering — und die Schutzziele", 0),
    ("Heute keine neuen Begriffe: Wir **wenden an**, was wir haben", 0),
    ("Zwanzig Fälle aus dem Alltag — jeder verlangt eine Entscheidung", 0),
    ("Leitfrage: Was tue ich **als Erstes**, wenn es ernst wird?", 0),
])

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Fälle aus dem Alltag", "Mail, Stick, Chat, Passwort",
          image="img/uebung1-usb-stick.jpg",
          credit="USB-Stick — Foto: EU+Mexico, CC0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:USB_flash_drive,_1TB.jpg")

d.table_top("Der richtige erste Schritt", [
    ["Situation", "richtige Reaktion"],
    ["Mail mit Zeitdruck und Anmelde-Link", "Seite über die selbst eingegebene Adresse öffnen"],
    ["USB-Stick auf dem Parkplatz gefunden", "nicht anstecken, an die zuständige Stelle geben"],
    ["Kollege bittet per Chat um die Kundenliste", "Identität über einen bekannten Kanal prüfen"],
    ["Dienst meldet Abfluss von Hashwerten", "Passwort überall ändern, wo es verwendet wurde"],
    ["Verdacht auf einen Vorfall", "Ruhe bewahren, nichts löschen, Stelle informieren"],
], [356, 460], [
    ("Allen gemeinsam: **erst prüfen, dann handeln** — und nie allein im Verborgenen", 0),
], font_size=11, bold_cols=(0,))

d.bullets("Passwörter im Alltag", [
    ("Gegen Brute Force auf ein Anmeldeformular: **Sperre oder Verzögerung** nach Fehlversuchen", 0),
    ("Ein **Passwortmanager** macht für jeden Dienst ein langes, eigenes Passwort möglich", 0),
    ("Das Hauptproblem ist die **Wiederverwendung** — ein Leck öffnet dann viele Türen", 0),
    ("Schwache Passwörter lassen sich aus dem Hashwert **durch Ausprobieren** ermitteln", 0),
    ("Gute Manager füllen nur auf der **echten Domain** aus — ein Schutz gegen Phishing", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Technik einordnen", "Keine Maßnahme reicht allein",
          image="img/uebung1-burg.png",
          credit="Burg Beaumaris mit zwei Mauerringen — Foto: Llywelyn2000, CC BY-SA 4.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Castell_Beaumaris_Castle,_Ynys_Mon_(Anglesey),_Wales_45.png")

d.bullets("Defense in Depth", [
    ("„Wir haben eine Firewall, also sind wir sicher“ — falsch: Gegen Phishing und Innentäter hilft sie nicht", 0),
    ("**Defense in Depth**: mehrere unabhängige Schutzschichten hintereinander", 0),
    ("Beispiel: Netztrennung, Rechte, Verschlüsselung, Protokoll", 0),
    ("Fällt eine Schicht aus, greift die nächste — keine muss perfekt sein", 0),
    ("Wie bei der Burg: Hinter der äußeren Mauer wartet die innere", 0),
])

d.table_top("Was schützt wogegen?", [
    ["Maßnahme", "schützt", "schützt nicht"],
    ["Firewall", "gegen unerwünschten Netzverkehr", "gegen Phishing, Innentäter"],
    ["Festplattenverschlüsselung", "das ausgeschaltete Gerät", "das entsperrte, laufende Gerät"],
    ["Signatur am Zeugnis", "Authentizität, Integrität", "Vertraulichkeit"],
    ["dauerhaft verbundene Sicherung", "gegen Hardwaredefekte", "gegen Ransomware"],
], [270, 290, 256], [
    ("Verschlüsselung ist **umkehrbar**, Hashing praktisch nicht", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 2): TINT_RED, (2, 2): TINT_RED, (3, 2): TINT_RED, (4, 2): TINT_RED})

d.bullets("Vergessene Geräte", [
    ("Veraltete **Router und Kameras** hängen dauerhaft am Netz und bekommen oft keine Updates mehr", 0),
    ("Sie werden gern zu Knoten eines **Botnetzes** — der Besitzer merkt davon nichts", 0),
    ("Ohne Update-Versorgung gehören sie ausgetauscht", 0),
    ("Alte **Datenträger**: Löschen und Schnellformat reichen nicht — zerstören oder sicher überschreiben", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Wenn es passiert ist", "Melden, protokollieren, regeln",
          image="img/uebung1-feueralarm.jpg",
          credit="Feuermelder mit Aushang — Foto: Eric Fischer, CC BY 2.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Fire_alarm,_fire_action,_fire_alarm_call_point_(42030938081).jpg")

d.bullets("Reagieren und melden", [
    ("Bei Verdacht: **Ruhe bewahren, nichts löschen**, die zuständige Stelle informieren", 0),
    ("Vorschnelles Löschen oder Neuaufsetzen **vernichtet Spuren**", 0),
    ("In die Meldung gehört: **was** betroffen ist, **seit wann**, welche Daten abgeflossen sein könnten", 0),
    ("**Protokolle** machen nachvollziehbar, was wann geschah — sie sind selbst schützenswert", 0),
])

d.bullets("Regeln, die tragen", [
    ("Eine **Sicherheitsrichtlinie** legt verbindlich Regeln und Zuständigkeiten fest", 0),
    ("Sie muss bekannt gemacht und geschult werden — sonst bleibt sie Papier", 0),
    ("Gegen Social Engineering: **Schulung** und klare Regeln, wer was am Telefon herausgibt", 0),
    ("Sicherheit ist immer eine **Abwägung**: Unbenutzbare Systeme werden umgangen", 0),
])

d.merksatz("Keine einzelne Maßnahme macht sicher: mehrere Schichten, geprüfte Sicherungen, "
           "klare Regeln — und im Ernstfall Ruhe bewahren, nichts löschen, melden.")

d.bullets("Fun Facts", [
    ("2016 verteilten Forscher der University of Illinois knapp **300 USB-Sticks** auf dem Campus", 0),
    ("Bei fast der Hälfte wurden Dateien auf dem Stick geöffnet", 0),
    ("Das Hasso-Plattner-Institut kürt jedes Jahr die beliebtesten Passwörter — vorn steht regelmäßig **123456**", 0),
    ("Der Wurm **Stuxnet** gelangte vermutlich per USB-Stick in eine vom Internet getrennte Anlage", 0),
])

d.bullets("Eure Aufgabe", [
    ("**Restarbeiten** zuerst: Was aus Lernbereich 3 noch offen ist, jetzt fertigstellen", 0),
    ("**Sicherheits-Quiz** in Teams: Fallkarte ziehen, erste Reaktion nennen, begründen", 0),
    ("Wer fertig ist, schreibt eine eigene Fallkarte — mit der richtigen Reaktion auf der Rückseite", 0),
    ("Fragen zu einzelnen Themen? Jetzt ist Zeit für **Einzelhilfe**", 0),
    ("Zum Schluss: **Aufgaben (20)** auf der Planseite — Lösung pro Aufgabe zum Aufklappen", 0),
])

d.save()

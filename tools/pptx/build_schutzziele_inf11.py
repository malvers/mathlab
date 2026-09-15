#!/usr/bin/env python3
"""Informatik 11 (BGY), Woche 17 / KW 52 (live plan): Schutz vor Datenmissbrauch - Integritaet,
Authentizitaet, Vertraulichkeit, Verfuegbarkeit (LB 3, Ustd. 5-6/16).

Facts line up with the worksheet HTML/inf11test-schutzziele.html (20 Aufgaben: die Schutzziele,
Hashwerte, Signaturen, Verschluesselung). The SHA-256 prefixes on the hash slide were computed with
Python's hashlib. Chapter pictures come from Wikimedia Commons, each with its licence line on the slide.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("inf11-schutzziele.pptx")

d.title("Informatik — Grundkurs 11", "Die Schutzziele",
        "Vertraulichkeit, Integrität, Verfügbarkeit — und womit man sie erreicht")

d.bullets("Wo wir stehen", [
    ("Bisher: **Bedrohungen** — Angriffe, Versagen, Katastrophen, Täuschung", 0),
    ("Heute die Gegenseite: **Was genau** wollen wir eigentlich schützen?", 0),
    ("Die Antwort sind die **Schutzziele** — jede Maßnahme dient mindestens einem", 0),
    ("Leitfrage: Welches Schutzziel verletzt ein Vorfall — und was hätte es geschützt?", 0),
])

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Die Schutzziele", "Was genau geschützt wird",
          image="img/schutzziele-siegel.jpg",
          credit="Brief mit Wachssiegel — Foto: Contrafool, CC BY-SA 3.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Wax_seal_with_impression_of_uppercase_letter_A.jpg")

d.table_top("Drei Kernziele und zwei Ergänzungen", [
    ["Schutzziel", "bedeutet", "erreicht durch"],
    ["Vertraulichkeit", "nur Berechtigte können lesen", "Verschlüsselung, Zugriffsrechte"],
    ["Integrität", "unverändert, Änderungen wären erkennbar", "Prüfsummen, Signaturen"],
    ["Verfügbarkeit", "jederzeit abrufbar", "Redundanz, Lastverteilung"],
    ["Authentizität", "die Herkunft ist nachgewiesen", "Signaturen, Zertifikate"],
    ["Verbindlichkeit", "eine Handlung ist nicht abstreitbar", "Signaturen, Protokolle"],
], [180, 350, 286], [
    ("Die ersten drei heißen auch **CIA-Triade**: Confidentiality, Integrity, Availability", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 0): TINT_BLUE, (2, 0): TINT_GREEN, (3, 0): TINT_ORANGE, (4, 0): TINT_RED})

d.bullets("Integrität genau gelesen", [
    ("Integrität **verhindert** Änderungen nicht — sie **deckt sie auf**", 0),
    ("Wie das Siegel am Brief: Wer ihn öffnet, bricht es — und der Empfänger sieht es", 0),
    ("Das Siegelbild zeigt zugleich, **von wem** der Brief kommt: Authentizität", 0),
    ("Ohne Authentizität nützt auch Verschlüsselung wenig: Mit wem rede ich überhaupt?", 0),
])

d.table_top("Welches Ziel ist verletzt?", [
    ["Vorfall", "verletztes Schutzziel"],
    ["Ein DDoS-Angriff legt den Schulserver lahm", "Verfügbarkeit"],
    ["Ein Kontostand wird unbemerkt geändert", "Integrität"],
    ["Eine Kundendatei liegt offen im Netz", "Vertraulichkeit"],
    ["Eine Mail trägt den gefälschten Absender der Schulleitung", "Authentizität"],
    ["Ein Käufer bestreitet, bestellt zu haben", "Verbindlichkeit"],
], [540, 276], [
    ("Trick: Fragen, was mit den Daten **passiert** ist — gelesen, verändert, unerreichbar, gefälscht?", 0),
], font_size=11, bold_cols=(1,),
   marks={(1, 1): TINT_ORANGE, (2, 1): TINT_GREEN, (3, 1): TINT_BLUE, (4, 1): TINT_RED})

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Hashwerte", "Fingerabdrücke für Daten",
          image="img/schutzziele-hashfunktion.png",
          credit="Kryptografische Hashfunktion — Jorge Stolfi, gemeinfrei, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Cryptographic_Hash_Function.svg")

d.bullets("Prüfsumme und Hashfunktion", [
    ("Eine **Prüfsumme** macht erkennbar, ob sich eine Datei verändert hat", 0),
    ("Eine kryptografische **Hashfunktion** bildet aus beliebigen Daten einen festen, kurzen Wert", 0),
    ("Sie ist praktisch **nicht umkehrbar**: Das Original lässt sich nicht zurückrechnen", 0),
    ("Zwei verschiedene Eingaben sollen praktisch nie denselben Wert ergeben", 0),
    ("Verschlüsselung dagegen ist **umkehrbar** — dafür ist sie da", 0),
])

d.table_top("Ein Zeichen Unterschied", [
    ["Eingabe", "SHA-256, die ersten 16 von 64 Hexziffern"],
    ["Hallo", "753692ec36adb4c7"],
    ["hallo", "d3751d33f9cd5049"],
    ["Hallo!", "357a57fe73d6c63b"],
], [220, 596], [
    ("Ändert sich ein einziges Zeichen, ändert sich der Wert **vollständig**", 0),
    ("SHA-256 liefert immer 256 Bit — egal, ob die Eingabe ein Wort ist oder ein ganzer Film", 0),
    ("Geheim wird eine Datei durch ihren Hashwert **nicht**", 0),
], font_size=12, bold_cols=(0,), mono_cols=(1,))

d.bullets("Passwörter richtig speichern", [
    ("Ein Dienst speichert Passwörter als **Hashwert**, nicht im Klartext", 0),
    ("Beim Anmelden wird der Hash der Eingabe mit dem gespeicherten verglichen", 0),
    ("Wird die Datenbank gestohlen, liegen die Passwörter **nicht sofort** offen", 0),
    ("**Salt**: ein zufälliger Zusatz je Passwort — gleiche Passwörter ergeben verschiedene Hashwerte", 0),
    ("Vorberechnete Tabellen werden damit wertlos — der Salt darf offen gespeichert sein", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Schlüssel und Signaturen", "Symmetrisch, asymmetrisch, Ende zu Ende",
          image="img/schutzziele-enigma.jpg",
          credit="Chiffriermaschine Enigma — Foto: Rama, CC BY-SA 2.0 fr, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Enigma-IMG_0487-black.jpg")

d.two_cols("Symmetrisch oder asymmetrisch", [
    ("**Symmetrisch**", 0),
    ("ein gemeinsamer Schlüssel für beide Seiten", 1),
    ("schnell", 1),
    ("Problem: Der Schlüssel muss sicher ausgetauscht werden", 1),
    ("historisches Beispiel: die Enigma", 1),
], [
    ("**Asymmetrisch**", 0),
    ("ein Schlüsselpaar: öffentlich und privat", 1),
    ("der öffentliche verschlüsselt, der private entschlüsselt", 1),
    ("kein geheimer Austausch nötig", 1),
    ("in der Praxis werden beide kombiniert", 1),
])

d.bullets("Eine Nachricht an Anna", [
    ("Anna veröffentlicht ihren **öffentlichen Schlüssel** — den darf jeder kennen", 0),
    ("Wer ihr schreibt, verschlüsselt mit **Annas öffentlichem Schlüssel**", 0),
    ("Entschlüsseln kann nur, wer den passenden **privaten** Schlüssel hat — also nur Anna", 0),
    ("**Ende-zu-Ende**: Nur Absender und Empfänger können lesen, der Anbieter nicht", 0),
    ("Reine Transportverschlüsselung schützt nur den Weg, nicht vor dem Anbieter", 0),
])

d.bullets("Die digitale Signatur", [
    ("Der Absender **signiert** mit seinem **privaten** Schlüssel", 0),
    ("Prüfen kann jeder — mit dem **öffentlichen** Schlüssel des Absenders", 0),
    ("Nachgewiesen sind **Urheber und Unverändertheit**: Authentizität und Integrität", 0),
    ("Geheim ist die Nachricht dadurch **nicht** — dafür braucht es zusätzlich Verschlüsselung", 0),
    ("Signaturen schaffen auch **Verbindlichkeit**: Wer signiert hat, kann es nicht abstreiten", 0),
])

# ---------------------------------------------------------------- Kapitel 04
d.chapter(4, "Rechte und Abwägung", "Wer darf was — und wie viel Schutz reicht?",
          image="img/schutzziele-schluesselschrank.jpg",
          credit="Schlüsselschrank — Foto: Thomas Quine, CC BY 2.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Key_cabinet_(25220848027).jpg")

d.table_top("Erst wer, dann was", [
    ["Begriff", "klärt", "Beispiel"],
    ["Authentisierung", "Wer bist du?", "Anmeldung mit Passwort und zweitem Faktor"],
    ["Autorisierung", "Was darfst du?", "Lehrkraft trägt Noten ein, Schüler lesen nur"],
], [200, 170, 446], [
    ("Die Reihenfolge ist immer gleich: erst die Identität, dann die Rechte", 0),
    ("**Prinzip der geringsten Rechte**: nur die Rechte, die für die Aufgabe nötig sind", 0),
    ("Ein übernommenes Konto richtet dann weniger Schaden an — und Rechte fallen mit der Aufgabe weg", 0),
], font_size=11, bold_cols=(0,))

d.bullets("Eigene und fremde Daten schützen", [
    ("**Festplattenverschlüsselung** schützt ein verlorenes oder gestohlenes Notebook — im **ausgeschalteten** Zustand", 0),
    ("Im laufenden Betrieb schützt sie nicht vor Schadsoftware — und sie ersetzt keine Sicherung", 0),
    ("**Fremde Daten**: Wer eine Klassenliste verwaltet, muss sie vertraulich halten", 0),
    ("**Recht am eigenen Bild**: Fotos anderer nur mit ihrer Einwilligung veröffentlichen", 0),
])

d.bullets("Sicherheit ist eine Abwägung", [
    ("Mehr Schutz bedeutet meist **mehr Aufwand** — und erschwert die Nutzung", 0),
    ("Strenge Rechte können die **Verfügbarkeit** verschlechtern", 0),
    ("Sehr hohe Verfügbarkeit kostet überproportional viel", 0),
    ("Deshalb gilt: Der Schutz muss zum **Schutzbedarf** passen", 0),
])

d.merksatz("Vertraulichkeit, Integrität, Verfügbarkeit — dazu Authentizität und Verbindlichkeit: "
           "Jeder Vorfall verletzt mindestens eines dieser Ziele, jede Maßnahme dient mindestens einem.")

d.bullets("Fun Facts", [
    ("Die **CIA-Triade** hat nichts mit dem Geheimdienst zu tun: Confidentiality, Integrity, Availability", 0),
    ("Polnische Mathematiker um **Marian Rejewski** knackten die Enigma schon 1932 — Jahre vor Bletchley Park", 0),
    ("Verschlüsselung mit öffentlichem Schlüssel stellten **Diffie und Hellman 1976** vor", 0),
    ("Der britische Geheimdienst kannte die Idee schon früher — und hielt sie bis 1997 geheim", 0),
])

d.bullets("Eure Aufgabe", [
    ("**Partnerarbeit**: Findet zu jedem Schutzziel ein Beispiel aus Schule oder Alltag", 0),
    ("**Zuordnungsübung**: Vorfallkarten dem verletzten Schutzziel zuordnen — mit Begründung", 0),
    ("Zu jedem Vorfall: eine Maßnahme, die ihn verhindert oder aufgedeckt hätte", 0),
    ("Knobelfrage: Welches Schutzziel leidet, wenn Rechte zu streng sind?", 0),
    ("Zum Schluss: **Aufgaben (20)** auf der Planseite — Lösung pro Aufgabe zum Aufklappen", 0),
])

d.save()

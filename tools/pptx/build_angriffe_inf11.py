#!/usr/bin/env python3
"""Informatik 11 (BGY), Woche 15 / KW 50 (live plan): Bedrohungsanalysen I - digitale Angriffe
(LB 3 "IT-Sicherheit und Oekologie", Ustd. 1-2/16).

Facts line up with the worksheet HTML/inf11test-angriffe.html (20 Aufgaben: Malware, Phishing,
DDoS, Passwoerter, Zwei-Faktor). The plan row's attacker motives (espionage, sabotage, cyber war,
data falsification, cyber mobbing) get one table. Recognise and protect only - no attack recipes.
Chapter pictures come from Wikimedia Commons, each with its licence line on the slide.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("inf11-angriffe.pptx")

d.title("Informatik — Grundkurs 11", "Digitale Angriffe",
        "Bedrohungsanalyse I: wer angreift, womit — und was die meisten Türen schließt")

d.bullets("Wo wir stehen", [
    ("Klassenarbeit 1 ist geschrieben — heute beginnt **Lernbereich 3**: IT-Sicherheit und Ökologie", 0),
    ("Die ersten Stunden: **Bedrohungsanalysen** — was kann schiefgehen, und warum?", 0),
    ("Heute die Angriffe mit Absicht, nächste Woche Versagen, Katastrophen und Täuschung", 0),
    ("Leitfrage: Wie kommen Angreifer an Daten — und was hält sie auf?", 0),
])

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Bedrohungen analysieren", "Schutzobjekt, Schwachstelle, Angriff",
          image="img/angriffe-bsi.jpg",
          credit="Sitz des BSI in Bonn — Foto: Wolkenkratzer, CC BY-SA 3.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Bonn,_Bundesamt_f%C3%BCr_Sicherheit_in_der_Informationstechnik.jpg")

d.bullets("Zuerst: Was ist schützenswert?", [
    ("Eine Bedrohungsanalyse beginnt mit dem **Schutzobjekt**: Was ist wertvoll?", 0),
    ("Dann: Welche Bedrohungen, welche Schäden — erst **zuletzt** die Maßnahmen", 0),
    ("**Schwachstelle**: die Möglichkeit — **Angriff**: ihre Ausnutzung", 0),
    ("Eine Schwachstelle kann jahrelang unbemerkt bestehen", 0),
    ("Werkzeuge wie Virenscanner kommen zuletzt, nicht zuerst", 0),
])

d.table_top("Wer greift an — und warum?", [
    ["Bedrohung", "Ziel", "Beispiel"],
    ["Wirtschaftsspionage", "Wissen stehlen", "Baupläne, Kundenlisten"],
    ["Sabotage", "Betrieb stören", "die Produktion steht still"],
    ["Cyber-Krieg", "einen Staat schwächen", "Angriff auf Strom- und Wassernetze"],
    ["Datenverfälschung", "Vertrauen zerstören", "geänderte Messwerte oder Kontostände"],
    ["Cyber-Mobbing", "Menschen verletzen", "Bloßstellen in Gruppenchats"],
], [210, 220, 386], [
    ("Der **BSI-Lagebericht** fasst jedes Jahr die Lage der IT-Sicherheit in Deutschland zusammen", 0),
], font_size=11, bold_cols=(0,))

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Schadsoftware", "Viren, Würmer, Trojaner, Ransomware",
          image="img/angriffe-morris-wurm.jpg",
          credit="Quelltext des Morris-Wurms von 1988 — Foto: Go Card USA, CC BY-SA 2.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Morris_Worm.jpg")

d.table_top("Malware — der Oberbegriff", [
    ["Art", "Kennzeichen"],
    ["Virus", "hängt sich an eine Wirtsdatei und braucht sie zur Verbreitung"],
    ["Wurm", "verbreitet sich selbstständig über Netze — deshalb oft schneller"],
    ["Trojaner", "täuscht eine nützliche Funktion vor, schadet im Hintergrund"],
    ["Ransomware", "verschlüsselt Daten und fordert Lösegeld"],
    ["Keylogger", "schneidet Tastatureingaben mit, als Programm oder Stecker"],
], [180, 636], [
    ("Gegen Ransomware hilft verlässlich nur eine **getrennte Sicherung** — Zahlen garantiert nichts", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 0): TINT_ORANGE, (2, 0): TINT_GREEN, (3, 0): TINT_BLUE, (4, 0): TINT_RED})

d.bullets("Gekaperte Geräte: Botnetze", [
    ("Ein **Botnetz** ist ein Verbund gekaperter Geräte, die ferngesteuert angreifen", 0),
    ("Die Besitzer merken davon meist nichts", 0),
    ("Gern genommen: **Router und Kameras** — dauerhaft am Netz, selten aktualisiert", 0),
    ("Botnetze verschicken Spam und betreiben **DDoS-Angriffe**", 0),
    ("Der Trojaner-Trick: Den Schädling installiert der Nutzer **selbst**", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Täuschen und überlasten", "Phishing, DDoS, Man in the Middle",
          image="img/angriffe-phishing.png",
          credit="Phishing-Mail einer erfundenen Bank — Andrew Levine, gemeinfrei, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:PhishingTrustedBank.png")

d.bullets("Phishing", [
    ("**Phishing**: mit gefälschten Nachrichten an Zugangsdaten kommen", 0),
    ("Die Mail sieht aus wie von Bank oder Schule — der Link führt auf eine **nachgebaute Seite**", 0),
    ("Erkennen: an der **echten Zieladresse** des Links und am **unerwarteten Zeitdruck**", 0),
    ("Absendernamen lassen sich fälschen — und gute Fälschungen haben keine Rechtschreibfehler", 0),
    ("**Spear-Phishing**: gezielt auf eine Person zugeschnitten, mit Name, Rolle und Umfeld", 0),
])

d.table_top("Angriffe auf Dienste und Verbindungen", [
    ["Angriff", "Was passiert", "Was schützt"],
    ["DDoS", "sehr viele Rechner überlasten einen Dienst", "Filter, Lastverteilung"],
    ["Man in the Middle", "jemand klinkt sich in eine Verbindung ein", "Verschlüsselung, Zertifikate"],
    ["SQL-Injection", "Datenbankbefehle über ein Eingabefeld", "Eingaben prüfen"],
], [200, 356, 260], [
    ("DDoS übernimmt den Dienst nicht — er macht ihn **unerreichbar**", 0),
    ("Ein **Zertifikat** bestätigt: Der Server gehört zur Adresse im Browser — über den Inhalt sagt es nichts", 0),
], font_size=11, bold_cols=(0,))

# ---------------------------------------------------------------- Kapitel 04
d.chapter(4, "Schützen", "Passwörter, zweiter Faktor, Updates",
          image="img/angriffe-schloss.jpg",
          credit="Vorhängeschloss mit Schlüsseln — Foto: Trougnouf, CC BY 4.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Solex_99_30_padlock_with_keys_(DSCF2659).jpg")

d.bullets("Brute Force und die Länge des Passworts", [
    ("**Brute Force**: Passwörter systematisch durchprobieren — Rechenleistung statt Idee", 0),
    ("Jede zusätzliche Stelle **vervielfacht** die Zahl der Möglichkeiten", 0),
    ("8 Zeichen aus 62 (Buchstaben, Ziffern): $62^{8} \\approx 2{,}2 \\cdot 10^{14}$", 0),
    ("12 kleine Buchstaben: $26^{12} \\approx 9{,}5 \\cdot 10^{16}$ — über **400-mal** so viele", 0),
    ("Deshalb: lange Passphrasen — und eine **Sperre** nach wenigen Fehlversuchen", 0),
])

d.bullets("Zwei-Faktor-Authentisierung", [
    ("Zum **Wissen** (Passwort) kommt ein zweiter, unabhängiger Nachweis", 0),
    ("Faktoren: **Wissen, Besitz, Eigenschaft** — etwa Passwort, Smartphone, Fingerabdruck", 0),
    ("Ein gestohlenes Passwort allein nützt dem Angreifer dann nichts", 0),
    ("Auch ein mitgeschnittenes Passwort vom Keylogger reicht nicht mehr", 0),
    ("Wichtig: Der zweite Faktor muss wirklich **unabhängig** sein", 0),
])

d.bullets("Updates und Zero-Days", [
    ("Die meisten Angriffe nutzen **längst bekannte**, schon geschlossene Lücken", 0),
    ("Angreifer suchen automatisiert nach veralteten Versionen — ein Update schließt genau diese Tür", 0),
    ("**Zero-Day**: eine Lücke, für die es noch keine Korrektur gibt", 0),
    ("Der Hersteller hatte null Tage Zeit — hier helfen nur allgemeine Schutzmaßnahmen", 0),
    ("Zero-Days sind selten, veraltete Software ist häufig", 0),
])

d.merksatz("Jeder Angriff braucht eine Schwachstelle — wer weiß, was schützenswert ist, Updates "
           "einspielt, lange Passwörter und einen zweiten Faktor nutzt, schließt die meisten Türen.")

d.bullets("Fun Facts", [
    ("Das erste bekannte selbstkopierende Programm, **Creeper**, wanderte 1971 durchs ARPANET", 0),
    ("Der **Morris-Wurm** legte 1988 einen großen Teil des damaligen Internets lahm", 0),
    ("2016 legte das **Mirai-Botnetz** aus gekaperten Kameras und Routern große Websites zeitweise lahm", 0),
    ("**Phishing** ist an „fishing“ angelehnt: Man angelt nach Zugangsdaten", 0),
])

d.bullets("Eure Aufgabe", [
    ("**Gruppenrecherche** im PC-Kabinett: ein aktueller Angriff aus Nachrichten oder BSI-Lagebericht", 0),
    ("Analysiert den Fall: Schutzobjekt, Schwachstelle, Angriff, Schaden", 0),
    ("Ordnet ein: Spionage, Sabotage, Cyber-Krieg, Datenverfälschung oder Cyber-Mobbing?", 0),
    ("**Kurzvortrag** (3 Minuten): der Fall — und was ihn verhindert hätte", 0),
    ("Zum Schluss: **Aufgaben (20)** auf der Planseite — Lösung pro Aufgabe zum Aufklappen", 0),
])

d.save()

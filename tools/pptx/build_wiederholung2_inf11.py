#!/usr/bin/env python3
"""Informatik 11 (BGY), Wiederholung vor Klassenarbeit 2 (LB 3 "IT-Sicherheit und Oekologie"):
short review deck - one overview table per topic, typical tasks, tips, stations.

Facts line up with the worksheet HTML/inf11test-wiederholung2.html (20 Aufgaben) and the LB 3
decks before it. Chapter pictures come from Wikimedia Commons, each with its licence line.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("inf11-wiederholung2.pptx")

d.title("Informatik — Grundkurs 11", "Wiederholung: IT-Sicherheit",
        "Lernbereich 3 im Überblick — fit für die Klassenarbeit 2")

d.bullets("Was drankommt", [
    ("**Klassenarbeit 2** (45 Minuten): Lernbereich 3 — IT-Sicherheit und Ökologie", 0),
    ("Bedrohungen, Schutzziele, Maßnahmen zur Datensicherheit, Kryptologie, Datenschutzrecht", 0),
    ("Heute: erst der Überblick, dann Wiederholung an Stationen", 0),
    ("Leitfrage: Was muss ich sicher können — und wo habe ich noch Lücken?", 0),
])

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Bedrohungen", "Angriffe und Schutzziele",
          image="img/wiederholung2-morris-wurm.jpg",
          credit="Diskette mit dem Quelltext des Morris-Wurms — Foto: Go Card USA, CC BY-SA 2.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Morris_Worm.jpg")

d.table_top("Die Schutzziele", [
    ["Schutzziel", "heißt", "verletzt zum Beispiel durch"],
    ["Vertraulichkeit", "nur Befugte können lesen", "abgefangene Mail, gestohlenes Passwort"],
    ["Integrität", "Daten sind unverändert und korrekt", "manipulierte Überweisung"],
    ["Verfügbarkeit", "Daten und Dienste sind erreichbar", "DDoS-Angriff, Ransomware"],
    ["Authentizität", "Absender und Daten sind echt", "Phishing-Mail mit falschem Absender"],
], [170, 300, 346], [
    ("Den Kern bilden **Vertraulichkeit, Integrität, Verfügbarkeit** — oft kommen Authentizität und Verbindlichkeit dazu", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 0): TINT_BLUE, (2, 0): TINT_GREEN, (3, 0): TINT_ORANGE, (4, 0): TINT_RED})

d.table_top("Angriffe erkennen", [
    ["Begriff", "Merkmal", "Schutz"],
    ["Virus", "hängt sich an eine Wirtsdatei", "Updates, Vorsicht bei Anhängen"],
    ["Wurm", "verbreitet sich selbst über Netze", "Updates, getrennte Netze"],
    ["Ransomware", "verschlüsselt Daten, fordert Lösegeld", "getrennte, geprüfte Sicherung"],
    ["Social Engineering", "nutzt Autorität, Hilfsbereitschaft, Zeitdruck", "Schulung, klare Regeln"],
    ["Man in the Middle", "schaltet sich in eine Verbindung", "Zertifikate, Ende-zu-Ende"],
], [190, 350, 276], [
    ("Die meisten Angriffe nutzen **bekannte, längst geschlossene Lücken** — Updates gehören zu den wirksamsten Maßnahmen", 0),
], font_size=11, bold_cols=(0,))

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Schützen", "Maßnahmen und Kryptologie",
          image="img/wiederholung2-chiffrierscheibe.jpg",
          credit="Chiffrierscheibe — Foto: Ryan Somma, CC BY 2.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:The_Union_Cipher_Disk_(5176186267).jpg")

d.table_top("Maßnahmen zur Datensicherheit", [
    ["Stichwort", "das Wichtigste"],
    ["vier Gruppen", "baulich, technisch, organisatorisch, personell"],
    ["Zutritt, Zugang, Zugriff", "Räume, Systeme, Daten"],
    ["geringste Rechte", "jede Rolle bekommt nur, was ihre Aufgabe erfordert"],
    ["3-2-1-Regel", "drei Kopien, zwei Medien, eine außer Haus"],
    ["Passwörter", "als Hashwert gespeichert, nicht im Klartext"],
    ["Sicherheitsverdacht", "nichts löschen, Ruhe bewahren, zuständige Stelle informieren"],
], [250, 566], [
    ("Ein **Zertifikat** bestätigt, dass der Server zur aufgerufenen Adresse gehört", 0),
], font_size=11, bold_cols=(0,))

d.table_top("Kryptologie auf einen Blick", [
    ["Verfahren", "Idee", "Schwäche"],
    ["Caesar", "alle Buchstaben um denselben Wert verschoben", "25 Schlüssel, Häufigkeiten"],
    ["Vigenère", "Schlüsselwort gibt wechselnde Verschiebungen", "Schlüsselwort wiederholt sich"],
    ["One-Time-Pad", "zufälliger Einmal-Schlüssel in Textlänge", "Schlüsselaustausch"],
    ["symmetrisch", "ein gemeinsamer Schlüssel", "sicherer Austausch nötig"],
    ["asymmetrisch", "öffentlicher und privater Schlüssel", "langsam, deshalb hybrid"],
], [170, 380, 266], [
    ("Verschlüsseln mit dem **öffentlichen Schlüssel des Empfängers**, signieren mit dem **eigenen privaten**", 0),
    ("**Kerckhoffs**: Die Sicherheit liegt im Schlüssel, nicht in einem geheimen Verfahren", 0),
], font_size=11, bold_cols=(0,))

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Datenschutzrecht", "Grundrecht und DSGVO",
          image="img/wiederholung2-plenarsaal.jpg",
          credit="Plenarsaal des Europäischen Parlaments — Foto: Sebastian Wallroth, CC BY 4.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Hemicycle_of_the_European_Parliament,_Strasbourg_2023_002.jpg")

d.table_top("Datenschutzrecht in Stichworten", [
    ["Stichwort", "das Wichtigste"],
    ["informationelle Selbstbestimmung", "Volkszählungsurteil 1983"],
    ["Verbot mit Erlaubnisvorbehalt", "ohne Rechtsgrundlage keine Verarbeitung"],
    ["Datenminimierung", "nur die für den Zweck nötigen Daten erheben"],
    ["Betroffenenrechte", "Auskunft, Berichtigung, Löschung, Widerspruch und mehr"],
    ["Datenpanne", "unverzüglich, möglichst binnen 72 Stunden melden"],
], [300, 516], [
    ("Personenbezogen ist alles, was sich einer **bestimmbaren** Person zuordnen lässt — auch eine IP-Adresse", 0),
], font_size=11, bold_cols=(0,))

d.two_cols("Typische Aufgaben und Tipps", [
    ("**Typische Aufgaben**", 0),
    ("zuordnen: Schutzziel, Maßnahmengruppe", 1),
    ("rechnen: Caesar und Vigenère von Hand", 1),
    ("unterscheiden: Virus und Wurm, Zugang und Zugriff", 1),
    ("begründen: Welche Rechtsgrundlage gilt?", 1),
], [
    ("**Tipps**", 0),
    ("Begriffe **paarweise** lernen — genau die werden verwechselt", 1),
    ("Alphabet mit 0 bis 25 notieren, dann zählen", 1),
    ("in Begründungen das **Fachwort** nennen", 1),
    ("die Aufgabenblätter der letzten Wochen durchgehen", 1),
])

d.merksatz("Schutzziele benennen, Maßnahmen zuordnen, Chiffren rechnen, Rechtsgrundlagen "
           "nennen — das sind die vier Handgriffe für die Klassenarbeit.")

d.bullets("Fun Facts", [
    ("Der **Morris-Wurm** legte 1988 einen großen Teil des damals noch kleinen Internets lahm", 0),
    ("Sein Autor Robert Morris wurde als Erster nach dem US-Gesetz gegen Computerbetrug verurteilt — heute ist er Informatikprofessor am MIT", 0),
    ("„123456“ steht seit Jahren ganz oben auf den Listen der häufigsten Passwörter", 0),
])

d.bullets("Eure Aufgabe", [
    ("**Station 1 Bedrohungen**: Vorfälle den verletzten Schutzzielen zuordnen", 0),
    ("**Station 2 Datensicherheit**: Maßnahmen den vier Gruppen zuordnen, einen Backup-Plan prüfen", 0),
    ("**Station 3 Kryptologie**: Caesar und Vigenère von Hand rechnen", 0),
    ("**Station 4 Datenschutzrecht**: Fallkarten entscheiden und begründen", 0),
    ("Zum Schluss: **Aufgaben (20)** auf der Planseite — Lösung pro Aufgabe zum Aufklappen", 0),
])

d.save()

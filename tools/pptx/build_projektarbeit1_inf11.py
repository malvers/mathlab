#!/usr/bin/env python3
"""Informatik 11 (BGY), Woche 27 / KW 12: Projekt Informationsmanagement - Erarbeitung I
(LB 4 "Projekt Informationsmanagement", Ustd. 5-6/14). Osterferien follow this week.

Facts line up with the worksheet HTML/inf11test-projektarbeit1.html (20 Aufgaben). Chapter
pictures come from Wikimedia Commons, each with its licence line on the slide.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("inf11-projektarbeit1.pptx")

d.title("Informatik — Grundkurs 11", "Aus Material wird ein Bericht",
        "Auswerten statt nacherzählen, gliedern, gemeinsam schreiben, zitieren")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Material auswerten", "Zuordnen, vergleichen, folgern",
          image="img/projektarbeit1-zettel.jpg",
          credit="Haftnotizen — Foto: ProjectManhattan, CC BY-SA 3.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Sticky_Notes_2.jpg")

d.bullets("Wo wir stehen", [
    ("Letzte Woche: **Recherche** — Teilfragen, Rechercheprotokoll, gemeinsame Quellenliste", 0),
    ("Jetzt liegt Material auf dem Tisch — aber noch keine Antwort", 0),
    ("Heute beginnt die **Erarbeitung**: selbstständig im Team, nach eurem Projektplan", 0),
    ("Leitfrage der Stunde: Wie wird aus gesammeltem Material eine **nachvollziehbare Antwort**?", 0),
])

# Project timeline - the same table in every deck of the series, with this week marked.
d.table_top("Der Fahrplan des Projekts", [
    ["Ustd.", "Phase", "Ergebnis der Phase"],
    ["1–2", "Themenwahl und Planung", "Leitfrage, Projektskizze, Meilensteine"],
    ["3–4", "Recherche", "geordnetes, belegtes Material"],
    ["5–6", "Erarbeitung I", "Gliederung und Rohfassung"],
    ["7–8", "Erarbeitung II", "geprüfte Endfassung"],
    ["9–10", "Präsentation ausarbeiten", "Foliensatz und Generalprobe"],
    ["11–12", "Präsentationen I", "erste Vorträge, Portfolio-Abgabe"],
    ["13–14", "Präsentationen II und Auswertung", "Bewertung und Reflexion"],
], [90, 330, 396], [
    ("Grün: geschafft — Orange: **heute**", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 1): TINT_GREEN, (2, 1): TINT_GREEN,
          (3, 0): TINT_ORANGE, (3, 1): TINT_ORANGE, (3, 2): TINT_ORANGE})

d.bullets("Jede Stunde beginnt mit dem Stand-up", [
    ("Kurz, im Stehen, wenige Minuten — jede Person beantwortet drei Fragen:", 0),
    ("Was habe ich seit dem letzten Mal geschafft?", 1),
    ("Was hindert mich gerade?", 1),
    ("Was mache ich als Nächstes?", 1),
    ("Probleme werden nur **benannt** — gelöst wird danach, mit den Betroffenen", 0),
])

d.bullets("Erster Schritt: zuordnen", [
    ("Erster Schritt beim Auswerten: die **Fundstellen den Teilfragen zuordnen**", 0),
    ("Die Zuordnung zeigt sofort, **wo noch etwas fehlt**", 0),
    ("Sie macht die Gliederung fast von selbst", 0),
    ("Zusammenfassen kommt erst danach", 0),
])

d.two_cols("Beschreiben oder auswerten?", [
    ("**Beschreiben**", 0),
    ("gibt wieder, was in den Quellen steht", 1),
    ("ergibt eine Materialsammlung", 1),
    ("fühlt sich nach Arbeit an", 1),
], [
    ("**Auswerten**", 0),
    ("ordnet ein und zieht Schlüsse", 1),
    ("vergleichen, gewichten, folgern", 1),
    ("genau darin liegt **eure eigene Leistung**", 1),
])

d.bullets("Wenn Ergebnisse nicht passen", [
    ("Quellen widersprechen sich? Den **Widerspruch benennen** und mögliche Gründe erörtern", 0),
    ("Oft messen die Quellen Verschiedenes — das offenzulegen ist saubere Arbeit", 0),
    ("Ergebnis gegen die Erwartung? **Berichten** und die Erwartung als widerlegt kennzeichnen", 0),
    ("These nachträglich anpassen oder suchen, bis es passt: beides ist **Täuschung**", 0),
    ("**Ergebnis und Bewertung trennen**: Was wurde gemessen, was ist eure Einschätzung?", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Der Bericht bekommt Gestalt", "Gliederung, Einleitung, Schluss",
          image="img/projektarbeit1-schreibmaschine.jpg",
          credit="Schreibmaschine Olympia Simplex — Foto: Sammlung der Medien und Wissenschaft, CC BY 4.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Olympia_Simplex.jpg")

d.table_top("Aufbau eines Projektberichts", [
    ["Teil", "was hineingehört"],
    ["Zusammenfassung", "Frage, Vorgehen und Ergebnis in wenigen Sätzen — entsteht ganz am Schluss"],
    ["Einleitung", "Leitfrage, Bedeutung des Themas, Vorgehen in Kürze — noch keine Ergebnisse"],
    ["Hauptteil", "ein Abschnitt je Teilfrage, geordnet nach dem Gedankengang"],
    ["Schluss", "Antwort auf die Leitfrage, Grenzen der Arbeit, offene Fragen"],
    ["Quellen und Anhang", "Quellenverzeichnis; Material zum Nachprüfen in den Anhang"],
], [190, 626], [
    ("Die Gliederung folgt den **Teilfragen**, nicht der Reihenfolge des Findens", 0),
    ("Viele lesen nur die Zusammenfassung — deshalb muss das **Ergebnis** darin stehen", 0),
], font_size=11, bold_cols=(0,),
   marks={(4, 0): TINT_GREEN})

d.bullets("Der häufigste Fehler", [
    ("Das Material wird **nacherzählt**, aber die Leitfrage nie beantwortet", 0),
    ("Nacherzählen fühlt sich nach Arbeit an, ist aber keine Auswertung", 0),
    ("Gegenmittel: nach jedem Abschnitt zurück auf die Leitfrage schauen", 0),
    ("Qualität heißt: Die Antwort folgt **nachvollziehbar aus dem gezeigten Material**", 0),
    ("Länge, Zahl der Quellen, Gestaltung: Mittel, kein Ziel", 0),
])

d.table_top("Zahlen, Abbildungen, Satz", [
    ["Element", "so ist es richtig"],
    ["Zahl", "Einheit, Bezugsgröße und Quelle immer mitnennen"],
    ["kleine Stichprobe", "absolute Zahlen statt Prozent, keine falschen Nachkommastellen"],
    ["Abbildung", "Unterschrift mit Nummer, Beschreibung und Quelle"],
    ["Blocksatz", "nur mit Silbentrennung — sonst große Lücken; lieber linksbündig"],
], [190, 626], [
    ("30 Prozent ohne Grundgesamtheit sagen nichts", 0),
    ("Die Nummer der Abbildung erlaubt den Verweis im Text", 0),
], font_size=11, bold_cols=(0,))

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Im Team schreiben", "Eine Fassung, klare Zuständigkeit, sauber zitieren",
          image="img/projektarbeit1-puzzle.jpg",
          credit="Puzzleteile — Foto: Profpcde, CC0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Red_jigsaw_puzzle_piece_on_green_pieces.jpg")

d.two_cols("Gemeinsam schreiben", [
    ("**So nicht**", 0),
    ("jede Person schreibt ihr Kapitel und fügt es am Ende ein", 1),
    ("eine Person schreibt alles", 1),
    ("alle schreiben gleichzeitig überall", 1),
    ("Ergebnis: liest sich wie vier Berichte", 1),
], [
    ("**So schon**", 0),
    ("**eine** gemeinsame Fassung, klare Zuständigkeit je Abschnitt", 1),
    ("eine **Endredaktion**: Eine Person vereinheitlicht Sprache, Begriffe und Zitierweise", 1),
    ("verantwortlich bleibt die ganze Gruppe", 1),
])

d.bullets("Digitale Kooperationswerkzeuge", [
    ("Eine **gemeinsame Fassung** im Projektordner oder in der Cloud — keine Kopien per Mail", 0),
    ("Kommentare **an der Textstelle** statt in einem getrennten Chat", 0),
    ("Die **Versionsgeschichte** zeigt, wer was wann geändert hat", 0),
    ("Aufgaben und Termine sichtbar führen — wie im Projektplan", 0),
    ("Sichern: eine **zweite Kopie an einem anderen Ort**", 0),
])

d.bullets("Sinngemäß zitieren", [
    ("Sinngemäß zitieren: **in eigenen Worten** formulieren und die Quelle mit Verweis angeben", 0),
    ("Auch sinngemäße Übernahmen sind **belegpflichtig**", 0),
    ("Einen Satz umstellen macht aus fremden Gedanken keine eigenen", 0),
    ("Nur im Quellenverzeichnis nennen reicht nicht — der Verweis gehört an die Stelle", 0),
])

d.bullets("Zwischenstand und Zeitplan", [
    ("Zwischenstand für die Beratung: die **Gliederung mit dem Stand je Abschnitt**", 0),
    ("Keine komplette Rohfassung — sie zu lesen kostet Zeit ohne Nutzen", 0),
    ("Den Plan ehrlich abgleichen: Bei Verzug den **Umfang anpassen**", 0),
    ("Endtermin verschieben oder nachts arbeiten ist keine Lösung", 0),
    ("Nach dieser Woche beginnen die **Osterferien** — vorher sichern, was steht", 0),
])

d.merksatz("Auswerten heißt: Fundstellen den Teilfragen zuordnen, vergleichen und Schlüsse ziehen — "
           "der Bericht folgt der Leitfrage, und am Ende steht ausdrücklich die Antwort.")

d.bullets("Fun Facts", [
    ("Die ersten Puzzles waren **Landkarten**: In den 1760er-Jahren klebte der Londoner John Spilsbury Karten auf Holz und zersägte sie", 0),
    ("Korrekturflüssigkeit erfand eine Sekretärin: **Bette Nesmith Graham** — die Mutter des Monkees-Musikers Michael Nesmith", 0),
    ("In der **Wikipedia** schreiben Tausende an denselben Artikeln — die Versionsgeschichte hält jede einzelne Änderung fest", 0),
    ("Der **Stand-up** heißt so, weil er im Stehen stattfindet — wer steht, fasst sich kürzer", 0),
])

d.bullets("Checkliste Erarbeitung I", [
    ("Die Fundstellen sind den **Teilfragen zugeordnet**", 0),
    ("Die **Gliederung** steht und folgt der Leitfrage", 0),
    ("Jeder Abschnitt hat **eine zuständige Person**", 0),
    ("Alle schreiben in **einer** gemeinsamen Fassung", 0),
    ("Vor den Ferien: Stand **gesichert** und im Portfolio festgehalten", 0),
])

d.bullets("Eure Aufgabe", [
    ("**Stand-up** zu Beginn: geschafft, Hindernisse, nächste Schritte", 0),
    ("**Material auswerten**: Fundstellen den Teilfragen zuordnen, Gliederung festlegen", 0),
    ("**Selbstständig im Team** schreiben — eine Fassung, eine Zuständigkeit je Abschnitt", 0),
    ("**Zwischenstandsbericht** an mich: Gliederung mit dem Stand je Abschnitt", 0),
    ("Zum Schluss: **Aufgaben (20)** auf der Planseite — Lösung pro Aufgabe zum Aufklappen", 0),
])

d.save()

#!/usr/bin/env python3
"""Informatik 13 (BGY), Woche 36: Konsultationen nach Bedarf - individuelle
Vorbereitung auf die muendliche Pruefung."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("konsultation-1-inf13.pptx")

d.title("Informatik — Grundkurs 13", "Konsultation",
        "Individuelle Vorbereitung — gezielt an den eigenen Lücken")

d.chapter(1, "So läuft eine Konsultation", "Kurz, konkret, vorbereitet")

d.table_top("Der Ablauf", [
    ["Phase", "was passiert", "Dauer"],
    ["Vorher", "ihr nennt zwei bis drei konkrete Fragen", "—"],
    ["Einstieg", "ihr erklärt, was ihr schon verstanden habt", "5 min"],
    ["Klärung", "genau die offenen Punkte, mit Beispiel", "15 min"],
    ["Übung", "eine Aufgabe dazu, gemeinsam gerechnet", "10 min"],
    ["Abschluss", "was übt ihr bis zum nächsten Mal?", "5 min"],
], [140, 430, 246], [
    ("**Ohne vorher genannte Fragen** wird die Konsultation zur Wiederholung des ganzen Kurses", 0),
    ("Und die bringt am wenigsten — dafür ist keine Zeit mehr", 0),
], font_size=10.5, bold_cols=(0,), marks={(1, 0): TINT_GREEN})

d.bullets("Wie man eine gute Frage stellt", [
    ("Schlecht: „Können wir Datenbanken nochmal machen?“", 0),
    ("Gut: „**Ich verwechsle WHERE und HAVING** — woran erkenne ich, was wohin gehört?“", 0),
    ("Schlecht: „Ich verstehe Rekursion nicht.“", 0),
    ("Gut: „**Ich kann fak_rek(4) nicht auflösen** — wo hakt es in meiner Tabelle?“", 0),
    ("Je konkreter die Frage, desto brauchbarer die Antwort", 0),
])

d.chapter(2, "Die häufigsten Lücken", "Woran es meistens liegt")

d.table_top("Lücke, Ursache, Übung", [
    ["Lücke", "Ursache", "Übung"],
    ["Kardinalitäten", "nur in eine Richtung gefragt", "fünf Beziehungen, beide Fragen"],
    ["Normalformen", "Ergebnis gelernt, Begründung nicht", "zwei Tabellen mit Nachweis"],
    ["GROUP BY", "WHERE und HAVING verwechselt", "vier Abfragen mit Aggregat"],
    ["Rekursion", "Auflösung nie schriftlich geübt", "fak_rek(5) Zeile für Zeile"],
    ["Netzplan", "Rückwärtsrechnung falsch", "ein Netzplan mit Probe"],
    ["Sicherheit", "Regel bekannt, Beispiel fehlt", "unsichere Zeile und ihre Korrektur"],
], [180, 300, 336], [
    ("In allen sechs Fällen fehlt nicht das Wissen, sondern die **geübte Anwendung**", 0),
], font_size=10, bold_cols=(0,))

d.bullets("Was ihr mitbringen sollt", [
    ("Eure **Lückenliste** aus der Prüfungsvorbereitung", 0),
    ("Die **Aufgabe**, an der ihr zuletzt gescheitert seid — mit eurem Lösungsversuch", 0),
    ("Euer **Merkblatt**, damit wir es ergänzen können", 0),
    ("Zwei bis drei **konkrete Fragen**, vorher aufgeschrieben", 0),
    ("Und Zeit: eine halbe Stunde konzentriert ist mehr wert als zwei Stunden nebenbei", 0),
])

d.chapter(3, "Zwischen den Terminen", "Was ihr allein tun könnt")

d.table_top("Ein Wochenplan, der funktioniert", [
    ["Tag", "Was", "Dauer"],
    ["Mo", "Modellierung: ein ER-Modell aus einem Text", "30 min"],
    ["Di", "Datenbanken: eine Normalisierung mit Begründung", "30 min"],
    ["Mi", "SQL: fünf Abfragen, davon zwei mit Gruppierung", "30 min"],
    ["Do", "Algorithmen: ein Schreibtischtest, eine Rekursion", "30 min"],
    ["Fr", "Web und Sicherheit: eine Lücke finden und beheben", "30 min"],
    ["Sa", "Merkblätter durchgehen und laut erklären", "20 min"],
], [80, 500, 236], [
    ("**Verteiltes Üben** schlägt Pauken deutlich — dreißig Minuten täglich reichen", 0),
    ("Der Samstag ist der wichtigste Tag: **laut erklären** ist der beste Test", 0),
], font_size=10.5, bold_cols=(0,), marks={(6, 1): TINT_GREEN})

d.merksatz("Eine konkrete Frage bringt in zehn Minuten mehr als zwei Stunden "
           "allgemeine Wiederholung.")

d.bullets("Fun Facts: Lernen vor Prüfungen", [
    ("Der **Testeffekt**: sich abfragen zu lassen wirkt deutlich stärker als Wiederlesen", 0),
    ("**Verteiltes Üben** über zwei Wochen schlägt dieselbe Zeit am Stück", 0),
    ("Wer den Stoff **laut erklärt**, merkt Lücken sofort — im Kopf klingt alles schlüssig", 0),
    ("**Gemischte** Aufgaben sind wirksamer als thematisch sortierte", 0),
    ("Und Schlaf zwischen zwei Übungseinheiten gehört zum Lernen dazu", 0),
])

d.bullets("Eure Aufgabe", [
    ("**Termin** vereinbaren und vorher zwei bis drei Fragen schicken", 0),
    ("**Lückenliste** und letzten Lösungsversuch mitbringen", 0),
    ("Zwischen den Terminen nach dem **Wochenplan** arbeiten", 0),
    ("Einmal die Woche jemandem den Stoff **laut erklären**", 0),
    ("Und: rechtzeitig anfangen, nicht in der letzten Woche", 0),
])

d.save()

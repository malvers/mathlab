#!/usr/bin/env python3
"""Informatik 11 (BGY), live plan KW 25: Vertiefung / Projektnachlese - Portfolios sichten,
Best-of der Projekte (ORGA week after Lernbereich 4 "Projekt Informationsmanagement").

Facts line up with the worksheet HTML/inf11test-projektnachlese.html (20 Aufgaben). Chapter
pictures come from Wikimedia Commons, each with its licence line on the slide.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("inf11-projektnachlese.pptx")

d.title("Informatik — Grundkurs 11", "Projektnachlese",
        "Zurückschauen, sichern, mitnehmen — was vom Projekt bleibt")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Zurückschauen", "Retrospektive statt Rechtfertigung",
          image="img/projektnachlese-rueckspiegel.jpg",
          credit="Blick in den Rückspiegel — Foto: Kalle K (kallek), CC0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Rear_view_mirror_Sn%C3%A6fellsj%C3%B6kull_(Unsplash).jpg")

d.bullets("Wo wir stehen", [
    ("Letzte Woche: Digitalisierung in Gesellschaft und Beruf — Chancen, Risiken, Positionen", 0),
    ("Das Projekt Informationsmanagement ist **präsentiert und bewertet**", 0),
    ("Heute: Portfolios sichten, das **Best-of** der Projekte zeigen — und festhalten, was wir gelernt haben", 0),
    ("Leitfrage: Was nehmen wir aus dem Projekt mit — **über die Note hinaus**?", 0),
])

d.two_cols("Nachlese ist nicht Bewertung", [
    ("**Bewertung**", 0),
    ("dient der Leistungsfeststellung", 1),
    ("misst das Ergebnis", 1),
    ("ist abgeschlossen — die Note steht nicht mehr zur Debatte", 1),
], [
    ("**Nachlese**", 0),
    ("dient dem **Lernen**", 1),
    ("sichert Erfahrungen, solange sie frisch sind", 1),
    ("ohne Notendruck redet man offener", 1),
    ("vermischt mit der Note wird sie zur Rechtfertigung", 1),
])

d.bullets("Die Retrospektive", [
    ("Eine **strukturierte Rückschau des Teams** auf die Zusammenarbeit — mit festem Ablauf", 0),
    ("Es geht um den **Weg**, nicht um das Produkt", 0),
    ("Die erste Frage: **Was hat gut funktioniert — und warum?** Das Warum zählt mehr als das Was", 0),
    ("Schuldfragen wie „Wer hat am wenigsten gemacht?“ beenden die Auswertung sofort", 0),
    ("Gutes Ergebnis: **ein bis drei konkrete Änderungen** — wer macht was ab wann", 0),
])

d.table_top("Aus Pannen lernen", [
    ["Was passiert ist", "wenig hilfreich", "hilfreich"],
    ["Zeitverzug", "Wir hätten früher anfangen sollen.", "An welcher Stelle war die Schätzung falsch — und warum?"],
    ["Konflikt nie angesprochen", "ruhen lassen oder die Gruppe wechseln", "in der Nachlese sachlich benennen, Ursache klären"],
    ["eigener Anteil", "Prozente schätzen, mit anderen vergleichen", "übernommene Aufgaben und ihr Ergebnis beschreiben"],
    ["Projekt gescheitert", "das Thema künftig meiden", "die Ursache benennen — ein vollwertiges Ergebnis"],
], [190, 290, 336], [
    ("Nicht angesprochene Konflikte **wiederholen sich** — in der Nachlese ist der Druck geringer", 0),
], font_size=11, bold_cols=(0,), marks={(0, 1): TINT_RED, (0, 2): TINT_GREEN})

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Sichern und übergeben", "Übergabe, Archiv, Datenschutz",
          image="img/projektnachlese-archiv.jpg",
          credit="Archiv des Internationalen Komitees vom Roten Kreuz — Foto: RomanDeckert, CC BY-SA 4.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:CICR-ICRC-PublicArchives_WWII-files_RomanDeckert09062020.jpg")

d.bullets("Die Übergabe", [
    ("Wird das Projekt weitergeführt, reichen die Dateien allein nicht", 0),
    ("In die Übergabe gehören **Stand, offene Punkte, Zugänge** und die **Entscheidungen mit Begründung**", 0),
    ("Ohne Begründung wird jede Entscheidung neu diskutiert", 0),
    ("Offene Punkte sind der eigentliche Arbeitsvorrat — **Zugänge** werden erfahrungsgemäß vergessen", 0),
])

d.bullets("Archivieren mit Verstand", [
    ("Ablegen: **Endfassungen, Rohdaten** und eine kurze **Erklärung der Ordnerstruktur**", 0),
    ("Rohdaten machen die Ergebnisse **nachprüfbar**", 0),
    ("Ohne Lesehilfe findet sich später niemand zurecht", 0),
    ("Alle Zwischenfassungen aufzuheben erzeugt nur **Suchaufwand**", 0),
])

d.table_top("Personenbezogene Daten im Projekt", [
    ["Was", "Regel", "Warum"],
    ["Projektdaten", "nur so lange aufbewahren, wie der Zweck es erfordert", "Grundsatz der Speicherbegrenzung"],
    ["Interviewaufnahmen", "löschen, sobald die Auswertung abgeschlossen ist", "Zustimmung galt nur der Auswertung"],
    ["anonymisierte Auswertung", "darf bleiben", "sie genügt als Beleg"],
    ["Weitergabe an spätere Jahrgänge", "personenbezogene Anteile entfernen, Urheberschaft nennen",
     "Beteiligte haben nicht eingewilligt"],
], [200, 330, 286], [
    ("Die Verfassenden bleiben **Urheber** — mit ihrer Zustimmung ist die Weitergabe unproblematisch", 0),
], font_size=11, bold_cols=(0,), marks={(2, 0): TINT_ORANGE, (4, 0): TINT_BLUE})

d.bullets("Aufschreiben — sonst ist es weg", [
    ("Häufigster Grund für verlorene Erkenntnisse: Sie werden **nicht aufgeschrieben**", 0),
    ("Im Gespräch fühlt sich alles selbstverständlich an — drei Wochen später ist es weg", 0),
    ("Die Nachlese festhalten: **kurz, konkret** und dort, wo man sie beim nächsten Projekt **findet**", 0),
    ("Drei konkrete Punkte werden gelesen — oft genügt eine halbe Seite", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Was bleibt", "Lernzuwachs sichtbar machen",
          image="img/projektnachlese-wegweiser.jpg",
          credit="Historischer Wegweiser in Bad Kissingen — Foto: Darev, CC BY-SA 3.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Wegweiser_(Bad_Kissingen,_D-6-72-114-369)_%E2%80%93_20141004-065.jpg")

d.bullets("Den eigenen Lernzuwachs zeigen", [
    ("Vergleichen, **was ihr vor und nach dem Projekt konntet**", 0),
    ("Der Vergleich braucht einen Ausgangspunkt — deshalb lohnt eine kurze Notiz zu Projektbeginn", 0),
    ("Die Note misst das Ergebnis, nicht den Zuwachs — Seitenzahl und Quellenzahl auch nicht", 0),
    ("Gute Frage an die Betreuung: „Woran hätten Sie früher gemerkt, dass wir vom Weg abkommen?“", 0),
    ("Notenfragen gehören ins Einzelgespräch, Vergleiche mit anderen Gruppen bringen nichts", 0),
])

d.bullets("Wann ist ein Projekt gelungen?", [
    ("Die **Leitfrage ist beantwortet** — und die Gruppe könnte den Weg erklären", 0),
    ("Erklären können heißt verstanden haben", 0),
    ("Konflikte sind normal und oft produktiv — Einigkeit ohne Auseinandersetzung ist eher ein **Warnzeichen**", 0),
    ("Auch ein sauber begründetes **Scheitern** ist ein vollwertiges Ergebnis und gehört in den Bericht", 0),
])

d.bullets("Was am weitesten trägt", [
    ("Nicht die Bedienung eines Präsentationsprogramms, nicht das Formatieren eines Berichts", 0),
    ("Sondern: eine **offene Frage in bearbeitbare Schritte zerlegen**", 0),
    ("Werkzeuge wechseln, das Vorgehen bleibt", 0),
    ("Zerlegen ist die zentrale **informatische Arbeitsweise** — in jedem Fach und in jedem Beruf", 0),
])

d.merksatz("Eine Nachlese dient dem Lernen, nicht der Note: Sie hält kurz und auffindbar fest, was "
           "funktioniert hat, was nicht — und ein bis drei konkrete Änderungen für das nächste Mal.")

d.bullets("Fun Facts", [
    ("Viele Teams beginnen ihre Retrospektive mit der **Prime Directive** von Norman Kerth (2001): Alle haben mit ihrem damaligen Wissen ihr Bestes gegeben", 0),
    ("In **Scrum** folgt auf jeden Arbeitsabschnitt, den Sprint, eine Retrospektive", 0),
    ("Die NASA sammelt Erfahrungen aus ihren Projekten in einer eigenen Datenbank: dem **Lessons Learned Information System**", 0),
    ("Der Haftnotizzettel begann als Fehlschlag: Spencer Silver suchte 1968 einen starken Kleber — und fand einen **schwachen**", 0),
])

d.bullets("Eure Aufgabe", [
    ("**Portfolios sichten**: Jede Gruppe blättert ihr Portfolio durch und markiert ihren stärksten Moment", 0),
    ("**Best-of**: pro Gruppe zwei Minuten — ein Ergebnis, auf das ihr stolz seid, und warum", 0),
    ("**Mini-Retrospektive** im Team: ein bis drei konkrete Änderungen auf einer halben Seite", 0),
    ("**Offene Fragen** aus dem Projekt sammeln und gemeinsam klären", 0),
    ("Zum Schluss: **Aufgaben (20)** auf der Planseite — Lösung pro Aufgabe zum Aufklappen", 0),
])

d.save()

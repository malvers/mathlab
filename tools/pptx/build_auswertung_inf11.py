#!/usr/bin/env python3
"""Informatik 11 (BGY), KW 20 (live plan): Auswertung Klassenarbeiten / Uebung - Fehlertypen,
Operatoren, Pruefungstechnik und gemischte Wiederholung (ORGA, short deck).

Facts line up with the worksheet HTML/inf11test-auswertung.html (20 Aufgaben). The mixed review
table uses only the worksheet's own items; it does not claim to show this class's actual
mistakes. Chapter pictures from Wikimedia Commons, each with its licence line on the slide.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("inf11-auswertung.pptx")

d.title("Informatik — Grundkurs 11", "Aus Fehlern lernen",
        "Auswertung der Klassenarbeit — Fehlertypen, Operatoren und Prüfungstechnik")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Fehler verstehen", "Fehlertypen und Berichtigung",
          image="img/auswertung-korrektur.jpg",
          credit="Korrigiertes Manuskript — Foto: Phoebe, CC BY-SA 3.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Example_of_copyedited_manuscript.jpg")

d.bullets("Wo wir stehen", [
    ("Der Wahlbereich ist geschafft: komprimieren und Fehler erkennen", 0),
    ("Die korrigierten Arbeiten sind zurück", 0),
    ("Leitfrage: Welche Fehler habe ich gemacht — und wie verhindere ich sie beim nächsten Mal?", 0),
    ("Heute lernen wir **gemeinsam** aus den Fehlern der ganzen Klasse", 0),
    ("Noten bleiben Sache jeder einzelnen Person — Fragen zur Bewertung im **Einzelgespräch**", 0),
])

d.table_top("Drei typische Fehlertypen", [
    ["Fehlertyp", "woran man ihn erkennt", "was hilft"],
    ["Begriffsverwechslung", "Integrität statt Vertraulichkeit", "Begriffe paarweise abgrenzen"],
    ["unvollständige Begründung", "richtige Antwort, aber ohne weil", "jede Aussage mit einem Grund stützen"],
    ["Flüchtigkeit", "Rechenfehler, Teilaufgabe übersehen", "Zeitplan, am Ende kontrollieren"],
], [240, 290, 286], [
    ("Der wichtigste Schritt: jeden Fehler **verstehen** und seinen **Typ** bestimmen", 0),
    ("Verwechselte Begriffe sind der häufigste inhaltliche Fehler", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 0): TINT_RED, (2, 0): TINT_ORANGE, (3, 0): TINT_BLUE})

d.bullets("Richtig berichtigen", [
    ("Die falschen Aufgaben **neu lösen** — ohne die Lösung daneben", 0),
    ("Abschreiben erzeugt das Gefühl von Verstehen, nicht das Verstehen", 0),
    ("**Erst danach** mit der Musterlösung vergleichen", 0),
    ("Punkte nachrechnen lohnt — ersetzt die Fehleranalyse aber nicht", 0),
    ("Für die nächste Arbeit: die **eigenen Fehlertypen** gezielt üben statt alles von vorn zu lesen", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Operatoren", "Was die Aufgabe wirklich verlangt",
          image="img/auswertung-wegweiser.jpg",
          credit="Wegweiser in den Dünen — Foto: Dietmar Rabich, CC BY-SA 4.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Norderney,_D%C3%BCnenlandschaft,_Wegweiser_--_2025_--_9437.jpg")

d.table_top("Operatoren — was wird verlangt?", [
    ["Operator", "verlangt"],
    ["nennen", "Begriffe oder Sachverhalte aufzählen — ohne Erläuterung"],
    ["erklären", "Zusammenhänge herstellen: Warum ist es so?"],
    ["erläutern", "veranschaulichen, mit Beispielen"],
    ["begründen", "eine Aussage mit fachlichen Argumenten stützen"],
    ["vergleichen", "Gemeinsamkeiten und Unterschiede anhand von Kriterien"],
    ["beurteilen", "zu einem begründeten Urteil kommen, auswählen"],
], [200, 616], [
    ("**Nennen** gehört zum Anforderungsbereich I, **erklären** und **erläutern** zum Bereich II", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 0): TINT_GREEN, (2, 0): TINT_BLUE, (3, 0): TINT_BLUE})

d.two_cols("Vier Fallen bei Operatoren", [
    ("**Zu viel**", 0),
    ("Wer bei nennen erklärt, verschenkt Zeit — und gewinnt keine Punkte", 1),
    ("**Zu wenig**", 0),
    ("Ein Beispiel allein ist keine Begründung", 1),
], [
    ("**Doppelt beschrieben**", 0),
    ("Vergleichen ohne Kriterien wird zur Doppelbeschreibung", 1),
    ("**Zu früh geurteilt**", 0),
    ("Eine Auswahl verlangt erst beurteilen", 1),
])

d.table_top("Gemischte Wiederholung: typische Verwechslungen", [
    ["Frage", "häufig falsch", "richtig"],
    ["Daten unbemerkt verändert — welches Schutzziel?", "Vertraulichkeit", "Integrität"],
    ["Wie viele Werte mit 6 Bit?", "36 oder 12", "$2^{6} = 64$"],
    ["Was leistet eine digitale Signatur?", "sie verschlüsselt", "belegt Urheber und Unverändertheit"],
    ["Wer entwickelt Compiler?", "theoretische Informatik", "praktische Informatik"],
    ["Was besagt die 3-2-1-Regel?", "drei Sicherungen täglich", "3 Kopien, 2 Medien, 1 außer Haus"],
], [330, 200, 286], [
    ("Signiert wird mit dem **privaten**, geprüft mit dem **öffentlichen** Schlüssel", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 2): TINT_GREEN, (2, 2): TINT_GREEN, (3, 2): TINT_GREEN, (4, 2): TINT_GREEN,
          (5, 2): TINT_GREEN})

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Prüfungstechnik", "Zeit, Teilpunkte, Fachsprache",
          image="img/auswertung-sanduhr.jpg",
          credit="Sanduhr — Foto: John Morgan, CC BY 2.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Hourglass_with_sand.jpg")

d.bullets("Fünf Regeln für die nächste Arbeit", [
    ("**Überfliegen**: Umfang und Punkte zeigen, wie viel Zeit eine Aufgabe wert ist", 0),
    ("**Kennzeichnen**: jede Teilaufgabe ausdrücklich beantworten — die Reihenfolge darf man wählen", 0),
    ("**Weitermachen**: Wer hängt, markiert die Stelle und kehrt später zurück", 0),
    ("**Anfangen**: Teilantworten bringen Punkte — ein leeres Feld sicher null", 0),
    ("**Nachsehen**: am Ende Einheiten, Rechnungen und Teilaufgaben kontrollieren", 0),
])

d.two_cols("Fachsprache macht bewertbar", [
    ("**Unscharf**", 0),
    ("Das Ding schickt was", 1),
    ("Die Daten sind kaputt", 1),
    ("Das Bild ist irgendwie kleiner", 1),
], [
    ("**Präzise**", 0),
    ("Der Client sendet eine Anfrage", 1),
    ("Die Integrität der Daten ist verletzt", 1),
    ("JPEG hat Bildinformation weggelassen", 1),
])

d.merksatz("Eine Arbeit ist erst ausgewertet, wenn jeder Fehler einen Typ hat "
           "und die falschen Aufgaben ohne Lösung daneben neu gelöst sind.")

d.bullets("Fun Facts", [
    ("**Hermann Ebbinghaus** lernte 1885 im Selbstversuch sinnlose Silben — und maß als Erster, wie schnell man vergisst", 0),
    ("Er fand auch: **Verteiltes** Wiederholen hält länger als alles an einem Abend", 0),
    ("Sich selbst **abfragen** wirkt stärker als erneutes Lesen — das zeigen Lernexperimente immer wieder", 0),
])

d.bullets("Eure Aufgabe", [
    ("**Fehleranalyse**: jede Aufgabe mit Punktverlust einem Fehlertyp zuordnen — Begriff, Begründung, Flüchtigkeit", 0),
    ("**Berichtigung**: die falschen Aufgaben neu lösen, erst danach mit der Lösung vergleichen", 0),
    ("**Erklärpaare**: eine Aufgabe, die ihr sicher könnt, der Nachbarin erklären — beim Erklären fallen Lücken auf", 0),
    ("**Individuelle Übung** am eigenen häufigsten Fehlertyp", 0),
    ("Zum Schluss: **Aufgaben (20)** auf der Planseite — Lösung pro Aufgabe zum Aufklappen", 0),
])

d.save()

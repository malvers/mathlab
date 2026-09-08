#!/usr/bin/env python3
"""Informatik 11 (BGY), Woche 4 / KW 37 (live plan; inf11.html still numbers it 3 / KW 36): Informatik als Bildungsinhalt und
Medium anderer Wissenschaftszweige (LB 1, Ustd. 3-4/6).

The four Wissenschaftsbereiche and what belongs where follow the Saechsischer
Lehrplan BGY Informatik (2020), LB 1 - including its own assignment of
"Hardware und Betriebssystem" to the technical branch.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("inf11-bildungsinhalt.pptx")

d.title("Informatik — Grundkurs 11", "Informatik als Medium anderer Wissenschaften",
        "Wo informatische Methoden in fremden Fächern arbeiten — und wo was hingehört")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Vier Bereiche, eine Wissenschaft", "Wiederholung — und die Frage nach der Zuordnung")

d.bullets("Wo wir stehen", [
    ("Letzte Woche: die **vier Wissenschaftsbereiche** der Informatik", 0),
    ("Heute die Gegenprobe: **Zuordnen** — wo gehört eine konkrete Aufgabe hin?", 0),
    ("Und der Blick nach außen: Informatik arbeitet in **fremden Fächern** mit", 0),
    ("Leitfrage der Stunde: Ist Informatik nur ein Fach — oder ein **Werkzeug für alle Fächer**?", 0),
])

d.table_top("Die vier Wissenschaftsbereiche", [
    ["Bereich", "Leitfrage", "laut Lehrplan", "Beispiel"],
    ["theoretisch", "Was ist überhaupt berechenbar?", "Lösbarkeit, Sprachen, Automaten",
     "Beweis, dass etwas unlösbar ist"],
    ["technisch", "Wie ist der Rechner gebaut?", "Hardware und Betriebssystem",
     "Prozessor, Speicherverwaltung"],
    ["praktisch", "Wie baut man Software planvoll?", "Software Engineering",
     "Anforderungen, Test, Wartung"],
    ["angewandt", "Wie hilft das einem anderen Fach?", "Methoden in fremden Gebieten",
     "CT-Bild, Wetter, Übersetzung"],
], [122, 226, 240, 228], [
    ("Die mittlere Spalte steht **so** im Lehrplan — daran wird auch geprüft", 0),
], font_size=10.5, bold_cols=(0,))

d.bullets("Hardware und Betriebssystem — wohin?", [
    ("Der Lehrplan ordnet beides der **technischen Informatik** zu", 0),
    ("Begründung: Es geht um **die Maschine selbst** — Bauteile und ihre Verwaltung", 0),
    ("Das Betriebssystem teilt Prozessorzeit, Speicher und Geräte zu — es steht **direkt an der Hardware**", 0),
    ("Ehrlich dazugesagt: Viele **Lehrbücher** zählen Betriebssysteme zur praktischen Informatik", 0),
    ("Bei uns gilt die Zuordnung des **Lehrplans** — und die Begründung zählt mehr als das Etikett", 0),
])

d.bullets("Software Engineering — wohin?", [
    ("Der Lehrplan ordnet es der **praktischen Informatik** zu", 0),
    ("Es geht nicht um **eine** clevere Zeile Code, sondern um **große Programme über Jahre**", 0),
    ("Anforderungen klären, entwerfen, programmieren, testen, warten — planvoll statt drauflos", 0),
    ("Die Leitfrage lautet: Wie bauen **viele Menschen gemeinsam** Software, die hält?", 0),
])

d.table_top("Zuordnungsübung — und die Begründung dazu", [
    ["Aufgabe", "Bereich", "warum"],
    ["Schaltplan eines Prozessors entwerfen", "technisch", "die Maschine selbst"],
    ["Beweisen, dass ein Problem unlösbar ist", "theoretisch", "gilt für jeden Rechner"],
    ["Testplan für eine Krankenhaus-Software", "praktisch", "planvoll Software bauen"],
    ["Sprachmodell für Dialektforschung", "angewandt", "Frage kommt aus der Sprachwissenschaft"],
    ["Speicherverwaltung eines Betriebssystems", "technisch", "Verwaltung der Bauteile"],
], [330, 140, 346], [
    ("Ohne Begründung ist eine Zuordnung nur geraten — **ein Satz** genügt", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 1): TINT_BLUE, (5, 1): TINT_BLUE, (2, 1): TINT_ORANGE,
          (3, 1): TINT_GREEN, (4, 1): TINT_RED})

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Informatik in fremden Gebieten", "Physik, Medizin, Sprache")

d.bullets("Angewandte Informatik: immer dasselbe Muster", [
    ("Ein **fremdes Fach** hat eine Frage, die es allein nicht beantworten kann", 0),
    ("Die Frage wird **modelliert** — aus Wirklichkeit werden Daten und Regeln", 0),
    ("Ein informatisches **Verfahren** rechnet: Simulation, Rekonstruktion, Statistik, Lernverfahren", 0),
    ("Das Ergebnis wird **zurückübersetzt** und vom Fach geprüft — nicht von der Informatik", 0),
    ("Merke: Die Frage bleibt beim Fach. Nur der **Weg** zur Antwort führt über den Rechner", 0),
])

d.bullets("Physik: rechnen, was man nicht messen kann", [
    ("Ein Klima über 100 Jahre und eine Sternexplosion passen in **kein Labor**", 0),
    ("Die Simulation gilt deshalb als **dritte Säule** neben Theorie und Experiment", 0),
    ("**Monte-Carlo-Verfahren**: mit Zufallszahlen so oft würfeln, bis die Statistik stimmt", 0),
    ("Wetterdienste rechnen die Atmosphäre in einem **Gitter** — Kachel für Kachel, Stunde für Stunde", 0),
    ("Und die Physik hat zurückgegeben: Das **WWW** entstand 1989 am CERN für den Austausch von Papern", 0),
])

d.table_top("Physik konkret", [
    ["Fachfrage", "informatische Methode", "Ergebnis"],
    ["Wie wird das Wetter übermorgen?", "numerische Simulation im Gitter", "Vorhersage mit Unsicherheit"],
    ["Was passiert bei einer Teilchenkollision?", "Mustererkennung in riesigen Datenmengen",
     "Spur eines seltenen Teilchens"],
    ["Wie verhält sich ein Material unter Druck?", "Simulation vieler Atome", "Werkstoff am Rechner erprobt"],
], [268, 292, 256], [
    ("Gemeinsam ist allen: **zu groß, zu schnell, zu gefährlich** für das Experiment", 0),
], font_size=11, bold_cols=(0,))

d.bullets("Medizin: aus Messwerten wird ein Bild", [
    ("Ein **Computertomograf** fotografiert nicht — er misst nur die Schwächung von Röntgenstrahlen", 0),
    ("Gemessen werden **Summen entlang von Strahlen**, aus vielen Richtungen", 0),
    ("Das Schnittbild wird daraus **berechnet** (Rückprojektion; Mathematik von Johann Radon, 1917)", 0),
    ("Ohne Informatik gäbe es **kein einziges CT-Bild** — der Rechner ist Teil des Geräts", 0),
    ("Danach geht es weiter: Bilder **segmentieren**, Verläufe vergleichen, Befunde vorschlagen", 0),
])

d.table_top("Medizin konkret", [
    ["Fachfrage", "informatische Methode", "Ergebnis"],
    ["Wie sieht es im Körper aus?", "Rekonstruktion aus Projektionen", "CT- und MRT-Schnittbilder"],
    ["Welches Gen gehört zu welcher Krankheit?", "Sequenzalignment auf A, C, G, T", "Treffer in der Datenbank"],
    ["Wirkt dieses Medikament?", "Statistik über große Studien", "belastbare Aussage statt Bauchgefühl"],
], [268, 292, 256], [
    ("Für den Rechner ist **DNA eine Zeichenkette** — damit wird Biologie zu Textverarbeitung", 0),
], font_size=11, bold_cols=(0,))

d.bullets("Sprache: Text als Datenstrom", [
    ("**Tokenisierung**: Der Satz wird zuerst in Wörter und Satzzeichen zerlegt", 0),
    ("Danach Wortarten bestimmen, Satzbau analysieren, Bedeutung annähern", 0),
    ("**Zipfsches Gesetz**: Wenige Wörter kommen sehr oft vor, sehr viele fast nie", 0),
    ("Maschinelle Übersetzung und Spracherkennung sind heute **gelernte** Verfahren, keine Regelwerke", 0),
    ("**Stilometrie**: Unauffällige Wörter wie „und“ und „aber“ verraten, wer einen Text geschrieben hat", 0),
])

d.table_top("Sprache konkret", [
    ["Fachfrage", "informatische Methode", "Ergebnis"],
    ["Wer hat diesen anonymen Text verfasst?", "Häufigkeiten von Funktionswörtern messen", "Autorschaft wahrscheinlich"],
    ["Wie verändert sich ein Dialekt?", "große Textsammlungen auswerten", "Karten und Zeitreihen"],
    ["Was heißt dieser Satz auf Deutsch?", "trainiertes Übersetzungsmodell", "Übersetzung samt Fehlerquellen"],
], [268, 292, 256], [
    ("Auch hier gilt: Das Urteil über das Ergebnis fällt die **Sprachwissenschaft**", 0),
], font_size=11, bold_cols=(0,))

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Informatik als Bildungsinhalt", "Warum das alle angeht")

d.two_cols("Anwenden ist nicht gestalten", [
    ("**Anwenden**", 0),
    ("Ein fertiges Programm bedienen", 1),
    ("Ergebnisse übernehmen", 1),
    ("Die Methode bleibt eine Black Box", 1),
    ("Reicht für den Alltag", 1),
], [
    ("**Gestalten**", 0),
    ("Das Problem selbst modellieren", 1),
    ("Ein Verfahren auswählen und anpassen", 1),
    ("Das Ergebnis kritisch prüfen", 1),
    ("Genau das ist angewandte Informatik", 1),
])

d.bullets("Warum Informatik Bildungsinhalt ist", [
    ("Wer **Modelle** versteht, erkennt, was ein Ergebnis weglässt — und was es damit nicht sagt", 0),
    ("Wer **Grenzen** kennt, glaubt keiner Vorhersage blind, nur weil ein Rechner sie geliefert hat", 0),
    ("Informatische Methoden entscheiden längst mit — in Medizin, Justiz, Verwaltung, Schule", 0),
    ("Mitreden können setzt voraus, die **Methode zu verstehen**, nicht nur das Programm zu bedienen", 0),
])

d.merksatz("Angewandte Informatik heißt: Die Frage kommt aus einem anderen Fach, der Weg zur "
           "Antwort führt über informatische Methoden — und beurteilt wird das Ergebnis wieder "
           "vom Fach.")

d.bullets("Fun Facts", [
    ("Den **Nobelpreis für die Computertomografie** (1979) bekamen ein Physiker und ein Ingenieur "
     "— Cormack und Hounsfield", 0),
    ("Die Mathematik dahinter lag seit **1917** herum: Johann Radon rechnete sie ohne jede Anwendung aus", 0),
    ("**Tim Berners-Lee** schrieb 1989 einen Vorschlag, den sein Chef mit „vague, but exciting“ "
     "kommentierte — daraus wurde das Web", 0),
    ("Das **Humangenomprojekt** brauchte 13 Jahre bis 2003; heute wird ein Genom an einem Tag gelesen", 0),
    ("1963 klärten zwei Statistiker mit Wortzählungen, wer die umstrittenen **Federalist Papers** "
     "geschrieben hatte — Informatik als Detektiv der Literaturwissenschaft", 0),
])

d.bullets("Eure Aufgabe: Kurzrecherche + Mini-Vortrag", [
    ("**Ein** Anwendungsgebiet wählen: Physik, Medizin, Sprache — oder ein eigenes Fach", 0),
    ("**Recherchieren** (15 Minuten): Welche Frage stellt das Fach, welche Methode löst sie?", 0),
    ("**Zuordnen**: Zu welchem Wissenschaftsbereich gehört euer Beispiel — mit einem Satz Begründung", 0),
    ("**Vortragen** (2 Minuten): Fachproblem, informatische Methode, Zuordnung, Quelle", 0),
    ("Bewertet wird die **Begründung**, nicht die Zahl der Folien", 0),
])

d.save()

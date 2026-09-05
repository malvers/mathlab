#!/usr/bin/env python3
"""Projektabschluss: Praesentationen und kritische Wuerdigung (Woche 32)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("projektabschluss-praesentation.pptx")
P = lambda n: os.path.join(IMG, n)

d.title("Informatik — FOS 12", "Projektabschluss",
        "Präsentationen, Auswertung und eine kritische Würdigung")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Der Tag", "Wie der Abschluss abläuft")

d.table_top("Ablauf je Team", [
    ["Zeit", "was passiert", "wer"],
    ["12 Min.", "Präsentation mit Live-Demo", "das Team, alle sprechen"],
    ["5 Min.", "Nachfragen aus dem Kurs und von der Lehrkraft", "alle"],
    ["3 Min.", "Rückmeldung des Beobachterteams nach den Kriterien", "Partnerteam"],
    ["2 Min.", "Wechsel und Aufbau des nächsten Teams", "—"],
], [110, 460, 246], [
    ("Der **Aufbau** passiert in der Wechselzeit — Rechner anschließen, Seite laden, Testdaten prüfen", 0),
    ("Jedes Team ist einmal **Beobachterteam** und füllt dabei den Kriterienbogen aus", 0),
], font_size=11, bold_cols=(0,), align="cll")

d.bullets("Regeln für das Publikum", [
    ("**Zuhören und mitschreiben** — jedes Team beobachtet gezielt nach den Kriterien", 0),
    ("Fragen erst **nach** der Präsentation, in ganzen Sätzen und sachlich", 0),
    ("Gute Fragen zielen auf **Entscheidungen**: „Warum habt ihr … so gelöst?“", 0),
    ("**Keine** Fangfragen und kein Bloßstellen — es geht um die Sache", 0),
    ("Nach der Rückmeldung: **danke** sagen. Auch für Kritik", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Bewertung", "Woraus sich die Note zusammensetzt")

d.table_top("Das Kriterienraster", [
    ["Bereich", "Kriterium", "Punkte"],
    ["Produkt", "Funktion: die geplanten Seiten laufen fehlerfrei", "10"],
    ["Produkt", "Datenmodell: sauber modelliert, normalisiert, angebunden", "10"],
    ["Produkt", "Technik: gültiges HTML, getrenntes CSS, responsiv", "10"],
    ["Produkt", "Sicherheit und Datenschutz umgesetzt und begründet", "10"],
    ["Prozess", "Planung, Tagebuch, Arbeitsteilung nachvollziehbar", "15"],
    ["Prozess", "Testprotokoll, Fehlerbehandlung, Quellen", "15"],
    ["Präsentation", "Inhalt, Struktur, Fachsprache, Demo", "20"],
    ["Präsentation", "Auftreten, Beteiligung aller, Nachfragen", "10"],
], [140, 520, 116], [
    ("**100 Punkte** insgesamt; die Umrechnung folgt dem bekannten Notenschlüssel", 0),
    ("Der **Prozess** macht 30 Punkte aus — dokumentiert wird die ganze Zeit, nicht am Ende", 0),
], font_size=10.5, bold_cols=(0,), align="llc",
   marks={(r, 0): TINT_BLUE for r in (1, 2, 3, 4)} | {(r, 0): TINT_ORANGE for r in (5, 6)} |
         {(r, 0): TINT_GREEN for r in (7, 8)})

d.bullets("Selbsteinschätzung vor der Rückgabe", [
    ("Jedes Team schätzt sich **vorher** in allen acht Zeilen selbst ein — schriftlich", 0),
    ("Danach vergleichen wir: Wo liegen wir auseinander, und warum?", 0),
    ("Erfahrungsgemäß unterschätzen Teams ihren **Prozess** und überschätzen die **Technik**", 0),
    ("Selbsteinschätzung ist keine Verhandlung, sondern eine **Übung im Bewerten**", 0),
    ("Genau das verlangt der Lehrplan: sich **positionieren** und Lösungen **kritisch würdigen**", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Kritische Würdigung", "Ehrlich auswerten, nicht schönreden")

d.table_top("Leitfragen für die Auswertung", [
    ["Blickwinkel", "Frage"],
    ["Produkt", "Löst unsere Anwendung das Problem, das wir uns gestellt haben?"],
    ["Modell", "Würden wir das Datenmodell heute genauso bauen? Was fehlt?"],
    ["Technik", "Welche Entscheidung hat uns Zeit gekostet — welche gespart?"],
    ["Prozess", "Wo haben wir zu spät angefangen? Wo hat die Absprache gefehlt?"],
    ["Team", "War die Arbeit fair verteilt? Was war die größte Hilfe?"],
    ["Gesellschaft", "Wem nützt so eine Anwendung — und wem könnte sie schaden?"],
    ["Nachhaltigkeit", "Bilder, Datenmengen, Serverlast: Was ließe sich sparen?"],
], [170, 646], [
    ("Für die letzten beiden Zeilen gibt es keine Musterlösung — aber sie gehören dazu", 0),
    ("Eine **benannte Schwäche** ist kein Punktabzug, sondern ein Kompetenznachweis", 0),
], font_size=10.5, bold_cols=(0,),
   marks={(6, c): TINT_GREEN for c in range(2)} | {(7, c): TINT_GREEN for c in range(2)})

d.bullets("Die drei Sätze, die jedes Team sagen sollte", [
    ("**Das können wir jetzt**, was wir vor zehn Wochen nicht konnten: …", 0),
    ("**Das würden wir anders machen**, und zwar aus diesem Grund: …", 0),
    ("**Das ist offen geblieben** — und so würde man es lösen: …", 0),
    ("Diese drei Sätze gehören ans Ende der Präsentation **und** in die Dokumentation", 0),
    ("Sie zeigen, dass ihr euer eigenes Projekt **von außen** betrachten könnt", 0),
])

# ---------------------------------------------------------------- Kapitel 04
d.chapter(4, "Rückblick", "Ein Schuljahr Informatik in einer Tabelle")

d.table_top("Was ihr in diesem Jahr gelernt habt", [
    ["Lernbereich", "Kern", "das nehmt ihr mit"],
    ["LB 1 Datenbanken", "Modellieren und Abfragen", "ER-Modell, Normalformen, SQL"],
    ["LB 2 Algorithmen", "Strukturiert programmieren", "Folge, Auswahl, Zyklus, Funktionen"],
    ["Wahlbereich OOP", "Objekte statt Variablen", "Klasse, Vererbung, Kapselung"],
    ["LB 3A Projekt", "Alles zusammen, im Team", "HTML, CSS, HTTP, Anbindung, Sicherheit"],
], [200, 260, 356], [
    ("Der rote Faden: **modellieren, umsetzen, testen, bewerten** — in jedem Lernbereich derselbe", 0),
    ("Das Projekt hat gezeigt, dass die Bereiche **nicht getrennt** sind", 0),
], font_size=11, bold_cols=(0,))

d.bullets("Wie es weitergeht", [
    ("Ab Woche 33 beginnt die **Prüfungsphase** — Informatik liefert Werkzeuge für alle Fächer", 0),
    ("Die **Projektdokumentation** ist eine gute Vorlage für spätere Praktikums- und Facharbeiten", 0),
    ("Wer weiterarbeiten möchte: das Projekt liegt bei euch — baut es aus", 0),
    ("Für Studium und Ausbildung zählt vor allem eins: ihr habt ein Projekt **zu Ende gebracht**", 0),
    ("Und ihr wisst jetzt, wie lange die letzten zehn Prozent dauern", 0),
])

d.merksatz("Ein Projekt ist nicht fertig, wenn nichts mehr hinzuzufügen ist, "
           "sondern wenn nichts mehr wegzulassen ist.", "frei nach Saint-Exupéry")

d.bullets("Fun Facts zum Abschluss", [
    ("Rund **zwei Drittel** aller IT-Projekte überziehen Zeit oder Budget — ihr seid also in guter Gesellschaft", 0),
    ("Der **Standish-Report** untersucht das seit 1994; wichtigster Erfolgsfaktor ist nicht Technik, sondern **Kommunikation im Team**", 0),
    ("**Brooks' Gesetz**: Mehr Leute auf ein verspätetes Projekt zu setzen, macht es noch später", 0),
    ("Die erste Website der Welt ist heute ein **Denkmal** — und immer noch unter info.cern.ch erreichbar", 0),
    ("Und: Jede Anwendung, die ihr täglich benutzt, hat einmal so angefangen wie eure", 0),
])

d.bullets("Danke — und ein letzter Auftrag", [
    ("Ladet **Dokumentation**, **Quellcode** und **Tagebuch** vollständig hoch", 0),
    ("Gebt den ausgefüllten **Beobachtungsbogen** des Partnerteams ab", 0),
    ("Schreibt eure **Selbsteinschätzung** — acht Zeilen, ehrlich", 0),
    ("Und drei Sätze an den nächsten Jahrgang: **Was hättet ihr gern vorher gewusst?**", 0),
])

d.save()

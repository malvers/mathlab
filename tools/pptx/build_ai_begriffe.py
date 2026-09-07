#!/usr/bin/env python3
"""KI-Begriffe 2026 - das Vokabular, mit dem heute ueber KI geredet wird:
LLM, Token, Kontextfenster, Prompt- und Context-Engineering, RAG, Werkzeuge, Agenten."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("ai-begriffe.pptx")

d.title("Informatik — Künstliche Intelligenz", "Die Begriffe, die 2026 zählen",
        "LLM · Token · Kontextfenster · Prompt · Context · Agent · agentisch")

# ------------------------------------------------------------- Kapitel 01 ---
d.chapter(1, "Das Modell", "Was da eigentlich rechnet")

d.bullets("LLM — Large Language Model", [
    ("**LLM** = großes Sprachmodell, trainiert auf sehr viel Text", 0),
    ("Seine einzige Aufgabe: das **nächste Token** vorhersagen", 0),
    ("Kein Nachschlagewerk — das Gelernte steckt in **Milliarden Gewichten**", 0),
    ("**Generativ**: es erzeugt Text, es sucht ihn nicht heraus", 0),
    ("Gleiche Frage, andere Antwort — die Ausgabe wird **gewürfelt**", 0),
])

d.bullets("Token — die Währung der Modelle", [
    ("**Token** = das Textstück, mit dem gerechnet wird: Wort, Wortteil, Zeichen", 0),
    ("Faustregel Deutsch: **1 Wort ≈ 1,5 bis 2 Token**", 0),
    ("Alles wird in Token gemessen: **Eingabe, Ausgabe, Preis, Limit**", 0),
    ("„und“ ist ein Token, „Kontextfenster“ sind mehrere", 0),
    ("Vor der Rechnung steht immer die **Zerlegung** — der Tokenizer", 0),
])

d.bullets("Das Kontextfenster", [
    ("**Kontextfenster** = wie viel Text das Modell **gleichzeitig** sehen kann", 0),
    ("Darin steckt alles: **Systemanweisung, Verlauf, Anhänge, Antwort**", 0),
    ("Ist es voll, fällt Ältestes heraus — das Modell **vergisst**", 0),
    ("Zwischen zwei Chats bleibt nichts: jeder Start ist **bei null**", 0),
    ("Es ist ein **Arbeitsspeicher**, keine Festplatte", 0),
])

d.table_top("Wie groß Fenster geworden sind", [
    ["Jahr", "typisches Fenster", "entspricht etwa"],
    ["2020", "2 000 Token", "3 Seiten"],
    ["2022", "4 000 Token", "6 Seiten"],
    ["2023", "128 000 Token", "ein Buch"],
    ["2026", "200 000 bis 1 000 000 Token", "ein ganzes Regal"],
], [120, 380, 316], [
    ("Größer ist nicht automatisch besser: die Mitte wird **schlechter beachtet**", 0),
    ("Und jedes Token im Fenster **kostet** — bei jeder einzelnen Anfrage neu", 0),
], font_size=11, bold_cols=(0,), marks={(4, 1): TINT_GREEN})

d.bullets("Halluzination", [
    ("**Halluzination** = das Modell erfindet etwas, das **plausibel klingt**", 0),
    ("Ursache: es sagt das **wahrscheinlichste** Wort voraus, nicht das wahre", 0),
    ("Es hat keine „weiß ich nicht“-Taste — **Zuversicht ist kein Wahrheitsmaß**", 0),
    ("Typische Opfer: **Quellen, Zitate, Zahlen, Paragraphen**", 0),
    ("Gegenmittel: **Beleg mitgeben** und **nachprüfen** — nie umgekehrt", 0),
])

# ------------------------------------------------------------- Kapitel 02 ---
d.chapter(2, "Reden mit dem Modell", "Prompt und Kontext")

d.bullets("Prompt", [
    ("**Prompt** = die Anweisung an das Modell", 0),
    ("Der Prompt ist das **Programm** — nur in natürlicher Sprache geschrieben", 0),
    ("**System-Prompt**: Rolle und Regeln, gilt für das ganze Gespräch", 0),
    ("**User-Prompt**: die konkrete Aufgabe", 0),
    ("Gleiche Aufgabe, anderer Prompt = **anderes Ergebnis**", 0),
])

d.table_top("Prompt Engineering", [
    ["Technik", "Idee", "Beispiel"],
    ["Rolle setzen", "Fachperspektive erzwingen", "„Du bist Fachlehrer für Informatik“"],
    ["Beispiele zeigen", "Muster statt Erklärung", "zwei gelöste Fälle voranstellen"],
    ["Schritt für Schritt", "Zwischenschritte sichtbar machen", "„Rechne den Weg vor“"],
    ["Format vorgeben", "Ausgabe wird weiterverwertbar", "„Antworte als Tabelle“"],
    ["Abgrenzen", "ausschließen, was stört", "„Keine Einleitung“"],
], [170, 300, 346], [
    ("**Prompt Engineering** = die Kunst, die Anweisung **präzise** zu formulieren", 0),
], font_size=10.5, bold_cols=(0,))

d.bullets("Context Engineering", [
    ("**Context Engineering** = das ganze Kontextfenster **bewusst füllen**", 0),
    ("Nicht nur der Satz zählt, sondern **Daten, Werkzeuge, Verlauf, Regeln**", 0),
    ("Leitfrage: **Was muss im Fenster stehen**, damit die Aufgabe lösbar ist?", 0),
    ("Und ebenso wichtig: **Was muss raus** — Ballast kostet und lenkt ab", 0),
    ("Der Begriff hat **Prompt Engineering** seit 2025 weitgehend abgelöst", 0),
])

d.two_cols("Zwei Begriffe, ein Unterschied", [
    ("**Prompt Engineering**", 0),
    ("die einzelne Anweisung", 1),
    ("Frage: **Wie formuliere ich?**", 1),
    ("Handwerk am Satz", 1),
    ("reicht für ein Gespräch", 1),
], [
    ("**Context Engineering**", 0),
    ("das gesamte Fenster", 1),
    ("Frage: **Was weiß es gerade?**", 1),
    ("Architektur der Information", 1),
    ("nötig, sobald Agenten arbeiten", 1),
])

d.bullets("RAG — nachschlagen statt raten", [
    ("**RAG** = Retrieval-Augmented Generation: erst **suchen**, dann **antworten**", 0),
    ("Die Fundstellen wandern in den Prompt — das Modell **liest** sie dort", 0),
    ("Antwort kommt aus **mitgeliefertem Text**, nicht aus dem Gedächtnis", 0),
    ("Vorteil: **aktuell, prüfbar, mit Quelle**", 0),
    ("Technisch: Texte werden zu **Embeddings**, gesucht wird nach **Ähnlichkeit**", 0),
])

# ------------------------------------------------------------- Kapitel 03 ---
d.chapter(3, "Agenten", "Wenn das Modell handeln darf")

d.bullets("Werkzeuge — Tool Use", [
    ("**Tool Use** (Function Calling) = das Modell darf **Werkzeuge aufrufen**", 0),
    ("Es schreibt nicht die Antwort, sondern den **Aufruf**", 0),
    ("Das Programm führt aus, das Ergebnis geht **zurück ins Kontextfenster**", 0),
    ("So kann es rechnen, suchen, Dateien lesen, Mails schreiben", 0),
    ("**MCP** = offener Standard, über den Werkzeuge sich anmelden (seit 2024)", 0),
])

d.bullets("Agent", [
    ("**Agent** = Modell + Werkzeuge + **Schleife** + Ziel", 0),
    ("Es plant, handelt, **prüft das Ergebnis**, korrigiert — bis fertig", 0),
    ("Unterschied zum Chat: **mehrere Schritte ohne Rückfrage**", 0),
    ("Der Mensch setzt **Ziel und Grenzen**, nicht jeden einzelnen Schritt", 0),
    ("„Finde den Fehler und behebe ihn“ statt „Zeig mir Zeile 40“", 0),
])

d.table_top("agentisch — vier Stufen", [
    ["Stufe", "wer entscheidet den nächsten Schritt", "Beispiel"],
    ["Chat", "der Mensch, jedes Mal", "Frage → Antwort"],
    ["Workflow", "das Programm, fester Ablauf", "Text → Übersetzung → Mail"],
    ["Agent", "das Modell, im gesetzten Rahmen", "„Bau die Auswertung“"],
    ["Multi-Agent", "ein Agent verteilt an Agenten", "Rechercheteam"],
], [150, 380, 286], [
    ("**agentisch** heißt: die Reihenfolge steht **nicht vorher fest**", 0),
    ("Genau das macht es mächtig — und **schwer prüfbar**", 0),
], font_size=11, bold_cols=(0,), marks={(1, 1): TINT_GREEN, (4, 1): TINT_ORANGE})

d.bullets("Was dabei schiefgeht", [
    ("Fehler **multiplizieren** sich über viele Schritte", 0),
    ("Jeder Schritt ist ein neuer Prompt — die **Kosten** wachsen mit", 0),
    ("Das Risiko sind die **Berechtigungen**, nicht das Modell", 0),
    ("Deshalb: **Human in the Loop** an den teuren Stellen", 0),
    ("Prüfbar bleibt nur, was **protokolliert** wird", 0),
])

# ------------------------------------------------------------- Kapitel 04 ---
d.chapter(4, "Zum Nachschlagen", "Alles auf einer Folie")

d.table_top("Glossar", [
    ["Begriff", "in einem Satz"],
    ["LLM", "Sprachmodell, das das nächste Token vorhersagt"],
    ["Token", "Textstück, mit dem gerechnet und abgerechnet wird"],
    ["Kontextfenster", "wie viel Text gleichzeitig sichtbar ist"],
    ["Prompt", "die Anweisung an das Modell"],
    ["Prompt Engineering", "die Anweisung präzise formulieren"],
    ["Context Engineering", "das ganze Fenster bewusst füllen"],
    ["RAG", "erst suchen, dann aus dem Fund antworten"],
    ["Embedding", "Text als Zahlenvektor, vergleichbar gemacht"],
    ["Tool Use", "das Modell ruft Werkzeuge auf"],
    ["MCP", "Standard, über den Werkzeuge sich anmelden"],
    ["Agent", "Modell mit Werkzeugen, Schleife und Ziel"],
    ["agentisch", "die Reihenfolge steht nicht vorher fest"],
], [200, 616], None, font_size=10.5, row_h=19, bold_cols=(0,))

d.merksatz("Ein Sprachmodell weiß nichts — es kennt nur, was gerade in seinem Fenster steht. "
           "Wer das Fenster füllt, bestimmt die Antwort.")

d.save()

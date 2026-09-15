#!/usr/bin/env python3
"""Informatik 11 (BGY), Woche 11 / KW 46 (live plan): Verwaltung und Verbreitung -
Praesentationstechniken, digitale Kommunikation und Kooperation (LB 2 "Persoenliches
Informationsmanagement", Ustd. 11-12/16).

Facts line up with the worksheet HTML/inf11test-verbreitung.html (20 Aufgaben: Folien und
Handout, synchron und asynchron, gemeinsam an Dokumenten arbeiten). Chapter pictures from
Wikimedia Commons, each with its licence line on the slide.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("inf11-verbreitung.pptx")

d.title("Informatik — Grundkurs 11", "Informationen weitergeben",
        "Präsentieren, kommunizieren, gemeinsam arbeiten")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Präsentieren", "Folie, Handout, Vortrag",
          image="img/verbreitung-projektor.jpg",
          credit="Tageslichtprojektor im Klassenraum — Foto: mailer_diablo, CC BY-SA 3.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:OHP-sch.JPG")

d.bullets("Wo wir stehen", [
    ("Letzte Woche: **Quellen auswählen** — Qualität, Vertrauenswürdigkeit, Zielgruppe", 0),
    ("Wer Informationen gefunden und geprüft hat, muss sie **weitergeben**: im Vortrag, per Nachricht, im gemeinsamen Dokument", 0),
    ("Heute: Präsentationstechniken, digitale Kommunikation und Kooperation — Teams und Co.", 0),
    ("Leitfrage: Wie kommt eine Information so an, dass andere sie **verstehen und nutzen** können?", 0),
])

d.bullets("Die Folie", [
    ("Wichtigstes Ziel: Das Publikum soll die **Aussage der Folie sofort erfassen**", 0),
    ("Eine Folie hat nur wenige Sekunden Aufmerksamkeit", 0),
    ("Fließtext stört: Wer gleichzeitig **liest und zuhört**, versteht beides schlechter", 0),
    ("Deshalb Stichpunkte und Bilder auf die Folie — der ausführliche Text gehört ins **Handout**", 0),
    ("Die Folie stützt den Vortrag, sie ersetzt ihn nicht", 0),
])

d.two_cols("Folien und Handout", [
    ("**Folien**", 0),
    ("stützen den Vortrag", 1),
    ("Stichpunkte, Bilder, eine Aussage je Folie", 1),
    ("ohne den Vortrag oft unverständlich", 1),
], [
    ("**Handout**", 0),
    ("Zusammenfassung zum Mitnehmen", 1),
    ("auch ohne den Vortrag verständlich", 1),
    ("trägt die Aussagen in ganzen Sätzen — eine Seite genügt meistens", 1),
])

d.bullets("Ein Vortrag mit rotem Faden", [
    ("Bewährte Reihenfolge: **Frage aufwerfen, Weg zeigen, Ergebnis benennen**", 0),
    ("Die Frage macht neugierig und ordnet das Folgende", 0),
    ("Der Weg macht das Ergebnis nachvollziehbar — ohne Frage bleibt nur eine Aufzählung", 0),
    ("Die **letzte Folie** zeigt Kernaussage und Quellen — sie steht in der Diskussion am längsten", 0),
    ("Nur „Vielen Dank für Ihre Aufmerksamkeit“ verschenkt sie", 0),
])

d.table_top("Barrierefrei gestalten", [
    ["Maßnahme", "wem sie hilft"],
    ["ausreichender Kontrast", "allen — besonders bei Beamerlicht und Sehschwäche"],
    ["echte Überschriften", "Screenreadern: Sie navigieren an der Überschriftenstruktur"],
    ["Alternativtext für Bilder", "allen, die das Bild nicht sehen: Er wird vorgelesen"],
    ["Farbe nie als einziges Merkmal", "Menschen mit Farbfehlsichtigkeit"],
], [300, 516], [
    ("Der **Alternativtext** beschreibt kurz die Aussage des Bildes, nicht jedes Detail", 0),
    ("Rein dekorative Bilder bekommen einen **leeren** Alternativtext", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 0): TINT_ORANGE, (2, 0): TINT_GREEN, (3, 0): TINT_BLUE, (4, 0): TINT_RED})

d.bullets("Wenn die Technik streikt", [
    ("Kabel, Auflösung und Netz sind die üblichen Stolpersteine", 0),
    ("Immer vorbereiten: einen **Plan für den Ausfall**", 0),
    ("Ein Ausdruck oder die Datei auf einem Stick rettet den Termin", 0),
    ("Wer den Ausfall eingeplant hat, bleibt ruhig", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Kommunizieren", "Synchron und asynchron, Mail und Konferenz",
          image="img/verbreitung-telefon.jpg",
          credit="Telefon W48 der Deutschen Bundespost — Foto: CatalpaSpirit, CC BY-SA 4.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Telefon_W48_Schwarz.jpg")

d.table_top("Synchron oder asynchron?", [
    ["Merkmal", "synchron", "asynchron"],
    ["Zeit", "gleichzeitig", "zeitversetzt"],
    ["Beispiele", "Telefonat, Videokonferenz", "E-Mail, Forum, Kommentar im Dokument"],
    ["Stärke", "schnelle Klärung", "Zeit zum Nachdenken und Nachschlagen"],
    ["Schwäche", "alle müssen zugleich da sein, es unterbricht", "die Antwort kommt später"],
], [170, 323, 323], [
    ("Asynchron ist besser, wenn die Antwort Nachdenken braucht — für Dringendes lieber das Gespräch", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 0): TINT_BLUE, (3, 0): TINT_GREEN, (4, 0): TINT_RED})

d.bullets("Gute E-Mails", [
    ("Der **Betreff** nennt den Gegenstand und, wenn nötig, die erwartete Handlung", 0),
    ("„Frage“ sagt nichts — „Termin Projektabgabe: Rückmeldung bis Fr“ schon", 1),
    ("Name und Datum braucht der Betreff nicht — sie stehen ohnehin in den Kopfdaten", 0),
    ("**Große Anhänge** vermeiden: Sie belasten Postfächer und scheitern an Größengrenzen — besser ein Link", 0),
    ("Ergebnisse als **PDF** weitergeben: Die Darstellung bleibt auf jedem Gerät gleich", 0),
])

d.bullets("Netiquette und Videokonferenz", [
    ("**Netiquette**: Regeln für höflichen und sachlichen Umgang in digitaler Kommunikation", 0),
    ("Kein Gesetz, aber Voraussetzung für Zusammenarbeit — im Konflikt: sachlich bleiben, nicht sofort antworten", 0),
    ("Häufigste vermeidbare Störung in der Videokonferenz: **offene Mikrofone**", 0),
    ("Sie erzeugen Nebengeräusche und Rückkopplung", 1),
    ("Stummschalten als Grundeinstellung — Kopfhörer verhindern die Rückkopplung", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Zusammenarbeiten", "Ein Dokument, viele Hände",
          image="img/verbreitung-ordner.jpg",
          credit="Aktenordner im Regal — Foto: Shixart1985, CC BY 2.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Collection_of_colorful_binders_on_a_shelf_for_storing_documents_in_an_office_setting.jpg")

d.two_cols("Kopien schicken oder gemeinsam arbeiten?", [
    ("**Kopien per Mail**", 0),
    ("jede Person hat eine eigene Fassung", 1),
    ("Änderungen müssen zusammengeführt werden", 1),
    ("am Ende die Frage: Welche Fassung gilt?", 1),
], [
    ("**Kollaborativ**", 0),
    ("mehrere bearbeiten dieselbe Fassung", 1),
    ("es gibt genau eine gültige Fassung", 1),
    ("Änderungen sind sichtbar und rückverfolgbar", 1),
])

d.bullets("Versionen und Kommentare", [
    ("Die **Versionsgeschichte** zeigt, was wann geändert wurde — und kann es zurücknehmen", 0),
    ("Jeder Stand bleibt erreichbar: Versehentliche Löschungen sind kein Drama mehr", 0),
    ("Rückmeldungen als **Kommentar am Text** — so bleiben Vorschlag und Stelle zusammen", 0),
    ("Kommentare lassen sich abarbeiten und schließen", 0),
    ("Stilles Überschreiben nimmt der Autorin die Entscheidung", 0),
])

d.table_top("Ordnung im Team", [
    ["Regel", "Beispiel", "Nutzen"],
    ["Dateinamen-Schema", "2026-11-10_projektplan_v2", "auffindbar ohne Nachfragen"],
    ["Datum als JJJJ-MM-TT", "2026-11-10", "sortiert sich von selbst"],
    ["Ordnerstruktur", "nach Aufgaben, nicht zu tief", "jede Person findet, was sie braucht"],
    ["Rechte", "lesen, bearbeiten, verwalten", "jede Person sieht nur, was sie sehen darf"],
], [220, 290, 306], [
    ("Einheitlichkeit wirkt erst, **wenn alle mitmachen**", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 0): TINT_ORANGE, (2, 0): TINT_ORANGE, (3, 0): TINT_GREEN, (4, 0): TINT_BLUE})

d.table_top("Welches Werkzeug wofür?", [
    ["Ziel", "passendes Werkzeug"],
    ["schnelle Absprache im Team", "Chat oder kurzes Gespräch"],
    ["verbindliche Info an viele", "E-Mail mit klarem Betreff"],
    ["gemeinsamer Text", "geteiltes Dokument mit Versionen und Kommentaren"],
    ["Ergebnis vorstellen", "Präsentation plus Handout"],
    ["Ergebnis weitergeben", "PDF oder Link auf die abgelegte Datei"],
], [300, 516], [
    ("Plattformen wie Teams bündeln Chat, Konferenz und Dateiablage — die Regeln bleiben dieselben", 0),
], font_size=11, bold_cols=(0,))

d.merksatz("Wer Informationen weitergibt, denkt vom Empfänger her: klare Folien und ein Handout für "
           "das Publikum, der passende Kanal für die Nachricht — und eine einzige gemeinsame Fassung für das Team.")

d.bullets("Fun Facts", [
    ("Ray Tomlinson verschickte 1971 die erste E-Mail zwischen zwei Rechnern — und wählte dafür das **@**", 0),
    ("Die erste E-Mail in Deutschland kam im August 1984 an der **Universität Karlsruhe** an", 0),
    ("**PowerPoint** hieß in der Entwicklung „Presenter“ und erschien 1987 zuerst für den Macintosh", 0),
    ("Das Datumsformat **JJJJ-MM-TT** ist ein internationaler Standard: ISO 8601", 0),
])

d.bullets("Eure Aufgabe", [
    ("**Kurzpräsentation** (3 Minuten) zu einem Thema aus eurer Recherche: Frage, Weg, Ergebnis — höchstens drei Folien", 0),
    ("Legt vorher eure **Zielgruppe** fest — Mitschüler, Eltern oder Fachpublikum — und passt Sprache und Tiefe an", 0),
    ("**Werkstatt**: Folien gemeinsam in einem geteilten Dokument bauen, Rückmeldungen nur als Kommentar", 0),
    ("**Peer-Review** mit dem Feedbackbogen: Ist die Aussage jeder Folie sofort klar?", 0),
    ("Zum Schluss: **Aufgaben (20)** auf der Planseite — Lösung pro Aufgabe zum Aufklappen", 0),
])

d.save()

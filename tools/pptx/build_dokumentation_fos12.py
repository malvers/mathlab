#!/usr/bin/env python3
"""Fertigstellung: Test, Dokumentation, Generalprobe (Woche 31)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("fertigstellung-dokumentation.pptx")
P = lambda n: os.path.join(IMG, n)

d.title("Informatik — FOS 12", "Fertigstellung",
        "Restarbeiten, Projektdokumentation und Generalprobe")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Einfrieren", "Ab jetzt wird nichts Neues mehr gebaut")

d.bullets("Der wichtigste Beschluss dieser Woche", [
    ("**Funktionsstopp**: keine neuen Funktionen mehr — nur noch reparieren und aufräumen", 0),
    ("Jede neue Idee kommt auf die Liste „**hätte man noch machen können**“ für die Präsentation", 0),
    ("Wer eine Woche vor der Abgabe noch anbaut, hat am Tag der Abgabe eine Baustelle", 0),
    ("Alles, was jetzt läuft, muss am **Präsentationstag** genauso laufen", 0),
    ("Das ist keine Kapitulation, sondern **Projektmanagement** — genau das wird bewertet", 0),
])

d.table_top("Restarbeiten — Reihenfolge nach Wirkung", [
    ["Priorität", "Aufgabe", "warum zuerst"],
    ["1", "Fehler aus dem Testprotokoll beheben", "sonst fällt es in der Demo auf"],
    ["2", "Sicherheitscheckliste vollständig abhaken", "wird gezielt gefragt"],
    ["3", "Rechtschreibung und einheitliche Begriffe", "fällt jedem sofort auf"],
    ["4", "Bilder verkleinern, Ladezeit prüfen", "wirkt sofort professioneller"],
    ["5", "Quellen- und Lizenzliste vervollständigen", "Pflichtbestandteil"],
    ["6", "Kommentare im Code, tote Dateien löschen", "zeigt saubere Arbeit"],
], [110, 370, 336], [
    ("Arbeitet die Liste **von oben** ab — was unten liegen bleibt, tut am wenigsten weh", 0),
    ("Verteilt die Punkte namentlich und tragt sie mit Termin in die Aufgabenliste ein", 0),
], font_size=10.5, bold_cols=(0,), align="cll")

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Die Dokumentation", "Was abgegeben wird")

d.table_top("Gliederung der Projektdokumentation", [
    ["Kapitel", "Inhalt", "Umfang"],
    ["1 Thema und Ziel", "Worum geht es, für wen, warum dieses Thema", "½ Seite"],
    ["2 Planung", "Team, Rollen, Zeitplan, Werkzeuge", "½ Seite"],
    ["3 Problemanalyse", "Anforderungen, Ein- und Ausgaben", "1 Seite"],
    ["4 Entwurf", "ER-Modell, Schema, Anbindungsplan, Seitenstruktur", "2 Seiten"],
    ["5 Umsetzung", "verwendete Technik, wichtige Codestellen erklärt", "2 Seiten"],
    ["6 Test", "Testprotokoll, gefundene und behobene Fehler", "1–2 Seiten"],
    ["7 Sicherheit", "Checkliste mit Begründungen, Datenschutzhinweis", "1 Seite"],
    ["8 Auswertung", "Was lief gut, was nicht, was würden wir anders machen", "1 Seite"],
    ["9 Quellen", "Bilder, Texte, Codeschnipsel, KI-Nutzung", "1 Seite"],
], [160, 420, 236], [
    ("Das **Projekttagebuch** kommt als Anhang dazu — es ist der Beleg für den Prozess", 0),
    ("Kapitel 8 wird oft unterschätzt: **ehrliche Auswertung** bringt mehr Punkte als Schönfärberei", 0),
], font_size=10, bold_cols=(0,))

d.bullets("Wie ihr schreibt", [
    ("**Fachsprache** benutzen: Entitätstyp, Kardinalität, Fremdschlüssel, Verbund, Validierung", 0),
    ("**Wir-Form** und Vergangenheit: „Wir haben … entschieden, weil …“", 0),
    ("Jede **Entscheidung** mit einer Begründung — das unterscheidet Dokumentation von Bedienungsanleitung", 0),
    ("**Bilder** beschriften und im Text darauf verweisen (Abb. 3: ER-Modell)", 0),
    ("**Quellen** vollständig: Urheber, Titel, URL, Abrufdatum, Lizenz", 0),
    ("Ein Rechtschreibdurchgang von **jemand anderem** als dem Verfasser", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Die Präsentation", "Zwölf Minuten, die zählen")

d.table_top("Aufbau der Präsentation", [
    ["Teil", "Inhalt", "Zeit"],
    ["Einstieg", "Problem und Zielgruppe — warum lohnt das?", "1 Min."],
    ["Konzept", "Datenmodell und Seitenstruktur, kurz und klar", "2 Min."],
    ["Live-Demo", "der Weg eines Nutzers durch eure Seite", "4 Min."],
    ["Technik", "eine interessante Codestelle erklären", "2 Min."],
    ["Prozess", "Arbeitsteilung, Probleme, Lösungen", "2 Min."],
    ["Fazit", "Was können wir jetzt, was fehlt noch?", "1 Min."],
], [140, 480, 196], [
    ("**Alle** im Team sprechen — die Rollenverteilung wird sichtbar", 0),
    ("Die **Demo** ist das Herzstück: zeigt einen echten Ablauf, nicht jede Seite einzeln", 0),
], font_size=11, bold_cols=(0,), align="llc")

d.bullets("Regeln für die Live-Demo", [
    ("**Vorher genau festlegen**, welche Klicks in welcher Reihenfolge kommen — und üben", 0),
    ("**Testdaten vorbereiten**, die sinnvoll aussehen — keine „asdf“-Einträge", 0),
    ("**Plan B**: Screenshots oder eine Bildschirmaufnahme, falls die Technik streikt", 0),
    ("Nicht kommentieren, was man sieht — sondern **warum** es so gebaut ist", 0),
    ("Auch **einen Fehlerfall** zeigen: ungültige Eingabe wird abgewiesen. Das beeindruckt mehr als ein glatter Ablauf", 0),
])

d.table_top("Beurteilungskriterien — bekannt aus Klasse 11", [
    ["Bereich", "worauf geachtet wird"],
    ["Inhalt", "fachlich richtig, vollständig, sinnvoll ausgewählt"],
    ["Struktur", "roter Faden, erkennbarer Anfang und Schluss, Zeit eingehalten"],
    ["Sprache", "Fachbegriffe richtig benutzt, frei gesprochen, verständlich"],
    ["Medien", "Folien lesbar und knapp, Demo vorbereitet, Technik läuft"],
    ["Auftreten", "Blickkontakt, Körperhaltung, alle im Team beteiligt"],
    ["Nachfragen", "sachlich beantwortet, Grenzen ehrlich benannt"],
], [160, 656], [
    ("Wir nutzen **dieselbe** Bewertungsmatrix wie bei den Vorträgen in Klasse 11", 0),
    ("Auf **Nachfragen** kann man sich vorbereiten: Was würde ich selbst fragen?", 0),
], font_size=11, bold_cols=(0,))

# ---------------------------------------------------------------- Kapitel 04
d.chapter(4, "Generalprobe", "Einmal komplett, mit Uhr")

d.table_top("Technikcheck vor der Probe", [
    ["Prüfpunkt", "was schiefgehen kann"],
    ["Rechner und Anschluss", "Adapter fehlt, Auflösung stimmt nicht"],
    ["Projekt läuft lokal", "Server nicht gestartet, Pfad falsch"],
    ["Browserfenster vorbereitet", "Lesezeichen fehlen, falsche Zoomstufe"],
    ["Testdaten eingespielt", "leere Datenbank in der Demo"],
    ["Plan B bereit", "Screenshots nicht auf dem Rechner"],
    ["Folien auf dem Gerät", "Datei liegt nur in der Cloud, Netz fehlt"],
], [230, 586], [
    ("Alles einmal **auf dem Gerät testen**, das ihr auch am Präsentationstag benutzt", 0),
    ("Wer die Datei nur in der Cloud hat, hält irgendwann einen Vortrag über Ladebalken", 0),
], font_size=11, bold_cols=(0,), marks={(r, 1): TINT_ORANGE for r in range(1, 7)})

d.bullets("Ablauf der Generalprobe", [
    ("Vortrag **komplett** halten, mit Uhr — nicht unterbrechen, auch wenn etwas hakt", 0),
    ("Das Partnerteam schreibt mit: **Zeit**, **Verständlichkeit**, **was fehlt**", 0),
    ("Danach drei konkrete Verbesserungen festlegen — mehr nicht, sonst wird es nicht umgesetzt", 0),
    ("Zwei typische Nachfragen **üben**: „Warum diese Datenbankstruktur?“ und „Was ist unsicher an eurer Seite?“", 0),
    ("Wenn die Zeit nicht reicht: **kürzen**, nicht schneller reden", 0),
])

d.merksatz("Eine Präsentation, die einmal komplett geprobt wurde, ist eine "
           "andere Präsentation. Der Unterschied ist im Publikum sichtbar.")

d.bullets("Fun Facts: Dokumentation", [
    ("Die **Apollo-11**-Software wurde von Hand dokumentiert; Margaret Hamiltons Ausdruck war so hoch wie sie selbst", 0),
    ("**Margaret Hamilton** prägte den Begriff **Software Engineering** — zunächst als Scherz, weil niemand ihre Arbeit ernst nahm", 0),
    ("Die berühmteste Programmiererregel zur Doku: „Der Code sagt **wie**, der Kommentar sagt **warum**“", 0),
    ("Bei Vorträgen ist **Vorlesen von Folien** der am häufigsten genannte Kritikpunkt — in jeder Untersuchung", 0),
])

d.bullets("Eure Aufgabe bis zur Präsentation", [
    ("**Funktionsstopp** einhalten, Restliste von oben abarbeiten", 0),
    ("**Dokumentation** nach der Gliederung fertigstellen, inklusive Quellen und Tagebuch", 0),
    ("**Präsentation** aufbauen: Folien knapp, Demo-Ablauf festgelegt, alle sprechen", 0),
    ("**Generalprobe** mit Uhr, Rückmeldung vom Partnerteam einholen und drei Punkte verbessern", 0),
    ("**Plan B** vorbereiten: Screenshots oder Aufnahme der Demo lokal auf dem Gerät", 0),
])

d.save()

#!/usr/bin/env python3
"""Informatik 11 (BGY), live plan KW 24: Vertiefung - Digitalisierung in Gesellschaft und Beruf
(ORGA week, links to Wahlbereich 4).

Facts line up with the worksheet HTML/inf11test-digitalisierung.html (20 Aufgaben). Chapter
pictures come from Wikimedia Commons, each with its licence line on the slide.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("inf11-digitalisierung.pptx")

d.title("Informatik — Grundkurs 11", "Digitalisierung in Gesellschaft und Beruf",
        "Chancen, Risiken — und die Frage, welches Problem wir für wen lösen")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Was Digitalisierung heißt", "Vom Signal zur Transformation",
          image="img/digitalisierung-roboter.jpg",
          credit="Industrieroboter im Karosseriebau — Foto: BMW Werk Leipzig, CC BY-SA 2.0 de, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:BMW_Leipzig_MEDIA_050719_Download_Karosseriebau_max.jpg")

d.bullets("Wo wir stehen", [
    ("Letzte Woche: Präsentieren — Gestaltungsregeln und Kurzvorträge mit Feedback", 0),
    ("Heute die große Frage hinter dem ganzen Jahr: Was macht Digitalisierung mit **Gesellschaft und Beruf**?", 0),
    ("Wir beziehen Position — mit Argumenten statt Bauchgefühl", 0),
    ("Leitfrage: Wann ist Digitalisierung ein Gewinn — und **für wen**?", 0),
])

d.two_cols("Ein Wort, zwei Bedeutungen", [
    ("**Im engeren Sinn**", 0),
    ("technisch: analoge Signale in digitale Werte überführen", 1),
    ("abtasten, quantisieren, codieren", 1),
    ("kennt ihr aus Lernbereich 2", 1),
], [
    ("**Im weiteren Sinn**", 0),
    ("der gesellschaftliche Wandel", 1),
    ("Arbeit, Verwaltung und Alltag laufen über digitale Technik", 1),
    ("beide Bedeutungen **auseinanderhalten**", 1),
])

d.bullets("Digitale Transformation", [
    ("Papierakten einscannen ist Digitalisierung — aber noch **keine Transformation**", 0),
    ("**Transformation**: Abläufe, Geschäftsmodelle und Zusammenarbeit ändern sich durch digitale Technik", 0),
    ("Der Ablauf selbst wird **neu gedacht**", 0),
    ("Technik ist dabei **Auslöser, nicht Ziel**", 0),
])

d.table_top("Industrie 4.0 und digitaler Zwilling", [
    ["Begriff", "Was es ist", "Was es bringt"],
    ["Industrie 4.0", "vernetzte Maschinen, Werkstücke und Systeme", "Maschinen stimmen sich über Zustandsdaten ab"],
    ["digitaler Zwilling", "Modell eines realen Objekts oder Prozesses", "Wartung und Änderungen vorher durchspielen"],
], [180, 330, 306], [
    ("Kleine Losgrößen werden wirtschaftlich — Menschen bleiben für **Entscheidung und Störung** zuständig", 0),
    ("Der Zwilling wird **laufend mit Daten gefüttert** — und bleibt doch ein Modell, mit allen Verkürzungen", 0),
], font_size=11, bold_cols=(0,), marks={(1, 0): TINT_ORANGE, (2, 0): TINT_BLUE})

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Arbeit im Wandel", "Tätigkeiten, Kompetenzen, Rechte",
          image="img/digitalisierung-homeoffice.jpg",
          credit="Arbeitsplatz zu Hause — Foto: Free-Photos (Pixabay), CC0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Home-office-336377.jpg")

d.bullets("Was Automatisierung trifft", [
    ("Am ehesten Tätigkeiten mit viel **Wiederkehrendem und Regelbasiertem**", 0),
    ("Regelbasierte Schritte lassen sich beschreiben — und damit automatisieren", 0),
    ("Urteil, Aushandlung und Zuwendung bleiben schwierig", 0),
    ("Betroffen sind **Tätigkeiten**, nicht ganze Berufe", 0),
    ("KI **verändert Tätigkeiten** innerhalb von Berufen stärker, als sie Berufe abschafft", 0),
])

d.bullets("Wissen mit Verfallsdatum", [
    ("**Halbwertszeit des Wissens**: die Zeit, in der die Hälfte des Fachwissens veraltet ist", 0),
    ("In technischen Feldern ist sie kurz — **Grundlagen** halten viel länger als Werkzeugkenntnisse", 0),
    ("**Lebenslanges Lernen**: Weiterbildung wird regelmäßiger Teil der Arbeit", 0),
    ("Gefragt ist: Informationen **bewerten** und Zusammenarbeit **organisieren** — nicht möglichst viele Programme kennen", 0),
])

d.two_cols("Neue Formen der Arbeit", [
    ("**Homeoffice**", 0),
    ("wegfallende Wege schaffen Zeit", 1),
    ("dauernde Erreichbarkeit kostet Erholung", 1),
    ("erleichtert Vereinbarkeit — und **verwischt** die Grenze", 1),
    ("Regeln zur Erreichbarkeit entscheiden", 1),
], [
    ("**Plattformarbeit**", 0),
    ("eine Plattform vergibt Aufträge an Einzelne", 1),
    ("Beispiele: Lieferdienste, Auftragsportale", 1),
    ("sie vermittelt und bewertet, **beschäftigt aber oft nicht**", 1),
    ("offen: Absicherung und Mitbestimmung", 1),
])

d.bullets("Neue Werkzeuge im Betrieb", [
    ("Die Einführung ist **keine reine Leitungsentscheidung**", 0),
    ("Systeme, die Verhalten oder Leistung erfassen können, sind **mitbestimmungspflichtig** — der Betriebsrat redet mit", 0),
    ("**Beschäftigtendaten** sind besonders geschützt — Datenschutz gilt auch am Arbeitsplatz", 0),
    ("Frühe Beteiligung **beschleunigt** die Einführung sogar", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Chancen und Risiken", "Abwägen statt jubeln oder ablehnen",
          image="img/digitalisierung-rechenzentrum.jpg",
          credit="Serverraum eines Rechenzentrums — Foto: BalticServers.com, CC BY-SA 3.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:BalticServers_data_center.jpg")

d.two_cols("Digitale Verwaltung", [
    ("**Chance**", 0),
    ("erreichbar unabhängig von Öffnungszeiten und Wegen", 1),
    ("die Bearbeitungszeit hängt vom Verfahren dahinter ab", 1),
    ("Datenschutz wird eher strenger, nicht lockerer", 1),
], [
    ("**Risiko**", 0),
    ("wer keinen Zugang oder keine Kompetenz hat, bleibt draußen", 1),
    ("das ist die **digitale Spaltung**", 1),
    ("analoge Wege bleiben oft nötig — Barrierefreiheit und einfache Sprache helfen", 1),
])

d.bullets("Wenn Algorithmen Menschen bewerten", [
    ("Solche Systeme lernen aus **vergangenen Entscheidungen**", 0),
    ("Waren die verzerrt, übernimmt das System die **Vorurteile** — und verstärkt sie", 0),
    ("Die DSGVO: Entscheidungen mit erheblicher Wirkung dürfen nicht **allein automatisch** fallen", 0),
    ("Betroffene können eine **menschliche Prüfung** verlangen — ein Recht auf den Quelltext gibt es nicht", 0),
])

d.bullets("Umwelt und Selbstbestimmung", [
    ("Rechenzentren und Endgeräte verbrauchen **Energie und Rohstoffe** — Digitalisierung ist nicht umweltneutral", 0),
    ("Eingespartes Papier ist nur eine Seite der Rechnung; Nutzungsdauer und Auslastung entscheiden", 0),
    ("**Digitale Souveränität**: selbstbestimmt über eingesetzte Technik und eigene Daten entscheiden", 0),
    ("Es geht um Wahlfreiheit, nicht um Abschottung: **offene Standards** und die Möglichkeit zu wechseln", 0),
])

d.table_top("Chancen und Risiken im Überblick", [
    ["Bereich", "Chance", "Risiko"],
    ["Verwaltung", "rund um die Uhr erreichbar", "Ausschluss ohne Zugang"],
    ["Arbeit", "Homeoffice spart Wege", "ständige Erreichbarkeit"],
    ["Plattformen", "Aufträge schnell vermittelt", "wenig Absicherung"],
    ["Produktion", "kleine Losgrößen lohnen sich", "Routinetätigkeiten fallen weg"],
    ["Umwelt", "weniger Papier und Wege", "Energie und Rohstoffe"],
], [180, 318, 318], [
    ("Für die Debatte: Jede Position braucht **ein Argument und einen Beleg**", 0),
], font_size=11, bold_cols=(0,), marks={(0, 1): TINT_GREEN, (0, 2): TINT_RED})

d.bullets("Die richtige Haltung", [
    ("Weder Begeisterung noch Ablehnung ersetzen die **Prüfung**", 0),
    ("Zu jeder Technik gehören **Nutzen, Kosten und Nebenwirkungen**", 0),
    ("Die wichtigste Frage zuerst: **Welches Problem soll gelöst werden — und für wen?**", 0),
    ("Wer profitiert, wer trägt die Lasten? Kosten und Marktvergleich kommen danach", 0),
    ("Genau dieses Prüfen ist **informatisches Handwerk**", 0),
])

d.merksatz("Digitalisierung ist Werkzeug, nicht Ziel: Erst kommt die Frage, welches Problem sie für wen "
           "löst — dann werden Nutzen, Kosten und Nebenwirkungen abgewogen.")

d.bullets("Fun Facts", [
    ("Schon 1804 steuerte Joseph-Marie Jacquard das Muster seines Webstuhls mit **Lochkarten**", 0),
    ("Der Begriff **Industrie 4.0** wurde 2011 auf der Hannover Messe bekannt", 0),
    ("Bei **Apollo 13** (1970) spielten Fachleute am Boden die Rettung an Simulatoren durch — ein Vorläufer des digitalen Zwillings", 0),
    ("Das Recht auf menschliche Prüfung steht in **Artikel 22** der DSGVO", 0),
])

d.bullets("Eure Aufgabe", [
    ("**Positionieren**: Stellt euch zu einer These auf einer Linie auf — von voller Zustimmung bis Ablehnung — und begründet euren Platz", 0),
    ("**Podiumsdiskussion** zu einem Zeitungsartikel, mit Rollen: Beschäftigte, Betrieb, Verwaltung, Datenschutz", 0),
    ("Streitfrage: Sind Informatiksysteme nur **Werkzeug** — oder längst **Kommunikationsmittel**?", 0),
    ("**Zukunftsszenario** in Gruppen: ein Beruf eurer Wahl im Jahr 2040 — was bleibt, was ändert sich?", 0),
    ("Zum Schluss: **Aufgaben (20)** auf der Planseite — Lösung pro Aufgabe zum Aufklappen", 0),
])

d.save()

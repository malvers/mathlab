#!/usr/bin/env python3
"""Informatik 11 (BGY), Woche 31 / KW 17: Projekt Informationsmanagement - Praesentationen II
und Auswertung (LB 4 "Projekt Informationsmanagement", Ustd. 13-14/14): Rueckmeldung geben und
nehmen, Bewertungskriterien, Reflexion. Last week of LB 4 (Projektnote).

Facts line up with the worksheet HTML/inf11test-praesentieren2.html (20 Aufgaben). Chapter
pictures come from Wikimedia Commons, each with its licence line on the slide.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("inf11-praesentieren2.pptx")

d.title("Informatik — Grundkurs 11", "Rückmeldung, Bewertung, Rückblick",
        "Feedback geben und nehmen, fair bewerten, das Projekt auswerten")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Rückmeldung geben und nehmen", "Beschreiben statt werten",
          image="img/praesentieren2-dosentelefon.jpg",
          credit="Dosentelefon — Bild: Chris Potter, CC BY 2.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Chris_Potter_-_3D_Tin_Can_Phones.jpg")

d.bullets("Wo wir stehen", [
    ("Letzte Woche: die ersten Vorträge, die ersten Portfolios sind abgegeben", 0),
    ("Heute tragen die **übrigen Gruppen** vor", 0),
    ("Danach: **Bewertung** — daraus entsteht die Projektnote — und die **Auswertung**", 0),
    ("Damit ist Lernbereich 4 abgeschlossen", 0),
    ("Leitfrage der Stunde: Was nehmt ihr aus dem Projekt **fürs nächste Mal** mit?", 0),
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
    ("Grün: geschafft — Orange: **heute**, der letzte Schritt", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 1): TINT_GREEN, (2, 1): TINT_GREEN, (3, 1): TINT_GREEN, (4, 1): TINT_GREEN,
          (5, 1): TINT_GREEN, (6, 1): TINT_GREEN,
          (7, 0): TINT_ORANGE, (7, 1): TINT_ORANGE, (7, 2): TINT_ORANGE})

d.two_cols("Rückmeldung geben und nehmen", [
    ("**Geben**", 0),
    ("konkret Beobachtetes beschreiben", 1),
    ("einen Vorschlag machen", 1),
    ("zwei konkrete Punkte statt zehn allgemeine", 1),
    ("häufiger Fehler: allgemein und wohlwollend, ohne Nutzen", 1),
], [
    ("**Nehmen**", 0),
    ("zuhören", 1),
    ("nachfragen, wenn etwas unklar ist", 1),
    ("nicht sofort rechtfertigen — das beendet die Rückmeldung", 1),
    ("was ihr annehmt, entscheidet ihr später", 1),
])

d.table_top("Werten oder beschreiben?", [
    ["gesagt", "Art", "Wirkung"],
    ["Die Folien waren schlecht.", "Wertung", "nicht überprüfbar, löst Abwehr aus"],
    ["Ich habe die dritte Folie nicht lesen können.", "Beobachtung", "überprüfbar, annehmbar"],
    ["Du hast den Übergang schlecht gemacht.", "Du-Botschaft", "schreibt eine Eigenschaft zu"],
    ["Auf mich wirkte der Übergang abrupt.", "Ich-Botschaft", "die Wirkung lässt sich nicht bestreiten"],
], [390, 150, 276], [
    ("Die **Ich-Botschaft** benennt die Wirkung auf einen selbst — statt dem anderen eine Eigenschaft zuzuschreiben", 0),
    ("Die Wertung darf folgen — aber nach der Beobachtung", 0),
], font_size=11, bold_cols=(),
   marks={(1, 1): TINT_RED, (2, 1): TINT_GREEN, (3, 1): TINT_RED, (4, 1): TINT_GREEN})

d.bullets("Die Feedbackrunde", [
    ("Reihenfolge: **erst die Gruppe selbst**, dann das Publikum, **zuletzt die Lehrkraft**", 0),
    ("Die Selbsteinschätzung zuerst verhindert bloßes Zustimmen", 0),
    ("Die Lehrkraft zuletzt setzt keinen Rahmen vorweg — so kommen mehr Beobachtungen zusammen", 0),
    ("Der **Beobachtungsbogen** macht Rückmeldung konkret — danach geht er an die Gruppe", 0),
    ("Stark abweichende Rückmeldungen? Ernst nehmen und nach dem **Grund** fragen", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Fair bewerten", "Kriterien, Gewichtung, Gruppennote",
          image="img/praesentieren2-waage.jpg",
          credit="Balkenwaage — Foto: Nikodem Nijaki, CC BY-SA 3.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Balance_scale_IMGP9722.jpg")

d.bullets("Was ein faires Raster ausmacht", [
    ("Die Kriterien sind **vorher bekannt** — wer sie kennt, kann sie erfüllen", 0),
    ("Erkennbare **Abstufungen** machen die Note nachvollziehbar", 0),
    ("Nachträglich festgelegte Kriterien sind nicht fair", 0),
    ("Auch die **Gewichtung** wird vorher bekannt gegeben", 0),
    ("Ein Vortrag ist mehr als sein Inhalt: Aufbau, Medien, Vortragsweise, Umgang mit Fragen", 0),
])

d.table_top("Worauf bei der Projektnote geachtet wird", [
    ["Bereich", "worauf geachtet wird"],
    ["Inhalt", "sachlich richtig, ausreichend tief, die Leitfrage beantwortet"],
    ["Aufbau", "Motivation und Einführung, klare Gliederung, roter Faden"],
    ["Medieneinsatz", "ansprechende Folien mit Seitenzahlen, Quellen korrekt zitiert"],
    ["Vortragsweise", "frei und sicher, verständlich fürs Publikum, Zeit eingehalten"],
    ["Umgang mit Fragen", "souverän und ehrlich antworten"],
    ["Portfolio", "Projektskizze, Protokolle, Bericht mit Quellen, Eigenständigkeitserklärung"],
], [200, 616], [
    ("Die Kriterien für den Vortrag stehen in der **Bewertungsmatrix**: docalvers.de/svp/bewertungsmatrix.html", 0),
], font_size=11, bold_cols=(0,))

d.two_cols("Gruppenleistung gerecht bewerten", [
    ("**Gemeinsam**", 0),
    ("gemeinsame Anteile gemeinsam bewerten", 1),
    ("zum Beispiel Bericht, Foliensatz, Portfolio", 1),
    ("immer nur eine Gruppennote wäre nicht gerecht", 1),
], [
    ("**Einzeln**", 0),
    ("individuell zurechenbare Anteile einzeln", 1),
    ("zum Beispiel der eigene Vortragsteil", 1),
    ("die Note selbst verteilen überfordert die Gruppe", 1),
])

d.bullets("Leitfrage nicht beantwortet — gescheitert?", [
    ("Eine Gruppe konnte ihre Leitfrage nicht beantworten?", 0),
    ("Bewertet wird die **Qualität von Vorgehen und Begründung**, nicht nur das Ergebnis", 0),
    ("Auch ein begründetes Nichtergebnis ist ein Ergebnis", 0),
    ("Bewertet wird die fachliche Arbeit, nicht das Glück", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Das Projekt auswerten", "Aus Erfahrung wird Wissen",
          image="img/praesentieren2-logbuch.jpg",
          credit="Logbuch des Kriegsschiffs Medea, 1786 — A. A. Buyskes, gemeinfrei, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Page_from_the_logbook_of_the_Dutch_warship_Medea_in_1786.jpg")

d.bullets("Warum auswerten?", [
    ("Die Auswertung überführt **Erfahrung in Wissen**, das beim nächsten Mal verfügbar ist", 0),
    ("Ohne Auswertung bleibt Erfahrung zufällig", 0),
    ("Genau das ist der Kern von **Wissensmanagement** — wie in Lernbereich 2", 0),
    ("Es geht um den **Weg**, nicht um das Produkt — die Ergebnisse stehen im Bericht", 0),
])

d.table_top("Die Projektreflexion", [
    ["Frage", "Beispiel für eine gute Antwort"],
    ["Was lief gut?", "Die Aufteilung nach Teilfragen hat Doppelarbeit verhindert"],
    ["Was lief nicht gut?", "Die Auswertung der Umfrage hat viel länger gedauert als geplant"],
    ["Was machen wir nächstes Mal anders?", "Für die Auswertung doppelt so viel Zeit einplanen"],
], [300, 516], [
    ("Aus einem misslungenen Teil: die **Ursache** benennen und eine **konkrete Änderung** ableiten", 0),
    ("Schuldzuweisungen bringen niemanden weiter", 0),
    ("Der Blick nach vorn ist der wertvollste Teil", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 0): TINT_GREEN, (2, 0): TINT_RED, (3, 0): TINT_BLUE})

d.two_cols("Selbsteinschätzung und Vergleich", [
    ("**Selbsteinschätzung**", 0),
    ("macht den eigenen Anteil und den Lernzuwachs bewusst", 1),
    ("ersetzt keine Fremdbewertung", 1),
    ("Ehrlichkeit ist wichtiger als Bescheidenheit", 1),
], [
    ("**Vergleich in der Klasse**", 0),
    ("Vorgehensweisen vergleichen, nicht nur Ergebnisse", 1),
    ("aus fremden Wegen lernt man am meisten", 1),
    ("ein Ranking hilft niemandem weiter", 1),
])

d.bullets("Festhalten und redlich bleiben", [
    ("Die Auswertung **kurz und schriftlich** festhalten: die drei wichtigsten Erkenntnisse", 0),
    ("Was nicht aufgeschrieben ist, ist in vier Wochen weg", 0),
    ("Drei Punkte werden gelesen, zehn Seiten nicht", 0),
    ("Ideen aus anderen Projekten übernommen? Ebenfalls **kennzeichnen** — auch mündliche Anregungen", 0),
])

d.merksatz("Rückmeldung beschreibt konkret und macht einen Vorschlag, bewertet wird nach vorher "
           "bekannten Kriterien — und die Auswertung macht aus Erfahrung Wissen fürs nächste Projekt.")

d.bullets("Fun Facts", [
    ("**Feedback** kommt aus der Technik: Ein Teil des Ausgangs wird auf den Eingang zurückgeführt", 0),
    ("Auch das Pfeifen, wenn ein Mikrofon dem Lautsprecher zu nahe kommt, heißt **Rückkopplung** — englisch feedback", 0),
    ("Die **Ich-Botschaft** machte der US-Psychologe Thomas Gordon bekannt", 0),
    ("**Logbuch** kommt vom Log, einem Holzscheit an einer Leine: Die Knoten darin gaben der Einheit Knoten ihren Namen", 0),
])

d.bullets("Checkliste Projektabschluss", [
    ("Alle **Vorträge** gehalten, alle **Portfolios** abgegeben", 0),
    ("Die **Beobachtungsbögen** sind bei den Gruppen", 0),
    ("**Selbsteinschätzung** geschrieben: eigene Aufgaben und ihr Ergebnis", 0),
    ("**Reflexion** in der Gruppe: gut, nicht gut, nächstes Mal anders", 0),
    ("Die **drei wichtigsten Erkenntnisse** schriftlich festgehalten", 0),
])

d.bullets("Eure Aufgabe", [
    ("**Vortragende Gruppen**: vortragen, Fragen beantworten, Portfolio abgeben", 0),
    ("**Publikum**: Beobachtungsbogen führen, Rückmeldung beschreibend und mit Vorschlag", 0),
    ("**Projektauswertung** in der Gruppe: Was lief gut, was nicht, was machen wir anders?", 0),
    ("**Selbsteinschätzung** schreiben, die drei wichtigsten Erkenntnisse festhalten", 0),
    ("Zum Schluss: **Aufgaben (20)** auf der Planseite — Lösung pro Aufgabe zum Aufklappen", 0),
])

d.save()

#!/usr/bin/env python3
"""Informatik 11 (BGY), Woche 10 / KW 45 (live plan): Auswahl von Informationsquellen -
Qualitaet, Vertrauenswuerdigkeit, Zielgruppenorientierung (LB 2 "Persoenliches
Informationsmanagement", Ustd. 9-10/16).

Facts line up with the worksheet HTML/inf11test-quellenauswahl.html (20 Aufgaben: Quellen
bewerten, Statistiken lesen, Interessen erkennen). Chapter pictures from Wikimedia Commons,
each with its licence line on the slide.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("inf11-quellenauswahl.pptx")

d.title("Informatik — Grundkurs 11", "Welche Quelle passt?",
        "Qualität, Vertrauenswürdigkeit, Zielgruppe — und Zahlen kritisch lesen")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Gute Quellen erkennen", "Kriterien für ein begründetes Urteil",
          image="img/quellenauswahl-lexikon.jpg",
          credit="Fachenzyklopädie im Regal — Foto: LA2, CC BY-SA 3.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Enclib.jpg")

d.bullets("Wo wir stehen", [
    ("Vor zwei Wochen: **Recherche** — Glaubwürdigkeit an Urheber, Belegen und Aktualität prüfen", 0),
    ("Letzte Woche: **Informationssysteme** — aus falschen Eingaben werden falsche Ergebnisse", 0),
    ("Heute: aus vielen Quellen die **passende** auswählen — und das Urteil begründen", 0),
    ("Leitfrage: Fachartikel, Wikipedia, Social Media oder KI — welcher Quelle traue ich wofür?", 0),
])

d.table_top("Fünf Kriterien für eine Quelle", [
    ["Kriterium", "Prüffrage"],
    ["Autor", "Wer steht dahinter — und ist das überprüfbar?"],
    ["Absicht", "Will die Quelle informieren, überzeugen oder verkaufen?"],
    ["Beleglage", "Sind die Aussagen belegt und nachprüfbar?"],
    ["Aktualität", "Ist der Stand neu genug für meine Frage?"],
    ["Passung", "Beantwortet sie meine Frage — und passt sie zu meiner Zielgruppe?"],
], [200, 616], [
    ("Ein einzelnes Kriterium entscheidet selten — erst das **Zusammenspiel** ergibt ein Urteil", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 0): TINT_ORANGE, (2, 0): TINT_RED, (3, 0): TINT_GREEN, (4, 0): TINT_BLUE, (5, 0): TINT_ORANGE})

d.bullets("Für wen ist das geschrieben?", [
    ("**Zielgruppenorientierung**: Eine Quelle ist für einen bestimmten Leserkreis geschrieben", 0),
    ("Danach wählt sie Sprache und Tiefe — Fachaufsatz und Schülerlexikon behandeln dasselbe Thema anders", 0),
    ("Beide können richtig sein und trotzdem **nicht passen**", 0),
    ("Zur Bewertung gehört deshalb immer: Für wen ist das geschrieben — und für wen brauche ich es?", 0),
])

d.bullets("Wer bezahlt?", [
    ("Beste Frage nach der **Unabhängigkeit**: Wer bezahlt die Veröffentlichung — und welches Interesse hat er daran?", 0),
    ("Ein Hersteller wird kaum die Nachteile seines Produkts betonen", 0),
    ("**Interessenkonflikt**: Der Verfasser hat einen Vorteil davon, wie das Ergebnis ausfällt", 0),
    ("Offengelegt ist er handhabbar, verschwiegen ist er gefährlich", 0),
    ("Prüft eine Partei sich selbst, ist das **wenig** wert — sie braucht eine unabhängige Bestätigung", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Quellenarten im Vergleich", "Fachartikel, Wikipedia, Social Media, KI",
          image="img/quellenauswahl-philtrans.jpg",
          credit="Philosophical Transactions, Band 1 (1665/66) — gemeinfrei, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Philosophical_Transactions_of_the_Royal_Society_cover.jpg")

d.table_top("Vier Quellenarten", [
    ["Quellenart", "Stärke", "Vorsicht"],
    ["Fachartikel", "von Fachleuten geprüft", "schwer lesbar, oft hinter einer Bezahlschranke"],
    ["Wikipedia", "guter Überblick, Einzelnachweise", "Übersicht, nicht die Quelle selbst"],
    ["Social Media", "schnell, nah dran", "ungeprüft, oft ohne Herkunft, auf Klicks getrimmt"],
    ["KI-Antwort", "schnell, gut formuliert", "kann Fakten und Quellen erfinden, Herkunft unklar"],
], [170, 300, 346], [
    ("Für die aktuelle Rechtslage schlägt alle vier: der **Gesetzestext** auf einem amtlichen Portal", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 0): TINT_GREEN, (2, 0): TINT_BLUE, (3, 0): TINT_ORANGE, (4, 0): TINT_RED})

d.bullets("Peer Review", [
    ("**Peer Review**: Andere Fachleute prüfen einen Fachbeitrag **vor** der Veröffentlichung", 0),
    ("Die Gutachterinnen und Gutachter lesen den Beitrag anonym", 0),
    ("Sie prüfen Methode, Belege und Schlussfolgerungen", 0),
    ("Das ist kein Wahrheitsbeweis — aber eine wirksame Hürde", 0),
])

d.bullets("Zitierfähig oder nicht?", [
    ("**Zitierfähig** ist eine Quelle, die dauerhaft auffindbar ist und eine verantwortliche Herkunft nennt", 0),
    ("Bücher, Fachaufsätze und amtliche Seiten sind es — ein Chatverlauf ohne Herkunft nicht", 0),
    ("Lässt sich die Herkunft nicht klären: **nicht als Beleg verwenden**", 0),
    ("Plausibel klingen oder oft geteilt werden ersetzt die Prüfung nicht", 0),
    ("Besser eine schwächere Aussage mit sauberem Beleg", 0),
])

d.bullets("Tatsache, Meinung, Köder", [
    ("**Tatsachenbehauptung**: lässt sich überprüfen — „Der Kurs stieg um drei Prozent“", 0),
    ("**Meinung**: eine Bewertung — „Das ist eine gute Entwicklung“", 0),
    ("**Tendenziös**: wertende Wörter, fehlende Gegenargumente, einseitige Auswahl", 0),
    ("**Clickbait**: eine reißerische Überschrift, die mehr verspricht, als der Text hält", 0),
    ("Die Trefferliste sortiert nach Beliebtheit, Vorgeschichte und Bezahlung — **nicht nach Richtigkeit**", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Zahlen kritisch lesen", "Statistiken, Grafiken, Studien",
          image="img/quellenauswahl-playfair.jpg",
          credit="Liniendiagramm von William Playfair, Commercial and Political Atlas — gemeinfrei, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:1786_Playfair_-_25_Interest_of_the_national_Debt_from_the_Revolution.jpg")

d.bullets("Was eine Statistik nachprüfbar macht", [
    ("Nachprüfbar wird eine Statistik durch **Erhebungszeitraum, Stichprobe und Herausgeber**", 0),
    ("„80 Prozent sind zufrieden“ — es fehlt: **wer** befragt wurde, **wie viele** und **wann**", 0),
    (r"80 Prozent von zehn Befragten sind nur $0{,}8 \cdot 10 = 8$ Personen", 1),
    ("Kleine Stichproben zeigen **zufällige Ausschläge** — bei zwölf Befragten entscheidet der Zufall stark mit", 0),
    ("Nachkommastellen täuschen oft eine Genauigkeit vor, die nicht vorhanden ist", 0),
])

d.bullets("Grafiken, die täuschen", [
    ("Beginnt die y-Achse bei 90 statt bei 0, sehen **kleine Unterschiede dramatisch groß** aus", 0),
    ("Der abgeschnittene Bereich staucht den Maßstab: zwei Prozent Unterschied füllen das halbe Bild", 0),
    ("Die Werte ändern sich dabei nicht — nur der Eindruck", 0),
    ("Ehrlich ist das nur mit **deutlichem Hinweis** auf den Achsenschnitt", 0),
])

d.bullets("Korrelation ist nicht Kausalität", [
    ("Treten zwei Größen gemeinsam auf, belegt das **noch keine Ursache**", 0),
    ("Lehrbuchbeispiel: Storchenzahl und Geburtenzahl können gemeinsam steigen und fallen — der Storch bringt trotzdem keine Kinder", 0),
    ("Oft steckt eine **dritte Größe** dahinter", 0),
    ("Eine Ursache zeigt erst ein sauber geplanter Vergleich", 0),
])

d.bullets("Wenn Quellen sich widersprechen", [
    ("Nicht die angenehmere und nicht einfach die neuere nehmen", 0),
    ("Den Widerspruch **benennen** und prüfen, worauf die Angaben jeweils beruhen", 0),
    ("Oft messen die Quellen Verschiedenes — oder auf andere Weise", 0),
    ("Der Widerspruch ist selbst ein Ergebnis — er gehört so in die Arbeit", 0),
])

d.merksatz("Eine gute Quelle ist nicht die erste Trefferzeile, sondern die, deren Autor, Absicht, "
           "Belege und Aktualität zu meiner Frage passen — und bei Zahlen frage ich immer: wer, wie viele, wann?")

d.bullets("Fun Facts", [
    ("Die **Philosophical Transactions** erscheinen seit 1665 — die älteste naturwissenschaftliche Fachzeitschrift, die es noch gibt", 0),
    ("William Playfair erfand 1786 das **Linien-** und das **Balkendiagramm**, 1801 auch das **Kreisdiagramm**", 0),
    ("Einstein war 1936 empört, weil eine Fachzeitschrift seinen Aufsatz einem Gutachter vorlegte — der Gutachter hatte recht", 0),
    ("Fällt später ein schwerer Fehler auf, wird ein Fachartikel **zurückgezogen**: Er bleibt sichtbar, aber als ungültig markiert", 0),
])

d.bullets("Eure Aufgabe", [
    ("**Checkliste** gemeinsam entwickeln: Welche Prüffragen gehören für euch dazu? Startet mit Autor, Absicht, Beleglage, Aktualität, Passung", 0),
    ("**Quellenanalyse in Gruppen**: dieselbe Frage mit drei Quellenarten beantworten — Fachartikel oder amtliche Seite, Wikipedia, Social Media oder KI", 0),
    ("Jede Antwort mit der Checkliste bewerten: Was stimmt, was fehlt, für wen passt es?", 0),
    ("Taucht eine Zahl auf: Wer wurde befragt, wie viele, wann?", 0),
    ("Zum Schluss: **Aufgaben (20)** auf der Planseite — Lösung pro Aufgabe zum Aufklappen", 0),
])

d.save()

#!/usr/bin/env python3
"""Informatik 11 (BGY), Woche 12 / KW 47 (live plan): Publikationssysteme - Content-Management-
Systeme (LB 2 "Persoenliches Informationsmanagement", Ustd. 13-14/16).

Facts line up with the worksheet HTML/inf11test-cms.html (20 Aufgaben: Trennung von Inhalt und
Gestaltung, Rollen, Workflow, Betrieb). Chapter pictures from Wikimedia Commons, each with its
licence line on the slide.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("inf11-cms.pptx")

d.title("Informatik — Grundkurs 11", "Websites mit System",
        "Content-Management-Systeme: Inhalt, Gestaltung, Rollen, Betrieb")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Die Grundidee", "Inhalt, Struktur und Gestaltung getrennt",
          image="img/cms-setzkasten.jpg",
          credit="Setzkasten im Museum der Arbeit — Foto: Koffeeinist, CC0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Setzkasten_im_Museum_der_Arbeit.jpg")

d.bullets("Wo wir stehen", [
    ("Letzte Woche: **Informationen weitergeben** — präsentieren, kommunizieren, gemeinsam arbeiten", 0),
    ("Heute: veröffentlichen für alle — mit einem **Publikationssystem**", 0),
    ("Schulwebsite, Vereinsseite, Online-Zeitung: Viele pflegen Inhalte, kaum jemand schreibt HTML", 0),
    ("Leitfrage: Wie pflegen viele Menschen eine Website, ohne dass sie auseinanderfällt?", 0),
])

d.bullets("Was ist ein CMS?", [
    ("Ein **Content-Management-System** ist eine Software, mit der Inhalte **ohne Programmierkenntnisse** gepflegt und veröffentlicht werden", 0),
    ("Wer Inhalte pflegt, muss kein HTML schreiben", 0),
    ("Redaktion und Technik werden getrennt", 0),
    ("Die Gestaltung liegt zentral in **Vorlagen**", 0),
    ("Bekannte Beispiele: WordPress, TYPO3, Joomla, Drupal", 0),
])

d.table_top("Drei Schichten, getrennt gespeichert", [
    ["Schicht", "was dazugehört", "wo es liegt"],
    ["Inhalt", "Texte, Bilder, Termine", "in der Datenbank"],
    ["Struktur", "Menü, Seitentypen, Reihenfolge", "im Seitenbaum und in den Inhaltstypen"],
    ["Gestaltung", "Schriften, Farben, Layout", "in Vorlagen und Stylesheets"],
], [170, 318, 328], [
    ("Deshalb ändert ein neues Design **keinen einzigen Text**", 0),
    ("Und das Aussehen der ganzen Website lässt sich **an einer Stelle** ändern", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 0): TINT_ORANGE, (2, 0): TINT_GREEN, (3, 0): TINT_BLUE})

d.bullets("Templates", [
    ("Ein **Template** ist eine Vorlage, die festlegt, wie ein Inhaltstyp dargestellt wird", 0),
    ("Für Nachricht, Termin und Person gibt es je eine Vorlage", 0),
    ("Der Inhalt wird eingesetzt, die Struktur bleibt gleich — alle Seiten desselben Typs sehen gleich aus", 0),
    ("**Responsive Design**: Die Vorlage passt die Darstellung der Bildschirmgröße an — einmal zentral gelöst", 0),
])

d.two_cols("Dynamisch oder statisch?", [
    ("**Klassisches CMS**", 0),
    ("die Inhalte liegen in einer Datenbank", 1),
    ("die Seite entsteht beim Aufruf aus Datenbank und Vorlage", 1),
    ("man sagt: dynamisch erzeugt", 1),
], [
    ("**Static-Site-Generator**", 0),
    ("erzeugt vorab einmalig fertige HTML-Dateien", 1),
    ("der Server liefert nur fertige Dateien aus", 1),
    ("schnell und schwer angreifbar, aber weniger dynamisch", 1),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Rollen und Workflow", "Wer darf was, und wann geht es online?",
          image="img/cms-stempel.jpg",
          credit="Stempel im Musée de Bretagne — Foto: Alain Amet, gemeinfrei, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Tampon_encreur_-_Mus%C3%A9e_de_Bretagne_-_2004.0012.28.jpg")

d.table_top("Rollen im CMS", [
    ["Rolle", "darf"],
    ["Autor", "Beiträge anlegen und bearbeiten"],
    ["Redakteur", "Beiträge prüfen, ändern und freigeben"],
    ["Administrator", "Benutzer, Rechte, Erweiterungen und Einstellungen verwalten"],
], [220, 596], [
    ("Das **Rollen- und Rechtekonzept** legt fest, wer Inhalte anlegen, ändern oder veröffentlichen darf", 0),
    ("Nicht jede Person, die schreibt, darf auch freigeben — so bleibt die Verantwortung nachvollziehbar", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 0): TINT_GREEN, (2, 0): TINT_ORANGE, (3, 0): TINT_RED})

d.bullets("Der Workflow", [
    ("Der **Workflow** ist der festgelegte Weg eines Beitrags von der Erstellung bis zur Freigabe", 0),
    ("Typisch: **Entwurf, Prüfung, Freigabe, Veröffentlichung** — jeder Schritt hat eine zuständige Rolle", 0),
    ("Die **Vorschau** zeigt, wie der Beitrag aussehen wird, ohne ihn schon sichtbar zu machen", 0),
    ("Der **Redaktionsplan** legt fest, welche Inhalte wann von wem erscheinen", 0),
    ("So geht nichts Ungeprüftes online — und nichts erscheint doppelt oder gar nicht", 0),
])

d.bullets("Medien und Sprachen", [
    ("Die **Medienverwaltung** legt Bilder und Dokumente zentral ab — einmal gespeichert, vielfach verwendet", 0),
    ("Wird eine Datei ersetzt, ändert sich die Anzeige überall", 0),
    ("Zu jedem Bild gehören **Alternativtext** und Angaben zu **Urheber und Nutzungsrecht**", 0),
    ("**Mehrsprachigkeit**: dieselbe Seite in mehreren Sprachfassungen, einander zugeordnet", 0),
    ("Übersetzt wird redaktionell, nicht automatisch", 1),
])

d.two_cols("CMS oder Wiki?", [
    ("**CMS**", 0),
    ("Rollen steuern den Weg zur Veröffentlichung", 1),
    ("Freigabe **vor** der Veröffentlichung", 1),
    ("Beispiel: die Schulwebsite", 1),
], [
    ("**Wiki**", 0),
    ("viele schreiben gleichberechtigt", 1),
    ("offene Mitarbeit, Korrektur **danach**", 1),
    ("Beispiel: Wikipedia", 1),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Betrieb und Sicherheit", "Updates, Erweiterungen, Sicherung",
          image="img/cms-bandbibliothek.jpg",
          credit="Bandbibliothek für Datensicherungen — Foto: vaxomatic, CC BY 2.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:IBM_LTO_tape_frame.jpg")

d.bullets("Updates und Erweiterungen", [
    ("Verbreitete Systeme werden **gezielt** nach alten Fassungen mit bekannten Lücken abgesucht", 0),
    ("Deshalb gehören regelmäßige **Updates** zum Betrieb, nicht zur Kür", 0),
    ("Jede **Erweiterung** ist eine zusätzliche mögliche Sicherheitslücke", 0),
    ("Erweiterungen stammen von vielen Anbietern — nicht alle werden dauerhaft gepflegt", 0),
    ("Besser: wenige, gepflegte Erweiterungen", 0),
])

d.bullets("Datensicherung", [
    ("Die Inhalte liegen in der Datenbank — Fehler oder Angriffe können sie zerstören", 0),
    ("Gesichert werden müssen **Datenbank und hochgeladene Dateien**", 0),
    ("Eine Sicherung, die nie zurückgespielt wurde, ist ungeprüft", 0),
    ("Deshalb gehört der **Testlauf** der Wiederherstellung dazu", 0),
])

d.bullets("Headless CMS", [
    ("Ein **Headless CMS** liefert Inhalte nur über eine **Schnittstelle** — die Darstellung lässt es offen", 0),
    ("Die Ausgabe übernimmt eine App oder eine eigene Website", 0),
    ("Vorteil: Derselbe Inhalt bedient mehrere Kanäle", 0),
    ("Nachteil: Die eingebaute Seitenvorschau fehlt", 0),
])

d.bullets("Welches System passt?", [
    ("Die erste Frage lautet: **Wer soll welche Inhalte wie oft pflegen?**", 0),
    ("Das System muss zu den Menschen und Abläufen passen", 0),
    ("Ein mächtiges System ohne Redaktion bleibt leer", 0),
    ("Bekanntheit, Zahl der Erweiterungen und Kosten entscheiden erst danach", 0),
])

d.merksatz("Ein CMS trennt Inhalt, Struktur und Gestaltung: Die Inhalte liegen in der Datenbank, "
           "Vorlagen bestimmen das Aussehen, Rollen und Workflow regeln die Freigabe — Updates und Sicherungen halten es am Laufen.")

d.bullets("Fun Facts", [
    ("**WordPress** erschien 2003 — laut W3Techs läuft heute mehr als 40 Prozent aller Websites damit", 0),
    ("Die erste Website der Welt, 1991 von Tim Berners-Lee am CERN gebaut, ist noch heute unter info.cern.ch abrufbar", 0),
    ("**Wiki** kommt aus dem Hawaiischen: „wiki wiki“ heißt „schnell“ — das erste Wiki startete Ward Cunningham 1995", 0),
    ("Der Blindtext **Lorem ipsum**, der Vorlagen füllt, stammt aus einem Text von Cicero (45 v. Chr.)", 0),
])

d.bullets("Eure Aufgabe", [
    ("**Live-Demo**: Wir sehen uns ein CMS von innen an — Beitrag, Vorlage, Medienverwaltung, Rollen", 0),
    ("**Hands-on** in Partnerarbeit: eine eigene Testseite anlegen — mit Überschrift, Text und einem frei lizenzierten Bild", 0),
    ("Das Bild bekommt Alternativtext und Urheberangabe", 0),
    ("Tauscht die Rollen: Eine Person schreibt als Autor, die andere prüft und gibt als Redakteur frei", 0),
    ("Zum Schluss: **Aufgaben (20)** auf der Planseite — Lösung pro Aufgabe zum Aufklappen", 0),
])

d.save()

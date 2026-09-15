#!/usr/bin/env python3
"""Informatik 11 (BGY), Woche 8 / KW 41 (live plan): Beschaffung und Strukturierung von
Informationen - Recherche, Quellen, Glaubwuerdigkeit (LB 2 "Persoenliches Informationsmanagement",
Ustd. 5-6/16).

Facts line up with the worksheet HTML/inf11test-recherche.html (20 Aufgaben). Chapter
pictures come from Wikimedia Commons, each with its licence line on the slide.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("inf11-recherche.pptx")

d.title("Informatik — Grundkurs 11", "Recherchieren mit Plan",
        "Gezielt suchen, Quellen prüfen, sauber belegen")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Suchen mit Plan", "Frage, Suchbegriffe, Operatoren",
          image="img/recherche-lupe.jpg",
          credit="Lupe auf antikem Tisch — Foto: Stéphane Magnenat, CC BY-SA 4.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Magnifying_glass_on_antique_table.jpg")

d.bullets("Wo wir stehen", [
    ("Letzte Woche: der Kreislauf des Informationsmanagements — Bedarf klären, beschaffen, aufbereiten, nutzen, bewerten", 0),
    ("Heute geht es um den zweiten Schritt: **beschaffen** — die Recherche", 0),
    ("Suchen kann jeder. **Gut** suchen heißt: schnell finden, was stimmt", 0),
    ("Leitfrage: Wie finde ich zu meiner Frage Quellen, **denen ich trauen kann**?", 0),
])

d.bullets("Am Anfang steht die Frage", [
    ("Eine gute Recherche beginnt nicht mit der Suchmaschine, sondern mit einer **möglichst genauen Frage**", 0),
    ("Die Frage entscheidet, was überhaupt ein Treffer ist", 0),
    ("Zu ungenau: „Rechenzentren“ — genauer: „Wie viel Strom verbrauchen Rechenzentren in Deutschland?“", 0),
    ("Aus der Frage die **Suchbegriffe** ableiten: Fachwörter, Synonyme, auch englische Begriffe", 0),
    ("Zwei Minuten Nachdenken sparen eine Stunde Suchen", 0),
])

d.table_top("Suchoperatoren", [
    ["Eingabe", "Wirkung", "Beispiel"],
    ['"Wortfolge"', "sucht die Wörter genau in dieser Reihenfolge", '"digitale Souveränität"'],
    ["site:", "sucht nur auf einer Website oder Domain", "site:bildung.sachsen.de Lehrplan"],
    ["-Wort", "schließt ein Wort aus", "Jaguar -Auto"],
    ["OR", "findet Seiten mit dem einen oder dem anderen Wort", "Rechenzentrum OR Datacenter"],
    ["filetype:", "sucht nur Dateien eines Typs", "Stromverbrauch filetype:pdf"],
], [170, 336, 310], [
    ("Anführungszeichen und site: schneiden den **Beifang** am stärksten zusammen", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 0): TINT_ORANGE, (2, 0): TINT_GREEN})

d.bullets("Filterblase und Werbung", [
    ("Suchmaschinen und Netzwerke **personalisieren**: Sie zeigen bevorzugt, was zur bisherigen Nutzung passt", 0),
    ("So entsteht eine **Filterblase** — widersprechende Sichtweisen erscheinen seltener", 0),
    ("Gegenmittel: bewusst andere Quellen und Suchwege wählen", 0),
    ("Bezahlte Treffer müssen als **Anzeige** gekennzeichnet sein — auch redaktionell aussehende Texte können Werbung sein", 0),
    ("Leitfrage bei jedem Text: Wer verdient daran, dass ich das glaube?", 0),
])

d.table_top("Drei Wege zu Quellen", [
    ["Suchweg", "Stärke", "Schwäche"],
    ["Suchmaschine", "riesige Abdeckung, schnell", "ungeprüft, sortiert nach Beliebtheit"],
    ["Bibliothekskatalog", "geprüfte Bücher und Zeitschriften", "zeigt vor allem den Bestand der Bibliothek"],
    ["Fachportal, Fachdatenbank", "fachlich geprüft, meist zitierfähig", "engere Abdeckung, oft nur mit Zugang"],
], [230, 293, 293], [
    ("Kataloge und Fachdatenbanken gehören zum **Deep Web**: Die Websuche erfasst sie nicht", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 0): TINT_ORANGE, (2, 0): TINT_GREEN, (3, 0): TINT_BLUE})

d.bullets("Deep Web ist nicht Darknet", [
    ("**Deep Web**: alles, was Suchmaschinen nicht erfassen — hinter Anmeldungen oder in Datenbanken", 0),
    ("Dazu gehören Bibliothekskataloge, Fachdatenbanken, euer Schulportal", 0),
    ("Das ist ganz **legal** — nur eben nicht über die Websuche erreichbar", 0),
    ("**Darknet**: abgeschottete Netze wie Tor — dort finden sich auch illegale Angebote", 0),
    ("Für die Schule heißt das: direkt im Katalog oder im Fachportal suchen", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Quellen verstehen", "Primär, sekundär, verantwortlich",
          image="img/recherche-lesesaal.jpg",
          credit="Lesesaal der Library of Congress — Foto: Carol M. Highsmith, gemeinfrei, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:LOC_Main_Reading_Room_Highsmith.jpg")

d.two_cols("Primär- und Sekundärquellen", [
    ("**Primärquelle**", 0),
    ("die ursprüngliche Veröffentlichung", 1),
    ("stammt von denen, die die Arbeit gemacht haben", 1),
    ("Beispiele: die Studie selbst, der Gesetzestext", 1),
], [
    ("**Sekundärquelle**", 0),
    ("berichtet über eine andere Quelle", 1),
    ("erklärt und ordnet ein — kann aber verkürzen", 1),
    ("Beispiele: Zeitungsartikel über die Studie, Lexikoneintrag, Erklärvideo", 1),
])

d.bullets("Und Wikipedia?", [
    ("Ein Wikipedia-Artikel ist eine **Übersicht** — nicht die Quelle, auf der die Aussage beruht", 0),
    ("Deshalb taugt er nicht als **alleinige** Quelle für eine Facharbeit", 0),
    ("Er ist aber ein guter **Startpunkt**: Fachbegriffe, Überblick, Zusammenhänge", 0),
    ("Die Belege stehen unten in den **Einzelnachweisen** — dorthin führt der nächste Schritt", 0),
    ("Bei wichtigen Aussagen gilt: zurück zur **Primärquelle**", 0),
])

d.table_top("Woran man eine glaubwürdige Quelle erkennt", [
    ["Prüffrage", "gutes Zeichen", "Warnzeichen"],
    ["Wer steht dahinter?", "benannte, verantwortliche Person oder Einrichtung", "kein Autor, kein Impressum"],
    ["Womit belegt?", "nachvollziehbare Belege, Weg zur Primärquelle", "Behauptungen ohne Beleg"],
    ["Wie aktuell?", "Datum passt zur Frage", "kein Datum, veraltete Zahlen"],
    ["Mit welcher Absicht?", "informieren, erklären", "verkaufen, überreden"],
], [210, 330, 276], [
    ("Nichts über den Inhalt sagen: modernes Design, hoher Platz in der Trefferliste, viele Aufrufe", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 0): TINT_ORANGE, (2, 0): TINT_GREEN, (3, 0): TINT_BLUE, (4, 0): TINT_RED})

d.bullets("Das Impressum", [
    ("Das Impressum ist die **gesetzlich vorgeschriebene** Angabe, wer für eine Seite verantwortlich ist", 0),
    ("Es nennt Betreiber, Anschrift und Vertretungsberechtigte", 0),
    ("Nicht verwechseln: Es ist weder Quellenliste noch Datenschutzerklärung", 0),
    ("Fehlt es bei einem deutschen Angebot, ist das ein **Warnzeichen**", 0),
    ("Erst das Impressum macht Verantwortung greifbar — wer etwas verantwortet, ist überprüfbar", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Prüfen und belegen", "Unabhängig, aktuell, nachvollziehbar",
          image="img/recherche-lincoln.jpg",
          credit="Montage: Lincolns Kopf auf dem Körper von John C. Calhoun — gemeinfrei, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Abraham_Lincoln_LCCN2003654314.jpg")

d.bullets("Drei Seiten schreiben dasselbe", [
    ("Abschreiben vervielfacht die Aussage — **nicht den Beleg**", 0),
    ("Gehen alle drei auf dieselbe Ursprungsquelle zurück, folgt daraus: nichts", 0),
    ("Erst **unabhängige** Quellen erhöhen die Sicherheit", 0),
    ("Steht eine Behauptung nur auf einer Seite: **zurückstellen** und nach unabhängigen Belegen suchen", 0),
    ("Eine einzelne Fundstelle ist weder Beweis noch Widerlegung", 0),
])

d.bullets("Bilder prüfen, Datum lesen", [
    ("Bilder werden oft aus dem Zusammenhang gerissen — aus einem anderen Jahr, einem anderen Land", 0),
    ("Schnellster Test: die **Rückwärtssuche** nach dem Bild findet frühere Verwendungen", 0),
    ("Das **Erscheinungsdatum** entscheidet, ob die Angaben aktuell genug für die Frage sind", 0),
    ("Bei Marktzahlen zählt Aktualität, bei Definitionen weniger", 0),
    ("Eine alte Quelle kann die bessere sein — wenn sie das Original ist", 0),
])

d.bullets("Ordnen, was man gefunden hat", [
    ("Die Treffer nach der **eigenen Fragestellung** ordnen — nicht nach Datum oder Alphabet", 0),
    ("Doppelte Aussagen aus derselben Ursprungsquelle **zusammenfassen** — sie zählen nur einmal", 0),
    ("Danach wird sichtbar, wo noch **Lücken** sind", 0),
    ("Quellen zusammenführen heißt auch: fremde Gedanken **kennzeichnen** — sonst ist es ein Plagiat", 0),
])

d.bullets("Die Quellenangabe", [
    ("Für eine Internetseite gehören dazu: **Autor oder Herausgeber, Titel, URL und Abrufdatum**", 0),
    ("Herausgeber: Titel der Seite. URL, abgerufen am 12.10.2026", 1),
    ("Das **Abrufdatum**, weil sich Inhalte im Netz jederzeit ändern oder verschwinden können", 0),
    ("Autor und Titel machen die Angabe auch ohne Klick verständlich", 0),
    ("Für wichtige Belege lohnt zusätzlich ein **Archivlink**", 0),
])

d.bullets("Recherchetagebuch und Sättigung", [
    ("Das **Recherchetagebuch** notiert, wo mit welchen Begriffen gesucht wurde", 0),
    ("Es verhindert doppelte Suchen und zeigt, was noch nicht abgesucht ist", 0),
    ("Der Browserverlauf zeigt nur Klicks — **nicht die Suchstrategie**", 0),
    ("Fertig ist die Recherche, wenn neue Suchen überwiegend Bekanntes liefern und die Frage beantwortet ist", 0),
    ("Dieser Punkt heißt **Sättigung** — feste Zahlen wie „zehn Quellen“ sind willkürlich", 0),
])

d.merksatz("Gut recherchieren heißt: mit einer genauen Frage beginnen, gezielt suchen, jede Quelle "
           "auf Urheber, Belege und Aktualität prüfen — und alles so notieren, dass andere es nachprüfen können.")

d.bullets("Fun Facts", [
    ("Die erste Suchmaschine hieß **Archie** (1990) — sie durchsuchte noch keine Webseiten, sondern Dateiarchive", 0),
    ("Der Name **Google** spielt auf „Googol“ an: eine 1 mit 100 Nullen", 0),
    ("Das berühmte Lincoln-Porträt ist eine **Montage**: Lincolns Kopf sitzt auf dem Körper des Politikers John C. Calhoun", 0),
    ("Die **Wayback Machine** des Internet Archive speichert seit 1996 Webseiten — inzwischen Hunderte Milliarden", 0),
])

d.bullets("Eure Aufgabe", [
    ("**Rechercheauftrag** in Partnerarbeit: eine genaue Frage formulieren, dann mit mindestens zwei Operatoren suchen", 0),
    ("Führt dabei ein kurzes **Recherchetagebuch**: Suchort, Suchbegriffe, Ergebnis", 0),
    ("**Quellenvergleich**: drei gefundene Seiten mit dem Bewertungsraster prüfen — Urheber, Belege, Aktualität, Absicht", 0),
    ("**Auswertung im Plenum**: Welche Quelle hat gewonnen — und warum?", 0),
    ("Zum Schluss: **Aufgaben (20)** auf der Planseite — Lösung pro Aufgabe zum Aufklappen", 0),
])

d.save()

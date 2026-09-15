#!/usr/bin/env python3
"""Informatik 11 (BGY), Woche 20 / KW 2 (live plan): Praeventive Massnahmen in sozialen
Netzwerken (LB 3, Ustd. 7-8/16).

Facts line up with the worksheet HTML/inf11test-soziale-netzwerke.html (20 Aufgaben:
Datensparsamkeit, Metadaten, Cybermobbing, Empfehlungssysteme). The plan row's youth and consumer
protection gets one slide (Art. 8 DSGVO, Digital Services Act). Chapter pictures come from
Wikimedia Commons, each with its licence line on the slide.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("inf11-soziale-netzwerke.pptx")

d.title("Informatik — Grundkurs 11", "Sicher in sozialen Netzwerken",
        "Was ich preisgebe, wer mitliest — und wie ich mich und andere schütze")

d.bullets("Wo wir stehen", [
    ("Bisher: Bedrohungen und Schutzziele — meist aus Sicht von Betrieben und Schulen", 0),
    ("Heute geht es um **euch**: eure Profile, eure Fotos, eure Kontakte", 0),
    ("Soziale Netzwerke leben von Daten — die meisten davon liefert ihr **selbst**", 0),
    ("Leitfrage: Was kann jemand über mich herausfinden — und wie begrenze ich das?", 0),
])

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Was ich preisgebe", "Profile, Fotos, Metadaten",
          image="img/soziale-netzwerke-fussspuren.jpg",
          credit="Fußspuren am Strand — Foto: Annatsach, CC0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Footprints_on_the_beach_-_Nea_Peramos.jpg")

d.bullets("Einmal im Netz, immer im Netz", [
    ("Faustregel: nur veröffentlichen, was auch **in einigen Jahren** noch öffentlich sein darf", 0),
    ("Löschen ist keine Garantie: **Kopien, Screenshots und Archive** bleiben", 0),
    ("Sichtbarkeitseinstellungen ändern daran wenig — jeder Betrachter kann kopieren", 0),
    ("Deshalb wirkt Sparsamkeit **vor** dem Posten am besten", 0),
])

d.table_top("Mehr verraten als gedacht", [
    ["Was", "verrät möglicherweise"],
    ["Metadaten im Foto", "Aufnahmezeit, Gerät, oft den Aufnahmeort"],
    ["Hintergrund im Profilbild", "Schulkleidung, Gebäude, Straßenschilder"],
    ["Wohnadresse im Profil", "wo man mich im echten Leben findet"],
    ["viele kleine Angaben", "zusammen ein vollständiges Bild"],
], [300, 516], [
    ("Viele Netzwerke entfernen Metadaten beim Hochladen — aber **nicht alle**", 0),
    ("Ein neutraler Hintergrund löst das Problem mit dem Profilbild", 0),
], font_size=11, bold_cols=(0,))

d.bullets("Datenverknüpfung und Doxing", [
    ("Einzeln harmlose Angaben ergeben **verknüpft** ein Persönlichkeitsprofil", 0),
    ("Hobby hier, Schule dort, Urlaubsfoto da — zusammen weiß man, **wer, wo, wann**", 0),
    ("**Doxing**: private Daten einer Person gezielt sammeln und veröffentlichen", 0),
    ("Ziel ist meist **Einschüchterung** — Sparsamkeit und getrennte Konten erschweren es", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Konto und Kontakte", "Einstellungen in eigener Hand",
          image="img/soziale-netzwerke-tuerkette.jpg",
          credit="Türkette — Foto: Santeri Viinamäki, CC BY 4.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Door_chain.JPG")

d.bullets("Sicherheitseinstellungen prüfen", [
    ("Standardeinstellungen sind oft die **offensten**", 0),
    ("Sinnvoll für private Konten: Beiträge nur für **bestätigte Kontakte** sichtbar", 0),
    ("Alles verbergen macht das Konto sinnlos — ganz öffentlich macht es angreifbar", 0),
    ("**Zwei-Faktor-Authentisierung**: Ein gestohlenes Passwort allein reicht nicht mehr zur Übernahme", 0),
    ("Gegen Inhalte hilft sie nicht — aber gegen die häufigste Art, Konten zu übernehmen", 0),
])

d.bullets("Kontakte und Konten", [
    ("Freundschaftsanfrage von Unbekannten: Profil prüfen, **im Zweifel ablehnen**", 0),
    ("Gefälschte Profile nutzen gern **gemeinsame Kontakte** als Türöffner", 0),
    ("Private und schulische Konten **trennen** — sonst vermischen sich Inhalte und Kontakte", 0),
    ("„Mit Konto XY fortfahren“: Der Dienst erhält Daten des verknüpften Kontos", 0),
    ("Wird das Hauptkonto übernommen, fallen **alle** verknüpften Dienste mit", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Mobbing und Grooming", "Erkennen, sichern, Hilfe holen",
          image="img/soziale-netzwerke-cybermobbing.png",
          credit="Gegen Cybermobbing — Grafik: .i.s.b.e.i.g.e., CC BY-SA 4.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Against_Cyberbullying.png")

d.bullets("Cybermobbing", [
    ("**Cybermobbing**: wiederholtes Schikanieren einer Person über digitale Kanäle", 0),
    ("Kennzeichen: **Wiederholung** und ein Machtgefälle — ein einmaliger Streit ist es noch nicht", 0),
    ("Öffentlichkeit und Dauerhaftigkeit verschärfen es: Zu Hause ist nicht Schluss", 0),
    ("Erste Reaktion: **Beweise sichern** (Screenshots mit Datum) und **nicht antworten**", 0),
    ("Das eigene Konto zu löschen, vernichtet die Beweise", 0),
])

d.bullets("Hilfe holen", [
    ("**Vertrauenspersonen** in der Schule und die **Meldewege der Plattform** nutzen", 0),
    ("Bei Straftaten die **Polizei**: Beleidigung, Bedrohung und Verleumdung sind strafbar", 0),
    ("Anonym und kostenlos: die **Nummer gegen Kummer**, 116 111", 0),
    ("Wer Mobbing mitbekommt: nicht mitmachen, melden, den Betroffenen zur Seite stehen", 0),
    ("Alleinbleiben ist der schlechteste Weg", 0),
])

d.bullets("Grooming erkennen", [
    ("**Grooming**: Erwachsene knüpfen gezielt Kontakt zu Minderjährigen — mit sexueller Absicht", 0),
    ("Der Kontakt beginnt harmlos und wird schrittweise vertraulicher", 0),
    ("Warnzeichen: Bitte um **Geheimhaltung** und Wechsel in einen privaten Kanal", 0),
    ("Dann: Kontakt abbrechen, Beweise sichern, einer Vertrauensperson Bescheid sagen", 0),
    ("Gegenüber Kindern ist schon die Anbahnung übers Netz **strafbar**", 0),
])

# ---------------------------------------------------------------- Kapitel 04
d.chapter(4, "Was der Feed mir zeigt", "Empfehlungen, Empörung, Kettenbriefe",
          image="img/soziale-netzwerke-filterblase.png",
          credit="Filterblase und Echokammer — Grafik: Metalicat, CC0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Filter_bubble_versus_echo_chamber.svg")

d.bullets("Empfehlungssysteme", [
    ("Sie zeigen bevorzugt Inhalte, die zum **bisherigen Verhalten** passen", 0),
    ("Die Auswahl steuern **Verweildauer und Klicks** — Widersprechendes erscheint seltener", 0),
    ("Gemessen wird Beteiligung, **nicht Richtigkeit**", 0),
    ("Empörung erzeugt zuverlässig Reaktionen — deshalb ist Empörendes besonders sichtbar", 0),
    ("Gegenmittel: bewusst **andere Quellen** suchen und vor dem Teilen kurz prüfen", 0),
])

d.bullets("Kettenbriefe und fremde Fotos", [
    ("**Kettenbrief**: eine unbelegte Behauptung, die durch Weiterleiten Reichweite gewinnt", 0),
    ("Erkennungszeichen: der Aufruf zum **Weiterleiten** — echte Warnungen brauchen das nicht", 0),
    ("Fremde Fotos teilen: **Urheberrecht** am Bild und **Recht am eigenen Bild** der Abgebildeten", 0),
    ("Die Erlaubnis des Fotografen genügt also nicht — bei Minderjährigen fragt man auch die Eltern", 0),
])

d.bullets("Jugend- und Verbraucherschutz", [
    ("In die Datenverarbeitung solcher Dienste willigt man in Deutschland ab **16** selbst ein — jünger nur mit den Eltern", 0),
    ("Seit 2024 gilt EU-weit der **Digital Services Act**: keine Werbung für Minderjährige auf Grundlage von Profilen", 0),
    ("Sehr große Plattformen müssen einen Feed **ohne Profiling** anbieten", 0),
    ("„Kostenlos“ heißt oft: Man bezahlt mit **Daten**", 0),
])

d.merksatz("Was ich nicht veröffentliche, kann niemand missbrauchen — erst sparsam sein, dann "
           "Einstellungen prüfen, und bei Mobbing oder Grooming: Beweise sichern, Hilfe holen.")

d.bullets("Fun Facts", [
    ("Metadaten stehen im **EXIF**-Format in der Bilddatei — dort ist auch Platz für GPS-Koordinaten", 0),
    ("Das **Recht am eigenen Bild** steht im Kunsturhebergesetz von **1907** — älter als der Rundfunk", 0),
    ("Die **Wayback Machine** des Internet Archive sammelt seit 1996 öffentliche Webseiten — auch längst gelöschte", 0),
    ("**Doxing** kommt von engl. „docs“: Dokumente über jemanden ausgraben und verbreiten", 0),
])

d.bullets("Eure Aufgabe", [
    ("**Einstellungs-Check** am eigenen Smartphone: Wer sieht Beiträge, Freundesliste, Standort?", 0),
    ("Eure Daten bleiben bei euch — ihr notiert nur, **was** ihr geändert habt", 0),
    ("**Placemat** zu viert: Was schützt mich? Erst still schreiben, dann in der Mitte einigen", 0),
    ("**Plakat**: zehn Handlungsempfehlungen für Jüngere — mit Material von klicksafe", 0),
    ("Zum Schluss: **Aufgaben (20)** auf der Planseite — Lösung pro Aufgabe zum Aufklappen", 0),
])

d.save()

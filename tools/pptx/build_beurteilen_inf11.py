#!/usr/bin/env python3
"""Informatik 11 (BGY), Woche 13 / KW 48 (live plan): Beurteilen von Informationen und Medien;
rechtliche Aspekte - Urheberrecht, Datenschutz (LB 2 "Persoenliches Informationsmanagement",
Ustd. 15-16/16, last lesson of LB 2).

Facts line up with the worksheet HTML/inf11test-beurteilen.html (20 Aufgaben: Urheberrecht,
Lizenzen, Zitat und Plagiat, DSGVO, Recht am eigenen Bild). The plan row also names political
opinion forming, data security and damages/warranty, which the worksheet does not ask - one
slide each. Chapter pictures from Wikimedia Commons, licence on the slide.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("inf11-beurteilen.pptx")

d.title("Informatik — Grundkurs 11", "Medien beurteilen, Recht beachten",
        "Meinungsbildung, Urheberrecht, Datenschutz — und Fälle aus dem Alltag")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Medien beurteilen", "Chancen, Risiken, Meinungsbildung",
          image="img/beurteilen-litfass.jpg",
          credit="Litfaßsäule in Torgau — Foto: Radler59, CC BY-SA 4.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Torgau-August-Bebel-Strasse_Litfasssaeule-02.jpg")

d.bullets("Wo wir stehen", [
    ("Letzte Woche: **Content-Management-Systeme** — zu jedem Bild gehören Urheber und Nutzungsrecht", 0),
    ("Heute die letzte Stunde von **Lernbereich 2**: Medien beurteilen und das Recht dahinter", 0),
    ("Danach: Wiederholung und **Klassenarbeit 1** über Lernbereich 1 und 2", 0),
    ("Leitfrage: Was darf ich mit fremden Werken und fremden Daten tun — und was nicht?", 0),
])

d.two_cols("Chancen und Risiken des Mediengebrauchs", [
    ("**Chancen**", 0),
    ("Wissen ist für alle zugänglich", 1),
    ("jeder kann veröffentlichen und mitreden", 1),
    ("Austausch über Grenzen hinweg", 1),
    ("schnelle Warnung in Notlagen", 1),
], [
    ("**Risiken**", 0),
    ("Falschmeldungen verbreiten sich schnell", 1),
    ("Filterblase: man sieht vor allem Bestätigung", 1),
    ("Daten über uns werden gesammelt und ausgewertet", 1),
    ("Hass und Beleidigung im Netz", 1),
])

d.bullets("Digitale Medien und Meinungsbildung", [
    ("Gerade Jüngere informieren sich über Politik oft in **sozialen Netzwerken**", 0),
    ("Empfehlungssysteme zeigen, was **Aufmerksamkeit** bringt — Zuspitzung gewinnt", 0),
    ("**Filterblase**: Widersprechende Sichtweisen erscheinen seltener", 0),
    ("**Desinformation**: gezielt verbreitete Falschmeldungen, oft mit echten Bildern aus falschem Zusammenhang", 0),
    ("Gegenmittel: verschiedene Medien lesen, Quellen prüfen — erst prüfen, dann teilen", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Urheberrecht", "Werke, Lizenzen, Zitat und Plagiat",
          image="img/beurteilen-anne.jpg",
          credit="Statute of Anne (1710), das erste Urheberrechtsgesetz — gemeinfrei, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Statute_of_anne.jpg")

d.bullets("Was das Urheberrecht schützt", [
    ("Geschützt sind **persönliche geistige Schöpfungen**: Texte, Bilder, Musik, Software", 0),
    ("Geschützt ist die konkrete Gestaltung — **nicht die bloße Idee**", 0),
    ("Der Schutz entsteht **automatisch** mit der Schöpfung: Ein Foto ist im Moment der Aufnahme geschützt", 0),
    ("Keine Anmeldung, kein Register — das ©-Zeichen ist nur ein Hinweis", 0),
    ("**Gemeinfrei** wird ein Werk erst nach der Schutzfrist: in Deutschland 70 Jahre nach dem Tod des Urhebers", 0),
])

d.bullets("Nutzungsrechte", [
    ("Das Urheberrecht selbst ist in Deutschland **nicht übertragbar**", 0),
    ("Übertragen werden **Nutzungsrechte**: die Erlaubnis, ein fremdes Werk in bestimmter Weise zu verwenden", 0),
    ("einfach oder ausschließlich — begrenzt auf Zeit, Ort und Zweck", 1),
    ("Bilder aus der Suchmaschine: Die Trefferliste sagt **nichts** über die Rechte — die stehen auf der Ursprungsseite", 0),
    ("Kostenlos verfügbar heißt nicht gemeinfrei — und eine Quellenangabe ersetzt keine Erlaubnis", 0),
])

d.table_top("Creative-Commons-Bausteine", [
    ["Baustein", "steht für", "bedeutet"],
    ["BY", "Namensnennung", "den Urheber nennen — gehört zu jeder CC-Lizenz"],
    ["NC", "non-commercial", "nur nicht kommerzielle Nutzung"],
    ["ND", "no derivatives", "keine Bearbeitung"],
    ["SA", "share alike", "Weitergabe unter gleichen Bedingungen"],
], [140, 230, 446], [
    ("Auch bei CC gilt: **ohne Namensnennung** ist die Nutzung ein Verstoß", 0),
    ("Die Bilder in diesem Deck sind gemeinfrei oder frei lizenziert — deshalb steht bei jedem der Urheber", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 0): TINT_GREEN, (2, 0): TINT_ORANGE, (3, 0): TINT_RED, (4, 0): TINT_BLUE})

d.two_cols("Zitat oder Plagiat?", [
    ("**Zitat**", 0),
    ("eine fremde Stelle als **Beleg** im eigenen Werk", 1),
    ("als Zitat erkennbar, mit Quellenangabe", 1),
    ("ohne Belegfunktion keine erlaubte Übernahme", 1),
], [
    ("**Plagiat**", 0),
    ("fremde Leistung **ohne Kennzeichnung** übernommen", 1),
    ("auch sinngemäße Übernahmen müssen belegt werden", 1),
    ("ein Verstoß gegen Recht und Redlichkeit", 1),
])

d.bullets("Open Source, Unterricht, unklare Fälle", [
    ("**Open Source**: Der Quelltext ist einsehbar und darf unter den Lizenzbedingungen genutzt werden — rechtefrei ist er nicht", 0),
    ("Manche Lizenzen verlangen, Änderungen ebenfalls offenzulegen", 1),
    ("**Unterricht**: Das Gesetz erlaubt Nutzungen in engen Grenzen — für abgegrenzte Gruppen und begrenzte Anteile", 0),
    ("Eine Veröffentlichung im offenen Netz ist davon **nicht gedeckt**", 1),
    ("Rechtelage unklar? Ein Werk mit klarer freier Lizenz nehmen — oder **selbst erstellen**", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Datenschutz", "Personenbezogene Daten und die DSGVO",
          image="img/beurteilen-bverfg.jpg",
          credit="Bundesverfassungsgericht in Karlsruhe — Foto: Eisensafran, CC BY-SA 4.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Karlsruhe_-_Bundesverfassungsgericht,_Dienstsitz_Schlossbezirk_-_20190929144816.jpg")

d.bullets("Worum es beim Datenschutz geht", [
    ("Geschützt sind **personenbezogene Daten**: Angaben über Personen, die sich bestimmen lassen", 0),
    ("Auch eine **IP-Adresse** kann personenbezogen sein", 0),
    ("**Informationelle Selbstbestimmung**: das Recht, selbst über Preisgabe und Verwendung der eigenen Daten zu bestimmen", 0),
    ("Das Bundesverfassungsgericht hat es 1983 im **Volkszählungsurteil** begründet", 0),
    ("Seit 2018 gilt in der EU die **Datenschutz-Grundverordnung (DSGVO)**", 0),
])

d.table_top("Grundsätze und Rechte der DSGVO", [
    ["Stichwort", "Bedeutung"],
    ["Datenminimierung", "nur die Daten erheben, die für den Zweck nötig sind"],
    ["Einwilligung", "freiwillig, informiert und eindeutig — vorausgefüllte Kästchen sind unwirksam"],
    ["Auskunftsrecht", "Betroffene erfahren, welche Daten über sie verarbeitet werden"],
    ["weitere Rechte", "Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit"],
    ["Verarbeitungsverzeichnis", "Übersicht, welche personenbezogenen Daten zu welchem Zweck verarbeitet werden"],
], [240, 576], [
    ("Ein Newsletter braucht eine E-Mail-Adresse — keine Anschrift und kein Geburtsdatum", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 0): TINT_GREEN, (2, 0): TINT_ORANGE, (3, 0): TINT_BLUE})

d.bullets("Das Klassenfoto", [
    ("Wer fotografiert, ist **Urheber** — und darf über das Foto verfügen, aber **nicht über die Abgebildeten**", 0),
    ("Das **Recht am eigenen Bild** schützt die Personen darauf", 0),
    ("Für eine Veröffentlichung müssen die Abgebildeten **zustimmen** — bei Minderjährigen auch die Sorgeberechtigten", 0),
    ("Zwei Rechte am selben Foto: Das Urheberrecht schützt die **Aufnahme**, der Datenschutz die **abgebildeten Personen**", 0),
])

# ---------------------------------------------------------------- Kapitel 04
d.chapter(4, "Fälle einordnen", "Datensicherheit, Schaden, Gewährleistung",
          image="img/beurteilen-justitia.jpg",
          credit="Justitia im Schlossgarten Schwetzingen — Foto: Rigorius, CC BY-SA 4.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Schwetzingen_Garten_Hauptachse_Statue-Justitia_20240402_152904.jpg")

d.bullets("Datenschutz ist nicht Datensicherheit", [
    ("**Datenschutz** fragt: Darf ich diese Daten überhaupt verarbeiten?", 0),
    ("**Datensicherheit** fragt: Wie schütze ich Daten vor Verlust, Diebstahl und Manipulation?", 0),
    ("Mittel: Zugriffsrechte, starke Passwörter, Verschlüsselung, Datensicherung", 0),
    ("Die DSGVO verlangt beides: Wer Daten verarbeitet, muss sie auch **angemessen schützen**", 0),
    ("Mehr dazu in **Lernbereich 3**: IT-Sicherheit", 0),
])

d.bullets("Schaden und Gewährleistung", [
    ("Wer durch einen Datenschutzverstoß einen **Schaden** erleidet, kann **Schadensersatz** verlangen (Art. 82 DSGVO)", 0),
    ("Wer ein fremdes Werk ohne Erlaubnis nutzt, riskiert Abmahnung, Unterlassung und Schadensersatz", 0),
    ("**Gewährleistung**: Wer Geräte oder digitale Produkte kauft, hat bei Mängeln gesetzliche Rechte — in der Regel zwei Jahre", 0),
    ("Seit 2022 gehören bei digitalen Produkten auch nötige **Sicherheitsupdates** dazu", 0),
])

d.table_top("Fälle einordnen", [
    ["Fall", "betroffenes Recht", "Einschätzung"],
    ["Foto einer Mitschülerin ohne Frage auf Instagram", "Recht am eigenen Bild", "nur mit ihrer Einwilligung"],
    ["Bild aus der Bildersuche auf der Klassen-Website", "Urheberrecht", "nur mit Nutzungsrecht"],
    ["Wikipedia-Absatz ohne Quelle in der Hausarbeit", "Urheberrecht, Redlichkeit", "Plagiat"],
    ["Newsletter fragt nach Geburtsdatum und Anschrift", "Datenschutz", "gegen die Datenminimierung"],
    ["Goethe-Gedicht auf der eigenen Website", "Urheberrecht", "gemeinfrei, also erlaubt"],
], [360, 220, 236], [
    ("Erst das betroffene Recht bestimmen — dann entscheiden", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 2): TINT_ORANGE, (2, 2): TINT_ORANGE, (3, 2): TINT_RED, (4, 2): TINT_RED, (5, 2): TINT_GREEN})

d.merksatz("Fremde Werke nutze ich nur mit Erlaubnis, mit freier Lizenz oder als belegtes Zitat — "
           "fremde Daten nur, wenn es für den Zweck nötig ist und die Person einwilligt oder das Gesetz es erlaubt.")

d.bullets("Fun Facts", [
    ("Das erste Urheberrechtsgesetz ist das englische **Statute of Anne** von 1710", 0),
    ("**Micky Maus** aus „Steamboat Willie“ (1928) ist in den USA seit dem 1. Januar 2024 gemeinfrei", 0),
    ("Das **Affen-Selfie**: 2011 drückte ein Makake selbst auf den Auslöser — ein Tier kann nach US-Recht kein Urheber sein", 0),
    ("2023 verhängte Irland gegen Meta ein DSGVO-Bußgeld von **1,2 Milliarden Euro**", 0),
])

d.bullets("Eure Aufgabe", [
    ("**Expertengruppen Recht**: Urheberrecht, Datenschutz, Recht am eigenen Bild — jede Gruppe liest ihren Gesetzesauszug und erklärt ihn den anderen", 0),
    ("**Fallkarten** einordnen: Welches Recht ist betroffen? Erlaubt, erlaubt unter Bedingungen oder verboten?", 0),
    ("**Diskussion**: Wie verändern soziale Netzwerke, was wir politisch für wahr halten?", 0),
    ("Zum Schluss: **Aufgaben (20)** auf der Planseite — Lösung pro Aufgabe zum Aufklappen", 0),
])

d.save()

#!/usr/bin/env python3
"""Informatik 11 (BGY), Woche 9 / KW 44 (live plan): Arbeitsweise von Informationssystemen;
Chancen und Gefahren des technologischen Fortschritts (LB 2 "Persoenliches
Informationsmanagement", Ustd. 7-8/16).

Facts line up with the worksheet HTML/inf11test-informationssysteme.html (20 Aufgaben: EVA,
Datenqualitaet, Betrieb, Abhaengigkeit, Folgenabschaetzung). The plan row also names the
environmental side (Rechenzentren, Endgeraete) and a pro/contra debate, which the worksheet
does not ask - chapter 4 covers it briefly. Chapter pictures from Wikimedia Commons.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("inf11-informationssysteme.pptx")

d.title("Informatik — Grundkurs 11", "Wie Informationssysteme arbeiten",
        "EVA-Prinzip, sicherer Betrieb, Chancen und Gefahren")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Mehr als ein Computer", "Menschen, Technik, Organisation",
          image="img/informationssysteme-ibm1401.jpg",
          credit="IBM 1401 im Computer History Museum — Foto: ArnoldReinhold, CC BY-SA 3.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:IBM_1401_at_CHM.jpg")

d.bullets("Wo wir stehen", [
    ("Zuletzt: **Recherche** — gezielt suchen, Quellen prüfen, sauber belegen", 0),
    ("Heute der Blick aufs Ganze: Systeme, die für viele Menschen zugleich sammeln, recherchieren, produzieren und beschaffen", 0),
    ("Beispiele: Schulportal, Kassensystem, Bibliothekskatalog, Online-Shop", 0),
    ("Leitfrage: Wie arbeitet ein Informationssystem — und wer trägt die Folgen, wenn es eingeführt wird?", 0),
])

d.bullets("Was ist ein Informationssystem?", [
    ("Das **Zusammenspiel von Menschen, Technik und Organisation**, um Informationen zu verarbeiten", 0),
    ("Technik allein macht noch kein System — dazu gehören **Abläufe, Regeln und Menschen**", 0),
    ("Deshalb spricht man von einem **soziotechnischen** System", 0),
    ("Beispiel Bibliothek: Katalog und Scanner, Ausleihregeln, Personal und Leser", 0),
])

d.table_top("Das EVA-Prinzip an der Supermarktkasse", [
    ["Schritt", "was passiert", "an der Kasse"],
    ["Eingabe", "Daten kommen herein", "der Scanner liest den Strichcode"],
    ["Verarbeitung", "Daten werden verknüpft und berechnet", "Preis nachschlagen, Summe bilden"],
    ["Speicherung", "Daten werden festgehalten", "Verkauf verbuchen, Bestand senken"],
    ["Ausgabe", "das Ergebnis geht hinaus", "Anzeige und Kassenbon"],
], [180, 318, 318], [
    ("**EVA** heißt Eingabe, Verarbeitung, Ausgabe — mit der Speicherung als viertem Schritt: **EVAS**", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 0): TINT_ORANGE, (2, 0): TINT_GREEN, (3, 0): TINT_BLUE, (4, 0): TINT_RED})

d.bullets("Was Informationssysteme leisten", [
    ("Sie **sammeln** Informationen: Messwerte, Bestellungen, Anmeldungen", 0),
    ("Sie ermöglichen **Recherche**: Katalog, Suchfunktion, Auswertung", 0),
    ("Sie **produzieren** Information: Zeugnisse, Rechnungen, Statistiken", 0),
    ("Sie organisieren **Beschaffung**: Nachbestellung, wenn der Bestand sinkt", 0),
    ("Überall dasselbe Muster: Eingabe, Verarbeitung, Speicherung, Ausgabe", 0),
])

d.bullets("Garbage in, garbage out", [
    ("Die Verarbeitung prüft die **Bedeutung** der Daten nicht", 0),
    ("Fehler in der Eingabe wandern unbemerkt bis in die Auswertung", 0),
    ("Auch das beste System macht aus falschen Eingaben **nur falsche Ergebnisse**", 0),
    ("Deshalb ist **Datenqualität** entscheidend: vollständig, richtig, aktuell", 0),
    ("Kurz: garbage in, garbage out — Müll rein, Müll raus", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Verlässlich betreiben", "Verfügbarkeit, Schnittstellen, Notfälle",
          image="img/informationssysteme-server.jpg",
          credit="Server der Wikimedia Foundation — Foto: Victor Grigas, CC BY-SA 3.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Wikimedia_Foundation_Servers-8055_35.jpg")

d.bullets("Verfügbarkeit", [
    ("**Verfügbarkeit**: der Anteil der Zeit, in dem ein System nutzbar ist — meist in Prozent pro Jahr", 0),
    (r"99 Prozent klingt viel — und heißt $0{,}01 \cdot 365 \approx 3{,}7$ Tage Ausfall im Jahr", 0),
    ("Höhere Verfügbarkeit kostet **überproportional** mehr", 0),
    ("**Single Point of Failure**: eine Stelle, deren Ausfall das ganze System stilllegt — ein einziger Server, eine einzige Leitung", 0),
    ("**Redundanz**, also Ersatzwege, entschärft das", 0),
])

d.table_top("Begriffe aus dem Betrieb", [
    ["Begriff", "Bedeutung"],
    ["Schnittstelle", "legt fest, in welcher Form zwei Systeme Daten austauschen"],
    ["offener Standard", "ein Format, das mehrere Programme lesen können"],
    ["Vendor Lock-in", "Abhängigkeit von einem Anbieter, weil ein Wechsel zu teuer oder unmöglich ist"],
    ["Skalierbarkeit", "die Fähigkeit, mit wachsender Last mitzuwachsen"],
    ["Protokollierung", "macht nachvollziehbar, wer wann was getan hat"],
], [230, 586], [
    ("Offene Standards und Exportmöglichkeiten beugen dem Lock-in vor", 0),
], font_size=11, bold_cols=(0,),
   marks={(3, 0): TINT_RED})

d.bullets("Wenn es doch ausfällt", [
    ("Ausfälle lassen sich nicht ausschließen — nur **vorbereiten**", 0),
    ("Der **Notfall- oder Wiederanlaufplan** beschreibt, wie der Betrieb nach einem Ausfall geordnet weitergeht", 0),
    ("Er legt Reihenfolge, Zuständigkeit und Erreichbarkeit fest", 0),
    ("Er ersetzt die Datensicherung **nicht** — und er muss **geprobt** werden, sonst ist er nur Papier", 0),
    ("Protokolle helfen beim Aufklären — sind aber selbst schützenswerte Daten", 0),
])

d.bullets("Nicht nur Technik planen", [
    ("Ein gutes System, das niemand bedienen kann, hilft nicht", 0),
    ("Abläufe, Zuständigkeiten und Schulung entscheiden über den Erfolg mit", 0),
    ("Häufigster Stolperstein: Die Beschäftigten werden **zu spät einbezogen und geschult**", 0),
    ("Dabei kennen die, die das System nutzen sollen, die Abläufe am besten", 0),
    ("Einführung ist immer auch **Organisationsarbeit**", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Chancen und Gefahren", "Automatisierung, Abhängigkeit, Spaltung",
          image="img/informationssysteme-roboter.jpg",
          credit="Schweißroboter im Karosseriebau — Foto: BMW Werk Leipzig, CC BY-SA 2.0 de, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:BMW_Leipzig_MEDIA_050719_Download_Karosseriebau_max.jpg")

d.two_cols("Zwei Seiten derselben Technik", [
    ("**Chancen**", 0),
    ("Routineaufgaben erledigt die Maschine zuverlässiger", 1),
    ("Menschen gewinnen Zeit für Aufgaben, die Urteilsvermögen verlangen", 1),
    ("neue Aufgaben in Entwurf, Pflege und Kontrolle", 1),
], [
    ("**Gefahren**", 0),
    ("Vernetzung erhöht die Abhängigkeit", 1),
    ("ein Ausfall oder Angriff trifft viele Bereiche zugleich", 1),
    ("Fehler verschwinden nicht — sie verschieben sich in Entwurf und Pflege", 1),
])

d.bullets("Berufe im Wandel, digitale Spaltung", [
    ("**Automatisierung**: Routineanteile übernimmt die Maschine — Entscheidungsanteile bleiben beim Menschen", 0),
    ("Tätigkeiten **verschieben** sich: Neue Aufgaben entstehen, andere fallen weg — nicht nur im Büro", 0),
    ("**Digitale Spaltung**: ungleicher Zugang zu Geräten, Netz und Kompetenzen in der Gesellschaft", 0),
    ("Wer keinen Zugang hat, ist ausgeschlossen — oft fehlt nicht nur Technik, sondern auch **Wissen und Sprache**", 0),
    ("Verwaltung und Bildung müssen das mitdenken", 0),
])

d.bullets("Fortschritt ist nicht gut oder schlecht", [
    ("Technologischer Fortschritt eröffnet Möglichkeiten und schafft **zugleich neue Risiken**", 0),
    ("Gesichtserkennung findet Vermisste — und kann Menschen überwachen", 0),
    ("Deshalb ist die Bewertung eine **gesellschaftliche Aufgabe**", 0),
    ("**Folgenabschätzung** fragt vorher: Wer trägt die Nachteile, wenn das System so eingeführt wird?", 0),
    ("Diese Frage gehört an den Anfang, nicht ans Ende", 0),
])

# ---------------------------------------------------------------- Kapitel 04
d.chapter(4, "Fortschritt und Umwelt", "Was Rechenzentren und Geräte kosten",
          image="img/informationssysteme-elektroschrott.jpg",
          credit="Elektroschrott, sortiert fürs Recycling — Foto: Syced, CC0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Electronic_junk_separation_in_view_of_recycling.jpg")

d.bullets("Die Umweltseite", [
    ("Rechenzentren brauchen Strom rund um die Uhr — für die Rechner **und** für die Kühlung", 0),
    ("Weltweit verbrauchten sie 2024 etwa **1,5 Prozent** des Stroms (Internationale Energieagentur)", 0),
    ("Bei Smartphone und Laptop entsteht der größte Teil der Treibhausgase schon bei der **Herstellung**", 0),
    ("Deshalb hilft vor allem: Geräte **länger nutzen**, reparieren, weitergeben", 0),
    ("Elektroschrott enthält Wertstoffe und Schadstoffe — er gehört ins Recycling", 0),
])

d.two_cols("Stoff für die Debatte", [
    ("**Pro Fortschritt**", 0),
    ("digitale Abläufe sparen Papier und Wege", 1),
    ("Videokonferenz statt Dienstreise", 1),
    ("Sensoren und Steuerung sparen Energie beim Heizen und im Verkehr", 1),
], [
    ("**Kontra: Nachhaltigkeit**", 0),
    ("Strom- und Kühlbedarf der Rechenzentren", 1),
    ("Rohstoffe und Herstellung der Geräte, kurze Nutzungsdauer", 1),
    ("Rebound: Was effizienter wird, wird oft auch mehr genutzt", 1),
])

d.merksatz("Ein Informationssystem ist mehr als Technik: Menschen, Abläufe und Rechner arbeiten "
           "nach dem EVA-Prinzip zusammen — seine Chancen und Gefahren wägt man ab, bevor man es einführt.")

d.bullets("Fun Facts", [
    ("Die **IBM 1401** von 1959 brachte die Datenverarbeitung in die Büros — gebaut wurden mehr als 10 000 Stück", 0),
    ("Der erste Strichcode an einer Supermarktkasse wurde **1974** gescannt: eine Packung Kaugummi in Ohio", 0),
    (r"„Fünf Neunen“, also 99,999 Prozent Verfügbarkeit, erlauben nur gut **5 Minuten** Ausfall im Jahr: $0{,}00001 \cdot 525\,600 \approx 5{,}3$", 0),
    ("In Stockholm heizt die **Abwärme** von Rechenzentren über das Fernwärmenetz Wohnungen", 0),
])

d.bullets("Eure Aufgabe", [
    ("**EVA-Schaubild**: Zeichnet für ein System eurer Wahl — Schulportal, Online-Shop, Bibliothek — Eingabe, Verarbeitung, Speicherung, Ausgabe", 0),
    ("Markiert darin einen **Single Point of Failure** und schlagt einen Ersatzweg vor", 0),
    ("**Pro-Kontra-Debatte**: Fortschritt oder Nachhaltigkeit? — mit Argumenten aus einem aktuellen Zeitungsartikel", 0),
    ("Jede Seite beantwortet: **Wer trägt die Nachteile?**", 0),
    ("Zum Schluss: **Aufgaben (20)** auf der Planseite — Lösung pro Aufgabe zum Aufklappen", 0),
])

d.save()

#!/usr/bin/env python3
"""Informatik 11 (BGY), LB 3 "IT-Sicherheit und Oekologie", Ustd. 9-10/16: Strategien zur
Datensicherheit - baulich, technisch, organisatorisch, personell; Backup-Konzepte (3-2-1).

Facts line up with the worksheet HTML/inf11test-datensicherheit.html (20 Aufgaben). Chapter
pictures come from Wikimedia Commons, each with its licence line on the slide.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("inf11-datensicherheit.pptx")

d.title("Informatik — Grundkurs 11", "Datensicherheit mit System",
        "Baulich, technisch, organisatorisch, personell — und ein Backup, das im Ernstfall trägt")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Vier Gruppen", "Baulich, technisch, organisatorisch, personell",
          image="img/datensicherheit-serverraum.jpg",
          credit="Serverschränke — Foto: NOIRLab/NSF/AURA/T. Slovinský, CC BY 4.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:NOIRLab_HQ_Server_Racks_(6V6A0402-CC).jpg")

d.bullets("Wo wir stehen", [
    ("Letzte Woche: soziale Netzwerke — was ihr selbst für eure Daten tun könnt", 0),
    ("Heute der Blick einer **Organisation**: Schule, Betrieb, Verwaltung", 0),
    ("Die Schutzziele kennt ihr schon: Vertraulichkeit, Integrität, Verfügbarkeit", 0),
    ("Leitfrage: Was braucht die **Schul-IT**, damit Daten sicher sind — und reicht dafür Technik?", 0),
])

d.table_top("Vier Gruppen von Maßnahmen", [
    ["Gruppe", "worum es geht", "Beispiele"],
    ["baulich", "Räume und Gebäude", "abschließbarer Serverraum, Brandschutz, Schutz vor Wasser"],
    ["technisch", "Geräte und Programme", "Updates, Virenschutz, Firewall, Verschlüsselung"],
    ["organisatorisch", "Abläufe, Zuständigkeiten", "wer Rechte vergibt und entzieht, Backup-Plan"],
    ["personell", "Menschen und Rollen", "Schulung, Verpflichtung auf Vertraulichkeit, sorgfältige Auswahl"],
], [160, 210, 446], [
    ("Die Einteilung hilft, **keine Gruppe zu vergessen** — Technik ist nur ein Viertel davon", 0),
    ("Auch das Ausscheiden gehört dazu: Schlüssel zurück, Konten sperren — eine **personelle** Maßnahme", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 0): TINT_ORANGE, (2, 0): TINT_BLUE, (3, 0): TINT_GREEN, (4, 0): TINT_RED})

d.bullets("Warum Technik allein nicht reicht", [
    ("Der offene Serverraum entwertet die beste Firewall", 0),
    ("Der ungeschulte Mensch öffnet dem Angreifer die Tür — freiwillig", 0),
    ("Ohne Regeln bleibt Technik unkoordiniert: Wer spielt Updates ein, wer prüft das Backup?", 0),
    ("Deshalb gehören **alle vier Gruppen** zusammen — die Kette ist so stark wie ihr schwächstes Glied", 0),
])

d.bullets("Menschen und Abläufe", [
    ("**Clean Desk**: keine vertraulichen Unterlagen offen liegen lassen, Bildschirm sperren", 0),
    ("Das kostet nichts und wirkt sofort — Papier ist ein unterschätzter Weg, auf dem Daten abfließen", 0),
    ("**Homeoffice**: sichere Verbindung, Umgang mit Unterlagen, keine Einsicht durch Dritte", 0),
    ("Auch Mitbewohner sind Dritte", 1),
    ("**Dokumentieren**: Nur was aufgeschrieben ist, bleibt nachvollziehbar — auch bei Personalwechsel", 0),
])

d.bullets("Schutzbedarf zuerst", [
    ("Nicht alle Daten sind gleich schutzbedürftig", 0),
    ("**Schutzbedarfsfeststellung**: Wie schwer wäre der Schaden bei Verlust oder Offenlegung?", 0),
    ("Zeugnisnoten und Gesundheitsdaten brauchen mehr Schutz als der Speiseplan der Mensa", 0),
    ("Der Schutzbedarf bestimmt den Aufwand — er steht am **Anfang** jedes Sicherheitskonzepts", 0),
    ("Überprüft wird das Konzept **regelmäßig** und nach jeder größeren Änderung", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Zutritt, Zugang, Zugriff", "Drei Wörter, drei Ebenen",
          image="img/datensicherheit-codeschloss.jpg",
          credit="Codeschloss an einer Tür — Foto: Khrystinasnell, CC0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Key_code_lock_(cropped).jpg")

d.table_top("Drei Ebenen — oft verwechselt", [
    ["Begriff", "betrifft", "Frage", "Beispiele"],
    ["Zutritt", "Räume", "Wer darf den Serverraum betreten?", "Schloss, Chipkarte, Besucherliste"],
    ["Zugang", "Systeme", "Wer darf sich anmelden?", "Benutzerkonto, Passwort, zweiter Faktor"],
    ["Zugriff", "Daten", "Was darf man danach lesen oder ändern?", "Berechtigungskonzept, Dateirechte"],
], [120, 110, 310, 276], [
    ("Merkhilfe: **Zutritt** mit den Füßen, **Zugang** mit dem Login, **Zugriff** auf die Daten", 0),
    ("Ein sauberes Konzept regelt jede Ebene einzeln", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 0): TINT_ORANGE, (2, 0): TINT_GREEN, (3, 0): TINT_BLUE})

d.bullets("Das Berechtigungskonzept", [
    ("Es legt fest, welche **Rolle** auf welche Daten zugreifen darf", 0),
    ("Rechte hängen an Rollen, nicht an Personen — beim Rollenwechsel ändern sie sich mit", 0),
    ("**Prinzip der geringsten Rechte**: jede Rolle bekommt nur, was ihre Aufgabe erfordert", 0),
    ("Beispiel: Eine Lehrkraft trägt Noten nur in ihren eigenen Kursen ein", 0),
    ("Wer eine Aufgabe abgibt, verliert auch die Rechte dazu", 0),
])

d.bullets("Adminrechte und getrennte Netze", [
    ("Ein Programm erbt die Rechte des angemeldeten Kontos", 0),
    ("Deshalb: **Alltagskonto ohne Adminrechte** — sonst läuft Schadsoftware mit vollen Rechten", 0),
    ("**Netzsegmentierung** trennt Bereiche wie Verwaltung, Unterricht und Gäste", 0),
    ("Das **Gästenetz** bringt Besucher ins Internet, aber nicht an interne Systeme", 0),
    ("Ein befallenes Gerät kommt so nicht überall hin", 0),
])

d.bullets("Pflege im Alltag", [
    ("**Patch-Management**: Updates prüfen, verteilen und dokumentieren — geregelt statt nebenbei", 0),
    ("**Software-Inventarliste**: Schützen kann man nur, wovon man weiß, dass es läuft", 0),
    ("Wird eine neue Lücke bekannt, zeigt die Liste sofort, wer betroffen ist", 0),
    ("**VPN** für den Zugriff von außen: ein verschlüsselter Tunnel ins interne Netz", 0),
    ("Gegen Schadsoftware auf dem Gerät selbst hilft ein VPN nicht", 1),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Strom und Backup", "Damit Daten verfügbar bleiben",
          image="img/datensicherheit-bandarchiv.jpg",
          credit="Bandarchiv mit Greifarm — Foto: Derrick Coetzee, CC0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Interior_of_StorageTek_tape_library_at_NERSC_(1).jpg")

d.bullets("Strom, Hitze, Diebstahl", [
    ("**USV** (unterbrechungsfreie Stromversorgung): überbrückt Ausfälle, Server fahren geordnet herunter", 0),
    ("**Überspannungsschutz** bewahrt Geräte vor Spannungsspitzen, zum Beispiel bei Gewitter", 0),
    ("Server erzeugen Wärme — Serverräume werden **gekühlt** und überwacht", 0),
    ("**Diebstahlschutz**: verschlossene Räume, Kabelschlösser, Inventarliste", 0),
    ("Laptops mit **verschlüsselter** Festplatte: Gestohlen ist dann nur das Gerät, nicht die Daten", 0),
])

d.table_top("Die 3-2-1-Regel", [
    ["Zahl", "Regel", "schützt gegen"],
    ["3", "drei Kopien der Daten: das Original und zwei Sicherungen", "den Defekt eines Datenträgers"],
    ["2", "auf zwei verschiedenen Medien", "Fehler, die einen ganzen Medientyp treffen"],
    ["1", "eine Kopie außer Haus", "Feuer, Wasser, Diebstahl"],
], [80, 420, 316], [
    ("Gegen **Ransomware** hilft nur eine Kopie, die **getrennt** aufbewahrt wird", 0),
    ("Dauerhaft verbundene Sicherungen werden einfach mitverschlüsselt", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 0): TINT_ORANGE, (2, 0): TINT_GREEN, (3, 0): TINT_RED})

d.table_top("Drei Arten zu sichern", [
    ["Art", "was gesichert wird", "Vorteil", "Nachteil"],
    ["Vollsicherung", "jedes Mal alles", "einfach wiederherzustellen", "viel Zeit und Speicher"],
    ["differenziell", "alles seit der letzten Vollsicherung", "Voll plus letzte genügen", "wächst bis zur nächsten Vollsicherung"],
    ["inkrementell", "alles seit der letzten Sicherung", "schnell, wenig Speicher", "braucht die ganze Kette"],
], [140, 250, 196, 230], [
    ("Ein Backup zählt erst, wenn die **Wiederherstellung getestet** ist", 0),
    ("Der Sicherungsplan — was, wie oft, wohin, wer prüft — ist eine **organisatorische** Maßnahme", 0),
], font_size=11, bold_cols=(0,))

d.table_top("Fallbeispiel Schul-IT", [
    ["Befund", "Gruppe", "besser so"],
    ["Der Serverraum dient als Abstellkammer und steht oft offen", "baulich", "abschließen, Schlüssel nur für Zuständige"],
    ["Alle Lehrkräfte arbeiten mit Adminrechten", "organisatorisch", "Alltagskonten ohne Adminrechte"],
    ["Das Backup liegt auf einer USB-Platte neben dem Server", "technisch", "3-2-1: eine Kopie außer Haus"],
    ["Niemand weiß, wer die Updates einspielt", "organisatorisch", "Zuständigkeit festlegen, Patch-Plan"],
    ["Das WLAN-Passwort hängt am Schwarzen Brett", "personell", "schulen, Gästenetz einrichten"],
], [370, 150, 296], [
    ("Jeder Befund passt zu einer Gruppe — manche berühren auch zwei", 0),
], font_size=11,
   marks={(1, 1): TINT_ORANGE, (2, 1): TINT_GREEN, (3, 1): TINT_BLUE, (4, 1): TINT_GREEN, (5, 1): TINT_RED})

d.bullets("Der erste Schritt bei knappen Mitteln", [
    ("Die häufigsten Schäden entstehen an drei Stellen: **Updates, Sicherungen, Rechte**", 0),
    ("Diese drei in Ordnung zu bringen kostet vor allem Sorgfalt, nicht Geld", 0),
    ("Teure Technik ohne diese Grundlagen verpufft", 0),
    ("Danach: Schutzbedarf feststellen, Konzept aufschreiben, regelmäßig prüfen", 0),
])

d.merksatz("Datensicherheit braucht alle vier Gruppen — baulich, technisch, organisatorisch, "
           "personell. Zutritt, Zugang und Zugriff werden getrennt geregelt, und das Backup "
           "folgt der 3-2-1-Regel.")

d.bullets("Fun Facts", [
    ("1998 löschte bei Pixar ein Befehl große Teile von **Toy Story 2** — die Sicherung war unbrauchbar, gerettet hat den Film die Kopie einer Mitarbeiterin im Homeoffice", 0),
    ("Im März 2021 brannte in Straßburg ein Rechenzentrum von OVHcloud ab — wer keine Kopie außer Haus hatte, verlor Daten", 0),
    ("Der **31. März** ist der World Backup Day — der Tag vor dem 1. April", 0),
    ("Die 3-2-1-Regel wird dem Fotografen **Peter Krogh** zugeschrieben", 0),
])

d.bullets("Eure Aufgabe", [
    ("**Kategorisierungsübung**: Maßnahmenkarten den vier Gruppen zuordnen", 0),
    ("**Fallbeispiel Schul-IT** in Gruppen: Schwachstellen finden, Gruppe bestimmen, Maßnahme vorschlagen", 0),
    ("**Backup-Strategien vergleichen**: Wie sichert ihr eure eigenen Daten — erfüllt das die 3-2-1-Regel?", 0),
    ("Zum Schluss: **Aufgaben (20)** auf der Planseite — Lösung pro Aufgabe zum Aufklappen", 0),
])

d.save()

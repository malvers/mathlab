#!/usr/bin/env python3
"""Informatik 11 (BGY), LB 3 "IT-Sicherheit und Oekologie", Ustd. 11-12/16: Vertrauenswuerdigkeit
von Software; oekologisch und sozial vertraegliche Mediennutzung.

Facts line up with the worksheet HTML/inf11test-software-vertrauen.html (20 Aufgaben); the plan
row adds back doors, trojans, the economic side and a pro/contra debate. Chapter pictures come
from Wikimedia Commons, each with its licence line on the slide.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("inf11-software-vertrauen.pptx")

d.title("Informatik — Grundkurs 11", "Software, der man trauen kann",
        "Woher Programme kommen, womit wir bezahlen — und was Geräte die Umwelt kosten")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Herkunft prüfen", "Trojaner, Hintertüren, Signaturen",
          image="img/software-vertrauen-trojanisches-pferd.jpg",
          credit="Trojanisches Pferd — Gemälde von G. D. Tiepolo, gemeinfrei, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:The_Procession_of_the_Trojan_Horse_in_Troy_by_Giovanni_Domenico_Tiepolo_(cropped).jpg")

d.bullets("Wo wir stehen", [
    ("Letzte Woche: Strategien zur Datensicherheit — baulich, technisch, organisatorisch, personell", 0),
    ("Heute die Frage davor: **Welcher Software** vertrauen wir überhaupt?", 0),
    ("Dazu die Folgen digitaler Medien für Wirtschaft, Gesellschaft und Umwelt", 0),
    ("Leitfrage: Woran erkenne ich vertrauenswürdige Software — und was kostet meine Mediennutzung wirklich?", 0),
])

d.two_cols("Trojaner und Hintertür", [
    ("**Trojaner**", 0),
    ("tarnt sich als nützliches Programm", 1),
    ("enthält eine versteckte Schadfunktion", 1),
    ("der Nutzer installiert ihn selbst", 1),
    ("benannt nach dem Trojanischen Pferd", 1),
], [
    ("**Back-Door** (Hintertür)", 0),
    ("ein verborgener Zugang, der die normale Anmeldung umgeht", 1),
    ("vom Hersteller eingebaut oder von Angreifern", 1),
    ("oft von einem Trojaner nachgeladen", 1),
    ("von außen kaum zu erkennen", 1),
])

d.bullets("Woher kommt die Software?", [
    ("Vertrauenswürdig: die **Seite des Herstellers** oder das geprüfte Verzeichnis des Betriebssystems", 0),
    ("Downloadportale bündeln Installer oft mit **Zusatzsoftware**", 0),
    ("Links aus Foren oder Werbeanzeigen sind kein sicherer Weg", 0),
    ("**Prüfsumme**: zeigt, ob die Datei unverändert angekommen ist", 0),
    ("Der Vergleichswert muss aus einer anderen, sicheren Quelle stammen", 1),
])

d.bullets("Signatur und offener Quelltext", [
    ("Eine **signierte** Anwendung weist per digitaler Signatur ihre Herkunft nach", 0),
    ("Das Betriebssystem prüft beim Start: Herausgeber bekannt, Datei unverändert?", 0),
    ("Über die **Qualität** der Software sagt die Signatur nichts", 0),
    ("**Quelloffen**: Der Quelltext kann unabhängig geprüft werden", 0),
    ("Einsehbar heißt aber nicht automatisch geprüft — Fehler und Updates gibt es hier wie dort", 1),
])

d.bullets("Wenn die Quelle selbst befallen ist", [
    ("**Supply-Chain-Angriff**: Die Schadfunktion kommt mit einem Update oder einer Komponente, der man vertraut", 0),
    ("Signatur und Prüfsumme helfen dann nicht — das Paket stammt ja wirklich vom Hersteller", 0),
    ("**End of Life**: Der Hersteller liefert keine Sicherheitsupdates mehr, bekannte Lücken bleiben offen", 0),
    ("Die ehrlichste Antwort auf „Ist diese Software sicher?“: nach heutigem Stand ohne bekannte Lücken — mehr lässt sich nicht sagen", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Daten als Währung", "Apps, Werbung, Geschäftsmodelle",
          image="img/software-vertrauen-litfasssaeule.jpg",
          credit="Litfaßsäule in Düsseldorf — Foto: Dietmar Rabich, CC BY-SA 4.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:D%C3%BCsseldorf,_Litfa%C3%9Fs%C3%A4ule_--_2015_--_8222.jpg")

d.bullets("Vor der Installation einer App", [
    ("Die wichtigste Frage: **Welche Berechtigungen** verlangt sie — und wozu braucht sie diese?", 0),
    ("Eine Taschenlampen-App braucht keine Kontakte", 0),
    ("Unpassende Berechtigungen sind das deutlichste Warnzeichen — Bewertungen lassen sich kaufen", 0),
    ("**Telemetrie**: Nutzungsdaten, die eine Anwendung an den Hersteller sendet", 0),
    ("Umfang und Zweck stehen in der Datenschutzerklärung, vieles lässt sich abschalten", 1),
])

d.bullets("Womit bezahlen wir kostenlose Dienste?", [
    ("Betrieb und Entwicklung kosten Geld — bezahlt wird mit **Daten und Aufmerksamkeit** für Werbung", 0),
    ("Die Frage lautet immer: Womit verdient dieser Dienst?", 0),
    ("**Dark Pattern**: eine Gestaltung, die zu einer Entscheidung drängt, die man so nicht wollte", 0),
    ("Beispiel: „Zustimmen“ groß und bunt, „Ablehnen“ grau und versteckt", 1),
    ("**Werbeblocker** schützen vor Schadcode aus Werbenetzen — und entziehen Angeboten die Finanzierung", 0),
])

d.bullets("Wirtschaftliche Bedeutung", [
    ("Unter den wertvollsten Unternehmen der Welt sind heute überwiegend **Technologiekonzerne**", 0),
    ("Werbung ist das Kerngeschäft von Suchmaschinen und sozialen Netzwerken", 0),
    ("**Netzwerkeffekt**: Je mehr Menschen eine Plattform nutzen, desto wertvoller wird sie", 0),
    ("Wer die Aufmerksamkeit bündelt, hat Marktmacht — über Preise, Regeln und Sichtbarkeit", 0),
])

d.two_cols("Pro und Kontra", [
    ("**Pro: Meinungsvielfalt**", 0),
    ("jede und jeder kann veröffentlichen", 1),
    ("Nachrichten verbreiten sich schnell, auch aus Krisengebieten", 1),
    ("Minderheiten finden Gehör", 1),
    ("Missstände werden öffentlich", 1),
], [
    ("**Kontra: Gefahren für den Rechtsstaat**", 0),
    ("Falschmeldungen verbreiten sich oft schneller als ihre Richtigstellung", 1),
    ("Hassrede schüchtert ein und verdrängt Stimmen", 1),
    ("Desinformation kann Vertrauen in Wahlen und Gerichte beschädigen", 1),
])

d.bullets("Software in der Schule", [
    ("Zentral ist: Werden **personenbezogene Daten** verarbeitet — und auf welcher Rechtsgrundlage?", 0),
    ("**Auftragsverarbeitung**: Ein Dienstleister verarbeitet Daten im Auftrag und nach Weisung", 0),
    ("Verantwortlich bleibt die Schule — ein Vertrag regelt Zweck, Umfang und Schutzmaßnahmen", 1),
    ("**Lokal betrieben**: Die Daten bleiben im Haus, Betrieb und Sicherung trägt die Schule selbst", 0),
    ("**Cloud**: nimmt Arbeit ab und gibt Kontrolle aus der Hand — eine Abwägung, keine Glaubensfrage", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Der Fußabdruck", "Ökologisch und sozial verträglich",
          image="img/software-vertrauen-elektroschrott.jpg",
          credit="Elektroschrott — Foto: Reconrabbit, CC0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Keyboards_and_mice_in_pile_of_ewaste.jpg")

d.bullets("Wo der Fußabdruck entsteht", [
    ("Den größten Teil der Umweltlast eines Smartphones verursacht die **Herstellung**, nicht das Laden", 0),
    ("Abbau seltener Rohstoffe und Fertigung dominieren die Bilanz", 0),
    ("Ein Jahr längere Nutzung wiegt deshalb schwerer als sparsames Laden", 0),
    ("Auch Netze und Rechenzentren brauchen Strom — Streaming in hoher Auflösung überträgt mehr Daten", 0),
])

d.bullets("Länger nutzen, richtig entsorgen", [
    ("**Reparieren** und Weitergeben verlängert die Nutzungsdauer", 0),
    ("Elektrogeräte gehören **nicht in den Hausmüll** — Wertstoffhöfe und viele Händler nehmen sie zurück", 0),
    ("Aus Altgeräten lassen sich Rohstoffe zurückgewinnen — aus der Schublade nicht", 0),
    ("**Nachhaltige Software** läuft auch auf älteren Geräten und zwingt nicht zum Neukauf", 0),
    ("Software treibt den Gerätewechsel oft stärker an als Verschleiß", 1),
])

d.bullets("Sozial verträglich", [
    ("Rohstoffabbau und Fertigung finden oft unter **harten Arbeitsbedingungen** statt", 0),
    ("Auch das Moderieren von Inhalten in sozialen Netzwerken ist belastende Arbeit", 0),
    ("Siegel und Herstellerangaben geben erste Hinweise", 0),
    ("Sozial verträglich heißt: Arbeitsbedingungen bei Herstellung und Betrieb **mitdenken**", 0),
])

d.bullets("Gesundheitsbewusst nutzen", [
    ("**Bildschirmpausen**: Augen und Nacken brauchen Abwechslung — zwischendurch in die Ferne schauen", 0),
    ("Unwichtige **Benachrichtigungen abschalten** — ständige Unterbrechungen kosten Konzentration", 0),
    ("Das Handy nachts aus dem Schlafzimmer: helles Licht am Abend kann das Einschlafen stören", 0),
    ("Bewusst entscheiden, wie viel Zeit wofür — Bildschirmzeit-Funktionen helfen dabei", 0),
])

d.merksatz("Vertrauenswürdige Software kommt aus geprüfter Quelle, verlangt nur passende Rechte "
           "und bekommt Updates — und am nachhaltigsten ist ein Gerät, das lange genutzt wird.")

d.bullets("Fun Facts", [
    ("Der Name **Trojaner** ist eigentlich falsch: Im Trojanischen Pferd saßen die Griechen, nicht die Trojaner", 0),
    ("2024 wurde eine Hintertür im Werkzeug **xz** entdeckt, kurz bevor sie viele Linux-Server erreichte — aufgefallen war einem Entwickler, dass Anmeldungen rund eine halbe Sekunde zu lange dauerten", 0),
    ("2022 fielen laut UN-Bericht weltweit **62 Millionen Tonnen** Elektroschrott an — nicht einmal ein Viertel wurde nachweislich recycelt", 0),
    ("Seit Ende 2024 schreibt die EU **USB-C** als einheitlichen Ladeanschluss für neue Handys vor", 0),
])

d.bullets("Eure Aufgabe", [
    ("**Softwarevergleich** im PC-Kabinett: zwei Programme für denselben Zweck nach Kriterien bewerten — Quelle, Berechtigungen, Updates, Datenschutz, Kosten", 0),
    ("**Pro-und-Kontra-Debatte**: Stärken soziale Netzwerke die Meinungsvielfalt — oder gefährden sie den Rechtsstaat?", 0),
    ("**Digitale Nachhaltigkeit**: Wie lange nutzt ihr euer Smartphone — und was würde die Nutzung verlängern?", 0),
    ("Zum Schluss: **Aufgaben (20)** auf der Planseite — Lösung pro Aufgabe zum Aufklappen", 0),
])

d.save()

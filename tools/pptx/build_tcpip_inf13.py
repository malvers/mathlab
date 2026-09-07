#!/usr/bin/env python3
"""Informatik 13 (BGY), Woche 16 / KW 51: TCP/IP - wie kommt die Seite zum Browser?
(LB 4, Ustd. 7-8/18)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE
from flow_diagrams import pap

d = Deck("tcpip-web.pptx")
P = lambda n: os.path.join(IMG, n)

d.title("Informatik — Grundkurs 13", "Vom Namen zur Seite",
        "DNS, TCP/IP und HTTP — was zwischen Eingabe und Anzeige passiert")

d.chapter(1, "Die Reise einer Anfrage", "Sieben Schritte")

dia = pap(P("pap-webrequest-inf13.png"), 1560, 340, {
    "u": dict(pos=(180, 130), w=280, h=120, kind="io", text="URL eingeben"),
    "d": dict(pos=(540, 130), w=280, h=120, text="DNS: Name zu IP"),
    "t": dict(pos=(900, 130), w=280, h=120, text="TCP-Verbindung"),
    "h": dict(pos=(1300, 130), w=320, h=120, kind="io", text="HTTP-Request und Antwort"),
}, [("u", "d", ""), ("d", "t", ""), ("t", "h", "")], size=27)
d.picture("Vom Tippen bis zur Antwort", dia, [
    ("Danach zerlegt der Browser die Antwort und lädt **CSS, Bilder und Skripte** nach", 0),
    ("Jede dieser Nachladungen ist wieder eine **eigene Anfrage**", 0),
], width=816)

d.table_top("Die Schritte im Einzelnen", [
    ["Nr", "Schritt", "Protokoll"],
    ["1", "URL zerlegen: Schema, Host, Pfad", "—"],
    ["2", "Namen in IP-Adresse auflösen", "DNS"],
    ["3", "Verbindung zum Server aufbauen", "TCP"],
    ["4", "Verschlüsselung aushandeln", "TLS"],
    ["5", "Seite anfordern", "HTTP-Request"],
    ["6", "Antwort mit Statuscode und Inhalt", "HTTP-Response"],
    ["7", "Darstellen und Nachladen", "—"],
], [70, 480, 266], [
    ("Schritt 2 bis 4 merkt der Nutzer nicht — sie kosten aber die meiste **Zeit bis zum ersten Byte**", 0),
], font_size=10.5, bold_cols=(0,))

d.chapter(2, "HTTP", "Anfrage und Antwort im Klartext")

d.table_top("Ein Request und seine Antwort", [
    ["Request", "Response"],
    ["GET /liste.html HTTP/1.1", "HTTP/1.1 200 OK"],
    ["Host: vereine.example", "Content-Type: text/html; charset=UTF-8"],
    ["Accept: text/html", "Content-Length: 4711"],
    ["", "(Leerzeile, dann der HTML-Inhalt)"],
], [400, 416], [
    ("HTTP ist **zustandslos**: der Server erinnert sich nicht an die vorige Anfrage", 0),
    ("Deshalb gibt es **Cookies** und Sitzungen — sie tragen den Zustand mit", 0),
], font_size=11, bold_cols=(0,), mono_cols=(0, 1))

d.table_top("Die Statuscodes, die ihr kennen müsst", [
    ["Code", "heißt", "typisch bei"],
    ["200", "OK", "alles in Ordnung"],
    ["301 / 302", "Weiterleitung", "Adresse hat sich geändert"],
    ["404", "nicht gefunden", "Tippfehler im Pfad"],
    ["403", "verboten", "keine Berechtigung"],
    ["500", "Serverfehler", "Fehler im Serverprogramm"],
], [130, 250, 436], [
    ("**4xx** ist ein Fehler der **Anfrage**, **5xx** ein Fehler des **Servers**", 0),
    ("Das ist die nützlichste Faustregel bei der Fehlersuche im Webprojekt", 0),
], font_size=11, bold_cols=(0,), marks={(4, 0): TINT_ORANGE, (6, 0): TINT_RED})

d.chapter(3, "DNS und URL", "Vom Namen zur Adresse")

d.table_top("Eine URL zerlegt", [
    ["Teil", "Beispiel", "sagt"],
    ["Schema", "https", "welches Protokoll"],
    ["Host", "vereine.example", "welcher Rechner"],
    ["Port", "(443)", "welcher Dienst dort"],
    ["Pfad", "/liste.html", "welche Ressource"],
    ["Query", "?ort=Dresden", "welche Parameter"],
], [130, 250, 436], [
    ("**DNS** ist ein weltweit verteiltes Verzeichnis — es beantwortet nur die Frage Name zu IP", 0),
    ("Antworten werden **zwischengespeichert**, deshalb wirken Änderungen verzögert", 0),
], font_size=11, bold_cols=(0,), mono_cols=(1,))

d.merksatz("HTTP ist zustandslos: Jede Anfrage steht für sich. "
           "4xx ist euer Fehler, 5xx der des Servers.")

d.bullets("Fun Facts: Web und Netz", [
    ("**HTTP/1.1** stammt von 1997 und wird noch überall gesprochen — HTTP/2 und /3 kamen 2015 und 2022", 0),
    ("Der Statuscode **418 I'm a teapot** stammt aus einem Aprilscherz von 1998 und existiert wirklich", 0),
    ("**DNS** heißt oft „das Telefonbuch des Internets“ — es ist eher ein verteiltes Verzeichnis", 0),
    ("Der größte Teil der **Ladezeit** entsteht meist beim Nachladen von Bildern und Skripten", 0),
    ("Mit **F12** im Browser seht ihr jede einzelne Anfrage mit Statuscode und Dauer", 0),
])

d.bullets("Eure Aufgabe am Rechner", [
    ("Öffnet die **Entwicklerwerkzeuge** (F12) und ladet eure Seite neu", 0),
    ("Notiert für **fünf** Anfragen: Pfad, Statuscode, Größe, Dauer", 0),
    ("Provoziert einen **404** und einen **403** und lest die Antworten", 0),
    ("Zerlegt drei URLs in **Schema, Host, Pfad und Query**", 0),
    ("Erklärt in fünf Sätzen, was zwischen **Eingabe und Anzeige** passiert", 0),
])

d.save()

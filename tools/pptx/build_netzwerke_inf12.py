#!/usr/bin/env python3
"""Informatik 12 (BGY), Woche 41 / KW 23: Exkurs - Interaktion von IT-Systemen
(Schnuppern in Wahlbereich 7)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE
from flow_diagrams import pap

d = Deck("netzwerke-schichten.pptx")
P = lambda n: os.path.join(IMG, n)

d.title("Informatik — Grundkurs 12", "Wie Systeme miteinander reden",
        "Netzwerkkomponenten und das TCP/IP-Schichtenmodell")

d.chapter(1, "Die Komponenten", "Wer verteilt was")

d.table_top("Die Geräte im Netz", [
    ["Gerät", "arbeitet auf Ebene", "tut"],
    ["Repeater / Hub", "Bitübertragung", "verstärkt und verteilt an alle"],
    ["Switch", "Sicherung (MAC)", "leitet gezielt an einen Anschluss"],
    ["Router", "Vermittlung (IP)", "verbindet verschiedene Netze"],
    ["Firewall", "meist Transport und höher", "filtert nach Regeln"],
], [180, 250, 386], [
    ("Der **Hub** schickt alles an alle — deshalb ist er praktisch verschwunden", 0),
    ("Der **Switch** merkt sich, welche MAC-Adresse an welchem Port hängt", 0),
    ("Der **Router** entscheidet anhand der **IP-Adresse**, wohin ein Paket weitergeht", 0),
], font_size=10.5, bold_cols=(0,), marks={(2, 0): TINT_GREEN, (3, 0): TINT_BLUE})

dia = pap(P("pap-schichten-inf12.png"), 1560, 330, {
    "a": dict(pos=(200, 130), w=310, h=120, text="Anwendung: HTTP, SMTP, DNS"),
    "b": dict(pos=(590, 130), w=310, h=120, text="Transport: TCP, UDP"),
    "c": dict(pos=(980, 130), w=310, h=120, text="Internet: IP"),
    "e": dict(pos=(1370, 130), w=310, h=120, text="Netzzugang: Ethernet, WLAN"),
}, [("a", "b", ""), ("b", "c", ""), ("c", "e", "")], size=28)
d.picture("Die vier Schichten von TCP/IP", dia, [
    ("Beim **Senden** geht es von links nach rechts, beim **Empfangen** zurück", 0),
    ("Jede Schicht packt ihren **Kopf** um die Daten der darüberliegenden", 0),
], width=816)

d.chapter(2, "Die Schichten", "Was auf jeder Ebene passiert")

d.table_top("Aufgaben und Adressen", [
    ["Schicht", "Aufgabe", "Adresse"],
    ["Anwendung", "Inhalt: Webseite, Mail, Namensauflösung", "URL, Mailadresse"],
    ["Transport", "Verbindung, Reihenfolge, Portzuordnung", "Portnummer"],
    ["Internet", "Weg durch fremde Netze finden", "IP-Adresse"],
    ["Netzzugang", "Bits über das Kabel oder die Luft", "MAC-Adresse"],
], [180, 380, 256], [
    ("**TCP** garantiert Reihenfolge und Vollständigkeit, **UDP** nicht — dafür ist es schneller", 0),
    ("Deshalb läuft Video oft über UDP und ein Dateidownload über TCP", 0),
], font_size=10.5, bold_cols=(0,))

d.bullets("Was beim Aufruf einer Webseite passiert", [
    ("**DNS** übersetzt den Namen in eine **IP-Adresse**", 0),
    ("**TCP** baut eine Verbindung zum Server auf, Port 443", 0),
    ("**HTTP** über TLS fordert die Seite an", 0),
    ("**IP** findet den Weg über mehrere Router", 0),
    ("**Ethernet oder WLAN** transportiert die Bits auf dem letzten Stück", 0),
])

d.chapter(3, "Im Simulator", "Filius: ein Netz selbst bauen")

d.table_top("Der Versuchsaufbau", [
    ["Schritt", "was ihr baut"],
    ["1", "Zwei Rechner an einen Switch, IP-Adressen vergeben"],
    ["2", "Ping von A nach B — läuft es?"],
    ["3", "Zweites Netz mit eigenem Switch, dazwischen ein Router"],
    ["4", "Ping über den Router — was muss dafür eingestellt sein?"],
    ["5", "Datenaustausch beobachten: welche Schicht macht was?"],
], [110, 706], [
    ("Schritt 4 scheitert fast immer an einer fehlenden **Standardgateway**-Einstellung", 0),
    ("Genau daran versteht man, was ein Router eigentlich leistet", 0),
], font_size=11, bold_cols=(0,), marks={(4, 0): TINT_ORANGE})

d.merksatz("Jede Schicht redet nur mit ihresgleichen auf der Gegenseite — "
           "und benutzt die darunter, ohne zu wissen, wie sie arbeitet.")

d.bullets("Fun Facts: Netze", [
    ("Das **ARPANET** verband 1969 vier Rechner — die erste Übertragung brach nach zwei Zeichen ab", 0),
    ("Eine **MAC-Adresse** ist weltweit eindeutig und steht fest in der Netzwerkkarte", 0),
    ("**IPv4** hat rund 4,3 Milliarden Adressen — sie sind seit Jahren vergeben", 0),
    ("**IPv6** hat so viele, dass jedes Sandkorn der Erde mehrere bekommen könnte", 0),
    ("Das **OSI-Modell** hat sieben Schichten, **TCP/IP** kommt mit vier aus — benutzt werden beide", 0),
])

d.bullets("Eure Aufgabe im Simulator", [
    ("Baut das Netz aus **Schritt 1 bis 4** in Filius auf", 0),
    ("Notiert bei Schritt 4, **welche Einstellung** gefehlt hat", 0),
    ("Ordnet fünf Begriffe (MAC, IP, Port, URL, Frame) je einer **Schicht** zu", 0),
    ("Beschreibt in fünf Sätzen, was beim **Aufruf einer Webseite** passiert", 0),
    ("Erklärt den Unterschied zwischen **Switch und Router** an eurem Aufbau", 0),
])

d.save()

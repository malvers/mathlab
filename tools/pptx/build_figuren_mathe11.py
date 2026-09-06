#!/usr/bin/env python3
"""Figuren und Koerper - Mathe 11 (BGY), KW 39, Abschluss LB 2.

Folgt den 20 Aufgaben von HTML/mathetest11-figuren.html.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from omml import MathDeck

d = MathDeck("mathe11-figuren.pptx")

d.title("Mathematik · Berufliches Gymnasium 11 · KW 39",
        "Figuren und Körper",
        "Flächen, Volumen, Oberflächen — und was passiert, wenn man alles verdoppelt")

d.bullets("Der Fahrplan dieser Woche", [
    ("**5 Stunden**, Lernbereich 2 — Stunden **16 bis 20 von 20**, damit ist **LB 2 fertig**", 0),
    ("Drei Blöcke: **ebene Figuren**, **Körper**, **Skalieren und Umstellen**", 0),
    ("Alles baut auf einer Idee auf: **Grundfläche mal Höhe**, manchmal geteilt durch drei", 0),
    ("Zum Abschluss **20 vermischte Aufgaben** im Mathe-Labor", 0),
])

# ------------------------------------------------------- Block 1: eben -----
d.chapter(1, "Ebene Figuren", "Vier Formeln, die alles andere tragen")

d.bullets("Die Grundformeln", [
    ("Rechteck: $A = a \\cdot b$, Umfang $U = 2(a + b)$", 0),
    ("Dreieck: $A = \\dfrac{g \\cdot h}{2}$ — **halbes** Rechteck", 0),
    ("Trapez: $A = \\dfrac{a + c}{2} \\cdot h$ — Mittelwert der Parallelen mal Höhe", 0),
    ("Kreis: $A = \\pi r^2$, Umfang $U = 2\\pi r$", 0),
])

d.bullets("Vom Umfang zur fehlenden Seite", [
    ("Rechteck mit $U = 24$ cm und $a = 8$ cm — wie breit ist es?", 0),
    ("$2(8 + b) = 24$, also $8 + b = 12$", 0),
    ("Damit $b = 4$ cm — **nicht** $24 - 8 = 16$", 0),
    ("Der Umfang zählt **jede Seite doppelt**, das ist die häufigste Falle", 0),
])

d.bullets("Kreis: vorwärts und rückwärts", [
    ("$r = 5$ cm gibt $A = \\pi \\cdot 25 = 25\\pi$ cm², also rund $78{,}5$ cm²", 0),
    ("Rückwärts aus $A = 36\\pi$ cm²: $r^2 = 36$, also $r = 6$ cm", 0),
    ("Erst dann der Umfang: $U = 2\\pi \\cdot 6 = 12\\pi$ cm", 0),
    ("**Immer über den Radius gehen** — er verbindet Fläche und Umfang", 0),
])

d.bullets("Dreieck, Trapez und der Kreissektor", [
    ("$g = 12$ cm, $h = 5$ cm: $A = \\dfrac{12 \\cdot 5}{2} = 30$ cm²", 0),
    ("Trapez mit $a = 8$, $c = 4$, $h = 5$: $A = \\dfrac{12}{2} \\cdot 5 = 30$ cm²", 0),
    ("Sektor mit $90^\\circ$: das ist **ein Viertel** des Kreises", 0),
    ("Bei $r = 4$ cm also $\\dfrac{16\\pi}{4} = 4\\pi$ cm²", 0),
])

d.bullets("Der Satz des Pythagoras hält alles zusammen", [
    ("Diagonale im Rechteck mit $6$ cm und $8$ cm: $\\sqrt{36 + 64} = 10$ cm", 0),
    ("Dieselbe Rechnung liefert die **Mantellinie** eines Kegels", 0),
    ("Bei $r = 3$ cm und $h = 4$ cm ist $s = \\sqrt{9 + 16} = 5$ cm", 0),
    ("$3$, $4$, $5$ und $6$, $8$, $10$ sollte man **auswendig erkennen**", 0),
])

d.merksatz("Wer den Radius hat, hat den Kreis. Alles andere folgt in einer Zeile.")

# ------------------------------------------------------ Block 2: Koerper ---
d.chapter(2, "Körper", "Grundfläche mal Höhe — und wann durch drei")

d.bullets("Die beiden Bauarten", [
    ("**Säulen** (Quader, Zylinder, Prisma): $V = G \\cdot h$", 0),
    ("**Spitzen** (Pyramide, Kegel): $V = \\dfrac{1}{3}\\,G \\cdot h$", 0),
    ("Zylinder mit $r = 3$, $h = 10$: $V = 9\\pi \\cdot 10 = 90\\pi$ cm³", 0),
    ("Kegel mit $r = 3$, $h = 4$: $V = \\dfrac{9\\pi \\cdot 4}{3} = 12\\pi$ cm³", 0),
])

d.bullets("Die Kugel steht für sich", [
    ("Volumen $V = \\dfrac{4}{3}\\pi r^3$, bei $r = 3$ cm also $36\\pi$ cm³", 0),
    ("Oberfläche $A = 4\\pi r^2$, bei $r = 2$ cm also $16\\pi$ cm²", 0),
    ("Merkhilfe: die Kugeloberfläche ist **viermal** die Kreisfläche", 0),
    ("Beide Formeln stehen in der Formelsammlung — **nachschlagen ist erlaubt**", 0),
])

d.bullets("Oberfläche heißt: alle Flächen zusammen", [
    ("Zylinder: $A = 2\\pi r(r + h)$", 0),
    ("Die Klammer verrät den Bau: $r$ für **zwei Deckel**, $h$ für den **Mantel**", 0),
    ("Ausmultipliziert: $2\\pi r^2 + 2\\pi r h$ — genau diese zwei Teile", 0),
    ("Quader $2 \\times 3 \\times 5$ cm: $2(6 + 10 + 15) = 62$ cm²", 0),
])

d.bullets("Vom Volumen zurück und in Liter", [
    ("Würfel mit $V = 64$ cm³: Kante $a = \\sqrt[3]{64} = 4$ cm", 0),
    ("Oberfläche dann $6 \\cdot 16 = 96$ cm²", 0),
    ("Würfel mit $20$ cm Kante: $V = 8000$ cm³", 0),
    ("**$1$ Liter $= 1000$ cm³**, also $8$ Liter", 0),
])

d.merksatz("Ein Liter ist ein Würfel mit zehn Zentimetern Kante. Wer das weiß, rechnet Volumen nie wieder falsch um.")

# ---------------------------------------------------- Block 3: Skalieren ---
d.chapter(3, "Verdoppeln und Umstellen", "Warum doppelt so groß viel mehr als doppelt ist")

d.bullets("Was Verdoppeln wirklich anrichtet", [
    ("Kreisradius verdoppelt: die Fläche wird **viermal** so groß", 0),
    ("Denn $A = \\pi(2r)^2 = 4\\pi r^2$ — der Faktor wird **mitquadriert**", 0),
    ("Würfelkanten verdoppelt: das Volumen wird **achtmal** so groß", 0),
    ("Regel: Länge $\\cdot k$, Fläche $\\cdot k^2$, Volumen $\\cdot k^3$", 0),
])

d.two_cols("Dieselbe Regel, zwei Blickrichtungen", [
    ("Größer werden", 0),
    ("Kante mal $3$", 1),
    ("Oberfläche mal $9$", 1),
    ("Volumen mal $27$", 1),
    ("darum kühlen große Tiere schlechter", 1),
], [
    ("Kleiner werden", 0),
    ("Kante halbiert", 1),
    ("Oberfläche ein Viertel", 1),
    ("Volumen ein Achtel", 1),
    ("darum frieren kleine Tiere schneller", 1),
])

d.bullets("Formeln nach der gesuchten Größe umstellen", [
    ("$V = \\pi r^2 h$ nach $h$: durch $\\pi r^2$ teilen", 0),
    ("Also $h = \\dfrac{V}{\\pi r^2}$", 0),
    ("Probe mit Einheiten: cm³ geteilt durch cm² ergibt cm — **passt zu einer Höhe**", 0),
    ("Die Einheitenprobe findet fast jeden Umstellfehler", 0),
])

d.bullets("Jetzt ihr", [
    ("**20 Aufgaben** im Mathe-Labor — Figuren, Körper, Umstellen", 0),
    ("Damit ist **Lernbereich 2 abgeschlossen** — das hier ist auch Wiederholung", 0),
    ("Formelsammlung liegt daneben: es geht ums **Auswählen**, nicht ums Auswendiglernen", 0),
    ("**docalvers.de/mathetest11-figuren.html**", 0),
])

d.save()

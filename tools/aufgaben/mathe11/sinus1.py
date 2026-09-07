#!/usr/bin/env python3
"""Textaufgaben Mathe 11, KW 49: Sinus am Einheitskreis, Bogenmass, Periode.
Deck: tools/pptx/build_sinus1_mathe11.py - Quiz: HTML/mathetest11-sinus1.html"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from textaufgaben import Sheet

s = Sheet("mathe11-sinus1", "Sinusfunktion und Bogenmaß", kw=49)

# ---------------------------------------------------------------- AFB I ----
s.task("Das Ventil am Fahrradreifen", 1,
       r"Ein Fahrradrad hat den Radius $35$ cm. Am Reifen sitzt das Ventil. Zu Beginn steht es genau rechts auf Höhe der Achse; wie am Einheitskreis zählen wir den Drehwinkel $x$ von dieser Stellung aus gegen den Uhrzeigersinn. Die Höhe des Ventils über der Achse ist $h = 35 \cdot \sin x$ (in cm).",
       [r"Rechne die Drehwinkel $30^\circ$, $90^\circ$ und $210^\circ$ ins Bogenmaß um.",
        r"Wie hoch über der Achse steht das Ventil bei diesen drei Winkeln?",
        r"Welchen Weg legt das Ventil bei einer Drehung um $2$ (Bogenmaß) zurück? Und bei einer vollen Umdrehung?",
        r"Nach welchem Drehwinkel steht das Ventil zum ersten Mal wieder in der Ausgangslage? Was hat das mit der Periode der Sinusfunktion zu tun?"],
       solution=[
        r"$180^\circ$ entsprechen $\pi$. Also $30^\circ = \dfrac{\pi}{6}$, $90^\circ = \dfrac{\pi}{2}$ und $210^\circ = \dfrac{210}{180}\,\pi = \dfrac{7\pi}{6}$.",
        r"$\sin \dfrac{\pi}{6} = 0{,}5$, also $h = 35 \cdot 0{,}5 = 17{,}5$ cm. $\sin \dfrac{\pi}{2} = 1$, also $h = 35$ cm, das Ventil steht ganz oben. Bei $\dfrac{7\pi}{6}$ liegt der Punkt im dritten Quadranten, $30^\circ$ unter der linken Achse: $\sin \dfrac{7\pi}{6} = -0{,}5$, also $h = -17{,}5$ cm. Das Ventil steht $17{,}5$ cm **unter** der Achse.",
        r"Im Bogenmaß ist der Winkel die Bogenlänge am Einheitskreis. Bei Radius $35$ cm wird der Bogen $35$-mal so lang: $35 \cdot 2 = 70$ cm. Eine volle Umdrehung ist der Winkel $2\pi$, also $35 \cdot 2\pi \approx 219{,}9$ cm, rund $2{,}20$ m.",
        r"Nach dem Drehwinkel $2\pi$ (einer vollen Umdrehung) ist alles wie am Anfang. Genau das sagt die Periode: $\sin(x + 2\pi) = \sin x$ für jedes $x$. Die Höhe des Ventils wiederholt sich nach jeder Umdrehung, ihr Graph ist eine Sinuskurve mit der Periode $2\pi$."],
       falle=r"Wer den Taschenrechner im Gradmodus mit $\sin \dfrac{\pi}{6}$ füttert, bekommt $\sin(0{,}52^\circ) \approx 0{,}009$ statt $0{,}5$. Vor jeder Rechnung im Bogenmaß den Modus prüfen: RAD.")

# --------------------------------------------------------------- AFB II ----
s.task("Die Schaufel am Wasserrad", 2,
       r"Ein Wasserrad hat den Radius $2$ m. Eine seiner Schaufeln steht zu Beginn rechts auf Achshöhe und läuft dann gegen den Uhrzeigersinn um. Ihre Höhe über der Achse ist $h = 2 \cdot \sin x$ (in m), $x$ ist der Drehwinkel im Bogenmaß. Das Wasser reicht bis $1$ m unter die Achse.",
       [r"Bei welchen Drehwinkeln der ersten Umdrehung ist die Schaufel ganz oben, ganz unten und genau auf Achshöhe?",
        r"Bei welchen Winkeln der ersten Umdrehung ist die Schaufel genau $1$ m über der Achse? Begründe am Einheitskreis, warum es zwei Winkel sind.",
        r"Die Schaufel ist unter Wasser, sobald sie tiefer als $1$ m unter der Achse ist. Zwischen welchen Winkeln ist das der Fall, und welcher Anteil einer Umdrehung ist das?",
        r"Das Rad macht drei Umdrehungen. Wie oft ist die Schaufel dabei genau $1$ m über der Achse? Gib alle Winkel an."],
       solution=[
        r"Ganz oben heißt $\sin x = 1$, also $x = \dfrac{\pi}{2}$ mit $h = 2$ m. Ganz unten heißt $\sin x = -1$, also $x = \dfrac{3\pi}{2}$ mit $h = -2$ m. Auf Achshöhe ist $\sin x = 0$, das gilt bei $x = 0$ und $x = \pi$ (und wieder bei $2\pi$).",
        r"$2 \cdot \sin x = 1$, also $\sin x = 0{,}5$. Am Einheitskreis gibt es in einer Umdrehung zwei Punkte mit der Höhe $0{,}5$: einen rechts, bei $x = \dfrac{\pi}{6}$, und sein Spiegelbild links, bei $x = \pi - \dfrac{\pi}{6} = \dfrac{5\pi}{6}$. Allgemein gilt $\sin(\pi - x) = \sin x$. Probe: $2 \cdot \sin \dfrac{5\pi}{6} = 2 \cdot 0{,}5 = 1$.",
        r"Unter Wasser heißt $2 \cdot \sin x < -1$, also $\sin x < -0{,}5$. Die Höhe $-0{,}5$ wird bei $\dfrac{7\pi}{6}$ und $\dfrac{11\pi}{6}$ erreicht (die Spiegelbilder von $\dfrac{\pi}{6}$ und $\dfrac{5\pi}{6}$ nach unten). Dazwischen ist die Schaufel tiefer: $\dfrac{7\pi}{6} < x < \dfrac{11\pi}{6}$. Das Intervall ist $\dfrac{4\pi}{6} = \dfrac{2\pi}{3}$ lang, bezogen auf die volle Umdrehung $2\pi$ also $\dfrac{1}{3}$: ein Drittel der Zeit ist die Schaufel unter Wasser.",
        r"Pro Umdrehung zweimal, in drei Umdrehungen also **sechsmal**. Wegen der Periode $2\pi$ entstehen die weiteren Winkel durch Addieren von $2\pi$: $\dfrac{\pi}{6}$, $\dfrac{5\pi}{6}$, $\dfrac{13\pi}{6}$, $\dfrac{17\pi}{6}$, $\dfrac{25\pi}{6}$, $\dfrac{29\pi}{6}$. Alle liegen unter $6\pi = \dfrac{36\pi}{6}$."],
       falle=r"In c) nicht Grad und Bogenmaß mischen. Der Anteil ergibt sich in beiden Systemen gleich: $\dfrac{120^\circ}{360^\circ} = \dfrac{1}{3}$ und $\dfrac{2\pi/3}{2\pi} = \dfrac{1}{3}$.")

# -------------------------------------------------------------- AFB III ----
s.task("Der Taschenrechner lügt nicht", 3,
       r"Zwei Beobachtungen aus dem Unterricht. Jonas tippt $\sin 30$ in den Taschenrechner und bekommt $-0{,}988$. Er sagt: „Der Rechner ist kaputt, $\sin 30^\circ$ ist $0{,}5$.“ Mira hat gelesen, dass für kleine $x$ die Näherung $\sin x \approx x$ gilt, und meint: „Dann kann ich den Sinus bei kleinen Winkeln einfach weglassen.“",
       [r"Erkläre Jonas' Ergebnis. In welchem Modus stand der Rechner, und was hat er tatsächlich berechnet?",
        r"Zeige mit der Periode, dass $-0{,}988$ richtig ist: Rechne $30$ (Bogenmaß) in Grad um, ziehe volle Umdrehungen ab und bestimme, in welchem Quadranten der Punkt liegt.",
        r"Prüfe Miras Näherung: Berechne $\sin x$ und den Fehler $x - \sin x$ für $x = 0{,}1$, $x = 0{,}5$ und $x = 1$ (Bogenmaß). Ab wann würdest du die Näherung nicht mehr benutzen?",
        r"Mira wendet die Näherung auf $10^\circ$ an und schreibt $\sin 10^\circ \approx 10$. Was ist falsch, und warum gilt $\sin x \approx x$ nur im Bogenmaß? Begründe am Einheitskreis."],
       solution=[
        r"Der Rechner stand im Bogenmaß (RAD). Die Eingabe $30$ ohne Gradzeichen bedeutet dort den Winkel $30$ im Bogenmaß, also einen Bogen von $30$ Längeneinheiten am Einheitskreis, fast fünf volle Umdrehungen. Dafür ist $\sin 30 \approx -0{,}988$ korrekt. Für $\sin 30^\circ = 0{,}5$ hätte Jonas in den Gradmodus schalten oder $\sin \dfrac{\pi}{6}$ eingeben müssen.",
        r"$30 \cdot \dfrac{180^\circ}{\pi} \approx 1718{,}9^\circ$. Vier volle Umdrehungen sind $1440^\circ$; es bleiben $1718{,}9^\circ - 1440^\circ = 278{,}9^\circ$. Das liegt zwischen $270^\circ$ und $360^\circ$, im vierten Quadranten, knapp nach dem tiefsten Punkt bei $270^\circ$. Dort ist der Sinus negativ und nahe $-1$. Der Wert $-0{,}988$ passt.",
        r"$\sin 0{,}1 \approx 0{,}0998$, Fehler $0{,}0002$, das sind $0{,}2\,\%$. $\sin 0{,}5 \approx 0{,}4794$, Fehler $0{,}0206$, rund $4\,\%$. $\sin 1 \approx 0{,}8415$, Fehler $0{,}1585$, rund $19\,\%$. Bis etwa $x = 0{,}3$ (das sind rund $17^\circ$) bleibt der Fehler unter $2\,\%$; für $x = 1$ ist die Näherung unbrauchbar. Die Grenze hängt davon ab, wie genau man es braucht.",
        r"Der Sinus ist nie größer als $1$, also kann $\sin 10^\circ$ nicht $10$ sein. Die Näherung verlangt den Winkel im Bogenmaß: $10^\circ = \dfrac{\pi}{18} \approx 0{,}1745$, und tatsächlich ist $\sin 0{,}1745 \approx 0{,}1736$. Am Einheitskreis ist $x$ die Bogenlänge und $\sin x$ die Höhe des Punktes. Bei kleinem Winkel steht der kurze Bogen fast senkrecht, Bogen und Höhe sind fast gleich lang. Die Gradzahl $10$ ist dagegen keine Länge, sondern eine willkürliche Einteilung, sie hat mit der Höhe nichts zu tun."],
       falle=r"$\sin 30$ ohne Gradzeichen ist im Bogenmaß gemeint. Der Rechner hat nichts falsch gemacht, die Eingabe war es.")


# ---------------------------------------------------------- numbers check ----
def check():
    from math import pi, sin, radians, degrees
    # AFB I: conversions, heights, arc lengths
    assert abs(radians(30) - pi / 6) < 1e-12 and abs(radians(90) - pi / 2) < 1e-12 and abs(radians(210) - 7 * pi / 6) < 1e-12
    assert abs(35 * sin(pi / 6) - 17.5) < 1e-9 and abs(35 * sin(pi / 2) - 35) < 1e-9 and abs(35 * sin(7 * pi / 6) + 17.5) < 1e-9
    assert 35 * 2 == 70 and abs(35 * 2 * pi - 219.9) < 0.05 and abs(35 * 2 * pi / 100 - 2.20) < 0.005
    assert abs(sin(radians(0.52)) - 0.009) < 0.0005
    # AFB II: 2 sin x = 1, under water, six solutions below 6 pi
    for x in (pi / 6, 5 * pi / 6):
        assert abs(2 * sin(x) - 1) < 1e-12
    for x in (7 * pi / 6, 11 * pi / 6):
        assert abs(2 * sin(x) + 1) < 1e-12
    assert 2 * sin(3 * pi / 2) < -1 and abs((11 * pi / 6 - 7 * pi / 6) / (2 * pi) - 1 / 3) < 1e-12
    sols = [k * pi / 6 for k in (1, 5, 13, 17, 25, 29)]
    assert all(abs(2 * sin(x) - 1) < 1e-9 for x in sols) and all(x < 6 * pi for x in sols) and len(sols) == 6
    assert abs(120 / 360 - 1 / 3) < 1e-12
    # AFB III: sin(30 rad), degrees, quadrant, approximation errors
    assert abs(sin(30) + 0.988) < 0.0005
    assert abs(degrees(30) - 1718.9) < 0.05 and abs(degrees(30) - 4 * 360 - 278.9) < 0.05 and 270 < degrees(30) - 1440 < 360
    for x, sx, err in ((0.1, 0.0998, 0.0002), (0.5, 0.4794, 0.0206), (1.0, 0.8415, 0.1585)):
        assert abs(sin(x) - sx) < 0.00005 and abs((x - sin(x)) - err) < 0.00006
    assert abs((0.1 - sin(0.1)) / sin(0.1) - 0.002) < 0.0005 and abs((0.5 - sin(0.5)) / sin(0.5) - 0.04) < 0.005
    assert abs((1 - sin(1)) / sin(1) - 0.19) < 0.002 and (0.3 - sin(0.3)) / sin(0.3) < 0.02 and abs(degrees(0.3) - 17) < 0.2
    assert abs(radians(10) - 0.1745) < 0.00005 and abs(sin(radians(10)) - 0.1736) < 0.00005


s.verify(check)
s.save()

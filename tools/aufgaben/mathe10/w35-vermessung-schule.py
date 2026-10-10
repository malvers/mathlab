#!/usr/bin/env python3
"""Aufgaben OS Mathe 10 (Realschule), Woche 35 / KW 21 (Wahlpflichtbereich 3): Vermessung rund um
die Schule – Pythagoras und Trigonometrie im Gelände, Messgenauigkeit, Präsentation. Plan: HTML/svp/mathe/mathe10.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os10

Q = os10(nr=35, slug='vermessung-schule', thema='Vermessung rund um die Schule', lb='WB 3',
         blurb='Schulgelände vermessen, Höhen mit einem und zwei Winkeln, Maßstab, Messgenauigkeit, Präsentation',
         comment='Blocks: yard and right angles (1-3, 9, 17), heights and distances (4-6, 10), scale and circles (7-8), slopes and stairs (11-12, 18-19), accuracy and presentation (13-16, 20). Results rounded to one decimal.')

Q.q(r'Ein rechteckiger Schulhof ist 60 m lang und 45 m breit. Wie lang ist seine Diagonale?',
    [r'75 m', r'105 m', r'52,5 m', r'90 m'],
    [r'$\sqrt{60^2 + 45^2} = \sqrt{3600 + 2025} = \sqrt{5625} = 75$ m'])

Q.q(r'Wie groß ist die Fläche dieses Schulhofs (60 m mal 45 m)?',
    [r'2700 m²', r'210 m²', r'105 m²', r'5625 m²'],
    [r'$60 \cdot 45 = 2700$ m²'])

Q.q(r'Ihr steckt eine Ecke ab: 6 m entlang der Mauer, 8 m entlang des Zauns und messt als Diagonale 10,2 m. Was folgt daraus?',
    [r'Der Winkel ist etwas größer als $90^\circ$.', r'Der Winkel ist genau $90^\circ$.',
     r'Der Winkel ist etwas kleiner als $90^\circ$.', r'Man kann nichts sagen.'],
    [r'Bei genau $90^\circ$ wäre die Diagonale $\sqrt{36 + 64} = 10$ m.', r'Eine längere Diagonale gehört zu einem größeren Winkel (Kosinussatz: $\cos \gamma < 0$).'])

Q.q(r'Aus 40 m Entfernung erscheint der Dachfirst der Turnhalle unter $22^\circ$. Die Augenhöhe ist 1,6 m. Wie hoch ist die Turnhalle (gerundet)?',
    [r'17,8 m', r'16,2 m', r'15,0 m', r'38,7 m'],
    [r'$40 \cdot \tan 22^\circ \approx 16{,}2$ m über Augenhöhe.', r'$16{,}2 + 1{,}6 \approx 17{,}8$ m'])

Q.q(r'Den Fuß eines Turms erreicht man nicht. Von A aus sieht man die Spitze unter $30^\circ$, nach 20 m näher heran (in B) unter $45^\circ$. Wie hoch ist der Turm über Augenhöhe (gerundet)?',
    [r'27,3 m', r'20 m', r'11,5 m', r'34,6 m'],
    [r'In B: $h = d \cdot \tan 45^\circ = d$. In A: $h = (d + 20) \cdot \tan 30^\circ$.', r'$d = 0{,}577 \cdot (d + 20)$, also $d \approx 27{,}3$ m – und damit $h \approx 27{,}3$ m.'])

Q.q(r'Um die Breite eines Teichs zu bestimmen, misst man am Ufer eine Basis AB von 50 m und die Winkel $75^\circ$ (bei A) und $65^\circ$ (bei B) zu einem Punkt C am anderen Ufer. Wie weit ist C von A entfernt (gerundet)?',
    [r'70,5 m', r'75,1 m', r'50 m', r'65,0 m'],
    [r'Winkel bei C: $180^\circ - 75^\circ - 65^\circ = 40^\circ$.', r'AC liegt dem Winkel bei B gegenüber: $AC = \dfrac{50 \cdot \sin 65^\circ}{\sin 40^\circ} \approx 70{,}5$ m.'])

Q.q(r'Das 120 m lange Schulgelände soll auf einem Plakat 60 cm lang dargestellt werden. Welcher Maßstab ist das?',
    [r'1 : 200', r'1 : 20', r'1 : 2000', r'1 : 2'],
    [r'120 m $= 12\,000$ cm.', r'$12\,000 : 60 = 200$, also 1 : 200.'])

Q.q(r'Ein kreisförmiges Beet hat einen gemessenen Umfang von 18,85 m. Wie groß ist sein Radius (gerundet)?',
    [r'3 m', r'6 m', r'9,4 m', r'2,4 m'],
    [r'$u = 2\pi r$', r'$r = \dfrac{18{,}85}{2\pi} \approx 3{,}0$ m'])

Q.q(r'Ein Grundstück wird zerlegt in ein Rechteck von 20 m mal 15 m und ein Dreieck mit der Grundseite 20 m und der Höhe 8 m. Wie groß ist es?',
    [r'380 m²', r'460 m²', r'300 m²', r'340 m²'],
    [r'Rechteck: $300$ m², Dreieck: $\dfrac{20 \cdot 8}{2} = 80$ m².', r'Zusammen $380$ m²'])

Q.q(r'Eine 1,80 m große Person wirft einen 2,40 m langen Schatten, der Fahnenmast gleichzeitig einen 16 m langen. Wie hoch ist der Mast?',
    [r'12 m', r'21,3 m', r'14,4 m', r'19,2 m'],
    [r'$\dfrac{h}{16} = \dfrac{1{,}8}{2{,}4} = 0{,}75$', r'$h = 16 \cdot 0{,}75 = 12$ m'])

Q.q(r'Eine Rampe am Schuleingang steigt auf 3 m waagerechter Länge um 0,25 m. Wie groß ist ihre Steigung (gerundet)?',
    [r'8,3 %', r'25 %', r'12 %', r'0,8 %'],
    [r'$\dfrac{0{,}25}{3} \approx 0{,}083 = 8{,}3\,\%$'])

Q.q(r'Wie groß ist der Steigungswinkel dieser Rampe (0,25 m auf 3 m waagerecht, gerundet)?',
    [r'$4{,}8^\circ$', r'$8{,}3^\circ$', r'$85{,}2^\circ$', r'$14{,}5^\circ$'],
    [r'$\tan \alpha = \dfrac{0{,}25}{3}$', r'$\alpha \approx 4{,}8^\circ$'])

Q.q(r'Die Messwerte sind auf 0,1 m genau, der Taschenrechner zeigt 17,7634 m. Wie gibt man das Ergebnis sinnvoll an?',
    [r'17,8 m', r'17,7634 m', r'17,76 m', r'20 m'],
    [r'Ein Ergebnis kann nicht genauer sein als die Messwerte, aus denen es berechnet wurde.'])

Q.q(r'Vier Gruppen messen dieselbe Strecke: 12,4 m, 12,6 m, 12,5 m und 12,9 m. Welcher Mittelwert ergibt sich?',
    [r'12,6 m', r'12,5 m', r'12,9 m', r'50,4 m'],
    [r'$\dfrac{12{,}4 + 12{,}6 + 12{,}5 + 12{,}9}{4} = \dfrac{50{,}4}{4} = 12{,}6$ m'])

Q.q(r'Die Messwerte einer Strecke lauten 12,4 m, 12,6 m, 12,5 m und 15,0 m. Was ist zu tun?',
    [r'Den Wert 15,0 m prüfen und die Messung wiederholen.', r'Alle Werte addieren.',
     r'Nur den größten Wert verwenden.', r'Den Mittelwert ohne Nachdenken angeben.'],
    [r'15,0 m weicht stark von den anderen ab – ein Ausreißer, vermutlich ein Messfehler.'])

Q.q(r'Ein Sandkasten ist 4 m lang, 3 m breit und soll 40 cm hoch mit Sand gefüllt werden. Wie viel Sand braucht man?',
    [r'4,8 m³', r'48 m³', r'480 m³', r'0,48 m³'],
    [r'40 cm $= 0{,}4$ m.', r'$4 \cdot 3 \cdot 0{,}4 = 4{,}8$ m³'])

Q.q(r'Ein Fußballfeld ist 105 m lang und 68 m breit. Wie lang ist die Diagonale (gerundet)?',
    [r'125,1 m', r'173 m', r'86,5 m', r'115,3 m'],
    [r'$\sqrt{105^2 + 68^2} = \sqrt{11\,025 + 4624} = \sqrt{15\,649} \approx 125{,}1$ m'])

Q.q(r'Eine Treppe hat 15 Stufen mit je 17 cm Höhe. Welchen Höhenunterschied überwindet sie?',
    [r'2,55 m', r'25,5 m', r'1,70 m', r'32 cm'],
    [r'$15 \cdot 17 = 255$ cm $= 2{,}55$ m'])

Q.q(r'Jede Stufe ist 17 cm hoch und 29 cm tief. Wie steil ist die Treppe (Winkel gegen die Waagerechte, gerundet)?',
    [r'$30{,}4^\circ$', r'$59{,}6^\circ$', r'$36{,}0^\circ$', r'$17^\circ$'],
    [r'$\tan \alpha = \dfrac{17}{29}$', r'$\alpha \approx 30{,}4^\circ$'])

Q.q(r'Was gehört in die Präsentation einer Vermessung?',
    [r'Skizze, Messwerte, Rechenweg und Ergebnis mit Einheit', r'nur das Endergebnis',
     r'nur Fotos vom Gelände', r'nur die Rechnung ohne Einheiten'],
    [r'Andere sollen nachvollziehen können, was gemessen und wie gerechnet wurde.', r'Das Ergebnis mit sinnvoller Genauigkeit und Einheit angeben.'])


def check():
    from math import sqrt, tan, sin, atan, pi, radians as r, degrees as d
    R = lambda x, n=1: round(x, n)
    assert sqrt(60 ** 2 + 45 ** 2) == 75 and 60 * 45 == 2700 and sqrt(36 + 64) == 10
    assert R(40 * tan(r(22))) == 16.2 and R(40 * tan(r(22)) + 1.6) == 17.8
    t = tan(r(30))
    dd = 20 * t / (1 - t)
    assert R(dd) == 27.3 and R(dd * tan(r(45))) == 27.3
    assert R(50 * sin(r(65)) / sin(r(40))) == 70.5 and R(50 * sin(r(75)) / sin(r(40))) == 75.1
    assert 12000 / 60 == 200 and R(18.85 / (2 * pi)) == 3.0 and 20 * 15 + 20 * 8 / 2 == 380 and 16 * 1.8 / 2.4 == 12
    assert R(0.25 / 3 * 100) == 8.3 and R(d(atan(0.25 / 3))) == 4.8
    assert R((12.4 + 12.6 + 12.5 + 12.9) / 4) == 12.6 and R(4 * 3 * 0.4) == 4.8
    assert R(sqrt(105 ** 2 + 68 ** 2)) == 125.1 and 15 * 17 == 255 and R(d(atan(17 / 29))) == 30.4


Q.verify(check)
Q.save()

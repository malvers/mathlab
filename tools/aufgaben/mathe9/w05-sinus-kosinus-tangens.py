#!/usr/bin/env python3
"""Aufgaben OS Mathe 9 (Realschule), Woche 5 / KW 38 (LB 1): Sinus, Kosinus und Tangens
als Seitenverhältnisse im rechtwinkligen Dreieck. Plan: HTML/svp/mathe/mathe9.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os9

Q = os9(nr=5, slug='sinus-kosinus-tangens', thema='Sinus, Kosinus und Tangens', lb='LB 1',
        blurb='Gegenkathete, Ankathete, Hypotenuse, Seitenverhältnisse, Werte mit dem Taschenrechner',
        comment='Calculator in DEG mode, values rounded. Blocks: names of sides (1, 16), definitions (2-4, 8), ratios in a 3-4-5 and 5-12-13 triangle (5-7, 19), special values and range (9-12, 17, 20), calculator (13-15), slope (18).')

# --------------------------------------------------------------- Begriffe ----
Q.q(r'Was ist im rechtwinkligen Dreieck die Gegenkathete des Winkels $\alpha$?',
    [r'die Kathete, die $\alpha$ gegenüberliegt', r'die Kathete, die an $\alpha$ anliegt', r'die Hypotenuse', r'die längste Kathete'],
    [r'Gegenkathete: liegt dem Winkel gegenüber.',
     r'Ankathete: Kathete, die einen Schenkel des Winkels bildet.'])

Q.q(r'Wie ist $\sin \alpha$ im rechtwinkligen Dreieck definiert?',
    [r'$\dfrac{\text{Gegenkathete}}{\text{Hypotenuse}}$', r'$\dfrac{\text{Ankathete}}{\text{Hypotenuse}}$',
     r'$\dfrac{\text{Gegenkathete}}{\text{Ankathete}}$', r'$\dfrac{\text{Hypotenuse}}{\text{Gegenkathete}}$'],
    [r'Sinus: Gegenkathete durch Hypotenuse.'])

Q.q(r'Wie ist $\cos \alpha$ definiert?',
    [r'$\dfrac{\text{Ankathete}}{\text{Hypotenuse}}$', r'$\dfrac{\text{Gegenkathete}}{\text{Hypotenuse}}$',
     r'$\dfrac{\text{Ankathete}}{\text{Gegenkathete}}$', r'$\dfrac{\text{Hypotenuse}}{\text{Ankathete}}$'],
    [r'Kosinus: Ankathete durch Hypotenuse.'])

Q.q(r'Wie ist $\tan \alpha$ definiert?',
    [r'$\dfrac{\text{Gegenkathete}}{\text{Ankathete}}$', r'$\dfrac{\text{Ankathete}}{\text{Gegenkathete}}$',
     r'$\dfrac{\text{Gegenkathete}}{\text{Hypotenuse}}$', r'$\dfrac{\text{Ankathete}}{\text{Hypotenuse}}$'],
    [r'Tangens: Gegenkathete durch Ankathete.',
     r'Der Tangens kommt ohne Hypotenuse aus.'])

# ------------------------------------------------------- Seitenverhältnisse ----
Q.q(r'Ein rechtwinkliges Dreieck hat die Katheten 3 cm und 4 cm und die Hypotenuse 5 cm. $\alpha$ liegt der Seite mit 3 cm gegenüber. Wie groß ist $\sin \alpha$?',
    [r'0,6', r'0,8', r'0,75', r'1,33'],
    [r'$\sin \alpha = \dfrac{3}{5} = 0{,}6$'])

Q.q(r'Wie groß ist im selben Dreieck $\cos \alpha$?',
    [r'0,8', r'0,6', r'0,75', r'1,25'],
    [r'Ankathete von $\alpha$ ist die Seite mit 4 cm.',
     r'$\cos \alpha = \dfrac{4}{5} = 0{,}8$'])

Q.q(r'Wie groß ist im selben Dreieck $\tan \alpha$?',
    [r'0,75', r'1,33', r'0,6', r'0,8'],
    [r'$\tan \alpha = \dfrac{3}{4} = 0{,}75$'])

Q.q(r'Warum hängen $\sin \alpha$, $\cos \alpha$ und $\tan \alpha$ nur vom Winkel ab, nicht von der Größe des Dreiecks?',
    [r'Rechtwinklige Dreiecke mit gleichem $\alpha$ sind ähnlich, ihre Seitenverhältnisse sind gleich.',
     r'Weil alle rechtwinkligen Dreiecke gleich groß sind.',
     r'Weil die Hypotenuse immer 1 ist.',
     r'Das stimmt nicht, sie hängen von der Größe ab.'],
    [r'Gleiche Winkel ergeben nach dem Hauptähnlichkeitssatz ähnliche Dreiecke.',
     r'Bei ähnlichen Dreiecken sind die Verhältnisse entsprechender Seiten gleich.'])

# --------------------------------------------------------- besondere Werte ----
Q.q(r'Wie groß ist $\sin 30^\circ$?',
    [r'0,5', r'0,866', r'0,577', r'30'],
    [r'Im halben gleichseitigen Dreieck liegt dem $30^\circ$-Winkel die halbe Seite gegenüber.',
     r'$\sin 30^\circ = \dfrac{a/2}{a} = 0{,}5$'])

Q.q(r'Wie groß ist $\cos 60^\circ$?',
    [r'0,5', r'0,866', r'1,732', r'60'],
    [r'Im halben gleichseitigen Dreieck liegt am $60^\circ$-Winkel die halbe Seite an.',
     r'$\cos 60^\circ = 0{,}5$'])

Q.q(r'Wie groß ist $\tan 45^\circ$?',
    [r'1', r'0,707', r'0', r'45'],
    [r'Bei $45^\circ$ ist das Dreieck gleichschenklig-rechtwinklig.',
     r'Gegenkathete und Ankathete sind gleich lang: $\tan 45^\circ = 1$.'])

Q.q(r'Zwischen welchen Werten liegt $\sin \alpha$ für einen spitzen Winkel $\alpha$ im rechtwinkligen Dreieck?',
    [r'zwischen 0 und 1', r'zwischen 0 und 90', r'zwischen −1 und 0', r'zwischen 1 und 2'],
    [r'Die Gegenkathete ist immer kürzer als die Hypotenuse.',
     r'Deshalb ist der Quotient größer als 0 und kleiner als 1.'])

# ------------------------------------------------------------ Taschenrechner ----
Q.q(r'Der Taschenrechner zeigt für $\sin 30$ den Wert −0,988. Woran liegt das?',
    [r'Er steht im Bogenmaß (RAD) statt in Grad (DEG).', r'$\sin 30^\circ$ ist negativ.',
     r'Der Taschenrechner ist kaputt.', r'Man muss $\sin 30$ durch 100 teilen.'],
    [r'Im Bogenmaß bedeutet 30 einen ganz anderen Winkel.',
     r'In der Einstellung DEG erhält man $\sin 30^\circ = 0{,}5$.'])

Q.q(r'Wie groß ist $\sin 25^\circ$ (auf drei Nachkommastellen)?',
    [r'0,423', r'0,906', r'0,466', r'0,250'],
    [r'Taschenrechner in DEG: $\sin 25^\circ \approx 0{,}4226$',
     r'Gerundet 0,423.'])

Q.q(r'Wie groß ist $\tan 70^\circ$ (auf drei Nachkommastellen)?',
    [r'2,747', r'0,364', r'0,940', r'0,342'],
    [r'$\tan 70^\circ \approx 2{,}7475$',
     r'Für große Winkel wird der Tangens größer als 1.'])

Q.q(r'Im rechtwinkligen Dreieck mit dem rechten Winkel bei $C$ ist $b$ die Gegenkathete von $\beta$. Was ist $b$ für den Winkel $\alpha$?',
    [r'die Ankathete von $\alpha$', r'die Gegenkathete von $\alpha$', r'die Hypotenuse', r'keine Seite des Dreiecks'],
    [r'$\beta$ liegt $b$ gegenüber; $b$ liegt an $\alpha$ an.',
     r'Deshalb gilt $\sin \beta = \cos \alpha$.'])

Q.q(r'Welche Gleichung stimmt?',
    [r'$\sin 40^\circ = \cos 50^\circ$', r'$\sin 40^\circ = \sin 50^\circ$', r'$\sin 40^\circ = \tan 40^\circ$', r'$\cos 40^\circ = \cos 50^\circ$'],
    [r'$40^\circ + 50^\circ = 90^\circ$: Die beiden spitzen Winkel eines rechtwinkligen Dreiecks.',
     r'Die Gegenkathete des einen ist die Ankathete des anderen.'])

Q.q(r'Eine Straße hat 12 % Steigung, also $\tan \alpha = 0{,}12$. Wie groß ist der Steigungswinkel (gerundet)?',
    [r'$6{,}84^\circ$', r'$12^\circ$', r'$83{,}16^\circ$', r'$0{,}12^\circ$'],
    [r'$\alpha = \tan^{-1}(0{,}12)$',
     r'$\alpha \approx 6{,}84^\circ$'])

Q.q(r'Ein Dreieck hat die Katheten 5 cm und 12 cm. Wie groß ist der Tangens des Winkels, der der 12-cm-Seite gegenüberliegt?',
    [r'2,4', r'0,417', r'0,923', r'0,385'],
    [r'Gegenkathete 12 cm, Ankathete 5 cm.',
     r'$\tan = \dfrac{12}{5} = 2{,}4$'])

Q.q(r'Was passiert mit $\sin \alpha$, wenn der spitze Winkel $\alpha$ größer wird?',
    [r'$\sin \alpha$ wird größer.', r'$\sin \alpha$ wird kleiner.', r'$\sin \alpha$ bleibt gleich.', r'$\sin \alpha$ wird negativ.'],
    [r'Bei gleicher Hypotenuse wird die Gegenkathete länger, wenn $\alpha$ wächst.',
     r'Beispiel: $\sin 30^\circ = 0{,}5$, $\sin 60^\circ \approx 0{,}866$.'])


def check():
    from math import sin, cos, tan, radians as r, degrees, atan, isclose
    assert 3 / 5 == 0.6 and 4 / 5 == 0.8 and 3 / 4 == 0.75
    assert isclose(sin(r(30)), 0.5) and isclose(cos(r(60)), 0.5) and isclose(tan(r(45)), 1)
    assert round(sin(30), 3) == -0.988
    assert round(sin(r(25)), 3) == 0.423 and round(tan(r(70)), 3) == 2.747
    assert isclose(sin(r(40)), cos(r(50)))
    assert round(degrees(atan(0.12)), 2) == 6.84
    assert 12 / 5 == 2.4 and sin(r(60)) > sin(r(30))


Q.verify(check)
Q.save()
